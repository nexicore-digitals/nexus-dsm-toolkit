export interface FileReadError {
  name: string;
  message: string;
  type: string;
  code: string;
  success: false;
  content?: string; // Optional content in case of an error
}
export interface FileReadSuccess {
  success: true;
  content: string;
}
export type FileReadResponse = FileReadSuccess | FileReadError;
