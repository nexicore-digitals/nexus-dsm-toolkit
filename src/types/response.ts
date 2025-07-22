import { ParseError } from "./errors";
export interface BaseResponse {
  success: boolean;
}

export interface ValidResponse extends BaseResponse {
  success: true;
  data: object | object[];
}

export interface ErrorResponse extends BaseResponse, ParseError {
  success: false;
  code?: string;
  detailedErrors?: ParseError[];
}

export type JsonParseResult = ValidResponse | ErrorResponse;
export type CsvParseResult = ValidResponse | ErrorResponse;
