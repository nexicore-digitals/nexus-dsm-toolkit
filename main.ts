/**
 * @file Main entry point for the Nexus DSM toolkit.
 * @description This file provides a fully-documented, comprehensive export of all
 * public-facing functions, classes, and types from the `nexus-dsm` library.
 * It is designed to offer a clear and discoverable API for developers.
 * @author Owen
 */

// --- Core Parsers ---

/**
 * Parses a CSV file from a file path or a raw string content.
 *
 * This function serves as the primary entry point for CSV parsing. It orchestrates
 * file reading, validation, and metadata generation. It returns a discriminated union
 * `CsvResponse` which is either a `CsvValidResponse` on success or a `CsvErrorResponse`
 * on failure.
 *
 * Even on failure, a `meta` object is attached to the response to provide
 * as much diagnostic context as possible.
 *
 * @param {string | undefined} data - The raw CSV string content. To be used if `filePath` is not provided.
 * @param {string | undefined} filePath - The path to the CSV file. If provided, it takes precedence over `data`.
 * @returns {Promise<CsvResponse>} A promise that resolves to a `CsvResponse` object.
 *
 * @example
 * import { parseCSV } from 'nexus-dsm';
 *
 * const response = await parseCSV(undefined, './data/my-file.csv');
 * if (response.success) {
 *   console.log("Parsed Data:", response.data);
 *   console.log("Eligibility:", response.meta.eligibleForConversion);
 * } else {
 *   console.error("Parsing Failed:", response.message);
 *   console.log("Error Codes:", response.meta.diagnostics?.errorCodes);
 * }
 */
export { parseCSV } from "./src/parsers/index.js";

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
 * @param {string} data - The raw JSON string content. To be used if `filePath` is not provided.
 * @param {string | undefined} [filePath] - The path to the JSON file. If provided, it takes precedence over `data`.
 * @returns {Promise<JsonResponse>} A promise that resolves to a `JsonResponse` object.
 *
 * @example
 * import { parseJSON } from 'nexus-dsm';
 *
 * const jsonString = `[{"id": 1, "name": "Alice"}]`;
 * const response = await parseJSON(jsonString);
 * if (response.success) {
 *   console.log("Parsed Data:", response.data);
 *   console.log("Structure Type:", response.meta.structureType);
 * } else {
 *   console.error("Parsing Failed:", response.message);
 * }
 */
export { parseJSON } from "./src/parsers/index.js";

// --- Converters ---

/**
 * Converts a parsed JSON response into a well-formed CSV string.
 *
 * This function takes the entire successful response object from `parseJSON`.
 * It first checks the `eligibleForConversion` flag in the metadata. If eligible,
 * it serializes the data into a CSV string.
 *
 * @param {JsonResponse} response - The successful response object from the `parseJSON` function.
 * @returns {CsvConversionResult} A result object containing the CSV string content on success, or an error message on failure.
 *
 * @example
 * import { parseJSON, convertToCsv } from 'nexus-dsm';
 *
 * const jsonResponse = await parseJSON('[{"id":1,"name":"test"}]');
 * const csvResult = convertToCsv(jsonResponse);
 *
 * if (csvResult.success) {
 *   console.log(csvResult.content); // "id,name\r\n1,test"
 * }
 */
export { convertToCsv } from "./src/converters/index.js";

/**
 * Converts a parsed CSV response into a pretty-printed JSON string.
 *
 * This function takes the entire successful response object from `parseCSV`.
 * It first checks the `eligibleForConversion` flag in the metadata. If eligible,
 * it serializes the data into a JSON string.
 *
 * @param {CsvResponse} response - The successful response object from `parseCSV`.
 * @returns {JsonConversionResult} A result object containing the JSON string content on success, or an error message on failure.
 *
 * @example
 * import { parseCSV, convertFromJson } from 'nexus-dsm';
 *
 * const csvResponse = await parseCSV('id,name\n1,test');
 * const jsonResult = convertFromJson(csvResponse);
 *
 * if (jsonResult.success) {
 *   console.log(jsonResult.content); // '[\n  {\n    "id": 1,\n    "name": "test"\n  }\n]'
 * }
 */
export { convertFromJson } from "./src/converters/index.js";

// --- Utilities ---

/**
 * A builder class for creating detailed, format-specific metadata objects.
 *
 * This class uses a fluent interface (chaining methods) to construct either a
 * `CsvParsedFileMeta` or a `JsonParsedFileMeta` object. It is useful for advanced
 * scenarios where you might want to build metadata objects programmatically.
 *
 * @property {function} init - Initializes the builder with base metadata.
 * @property {function} withCsvFlags - Attaches CSV-specific validation flags.
 * @property {function} withJsonFlags - Attaches JSON-specific validation flags.
 * @property {function} withDiagnostics - Attaches diagnostic information (warnings, errors).
 * @property {function} buildCsv - Builds the final `CsvParsedFileMeta` object.
 *
 * @example
 * import { ParsedFileMetaBuilder } from 'nexus-dsm';
 *
 * const meta = ParsedFileMetaBuilder.init("source.csv", ["id", "name"], 10)
 *   .withCsvFlags({ hasHeaders: true, hasBalancedQuotes: true, hasValidRows: true })
 *   .withCsvExtras({ delimiter: ',' })
 *   .buildCsv();
 *
 * console.log(meta.eligibleForConversion); // true
 */
export { ParsedFileMetaBuilder } from "./src/utils/index.js";

/**
 * Calculates the maximum nesting depth of a JSON object or array.
 * This is useful for understanding the complexity of a JSON structure before flattening or conversion.
 *
 * @param {any} obj - The object or array to analyze.
 * @returns {number} The maximum depth (e.g., a flat object is depth 1).
 *
 * @example
 * import { calculateNestingDepth } from 'nexus-dsm';
 *
 * const data = { user: { profile: { name: "Alice" } } };
 * const depth = calculateNestingDepth(data);
 * console.log(depth); // 3
 */
export { calculateNestingDepth } from "./src/utils/index.js";

/**
 * Checks if all objects in an array have the same set of keys.
 * This is a crucial validation step before converting a JSON array to a flat format like CSV.
 *
 * @param {object[]} arr - The array of objects to check.
 * @returns {boolean} `true` if all objects have the same keys, `false` otherwise.
 *
 * @example
 * import { checkKeyConsistency } from 'nexus-dsm';
 *
 * const consistent = [{ a: 1 }, { a: 2 }];
 * console.log(checkKeyConsistency(consistent)); // true
 *
 * const inconsistent = [{ a: 1 }, { b: 2 }];
 * console.log(checkKeyConsistency(inconsistent)); // false
 */
export { checkKeyConsistency } from "./src/utils/index.js";

// --- Advanced / Lower-Level Functions ---

/**
 * Normalizes a parsed CSV response into a structured tabular payload.
 * This is an intermediate step used by `convertToCsv` and is useful for custom transformations.
 *
 * @param {CsvResponse} response - The response object from `parseCSV`.
 * @returns {CsvTabularConversion} A structured object with records, columns, and stats.
 */
export { convertCsvStructure } from "./src/converters/index.js";

/**
 * Normalizes a parsed JSON response into a structure-aware payload.
 * This is an intermediate step used by `convertFromJson` and is useful for custom transformations.
 *
 * @param {unknown} original - The original parsed JSON data from a `JsonResponse`.
 * @param {JsonParsedFileMeta} meta - The metadata from a `JsonResponse`.
 * @returns {JsonStructureConversionPayload} A normalized payload with structure details.
 */
export { convertJsonStructure } from "./src/converters/index.js";

/**
 * Adapts a raw error from the PapaParse library into a standardized Nexus DSM error format.
 *
 * @param {PapaParseRawError} papaError - The raw error object from PapaParse.
 * @returns {SpecificCsvError} A specific, standardized error object.
 */
export { transformPapaParseError } from "./src/adapters/index.js";

// --- Type Definitions ---

/**
 * Exports all public-facing type definitions, interfaces, and error types.
 * This allows for full type-safe interaction with the library in a TypeScript environment.
 *
 * @example
 * import type { CsvResponse, JsonParsedFileMeta, FailedConversionResult } from 'nexus-dsm';
 *
 * function handleResponse(response: CsvResponse) {
 *   if (response.success) {
 *     // response is now of type CsvValidResponse
 *     const meta: CsvParsedFileMeta = response.meta;
 *     console.log(meta.validationFlags.hasHeaders);
 *   }
 * }
 */
export * from "./src/types/index.js";
