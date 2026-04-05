import mongoose from "mongoose";

const archivedEventSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    date: Date,
    location: String,
    program: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    archivedAt: Date,
    archivedBy: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
    collection: "archivedevents"  // ⭐ FORCE SAME COLLECTION
  }
);

export default mongoose.model("ArchivedEvent", archivedEventSchema);