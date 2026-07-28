export const tarotSpreadsPage = {
  route: "/tarot-spreads/",
  breadcrumbLabel: "Tarot Spreads",
  seo: {
    title: "Tarot Spreads Explained: Layouts for Love, Career & Guidance | Astral Veil",
    description: "Explore tarot spreads for beginners, love, career, decisions, reflection, and deeper readings. Learn how card positions work and choose the right layout.",
    ogTitle: "Tarot Spreads Explained | Astral Veil",
    ogDescription: "Learn how tarot spread positions work and explore layouts for guidance, relationships, career, decisions, and deeper reflection.",
    lastModified: "2026-07-27"
  },
  hero: {
    eyebrow: "Patterns of the Cards",
    title: "Tarot Spreads Explained",
    paragraphs: [
      "A tarot spread gives every card a specific role, helping organize the past, present influences, advice, choices, challenges, and possible directions within a question.",
      "From one-card reflections to detailed layouts such as the Celtic Cross, different spreads offer different levels of focus and depth. The strongest layout is not always the largest one, but the one that best matches the question being asked."
    ],
    facts: ["One to Ten Cards", "Questions and Positions", "Simple to In-Depth", "Many Paths of Inquiry"],
    image: {
      src: "/assets/images/background%20_images/tarot-spreads.png",
      alt: "Multiple tarot spreads arranged across a candlelit midnight cloth",
      width: 1672,
      height: 941
    }
  },
  definition: {
    id: "what-is-a-tarot-spread",
    eyebrow: "The Reading’s Architecture",
    heading: "What Is a Tarot Spread?",
    paragraphs: [
      "A tarot spread is a planned arrangement of cards in which every position represents a different part of the question. One position may describe the past, another the present situation, another advice, and another a possible direction.",
      "The spread does not replace the meaning of the individual cards. Instead, it gives each card a role within a larger structure. The same card can communicate something different when it appears as advice, an obstacle, an unseen influence, or an outcome.",
      "Spreads can be traditional, adapted, or created for a specific question. Their purpose is to organize interpretation, not to guarantee a fixed prediction."
    ],
    concepts: [
      {
        title: "A Structure for the Question",
        copy: "Each position separates one part of the situation so the reading can be interpreted with greater focus.",
        cards: 1
      },
      {
        title: "Meaning Through Position",
        copy: "The card and its assigned role work together. Position determines which part of the question the card addresses.",
        cards: 2
      },
      {
        title: "A Connected Story",
        copy: "The complete spread should be read as a relationship between cards rather than as several isolated definitions.",
        cards: 3
      }
    ]
  },
  explorer: {
    id: "explore-tarot-spreads",
    eyebrow: "Layouts for Every Question",
    heading: "Explore Tarot Spreads",
    introduction: "Choose a layout based on the depth of your question, the kind of insight you need, and the number of influences you want to examine.",
    filters: [
      { key: "all", label: "All" },
      { key: "beginner", label: "Beginner" },
      { key: "love", label: "Love" },
      { key: "career", label: "Career" },
      { key: "decisions", label: "Decisions" },
      { key: "reflection", label: "Reflection" },
      { key: "in-depth", label: "In-Depth" }
    ],
    items: [
      {
        id: "one-card",
        name: "One-Card Reading",
        categories: ["beginner", "reflection"],
        cardCount: 1,
        difficulty: "Beginner",
        bestFor: "Daily guidance, focused reflection, one central theme",
        summary: "A one-card reading removes unnecessary complexity and asks the reader to focus on the most relevant energy, lesson, or perspective within a question.",
        positions: [
          { name: "Central Theme", copy: "The primary message or focus of the reading." }
        ],
        href: "/?spread=one-card",
        isAvailable: true
      },
      {
        id: "past-present-future",
        name: "Past, Present, Future",
        categories: ["beginner", "reflection"],
        cardCount: 3,
        difficulty: "Beginner",
        bestFor: "Timeline, development, direction",
        summary: "This three-card spread explores what has influenced the situation, what is active now, and what direction may emerge if the present pattern continues.",
        positions: [
          { name: "Past", copy: "Earlier influences, experiences, or conditions." },
          { name: "Present", copy: "The current situation or central energy." },
          { name: "Future", copy: "A possible direction based on current patterns." }
        ],
        href: "/?spread=3",
        isAvailable: true
      },
      {
        id: "situation-challenge-advice",
        name: "Situation, Challenge, Advice",
        categories: ["beginner", "decisions", "reflection"],
        cardCount: 3,
        difficulty: "Beginner",
        bestFor: "Clarity, obstacles, practical guidance",
        summary: "This layout separates the situation itself from the main difficulty and the guidance that may help the reader respond.",
        positions: [
          { name: "Situation", copy: "What is currently unfolding." },
          { name: "Challenge", copy: "The tension, obstacle, or unseen complication." },
          { name: "Advice", copy: "The most constructive approach or perspective." }
        ],
        href: "",
        isAvailable: false
      },
      {
        id: "mind-body-spirit",
        name: "Mind, Body, Spirit",
        categories: ["beginner", "reflection"],
        cardCount: 3,
        difficulty: "Beginner",
        bestFor: "Well-being, alignment, self-reflection",
        summary: "This spread considers mental, physical, and inner or spiritual experience as connected parts of one state.",
        positions: [
          { name: "Mind", copy: "Thoughts, beliefs, or mental focus." },
          { name: "Body", copy: "Physical experience, habits, or practical needs." },
          { name: "Spirit", copy: "Inner meaning, intuition, or deeper alignment." }
        ],
        href: "",
        isAvailable: false
      },
      {
        id: "decision-crossroads",
        name: "Decision Crossroads",
        categories: ["decisions"],
        cardCount: 5,
        difficulty: "Intermediate",
        bestFor: "Comparing options and identifying consequences",
        summary: "This spread explores the energy around a decision, what each path may involve, and the guidance needed before choosing.",
        positions: [
          { name: "Present Crossroads", copy: "The choice or tension requiring attention." },
          { name: "Path A", copy: "The character and immediate demand of the first option." },
          { name: "Likely Development of Path A", copy: "How the first path may unfold under current conditions." },
          { name: "Path B", copy: "The character and immediate demand of the second option." },
          { name: "Likely Development of Path B", copy: "How the second path may unfold under current conditions." }
        ],
        href: "",
        isAvailable: false
      },
      {
        id: "love-relationship",
        name: "Love and Relationship Spread",
        categories: ["love"],
        cardCount: 5,
        difficulty: "Intermediate",
        bestFor: "Connection, communication, relationship dynamics",
        summary: "This layout examines the emotional dynamic between people, what each person brings, and what may support greater understanding.",
        positions: [
          { name: "Current Relationship Energy", copy: "The central pattern moving through the connection." },
          { name: "Your Perspective", copy: "What you bring, notice, or need within the relationship." },
          { name: "Their Perspective", copy: "A reflective position for considering the other person’s apparent stance without claiming certainty." },
          { name: "Shared Challenge", copy: "The difficulty, pattern, or distance affecting both people." },
          { name: "Guidance for the Connection", copy: "A constructive approach to communication and mutual understanding." }
        ],
        href: "",
        isAvailable: false
      },
      {
        id: "career-purpose",
        name: "Career and Purpose Spread",
        categories: ["career"],
        cardCount: 5,
        difficulty: "Intermediate",
        bestFor: "Work, direction, purpose, professional decisions",
        summary: "This layout explores current career energy, strengths, obstacles, opportunities, and a constructive next step.",
        positions: [
          { name: "Current Career Energy", copy: "The central pattern shaping work or professional direction." },
          { name: "Strength to Use", copy: "A skill, quality, or resource available now." },
          { name: "Challenge to Address", copy: "The obstacle or responsibility that needs attention." },
          { name: "Opportunity", copy: "A possibility, opening, or area of development." },
          { name: "Next Step", copy: "A grounded action or perspective for moving forward." }
        ],
        href: "",
        isAvailable: false
      },
      {
        id: "five-card-insight",
        name: "Five-Card Insight Spread",
        categories: ["decisions", "reflection"],
        cardCount: 5,
        difficulty: "Intermediate",
        bestFor: "Situations with several connected influences",
        summary: "This flexible layout offers more context than a three-card reading without the complexity of a larger spread.",
        positions: [
          { name: "Root", copy: "The underlying source or foundation of the situation." },
          { name: "Challenge", copy: "The principal tension or obstacle." },
          { name: "Hidden Influence", copy: "A factor that may not yet be fully recognized." },
          { name: "Guidance", copy: "The approach or perspective that may help." },
          { name: "Outcome", copy: "A possible direction based on the pattern now present." }
        ],
        href: "/?spread=5",
        isAvailable: true
      },
      {
        id: "celtic-cross",
        name: "Celtic Cross",
        categories: ["in-depth", "reflection"],
        cardCount: 10,
        difficulty: "In-Depth",
        bestFor: "Complex questions and broad situations",
        summary: "The Celtic Cross examines the central issue, immediate challenge, conscious and unconscious influences, past and emerging developments, personal position, environment, hopes or fears, and a possible outcome.",
        positions: [
          { name: "Present Situation", copy: "The issue or energy at the center of the question." },
          { name: "Crossing Challenge", copy: "The immediate tension, support, or complication." },
          { name: "Foundation", copy: "Underlying experience, motivation, or unconscious influence." },
          { name: "Recent Past", copy: "An influence that is receding but remains relevant." },
          { name: "Conscious Focus", copy: "What is known, intended, hoped for, or held in mind." },
          { name: "Near Future", copy: "An emerging development under current conditions." },
          { name: "Self", copy: "The reader’s stance, role, or relationship to the situation." },
          { name: "Environment", copy: "Surrounding people, circumstances, and external influences." },
          { name: "Hopes or Fears", copy: "Expectations, concerns, and emotional investment." },
          { name: "Possible Outcome", copy: "A potential direction rather than a guaranteed future." }
        ],
        href: "",
        isAvailable: false
      }
    ]
  },
  beginners: {
    id: "tarot-spreads-for-beginners",
    eyebrow: "Start with Clarity",
    heading: "Tarot Spreads for Beginners",
    introduction: "Simple spreads help readers focus on relationships between positions without becoming overwhelmed by too many cards. A one-card, three-card, or five-card spread can provide meaningful insight when the question is clear.",
    groups: [
      { title: "One Card", bestFor: "A focused question, daily reflection, or central theme", cards: 1 },
      { title: "Three Cards", bestFor: "A timeline, a challenge-and-advice structure, or three connected parts of a situation", cards: 3 },
      { title: "Five Cards", bestFor: "More context, several influences, or a fuller answer without using a ten-card layout", cards: 5 }
    ]
  },
  intentions: {
    id: "choose-a-tarot-spread-by-intention",
    eyebrow: "Begin with the Question",
    heading: "Choose a Tarot Spread by Intention",
    introduction: "The subject of the question can help narrow the spread before any cards are drawn.",
    items: [
      {
        title: "Love and Relationships",
        copy: "Explore emotional connection, communication, relationship dynamics, and questions of closeness or distance.",
        route: "/tarot/topics/love-relationships/",
        linkLabel: "Explore Tarot for Love and Relationships"
      },
      {
        title: "Career and Purpose",
        copy: "Explore professional direction, work challenges, ambition, opportunities, and the meaning attached to your path.",
        route: "/tarot/topics/career-purpose/",
        linkLabel: "Explore Tarot for Career and Purpose"
      },
      {
        title: "Decisions and Crossroads",
        copy: "Explore competing options, difficult choices, possible consequences, and the values shaping a decision.",
        route: "",
        linkLabel: ""
      },
      {
        title: "Personal Growth and Healing",
        copy: "Explore inner patterns, healing, self-understanding, reflection, and gradual transformation.",
        route: "/tarot/topics/advice-personal-growth/",
        linkLabel: "Explore Tarot for Advice and Personal Growth"
      },
      {
        title: "General Guidance and Daily Insight",
        copy: "Explore a broad theme, daily focus, or the perspective most useful to carry into the present moment.",
        route: "/daily-tarot-reading",
        linkLabel: "Begin a Daily Tarot Reading"
      }
    ]
  },
  positions: {
    id: "how-card-positions-change-a-reading",
    eyebrow: "One Card, Three Roles",
    heading: "How Card Positions Change a Reading",
    introduction: "The card remains The Hermit, but each position changes which part of the question its symbolism addresses.",
    cardTitle: "The Hermit",
    examples: [
      {
        label: "Past",
        copy: "A period of withdrawal, study, or independent reflection may continue to influence the present."
      },
      {
        label: "Advice",
        copy: "Create space for quiet thought, independent judgment, or a temporary step away from outside noise."
      },
      {
        label: "Possible Outcome",
        copy: "The situation may move toward solitude, research, self-guided understanding, or a more inward phase."
      }
    ]
  },
  howTo: {
    id: "how-to-choose-and-perform-a-tarot-spread",
    eyebrow: "From Question to Story",
    heading: "How to Choose and Perform a Tarot Spread",
    choosing: [
      { label: "Focused question", copy: "Use one to three cards." },
      { label: "Several connected influences", copy: "Use three to five cards." },
      { label: "Complex or broad situation", copy: "Use five or more cards." },
      { label: "Need to compare options", copy: "Use a crossroads or decision spread." },
      { label: "Need a complete overview", copy: "Use an in-depth layout such as the Celtic Cross." }
    ],
    performing: [
      "Form a clear, open-ended question.",
      "Choose a layout that matches the question’s complexity.",
      "Shuffle while holding the question in mind.",
      "Draw and place each card deliberately.",
      "Interpret every card within its assigned position.",
      "Look for repeated suits, numbers, court cards, and Major Arcana.",
      "Read the spread as one connected story.",
      "Record useful reflections in the journal."
    ]
  },
  patterns: {
    id: "patterns-across-a-tarot-spread",
    eyebrow: "Read the Whole Arrangement",
    heading: "Patterns to Notice Across a Tarot Spread",
    items: [
      { title: "Several Major Arcana Cards", copy: "A concentration of Major Arcana may emphasize larger lessons, turning points, or significant developmental themes." },
      { title: "Repeated Suits", copy: "Repeated suits may draw attention to one realm of experience, such as emotion, action, thought, conflict, work, or resources." },
      { title: "Repeated Numbers", copy: "Repeated numbers may suggest related developmental patterns appearing through different suits." },
      { title: "Multiple Court Cards", copy: "Several court cards may emphasize people, roles, personalities, social dynamics, or different ways of expressing energy." },
      { title: "Elemental Imbalance", copy: "A strong presence or absence of one suit may reveal which type of experience dominates the reading." },
      { title: "Visual Direction", copy: "Figures, gestures, and card compositions may appear to face toward or away from one another, creating visual relationships across the spread." }
    ]
  },
  comparison: {
    id: "simple-vs-in-depth-tarot-spreads",
    eyebrow: "Match Structure to Complexity",
    heading: "Simple vs. In-Depth Tarot Spreads",
    simple: {
      label: "Simple Spreads",
      items: ["One to three cards", "Focused questions", "Faster interpretation", "Beginner-friendly", "Easier to summarize"]
    },
    inDepth: {
      label: "In-Depth Spreads",
      items: ["Five or more cards", "Multiple influences", "Broader context", "Greater interpretive demand", "More complex relationships between positions"]
    },
    conclusion: "A larger spread is not automatically better. The most useful spread is the one whose structure matches the question."
  },
  faq: {
    id: "tarot-spreads-faq",
    eyebrow: "Questions About the Layout",
    heading: "Tarot Spreads Frequently Asked Questions",
    introduction: "Clear answers about card counts, positions, traditional layouts, and creating a spread.",
    items: [
      { question: "What is a tarot spread?", answer: "A tarot spread is an arrangement of cards in which every position represents a different part of the question, such as the past, present influences, advice, challenges, or a possible direction." },
      { question: "Which tarot spread is best for beginners?", answer: "One-card and three-card spreads are usually the easiest starting points because they keep the reading focused while teaching how card positions shape interpretation." },
      { question: "How many cards should I use in a tarot spread?", answer: "The number depends on the complexity of the question. One to three cards work well for focused questions, while five or more cards can explore several connected influences." },
      { question: "What is a three-card tarot spread?", answer: "A three-card spread uses three positions to examine related parts of a question. Common structures include Past, Present, Future and Situation, Challenge, Advice." },
      { question: "What is the Celtic Cross tarot spread?", answer: "The Celtic Cross is a ten-card layout used for complex questions and broad situations. It explores the central issue, challenges, influences, development, personal perspective, environment, hopes or fears, and a possible outcome." },
      { question: "Can I create my own tarot spread?", answer: "Yes. A custom spread can be created by defining a clear question and assigning a specific purpose to every card position before drawing the cards." },
      { question: "Can tarot spreads include reversed cards?", answer: "Yes. Readers who use reversals may interpret an upside-down card as internalized energy, resistance, delay, imbalance, avoidance, or another expression of the same symbolism." },
      { question: "Should I ask the same tarot question repeatedly?", answer: "Repeatedly asking the same question can create confusion, especially when no meaningful circumstances have changed. It is often more useful to reflect on the first reading or ask a clearer follow-up question." },
      { question: "What does an outcome position mean?", answer: "An outcome position usually describes a possible direction based on current patterns. It should not automatically be treated as an unavoidable or guaranteed future." }
    ]
  },
  closing: {
    eyebrow: "The Pattern Awaits",
    heading: "Choose a Spread and Begin",
    copy: "Explore a layout that matches your question, learn what every position represents, or enter a reading and allow the cards to form their story.",
    image: {
      src: "/assets/images/background%20_images/seo-reading-footer.png",
      alt: "",
      width: 1916,
      height: 821
    }
  }
};
