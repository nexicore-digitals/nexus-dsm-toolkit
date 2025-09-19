// examples/parse.ts
import {
    VALID_SAMPLE,
    EMPTY_FILE,
} from "../__tests__/fixtures/csv/csv-mock-data.ts";
import parseCSV from "../src/parsers/csv-parser.ts";
import { logger } from "../src/utils/logger.ts";

async function main(data: string) {
    const result = await parseCSV(data);

    if (result.success) {
        logger.info("Parsed Result:", result.meta);
    } else {
        logger.info("Parsed Result:", result);
    }
}

async function run() {
    await main(VALID_SAMPLE.content);
    logger.info("\n-----------\n");
    await main(EMPTY_FILE.content);
}

run();
