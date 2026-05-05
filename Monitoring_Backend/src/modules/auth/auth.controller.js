import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
  getCurrentUser,
  loginUser,
  refreshAccessToken,
} from "./auth.service.js";

import Session from "../session/session.model.js";
import { startSession } from "../session/session.service.js"; // ✅ ADD

/* =========================
   LOGIN (AUTO START SESSION)
========================= */
export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  const userId = result.user.id;

  const userAgent = req.headers["user-agent"] || "";

  // 🔥 DETECT PYTHON AGENT
  const isAgentLogin =
    userAgent.toLowerCase().includes("python") ||
    userAgent.toLowerCase().includes("requests");

  // 🔥 ONLY AGENT → START SESSION
  let sessionId = null;

  if (isAgentLogin) {
  const session = await startSession(userId); // ✅ USE SERVICE
  sessionId = session._id;
}

  return sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: {
      ...result,
      sessionId, // 🔥 ADD THIS
    },
  });
});

/* =========================
   ME
========================= */
export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);

  return sendSuccess(res, {
    message: "Current user fetched successfully",
    data: user,
  });
});

/* =========================
   REFRESH
========================= */
export const refresh = asyncHandler(async (req, res) => {
  const tokens = await refreshAccessToken(req.body.refreshToken);

  return sendSuccess(res, {
    message: "Token refreshed successfully",
    data: tokens,
  });
});

/* =========================
   LOGOUT (END SESSION)
========================= */
export const logout = asyncHandler(async (req, res) => {

  // ✅ ALWAYS END SESSION (NO CONDITION)
  await Session.updateMany(
    { employeeId: req.user.id, status: "ACTIVE" },
    { status: "ENDED", endTime: new Date() }
  );

  console.log("🔥 SESSION FORCE ENDED ON LOGOUT");

  return sendSuccess(res, {
    message: "Logged out successfully",
  });
});