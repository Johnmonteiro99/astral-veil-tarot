import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotComparisons } from "../data/tarot-comparisons.mjs";
import { getTarotEducationHeroImages } from "../data/tarot-education-hero-images.js";
import { escapeHtml } from "./card-page-helpers.mjs";
import {
  getComparisonOutputPath,
  getComparisonRoute,
  resolveComparisonCard,
  validateComparisonData
} from "./comparison-page-helpers.mjs";
import { validateRenderedTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = validateComparisonData(tarotComparisons, { rootDir, checkGenerated: true });
const sitemap = readFileSync(resolve(rootDir, "sitemap.xml"), "utf8");
const tarotScript = readFileSync(resolve(rootDir, "js/tarot.js"), "utf8");
const tarotHubCss = readFileSync(resolve(rootDir, "css/tarot.css"), "utf8");
const comparisonCss = readFileSync(resolve(rootDir, "css/tarot-comparison.css"), "utf8");
const comparisonScript = readFileSync(resolve(rootDir, "js/tarot-comparison.js"), "utf8");
const educationCss = readFileSync(resolve(rootDir, "css/tarot-education-components.css"), "utf8");
const educationScript = readFileSync(resolve(rootDir, "js/tarot-education.js"), "utf8");
const directWrapperRule = comparisonCss.match(/\.tarot-comparison-direct\s*\{([^}]*)\}/)?.[1] || "";

if (!tarotHubCss.includes("grid-template-columns: minmax(220px,44%) minmax(0,56%);")
  || !tarotHubCss.includes("grid-template-columns: minmax(0,56%) minmax(220px,44%);")
  || !tarotHubCss.includes(".tarot-guide--comparison>.tarot-guide__link>.tarot-guide__media")
  || !tarotHubCss.includes(".tarot-guide--comparison .tarot-guide__content")
  || !tarotHubCss.includes(".tarot-guide--comparison .tarot-guide__cta")
  || !tarotHubCss.includes("padding: 9px 15px;")
  || !tarotHubCss.includes(".tarot-guide__cta-label { min-width: 0; white-space: normal; }")
  || !tarotScript.includes('<span class="tarot-guide__spark" aria-hidden="true">✦</span>')
  || !tarotScript.includes('<span class="tarot-guide__arrow" aria-hidden="true">→</span>')
  || !tarotScript.includes('<span class="tarot-guide__cta-label">')) {
  errors.push("tarotHub.comparisonTiles: mirrored media sizing or stable CTA pill structure is missing");
}

tarotComparisons.forEach((comparison) => {
  const route = getComparisonRoute(comparison);
  const leftTabLabel = comparison.systems.left.tabLabel || comparison.systems.left.title;
  const rightTabLabel = comparison.systems.right.tabLabel || comparison.systems.right.title;
  const html = readFileSync(getComparisonOutputPath(rootDir, comparison), "utf8");
  const sitemapCount = sitemap.split(`https://astralveil.world${route}`).length - 1;
  const canonicalCount = html.split(`<link rel="canonical" href="https://astralveil.world${route}"`).length - 1;
  const h1Count = (html.match(/<h1\b/g) || []).length;
  const renderedIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = renderedIds.filter((id, index) => renderedIds.indexOf(id) !== index);
  const comparisonRowCount = (html.match(/<article class="tarot-comparison-row"/g) || []).length;
  const tarotExampleCount = (html.match(/<figure class="tarot-comparison-example tarot-comparison-example--tarot">/g) || []).length;
  const conceptualExampleCount = (html.match(/data-conceptual-comparison-example/g) || []).length;
  const decisionHeadingCount = (html.match(/id="comparison-decision-heading"/g) || []).length;
  const heroStart = html.indexOf("tarot-comparison-hero");
  const introductionStart = html.indexOf('<div class="tarot-education-hero__editorial tarot-comparison-introduction tarot-comparison-section"');
  const directStart = html.indexOf('<section class="tarot-comparison-direct tarot-comparison-section"');
  const activeEducationKey = comparison.slug === "tarot-vs-lenormand"
    ? "tarot-vs-lenormand"
    : "tarot-vs-oracle";
  validateRenderedTarotEducationNavigation(html, { activeKey: activeEducationKey, rootDir })
    .forEach((error) => errors.push(`${comparison.id}.educationNavigation: ${error}`));

  if (sitemapCount !== 1) errors.push(`${comparison.id}.sitemap: expected one entry, found ${sitemapCount}`);
  if (canonicalCount !== 1) errors.push(`${comparison.id}.canonical: expected one canonical, found ${canonicalCount}`);
  if (h1Count !== 1) errors.push(`${comparison.id}.heading: expected one H1, found ${h1Count}`);
  if (duplicateIds.length) errors.push(`${comparison.id}.ids: duplicate IDs found: ${[...new Set(duplicateIds)].join(", ")}`);
  if (comparisonRowCount !== comparison.comparisonRows.length) {
    errors.push(`${comparison.id}.comparisonRows: expected ${comparison.comparisonRows.length} rendered rows, found ${comparisonRowCount}`);
  }
  if (html.includes("tarot-comparison-row__icon")) {
    errors.push(`${comparison.id}.comparisonRows: decorative row icons must not be rendered`);
  }
  if (tarotExampleCount !== comparison.leftExamples.cards.length) {
    errors.push(`${comparison.id}.leftExamples: expected ${comparison.leftExamples.cards.length} rendered Tarot examples, found ${tarotExampleCount}`);
  }
  if (conceptualExampleCount !== comparison.rightExamples.cards.length) {
    errors.push(`${comparison.id}.rightExamples: expected ${comparison.rightExamples.cards.length} conceptual examples, found ${conceptualExampleCount}`);
  }
  if (decisionHeadingCount !== 1) {
    errors.push(`${comparison.id}.decision: expected one visible decision heading, found ${decisionHeadingCount}`);
  }
  if (!(heroStart >= 0 && introductionStart > heroStart && directStart > introductionStart)
    || !html.includes(`<p>${escapeHtml(comparison.introduction)}</p>`)) {
    errors.push(`${comparison.id}.hero: introduction must appear in the hero supporting row before the direct answer`);
  }
  if (!html.includes('class="tarot-comparison-examples-layout"')
    || !html.includes('class="tarot-comparison-decision-wide"')
    || !html.includes('class="tarot-comparison-choice-band"')) {
    errors.push(`${comparison.id}.layout: examples layout, wide decision panel, or choice band is missing`);
  }
  if (html.includes('tarot-comparison-pathways__top') || html.includes('tarot-comparison-decision-panel')) {
    errors.push(`${comparison.id}.layout: obsolete three-column examples layout is still rendered`);
  }
  if (!html.includes(`role="tablist" aria-label="Choose ${escapeHtml(leftTabLabel)} or ${escapeHtml(rightTabLabel)} examples" data-comparison-example-tabs`)
    || !html.includes('role="tab" aria-selected="true"')
    || !html.includes('role="tab" aria-selected="false"')
    || !html.includes(`data-comparison-example-tab="${escapeHtml(comparison.systems.left.id)}"`)
    || !html.includes(`data-comparison-example-tab="${escapeHtml(comparison.systems.right.id)}"`)
    || !html.includes('role="tabpanel"')
    || !html.includes(`data-comparison-example-panel="${escapeHtml(comparison.systems.left.id)}"`)
    || !html.includes(`data-comparison-example-panel="${escapeHtml(comparison.systems.right.id)}"`)) {
    errors.push(`${comparison.id}.examplesTabs: accessible comparison example tabs are incomplete`);
  }
  if (html.includes('class="tarot-comparison-decision tarot-comparison-section"')) {
    errors.push(`${comparison.id}.layout: obsolete standalone decision section is still rendered`);
  }

  if (!tarotScript.includes(`key: "${comparison.hubTile.key}"`)
    || !tarotScript.includes(`title: "${comparison.title}"`)
    || !tarotScript.includes(`route: "${route}"`)
    || !tarotScript.includes(`ctaLabel: "${comparison.hubTile.ctaLabel}"`)
    || !tarotScript.includes(`imageSide: "${comparison.hubTile.imageSide}"`)
    || !tarotScript.includes(`route: "${route}", available: true`)) {
    errors.push(`${comparison.id}.tile: enabled Tarot hub guide configuration is missing`);
  }
  if (!tarotHubCss.includes(".tarot-guide--comparison>.tarot-guide__link")) {
    errors.push(`${comparison.id}.tile: completed comparison guide link layout is missing`);
  }

  const educationHeroKey = comparison.slug === "tarot-vs-lenormand" ? "tarot-vs-lenormand" : "tarot-vs-oracle";
  const educationHeroImages = getTarotEducationHeroImages(educationHeroKey);
  if (!html.includes(`data-education-page="${educationHeroKey}"`)
    || !html.includes(`src="${escapeHtml(educationHeroImages.regular.src)}"`)
    || !html.includes("data-education-hero-image")) {
    errors.push(`${comparison.id}.hero: centralized education hero configuration is not rendered`);
  }
  if (comparison.hero.regularImage.includes("?") || comparison.hero.bloodMoonImage.includes("?")) {
    errors.push(`${comparison.id}.hero: cache-busting query strings are not allowed`);
  }
  if (!html.includes(`<span class="tarot-comparison-button tarot-comparison-button--disabled" aria-disabled="true">${escapeHtml(comparison.decision.rightCta.label)}</span>`)) {
    errors.push(`${comparison.id}.rightCta: unfinished comparison-system CTA must be a disabled non-link`);
  }
  if (/href="\/(?:oracle|lenormand)\b/i.test(html)) {
    errors.push(`${comparison.id}.unfinishedRoutes: generated page links to an unfinished Oracle or Lenormand route`);
  }
  if (/"@type":"Product"/.test(html)) {
    errors.push(`${comparison.id}.schema: Product structured data must not be present`);
  }

  if (!comparisonCss.includes("grid-template-columns: minmax(150px, .35fr) minmax(0, 1.45fr) minmax(260px, .75fr);")
    || !comparisonCss.includes(".tarot-comparison-examples-layout {")
    || !comparisonCss.includes("grid-template-columns: repeat(2, minmax(0, 1fr));")
    || !comparisonCss.includes(".tarot-comparison-decision-wide {")) {
    errors.push(`${comparison.id}.layout: direct-answer, two-column examples, or wide decision layout is missing`);
  }
  if (!comparisonCss.includes(".tarot-comparison-matrix__rows {")
    || !comparisonCss.includes("border: 1px solid rgba(255, 255, 255, .035);")
    || !comparisonCss.includes("backdrop-filter: blur(10px);")) {
    errors.push(`${comparison.id}.comparisonRows: editorial comparison panel styling is missing`);
  }
  if (!html.includes("tarot-education-hero--immersive")
    || !html.includes(`data-education-page="${escapeHtml(activeEducationKey)}"`)
    || !educationCss.includes("--education-hero-height: clamp(540px, 56vw, 640px);")
    || !educationCss.includes("object-fit: cover;")
    || !educationCss.includes("object-position: var(--education-hero-image-position);")
    || !comparisonCss.includes("grid-template-columns: minmax(150px, .35fr) minmax(0, 1.45fr) minmax(260px, .75fr);")) {
    errors.push(`${comparison.id}.hero: shared cinematic hero or direct-answer layout is missing`);
  }
  if (!comparisonCss.includes("@media (max-width: 900px) and (min-width: 769px)")
    || !comparisonCss.includes("@media (max-width: 768px)")
    || !comparisonCss.includes(".tarot-comparison-examples-tabs")
    || !comparisonCss.includes("[data-comparison-example-panel]")) {
    errors.push(`${comparison.id}.examplesResponsive: tablet stacking or mobile tab styling is missing`);
  }
  if (!/background:\s*transparent;/.test(directWrapperRule)
    || /gradient|box-shadow|backdrop-filter|\bborder\s*:/.test(directWrapperRule)
    || /\.tarot-comparison-direct::(?:before|after)/.test(comparisonCss)) {
    errors.push(`${comparison.id}.outerSurfaces: Direct Answer wrapper must remain transparent and overlay-free`);
  }
  if (!comparisonScript.includes("data-comparison-example-tab")
    || !comparisonScript.includes("syncExamplePanels")
    || !comparisonScript.includes("panel.hidden")
    || !comparisonScript.includes("ArrowRight")) {
    errors.push(`${comparison.id}.examplesTabs: mobile tab controller or keyboard support is missing`);
  }
  if (!html.includes("data-comparison-deck-nav")
    || !html.includes("data-comparison-deck-rail")
    || !html.includes("data-comparison-deck-current")
    || !html.includes("data-comparison-deck-counter")
    || !html.includes("data-comparison-deck-prev")
    || !html.includes("data-comparison-deck-next")
    || !comparisonScript.includes("scrollToComparisonSlide")
    || !comparisonScript.includes("syncComparisonDeckFromScroll")
    || !comparisonCss.includes("scroll-snap-type: x mandatory")
    || !comparisonCss.includes("grid-auto-columns: calc(100% - 30px)")) {
    errors.push(`${comparison.id}.comparisonRows: accessible mobile comparison deck behavior is missing`);
  }
  if (html.includes("data-comparison-row-toggle")
    || comparisonScript.includes("syncComparisonRows")
    || comparisonCss.includes(".tarot-comparison-row__toggle")) {
    errors.push(`${comparison.id}.comparisonRows: obsolete mobile accordion behavior is still present`);
  }

  comparison.leftExamples.cards.forEach((example, exampleIndex) => {
    const card = resolveComparisonCard(example.slug);
    if (!card || !html.includes(`href="${card.route}"`)) {
      errors.push(`${comparison.id}.leftExamples[${exampleIndex}]: canonical Tarot card link is missing`);
    }
    if (card && (!html.includes(`data-regular-src="${escapeHtml(card.standardImage)}"`)
      || !html.includes(`data-blood-src="${escapeHtml(card.bloodMoonImage)}"`))) {
      errors.push(`${comparison.id}.leftExamples[${exampleIndex}]: Veilrise or Veilfall image source is missing`);
    }
  });

  comparison.relatedLinks.forEach((link, linkIndex) => {
    if (!html.includes(`href="${escapeHtml(link.route)}"`)
      || !html.includes(`<strong>${escapeHtml(link.label)}</strong>`)) {
      errors.push(`${comparison.id}.relatedLinks[${linkIndex}]: crawlable route or descriptive label is missing`);
    }
  });

  comparison.comparisonRows.forEach((row, rowIndex) => {
    const rowId = `${comparison.slug}-comparison-row-${row.id}`;
    if (!html.includes(`<h3 id="${escapeHtml(rowId)}-heading">${escapeHtml(row.label)}</h3>`)
      || !html.includes(`aria-label="${escapeHtml(row.label)} comparison, ${rowIndex + 1} of ${comparison.comparisonRows.length}"`)
      || !html.includes(`data-comparison-row-label="${escapeHtml(row.label)}"`)
      || !html.includes(`<p>${escapeHtml(row.left)}</p>`)
      || !html.includes(`<p>${escapeHtml(row.right)}</p>`)) {
      errors.push(`${comparison.id}.comparisonRows.${row.id}: generated slide content or accessible labeling is incomplete`);
    }
  });

  const faqSchemaMatch = html.match(/<script id="tarot-comparison-faq-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!faqSchemaMatch) {
    errors.push(`${comparison.id}.faqSchema: FAQPage JSON-LD is missing`);
  } else {
    const faqSchema = JSON.parse(faqSchemaMatch[1]);
    comparison.faq.forEach(({ question, answer }, index) => {
      const schemaEntry = faqSchema.mainEntity?.[index];
      if (schemaEntry?.name !== question || schemaEntry?.acceptedAnswer?.text !== answer) {
        errors.push(`${comparison.id}.faqSchema[${index}]: schema does not match the comparison record`);
      }
      if (!html.includes(`>${escapeHtml(question)}<`) || !html.includes(`<p>${escapeHtml(answer)}</p>`)) {
        errors.push(`${comparison.id}.faq[${index}]: visible FAQ content does not match the comparison record`);
      }
    });
  }
  if ((html.match(/data-education-faq-button/g) || []).length !== comparison.faq.length
    || (html.match(/data-education-faq-item/g) || []).length !== comparison.faq.length
    || !educationScript.includes("setItemState")) {
    errors.push(`${comparison.id}.faq: shared accessible accordion contract is incomplete`);
  }

  const schemas = [...html.matchAll(/<script(?: id="[^"]+")? type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  if (!schemas.some((schema) => schema["@type"] === "BreadcrumbList")) {
    errors.push(`${comparison.id}.schema: BreadcrumbList is missing`);
  }
  if (!schemas.some((schema) => schema["@type"] === "WebPage")) {
    errors.push(`${comparison.id}.schema: WebPage is missing`);
  }
});

const compareRoot = resolve(rootDir, "tarot/compare");
const generatedComparisonSlugs = readdirSync(compareRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const expectedComparisonSlugs = tarotComparisons.map((comparison) => comparison.slug).sort();
if (JSON.stringify(generatedComparisonSlugs) !== JSON.stringify(expectedComparisonSlugs)) {
  errors.push("comparisons: generated directories do not match the comparison records");
}
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Tarot comparison validation passed for ${tarotComparisons.length} generated page.`);
}
