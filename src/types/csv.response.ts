import { CsvParsedFileMeta } from "./meta.ts";
import { ErrorResponse, ValidResponse } from "./response.ts";

/**
 * Represents a successful CSV parsing operation.
 * It contains the parsed data and the detailed metadata report.
 */
export interface CsvValidResponse extends ValidResponse {
    meta: CsvParsedFileMeta;
}

/**
 * Represents a failed CSV parsing operation.
 * It extends the base `ErrorResponse` but does not add CSV-specific properties.
 */
export interface CsvErrorResponse extends ErrorResponse {}

/**
 * A discriminated union representing the result of a CSV parsing operation.
 */
export type CsvResponse = CsvValidResponse | CsvErrorResponse;
