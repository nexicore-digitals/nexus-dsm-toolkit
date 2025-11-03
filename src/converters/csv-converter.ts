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
    CsvConversionOptions,
} from "../types/conversion.js";
import type { CsvResponse } from "../types/csv.response.js";

/**
 * Recursively flattens a nested object into a single-level object.
 * Nested keys are combined using a dot separator.
 *
 * @param obj The object to flatten.
 * @param parentKey The base key for the current level of recursion.
 * @param separator The character to use for joining keys.
 * @returns A new, flattened object.
 */
function flattenObject(
    obj: object,
    parentKey = "",
    separator = "."
): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const isArray = Array.isArray(obj);

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = parentKey
                ? isArray
                    ? `${parentKey}[${key}]`
                    : `${parentKey}${separator}${key}`
                : key;
            const value = (obj as Record<string, unknown>)[key] as object;

            if (typeof value === "object" && value !== null) {
                Object.assign(result, flattenObject(value, newKey, separator));
            } else {
                result[newKey] = value;
            }
        }
    }
    return result;
}

/**
 * Normalizes a parsed CSV response into a structured tabular payload.
 *
 * This is a lower-level function used internally by `convertToJson`. It takes a
 * successful `CsvResponse` and transforms it into a `CsvTabularConversion` object,
 * which contains the data as an array of records, a list of column names, and
 * other relevant metadata. This standardized structure is ideal for inspection,
 * transformation, or final serialization into another format.
 *
 * @param response The successful `CsvResponse` object from the `parseCSV` function.
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
 * Converts a parsed JSON response into a well-formed CSV string, with options for deep or shallow flattening.
 *
 * This function takes the successful result from `parseJSON`, checks for conversion
 * eligibility, and uses `papaparse` to serialize the data.
 *
 * It supports two flattening strategies:
 * - **'shallow' (default):** Nested objects and arrays are stringified into a single cell.
 * - **'deep':** Nested structures are recursively flattened into separate columns using dot and bracket notation (e.g., `profile.age`, `tags[0]`).
 *
 * @param response The `JsonResponse` from the parsing stage.
 * @param options Configuration for the conversion, such as flattening strategy.
 * @returns A `CsvConversionResult` which is either a `SuccessfulCsvConversionResult`
 *          containing the string content, or a `FailedConversionResult`.
 *
 * @example
 * const nestedJson = `[{"name":"Alice","profile":{"age":30}}]`;
 * const jsonResponse = await parseJSON(nestedJson);
 *
 * // Deep conversion
 * const deep = convertToCsv(jsonResponse, { flattening: 'deep' });
 * // deep.content is: name,profile.age\r\nAlice,30
 */
export function convertToCsv(
    response: JsonResponse,
    options?: CsvConversionOptions
): CsvConversionResult {
    if (!response.success || !response.meta?.eligibleForConversion) {
        const hints: string[] = [];
        if (!response.success) {
            hints.push(
                "The initial JSON parsing failed. Please check the original data for syntax errors."
            );
        } else if (response.meta) {
            const { validationFlags } = response.meta;
            if (!validationFlags.isArrayOfObjects) {
                hints.push("The JSON root must be an array of objects.");
            }
            if (!validationFlags.hasConsistentKeys) {
                hints.push(
                    "Objects within the JSON array have inconsistent keys, which can lead to a malformed CSV."
                );
            }
            if (!validationFlags.hasValidRows) {
                hints.push("The JSON array is empty or contains no data.");
            }
        }
        return {
            success: false,
            message:
                "JSON data is not eligible for conversion. It may contain structural errors or inconsistencies.",
            hints,
        };
    }

    const structuredResult = convertJsonStructure(response.data, response.meta);

    const { rootItems } = structuredResult;

    let recordsForCsv: object[];
    let allHeaders: string[];

    if (options?.flattening === "deep") {
        // Deep flatten each record and collect all unique column headers.
        recordsForCsv = rootItems.map((record) => flattenObject(record));
        allHeaders = [
            ...new Set(recordsForCsv.flatMap((record) => Object.keys(record))),
        ];
    } else {
        // Default "shallow" conversion: stringify nested objects.
        recordsForCsv = rootItems.map((record) => {
            const newRecord: Record<string, unknown> = {};
            for (const key in record) {
                const value = (record as Record<string, unknown>)[key];
                if (typeof value === "object" && value !== null) {
                    newRecord[key] = JSON.stringify(value);
                } else {
                    newRecord[key] = value;
                }
            }
            return newRecord;
        });
        allHeaders = structuredResult.keySet;
    }

    // Handle case where there are no records to avoid papaparse error.
    if (recordsForCsv.length === 0) {
        return {
            success: true,
            content: "",
            columnNames: [],
            flatRecords: [],
            rowCount: 0,
            delimiter: ",",
            conversionMeta: {
                flattening: options?.flattening === "deep" ? "deep" : "shallow",
            },
        };
    }

    const content = Papa.unparse(recordsForCsv, {
        header: true,
        columns: allHeaders,
        quotes: true, // Default to quoting fields for safety
        quoteChar: '"',
    });

    const result: SuccessfulCsvConversionResult = {
        success: true,
        content,
        columnNames: allHeaders,
        flatRecords: recordsForCsv,
        rowCount: recordsForCsv.length,
        delimiter: ",",
        conversionMeta: {
            flattening: options?.flattening === "deep" ? "deep" : "shallow",
        },
    };

    return result;
}
