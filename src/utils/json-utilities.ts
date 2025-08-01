import {
  jsonEmptyFileError,
  jsonInvalidRootError,
  jsonNoDataRowsError,
  jsonNonObjectItemError,
  jsonSyntaxError,
} from "../constants/json-custom-errors";
import { ParseError } from "../types/errors";
import { SpecificJsonError } from "../types/json-errors";

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
