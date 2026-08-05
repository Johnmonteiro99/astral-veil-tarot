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
if (educationDestinations.length !== 8
  || !educationDestinations.includes("/how-to-read-tarot-cards")
  || !educationDestinations.includes("/tarot/for-beginners")) {
  errors.push("Tarot education navigation: expected eight live destinations including Beginners and How to Read Tarot");
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

const ethicsMarkup = extractRequired(
  /<section class="htr-ethics"[\s\S]*?>([\s\S]*?)<\/section>/,
  "Ethics and Boundaries section"
);
const ethicsPrinciples = [
  "Tarot offers interpretation, not guaranteed certainty.",
  "Be honest about ambiguity and reader bias.",
  "Respect privacy, consent, and personal agency.",
  "Do not use readings to control others or replace professional care."
];
const ethicsDisclaimer = [
  "Tarot readings and educational content on Astral Veil are offered for entertainment and personal reflection.",
  "They are not a substitute for professional medical, legal, financial, or mental-health advice."
];

if ((ethicsMarkup.match(/class="htr-ethics__principle"/g) || []).length !== ethicsPrinciples.length
  || (ethicsMarkup.match(/class="htr-ethics__marker" aria-hidden="true">0[1-4] <i>✦<\/i><\/span>/g) || []).length !== ethicsPrinciples.length) {
  errors.push("Ethics and Boundaries section: expected four informational compass principles");
}
[...ethicsPrinciples, ...ethicsDisclaimer].forEach((copy) => {
  if (!ethicsMarkup.includes(copy)) errors.push(`Ethics and Boundaries section: preserved copy is missing (${copy})`);
});
if (!ethicsMarkup.includes('class="htr-ethics__compass" aria-hidden="true"')
  || !ethicsMarkup.includes('class="htr-ethics__disclaimer"')
  || !ethicsMarkup.includes('class="htr-ethics__disclaimer-mark" aria-hidden="true"')
  || /<(?:a|button)\b/.test(ethicsMarkup)) {
  errors.push("Ethics and Boundaries section: editorial compass or non-interactive semantics are incomplete");
}
[
  ".htr-ethics__principles {",
  "grid-template-columns: repeat(2,minmax(0,1fr))",
  ".htr-ethics__principle {",
  "border: 0; border-radius: 18px",
  ".htr-ethics__disclaimer {",
  "border-radius: 0; background: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none",
  ".htr-ethics::before { position: absolute; z-index: 0; inset: -10% 0",
  "background: radial-gradient(ellipse at 18% 38%",
  ".how-to-read-page.moon-mode .htr-ethics",
  ".how-to-read-page.blood-moon-mode .htr-ethics",
  ".how-to-read-page.blue-moon-mode .htr-ethics",
  ".htr-learning-thread::before",
  ".htr-ethics__principles { grid-template-columns: 1fr; }"
].forEach((token) => {
  if (!pageStyles.includes(token)) errors.push(`Ethics and Boundaries section: required responsive or theme treatment is missing (${token})`);
});
const ethicsOuterDeclarations = pageStyles.match(/\.htr-ethics\s*\{([^}]*)\}/)?.[1] || "";
if (/overflow\s*:\s*clip/.test(ethicsOuterDeclarations)
  || /background\s*:(?!\s*transparent)/.test(ethicsOuterDeclarations)) {
  errors.push("Ethics and Boundaries section: outer container must remain transparent and unclipped");
}

const pageDividerRules = [
  ["Tarot learning path", pageStyles.match(/\.tarot-learning-path\s*\{([^}]*)\}/)?.[1] || ""],
  ["constellation map", pageStyles.match(/\.htr-constellation\s*\{([^}]*)\}/)?.[1] || ""],
  ["Ethics and Boundaries section", pageStyles.match(/\.htr-ethics\s*\{([^}]*)\}/)?.[1] || ""]
];
pageDividerRules.forEach(([label, declarations]) => {
  if (/(?:border-top|border-bottom|border-block)\s*:/.test(declarations)) {
    errors.push(`${label}: page-width chapter divider must remain removed`);
  }
});
if (/<hr\b/i.test(pageSource)) errors.push("page structure: full-width HR divider must remain removed");

const learningPathOuterDeclarations = pageDividerRules[0][1];
[
  /border\s*:\s*0/,
  /border-radius\s*:\s*0/,
  /background\s*:\s*transparent/,
  /box-shadow\s*:\s*none/,
  /backdrop-filter\s*:\s*none/,
  /-webkit-backdrop-filter\s*:\s*none/
].forEach((pattern) => {
  if (!pattern.test(learningPathOuterDeclarations)) {
    errors.push(`Tarot learning path: outer panel reset is missing (${pattern})`);
  }
});
if (!pageStyles.includes(".tarot-learning-path::before, .tarot-learning-path::after { content: none; }")) {
  errors.push("Tarot learning path: wrapper pseudo-elements must remain neutralized");
}

[
  "padding: clamp(64px, 7vw, 96px) 0 clamp(54px, 6vw, 78px)",
  "margin-bottom: clamp(28px, 3vw, 38px)",
  "padding: clamp(16px, 2vw, 24px) 0 clamp(12px, 1.5vw, 20px)",
  ".tarot-learning-path { padding-block: 48px 60px; }"
].forEach((token) => {
  if (!pageStyles.includes(token)) errors.push(`Tarot learning path: compact responsive spacing is missing (${token})`);
});
if (!pageStyles.includes("min-height: clamp(430px, 42vw, 520px)")) {
  errors.push("Tarot learning path: controlled constellation height or star geometry changed");
}

const learningThreadMarkup = extractRequired(
  /<section class="htr-study htr-learning-thread"[\s\S]*?<nav class="htr-learning-thread__map"[^>]*>([\s\S]*?)<\/nav>/,
  "Follow the Thread learning path"
);
const learningThreadDestinations = [
  ["/tarot/major-arcana/", "01", "Study the Major Arcana", "Explore archetypes and larger turning points."],
  ["/tarot/minor-arcana/", "02", "Understand the Minor Arcana", "Learn suits, numbers, and court cards."],
  ["/tarot-spreads/", "03", "Learn How Spread Positions Work", "Choose a layout that matches your question."],
  ["/tarot/the-fool/", "04", "Explore Individual Card Meanings", "Begin with The Fool’s full interpretation."]
];

if (JSON.stringify(extractDestinations(learningThreadMarkup)) !== JSON.stringify(learningThreadDestinations.map(([route]) => normalizeNavPath(route)))) {
  errors.push("Follow the Thread learning path: destination order or routes changed");
}
if ((learningThreadMarkup.match(/class="htr-learning-thread__item /g) || []).length !== learningThreadDestinations.length
  || (learningThreadMarkup.match(/class="htr-learning-thread__top"/g) || []).length !== learningThreadDestinations.length
  || (learningThreadMarkup.match(/class="htr-learning-thread__arrow" aria-hidden="true"/g) || []).length !== learningThreadDestinations.length
  || (learningThreadMarkup.match(/class="htr-learning-thread__underline" aria-hidden="true"/g) || []).length !== learningThreadDestinations.length) {
  errors.push("Follow the Thread learning path: expected four complete underlined destination anchors");
}
learningThreadDestinations.forEach(([route, number, title, description]) => {
  [
    `href="${route}"`,
    `class="htr-learning-thread__number">${number}</span>`,
    `class="htr-learning-thread__title">${title}</span>`,
    `class="htr-learning-thread__description">${description}</span>`
  ].forEach((token) => {
    if (!learningThreadMarkup.includes(token)) errors.push(`Follow the Thread learning path: destination is incomplete (${title})`);
  });
});
[
  'class="htr-learning-thread__underline" aria-hidden="true"',
  ".htr-learning-thread__map {",
  "grid-template-columns: repeat(2,minmax(0,1fr))",
  ".htr-learning-thread__underline {",
  ".htr-learning-thread__underline::after {",
  "transform: scaleX(.28)",
  ".htr-learning-thread__item:focus-visible",
  ".how-to-read-page.moon-mode .htr-study",
  ".how-to-read-page.blood-moon-mode .htr-study",
  ".how-to-read-page.blue-moon-mode .htr-study",
  "@media (max-width: 900px)",
  ".htr-learning-thread__map { grid-template-columns: minmax(0,1fr)",
  "@media (prefers-reduced-motion: reduce)"
].forEach((token) => {
  const source = token.startsWith("class=") ? learningThreadMarkup : pageStyles;
  if (!source.includes(token)) errors.push(`Follow the Thread learning path: required semantic or responsive treatment is missing (${token})`);
});
[
  "<svg",
  "htr-learning-thread__line",
  "htr-learning-thread__path",
  "htr-learning-thread__node",
  "htr-learning-thread__spark"
].forEach((token) => {
  if (learningThreadMarkup.includes(token)) errors.push(`Follow the Thread learning path: obsolete connector markup remains (${token})`);
});
[
  ".htr-learning-thread__line",
  ".htr-learning-thread__path",
  ".htr-learning-thread__node",
  ".htr-learning-thread__spark",
  "--thread-progress",
  "stroke-dasharray: var(--thread-progress)",
  ".htr-learning-thread__map:has("
].forEach((token) => {
  if (pageStyles.includes(token)) errors.push(`Follow the Thread learning path: obsolete connector styling remains (${token})`);
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
  "class=\"htr-constellation__mobile-path htr-celestial-spine\"",
  "aria-hidden=\"true\" focusable=\"false\" data-mobile-celestial-spine"
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

const curriculumLessonIds = [
  "prepare-the-reading",
  "form-the-question",
  "read-the-imagery",
  "understand-suit-and-number",
  "interpret-the-position",
  "upright-and-reversed",
  "connect-the-cards",
  "reflect-and-integrate",
  "guided-practice"
];

if ((pageSource.match(/\bdata-course-lesson="[0-8]"/g) || []).length !== curriculumLessonIds.length) {
  errors.push("adaptive curriculum: the static Beginner fallback must retain all nine lessons");
}

curriculumLessonIds.forEach((id) => {
  if (!pageSource.includes(`id="${id}"`) || !pageScript.includes(`id: "${id}"`)) {
    errors.push(`adaptive curriculum: static or centralized lesson is missing (${id})`);
  }
});

const curriculumExpression = pageScript.match(/const tarotCurriculum = ([\s\S]*?);\n  const tarotLessons =/);
if (!curriculumExpression) {
  errors.push("adaptive curriculum: centralized lesson model could not be read");
} else {
  try {
    const curriculum = Function(`"use strict"; return (${curriculumExpression[1]});`)();
    const requiredVariantFields = ["eyebrow", "summary", "introduction", "coreIdea", "explanation", "steps", "practiceLabel", "practice", "guidance"];
    const expectedTracks = { beginner: "Foundations", intermediate: "Connection", advanced: "Synthesis" };
    Object.entries(expectedTracks).forEach(([level, track]) => {
      if (curriculum.levels?.[level]?.track !== track) errors.push(`adaptive curriculum: ${level} track must be ${track}`);
    });
    if (curriculum.lessons?.length !== curriculumLessonIds.length) {
      errors.push(`adaptive curriculum: expected nine centralized lessons, found ${curriculum.lessons?.length || 0}`);
    }
    curriculumLessonIds.forEach((id, lessonIndex) => {
      const lesson = curriculum.lessons?.[lessonIndex];
      if (lesson?.id !== id) errors.push(`adaptive curriculum: lesson order mismatch at ${id}`);
      Object.keys(expectedTracks).forEach((level) => {
        const variant = lesson?.levels?.[level];
        requiredVariantFields.forEach((field) => {
          if (!variant?.[field] || (Array.isArray(variant[field]) && !variant[field].length)) {
            errors.push(`adaptive curriculum: ${id} ${level} is missing ${field}`);
          }
        });
      });
    });
    const expectedPracticeSizes = { beginner: 3, intermediate: 5, advanced: 7 };
    Object.entries(expectedPracticeSizes).forEach(([level, size]) => {
      const practice = curriculum.lessons?.[8]?.levels?.[level]?.guidedPractice;
      if (practice?.cardKeys?.length !== size || practice?.positions?.length !== size) {
        errors.push(`adaptive curriculum: ${level} guided practice must use ${size} cards and positions`);
      }
      if (!practice?.prompts?.length || !practice?.insight) {
        errors.push(`adaptive curriculum: ${level} guided practice prompts or example are missing`);
      }
    });
    if (curriculum.levels?.beginner?.hintsOpen !== true
      || curriculum.levels?.intermediate?.hintsOpen !== false
      || curriculum.levels?.advanced?.hintsOpen !== false) {
      errors.push("adaptive curriculum: hint defaults do not match the three learning levels");
    }
    if (curriculum.levels?.beginner?.revealRequiresInput !== false
      || curriculum.levels?.intermediate?.revealRequiresInput !== true
      || curriculum.levels?.advanced?.revealRequiresInput !== true) {
      errors.push("adaptive curriculum: example reveal requirements do not match the three learning levels");
    }
  } catch (error) {
    errors.push(`adaptive curriculum: centralized model is not evaluable (${error.message})`);
  }
}

const staticIds = [...pageSource.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(staticIds.filter((id, index) => staticIds.indexOf(id) !== index))];
if (duplicateIds.length) {
  errors.push(`adaptive curriculum: duplicate static IDs found (${duplicateIds.join(", ")})`);
}

[
  "const tarotCurriculum = Object.freeze({",
  "const tarotLessons = tarotCurriculum.lessons;",
  "astralVeilTarotLearningLevel",
  "function renderAdaptiveCurriculum(level, options = {})",
  "function renderLessonVariant(article, lesson, level)",
  "function configureGuidedPractice(config)",
  "function levelVariant(lesson, level = activeLevel)",
  "history.replaceState(history.state",
  "window.scrollTo({ top: scrollY",
  "if (adaptiveUiReady) renderAdaptiveCurriculum(level, { animate: changed, announce: changed });",
  "guidance.open = profile.hintsOpen;",
  "practiceRevealButton.disabled = !ready;",
  "setReflectionStage(selectedReflectionStage);"
].forEach((token) => {
  if (!pageScript.includes(token)) errors.push(`adaptive curriculum: required behavior is missing (${token})`);
});

if (pageScript.includes("location.reload(")) {
  errors.push("adaptive curriculum: level switching must not reload the page");
}

[
  "Learn the full reading process from the ground up with clear explanations and guided examples.",
  "Strengthen your readings by connecting imagery, positions, patterns, and card relationships across a full spread.",
  "Synthesize symbolism, context, contradiction, and intuition into nuanced readings that remain grounded and ethically clear."
].forEach((description) => {
  if (!pageSource.includes(description) || !pageScript.includes(description)) {
    errors.push(`adaptive curriculum: selector description is not shared with the enhancement model (${description})`);
  }
});

[
  'role="tablist" aria-label="Tarot reading learning level"',
  'aria-live="polite" aria-atomic="true" data-learning-level-announcer',
  'data-level-panel="beginner"',
  'data-level-panel="intermediate" hidden inert',
  'data-level-panel="advanced" hidden inert'
].forEach((token) => {
  if (!pageSource.includes(token)) errors.push(`adaptive curriculum: selector accessibility or static fallback is missing (${token})`);
});

[
  'cardKeys: ["sixCups", "strength", "threeWands"]',
  'positions: ["Past", "Present", "Future"]',
  'cardKeys: ["star", "moon", "twoSwords", "strength", "threeWands"]',
  'positions: ["Present Situation", "Underlying Influence", "Challenge", "Advice", "Direction"]',
  'cardKeys: ["moon", "threeCups", "sixCups", "twoSwords", "strength", "star", "threeWands"]',
  'positions: ["Core Situation", "Visible Influence", "Hidden Influence", "Central Tension", "Available Resource", "Responsible Action", "Possible Direction"]',
  "No single synthesis is the only correct answer"
].forEach((token) => {
  if (!pageScript.includes(token) && !pageSource.includes(token)) {
    errors.push(`adaptive curriculum: guided practice configuration is incomplete (${token})`);
  }
});

[
  ".htr-adaptive-curriculum {",
  ".htr-adaptive-curriculum__guidance summary:focus-visible",
  ".htr-practice__cards[data-card-count=\"5\"]",
  ".htr-practice__cards[data-card-count=\"7\"]",
  "@keyframes htr-level-content-in",
  ".htr-course-lesson.is-level-updating, .htr-lesson-preview.is-level-updating",
  ".htr-button[data-practice-reveal]:disabled"
].forEach((token) => {
  if (!pageStyles.includes(token)) errors.push(`adaptive curriculum: required responsive or motion styling is missing (${token})`);
});

const spiralMarkupChecks = [
  [/data-learning-map-layout(?=[\s>])/g, 1, "one learning-map layout"],
  [/data-lesson-stars(?=[\s>])/g, 1, "one semantic lesson-star list"],
  [/data-spiral-map-svg(?=[\s>])/g, 1, "one decorative spiral SVG"],
  [/data-spiral-path-base(?=[\s>])/g, 1, "one spiral base path"],
  [/data-spiral-path-progress(?=[\s>])/g, 1, "one spiral progress path"],
  [/data-mobile-celestial-spine(?=[\s>])/g, 1, "one decorative mobile celestial-spine SVG"],
  [/data-lesson-preview(?=[\s>])/g, 1, "one shared lesson preview"],
  [/data-open-preview(?=[\s>])/g, 1, "one shared Open Lesson control"],
  [/data-map-panel-begin(?=[\s>])/g, 1, "one desktop Begin control"],
  [/data-map-panel-continue(?=[\s>])/g, 1, "one desktop Continue control"],
  [/data-map-progress-dots(?=[\s>])/g, 1, "one progress-dot list"]
];

spiralMarkupChecks.forEach(([pattern, expectedCount, label]) => {
  const count = (pageSource.match(pattern) || []).length;
  if (count !== expectedCount) errors.push(`spiral map: expected ${label}, found ${count}`);
});

const spiralSvgMarkup = extractRequired(
  /<svg class="htr-constellation__lines htr-spiral-map__svg"[\s\S]*?>([\s\S]*?)<\/svg>/,
  "Spiral of Understanding SVG"
);
if (!pageSource.includes('class="htr-constellation__lines htr-spiral-map__svg"')
  || !pageSource.includes("data-spiral-map-svg")
  || !pageSource.includes('aria-hidden="true" data-spiral-map-svg')
  || /<(?:a|button|text)\b/.test(spiralSvgMarkup)) {
  errors.push("spiral map: the inline SVG must remain decorative and contain no text or controls");
}
const celestialSpineSvgMarkup = extractRequired(
  /<svg class="htr-constellation__mobile-path htr-celestial-spine"[\s\S]*?data-mobile-celestial-spine>([\s\S]*?)<\/svg>/,
  "Mobile celestial-spine SVG"
);
if (!pageSource.includes('viewBox="0 0 360 720"')
  || !pageSource.includes('aria-hidden="true" focusable="false" data-mobile-celestial-spine')
  || /<(?:a|button|text)\b/.test(celestialSpineSvgMarkup)
  || !celestialSpineSvgMarkup.includes('class="htr-celestial-spine__geometry"')
  || !celestialSpineSvgMarkup.includes('class="htr-celestial-spine__orbits"')
  || !celestialSpineSvgMarkup.includes('class="htr-celestial-spine__stations"')
  || !celestialSpineSvgMarkup.includes('class="htr-celestial-spine__channel"')
  || !celestialSpineSvgMarkup.includes('class="htr-celestial-spine__sigils"')
  || /htr-energy-body|__figure/.test(celestialSpineSvgMarkup)) {
  errors.push("spiral map: the mobile celestial-spine SVG must remain abstract, decorative, and free of figures, controls, or text");
}
[
  "#e991ff", "#a76cff", "#6867ff", "#45adff", "#52d68d",
  "#f2cc55", "#ff963f", "#ef4c5c", "#f8f6ff"
].forEach((color) => {
  if (!celestialSpineSvgMarkup.includes(`stop-color="${color}"`)) {
    errors.push(`spiral map: mobile celestial channel is missing ${color}`);
  }
});
if (!/<aside class="htr-lesson-preview htr-learning-map-panel"[^>]*aria-labelledby="lesson-preview-title"/.test(pageSource)
  || !/class="htr-learning-map-panel__content" aria-live="polite" aria-atomic="true"/.test(pageSource)) {
  errors.push("spiral map: the reused lesson panel is missing its label or polite live region");
}

const spiralParametersExpression = pageScript.match(/const spiralPathParameters = ([\s\S]*?);\n  const spiralLessonLayout/);
const spiralLayoutExpression = pageScript.match(/const spiralLessonLayout = ([\s\S]*?);\n  const fallbackConstellationPath/);
const lessonMapVisualsExpression = pageScript.match(/const lessonMapVisuals = ([\s\S]*?);\n  const spiralPathParameters/);
if (!spiralParametersExpression || !spiralLayoutExpression) {
  errors.push("spiral map: editable geometry configuration is missing");
} else {
  try {
    const parameters = Function(`"use strict"; return (${spiralParametersExpression[1]});`)();
    const layout = Function(`"use strict"; return (${spiralLayoutExpression[1]});`)();
    if (!(parameters.turns >= 2.25 && parameters.turns <= 2.6)
      || !(parameters.startRadius > parameters.endRadius)
      || !(parameters.samples >= 120 && parameters.samples <= 600)) {
      errors.push("spiral map: turns, radii, or sample count are outside the requested safe range");
    }
    const entries = Object.values(layout);
    if (entries.length !== 9) errors.push(`spiral map: expected nine node configurations, found ${entries.length}`);
    entries.forEach((entry, index) => {
      if (!Number.isFinite(entry.progress) || !Number.isFinite(entry.labelX) || !Number.isFinite(entry.labelY)
        || !["left", "center", "right"].includes(entry.align)) {
        errors.push(`spiral map: Lesson ${index + 1} has an invalid node configuration`);
      }
      if (index > 0 && entry.progress <= entries[index - 1].progress) {
        errors.push(`spiral map: Lesson ${index + 1} must progress farther inward than the prior lesson`);
      }
    });
    if (entries[0]?.progress > .08 || entries[8]?.progress !== 1) {
      errors.push("spiral map: Lesson 01 must begin near the outer start and Lesson 09 must end at the center");
    }

    const geometryPoints = [];
    for (let index = 0; index <= parameters.samples; index += 1) {
      const progress = index / parameters.samples;
      const angle = parameters.startAngle + progress * parameters.turns * Math.PI * 2;
      const radius = parameters.startRadius + (parameters.endRadius - parameters.startRadius) * progress;
      geometryPoints.push({
        x: parameters.centerX + Math.cos(angle) * radius,
        y: parameters.centerY + Math.sin(angle) * radius * parameters.verticalScale
      });
    }
    if (geometryPoints.some((point) => point.x < 0 || point.x > 940 || point.y < 0 || point.y > 720)) {
      errors.push("spiral map: generated geometry leaves the 940 by 720 viewBox");
    }
    const pathLengths = [0];
    for (let index = 1; index < geometryPoints.length; index += 1) {
      pathLengths[index] = pathLengths[index - 1] + Math.hypot(
        geometryPoints[index].x - geometryPoints[index - 1].x,
        geometryPoints[index].y - geometryPoints[index - 1].y
      );
    }
    const totalLength = pathLengths.at(-1);
    const pointAtProgress = (progress) => {
      const targetLength = totalLength * progress;
      let index = pathLengths.findIndex((length) => length >= targetLength);
      if (index <= 0) return geometryPoints[0];
      const segmentLength = pathLengths[index] - pathLengths[index - 1] || 1;
      const segmentProgress = (targetLength - pathLengths[index - 1]) / segmentLength;
      return {
        x: geometryPoints[index - 1].x + (geometryPoints[index].x - geometryPoints[index - 1].x) * segmentProgress,
        y: geometryPoints[index - 1].y + (geometryPoints[index].y - geometryPoints[index - 1].y) * segmentProgress
      };
    };
    const centerPoint = pointAtProgress(entries[8].progress);
    if (Math.hypot(centerPoint.x - parameters.centerX, centerPoint.y - parameters.centerY) > 1) {
      errors.push("spiral map: Lesson 09 does not resolve to the configured center point");
    }

    [1728, 1440, 1366, 1280, 1180, 1179, 1024, 980].forEach((viewportWidth) => {
      const shellWidth = Math.min(1240, viewportWidth - 64);
      const layoutGap = Math.min(44, Math.max(30, viewportWidth * .03));
      const mapWidth = viewportWidth >= 1180
        ? shellWidth - 320 - layoutGap
        : Math.min(940, shellWidth);
      const mapHeight = mapWidth * 720 / 940;
      const labelWidth = viewportWidth >= 1180
        ? Math.min(158, Math.max(136, viewportWidth * .115))
        : Math.min(176, Math.max(142, viewportWidth * .14));
      const conservativeLabelHeight = 68;
      const rectangles = entries.map((entry, index) => {
        const point = pointAtProgress(entry.progress);
        const centerX = point.x / 940 * mapWidth;
        const centerY = point.y / 720 * mapHeight;
        const left = entry.align === "left"
          ? centerX + entry.labelX
          : entry.align === "right" ? centerX + entry.labelX - labelWidth : centerX - labelWidth / 2;
        const top = entry.align === "center"
          ? centerY + entry.labelY
          : centerY + entry.labelY - conservativeLabelHeight / 2;
        return { index, left, right: left + labelWidth, top, bottom: top + conservativeLabelHeight };
      });
      rectangles.forEach((rectangle, index) => {
        rectangles.slice(index + 1).forEach((candidate) => {
          const overlaps = rectangle.left < candidate.right
            && rectangle.right > candidate.left
            && rectangle.top < candidate.bottom
            && rectangle.bottom > candidate.top;
          if (overlaps) {
            errors.push(`spiral map: conservative label geometry overlaps at ${viewportWidth}px (Lessons ${rectangle.index + 1} and ${candidate.index + 1})`);
          }
        });
      });
    });
  } catch (error) {
    errors.push(`spiral map: geometry configuration is not evaluable (${error.message})`);
  }
}

if (!lessonMapVisualsExpression) {
  errors.push("spiral map: shared chakra color and mobile-position configuration is missing");
} else {
  try {
    const visuals = Function(`"use strict"; return (${lessonMapVisualsExpression[1]});`)();
    const expectedEnergy = ["Soul Star", "Crown", "Third Eye", "Throat", "Heart", "Solar Plexus", "Sacral", "Root", "Integration / Earth Star"];
    if (visuals.length !== 9) errors.push(`spiral map: expected nine chakra-inspired visual configurations, found ${visuals.length}`);
    visuals.forEach((visual, index) => {
      if (visual.energy !== expectedEnergy[index]
        || visual.colorVar !== `--lesson-node-${String(index + 1).padStart(2, "0")}`
        || visual.mobileX !== 50
        || !Number.isFinite(visual.mobileY)
        || !["left", "right"].includes(visual.mobileSide)
        || !visual.shortTitle) {
        errors.push(`spiral map: Lesson ${index + 1} has an invalid energy, color, position, side, or short label`);
      }
      if (index > 0 && visual.mobileY <= visuals[index - 1].mobileY) {
        errors.push(`spiral map: Lesson ${index + 1} must sit below the previous mobile energy node`);
      }
      if (index > 0 && visual.mobileSide === visuals[index - 1].mobileSide) {
        errors.push(`spiral map: Lesson ${index + 1} must alternate label sides on mobile`);
      }
    });
    if (visuals[0]?.mobileY > 5 || visuals[8]?.mobileY < 92) {
      errors.push("spiral map: the mobile path must begin near the top and end near the bottom of the celestial spine");
    }
  } catch (error) {
    errors.push(`spiral map: shared visual configuration is not evaluable (${error.message})`);
  }
}

[
  "function createSpiralPath({ centerX, centerY, startRadius, endRadius, turns, startAngle, verticalScale, samples })",
  "spiralPathBase.getTotalLength()",
  "spiralPathBase.getPointAtLength(measuredLength * configuration.progress)",
  "point.x / spiralViewBox.width * 100",
  "point.y / spiralViewBox.height * 100",
  "spiralPathBase.setAttribute(\"d\", path);",
  "spiralPathProgress.setAttribute(\"d\", path);",
  "spiralResizeObserver = new ResizeObserver(() => scheduleSpiralLayout());",
  "document.fonts?.ready?.then(() => scheduleSpiralLayout(true))",
  "const desktopSpiralViewport = window.matchMedia(\"(min-width: 980px)\")",
  "const mobileTravelViewport = window.matchMedia(\"(max-width: 979px)\")",
  "const fallbackConstellationPath = spiralPathBase?.getAttribute(\"d\")",
  "function restoreLegacyConstellation()",
  "const markerRect = marker.getBoundingClientRect()",
  "const mapRect = constellationMap.getBoundingClientRect()",
  "mapPanelBeginButton?.addEventListener(\"click\", () => travelToLesson(0, mapPanelBeginButton))",
  "mapPanelContinueButton?.addEventListener(\"click\", () => travelToLesson(lastVisitedIndex >= 0 ? lastVisitedIndex : 0, mapPanelContinueButton))",
  "selectLesson(0);",
  "lessons explored",
  "dot.setAttribute(\"aria-current\", \"step\")",
  "function updateStarAccessibility(button, index)",
  "button.setAttribute(\"aria-current\", \"step\")",
  "button.classList.toggle(\"is-completed\", completed)",
  "--active-lesson-color"
].forEach((token) => {
  if (!pageScript.includes(token)) errors.push(`spiral map: required geometry, state, or navigation behavior is missing (${token})`);
});

if (pageScript.includes('addEventListener("scroll"') || (pageScript.match(/new ResizeObserver/g) || []).length !== 1) {
  errors.push("spiral map: layout must use one ResizeObserver and no scroll-driven recalculation");
}

[
  "@media (min-width: 980px)",
  ".htr-constellation.is-spiral-ready .htr-constellation__nodes",
  "aspect-ratio: 940 / 720",
  ".htr-spiral-map__path-base",
  ".htr-spiral-map__path-progress",
  "stroke-dashoffset 280ms ease",
  "vector-effect: non-scaling-stroke",
  ".htr-learning-map-progress__dot.is-current::after",
  "@media (min-width: 1180px)",
  "@media (min-width: 1180px) and (min-height: 760px)",
  "position: sticky",
  ".no-glow .htr-constellation.is-spiral-ready"
].forEach((token) => {
  if (!pageStyles.includes(token)) errors.push(`spiral map: required responsive, progress, or fallback styling is missing (${token})`);
});

if ((pageStyles.match(/--htr-spiral-path-base:/g) || []).length < 4
  || (pageStyles.match(/--htr-spiral-path-active:/g) || []).length < 4) {
  errors.push("spiral map: Sun, Moon, Blood Moon, and Blue Moon path colors are incomplete");
}
if (/\.htr-learning-map-panel[^{}]*\{[^}]*position:\s*fixed/.test(pageStyles)
  || /\.htr-learning-map-panel[^{}]*\{[^}]*overflow-y:\s*(?:auto|scroll)/.test(pageStyles)) {
  errors.push("spiral map: lesson panel must not be fixed or internally scrollable");
}

[
  ".htr-constellation__phase-labels, .htr-constellation__lines { display: none; }",
  "@media (max-width: 979px)",
  ".htr-constellation__travel-layer { width: min(100%, 760px); height: clamp(592px, calc((100vw - 24px) * 2), 720px);",
  ".htr-constellation__mobile-path { position: absolute;",
  ".htr-celestial-spine__geometry :is(path, ellipse)",
  ".htr-celestial-spine__orbits path",
  ".htr-celestial-spine__stations ellipse",
  ".htr-celestial-spine__channel",
  ".htr-celestial-spine__sigils :is(path, circle)",
  "top: var(--mobile-node-y) !important",
  "[data-mobile-side=\"left\"]",
  "[data-mobile-side=\"right\"]",
  ".lesson-star__mobile-title { display: block; }",
  ".lesson-star.is-completed .lesson-star__marker::after",
  ".htr-constellation.is-spiral-ready .htr-constellation__node:nth-child(n) { position: absolute; width: 44px; height: 44px;",
  ".htr-constellation.is-spiral-ready .htr-constellation__node:nth-child(9)::before",
  "@media (prefers-reduced-motion: reduce)"
].forEach((token) => {
  if (!pageStyles.includes(token)) errors.push(`spiral map: mobile celestial-spine, state, or target styling is missing (${token})`);
});

const expectedLessonNodeColors = ["#e991ff", "#a76cff", "#6867ff", "#45adff", "#52d68d", "#f2cc55", "#ff963f", "#ef4c5c", "#f8f6ff"];
expectedLessonNodeColors.forEach((color, index) => {
  const variable = `--lesson-node-${String(index + 1).padStart(2, "0")}: ${color};`;
  if (!pageStyles.includes(variable)) errors.push(`spiral map: chakra palette is missing ${variable}`);
});
if ((pageStyles.match(/--htr-celestial-spine-line:/g) || []).length < 4
  || (pageStyles.match(/--htr-celestial-spine-orbit:/g) || []).length < 4
  || (pageStyles.match(/--htr-celestial-spine-geometry:/g) || []).length < 4
  || /--htr-energy-body-|htr-energy-body-map/.test(pageStyles)
  || /\.htr-constellation__mobile-path\s*\{[^}]*width:\s*1px/.test(pageStyles)) {
  errors.push("spiral map: theme-aware celestial-spine variables are incomplete, a figure remains, or the old straight mobile line returned");
}

if (errors.length) {
  console.error(`How to Read Tarot navigation validation failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("How to Read Tarot navigation, adaptive curriculum, Spiral of Understanding, ethical compass, Follow the Thread, lesson travel, and closing CTA validation passed.");
}
