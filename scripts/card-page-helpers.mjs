import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";

export const SITE_ORIGIN = "https://astralveil.world";
export const TAROT_SUIT_ORDER = ["wands", "cups", "swords", "pentacles"];
export const TAROT_RANK_ORDER = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"];

export const CARD_SYSTEMS = {
  tarot: {
    routeBase: "/tarot",
    totalCards: 78
  },
  lenormand: {
    routeBase: "/lenormand",
    totalCards: 36
  }
};

const categoryKeys = ["love", "career", "feelings", "advice", "spiritual"];
const sharedMeaningFields = ["archetypalMessage", "uprightMeaning", "reversedMeaning", "shadowMeaning", "reflection", "traditionalMeaning"];

export function getCardRoute(card) {
  const system = CARD_SYSTEMS[card?.system];
  return system && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(card?.slug || ""))
    ? `${system.routeBase}/${card.slug}/`
    : "";
}

export function getCardOutputPath(rootDir, card) {
  const route = getCardRoute(card);
  if (!route) {
    return "";
  }
  return resolve(rootDir, route.replace(/^\/+|\/+$/g, ""), "index.html");
}

export function sortCardDetails(cards) {
  return [...cards].sort((first, second) => (
    String(first.system).localeCompare(String(second.system))
    || Number(first.sortOrder) - Number(second.sortOrder)
  ));
}

export function buildPageCards(cards) {
  const orderedCards = sortCardDetails(cards);

  return orderedCards.map((card) => {
    const sameSystem = orderedCards.filter((candidate) => candidate.system === card.system);
    const systemIndex = sameSystem.findIndex((candidate) => candidate.id === card.id);
    const previousCard = sameSystem[systemIndex - 1] || null;
    const nextCard = sameSystem[systemIndex + 1] || null;
    const makeDestination = (destination) => destination ? {
      id: destination.id,
      slug: destination.slug,
      title: destination.title,
      route: getCardRoute(destination),
      available: true
    } : null;

    return {
      ...card,
      route: getCardRoute(card),
      index: Number(card.sortOrder) + 1,
      total: CARD_SYSTEMS[card.system]?.totalCards || sameSystem.length,
      previous: makeDestination(previousCard),
      next: makeDestination(nextCard)
    };
  });
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function serializeForInlineScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function getExpectedTarotSortOrder(card) {
  if (card.arcana === "Major Arcana") {
    return Number(card.sortOrder) >= 0 && Number(card.sortOrder) <= 21
      ? Number(card.sortOrder)
      : null;
  }

  const suitIndex = TAROT_SUIT_ORDER.indexOf(String(card.suit || "").toLowerCase());
  const rankIndex = TAROT_RANK_ORDER.indexOf(String(card.rank || "").toLowerCase());
  return suitIndex >= 0 && rankIndex >= 0 ? 22 + (suitIndex * 14) + rankIndex : null;
}

function hasText(value) {
  return typeof value === "string" && Boolean(value.trim());
}

function hasTwoPrompts(value) {
  return Array.isArray(value) && value.length >= 2 && value.slice(0, 2).every(hasText);
}

function getEffectiveVariantValue(card, variantKey, field) {
  return card.variants?.[variantKey]?.[field]
    ?? card.variants?.veilrise?.[field]
    ?? card[field]
    ?? "";
}

function getEffectivePrompts(card, variantKey) {
  const selected = card.variants?.[variantKey]?.reflectionPrompts;
  const veilrise = card.variants?.veilrise?.reflectionPrompts;
  const legacy = card.reflectionPrompts;
  return [0, 1].map((index) => selected?.[index] ?? veilrise?.[index] ?? legacy?.[index] ?? "");
}

function validateGeneratedPage(card, rootDir, errors) {
  const outputPath = getCardOutputPath(rootDir, card);
  if (!outputPath || !existsSync(outputPath)) {
    errors.push(`${card.id}.route: generated page is missing at ${outputPath || "an invalid output path"}`);
    return;
  }

  const html = readFileSync(outputPath, "utf8");
  const canonical = `${SITE_ORIGIN}${card.route}`;
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    errors.push(`${card.id}.seo.canonical: generated page does not contain ${canonical}`);
  }
  if (!html.includes(`"id":"${card.id}"`)) {
    errors.push(`${card.id}.embeddedData: generated page does not contain the matching card record`);
  }
}

export function validateCardData(cards, { rootDir, checkGenerated = false } = {}) {
  const errors = [];
  const warnings = [];
  const ids = new Set();
  const slugs = new Set();
  const sortOrdersBySystem = new Map();

  if (!Array.isArray(cards) || !cards.length) {
    return { errors: ["cards: no card detail records were provided"], warnings };
  }

  cards.forEach((card, cardIndex) => {
    const label = hasText(card?.id) ? card.id : `card[${cardIndex}]`;
    const requireText = (field, value = card?.[field]) => {
      if (!hasText(value)) {
        errors.push(`${label}.${field}: required text is missing`);
      }
    };

    requireText("id");
    requireText("system");
    requireText("slug");
    requireText("title");
    requireText("displayNumber");
    if (!Number.isInteger(card?.sortOrder) || card.sortOrder < 0) {
      errors.push(`${label}.sortOrder: expected a non-negative integer`);
    }
    if (!CARD_SYSTEMS[card?.system]) {
      errors.push(`${label}.system: unsupported card system "${card?.system || ""}"`);
    }
    if (ids.has(card?.id)) {
      errors.push(`${label}.id: duplicate ID "${card.id}"`);
    }
    if (slugs.has(card?.slug)) {
      errors.push(`${label}.slug: duplicate slug "${card.slug}"`);
    }
    ids.add(card?.id);
    slugs.add(card?.slug);

    const systemOrders = sortOrdersBySystem.get(card?.system) || new Set();
    if (systemOrders.has(card?.sortOrder)) {
      errors.push(`${label}.sortOrder: duplicate order ${card.sortOrder} in ${card.system}`);
    }
    systemOrders.add(card?.sortOrder);
    sortOrdersBySystem.set(card?.system, systemOrders);

    if (card?.system === "tarot") {
      const expectedSortOrder = getExpectedTarotSortOrder(card);
      if (expectedSortOrder === null || expectedSortOrder !== card.sortOrder) {
        errors.push(`${label}.sortOrder: does not match canonical Major/Wands/Cups/Swords/Pentacles ordering`);
      }
    }

    const route = getCardRoute(card);
    if (!route || !/^\/(tarot|lenormand)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(route)) {
      errors.push(`${label}.route: invalid generated route "${route}"`);
    }

    sharedMeaningFields.forEach((field) => requireText(field));
    if (!Array.isArray(card?.keywords) || card.keywords.length < 3 || card.keywords.some((keyword) => !hasText(keyword))) {
      errors.push(`${label}.keywords: expected at least three non-empty keywords`);
    }
    if (!Array.isArray(card?.correspondences) || !card.correspondences.length || card.correspondences.some((item) => !hasText(item?.label) || !hasText(item?.value))) {
      errors.push(`${label}.correspondences: labels and values are required`);
    }
    if (!Array.isArray(card?.identity) || !card.identity.length || card.identity.some((item) => !hasText(item?.label) || !hasText(item?.value))) {
      errors.push(`${label}.identity: labels and values are required`);
    }

    categoryKeys.forEach((category) => {
      ["upright", "reversed"].forEach((orientation) => {
        if (!hasText(card?.categories?.[category]?.[orientation])) {
          errors.push(`${label}.categories.${category}.${orientation}: interpretation is missing`);
        }
      });
    });

    ["veilrise", "veilfall"].forEach((variantKey) => {
      const variant = card?.variants?.[variantKey];
      if (!variant) {
        errors.push(`${label}.variants.${variantKey}: variant is missing`);
        return;
      }
      ["deckId", "deckName", "image"].forEach((field) => {
        if (!hasText(variant[field])) {
          errors.push(`${label}.variants.${variantKey}.${field}: required value is missing`);
        }
      });

      const imagePath = String(variant.image || "");
      if (!/^\/assets\/images\/[A-Za-z0-9_/% .-]+\.(png|jpe?g|webp)$/i.test(imagePath) || imagePath.includes("..")) {
        errors.push(`${label}.variants.${variantKey}.image: invalid image path "${imagePath}"`);
      } else if (rootDir) {
        const absoluteImagePath = resolve(rootDir, imagePath.replace(/^\/+/, ""));
        const safeRoot = `${resolve(rootDir)}${sep}`;
        if (!absoluteImagePath.startsWith(safeRoot) || !existsSync(absoluteImagePath) || !statSync(absoluteImagePath).isFile()) {
          errors.push(`${label}.variants.${variantKey}.image: asset does not exist at ${imagePath}`);
        }
      }

      ["subtitle", "astralVeilMeaning"].forEach((field) => {
        if (!hasText(getEffectiveVariantValue(card, variantKey, field))) {
          errors.push(`${label}.variants.${variantKey}.${field}: no variant or Veilrise fallback text is available`);
        }
      });
      if (!hasTwoPrompts(getEffectivePrompts(card, variantKey))) {
        errors.push(`${label}.variants.${variantKey}.reflectionPrompts: two prompts or Veilrise fallbacks are required`);
      }
    });

    if (!Array.isArray(card?.commonQuestions) || !card.commonQuestions.length) {
      errors.push(`${label}.commonQuestions: at least one FAQ item is required`);
    } else {
      card.commonQuestions.forEach((item, faqIndex) => {
        if (!hasText(item?.question) || !hasText(item?.answer)) {
          errors.push(`${label}.commonQuestions[${faqIndex}]: question and answer are required`);
        }
      });
    }

    ["title", "description", "twitterDescription", "lastModified"].forEach((field) => {
      if (!hasText(card?.seo?.[field])) {
        errors.push(`${label}.seo.${field}: required SEO value is missing`);
      }
    });

    if (card?.contentStatus === "temporary-structural-test") {
      if (!Array.isArray(card.temporaryFields) || !card.temporaryFields.length) {
        errors.push(`${label}.temporaryFields: temporary test records must declare replacement fields`);
      } else {
        warnings.push(`${label}: temporary structural test content (${card.temporaryFields.length} fields require replacement)`);
      }
    }
  });

  const pageCards = buildPageCards(cards);
  pageCards.forEach((card, index) => {
    const previous = pageCards[index - 1];
    const next = pageCards[index + 1];
    if (card.previous && (!previous || previous.id !== card.previous.id || previous.system !== card.system)) {
      errors.push(`${card.id}.previous: navigation does not match canonical order`);
    }
    if (card.next && (!next || next.id !== card.next.id || next.system !== card.system)) {
      errors.push(`${card.id}.next: navigation does not match canonical order`);
    }
    if (checkGenerated && rootDir) {
      validateGeneratedPage(card, rootDir, errors);
    }
  });

  return { errors, warnings, cards: pageCards };
}
