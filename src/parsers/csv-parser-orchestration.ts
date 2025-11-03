import path from "path";
import fs from "fs/promises";
import type { SpecificCsvError } from "../types/csv.errors.js";
import type {
    CsvFileAnalysisResult,
    CsvParsedFileMeta,
} from "../types/meta.js";
import {
    csvEmptyFileError,
    csvFileNotFoundError,
    csvFileSystemError,
    csvFileTooLargeError,
    csvEnvironmentError,
} from "../constants/csv-custom-errors.js";
import parseCSV from "./csv-parser.js";
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.js";
import { CsvResponse } from "../types/csv.response.js";

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

/**
 * Parses a CSV file from a file path.
 *
 * This function is designed for Node.js environments. It reads the file from the
 * provided path, performs pre-checks like size validation, and then passes the
 * content to the core `parseCSV` function.
 *
 * @param filePath - The path to the CSV file.
 * @returns A promise that resolves to a `CsvResponse` object.
 */
export async function parseCsvFromFile(filePath: string): Promise<CsvResponse> {
    // Environment check: This function is Node.js-specific.
    if (typeof window !== "undefined") {
        return {
            ...csvEnvironmentError,
            success: false,
            detailedErrors: [csvEnvironmentError],
        };
    }

    const analysisResult = await analyzeCsvFile(filePath);

    if (analysisResult.diagnostics && analysisResult.diagnostics.length > 0) {
        const primaryError = analysisResult.diagnostics[0];
        const meta: CsvParsedFileMeta = ParsedFileMetaBuilder.init(
            analysisResult.sourceLabel,
            [],
            0,
            "csv"
        )
            .withCsvFlags({
                hasHeaders: false,
                hasBalancedQuotes: false,
                hasValidRows: false,
                hasCommentLines: false,
                hasEmptyLines: false,
            })
            .withCsvExtras({
                delimiter: ",",
                encoding: analysisResult.encoding,
            })
            .withDiagnostics({
                errorCodes: analysisResult.diagnostics.map((e) => e.code),
                warnings: analysisResult.diagnostics.map((e) => e.message),
            })
            .buildCsv();

        return {
            ...primaryError,
            success: false,
            meta,
            detailedErrors: analysisResult.diagnostics,
        };
    }

    return parseCSV(analysisResult.content, analysisResult.sourceLabel);
}
