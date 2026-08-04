const imageRoot = "/assets/images/background%20_images";

const chapterImage = (file, width, height, alt, position = "center") => ({
  src: `${imageRoot}/${file}`,
  width,
  height,
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
      eyebrow: "Before the First Card Turns",
      heading: "Welcome to the Beginning",
      paragraphs: [
        "Learning tarot is not about becoming perfect at predicting what comes next. It is about learning to notice symbols, patterns, emotions, and possibilities with greater care.",
        "You do not need psychic abilities, a gifted deck, or all seventy-eight meanings memorized. Bring your curiosity. The rest can be learned one chapter at a time."
      ],
      truths: [
        { label: "There Is No Test", text: "You are here to explore, not prove yourself." },
        { label: "You May Move Slowly", text: "Understanding grows through familiarity, not speed." },
        { label: "Your Perspective Matters", text: "Tradition offers a foundation, but your attention helps the cards become meaningful." }
      ],
      primaryLabel: "Open Chapter One",
      secondaryLabel: "View All Chapters",
      whisper: "Every reader once stood where you are now."
    },
    bloodMoon: {
      eyebrow: "You Came Looking for Answers",
      heading: "Good. Start by Learning How to Question Them.",
      paragraphs: [
        "So, you want to learn tarot. Perhaps you expected instant intuition, secret knowledge, and a dramatic revelation before the candles finished melting. Unfortunate. You will have to pay attention instead.",
        "The cards will not flatter you, think for you, or rescue you from uncertainty. They may, however, show you the pattern you keep pretending not to see. That is usually more useful."
      ],
      truths: [
        { label: "You Will Misunderstand Cards", text: "Excellent. Correcting yourself is how discernment develops." },
        { label: "You Will Want Certainty", text: "The cards are under no obligation to provide it." },
        { label: "You Already Belong Here", text: "Confusion did not lock the door. It brought you to it." }
      ],
      primaryLabel: "Enter Chapter One",
      secondaryLabel: "Reveal All Chapters",
      whisper: "Come closer. You have avoided the lesson long enough."
    },
    image: chapterImage(
      "tarot-for-beginners.png",
      1448,
      1086,
      "An open tarot guide, cards, crystals, and a candle arranged at the threshold of study",
      "68% center"
    )
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

export const beginnerChapterMetadata = tarotForBeginners.chapters.map((chapter, index, chapters) => ({
  id: chapter.id,
  number: chapter.number,
  navLabel: chapter.navLabel,
  eyebrow: chapter.eyebrow,
  title: chapter.title,
  introduction: chapter.introduction,
  cardSummary: chapter.cardSummary,
  hash: `#${chapter.id}`,
  previous: chapters[index - 1]?.id || null,
  next: chapters[index + 1]?.id || null
}));

export function beginnerFaqPlainText(item) {
  return item.parts.map((part) => part.text).join("");
}
