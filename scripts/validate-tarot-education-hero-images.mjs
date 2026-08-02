import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotEducationHeroImages } from "../data/tarot-education-hero-images.js";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const expectedKeys = [
  "minor-arcana",
  "major-arcana",
  "tarot-history",
  "tarot-for-beginners",
  "tarot-spreads",
  "tarot-vs-oracle",
  "tarot-vs-lenormand",
  "how-to-read-tarot"
];
const errors = [];

if (JSON.stringify(Object.keys(tarotEducationHeroImages)) !== JSON.stringify(expectedKeys)) {
  errors.push("education hero keys or their required order are incorrect");
}

for (const key of expectedKeys) {
  const images = tarotEducationHeroImages[key];
  if (!images) continue;

  for (const mode of ["regular", "bloodMoon"]) {
    const image = images[mode];
    if (!image?.src || image.src.includes("?") || image.width <= 0 || image.height <= 0) {
      errors.push(`${key}.${mode}: stable source and dimensions are required`);
      continue;
    }

    const localPath = resolve(rootDir, decodeURIComponent(image.src).replace(/^\/+/, ""));
    if (!existsSync(localPath)) errors.push(`${key}.${mode}: file does not exist at ${image.src}`);
  }

  if (!images.position || !images.bloodMoonPosition) {
    errors.push(`${key}: regular and Blood Moon positions are required`);
  }
}

const educationScript = readFileSync(resolve(rootDir, "js/tarot-education.js"), "utf8");
if (!educationScript.includes('import("/data/tarot-education-hero-images.js")')
  || !educationScript.includes('window.addEventListener("astralVeilBloodMoonChange"')) {
  errors.push("education hero runtime is not connected to the shared theme system");
}

if (errors.length) {
  console.error(`Tarot education hero image validation failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${expectedKeys.length} Tarot education hero image pairs.`);
}
