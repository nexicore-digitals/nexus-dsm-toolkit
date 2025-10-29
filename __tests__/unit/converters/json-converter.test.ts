import { describe, it, expect, vi } from "vitest";
import { convertJsonStructure } from "../../../src/converters/json-converter.js";
import { JsonParsedFileMeta } from "../../../src/types/meta.js";

vi.useFakeTimers();
vi.setSystemTime(new Date("2023-01-01T00:00:00.000Z"));

describe("convertJsonStructure", () => {
    it("should correctly process an array of objects", () => {
        const originalData = [
            { id: 1, name: "test1" },
            { id: 2, name: "test2" },
        ];

        const meta: JsonParsedFileMeta = {
            source: "test.json",
            fields: ["id", "name"],
            rowCount: 2,
            eligibleForConversion: true,
            createdAt: new Date().toISOString(),
            structureType: "array",
            nestingDepth: 1,
            validationFlags: {
                isArrayOfObjects: true,
                hasConsistentKeys: true,
                hasValidRows: true,
            },
            format: "json",
        };

        const result = convertJsonStructure(originalData, meta);

        expect(result.structureType).toBe("array");
        expect(result.rootItems).toEqual(originalData);
        expect(result.rootLength).toBe(2);
        expect(result.keySet).toEqual(["id", "name"]);
        expect(result.original).toBe(originalData);
        expect(result.conversionWarnings).toBeUndefined();
    });

    it("should wrap a single object in an array and generate a warning", () => {
        const originalData = { id: 1, name: "single-test" };

        const meta: JsonParsedFileMeta = {
            source: "test.json",
            fields: ["id", "name"],
            rowCount: 1,
            eligibleForConversion: true,
            createdAt: new Date().toISOString(),
            structureType: "object",
            nestingDepth: 1,
            validationFlags: {
                isArrayOfObjects: false, // As it's a single object
                hasConsistentKeys: true,
                hasValidRows: true,
            },
            format: "json",
        };

        const result = convertJsonStructure(originalData, meta);

        expect(result.structureType).toBe("object");
        expect(result.rootItems).toEqual([originalData]); // Check that it's wrapped
        expect(result.rootLength).toBe(1);
        expect(result.keySet).toEqual(["id", "name"]);
        expect(result.original).toBe(originalData);
        expect(result.conversionWarnings).toBeDefined();
        expect(result.conversionWarnings).toContain(
            "Root is an object, not an array. Flattening may be lossy."
        );
    });

    it("should handle an empty array of objects gracefully", () => {
        const originalData: object[] = [];

        const meta: JsonParsedFileMeta = {
            source: "test.json",
            fields: [],
            rowCount: 0,
            eligibleForConversion: true,
            createdAt: new Date().toISOString(),
            structureType: "array",
            nestingDepth: 0,
            validationFlags: {
                isArrayOfObjects: true,
                hasConsistentKeys: true,
                hasValidRows: false, // No rows
            },
            format: "json",
        };

        const result = convertJsonStructure(originalData, meta);

        expect(result.structureType).toBe("array");
        expect(result.rootItems).toEqual([]);
        expect(result.rootLength).toBe(0);
        expect(result.keySet).toEqual([]);
        expect(result.original).toBe(originalData);
        expect(result.conversionWarnings).toBeUndefined();
    });

    it("should return an empty array if metadata indicates 'array' but data is a single object", () => {
        const originalData = { id: 1, name: "mismatch" };

        const meta: JsonParsedFileMeta = {
            source: "test.json",
            fields: ["id", "name"],
            rowCount: 1,
            eligibleForConversion: true,
            createdAt: new Date().toISOString(),
            structureType: "array", // Mismatch: meta says array
            nestingDepth: 1,
            validationFlags: {
                isArrayOfObjects: false,
                hasConsistentKeys: true,
                hasValidRows: true,
            },
            format: "json",
        };

        const result = convertJsonStructure(originalData, meta);

        // The function trusts the metadata's structureType but then verifies with Array.isArray.
        // Since it's not an array, it correctly defaults to an empty rootItems.
        expect(result.rootItems).toEqual([]);
        expect(result.rootLength).toBe(0);
        expect(result.conversionWarnings).toBeUndefined();
    });

    it("should warn if validationFlags indicate inconsistent keys", () => {
        const originalData = [
            { id: 1, name: "Alice" },
            { id: 2, age: 30 }, // missing 'name'
        ];

        const meta: JsonParsedFileMeta = {
            source: "test.json",
            fields: ["id", "name", "age"],
            rowCount: 2,
            eligibleForConversion: true,
            createdAt: new Date().toISOString(),
            structureType: "array",
            nestingDepth: 1,
            validationFlags: {
                isArrayOfObjects: true,
                hasConsistentKeys: false,
                hasValidRows: true,
            },
            format: "json",
        };

        const result = convertJsonStructure(originalData, meta);

        expect(result.structureType).toBe("array");
        expect(result.rootItems.length).toBe(2);
        expect(result.conversionWarnings).toBeDefined();
        expect(result.conversionWarnings).toContain(
            "Inconsistent keys detected across root items."
        );
    });

    it("should preserve nestingDepth metadata for deeply nested structures", () => {
        const originalData = [
            { user: { profile: { name: "Deep" } } },
            { user: { profile: { name: "Deeper" } } },
        ];

        const meta: JsonParsedFileMeta = {
            source: "test.json",
            fields: ["user"],
            rowCount: 2,
            eligibleForConversion: true,
            createdAt: new Date().toISOString(),
            structureType: "array",
            nestingDepth: 3,
            validationFlags: {
                isArrayOfObjects: true,
                hasConsistentKeys: true,
                hasValidRows: true,
            },
            format: "json",
        };

        const result = convertJsonStructure(originalData, meta);

        expect(result.nestingDepth).toBe(3);
        expect(result.rootItems.length).toBe(2);
        expect(result.conversionWarnings).toBeUndefined();
    });

    it("should match snapshot for valid array structure", () => {
        const originalData = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
        ];

        const meta: JsonParsedFileMeta = {
            source: "test.json",
            fields: ["id", "name"],
            rowCount: 2,
            eligibleForConversion: true,
            createdAt: "2023-01-01T00:00:00.000Z", // freeze time for snapshot
            structureType: "array",
            nestingDepth: 1,
            validationFlags: {
                isArrayOfObjects: true,
                hasConsistentKeys: true,
                hasValidRows: true,
            },
            format: "json",
        };

        const result = convertJsonStructure(originalData, meta);
        expect(result).toMatchSnapshot();
    });
});
