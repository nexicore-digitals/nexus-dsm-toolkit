// jsonMockdata.ts

// Mocks for critical, early-exit errors

export const EMPTY_FILE = {
  success: false,
  content: "", // A truly empty string
};

export const WHITESPACE_FILE = {
  success: false,
  content: "   \n\n ", // An empty file with only whitespace
};

export const INVALID_SYNTAX = {
  success: false,
  content: '{ "key": "value" ', // Missing a closing brace
};

export const INVALID_SYNTAX_WITH_COMMA = {
  success: false,
  content: '{ "key1": "value1", "key2": "value2", }', // Trailing comma (syntax error in standard JSON)
};

// Mocks for root structure validation errors

export const INVALID_ROOT_PRIMITIVE = {
  success: false,
  content: "123", // Root is a number
};

export const INVALID_ROOT_NULL = {
  success: false,
  content: "null", // Root is null
};

// Mocks for array-specific validation errors

export const NO_VALID_DATA_ROWS = {
  success: false,
  content: "[]", // An empty array
};

export const ALL_EMPTY_OBJECTS = {
  success: false,
  content: "[{}, {}, {}]", // An array with data, but all are empty objects (your new check)
};

export const NON_OBJECT_ITEM = {
  success: false,
  content: `[
    { "id": 1, "name": "Alice" },
    "this is not an object",
    { "id": 3, "name": "Charlie" }
  ]`, // Array contains a string
};

export const ARRAY_OF_ARRAYS = {
  success: false,
  content: `[
    { "id": 1, "name": "Alice" },
    ["an", "array", "of", "primitives"],
    { "id": 3, "name": "Charlie" }
  ]`, // Array contains another array
};

// Mocks for success scenarios

export const VALID_ARRAY_OF_OBJECTS = {
  success: true,
  content: `[
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ]`,
};

export const VALID_SINGLE_OBJECT = {
  success: true,
  content: `{
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }`,
};
