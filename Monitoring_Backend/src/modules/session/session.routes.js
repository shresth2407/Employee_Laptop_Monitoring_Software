import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";
import {
  current,
  end,
  list,
  myCurrent,
  myEnd,
  myStart,
  start,
} from "./session.controller.js";

const router = Router();

router.use(authMiddleware);

/* Employee self routes */
router.get("/my/current", allowRoles("EMPLOYEE", "MANAGER"), myCurrent);
router.post("/my/start", allowRoles("EMPLOYEE"), myStart);
router.post("/my/end", allowRoles("EMPLOYEE"), myEnd);

/* Admin-side routes */
router.get("/", allowRoles("ADMIN","MANAGER"), list);
router.get(
  "/current/:employeeId",
  allowRoles("ADMIN","MANAGER"),
  current
);
router.post("/start", allowRoles("ADMIN","EMPLOYEE"), start);
router.post("/end", allowRoles("ADMIN","EMPLOYEE"), end);

export default router;