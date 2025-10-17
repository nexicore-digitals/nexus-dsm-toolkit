import { ParseError } from "./errors.ts";
import { AnyParsedFileMeta } from "./meta.ts";
export interface BaseResponse {
    success: boolean;
}

export interface ValidResponse extends BaseResponse {
    data: object | object[];
    meta?: AnyParsedFileMeta;
    success: true;
}

export interface ErrorResponse extends BaseResponse, ParseError {
    detailedErrors?: ParseError[];
    meta?: AnyParsedFileMeta;
    success: false;
}
