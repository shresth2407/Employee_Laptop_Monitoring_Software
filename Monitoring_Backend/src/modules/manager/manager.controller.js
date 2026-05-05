import asyncHandler from "../../utils/asyncHandler.js";
import {
  fetchManagerTeam,
  fetchEmployeeDetails,
  fetchManagerDashboard,
  fetchManagerTeamMappings 
} from "./manager.service.js";

export const getManagerTeam = asyncHandler(async (req, res) => {
  const team = await fetchManagerTeam(req.user.id);

  res.json(team);
});

export const getEmployeeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await fetchEmployeeDetails(req.user.id, id);

  res.json(employee);
});

export const getManagerDashboard = asyncHandler(async (req, res) => {
  const data = await fetchManagerDashboard(req.user.id);

  res.json(data);
});

export const getManagerTeamMappings = asyncHandler(async (req, res) => {
  const data = await fetchManagerTeamMappings(req.user._id);
  res.json(data);
});