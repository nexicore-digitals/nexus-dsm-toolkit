import parseCSV from "./utils/csv.utils.js";

const inputFormat = document.querySelector("#inputTypeSelect");
const inputFile = document.querySelector("#inputFile");
const analyzeBtn = document.querySelector("#analyze-btn");
const domDependencies = [inputFormat, inputFile, analyzeBtn];

function checkDomDependencies(dependencies: (Element | null)[]): boolean {
  return dependencies.every((element: Element | null) => {
    return element !== null;
  });
}

if (checkDomDependencies(domDependencies)) {
  inputFormat!.addEventListener("change", (e) => {
    inputFile!.setAttribute("accept", (e.target as HTMLSelectElement).value);
  });

  analyzeBtn!.addEventListener("click", async (evt: Event) => {
    evt.preventDefault();
    const file = (inputFile as HTMLInputElement).files?.[0];
    const dataFormat: string = inputFile?.getAttribute("accept") || "text/csv";
    if (file) handleAnalyzeFile(file, dataFormat);
  });
}
async function handleAnalyzeFile(file: File, dataFormat: string) {
  if (dataFormat.toLowerCase().includes("csv"))
    console.log(await parseCSV(file));
}
