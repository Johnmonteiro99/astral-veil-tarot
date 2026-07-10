import { getSupabaseClient } from './supabase-client.js';

// Data access for the future full 78-card tarot system.
// This service is intentionally not wired into the current deck UI, reading
// logic, daily readings, or existing Major Arcana behavior yet. It uses the
// frontend-safe Supabase client only; RLS must decide which protected deck,
// image, meaning, and extras rows the current user may read.

function getClient() {
  return getSupabaseClient();
}

function sortDeckCardsByCatalogOrder(deckCards, tarotCards) {
  const orderByCardId = new Map(
    tarotCards.map((card) => [card.card_id || card.id, Number(card.global_order ?? 0)])
  );

  return [...deckCards].sort((left, right) => {
    const leftOrder = orderByCardId.get(left.card_id) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = orderByCardId.get(right.card_id) ?? Number.MAX_SAFE_INTEGER;

    return leftOrder - rightOrder;
  });
}

function attachCatalogCards(deckCards, tarotCards) {
  const catalogByCardId = new Map(tarotCards.map((card) => [card.card_id || card.id, card]));

  return deckCards.map((deckCard) => ({
    ...deckCard,
    tarot_card: catalogByCardId.get(deckCard.card_id) || null,
  }));
}

export async function getTarotCards() {
  const supabase = getClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('tarot_cards')
    .select('*')
    .order('global_order', { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}

export async function getTarotDecks() {
  const supabase = getClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('tarot_decks')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}

export async function getTarotDeckBySlug(deckSlug) {
  const supabase = getClient();

  if (!supabase || !deckSlug) {
    return null;
  }

  const { data, error } = await supabase
    .from('tarot_decks')
    .select('*')
    .eq('slug', deckSlug)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data || null;
}

export async function getTarotDeckCards(deckSlug) {
  const supabase = getClient();

  if (!supabase || !deckSlug) {
    return [];
  }

  const [{ data: deckCards, error: deckCardsError }, tarotCards] = await Promise.all([
    supabase
      .from('tarot_deck_cards')
      .select('*')
      .eq('deck_slug', deckSlug),
    getTarotCards(),
  ]);

  if (deckCardsError) {
    return [];
  }

  return attachCatalogCards(sortDeckCardsByCatalogOrder(deckCards || [], tarotCards), tarotCards);
}

export async function getTarotMeaningForCard(meaningSetId, cardId) {
  const supabase = getClient();

  if (!supabase || !meaningSetId || !cardId) {
    return null;
  }

  const { data, error } = await supabase
    .from('tarot_card_meanings')
    .select('*')
    .eq('meaning_set_id', meaningSetId)
    .eq('card_id', cardId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data || null;
}

export async function getTarotDeckCardExtras(deckSlug, cardId) {
  const supabase = getClient();

  if (!supabase || !deckSlug || !cardId) {
    return null;
  }

  const { data, error } = await supabase
    .from('tarot_deck_card_extras')
    .select('*')
    .eq('deck_slug', deckSlug)
    .eq('card_id', cardId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data || null;
}

export async function getResolvedTarotCard(deckSlug, cardId) {
  if (!deckSlug || !cardId) {
    return null;
  }

  const [deck, tarotCards, deckCards] = await Promise.all([
    getTarotDeckBySlug(deckSlug),
    getTarotCards(),
    getTarotDeckCards(deckSlug),
  ]);

  const tarotCard = tarotCards.find((card) => (card.card_id || card.id) === cardId) || null;
  const deckCard = deckCards.find((card) => card.card_id === cardId) || null;

  if (!deck || !tarotCard || !deckCard) {
    return null;
  }

  const [meaning, extras] = await Promise.all([
    getTarotMeaningForCard(deck.meaning_set_id, cardId),
    getTarotDeckCardExtras(deckSlug, cardId),
  ]);

  return {
    deck,
    deckCard,
    tarotCard,
    meaning,
    extras,
  };
}

