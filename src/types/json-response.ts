import { ValidResponse, ErrorResponse } from "./response.ts";

/**
 * Represents a successful JSON parsing operation.
 * It contains the parsed data and will eventually hold a metadata report.
 */
export interface JsonValidResponse extends ValidResponse {}

/**
 * Represents a failed JSON parsing operation.
 * It extends the base `ErrorResponse` but does not add JSON-specific properties.
 */
export interface JsonErrorResponse extends ErrorResponse {}

/**
 * A discriminated union representing the result of a JSON parsing operation.
 */
export type JsonResponse = JsonValidResponse | JsonErrorResponse;
