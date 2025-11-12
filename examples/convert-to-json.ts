import { parseCSV, convertToJson } from "../main.js";
import { logger } from "../logger.js";

// --- Example 1: Shallow CSV to JSON ---
logger.info("--- Running CSV to JSON Conversion Example (Shallow) ---");

// 1. Define a CSV string where some fields contain stringified JSON.
// This is the output from the "shallow" JSON-to-CSV conversion example.
const shallowCsvString = `"name","profile","matrix"
"Alice","{""age"":30,""registered"":true}","[[1,2],[3,4]]"
"Bob","{""age"":25,""registered"":false}","[[5,6]]"`;

async function runShallow() {
    // 2. Parse the CSV string.
    const csvResponse = await parseCSV(shallowCsvString);

    if (csvResponse.success) {
        logger.info("Parsed Format:", csvResponse.meta.format);
        // 3. Convert the successful parse result to JSON.
        const jsonResult = await convertToJson(csvResponse);

        if (jsonResult.success) {
            logger.info("✅ Shallow CSV conversion successful!");
            logger.info("Un-flattened:", jsonResult.conversionMeta.unflatten);
            logger.info(jsonResult.content);
        } else {
            logger.error("❌ JSON Conversion Failed:", jsonResult.message);
        }
    }
}

// --- Example 2: Deep CSV to JSON ---
logger.info("\n--- Running CSV to JSON Conversion Example (Deep) ---");

// 1. Define a CSV string with flattened headers (dot and bracket notation).
// This is the output from the "deep" JSON-to-CSV conversion example.
const deepCsvString = `"name","profile.age","profile.registered","matrix[0][0]","matrix[0][1]","matrix[1][0]","matrix[1][1]"
"Alice","30","true","1","2","3","4"
"Bob","25","false","5","6",,`;

async function runDeep() {
    // 2. Parse the CSV string.
    const csvResponse = await parseCSV(deepCsvString);

    if (csvResponse.success) {
        logger.info("Parsed Format:", csvResponse.meta.format);
        // 3. Convert the successful parse result to JSON.
        // The function now automatically detects flattened headers and un-flattens by default.
        const nestedResult = await convertToJson(csvResponse);

        if (nestedResult.success) {
            logger.info("\n✅ Deep CSV to Nested JSON (Automatic):");
            logger.info("Un-flattened:", nestedResult.conversionMeta.unflatten);
            logger.info(nestedResult.content);
        }

        // 4. You can still force a flat structure by passing `unflatten: false`.
        const flatResult = await convertToJson(csvResponse, {
            unflatten: false,
        });
        if (!flatResult.success) {
            logger.error("❌ Flat JSON Conversion Failed:", flatResult.message);
            return;
        }
        logger.info("\n✅ Deep CSV to Flat JSON (with unflatten: false):");
        logger.info("Un-flattened:", flatResult.conversionMeta.unflatten);
        logger.info(flatResult.content);
    }
}

// Run both examples
async function runAllSuccess() {
    await runShallow();
    await runDeep();
}

logger.info("\n--- Running Failed CSV to JSON Conversion Example ---");

// 1. Define a CSV string with headers but no valid data rows.
const badCsvString = `"id","name"\n,,\n,,`;

async function runFailure() {
    // 2. Parse the CSV string.
    const csvResponse = await parseCSV(badCsvString);

    // The parser might still succeed but flag the data as invalid.
    logger.info("Parsed Format:", csvResponse.meta?.format);
    logger.info(
        "CSV parsing finished. Eligibility:",
        csvResponse.meta?.eligibleForConversion
    ); // Should be false

    // 3. Attempt to convert the ineligible data to JSON.
    const jsonResult = await convertToJson(csvResponse);

    if (!jsonResult.success) {
        logger.info("\n✅ Conversion correctly failed! Details:");
        logger.info("Message:", jsonResult.message);
        logger.info("Hints:", jsonResult.hints);
    }
}

logger.info("\n--- Running TSV to JSON Conversion Example ---");

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

        // Convert TSV data to JSON (should work automatically)
        const jsonResult = await convertToJson(tsvResponse);
        if (jsonResult.success) {
            logger.info("\n✅ TSV to JSON Conversion successful!");
            logger.info("JSON Content:", jsonResult.content);
        }
    } else {
        logger.error("❌ TSV Parsing Failed:", tsvResponse.message);
    }
}

async function runAllExamples() {
    await runAllSuccess();
    await runFailure();
    await runTsvExample();
    logger.info("\n--- All JSON Conversion Examples Finished ---");
    logger.end(); // Explicitly close the logger
}

runAllExamples();
