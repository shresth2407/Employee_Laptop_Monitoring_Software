import express from "express"
import {authMiddleware} from "../../middleware/auth.middleware.js"

import {
 sessionStatus,
 heartbeat,
 batchActivity,
} from "./agent.controller.js"

const router = express.Router()

router.get("/session-status",authMiddleware,sessionStatus)

// router.post("/activity/heartbeat",authMiddleware,heartbeat)

// router.post("/activity/batch",authMiddleware,batchActivity)

export default router