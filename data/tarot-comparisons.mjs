export const tarotComparisons = [
  {
    id: "tarot-vs-oracle-cards",
    slug: "tarot-vs-oracle-cards",
    eyebrow: "Compare · Choose · Connect",
    title: "Tarot vs. Oracle Cards",
    introduction: "Tarot and Oracle cards both offer reflective ways to explore questions, patterns, and possibilities, but they differ in structure, symbolism, and reading style. Understanding those differences can help you choose the system that best fits the kind of guidance you are seeking.",
    breadcrumbLabel: "Tarot vs. Oracle Cards",
    schemaAbout: "The differences between Tarot and Oracle cards",
    hubTile: {
      key: "tarot-vs-oracle",
      ctaLabel: "Compare Tarot and Oracle",
      imageSide: "left"
    },
    hero: {
      regularImage: "/assets/images/background%20_images/tarot-compare-header-sun.webp",
      bloodMoonImage: "/assets/images/background%20_images/tarot-compare-header-bloodmoon.webp",
      width: 1916,
      height: 821,
      regularAlt: "Mystical Tarot cards and a candle arranged on a celestial blue reading table",
      bloodMoonAlt: "Tarot cards beneath a red moon beside a crimson candle in Blood Moon mode"
    },
    directAnswer: {
      eyebrow: "The Direct Answer",
      copy: "Tarot follows a recognizable 78-card structure with established archetypes, suits, and traditional meanings. Oracle decks do not follow one universal structure: each deck’s creator determines its size, imagery, themes, and interpretive system.",
      takeaway: "Choose Tarot when you want a layered symbolic language that rewards deeper study. Choose Oracle cards when you want a deck-specific system with greater flexibility and a gentler learning curve."
    },
    systems: {
      centerLabel: "The Essence",
      left: {
        id: "tarot",
        title: "Tarot",
        introduction: "A structured 78-card system rooted in archetypes, elemental suits, numerical patterns, and centuries of evolving interpretation."
      },
      right: {
        id: "oracle",
        title: "Oracle Cards",
        tabLabel: "Oracle",
        introduction: "An open-ended category of decks whose card count, imagery, themes, and reading method are defined by each individual creator."
      }
    },
    comparisonRows: [
      {
        id: "deck-structure",
        label: "Deck Structure",
        icon: "/assets/icons/symbols/archive_rooms1.svg",
        left: "Traditionally 78 cards: 22 Major Arcana and 56 Minor Arcana divided among Wands, Cups, Swords, and Pentacles.",
        right: "Varies by deck. Oracle decks may contain a small focused collection or a much larger set, with no required card count, suits, or arcana."
      },
      {
        id: "symbolism-themes",
        label: "Symbolism & Themes",
        icon: "/assets/icons/symbols/dream.svg",
        left: "Built around recurring archetypes, numbers, elemental suits, court cards, and established symbolic relationships.",
        right: "Themes depend entirely on the deck and may explore nature, affirmations, animals, mythology, emotions, spirituality, creativity, or another focused subject."
      },
      {
        id: "meaning-system",
        label: "Meaning System",
        icon: "/assets/icons/symbols/guided-reflection.svg",
        left: "Cards have recognizable traditional meanings that readers interpret through context, position, surrounding cards, personal reflection, and deck imagery.",
        right: "Meanings are usually specific to the deck creator’s intended system and accompanying guidebook, although readers may also develop personal associations."
      },
      {
        id: "flexibility",
        label: "Flexibility",
        icon: "/assets/icons/symbols/yin_yang.svg",
        left: "Flexible in interpretation, but grounded within a shared structure that remains recognizable across most Tarot decks.",
        right: "Highly flexible because every deck can define its own structure, tone, card relationships, and reading approach."
      },
      {
        id: "reading-style",
        label: "Reading Style",
        icon: "/assets/icons/symbols/reading.svg",
        left: "Often layered, narrative, archetypal, and suited to questions that benefit from reflection, complexity, and multiple perspectives.",
        right: "Often direct, thematic, encouraging, or focused, depending on the deck’s purpose and the creator’s interpretive style."
      },
      {
        id: "reversals",
        label: "Reversals",
        icon: "/assets/icons/symbols/return.png",
        left: "Some readers use reversed cards to explore blocked, delayed, internalized, imbalanced, or redirected expressions of a card’s energy.",
        right: "Reversals depend upon the individual deck. Some creators include them, while many Oracle systems are intended to be read upright."
      },
      {
        id: "learning-curve",
        label: "Learning Curve",
        icon: "/assets/icons/symbols/journal1.svg",
        left: "Requires learning a consistent symbolic system, but that knowledge transfers across many Tarot decks.",
        right: "May be easier to begin with, though every new deck can introduce a different vocabulary and interpretive framework."
      },
      {
        id: "ideal-use-cases",
        label: "Ideal Use Cases",
        icon: "/assets/icons/symbols/star.svg",
        left: "Well suited to layered reflection, personal growth, relationship dynamics, career questions, patterns, choices, and complex spreads.",
        right: "Well suited to focused themes, daily reflection, affirmations, concise prompts, creative inspiration, and deck-specific guidance."
      }
    ],
    leftExamples: {
      heading: "Tarot Examples",
      note: "Examples from Astral Veil’s 78-card Tarot library.",
      cards: [
        { slug: "the-star" },
        { slug: "the-empress" },
        { slug: "ace-of-swords" },
        { slug: "ten-of-pentacles" }
      ]
    },
    rightExamples: {
      heading: "Conceptual Oracle Examples",
      note: "Conceptual examples shown for educational comparison. Astral Veil’s Oracle collection is still in development.",
      cards: [
        {
          id: "inner-compass",
          title: "Inner Compass",
          caption: "Reflect on the direction that feels most aligned with your values.",
          icon: "/assets/icons/symbols/clarity.png"
        },
        {
          id: "open-heart",
          title: "Open Heart",
          caption: "Consider what you are ready to receive, express, or understand.",
          icon: "/assets/icons/symbols/heart.svg"
        },
        {
          id: "sacred-pause",
          title: "Sacred Pause",
          caption: "Create space before deciding what should happen next.",
          icon: "/assets/icons/symbols/stillness.png"
        },
        {
          id: "release",
          title: "Release",
          caption: "Notice what has completed its purpose and may be ready to leave.",
          icon: "/assets/icons/symbols/release.png"
        }
      ]
    },
    decision: {
      heading: "Which Path Calls to You?",
      introduction: "Neither system is universally better. The stronger choice is the one whose structure, symbolism, and reading style support the question you are asking and the way you prefer to reflect.",
      left: {
        heading: "Choose Tarot if you want:",
        items: [
          "A consistent 78-card structure",
          "Archetypal and symbolic depth",
          "A system that rewards long-term study",
          "Complex narratives and multi-card spreads",
          "Meanings that transfer between decks"
        ]
      },
      right: {
        heading: "Choose Oracle Cards if you want:",
        items: [
          "A deck built around one specific theme",
          "Greater freedom in card count and structure",
          "Direct prompts or focused reflection",
          "A gentler introduction to card reading",
          "A deck whose tone strongly reflects its creator"
        ]
      },
      tarotCta: {
        label: "Explore Tarot",
        route: "/tarot"
      },
      rightCta: {
        label: "Oracle Collection in Development"
      }
    },
    together: {
      heading: "Can Tarot and Oracle Cards Be Used Together?",
      copy: "Yes. Some readers use Tarot as the primary structured reading and draw an Oracle card afterward as a theme, closing reflection, or practical prompt. The systems should remain distinguishable so the Oracle card supports the reading rather than replacing the Tarot narrative.",
      steps: [
        "Ask the question",
        "Complete the Tarot spread",
        "Interpret the Tarot narrative",
        "Draw one Oracle card as a final theme or reflection"
      ]
    },
    faqSection: {
      eyebrow: "Tarot and Oracle FAQ",
      heading: "Questions About Tarot vs. Oracle Cards",
      introduction: "Both systems can support reflection without offering supernatural certainty. Their usefulness depends on the deck, the question, and the care brought to interpretation."
    },
    faq: [
      {
        question: "What is the main difference between Tarot and Oracle cards?",
        answer: "Tarot usually follows a recognizable 78-card structure containing the Major and Minor Arcana, four suits, court cards, and shared traditional meanings. Oracle cards have no universal structure. Each creator determines the deck’s size, theme, imagery, card relationships, and intended method of interpretation."
      },
      {
        question: "Are Oracle cards easier to learn than Tarot?",
        answer: "Oracle cards may feel easier at first because a deck can use direct prompts, focused themes, or a smaller vocabulary. Tarot asks readers to learn a consistent symbolic structure, but that knowledge transfers across many Tarot decks. A new Oracle deck may introduce an entirely different system, so ease depends on the individual deck and reader."
      },
      {
        question: "Can beginners use both Tarot and Oracle cards?",
        answer: "Yes. Beginners can study Tarot while also using an Oracle deck for concise reflection or a closing prompt. Keeping the systems distinct helps: learn how the Tarot spread creates its narrative, then notice how an Oracle card adds a theme without replacing the structure already present."
      },
      {
        question: "Are Oracle cards more accurate than Tarot?",
        answer: "Neither system is objectively more accurate, and neither can guarantee supernatural certainty or an unchangeable outcome. A reading’s usefulness depends on the question, the deck, the reader’s knowledge, context, evidence, and willingness to preserve personal judgment and agency."
      },
      {
        question: "Can Tarot and Oracle cards be used together?",
        answer: "Yes. One common approach is to complete and interpret a Tarot spread first, then draw one Oracle card as a final theme, reflection, or practical prompt. This preserves Tarot’s structured narrative while allowing the Oracle deck to offer a focused closing perspective."
      },
      {
        question: "Do Oracle cards use reversed meanings?",
        answer: "It depends on the deck. Some Oracle creators provide reversed meanings or invite reversed cards, while many Oracle systems are designed to be read upright. Follow the individual deck’s guidebook and your chosen method rather than assuming that every Oracle deck handles reversals in the same way."
      }
    ],
    relatedLinks: [
      {
        label: "Explore the Tarot hub and full 78-card library",
        route: "/tarot",
        copy: "Browse every Major and Minor Arcana card, compare meanings, and enter the wider Tarot archive."
      },
      {
        label: "Compare Tarot and Lenormand",
        route: "/tarot/compare/tarot-vs-lenormand/",
        copy: "Explore how Tarot’s layered archetypes differ from Lenormand’s concise, combination-based symbolic language."
      },
      {
        label: "Explore The Star Tarot meaning",
        route: "/tarot/the-star/",
        copy: "Read The Star’s upright and reversed meanings, symbolism, and reflective guidance."
      },
      {
        label: "Explore The Empress Tarot meaning",
        route: "/tarot/the-empress/",
        copy: "Consider creativity, nurture, abundance, embodiment, and receptive strength."
      },
      {
        label: "Explore Ace of Swords Tarot meaning",
        route: "/tarot/ace-of-swords/",
        copy: "Explore clarity, truth, intellectual beginnings, communication, and decisive awareness."
      },
      {
        label: "Explore Ten of Pentacles Tarot meaning",
        route: "/tarot/ten-of-pentacles/",
        copy: "Reflect on legacy, stability, shared resources, continuity, and long-term foundations."
      }
    ],
    seo: {
      title: "Tarot vs. Oracle Cards: Differences & Uses | Astral Veil",
      description: "Compare Tarot vs. Oracle cards, including deck structure, symbolism, meanings, reversals, reading styles, learning curves, examples, best uses, and how to choose the right system.",
      ogTitle: "Tarot vs. Oracle Cards",
      ogDescription: "Explore the differences between Tarot and Oracle cards, including structure, symbolism, interpretation, learning style, examples, and when to use each system.",
      lastModified: "2026-07-25"
    }
  },
  {
    id: "tarot-vs-lenormand",
    slug: "tarot-vs-lenormand",
    eyebrow: "Compare · Read · Understand",
    title: "Tarot vs. Lenormand",
    introduction: "Tarot and Lenormand are both card-reading systems, but they speak in different languages. Tarot explores archetypes, inner patterns, and layered symbolic meaning, while Lenormand combines practical symbols to describe situations, relationships, movement, and everyday circumstances more directly.",
    breadcrumbLabel: "Tarot vs. Lenormand",
    schemaAbout: "The differences between Tarot and Lenormand",
    hubTile: {
      key: "tarot-vs-lenormand",
      ctaLabel: "Compare Tarot and Lenormand",
      imageSide: "right"
    },
    hero: {
      regularImage: "/assets/images/background%20_images/tarot-vs-lenormand-hero.webp",
      bloodMoonImage: "/assets/images/background%20_images/tarot-vs-lenormand-hero-bloodmoon.webp",
      width: 1672,
      height: 941,
      regularAlt: "Lenormand cards arranged beside candles and a crystal sphere on a midnight-blue celestial table",
      bloodMoonAlt: "Lenormand cards arranged beneath a red moon beside a glowing ritual lantern"
    },
    directAnswer: {
      eyebrow: "The Direct Answer",
      copy: "Tarot traditionally contains 78 cards organized through the Major Arcana, four Minor Arcana suits, court cards, numbers, and recurring archetypes. Lenormand traditionally contains 36 cards built from direct everyday symbols whose meanings become more specific through card order, proximity, and combinations.",
      takeaway: "Choose Tarot when you want layered reflection, archetypal meaning, and psychological or spiritual depth. Choose Lenormand when you want concise situational language, practical details, and answers shaped strongly by how several cards interact."
    },
    systems: {
      centerLabel: "The Essence",
      left: {
        id: "tarot",
        title: "Tarot",
        introduction: "A structured 78-card system using archetypes, elemental suits, numbers, court cards, and layered meanings to explore experiences from multiple perspectives."
      },
      right: {
        id: "lenormand",
        title: "Lenormand",
        tabLabel: "Lenormand",
        introduction: "A 36-card system using recognizable everyday symbols that become increasingly specific when read through sequence, proximity, and combination."
      }
    },
    comparisonRows: [
      {
        id: "deck-structure",
        label: "Deck Structure",
        icon: "/assets/icons/symbols/archive_rooms1.svg",
        left: "Traditionally 78 cards: 22 Major Arcana and 56 Minor Arcana divided among Wands, Cups, Swords, and Pentacles, including sixteen court cards.",
        right: "Traditionally 36 cards, each centered on a practical symbol such as the Rider, Clover, Ship, House, Tree, Fox, Key, Heart, Coffin, or Cross."
      },
      {
        id: "symbolic-language",
        label: "Symbolic Language",
        icon: "/assets/icons/symbols/dream.svg",
        left: "Uses layered archetypes, elemental associations, numbers, figures, scenes, and symbolic relationships that can support psychological, spiritual, and narrative interpretation.",
        right: "Uses direct recognizable symbols from everyday life. Individual symbols are concise, while neighboring cards shape how their meaning becomes specific."
      },
      {
        id: "reading-method",
        label: "Reading Method",
        icon: "/assets/icons/symbols/reading.svg",
        left: "Each card can carry substantial meaning on its own, while position, orientation, surrounding cards, imagery, and the question deepen the reading.",
        right: "Cards are commonly read in sequence and combination. Meaning often depends less on one isolated card and more on how nearby symbols modify one another."
      },
      {
        id: "card-combinations",
        label: "Card Combinations",
        icon: "/assets/icons/symbols/integration.png",
        left: "Combinations add layers and narrative relationships, but individual cards still retain strong independent meanings.",
        right: "Combinations are central. A card’s meaning can change substantially depending on which symbols appear before, after, or beside it."
      },
      {
        id: "reversals",
        label: "Reversals",
        icon: "/assets/icons/symbols/return.png",
        left: "Some readers use reversed cards to explore blocked, delayed, internalized, imbalanced, or redirected expressions of a card’s energy.",
        right: "Traditional Lenormand generally does not rely on reversed cards. Direction, position, distance, and neighboring combinations provide the changing context."
      },
      {
        id: "timing",
        label: "Timing",
        icon: "/assets/icons/symbols/calendar.svg",
        left: "Timing may be approached symbolically through card energy, numbers, suits, astrology, or the development shown across a spread, but methods differ.",
        right: "Timing is often approached more directly through card speed, distance, sequence, traditional associations, and the practical circumstances shown in the spread."
      },
      {
        id: "question-style",
        label: "Question Style",
        icon: "/assets/icons/symbols/question.svg",
        left: "Well suited to reflective questions involving patterns, emotional dynamics, personal development, meaning, choices, and complex inner experience.",
        right: "Well suited to focused situational questions involving communication, movement, work, relationships, obstacles, decisions, practical developments, and likely directions."
      },
      {
        id: "learning-curve",
        label: "Learning Curve",
        icon: "/assets/icons/symbols/journal1.svg",
        left: "Requires learning a larger shared symbolic system, but that understanding transfers across many Tarot decks and reading styles.",
        right: "Uses fewer cards and simpler individual symbols, but fluent reading requires learning combinations, sentence-like sequences, houses, proximity, and spread techniques."
      },
      {
        id: "ideal-use-cases",
        label: "Ideal Use Cases",
        icon: "/assets/icons/symbols/star.svg",
        left: "Layered reflection, personal growth, relationship dynamics, career questions, emotional exploration, archetypal study, and complex multi-card narratives.",
        right: "Direct situational reading, practical questions, concise developments, communication, timing, everyday circumstances, and detailed combination-based spreads."
      }
    ],
    leftExamples: {
      heading: "Tarot Examples",
      note: "Examples from Astral Veil’s 78-card Tarot library.",
      cards: [
        { slug: "the-magician" },
        { slug: "two-of-cups" },
        { slug: "the-moon" },
        { slug: "eight-of-pentacles" }
      ]
    },
    rightExamples: {
      eyebrow: "A Practical Symbolic Vocabulary",
      heading: "Conceptual Lenormand Examples",
      note: "Conceptual examples shown for educational comparison. Astral Veil’s Lenormand deck and card library are still in development.",
      cards: [
        {
          id: "rider",
          title: "Rider",
          caption: "News, arrival, movement, a messenger, or something approaching.",
          icon: "/assets/icons/symbols/arrow-long-right.svg"
        },
        {
          id: "ship",
          title: "Ship",
          caption: "Distance, travel, trade, expansion, or movement beyond familiar territory.",
          icon: "/assets/icons/symbols/artifacts1.svg"
        },
        {
          id: "key",
          title: "Key",
          caption: "Certainty, access, significance, discovery, or a solution becoming available.",
          icon: "/assets/icons/symbols/security.svg"
        },
        {
          id: "heart",
          title: "Heart",
          caption: "Affection, emotional importance, desire, connection, or what is deeply valued.",
          icon: "/assets/icons/symbols/heart.svg"
        }
      ]
    },
    decision: {
      heading: "Which Path Calls to You?",
      introduction: "Neither system is universally better. The stronger choice depends on whether you want layered archetypal reflection or a direct symbolic language built through combinations and practical context.",
      left: {
        heading: "Choose Tarot if you want:",
        items: [
          "A consistent 78-card structure",
          "Archetypal and psychological depth",
          "Cards with strong independent meanings",
          "Layered narratives and reflective spreads",
          "A system that transfers across many decks"
        ]
      },
      right: {
        heading: "Choose Lenormand if you want:",
        items: [
          "A concise 36-card symbolic vocabulary",
          "Practical and situational questions",
          "Meanings shaped strongly through combinations",
          "Direct language and observable circumstances",
          "Detailed sequence and proximity-based readings"
        ]
      },
      tarotCta: {
        label: "Explore Tarot",
        route: "/tarot"
      },
      rightCta: {
        label: "Lenormand Collection in Development"
      }
    },
    together: {
      heading: "Can Tarot and Lenormand Be Used Together?",
      copy: "Yes. Some readers use Tarot to explore the deeper emotional, archetypal, or psychological context of a question, then use a short Lenormand line to examine practical details, movement, communication, or likely situational developments. The two systems should remain distinguishable so each contributes its own language.",
      steps: [
        "Ask a focused question",
        "Complete the Tarot spread for broader context",
        "Interpret the central Tarot themes",
        "Draw a short Lenormand line for practical details or developments"
      ],
      note: "Lenormand combinations should be interpreted as a sequence rather than as isolated one-card meanings."
    },
    faqSection: {
      eyebrow: "Tarot and Lenormand FAQ",
      heading: "Questions About Tarot vs. Lenormand",
      introduction: "Both systems can support reflection without guaranteeing predictions. Their usefulness depends on the question, the reading method, context, and the care brought to interpretation."
    },
    faq: [
      {
        question: "What is the main difference between Tarot and Lenormand?",
        answer: "Tarot uses a shared 78-card structure and layered archetypal meanings that can support reflective, psychological, spiritual, and narrative interpretation. Lenormand traditionally uses 36 direct everyday symbols whose meaning becomes more specific through sequence, proximity, and combinations with neighboring cards."
      },
      {
        question: "Is Lenormand easier to learn than Tarot?",
        answer: "Lenormand has fewer cards and its individual symbols can appear simpler, but fluent reading requires learning combinations, sentence-like sequences, houses, proximity, and spread techniques. Tarot has more cards and a larger symbolic structure, yet much of that knowledge transfers across decks. Ease depends on the reader and the method being studied."
      },
      {
        question: "Is Lenormand more predictive than Tarot?",
        answer: "Lenormand is often phrased in direct situational language, which can make a reading feel more concrete, but neither Lenormand nor Tarot guarantees future events or supernatural certainty. Any reading should preserve personal judgment, consider available evidence and context, and treat likely directions as changeable rather than fixed."
      },
      {
        question: "Can Tarot and Lenormand be used together?",
        answer: "Yes. Tarot can explore broader emotional, archetypal, or psychological context, while a short Lenormand line can examine practical details, communication, movement, or situational developments. Reading each system according to its own method helps their distinct languages complement one another."
      },
      {
        question: "Does Lenormand use reversed cards?",
        answer: "Traditional Lenormand generally does not rely on reversed cards. Direction, position, distance, houses, and neighboring combinations provide changing context. Some modern readers may create personal reversal methods, but reversals are not required for established Lenormand practice."
      },
      {
        question: "Should a beginner learn Tarot or Lenormand first?",
        answer: "Start with the system that best matches the questions you want to explore. Tarot may suit layered reflection, archetypal study, and cards with strong independent meanings. Lenormand may suit focused practical questions and combination-based reading. Learning one system’s foundations clearly before blending methods can make either path easier to understand."
      }
    ],
    relatedSectionHeading: "Explore Tarot and Related Comparisons",
    relatedLinks: [
      {
        label: "Explore the Tarot hub and complete 78-card library",
        route: "/tarot",
        copy: "Browse the complete Major and Minor Arcana library, card meanings, topics, and Tarot resources."
      },
      {
        label: "Compare Tarot and Oracle Cards",
        route: "/tarot/compare/tarot-vs-oracle-cards/",
        copy: "See how Tarot’s shared structure differs from flexible, deck-specific Oracle systems."
      },
      {
        label: "Explore The Magician Tarot meaning",
        route: "/tarot/the-magician/",
        copy: "Read The Magician’s upright and reversed meanings, symbolism, and reflective guidance."
      },
      {
        label: "Explore Two of Cups Tarot meaning",
        route: "/tarot/two-of-cups/",
        copy: "Consider partnership, reciprocity, connection, communication, and mutual recognition."
      },
      {
        label: "Explore The Moon Tarot meaning",
        route: "/tarot/the-moon/",
        copy: "Explore uncertainty, intuition, imagination, ambiguity, and what remains partially hidden."
      },
      {
        label: "Explore Eight of Pentacles Tarot meaning",
        route: "/tarot/eight-of-pentacles/",
        copy: "Reflect on practice, skill, steady effort, craftsmanship, and meaningful improvement."
      }
    ],
    seo: {
      title: "Tarot vs. Lenormand: Differences & Uses | Astral Veil",
      description: "Compare Tarot vs. Lenormand, including deck size, symbolism, combinations, reversals, timing, reading methods, examples, best uses, and how to choose between them.",
      ogTitle: "Tarot vs. Lenormand",
      ogDescription: "Explore how Tarot and Lenormand differ in structure, symbolism, card combinations, timing, reading style, learning curve, and practical use.",
      lastModified: "2026-07-25"
    }
  }
];
