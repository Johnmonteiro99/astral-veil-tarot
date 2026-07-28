import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotSpreadsPage } from "../data/tarot-spreads.mjs";
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

  const educationStart = html.indexOf('<nav class="tarot-education-nav"');
  const educationEnd = educationStart >= 0 ? html.indexOf("</nav>", educationStart) : -1;
  const educationHtml = educationStart >= 0 && educationEnd > educationStart
    ? html.slice(educationStart, educationEnd)
    : "";
  if (
    countMatches(/data-tarot-education-item="/g, educationHtml) !== 8 ||
    countMatches(/<a class="tarot-education-nav__item/g, educationHtml) !== 6 ||
    countMatches(/aria-disabled="true"/g, educationHtml) !== 2 ||
    !educationHtml.includes('href="/tarot-spreads/" aria-current="page" data-tarot-education-active')
  ) {
    errors.push("education navigation: expected six live routes, two Coming Soon items, and active Tarot Spreads");
  }
  [
    "/tarot/history/",
    "/tarot/major-arcana/",
    "/tarot/minor-arcana/",
    "/tarot-spreads/",
    "/tarot/compare/tarot-vs-oracle-cards/",
    "/tarot/compare/tarot-vs-lenormand/"
  ].forEach((route) => {
    if (!educationHtml.includes(`href="${route}"`)) errors.push(`education navigation: live route is missing (${route})`);
  });
  ["/tarot/for-beginners/", "/tarot/how-to-read/"].forEach((route) => {
    if (educationHtml.includes(`href="${route}"`)) errors.push(`education navigation: unavailable route must not be linked (${route})`);
  });

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
    !html.includes('class="tarot-spreads-hero__editorial"') ||
    !html.includes('loading="eager" decoding="async" fetchpriority="high"') ||
    !html.includes('href="#explore-tarot-spreads">Explore Tarot Spreads</a>') ||
    !html.includes("How to Read Tarot Spreads <small>Coming Soon</small>")
  ) {
    errors.push("hero: priority image, primary CTA, or honest secondary status is incomplete");
  }

  tarotSpreadsPage.definition.paragraphs.forEach((paragraph) => {
    if (!html.includes(paragraph)) errors.push("definition: required editorial copy is missing");
  });
  tarotSpreadsPage.definition.concepts.forEach((concept) => {
    [concept.title, concept.copy].forEach((token) => {
      if (!html.includes(token)) errors.push(`definition: concept is incomplete (${concept.title})`);
    });
  });

  const explorerStart = html.indexOf('<section class="tarot-spreads-section tarot-spreads-explorer"');
  const explorerEnd = explorerStart >= 0 ? html.indexOf("</section>", explorerStart) : -1;
  const explorerHtml = explorerStart >= 0 && explorerEnd > explorerStart ? html.slice(explorerStart, explorerEnd) : "";
  if (
    countMatches(/data-spread-filter=/g, explorerHtml) !== tarotSpreadsPage.explorer.filters.length ||
    countMatches(/data-spread-selector=/g, explorerHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/data-spread-panel=/g, explorerHtml) !== tarotSpreadsPage.explorer.items.length ||
    countMatches(/class="tarot-spreads-explorer__panel is-active"/g, explorerHtml) !== 1 ||
    countMatches(/\sinert/g, explorerHtml) !== tarotSpreadsPage.explorer.items.length - 1 ||
    countMatches(/data-spread-card-count=/g, explorerHtml) !== tarotSpreadsPage.explorer.items.length
  ) {
    errors.push("explorer: filters, semantic selectors, stable panels, or diagrams are incomplete");
  }
  tarotSpreadsPage.explorer.items.forEach((spread) => {
    [
      spread.name,
      String(spread.cardCount),
      spread.difficulty,
      spread.bestFor,
      spread.summary,
      ...spread.positions.flatMap((position) => [position.name, position.copy])
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
    if (spread.isAvailable && !explorerHtml.includes(`href="${spread.href}"`)) {
      errors.push(`explorer: live reading route is missing for ${spread.name}`);
    }
    if (!spread.isAvailable && !explorerHtml.includes(`${spread.name} <small>Coming Soon</small>`)) {
      errors.push(`explorer: unavailable layout needs a Coming Soon state (${spread.name})`);
    }
  });
  if (explorerHtml.includes('href=""') || explorerHtml.includes('/?spread=10')) {
    errors.push("explorer: empty or unsupported reading routes must not be linked");
  }

  tarotSpreadsPage.beginners.groups.forEach((group) => {
    [group.title, group.bestFor].forEach((content) => {
      if (!html.includes(content)) errors.push(`beginners: content is missing for ${group.title}`);
    });
  });
  tarotSpreadsPage.intentions.items.forEach((item) => {
    [item.title, item.copy].forEach((content) => {
      if (!html.includes(content)) errors.push(`intentions: content is missing for ${item.title}`);
    });
    if (item.route && !html.includes(`href="${item.route}"`)) {
      errors.push(`intentions: live route is missing for ${item.title}`);
    }
  });
  if (!html.includes("Dedicated guide · Coming Soon")) {
    errors.push("intentions: Decisions and Crossroads must remain an honest Coming Soon guide");
  }

  const hermit = tarotCardDetails.find((card) => card.title === tarotSpreadsPage.positions.cardTitle);
  const hermitStandard = hermit?.image || hermit?.variants?.veilrise?.image;
  const hermitBlood = hermit?.bloodMoonImage || hermit?.variants?.veilfall?.image;
  if (
    !hermit ||
    countMatches(/class="tarot-spreads-positions__card"/g) !== 3 ||
    !html.includes(`data-standard-src="${hermitStandard}"`) ||
    !html.includes(`data-blood-src="${hermitBlood}"`) ||
    !html.includes('href="/tarot/the-hermit/"')
  ) {
    errors.push("positions: The Hermit route and theme-aware artwork are incomplete");
  }
  tarotSpreadsPage.positions.examples.forEach((example) => {
    if (!html.includes(example.label) || !html.includes(example.copy)) {
      errors.push(`positions: example is missing (${example.label})`);
    }
  });

  tarotSpreadsPage.howTo.choosing.forEach((item) => {
    if (!html.includes(item.label) || !html.includes(item.copy)) errors.push(`how-to: choosing guidance is missing (${item.label})`);
  });
  tarotSpreadsPage.howTo.performing.forEach((step) => {
    if (!html.includes(step)) errors.push(`how-to: performance step is missing (${step})`);
  });
  tarotSpreadsPage.patterns.items.forEach((item) => {
    if (!html.includes(item.title) || !html.includes(item.copy)) errors.push(`patterns: explanation is missing (${item.title})`);
  });

  if (
    countMatches(/data-spread-comparison-tab=/g) !== 2 ||
    countMatches(/data-spread-comparison-panel=/g) !== 2 ||
    !html.includes(tarotSpreadsPage.comparison.conclusion)
  ) {
    errors.push("comparison: accessible toggle, both initial panels, or conclusion is missing");
  }
  [...tarotSpreadsPage.comparison.simple.items, ...tarotSpreadsPage.comparison.inDepth.items].forEach((item) => {
    if (!html.includes(item)) errors.push(`comparison: content is missing (${item})`);
  });

  if (
    countMatches(/data-major-faq-item/g) !== tarotSpreadsPage.faq.items.length ||
    countMatches(/class="tarot-faq__answer"/g) !== tarotSpreadsPage.faq.items.length
  ) {
    errors.push("faq: expected all accessible questions and answers");
  }
  tarotSpreadsPage.faq.items.forEach((item) => {
    if (!html.includes(item.question) || !html.includes(item.answer)) errors.push(`faq: visible content is missing (${item.question})`);
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
    ".tarot-spreads-explorer__workspace",
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
    "aria-selected",
    "aria-hidden",
    "inert",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "reducedMotionQuery",
    "positionActiveEducationItem"
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
    !libraryJs.includes('guide.key === "spreads" && guide.available') ||
    !libraryJs.includes('aria-hidden="true">→</span>')
  ) {
    errors.push("library card: live Tarot Spreads CTA treatment is incomplete");
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
  console.log("Tarot Spreads validation passed for the phase-one education scaffold.");
}
