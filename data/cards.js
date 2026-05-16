const tarotDeck = [
  {
    id: "the-fool",
    name: "The Fool",
    image: "assets/images/cards/original/the-fool.jpg",
    meaning: "New beginnings, curiosity, freedom, and trusting the unknown.",
    energy: "positive"
  },
  {
    id: "the-magician",
    name: "The Magician",
    image: "assets/images/cards/original/the-magician.jpg",
    meaning: "Manifestation, focus, skill, and turning intention into reality.",
    energy: "positive"
  },
  {
    id: "the-high-priestess",
    name: "The High Priestess",
    image: "assets/images/cards/original/high-priestess.jpg",
    meaning: "Intuition, hidden wisdom, mystery, and listening to your inner voice.",
    energy: "mysterious"
  },
  {
    id: "the-empress",
    name: "The Empress",
    image: "assets/images/cards/original/the-empress.jpg",
    meaning: "Abundance, creativity, beauty, nurturing, and natural growth.",
    energy: "positive"
  },
  {
    id: "the-emperor",
    name: "The Emperor",
    image: "assets/images/cards/original/the-emperor.jpg",
    meaning: "Structure, leadership, discipline, protection, and grounded authority.",
    energy: "balanced"
  },
  {
    id: "the-hierophant",
    name: "The Hierophant",
    image: "assets/images/cards/original/the-hierophant.jpg",
    meaning: "Tradition, spiritual guidance, learning, belief systems, and sacred wisdom.",
    energy: "neutral"
  },
  {
    id: "the-lovers",
    name: "The Lovers",
    image: "assets/images/cards/original/the-lovers.jpg",
    meaning: "Connection, alignment, choice, harmony, and meaningful relationships.",
    energy: "positive"
  },
  {
    id: "the-chariot",
    name: "The Chariot",
    image: "assets/images/cards/original/the-chariot.jpg",
    meaning: "Determination, control, willpower, progress, and moving forward with purpose.",
    energy: "transformative"
  },
  {
    id: "strength",
    name: "Strength",
    image: "assets/images/cards/original/strength.jpg",
    meaning: "Courage, patience, compassion, inner power, and gentle confidence.",
    energy: "balanced"
  },
  {
    id: "the-hermit",
    name: "The Hermit",
    image: "assets/images/cards/original/the-hermit.jpg",
    meaning: "Reflection, solitude, wisdom, soul-searching, and inner guidance.",
    energy: "mysterious"
  },
  {
    id: "wheel-of-fortune",
    name: "Wheel of Fortune",
    image: "assets/images/cards/original/wheel-of-fortune.jpg",
    meaning: "Change, cycles, destiny, turning points, and trusting life's movement.",
    energy: "transformative"
  },
  {
    id: "justice",
    name: "Justice",
    image: "assets/images/cards/original/justice.jpg",
    meaning: "Truth, balance, fairness, accountability, and clear decisions.",
    energy: "balanced"
  },
  {
    id: "the-hanged-man",
    name: "The Hanged Man",
    image: "assets/images/cards/original/the-hanged-man.jpg",
    meaning: "Pause, surrender, perspective, patience, and seeing things differently.",
    energy: "neutral"
  },
  {
    id: "death",
    name: "Death",
    image: "assets/images/cards/original/death.jpg",
    meaning: "Transformation, endings, release, rebirth, and making space for renewal.",
    energy: "transformative"
  },
  {
    id: "temperance",
    name: "Temperance",
    image: "assets/images/cards/original/temperance.jpg",
    meaning: "Balance, healing, moderation, harmony, and spiritual alignment.",
    energy: "balanced"
  },
  {
    id: "the-devil",
    name: "The Devil",
    image: "assets/images/cards/original/the-devil.jpg",
    meaning: "Temptation, attachment, shadow patterns, limitation, and reclaiming power.",
    energy: "challenging"
  },
  {
    id: "the-tower",
    name: "The Tower",
    image: "assets/images/cards/original/the-tower.jpg",
    meaning: "Sudden change, disruption, awakening, collapse of illusions, and rebuilding.",
    energy: "challenging"
  },
  {
    id: "the-star",
    name: "The Star",
    image: "assets/images/cards/original/the-star.jpg",
    meaning: "Hope, renewal, inspiration, healing, and trust in the future.",
    energy: "positive"
  },
  {
    id: "the-moon",
    name: "The Moon",
    image: "assets/images/cards/original/the-moon.jpg",
    meaning: "Dreams, intuition, illusion, fear, and navigating the unknown.",
    energy: "mysterious"
  },
  {
    id: "the-sun",
    name: "The Sun",
    image: "assets/images/cards/original/the-sun.jpg",
    meaning: "Joy, clarity, vitality, success, warmth, and positive energy.",
    energy: "positive"
  },
  {
    id: "judgement",
    name: "Judgement",
    image: "assets/images/cards/original/judgement.jpg",
    meaning: "Awakening, reflection, renewal, inner calling, and personal transformation.",
    energy: "transformative"
  },
  {
    id: "the-world",
    name: "The World",
    image: "assets/images/cards/original/the-world.jpg",
    meaning: "Completion, fulfillment, wholeness, achievement, and reaching a new cycle.",
    energy: "positive"
  }
];

// Production Blood Moon deck art only. Keep draft images out of this mapping.
const bloodMoonCardImages = {
  "the-fool": "bloodmoon-fool.png",
  "the-magician": "bloodmoon-magician.png",
  "the-high-priestess": "bloodmoon-high-priestess.png",
  "the-empress": "bloodmoon-empress.png",
  "the-emperor": "bloodmoon-emperor.png",
  "the-hierophant": "bloodmoon-hierophant.png",
  "the-lovers": "bloodmoon-lovers.png",
  "the-chariot": "bloodmoon-chariot.png",
  strength: "bloodmoon-strength.png",
  "the-hermit": "bloodmoon-hermit.png",
  "wheel-of-fortune": "bloodmoon-wheel-fortune.png",
  justice: "bloodmoon-justice.png",
  "the-hanged-man": "bloodmoon-hanged-man.png",
  death: "bloodmoon-death.png",
  temperance: "bloodmoon-temperance.png",
  "the-devil": "bloodmoon-devil.png",
  "the-tower": "bloodmoon-tower.png",
  "the-star": "bloodmoon-star.png",
  "the-moon": "bloodmoon-moon.png",
  "the-sun": "bloodmoon-sun.png",
  judgement: "bloodmoon-judgement.png",
  "the-world": "loodmoon-world.png"
};

const bloodMoonCardMeanings = {
  "the-fool": {
    upright: "New beginnings, trust, risk, innocence.",
    reversed: "Recklessness, hesitation, poor judgment.",
    bloodMoon: {
      upright: "A soul crosses the threshold beneath the crimson eclipse. The path is open, but the price is hidden.",
      reversed: "Fear grips the traveler at the edge. The veil waits, but doubt has already begun to feed."
    }
  },
  "the-magician": {
    upright: "Manifestation, focus, skill, willpower.",
    reversed: "Manipulation, scattered energy, unused power.",
    bloodMoon: {
      upright: "The hand that shapes fate glows red with forbidden fire. Desire becomes real when the will dares to command it.",
      reversed: "Power spills through careless fingers. The spell still answers, but it no longer serves the one who cast it."
    }
  },
  "the-high-priestess": {
    upright: "Intuition, hidden knowledge, mystery, inner knowing.",
    reversed: "Secrets, disconnection, ignored intuition.",
    bloodMoon: {
      upright: "She guards the door behind the eclipse, where every secret has a pulse. Listen softly, for the hidden truth is listening back.",
      reversed: "The inner voice is buried beneath ritual silence. What refuses to be heard will return wearing a darker face."
    }
  },
  "the-empress": {
    upright: "Abundance, creation, nurture, beauty.",
    reversed: "Creative block, neglect, dependence.",
    bloodMoon: {
      upright: "From the dark garden, something lush and dangerous begins to bloom. Creation asks to be fed with honesty, not innocence.",
      reversed: "The soil has soured beneath old hunger. What was meant to nurture may now bind, drain, or overgrow."
    }
  },
  "the-emperor": {
    upright: "Authority, structure, discipline, protection.",
    reversed: "Control, rigidity, domination, instability.",
    bloodMoon: {
      upright: "A throne stands beneath the red sky, carved from law, bone, and oath. Order can protect you, if you do not mistake fear for rule.",
      reversed: "The crown tightens until it becomes a cage. Control has begun to devour the kingdom it swore to defend."
    }
  },
  "the-hierophant": {
    upright: "Tradition, teaching, belief, sacred guidance.",
    reversed: "Rebellion, dogma, false teachers, restriction.",
    bloodMoon: {
      upright: "The old rites awaken under crimson light. An ancestral voice offers guidance, but every sacred door requires discernment.",
      reversed: "The sermon curdles into command. Beware a doctrine that demands your soul before it offers wisdom."
    }
  },
  "the-lovers": {
    upright: "Connection, alignment, choice, union.",
    reversed: "Disharmony, temptation, misalignment, difficult choices.",
    bloodMoon: {
      upright: "Two shadows reach for each other beneath the eclipse. Love becomes a mirror, revealing both devotion and the hunger beneath it.",
      reversed: "Desire speaks in borrowed voices. A choice made from longing may lead you away from your own heart."
    }
  },
  "the-chariot": {
    upright: "Willpower, direction, victory, determination.",
    reversed: "Lack of control, aggression, stalled movement.",
    bloodMoon: {
      upright: "The chariot cuts through the blood-lit road with relentless purpose. Master the beasts within, and fate will move.",
      reversed: "The reins snap in the dark. Ambition without command becomes a charge toward ruin."
    }
  },
  strength: {
    upright: "Courage, patience, compassion, inner power.",
    reversed: "Self-doubt, raw impulse, fear, weakness.",
    bloodMoon: {
      upright: "The beast lowers its head beneath your trembling hand. True power is the mercy that survives the night.",
      reversed: "The creature within has tasted fear and mistaken it for freedom. Gentleness must return before power turns feral."
    }
  },
  "the-hermit": {
    upright: "Solitude, reflection, wisdom, inner guidance.",
    reversed: "Isolation, withdrawal, loneliness, avoidance.",
    bloodMoon: {
      upright: "A lone lantern burns red at the edge of the world. Step inward, where the truth has been waiting without witnesses.",
      reversed: "The cave has become too familiar. Solitude may be wisdom, or it may be a locked door you are afraid to open."
    }
  },
  "wheel-of-fortune": {
    upright: "Cycles, change, destiny, turning points.",
    reversed: "Resistance, misfortune, repeating patterns.",
    bloodMoon: {
      upright: "The wheel turns through eclipse and omen. What rises tonight was written long ago, but your response remains unwritten.",
      reversed: "The same shadow circles back with a new mask. Fate repeats until the hidden pattern is named."
    }
  },
  justice: {
    upright: "Truth, fairness, accountability, balance.",
    reversed: "Dishonesty, imbalance, avoidance, unfairness.",
    bloodMoon: {
      upright: "The scales gleam red, weighing motive against consequence. Nothing is hidden from the blade of truth tonight.",
      reversed: "A lie has been dressed as mercy. The eclipse will not balance what you refuse to confess."
    }
  },
  "the-hanged-man": {
    upright: "Pause, surrender, perspective, sacrifice.",
    reversed: "Stagnation, resistance, needless delay.",
    bloodMoon: {
      upright: "Suspended beneath the crimson moon, the soul sees the world inverted and finally honest. Surrender reveals the door.",
      reversed: "You hang by threads of your own refusal. The sacrifice has meaning only when you stop bargaining with it."
    }
  },
  death: {
    upright: "Endings, transformation, release, rebirth.",
    reversed: "Resistance to change, decay, fear of endings.",
    bloodMoon: {
      upright: "A black gate opens under red light. What ends tonight does not vanish; it becomes the soil of your next form.",
      reversed: "The dead thing is still being carried. Release it, or let its weight choose the shape of your future."
    }
  },
  temperance: {
    upright: "Balance, healing, moderation, harmony.",
    reversed: "Excess, imbalance, impatience, discord.",
    bloodMoon: {
      upright: "Crimson and silver are poured into one forbidden cup. Healing begins where opposing forces learn to breathe together.",
      reversed: "The mixture curdles from haste and hunger. Balance cannot be forced by a hand that still trembles with want."
    }
  },
  "the-devil": {
    upright: "Attachment, temptation, shadow, limitation.",
    reversed: "Release, awareness, reclaiming power.",
    bloodMoon: {
      upright: "The chain glitters beautifully beneath the eclipse. Name the hunger, and you will see where it has been naming you.",
      reversed: "A lock loosens in the dark. The shadow still follows, but it no longer holds the only key."
    }
  },
  "the-tower": {
    upright: "Upheaval, revelation, collapse, awakening.",
    reversed: "Avoided disaster, fear of change, delayed collapse.",
    bloodMoon: {
      upright: "Lightning strikes the blood-red spire. What was built on denial must fall so the sky can enter.",
      reversed: "The walls are cracking quietly. Delay may soften nothing; it only teaches the collapse to wait."
    }
  },
  "the-star": {
    upright: "Hope, renewal, inspiration, healing.",
    reversed: "Despair, disconnection, lost faith.",
    bloodMoon: {
      upright: "A pale star survives above the crimson dark. Hope is not gentle tonight, but it is still burning.",
      reversed: "The sky feels emptied of promise. Look again: the light has not died, it has only withdrawn behind the wound."
    }
  },
  "the-moon": {
    upright: "Illusion, dreams, intuition, fear, uncertainty.",
    reversed: "Revelation, confusion lifting, repressed fear.",
    bloodMoon: {
      upright: "The moon bleeds over the path, and every shadow learns your name. Trust intuition, but question every shape it wears.",
      reversed: "The nightmare thins, leaving tracks in the dust. What terrified you may finally reveal what it was protecting."
    }
  },
  "the-sun": {
    upright: "Joy, clarity, success, vitality.",
    reversed: "Dimmed optimism, delay, false brightness.",
    bloodMoon: {
      upright: "Even under crimson skies, a fierce light breaks through. Truth returns warmth to the places fear had claimed.",
      reversed: "The light is veiled, not absent. Beware the smile that hides exhaustion, and the victory that asks too much."
    }
  },
  judgement: {
    upright: "Awakening, reflection, calling, renewal.",
    reversed: "Self-doubt, avoidance, refusal to answer.",
    bloodMoon: {
      upright: "A red trumpet sounds from beyond the veil. The soul is summoned to answer for what it has become, and what it still may choose.",
      reversed: "The call echoes unanswered. Avoidance becomes its own verdict when the spirit refuses to rise."
    }
  },
  "the-world": {
    upright: "Completion, fulfillment, wholeness, integration.",
    reversed: "Incompletion, delay, unfinished lessons.",
    bloodMoon: {
      upright: "The circle closes beneath the eclipse, whole and haunted. You have crossed the threshold and carry every shadow as part of the crown.",
      reversed: "The gate remains almost closed. One final truth waits to be integrated before the cycle can release you."
    }
  }
};

const bloodMoonDeck = {
  id: "bloodMoon",
  name: "Blood Moon Deck",
  cards: tarotDeck.map((card) => ({
    ...card,
    id: `blood-moon-${card.id}`,
    originalCardId: card.id,
    image: `assets/images/cards/blood-moon/${bloodMoonCardImages[card.id]}`,
    upright: bloodMoonCardMeanings[card.id].upright,
    reversed: bloodMoonCardMeanings[card.id].reversed,
    bloodMoon: bloodMoonCardMeanings[card.id].bloodMoon,
    meaning: bloodMoonCardMeanings[card.id].bloodMoon.upright
  }))
};
