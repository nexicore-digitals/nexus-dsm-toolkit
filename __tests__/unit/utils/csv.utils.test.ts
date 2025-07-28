import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import {
  EMPTY_FILE,
  INVALID_QUOTES,
  MISSING_QUOTES,
  NO_HEADERS,
} from "../../fixtures/csv/mockCsvData";
import parseCSV from "../../../src/parsers/csv-parser.js";

describe("CSV Utils Tests", () => {
  it("should handle empty CSV file", async () => {
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
  it("should handle missing quotes in CSV", async () => {
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
