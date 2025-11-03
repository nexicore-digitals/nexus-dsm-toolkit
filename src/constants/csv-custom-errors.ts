import type {
    CsvEmptyFileError,
    CsvEnvironmentErrorType,
    CsvFileNotFoundError,
    CsvFileSystemError,
    CsvFileTooLargeError,
    CsvMissingHeaderValueError,
    CsvNoHeadersError,
    CsvNoValidDataRowsError,
} from "../types/csv.errors.js";

export const csvEmptyFileError: CsvEmptyFileError = {
    name: "CSVEmptyFileError",
    message: "CSV file is empty or contains no data.",
    type: "EmptyFileError",
    code: "EmptyFile",
};

export const csvFileTooLargeError: CsvFileTooLargeError = {
    name: "CSVFileTooLargeError",
    message: "CSV file exceeds the maximum allowed size.",
    type: "FileSizeError",
    code: "FileTooLarge",
};

export const csvFileNotFoundError: CsvFileNotFoundError = {
    name: "CSVFileNotFoundError",
    message: "CSV file was not found.",
    type: "FileSystemError",
    code: "FileNotFound",
};

export const csvFileSystemError: CsvFileSystemError = {
    name: "CSVFileSystemError",
    message: "An error occurred while reading the CSV file.",
    type: "FileSystemError",
    code: "FileReadError",
};

export const csvNoHeadersError: CsvNoHeadersError = {
    name: "CSVNoHeadersError",
    message:
        "CSV file has no valid headers. Ensure the first line is not empty.",
    type: "NoHeadersError",
    code: "NoHeaders",
};

export const csvMissingHeaderValueError: CsvMissingHeaderValueError = {
    name: "CSVMissingHeaderValueError",
    message: "CSV header contains one or more empty or missing column names.",
    type: "MissingHeaderValueError",
    code: "MissingHeaderValue",
};

export const csvNoValidDataRowsError: CsvNoValidDataRowsError = {
    name: "CSVNoValidDataRowsError",
    message:
        "CSV file contains headers but no valid data rows could be parsed.",
    type: "NoValidDataRowsError",
    code: "InvalidDataRows",
};

export const csvEnvironmentError: CsvEnvironmentErrorType = {
    name: "CSVEnvironmentError",
    message: "This function is designed for Node.js environments only.",
    type: "EnvironmentError",
    code: "EnvironmentMismatch",
};
