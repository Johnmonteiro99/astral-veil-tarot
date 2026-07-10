// Static full-deck data for the new 78-card Astral Veil decks.
// Existing Major Arcana meanings stay sourced from data/cards.js.
(function () {
  const minorSuits = ["cups", "wands", "pentacles", "swords"];
  const minorRanks = [
    { rank: "ace", title: "Ace", number: 1 },
    { rank: "two", title: "Two", number: 2 },
    { rank: "three", title: "Three", number: 3 },
    { rank: "four", title: "Four", number: 4 },
    { rank: "five", title: "Five", number: 5 },
    { rank: "six", title: "Six", number: 6 },
    { rank: "seven", title: "Seven", number: 7 },
    { rank: "eight", title: "Eight", number: 8 },
    { rank: "nine", title: "Nine", number: 9 },
    { rank: "ten", title: "Ten", number: 10 },
    { rank: "page", title: "Page", number: 11 },
    { rank: "knight", title: "Knight", number: 12 },
    { rank: "queen", title: "Queen", number: 13 },
    { rank: "king", title: "King", number: 14 }
  ];

  const deckRoots = {
    tarot: "assets/images/cards/astral-veil-tarot",
    crimson: "assets/images/cards/astral-veil-crimson"
  };

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function getMajorFilename(card) {
    return `${String(card.number).padStart(2, "0")}-${slugify(card.name)}.png`;
  }

  function getMinorFilename(rank, suit) {
    return `${String(rank.number).padStart(2, "0")}-${rank.rank}-of-${suit}.png`;
  }

  function getNormalizedMajorCard(card) {
    return typeof withOrientationMeanings === "function"
      ? withOrientationMeanings(card)
      : card;
  }

  const astralVeilTarotMajorCards = majorArcanaCards.map((card) => {
    const clonedCard = cloneData(getNormalizedMajorCard(card));

    return {
      ...clonedCard,
      image: `${deckRoots.tarot}/major/${getMajorFilename(card)}`,
      meaning: clonedCard.shortMeaning
    };
  });

  const astralVeilCrimsonMajorCards = majorArcanaCards.map((card) => {
    const clonedCard = cloneData(getNormalizedMajorCard(card));

    return {
      ...clonedCard,
      id: `astral-veil-crimson-${card.id}`,
      originalCardId: card.id,
      image: `${deckRoots.crimson}/major/${getMajorFilename(card)}`,
      meaning: clonedCard.bloodMoon?.shortMeaning || clonedCard.shortMeaning,
      isBloodMoonCard: true
    };
  });

  function createMinorMeaning({ title, isCrimson }) {
    const placeholder = "Meaning coming soon.";
    const reflection = "Reflection coming soon.";

    return {
      upright: {
        headline: placeholder,
        summary: placeholder,
        meaning: placeholder,
        reflection,
        shadow: placeholder,
        mask: isCrimson ? placeholder : "",
        wound: isCrimson ? placeholder : "",
        work: isCrimson ? placeholder : "",
        veilHint: reflection,
        thread: placeholder,
        keywords: placeholder
      },
      reversed: {
        headline: placeholder,
        summary: placeholder,
        meaning: placeholder,
        reflection,
        shadow: placeholder,
        mask: isCrimson ? placeholder : "",
        wound: isCrimson ? placeholder : "",
        work: isCrimson ? placeholder : "",
        veilHint: reflection,
        thread: placeholder
      },
      bloodMoon: {
        shortMeaning: placeholder,
        summary: placeholder,
        shadowMessage: placeholder,
        veilHint: reflection,
        upright: {
          headline: placeholder,
          summary: placeholder,
          meaning: placeholder,
          shadow: placeholder,
          reflection,
          mask: placeholder,
          wound: placeholder,
          work: placeholder,
          veilHint: reflection,
          thread: placeholder
        },
        reversed: {
          headline: placeholder,
          summary: placeholder,
          meaning: placeholder,
          shadow: placeholder,
          reflection,
          mask: placeholder,
          wound: placeholder,
          work: placeholder,
          veilHint: reflection,
          thread: placeholder
        }
      }
    };
  }

  function createMinorCard(suit, rank, { isCrimson = false } = {}) {
    const suitTitle = suit.charAt(0).toUpperCase() + suit.slice(1);
    const name = `${rank.title} of ${suitTitle}`;
    const id = `${suit}-${String(rank.number).padStart(2, "0")}-${slugify(name)}`;
    const root = isCrimson ? deckRoots.crimson : deckRoots.tarot;
    const meaning = createMinorMeaning({ title: name, isCrimson });

    return {
      id: isCrimson ? `astral-veil-crimson-${id}` : id,
      originalCardId: id,
      number: rank.number,
      name,
      keywords: ["meaning coming soon"],
      shortMeaning: "Meaning coming soon.",
      summary: "Meaning coming soon.",
      uprightMeaning: "Meaning coming soon.",
      shadowMeaning: "Meaning coming soon.",
      reflectionQuestion: "Reflection coming soon.",
      themes: [suit, rank.rank],
      archetype: name,
      energy: "neutral",
      image: `${root}/${suit}/${getMinorFilename(rank, suit)}`,
      upright: meaning.upright,
      reversed: meaning.reversed,
      bloodMoon: meaning.bloodMoon,
      isBloodMoonCard: isCrimson
    };
  }

  const astralVeilTarotMinorCards = minorSuits.flatMap((suit) =>
    minorRanks.map((rank) => createMinorCard(suit, rank))
  );

  const astralVeilCrimsonMinorCards = minorSuits.flatMap((suit) =>
    minorRanks.map((rank) => createMinorCard(suit, rank, { isCrimson: true }))
  );

  const astralVeilTarotCards = [
    ...astralVeilTarotMajorCards,
    ...astralVeilTarotMinorCards
  ];

  const astralVeilCrimsonCards = [
    ...astralVeilCrimsonMajorCards,
    ...astralVeilCrimsonMinorCards
  ];

  const astralVeilTarotDeck = {
    id: "astralVeilTarot",
    name: "Astral Veil Tarot",
    cards: astralVeilTarotCards
  };

  const astralVeilCrimsonDeck = {
    id: "astralVeilCrimson",
    name: "Astral Veil Crimson",
    cards: astralVeilCrimsonCards
  };

  if (typeof window !== "undefined") {
    window.astralVeilTarotCards = astralVeilTarotCards;
    window.astralVeilCrimsonCards = astralVeilCrimsonCards;
    window.astralVeilTarotDeck = astralVeilTarotDeck;
    window.astralVeilCrimsonDeck = astralVeilCrimsonDeck;
  }
})();
