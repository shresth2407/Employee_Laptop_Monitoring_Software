import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    screenshotIntervalMinutes: {
      type: Number,
      default: 5,
      min: 1,
    },
    idleThresholdMinutes: {
      type: Number,
      default: 5,
      min: 1,
    },
    heartbeatIntervalSeconds: {
      type: Number,
      default: 30,
      min: 5,
    },
    screenshotRetentionDays: {
      type: Number,
      default: 10,
      min: 1,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const SystemSettings = mongoose.model("SystemSettings", settingsSchema);

export default SystemSettings;