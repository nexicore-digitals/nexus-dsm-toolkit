const papa = window.Papa;
export default function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csv = event.target?.result;
                const result = papa.parse(csv, { dynamicTyping: true, header: true });
                resolve(result);
            }
            catch (errors) {
                for (const error of errors) {
                }
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}
//# sourceMappingURL=csv.utils.js.map