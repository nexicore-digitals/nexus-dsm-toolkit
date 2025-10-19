/**
 * @file Exports data conversion and structure normalization functions.
 * @description This module provides functions for converting parsed data between
 * formats, such as `convertToCsv` and `convertFromJson`. It also includes
 * structure normalization helpers like `convertCsvStructure` and
 * `convertJsonStructure` to prepare data for serialization.
 * @author Owen
 */

/**
 * Provides `convertToCsv` for serializing data into a CSV string, and
 * `convertCsvStructure` for creating a normalized tabular payload from parsed CSV data.
 */
export * from "./csv-converter.js";

/**
 * Provides `convertFromJson` for serializing data into a JSON string, and
 * `convertJsonStructure` for creating a normalized, structure-aware payload
 * from parsed JSON data.
 */
export * from "./json-converter.js";
