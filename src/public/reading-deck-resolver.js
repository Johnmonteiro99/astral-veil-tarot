const DECKS = {
  lumen: {
    key: 'lumen',
    name: 'Verdant',
    back: 'assets/images/cards/legacy/original/card-back.webp',
    cards: () => window.tarotDeck,
  },
  dreambound: {
    key: 'dreambound',
    name: 'Dreambound',
    back: 'assets/images/cards/legacy/dreamy/dreams_card_back.png',
    cards: () => window.dreamboundDeck?.cards,
  },
  moonveil: {
    key: 'moonveil',
    name: 'Moonveil',
    back: 'assets/images/cards/legacy/moonveil/moonveil_card_back.png',
    cards: () => window.moonveilDeck?.cards,
  },
  astralVeilTarot: {
    key: 'astralVeilTarot',
    name: 'Veilrise Arcana',
    back: 'assets/images/cards/astral-veil-tarot/back/back-deck.png',
    cards: () => window.astralVeilTarotDeck?.cards,
  },
  bloodMoon: {
    key: 'bloodMoon',
    name: 'Crimson Veil',
    back: 'assets/images/cards/legacy/blood-moon/bloodmoon-card-back.webp',
    cards: () => window.bloodMoonDeck?.cards,
  },
  astralVeilCrimson: {
    key: 'astralVeilCrimson',
    name: 'Veilfall Arcana',
    back: 'assets/images/cards/astral-veil-crimson/back/back-deck.png',
    cards: () => window.astralVeilCrimsonDeck?.cards,
  },
};

const DECK_KEY_ALIASES = new Map([
  ['verdant', 'lumen'],
  ['verdantarcana', 'lumen'],
  ['lumen', 'lumen'],
  ['dreambound', 'dreambound'],
  ['dreamboundarcana', 'dreambound'],
  ['moonveil', 'moonveil'],
  ['moonveilarcana', 'moonveil'],
  ['veilrise', 'astralVeilTarot'],
  ['veilrisearcana', 'astralVeilTarot'],
  ['astralveiltarot', 'astralVeilTarot'],
  ['veilfall', 'astralVeilCrimson'],
  ['veilfallarcana', 'astralVeilCrimson'],
  ['astralveilcrimson', 'astralVeilCrimson'],
  ['crimsonveil', 'bloodMoon'],
  ['bloodmoon', 'bloodMoon'],
]);

function compactDeckKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function normalizeReadingDeckKey(value) {
  return DECK_KEY_ALIASES.get(compactDeckKey(value)) || '';
}

export function getReadingDeckByKey(value) {
  return DECKS[normalizeReadingDeckKey(value)] || null;
}

export function getReadingDeckIdentity(reading) {
  const metadata = reading?.metadata && typeof reading.metadata === 'object' ? reading.metadata : {};
  const deck = metadata.deck && typeof metadata.deck === 'object' ? metadata.deck : {};
  const values = [
    reading?.deck_key,
    reading?.deck_id,
    deck.key,
    deck.id,
    reading?.deck_name,
    deck.name,
    deck.title,
  ];
  const key = values.map(normalizeReadingDeckKey).find(Boolean) || '';

  return key ? DECKS[key] : null;
}

function loadScript(src) {
  const existing = document.querySelector(`script[src="${src}"]`);

  if (existing) {
    if (existing.dataset.loaded === 'true') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', () => reject(new Error(`Unable to load ${src}.`)), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Unable to load ${src}.`)), { once: true });
    document.head.append(script);
  });
}

let deckDataPromise;

export function loadReadingDeckData() {
  if (window.tarotDeck && window.dreamboundDeck && window.moonveilDeck
    && window.bloodMoonDeck && window.astralVeilTarotDeck && window.astralVeilCrimsonDeck) {
    return Promise.resolve();
  }

  if (!deckDataPromise) {
    deckDataPromise = loadScript('data/cards.js')
      .then(() => loadScript('data/fullTarotCards.js'));
  }

  return deckDataPromise;
}

function normalizeCardLookupKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^blood[-_\s]*moon[-_\s]*/, '')
    .replace(/\b(reversed|upright)\b/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCardImageForReadingDeck(deck, card) {
  const cards = deck?.cards?.();
  const candidates = [card?.card_key, card?.originalCardId, card?.id, card?.key, card?.name, card?.title]
    .map(normalizeCardLookupKey)
    .filter(Boolean);

  if (!Array.isArray(cards) || !candidates.length) {
    return '';
  }

  const match = cards.find((deckCard) => [deckCard?.id, deckCard?.originalCardId, deckCard?.name]
    .map(normalizeCardLookupKey)
    .some((key) => candidates.includes(key)));

  return match?.image || '';
}
