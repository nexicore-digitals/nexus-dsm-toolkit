import { ValidResponse, ErrorResponse } from "./response";

export interface JsonValidResponse extends ValidResponse {}

export interface JsonErrorResponse extends ErrorResponse {}

export type JsonResponse = JsonValidResponse | JsonErrorResponse;
