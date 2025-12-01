import fs from "fs";
import sharp from "sharp";

const TARGET_BYTES = 10 * 1024 * 1024;

export const compressToLimit = async (inputPath, targetBytes = TARGET_BYTES) => {
  const qualities = [82, 72, 64, 56, 48];
  const outputPath = `${inputPath}-compressed.jpg`;

  for (const quality of qualities) {
    await sharp(inputPath)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(outputPath);

    const { size } = fs.statSync(outputPath);
    if (size <= targetBytes) return outputPath;
  }

  return outputPath;
};

export const cleanupFiles = (...paths) => {
  paths
    .filter(Boolean)
    .forEach((p) => {
      fs.unlink(p, () => {});
    });
};
