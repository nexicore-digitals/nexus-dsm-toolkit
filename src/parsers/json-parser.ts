import { SpecificJsonError } from "../types/json-errors.ts";
import { JsonResponse } from "../types/json-response.ts";
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
} from "../utils/json-utilities.ts";

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
 * @param data - The raw JSON string content. To be used if `filePath` is not provided.
 * @param filePath - The path to the JSON file. If provided, it takes precedence over `data`.
 * @returns A promise that resolves to a `JsonResponse` object.
 *
 * @example
 * // --- Parsing from a file path ---
 * const response = await parseJSON(undefined, './data/my-file.json');
 * if (response.success) {
 *   console.log("Parsed Data:", response.data);
 *   console.log("Structure Type:", response.meta.structureType);
 * } else {
 *   console.error("Parsing Failed:", response.message);
 * }
 *
 * @example
 * // --- Parsing from a string ---
 * const jsonString = `[{"id": 1, "name": "Alice"}]`;
 * const responseFromString = await parseJSON(jsonString);
 * if (responseFromString.success) {
 *   console.log(responseFromString.data);
 * }
 */
export default async function parseJSON(data: string): Promise<JsonResponse> {
    let parsedData: unknown;
    const customErrors: SpecificJsonError[] = [];

    if (customErrors.length > 0) return createErrorResponse(customErrors);

    customErrors.push(...checkEmptyJson(data));
    customErrors.push(...checkJsonSyntax(data));

    if (isJson(data)) parsedData = JSON.parse(data);
    customErrors.push(...validateJsonRootStructure(parsedData));

    if (Array.isArray(parsedData)) {
        customErrors.push(...checkJsonNonObjectItem(parsedData));
        customErrors.push(...validateJsonNoDataRows(parsedData));
        customErrors.push(...validateJsonEmptyObjects(parsedData));
    }

    customErrors.push(...checkForMultipleErrors(customErrors));

    if (customErrors.length > 0) return createErrorResponse(customErrors);
    else return { success: true, data: parsedData as object | object[] };
}
