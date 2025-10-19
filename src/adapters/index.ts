/**
 * @file Exports adapter functions for interfacing with third-party libraries.
 * @description This module provides functions like `transformPapaParseError` to
 * convert raw errors from libraries like PapaParse into the standardized
 * error format used throughout Nexus DSM.
 * @author Owen
 */

/**
 * Provides the `transformPapaParseError` function, which converts raw error
 * objects from the PapaParse library into specific, standardized error types
 * used within Nexus DSM.
 */
export * from "./papaparse.adapter.js";
