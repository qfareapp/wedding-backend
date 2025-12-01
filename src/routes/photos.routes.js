import express from "express";
import Photo from "../models/photo.model.js"; // if you have MongoDB collection

const router = express.Router();

// Get photos by event ID
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const photos = await Photo.find({ eventId });

    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
