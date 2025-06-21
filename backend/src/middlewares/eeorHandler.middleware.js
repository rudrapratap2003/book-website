// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err); // for logging

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || []
  });
};
