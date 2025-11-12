/**
 * @file Provides utilities for analyzing file metadata and reading file content.
 * @author Owen
 */

import path from "path";
import fs from "fs/promises";
import {
    fileNotFoundError,
    fileSystemError,
} from "../constants/custom-errors.js";
import type { SpecificCsvError, SpecificJsonError } from "../types/index.js";
import type { FileAnalysisResult } from "../types/meta.js";
import { jsonFileTooLargeError } from "../constants/json-custom-errors.js";
import { csvFileTooLargeError } from "../constants/csv-custom-errors.js";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Analyzes a file to get its basic metadata (path, size, existence) without reading its full content.
 * This is useful for pre-checks before deciding whether to read the file entirely or stream it.
 *
 * @param filePath - The path to the file.
 * @returns A promise that resolves to a `FileAnalysisResult` object.
 */
export async function analyzeFileMetadata(
    filePath: string
): Promise<FileAnalysisResult> {
    if (filePath.trim().length === 0) {
        return {
            sourceLabel: "Unknown",
            absolutePath: "",
            content: "", // Content is empty as we don't read it here
            size: 0,
            encoding: "utf-8", // Default encoding assumption
            diagnostics: [],
        };
    }

    const absolutePath = path.resolve(filePath);
    const sourceLabel = path.basename(filePath);
    const diagnostics: (SpecificCsvError | SpecificJsonError)[] = [];

    try {
        const stats = await fs.stat(absolutePath);

        if (stats.size > MAX_SIZE_BYTES) {
            if (absolutePath.endsWith(".json")) {
                diagnostics.push(jsonFileTooLargeError);
            } else if (
                absolutePath.endsWith(".csv") ||
                absolutePath.endsWith(".tsv")
            ) {
                diagnostics.push(csvFileTooLargeError);
            }
        }

        // We don't read content here, so it's an empty string
        return {
            sourceLabel,
            absolutePath,
            content: "",
            size: stats.size,
            encoding: "utf-8", // Assume UTF-8 for initial metadata
            diagnostics: diagnostics.length > 0 ? diagnostics : undefined,
        };
    } catch (err: unknown) {
        if ((err as Error & { code: string }).code === "ENOENT") {
            diagnostics.push({
                ...fileNotFoundError,
                message: `The file '${absolutePath}' was not found.`,
            });
        } else {
            diagnostics.push({
                ...fileSystemError,
                message: `An error occurred while accessing the file: ${
                    err instanceof Error && "message" in err ? err.message : ""
                }`,
            });
        }

        return {
            sourceLabel,
            absolutePath,
            content: "",
            size: 0,
            encoding: "utf-8",
            diagnostics,
        };
    }
}

/**
 * Reads the full content of a file.
 * @param filePath - The path to the file.
 * @returns A promise that resolves to the file content string.
 */
export async function readFileContent(filePath: string): Promise<string> {
    let fileHandle;
    try {
        fileHandle = await fs.open(filePath, "r");
        const content = await fileHandle.readFile("utf8");
        return content;
    } finally {
        if (fileHandle) {
            await fileHandle.close();
        }
    }
}
