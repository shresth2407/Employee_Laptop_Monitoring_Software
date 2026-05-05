import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endTime: {
      type: Date,
      default: null,
    },

    totalWorkSeconds: {
      type: Number,
      default: 0,
    },

    activeSeconds: {
      type: Number,
      default: 0,
    },

    idleSeconds: {
      type: Number,
      default: 0,
    },

    productiveSeconds: {
      type: Number,
      default: 0,
    },

    neutralSeconds: {
      type: Number,
      default: 0,
    },

    unproductiveSeconds: {
      type: Number,
      default: 0,
    },

    productivityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ENDED"],
      default: "ACTIVE",
    },

    sessionDate: {
      type: Date,
      default: () => {
        const now = new Date();
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
      },
    },
  },
  { timestamps: true }
);

/* Only one ACTIVE session per employee */
SessionSchema.index(
  { employeeId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "ACTIVE" },
  }
);

const Session =
  mongoose.models.Session ||
  mongoose.model("Session", SessionSchema);

export default Session;