import { ParseError } from "./errors";

export interface JsonSyntaxError extends ParseError {
  type: "SyntaxError";
  code: "JsonSyntaxError";
}

export interface JsonEmptyFileError extends ParseError {
  type: "EmptyFileError";
  code: "EmptyJsonFile";
}

export interface JsonInvalidRootError extends ParseError {
  type: "InvalidRootError";
  code: "InvalidJsonRoot";
}

export interface JsonNonObjectItemError extends ParseError {
  type: "NonObjectItemError";
  code: "NonObjectArrayItem";
}

export interface JsonNoDataRowsError extends ParseError {
  type: "NoValidDataRowsError";
  code: "NoJsonDataRows";
}

export interface JsonUnexpectedError extends ParseError {
  type: "UnexpectedError";
  code: "UnknownJsonError";
}

export interface JsonValidationFailedError extends ParseError {
  type: "JsonValidation";
  code: "JsonValidationFailed";
}

export type SpecificJsonError =
  | JsonSyntaxError
  | JsonEmptyFileError
  | JsonInvalidRootError
  | JsonNonObjectItemError
  | JsonNoDataRowsError
  | JsonUnexpectedError
  | JsonValidationFailedError;
