import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  beginnerChapterMetadata,
  beginnerFaqPlainText,
  tarotForBeginners
} from "../data/tarot-for-beginners.mjs";
import { getTarotEducationHeroImages } from "../data/tarot-education-hero-images.js";
import { escapeHtml, SITE_ORIGIN } from "./card-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const pagePath = resolve(rootDir, "tarot/for-beginners/index.html");
const cssPath = resolve(rootDir, "css/tarot-for-beginners.css");
const jsPath = resolve(rootDir, "js/tarot-for-beginners.js");
const generatorPath = resolve(rootDir, "scripts/generate-tarot-for-beginners-page.mjs");
const hubScriptPath = resolve(rootDir, "js/tarot.js");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const robotsPath = resolve(rootDir, "robots.txt");
const errors = [];

function countMatches(pattern, value) {
  return (value.match(pattern) || []).length;
}

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

function parseJsonScript(html, id) {
  const match = html.match(new RegExp(`<script id="${id}" type="application/ld\\+json">([\\s\\S]*?)<\\/script>`));
  if (!match) {
    errors.push(`schema: missing ${id}`);
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    errors.push(`schema: invalid JSON in ${id}`);
    return null;
  }
}

function collectStrings(value, output = []) {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, output));
  return output;
}

if (![pagePath, cssPath, jsPath, generatorPath].every(existsSync)) {
  throw new Error("Tarot for Beginners validation cannot run because one or more implementation files are missing.");
}

const html = readFileSync(pagePath, "utf8");
const css = readFileSync(cssPath, "utf8");
const js = readFileSync(jsPath, "utf8");
const generator = readFileSync(generatorPath, "utf8");
const hubScript = readFileSync(hubScriptPath, "utf8");
const sitemap = readFileSync(sitemapPath, "utf8");
const robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "";
const canonical = `${SITE_ORIGIN}${tarotForBeginners.route}`;

if (!html.includes(`<title>${escapeHtml(tarotForBeginners.seo.title)}</title>`)) {
  errors.push("SEO: exact title is missing");
}
if (!html.includes(`<meta name="description" content="${escapeHtml(tarotForBeginners.seo.description)}" />`)) {
  errors.push("SEO: exact meta description is missing");
}
if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) {
  errors.push("SEO: canonical route is missing or incorrect");
}
if (countMatches(/<h1\b/g, html) !== 1 || !/<h1[^>]*>Tarot for Beginners<\/h1>/.test(html)) {
  errors.push("SEO: expected exactly one Tarot for Beginners H1");
}

const breadcrumb = parseJsonScript(html, "tarot-beginners-breadcrumb-schema");
const webPage = parseJsonScript(html, "tarot-beginners-webpage-schema");
const faqSchema = parseJsonScript(html, "tarot-beginners-faq-schema");
if (breadcrumb?.["@type"] !== "BreadcrumbList"
  || breadcrumb.itemListElement?.at(-1)?.item !== canonical) {
  errors.push("schema: BreadcrumbList must end at the canonical Beginners route");
}
if (webPage?.["@type"] !== "WebPage" || webPage.url !== canonical) {
  errors.push("schema: WebPage is missing or uses a different URL");
}
if (faqSchema?.["@type"] !== "FAQPage" || faqSchema.mainEntity?.length !== 12) {
  errors.push("schema: FAQPage must contain exactly twelve questions");
}

if (!html.includes('data-beginner-root data-beginner-view="welcome"')
  || !html.includes('data-beginner-panel="welcome"')
  || !html.includes('data-beginner-panel="library"')
  || !html.includes('data-beginner-panel="reader"')) {
  errors.push("views: four-view progressive enhancement root is incomplete");
}

const expectedRuntimeViews = ["welcome", "library", "chapter", "all"];
const runtimeViewsMatch = js.match(/const normalizedView = (\[[^\]]+\])\.includes\(view\)/);
let runtimeViews = [];
try {
  runtimeViews = runtimeViewsMatch ? JSON.parse(runtimeViewsMatch[1]) : [];
} catch (error) {
  runtimeViews = [];
}
if (JSON.stringify(runtimeViews) !== JSON.stringify(expectedRuntimeViews)) {
  errors.push(`views: runtime view registry must be ${expectedRuntimeViews.join(", ")}`);
}
[
  '[data-beginner-view="welcome"] .tarot-beginners-experience.is-enhanced [data-beginner-panel="welcome"]',
  '[data-beginner-view="library"] .tarot-beginners-experience.is-enhanced [data-beginner-panel="library"]',
  '[data-beginner-view="chapter"] .tarot-beginners-experience.is-enhanced [data-beginner-panel="reader"]',
  '[data-beginner-view="all"] .tarot-beginners-experience.is-enhanced [data-beginner-panel="reader"]'
].forEach((selector) => {
  if (!css.includes(selector)) errors.push(`views: enhanced display rule is missing (${selector})`);
});
if (!html.includes('data-education-page="tarot-for-beginners"')
  || !html.includes('href="/tarot/for-beginners/" aria-current="page" data-tarot-education-active')) {
  errors.push("shared systems: education hero or active secondary navigation is missing");
}

const regularWelcomeStrings = collectStrings(tarotForBeginners.welcome.regular);
const bloodWelcomeStrings = collectStrings(tarotForBeginners.welcome.bloodMoon);
[...regularWelcomeStrings, ...bloodWelcomeStrings].forEach((text) => {
  if (!html.includes(escapeHtml(text))) errors.push(`welcome: initial HTML is missing copy (${text})`);
});
if (!html.includes('data-beginner-welcome-copy="regular" aria-hidden="false"')
  || !html.includes('data-beginner-welcome-copy="blood" aria-hidden="true" inert')) {
  errors.push("welcome: regular and Blood Moon layers lack safe initial accessibility states");
}

if (tarotForBeginners.chapters.length !== 10 || beginnerChapterMetadata.length !== 10) {
  errors.push("data: expected exactly ten chapters");
}
if (new Set(beginnerChapterMetadata.map((chapter) => chapter.id)).size !== 10) {
  errors.push("data: chapter IDs must be unique");
}
if (countMatches(/data-beginner-chapter="/g, html) !== 10
  || countMatches(/data-library-chapter="/g, html) !== 10
  || countMatches(/data-chapter-nav-location="rail"/g, html) !== 10
  || countMatches(/data-chapter-nav-location="menu"/g, html) !== 10) {
  errors.push("chapters: library, semantic article, rail, or mobile menu counts are incorrect");
}

let previousChapterIndex = -1;
tarotForBeginners.chapters.forEach((chapter, chapterIndex) => {
  const articleStart = html.indexOf(`<article class="tarot-beginners-chapter" id="${chapter.id}"`);
  if (articleStart < 0 || articleStart <= previousChapterIndex) {
    errors.push(`chapters: ${chapter.id} is missing or out of order`);
  }
  previousChapterIndex = articleStart;

  const nextChapter = tarotForBeginners.chapters[chapterIndex + 1];
  const articleEnd = nextChapter
    ? html.indexOf(`<article class="tarot-beginners-chapter" id="${nextChapter.id}"`, articleStart)
    : html.indexOf('<nav class="tarot-beginners-reader-controls"', articleStart);
  const articleHtml = articleStart >= 0 && articleEnd > articleStart
    ? html.slice(articleStart, articleEnd)
    : "";
  if (!html.includes(`<h2 id="${chapter.id}-heading" tabindex="-1">${escapeHtml(chapter.title)}</h2>`)) {
    errors.push(`chapters: semantic H2/focus target is missing for ${chapter.id}`);
  }
  if (!html.includes(`href="#${chapter.id}" data-beginner-chapter-link="${chapter.id}"`)) {
    errors.push(`chapters: hash navigation is missing for ${chapter.id}`);
  }
  const structuralValues = new Set(["features", "paragraphs", "list", "note", "links", "pairs", "timeline", "glossary", "pathways"]);
  const expectedChapterCopy = [
    chapter.eyebrow,
    chapter.title,
    chapter.introduction,
    chapter.visual.caption,
    chapter.visual.center,
    ...chapter.visual.items,
    ...collectStrings(chapter.blocks),
    chapter.takeaway
  ].filter((text) => text && !structuralValues.has(text) && !/^(?:\/|#)/.test(text));
  expectedChapterCopy.forEach((text) => {
    if (!articleHtml.includes(escapeHtml(text))) {
      errors.push(`chapters: visible initial copy is missing from ${chapter.id} (${text})`);
    }
  });

  const libraryCardStart = html.indexOf(
    `<a class="tarot-beginners-library-card" href="#${chapter.id}" data-beginner-chapter-link="${chapter.id}" data-library-chapter="${chapter.id}"`
  );
  const libraryCardEnd = libraryCardStart >= 0 ? html.indexOf("</a>", libraryCardStart) : -1;
  const libraryCardHtml = libraryCardStart >= 0 && libraryCardEnd > libraryCardStart
    ? html.slice(libraryCardStart, libraryCardEnd)
    : "";
  if (!libraryCardHtml.includes(escapeHtml(chapter.navLabel))
    || !libraryCardHtml.includes(escapeHtml(chapter.cardSummary))) {
    errors.push(`library: card copy is incomplete for ${chapter.id}`);
  }
});

const articleOpeningTags = [...html.matchAll(/<article class="tarot-beginners-chapter"[^>]*>/g)].map((match) => match[0]);
if (articleOpeningTags.some((tag) => /\b(?:hidden|inert)\b/.test(tag))) {
  errors.push("no-JS: chapter articles must not begin hidden or inert");
}
if (!css.includes(".tarot-beginners-experience.is-enhanced [data-beginner-panel]")
  || !js.includes('document.documentElement.classList.add("js-enabled")')
  || !js.includes('experience.classList.add("is-enhanced")')
  || !js.includes("function showFallback()")) {
  errors.push("no-JS: safe enhancement gate or readable fallback is incomplete");
}

const libraryCardMatches = [...html.matchAll(/<a class="tarot-beginners-library-card"[\s\S]*?<\/a>/g)];
if (libraryCardMatches.length !== 10 || libraryCardMatches.some((match) => /<button\b/.test(match[0]))) {
  errors.push("library: expected ten whole-card anchors without nested buttons");
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) errors.push(`accessibility: duplicate IDs found (${duplicateIds.join(", ")})`);

tarotForBeginners.faq.items.forEach((item, index) => {
  const number = index + 1;
  const schemaItem = faqSchema?.mainEntity?.[index];
  const answerMatch = html.match(new RegExp(`id="tarot-beginners-faq-answer-${number}"[\\s\\S]*?<div class="tarot-faq__answer-inner"><p>([\\s\\S]*?)<\\/p>`));
  const visibleAnswer = answerMatch ? decodeHtml(answerMatch[1]) : "";
  const expectedAnswer = beginnerFaqPlainText(item);
  if (!html.includes(`<span>${escapeHtml(item.question)}</span>`)) errors.push(`FAQ: visible question is missing (${item.question})`);
  if (visibleAnswer !== expectedAnswer) errors.push(`FAQ: visible answer does not match data (${item.question})`);
  if (schemaItem?.name !== item.question || schemaItem?.acceptedAnswer?.text !== expectedAnswer) {
    errors.push(`FAQ: schema does not match visible data (${item.question})`);
  }
});

const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
const imageSources = [...new Set(imageTags.map((tag) => tag.match(/\bsrc="([^"]+)"/)?.[1]).filter(Boolean))];
imageSources.filter((src) => src.startsWith("/")).forEach((src) => {
  const path = resolve(rootDir, decodeURIComponent(src).replace(/^\/+/, ""));
  if (!existsSync(path)) errors.push(`assets: broken image path ${src}`);
});
if (imageTags.some((tag) => !/\balt="[^"]*"/.test(tag))) {
  errors.push("accessibility: every image must include alt text");
}

const heroImages = getTarotEducationHeroImages("tarot-for-beginners");
const expectedContentImageDimensions = new Map([
  [heroImages.regular.src, [heroImages.regular.width, heroImages.regular.height]],
  [tarotForBeginners.welcome.image.src, [tarotForBeginners.welcome.image.width, tarotForBeginners.welcome.image.height]],
  ...tarotForBeginners.chapters.map((chapter) => [chapter.image.src, [chapter.image.width, chapter.image.height]])
]);
const beginnerContentImageTags = imageTags.filter((tag) => (
  /\bdata-education-hero-image\b/.test(tag)
  || /class="[^"]*tarot-beginners-(?:welcome__image|library-card__image|module__image)[^"]*"/.test(tag)
));
beginnerContentImageTags.forEach((tag) => {
  const src = tag.match(/\bsrc="([^"]+)"/)?.[1] || "";
  const alt = tag.match(/\balt="([^"]*)"/)?.[1] || "";
  const width = Number(tag.match(/\bwidth="(\d+)"/)?.[1]);
  const height = Number(tag.match(/\bheight="(\d+)"/)?.[1]);
  const expectedDimensions = expectedContentImageDimensions.get(src);
  if (!alt.trim()) errors.push(`accessibility: content image needs non-empty alt text (${src || "missing source"})`);
  if (!expectedDimensions || width !== expectedDimensions[0] || height !== expectedDimensions[1]) {
    errors.push(`assets: declared dimensions do not match the central image record (${src || "missing source"})`);
  }
});

[
  ["/tarot", "tarot.html"],
  ["/decks", "deck.html"],
  ["/free-tarot-reading", "free-tarot-reading.html"],
  ["/how-to-read-tarot-cards/", "how-to-read-tarot-cards/index.html"],
  ["/tarot-spreads/", "tarot-spreads/index.html"],
  ["/tarot/history/", "tarot/history/index.html"],
  ["/tarot/major-arcana/", "tarot/major-arcana/index.html"],
  ["/tarot/minor-arcana/", "tarot/minor-arcana/index.html"]
].forEach(([route, target]) => {
  if (!existsSync(resolve(rootDir, target))) errors.push(`routes: ${route} target is missing`);
  if (!html.includes(`href="${route}"`)) errors.push(`routes: rendered page is missing a link to ${route}`);
});

if (!html.includes('<div class="tarot-beginners-door" aria-hidden="true" data-beginner-door><span></span><i>✦</i></div>')
  || !js.includes('const doorSeal = door.querySelector("i")')
  || !js.includes("const sealAnimation = animateElement(doorSeal")
  || !css.includes(".tarot-beginners-door i {")) {
  errors.push("transition: Door of Light chapter-seal markup, animation, or styling is missing");
}

[
  'const STORAGE_KEY = "astralVeilTarotBeginnerProgress"',
  "currentChapter:",
  "visitedChapters:",
  "viewMode:",
  "function sanitizeProgress(",
  "function routeFromLocation(",
  "function scheduleLocationSync(",
  "window.addEventListener(\"popstate\"",
  "window.addEventListener(\"hashchange\"",
  "function transitionToChapter(",
  "if (!canAnimate)",
  "if (state.transitioning)",
  "focusChapterHeading(",
  "function syncWelcomeTheme(",
  "astralVeilBloodMoonChange",
  "showModal",
  "closeChapterMenu(",
  'aria-current", "step"',
  'copy.inert = !active'
].forEach((token) => {
  if (!js.includes(token)) errors.push(`interaction: required behavior is missing (${token})`);
});
if (/\b(?:gsap|setTimeout)\b/i.test(js)) {
  errors.push("interaction: page script must not use GSAP or scattered timer transitions");
}

const doorDuration = Number(js.match(/const DOOR_LIGHT_DURATION = (\d+);/)?.[1]);
if (!Number.isFinite(doorDuration) || doorDuration < 500 || doorDuration > 650) {
  errors.push("transition: Door of Light duration must remain between 500ms and 650ms");
}
if (!js.includes("transform: \"translateX(-12px)\"")
  || !js.includes("transform: \"translateX(12px)\"")
  || !js.includes("REDUCED_CROSSFADE_DURATION")) {
  errors.push("transition: requested transform, opacity, or reduced-motion treatment is incomplete");
}

[
  ".tarot-beginners-welcome__layout",
  ".tarot-beginners-library__grid",
  ".tarot-beginners-reader__layout",
  ".tarot-beginners-rail__inner",
  "position: sticky",
  ".tarot-beginners-mobile-header",
  ".tarot-beginners-chapter-menu",
  ".tarot-beginners-door",
  ".tarot-beginners-module",
  ".tarot-beginners-glossary details",
  ".tarot-beginners-pathway--dominant",
  "@media (max-width: 1100px) and (min-width: 821px)",
  "@media (max-width: 820px)",
  "@media (max-width: 430px)",
  "@media (max-width: 360px)",
  "@media (prefers-reduced-motion: reduce)",
  ".tarot-beginners-page.blood-moon-mode",
  ".tarot-beginners-page.blue-moon-mode"
].forEach((token) => {
  if (!css.includes(token)) errors.push(`styles: required responsive or themed treatment is missing (${token})`);
});

if (!generator.includes("beginnerChapterMetadata")
  || !generator.includes("page.chapters.map(renderChapter)")
  || !generator.includes("page.chapters.map(renderLibraryCard)")) {
  errors.push("architecture: generated views are not reusing the central chapter source");
}
if (countMatches(/id="tarot-beginners-chapter-data"/g, html) !== 1) {
  errors.push("architecture: expected one minimal client chapter registry");
}

const sitemapCount = sitemap.split(canonical).length - 1;
if (sitemapCount !== 1) errors.push(`sitemap: expected one canonical Beginners route, found ${sitemapCount}`);
if (/Disallow:\s*\/tarot\/for-beginners\/?/i.test(robots)) {
  errors.push("robots: Beginners route must not be disallowed");
}

const beginnersHubRecord = hubScript.match(/\{ key: "beginners"[^]*?\},/);
if (!beginnersHubRecord
  || !beginnersHubRecord[0].includes('route: "/tarot/for-beginners/"')
  || !beginnersHubRecord[0].includes("available: true")
  || !beginnersHubRecord[0].includes('ctaLabel: "Begin with Tarot Basics"')) {
  errors.push("Tarot hub: Beginners guide is not exposed as a live canonical card");
}

if (errors.length) {
  console.error(`Tarot for Beginners validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Validated Tarot for Beginners: semantic chapters, four views, progress, transitions, SEO, FAQ, assets, themes, and responsive hooks.");
