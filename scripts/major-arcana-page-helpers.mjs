import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getCardRoute } from "./card-page-helpers.mjs";

function hasText(value) {
  return typeof value === "string" && Boolean(value.trim());
}

function publicPathToFile(rootDir, publicPath) {
  return resolve(rootDir, decodeURIComponent(String(publicPath || "")).replace(/^\/+/, ""));
}

function requireImage(errors, rootDir, label, image, { decorative = false } = {}) {
  if (!hasText(image?.src)) errors.push(`${label}.src: required image path is missing`);
  if (!Number.isInteger(image?.width) || image.width < 1) errors.push(`${label}.width: positive integer required`);
  if (!Number.isInteger(image?.height) || image.height < 1) errors.push(`${label}.height: positive integer required`);
  if (!decorative && !hasText(image?.alt)) errors.push(`${label}.alt: meaningful alt text is required`);
  if (image?.src && !existsSync(publicPathToFile(rootDir, image.src))) {
    errors.push(`${label}.src: asset does not exist at ${image.src}`);
  }
}

export function getMajorArcanaRoute(page) {
  return page?.slug === "major-arcana" ? "/tarot/major-arcana/" : "";
}

export function getMajorArcanaOutputPath(rootDir, page) {
  const route = getMajorArcanaRoute(page);
  return route ? resolve(rootDir, route.replace(/^\/+|\/+$/g, ""), "index.html") : "";
}

export function buildMajorArcanaCards(page, tarotCards) {
  const records = new Map(
    tarotCards
      .filter((card) => card.system === "tarot" && card.arcana === "Major Arcana")
      .map((card) => [card.sortOrder, card])
  );

  return page.cardSummaries.map((summary) => {
    const card = records.get(summary.sortOrder);
    return card ? {
      ...summary,
      id: card.id,
      slug: card.slug,
      title: card.title,
      displayNumber: card.displayNumber,
      route: getCardRoute(card),
      image: card.variants.veilrise.image,
      bloodMoonImage: card.variants.veilfall.image,
      imageAlt: `${card.title} card from the Veilrise Arcana tarot deck`,
      bloodMoonImageAlt: `${card.title} card from the Veilfall Arcana tarot deck`,
      imageWidth: 1024,
      imageHeight: 1536
    } : null;
  });
}

export function validateMajorArcanaData(page, tarotCards, { rootDir, checkGenerated = false } = {}) {
  const errors = [];
  const requireText = (label, value) => {
    if (!hasText(value)) errors.push(`${label}: required text is missing`);
  };

  [
    ["page.id", page?.id],
    ["page.slug", page?.slug],
    ["page.route", page?.route],
    ["page.breadcrumbLabel", page?.breadcrumbLabel],
    ["seo.title", page?.seo?.title],
    ["seo.description", page?.seo?.description],
    ["seo.ogTitle", page?.seo?.ogTitle],
    ["seo.ogDescription", page?.seo?.ogDescription],
    ["seo.lastModified", page?.seo?.lastModified],
    ["hero.eyebrow", page?.hero?.eyebrow],
    ["hero.title", page?.hero?.title],
    ["hero.ctaLabel", page?.hero?.ctaLabel],
    ["hero.ctaTarget", page?.hero?.ctaTarget]
  ].forEach(([label, value]) => requireText(label, value));

  if (getMajorArcanaRoute(page) !== page?.route) {
    errors.push("page.route: expected canonical /tarot/major-arcana/");
  }
  requireImage(errors, rootDir, "hero.image", page?.hero?.image);
  requireImage(errors, rootDir, "closingCta.image", page?.closingCta?.image, { decorative: true });
  requireImage(errors, rootDir, "readings.example.cardBack", page?.readings?.example?.cardBack, { decorative: true });

  const cards = buildMajorArcanaCards(page, tarotCards);
  if (!Array.isArray(page?.cardSummaries) || page.cardSummaries.length !== 22) {
    errors.push("cardSummaries: expected all 22 Major Arcana summaries");
  }
  if (cards.some((card) => !card)) {
    errors.push("cardSummaries: one or more summaries do not map to existing Major Arcana card data");
  }
  const order = page?.cardSummaries?.map((item) => item.sortOrder) || [];
  if (order.join(",") !== Array.from({ length: 22 }, (_, index) => index).join(",")) {
    errors.push("cardSummaries: expected canonical order from 0 through 21");
  }
  page?.cardSummaries?.forEach((item, index) => {
    if (!Array.isArray(item?.keywords) || item.keywords.length !== 3 || item.keywords.some((keyword) => !hasText(keyword))) {
      errors.push(`cardSummaries[${index}].keywords: exactly three keywords are required`);
    }
    requireText(`cardSummaries[${index}].summary`, item?.summary);
  });

  [
    ["overview", page?.overview],
    ["journey", page?.journey],
    ["orientation", page?.orientation],
    ["readings", page?.readings],
    ["comparison", page?.comparison],
    ["faq", page?.faq]
  ].forEach(([label, section]) => {
    requireText(`${label}.id`, section?.id);
    requireText(`${label}.heading`, section?.heading);
  });

  if (!Array.isArray(page?.overview?.paragraphs) || page.overview.paragraphs.length !== 3) {
    errors.push("overview.paragraphs: expected three educational paragraphs");
  }
  if (
    !Array.isArray(page?.overview?.highlights) ||
    page.overview.highlights.length !== 5 ||
    page.overview.highlights.some((highlight) => !hasText(highlight))
  ) {
    errors.push("overview.highlights: expected five preserved editorial highlights");
  } else {
    const overviewCopy = page.overview.paragraphs?.join(" ") || "";
    page.overview.highlights.forEach((highlight) => {
      if (!overviewCopy.includes(highlight)) {
        errors.push(`overview.highlights: "${highlight}" must remain part of the preserved copy`);
      }
    });
  }
  if (!Array.isArray(page?.overview?.concepts) || page.overview.concepts.length !== 3) {
    errors.push("overview.concepts: expected three concepts");
  } else {
    page.overview.concepts.forEach((concept, index) => {
      ["number", "title", "copy", "route"].forEach((key) => requireText(`overview.concepts[${index}].${key}`, concept?.[key]));
      requireImage(errors, rootDir, `overview.concepts[${index}].image`, concept?.image);
      requireImage(errors, rootDir, `overview.concepts[${index}].image.bloodMoon`, {
        src: concept?.image?.bloodMoonSrc,
        width: concept?.image?.width,
        height: concept?.image?.height,
        alt: concept?.image?.bloodMoonAlt
      });
    });
  }
  if (!Array.isArray(page?.journey?.chapters) || page.journey.chapters.length !== 3) {
    errors.push("journey.chapters: expected three chapters");
  } else {
    page.journey.chapters.forEach((chapter, index) => {
      [
        ["id", chapter.id],
        ["number", chapter.number],
        ["range", chapter.range],
        ["title", chapter.title],
        ["cards", chapter.cards],
        ["centralLesson", chapter.centralLesson],
        ["inReading", chapter.inReading]
      ].forEach(([label, value]) => requireText(`journey.chapters[${index}].${label}`, value));
      if (!Array.isArray(chapter.preview) || chapter.preview.length !== 2 || chapter.preview.some((paragraph) => !hasText(paragraph))) {
        errors.push(`journey.chapters[${index}].preview: expected two preview paragraphs`);
      }
      if (!Array.isArray(chapter.themes) || chapter.themes.length !== 4 || chapter.themes.some((theme) => !hasText(theme))) {
        errors.push(`journey.chapters[${index}].themes: expected four theme labels`);
      }
      if (!Array.isArray(chapter.story) || chapter.story.length < 2 || chapter.story.some((paragraph) => !hasText(paragraph))) {
        errors.push(`journey.chapters[${index}].story: expected a multi-paragraph chapter narrative`);
      }
      if (
        !Array.isArray(chapter.cardSortOrders) ||
        !Array.isArray(chapter.cardRoles) ||
        chapter.cardSortOrders.length !== chapter.cardRoles.length ||
        chapter.cardSortOrders.some((sortOrder) => !Number.isInteger(sortOrder)) ||
        chapter.cardRoles.some((role) => !hasText(role))
      ) {
        errors.push(`journey.chapters[${index}]: card progression and roles must map one-to-one`);
      }
    });
    const journeyOrder = page.journey.chapters.flatMap((chapter) => chapter.cardSortOrders || []);
    if (journeyOrder.join(",") !== Array.from({ length: 22 }, (_, index) => index).join(",")) {
      errors.push("journey.chapters: card progressions must cover the canonical sequence from 0 through 21");
    }
  }
  ["upright", "reversed"].forEach((orientation) => {
    const state = page?.orientation?.[orientation];
    ["label", "subtitle", "emblem", "copy"].forEach((key) => {
      requireText(`orientation.${orientation}.${key}`, state?.[key]);
    });
    if (!Array.isArray(state?.themes) || state.themes.length !== 4 || state.themes.some((theme) => !hasText(theme))) {
      errors.push(`orientation.${orientation}.themes: expected four interpretation markers`);
    }
  });
  ["major", "minor"].forEach((group) => {
    const comparison = page?.comparison?.[group];
    ["key", "eyebrow", "title", "number", "numberLabel", "supportingLabel", "copy"].forEach((key) => {
      requireText(`comparison.${group}.${key}`, comparison?.[key]);
    });
    if (!Array.isArray(comparison?.items) || comparison.items.length !== 5 || comparison.items.some((item) => !hasText(item))) {
      errors.push(`comparison.${group}.items: expected five preserved comparison points`);
    } else if (comparison.items[0] !== comparison.numberLabel) {
      errors.push(`comparison.${group}: visual count label must match the preserved first comparison point`);
    }
    if (!Array.isArray(comparison?.cardTitles) || comparison.cardTitles.length !== 4 || new Set(comparison.cardTitles).size !== 4) {
      errors.push(`comparison.${group}.cardTitles: expected four unique showcase cards`);
    } else {
      const showcaseCards = comparison.cardTitles.map((title) => tarotCards.find((card) => card.title === title));
      if (showcaseCards.some((card) => !card)) {
        errors.push(`comparison.${group}.cardTitles: one or more cards are missing from canonical tarot data`);
      } else {
        showcaseCards.forEach((card, index) => {
          if (card.arcana !== `${group[0].toUpperCase()}${group.slice(1)} Arcana`) {
            errors.push(`comparison.${group}.cardTitles[${index}]: card belongs to the wrong arcana`);
          }
          [card.variants?.veilrise?.image, card.variants?.veilfall?.image].forEach((image) => {
            if (!image || !existsSync(publicPathToFile(rootDir, image))) {
              errors.push(`comparison.${group}.cardTitles[${index}]: themed artwork is missing`);
            }
          });
        });
        if (group === "minor" && new Set(showcaseCards.map((card) => card.suit)).size !== 4) {
          errors.push("comparison.minor.cardTitles: showcase must represent all four suits");
        }
      }
    }
  });
  requireText("comparison.introduction", page?.comparison?.introduction);
  requireText("comparison.major.route", page?.comparison?.major?.route);
  requireText("comparison.major.routeLabel", page?.comparison?.major?.routeLabel);
  requireText("comparison.minor.route", page?.comparison?.minor?.route);
  requireText("comparison.minor.routeLabel", page?.comparison?.minor?.routeLabel);
  ["number", "numberLabel", "label"].forEach((key) => {
    requireText(`comparison.balance.${key}`, page?.comparison?.balance?.[key]);
  });
  if (!Array.isArray(page?.readings?.concepts) || page.readings.concepts.length !== 3) {
    errors.push("readings.concepts: expected three reading concepts");
  } else {
    page.readings.concepts.forEach((concept, index) => {
      ["number", "title", "copy"].forEach((key) => requireText(`readings.concepts[${index}].${key}`, concept?.[key]));
    });
  }
  requireText("readings.example.copy", page?.readings?.example?.copy);
  requireText("readings.example.note", page?.readings?.example?.note);
  if (!Array.isArray(page?.faq?.items) || page.faq.items.length !== 6) {
    errors.push("faq.items: expected six visible questions and answers");
  } else {
    page.faq.items.forEach((item, index) => {
      requireText(`faq.items[${index}].question`, item?.question);
      requireText(`faq.items[${index}].answer`, item?.answer);
    });
  }

  cards.filter(Boolean).forEach((card, index) => {
    requireText(`cards[${index}].route`, card.route);
    if (!existsSync(publicPathToFile(rootDir, card.route))) {
      errors.push(`cards[${index}].route: existing card route is missing at ${card.route}`);
    }
    if (!existsSync(publicPathToFile(rootDir, card.image))) {
      errors.push(`cards[${index}].image: asset is missing at ${card.image}`);
    }
    if (!existsSync(publicPathToFile(rootDir, card.bloodMoonImage))) {
      errors.push(`cards[${index}].bloodMoonImage: asset is missing at ${card.bloodMoonImage}`);
    }
  });

  if (checkGenerated && !existsSync(getMajorArcanaOutputPath(rootDir, page))) {
    errors.push("generated: Major Arcana page output is missing");
  }

  return errors;
}
