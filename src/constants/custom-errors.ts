import { FileNotFoundError, FileSystemError } from "../types/errors.ts";

export const fileSystemError: FileSystemError = {
    name: "FileSystemError",
    message: "An error occurred while reading the file from the filesystem.",
    type: "FileSystemError",
    code: "FileSystemError",
};

// Also, you'll want a specific error for 'file not found'
export const fileNotFoundError: FileNotFoundError = {
    name: "FileNotFoundError",
    message: "The specified file could not be found.",
    type: "FileNotFoundError", // Use the new type
    code: "FileNotFound",
};
