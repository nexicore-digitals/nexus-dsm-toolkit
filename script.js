const inputFormat = document.querySelector("#inputTypeSelect");
const inputFile = document.querySelector("#inputFile");
const analyzeBtn = document.querySelector("#analyze-btn");

inputFormat.addEventListener("change", (e) => {
  inputFile.setAttribute("accept", e.target.value);
});

analyzeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
});

function handleAnalyzeFile(file) {}
