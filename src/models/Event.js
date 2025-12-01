import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  coupleName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  bannerImage: { type: String },
  theme: { type: String },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
