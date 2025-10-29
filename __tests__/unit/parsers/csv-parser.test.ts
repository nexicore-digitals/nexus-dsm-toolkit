import Papa from "papaparse";
import { describe, it, expect, vi } from "vitest";
import {
    TSV_SAMPLE,
    EMPTY_FILE,
    INVALID_QUOTES,
    MISSING_HEADER_VALUE,
    MISSING_QUOTES,
    NO_HEADERS,
    TOO_FEW_FIELDS,
    TOO_MANY_FIELDS,
    UNDETECTABLE_DELIMITER,
    VALID_SAMPLE,
} from "../../fixtures/csv/csv-mock-data.js";
import parseCSV from "../../../src/parsers/csv-parser.js";

vi.useFakeTimers();
vi.setSystemTime(new Date("2023-01-01T00:00:00.000Z"));

describe("CSV Parsing tests", () => {
    it("should gracefully handle empty CSV file", async () => {
        const result = await parseCSV(EMPTY_FILE.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("CSVEmptyFileError");
            expect(result.code).toBe("EmptyFile");
        }
    });
    describe("should properly handle missing or no headers", () => {
        it("should handle CSV file with no headers #NoHeaders", async () => {
            const result = await parseCSV(NO_HEADERS.content);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.name).toBe("CSVNoHeadersError");
                expect(result.code).toBe("NoHeaders");
            }
        });
        it("should handle CSV file with no headers #MissingHeaderValue", async () => {
            const result = await parseCSV(MISSING_HEADER_VALUE.content);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.name).toBe("CSVMissingHeaderValueError");
                expect(result.code).toBe("MissingHeaderValue");
            }
        });
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
    it("should handle undetectable delimiter", async () => {
        const result = await parseCSV(UNDETECTABLE_DELIMITER.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("CSVUndetectableDelimiterError");
            expect(result.code).toBe("UndetectableDelimiter");
        }
    });
    it("should handle any other unexpected errors", async () => {
        vi.spyOn(Papa, "parse").mockImplementationOnce(() => {
            throw new Error("sheesh there was an unexpected error");
        });
        const result = await parseCSV(VALID_SAMPLE.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("CSVUnexpectedError");
            expect(result.code).toBe("UnknownError");
        }
        vi.resetAllMocks();
    });
    it("should successful resolve and return the data", async () => {
        const result = await parseCSV(VALID_SAMPLE.content);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toBeDefined();
            if (Array.isArray(result.data))
                expect(result.data.length).toBeGreaterThan(0);
            expect(result.meta?.fields?.length).toBeGreaterThan(0);
        }
    });
    it("should expose correct validation flags and eligibility in metadata", async () => {
        const result = await parseCSV(VALID_SAMPLE.content);
        expect(result.success).toBe(true);
        if (result.success) {
            const flags = result.meta.validationFlags;
            expect(flags.hasHeaders).toBe(true);
            expect(flags.hasBalancedQuotes).toBe(true);
            expect(flags.hasValidRows).toBe(true);
            expect(result.meta.eligibleForConversion).toBe(true);
        }
    });
    it("should include diagnostics in metadata on failure", async () => {
        const result = await parseCSV(MISSING_QUOTES.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.meta?.diagnostics?.warnings?.length).toBeGreaterThan(
                0
            );
            expect(result.meta?.diagnostics?.errorCodes).toContain(
                "MissingQuotes"
            );
        }
    });
    it("should return fallback metadata on unexpected error", async () => {
        vi.spyOn(Papa, "parse").mockImplementationOnce(() => {
            throw new Error("unexpected");
        });
        const result = await parseCSV(VALID_SAMPLE.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("CSVUnexpectedError");
            expect(result.meta).toBeUndefined(); // fallback path skips meta
        }
    });

    it("should correctly detect and label TSV format", async () => {
        const result = await parseCSV(TSV_SAMPLE.content);

        expect(result.success).toBe(true);
        if (!result.success) return;

        expect(result.meta.format).toBe("tsv");
        expect(result.meta.delimiter).toBe("\t");
    });

    it("should correctly label CSV format for comma-delimited files", async () => {
        const result = await parseCSV(VALID_SAMPLE.content);

        expect(result.success).toBe(true);
        if (!result.success) return;

        expect(result.meta.format).toBe("csv");
    });

    it("should match metadata snapshot for valid sample", async () => {
        const result = await parseCSV(VALID_SAMPLE.content);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.meta).toMatchSnapshot();
        }
    });
    vi.resetAllMocks();
});
