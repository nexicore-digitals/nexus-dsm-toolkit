import { parseJSON, convertToCsv } from "../main.js";

console.log("--- Running JSON to CSV Conversion Example ---");

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
