import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { minorArcanaPage } from "../data/minor-arcana.mjs";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { SITE_ORIGIN } from "./card-page-helpers.mjs";
import {
  buildMinorArcanaCards,
  getMinorArcanaOutputPath,
  getMinorArcanaRoute,
  validateMinorArcanaData
} from "./minor-arcana-page-helpers.mjs";
import { validateRenderedTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = getMinorArcanaOutputPath(rootDir, minorArcanaPage);
const route = getMinorArcanaRoute(minorArcanaPage);
const canonical = `${SITE_ORIGIN}${route}`;
const errors = validateMinorArcanaData(minorArcanaPage, tarotCardDetails, { rootDir, checkGenerated: true });

if (!existsSync(outputPath)) {
  errors.push(`route: generated page is missing at ${outputPath}`);
} else {
  const html = readFileSync(outputPath, "utf8");
  const css = readFileSync(resolve(rootDir, "css/tarot-minor-arcana.css"), "utf8");
  const tarotCss = readFileSync(resolve(rootDir, "css/tarot.css"), "utf8");
  const sharedCss = readFileSync(resolve(rootDir, "css/tarot-major-arcana.css"), "utf8");
  const js = readFileSync(resolve(rootDir, "js/tarot-minor-arcana.js"), "utf8");
  const sharedJs = readFileSync(resolve(rootDir, "js/tarot-major-arcana.js"), "utf8");
  const hubScript = readFileSync(resolve(rootDir, "js/tarot.js"), "utf8");
  const sitemap = readFileSync(resolve(rootDir, "sitemap.xml"), "utf8");
  const cards = buildMinorArcanaCards(minorArcanaPage, tarotCardDetails);
  const countMatches = (pattern, value = html) => (value.match(pattern) || []).length;

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

  if (countMatches(/<h1(?:\s|>)/g) !== 1 || !html.includes("<h1 id=\"minor-arcana-title\">Minor Arcana Explained</h1>")) {
    errors.push("headings: expected exactly one Minor Arcana H1");
  }
  const requiredHeadings = [
    "Explore the 56 Minor Arcana Cards",
    "What Is the Minor Arcana?",
    "Understanding the Four Tarot Suits",
    "How Numbers Shape the Minor Arcana",
    "Understanding Minor Arcana Court Cards",
    "Upright and Reversed Minor Arcana Meanings",
    "How Minor Arcana Cards Work in Readings",
    "Major Arcana vs. Minor Arcana",
    "Minor Arcana Frequently Asked Questions"
  ];
  let previousHeadingIndex = -1;
  requiredHeadings.forEach((heading) => {
    const index = html.indexOf(`>${heading}</h2>`);
    if (index < 0) errors.push(`headings: missing H2 "${heading}"`);
    if (index >= 0 && index < previousHeadingIndex) errors.push(`headings: "${heading}" is out of order`);
    previousHeadingIndex = Math.max(previousHeadingIndex, index);
  });

  if (!html.includes(`<title>${minorArcanaPage.seo.title.replaceAll("&", "&amp;")}</title>`)) errors.push("seo: title is incorrect");
  if (!html.includes(`content="${minorArcanaPage.seo.description}"`)) errors.push("seo: meta description is missing");
  [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image:width" content="${minorArcanaPage.hero.image.width}" />`,
    `<meta property="og:image:height" content="${minorArcanaPage.hero.image.height}" />`,
    '<meta name="twitter:card" content="summary_large_image" />'
  ].forEach((token) => {
    if (!html.includes(token)) errors.push(`seo: metadata is missing (${token})`);
  });
  if (html.includes('content="noindex') || /"@type":"(?:Product|Review|Course|Article|QAPage)"/.test(html)) {
    errors.push("seo: page is non-indexable or contains unsupported schema");
  }

  const breadcrumb = parseSchema("minor-arcana-breadcrumb-schema");
  const webPage = parseSchema("minor-arcana-webpage-schema");
  const faqPage = parseSchema("minor-arcana-faq-schema");
  if (breadcrumb?.["@type"] !== "BreadcrumbList" || breadcrumb?.itemListElement?.length !== 3) {
    errors.push("schema: BreadcrumbList must include Home, Tarot, and Minor Arcana");
  }
  if (webPage?.["@type"] !== "WebPage" || webPage?.url !== canonical) errors.push("schema: WebPage canonical URL is incorrect");
  if (faqPage?.["@type"] !== "FAQPage" || faqPage?.mainEntity?.length !== 7) errors.push("schema: FAQPage must match seven visible items");
  minorArcanaPage.faq.items.forEach((item, index) => {
    if (faqPage?.mainEntity?.[index]?.name !== item.question || faqPage?.mainEntity?.[index]?.acceptedAnswer?.text !== item.answer) {
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
    '<link rel="stylesheet" href="/css/animations.css" />',
    '<script src="/js/app.js"></script>',
    '<script type="module" src="/src/public/public-auth-nav.js"></script>'
  ].forEach((token) => {
    if (!html.includes(token)) errors.push(`shared shell: required Major Arcana architecture is missing (${token})`);
  });
  if (/<site-(?:header|footer)>|\/js\/(?:components|theme)\.js|\/assets\/icons\/brand\/logo\.svg/.test(html)) {
    errors.push("shared shell: dead custom-element shell or missing legacy asset references remain");
  }

  validateRenderedTarotEducationNavigation(html, { activeKey: "minor-arcana", rootDir })
    .forEach((error) => errors.push(`education navigation: ${error}`));

  if (
    !html.includes("tarot-education-hero--immersive") ||
    !html.includes("minor-arcana-hero") ||
    !html.includes("major-arcana-hero__image") ||
    !html.includes('loading="eager" decoding="async" fetchpriority="high"') ||
    !html.includes('href="#explore-minor-arcana">Explore the 56 Cards')
  ) {
    errors.push("hero: two-layer structure, priority image, or CTA is incomplete");
  }
  [...minorArcanaPage.hero.paragraphs, ...minorArcanaPage.hero.facts].forEach((content) => {
    if (!html.includes(content)) errors.push(`hero: required initial content is missing (${content})`);
  });

  if (
    countMatches(/data-minor-card-slide/g) !== 56 ||
    countMatches(/data-minor-card-select/g) !== 56 ||
    countMatches(/data-minor-filter="/g) !== 6 ||
    !html.includes('id="explore-minor-arcana"') ||
    !html.includes('href="/tarot">Browse the Tarot Meanings Library</a>')
  ) {
    errors.push("carousel: expected 56 semantic slides, six filters, and the library route");
  }
  const suitCounts = new Map();
  cards.forEach((card) => {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
    [card.title, card.suit, card.rank, ...card.keywords, card.summary, `href="${card.route}"`, `Explore ${card.title}’s Full Meaning`].forEach((token) => {
      if (!html.includes(token)) errors.push(`carousel: content or route is missing for ${card.title} (${token})`);
    });
    if (!html.includes(`data-standard-src="${card.image}"`) || !html.includes(`data-blood-src="${card.bloodMoonImage}"`)) {
      errors.push(`carousel: themed artwork mapping is missing for ${card.title}`);
    }
  });
  ["Wands", "Cups", "Swords", "Pentacles"].forEach((suit) => {
    if (suitCounts.get(suit) !== 14) errors.push(`carousel: ${suit} must contain 14 cards`);
  });
  if (countMatches(/class="major-arcana-slide__image"[\s\S]*?loading="lazy"/g) < 53) {
    errors.push("performance: below-fold carousel art must lazy-load");
  }

  const foundationsStart = html.indexOf('<section class="major-arcana-section major-arcana-overview major-arcana-foundations"');
  const foundationsEnd = foundationsStart >= 0 ? html.indexOf("</section>", foundationsStart) : -1;
  const foundationsHtml = foundationsStart >= 0 && foundationsEnd > foundationsStart ? html.slice(foundationsStart, foundationsEnd) : "";
  if (
    !foundationsHtml.includes('id="what-is-the-minor-arcana"') ||
    (foundationsHtml.match(/major-arcana-foundations__card major-arcana-foundations__card--/g) || []).length !== 3 ||
    (foundationsHtml.match(/data-major-theme-image/g) || []).length !== 3
  ) {
    errors.push("foundations: expected three linked, theme-aware concept cards");
  }
  minorArcanaPage.overview.paragraphs.forEach((paragraph) => {
    if (!foundationsHtml.replace(/<[^>]+>/g, "").includes(paragraph)) errors.push("foundations: body copy must remain in initial HTML");
  });
  minorArcanaPage.overview.concepts.forEach((concept) => {
    [concept.title, concept.copy, `href="${concept.route}"`, concept.image.src, concept.image.bloodMoonSrc].forEach((token) => {
      if (!foundationsHtml.includes(token)) errors.push(`foundations: concept is incomplete (${concept.title})`);
    });
  });

  const suitsStart = html.indexOf('<section class="major-arcana-section minor-suits"');
  const suitsEnd = suitsStart >= 0 ? html.indexOf("</section>", suitsStart) : -1;
  const suitsHtml = suitsStart >= 0 && suitsEnd > suitsStart ? html.slice(suitsStart, suitsEnd) : "";
  if (
    countMatches(/data-minor-suit-tab/g, suitsHtml) !== 4 ||
    countMatches(/data-minor-suit-panel/g, suitsHtml) !== 4 ||
    countMatches(/class="minor-suit-selector__portal"/g, suitsHtml) !== 4 ||
    countMatches(/class="minor-suit-selector__icon"/g, suitsHtml) !== 4 ||
    countMatches(/class="minor-suit-selector__name"/g, suitsHtml) !== 4 ||
    countMatches(/class="minor-suit-selector__element"/g, suitsHtml) !== 4 ||
    countMatches(/data-minor-suit-progress="/g, suitsHtml) !== 4 ||
    !suitsHtml.includes('class="minor-suit-selector" aria-label="Explore the four Minor Arcana suits"') ||
    !suitsHtml.includes('role="tablist" aria-label="Choose a Minor Arcana suit"') ||
    !suitsHtml.includes('data-minor-suit-previous') ||
    !suitsHtml.includes('data-minor-suit-next') ||
    !suitsHtml.includes("Select a suit to explore its element and themes.") ||
    suitsHtml.includes("minor-suits__tabs")
  ) {
    errors.push("suits: expected four symbol-first portal tabs, mobile controls, and four preserved panels");
  }
  minorArcanaPage.suits.items.forEach((suit) => {
    [suit.name, suit.element, ...suit.themes, ...suit.paragraphs, suit.progression].forEach((content) => {
      if (!html.includes(content)) errors.push(`suits: preserved content is missing for ${suit.name}`);
    });
  });

  const numbersStart = html.indexOf('<section class="major-arcana-section minor-numbers minor-number-patterns"');
  const numbersEnd = numbersStart >= 0 ? html.indexOf("</section>", numbersStart) : -1;
  const numbersHtml = numbersStart >= 0 && numbersEnd > numbersStart ? html.slice(numbersStart, numbersEnd) : "";
  if (
    !numbersHtml.includes('id="minor-number-patterns"') ||
    !numbersHtml.includes('aria-labelledby="minor-number-patterns-heading"') ||
    !numbersHtml.includes("Patterns Across the Suits") ||
    !numbersHtml.includes("How Numbers Shape the Minor Arcana") ||
    !numbersHtml.includes(minorArcanaPage.numbers.introduction) ||
    countMatches(/data-minor-number-tab=/g, numbersHtml) !== 10 ||
    countMatches(/data-minor-number-panel=/g, numbersHtml) !== 10 ||
    countMatches(/class="minor-number-patterns__option/g, numbersHtml) !== 10 ||
    countMatches(/data-minor-number-card/g, numbersHtml) !== 40 ||
    countMatches(/class="minor-numbers__card-image"/g, numbersHtml) !== 40 ||
    countMatches(/href="\/tarot\/[^"]+\/"/g, numbersHtml) !== 40 ||
    countMatches(/aria-selected="true"/g, numbersHtml) !== 1 ||
    countMatches(/tabindex="0"/g, numbersHtml) !== 1 ||
    countMatches(/class="minor-numbers__panel is-active"/g, numbersHtml) !== 1 ||
    countMatches(/aria-hidden="false"/g, numbersHtml) !== 1 ||
    countMatches(/\sinert/g, numbersHtml) !== 9 ||
    !numbersHtml.includes('class="minor-number-patterns__selector"') ||
    !numbersHtml.includes('class="minor-number-patterns__rail" role="tablist"') ||
    /minor-numbers__(?:tabs|suits|value)/.test(numbersHtml)
  ) {
    errors.push("numbers: expected the scoped selector rail, one active pattern, and forty image-led linked cards");
  }
  minorArcanaPage.numbers.items.forEach((number) => {
    [number.pattern, ...Object.values(number.readings)].forEach((content) => {
      if (!html.includes(content)) errors.push(`numbers: initial explanation is missing for ${number.label}`);
    });
    if (
      !numbersHtml.includes(`id="minor-number-tab-${number.key}"`) ||
      !numbersHtml.includes(`aria-controls="minor-number-panel-${number.key}"`) ||
      !numbersHtml.includes(`id="minor-number-panel-${number.key}"`) ||
      !numbersHtml.includes(`aria-labelledby="minor-number-tab-${number.key}"`)
    ) {
      errors.push(`numbers: reciprocal tab and panel semantics are missing for ${number.label}`);
    }
    const rank = number.rank || "Ace";
    ["Wands", "Cups", "Swords", "Pentacles"].forEach((suit) => {
      const card = cards.find((candidate) => candidate.title === `${rank} of ${suit}`);
      if (!card || !numbersHtml.includes(card.title) || !numbersHtml.includes(`href="${card.route}"`)) {
        errors.push(`numbers: canonical card or route is missing for ${rank} of ${suit}`);
      }
    });
  });

  const courtsStart = html.indexOf('<section class="major-arcana-section minor-courts minor-court-cards"');
  const courtsEnd = courtsStart >= 0 ? html.indexOf("</section>", courtsStart) : -1;
  const courtsHtml = courtsStart >= 0 && courtsEnd > courtsStart ? html.slice(courtsStart, courtsEnd) : "";
  if (
    !courtsHtml.includes('id="minor-court-cards"') ||
    !courtsHtml.includes('aria-labelledby="minor-court-cards-heading"') ||
    !courtsHtml.includes("The Living Court") ||
    !courtsHtml.includes("Understanding Minor Arcana Court Cards") ||
    !courtsHtml.includes(minorArcanaPage.courts.introduction) ||
    countMatches(/data-minor-court-tab=/g, courtsHtml) !== 4 ||
    countMatches(/data-minor-court-panel=/g, courtsHtml) !== 4 ||
    countMatches(/data-minor-court-rank-option=/g, courtsHtml) !== 4 ||
    countMatches(/data-minor-court-role=/g, courtsHtml) !== 16 ||
    countMatches(/data-minor-court-progress=/g, courtsHtml) !== 16 ||
    countMatches(/class="minor-court-cards__card-image"/g, courtsHtml) !== 16 ||
    countMatches(/data-standard-src=/g, courtsHtml) !== 16 ||
    countMatches(/data-blood-src=/g, courtsHtml) !== 16 ||
    countMatches(/class="minor-court-cards__link"/g, courtsHtml) !== 16 ||
    countMatches(/aria-selected="true"/g, courtsHtml) !== 1 ||
    countMatches(/aria-pressed="true"/g, courtsHtml) !== 1 ||
    countMatches(/class="minor-court-cards__panel minor-court-cards__panel--wands is-active"/g, courtsHtml) !== 1 ||
    countMatches(/\sinert/g, courtsHtml) !== 3 ||
    !courtsHtml.includes('data-minor-court-previous') ||
    !courtsHtml.includes('data-minor-court-next') ||
    !courtsHtml.includes('class="minor-court-cards__progression"') ||
    /minor-courts__(?:tabs|panel|rank|card-image)/.test(courtsHtml)
  ) {
    errors.push("courts: expected the scoped suit selector, sixteen borderless roles, progression line, and mobile controls");
  }
  minorArcanaPage.courts.suits.forEach((suit) => {
    const suitKey = suit.toLowerCase();
    if (
      !courtsHtml.includes(`id="minor-court-tab-${suitKey}"`) ||
      !courtsHtml.includes(`aria-controls="minor-court-panel-${suitKey}"`) ||
      !courtsHtml.includes(`id="minor-court-panel-${suitKey}"`) ||
      !courtsHtml.includes(`aria-labelledby="minor-court-tab-${suitKey}"`)
    ) {
      errors.push(`courts: reciprocal suit tab and panel semantics are missing for ${suit}`);
    }
    minorArcanaPage.courts.ranks.forEach((rank) => {
      const card = cards.find((candidate) => candidate.title === `${rank.name} of ${suit}`);
      if (
        !card ||
        !courtsHtml.includes(`id="minor-court-role-${suitKey}-${rank.key}"`) ||
        !courtsHtml.includes(card.title) ||
        !courtsHtml.includes(`href="${card.route}"`) ||
        !courtsHtml.includes(`data-standard-src="${card.image}"`) ||
        !courtsHtml.includes(`data-blood-src="${card.bloodMoonImage}"`)
      ) {
        errors.push(`courts: canonical content, route, or themed artwork is missing for ${rank.name} of ${suit}`);
      }
    });
  });
  minorArcanaPage.courts.ranks.forEach((rank) => {
    [rank.themes, rank.copy].forEach((content) => {
      if (!courtsHtml.includes(content)) errors.push(`courts: ${rank.name} explanation is missing`);
    });
  });

  if (
    countMatches(/data-major-orientation-option/g) !== 2 ||
    !html.includes("Eight of Cups shown <span data-major-orientation-caption>upright</span>") ||
    !html.includes("--orientation-rotation") && !sharedCss.includes("--orientation-rotation")
  ) {
    errors.push("orientation: upright/reversed interaction or real artwork rotation is incomplete");
  }
  [minorArcanaPage.orientation.upright, minorArcanaPage.orientation.reversed].forEach((state) => {
    [state.copy, ...state.themes].forEach((content) => {
      if (!html.includes(content)) errors.push(`orientation: ${state.label} content is missing`);
    });
  });

  if (
    (html.match(/class="major-arcana-readings__concepts"/g) || []).length !== 1 ||
    (html.match(/class="major-arcana-reading-example"/g) || []).length !== 1 ||
    (html.match(/class="major-arcana-reading__major-image"/g) || []).length !== 3
  ) {
    errors.push("readings: expected three concepts and one compact three-card example");
  }
  minorArcanaPage.readings.concepts.forEach((concept) => {
    if (!html.includes(concept.title) || !html.includes(concept.copy)) errors.push(`readings: concept is missing (${concept.title})`);
  });

  const comparisonStart = html.indexOf('<section class="major-arcana-section major-minor-showcase"');
  const comparisonEnd = comparisonStart >= 0 ? html.indexOf("</section>", comparisonStart) : -1;
  const comparisonHtml = comparisonStart >= 0 && comparisonEnd > comparisonStart ? html.slice(comparisonStart, comparisonEnd) : "";
  if (
    !comparisonHtml.includes('data-mode="minor"') ||
    (comparisonHtml.match(/data-major-minor-tab="/g) || []).length !== 2 ||
    (comparisonHtml.match(/data-major-minor-panel="/g) || []).length !== 2 ||
    (comparisonHtml.match(/data-major-minor-card="/g) || []).length !== 8 ||
    !comparisonHtml.includes('aria-selected="true" aria-controls="major-minor-minor-panel"') ||
    !comparisonHtml.includes('href="/tarot/major-arcana/"')
  ) {
    errors.push("comparison: default Minor toggle, both panels, eight cards, or Major return route is incomplete");
  }
  if (!sharedJs.includes('majorMinorRoot.dataset.mode === "minor"')) {
    errors.push("comparison: shared interaction must honor the page’s initial Minor mode");
  }

  if (countMatches(/data-major-faq-item/g) !== 7 || countMatches(/class="tarot-faq__answer"/g) !== 7) {
    errors.push("faq: expected seven accessible questions and answers");
  }
  minorArcanaPage.faq.items.forEach((item) => {
    if (!html.includes(item.question) || !html.includes(item.answer)) errors.push(`faq: visible content is missing for ${item.question}`);
  });

  [
    'href="#explore-minor-arcana">Explore All Minor Arcana Cards',
    'href="/">Begin a Tarot Reading',
    'href="/tarot/major-arcana/">Explore the Major Arcana',
    "Tarot Spreads · Coming Soon"
  ].forEach((token) => {
    if (!html.includes(token)) errors.push(`internal links: required closing destination or honest status is missing (${token})`);
  });
  if (/href="\/tarot\/spreads\/?"/.test(html)) errors.push("internal links: unavailable Tarot Spreads route must not be linked");

  [
    ".minor-arcana-page",
    ".minor-arcana-filters",
    ".minor-suits",
    ".minor-suit-selector__portal",
    ".minor-suit-selector__option.is-active",
    ".minor-suit-selector__mobile-controls",
    ".minor-numbers",
    ".minor-number-patterns",
    ".minor-number-patterns__rail",
    ".minor-number-patterns__cards",
    ".minor-courts",
    ".minor-court-cards",
    ".minor-court-cards__procession",
    ".minor-court-cards__progression",
    ".minor-court-cards__rank-selector",
    "scroll-snap-type: x mandatory",
    "@media (max-width: 768px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`styles: required scoped or responsive treatment is missing (${token})`);
  });
  [
    ".tarot-education-nav",
    ".tarot-education-nav__viewport",
    ".tarot-education-nav__track",
    ".tarot-education-nav__item.is-active",
    "overflow-x: auto",
    "background: transparent"
  ].forEach((token) => {
    if (!tarotCss.includes(token)) errors.push(`styles: shared education navigation treatment is missing (${token})`);
  });
  if (
    !/\.minor-arcana-page\s*\{[^}]*background:\s*transparent/s.test(css) ||
    /^\s*\.(?:minor-arcana-filters|minor-suits|minor-numbers|minor-number-patterns|minor-courts|minor-court-cards)(?:__|\s|\{)/m.test(css) ||
    /body\.(?:sun|moon|blood-moon)-mode\.tarot-minor-arcana-page\s*\{[^}]*background\s*:/.test(css)
  ) {
    errors.push("styles: Minor additions must stay scoped and reveal the global theme background");
  }
  if (
    !/@media \(max-width: 768px\)[\s\S]*?\.minor-arcana-page \.minor-suits__cards\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.minor-arcana-page \.minor-court-cards \.minor-court-cards__procession\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory/s.test(css)
  ) {
    errors.push("styles: suit and court imagery need bounded mobile scroll-snap layouts");
  }
  if (
    !/\.minor-arcana-page \.minor-number-patterns\s*\{[^}]*background:\s*transparent/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.minor-arcana-page \.minor-number-patterns \.minor-number-patterns__selector\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x proximity/s.test(css) ||
    !/@media \(max-width: 620px\)[\s\S]*?\.minor-arcana-page \.minor-number-patterns \.minor-number-patterns__cards\s*\{[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory/s.test(css) ||
    /\.minor-number-patterns[^{]*\{[^}]*min-height:\s*(?:570|650)px/s.test(css)
  ) {
    errors.push("styles: number patterns must remain transparent, compact, and bounded on mobile");
  }
  if (
    !/\.minor-arcana-page \.minor-court-cards\s*\{[^}]*background:\s*transparent/s.test(css) ||
    !/@media \(max-width: 1100px\)[\s\S]*?\.minor-arcana-page \.minor-court-cards \.minor-court-cards__procession\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s.test(css) ||
    !/@media \(max-width: 768px\)[\s\S]*?\.minor-arcana-page \.minor-court-cards \.minor-court-cards__rank-selector\s*\{[^}]*display:\s*grid/s.test(css) ||
    /\.minor-court-cards[^{]*\{[^}]*min-height:\s*(?:580|760)px/s.test(css) ||
    /\.minor-court-cards__role[^{]*\{[^}]*border:\s*1px/s.test(css)
  ) {
    errors.push("styles: court cards must remain transparent, borderless, compact, and responsive");
  }

  [
    "applyMinorFilter",
    "getVisibleSlides",
    "setActiveCard",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "aria-selected",
    "aria-hidden",
    "inert",
    "scroll",
    "isTransitioning",
    "minorSuitDirection",
    "minorNumberDirection",
    "minorCourtDirection",
    "transitionDirectionDataKey",
    "data-minor-suit-selector",
    "data-minor-suit-previous",
    "data-minor-suit-next",
    "data-minor-number-selector",
    "data-minor-court-rank-option",
    "data-minor-court-procession",
    "data-minor-court-previous",
    "data-minor-court-next",
    "updateRankState",
    "syncActivePanel",
    "reducedMotionQuery",
    "reducedMotionQuery"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`interaction: required Minor behavior is missing (${token})`);
  });

  const hubRecord = hubScript.match(/\{ key: "minor-arcana"[\s\S]*?\},/);
  if (
    !hubRecord ||
    !hubRecord[0].includes('route: "/tarot/minor-arcana/"') ||
    !hubRecord[0].includes("available: true") ||
    !hubRecord[0].includes('ctaLabel: "Explore the Minor Arcana"')
  ) {
    errors.push("hub tile: completed Minor Arcana route and descriptive CTA are missing");
  }
  if (countMatches(new RegExp(`<loc>${canonical}</loc>`, "g"), sitemap) !== 1) {
    errors.push("sitemap: expected exactly one canonical Minor Arcana URL");
  }
}

if (errors.length) {
  console.error(`Minor Arcana validation failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("Minor Arcana validation passed for the education page and all 56 card routes.");
}
