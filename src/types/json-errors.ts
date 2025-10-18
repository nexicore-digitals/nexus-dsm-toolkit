import { FileNotFoundError, FileSystemError, ParseError } from "./errors.ts";

/** Error for when the JSON string is syntactically incorrect. */
export interface JsonSyntaxError extends ParseError {
    type: "SyntaxError";
    code: "JsonSyntaxError";
}

/** Error for when the JSON file is empty or contains only whitespace. */
export interface JsonEmptyFileError extends ParseError {
    type: "EmptyFileError";
    code: "EmptyJsonFile";
}

/** Error for when the root of the JSON is not an object or an array. */
export interface JsonInvalidRootError extends ParseError {
    type: "InvalidRootError";
    code: "InvalidJsonRoot";
}

/** Error for when an item in a JSON array is not an object. */
export interface JsonNonObjectItemError extends ParseError {
    type: "NonObjectItemError";
    code: "NonObjectArrayItem";
}

/** Error for when a JSON array is empty or contains only empty objects. */
export interface JsonNoDataRowsError extends ParseError {
    type: "NoValidDataRowsError";
    code: "NoJsonDataRows";
}

/** A fallback error for any unexpected issues during JSON parsing. */
export interface JsonUnexpectedError extends ParseError {
    type: "UnexpectedError";
    code: "UnknownJsonError";
}

/**
 * A generic error for when multiple validation issues are found.
 * This is often used as a wrapper when detailed errors are available elsewhere.
 */
export interface JsonValidationFailedError extends ParseError {
    type: "JsonValidation";
    code: "JsonValidationFailed";
}

/**
 * Error for when the JSON file exceeds the configured size limit.
 */
export interface JsonFileTooLargeError extends ParseError {
    type: "OperationalError";
    code: "FileTooLarge";
}

/**
 * A discriminated union of all specific, concrete JSON error types.
 */
export type SpecificJsonError =
    | JsonSyntaxError
    | JsonEmptyFileError
    | JsonInvalidRootError
    | JsonNonObjectItemError
    | JsonNoDataRowsError
    | JsonUnexpectedError
    | JsonValidationFailedError
    | JsonFileTooLargeError
    | FileSystemError
    | FileNotFoundError;
