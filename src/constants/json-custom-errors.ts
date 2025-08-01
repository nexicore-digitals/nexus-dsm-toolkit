import {
  JsonEmptyFileError as JsonEmptyFileErrorType,
  JsonSyntaxError as JsonSyntaxErrorType,
  JsonInvalidRootError as JsonInvalidRootErrorType,
  JsonNonObjectItemError as JsonNonObjectItemErrorType,
  JsonNoDataRowsError as JsonNoDataRowsErrorType,
  JsonUnexpectedError as JsonUnexpectedErrorType,
  JsonValidationFailedError as JsonValidationFailedErrorType,
} from "../types/json-errors";

export const jsonEmptyFileError: JsonEmptyFileErrorType = {
  name: "JsonEmptyFileError",
  message: "JSON file is empty or contains no content.",
  type: "EmptyFileError",
  code: "EmptyJsonFile",
};

export const jsonSyntaxError: JsonSyntaxErrorType = {
  name: "JsonSyntaxError",
  message: "The provided string is not valid JSON format.",
  type: "SyntaxError",
  code: "JsonSyntaxError",
};

export const jsonInvalidRootError: JsonInvalidRootErrorType = {
  name: "JsonInvalidRootError",
  message:
    "JSON file must contain an array or a single object at its root for dataset management.",
  type: "InvalidRootError",
  code: "InvalidJsonRoot",
};

export const jsonNonObjectItemError: JsonNonObjectItemErrorType = {
  name: "JsonNonObjectItemError",
  message:
    "JSON file contains an array, but not all its items are valid objects. Nested arrays or non-object items at the top level are not supported.",
  type: "NonObjectItemError",
  code: "NonObjectArrayItem",
};

export const jsonNoDataRowsError: JsonNoDataRowsErrorType = {
  name: "JsonNoDataRowsError",
  message: "JSON file contains an empty array. No data rows found.",
  type: "NoValidDataRowsError", // As added to ParseError's type union
  code: "NoJsonDataRows",
};

export const jsonUnexpectedError: JsonUnexpectedErrorType = {
  name: "JsonUnexpectedError",
  message: "An unexpected error occurred during JSON processing.",
  type: "UnexpectedError",
  code: "UnknownJsonError",
};

// This one for the orchestrator when multiple errors are found
export const jsonValidationFailedError: JsonValidationFailedErrorType = {
  name: "JsonValidationFailedError",
  message: "JSON dataset failed one or more validation checks.",
  type: "JsonValidation",
  code: "JsonValidationFailed",
};

// Also consider if you need a base interface for JSON errors, if they differ from ParseError,
// but for now, they seem to extend ParseError well.
