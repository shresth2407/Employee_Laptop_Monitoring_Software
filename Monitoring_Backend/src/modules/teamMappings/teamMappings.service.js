import TeamMapping from "./teamMapping.model.js";
import User from "../users/user.model.js";

export const assignTeamLead = async ({ teamLeadId, employeeId, assignedBy }) => {
  if (teamLeadId === employeeId) {
    const error = new Error("Team lead and employee cannot be the same user");
    error.statusCode = 400;
    throw error;
  }

  const [teamLead, employee] = await Promise.all([
    User.findById(teamLeadId),
    User.findById(employeeId),
  ]);

  if (!teamLead) {
    const error = new Error("Team lead user not found");
    error.statusCode = 404;
    throw error;
  }

  if (!employee) {
    const error = new Error("Employee user not found");
    error.statusCode = 404;
    throw error;
  }

  if (teamLead.role !== "MANAGER") {
    const error = new Error("Selected team lead user does not have MANAGER role");
    error.statusCode = 400;
    throw error;
  }

  if (employee.role !== "EMPLOYEE") {
    const error = new Error("Selected employee user does not have EMPLOYEE role");
    error.statusCode = 400;
    throw error;
  }

  const mapping = await TeamMapping.create({
    teamLead: teamLeadId,
    employee: employeeId,
    assignedBy,
  });

  return await TeamMapping.findById(mapping._id)
    .populate("teamLead", "name email employeeId role")
    .populate("employee", "name email employeeId role")
    .populate("assignedBy", "name email role");
};

export const getEmployeesByTeamLead = async (teamLeadId) => {
  return await TeamMapping.find({ teamLead: teamLeadId })
    .populate("teamLead", "name email employeeId role")
    .populate("employee", "name email employeeId role department")
    .populate({
      path: "employee",
      populate: {
        path: "department",
        select: "name code",
      },
    })
    .sort({ createdAt: -1 });
};

export const removeTeamMapping = async (mappingId) => {
  const mapping = await TeamMapping.findByIdAndDelete(mappingId);

  if (!mapping) {
    const error = new Error("Team mapping not found");
    error.statusCode = 404;
    throw error;
  }

  return mapping;
};