// src/utils/error-sorter.ts

import { SpecificCsvError } from "../types/csv.errors.ts";

// Define the priority for each error code.
// Lower number = Higher priority.
const ERROR_PRIORITY_MAP: { [code: string]: number } = {
    // 1. Fundamental / Blocking Errors
    EmptyFile: 1,
    UndetectableDelimiter: 2,

    // 2. Structural Errors (Header / Data Rows)
    NoHeaders: 3,
    MissingHeaderValue: 4,
    InvalidDataRows: 5,

    // 3. Syntax Errors (Quote / Field Mismatch - honoring your specific preference)
    InvalidQuotes: 6, // Highest priority among quote/field issues, as requested
    MissingQuotes: 7, // Second highest among quote issues
    TooFewFields: 8,
    TooManyFields: 9,

    // 4. Catch-all / Unexpected Errors
    UnknownError: 99, // Assign a very low priority to unknown errors
};

/**
 * Sorts an array of SpecificCsvError objects based on a predefined priority order.
 * Errors with lower priority numbers will appear earlier in the sorted array.
 * Errors whose 'code' is not defined in the priority map will be placed at the very end.
 *
 * @param errors An array of SpecificCsvError objects to sort.
 * @returns A new array with the errors sorted by priority.
 */
export function sortCsvErrorsByPriority(
    errors: SpecificCsvError[],
): SpecificCsvError[] {
    // Create a shallow copy to avoid modifying the original array
    const sortedErrors = [...errors];

    sortedErrors.sort((a, b) => {
        // Get the priority for each error. If a code isn't in the map, assign Infinity
        // to place it at the very end.
        const priorityA = ERROR_PRIORITY_MAP[a.code] ?? Infinity;
        const priorityB = ERROR_PRIORITY_MAP[b.code] ?? Infinity;

        return priorityA - priorityB; // Sorts in ascending order of priority number
    });

    return sortedErrors;
}
