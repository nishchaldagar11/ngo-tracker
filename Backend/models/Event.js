import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  // New field
  program: {
    type: String,
    enum: ["dashboard", "cip", "achal", "stemora", "paltan"],
    default: "dashboard"
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{
  timestamps: true,
}
);

export default mongoose.model("Event", eventSchema);