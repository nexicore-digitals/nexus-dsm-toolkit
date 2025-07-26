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
      reject(
        new Error(
          `Error reading file: ${
            errorEvent.target?.error?.message ?? "Unknown error"
          }`
        )
      );
    };
  });
}
