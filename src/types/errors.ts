/**
 * The foundational interface for all parsing errors in the toolkit.
 * It extends the built-in `Error` and adds a machine-readable `type` and `code`.
 */
export interface ParseError extends Error {
    type:
        | "SyntaxError"
        | "QuotesError"
        | "DelimiterError"
        | "FieldMismatchError"
        | "NoHeadersError"
        | "MissingHeaderValueError"
        | "EmptyFileError"
        | "NoValidDataRowsError"
        | "UnexpectedError"
        | "InvalidRootError"
        | "NonObjectItemError"
        | "JsonValidation"
        | "FileSystemError"
        | "FileNotFoundError"
        | "FileSizeError"
        | "OperationalError"
        | "EnvironmentError"
        | "FileTooLargeError";
    message: string;
    code?: string;
}

/**
 * A generic error for file system issues.
 */
export interface FileSystemError extends ParseError {
    type: "FileSystemError";
    code: "FileSystemError";
}

/**
 * An error for when a specified file path does not exist.
 */
export interface FileNotFoundError extends ParseError {
    type: "FileNotFoundError";
    code: "FileNotFound";
}

/**
 * An error for when a file is too large to process.
 */
export interface FileTooLargeError extends ParseError {
    type: "FileTooLargeError";
    code: "FileTooLarge";
}
