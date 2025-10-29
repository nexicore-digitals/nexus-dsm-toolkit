import { parseCSV, convertToJson } from "../main.js";

// --- Example 1: Shallow CSV to JSON ---
console.log("--- Running CSV to JSON Conversion Example (Shallow) ---");

// 1. Define a CSV string where some fields contain stringified JSON.
// This is the output from the "shallow" JSON-to-CSV conversion example.
const shallowCsvString = `"name","profile","matrix"
"Alice","{""age"":30,""registered"":true}","[[1,2],[3,4]]"
"Bob","{""age"":25,""registered"":false}","[[5,6]]"`;

async function runShallow() {
    // 2. Parse the CSV string.
    const csvResponse = await parseCSV(shallowCsvString);

    if (csvResponse.success) {
        console.log("Parsed Format:", csvResponse.meta.format);
        // 3. Convert the successful parse result to JSON.
        const jsonResult = convertToJson(csvResponse);

        if (jsonResult.success) {
            console.log("✅ Shallow CSV conversion successful!");
            console.log("Un-flattened:", jsonResult.conversionMeta.unflatten);
            console.log(jsonResult.content);
        } else {
            console.error("❌ JSON Conversion Failed:", jsonResult.message);
        }
    }
}

// --- Example 2: Deep CSV to JSON ---
console.log("\n--- Running CSV to JSON Conversion Example (Deep) ---");

// 1. Define a CSV string with flattened headers (dot and bracket notation).
// This is the output from the "deep" JSON-to-CSV conversion example.
const deepCsvString = `"name","profile.age","profile.registered","matrix[0][0]","matrix[0][1]","matrix[1][0]","matrix[1][1]"
"Alice","30","true","1","2","3","4"
"Bob","25","false","5","6",,`;

async function runDeep() {
    // 2. Parse the CSV string.
    const csvResponse = await parseCSV(deepCsvString);

    if (csvResponse.success) {
        console.log("Parsed Format:", csvResponse.meta.format);
        // 3. Convert the successful parse result to JSON.
        // The function now automatically detects flattened headers and un-flattens by default.
        const nestedResult = convertToJson(csvResponse);

        if (nestedResult.success) {
            console.log("\n✅ Deep CSV to Nested JSON (Automatic):");
            console.log("Un-flattened:", nestedResult.conversionMeta.unflatten);
            console.log(nestedResult.content);
        }

        // 4. You can still force a flat structure by passing `unflatten: false`.
        const flatResult = convertToJson(csvResponse, { unflatten: false });
        if (!flatResult.success) {
            console.error(
                "❌ Flat JSON Conversion Failed:",
                flatResult.message
            );
            return;
        }
        console.log("\n✅ Deep CSV to Flat JSON (with unflatten: false):");
        console.log("Un-flattened:", flatResult.conversionMeta.unflatten);
        console.log(flatResult.content);
    }
}

// Run both examples
async function runAllSuccess() {
    await runShallow();
    await runDeep();
}

console.log("\n--- Running Failed CSV to JSON Conversion Example ---");

// 1. Define a CSV string with headers but no valid data rows.
const badCsvString = `"id","name"\n,,\n,,`;

async function runFailure() {
    // 2. Parse the CSV string.
    const csvResponse = await parseCSV(badCsvString);

    // The parser might still succeed but flag the data as invalid.
    console.log("Parsed Format:", csvResponse.meta?.format);
    console.log(
        "CSV parsing finished. Eligibility:",
        csvResponse.meta?.eligibleForConversion
    ); // Should be false

    // 3. Attempt to convert the ineligible data to JSON.
    const jsonResult = convertToJson(csvResponse);

    if (!jsonResult.success) {
        console.log("\n✅ Conversion correctly failed! Details:");
        console.log("Message:", jsonResult.message);
        console.log("Hints:", jsonResult.hints);
    }
}

runAllSuccess();
runFailure();

console.log("\n--- Running TSV to JSON Conversion Example ---");

// 1. Define a TSV string
const tsvString = `id\tname\tage\n1\tAlice\t30\n2\tBob\t25`;

async function runTsvExample() {
    // 2. Parse the TSV string.
    const tsvResponse = await parseCSV(tsvString);

    if (tsvResponse.success) {
        console.log("✅ TSV Parsing successful!");
        console.log("Parsed Format:", tsvResponse.meta.format); // Should be 'tsv'
        console.log("Delimiter:", tsvResponse.meta.delimiter); // Should be '\t'
        console.log("Data:", tsvResponse.data);

        // Convert TSV data to JSON (should work automatically)
        const jsonResult = convertToJson(tsvResponse);
        if (jsonResult.success) {
            console.log("\n✅ TSV to JSON Conversion successful!");
            console.log("JSON Content:", jsonResult.content);
        }
    } else {
        console.error("❌ TSV Parsing Failed:", tsvResponse.message);
    }
}
runTsvExample();
