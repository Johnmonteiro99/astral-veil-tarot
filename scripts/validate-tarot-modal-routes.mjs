import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";

const routes = new Set();
const errors = [];

for (const card of tarotCardDetails) {
  const slug = String(card.slug || "").trim();
  const route = `/tarot/${slug}/`;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${card.title}: invalid slug "${slug}"`);
  if (routes.has(route)) errors.push(`${card.title}: duplicate route ${route}`);
  routes.add(route);
  if (!existsSync(resolve(route.replace(/^\//, ""), "index.html"))) errors.push(`${card.title}: generated page is missing at ${route}`);
}

const legacyDeckSlug = /^(?:major|wands|cups|swords|pentacles)-\d{2}-(.+)$/;
for (const card of tarotCardDetails) {
  const previewSlug = String(card.slug || "").replace(legacyDeckSlug, "$1");
  const previewRoute = `/tarot/${previewSlug}/`;
  if (previewRoute !== `/tarot/${card.slug}/`) errors.push(`${card.title}: preview resolver returned ${previewRoute} instead of /tarot/${card.slug}/`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Tarot modal-route validation passed for ${tarotCardDetails.length} cards.`);
}
