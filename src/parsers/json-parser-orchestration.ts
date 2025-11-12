import type { JsonResponse } from "../types/json-response.js";
import parseJSON from "./json-parser.js";
import {
    checkEmptyFile,
    createErrorResponse,
} from "../utils/json-utilities.js";
import type { SpecificJsonError } from "../types/json-errors.js";
import {
    jsonEnvironmentError,
    jsonFileTooLargeError,
} from "../constants/json-custom-errors.js";
import {
    fileNotFoundError,
    fileSystemError,
} from "../constants/custom-errors.js";
import {
    analyzeFileMetadata,
    readFileContent,
} from "../../src/utils/file-analysis.js";

/**
 * Options for parsing a JSON file from a file path.
 */
export interface JsonFileParsingOptions {
    // This interface is kept for future compatibility but currently has no effect.
}

export default async function parseJsonFromFile(
    filePath: string
): Promise<JsonResponse> {
    if (typeof window !== "undefined") {
        return {
            ...jsonEnvironmentError,
            success: false,
            detailedErrors: [jsonEnvironmentError],
        };
    }

    const customErrors: SpecificJsonError[] = [];

    const fileMetadata = await analyzeFileMetadata(filePath);

    if (fileMetadata.diagnostics && fileMetadata.diagnostics.length > 0) {
        // If analyzeFileMetadata found errors (e.g., file not found, too large)
        if (fileMetadata.diagnostics[0].code === "FileTooLarge") {
            return createErrorResponse([jsonFileTooLargeError]);
        }
        return createErrorResponse(
            // Cast to SpecificJsonError
            fileMetadata.diagnostics as SpecificJsonError[]
        );
    }

    try {
        const fileContent = await readFileContent(fileMetadata.absolutePath);
        // Check if the file is empty after reading
        customErrors.push(...checkEmptyFile(fileContent));
        if (customErrors.length > 0) {
            return createErrorResponse(customErrors);
        }
        // --- Core Parsing ---
        // Now, call the pure parseJSON function with the file content
        return await parseJSON(fileContent);
    } catch (err: unknown) {
        if ((err as Error & { code: string }).code === "ENOENT") {
            return createErrorResponse([
                {
                    ...fileNotFoundError,
                    message: `The file '${fileMetadata.absolutePath}' was not found.`,
                },
            ]);
        }
        // Handle other potential errors like permissions or unknown issues
        return createErrorResponse([
            {
                ...fileSystemError,
                message: `An error occurred while reading the file: ${err instanceof Error && "message" in err ? err.message : ""}`,
            },
        ]);
    }
}
