/**
 * @file Defines the interfaces for data conversion results.
 * @author Owen
 */

/**
 * Represents a successful conversion to JSON format.
 */
export interface SuccessfulJsonConversionResult {
    success: true;
    /** The converted data as a pretty-printed JSON string. */
    content: string;
    structureType: "array" | "object";
    rootLength: number;
    nestingDepth: number;
    keySet: string[];
    /** The raw object array, useful for direct use without re-parsing. */
    rootItems: object[];
    /** Preserves original JSON structure if it was a single object. */
    original: unknown;
    /** Details about the conversion process. */
    conversionMeta: {
        /** The strategy used to handle nested structures. */
        unflatten: boolean;
    };
}

/**
 * Represents a successful conversion to CSV format.
 */
export interface SuccessfulCsvConversionResult {
    success: true;
    /** The converted data as a CSV string. */
    content: string;
    columnNames: string[];
    /** The data used for the conversion. */
    flatRecords: object[];
    rowCount: number;
    delimiter: string;
    quoteChar?: string;
    encoding?: string;
    /** Details about the conversion process. */
    conversionMeta: {
        /** The strategy used to handle nested structures. */
        flattening: "deep" | "shallow";
    };
}

/**
 * Defines the options available for converting JSON to CSV.
 */
export interface CsvConversionOptions {
    /**
     * Specifies the strategy for handling nested objects within the JSON data.
     * - `'shallow'` (default): Stringifies nested objects into a single cell.
     * - `'deep'`: Recursively flattens nested objects into separate columns with dot notation (e.g., 'user.name').
     */
    flattening?: "deep" | "shallow";
}

/**
 * Defines the options available for converting CSV to JSON.
 */
export interface JsonConversionOptions {
    /**
     * If `true`, attempts to reconstruct a nested JSON object from flattened
     * CSV headers (e.g., 'user.name' or 'tags[0]'). Defaults to `false`.
     */
    unflatten?: boolean;
}

/**
 * Represents a failed data conversion.
 */
export interface FailedConversionResult {
    success: false;
    /** A detailed message explaining why the conversion failed. */
    message: string;
    /** An array of strings providing specific reasons or suggestions for the failure. */
    hints?: string[];
}

/**
 * Represents a successful conversion of parsed data into a normalized tabular structure.
 * This is an intermediate structure, ready for inspection or final serialization.
 */
export interface SuccessfulCsvTabularConversion {
    success: true;
    message?: string;
    /** The parsed data rows. */
    flatRecords: object[];
    /** The header fields. */
    columnNames: string[];
    rowCount: number;
    columnCount: number;
    delimiter: string;
    quoteChar?: string;
    encoding?: string;
    sourceLabel?: string;
    conversionWarnings?: string[];
}

/**
 * A discriminated union representing the result of a conversion to JSON.
 */
export type JsonConversionResult =
    | SuccessfulJsonConversionResult
    | FailedConversionResult;

/**
 * A discriminated union representing the result of a tabular conversion from CSV data.
 */
export type CsvTabularConversion =
    | SuccessfulCsvTabularConversion
    | FailedConversionResult;

/**
 * A discriminated union representing the result of a conversion to CSV.
 */
export type CsvConversionResult =
    | SuccessfulCsvConversionResult
    | FailedConversionResult;

/**
 * A generic discriminated union representing the result of any conversion operation.
 * Use this to ensure type-safe handling of conversion outcomes.
 */
export type AnyConversionResult = JsonConversionResult | CsvConversionResult;
