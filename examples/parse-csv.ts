import {
    VALID_SAMPLE,
    EMPTY_FILE,
} from "../__tests__/fixtures/csv/csv-mock-data.js";
import parseCSV from "@parsers/csv-parser.js";
import { logger } from "@utils/logger.js";

async function main(data: string, source?: string) {
    const result = await parseCSV(data, source);

    if (result.success) {
        logger.info("Parsed Result:", result.meta);
    } else {
        logger.info("Parsed Result:", result);
    }
}

async function runAllParsers() {
    await main(VALID_SAMPLE.content);
    logger.info("\n-----------\n");
    await main(EMPTY_FILE.content);
    logger.info("\n-----------\n");
}

runAllParsers();
