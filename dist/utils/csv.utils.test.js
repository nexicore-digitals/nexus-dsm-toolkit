import { describe, it, expect, vi } from "vitest";
import parseCSV from "./csv.utils.js";
vi.mock("./filereader.util.js", () => ({
    default: vi.fn(() => Promise.resolve({ success: true, content: "" })),
}));
describe("CSV Utils Tests", () => {
    it("should handle empty CSV file", async () => {
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