import { describe, it, expect } from "vitest";
import { Readable } from "stream";
import { parseJsonStream } from "../../../src/parsers/json-stream-parser.js";
import { VALID_ARRAY_OF_OBJECTS } from "../../fixtures/json/json-mock-data.js";

describe("JSON Stream Parsing", () => {
    it("should correctly parse a valid JSON array from a stream", async () => {
        // 1. Create a readable stream from the mock JSON string
        const jsonStream = Readable.from(VALID_ARRAY_OF_OBJECTS.content);

        // 2. Call the stream parser
        const result = await parseJsonStream(jsonStream);

        // 3. Assert the results
        expect(result.success).toBe(true);

        if (result.success) {
            expect(result.data).toBeInstanceOf(Array);
            expect(result.data).toHaveLength(2);
            expect(Array.isArray(result.data) && result.data[0]).toEqual({
                id: 1,
                name: "Alice",
                email: "alice@example.com",
            });
            expect(result.meta.rowCount).toBe(2);
            expect(result.meta.fields).toEqual(["id", "name", "email"]);
        }
    });

    it("should handle an empty stream gracefully", async () => {
        const emptyStream = Readable.from("");
        const result = await parseJsonStream(emptyStream);

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.code).toBe("JsonSyntaxError");
        }
    });
});
