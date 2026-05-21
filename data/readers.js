const readerImageBasePath = "assets/images/readers/";
const readerBloodMoonImageBasePath = `${readerImageBasePath}bloodmoon/`;

// Zodiac reader registry. Keep this array in zodiac order for page rendering.
// Scorpio remains Blood Moon/event-special and keeps her existing card treatment.
const tarotReaders = [
  {
    id: "aries",
    name: "Zahira Veyra",
    zodiac: "Aries",
    sign: "Aries",
    element: "Fire",
    title: "Ember Oracle of First Sparks",
    tagline: "A flame-bearing seer who turns hesitation into motion.",
    focus: "For courage, action, purpose, and decisive movement.",
    lore: "Zahira walks where beginnings catch fire. Her readings favor courage, decisive movement, and the clean burn of truth that makes a new path possible.",
    themes: ["courage", "initiation", "purpose", "revelation"],
    accentClass: "fire",
    image: `${readerImageBasePath}aries-phase1.png`,
    phase1Image: `${readerImageBasePath}aries-phase1.png`,
    phase2Image: `${readerImageBasePath}aries-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}aries-bloodmoon.png`,
    bloodMoonTitle: "Crimson Harbinger of the First Wound",
    bloodMoonDescription: "Zahira's Blood Moon fire splits into twin voices: one laughing at the edge of danger, the other cutting straight through hesitation. They speak to the seeker and to each other, teasing, contradicting, daring the truth to move faster than fear. Their affection is real, but so is the warning beneath it: not every spark wants to become light.",
    bloodMoonTraits: ["Rage", "Impulse", "Recklessness", "Domination"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Flame-bearing oracle of courage, purpose, and decisive movement.",
    description: "Zahira turns questions toward action, truth, and the first brave spark that refuses to dim.",
    energy: "Mystical flame reader for courage, purpose, and revelation.",
    intro: "Bring your question to the flame. I will read for courage, purpose, and the revelation bright enough to move you forward.",
    resultMessage: "The flame reveals this with courage; carry it forward.",
    chance: 9
  },
  {
    id: "taurus",
    name: "Nadia Vale",
    zodiac: "Taurus",
    sign: "Taurus",
    element: "Earth",
    title: "Green-Bronze Keeper of Stillness",
    tagline: "A grounded guide who steadies what the heart is ready to hold.",
    focus: "For comfort, patience, stability, and honest reflection.",
    lore: "Nadia reads through patience, body wisdom, and the slow intelligence of roots. She helps scattered questions settle into something honest, practical, and alive.",
    themes: ["stability", "comfort", "embodiment", "patience"],
    accentClass: "earth",
    image: `${readerImageBasePath}taurus-phase1.png`,
    phase1Image: `${readerImageBasePath}taurus-phase1.png`,
    phase2Image: `${readerImageBasePath}taurus-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}taurus-bloodmoon.png`,
    bloodMoonTitle: "Thorned Keeper of Possession",
    bloodMoonDescription: "Nadia Vale exposes the locked room beneath her gentleness, where comfort has been hoarded against every future loss. Her shadow does not rage; it refuses, roots deep, and names possession as devotion. When she reads beneath crimson light, she asks what you keep feeding because you are afraid to let it die.",
    bloodMoonTraits: ["Possession", "Stagnation", "Greed", "Obsession"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Grounded keeper of comfort, patience, and embodied clarity.",
    description: "Nadia helps scattered thoughts settle into form, offering steadiness without softening the truth.",
    energy: "Grounded guide for clarity, comfort, and honest reflection.",
    intro: "Take a slow breath and settle your thoughts. I will keep this reading steady, honest, and kind so the message can meet you clearly.",
    resultMessage: "Here is the message as clearly and gently as I can hold it for you.",
    chance: 9
  },
  {
    id: "gemini",
    name: "Eren & Astra Auralis",
    phaseTwoName: "Solnyra Auralis",
    zodiac: "Gemini",
    sign: "Gemini",
    element: "Air / Shadow",
    title: "Twin Voices of the Silver Mirror",
    tagline: "Twin readers who hear the hidden third truth between two choices.",
    focus: "For choices, duality, hidden patterns, and shifting perspectives.",
    lore: "Eren and Astra read through contradiction, wit, shadow, and reflection. Their gift is finding the pattern that appears only when two opposing truths are allowed to speak.",
    themes: ["duality", "choice", "language", "shadow logic"],
    accentClass: "air",
    image: `${readerImageBasePath}gemini-phase1.png`,
    phase1Image: `${readerImageBasePath}gemini-phase1.png`,
    phase2Image: `${readerImageBasePath}gemini-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}gemini-bloodmoon.png`,
    bloodMoonTitle: "The Split Tongue Beneath the Eclipse",
    bloodMoonDescription: "Eren and Astra Auralis lose the comfort of agreement beneath the crimson mirror. One voice charms, one voice wounds, and both know exactly where the lie learned your name. Their Blood Moon reading does not choose a side; it lets each contradiction speak until the hidden fracture becomes impossible to deny.",
    bloodMoonTraits: ["Deception", "Duplicity", "Fracture", "Instability"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Twin-voiced readers of choices, mirrors, and hidden mental patterns.",
    description: "Eren and Astra listen between two truths, revealing the shadow logic beneath restless questions.",
    energy: "Air-shadow readers for duality, hidden patterns, and changing perspective.",
    intro: "Let both sides of the question speak. We will read the movement between them and notice what the mirror has been holding back.",
    resultMessage: "Two voices meet in this card; listen for the third truth between them.",
    chance: 9
  },
  {
    id: "cancer",
    name: "Meg Caelia",
    zodiac: "Cancer",
    sign: "Cancer",
    element: "Water / Moon",
    title: "Moon-Tide Healer of Memory",
    tagline: "A moonlit healer who listens where the tide remembers.",
    focus: "For emotional clarity, healing, memory, and renewal.",
    lore: "Meg reads the emotional tide: memory, protection, grief, and return. Her presence softens what has been armored so the truth beneath feeling can rise safely.",
    themes: ["memory", "healing", "protection", "emotional tides"],
    accentClass: "water",
    image: `${readerImageBasePath}cancer-phase1.png`,
    phase1Image: `${readerImageBasePath}cancer-phase1.png`,
    phase2Image: `${readerImageBasePath}cancer-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}cancer-bloodmoon.png`,
    bloodMoonTitle: "The Drowned Heart That Refuses Release",
    bloodMoonDescription: "Meg Caelia carries every lost thing like a shell pressed too long against the heart. Under the Blood Moon, her tenderness darkens into a tide that can pull the living back toward old grief. She reads the place where care becomes control, and where memory keeps asking to be mistaken for love.",
    bloodMoonTraits: ["Clinging", "Fear", "Mood", "Emotional Control"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Moon-tide oracle of emotional movement, memory, and gentle renewal.",
    description: "Meg gathers messages like shells from deep water, softening what is ready to heal or return.",
    energy: "Oceanic mystic for emotional insight and gentle renewal.",
    intro: "Let the tide in you soften. We will draw the cards like shells from deep water and notice what wants to heal, move, or return.",
    resultMessage: "The tide has brought this message forward; receive it gently.",
    chance: 9
  },
  {
    id: "leo",
    name: "Cassian Solari",
    zodiac: "Leo",
    sign: "Leo",
    element: "Fire / Sun",
    title: "Solar Witness of the Brave Heart",
    tagline: "A radiant witness who reminds the heart how to be seen.",
    focus: "For confidence, visibility, courage, and heart-led action.",
    lore: "Cassian reads through warmth, pride, creativity, and the courage to stand in visible truth. His cards often point toward confidence that does not need to perform.",
    themes: ["radiance", "confidence", "creativity", "heart"],
    accentClass: "fire",
    image: `${readerImageBasePath}leo-phase1.png`,
    phase1Image: `${readerImageBasePath}leo-phase1.png`,
    phase2Image: `${readerImageBasePath}leo-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}leo-bloodmoon.png`,
    bloodMoonTitle: "The Devouring Crown of the Sun",
    bloodMoonDescription: "Cassian Solari's golden warmth blackens at the crown when the Blood Moon finds him. He still smiles like a sunlit promise, but the hunger underneath wants witnesses, applause, surrender. His reading turns toward the wound beneath pride: the fear that without adoration, the heart may vanish.",
    bloodMoonTraits: ["Vanity", "Pride", "Hunger", "Tyranny"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Solar guide of heart, radiance, confidence, and creative courage.",
    description: "Cassian turns difficult truths toward warmth, pride of spirit, and the courage to be seen.",
    energy: "Warm intuitive oracle with a radiant, heart-centered presence.",
    intro: "Come closer to the light. I will read with warmth and care, letting each card speak to the part of you that is ready to feel seen.",
    resultMessage: "Let this card meet your heart with warmth, honesty, and light.",
    chance: 9
  },
  {
    id: "virgo",
    name: "Amara Violeth",
    zodiac: "Virgo",
    sign: "Virgo",
    element: "Earth / Crystal",
    title: "Crystal Scribe of Quiet Signs",
    tagline: "A crystal-lit guide who finds meaning in the smallest signs.",
    focus: "For clarity, quiet decisions, patterns, and practical truth.",
    lore: "Amara reads through discernment, ritual, repair, and the sacred usefulness of detail. She clears confusion by naming what is practical, precise, and quietly true.",
    themes: ["discernment", "ritual", "repair", "clarity"],
    accentClass: "earth",
    image: `${readerImageBasePath}virgo-phase1.png`,
    phase1Image: `${readerImageBasePath}virgo-phase1.png`,
    phase2Image: `${readerImageBasePath}virgo-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}virgo-bloodmoon.png`,
    bloodMoonTitle: "The Blade of Merciless Precision",
    bloodMoonDescription: "Amara Violeth sharpens her crystal light until it becomes almost merciless. Beneath the Blood Moon, she sees the flaw, then the flaw beneath the flaw, until care begins to resemble a blade. Her darker reading asks where the need to repair everything became a way to avoid being seen unfinished.",
    bloodMoonTraits: ["Judgment", "Fixation", "Anxiety", "Perfectionism"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Crystal-lit guide of discernment, ritual, and practical next steps.",
    description: "Amara studies the small signs others miss, revealing the path by careful light and quiet precision.",
    energy: "Soft crystalline reader for hidden paths and quiet decisions.",
    intro: "I have lit the small candle for the quiet path. Choose your spread, and we will look carefully at the decision asking for your attention.",
    resultMessage: "By crystal light, this is the path your card is showing.",
    chance: 9
  },
  {
    id: "libra",
    name: "Abigail Asteria",
    zodiac: "Libra",
    sign: "Libra",
    element: "Air / Balance",
    title: "Starlit Mediator of the Scales",
    tagline: "A celestial mediator who restores proportion to the heart.",
    focus: "For balance, timing, harmony, and graceful choices.",
    lore: "Abigail reads harmony, timing, beauty, and consequence. Her guidance softens urgency, returning each question to balance, grace, and honest relation.",
    themes: ["balance", "timing", "harmony", "choice"],
    accentClass: "air",
    image: `${readerImageBasePath}libra-phase1.png`,
    phase1Image: `${readerImageBasePath}libra-phase1.png`,
    phase2Image: `${readerImageBasePath}libra-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}libra-bloodmoon.png`,
    bloodMoonTitle: "The Mirror That Cannot Choose",
    bloodMoonDescription: "Abigail Asteria's starlit grace becomes a hall of mirrors with no honest center. She can make any wound look beautiful, any silence look like peace, any surrender look like balance. Beneath the Blood Moon, her reading follows the self that vanished while everyone else was being kept whole.",
    bloodMoonTraits: ["Indecision", "Illusion", "Avoidance", "People-Pleasing"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Celestial mediator of timing, balance, beauty, and calm truth.",
    description: "Abigail's messages arrive like patient starlight, softening urgency into grace and proportion.",
    energy: "Gentle celestial guide for hope, timing, and spiritual calm.",
    intro: "The sky is patient with every question. Select your spread, and we will look for timing, grace, and the next calm sign above you.",
    resultMessage: "A calm sign has arrived; let it guide your next breath.",
    chance: 9
  },
  {
    id: "sagittarius",
    name: "Orion Valehart",
    zodiac: "Sagittarius",
    sign: "Sagittarius",
    element: "Fire / Astral Tide",
    title: "Astral Pathfinder of Far Horizons",
    tagline: "A starward wanderer who follows the horizon inside the question.",
    focus: "For direction, vision, movement, and the next brave step.",
    lore: "Orion reads vision, movement, faith, and the ache for wider truth. His cards often reveal the direction that appears once fear stops calling itself caution.",
    themes: ["vision", "journey", "faith", "direction"],
    accentClass: "fire",
    image: `${readerImageBasePath}sagittarius-phase1.png`,
    phase1Image: `${readerImageBasePath}sagittarius-phase1.png`,
    phase2Image: `${readerImageBasePath}sagittarius-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}sagittarius-bloodmoon.png`,
    bloodMoonTitle: "The Wild Flame Without Horizon",
    bloodMoonDescription: "Orion Valehart keeps walking long after the road has stopped forgiving him. His Blood Moon flame does not seek wisdom first; it seeks distance from consequence, from stillness, from the answer waiting at the end. He reads the escape route disguised as destiny and the conviction that burns because it cannot bear doubt.",
    bloodMoonTraits: ["Excess", "Restlessness", "Evasion", "Fanaticism"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Astral pathfinder of vision, direction, and luminous momentum.",
    description: "Orion follows the blue flame of intuition toward the next bright horizon waiting beneath the question.",
    energy: "Astral tide oracle for clear visions, quiet awakenings, and luminous inner direction.",
    intro: "I follow the blue flame of intuition toward the message waiting beneath your choice. Let us look for the horizon inside the cards.",
    resultMessage: "A blue star opens; let its clarity guide the next step.",
    chance: 8
  },
  {
    id: "capricorn",
    name: "Samira Obsidian",
    zodiac: "Capricorn",
    sign: "Capricorn",
    element: "Earth / Crown",
    title: "Obsidian Guardian of the Crown",
    tagline: "An obsidian guardian who names the truth that can endure.",
    focus: "For discipline, protection, endurance, and ancestral wisdom.",
    lore: "Samira reads discipline, legacy, protection, and the weight of responsibility. She brings difficult questions back to structure, endurance, and sovereign choice.",
    themes: ["discipline", "legacy", "protection", "sovereignty"],
    accentClass: "earth",
    image: `${readerImageBasePath}capricorn-phase1.png`,
    phase1Image: `${readerImageBasePath}capricorn-phase1.png`,
    phase2Image: `${readerImageBasePath}capricorn-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}capricorn-bloodmoon.png`,
    bloodMoonTitle: "The Obsidian Sovereign of Cold Authority",
    bloodMoonDescription: "Samira Obsidian wears authority like armor forged from old fear. Beneath the Blood Moon, her protection hardens into command, her discipline into silence, her ambition into a throne no one is allowed to question. Her reading asks what weakness you buried so deeply that control began speaking in its voice.",
    bloodMoonTraits: ["Control", "Coldness", "Severity", "Ambition"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Obsidian guardian of discipline, legacy, protection, and truth.",
    description: "Samira holds the reading space with ancestral stillness for questions that require strength and respect.",
    energy: "Protective intuitive with steady, ancestral-feeling wisdom.",
    intro: "You are held while we read. I will keep the space protected and direct, so the cards can offer wisdom with strength and respect.",
    resultMessage: "Stand steady; this message comes with protection and purpose.",
    chance: 9
  },
  {
    id: "aquarius",
    name: "Lyssara Voss",
    zodiac: "Aquarius",
    sign: "Aquarius",
    element: "Air / Starlight",
    title: "Starlight Cartographer of Hidden Patterns",
    tagline: "A starlit pattern-reader who hears the future in silence.",
    focus: "For insight, strange patterns, revelation, and higher perspective.",
    lore: "Lyssara reads distance, revelation, systems, and the strange geometry of becoming. Her insight often arrives as a pattern seen from far above the self.",
    themes: ["patterns", "future sight", "distance", "revelation"],
    accentClass: "air",
    image: `${readerImageBasePath}aquarius-phase1.png`,
    phase1Image: `${readerImageBasePath}aquarius-phase1.png`,
    phase2Image: `${readerImageBasePath}aquarius-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}aquarius-bloodmoon.png`,
    bloodMoonTitle: "The Exiled Mind Beyond the Signal",
    bloodMoonDescription: "Lyssara Voss listens beyond the signal until ordinary warmth sounds like static. Under the Blood Moon, her vision becomes a high, cold distance where belonging feels like contamination. She reads the hidden wound inside detachment: the old ache of being different, sharpened into superiority.",
    bloodMoonTraits: ["Detachment", "Rebellion", "Alienation", "Superiority"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Starlit pattern-reader of revelation, distance, and future sight.",
    description: "Lyssara traces secret geometry through silence, finding the places where the Veil folds inward.",
    energy: "Ivory celestial reader attuned to pale starlight, hidden patterns, and quiet revelations.",
    intro: "I read the spaces between signs, where the quietest symbols leave their light. Let the pattern reveal itself slowly.",
    resultMessage: "A violet thread appears where your question touches the unseen.",
    chance: 8
  },
  {
    id: "pisces",
    name: "Malakai Nereon",
    zodiac: "Pisces",
    sign: "Pisces",
    element: "Water / Dream",
    title: "Dream-Current Oracle of the Deep",
    tagline: "A dream-current oracle who follows symbols beneath waking thought.",
    focus: "For dreams, symbols, intuition, omens, and inner truth.",
    lore: "Malakai reads dreams, omens, compassion, and the unseen emotional sea. He listens where imagination and memory blur into messages from the deeper self.",
    themes: ["dreams", "omens", "compassion", "surrender"],
    accentClass: "water",
    image: `${readerImageBasePath}pisces-phase1.png`,
    phase1Image: `${readerImageBasePath}pisces-phase1.png`,
    phase2Image: `${readerImageBasePath}pisces-phase2.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}pisces-bloodmoon.png`,
    bloodMoonTitle: "The Drowning Oracle of False Mercy",
    bloodMoonDescription: "Malakai Nereon listens from the deep place where mercy and disappearance begin to sound alike. His Blood Moon current is soft enough to trust and dark enough to drown in. He reads the dream that promised healing but asked for surrender, and the part of the soul that is tired enough to agree.",
    bloodMoonTraits: ["Delusion", "Escape", "Surrender", "Dissolution"],
    bloodMoonRevelation: "Blood Moon Rising",
    readingStyle: "Dream-current oracle of symbols, omens, memory, and inner truth.",
    description: "Malakai listens for signs drifting between sleep, imagination, and the unseen emotional current.",
    energy: "Dreamlike seer attuned to symbols, omens, and inner truth.",
    intro: "The symbols are already gathering at the edge of the veil. Choose your spread, and we will listen for what arrives between dream and knowing.",
    resultMessage: "The symbol has opened; listen to what it whispers beneath the surface.",
    chance: 9
  }
];

const mysteryReaders = [
  {
    id: "zephyra-noctis",
    name: "Zephyra Noctis",
    zodiac: "Scorpio",
    sign: "Scorpio",
    element: "Water / Shadow",
    title: "Blood Moon Witness of Hidden Truths",
    tagline: "A Scorpio shadow-reader bound to forbidden revelation.",
    focus: "For transformation, buried motives, shadow truth, and emotional depth.",
    lore: "Zephyra is tied to eclipse memory, hidden alchemy, and truths buried beneath the Veil. Her presence is not gentle, but it is precise: she reveals what is no longer willing to remain hidden.",
    themes: ["shadow", "transformation", "secrets", "forbidden insight"],
    accentClass: "bloodmoon",
    image: `${readerImageBasePath}scorpio-phase1.png`,
    phase1Image: `${readerImageBasePath}scorpio-phase1.png`,
    phase2Image: `${readerImageBasePath}scorpio-phase2.png`,
    gridImage: `${readerImageBasePath}scorpio-phase1.png`,
    bloodMoonImage: `${readerBloodMoonImageBasePath}scorpio-bloodmoon.png`,
    bloodMoonTitle: "Witness of the Hidden Rot",
    bloodMoonDescription: "Zephyra Noctis waits where sealed names keep breathing under dust. Beneath the Blood Moon, she does not merely uncover secrets; she listens until the secret begins to want something back. Her reading follows obsession, revenge, and the hidden wound that learned to survive by becoming dangerous.",
    bloodMoonTraits: ["Obsession", "Secrecy", "Revenge", "Manipulation"],
    bloodMoonRevelation: "Blood Moon Rising",
    bloodMoon: true,
    special: true,
    requiresBloodMoon: true,
    bloodMoonProfile: {
      rarityLabel: "Recovered Blood Moon Entry",
      energy: "Identity incomplete. Associated with eclipse memory, hidden alchemy, and forbidden revelation.",
      readingStyle: "Reveals hidden motives, transformation, and truths buried beneath the Veil.",
      description: "A crimson veilwalker associated with forbidden insight, eclipse memory, and Scorpio-shadow revelation.",
      backstory: "A Scorpio-bound veilwalker recovered in fragments beneath the Blood Moon. Her record suggests transformation, hindsight, and knowledge drawn too close to the Veil.",
      fragmentLabel: "Record Incomplete"
    },
    readingStyle: "Reveals hidden motives, transformation, and truths buried beneath the Veil.",
    description: "A water-shadow veilwalker associated with transformation, hidden motives, and truths buried beneath the Veil.",
    energy: "Rare Blood Moon oracle of crimson eclipse, forbidden insight, and Scorpio-shadow revelation.",
    intro: "The veil did not intend for us to meet.",
    resultMessage: "Your cards bleed through the silence. What has been hidden is no longer willing to remain buried.",
    backstory: "Zephyra Noctis is a rare Scorpio astral anomaly, said to answer only beneath the Blood Moon.",
    rarityLabel: "Rare Blood Moon Reader",
    revealMessage: "The Blood Moon opens its eye. Zephyra Noctis has answered.",
    mysteryAura: "blood",
    isMystery: true,
    isMysteryOnly: true,
    isBloodMoon: true,
    chance: 3
  }
];

const readerSelectionMessagesById = {
  aries: {
    normalSelectionMessages: [
      "Zahira reads where hesitation is ready to become motion.",
      "Her fire favors courage, direct answers, and the first honest step.",
      "Choose her when your question needs momentum more than comfort."
    ],
    bloodMoonSelectionMessages: [
      "Zahira's twin flame teases the truth before it strikes.",
      "One voice dares you forward; the other asks what your impulse is hiding.",
      "Her Blood Moon fire speaks in sharp affection and dangerous honesty."
    ]
  },
  taurus: {
    normalSelectionMessages: [
      "Nadia steadies the question until its practical truth can surface.",
      "Her readings favor patience, embodiment, and what the heart can actually hold.",
      "Choose her when you need grounding before the answer arrives."
    ],
    bloodMoonSelectionMessages: [
      "Nadia reveals where comfort has become a cage.",
      "She reads the attachments that call themselves safety.",
      "Her shadow current names what you clutch long after it has gone cold."
    ]
  },
  gemini: {
    normalSelectionMessages: [
      "Eren and Astra read the third truth hidden between two choices.",
      "Their mirror favors questions with more than one face.",
      "Choose them when your thoughts keep changing shape."
    ],
    bloodMoonSelectionMessages: [
      "Eren and Astra expose the lie inside the clever answer.",
      "They read fractures, false voices, and truths split clean in two.",
      "Their shadow mirror shows where language became a hiding place."
    ]
  },
  cancer: {
    normalSelectionMessages: [
      "Meg reads the emotional tide beneath memory, longing, and return.",
      "Her current is gentle, but it does not ignore what still aches.",
      "Choose her when feeling is the doorway to the answer."
    ],
    bloodMoonSelectionMessages: [
      "Meg reveals where love has learned to cling.",
      "She reads old grief that keeps pulling the present underwater.",
      "Her shadow tide names the fear hidden inside devotion."
    ]
  },
  leo: {
    normalSelectionMessages: [
      "Cassian reads through warmth, visibility, and the brave heart.",
      "His light favors confidence that does not need to perform.",
      "Choose him when the answer asks you to be seen honestly."
    ],
    bloodMoonSelectionMessages: [
      "Under crimson shadow, Cassian reveals where pride hungers for worship.",
      "He reads the crown you reach for when the heart feels unseen.",
      "His Blood Moon glare exposes vanity dressed as courage."
    ]
  },
  virgo: {
    normalSelectionMessages: [
      "Amara reads the small signs that become the practical path.",
      "Her crystal light favors clarity, repair, and careful next steps.",
      "Choose her when the answer is hidden in the details."
    ],
    bloodMoonSelectionMessages: [
      "Amara exposes the blade inside perfection.",
      "She reads the flaw you cannot stop touching.",
      "Her shadow precision reveals where judgment became a ritual."
    ]
  },
  libra: {
    normalSelectionMessages: [
      "Abigail reads balance, timing, and the quiet weight of choice.",
      "Her starlight softens urgency without hiding consequence.",
      "Choose her when harmony needs honesty to become real."
    ],
    bloodMoonSelectionMessages: [
      "Abigail reveals the self abandoned for peace.",
      "She reads the smile that hides avoidance.",
      "Her shadow scales expose beauty, illusion, and the cost of pleasing everyone."
    ]
  },
  "zephyra-noctis": {
    normalSelectionMessages: [
      "Zephyra waits beyond ordinary light, listening for buried motives.",
      "Her current is sealed until crimson truth returns.",
      "She answers questions that are not ready to stay buried."
    ],
    bloodMoonSelectionMessages: [
      "Zephyra reads secrets until they begin to answer back.",
      "She exposes obsession, revenge, and the wound beneath control.",
      "Her shadow sight does not comfort what was built to stay hidden."
    ]
  },
  sagittarius: {
    normalSelectionMessages: [
      "Orion reads the horizon inside the question.",
      "His blue flame favors direction, movement, and the brave next step.",
      "Choose him when your answer needs room to breathe."
    ],
    bloodMoonSelectionMessages: [
      "Under crimson sky, Orion reveals where freedom became escape.",
      "He reads the road you keep taking to avoid the stillness.",
      "His shadow flame exposes excess, evasion, and conviction without mercy."
    ]
  },
  capricorn: {
    normalSelectionMessages: [
      "Samira reads endurance, structure, and the truth that can hold weight.",
      "Her obsidian calm favors responsibility without surrendering the self.",
      "Choose her when the question needs strength, respect, and form."
    ],
    bloodMoonSelectionMessages: [
      "Samira exposes control disguised as protection.",
      "She reads the cold law you built to hide fear.",
      "Her shadow crown reveals ambition sharpened into severity."
    ]
  },
  aquarius: {
    normalSelectionMessages: [
      "Lyssara reads strange patterns from a higher vantage.",
      "Her starlight favors insight, distance, and revelation in silence.",
      "Choose her when the answer looks like a pattern, not a path."
    ],
    bloodMoonSelectionMessages: [
      "Lyssara reveals where distance became doctrine.",
      "She reads alienation, superiority, and the wound beneath detachment.",
      "Her shadow signal exposes the mind that fled the human heart."
    ]
  },
  pisces: {
    normalSelectionMessages: [
      "Malakai reads symbols drifting beneath waking thought.",
      "His dream-current favors omens, intuition, and emotional truth.",
      "Choose him when the answer arrives as feeling before language."
    ],
    bloodMoonSelectionMessages: [
      "Malakai reveals the mercy that became escape.",
      "He reads delusion, surrender, and the song beneath self-erasure.",
      "His shadow water exposes the dream that asks you to disappear."
    ]
  }
};

function applyReaderSelectionMessages(reader) {
  const messages = readerSelectionMessagesById[reader.id];

  if (!messages) {
    return;
  }

  reader.normalSelectionMessages = messages.normalSelectionMessages;
  reader.bloodMoonSelectionMessages = messages.bloodMoonSelectionMessages;
}

tarotReaders.forEach(applyReaderSelectionMessages);
mysteryReaders.forEach(applyReaderSelectionMessages);

function createStandardReaderForms(reader) {
  return [
    {
      id: "phase1",
      label: "Oracle",
      title: "Oracle",
      image: reader.phase1Image,
      description: reader.tagline
    },
    {
      id: "phase2",
      label: "Ascendant",
      title: "Ascendant",
      image: reader.phase2Image,
      description: `${reader.name} steps beyond the familiar veil, revealing a more celestial expression of ${reader.sign} power.`
    }
  ].filter((form) => form.image);
}

tarotReaders.forEach((reader) => {
  reader.forms = createStandardReaderForms(reader);
});

mysteryReaders.forEach((reader) => {
  reader.forms = createStandardReaderForms(reader);
});
