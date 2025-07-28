import Papa from "papaparse";
import { CsvErrorResponse, CsvResponse } from "../types/csv.response";
import { CsvUnexpectedError, SpecificCsvError } from "../types/csv.errors";
import {
  validateDataRows,
  validateHeaders,
  validateQuoteBalance,
} from "../utils/csv-utilities";
import { csvEmptyFileError } from "../constants/csv-custom-errors";
import { transformPapaParseError } from "../adapters/papaparse.adapter";
import { sortCsvErrorsByPriority } from "../utils/csv-error-priority";

export default async function parseCSV(file: string): Promise<CsvResponse> {
  const customErrors: SpecificCsvError[] = [];
  const csv = file;

  // check for empty files
  if (csv.trim().length === 0) customErrors.push(csvEmptyFileError);
  try {
    const result = Papa.parse(csv, {
      dynamicTyping: true,
      header: true,
      comments: "#",
    });

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
      const sortedErrors = sortCsvErrorsByPriority(customErrors);
      const primaryError = sortedErrors[0]; // Get the first error for the main message

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
  } catch (error) {
    const originalError =
      error instanceof Error ? error : new Error(String(error));
    if (!customErrors.some((e) => e.code === "UnknownError")) {
      customErrors.push({
        name: "CSVUnexpectedError",
        type: "UnexpectedError",
        code: "UnknownError",
        message: `An unexpected error occurred: ${originalError.message}`,
        // Add other properties if available, like row/index if it's a parse error
      } as CsvUnexpectedError);
    }
    if (customErrors.length > 0) {
      // <--- This is the key condition
      const sortedErrors = sortCsvErrorsByPriority(customErrors);
      return {
        name: sortedErrors[0].name,
        success: false,
        detailedErrors: sortedErrors,
        type: sortedErrors[0].type,
        code: sortedErrors[0].code,
        message: sortedErrors[0].message,
      }; // Returns failure
    } else {
      return { success: true, data: [], meta: undefined }; // Only returns success if NO errors were detected
    }
  }
}
