/**
 * @file Provides a stream-based CSV/TSV parser for large files.
 * @author Owen
 */

import Papa from "papaparse";
import type { CsvErrorResponse, CsvResponse } from "../types/csv.response.js";
import type { SpecificCsvError } from "../types/csv.errors.js";
import { transformPapaParseError } from "../adapters/papaparse.adapter.js";
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.js";
import { sortCsvErrorsByPriority } from "../utils/csv-error-priority.js";
import {
    csvEnvironmentError,
    csvEmptyFileError,
} from "../constants/csv-custom-errors.js";
import {
    validateHeaders,
    validateDataRows,
    validateQuoteBalance,
} from "../utils/csv-utilities.js";
import { Readable } from "stream"; // Node.js stream

/**
 * Parses a CSV or TSV ReadableStream, validates its structure, and returns a detailed response.
 * This function is designed for streaming large CSV/TSV files without loading the entire content into memory.
 *
 * @param stream - The Node.js ReadableStream of the CSV/TSV content.
 * @param source - An optional identifier for the data source (e.g., a filename or URL).
 * @returns A promise that resolves to a `CsvResponse` object.
 */
export async function parseCsvStream(
    stream: Readable,
    source: string = "stream-input",
    encoding: string = "utf-8" // Accept encoding as a parameter
): Promise<CsvResponse> {
    if (typeof window !== "undefined") {
        return {
            ...csvEnvironmentError,
            success: false,
            detailedErrors: [csvEnvironmentError],
        };
    }

    const customErrors: SpecificCsvError[] = [];
    const parsedData: object[] = [];

    return new Promise((resolve) => {
        Papa.parse(stream, {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
            comments: "#",
            // Using step to process data as it comes in
            step: (row) => {
                if (row.data) {
                    parsedData.push(row.data);
                }
                if (row.errors && row.errors.length > 0) {
                    row.errors.forEach((error) => {
                        customErrors.push(transformPapaParseError(error));
                    });
                }
            },
            // Complete is called when parsing finishes
            complete: (results) => {
                const fields = results.meta?.fields ?? [];

                // Basic validation flags
                const validationFlags = {
                    hasHeaders: fields.length > 0,
                    hasBalancedQuotes: true, // Will be updated by validateQuoteBalance
                    hasValidRows: parsedData.length > 0,
                    hasCommentLines: false, // Cannot easily detect with streaming PapaParse
                    hasEmptyLines: false, // Cannot easily detect with streaming PapaParse
                };

                // Perform validations on collected data
                if (fields.length > 0) {
                    const invalidHeadersError = validateHeaders(fields);
                    if (invalidHeadersError) {
                        customErrors.push(invalidHeadersError);
                        validationFlags.hasHeaders = false;
                    }

                    const invalidDataRows = validateDataRows(
                        parsedData,
                        fields
                    );
                    if (invalidDataRows) customErrors.push(invalidDataRows);

                    const quoteErrors = validateQuoteBalance(parsedData);
                    if (quoteErrors.length > 0) {
                        customErrors.push(...quoteErrors);
                        validationFlags.hasBalancedQuotes = false;
                    }
                } else if (parsedData.length > 0) {
                    // If no headers but data exists, it's likely a malformed file
                    customErrors.push(csvEmptyFileError); // Or a more specific "no headers but data" error
                }

                // Build metadata
                const metaBuilder = ParsedFileMetaBuilder.init(
                    source,
                    fields,
                    parsedData.length,
                    results.meta?.delimiter === "\t" ? "tsv" : "csv"
                )
                    .withCsvFlags(validationFlags)
                    .withCsvExtras({
                        delimiter: results.meta?.delimiter ?? ",",
                        encoding: encoding, // Use the provided encoding
                    })
                    .withDiagnostics({
                        warnings: customErrors.map((e) => e.message),
                        errorCodes: customErrors.map((e) => e.code),
                    });

                const finalMeta = metaBuilder.buildCsv();

                if (customErrors.length === 0) {
                    resolve({
                        success: true,
                        data: parsedData,
                        meta: finalMeta,
                    });
                    stream.destroy(); // Destroy the source stream on success
                } else {
                    const errorResponse = createErrorResponse(
                        customErrors,
                        source
                    );
                    errorResponse.meta = finalMeta; // Attach the generated meta
                    stream.destroy(); // Destroy the source stream
                    resolve(errorResponse);
                }
            },
            error: () => {
                const sortedErrors = sortCsvErrorsByPriority(customErrors);
                const primaryError = sortedErrors[0];

                // Attempt to build meta even on early stream error
                const fallbackMeta = ParsedFileMetaBuilder.init(
                    source,
                    [],
                    0,
                    "csv"
                )
                    .withCsvFlags({
                        hasHeaders: false,
                        hasBalancedQuotes: false,
                        hasValidRows: false,
                    })
                    .withCsvExtras({ delimiter: ",", encoding: "utf8" })
                    .withDiagnostics({
                        errorCodes: customErrors.map((e) => e.code),
                    })
                    .buildCsv();

                resolve({
                    success: false,
                    meta: fallbackMeta,
                    name: primaryError.name,
                    message: primaryError.message,
                    type: primaryError.type,
                    code: primaryError.code,
                    detailedErrors: customErrors,
                });
                stream.destroy(); // Destroy the source stream on error
            },
        });
    });
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
