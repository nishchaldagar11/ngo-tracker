import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
{
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },

  // 🔥 OPTIONAL USER (agar login wala use kare)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // 🔥 PUBLIC FORM FIELDS
  name: {
    type: String,
  },

  email: {
    type: String,
    lowercase: true,
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

// 🔥 REMOVE OLD UNIQUE (important)
// attendanceSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);