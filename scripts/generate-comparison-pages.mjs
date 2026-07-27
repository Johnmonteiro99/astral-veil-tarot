import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotComparisons } from "../data/tarot-comparisons.mjs";
import { escapeHtml, serializeForInlineScript, SITE_ORIGIN } from "./card-page-helpers.mjs";
import {
  getComparisonOutputPath,
  getComparisonRoute,
  resolveComparisonCard,
  validateComparisonData
} from "./comparison-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(rootDir, "templates/tarot-comparison-page.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderSchemas(comparison) {
  const route = getComparisonRoute(comparison);
  const canonicalUrl = `${SITE_ORIGIN}${route}`;
  return {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Tarot", item: `${SITE_ORIGIN}/tarot` },
        { "@type": "ListItem", position: 3, name: comparison.breadcrumbLabel, item: canonicalUrl }
      ]
    },
    webPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: comparison.title,
      description: comparison.seo.description,
      url: canonicalUrl,
      image: `${SITE_ORIGIN}${comparison.hero.regularImage}`,
      isPartOf: {
        "@type": "WebSite",
        name: "Astral Veil",
        url: `${SITE_ORIGIN}/`
      },
      about: {
        "@type": "Thing",
        name: comparison.schemaAbout
      }
    },
    faqPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: comparison.faq.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    }
  };
}

function renderMeta(comparison) {
  const route = getComparisonRoute(comparison);
  const canonicalUrl = `${SITE_ORIGIN}${route}`;
  const heroUrl = `${SITE_ORIGIN}${comparison.hero.regularImage}`;
  const schemas = renderSchemas(comparison);

  return [
    `<title>${escapeHtml(comparison.seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(comparison.seo.description)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(comparison.seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(comparison.seo.ogDescription)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${heroUrl}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(comparison.hero.regularAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(comparison.seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(comparison.seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${heroUrl}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(comparison.hero.regularAlt)}" />`,
    `<link rel="preload" as="image" href="${escapeHtml(comparison.hero.regularImage)}" fetchpriority="high" />`,
    `<script type="application/ld+json">${serializeForInlineScript(schemas.breadcrumb)}</script>`,
    `<script id="tarot-comparison-webpage-schema" type="application/ld+json">${serializeForInlineScript(schemas.webPage)}</script>`,
    `<script id="tarot-comparison-faq-schema" type="application/ld+json">${serializeForInlineScript(schemas.faqPage)}</script>`
  ].join("\n    ");
}

function renderThemeImage({
  className,
  regularImage,
  bloodMoonImage,
  regularAlt,
  bloodMoonAlt,
  width,
  height,
  loading = "lazy",
  fetchpriority = "",
  draggable = false
}) {
  const fetchPriorityAttribute = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  return `<img class="${className}" src="${escapeHtml(regularImage)}" alt="${escapeHtml(regularAlt)}" width="${width}" height="${height}" loading="${loading}" decoding="async"${fetchPriorityAttribute} draggable="${draggable}" data-comparison-theme-image data-regular-src="${escapeHtml(regularImage)}" data-regular-alt="${escapeHtml(regularAlt)}" data-regular-width="${width}" data-regular-height="${height}" data-blood-src="${escapeHtml(bloodMoonImage)}" data-blood-alt="${escapeHtml(bloodMoonAlt)}" data-blood-width="${width}" data-blood-height="${height}" />`;
}

function renderComparisonRows(comparison) {
  return comparison.comparisonRows.map((row, index) => {
    const rowId = `${comparison.slug}-comparison-row-${row.id}`;
    const position = index + 1;
    const total = comparison.comparisonRows.length;
    return `<article class="tarot-comparison-row" aria-label="${escapeHtml(row.label)} comparison, ${position} of ${total}" data-comparison-row data-comparison-row-label="${escapeHtml(row.label)}" data-comparison-row-index="${position}">
          <div class="tarot-comparison-row__category">
            <span class="tarot-comparison-row__number" aria-hidden="true">${String(position).padStart(2, "0")}</span>
            <h3 id="${escapeHtml(rowId)}-heading">${escapeHtml(row.label)}</h3>
          </div>
          <div class="tarot-comparison-row__panel">
            <div class="tarot-comparison-row__answer tarot-comparison-row__answer--left">
              <p class="tarot-comparison-row__system-label">${escapeHtml(comparison.systems.left.title)}</p>
              <p>${escapeHtml(row.left)}</p>
            </div>
            <div class="tarot-comparison-row__answer tarot-comparison-row__answer--right">
              <p class="tarot-comparison-row__system-label">${escapeHtml(comparison.systems.right.title)}</p>
              <p>${escapeHtml(row.right)}</p>
            </div>
          </div>
        </article>`;
  }).join("");
}

function renderTarotExamples(comparison) {
  return comparison.leftExamples.cards.map((example) => {
    const card = resolveComparisonCard(example.slug);
    if (!card) throw new Error(`Missing Tarot comparison card: ${example.slug}`);
    const regularAlt = card.standardImageAlt || `${card.title} Tarot card from Astral Veil’s Veilrise Arcana`;
    const bloodAlt = card.bloodMoonImageAlt || `${card.title} Tarot card from Astral Veil’s Veilfall Arcana`;
    return `<figure class="tarot-comparison-example tarot-comparison-example--tarot">
              <a class="tarot-comparison-example__card" href="${escapeHtml(card.route)}" aria-label="Explore ${escapeHtml(card.title)} Tarot meaning" data-astral-card-tilt>
                <span class="tarot-comparison-example__frame">
                  ${renderThemeImage({
                    className: "tarot-comparison-example__image",
                    regularImage: card.standardImage,
                    bloodMoonImage: card.bloodMoonImage,
                    regularAlt,
                    bloodMoonAlt: bloodAlt,
                    width: 1024,
                    height: 1536,
                    draggable: false
                  })}
                  <span class="tarot-comparison-example__shine" aria-hidden="true"></span>
                </span>
              </a>
              <figcaption><a href="${escapeHtml(card.route)}">Explore ${escapeHtml(card.title)}</a></figcaption>
            </figure>`;
  }).join("");
}

function renderConceptualExamples(comparison) {
  return comparison.rightExamples.cards.map((example, index) => `<article class="tarot-comparison-oracle tarot-comparison-oracle--${escapeHtml(example.id)}" data-conceptual-comparison-example="${escapeHtml(comparison.systems.right.id)}">
              <div class="tarot-comparison-oracle__art" aria-hidden="true">
                <span class="tarot-comparison-oracle__number">${String(index + 1).padStart(2, "0")}</span>
                <span class="tarot-comparison-oracle__icon" style="--oracle-icon: url('${escapeHtml(example.icon)}')"></span>
                <span class="tarot-comparison-oracle__orbit"></span>
              </div>
              <div class="tarot-comparison-oracle__copy">
                <h3>${escapeHtml(example.title)}</h3>
                <p>${escapeHtml(example.caption)}</p>
              </div>
            </article>`).join("");
}

function renderChoiceList(choice) {
  return `<section class="tarot-comparison-choice">
            <h3>${escapeHtml(choice.heading)}</h3>
            <ul>${choice.items.map((item) => `<li><span aria-hidden="true">✦</span>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>`;
}

function renderFaq(comparison) {
  return comparison.faq.map(({ question, answer }, index) => {
    const number = index + 1;
    return `<article class="tarot-comparison-faq__item${index === 0 ? " is-open" : ""}">
            <h3><button class="tarot-comparison-faq__question" id="tarot-comparison-faq-question-${number}" type="button" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="tarot-comparison-faq-answer-${number}" data-comparison-faq-button>
              <span>${escapeHtml(question)}</span><span class="tarot-comparison-faq__icon" aria-hidden="true">+</span>
            </button></h3>
            <div class="tarot-comparison-faq__answer" id="tarot-comparison-faq-answer-${number}" role="region" aria-labelledby="tarot-comparison-faq-question-${number}"${index === 0 ? "" : " hidden"}><p>${escapeHtml(answer)}</p></div>
          </article>`;
  }).join("");
}

function renderRelatedLinks(comparison) {
  return comparison.relatedLinks.map((link) => `<a class="tarot-comparison-related__link" href="${escapeHtml(link.route)}"><strong>${escapeHtml(link.label)}</strong><span>${escapeHtml(link.copy)}</span><span aria-hidden="true">→</span></a>`).join("");
}

function renderMain(comparison) {
  const hero = comparison.hero;
  const direct = comparison.directAnswer;
  const decision = comparison.decision;
  const leftId = comparison.systems.left.id;
  const rightId = comparison.systems.right.id;
  const leftTitle = comparison.systems.left.title;
  const rightTitle = comparison.systems.right.title;
  const leftTabLabel = comparison.systems.left.tabLabel || leftTitle;
  const rightTabLabel = comparison.systems.right.tabLabel || rightTitle;

  return `<main id="main-content" class="tarot-comparison">
      <section class="tarot-comparison-hero" aria-labelledby="tarot-comparison-title">
        <div class="tarot-comparison-hero__shell">
          <div class="tarot-comparison-hero__copy">
            <p class="tarot-comparison-kicker">${escapeHtml(comparison.eyebrow)}</p>
            <h1 id="tarot-comparison-title">${escapeHtml(comparison.title)}</h1>
            <span class="tarot-comparison-rule" aria-hidden="true"><span>✦</span></span>
          </div>
          <figure class="tarot-comparison-hero__art">
            ${renderThemeImage({
              className: "tarot-comparison-hero__image",
              regularImage: hero.regularImage,
              bloodMoonImage: hero.bloodMoonImage,
              regularAlt: hero.regularAlt,
              bloodMoonAlt: hero.bloodMoonAlt,
              width: hero.width,
              height: hero.height,
              loading: "eager",
              fetchpriority: "high"
            })}
          </figure>
        </div>
      </section>

      <section class="tarot-comparison-introduction tarot-comparison-section" aria-label="Introduction">
        <p>${escapeHtml(comparison.introduction)}</p>
      </section>

      <section class="tarot-comparison-direct tarot-comparison-section" aria-labelledby="direct-answer-heading">
        <div class="tarot-comparison-direct__label">
          <p class="tarot-comparison-kicker">${escapeHtml(direct.eyebrow)}</p>
          <span aria-hidden="true">✦</span>
        </div>
        <div class="tarot-comparison-direct__answer">
          <h2 id="direct-answer-heading" class="sr-only">${escapeHtml(direct.eyebrow)}</h2>
          <p>${escapeHtml(direct.copy)}</p>
        </div>
        <p class="tarot-comparison-direct__takeaway">${escapeHtml(direct.takeaway)}</p>
      </section>

      <section class="tarot-comparison-matrix tarot-comparison-section" aria-labelledby="comparison-matrix-heading">
        <h2 id="comparison-matrix-heading" class="sr-only">${escapeHtml(leftTitle)} and ${escapeHtml(rightTitle)} Comparison</h2>
        <header class="tarot-comparison-systems">
          <div class="tarot-comparison-systems__center">
            <p>${escapeHtml(comparison.systems.centerLabel)}</p>
            <span aria-hidden="true">✦</span>
          </div>
          <div class="tarot-comparison-system tarot-comparison-system--left">
            <h3>${escapeHtml(comparison.systems.left.title)}</h3>
            <p>${escapeHtml(comparison.systems.left.introduction)}</p>
          </div>
          <div class="tarot-comparison-system tarot-comparison-system--right">
            <h3>${escapeHtml(comparison.systems.right.title)}</h3>
            <p>${escapeHtml(comparison.systems.right.introduction)}</p>
          </div>
        </header>
        <div class="tarot-comparison-matrix__mobile-nav" aria-label="Comparison category navigation" data-comparison-deck-nav>
          <p class="tarot-comparison-matrix__mobile-status" aria-live="polite" aria-atomic="true">
            <span data-comparison-deck-current>${escapeHtml(comparison.comparisonRows[0].label)}</span>
            <span data-comparison-deck-counter>1 of ${comparison.comparisonRows.length}</span>
          </p>
          <div class="tarot-comparison-matrix__mobile-actions">
            <button type="button" aria-label="Previous comparison category" data-comparison-deck-prev disabled><span aria-hidden="true">←</span><span>Previous</span></button>
            <button type="button" aria-label="Next comparison category" data-comparison-deck-next><span>Next</span><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div class="tarot-comparison-matrix__rows" role="region" aria-label="${escapeHtml(comparison.systems.left.title)} and ${escapeHtml(comparison.systems.right.title)} comparison categories" tabindex="-1" data-comparison-deck-rail>${renderComparisonRows(comparison)}</div>
      </section>

      <section class="tarot-comparison-pathways tarot-comparison-section" aria-label="${escapeHtml(leftTitle)} examples, conceptual ${escapeHtml(rightTitle)} examples, and choosing a path">
        <div class="tarot-comparison-examples-tabs" role="tablist" aria-label="Choose ${escapeHtml(leftTabLabel)} or ${escapeHtml(rightTabLabel)} examples" data-comparison-example-tabs>
          <button id="${escapeHtml(comparison.slug)}-${escapeHtml(leftId)}-examples-tab" type="button" role="tab" aria-selected="true" aria-controls="${escapeHtml(comparison.slug)}-${escapeHtml(leftId)}-examples-panel" tabindex="0" data-comparison-example-tab="${escapeHtml(leftId)}">${escapeHtml(leftTabLabel)}</button>
          <button id="${escapeHtml(comparison.slug)}-${escapeHtml(rightId)}-examples-tab" type="button" role="tab" aria-selected="false" aria-controls="${escapeHtml(comparison.slug)}-${escapeHtml(rightId)}-examples-panel" tabindex="-1" data-comparison-example-tab="${escapeHtml(rightId)}">${escapeHtml(rightTabLabel)}</button>
        </div>
        <div class="tarot-comparison-examples-layout">
          <section id="${escapeHtml(comparison.slug)}-${escapeHtml(leftId)}-examples-panel" class="tarot-comparison-examples__group tarot-comparison-examples__group--${escapeHtml(leftId)} is-mobile-tab-active" role="tabpanel" aria-labelledby="${escapeHtml(comparison.slug)}-${escapeHtml(leftId)}-examples-tab" data-comparison-example-panel="${escapeHtml(leftId)}">
            <header>
              <p class="tarot-comparison-kicker">A Shared Symbolic Language</p>
              <h2 id="${escapeHtml(comparison.slug)}-${escapeHtml(leftId)}-examples-heading">${escapeHtml(comparison.leftExamples.heading)}</h2>
              <p>${escapeHtml(comparison.leftExamples.note)}</p>
            </header>
            <div class="tarot-comparison-examples__rail">${renderTarotExamples(comparison)}</div>
          </section>
          <section id="${escapeHtml(comparison.slug)}-${escapeHtml(rightId)}-examples-panel" class="tarot-comparison-examples__group tarot-comparison-examples__group--${escapeHtml(rightId)}" role="tabpanel" aria-labelledby="${escapeHtml(comparison.slug)}-${escapeHtml(rightId)}-examples-tab" data-comparison-example-panel="${escapeHtml(rightId)}">
            <header>
              <p class="tarot-comparison-kicker">${escapeHtml(comparison.rightExamples.eyebrow || "Deck-Specific Possibilities")}</p>
              <h2 id="${escapeHtml(comparison.slug)}-${escapeHtml(rightId)}-examples-heading">${escapeHtml(comparison.rightExamples.heading)}</h2>
            </header>
            <div class="tarot-comparison-examples__rail">${renderConceptualExamples(comparison)}</div>
            <p class="tarot-comparison-examples__development-note"><span aria-hidden="true">✦</span>${escapeHtml(comparison.rightExamples.note)}</p>
          </section>
        </div>
        <section class="tarot-comparison-decision-wide" aria-labelledby="comparison-decision-heading">
          <header>
            <p class="tarot-comparison-kicker">Choose the Language That Fits</p>
            <h2 id="comparison-decision-heading">${escapeHtml(decision.heading)}</h2>
            <p>${escapeHtml(decision.introduction)}</p>
          </header>
          <span class="tarot-comparison-decision-wide__ornament" aria-hidden="true">✦</span>
          <div class="tarot-comparison-decision__actions">
            <a class="tarot-comparison-button tarot-comparison-button--primary" href="${escapeHtml(decision.tarotCta.route)}">${escapeHtml(decision.tarotCta.label)} <span aria-hidden="true">→</span></a>
            <span class="tarot-comparison-button tarot-comparison-button--disabled" aria-disabled="true">${escapeHtml(decision.rightCta.label)}</span>
          </div>
        </section>
        <div class="tarot-comparison-choice-band" aria-label="Reasons to choose ${escapeHtml(leftTitle)} or ${escapeHtml(rightTitle)}">
          ${renderChoiceList(decision.left)}
          ${renderChoiceList(decision.right)}
        </div>
      </section>

      <section class="tarot-comparison-together tarot-comparison-section" aria-labelledby="comparison-together-heading">
        <div class="tarot-comparison-together__copy">
          <p class="tarot-comparison-kicker">Working in Sequence</p>
          <h2 id="comparison-together-heading">${escapeHtml(comparison.together.heading)}</h2>
          <p class="tarot-comparison-together__description">${escapeHtml(comparison.together.copy)}</p>
          ${comparison.together.note ? `<p class="tarot-comparison-together__note">${escapeHtml(comparison.together.note)}</p>` : ""}
        </div>
        <ol class="tarot-comparison-together__steps">${comparison.together.steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(step)}</p></li>`).join("")}</ol>
      </section>

      <section class="tarot-comparison-faq tarot-comparison-section" aria-labelledby="comparison-faq-heading">
        <header class="tarot-comparison-faq__header">
          <p class="tarot-comparison-kicker">${escapeHtml(comparison.faqSection.eyebrow)}</p>
          <h2 id="comparison-faq-heading">${escapeHtml(comparison.faqSection.heading)}</h2>
          <p>${escapeHtml(comparison.faqSection.introduction)}</p>
        </header>
        <div class="tarot-comparison-faq__list">${renderFaq(comparison)}</div>
      </section>

      <section class="tarot-comparison-related tarot-comparison-section" aria-labelledby="comparison-related-heading">
        <header>
          <p class="tarot-comparison-kicker">Continue Through the Archive</p>
          <h2 id="comparison-related-heading">${escapeHtml(comparison.relatedSectionHeading || "Explore the Tarot Cards in This Comparison")}</h2>
        </header>
        <div class="tarot-comparison-related__links">${renderRelatedLinks(comparison)}</div>
      </section>
    </main>`;
}

function renderPage(template, comparison) {
  if (!template.includes("{{COMPARISON_META}}") || !template.includes("{{COMPARISON_MAIN}}")) {
    throw new Error("Comparison template markers are missing");
  }
  return `${template
    .replace("{{COMPARISON_META}}", renderMeta(comparison))
    .replace("{{COMPARISON_MAIN}}", renderMain(comparison))
    .trim()}\n`;
}

function updateSitemap(comparisons) {
  const startMarker = "  <!-- GENERATED:TAROT_COMPARISON_PAGES:START -->";
  const endMarker = "  <!-- GENERATED:TAROT_COMPARISON_PAGES:END -->";
  const generatedBlock = [
    startMarker,
    ...comparisons.flatMap((comparison) => [
      "  <url>",
      `    <loc>${SITE_ORIGIN}${getComparisonRoute(comparison)}</loc>`,
      `    <lastmod>${comparison.seo.lastModified}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      "    <priority>0.84</priority>",
      "  </url>"
    ]),
    endMarker
  ].join("\n");
  let sitemap = readFileSync(sitemapPath, "utf8");
  const currentBlock = new RegExp(`${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}\\n?`);
  sitemap = sitemap.replace(currentBlock, "");
  comparisons.forEach((comparison) => {
    const canonical = escapeRegExp(`${SITE_ORIGIN}${getComparisonRoute(comparison)}`);
    sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${canonical}</loc>[\\s\\S]*?</url>`, "g"), "");
  });

  const cardMarker = "  <!-- GENERATED:TAROT_CARD_PAGES:START -->";
  sitemap = sitemap.includes(cardMarker)
    ? sitemap.replace(cardMarker, `${generatedBlock}\n${cardMarker}`)
    : sitemap.replace(/\s*<\/urlset>\s*$/, `\n${generatedBlock}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

const errors = validateComparisonData(tarotComparisons, { rootDir, checkGenerated: false });
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  const template = readFileSync(templatePath, "utf8");
  tarotComparisons.forEach((comparison) => {
    const outputPath = getComparisonOutputPath(rootDir, comparison);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, renderPage(template, comparison));
    console.log(`Generated ${getComparisonRoute(comparison)} -> ${outputPath.replace(`${rootDir}/`, "")}`);
  });
  updateSitemap(tarotComparisons);
  console.log(`Updated sitemap.xml with ${tarotComparisons.length} Tarot comparison route`);
}
