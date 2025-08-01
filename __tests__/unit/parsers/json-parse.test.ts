import { describe, expect, it } from "vitest";
import parseJSON from "../../../src/parsers/json-parser";
import {
  ALL_EMPTY_OBJECTS,
  EMPTY_FILE,
  INVALID_ROOT_NULL,
  INVALID_ROOT_PRIMITIVE,
  NON_OBJECT_ITEM,
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
  describe("it should identify primitives and null as invalid root data", async () => {
    it("it should identify primitives as invalid json root data", async () => {
      const result = await parseJSON(INVALID_ROOT_PRIMITIVE.content);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.name).toBe("JsonInvalidRootError");
        expect(result.code).toBe("InvalidJsonRoot");
      }
    });
    it("it should identify null as invalid json root data", async () => {
      const result = await parseJSON(INVALID_ROOT_NULL.content);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.name).toBe("JsonInvalidRootError");
        expect(result.code).toBe("InvalidJsonRoot");
      }
    });
  });
  it("for json array object all items should  be valid objects", async () => {
    const result = await parseJSON(NON_OBJECT_ITEM.content);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("JsonNonObjectItemError");
      expect(result.code).toBe("NonObjectArrayItem");
    }
  });
  it("empty arrays are valid but do not pass the check", async () => {
    const result = await parseJSON(ALL_EMPTY_OBJECTS.content);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.name).toBe("JsonNoDataRowsError");
      expect(result.code).toBe("NoJsonDataRows");
    }
  });
});
