import { Router } from "express";
import {authMiddleware} from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";
import { getManagerReports, list } from "./report.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/", allowRoles("ADMIN"), list);
router.get(
  "/manager",
  allowRoles("MANAGER"),
  getManagerReports
);
export default router;