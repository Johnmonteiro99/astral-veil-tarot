// Hidden event registry. Add future rare/timed events here before wiring UI.
// Later this can come from an admin dashboard or database without changing renderers.
const hiddenEvents = {
  bloodMoon: {
    id: "bloodMoon",
    name: "Blood Moon",
    storageKey: "astralVeilBloodMoonActive",
    storageType: "session",
    unlocks: ["bloodMoonDeck", "noctisArchive"],
    persistsUntilCleared: true,
    enabled: true,
    navItems: [
      {
        label: "Noctis Archive",
        href: "archive.html"
      }
    ]
  },
  thirteenthEntity: {
    id: "thirteenthEntity",
    name: "The Thirteenth Entity",
    chance: 0.00369,
    durationMinutes: 3,
    unlocks: [],
    enabled: false
  }
};

// Future event support notes:
// - timed events can add startsAt, endsAt, and durationMinutes
// - rare probability events can add chance and triggerContext
// - event-specific themes can add bodyClass and themeLock
// - event-specific unlocks can add deck, archive, dialogue, or reader ids
// - event expiration can be handled by comparing stored activatedAt timestamps
