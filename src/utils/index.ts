/**
 * @file Exports public-facing utility classes and functions.
 * @description This module provides access to helper classes like the
 * `ParsedFileMetaBuilder` for advanced metadata creation, and standalone
 * analysis functions for deeper inspection of JSON structures.
 * @author Owen
 */

export { ParsedFileMetaBuilder } from "./parsed-file-meta-builder.js";
export {
    calculateNestingDepth,
    checkKeyConsistency,
} from "./json-analysis-utilities.js";
