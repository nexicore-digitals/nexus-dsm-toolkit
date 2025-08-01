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
    | "OperationalError";
  message: string;
  code?: string;
}

export interface FileSystemError extends ParseError {
  type: "FileSystemError";
  code: "FileSystemError";
}

export interface FileNotFoundError extends ParseError {
  type: "FileNotFoundError";
  code: "FileNotFound";
}
