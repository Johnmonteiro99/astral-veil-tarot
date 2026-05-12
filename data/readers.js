const tarotReaders = [
  {
    id: "abigail",
    name: "Abigail",
    image: "assets/images/readers/Abigail.jpg",
    energy: "Grounded guide for clarity, comfort, and honest reflection.",
    intro: "Take a slow breath and settle your thoughts. I will keep this reading steady, honest, and kind so the message can meet you clearly.",
    resultMessage: "Here is the message as clearly and gently as I can hold it for you.",
    chance: 9
  },
  {
    id: "aisara",
    name: "Aisara",
    image: "assets/images/readers/Aisara.jpg",
    energy: "Dreamlike seer attuned to symbols, omens, and inner truth.",
    intro: "The symbols are already gathering at the edge of the veil. Choose your spread, and we will listen for what arrives between dream and knowing.",
    resultMessage: "The symbol has opened; listen to what it whispers beneath the surface.",
    chance: 9
  },
  {
    id: "amara",
    name: "Amara",
    image: "assets/images/readers/Amara.jpg",
    energy: "Warm intuitive oracle with a radiant, heart-centered presence.",
    intro: "Come closer to the light. I will read with warmth and care, letting each card speak to the part of you that is ready to feel seen.",
    resultMessage: "Let this card meet your heart with warmth, honesty, and light.",
    chance: 9
  },
  {
    id: "kaelani",
    name: "Kaelani",
    image: "assets/images/readers/kaelani.jpg",
    energy: "Oceanic mystic for emotional insight and gentle renewal.",
    intro: "Let the tide in you soften. We will draw the cards like shells from deep water and notice what wants to heal, move, or return.",
    resultMessage: "The tide has brought this message forward; receive it gently.",
    chance: 9
  },
  {
    id: "lucia",
    name: "Lucia",
    image: "assets/images/readers/lucia.jpg",
    energy: "Soft candlelit reader for hidden paths and quiet decisions.",
    intro: "I have lit the small candle for the quiet path. Choose your spread, and we will look carefully at the decision asking for your attention.",
    resultMessage: "By candlelight, this is the path your card is showing.",
    chance: 9
  },
  {
    id: "nyah",
    name: "Nyah",
    image: "assets/images/readers/Nyah.jpg",
    energy: "Protective intuitive with steady, ancestral-feeling wisdom.",
    intro: "You are held while we read. I will keep the space protected and direct, so the cards can offer wisdom with strength and respect.",
    resultMessage: "Stand steady; this message comes with protection and purpose.",
    chance: 9
  },
  {
    id: "nyxara",
    name: "Nyxara",
    image: "assets/images/readers/nyxara.jpg",
    energy: "Shadow reader for moonlit insight and deep transformation.",
    intro: "Do not fear the dark edge of the mirror. Choose your cards, and I will help you face what is hidden without losing your power.",
    resultMessage: "The shadow has spoken; look closely, and take your power back.",
    chance: 9
  },
  {
    id: "seraphine",
    name: "Seraphine",
    image: "assets/images/readers/seraphina.jpg",
    energy: "Gentle celestial guide for hope, timing, and spiritual calm.",
    intro: "The sky is patient with every question. Select your spread, and we will look for timing, grace, and the next calm sign above you.",
    resultMessage: "A calm sign has arrived; let it guide your next breath.",
    chance: 9
  },
  {
    id: "zahira",
    name: "Zahira",
    image: "assets/images/readers/zahira.jpg",
    energy: "Mystical flame reader for courage, purpose, and revelation.",
    intro: "Bring your question to the flame. I will read for courage, purpose, and the revelation bright enough to move you forward.",
    resultMessage: "The flame reveals this with courage; carry it forward.",
    chance: 9
  }
];

const mysteryReaders = [
  {
    id: "lyssara",
    name: "Lyssara",
    image: "assets/images/readers/lyssara.jpg",
    energy: "Ivory celestial reader attuned to pale starlight, hidden patterns, and quiet revelations.",
    intro: "The veil stirs... a hidden guide answers. I read the spaces between signs, where the quietest symbols leave their light.",
    resultMessage: "A violet thread appears where your question touches the unseen.",
    backstory: "Lyssara appears when the veil folds inward, carrying pale starlight, hidden patterns, and celestial riddles.",
    rarityLabel: "Ivory Veil Reader",
    encounterChance: "Mystery Encounter Chance: 8%",
    revealMessage: "A pale celestial presence steps forward from the hidden folds of the veil.",
    mysteryAura: "ivory",
    isMystery: true,
    isMysteryOnly: true,
    chance: 8
  },
  {
    id: "elyra",
    name: "Elyra",
    image: "assets/images/readers/elyra.jpg",
    energy: "Astral blue oracle for clear visions, quiet awakenings, and luminous inner direction.",
    intro: "The veil stirs... a hidden guide answers. I follow the blue flame of intuition toward the message waiting beneath your choice.",
    resultMessage: "A blue star opens; let its clarity guide the next step.",
    backstory: "Elyra rises like a blue star reflected in deep water, guiding quiet awakenings and luminous inner direction.",
    rarityLabel: "Astral Tide Reader",
    encounterChance: "Mystery Encounter Chance: 8%",
    revealMessage: "A blue astral tide rises, carrying Elyra into the reading.",
    mysteryAura: "cyan",
    isMystery: true,
    isMysteryOnly: true,
    chance: 8
  },
  {
    id: "zephyra-noctis",
    name: "Zephyra Noctis",
    image: "assets/images/readers/zephyra-noctis.jpg",
    energy: "Rare Blood Moon oracle of crimson eclipse, forbidden insight, and Scorpio-shadow revelation.",
    intro: "The veil did not intend for us to meet.",
    resultMessage: "Your cards bleed through the silence. What has been hidden is no longer willing to remain buried.",
    backstory: "Zephyra Noctis is a rare crimson astral anomaly, said to answer only beneath the Blood Moon.",
    rarityLabel: "Rare Blood Moon Reader",
    encounterChance: "Rare Encounter Chance: 3%",
    revealMessage: "The Blood Moon opens its eye. Zephyra Noctis has answered.",
    mysteryAura: "blood",
    isMystery: true,
    isMysteryOnly: true,
    isBloodMoon: true,
    chance: 3
  }
];
