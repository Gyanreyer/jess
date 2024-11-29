/**
 * This script generates a spritesheet from a directory of images.
 * The images should be named in numerical order, e.g. 0.webp, 1.webp, 2.webp, etc
 * and all be the same dimensions.
 *
 * Arguments:
 * - The path to the directory containing the images
 * - `-w` or `--width` to specify the width of each sprite (will use the width of the first image if not provided, or if height was provided, will be calculated to maintain the original aspect ratio)
 * - `-h` or `--height` to specify the height of each sprite (will use the height of the first image if not provided, or if width was provided, will be calculated to maintain the original aspect ratio)
 *
 * @example
 * node scripts/make-spritesheet.mjs path/to/directory -w 256
 *
 * Outputs spritesheet.webp and spritesheet.json file in the directory.
 */
import { readdir, access, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

// Maximum width/height that a webm file can have
const MAX_SPRITESHEET_SIZE = 16383;

const rawDirName = process.argv[2];

if (typeof rawDirName !== "string") {
  throw new Error("Please provide a directory name as an argument.");
}

const spriteDirName = resolve(rawDirName);

console.log("Generating spritesheet for", spriteDirName);

const outputPath = resolve(spriteDirName, "spritesheet.webp");

try {
  await access(outputPath);
  console.log(`Found existing spritesheet at ${outputPath}. Deleting.`);
  await rm(outputPath);
} catch (e) {}

const filePaths = (await readdir(spriteDirName))
  // Filter out non-image files/sub-directories
  .filter((fileName) => fileName.endsWith(".webp") || fileName.endsWith(".png"))
  // Resolve the file names into full paths
  .map((fileName) => resolve(spriteDirName, fileName))
  // Sort by the number in the file name
  .sort((a, b) => parseInt(a) - parseInt(b));

const spriteCount = filePaths.length;

console.log(`Found ${spriteCount} sprites.`);

/**
 * @type {number | undefined}
 */
let spriteWidth;
/**
 * @type {number | undefined}
 */
let spriteHeight;

let widthArgIndex = process.argv.indexOf("--width");
if (widthArgIndex === -1) {
  widthArgIndex = process.argv.indexOf("-w");
}
if (widthArgIndex > -1) {
  spriteWidth = parseInt(process.argv[widthArgIndex + 1], 10);
}

let heightArgIndex = process.argv.indexOf("--height");
if (heightArgIndex === -1) {
  heightArgIndex = process.argv.indexOf("-h");
}
if (heightArgIndex > -1) {
  spriteHeight = parseInt(process.argv[heightArgIndex + 1], 10);
}

if (!spriteWidth || !spriteHeight) {
  const firstImageData = await sharp(filePaths[0]).metadata();
  if (!firstImageData.width || !firstImageData.height) {
    throw new Error("Could not load sprite width or height from first image");
  }

  if (spriteWidth) {
    // Calculate the height to maintain the original aspect ratio based on the target width
    spriteHeight = Math.floor(
      firstImageData.height * (spriteWidth / firstImageData.width)
    );
  } else if (spriteHeight) {
    // Calculate the width to maintain the original aspect ratio based on the target height
    spriteWidth = Math.floor(
      firstImageData.width * (spriteHeight / firstImageData.height)
    );
  } else {
    // Use the width and height of the first image if no target width or height was provided
    spriteWidth = firstImageData.width;
    spriteHeight = firstImageData.height;
  }
}

console.log("Sprite width:", spriteWidth);
console.log("Sprite height:", spriteHeight);

const columnCount = Math.floor(MAX_SPRITESHEET_SIZE / spriteWidth);
const rowCount = Math.ceil(spriteCount / columnCount);

console.log("Columns:", columnCount);
console.log("Rows:", rowCount);

const totalSpritesheetWidth = spriteWidth * columnCount;
const totalSpritesheetHeight = spriteHeight * rowCount;

await sharp({
  create: {
    width: totalSpritesheetWidth,
    height: totalSpritesheetHeight,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite(
    await Promise.all(
      filePaths.map(async (filePath, i) => {
        const column = i % columnCount;
        const row = Math.floor(i / columnCount);
        return {
          input: await sharp(filePath)
            .resize({
              width: spriteWidth,
              height: spriteHeight,
            })
            .toBuffer(),
          left: spriteWidth * column,
          top: spriteHeight * row,
        };
      })
    )
  )
  .toFormat("webp")
  .toFile(outputPath);

console.log(`Spritesheet generated at ${outputPath}`);

const metadataPath = resolve(spriteDirName, "spritesheet.json");

await writeFile(
  metadataPath,
  JSON.stringify({
    columnCount,
    rowCount,
    spriteCount,
    spriteWidth,
    spriteHeight,
  })
);

console.log(`Spritesheet metadata saved at ${metadataPath}`);
