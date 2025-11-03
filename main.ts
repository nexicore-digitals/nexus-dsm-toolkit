/**
 * @file Main entry point for the Nexus DSM toolkit.
 * @description This file provides a fully-documented, comprehensive export of all
 * public-facing functions, classes, and types from the `nexus-dsm` library,
 * designed to offer a clear and discoverable API.
 * @author Owen
 */

// --- Core Parsers ---

/**
 * Parses a CSV or TSV string, validates its structure, and returns a detailed response.
 *
 * This function serves as the primary entry point for CSV parsing. It orchestrates
 * validation and metadata generation, returning a `CsvResponse` which is either a
 * `CsvValidResponse` on success or a `CsvErrorResponse` on failure.
 *
 * Even on failure, a `meta` object is attached to the response to provide
 * as much diagnostic context as possible.
 *
 * This function automatically detects delimiters, including tabs for TSV files,
 * and reports the format in the response metadata.
 *
 * @param {string} csv - The raw CSV or TSV string content.
 * @param {string} [source="string-input"] - An optional identifier for the data source (e.g., a filename or URL).
 * @returns {Promise<CsvResponse>} A promise that resolves to a `CsvResponse` object.
 *
 * @example
 * import { parseCSV } from 'nexus-dsm';
 * const response = await parseCSV('header1,header2\nval1,val2');
 * if (response.success) {
 *   console.log("Parsed Data:", response.data);
 *   console.log("Eligibility:", response.meta.eligibleForConversion);
 * } else {
 *   console.error("Parsing Failed:", response.message);
 *   console.log("Error Codes:", response.meta.diagnostics?.errorCodes);
 * }
 */
export { parseCSV, parseCsvFromFile } from "./src/parsers/index.js";

/**
 * Parses a CSV file from a file path (Node.js only).
 *
 * This function is designed for Node.js environments. It reads a file from the
 * filesystem and then uses the core `parseCSV` engine to process it.
 *
 * @param {string} filePath - The path to the CSV or TSV file.
 * @returns {Promise<CsvResponse>} A promise that resolves to a `CsvResponse` object.
 *
 * @example
 * import { parseCsvFromFile } from 'nexus-dsm';
 *
 * const response = await parseCsvFromFile('./data/my-file.csv');
 * // ... handle response
 */
// The actual export is handled by the line `export { parseCSV, parseCsvFromFile } from "./src/parsers/index.js";`

/**
 * Parses a JSON string or a pre-parsed JavaScript object/array.
 *
 * This function serves as the primary entry point for JSON parsing. It supports
 * JSON files with a root-level array of objects or a single root object. It returns
 * a discriminated union `JsonResponse` which is either a `JsonValidResponse` on
 * success or a `JsonErrorResponse` on failure.
 *
 * A detailed `meta` object is attached to every response to provide diagnostic context.
 *
 * @param {string | object | object[]} data - The raw JSON string or a pre-parsed JavaScript object or array.
 * @param {string} [source="string-input"] - An optional identifier for the data source (e.g., a filename or URL).
 * @returns {Promise<JsonResponse>} A promise that resolves to a `JsonResponse` object.
 *
 * @example
 * import { parseJSON } from 'nexus-dsm';
 *
 * // --- Parsing from a raw string ---
 * const jsonString = '[{"id": 1}]';
 * const responseFromString = await parseJSON(jsonString);
 * console.log(responseFromString.success); // true
 *
 * // --- Parsing from a pre-parsed object (more efficient) ---
 * const jsonObject = [{ id: 1 }];
 * const responseFromObject = await parseJSON(jsonObject);
 * console.log(responseFromObject.success); // true
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
 * @param {CsvConversionOptions} [options] - Configuration for the conversion, such as the flattening strategy.
 * @returns {CsvConversionResult} A result object containing the CSV string content on success, or an error message on failure.
 *
 * @example
 * import { parseJSON, convertToCsv } from 'nexus-dsm';
 *
 * const nestedJson = '[{"name":"Alice","profile":{"age":30},"tags":["dev"]}]';
 * const jsonResponse = await parseJSON(nestedJson);
 *
 * // Shallow conversion (default)
 * const shallow = convertToCsv(jsonResponse);
 * console.log(shallow.content); // name,profile,tags\r\nAlice,"{""age"":30}","[""dev""]"
 *
 * // Deep conversion
 * const deep = convertToCsv(jsonResponse, { flattening: 'deep' });
 * console.log(deep.content); // name,profile.age,tags[0]\r\nAlice,30,dev
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
 * @param {JsonConversionOptions} [options] - Configuration for the conversion, such as the un-flattening strategy.
 * @returns {JsonConversionResult} A result object containing the JSON string content on success or an error message on failure.
 *
 * @example
 * import { parseCSV, convertToJson } from 'nexus-dsm';
 *
 * const flatCsv = 'user.name,user.id\nAlice,1';
 * const csvResponse = await parseCSV(flatCsv);
 *
 * // The function detects flattened headers (e.g., 'user.name') and un-flattens by default.
 * const nestedJson = convertToJson(csvResponse);
 * console.log(nestedJson.content); // '[{"user":{"name":"Alice","id":1}}]'
 *
 * // To prevent this and get a flat JSON object, pass `unflatten: false`.
 * const flatJson = convertToJson(csvResponse, { unflatten: false });
 * console.log(flatJson.content); // '[{"user.name":"Alice","user.id":1}]'
 */
export { convertToJson } from "./src/converters/index.js";

// --- Utilities ---

/**
 * A builder class for creating detailed, format-specific metadata objects.
 *
 * This class uses a fluent interface (chaining methods) to construct either a
 * `CsvParsedFileMeta` or a `JsonParsedFileMeta` object. It is primarily used
 * internally by the parsers but is exposed for advanced use cases, such as
 * creating mock metadata for testing.
 *
 * @property {function} init - Initializes the builder with base metadata (source, fields, rowCount).
 * @property {function} withCsvFlags - Attaches CSV-specific validation flags (e.g., `hasHeaders`).
 * @property {function} withJsonFlags - Attaches JSON-specific validation flags (e.g., `hasConsistentKeys`).
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
 * @returns {number} The maximum depth (a flat object is depth 1).
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
 * @param {object[]} arr - The array of objects to analyze.
 * @returns {{consistent: boolean, inconsistentKeys?: string[]}} An object indicating consistency and listing any inconsistent keys.
 *
 * @example
 * import { checkKeyConsistency } from 'nexus-dsm';
 *
 * const consistent = [{ a: 1 }, { a: 2 }];
 * console.log(checkKeyConsistency(consistent).consistent); // true
 *
 * const inconsistent = [{ a: 1 }, { b: 2 }];
 * console.log(checkKeyConsistency(inconsistent).inconsistentKeys); // ['a', 'b']
 */
export { checkKeyConsistency } from "./src/utils/index.js";

// --- Advanced / Lower-Level Functions ---

/**
 * Normalizes a parsed CSV response into a structured tabular payload.
 * This is a lower-level function used internally by `convertToJson`. It is exposed
 * for advanced scenarios where you need to inspect the normalized structure before final serialization.
 *
 * @param {CsvResponse} response - The response object from `parseCSV`.
 * @returns {CsvTabularConversion} A structured object with records, columns, and stats.
 */
export { convertCsvStructure } from "./src/converters/index.js";

/**
 * Normalizes a parsed JSON response into a structure-aware payload.
 * This is a lower-level function used internally by `convertToCsv`. It is exposed
 * for advanced scenarios where you need to inspect the normalized structure before final serialization.
 *
 * @param {unknown} original - The original parsed JSON data from a `JsonResponse`.
 * @param {JsonParsedFileMeta} meta - The metadata from a `JsonResponse`.
 * @returns {JsonStructureConversionPayload} A normalized payload with structure details.
 */
export { convertJsonStructure } from "./src/converters/index.js";

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
