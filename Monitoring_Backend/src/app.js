import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

// 🔥 IMPORT CLEANUP
import { startScreenshotCleanupJob } from "./utils/screenshot.cleanup.js";

const app = express();

/* =====================================================
   CORS CONFIG
===================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("❌ Blocked by CORS:", origin);
    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "cache-control",
  ],
};

/* =====================================================
   GLOBAL MIDDLEWARES
===================================================== */

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =====================================================
   🔥 START CLEANUP JOB (ONLY ONCE)
===================================================== */

if (!global._screenshotCleanupStarted) {
  startScreenshotCleanupJob();
  global._screenshotCleanupStarted = true;
  console.log("🧹 Screenshot cleanup job initialized");
}

/* =====================================================
   HEALTH CHECK
===================================================== */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

/* =====================================================
   ROUTES
===================================================== */
app.use("/api/v1", routes);

/* =====================================================
   ERROR HANDLER
===================================================== */
app.use(errorMiddleware);

export default app;