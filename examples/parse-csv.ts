// examples/parse.ts
import {
  VALID_SAMPLE,
  EMPTY_FILE,
} from "../__tests__/fixtures/csv/csv-mock-data";
import parseCSV from "../src/parsers/csv-parser";

async function main(data: string) {
  const result = await parseCSV(data);

  if (result.success) {
    console.log("Parsed Result:", result.meta);
  } else {
    console.log("Parsed Result:", result);
  }
}

async function run() {
  await main(VALID_SAMPLE.content);
  console.log("\n-----------\n");
  await main(EMPTY_FILE.content);
}

run();
