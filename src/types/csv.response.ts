import { CsvParsedFileMeta } from "./meta.ts";
import { ErrorResponse, ValidResponse } from "./response.ts";

export interface CsvValidResponse extends ValidResponse {
    meta: CsvParsedFileMeta;
}

export interface CsvErrorResponse extends ErrorResponse {}

export type CsvResponse = CsvValidResponse | CsvErrorResponse;
