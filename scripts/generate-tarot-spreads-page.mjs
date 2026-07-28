import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotSpreadsPage } from "../data/tarot-spreads.mjs";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { escapeHtml, serializeForInlineScript, SITE_ORIGIN } from "./card-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const shellTemplatePath = resolve(rootDir, "templates/tarot-minor-arcana-page.html");
const outputPath = resolve(rootDir, "tarot-spreads", "index.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const generatedMarkerStart = "<!-- GENERATED:TAROT_SPREADS_PAGE:START -->";
const generatedMarkerEnd = "<!-- GENERATED:TAROT_SPREADS_PAGE:END -->";
const cardBack = {
  src: "/assets/images/cards/original/card-back.webp",
  width: 800,
  height: 1200
};
const tarotEducationNavigation = [
  { key: "history", label: "Tarot History", route: "/tarot/history/" },
  { key: "major-arcana", label: "Major Arcana", route: "/tarot/major-arcana/" },
  { key: "minor-arcana", label: "Minor Arcana", route: "/tarot/minor-arcana/" },
  { key: "beginners", label: "Tarot for Beginners", route: "/tarot/for-beginners/" },
  { key: "how-to-read", label: "How to Read Tarot", route: "/tarot/how-to-read/" },
  { key: "spreads", label: "Tarot Spreads", route: "/tarot-spreads/" },
  { key: "tarot-vs-oracle", label: "Tarot vs. Oracle", route: "/tarot/compare/tarot-vs-oracle-cards/" },
  { key: "tarot-vs-lenormand", label: "Tarot vs. Lenormand", route: "/tarot/compare/tarot-vs-lenormand/" }
];

function renderSchemas(page) {
  const canonical = `${SITE_ORIGIN}${page.route}`;
  return {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Tarot", item: `${SITE_ORIGIN}/tarot` },
        { "@type": "ListItem", position: 3, name: page.breadcrumbLabel, item: canonical }
      ]
    },
    webPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.hero.title,
      description: page.seo.description,
      url: canonical,
      image: `${SITE_ORIGIN}${page.hero.image.src}`,
      dateModified: page.seo.lastModified,
      isPartOf: { "@type": "WebSite", name: "Astral Veil", url: `${SITE_ORIGIN}/` },
      about: [
        { "@type": "Thing", name: "Tarot spreads" },
        { "@type": "Thing", name: "Tarot reading layouts" },
        { "@type": "Thing", name: "Tarot card positions" }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.items.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    }
  };
}

function renderMeta(page) {
  const canonical = `${SITE_ORIGIN}${page.route}`;
  const imageUrl = `${SITE_ORIGIN}${page.hero.image.src}`;
  const schemas = renderSchemas(page);
  return [
    `<title>${escapeHtml(page.seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.seo.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(page.seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.seo.ogDescription)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:width" content="${page.hero.image.width}" />`,
    `<meta property="og:image:height" content="${page.hero.image.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(page.hero.image.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(page.hero.image.alt)}" />`,
    `<link rel="preload" as="image" href="${escapeHtml(page.hero.image.src)}" fetchpriority="high" />`,
    `<script id="tarot-spreads-breadcrumb-schema" type="application/ld+json">${serializeForInlineScript(schemas.breadcrumb)}</script>`,
    `<script id="tarot-spreads-webpage-schema" type="application/ld+json">${serializeForInlineScript(schemas.webPage)}</script>`,
    `<script id="tarot-spreads-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`
  ].join("\n    ");
}

function renderEducationNavigation(page) {
  const items = tarotEducationNavigation.map((item) => {
    const routePath = item.route === page.route
      ? outputPath
      : resolve(rootDir, item.route.replace(/^\/+/, ""), "index.html");
    const isAvailable = item.route === page.route || existsSync(routePath);
    const isActive = item.route === page.route;
    const className = `tarot-education-nav__item${isActive ? " is-active" : ""}${isAvailable ? "" : " is-disabled"}`;

    if (isAvailable) {
      return `<a class="${className}" href="${escapeHtml(item.route)}"${isActive ? ' aria-current="page" data-tarot-education-active' : ""} data-tarot-education-item="${escapeHtml(item.key)}">${escapeHtml(item.label)}</a>`;
    }

    return `<span class="${className}" role="link" aria-disabled="true" aria-label="${escapeHtml(item.label)} — Coming Soon" tabindex="0" data-tarot-education-item="${escapeHtml(item.key)}"><span>${escapeHtml(item.label)}</span><small>Coming Soon</small></span>`;
  }).join("");

  return `<nav class="tarot-education-nav" aria-label="Tarot education">
        <div class="tarot-education-nav__viewport" data-tarot-education-viewport>
          <div class="tarot-education-nav__track">${items}</div>
        </div>
      </nav>`;
}

function renderSectionHeader(section) {
  return `<header class="tarot-spreads-section__heading">
          <p class="major-arcana-eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.heading)}</h2>
          ${section.introduction ? `<p>${escapeHtml(section.introduction)}</p>` : ""}
        </header>`;
}

function renderCardBackDiagram(count, label, positionNames = []) {
  const cards = Array.from({ length: count }, (_, index) => {
    const position = positionNames[index] || `Position ${index + 1}`;
    return `<span class="tarot-spread-diagram__card" style="--spread-card-index:${index}">
            <img src="${cardBack.src}" alt="Face-down tarot card representing ${escapeHtml(position)}" width="${cardBack.width}" height="${cardBack.height}" loading="lazy" decoding="async" />
            <span>${escapeHtml(position)}</span>
          </span>`;
  }).join("");
  return `<figure class="tarot-spread-diagram tarot-spread-diagram--${count}" data-spread-card-count="${count}" aria-label="${escapeHtml(label)}">
          <div class="tarot-spread-diagram__layout">${cards}</div>
          <figcaption>${escapeHtml(label)}</figcaption>
        </figure>`;
}

function renderThemeCardImage(card, className) {
  const standard = card.image || card.variants?.veilrise?.image;
  const standardAlt = card.imageAlt || card.variants?.veilrise?.imageAlt || `${card.title} card from the Veilrise Arcana tarot deck`;
  const blood = card.bloodMoonImage || card.variants?.veilfall?.image;
  const bloodAlt = card.bloodMoonImageAlt || card.variants?.veilfall?.imageAlt || `${card.title} card from the Veilfall Arcana tarot deck`;
  return `<img class="${className}" src="${escapeHtml(standard)}" alt="${escapeHtml(standardAlt)}" width="${card.imageWidth || 1024}" height="${card.imageHeight || 1536}" loading="lazy" decoding="async" sizes="(max-width: 768px) 54vw, 230px" data-major-theme-image data-standard-src="${escapeHtml(standard)}" data-standard-alt="${escapeHtml(standardAlt)}" data-blood-src="${escapeHtml(blood)}" data-blood-alt="${escapeHtml(bloodAlt)}" />`;
}

function renderHero(page) {
  const hero = page.hero;
  const [primaryParagraph, secondaryParagraph] = hero.paragraphs;
  return `<section id="tarot-spreads-hero" class="tarot-spreads-hero" aria-labelledby="tarot-spreads-title">
        <div class="tarot-spreads-hero__stage">
          <div class="tarot-spreads-hero__visual" aria-hidden="true"><img src="${escapeHtml(hero.image.src)}" alt="" width="${hero.image.width}" height="${hero.image.height}" loading="eager" decoding="async" fetchpriority="high" /></div>
          <div class="tarot-spreads-hero__overlay"></div>
          <div class="tarot-spreads-shell tarot-spreads-hero__content">
            <p class="major-arcana-eyebrow">${escapeHtml(hero.eyebrow)}</p>
            <h1 id="tarot-spreads-title" class="tarot-spreads-hero__title"><span class="tarot-spreads-hero__title-main">Tarot Spreads</span> <span class="tarot-spreads-hero__title-secondary">Explained</span></h1>
            <div class="tarot-spreads-hero__copy tarot-spreads-hero__copy--primary"><p>${escapeHtml(primaryParagraph)}</p></div>
            <div class="tarot-spreads-hero__actions tarot-spreads-hero__actions--primary">
              <a class="tarot-spreads-button tarot-spreads-button--primary" href="#explore-tarot-spreads">Explore Tarot Spreads</a>
            </div>
          </div>
        </div>
        <div class="tarot-spreads-hero__editorial">
          <div class="tarot-spreads-shell tarot-spreads-hero__editorial-inner">
            <div class="tarot-spreads-hero__copy tarot-spreads-hero__copy--secondary"><p>${escapeHtml(secondaryParagraph)}</p></div>
            <div class="tarot-spreads-hero__editorial-meta">
              <ul class="tarot-spreads-hero__facts">${hero.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
              <span class="tarot-spreads-coming-soon tarot-spreads-hero__secondary-action" role="link" aria-disabled="true" tabindex="0">How to Read Tarot Spreads <small>Coming Soon</small></span>
            </div>
          </div>
        </div>
      </section>`;
}

function renderDefinition(page) {
  const section = page.definition;
  const concepts = section.concepts.map((concept) => `<article class="tarot-spreads-concept">
          ${renderCardBackDiagram(concept.cards, `${concept.title} example`, Array.from({ length: concept.cards }, (_, index) => `Position ${index + 1}`))}
          <h3>${escapeHtml(concept.title)}</h3>
          <p>${escapeHtml(concept.copy)}</p>
        </article>`).join("");
  return `<section class="tarot-spreads-section tarot-spreads-definition" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-prose">${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
          <div class="tarot-spreads-concepts">${concepts}</div>
        </div>
      </section>`;
}

function renderExplorer(page) {
  const section = page.explorer;
  const filters = section.filters.map((filter, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button" aria-pressed="${index === 0 ? "true" : "false"}" data-spread-filter="${escapeHtml(filter.key)}">${escapeHtml(filter.label)}</button>`).join("");
  const selectors = section.items.map((spread, index) => `<button class="tarot-spreads-explorer__option${index === 0 ? " is-active" : ""}" id="spread-selector-${escapeHtml(spread.id)}" type="button" aria-pressed="${index === 0 ? "true" : "false"}" aria-controls="spread-panel-${escapeHtml(spread.id)}" data-spread-selector="${escapeHtml(spread.id)}" data-spread-categories="${escapeHtml(spread.categories.join(" "))}">
          <span><strong>${escapeHtml(spread.name)}</strong><small>${spread.cardCount} ${spread.cardCount === 1 ? "card" : "cards"} · ${escapeHtml(spread.difficulty)}</small></span><span aria-hidden="true">→</span>
        </button>`).join("");
  const panels = section.items.map((spread, index) => {
    const positionNames = spread.positions.map((position) => position.name);
    const action = spread.isAvailable
      ? `<a class="tarot-spreads-button tarot-spreads-button--primary" href="${escapeHtml(spread.href)}">Begin the ${escapeHtml(spread.name)}</a>`
      : `<span class="tarot-spreads-coming-soon" role="status">${escapeHtml(spread.name)} <small>Coming Soon</small></span>`;
    return `<article class="tarot-spreads-explorer__panel${index === 0 ? " is-active" : ""}" id="spread-panel-${escapeHtml(spread.id)}" aria-labelledby="spread-selector-${escapeHtml(spread.id)}" aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " inert"} data-spread-panel="${escapeHtml(spread.id)}">
          <div class="tarot-spreads-explorer__diagram">${renderCardBackDiagram(spread.cardCount, `${spread.name} card layout`, positionNames)}</div>
          <div class="tarot-spreads-explorer__detail">
            <p class="major-arcana-eyebrow">${spread.cardCount} ${spread.cardCount === 1 ? "Card" : "Cards"} · ${escapeHtml(spread.difficulty)}</p>
            <h3>${escapeHtml(spread.name)}</h3>
            <p class="tarot-spreads-explorer__best"><strong>Best for</strong>${escapeHtml(spread.bestFor)}</p>
            <p>${escapeHtml(spread.summary)}</p>
            <ol class="tarot-spreads-position-list">${spread.positions.map((position) => `<li><strong>${escapeHtml(position.name)}</strong><span>${escapeHtml(position.copy)}</span></li>`).join("")}</ol>
            <div class="tarot-spreads-explorer__action">${action}</div>
          </div>
        </article>`;
  }).join("");
  return `<section class="tarot-spreads-section tarot-spreads-explorer" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-spread-explorer>
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-filters" role="group" aria-label="Filter tarot spreads">${filters}</div>
          <div class="tarot-spreads-explorer__workspace">
            <div class="tarot-spreads-explorer__selectors" aria-label="Choose a tarot spread">${selectors}</div>
            <div class="tarot-spreads-explorer__panels">${panels}</div>
          </div>
        </div>
      </section>`;
}

function renderBeginners(page) {
  const section = page.beginners;
  const routes = {
    1: { route: "/one-card-tarot-reading", label: "Explore the One-Card Reading Guide" },
    3: { route: "/?spread=3", label: "Begin a Three-Card Reading" },
    5: { route: "/?spread=5", label: "Begin a Five-Card Reading" }
  };
  return `<section class="tarot-spreads-section tarot-spreads-beginners" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-beginners__grid">${section.groups.map((group) => `<article>
            ${renderCardBackDiagram(group.cards, `${group.title} beginner spread`, Array.from({ length: group.cards }, (_, index) => `Position ${index + 1}`))}
            <h3>${escapeHtml(group.title)}</h3><p><strong>Best for</strong>${escapeHtml(group.bestFor)}</p>
            <a href="${routes[group.cards].route}">${routes[group.cards].label} <span aria-hidden="true">→</span></a>
          </article>`).join("")}</div>
        </div>
      </section>`;
}

function renderIntentions(page) {
  const section = page.intentions;
  return `<section class="tarot-spreads-section tarot-spreads-intentions" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-intentions__grid">${section.items.map((item, index) => `<article><p class="tarot-spreads-intentions__number">${String(index + 1).padStart(2, "0")}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.copy)}</p>${item.route ? `<a href="${escapeHtml(item.route)}">${escapeHtml(item.linkLabel)} <span aria-hidden="true">→</span></a>` : '<span class="tarot-spreads-status">Dedicated guide · Coming Soon</span>'}</article>`).join("")}</div>
        </div>
      </section>`;
}

function renderPositions(page) {
  const section = page.positions;
  const card = tarotCardDetails.find((candidate) => candidate.title === section.cardTitle);
  if (!card) throw new Error(`Missing canonical tarot card: ${section.cardTitle}`);
  return `<section class="tarot-spreads-section tarot-spreads-positions" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-positions__grid">${section.examples.map((example) => `<article><figure>${renderThemeCardImage(card, "tarot-spreads-positions__card")}<figcaption>${escapeHtml(example.label)}</figcaption></figure><div><h3>${escapeHtml(example.label)}</h3><p>${escapeHtml(example.copy)}</p></div></article>`).join("")}</div>
          <p class="tarot-spreads-positions__link"><a href="/tarot/the-hermit/">Explore The Hermit tarot card meaning <span aria-hidden="true">→</span></a></p>
        </div>
      </section>`;
}

function renderHowTo(page) {
  const section = page.howTo;
  return `<section class="tarot-spreads-section tarot-spreads-how-to" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-how-to__grid">
            <article><h3>Choosing the Spread</h3><dl>${section.choosing.map((item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.copy)}</dd></div>`).join("")}</dl></article>
            <article><h3>Performing the Spread</h3><ol>${section.performing.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></article>
          </div>
          <nav class="tarot-spreads-related-links" aria-label="Continue learning and practicing tarot">
            <span class="tarot-spreads-related-links__disabled" role="link" aria-disabled="true" tabindex="0">How to Read Tarot Cards · Coming Soon</span>
            <a href="/tarot/major-arcana/">Explore the Major Arcana</a>
            <a href="/tarot/minor-arcana/">Explore the Minor Arcana</a>
            <a href="/journal">Record a Reflection in the Journal</a>
            <a href="/online-tarot-reading">Explore the Online Tarot Reading Experience</a>
            <a href="/">Begin a Tarot Reading</a>
          </nav>
        </div>
      </section>`;
}

function renderPatterns(page) {
  const section = page.patterns;
  return `<section class="tarot-spreads-section tarot-spreads-patterns" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-patterns__grid">${section.items.map((item, index) => `<article><span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.copy)}</p></article>`).join("")}</div>
        </div>
      </section>`;
}

function renderComparison(page) {
  const section = page.comparison;
  const renderPanel = (key, group, active) => `<article class="tarot-spreads-comparison__panel${active ? " is-active" : ""}" id="tarot-spread-${key}-panel" role="tabpanel" aria-labelledby="tarot-spread-${key}-tab" aria-hidden="${active ? "false" : "true"}"${active ? "" : " inert"} data-spread-comparison-panel="${key}"><h3>${escapeHtml(group.label)}</h3><ul>${group.items.map((item) => `<li><span aria-hidden="true">✦</span>${escapeHtml(item)}</li>`).join("")}</ul></article>`;
  return `<section class="tarot-spreads-section tarot-spreads-comparison" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-spread-comparison>
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-comparison__tabs" role="tablist" aria-label="Compare simple and in-depth tarot spreads">
            <button class="is-active" id="tarot-spread-simple-tab" type="button" role="tab" aria-selected="true" aria-controls="tarot-spread-simple-panel" tabindex="0" data-spread-comparison-tab="simple">Simple Spreads</button>
            <button id="tarot-spread-in-depth-tab" type="button" role="tab" aria-selected="false" aria-controls="tarot-spread-in-depth-panel" tabindex="-1" data-spread-comparison-tab="in-depth">In-Depth Spreads</button>
          </div>
          <div class="tarot-spreads-comparison__viewport">${renderPanel("simple", section.simple, true)}${renderPanel("in-depth", section.inDepth, false)}</div>
          <p class="tarot-spreads-comparison__conclusion">${escapeHtml(section.conclusion)}</p>
        </div>
      </section>`;
}

function renderFaq(page) {
  const section = page.faq;
  const items = section.items.map((item, index) => {
    const number = index + 1;
    return `<article class="tarot-faq__item" data-major-faq-item>
          <h3><button class="tarot-faq__trigger" id="tarot-spreads-faq-question-${number}" type="button" aria-expanded="true" aria-controls="tarot-spreads-faq-answer-${number}" data-major-faq-button><span>${escapeHtml(item.question)}</span><span class="tarot-faq__icon" aria-hidden="true">−</span></button></h3>
          <div class="tarot-faq__answer" id="tarot-spreads-faq-answer-${number}" role="region" aria-labelledby="tarot-spreads-faq-question-${number}" aria-hidden="false"><div class="tarot-faq__answer-inner"><p>${escapeHtml(item.answer)}</p></div></div>
        </article>`;
  }).join("");
  return `<section class="tarot-faq major-arcana-faq tarot-spreads-faq" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-major-faq>
        <div class="tarot-shell tarot-faq__inner"><header class="tarot-faq__header"><p class="tarot-faq__eyebrow">${escapeHtml(section.eyebrow)}</p><h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.heading)}</h2><p class="tarot-faq__intro">${escapeHtml(section.introduction)}</p><div class="tarot-faq__divider" aria-hidden="true"><span></span><span class="tarot-faq__ornament">✦</span><span></span></div></header><div class="tarot-faq__list">${items}</div></div>
      </section>`;
}

function renderClosing(page) {
  const section = page.closing;
  return `<section class="major-arcana-closing tarot-spreads-closing" aria-labelledby="tarot-spreads-closing-heading">
        <img class="major-arcana-closing__image" src="${escapeHtml(section.image.src)}" alt="" width="${section.image.width}" height="${section.image.height}" loading="lazy" decoding="async" />
        <div class="major-arcana-closing__overlay"></div>
        <div class="major-arcana-closing__copy">
          <p class="major-arcana-eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 id="tarot-spreads-closing-heading">${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.copy)}</p>
          <nav class="major-arcana-closing__actions" aria-label="Begin exploring tarot spreads">
            <a class="major-arcana-closing__action major-arcana-closing__action--primary" href="/">Explore Available Tarot Spreads <span aria-hidden="true">→</span></a>
            <a class="major-arcana-closing__action" href="/free-tarot-reading">Begin a Tarot Reading <span aria-hidden="true">→</span></a>
          </nav>
          <p class="major-arcana-closing__status">How to Read Tarot Cards · Coming Soon</p>
        </div>
      </section>`;
}

function renderMain(page) {
  return `<main id="main-content" class="major-arcana-page tarot-spreads-page-content">
      ${renderEducationNavigation(page)}
      ${renderHero(page)}
      <div class="tarot-spreads-archive">
        ${renderDefinition(page)}
        ${renderExplorer(page)}
        ${renderBeginners(page)}
        ${renderIntentions(page)}
        ${renderPositions(page)}
        ${renderHowTo(page)}
        ${renderPatterns(page)}
        ${renderComparison(page)}
        ${renderFaq(page)}
      </div>
      ${renderClosing(page)}
    </main>`;
}

function updateSitemap(page) {
  const canonical = `${SITE_ORIGIN}${page.route}`;
  const block = [
    generatedMarkerStart,
    "  <url>",
    `    <loc>${canonical}</loc>`,
    `    <lastmod>${page.seo.lastModified}</lastmod>`,
    "    <changefreq>monthly</changefreq>",
    "    <priority>0.8</priority>",
    "  </url>",
    generatedMarkerEnd
  ].join("\n");
  const currentBlock = new RegExp(`\\s*${generatedMarkerStart}[\\s\\S]*?${generatedMarkerEnd}`, "g");
  const routeBlock = new RegExp(`\\s*<url>\\s*<loc>${canonical}</loc>[\\s\\S]*?</url>`, "g");
  let sitemap = readFileSync(sitemapPath, "utf8").replace(currentBlock, "").replace(routeBlock, "");
  const minorMarker = "<!-- GENERATED:MINOR_ARCANA_PAGE:START -->";
  sitemap = sitemap.includes(minorMarker)
    ? sitemap.replace(minorMarker, `${block}\n  ${minorMarker}`)
    : sitemap.replace(/\s*<\/urlset>\s*$/, `\n  ${block}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

function generateTarotSpreadsPage(page) {
  const shell = readFileSync(shellTemplatePath, "utf8");
  const html = shell
    .replace("/css/tarot-minor-arcana.css", "/css/tarot-spreads.css")
    .replace("tarot-minor-arcana-page", "tarot-spreads-page")
    .replace("/js/tarot-minor-arcana.js", "/js/tarot-spreads.js")
    .replace("{{MINOR_ARCANA_META}}", renderMeta(page))
    .replace("{{MINOR_ARCANA_MAIN}}", renderMain(page));
  if (html.includes("{{MINOR_ARCANA_")) throw new Error("Tarot Spreads shell contains unreplaced placeholders");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
  updateSitemap(page);
}

generateTarotSpreadsPage(tarotSpreadsPage);
console.log(`Generated ${tarotSpreadsPage.route} -> ${outputPath}`);
console.log("Updated sitemap.xml with the Tarot Spreads route");
