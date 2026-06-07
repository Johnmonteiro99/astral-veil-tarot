// Deck collection metadata. Add future free, event, premium, purchased, or comingSoon decks here.
// A future shop/admin layer can hydrate price, isPurchased, and unlockCondition without changing deck rendering.
const deckCollections = [
  {
    id: "original",
    title: "Original Deck",
    name: "Original Deck",
    subtitle: "The first Astral Veil Major Arcana collection.",
    accessType: "free",
    status: "Available",
    actionLabel: "View Deck",
    eyebrow: "Major Arcana",
    viewTitle: "The Astral Deck",
    viewDescription:
      "Browse the Major Arcana used in Astral Veil readings, now expanded with reflective meanings, shadows, and questions.",
    coverImage: "assets/images/cards/original/card-back.webp",
    imagePath: "assets/images/cards/original/",
    cards: () => tarotDeck
  },
  {
    id: "bloodMoon",
    title: "Blood Moon Deck",
    name: "Blood Moon Deck",
    subtitle: "Revealed beneath a crimson eclipse or within your Astral Veil account.",
    accessType: "event",
    requiredEvent: "bloodMoon",
    status: "locked",
    lockedStatus: "Locked",
    unlockedStatus: "Event Unlocked",
    lockedActionLabel: "Locked",
    actionLabel: "View Deck",
    lockedMessage: "This deck sleeps beneath the Blood Moon.",
    eyebrow: "Blood Moon Arcana",
    viewTitle: "Blood Moon Deck",
    viewDescription: "A crimson Major Arcana collection available to signed-in Veilwalkers or when Blood Moon is awake.",
    coverImage: "assets/images/cards/blood-moon/bloodmoon-card-back.webp",
    imagePath: "assets/images/cards/blood-moon/",
    unlockCondition: "Blood Moon event active",
    price: null,
    isPurchased: false,
    cards: () => bloodMoonDeck.cards
  }
];
