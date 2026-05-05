import { getSettings as getSettingsService } from "../settings/settings.service.js";
import Session from "../session/session.model.js";

export const getSessionStatusService = async (employeeId) => {
  const activeSession = await Session.findOne({
    employeeId: employeeId,
    status: "ACTIVE",
  });

  const settings = await getSettingsService();

  return {
    hasActiveSession: !!activeSession,
    sessionId: activeSession?._id || null,
    settings: {
      screenshotIntervalMinutes: settings.screenshotIntervalMinutes,
      idleThresholdMinutes: settings.idleThresholdMinutes,
      heartbeatIntervalSeconds: settings.heartbeatIntervalSeconds,
    },
  };
};