class ApiResponse{
    constructor(statusCode, message, data,message ="success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}