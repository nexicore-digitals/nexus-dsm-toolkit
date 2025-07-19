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

  analyzeBtn!.addEventListener("click", async (e) => {
    e.preventDefault();
  });
}
function handleAnalyzeFile(file: Blob) {}
