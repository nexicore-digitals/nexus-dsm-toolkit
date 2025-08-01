import { SpecificJsonError } from "../types/json-errors";
import { JsonResponse } from "../types/json-response";
import {
  checkEmptyJson,
  checkForMultipleErrors,
  checkJsonNonObjectItem,
  checkJsonSyntax,
  createErrorResponse,
  isJson,
  validateJsonEmptyObjects,
  validateJsonNoDataRows,
  validateJsonRootStructure,
} from "../utils/json-utilities";

export default async function parseJSON(data: string): Promise<JsonResponse> {
  let parsedData: unknown;
  const customErrors: SpecificJsonError[] = [];

  if (customErrors.length > 0) return createErrorResponse(customErrors);

  customErrors.push(...checkEmptyJson(data));
  customErrors.push(...checkJsonSyntax(data));

  if (isJson(data)) parsedData = JSON.parse(data);
  customErrors.push(...validateJsonRootStructure(parsedData));

  if (Array.isArray(parsedData)) {
    customErrors.push(...checkJsonNonObjectItem(parsedData));
    customErrors.push(...validateJsonNoDataRows(parsedData));
    customErrors.push(...validateJsonEmptyObjects(parsedData));
  }

  customErrors.push(...checkForMultipleErrors(customErrors));

  if (customErrors.length > 0) return createErrorResponse(customErrors);
  else return { success: true, data: parsedData as object | object[] };
}
