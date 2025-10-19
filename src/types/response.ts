import { ParseError } from "./errors.js";
import { AnyParsedFileMeta } from "./meta.js";

/**
 * The most basic response structure, used to discriminate between success and failure.
 */
export interface BaseResponse {
    success: boolean;
}

/**
 * The base interface for any successful parsing operation.
 * It guarantees the presence of the parsed data payload.
 */
export interface ValidResponse extends BaseResponse {
    data: object | object[];
    meta?: AnyParsedFileMeta;
    success: true;
}

/**
 * The base interface for any failed parsing operation.
 * It extends the base `ParseError` and includes the `meta` object for context,
 * even on failure.
 */
export interface ErrorResponse extends BaseResponse, ParseError {
    detailedErrors?: ParseError[];
    meta?: AnyParsedFileMeta;
    success: false;
}
