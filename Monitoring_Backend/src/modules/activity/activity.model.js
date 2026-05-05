import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    employeeId: {

      type: mongoose.Schema.Types.ObjectId,
      ref: "User"

    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      // required: true
    },

    type: {
      type: String,
      enum: ["activity", "heartbeat"],
      default: "activity"
    },

    applicationName: {
      type: String
    },

    windowTitle: {
      type: String
    },

    keyboardActive: {
      type: Boolean,
      default: false
    },

    keystrokes: {
      type: Number,
      default: 0
    },

    mouseActive: {
      type: Boolean,
      default: false
    },

    idleStatus: {
      type: Boolean,
      default: false
    },

    timestamp: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;


