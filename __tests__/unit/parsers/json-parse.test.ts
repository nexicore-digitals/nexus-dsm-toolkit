import { describe, expect, it } from "vitest";
import parseJSON from "../../../src/parsers/json-parser";
import {
  EMPTY_FILE,
  WHITESPACE_FILE,
} from "../../fixtures/json/json-mock-data";

describe("JSON parsing tests", () => {
  it("should gracefully handle empty JSON file", async () => {
    const result = await parseJSON(EMPTY_FILE.content);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("JsonEmptyFileError");
      expect(result.code).toBe("EmptyJsonFile");
    }
  });
  it("if it contains whitespace it should also be considered an empty file", async () => {
    const result = await parseJSON(WHITESPACE_FILE.content);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("JsonEmptyFileError");
      expect(result.code).toBe("EmptyJsonFile");
    }
  });
});
