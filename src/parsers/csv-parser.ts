import Papa from "papaparse";
import { CsvErrorResponse, CsvResponse } from "../types/csv.response.ts";
import { CsvUnexpectedError, SpecificCsvError } from "../types/csv.errors.ts";
import {
    validateDataRows,
    validateHeaders,
    validateQuoteBalance,
} from "../utils/csv-utilities.ts";
import { csvEmptyFileError } from "../constants/csv-custom-errors.ts";
import { transformPapaParseError } from "../adapters/papaparse.adapter.ts";
import { sortCsvErrorsByPriority } from "../utils/csv-error-priority.ts";
import { CsvParsedFileMeta } from "../types/meta.ts";
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.ts";
import { analyzeCsvFile } from "./csv-parser-orchestration.ts";

/**
 * Parses a CSV file from a file path or a raw string content.
 *
 * This function serves as the primary entry point for CSV parsing. It orchestrates
 * file reading, validation, and metadata generation. It returns a discriminated union
 * `CsvResponse` which is either a `CsvValidResponse` on success or a `CsvErrorResponse`
 * on failure.
 *
 * Even on failure, a `meta` object is attached to the response to provide
 * as much diagnostic context as possible.
 *
 * @param data - The raw CSV string content. To be used if `filePath` is not provided.
 * @param filePath - The path to the CSV file. If provided, it takes precedence over `data`.
 * @returns A promise that resolves to a `CsvResponse` object.
 *
 * @example
 * // --- Parsing from a file path ---
 * const response = await parseCSV(undefined, './data/my-file.csv');
 * if (response.success) {
 *   console.log("Parsed Data:", response.data);
 *   console.log("Eligibility:", response.meta.eligibleForConversion);
 * } else {
 *   console.error("Parsing Failed:", response.message);
 *   console.log("Error Codes:", response.meta.diagnostics?.errorCodes);
 * }
 *
 * @example
 * // --- Parsing from a string ---
 * const csvString = `id,name\n1,Alice\n2,Bob`;
 * const responseFromString = await parseCSV(csvString);
 * if (responseFromString.success) {
 *   console.log(responseFromString.data);
 * }
 */
export default async function parseCSV(
    data?: string,
    filePath?: string
): Promise<CsvResponse> {
    const customErrors: SpecificCsvError[] = [];
    const fileResponse = analyzeCsvFile(filePath ?? "");
    const csv = filePath ? (await fileResponse)?.content : (data ?? "");
    customErrors.push(
        ...((await fileResponse).diagnostics as SpecificCsvError[])
    );

    // check for empty files
    if (csv.trim().length === 0) customErrors.push(csvEmptyFileError);
    try {
        const result = Papa.parse(csv, {
            dynamicTyping: true,
            header: true,
            comments: "#",
        });

        const { meta, data } = result;
        const fields = meta?.fields ?? [];

        // Validation flags
        const validationFlags = {
            hasHeaders: fields.length > 0,
            hasBalancedQuotes: true, // will be updated below
            hasValidRows: Array.isArray(data) && data.length > 0,
            hasCommentLines: csv.includes("#"),
            hasEmptyLines: csv.split("\n").some((line) => line.trim() === ""),
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
                source: filePath ?? "",
                result,
                validationFlags,
                encoding: (await fileResponse).encoding,
                diagnostics: {
                    warnings: customErrors.map((e) => e.message),
                    errorCodes: customErrors.map((e) => e.code),
                },
            });

        if (customErrors.length === 0) {
            const customResult: CsvResponse = {
                meta: parsedMeta,
                data,
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
                filePath ?? "",
                [],
                0
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
