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
  renderTarotEducationNavigation,
  renderTarotFaqSection
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
    `<script id="tarot-beginners-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`,
    `<script src="/js/tarot-education-route-scroll.js"></script>`
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
              <a class="tarot-beginners-button tarot-beginners-button--secondary" href="${escapeHtml(page.hero.secondaryRoute)}">${escapeHtml(page.hero.secondaryLabel)} <span aria-hidden="true">→</span></a>
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
          <h2 id="${isBlood ? "blood-welcome-heading" : "welcome-heading"}" tabindex="-1">${escapeHtml(copy.heading)}</h2>
          <div class="tarot-beginners-welcome__prose">${copy.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
          <ol class="tarot-beginners-welcome__truths">${renderTruths(copy.truths)}</ol>
          <div class="tarot-beginners-actions tarot-beginners-welcome__actions">
            <a class="tarot-beginners-button tarot-beginners-button--primary" href="#what-is-tarot" data-beginner-chapter-link="what-is-tarot" data-welcome-primary><span data-welcome-primary-label>${escapeHtml(copy.primaryLabel)}</span> <span aria-hidden="true">→</span></a>
            <a class="tarot-beginners-button tarot-beginners-button--secondary" href="?view=chapters" data-beginner-index-link>${escapeHtml(copy.secondaryLabel)}</a>
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
            <figcaption>The first door opens through curiosity, attention, and time.</figcaption>
          </figure>
        </div>
      </section>`;
}

const chapterPathOffsets = [28, 44, 54, 43, 25, 16, 31, 47, 30, 14];

function renderChapterPath() {
  const rowHeight = 74;
  const points = chapterPathOffsets.map((x, index) => ({ x, y: (index * rowHeight) + (rowHeight / 2) }));
  const path = points.slice(1).reduce((value, point, index) => {
    const previous = points[index];
    const midpoint = (previous.y + point.y) / 2;
    return `${value} C ${previous.x} ${midpoint}, ${point.x} ${midpoint}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
  return `<svg class="tarot-beginners-index-path__line" viewBox="0 0 88 ${rowHeight * points.length}" preserveAspectRatio="none" aria-hidden="true"><path d="${path}"></path></svg>`;
}

function renderIndexTimelineItem(chapter, index) {
  return `<li style="--chapter-path-x:${chapterPathOffsets[index]}px">
              <button type="button" aria-controls="beginner-index-card-${escapeHtml(chapter.id)}" data-beginner-index-select="${escapeHtml(chapter.id)}">
                <span class="tarot-beginners-index-path__node" aria-hidden="true"><span data-beginner-index-node-icon></span></span>
                <span class="tarot-beginners-index-path__number">${chapter.number}</span>
                <span class="tarot-beginners-index-path__copy"><strong>${escapeHtml(chapter.navLabel)}</strong><small>${escapeHtml(chapter.cardSummary)}</small></span>
                <span class="tarot-beginners-index-path__next" data-beginner-index-next hidden>Next <span aria-hidden="true">→</span></span>
                <span class="tarot-beginners-index__sr-only" data-beginner-index-state>Upcoming chapter</span>
              </button>
            </li>`;
}

function renderIndexPreview(chapter, index, total) {
  return `<article class="tarot-beginners-index-card" id="beginner-index-card-${escapeHtml(chapter.id)}" role="group" aria-roledescription="slide" aria-label="Chapter ${index + 1} of ${total}: ${escapeHtml(chapter.navLabel)}" data-beginner-index-slide="${escapeHtml(chapter.id)}">
              <div class="tarot-beginners-index-card__media">
                ${renderImage(chapter.image, "tarot-beginners-index-card__image")}
                <span class="tarot-beginners-index-card__veil" aria-hidden="true"></span>
              </div>
              <div class="tarot-beginners-index-card__content">
                <p class="tarot-beginners-index-card__label">Chapter ${chapter.number} <span aria-hidden="true">✦</span></p>
                <h3>${escapeHtml(chapter.navLabel)}</h3>
                <p class="tarot-beginners-index-card__summary">${escapeHtml(chapter.cardSummary)}</p>
                <div class="tarot-beginners-index-card__footer">
                  <div class="tarot-beginners-index-progress">
                    <div class="tarot-beginners-index-progress__heading"><span>Your Progress</span><strong data-beginner-index-progress-percent>0%</strong></div>
                    <div class="tarot-beginners-index-progress__bar" role="progressbar" aria-label="Beginner guide completion" aria-valuemin="0" aria-valuemax="10" aria-valuenow="0" aria-valuetext="0 of 10 chapters complete" data-beginner-index-progress><span></span></div>
                  </div>
                  <a class="tarot-beginners-button tarot-beginners-button--primary tarot-beginners-index-card__open" href="#${escapeHtml(chapter.id)}" data-beginner-chapter-link="${escapeHtml(chapter.id)}"><span>Open Chapter</span><span aria-hidden="true">→</span></a>
                  <button class="tarot-beginners-index-card__complete" type="button" aria-pressed="false" data-beginner-complete-chapter="${escapeHtml(chapter.id)}"><span aria-hidden="true">✧</span><span data-beginner-complete-label>Mark as Complete</span></button>
                </div>
              </div>
            </article>`;
}

function renderIndexStripItem(chapter) {
  return `<button type="button" aria-controls="beginner-index-card-${escapeHtml(chapter.id)}" data-beginner-index-select="${escapeHtml(chapter.id)}"><span>${chapter.number}</span><strong>${escapeHtml(chapter.navLabel)}</strong><i aria-hidden="true"></i></button>`;
}

function renderIndexDot(chapter) {
  return `<button type="button" aria-label="Show Chapter ${Number(chapter.number)}: ${escapeHtml(chapter.navLabel)}" aria-controls="beginner-index-card-${escapeHtml(chapter.id)}" data-beginner-index-select="${escapeHtml(chapter.id)}"><span aria-hidden="true"></span></button>`;
}

function renderChapterIndex(page) {
  const total = page.chapters.length;
  return `<section class="tarot-beginners-index" id="chapters" aria-labelledby="beginner-index-heading" data-beginner-panel="index" data-beginner-index>
        <div class="tarot-beginners-index__shell">
          <a class="tarot-beginners-index__back" href="${escapeHtml(page.route)}" data-beginner-index-back><span aria-hidden="true">←</span> Back to Tarot for Beginners</a>
          <h2 class="tarot-beginners-index__sr-only" id="beginner-index-heading">Explore all Tarot for Beginners chapters</h2>
          <div class="tarot-beginners-index__layout">
            <aside class="tarot-beginners-index-path" aria-label="Tarot for Beginners chapter path">
              ${renderChapterPath()}
              <ol>${page.chapters.map(renderIndexTimelineItem).join("")}</ol>
            </aside>
            <div class="tarot-beginners-index-preview">
              <header class="tarot-beginners-index-mobile-header">
                <p data-beginner-index-counter>Chapter 1 of ${total}</p>
                <span><span aria-hidden="true">↔</span> Swipe to explore</span>
              </header>
              <div class="tarot-beginners-index-viewport" role="region" aria-roledescription="carousel" aria-label="Tarot for Beginners chapter previews" data-beginner-index-viewport>
                <div class="tarot-beginners-index-track" data-beginner-index-track>${page.chapters.map((chapter, index) => renderIndexPreview(chapter, index, total)).join("")}</div>
              </div>
              <nav class="tarot-beginners-index-strip" aria-label="Choose a chapter">${page.chapters.map(renderIndexStripItem).join("")}</nav>
              <div class="tarot-beginners-index-mobile-nav">
                <button type="button" aria-label="Previous chapter" data-beginner-index-previous><span aria-hidden="true">←</span></button>
                <div class="tarot-beginners-index-dots" role="group" aria-label="Choose a chapter">${page.chapters.map(renderIndexDot).join("")}</div>
                <button type="button" aria-label="Next chapter" data-beginner-index-next-control><span aria-hidden="true">→</span></button>
              </div>
              <p class="tarot-beginners-index__status tarot-beginners-index__sr-only" aria-live="polite" aria-atomic="true" data-beginner-index-live>Chapter index ready.</p>
            </div>
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

function renderChapterVisualPlaceholder(visual, variant = "chamber") {
  const captionId = `${visual.slot}-placeholder-caption`;
  return `<figure class="tarot-beginners-lesson-placeholder tarot-beginners-lesson-placeholder--${escapeHtml(variant)}" style="--lesson-placeholder-ratio:${escapeHtml(visual.ratio)}" data-chapter-visual-placeholder="${escapeHtml(visual.slot)}" data-future-src="${escapeHtml(visual.futureSrc)}">
          <div class="tarot-beginners-lesson-placeholder__canvas" role="img" aria-label="${escapeHtml(visual.alt)}">
            <span class="tarot-beginners-lesson-placeholder__orbit" aria-hidden="true"></span>
            <span class="tarot-beginners-lesson-placeholder__star" aria-hidden="true">✦</span>
            <span class="tarot-beginners-lesson-placeholder__lines" aria-hidden="true"><i></i><i></i><i></i></span>
          </div>
          <figcaption id="${escapeHtml(captionId)}"><span>Development visual</span><strong>${escapeHtml(visual.slot)}</strong></figcaption>
        </figure>`;
}

function renderChamberProgress(chambers) {
  const initialStatus = `Chamber 1 of ${chambers.length}, ${chambers[0].title}, open.`;
  const stages = chambers.map((chamber, index) => `<li${index === 0 ? ' class="is-active"' : ""}>
            <button type="button" aria-label="Open ${escapeHtml(chamber.label)}: ${escapeHtml(chamber.title)}" aria-controls="${escapeHtml(chamber.id)}-panel" aria-pressed="${index === 0 ? "true" : "false"}"${index === 0 ? ' aria-current="step"' : ""} data-chamber-stage="${escapeHtml(chamber.id)}">
              <span aria-hidden="true">${escapeHtml(chamber.numeral)}</span>
              <span class="tarot-beginners-index__sr-only">${escapeHtml(chamber.title)}</span>
              <i aria-hidden="true" hidden data-chamber-stage-mark></i>
            </button>${index < chambers.length - 1 ? '\n            <span class="tarot-beginners-chamber-progress__line" aria-hidden="true"></span>' : ""}
          </li>`).join("");

  return `<nav class="tarot-beginners-chamber-progress" aria-label="Chapter chamber progress" data-chamber-progress>
          <p class="tarot-beginners-index__sr-only" aria-live="polite" aria-atomic="true" data-chamber-progress-status>${escapeHtml(initialStatus)}</p>
          <ol>${stages}</ol>
        </nav>`;
}

function renderChapterIntroduction(chapter, lesson) {
  return `<header class="tarot-beginners-academy-introduction">
          <div class="tarot-beginners-academy-introduction__layout">
            <div class="tarot-beginners-academy-introduction__copy">
              <p class="tarot-beginners-chapter__number">Chapter ${chapter.number} <span aria-hidden="true">•</span> ${escapeHtml(chapter.eyebrow)}</p>
              <h2 id="${escapeHtml(chapter.id)}-heading" tabindex="-1">${escapeHtml(lesson.title)}</h2>
              <p class="tarot-beginners-chapter__introduction">${escapeHtml(chapter.introduction)}</p>
              <p class="tarot-beginners-academy-introduction__continuation">${escapeHtml(lesson.introContinuation)}</p>
              <p class="tarot-beginners-academy-introduction__status" aria-live="polite" data-lesson-completion-status>Chapter in progress</p>
            </div>
            ${renderChapterVisualPlaceholder(lesson.headerVisual, "header")}
          </div>
          ${renderChamberProgress(lesson.chambers)}
        </header>`;
}

function renderLessonLearningVisual(chamber) {
  const visual = chamber.learningVisual;
  let content = "";

  if (visual.type === "equation") {
    const terms = visual.items.map((item, index) => `${index > 0 ? '<span class="tarot-beginners-lesson-visual-tool__operator" aria-hidden="true">+</span>' : ""}<span class="tarot-beginners-lesson-visual-tool__term">${escapeHtml(item)}</span>`).join("");
    content = `<div class="tarot-beginners-lesson-visual-tool__equation" role="group" aria-label="Card plus Question plus Context plus Reader equals Interpretation">${terms}<span class="tarot-beginners-lesson-visual-tool__operator" aria-hidden="true">=</span><strong>${escapeHtml(visual.result)}</strong></div>`;
  } else {
    content = `<ul>${visual.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  return `<figure class="tarot-beginners-lesson-visual-tool tarot-beginners-lesson-visual-tool--${escapeHtml(visual.type)}" data-lesson-visual-tool="${escapeHtml(visual.type)}">
          <div class="tarot-beginners-lesson-visual-tool__field" aria-hidden="true"><span></span><i>✦</i></div>
          <div class="tarot-beginners-lesson-visual-tool__content">${content}</div>
          <figcaption>${escapeHtml(visual.label)}</figcaption>
        </figure>`;
}

function renderLessonChamber(chamber, index) {
  const headingId = `${chamber.id}-heading`;
  const previewId = `${chamber.id}-preview`;
  const panelId = `${chamber.id}-panel`;
  const sections = chamber.sections.map((section) => `<section class="tarot-beginners-lesson-chamber__section">
              <h4>${escapeHtml(section.heading)}</h4>
              ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </section>`).join("");

  return `<section class="tarot-beginners-lesson-chamber${index === 0 ? " is-active is-open" : ""}" id="${escapeHtml(chamber.id)}" aria-labelledby="${escapeHtml(headingId)}" data-lesson-chamber="${escapeHtml(chamber.id)}"${index === 0 ? " data-chamber-default-open" : ""}>
          <div class="tarot-beginners-lesson-chamber__header">
            ${renderChapterVisualPlaceholder(chamber.visual)}
            <div class="tarot-beginners-lesson-chamber__summary">
              <div class="tarot-beginners-lesson-chamber__identity"><span aria-hidden="true">${escapeHtml(chamber.numeral)}</span><p>${escapeHtml(chamber.label)}</p></div>
              <h3 id="${escapeHtml(headingId)}" data-chamber-title>${escapeHtml(chamber.title)}</h3>
              <p id="${escapeHtml(previewId)}">${escapeHtml(chamber.preview)}</p>
              <ul class="tarot-beginners-lesson-chamber__topics" aria-label="Topics in ${escapeHtml(chamber.label)}">${chamber.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul>
            </div>
            <button class="tarot-beginners-lesson-chamber__trigger" type="button" aria-expanded="true" aria-controls="${escapeHtml(panelId)}" aria-labelledby="${escapeHtml(headingId)}" aria-describedby="${escapeHtml(previewId)}" data-chamber-trigger="${escapeHtml(chamber.id)}"><span data-chamber-trigger-label>Close ${escapeHtml(chamber.label)}</span><span aria-hidden="true">→</span></button>
          </div>
          <div class="tarot-beginners-lesson-chamber__panel" id="${escapeHtml(panelId)}" role="region" aria-labelledby="${escapeHtml(headingId)}" data-chamber-panel="${escapeHtml(chamber.id)}">
            <div class="tarot-beginners-lesson-chamber__panel-inner">
              ${renderLessonLearningVisual(chamber)}
              <div class="tarot-beginners-lesson-chamber__editorial">${sections}</div>
              <aside class="tarot-beginners-lesson-chamber__takeaway" aria-label="Chamber takeaway"><span aria-hidden="true">✦</span><p>${escapeHtml(chamber.takeaway)}</p></aside>
            </div>
          </div>
        </section>`;
}

function renderLessonTakeaway(chapter, takeaway) {
  const headingId = `${chapter.id}-lesson-takeaway-heading`;
  return `<aside class="tarot-beginners-lesson-takeaway" aria-labelledby="${escapeHtml(headingId)}">
          <span aria-hidden="true">✦</span>
          <div><h3 id="${escapeHtml(headingId)}">Remember This</h3><p>${escapeHtml(takeaway)}</p></div>
        </aside>`;
}

function renderLessonCompletion(chapter) {
  const headingId = `${chapter.id}-lesson-completion-heading`;
  return `<section class="tarot-beginners-lesson-completion" aria-labelledby="${escapeHtml(headingId)}">
          <div class="tarot-beginners-lesson-completion__progress">
            <h3 id="${escapeHtml(headingId)}">Chapter Completion</h3>
            <p aria-live="polite" data-lesson-course-progress-text>0 of ${beginnerChapterMetadata.length} chapters complete</p>
            <div role="progressbar" aria-label="Tarot for Beginners course completion" aria-valuemin="0" aria-valuemax="${beginnerChapterMetadata.length}" aria-valuenow="0" aria-valuetext="0 of ${beginnerChapterMetadata.length} chapters complete" data-lesson-course-progress><span></span></div>
          </div>
          <button class="tarot-beginners-button tarot-beginners-button--secondary tarot-beginners-lesson-completion__button" type="button" aria-pressed="false" data-beginner-complete-chapter="${escapeHtml(chapter.id)}"><span aria-hidden="true">✧</span><span data-beginner-complete-label>Mark Chapter Complete</span></button>
        </section>`;
}

function renderLessonNavigation(chapter) {
  const chapterIndex = beginnerChapterMetadata.findIndex((item) => item.id === chapter.id);
  const previous = chapterIndex > 0 ? beginnerChapterMetadata[chapterIndex - 1] : null;
  const next = beginnerChapterMetadata[chapterIndex + 1] || null;
  const previousControl = previous
    ? `<a href="${escapeHtml(previous.hash)}" data-beginner-chapter-link="${escapeHtml(previous.id)}" data-reader-previous><span aria-hidden="true">←</span><span>Previous Chapter</span><strong>${escapeHtml(previous.navLabel)}</strong></a>`
    : '<a href="#chapters" aria-disabled="true" tabindex="-1" data-reader-previous><span aria-hidden="true">←</span><span>Previous Chapter</span><strong>No previous chapter</strong></a>';
  const nextControl = next
    ? `<a href="${escapeHtml(next.hash)}" data-beginner-chapter-link="${escapeHtml(next.id)}" data-reader-continue><span>Continue to Chapter ${next.number}</span><strong>${escapeHtml(next.navLabel)}</strong><span aria-hidden="true">→</span></a>`
    : "";

  return `<nav class="tarot-beginners-lesson-navigation" aria-label="Chapter navigation">
          <div class="tarot-beginners-lesson-navigation__previous">${previousControl}<a href="?view=chapters" data-beginner-index-link>Return to Chapter Library</a></div>
          <p class="tarot-beginners-lesson-navigation__position"><span>Current progress</span><strong>Chapter ${chapter.number} of ${beginnerChapterMetadata.length}</strong></p>
          <div class="tarot-beginners-lesson-navigation__next">${nextControl}</div>
        </nav>`;
}

function renderAcademyChapter(chapter) {
  const lesson = chapter.academyLesson;
  return `<article class="tarot-beginners-chapter tarot-beginners-academy-lesson" id="${escapeHtml(chapter.id)}" aria-labelledby="${escapeHtml(chapter.id)}-heading" data-beginner-chapter="${escapeHtml(chapter.id)}" data-academy-lesson="${escapeHtml(chapter.id)}">
        ${renderChapterIntroduction(chapter, lesson)}
        <div class="tarot-beginners-lesson-chambers" data-lesson-chambers>${lesson.chambers.map(renderLessonChamber).join("")}</div>
        ${renderLessonTakeaway(chapter, lesson.takeaway)}
        ${renderLessonCompletion(chapter)}
        ${renderLessonNavigation(chapter)}
      </article>`;
}

function renderStandardChapter(chapter) {
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

function renderChapter(chapter) {
  return chapter.academyLesson ? renderAcademyChapter(chapter) : renderStandardChapter(chapter);
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
                <a href="?view=chapters" data-beginner-index-link>View All Chapters</a>
              </div>
            </div>
            <div class="tarot-beginners-door" aria-hidden="true" data-beginner-door><span></span><i>✦</i></div>
            <div class="tarot-beginners-chapter-stream" data-beginner-chapter-stream>${page.chapters.map(renderChapter).join("")}</div>
            <nav class="tarot-beginners-reader-controls" aria-label="Guided chapter controls" data-reader-controls>
              <a class="tarot-beginners-button tarot-beginners-button--secondary" href="#chapters" aria-disabled="true" data-reader-previous><span aria-hidden="true">←</span> Previous Chapter</a>
              <a class="tarot-beginners-button tarot-beginners-button--primary" href="#${escapeHtml(page.chapters[1].id)}" data-reader-continue>Continue to Chapter 02 <span aria-hidden="true">→</span></a>
              <a class="tarot-beginners-button tarot-beginners-button--text" href="?view=chapters" data-beginner-index-link>View All Chapters</a>
            </nav>
            <p class="tarot-beginners-reader__end" data-reader-end hidden>You have reached Chapter ${last.number}. Return to the chapter index to choose another doorway.</p>
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
  return renderTarotFaqSection({
    section: { ...page.faq, id: "beginner-faq" },
    items: page.faq.items,
    idPrefix: "tarot-beginners-faq",
    className: "tarot-beginners-faq",
    layout: "split",
    includeMajorClass: true,
    renderAnswer: (item) => item.parts.map(renderFaqPart).join("")
  });
}

function renderClosingDoor(option, type) {
  return `<a class="tarot-beginners-closing__door tarot-beginners-closing__door--${type}" href="${escapeHtml(option.route)}" aria-label="${escapeHtml(option.title)}">
            <span class="tarot-beginners-closing__content">
              <span class="tarot-beginners-closing__label">${escapeHtml(option.eyebrow)}</span>
              <span class="tarot-beginners-closing__title">${escapeHtml(option.title)}</span>
              <span class="tarot-beginners-closing__description">${escapeHtml(option.description)}</span>
              <span class="tarot-beginners-closing__cta">${escapeHtml(option.label)} <span aria-hidden="true">→</span></span>
            </span>
          </a>`;
}

function renderClosing(page) {
  return `<section class="tarot-beginners-closing" aria-labelledby="beginner-closing-heading">
        <div class="tarot-beginners-shell tarot-beginners-closing__inner">
          <header class="tarot-beginners-closing__header">
            <p class="tarot-beginners-eyebrow">${escapeHtml(page.closing.eyebrow)}</p>
            <h2 id="beginner-closing-heading">${escapeHtml(page.closing.heading)}</h2>
            <p>${escapeHtml(page.closing.text)}</p>
          </header>
          <nav class="tarot-beginners-closing__doors" aria-label="Choose your next tarot destination">
            ${renderClosingDoor(page.closing.primary, "practice")}
            ${renderClosingDoor(page.closing.secondary, "learning")}
          </nav>
        </div>
      </section>`;
}

function renderMain(page) {
  const clientMetadata = beginnerChapterMetadata.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    navLabel: chapter.navLabel,
    title: chapter.title,
    cardSummary: chapter.cardSummary,
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
        ${renderChapterIndex(page)}
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
  const topicMarker = "<!-- GENERATED:TAROT_TOPIC_PAGES:START -->";
  let sitemap = readFileSync(sitemapPath, "utf8").replace(currentBlock, "");

  sitemap = sitemap.includes(topicMarker)
    ? sitemap.replace(topicMarker, `${block}\n  ${topicMarker}`)
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
