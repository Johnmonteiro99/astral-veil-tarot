// Custom pair meanings can grow here over time. Future AI-generated readings can use
// these same themes, archetypes, and deck-specific fields as grounding context.
const majorArcanaOrder = majorArcanaCards.map((card) => card.id);

function normalizeCardId(card) {
  const rawId = typeof card === "string" ? card : card.originalCardId || card.id || "";

  return rawId.replace(/^blood-moon-/, "");
}

function getCardOrder(cardId) {
  const order = majorArcanaOrder.indexOf(cardId);

  return order === -1 ? Number.MAX_SAFE_INTEGER : order;
}

function getCardPairKey(firstCard, secondCard) {
  return [normalizeCardId(firstCard), normalizeCardId(secondCard)]
    .sort((firstId, secondId) => getCardOrder(firstId) - getCardOrder(secondId))
    .join("+");
}

const cardPairMeanings = {
  "the-fool+the-magician": {
    summary: "A new beginning becomes powerful when paired with intention. The Fool opens the path, while The Magician gives that path direction.",
    advice: "Do not only dream about the next step. Begin shaping it with focus.",
    bloodMoonSummary: "A threshold opens, but intention decides what follows you through it. Under the Blood Moon, possibility becomes a ritual."
  },
  "the-fool+the-moon": {
    summary: "A leap into the unknown is wrapped in uncertainty. Trust the call forward, but let intuition move more slowly than impulse.",
    advice: "Begin carefully. Not every fear is true, and not every path is fully lit yet.",
    bloodMoonSummary: "The path opens into mist, and the mist is watching. Under the Blood Moon, a beginning may also be an invitation from the Veil."
  },
  "the-high-priestess+the-moon": {
    summary: "Inner knowing meets the realm of dreams and hidden emotion. This pairing asks for quiet attention, symbolic listening, and patience with what is still unclear.",
    advice: "Let the truth rise through dreams, patterns, and instinct before you force a conclusion.",
    bloodMoonSummary: "The Oracle and the bleeding moon speak in the same forbidden language. Secrets are near, but they may arrive wearing myth, spirit, or nightmare."
  },
  "death+the-star": {
    summary: "An ending becomes the beginning of healing. Death clears what cannot continue, and The Star offers faith in the life that follows.",
    advice: "Let the old form end gently enough for hope to enter.",
    bloodMoonSummary: "A black gate opens beneath a strange surviving light. Under the Blood Moon, release becomes a crossing, and hope becomes a signal from beyond the known world."
  },
  "the-devil+the-moon": {
    summary: "Attachment and fear may be distorting the truth. This pair asks you to look at desire, anxiety, and illusion without letting them write the whole story.",
    advice: "Name the craving and question the fear. Clarity begins where secrecy loses power.",
    bloodMoonSummary: "The chain disappears into moonlit fog. Under the Blood Moon, hunger may be wearing a beloved face, and the shadow wants to remain unnamed."
  },
  "the-tower+judgement": {
    summary: "A disruption becomes a wake-up call. What falls now may be clearing the way for a more honest life.",
    advice: "Listen to what the collapse reveals before rushing to rebuild.",
    bloodMoonSummary: "The Veil cracks, and a summons sounds through the ruin. Under the Blood Moon, revelation becomes reckoning."
  },
  "judgement+the-world": {
    summary: "A calling reaches completion. The past is reviewed, integrated, and transformed into readiness for a new cycle.",
    advice: "Receive closure by answering what your life has been asking of you.",
    bloodMoonSummary: "The red summons becomes a final gate. Under the Blood Moon, the cycle closes with every shadow acknowledged."
  },
  "the-hanged-man+death": {
    summary: "Surrender leads to transformation. The pause is not empty; it prepares you to release what has already ended.",
    advice: "Stop bargaining with the change. Let stillness teach you what must be released.",
    bloodMoonSummary: "Suspended at the black gate, the soul learns what cannot cross. Under the Blood Moon, surrender is the key to the threshold."
  },
  "the-lovers+justice": {
    summary: "Choice and truth are inseparable here. A relationship, value, or decision asks for honesty, fairness, and alignment.",
    advice: "Choose from integrity, not pressure, fantasy, or fear of disappointing someone.",
    bloodMoonSummary: "A vow is weighed on crimson scales. Under the Blood Moon, desire must answer to truth before the Veil records the choice."
  },
  "the-tower+the-moon": {
    summary: "Illusion breaks suddenly. A fear, secret, or unstable story may be exposed so reality can be seen more clearly.",
    advice: "Do not cling to the old explanation if revelation has already begun.",
    bloodMoonSummary: "The false sky splits over the dream-path. Under the Blood Moon, hidden forces move through the crack, and denial can no longer protect the tower."
  }
};

function getSharedThemes(cards) {
  const themeCounts = cards
    .flatMap((card) => card.themes || [])
    .reduce((counts, theme) => {
      counts[theme] = (counts[theme] || 0) + 1;
      return counts;
    }, {});

  return Object.entries(themeCounts)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3)
    .map(([theme]) => theme);
}

function getPositionLabel(card, index, spread) {
  return spread?.positions?.[index] || `Card ${index + 1}`;
}

function getCardSummary(card, isBloodMoon) {
  return isBloodMoon && card.bloodMoon?.summary ? card.bloodMoon.summary : card.summary;
}

function createSingleCardReading(card, isBloodMoon) {
  if (isBloodMoon) {
    return {
      title: "What the Blood Moon Reveals",
      summary: `${card.name} stands alone beneath the Blood Moon. ${card.bloodMoon?.summary || card.summary}`,
      advice: card.bloodMoon?.shadowMessage || card.shadowMeaning
    };
  }

  return {
    title: "The Thread Between the Cards",
    summary: `${card.name} offers one clear message: ${card.summary}`,
    advice: card.reflectionQuestion
  };
}

function createFallbackReading(cards, options) {
  const isBloodMoon = Boolean(options?.isBloodMoon);
  const spread = options?.spread;
  const sharedThemes = getSharedThemes(cards);
  const movement = cards
    .map((card, index) => {
      const position = getPositionLabel(card, index, spread);
      const action = isBloodMoon
        ? card.bloodMoon?.shortMeaning || card.shortMeaning
        : card.shortMeaning;

      return `${position}: ${card.name} brings ${action.charAt(0).toLowerCase()}${action.slice(1)}`;
    })
    .join(" ");
  const themeText = sharedThemes.length
    ? ` The shared themes are ${sharedThemes.join(", ")}.`
    : "";

  if (isBloodMoon) {
    return {
      title: "What the Blood Moon Reveals",
      summary: `Together, these cards suggest that the path is not simply changing. It is revealing what has been hidden beneath it. ${movement}`,
      advice: `Under the Blood Moon, let the Veil expose the pattern without rushing to make it comfortable.${themeText}`
    };
  }

  return {
    title: "The Thread Between the Cards",
    summary: `Together, these cards describe a movement through the reading. ${movement}`,
    advice: `Let each card speak to the next rather than treating them as separate messages.${themeText}`
  };
}

function getCustomPairReading(cards, isBloodMoon) {
  if (cards.length < 2) {
    return null;
  }

  const matchedPairs = [];

  for (let firstIndex = 0; firstIndex < cards.length - 1; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < cards.length; secondIndex += 1) {
      const pairKey = getCardPairKey(cards[firstIndex], cards[secondIndex]);
      const pairMeaning = cardPairMeanings[pairKey];

      if (pairMeaning) {
        matchedPairs.push(pairMeaning);
      }
    }
  }

  if (!matchedPairs.length) {
    return null;
  }

  const primaryPair = matchedPairs[0];

  return {
    title: isBloodMoon ? "What the Blood Moon Reveals" : "The Thread Between the Cards",
    summary: isBloodMoon ? primaryPair.bloodMoonSummary : primaryPair.summary,
    advice: primaryPair.advice,
    extraMessages: matchedPairs.slice(1).map((pair) =>
      isBloodMoon ? pair.bloodMoonSummary : pair.summary
    )
  };
}

function generateCombinedReading(cards, options = {}) {
  if (!Array.isArray(cards) || !cards.length) {
    return null;
  }

  if (cards.length === 1) {
    return createSingleCardReading(cards[0], Boolean(options.isBloodMoon));
  }

  return getCustomPairReading(cards, Boolean(options.isBloodMoon)) ||
    createFallbackReading(cards, options);
}
