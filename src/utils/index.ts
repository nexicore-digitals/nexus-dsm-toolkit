/**
 * @file Exports public-facing utility classes and functions.
 * @description This module provides access to helper classes like the
 * `ParsedFileMetaBuilder` for programmatic metadata creation, and standalone
 * analysis functions for deeper inspection of JSON structures.
 * @author Owen
 */

/**
 * Provides the `ParsedFileMetaBuilder` class, a fluent interface for
 * programmatically constructing detailed metadata objects for CSV and JSON files.
 * @see {@link ParsedFileMetaBuilder} for detailed method documentation.
 */
export { ParsedFileMetaBuilder } from "./parsed-file-meta-builder.js";

/**
 * Provides standalone utility functions for analyzing JSON structures.
 * Includes `calculateNestingDepth` to measure object complexity and
 * `checkKeyConsistency` to validate tabular data structures.
 */
export {
    calculateNestingDepth,
    checkKeyConsistency,
} from "./json-analysis-utilities.js";
