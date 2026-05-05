import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";
import {
  create,
  list,
  update,
} from "./department.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

router.post("/", create);
router.get("/", list);
router.put("/:id", update);

export default router;