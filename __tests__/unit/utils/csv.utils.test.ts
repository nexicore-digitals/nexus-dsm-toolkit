import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import {
  EMPTY_FILE,
  INVALID_QUOTES,
  MISSING_QUOTES,
  NO_HEADERS,
  TOO_FEW_FIELDS,
  TOO_MANY_FIELDS,
} from "../../fixtures/csv/mockCsvData";
import parseCSV from "../../../src/parsers/csv-parser.js";

describe("CSV Parsing tests", () => {
  it("should gracefully handle empty CSV file", async () => {
    const result = await parseCSV(EMPTY_FILE.content);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("CSVEmptyFileError");
      expect(result.code).toBe("EmptyFile");
    }
  });
  it("should handle CSV file with no headers", async () => {
    const result = await parseCSV(NO_HEADERS.content);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("CSVNoHeadersError");
      expect(result.code).toBe("NoHeaders");
    }
  });
  describe("should handle malformed quotes correctly", () => {
    it("should properly handle missing quotes", async () => {
      const result = await parseCSV(MISSING_QUOTES.content);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.name).toBe("CSVMissingQuotesError");
        expect(result.code).toBe("MissingQuotes");
      }
    });
    it("should handle invalid quotes in csv", async () => {
      const result = await parseCSV(INVALID_QUOTES.content);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.name).toBe("CSVInvalidQuotesError");
        expect(result.code).toBe("InvalidQuotes");
      }
    });
  });
  describe("should properly handle field mismatch", () => {
    it("should handle too few fields in csv", async () => {
      const result = await parseCSV(TOO_FEW_FIELDS.content);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.name).toBe("CSVTooFewFieldsError");
        expect(result.code).toBe("TooFewFields");
      }
    });
    it("should handle too many fields in csv", async () => {
      const result = await parseCSV(TOO_MANY_FIELDS.content);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.name).toBe("CSVTooManyFieldsError");
        expect(result.code).toBe("TooManyFields");
      }
    });
  });
});
