import { ErrorResponse, ValidResponse } from "./response.ts";

interface Meta {
    aborted: boolean;
    cursor: number;
    delimiter: string;
    fields?: string[] | undefined;
    linebreak: string;
    renamedHeaders?: null | string[];
    truncated: boolean;
}

export interface CsvValidResponse extends ValidResponse {
    meta: Meta | undefined;
}

export interface CsvErrorResponse extends ErrorResponse {}

export type CsvResponse = CsvValidResponse | CsvErrorResponse;
