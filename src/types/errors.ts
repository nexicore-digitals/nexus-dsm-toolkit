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
    | "NonObjectItemError";
  message: string;
  code?: string;
}
