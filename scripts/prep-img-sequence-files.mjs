import { readdir } from "node:fs/promises";
import sharp from "sharp";

const path = import.meta
  .resolve("../src/assets/img/work/crate-and-barrel/phone-img-sequence")
  .slice("file://".length);

const fileNames = await readdir(path);

// const prefixLength = "CB_Phone_".length;

fileNames.sort((a, b) => {
  const aNumber = Number(a);
  const bNumber = Number(b);
  return aNumber - bNumber;
});

for (let i = 0; i < fileNames.length; i++) {
  const filePath = `${path}/${fileNames[i]}`;
  sharp(filePath)
    .resize(450)
    .webp({ quality: 80, preset: "picture", effort: 6 })
    .toFile(`${String(i).padStart(3, "0")}.webp`);
}
