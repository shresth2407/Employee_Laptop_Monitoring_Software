import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js"; // 🔥 Aapki file ka sahi naam
import {
  dashboard,
  getProfile,
  updateProfile,
  changePassword,
  getTimer
} from "./employee.controller.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, dashboard);
router.get("/profile", authMiddleware, getProfile);

// 🔥 FIX: single("avatar") yahan lagana zaroori hai tabhi controller ko req.file milega
router.put("/profile", authMiddleware, upload.single("avatar"), updateProfile);

router.put("/change-password", authMiddleware, changePassword);
router.get("/timer", authMiddleware, getTimer);

export default router;