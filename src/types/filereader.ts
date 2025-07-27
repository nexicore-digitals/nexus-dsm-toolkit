export interface FileReadError {
  name: string;
  message: string;
  type: string;
  code: string;
  success: false;
}
export interface FileReadSuccess {
  success: true;
  content: string;
}
export type FileReadResponse = FileReadSuccess | FileReadError;
