import { describe, it, expect } from "vitest";
import { calculateNestingDepth } from "../../../src/utils/json-analysis-utilities.js";

describe("calculateNestingDepth", () => {
    it("should return 0 for primitive values", () => {
        expect(calculateNestingDepth("string")).toBe(0);
        expect(calculateNestingDepth(123)).toBe(0);
        expect(calculateNestingDepth(true)).toBe(0);
        expect(calculateNestingDepth(null)).toBe(0);
        expect(calculateNestingDepth(undefined)).toBe(0);
    });

    it("should return 1 for a flat object or array", () => {
        expect(calculateNestingDepth({})).toBe(1);
        expect(calculateNestingDepth([])).toBe(1);
        expect(calculateNestingDepth({ a: 1, b: 2 })).toBe(1);
        expect(calculateNestingDepth([1, 2, 3])).toBe(1);
    });

    it("should correctly calculate depth for nested objects", () => {
        const nestedObj = {
            a: {
                b: {
                    c: 1,
                },
            },
        };
        expect(calculateNestingDepth(nestedObj)).toBe(3);
    });

    it("should correctly calculate depth for nested arrays", () => {
        const nestedArr = [[["a"]]];
        expect(calculateNestingDepth(nestedArr)).toBe(3);
    });

    it("should correctly calculate depth for mixed nested structures", () => {
        const mixedStructure = {
            a: 1,
            b: [
                {
                    c: "test",
                    d: [{ e: true }],
                },
            ],
        };
        // Depth path: obj(1) -> array(2) -> obj(3) -> array(4) -> obj(5)
        expect(calculateNestingDepth(mixedStructure)).toBe(5);
    });

    it("should handle complex structures with multiple branches", () => {
        const complex = {
            level1_a: {
                level2: "deep",
            },
            level1_b: [
                {
                    level3: [{ level4: "deeper" }],
                },
            ],
        };
        // The deepest path is level1_b, which is 5 levels deep.
        expect(calculateNestingDepth(complex)).toBe(5);
    });
});
