/**
 * @file Provides utility functions for the advanced analysis of JSON structures.
 * @author Owen
 */

/**
 * Calculates the maximum nesting depth of a JSON object or array.
 * @param obj The object or array to analyze.
 * @returns The maximum depth.
 */

export function calculateNestingDepth(obj: Obj): number {
    if (typeof obj !== "object" || obj === null) {
        return 0;
    }

    if (Array.isArray(obj)) {
        return obj.length > 0
            ? 1 + Math.max(...obj.map(calculateNestingDepth))
            : 1;
    }

    const values = Object.values(obj);
    return values.length > 0
        ? 1 + Math.max(...values.map(calculateNestingDepth))
        : 1;
}

/**
 * Checks if all objects in an array have the same set of keys.
 * @param arr The array of objects to check.
 * @returns `true` if keys are consistent, `false` otherwise.
 */
export function checkKeyConsistency(arr: object[]): boolean {
    if (arr.length <= 1) {
        return true;
    }
    const firstKeys = Object.keys(arr[0]).sort().toString();
    return arr.every((obj) => Object.keys(obj).sort().toString() === firstKeys);
}

export type Obj =
    | string
    | number
    | boolean
    | null
    | undefined
    | object
    | object[];
