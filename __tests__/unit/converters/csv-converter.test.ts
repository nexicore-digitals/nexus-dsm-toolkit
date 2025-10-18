import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    convertCsvStructure,
    convertToCsv,
} from "../../../src/converters/csv-converter.ts";
import { CsvResponse } from "../../../src/types/csv.response.ts";

vi.useFakeTimers();
vi.setSystemTime(new Date("2023-01-01T00:00:00.000Z"));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("CSV Conversion Logic", () => {
    const sampleRecords = [
        { id: "1", name: "Alice", active: "true" },
        { id: "2", name: "Bob", active: "false" },
    ];

    const mockResponse: CsvResponse = {
        success: true,
        data: sampleRecords,
        meta: {
            source: "sample.csv",
            fields: ["id", "name", "active"],
            rowCount: 2,
            eligibleForConversion: true,
            createdAt: "2023-01-01T00:00:00.000Z",
            delimiter: ",",
            quoteChar: '"',
            encoding: "utf-8",
            validationFlags: {
                hasHeaders: true,
                hasBalancedQuotes: true,
                hasValidRows: true,
            },
        },
    };

    it("should convert parsed CSV into tabular structure", () => {
        const result = convertCsvStructure(mockResponse);

        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.flatRecords).toEqual(sampleRecords);
        expect(result.columnNames).toEqual(["id", "name", "active"]);
        expect(result.rowCount).toBe(2);
        expect(result.columnCount).toBe(3);
        expect(result.delimiter).toBe(",");
        expect(result.quoteChar).toBe('"');
        expect(result.encoding).toBe("utf-8");
        expect(result.sourceLabel).toBe("sample.csv");
    });

    it("should fail conversion if response is not eligible", () => {
        const ineligible: Partial<CsvResponse> = {
            ...mockResponse,
            success: false,
        };

        const result = convertCsvStructure(ineligible as CsvResponse);
        expect(result.success).toBe(false);
        expect(result.message).toContain("not eligible");
    });

    it("should serialize tabular structure back into CSV string", () => {
        const result = convertToCsv(mockResponse);

        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.content).toContain('"id","name","active"');
        expect(result.content).toContain('"1","Alice","true"');
        expect(result.content).toContain('"2","Bob","false"');
        expect(result.columnNames).toEqual(["id", "name", "active"]);
        expect(result.rowCount).toBe(2);
    });

    it("should fail serialization if structure conversion fails", () => {
        const ineligible: Partial<CsvResponse> = {
            ...mockResponse,
            success: false,
        };

        const result = convertToCsv(ineligible as CsvResponse);
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.message).toContain("not eligible");
    });

    it("should handle empty data gracefully", () => {
        const emptyResponse: CsvResponse = {
            ...mockResponse,
            data: [],
            meta: {
                ...mockResponse.meta,
                rowCount: 0,
            },
        };

        const result = convertToCsv(emptyResponse);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.content).toContain('"id","name","active"');
        expect(result.content).not.toContain("Alice");
        expect(result.rowCount).toBe(0);
    });

    it("should match snapshot for full conversion result", () => {
        const result = convertToCsv(mockResponse);
        expect(result).toMatchSnapshot();
    });
});
