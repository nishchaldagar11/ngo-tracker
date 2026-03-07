import mongoose from "mongoose";

const archivedAttendanceSchema = new mongoose.Schema({

  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["present", "absent"],
    default: "present"
  },

  archivedAt: {
    type: Date,
    default: Date.now
  },

  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("ArchivedAttendance", archivedAttendanceSchema);