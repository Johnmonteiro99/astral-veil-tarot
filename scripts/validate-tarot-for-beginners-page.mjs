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
const educationCssPath = resolve(rootDir, "css/tarot-education-components.css");
const jsPath = resolve(rootDir, "js/tarot-for-beginners.js");
const routeScrollPath = resolve(rootDir, "js/tarot-education-route-scroll.js");
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectCssMediaBlocks(source, condition) {
  const blocks = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const mediaStart = source.indexOf("@media", searchFrom);
    if (mediaStart < 0) break;
    const blockStart = source.indexOf("{", mediaStart);
    if (blockStart < 0) break;
    const header = source.slice(mediaStart, blockStart);
    let depth = 1;
    let cursor = blockStart + 1;
    while (cursor < source.length && depth > 0) {
      if (source[cursor] === "{") depth += 1;
      else if (source[cursor] === "}") depth -= 1;
      cursor += 1;
    }
    if (header.includes(condition)) blocks.push(source.slice(mediaStart, cursor));
    searchFrom = cursor;
  }

  return blocks;
}

function getCssRuleBody(source, selector) {
  return source.match(new RegExp(`${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`, "s"))?.[1] || "";
}

if (![pagePath, cssPath, educationCssPath, jsPath, routeScrollPath, generatorPath].every(existsSync)) {
  throw new Error("Tarot for Beginners validation cannot run because one or more implementation files are missing.");
}

const html = readFileSync(pagePath, "utf8");
const css = readFileSync(cssPath, "utf8");
const educationCss = readFileSync(educationCssPath, "utf8");
const js = readFileSync(jsPath, "utf8");
const routeScroll = readFileSync(routeScrollPath, "utf8");
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
if (!html.includes('<script src="/js/tarot-education-route-scroll.js"></script>')) {
  errors.push("scroll restoration: early route-scroll guard is missing");
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
  || !html.includes('data-beginner-panel="index"')
  || !html.includes('data-beginner-panel="reader"')) {
  errors.push("views: welcome, chapter index, or reader progressive-enhancement panel is missing");
}

const expectedRuntimeViews = ["welcome", "index", "chapter"];
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
  '[data-beginner-view="index"] .tarot-beginners-experience.is-enhanced [data-beginner-panel="index"]',
  '[data-beginner-view="chapter"] .tarot-beginners-experience.is-enhanced [data-beginner-panel="reader"]'
].forEach((selector) => {
  if (!css.includes(selector)) errors.push(`views: enhanced display rule is missing (${selector})`);
});
if (!html.includes('data-education-page="tarot-for-beginners"')
  || !html.includes('href="/tarot/for-beginners/" aria-current="page" data-tarot-education-active')) {
  errors.push("shared systems: education hero or active secondary navigation is missing");
}
if (!html.includes(`<a class="tarot-beginners-button tarot-beginners-button--secondary" href="${escapeHtml(tarotForBeginners.hero.secondaryRoute)}">${escapeHtml(tarotForBeginners.hero.secondaryLabel)} <span aria-hidden="true">→</span></a>`)) {
  errors.push("buttons: the hero learning route must use the accessible secondary Moonstone treatment");
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
if (html.includes("tarot-beginners-welcome__door")
  || generator.includes("tarot-beginners-welcome__door")
  || css.includes(".tarot-beginners-welcome__door")) {
  errors.push("welcome: the accidental vertical CSS door line must be completely removed");
}

if (tarotForBeginners.chapters.length !== 10 || beginnerChapterMetadata.length !== 10) {
  errors.push("data: expected exactly ten chapters");
}
if (new Set(beginnerChapterMetadata.map((chapter) => chapter.id)).size !== 10) {
  errors.push("data: chapter IDs must be unique");
}

const academyChapters = tarotForBeginners.chapters.filter((chapter) => chapter.academyLesson);
const academyChapter = academyChapters[0];
const academyLesson = academyChapter?.academyLesson;
const expectedAcademyLesson = {
  title: "What Is Tarot?",
  introContinuation: "This lesson unfolds in three chambers. Step through each one with presence.",
  headerVisual: {
    slot: "chapter-01-header",
    futureSrc: "/assets/images/tarot-for-beginners/chapter-01/header.webp",
    alt: "Placeholder for the future Chapter 01 atmospheric header artwork",
    ratio: "16 / 7"
  },
  chambers: [
    {
      id: "chamber-1",
      numeral: "I",
      label: "CHAMBER I",
      title: "What You Are Looking At",
      preview: "Step into the room of form. Here we explore the deck as an object, its structure, components, and the visible elements that make it what it is.",
      topics: ["The Deck", "The Cards", "The System"],
      visual: {
        slot: "chapter-01-chamber-01",
        futureSrc: "/assets/images/tarot-for-beginners/chapter-01/chamber-01.webp",
        alt: "Placeholder for future artwork showing tarot as a structured deck",
        ratio: "16 / 9"
      },
      learningVisual: {
        type: "stats",
        label: "Tarot deck structure",
        items: ["78 Cards", "Major and Minor Arcana", "Four Suits", "Number and Court Cards"]
      },
      sections: [{
        heading: "A Deck",
        paragraphs: ["Tarot is a seventy-eight-card system containing recurring figures, numbers, suits, archetypes, colors, objects, and narrative patterns."]
      }],
      takeaway: "Tarot begins as a structured deck before it becomes an interpretive practice."
    },
    {
      id: "chamber-2",
      numeral: "II",
      label: "CHAMBER II",
      title: "What the Images Are Saying",
      preview: "Step into the room of symbols. Here we discover what the images communicate through archetypes, emotions, themes, and the symbolic language of tarot.",
      topics: ["Symbols", "Themes", "Archetypes"],
      visual: {
        slot: "chapter-01-chamber-02",
        futureSrc: "/assets/images/tarot-for-beginners/chapter-01/chamber-02.webp",
        alt: "Placeholder for future artwork exploring tarot imagery and symbols",
        ratio: "16 / 9"
      },
      learningVisual: {
        type: "examples",
        label: "Future tarot symbol examples",
        items: ["Example Symbol 01", "Example Symbol 02", "Example Symbol 03"]
      },
      sections: [{
        heading: "A Symbolic Language",
        paragraphs: ["Images communicate ideas about life, choices, emotions, relationships, conflict, movement, and transformation."]
      }],
      takeaway: "The image is not merely decoration. It carries the vocabulary of the reading."
    },
    {
      id: "chamber-3",
      numeral: "III",
      label: "CHAMBER III",
      title: "How Meaning Is Created",
      preview: "Step into the room of synthesis. Here we learn how meaning emerges through connection, context, and the art of interpretation.",
      topics: ["Context", "Association", "Reflection"],
      visual: {
        slot: "chapter-01-chamber-03",
        futureSrc: "/assets/images/tarot-for-beginners/chapter-01/chamber-03.webp",
        alt: "Placeholder for future artwork illustrating how tarot interpretation develops",
        ratio: "16 / 9"
      },
      learningVisual: {
        type: "equation",
        label: "Interpretation model",
        items: ["Card", "Question", "Context", "Reader"],
        result: "Interpretation"
      },
      sections: [{
        heading: "An Interpretive Tool",
        paragraphs: [
          "Meaning develops through the visible card, traditional associations, the question, context, and careful reflection.",
          "Tarot does not guarantee certainty or remove personal responsibility. Within Astral Veil, the cards are treated as mirrors for patterns and possibilities rather than fixed verdicts."
        ]
      }],
      takeaway: "Tarot offers perspective through symbols. It does not remove your ability to choose."
    }
  ],
  takeaway: "Tarot offers perspective through symbols. It does not remove your ability to choose."
};

if (academyChapters.length !== 1
  || academyChapter?.id !== "what-is-tarot"
  || academyChapter?.title !== "What Is Tarot, Really?"
  || Object.hasOwn(academyChapter || {}, "visual")
  || Object.hasOwn(academyChapter || {}, "blocks")) {
  errors.push("academy lesson data: only Chapter 01 may use academyLesson, its metadata title must remain unchanged, and legacy visual/blocks must be removed");
}
if (JSON.stringify(academyLesson) !== JSON.stringify(expectedAcademyLesson)) {
  errors.push("academy lesson data: Chapter 01 does not match the approved Three Chambers configuration");
}
if (tarotForBeginners.chapters.slice(1).some((chapter) => (
  chapter.academyLesson || !chapter.visual || !Array.isArray(chapter.blocks)
))) {
  errors.push("academy lesson data: Chapters 02–10 must retain their standard visual and block model");
}
if (countMatches(/data-beginner-chapter="/g, html) !== 10
  || countMatches(/data-chapter-nav-location="rail"/g, html) !== 10
  || countMatches(/data-chapter-nav-location="menu"/g, html) !== 10) {
  errors.push("chapters: semantic article, rail, or mobile menu counts are incorrect");
}

const indexPathHtml = html.match(/<aside class="tarot-beginners-index-path"[\s\S]*?<\/aside>/)?.[0] || "";
const indexStripHtml = html.match(/<nav class="tarot-beginners-index-strip"[\s\S]*?<\/nav>/)?.[0] || "";
const indexDotsHtml = html.match(/<div class="tarot-beginners-index-dots"[\s\S]*?<\/div>/)?.[0] || "";
const indexPanelStart = html.indexOf('<section class="tarot-beginners-index"');
const readerPanelStart = html.indexOf('<section class="tarot-beginners-reader"');
const indexPanelHtml = indexPanelStart >= 0 && readerPanelStart > indexPanelStart
  ? html.slice(indexPanelStart, readerPanelStart)
  : "";
if (!html.includes('id="chapters" aria-labelledby="beginner-index-heading" data-beginner-panel="index" data-beginner-index')
  || !html.includes(`href="${escapeHtml(tarotForBeginners.route)}" data-beginner-index-back`)
  || !html.includes('href="?view=chapters" data-beginner-index-link')) {
  errors.push("chapter index: dedicated panel, back control, or query-based entry control is missing");
}
if (countMatches(/data-beginner-index-select="/g, html) !== 30
  || countMatches(/data-beginner-index-select="/g, indexPathHtml) !== 10
  || countMatches(/data-beginner-index-select="/g, indexStripHtml) !== 10
  || countMatches(/data-beginner-index-select="/g, indexDotsHtml) !== 10) {
  errors.push("chapter index: expected ten timeline selectors, ten strip selectors, and ten mobile dots");
}
if (countMatches(/data-beginner-index-slide="/g, html) !== 10
  || countMatches(/data-beginner-complete-chapter="/g, indexPanelHtml) !== 10
  || countMatches(/data-beginner-index-progress(?:>|\s)/g, html) !== 10
  || countMatches(/data-beginner-index-progress-percent(?:>|\s)/g, html) !== 10) {
  errors.push("chapter index: expected ten preview slides with completion controls and progress displays");
}
if (!html.includes('data-beginner-index-counter>Chapter 1 of 10')
  || !html.includes('data-beginner-index-previous')
  || !html.includes('data-beginner-index-next-control')
  || !html.includes('data-beginner-index-live')) {
  errors.push("chapter index: mobile counter, previous/next controls, or live status is missing");
}
if (html.includes("tarot-beginners-library-card")
  || html.includes("tarot-beginners-library__grid")
  || html.includes("data-beginner-view-all")) {
  errors.push("chapter index: obsolete library-card or all-mode markup must be removed");
}

const chapterArticleStarts = tarotForBeginners.chapters.map((chapter) => {
  const marker = html.indexOf(`data-beginner-chapter="${chapter.id}"`);
  return marker >= 0 ? html.lastIndexOf("<article", marker) : -1;
});
const chapterArticleHtmlById = new Map();
let previousChapterIndex = -1;

tarotForBeginners.chapters.forEach((chapter, chapterIndex) => {
  const articleStart = chapterArticleStarts[chapterIndex];
  if (articleStart < 0 || articleStart <= previousChapterIndex) {
    errors.push(`chapters: ${chapter.id} is missing or out of order`);
  }
  previousChapterIndex = articleStart;

  const articleEnd = chapterArticleStarts[chapterIndex + 1]
    ?? html.indexOf('<nav class="tarot-beginners-reader-controls"', articleStart);
  const articleHtml = articleStart >= 0 && articleEnd > articleStart
    ? html.slice(articleStart, articleEnd)
    : "";
  chapterArticleHtmlById.set(chapter.id, articleHtml);

  const expectedHeading = chapter.academyLesson?.title || chapter.title;
  if (!articleHtml.includes(`<h2 id="${chapter.id}-heading" tabindex="-1">${escapeHtml(expectedHeading)}</h2>`)) {
    errors.push(`chapters: semantic H2/focus target is missing for ${chapter.id}`);
  }
  if (!html.includes(`href="#${chapter.id}" data-beginner-chapter-link="${chapter.id}"`)) {
    errors.push(`chapters: hash navigation is missing for ${chapter.id}`);
  }

  if (chapter.academyLesson) {
    const expectedAcademyStrings = new Set([
      chapter.eyebrow,
      chapter.introduction,
      ...collectStrings(chapter.academyLesson)
    ]);
    expectedAcademyStrings.forEach((text) => {
      if (text && !articleHtml.includes(escapeHtml(text))) {
        errors.push(`academy lesson: visible initial configuration is missing (${text})`);
      }
    });
  } else {
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
  }

  const indexCardStart = html.indexOf(
    `<article class="tarot-beginners-index-card" id="beginner-index-card-${chapter.id}"`
  );
  const indexCardEnd = indexCardStart >= 0 ? html.indexOf("</article>", indexCardStart) : -1;
  const indexCardHtml = indexCardStart >= 0 && indexCardEnd > indexCardStart
    ? html.slice(indexCardStart, indexCardEnd)
    : "";
  if (!indexCardHtml.includes(`<h3>${escapeHtml(chapter.navLabel)}</h3>`)
    || !indexCardHtml.includes(escapeHtml(chapter.cardSummary))
    || !indexCardHtml.includes(`src="${escapeHtml(chapter.image.src)}"`)
    || !indexCardHtml.includes(`data-beginner-complete-chapter="${chapter.id}"`)
    || !indexCardHtml.includes(`data-beginner-chapter-link="${chapter.id}"`)) {
    errors.push(`chapter index: preview copy, artwork, or actions are incomplete for ${chapter.id}`);
  }
  if (!indexPathHtml.includes(escapeHtml(chapter.navLabel))
    || !indexPathHtml.includes(escapeHtml(chapter.cardSummary))) {
    errors.push(`chapter index: timeline copy is incomplete for ${chapter.id}`);
  }
});

const academyArticleHtml = chapterArticleHtmlById.get("what-is-tarot") || "";
if (countMatches(/data-academy-lesson="/g, html) !== 1
  || !academyArticleHtml.includes('data-academy-lesson="what-is-tarot"')
  || countMatches(/data-beginner-module="/g, html) !== 9
  || countMatches(/data-beginner-module="/g, academyArticleHtml) !== 0) {
  errors.push("academy lesson: expected exactly one Chapter 01 academy article and nine unchanged standard visual modules");
}

if (countMatches(/data-lesson-chamber="/g, academyArticleHtml) !== 3
  || countMatches(/data-chamber-stage="/g, academyArticleHtml) !== 3
  || countMatches(/data-chamber-trigger="/g, academyArticleHtml) !== 3
  || countMatches(/data-chamber-panel="/g, academyArticleHtml) !== 3) {
  errors.push("academy lesson: expected exactly three chambers, stage controls, triggers, and panels");
}

const chamberStarts = (academyLesson?.chambers || []).map((chamber) => {
  const marker = academyArticleHtml.indexOf(`data-lesson-chamber="${chamber.id}"`);
  return marker >= 0 ? academyArticleHtml.lastIndexOf("<section", marker) : -1;
});
(academyLesson?.chambers || []).forEach((chamber, chamberIndex) => {
  const chamberStart = chamberStarts[chamberIndex];
  const chamberEnd = chamberStarts[chamberIndex + 1]
    ?? academyArticleHtml.indexOf('<aside class="tarot-beginners-lesson-takeaway"', chamberStart);
  const chamberHtml = chamberStart >= 0 && chamberEnd > chamberStart
    ? academyArticleHtml.slice(chamberStart, chamberEnd)
    : "";
  const sectionTag = chamberHtml.match(/^<section\b[^>]*>/)?.[0] || "";
  const stageTag = academyArticleHtml.match(new RegExp(`<button[^>]*data-chamber-stage="${escapeRegExp(chamber.id)}"[^>]*>`))?.[0] || "";
  const triggerTag = chamberHtml.match(new RegExp(`<button[^>]*data-chamber-trigger="${escapeRegExp(chamber.id)}"[^>]*>`))?.[0] || "";
  const panelTag = chamberHtml.match(new RegExp(`<div[^>]*data-chamber-panel="${escapeRegExp(chamber.id)}"[^>]*>`))?.[0] || "";
  const headingId = `${chamber.id}-heading`;
  const previewId = `${chamber.id}-preview`;
  const panelId = `${chamber.id}-panel`;

  if (!sectionTag.includes(`id="${chamber.id}"`)
    || !sectionTag.includes(`aria-labelledby="${headingId}"`)
    || /\b(?:hidden|inert)\b/.test(sectionTag)
    || !chamberHtml.includes(`<h3 id="${headingId}" data-chamber-title>${escapeHtml(chamber.title)}</h3>`)) {
    errors.push(`academy lesson: ${chamber.id} lacks its semantic source-visible section or H3`);
  }
  if (!stageTag.includes(`aria-controls="${panelId}"`)
    || !triggerTag.includes('type="button"')
    || !triggerTag.includes('aria-expanded="true"')
    || !triggerTag.includes(`aria-controls="${panelId}"`)
    || !triggerTag.includes(`aria-labelledby="${headingId}"`)
    || !triggerTag.includes(`aria-describedby="${previewId}"`)) {
    errors.push(`academy lesson: ${chamber.id} stage or expansion trigger lacks matching accessible relationships`);
  }
  if (!panelTag.includes(`id="${panelId}"`)
    || !panelTag.includes('role="region"')
    || !panelTag.includes(`aria-labelledby="${headingId}"`)
    || /\b(?:hidden|inert|aria-hidden)\b/.test(panelTag)) {
    errors.push(`academy lesson: ${chamber.id} panel must be source-rendered, labelled, visible, and non-inert`);
  }
  const chamberStrings = new Set([
    chamber.label,
    chamber.title,
    chamber.preview,
    ...chamber.topics,
    ...collectStrings(chamber.learningVisual),
    ...collectStrings(chamber.sections),
    chamber.takeaway
  ]);
  chamberStrings.forEach((text) => {
    if (text && !chamberHtml.includes(escapeHtml(text))) {
      errors.push(`academy lesson: ${chamber.id} is missing configured content (${text})`);
    }
  });
  chamber.sections.forEach((section) => {
    if (!chamberHtml.includes(`<h4>${escapeHtml(section.heading)}</h4>`)) {
      errors.push(`academy lesson: ${chamber.id} is missing subsection H4 (${section.heading})`);
    }
  });
});

const primaryAcademySentences = (academyLesson?.chambers || [])
  .flatMap((chamber) => chamber.sections)
  .flatMap((section) => section.paragraphs);
primaryAcademySentences.forEach((sentence) => {
  const occurrences = countMatches(new RegExp(escapeRegExp(escapeHtml(sentence)), "g"), html);
  if (occurrences !== 1) {
    errors.push(`academy lesson SEO: primary educational sentence must appear exactly once (found ${occurrences}: ${sentence})`);
  }
});

const placeholderBlocks = [...academyArticleHtml.matchAll(/<figure class="[^"]*tarot-beginners-lesson-placeholder[^"]*"[^>]*>[\s\S]*?<\/figure>/g)]
  .map((match) => match[0]);
const expectedPlaceholders = academyLesson
  ? [academyLesson.headerVisual, ...academyLesson.chambers.map((chamber) => chamber.visual)]
  : [];
if (placeholderBlocks.length !== 4 || placeholderBlocks.some((block) => /<img\b/i.test(block))) {
  errors.push("academy lesson placeholders: expected four CSS-only figures with no image elements");
}
expectedPlaceholders.forEach((visual) => {
  const placeholder = placeholderBlocks.find((block) => block.includes(`data-chapter-visual-placeholder="${escapeHtml(visual.slot)}"`)) || "";
  const openingTag = placeholder.match(/^<figure\b[^>]*>/)?.[0] || "";
  if (!openingTag.includes(`data-future-src="${escapeHtml(visual.futureSrc)}"`)
    || !openingTag.includes(`--lesson-placeholder-ratio:${escapeHtml(visual.ratio)}`)
    || !placeholder.includes(`role="img" aria-label="${escapeHtml(visual.alt)}"`)
    || !placeholder.includes("Development visual")
    || !placeholder.includes(`<strong>${escapeHtml(visual.slot)}</strong>`)) {
    errors.push(`academy lesson placeholders: ${visual.slot} lacks future path, ratio, accessible description, or development label`);
  }
});

if (countMatches(/data-beginner-complete-chapter="/g, html) !== 11
  || countMatches(/data-beginner-complete-chapter="what-is-tarot"/g, academyArticleHtml) !== 1
  || !academyArticleHtml.includes('data-lesson-course-progress')
  || !academyArticleHtml.includes('class="tarot-beginners-lesson-navigation"')
  || !academyArticleHtml.includes('data-reader-continue')
  || !academyArticleHtml.includes('href="?view=chapters" data-beginner-index-link')) {
  errors.push("academy lesson completion/navigation: expected ten index controls, one lesson control, course progress, Continue, and chapter-library actions");
}

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

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) errors.push(`accessibility: duplicate IDs found (${duplicateIds.join(", ")})`);

tarotForBeginners.faq.items.forEach((item, index) => {
  const number = index + 1;
  const schemaItem = faqSchema?.mainEntity?.[index];
  const answerMatch = html.match(new RegExp(`id="tarot-beginners-faq-answer-${number}"[\\s\\S]*?<div class="tarot-faq__answer-inner"><p>([\\s\\S]*?)<\\/p>`));
  const visibleAnswer = answerMatch ? decodeHtml(answerMatch[1]) : "";
  const expectedAnswer = beginnerFaqPlainText(item);
  if (!html.includes(`id="tarot-beginners-faq-question-${number}"`) || !html.includes(`<span>${escapeHtml(item.question)}</span>`)) {
    errors.push(`FAQ: visible question is missing (${item.question})`);
  }
  if (visibleAnswer !== expectedAnswer) errors.push(`FAQ: visible answer does not match data (${item.question})`);
  if (schemaItem?.name !== item.question || schemaItem?.acceptedAnswer?.text !== expectedAnswer) {
    errors.push(`FAQ: schema does not match visible data (${item.question})`);
  }
});

if (countMatches(/data-education-faq-button/g, html) !== tarotForBeginners.faq.items.length
  || countMatches(/aria-controls="tarot-beginners-faq-answer-\d+"/g, html) !== tarotForBeginners.faq.items.length) {
  errors.push("FAQ: every shared row must remain a real accessible accordion button");
}

[
  "--beginner-primary-bg",
  "--beginner-secondary-bg",
  "--beginner-panel-bg",
  "--beginner-panel-border",
  "--beginner-panel-border-hover",
  "--beginner-muted-text",
  "@keyframes beginner-moonlight-sweep",
  "animation: beginner-moonlight-sweep 700ms ease-out 1",
  ".tarot-beginners-closing__doors",
  ".tarot-beginners-closing__door",
  ".tarot-beginners-button--primary::before"
].forEach((token) => {
  if (!css.includes(token)) errors.push(`redesign: required page-specific style is missing (${token})`);
});

[
  "body.tarot-meanings-page .tarot-education-faq .tarot-faq__inner",
  "grid-template-columns: minmax(15rem, 32fr) minmax(0, 68fr)",
  "background: var(--tarot-question-surface)",
  "border-radius: 0",
  "box-shadow: none"
].forEach((token) => {
  if (!educationCss.includes(token)) errors.push(`FAQ: shared question-ledger style is missing (${token})`);
});

if (!css.includes("#24143f 0%, #321a50 50%, #3a205c 100%")
  || !css.includes("rgba(35, 25, 61, .42)")
  || !css.includes("rgba(15, 11, 29, .68)")) {
  errors.push("themes: Moon mode is missing the approved Moonstone, ledger, or panel palette");
}
if (!css.includes(".tarot-beginners-button--primary::before {\n    display: none;")
  || !css.includes("animation: none !important")) {
  errors.push("motion: reduced-motion mode must remove the traveling shimmer and component motion");
}

const closingDoorLinks = [...html.matchAll(/<a class="tarot-beginners-closing__door[^>]*href="([^"]+)"/g)].map((match) => match[1]);
if (JSON.stringify(closingDoorLinks) !== JSON.stringify([
  tarotForBeginners.closing.primary.route,
  tarotForBeginners.closing.secondary.route
])) {
  errors.push("closing: Two Open Doors must preserve the reading and guide routes as whole-panel links");
}
[
  tarotForBeginners.closing.eyebrow,
  tarotForBeginners.closing.heading,
  tarotForBeginners.closing.text,
  ...collectStrings(tarotForBeginners.closing.primary),
  ...collectStrings(tarotForBeginners.closing.secondary)
].filter((value) => !value.startsWith("/")).forEach((text) => {
  if (!html.includes(escapeHtml(text))) errors.push(`closing: rendered Two Open Doors copy is missing (${text})`);
});
if (!html.includes('<nav class="tarot-beginners-closing__doors" aria-label="Choose your next tarot destination">')
  || countMatches(/<a class="tarot-beginners-closing__door[^>]*aria-label="[^"]+"/g, html) !== 2
  || countMatches(/class="tarot-beginners-closing__content"/g, html) !== 2) {
  errors.push("closing: both destinations must use the About-style whole-card structure");
}
if (html.includes("tarot-beginners-closing__visual")
  || html.includes("tarot-beginners-closing__motif-lines")
  || generator.includes("renderClosingMotif")) {
  errors.push("closing: the former line-art icons must be completely removed");
}
[
  'url("../assets/images/sbout-reading-button.webp")',
  'url("../assets/images/background%20_images/how-to-read-tarot.png")',
  "min-height: clamp(280px, 28vw, 340px)",
  "grid-template-columns: repeat(2, minmax(0, 380px))",
  "grid-auto-flow: column",
  "overflow-x: auto",
  "scroll-snap-type: x mandatory",
  "scroll-snap-align: start",
  "scroll-snap-stop: always",
  "-webkit-overflow-scrolling: touch"
].forEach((token) => {
  if (!css.includes(token)) errors.push(`closing: About-style imagery, sizing, or mobile swipe behavior is missing (${token})`);
});
[
  "assets/images/sbout-reading-button.webp",
  "assets/images/background _images/how-to-read-tarot.png"
].forEach((asset) => {
  if (!existsSync(resolve(rootDir, asset))) errors.push(`closing: background image asset is missing (${asset})`);
});
if (!css.includes("@media (min-width: 901px) and (max-width: 1366px), (min-width: 901px) and (max-height: 800px)")) {
  errors.push("closing: About-card laptop sizing breakpoint is missing");
}

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
  || /class="[^"]*tarot-beginners-(?:welcome__image|index-card__image|module__image)[^"]*"/.test(tag)
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
  "completedChapters:",
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
if (countMatches(/astralVeilTarotBeginnerProgress/g, js) !== 1
  || !js.includes("localStorage.getItem(STORAGE_KEY)")
  || !js.includes("localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))")
  || /localStorage\.(?:getItem|setItem)\((?!STORAGE_KEY\b)/.test(js)) {
  errors.push("persistence: chapter and academy completion must continue using only astralVeilTarotBeginnerProgress");
}

[
  'const academyArticles = Array.from(root.querySelectorAll("[data-academy-lesson]"))',
  "const academyContextByChapterId = new Map()",
  "const chamberRouteById = new Map()",
  "let academyContextsAreValid = true",
  "academyArticles.forEach((article) =>",
  'const chamberSections = Array.from(article.querySelectorAll("[data-lesson-chamber]"))',
  'const chamberTriggers = Array.from(article.querySelectorAll("[data-chamber-trigger]"))',
  'const chamberPanels = Array.from(article.querySelectorAll("[data-chamber-panel]"))',
  'const chamberStages = Array.from(article.querySelectorAll("[data-chamber-stage]"))',
  "chamberSections.length === 3",
  "chamberStages.length === chamberSections.length",
  'chapterIdSet.has(id) || id === "welcome" || id === "chapters"',
  "chamberRouteById.has(id)",
  "chamberRouteById.set(id, { chapterId, context, chamber })",
  "chamberStateByChapterId: new Map(",
  "function academyContextForChapter(",
  "function chamberStateForContext(",
  "function updateChamberState(",
  "function setActiveChamber(",
  "function initializeAcademyLessons(",
  "const chamberRoute = chamberRouteById.get(hash)",
  "chapterId: chamberRoute.chapterId",
  "chamberId: hash",
  "requestedChamberId ? `#${requestedChamberId}`",
  'chamber.section.classList.toggle("is-open", active)',
  'chamber.trigger.setAttribute("aria-expanded", String(active))',
  'chamber.panel.setAttribute("aria-hidden", String(!active))',
  "chamber.panel.inert = !active",
  'chamber.section.scrollIntoView({\n          block: "nearest"',
  "chamber.trigger.focus({ preventScroll: true })",
  'chamber.panel.removeAttribute("aria-hidden")',
  "chamber.panel.inert = false"
].forEach((token) => {
  if (!js.includes(token)) errors.push(`academy lesson interaction: required chamber state, direct route, focus, or no-JS fallback hook is missing (${token})`);
});
if (js.includes('root.querySelector("[data-academy-lesson]")')
  || js.includes("const academyChapterId =")
  || js.includes("state.activeChamberId")
  || js.includes("state.completedChambers")) {
  errors.push("academy lesson architecture: runtime chamber state must remain scoped per academy chapter rather than reverting to a single-instance implementation");
}
[
  "function recommendedChapterId()",
  "function updateIndexState(",
  "function selectIndexChapter(",
  "function toggleChapterComplete(",
  "function captureIndexReturnState(",
  "function enterChapterIndex(",
  "function exitChapterIndex()",
  "function chapterIdFromQuery(",
  "function restoreSavedScroll(",
  "function syncIndexFromScroll()",
  "state.indexSelectedId",
  "state.indexOpener",
  "state.completed.size",
  'control.setAttribute("aria-pressed", String(completed))',
  'url.searchParams.set("view", "chapters")',
  'url.searchParams.set("chapter", String((chapter?.index ?? 0) + 1))',
  'url.searchParams.delete("view")',
  'url.searchParams.delete("chapter")',
  'params.get("view") === "chapters"',
  "scrollY: window.scrollY",
  "restoreFromIndex: true",
  "restoreFromIndex: false",
  "route.restoreFromIndex",
  "window.history.replaceState(currentState, \"\", window.location.href)",
  "window.history.back()",
  "indexBack?.focus({ preventScroll: true })",
  'indexViewport.addEventListener("scroll", syncIndexFromScroll, { passive: true })',
  'mobileIndexQuery.addEventListener?.("change", syncIndexLayout)',
  'window.addEventListener("resize", syncIndexLayout, { passive: true })'
].forEach((token) => {
  if (!js.includes(token)) errors.push(`chapter index: required state, URL, history, or swipe behavior is missing (${token})`);
});
if (!js.includes("completedCount / chapterData.length")
  || !js.includes('progress.setAttribute("aria-valuenow", String(completedCount))')
  || !js.includes('`${completedCount} of ${chapterData.length} chapters complete`')) {
  errors.push("chapter index: progress must be derived from completed chapters out of ten and exposed accessibly");
}
if (!js.includes("window.requestAnimationFrame(() => {")
  || countMatches(/window\.requestAnimationFrame\(\(\) =>/g, js) < 2
  || !js.includes("window.scrollTo({ top: scrollY, left: 0, behavior: \"auto\" })")) {
  errors.push("chapter index: saved page scroll must be restored after returning through browser history");
}
if (/completedChapters\s*=\s*(?:source\.)?visitedChapters|completed:\s*new Set\(progress\.visitedChapters\)/.test(js)) {
  errors.push("chapter index: completed chapters must remain separate from visited chapters");
}
if (!js.includes('const keepWelcomeRouteUnfragmented = mode === "replace"')
  || !js.includes('url.hash = keepWelcomeRouteUnfragmented ? "" : hash;')) {
  errors.push("scroll restoration: initial welcome state must not inject a fragment");
}
if (!js.includes("function isFaqHashTarget(hash)")
  || !js.includes("function openFaqHashTarget(hash)")
  || !js.includes('showView("welcome", { historyMode: "none", scroll: false })')
  || !js.includes("openFaqHashTarget(route.faqHash)")) {
  errors.push("FAQ: a deliberate FAQ hash must be preserved and opened without scripted scrolling");
}
[
  'window.location.hash) return',
  'navigationEntry?.type === "back_forward"',
  'window.history.scrollRestoration = "manual"',
  'window.scrollTo(0, 0)',
  'window.addEventListener("pagehide"'
].forEach((token) => {
  if (!routeScroll.includes(token)) errors.push(`scroll restoration: route guard is missing (${token})`);
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
  ".tarot-beginners-index__layout",
  ".tarot-beginners-index-path__line",
  ".tarot-beginners-index-card",
  ".tarot-beginners-index-strip",
  ".tarot-beginners-index-mobile-nav",
  ".tarot-beginners-index-dots",
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

[
  ".tarot-beginners-academy-lesson",
  ".tarot-beginners.is-academy-lesson-active",
  ".tarot-beginners-academy-introduction__layout",
  ".tarot-beginners-lesson-placeholder",
  "aspect-ratio: var(--lesson-placeholder-ratio, 16 / 9)",
  ".tarot-beginners-chamber-progress",
  ".tarot-beginners-lesson-chamber__header",
  ".tarot-beginners-academy-lesson.is-chambers-ready .tarot-beginners-lesson-chamber__panel",
  ".tarot-beginners-academy-lesson.is-chambers-ready .tarot-beginners-lesson-chamber.is-open .tarot-beginners-lesson-chamber__panel",
  ".tarot-beginners-lesson-visual-tool",
  ".tarot-beginners-lesson-takeaway",
  ".tarot-beginners-lesson-completion",
  ".tarot-beginners-lesson-navigation"
].forEach((token) => {
  if (!css.includes(token)) errors.push(`academy lesson styles: reusable scoped treatment is missing (${token})`);
});
if (!/\.tarot-beginners-academy-lesson\.is-chambers-ready \.tarot-beginners-lesson-chamber__panel\s*\{[^}]*grid-template-rows:\s*0fr[^}]*380ms/s.test(css)
  || !/\.tarot-beginners-academy-lesson\.is-chambers-ready \.tarot-beginners-lesson-chamber\.is-open \.tarot-beginners-lesson-chamber__panel\s*\{[^}]*grid-template-rows:\s*1fr[^}]*380ms/s.test(css)) {
  errors.push("academy lesson styles: the enhanced one-open disclosure must use the approved 380ms inline expansion");
}

const academyTabletCss = collectCssMediaBlocks(css, "max-width: 1100px");
const academyMobileCss = collectCssMediaBlocks(css, "max-width: 820px");
const academySmallMobileCss = collectCssMediaBlocks(css, "max-width: 430px");
const academyReducedMotionCss = collectCssMediaBlocks(css, "prefers-reduced-motion: reduce");
if (!academyTabletCss.some((block) => block.includes(".tarot-beginners-academy-introduction__layout")
  && block.includes(".tarot-beginners-lesson-chamber__header"))) {
  errors.push("academy lesson responsive: tablet layout must adapt the introduction and horizontal chamber cards");
}
if (!academyMobileCss.some((block) => block.includes(".tarot-beginners-academy-lesson")
  && block.includes(".tarot-beginners-lesson-chamber__header")
  && block.includes("grid-template-columns: minmax(0, 1fr)"))) {
  errors.push("academy lesson responsive: mobile layout must stack the academy lesson and chamber headers at the project breakpoint");
}
if (!academySmallMobileCss.some((block) => block.includes(".tarot-beginners-chamber-progress")
  && block.includes(".tarot-beginners-lesson-visual-tool__equation"))) {
  errors.push("academy lesson responsive: small mobile must preserve compact chamber progress and interpretation tools");
}
if (!academyReducedMotionCss.some((block) => (
  block.includes(".tarot-beginners-academy-lesson.is-chambers-ready .tarot-beginners-lesson-chamber__panel")
  && block.includes("transition: none !important")
))) {
  errors.push("academy lesson motion: reduced-motion mode must remove chamber disclosure animation");
}

[
  "grid-template-columns: minmax(350px, .72fr) minmax(560px, 1.28fr)",
  "grid-template-columns: repeat(5, minmax(0, 1fr))",
  ".tarot-beginners-index-path,\n  .tarot-beginners-index-strip {\n    display: none;",
  "overflow-x: auto",
  "grid-auto-flow: column",
  "grid-auto-columns: minmax(0, calc(100% - 26px))",
  "scroll-snap-type: x mandatory",
  "scroll-snap-align: start",
  "scroll-snap-stop: always",
  "-webkit-overflow-scrolling: touch"
].forEach((token) => {
  if (!css.includes(token)) errors.push(`chapter index: desktop path/strip or native mobile swipe style is missing (${token})`);
});
if (!css.includes("@media (max-width: 820px)")
  || !css.includes("@media (prefers-reduced-motion: reduce)")) {
  errors.push("chapter index: project mobile breakpoint or reduced-motion treatment is missing");
}

const chapterIndexThemeVariables = [
  "--chapter-primary-button-bg",
  "--chapter-primary-button-text",
  "--chapter-primary-button-arrow",
  "--chapter-primary-button-border",
  "--chapter-primary-button-hover-bg",
  "--chapter-active-line",
  "--chapter-active-glow",
  "--chapter-active-glow-soft",
  "--chapter-active-wash"
];
const chapterIndexThemeValues = new Map([
  [".tarot-beginners-index", {
    "--chapter-primary-button-bg": "var(--beginner-index-action)",
    "--chapter-primary-button-text": "#14251f",
    "--chapter-primary-button-arrow": "#1d3028",
    "--chapter-primary-button-border": "rgba(213, 179, 110, .52)",
    "--chapter-primary-button-hover-bg": "linear-gradient(100deg, #f7e6b8, #d2ae62)",
    "--chapter-active-line": "#d7b866",
    "--chapter-active-glow": "rgba(215, 184, 102, .56)",
    "--chapter-active-glow-soft": "rgba(111, 156, 118, .22)",
    "--chapter-active-wash": "rgba(164, 137, 73, .11)"
  }],
  [".tarot-beginners-page.moon-mode .tarot-beginners-index", {
    "--chapter-primary-button-bg": "var(--beginner-index-action)",
    "--chapter-primary-button-text": "#171023",
    "--chapter-primary-button-arrow": "#24153a",
    "--chapter-primary-button-border": "rgba(196, 163, 255, .5)",
    "--chapter-primary-button-hover-bg": "linear-gradient(100deg, #e7d9ff, #b79beb)",
    "--chapter-active-line": "#c4a3ff",
    "--chapter-active-glow": "rgba(177, 135, 255, .62)",
    "--chapter-active-glow-soft": "rgba(147, 102, 226, .28)",
    "--chapter-active-wash": "rgba(120, 82, 184, .13)"
  }],
  [".tarot-beginners-page.blood-moon-mode .tarot-beginners-index", {
    "--chapter-primary-button-bg": "linear-gradient(100deg, #ffb8c3, #d96679)",
    "--chapter-primary-button-text": "#240b10",
    "--chapter-primary-button-arrow": "#2b0d14",
    "--chapter-primary-button-border": "rgba(225, 92, 103, .58)",
    "--chapter-primary-button-hover-bg": "linear-gradient(100deg, #ffc4cc, #e37283)",
    "--chapter-active-line": "#e15c67",
    "--chapter-active-glow": "rgba(214, 54, 70, .62)",
    "--chapter-active-glow-soft": "rgba(142, 22, 39, .3)",
    "--chapter-active-wash": "rgba(138, 24, 42, .14)"
  }],
  [".tarot-beginners-page.blue-moon-mode .tarot-beginners-index", {
    "--chapter-primary-button-bg": "var(--beginner-index-action)",
    "--chapter-primary-button-text": "#03131f",
    "--chapter-primary-button-arrow": "#08253a",
    "--chapter-primary-button-border": "rgba(119, 189, 232, .52)",
    "--chapter-primary-button-hover-bg": "linear-gradient(100deg, #d2f5ff, #79d3f2)",
    "--chapter-active-line": "#77bde8",
    "--chapter-active-glow": "rgba(78, 162, 222, .58)",
    "--chapter-active-glow-soft": "rgba(47, 105, 166, .28)",
    "--chapter-active-wash": "rgba(58, 111, 170, .13)"
  }]
]);

chapterIndexThemeValues.forEach((expectedValues, selector) => {
  const ruleBody = getCssRuleBody(css, selector);
  chapterIndexThemeVariables.forEach((variable) => {
    if (!ruleBody.includes(`${variable}: ${expectedValues[variable]};`)) {
      errors.push(`chapter index theme: ${selector} is missing the approved ${variable} value`);
    }
  });
});

const chapterIndexPreviewRule = getCssRuleBody(css, ".tarot-beginners-index-preview");
if (!chapterIndexPreviewRule.includes("width: 100%;")
  || !chapterIndexPreviewRule.includes("min-width: 0;")
  || !chapterIndexPreviewRule.includes("margin-inline: auto;")) {
  errors.push("chapter index sizing: the shared preview-and-strip wrapper must remain fluid and centered");
}
const chapterIndexDesktopCss = collectCssMediaBlocks(css, "min-width: 1181px");
if (!chapterIndexDesktopCss.some((block) => (
  /\.tarot-beginners-index-preview\s*\{[^}]*width:\s*90%;[^}]*max-width:\s*780px;[^}]*justify-self:\s*center;/s.test(block)
))) {
  errors.push("chapter index sizing: large desktop must cap the centered preview-and-strip module at 90% and 780px");
}

const chapterOpenRule = getCssRuleBody(css, ".tarot-beginners-index .tarot-beginners-index-card__open");
[
  "display: grid;",
  "width: clamp(250px, 42%, 310px);",
  "max-width: 100%;",
  "min-height: 48px;",
  "grid-template-columns: 1fr auto 1fr;",
  "justify-self: center;",
  "border-color: var(--chapter-primary-button-border);",
  "color: var(--chapter-primary-button-text);",
  "background: var(--chapter-primary-button-bg);",
  "font-weight: 600;"
].forEach((token) => {
  if (!chapterOpenRule.includes(token)) errors.push(`chapter index CTA: scoped desktop treatment is missing (${token})`);
});
const chapterOpenArrowRule = getCssRuleBody(css, '.tarot-beginners-index .tarot-beginners-index-card__open > span[aria-hidden="true"]:last-child');
if (!chapterOpenArrowRule.includes("grid-column: 3;")
  || !chapterOpenArrowRule.includes("justify-self: end;")
  || !chapterOpenArrowRule.includes("color: var(--chapter-primary-button-arrow);")) {
  errors.push("chapter index CTA: the arrow must retain its dedicated right-aligned theme color");
}
const chapterOpenHoverRule = getCssRuleBody(css, ".tarot-beginners-index .tarot-beginners-index-card__open:is(:hover, :focus-visible)");
if (!chapterOpenHoverRule.includes("color: var(--chapter-primary-button-text);")
  || !chapterOpenHoverRule.includes("background: var(--chapter-primary-button-hover-bg);")) {
  errors.push("chapter index CTA: hover and keyboard focus must preserve theme-aware contrast");
}
const chapterIndexMobileCss = collectCssMediaBlocks(css, "max-width: 820px");
if (!chapterIndexMobileCss.some((block) => (
  /\.tarot-beginners-index \.tarot-beginners-index-card__open\s*\{[^}]*width:\s*100%;[^}]*min-height:\s*50px;/s.test(block)
))) {
  errors.push("chapter index CTA: mobile must restore a full-width, 50px touch target");
}

const obsoleteActivePillRule = getCssRuleBody(css, ".tarot-beginners-index-path button::before");
if (!obsoleteActivePillRule.includes("content: none;")
  || /(?:border(?:-color|-radius)?|background|box-shadow)\s*:/.test(obsoleteActivePillRule)) {
  errors.push("chapter index path: the former active rounded-pill pseudo-element must remain fully removed");
}
const chapterPathCopyRule = getCssRuleBody(css, ".tarot-beginners-index-path__copy");
if (!chapterPathCopyRule.includes("position: relative;")
  || !chapterPathCopyRule.includes("isolation: isolate;")) {
  errors.push("chapter index path: the active line and wash must remain aligned to the text copy rather than the curved node offset");
}
const chapterActiveLineRule = getCssRuleBody(css, ".tarot-beginners-index-path__copy::before");
[
  "left: -.58rem;",
  "width: 2px;",
  "border-radius: 999px;",
  "background: var(--chapter-active-line);",
  "box-shadow: 0 0 8px var(--chapter-active-glow), 0 0 18px var(--chapter-active-glow-soft);"
].forEach((token) => {
  if (!chapterActiveLineRule.includes(token)) errors.push(`chapter index path: approved active-line treatment is missing (${token})`);
});
if (!/\.tarot-beginners-index-path__copy::after\s*\{[^}]*background:\s*linear-gradient\(90deg, var\(--chapter-active-wash\), transparent 72%\);/s.test(css)) {
  errors.push("chapter index path: the active text wash must remain soft, horizontal, and edge-free");
}
if (!/\.tarot-beginners-index-path button\.is-active \.tarot-beginners-index-path__copy::before,\s*\.tarot-beginners-index-path button\.is-active \.tarot-beginners-index-path__copy::after\s*\{[^}]*opacity:\s*1;/s.test(css)) {
  errors.push("chapter index path: only the active row may fully reveal its line and wash");
}

[
  [".tarot-beginners-index-path button.is-active .tarot-beginners-index-path__node", [
    "border-color: var(--chapter-active-line);",
    "box-shadow: 0 0 0 6px var(--chapter-active-glow-soft), 0 0 24px var(--chapter-active-glow);"
  ]],
  [".tarot-beginners-index-path button.is-active .tarot-beginners-index-path__number", [
    "color: var(--chapter-active-line);",
    "text-shadow: 0 0 12px var(--chapter-active-glow-soft);"
  ]],
  [".tarot-beginners-index-path button.is-active .tarot-beginners-index-path__copy strong", [
    "color: var(--beginner-heading);"
  ]],
  [".tarot-beginners-index-path button.is-active .tarot-beginners-index-path__copy small", [
    "color: color-mix(in srgb, var(--beginner-text) 82%, transparent);"
  ]]
].forEach(([selector, tokens]) => {
  const ruleBody = getCssRuleBody(css, selector);
  tokens.forEach((token) => {
    if (!ruleBody.includes(token)) errors.push(`chapter index path: active node or typography treatment is missing (${selector}: ${token})`);
  });
});
if (!/\.tarot-beginners-index__back:focus-visible,\s*\.tarot-beginners-index :is\(button, a\):focus-visible\s*\{[^}]*outline:\s*2px solid var\(--beginner-accent-strong\);[^}]*outline-offset:\s*3px;/s.test(css)) {
  errors.push("chapter index accessibility: keyboard focus must retain a visible outline independent of the active glow");
}
const chapterIndexReducedMotionCss = collectCssMediaBlocks(css, "prefers-reduced-motion: reduce");
if (!chapterIndexReducedMotionCss.some((block) => (
  block.includes(".tarot-beginners-index-path__copy::before")
  && block.includes(".tarot-beginners-index-path__copy::after")
  && block.includes("transition-duration: 80ms !important")
))) {
  errors.push("chapter index motion: reduced-motion handling must include the active line and wash");
}

[
  "function renderChapterIntroduction(",
  "function renderChamberProgress(",
  "function renderChapterVisualPlaceholder(",
  "function renderLessonChamber(",
  "function renderLessonTakeaway(",
  "function renderLessonCompletion(",
  "function renderLessonNavigation(",
  "function renderAcademyChapter(",
  "function renderStandardChapter(",
  '`${chapter.id}-lesson-takeaway-heading`',
  '`${chapter.id}-lesson-completion-heading`',
  "chapter.academyLesson ? renderAcademyChapter(chapter) : renderStandardChapter(chapter)",
  "lesson.chambers.map(renderLessonChamber)"
].forEach((token) => {
  if (!generator.includes(token)) errors.push(`academy lesson architecture: reusable generator seam is missing (${token})`);
});

if (!generator.includes("beginnerChapterMetadata")
  || !generator.includes("page.chapters.map(renderChapter)")
  || !generator.includes("function renderChapterIndex(page)")
  || !generator.includes("function renderIndexTimelineItem(")
  || !generator.includes("function renderIndexPreview(")
  || !generator.includes("function renderIndexStripItem(")
  || !generator.includes("function renderIndexDot(")
  || !generator.includes("page.chapters.map(renderIndexTimelineItem)")
  || !generator.includes("renderIndexPreview(chapter, index, total)")
  || !generator.includes("page.chapters.map(renderIndexStripItem)")
  || !generator.includes("page.chapters.map(renderIndexDot)")) {
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

console.log("Validated Tarot for Beginners: Chapter 01 Three Chambers academy lesson, nine standard chapters, dedicated chapter index, completion, history, SEO, accessibility, themes, motion, and responsive hooks.");
