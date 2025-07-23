import { ParseError } from "./errors";
export interface BaseResponse {
  success: boolean;
}

export interface ValidResponse extends BaseResponse {
  data: object | object[];
}

export interface ErrorResponse extends BaseResponse, ParseError {
  code?: string;
  detailedErrors?: ParseError[];
}
