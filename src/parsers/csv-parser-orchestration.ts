import path from "path";
import fs from "fs/promises";
import type { SpecificCsvError } from "../types/csv.errors.js";
import type { CsvFileAnalysisResult } from "../types/meta.js";
import {
    csvEmptyFileError,
    csvFileNotFoundError,
    csvFileSystemError,
    csvFileTooLargeError,
} from "../constants/csv-custom-errors.js";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default async function analyzeCsvFile(
    filePath: string
): Promise<CsvFileAnalysisResult> {
    if (filePath.trim().length === 0)
        return {
            sourceLabel: "Unknown",
            absolutePath: "",
            content: "",
            size: 0,
            encoding: "",
            diagnostics: [],
        };

    const absolutePath = path.resolve(filePath);
    const sourceLabel = path.basename(filePath);
    const diagnostics: SpecificCsvError[] = [];

    let fileHandle;
    try {
        const stats = await fs.stat(absolutePath);

        if (stats.size > MAX_SIZE_BYTES) {
            diagnostics.push(csvFileTooLargeError);
        }

        fileHandle = await fs.open(absolutePath, "r");
        const content = await fileHandle.readFile("utf8");

        if (content.trim().length === 0 || content.trim() === "#") {
            diagnostics.push(csvEmptyFileError);
        }

        return {
            sourceLabel,
            absolutePath,
            content,
            size: stats.size,
            encoding: "utf-8",
            diagnostics: diagnostics.length > 0 ? diagnostics : undefined,
        };
    } catch (err: unknown) {
        if ((err as Error & { code: string }).code === "ENOENT") {
            diagnostics.push({
                ...csvFileNotFoundError,
                message: `The file '${absolutePath}' was not found.`,
            });
        } else {
            diagnostics.push({
                ...csvFileSystemError,
                message: `An error occurred while reading the file: ${
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
    } finally {
        if (fileHandle) {
            await fileHandle.close();
        }
    }
}
