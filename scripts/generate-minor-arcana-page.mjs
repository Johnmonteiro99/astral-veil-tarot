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
import { renderTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

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
  return `<section class="tarot-education-hero tarot-education-hero--immersive major-arcana-hero minor-arcana-hero" aria-labelledby="minor-arcana-title">
        <div class="tarot-education-hero__stage major-arcana-hero__stage">
          <div class="tarot-education-hero__copy major-arcana-hero__title">
            <p class="major-arcana-eyebrow">${escapeHtml(page.hero.eyebrow)}</p>
            <h1 id="minor-arcana-title">${escapeHtml(page.hero.title)}</h1>
          </div>
          <figure class="tarot-education-hero__visual major-arcana-hero__visual">
            ${renderImage(page.hero.image, { className: "tarot-education-hero__image major-arcana-hero__image", loading: "eager", fetchpriority: "high" })}
          </figure>
          <div class="tarot-education-hero__overlay" aria-hidden="true"></div>
        </div>
        <div class="tarot-education-hero__editorial major-arcana-hero__content-band">
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

function renderSuitSymbol(key, className = "minor-suit-selector__icon") {
  const iconClass = escapeHtml(className);
  const symbols = {
    wands: `<svg class="${iconClass}" viewBox="0 0 64 80" aria-hidden="true" focusable="false">
              <path d="M31.5 69c1-12.4.7-24.5-.8-36.3-.7-5.3-.5-10.4.8-15.2" />
              <path d="M31 43c-6.8-2.5-11.1-7.1-13.2-13.6M31.3 36.5c6.8-2.2 11.5-6.4 14.1-12.7M29.9 53.2c-4.2-1.5-7.3-4.2-9.4-8.1M31 49.1c4.8-1.4 8.2-4.1 10.4-8.1" />
              <path class="minor-suit-selector__icon-detail" d="M32 7.5c5.8 6.2 8 11.1 6.7 14.6-1.1 3-3.4 4.7-6.8 5.1-3.2-.6-5.4-2.3-6.4-5.2-1.2-3.5 1-8.3 6.5-14.5Z" />
            </svg>`,
    cups: `<svg class="${iconClass}" viewBox="0 0 64 80" aria-hidden="true" focusable="false">
              <path d="M14.5 18.5h35c0 17.8-6.1 28-17.5 28s-17.5-10.2-17.5-28Z" />
              <path class="minor-suit-selector__icon-detail" d="M18.5 25.5c4.1 2.2 8.6 3.3 13.5 3.3s9.4-1.1 13.5-3.3" />
              <path d="M32 46.5v14.8M23.5 68h17M27.5 61.5h9" />
            </svg>`,
    swords: `<svg class="${iconClass}" viewBox="0 0 64 80" aria-hidden="true" focusable="false">
              <path d="m32 7.5 7.2 36.8L32 52l-7.2-7.7L32 7.5Z" />
              <path class="minor-suit-selector__icon-detail" d="M32 13v32.5" />
              <path d="M18.5 51.5h27M26.5 51.5l2.2 9.7h6.6l2.2-9.7M28.5 69h7" />
            </svg>`,
    pentacles: `<svg class="${iconClass}" viewBox="0 0 64 80" aria-hidden="true" focusable="false">
              <circle cx="32" cy="39" r="23.5" />
              <circle class="minor-suit-selector__icon-detail" cx="32" cy="39" r="18.5" />
              <path d="m32 21.5 4.2 12.8h13.5l-10.9 7.9L43 55 32 47.1 21 55l4.2-12.8-10.9-7.9h13.5L32 21.5Z" />
            </svg>`
  };

  return symbols[key] || "";
}

function renderSuits(page) {
  const section = page.suits;
  const tabs = section.items.map((suit, index) => `<button class="minor-suit-selector__option minor-suit-selector__option--${escapeHtml(suit.key)}${index === 0 ? " is-active" : ""}" id="minor-suit-tab-${escapeHtml(suit.key)}" type="button" role="tab" aria-label="${escapeHtml(suit.name)}, ${escapeHtml(suit.element)}" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="minor-suit-panel-${escapeHtml(suit.key)}" tabindex="${index === 0 ? "0" : "-1"}" data-minor-suit-tab="${escapeHtml(suit.key)}" data-minor-suit-name="${escapeHtml(suit.name)}" data-minor-suit-element="${escapeHtml(suit.element)}">
            <span class="minor-suit-selector__portal" aria-hidden="true">
              <span class="minor-suit-selector__effect"></span>
              ${renderSuitSymbol(suit.key)}
              <span class="minor-suit-selector__marker"></span>
            </span>
            <span class="minor-suit-selector__name">${escapeHtml(suit.name)}</span>
            <span class="minor-suit-selector__element">${escapeHtml(suit.element)}</span>
          </button>`).join("");
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
        <nav class="minor-suit-selector" aria-label="Explore the four Minor Arcana suits" data-minor-suit-selector>
          <div class="minor-suit-selector__track" role="tablist" aria-label="Choose a Minor Arcana suit">${tabs}</div>
        </nav>
        <div class="minor-suit-selector__mobile-controls">
          <button type="button" aria-label="Select previous Minor Arcana suit" data-minor-suit-previous><span aria-hidden="true">←</span><span>Previous</span></button>
          <span class="minor-suit-selector__progress" aria-hidden="true">${section.items.map((suit, index) => `<span${index === 0 ? ' class="is-active"' : ""} data-minor-suit-progress="${escapeHtml(suit.key)}"></span>`).join("")}</span>
          <span class="minor-suit-selector__count" data-minor-suit-count>01 / 04</span>
          <button type="button" aria-label="Select next Minor Arcana suit" data-minor-suit-next><span>Next</span><span aria-hidden="true">→</span></button>
          <span class="major-arcana-visually-hidden" aria-live="polite" data-minor-suit-status>${escapeHtml(section.items[0].name)}, ${escapeHtml(section.items[0].element)}, 1 of ${section.items.length}</span>
        </div>
        <div class="minor-suits__viewport">${panels}</div>
      </section>`;
}

function renderNumbers(page) {
  const section = page.numbers;
  const suitNames = ["Wands", "Cups", "Swords", "Pentacles"];
  const suitElements = {
    Wands: "Fire",
    Cups: "Water",
    Swords: "Air",
    Pentacles: "Earth"
  };
  const tabs = section.items.map((number, index) => `<button class="minor-number-patterns__option${index === 0 ? " is-active" : ""}" id="minor-number-tab-${escapeHtml(number.key)}" type="button" role="tab" aria-label="${escapeHtml(number.label)}: ${escapeHtml(number.pattern)}" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="minor-number-panel-${escapeHtml(number.key)}" tabindex="${index === 0 ? "0" : "-1"}" data-minor-number-tab="${escapeHtml(number.key)}"><span>${escapeHtml(number.label)}</span></button>`).join("");
  const panels = section.items.map((number, index) => {
    const rank = number.rank || "Ace";
    return `<article class="minor-numbers__panel${index === 0 ? " is-active" : ""}" id="minor-number-panel-${escapeHtml(number.key)}" role="tabpanel" aria-labelledby="minor-number-tab-${escapeHtml(number.key)}" aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " inert"} data-minor-number-panel="${escapeHtml(number.key)}">
          <header class="minor-number-patterns__summary">
            <p class="major-arcana-eyebrow">Selected Number</p>
            <div class="minor-number-patterns__value-row"><span aria-hidden="true"></span><p class="minor-number-patterns__value">${escapeHtml(number.label)}</p><span aria-hidden="true"></span></div>
            <h3>${escapeHtml(number.pattern)}</h3>
          </header>
          <div class="minor-number-patterns__cards">${suitNames.map((suit) => {
            const card = cardByTitle(`${rank} of ${suit}`);
            return `<article class="minor-number-patterns__card" data-minor-number-card data-minor-number-suit="${escapeHtml(suit.toLowerCase())}">
              <figure>${renderThemeCardImage(card, "minor-numbers__card-image", { sizes: "(max-width: 620px) 58vw, (max-width: 768px) 170px, 205px" })}</figure>
              <div class="minor-number-patterns__card-copy">
                <p class="minor-number-patterns__element">${escapeHtml(suitElements[suit])} · ${escapeHtml(suit)}</p>
                <h4>${escapeHtml(card.title)}</h4>
                <p>${escapeHtml(number.readings[suit])}</p>
                <a href="${escapeHtml(getCardRoute(card))}">Explore this card <span aria-hidden="true">→</span></a>
              </div>
            </article>`;
          }).join("")}</div>
        </article>`;
  }).join("");
  return `<section class="major-arcana-section minor-numbers minor-number-patterns" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-minor-numbers>
        ${renderSectionHeader(section)}
        <nav class="minor-number-patterns__selector" aria-label="Explore Minor Arcana number patterns" data-minor-number-selector>
          <div class="minor-number-patterns__rail" role="tablist" aria-label="Choose a Minor Arcana number pattern">${tabs}</div>
        </nav>
        <div class="minor-numbers__viewport">${panels}</div>
      </section>`;
}

function renderCourts(page) {
  const section = page.courts;
  const suitElements = {
    Wands: "Fire",
    Cups: "Water",
    Swords: "Air",
    Pentacles: "Earth"
  };
  const progressionLabels = {
    page: "Learning",
    knight: "Pursuit",
    queen: "Embodiment",
    king: "Direction"
  };
  const tabs = section.suits.map((suit, index) => {
    const suitKey = suit.toLowerCase();
    return `<button class="minor-court-cards__suit-option minor-court-cards__suit-option--${escapeHtml(suitKey)}${index === 0 ? " is-active" : ""}" id="minor-court-tab-${escapeHtml(suitKey)}" type="button" role="tab" aria-label="${escapeHtml(suit)}, ${escapeHtml(suitElements[suit])}" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="minor-court-panel-${escapeHtml(suitKey)}" tabindex="${index === 0 ? "0" : "-1"}" data-minor-court-tab="${escapeHtml(suitKey)}">
          <span class="minor-court-cards__suit-emblem" aria-hidden="true">${renderSuitSymbol(suitKey, "minor-court-cards__suit-icon")}</span>
          <span class="minor-court-cards__suit-name">${escapeHtml(suit)}</span>
          <span class="minor-court-cards__suit-element">${escapeHtml(suitElements[suit])}</span>
        </button>`;
  }).join("");
  const rankButtons = section.ranks.map((rank, index) => {
    const controlledIds = section.suits.map((suit) => `minor-court-role-${suit.toLowerCase()}-${rank.key}`).join(" ");
    return `<button class="minor-court-cards__rank-option${index === 0 ? " is-active" : ""}" type="button" aria-pressed="${index === 0 ? "true" : "false"}" aria-controls="${escapeHtml(controlledIds)}" data-minor-court-rank-option="${escapeHtml(rank.key)}">${escapeHtml(rank.name)}</button>`;
  }).join("");
  const panels = section.suits.map((suit, suitIndex) => {
    const suitKey = suit.toLowerCase();
    return `<div class="minor-court-cards__panel minor-court-cards__panel--${escapeHtml(suitKey)}${suitIndex === 0 ? " is-active" : ""}" id="minor-court-panel-${escapeHtml(suitKey)}" role="tabpanel" aria-labelledby="minor-court-tab-${escapeHtml(suitKey)}" aria-hidden="${suitIndex === 0 ? "false" : "true"}"${suitIndex === 0 ? "" : " inert"} data-minor-court-panel="${escapeHtml(suitKey)}">
        <div class="minor-court-cards__procession" data-minor-court-procession>
          ${section.ranks.map((rank, rankIndex) => {
          const card = cardByTitle(`${rank.name} of ${suit}`);
          return `<article class="minor-court-cards__role${rankIndex === 0 ? " is-rank-active" : ""}" id="minor-court-role-${escapeHtml(suitKey)}-${escapeHtml(rank.key)}" style="--minor-court-rank-index:${rankIndex}" data-minor-court-role="${escapeHtml(rank.key)}">
            <figure class="minor-court-cards__figure">${renderThemeCardImage(card, "minor-court-cards__card-image", { sizes: "(max-width: 680px) 64vw, (max-width: 1100px) 32vw, 250px" })}<figcaption>${escapeHtml(card.title)}</figcaption></figure>
            <div class="minor-court-cards__content">
              <p class="minor-court-cards__rank-label">${String(rankIndex + 1).padStart(2, "0")} · ${escapeHtml(progressionLabels[rank.key])}</p>
              <h3>${escapeHtml(rank.name)}</h3>
              <p class="minor-court-cards__keywords">${escapeHtml(rank.themes)}</p>
              <p class="minor-court-cards__description">${escapeHtml(rank.copy)}</p>
              <a class="minor-court-cards__link" href="${escapeHtml(getCardRoute(card))}">Explore the ${escapeHtml(card.title)} <span aria-hidden="true">→</span></a>
            </div>
          </article>`;
        }).join("")}
        </div>
        <ol class="minor-court-cards__progression" aria-label="Court development from learning to direction">
          ${section.ranks.map((rank, index) => `<li${index === 0 ? ' class="is-active"' : ""} data-minor-court-progress="${escapeHtml(rank.key)}"><span class="minor-court-cards__progression-node" aria-hidden="true"></span><span>${escapeHtml(progressionLabels[rank.key])}</span></li>`).join("")}
        </ol>
      </div>`;
  }).join("");
  return `<section class="major-arcana-section minor-courts minor-court-cards" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-minor-courts data-minor-court-rank="page">
        ${renderSectionHeader(section)}
        <nav class="minor-court-cards__suit-selector" aria-label="Explore court cards by suit">
          <div class="minor-court-cards__suit-track" role="tablist" aria-label="Choose a suit for the court cards">${tabs}</div>
        </nav>
        <div class="minor-court-cards__rank-selector" role="group" aria-label="Choose a court role" data-minor-court-rank-selector>${rankButtons}</div>
        <div class="minor-court-cards__viewport">${panels}</div>
        <div class="minor-court-cards__mobile-controls">
          <button type="button" aria-label="Show previous court role" data-minor-court-previous><span aria-hidden="true">←</span><span>Previous</span></button>
          <span class="minor-court-cards__mobile-progress" aria-hidden="true">${section.ranks.map((rank, index) => `<span${index === 0 ? ' class="is-active"' : ""} data-minor-court-mobile-progress="${escapeHtml(rank.key)}"></span>`).join("")}</span>
          <span class="minor-court-cards__mobile-count" data-minor-court-count>01 / 04</span>
          <button type="button" aria-label="Show next court role" data-minor-court-next><span>Next</span><span aria-hidden="true">→</span></button>
        </div>
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
      ${renderTarotEducationNavigation({ activeKey: "minor-arcana", rootDir })}
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
