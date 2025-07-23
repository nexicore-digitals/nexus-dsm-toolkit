export interface ParseError extends Error {
  type: string | "Quotes" | "Delimiter" | "FieldMismatch";
  message: string;
  code?: string;
}
