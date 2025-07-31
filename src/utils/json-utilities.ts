import { ParseError } from "../types/errors";
import {
  JSONEmptyFileError,
  JSONInvalidRootError,
  JSONNoDataRowsError,
  JSONNonObjectItemError,
  JSONSyntaxError,
  JSONUnexpectedError,
} from "../types/json-errors";
import { JsonResponse } from "../types/json-response";

export async function isJson(data: string): Promise<JsonResponse> {
  let parsedData: unknown; // Start with 'unknown' for safety

  try {
    if (data.trim().length === 0) {
      const error: JSONEmptyFileError = {
        name: "JSONEmptyFileError",
        message: "JSON file is empty or contains no data.",
        type: "EmptyFileError",
        code: "EmptyJsonFile",
      };
      throw error;
    }

    parsedData = JSON.parse(data);

    // Case 1: Root is an Array
    if (Array.isArray(parsedData)) {
      if (
        parsedData.some(
          (item: any) =>
            typeof item !== "object" || item === null || Array.isArray(item)
        )
      ) {
        const error: JSONNonObjectItemError = {
          name: "JSONNonObjectItemError",
          message:
            "JSON file contains an array, but not all its items are valid objects. Nested arrays or non-object items at the top level are not supported.",
          type: "NonObjectItemError",
          code: "NonObjectArrayItem",
        };
        throw error;
      }
      if (parsedData.length === 0) {
        const error: JSONNoDataRowsError = {
          name: "JSONNoDataRowsError",
          message: "JSON file contains an empty array. No data rows found.",
          type: "NoValidDataRowsError",
          code: "NoJsonDataRows",
        };
        throw error;
      }
      // If all checks pass for an array, return success
      return { success: true, data: parsedData as object[] };
    }
    // Case 2: Root is a single Object
    else if (typeof parsedData === "object" && parsedData !== null) {
      return { success: true, data: parsedData as object };
    }
    // Case 3: Other non-array, non-object root types (e.g., string, number, boolean, null)
    else {
      const error: JSONInvalidRootError = {
        name: "JSONInvalidRootError",
        message:
          "JSON file must contain an array or a single object at its root for dataset management.",
        type: "InvalidRootError",
        code: "InvalidJsonRoot",
      };
      throw error;
    }
  } catch (err: any) {
    if (err instanceof SyntaxError) {
      const syntaxError: JSONSyntaxError = {
        name: "JSONSyntaxError",
        message: `Invalid JSON format: ${err.message}.`,
        type: "SyntaxError",
        code: "JsonSyntaxError",
      };
      return {
        success: false,
        message: syntaxError.message,
        type: syntaxError.type,
        name: syntaxError.name,
        detailedErrors: [syntaxError],
        code: syntaxError.code,
      };
    }
    // Catch specific errors thrown by our own validation logic (which extend ParseError)
    else if (err instanceof Error && (err as unknown as ParseError).type) {
      // If it's one of our custom ParseErrors, return its message
      const customError = err as ParseError;
      return {
        success: false,
        message: customError.message,
        name: customError.name,
        type: customError.type,
        detailedErrors: [customError],
      };
    }
    // Catch any truly unexpected errors that don't fit our custom error types
    else {
      const unexpectedError: JSONUnexpectedError = {
        name: "JSONUnexpectedError",
        message: `An unexpected error occurred during JSON processing: ${String(
          err
        )}`,
        type: "UnexpectedError",
        code: "UnknownJsonError",
      };
      return {
        name: unexpectedError.name,
        success: false,
        message: unexpectedError.message,
        type: unexpectedError.type,
        detailedErrors: [unexpectedError],
        code: unexpectedError.code,
      };
    }
  }
}
