const papa = window.Papa;

export default function parseCSV(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const result = papa.parse(csv, { dynamicTyping: true, header: true });
        resolve(result);
      } catch (errors) {
        for (const error of errors as any[]) {
        }
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
