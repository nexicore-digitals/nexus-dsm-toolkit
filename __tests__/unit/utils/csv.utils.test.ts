import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import {
  EMPTY_FILE,
  MISSING_QUOTES,
  NO_HEADERS,
} from "../../fixtures/csv/mockCsvData";
import readFile from "../../../src/utils/read-file";
import parseCSV from "../../../src/parsers/csv-parser.js";

vi.mock("../../../src/utils/read-file", () => ({
  default: vi.fn(),
}));

beforeAll(() => {
  vi.clearAllMocks();
});

describe("CSV Utils Tests", () => {
  it("should handle empty CSV file", async () => {
    (readFile as Mock).mockReturnValueOnce(EMPTY_FILE);
    const mockFile = new File([""], "empty.csv", { type: "text/csv" });
    const result = await parseCSV(mockFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("CSVEmptyFileError");
      expect(result.code).toBe("EmptyFile");
    }
  });
  it("should handle CSV file with no headers", async () => {
    const mockFile = new File([""], "no-headers.csv", {
      type: "text/csv",
    });
    (readFile as Mock).mockReturnValueOnce(NO_HEADERS);

    const result = await parseCSV(mockFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("CSVNoHeadersError");
      expect(result.code).toBe("NoHeaders");
    }
  });
  it("should handle missing quotes in CSV", async () => {
    const mockFile = new File([""], "missingQuotesCSV", { type: "text/csv" });
    (readFile as Mock).mockReturnValueOnce(MISSING_QUOTES);
    const result = await parseCSV(mockFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("CSVMissingQuotesError");
      expect(result.code).toBe("MissingQuotes");
    }
  });
});
