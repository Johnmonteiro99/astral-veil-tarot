const imageRoot = "/assets/images/background%20_images";

const chapterImage = (file, width, height, alt, position = "center") => ({
  src: `${imageRoot}/${file}`,
  width,
  height,
  alt,
  position
});

const chapterCoverImage = (file, alt, position = "center") => ({
  src: `/assets/images/tarot_for_beginners/${file}`,
  width: 1122,
  height: 1402,
  alt,
  position
});

export const tarotForBeginners = {
  route: "/tarot/for-beginners/",
  seo: {
    title: "Tarot for Beginners: Deck Basics & First Steps | Astral Veil",
    description: "New to tarot? Learn what tarot is, what you need to begin, how the seventy-eight-card deck is structured, how to choose a deck, common myths, and where to study next.",
    modified: "2026-08-02"
  },
  hero: {
    eyebrow: "Your First Step Into Tarot",
    title: "Tarot for Beginners",
    subtitle: "Begin Before the First Card Turns",
    description: "Learn what tarot is, how the deck is organized, what you truly need to begin, and how to build familiarity without trying to memorize everything at once.",
    primaryLabel: "Enter the First Door",
    secondaryLabel: "Ready to Practice? Learn How to Read Tarot",
    secondaryRoute: "/how-to-read-tarot-cards/",
    imageAlt: "A luminous tarot study with cards, candles, books, and a celestial doorway"
  },
  welcome: {
    regular: {
      eyebrow: "Your First Guide Has Arrived",
      heading: "Welcome to the Beginning",
      greeting: [
        "You chose to begin. The Veil noticed.",
        "Come in. We will take this one card at a time."
      ],
      paragraphs: [
        "Learning tarot is not about becoming perfect at predicting what comes next. It is about learning to notice symbols, patterns, emotions, and possibilities with greater care.",
        "You do not need psychic abilities, a gifted deck, or all seventy-eight meanings memorized. Bring your curiosity. The rest can be learned one chapter at a time."
      ],
      truths: [
        { label: "There Is No Test", text: "You are here to explore, not prove yourself." },
        { label: "You May Move Slowly", text: "Understanding grows through familiarity, not speed." },
        { label: "Your Perspective Matters", text: "Tradition offers a foundation, but your attention helps the cards become meaningful." }
      ],
      primaryLabel: "Continue with Chapter 02",
      secondaryLabel: "View All Chapters",
      whisper: "Every reader once stood where you are now.",
      quote: "You are allowed to begin slowly."
    },
    bloodMoon: {
      eyebrow: "You Came Looking for Answers",
      heading: "Good. Start by Learning How to Question Them.",
      greeting: [
        "So, you actually came.",
        "Fine. Sit down. We can begin."
      ],
      paragraphs: [
        "So, you want to learn tarot. Perhaps you expected instant intuition, secret knowledge, and a dramatic revelation before the candles finished melting. Unfortunate. You will have to pay attention instead.",
        "The cards will not flatter you, think for you, or rescue you from uncertainty. They may, however, show you the pattern you keep pretending not to see. That is usually more useful."
      ],
      truths: [
        { label: "There Is No Test", text: "You will misunderstand cards. Excellent. Correcting yourself is how discernment develops." },
        { label: "You May Move Slowly", text: "Take your time. The cards are under no obligation to make sense on command." },
        { label: "Your Perspective Matters", text: "Tradition offers the bones. Your attention decides what refuses to stay buried." }
      ],
      primaryLabel: "Continue with Chapter 02",
      secondaryLabel: "View All Chapters",
      whisper: "Come closer. You have avoided the lesson long enough.",
      quote: "Begin slowly. The cards are not going anywhere."
    },
    images: {
      regular: chapterImage(
        "tarot_beginners_welcome_guide_default.png",
        1448,
        1086,
        "A welcoming tarot guide seated in a moonlit celestial library",
        "right center"
      ),
      bloodMoon: chapterImage(
        "tarot_beginners_welcome_guide_blood_moon.png",
        1448,
        1086,
        "A gothic tarot guide seated in a shadowed Blood Moon library",
        "right center"
      )
    }
  },
  library: {
    eyebrow: "The Illuminated Index",
    heading: "The Chapters Before You",
    introduction: "Choose the chapter that answers the question you are carrying now, or begin at the first page and follow the book in order."
  },
  chapters: [
    {
      id: "what-is-tarot",
      number: "01",
      navLabel: "What Is Tarot?",
      eyebrow: "The Beginning",
      title: "What Is Tarot, Really?",
      introduction: "Before learning the cards, understand what kind of symbolic system you are entering.",
      cardSummary: "Understand tarot as a deck, symbolic language, and interpretive tool.",
      coverImage: chapterCoverImage("01_what_is_tarot.png", "Tarot cards arranged before a celestial astrolabe and candlelight"),
      image: chapterImage("tarot-for-beginners.png", 1448, 1086, "A tarot deck resting beside an open guide and candlelight", "68% center"),
      academyLesson: {
        title: "What Is Tarot?",
        introContinuation: "This lesson unfolds in three chambers. Step through each one with presence.",
        headerVisual: {
          slot: "chapter-01-header",
          futureSrc: "/assets/images/tarot-for-beginners/chapter-01/header.webp",
          alt: "Placeholder for the future Chapter 01 atmospheric header artwork",
          ratio: "16 / 7"
        },
        chambers: [
          {
            id: "chamber-1",
            numeral: "I",
            label: "CHAMBER I",
            title: "What You Are Looking At",
            preview: "Step into the room of form. Here we explore the deck as an object, its structure, components, and the visible elements that make it what it is.",
            topics: ["The Deck", "The Cards", "The System"],
            visual: {
              slot: "chapter-01-chamber-01",
              futureSrc: "/assets/images/tarot-for-beginners/chapter-01/chamber-01.webp",
              alt: "Placeholder for future artwork showing tarot as a structured deck",
              ratio: "16 / 9"
            },
            learningVisual: {
              type: "stats",
              label: "Tarot deck structure",
              items: ["78 Cards", "Major and Minor Arcana", "Four Suits", "Number and Court Cards"]
            },
            sections: [
              {
                heading: "A Deck",
                paragraphs: ["Tarot is a seventy-eight-card system containing recurring figures, numbers, suits, archetypes, colors, objects, and narrative patterns."]
              }
            ],
            takeaway: "Tarot begins as a structured deck before it becomes an interpretive practice."
          },
          {
            id: "chamber-2",
            numeral: "II",
            label: "CHAMBER II",
            title: "What the Images Are Saying",
            preview: "Step into the room of symbols. Here we discover what the images communicate through archetypes, emotions, themes, and the symbolic language of tarot.",
            topics: ["Symbols", "Themes", "Archetypes"],
            visual: {
              slot: "chapter-01-chamber-02",
              futureSrc: "/assets/images/tarot-for-beginners/chapter-01/chamber-02.webp",
              alt: "Placeholder for future artwork exploring tarot imagery and symbols",
              ratio: "16 / 9"
            },
            learningVisual: {
              type: "examples",
              label: "Future tarot symbol examples",
              items: ["Example Symbol 01", "Example Symbol 02", "Example Symbol 03"]
            },
            sections: [
              {
                heading: "A Symbolic Language",
                paragraphs: ["Images communicate ideas about life, choices, emotions, relationships, conflict, movement, and transformation."]
              }
            ],
            takeaway: "The image is not merely decoration. It carries the vocabulary of the reading."
          },
          {
            id: "chamber-3",
            numeral: "III",
            label: "CHAMBER III",
            title: "How Meaning Is Created",
            preview: "Step into the room of synthesis. Here we learn how meaning emerges through connection, context, and the art of interpretation.",
            topics: ["Context", "Association", "Reflection"],
            visual: {
              slot: "chapter-01-chamber-03",
              futureSrc: "/assets/images/tarot-for-beginners/chapter-01/chamber-03.webp",
              alt: "Placeholder for future artwork illustrating how tarot interpretation develops",
              ratio: "16 / 9"
            },
            learningVisual: {
              type: "equation",
              label: "Interpretation model",
              items: ["Card", "Question", "Context", "Reader"],
              result: "Interpretation"
            },
            sections: [
              {
                heading: "An Interpretive Tool",
                paragraphs: [
                  "Meaning develops through the visible card, traditional associations, the question, context, and careful reflection.",
                  "Tarot does not guarantee certainty or remove personal responsibility. Within Astral Veil, the cards are treated as mirrors for patterns and possibilities rather than fixed verdicts."
                ]
              }
            ],
            takeaway: "Tarot offers perspective through symbols. It does not remove your ability to choose."
          }
        ],
        takeaway: "Tarot offers perspective through symbols. It does not remove your ability to choose."
      },
      takeaway: "Tarot offers perspective through symbols. It does not remove your ability to choose."
    },
    {
      id: "what-you-need",
      number: "02",
      navLabel: "What Do You Need?",
      eyebrow: "The Beginner’s Table",
      title: "What Do You Actually Need?",
      introduction: "Beginning tarot requires far less than many newcomers are led to believe.",
      cardSummary: "Learn what helps a beginner and what is completely optional.",
      coverImage: chapterCoverImage("02_what_do_you_need.png", "A beginner tarot practice arranged with cards, a journal, and candlelight"),
      image: chapterImage("tarot-study.png", 1672, 941, "A quiet tarot study table prepared with cards, a journal, and a reference book"),
      visual: {
        type: "table",
        caption: "A simple beginner study table",
        center: "Your Practice",
        items: ["Tarot Deck", "Reference", "Journal", "Time", "Curiosity"]
      },
      blocks: [
        {
          type: "features",
          items: [
            { heading: "A Tarot Deck", text: "Choose one whose imagery is readable and interesting enough to revisit." },
            { heading: "A Reliable Reference", text: "A useful guidebook or trusted card-meaning source gives you a foundation." },
            { heading: "A Journal", text: "Record what you notice before checking an established meaning." },
            { heading: "Time and Attention", text: "Familiarity develops through repeated observation." },
            { heading: "Willingness to Learn", text: "You do not need instant intuition. You need patience with the learning process." }
          ]
        },
        {
          type: "list",
          heading: "You Do Not Need",
          items: ["psychic abilities", "expensive ritual tools", "a gifted first deck", "perfect intuition", "every card memorized"]
        }
      ],
      takeaway: "Curiosity and attention matter more than ritual perfection."
    },
    {
      id: "choosing-your-first-deck",
      number: "03",
      navLabel: "Choosing a Deck",
      eyebrow: "Choosing Your Companion",
      title: "Which Tarot Deck Should You Begin With?",
      introduction: "The best first deck is one whose imagery you can understand and want to revisit.",
      cardSummary: "Find a first deck whose imagery and structure support learning.",
      coverImage: chapterCoverImage("03_choosing_a_deck.png", "A collection of tarot decks displayed in a candlelit celestial study"),
      image: chapterImage("decks-bg.png", 1086, 1448, "Several distinct tarot decks gathered in a moonlit archive", "center 46%"),
      visual: {
        type: "decks",
        caption: "Three approachable first-deck paths",
        center: "Choose for Study",
        items: ["Clear + Traditional", "Modern + Intuitive", "Abstract + Symbolic"]
      },
      blocks: [
        {
          type: "features",
          items: [
            { heading: "Clear and Traditional", text: "Useful for learning common symbols, familiar card structures, and established meanings." },
            { heading: "Modern and Intuitive", text: "Useful when emotional expression and accessible imagery help you connect with a card." },
            { heading: "Abstract and Symbolic", text: "Beautiful and meaningful, but potentially more difficult before the basic tarot structure becomes familiar." }
          ]
        },
        {
          type: "list",
          heading: "What to Consider",
          items: ["guidebook quality", "card size", "symbolic consistency", "readable artwork", "whether it follows a recognizable tarot system", "whether you genuinely want to study it"]
        },
        {
          type: "note",
          heading: "A Common Myth",
          text: "Your first tarot deck does not need to be gifted to you."
        },
        {
          type: "links",
          items: [{ label: "Explore Astral Veil Tarot Decks", route: "/decks" }]
        }
      ],
      takeaway: "Choose a deck you can study, not merely one you can admire."
    },
    {
      id: "inside-the-deck",
      number: "04",
      navLabel: "Inside the Deck",
      eyebrow: "Inside the Deck",
      title: "What Lives Inside Seventy-Eight Cards?",
      introduction: "The deck becomes easier to understand once you see its internal structure.",
      cardSummary: "See how seventy-eight cards divide into Arcana, suits, numbers, and courts.",
      coverImage: chapterCoverImage("04_inside_the_deck.png", "Tarot cards arranged to reveal the structure inside a complete deck"),
      image: chapterImage("minor-arcana-explained.png", 1448, 1086, "Four symbolic tarot cards arranged as part of a complete deck", "38% 62%"),
      visual: {
        type: "split",
        caption: "The structure of a seventy-eight-card tarot deck",
        center: "78 Cards",
        items: ["22 Major Arcana", "56 Minor Arcana", "Wands", "Cups", "Swords", "Pentacles"]
      },
      blocks: [
        {
          type: "features",
          items: [
            { heading: "78 Cards", text: "A complete tarot deck brings the Major and Minor Arcana into one symbolic system." },
            { heading: "22 Major Arcana", text: "Larger archetypes, transitions, lessons, and turning points." },
            { heading: "56 Minor Arcana", text: "Everyday experiences expressed through suits, numbers, and court cards." }
          ]
        },
        {
          type: "features",
          heading: "Four Suits",
          items: [
            { heading: "Wands", text: "action, creativity, drive, and will" },
            { heading: "Cups", text: "emotion, relationships, intuition, and imagination" },
            { heading: "Swords", text: "thought, communication, truth, and conflict" },
            { heading: "Pentacles", text: "work, resources, stability, body, and material life" }
          ]
        },
        {
          type: "links",
          items: [
            { label: "Explore the Major Arcana", route: "/tarot/major-arcana/" },
            { label: "Understand the Minor Arcana", route: "/tarot/minor-arcana/" }
          ]
        }
      ],
      takeaway: "The Major Arcana describes larger movements. The Minor Arcana describes how life moves through them."
    },
    {
      id: "learning-card-meanings",
      number: "05",
      navLabel: "Learning Meanings",
      eyebrow: "Learning the Language",
      title: "Do You Need to Memorize Every Card?",
      introduction: "Tarot becomes easier when you learn relationships and patterns instead of isolated definitions.",
      cardSummary: "Learn patterns and context without memorizing rigid definitions.",
      coverImage: chapterCoverImage("05_learning_meanings.png", "An open tarot study with cards and symbolic references for learning meanings"),
      image: chapterImage("history-symbolic-correspondences.webp", 1672, 941, "An open symbolic study with tarot cards, diagrams, and reference books"),
      visual: {
        type: "layers",
        caption: "Four connected layers of interpretation",
        center: "One Card",
        items: ["Image", "Tradition", "Context", "Personal Response"]
      },
      blocks: [
        {
          type: "features",
          items: [
            { heading: "Image", text: "What figures, objects, colors, movements, and environments are visible?" },
            { heading: "Tradition", text: "What ideas have historically been associated with the card?" },
            { heading: "Context", text: "How do the question, position, and surrounding cards affect the meaning?" },
            { heading: "Personal Response", text: "What does the card bring to your attention, and is that response supported by the image?" }
          ]
        },
        {
          type: "list",
          heading: "Study Methods",
          items: ["learn two or three useful meanings first", "compare cards by suit", "compare cards by number", "compare court-card ranks", "record first impressions", "check a reference afterward", "revisit the same card later"]
        },
        {
          type: "links",
          items: [
            { label: "Browse All Tarot Card Meanings", route: "/tarot#tarot-title" },
            { label: "Learn How to Read Tarot", route: "/how-to-read-tarot-cards/" }
          ]
        }
      ],
      takeaway: "Learn the language of tarot, not seventy-eight rigid definitions."
    },
    {
      id: "tarot-myths",
      number: "06",
      navLabel: "Tarot Myths",
      eyebrow: "Myth and Reality",
      title: "What Are Beginners Often Told?",
      introduction: "Some of tarot’s most repeated rules are customs, assumptions, or misunderstandings rather than requirements.",
      cardSummary: "Separate useful tradition from assumptions and repeated misinformation.",
      coverImage: chapterCoverImage("06_tarot_myths.png", "Shadowed tarot cards and symbols representing myths about the practice"),
      image: chapterImage("upright-reverse.png", 1024, 1536, "A tarot card reflected in upright and reversed orientations", "center 42%"),
      visual: {
        type: "balance",
        caption: "Repeated tarot myths reconsidered through practice",
        center: "Look Again",
        items: ["Myth", "Reality"]
      },
      blocks: [
        {
          type: "pairs",
          items: [
            { myth: "You must be psychic.", reality: "Tarot develops through observation, study, context, practice, and reflection." },
            { myth: "Your first deck must be gifted.", reality: "You may choose your own deck." },
            { myth: "You must memorize all seventy-eight cards before beginning.", reality: "Familiarity grows through comparison and repeated use." },
            { myth: "Reversed cards are always negative.", reality: "Reversals may express blocked, delayed, internalized, excessive, or redirected energy." },
            { myth: "Tarot predicts one fixed future.", reality: "Tarot explores patterns, possibilities, and choices within the present context." },
            { myth: "A difficult card guarantees a difficult event.", reality: "A challenging card may identify tension, responsibility, fear, change, or something requiring attention." },
            { myth: "You should never read for yourself.", reality: "Self-reading can be useful when paired with honesty, boundaries, and awareness of bias." }
          ]
        }
      ],
      takeaway: "A tradition can guide you without becoming a cage."
    },
    {
      id: "first-week-with-tarot",
      number: "07",
      navLabel: "First Week",
      eyebrow: "Seven Days of Familiarity",
      title: "What Should Your First Week Look Like?",
      introduction: "The first week should build familiarity with the deck rather than pressure to perform readings.",
      cardSummary: "Follow a calm seven-day study path for becoming familiar with the deck.",
      coverImage: chapterCoverImage("07_first_week.png", "A tarot journal and cards arranged for a first week of quiet practice"),
      image: chapterImage("history-tarot-today-reflection.webp", 1536, 1024, "A journal, tarot cards, and candlelight arranged for a week of quiet study"),
      visual: {
        type: "bookmarks",
        caption: "Seven gentle points of study for your first week",
        center: "First Week",
        items: ["01", "02", "03", "04", "05", "06", "07"]
      },
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "Day 01", heading: "Meet the Deck", text: "Look through all seventy-eight cards without trying to interpret everything." },
            { label: "Day 02", heading: "Find the Major Arcana", text: "Observe the sequence from The Fool to The World." },
            { label: "Day 03", heading: "Separate the Four Suits", text: "Notice the visual atmosphere and recurring symbols of each suit." },
            { label: "Day 04", heading: "Follow the Numbers", text: "Compare Aces, Twos, Threes, or another number across all four suits." },
            { label: "Day 05", heading: "Meet the Court Cards", text: "Observe Pages, Knights, Queens, and Kings as roles, personalities, and modes of expression." },
            { label: "Day 06", heading: "Study One Card Deeply", text: "Record its visible imagery, keywords, traditional meaning, and your response." },
            { label: "Day 07", heading: "Choose Your Next Path", text: "Continue into card meanings, spreads, or the How to Read Tarot course." }
          ]
        }
      ],
      takeaway: "Familiarity grows through repeated attention, not rushed interpretation."
    },
    {
      id: "beginner-mistakes",
      number: "08",
      navLabel: "Common Mistakes",
      eyebrow: "Pressure and Perspective",
      title: "What If You Feel Like You Are Doing It Wrong?",
      introduction: "Most beginner mistakes are signs of uncertainty, not failure.",
      cardSummary: "Understand why beginner uncertainty is normal and how to work through it.",
      coverImage: chapterCoverImage("08_common_mistakes.png", "A candlelit tarot table arranged for correcting common beginner mistakes"),
      image: chapterImage("how-to-read-tarot.png", 1448, 1086, "Hands bringing order to tarot cards on a candlelit reading table", "70% center"),
      visual: {
        type: "clarity",
        caption: "A crowded reading table becoming clear one choice at a time",
        center: "Return to the Question",
        items: ["Pause", "Observe", "Simplify", "Reflect"]
      },
      blocks: [
        {
          type: "features",
          items: [
            { heading: "Trying to Memorize Everything", text: "Begin with patterns and small groups of meanings." },
            { heading: "Drawing Too Many Clarifiers", text: "More cards do not always create more clarity." },
            { heading: "Asking the Same Question Repeatedly", text: "Repeated readings may reflect discomfort with the answer rather than a lack of information." },
            { heading: "Forgetting the Original Question", text: "Return each interpretation to the actual inquiry." },
            { heading: "Using Only Keywords", text: "Keywords begin the interpretation. They do not complete it." },
            { heading: "Treating Every Reversal as Negative", text: "Context matters more than automatic opposites." },
            { heading: "Expecting Instant Certainty", text: "Tarot often offers perspective rather than closure." },
            { heading: "Comparing Yourself to Experienced Readers", text: "Confidence develops through time, correction, and familiarity." }
          ]
        },
        {
          type: "paragraphs",
          paragraphs: ["These are not signs that you are failing. They are signs that you are discovering where your learning needs structure."]
        }
      ],
      takeaway: "Confusion is not proof that you cannot learn. It is evidence that you are still learning."
    },
    {
      id: "tarot-glossary",
      number: "09",
      navLabel: "Glossary",
      eyebrow: "The Beginner’s Index",
      title: "Which Tarot Words Should You Know?",
      introduction: "A small vocabulary will make every guide, card meaning, and spread easier to understand.",
      cardSummary: "Learn the essential words used throughout tarot study.",
      coverImage: chapterCoverImage("09_tarot_glossary.png", "An illuminated tarot glossary surrounded by celestial symbols"),
      image: chapterImage("history-faq-celestial-emblem.webp", 1254, 1254, "A celestial compass emblem representing an index of tarot terms"),
      visual: {
        type: "index",
        caption: "A compact index for the language of tarot",
        center: "Tarot Index",
        items: ["Arcana", "Suit", "Spread", "Position", "Archetype", "Intuition"]
      },
      blocks: [
        {
          type: "glossary",
          items: [
            { term: "Arcana", definition: "A term meaning mysteries or hidden knowledge. Tarot is divided into the Major and Minor Arcana." },
            { term: "Major Arcana", definition: "Twenty-two cards expressing larger archetypes, transitions, and turning points." },
            { term: "Minor Arcana", definition: "Fifty-six cards expressing everyday experiences through suits, numbers, and court cards." },
            { term: "Suit", definition: "One of the four Minor Arcana families: Wands, Cups, Swords, or Pentacles." },
            { term: "Court Card", definition: "A Page, Knight, Queen, or King, often interpreted as a person, role, attitude, or mode of expression." },
            { term: "Spread", definition: "A planned arrangement of cards where each position has a purpose." },
            { term: "Position", definition: "The role a card occupies within a spread." },
            { term: "Upright", definition: "A card shown in its standard orientation." },
            { term: "Reversed", definition: "A card shown upside down, sometimes interpreted as blocked, internalized, delayed, excessive, or redirected energy." },
            { term: "Querent", definition: "The person asking the question or receiving the reading." },
            { term: "Significator", definition: "A card intentionally chosen to represent a person, issue, or focus." },
            { term: "Clarifier", definition: "An additional card drawn to explore part of a reading more closely." },
            { term: "Archetype", definition: "A recurring symbolic pattern, role, or human experience." },
            { term: "Interpretation", definition: "The process of creating meaning from imagery, tradition, context, position, and card relationships." },
            { term: "Intuition", definition: "A felt recognition or impression that should remain connected to visible evidence and context." }
          ]
        }
      ],
      takeaway: "Terminology is a map, not the destination."
    },
    {
      id: "choose-your-next-path",
      number: "10",
      navLabel: "Next Path",
      eyebrow: "The Next Door",
      title: "Where Will You Go Next?",
      introduction: "You now understand the landscape. Choose the path that matches what you want to learn.",
      cardSummary: "Choose the next doorway into the larger Astral Veil tarot archive.",
      coverImage: chapterCoverImage("10_next_path.png", "A luminous path leading beyond an open doorway into further tarot study"),
      image: chapterImage("history-continue-journey-banner.webp", 1916, 821, "A luminous path leading through the next doorway of the tarot archive"),
      visual: {
        type: "doorways",
        caption: "The next doorway is yours to choose",
        center: "Continue",
        items: ["Read", "Practice", "Explore", "Study"]
      },
      blocks: [
        {
          type: "pathways",
          items: [
            { heading: "Learn How to Read Tarot", text: "Enter the guided nine-part course and learn how to prepare, question, interpret, connect, and reflect.", route: "/how-to-read-tarot-cards/", dominant: true },
            { heading: "Begin a Tarot Reading", text: "Choose a Veilwalker and experience a reading.", route: "/free-tarot-reading" },
            { heading: "Explore All Tarot Card Meanings", text: "Study all seventy-eight cards one by one.", route: "/tarot#tarot-title" },
            { heading: "Study the Major Arcana", text: "Explore archetypes, turning points, and transformations.", route: "/tarot/major-arcana/" },
            { heading: "Understand the Minor Arcana", text: "Learn suits, numbers, and court cards.", route: "/tarot/minor-arcana/" },
            { heading: "Explore Tarot Spreads", text: "Discover layouts for different questions and levels of depth.", route: "/tarot-spreads/" },
            { heading: "Discover Tarot History", text: "Explore tarot’s origins, evolution, symbolism, and modern practice.", route: "/tarot/history/" },
            { heading: "Choose a Tarot Deck", text: "Explore Astral Veil’s available decks.", route: "/decks" }
          ]
        }
      ],
      takeaway: "You do not need to learn everything at once. You only need to choose the next useful step."
    }
  ],
  faq: {
    eyebrow: "Questions at the Threshold",
    heading: "Tarot for Beginners: Frequently Asked Questions",
    introduction: "Clear starting points for learning the deck without pressure or unnecessary rules.",
    items: [
      {
        question: "What is tarot?",
        parts: [
          { text: "Tarot is a seventy-eight-card deck, a symbolic language, and an interpretive tool used to explore patterns, possibilities, and choices. " },
          { text: "Begin with the first chapter", route: "#what-is-tarot" },
          { text: " for a fuller introduction." }
        ]
      },
      {
        question: "Is tarot difficult to learn?",
        parts: [{ text: "Tarot takes time to know, but it does not require instant mastery. Learning symbols, suits, numbers, and a few useful meanings at a time makes the deck manageable." }]
      },
      {
        question: "What tarot deck is best for beginners?",
        parts: [
          { text: "Choose a deck with readable, consistent imagery and a useful guidebook—especially one based on a recognizable tarot system. " },
          { text: "Review the first-deck guide", route: "#choosing-your-first-deck" },
          { text: " before deciding." }
        ]
      },
      {
        question: "Does my first tarot deck need to be gifted?",
        parts: [{ text: "No. You may choose and buy your own first tarot deck. The gifted-deck rule is a custom, not a requirement." }]
      },
      {
        question: "Do I need psychic abilities to read tarot?",
        parts: [{ text: "No. Tarot can be learned through observation, symbolic study, context, practice, and reflection. You do not need to claim psychic abilities." }]
      },
      {
        question: "Do I need to memorize all seventy-eight cards?",
        parts: [
          { text: "No. Start with imagery and patterns, learn two or three useful meanings, and check a reliable reference afterward. " },
          { text: "Explore the learning-meanings chapter", route: "#learning-card-meanings" },
          { text: " for a practical method." }
        ]
      },
      {
        question: "Should beginners use reversed cards?",
        parts: [{ text: "Reversals are optional. You can learn with upright cards first, then add reversals when they support clarity rather than overwhelm." }]
      },
      {
        question: "Can beginners read tarot for themselves?",
        parts: [
          { text: "Yes. Self-reading can be useful when you record your question, remain honest about bias, and avoid repeatedly drawing for the same answer. " },
          { text: "Learn the full reading process", route: "/how-to-read-tarot-cards/" },
          { text: "." }
        ]
      },
      {
        question: "Is tarot the same as fortune-telling?",
        parts: [{ text: "Not necessarily. Some people use tarot predictively, while Astral Veil treats it as a reflective tool for examining present patterns, possibilities, and choices rather than fixed verdicts." }]
      },
      {
        question: "How long does it take to learn tarot?",
        parts: [{ text: "There is no single timetable. You can begin meaningful study immediately, while deeper familiarity grows over weeks, months, and years of repeated attention." }]
      },
      {
        question: "What is the difference between Major and Minor Arcana?",
        parts: [
          { text: "The twenty-two Major Arcana cards describe larger archetypes and turning points. The fifty-six Minor Arcana cards describe everyday life through suits, numbers, and court cards. " },
          { text: "See the deck structure", route: "#inside-the-deck" },
          { text: "." }
        ]
      },
      {
        question: "Where should I start learning tarot?",
        parts: [
          { text: "Start with what tarot is, choose a readable deck, learn the structure, and spend your first week becoming familiar with the images. " },
          { text: "Open Chapter One", route: "#what-is-tarot" },
          { text: " or follow the " },
          { text: "seven-day study path", route: "#first-week-with-tarot" },
          { text: "." }
        ]
      }
    ]
  },
  closing: {
    eyebrow: "The Book Is Open",
    heading: "Choose Where to Go Next",
    text: "Begin a reflective tarot reading now, or continue into the practical How to Read Tarot guide.",
    primary: {
      eyebrow: "Practice",
      title: "Begin a Tarot Reading",
      description: "Put the cards on the table and begin with a question already on your mind.",
      label: "Begin a Reading",
      route: "/free-tarot-reading"
    },
    secondary: {
      eyebrow: "Continue Learning",
      title: "Learn How to Read Tarot",
      description: "Continue into the practical guide and learn how to prepare, draw, and interpret your cards.",
      label: "Open the Guide",
      route: "/how-to-read-tarot-cards/"
    }
  }
};

const chamberNumerals = ["I", "II", "III"];

const lessonReviewImage = (src, width, height, alt, position = "center", replacementRecommended = false, fit = "cover") => ({
  src,
  width,
  height,
  alt,
  position,
  fit,
  reviewStatus: replacementRecommended ? "replacement-recommended" : "keep-candidate"
});

export const beginnerLessonImageAssignments = Object.freeze({
  "what-is-tarot-entrance": lessonReviewImage(
    "/assets/images/background%20_images/tarot_for_beginners_header.png", 1672, 941,
    "Hands arranging tarot cards beside open guidebooks in a celestial study"
  ),
  "what-is-tarot-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/history-modern-illustrated-tarot.webp", 1672, 941,
    "A complete illustrated tarot deck arranged beside an artist's tools and reference sketches"
  ),
  "what-is-tarot-chamber-2": lessonReviewImage(
    "/assets/images/background%20_images/history-symbolic-correspondences.webp", 1672, 941,
    "Tarot cards surrounded by celestial instruments, books, and symbolic correspondences"
  ),
  "what-is-tarot-chamber-3": lessonReviewImage(
    "/assets/images/background%20_images/how-to-read-tarot.png", 1448, 1086,
    "A reader's hands connecting several cards within a candlelit tarot spread"
  ),

  "what-you-need-entrance": lessonReviewImage(
    "/assets/images/background%20_images/tarot-study.png", 1672, 941,
    "A small study circle learning with tarot cards, books, and candlelight"
  ),
  "what-you-need-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/tarot-for-beginners.png", 1448, 1086,
    "A tarot deck, open journal, guidebook, and candle arranged for beginner study"
  ),
  "what-you-need-chamber-2": lessonReviewImage(
    "/assets/images/about-tarotcards-section.webp", 1600, 900,
    "A tarot deck beside crystals, candles, and ritual objects that are optional for practice"
  ),
  "what-you-need-chamber-3": lessonReviewImage(
    "/assets/images/background%20_images/tarot_beginners_welcome_guide_default.png", 1448, 1086,
    "A calm tarot guide building a reflective practice at a library table"
  ),

  "choosing-your-first-deck-entrance": lessonReviewImage(
    "/assets/images/concepts/deck-page-card.webp", 1672, 941,
    "A reader comparing several distinct tarot decks in a moonlit study"
  ),
  "choosing-your-first-deck-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/tarot-vs-oracle-cards.png", 1672, 941,
    "Two groups of richly illustrated cards showing different visual languages", "22% center"
  ),
  "choosing-your-first-deck-chamber-2": lessonReviewImage(
    "/assets/images/background%20_images/history-occult-revival-symbolism.webp", 1672, 941,
    "A traditional tarot deck arranged with books and a consistent celestial symbol system"
  ),
  "choosing-your-first-deck-chamber-3": lessonReviewImage(
    "/assets/images/background%20_images/free-reading-bg.png", 1672, 941,
    "A single tarot deck presented at a luminous doorway for personal selection"
  ),

  "inside-the-deck-entrance": lessonReviewImage(
    "/assets/images/background%20_images/tarot-compare-header-sun.webp", 1916, 821,
    "Several tarot decks and card families arranged across a wide celestial table"
  ),
  "inside-the-deck-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/major-arcana-explained.png", 1448, 1086,
    "A traveler approaching a luminous doorway representing the Major Arcana journey"
  ),
  "inside-the-deck-chamber-2": lessonReviewImage(
    "/assets/images/background%20_images/minor_arcana_header.png", 1672, 941,
    "Cards and elemental objects representing Cups, Wands, Swords, and Pentacles"
  ),
  "inside-the-deck-chamber-3": lessonReviewImage(
    "/assets/images/background%20_images/minor-arcana-explained.png", 1448, 1086,
    "Numbered and court-style tarot cards arranged to show repeating Minor Arcana patterns"
  ),

  "learning-card-meanings-entrance": lessonReviewImage(
    "/assets/images/how_to_read_tarot/regular/browse_meanings.png", 1672, 941,
    "A reader comparing tarot imagery with meanings in an open reference book"
  ),
  "learning-card-meanings-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/history-tarot-practice.webp", 1672, 941,
    "A reader pausing to observe the visible imagery across a tarot spread"
  ),
  "learning-card-meanings-chamber-2": lessonReviewImage(
    "/assets/images/how_to_read_tarot/regular/interpret_positions.png", 1122, 1402,
    "A tarot spread with one central card emphasized by its reading position", "center 54%", true
  ),
  "learning-card-meanings-chamber-3": lessonReviewImage(
    "/assets/images/how_to_read_tarot/regular/connect_the_cards.png", 1448, 1086,
    "Three tarot cards linked by luminous lines to illustrate synthesis and interpretation"
  ),

  "tarot-myths-entrance": lessonReviewImage(
    "/assets/images/background%20_images/history-early-tarot-facts.webp", 1536, 1024,
    "Historic tarot cards, records, and tools arranged for evidence-based study"
  ),
  "tarot-myths-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/history-deck-thoth-tradition.webp", 1536, 1024,
    "A documented tarot tradition represented by a deck, books, and study materials"
  ),
  "tarot-myths-chamber-2": lessonReviewImage(
    "/assets/images/background%20_images/upright-reverse.png", 1024, 1536,
    "A mirrored tarot figure showing upright and reversed perspectives", "center", true, "contain"
  ),
  "tarot-myths-chamber-3": lessonReviewImage(
    "/assets/images/lumen_archive_rooms/rooted_grove.png", 1672, 941,
    "A quiet rooted grove representing a grounded and steady tarot practice", "center", true
  ),

  "first-week-with-tarot-entrance": lessonReviewImage(
    "/assets/images/how_to_read_tarot/regular/begin_reading.png", 1672, 941,
    "A complete tarot deck laid out for the beginning of a first reading practice"
  ),
  "first-week-with-tarot-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/tarot_vs_oracle_header.png", 1672, 941,
    "A complete deck opened into several clear card groups for first study"
  ),
  "first-week-with-tarot-chamber-2": lessonReviewImage(
    "/assets/images/background%20_images/tarot-spreads.png", 1672, 941,
    "Multiple card groups arranged for comparing suits, numbers, and recurring patterns"
  ),
  "first-week-with-tarot-chamber-3": lessonReviewImage(
    "/assets/images/how_to_read_tarot/regular/record_reflection.png", 1672, 941,
    "A reader journaling observations beside tarot cards after a week of practice"
  ),

  "beginner-mistakes-entrance": lessonReviewImage(
    "/assets/images/background%20_images/history-tarot-today-reflection.webp", 1536, 1024,
    "A reader holding one card above a spread while pausing to reflect"
  ),
  "beginner-mistakes-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/tarot-vs-lenormand.png", 1672, 941,
    "Two card systems placed side by side, suggesting the pressure of comparing methods too early", "center", true
  ),
  "beginner-mistakes-chamber-2": lessonReviewImage(
    "/assets/images/lumen_archive_rooms/Hall_of_mirros.png", 1672, 941,
    "A hall of mirrored doorways representing projection and competing interpretations", "center", true
  ),
  "beginner-mistakes-chamber-3": lessonReviewImage(
    "/assets/images/lumen_archive_rooms/garden_of_renewal.png", 1672, 941,
    "A sunlit garden path representing patient and sustainable reading habits", "center", true
  ),

  "tarot-glossary-entrance": lessonReviewImage(
    "/assets/images/background%20_images/tarot_history_header.png", 1672, 941,
    "An open illustrated reference book surrounded by tarot cards and study notes"
  ),
  "tarot-glossary-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/history-deck-rider-waite-smith.webp", 1536, 1024,
    "A complete named tarot tradition arranged to study deck structure and Arcana"
  ),
  "tarot-glossary-chamber-2": lessonReviewImage(
    "/assets/images/how_to_read_tarot/regular/explore_spreads.png", 1672, 941,
    "Several tarot spreads demonstrating positions, layouts, and supporting cards"
  ),
  "tarot-glossary-chamber-3": lessonReviewImage(
    "/assets/images/lumen_archive_rooms/RP.png", 1672, 941,
    "A moonlit reflection pool representing intuition and reflective interpretation", "center", true
  ),

  "choose-your-next-path-entrance": lessonReviewImage(
    "/assets/images/background%20_images/history-continue-journey-banner.webp", 1916, 821,
    "Tarot cards, books, and a luminous path leading toward continued study", "72% center"
  ),
  "choose-your-next-path-chamber-1": lessonReviewImage(
    "/assets/images/background%20_images/history-faq-celestial-emblem.webp", 1254, 1254,
    "An open study book, tarot deck, and celestial emblem summarizing a learned foundation"
  ),
  "choose-your-next-path-chamber-2": lessonReviewImage(
    "/assets/images/background%20_images/%20%20major_arcana_journey_banner.png", 1774, 887,
    "A traveler choosing a luminous path through a celestial tarot landscape"
  ),
  "choose-your-next-path-chamber-3": lessonReviewImage(
    "/assets/images/lumen_archive_rooms/dawn_atium.png", 1672, 941,
    "A luminous archive doorway opening toward the next area of study", "center", true
  )
});

function selectBlockItems(block, indexes) {
  if (!block || !Array.isArray(block.items)) return { type: "empty", items: [] };
  return { ...block, items: indexes.map((index) => block.items[index]).filter(Boolean) };
}

function createAssignedVisual(slot, ratio) {
  const assignment = beginnerLessonImageAssignments[slot];
  if (!assignment) throw new Error(`Missing temporary lesson image assignment: ${slot}`);
  return { slot, ratio, ...assignment };
}

function createVisualSlot(chapter, chamberIndex, title, ratio = "16 / 9") {
  return createAssignedVisual(`${chapter.id}-chamber-${chamberIndex + 1}`, ratio);
}

function createGuidedLesson(chapter, configuration) {
  return {
    title: configuration.title || chapter.title,
    introContinuation: configuration.introContinuation,
    outcomes: configuration.outcomes,
    headerVisual: createAssignedVisual(`${chapter.id}-entrance`, "16 / 7"),
    chambers: configuration.chambers.map((chamber, index) => ({
      id: `${chapter.id}-chamber-${index + 1}`,
      numeral: chamberNumerals[index],
      label: `CHAMBER ${chamberNumerals[index]}`,
      shortTitle: chamber.shortTitle || chamber.title,
      title: chamber.title,
      preview: chamber.preview,
      topics: chamber.topics,
      variant: chamber.variant,
      visual: createVisualSlot(chapter, index, chamber.title, chamber.ratio),
      visualData: chamber.visualData,
      blocks: chamber.blocks,
      practice: chamber.practice,
      checkpoint: chamber.checkpoint,
      takeaway: chamber.takeaway
    })),
    takeaway: chapter.takeaway,
    completionSummary: configuration.outcomes
  };
}

function migrateChapterOne(chapter) {
  const source = chapter.academyLesson;
  const variants = ["split", "map", "editorial"];
  const shortTitles = ["The Deck", "The Images", "Meaning"];
  const outcomes = [
    "Recognize tarot as a structured seventy-eight-card deck",
    "Read imagery as a symbolic language",
    "Understand how context and reflection create meaning"
  ];
  return createGuidedLesson(chapter, {
    title: source.title,
    introContinuation: source.introContinuation,
    outcomes,
    chambers: source.chambers.map((chamber, index) => ({
      shortTitle: shortTitles[index],
      title: chamber.title,
      preview: chamber.preview,
      topics: chamber.topics,
      variant: variants[index],
      visualData: chamber.learningVisual,
      blocks: chamber.sections.map((section) => ({
        type: "paragraphs",
        heading: section.heading,
        paragraphs: section.paragraphs
      })),
      takeaway: chamber.takeaway
    }))
  });
}

function migrateStandardChapter(chapter) {
  const [firstBlock, secondBlock, thirdBlock, fourthBlock] = chapter.blocks;
  const legacyVisual = {
    type: "orbit",
    label: chapter.visual.caption,
    center: chapter.visual.center,
    items: chapter.visual.items
  };

  const configurations = {
    "what-you-need": {
      introContinuation: "Move through three Chambers: gather what supports the work, release what does not, and build a practice you can sustain.",
      outcomes: ["What is truly essential", "What is completely optional", "How familiarity grows through practice"],
      chambers: [
        {
          shortTitle: "Essentials",
          title: "Your Essential Tools",
          preview: "Begin with the few things that make observation, reference, and reflection possible.",
          topics: ["Tarot Deck", "Reference", "Journal"],
          variant: "split",
          visualData: legacyVisual,
          blocks: [selectBlockItems(firstBlock, [0, 1, 2])],
          takeaway: "A readable deck, a reliable reference, and a place to record what you notice are enough to begin."
        },
        {
          shortTitle: "Optional",
          title: "What Is Optional",
          preview: "Set down the rules and objects that are often mistaken for requirements.",
          topics: ["Ability", "Ritual", "Perfection"],
          variant: "comparison",
          blocks: [secondBlock],
          takeaway: "You do not need special permission, perfect intuition, or ritual perfection to study tarot."
        },
        {
          shortTitle: "Practice",
          title: "Building Your Practice",
          preview: "Use time, attention, and willingness to turn simple tools into lasting familiarity.",
          topics: ["Time", "Attention", "Patience"],
          variant: "editorial",
          blocks: [selectBlockItems(firstBlock, [3, 4])],
          takeaway: chapter.takeaway
        }
      ]
    },
    "choosing-your-first-deck": {
      introContinuation: "A first deck becomes a companion through readability, recognizable structure, and the desire to return to it.",
      outcomes: ["How readable imagery supports learning", "Why structure and references matter", "How to choose through genuine connection"],
      chambers: [
        {
          shortTitle: "Imagery",
          title: "Readable Imagery",
          preview: "Choose artwork that gives you enough visual information to observe before you interpret.",
          topics: ["Clarity", "Artwork", "Guidebook"],
          variant: "split",
          visualData: legacyVisual,
          blocks: [selectBlockItems(firstBlock, [0]), selectBlockItems(secondBlock, [0, 3])],
          takeaway: "Readable imagery gives your attention somewhere concrete to begin."
        },
        {
          shortTitle: "Structure",
          title: "Structure and Tradition",
          preview: "A recognizable system and consistent symbolism make comparison and reference easier.",
          topics: ["System", "Symbols", "Consistency"],
          variant: "map",
          blocks: [selectBlockItems(firstBlock, [2]), selectBlockItems(secondBlock, [2, 4])],
          takeaway: "Structure is a learning aid, not a rule about which art you are allowed to love."
        },
        {
          shortTitle: "Connection",
          title: "Personal Connection",
          preview: "Let practical considerations and genuine curiosity guide the final choice.",
          topics: ["Card Size", "Interest", "Choice"],
          variant: "editorial",
          blocks: [selectBlockItems(firstBlock, [1]), selectBlockItems(secondBlock, [1, 5]), thirdBlock, fourthBlock],
          takeaway: chapter.takeaway
        }
      ]
    },
    "inside-the-deck": {
      introContinuation: "See the architecture first: two Arcana, four suits, and the repeating language of numbers and court cards.",
      outcomes: ["How Major and Minor Arcana divide the deck", "What the four suits describe", "How numbers and courts repeat across suits"],
      chambers: [
        {
          shortTitle: "The Arcana",
          title: "Major and Minor Arcana",
          preview: "Begin with the largest division inside a complete seventy-eight-card tarot deck.",
          topics: ["78 Cards", "22 Major", "56 Minor"],
          variant: "comparison",
          visualData: legacyVisual,
          blocks: [firstBlock, thirdBlock],
          checkpoint: {
            heading: "Check Your Understanding",
            prompt: "Which two groups make up a complete tarot deck?",
            options: [
              { label: "Major and Minor Arcana", correct: true, feedback: "Yes. Together they form the complete seventy-eight-card system." },
              { label: "Upright and reversed cards", correct: false, feedback: "Those are orientations. The deck itself divides into Major and Minor Arcana." }
            ]
          },
          takeaway: "The Major Arcana holds larger movements; the Minor Arcana brings them into everyday life."
        },
        {
          shortTitle: "The Suits",
          title: "The Four Suits",
          preview: "Meet the four families that organize most of the Minor Arcana.",
          topics: ["Wands", "Cups", "Swords", "Pentacles"],
          variant: "map",
          blocks: [secondBlock],
          takeaway: "Each suit offers a consistent lens for one area of lived experience."
        },
        {
          shortTitle: "Numbers + Courts",
          title: "Numbers and Court Cards",
          preview: "Notice the patterns that repeat across all four suits and make the deck easier to compare.",
          topics: ["Numbers", "Pages", "Knights", "Queens + Kings"],
          variant: "editorial",
          blocks: [{
            type: "paragraphs",
            heading: "Repeating Patterns",
            paragraphs: [
              "Numbers repeat across the suits, allowing you to compare similar stages through different areas of life.",
              "Pages, Knights, Queens, and Kings can describe people, roles, attitudes, or ways of expressing a suit."
            ]
          }],
          takeaway: chapter.takeaway
        }
      ]
    },
    "learning-card-meanings": {
      introContinuation: "Move from observation to context, then bring the layers together into a responsible interpretation.",
      outcomes: ["How to observe before defining", "How question and context shape meaning", "How to synthesize imagery, tradition, and response"],
      chambers: [
        {
          shortTitle: "Observe",
          title: "Observe Before Defining",
          preview: "Let the visible card speak before you reach for a memorized keyword.",
          topics: ["Image", "Emotion", "Attention"],
          variant: "split",
          visualData: legacyVisual,
          blocks: [selectBlockItems(firstBlock, [0, 3])],
          practice: {
            heading: "Try This",
            intro: "Look at one tarot card for sixty seconds before checking its meaning.",
            items: ["The first object you notice", "The strongest emotion", "One question the image creates"]
          },
          takeaway: "Observation gives interpretation evidence to stand on."
        },
        {
          shortTitle: "Context",
          title: "Question and Context",
          preview: "A card changes emphasis through the question, position, and surrounding cards.",
          topics: ["Question", "Position", "Relationships"],
          variant: "editorial",
          blocks: [selectBlockItems(firstBlock, [2]), selectBlockItems(secondBlock, [4, 5, 6])],
          takeaway: "A meaning becomes useful when it answers the question actually being asked."
        },
        {
          shortTitle: "Synthesis",
          title: "Synthesis and Interpretation",
          preview: "Connect tradition, comparison, and personal response without turning any one layer into a verdict.",
          topics: ["Tradition", "Patterns", "Reflection"],
          variant: "map",
          blocks: [selectBlockItems(firstBlock, [1]), selectBlockItems(secondBlock, [0, 1, 2, 3]), thirdBlock],
          takeaway: chapter.takeaway
        }
      ]
    },
    "tarot-myths": {
      introContinuation: "Separate inherited customs from repeated misinformation, then keep what supports a grounded practice.",
      outcomes: ["How tradition differs from requirement", "Which repeated myths limit learning", "How to keep tarot grounded in choice and context"],
      chambers: [
        {
          shortTitle: "Tradition",
          title: "Tradition",
          preview: "Some customs can add meaning without becoming conditions for participation.",
          topics: ["Custom", "Permission", "Practice"],
          variant: "editorial",
          visualData: legacyVisual,
          blocks: [selectBlockItems(firstBlock, [0, 1])],
          takeaway: "A custom may guide your practice without deciding whether you are allowed to begin."
        },
        {
          shortTitle: "Repeated Myths",
          title: "Repeated Myths",
          preview: "Look again at the claims that create fear, pressure, and rigid expectations.",
          topics: ["Memorization", "Reversals", "Prediction"],
          variant: "reveal",
          blocks: [selectBlockItems(firstBlock, [2, 3, 4])],
          takeaway: "Repeated language does not become a requirement merely because it sounds traditional."
        },
        {
          shortTitle: "Grounded Practice",
          title: "A Grounded Practice",
          preview: "Use honesty, boundaries, and context when the cards feel difficult or personally charged.",
          topics: ["Challenge", "Bias", "Choice"],
          variant: "comparison",
          blocks: [selectBlockItems(firstBlock, [5, 6])],
          takeaway: chapter.takeaway
        }
      ]
    },
    "first-week-with-tarot": {
      introContinuation: "Let the first seven days move from meeting the deck to recognizing patterns and choosing what to study next.",
      outcomes: ["How to meet the deck without pressure", "How to build familiarity through comparison", "How to finish the week with one useful next step"],
      chambers: [
        {
          shortTitle: "Meet the Deck",
          title: "Meeting the Deck",
          preview: "Begin by seeing the whole deck and locating its larger sequence.",
          topics: ["Day 01", "Day 02", "Major Arcana"],
          variant: "editorial",
          visualData: legacyVisual,
          blocks: [selectBlockItems(firstBlock, [0, 1])],
          takeaway: "The first encounter is for noticing, not mastering."
        },
        {
          shortTitle: "Familiarity",
          title: "Building Familiarity",
          preview: "Compare suits, numbers, and court cards so patterns begin to repeat.",
          topics: ["Day 03", "Day 04", "Day 05"],
          variant: "map",
          blocks: [selectBlockItems(firstBlock, [2, 3, 4])],
          takeaway: "Comparison makes a large deck feel like a connected language."
        },
        {
          shortTitle: "Complete the Week",
          title: "Completing the First Week",
          preview: "Study one card deeply, then choose the next path that fits your curiosity.",
          topics: ["Day 06", "Day 07", "Continue"],
          variant: "practice",
          blocks: [selectBlockItems(firstBlock, [5, 6])],
          takeaway: chapter.takeaway
        }
      ]
    },
    "beginner-mistakes": {
      introContinuation: "Name the pressure, notice where certainty distorts the reading, and return to habits that keep learning sustainable.",
      outcomes: ["Why memorization pressure creates confusion", "How projection and repeated questioning reduce clarity", "Which habits support steady learning"],
      chambers: [
        {
          shortTitle: "Pressure",
          title: "Pressure and Memorization",
          preview: "Release the expectation that confidence or complete recall must arrive immediately.",
          topics: ["Memorization", "Keywords", "Comparison"],
          variant: "reveal",
          visualData: legacyVisual,
          blocks: [selectBlockItems(firstBlock, [0, 4, 7])],
          takeaway: "Confidence develops through use, correction, and familiarity."
        },
        {
          shortTitle: "Certainty",
          title: "Projection and Certainty",
          preview: "Notice the habits that add cards, repeat questions, or force every symbol into an answer.",
          topics: ["Clarifiers", "Repeated Questions", "Context"],
          variant: "comparison",
          blocks: [selectBlockItems(firstBlock, [1, 2, 3, 5])],
          takeaway: "More cards and stronger certainty do not always create a clearer reading."
        },
        {
          shortTitle: "Sustainable Habits",
          title: "Sustainable Reading Habits",
          preview: "Return to the question, allow uncertainty, and give interpretation time to develop.",
          topics: ["Pause", "Simplify", "Reflect"],
          variant: "editorial",
          blocks: [selectBlockItems(firstBlock, [6]), secondBlock],
          takeaway: chapter.takeaway
        }
      ]
    },
    "tarot-glossary": {
      introContinuation: "Learn the vocabulary in three groups: the deck itself, the language of a reading, and the process of interpretation.",
      outcomes: ["Terms describing deck structure", "Terms used during a reading", "Terms connecting practice and interpretation"],
      chambers: [
        {
          shortTitle: "Deck Structure",
          title: "Deck and Structure",
          preview: "Begin with the terms that describe how the seventy-eight cards are organized.",
          topics: ["Arcana", "Suit", "Court Card"],
          variant: "editorial",
          visualData: legacyVisual,
          blocks: [selectBlockItems(firstBlock, [0, 1, 2, 3, 4])],
          takeaway: "Structure gives you a map for locating any card in the larger deck."
        },
        {
          shortTitle: "Reading Language",
          title: "Reading Language",
          preview: "Learn the terms used to describe positions, orientations, people, and supporting cards.",
          topics: ["Spread", "Position", "Querent", "Clarifier"],
          variant: "reveal",
          blocks: [selectBlockItems(firstBlock, [5, 6, 7, 8, 9, 10, 11])],
          takeaway: "Reading vocabulary helps you describe what each card is doing in context."
        },
        {
          shortTitle: "Interpretation",
          title: "Practice and Interpretation",
          preview: "Connect recurring symbolic patterns with the process of making responsible meaning.",
          topics: ["Archetype", "Interpretation", "Intuition"],
          variant: "map",
          blocks: [selectBlockItems(firstBlock, [12, 13, 14])],
          takeaway: chapter.takeaway
        }
      ]
    },
    "choose-your-next-path": {
      introContinuation: "Pause at the final Door, recognize the foundation you have built, and choose one useful direction through the archive.",
      outcomes: ["What foundation you now carry", "Which learning paths are available", "How to continue without learning everything at once"],
      chambers: [
        {
          shortTitle: "What You Learned",
          title: "What You Have Learned",
          preview: "You now know the deck’s structure, the role of imagery and context, and how familiarity grows.",
          topics: ["Structure", "Symbols", "Practice"],
          variant: "editorial",
          visualData: legacyVisual,
          blocks: [{
            type: "paragraphs",
            heading: "The Foundation",
            paragraphs: ["You have learned how tarot is organized, what supports a beginning practice, and why observation matters more than instant certainty."]
          }],
          takeaway: "The foundation is not mastery. It is enough understanding to choose your next useful step."
        },
        {
          shortTitle: "Choose",
          title: "Choose Your Direction",
          preview: "Continue through the path that most closely matches what you want to practice now.",
          topics: ["Read", "Practice", "Study"],
          variant: "comparison",
          blocks: [selectBlockItems(firstBlock, [0, 1, 2, 3])],
          takeaway: "Choose the direction that answers your present curiosity."
        },
        {
          shortTitle: "Continue",
          title: "Continue Through the Archive",
          preview: "The remaining doors lead into Arcana, spreads, history, and the decks themselves.",
          topics: ["Arcana", "Spreads", "History", "Decks"],
          variant: "map",
          blocks: [selectBlockItems(firstBlock, [4, 5, 6, 7])],
          takeaway: chapter.takeaway
        }
      ]
    }
  };

  return createGuidedLesson(chapter, configurations[chapter.id]);
}

tarotForBeginners.chapters.forEach((chapter) => {
  chapter.academyLesson = chapter.id === "what-is-tarot"
    ? migrateChapterOne(chapter)
    : migrateStandardChapter(chapter);
  delete chapter.visual;
  delete chapter.blocks;
});

export const beginnerChapterMetadata = tarotForBeginners.chapters.map((chapter, index, chapters) => ({
  id: chapter.id,
  number: chapter.number,
  navLabel: chapter.navLabel,
  eyebrow: chapter.eyebrow,
  title: chapter.title,
  introduction: chapter.introduction,
  cardSummary: chapter.cardSummary,
  chambers: chapter.academyLesson.chambers.map((chamber) => ({
    id: chamber.id,
    numeral: chamber.numeral,
    title: chamber.title,
    shortTitle: chamber.shortTitle
  })),
  hash: `#${chapter.id}`,
  previous: chapters[index - 1]?.id || null,
  next: chapters[index + 1]?.id || null
}));

export function beginnerFaqPlainText(item) {
  return item.parts.map((part) => part.text).join("");
}
