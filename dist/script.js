"use strict";
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
    analyzeBtn.addEventListener("click", async (e) => {
        e.preventDefault();
    });
}
function handleAnalyzeFile(file) { }
//# sourceMappingURL=script.js.map