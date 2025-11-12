/**
 * @file Exports the core parsing and file analysis functions.
 * @description This module provides the primary entry points for data parsing,
 * including `parseCSV` and `parseJSON`. It also exposes orchestration functions
 * like `analyzeCsvFile` and `parseJsonFromFile` that handle file system
 * interactions before passing content to the core parsers.
 * @author Owen
 */

/**
 * The primary entry point for CSV parsing. It can process a CSV from a file path or a raw string.
 * @see {@link parseCSV} for detailed documentation and examples.
 */
export { default as parseCSV } from "./csv-parser.js";

/**
 * The primary entry point for JSON parsing. It can process JSON from a file path or a raw string.
 * @see {@link parseJSON} for detailed documentation and examples.
 */
export { default as parseJSON } from "./json-parser.js"; // String/object based JSON parser

/**
 * An orchestration function that reads a CSV file, checks its size, and returns its content and initial diagnostics.
 */
export { parseCsvFromFile } from "./csv-parser-orchestration.js"; // File-based CSV parser (can use streaming)
export { parseCsvStream } from "./csv-stream-parser.js"; // Stream-based CSV parser
export {
    analyzeFileMetadata,
    readFileContent,
} from "../../src/utils/file-analysis.js"; // File analysis utilities

/**
 * An orchestration function that reads a JSON file from a path and passes its content to the core `parseJSON` function.
 */
export { default as parseJsonFromFile } from "./json-parser-orchestration.js";
export { parseJsonStream } from "./json-stream-parser.js";
