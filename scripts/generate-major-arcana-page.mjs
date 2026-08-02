import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { majorArcanaPage } from "../data/major-arcana.mjs";
import { getTarotEducationHeroImages } from "../data/tarot-education-hero-images.js";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { escapeHtml, getCardRoute, serializeForInlineScript, SITE_ORIGIN } from "./card-page-helpers.mjs";
import {
  buildMajorArcanaCards,
  getMajorArcanaOutputPath,
  getMajorArcanaRoute,
  validateMajorArcanaData
} from "./major-arcana-page-helpers.mjs";
import { renderTarotEducationFaq, renderTarotEducationHeroImage, renderTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(rootDir, "templates/tarot-major-arcana-page.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const generatedMarkerStart = "<!-- GENERATED:MAJOR_ARCANA_PAGE:START -->";
const generatedMarkerEnd = "<!-- GENERATED:MAJOR_ARCANA_PAGE:END -->";

function renderSchemas(page) {
  const canonicalUrl = `${SITE_ORIGIN}${getMajorArcanaRoute(page)}`;
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
      isPartOf: {
        "@type": "WebSite",
        name: "Astral Veil",
        url: `${SITE_ORIGIN}/`
      },
      about: [
        { "@type": "Thing", name: "Major Arcana" },
        { "@type": "Thing", name: "Tarot card meanings" },
        { "@type": "Thing", name: "The Fool’s Journey" }
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
  const canonicalUrl = `${SITE_ORIGIN}${getMajorArcanaRoute(page)}`;
  const imageUrl = `${SITE_ORIGIN}${page.hero.image.src}`;
  const schemas = renderSchemas(page);
  const educationHero = getTarotEducationHeroImages("major-arcana");
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
    `<link rel="preload" as="image" href="${escapeHtml(educationHero.regular.src)}" fetchpriority="high" />`,
    `<script id="major-arcana-breadcrumb-schema" type="application/ld+json">${serializeForInlineScript(schemas.breadcrumb)}</script>`,
    `<script id="major-arcana-webpage-schema" type="application/ld+json">${serializeForInlineScript(schemas.webPage)}</script>`,
    `<script id="major-arcana-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`
  ].join("\n    ");
}

function renderImage(image, {
  className = "",
  loading = "lazy",
  fetchpriority = "",
  decorative = false
} = {}) {
  const classAttribute = className ? ` class="${className}"` : "";
  const priorityAttribute = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  return `<img${classAttribute} src="${escapeHtml(image.src)}" alt="${decorative ? "" : escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${loading}" decoding="async"${priorityAttribute} draggable="false" />`;
}

function renderThemeCardImage(card, className, { loading = "lazy", sizes = "" } = {}) {
  const sizesAttribute = sizes ? ` sizes="${escapeHtml(sizes)}"` : "";
  return `<img class="${className}" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.imageAlt)}" width="${card.imageWidth}" height="${card.imageHeight}" loading="${loading}" decoding="async"${sizesAttribute} draggable="false" data-major-theme-image data-standard-src="${escapeHtml(card.image)}" data-standard-alt="${escapeHtml(card.imageAlt)}" data-blood-src="${escapeHtml(card.bloodMoonImage)}" data-blood-alt="${escapeHtml(card.bloodMoonImageAlt)}" />`;
}

function renderThemeImage(image, className, { loading = "lazy" } = {}) {
  return `<img class="${className}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${loading}" decoding="async" draggable="false" data-major-theme-image data-standard-src="${escapeHtml(image.src)}" data-standard-alt="${escapeHtml(image.alt)}" data-blood-src="${escapeHtml(image.bloodMoonSrc)}" data-blood-alt="${escapeHtml(image.bloodMoonAlt)}" />`;
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

function renderHero(page) {
  return `<section class="tarot-education-hero tarot-education-hero--immersive major-arcana-hero" aria-labelledby="major-arcana-title" data-education-page="major-arcana">
        <div class="tarot-education-hero__stage major-arcana-hero__stage">
          <div class="tarot-education-hero__copy major-arcana-hero__title">
            <p class="major-arcana-eyebrow">${escapeHtml(page.hero.eyebrow)}</p>
            <h1 id="major-arcana-title">${escapeHtml(page.hero.title)}</h1>
          </div>
          <figure class="tarot-education-hero__visual major-arcana-hero__visual">
            ${renderTarotEducationHeroImage({
              pageKey: "major-arcana",
              className: "tarot-education-hero__image major-arcana-hero__image",
              alt: page.hero.image.alt
            })}
          </figure>
          <div class="tarot-education-hero__overlay" aria-hidden="true"></div>
        </div>
        <div class="tarot-education-hero__editorial major-arcana-hero__content-band">
          <div class="major-arcana-hero__content-inner">
            <div class="major-arcana-hero__introduction">
              ${page.hero.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
            <div class="major-arcana-hero__meta">
              <ul class="major-arcana-hero__facts" aria-label="Major Arcana facts">${page.hero.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
              <a class="major-arcana-button" href="${escapeHtml(page.hero.ctaTarget)}">${escapeHtml(page.hero.ctaLabel)} <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </section>`;
}

function renderExplore(page, cards) {
  const slides = cards.map((card, index) => `<article class="major-arcana-slide${index === 0 ? " is-active" : ""}" id="major-arcana-slide-${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${cards.length}: ${escapeHtml(card.title)}"${index === 0 ? ' aria-current="true"' : ""} data-major-card-slide data-major-card-index="${index}">
            <button class="major-arcana-slide__select" type="button" aria-label="Select ${escapeHtml(card.title)}" aria-pressed="${index === 0 ? "true" : "false"}" data-major-card-select>
              <span class="major-arcana-slide__frame">
                ${renderThemeCardImage(card, "major-arcana-slide__image", { loading: index < 3 ? "eager" : "lazy" })}
                <span class="major-arcana-slide__glint" aria-hidden="true"></span>
              </span>
            </button>
            <div class="major-arcana-slide__copy">
              <p class="major-arcana-slide__number">${escapeHtml(card.displayNumber)} <span aria-hidden="true">·</span></p>
              <h3>${escapeHtml(card.title)}</h3>
              <p class="major-arcana-slide__keywords">${card.keywords.map(escapeHtml).join(" · ")}</p>
              <p class="major-arcana-slide__summary">${escapeHtml(card.summary)}</p>
              <a class="major-arcana-text-link" href="${escapeHtml(card.route)}" data-major-card-link>Explore ${escapeHtml(card.title)}’s Full Meaning <span aria-hidden="true">→</span></a>
            </div>
          </article>`).join("");

  const numbers = cards.map((card, index) => `<button class="major-arcana-number${index === 0 ? " is-active" : ""}" type="button" aria-label="Select ${escapeHtml(card.title)}, card ${card.sortOrder}" aria-pressed="${index === 0 ? "true" : "false"}" data-major-number="${index}">${card.sortOrder}</button>`).join("");

  return `<section class="major-arcana-section major-arcana-explore" id="${escapeHtml(page.explore.id)}" aria-labelledby="${escapeHtml(page.explore.id)}-heading" data-major-carousel>
        ${renderSectionHeader(page.explore)}
        <div class="major-arcana-carousel-stage">
          <button class="major-arcana-carousel-control major-arcana-carousel-control--previous" type="button" aria-label="Select previous Major Arcana card" data-major-previous disabled><span aria-hidden="true">‹</span></button>
          <div class="major-arcana-carousel" tabindex="0" aria-label="Major Arcana card carousel" data-major-carousel-viewport>
            <div class="major-arcana-carousel__track" data-major-carousel-track>${slides}</div>
          </div>
          <button class="major-arcana-carousel-control major-arcana-carousel-control--next" type="button" aria-label="Select next Major Arcana card" data-major-next><span aria-hidden="true">›</span></button>
        </div>
        <div class="major-arcana-number-nav" role="toolbar" aria-label="Select a Major Arcana card by number" data-major-number-nav>${numbers}</div>
        <p class="major-arcana-visually-hidden" aria-live="polite" aria-atomic="true" data-major-carousel-status>Card 0, 1 of 22 selected: The Fool</p>
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
          <div class="major-arcana-foundations__cards" role="list" aria-label="Major Arcana foundations">
            ${section.concepts.map((concept, index) => `<article class="major-arcana-foundations__card major-arcana-foundations__card--${index + 1}" role="listitem">
              <a class="major-arcana-foundations__card-link" href="${escapeHtml(concept.route)}">
                <span class="major-arcana-foundations__number" aria-hidden="true">${escapeHtml(concept.number)}</span>
                <figure class="major-arcana-foundations__figure">
                  ${renderThemeImage(concept.image, "major-arcana-foundations__image")}
                </figure>
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

function renderJourney(page, cards) {
  const section = page.journey;
  const getChapterCards = (chapter) => chapter.cardSortOrders.map((sortOrder) => cards.find((card) => card.sortOrder === sortOrder));
  const tabs = section.chapters.map((chapter, index) => `<button class="major-arcana-journey__tab${index === 0 ? " is-active" : ""}" id="major-journey-tab-${index}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="major-journey-panel-${index}" tabindex="${index === 0 ? "0" : "-1"}" data-major-journey-tab="${index}">
            <span class="major-arcana-journey__medallion" aria-hidden="true">${escapeHtml(chapter.number)}</span>
            <strong>${escapeHtml(chapter.title)}</strong>
            <small>Cards ${escapeHtml(chapter.range)}</small>
            <span class="major-arcana-journey__cue">Explore <span aria-hidden="true">↓</span></span>
          </button>`).join("");
  const panels = section.chapters.map((chapter, index) => {
    const chapterCards = getChapterCards(chapter);
    return `<article class="major-arcana-journey__panel${index === 0 ? " is-active" : ""}" id="major-journey-panel-${index}" role="tabpanel" aria-labelledby="major-journey-tab-${index}" aria-hidden="${index === 0 ? "false" : "true"}" data-major-journey-panel="${index}">
            <p class="major-arcana-journey__range">Chapter ${escapeHtml(chapter.number)} · Cards ${escapeHtml(chapter.range)}</p>
            <h3>${escapeHtml(chapter.title)}</h3>
            <div class="major-arcana-journey__preview-copy">${chapter.preview.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
            <div class="major-arcana-journey__preview-meta">
              <div>
                <p class="major-arcana-journey__meta-label">Themes</p>
                <ul class="major-arcana-journey__themes">${chapter.themes.map((theme) => `<li>${escapeHtml(theme)}</li>`).join("")}</ul>
              </div>
              <div>
                <p class="major-arcana-journey__meta-label">Cards in this chapter</p>
                <ol class="major-arcana-journey__card-path">${chapterCards.map((card) => `<li><span>${escapeHtml(card.displayNumber)}</span> ${escapeHtml(card.title)}</li>`).join("")}</ol>
              </div>
            </div>
            <button class="major-arcana-journey__explore" type="button" aria-haspopup="dialog" aria-controls="major-chapter-codex" data-major-chapter-open="${index}">Explore Chapter ${escapeHtml(chapter.number)} <span aria-hidden="true">→</span></button>
          </article>`;
  }).join("");
  const codexPanels = section.chapters.map((chapter, index) => {
    const chapterCards = getChapterCards(chapter);
    const previousIndex = index - 1;
    const nextIndex = index + 1;
    return `<article class="major-chapter-codex__chapter${index === 0 ? " is-active" : ""}" tabindex="-1" aria-hidden="${index === 0 ? "false" : "true"}" data-major-chapter-codex-panel="${index}">
              <header class="major-chapter-codex__header">
                <div>
                  <p class="major-chapter-codex__eyebrow">Chapter ${escapeHtml(chapter.number)} · ${escapeHtml(chapter.range)}</p>
                  <h2 id="major-chapter-codex-title-${index}">${escapeHtml(chapter.title)}</h2>
                  <p id="major-chapter-codex-range-${index}">${escapeHtml(chapter.cards)}</p>
                </div>
                <button class="major-chapter-codex__close" type="button" aria-label="Close Chapter Codex" data-major-chapter-close>Close <span aria-hidden="true">×</span></button>
              </header>
              <div class="major-chapter-codex__body">
                <div class="major-chapter-codex__narrative">
                  <section aria-labelledby="major-chapter-story-${index}">
                    <h3 id="major-chapter-story-${index}">The Chapter Story</h3>
                    <p class="major-chapter-codex__summary">${escapeHtml(chapter.copy)}</p>
                    ${chapter.story.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                  </section>
                  <aside class="major-chapter-codex__lesson" aria-labelledby="major-chapter-lesson-${index}">
                    <h3 id="major-chapter-lesson-${index}">The Central Lesson</h3>
                    <p>${escapeHtml(chapter.centralLesson)}</p>
                  </aside>
                  <section aria-labelledby="major-chapter-reading-${index}">
                    <h3 id="major-chapter-reading-${index}">In a Reading</h3>
                    <p>${escapeHtml(chapter.inReading)}</p>
                  </section>
                </div>
                <section class="major-chapter-codex__cards" aria-labelledby="major-chapter-cards-${index}">
                  <h3 id="major-chapter-cards-${index}">Cards of This Chapter</h3>
                  <ol>${chapterCards.map((card, cardIndex) => `<li>
                    <a href="${escapeHtml(card.route)}">
                      <span class="major-chapter-codex__card-number">${escapeHtml(card.displayNumber)}</span>
                      <span><strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(chapter.cardRoles[cardIndex])}</small></span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>`).join("")}</ol>
                </section>
              </div>
              <footer class="major-chapter-codex__navigation" aria-label="Chapter Codex navigation">
                <button type="button" data-major-chapter-nav="${previousIndex}"${previousIndex < 0 ? " disabled" : ""}><span aria-hidden="true">←</span> Previous Chapter</button>
                <p>${index + 1} of ${section.chapters.length}</p>
                <button type="button" data-major-chapter-nav="${nextIndex}"${nextIndex >= section.chapters.length ? " disabled" : ""}>Next Chapter <span aria-hidden="true">→</span></button>
              </footer>
            </article>`;
  }).join("");
  return `<section class="major-arcana-section major-arcana-journey" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-major-journey>
        ${renderSectionHeader(section)}
        <p class="major-arcana-journey__clarification">${escapeHtml(section.clarification)}</p>
        <p class="major-arcana-journey__hint"><span aria-hidden="true">✦</span> Select a chapter to explore the journey</p>
        <div class="major-arcana-journey__tabs" role="tablist" aria-label="Fool’s Journey chapters">${tabs}</div>
        <div class="major-arcana-journey__panels">${panels}</div>
        <dialog class="major-chapter-codex" id="major-chapter-codex" aria-labelledby="major-chapter-codex-title-0" aria-describedby="major-chapter-codex-range-0" data-major-chapter-dialog>
          <div class="major-chapter-codex__frame">${codexPanels}</div>
        </dialog>
      </section>`;
}

function renderOrientation(page, cards) {
  const section = page.orientation;
  const card = cards.find((item) => item.sortOrder === section.exampleCardSortOrder);
  const renderState = (state, key, active) => `<article class="major-arcana-orientation__state major-arcana-orientation__state--${key}${active ? " is-active" : ""}" id="major-orientation-${key}" aria-hidden="false" data-major-orientation-panel="${key}">
          <span class="major-arcana-orientation__emblem" aria-hidden="true">${escapeHtml(state.emblem)}</span>
          <header class="major-arcana-orientation__state-header">
            <p class="major-arcana-orientation__label">${escapeHtml(state.label)}</p>
            <h3>${escapeHtml(state.subtitle)}</h3>
          </header>
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
            <span class="major-arcana-orientation__card-frame">
              ${renderThemeCardImage(card, "major-arcana-orientation__card-image")}
            </span>
            <figcaption class="major-arcana-orientation__caption" aria-live="polite">${escapeHtml(card.title)} shown <span data-major-orientation-caption>upright</span></figcaption>
            <span class="major-arcana-orientation__guide-status">Tarot Reversals Guide · Coming Soon</span>
          </figure>
          ${renderState(section.reversed, "reversed", false)}
        </div>
      </section>`;
}

function renderReadings(page, cards) {
  const section = page.readings;
  const exampleCard = cards.find((item) => item.sortOrder === section.example.majorCardSortOrder);
  const spreadCards = [
    `<img src="${escapeHtml(section.example.cardBack.src)}" alt="A face-down tarot card representing the past position" width="${section.example.cardBack.width}" height="${section.example.cardBack.height}" loading="lazy" decoding="async" />`,
    renderThemeCardImage(exampleCard, "major-arcana-reading__major-image"),
    `<img src="${escapeHtml(section.example.cardBack.src)}" alt="A face-down tarot card representing the future position" width="${section.example.cardBack.width}" height="${section.example.cardBack.height}" loading="lazy" decoding="async" />`
  ];
  return `<section class="major-arcana-readings" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="major-arcana-section major-arcana-readings__inner">
          ${renderSectionHeader(section)}
          <div class="major-arcana-readings__concepts">${section.concepts.map((concept) => `<article>
            <p>${escapeHtml(concept.number)}</p>
            <h3>${escapeHtml(concept.title)}</h3>
            <p>${escapeHtml(concept.copy)}</p>
          </article>`).join("")}</div>
          <div class="major-arcana-reading-example">
            <div class="major-arcana-reading-example__spread" aria-label="Past, present, and future illustrative tarot spread">${spreadCards.map((image, index) => `<figure class="${index === 1 ? "is-major" : ""}">${image}<figcaption>${escapeHtml(section.example.positions[index])}</figcaption></figure>`).join("")}</div>
            <div class="major-arcana-reading-example__copy">
              <p class="major-arcana-eyebrow">Past · Present · Future</p>
              <h3>A Major Arcana Card Sets the Central Lesson</h3>
              <p>${escapeHtml(section.example.copy)}</p>
              <p class="major-arcana-reading-example__note">${escapeHtml(section.example.note)}</p>
              <span class="major-arcana-route-status">Tarot Spreads · Coming Soon</span>
            </div>
          </div>
        </div>
      </section>`;
}

function renderComparison(page, tarotCards) {
  const section = page.comparison;
  const resolveCards = (group) => group.cardTitles.map((title) => {
    const card = tarotCards.find((candidate) => candidate.title === title);
    return {
      title: card.title,
      route: getCardRoute(card),
      image: card.variants.veilrise.image,
      imageAlt: `${card.title} card from the Veilrise Arcana tarot deck`,
      bloodMoonImage: card.variants.veilfall.image,
      bloodMoonImageAlt: `${card.title} card from the Veilfall Arcana tarot deck`,
      imageWidth: 1024,
      imageHeight: 1536
    };
  });
  const initialPositions = ["0", "1", "2", "-1"];
  const renderShowcase = (group) => {
    const showcaseCards = resolveCards(group);
    return `<div class="major-minor-showcase__showcase" aria-label="${escapeHtml(group.title)} card showcase" data-major-minor-showcase="${escapeHtml(group.key)}">
            <div class="major-minor-showcase__track" data-major-minor-track>
              ${showcaseCards.map((card, index) => `<figure class="major-minor-showcase__card${index === 0 ? " is-active" : ""}" data-major-minor-card="${index}" data-position="${initialPositions[index]}">
                ${renderThemeCardImage(card, "major-minor-showcase__card-image", { sizes: "(max-width: 768px) 64vw, (max-width: 1100px) 28vw, 285px" })}
                <figcaption>${escapeHtml(card.title)}</figcaption>
              </figure>`).join("")}
            </div>
            <div class="major-minor-showcase__navigation">
              <button class="major-minor-showcase__arrow major-minor-showcase__arrow--previous" type="button" aria-label="Show previous ${escapeHtml(group.title)} example" data-major-minor-previous><span aria-hidden="true">‹</span></button>
              <div class="major-minor-showcase__dots" role="group" aria-label="Choose a ${escapeHtml(group.title)} example">
                ${showcaseCards.map((card, index) => `<button type="button" aria-label="Show ${escapeHtml(card.title)}" aria-current="${index === 0 ? "true" : "false"}" data-major-minor-dot="${index}"><span></span></button>`).join("")}
              </div>
              <button class="major-minor-showcase__arrow major-minor-showcase__arrow--next" type="button" aria-label="Show next ${escapeHtml(group.title)} example" data-major-minor-next><span aria-hidden="true">›</span></button>
            </div>
            <p class="major-arcana-visually-hidden" aria-live="polite" aria-atomic="true" data-major-minor-card-status></p>
          </div>`;
  };
  const renderPanel = (group, active) => `<article class="major-minor-showcase__panel${active ? " is-active" : ""}" id="major-minor-${escapeHtml(group.key)}-panel" role="tabpanel" aria-labelledby="major-minor-${escapeHtml(group.key)}-tab" aria-hidden="${active ? "false" : "true"}"${active ? "" : " inert"} data-major-minor-panel="${escapeHtml(group.key)}">
          <div class="major-minor-showcase__information">
            <p class="major-minor-showcase__panel-eyebrow">${escapeHtml(group.eyebrow)}</p>
            <h3>${escapeHtml(group.title)}</h3>
            <p class="major-minor-showcase__number"><strong>${escapeHtml(group.number)}</strong><span>${escapeHtml(group.numberLabel)}</span></p>
            <p class="major-minor-showcase__descriptor">${escapeHtml(group.supportingLabel)}</p>
            <p class="major-minor-showcase__copy">${escapeHtml(group.copy)}</p>
            <ul>${group.items.slice(1).map((item) => `<li><span aria-hidden="true">✦</span>${escapeHtml(item)}</li>`).join("")}</ul>
            ${group.route ? `<a class="major-minor-showcase__route" href="${escapeHtml(group.route)}">${escapeHtml(group.routeLabel)} <span aria-hidden="true">→</span></a>` : `<p class="major-minor-showcase__panel-status">${escapeHtml(section.minorStatus)}</p>`}
          </div>
          ${renderShowcase(group)}
        </article>`;
  return `<section class="major-arcana-section major-minor-showcase" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading" data-major-minor-showcase-root data-mode="major">
        ${renderSectionHeader(section)}
        <p class="major-minor-showcase__identity"><strong>${escapeHtml(section.balance.number)} ${escapeHtml(section.balance.numberLabel)}</strong><span aria-hidden="true">✦</span>${escapeHtml(section.balance.label)}</p>
        <div class="major-minor-showcase__toggle" role="tablist" aria-label="Compare Major and Minor Arcana">
          <span class="major-minor-showcase__toggle-indicator" aria-hidden="true"></span>
          <button class="is-active" id="major-minor-major-tab" type="button" role="tab" aria-selected="true" aria-controls="major-minor-major-panel" tabindex="0" data-major-minor-tab="major">Major Arcana</button>
          <button id="major-minor-minor-tab" type="button" role="tab" aria-selected="false" aria-controls="major-minor-minor-panel" tabindex="-1" data-major-minor-tab="minor">Minor Arcana</button>
        </div>
        <div class="major-minor-showcase__viewport">
          ${renderPanel(section.major, true)}
          ${renderPanel(section.minor, false)}
        </div>
        <footer class="major-minor-showcase__footer">
          <p class="major-minor-showcase__supporting">${escapeHtml(section.supporting)}</p>
          <a class="major-minor-showcase__status" href="${escapeHtml(section.minor.route)}"><span aria-hidden="true">✦</span>${escapeHtml(section.minorStatus)}</a>
        </footer>
      </section>`;
}

function renderFaq(page) {
  return renderTarotEducationFaq({ section: page.faq, items: page.faq.items, idPrefix: "major-faq" });
}

function renderClosing(page) {
  const section = page.closingCta;
  return `<section class="major-arcana-closing" aria-labelledby="major-arcana-closing-heading">
        ${renderImage(section.image, { className: "major-arcana-closing__image", decorative: true })}
        <div class="major-arcana-closing__overlay"></div>
        <div class="major-arcana-closing__copy">
          <p class="major-arcana-eyebrow">The Journey Continues</p>
          <h2 id="major-arcana-closing-heading">${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.copy)}</p>
          <nav class="major-arcana-closing__actions" aria-label="Continue exploring the Major Arcana">
            ${section.actions.map((action, index) => `<a class="major-arcana-closing__action${index === 0 ? " major-arcana-closing__action--primary" : ""}" href="${escapeHtml(action.route)}">${escapeHtml(action.label)} <span aria-hidden="true">→</span></a>`).join("")}
          </nav>
          ${section.minorStatus ? `<p class="major-arcana-closing__status">${escapeHtml(section.minorStatus)}</p>` : ""}
        </div>
      </section>`;
}

function renderMain(page, cards, tarotCards) {
  return `<main id="main-content" class="major-arcana-page tarot-education-page">
      ${renderTarotEducationNavigation({ activeKey: "major-arcana", rootDir })}
      ${renderHero(page)}
      <div class="major-arcana-archive">
        ${renderExplore(page, cards)}
        ${renderOverview(page)}
        ${renderJourney(page, cards)}
        ${renderOrientation(page, cards)}
      </div>
      ${renderReadings(page, cards)}
      <div class="major-arcana-archive major-arcana-archive--lower">
        ${renderComparison(page, tarotCards)}
        ${renderFaq(page)}
      </div>
      ${renderClosing(page)}
    </main>`;
}

function updateSitemap(page) {
  const canonical = `${SITE_ORIGIN}${getMajorArcanaRoute(page)}`;
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
  let sitemap = readFileSync(sitemapPath, "utf8")
    .replace(currentBlock, "")
    .replace(routeBlock, "");
  const historyMarker = "<!-- GENERATED:TAROT_HISTORY_PAGE:START -->";
  sitemap = sitemap.includes(historyMarker)
    ? sitemap.replace(historyMarker, `${block}\n  ${historyMarker}`)
    : sitemap.replace(/\s*<\/urlset>\s*$/, `\n  ${block}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

function generateMajorArcanaPage(page) {
  const errors = validateMajorArcanaData(page, tarotCardDetails, { rootDir });
  if (errors.length) throw new Error(`Major Arcana data validation failed:\n- ${errors.join("\n- ")}`);
  const cards = buildMajorArcanaCards(page, tarotCardDetails);
  const template = readFileSync(templatePath, "utf8");
  const html = template
    .replace("{{MAJOR_ARCANA_META}}", renderMeta(page))
    .replace("{{MAJOR_ARCANA_MAIN}}", renderMain(page, cards, tarotCardDetails));
  if (html.includes("{{MAJOR_ARCANA_")) throw new Error("Major Arcana template contains unreplaced placeholders");
  const outputPath = getMajorArcanaOutputPath(rootDir, page);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
  updateSitemap(page);
  return outputPath;
}

const outputPath = generateMajorArcanaPage(majorArcanaPage);
console.log(`Generated ${getMajorArcanaRoute(majorArcanaPage)} -> ${outputPath}`);
console.log("Updated sitemap.xml with the Major Arcana route");
