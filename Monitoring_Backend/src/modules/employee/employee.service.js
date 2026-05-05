import Session from "../session/session.model.js";
import User from "../users/user.model.js"

import Activity from "../activity/activity.model.js"
import {calculateProductivity} from "../../utils/productivityCalculator.js"

export const getDashboardData = async(employeeId)=>{

 const activities = await Activity.find({employeeId})

 const stats = calculateProductivity(activities)

 return {

  todayWorkHours:(stats.activeTime+stats.idleTime)/3600,
  activeTime:(stats.activeTime/3600).toFixed(2)+"h",
  idleTime:(stats.idleTime/3600).toFixed(2)+"h",
  productivity:stats.productivity

 }
}

export const dashboardService = async (employeeId) => {

  const sessions = await Session.find({ employeeId });

  let totalWork = 0;
  let active = 0;
  let idle = 0;

  sessions.forEach((s) => {

    totalWork += s.totalWorkTime || 0;
    active += s.activeTime || 0;
    idle += s.idleTime || 0;

  });

  const productivity =
    totalWork === 0 ? 0 : Math.round((active / totalWork) * 100);

  return {

    todayWorkHours: (totalWork / 3600).toFixed(2) + "h",
    activeTime: (active / 3600).toFixed(2) + "h",
    idleTime: (idle / 3600).toFixed(2) + "h",
    productivity

  };

};

export const getProfileService = async (employeeId) => {
  const profile = await User.findById(employeeId)
    .select("-password")
    .populate("department", "name code"); // ✅ Direct populate name and code
    
  return profile;
};
