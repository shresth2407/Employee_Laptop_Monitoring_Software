
import { sendError } from "../utils/response.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    const errors = {};
    for (const key in err.errors) {
      errors[key] = err.errors[key].message;
    }

    return sendError(res, {
      statusCode: 422,
      message: "Validation failed",
      errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    return sendError(res, {
      statusCode: 409,
      message: `${field} already exists`,
    });
  }

  return sendError(res, {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal server error",
  });
};

export default errorMiddleware;