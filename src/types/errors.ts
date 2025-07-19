export interface ParseError extends Error {
  type: string;
}

/* JSON ERRORS SRART ------------------------ */
export interface JSONSyntaxError extends ParseError {
  type: "SyntaxError";
}

export interface JSONEmptyFileError extends ParseError {
  type: "EmptyFileError";
}

export interface JSONInvalidRootError extends ParseError {
  type: "InvalidRootError";
}

export interface JSONNonObjectItemError extends ParseError {
  type: "NonObjectItemError";
}

export interface JSONNoDataRowsError extends ParseError {
  type: "NoDataRowsError";
}

export interface JSONUnexpectedError extends ParseError {
  type: "UnexpectedError";
}

export type SpecificJSONError =
  | JSONSyntaxError
  | JSONEmptyFileError
  | JSONInvalidRootError
  | JSONNonObjectItemError
  | JSONNoDataRowsError
  | JSONUnexpectedError;

export interface BaseResponse {
  success: boolean;
}

export interface ValidResponse extends BaseResponse {
  success: true;
  data: object | object[];
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  message: string;
}

export type JsonParseResult = ValidResponse | ErrorResponse;
/* JSON ERRORS END ------------------------ */

/* CSV ERRORS START ----------------------- */
export interface CSVError extends ParseError {
  row?: number;
}

export interface CSVSyntaxError extends CSVError {
  type: "SyntaxError";
  row: number;
}

export interface CSVEmptyFileError extends CSVError {
  type: "EmptyFileError";
}

export interface CSVNoHeadersError extends CSVError {
  type: "NoHeadersError";
}

export interface CSVColumnMismatchError extends CSVError {
  type: "ColumnMismatchError";
}

export interface CSVNoValidDataRowsError extends CSVError {
  type: "NoValidDataRowsError";
}

export interface CSVUnexpectedError extends CSVError {
  type: "UnexpectedError";
}

export type SpecificCSVError =
  | CSVSyntaxError
  | CSVEmptyFileError
  | CSVNoHeadersError
  | CSVColumnMismatchError
  | CSVNoValidDataRowsError
  | CSVUnexpectedError;
/* CSV ERRORS END ----------------------- */
