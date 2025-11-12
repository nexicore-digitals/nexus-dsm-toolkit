import Papa from "papaparse";
import type { CsvErrorResponse, CsvResponse } from "../types/csv.response.js";
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
import { CsvParsedFileMeta } from "../types/meta.js";
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.js";

/**
 * Parses a CSV or TSV string, validates its structure, and returns a detailed response.
 *
 * This function serves as the core CSV parsing engine. It returns a discriminated
 * union `CsvResponse` which is either a `CsvValidResponse` on success or a
 * `CsvErrorResponse` on failure.
 *
 * Even on failure, a `meta` object is attached to the response to provide
 * as much diagnostic context as possible.
 *
 * @param csv - The raw CSV string content.
 * @param source - An optional identifier for the data source (e.g., a filename or URL).
 * @returns A promise that resolves to a `CsvResponse` object.
 *
 * @example
 * const csvString = `id,name\n1,Alice\n2,Bob`;
 * const response = await parseCSV(csvString);
 * if (response.success) {
 *   logger.info("Parsed Data:", response.data);
 *   logger.info("Eligibility:", response.meta.eligibleForConversion);
 * } else {
 *   console.error("Parsing Failed:", response.message);
 *   logger.info("Error Details:", response.meta.diagnostics);
 * }
 */
export default async function parseCSV(
    csv: string,
    source: string = "Unknown"
): Promise<CsvResponse> {
    const customErrors: SpecificCsvError[] = [];

    if (csv.trim().length === 0) {
        customErrors.push(csvEmptyFileError);
        // Immediately return an error response for an empty file
        return createErrorResponse(customErrors, source);
    }
    // check for empty files
    try {
        const result = Papa.parse(csv, {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
            comments: "#",
        });

        const { meta, data } = result;
        const fields = meta?.fields ?? [];

        // Validation flags
        const nonEmptyLines = csv
            .split("\n")
            .filter((line) => line.trim() !== "").length;
        const hasDataRows = nonEmptyLines > 1;

        const validationFlags = {
            hasHeaders: fields.length > 0,
            hasBalancedQuotes: true, // will be updated below
            hasValidRows: hasDataRows,
            hasCommentLines: csv.includes("#"),
            hasEmptyLines: /\n\s*\n/.test(csv),
        };

        /* papaparse merged it's result.meta.errors into result.errors */

        if (fields) {
            // check for invalid headers
            const invalidHeadersError = validateHeaders(fields);
            if (invalidHeadersError) {
                customErrors.push(invalidHeadersError);
                validationFlags.hasHeaders = false;
            }

            if (data) {
                // check for invalid data rows
                const invalidDataRows = validateDataRows(
                    data as object[],
                    fields
                );
                if (invalidDataRows) customErrors.push(invalidDataRows);

                // custom extra check for inbalanced quotes
                customErrors.push(
                    ...validateQuoteBalance(result.data as object[])
                );
                if (customErrors.map((e) => e.code).includes("MissingQuotes")) {
                    validationFlags.hasBalancedQuotes = false;
                }
            }
        }

        if (Array.isArray(result.errors)) {
            result.errors.forEach((error) => {
                customErrors.push(transformPapaParseError(error));
            });
        }

        // Build metadata
        const parsedMeta: CsvParsedFileMeta =
            ParsedFileMetaBuilder.fromPapaResult({
                result,
                source,
                validationFlags: {
                    ...validationFlags,
                    hasValidRows:
                        data.length > 0 && validationFlags.hasValidRows,
                },
                diagnostics: {
                    warnings: customErrors.map((e) => e.message),
                    errorCodes: customErrors.map((e) => e.code),
                },
            });

        if (customErrors.length === 0) {
            const customResult: CsvResponse = {
                meta: parsedMeta,
                data: data,
                success: true,
            };
            return customResult;
        } else {
            const sortedErrors = sortCsvErrorsByPriority(customErrors);
            const primaryError = sortedErrors[0]; // Get the first error for the main message

            const errorResponse: CsvErrorResponse = {
                // Use CsvErrorResponse interface
                success: false,
                meta: parsedMeta,
                name: primaryError.name,
                message: primaryError.message,
                type: primaryError.type,
                code: primaryError.code,
                detailedErrors: customErrors, // Include all collected errors
            };
            return errorResponse;
        }
    } catch (error) {
        const originalError =
            error instanceof Error ? error : new Error(String(error));
        if (!customErrors.some((e) => e.code === "UnknownError")) {
            customErrors.push({
                name: "CSVUnexpectedError",
                type: "UnexpectedError",
                code: "UnknownError",
                message: `An unexpected error occurred: ${originalError.message}`,
                // Add other properties if available, like row/index if it's a parse error
            } as CsvUnexpectedError);
        }
        if (customErrors.length > 0) {
            // <--- This is the key condition
            const sortedErrors = sortCsvErrorsByPriority(customErrors);
            return {
                name: sortedErrors[0].name,
                success: false,
                detailedErrors: sortedErrors,
                type: sortedErrors[0].type,
                code: sortedErrors[0].code,
                message: sortedErrors[0].message,
            }; // Returns failure
        } else {
            const parsedMeta: CsvParsedFileMeta = ParsedFileMetaBuilder.init(
                source,
                [],
                0,
                "csv" // Default to 'csv' in this fallback case
            )
                .withCsvFlags({
                    hasHeaders: false,
                    hasBalancedQuotes: false,
                    hasValidRows: false,
                })
                .buildCsv();

            return { success: true, data: [], meta: parsedMeta }; // Only returns success if NO errors were detected
        }
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

    return { ...primaryError, success: false, meta, detailedErrors: errors };
}
