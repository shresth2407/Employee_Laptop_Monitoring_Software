import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { getManagerReportsService, getReportsService } from "./report.service.js";

export const list = asyncHandler(async (req, res) => {
  const reports = await getReportsService(req.query);

  return sendSuccess(res, {
    message: "Reports fetched successfully",
    data: reports,
  });
});

export const getManagerReports = asyncHandler(async (req, res) => {
  const managerId = req.user.id;

  const reports = await getManagerReportsService(managerId);

  return sendSuccess(res, {
    message: "Manager reports fetched successfully",
    data: reports,
  });
});