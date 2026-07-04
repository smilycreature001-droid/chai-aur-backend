class ApiError extends Error{
    conconstructor(
        statuscode,
        message="message went wrong",
        error = [],
        stack = ""
    ){
        super(message);
        this.statuscode = statuscode;
        this.error = null;
        this.message = message;
        this.sucess = false;
        this.errors = errors

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }

    
}

export default {ApiError}

