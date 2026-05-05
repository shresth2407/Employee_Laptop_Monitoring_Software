import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";

import {
  getSettings,
  updateSettings,
  getSettingsService,
} from "./settings.service.js";

/**
 * Get system settings (Admin/API)
 */
export const get = asyncHandler(async (req, res) => {
  const settings = await getSettingsService();

  return sendSuccess(res, {
    message: "Settings fetched successfully",
    data: settings,
  });
});

/**
 * Update system settings (Admin/API)
 */
export const update = asyncHandler(async (req, res) => {
  const settings = await updateSettings(req.body, req.user._id);

  return sendSuccess(res, {
    message: "Settings updated successfully",
    data: settings,
  });
});

/**
 * Get agent/system settings (used by desktop agent)
 */
export const getAgentSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsService();

    return sendSuccess(res, {
      message: "Settings fetched",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};