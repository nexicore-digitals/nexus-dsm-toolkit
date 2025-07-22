import { ParseError } from "./errors";

export interface CSVError extends ParseError {
  row?: number;
}

export interface CSVInvalidQuotesError extends CSVError {
  type: "SyntaxError";
  code: "InvalidQuotes";
  row: number;
}

export interface CSVNoHeadersError extends CSVError {
  type: "NoHeadersError";
  code: "NoHeaders";
}

export interface CSVMissingQuotesError extends CSVError {
  type: "SyntaxError";
  code: "MissingQuotes";
  row: number;
}

export interface CSVTooFewFieldsError extends CSVError {
  type: "FieldMisMatchError";
  code: "TooFewFields";
  row: number;
}

export interface CSVTooManyFieldsError extends CSVError {
  type: "FieldMisMatchError";
  code: "TooManyFields";
  row: number;
}

export interface CSVNoValidDataRowsError extends CSVError {
  type: "NoValidDataRowsError";
  code: "InvalidDataRows";
}

export interface CSVEmptyFileError extends CSVError {
  type: "EmptyFileError";
  code: "EmptyFile";
}

export interface CSVUndetectableDelimiter extends CSVError {
  type: "ParseError";
  code: "UndetectableDelimiter";
}

export interface CSVUnexpectedError extends CSVError {
  type: "UnexpectedError";
  code: "UnknownError";
}

type CSVSyntaxError = CSVInvalidQuotesError | CSVMissingQuotesError;

type CSVFieldMismatchError = CSVTooFewFieldsError | CSVTooManyFieldsError;

export type SpecificCSVError =
  | CSVSyntaxError
  | CSVEmptyFileError
  | CSVNoHeadersError
  | CSVFieldMismatchError
  | CSVNoValidDataRowsError
  | CSVUnexpectedError
  | CSVUndetectableDelimiter;
