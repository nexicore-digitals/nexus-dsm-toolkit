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
}

/**
 * Represents a failed data conversion.
 */
export interface FailedConversionResult {
    success: false;
    /** A detailed message explaining why the conversion failed. */
    message: string;
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
