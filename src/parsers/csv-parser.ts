import Papa from "papaparse";
import { CsvErrorResponse, CsvResponse } from "../types/csv.response";
import { SpecificCsvError } from "../types/csv.errors";
import {
  normalizeToContent,
  validateDataRows,
  validateHeaders,
  validateQuoteBalance,
} from "../utils/csv-utilities";
import { csvEmptyFileError } from "../constants/csv-custom-errors";
import { transformPapaParseError } from "../adapters/papaparse.adapter";

export default async function parseCSV(
  file: File | string
): Promise<CsvResponse> {
  const customErrors: SpecificCsvError[] = [];
  const fileOrStringData = await normalizeToContent(file);

  if (!fileOrStringData.success) {
    return {
      success: false,
      name: "FileReadError",
      message: fileOrStringData.message,
      type: "FileReadError",
      code: "CSVFileReadError",
    };
  }

  const csv = fileOrStringData.content;

  // check for empty files
  if (csv.trim().length === 0) customErrors.push(csvEmptyFileError);

  const result = Papa.parse(csv, { dynamicTyping: true, header: true });

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
