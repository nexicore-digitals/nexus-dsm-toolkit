import { FileReadResponse } from "../types/filereader";

export default function readFile(file: File): Promise<FileReadResponse> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsText(file, "utf8");

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      resolve({
        success: true,
        content,
      } as FileReadResponse);
    };

    fileReader.onerror = (errorEvent: ProgressEvent<FileReader>) => {
      const error = errorEvent.target?.error;
      resolve({
        success: false,
        name: "FileReadError",
        message: error
          ? error.message
          : "An unknown error occurred while reading the file.",
        type: "FileReadError",
        code: "ERR_FILE_READ",
        content: errorEvent.target?.result as string,
      });
    };
  });
}
