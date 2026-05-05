import Session from "../session/session.model.js";
import Activity from "../activity/activity.model.js";

/* =========================
    SESSION STATUS
========================= */
export const sessionStatus = async (req, res) => {
  try {
    let session = await Session.findOne({
      employeeId: req.user.id,
      status: "ACTIVE"
    });

    // 🔥 AUTO START SESSION
    if (!session) {
      session = await Session.create({
        employeeId: req.user.id,
        startTime: new Date(),
        status: "ACTIVE",
        totalWorkSeconds: 0,
        activeSeconds: 0,
        idleSeconds: 0,
        productivityScore: 0
      });
      console.log("🔥 SESSION AUTO STARTED:", session._id);
    }

    res.json({
      success: true,
      data: {
        hasActiveSession: true,
        sessionId: session._id,
        startTime: session.startTime,
        settings: {
          screenshotIntervalMinutes: 5,
          idleThresholdMinutes: 5,
          heartbeatIntervalSeconds: 30
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
    HEARTBEAT
========================= */
export const heartbeat = async (req, res) => {
  try {
    const { applicationName, windowTitle, idleStatus, sessionId, timestamp } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }

    // ✅ Secure session validation
    const session = await Session.findOne({
      _id: sessionId,
      employeeId: req.user.id,
      status: "ACTIVE"
    });

    if (!session) {
      return res.status(400).json({ success: false, message: "Invalid or expired session" });
    }

    // ✅ SAVE ACTIVITY
    await Activity.create({
      employeeId: req.user.id,
      sessionId: session._id,
      applicationName,
      windowTitle,
      idleStatus,
      timestamp: new Date(timestamp || new Date())
    });

    // ===============================
    // 🔥 UPDATE SESSION (FIXED WITH $INC)
    // ===============================
    const HEARTBEAT_SECONDS = 30;

    // Direct Atomic Update: Isse data kabhi overwrite nahi hoga
    const updateFields = {
      $inc: {
        totalWorkSeconds: HEARTBEAT_SECONDS,
        [idleStatus ? "idleSeconds" : "activeSeconds"]: HEARTBEAT_SECONDS
      }
    };

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      updateFields,
      { new: true } // Updated data lene ke liye
    );

    // Productivity Score calculation after update
    if (updatedSession) {
      const total = updatedSession.totalWorkSeconds;
      const active = updatedSession.activeSeconds;
      updatedSession.productivityScore = total > 0 ? Math.round((active / total) * 100) : 0;
      await updatedSession.save();
    }

    return res.json({ success: true, message: "Heartbeat received and saved" });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
    BATCH ACTIVITY
========================= */
export const batchActivity = async (req, res) => {
  try {
    const { events, sessionId } = req.body;

    if (!sessionId || !Array.isArray(events)) {
      return res.status(400).json({ success: false, message: "sessionId and events array required" });
    }

    const session = await Session.findOne({
      _id: sessionId,
      employeeId: req.user.id,
      status: "ACTIVE"
    });

    if (!session) {
      return res.status(400).json({ success: false, message: "Invalid or expired session" });
    }

    const docs = events.map(e => ({
      employeeId: req.user.id,
      sessionId: session._id,
      applicationName: e.applicationName,
      windowTitle: e.windowTitle,
      idleStatus: e.idleStatus,
      timestamp: e.timestamp || new Date()
    }));

    await Activity.insertMany(docs);

    // 🔥 Batch Update Logic
    const HEARTBEAT_SECONDS = 30;
    let totalBatchSec = events.length * HEARTBEAT_SECONDS;
    let idleBatchSec = events.filter(e => e.idleStatus).length * HEARTBEAT_SECONDS;
    let activeBatchSec = totalBatchSec - idleBatchSec;

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        $inc: {
          totalWorkSeconds: totalBatchSec,
          idleSeconds: idleBatchSec,
          activeSeconds: activeBatchSec
        }
      },
      { new: true }
    );

    if (updatedSession) {
        const total = updatedSession.totalWorkSeconds;
        const active = updatedSession.activeSeconds;
        updatedSession.productivityScore = total > 0 ? Math.round((active / total) * 100) : 0;
        await updatedSession.save();
    }

    return res.json({ success: true, message: "Batch uploaded and session updated" });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
    SCREENSHOT META
========================= */
export const screenshotMeta = async (req, res) => {
  try {
    const { fileName, sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" });
    }
    // Yahan tum chaho toh Screenshot model mein entry kar sakte ho
    console.log("📸 Screenshot Saved:", fileName);

    return res.json({ success: true, message: "Screenshot metadata saved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};