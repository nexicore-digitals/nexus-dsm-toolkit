export default function readFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "utf8");
        fileReader.onload = (e) => {
            const content = e.target?.result;
            resolve({
                success: true,
                content,
            });
        };
        fileReader.onerror = (errorEvent) => {
            const error = errorEvent.target?.error;
            resolve({
                success: false,
                name: "FileReadError",
                message: error
                    ? error.message
                    : "An unknown error occurred while reading the file.",
                type: "FileReadError",
                code: "ERR_FILE_READ",
                content: errorEvent.target?.result,
            });
        };
    });
}
//# sourceMappingURL=filereader.util.js.map