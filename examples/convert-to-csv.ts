import { parseJSON, convertToCsv } from "../main.js";

console.log("--- Running JSON to CSV Conversion Example ---");

// 1. Define a simple JSON string.
const jsonString = `[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]`;

async function run() {
    // 2. Parse the JSON string.
    const jsonResponse = await parseJSON(jsonString);

    if (jsonResponse.success) {
        // 3. Convert the successful parse result to CSV.
        const csvResult = convertToCsv(jsonResponse);

        if (csvResult.success) {
            console.log("✅ Conversion successful! CSV Content:");
            console.log(csvResult.content);
        } else {
            console.error("❌ CSV Conversion Failed:", csvResult.message);
        }
    }
}

run();
