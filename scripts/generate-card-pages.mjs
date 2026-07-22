import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import {
  SITE_ORIGIN,
  buildPageCards,
  escapeHtml,
  getCardOutputPath,
  serializeForInlineScript,
  validateCardData
} from "./card-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(rootDir, "templates/tarot-card-detail.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");
const compatibilityPath = resolve(rootDir, "tarot-card.html");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceRequired(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error(`Template marker not found: ${label}`);
  }
  pattern.lastIndex = 0;
  return source.replace(pattern, replacement);
}

function replaceDataContent(source, dataAttribute, content) {
  const attribute = escapeRegExp(dataAttribute);
  const pattern = new RegExp(`(<([a-zA-Z0-9]+)(?=[^>]*\\b${attribute}\\b)[^>]*>)([\\s\\S]*?)(</\\2>)`);
  return replaceRequired(source, pattern, `$1${content}$4`, dataAttribute);
}

function replaceElementById(source, id, content) {
  const escapedId = escapeRegExp(id);
  const pattern = new RegExp(`(<([a-zA-Z0-9]+)(?=[^>]*\\bid="${escapedId}")[^>]*>)([\\s\\S]*?)(</\\2>)`);
  return replaceRequired(source, pattern, `$1${content}$4`, `#${id}`);
}

function replaceMetaContent(source, attribute, key, content) {
  const tagPattern = new RegExp(`<meta(?=[^>]*\\b${escapeRegExp(attribute)}="${escapeRegExp(key)}")[^>]*>`);
  const match = source.match(tagPattern);
  if (!match) {
    throw new Error(`Template metadata not found: ${attribute}=${key}`);
  }
  const nextTag = match[0].replace(/\bcontent="[^"]*"/, `content="${escapeHtml(content)}"`);
  return source.replace(match[0], nextTag);
}

function renderDefinitionItems(items) {
  return items.map(({ label, value }) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
}

function renderFaqItems(card) {
  return card.commonQuestions.map(({ question, answer }, index) => {
    const number = index + 1;
    return `<article class="tarot-card-faq__item"><h3><button class="tarot-card-faq__question" id="tarot-card-faq-question-${number}" type="button" aria-expanded="false" aria-controls="tarot-card-faq-answer-${number}" data-faq-button="${index}">${escapeHtml(question)}<span class="tarot-card-faq__icon" aria-hidden="true">+</span></button></h3><div class="tarot-card-faq__answer" id="tarot-card-faq-answer-${number}" data-faq-panel="${index}" role="region" aria-labelledby="tarot-card-faq-question-${number}" hidden><p>${escapeHtml(answer)}</p></div></article>`;
  }).join("");
}

function renderFaqSchema(card) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: card.commonQuestions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };
}

function renderBreadcrumbSchema(card) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Tarot Card Meanings", item: `${SITE_ORIGIN}/tarot` },
      { "@type": "ListItem", position: 3, name: card.title, item: `${SITE_ORIGIN}${card.route}` }
    ]
  };
}

function renderSequenceLink(direction, destination) {
  const isPrevious = direction === "previous";
  const label = isPrevious ? "← Previous" : "Next →";
  if (!destination?.available || !destination.route) {
    return `<a class="tarot-card-page__sequence-link is-unavailable" data-card-${direction} aria-disabled="true" tabindex="-1" aria-label="${isPrevious ? "Previous" : "Next"} tarot card is unavailable">${label}</a>`;
  }
  return `<a class="tarot-card-page__sequence-link" href="${escapeHtml(destination.route)}" data-card-${direction} aria-label="${isPrevious ? "Previous" : "Next"} tarot card: ${escapeHtml(destination.title)}">${label}</a>`;
}

function replaceElementAttribute(source, dataAttribute, attribute, value) {
  const tagPattern = new RegExp(`<([a-zA-Z0-9]+)(?=[^>]*\\b${escapeRegExp(dataAttribute)}\\b)[^>]*>`);
  const match = source.match(tagPattern);
  if (!match) {
    throw new Error(`Template element not found for attribute update: ${dataAttribute}`);
  }
  const escapedValue = escapeHtml(value);
  const attributePattern = new RegExp(`\\b${escapeRegExp(attribute)}="[^"]*"`);
  const nextTag = attributePattern.test(match[0])
    ? match[0].replace(attributePattern, `${attribute}="${escapedValue}"`)
    : match[0].replace(/>$/, ` ${attribute}="${escapedValue}">`);
  return source.replace(match[0], nextTag);
}

function renderPage(template, card) {
  const veilrise = card.variants.veilrise;
  const canonicalUrl = `${SITE_ORIGIN}${card.route}`;
  const imageUrl = `${SITE_ORIGIN}${veilrise.image}`;
  const imageAlt = veilrise.imageAlt || `${card.title} tarot card from the ${veilrise.deckName} deck`;
  const identity = card.identity.map((item) => item.label === "Deck" ? { ...item, value: veilrise.deckName } : item);
  let html = template;

  html = replaceRequired(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(card.seo.title)}</title>`, "page title");
  html = replaceMetaContent(html, "name", "description", card.seo.description);
  html = replaceRequired(html, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`, "canonical URL");
  html = replaceMetaContent(html, "property", "og:title", card.seo.ogTitle || card.seo.title);
  html = replaceMetaContent(html, "property", "og:description", card.seo.ogDescription || card.seo.description);
  html = replaceMetaContent(html, "property", "og:url", canonicalUrl);
  html = replaceMetaContent(html, "property", "og:image", imageUrl);
  html = replaceMetaContent(html, "name", "twitter:title", card.seo.title);
  html = replaceMetaContent(html, "name", "twitter:description", card.seo.twitterDescription);
  html = replaceMetaContent(html, "name", "twitter:image", imageUrl);
  html = replaceRequired(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${serializeForInlineScript(renderBreadcrumbSchema(card))}</script>`, "breadcrumb schema");
  html = replaceRequired(html, /<script id="tarot-card-faq-schema" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="tarot-card-faq-schema" type="application/ld+json">${serializeForInlineScript(renderFaqSchema(card))}</script>`, "FAQ schema");
  html = replaceRequired(html, /<link rel="preload" as="image" href="[^"]*"\s*\/>/, `<link rel="preload" as="image" href="${escapeHtml(veilrise.image)}" />`, "card image preload");

  const embeddedData = `<script id="tarot-card-data" type="application/json">${serializeForInlineScript(card)}</script>`;
  html = replaceRequired(html, /\s*<\/head>/, `\n    ${embeddedData}\n  </head>`, "embedded card data");

  html = replaceRequired(html, /<a(?=[^>]*data-card-previous)[^>]*>[\s\S]*?<\/a>/, renderSequenceLink("previous", card.previous), "previous navigation");
  html = replaceRequired(html, /<a(?=[^>]*data-card-next)[^>]*>[\s\S]*?<\/a>/, renderSequenceLink("next", card.next), "next navigation");
  html = replaceDataContent(html, "data-card-index", escapeHtml(card.index));
  html = replaceDataContent(html, "data-card-total", escapeHtml(card.total));

  const imageTag = `<img class="tarot-card-hero__image" src="${escapeHtml(veilrise.image)}" alt="${escapeHtml(imageAlt)}" width="1024" height="1536" fetchpriority="high" decoding="async" draggable="false" data-card-image />`;
  html = replaceRequired(html, /<img(?=[^>]*data-card-image)[^>]*\/>/, imageTag, "hero card image");
  html = replaceDataContent(html, "data-card-arcana", escapeHtml(card.arcana));
  html = replaceDataContent(html, "data-card-name", escapeHtml(card.title));
  html = replaceDataContent(html, "data-card-tagline", escapeHtml(veilrise.subtitle));
  html = replaceDataContent(html, "data-card-archetypal-message", escapeHtml(card.archetypalMessage));
  html = replaceDataContent(html, "data-card-upright", escapeHtml(card.uprightMeaning));
  html = replaceDataContent(html, "data-card-reversed", escapeHtml(card.reversedMeaning));
  html = replaceDataContent(html, "data-card-shadow", escapeHtml(card.shadowMeaning));
  html = replaceDataContent(html, "data-card-reflection", escapeHtml(card.reflection));
  html = replaceDataContent(html, "data-card-keywords", card.keywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join(""));
  html = replaceDataContent(html, "data-card-correspondences", renderDefinitionItems(card.correspondences));
  html = replaceDataContent(html, "data-card-identity", renderDefinitionItems(identity));
  html = replaceDataContent(html, "data-card-description", escapeHtml(card.description));
  html = replaceDataContent(html, "data-card-traditional-meaning", escapeHtml(card.traditionalMeaning));
  html = replaceDataContent(html, "data-card-astral-meaning", escapeHtml(veilrise.astralVeilMeaning));
  Object.entries(card.categories).forEach(([category, meanings]) => {
    html = replaceDataContent(html, `data-card-life-${category}`, escapeHtml(meanings.upright));
  });

  html = replaceElementById(html, "tarot-life-currents-title", `How ${escapeHtml(card.title)} May Appear in Your Life`);
  html = replaceElementById(html, "tarot-card-journey-title", `${escapeHtml(card.title)}’s Place in the Journey`);
  html = replaceDataContent(html, "data-journey-current-card", escapeHtml(card.journey.currentCard));
  html = replaceDataContent(html, "data-journey-details", renderDefinitionItems(card.journey.details));
  html = replaceDataContent(html, "data-journey-next-card", escapeHtml(card.journey.nextCard));
  html = replaceDataContent(html, "data-journey-next-message", escapeHtml(card.journey.nextMessage));
  html = replaceDataContent(html, "data-journey-summary", escapeHtml(card.journey.summary));
  html = replaceElementById(html, "tarot-card-faq-title", `Common Questions About ${escapeHtml(card.title)}`);
  html = replaceDataContent(html, "data-card-faq", renderFaqItems(card));
  html = replaceDataContent(html, "data-card-journal-primary", escapeHtml(veilrise.reflectionPrompts[0]));
  html = replaceDataContent(html, "data-card-journal-secondary", escapeHtml(veilrise.reflectionPrompts[1]));
  html = replaceElementAttribute(html, "data-perspective-tabs", "aria-label", `Choose a perspective on ${card.title}`);
  html = replaceRequired(html, /(<a class="tarot-card-action" href="\/journal" aria-label=")[^"]*(")/, `$1${escapeHtml(`Write to Journal about ${card.title}`)}$2`, "journal action label");

  return `${html.trim()}\n`;
}

function updateSitemap(cards) {
  const startMarker = "  <!-- GENERATED:TAROT_CARD_PAGES:START -->";
  const endMarker = "  <!-- GENERATED:TAROT_CARD_PAGES:END -->";
  const generatedBlock = [
    startMarker,
    ...cards.flatMap((card) => [
      "  <url>",
      `    <loc>${SITE_ORIGIN}${card.route}</loc>`,
      `    <lastmod>${card.seo.lastModified}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      "    <priority>0.8</priority>",
      "  </url>"
    ]),
    endMarker
  ].join("\n");
  let sitemap = readFileSync(sitemapPath, "utf8");

  const generatedPattern = new RegExp(`${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}\\n?`);
  sitemap = sitemap.replace(generatedPattern, "");
  const obsoleteRoutes = ["/tarot/cards/the-fool", ...cards.map((card) => card.route.replace(/\/$/, ""))];
  obsoleteRoutes.forEach((route) => {
    const urlPattern = new RegExp(`\\s*<url>\\s*<loc>${escapeRegExp(`${SITE_ORIGIN}${route}`)}\\/?</loc>[\\s\\S]*?</url>`, "g");
    sitemap = sitemap.replace(urlPattern, "");
  });
  sitemap = sitemap.replace(/\s*<\/urlset>\s*$/, `\n${generatedBlock}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

const validation = validateCardData(tarotCardDetails, { rootDir, checkGenerated: false });
validation.warnings.forEach((warning) => console.warn(`WARN  ${warning}`));
if (validation.errors.length) {
  validation.errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  const template = readFileSync(templatePath, "utf8");
  const pageCards = buildPageCards(tarotCardDetails);
  pageCards.forEach((card) => {
    const outputPath = getCardOutputPath(rootDir, card);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, renderPage(template, card));
    console.log(`Generated ${card.route} -> ${outputPath.replace(`${rootDir}/`, "")}`);
  });
  const foolPage = pageCards.find((card) => card.id === "the-fool");
  writeFileSync(compatibilityPath, renderPage(template, foolPage));
  console.log("Generated tarot-card.html compatibility artifact");
  updateSitemap(pageCards);
  console.log(`Updated sitemap.xml with ${pageCards.length} Tarot card routes`);
}
