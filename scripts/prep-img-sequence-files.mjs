import { readdir } from "node:fs/promises";
import sharp from "sharp";

const path = import.meta
  .resolve("./phone-img-sequence")
  .slice("file://".length);

const fileNames = await readdir(path);

const prefixLength = "CB_Phone_".length;

fileNames.sort((a, b) => {
  const aNumber = Number(a.slice(prefixLength));
  const bNumber = Number(b.slice(prefixLength));
  return aNumber - bNumber;
});

for (let i = 0; i < fileNames.length; i++) {
  const filePath = `${path}/${fileNames[i]}`;
  sharp(filePath)
    .resize(720)
    .toFormat("webp")
    .toFile(`${String(i).padStart(3, "0")}.webp`);
}
