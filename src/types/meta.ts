export interface Issue {
    message: string;
    category: string; // e.g., "Data Quality", "Formatting", "Schema"
    level?: "info" | "warning" | "error";
}

export interface ParsedFileMeta {
    fileName: string;
    fileSize: number;
    sourcePath: string;
    format: "csv" | "json";
    parsed: "pending" | "progress" | "completed" | "terminated";
    timestamp: string; // ISO
    issues: string[];
}

export interface CsvParsedFileMeta extends ParsedFileMeta {
    format: "csv";
    rowCount: number;
    columnCount: number;
    hasHeaders: boolean;
}

export interface JsonParsedFileMeta extends ParsedFileMeta {
    format: "json";
    recordCount: number;
    isRootArray: boolean;
    rootKeys: string[];
}
