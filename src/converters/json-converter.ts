/**
 * @file Contains the logic for converting parsed CSV data to JSON format.
 * @author Owen
 */

import type { CsvResponse } from "../types/csv.response.js";
import { convertCsvStructure } from "./csv-converter.js";
import type {
    JsonConversionResult,
    SuccessfulJsonConversionResult,
} from "../types/conversion.js";
import type { JsonParsedFileMeta } from "../types/meta.js";

export interface JsonStructureConversionPayload {
    structureType: "array" | "object";
    rootLength: number;
    nestingDepth: number;
    keySet: string[];
    rootItems: object[];
    original: unknown;
    conversionWarnings?: string[];
}

/**
 * Converts parsed JSON data into a normalized structure-aware payload.
 * This function assumes the input has already passed eligibility checks.
 *
 * @param original The original parsed JSON data.
 * @param meta Metadata extracted during parsing.
 * @returns A normalized conversion payload with structure details.
 */
export function convertJsonStructure(
    original: unknown,
    meta: JsonParsedFileMeta
): JsonStructureConversionPayload {
    const { structureType, nestingDepth, fields, validationFlags } = meta;

    const rootItems =
        structureType === "array" && Array.isArray(original)
            ? original
            : structureType === "object" && typeof original === "object"
              ? [original]
              : [];

    const conversionWarnings: string[] = [];

    if (structureType === "object" && !Array.isArray(original)) {
        conversionWarnings.push(
            "Root is an object, not an array. Flattening may be lossy."
        );
    }

    if (validationFlags?.hasConsistentKeys === false) {
        conversionWarnings.push(
            "Inconsistent keys detected across root items."
        );
    }

    return {
        structureType,
        rootLength: rootItems.length,
        nestingDepth,
        keySet: fields,
        rootItems,
        original,
        conversionWarnings:
            conversionWarnings.length > 0 ? conversionWarnings : undefined,
    };
}

/**
 * Converts a parsed CSV response into a pretty-printed JSON string.
 *
 * This function takes the successful result from `parseCSV`, checks for conversion
 * eligibility, and serializes the data into a JSON string.
 *
 * @param response The `CsvResponse` from the parsing stage.
 * @returns A `JsonConversionResult` which is either a `SuccessfulJsonConversionResult`
 *          or a `FailedConversionResult`.
 */
export function convertToJson(response: CsvResponse): JsonConversionResult {
    if (!response.success || !response.meta?.eligibleForConversion) {
        return {
            success: false,
            message:
                "CSV data is not eligible for conversion. It may contain structural errors or inconsistencies.",
        };
    }

    const tabularResult = convertCsvStructure(response);
    if (!tabularResult.success) return tabularResult;

    const { flatRecords, columnNames, rowCount } = tabularResult;

    const result: SuccessfulJsonConversionResult = {
        success: true,
        content: JSON.stringify(flatRecords, null, 2),
        structureType: "array", // CSV data is always an array of objects
        rootLength: rowCount,
        nestingDepth: 1, // CSV is always flat
        keySet: columnNames,
        rootItems: flatRecords,
        original: flatRecords,
    };
    return result;
}
