import User from "../users/user.model.js";
import Session from "../session/session.model.js";
import TeamMapping from "../teamMappings/teamMapping.model.js";
import Activity from "../activity/activity.model.js";
import Screenshot from "../screenshots/screenshot.model.js";

/* =========================
   GET TEAM (BY DEPARTMENT)
========================= */
export const fetchManagerTeam = async (managerId) => {

  const manager = await User.findById(managerId);

  if (!manager) throw new Error("Manager not found");

  const team = await User.find({
    role: "EMPLOYEE",
    department: manager.department,
  })
    .populate("department", "name") // 🔥 ADD THIS LINE
    .select("-password");

  return team;
};

/* =========================
   EMPLOYEE DETAILS
========================= */
export const fetchEmployeeDetails = async (managerId, employeeId) => {

  const manager = await User.findById(managerId);

  const employee = await User.findOne({
    _id: employeeId,
    department: manager.department,
    role: "EMPLOYEE",
  }).select("-password");

  if (!employee) throw new Error("Employee not found or unauthorized");

  return employee;
};

/* =========================
   DASHBOARD DATA
========================= */
export const fetchManagerDashboard = async (managerId) => {

  // =========================
  // 🔥 1. GET MANAGER + TEAM
  // =========================
  const manager = await User.findById(managerId);

  const team = await User.find({
    role: "EMPLOYEE",
    department: manager.department,
  });

  const employeeIds = team.map((e) => e._id);

  const total = team.length;

  // =========================
  // 🔥 2. SESSION STATS
  // =========================
  const active = await Session.countDocuments({
    employeeId: { $in: employeeIds },
    status: "ACTIVE",
  });

  const idle = total - active;

  // =========================
  // 🔥 3. ACTIVITY COUNT
  // =========================
  const totalActivities = await Activity.countDocuments({
    employeeId: { $in: employeeIds },
  });

  // =========================
  // 🔥 4. SCREENSHOT COUNT
  // =========================
  const totalScreenshots = await Screenshot.countDocuments({
    employeeId: { $in: employeeIds },
  });

  // =========================
  // 🔥 5. APP USAGE (AGGREGATION)
  // =========================
  const appUsage = await Activity.aggregate([
    {
      $match: {
        employeeId: { $in: employeeIds },
      },
    },
    {
      $group: {
        _id: "$applicationName",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10, // top 10 apps
    },
  ]);

  // Format response
  const formattedAppUsage = appUsage.map((app) => ({
    application: app._id || "Unknown",
    count: app.count,
  }));

  // =========================
  // 🔥 FINAL RESPONSE
  // =========================
  return {
    totalTeam: total,
    active,
    idle,

    // 🔥 NEW METRICS
    totalActivities,
    totalScreenshots,
    appUsage: formattedAppUsage,
  };
};

export const fetchManagerTeamMappings = async (managerId) => {
  const mappings = await TeamMapping.find({ teamLead: managerId })
    .populate("teamLead", "name email employeeId role")
    .populate({
      path: "employee",
      select: "name email employeeId role department",
      populate: {
        path: "department",
        select: "name code",
      },
    })
    .sort({ createdAt: -1 });

  return mappings;
};