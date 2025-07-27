// examples/parse.ts
import fs from "fs";
import parseCSV from "../src/parsers/csv-parser";

async function main(CSVSampleFilePath: string) {
  const file = fs.readFileSync(CSVSampleFilePath, "utf-8");
  const result = await parseCSV(file);

  if (result.success) {
    console.log("Parsed Result:", result.meta);
  } else {
    console.log("Parsed Result:", result);
  }
}

async function run() {
  const goodCSVFilePath = "./data/goodSample.csv";
  const emptyCSVFilePath = "./data/emptySample.csv";

  await main(goodCSVFilePath);
  console.log("-----------");
  await main(emptyCSVFilePath);
}

run();
