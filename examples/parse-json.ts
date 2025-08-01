// examples/parse.ts
import {
  VALID_ARRAY_OF_OBJECTS,
  ALL_EMPTY_OBJECTS,
} from "../__tests__/fixtures/json/json-mock-data";
import parseJSON from "../src/parsers/json-parser";

async function main(data: string) {
  const result = await parseJSON(data);

  if (result.success) {
    console.log("Parsed Result:", result.data);
  } else {
    console.log("Parsed Result:", result);
  }
}

async function run() {
  await main(VALID_ARRAY_OF_OBJECTS.content);
  console.log("\n-----------\n");
  await main(ALL_EMPTY_OBJECTS.content);
}

run();
