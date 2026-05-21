// Structured spread data. Add future spreads here; renderers can stay count-driven.
const spreads = {
  oneCard: {
    count: 1,
    positions: ["Message"],
    combinedLabel: "The Message"
  },
  threeCard: {
    count: 3,
    positions: ["Past", "Present", "Future"],
    combinedLabel: "The Thread Between Them"
  },
  fiveCard: {
    count: 5,
    positions: ["Root", "Challenge", "Hidden Influence", "Guidance", "Outcome"],
    combinedLabel: "The Pattern Beneath the Reading"
  },
  sevenCard: {
    count: 7,
    positions: [
      "Opening Message",
      "Crossing Influence",
      "Hidden Root",
      "Present Energy",
      "Guidance",
      "Shadow",
      "Outcome"
    ],
    combinedLabel: "The Full Pattern"
  }
};

function getSpreadByCount(cardCount) {
  return Object.values(spreads).find((spread) => spread.count === Number(cardCount)) || null;
}
