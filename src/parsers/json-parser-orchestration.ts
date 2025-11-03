import fs from "fs/promises";
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
import path from "path";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default async function parseJsonFromFile(
    filePath: string
): Promise<JsonResponse> {
    // Environment check: This function is Node.js-specific.
    if (typeof window !== "undefined") {
        return {
            ...jsonEnvironmentError,
            success: false,
            detailedErrors: [jsonEnvironmentError],
        };
    }

    const absolutePath = path.resolve(filePath);
    const customErrors: SpecificJsonError[] = [];

    // File I/O and Pre-Parsing Checks ---
    let fileHandle;
    try {
        const stats = await fs.stat(absolutePath);

        // Check file size without reading the content
        if (stats.size > MAX_SIZE_BYTES) {
            return createErrorResponse([jsonFileTooLargeError]);
        }

        fileHandle = await fs.open(absolutePath, "r");
        const fileContent = await fileHandle.readFile("utf8");

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
                    message: `The file '${absolutePath}' was not found.`,
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
    } finally {
        if (fileHandle) {
            await fileHandle.close();
        }
    }
}
