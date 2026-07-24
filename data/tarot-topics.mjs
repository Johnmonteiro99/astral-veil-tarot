export const tarotTopics = [
  {
    id: "love-relationships",
    slug: "love-relationships",
    eyebrow: "Tarot · Love & Relationships",
    title: "Tarot for Love & Relationships",
    introduction: "Love is shaped by connection, trust, desire, communication, boundaries, and the choices we make within them. Tarot can help illuminate emotional patterns, clarify relationship dynamics, and create space for more conscious decisions.",
    hero: {
      standardImage: "/assets/images/background%20_images/love-relationships.png",
      bloodMoonImage: "/assets/images/background%20_images/bloodmoon-love-relationships.png",
      width: 1024,
      height: 1536,
      bloodMoonWidth: 1122,
      bloodMoonHeight: 1402,
      alt: "Two celestial figures reaching toward one another beneath a luminous moon"
    },
    overview: {
      heading: "How Tarot Approaches Love Questions",
      copy: "Tarot does not guarantee romantic outcomes or reveal another person’s private mind with certainty. It offers a reflective language for exploring emotional patterns, choices, communication, compatibility, expectations, and the energy surrounding a connection."
    },
    benefits: [
      {
        title: "Clarity",
        copy: "Understand your emotions, needs, desires, and relationship patterns.",
        icon: "/assets/icons/symbols/clarity.png",
        iconWidth: 1254,
        iconHeight: 1254
      },
      {
        title: "Communication",
        copy: "Explore what needs to be expressed, heard, clarified, or approached differently.",
        icon: "/assets/icons/symbols/voice.png",
        iconWidth: 1254,
        iconHeight: 1254
      },
      {
        title: "Growth",
        copy: "Recognize lessons, boundaries, healing opportunities, and repeating dynamics.",
        icon: "/assets/icons/symbols/healing.png",
        iconWidth: 1254,
        iconHeight: 1254
      },
      {
        title: "Possibility",
        copy: "Consider potential directions without treating any outcome as guaranteed.",
        icon: "/assets/icons/symbols/becoming.png",
        iconWidth: 1254,
        iconHeight: 1254
      }
    ],
    themes: [
      "New Love & First Impressions",
      "Attraction & Chemistry",
      "Communication & Understanding",
      "Trust & Vulnerability",
      "Commitment & Partnership",
      "Boundaries & Independence",
      "Healing & Forgiveness",
      "Separation & Closure",
      "Reconciliation",
      "Self-Love & Emotional Readiness"
    ],
    featuredCards: [
      {
        slug: "the-lovers",
        summary: "Union, meaningful choice, shared values, vulnerability, and alignment."
      },
      {
        slug: "two-of-cups",
        summary: "Mutual recognition, reciprocity, partnership, attraction, and emotional exchange."
      },
      {
        slug: "ten-of-cups",
        summary: "Shared fulfillment, emotional belonging, family, harmony, and lasting connection."
      },
      {
        slug: "the-devil",
        summary: "Attachment, desire, dependency, temptation, and patterns that restrict emotional freedom."
      }
    ],
    chapterSection: {
      eyebrow: "The Landscape of Connection",
      heading: "Four Chapters of Love",
      introduction: "Love moves through beginnings, deepening connection, shared belonging, and the shadows that reveal where freedom or honesty has been lost. Each chapter carries its own questions, patterns, and guiding Tarot archetype."
    },
    chapters: [
      {
        id: "beginning",
        number: "01",
        title: "Beginning",
        subtitle: "Attraction, readiness, and meaningful choice",
        description: "Every connection begins before commitment. Attraction may open the door, but emotional readiness, values, and conscious choice determine whether possibility can develop into something real.",
        themes: [
          "New Love & First Impressions",
          "Attraction & Chemistry",
          "Self-Love & Emotional Readiness"
        ],
        featuredCardSlug: "the-lovers",
        featuredCardTitle: "The Lovers",
        cardSummary: "Union, meaningful choice, vulnerability, shared values, and the question of what we are willing to join or become.",
        linkLabel: "Explore The Lovers meaning"
      },
      {
        id: "connection",
        number: "02",
        title: "Connection",
        subtitle: "Communication, trust, and mutual recognition",
        description: "Connection deepens when two people can communicate honestly, remain distinct, and create enough trust for vulnerability to exist without control or self-erasure.",
        themes: [
          "Communication & Understanding",
          "Trust & Vulnerability",
          "Boundaries & Independence"
        ],
        featuredCardSlug: "two-of-cups",
        featuredCardTitle: "Two of Cups",
        cardSummary: "Mutual recognition, reciprocity, attraction, emotional exchange, and connection between equals.",
        linkLabel: "Explore Two of Cups meaning"
      },
      {
        id: "belonging",
        number: "03",
        title: "Belonging",
        subtitle: "Commitment, partnership, and shared emotional life",
        description: "Belonging is more than remaining together. It is the creation of a relationship spacious enough for truth, repair, difference, and the changing needs of everyone within it.",
        themes: [
          "Commitment & Partnership",
          "Healing & Forgiveness",
          "Reconciliation"
        ],
        featuredCardSlug: "ten-of-cups",
        featuredCardTitle: "Ten of Cups",
        cardSummary: "Shared fulfillment, family, emotional belonging, harmony, and relationships shaped by common values.",
        linkLabel: "Explore Ten of Cups meaning"
      },
      {
        id: "shadow",
        number: "04",
        title: "Shadow",
        subtitle: "Attachment, separation, and the recovery of emotional freedom",
        description: "The shadow chapter reveals where connection has become possession, repetition, avoidance, or fear. Its purpose is not to condemn desire, but to make the hidden cost of an attachment visible.",
        themes: [
          "Separation & Closure",
          "Dependency & Control",
          "Desire & Attachment"
        ],
        featuredCardSlug: "the-devil",
        featuredCardTitle: "The Devil",
        cardSummary: "Attachment, desire, dependency, temptation, shame, and patterns that quietly restrict emotional freedom.",
        linkLabel: "Explore The Devil meaning"
      }
    ],
    suggestedQuestions: [
      "What emotional pattern is shaping my love life right now?",
      "What do I need to understand about this connection?",
      "How can I communicate more honestly and constructively?",
      "What boundary would support healthier intimacy?",
      "What am I learning about myself through this relationship?",
      "What is preventing this connection from developing?",
      "How can I approach reconciliation with greater awareness?",
      "What does emotional readiness look like for me now?"
    ],
    orientation: {
      heading: "Two Ways a Card Can Speak",
      introduction: "Upright and reversed cards describe different ways the same energy may be expressed.",
      exampleCardSlug: "the-lovers",
      upright: {
        label: "Upright Expression",
        copy: "Upright cards often describe energy expressing more openly or moving into awareness.",
        concepts: [
          "Open expression",
          "Forward movement",
          "Conscious awareness"
        ]
      },
      reversed: {
        label: "Reversed Expression",
        copy: "Reversed cards may point to blocks, delays, internalized patterns, imbalance, avoidance, or a need for reassessment.",
        concepts: [
          "Blocked or delayed energy",
          "Internalized patterns",
          "Reassessment and redirection"
        ]
      },
      clarification: "A reversal is not automatically negative. It asks how the card’s energy is being lived, resisted, or redirected.",
      archiveNote: "A dedicated upright and reversed guide will be added to the Tarot Archive.",
      guideAvailable: false,
      guideRoute: "/tarot/guides/upright-reversed-meanings/"
    },
    ethics: {
      heading: "Reading Love Tarot Responsibly",
      introduction: "Love readings are most useful when they strengthen awareness and personal agency.",
      pullQuote: "The cards can illuminate a relationship, but they should never replace the people within it.",
      principles: [
        {
          title: "Communication",
          copy: "Tarot should not replace direct communication.",
          icon: "/assets/icons/symbols/voice.png",
          iconWidth: 1254,
          iconHeight: 1254
        },
        {
          title: "Privacy",
          copy: "Cards are not proof of another person’s private thoughts.",
          icon: "/assets/icons/symbols/privacy.svg",
          iconWidth: 800,
          iconHeight: 800
        },
        {
          title: "Freedom",
          copy: "Tarot should not justify controlling, monitoring, or testing someone.",
          icon: "/assets/icons/symbols/release.png",
          iconWidth: 1254,
          iconHeight: 1254
        },
        {
          title: "Agency",
          copy: "Questions about awareness, choices, boundaries, and agency create more useful reflection.",
          icon: "/assets/icons/symbols/identity.png",
          iconWidth: 1254,
          iconHeight: 1254
        },
        {
          title: "Perspective",
          copy: "Tarot can offer perspective, not guaranteed predictions.",
          icon: "/assets/icons/symbols/clarity.png",
          iconWidth: 1254,
          iconHeight: 1254
        }
      ]
    },
    readingCta: {
      heading: "Begin Your Love Reading",
      copy: "Bring your question into the cards and explore the emotional patterns, choices, and possibilities surrounding your connection.",
      primaryLabel: "Start a Love Reading",
      primaryRoute: "/",
      secondaryLabel: "Explore Love Card Meanings",
      secondaryRoute: "#important-love-cards",
      image: "/assets/images/background%20_images/start-reading.png",
      imageWidth: 1086,
      imageHeight: 1448,
      imageAlt: "A candlelit celestial reading space prepared for tarot"
    },
    relatedLinks: [
      {
        label: "Browse the complete Tarot card library",
        route: "/tarot",
        copy: "Explore all 78 cards, their upright meanings, reversals, and reflective guidance."
      },
      {
        label: "Explore the online Tarot reading experience",
        route: "/online-tarot-reading",
        copy: "Learn how Astral Veil’s reading flow works before drawing your cards."
      }
    ],
    faq: [
      {
        question: "Can tarot predict whether a relationship will last?",
        answer: "Tarot cannot guarantee a relationship’s future. It can help explore current dynamics, emotional patterns, communication, choices, and possible directions based on the circumstances presently surrounding the connection."
      },
      {
        question: "Can tarot tell me exactly how someone feels?",
        answer: "Tarot can support reflection on a relationship’s emotional energy, but it cannot verify another person’s private thoughts with certainty. Direct and respectful communication remains the clearest way to understand someone’s feelings."
      },
      {
        question: "What are the best tarot cards for love?",
        answer: "Cards such as The Lovers, Two of Cups, Ace of Cups, Ten of Cups, and The Empress are often associated with connection, openness, partnership, and emotional fulfillment. Their meaning still depends upon the question, position, surrounding cards, and whether the card appears upright or reversed."
      },
      {
        question: "What does a reversed love card mean?",
        answer: "A reversed card may describe blocked expression, imbalance, delay, avoidance, internal conflict, or a need to reconsider the situation. It does not automatically mean rejection, betrayal, or the end of a relationship."
      },
      {
        question: "What questions should I avoid asking in a love reading?",
        answer: "Avoid questions that demand certainty about another person’s private mind, attempt to control their decisions, or replace necessary communication. Questions about your own patterns, choices, boundaries, and understanding generally create more useful readings."
      },
      {
        question: "Can I use tarot after a breakup?",
        answer: "Yes. Tarot can provide a reflective structure for processing grief, understanding patterns, clarifying boundaries, and considering what healing or closure may require. It should support emotional processing rather than encourage fixation on an unavailable outcome."
      }
    ],
    seo: {
      title: "Love Tarot Meaning & Relationship Guidance | Astral Veil",
      description: "Explore tarot for love and relationships, including connection, feelings, communication, boundaries, important love cards, upright and reversed meanings, reflective questions, and responsible guidance.",
      ogTitle: "Tarot for Love & Relationships",
      ogDescription: "Explore love tarot meanings, relationship themes, important cards, reflective questions, upright and reversed guidance, and a more conscious approach to connection.",
      lastModified: "2026-07-23"
    }
  }
];
