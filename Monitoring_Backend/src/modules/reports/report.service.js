import Session from "../session/session.model.js";
import { fetchManagerTeam } from "../manager/manager.service.js";
import { getLiveStatusService } from "../activity/activity.service.js";
import { getScreenshotsService } from "../screenshots/screenshot.service.js";

const secToHours = (seconds = 0) => `${(seconds / 3600).toFixed(2)}h`;

const formatDate = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
};

export const getReportsService = async () => {
  const sessions = await Session.find()
    .populate({
      path: "employeeId",
      select: "name employeeId email profilePhoto department",
      populate: {
        path: "department",
        select: "name code"
      }
    })
    .sort({ startTime: -1 })
    .limit(100);

  return sessions.map((session) => ({
    _id: session._id,
    employeeName: session.employeeId?.name || "—",
    employeeCode: session.employeeId?.employeeId || "—",

    // 👇 ADD THIS (important for frontend)
    employee: session.employeeId,

    date: formatDate(session.sessionDate || session.startTime),
    totalWorkHours: secToHours(session.totalWorkSeconds || 0),
    activeHours: secToHours(session.activeSeconds || 0),
    idleHours: secToHours(session.idleSeconds || 0),
    productivityScore: `${Number(session.productivityScore || 0).toFixed(0)}%`,
    status: session.status || "—",
  }));
};



export const getManagerReportsService = async (managerId) => {
  // =========================
  // ✅ 1. GET TEAM
  // =========================
  const team = await fetchManagerTeam(managerId);

  if (!team.length) {
    console.log("❌ No team members found");
    return [];
  }

  const employeeIds = team.map(emp => emp._id.toString());

  // =========================
  // ✅ 2. FETCH DATA (REUSABLE SERVICES)
  // =========================
  const [sessions, screenshots, activities] = await Promise.all([

    // 🔥 SESSIONS (DIRECT - OK)
    Session.find({
      employeeId: { $in: employeeIds }
    })
      .populate({
        path: "employeeId",
        select: "name employeeId email profilePhoto department",
        populate: {
          path: "department",
          select: "name code",
        },
      })
      .sort({ startTime: -1 }),

    // 🔥 SCREENSHOTS (SERVICE)
    getScreenshotsService({
      // ⚠️ service supports single employeeId, so we filter later
    }),

    // 🔥 ACTIVITIES (SERVICE)
    getLiveStatusService({
      limit: 500
    })

  ]);

  // =========================
  // ✅ 3. INIT MAP
  // =========================
  const reportMap = {};

  team.forEach(emp => {
    reportMap[emp._id] = {
      employee: emp,
      sessions: [],
      screenshots: [],
      activities: [],
    };
  });

  // =========================
  // 🔥 MAP SESSIONS
  // =========================
  sessions.forEach(session => {
    const empId = session.employeeId?._id?.toString();

    if (!reportMap[empId]) return;

    reportMap[empId].sessions.push({
      _id: session._id,
      date: session.startTime,
      totalWorkHours: (session.totalWorkSeconds / 3600).toFixed(2),
      activeHours: (session.activeSeconds / 3600).toFixed(2),
      idleHours: (session.idleSeconds / 3600).toFixed(2),
      productivityScore: `${Math.round(session.productivityScore || 0)}%`,
      status: session.status,
    });
  });

  // =========================
  // 🔥 MAP SCREENSHOTS (FILTER TEAM)
  // =========================
  screenshots.forEach(shot => {
    const empId = shot.employeeId?._id?.toString();

    if (!employeeIds.includes(empId)) return;
    if (!reportMap[empId]) return;

    reportMap[empId].screenshots.push({
      _id: shot._id,
      filePath: shot.filePath,
      capturedAt: shot.capturedAt,
      applicationName: shot.applicationName,
      windowTitle: shot.windowTitle,
    });
  });

  // =========================
  // 🔥 MAP ACTIVITIES (FILTER TEAM)
  // =========================
  activities.forEach(act => {
    const empId = act.employeeId?.toString();

    if (!employeeIds.includes(empId)) return;
    if (!reportMap[empId]) return;

    reportMap[empId].activities.push(act);
  });

  // =========================
  // ✅ FINAL RESPONSE
  // =========================
  return Object.values(reportMap);
};