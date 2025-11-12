import type { SpecificJsonError } from "../types/json-errors.js";
import type {
    JsonErrorResponse,
    JsonResponse,
} from "../types/json-response.js";
import { JsonParsedFileMeta } from "../types/meta.js";
import {
    checkEmptyJson,
    checkForMultipleErrors,
    checkJsonNonObjectItem,
    checkJsonSyntax,
    createErrorResponse,
    isJson,
    validateJsonEmptyObjects,
    validateJsonNoDataRows,
    validateJsonRootStructure,
} from "../utils/json-utilities.js";
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.js";
import {
    calculateNestingDepth,
    checkKeyConsistency,
    Obj,
} from "../utils/json-analysis-utilities.js";
import { JsonUnexpectedError } from "../types/json-errors.js";

/**
 * Parses a JSON file from a file path or a raw string content.
 *
 * This function serves as the primary entry point for JSON parsing. It supports
 * JSON files with a root-level array of objects or a single root object. It returns
 * a discriminated union `JsonResponse` which is either a `JsonValidResponse` on
 * success or a `JsonErrorResponse` on failure.
 *
 * A detailed `meta` object is attached to the response to provide diagnostic context.
 *
 * @param data - The raw JSON string or a pre-parsed JavaScript object/array.
 * @param filePath - The path to the JSON file. If provided, it takes precedence over `data`.
 * @returns A promise that resolves to a `JsonResponse` object.
 *
 * @example
 * // --- Parsing from a file path ---
 * const response = await parseJSON(undefined, './data/my-file.json');
 * if (response.success) {
 *   logger.info("Parsed Data:", response.data);
 *   logger.info("Structure Type:", response.meta.structureType);
 * } else {
 *   logger.error("Parsing Failed:", response.message);
 * }
 *
 * @example
 * // --- Parsing from a string ---
 * const jsonString = `[{"id": 1, "name": "Alice"}]`;
 * const responseFromString = await parseJSON(jsonString);
 * if (responseFromString.success) {
 *   logger.info(responseFromString.data);
 * }
 */
export default async function parseJSON(
    data: string | object | object[],
    filePath?: string
): Promise<JsonResponse> {
    let parsedData: unknown;
    const customErrors: SpecificJsonError[] = [];
    const source =
        filePath ??
        (typeof data === "string" ? "string-input" : "object-input");

    try {
        if (typeof data === "string") {
            // Handle raw string input
            customErrors.push(...checkEmptyJson(data));
            customErrors.push(...checkJsonSyntax(data));
            if (isJson(data)) {
                parsedData = JSON.parse(data);
            }
        } else if (typeof data === "object" && data !== null) {
            // Handle pre-parsed object/array input
            parsedData = data;
        }

        customErrors.push(...validateJsonRootStructure(parsedData));

        const dataAsArray = Array.isArray(parsedData)
            ? (parsedData as object[])
            : typeof parsedData === "object" && parsedData !== null
              ? [parsedData]
              : [];

        if (Array.isArray(parsedData)) {
            customErrors.push(...checkJsonNonObjectItem(parsedData));
            customErrors.push(...validateJsonNoDataRows(parsedData));
            customErrors.push(...validateJsonEmptyObjects(parsedData));
        }

        customErrors.push(...checkForMultipleErrors(customErrors));

        // Build metadata for context, even on failure.
        const fields =
            dataAsArray.length > 0 ? Object.keys(dataAsArray[0]) : [];
        const keyConsistencyResult = checkKeyConsistency(dataAsArray);

        const validationFlags = {
            isArrayOfObjects:
                Array.isArray(parsedData) &&
                dataAsArray.every(
                    (item) => typeof item === "object" && item !== null
                ),
            hasConsistentKeys: keyConsistencyResult.consistent,
            hasValidRows:
                dataAsArray.length > 0 &&
                dataAsArray.some((obj) => Object.keys(obj).length > 0),
            inconsistentKeys: keyConsistencyResult.inconsistentKeys,
        };

        let eligibilityReason: string | undefined;
        if (!validationFlags.hasConsistentKeys) {
            eligibilityReason = "Inconsistent keys found across JSON objects.";
        } else if (!validationFlags.isArrayOfObjects) {
            eligibilityReason = "JSON root is not an array of objects.";
        }

        const parsedMeta: JsonParsedFileMeta = ParsedFileMetaBuilder.init(
            source,
            fields,
            dataAsArray.length,
            "json"
        )
            .withJsonFlags(validationFlags)
            .withJsonExtras({
                structureType: Array.isArray(parsedData) ? "array" : "object",
                nestingDepth: calculateNestingDepth(parsedData as Obj),
            })
            .withDiagnostics({
                warnings: customErrors.map((e) => e.message),
                eligibilityReason,
                errorCodes: customErrors.map((e) => e.code ?? "Unknown"),
            })
            .buildJson();

        if (customErrors.length > 0) {
            const errorResponse = createErrorResponse(customErrors);
            (errorResponse as JsonErrorResponse).meta = parsedMeta;
            return errorResponse;
        }

        return {
            success: true,
            data: parsedData as object | object[],
            meta: parsedMeta,
        };
    } catch (error: unknown) {
        const unexpectedError: JsonUnexpectedError = {
            name: "JsonUnexpectedError",
            message: `An unexpected error occurred: ${(error as Error).message}`,
            type: "UnexpectedError",
            code: "UnknownJsonError",
        };
        return createErrorResponse([unexpectedError]);
    }
}
