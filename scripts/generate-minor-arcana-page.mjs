import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { minorArcanaPage } from "../data/minor-arcana.mjs";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { escapeHtml, getCardRoute, serializeForInlineScript, SITE_ORIGIN } from "./card-page-helpers.mjs";
import {
  buildMinorArcanaCards,
  getMinorArcanaOutputPath,
  getMinorArcanaRoute,
  validateMinorArcanaData
} from "./minor-arcana-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(rootDir, "templates/tarot-minor-arcana-page.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const generatedMarkerStart = "<!-- GENERATED:MINOR_ARCANA_PAGE:START -->";
const generatedMarkerEnd = "<!-- GENERATED:MINOR_ARCANA_PAGE:END -->";

function renderSchemas(page) {
  const canonicalUrl = `${SITE_ORIGIN}${getMinorArcanaRoute(page)}`;
  return {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Tarot", item: `${SITE_ORIGIN}/tarot` },
        { "@type": "ListItem", position: 3, name: page.breadcrumbLabel, item: canonicalUrl }
      ]
    },
    webPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.hero.title,
      description: page.seo.description,
      url: canonicalUrl,
      image: `${SITE_ORIGIN}${page.hero.image.src}`,
      dateModified: page.seo.lastModified,
      isPartOf: { "@type": "WebSite", name: "Astral Veil", url: `${SITE_ORIGIN}/` },
      about: [
        { "@type": "Thing", name: "Minor Arcana" },
        { "@type": "Thing", name: "Tarot suits" },
        { "@type": "Thing", name: "Tarot card meanings" }
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
  const canonicalUrl = `${SITE_ORIGIN}${getMinorArcanaRoute(page)}`;
  const imageUrl = `${SITE_ORIGIN}${page.hero.image.src}`;
  const schemas = renderSchemas(page);
  return [
    `<title>${escapeHtml(page.seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.seo.description)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(page.seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.seo.ogDescription)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
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
    `<script id="minor-arcana-breadcrumb-schema" type="application/ld+json">${serializeForInlineScript(schemas.breadcrumb)}</script>`,
    `<script id="minor-arcana-webpage-schema" type="application/ld+json">${serializeForInlineScript(schemas.webPage)}</script>`,
    `<script id="minor-arcana-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`
  ].join("\n    ");
}

function renderImage(image, { className = "", loading = "lazy", fetchpriority = "", decorative = false } = {}) {
  const classAttribute = className ? ` class="${className}"` : "";
  const priorityAttribute = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  return `<img${classAttribute} src="${escapeHtml(image.src)}" alt="${decorative ? "" : escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${loading}" decoding="async"${priorityAttribute} draggable="false" />`;
}

function toThemeCard(card) {
  return {
    title: card.title,
    image: card.image || card.variants?.veilrise?.image,
    imageAlt: card.imageAlt || card.variants?.veilrise?.imageAlt,
    bloodMoonImage: card.bloodMoonImage || card.variants?.veilfall?.image,
    bloodMoonImageAlt: card.bloodMoonImageAlt || card.variants?.veilfall?.imageAlt,
    imageWidth: card.imageWidth || 1024,
    imageHeight: card.imageHeight || 1536
  };
}

function renderThemeCardImage(input, className, { loading = "lazy", sizes = "" } = {}) {
  const card = toThemeCard(input);
  const sizesAttribute = sizes ? ` sizes="${escapeHtml(sizes)}"` : "";
  return `<img class="${className}" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.imageAlt)}" width="${card.imageWidth}" height="${card.imageHeight}" loading="${loading}" decoding="async"${sizesAttribute} draggable="false" data-major-theme-image data-standard-src="${escapeHtml(card.image)}" data-standard-alt="${escapeHtml(card.imageAlt)}" data-blood-src="${escapeHtml(card.bloodMoonImage)}" data-blood-alt="${escapeHtml(card.bloodMoonImageAlt)}" />`;
}

function renderThemeImage(image, className) {
  return `<img class="${className}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" draggable="false" data-major-theme-image data-standard-src="${escapeHtml(image.src)}" data-standard-alt="${escapeHtml(image.alt)}" data-blood-src="${escapeHtml(image.bloodMoonSrc)}" data-blood-alt="${escapeHtml(image.bloodMoonAlt)}" />`;
}

function renderHighlightedText(copy, highlights) {
  const matches = (highlights || [])
    .map((highlight) => ({ highlight, index: copy.indexOf(highlight) }))
    .filter(({ index }) => index >= 0)
    .sort((left, right) => left.index - right.index);
  let cursor = 0;
  return matches.map(({ highlight, index }) => {
    const output = `${escapeHtml(copy.slice(cursor, index))}<span class="major-arcana-foundations__highlight">${escapeHtml(highlight)}</span>`;
    cursor = index + highlight.length;
    return output;
  }).join("") + escapeHtml(copy.slice(cursor));
}

function renderSectionHeader(section) {
  return `<header class="major-arcana-section-heading">
          <p class="major-arcana-eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.heading)}</h2>
          ${section.introduction ? `<p>${escapeHtml(section.introduction)}</p>` : ""}
        </header>`;
}

function cardByTitle(title, cards = tarotCardDetails) {
  const card = cards.find((candidate) => candidate.title === title);
  if (!card) throw new Error(`Missing canonical tarot card: ${title}`);
  return card;
}

function renderHero(page) {
  return `<section class="major-arcana-hero minor-arcana-hero" aria-labelledby="minor-arcana-title">
        <div class="major-arcana-hero__stage">
          <div class="major-arcana-hero__title">
            <p class="major-arcana-eyebrow">${escapeHtml(page.hero.eyebrow)}</p>
            <h1 id="minor-arcana-title">${escapeHtml(page.hero.title)}</h1>
          </div>
          <figure class="major-arcana-hero__visual">
            ${renderImage(page.hero.image, { className: "major-arcana-hero__image", loading: "eager", fetchpriority: "high" })}
          </figure>
        </div>
        <div class="major-arcana-hero__content-band">
          <div class="major-arcana-hero__content-inner">
            <div class="major-arcana-hero__introduction">${page.hero.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
            <div class="major-arcana-hero__meta">
              <ul class="major-arcana-hero__facts" aria-label="Minor Arcana facts">${page.hero.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
              <a class="major-arcana-button" href="${escapeHtml(page.hero.ctaTarget)}">${escapeHtml(page.hero.ctaLabel)} <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </section>`;
}

function renderExplore(page, cards) {
  const slides = cards.map((card, index) => `<article class="major-arcana-slide${index === 0 ? " is-active" : ""}" id="minor-arcana-slide-${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${cards.length}: ${escapeHtml(card.title)}"${index === 0 ? ' aria-current="true"' : ""} data-minor-card-slide data-minor-card-index="${index}" data-minor-suit="${escapeHtml(card.suitKey)}" data-minor-court="${["Page", "Knight", "Queen", "King"].includes(card.rank)}">
            <button class="major-arcana-slide__select" type="button" aria-label="Select ${escapeHtml(card.title)}" aria-pressed="${index === 0 ? "true" : "false"}" data-minor-card-select>
              <span class="major-arcana-slide__frame">
                ${renderThemeCardImage(card, "major-arcana-slide__image", { loading: index < 3 ? "eager" : "lazy", sizes: "(max-width: 768px) 48vw, 230px" })}
                <span class="major-arcana-slide__glint" aria-hidden="true"></span>
              </span>
            </button>
            <div class="major-arcana-slide__copy">
              <p class="major-arcana-slide__number">${escapeHtml(card.suit)} <span aria-hidden="true">·</span> ${escapeHtml(card.rank)}</p>
              <h3>${escapeHtml(card.title)}</h3>
              <p class="major-arcana-slide__keywords">${card.keywords.map(escapeHtml).join(" · ")}</p>
              <p class="major-arcana-slide__summary">${escapeHtml(card.summary)}</p>
              <a class="major-arcana-text-link" href="${escapeHtml(card.route)}">Explore ${escapeHtml(card.title)}’s Full Meaning <span aria-hidden="true">→</span></a>
            </div>
          </article>`).join("");
  return `<section class="major-arcana-section major-arcana-explore minor-arcana-explore" id="${escapeHtml(page.explore.id)}" aria-labelledby="${escapeHtml(page.explore.id)}-heading" data-minor-carousel>
        ${renderSectionHeader(page.explore)}
        <div class="minor-arcana-filters" role="toolbar" aria-label="Filter Minor Arcana cards">
          ${page.explore.filters.map((filter, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button" aria-pressed="${index === 0 ? "true" : "false"}" data-minor-filter="${escapeHtml(filter.key)}">${escapeHtml(filter.label)}</button>`).join("")}
        </div>
        <div class="major-arcana-carousel-stage">
          <button class="major-arcana-carousel-control major-arcana-carousel-control--previous" type="button" aria-label="Select previous Minor Arcana card" data-minor-previous disabled><span aria-hidden="true">‹</span></button>
          <div class="major-arcana-carousel" tabindex="0" aria-label="Minor Arcana card carousel" data-minor-carousel-viewport>
            <div class="major-arcana-carousel__track" data-minor-carousel-track>${slides}</div>
          </div>
          <button class="major-arcana-carousel-control major-arcana-carousel-control--next" type="button" aria-label="Select next Minor Arcana card" data-minor-next><span aria-hidden="true">›</span></button>
        </div>
        <div class="minor-arcana-carousel-meta">
          <p><span data-minor-visible-count>56</span> cards in this view</p>
          <div class="minor-arcana-carousel-progress" aria-hidden="true"><span data-minor-carousel-progress></span></div>
          <a href="/tarot">Browse the Tarot Meanings Library</a>
        </div>
        <p class="major-arcana-visually-hidden" aria-live="polite" aria-atomic="true" data-minor-carousel-status>1 of 56 selected: Ace of Wands</p>
      </section>`;
}

function renderOverview(page) {
  const section = page.overview;
  return `<section class="major-arcana-section major-arcana-overview major-arcana-foundations" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="major-arcana-foundations__copy">
          ${renderSectionHeader(section)}
          <div class="major-arcana-foundations__prose">${section.paragraphs.map((paragraph) => `<p>${renderHighlightedText(paragraph, section.highlights)}</p>`).join("")}</div>
        </div>
        <div class="major-arcana-foundations__visual">
          <svg class="major-arcana-foundations__connections" viewBox="0 0 700 650" preserveAspectRatio="none" aria-hidden="true">
            <path class="major-arcana-foundations__orbit" d="M76 392 C121 118 579 118 624 392"></path>
            <circle class="major-arcana-foundations__node" cx="350" cy="198" r="4"></circle>
            <circle class="major-arcana-foundations__node" cx="176" cy="438" r="4"></circle>
            <circle class="major-arcana-foundations__node" cx="524" cy="438" r="4"></circle>
          </svg>
          <div class="major-arcana-foundations__cards" role="list" aria-label="Minor Arcana foundations">
            ${section.concepts.map((concept, index) => `<article class="major-arcana-foundations__card major-arcana-foundations__card--${index + 1}" role="listitem">
              <a class="major-arcana-foundations__card-link" href="${escapeHtml(concept.route)}">
                <span class="major-arcana-foundations__number" aria-hidden="true">${escapeHtml(concept.number)}</span>
                <figure class="major-arcana-foundations__figure">${renderThemeImage(concept.image, "major-arcana-foundations__image")}</figure>
                <div class="major-arcana-foundations__card-copy">
                  <h3>${escapeHtml(concept.title)}</h3>
                  <p>${escapeHtml(concept.copy)}</p>
                  <span class="major-arcana-foundations__explore">Explore <span aria-hidden="true">→</span></span>
                </div>
              </a>
            </article>`).join("")}
          </div>
          <p class="major-arcana-foundations__swipe-cue"><span aria-hidden="true">● ○ ○</span> Swipe to explore</p>
        </div>
      </section>`;
}

function renderSuits(page) {
  const section = page.suits;
  const tabs = section.items.map((suit, index) => `<button class="${index === 0 ? "is-active" : ""}" id="minor-suit-tab-${escapeHtml(suit.key)}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="minor-suit-panel-${escapeHtml(suit.key)}" tabindex="${index === 0 ? "0" : "-1"}" data-minor-suit-tab="${escapeHtml(suit.key)}"><span>${escapeHtml(suit.element)}</span>${escapeHtml(suit.name)}</button>`).join("");
  const panels = section.items.map((suit, index) => {
    const representativeCards = suit.representativeCards.map((title) => cardByTitle(title));
    return `<article class="minor-suits__panel${index === 0 ? " is-active" : ""}" id="minor-suit-panel-${escapeHtml(suit.key)}" role="tabpanel" aria-labelledby="minor-suit-tab-${escapeHtml(suit.key)}" aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " inert"} data-minor-suit-panel="${escapeHtml(suit.key)}">
          <div class="minor-suits__copy">
            <p class="major-arcana-eyebrow">${escapeHtml(suit.element)} · ${escapeHtml(suit.name)}</p>
            <h3>The Suit of ${escapeHtml(suit.name)}</h3>
            <p class="minor-suits__themes">${suit.themes.map(escapeHtml).join(" · ")}</p>
            ${suit.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            <div class="minor-suits__labels">${suit.themes.map((theme) => `<span>${escapeHtml(theme)}</span>`).join("")}</div>
            <p class="minor-suits__progression"><strong>Ace to King</strong>${escapeHtml(suit.progression)}</p>
            <a class="major-arcana-text-link" href="#explore-minor-arcana" data-minor-filter-link="${escapeHtml(suit.key)}">Explore the Suit of ${escapeHtml(suit.name)} <span aria-hidden="true">→</span></a>
          </div>
          <div class="minor-suits__cards" aria-label="Selected ${escapeHtml(suit.name)} cards">
            ${representativeCards.map((card, cardIndex) => `<figure style="--minor-suit-card-index:${cardIndex}">${renderThemeCardImage(card, "minor-suits__card-image", { sizes: "(max-width: 768px) 38vw, 190px" })}<figcaption>${escapeHtml(card.title)}</figcaption></figure>`).join("")}
          </div>
        </article>`;
  }).join("");
  return `<section class="major-arcana-section minor-suits" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-minor-suits>
        ${renderSectionHeader(section)}
        <p class="minor-suits__instruction"><span aria-hidden="true">✦</span>${escapeHtml(section.instruction)}</p>
        <div class="minor-suits__tabs" role="tablist" aria-label="Choose a Minor Arcana suit">${tabs}</div>
        <div class="minor-suits__viewport">${panels}</div>
      </section>`;
}

function renderNumbers(page) {
  const section = page.numbers;
  const suitNames = ["Wands", "Cups", "Swords", "Pentacles"];
  const tabs = section.items.map((number, index) => `<button class="${index === 0 ? "is-active" : ""}" id="minor-number-tab-${escapeHtml(number.key)}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="minor-number-panel-${escapeHtml(number.key)}" tabindex="${index === 0 ? "0" : "-1"}" data-minor-number-tab="${escapeHtml(number.key)}">${escapeHtml(number.label)}</button>`).join("");
  const panels = section.items.map((number, index) => {
    const rank = number.rank || "Ace";
    return `<article class="minor-numbers__panel${index === 0 ? " is-active" : ""}" id="minor-number-panel-${escapeHtml(number.key)}" role="tabpanel" aria-labelledby="minor-number-tab-${escapeHtml(number.key)}" aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " inert"} data-minor-number-panel="${escapeHtml(number.key)}">
          <header><p class="minor-numbers__value">${escapeHtml(number.label)}</p><div><p class="major-arcana-eyebrow">General Pattern</p><h3>${escapeHtml(number.pattern)}</h3></div></header>
          <div class="minor-numbers__suits">${suitNames.map((suit) => {
            const card = cardByTitle(`${rank} of ${suit}`);
            return `<article>
              <figure>${renderThemeCardImage(card, "minor-numbers__card-image", { sizes: "(max-width: 768px) 31vw, 150px" })}</figure>
              <div><h4>${escapeHtml(card.title)}</h4><p>${escapeHtml(number.readings[suit])}</p><a href="${escapeHtml(getCardRoute(card))}">Explore this card <span aria-hidden="true">→</span></a></div>
            </article>`;
          }).join("")}</div>
        </article>`;
  }).join("");
  return `<section class="major-arcana-section minor-numbers" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-minor-numbers>
        ${renderSectionHeader(section)}
        <div class="minor-numbers__tabs" role="tablist" aria-label="Choose a Minor Arcana number pattern">${tabs}</div>
        <div class="minor-numbers__viewport">${panels}</div>
      </section>`;
}

function renderCourts(page) {
  const section = page.courts;
  const tabs = section.suits.map((suit, index) => `<button class="${index === 0 ? "is-active" : ""}" id="minor-court-tab-${suit.toLowerCase()}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="minor-court-panel-${suit.toLowerCase()}" tabindex="${index === 0 ? "0" : "-1"}" data-minor-court-tab="${suit.toLowerCase()}">${escapeHtml(suit)}</button>`).join("");
  const panels = section.suits.map((suit, suitIndex) => `<div class="minor-courts__panel${suitIndex === 0 ? " is-active" : ""}" id="minor-court-panel-${suit.toLowerCase()}" role="tabpanel" aria-labelledby="minor-court-tab-${suit.toLowerCase()}" aria-hidden="${suitIndex === 0 ? "false" : "true"}"${suitIndex === 0 ? "" : " inert"} data-minor-court-panel="${suit.toLowerCase()}">
        ${section.ranks.map((rank) => {
          const card = cardByTitle(`${rank.name} of ${suit}`);
          return `<article class="minor-courts__rank">
            <figure>${renderThemeCardImage(card, "minor-courts__card-image", { sizes: "(max-width: 768px) 56vw, 230px" })}<figcaption>${escapeHtml(card.title)}</figcaption></figure>
            <div><p class="major-arcana-eyebrow">${escapeHtml(rank.themes)}</p><h3>${escapeHtml(rank.name)}</h3><p>${escapeHtml(rank.copy)}</p><a class="major-arcana-text-link" href="${escapeHtml(getCardRoute(card))}">Explore ${escapeHtml(card.title)} <span aria-hidden="true">→</span></a></div>
          </article>`;
        }).join("")}
      </div>`).join("");
  return `<section class="major-arcana-section minor-courts" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-minor-courts>
        ${renderSectionHeader(section)}
        <div class="minor-courts__tabs" role="tablist" aria-label="Choose a suit for the court cards">${tabs}</div>
        <div class="minor-courts__viewport">${panels}</div>
      </section>`;
}

function renderOrientation(page) {
  const section = page.orientation;
  const card = cardByTitle(section.cardTitle);
  const renderState = (state, key, active) => `<article class="major-arcana-orientation__state major-arcana-orientation__state--${key}${active ? " is-active" : ""}" id="major-orientation-${key}" aria-hidden="false" data-major-orientation-panel="${key}">
          <span class="major-arcana-orientation__emblem" aria-hidden="true">${escapeHtml(state.emblem)}</span>
          <header class="major-arcana-orientation__state-header"><p class="major-arcana-orientation__label">${escapeHtml(state.label)}</p><h3>${escapeHtml(state.subtitle)}</h3></header>
          <span class="major-arcana-orientation__accent" aria-hidden="true"></span>
          <p class="major-arcana-orientation__description">${escapeHtml(state.copy)}</p>
          <ul>${state.themes.map((theme) => `<li><span aria-hidden="true">✦</span>${escapeHtml(theme)}</li>`).join("")}</ul>
        </article>`;
  return `<section class="major-arcana-section major-arcana-orientation" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-major-orientation>
        ${renderSectionHeader(section)}
        <div class="major-arcana-orientation__toggle" role="group" aria-label="Choose upright or reversed interpretation">
          <button class="is-active" type="button" aria-pressed="true" aria-controls="major-orientation-upright" data-major-orientation-option="upright">Upright</button>
          <button type="button" aria-pressed="false" aria-controls="major-orientation-reversed" data-major-orientation-option="reversed">Reversed</button>
        </div>
        <div class="major-arcana-orientation__layout">
          ${renderState(section.upright, "upright", true)}
          <figure class="major-arcana-orientation__card" data-major-orientation-card>
            <span class="major-arcana-orientation__card-frame">${renderThemeCardImage(card, "major-arcana-orientation__card-image", { sizes: "(max-width: 768px) 58vw, 240px" })}</span>
            <figcaption class="major-arcana-orientation__caption" aria-live="polite">${escapeHtml(card.title)} shown <span data-major-orientation-caption>upright</span></figcaption>
            <span class="major-arcana-orientation__guide-status">${escapeHtml(section.guideStatus)}</span>
          </figure>
          ${renderState(section.reversed, "reversed", false)}
        </div>
      </section>`;
}

function renderReadings(page) {
  const section = page.readings;
  const spreadCards = section.example.cardTitles.map((title) => cardByTitle(title));
  return `<section class="major-arcana-readings" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="major-arcana-section major-arcana-readings__inner">
          ${renderSectionHeader(section)}
          <div class="major-arcana-readings__concepts">${section.concepts.map((concept) => `<article><p>${escapeHtml(concept.number)}</p><h3>${escapeHtml(concept.title)}</h3><p>${escapeHtml(concept.copy)}</p></article>`).join("")}</div>
          <div class="major-arcana-reading-example">
            <div class="major-arcana-reading-example__spread" aria-label="Illustrative Major and Minor Arcana spread">${spreadCards.map((card, index) => `<figure class="${card.arcana === "Major Arcana" ? "is-major" : ""}">${renderThemeCardImage(card, "major-arcana-reading__major-image", { sizes: "(max-width: 768px) 31vw, 150px" })}<figcaption>${escapeHtml(section.example.positions[index])}</figcaption></figure>`).join("")}</div>
            <div class="major-arcana-reading-example__copy">
              <p class="major-arcana-eyebrow">Pattern · Lesson · Response</p>
              <h3>${escapeHtml(section.example.heading)}</h3>
              <p>${escapeHtml(section.example.copy)}</p>
              <p class="major-arcana-reading-example__note">${escapeHtml(section.example.note)}</p>
              <span class="major-arcana-route-status">Tarot Spreads · Coming Soon</span>
            </div>
          </div>
        </div>
      </section>`;
}

function renderComparison(page) {
  const section = page.comparison;
  const activeMode = section.defaultMode === "minor" ? "minor" : "major";
  const initialPositions = ["0", "1", "2", "-1"];
  const renderShowcase = (group) => {
    const showcaseCards = group.cardTitles.map((title) => cardByTitle(title));
    return `<div class="major-minor-showcase__showcase" aria-label="${escapeHtml(group.title)} card showcase" data-major-minor-showcase="${escapeHtml(group.key)}">
            <div class="major-minor-showcase__track" data-major-minor-track>
              ${showcaseCards.map((card, index) => `<figure class="major-minor-showcase__card${index === 0 ? " is-active" : ""}" data-major-minor-card="${index}" data-position="${initialPositions[index]}">${renderThemeCardImage(card, "major-minor-showcase__card-image", { sizes: "(max-width: 768px) 64vw, (max-width: 1100px) 28vw, 285px" })}<figcaption>${escapeHtml(card.title)}</figcaption></figure>`).join("")}
            </div>
            <div class="major-minor-showcase__navigation">
              <button class="major-minor-showcase__arrow major-minor-showcase__arrow--previous" type="button" aria-label="Show previous ${escapeHtml(group.title)} example" data-major-minor-previous><span aria-hidden="true">‹</span></button>
              <div class="major-minor-showcase__dots" role="group" aria-label="Choose a ${escapeHtml(group.title)} example">${showcaseCards.map((card, index) => `<button type="button" aria-label="Show ${escapeHtml(card.title)}" aria-current="${index === 0 ? "true" : "false"}" data-major-minor-dot="${index}"><span></span></button>`).join("")}</div>
              <button class="major-minor-showcase__arrow major-minor-showcase__arrow--next" type="button" aria-label="Show next ${escapeHtml(group.title)} example" data-major-minor-next><span aria-hidden="true">›</span></button>
            </div>
            <p class="major-arcana-visually-hidden" aria-live="polite" aria-atomic="true" data-major-minor-card-status></p>
          </div>`;
  };
  const renderPanel = (group) => {
    const active = group.key === activeMode;
    return `<article class="major-minor-showcase__panel${active ? " is-active" : ""}" id="major-minor-${escapeHtml(group.key)}-panel" role="tabpanel" aria-labelledby="major-minor-${escapeHtml(group.key)}-tab" aria-hidden="${active ? "false" : "true"}"${active ? "" : " inert"} data-major-minor-panel="${escapeHtml(group.key)}">
          <div class="major-minor-showcase__information">
            <p class="major-minor-showcase__panel-eyebrow">${escapeHtml(group.eyebrow)}</p><h3>${escapeHtml(group.title)}</h3>
            <p class="major-minor-showcase__number"><strong>${escapeHtml(group.number)}</strong><span>${escapeHtml(group.numberLabel)}</span></p>
            <p class="major-minor-showcase__descriptor">${escapeHtml(group.supportingLabel)}</p>
            <p class="major-minor-showcase__copy">${escapeHtml(group.copy)}</p>
            <ul>${group.items.map((item) => `<li><span aria-hidden="true">✦</span>${escapeHtml(item)}</li>`).join("")}</ul>
            <a class="major-minor-showcase__route" href="${escapeHtml(group.route)}">${escapeHtml(group.routeLabel)} <span aria-hidden="true">→</span></a>
          </div>${renderShowcase(group)}
        </article>`;
  };
  return `<section class="major-arcana-section major-minor-showcase" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-major-minor-showcase-root data-mode="${activeMode}">
        ${renderSectionHeader(section)}
        <p class="major-minor-showcase__identity"><strong>${escapeHtml(section.balance.number)} ${escapeHtml(section.balance.numberLabel)}</strong><span aria-hidden="true">✦</span>${escapeHtml(section.balance.label)}</p>
        <div class="major-minor-showcase__toggle" role="tablist" aria-label="Compare Major and Minor Arcana">
          <span class="major-minor-showcase__toggle-indicator" aria-hidden="true"></span>
          ${["major", "minor"].map((key) => {
            const active = key === activeMode;
            return `<button class="${active ? "is-active" : ""}" id="major-minor-${key}-tab" type="button" role="tab" aria-selected="${active ? "true" : "false"}" aria-controls="major-minor-${key}-panel" tabindex="${active ? "0" : "-1"}" data-major-minor-tab="${key}">${key === "major" ? "Major Arcana" : "Minor Arcana"}</button>`;
          }).join("")}
        </div>
        <div class="major-minor-showcase__viewport">${renderPanel(section.major)}${renderPanel(section.minor)}</div>
        <footer class="major-minor-showcase__footer"><p class="major-minor-showcase__supporting">${escapeHtml(section.supporting)}</p></footer>
      </section>`;
}

function renderFaq(page) {
  const section = page.faq;
  const items = section.items.map((item, index) => {
    const number = index + 1;
    return `<article class="tarot-faq__item" data-major-faq-item>
            <h3><button class="tarot-faq__trigger" id="minor-faq-question-${number}" type="button" aria-expanded="true" aria-controls="minor-faq-answer-${number}" data-major-faq-button><span>${escapeHtml(item.question)}</span><span class="tarot-faq__icon" aria-hidden="true">−</span></button></h3>
            <div class="tarot-faq__answer" id="minor-faq-answer-${number}" role="region" aria-labelledby="minor-faq-question-${number}" aria-hidden="false"><div class="tarot-faq__answer-inner"><p>${escapeHtml(item.answer)}</p></div></div>
          </article>`;
  }).join("");
  return `<section class="tarot-faq major-arcana-faq" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-major-faq>
        <div class="tarot-shell tarot-faq__inner">
          <header class="tarot-faq__header"><p class="tarot-faq__eyebrow">${escapeHtml(section.eyebrow)}</p><h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.heading)}</h2><p class="tarot-faq__intro">${escapeHtml(section.introduction)}</p><div class="tarot-faq__divider" aria-hidden="true"><span></span><span class="tarot-faq__ornament">✦</span><span></span></div></header>
          <div class="tarot-faq__list">${items}</div>
        </div>
      </section>`;
}

function renderClosing(page) {
  const section = page.closingCta;
  return `<section class="major-arcana-closing" aria-labelledby="minor-arcana-closing-heading">
        ${renderImage(section.image, { className: "major-arcana-closing__image", decorative: true })}
        <div class="major-arcana-closing__overlay"></div>
        <div class="major-arcana-closing__copy">
          <p class="major-arcana-eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 id="minor-arcana-closing-heading">${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.copy)}</p>
          <nav class="major-arcana-closing__actions" aria-label="Continue exploring the Minor Arcana">${section.actions.map((action, index) => `<a class="major-arcana-closing__action${index === 0 ? " major-arcana-closing__action--primary" : ""}" href="${escapeHtml(action.route)}">${escapeHtml(action.label)} <span aria-hidden="true">→</span></a>`).join("")}</nav>
          <p class="major-arcana-closing__status">${escapeHtml(section.spreadsStatus)}</p>
        </div>
      </section>`;
}

function renderMain(page, cards) {
  return `<main id="main-content" class="major-arcana-page minor-arcana-page">
      ${renderHero(page)}
      <div class="major-arcana-archive">
        ${renderExplore(page, cards)}
        ${renderOverview(page)}
        ${renderSuits(page)}
        ${renderNumbers(page)}
        ${renderCourts(page)}
        ${renderOrientation(page)}
      </div>
      ${renderReadings(page)}
      <div class="major-arcana-archive major-arcana-archive--lower">
        ${renderComparison(page)}
        ${renderFaq(page)}
      </div>
      ${renderClosing(page)}
    </main>`;
}

function updateSitemap(page) {
  const canonical = `${SITE_ORIGIN}${getMinorArcanaRoute(page)}`;
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
  const majorMarker = "<!-- GENERATED:MAJOR_ARCANA_PAGE:START -->";
  sitemap = sitemap.includes(majorMarker)
    ? sitemap.replace(majorMarker, `${block}\n  ${majorMarker}`)
    : sitemap.replace(/\s*<\/urlset>\s*$/, `\n  ${block}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

function generateMinorArcanaPage(page) {
  const errors = validateMinorArcanaData(page, tarotCardDetails, { rootDir });
  if (errors.length) throw new Error(`Minor Arcana data validation failed:\n- ${errors.join("\n- ")}`);
  const cards = buildMinorArcanaCards(page, tarotCardDetails);
  const template = readFileSync(templatePath, "utf8");
  const html = template
    .replace("{{MINOR_ARCANA_META}}", renderMeta(page))
    .replace("{{MINOR_ARCANA_MAIN}}", renderMain(page, cards));
  if (html.includes("{{MINOR_ARCANA_")) throw new Error("Minor Arcana template contains unreplaced placeholders");
  const outputPath = getMinorArcanaOutputPath(rootDir, page);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
  updateSitemap(page);
  return outputPath;
}

const outputPath = generateMinorArcanaPage(minorArcanaPage);
console.log(`Generated ${getMinorArcanaRoute(minorArcanaPage)} -> ${outputPath}`);
console.log("Updated sitemap.xml with the Minor Arcana route");
