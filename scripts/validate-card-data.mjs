import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { validateCardData } from "./card-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const checkGenerated = !process.argv.includes("--data-only");
const result = validateCardData(tarotCardDetails, { rootDir, checkGenerated });

result.warnings.forEach((warning) => console.warn(`WARN  ${warning}`));

if (result.errors.length) {
  console.error(`Card data validation failed with ${result.errors.length} error${result.errors.length === 1 ? "" : "s"}:`);
  result.errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Card data validation passed for ${result.cards.length} generated card page${result.cards.length === 1 ? "" : "s"}.`);
}

