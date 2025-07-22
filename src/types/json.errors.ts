import { ParseError } from "./errors";

export interface JSONSyntaxError extends ParseError {
  type: "SyntaxError";
  code: "JsonSyntaxError";
}

export interface JSONEmptyFileError extends ParseError {
  type: "EmptyFileError";
  code: "EmptyJsonFile";
}

export interface JSONInvalidRootError extends ParseError {
  type: "InvalidRootError";
  code: "InvalidJsonRoot";
}

export interface JSONNonObjectItemError extends ParseError {
  type: "NonObjectItemError";
  code: "NonObjectArrayItem";
}

export interface JSONNoDataRowsError extends ParseError {
  type: "NoDataRowsError";
  code: "NoJsonDataRows";
}

export interface JSONUnexpectedError extends ParseError {
  type: "UnexpectedError";
  code: "UnknownJsonError";
}

export type SpecificJSONError =
  | JSONSyntaxError
  | JSONEmptyFileError
  | JSONInvalidRootError
  | JSONNonObjectItemError
  | JSONNoDataRowsError
  | JSONUnexpectedError;
