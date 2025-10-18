import { ParseError } from "./errors.ts";

/**
 * The base interface for all CSV-specific parsing errors.
 * It extends the generic `ParseError` with properties relevant to row-based files.
 */
export interface CsvError extends ParseError {
    /** The row number (0-based) where the error occurred. */
    row?: number | undefined;
    /** The character index within the file where the error occurred. */
    index?: number | undefined;
}

// --- Specific Error Interfaces (Arranged by Reporting Priority) ---

// 1. Fundamental / Blocking Errors
/** Error for when the CSV file is empty or contains no data. */
export interface CsvEmptyFileError extends CsvError {
    type: "EmptyFileError";
    code: "EmptyFile";
}

export interface CsvFileTooLargeError extends CsvError {
    type: "FileSizeError";
    code: "FileTooLarge";
}

/** Error for when the specified CSV file path does not exist. */
export interface CsvFileNotFoundError extends CsvError {
    type: "FileSystemError";
    code: "FileNotFound";
}

/** A generic error for file system issues encountered while reading the CSV file. */
export interface CsvFileSystemError extends CsvError {
    type: "FileSystemError";
    code: "FileReadError";
}

/** Error for when the CSV delimiter cannot be auto-detected. */
export interface CsvUndetectableDelimiter extends CsvError {
    type: "DelimiterError";
    code: "UndetectableDelimiter";
}

// 2. Structural Errors (Header / Data Rows)
/** Error for when the CSV file is missing a header row. */
export interface CsvNoHeadersError extends CsvError {
    type: "NoHeadersError";
    code: "NoHeaders";
}

export interface CsvMissingHeaderValueError extends CsvError {
    type: "MissingHeaderValueError";
    code: "MissingHeaderValue";
}

/** Error for when a CSV contains a header but no data rows. */
export interface CsvNoValidDataRowsError extends CsvError {
    type: "NoValidDataRowsError";
    code: "InvalidDataRows";
}

// 3. Syntax Errors (Quote / Field Mismatch - honoring your specific preference)
export interface CsvInvalidQuotesError extends CsvError {
    type: "SyntaxError";
    code: "InvalidQuotes";
}

/** Error for when a field in the CSV has unbalanced quotes. */
export interface CsvMissingQuotesError extends CsvError {
    type: "SyntaxError";
    code: "MissingQuotes";
}

/** Error for when a row has fewer fields than the header. */
export interface CsvTooFewFieldsError extends CsvError {
    type: "FieldMismatchError";
    code: "TooFewFields";
}

/** Error for when a row has more fields than the header. */
export interface CsvTooManyFieldsError extends CsvError {
    type: "FieldMismatchError";
    code: "TooManyFields";
}

// 4. Catch-all / Unexpected Errors
/** A fallback error for any unexpected issues during CSV parsing. */
export interface CsvUnexpectedError extends CsvError {
    type: "UnexpectedError";
    code: "UnknownError";
}

// --- Union Types (Groupings for Type Safety - order here does not affect priority) ---
type CsvSyntaxError = CsvInvalidQuotesError | CsvMissingQuotesError;

type CsvFieldMismatchError = CsvTooFewFieldsError | CsvTooManyFieldsError;

export type CsvFileLevelError =
    | CsvEmptyFileError
    | CsvFileTooLargeError
    | CsvFileNotFoundError
    | CsvFileSystemError;

/**
 * A discriminated union of all specific, concrete CSV error types.
 */
export type SpecificCsvError =
    | CsvEmptyFileError
    | CsvUndetectableDelimiter
    | CsvNoHeadersError
    | CsvMissingHeaderValueError
    | CsvNoValidDataRowsError
    | CsvSyntaxError // This union includes InvalidQuotes and MissingQuotes
    | CsvFieldMismatchError // This union includes TooFewFields and TooManyFields
    | CsvUnexpectedError
    | CsvFileLevelError;
