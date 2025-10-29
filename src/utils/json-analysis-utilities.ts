/**
 * @file Provides utility functions for the advanced analysis of JSON structures.
 * @author Owen
 */

export type Obj =
    | string
    | number
    | boolean
    | null
    | undefined
    | object
    | object[];

/**
 * Calculates the maximum nesting depth of a JSON object or array.
 * @param obj The object or array to analyze.
 * @returns The maximum depth.
 */
export function calculateNestingDepth(obj: Obj): number {
    if (typeof obj !== "object" || obj === null) {
        return 0;
    }

    let maxDepth = 0;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            maxDepth = Math.max(
                maxDepth,
                calculateNestingDepth((obj as Record<string, Obj>)[key])
            );
        }
    }

    return 1 + maxDepth;
}

/**
 * Checks if all objects in an array have the same set of keys.
 * @param arr The array of objects to check.
 * @returns `true` if keys are consistent, `false` otherwise.
 * @returns An object with a `consistent` boolean and a list of `inconsistentKeys`.
 */
export function checkKeyConsistency(arr: object[]): {
    consistent: boolean;
    inconsistentKeys?: string[];
} {
    if (arr.length <= 1) return { consistent: true };

    const allKeys = new Set<string>();
    const keyCounts = new Map<string, number>();

    arr.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
            allKeys.add(key);
            keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
        });
    });

    const inconsistentKeys = [...allKeys].filter(
        (key) => keyCounts.get(key) !== arr.length
    );

    if (inconsistentKeys.length > 0) {
        return { consistent: false, inconsistentKeys };
    }

    return { consistent: true };
}
