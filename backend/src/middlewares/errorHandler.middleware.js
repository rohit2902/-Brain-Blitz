import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  //  console.log("Error:", err);
   

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  console.error(error.stack);

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
  });
};

export default errorHandler;