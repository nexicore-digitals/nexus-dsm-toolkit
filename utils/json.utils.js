function isJson(data) {
  let parsedData;
  try {
    // checks for empty data
    if (data.length === 0)
      throw new Error("JSON file is empty or contains no data rows.");
    parsedData = JSON.parse(data);
    return { success: true, data: parsedData };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
export { isJson };
