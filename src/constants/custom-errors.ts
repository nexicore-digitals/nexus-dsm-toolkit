import type {
    FileNotFoundError,
    FileSystemError,
    FileTooLargeError,
} from "../types/errors.js";

export const fileSystemError: FileSystemError = {
    name: "FileSystemError",
    message: "An error occurred while reading the file from the filesystem.",
    type: "FileSystemError",
    code: "FileSystemError",
};

export const fileNotFoundError: FileNotFoundError = {
    name: "FileNotFoundError",
    message: "The specified file could not be found.",
    type: "FileNotFoundError", // Use the new type
    code: "FileNotFound",
};

export const fileTooLargeError: FileTooLargeError = {
    name: "FileTooLargeError",
    message: "The file is too large to process.",
    type: "FileTooLargeError",
    code: "FileTooLarge",
};
