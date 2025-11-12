// examples/parse.ts
import {
    VALID_ARRAY_OF_OBJECTS,
    ALL_EMPTY_OBJECTS,
} from "../__tests__/fixtures/json/json-mock-data.js";
import parseJSON from "@parsers/json-parser.js";
import { logger } from "@utils/logger.js";

async function main(data: string) {
    const result = await parseJSON(data);

    if (result.success) {
        logger.info("Parsed Result:", result.data);
    } else {
        logger.info("Parsed Result:", result);
    }
}

async function runAllParsers() {
    await main(VALID_ARRAY_OF_OBJECTS.content);
    logger.info("\n-----------\n");
    await main(ALL_EMPTY_OBJECTS.content);
}

runAllParsers();
