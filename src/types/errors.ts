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
    | "JsonValidation";
  message: string;
  code?: string;
}
