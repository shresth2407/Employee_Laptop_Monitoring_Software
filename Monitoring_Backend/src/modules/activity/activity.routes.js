import { Router } from "express";
import {authMiddleware} from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";
import {
  // saveActivity,
  heartbeat,
  batchUpload,
  getLiveStatus,
} from "./activity.controller.js";

const router = Router();

router.use(authMiddleware);

/* Admin / HR / Team Lead read route */
router.get(
  "/live-status",
  allowRoles("ADMIN","MANAGER"),
  getLiveStatus
);

/* Agent / employee write routes */
// router.post("/", allowRoles("EMPLOYEE", "ADMIN"), saveActivity);
router.post("/heartbeat", allowRoles("EMPLOYEE", "ADMIN", "MANAGER"), heartbeat);
router.post("/batch", allowRoles("EMPLOYEE", "ADMIN", "MANAGER"), batchUpload);

export default router;