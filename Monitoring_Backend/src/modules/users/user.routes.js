import { Router } from "express";
import {authMiddleware} from "../../middleware/auth.middleware.js";
import allowRoles from "../../middleware/role.middleware.js";
import {
  activate,
  create,
  deactivate,
  getById,
  list,
  remove,
  update,
} from "./user.controller.js";
import { upload } from "../../middleware/upload.middleware.js";
const router = Router();

router.use(authMiddleware);

router.post("/",allowRoles("ADMIN"),upload.single("profilePhoto"), create);
router.get("/",allowRoles("ADMIN"), list);
router.get("/:id",allowRoles("ADMIN","MANAGER"), getById);
router.put("/:id",allowRoles("ADMIN"), upload.single("profilePhoto"), update);
router.patch("/:id/activate",allowRoles("ADMIN"), activate);
router.patch("/:id/deactivate",allowRoles("ADMIN"), deactivate);
router.delete("/:id",allowRoles("ADMIN"), remove);

export default router;