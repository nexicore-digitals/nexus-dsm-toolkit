import { parseCSV, convertToJson } from "../main.js";

console.log("--- Running CSV to JSON Conversion Example ---");

// 1. Define a simple CSV string.
const csvString = `id,name\n1,Alice\n2,Bob`;

async function run() {
    // 2. Parse the CSV string.
    const csvResponse = await parseCSV(csvString);

    if (csvResponse.success) {
        // 3. Convert the successful parse result to JSON.
        const jsonResult = convertToJson(csvResponse);

        if (jsonResult.success) {
            console.log("✅ Conversion successful! JSON Content:");
            console.log(jsonResult.content);
        } else {
            console.error("❌ JSON Conversion Failed:", jsonResult.message);
        }
    }
}

run();
