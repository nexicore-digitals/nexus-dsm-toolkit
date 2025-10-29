/**
 * @file Main entry point for the Nexus DSM toolkit.
 * @description This file aggregates and exports all public-facing modules,
 * functions, and types, serving as the primary internal entry point before
 * being re-exported by `main.ts`.
 * @author Owen
 */

/**
 * Core parsing functions for CSV and JSON, along with file system orchestration.
 */
export * from "./parsers/index.js";

/**
 * Adapter functions for interfacing with third-party libraries like PapaParse.
 */
export * from "@adapters/index.js";

/**
 * Data conversion functions for transforming parsed data between formats.
 */
export * from "@converters/index.js";

/**
 * All public-facing type definitions, interfaces, and error types.
 */
export * from "./types/index.js";

/**
 * Public utility classes, such as the `ParsedFileMetaBuilder`.
 */
export * from "./utils/index.js";
