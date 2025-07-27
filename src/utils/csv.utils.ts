import { transformPapaParseError } from "../adapters/papaparse.adapter.js";
import { SpecificCsvError } from "../types/csv.errors";
import { CsvErrorResponse, CsvResponse } from "../types/csv.response";
import { csvEmptyFileError } from "./csv.custom_errors.js";
import {
  validateDataRows,
  validateHeaders,
  validateQuoteBalance,
} from "./csv.helper_functions.js";
import readFile from "./filereader.util.js";

export default async function parseCSV(file: File): Promise<CsvResponse> {
  const customErrors: SpecificCsvError[] = [];
  const response = await readFile(file);
  if (!response.success)
    return {
      success: false,
      name: "FileReadError",
      message: response.message,
      type: "FileReadError",
      code: "CSVFileReadError",
    };

  const csv = response.content;

  // check for empty files
  if (csv.trim().length === 0) customErrors.push(csvEmptyFileError);

  const result = window.Papa.parse(csv, { dynamicTyping: true, header: true });
  const { meta, data, errors = [] } = result;
  const fields = meta?.fields ?? [];

  /* papaparse merged it's result.meta.errors into result.errors */

  if (fields) {
    // check for invalid headers
    const invalidHeadersError = validateHeaders(fields);
    if (invalidHeadersError) customErrors.push(invalidHeadersError);

    if (data) {
      // check for invalid data rows
      const invalidDataRows = validateDataRows(data as object[], fields);
      if (invalidDataRows) customErrors.push(invalidDataRows);

      // custom extra check for inbalanced quotes
      customErrors.push(...validateQuoteBalance(result.data as object[]));
    }
  }

  if (Array.isArray(result.errors)) {
    result.errors.forEach((error) => {
      customErrors.push(transformPapaParseError(error));
    });
  }

  if (customErrors.length === 0) {
    const customResult: CsvResponse = {
      meta,
      data,
      success: true,
    };
    return customResult;
  } else {
    const primaryError = customErrors[0]; // Get the first error for the main message

    const errorResponse: CsvErrorResponse = {
      // Use CsvErrorResponse interface
      success: false,
      name: primaryError.name,
      message: primaryError.message,
      type: primaryError.type,
      code: primaryError.code,
      detailedErrors: customErrors, // Include all collected errors
    };
    return errorResponse;
  }
}
