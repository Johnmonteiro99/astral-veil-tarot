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
const expectedChapterCoverFiles = [
  "01_what_is_tarot.png",
  "02_what_do_you_need.png",
  "03_choosing_a_deck.png",
  "04_inside_the_deck.png",
  "05_learning_meanings.png",
  "06_tarot_myths.png",
  "07_first_week.png",
  "08_common_mistakes.png",
  "09_tarot_glossary.png",
  "10_next_path.png"
];

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
const bloodHeroSelector = 'body.tarot-beginners-page.blood-moon-mode .tarot-education-page > .tarot-beginners-hero[data-education-page="tarot-for-beginners"]';
const bloodHeroRule = getCssRuleBody(css, bloodHeroSelector);
[
  "--education-hero-surface: rgba(16, 1, 4, .93)",
  "--tarot-hero-blend-primary: rgba(9, 5, 8, .96)",
  "--tarot-hero-blend-secondary: rgba(36, 8, 17, .68)",
  "--tarot-hero-edge-shadow: rgba(8, 1, 4, .88)",
  "--tarot-beginners-hero-overlay:",
  "--tarot-beginners-hero-overlay-mobile:"
].forEach((token) => {
  if (!bloodHeroRule.includes(token)) errors.push(`hero: Blood Moon-specific crimson overlay token is missing (${token})`);
});
if (!css.includes(`${bloodHeroSelector} .tarot-beginners-hero__veil`)
  || !css.includes("background: var(--tarot-beginners-hero-overlay)")
  || !css.includes("background: var(--tarot-beginners-hero-overlay-mobile)")) {
  errors.push("hero: Blood Moon desktop or mobile overlay is not scoped to the Beginners hero");
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
const regularWelcomeImage = tarotForBeginners.welcome.images.regular;
const bloodMoonWelcomeImage = tarotForBeginners.welcome.images.bloodMoon;
if (!html.includes("data-welcome-guide-art")
  || !html.includes(`--beginner-welcome-guide-image-regular:url(${escapeHtml(regularWelcomeImage.src)})`)
  || !html.includes(`--beginner-welcome-guide-image-blood:url(${escapeHtml(bloodMoonWelcomeImage.src)})`)) {
  errors.push("welcome: full-section regular and Blood Moon guide artwork variables are missing");
}
if (html.includes("tarot-beginners-welcome__visual")
  || html.includes("tarot-beginners-welcome__image")
  || generator.includes("tarot-beginners-welcome__visual")
  || generator.includes("tarot-beginners-welcome__image")) {
  errors.push("welcome: guide artwork must not remain in a framed figure or standalone image");
}
if (countMatches(/class="tarot-beginners-welcome__truth-icon"/g, html) !== 6) {
  errors.push("welcome: both theme copies must render three principle-card icons");
}
if (countMatches(/class="tarot-beginners-welcome__truth-number"/g, html) !== 6
  || countMatches(/class="tarot-beginners-welcome__truth-meta"/g, html) !== 6) {
  errors.push("welcome: both theme copies must render numbered principle-card headers");
}
if (countMatches(/class="tarot-beginners-welcome__greeting"/g, html) !== 2) {
  errors.push("welcome: regular and Blood Moon guide greetings are missing");
}
if (countMatches(/class="tarot-beginners-welcome__header"/g, html) !== 2
  || countMatches(/class="tarot-beginners-welcome__truths-hint"/g, html) !== 2
  || countMatches(/class="tarot-beginners-welcome__truths" tabindex="0" aria-label="Beginner guidance principles"/g, html) !== 2) {
  errors.push("welcome: mobile artwork headers or keyboard-scrollable principle carousels are missing");
}
if (countMatches(/class="tarot-beginners-welcome__guide-quote"/g, html) !== 1
  || !html.includes("data-regular-quote=")
  || !html.includes("data-blood-quote=")) {
  errors.push("welcome: exactly one theme-aware guide quote bubble must be rendered");
}
const welcomeCssStart = css.indexOf("/* Welcome Threshold */");
const welcomeCssEnd = css.indexOf("/* Chapter Library */", welcomeCssStart);
const welcomeCss = welcomeCssStart >= 0 && welcomeCssEnd > welcomeCssStart
  ? css.slice(welcomeCssStart, welcomeCssEnd)
  : "";
[
  "background-image: var(--beginner-welcome-guide-image)",
  "background-position: right center",
  "background-size: cover",
  "--beginner-welcome-guide-image: var(--beginner-welcome-guide-image-blood)",
  "color-mix(in srgb, var(--beginner-bg)",
  "grid-template-columns: repeat(3, minmax(0, 1fr))",
  "--beginner-welcome-card-bg: var(--beginner-panel-bg)",
  "backdrop-filter: blur(16px) saturate(116%)",
  "min-height: clamp(42rem, 58vw, 52rem)",
  ".tarot-beginners-welcome__guide-quote"
].forEach((token) => {
  if (!welcomeCss.includes(token)) errors.push(`welcome: cinematic background or principle-card styling is missing (${token})`);
});
const welcomeMobileCss = collectCssMediaBlocks(css, "max-width: 820px").join("\n");
[
  ".tarot-beginners-welcome::after",
  "background-image: var(--beginner-welcome-guide-image)",
  "background-image: none",
  "padding-top: calc(var(--beginner-welcome-mobile-image-height) + 2.25rem)",
  ".tarot-beginners-welcome__header",
  "grid-auto-columns: min(84%, 21rem)",
  "scroll-snap-type: x mandatory",
  "scroll-snap-align: start",
  ".tarot-beginners-welcome__truths-hint",
  ".tarot-beginners-welcome__actions",
  "flex-direction: column"
].forEach((token) => {
  if (!welcomeMobileCss.includes(token)) errors.push(`welcome: mobile image/content split or swipe treatment is missing (${token})`);
});
if (/\.tarot-beginners-welcome(?:\s|::before)*\{[^}]*(?:background-color|background):\s*#[0-9a-f]{3,8}/i.test(welcomeCss)) {
  errors.push("welcome: a hard-coded section background color was introduced");
}
[regularWelcomeImage, bloodMoonWelcomeImage].forEach((image) => {
  const assetPath = resolve(rootDir, decodeURIComponent(image.src).replace(/^\/+/, ""));
  if (!existsSync(assetPath)) errors.push(`welcome: guide artwork asset is missing (${image.src})`);
  if (image.width !== 1448 || image.height !== 1086) errors.push(`welcome: guide artwork dimensions are incorrect (${image.src})`);
});
[
  [".tarot-beginners-page", "#071311"],
  [".tarot-beginners-page.moon-mode", "#070411"],
  [".tarot-beginners-page.blood-moon-mode", "#0d0104"],
  [".tarot-beginners-page.blue-moon-mode", "#020a13"]
].forEach(([selector, expectedBackground]) => {
  if (!getCssRuleBody(css, selector).includes(`--beginner-bg: ${expectedBackground}`)) {
    errors.push(`welcome: existing ${selector} background color must remain unchanged`);
  }
});
if (html.includes("tarot-beginners-welcome__door")
  || generator.includes("tarot-beginners-welcome__door")
  || css.includes(".tarot-beginners-welcome__door")) {
  errors.push("welcome: the accidental vertical CSS door line must be completely removed");
}
if (!js.includes("guideQuoteText.textContent = isBloodMoon")
  || !js.includes('label.textContent = "Continue with Chapter 01"')) {
  errors.push("welcome: theme-aware quote copy or the initial Chapter 01 CTA state is missing");
}

if (tarotForBeginners.chapters.length !== 10 || beginnerChapterMetadata.length !== 10) {
  errors.push("data: expected exactly ten chapters");
}
if (new Set(beginnerChapterMetadata.map((chapter) => chapter.id)).size !== 10) {
  errors.push("data: chapter IDs must be unique");
}

const guidedChapters = tarotForBeginners.chapters.filter((chapter) => chapter.academyLesson);
const guidedChambers = guidedChapters.flatMap((chapter) => chapter.academyLesson.chambers);
const allowedChamberVariants = new Set(["split", "map", "editorial", "reveal", "practice", "comparison"]);
const expectedChamberTitles = [
  ["What You Are Looking At", "What the Images Are Saying", "How Meaning Is Created"],
  ["Your Essential Tools", "What Is Optional", "Building Your Practice"],
  ["Readable Imagery", "Structure and Tradition", "Personal Connection"],
  ["Major and Minor Arcana", "The Four Suits", "Numbers and Court Cards"],
  ["Observe Before Defining", "Question and Context", "Synthesis and Interpretation"],
  ["Tradition", "Repeated Myths", "A Grounded Practice"],
  ["Meeting the Deck", "Building Familiarity", "Completing the First Week"],
  ["Pressure and Memorization", "Projection and Certainty", "Sustainable Reading Habits"],
  ["Deck and Structure", "Reading Language", "Practice and Interpretation"],
  ["What You Have Learned", "Choose Your Direction", "Continue Through the Archive"]
];

if (guidedChapters.length !== 10
  || guidedChambers.length !== 30
  || new Set(guidedChambers.map((chamber) => chamber.id)).size !== 30
  || guidedChapters.some((chapter) => chapter.academyLesson.chambers.length !== 3)
  || guidedChapters.some((chapter) => Object.hasOwn(chapter, "visual") || Object.hasOwn(chapter, "blocks"))) {
  errors.push("guided lesson data: all ten chapters must use three unique Chambers with no legacy chapter visual/block model");
}
guidedChapters.forEach((chapter, index) => {
  const lesson = chapter.academyLesson;
  if (JSON.stringify(lesson.chambers.map((chamber) => chamber.title)) !== JSON.stringify(expectedChamberTitles[index])) {
    errors.push(`guided lesson data: approved Chamber sequence is incorrect for ${chapter.id}`);
  }
  if (!Array.isArray(lesson.outcomes) || lesson.outcomes.length < 2
    || !lesson.headerVisual?.slot || !lesson.headerVisual?.alt
    || Object.hasOwn(lesson.headerVisual || {}, "futureSrc")) {
    errors.push(`guided lesson data: entrance outcomes or neutral header placeholder are incomplete for ${chapter.id}`);
  }
  lesson.chambers.forEach((chamber) => {
    if (!allowedChamberVariants.has(chamber.variant)
      || !Array.isArray(chamber.blocks) || chamber.blocks.length < 1
      || !chamber.visual?.slot || !chamber.visual?.alt
      || Object.hasOwn(chamber.visual || {}, "futureSrc")) {
      errors.push(`guided lesson data: reusable variant, content, or neutral visual slot is incomplete for ${chamber.id}`);
    }
  });
});
if (beginnerChapterMetadata.some((chapter) => chapter.chambers?.length !== 3)) {
  errors.push("guided lesson metadata: every chapter must expose its three Chambers to the runtime");
}
if (countMatches(/data-beginner-chapter="/g, html) !== 10
  || countMatches(/data-guided-lesson/g, html) !== 10
  || countMatches(/data-chapter-nav-location="drawer"/g, html) !== 10
  || countMatches(/data-chapter-nav-location="rail"/g, html) !== 0) {
  errors.push("chapters: unified lesson article, All Chapters drawer, or removed sidebar counts are incorrect");
}

const indexPathHtml = html.match(/<aside class="tarot-beginners-index-path"[\s\S]*?<\/aside>/)?.[0] || "";
const indexConstellationHtml = html.match(/<nav class="tarot-beginners-index-constellation"[\s\S]*?<\/nav>/)?.[0] || "";
const indexDotsHtml = html.match(/<div class="tarot-beginners-index-dots"[\s\S]*?<\/div>/)?.[0] || "";
const indexFooterHtml = html.match(/<footer class="tarot-beginners-index-footer">[\s\S]*?<\/footer>/)?.[0] || "";
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
  || countMatches(/data-beginner-index-select="/g, indexConstellationHtml) !== 10
  || countMatches(/data-beginner-index-select="/g, indexDotsHtml) !== 10) {
  errors.push("chapter index: expected ten timeline selectors, ten constellation nodes, and ten mobile dots");
}
if (countMatches(/data-beginner-index-slide="/g, html) !== 10
  || countMatches(/data-beginner-complete-chapter="/g, indexPanelHtml) !== 10
  || countMatches(/data-beginner-index-progress(?:>|\s)/g, html) !== 10
  || countMatches(/data-beginner-index-progress-percent(?:>|\s)/g, html) !== 10) {
  errors.push("chapter index: expected ten preview slides with completion controls and progress displays");
}
if (countMatches(/data-beginner-index-counter>Chapter 1 of 10/g, indexPanelHtml) !== 2
  || countMatches(/data-beginner-index-previous/g, indexPanelHtml) !== 2
  || countMatches(/data-beginner-index-next-control/g, indexPanelHtml) !== 2
  || !html.includes('data-beginner-index-live')) {
  errors.push("chapter index: synchronized desktop/mobile counters, previous/next controls, or live status are missing");
}
if (!indexFooterHtml.includes('<nav class="tarot-beginners-index-constellation" aria-label="Chapter Constellation Rail">')
  || countMatches(/class="tarot-beginners-index-constellation__node"/g, indexConstellationHtml) !== 10
  || countMatches(/class="tarot-beginners-index-constellation__tooltip"/g, indexConstellationHtml) !== 10
  || countMatches(/data-beginner-index-node-icon/g, indexConstellationHtml) !== 10
  || countMatches(/data-beginner-index-active-title/g, indexConstellationHtml) !== 1
  || !indexConstellationHtml.includes('aria-label="Previous chapter" data-beginner-index-previous><span aria-hidden="true">‹</span>')
  || !indexConstellationHtml.includes('aria-label="Next chapter" data-beginner-index-next-control><span aria-hidden="true">›</span>')
  || !generator.includes('              <footer class="tarot-beginners-index-footer">')
  || !/<div class="tarot-beginners-index-preview">[\s\S]*?<footer class="tarot-beginners-index-footer">[\s\S]*?<\/footer>\s*<\/div>\s*<\/div>/.test(indexPanelHtml)) {
  errors.push("chapter index: desktop constellation rail, standalone arrowheads, tooltips, or active title are missing");
}
if (indexPanelHtml.includes("tarot-beginners-index-strip")
  || indexPanelHtml.includes("tarot-beginners-index-position")) {
  errors.push("chapter index: obsolete bottom chapter table and position row must be removed");
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
  const expectedCoverSrc = `/assets/images/tarot_for_beginners/${expectedChapterCoverFiles[chapterIndex]}`;
  if (chapter.coverImage?.src !== expectedCoverSrc
    || chapter.coverImage?.width !== 1122
    || chapter.coverImage?.height !== 1402
    || !chapter.coverImage?.alt?.trim()
    || !existsSync(resolve(rootDir, expectedCoverSrc.replace(/^\/+/, "")))) {
    errors.push(`chapter index: mapped cover image is missing or invalid for ${chapter.id}`);
  }
  const articleStart = chapterArticleStarts[chapterIndex];
  if (articleStart < 0 || articleStart <= previousChapterIndex) {
    errors.push(`chapters: ${chapter.id} is missing or out of order`);
  }
  previousChapterIndex = articleStart;

  const articleEnd = chapterArticleStarts[chapterIndex + 1]
    ?? html.indexOf('<dialog class="tarot-beginners-chapter-menu', articleStart);
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

  const lesson = chapter.academyLesson;
  const expectedLessonCopy = new Set([
    chapter.eyebrow,
    chapter.introduction,
    lesson.title,
    lesson.introContinuation,
    ...lesson.outcomes,
    lesson.takeaway,
    lesson.completionSummary,
    ...lesson.chambers.flatMap((chamber) => [
      chamber.label,
      chamber.shortTitle,
      chamber.title,
      chamber.preview,
      ...chamber.topics,
      chamber.takeaway,
      ...collectStrings(chamber.blocks),
      ...collectStrings(chamber.practice),
      ...collectStrings(chamber.checkpoint)
    ])
  ]);
  const structuralValues = new Set(["features", "paragraphs", "list", "note", "links", "pairs", "timeline", "glossary", "pathways"]);
  [...expectedLessonCopy]
    .filter((text) => text && !structuralValues.has(text) && !/^(?:\/|#)/.test(text))
    .forEach((text) => {
      if (!articleHtml.includes(escapeHtml(text))) {
        errors.push(`guided lesson: visible initial copy is missing from ${chapter.id} (${text})`);
      }
    });

  const indexCardStart = html.indexOf(
    `<article class="tarot-beginners-index-card" id="beginner-index-card-${chapter.id}"`
  );
  const indexCardEnd = indexCardStart >= 0 ? html.indexOf("</article>", indexCardStart) : -1;
  const indexCardHtml = indexCardStart >= 0 && indexCardEnd > indexCardStart
    ? html.slice(indexCardStart, indexCardEnd)
    : "";
  if (!indexCardHtml.includes(`<h3>${escapeHtml(chapter.navLabel)}</h3>`)
    || !indexCardHtml.includes(escapeHtml(chapter.cardSummary))
    || !indexCardHtml.includes(`src="${escapeHtml(chapter.coverImage.src)}"`)
    || !indexCardHtml.includes(`data-beginner-complete-chapter="${chapter.id}"`)
    || !indexCardHtml.includes(`data-beginner-chapter-link="${chapter.id}"`)) {
    errors.push(`chapter index: preview copy, artwork, or actions are incomplete for ${chapter.id}`);
  }
  if (!indexPathHtml.includes(escapeHtml(chapter.navLabel))
    || !indexPathHtml.includes(escapeHtml(chapter.cardSummary))) {
    errors.push(`chapter index: timeline copy is incomplete for ${chapter.id}`);
  }
});

if (countMatches(/data-academy-lesson="/g, html) !== 10
  || countMatches(/data-lesson-chamber="/g, html) !== 30
  || countMatches(/data-chamber-stage="/g, html) !== 30
  || countMatches(/data-chamber-trigger="/g, html) !== 0
  || countMatches(/data-chamber-panel="/g, html) !== 0
  || countMatches(/data-beginner-module="/g, html) !== 0) {
  errors.push("guided lessons: expected ten shared articles, thirty always-visible Chambers/stages, and no legacy modules or accordion panels");
}

guidedChapters.forEach((chapter) => {
  const articleHtml = chapterArticleHtmlById.get(chapter.id) || "";
  const lesson = chapter.academyLesson;
  if (countMatches(/data-lesson-chamber="/g, articleHtml) !== 3
    || countMatches(/data-chamber-stage="/g, articleHtml) !== 3
    || !articleHtml.includes('class="tarot-beginners-chamber-progress"')
    || !articleHtml.includes('class="tarot-beginners-lesson-takeaway"')
    || !articleHtml.includes('class="tarot-beginners-lesson-ending"')) {
    errors.push(`guided lesson: shared Chamber rail, reminder, or ending is incomplete for ${chapter.id}`);
  }

  lesson.chambers.forEach((chamber) => {
    const chamberStart = articleHtml.indexOf(`data-lesson-chamber="${chamber.id}"`);
    const chamberTagStart = chamberStart >= 0 ? articleHtml.lastIndexOf("<section", chamberStart) : -1;
    const chamberHtml = chamberTagStart >= 0
      ? articleHtml.slice(chamberTagStart, articleHtml.indexOf("</section>", chamberTagStart) + 10)
      : "";
    const sectionTag = chamberHtml.match(/^<section\b[^>]*>/)?.[0] || "";
    const stageTag = articleHtml.match(new RegExp(`<button[^>]*aria-controls="${escapeRegExp(chamber.id)}"[^>]*data-chamber-stage="${escapeRegExp(chamber.id)}"[^>]*>`))?.[0] || "";
    const headingId = `${chamber.id}-heading`;
    if (!sectionTag.includes(`id="${chamber.id}"`)
      || !sectionTag.includes(`aria-labelledby="${headingId}"`)
      || !sectionTag.includes(`data-chamber-variant="${chamber.variant}"`)
      || /\b(?:hidden|inert|aria-hidden)\b/.test(sectionTag)
      || !chamberHtml.includes(`<h3 id="${headingId}" data-chamber-title>${escapeHtml(chamber.title)}</h3>`)
      || !stageTag.includes('type="button"')) {
      errors.push(`guided lesson: ${chamber.id} lacks its visible semantic section, H3, variant, or matching rail control`);
    }
  });
});

const placeholderBlocks = [...html.matchAll(/<figure class="[^"]*tarot-beginners-lesson-placeholder[^"]*"[^>]*>[\s\S]*?<\/figure>/g)]
  .map((match) => match[0]);
const expectedPlaceholders = guidedChapters.flatMap((chapter) => [
  chapter.academyLesson.headerVisual,
  ...chapter.academyLesson.chambers.map((chamber) => chamber.visual)
]);
if (placeholderBlocks.length !== 40
  || placeholderBlocks.some((block) => /<img\b|data-future-src|Development visual/i.test(block))) {
  errors.push("guided lesson placeholders: expected forty neutral CSS-only slots with no future image path or development label");
}
expectedPlaceholders.forEach((visual) => {
  const placeholder = placeholderBlocks.find((block) => block.includes(`data-chapter-visual-slot="${escapeHtml(visual.slot)}"`)) || "";
  if (!placeholder.includes(`--lesson-placeholder-ratio:${escapeHtml(visual.ratio)}`)
    || !placeholder.includes(`role="img" aria-label="${escapeHtml(visual.alt)}"`)) {
    errors.push(`guided lesson placeholders: ${visual.slot} lacks its ratio or accessible description`);
  }
});

if (countMatches(/data-beginner-complete-chapter="/g, html) !== 20
  || countMatches(/data-lesson-course-progress(?:>|\s)/g, html) !== 10
  || countMatches(/class="tarot-beginners-lesson-navigation"/g, html) !== 10
  || countMatches(/data-open-chapter-menu/g, html) !== 11
  || !html.includes('class="tarot-beginners-chapter-navigator"')
  || !html.includes('class="tarot-beginners-chapter-menu tarot-beginners-chapter-drawer"')) {
  errors.push("guided lesson completion/navigation: course progress, shared sticky navigator, endings, or All Chapters drawer are incomplete");
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
  "grid-template-columns: minmax(0, 1fr)",
  "width: min(calc(100% - 48px), 960px)",
  ".tarot-faq__divider",
  "display: none"
].forEach((token) => {
  if (!educationCss.includes(token)) errors.push(`FAQ: shared question-ledger style is missing (${token})`);
});

if (!css.includes("#24143f 0%, #321a50 50%, #3a205c 100%")
  || !css.includes("rgba(35, 25, 61, .42)")
  || !css.includes("rgba(15, 11, 29, .68)")) {
  errors.push("themes: Moon mode is missing the approved Moonstone, ledger, or panel palette");
}
[
  [".tarot-beginners-page", ["--guided-nav-bg: rgba(4, 17, 16, .94)", "--guided-path-line: rgba(213, 179, 110, .32)"]],
  [".tarot-beginners-page.moon-mode", ["--guided-nav-bg: rgba(7, 4, 18, .95)", "--guided-path-line: rgba(179, 154, 233, .34)"]],
  [".tarot-beginners-page.blood-moon-mode", ["--guided-nav-bg: rgba(18, 1, 6, .96)", "--guided-path-line: rgba(220, 90, 109, .36)"]],
  [".tarot-beginners-page.blue-moon-mode", ["--guided-nav-bg: rgba(2, 10, 19, .96)", "--guided-path-line: rgba(112, 212, 246, .34)"]]
].forEach(([selector, tokens]) => {
  const ruleBody = getCssRuleBody(css, selector);
  tokens.forEach((token) => {
    if (!ruleBody.includes(token)) errors.push(`guided themes: ${selector} is missing its isolated ${token.split(":")[0]} token`);
  });
});
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
  ...tarotForBeginners.chapters.map((chapter) => (
    [chapter.coverImage.src, [chapter.coverImage.width, chapter.coverImage.height]]
  ))
]);
const beginnerContentImageTags = imageTags.filter((tag) => (
  /\bdata-education-hero-image\b/.test(tag)
  || /class="[^"]*tarot-beginners-index-card__image[^"]*"/.test(tag)
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
  "let chamberObserver = null",
  "academyArticles.forEach((article) =>",
  'const chamberSections = Array.from(article.querySelectorAll("[data-lesson-chamber]"))',
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
  "function observeActiveChapterChambers(",
  "new IntersectionObserver(",
  'rootMargin: "-120px 0px -24% 0px"',
  "function initializeAcademyLessons(",
  "const chamberRoute = chamberRouteById.get(hash)",
  "chapterId: chamberRoute.chapterId",
  "chamberId: hash",
  "requestedChamberId ? `#${requestedChamberId}`",
  'chamber.section.classList.toggle("is-active", active)',
  'chamber.section.classList.toggle("is-completed", completed)',
  'chamber.section.scrollIntoView({\n          block: "start"',
  "chamber.stages[0]?.focus({ preventScroll: true })",
  'const checkpointOption = target.closest("[data-checkpoint-option]")',
  'feedback.textContent = checkpointOption.dataset.checkpointFeedback'
].forEach((token) => {
  if (!js.includes(token)) errors.push(`guided lesson interaction: required scroll-spy, direct route, focus, progress, or checkpoint hook is missing (${token})`);
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
  ".tarot-beginners-index-constellation",
  ".tarot-beginners-index-mobile-nav",
  ".tarot-beginners-index-dots",
  ".tarot-beginners-chapter-navigator",
  ".tarot-beginners-reader__main.tarot-beginners-shell",
  "position: sticky",
  ".tarot-beginners-chapter-drawer",
  ".tarot-beginners-door",
  ".tarot-beginners-lesson-chamber__body",
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
  ".tarot-beginners-academy-introduction__layout",
  ".tarot-beginners-academy-introduction__outcomes",
  ".tarot-beginners-lesson-placeholder",
  "aspect-ratio: var(--lesson-placeholder-ratio, 16 / 9)",
  ".tarot-beginners-chamber-progress",
  ".tarot-beginners-lesson-chamber__heading",
  ".tarot-beginners-lesson-chamber__body",
  ".tarot-beginners-lesson-chamber--map",
  ".tarot-beginners-lesson-visual-tool",
  ".tarot-beginners-guided-practice",
  ".tarot-beginners-checkpoint",
  ".tarot-beginners-lesson-takeaway",
  ".tarot-beginners-lesson-ending",
  ".tarot-beginners-lesson-navigation"
].forEach((token) => {
  if (!css.includes(token)) errors.push(`guided lesson styles: reusable scoped treatment is missing (${token})`);
});
const academyTabletCss = collectCssMediaBlocks(css, "max-width: 1050px");
const academyMobileCss = collectCssMediaBlocks(css, "max-width: 820px");
const academySmallMobileCss = collectCssMediaBlocks(css, "max-width: 520px");
const academyReducedMotionCss = collectCssMediaBlocks(css, "prefers-reduced-motion: reduce");
if (!academyTabletCss.some((block) => block.includes(".tarot-beginners-academy-introduction__layout")
  && block.includes(".tarot-beginners-lesson-chamber__body"))) {
  errors.push("guided lesson responsive: tablet layout must adapt the entrance and Chamber content");
}
if (!academyMobileCss.some((block) => block.includes(".tarot-beginners-academy-lesson")
  && block.includes(".tarot-beginners-lesson-chamber__body")
  && block.includes("grid-template-columns: minmax(0, 1fr)"))) {
  errors.push("guided lesson responsive: mobile layout must stack the lesson and Chamber content at the project breakpoint");
}
if (!academySmallMobileCss.some((block) => block.includes(".tarot-beginners-chapter-navigator")
  && block.includes(".tarot-beginners-lesson-navigation"))) {
  errors.push("guided lesson responsive: small mobile must preserve compact chapter and ending navigation");
}
if (!academyReducedMotionCss.some((block) => (
  block.includes(".tarot-beginners-chapter-navigator > :is(a, button)")
  && block.includes("transition: none !important")
))) {
  errors.push("guided lesson motion: reduced-motion mode must remove navigator and path transitions");
}

[
  "grid-template-columns: minmax(350px, .72fr) minmax(560px, 1.28fr)",
  "grid-template-columns: repeat(10, minmax(0, 1fr))",
  ".tarot-beginners-index-path,\n  .tarot-beginners-index-footer {\n    display: none;",
  ".tarot-beginners-index-constellation__position",
  ".tarot-beginners-index-constellation__rail",
  ".tarot-beginners-index-constellation__node",
  ".tarot-beginners-index-constellation__tooltip",
  ".tarot-beginners-index-constellation__title",
  ".tarot-beginners-index-footer",
  "overflow-x: auto",
  "flex: 0 0 100%",
  "scroll-snap-type: x mandatory",
  "scroll-snap-align: start",
  "scroll-snap-stop: always",
  "-webkit-overflow-scrolling: touch"
].forEach((token) => {
  if (!css.includes(token)) errors.push(`chapter index: desktop path/constellation or native mobile swipe style is missing (${token})`);
});
if (!css.includes("@media (max-width: 820px)")
  || !css.includes("@media (prefers-reduced-motion: reduce)")) {
  errors.push("chapter index: project mobile breakpoint or reduced-motion treatment is missing");
}
const chapterIndexPositionRule = getCssRuleBody(css, ".tarot-beginners-index-constellation__position");
if (!chapterIndexPositionRule.includes("grid-template-columns: 48px minmax(0, 1fr) 48px;")
  || !chapterIndexPositionRule.includes("justify-self: center;")) {
  errors.push("chapter index: constellation previous/count/next row is not centered with accessible touch targets");
}
const chapterIndexFooterRule = getCssRuleBody(css, ".tarot-beginners-index-footer");
if (!chapterIndexFooterRule.includes("width: 100%;")
  || !chapterIndexFooterRule.includes("margin-top: clamp(18px, 2vw, 28px);")) {
  errors.push("chapter index: slim constellation footer must sit directly beneath the selected-card column");
}
const chapterConstellationRule = getCssRuleBody(css, ".tarot-beginners-index-constellation");
if (!chapterConstellationRule.includes("width: 100%;")
  || !chapterConstellationRule.includes("justify-self: center;")) {
  errors.push("chapter index: constellation rail must align beneath the selected chapter card");
}
const chapterConstellationArrowRule = getCssRuleBody(css, ".tarot-beginners-index-constellation__position button");
if (!chapterConstellationArrowRule.includes("width: 48px;")
  || !chapterConstellationArrowRule.includes("height: 44px;")
  || !chapterConstellationArrowRule.includes("border: 0;")
  || !chapterConstellationArrowRule.includes("background: transparent;")
  || !chapterConstellationArrowRule.includes("text-shadow: 0 0 10px var(--chapter-active-glow), 0 0 20px var(--chapter-active-glow-soft);")
  || chapterConstellationArrowRule.includes("border-radius")) {
  errors.push("chapter index: previous/next controls must remain large, standalone, theme-glowing arrowheads without containers");
}
const chapterConstellationRailRule = getCssRuleBody(css, ".tarot-beginners-index-constellation__rail");
const chapterConstellationNodeButtonRule = getCssRuleBody(css, ".tarot-beginners-index-constellation__rail button");
const chapterConstellationActiveNodeRule = getCssRuleBody(css, ".tarot-beginners-index-constellation__rail button.is-active .tarot-beginners-index-constellation__node");
if (!chapterConstellationRailRule.includes("grid-template-columns: repeat(10, minmax(0, 1fr));")
  || !chapterConstellationNodeButtonRule.includes("min-height: 48px;")
  || !chapterConstellationNodeButtonRule.includes("background: transparent;")
  || !chapterConstellationActiveNodeRule.includes("background: var(--chapter-active-line);")
  || !chapterConstellationActiveNodeRule.includes("box-shadow: 0 0 0 6px var(--chapter-active-glow-soft), 0 0 20px var(--chapter-active-glow);")) {
  errors.push("chapter index: ten-node rail, accessible node targets, or theme-aware active glow is incomplete");
}
if (!css.includes(".tarot-beginners-index-constellation__rail button:is(:hover, :focus-visible) .tarot-beginners-index-constellation__tooltip")
  || css.includes(".tarot-beginners-index-strip")
  || css.includes(".tarot-beginners-index-position")) {
  errors.push("chapter index: focus-revealed node tooltips are required and obsolete table selectors must be absent");
}
if (!js.includes('const indexCounters = Array.from(root.querySelectorAll("[data-beginner-index-counter]"))')
  || !js.includes('const indexActiveTitles = Array.from(root.querySelectorAll("[data-beginner-index-active-title]"))')
  || !js.includes("indexCounters.forEach((counter) =>")
  || !js.includes("indexActiveTitles.forEach((title) =>")
  || !js.includes("indexPreviousControls.forEach((control) =>")
  || !js.includes("indexNextControls.forEach((control) =>")) {
  errors.push("chapter index: constellation title plus desktop and mobile controls must share the selected chapter state");
}
const chapterIndexMobileLayoutCss = collectCssMediaBlocks(css, "max-width: 820px");
if (!chapterIndexMobileLayoutCss.some((block) => (
  /\.tarot-beginners-index-track\s*\{[^}]*display:\s*flex;[^}]*width:\s*100%;/s.test(block)
  && /\.tarot-beginners-index-card\s*\{[^}]*flex:\s*0 0 100%;/s.test(block)
))) {
  errors.push("chapter index: mobile track must use definite, non-shrinking one-card flex slides");
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
  errors.push("chapter index sizing: the selected chapter preview must remain fluid and centered");
}
const chapterIndexDesktopCss = collectCssMediaBlocks(css, "min-width: 1181px");
if (!chapterIndexDesktopCss.some((block) => (
  /\.tarot-beginners-index-preview\s*\{[^}]*width:\s*90%;[^}]*max-width:\s*780px;[^}]*justify-self:\s*center;/s.test(block)
))) {
  errors.push("chapter index sizing: large desktop must align and cap the selected preview and its constellation rail at 90% and 780px");
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
  "function renderGuidedPractice(",
  "function renderKnowledgeCheckpoint(",
  "function renderLessonTakeaway(",
  "function renderChapterEnding(",
  "function renderAcademyChapter(",
  '`${chapter.id}-lesson-takeaway-heading`',
  '`${chapter.id}-lesson-ending-heading`',
  "return renderAcademyChapter(chapter)",
  "lesson.chambers.map(renderLessonChamber)",
  'renderChapterLink(chapter, "drawer")'
].forEach((token) => {
  if (!generator.includes(token)) errors.push(`guided lesson architecture: reusable generator seam is missing (${token})`);
});

if (!generator.includes("beginnerChapterMetadata")
  || !generator.includes("page.chapters.map(renderChapter)")
  || !generator.includes("function renderChapterIndex(page)")
  || !generator.includes("function renderIndexTimelineItem(")
  || !generator.includes("function renderIndexPreview(")
  || !generator.includes("function renderIndexConstellationNode(")
  || !generator.includes("function renderIndexDot(")
  || !generator.includes("page.chapters.map(renderIndexTimelineItem)")
  || !generator.includes("renderIndexPreview(chapter, index, total)")
  || !generator.includes("page.chapters.map(renderIndexConstellationNode)")
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

console.log("Validated Tarot for Beginners: ten unified Doors, thirty Chambers, drawer navigation, scroll-spy, completion, history, SEO, accessibility, themes, motion, and responsive hooks.");
