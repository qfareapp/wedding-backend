import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { compressToLimit, cleanupFiles } from "../utils/image.js";

const router = express.Router();

// temporary storage for uploaded files, allow larger uploads for compression
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 25 * 1024 * 1024 }, // accept up to 25MB before compression
});

router.post("/image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No image provided" });
  }

  let workingPath = req.file.path;

  try {
    // compress to stay under 10MB where possible
    try {
      workingPath = await compressToLimit(req.file.path);
    } catch (compressionError) {
      // eslint-disable-next-line no-console
      console.error("Compression failed, uploading original file", compressionError);
      workingPath = req.file.path;
    }

    const uploadResult = await cloudinary.uploader.upload(workingPath, {
      folder: "wedding",
      resource_type: "image",
    });

    return res.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    cleanupFiles(req.file.path, workingPath !== req.file.path ? workingPath : null);
  }
});

// Multer size error handler for this router
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(413)
      .json({
        success: false,
        error: "Max upload size is 25MB; images will be compressed to under 10MB.",
        message: "Max upload size is 25MB; images will be compressed to under 10MB.",
      });
  }
  return next(err);
});

export default router;
