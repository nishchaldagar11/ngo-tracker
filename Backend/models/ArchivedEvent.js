import mongoose from "mongoose";

const archivedEventSchema = new mongoose.Schema({

  title: String,

  description: String,

  date: Date,

  location: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
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

export default mongoose.model("ArchivedEvent", archivedEventSchema);