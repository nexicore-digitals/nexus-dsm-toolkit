/**
 * @file Contains the logic for converting parsed data back into a CSV string.
 * @author Owen
 */

import { unparse } from "papaparse";
import {
    CsvConversionResult,
    CsvTabularConversion,
} from "../types/conversion.ts";
import { CsvResponse } from "../types/csv.response.ts";

/**
 * Converts parsed CSV data into a normalized tabular payload.
 * This function prepares the data for inspection, transformation, or re-serialization.
 *
 * @param response The parsed CSV response.
 * @returns A structured tabular conversion result.
 */
export function convertCsvStructure(
    response: CsvResponse
): CsvTabularConversion {
    if (!response.success || !response.meta?.eligibleForConversion) {
        return {
            success: false,
            message:
                "CSV data is not eligible for conversion. It may contain structural errors or inconsistencies.",
        };
    }

    const { data, meta } = response;
    const flatRecords = Array.isArray(data) ? data : [data];
    const columnNames = meta.fields ?? [];

    return {
        success: true,
        flatRecords,
        columnNames,
        rowCount: flatRecords.length,
        columnCount: columnNames.length,
        delimiter: meta.delimiter ?? ",",
        quoteChar: meta.quoteChar,
        encoding: meta.encoding,
        sourceLabel: meta.source,
    };
}

/**
 * Converts a parsed CSV response back into a CSV string.
 *
 * This function takes the successful result from `parseCSV`, checks for conversion
 * eligibility, and uses `papaparse` to serialize the data back into a
 * well-formed CSV string. It's ideal for cleaning, standardizing, or
 * re-formatting CSV data after validation.
 *
 * @param response The `CsvResponse` from the parsing stage.
 * @returns A `CsvConversionResult` which is either a `SuccessfulCsvConversionResult`
 *          containing the string content, or a `FailedConversionResult`.
 */
export function convertToCsv(response: CsvResponse): CsvConversionResult {
    const tabularResult = convertCsvStructure(response);

    if (!tabularResult.success) return tabularResult;

    const { flatRecords, columnNames, delimiter, quoteChar } = tabularResult;

    const content = unparse(flatRecords.length > 0 ? flatRecords : [{}], {
        header: true,
        columns: columnNames,
        delimiter,
        quotes: true, // Default to quoting fields for safety
        quoteChar: quoteChar ?? '"', // Use detected quote char or default to double quotes
    });

    return {
        ...tabularResult,
        content,
    };
}
