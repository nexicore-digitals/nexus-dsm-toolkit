import { describe, it, expect, vi } from "vitest";
import { Readable } from "stream";
import { parseCsvStream } from "../../../src/parsers/csv-stream-parser.js";
import {
    EMPTY_FILE,
    NO_HEADERS,
    MISSING_HEADER_VALUE,
    MISSING_QUOTES,
    INVALID_QUOTES,
    TOO_FEW_FIELDS,
    TOO_MANY_FIELDS,
    UNDETECTABLE_DELIMITER,
    VALID_SAMPLE,
    TSV_SAMPLE,
} from "../../fixtures/csv/csv-mock-data.js";
import Papa from "papaparse";

vi.useFakeTimers();
vi.setSystemTime(new Date("2023-01-01T00:00:00.000Z"));

const toStream = (text: string) => Readable.from([Buffer.from(text, "utf-8")]);

describe("parseCsvStream – milestone-driven tests", () => {
    it("should gracefully handle empty CSV file", async () => {
        const result = await parseCsvStream(toStream(EMPTY_FILE.content));
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.name).toBe("CSVEmptyFileError");
        expect(result.code).toBe("EmptyFile");
    });

    describe("should properly handle missing or no headers", () => {
        it("#NoHeaders", async () => {
            const result = await parseCsvStream(toStream(NO_HEADERS.content));
            expect(result.success).toBe(false);
            if (result.success) return;
            expect(result.name).toBe("CSVMissingHeaderValueError");
            expect(result.code).toBe("MissingHeaderValue");
        });

        it("#MissingHeaderValue", async () => {
            const result = await parseCsvStream(
                toStream(MISSING_HEADER_VALUE.content)
            );
            expect(result.success).toBe(false);
            if (result.success) return;
            expect(result.name).toBe("CSVMissingHeaderValueError");
            expect(result.code).toBe("MissingHeaderValue");
        });
    });

    describe("should handle malformed quotes correctly", () => {
        it("should detect missing quotes", async () => {
            const result = await parseCsvStream(
                toStream(MISSING_QUOTES.content)
            );
            expect(result.success).toBe(false);
            if (result.success) return;
            expect(result.name).toBe("CSVMissingQuotesError");
            expect(result.code).toBe("MissingQuotes");
        });

        it("should detect invalid quotes", async () => {
            const result = await parseCsvStream(
                toStream(INVALID_QUOTES.content)
            );
            expect(result.success).toBe(false);
            if (result.success) return;
            expect(result.name).toBe("CSVInvalidQuotesError");
            expect(result.code).toBe("InvalidQuotes");
        });
    });

    describe("should properly handle field mismatch", () => {
        it("should detect too few fields", async () => {
            const result = await parseCsvStream(
                toStream(TOO_FEW_FIELDS.content)
            );
            expect(result.success).toBe(false);
            if (result.success) return;
            expect(result.name).toBe("CSVTooFewFieldsError");
            expect(result.code).toBe("TooFewFields");
        });

        it("should detect too many fields", async () => {
            const result = await parseCsvStream(
                toStream(TOO_MANY_FIELDS.content)
            );
            expect(result.success).toBe(false);
            if (result.success) return;
            expect(result.name).toBe("CSVTooManyFieldsError");
            expect(result.code).toBe("TooManyFields");
        });
    });

    it("should detect undetectable delimiter", async () => {
        const result = await parseCsvStream(
            toStream(UNDETECTABLE_DELIMITER.content)
        );
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.name).toBe("CSVUndetectableDelimiterError");
        expect(result.code).toBe("UndetectableDelimiter");
    });

    it("should detect unexpected parser error", async () => {
        vi.spyOn(Papa, "parse").mockImplementationOnce(() => {
            throw new Error("unexpected");
        });
        const result = await parseCsvStream(toStream(VALID_SAMPLE.content));
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.name).toBe("CSVUnexpectedError");
        expect(result.code).toBe("UnknownError");
        vi.resetAllMocks();
    });

    it("should successfully parse valid sample", async () => {
        const result = await parseCsvStream(toStream(VALID_SAMPLE.content));
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect((result.data as object[]).length).toBeGreaterThan(0);
        expect(result.meta.fields.length).toBeGreaterThan(0);
    });

    it("should expose correct validation flags and eligibility", async () => {
        const result = await parseCsvStream(toStream(VALID_SAMPLE.content));
        expect(result.success).toBe(true);
        if (!result.success) return;
        const flags = result.meta.validationFlags;
        expect(flags.hasHeaders).toBe(true);
        expect(flags.hasBalancedQuotes).toBe(true);
        expect(flags.hasValidRows).toBe(true);
        expect(result.meta.eligibleForConversion).toBe(true);
    });

    it("should include diagnostics in metadata on failure", async () => {
        const result = await parseCsvStream(toStream(MISSING_QUOTES.content));
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(
            (result.meta?.diagnostics?.warnings as string[]).length
        ).toBeGreaterThan(0);
        expect(result.meta?.diagnostics?.errorCodes).toContain("MissingQuotes");
    });

    it("should return fallback metadata on unexpected error", async () => {
        vi.spyOn(Papa, "parse").mockImplementationOnce(() => {
            throw new Error("unexpected");
        });
        const result = await parseCsvStream(toStream(VALID_SAMPLE.content));
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.name).toBe("CSVUnexpectedError");
        expect(result.meta).toBeUndefined();
        vi.resetAllMocks();
    });

    it("should correctly detect and label TSV format", async () => {
        const result = await parseCsvStream(toStream(TSV_SAMPLE.content));
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.meta.format).toBe("tsv");
        expect(result.meta.delimiter).toBe("\t");
    });

    it("should correctly label CSV format for comma-delimited files", async () => {
        const result = await parseCsvStream(toStream(VALID_SAMPLE.content));
        expect(result.success).toBe(true);
        expect(result.meta?.format).toBe("csv");
    });

    it("should match metadata snapshot for valid sample", async () => {
        const result = await parseCsvStream(toStream(VALID_SAMPLE.content));
        expect(result.success).toBe(true);
        expect(result.meta).toMatchSnapshot();
    });
});
