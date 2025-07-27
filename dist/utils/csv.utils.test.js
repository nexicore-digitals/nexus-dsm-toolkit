import { describe, it, expect, vi, beforeAll } from "vitest";
import parseCSV from "./csv.utils.js";
import readFile from "./filereader.util.js";
vi.mock("./filereader.util.js", () => ({
    default: vi.fn(),
}));
beforeAll(() => {
    vi.clearAllMocks();
});
describe("CSV Utils Tests", () => {
    it("should handle empty CSV file", async () => {
        readFile.mockReturnValue({
            success: false,
            content: "",
        });
        const mockFile = new File([""], "empty.csv", { type: "text/csv" });
        const result = await parseCSV(mockFile);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("CSVEmptyFileError");
            expect(result.message).toBe("CSV file is empty or contains no data.");
        }
    });
});
//# sourceMappingURL=csv.utils.test.js.map