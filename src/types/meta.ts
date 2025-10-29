/**
 * @file Defines the metadata interfaces for parsed files.
 * @author Owen
 */

import { ParseMeta } from "papaparse";
import { SpecificCsvError } from "./csv.errors.js";
import { SpecificJsonError } from "./json-errors.js";

/**
 * The base metadata structure for any successfully parsed file.
 * It contains high-level, format-agnostic information about the parsed data.
 */
export interface ParsedFileMeta {
    source: string; // filename, origin label, or upload ID
    fields: string[]; // extracted headers or keys
    rowCount: number; // total number of data rows
    eligibleForConversion: boolean; // passes all validation gates
    createdAt: string; // ISO timestamp
    diagnostics?: {
        warnings?: string[];
        notes?: string[];
        /** A summary of why the data is not eligible for conversion. */
        eligibilityReason?: string;
        errorCodes?: string[];
    };
    /** The detected format of the file. */
    format: "csv" | "tsv" | "json";
}

/**
 * A specialized metadata that extends the papaparse response meta
 */
export interface CsvParseMeta extends ParseMeta {
    renamedHeaders?: string[] | null;
}

/**
 * A specialized metadata object for successfully parsed CSV/TSV files.
 */
export interface CsvParsedFileMeta extends ParsedFileMeta {
    format: "csv" | "tsv"; // Narrow the format for CSV/TSV
    delimiter: string; // detected delimiter (e.g. ',', ';', '\t')
    quoteChar?: string; // detected quote character (e.g. '"')
    encoding?: string; // UTF-8, ISO-8859-1, etc.
    validationFlags: {
        hasHeaders: boolean;
        hasBalancedQuotes: boolean;
        hasValidRows: boolean;
        hasCommentLines?: boolean;
        hasEmptyLines?: boolean;
    };
    parseMeta?: CsvParseMeta;
}

/**
 * A specialized metadata object for successfully parsed JSON files.
 */
export interface JsonParsedFileMeta extends ParsedFileMeta {
    format: "json"; // Explicitly set for JSON files
    structureType: "array" | "object"; // JSON root structure
    nestingDepth: number; // max depth of nested objectss
    validationFlags: {
        isArrayOfObjects: boolean;
        hasConsistentKeys: boolean;
        hasValidRows: boolean;
        /** A list of keys that are not present in all objects of the array. */
        inconsistentKeys?: string[];
    };
}

/**
 * The response of the cav and json orchestrator that handles the file returning just the data in string
 */
export interface FileAnalysisResult {
    sourceLabel: string; // e.g. "data.csv"
    absolutePath: string; // full path for traceability
    content: string; // raw file content
    size: number; // file size in bytes
    encoding?: string; // optional: UTF-8, etc.
    diagnostics?: SpecificCsvError[] | SpecificJsonError[]; // optional: warnings or notes
}

export interface CsvFileAnalysisResult extends FileAnalysisResult {
    dianostics?: SpecificCsvError[];
}

export interface JsonFileAnalysisResult extends FileAnalysisResult {
    diagnostics?: SpecificJsonError[];
}

export type AnyParsedFileMeta = CsvParsedFileMeta | JsonParsedFileMeta;
