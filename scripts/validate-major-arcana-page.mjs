import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { majorArcanaPage } from "../data/major-arcana.mjs";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { SITE_ORIGIN } from "./card-page-helpers.mjs";
import {
  buildMajorArcanaCards,
  getMajorArcanaOutputPath,
  getMajorArcanaRoute,
  validateMajorArcanaData
} from "./major-arcana-page-helpers.mjs";
import { validateRenderedTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = getMajorArcanaOutputPath(rootDir, majorArcanaPage);
const route = getMajorArcanaRoute(majorArcanaPage);
const canonical = `${SITE_ORIGIN}${route}`;
const errors = validateMajorArcanaData(majorArcanaPage, tarotCardDetails, { rootDir, checkGenerated: true });

if (!existsSync(outputPath)) {
  errors.push(`route: generated page is missing at ${outputPath}`);
} else {
  const html = readFileSync(outputPath, "utf8");
  const css = readFileSync(resolve(rootDir, "css/tarot-major-arcana.css"), "utf8");
  const educationCss = readFileSync(resolve(rootDir, "css/tarot-education-components.css"), "utf8");
  const educationJs = readFileSync(resolve(rootDir, "js/tarot-education.js"), "utf8");
  const js = readFileSync(resolve(rootDir, "js/tarot-major-arcana.js"), "utf8");
  const hubScript = readFileSync(resolve(rootDir, "js/tarot.js"), "utf8");
  const sitemap = readFileSync(resolve(rootDir, "sitemap.xml"), "utf8");
  const cards = buildMajorArcanaCards(majorArcanaPage, tarotCardDetails);
  const countMatches = (pattern, value = html) => (value.match(pattern) || []).length;
  validateRenderedTarotEducationNavigation(html, { activeKey: "major-arcana", rootDir })
    .forEach((error) => errors.push(`education navigation: ${error}`));

  const parseSchema = (id) => {
    const match = html.match(new RegExp(`<script id="${id}" type="application/ld\\+json">([\\s\\S]*?)<\\/script>`));
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${id}: invalid JSON-LD (${error.message})`);
      return null;
    }
  };

  if (countMatches(/<h1(?:\s|>)/g) !== 1) errors.push("headings: expected exactly one H1");
  if (html.includes('name="robots" content="noindex') || html.includes('content="noindex')) {
    errors.push("seo: page must remain indexable");
  }
  if (!html.includes(`<title>${majorArcanaPage.seo.title.replaceAll("&", "&amp;")}</title>`)) {
    errors.push("seo: title does not match the requested page title");
  }
  if (!html.includes(`content="${majorArcanaPage.seo.description}"`)) errors.push("seo: meta description is missing");
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) errors.push("seo: canonical route is incorrect");
  [
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image:width" content="${majorArcanaPage.hero.image.width}" />`,
    `<meta property="og:image:height" content="${majorArcanaPage.hero.image.height}" />`,
    '<meta name="twitter:card" content="summary_large_image" />'
  ].forEach((token) => {
    if (!html.includes(token)) errors.push(`seo: social metadata is missing (${token})`);
  });

  const breadcrumb = parseSchema("major-arcana-breadcrumb-schema");
  const webPage = parseSchema("major-arcana-webpage-schema");
  const faqPage = parseSchema("major-arcana-faq-schema");
  if (breadcrumb?.["@type"] !== "BreadcrumbList" || breadcrumb?.itemListElement?.length !== 3) {
    errors.push("schema: BreadcrumbList must include Home, Tarot, and Major Arcana");
  }
  if (webPage?.["@type"] !== "WebPage" || webPage?.url !== canonical) {
    errors.push("schema: WebPage is missing or has the wrong canonical URL");
  }
  if (faqPage?.["@type"] !== "FAQPage") {
    errors.push("schema: visible FAQ must have matching FAQPage data");
  } else {
    const schemaItems = faqPage.mainEntity || [];
    if (schemaItems.length !== majorArcanaPage.faq.items.length) errors.push("schema: FAQ item count is incorrect");
    majorArcanaPage.faq.items.forEach((item, index) => {
      if (schemaItems[index]?.name !== item.question || schemaItems[index]?.acceptedAnswer?.text !== item.answer) {
        errors.push(`schema: FAQ item ${index + 1} does not match visible content`);
      }
    });
  }
  if (/"@type":"(?:Product|Review|Course|Article)"/.test(html)) {
    errors.push("schema: unsupported Product, Review, Course, or Article schema is present");
  }

  const requiredHeadings = [
    "Explore the 22 Major Arcana Cards",
    "What Is the Major Arcana?",
    "Understanding the Fool’s Journey",
    "Upright and Reversed Major Arcana Meanings",
    "How Major Arcana Cards Work in Readings",
    "Major Arcana vs. Minor Arcana",
    "Major Arcana Frequently Asked Questions"
  ];
  let previousHeadingIndex = -1;
  requiredHeadings.forEach((heading) => {
    const index = html.indexOf(`>${heading}</h2>`);
    if (index < 0) errors.push(`headings: missing H2 "${heading}"`);
    if (index >= 0 && index < previousHeadingIndex) errors.push(`headings: "${heading}" is out of order`);
    previousHeadingIndex = Math.max(previousHeadingIndex, index);
  });

  if (countMatches(/data-major-card-slide/g) !== 22) errors.push("carousel: expected 22 semantic card slides");
  if (countMatches(/data-major-number="/g) !== 22) errors.push("carousel: expected 22 number buttons");
  if (countMatches(/data-major-card-link/g) !== 22) errors.push("carousel: expected 22 full-meaning links");
  if (!html.includes('data-major-previous disabled><span aria-hidden="true">‹</span>')) {
    errors.push("carousel: previous control must use the shared tailless chevron");
  }
  if (!html.includes('data-major-next><span aria-hidden="true">›</span>')) {
    errors.push("carousel: next control must use the shared tailless chevron");
  }
  cards.forEach((card, index) => {
    [
      card.title,
      card.summary,
      ...card.keywords,
      `href="${card.route}"`,
      `Explore ${card.title}’s Full Meaning`
    ].forEach((token) => {
      if (!html.includes(token)) errors.push(`card ${index}: required visible content or route is missing (${token})`);
    });
    if (!existsSync(resolve(rootDir, card.route.replace(/^\/+/, ""), "index.html"))) {
      errors.push(`card ${index}: linked meaning page does not exist at ${card.route}`);
    }
  });
  if (countMatches(/class="major-arcana-slide__image"/g) !== 22) {
    errors.push("carousel: all 22 card artworks must have initial HTML image elements");
  }
  if (countMatches(/class="major-arcana-slide__image"[\s\S]*?loading="lazy"/g) < 19) {
    errors.push("performance: below-fold carousel images must lazy-load");
  }
  if (!html.includes("major-arcana-hero__image") || !html.includes('loading="eager" decoding="async" fetchpriority="high"')) {
    errors.push("performance: hero image must load eagerly with priority");
  }
  if (
    !html.includes('class="major-arcana-closing__image"') ||
    !html.includes(`data-standard-src="${majorArcanaPage.closingCta.image.src}"`) ||
    !html.includes(`data-blood-src="${majorArcanaPage.closingCta.image.bloodMoonSrc}"`)
  ) {
    errors.push("closing banner: standard and Blood Moon image mappings are missing");
  }
  const heroStageIndex = html.indexOf("major-arcana-hero__stage");
  const heroTitleIndex = html.indexOf('id="major-arcana-title"');
  const heroImageIndex = html.indexOf("major-arcana-hero__visual");
  const heroBandIndex = html.indexOf("major-arcana-hero__content-band");
  const heroIntroductionIndex = html.indexOf('class="major-arcana-hero__introduction"');
  const heroFactsIndex = html.indexOf('class="major-arcana-hero__facts"');
  const heroCtaIndex = html.indexOf(`href="${majorArcanaPage.hero.ctaTarget}">${majorArcanaPage.hero.ctaLabel}`);
  if ([heroStageIndex, heroTitleIndex, heroImageIndex, heroBandIndex, heroIntroductionIndex, heroFactsIndex, heroCtaIndex].some((index) => index < 0)) {
    errors.push("hero: required title stage or lower editorial band is missing");
  } else {
    if (!(heroStageIndex < heroTitleIndex && heroStageIndex < heroImageIndex && heroImageIndex < heroBandIndex)) {
      errors.push("hero: title and image must remain in the cinematic top stage");
    }
    if (!(heroBandIndex < heroIntroductionIndex && heroBandIndex < heroFactsIndex && heroBandIndex < heroCtaIndex)) {
      errors.push("hero: paragraphs, facts, and CTA must remain in the lower editorial band");
    }
  }
  if (html.includes('class="major-arcana-hero__copy"')) {
    errors.push("hero: obsolete combined title-and-copy block must not return");
  }

  const foundationsStart = html.indexOf('<section class="major-arcana-section major-arcana-overview major-arcana-foundations"');
  const foundationsEnd = foundationsStart >= 0 ? html.indexOf("</section>", foundationsStart) : -1;
  const foundationsHtml = foundationsStart >= 0 && foundationsEnd > foundationsStart ? html.slice(foundationsStart, foundationsEnd) : "";
  const foundationsText = foundationsHtml.replace(/<[^>]+>/g, "");
  majorArcanaPage.overview.paragraphs.forEach((paragraph) => {
    if (!foundationsText.includes(paragraph)) errors.push("overview: explanatory copy must remain in the initial HTML");
  });
  if (
    countMatches(/class="major-arcana-section major-arcana-overview major-arcana-foundations"/g) !== 1 ||
    !foundationsHtml.includes('id="what-is-the-major-arcana"') ||
    (foundationsHtml.match(/class="major-arcana-foundations__card major-arcana-foundations__card--/g) || []).length !== 3 ||
    (foundationsHtml.match(/class="major-arcana-foundations__number"/g) || []).length !== 3 ||
    (foundationsHtml.match(/data-major-theme-image/g) || []).length !== 3
  ) {
    errors.push("overview: expected one uniquely scoped Foundations section with three themed image cards");
  }
  majorArcanaPage.overview.highlights.forEach((highlight) => {
    if (!foundationsHtml.includes(`<span class="major-arcana-foundations__highlight">${highlight}</span>`)) {
      errors.push(`overview: highlighted phrase is missing (${highlight})`);
    }
  });
  majorArcanaPage.overview.concepts.forEach((concept) => {
    const targetId = concept.route.startsWith("#") ? concept.route.slice(1) : "";
    if (
      !foundationsHtml.includes(concept.title) ||
      !foundationsHtml.includes(concept.copy) ||
      !foundationsHtml.includes(`href="${concept.route}"`) ||
      !foundationsHtml.includes(`data-standard-src="${concept.image.src}"`) ||
      !foundationsHtml.includes(`data-blood-src="${concept.image.bloodMoonSrc}"`) ||
      !targetId ||
      !html.includes(`id="${targetId}"`)
    ) {
      errors.push(`overview: interactive concept content or asset mapping is missing for ${concept.title}`);
    }
  });

  if (countMatches(/data-major-journey-panel/g) !== 3 || countMatches(/data-major-journey-tab="/g) !== 3) {
    errors.push("journey: expected three semantic chapter tabs and panels");
  }
  if (
    !html.includes("Select a chapter to explore the journey") ||
    countMatches(/class="major-arcana-journey__cue"/g) !== 3 ||
    countMatches(/data-major-chapter-open="/g) !== 3
  ) {
    errors.push("journey: chapter controls must expose a visible interaction hint, cue, and Explore action");
  }
  const codexStart = html.indexOf('<dialog class="major-chapter-codex"');
  const codexEnd = codexStart >= 0 ? html.indexOf("</dialog>", codexStart) : -1;
  const codexHtml = codexStart >= 0 && codexEnd > codexStart ? html.slice(codexStart, codexEnd) : "";
  if (
    !codexHtml ||
    (codexHtml.match(/data-major-chapter-codex-panel="/g) || []).length !== 3 ||
    (codexHtml.match(/data-major-chapter-close/g) || []).length !== 3 ||
    (codexHtml.match(/data-major-chapter-nav="/g) || []).length !== 6
  ) {
    errors.push("journey codex: expected one native dialog with three complete chapter views and navigation");
  }
  majorArcanaPage.journey.chapters.forEach((chapter) => {
    [
      chapter.copy,
      chapter.cards,
      ...chapter.preview,
      ...chapter.themes,
      ...chapter.story,
      chapter.centralLesson,
      ...chapter.cardRoles,
      chapter.inReading
    ].forEach((content) => {
      if (!html.includes(content)) errors.push(`journey: missing chapter content for ${chapter.title}`);
    });
    chapter.cardSortOrders.forEach((sortOrder) => {
      const card = cards.find((candidate) => candidate.sortOrder === sortOrder);
      if (!card || !codexHtml.includes(`href="${card.route}"`)) {
        errors.push(`journey codex: missing live card route for chapter ${chapter.number}, card ${sortOrder}`);
      }
    });
  });
  if (!html.includes(majorArcanaPage.journey.clarification)) errors.push("journey: historical clarification is missing");

  [majorArcanaPage.orientation.upright, majorArcanaPage.orientation.reversed].forEach((state) => {
    if (!html.includes(state.copy) || !html.includes(state.subtitle) || !html.includes(state.emblem)) {
      errors.push(`orientation: ${state.label} editorial content is missing from initial HTML`);
    }
    state.themes.forEach((theme) => {
      if (!html.includes(theme)) errors.push(`orientation: theme is missing (${theme})`);
    });
  });
  const orientationStart = html.indexOf('<section class="major-arcana-section major-arcana-orientation"');
  const orientationEnd = orientationStart >= 0 ? html.indexOf("</section>", orientationStart) : -1;
  const orientationHtml = orientationStart >= 0 && orientationEnd > orientationStart ? html.slice(orientationStart, orientationEnd) : "";
  if (
    countMatches(/data-major-orientation-option/g) !== 2 ||
    !orientationHtml.includes('id="upright-and-reversed"') ||
    (orientationHtml.match(/aria-controls="major-orientation-(?:upright|reversed)"/g) || []).length !== 2 ||
    !orientationHtml.includes('class="major-arcana-orientation__caption" aria-live="polite"') ||
    !orientationHtml.includes("Wheel of Fortune shown <span data-major-orientation-caption>upright</span>") ||
    !orientationHtml.includes("Tarot Reversals Guide · Coming Soon")
  ) {
    errors.push("orientation: scoped toggle, live caption, or guide status is incomplete");
  }

  const readingsStart = html.indexOf('<section class="major-arcana-readings"');
  const readingsEnd = readingsStart >= 0 ? html.indexOf("</section>", readingsStart) : -1;
  const readingsHtml = readingsStart >= 0 && readingsEnd > readingsStart ? html.slice(readingsStart, readingsEnd) : "";
  if (
    !readingsHtml.includes('class="major-arcana-readings__concepts"') ||
    !readingsHtml.includes('class="major-arcana-reading-example"') ||
    (readingsHtml.match(/<article>/g) || []).length !== 3 ||
    (readingsHtml.match(/<figure class="/g) || []).length !== 3
  ) {
    errors.push("readings: expected the restored three concepts and compact three-card reading example");
  }
  if (
    readingsHtml.includes("major-arcana-readings__layout") ||
    readingsHtml.includes("major-arcana-readings__editorial") ||
    readingsHtml.includes("major-arcana-readings__accent")
  ) {
    errors.push("readings: mistaken editorial-card redesign wrappers must not remain");
  }
  majorArcanaPage.readings.concepts.forEach((concept) => {
    if (!readingsHtml.includes(concept.number) || !readingsHtml.includes(concept.title) || !readingsHtml.includes(concept.copy)) {
      errors.push(`readings: preserved concept is missing for ${concept.title}`);
    }
  });
  [
    majorArcanaPage.readings.example.copy,
    majorArcanaPage.readings.example.note
  ].forEach((content) => {
    if (!readingsHtml.includes(content)) errors.push("readings: educational example copy must remain in the initial HTML");
  });

  const comparisonStart = html.indexOf('<section class="major-arcana-section major-minor-showcase"');
  const comparisonEnd = comparisonStart >= 0 ? html.indexOf("</section>", comparisonStart) : -1;
  const comparisonHtml = comparisonStart >= 0 && comparisonEnd > comparisonStart ? html.slice(comparisonStart, comparisonEnd) : "";
  if (
    countMatches(/class="major-arcana-section major-minor-showcase"/g) !== 1 ||
    !comparisonHtml.includes('id="major-vs-minor"') ||
    !comparisonHtml.includes("Major Arcana vs. Minor Arcana") ||
    !comparisonHtml.includes(majorArcanaPage.comparison.introduction) ||
    (comparisonHtml.match(/data-major-minor-tab="/g) || []).length !== 2 ||
    (comparisonHtml.match(/data-major-minor-panel="/g) || []).length !== 2 ||
    (comparisonHtml.match(/data-major-minor-card="/g) || []).length !== 8 ||
    (comparisonHtml.match(/data-major-minor-dot="/g) || []).length !== 8 ||
    (comparisonHtml.match(/data-major-theme-image/g) || []).length !== 8 ||
    (comparisonHtml.match(/<li>/g) || []).length !== 8 ||
    !comparisonHtml.includes("<strong>78 Cards</strong>") ||
    !comparisonHtml.includes("One Complete System")
  ) {
    errors.push("comparison: expected one scoped toggle showcase with two complete panels and eight themed cards");
  }
  [
    ['id="major-minor-major-tab"', 'aria-controls="major-minor-major-panel"', 'aria-selected="true"'],
    ['id="major-minor-minor-tab"', 'aria-controls="major-minor-minor-panel"', 'aria-selected="false"'],
    ['id="major-minor-major-panel"', 'aria-labelledby="major-minor-major-tab"', 'aria-hidden="false"'],
    ['id="major-minor-minor-panel"', 'aria-labelledby="major-minor-minor-tab"', 'aria-hidden="true"', " inert"]
  ].forEach((tokens) => {
    if (!tokens.every((token) => comparisonHtml.includes(token))) {
      errors.push(`comparison: tab or panel accessibility mapping is incomplete (${tokens[0]})`);
    }
  });
  [majorArcanaPage.comparison.major, majorArcanaPage.comparison.minor].forEach((group) => {
    [group.eyebrow, group.title, group.number, group.numberLabel, group.supportingLabel, group.copy, ...group.items.slice(1)].forEach((content) => {
      if (!comparisonHtml.includes(content)) errors.push(`comparison: preserved content is missing for ${group.title}`);
    });
    group.cardTitles.forEach((title) => {
      const card = tarotCardDetails.find((candidate) => candidate.title === title);
      if (
        !card ||
        !comparisonHtml.includes(`<figcaption>${title}</figcaption>`) ||
        !comparisonHtml.includes(`data-standard-src="${card.variants.veilrise.image}"`) ||
        !comparisonHtml.includes(`data-blood-src="${card.variants.veilfall.image}"`)
      ) {
        errors.push(`comparison: canonical Veilrise/Veilfall card mapping is missing for ${title}`);
      }
    });
  });
  if (
    !comparisonHtml.includes(majorArcanaPage.comparison.supporting) ||
    !comparisonHtml.includes(majorArcanaPage.comparison.minorStatus) ||
    !comparisonHtml.includes(`href="${majorArcanaPage.comparison.major.route}"`) ||
    !comparisonHtml.includes(majorArcanaPage.comparison.major.routeLabel) ||
    !comparisonHtml.includes(`href="${majorArcanaPage.comparison.minor.route}"`) ||
    !comparisonHtml.includes(majorArcanaPage.comparison.minor.routeLabel) ||
    !html.includes(`id="${majorArcanaPage.comparison.major.route.slice(1)}"`)
  ) {
    errors.push("comparison: live Major/Minor routes or explanatory statement are incorrect");
  }
  if (
    comparisonHtml.includes("major-vs-minor-comparison__") ||
    comparisonHtml.includes("major-arcana-comparison__") ||
    comparisonHtml.includes("major-minor-showcase__orbit")
  ) {
    errors.push("comparison: obsolete three-column celestial-balance markup must be removed");
  }
  if (
    (comparisonHtml.match(/data-major-minor-previous/g) || []).length !== 2 ||
    (comparisonHtml.match(/data-major-minor-next/g) || []).length !== 2 ||
    (comparisonHtml.match(/data-major-minor-card-status/g) || []).length !== 2 ||
    (comparisonHtml.match(/loading="lazy"/g) || []).length < 8 ||
    (comparisonHtml.match(/width="1024" height="1536"/g) || []).length < 8 ||
    (comparisonHtml.match(/sizes="\(max-width: 768px\) 64vw, \(max-width: 1100px\) 28vw, 285px"/g) || []).length !== 8
  ) {
    errors.push("comparison: slideshow controls, live regions, or responsive lazy image metadata are incomplete");
  }

  if (!html.includes("Tarot Spreads · Coming Soon") || /href="\/tarot\/spreads\/?"/.test(html)) {
    errors.push("routes: missing Tarot Spreads page must remain an honest non-link status");
  }
  if (
    !html.includes(`href="${majorArcanaPage.comparison.minor.route}"`) ||
    !existsSync(resolve(rootDir, majorArcanaPage.comparison.minor.route.replace(/^\/+/, ""), "index.html"))
  ) {
    errors.push("routes: completed Minor Arcana education page must have a live link");
  }
  if (!html.includes('href="/tarot"') || !html.includes('href="/"')) {
    errors.push("internal links: Tarot index or reading destination is missing");
  }
  if (/href="(?:#|javascript:void\\(0\\)|\/coming-soon)"/.test(html)) {
    errors.push("internal links: placeholder href found");
  }

  if (countMatches(/data-education-faq-button/g) !== 6
    || countMatches(/data-education-faq-item/g) !== 6
    || countMatches(/class="tarot-faq__answer"/g) !== 6) {
    errors.push("faq: expected six visible button-and-answer records");
  }
  majorArcanaPage.faq.items.forEach((item) => {
    if (!html.includes(item.question) || !html.includes(item.answer)) errors.push(`faq: visible content is missing for ${item.question}`);
  });
  [
    "[data-education-faq]",
    "setItemState",
    'button.setAttribute("aria-expanded", String(isOpen))',
    'answer.setAttribute("aria-hidden", String(!isOpen))',
    "answer.inert = !isOpen"
  ].forEach((token) => {
    if (!educationJs.includes(token)) errors.push(`faq interaction: required shared behavior is missing (${token})`);
  });
  if (html.includes('class="major-arcana-visually-hidden" aria-live="polite"') === false) {
    errors.push("accessibility: carousel live status must use the scoped visually hidden utility");
  }

  [
    "setCarouselState",
    "scrollToSlide",
    "data-major-card-select",
    "data-major-number",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "setJourneyChapter",
    "setCodexChapter",
    "showModal",
    "data-major-chapter-open",
    "data-major-chapter-close",
    "data-major-chapter-nav",
    "aria-current",
    "major-chapter-modal-open",
    "setOrientation",
    "reducedMotionQuery",
    "astralVeilBloodMoonChange",
    "tabindex",
    "inert"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`interaction: required behavior is missing (${token})`);
  });

  [
    ".major-arcana-hero",
    ".major-arcana-carousel",
    "scroll-snap-type: x mandatory",
    ".major-arcana-slide.is-active",
    ".major-arcana-number-nav",
    ".major-arcana-foundations",
    ".major-arcana-foundations__connections",
    ".major-arcana-foundations__card-link",
    ".major-arcana-journey",
    ".major-arcana-journey__cue",
    ".major-arcana-journey__explore",
    ".major-chapter-codex",
    ".major-chapter-codex::backdrop",
    ".major-chapter-codex__navigation",
    ".major-arcana-orientation",
    ".major-arcana-readings",
    ".major-minor-showcase",
    ".major-arcana-faq",
    ".major-arcana-closing",
    ".major-arcana-visually-hidden",
    "body.sun-mode.tarot-major-arcana-page",
    "body.moon-mode.tarot-major-arcana-page",
    "body.blood-moon-mode.tarot-major-arcana-page",
    "@media (max-width: 768px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`styles: required responsive or themed treatment is missing (${token})`);
  });

  [
    ["page wrapper", /\.major-arcana-page\s*\{[^}]*background:\s*transparent;/],
    ["primary archive wrapper", /\.major-arcana-archive\s*\{[^}]*background:\s*transparent;/],
    ["lower archive wrapper", /\.major-arcana-archive--lower\s*\{[^}]*background:\s*transparent;/],
    ["content sections", /\.major-arcana-section\s*\{[^}]*background:\s*transparent;/],
    ["hero base", /\.major-arcana-hero\s*\{[^}]*background:\s*transparent;/],
    ["hero editorial band", /\.major-arcana-hero__content-band\s*\{[^}]*background:\s*transparent;/],
    ["reading guidance section", /\.major-arcana-readings\s*\{[^}]*background:\s*transparent;/]
  ].forEach(([label, pattern]) => {
    if (!pattern.test(css)) errors.push(`styles: ${label} must reveal the global Astral Veil theme background`);
  });

  if (css.includes("--major-bg")) {
    errors.push("styles: obsolete Major Arcana page-background variables must not replace the global theme");
  }
  if (/body\.(?:sun|moon|blood-moon)-mode\.tarot-major-arcana-page\s*\{[^}]*background\s*:/.test(css)) {
    errors.push("styles: Major Arcana must not override the site-wide body background in any theme");
  }
  if (
    !/\.major-arcana-foundations\s*\{[^}]*grid-template-columns:\s*minmax\(0, 40fr\) minmax\(560px, 60fr\)/s.test(css) ||
    !/\.major-arcana-foundations \.major-arcana-foundations__card--1\s*\{[^}]*top:\s*0;[^}]*left:\s*50%/s.test(css) ||
    !/\.major-arcana-foundations \.major-arcana-foundations__card--2\s*\{[^}]*bottom:\s*0;[^}]*left:\s*0/s.test(css) ||
    !/\.major-arcana-foundations \.major-arcana-foundations__card--3\s*\{[^}]*right:\s*0;[^}]*bottom:\s*0/s.test(css)
  ) {
    errors.push("styles: Foundations must retain its editorial-left and triangular three-card composition");
  }
  if (
    /^\s*\.major-arcana-foundations__(?:[a-z-]+)/m.test(css) ||
    !/\.major-arcana-foundations\s*\{[^}]*background:\s*transparent;/s.test(css)
  ) {
    errors.push("styles: all Foundations additions must remain scoped and the section background must stay transparent");
  }
  if (
    !/@media \(max-width: 768px\)[\s\S]*?\.major-arcana-foundations \.major-arcana-foundations__cards\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory;/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.major-arcana-foundations \.major-arcana-foundations__connections\s*\{[^}]*display:\s*none;/s.test(css)
  ) {
    errors.push("styles: Foundations cards need a bounded mobile swipe layout without connection overflow");
  }
  const journeyTabBlock = css.match(/\.major-arcana-journey__tab\s*\{([^}]*)\}/)?.[1] || "";
  if (!journeyTabBlock.includes("cursor: pointer") || !css.includes(".major-arcana-journey__tab.is-active::after")) {
    errors.push("styles: chapter selectors must visibly communicate interaction and selection");
  }
  const codexBlock = css.match(/\.major-chapter-codex\s*\{([^}]*)\}/)?.[1] || "";
  if (!codexBlock.includes("max-height: 86dvh") || !codexBlock.includes("overflow: hidden")) {
    errors.push("styles: Chapter Codex must remain bounded within the desktop viewport");
  }
  if (
    !/body\.major-chapter-modal-open\s*\{[^}]*overflow:\s*hidden/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.major-chapter-codex\s*\{[^}]*height:\s*100dvh/s.test(css)
  ) {
    errors.push("styles: Chapter Codex is missing scroll lock or mobile viewport containment");
  }
  if (/\.major-arcana-journey\s*\{[^}]*min-height:\s*100(?:d?vh|svh|lvh)/s.test(css)) {
    errors.push("styles: Fool’s Journey must not use a viewport-height section");
  }
  if (
    /^\s*\.major-arcana-orientation__(?:[a-z-]+)/m.test(css) ||
    !/\.major-arcana-orientation \.major-arcana-orientation__card-frame\s*\{[^}]*transform:\s*translateY\(var\(--orientation-lift\)\) scale\(var\(--orientation-scale\)\)/s.test(css) ||
    !/\.major-arcana-orientation \.major-arcana-orientation__card-image\s*\{[^}]*transform:\s*rotate\(var\(--orientation-rotation\)\)/s.test(css) ||
    !/\.major-arcana-orientation\[data-orientation="reversed"\] \.major-arcana-orientation__card-image\s*\{[^}]*--orientation-rotation:\s*180deg/s.test(css)
  ) {
    errors.push("styles: orientation transforms must remain scoped with frame motion separated from artwork rotation");
  }
  if (
    /\.major-arcana-orientation__card\.is-reversed \.major-arcana-orientation__card-frame/.test(css) ||
    /prefers-reduced-motion[\s\S]*?major-arcana-orientation__card-image\s*\{[^}]*transform:\s*none/s.test(css)
  ) {
    errors.push("styles: reversed artwork rotation must not be cancelled by frame or reduced-motion rules");
  }
  if (
    !/@media \(max-width: 768px\)[\s\S]*?\.major-arcana-orientation\.is-enhanced \.major-arcana-orientation__state:not\(\.is-active\)\s*\{[^}]*display:\s*none/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.major-arcana-orientation \.major-arcana-orientation__state ul\s*\{[^}]*grid-template-columns:\s*1fr/s.test(css)
  ) {
    errors.push("styles: orientation section is missing its compact, switch-accessible mobile treatment");
  }
  if (
    !js.includes("orientationTransitioning") ||
    !js.includes("pendingOrientation") ||
    !js.includes('orientationRoot.setAttribute("aria-busy", "true")') ||
    js.includes('classList.toggle("is-reversed"')
  ) {
    errors.push("interaction: orientation transitions need rapid-input protection without rotating the outer frame");
  }
  if (
    /^\s*\.major-minor-showcase__(?:[a-z-]+)/m.test(css) ||
    !/\.major-minor-showcase\s*\{[^}]*background:\s*transparent;/s.test(css) ||
    !/\.major-minor-showcase \.major-minor-showcase__panel\s*\{[^}]*grid-template-columns:\s*minmax\(340px, \.84fr\) minmax\(480px, 1\.16fr\)/s.test(css) ||
    !/\.major-minor-showcase \.major-minor-showcase__viewport\s*\{[^}]*display:\s*grid;[^}]*overflow:\s*(?:hidden|clip)/s.test(css) ||
    !/\.major-minor-showcase \.major-minor-showcase__panel\s*\{[^}]*grid-area:\s*1 \/ 1/s.test(css)
  ) {
    errors.push("styles: comparison must stay scoped, transparent, stable, and use the requested editorial/card proportions");
  }
  if (
    css.includes(".major-vs-minor-comparison") ||
    css.includes(".major-arcana-comparison__grid") ||
    css.includes(".major-arcana-comparison__column") ||
    !css.includes('.major-minor-showcase[data-mode="minor"] .major-minor-showcase__toggle-indicator') ||
    !css.includes('.major-minor-showcase .major-minor-showcase__card[data-position="0"]')
  ) {
    errors.push("styles: obsolete celestial-balance rules must be removed and the toggle/card stack preserved");
  }
  if (
    !/@media \(max-width: 768px\)[\s\S]*?\.major-minor-showcase \.major-minor-showcase__panel\s*\{[^}]*grid-template-columns:\s*1fr/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.major-minor-showcase \.major-minor-showcase__track\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.major-minor-showcase \.major-minor-showcase__card,[\s\S]*?width:\s*clamp\(190px, 64vw, 260px\)/s.test(css)
  ) {
    errors.push("styles: comparison needs a stacked, bounded mobile scroll-snap layout");
  }
  [
    "setMajorMinorMode",
    "setShowcaseCard",
    "scheduleActiveShowcase",
    "majorMinorTransitioning",
    "queuedMajorMinorMode",
    "pointerPaused",
    "focusPaused",
    "visibilitychange",
    "mobileQuery.matches",
    "reducedMotionQuery.matches",
    'majorMinorRoot.setAttribute("aria-busy", "true")'
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`interaction: Major/Minor showcase behavior is missing (${token})`);
  });
  if (
    !/\.major-arcana-readings__concepts\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s.test(css) ||
    !/\.major-arcana-reading-example\s*\{[^}]*grid-template-columns:\s*minmax\(340px, 52fr\) minmax\(0, 48fr\)/s.test(css) ||
    !/\.major-arcana-reading-example__spread\s*\{[^}]*width:\s*min\(100%, 520px\)/s.test(css)
  ) {
    errors.push("styles: readings section must retain its restored concept row and compact reading example");
  }
  const readingsWrapperBlock = css.match(/\.major-arcana-readings\s*\{([^}]*)\}/)?.[1] || "";
  if (
    !readingsWrapperBlock.includes("background: transparent") ||
    /\.major-arcana-readings::(?:before|after)/.test(css) ||
    /\.major-arcana-reading-example__spread::(?:before|after)/.test(css)
  ) {
    errors.push("styles: readings section must not introduce a replacement background or decorative geometry behind the cards");
  }
  if (
    css.includes(".major-arcana-readings__layout") ||
    css.includes(".major-arcana-readings__editorial") ||
    css.includes(".major-arcana-readings__accent")
  ) {
    errors.push("styles: mistaken readings redesign selectors must be fully removed");
  }
  const sharedHeroBlock = educationCss.match(/body\.tarot-meanings-page \.tarot-education-page > \.tarot-education-hero\[data-education-page\]\s*\{([^}]*)\}/)?.[1] || "";
  const sharedHeroStageBlock = educationCss.match(/\.tarot-education-hero\[data-education-page\] \.tarot-education-hero__stage\s*\{([^}]*)\}/)?.[1] || "";
  const sharedHeroImageBlock = educationCss.match(/\[data-education-hero-image\]\s*\{([^}]*)\}/)?.[1] || "";
  if (!sharedHeroBlock.includes("--education-hero-height: clamp(540px, 56vw, 640px)")
    || !sharedHeroBlock.includes("display: flex")
    || !sharedHeroStageBlock.includes("flex: 1 1 auto")
    || !sharedHeroStageBlock.includes("min-height: 0")) {
    errors.push("styles: education hero must match the How to Read Tarot stage geometry");
  }
  if (!sharedHeroImageBlock.includes("width: 100%")
    || !sharedHeroImageBlock.includes("height: 100%")
    || !sharedHeroImageBlock.includes("object-fit: cover")
    || sharedHeroImageBlock.includes("object-fit: contain")
    || !educationCss.includes("#000 80%, rgba(0, 0, 0, .92) 90%, transparent 100%")) {
    errors.push("styles: shared hero image must be full-bleed and dissolve into the supporting row");
  }
  const heroIntroSecondParagraphBlock = css.match(/\.major-arcana-hero__introduction p \+ p\s*\{([^}]*)\}/)?.[1] || "";
  if (/border-(?:left|top)\s*:/.test(heroIntroSecondParagraphBlock)) {
    errors.push("styles: hero introduction columns must use spacing instead of divider lines");
  }
  const heroMetaBlock = css.match(/\.major-arcana-hero__meta\s*\{([^}]*)\}/)?.[1] || "";
  if (/border-top\s*:/.test(heroMetaBlock)) {
    errors.push("styles: hero facts and CTA row must not be separated by a horizontal rule");
  }
  [
    ["Sun", /body\.sun-mode\.tarot-major-arcana-page \.major-arcana-hero__content-band \.major-arcana-button\s*\{[^}]*color:\s*#[0-3][0-9a-f]{5}/i],
    ["Moon", /body\.moon-mode\.tarot-major-arcana-page \.major-arcana-hero__content-band \.major-arcana-button\s*\{[^}]*color:\s*#[0-3][0-9a-f]{5}/i],
    ["Blood Moon", /body\.blood-moon-mode\.tarot-major-arcana-page \.major-arcana-hero__content-band \.major-arcana-button\s*\{[^}]*color:\s*#ff[0-9a-f]{4}[^}]*background:\s*linear-gradient\([^}]*#[0-5][0-9a-f]{5}/i]
  ].forEach(([theme, pattern]) => {
    if (!pattern.test(css)) errors.push(`styles: Explore the 22 Cards CTA is missing its ${theme} contrast treatment`);
  });
  if (
    !/\.major-arcana-closing \.major-arcana-closing__action--primary:focus-visible\s*\{[^}]*color:\s*#20180e;[^}]*background:\s*linear-gradient\(135deg, #efd28b, #c89a43\)/s.test(css)
  ) {
    errors.push("styles: bright closing-banner CTA must override inherited anchor color with dark readable text");
  }
  const carouselControlBlock = css.match(/\.major-arcana-carousel-control\s*\{([^}]*)\}/)?.[1] || "";
  ["border: 0", "border-radius: 0", "background: transparent", "box-shadow: none"].forEach((token) => {
    if (!carouselControlBlock.includes(token)) errors.push(`styles: tailless carousel control is missing (${token})`);
  });
  if (!css.includes(".major-arcana-carousel-control span")) {
    errors.push("styles: carousel chevron must use the shared glyph treatment");
  }

  const hubRecord = hubScript.match(/\{ key: "major-arcana"[\s\S]*?\},/);
  if (!hubRecord) {
    errors.push("hub tile: Major Arcana guide record is missing");
  } else {
    if (!hubRecord[0].includes('route: "/tarot/major-arcana/"')) errors.push("hub tile: clean route is incorrect");
    if (!hubRecord[0].includes("available: true")) errors.push("hub tile: completed page remains unavailable");
    if (!hubRecord[0].includes('ctaLabel: "Explore the Major Arcana"')) errors.push("hub tile: descriptive CTA is missing");
  }

  if (countMatches(new RegExp(`<loc>${canonical}</loc>`, "g"), sitemap) !== 1) {
    errors.push("sitemap: expected exactly one canonical Major Arcana URL");
  }
}

if (errors.length) {
  console.error(`Major Arcana validation failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("Major Arcana validation passed for the education page and all 22 card routes.");
}
