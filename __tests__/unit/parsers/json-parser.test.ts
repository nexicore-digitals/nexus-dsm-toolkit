import { describe, expect, it, Mock, vi } from "vitest";
import parseJSON from "../../../src/parsers/json-parser.js";
import {
    ALL_EMPTY_OBJECTS,
    EMPTY_FILE,
    INVALID_ROOT_NULL,
    INVALID_ROOT_PRIMITIVE,
    JSON_TOO_LARGE,
    NO_VALID_DATA_ROWS,
    NON_OBJECT_ITEM,
    VALID_ARRAY_OF_OBJECTS,
    VALID_SINGLE_OBJECT,
    WHITESPACE_FILE,
} from "../../fixtures/json/json-mock-data.js";
import { parseJsonFromFile } from "../../../src/parsers/index.js";
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

describe("JSON parsing tests", () => {
    describe("parseJsonFromFile", () => {
        it("should enforce the file limit", async () => {
            const filePath = "./__tests__/fixtures/json/large-test.json";
            const result = await parseJsonFromFile(filePath);
            if (!result.success) {
                expect(result.name).toBe("JsonFileTooLargeError");
                expect(result.code).toBe("FileTooLarge");
            }
        });

        it("should return an environment error if run in a browser-like environment", async () => {
            // Simulate a browser environment
            (global as any).window = {};

            const result = await parseJsonFromFile("dummy-path.json");
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.code).toBe("EnvironmentMismatch");
            }

            // Clean up the global scope
            delete (global as any).window;
        });
    });
    it("should gracefully handle empty JSON file", async () => {
        const result = await parseJSON(EMPTY_FILE.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("JsonEmptyFileError");
            expect(result.code).toBe("EmptyJsonFile");
        }
    });
    it("if it contains whitespace it should also be considered an empty file", async () => {
        const result = await parseJSON(WHITESPACE_FILE.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("JsonEmptyFileError");
            expect(result.code).toBe("EmptyJsonFile");
        }
    });
    describe("it should identify primitives and null as invalid root data", async () => {
        it("it should identify primitives as invalid json root data", async () => {
            const result = await parseJSON(INVALID_ROOT_PRIMITIVE.content);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.name).toBe("JsonInvalidRootError");
                expect(result.code).toBe("InvalidJsonRoot");
            }
        });
        it("it should identify null as invalid json root data", async () => {
            const result = await parseJSON(INVALID_ROOT_NULL.content);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.name).toBe("JsonInvalidRootError");
                expect(result.code).toBe("InvalidJsonRoot");
            }
        });
    });
    it("for json array object all items should  be valid objects", async () => {
        const result = await parseJSON(NON_OBJECT_ITEM.content);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.name).toBe("JsonNonObjectItemError");
            expect(result.code).toBe("NonObjectArrayItem");
        }
    });
    describe("should return an error response for no content", () => {
        it("empty arrays are valid but do not pass the check", async () => {
            const result = await parseJSON(NO_VALID_DATA_ROWS.content);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.name).toBe("JsonNoDataRowsError");
                expect(result.code).toBe("NoJsonDataRows");
            }
        });
        it("empty arrays containing empty objects should also fail the check", async () => {
            const result = await parseJSON(ALL_EMPTY_OBJECTS.content);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.name).toBe("JsonNoDataRowsError");
                expect(result.message).toContain("empty objects");
            }
        });

        describe("parseJsonFromFile", () => {
            it("should automatically use streaming for files larger than MAX_SIZE_BYTES", async () => {
                const mockFilePath = "/fake/path/huge.json";
                const mockStream = Readable.from(JSON_TOO_LARGE.content);

                // Mock fileAnalysis to report a large file size
                vi.spyOn(fileAnalysis, "analyzeFileMetadata").mockResolvedValue(
                    {
                        absolutePath: mockFilePath,
                        content: "", // Content not read by analyzeFileMetadata
                        diagnostics: [],
                        encoding: "utf-8",
                        size: 60 * 1024 * 1024, // 60MB, larger than MAX_SIZE_BYTES
                        sourceLabel: "huge.json",
                    }
                );
                (fs.createReadStream as Mock).mockReturnValue(mockStream);

                const result = await parseJsonFromFile(mockFilePath);
                logger.info(
                    "JSON Payload size:",
                    (
                        Buffer.byteLength(JSON_TOO_LARGE.content, "utf-8") /
                        1024 /
                        1024
                    ).toFixed(2),
                    "MB"
                );
                expect(result.meta).toMatchSnapshot();
                expect(result.success).toBe(true);
                expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath, {
                    encoding: "utf8",
                });
            });
        });
    });
    describe("valid json data should pass", () => {
        it("a single valid single object should pass the test", async () => {
            const result = await parseJSON(VALID_SINGLE_OBJECT.content);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(result.data).toBeTypeOf("object");
            }
        });
        it("a valid array of objects should pass the test", async () => {
            const result = await parseJSON(VALID_ARRAY_OF_OBJECTS.content);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
            }
        });
    });

    it("should correctly label the format as 'json' in metadata", async () => {
        const result = await parseJSON(VALID_ARRAY_OF_OBJECTS.content);

        expect(result.success).toBe(true);
        if (!result.success) return;

        expect(result.meta.format).toBe("json");
    });
});
