import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  imageUrl: { type: String, required: true },
  guestName: { type: String },
  message: { type: String },
  approved: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Photo", photoSchema);
