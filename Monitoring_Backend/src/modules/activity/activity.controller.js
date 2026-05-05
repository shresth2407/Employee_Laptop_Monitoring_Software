import asyncHandler from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import {
  saveHeartbeatService,
  saveBatchService,
  // saveActivityService,
  getLiveStatusService,
} from "./activity.service.js";

/**
 * Save single activity (real-time tracking)
 */
// export const saveActivity = asyncHandler(async (req, res) => {
//   const employeeId = req.user?._id;

//   if (!employeeId) {
//     throw new Error("Unauthorized");
//   }
   
//   const activity = await saveActivityService(employeeId, req.body);

//   return sendSuccess(res, {
//     message: "Activity saved successfully",
//     data: activity,
//   });
// });

/**
 * Heartbeat API (lightweight ping)
 */
export const heartbeat = asyncHandler(async (req, res) => {

  const employeeId = req.user?.id;

  if (!employeeId) {
    throw new Error("Unauthorized ❌");
  }

  const activity = await saveHeartbeatService(
    employeeId,
    req.body.data || req.body
  );

  return sendSuccess(res, {
    message: "Heartbeat received",
    data: activity,
  });
});

/**
 * Batch upload API (bulk activities/screenshots)
 */
export const batchUpload = asyncHandler(async (req, res) => {
  const employeeId = req.user?._id;

  if (!employeeId) {
    throw new Error("Unauthorized");
  }

  if (!Array.isArray(req.body?.activities)) {
    throw new Error("Activities array is required");
  }

  const count = await saveBatchService(employeeId, req.body.activities);

  return sendSuccess(res, {
    message: `${count} activities uploaded successfully`,
    data: { count },
  });
});

/**
 * Admin monitoring page - latest live activity
 */
export const getLiveStatus = asyncHandler(async (req, res) => {
  const data = await getLiveStatusService(req.query);
  return sendSuccess(res, {
    message: "Live monitoring data fetched successfully",
    data,
  });
});