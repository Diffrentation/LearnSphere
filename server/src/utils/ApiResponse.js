class ApiResponse{
    constructor(statusCode, messageOrData = null, dataOrMessage = null, error = null) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 300; // Determine success based on status code
        // Controllers use both (status, message, data) and (status, data,
        // message). Return a stable API shape in both cases.
        const messageFirst = typeof messageOrData === "string";
        this.message = messageFirst
            ? messageOrData
            : typeof dataOrMessage === "string"
                ? dataOrMessage
                : "";
        this.data = messageFirst ? dataOrMessage : messageOrData;
        this.error = error; // Error can be null if not applicable
        this.timestamp = new Date().toISOString(); // Add a timestamp for when the response was created
    }
}
export default ApiResponse;
