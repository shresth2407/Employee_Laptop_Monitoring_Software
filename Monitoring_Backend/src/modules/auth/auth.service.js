import bcrypt from "bcryptjs";
import User from "../users/user.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../config/jwt.js";

/**
 * Login User (FINAL FIXED)
 */
export const loginUser = async (data = {}) => {
  const { email, password } = data;

  if (!email || !password) {
    throw Object.assign(
      new Error("Email and password are required"),
      { statusCode: 400 }
    );
  }

  // 🔹 Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // 🔹 Find user + password
  const user = await User.findOne({ email: normalizedEmail })
    .select("+password")
    .populate("department");

  // 🔹 Check user exists
  if (!user) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  // 🔹 Check active
  if (!user.isActive) {
    throw Object.assign(new Error("Account is inactive"), {
      statusCode: 403,
    });
  }

  // 🔹 Compare password
  const isMatch = await bcrypt.compare(password, user.password || "");

  if (!isMatch) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  // 🔹 Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // 🔹 Token payload
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  // 🔹 Generate tokens
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // 🔹 Return clean response
  return {
    accessToken,
    refreshToken,
   user: {
  _id: user._id,   // 🔥 FIX
  id: user._id,    // (optional keep for frontend)
  employeeId: user.employeeId,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department?.name || null,
  profilePhotoUrl: user.profilePhoto.url || null,
},
  };
};

/**
 * Get Current User
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate("department");

  if (!user) {
    throw Object.assign(new Error("User not found"), {
      statusCode: 404,
    });
  }

  return {
    id: user._id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department?.name || null,
    isActive: user.isActive,
    profilePhotoUrl: user.profilePhoto.url || null,
  };
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw Object.assign(new Error("Refresh token is required"), {
      statusCode: 400,
    });
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw Object.assign(new Error("Invalid or expired refresh token"), {
      statusCode: 401,
    });
  }

  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    throw Object.assign(new Error("Invalid refresh token"), {
      statusCode: 401,
    });
  }

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};