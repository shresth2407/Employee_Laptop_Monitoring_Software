import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";

import {
  get,
  update,
  getAgentSettings,
} from "./settings.controller.js";

const router = Router();

/**
 * All routes require authentication
 */
router.use(authMiddleware);

/**
 * Admin / HR → Get system settings
 */
router.get("/", allowRoles("ADMIN"), get);

/**
 * Admin → Update settings
 */
router.patch("/", allowRoles("ADMIN"), update);

/**
 * Agent/Desktop → Get lightweight settings
 */
router.get("/agent", getAgentSettings);

export default router;