import { ParseError } from "./errors";

export interface CsvError extends ParseError {
  row?: number | undefined;
  index?: number | undefined;
}

export interface CsvInvalidQuotesError extends CsvError {
  type: "SyntaxError";
  code: "InvalidQuotes";
}

export interface CsvNoHeadersError extends CsvError {
  type: "NoHeadersError";
  code: "NoHeaders";
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

export interface CsvNoValidDataRowsError extends CsvError {
  type: "NoValidDataRowsError";
  code: "InvalidDataRows";
}

export interface CsvEmptyFileError extends CsvError {
  type: "EmptyFileError";
  code: "EmptyFile";
}

export interface CsvUndetectableDelimiter extends CsvError {
  type: "DelimiterError";
  code: "UndetectableDelimiter";
}

export interface CsvUnexpectedError extends CsvError {
  type: "UnexpectedError";
  code: "UnknownError";
}

type CsvSyntaxError = CsvInvalidQuotesError | CsvMissingQuotesError;

type CsvFieldMismatchError = CsvTooFewFieldsError | CsvTooManyFieldsError;

export type SpecificCsvError =
  | CsvSyntaxError
  | CsvEmptyFileError
  | CsvNoHeadersError
  | CsvFieldMismatchError
  | CsvNoValidDataRowsError
  | CsvUnexpectedError
  | CsvUndetectableDelimiter;
