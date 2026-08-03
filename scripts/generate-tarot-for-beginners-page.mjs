import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  beginnerChapterMetadata,
  beginnerFaqPlainText,
  tarotForBeginners
} from "../data/tarot-for-beginners.mjs";
import { getTarotEducationHeroImages } from "../data/tarot-education-hero-images.js";
import {
  escapeHtml,
  serializeForInlineScript,
  SITE_ORIGIN
} from "./card-page-helpers.mjs";
import {
  renderTarotEducationHeroImage,
  renderTarotEducationNavigation
} from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(rootDir, "templates/tarot-for-beginners-page.html");
const outputPath = resolve(rootDir, "tarot/for-beginners/index.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const sitemapMarkerStart = "<!-- GENERATED:TAROT_FOR_BEGINNERS_PAGE:START -->";
const sitemapMarkerEnd = "<!-- GENERATED:TAROT_FOR_BEGINNERS_PAGE:END -->";
const beginnerHeroImage = getTarotEducationHeroImages("tarot-for-beginners").regular;

function renderSchemas(page) {
  const canonical = `${SITE_ORIGIN}${page.route}`;
  const image = `${SITE_ORIGIN}${beginnerHeroImage.src}`;

  return {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Tarot", item: `${SITE_ORIGIN}/tarot` },
        { "@type": "ListItem", position: 3, name: page.hero.title, item: canonical }
      ]
    },
    webPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.hero.title,
      headline: page.hero.title,
      description: page.seo.description,
      url: canonical,
      image,
      dateModified: page.seo.modified,
      isPartOf: { "@type": "WebSite", name: "Astral Veil", url: `${SITE_ORIGIN}/` },
      about: [
        { "@type": "Thing", name: "Tarot for beginners" },
        { "@type": "Thing", name: "Tarot deck structure" },
        { "@type": "Thing", name: "Learning tarot cards" }
      ]
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: beginnerFaqPlainText(item)
        }
      }))
    }
  };
}

function renderMeta(page) {
  const canonical = `${SITE_ORIGIN}${page.route}`;
  const heroImageUrl = `${SITE_ORIGIN}${beginnerHeroImage.src}`;
  const schemas = renderSchemas(page);

  return [
    `<title>${escapeHtml(page.seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.seo.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(page.seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.seo.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${heroImageUrl}" />`,
    `<meta property="og:image:width" content="${beginnerHeroImage.width}" />`,
    `<meta property="og:image:height" content="${beginnerHeroImage.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(page.hero.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.seo.description)}" />`,
    `<meta name="twitter:image" content="${heroImageUrl}" />`,
    `<link rel="preload" as="image" href="${beginnerHeroImage.src}" fetchpriority="high" />`,
    `<script id="tarot-beginners-breadcrumb-schema" type="application/ld+json">${serializeForInlineScript(schemas.breadcrumb)}</script>`,
    `<script id="tarot-beginners-webpage-schema" type="application/ld+json">${serializeForInlineScript(schemas.webPage)}</script>`,
    `<script id="tarot-beginners-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`
  ].join("\n    ");
}

function renderImage(image, className, { loading = "lazy", dataAttribute = "" } = {}) {
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${loading}" decoding="async" draggable="false" style="--beginner-image-position:${escapeHtml(image.position)}"${dataAttribute ? ` ${dataAttribute}` : ""} />`;
}

function renderHero(page) {
  return `<section class="tarot-education-hero tarot-education-hero--immersive tarot-beginners-hero" aria-labelledby="tarot-beginners-title" data-education-page="tarot-for-beginners">
        <div class="tarot-education-hero__stage tarot-beginners-hero__stage">
          <div class="tarot-education-hero__copy tarot-beginners-hero__copy">
            <p class="tarot-beginners-eyebrow">${escapeHtml(page.hero.eyebrow)}</p>
            <h1 id="tarot-beginners-title">${escapeHtml(page.hero.title)}</h1>
          </div>
          <figure class="tarot-education-hero__visual tarot-beginners-hero__visual">
            ${renderTarotEducationHeroImage({
              pageKey: "tarot-for-beginners",
              className: "tarot-education-hero__image tarot-beginners-hero__image",
              alt: page.hero.imageAlt
            })}
          </figure>
          <div class="tarot-education-hero__overlay tarot-beginners-hero__veil" aria-hidden="true"></div>
        </div>
        <div class="tarot-education-hero__editorial tarot-beginners-hero__editorial">
          <div class="tarot-beginners-hero__editorial-inner">
            <div>
              <p class="tarot-beginners-hero__subtitle">${escapeHtml(page.hero.subtitle)}</p>
              <p class="tarot-beginners-hero__description">${escapeHtml(page.hero.description)}</p>
            </div>
            <div class="tarot-beginners-actions tarot-beginners-hero__actions">
              <a class="tarot-beginners-button tarot-beginners-button--primary" href="#welcome" data-beginner-view-link="welcome">${escapeHtml(page.hero.primaryLabel)} <span aria-hidden="true">→</span></a>
              <a class="tarot-beginners-button tarot-beginners-button--text" href="${escapeHtml(page.hero.secondaryRoute)}">${escapeHtml(page.hero.secondaryLabel)} <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </section>`;
}

function renderTruths(truths) {
  return truths.map((truth, index) => `<li>
                <span class="tarot-beginners-welcome__truth-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                <span><strong>${escapeHtml(truth.label)}</strong><span>${escapeHtml(truth.text)}</span></span>
              </li>`).join("");
}

function renderWelcomeCopy(copy, theme) {
  const isBlood = theme === "blood";
  return `<div class="tarot-beginners-welcome__copy tarot-beginners-welcome__copy--${theme}" data-beginner-welcome-copy="${theme}" aria-hidden="${isBlood ? "true" : "false"}"${isBlood ? " inert" : ""}>
          <p class="tarot-beginners-eyebrow">${escapeHtml(copy.eyebrow)}</p>
          <h2 id="${isBlood ? "blood-welcome-heading" : "welcome-heading"}">${escapeHtml(copy.heading)}</h2>
          <div class="tarot-beginners-welcome__prose">${copy.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
          <ol class="tarot-beginners-welcome__truths">${renderTruths(copy.truths)}</ol>
          <div class="tarot-beginners-actions tarot-beginners-welcome__actions">
            <a class="tarot-beginners-button tarot-beginners-button--primary" href="#what-is-tarot" data-beginner-chapter-link="what-is-tarot" data-welcome-primary><span data-welcome-primary-label>${escapeHtml(copy.primaryLabel)}</span> <span aria-hidden="true">→</span></a>
            <a class="tarot-beginners-button tarot-beginners-button--secondary" href="#chapters" data-beginner-view-link="library">${escapeHtml(copy.secondaryLabel)}</a>
          </div>
          <p class="tarot-beginners-welcome__whisper" data-welcome-whisper>${escapeHtml(copy.whisper)}</p>
        </div>`;
}

function renderWelcome(page) {
  return `<section class="tarot-beginners-welcome" id="welcome" aria-labelledby="welcome-heading" data-beginner-panel="welcome" data-beginner-welcome data-welcome-theme="regular">
        <div class="tarot-beginners-shell tarot-beginners-welcome__layout">
          <div class="tarot-beginners-welcome__copies">
            ${renderWelcomeCopy(page.welcome.regular, "regular")}
            ${renderWelcomeCopy(page.welcome.bloodMoon, "blood")}
          </div>
          <figure class="tarot-beginners-welcome__visual">
            ${renderImage(page.welcome.image, "tarot-beginners-welcome__image")}
            <span class="tarot-beginners-welcome__door" aria-hidden="true"><i></i></span>
            <figcaption>The first door opens through curiosity, attention, and time.</figcaption>
          </figure>
        </div>
      </section>`;
}

function renderLibraryCard(chapter) {
  return `<a class="tarot-beginners-library-card" href="#${escapeHtml(chapter.id)}" data-beginner-chapter-link="${escapeHtml(chapter.id)}" data-library-chapter="${escapeHtml(chapter.id)}" data-chapter-number="${chapter.number}">
          <span class="tarot-beginners-library-card__media">
            ${renderImage(chapter.image, "tarot-beginners-library-card__image")}
            <span class="tarot-beginners-library-card__number">Chapter ${chapter.number}</span>
          </span>
          <span class="tarot-beginners-library-card__body">
            <strong>${escapeHtml(chapter.navLabel)}</strong>
            <span>${escapeHtml(chapter.cardSummary)}</span>
            <span class="tarot-beginners-library-card__cue"><span data-library-state>Open chapter</span><span aria-hidden="true">→</span></span>
          </span>
        </a>`;
}

function renderLibrary(page) {
  return `<section class="tarot-beginners-library" id="chapters" aria-labelledby="chapters-heading" data-beginner-panel="library">
        <div class="tarot-beginners-shell">
          <header class="tarot-beginners-section-heading">
            <p class="tarot-beginners-eyebrow">${escapeHtml(page.library.eyebrow)}</p>
            <h2 id="chapters-heading">${escapeHtml(page.library.heading)}</h2>
            <p>${escapeHtml(page.library.introduction)}</p>
          </header>
          <div class="tarot-beginners-library__grid">${page.chapters.map(renderLibraryCard).join("")}</div>
          <div class="tarot-beginners-library__footer">
            <a class="tarot-beginners-button tarot-beginners-button--text" href="#welcome" data-beginner-view-link="welcome"><span aria-hidden="true">←</span> Return to the Welcome</a>
          </div>
        </div>
      </section>`;
}

function renderVisual(chapter) {
  return `<figure class="tarot-beginners-module tarot-beginners-module--${escapeHtml(chapter.visual.type)}" data-beginner-module="${escapeHtml(chapter.visual.type)}">
          <div class="tarot-beginners-module__image-wrap">
            ${renderImage(chapter.image, "tarot-beginners-module__image")}
            <span class="tarot-beginners-module__veil" aria-hidden="true"></span>
          </div>
          <div class="tarot-beginners-module__diagram" aria-hidden="true">
            <span class="tarot-beginners-module__center">${escapeHtml(chapter.visual.center)}</span>
            ${chapter.visual.items.map((item, index) => `<span class="tarot-beginners-module__item" style="--module-index:${index};--module-count:${chapter.visual.items.length}">${escapeHtml(item)}</span>`).join("")}
          </div>
          <figcaption>${escapeHtml(chapter.visual.caption)}</figcaption>
        </figure>`;
}

function renderBlock(block) {
  if (block.type === "features") {
    const wrapperTag = block.heading ? "section" : "div";
    const itemHeadingTag = block.heading ? "h4" : "h3";
    return `<${wrapperTag} class="tarot-beginners-block tarot-beginners-block--features">
            ${block.heading ? `<h3>${escapeHtml(block.heading)}</h3>` : ""}
            <div class="tarot-beginners-feature-grid">${block.items.map((item) => `<article><span aria-hidden="true">✦</span><${itemHeadingTag}>${escapeHtml(item.heading)}</${itemHeadingTag}><p>${escapeHtml(item.text)}</p></article>`).join("")}</div>
          </${wrapperTag}>`;
  }

  if (block.type === "paragraphs") {
    return `<div class="tarot-beginners-block tarot-beginners-block--prose">${block.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>`;
  }

  if (block.type === "list") {
    return `<section class="tarot-beginners-block tarot-beginners-block--list"><h3>${escapeHtml(block.heading)}</h3><ul>${block.items.map((item) => `<li><span aria-hidden="true">✦</span>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
  }

  if (block.type === "note") {
    return `<aside class="tarot-beginners-block tarot-beginners-block--note"><span aria-hidden="true">✦</span><div><h3>${escapeHtml(block.heading)}</h3><p>${escapeHtml(block.text)}</p></div></aside>`;
  }

  if (block.type === "links") {
    return `<nav class="tarot-beginners-block tarot-beginners-context-links" aria-label="Related beginner guides">${block.items.map((item) => `<a href="${escapeHtml(item.route)}">${escapeHtml(item.label)} <span aria-hidden="true">→</span></a>`).join("")}</nav>`;
  }

  if (block.type === "pairs") {
    return `<section class="tarot-beginners-block tarot-beginners-myths" aria-label="Tarot myths and realities">${block.items.map((item, index) => `<article>
            <div><p>Myth ${String(index + 1).padStart(2, "0")}</p><h3>${escapeHtml(item.myth)}</h3></div>
            <span class="tarot-beginners-myths__turn" aria-hidden="true">→</span>
            <div><p>Reality</p><p>${escapeHtml(item.reality)}</p></div>
          </article>`).join("")}</section>`;
  }

  if (block.type === "timeline") {
    return `<section class="tarot-beginners-block tarot-beginners-week" aria-label="Seven-day beginner tarot study path"><ol>${block.items.map((item) => `<li><span>${escapeHtml(item.label)}</span><div><h3>${escapeHtml(item.heading)}</h3><p>${escapeHtml(item.text)}</p></div></li>`).join("")}</ol></section>`;
  }

  if (block.type === "glossary") {
    return `<section class="tarot-beginners-block tarot-beginners-glossary"><h3>Essential Tarot Terms</h3><div>${block.items.map((item, index) => `<details${index === 0 ? " open" : ""}><summary><span>${escapeHtml(item.term)}</span><span aria-hidden="true">+</span></summary><p>${escapeHtml(item.definition)}</p></details>`).join("")}</div></section>`;
  }

  if (block.type === "pathways") {
    return `<nav class="tarot-beginners-block tarot-beginners-pathways" aria-label="Choose your next tarot learning path">${block.items.map((item) => `<a class="tarot-beginners-pathway${item.dominant ? " tarot-beginners-pathway--dominant" : ""}" href="${escapeHtml(item.route)}"><span aria-hidden="true">✦</span><span><strong>${escapeHtml(item.heading)}</strong><span>${escapeHtml(item.text)}</span></span><span aria-hidden="true">→</span></a>`).join("")}</nav>`;
  }

  throw new Error(`Unknown beginner content block: ${block.type}`);
}

function renderChapter(chapter) {
  return `<article class="tarot-beginners-chapter" id="${escapeHtml(chapter.id)}" aria-labelledby="${escapeHtml(chapter.id)}-heading" data-beginner-chapter="${escapeHtml(chapter.id)}">
        <header class="tarot-beginners-chapter__header">
          <p class="tarot-beginners-chapter__number">Chapter ${chapter.number} <span aria-hidden="true">·</span> 10</p>
          <p class="tarot-beginners-eyebrow">${escapeHtml(chapter.eyebrow)}</p>
          <h2 id="${escapeHtml(chapter.id)}-heading" tabindex="-1">${escapeHtml(chapter.title)}</h2>
          <p class="tarot-beginners-chapter__introduction">${escapeHtml(chapter.introduction)}</p>
        </header>
        ${renderVisual(chapter)}
        <div class="tarot-beginners-chapter__body">${chapter.blocks.map(renderBlock).join("")}</div>
        <aside class="tarot-beginners-takeaway" aria-label="Remember this"><span aria-hidden="true">✦</span><div><h3>Remember This</h3><p>${escapeHtml(chapter.takeaway)}</p></div></aside>
      </article>`;
}

function renderChapterLink(chapter, location) {
  return `<li><a href="#${escapeHtml(chapter.id)}" data-beginner-chapter-link="${escapeHtml(chapter.id)}" data-chapter-nav-location="${location}"><span class="tarot-beginners-chapter-link__number">${chapter.number}</span><span class="tarot-beginners-chapter-link__copy"><span>${escapeHtml(chapter.navLabel)}</span><small data-chapter-state>Upcoming</small></span><span class="tarot-beginners-chapter-link__star" aria-hidden="true">✦</span></a></li>`;
}

function renderReader(page) {
  const first = page.chapters[0];
  const last = page.chapters.at(-1);
  const railLinks = page.chapters.map((chapter) => renderChapterLink(chapter, "rail")).join("");
  const menuLinks = page.chapters.map((chapter) => renderChapterLink(chapter, "menu")).join("");

  return `<section class="tarot-beginners-reader" aria-label="Guided Tarot for Beginners chapters" data-beginner-panel="reader" data-beginner-reader>
        <div class="tarot-beginners-shell tarot-beginners-reader__layout">
          <aside class="tarot-beginners-rail">
            <div class="tarot-beginners-rail__inner">
              <p class="tarot-beginners-eyebrow">The First Ten Doors</p>
              <nav aria-label="Tarot for Beginners chapter navigation"><ol>${railLinks}</ol></nav>
              <button class="tarot-beginners-button tarot-beginners-button--text" type="button" data-return-guided hidden>Return to Guided Chapters</button>
            </div>
          </aside>
          <div class="tarot-beginners-reader__main">
            <header class="tarot-beginners-mobile-header" data-mobile-chapter-header>
              <div><p data-mobile-chapter-count>Chapter ${first.number} of 10</p><strong data-mobile-chapter-title>${escapeHtml(first.navLabel)}</strong></div>
              <div class="tarot-beginners-mobile-header__progress" role="progressbar" aria-label="Current beginner chapter" aria-valuemin="1" aria-valuemax="10" aria-valuenow="1" data-mobile-progress><span></span></div>
              <div class="tarot-beginners-mobile-header__controls">
                <a href="#chapters" aria-disabled="true" data-reader-previous>Previous</a>
                <button type="button" aria-haspopup="dialog" aria-controls="beginner-chapter-menu" data-open-chapter-menu>Chapter Menu</button>
                <a href="#${escapeHtml(page.chapters[1].id)}" data-reader-continue>Continue</a>
              </div>
            </header>
            <div class="tarot-beginners-reader__toolbar">
              <p aria-live="polite" aria-atomic="true" data-beginner-live-region>Guided chapters ready.</p>
              <div>
                <a href="#chapters" data-beginner-view-link="library">Chapter Library</a>
                <a href="#${escapeHtml(first.id)}" data-beginner-view-all>View All Chapters</a>
                <button type="button" data-return-guided hidden>Return to Guided Chapters</button>
              </div>
            </div>
            <div class="tarot-beginners-door" aria-hidden="true" data-beginner-door><span></span><i>✦</i></div>
            <div class="tarot-beginners-chapter-stream" data-beginner-chapter-stream>${page.chapters.map(renderChapter).join("")}</div>
            <nav class="tarot-beginners-reader-controls" aria-label="Guided chapter controls" data-reader-controls>
              <a class="tarot-beginners-button tarot-beginners-button--secondary" href="#chapters" aria-disabled="true" data-reader-previous><span aria-hidden="true">←</span> Previous Chapter</a>
              <a class="tarot-beginners-button tarot-beginners-button--primary" href="#${escapeHtml(page.chapters[1].id)}" data-reader-continue>Continue to Chapter 02 <span aria-hidden="true">→</span></a>
              <a class="tarot-beginners-button tarot-beginners-button--text" href="#chapters" data-beginner-view-link="library">Return to Chapter Library</a>
              <a class="tarot-beginners-button tarot-beginners-button--text" href="#${escapeHtml(first.id)}" data-beginner-view-all>View All Chapters</a>
            </nav>
            <p class="tarot-beginners-reader__end" data-reader-end hidden>You have reached Chapter ${last.number}. Choose the next doorway above, return to the library, or view the complete chapter.</p>
          </div>
        </div>
        <dialog class="tarot-beginners-chapter-menu" id="beginner-chapter-menu" aria-labelledby="beginner-chapter-menu-title" data-chapter-menu>
          <div class="tarot-beginners-chapter-menu__panel">
            <header><div><p class="tarot-beginners-eyebrow">The Illuminated Index</p><h2 id="beginner-chapter-menu-title">Choose a Chapter</h2></div><button type="button" aria-label="Close chapter menu" data-close-chapter-menu>×</button></header>
            <nav aria-label="Choose a Tarot for Beginners chapter"><ol>${menuLinks}</ol></nav>
          </div>
        </dialog>
      </section>`;
}

function renderFaqPart(part) {
  if (!part.route) return escapeHtml(part.text);
  const chapterId = part.route.startsWith("#") ? part.route.slice(1) : "";
  const chapterAttribute = beginnerChapterMetadata.some((chapter) => chapter.id === chapterId)
    ? ` data-beginner-chapter-link="${escapeHtml(chapterId)}"`
    : "";
  return `<a href="${escapeHtml(part.route)}"${chapterAttribute}>${escapeHtml(part.text)}</a>`;
}

function renderFaq(page) {
  const items = page.faq.items.map((item, index) => {
    const number = index + 1;
    const questionId = `tarot-beginners-faq-question-${number}`;
    const answerId = `tarot-beginners-faq-answer-${number}`;
    return `<article class="tarot-faq__item" data-education-faq-item>
            <h3><button class="tarot-faq__trigger" id="${questionId}" type="button" aria-expanded="true" aria-controls="${answerId}" data-education-faq-button><span>${escapeHtml(item.question)}</span><span class="tarot-faq__icon" aria-hidden="true">−</span></button></h3>
            <div class="tarot-faq__answer" id="${answerId}" role="region" aria-labelledby="${questionId}" aria-hidden="false"><div class="tarot-faq__answer-inner"><p>${item.parts.map(renderFaqPart).join("")}</p></div></div>
          </article>`;
  }).join("");

  return `<section class="tarot-faq major-arcana-faq tarot-education-faq tarot-beginners-faq" id="beginner-faq" aria-labelledby="beginner-faq-heading" data-education-faq>
        <div class="tarot-shell tarot-faq__inner">
          <header class="tarot-faq__header">
            <p class="tarot-faq__eyebrow">${escapeHtml(page.faq.eyebrow)}</p>
            <h2 id="beginner-faq-heading">${escapeHtml(page.faq.heading)}</h2>
            <p class="tarot-faq__intro">${escapeHtml(page.faq.introduction)}</p>
            <div class="tarot-faq__divider" aria-hidden="true"><span></span><span class="tarot-faq__ornament">✦</span><span></span></div>
          </header>
          <div class="tarot-faq__list">${items}</div>
        </div>
      </section>`;
}

function renderClosing(page) {
  return `<section class="tarot-beginners-closing" aria-labelledby="beginner-closing-heading">
        <div class="tarot-beginners-shell tarot-beginners-closing__inner">
          <p class="tarot-beginners-eyebrow">${escapeHtml(page.closing.eyebrow)}</p>
          <h2 id="beginner-closing-heading">${escapeHtml(page.closing.heading)}</h2>
          <p>${escapeHtml(page.closing.text)}</p>
          <div class="tarot-beginners-actions">
            <a class="tarot-beginners-button tarot-beginners-button--primary" href="${escapeHtml(page.closing.primary.route)}">${escapeHtml(page.closing.primary.label)} <span aria-hidden="true">→</span></a>
            <a class="tarot-beginners-button tarot-beginners-button--secondary" href="${escapeHtml(page.closing.secondary.route)}">${escapeHtml(page.closing.secondary.label)}</a>
          </div>
        </div>
      </section>`;
}

function renderMain(page) {
  const clientMetadata = beginnerChapterMetadata.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    navLabel: chapter.navLabel,
    title: chapter.title,
    hash: chapter.hash,
    previous: chapter.previous,
    next: chapter.next
  }));

  return `<main id="main-content" class="tarot-beginners tarot-education-page" data-beginner-root data-beginner-view="welcome">
      ${renderTarotEducationNavigation({ activeKey: "beginners", rootDir })}
      ${renderHero(page)}
      <noscript><p class="tarot-beginners-noscript">JavaScript is not required to read this guide. The complete ten-chapter guide is available below in one document.</p></noscript>
      <div class="tarot-beginners-experience" data-beginner-experience>
        ${renderWelcome(page)}
        ${renderLibrary(page)}
        ${renderReader(page)}
      </div>
      ${renderFaq(page)}
      ${renderClosing(page)}
      <script id="tarot-beginners-chapter-data" type="application/json">${serializeForInlineScript(clientMetadata)}</script>
    </main>`;
}

function updateSitemap(page) {
  const canonical = `${SITE_ORIGIN}${page.route}`;
  const block = `${sitemapMarkerStart}\n  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${page.seo.modified}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n  ${sitemapMarkerEnd}`;
  const currentBlock = new RegExp(`\\s*${sitemapMarkerStart}[\\s\\S]*?${sitemapMarkerEnd}`, "g");
  const historyMarker = "<!-- GENERATED:TAROT_HISTORY_PAGE:START -->";
  let sitemap = readFileSync(sitemapPath, "utf8").replace(currentBlock, "");

  sitemap = sitemap.includes(historyMarker)
    ? sitemap.replace(historyMarker, `${block}\n  ${historyMarker}`)
    : sitemap.replace(/\s*<\/urlset>\s*$/, `\n  ${block}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

export function generateTarotForBeginnersPage(page = tarotForBeginners) {
  const template = readFileSync(templatePath, "utf8");
  const html = template
    .replace("{{BEGINNERS_META}}", renderMeta(page))
    .replace("{{BEGINNERS_MAIN}}", renderMain(page));

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
  updateSitemap(page);
  return outputPath;
}

const generatedPath = generateTarotForBeginnersPage();
console.log(`Generated ${tarotForBeginners.route} -> ${generatedPath}`);
console.log("Updated sitemap.xml with the Tarot for Beginners route");
