// examples/parse.ts
import {
    VALID_ARRAY_OF_OBJECTS,
    ALL_EMPTY_OBJECTS,
} from "../__tests__/fixtures/json/json-mock-data.ts";
import parseJSON from "../src/parsers/json-parser.ts";
import { logger } from "../src/utils/logger.ts";

async function main(data: string) {
    const result = await parseJSON(data);

    if (result.success) {
        logger.info("Parsed Result:", result.data);
    } else {
        logger.info("Parsed Result:", result);
    }
}

async function run() {
    await main(VALID_ARRAY_OF_OBJECTS.content);
    logger.info("\n-----------\n");
    await main(ALL_EMPTY_OBJECTS.content);
}

run();
