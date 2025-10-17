/**
 * @file Contains the logic for converting parsed JSON data to other formats.
 * @author Owen
 */

import { JsonResponse } from "../types/json-response.ts";
import { JsonConversionResult } from "../types/conversion.ts";
import { JsonParsedFileMeta } from "../types/meta.ts";

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
    meta: JsonParsedFileMeta,
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
            "Root is an object, not an array. Flattening may be lossy.",
        );
    }

    if (validationFlags?.hasConsistentKeys === false) {
        conversionWarnings.push(
            "Inconsistent keys detected across root items.",
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
 * Processes a `JsonResponse` to produce a structured conversion result.
 * This function acts as a pre-conversion step, preparing the data and metadata
 * for final transformation into another format (like CSV).
 *
 * @param response The `JsonResponse` from the parsing stage.
 * @returns A `JsonConversionResult` which is either a success object with detailed
 *          metadata or a failure object with an error message.
 */
export function convertFromJson(response: JsonResponse): JsonConversionResult {
    if (!response.success || !response.meta?.eligibleForConversion) {
        return {
            success: false,
            message:
                "JSON data is not eligible for conversion. It may contain structural errors or inconsistencies.",
        };
    }

    const payload = convertJsonStructure(
        response.data,
        response.meta as JsonParsedFileMeta,
    );

    return {
        success: true,
        content: JSON.stringify(payload.original, null, 2), // The stringified content
        ...payload,
    };
}
