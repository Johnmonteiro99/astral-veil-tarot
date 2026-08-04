import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotSpreadsPage } from "../data/tarot-spreads.mjs";
import { getTarotEducationHeroImages } from "../data/tarot-education-hero-images.js";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { escapeHtml, serializeForInlineScript, SITE_ORIGIN } from "./card-page-helpers.mjs";
import { renderTarotEducationFaq, renderTarotEducationHeroImage, renderTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const shellTemplatePath = resolve(rootDir, "templates/tarot-minor-arcana-page.html");
const outputPath = resolve(rootDir, "tarot-spreads", "index.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const generatedMarkerStart = "<!-- GENERATED:TAROT_SPREADS_PAGE:START -->";
const generatedMarkerEnd = "<!-- GENERATED:TAROT_SPREADS_PAGE:END -->";
const cardBack = {
  src: "/assets/images/cards/original/card-back.webp",
  bloodSrc: "/assets/images/cards/blood-moon/bloodmoon-card-back.webp",
  width: 800,
  height: 1200
};
const explorerStageLayouts = {
  "one-card": {
    stage: { aspect: 1.28, mobileAspect: 1, maxWidth: 560 },
    card: { min: 180, fluid: 17, max: 220, mobileMin: 150, mobileFluid: 48, mobileMax: 190 },
    positions: [
      { x: 50, y: 50, rotation: 0, mobileX: 50, mobileY: 50 }
    ]
  },
  "past-present-future": {
    stage: { aspect: 1.55, mobileAspect: 1.15, maxWidth: 720 },
    card: { min: 125, fluid: 12.5, max: 160, mobileMin: 76, mobileFluid: 23, mobileMax: 96 },
    positions: [
      { x: 23, y: 50, rotation: -2, tabletX: 18, tabletY: 50, mobileX: 16, mobileY: 50 },
      { x: 50, y: 50, rotation: 0, tabletX: 50, tabletY: 50, mobileX: 50, mobileY: 50 },
      { x: 77, y: 50, rotation: 2, tabletX: 82, tabletY: 50, mobileX: 84, mobileY: 50 }
    ]
  },
  "situation-challenge-advice": {
    stage: { aspect: 1.55, mobileAspect: 1.15, maxWidth: 720 },
    card: { min: 125, fluid: 12.5, max: 160, mobileMin: 76, mobileFluid: 23, mobileMax: 96 },
    positions: [
      { x: 23, y: 50, rotation: -1.5, tabletX: 18, tabletY: 50, mobileX: 16, mobileY: 50 },
      { x: 50, y: 50, rotation: 0, tabletX: 50, tabletY: 50, mobileX: 50, mobileY: 50 },
      { x: 77, y: 50, rotation: 1.5, tabletX: 82, tabletY: 50, mobileX: 84, mobileY: 50 }
    ]
  },
  "mind-body-spirit": {
    stage: { aspect: 1.55, mobileAspect: 1.15, maxWidth: 720 },
    card: { min: 125, fluid: 12.5, max: 160, mobileMin: 76, mobileFluid: 23, mobileMax: 96 },
    positions: [
      { x: 23, y: 50, rotation: -1, tabletX: 18, tabletY: 50, mobileX: 16, mobileY: 50 },
      { x: 50, y: 50, rotation: 0, tabletX: 50, tabletY: 50, mobileX: 50, mobileY: 50 },
      { x: 77, y: 50, rotation: 1, tabletX: 82, tabletY: 50, mobileX: 84, mobileY: 50 }
    ]
  },
  "decision-crossroads": {
    stage: { aspect: 1, mobileAspect: 0.86, maxWidth: 660 },
    card: { min: 92, fluid: 8.8, max: 124, mobileMin: 62, mobileFluid: 18, mobileMax: 82 },
    positions: [
      { x: 50, y: 18, rotation: 0, mobileX: 50, mobileY: 16 },
      { x: 22, y: 49, rotation: -1.5, mobileX: 18, mobileY: 49 },
      { x: 78, y: 49, rotation: 1.5, mobileX: 82, mobileY: 49 },
      { x: 50, y: 84, rotation: 0, mobileX: 50, mobileY: 84 },
      { x: 50, y: 50, rotation: 0, mobileX: 50, mobileY: 50 }
    ]
  },
  "love-relationship": {
    stage: { aspect: 1, mobileAspect: 0.86, maxWidth: 660 },
    card: { min: 92, fluid: 8.8, max: 124, mobileMin: 62, mobileFluid: 18, mobileMax: 82 },
    positions: [
      { x: 50, y: 18, rotation: 0, mobileX: 50, mobileY: 16 },
      { x: 23, y: 49, rotation: -1.5, mobileX: 18, mobileY: 49 },
      { x: 77, y: 49, rotation: 1.5, mobileX: 82, mobileY: 49 },
      { x: 32, y: 84, rotation: -1, mobileX: 30, mobileY: 84 },
      { x: 68, y: 84, rotation: 1, mobileX: 70, mobileY: 84 }
    ]
  },
  "career-purpose": {
    stage: { aspect: 1, mobileAspect: 0.86, maxWidth: 660 },
    card: { min: 92, fluid: 8.8, max: 124, mobileMin: 62, mobileFluid: 18, mobileMax: 82 },
    positions: [
      { x: 50, y: 18, rotation: 0, mobileX: 50, mobileY: 16 },
      { x: 23, y: 49, rotation: -1.5, mobileX: 18, mobileY: 49 },
      { x: 77, y: 49, rotation: 1.5, mobileX: 82, mobileY: 49 },
      { x: 32, y: 84, rotation: -1, mobileX: 30, mobileY: 84 },
      { x: 68, y: 84, rotation: 1, mobileX: 70, mobileY: 84 }
    ]
  },
  "five-card-insight": {
    source: "live-reading-3-plus-2",
    stage: { aspect: 1.05, mobileAspect: 0.86, maxWidth: 660 },
    card: { min: 92, fluid: 8.8, max: 124, mobileMin: 62, mobileFluid: 18, mobileMax: 82 },
    positions: [
      { x: 20, y: 29, rotation: -1.5, mobileX: 18, mobileY: 26 },
      { x: 50, y: 29, rotation: 0, mobileX: 50, mobileY: 26 },
      { x: 80, y: 29, rotation: 1.5, mobileX: 82, mobileY: 26 },
      { x: 35, y: 72, rotation: -1, mobileX: 32, mobileY: 74 },
      { x: 65, y: 72, rotation: 1, mobileX: 68, mobileY: 74 }
    ]
  },
  "seven-card-reading": {
    source: "live-reading-3-plus-3-plus-1",
    stage: { aspect: 1.1, mobileAspect: 0.72, maxWidth: 680 },
    card: { min: 78, fluid: 7, max: 104, mobileMin: 48, mobileFluid: 13, mobileMax: 60 },
    positions: [
      { x: 18, y: 18, rotation: -1.5, mobileX: 16, mobileY: 16 },
      { x: 50, y: 18, rotation: 0, mobileX: 50, mobileY: 16 },
      { x: 82, y: 18, rotation: 1.5, mobileX: 84, mobileY: 16 },
      { x: 18, y: 50, rotation: -1, mobileX: 16, mobileY: 50 },
      { x: 50, y: 50, rotation: 0, mobileX: 50, mobileY: 50 },
      { x: 82, y: 50, rotation: 1, mobileX: 84, mobileY: 50 },
      { x: 50, y: 82, rotation: 0, mobileX: 50, mobileY: 84 }
    ]
  },
  "celtic-cross": {
    stage: { aspect: 1.1, mobileAspect: 0.8, maxWidth: 700 },
    card: { min: 54, fluid: 5.2, max: 74, mobileMin: 36, mobileFluid: 10.5, mobileMax: 44 },
    positions: [
      { x: 40, y: 50, rotation: 0, mobileX: 35, mobileY: 50, dealOrder: 0 },
      { x: 40, y: 50, rotation: 90, mobileX: 35, mobileY: 50, dealOrder: 1 },
      { x: 40, y: 79, rotation: 0, mobileX: 35, mobileY: 82, dealOrder: 2 },
      { x: 16, y: 50, rotation: 0, mobileX: 8, mobileY: 50, dealOrder: 3 },
      { x: 40, y: 20, rotation: 0, mobileX: 35, mobileY: 18, dealOrder: 4 },
      { x: 64, y: 50, rotation: 0, mobileX: 62, mobileY: 50, dealOrder: 5 },
      { x: 88, y: 82, rotation: 0, mobileX: 91, mobileY: 82, dealOrder: 6 },
      { x: 88, y: 61, rotation: 0, mobileX: 91, mobileY: 61, dealOrder: 7 },
      { x: 88, y: 40, rotation: 0, mobileX: 91, mobileY: 40, dealOrder: 8 },
      { x: 88, y: 19, rotation: 0, mobileX: 91, mobileY: 19, dealOrder: 9 }
    ]
  }
};

const modalDiagramLayouts = {
  "celtic-cross": {
    positions: [
      { x: 38, y: 49, rotation: 0, mobileX: 36, mobileY: 49 },
      { x: 38, y: 49, rotation: 90, mobileX: 36, mobileY: 49 },
      { x: 38, y: 82, rotation: 0, mobileX: 36, mobileY: 82 },
      { x: 12, y: 49, rotation: 0, mobileX: 10, mobileY: 49 },
      { x: 38, y: 16, rotation: 0, mobileX: 36, mobileY: 16 },
      { x: 64, y: 49, rotation: 0, mobileX: 62, mobileY: 49 },
      { x: 89, y: 84, rotation: 0, mobileX: 88, mobileY: 84 },
      { x: 89, y: 62, rotation: 0, mobileX: 88, mobileY: 62 },
      { x: 89, y: 40, rotation: 0, mobileX: 88, mobileY: 40 },
      { x: 89, y: 18, rotation: 0, mobileX: 88, mobileY: 18 }
    ]
  }
};

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
  const educationHero = getTarotEducationHeroImages("tarot-spreads");
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
    `<link rel="preload" as="image" href="${escapeHtml(educationHero.regular.src)}" fetchpriority="high" />`,
    `<script id="tarot-spreads-breadcrumb-schema" type="application/ld+json">${serializeForInlineScript(schemas.breadcrumb)}</script>`,
    `<script id="tarot-spreads-webpage-schema" type="application/ld+json">${serializeForInlineScript(schemas.webPage)}</script>`,
    `<script id="tarot-spreads-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`,
    `<script src="/js/tarot-education-route-scroll.js"></script>`
  ].join("\n    ");
}

function renderSectionHeader(section) {
  return `<header class="tarot-spreads-section__heading">
          <p class="major-arcana-eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.heading)}</h2>
          ${section.introduction ? `<p>${escapeHtml(section.introduction)}</p>` : ""}
        </header>`;
}

function renderCardBackDiagram(count, label, positionNames = [], modifier = "", options = {}) {
  const interactive = options.interactive === true;
  const spreadId = String(options.spreadId || "");
  const layoutClass = options.layoutClass ? ` ${escapeHtml(options.layoutClass)}` : "";
  const cards = Array.from({ length: count }, (_, index) => {
    const position = positionNames[index] || `Position ${index + 1}`;
    const copy = options.positions?.[index]?.copy || "";
    const layoutPosition = options.layout?.positions?.[index];
    const tagName = interactive ? "button" : "span";
    const interactionAttributes = interactive
      ? ` type="button" aria-label="Position ${index + 1}: ${escapeHtml(position)}" aria-pressed="${index === 0 ? "true" : "false"}" tabindex="${index === 0 ? "0" : "-1"}" data-spread-position="${index}" data-position-id="${escapeHtml(spreadId)}-${index + 1}" data-spread-position-spread="${escapeHtml(spreadId)}" data-position-name="${escapeHtml(position)}" data-position-copy="${escapeHtml(copy)}"`
      : "";
    const positionStyles = layoutPosition
      ? `;--spread-x:${layoutPosition.x}%;--spread-y:${layoutPosition.y}%;--spread-tablet-x:${layoutPosition.tabletX ?? layoutPosition.x}%;--spread-tablet-y:${layoutPosition.tabletY ?? layoutPosition.y}%;--spread-mobile-x:${layoutPosition.mobileX ?? layoutPosition.x}%;--spread-mobile-y:${layoutPosition.mobileY ?? layoutPosition.y}%;--spread-rotation:${layoutPosition.rotation || 0}deg;--spread-tablet-rotation:${layoutPosition.tabletRotation ?? layoutPosition.rotation ?? 0}deg;--spread-mobile-rotation:${layoutPosition.mobileRotation ?? layoutPosition.rotation ?? 0}deg;--spread-deal-order:${layoutPosition.dealOrder ?? index}`
      : "";
    return `<${tagName} class="tarot-spread-diagram__card${interactive ? " spread-position-card" : ""}${interactive && index === 0 ? " is-active" : ""}" style="--spread-card-index:${index}${positionStyles}"${interactionAttributes}>${interactive ? `
            <span class="spread-position-card__number" aria-hidden="true">${index + 1}</span>` : ""}
            <img src="${cardBack.src}" alt="Face-down tarot card representing ${escapeHtml(position)}" width="${cardBack.width}" height="${cardBack.height}" loading="lazy" decoding="async" data-major-theme-image data-standard-src="${cardBack.src}" data-standard-alt="Face-down tarot card representing ${escapeHtml(position)}" data-blood-src="${cardBack.bloodSrc}" data-blood-alt="Face-down Blood Moon tarot card representing ${escapeHtml(position)}" />
            <span${interactive ? ` class="spread-position-card__label"` : ""}>${escapeHtml(position)}</span>
          </${tagName}>`;
  }).join("");
  const modifierClass = modifier ? ` ${modifier}` : "";
  return `<figure class="tarot-spread-diagram tarot-spread-diagram--${count}${modifierClass}" data-spread-card-count="${count}" aria-label="${escapeHtml(label)}">
          <div class="tarot-spread-diagram__layout${layoutClass}"${interactive ? ` role="group" aria-label="Choose a position in ${escapeHtml(label)}"` : ""}>${cards}</div>
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
  return `<section id="tarot-spreads-hero" class="tarot-education-hero tarot-education-hero--immersive tarot-education-hero--reference tarot-spreads-hero" aria-labelledby="tarot-spreads-title" data-education-page="tarot-spreads">
        <div class="tarot-education-hero__stage tarot-spreads-hero__stage">
          <div class="tarot-spreads-hero__visual" aria-hidden="true">${renderTarotEducationHeroImage({ pageKey: "tarot-spreads", decorative: true })}</div>
          <div class="tarot-education-hero__overlay tarot-spreads-hero__overlay"></div>
          <div class="tarot-education-hero__copy tarot-spreads-shell tarot-spreads-hero__content">
            <p class="major-arcana-eyebrow">${escapeHtml(hero.eyebrow)}</p>
            <h1 id="tarot-spreads-title" class="tarot-spreads-hero__title"><span class="tarot-spreads-hero__title-main">Tarot Spreads</span> <span class="tarot-spreads-hero__title-secondary">Explained</span></h1>
            <div class="tarot-spreads-hero__copy tarot-spreads-hero__copy--primary"><p>${escapeHtml(primaryParagraph)}</p></div>
            <div class="tarot-spreads-hero__actions tarot-spreads-hero__actions--primary">
              <a class="tarot-spreads-button tarot-spreads-button--primary" href="#explore-tarot-spreads">Explore Tarot Spreads</a>
            </div>
          </div>
        </div>
        <div class="tarot-education-hero__editorial tarot-spreads-hero__editorial">
          <div class="tarot-spreads-shell tarot-spreads-hero__editorial-inner">
            <div class="tarot-spreads-hero__copy tarot-spreads-hero__copy--secondary"><p>${escapeHtml(secondaryParagraph)}</p></div>
            <div class="tarot-spreads-hero__editorial-meta">
              <ul class="tarot-spreads-hero__facts">${hero.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
              <a class="tarot-spreads-button tarot-spreads-hero__secondary-action" href="/how-to-read-tarot-cards/">How to Read Tarot Cards</a>
            </div>
          </div>
        </div>
      </section>`;
}

function renderDefinition(page) {
  const section = page.definition;
  const cards = section.concepts.map((concept, index) => `<button class="tarot-spreads-definition__card${index === 0 ? " is-active" : ""}" id="spread-definition-tab-${index + 1}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="spread-definition-panel-${index + 1}" tabindex="${index === 0 ? "0" : "-1"}" data-spread-definition-card="${index}">
            <span class="tarot-spreads-definition__card-media" aria-hidden="true">
              <img src="${cardBack.src}" alt="" width="${cardBack.width}" height="${cardBack.height}" loading="lazy" decoding="async" data-major-theme-image data-standard-src="${cardBack.src}" data-standard-alt="" data-blood-src="${cardBack.bloodSrc}" data-blood-alt="" />
              <span>${String(index + 1).padStart(2, "0")}</span>
            </span>
            <span class="tarot-spreads-definition__card-label">${escapeHtml(concept.title)}</span>
          </button>`).join("");
  const panels = section.concepts.map((concept, index) => `<article class="tarot-spreads-definition__panel${index === 0 ? " is-active" : ""}" id="spread-definition-panel-${index + 1}" role="tabpanel" aria-labelledby="spread-definition-tab-${index + 1}"${index === 0 ? "" : " hidden inert"} data-spread-definition-panel="${index}">
            <p class="tarot-spreads-definition__panel-number" aria-hidden="true">0${index + 1}</p>
            <div>
              <h3>${escapeHtml(concept.title)}</h3>
              <p>${escapeHtml(concept.copy)}</p>
            </div>
          </article>`).join("");
  return `<section class="tarot-spreads-section tarot-spreads-definition" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          <div class="tarot-spreads-definition__layout">
            <div class="tarot-spreads-definition__editorial">
              ${renderSectionHeader(section)}
              <div class="tarot-spreads-prose">${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
            </div>
            <div class="tarot-spreads-definition__experience" data-spread-definition>
              <div class="tarot-spreads-definition__question">
                <span aria-hidden="true">✦</span>
                <p>${escapeHtml(section.prompt)}</p>
              </div>
              <div class="tarot-spreads-definition__cards" role="tablist" aria-label="Explore how a tarot spread creates meaning" aria-orientation="horizontal" data-spread-definition-track>
                ${cards}
              </div>
              <p class="tarot-spreads-definition__swipe-hint" aria-hidden="true">Swipe or tap to explore</p>
              <div class="tarot-spreads-definition__panels" aria-live="polite">
                ${panels}
              </div>
            </div>
          </div>
        </div>
      </section>`;
}

function renderExplorer(page) {
  const section = page.explorer;
  const filters = section.filters.map((filter, index) => `<button class="spread-filter-rail__segment${index === 0 ? " is-active" : ""}" type="button" aria-pressed="${index === 0 ? "true" : "false"}" tabindex="${index === 0 ? "0" : "-1"}" data-spread-filter="${escapeHtml(filter.key)}"><span>${escapeHtml(filter.label)}</span></button>`).join("");
  const selectors = section.items.map((spread, index) => {
    const miniatureCards = spread.positions.map((position, positionIndex) => `<span class="tarot-spread-diagram__card" style="--spread-card-index:${positionIndex}"><img src="${cardBack.src}" alt="" width="${cardBack.width}" height="${cardBack.height}" loading="lazy" decoding="async" data-major-theme-image data-standard-src="${cardBack.src}" data-standard-alt="" data-blood-src="${cardBack.bloodSrc}" data-blood-alt="" /><span>${escapeHtml(position.name)}</span></span>`).join("");
    return `<button class="spread-gallery__item${index === 0 ? " is-active" : ""}" id="spread-selector-${escapeHtml(spread.id)}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="spread-panel-${escapeHtml(spread.id)}" tabindex="${index === 0 ? "0" : "-1"}" data-spread-selector="${escapeHtml(spread.id)}" data-spread-categories="${escapeHtml(spread.categories.join(" "))}" data-spread-available="${spread.isAvailable ? "true" : "false"}">
          <span class="spread-gallery__active-marker" aria-hidden="true"></span>
          <span class="spread-gallery__preview" aria-hidden="true"><span class="tarot-spread-diagram tarot-spread-diagram--${spread.cardCount} spread-gallery__diagram tarot-spread-diagram--${escapeHtml(spread.id)}"><span class="tarot-spread-diagram__layout">${miniatureCards}</span></span></span>
          <span class="spread-gallery__copy">
            <strong>${escapeHtml(spread.displayName || spread.name)}</strong>
            <small>${spread.cardCount} ${spread.cardCount === 1 ? "card" : "cards"} · ${escapeHtml(spread.difficulty)}</small>
            <em>${spread.isAvailable ? "Available" : "v2.5 Preview"}</em>
          </span>
        </button>`;
  }).join("");
  const panels = section.items.map((spread, index) => {
    const layout = explorerStageLayouts[spread.id];
    if (!layout || layout.positions.length !== spread.cardCount) {
      throw new Error(`Missing complete Explore stage layout for ${spread.id}`);
    }
    const positionNames = spread.positions.map((position) => position.name);
    const chooseGuidance = spread.guidance.replace(
      /^This spread tells [^.]+\.\s*Choose it (?:when|for)\s*/i,
      ""
    );
    const action = spread.isAvailable
      ? `<button class="spread-overview__action" type="button" aria-haspopup="dialog" data-spread-modal-open="${escapeHtml(spread.id)}">Learn This Spread</button>
            <a class="spread-overview__action spread-overview__action--primary" href="${escapeHtml(spread.href)}">Start This Spread</a>`
      : `<button class="spread-overview__action" type="button" aria-haspopup="dialog" data-spread-modal-open="${escapeHtml(spread.id)}">Learn This Spread</button>
            <span class="spread-overview__availability" role="status">Planned for v2.5</span>`;
    const drawerDetails = spread.positions.map((position, positionIndex) => {
      const interpretation = spread.tips[positionIndex % spread.tips.length];
      const reflectiveQuestion = spread.exampleQuestions[positionIndex % spread.exampleQuestions.length];
      return `<section class="spread-position-drawer__detail${positionIndex === 0 ? " is-active" : ""}"${positionIndex === 0 ? "" : " hidden inert"} data-spread-position-item="${positionIndex}">
                  <div><p class="spread-position-drawer__label">How to interpret it</p><p>${escapeHtml(interpretation)}</p></div>
                  <div><p class="spread-position-drawer__label">Reflective question</p><p>${escapeHtml(reflectiveQuestion)}</p></div>
                </section>`;
    }).join("");
    const stageStyles = `--spread-stage-aspect:${layout.stage.aspect};--spread-stage-mobile-aspect:${layout.stage.mobileAspect};--spread-stage-max-width:${layout.stage.maxWidth}px;--spread-card-min:${layout.card.min}px;--spread-card-fluid:${layout.card.fluid}vw;--spread-card-max:${layout.card.max}px;--spread-card-mobile-min:${layout.card.mobileMin}px;--spread-card-mobile-fluid:${layout.card.mobileFluid}vw;--spread-card-mobile-max:${layout.card.mobileMax}px`;
    return `<article class="tarot-spread-observatory__spread${index === 0 ? " is-active" : ""}" id="spread-panel-${escapeHtml(spread.id)}" role="tabpanel" aria-labelledby="spread-selector-${escapeHtml(spread.id)}" aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " hidden inert"} data-spread-panel="${escapeHtml(spread.id)}" data-spread-card-total="${spread.cardCount}">
          <div class="spread-tabletop" style="${stageStyles}" data-spread-tabletop="${escapeHtml(spread.id)}"${layout.source ? ` data-spread-layout-source="${layout.source}"` : ""}>
            <header class="spread-tabletop__header">
              <div><p>${spread.isAvailable ? "Available Reading" : "Educational Preview"}</p><h3>${escapeHtml(spread.name)}</h3></div>
              <span>${spread.cardCount} ${spread.cardCount === 1 ? "Card" : "Cards"} · ${escapeHtml(spread.difficulty)} · ${spread.isAvailable ? "Available" : "v2.5 Preview"}</span>
            </header>
            <div class="spread-tabletop__diagram">${renderCardBackDiagram(spread.cardCount, `${spread.name} card layout`, positionNames, `spread-tabletop__layout tarot-spread-diagram--${escapeHtml(spread.id)}`, { interactive: true, spreadId: spread.id, positions: spread.positions, layout })}</div>
            <p class="spread-tabletop__hint"><span aria-hidden="true">✦</span> Select a position to reveal its meaning</p>
          </div>
          <section class="spread-position-drawer" aria-label="${escapeHtml(spread.name)} selected position" data-spread-position-detail data-spread-drawer="${escapeHtml(spread.id)}">
            <div class="spread-position-drawer__summary" aria-live="polite" aria-atomic="true">
              <p><span data-spread-position-number>Position 01</span><span aria-hidden="true"> · </span><span data-spread-position-name>${escapeHtml(spread.positions[0].name)}</span></p>
              <h4 data-spread-position-title>${escapeHtml(spread.positions[0].name)}</h4>
              <p data-spread-position-copy>${escapeHtml(spread.positions[0].copy)}</p>
            </div>
            <div class="spread-position-drawer__details" data-spread-drawer-details hidden>${drawerDetails}</div>
            <div class="spread-position-drawer__controls">
              <button type="button" data-spread-drawer-previous="${escapeHtml(spread.id)}"${spread.cardCount === 1 ? " disabled" : ""}><span aria-hidden="true">←</span> Previous</button>
              <button type="button" aria-expanded="false" data-spread-drawer-toggle="${escapeHtml(spread.id)}"><span data-spread-drawer-toggle-label>Expand details</span> <span aria-hidden="true">↓</span></button>
              <button type="button" data-spread-drawer-next="${escapeHtml(spread.id)}"${spread.cardCount === 1 ? " disabled" : ""}>Next <span aria-hidden="true">→</span></button>
            </div>
          </section>
          <aside class="spread-overview" aria-label="${escapeHtml(spread.name)} overview">
            <header class="spread-overview__header">
              <p>${spread.isAvailable ? "Available now" : "Educational preview · v2.5"}</p>
              <h3 class="spread-overview__title">${escapeHtml(spread.name)}</h3>
              <span>${spread.cardCount} ${spread.cardCount === 1 ? "card" : "cards"} · ${escapeHtml(spread.difficulty)} · ${spread.isAvailable ? "Available" : "Preview"}</span>
            </header>
            <div class="spread-overview__rule" aria-hidden="true"></div>
            <p class="spread-overview__guidance"><strong>Choose this spread when</strong>${escapeHtml(chooseGuidance)}</p>
            <dl class="spread-overview__facts">
              <div><dt>Best for</dt><dd>${escapeHtml(spread.bestFor)}</dd></div>
              <div><dt>Overview</dt><dd>${escapeHtml(spread.summary)}</dd></div>
              <div><dt>Status</dt><dd>${spread.isAvailable ? "Available now" : "Planned for v2.5"}</dd></div>
            </dl>
            <div class="spread-overview__actions">${action}</div>
          </aside>
        </article>`;
  }).join("");
  const modalPanels = section.items.map((spread) => {
    const positionNames = spread.positions.map((position) => position.name);
    const modalLayout = modalDiagramLayouts[spread.id];
    const modalAction = spread.isAvailable
      ? `<a class="tarot-spreads-observatory-button tarot-spreads-observatory-button--primary" href="${escapeHtml(spread.href)}">Start This Spread</a>`
      : `<span class="tarot-spreads-explorer__release" role="status">Planned for v2.5</span>`;
    return `<article class="tarot-spreads-modal__content" data-spread-modal-panel="${escapeHtml(spread.id)}" hidden inert>
            <header class="tarot-spreads-modal__header">
              <p class="major-arcana-eyebrow">${spread.cardCount} ${spread.cardCount === 1 ? "Card" : "Cards"} · ${escapeHtml(spread.difficulty)}</p>
              <h3 id="spread-modal-title-${escapeHtml(spread.id)}">${escapeHtml(spread.name)}</h3>
              <p>${escapeHtml(spread.summary)}</p>
            </header>
            <div class="tarot-spreads-modal__body">
              <div class="tarot-spreads-modal__preview">
                ${renderCardBackDiagram(spread.cardCount, `${spread.name} modal layout preview`, positionNames, `tarot-spread-diagram--observatory tarot-spread-diagram--modal tarot-spread-diagram--${escapeHtml(spread.id)}`, { layout: modalLayout })}
                <div class="tarot-spreads-modal__when">
                  <h4>When to use it</h4>
                  <p>${escapeHtml(spread.bestFor)}</p>
                  <p>${escapeHtml(spread.guidance)}</p>
                </div>
              </div>
              <div class="tarot-spreads-modal__guidance">
                <section>
                  <h4>Position meanings</h4>
                  <ol class="tarot-spreads-position-list">${spread.positions.map((position) => `<li><strong>${escapeHtml(position.name)}</strong><span>${escapeHtml(position.copy)}</span></li>`).join("")}</ol>
                </section>
                <section>
                  <h4>Interpretation tips</h4>
                  <ul>${spread.tips.map((tip) => `<li><span aria-hidden="true">✦</span>${escapeHtml(tip)}</li>`).join("")}</ul>
                </section>
                <section>
                  <h4>Example questions</h4>
                  <ul>${spread.exampleQuestions.map((question) => `<li><span aria-hidden="true">✦</span>${escapeHtml(question)}</li>`).join("")}</ul>
                </section>
                <section>
                  <h4>Common mistakes</h4>
                  <ul>${spread.commonMistakes.map((mistake) => `<li><span aria-hidden="true">✦</span>${escapeHtml(mistake)}</li>`).join("")}</ul>
                </section>
              </div>
            </div>
            <footer class="tarot-spreads-modal__footer">${modalAction}</footer>
          </article>`;
  }).join("");
  return `<section class="tarot-spreads-section tarot-spread-observatory tarot-spread-observatory--gallery" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-spread-explorer>
        <div class="tarot-spreads-shell">
          <header class="tarot-spread-observatory__header">
            <div class="tarot-spread-observatory__heading">
              <p class="major-arcana-eyebrow">${escapeHtml(section.eyebrow)}</p>
              <h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.heading)}</h2>
              <p>${escapeHtml(section.introduction)}</p>
            </div>
            <div class="spread-filter-rail" role="toolbar" aria-label="Filter tarot spreads" aria-orientation="horizontal" data-spread-filter-track>
              <span class="spread-filter-rail__indicator" aria-hidden="true"></span>
              ${filters}
            </div>
          </header>
          <div class="spread-gallery" aria-label="Choose a tarot spread">
            <div class="spread-gallery__track" role="tablist" aria-label="Tarot spread layouts" aria-orientation="horizontal" data-spread-gallery-track>
              ${selectors}
            </div>
          </div>
          <p class="major-arcana-visually-hidden" aria-live="polite" aria-atomic="true" data-spread-explorer-status>${escapeHtml(section.items[0].name)} selected</p>
          <div class="spread-observatory-workspace"><div class="tarot-spread-observatory__views">${panels}</div></div>
        </div>
        <div class="tarot-spreads-modal" data-spread-modal hidden>
          <button class="tarot-spreads-modal__backdrop" type="button" aria-label="Close spread details" data-spread-modal-close></button>
          <section class="tarot-spreads-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="spread-modal-title-one-card" tabindex="-1" data-spread-modal-dialog>
            <button class="tarot-spreads-modal__close" type="button" aria-label="Close spread details" data-spread-modal-close><span aria-hidden="true">×</span></button>
            ${modalPanels}
            <button class="tarot-spreads-modal__return" type="button" data-spread-modal-close><span aria-hidden="true">←</span> Return to Explorer</button>
          </section>
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
  const spreadPresentations = section.groups.map((group, index) => {
    const route = routes[group.cards];
    const isFiveCardSpread = group.cards === 5;
    const diagram = renderCardBackDiagram(
      group.cards,
      `${group.title} beginner spread`,
      group.positionNames,
      "tarot-spread-diagram--beginner",
      isFiveCardSpread ? { layoutClass: "beginner-five-card-layout" } : {}
    );
    const visual = isFiveCardSpread
      ? `<div class="beginner-spread__visual">${diagram}</div>`
      : diagram;
    return `<article class="tarot-spreads-beginners__spread${isFiveCardSpread ? " beginner-spread beginner-spread--five" : ""}${index === 0 ? " is-active" : ""}" aria-current="${index === 0 ? "step" : "false"}" data-beginner-spread="${index}">
            <div class="tarot-spreads-beginners__stage">
              ${visual}
              <button class="tarot-spreads-beginners__selector" type="button" aria-label="Select ${escapeHtml(group.title)} in the beginner progression" aria-pressed="${index === 0 ? "true" : "false"}" aria-controls="beginner-spread-copy-${group.cards}" data-beginner-selector="${index}"><span class="major-arcana-visually-hidden">Select ${escapeHtml(group.title)}</span></button>
            </div>
            <div class="tarot-spreads-beginners__copy${isFiveCardSpread ? " beginner-spread__content" : ""}" id="beginner-spread-copy-${group.cards}">
              <p class="tarot-spreads-beginners__label">${escapeHtml(group.label)}</p>
              <h3>${escapeHtml(group.title)}</h3>
              <span class="tarot-spreads-beginners__divider" aria-hidden="true"></span>
              <p class="tarot-spreads-beginners__best-for"><strong>Best for</strong><span>${escapeHtml(group.bestFor)}</span></p>
              <p class="tarot-spreads-beginners__supporting">${escapeHtml(group.supporting)}</p>
              <a href="${escapeHtml(route.route)}">${escapeHtml(route.label)} <span aria-hidden="true">→</span></a>
            </div>
          </article>`;
  }).join("");
  const progressNodes = section.groups.map((group, index) => `<div class="tarot-spreads-beginners__path-node" data-beginner-path-node="${index}">
            <span aria-hidden="true"></span>
            <strong>${escapeHtml(group.label)}</strong>
            <small>${escapeHtml(group.progressSummary)}</small>
          </div>`).join("");
  return `<section class="tarot-spreads-section tarot-spreads-beginners tarot-spreads-beginners--progression" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-beginner-progression data-beginner-active="0">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-beginners__viewport">
            <div class="tarot-spreads-beginners__track" data-beginner-track>${spreadPresentations}</div>
          </div>
          <div class="tarot-spreads-beginners__path" aria-hidden="true">${progressNodes}</div>
          <div class="tarot-spreads-beginners__controls" aria-label="Beginner spread progression controls">
            <button type="button" aria-label="Show previous beginner spread" data-beginner-previous><span aria-hidden="true">←</span><span>Previous</span></button>
            <p aria-live="polite" aria-atomic="true"><span data-beginner-count>1 of 3</span><strong data-beginner-label>${escapeHtml(section.groups[0].label)}</strong></p>
            <button type="button" aria-label="Show next beginner spread" data-beginner-next><span>Next</span><span aria-hidden="true">→</span></button>
          </div>
        </div>
      </section>`;
}

function renderIntentions(page) {
  const section = page.intentions;
  const pathways = section.items.map((item, index) => {
    const number = String(index + 1).padStart(2, "0");
    const imageTag = `<picture>
                <img src="${escapeHtml(item.image.src)}" alt="${escapeHtml(item.image.alt)}" width="${item.image.width}" height="${item.image.height}" loading="lazy" decoding="async" sizes="(max-width: 768px) 84vw, (max-width: 1100px) 45vw, 38vw" data-major-theme-image data-standard-src="${escapeHtml(item.image.src)}" data-standard-alt="${escapeHtml(item.image.alt)}" data-blood-src="${escapeHtml(item.image.bloodSrc)}" data-blood-alt="${escapeHtml(item.image.bloodAlt)}" />
              </picture>`;
    const media = item.route
      ? `<a class="tarot-spreads-intentions__image-link" href="${escapeHtml(item.route)}" aria-label="${escapeHtml(item.linkLabel)}">${imageTag}</a>`
      : `<div class="tarot-spreads-intentions__image-link tarot-spreads-intentions__image-link--static">${imageTag}</div>`;
    const action = item.route
      ? `<a class="tarot-spreads-intentions__cta" href="${escapeHtml(item.route)}">${escapeHtml(item.linkLabel)} <span aria-hidden="true">→</span></a>`
      : `<span class="tarot-spreads-status tarot-spreads-intentions__status">Dedicated guide · Coming Soon</span>`;

    return `<article class="tarot-spreads-intentions__pathway${item.route ? "" : " tarot-spreads-intentions__pathway--coming-soon"}" data-intention-pathway>
            ${media}
            <div class="tarot-spreads-intentions__content">
              <p class="tarot-spreads-intentions__meta"><span class="tarot-spreads-intentions__number">${number}</span><span class="tarot-spreads-intentions__line" aria-hidden="true"></span><span class="tarot-spreads-intentions__label">${escapeHtml(item.label)}</span></p>
              <h3>${escapeHtml(item.title)}</h3>
              <p class="tarot-spreads-intentions__description">${escapeHtml(item.copy)}</p>
              ${action}
            </div>
          </article>`;
  }).join("");

  return `<section class="tarot-spreads-section tarot-spreads-intentions" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-intentions__gallery" data-intention-gallery>
            <div class="tarot-spreads-intentions__grid" data-intention-track>${pathways}</div>
            <div class="tarot-spreads-intentions__controls" aria-label="Intention gallery controls">
              <button type="button" aria-label="Show previous intention" data-intention-previous><span aria-hidden="true">←</span><span>Previous</span></button>
              <p aria-live="polite" aria-atomic="true"><span data-intention-count>1 of ${section.items.length}</span></p>
              <button type="button" aria-label="Show next intention" data-intention-next><span>Next</span><span aria-hidden="true">→</span></button>
            </div>
          </div>
        </div>
      </section>`;
}

function renderPositions(page) {
  const section = page.positions;
  const card = tarotCardDetails.find((candidate) => candidate.title === section.cardTitle);
  if (!card) throw new Error(`Missing canonical tarot card: ${section.cardTitle}`);
  const positions = section.examples.map((example, index) => ({
    ...example,
    index,
    key: example.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }));
  const tabs = positions.map((position) => `<button class="tarot-spreads-positions__tab${position.index === 0 ? " is-active" : ""}" id="card-position-tab-${position.key}" type="button" role="tab" aria-selected="${position.index === 0 ? "true" : "false"}" aria-controls="card-position-panel-${position.key}" tabindex="${position.index === 0 ? "0" : "-1"}" data-card-position-tab="${position.key}"><span>${escapeHtml(position.label)}</span></button>`).join("");
  const markers = positions.map((position) => `<span class="tarot-spreads-positions__marker tarot-spreads-positions__marker--${position.key}${position.index === 0 ? " is-active" : ""}" data-card-position-marker="${position.key}"><span>${String(position.index + 1).padStart(2, "0")}</span><strong>${escapeHtml(position.label)}</strong></span>`).join("");
  const panels = positions.map((position) => `<article class="tarot-spreads-positions__panel${position.index === 0 ? " is-active" : ""}" id="card-position-panel-${position.key}" role="tabpanel" aria-labelledby="card-position-tab-${position.key}" aria-hidden="${position.index === 0 ? "false" : "true"}"${position.index === 0 ? "" : " hidden inert"} data-card-position-panel="${position.key}">
                  <p class="tarot-spreads-positions__number">Position ${String(position.index + 1).padStart(2, "0")}</p>
                  <p class="tarot-spreads-positions__context">${escapeHtml(position.context)}</p>
                  <h3>${escapeHtml(position.label)}</h3>
                  <span class="tarot-spreads-positions__divider" aria-hidden="true"></span>
                  <p class="tarot-spreads-positions__meaning">${escapeHtml(position.copy)}</p>
                </article>`).join("");
  return `<section class="tarot-spreads-section tarot-spreads-positions" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-positions__experience" data-card-position-experience data-active-position="${positions[0].key}" style="--position-active-index:0">
            <div class="tarot-spreads-positions__selector" role="tablist" aria-label="Choose The Hermit's spread position">
              ${tabs}
            </div>
            <div class="tarot-spreads-positions__visual">
              <div class="tarot-spreads-positions__markers" aria-hidden="true">${markers}</div>
              <figure class="tarot-spreads-positions__figure">
                <span class="tarot-spreads-positions__trace" aria-hidden="true"></span>
                ${renderThemeCardImage(card, "tarot-spreads-positions__card")}
                <figcaption>The Hermit — one card interpreted through three spread positions.</figcaption>
              </figure>
            </div>
            <div class="tarot-spreads-positions__reading" aria-live="polite">
              <div class="tarot-spreads-positions__panels">${panels}</div>
              <p class="tarot-spreads-positions__link"><a href="/tarot/the-hermit/">Explore The Hermit Tarot Card Meaning <span aria-hidden="true">→</span></a></p>
            </div>
          </div>
        </div>
      </section>`;
}

function renderHowTo(page) {
  const section = page.howTo;
  const renderCardBack = (className = "") => `<img${className ? ` class="${className}"` : ""} src="${cardBack.src}" alt="" width="${cardBack.width}" height="${cardBack.height}" loading="lazy" decoding="async" data-major-theme-image data-standard-src="${cardBack.src}" data-standard-alt="" data-blood-src="${cardBack.bloodSrc}" data-blood-alt="" />`;
  const renderVisual = (stage) => {
    if (stage.visual === "question") {
      return `<div class="question-story-visual question-story-visual--question" aria-hidden="true"><span class="question-story-visual__orbit"></span><span class="question-story-visual__question">?</span><span class="question-story-visual__journal-line"></span></div>`;
    }
    if (stage.visual === "layout") {
      return `<div class="question-story-visual question-story-visual--layout" aria-hidden="true">
                    <span class="question-story-layout-symbol question-story-layout-symbol--one"><i></i></span>
                    <span class="question-story-layout-symbol question-story-layout-symbol--three"><i></i><i></i><i></i></span>
                    <span class="question-story-layout-symbol question-story-layout-symbol--five"><i></i><i></i><i></i><i></i><i></i></span>
                    <span class="question-story-layout-symbol question-story-layout-symbol--cross">${Array.from({ length: 10 }, () => "<i></i>").join("")}</span>
                  </div>`;
    }
    if (stage.visual === "shuffle") {
      return `<div class="question-story-visual question-story-visual--shuffle" aria-hidden="true">${renderCardBack()}${renderCardBack()}${renderCardBack()}</div>`;
    }
    if (stage.visual === "place") {
      return `<div class="question-story-visual question-story-visual--place" aria-hidden="true"><span class="question-story-visual__deck">${renderCardBack()}</span><span class="question-story-visual__dealt">${renderCardBack()}${renderCardBack()}${renderCardBack()}</span></div>`;
    }
    return `<div class="question-story-visual question-story-visual--story" aria-hidden="true"><span class="question-story-visual__constellation"></span>${renderCardBack()}${renderCardBack()}${renderCardBack()}<span class="question-story-visual__marker">✦</span></div>`;
  };
  const tabs = section.stages.map((stage, index) => `<button class="tarot-spreads-how-to__tab${index === 0 ? " is-active" : ""}" id="question-story-tab-${escapeHtml(stage.key)}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="question-story-panel-${escapeHtml(stage.key)}" tabindex="${index === 0 ? "0" : "-1"}" data-question-story-tab="${escapeHtml(stage.key)}"><span class="tarot-spreads-how-to__node" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span></span><span class="tarot-spreads-how-to__tab-title">${escapeHtml(stage.title)}</span></button>`).join("");
  const panels = section.stages.map((stage, index) => {
    const guidance = stage.guidance?.length ? `<section class="tarot-spreads-how-to__dossier-group" aria-labelledby="question-story-${escapeHtml(stage.key)}-guidance"><p class="tarot-spreads-how-to__dossier-label">Archive guidance</p><h4 id="question-story-${escapeHtml(stage.key)}-guidance">Guidance for this stage</h4><ul class="tarot-spreads-how-to__guidance">${stage.guidance.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : "";
    const recommendations = stage.recommendations?.length ? `<section class="tarot-spreads-how-to__dossier-group" aria-labelledby="question-story-${escapeHtml(stage.key)}-recommendations"><p class="tarot-spreads-how-to__dossier-label">Layout index</p><h4 id="question-story-${escapeHtml(stage.key)}-recommendations">Match the question to the spread</h4><dl class="tarot-spreads-how-to__recommendations">${stage.recommendations.map((item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.copy)}</dd></div>`).join("")}</dl></section>` : "";
    const examples = stage.examples?.length ? `<section class="tarot-spreads-how-to__dossier-group" aria-labelledby="question-story-${escapeHtml(stage.key)}-examples"><p class="tarot-spreads-how-to__dossier-label">Example prompts</p><h4 id="question-story-${escapeHtml(stage.key)}-examples">Questions worth opening</h4><ul class="tarot-spreads-how-to__prompts">${stage.examples.map((example) => `<li>“${escapeHtml(example)}”</li>`).join("")}</ul></section>` : "";
    const note = stage.note ? `<p class="tarot-spreads-how-to__note">${escapeHtml(stage.note)}</p>` : "";
    const action = stage.action ? `<p class="tarot-spreads-how-to__stage-action"><a href="${escapeHtml(stage.action.href)}">${escapeHtml(stage.action.label)} <span aria-hidden="true">→</span></a></p>` : "";
    const detailContent = [recommendations, guidance, examples, note, action].filter(Boolean).join("\n                  ");
    return `<article class="tarot-spreads-how-to__panel${index === 0 ? " is-active" : ""}" id="question-story-panel-${escapeHtml(stage.key)}" role="tabpanel" aria-labelledby="question-story-tab-${escapeHtml(stage.key)}" aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " hidden inert"} data-question-story-panel="${escapeHtml(stage.key)}" data-question-story-stage-index="${index}">
                <div class="tarot-spreads-how-to__stage-lead">
                  <p class="tarot-spreads-how-to__stage-number"><span>Stage ${String(index + 1).padStart(2, "0")}</span><span>Archive record ${index + 1}/${section.stages.length}</span></p>
                  <h3>${escapeHtml(stage.title)}</h3>
                  <p class="tarot-spreads-how-to__summary">${escapeHtml(stage.summary)}</p>
                  ${renderVisual(stage)}
                </div>
                <div class="tarot-spreads-how-to__stage-detail">
                  <p class="tarot-spreads-how-to__dossier-label">Active dossier · ${escapeHtml(stage.title)}</p>
                  <p class="tarot-spreads-how-to__dossier-lead">${escapeHtml(stage.lead)}</p>
                  ${detailContent}
                </div>
              </article>`;
  }).join("");
  const destinationIcons = [
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="7" y="3.5" width="10" height="17" rx="2"></rect><path d="m12 7 .75 2.25L15 10l-2.25.75L12 13l-.75-2.25L9 10l2.25-.75L12 7Z"></path></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="8" cy="9" r="3.25"></circle><path d="M8 3.5v-1M8 15.5v-1M2.5 9h-1M14.5 9h-1M4.1 5.1l-.8-.8M12.7 13.7l-.8-.8M11.9 5.1l.8-.8M3.3 13.7l.8-.8M20 7.1a6.2 6.2 0 1 0 0 9.8 5 5 0 0 1 0-9.8Z"></path></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 5.5c3.1-.8 5.5-.25 7.5 1.5v12c-2-1.75-4.4-2.3-7.5-1.5v-12Z"></path><path d="M19.5 5.5c-3.1-.8-5.5-.25-7.5 1.5v12c2-1.75 4.4-2.3 7.5-1.5v-12Z"></path></svg>`
  ];
  const destinations = section.destinations.map((destination, index) => {
    const links = destination.links?.length
      ? `<div class="tarot-spreads-related-links__actions">${destination.links.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)} <span aria-hidden="true">→</span></a>`).join("")}</div>`
      : `<a class="tarot-spreads-related-links__cta" href="${escapeHtml(destination.href)}">${escapeHtml(destination.cta)} <span aria-hidden="true">→</span></a>`;
    return `<article class="tarot-spreads-related-links__destination"><span class="tarot-spreads-related-links__icon">${destinationIcons[index] || destinationIcons[0]}</span><p class="tarot-spreads-related-links__eyebrow">${escapeHtml(destination.eyebrow)}</p><h3>${escapeHtml(destination.title)}</h3><p>${escapeHtml(destination.copy)}</p>${links}</article>`;
  }).join("");
  return `<section class="tarot-spreads-section tarot-spreads-how-to" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-how-to__experience" data-question-story data-active-stage="${escapeHtml(section.stages[0].key)}" style="--story-active-index:0;--story-progress:0">
            <div class="tarot-spreads-how-to__rail" role="tablist" aria-label="How to perform a tarot spread" aria-orientation="horizontal" data-question-story-rail>${tabs}</div>
            <p class="tarot-spreads-how-to__mobile-progress" aria-live="polite" aria-atomic="true" data-question-story-progress>1 of ${section.stages.length}</p>
            <div class="tarot-spreads-how-to__panels">${panels}</div>
            <div class="tarot-spreads-how-to__controls" aria-label="Move between reading stages">
              <button type="button" data-question-story-previous disabled><span aria-hidden="true">←</span> Previous</button>
              <span aria-hidden="true" data-question-story-control-count>1 of ${section.stages.length}</span>
              <button type="button" data-question-story-next>Next <span aria-hidden="true">→</span></button>
            </div>
          </div>
          <nav class="tarot-spreads-related-links" aria-label="Continue learning and practicing tarot">
            <div class="tarot-spreads-related-links__grid">${destinations}</div>
            <a class="tarot-spreads-related-links__cta" href="/how-to-read-tarot-cards/">How to Read Tarot Cards <span aria-hidden="true">→</span></a>
          </nav>
        </div>
      </section>`;
}

function renderPatterns(page) {
  const section = page.patterns;
  const items = section.items.map((item, index) => `<article class="spread-pattern" data-pattern="${escapeHtml(item.key)}" tabindex="0">
              <span class="spread-pattern__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
              <h3 class="spread-pattern__title">${escapeHtml(item.title)}</h3>
              <p class="spread-pattern__description">${escapeHtml(item.copy)}</p>
              <span class="spread-pattern__divider" aria-hidden="true"></span>
              <p class="spread-pattern__example"><span>Example</span>${escapeHtml(item.example)}</p>
            </article>`).join("");
  return `<section class="tarot-spreads-section tarot-spreads-patterns" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-patterns__grid spread-pattern-grid">${items}</div>
        </div>
      </section>`;
}

function renderComparison(page) {
  const section = page.comparison;
  const renderCard = (modifier = "") => `<span class="tarot-spreads-comparison__card${modifier ? ` ${modifier}` : ""}"><img src="${cardBack.src}" alt="" width="${cardBack.width}" height="${cardBack.height}" loading="lazy" decoding="async" data-major-theme-image data-standard-src="${cardBack.src}" data-standard-alt="" data-blood-src="${cardBack.bloodSrc}" data-blood-alt="" /></span>`;
  const renderVisual = (key) => {
    if (key === "simple") {
      return `<div class="tarot-spreads-comparison__visual tarot-spreads-comparison__visual--simple">
              <figure class="comparison-spread comparison-spread--one">
                <div class="comparison-spread__stage">${renderCard()}</div>
                <figcaption>One Card</figcaption>
              </figure>
              <figure class="comparison-spread comparison-spread--three">
                <div class="comparison-spread__stage">${Array.from({ length: 3 }, () => renderCard()).join("")}</div>
                <figcaption>Three Cards</figcaption>
              </figure>
            </div>`;
    }
    return `<div class="tarot-spreads-comparison__visual tarot-spreads-comparison__visual--in-depth">
              <figure class="comparison-spread comparison-spread--five">
                <div class="comparison-spread__stage">${Array.from({ length: 5 }, (_, index) => renderCard(`comparison-spread__position comparison-spread__position--${index + 1}`)).join("")}</div>
                <figcaption>Five Cards</figcaption>
              </figure>
              <figure class="comparison-spread comparison-spread--celtic">
                <div class="comparison-spread__stage">${Array.from({ length: 10 }, (_, index) => renderCard(`comparison-spread__position comparison-spread__position--${index + 1}`)).join("")}</div>
                <figcaption>Celtic Cross</figcaption>
              </figure>
            </div>`;
  };
  const renderPanel = (key, group, active) => `<article class="tarot-spreads-comparison__panel${active ? " is-active" : ""}" id="tarot-spread-${key}-panel" role="tabpanel" aria-labelledby="tarot-spread-${key}-tab" aria-hidden="${active ? "false" : "true"}"${active ? "" : " inert"} data-spread-comparison-panel="${key}">
            ${renderVisual(key)}
            <div class="tarot-spreads-comparison__copy">
              <h3>${escapeHtml(group.label)}</h3>
              <p class="tarot-spreads-comparison__description">${escapeHtml(group.description)}</p>
              <ul class="tarot-spreads-comparison__characteristics" aria-label="${escapeHtml(group.label)} characteristics">${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
              <p class="tarot-spreads-comparison__recommendation"><span>Recommendation</span>${escapeHtml(group.recommendation)}</p>
            </div>
          </article>`;
  return `<section class="tarot-spreads-section tarot-spreads-comparison" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-active-comparison="simple" data-spread-comparison>
        <div class="tarot-spreads-shell">
          ${renderSectionHeader(section)}
          <div class="tarot-spreads-comparison__tabs" role="tablist" aria-label="Compare simple and in-depth tarot spreads">
            <button class="is-active" id="tarot-spread-simple-tab" type="button" role="tab" aria-selected="true" aria-controls="tarot-spread-simple-panel" tabindex="0" data-spread-comparison-tab="simple">Simple Spreads</button>
            <button id="tarot-spread-in-depth-tab" type="button" role="tab" aria-selected="false" aria-controls="tarot-spread-in-depth-panel" tabindex="-1" data-spread-comparison-tab="in-depth">In-Depth Spreads</button>
          </div>
          <div class="tarot-spreads-comparison__viewport">${renderPanel("simple", section.simple, true)}${renderPanel("in-depth", section.inDepth, false)}</div>
          <p class="tarot-spreads-comparison__conclusion"><span>${escapeHtml(section.conclusion)}</span><small>${escapeHtml(section.conclusionSupport)}</small></p>
        </div>
      </section>`;
}

function renderFaq(page) {
  return renderTarotEducationFaq({
    section: page.faq,
    items: page.faq.items,
    idPrefix: "tarot-spreads-faq",
    className: "tarot-spreads-faq"
  });
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
          <p class="major-arcana-closing__status"><a href="/how-to-read-tarot-cards/">Continue with How to Read Tarot Cards</a></p>
        </div>
      </section>`;
}

function renderMain(page) {
  return `<main id="main-content" class="major-arcana-page tarot-spreads-page-content tarot-education-page">
      ${renderTarotEducationNavigation({ activeKey: "spreads", rootDir })}
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
