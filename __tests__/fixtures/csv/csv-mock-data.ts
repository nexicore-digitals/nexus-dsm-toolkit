// mockCsvContents.ts

export const EMPTY_FILE = {
    success: false,
    content: "", // → EmptyFileError
};

export const NO_HEADERS = {
    success: false,
    content: "1,Alice,alice@example.com\n2,Bob,bob@example.com",
};

export const EMPTY_LINES = {
    success: true,
    content: `id,name,email\n1,Alice,alice@example.com\n\n2,Bob,bob@example.com`,
};

export const MISSING_HEADER_VALUE = {
    success: false,
    content: `id,name,email,
1,Alice,alice@example.com
2,Bob,bob@example.com`,
};

export const MISSING_QUOTES = {
    success: false,
    content: 'id,name,comment\n1,John,This "comment is missing an end quote',
};

export const INVALID_QUOTES = {
    success: false,
    content: `id,name,comment
1,"John,"This comment has misnested quotes"`, // → InvalidQuotes
};

export const TOO_FEW_FIELDS = {
    success: false,
    content: `id,name,email
1,Alice
2,Bob,bob@example.com`, // → TooFewFields
};

export const TOO_MANY_FIELDS = {
    success: false,
    content: `id,name,email
1,Alice,alice@example.com,extraColumn`, // → TooManyFields
};

export const UNDETECTABLE_DELIMITER = {
    success: false,
    content: `colA,colB;colC
val1|val2;val3
itemA-itemB_itemC`, // → UndetectableDelimiter
};

export const NO_VALID_DATA_ROWS = {
    success: false,
    content: `id,name,email
,,,
,,,
,,,`, // → InvalidDataRows
};

export const VALID_SAMPLE = {
    success: true,
    content: `id,name,email
1,Alice,alice@example.com
2,Bob,bob@example.com`, // ✅ No error
};

export const UNEXPECTED_FORMAT = {
    success: false,
    content: "# This file is corrupted value: missing, headers", // → UnknownError
};

export const TSV_SAMPLE = {
    content: `id\tname\tage\n1\tAlice\t30\n2\tBob\t25`,
    meta: {
        delimiter: "\t",
    },
};

export const CSV_WITH_COMMENTS = {
    success: true,
    content:
        "id,name,email\n# This is a comment line1,Alice,alice@example.com\n2,Bob,bob@example.com# Another comment",
};

const row = `"${"Charlie".repeat(100)}",${"Delta".repeat(100)}\n`; // ~200 bytes/row
export const CSV_TOO_LARGE = {
    success: true,
    content: `name,code\n` + row.repeat(53_000), // ~60MB total
};
