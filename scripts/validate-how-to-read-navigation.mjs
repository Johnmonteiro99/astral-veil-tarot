import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pageSource = fs.readFileSync(
  path.join(projectRoot, "how-to-read-tarot-cards/index.html"),
  "utf8"
);
const appSource = fs.readFileSync(path.join(projectRoot, "js/app.js"), "utf8");
const pageStyles = fs.readFileSync(path.join(projectRoot, "css/how-to-read-tarot.css"), "utf8");
const pageScript = fs.readFileSync(path.join(projectRoot, "js/how-to-read-tarot.js"), "utf8");
const errors = [];

function normalizeNavPath(value) {
  const pathname = new URL(value, "https://astralveil.world").pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

function extractRequired(pattern, label) {
  const match = pageSource.match(pattern);

  if (!match) {
    errors.push(`${label}: container is missing`);
    return "";
  }

  return match[1];
}

function extractDestinations(markup) {
  return [...markup.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)]
    .map((match) => normalizeNavPath(match[1]));
}

function expectOneTarotDestination(markup, label) {
  const count = extractDestinations(markup).filter((destination) => destination === "/tarot").length;

  if (count !== 1) {
    errors.push(`${label}: expected one static /tarot destination, found ${count}`);
  }
}

const desktopPrimaryNav = extractRequired(
  /<ul class="navbar__links"[^>]*>([\s\S]*?)<\/ul>/,
  "desktop primary navigation"
);
const mobilePrimaryNav = extractRequired(
  /<div class="navbar__mobile-menu"[^>]*>([\s\S]*?)<\/div>/,
  "mobile primary navigation"
);
const educationNav = extractRequired(
  /<nav class="tarot-education-nav"[^>]*>([\s\S]*?)<\/nav>/,
  "Tarot education navigation"
);

expectOneTarotDestination(desktopPrimaryNav, "desktop primary navigation");
expectOneTarotDestination(mobilePrimaryNav, "mobile primary navigation");

const expectedStaticOrder = ["/", "/veilwalkers", "/decks", "/tarot", "/journal", "/about"];

[
  [desktopPrimaryNav, "desktop primary navigation"],
  [mobilePrimaryNav, "mobile primary navigation"]
].forEach(([markup, label]) => {
  const destinations = extractDestinations(markup);

  if (JSON.stringify(destinations) !== JSON.stringify(expectedStaticOrder)) {
    errors.push(`${label}: unexpected destination order (${destinations.join(", ")})`);
  }
});

const educationDestinations = extractDestinations(educationNav);
if (educationDestinations.length !== 7 || !educationDestinations.includes("/how-to-read-tarot-cards")) {
  errors.push("Tarot education navigation: expected seven live destinations including How to Read Tarot");
}

if (!/tarot-education-nav__item is-active[^>]*aria-current="page"/.test(educationNav)) {
  errors.push("Tarot education navigation: How to Read Tarot active state is missing");
}

const scriptSources = [...pageSource.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)]
  .map((match) => match[1]);
const duplicateScripts = [...new Set(scriptSources.filter((source, index) => scriptSources.indexOf(source) !== index))];

if (duplicateScripts.length) {
  errors.push(`scripts: duplicate references found (${duplicateScripts.join(", ")})`);
}

if (scriptSources.filter((source) => source === "/js/app.js").length !== 1) {
  errors.push("scripts: expected exactly one shared /js/app.js reference");
}

[
  "function dedupePrimaryNavDestinations(container)",
  "findPrimaryNavDestination(desktopLinks, \"/tarot\")",
  "findPrimaryNavDestination(primaryMobileMenu, \"/tarot\")",
  "navbar.dataset.primaryNavInitialized = \"true\""
].forEach((token) => {
  if (!appSource.includes(token)) {
    errors.push(`shared navigation: missing idempotency guard (${token})`);
  }
});

const closingMarkup = extractRequired(
  /<section class="htr-closing"[\s\S]*?<nav class="htr-practice-path-grid"[^>]*>([\s\S]*?)<\/nav>/,
  "closing practice paths"
);
const practicePaths = [
  ["/free-tarot-reading", "Begin a Tarot Reading", "Enter a live reflective reading.", "beginReading", "regular/begin_reading.png"],
  ["/tarot-spreads/", "Explore Tarot Spreads", "Find a layout for your question.", "exploreSpreads", "regular/explore_spreads.png"],
  ["/tarot/major-arcana/", "Browse Tarot Card Meanings", "Study the symbols card by card.", "browseMeanings", "regular/browse_meanings.png"],
  ["/journal", "Record a Reflection", "Continue in your private journal.", "recordReflection", "regular/record_reflection.png"]
];

if ((closingMarkup.match(/class="htr-practice-path-card /g) || []).length !== practicePaths.length) {
  errors.push("closing practice paths: expected four full-card links");
}
if ((closingMarkup.match(/<img\b[^>]*alt="[^"]+"[^>]*width="1672" height="941" loading="lazy" decoding="async"/g) || []).length !== practicePaths.length) {
  errors.push("closing practice paths: responsive image metadata or concise alt text is incomplete");
}

practicePaths.forEach(([route, title, description, assetKey, regularFile]) => {
  if (!closingMarkup.includes(`href="${route}"`)
    || !closingMarkup.includes(`class="htr-practice-path-card__title">${title}</span>`)
    || !closingMarkup.includes(`class="htr-practice-path-card__description">${description}</span>`)
    || !closingMarkup.includes(`data-htr-asset="${assetKey}"`)
    || !closingMarkup.includes(`/assets/images/how_to_read_tarot/${regularFile}`)) {
    errors.push(`closing practice paths: card is incomplete (${title})`);
  }
});

[
  "The Next Card Is Yours",
  "Practice the Language of the Cards",
  "Choose a path and continue with attention, curiosity, and room for uncertainty.",
  "For entertainment, personal reflection, creative exploration, and self-inquiry. Not a substitute for professional advice."
].forEach((copy) => {
  if (!pageSource.includes(copy)) errors.push(`closing practice paths: preserved copy is missing (${copy})`);
});

[
  ".htr-practice-path-grid {",
  "grid-template-columns: repeat(4, minmax(0, 1fr))",
  ".htr-practice-path-card img {",
  "object-fit: cover",
  "transform: scale(1.025)",
  ".htr-practice-path-card:focus-visible",
  "grid-template-columns: repeat(2, minmax(0, 1fr))",
  "@media (prefers-reduced-motion: reduce)"
].forEach((token) => {
  if (!pageStyles.includes(token)) errors.push(`closing practice paths: required responsive card styling is missing (${token})`);
});

[
  "bloodmoon/begin_reading.png",
  "bloodmoon/explore_tarot_cards.png",
  "bloodmoon/browse_card_meaning.png",
  "bloodmoon/record_reflection.png"
].forEach((asset) => {
  if (!pageScript.includes(asset)) errors.push(`closing practice paths: Blood Moon asset is missing (${asset})`);
});

const travelMarkupChecks = [
  [/data-constellation-travel-layer/g, 1, "one constellation transform layer"],
  [/data-constellation-vignette(?=[\s>])/g, 1, "one reusable vignette"],
  [/data-lesson-travel-light/g, 1, "one reusable travel light"]
];

travelMarkupChecks.forEach(([pattern, expectedCount, label]) => {
  const count = (pageSource.match(pattern) || []).length;
  if (count !== expectedCount) errors.push(`lesson travel: expected ${label}, found ${count}`);
});

[
  "class=\"htr-constellation__vignette\" aria-hidden=\"true\"",
  "class=\"htr-lesson-travel-light\" aria-hidden=\"true\"",
  "class=\"htr-constellation__mobile-path\" aria-hidden=\"true\""
].forEach((token) => {
  if (!pageSource.includes(token)) errors.push(`lesson travel: decorative layer is not hidden (${token})`);
});

[
  "async function travelToLesson(index, sourceElement)",
  "button.addEventListener(\"click\", () => travelToLesson(index, button))",
  "travelToLesson(0, beginPathButton)",
  "travelToLesson(lastVisitedIndex >= 0 ? lastVisitedIndex : 0, continuePathButton)",
  "travelToLesson(selectedLessonIndex, openPreviewButton)",
  "typeof constellationTravelLayer.animate === \"function\"",
  "deferEntryAnimation: true",
  "historyMode: hashWritten ? \"none\" : \"push\"",
  "openLesson(initialLessonIndex, { historyMode: \"none\", focus: false, scroll: false })",
  "cancelAllTravelAnimations();",
  "style.removeProperty(property)",
  "lessonView.removeAttribute(\"tabindex\")",
  "if (reducedMotion.matches)",
  "window.addEventListener(\"popstate\", scheduleCourseLocationSync)",
  "window.addEventListener(\"hashchange\", scheduleCourseLocationSync)"
].forEach((token) => {
  if (!pageScript.includes(token)) errors.push(`lesson travel: required state behavior is missing (${token})`);
});

if (/\b(?:GSAP|gsap|anime\.js)\b/.test(pageScript) || pageScript.includes("setTimeout(")) {
  errors.push("lesson travel: animation libraries and timer-driven sequencing are not allowed");
}

[
  ".htr-constellation__travel-layer {",
  ".htr-constellation.is-traveling .htr-constellation__travel-layer",
  ".lesson-star.is-travel-target",
  ".htr-learning-lesson-view.is-travel-revealing",
  ".how-to-read-page.moon-mode",
  ".how-to-read-page.blood-moon-mode",
  ".how-to-read-page.blue-moon-mode",
  "--htr-travel-accent:",
  ".htr-learning-lesson-view.is-entering .htr-course-lesson.is-active"
].forEach((token) => {
  if (!pageStyles.includes(token)) errors.push(`lesson travel: required responsive/theme styling is missing (${token})`);
});

if (errors.length) {
  console.error(`How to Read Tarot navigation validation failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("How to Read Tarot navigation, lesson travel, and closing CTA validation passed.");
}
