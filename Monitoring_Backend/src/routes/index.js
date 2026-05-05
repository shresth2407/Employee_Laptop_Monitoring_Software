import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import departmentRoutes from "../modules/departments/department.routes.js";
import settingsRoutes from "../modules/settings/settings.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import teamMappingRoutes from "../modules/teamMappings/teamMapping.routes.js";
import sessionRoutes from "../modules/session/session.routes.js";
import employeeRoutes from "../modules/employee/employee.routes.js";
import activityRoutes from "../modules/activity/activity.routes.js";
import agentRoutes from "../modules/agent/agent.routes.js";
import screenshotRoutes from "../modules/screenshots/screenshot.routes.js";
import reportRoutes from "../modules/reports/report.route.js";
import managerRoutes from "../modules/manager/manager.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/departments", departmentRoutes);
router.use("/settings", settingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/team-mappings", teamMappingRoutes);
router.use("/employee", employeeRoutes);
router.use("/session", sessionRoutes);
router.use("/activity", activityRoutes);
router.use("/agent", agentRoutes);
router.use("/agent/screenshots", screenshotRoutes);
router.use("/screenshots", screenshotRoutes);
router.use("/reports", reportRoutes);


router.use("/manager", managerRoutes);

router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Employee Monitoring API running"
  });
});

export default router;