import Settings from "./settings.model.js";
import SystemSettings from "./settings.model.js";

/**
 * Get default app settings (used by agent/system)
 */
export const getSettingsService = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      screenshotIntervalMinutes: 5,
      idleThresholdMinutes: 5,
      heartbeatIntervalSeconds: 30,
    });
  }

  return settings;
};

/**
 * Get system settings (admin side)
 */
export const getSettings = async () => {
  let settings = await SystemSettings.findOne();

  if (!settings) {
    settings = await SystemSettings.create({});
  }

  return settings;
};

/**
 * Update system settings
 */
export const updateSettings = async (payload, userId) => {
  let settings = await Settings.findOne();

  // If no settings exist → create new
  if (!settings) {
    settings = await Settings.create({
      ...payload,
      updatedBy: userId,
    });
    return settings;
  }

  // Update existing settings
  Object.assign(settings, payload, { updatedBy: userId });
  await settings.save();

  return settings;
};