import User from "../users/user.model.js";
import Session from "../session/session.model.js";
import Activity from "../activity/activity.model.js";

export const getAdvancedDashboard = async (req, res) => {
  try {
    // =========================
    // BASIC COUNTS
    // =========================
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      managers
    ] = await Promise.all([
      User.countDocuments({ role: "EMPLOYEE" }),
      User.countDocuments({ role: "EMPLOYEE", isActive: true }),
      User.countDocuments({ role: "EMPLOYEE", isActive: false }),
      User.countDocuments({ role: "MANAGER" }),
    ]);

    // =========================
    // TODAY RANGE
    // =========================
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const sessionsToday = await Session.find({
      startTime: { $gte: todayStart }
    });

    // =========================
    // WORK HOURS CALC
    // =========================
    let totalSeconds = 0;
    let activeSeconds = 0;
    let idleSeconds = 0;

    sessionsToday.forEach(s => {
      totalSeconds += s.totalWorkSeconds || 0;
      activeSeconds += s.activeSeconds || 0;
      idleSeconds += s.idleSeconds || 0;
    });

    const productivity =
      totalSeconds === 0
        ? 0
        : Math.round((activeSeconds / totalSeconds) * 100);

    // =========================
    // TREND (LAST 7 DAYS)
    // =========================
    const trend = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const start = new Date(day.setHours(0, 0, 0, 0));
      const end = new Date(day.setHours(23, 59, 59, 999));

      const sessions = await Session.find({
        startTime: { $gte: start, $lte: end }
      });

      let seconds = 0;
      sessions.forEach(s => {
        seconds += s.totalWorkSeconds || 0;
      });

      trend.push({
        day: start.toLocaleDateString("en-US", { weekday: "short" }),
        hours: Number((seconds / 3600).toFixed(2))
      });
    }

    // =========================
    // REAL-TIME STATUS
    // =========================
    const activeSessions = await Session.countDocuments({
      status: "ACTIVE"
    });

    const idleSessions = await Session.countDocuments({
      status: "ACTIVE",
      idleSeconds: { $gt: 300 }
    });

    const offlineEmployees = totalEmployees - activeSessions;

    // =========================
    // APP USAGE (TOP 5)
    // =========================
    const appUsage = await Activity.aggregate([
      {
        $group: {
          _id: "$applicationName",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // =========================
    // PRODUCTIVITY INSIGHTS
    // =========================
    const avgProductivity =
      sessionsToday.length === 0
        ? 0
        : Math.round(
            sessionsToday.reduce((acc, s) => acc + (s.productivityScore || 0), 0) /
              sessionsToday.length
          );
// =========================
// 🔥 TOP & LOW PERFORMER
// =========================

const employeeStats = await Session.aggregate([
  {
    $match: {
      totalWorkSeconds: { $gt: 0 } // 🔥 VERY IMPORTANT
    }
  },
  {
    $group: {
      _id: "$employeeId",
      totalWork: { $sum: "$totalWorkSeconds" },
      active: { $sum: "$activeSeconds" }
    }
  },
  {
    $addFields: {
      productivity: {
        $cond: [
          { $eq: ["$totalWork", 0] },
          0,
          {
            $multiply: [
              { $divide: ["$active", "$totalWork"] },
              100
            ]
          }
        ]
      }
    }
  },
  {
    $sort: { productivity: -1 }
  }
]);
let topPerformer = null;
let lowPerformer = null;

if (employeeStats.length > 0) {
  const top = employeeStats[0];
  const low = employeeStats[employeeStats.length - 1];

  // 🔥 populate user data
  const [topUser, lowUser] = await Promise.all([
    User.findById(top._id).select("name email"),
    User.findById(low._id).select("name email")
  ]);

  topPerformer = {
    name: topUser?.name,
    productivity: Math.round(top.productivity)
  };

  lowPerformer = {
    name: lowUser?.name,
    productivity: Math.round(low.productivity)
  };
}
    // =========================
    // FINAL RESPONSE
    // =========================
    res.json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        managers,

        activeSessions,
        idleSessions,
        offlineEmployees,

        totalWorkHours: (totalSeconds / 3600).toFixed(2),
        activeHours: (activeSeconds / 3600).toFixed(2),
        idleHours: (idleSeconds / 3600).toFixed(2),

        productivity,
        avgProductivity,

        trend,
        appUsage,
         topPerformer,
    lowPerformer
      }
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};