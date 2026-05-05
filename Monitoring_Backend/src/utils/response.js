/**
 * Success response
 */
export const sendSuccess = (
  res,
  {
    statusCode = 200,
    message = "Operation successful",
    data = null,
  } = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error response
 */
export const sendError = (
  res,
  {
    statusCode = 500,
    message = "Something went wrong",
    errors = null,
  } = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};