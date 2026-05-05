import Activity from "./activity.model.js";
import Session from "../session/session.model.js";
import { getSettingsService } from "../settings/settings.service.js";
/**
 * 🔥 COMMON FUNCTION (avoid duplicate code)
 */
const createActivityDoc = (employeeId, payload, type = "activity") => {
  return {
    employeeId,
    sessionId: payload.sessionId,

    applicationName: payload.applicationName || "",
    windowTitle: payload.windowTitle || "",

    keyboardActive: payload.keyboardActive ?? false,
    mouseActive: payload.mouseActive ?? false,
    idleStatus: payload.idleStatus ?? false,

    keystrokes: payload.keystrokes ?? 0,

    type,

    // ✅ ALWAYS SERVER TIME (FIXED 🔥)
    timestamp: new Date(),
  };
};

/**
 * Save single activity
 */
// export const saveActivityService = async (employeeId, payload) => {
//   if (!payload?.sessionId) {
//     throw new Error("sessionId is required");
//   }

//   const activity = await Activity.create(
//     createActivityDoc(employeeId, payload, "activity")
//   );

//   return activity;
// };

/**
 * Save heartbeat (lightweight)
 */

export const saveHeartbeatService = async (employeeId, payload) => {
  if (!payload?.sessionId) {
    throw new Error("sessionId is required");
  }

  const now = new Date();

  // ✅ SETTINGS FETCH
  const settings = await getSettingsService();
  const interval = settings.heartbeatIntervalSeconds || 5;

  // ✅ SAVE ACTIVITY
  const activity = await Activity.create(
    createActivityDoc(employeeId, payload, "heartbeat")
  );

  // ✅ SESSION FETCH
  const session = await Session.findById(payload.sessionId);

  if (session && session.status === "ACTIVE") {
    const startTime = new Date(session.startTime).getTime();
    const nowMs = now.getTime();

    const totalSeconds = Math.floor((nowMs - startTime) / 1000);

    // 🔥 ACTIVE CHECK
    const isActive = payload.keyboardActive || payload.mouseActive;

    let activeSeconds = session.activeSeconds || 0;
    let idleSeconds = session.idleSeconds || 0;

    // ✅ USE SETTINGS INTERVAL
    if (isActive) {
      activeSeconds += interval;
    } else {
      idleSeconds += interval;
    }

    const productivityScore =
      totalSeconds > 0
        ? Number(((activeSeconds / totalSeconds) * 100).toFixed(2))
        : 0;

    // ✅ UPDATE SESSION
    await Session.findByIdAndUpdate(session._id, {
      totalWorkSeconds: totalSeconds,
      activeSeconds,
      idleSeconds,
      productivityScore,
    });
  }

  return activity;
};
/**
 * Batch upload
 */
export const saveBatchService = async (employeeId, activities = []) => {
  if (!activities.length) {
    throw new Error("No activities provided");
  }

  const formatted = activities.map((item) =>
    createActivityDoc(employeeId, item, item.type || "activity")
  );

  const result = await Activity.insertMany(formatted, {
    ordered: false,
  });

  return result.length;
};

/**
 * 🔥 LIVE STATUS SERVICE (optimized + clean)
 */
export const getLiveStatusService = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;

  const skip = (page - 1) * limit;

  // ✅ 🔥 ADD THIS FILTER
  const filter = {};
  if (query.employeeId) {
    filter.employeeId = query.employeeId;
  }

  const data = await Activity.find(filter) // ✅ filter apply
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate("employeeId", "name employeeId department profilePhoto")
    .lean();

  const now = Date.now();

  return data.map((item) => {
    const lastTime = new Date(item.timestamp).getTime();

    const isOffline = lastTime < now - 5 * 60 * 1000;

    return {
      _id: item._id,

      employeeId: item.employeeId?._id,
      employeeName: item.employeeId?.name || "—",
      employeeCode: item.employeeId?.employeeId || "—",
      department: item.employeeId?.department || "—",
      profilePhoto: item.employeeId?.profilePhoto?.url || "",

      applicationName: item.applicationName || "—",
      windowTitle: item.windowTitle || "—",

      status: isOffline
        ? "OFFLINE"
        : item.idleStatus
        ? "IDLE"
        : "ACTIVE",

      keyboardActive: item.keyboardActive,
      keystrokes: item.keystrokes,
      mouseActive: item.mouseActive,

      lastHeartbeatAt: item.timestamp,
    };
  });
};