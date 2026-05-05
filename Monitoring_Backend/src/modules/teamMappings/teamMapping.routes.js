import { Router } from "express";
import {authMiddleware} from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";
import { assign, getByTeamLead, remove } from "./teamMapping.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(allowRoles("ADMIN", "MANAGER"));

router.post("/", assign);
router.get("/team-lead/:teamLeadId", getByTeamLead);
router.delete("/:id", remove);

export default router;