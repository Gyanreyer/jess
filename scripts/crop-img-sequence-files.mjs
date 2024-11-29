/**
 * This script crops as much transparent space around a sequence of images in a directory
 * as possible without cutting into any frame's non-transparent pixels.
 * All images must be the same dimensions.
 *
 * Arguments:
 * - The path to the directory containing the images
 * - `--dry-run` to preview the dimensions the images will be cropped to without applying the crop
 *
 * @example
 * node scripts/crop-img-sequence-files.mjs path/to/directory
 *
 * This script will skip spritesheet.webp files if it encounters them.
 */
import { readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const rawDirName = process.argv[2];

if (typeof rawDirName !== "string") {
  throw new Error("Please provide a directory name as an argument.");
}

const spriteDirName = resolve(rawDirName);

console.log("Cropping images in", spriteDirName);

const isDryRun = process.argv.includes("--dry-run");

const filePaths = (await readdir(spriteDirName))
  // Filter out non-image files/sub-directories
  .filter((fileName) => {
    if (fileName === "spritesheet.webp") {
      console.log("Skipping spritesheet.webp");
      return false;
    }
    return fileName.endsWith(".webp") || fileName.endsWith(".png");
  })
  // Resolve the file names into full paths
  .map((fileName) => resolve(spriteDirName, fileName))
  // Sort by the number in the file name
  .sort((a, b) => parseInt(a) - parseInt(b));

let trimmedLeft = Infinity;
let trimmedRight = 0;
let trimmedTop = Infinity;
let trimmedBottom = 0;

// Gather the maximum bounds of the non-transparent pixels across all images
for (let i = 0; i < filePaths.length; i++) {
  const filePath = filePaths[i];
  const imageData = await sharp(filePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = imageData.info;

  for (let r = 0; r < height; ++r) {
    for (let c = 0; c < width; ++c) {
      const pixelAlphaIndex = (r * width + c) * 4 + 3;
      let isPixelTransparent = imageData.data[pixelAlphaIndex] === 0;
      if (!isPixelTransparent) {
        // If the pixel is transparent, shift the left and top bounds to exclude that pixel
        trimmedLeft = Math.min(trimmedLeft, c);
        trimmedTop = Math.min(trimmedTop, r);
        // If the pixel isn't transparent, shift the right and bottom bounds to fit that pixel in
        trimmedRight = Math.max(trimmedRight, c);
        trimmedBottom = Math.max(trimmedBottom, r);
      }
    }
  }
}

console.dir({
  trimmedLeft,
  trimmedRight,
  width: trimmedRight - trimmedLeft,
  height: trimmedBottom - trimmedTop,
});

if (isDryRun) {
  console.log("Dry run complete. Exiting.");
  process.exit(0);
}

for (let i = 0; i < filePaths.length; i++) {
  const filePath = filePaths[i];
  sharp(filePath)
    .extract({
      left: trimmedLeft,
      top: trimmedTop,
      width: trimmedRight - trimmedLeft,
      height: trimmedBottom - trimmedTop,
    })
    .webp()
    .toBuffer()
    .then((data) => writeFile(filePath, data));
}
