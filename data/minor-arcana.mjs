export const minorArcanaPage = {
  slug: "minor-arcana",
  breadcrumbLabel: "Minor Arcana Explained",
  seo: {
    title: "Minor Arcana Explained: Suits, Numbers & Meanings | Astral Veil",
    description: "Learn how the 56 Minor Arcana cards work through four suits, number patterns, court cards, elements, and everyday tarot meanings.",
    ogTitle: "Minor Arcana Explained: Suits, Numbers & Meanings",
    ogDescription: "Explore the four tarot suits, number patterns, court cards, elements, and everyday meanings of the 56 Minor Arcana cards.",
    lastModified: "2026-07-26"
  },
  hero: {
    eyebrow: "The 56 Cards of Everyday Experience",
    title: "Minor Arcana Explained",
    image: {
      src: "/assets/images/background%20_images/minor-arcana-explained.png",
      alt: "Four symbolic tarot suit cards arranged across a candlelit celestial table",
      width: 1448,
      height: 1086
    },
    paragraphs: [
      "The Minor Arcana contains fifty-six cards that explore the details of everyday experience: emotions, choices, relationships, challenges, resources, ambitions, conflict, and change.",
      "Divided into four suits, the cards move from Ace through Ten before introducing the Pages, Knights, Queens, and Kings. Together, they show how larger themes become visible through ordinary life."
    ],
    facts: ["56 Cards", "4 Suits", "Numbers and Court Cards", "Everyday Experience"],
    ctaLabel: "Explore the 56 Cards",
    ctaTarget: "#explore-minor-arcana"
  },
  explore: {
    id: "explore-minor-arcana",
    eyebrow: "The Everyday Arcana",
    heading: "Explore the 56 Minor Arcana Cards",
    introduction: "Move through the four suits and discover how each card expresses emotion, action, conflict, thought, resources, relationships, and daily experience.",
    filters: [
      { key: "all", label: "All" },
      { key: "wands", label: "Wands" },
      { key: "cups", label: "Cups" },
      { key: "swords", label: "Swords" },
      { key: "pentacles", label: "Pentacles" },
      { key: "court", label: "Court Cards" }
    ]
  },
  overview: {
    id: "what-is-the-minor-arcana",
    eyebrow: "Foundations",
    heading: "What Is the Minor Arcana?",
    paragraphs: [
      "The Minor Arcana is a group of fifty-six cards within a standard seventy-eight-card tarot deck. It is divided into four suits: Wands, Cups, Swords, and Pentacles.",
      "While the Major Arcana often highlights broader archetypes and major periods of transition, the Minor Arcana explores how those themes appear through daily choices, emotions, relationships, ambitions, conflicts, resources, and responsibilities.",
      "Each suit contains fourteen cards: an Ace through Ten, followed by the Page, Knight, Queen, and King. The numbers describe stages and patterns, while the court cards may represent people, personalities, roles, approaches, or forms of energy.",
      "A Minor Arcana card is not insignificant simply because it describes ordinary experience. Everyday choices and repeated patterns are often where larger transformations become visible."
    ],
    highlights: [
      "four suits: Wands, Cups, Swords, and Pentacles",
      "daily choices, emotions, relationships, ambitions, conflicts, resources, and responsibilities",
      "Ace through Ten",
      "Everyday choices and repeated patterns"
    ],
    concepts: [
      {
        number: "01",
        title: "Four Suits, Four Realms",
        copy: "Each suit explores a different dimension of experience through its element, symbols, and recurring themes.",
        route: "#four-tarot-suits",
        image: {
          src: "/assets/images/background%20_images/minor-arcana-explained.png",
          alt: "A candlelit celestial table displaying the four symbolic Minor Arcana suits",
          width: 1448,
          height: 1086,
          bloodMoonSrc: "/assets/images/background%20_images/tarot-compare-header-bloodmoon.webp",
          bloodMoonAlt: "A crimson celestial tarot table beneath the Blood Moon"
        }
      },
      {
        number: "02",
        title: "Patterns from Ace to Ten",
        copy: "The numbered cards move through beginnings, growth, challenge, consequence, completion, and transition.",
        route: "#minor-number-patterns",
        image: {
          src: "/assets/images/cards/astral-veil-tarot/pentacles/10-ten-of-pentacles.png",
          alt: "Ten of Pentacles representing the numbered progression of the Minor Arcana",
          width: 1024,
          height: 1536,
          bloodMoonSrc: "/assets/images/cards/astral-veil-crimson/pentacles/10-ten-of-pentacles.png",
          bloodMoonAlt: "Veilfall Ten of Pentacles representing the numbered progression"
        }
      },
      {
        number: "03",
        title: "The Court in Motion",
        copy: "Pages, Knights, Queens, and Kings explore personality, development, roles, and different ways of engaging with a suit.",
        route: "#minor-court-cards",
        image: {
          src: "/assets/images/cards/astral-veil-tarot/cups/13-queen-of-cups.png",
          alt: "Queen of Cups representing the court cards of the Minor Arcana",
          width: 1024,
          height: 1536,
          bloodMoonSrc: "/assets/images/cards/astral-veil-crimson/cups/13-queen-of-cups.png",
          bloodMoonAlt: "Veilfall Queen of Cups representing the court cards"
        }
      }
    ]
  },
  suits: {
    id: "four-tarot-suits",
    eyebrow: "The Four Realms",
    heading: "Understanding the Four Tarot Suits",
    introduction: "The four Minor Arcana suits organize everyday experience into symbolic realms. Each suit has its own element, concerns, strengths, tensions, and style of expression.",
    instruction: "Select a suit to explore its element and themes.",
    items: [
      {
        key: "wands",
        name: "Wands",
        element: "Fire",
        themes: ["Action", "Ambition", "Creativity", "Will"],
        paragraphs: [
          "Wands explore energy in motion. They often appear around ambition, initiative, attraction, creativity, work, confidence, conflict, and the desire to make something happen.",
          "The suit can reveal both inspired momentum and the exhaustion, competition, or impulsiveness that arise when energy lacks direction."
        ],
        progression: "Ace · 2–10 · Page · Knight · Queen · King",
        representativeCards: ["Ace of Wands", "Five of Wands", "Ten of Wands", "Queen of Wands"]
      },
      {
        key: "cups",
        name: "Cups",
        element: "Water",
        themes: ["Emotion", "Connection", "Intuition", "Relationship"],
        paragraphs: [
          "Cups explore emotional experience, connection, receptivity, imagination, affection, grief, intimacy, and the movement of feeling.",
          "The suit may describe relationships with others, but it can also reveal a person’s relationship with memory, intuition, creativity, and the inner world."
        ],
        progression: "Ace · 2–10 · Page · Knight · Queen · King",
        representativeCards: ["Ace of Cups", "Five of Cups", "Ten of Cups", "Queen of Cups"]
      },
      {
        key: "swords",
        name: "Swords",
        element: "Air",
        themes: ["Thought", "Truth", "Conflict", "Decision"],
        paragraphs: [
          "Swords explore ideas, communication, judgment, clarity, tension, conflict, fear, and difficult decisions.",
          "The suit often reveals how thought can illuminate experience or sharpen pain, depending on how truth, perception, and language are handled."
        ],
        progression: "Ace · 2–10 · Page · Knight · Queen · King",
        representativeCards: ["Ace of Swords", "Five of Swords", "Ten of Swords", "Queen of Swords"]
      },
      {
        key: "pentacles",
        name: "Pentacles",
        element: "Earth",
        themes: ["Resources", "Body", "Work", "Stability"],
        paragraphs: [
          "Pentacles explore material and embodied life: work, money, health, home, skill, responsibility, security, and the results of sustained effort.",
          "The suit asks how values become tangible through habits, resources, commitments, and the physical conditions of daily life."
        ],
        progression: "Ace · 2–10 · Page · Knight · Queen · King",
        representativeCards: ["Ace of Pentacles", "Five of Pentacles", "Ten of Pentacles", "Queen of Pentacles"]
      }
    ]
  },
  numbers: {
    id: "minor-number-patterns",
    eyebrow: "Patterns Across the Suits",
    heading: "How Numbers Shape the Minor Arcana",
    introduction: "The same number can echo related developmental ideas across all four suits while taking on the unique context of fire, water, air, or earth. These patterns are a flexible teaching framework rather than rigid universal laws.",
    items: [
      { key: "ace", label: "Ace", pattern: "Potential · Beginning · Opportunity", readings: { Wands: "Creative ignition or a new initiative", Cups: "Emotional opening or renewed connection", Swords: "A clarifying idea or decisive truth", Pentacles: "A practical opportunity or material beginning" } },
      { key: "two", label: "2", rank: "Two", pattern: "Polarity · Choice · Relationship", readings: { Wands: "Planning a direction or choosing a horizon", Cups: "Mutual feeling, exchange, or partnership", Swords: "A difficult choice or protected uncertainty", Pentacles: "Balancing resources, duties, or changing demands" } },
      { key: "three", label: "3", rank: "Three", pattern: "Growth · Expression · Development", readings: { Wands: "Expansion, foresight, or visible progress", Cups: "Shared joy, friendship, or emotional support", Swords: "Pain, separation, or truth that must be felt", Pentacles: "Collaboration, learning, or skilled contribution" } },
      { key: "four", label: "4", rank: "Four", pattern: "Structure · Stability · Holding", readings: { Wands: "Celebration, belonging, or a secure foundation", Cups: "Withdrawal, reflection, or emotional disengagement", Swords: "Rest, recovery, or necessary mental stillness", Pentacles: "Security, conservation, or possessive holding" } },
      { key: "five", label: "5", rank: "Five", pattern: "Disruption · Tension · Adjustment", readings: { Wands: "Competition or clashing energy", Cups: "Loss, grief, or emotional focus", Swords: "Conflict, cost, or difficult victory", Pentacles: "Material difficulty or exclusion" } },
      { key: "six", label: "6", rank: "Six", pattern: "Movement · Exchange · Rebalancing", readings: { Wands: "Recognition, confidence, or public progress", Cups: "Memory, kindness, or return to the past", Swords: "Transition away from difficulty", Pentacles: "Giving, receiving, or restoring material balance" } },
      { key: "seven", label: "7", rank: "Seven", pattern: "Assessment · Challenge · Strategy", readings: { Wands: "Defending a position or sustaining conviction", Cups: "Options, fantasy, or emotional discernment", Swords: "Strategy, secrecy, or indirect action", Pentacles: "Patience, evaluation, or long-term cultivation" } },
      { key: "eight", label: "8", rank: "Eight", pattern: "Momentum · Skill · Restriction or Mastery", readings: { Wands: "Swift movement, messages, or acceleration", Cups: "Leaving what no longer feels meaningful", Swords: "Perceived restriction or a limiting perspective", Pentacles: "Practice, craftsmanship, or disciplined skill" } },
      { key: "nine", label: "9", rank: "Nine", pattern: "Intensity · Fulfillment · Near Completion", readings: { Wands: "Resilience, boundaries, or guarded persistence", Cups: "Satisfaction, gratitude, or a wish fulfilled", Swords: "Anxiety, regret, or mental overwhelm", Pentacles: "Independence, refinement, or earned comfort" } },
      { key: "ten", label: "10", rank: "Ten", pattern: "Completion · Consequence · Transition", readings: { Wands: "Responsibility, burden, or overextension", Cups: "Emotional harmony, belonging, or shared fulfillment", Swords: "A painful ending and unavoidable transition", Pentacles: "Legacy, continuity, or established material life" } }
    ]
  },
  courts: {
    id: "minor-court-cards",
    eyebrow: "The Living Court",
    heading: "Understanding Minor Arcana Court Cards",
    introduction: "The Page, Knight, Queen, and King may describe people, personality traits, developmental stages, approaches, or ways that a suit’s energy is being expressed.",
    ranks: [
      { key: "page", name: "Page", themes: "Learning · Curiosity · Message · Emerging Potential", copy: "The Page explores discovery, openness, study, and the early development of the suit’s qualities." },
      { key: "knight", name: "Knight", themes: "Movement · Pursuit · Action · Extremes", copy: "The Knight actively carries the suit into the world, often showing momentum, focus, or an energy taken to its limit." },
      { key: "queen", name: "Queen", themes: "Embodiment · Understanding · Inner Mastery · Influence", copy: "The Queen represents a mature, inwardly integrated relationship with the suit’s qualities." },
      { key: "king", name: "King", themes: "Direction · Responsibility · Outer Mastery · Leadership", copy: "The King represents deliberate outward expression, authority, responsibility, and command of the suit." }
    ],
    suits: ["Wands", "Cups", "Swords", "Pentacles"]
  },
  orientation: {
    id: "upright-and-reversed-minor-arcana",
    eyebrow: "Two Orientations",
    heading: "Upright and Reversed Minor Arcana Meanings",
    introduction: "Orientation can shift where a card’s practical energy is expressed without turning its meaning into a simple positive-or-negative rule.",
    cardTitle: "Eight of Cups",
    upright: {
      label: "Upright",
      subtitle: "Direct expression in everyday life",
      emblem: "✦",
      copy: "An upright Minor Arcana card often describes energy, events, emotions, choices, or circumstances that are visibly active or directly expressed in daily life.",
      themes: ["Direct expression", "Visible circumstances", "Active development", "External experience"]
    },
    reversed: {
      label: "Reversed",
      subtitle: "Energy requiring reflection or adjustment",
      emblem: "◇",
      copy: "A reversed Minor Arcana card may describe internalized energy, delay, resistance, imbalance, avoidance, or a practical situation requiring closer attention.",
      themes: ["Internal expression", "Delay or blockage", "Imbalance", "Reflection or adjustment"]
    },
    guideStatus: "Tarot Reversals Guide · Coming Soon"
  },
  readings: {
    id: "minor-arcana-in-readings",
    eyebrow: "Reading the Everyday Pattern",
    heading: "How Minor Arcana Cards Work in Readings",
    introduction: "Minor Arcana cards bring a reading into lived experience, showing where a larger pattern touches decisions, feelings, conversations, habits, responsibilities, and change.",
    concepts: [
      { number: "01", title: "They Describe Everyday Experience", copy: "Minor Arcana cards often show how a larger theme appears through practical situations, emotions, choices, conversations, or actions." },
      { number: "02", title: "They Add Detail and Timing", copy: "Their numbers, suits, and imagery can clarify how a situation develops and which part of life requires attention." },
      { number: "03", title: "They Reveal Patterns", copy: "Repeated suits, numbers, or court cards may highlight habits, relationships, emotional cycles, or recurring practical concerns." }
    ],
    example: {
      heading: "The Larger Lesson Meets Daily Life",
      copy: "One Major Arcana card establishes the larger lesson, while several Minor Arcana cards describe its practical expression.",
      note: "This example is educational only and does not imply a guaranteed prediction.",
      cardTitles: ["Five of Wands", "Wheel of Fortune", "Six of Pentacles"],
      positions: ["Situation", "Larger Lesson", "Practical Response"]
    }
  },
  comparison: {
    id: "major-vs-minor",
    eyebrow: "The Complete Deck",
    heading: "Major Arcana vs. Minor Arcana",
    introduction: "Discover how the two halves of a tarot deck work together: one reveals the greater pattern, while the other shows how it unfolds through everyday life.",
    defaultMode: "minor",
    major: {
      key: "major",
      eyebrow: "The Greater Journey",
      title: "Major Arcana",
      number: "22",
      numberLabel: "22 cards",
      supportingLabel: "Archetypes · Turning Points · The Fool’s Journey",
      copy: "The Major Arcana represents broad archetypes, defining lessons, and meaningful periods of transition. Numbered from The Fool at 0 to The World at 21, these cards often establish the larger theme of a reading.",
      items: ["Numbered 0–21", "Broad archetypes and life themes", "Major lessons and transitions", "The Fool’s Journey"],
      route: "/tarot/major-arcana/",
      routeLabel: "Explore the Major Arcana",
      cardTitles: ["The Fool", "The High Priestess", "Wheel of Fortune", "The World"]
    },
    minor: {
      key: "minor",
      eyebrow: "Everyday Experience",
      title: "Minor Arcana",
      number: "56",
      numberLabel: "56 cards",
      supportingLabel: "Four Suits · Daily Life · Practical Expression",
      copy: "The Minor Arcana explores the practical details of experience through four suits, numbered cards, and court cards. These cards often describe emotions, decisions, relationships, challenges, actions, and circumstances unfolding in daily life.",
      items: ["Four suits", "Numbers and court cards", "Daily events, choices, emotions, and circumstances", "Practical expression of the larger story"],
      route: "#explore-minor-arcana",
      routeLabel: "Explore the 56 Minor Arcana Cards",
      cardTitles: ["Ace of Cups", "Queen of Wands", "Three of Swords", "Six of Pentacles"]
    },
    balance: { number: "78", numberLabel: "Cards", label: "One Complete System" },
    supporting: "The two groups work together. Major Arcana cards often establish the larger theme, while Minor Arcana cards show how that theme is experienced through everyday situations."
  },
  faq: {
    id: "minor-arcana-faq",
    eyebrow: "Common Questions",
    heading: "Minor Arcana Frequently Asked Questions",
    introduction: "Clear answers about the structure, suits, numbers, court cards, and role of the Minor Arcana.",
    items: [
      { question: "What is the Minor Arcana in tarot?", answer: "The Minor Arcana is a group of fifty-six cards divided into four suits. These cards often explore emotions, actions, thoughts, relationships, work, resources, challenges, and everyday circumstances." },
      { question: "How many Minor Arcana cards are there?", answer: "A standard tarot deck contains fifty-six Minor Arcana cards. Each of the four suits contains fourteen cards: Ace through Ten, followed by Page, Knight, Queen, and King." },
      { question: "What are the four Minor Arcana suits?", answer: "The four suits are Wands, Cups, Swords, and Pentacles. They are commonly associated with fire, water, air, and earth, though traditions may vary." },
      { question: "What do the numbers mean in the Minor Arcana?", answer: "The numbers can be used as a teaching framework for recognizing patterns such as beginnings, choices, development, stability, disruption, adjustment, and completion. The suit determines how that pattern is expressed." },
      { question: "What do Minor Arcana court cards represent?", answer: "Court cards may describe people, personality traits, roles, approaches, developmental stages, or different ways of expressing a suit’s energy." },
      { question: "Are Minor Arcana cards less important than Major Arcana cards?", answer: "No. Major Arcana cards often emphasize broader themes, while Minor Arcana cards show how those themes appear through daily experience. Both groups contribute to a complete reading." },
      { question: "Can Minor Arcana cards be reversed?", answer: "Yes. A reversed Minor Arcana card may describe internalized energy, delay, resistance, imbalance, avoidance, or a practical lesson requiring closer attention." }
    ]
  },
  closingCta: {
    eyebrow: "The Journey Continues",
    heading: "Explore the World Within the Suits",
    copy: "Move through Wands, Cups, Swords, and Pentacles, open a full card meaning, or bring the Minor Arcana into a reading of your own.",
    image: {
      src: "/assets/images/background%20_images/tarot-study.png",
      alt: "",
      width: 1672,
      height: 941
    },
    actions: [
      { label: "Explore All Minor Arcana Cards", route: "#explore-minor-arcana" },
      { label: "Begin a Tarot Reading", route: "/" },
      { label: "Explore the Major Arcana", route: "/tarot/major-arcana/" }
    ],
    spreadsStatus: "Tarot Spreads · Coming Soon"
  }
};
