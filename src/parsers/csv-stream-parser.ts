import Papa from "papaparse";
import { Readable } from "stream";
import type { CsvResponse, CsvErrorResponse } from "../types/csv.response.js";
import type {
    CsvUnexpectedError,
    SpecificCsvError,
} from "../types/csv.errors.js";
import {
    validateDataRows,
    validateHeaders,
    validateQuoteBalance,
} from "../utils/csv-utilities.js";
import { csvEmptyFileError } from "../constants/csv-custom-errors.js";
import { transformPapaParseError } from "../adapters/papaparse.adapter.js";
import { sortCsvErrorsByPriority } from "../utils/csv-error-priority.js";
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.js";

/**
 * Converts a Node.js Readable stream to a string.
 */
function streamToString(stream: Readable, encoding = "utf-8"): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on("error", reject);
        stream.on("end", () =>
            resolve(Buffer.concat(chunks).toString(encoding as BufferEncoding))
        );
    });
}

/**
 * Parses a CSV/TSV stream and applies full validation logic.
 */
export async function parseCsvStream(
    stream: Readable,
    source = "stream-input",
    encoding = "utf-8"
): Promise<CsvResponse> {
    const customErrors: SpecificCsvError[] = [];

    try {
        const csv = await streamToString(stream, encoding);

        if (csv.trim().length === 0) {
            customErrors.push(csvEmptyFileError);
            return createErrorResponse(customErrors, source);
        }

        const result = Papa.parse(csv, {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
            comments: "#",
        });

        const { meta, data } = result;
        const fields = meta?.fields ?? [];

        const nonEmptyLines = csv
            .split("\n")
            .filter((line) => line.trim() !== "").length;
        const hasDataRows = nonEmptyLines > 1;

        const validationFlags = {
            hasHeaders: fields.length > 0,
            hasBalancedQuotes: true,
            hasValidRows: hasDataRows,
            hasCommentLines: csv.includes("#"),
            hasEmptyLines: /\n\s*\n/.test(csv),
        };

        if (fields.length > 0) {
            const invalidHeadersError = validateHeaders(fields);
            if (invalidHeadersError) {
                customErrors.push(invalidHeadersError);
                validationFlags.hasHeaders = false;
            }

            if (data) {
                const invalidDataRows = validateDataRows(
                    data as object[],
                    fields
                );
                if (invalidDataRows) customErrors.push(invalidDataRows);

                const quoteErrors = validateQuoteBalance(data as object[]);
                customErrors.push(...quoteErrors);
                if (quoteErrors.some((e) => e.code === "MissingQuotes")) {
                    validationFlags.hasBalancedQuotes = false;
                }
            }
        }

        if (Array.isArray(result.errors)) {
            result.errors.forEach((error) => {
                customErrors.push(transformPapaParseError(error));
            });
        }

        const parsedMeta = ParsedFileMetaBuilder.fromPapaResult({
            result,
            source,
            validationFlags: {
                ...validationFlags,
                hasValidRows: data.length > 0 && validationFlags.hasValidRows,
            },
            diagnostics: {
                warnings: customErrors.map((e) => e.message),
                errorCodes: customErrors.map((e) => e.code),
            },
        });

        if (customErrors.length === 0) {
            return {
                success: true,
                data,
                meta: parsedMeta,
            };
        } else {
            const sortedErrors = sortCsvErrorsByPriority(customErrors);
            const primaryError = sortedErrors[0];
            return {
                success: false,
                meta: parsedMeta,
                name: primaryError.name,
                message: primaryError.message,
                type: primaryError.type,
                code: primaryError.code,
                detailedErrors: sortedErrors,
            };
        }
    } catch (error) {
        const originalError =
            error instanceof Error ? error : new Error(String(error));
        customErrors.push({
            name: "CSVUnexpectedError",
            type: "UnexpectedError",
            code: "UnknownError",
            message: `An unexpected error occurred: ${originalError.message}`,
        } as CsvUnexpectedError);

        const sortedErrors = sortCsvErrorsByPriority(customErrors);
        return {
            name: sortedErrors[0].name,
            success: false,
            detailedErrors: sortedErrors,
            type: sortedErrors[0].type,
            code: sortedErrors[0].code,
            message: sortedErrors[0].message,
        };
    }
}

function createErrorResponse(
    errors: SpecificCsvError[],
    source: string
): CsvErrorResponse {
    const sortedErrors = sortCsvErrorsByPriority(errors);
    const primaryError = sortedErrors[0];

    const meta = ParsedFileMetaBuilder.init(source, [], 0, "csv")
        .withCsvFlags({
            hasHeaders: false,
            hasBalancedQuotes: false,
            hasValidRows: false,
            hasCommentLines: false,
            hasEmptyLines: true,
        })
        .withCsvExtras({ delimiter: ",", encoding: "" })
        .withDiagnostics({ errorCodes: errors.map((e) => e.code) })
        .buildCsv();

    return {
        ...primaryError,
        success: false,
        meta,
        detailedErrors: sortedErrors,
    };
}
