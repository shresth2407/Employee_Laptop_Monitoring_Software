import Session from "./session.model.js";
import User from "../users/user.model.js";

/* =========================
    LIST SESSIONS
========================= */
export const listSessions = async (query) => {
  const { employeeId, page = 1, limit = 10, status, from, to } = query;

  const filter = {};
  if (employeeId) filter.employeeId = employeeId;
  if (status) filter.status = status;

  if (from || to) {
    filter.startTime = {};
    if (from) filter.startTime.$gte = new Date(from);
    if (to) filter.startTime.$lte = new Date(`${to}T23:59:59.999Z`);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Session.find(filter)
      .populate("employeeId", "name email employeeId role department")
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Session.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/* =========================
    CURRENT SESSION
========================= */
export const getCurrentSession = async (employeeId) => {
  return await Session.findOne({
    employeeId,
    status: "ACTIVE",
  }).populate("employeeId", "name email employeeId role department");
};

/* =========================
    START SESSION
========================= */
export const startSession = async (employeeId) => {
  const user = await User.findById(employeeId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 🔥 FIX: Properly calculate and close old hanging sessions
  const activeSessions = await Session.find({
    employeeId,
    status: "ACTIVE",
  });

  const now = new Date();

  for (const s of activeSessions) {
    const sStartTime = new Date(s.startTime).getTime();
    const sEndTime = now;
    const sTotalSeconds = Math.max(0, Math.floor((sEndTime.getTime() - sStartTime) / 1000));

    // Agar heartbeat se data aaya hai toh wo use karo, varna total ko hi active maano
    const sActiveSecs = s.activeSeconds > 0 ? s.activeSeconds : sTotalSeconds;
    const sIdleSecs = Math.max(0, sTotalSeconds - sActiveSecs);
    const sPScore = sTotalSeconds > 0 ? Number(((sActiveSecs / sTotalSeconds) * 100).toFixed(2)) : 0;

    await Session.findByIdAndUpdate(s._id, {
      $set: {
        endTime: sEndTime,
        status: "ENDED",
        totalWorkSeconds: sTotalSeconds,
        activeSeconds: sActiveSecs,
        idleSeconds: sIdleSecs,
        productivityScore: sPScore
      }
    });
    }

  // 2. Naya Session Create Karo
const sessionDate = new Date().toISOString().slice(0, 10); 
  const session = await Session.create({
    employeeId,
    startTime: now,
    endTime: null,
    totalWorkSeconds: 0,
    activeSeconds: 0,
    idleSeconds: 0,
    productivityScore: 0,
    status: "ACTIVE",
    sessionDate,
  });

  return await Session.findById(session._id).populate(
    "employeeId",
    "name email employeeId role department"
  );
};

/* =========================
    END SESSION (ULTIMATE FIX)
========================= */
export const endSession = async (employeeId) => {
  // 1. Pehle active session dhundo
  const session = await Session.findOne({
    employeeId,
    status: "ACTIVE",
  });

  if (!session) {
    throw new Error("No active session found to end");
  }

  const startTime = new Date(session.startTime).getTime();
  const endTime = new Date();
  const endTimeMs = endTime.getTime();

  // 2. Exact calculation (Seconds mein)
  const totalSeconds = Math.max(0, Math.floor((endTimeMs - startTime) / 1000));

  // 3. Logic check: Active seconds stored vs Total Duration
  // Agar app band ho gayi thi toh activeSeconds total se kam honge (which is good)
  // Agar heartbeat bilkul nahi chali toh total ko hi active maano
  const activeSecs = (session.activeSeconds && session.activeSeconds > 0) 
                      ? session.activeSeconds 
                      : totalSeconds;

  const idleSecs = Math.max(0, totalSeconds - activeSecs);
  const pScore = totalSeconds > 0 ? Number(((activeSecs / totalSeconds) * 100).toFixed(2)) : 0;

  // 4. Update and Save (Directly Database mein push)
  const updatedSession = await Session.findByIdAndUpdate(
    session._id,
    {
      $set: {
        endTime: endTime,
        status: "ENDED",
        totalWorkSeconds: totalSeconds,
        activeSeconds: activeSecs,
        idleSeconds: idleSecs,
        productivityScore: pScore
      }
    },
    { new: true } // updated data return karega
  );

  return updatedSession;
};