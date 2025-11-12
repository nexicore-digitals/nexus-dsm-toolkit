/**
 * @file Provides a stream-based JSON parser for large files using stream-json.
 * @author Owen
 */

import { Readable } from "stream";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray.js";
import type { JsonResponse } from "../types/json-response.js";
import type { SpecificJsonError } from "../types/json-errors.js";
import {
    jsonEnvironmentError,
    jsonSyntaxError,
    jsonValidationFailedError,
} from "../constants/json-custom-errors.js";
import {
    calculateNestingDepth,
    checkKeyConsistency,
    Obj,
} from "../utils/json-analysis-utilities.js";
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.js";
import {
    checkJsonNonObjectItem,
    createErrorResponse,
    validateJsonEmptyObjects,
    validateJsonNoDataRows,
} from "../utils/json-utilities.js";

/**
 * Parses a JSON ReadableStream, validates its structure, and returns a detailed response.
 * This function is designed for streaming large JSON files, assuming the root is an array of objects.
 *
 * @param stream - The Node.js ReadableStream of the JSON content.
 * @param source - An optional identifier for the data source (e.g., a filename or URL).
 * @returns A promise that resolves to a `JsonResponse` object.
 */
export async function parseJsonStream(
    stream: Readable,
    source: string = "stream-input"
): Promise<JsonResponse> {
    if (typeof window !== "undefined") {
        return {
            ...jsonEnvironmentError,
            success: false,
            detailedErrors: [jsonEnvironmentError],
        };
    }

    return new Promise((resolve) => {
        const data: object[] = [];
        const customErrors: SpecificJsonError[] = [];

        const pipeline = chain([
            stream,
            parser(),
            streamArray(), // Assumes a root array of objects
        ]);

        pipeline.on("data", (chunk) => {
            // stream-json/streamers/StreamArray emits objects with {key, value}
            data.push(chunk.value);
        });

        pipeline.on("error", (err: Error) => {
            customErrors.push({ ...jsonSyntaxError, message: err.message });
            stream.destroy(); // Ensure underlying stream is closed
            resolve(createErrorResponse(customErrors));
        });

        pipeline.on("end", () => {
            // All data has been collected, now perform validations
            customErrors.push(...checkJsonNonObjectItem(data));
            customErrors.push(...validateJsonNoDataRows(data));
            customErrors.push(...validateJsonEmptyObjects(data));

            if (customErrors.length > 1) {
                customErrors.push(jsonValidationFailedError);
            }

            const fields = data.length > 0 ? Object.keys(data[0]) : [];
            const keyConsistencyResult = checkKeyConsistency(data);

            const validationFlags = {
                isArrayOfObjects: true, // Assumed by this streaming parser
                hasConsistentKeys: keyConsistencyResult.consistent,
                hasValidRows:
                    data.length > 0 &&
                    data.some((obj) => Object.keys(obj).length > 0),
                inconsistentKeys: keyConsistencyResult.inconsistentKeys,
            };

            const metaBuilder = ParsedFileMetaBuilder.init(
                source,
                fields,
                data.length,
                "json"
            )
                .withJsonFlags(validationFlags)
                .withJsonExtras({
                    structureType: "array",
                    nestingDepth: calculateNestingDepth(data as Obj),
                })
                .withDiagnostics({
                    warnings: customErrors.map((e) => e.message),
                    errorCodes: customErrors.map((e) => e.code ?? "Unknown"),
                });

            const finalMeta = metaBuilder.buildJson();

            if (customErrors.length > 0) {
                const errorResponse = createErrorResponse(customErrors);
                errorResponse.meta = finalMeta;
                resolve(errorResponse);
            } else {
                resolve({
                    success: true,
                    data,
                    meta: finalMeta,
                });
            }
            stream.destroy(); // Ensure stream is closed on successful completion
        });
    });
}
