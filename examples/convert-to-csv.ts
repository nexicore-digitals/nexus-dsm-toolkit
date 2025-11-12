import { logger } from "../logger.js";
import { parseJSON, convertToCsv, parseCSV, convertToJson } from "../main.js";

logger.info("--- Running JSON to CSV/TSV Conversion Example ---");

// 1. Define a JSON string with deeply nested objects and multi-level nested arrays.
const jsonString = `[
  {
    "name": "Alice",
    "profile": { "age": 30, "registered": true },
    "matrix": [ [1, 2], [3, 4] ]
  },
  {
    "name": "Bob",
    "profile": { "age": 25, "registered": false },
    "matrix": [ [5, 6] ]
  }
]`;

async function runSuccess() {
    // 2. Parse the JSON string.
    const jsonResponse = await parseJSON(jsonString);

    if (jsonResponse.success) {
        logger.info("Parsed JSON Format:", jsonResponse.meta.format);
        // 3. Convert the successful parse result to CSV.
        // By default, it performs a "shallow" conversion.
        const shallowResult = await convertToCsv(jsonResponse);

        if (shallowResult.success) {
            logger.info("✅ Shallow Conversion (Default):");
            logger.info(
                "Flattening Mode:",
                shallowResult.conversionMeta.flattening
            );
            logger.info(shallowResult.content);
        }

        // You can also perform a "deep" conversion.
        const deepResult = await convertToCsv(jsonResponse, {
            flattening: "deep",
        });

        if (deepResult.success) {
            logger.info("\n✅ Deep Conversion:");
            logger.info(
                "Flattening Mode:",
                deepResult.conversionMeta.flattening
            );
            logger.info(deepResult.content);
        } else {
            logger.error("❌ CSV Conversion Failed:", deepResult.message);
        }
    }
}

logger.info("\n--- Running Failed JSON to CSV Conversion Example ---");

// 1. Define a JSON string with inconsistent keys, making it ineligible for CSV conversion.
const badJsonString = `[
  { "id": 1, "name": "Alice" },
  { "id": 2, "username": "Bob" }
]`;

async function runFailure() {
    // 2. Parse the JSON string.
    const jsonResponse = await parseJSON(badJsonString);

    if (jsonResponse.success) {
        logger.info("Parsed JSON Format:", jsonResponse.meta.format);
        logger.info(
            "JSON parsing succeeded, but data is not eligible for conversion."
        );
        logger.info("Eligibility:", jsonResponse.meta.eligibleForConversion);
        logger.info(
            "Reason:",
            jsonResponse.meta.diagnostics?.eligibilityReason
        );
        logger.info(
            "Inconsistent Keys:",
            jsonResponse.meta.validationFlags.inconsistentKeys
        );

        // 3. Attempt to convert the ineligible data to CSV.
        const csvResult = await convertToCsv(jsonResponse);

        if (!csvResult.success) {
            logger.info("\n✅ Conversion correctly failed! Details:");
            logger.info("Message:", csvResult.message);
            logger.info("Hints:", csvResult.hints);
        }
    }
}

logger.info("\n--- Running TSV Conversion Example ---");

// 1. Define a TSV string
const tsvString = `id\tname\tage\n1\tAlice\t30\n2\tBob\t25`;

async function runTsvExample() {
    // 2. Parse the TSV string.
    const tsvResponse = await parseCSV(tsvString);

    if (tsvResponse.success) {
        logger.info("✅ TSV Parsing successful!");
        logger.info("Parsed Format:", tsvResponse.meta.format); // Should be 'tsv'
        logger.info("Delimiter:", tsvResponse.meta.delimiter); // Should be '\t'
        logger.info("Data:", tsvResponse.data);

        // Convert TSV data to JSON
        const jsonResult = await convertToJson(tsvResponse);
        if (jsonResult.success) {
            logger.info("\n✅ TSV to JSON Conversion successful!");
            logger.info("JSON Content:", jsonResult.content);
        } else {
            logger.error(
                "❌ TSV to JSON Conversion Failed:",
                jsonResult.message
            );
        }
    } else {
        logger.error("❌ TSV Parsing Failed:", tsvResponse.message);
        logger.info("Diagnostics:", tsvResponse.meta?.diagnostics);
    }
}

async function runAllExamples() {
    await runSuccess();
    await runFailure();
    await runTsvExample();
    logger.info("\n--- All CSV Conversion Examples Finished ---");
}

await runAllExamples();
