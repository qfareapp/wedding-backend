import Photo from "../models/Photo.js";
import cloudinary from "../config/cloudinary.js";
import { compressToLimit, cleanupFiles } from "../utils/image.js";

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    let workingPath = req.file.path;
    try {
      workingPath = await compressToLimit(req.file.path);
    } catch (compressionError) {
      // eslint-disable-next-line no-console
      console.error("Compression failed, uploading original file", compressionError);
      workingPath = req.file.path;
    }

    const result = await cloudinary.uploader.upload(workingPath, {
      folder: "wedding",
      resource_type: "image",
    });

    const photo = await Photo.create({
      eventId: req.body.eventId,
      guestName: req.body.guestName,
      message: req.body.message,
      imageUrl: result.secure_url,
    });

    return res.json(photo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  } finally {
    if (req?.file?.path) {
      cleanupFiles(req.file.path, workingPath !== req.file.path ? workingPath : null);
    }
  }
};

export const getEventPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ eventId: req.params.eventId })
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
