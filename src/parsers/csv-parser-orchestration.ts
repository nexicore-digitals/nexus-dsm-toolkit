import type { SpecificCsvError } from "../types/csv.errors.js";
import type { CsvParsedFileMeta } from "../types/meta.js";
import {
    csvEmptyFileError,
    csvEnvironmentError,
} from "../constants/csv-custom-errors.js";
import parseCSV from "./csv-parser.js"; // The string-based parser
import { parseCsvStream } from "./csv-stream-parser.js"; // The new stream-based parser
import { ParsedFileMetaBuilder } from "../utils/parsed-file-meta-builder.js"; // Used for building metadata
import { CsvErrorResponse, CsvResponse } from "../types/csv.response.js";
import {
    analyzeFileMetadata,
    readFileContent,
} from "../../src/utils/file-analysis.js";
import { sortCsvErrorsByPriority } from "../utils/csv-error-priority.js";
import { createReadStream } from "fs";
import path from "path";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB (kept for consistency, but `analyzeFileMetadata` also uses it)

/**
 * Options for parsing a CSV file from a file path.
 */
export interface CsvFileParsingOptions {
    /**
     * If `true`, attempts to parse the file using a streaming approach,
     * suitable for very large files. Defaults to `false`.
     */
    stream?: boolean;
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
export async function parseCsvFromFile(
    filePath: string,
    options?: CsvFileParsingOptions
): Promise<CsvResponse> {
    // Environment check: This function is Node.js-specific.
    if (typeof window !== "undefined") {
        return {
            ...csvEnvironmentError,
            success: false,
            detailedErrors: [csvEnvironmentError],
        };
    }

    // If streaming is explicitly requested, bypass the initial metadata analysis for size
    // and go directly to the streaming parser.
    if (options?.stream) {
        const readStream = createReadStream(filePath, {
            encoding: "utf8",
        });
        return parseCsvStream(readStream, path.basename(filePath));
    }

    const fileMetadata = await analyzeFileMetadata(filePath);

    if (fileMetadata.diagnostics && fileMetadata.diagnostics.length > 0) {
        const primaryError = fileMetadata.diagnostics[0];
        const meta: CsvParsedFileMeta = ParsedFileMetaBuilder.init(
            fileMetadata.sourceLabel,
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
                encoding: fileMetadata.encoding,
            })
            .withDiagnostics({
                errorCodes: fileMetadata.diagnostics.map((e) => e.code),
                warnings: fileMetadata.diagnostics.map((e) => e.message),
            })
            .buildCsv();

        return {
            ...primaryError,
            success: false,
            meta,
            detailedErrors: fileMetadata.diagnostics,
        };
    }

    // If file is too large or streaming is explicitly requested, use stream parser
    if (fileMetadata.size > MAX_SIZE_BYTES || options?.stream) {
        const readStream = createReadStream(fileMetadata.absolutePath, {
            encoding: "utf8",
        });
        return parseCsvStream(
            readStream,
            fileMetadata.sourceLabel,
            fileMetadata.encoding
        );
    } else {
        // Otherwise, read the entire content and use the string-based parser
        const content = await readFileContent(fileMetadata.absolutePath);
        if (content.trim().length === 0 || content.trim() === "#") {
            // Handle empty file after reading content
            const emptyFileErrorResponse = createErrorResponse(
                [csvEmptyFileError],
                fileMetadata.sourceLabel
            );
            return emptyFileErrorResponse;
        }
        return parseCSV(content, fileMetadata.sourceLabel);
    }
}

// Helper function to create an error response (moved from csv-parser.ts for reuse)
function createErrorResponse(
    errors: SpecificCsvError[],
    source: string
): CsvErrorResponse {
    const sortedErrors = sortCsvErrorsByPriority(errors);
    const primaryError = sortedErrors[0];

    const meta = ParsedFileMetaBuilder.init(source, [], 0, "csv")
        .withCsvFlags({
            hasHeaders: false,
            hasBalancedQuotes: false,
            hasValidRows: false,
            hasCommentLines: false,
            hasEmptyLines: true,
        })
        .withCsvExtras({ delimiter: ",", encoding: "" })
        .withDiagnostics({ errorCodes: errors.map((e) => e.code) })
        .buildCsv();

    return { ...primaryError, success: false, meta, detailedErrors: errors };
}
