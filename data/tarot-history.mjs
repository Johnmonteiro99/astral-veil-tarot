const reconstructionCaption = "Historically inspired editorial reconstruction";

export const tarotHistoryImages = Object.freeze({
  hero: { src: "/assets/images/background%20_images/history-of-tarot-banner.webp", width: 1916, height: 821 },
  originsArtisans: { src: "/assets/images/background%20_images/history-origins-renaissance-card-painters.webp", width: 1122, height: 1402 },
  earlyFacts: { src: "/assets/images/background%20_images/history-early-tarot-facts.webp", width: 1536, height: 1024 },
  earlyTarocchi: { src: "/assets/images/background%20_images/history-deck-early-tarocchi.webp", width: 1122, height: 1402 },
  mysticismEmerges: { src: "/assets/images/background%20_images/history-timeline-mysticism-emerges.webp", width: 1122, height: 1402 },
  occultAwakening: { src: "/assets/images/background%20_images/history-timeline-occult-awakening.webp", width: 1122, height: 1402 },
  modernFoundations: { src: "/assets/images/background%20_images/history-timeline-modern-foundations.webp", width: 1122, height: 1402 },
  globalLanguage: { src: "/assets/images/background%20_images/history-timeline-global-language.webp", width: 1122, height: 1402 },
  tarotDeMarseille: { src: "/assets/images/background%20_images/history-deck-tarot-de-marseille.webp", width: 1122, height: 1402 },
  riderWaiteSmith: { src: "/assets/images/background%20_images/history-deck-rider-waite-smith.webp", width: 1536, height: 1024 },
  bookshelfArchive: { src: "/assets/images/background%20_images/history-deck-thoth-tradition.webp", width: 1536, height: 1024 },
  symbolicCorrespondences: { src: "/assets/images/background%20_images/history-symbolic-correspondences.webp", width: 1672, height: 941 },
  occultRevival: { src: "/assets/images/background%20_images/history-occult-revival-symbolism.webp", width: 1672, height: 941 },
  modernStudio: { src: "/assets/images/background%20_images/history-modern-illustrated-tarot.webp", width: 1672, height: 941 },
  tarotPractice: { src: "/assets/images/background%20_images/history-tarot-practice.webp", width: 1672, height: 941 },
  tarotTodayReflection: { src: "/assets/images/background%20_images/history-tarot-today-reflection.webp", width: 1536, height: 1024 },
  closingArchive: { src: "/assets/images/background%20_images/history-continue-journey-banner.webp", width: 1916, height: 821 },
  hubTile: { src: "/assets/images/background%20_images/history-of-tarot.png", width: 1122, height: 1402 }
});

export const tarotHistory = {
  id: "history-of-tarot",
  slug: "history",
  route: "/tarot/history/",
  breadcrumbLabel: "History of Tarot",
  visualNote: "Visual note: Historical scenes on this page are editorial reconstructions created for Astral Veil. Historical claims are supported through the linked museum and archival sources.",
  hero: {
    eyebrow: "The Chronicle of the Cards",
    title: "The History of Tarot",
    introduction: "Tarot began as a European card game and gradually became a layered symbolic system used for play, art, divination, spiritual reflection, creativity, and personal exploration. Its history is not one straight path, but a sequence of reinventions shaped by artists, writers, collectors, occultists, readers, and changing cultural beliefs.",
    ctaLabel: "Begin the Journey",
    ctaTarget: "#origins",
    image: {
      ...tarotHistoryImages.hero,
      alt: "Antique Tarot cards, celestial books, a candle, and an armillary sphere arranged in a dark archive"
    }
  },
  origins: {
    id: "origins",
    number: "01",
    eyebrow: "The Beginning",
    heading: "Origins in Renaissance Europe",
    paragraphs: [
      "The earliest documented Tarot traditions emerged in fifteenth-century northern Italy. Known first as trionfi and later as tarocchi, the packs joined familiar suit cards with painted triumph cards and circulated as games within elite and courtly culture.",
      "Surviving luxury decks were hand-painted and gilded in centers including Milan, Ferrara, and Bologna. Tarot’s occult and fortune-telling associations developed centuries later, as writers and readers reinterpreted the cards through new divinatory, philosophical, and esoteric frameworks."
    ],
    pullQuote: "Tarot began as a European card game—not as an occult or divinatory system.",
    image: {
      ...tarotHistoryImages.originsArtisans,
      alt: "Renaissance-inspired artists painting and gilding an ornate set of playing cards",
      caption: reconstructionCaption
    },
    factsImage: {
      ...tarotHistoryImages.earlyFacts,
      alt: "Painted and gilded Renaissance-inspired cards beside pigments, parchment, a quill, and celestial instruments",
      caption: reconstructionCaption
    },
    factsHeading: "Early Tarot Facts",
    facts: [
      {
        label: "Earliest documented references",
        text: "Fifteenth-century northern Italy"
      },
      {
        label: "Early purpose",
        text: "A card game and form of courtly entertainment"
      },
      {
        label: "Historical objects",
        text: "Hand-painted and gilded luxury cards"
      },
      {
        label: "Later transformation",
        text: "Occult and divinatory meanings developed centuries afterward"
      }
    ],
    sources: [
      {
        label: "Continue at The Morgan Library: Visconti-Sforza Tarot Cards",
        url: "https://www.themorgan.org/collection/tarot-cards",
        organization: "The Morgan Library & Museum"
      },
      {
        label: "The Met: Before Fortune-Telling, The History and Structure of Tarot",
        url: "https://www.metmuseum.org/perspectives/tarot-2",
        organization: "The Metropolitan Museum of Art"
      }
    ]
  },
  timeline: {
    id: "timeline",
    number: "02",
    heading: "Tarot Through the Ages",
    introduction: "Tarot’s meaning changed as it moved through courts, print culture, occult philosophy, artistic reinvention, and modern global practice.",
    milestones: [
      {
        id: "birth-of-tarot",
        era: "15th Century",
        title: "The Birth of Tarot",
        copy: "Luxury card packs appeared in northern Italy as games for courtly and aristocratic circles. Their painted trump cards joined familiar suit cards to create an elaborate new form of play.",
        whyItMatters: "These early decks established the combination of familiar suit cards and illustrated trump cards that later Tarot traditions inherited.",
        archiveDetail: "Some of the earliest surviving Tarot cards were individually painted for wealthy Italian families, making them objects of art and status as well as instruments of play.",
        relatedLink: {
          label: "Explore the earliest surviving Tarot traditions",
          route: "/tarot/history/#origins"
        },
        image: {
          ...tarotHistoryImages.earlyTarocchi,
          alt: "Ornate hand-painted cards arranged with a candle and Renaissance-style manuscript",
          caption: reconstructionCaption
        }
      },
      {
        id: "mysticism-emerges",
        era: "17th–18th Century",
        title: "Mysticism Emerges",
        copy: "Writers and antiquarians began attaching speculative ancient histories and symbolic systems to Tarot. Many of these claims were influential even when they were not historically supported.",
        whyItMatters: "During this period, Tarot began shifting from a courtly card game into a symbolic system associated with hidden history, philosophy, and spiritual interpretation.",
        archiveDetail: "Many claims connecting Tarot to ancient Egypt appeared centuries after the earliest documented decks and were not supported by the surviving historical record.",
        relatedLink: {
          label: "Discover how Tarot became connected to occultism",
          route: "/tarot/history/#occult-revival"
        },
        image: {
          ...tarotHistoryImages.mysticismEmerges,
          alt: "Eighteenth-century-inspired scholar studying a star card among books and symbolic diagrams",
          caption: reconstructionCaption
        }
      },
      {
        id: "occult-awakening",
        era: "19th Century",
        title: "The Occult Awakening",
        copy: "French and British occult movements connected Tarot with ceremonial magic, astrology, Kabbalah, Hermetic philosophy, and systems of correspondence.",
        whyItMatters: "Occult writers transformed Tarot into an organized symbolic language by linking cards with astrology, ceremonial magic, numerology, and esoteric philosophy.",
        archiveDetail: "Nineteenth-century occultists did not merely interpret older decks. They created new systems of correspondence that continue to influence modern Tarot readings.",
        relatedLink: {
          label: "Explore the symbolism of the Major Arcana",
          route: "/tarot#tarot-arcana-groups-title"
        },
        image: {
          ...tarotHistoryImages.occultAwakening,
          alt: "Victorian-inspired study circle examining cards beneath a celestial chart",
          caption: reconstructionCaption
        }
      },
      {
        id: "modern-foundations",
        era: "Early 20th Century",
        title: "Modern Foundations",
        copy: "Fully illustrated minor cards and new symbolic frameworks made Tarot easier to read as a complete visual narrative, shaping many modern traditions.",
        whyItMatters: "Fully illustrated minor cards allowed readers to interpret scenes and stories rather than relying only on suit and number associations.",
        archiveDetail: "The Rider-Waite-Smith deck, first published in the early twentieth century, helped establish much of the visual language now recognized in modern Tarot.",
        relatedLink: {
          label: "Explore the Rider-Waite-Smith Tarot tradition",
          route: "/tarot/history/#modern-illustrated-tarot"
        },
        image: {
          ...tarotHistoryImages.modernFoundations,
          alt: "Early twentieth-century-inspired artists developing a coherent illustrated card sequence",
          caption: reconstructionCaption
        }
      },
      {
        id: "global-language",
        era: "Today",
        title: "A Global Language",
        copy: "Tarot now appears in art, games, spiritual practice, psychological reflection, digital communities, education, publishing, and personal creativity worldwide.",
        whyItMatters: "Modern Tarot has expanded beyond divination into personal reflection, creative practice, education, storytelling, psychology, and digital culture.",
        archiveDetail: "Contemporary decks frequently reinterpret traditional archetypes through new artistic styles, cultures, identities, philosophies, and fictional worlds.",
        relatedLink: {
          label: "Explore Tarot card meanings",
          route: "/tarot#tarot-title"
        },
        image: {
          ...tarotHistoryImages.globalLanguage,
          alt: "A contemporary international group studying Tarot cards together around a table",
          caption: reconstructionCaption
        }
      }
    ]
  },
  traditions: {
    id: "traditions",
    number: "03",
    heading: "Influential Deck Traditions",
    introduction: "Tarot’s visual language has never been fixed. These editorial reconstructions evoke four broad traditions that shaped how later artists and readers approached the cards.",
    caption: reconstructionCaption,
    items: [
      {
        id: "early-italian-tarocchi",
        title: "Early Italian Tarocchi",
        era: "15th Century",
        copy: "Luxury hand-painted decks created in fifteenth-century northern Italy joined familiar suit cards with additional triumph cards. Made for courtly play, surviving examples also preserve the work of painters, gilders, and elite patrons.",
        visualSignature: "Individually painted figures, luminous gilding, heraldic details, and courtly dress give surviving cards the character of small luxury artworks.",
        historicalInfluence: "These packs established the enduring structure of suit cards plus illustrated trumps that later Tarot traditions inherited.",
        relatedLink: {
          label: "Explore the origins of Tarot",
          route: "/tarot/history/#origins"
        },
        image: {
          ...tarotHistoryImages.earlyTarocchi,
          alt: "Renaissance-inspired gilded cards on velvet beside a candle and manuscript"
        }
      },
      {
        id: "tarot-de-marseille",
        title: "Tarot de Marseille",
        era: "17th–18th Centuries",
        copy: "Printed packs circulating in France and neighboring regions established a durable visual vocabulary for Tarot. Their repeatable designs carried recognizable trump and pip arrangements beyond the world of one-off luxury decks.",
        visualSignature: "Bold outlines, flat areas of limited color, repeating pip arrangements, and consistent trump compositions make the system immediately recognizable.",
        historicalInfluence: "Its standardized sequence and imagery became a reference point for later continental decks, historical study, and modern revivals.",
        relatedLink: {
          label: "Learn about Major and Minor Arcana",
          route: "/tarot#tarot-arcana-groups-title"
        },
        image: {
          ...tarotHistoryImages.tarotDeMarseille,
          alt: "Marseille-inspired printed cards arranged in a candlelit European study"
        }
      },
      {
        id: "early-illustrated-modern",
        title: "Early Illustrated Modern Tarot",
        era: "Early 20th Century",
        copy: "Early twentieth-century artists extended narrative scenes across the minor cards rather than relying chiefly on repeated suit symbols. The complete deck could now communicate situations, gestures, and emotional relationships through pictures.",
        visualSignature: "Staged figures, expressive gestures, symbolic landscapes, and recurring motifs turn each card into a compact narrative scene.",
        historicalInfluence: "This pictorial approach reshaped how Tarot is taught and interpreted, becoming a foundation for countless later decks.",
        relatedLink: {
          label: "Explore the rise of illustrated modern Tarot",
          route: "/tarot/history/#modern-illustrated-tarot"
        },
        image: {
          ...tarotHistoryImages.riderWaiteSmith,
          alt: "Early modern illustrated Tarot-inspired cards arranged beside a deck box and candle"
        }
      },
      {
        id: "esoteric-modernism",
        title: "Esoteric Modernism",
        era: "20th Century",
        copy: "Twentieth-century esoteric decks combined occult correspondences with experimental color, geometry, and modernist art. They treated Tarot as both a philosophical system and a field for deliberate visual invention.",
        visualSignature: "Layered geometry, symbolic color, celestial diagrams, and abstracted figures encode multiple correspondences within a single image.",
        historicalInfluence: "These experiments encouraged later artists to build decks around distinct spiritual, intellectual, and aesthetic systems.",
        relatedLink: {
          label: "Discover Tarot’s occult symbolism",
          route: "/tarot/history/#occult-revival"
        },
        image: {
          ...tarotHistoryImages.symbolicCorrespondences,
          alt: "Tarot cards, geometric diagrams, books, and celestial instruments arranged in an esoteric study"
        }
      }
    ]
  },
  contributors: {
    id: "contributors",
    number: "04",
    heading: "Ideas and People Who Reshaped Tarot",
    introduction: "Tarot’s later meanings emerged through argument, invention, publishing, performance, and art. Rather than portraits, this archive uses symbolic editorial marks while preserving the documented contributions of each person.",
    note: "Symbolic editorial marks only; no generated historical portraits are used.",
    items: [
      {
        id: "court-de-gebelin",
        name: "Antoine Court de Gébelin",
        dates: "1725–1784",
        role: "Late eighteenth-century writer",
        monogram: "CG",
        symbol: "book",
        copy: "Popularized speculative claims connecting Tarot to ancient Egyptian wisdom during the late eighteenth century. His claims are not accepted as evidence of Tarot’s origin, but strongly influenced later occult interpretations.",
        detail: "Antoine Court de Gébelin was a French Protestant pastor, writer, and Freemason whose multivolume work Le Monde primitif argued that ancient wisdom survived inside language, myth, and symbols. In 1781 he included an essay on Tarot that presented the cards as remnants of an ancient Egyptian book. That origin story was speculative: the documented evidence instead places Tarot’s beginnings in fifteenth-century northern Italy as a card game. Even so, his argument proved enormously influential. It shifted attention from Tarot as play toward Tarot as a supposedly encoded philosophical system and supplied later occult writers with a compelling, if historically unsupported, narrative. His work is therefore important less as a reliable account of Tarot’s beginnings than as a turning point in how Europeans imagined the cards.",
        whyItMatters: "He helped establish the mythic framework through which later occultists reinterpreted Tarot, while also illustrating why documented history must be separated from influential speculation.",
        clarification: "Court de Gébelin’s Egyptian-origin theory is historically unsupported and should not be treated as evidence of Tarot’s documented origins."
      },
      {
        id: "etteilla",
        name: "Jean-Baptiste Alliette, known as Etteilla",
        dates: "1738–1791",
        role: "Cartomancy pioneer",
        monogram: "E",
        symbol: "cards",
        copy: "Developed one of the earliest systematic methods for using Tarot in divination and published dedicated cartomantic meanings and practices.",
        detail: "Jean-Baptiste Alliette, who published under the reversed surname Etteilla, was a professional French cartomancer and one of the earliest authors to organize Tarot specifically for divination. Building on the era’s enthusiasm for ancient and occult origins, he published methods, card meanings, spreads, and interpretive correspondences intended for practical readers rather than historical card players. He also developed a redesigned deck for cartomantic use, helping distinguish an explicitly divinatory Tarot from older gaming packs. Etteilla’s system incorporated upright and reversed meanings and offered a structured approach that later readers could study and reproduce. Although some of his historical ideas reflected the same unsupported Egyptian theories circulating in his period, his practical influence on professionalized Tarot reading and later published divination systems was substantial and enduring.",
        whyItMatters: "Etteilla helped turn scattered cartomantic practices into a teachable system and made divinatory Tarot a distinct published tradition.",
        clarification: "His occult origin claims belong to eighteenth-century interpretation, not to the documented Renaissance history of the cards."
      },
      {
        id: "eliphas-levi",
        name: "Éliphas Lévi",
        dates: "1810–1875",
        role: "Nineteenth-century occult writer",
        monogram: "L",
        symbol: "key",
        copy: "Connected Tarot with nineteenth-century Western esotericism, ceremonial magic, and Kabbalistic symbolism, influencing later occult orders and writers.",
        detail: "Éliphas Lévi was the pen name of French occult author Alphonse Louis Constant. His writings placed Tarot within a broad synthesis of ceremonial magic, Christian mysticism, Kabbalah, alchemy, and symbolic philosophy. Rather than treating the cards primarily as a game or simple fortune-telling device, Lévi presented the Major Arcana as a sequence capable of expressing an initiatory and cosmological system. He associated the twenty-two trumps with the Hebrew alphabet, an influential move even though later occult groups revised the exact correspondences. His approach helped shape the intellectual climate inherited by British and French esoteric orders in the late nineteenth century. Lévi did not recover an ancient, unchanged Tarot doctrine; he participated in a modern reinterpretation that layered new correspondences onto an older European card tradition.",
        whyItMatters: "His synthesis made Tarot central to nineteenth-century occult philosophy and provided a conceptual bridge to later ceremonial orders and deck designers.",
        clarification: "The correspondences Lévi promoted are later esoteric constructions rather than evidence about Tarot’s fifteenth-century use."
      },
      {
        id: "arthur-edward-waite",
        name: "Arthur Edward Waite",
        dates: "1857–1942",
        role: "Tarot system writer",
        monogram: "W",
        symbol: "star",
        copy: "Developed an influential early-twentieth-century Tarot system emphasizing symbolic and initiatory interpretation.",
        detail: "Arthur Edward Waite was a British-born writer and member of the Hermetic Order of the Golden Dawn who developed the conceptual program for the deck commonly called the Rider–Waite–Smith Tarot. Working with artist Pamela Colman Smith, he directed a complete illustrated sequence published in 1909. Waite drew on Christian mysticism, ceremonial traditions, and earlier occult correspondences, but he also sought a symbolic language that could operate through suggestion rather than explicit doctrine. His accompanying guide framed the cards for divination while withholding or compressing parts of his esoteric interpretation. The deck’s enduring influence comes from the collaboration between Waite’s program and Smith’s visual invention; crediting the system to Waite alone obscures the artist whose scenes made it legible to generations of readers.",
        whyItMatters: "Waite helped formulate one of the twentieth century’s most widely reproduced Tarot systems and commissioned a fully illustrated approach that reshaped modern reading.",
        clarification: "The deck was a collaboration: Pamela Colman Smith’s authorship of its visual language is foundational."
      },
      {
        id: "pamela-colman-smith",
        name: "Pamela Colman Smith",
        dates: "1878–1951",
        role: "Illustrator and theatrical artist",
        monogram: "PCS",
        symbol: "brush",
        copy: "Created the fully illustrated artwork that transformed modern Tarot reading, particularly through expressive narrative scenes on the minor cards.",
        detail: "Pamela Colman Smith was a British artist, illustrator, publisher, and theatrical designer whose work created the visual world of the deck published in 1909 under Arthur Edward Waite’s direction. Her most consequential innovation was the fully illustrated treatment of the minor cards. Instead of presenting only repeated suit symbols, she composed scenes with figures, gestures, environments, and emotional tension, allowing readers to interpret narrative relationships throughout the complete deck. Smith drew on her experience in illustration, theatre, folklore, and storytelling, as well as the symbolic brief available to her. The resulting images became a foundation for an immense number of later decks. For decades the deck was commonly named without her, but contemporary scholarship and publishing increasingly recognize it as the Rider–Waite–Smith Tarot.",
        whyItMatters: "Her pictorial storytelling made every card participate in a coherent visual narrative and decisively shaped how modern Tarot is learned, read, and redesigned.",
        clarification: "The generated studio image elsewhere on this page is an editorial reconstruction and does not depict Pamela Colman Smith."
      },
      {
        id: "crowley-harris",
        name: "Aleister Crowley and Lady Frieda Harris",
        dates: "1875–1947 · 1877–1962",
        role: "Esoteric system and modernist art",
        monogram: "C·H",
        symbol: "orbit",
        copy: "Collaborated on an influential esoteric Tarot system combining ceremonial symbolism, astrology, color theory, and modernist art.",
        detail: "Aleister Crowley and Lady Frieda Harris collaborated for several years on the paintings and symbolic program that became the Thoth Tarot. Crowley supplied an extensive esoteric framework shaped by Thelema, ceremonial magic, astrology, Kabbalistic correspondences, and his revisions to inherited occult titles and structures. Harris translated that dense system into layered paintings informed by modernist composition, geometric form, color theory, and sustained technical experimentation. Their collaboration was not a simple author-and-illustrator arrangement: surviving correspondence shows Harris questioning, researching, proposing, and repeatedly repainting designs throughout the long creative process. The cards were exhibited during their lifetimes, while the complete deck was published only later. Its visual and philosophical complexity made it one of the most influential alternatives to the Rider–Waite–Smith tradition.",
        whyItMatters: "Together they demonstrated how a Tarot deck could become both a rigorous esoteric system and a major modernist art project.",
        clarification: "The symbolic emblem used in the contributor list is decorative and is not a portrait or historical artifact."
      }
    ]
  },
  occultRevival: {
    id: "occult-revival",
    number: "05",
    heading: "Occult Revival and Esoteric Symbolism",
    paragraphs: [
      "During the eighteenth and nineteenth centuries, writers and occultists reinterpreted Tarot through Hermeticism, astrology, Kabbalistic correspondences, ceremonial magic, numerology, and broader esoteric philosophy.",
      "These frameworks created complex systems of association between cards, letters, planets, elements, paths, colors, and ritual ideas. They became deeply influential in later deck design and remain meaningful within many contemporary esoteric traditions."
    ],
    clarification: "The occult revival added influential symbolic systems to Tarot, but those later associations should not be confused with the documented origin of Tarot as a European card game.",
    categories: [
      "Hermeticism",
      "Astrology",
      "Kabbalistic correspondences",
      "Ceremonial symbolism"
    ],
    image: {
      ...tarotHistoryImages.occultRevival,
      alt: "Books, cards, celestial instruments, and symbolic diagrams in a dark esoteric study",
      caption: reconstructionCaption
    }
  },
  modernIllustratedTarot: {
    id: "modern-illustrated-tarot",
    number: "06",
    heading: "The Rise of Illustrated Modern Tarot",
    paragraphs: [
      "Many earlier pip cards emphasized repeated suit symbols rather than fully staged narrative scenes. In the early twentieth century, fully illustrated minor cards made the deck’s situations, gestures, moods, and relationships more visually immediate.",
      "Artists became central contributors to Tarot’s symbolic language. Pamela Colman Smith’s complete illustrated sequence demonstrated how every card could participate in a coherent visual story, while later artists continued to reinterpret that possibility through distinct cultural, spiritual, and artistic lenses."
    ],
    note: "Pamela Colman Smith’s artistic contribution was foundational to the modern experience of reading a fully illustrated Tarot deck.",
    image: {
      ...tarotHistoryImages.modernStudio,
      alt: "An artist studio filled with card sketches, painted Tarot-inspired scenes, books, brushes, and ink",
      caption: reconstructionCaption
    },
    links: [
      { label: "Explore The Fool", route: "/tarot/the-fool/" },
      { label: "Explore The Magician", route: "/tarot/the-magician/" },
      { label: "Explore The Star", route: "/tarot/the-star/" },
      { label: "Browse the complete Tarot card library", route: "/tarot" }
    ]
  },
  tarotToday: {
    id: "tarot-today",
    number: "07",
    heading: "Tarot Today",
    copy: "Tarot today exists across many overlapping worlds. It remains a card game in some traditions, a divinatory practice in others, and a creative, spiritual, psychological, artistic, or reflective tool for many contemporary users.",
    image: {
      ...tarotHistoryImages.tarotPractice,
      alt: "A contemporary reader reflecting over a wide Tarot spread in a candlelit setting",
      caption: reconstructionCaption
    },
    practices: [
      { label: "Reflective practice", symbol: "mirror" },
      { label: "Spiritual practice", symbol: "moon" },
      { label: "Art and storytelling", symbol: "brush" },
      { label: "Games and historical study", symbol: "cards" },
      { label: "Journaling", symbol: "feather" },
      { label: "Digital communities", symbol: "orbit" },
      { label: "Personal creativity", symbol: "spark" },
      { label: "Education and publishing", symbol: "book" }
    ]
  },
  resources: {
    id: "sources",
    number: "08",
    heading: "Sources and Further Reading",
    introduction: "Explore museum collections, curatorial essays, exhibition material, and historical catalogues for deeper study beyond this overview.",
    image: {
      ...tarotHistoryImages.bookshelfArchive,
      alt: "Antique books arranged in a dim archive with celestial details"
    },
    items: [
      {
        organization: "V&A",
        title: "A History of Tarot Cards",
        type: "Curatorial article",
        url: "https://www.vam.ac.uk/articles/tarot-cards"
      },
      {
        organization: "The Metropolitan Museum of Art",
        title: "Before Fortune-Telling: The History and Structure of Tarot",
        type: "Museum essay",
        url: "https://www.metmuseum.org/perspectives/tarot-2"
      },
      {
        organization: "The Metropolitan Museum of Art",
        title: "The World in Play: Luxury Cards, 1430–1540",
        type: "Exhibition catalogue",
        url: "https://resources.metmuseum.org/resources/metpublications/pdf/The_World_in_Play_Luxury_Cards_1430_1540.pdf"
      },
      {
        organization: "The Morgan Library & Museum",
        title: "Visconti-Sforza Tarot Cards",
        type: "Collection record",
        url: "https://www.themorgan.org/collection/tarot-cards"
      },
      {
        organization: "The Morgan Library & Museum",
        title: "Tarot! Renaissance Symbols, Modern Visions",
        type: "Exhibition resource",
        url: "https://www.themorgan.org/exhibitions/tarot"
      }
    ]
  },
  faqSection: {
    id: "history-faq",
    number: "09",
    heading: "Questions About the History of Tarot",
    introduction: "Clear answers to common questions about Tarot’s origins, evolution, historical myths, and modern development."
  },
  faq: [
    {
      question: "Where and when did Tarot originate?",
      answer: "The earliest documented Tarot traditions emerged in northern Italy during the fifteenth century. Early packs combined familiar suit cards with additional illustrated triumph cards and circulated within courtly and elite gaming culture. The historical record is incomplete, but surviving cards and written references place documented origins in Renaissance Europe."
    },
    {
      question: "Was Tarot originally used for divination?",
      answer: "No evidence shows that Tarot began as a divinatory system. Its earliest documented use was as a card game. Divinatory meanings and dedicated cartomantic methods developed later, particularly from the eighteenth century onward, as writers and readers reinterpreted the cards."
    },
    {
      question: "Is Tarot ancient Egyptian?",
      answer: "Tarot is not documented as an ancient Egyptian creation. Claims connecting it to hidden Egyptian wisdom became influential in eighteenth-century occult writing, but historians do not accept those claims as evidence of Tarot’s origin. The documented history begins in fifteenth-century Europe."
    },
    {
      question: "When did Tarot become connected to occultism?",
      answer: "Tarot became increasingly connected to occult philosophy during the eighteenth and nineteenth centuries. Writers and esoteric practitioners linked the cards with astrology, Kabbalah, Hermeticism, ceremonial magic, numerology, and other systems. These associations reshaped Tarot but appeared centuries after the earliest card games."
    },
    {
      question: "Who created the modern illustrated Tarot tradition?",
      answer: "Modern illustrated Tarot was shaped by both writers and artists rather than one person alone. Arthur Edward Waite developed an influential symbolic framework, while Pamela Colman Smith created the fully illustrated artwork that gave expressive scenes to the minor cards and profoundly changed how a complete deck could be read visually."
    },
    {
      question: "How has Tarot changed over time?",
      answer: "Tarot moved from Renaissance card play into print culture, cartomancy, occult philosophy, modern art, publishing, spiritual practice, reflective work, games, scholarship, and digital communities. No single contemporary use contains its entire history; Tarot continues to change through the people and cultures that engage with it."
    }
  ],
  relatedLinks: [
    {
      label: "Explore the Tarot hub and full 78-card library",
      route: "/tarot"
    },
    {
      label: "Compare Tarot and Oracle Cards",
      route: "/tarot/compare/tarot-vs-oracle-cards/"
    },
    {
      label: "Compare Tarot and Lenormand",
      route: "/tarot/compare/tarot-vs-lenormand/"
    }
  ],
  closingCta: {
    heading: "Continue Your Journey",
    copy: "Tarot’s history is still being written through every artist, reader, scholar, collector, storyteller, and question carried into the cards.",
    image: {
      ...tarotHistoryImages.closingArchive,
      alt: "An illuminated archive corridor opening beyond Tarot cards, books, a candle, and celestial instruments"
    },
    actions: [
      {
        label: "Explore Tarot Cards",
        description: "Discover meanings and symbolism",
        route: "/tarot#tarot-title",
        image: {
          ...tarotHistoryImages.riderWaiteSmith,
          alt: "Illustrated Tarot cards arranged beside a deck box and candle"
        }
      },
      {
        label: "Begin a Reading",
        description: "Draw insight from the cards",
        route: "/",
        image: {
          ...tarotHistoryImages.tarotPractice,
          alt: "A Tarot reader drawing a card over an active candlelit spread"
        }
      },
      {
        label: "Learn Tarot",
        description: "Study the history and language",
        route: "/tarot#tarot-understanding-title",
        image: {
          ...tarotHistoryImages.symbolicCorrespondences,
          alt: "An esoteric study with books, cards, diagrams, and celestial instruments"
        }
      },
      {
        label: "Write in Your Journal",
        description: "Capture reflection and memory",
        route: "/journal",
        image: {
          ...tarotHistoryImages.tarotTodayReflection,
          alt: "A journal beside a reflective Tarot spread in warm candlelight"
        }
      }
    ]
  },
  seo: {
    title: "History of Tarot: Origins, Evolution & Modern Meaning | Astral Veil",
    description: "Explore the history of Tarot from fifteenth-century Italian card games through occult revival, influential deck traditions, illustrated modern Tarot, and contemporary reflective practice.",
    ogTitle: "The History of Tarot",
    ogDescription: "Journey through Tarot’s documented European origins, artistic evolution, occult reinterpretation, influential traditions, and modern global practice.",
    lastModified: "2026-07-25"
  },
  hubTile: {
    key: "history",
    ctaLabel: "Explore Tarot History",
    route: "/tarot/history/"
  }
};
