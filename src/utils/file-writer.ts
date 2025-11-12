/**
 * @file Provides a utility for writing content to a file with logging.
 * @author Owen
 */
import { writeFile } from "fs/promises";
import { logger } from "../../logger.js";

/**
 * Writes content to a specified file path and logs the outcome.
 * @param filePath - The path of the file to write to.
 * @param content - The string content to write.
 */
export async function writeToFile(
    filePath: string,
    content: string,
    dataType: "json" | "csv" | "tsv"
): Promise<void> {
    try {
        let path = filePath;
        if (
            !filePath.endsWith(".json") &&
            !filePath.endsWith(".csv") &&
            !filePath.endsWith(".tsv")
        ) {
            path = filePath + "." + dataType;
        }
        await writeFile(path, content, "utf8");
        logger.info(`Successfully wrote output to ${filePath}`);
    } catch (error: any) {
        logger.error(`Failed to write to file ${filePath}: ${error.message}`);
        throw error; // Re-throw to allow the caller to handle it
    }
}
