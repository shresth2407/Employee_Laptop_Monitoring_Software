import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
  assignTeamLead,
  getEmployeesByTeamLead,
  removeTeamMapping} from "./teamMappings.service.js";

export const assign = asyncHandler(async (req, res) => {
  const mapping = await assignTeamLead({
    teamLeadId: req.body.teamLeadId,
    employeeId: req.body.employeeId,
    assignedBy: req.user._id,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Team lead assigned successfully",
    data: mapping,
  });
});

export const getByTeamLead = asyncHandler(async (req, res) => {
  const mappings = await getEmployeesByTeamLead(req.params.teamLeadId);

  return sendSuccess(res, {
    message: "Team mappings fetched successfully",
    data: mappings,
  });
});

export const remove = asyncHandler(async (req, res) => {
  await removeTeamMapping(req.params.id);

  return sendSuccess(res, {
    message: "Team mapping removed successfully",
  });
});