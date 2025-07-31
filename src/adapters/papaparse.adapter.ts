// import from @types/papaparse/index.d.ts
import { ParseError as PapaParseRawError } from "papaparse";
import {
  CsvInvalidQuotesError,
  CsvMissingQuotesError,
  CsvTooFewFieldsError,
  CsvTooManyFieldsError,
  CsvUndetectableDelimiter,
  CsvUnexpectedError,
  SpecificCsvError,
} from "../types/csv.errors";

/**
 * Adapts a single raw error object from Papa Parse into a specific,
 * standardized custom CSV error instance.
 *
 * This function is designed to be used when processing the `errors` and `meta.errors`
 * arrays returned by Papa Parse, converting them into Nexus DSM's internal
 * error hierarchy for consistent handling and detailed reporting.
 *
 * @param {PapaParseRawError} papaError - The raw error object provided by Papa Parse.
 * @returns {SpecificCsvError} A specific custom CSV error instance (e.g., CsvMissingQuotesError),
 * conforming to the ParseError hierarchy.
 */
export function transformPapaParseError(
  papaError: PapaParseRawError
): SpecificCsvError {
  switch (papaError.code) {
    case "MissingQuotes":
      const missingQuotesError: CsvMissingQuotesError = {
        name: "CSVMissingQuotesError",
        message: `Missing quote on line ${
          papaError.row !== undefined ? papaError.row + 1 : "N/A"
        }. ${papaError.message}`,
        type: "SyntaxError",
        code: "MissingQuotes",
        row: papaError.row !== undefined ? papaError.row : undefined,
        index: papaError.index,
      };
      return missingQuotesError;

    case "InvalidQuotes":
      const invalidQuotesError: CsvInvalidQuotesError = {
        name: "CSVInvalidQuotesError",
        message: `Malformed quote on line ${
          papaError.row !== undefined ? papaError.row + 1 : "N/A"
        }. ${papaError.message}`,
        type: "SyntaxError",
        code: "InvalidQuotes",
        row: papaError.row !== undefined ? papaError.row : undefined,
        index: papaError.index,
      };
      return invalidQuotesError;

    case "UndetectableDelimiter":
      const undetectableDelimiterError: CsvUndetectableDelimiter = {
        name: "CSVUndetectableDelimiterError",
        message: `Unable to auto-detect delimiter. ${papaError.message}`,
        type: "DelimiterError",
        code: "UndetectableDelimiter",
      };
      return undetectableDelimiterError;

    case "TooFewFields":
      const tooFewFieldsError: CsvTooFewFieldsError = {
        name: "CSVTooFewFieldsError",
        message: `Too few fields on line ${
          papaError.row !== undefined ? papaError.row + 1 : "N/A"
        }. Expected more columns. ${papaError.message}`,
        type: "FieldMismatchError",
        code: "TooFewFields",
        row: papaError.row !== undefined ? papaError.row : undefined,
      };
      return tooFewFieldsError;

    case "TooManyFields":
      const tooManyFieldsError: CsvTooManyFieldsError = {
        name: "CSVTooManyFieldsError",
        message: `Too many fields on line ${
          papaError.row !== undefined ? papaError.row + 1 : "N/A"
        }. Expected fewer columns. ${papaError.message}`,
        type: "FieldMismatchError",
        code: "TooManyFields",
        row: papaError.row !== undefined ? papaError.row : undefined,
      };
      return tooManyFieldsError;

    default:
      // Fallback for any other unexpected or unhandled Papa Parse errors
      const unexpectedError: CsvUnexpectedError = {
        name: "CSVUnexpectedError",
        message: `An unknown Papa Parse error occurred: ${
          papaError.message
        } (Code: ${papaError.code || "N/A"})`,
        type: "UnexpectedError",
        code: "UnknownError",
        row: papaError.row,
        index: papaError.index,
      };
      return unexpectedError;
  }
}
