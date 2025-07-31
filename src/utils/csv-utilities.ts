import { SpecificCsvError } from "../types/csv-errors";
import {
  csvMissingHeaderValueError,
  csvNoHeadersError,
  csvNoValidDataRowsError,
} from "../constants/csv-custom-errors";

export function csvQuoteCount(field: string): number {
  if (!field) return 0;
  return field.match(/"/g)?.length ?? 0;
}

export function validateQuoteBalance(data: object[]): SpecificCsvError[] {
  const quoteErrors: SpecificCsvError[] = [];

  data.forEach((row, rowIndex) => {
    Object.entries(row).forEach(([key, value]) => {
      if (csvQuoteCount(value?.toString() ?? "") % 2 !== 0) {
        quoteErrors.push({
          name: "CSVMissingQuotesError",
          message: `Row ${rowIndex + 1}, field "${key}" has unbalanced quotes.`,
          type: "SyntaxError",
          code: "MissingQuotes",
        });
      }
    });
  });

  return quoteErrors;
}

export function validateHeaders(fields?: string[]): SpecificCsvError | null {
  if (!fields || fields.length === 0) return csvNoHeadersError;
  else if (fields && fields.some((field) => field === ""))
    return csvMissingHeaderValueError;

  const looksLikeData = fields.some(
    (field) => /^[A-Z]/.test(field.trim()) || !isNaN(Number(field))
  );

  return looksLikeData ? csvNoHeadersError : null;
}

export function validateDataRows(
  data: object[],
  fields?: string[]
): SpecificCsvError | null {
  return data.length === 0 && fields && fields.length > 0
    ? csvNoValidDataRowsError
    : null;
}
