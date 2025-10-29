import { parseJSON, convertToCsv } from "../main.js";

console.log("--- Running JSON to CSV/TSV Conversion Example ---");

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
        console.log("Parsed JSON Format:", jsonResponse.meta.format);
        // 3. Convert the successful parse result to CSV.
        // By default, it performs a "shallow" conversion.
        const shallowResult = convertToCsv(jsonResponse);

        if (shallowResult.success) {
            console.log("✅ Shallow Conversion (Default):");
            console.log(
                "Flattening Mode:",
                shallowResult.conversionMeta.flattening
            );
            console.log(shallowResult.content);
        }

        // You can also perform a "deep" conversion.
        const deepResult = convertToCsv(jsonResponse, { flattening: "deep" });

        if (deepResult.success) {
            console.log("\n✅ Deep Conversion:");
            console.log(
                "Flattening Mode:",
                deepResult.conversionMeta.flattening
            );
            console.log(deepResult.content);
        } else {
            console.error("❌ CSV Conversion Failed:", deepResult.message);
        }
    }
}

console.log("\n--- Running Failed JSON to CSV Conversion Example ---");

// 1. Define a JSON string with inconsistent keys, making it ineligible for CSV conversion.
const badJsonString = `[
  { "id": 1, "name": "Alice" },
  { "id": 2, "username": "Bob" }
]`;

async function runFailure() {
    // 2. Parse the JSON string.
    const jsonResponse = await parseJSON(badJsonString);

    if (jsonResponse.success) {
        console.log("Parsed JSON Format:", jsonResponse.meta.format);
        console.log(
            "JSON parsing succeeded, but data is not eligible for conversion."
        );
        console.log("Eligibility:", jsonResponse.meta.eligibleForConversion);
        console.log(
            "Reason:",
            jsonResponse.meta.diagnostics?.eligibilityReason
        );
        console.log(
            "Inconsistent Keys:",
            jsonResponse.meta.validationFlags.inconsistentKeys
        );

        // 3. Attempt to convert the ineligible data to CSV.
        const csvResult = convertToCsv(jsonResponse);

        if (!csvResult.success) {
            console.log("\n✅ Conversion correctly failed! Details:");
            console.log("Message:", csvResult.message);
            console.log("Hints:", csvResult.hints);
        }
    }
}

runSuccess();
runFailure();

console.log("\n--- Running TSV Conversion Example ---");

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

        // Convert TSV data to JSON
        const jsonResult = convertToJson(tsvResponse);
        if (jsonResult.success) {
            console.log("\n✅ TSV to JSON Conversion successful!");
            console.log("JSON Content:", jsonResult.content);
        } else {
            console.error(
                "❌ TSV to JSON Conversion Failed:",
                jsonResult.message
            );
        }
    } else {
        console.error("❌ TSV Parsing Failed:", tsvResponse.message);
        console.log("Diagnostics:", tsvResponse.meta?.diagnostics);
    }
}

// Assuming convertToJson is imported from main.js
import { convertToJson, parseCSV } from "../main.js";
runTsvExample();
