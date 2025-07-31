import { ParseError } from "./errors";

// Base CSV error interface - should always be at the top
export interface CsvError extends ParseError {
  row?: number | undefined;
  index?: number | undefined;
}

// --- Specific Error Interfaces (Arranged by Reporting Priority) ---

// 1. Fundamental / Blocking Errors
export interface CsvEmptyFileError extends CsvError {
  type: "EmptyFileError";
  code: "EmptyFile";
}

export interface CsvUndetectableDelimiter extends CsvError {
  type: "DelimiterError";
  code: "UndetectableDelimiter";
}

// 2. Structural Errors (Header / Data Rows)
export interface CsvNoHeadersError extends CsvError {
  type: "NoHeadersError";
  code: "NoHeaders";
}

export interface CsvMissingHeaderValueError extends CsvError {
  type: "MissingHeaderValueError";
  code: "MissingHeaderValue";
}

export interface CsvNoValidDataRowsError extends CsvError {
  type: "NoValidDataRowsError";
  code: "InvalidDataRows";
}

// 3. Syntax Errors (Quote / Field Mismatch - honoring your specific preference)
export interface CsvInvalidQuotesError extends CsvError {
  type: "SyntaxError";
  code: "InvalidQuotes";
}

export interface CsvMissingQuotesError extends CsvError {
  type: "SyntaxError";
  code: "MissingQuotes";
}

export interface CsvTooFewFieldsError extends CsvError {
  type: "FieldMismatchError";
  code: "TooFewFields";
}

export interface CsvTooManyFieldsError extends CsvError {
  type: "FieldMismatchError";
  code: "TooManyFields";
}

// 4. Catch-all / Unexpected Errors
export interface CsvUnexpectedError extends CsvError {
  type: "UnexpectedError";
  code: "UnknownError";
}

// --- Union Types (Groupings for Type Safety - order here does not affect priority) ---
type CsvSyntaxError = CsvInvalidQuotesError | CsvMissingQuotesError;

type CsvFieldMismatchError = CsvTooFewFieldsError | CsvTooManyFieldsError;

export type SpecificCsvError =
  | CsvEmptyFileError
  | CsvUndetectableDelimiter
  | CsvNoHeadersError
  | CsvMissingHeaderValueError
  | CsvNoValidDataRowsError
  | CsvSyntaxError // This union includes InvalidQuotes and MissingQuotes
  | CsvFieldMismatchError // This union includes TooFewFields and TooManyFields
  | CsvUnexpectedError;
