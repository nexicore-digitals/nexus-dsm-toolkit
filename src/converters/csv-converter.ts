/**
 * @file Contains the logic for converting parsed JSON data into a CSV string.
 * @author Owen
 */
import { convertJsonStructure } from "./json-converter.js";

import Papa from "papaparse";
import type { JsonResponse } from "../types/json-response.js";
import type {
    CsvConversionResult,
    SuccessfulCsvConversionResult,
    CsvTabularConversion,
} from "../types/conversion.js";
import type { CsvResponse } from "../types/csv.response.js";

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
 * Converts a parsed JSON response into a well-formed CSV string.
 *
 * This function takes the successful result from `parseJSON`, checks for conversion
 * eligibility, and uses `papaparse` to serialize the data into a CSV string.
 *
 * @param response The `JsonResponse` from the parsing stage.
 * @returns A `CsvConversionResult` which is either a `SuccessfulCsvConversionResult`
 *          containing the string content, or a `FailedConversionResult`.
 */
export function convertToCsv(response: JsonResponse): CsvConversionResult {
    if (!response.success || !response.meta?.eligibleForConversion) {
        return {
            success: false,
            message:
                "JSON data is not eligible for conversion. It may contain structural errors or inconsistencies.",
        };
    }

    const structuredResult = convertJsonStructure(response.data, response.meta);

    const { rootItems: flatRecords, keySet: columnNames } = structuredResult;

    const content = Papa.unparse(flatRecords, {
        header: true,
        columns: columnNames,
        quotes: true, // Default to quoting fields for safety
        quoteChar: '"',
    });

    const result: SuccessfulCsvConversionResult = {
        success: true,
        content,
        columnNames,
        flatRecords,
        rowCount: flatRecords.length,
        delimiter: ",",
    };

    return result;
}
