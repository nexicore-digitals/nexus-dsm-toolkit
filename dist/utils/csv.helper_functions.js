import { csvNoHeadersError, csvNoValidDataRowsError, } from "./csv.custom_errors";
export function csvQuoteCount(field) {
    if (!field)
        return 0;
    return field.match(/"/g)?.length ?? 0;
}
export function validateQuoteBalance(data) {
    const quoteErrors = [];
    data.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([key, value]) => {
            if (csvQuoteCount(value?.toString() ?? "") % 2 !== 0) {
                quoteErrors.push({
                    name: "CSVMissingQuotesError",
                    message: `Row ${rowIndex + 1}, field "${key}" has unbalanced quotes.`,
                    type: "SyntaxError",
                    code: "MissingQuotes",
                });
            }
        });
    });
    return quoteErrors;
}
export function validateHeaders(fields) {
    if (!fields || fields.length === 0)
        return csvNoHeadersError;
    const looksLikeData = fields.some((field) => /^[A-Z]/.test(field.trim()) || !isNaN(Number(field)));
    return looksLikeData ? csvNoHeadersError : null;
}
export function validateDataRows(data, fields) {
    return data.length === 0 && fields && fields.length > 0
        ? csvNoValidDataRowsError
        : null;
}
//# sourceMappingURL=csv.helper_functions.js.map