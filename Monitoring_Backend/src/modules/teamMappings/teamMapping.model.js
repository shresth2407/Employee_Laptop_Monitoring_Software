import mongoose from "mongoose";

const teamMappingSchema = new mongoose.Schema(
  {
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

teamMappingSchema.index({ teamLead: 1, employee: 1 }, { unique: true });

const TeamMapping = mongoose.model("TeamMapping", teamMappingSchema);

export default TeamMapping;