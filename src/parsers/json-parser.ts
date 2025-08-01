import { SpecificJsonError } from "../types/json-errors";
import { JsonResponse } from "../types/json-response";
import {
  checkEmptyJson,
  checkJsonNonObjectItem,
  checkJsonSyntax,
  isJson,
  validateJsonEmptyObjects,
  validateJsonNoDataRows,
  validateJsonRootStructure,
} from "../utils/json-utilities";

export default async function parseJSON(data: string): Promise<JsonResponse> {
  let parsedData: unknown;
  const customErrors: SpecificJsonError[] = [];
  customErrors.push(...checkEmptyJson(data));
  customErrors.push(...checkJsonSyntax(data));

  if (isJson(data)) parsedData = JSON.parse(data);
  customErrors.push(...validateJsonRootStructure(parsedData));

  if (Array.isArray(parsedData)) {
    customErrors.push(...checkJsonNonObjectItem(parsedData));
    customErrors.push(...validateJsonNoDataRows(parsedData));
    customErrors.push(...validateJsonEmptyObjects(parsedData));
  }

  if (customErrors.length > 0) {
    const primaryError = customErrors[0];
    return {
      success: false,
      name: primaryError.name,
      type: primaryError.type,
      code: primaryError.code,
      message: primaryError.message,
      detailedErrors: customErrors,
    };
  } else return { success: true, data: parsedData as object | object[] };
}
