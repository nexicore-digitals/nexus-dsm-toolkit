import parseCSV from "./utils/csv.utils.js";
const inputFormat = document.querySelector("#inputTypeSelect");
const inputFile = document.querySelector("#inputFile");
const analyzeBtn = document.querySelector("#analyze-btn");
const domDependencies = [inputFormat, inputFile, analyzeBtn];
function checkDomDependencies(dependencies) {
    return dependencies.every((element) => {
        return element !== null;
    });
}
if (checkDomDependencies(domDependencies)) {
    inputFormat.addEventListener("change", (e) => {
        inputFile.setAttribute("accept", e.target.value);
    });
    analyzeBtn.addEventListener("click", async (evt) => {
        evt.preventDefault();
        const file = inputFile.files?.[0];
        const dataFormat = inputFile?.getAttribute("accept") || "text/csv";
        if (file)
            handleAnalyzeFile(file, dataFormat);
    });
}
async function handleAnalyzeFile(file, dataFormat) {
    if (dataFormat.toLowerCase().includes("csv"))
        console.log(await parseCSV(file));
}
//# sourceMappingURL=script.js.map