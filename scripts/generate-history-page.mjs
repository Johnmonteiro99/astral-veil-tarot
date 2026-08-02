import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotHistory } from "../data/tarot-history.mjs";
import { getTarotEducationHeroImages } from "../data/tarot-education-hero-images.js";
import { escapeHtml, serializeForInlineScript, SITE_ORIGIN } from "./card-page-helpers.mjs";
import {
  getHistoryOutputPath,
  getHistoryRoute,
  validateHistoryData
} from "./history-page-helpers.mjs";
import { renderTarotEducationFaq, renderTarotEducationHeroImage, renderTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(rootDir, "templates/tarot-history-page.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const generatedMarkerStart = "<!-- GENERATED:TAROT_HISTORY_PAGE:START -->";
const generatedMarkerEnd = "<!-- GENERATED:TAROT_HISTORY_PAGE:END -->";

function renderSchemas(history) {
  const canonicalUrl = `${SITE_ORIGIN}${getHistoryRoute(history)}`;
  return {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Tarot", item: `${SITE_ORIGIN}/tarot` },
        { "@type": "ListItem", position: 3, name: history.breadcrumbLabel, item: canonicalUrl }
      ]
    },
    webPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: history.hero.title,
      description: history.seo.description,
      url: canonicalUrl,
      image: `${SITE_ORIGIN}${history.hero.image.src}`,
      dateModified: history.seo.lastModified,
      isPartOf: {
        "@type": "WebSite",
        name: "Astral Veil",
        url: `${SITE_ORIGIN}/`
      },
      about: [
        { "@type": "Thing", name: "History of Tarot" },
        { "@type": "Thing", name: "Tarot cards" },
        { "@type": "Thing", name: "European playing-card history" }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: history.faq.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer
        }
      }))
    }
  };
}

function renderMeta(history) {
  const canonicalUrl = `${SITE_ORIGIN}${getHistoryRoute(history)}`;
  const imageUrl = `${SITE_ORIGIN}${history.hero.image.src}`;
  const schemas = renderSchemas(history);
  const educationHero = getTarotEducationHeroImages("tarot-history");
  return [
    `<title>${escapeHtml(history.seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(history.seo.description)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(history.seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(history.seo.ogDescription)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(history.hero.image.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(history.seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(history.seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(history.hero.image.alt)}" />`,
    `<link rel="preload" as="image" href="${escapeHtml(educationHero.regular.src)}" fetchpriority="high" />`,
    `<script id="tarot-history-breadcrumb-schema" type="application/ld+json">${serializeForInlineScript(schemas.breadcrumb)}</script>`,
    `<script id="tarot-history-webpage-schema" type="application/ld+json">${serializeForInlineScript(schemas.webPage)}</script>`,
    `<script id="tarot-history-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`
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

function renderFigure(image, {
  className = "",
  imageClassName = "",
  loading = "lazy",
  fetchpriority = "",
  decorative = false,
  showCaption = true
} = {}) {
  const classAttribute = className ? ` class="${className}"` : "";
  const caption = showCaption && image.caption
    ? `<figcaption>${escapeHtml(image.caption)}</figcaption>`
    : "";
  return `<figure${classAttribute}>${renderImage(image, {
    className: imageClassName,
    loading,
    fetchpriority,
    decorative
  })}${caption}</figure>`;
}

function renderChapterHeader(section, { eyebrow = "" } = {}) {
  return `<header class="tarot-history-chapter">
          <p class="tarot-history-chapter__number" aria-hidden="true">${escapeHtml(section.number)}</p>
          <div>
            ${eyebrow ? `<p class="tarot-history-eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
            <h2 id="${escapeHtml(section.id)}-heading">${escapeHtml(section.heading)}</h2>
          </div>
        </header>`;
}

function renderExternalLink(source) {
  const accessible = `${source.label} — external source from ${source.organization}`;
  return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(accessible)}">${escapeHtml(source.label)} <span aria-hidden="true">↗</span></a>`;
}

function renderRailControls({ railId, label, count }) {
  return `<div class="tarot-history-rail-controls" data-history-rail-controls="${escapeHtml(railId)}">
          <p aria-live="polite" aria-atomic="true"><span data-history-rail-current>1</span> of ${count}</p>
          <div>
            <button type="button" aria-label="Previous ${escapeHtml(label)}" data-history-rail-previous disabled><span aria-hidden="true">←</span><span>Previous</span></button>
            <button type="button" aria-label="Next ${escapeHtml(label)}" data-history-rail-next><span>Next</span><span aria-hidden="true">→</span></button>
          </div>
        </div>`;
}

function renderOrigins(history) {
  const section = history.origins;
  const facts = section.facts.map((fact, index) => `<li>
              <span class="tarot-history-facts__mark" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
              <p><strong>${escapeHtml(fact.label)}</strong><span>${escapeHtml(fact.text)}</span></p>
            </li>`).join("");
  return `<section class="tarot-history-section tarot-history-origins" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        ${renderChapterHeader(section, { eyebrow: section.eyebrow })}
        <div class="tarot-history-origins__mosaic">
          ${renderFigure(section.image, {
            className: "tarot-history-media tarot-history-origins__primary-media",
            imageClassName: "tarot-history-media__image"
          })}
          <div class="tarot-history-prose tarot-history-origins__copy">
            ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            <p class="tarot-history-origins__pull">${escapeHtml(section.pullQuote)}</p>
            <nav class="tarot-history-source-links" aria-label="Sources for Tarot origins">
              ${section.sources.map(renderExternalLink).join("")}
            </nav>
          </div>
          <aside class="tarot-history-facts" aria-labelledby="early-tarot-facts-heading">
            ${renderFigure(section.factsImage, {
              className: "tarot-history-facts__media",
              imageClassName: "tarot-history-media__image",
              showCaption: false
            })}
            <div class="tarot-history-facts__body">
              <h3 id="early-tarot-facts-heading">${escapeHtml(section.factsHeading)}</h3>
              <ul>${facts}</ul>
            </div>
          </aside>
        </div>
      </section>`;
}

function renderTimeline(history) {
  const section = history.timeline;
  const count = section.milestones.length;
  const shortEra = (era) => era.replace(/Century$/u, "C.");
  const panels = section.milestones.map((item, index) => {
    const panelId = `history-timeline-panel-${item.id}`;
    const tabId = `history-timeline-tab-${item.id}`;
    return `<article class="tarot-history-timeline-panel${index === 0 ? " is-active" : ""}" id="${escapeHtml(panelId)}" role="tabpanel" aria-labelledby="${escapeHtml(tabId)}" aria-hidden="false" data-history-timeline-panel data-history-timeline-index="${index}">
            <div class="tarot-history-timeline-panel__intro">
              <p class="tarot-history-card-era" data-history-timeline-reveal>${escapeHtml(item.era)}</p>
              <p class="tarot-history-timeline-panel__position" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span> / ${String(count).padStart(2, "0")}</p>
              <h3 data-history-timeline-reveal>${escapeHtml(item.title)}</h3>
            </div>
            <figure class="tarot-history-timeline-panel__media">
              <div class="tarot-history-timeline-panel__media-frame">
                ${renderImage(item.image, { className: "tarot-history-media__image" })}
              </div>
            </figure>
            <div class="tarot-history-timeline-panel__body">
              <p class="tarot-history-timeline-panel__summary" data-history-timeline-reveal>${escapeHtml(item.copy)}</p>
              <div class="tarot-history-timeline-panel__details">
                <div class="tarot-history-timeline-panel__detail tarot-history-timeline-panel__detail--why" data-history-timeline-reveal>
                  <h4>Why This Era Matters</h4>
                  <p>${escapeHtml(item.whyItMatters)}</p>
                </div>
                <div class="tarot-history-timeline-panel__detail tarot-history-timeline-panel__detail--archive" data-history-timeline-reveal>
                  <h4>From the Archive</h4>
                  <p>${escapeHtml(item.archiveDetail)}</p>
                </div>
                <div class="tarot-history-timeline-panel__detail tarot-history-timeline-panel__detail--link" data-history-timeline-reveal>
                  <h4>Related Link</h4>
                  <a href="${escapeHtml(item.relatedLink.route)}">${escapeHtml(item.relatedLink.label)} <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </article>`;
  }).join("");
  const tabs = section.milestones.map((item, index) => {
    const panelId = `history-timeline-panel-${item.id}`;
    const tabId = `history-timeline-tab-${item.id}`;
    return `<button class="tarot-history-timeline-tab${index === 0 ? " is-active" : ""}" id="${escapeHtml(tabId)}" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}"${index === 0 ? ' aria-current="step"' : ""} aria-controls="${escapeHtml(panelId)}" aria-label="${escapeHtml(`View ${item.era} Tarot history: ${item.title}`)}" tabindex="${index === 0 ? "0" : "-1"}" data-history-timeline-tab data-history-timeline-index="${index}">
              <span class="tarot-history-timeline-tab__marker" aria-hidden="true"></span>
              <span class="tarot-history-timeline-tab__label">${escapeHtml(shortEra(item.era))}</span>
            </button>`;
  }).join("");
  return `<section class="tarot-history-section tarot-history-timeline" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-history-section-heading">
          ${renderChapterHeader(section)}
          <p>${escapeHtml(section.introduction)}</p>
        </div>
        <div class="tarot-history-timeline-stage" aria-label="Tarot Through the Ages interactive timeline" data-history-timeline-stage>
          <div class="tarot-history-timeline-panels" id="history-timeline-panels" data-history-timeline-panels>
            ${panels}
          </div>
          <div class="tarot-history-timeline-controls" aria-label="Timeline navigation" data-history-timeline-controls>
            <button type="button" aria-label="Previous Tarot era" data-history-timeline-previous disabled><span aria-hidden="true">←</span><span>Previous</span></button>
            <p aria-live="polite" aria-atomic="true"><span data-history-timeline-current>1</span> of ${count}<span class="tarot-history-visually-hidden" data-history-timeline-status> — ${escapeHtml(section.milestones[0].era)}: ${escapeHtml(section.milestones[0].title)}</span></p>
            <button type="button" aria-label="Next Tarot era" data-history-timeline-next><span>Next</span><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div class="tarot-history-timeline-track" data-history-timeline-track>
          <span class="tarot-history-timeline-track__line" aria-hidden="true"><span data-history-timeline-progress></span></span>
          <div class="tarot-history-timeline-tabs" role="tablist" aria-label="Choose a period in Tarot history">
            ${tabs}
          </div>
        </div>
      </section>`;
}

function renderTraditions(history) {
  const section = history.traditions;
  const panels = section.items.map((item, index) => {
    const tabId = `history-tradition-tab-${item.id}`;
    const panelId = `history-tradition-panel-${item.id}`;
    return `<article class="deck-tradition-slide tarot-history-tradition${index === 0 ? " is-active" : ""}" id="${panelId}" role="tabpanel" aria-labelledby="${tabId}" aria-hidden="false" data-history-tradition-panel data-history-tradition-index="${index}">
              <figure class="tarot-history-tradition__media">
                <span class="tarot-history-tradition__media-frame">
                  ${renderImage(item.image, {
                    className: "tarot-history-media__image",
                    loading: index === 0 ? "eager" : "lazy"
                  })}
                </span>
              </figure>
              <div class="tarot-history-tradition__copy">
                <p class="tarot-history-tradition__position" data-history-tradition-reveal><span>${index + 1}</span> of ${section.items.length}</p>
                <p class="tarot-history-card-era" data-history-tradition-reveal>${escapeHtml(item.era)}</p>
                <h3 data-history-tradition-reveal>${escapeHtml(item.title)}</h3>
                <p class="tarot-history-tradition__overview" data-history-tradition-reveal>${escapeHtml(item.copy)}</p>
                <div class="tarot-history-tradition__details">
                  <div class="tarot-history-tradition__detail tarot-history-tradition__detail--visual" data-history-tradition-reveal>
                    <h4>Visual Signature</h4>
                    <p>${escapeHtml(item.visualSignature)}</p>
                  </div>
                  <div class="tarot-history-tradition__detail tarot-history-tradition__detail--influence" data-history-tradition-reveal>
                    <h4>Historical Influence</h4>
                    <p>${escapeHtml(item.historicalInfluence)}</p>
                  </div>
                  <a class="tarot-history-tradition__link" href="${escapeHtml(item.relatedLink.route)}" data-history-tradition-reveal>${escapeHtml(item.relatedLink.label)} <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </article>`;
  }).join("");
  const selector = section.items.map((item, index) => {
    const tabId = `history-tradition-tab-${item.id}`;
    const panelId = `history-tradition-panel-${item.id}`;
    return `<button type="button" id="${tabId}" role="tab" aria-selected="${index === 0 ? "true" : "false"}"${index === 0 ? ' aria-current="true"' : ""} aria-controls="${panelId}" aria-label="${escapeHtml(`View ${item.title}`)}" tabindex="${index === 0 ? "0" : "-1"}" data-history-tradition-tab data-history-tradition-index="${index}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(item.title)}</strong>
            </button>`;
  }).join("");
  return `<section class="tarot-history-section tarot-history-traditions" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-history-section-heading">
          ${renderChapterHeader(section, { eyebrow: "The Visual Lineage" })}
          <p>${escapeHtml(section.introduction)}</p>
        </div>
        <div class="tarot-history-traditions__archive" data-history-traditions-archive>
          <div class="deck-tradition-exhibit tarot-history-traditions__exhibit" data-history-tradition-exhibit>
            <div class="deck-tradition-viewport tarot-history-traditions__viewport" role="region" aria-label="Influential Tarot deck traditions" data-history-traditions-viewport>
              <div class="tarot-history-traditions__panels" data-history-traditions-panels>
                ${panels}
              </div>
            </div>
          </div>
          <div class="tarot-history-traditions__controls" data-history-tradition-controls>
            <p aria-live="polite" aria-atomic="true"><span data-history-tradition-current>1</span> of ${section.items.length}<span class="tarot-history-visually-hidden" data-history-tradition-status> — ${escapeHtml(section.items[0].title)}</span></p>
            <div>
              <button type="button" aria-label="Previous deck tradition" data-history-tradition-previous disabled><span aria-hidden="true">←</span><span>Previous</span></button>
              <button type="button" aria-label="Next deck tradition" data-history-tradition-next><span>Next</span><span aria-hidden="true">→</span></button>
            </div>
          </div>
          <div class="tarot-history-traditions__selector" role="tablist" aria-label="Select a Tarot deck tradition">
            ${selector}
          </div>
        </div>
      </section>`;
}

function renderContributors(history) {
  const section = history.contributors;
  const index = section.items.map((item, itemIndex) => {
    const tabId = `history-contributor-tab-${item.id}`;
    const panelId = `history-contributor-panel-${item.id}`;
    return `<button class="tarot-history-contributors__index-item" type="button" id="${tabId}" role="tab" aria-selected="${itemIndex === 0 ? "true" : "false"}" aria-controls="${panelId}" tabindex="${itemIndex === 0 ? "0" : "-1"}" data-history-contributor-index>
              <span class="tarot-history-contributors__index-number" aria-hidden="true">${String(itemIndex + 1).padStart(2, "0")}</span>
              <span class="tarot-history-contributors__index-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.dates)}</small></span>
              <span class="tarot-history-contributors__index-marker" aria-hidden="true"></span>
            </button>`;
  }).join("");
  const panels = section.items.map((item) => {
    const tabId = `history-contributor-tab-${item.id}`;
    const panelId = `history-contributor-panel-${item.id}`;
    const overviewTabId = `history-contributor-${item.id}-overview-tab`;
    const influenceTabId = `history-contributor-${item.id}-influence-tab`;
    const overviewPanelId = `history-contributor-${item.id}-overview-panel`;
    const influencePanelId = `history-contributor-${item.id}-influence-panel`;
    return `<article class="tarot-history-contributor-panel" id="${panelId}" role="tabpanel" aria-labelledby="${tabId}" aria-hidden="false" data-history-contributor-panel>
              <div class="tarot-history-contributor-panel__copy">
                <p class="tarot-history-eyebrow" data-history-contributor-reveal>Contributor to Tarot’s Evolution</p>
                <p class="tarot-history-contributor-panel__dates" data-history-contributor-reveal>${escapeHtml(item.dates)}</p>
                <h3 class="tarot-history-contributor-panel__name" data-history-contributor-reveal>${escapeHtml(item.name)}</h3>
                <p class="tarot-history-contributor-panel__role" data-history-contributor-reveal>${escapeHtml(item.role)}</p>
                <div class="tarot-history-contributor-panel__view-tabs" role="tablist" aria-label="Explore ${escapeHtml(item.name)}" data-history-contributor-reveal>
                  <button type="button" id="${overviewTabId}" role="tab" aria-selected="true" aria-controls="${overviewPanelId}" tabindex="0" data-history-contributor-view-tab>Overview</button>
                  <button type="button" id="${influenceTabId}" role="tab" aria-selected="false" aria-controls="${influencePanelId}" tabindex="-1" data-history-contributor-view-tab>Why It Matters</button>
                </div>
                <div class="tarot-history-contributor-panel__views" data-history-contributor-reveal>
                  <div class="tarot-history-contributor-panel__view is-active" id="${overviewPanelId}" role="tabpanel" aria-labelledby="${overviewTabId}" data-history-contributor-view>
                    <p class="tarot-history-contributor-panel__summary">${escapeHtml(item.copy)}</p>
                  </div>
                  <div class="tarot-history-contributor-panel__view" id="${influencePanelId}" role="tabpanel" aria-labelledby="${influenceTabId}" data-history-contributor-view hidden>
                    <p class="tarot-history-contributor-panel__view-label">Historical influence</p>
                    <p class="tarot-history-contributor-panel__summary">${escapeHtml(item.whyItMatters)}</p>
                  </div>
                </div>
                <button class="tarot-history-contributor__open" type="button" data-history-contributor-open="${escapeHtml(item.id)}" aria-haspopup="dialog">Read historical context <span aria-hidden="true">↗</span></button>
              </div>
            </article>`;
  }).join("");
  return `<section class="tarot-history-section tarot-history-contributors" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-history-section-heading">
          ${renderChapterHeader(section, { eyebrow: "The People Behind the Symbols" })}
          <p>${escapeHtml(section.introduction)}</p>
        </div>
        <div class="tarot-history-contributors__archive" data-history-contributors-archive>
          <nav class="tarot-history-contributors__index" aria-label="Contributors to Tarot’s evolution">
            <div role="tablist" aria-orientation="vertical">${index}</div>
          </nav>
          <div class="tarot-history-contributors__panels">${panels}</div>
        </div>
      </section>`;
}

function renderContributorDialog(history) {
  const contributors = Object.fromEntries(history.contributors.items.map((item) => [item.id, {
    name: item.name,
    dates: item.dates,
    detail: item.detail,
    whyItMatters: item.whyItMatters,
    clarification: item.clarification || ""
  }]));
  return `<div class="tarot-history-dialog" data-history-contributor-dialog hidden>
      <div class="tarot-history-dialog__backdrop" data-history-contributor-close></div>
      <section class="tarot-history-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="tarot-history-dialog-title" aria-describedby="tarot-history-dialog-detail" tabindex="-1">
        <button class="tarot-history-dialog__close" type="button" aria-label="Close contributor details" data-history-contributor-close><span aria-hidden="true">×</span></button>
        <p class="tarot-history-eyebrow">Ideas and People</p>
        <p class="tarot-history-dialog__dates" data-history-contributor-dates></p>
        <h2 id="tarot-history-dialog-title" data-history-contributor-title></h2>
        <p id="tarot-history-dialog-detail" class="tarot-history-dialog__detail" data-history-contributor-detail></p>
        <div class="tarot-history-dialog__context">
          <h3>Why this matters</h3>
          <p data-history-contributor-why></p>
        </div>
        <p class="tarot-history-dialog__clarification" data-history-contributor-clarification></p>
      </section>
    </div>
    <script id="tarot-history-contributor-data" type="application/json">${serializeForInlineScript(contributors)}</script>`;
}

function renderOccultRevival(history) {
  const section = history.occultRevival;
  return `<section class="tarot-history-section tarot-history-feature tarot-history-occult" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-history-feature__copy">
          ${renderChapterHeader(section)}
          <div class="tarot-history-prose">${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
          <p class="tarot-history-clarification"><strong>Historical clarification</strong>${escapeHtml(section.clarification)}</p>
        </div>
        ${renderFigure(section.image, {
          className: "tarot-history-media tarot-history-feature__media",
          imageClassName: "tarot-history-media__image",
          showCaption: false
        })}
        <ul class="tarot-history-symbol-list">${section.categories.map((category) => `<li><span aria-hidden="true">✦</span>${escapeHtml(category)}</li>`).join("")}</ul>
      </section>`;
}

function renderModernIllustrated(history) {
  const section = history.modernIllustratedTarot;
  return `<section class="tarot-history-section tarot-history-feature tarot-history-feature--reverse tarot-history-modern" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        ${renderFigure(section.image, {
          className: "tarot-history-media tarot-history-feature__media",
          imageClassName: "tarot-history-media__image",
          showCaption: false
        })}
        <div class="tarot-history-feature__copy">
          ${renderChapterHeader(section)}
          <div class="tarot-history-prose">${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
          <p class="tarot-history-artist-note">${escapeHtml(section.note)}</p>
          <nav class="tarot-history-card-links" aria-label="Explore illustrated Tarot card meanings">
            ${section.links.map((link) => `<a href="${escapeHtml(link.route)}">${escapeHtml(link.label)} <span aria-hidden="true">→</span></a>`).join("")}
          </nav>
        </div>
      </section>`;
}

function renderTarotToday(history) {
  const section = history.tarotToday;
  return `<section class="tarot-history-section tarot-history-today" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-history-today__copy">
          ${renderChapterHeader(section)}
          <p>${escapeHtml(section.copy)}</p>
          <ul class="tarot-history-practices">
            ${section.practices.map((practice) => `<li><span class="tarot-history-practice-symbol tarot-history-symbol--${escapeHtml(practice.symbol)}" aria-hidden="true"></span>${escapeHtml(practice.label)}</li>`).join("")}
          </ul>
        </div>
        ${renderFigure(section.image, {
          className: "tarot-history-media tarot-history-today__media",
          imageClassName: "tarot-history-media__image",
          showCaption: false
        })}
      </section>`;
}

function renderResources(history) {
  const section = history.resources;
  const items = section.items.map((item) => `<a class="tarot-history-resource" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(item.title)} — external resource from ${escapeHtml(item.organization)}">
            <span class="tarot-history-resource__organization">${escapeHtml(item.organization)}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.type)} <span aria-hidden="true">↗</span></span>
          </a>`).join("");
  const related = history.relatedLinks.map((link) => `<a href="${escapeHtml(link.route)}">${escapeHtml(link.label)} <span aria-hidden="true">→</span></a>`).join("");
  return `<section class="tarot-history-section tarot-history-resources" id="${escapeHtml(section.id)}" aria-labelledby="${escapeHtml(section.id)}-heading">
        <div class="tarot-history-section-heading tarot-history-section-heading--resources">
          ${renderChapterHeader(section)}
          <p>${escapeHtml(section.introduction)}</p>
        </div>
        ${renderFigure(section.image, {
          className: "tarot-history-media tarot-history-resources__media",
          imageClassName: "tarot-history-media__image",
          showCaption: false
        })}
        <div class="tarot-history-resources__shelf">${items}</div>
        <nav class="tarot-history-related" aria-label="Continue learning about Tarot">${related}</nav>
      </section>`;
}

function renderFaq(history) {
  return renderTarotEducationFaq({
    section: history.faqSection,
    items: history.faq,
    idPrefix: "tarot-history-faq",
    className: "tarot-history-faq"
  });
}

function renderClosingCta(history) {
  const section = history.closingCta;
  return `<section class="tarot-history-closing" aria-labelledby="tarot-history-closing-heading">
        ${renderImage(section.image, {
          className: "tarot-history-closing__image"
        })}
        <div class="tarot-history-closing__overlay"></div>
        <div class="tarot-history-closing__copy">
          <p class="tarot-history-eyebrow">The Chronicle Continues</p>
          <h2 id="tarot-history-closing-heading">${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.copy)}</p>
          <nav class="tarot-history-closing__actions" aria-label="Continue your Tarot journey">
            ${section.actions.map((action) => `<a class="tarot-history-closing-card" href="${escapeHtml(action.route)}">
              <span class="tarot-history-closing-card__media">
                ${renderImage(action.image, { className: "tarot-history-closing-card__image" })}
              </span>
              <span class="tarot-history-closing-card__content">
                <span class="tarot-history-closing-card__title">${escapeHtml(action.label)}</span>
                <span class="tarot-history-closing-card__description">${escapeHtml(action.description)}</span>
              </span>
              <span class="tarot-history-closing-card__arrow" aria-hidden="true">→</span>
            </a>`).join("")}
          </nav>
        </div>
      </section>`;
}

function renderMain(history) {
  return `<main id="main-content" class="tarot-history tarot-education-page">
      ${renderTarotEducationNavigation({ activeKey: "history", rootDir })}
      <section class="tarot-education-hero tarot-education-hero--immersive tarot-history-hero" aria-labelledby="tarot-history-title" data-education-page="tarot-history">
        <div class="tarot-education-hero__stage tarot-history-hero__stage">
          <div class="tarot-education-hero__copy tarot-history-hero__copy">
            <p class="tarot-history-eyebrow">${escapeHtml(history.hero.eyebrow)}</p>
            <h1 id="tarot-history-title">${escapeHtml(history.hero.title)}</h1>
          </div>
          <figure class="tarot-education-hero__visual tarot-history-hero__visual">
            ${renderTarotEducationHeroImage({
              pageKey: "tarot-history",
              className: "tarot-education-hero__image tarot-history-hero__image",
              alt: history.hero.image.alt
            })}
          </figure>
          <div class="tarot-education-hero__overlay tarot-history-hero__veil" aria-hidden="true"></div>
        </div>
        <div class="tarot-education-hero__editorial tarot-history-hero__editorial">
          <div class="tarot-history-hero__editorial-inner">
            <p>${escapeHtml(history.hero.introduction)}</p>
            <a class="tarot-history-button" href="${escapeHtml(history.hero.ctaTarget)}">${escapeHtml(history.hero.ctaLabel)} <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>
      <div class="tarot-history-archive">
        <aside class="tarot-history-visual-note" aria-label="Visual reconstruction disclosure">
          <span aria-hidden="true">✦</span>
          <p>${escapeHtml(history.visualNote)}</p>
        </aside>
        ${renderOrigins(history)}
        ${renderTimeline(history)}
        ${renderTraditions(history)}
        ${renderContributors(history)}
        <div class="tarot-history-paired tarot-history-paired--evolution">
          ${renderOccultRevival(history)}
          ${renderModernIllustrated(history)}
        </div>
        <div class="tarot-history-paired tarot-history-paired--lower">
          ${renderTarotToday(history)}
          ${renderResources(history)}
        </div>
      </div>
      ${renderFaq(history)}
      ${renderClosingCta(history)}
      ${renderContributorDialog(history)}
    </main>`;
}

function updateSitemap(history) {
  const route = getHistoryRoute(history);
  const canonical = `${SITE_ORIGIN}${route}`;
  const block = [
    generatedMarkerStart,
    "  <url>",
    `    <loc>${canonical}</loc>`,
    `    <lastmod>${history.seo.lastModified}</lastmod>`,
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
  const comparisonMarker = "<!-- GENERATED:TAROT_COMPARISON_PAGES:START -->";
  sitemap = sitemap.includes(comparisonMarker)
    ? sitemap.replace(comparisonMarker, `${block}\n  ${comparisonMarker}`)
    : sitemap.replace(/\s*<\/urlset>\s*$/, `\n  ${block}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

function generateHistoryPage(history) {
  const dataErrors = validateHistoryData(history, { rootDir });
  if (dataErrors.length) {
    throw new Error(`History data validation failed:\n- ${dataErrors.join("\n- ")}`);
  }
  const template = readFileSync(templatePath, "utf8");
  const outputPath = getHistoryOutputPath(rootDir, history);
  const html = template
    .replace("{{HISTORY_META}}", renderMeta(history))
    .replace("{{HISTORY_MAIN}}", renderMain(history));
  if (html.includes("{{HISTORY_")) throw new Error("History template contains unreplaced placeholders");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
  updateSitemap(history);
  return outputPath;
}

const outputPath = generateHistoryPage(tarotHistory);
console.log(`Generated ${getHistoryRoute(tarotHistory)} -> ${outputPath}`);
console.log("Updated sitemap.xml with the Tarot History route");
