import { Router } from "express";
import {authMiddleware} from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";
import { getAdvancedDashboard } from "./dashboard.service.js";

const router = Router();

router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

router.get("/admin", getAdvancedDashboard);

export default router;