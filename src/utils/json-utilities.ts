import {
  jsonEmptyFileError,
  jsonInvalidRootError,
  jsonNoDataRowsError,
  jsonNonObjectItemError,
  jsonSyntaxError,
  jsonValidationFailedError,
} from "../constants/json-custom-errors";
import { SpecificJsonError } from "../types/json-errors";
import { JsonResponse } from "../types/json-response";

export function isJson(data: string): boolean {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
}

export function checkJsonSyntax(data: string): SpecificJsonError[] {
  if (isJson(data)) return [];
  return [jsonSyntaxError];
}

export function checkEmptyJson(data: string): SpecificJsonError[] {
  if (data.trim().length === 0) {
    return [jsonEmptyFileError];
  }
  return [];
}

export function checkJsonNonObjectItem(parsedData: any[]): SpecificJsonError[] {
  if (
    parsedData.some(
      (item: any) =>
        typeof item !== "object" || item === null || Array.isArray(item)
    )
  )
    return [jsonNonObjectItemError];
  else {
    return [];
  }
}

export function validateJsonRootStructure(
  parsedData: unknown
): SpecificJsonError[] {
  if (
    Array.isArray(parsedData) ||
    (typeof parsedData === "object" && parsedData !== null)
  )
    return [];
  else return [jsonInvalidRootError];
}

export function validateJsonNoDataRows(parsedData: any[]): SpecificJsonError[] {
  if (parsedData.length === 0) {
    return [jsonNoDataRowsError]; // Return error for a truly empty array
  }
  return [];
}

export function validateJsonEmptyObjects(
  parsedData: object[]
): SpecificJsonError[] {
  if (parsedData.length === 0) {
    return [];
  }

  const allObjectsAreEmpty = parsedData.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      Object.keys(item).length === 0
  );

  if (allObjectsAreEmpty) {
    return [
      {
        ...jsonNoDataRowsError,
        message:
          "JSON array contains only empty objects. No valid data rows found.",
      },
    ];
  }
  return [];
}

export function checkForMultipleErrors(
  error: SpecificJsonError[]
): SpecificJsonError[] {
  if (error.length > 1) return [jsonValidationFailedError];
  else return [];
}

export function createErrorResponse(errors: SpecificJsonError[]): JsonResponse {
  if (errors.length === 0) {
    throw new Error("Cannot create an error response from an empty array.");
  }
  const primaryError = errors[0];
  return {
    success: false,
    name: primaryError.name,
    message: primaryError.message,
    type: primaryError.type,
    code: primaryError.code,
    detailedErrors: errors,
  };
}
