function isJson(data) {
    let parsedData;
    try {
        // checks for empty data
        if (data.trim().length === 0)
            throw new Error("JSON file is empty or contains no data rows.");
        parsedData = JSON.parse(data);
        return { success: true, data: parsedData };
    }
    catch (err) {
        const message = err.message;
        return { success: false, message };
    }
}
export { isJson };
//# sourceMappingURL=json.utils.js.map