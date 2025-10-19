/**
 * @file Exports all public-facing type definitions and interfaces.
 * @description This module serves as the single source for all types used in
 * function signatures and return values, making them easily accessible for
 * TypeScript users.
 * @author Owen
 */

/**
 * Core metadata interfaces (`ParsedFileMeta`, `CsvParsedFileMeta`, `JsonParsedFileMeta`)
 * that provide detailed diagnostic reports on parsing operations.
 */
export * from "./meta.js";

/**
 * Foundational response structures (`ValidResponse`, `ErrorResponse`) that create
 * the discriminated union pattern used by all parsers.
 */
export * from "./response.js";

/**
 * Specific response types for the `parseCSV` function (`CsvResponse`, `CsvValidResponse`).
 */
export * from "./csv.response.js";

/**
 * Specific response types for the `parseJSON` function (`JsonResponse`, `JsonValidResponse`).
 */
export * from "./json-response.js";

/**
 * Result types for data conversion functions (`CsvConversionResult`, `JsonConversionResult`).
 */
export * from "./conversion.js";

/**
 * The foundational `ParseError` interface and generic file system error types.
 */
export * from "./errors.js";

/**
 * Detailed, specific error types for CSV parsing failures (e.g., `CsvNoHeadersError`).
 */
export * from "./csv.errors.js";

/**
 * Detailed, specific error types for JSON parsing failures (e.g., `JsonInvalidRootError`).
 */
export * from "./json-errors.js";
