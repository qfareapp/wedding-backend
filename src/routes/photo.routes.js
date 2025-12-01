import express from "express";
import multer from "multer";
import { uploadPhoto, getEventPhotos } from "../controllers/photo.controller.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 25 * 1024 * 1024 }, // allow larger uploads so we can compress to <10MB
});

const router = express.Router();

router.post("/upload", upload.single("image"), uploadPhoto);
router.get("/:eventId", getEventPhotos);

// Multer size error handler scoped to this router
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(413)
      .json({
        error: "Max upload size is 25MB; images are compressed to under 10MB automatically.",
        message: "Max upload size is 25MB; images are compressed to under 10MB automatically.",
      });
  }
  return next(err);
});

export default router;
