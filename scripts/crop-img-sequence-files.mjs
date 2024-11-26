import { readdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const path = import.meta
  .resolve("../src/assets/img/work/crate-and-barrel/phone-img-sequence")
  .slice("file://".length);

const fileNames = await readdir(path);

fileNames.sort((a, b) => {
  const aNumber = parseInt(a);
  const bNumber = parseInt(b);
  return aNumber - bNumber;
});

let trimmedLeft = Infinity;
let trimmedRight = 0;
let trimmedTop = Infinity;
let trimmedBottom = 0;

// Gather the maximum bounds of the non-transparent pixels across all images
for (let i = 0; i < fileNames.length; i++) {
  const filePath = `${path}/${fileNames[i]}`;
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

for (let i = 0; i < fileNames.length; i++) {
  const filePath = `${path}/${fileNames[i]}`;
  sharp(filePath)
    .extract({
      left: trimmedLeft,
      top: trimmedTop,
      width: trimmedRight - trimmedLeft,
      height: trimmedBottom - trimmedTop,
    })
    .webp()
    .toBuffer()
    .then((data) => {
      writeFile(
        `${path}/../phone-img-sequence-new/${String(i).padStart(3, "0")}.webp`,
        data
      );
    });
}
