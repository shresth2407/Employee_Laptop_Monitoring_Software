import { verifyAccessToken } from "../config/jwt.js";
import User from "../modules/users/user.model.js";
import { sendError } from "../utils/response.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, {
        statusCode: 401,
        message: "Invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    const userId = decoded.id || decoded._id;

    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, {
        statusCode: 401,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return sendError(res, {
        statusCode: 403,
        message: "Account is inactive",
      });
    }

    req.user = {
      id: user._id.toString(),
      employeeId: user.employeeId, // 🔥 ADD THIS
      role: user.role,
    };

    next();
  } catch (error) {
    return sendError(res, {
      statusCode: 401,
      message: `Invalid token: ${error.message}`,
    });
  }
};

