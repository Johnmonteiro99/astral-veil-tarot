import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getCardRoute } from "./card-page-helpers.mjs";

const suitOrder = ["Wands", "Cups", "Swords", "Pentacles"];
const rankOrder = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function publicPathToFile(rootDir, publicPath) {
  return resolve(rootDir, decodeURIComponent(publicPath).replace(/^\/+/, ""));
}

export function getMinorArcanaRoute(page) {
  return page?.slug === "minor-arcana" ? "/tarot/minor-arcana/" : "";
}

export function getMinorArcanaOutputPath(rootDir, page) {
  const route = getMinorArcanaRoute(page);
  return route ? resolve(rootDir, route.replace(/^\/+/, ""), "index.html") : "";
}

export function buildMinorArcanaCards(page, tarotCards) {
  return tarotCards
    .filter((card) => card.arcana === "Minor Arcana")
    .sort((left, right) => {
      const suitDifference = suitOrder.indexOf(left.suit) - suitOrder.indexOf(right.suit);
      return suitDifference || rankOrder.indexOf(left.rank) - rankOrder.indexOf(right.rank);
    })
    .map((card, index) => ({
      id: card.id,
      title: card.title,
      suit: card.suit,
      suitKey: card.suit.toLowerCase(),
      rank: card.rank,
      rankKey: card.rank.toLowerCase(),
      displayNumber: card.displayNumber,
      sortOrder: card.sortOrder,
      index,
      keywords: card.keywords.slice(0, 3),
      summary: card.description,
      route: getCardRoute(card),
      image: card.variants.veilrise.image,
      imageAlt: card.variants.veilrise.imageAlt,
      bloodMoonImage: card.variants.veilfall.image,
      bloodMoonImageAlt: card.variants.veilfall.imageAlt,
      imageWidth: 1024,
      imageHeight: 1536
    }));
}

export function validateMinorArcanaData(page, tarotCards, { rootDir, checkGenerated = false } = {}) {
  const errors = [];
  const requireText = (label, value) => {
    if (!hasText(value)) errors.push(`${label}: expected non-empty text`);
  };
  const requireArray = (label, value, length) => {
    if (!Array.isArray(value) || value.length !== length) errors.push(`${label}: expected ${length} items`);
  };

  if (getMinorArcanaRoute(page) !== "/tarot/minor-arcana/") {
    errors.push("page.route: expected canonical /tarot/minor-arcana/");
  }
  ["title", "description", "ogTitle", "ogDescription", "lastModified"].forEach((key) => requireText(`seo.${key}`, page?.seo?.[key]));
  ["eyebrow", "title", "ctaLabel", "ctaTarget"].forEach((key) => requireText(`hero.${key}`, page?.hero?.[key]));
  requireArray("hero.paragraphs", page?.hero?.paragraphs, 2);
  requireArray("hero.facts", page?.hero?.facts, 4);
  ["src", "alt"].forEach((key) => requireText(`hero.image.${key}`, page?.hero?.image?.[key]));

  const cards = buildMinorArcanaCards(page, tarotCards);
  if (cards.length !== 56) errors.push(`cards: expected 56 Minor Arcana records, found ${cards.length}`);
  suitOrder.forEach((suit) => {
    const suitCards = cards.filter((card) => card.suit === suit);
    if (suitCards.length !== 14) errors.push(`cards.${suit}: expected 14 cards`);
    if (suitCards.map((card) => card.rank).join("|") !== rankOrder.join("|")) {
      errors.push(`cards.${suit}: expected Ace through Ten, Page, Knight, Queen, and King`);
    }
  });
  cards.forEach((card) => {
    if (!card.route || (rootDir && checkGenerated && !existsSync(resolve(rootDir, card.route.replace(/^\/+/, ""), "index.html")))) {
      errors.push(`cards.${card.id}: live card route is missing`);
    }
    if (rootDir) {
      [card.image, card.bloodMoonImage].forEach((image) => {
        if (!existsSync(publicPathToFile(rootDir, image))) errors.push(`cards.${card.id}: artwork is missing (${image})`);
      });
    }
  });

  requireArray("overview.paragraphs", page?.overview?.paragraphs, 4);
  requireArray("overview.concepts", page?.overview?.concepts, 3);
  page?.overview?.concepts?.forEach((concept, index) => {
    ["number", "title", "copy", "route"].forEach((key) => requireText(`overview.concepts[${index}].${key}`, concept?.[key]));
    ["src", "alt", "bloodMoonSrc", "bloodMoonAlt"].forEach((key) => requireText(`overview.concepts[${index}].image.${key}`, concept?.image?.[key]));
    if (rootDir) {
      [concept?.image?.src, concept?.image?.bloodMoonSrc].filter(Boolean).forEach((image) => {
        if (!existsSync(publicPathToFile(rootDir, image))) errors.push(`overview.concepts[${index}]: artwork is missing`);
      });
    }
  });

  requireArray("suits.items", page?.suits?.items, 4);
  page?.suits?.items?.forEach((suit, index) => {
    ["key", "name", "element", "progression"].forEach((key) => requireText(`suits.items[${index}].${key}`, suit?.[key]));
    requireArray(`suits.items[${index}].themes`, suit?.themes, 4);
    requireArray(`suits.items[${index}].paragraphs`, suit?.paragraphs, 2);
    requireArray(`suits.items[${index}].representativeCards`, suit?.representativeCards, 4);
  });

  requireArray("numbers.items", page?.numbers?.items, 10);
  page?.numbers?.items?.forEach((number, index) => {
    ["key", "label", "pattern"].forEach((key) => requireText(`numbers.items[${index}].${key}`, number?.[key]));
    suitOrder.forEach((suit) => requireText(`numbers.items[${index}].readings.${suit}`, number?.readings?.[suit]));
  });

  requireArray("courts.ranks", page?.courts?.ranks, 4);
  requireArray("courts.suits", page?.courts?.suits, 4);
  page?.courts?.ranks?.forEach((rank, index) => {
    ["key", "name", "themes", "copy"].forEach((key) => requireText(`courts.ranks[${index}].${key}`, rank?.[key]));
  });

  ["upright", "reversed"].forEach((orientation) => {
    const state = page?.orientation?.[orientation];
    ["label", "subtitle", "emblem", "copy"].forEach((key) => requireText(`orientation.${orientation}.${key}`, state?.[key]));
    requireArray(`orientation.${orientation}.themes`, state?.themes, 4);
  });
  requireArray("readings.concepts", page?.readings?.concepts, 3);
  requireArray("readings.example.cardTitles", page?.readings?.example?.cardTitles, 3);
  requireArray("comparison.major.cardTitles", page?.comparison?.major?.cardTitles, 4);
  requireArray("comparison.minor.cardTitles", page?.comparison?.minor?.cardTitles, 4);
  requireArray("faq.items", page?.faq?.items, 7);
  requireArray("closingCta.actions", page?.closingCta?.actions, 3);

  return errors;
}

