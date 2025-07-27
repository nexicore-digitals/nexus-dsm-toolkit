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
            reject(new Error(`Error reading file: ${errorEvent.target?.error?.message ?? "Unknown error"}`));
        };
    });
}
//# sourceMappingURL=filereader.util.js.map