import {
  CsvEmptyFileError,
  CsvNoHeadersError,
  CsvNoValidDataRowsError,
} from "../types/csv.errors";

export const csvEmptyFileError: CsvEmptyFileError = {
  name: "CSVEmptyFileError",
  message: "CSV file is empty or contains no data.",
  type: "EmptyFileError",
  code: "EmptyFile",
};

export const csvNoHeadersError: CsvNoHeadersError = {
  name: "CSVNoHeadersError",
  message: "CSV file has no valid headers. Ensure the first line is not empty.",
  type: "NoHeadersError",
  code: "NoHeaders",
};

export const csvNoValidDataRowsError: CsvNoValidDataRowsError = {
  name: "CSVNoValidDataRowsError",
  message: "CSV file contains headers but no valid data rows could be parsed.",
  type: "NoValidDataRowsError",
  code: "InvalidDataRows",
};
