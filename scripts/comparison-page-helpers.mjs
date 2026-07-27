import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveTopicCard } from "./topic-page-helpers.mjs";

const comparisonSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function hasText(value) {
  return typeof value === "string" && Boolean(value.trim());
}

function assetPath(rootDir, publicPath) {
  return resolve(rootDir, decodeURIComponent(String(publicPath || "")).replace(/^\/+/, ""));
}

export function getComparisonRoute(comparison) {
  return comparisonSlugPattern.test(String(comparison?.slug || ""))
    ? `/tarot/compare/${comparison.slug}/`
    : "";
}

export function getComparisonOutputPath(rootDir, comparison) {
  const route = getComparisonRoute(comparison);
  return route ? resolve(rootDir, route.replace(/^\/+|\/+$/g, ""), "index.html") : "";
}

export function resolveComparisonCard(slug) {
  return resolveTopicCard(slug);
}

export function validateComparisonData(comparisons, { rootDir, checkGenerated = false } = {}) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();

  if (!Array.isArray(comparisons) || !comparisons.length) {
    return ["comparisons: no comparison records were provided"];
  }
  const completedComparisonRoutes = new Set(comparisons.map(getComparisonRoute).filter(Boolean));

  comparisons.forEach((comparison, comparisonIndex) => {
    const label = hasText(comparison?.id) ? comparison.id : `comparison[${comparisonIndex}]`;
    const requireText = (field, value = comparison?.[field]) => {
      if (!hasText(value)) errors.push(`${label}.${field}: required text is missing`);
    };

    [
      "id",
      "slug",
      "eyebrow",
      "title",
      "introduction",
      "breadcrumbLabel",
      "schemaAbout"
    ].forEach((field) => requireText(field));
    requireText("directAnswer.eyebrow", comparison.directAnswer?.eyebrow);
    requireText("directAnswer.copy", comparison.directAnswer?.copy);
    requireText("directAnswer.takeaway", comparison.directAnswer?.takeaway);
    requireText("systems.centerLabel", comparison.systems?.centerLabel);
    requireText("hubTile.key", comparison.hubTile?.key);
    requireText("hubTile.ctaLabel", comparison.hubTile?.ctaLabel);
    requireText("hubTile.imageSide", comparison.hubTile?.imageSide);
    ["left", "right"].forEach((side) => {
      requireText(`systems.${side}.id`, comparison.systems?.[side]?.id);
      requireText(`systems.${side}.title`, comparison.systems?.[side]?.title);
      requireText(`systems.${side}.introduction`, comparison.systems?.[side]?.introduction);
    });
    requireText("decision.heading", comparison.decision?.heading);
    requireText("decision.introduction", comparison.decision?.introduction);
    requireText("decision.tarotCta.label", comparison.decision?.tarotCta?.label);
    requireText("decision.tarotCta.route", comparison.decision?.tarotCta?.route);
    requireText("decision.rightCta.label", comparison.decision?.rightCta?.label);
    requireText("together.heading", comparison.together?.heading);
    requireText("together.copy", comparison.together?.copy);
    requireText("faqSection.eyebrow", comparison.faqSection?.eyebrow);
    requireText("faqSection.heading", comparison.faqSection?.heading);
    requireText("faqSection.introduction", comparison.faqSection?.introduction);
    requireText("seo.title", comparison.seo?.title);
    requireText("seo.description", comparison.seo?.description);
    requireText("seo.ogTitle", comparison.seo?.ogTitle);
    requireText("seo.ogDescription", comparison.seo?.ogDescription);
    requireText("seo.lastModified", comparison.seo?.lastModified);

    if (ids.has(comparison.id)) errors.push(`${label}.id: duplicate ID "${comparison.id}"`);
    if (slugs.has(comparison.slug)) errors.push(`${label}.slug: duplicate slug "${comparison.slug}"`);
    ids.add(comparison.id);
    slugs.add(comparison.slug);

    if (!getComparisonRoute(comparison)) errors.push(`${label}.slug: invalid clean-route slug`);
    if (comparison.decision?.rightCta?.route) {
      errors.push(`${label}.decision.rightCta.route: unfinished comparison-system CTA must not have a route`);
    }

    if (!Array.isArray(comparison.comparisonRows) || comparison.comparisonRows.length < 1) {
      errors.push(`${label}.comparisonRows: expected at least one comparison row`);
    } else {
      const rowIds = new Set();
      comparison.comparisonRows.forEach((row, rowIndex) => {
        const rowLabel = `${label}.comparisonRows[${rowIndex}]`;
        ["id", "label", "icon", "left", "right"].forEach((field) => {
          if (!hasText(row?.[field])) errors.push(`${rowLabel}.${field}: required text is missing`);
        });
        if (rowIds.has(row.id)) errors.push(`${rowLabel}.id: duplicate row ID "${row.id}"`);
        rowIds.add(row.id);
      });
    }

    if (!Array.isArray(comparison.leftExamples?.cards) || comparison.leftExamples.cards.length !== 4) {
      errors.push(`${label}.leftExamples.cards: expected four Tarot examples`);
    } else {
      comparison.leftExamples.cards.forEach((example, exampleIndex) => {
        if (!resolveComparisonCard(example.slug)) {
          errors.push(`${label}.leftExamples.cards[${exampleIndex}].slug: unknown Tarot card "${example.slug || ""}"`);
        }
      });
    }

    if (!Array.isArray(comparison.rightExamples?.cards) || comparison.rightExamples.cards.length !== 4) {
      errors.push(`${label}.rightExamples.cards: expected four conceptual comparison examples`);
    } else {
      comparison.rightExamples.cards.forEach((example, exampleIndex) => {
        ["id", "title", "caption", "icon"].forEach((field) => {
          if (!hasText(example?.[field])) errors.push(`${label}.rightExamples.cards[${exampleIndex}].${field}: required text is missing`);
        });
        if (example?.route || example?.href) {
          errors.push(`${label}.rightExamples.cards[${exampleIndex}]: conceptual comparison example must not be linked`);
        }
      });
    }

    ["left", "right"].forEach((side) => {
      if (!Array.isArray(comparison.decision?.[side]?.items) || comparison.decision[side].items.length !== 5) {
        errors.push(`${label}.decision.${side}.items: expected five choice points`);
      }
    });
    if (!Array.isArray(comparison.together?.steps) || comparison.together.steps.length !== 4) {
      errors.push(`${label}.together.steps: expected four steps`);
    }
    if (!Array.isArray(comparison.faq) || comparison.faq.length !== 6) {
      errors.push(`${label}.faq: expected six entries`);
    }
    if (!Array.isArray(comparison.relatedLinks) || comparison.relatedLinks.length < 1) {
      errors.push(`${label}.relatedLinks: expected at least one finished destination`);
    }
    (comparison.relatedLinks || []).forEach((link, linkIndex) => {
      ["label", "route", "copy"].forEach((field) => {
        if (!hasText(link?.[field])) errors.push(`${label}.relatedLinks[${linkIndex}].${field}: required text is missing`);
      });
      const relatedRoute = String(link?.route || "");
      if (/oracle|lenormand|for-beginners|how-to-read/i.test(relatedRoute)
        && !completedComparisonRoutes.has(relatedRoute)) {
        errors.push(`${label}.relatedLinks[${linkIndex}].route: unfinished destination must not be linked`);
      }
    });

    [
      comparison.hero?.regularImage,
      comparison.hero?.bloodMoonImage,
      ...(comparison.comparisonRows || []).map((row) => row.icon),
      ...(comparison.rightExamples?.cards || []).map((example) => example.icon),
      ...(comparison.leftExamples?.cards || []).flatMap((example) => {
        const card = resolveComparisonCard(example.slug);
        return [card?.standardImage, card?.bloodMoonImage];
      })
    ].filter(Boolean).forEach((publicPath) => {
      if (!existsSync(assetPath(rootDir, publicPath))) {
        errors.push(`${label}.asset: missing ${publicPath}`);
      }
    });

    if (checkGenerated) {
      const outputPath = getComparisonOutputPath(rootDir, comparison);
      if (!outputPath || !existsSync(outputPath)) {
        errors.push(`${label}.route: generated page is missing`);
      } else {
        const html = readFileSync(outputPath, "utf8");
        const route = getComparisonRoute(comparison);
        if (!html.includes(`<link rel="canonical" href="https://astralveil.world${route}"`)) {
          errors.push(`${label}.canonical: generated page canonical is missing or incorrect`);
        }
        if (!html.includes('id="tarot-comparison-faq-schema"')) {
          errors.push(`${label}.schema: FAQ schema is missing`);
        }
      }
    }
  });

  return errors;
}
