// examples/parse.ts
import parseCSV from "../src/parsers/csv-parser";
import {
  EMPTY_FILE,
  VALID_SAMPLE,
} from "../__tests__/fixtures/csv/mockCsvData";

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
