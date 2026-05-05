import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { getAdminDashboardSummary } from "./dashboard.service.js";

export const adminSummary = asyncHandler(async (req, res) => {
  const summary = await getAdminDashboardSummary();

  return sendSuccess(res, {
    message: "Admin dashboard summary fetched successfully",
    data: summary,
  });
});