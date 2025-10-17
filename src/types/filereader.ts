/**
 * Represents a failed file read operation.
 */
export interface FileReadError {
    name: string;
    message: string;
    type: string;
    code: string;
    success: false;
    /** Optional content in case of a partial read error. */
    content?: string;
}

/**
 * Represents a successful file read operation.
 */
export interface FileReadSuccess {
    success: true;
    content: string;
}

/**
 * A discriminated union representing the result of a file read operation.
 */
export type FileReadResponse = FileReadSuccess | FileReadError;
