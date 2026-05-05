import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import Session from "./session.model.js";
import {
  endSession,
  getCurrentSession,
  listSessions,
  startSession,
} from "./session.service.js";

/* =========================
   ADMIN / HR / TEAM LEAD
========================= */

export const list = asyncHandler(async (req, res) => {
  const result = await listSessions(req.query);

  return sendSuccess(res, {
    message: "Sessions fetched successfully",
    data: result,
  });
});

export const current = asyncHandler(async (req, res) => {
  const session = await getCurrentSession(req.params.employeeId);

  return sendSuccess(res, {
    message: "Current session fetched successfully",
    data: session,
  });
});

export const start = asyncHandler(async (req, res) => {
  const session = await startSession(req.body.employeeId);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Work session started successfully",
    data: session,
  });
});

// 🔥 ADMIN END SESSION
export const end = asyncHandler(async (req, res) => {
  const session = await endSession(req.body.employeeId);

  return sendSuccess(res, {
    message: "Work session ended successfully",
    data: session,
  });
});

/* =========================
   EMPLOYEE SELF APIs
========================= */

// 🔥 MY CURRENT SESSION (IMPORTANT FOR FRONTEND)
export const myCurrent = asyncHandler(async (req, res) => {

  const session = await Session.findOne({
    employeeId: req.user.id,
    status: "ACTIVE"
  });

  if (!session) {
    return sendSuccess(res, {
      message: "No active session",
      data: {
        active: false,
        session: null,
      },
    });
  }

  return sendSuccess(res, {
    message: "Active session",
    data: {
      active: true,
      session,
    },
  });
});

// 🔥 MY START SESSION (PYTHON CALL करेगा)
export const myStart = asyncHandler(async (req, res) => {
  const session = await startSession(req.user.id);

  return sendSuccess(res, {
    statusCode: 201,
    message: "My session started",
    data: session,
  });
});


// 🔥 MY END SESSION (PYTHON LOGOUT)
export const myEnd = asyncHandler(async (req, res) => {
  const session = await endSession(req.user.id);

  return sendSuccess(res, {
    message: "My session ended",
    data: session,
  });
});