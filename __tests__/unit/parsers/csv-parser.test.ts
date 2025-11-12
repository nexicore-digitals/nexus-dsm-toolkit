import Papa from "papaparse";
import { describe, it, expect, vi, Mock } from "vitest";
import {
    CSV_TOO_LARGE,
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
import { parseCSV, parseCsvFromFile } from "../../../src/parsers/index.js";
import { Readable } from "stream";

// Mock the entire 'fs' module to ensure createReadStream is intercepted
vi.mock("fs", async (importOriginal) => {
    const actualFs = await importOriginal<typeof import("fs")>();
    return {
        ...actualFs,
        createReadStream: vi.fn(), // Mock createReadStream
    };
});

// Import fs and fileAnalysis after mocking
import * as fs from "fs";
import * as fileAnalysis from "../../../src/utils/file-analysis.js";
import { logger } from "../../../logger.js";

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
                expect(result.name).toBe("CSVMissingHeaderValueError");
                expect(result.code).toBe("MissingHeaderValue");
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

    describe("parseCsvFromFile", () => {
        it("should return an environment error if run in a browser-like environment", async () => {
            // Simulate a browser environment
            (global as any).window = {};

            const result = await parseCsvFromFile("dummy-path.csv");
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.code).toBe("EnvironmentMismatch");
            }

            // Clean up the global scope
            delete (global as any).window;
        });

        it("should automatically use streaming for files larger than MAX_SIZE_BYTES", async () => {
            const mockFilePath = "/fake/path/huge.csv";
            const mockStream = Readable.from(CSV_TOO_LARGE.content);

            // Mock fileAnalysis to report a large file size
            vi.spyOn(fileAnalysis, "analyzeFileMetadata").mockResolvedValue({
                absolutePath: mockFilePath,
                content: "", // Content not read by analyzeFileMetadata
                diagnostics: [],
                encoding: "utf-8",
                size: 60 * 1024 * 1024, // 60MB, larger than MAX_SIZE_BYTES
                sourceLabel: "huge.csv",
            });
            (fs.createReadStream as Mock).mockReturnValue(mockStream);

            const result = await parseCsvFromFile(mockFilePath);
            expect(result.success).toBe(true);
            // Further assertions can check if the stream parser was indeed used
            // (e.g., by checking specific meta properties or data structure if different)
            // For now, success implies it handled the large file without crashing.
            expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath, {
                encoding: "utf8",
            });
            logger.info(
                "CSV Payload size:",
                (
                    Buffer.byteLength(CSV_TOO_LARGE.content, "utf-8") /
                    1024 /
                    1024
                ).toFixed(2),
                "MB"
            );
        });
    });
});
