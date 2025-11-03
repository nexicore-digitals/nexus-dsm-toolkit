/**
 * @file Contains the logic for converting parsed CSV data to JSON format.
 * @author Owen
 */

import type { CsvResponse } from "../types/csv.response.js";
import { convertCsvStructure } from "./csv-converter.js";
import type {
    JsonConversionOptions,
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
 * Normalizes parsed JSON data into a structure-aware payload, preparing it for conversion.
 *
 * This function is a lower-level utility used internally by `convertToCsv`. It takes the
 * raw data and metadata from a successful `parseJSON` response and organizes it into a
 * standardized `JsonStructureConversionPayload`. This payload includes details like the
 * root structure type, nesting depth, and a clean array of root-level objects, making
 * it easier to process for serialization.
 *
 * @param original The original parsed JSON data from a `JsonResponse`.
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
 * Converts a parsed CSV response into a well-formed, pretty-printed JSON string.
 *
 * This function takes the entire successful response object from `parseCSV`. It first
 * checks the `eligibleForConversion` flag in the metadata. If eligible, it serializes
 * the data into a JSON string.
 *
 * By default, it automatically detects flattened CSV headers (e.g., `user.name` or
 * `tags[0]`) and reconstructs a nested JSON object. This behavior can be disabled
 * via the `options` parameter.
 *
 * @param response The `CsvResponse` from the parsing stage.
 * @param options Configuration for the conversion, such as un-flattening strategy.
 * @returns A `JsonConversionResult` which is either a `SuccessfulJsonConversionResult`
 *          or a `FailedConversionResult`.
 *
 * @example
 * const flatCsv = 'user.name,user.id\nAlice,1';
 * const csvResponse = await parseCSV(flatCsv);
 *
 * // Automatically detects flattened headers and un-flattens by default.
 * const nestedJson = convertToJson(csvResponse);
 * // nestedJson.content is: '[{"user":{"name":"Alice","id":1}}]'
 */
export function convertToJson(
    response: CsvResponse,
    options?: JsonConversionOptions
): JsonConversionResult {
    if (!response.success || !response.meta?.eligibleForConversion) {
        const hints: string[] = [];
        if (!response.success) {
            hints.push(
                "The initial CSV parsing failed. Please check the original data for syntax errors."
            );
        } else if (response.meta) {
            const { validationFlags } = response.meta;
            if (!validationFlags.hasHeaders) {
                hints.push("The CSV must have a valid header row.");
            }
            if (!validationFlags.hasValidRows) {
                hints.push("The CSV does not contain any valid data rows.");
            }
        }
        return {
            success: false,
            message:
                "CSV data is not eligible for conversion. It may contain structural errors or inconsistencies.",
            hints,
        };
    }

    const tabularResult = convertCsvStructure(response);
    if (!tabularResult.success) return tabularResult;

    const { columnNames } = tabularResult;

    // Check if headers suggest a flattened structure.
    const headersLookFlattened = columnNames.some(
        (header) => header.includes(".") || header.includes("[")
    );

    // Un-flatten if the option is explicitly true, or if it's not explicitly false and headers look flattened.
    const shouldUnflatten =
        options?.unflatten === true ||
        (options?.unflatten !== false && headersLookFlattened);

    let finalRecords = tabularResult.flatRecords;
    if (shouldUnflatten) {
        finalRecords = tabularResult.flatRecords.map((record) => {
            const nestedRecord: Record<string, any> = {};
            for (const key in record) {
                // This regex splits keys like 'profile.age' and 'matrix[0][1]'
                const path = key.match(/[^.\[\]]+/g) || [];
                let current = nestedRecord;

                for (let i = 0; i < path.length; i++) {
                    const part = path[i];
                    const nextPart = path[i + 1];

                    if (i === path.length - 1) {
                        current[part] = (record as Record<string, any>)[key];
                    } else {
                        const isNextPartNumeric = /^\d+$/.test(nextPart);
                        if (
                            !current[part] ||
                            typeof current[part] !== "object"
                        ) {
                            current[part] = isNextPartNumeric ? [] : {};
                        }
                        current = current[part];
                    }
                }
            }
            return nestedRecord;
        });
    }

    const { rowCount } = tabularResult;

    const result: SuccessfulJsonConversionResult = {
        success: true,
        content: JSON.stringify(finalRecords, null, 2),
        structureType: "array", // CSV data is always an array of objects
        rootLength: rowCount,
        nestingDepth: 1, // CSV is always flat
        keySet: columnNames,
        rootItems: finalRecords,
        original: finalRecords,
        conversionMeta: {
            unflatten: shouldUnflatten,
        },
    };
    return result;
}
