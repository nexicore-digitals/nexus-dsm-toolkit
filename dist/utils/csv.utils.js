import { transformPapaParseError } from "../adapters/papaparse.adapter.js";
const papa = window.Papa;
export default function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const customErrors = [];
        const csvReader = new FileReader();
        csvReader.readAsText(file, "utf8");
        csvReader.onload = (e) => {
            const csv = e.target?.result;
            if (csv.trim().length === 0) {
                const csvEmptyFileError = {
                    name: "CSVEmptyFileError",
                    message: "CSV file is empty or contains no data.",
                    type: "EmptyFileError",
                    code: "EmptyFile",
                };
                customErrors.push(csvEmptyFileError);
            }
            const result = papa.parse(csv, { dynamicTyping: true, header: true });
            /* papaparse merged it's result.meta.errors into result.errors */
            if (!(result.meta.fields !== undefined) ||
                result.meta.fields.length === 0) {
                const csvNoHeadersError = {
                    name: "CSVNoHeadersError",
                    message: "CSV file has no valid headers. Ensure the first line is not empty.",
                    type: "NoHeadersError",
                    code: "NoHeaders",
                };
                customErrors.push(csvNoHeadersError);
            }
            if (result.data.length === 0 &&
                result.meta.fields &&
                result.meta.fields.length > 0) {
                const csvNoValidDataRowsError = {
                    name: "CSVNoValidDataRowsError",
                    message: "CSV file contains headers but no valid data rows could be parsed.",
                    type: "NoValidDataRowsError",
                    code: "InvalidDataRows",
                };
                customErrors.push(csvNoValidDataRowsError);
            }
            result.errors.forEach((error) => {
                customErrors.push(transformPapaParseError(error));
            });
            if (customErrors.length === 0) {
                const customResult = {
                    meta: result.meta,
                    data: result.data,
                    success: true,
                };
                resolve(customResult);
            }
            else {
                const primaryError = customErrors[0]; // Get the first error for the main message
                const errorResponse = {
                    // Use CsvErrorResponse interface
                    success: false,
                    name: primaryError.name,
                    message: primaryError.message,
                    type: primaryError.type,
                    code: primaryError.code,
                    detailedErrors: customErrors, // Include all collected errors
                };
                return resolve(errorResponse);
            }
        };
        csvReader.onerror = (errorEvent) => {
            const unexpectedError = {
                name: "CSVUnexpectedError",
                message: `Error reading file: ${errorEvent.target?.error?.message || "Unknown file reading error"} (File: ${file.name})`,
                type: "UnexpectedError",
                code: "UnknownError",
            };
            // Resolve the Promise with an ErrorResponse containing the unexpected error
            return resolve({
                success: false,
                name: unexpectedError.name,
                message: unexpectedError.message,
                type: unexpectedError.type,
                code: unexpectedError.code,
                detailedErrors: [unexpectedError], // Include the specific error in detailedErrors
            });
        };
    });
}
//# sourceMappingURL=csv.utils.js.map