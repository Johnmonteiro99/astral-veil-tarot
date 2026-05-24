// Hidden event registry. Add future timed events here before wiring UI.
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
    testing: {
      queryParams: ["bloodMoon", "testBloodMoon"],
      storageKey: "astralVeilTestBloodMoonActive"
    },
    navItems: [
      {
        label: "NOCTIS ARCHIVE",
        href: "archive.html"
      }
    ]
  }
};

// Future event support notes:
// - timed events can add startsAt, endsAt, and durationMinutes
// - event-specific themes can add bodyClass and themeLock
// - event-specific unlocks can add deck, archive, dialogue, or reader ids
// - event expiration can be handled by comparing stored activatedAt timestamps
