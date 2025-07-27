import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import parseCSV from "../../../src/utils/csv.utils.js";
import readFile from "../../../src/utils/filereader.util.js";
import { EMPTY_FILE, NO_HEADERS } from "../../fixtures/csv/mockCsvData.js";

vi.mock("../../../src/utils/filereader.util.js", () => ({
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
      expect(result.message).toBe("CSV file is empty or contains no data.");
    }
  });
  it("should handle CSV file with no headers", async () => {
    const mockFile = new File(
      ["1,Alice,alice@example.com\n2,Bob,bob@example.com"],
      "no-headers.csv",
      {
        type: "text/csv",
      }
    );
    (readFile as Mock).mockReturnValueOnce(NO_HEADERS);

    const result = await parseCSV(mockFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("CSVNoHeadersError");
      expect(result.message).toBe(
        "CSV file has no valid headers. Ensure the first line is not empty."
      );
    }
  });
});
