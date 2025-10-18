import { describe, it, expect, vi } from "vitest";
import { ParsedFileMetaBuilder } from "../../../src/utils/parsed-file-meta-builder.ts";

vi.useFakeTimers();
vi.setSystemTime(new Date("2023-01-01T00:00:00.000Z"));

describe("ParsedFileMetaBuilder", () => {
    describe("CSV Eligibility", () => {
        it("should be eligible for conversion when all CSV flags are true", () => {
            const meta = ParsedFileMetaBuilder.init("test.csv", ["h1"], 1)
                .withCsvFlags({
                    hasHeaders: true,
                    hasBalancedQuotes: true,
                    hasValidRows: true,
                })
                .withCsvExtras({ delimiter: "," })
                .buildCsv();

            expect(meta.eligibleForConversion).toBe(true);
        });

        it("should NOT be eligible for conversion if hasHeaders is false", () => {
            const meta = ParsedFileMetaBuilder.init("test.csv", [], 0)
                .withCsvFlags({
                    hasHeaders: false,
                    hasBalancedQuotes: true,
                    hasValidRows: false,
                })
                .withCsvExtras({ delimiter: "," })
                .buildCsv();

            expect(meta.eligibleForConversion).toBe(false);
        });

        it("should NOT be eligible for conversion if hasBalancedQuotes is false", () => {
            const meta = ParsedFileMetaBuilder.init("test.csv", ["h1"], 1)
                .withCsvFlags({
                    hasHeaders: true,
                    hasBalancedQuotes: false,
                    hasValidRows: true,
                })
                .withCsvExtras({ delimiter: "," })
                .buildCsv();

            expect(meta.eligibleForConversion).toBe(false);
        });

        it("should NOT be eligible for conversion if hasValidRows is false", () => {
            const meta = ParsedFileMetaBuilder.init("test.csv", ["h1"], 0)
                .withCsvFlags({
                    hasHeaders: true,
                    hasBalancedQuotes: true,
                    hasValidRows: false,
                })
                .withCsvExtras({ delimiter: "," })
                .buildCsv();

            expect(meta.eligibleForConversion).toBe(false);
        });
    });

    describe("JSON Eligibility", () => {
        it("should be eligible for conversion when all JSON flags are true", () => {
            const meta = ParsedFileMetaBuilder.init("test.json", ["k1"], 1)
                .withJsonFlags({
                    isArrayOfObjects: true,
                    hasConsistentKeys: true,
                    hasValidRows: true,
                })
                .withJsonExtras({ structureType: "array", nestingDepth: 1 })
                .buildJson();

            expect(meta.eligibleForConversion).toBe(true);
        });

        it("should NOT be eligible for conversion if isArrayOfObjects is false", () => {
            const meta = ParsedFileMetaBuilder.init("test.json", ["k1"], 1)
                .withJsonFlags({
                    isArrayOfObjects: false,
                    hasConsistentKeys: true,
                    hasValidRows: true,
                })
                .withJsonExtras({ structureType: "object", nestingDepth: 1 })
                .buildJson();

            expect(meta.eligibleForConversion).toBe(false);
        });

        it("should NOT be eligible for conversion if hasConsistentKeys is false", () => {
            const meta = ParsedFileMetaBuilder.init(
                "test.json",
                ["k1", "k2"],
                2
            )
                .withJsonFlags({
                    isArrayOfObjects: true,
                    hasConsistentKeys: false,
                    hasValidRows: true,
                })
                .withJsonExtras({ structureType: "array", nestingDepth: 1 })
                .buildJson();

            expect(meta.eligibleForConversion).toBe(false);
        });
    });
});
