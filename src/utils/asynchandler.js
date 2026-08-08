// asyncHandler wraps a controller function to catch any async errors
// and pass them to Express's next() error handler automatically
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            next(err);
        });
    };
};

export { asyncHandler };
