import { Router } from "express";
import {
  getManagerTeam,
  getEmployeeDetails,
  getManagerDashboard,
    getManagerTeamMappings 
} from "./manager.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

// 🔥 Protect + Role check
router.use(authMiddleware);

router.use((req, res, next) => {
  if (req.user.role !== "MANAGER") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
});

// Routes
router.get("/dashboard", getManagerDashboard);
router.get("/team", getManagerTeam);
router.get("/employee/:id", getEmployeeDetails);
router.get("/team-mappings", getManagerTeamMappings);


export default router;