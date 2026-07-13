import { TAROT_CARD_CATALOG } from "./tarotCardCatalog.js";
import { PUBLIC_TAROT_DECKS } from "./publicTarotDecks.js";

export const getTarotCardById = (cardId) =>
  TAROT_CARD_CATALOG.find((card) => card.id === cardId) || null;

export const getPublicTarotDeckById = (deckId) =>
  PUBLIC_TAROT_DECKS.find((deck) => deck.id === deckId) || null;

export const getPublicTarotDeckBySlug = (slug) =>
  PUBLIC_TAROT_DECKS.find((deck) => deck.slug === slug) || null;

export const getPublicTarotDecks = () => PUBLIC_TAROT_DECKS.filter((deck) => deck.isPublic);

export const getPublicDeckCardImagePath = (deckId, cardId) => {
  const deck = getPublicTarotDeckById(deckId);
  const card = getTarotCardById(cardId);

  if (!deck?.isPublic || !deck.publicAssetBasePath || !card) {
    return null;
  }

  const folder = card.suit || "major";
  const fileNumber = String(card.number).padStart(2, "0");

  return `${deck.publicAssetBasePath}${folder}/${fileNumber}-${card.slug}.png`;
};

