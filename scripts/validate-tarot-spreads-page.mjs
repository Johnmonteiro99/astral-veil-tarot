import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotSpreadsPage } from "../data/tarot-spreads.mjs";
import { validateRenderedTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { SITE_ORIGIN } from "./card-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = resolve(rootDir, "tarot-spreads", "index.html");
const errors = [];

if (!existsSync(outputPath)) {
  errors.push(`route: generated page is missing at ${outputPath}`);
} else {
  const html = readFileSync(outputPath, "utf8");
  const css = readFileSync(resolve(rootDir, "css/tarot-spreads.css"), "utf8");
  const js = readFileSync(resolve(rootDir, "js/tarot-spreads.js"), "utf8");
  const majorArcanaJs = readFileSync(resolve(rootDir, "js/tarot-major-arcana.js"), "utf8");
  const educationJs = readFileSync(resolve(rootDir, "js/tarot-education.js"), "utf8");
  const educationCss = readFileSync(resolve(rootDir, "css/tarot-education-components.css"), "utf8");
  const generatorJs = readFileSync(resolve(rootDir, "scripts/generate-tarot-spreads-page.mjs"), "utf8");
  const readingJs = readFileSync(resolve(rootDir, "js/reading.js"), "utf8");
  const readingCss = readFileSync(resolve(rootDir, "css/style.css"), "utf8");
  const libraryJs = readFileSync(resolve(rootDir, "js/tarot.js"), "utf8");
  const libraryCss = readFileSync(resolve(rootDir, "css/tarot.css"), "utf8");
  const libraryHtml = readFileSync(resolve(rootDir, "tarot.html"), "utf8");
  const sitemap = readFileSync(resolve(rootDir, "sitemap.xml"), "utf8");
  const robots = readFileSync(resolve(rootDir, "robots.txt"), "utf8");
  const canonical = `${SITE_ORIGIN}${tarotSpreadsPage.route}`;
  const countMatches = (pattern, value = html) => (value.match(pattern) || []).length;
  const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  const h1Text = h1Match?.[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

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

  if (
    countMatches(/<h1(?:\s|>)/g) !== 1 ||
    h1Text !== tarotSpreadsPage.hero.title
  ) {
    errors.push("headings: expected exactly one Tarot Spreads H1");
  }

  const requiredHeadings = [
    "What Is a Tarot Spread?",
    "Explore Tarot Spreads",
    "Tarot Spreads for Beginners",
    "Choose a Tarot Spread by Intention",
    "How Card Positions Change a Reading",
    "How to Choose and Perform a Tarot Spread",
    "Patterns to Notice Across a Tarot Spread",
    "Simple vs. In-Depth Tarot Spreads",
    "Tarot Spreads Frequently Asked Questions"
  ];
  let previousHeadingIndex = -1;
  requiredHeadings.forEach((heading) => {
    const index = html.indexOf(`>${heading}</h2>`);
    if (index < 0) errors.push(`headings: missing H2 "${heading}"`);
    if (index >= 0 && index < previousHeadingIndex) errors.push(`headings: "${heading}" is out of order`);
    previousHeadingIndex = Math.max(previousHeadingIndex, index);
  });

  [
    `<title>${tarotSpreadsPage.seo.title.replaceAll("&", "&amp;")}</title>`,
    `<meta name="description" content="${tarotSpreadsPage.seo.description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    '<meta name="twitter:card" content="summary_large_image" />'
  ].forEach((token) => {
    if (!html.includes(token)) errors.push(`seo: required metadata is missing (${token})`);
  });
  if (html.includes('content="noindex') || /"@type":"(?:Product|Review|Course|Article|QAPage)"/.test(html)) {
    errors.push("seo: page is non-indexable or contains unsupported schema");
  }

  const breadcrumb = parseSchema("tarot-spreads-breadcrumb-schema");
  const webPage = parseSchema("tarot-spreads-webpage-schema");
  const faqPage = parseSchema("tarot-spreads-faq-schema");
  if (
    breadcrumb?.["@type"] !== "BreadcrumbList" ||
    breadcrumb?.itemListElement?.length !== 3 ||
    breadcrumb?.itemListElement?.[2]?.item !== canonical
  ) {
    errors.push("schema: BreadcrumbList must end at the canonical Tarot Spreads route");
  }
  if (webPage?.["@type"] !== "WebPage" || webPage?.url !== canonical) {
    errors.push("schema: WebPage canonical URL is incorrect");
  }
  if (faqPage?.["@type"] !== "FAQPage" || faqPage?.mainEntity?.length !== tarotSpreadsPage.faq.items.length) {
    errors.push("schema: FAQPage must match all visible FAQ items");
  }
  tarotSpreadsPage.faq.items.forEach((item, index) => {
    if (
      faqPage?.mainEntity?.[index]?.name !== item.question ||
      faqPage?.mainEntity?.[index]?.acceptedAnswer?.text !== item.answer
    ) {
      errors.push(`schema: FAQ item ${index + 1} does not match visible content`);
    }
  });

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) errors.push(`accessibility: duplicate IDs found (${duplicateIds.join(", ")})`);

  [
    '<header class="site-header">',
    '<nav class="navbar" aria-label="Primary navigation">',
    'data-theme-toggle',
    'id="mobile-navigation"',
    '<div class="tarot-background" aria-hidden="true">',
    '<div class="celestial-wash"></div>',
    '<div class="starfield"></div>',
    '<div class="mystic-mist"></div>',
    '<div class="lunar-orb"></div>',
    '<footer class="site-footer" data-footer-drawer>',
    '<link rel="stylesheet" href="/css/tarot-spreads.css" />',
    '<script src="/js/tarot-major-arcana.js"></script>',
    '<script src="/js/tarot-spreads.js"></script>',
    '<script type="module" src="/src/public/public-auth-nav.js"></script>'
  ].forEach((token) => {
    if (!html.includes(token)) errors.push(`shared shell: required architecture is missing (${token})`);
  });
  if (html.includes("/css/tarot-minor-arcana.css") || html.includes("/js/tarot-minor-arcana.js")) {
    errors.push("shared shell: Tarot Spreads must not load Minor Arcana page-specific assets");
  }

  validateRenderedTarotEducationNavigation(html, { activeKey: "spreads", rootDir })
    .forEach((error) => errors.push(`education navigation: ${error}`));

  tarotSpreadsPage.hero.paragraphs.forEach((paragraph) => {
    if (!html.includes(paragraph)) errors.push("hero: required introductory copy is missing");
  });
  tarotSpreadsPage.hero.facts.forEach((fact) => {
    if (!html.includes(fact)) errors.push(`hero: fact is missing (${fact})`);
  });
  if (
    !html.includes('id="tarot-spreads-hero"') ||
    !html.includes('class="tarot-spreads-hero__title-main">Tarot Spreads</span>') ||
    !html.includes('class="tarot-spreads-hero__title-secondary">Explained</span>') ||
    !html.includes("tarot-spreads-hero__editorial") ||
    !html.includes('loading="eager" decoding="async" fetchpriority="high"') ||
    !html.includes('href="#explore-tarot-spreads">Explore Tarot Spreads</a>') ||
    !html.includes('href="/how-to-read-tarot-cards/">How to Read Tarot Cards</a>')
  ) {
    errors.push("hero: priority image, primary CTA, or honest secondary status is incomplete");
  }

  tarotSpreadsPage.definition.paragraphs.forEach((paragraph) => {
    if (!html.includes(paragraph)) errors.push("definition: required editorial copy is missing");
  });
  if (!html.includes(tarotSpreadsPage.definition.prompt)) {
    errors.push("definition: central question prompt is missing");
  }
  tarotSpreadsPage.definition.concepts.forEach((concept) => {
    [concept.title, concept.copy].forEach((token) => {
      if (!html.includes(token)) errors.push(`definition: concept is incomplete (${concept.title})`);
    });
  });
  const definitionStart = html.indexOf('<section class="tarot-spreads-section tarot-spreads-definition"');
  const definitionEnd = definitionStart >= 0 ? html.indexOf("</section>", definitionStart) : -1;
  const definitionHtml = definitionStart >= 0 && definitionEnd > definitionStart
    ? html.slice(definitionStart, definitionEnd)
    : "";
  if (
    !definitionHtml.includes("data-spread-definition") ||
    !definitionHtml.includes('role="tablist"') ||
    countMatches(/data-spread-definition-card=/g, definitionHtml) !== tarotSpreadsPage.definition.concepts.length ||
    countMatches(/data-spread-definition-panel=/g, definitionHtml) !== tarotSpreadsPage.definition.concepts.length ||
    countMatches(/tarot-spreads-definition__card is-active/g, definitionHtml) !== 1 ||
    countMatches(/tarot-spreads-definition__panel is-active/g, definitionHtml) !== 1 ||
    countMatches(/ hidden inert/g, definitionHtml) !== tarotSpreadsPage.definition.concepts.length - 1 ||
    countMatches(/data-major-theme-image/g, definitionHtml) !== tarotSpreadsPage.definition.concepts.length ||
    !definitionHtml.includes('/assets/images/cards/blood-moon/bloodmoon-card-back.webp') ||
    definitionHtml.includes("tarot-spreads-concepts") ||
    definitionHtml.includes("tarot-spreads-concept")
  ) {
    errors.push("definition: interactive card tabs, themed imagery, active state, or legacy-card removal is incomplete");
  }
  tarotSpreadsPage.definition.concepts.forEach((concept, index) => {
    const position = index + 1;
    if (
      !definitionHtml.includes(`id="spread-definition-tab-${position}"`) ||
      !definitionHtml.includes(`aria-controls="spread-definition-panel-${position}"`) ||
      !definitionHtml.includes(`id="spread-definition-panel-${position}"`) ||
      !definitionHtml.includes(`aria-labelledby="spread-definition-tab-${position}"`)
    ) {
      errors.push(`definition: reciprocal tab semantics are missing for ${concept.title}`);
    }
  });
  [
    '[data-spread-definition]',
    '[data-spread-definition-card]',
    '[data-spread-definition-panel]',
    'scrollDefinitionCard',
    'setDefinitionCard'
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`definition: interaction behavior is missing (${token})`);
  });
  if (
    !/\.tarot-spreads-definition__experience\s*\{[^}]*background:\s*transparent;/s.test(css) ||
    !/\.tarot-spreads-definition__cards::before,[\s\S]*?\.tarot-spreads-definition__cards::after\s*\{[^}]*content:\s*none;/s.test(css) ||
    /\.tarot-spreads-definition::before\s*\{/.test(css)
  ) {
    errors.push("definition: card selector must remain open to the page background without a shared glow, frame, or wash");
  }
  if (
    !/\.tarot-spreads-definition__card\.is-active \.tarot-spreads-definition__card-media\s*\{[^}]*drop-shadow\([^}]*var\(--major-accent\)/s.test(css) ||
    !/\.tarot-spreads-definition__card\.is-active \.tarot-spreads-definition__card-media::after,[\s\S]*?border-color:\s*color-mix\([^}]*var\(--major-accent-strong\)/s.test(css) ||
    !/\.tarot-spreads-definition__experience\.is-enhanced \.tarot-spreads-definition__card:not\(\.is-active\)\s*\{[^}]*opacity:\s*\.5;/s.test(css)
  ) {
    errors.push("definition: only the selected card should retain the refined gold emphasis");
  }

  const explorerStart = html.indexOf('<section class="tarot-spreads-section tarot-spread-observatory tarot-spread-observatory--gallery"');
  const explorerEnd = explorerStart >= 0
    ? html.indexOf('<section class="tarot-spreads-section tarot-spreads-beginners tarot-spreads-beginners--progression"', explorerStart)
    : -1;
  const explorerHtml = explorerStart >= 0 && explorerEnd > explorerStart ? html.slice(explorerStart, explorerEnd) : "";
  const explorerModalStart = explorerHtml.indexOf('<div class="tarot-spreads-modal"');
  const explorerWorkspaceHtml = explorerModalStart >= 0 ? explorerHtml.slice(0, explorerModalStart) : explorerHtml;
  const explorerModalHtml = explorerModalStart >= 0 ? explorerHtml.slice(explorerModalStart) : "";
  const explorerPositionCount = tarotSpreadsPage.explorer.items.reduce((total, spread) => total + spread.positions.length, 0);
  const availableSpreadCount = tarotSpreadsPage.explorer.items.filter((spread) => spread.isAvailable).length;
  if (
    !explorerWorkspaceHtml.includes('class="tarot-spread-observatory__header"') ||
    countMatches(/data-spread-filter=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.filters.length ||
    !explorerWorkspaceHtml.includes('data-spread-filter="available"') ||
    !explorerWorkspaceHtml.includes('class="spread-filter-rail" role="toolbar"') ||
    !explorerWorkspaceHtml.includes('class="spread-filter-rail__indicator" aria-hidden="true"') ||
    !explorerWorkspaceHtml.includes('class="spread-gallery__track" role="tablist"') ||
    countMatches(/data-spread-selector=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/role="tab" aria-selected=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-available="true"/g, explorerWorkspaceHtml) !== availableSpreadCount ||
    countMatches(/data-spread-panel=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/class="tarot-spread-observatory__spread is-active"/g, explorerWorkspaceHtml) !== 1 ||
    countMatches(/aria-hidden="true" hidden inert data-spread-panel=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length - 1 ||
    countMatches(/data-spread-card-count=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-position=/g, explorerWorkspaceHtml) !== explorerPositionCount ||
    countMatches(/data-position-id=/g, explorerWorkspaceHtml) !== explorerPositionCount ||
    countMatches(/data-spread-position-detail/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-position-item=/g, explorerWorkspaceHtml) !== explorerPositionCount ||
    countMatches(/data-spread-drawer-toggle=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-drawer-previous=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-drawer-next=/g, explorerWorkspaceHtml) !== tarotSpreadsPage.explorer.items.length ||
    explorerWorkspaceHtml.includes('class="spread-index"') ||
    !explorerWorkspaceHtml.includes('class="spread-tabletop"') ||
    !explorerWorkspaceHtml.includes('class="spread-position-drawer"') ||
    !explorerWorkspaceHtml.includes('class="spread-overview"')
  ) {
    errors.push("explorer: horizontal gallery, tabletop stages, overview panels, or position drawers are incomplete");
  }
  if (
    !explorerModalHtml.includes('role="dialog" aria-modal="true"') ||
    countMatches(/data-spread-modal-panel=/g, explorerModalHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-card-count=/g, explorerModalHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-modal-close/g, explorerModalHtml) !== 3 ||
    !explorerModalHtml.includes('class="tarot-spreads-modal__return"') ||
    countMatches(/<h4>Example questions<\/h4>/g, explorerModalHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/<h4>Common mistakes<\/h4>/g, explorerModalHtml) !== tarotSpreadsPage.explorer.items.length
  ) {
    errors.push("explorer modal: accessible dialog, close controls, diagrams, examples, or common mistakes are incomplete");
  }
  const spreadBackdropSelector = "body.tarot-spreads-page .tarot-spreads-modal__backdrop {";
  const spreadBackdropStart = css.indexOf(spreadBackdropSelector);
  const spreadBackdropEnd = spreadBackdropStart >= 0 ? css.indexOf("}", spreadBackdropStart) : -1;
  const spreadBackdropCss = spreadBackdropStart >= 0 && spreadBackdropEnd > spreadBackdropStart
    ? css.slice(spreadBackdropStart, spreadBackdropEnd + 1)
    : "";
  if (
    countMatches(/class="tarot-spreads-modal__backdrop"/g, explorerModalHtml) !== 1 ||
    !explorerModalHtml.includes('<button class="tarot-spreads-modal__backdrop" type="button" aria-label="Close spread details" data-spread-modal-close>') ||
    !spreadBackdropCss.includes("position: absolute") ||
    !spreadBackdropCss.includes("inset: 0") ||
    !spreadBackdropCss.includes("background: rgba(8, 13, 10, .06)") ||
    !spreadBackdropCss.includes("-webkit-backdrop-filter: blur(2px)") ||
    !spreadBackdropCss.includes("backdrop-filter: blur(2px)") ||
    spreadBackdropCss.includes("--tarot-bg-deep") ||
    spreadBackdropCss.includes("linear-gradient") ||
    spreadBackdropCss.includes("pointer-events: none") ||
    !css.includes("body.moon-mode.tarot-spreads-page .tarot-spreads-modal__backdrop {\n  background: rgba(4, 5, 16, .1);") ||
    !css.includes("body.blood-moon-mode.tarot-spreads-page .tarot-spreads-modal__backdrop {\n  background: rgba(18, 0, 4, .12);")
  ) {
    errors.push("explorer modal backdrop: transparent theme-aware coverage or click interception is incomplete");
  }
  if (
    !js.includes('document.body.classList.add("tarot-spread-modal-open")') ||
    !js.includes('document.body.classList.remove("tarot-spread-modal-open")') ||
    !css.includes("body.tarot-spread-modal-open {\n  overflow: hidden;")
  ) {
    errors.push("explorer modal backdrop: body scroll locking must remain intact");
  }
  tarotSpreadsPage.explorer.items.forEach((spread) => {
    [
      spread.name,
      String(spread.cardCount),
      spread.difficulty,
      spread.bestFor,
      spread.summary,
      spread.guidance,
      ...spread.exampleQuestions,
      ...spread.commonMistakes,
      ...spread.positions.flatMap((position) => [position.name, position.copy]),
      ...spread.tips
    ].forEach((content) => {
      if (!explorerHtml.includes(content)) errors.push(`explorer: initial content is missing for ${spread.name}`);
    });
    if (
      !explorerHtml.includes(`id="spread-selector-${spread.id}"`) ||
      !explorerHtml.includes(`aria-controls="spread-panel-${spread.id}"`) ||
      !explorerHtml.includes(`id="spread-panel-${spread.id}"`) ||
      !explorerHtml.includes(`aria-labelledby="spread-selector-${spread.id}"`)
    ) {
      errors.push(`explorer: reciprocal selector and panel semantics are missing for ${spread.name}`);
    }
    if (spread.displayName && !explorerWorkspaceHtml.includes(`<strong>${spread.displayName.replaceAll("&", "&amp;")}</strong>`)) {
      errors.push(`explorer: concise gallery name is missing for ${spread.name}`);
    }
    if (spread.isAvailable) {
      if (
        !explorerWorkspaceHtml.includes(`data-spread-modal-open="${spread.id}">Learn This Spread</button>`) ||
        countMatches(new RegExp(`href="${spread.href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">Start This Spread</a>`, "g"), explorerHtml) !== 2
      ) {
        errors.push(`explorer: live layout and reading actions are incomplete for ${spread.name}`);
      }
    } else if (
      !explorerWorkspaceHtml.includes(`data-spread-modal-open="${spread.id}">Learn This Spread</button>`) ||
      !explorerHtml.includes('role="status">Planned for v2.5</span>')
    ) {
      errors.push(`explorer: unavailable layout needs a Learn This Spread action and honest v2.5 state (${spread.name})`);
    }
  });
  if (explorerHtml.includes('href=""') || explorerHtml.includes('/?spread=10')) {
    errors.push("explorer: empty or unsupported reading routes must not be linked");
  }
  [
    "openSpreadModal",
    "closeSpreadModal",
    "data-spread-modal-open",
    'event.key === "Escape"',
    "modalReturnFocus",
    "tarot-spread-modal-open",
    "setActivePosition",
    "data-spread-position",
    "selectedPositions",
    "setDrawerExpanded",
    "data-spread-drawer-toggle",
    "data-spread-drawer-previous",
    "data-spread-drawer-next",
    "spreadTransitionState",
    "pendingSpreadRequest",
    "waitForSpreadPhase",
    "clearSpreadTransitionWait",
    '"transitionend"',
    '"animationend"',
    "is-exiting",
    "is-entering",
    "positionDetailAnimations",
    'event.target.closest("[data-spread-position]")',
    'filter === "available"'
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`explorer modal: interaction behavior is missing (${token})`);
  });
  if (
    js.includes("void detail.offsetWidth") ||
    js.includes("is-gathering") ||
    countMatches(/data-position-id="[^"]+"/g, explorerWorkspaceHtml) !== explorerPositionCount
  ) {
    errors.push("explorer interaction: forced reflow, legacy transition locking, or unstable card identifiers remain");
  }
  [
    ".spread-gallery__track",
    ".spread-gallery__item",
    '--tarot-spread-interface-font: "DM Sans", sans-serif',
    "scroll-snap-type: x proximity",
    ".spread-observatory-workspace",
    "minmax(620px, 1.85fr)",
    "minmax(340px, .82fr)",
    ".spread-filter-rail",
    ".spread-tabletop",
    "perspective: 1450px",
    "width: 220px",
    "width: clamp(140px, 15.2vw, 176px)",
    "width: clamp(110px, 11.5vw, 140px)",
    "width: clamp(88px, 9vw, 112px)",
    "width: clamp(66px, 7.1vw, 88px)",
    ".tarot-spread-diagram--7",
    ".tarot-spread-diagram--celtic-cross",
    ".spread-position-drawer",
    ".spread-position-drawer__detail",
    ".spread-overview",
    ".tarot-spreads-modal__return",
    ".tarot-spreads-modal__dialog",
    "@keyframes spread-tabletop-deal",
    "@keyframes spread-drawer-copy",
    "touch-action: manipulation",
    ".is-exiting .spread-position-card",
    ".is-entering .spread-position-card",
    "body.blood-moon-mode.tarot-spreads-page .tarot-spread-observatory",
    "@media (max-width: 768px)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`explorer styles: immersive observatory treatment is missing (${token})`);
  });
  const galleryCssStart = css.indexOf("/* Explore Tarot Spreads: horizontal gallery + split tabletop workspace */");
  const galleryCssEnd = css.indexOf("/* Explore Tarot Spreads: tabletop observatory */", galleryCssStart);
  const galleryCss = galleryCssStart >= 0 && galleryCssEnd > galleryCssStart
    ? css.slice(galleryCssStart, galleryCssEnd)
    : "";
  if (
    /\.spread-filter-rail__segment\s*\+/.test(css) ||
    /\.tarot-spreads-explorer__stage::(?:before|after)/.test(css) ||
    /\.tarot-spreads-explorer::before/.test(css) ||
    /\.tarot-spread-observatory::before/.test(css) ||
    /animation[^;]*(?:float|bob)/i.test(css) ||
    !galleryCss.includes(".spread-gallery__track") ||
    !galleryCss.includes("scroll-snap-type: x proximity") ||
    !galleryCss.includes("grid-template-columns: minmax(620px, 1.85fr) minmax(340px, .82fr)") ||
    !galleryCss.includes(".spread-tabletop::before") ||
    !galleryCss.includes("content: none") ||
    !galleryCss.includes("pointer-events: auto") ||
    !galleryCss.includes("touch-action: manipulation") ||
    !galleryCss.includes("min-height: 44px") ||
    !galleryCss.includes(".spread-position-drawer") ||
    !galleryCss.includes(".spread-overview") ||
    !/@media \(max-width: 768px\)[\s\S]*?\.tarot-spread-observatory\.tarot-spread-observatory--gallery \.tarot-spread-observatory__spread\s*\{[^}]*display:\s*flex/s.test(galleryCss)
  ) {
    errors.push("explorer styles: the gallery, borderless tabletop, position drawer, overview panel, or mobile stack are incomplete");
  }

  const parseCustomProperties = (style) => Object.fromEntries(
    String(style || "")
      .split(";")
      .map((declaration) => declaration.split(":"))
      .filter(([property, value]) => property?.startsWith("--") && value !== undefined)
      .map(([property, ...value]) => [property.trim(), value.join(":").trim()])
  );
  const parseCssNumber = (value) => Number.parseFloat(String(value || "").replace(/(?:px|vw|deg|%)$/, ""));
  const clamp = (minimum, value, maximum) => Math.max(minimum, Math.min(value, maximum));
  const geometryScenarios = [
    { name: "large desktop", viewportWidth: 1440, stageWidth: 700, mobile: false },
    { name: "standard desktop", viewportWidth: 1280, stageWidth: 620, mobile: false },
    { name: "tablet", viewportWidth: 900, stageWidth: 470, mobile: false },
    { name: "mobile", viewportWidth: 390, stageWidth: 360, mobile: true },
    { name: "narrow mobile", viewportWidth: 320, stageWidth: 292, mobile: true }
  ];
  const stageGeometry = new Map();

  tarotSpreadsPage.explorer.items.forEach((spread) => {
    const escapedId = spread.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const stageMatch = explorerWorkspaceHtml.match(new RegExp(`<div class="spread-tabletop" style="([^"]+)" data-spread-tabletop="${escapedId}"(?: data-spread-layout-source="([^"]+)")?>`));
    const cardPattern = new RegExp(`<button class="[^"]*spread-position-card[^"]*" style="([^"]+)"[^>]*data-spread-position-spread="${escapedId}"`, "g");
    const cardStyles = [...explorerWorkspaceHtml.matchAll(cardPattern)].map((match) => parseCustomProperties(match[1]));
    const stageStyle = parseCustomProperties(stageMatch?.[1]);

    if (
      !stageMatch ||
      cardStyles.length !== spread.cardCount ||
      [
        "--spread-stage-aspect",
        "--spread-stage-mobile-aspect",
        "--spread-stage-max-width",
        "--spread-card-min",
        "--spread-card-fluid",
        "--spread-card-max",
        "--spread-card-mobile-min",
        "--spread-card-mobile-fluid",
        "--spread-card-mobile-max"
      ].some((property) => !stageStyle[property]) ||
      cardStyles.some((style) => [
        "--spread-x",
        "--spread-y",
        "--spread-tablet-x",
        "--spread-tablet-y",
        "--spread-mobile-x",
        "--spread-mobile-y",
        "--spread-rotation",
        "--spread-tablet-rotation",
        "--spread-mobile-rotation",
        "--spread-deal-order"
      ].some((property) => !style[property]))
    ) {
      errors.push(`explorer geometry: normalized layout variables are incomplete for ${spread.name}`);
      return;
    }

    stageGeometry.set(spread.id, { stageStyle, cardStyles, source: stageMatch[2] || "" });

    geometryScenarios.forEach((scenario) => {
      const aspect = parseCssNumber(stageStyle[scenario.mobile ? "--spread-stage-mobile-aspect" : "--spread-stage-aspect"]);
      const maximumStageWidth = parseCssNumber(stageStyle["--spread-stage-max-width"]);
      const stageWidth = Math.min(scenario.stageWidth, maximumStageWidth);
      const stageHeight = stageWidth / aspect;
      const cardWidth = scenario.mobile
        ? clamp(
          parseCssNumber(stageStyle["--spread-card-mobile-min"]),
          scenario.viewportWidth * parseCssNumber(stageStyle["--spread-card-mobile-fluid"]) / 100,
          parseCssNumber(stageStyle["--spread-card-mobile-max"])
        )
        : clamp(
          parseCssNumber(stageStyle["--spread-card-min"]),
          scenario.viewportWidth * parseCssNumber(stageStyle["--spread-card-fluid"]) / 100,
          parseCssNumber(stageStyle["--spread-card-max"])
        );
      const cardHeight = cardWidth * 1.5;
      const boxes = cardStyles.map((style, cardIndex) => {
        const coordinateMode = scenario.mobile ? "mobile" : scenario.name === "tablet" ? "tablet" : "desktop";
        const xProperty = coordinateMode === "mobile" ? "--spread-mobile-x" : coordinateMode === "tablet" ? "--spread-tablet-x" : "--spread-x";
        const yProperty = coordinateMode === "mobile" ? "--spread-mobile-y" : coordinateMode === "tablet" ? "--spread-tablet-y" : "--spread-y";
        const rotationProperty = coordinateMode === "mobile" ? "--spread-mobile-rotation" : coordinateMode === "tablet" ? "--spread-tablet-rotation" : "--spread-rotation";
        const x = stageWidth * parseCssNumber(style[xProperty]) / 100;
        const y = stageHeight * parseCssNumber(style[yProperty]) / 100;
        const rotation = parseCssNumber(style[rotationProperty]) * Math.PI / 180;
        const rotatedWidth = Math.abs(cardWidth * Math.cos(rotation)) + Math.abs(cardHeight * Math.sin(rotation));
        const rotatedHeight = Math.abs(cardWidth * Math.sin(rotation)) + Math.abs(cardHeight * Math.cos(rotation));
        return { cardIndex, x, y, width: rotatedWidth, height: rotatedHeight };
      });

      boxes.forEach((box) => {
        if (
          box.x - box.width / 2 < -1 ||
          box.x + box.width / 2 > stageWidth + 1 ||
          box.y - box.height / 2 < -1 ||
          box.y + box.height / 2 > stageHeight + 1
        ) {
          errors.push(`explorer geometry: ${spread.name} card ${box.cardIndex + 1} exceeds the ${scenario.name} stage`);
        }
      });

      boxes.forEach((selectedBox, selectedIndex) => {
        const liftedBoxes = boxes.map((box, boxIndex) => boxIndex === selectedIndex
          ? { ...box, y: box.y - (scenario.mobile ? 7 : 8), width: box.width * 1.025, height: box.height * 1.025 }
          : box);
        const liftedSelectedBox = liftedBoxes[selectedIndex];
        if (
          liftedSelectedBox.x - liftedSelectedBox.width / 2 < -1 ||
          liftedSelectedBox.x + liftedSelectedBox.width / 2 > stageWidth + 1 ||
          liftedSelectedBox.y - liftedSelectedBox.height / 2 < -1 ||
          liftedSelectedBox.y + liftedSelectedBox.height / 2 > stageHeight + 1
        ) {
          errors.push(`explorer geometry: ${spread.name} card ${selectedIndex + 1} exceeds the ${scenario.name} stage when selected`);
        }
        for (let firstIndex = 0; firstIndex < liftedBoxes.length; firstIndex += 1) {
          for (let secondIndex = firstIndex + 1; secondIndex < liftedBoxes.length; secondIndex += 1) {
            if (spread.id === "celtic-cross" && firstIndex === 0 && secondIndex === 1) continue;
            const first = liftedBoxes[firstIndex];
            const second = liftedBoxes[secondIndex];
            const overlapX = (first.width + second.width) / 2 - Math.abs(first.x - second.x);
            const overlapY = (first.height + second.height) / 2 - Math.abs(first.y - second.y);
            if (overlapX > 1 && overlapY > 1) {
              errors.push(`explorer geometry: ${spread.name} cards ${firstIndex + 1} and ${secondIndex + 1} collide in ${scenario.name} when card ${selectedIndex + 1} is selected`);
            }
          }
        }
      });
    });
  });

  const celticGeometry = stageGeometry.get("celtic-cross");
  const celticExpected = [
    [40, 50, 0],
    [40, 50, 90],
    [40, 79, 0],
    [16, 50, 0],
    [40, 20, 0],
    [64, 50, 0],
    [88, 82, 0],
    [88, 61, 0],
    [88, 40, 0],
    [88, 19, 0]
  ];
  if (
    !celticGeometry ||
    celticExpected.some(([x, y, rotation], index) => {
      const style = celticGeometry.cardStyles[index];
      return parseCssNumber(style?.["--spread-x"]) !== x ||
        parseCssNumber(style?.["--spread-y"]) !== y ||
        parseCssNumber(style?.["--spread-rotation"]) !== rotation;
    })
  ) {
    errors.push("explorer geometry: Celtic Cross must retain the traditional cross-plus-staff coordinates and 90-degree crossing card");
  }
  if (
    stageGeometry.get("five-card-insight")?.source !== "live-reading-3-plus-2" ||
    stageGeometry.get("seven-card-reading")?.source !== "live-reading-3-plus-3-plus-1" ||
    !readingJs.includes('cardList.dataset.cardCount = String(cards.length)') ||
    !readingCss.includes(".deck-area .tarot-card:nth-child(4):nth-last-child(2)") ||
    !readingCss.includes(".deck-area .tarot-card:nth-child(7):last-child")
  ) {
    errors.push("explorer geometry: five- and seven-card educational layouts must document and preserve the live reading formations");
  }
  [
    "const explorerStageLayouts = {",
    '"one-card": {',
    '"past-present-future": {',
    '"situation-challenge-advice": {',
    '"mind-body-spirit": {',
    '"decision-crossroads": {',
    '"love-relationship": {',
    '"career-purpose": {',
    '"five-card-insight": {',
    '"seven-card-reading": {',
    '"celtic-cross": {',
    "options.layout?.positions?.[index]",
    "--spread-deal-order"
  ].forEach((token) => {
    if (!generatorJs.includes(token)) errors.push(`explorer geometry: dedicated layout map is incomplete (${token})`);
  });
  const geometryCssStart = css.indexOf("/* Explore Tarot Spreads: normalized educational-stage geometry */");
  const geometryCss = geometryCssStart >= 0 ? css.slice(geometryCssStart) : "";
  [
    "aspect-ratio: var(--spread-stage-aspect)",
    "top: var(--spread-current-y)",
    "left: var(--spread-current-x)",
    "rotateZ(var(--spread-current-rotation))",
    "scale(1.025)",
    "animation-delay: calc(var(--spread-deal-order) * 30ms)",
    ".tarot-spread-diagram--celtic-cross .spread-position-card:nth-child(2)",
    ".tarot-spread-diagram--celtic-cross .spread-position-card__number",
    "transform: rotate(-90deg)",
    "aspect-ratio: var(--spread-stage-mobile-aspect)",
    "--spread-current-x: var(--spread-mobile-x, var(--spread-x))",
    "--spread-current-rotation: var(--spread-mobile-rotation, var(--spread-rotation))",
    "@media (min-width: 769px) and (max-width: 1080px)",
    "--spread-current-x: var(--spread-tablet-x, var(--spread-x))",
    "@media (max-width: 420px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!geometryCss.includes(token)) errors.push(`explorer geometry styles: responsive layout behavior is missing (${token})`);
  });

  const beginnersStart = html.indexOf('<section class="tarot-spreads-section tarot-spreads-beginners tarot-spreads-beginners--progression"');
  const beginnersEnd = beginnersStart >= 0
    ? html.indexOf('<section class="tarot-spreads-section tarot-spreads-intentions"', beginnersStart)
    : -1;
  const beginnersHtml = beginnersStart >= 0 && beginnersEnd > beginnersStart
    ? html.slice(beginnersStart, beginnersEnd)
    : "";
  const beginnerRoutes = new Map([
    [1, "/one-card-tarot-reading"],
    [3, "/?spread=3"],
    [5, "/?spread=5"]
  ]);
  const fiveCardBeginnerStart = beginnersHtml.indexOf('<figure class="tarot-spread-diagram tarot-spread-diagram--5 tarot-spread-diagram--beginner"');
  const fiveCardBeginnerEnd = fiveCardBeginnerStart >= 0
    ? beginnersHtml.indexOf("</figure>", fiveCardBeginnerStart)
    : -1;
  const fiveCardBeginnerHtml = fiveCardBeginnerStart >= 0 && fiveCardBeginnerEnd > fiveCardBeginnerStart
    ? beginnersHtml.slice(fiveCardBeginnerStart, fiveCardBeginnerEnd)
    : "";
  if (
    !beginnersHtml.includes("data-beginner-progression") ||
    !beginnersHtml.includes('data-beginner-active="0"') ||
    !beginnersHtml.includes("data-beginner-track") ||
    countMatches(/data-beginner-spread=/g, beginnersHtml) !== tarotSpreadsPage.beginners.groups.length ||
    countMatches(/data-beginner-selector=/g, beginnersHtml) !== tarotSpreadsPage.beginners.groups.length ||
    countMatches(/aria-pressed="true"/g, beginnersHtml) !== 1 ||
    countMatches(/tarot-spread-diagram--beginner/g, beginnersHtml) !== tarotSpreadsPage.beginners.groups.length ||
    countMatches(/data-beginner-path-node=/g, beginnersHtml) !== tarotSpreadsPage.beginners.groups.length ||
    countMatches(/data-major-theme-image/g, beginnersHtml) !== 9 ||
    !beginnersHtml.includes("data-beginner-previous") ||
    !beginnersHtml.includes("data-beginner-next") ||
    !beginnersHtml.includes("data-beginner-count") ||
    !beginnersHtml.includes("data-beginner-label") ||
    !beginnersHtml.includes('class="tarot-spreads-beginners__spread beginner-spread beginner-spread--five"') ||
    !beginnersHtml.includes('class="beginner-spread__visual"') ||
    !fiveCardBeginnerHtml.includes("beginner-five-card-layout") ||
    beginnersHtml.includes("tarot-spreads-beginners__grid") ||
    countMatches(/class="tarot-spread-diagram__card"/g, fiveCardBeginnerHtml) !== 5 ||
    countMatches(/<img src="\/assets\/images\/cards\/original\/card-back\.webp"/g, fiveCardBeginnerHtml) !== 5 ||
    countMatches(/data-blood-src="\/assets\/images\/cards\/blood-moon\/bloodmoon-card-back\.webp"/g, fiveCardBeginnerHtml) !== 5
  ) {
    errors.push("beginners: borderless progression structure, themed diagrams, path, or mobile controls are incomplete");
  }
  tarotSpreadsPage.beginners.groups.forEach((group) => {
    [
      group.label,
      group.title,
      group.bestFor,
      group.supporting,
      group.progressSummary,
      ...group.positionNames
    ].forEach((content) => {
      if (!beginnersHtml.includes(content)) errors.push(`beginners: initial content is missing for ${group.title} (${content})`);
    });
    if (!beginnersHtml.includes(`href="${beginnerRoutes.get(group.cards)}"`)) {
      errors.push(`beginners: live reading route is missing for ${group.title}`);
    }
  });
  [
    "setBeginnerSpread",
    "scrollBeginnerSpread",
    "data-beginner-selector",
    "data-beginner-previous",
    "data-beginner-next",
    '"(max-width: 1120px)"',
    'event.key === "ArrowRight"',
    'event.key === "Home"',
    'event.key === "End"',
    'track?.addEventListener("scroll"'
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`beginners interaction: required behavior is missing (${token})`);
  });
  const beginnerCssStart = css.indexOf("/* Tarot Spreads for Beginners: borderless ascending tabletop progression */");
  const beginnerCss = beginnerCssStart >= 0 ? css.slice(beginnerCssStart) : "";
  [
    ".tarot-spreads-beginners--progression",
    "--beginner-interface-font: var(--body-font, \"DM Sans\", sans-serif)",
    "grid-template-columns: repeat(3, minmax(0, 1fr))",
    "--beginner-rise: 14px",
    "--beginner-rise: 26px",
    "perspective: 1100px",
    "rotateX(9deg)",
    "width: clamp(150px, 14vw, 184px)",
    "width: clamp(104px, 8.35vw, 124px)",
    ".beginner-spread--five .beginner-spread__visual",
    ".beginner-five-card-layout",
    "grid-template-areas:",
    '". top ."',
    '"left center right"',
    '". bottom ."',
    "width: clamp(66px, 4.8vw, 68px)",
    "width: clamp(58px, 8vw, 59px)",
    "width: clamp(46px, 14vw, 56px)",
    "aspect-ratio: 2 / 3",
    "opacity: 1",
    "visibility: visible",
    ".tarot-spread-diagram--beginner.tarot-spread-diagram--5 .tarot-spread-diagram__card:nth-child(3) img",
    "transform: rotateX(9deg) scale(1.04)",
    ".tarot-spreads-beginners__path",
    ".tarot-spreads-beginners__path-node",
    "body.blood-moon-mode.tarot-spreads-page .tarot-spreads-beginners",
    "@media (max-width: 1120px)",
    "scroll-snap-type: x mandatory",
    "flex: 0 0 82%",
    "min-height: 44px",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!beginnerCss.includes(token)) errors.push(`beginners styles: borderless progression treatment is missing (${token})`);
  });
  if (
    !/\.tarot-spreads-beginners__spread,[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;/s.test(beginnerCss) ||
    !/\.beginner-five-card-layout\s*\{[^}]*display:\s*grid;[^}]*overflow:\s*visible;/s.test(beginnerCss) ||
    !/\.beginner-spread--five \.beginner-spread__visual\s*\{[^}]*height:\s*100%;[^}]*overflow:\s*visible;/s.test(beginnerCss) ||
    /animation[^;]*(?:float|bob|pulse)/i.test(beginnerCss)
  ) {
    errors.push("beginners styles: outer cards, stable five-card grid, or continuous-motion safeguards are incomplete");
  }
  const intentionsStart = html.indexOf('<section class="tarot-spreads-section tarot-spreads-intentions"');
  const intentionsEnd = intentionsStart >= 0
    ? html.indexOf('<section class="tarot-spreads-section tarot-spreads-positions"', intentionsStart)
    : -1;
  const intentionsHtml = intentionsStart >= 0 && intentionsEnd > intentionsStart
    ? html.slice(intentionsStart, intentionsEnd)
    : "";
  const intentionStandardSources = tarotSpreadsPage.intentions.items.map((item) => item.image.src);
  const intentionBloodSources = tarotSpreadsPage.intentions.items.map((item) => item.image.bloodSrc);
  if (
    !intentionsHtml.includes("data-intention-gallery") ||
    !intentionsHtml.includes("data-intention-track") ||
    countMatches(/data-intention-pathway/g, intentionsHtml) !== tarotSpreadsPage.intentions.items.length ||
    countMatches(/class="tarot-spreads-intentions__image-link"/g, intentionsHtml) !== 4 ||
    countMatches(/tarot-spreads-intentions__image-link--static/g, intentionsHtml) !== 1 ||
    countMatches(/data-major-theme-image/g, intentionsHtml) !== tarotSpreadsPage.intentions.items.length ||
    !intentionsHtml.includes("data-intention-previous") ||
    !intentionsHtml.includes("data-intention-next") ||
    !intentionsHtml.includes("data-intention-count") ||
    new Set(intentionStandardSources).size !== tarotSpreadsPage.intentions.items.length ||
    new Set(intentionBloodSources).size !== tarotSpreadsPage.intentions.items.length ||
    intentionsHtml.includes('href="#"')
  ) {
    errors.push("intentions: the five-image gallery, honest link states, theme images, or mobile controls are incomplete");
  }
  tarotSpreadsPage.intentions.items.forEach((item) => {
    [item.label, item.title, item.copy, item.image.alt, item.image.bloodAlt].forEach((content) => {
      if (!intentionsHtml.includes(content)) errors.push(`intentions: content is missing for ${item.title} (${content})`);
    });
    [item.image.src, item.image.bloodSrc].forEach((source) => {
      const assetPath = resolve(rootDir, decodeURIComponent(source).replace(/^\/+/, ""));
      if (!existsSync(assetPath)) errors.push(`intentions: image asset is missing (${source})`);
    });
    if (item.route) {
      if (
        countMatches(new RegExp(`href="${item.route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"), intentionsHtml) !== 2 ||
        !intentionsHtml.includes(item.linkLabel)
      ) {
        errors.push(`intentions: live image and CTA routes are incomplete for ${item.title}`);
      }
    }
  });
  const decisionsStart = intentionsHtml.indexOf("Decisions and Crossroads");
  const decisionsEnd = decisionsStart >= 0
    ? intentionsHtml.indexOf("</article>", decisionsStart)
    : -1;
  const decisionsHtml = decisionsStart >= 0 && decisionsEnd > decisionsStart
    ? intentionsHtml.slice(decisionsStart, decisionsEnd)
    : "";
  if (
    !decisionsHtml.includes("Dedicated guide · Coming Soon") ||
    /<a\b/.test(decisionsHtml)
  ) {
    errors.push("intentions: Decisions and Crossroads must remain informative without a broken anchor");
  }
  [
    "scrollIntentionPathway",
    "setActiveIntention",
    "data-intention-pathway",
    "data-intention-previous",
    "data-intention-next",
    '"(max-width: 768px)"',
    'track?.addEventListener("scroll"',
    'pathway.addEventListener("focusin"'
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`intentions interaction: mobile gallery behavior is missing (${token})`);
  });
  const intentionsCssStart = css.indexOf("/* Choose a Tarot Spread by Intention: borderless editorial gallery */");
  const intentionsCssEnd = css.indexOf("/* How Card Positions Change a Reading: one card, three meanings */", intentionsCssStart);
  const intentionsCss = intentionsCssStart >= 0 && intentionsCssEnd > intentionsCssStart
    ? css.slice(intentionsCssStart, intentionsCssEnd)
    : "";
  [
    "grid-template-columns: repeat(6, minmax(0, 1fr))",
    "grid-column: span 2",
    "grid-column: span 3",
    "body.moon-mode.tarot-spreads-page .tarot-spreads-intentions",
    "body.blood-moon-mode.tarot-spreads-page .tarot-spreads-intentions",
    "height: clamp(220px, 19vw, 276px)",
    "object-fit: cover",
    "transform: scale(1.02)",
    "transform: translateY(-3px)",
    "transform: translateX(3px)",
    "font: 400 clamp(.86rem, 1vw, .95rem)/1.7 var(--body-font, \"DM Sans\", sans-serif)"
  ].forEach((token) => {
    if (!intentionsCss.includes(token)) errors.push(`intentions styles: editorial gallery treatment is missing (${token})`);
  });
  if (
    !/\.tarot-spreads-intentions__pathway\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/s.test(intentionsCss) ||
    /animation[^;]*(?:float|bob|pulse)/i.test(intentionsCss)
  ) {
    errors.push("intentions styles: pathways must remain borderless and free of continuous motion");
  }
  [
    "scroll-snap-type: x mandatory",
    "flex: 0 0 min(84vw, 510px)",
    "aspect-ratio: 16 / 10",
    "min-height: 44px",
    "body.tarot-spreads-page .tarot-spreads-intentions__grid {\n    scroll-behavior: auto !important;"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`intentions responsive styles: mobile or reduced-motion behavior is missing (${token})`);
  });

  const hermit = tarotCardDetails.find((card) => card.title === tarotSpreadsPage.positions.cardTitle);
  const hermitStandard = hermit?.image || hermit?.variants?.veilrise?.image;
  const hermitBlood = hermit?.bloodMoonImage || hermit?.variants?.veilfall?.image;
  if (
    !hermit ||
    countMatches(/class="tarot-spreads-positions__card"/g) !== 1 ||
    !html.includes(`data-standard-src="${hermitStandard}"`) ||
    !html.includes(`data-blood-src="${hermitBlood}"`) ||
    !html.includes('href="/tarot/the-hermit/"') ||
    countMatches(/data-card-position-tab=/g) !== 3 ||
    countMatches(/data-card-position-panel=/g) !== 3 ||
    countMatches(/role="tabpanel"/g) < 3 ||
    html.includes("tarot-spreads-positions__grid")
  ) {
    errors.push("positions: one-card, three-meaning structure or theme-aware artwork is incomplete");
  }
  tarotSpreadsPage.positions.examples.forEach((example) => {
    if (!html.includes(example.label) || !html.includes(example.context) || !html.includes(example.copy)) {
      errors.push(`positions: example is missing (${example.label})`);
    }
  });
  [
    "setCardPosition",
    "settleCardPositionPanels",
    "data-card-position-tab",
    "data-card-position-panel",
    "data-card-position-marker",
    '"ArrowRight"',
    '"ArrowLeft"',
    '"Home"',
    '"End"',
    "reducedMotionQuery.matches",
    "--position-active-index"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`positions interaction: required behavior is missing (${token})`);
  });
  [
    "/* How Card Positions Change a Reading: one card, three meanings */",
    "grid-template-columns: minmax(350px, .44fr) minmax(390px, .56fr)",
    "body.moon-mode.tarot-spreads-page .tarot-spreads-positions",
    "body.blood-moon-mode.tarot-spreads-page .tarot-spreads-positions",
    "pointer-events: none",
    "min-height: 46px",
    "transform: translateX(calc(var(--position-active-index) * 100%))",
    "font-family: var(--body-font, \"DM Sans\", sans-serif)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`positions styles: required one-card treatment is missing (${token})`);
  });

  const howToHtmlStart = html.indexOf('<section class="tarot-spreads-section tarot-spreads-how-to"');
  const howToHtmlEnd = html.indexOf('<section class="tarot-spreads-section tarot-spreads-patterns"', howToHtmlStart);
  const howToHtml = howToHtmlStart >= 0 && howToHtmlEnd > howToHtmlStart
    ? html.slice(howToHtmlStart, howToHtmlEnd)
    : "";
  if (
    countMatches(/data-question-story-tab=/g) !== 5 ||
    countMatches(/data-question-story-panel=/g) !== 5 ||
    countMatches(/class="tarot-spreads-how-to__panel(?: is-active)?"/g) !== 5 ||
    countMatches(/data-question-story-stage-index=/g) !== 5 ||
    countMatches(/class="tarot-spreads-how-to__stage-action"/g) !== 5 ||
    countMatches(/class="tarot-spreads-how-to__dossier-group"/g) !== 6 ||
    countMatches(/class="tarot-spreads-related-links__destination"/g) !== 3 ||
    countMatches(/class="tarot-spreads-related-links__icon"/g, howToHtml) !== 3 ||
    countMatches(/<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">/g, howToHtml) !== 3 ||
    !html.includes('role="tablist" aria-label="How to perform a tarot spread"') ||
    !html.includes("data-question-story-previous disabled") ||
    !html.includes("data-question-story-next") ||
    !html.includes("Active dossier · Form the Question") ||
    !generatorJs.includes('Array.from({ length: 10 }, () => "<i></i>").join("")') ||
    html.includes("tarot-spreads-how-to__grid") ||
    html.includes("<h3>Choosing the Spread</h3>") ||
    html.includes("<h3>Performing the Spread</h3>")
  ) {
    errors.push("how-to: five-stage archive dossier, mobile controls, ten-card layout cue, or related destinations are incomplete");
  }
  tarotSpreadsPage.howTo.stages.forEach((stage) => {
    [stage.title, stage.summary, stage.lead, stage.note]
      .filter(Boolean)
      .forEach((copy) => {
        if (!html.includes(copy)) errors.push(`how-to: stage content is missing (${stage.title}: ${copy})`);
      });
    [...(stage.guidance || []), ...(stage.examples || [])].forEach((copy) => {
      if (!html.includes(copy)) errors.push(`how-to: guidance is missing (${stage.title}: ${copy})`);
    });
    (stage.recommendations || []).forEach((item) => {
      if (!html.includes(item.label) || !html.includes(item.copy)) errors.push(`how-to: choosing guidance is missing (${item.label})`);
    });
    if (stage.action && (!html.includes(`href="${stage.action.href}"`) || !html.includes(stage.action.label))) {
      errors.push(`how-to: stage action is missing (${stage.action.label})`);
    }
  });
  tarotSpreadsPage.howTo.destinations.forEach((destination) => {
    if (!html.includes(destination.eyebrow) || !html.includes(destination.title) || !html.includes(destination.copy)) {
      errors.push(`how-to: related destination is missing (${destination.title})`);
    }
    const links = destination.links || [{ label: destination.cta, href: destination.href }];
    links.forEach((link) => {
      if (!html.includes(`href="${link.href}"`) || !html.includes(link.label)) errors.push(`how-to: destination link is missing (${link.label})`);
    });
  });
  if (!html.includes('href="/how-to-read-tarot-cards/">How to Read Tarot Cards <span aria-hidden="true">→</span></a>')) {
    errors.push("how-to: live How to Read Tarot learning link is missing");
  }
  [
    "setQuestionStoryStage",
    "settleQuestionStoryPanels",
    "questionStoryTransitionToken",
    "questionStoryPanelTrack",
    "scrollQuestionStoryTab",
    "data-question-story-tab",
    "data-question-story-panel",
    "data-question-story-previous",
    "data-question-story-next",
    '"ArrowRight"',
    '"ArrowLeft"',
    '"Home"',
    '"End"',
    "reducedMotionQuery.matches",
    "--story-progress",
    "preventScroll: true",
    'questionStory.classList.add("is-transitioning")',
    "questionStoryPanelTrack.animate",
    "getBoundingClientRect().height"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`how-to interaction: required behavior is missing (${token})`);
  });
  [
    "/* Question-to-Story Timeline */",
    "grid-template-columns: repeat(5, minmax(0, 1fr))",
    "/* Question-to-Story: Sliding Archive Dossier */",
    "grid-template-columns: minmax(0, .34fr) minmax(0, .66fr)",
    "grid-area: 1 / 1",
    ".tarot-spreads-how-to__dossier-lead",
    ".tarot-spreads-how-to__dossier-group",
    ".tarot-spreads-how-to__prompts",
    "counter-reset: dossier-guidance",
    ".question-story-layout-symbol--cross i:nth-child(10)",
    "body.moon-mode.tarot-spreads-page .tarot-spreads-how-to",
    "body.blood-moon-mode.tarot-spreads-page .tarot-spreads-how-to",
    "scroll-snap-type: x proximity",
    "min-height: 44px",
    "font-family: var(--body-font, \"DM Sans\", sans-serif)",
    "@keyframes question-story-deal",
    "body.tarot-spreads-page .tarot-spreads-how-to__panel[hidden]",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`how-to styles: required timeline treatment is missing (${token})`);
  });
  const howToGlassCssStart = css.indexOf("/* Question-to-Story: borderless smoked-glass refinement */");
  const howToGlassCssEnd = css.indexOf("/* Patterns to Notice: borderless pattern constellation */", howToGlassCssStart);
  const howToGlassCss = howToGlassCssStart >= 0 && howToGlassCssEnd > howToGlassCssStart
    ? css.slice(howToGlassCssStart, howToGlassCssEnd)
    : "";
  [
    "--story-glass-identity",
    "--story-glass-dossier",
    "--story-glass-control",
    "backdrop-filter: blur(14px) saturate(115%)",
    "-webkit-backdrop-filter: blur(14px) saturate(115%)",
    "grid-template-columns: minmax(0, .36fr) minmax(0, .64fr)",
    ".tarot-spreads-how-to__tab[aria-selected=\"true\"]",
    ".tarot-spreads-how-to__node::before",
    "content: none",
    "--story-tab-width: clamp(120px, 34vw, 160px)",
    "--story-tab-width: clamp(106px, 32vw, 132px)",
    "background: var(--story-glass-control)",
    ".tarot-spreads-how-to__stage-lead",
    "background: var(--story-glass-identity)",
    ".tarot-spreads-how-to__stage-detail",
    "background: var(--story-glass-dossier)",
    ".tarot-spreads-how-to__guidance li::before",
    "border-radius: 50%",
    "text-decoration: none",
    ".tarot-spreads-related-links__icon svg",
    "grid-template-columns: repeat(2, minmax(0, 1fr))",
    "transform: translateY(-4px)",
    "@media (max-width: 900px)",
    "@media (max-width: 640px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!howToGlassCss.includes(token)) errors.push(`how-to glass styles: required borderless treatment is missing (${token})`);
  });
  if (
    /border-(?:top|right|bottom|left):\s*1px/i.test(howToGlassCss) ||
    /text-decoration:\s*underline/i.test(howToGlassCss) ||
    !/\.tarot-spreads-how-to__tab\[aria-selected="true"\]\s*\{[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;[^}]*transform:\s*none;/s.test(howToGlassCss) ||
    !/\.tarot-spreads-how-to__tab\[aria-selected="true"\]\s+\.tarot-spreads-how-to__node::before\s*\{[^}]*opacity:\s*1;[^}]*transform:\s*scale\(1\);/s.test(howToGlassCss) ||
    !/\.tarot-spreads-how-to__stage-lead,\s*body\.tarot-spreads-page \.tarot-spreads-how-to__stage-detail\s*\{[^}]*border:\s*0;/s.test(howToGlassCss) ||
    !/\.tarot-spreads-related-links__destination,\s*body\.tarot-spreads-page \.tarot-spreads-related-links__destination:first-child,\s*body\.tarot-spreads-page \.tarot-spreads-related-links__destination:last-child\s*\{[^}]*border:\s*0;/s.test(howToGlassCss)
  ) {
    errors.push("how-to glass styles: dossier and destination surfaces must remain borderless and links must have no permanent underline");
  }
  const patternsStart = html.indexOf('<section class="tarot-spreads-section tarot-spreads-patterns"');
  const patternsEnd = html.indexOf('<section class="tarot-spreads-section tarot-spreads-comparison"', patternsStart);
  const patternsHtml = patternsStart >= 0 && patternsEnd > patternsStart ? html.slice(patternsStart, patternsEnd) : "";
  const patternsCssStart = css.indexOf("/* Patterns to Notice: borderless pattern constellation */");
  const patternsCssEnd = css.indexOf("body.tarot-spreads-page .tarot-spreads-comparison__tabs", patternsCssStart);
  const patternsCss = patternsCssStart >= 0 && patternsCssEnd > patternsCssStart ? css.slice(patternsCssStart, patternsCssEnd) : "";
  if (
    !patternsHtml.includes("spread-pattern-grid") ||
    countMatches(/class="spread-pattern"/g, patternsHtml) !== 6 ||
    countMatches(/class="spread-pattern__number"/g, patternsHtml) !== 6 ||
    countMatches(/class="spread-pattern__divider"/g, patternsHtml) !== 6 ||
    countMatches(/class="spread-pattern__example"/g, patternsHtml) !== 6 ||
    countMatches(/tabindex="0"/g, patternsHtml) !== 6 ||
    patternsHtml.includes("spread-pattern__icon") ||
    patternsHtml.includes("spread-pattern__symbol") ||
    patternsHtml.includes("<svg")
  ) {
    errors.push("patterns: six icon-free constellation points, focus targets, or examples are incomplete");
  }
  tarotSpreadsPage.patterns.items.forEach((item, index) => {
    [item.title, item.copy, item.example].forEach((content) => {
      if (!patternsHtml.includes(content)) errors.push(`patterns: initial educational content is missing (${item.title}: ${content})`);
    });
    if (
      !patternsHtml.includes(`data-pattern="${item.key}"`) ||
      !patternsHtml.includes(`>${String(index + 1).padStart(2, "0")}</span>`)
    ) {
      errors.push(`patterns: key or decorative sequence number is missing (${item.title})`);
    }
  });
  [
    "grid-template-columns: repeat(3, minmax(0, 1fr))",
    "column-gap: clamp(2rem, 4vw, 4rem)",
    "row-gap: clamp(2.625rem, 5vw, 4.5rem)",
    "border: 0",
    "background: transparent",
    "font: 600 clamp(3.5rem, 6vw, 6.5rem)/1 var(--body-font, \"DM Sans\", sans-serif)",
    "padding: clamp(4rem, 6.5vw, 6.75rem) 0 .5rem",
    "top: 0",
    "left: 0",
    "min-height: 2.08em",
    "width: 48px",
    "width: 70px",
    ".spread-pattern:focus-visible",
    "@media (hover: hover)",
    "@media (hover: none)",
    "@media (max-width: 960px)",
    "grid-template-columns: repeat(2, minmax(0, 1fr))",
    "@media (max-width: 767px)",
    "grid-auto-flow: column",
    "grid-auto-columns: 82%",
    "overflow-x: auto",
    "scroll-snap-type: x mandatory",
    "scroll-snap-align: start",
    "overscroll-behavior-inline: contain",
    "scrollbar-width: none",
    "-webkit-overflow-scrolling: touch",
    "@media (prefers-reduced-motion: reduce)",
    "body.moon-mode.tarot-spreads-page .tarot-spreads-patterns",
    "body.blood-moon-mode.tarot-spreads-page .tarot-spreads-patterns",
    "pointer-events: none"
  ].forEach((token) => {
    if (!patternsCss.includes(token)) errors.push(`patterns styles: required constellation treatment is missing (${token})`);
  });
  if (
    !/\.spread-pattern\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;/s.test(patternsCss) ||
    /border-top:/i.test(patternsCss) ||
    /animation[^;]*(?:float|bob|pulse|spin)/i.test(patternsCss)
  ) {
    errors.push("patterns styles: items must remain borderless, avoid long top rules, and use no continuous motion");
  }

  const comparisonStart = html.indexOf('<section class="tarot-spreads-section tarot-spreads-comparison"');
  const comparisonEnd = html.indexOf('<section class="tarot-faq', comparisonStart);
  const comparisonHtml = comparisonStart >= 0 && comparisonEnd > comparisonStart
    ? html.slice(comparisonStart, comparisonEnd)
    : "";
  if (
    (comparisonHtml.match(/data-spread-comparison-tab=/g) || []).length !== 2 ||
    (comparisonHtml.match(/data-spread-comparison-panel=/g) || []).length !== 2 ||
    !comparisonHtml.includes(tarotSpreadsPage.comparison.conclusion) ||
    !comparisonHtml.includes(tarotSpreadsPage.comparison.conclusionSupport) ||
    !comparisonHtml.includes('role="tablist"') ||
    !comparisonHtml.includes('role="tabpanel"') ||
    !comparisonHtml.includes('aria-hidden="true" inert')
  ) {
    errors.push("comparison: accessible toggle, both initial panels, or conclusion is missing");
  }
  [
    tarotSpreadsPage.comparison.simple.description,
    tarotSpreadsPage.comparison.simple.recommendation,
    tarotSpreadsPage.comparison.inDepth.description,
    tarotSpreadsPage.comparison.inDepth.recommendation,
    ...tarotSpreadsPage.comparison.simple.items,
    ...tarotSpreadsPage.comparison.inDepth.items
  ].forEach((item) => {
    if (!html.includes(item)) errors.push(`comparison: content is missing (${item})`);
  });
  [
    "One Card",
    "Three Cards",
    "Five Cards",
    "Celtic Cross",
    "comparison-spread--one",
    "comparison-spread--three",
    "comparison-spread--five",
    "comparison-spread--celtic"
  ].forEach((token) => {
    if (!comparisonHtml.includes(token)) errors.push(`comparison: required spread visual is missing (${token})`);
  });
  if (
    (comparisonHtml.match(/class="tarot-spreads-comparison__card/g) || []).length !== 19 ||
    (comparisonHtml.match(/comparison-spread__position--/g) || []).length !== 15
  ) {
    errors.push("comparison: simple and in-depth diagrams must render one, three, five, and ten card backs");
  }
  [
    "--comparison-active-index",
    ".tarot-spreads-comparison__tabs::before",
    "grid-template-columns: minmax(0, 42%) minmax(0, 58%)",
    "grid-template-areas:",
    '". top ."',
    '"left center right"',
    '". bottom ."',
    "aspect-ratio: 1 / 1",
    "width: clamp(42px, 3.7vw, 44px)",
    ".comparison-spread--five .comparison-spread__position--3",
    "transform: translateY(-3px) scale(1.02)",
    "aspect-ratio: 1.15 / 1",
    "width: clamp(28px, 2.4vw, 30px)",
    ".comparison-spread--celtic .comparison-spread__position--2",
    "transform: rotate(90deg)",
    "top: 84%",
    "top: 63%",
    "top: 42%",
    "left: 88%",
    "overflow: visible",
    "pointer-events: none",
    "width: clamp(34px, 10vw, 42px)",
    "width: clamp(24px, 7vw, 28px)",
    ".tarot-spreads-comparison__characteristics li::before",
    "@media (max-width: 900px)",
    "@media (max-width: 560px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`comparison styles: required responsive comparison treatment is missing (${token})`);
  });
  const previewGeometryStart = css.indexOf("body.tarot-spreads-page .comparison-spread--five .comparison-spread__stage");
  const previewGeometryEnd = css.indexOf("body.tarot-spreads-page .tarot-spreads-comparison__copy", previewGeometryStart);
  const previewGeometryCss = previewGeometryStart >= 0 && previewGeometryEnd > previewGeometryStart
    ? css.slice(previewGeometryStart, previewGeometryEnd)
    : "";
  if (
    /margin(?:-[a-z]+)?:\s*-/i.test(previewGeometryCss) ||
    /overflow:\s*(?:hidden|clip)/i.test(previewGeometryCss) ||
    !previewGeometryCss.includes("grid-area: top") ||
    !previewGeometryCss.includes("grid-area: left") ||
    !previewGeometryCss.includes("grid-area: center") ||
    !previewGeometryCss.includes("grid-area: right") ||
    !previewGeometryCss.includes("grid-area: bottom")
  ) {
    errors.push("comparison geometry: previews must use the dedicated five-card grid and unclipped Celtic stage without negative offsets");
  }
  const celticPreviewCoordinates = [
    [35, 50, 0],
    [35, 50, 90],
    [35, 80, 0],
    [10, 50, 0],
    [35, 18, 0],
    [60, 50, 0],
    [88, 84, 0],
    [88, 63, 0],
    [88, 42, 0],
    [88, 20, 0]
  ];
  [
    { name: "narrow mobile", width: 135, height: 205, cardWidth: 24 },
    { name: "mobile", width: 170, height: 205, cardWidth: 27.3 },
    { name: "wide mobile", width: 224, height: 205, cardWidth: 28 },
    { name: "desktop constrained", width: 219, height: 220, cardWidth: 30 },
    { name: "desktop", width: 250, height: 220, cardWidth: 30 }
  ].forEach((scenario) => {
    const boxes = celticPreviewCoordinates.map(([x, y, rotation]) => {
      const verticalWidth = scenario.cardWidth;
      const verticalHeight = scenario.cardWidth * 1.5;
      return {
        x: scenario.width * x / 100,
        y: scenario.height * y / 100,
        width: rotation === 90 ? verticalHeight : verticalWidth,
        height: rotation === 90 ? verticalWidth : verticalHeight
      };
    });
    boxes.forEach((box, index) => {
      if (
        box.x - box.width / 2 < -0.01 ||
        box.x + box.width / 2 > scenario.width + 0.01 ||
        box.y - box.height / 2 < -0.01 ||
        box.y + box.height / 2 > scenario.height + 0.01
      ) {
        errors.push(`comparison geometry: Celtic Cross card ${index + 1} clips in ${scenario.name}`);
      }
    });
    boxes.forEach((first, firstIndex) => {
      boxes.slice(firstIndex + 1).forEach((second, offset) => {
        const secondIndex = firstIndex + offset + 1;
        if (firstIndex === 0 && secondIndex === 1) return;
        const overlapX = (first.width + second.width) / 2 - Math.abs(first.x - second.x);
        const overlapY = (first.height + second.height) / 2 - Math.abs(first.y - second.y);
        if (overlapX > 0.01 && overlapY > 0.01) {
          errors.push(`comparison geometry: Celtic Cross cards ${firstIndex + 1} and ${secondIndex + 1} collide in ${scenario.name}`);
        }
      });
    });
  });
  [
    { name: "mobile", stage: 205, cardWidth: 42, columnGap: 10, rowGap: 8 },
    { name: "constrained", stage: 219, cardWidth: 42, columnGap: 10, rowGap: 8 },
    { name: "expanded", stage: 220, cardWidth: 44, columnGap: 14, rowGap: 10 }
  ].forEach((scenario) => {
    const totalWidth = scenario.cardWidth * 3 + scenario.columnGap * 2;
    const totalHeight = scenario.cardWidth * 4.5 + scenario.rowGap * 2;
    if (totalWidth > scenario.stage || totalHeight > scenario.stage) {
      errors.push(`comparison geometry: five-card grid exceeds its ${scenario.name} stage`);
    }
    const centerWidth = scenario.cardWidth * 1.02;
    const centerHeight = scenario.cardWidth * 1.5 * 1.02;
    const horizontalClearance = scenario.cardWidth + scenario.columnGap - (scenario.cardWidth + centerWidth) / 2;
    const upperClearance = scenario.cardWidth * 1.5 + scenario.rowGap - 3 - (scenario.cardWidth * 1.5 + centerHeight) / 2;
    if (horizontalClearance <= 0 || upperClearance <= 0) {
      errors.push(`comparison geometry: emphasized center card collides in the ${scenario.name} five-card grid`);
    }
  });
  [
    'comparison.dataset.activeComparison = key',
    'comparison.style.setProperty("--comparison-active-index", String(activeIndex))',
    'tabs[targetIndex].focus({ preventScroll: true })',
    'panel.inert = !active'
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`comparison behavior: required accessible toggle behavior is missing (${token})`);
  });

  if (
    countMatches(/data-education-faq-item/g) !== tarotSpreadsPage.faq.items.length ||
    countMatches(/data-education-faq-button/g) !== tarotSpreadsPage.faq.items.length ||
    countMatches(/class="tarot-faq__answer"/g) !== tarotSpreadsPage.faq.items.length
  ) {
    errors.push("faq: expected all shared accessible questions and answers");
  }
  tarotSpreadsPage.faq.items.forEach((item) => {
    if (!html.includes(item.question) || !html.includes(item.answer)) errors.push(`faq: visible content is missing (${item.question})`);
  });
  [
    "[data-education-faq]",
    "items.forEach((candidate) => setItemState(candidate, candidate === item && willOpen))",
    'button.setAttribute("aria-expanded", String(isOpen))',
    'answer.setAttribute("aria-hidden", String(!isOpen))',
    "answer.inert = !isOpen",
    'icon.textContent = isOpen ? "−" : "+"'
  ].forEach((token) => {
    if (!educationJs.includes(token)) errors.push(`faq interaction: required shared single-open behavior is missing (${token})`);
  });
  [
    "body.tarot-meanings-page .tarot-education-page .tarot-education-faq .tarot-faq__inner",
    "grid-template-columns: minmax(15rem, .75fr) minmax(0, 1.25fr)",
    "border-radius: 14px",
    ".tarot-faq__trigger:focus-visible",
    "@media (max-width: 820px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!educationCss.includes(token)) errors.push(`faq styles: required shared treatment is missing (${token})`);
  });

  [
    'href="/one-card-tarot-reading"',
    'href="/daily-tarot-reading"',
    'href="/tarot/topics/love-relationships/"',
    'href="/tarot/topics/career-purpose/"',
    'href="/tarot/topics/advice-personal-growth/"',
    'href="/tarot/major-arcana/"',
    'href="/tarot/minor-arcana/"',
    'href="/journal"',
    'href="/"',
    'href="/free-tarot-reading"'
  ].forEach((token) => {
    if (!html.includes(token)) errors.push(`internal links: required live destination is missing (${token})`);
  });

  [
    "body.tarot-spreads-page .tarot-spreads-page-content",
    "background: transparent",
    ".tarot-spreads-hero",
    ".spread-filter-rail__indicator",
    "--observatory-accent",
    "backdrop-filter: blur(18px)",
    ".tarot-spread-observatory__workspace",
    ".tarot-spread-diagram",
    ".tarot-spreads-intentions__grid",
    ".tarot-spreads-comparison__viewport",
    "@media (max-width: 768px)",
    "overflow-x: auto",
    "scroll-snap-type: x mandatory",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`styles: required responsive scaffold is missing (${token})`);
  });
  if (
    /^\s*\.tarot-spreads-/m.test(css) ||
    /body\.(?:sun|moon|blood-moon)-mode\.tarot-spreads-page\s*\{[^}]*background\s*:/.test(css) ||
    /min-height:\s*100vh/.test(css)
  ) {
    errors.push("styles: page rules must stay scoped and must not replace the global environmental background");
  }

  [
    "data-spread-filter",
    "data-spread-selector",
    "data-spread-panel",
    "aria-pressed",
    "positionFilterIndicator",
    "scrollFilterIntoView",
    "ResizeObserver",
    "aria-selected",
    "aria-hidden",
    "inert",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "reducedMotionQuery"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`interaction: required enhancement is missing (${token})`);
  });

  const guideRecord = libraryJs.match(/\{ key: "spreads"[\s\S]*?\},/);
  const expectedLibraryDescription = "Discover layouts for daily guidance, love, career, reflection, decisions, and deeper insight. Learn how card positions shape a reading and choose a spread that matches your question.";
  if (
    !guideRecord ||
    !guideRecord[0].includes('route: "/tarot-spreads/"') ||
    !guideRecord[0].includes("available: true") ||
    !guideRecord[0].includes('ctaLabel: "Explore Tarot Spreads"') ||
    !guideRecord[0].includes(expectedLibraryDescription)
  ) {
    errors.push("library card: Tarot Spreads copy, route, live state, or descriptive CTA is incomplete");
  }
  if (
    !libraryHtml.includes('data-tarot-guide="spreads"') ||
    !libraryHtml.includes('href="/tarot-spreads/"') ||
    !libraryHtml.includes(expectedLibraryDescription) ||
    !libraryHtml.includes("Explore Tarot Spreads")
  ) {
    errors.push("library card: complete Tarot Spreads content must remain available in the initial HTML");
  }
  [
    '.tarot-guide[data-tarot-guide="spreads"]>.tarot-guide__link { display: grid',
    "grid-template-columns: minmax(220px,3fr) minmax(0,5fr)",
    '.tarot-guide[data-tarot-guide="spreads"]>.tarot-guide__link>.tarot-guide__media { grid-column: 1',
    '.tarot-guide[data-tarot-guide="spreads"]>.tarot-guide__link>.tarot-guide__content { grid-column: 2',
    '.tarot-guide[data-tarot-guide="spreads"]>.tarot-guide__link { display: flex; flex-direction: column'
  ].forEach((token) => {
    if (!libraryCss.includes(token)) errors.push(`library card: responsive Tarot Spreads layout is missing (${token})`);
  });
  if (
    !libraryJs.includes('class="tarot-guide__spark" aria-hidden="true">✦</span>') ||
    !libraryJs.includes('class="tarot-guide__arrow" aria-hidden="true">→</span>') ||
    !libraryHtml.includes('class="tarot-guide__status tarot-guide__cta"')
  ) {
    errors.push("library card: live Tarot Spreads shared CTA treatment is incomplete");
  }

  if (countMatches(new RegExp(`<loc>${canonical}</loc>`, "g"), sitemap) !== 1) {
    errors.push("sitemap: expected exactly one canonical Tarot Spreads URL");
  }
  if (/Disallow:\s*\/tarot-spreads\/?/i.test(robots)) {
    errors.push("robots: Tarot Spreads route must remain indexable");
  }
}

if (errors.length) {
  console.error(`Tarot Spreads validation failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("Tarot Spreads validation passed for the horizontal gallery, split tabletop workspace, and Question-to-Story timeline.");
}
