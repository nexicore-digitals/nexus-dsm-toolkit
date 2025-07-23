import { transformPapaParseError } from "../adapters/papaparse.adapter.js";
import {
  CsvEmptyFileError,
  CsvNoHeadersError,
  CsvNoValidDataRowsError,
  SpecificCsvError,
} from "../types/csv.errors";
import { CsvResponse } from "../types/csv.response";

const papa = window.Papa;

export default function parseCSV(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const customErrors: SpecificCsvError[] = [];

    const csvReader = new FileReader();

    csvReader.readAsText(file, "utf8");

    csvReader.onload = (e: ProgressEvent<FileReader>) => {
      const csv = e.target?.result as string;
      if (csv.trim().length === 0) {
        const csvEmptyFileError: CsvEmptyFileError = {
          name: "CSVEmptyFileError",
          message: "CSV file is empty or contains no data.",
          type: "EmptyFileError",
          code: "EmptyFile",
          // row and index are optional for this type
        };
        customErrors.push(csvEmptyFileError);
      }
      const result = papa.parse(csv, { dynamicTyping: true, header: true });
      if (
        !(result.meta.fields !== undefined) ||
        result.meta.fields.length === 0
      ) {
        const csvNoHeadersError: CsvNoHeadersError = {
          name: "CSVNoHeadersError",
          message:
            "CSV file has no valid headers. Ensure the first line is not empty.",
          type: "NoHeadersError",
          code: "NoHeaders",
          // row and index are optional for this type, so they are omitted if not applicable
        };
        customErrors.push(csvNoHeadersError);
      }
      if (
        result.data.length === 0 &&
        result.meta.fields &&
        result.meta.fields.length > 0
      ) {
        const csvNoValidDataRowsError: CsvNoValidDataRowsError = {
          name: "CSVNoValidDataRowsError",
          message:
            "CSV file contains headers but no valid data rows could be parsed.",
          type: "NoValidDataRowsError",
          code: "InvalidDataRows",
          // row and index are optional for this type, so they are omitted if not applicable
        };
        customErrors.push(csvNoValidDataRowsError);
      }
      result.errors.forEach((error) => {
        customErrors.push(transformPapaParseError(error));
      });
      const customResult: CsvResponse = {
        meta: result.meta,
        data: result.data,
        errors: customErrors,
        success: !!(customErrors.length === 0),
      };
      resolve(customResult);
    };
    csvReader.onerror = (e) => {
      console.log("Unable to read file:", file.name);
      reject(`Unable to read file: ${file.name}`);
    };
  });
}
