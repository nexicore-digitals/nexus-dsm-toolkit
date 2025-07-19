interface Response {
  success: boolean;
}

interface ValidResponse extends Response {
  data: Object | Object[];
}

interface ErrorResponse extends Response {
  message: string;
}

function isJson(data: string): ValidResponse | ErrorResponse {
  let parsedData: unknown;
  try {
    // checks for empty data
    if (data.trim().length === 0)
      throw new Error("JSON file is empty or contains no data rows.");
    parsedData = JSON.parse(data);
    return { success: true, data: parsedData as Object | Object[] };
  } catch (err: any) {
    const message = err.message;
    return { success: false, message };
  }
}
export { isJson };
