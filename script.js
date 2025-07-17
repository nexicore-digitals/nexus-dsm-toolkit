const inputFormat = document.querySelector("#inputTypeSelect");
inputFormat.addEventListener("change", (e) => {
  document.querySelector("#inputFile").setAttribute("accept", e.target.value);
});
