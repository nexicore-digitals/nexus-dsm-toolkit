import { ParseError } from "./errors";
export interface BaseResponse {
  success: boolean;
}

export interface ValidResponse extends BaseResponse {
  data: object | object[];
  success: true;
}

export interface ErrorResponse extends BaseResponse, ParseError {
  detailedErrors?: ParseError[];
  success: false;
}
