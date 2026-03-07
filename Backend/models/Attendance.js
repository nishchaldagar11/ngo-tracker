import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
{
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  status: {
    type: String,
    enum: ["present", "absent"],
    default: "present",
    required: true,
  },
},
{
  timestamps: true,
}
);

// prevent duplicate attendance
attendanceSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);