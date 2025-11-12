import { describe, it, expect, vi, beforeEach } from "vitest";
import { convertToCsv } from "../../../src/converters/csv-converter.js";
import type { JsonResponse } from "../../../src/types/json-response.js";
import type { JsonParsedFileMeta } from "../../../src/types/meta.js";

// Mock timers and modules
vi.useFakeTimers();
vi.setSystemTime(new Date("2023-01-01T00:00:00.000Z"));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("CSV Conversion Logic", () => {
    // Mock JSON response for converting JSON to CSV
    const mockJsonResponse: JsonResponse = {
        success: true,
        data: [
            { id: 1, name: "Alice", active: true },
            { id: 2, name: "Bob", active: false },
        ],
        meta: {
            source: "sample.json",
            fields: ["id", "name", "active"],
            rowCount: 2,
            eligibleForConversion: true,
            createdAt: "2023-01-01T00:00:00.000Z",
            structureType: "array",
            nestingDepth: 1,
            validationFlags: {
                isArrayOfObjects: true,
                hasConsistentKeys: true,
                hasValidRows: true,
            },
        } as JsonParsedFileMeta,
    };

    it("should fail conversion if response is not eligible", async () => {
        const ineligible: Partial<JsonResponse> = {
            ...mockJsonResponse,
            success: false,
        };

        const result = await convertToCsv(ineligible as JsonResponse);
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.message).toContain("not eligible for conversion");
    });

    it("should serialize a JSON response into a CSV string", async () => {
        const result = await convertToCsv(mockJsonResponse);

        expect(result.success).toBe(true);
        if (!result.success) return;

        // Note: papaparse uses \r\n by default
        const expectedCsv =
            "id,name,active\r\n" + "1,Alice,true\r\n" + "2,Bob,false";

        // A more robust check that ignores quote differences
        const simplifiedResult = result.content.replace(/"/g, "");
        expect(simplifiedResult).toBe(expectedCsv);

        expect(result.columnNames).toEqual(["id", "name", "active"]);
        expect(result.rowCount).toBe(2);
    });

    it("should stringify nested objects by default (shallow conversion)", async () => {
        const nestedJsonResponse: JsonResponse = {
            success: true,
            data: [
                { name: "Alice", profile: { age: 30, registered: true } },
                { name: "Bob", profile: { age: 25, registered: false } },
            ],
            meta: {
                source: "nested.json",
                fields: ["name", "profile"],
                rowCount: 2,
                eligibleForConversion: true,
                createdAt: "2023-01-01T00:00:00.000Z",
                structureType: "array",
                nestingDepth: 2,
                validationFlags: {
                    isArrayOfObjects: true,
                    hasConsistentKeys: true,
                    hasValidRows: true,
                },
            } as JsonParsedFileMeta,
        };

        const result = await convertToCsv(nestedJsonResponse);
        expect(result.success).toBe(true);
        if (!result.success) return;
        // The header should not be quoted as it contains no special characters.
        expect(result.content).toContain("name,profile");
        // The stringified JSON contains commas, so it *should* be quoted.
        expect(result.content).toContain(
            'Alice,"{""age"":30,""registered"":true}"'
        );
    });

    it("should deeply flatten nested objects when 'deep' option is used", async () => {
        const nestedJsonResponse: JsonResponse = {
            success: true,
            data: [
                { name: "Alice", profile: { age: 30, registered: true } },
                { name: "Bob", profile: { age: 25, registered: false } },
            ],
            meta: {
                source: "nested.json",
                fields: ["name", "profile"],
                rowCount: 2,
                eligibleForConversion: true,
                createdAt: "2023-01-01T00:00:00.000Z",
                structureType: "array",
                nestingDepth: 2,
                validationFlags: {
                    isArrayOfObjects: true,
                    hasConsistentKeys: true,
                    hasValidRows: true,
                },
            } as JsonParsedFileMeta,
        };

        const result = await convertToCsv(nestedJsonResponse, {
            flattening: "deep",
        });
        expect(result.success).toBe(true);
        if (!result.success) return;

        const expectedCsv = `name,profile.age,profile.registered\r\nAlice,30,true\r\nBob,25,false`;
        const simplifiedContent = result.content.replace(/"/g, "");
        expect(simplifiedContent).toBe(expectedCsv);
    });

    it("should fail serialization if structure conversion fails", async () => {
        const ineligible: Partial<JsonResponse> = {
            ...mockJsonResponse,
            success: false,
        };

        const result = await convertToCsv(ineligible as JsonResponse);
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.message).toContain("not eligible for conversion");
    });

    it("should handle empty data gracefully", async () => {
        const emptyResponse: JsonResponse = {
            ...mockJsonResponse,
            data: [],
            meta: {
                ...mockJsonResponse.meta,
                rowCount: 0,
            } as JsonParsedFileMeta,
        };

        const result = await convertToCsv(emptyResponse);
        expect(result.success).toBe(true);
        if (!result.success) return;
        // When converting an empty JSON array, the result should be an empty CSV string.
        expect(result.content).toBe("");
        expect(result.content).not.toContain("Alice");
        expect(result.rowCount).toBe(0);
    });

    it("should match snapshot for full conversion result", () => {
        const result = convertToCsv(mockJsonResponse);
        expect(result).toMatchSnapshot();
    });

    it("should deeply flatten arrays with bracket notation", async () => {
        const jsonWithArray: JsonResponse = {
            success: true,
            data: [
                { id: 1, tags: ["admin", "editor"] },
                { id: 2, tags: ["viewer"] },
            ],
            meta: {
                source: "array.json",
                fields: ["id", "tags"],
                rowCount: 2,
                eligibleForConversion: true,
                createdAt: "2023-01-01T00:00:00.000Z",
                structureType: "array",
                nestingDepth: 2,
                validationFlags: {
                    isArrayOfObjects: true,
                    hasConsistentKeys: true,
                    hasValidRows: true,
                },
            } as JsonParsedFileMeta,
        };

        const result = await convertToCsv(jsonWithArray, {
            flattening: "deep",
        });
        expect(result.success).toBe(true);
        if (!result.success) return;

        expect(result.columnNames).toEqual(["id", "tags[0]", "tags[1]"]);
        // With the new quoting logic, simple values are not quoted.
        expect(result.content).toContain("1,admin,editor");
    });

    it("should deeply flatten multi-level nested arrays with bracket notation", async () => {
        const jsonWithNestedArray: JsonResponse = {
            success: true,
            data: [
                {
                    id: 1,
                    matrix: [
                        [1, 2],
                        [3, 4],
                    ],
                },
                { id: 2, matrix: [[5, 6]] },
            ],
            meta: {
                source: "matrix.json",
                fields: ["id", "matrix"],
                rowCount: 2,
                eligibleForConversion: true,
                createdAt: "2023-01-01T00:00:00.000Z",
                structureType: "array",
                nestingDepth: 3,
                validationFlags: {
                    isArrayOfObjects: true,
                    hasConsistentKeys: true,
                    hasValidRows: true,
                },
            } as JsonParsedFileMeta,
        };

        const result = await convertToCsv(jsonWithNestedArray, {
            flattening: "deep",
        });
        expect(result.success).toBe(true);
        if (!result.success) return;

        expect(result.columnNames).toEqual([
            "id",
            "matrix[0][0]",
            "matrix[0][1]",
            "matrix[1][0]",
            "matrix[1][1]",
        ]);
        // With the new quoting logic, simple values are not quoted.
        expect(result.content).toContain("1,1,2,3,4");
        expect(result.content).toContain("2,5,6,,");
    });
});
