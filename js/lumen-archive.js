const LUMEN_ROOM_IMAGE_BASE = "assets/images/archive/lumen/rooms/";
const LUMEN_ROOM_IMAGES = {
  arrivalHero: "dawn_atium.png",
  reflectionHero: "reflection_pool.png",
  reflectionPreview: "RP.png",
  reflectionSeal: "seal_of_clarity.png",
  breathHero: "sacntuary_breath.png",
  breathPreview: "SOB.png",
  breathSeal: "seal_of_breath.png",
  renewalHero: "garden_of_renewal.png",
  renewalPreview: "garden_of_renewal.png",
  renewalSeal: "seal_of_renewal.png",
  groveHero: "rooted_grove.png",
  grovePreview: "RG.png",
  groveSeal: "seal_of_grounding.png",
  mirrorsHero: "Hall_of_mirros.png",
  mirrorsPreview: "Hall_of_mirros.png",
  mirrorsSeal: "seal_of_integration.png"
};
const LUMEN_ROOM_IMAGE_ALIASES = {
  "dawn atrium.png": LUMEN_ROOM_IMAGES.arrivalHero,
  "dawn-atrium.png": LUMEN_ROOM_IMAGES.arrivalHero,
  "dawn_atrium.png": LUMEN_ROOM_IMAGES.arrivalHero,
  "dawn atium.png": LUMEN_ROOM_IMAGES.arrivalHero,
  "dawn-atium.png": LUMEN_ROOM_IMAGES.arrivalHero,
  "garden of renewal.png": LUMEN_ROOM_IMAGES.renewalHero,
  "garden-of-renewal.png": LUMEN_ROOM_IMAGES.renewalHero,
  "reflection pool.png": LUMEN_ROOM_IMAGES.reflectionHero,
  "reflection-pool.png": LUMEN_ROOM_IMAGES.reflectionHero,
  "sanctuary of breath.png": LUMEN_ROOM_IMAGES.breathHero,
  "sanctuary-of-breath.png": LUMEN_ROOM_IMAGES.breathHero,
  "sanctuary_breath.png": LUMEN_ROOM_IMAGES.breathHero,
  "rooted grove.png": LUMEN_ROOM_IMAGES.groveHero,
  "rooted-grove.png": LUMEN_ROOM_IMAGES.groveHero,
  "hall of mirrors.png": LUMEN_ROOM_IMAGES.mirrorsHero,
  "hall-of-mirrors.png": LUMEN_ROOM_IMAGES.mirrorsHero,
  "hall_of_mirrors.png": LUMEN_ROOM_IMAGES.mirrorsHero
};

function getLumenRoomImagePath(filename) {
  const imageName = String(filename || "").trim().replaceAll("\\", "/");

  if (!imageName) {
    return "";
  }

  if (/^(?:https?:)?\/\//.test(imageName) || imageName.startsWith("/")) {
    return imageName;
  }

  const normalizedImageName = imageName
    .replace(/^\.?\//, "")
    .replace(/^assets\/images\/lumen archive rooms\//i, LUMEN_ROOM_IMAGE_BASE)
    .replace(/^assets\/images\/lumen-archive-rooms\//i, LUMEN_ROOM_IMAGE_BASE);
  const rawBasename = normalizedImageName.split("/").pop() || normalizedImageName;
  let decodedBasename = rawBasename;

  try {
    decodedBasename = decodeURIComponent(rawBasename);
  } catch (error) {
    decodedBasename = rawBasename;
  }

  const aliasedBasename = LUMEN_ROOM_IMAGE_ALIASES[decodedBasename.toLowerCase()] || decodedBasename;

  if (normalizedImageName.startsWith(LUMEN_ROOM_IMAGE_BASE)) {
    return `${LUMEN_ROOM_IMAGE_BASE}${aliasedBasename}`;
  }

  return `${LUMEN_ROOM_IMAGE_BASE}${aliasedBasename}`;
}

function getLumenCssImageUrl(filename) {
  const imagePath = getLumenRoomImagePath(filename);

  if (!imagePath) {
    return "";
  }

  try {
    return new URL(imagePath, document.baseURI).href;
  } catch (error) {
    return imagePath;
  }
}

const lumenSanctuaries = [
  {
    id: "reflection-pool",
    title: "The Reflection Pool",
    need: "Reflection",
    needText: "For emotions, intuition, and self-discovery.",
    selectorSubtitle: "See with gentle truth",
    selectorGlyph: "✦",
    element: "Water",
    description: "A still pool where the self can be seen without turning away.",
    keywords: ["Reflection", "Emotion", "Intuition", "Self-Discovery"],
    purpose: "Emotional reflection, self-discovery, and intuitive clarity.",
    previewPurpose: "This path is for emotional clarity, self-discovery, and quiet inner listening.",
    practice: "Use this sanctuary for prompts, writings, and quiet inner listening.",
    lightworkNote: "The surface shows the face. The depth shows what still asks to be known.",
    image: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.reflectionHero),
    interiorIntro: "{name}, the water does not ask you to explain yourself before it reflects you.",
    interiorMood: "This room is not here to fix your feelings. It is here to let them become visible.",
    roomClass: "water",
    scroll: {
      title: "The Still Water Within",
      description: "A reflection on emotion, self-discovery, and seeing without judgment.",
      body: [
        "There are days I have mistaken silence for peace.",
        "I have sat very still and called it healing, when really I was only afraid to disturb what hurt beneath the surface. It is a strange thing, to carry so much feeling and become skilled at appearing calm. I have done this often. I have smiled with a full heart and spoken with an empty one. I have let the world believe I was clear simply because I had learned how not to spill.",
        "But water does not love us for our composure.\nIt loves us for our honesty.",
        "When I look long enough into a still surface, I begin to understand that reflection is not punishment. It is invitation. The face that returns to me is never only my face. It is the child who went quiet too early. The grief that learned good manners. The longing that keeps changing its name so I will not recognize it too quickly.",
        "I used to believe that if I looked within, I would only find what was broken.\nNow I think I find what has been waiting.",
        "There is tenderness in finally seeing what I have spent years avoiding. There is sorrow there too. Not a violent sorrow - a softer one. The kind that arrives when you realize how long you have been living without fully standing beside yourself.",
        "Perhaps that is what this water is for.\nNot to judge the trembling in me, but to witness it.\nNot to ask me to become pure, but to become true.",
        "And if I remain here long enough, I remember something important:",
        "the surface shows the face,\nbut the depth reveals the self.",
        "Closing Note:",
        "Every light that wanders through reflection is only remembering the way back to its source."
      ]
    },
    reflections: [
      "What emotion have you been carrying that has never been given a safe place to speak?",
      "Where in your life are you asking for clarity while refusing to become still enough to receive it?",
      "What part of yourself do you only allow to surface when no one is watching?",
      "What feeling keeps returning because it wants to be understood rather than controlled?",
      "Where have you mistaken emotional depth for weakness?",
      "What truth appears when you stop disturbing the water with explanations?",
      "What does your reflection reveal when you look without defending yourself?",
      "What old grief has become so familiar that you have started calling it home?",
      "Where are you being invited to soften without surrendering your power?",
      "What memory still moves beneath your choices like an unseen tide?",
      "What would you discover if you treated your sensitivity as wisdom instead of burden?",
      "Where are you holding back tears that were meant to cleanse, not shame you?",
      "What part of you is asking to be witnessed without being fixed?",
      "What relationship, dream, or version of yourself has changed shape, and what are you still trying to keep unchanged?",
      "Where does your intuition speak quietly while fear speaks loudly?",
      "What have you been avoiding because feeling it fully would make it real?",
      "What does your heart already know that your mind keeps asking others to confirm?",
      "Where have you learned to hide your tenderness in order to be accepted?",
      "What would it mean to trust the current instead of forcing the river?",
      "What are you ready to forgive yourself for feeling?",
      "What reflection have you been afraid would look back if you finally became still?",
      "What truth within you is waiting for gentleness before it rises?"
    ]
  },
  {
    id: "sanctuary-of-breath",
    title: "The Sanctuary of Breath",
    need: "Breath",
    needText: "For clarity, release, and returning to the present.",
    selectorSubtitle: "Return to your center",
    selectorGlyph: "≈",
    element: "Air",
    description: "A quiet chamber where breath becomes a lantern for the mind.",
    keywords: ["Breath", "Clarity", "Release", "Voice"],
    purpose: "Mental clarity, release, communication, and returning to the rhythm of being alive.",
    previewPurpose: "This path is for clarity, release, and returning to the present.",
    practice: "Use this sanctuary for breathwork, thought-clearing prompts, and inner stillness.",
    lightworkNote: "What leaves the body may also leave the mind.",
    image: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.breathHero),
    interiorIntro: "{name}, return first to the breath. The rest can wait.",
    interiorMood: "This room listens for the space between what you carry and what you are ready to release.",
    roomClass: "air",
    featuredReflection: "What does your breath reveal about the places where you still do not feel safe?",
    scroll: {
      title: "The Space Between Inhale and Return",
      description: "A reflection on breath, release, clarity, and the space between inner noise.",
      body: [
        "I did not know how tired I was until I heard myself breathe.",
        "Not the shallow breathing of surviving a day. Not the quiet breath a person takes to keep moving. I mean the kind of breath that reaches deeper than thought - the kind that enters the body like a hand on the shoulder and says, gently, you may come back now.",
        "For a long time, I lived as if I were slightly absent from myself. My words kept going, my hands kept working, my face kept answering, but something quieter in me had stepped away. I did not notice at first. People can disappear from themselves very politely.",
        "Then one day, in a moment with no witness, I inhaled as though I had been underwater.",
        "It startled me.\nHow little room I had given my own life inside my body.",
        "Breath is such an ordinary miracle that we forget it is also a messenger. It tells the truth before the mouth does. It knows fear before the mind names it. It shortens when we abandon ourselves. It softens when we are safe enough to return.",
        "I think this is why so much of healing feels invisible. No bells ring. No great voice announces your arrival. Sometimes all that changes is this: the chest loosens, the jaw unclenches, and the soul stops standing outside the door.",
        "I have spent years trying to find answers in language, but breath has taught me another way.\nSome truths are not spoken.\nThey are entered.",
        "If I listen carefully, even the air seems to say the same thing:\ndo not force your becoming.\nReceive it.",
        "And so I sit here and practice something simple, though not easy -\nto let each breath be permission,\nto let each exhale be release,\nto let each return be enough.",
        "Closing Note:",
        "Every living light is borrowed for a while, and every breath carries it gently home to its source."
      ]
    },
    reflections: [
      "What thought is asking to be released with the next breath?",
      "Where has your mind become a room with no open windows?",
      "What are you holding in your body that your breath has been trying to release?",
      "What would change if you paused before believing every thought that arrives?",
      "Where have you confused mental noise with inner truth?",
      "What words have you swallowed that still need a clean and honest way out?",
      "What belief feels heavy because it was never truly yours?",
      "Where do you need more space before you can understand what you feel?",
      "What part of your life is asking for a slower inhale and a braver exhale?",
      "What would your spirit say if your fear stopped interrupting it?",
      "Where have you been answering too quickly instead of listening deeply?",
      "What truth becomes clearer when you stop chasing certainty?",
      "What conversation with yourself have you been avoiding in the silence?",
      "Where do you need to let the air move through something that has become stagnant?",
      "What are you ready to release without needing to explain why it was heavy?",
      "What does your breath reveal about the places where you still do not feel safe?",
      "Where has distance given you wisdom, and where has it become avoidance?",
      "What message keeps trying to reach you through stillness?",
      "What would it feel like to let your thoughts pass through you without becoming them?",
      "Where is your voice asking to become more honest?",
      "What are you ready to exhale from your life?",
      "What kind of freedom begins with one conscious breath?"
    ]
  },
  {
    id: "garden-of-renewal",
    title: "The Garden of Renewal",
    need: "Renewal",
    needText: "For courage, energy, and becoming.",
    selectorSubtitle: "Begin again",
    selectorGlyph: "✧",
    element: "Fire",
    description: "A radiant garden where old ash becomes new growth.",
    keywords: ["Courage", "Renewal", "Spark", "Becoming"],
    purpose: "Courage, creative energy, rebirth, motivation, and life force.",
    previewPurpose: "This path is for courage, creative energy, renewal, and becoming.",
    practice: "Use this sanctuary for renewal prompts, confidence work, and choosing what is ready to grow.",
    lightworkNote: "Not all fire destroys. Some fire teaches the seed when to rise.",
    image: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.renewalHero),
    interiorIntro: "{name}, not everything that burns is lost. Some things burn to make room.",
    interiorMood: "This room holds the warmth of endings that became beginnings.",
    roomClass: "fire",
    scroll: {
      title: "What the Burned Earth Taught Me",
      description: "A reflection on courage, rebirth, creative fire, and becoming.",
      body: [
        "I used to think renewal would feel beautiful.",
        "I thought it would arrive like dawn - warm, obvious, full of music. I did not expect it to come first as loss. I did not expect the old self to resist leaving. I did not expect becoming to ask for so much fire.",
        "There are parts of me that had to burn before I understood they were never meant to shelter me. Old names. Old fears. Old loyalties to pain. Things I wore for so long that I mistook them for identity. When they began to fall away, I mourned them, even the ones that hurt me.",
        "This, too, has been hard to admit:\nnot everything we grieve was good for us.",
        "And still, grief belongs here.",
        "The earth after fire is not empty. It is listening. It is blackened, yes. Opened, yes. Tender in ways that look like ruin. But beneath that darkened surface, something has already begun again. The seed does not curse the ash. It uses it.",
        "Perhaps that is what courage truly is -\nnot the refusal to fall apart,\nbut the willingness to let destruction become fertile.",
        "I have known seasons where hope felt embarrassing. Seasons where I could not imagine beauty returning to anything I had touched. Yet life, stubborn and holy, keeps contradicting despair. It grows through cracks. It reaches through cinders. It speaks in green even after everything has gone red.",
        "I am learning that rebirth is not clean.\nIt is sacred precisely because it is costly.",
        "If I am becoming someone new, it is not because the fire spared me.\nIt is because it didn't.",
        "And what remains now is not the person I was before the burning,\nbut something more honest,\nmore open,\nmore alive.",
        "Closing Note:",
        "Even the fiercest light does not vanish in the burning; it rises changed and finds its way back to the source that first lit it."
      ]
    },
    reflections: [
      "What part of you is ready to become alive again?",
      "What old version of yourself has already become ash, even if you keep carrying it?",
      "Where is courage asking to replace hesitation?",
      "What spark have you been protecting instead of feeding?",
      "What would you create if you stopped apologizing for your light?",
      "What dream still glows beneath the fear that tried to bury it?",
      "Where have you mistaken exhaustion for failure instead of a sign that renewal is needed?",
      "What fire within you has been dimmed by waiting for permission?",
      "What are you ready to stop mourning because it has already become soil for something new?",
      "Where does your life need warmth rather than pressure?",
      "What desire are you afraid would change everything if you admitted it?",
      "What would you choose if you trusted your own becoming?",
      "Where have you been surviving when your spirit is asking to live?",
      "What part of your past can become fuel instead of weight?",
      "What are you ready to begin before you feel fully prepared?",
      "Where is your anger pointing toward a boundary that should have existed sooner?",
      "What passion have you made smaller to keep others comfortable?",
      "What does rebirth ask you to release before it can arrive?",
      "Where are you being asked to rise without becoming hard?",
      "What is the difference between the fire that destroys you and the fire that frees you?",
      "What would your life look like if you honored your inner flame as sacred?",
      "What new growth is already pushing through the ash?"
    ]
  },
  {
    id: "rooted-grove",
    title: "The Rooted Grove",
    need: "Grounding",
    needText: "For patience, stability, and the body.",
    selectorSubtitle: "Root in the now",
    selectorGlyph: "△",
    element: "Earth",
    description: "A living grove for grounding, patience, embodiment, and returning to what is real.",
    keywords: ["Grounding", "Patience", "Body", "Stability"],
    purpose: "Grounding, steadiness, embodiment, patience, and trust in slow growth.",
    previewPurpose: "This path is for patience, stability, embodiment, and grounding in what is real.",
    practice: "Use this sanctuary for grounding exercises, body awareness, gratitude, and practical reflection.",
    lightworkNote: "The root does not rush toward the sun. It becomes strong enough to hold it.",
    image: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.groveHero),
    interiorIntro: "{name}, let the body remember what the mind keeps rushing past.",
    interiorMood: "This room steadies what has been rushing to become before it was rooted.",
    roomClass: "earth",
    scroll: {
      title: "The Weight That Keeps Me Here",
      description: "A reflection on grounding, patience, embodiment, and slow growth.",
      body: [
        "There was a time I thought being strong meant never needing to lean.",
        "I wanted to be self-held, self-made, self-contained - untouched by dependence, untouched by need. I admired things that looked unshakable. Trees in storms. Stones in rivers. People who could carry their pain without letting it spill.",
        "But even trees lean toward light.\nEven stones are shaped by what they endure.\nAnd even the strongest roots do not survive alone.",
        "The earth has been teaching me this slowly.",
        "To be grounded is not to be hardened. It is not to become so still that nothing reaches you. It is to remain. To stay in your body when your thoughts want to flee. To stay in truth when performance would be easier. To stay near your own life even when it feels heavy.",
        "I have often mistaken heaviness for failure.",
        "Yet some things are heavy because they matter. Commitment is heavy. Healing is heavy. Memory is heavy. Love, when it is real, has weight to it. It asks us not only to rise, but to root.",
        "There are griefs in me that have not disappeared. I do not know that they ever will. But perhaps the goal was never to become untouched. Perhaps the deeper work is to become steady enough to hold what is true without breaking under it.",
        "This grove reminds me that slowness is not weakness. Rest is not laziness. Repetition is not stagnation. Some of the holiest transformations happen underground, where no one applauds and nothing yet looks different.",
        "I am learning to trust the unseen work.",
        "To let patience become devotion.\nTo let steadiness become prayer.\nTo let the body be a place I live in, not merely carry.",
        "And maybe grounding is just this:\nchoosing, again and again,\nnot to leave myself.",
        "Some doors do not open upward.\nSome truths must be found beneath the weight of the world.",
        "If you are searching for what was buried,\nspeak this where recovered things are named:",
        "'beneath the root, the veil remembers'",
        "Closing Note:",
        "Every quiet light rooted in the world still belongs to its source, and one day even stillness remembers the way home."
      ]
    },
    reflections: [
      "Where are you being asked to grow slowly instead of urgently?",
      "What does your body know before your mind explains it away?",
      "What part of your life needs steadiness more than speed?",
      "Where can you return to what is simple and true?",
      "What root have you been neglecting while reaching for the sun?",
      "What are you trying to force that may need more time underground?",
      "Where have you confused stillness with failure?",
      "What does your nervous system need before your spirit can feel safe enough to expand?",
      "What would change if you treated rest as part of growth?",
      "What foundation in your life is asking to be repaired before you build higher?",
      "Where are you abandoning your body to chase an idea of becoming?",
      "What truth becomes clear when you return to the present moment?",
      "What responsibility is yours to carry, and what weight belongs back to the earth?",
      "Where do you need boundaries that feel like roots rather than walls?",
      "What small daily act could become a sacred form of devotion?",
      "What are you learning from the season of waiting?",
      "Where does your life need more patience, nourishment, or care?",
      "What part of you still believes growth must be visible to be real?",
      "What have you been rushing because you do not trust the timing of your own becoming?",
      "Where are you being invited to inhabit your life more fully?",
      "What does grounded love look like in your choices, not just your intentions?",
      "What within you is ready to become steady enough to hold more light?"
    ]
  },
  {
    id: "hall-of-mirrors",
    title: "The Hall of Mirrors",
    need: "Integration",
    needText: "For truth, identity, and self-acceptance.",
    selectorSubtitle: "Weave it all together",
    selectorGlyph: "◌",
    element: "Integration",
    description: "A luminous corridor where every reflection asks to be met with honesty and mercy.",
    keywords: ["Truth", "Identity", "Integration", "Mercy"],
    purpose: "Self-acceptance, integration, identity, truth, and seeing without punishment.",
    previewPurpose: "This path is for truth, identity, self-acceptance, and integration.",
    practice: "Use this sanctuary for integration prompts, self-compassion, and reflecting on who you are becoming.",
    lightworkNote: "A mirror is not a judge. It is a door that learned to shine back.",
    image: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.mirrorsHero),
    interiorIntro: "{name}, stand gently before what looks back.",
    interiorMood: "This room does not ask you to perform wholeness. It asks you to meet what is already waiting.",
    roomClass: "integration",
    scroll: {
      title: "The Face That Remains",
      description: "A reflection on integration, self-acceptance, truth, and mercy.",
      body: [
        "There are many versions of me I have learned to present.",
        "One for safety.\nOne for love.\nOne for being admired.\nOne for being left alone.",
        "I did not build them all consciously. Some arrived out of fear. Some out of hope. Some because the world kept rewarding the parts of me that were easiest to understand. Over time, I became fluent in reflection. I learned how to become what was needed in the room.",
        "But a mirror, if you stay with it long enough, eventually becomes merciless.",
        "Not cruel - only clear.",
        "It shows what posture cannot hide. It shows the exhaustion beneath charm, the ache beneath certainty, the loneliness beneath being well-liked. It shows how often identity becomes performance when the soul is afraid it will not be loved in its unguarded form.",
        "There is sorrow in seeing this.\nA deep sorrow.",
        "Not because I have been false, but because I have been fragmented.\nBecause so much of life was spent asking, who must I be to remain welcome here?",
        "This hall does not ask that question.",
        "Instead, it asks a harder one:\nwhat remains when no mask is needed?",
        "I do not yet have a complete answer. Perhaps no one does. But sometimes, between all the shifting selves, I glimpse something quieter - not the most impressive part of me, not the most wounded part, but the truest. A presence underneath performance. A self beneath strategy. A face that does not have to earn its own existence.",
        "To meet that self is both grief and grace.",
        "Grief, for all the years spent hiding.\nGrace, for the fact that what is real in me never disappeared.",
        "It waited.\nIt watched.\nIt remained.",
        "Closing Note:",
        "Every fractured light longs to become whole again, and in its wholeness it returns at last to the source from which it came."
      ]
    },
    reflections: [
      "What part of yourself have you been treating like a stranger?",
      "What truth can you meet without punishment today?",
      "Where are you ready to stop splitting yourself into acceptable and unacceptable pieces?",
      "What reflection are you finally willing to believe?",
      "What part of you is asking to come home?",
      "Which version of yourself have you outgrown but still perform for safety?",
      "What would change if you stopped needing every part of you to be easy to understand?",
      "Where have you mistaken self-judgment for accountability?",
      "What part of your story deserves compassion instead of exile?",
      "What mask has protected you, and what is it costing you now?",
      "Where do you still ask for permission to be whole?",
      "What contradiction within you might actually be a doorway to deeper truth?",
      "What are you ready to see clearly without turning it into a weapon against yourself?",
      "Where have you confused who you are with who you had to become?",
      "What part of you needs to be welcomed before healing can feel complete?",
      "What reflection makes you uncomfortable because it is honest?",
      "Where are you ready to stop choosing between your light and your shadow?",
      "What would it mean to belong to yourself without negotiation?",
      "What part of you keeps knocking from behind the mirror?",
      "Where has shame been standing in the place where understanding should be?",
      "What truth about yourself can you hold with mercy?",
      "Who are you when every rejected piece is invited back into the room?"
    ]
  }
];

const LUMEN_SANCTUARY_IMAGE_WIDTH = 1024;
const LUMEN_SANCTUARY_IMAGE_HEIGHT = 1536;
const LUMEN_ICON_SIZE = 256;

const lumenRail = document.querySelector("[data-lumen-sanctuary-rail]");
const lumenViewer = document.querySelector("[data-lumen-sanctuary-viewer]");
const lumenInterior = document.querySelector("[data-lumen-sanctuary-interior]");
const lumenRoomPage = document.querySelector("[data-lumen-room-page]");
const lumenNameForm = document.querySelector("[data-lumen-name-form]");
const lumenNameFields = document.querySelector("[data-lumen-name-fields]");
const lumenNameInput = document.querySelector("[data-lumen-name-input]");
const lumenNameMessage = document.querySelector("[data-lumen-name-message]");
const lumenNameReset = document.querySelector("[data-lumen-name-reset]");
const lumenCleanRouteBase = "/lumen-archive";
const isLegacyLumenRoomPage = window.location.pathname.split("/").pop() === "lumen-room.html";
const isLumenRoomPage = isLegacyLumenRoomPage;
const lumenRoomTitle = document.querySelector("[data-lumen-room-title]");
const lumenRoomSubtitle = document.querySelector("[data-lumen-room-subtitle]");
const lumenRoomCopy = document.querySelector("[data-lumen-room-copy]");
const lumenRoomBack = document.querySelector("[data-lumen-room-back]");
const lumenRoomHero = document.querySelector("[data-lumen-room-hero]");
const lumenDashboard = document.querySelector("[data-lumen-dashboard]");
const lumenDashboardNav = document.querySelector("[data-lumen-dashboard-nav]");
const lumenDashboardHero = document.querySelector("[data-lumen-dashboard-hero]");
const lumenDashboardHeroImage = document.querySelector("[data-lumen-dashboard-hero-img]");
const lumenDashboardElement = document.querySelector("[data-lumen-dashboard-element]");
const lumenDashboardTitle = document.querySelector("[data-lumen-dashboard-title]");
const lumenDashboardLine = document.querySelector("[data-lumen-dashboard-line]");
const lumenDashboardPurposeTitle = document.querySelector("[data-lumen-dashboard-purpose-title]");
const lumenDashboardPurpose = document.querySelector("[data-lumen-dashboard-purpose]");
const lumenDashboardRitual = document.querySelector("[data-lumen-dashboard-ritual]");
const lumenDashboardQuestionText = document.querySelector("[data-lumen-dashboard-question-text]");
const lumenDashboardSealTitle = document.querySelector("[data-lumen-dashboard-seal-title]");
const lumenDashboardSealDescription = document.querySelector("[data-lumen-dashboard-seal-description]");
const lumenDashboardUnsealScroll = document.querySelector("[data-lumen-dashboard-unseal-scroll]");
const lumenDashboardPreviews = document.querySelector("[data-lumen-dashboard-previews]");
const lumenDashboardSealImage = document.querySelector("[data-lumen-dashboard-seal-img]");
const lumenSanctuaryDashboardLayout = document.querySelector("[data-lumen-sanctuary-dashboard-layout]");
const lumenSanctuaryCardCarousel = document.querySelector("[data-lumen-sanctuary-card-carousel]");
const lumenSanctuaryCardTrack = document.querySelector("[data-lumen-sanctuary-card-track]");
const lumenSanctuaryCardDots = document.querySelector("[data-lumen-sanctuary-card-dots]");
const lumenArrivalRoom = document.querySelector("[data-lumen-arrival-room]");
const lumenArrivalIntroCarousel = document.querySelector("[data-lumen-arrival-intro-carousel]");
const lumenArrivalIntroTrack = document.querySelector("[data-lumen-arrival-intro-track]");
const lumenArrivalIntroDots = document.querySelector("[data-lumen-arrival-intro-dots]");
const lumenArrivalHero = document.querySelector("[data-lumen-arrival-hero]");
const lumenArrivalHeroImage = document.querySelector("[data-lumen-arrival-hero-img]");
const lumenArrivalWelcome = document.querySelector("[data-lumen-arrival-welcome]");
const lumenArrivalExplore = document.querySelector("[data-lumen-arrival-explore-panel]");
const lumenArrivalPreviews = document.querySelector("[data-lumen-arrival-previews]");
const lumenNameStorageKey = "astralVeilLumenName";
const lumenWelcomeStorageKey = "astralVeilLumenWelcomeMessage";
const lumenVisitorNameStorageKey = "lumenVisitorName";
const lumenSelectorOrderIds = ["sanctuary-of-breath", "rooted-grove", "reflection-pool", "garden-of-renewal", "hall-of-mirrors"];
const lumenDashboardOrderIds = ["reflection-pool", "sanctuary-of-breath", "garden-of-renewal", "rooted-grove", "hall-of-mirrors"];
let lumenDashboardQuestionIndex = 0;
let lumenSanctuaryCardIndex = 0;
let lumenArrivalIntroCardIndex = 0;
let lumenSidebarQuoteAlignmentFrame = null;
const lumenArrivalRoomEntry = {
  id: "arrival-room",
  type: "arrival",
  title: "Dawn Atrium",
  navTitle: "Arrival Room",
  subtitle: "Where the Archive first learns your name.",
  heroImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.arrivalHero),
  navIcon: "assets/icons/symbols/becoming.png",
  shortLine: "You are not here to collect more knowledge. You are here to remember what already lives within you.",
  selectorGlyph: "✦",
  element: "Welcome"
};
const lumenDashboardRoomDetails = {
  "reflection-pool": {
    roomNumber: 1,
    heroImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.reflectionHero),
    previewImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.reflectionPreview),
    sealImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.reflectionSeal),
    shortLine: "Where the self becomes visible only when the waters are still.",
    sealTitle: "Seal of Clarity",
    sealDescription: "You are learning to see yourself with compassion and without distortion.",
    sealEarned: false
  },
  "sanctuary-of-breath": {
    roomNumber: 2,
    heroImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.breathHero),
    previewImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.breathPreview),
    sealImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.breathSeal),
    shortLine: "Where the spirit exhales what it has carried.",
    sealTitle: "Seal of Breath",
    sealDescription: "You are practicing release without abandoning the truth inside it.",
    sealEarned: false
  },
  "garden-of-renewal": {
    roomNumber: 3,
    heroImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.renewalHero),
    previewImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.renewalPreview),
    sealImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.renewalSeal),
    shortLine: "Where what was buried begins to bloom.",
    sealTitle: "Seal of Renewal",
    sealDescription: "You are allowing old ash to become soil for the life still rising.",
    sealEarned: false
  },
  "rooted-grove": {
    roomNumber: 4,
    heroImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.groveHero),
    previewImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.grovePreview),
    sealImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.groveSeal),
    shortLine: "Where the body remembers the earth.",
    sealTitle: "Seal of Grounding",
    sealDescription: "You are choosing steadiness, patience, and the quiet work beneath growth.",
    sealEarned: false
  },
  "hall-of-mirrors": {
    roomNumber: 5,
    heroImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.mirrorsHero),
    previewImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.mirrorsPreview),
    sealImage: getLumenRoomImagePath(LUMEN_ROOM_IMAGES.mirrorsSeal),
    shortLine: "Where truth meets the self without disguise.",
    sealTitle: "Seal of Integration",
    sealDescription: "You are learning to welcome every reflection without punishment.",
    sealEarned: false
  }
};
Object.entries(lumenDashboardRoomDetails).forEach(([roomId, roomAssets]) => {
  const sanctuary = lumenSanctuaries.find((room) => room.id === roomId);

  if (!sanctuary) {
    return;
  }

  sanctuary.heroImage = roomAssets.heroImage;
  sanctuary.previewImage = roomAssets.previewImage;
  sanctuary.sealImage = roomAssets.sealImage;
});
const lumenWelcomeMessages = [
  "May the rooms ahead meet you with clarity.",
  "Begin softly. Nothing whole needs to be forced.",
  "The light does not ask you to hurry.",
  "What is ready to heal will know where to lead you.",
  "You are allowed to return to yourself gently.",
  "Let the first step be honest, not perfect.",
  "Some truths arrive quietly and stay.",
  "The path ahead opens by listening."
];
let activeLumenSanctuaryIndex = 0;
let activeLumenDashboardId = "arrival-room";
let lumenSignedInDisplayName = "";
let activeLumenInteriorIndex = null;
const lumenReflectionIndexes = {};
let lumenImageLightbox = null;
let lumenImageLightboxImage = null;
let lumenImageLightboxTitle = null;
let lumenArrivalContentModal = null;
let lumenArrivalContentReturnTarget = null;
let lumenImageLightboxReturnTarget = null;
let lumenRailLoopResetTimeout = null;
let isLumenRailLoopListenerReady = false;

function escapeLumenHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function getLumenRoomAtmosphereClass(sanctuary) {
  const atmosphereClasses = {
    water: "sanctuary-water",
    air: "sanctuary-air",
    fire: "sanctuary-fire",
    earth: "sanctuary-earth",
    integration: "sanctuary-mirror"
  };

  return atmosphereClasses[sanctuary?.roomClass] || "sanctuary-mirror";
}

function getLumenRoomHeroImage(sanctuary) {
  return getLumenRoomImagePath(sanctuary?.heroImage || getLumenDashboardDetail(sanctuary).heroImage || "");
}

function getLumenRoomPreviewImage(sanctuary) {
  return getLumenRoomImagePath(sanctuary?.previewImage || getLumenDashboardDetail(sanctuary).previewImage || getLumenRoomHeroImage(sanctuary));
}

function getLumenRoomSealImage(sanctuary) {
  return getLumenRoomImagePath(sanctuary?.sealImage || getLumenDashboardDetail(sanctuary).sealImage || "");
}

function setLumenRoomScene(sanctuary) {
  if (!isLumenRoomPage) {
    return;
  }

  [document.body, lumenRoomPage].forEach((element) => {
    if (!element) {
      return;
    }

    Array.from(element.classList).forEach((className) => {
      if (className.startsWith("room-") || className.startsWith("sanctuary-")) {
        element.classList.remove(className);
      }
    });
  });

  if (lumenRoomPage) {
    lumenRoomPage.classList.add("lumen-sanctuary-detail");
  }

  if (!sanctuary) {
    document.body.classList.add("room-sanctuary-room");
    lumenRoomPage?.classList.add("sanctuary-mirror");
    lumenRoomHero?.style.removeProperty("--room-hero-image");
    return;
  }

  const atmosphereClass = getLumenRoomAtmosphereClass(sanctuary);
  const heroImage = getLumenRoomHeroImage(sanctuary);

  document.body.classList.add(`room-${sanctuary.roomClass || "lumen"}`);
  lumenRoomPage?.classList.add(atmosphereClass);

  if (heroImage) {
    lumenRoomHero?.style.setProperty("--room-hero-image", `url("${getLumenCssImageUrl(heroImage)}")`);
  } else {
    lumenRoomHero?.style.removeProperty("--room-hero-image");
  }
}

function getLumenScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function scrollLumenArchiveToTop() {
  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: getLumenScrollBehavior()
    });
  });
}

function shouldAutoScrollLumenPortalOnSelection() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function isLumenMobileLightworkRail() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function scrollLumenPortalPreviewIntoView() {
  if (!lumenViewer) {
    return;
  }

  lumenViewer.scrollIntoView({
    behavior: getLumenScrollBehavior(),
    block: "start"
  });
}

function scrollLumenPortalImageIntoView() {
  const activeFrame = lumenViewer?.querySelector(".sanctuary-portal-stage.is-active .sanctuary-portal-frame");

  if (!activeFrame) {
    scrollLumenPortalPreviewIntoView();
    return;
  }

  activeFrame.scrollIntoView({
    behavior: getLumenScrollBehavior(),
    block: "center"
  });
}

function getLumenSanctuaryInitial(sanctuary) {
  return String(sanctuary.title || "")
    .replace(/^the\s+/i, "")
    .trim()
    .slice(0, 1);
}

function getLumenSanctuaryBySelector(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = String(value);
  const index = Number.parseInt(normalized, 10);

  if (Number.isInteger(index) && index >= 0 && index < lumenSanctuaries.length) {
    return lumenSanctuaries[index];
  }

  return lumenSanctuaries.find((sanctuary) => sanctuary.id === normalized) || null;
}

function getLumenSanctuarySelectorIcon(sanctuary) {
  const selectorIcons = {
    "reflection-pool": "assets/images/reflection-button-transparent.webp",
    "garden-of-renewal": "assets/images/renewal-button-transparent.webp",
    "hall-of-mirrors": "assets/images/integration-button-transparent.webp",
    "rooted-grove": "assets/images/grounding-button-transparent.webp",
    "sanctuary-of-breath": "assets/images/breath-button-transparent.webp"
  };

  return selectorIcons[sanctuary?.id] || "";
}

function getLumenOfferingIcon(label) {
  const offeringIcons = {
    Clarity: "assets/icons/symbols/clarity.png",
    Healing: "assets/icons/symbols/healing.png",
    Stillness: "assets/icons/symbols/stillness.png",
    Return: "assets/icons/symbols/return.png",
    Courage: "assets/icons/symbols/courage.png",
    Renewal: "assets/icons/symbols/renewal.png",
    Spark: "assets/icons/symbols/spark.png",
    Becoming: "assets/icons/symbols/becoming.png",
    Grounding: "assets/icons/symbols/grounding.png",
    Patience: "assets/icons/symbols/patience.png",
    Body: "assets/icons/symbols/body.png",
    Stability: "assets/icons/symbols/stability.png",
    Breath: "assets/icons/symbols/breath.png",
    Release: "assets/icons/symbols/release.png",
    Voice: "assets/icons/symbols/voice.png",
    Truth: "assets/icons/symbols/truth.png",
    Identity: "assets/icons/symbols/identity.png",
    Integration: "assets/icons/symbols/integration.png",
    Mercy: "assets/icons/symbols/mercy.png"
  };

  return offeringIcons[label] || "";
}

function getLumenOffering(label) {
  return {
    label,
    icon: getLumenOfferingIcon(label)
  };
}

function getLumenSanctuaryShowcaseDetails(sanctuary) {
  const details = {
    "reflection-pool": {
      tagline: "Where still waters mirror what is true.",
      description: "A sanctuary of calm and contemplation. The waters here hold the stillness to quiet the mind and the light to reveal what lies beneath the surface.",
      secondParagraph: "Enter to release what no longer serves, heal the unseen, and return to your center with renewed peace.",
      offers: ["Clarity", "Healing", "Stillness", "Return"].map(getLumenOffering)
    },
    "sanctuary-of-breath": {
      tagline: "Where the spirit exhales what it has carried.",
      description: "A quiet chamber of air, softness, and release. This room invites the body to loosen, the mind to slow, and the voice within to become clear again.",
      secondParagraph: "Enter when you need space to breathe, speak gently, and return to the rhythm beneath your thoughts.",
      offers: ["Breath", "Clarity", "Release", "Voice"].map(getLumenOffering)
    },
    "garden-of-renewal": {
      tagline: "Where what was buried begins to bloom.",
      description: "A living sanctuary of warmth, courage, and new becoming. This room holds the spark that rises after endings and the softness that allows growth to begin again.",
      secondParagraph: "Enter when your spirit is ready to shed old seasons and remember the part of you still reaching for light.",
      offers: ["Courage", "Renewal", "Spark", "Becoming"].map(getLumenOffering)
    },
    "rooted-grove": {
      tagline: "Where the body remembers the earth.",
      description: "A grounded sanctuary of patience, stability, and quiet strength. This room steadies the restless spirit and returns wandering energy back to the body.",
      secondParagraph: "Enter when you need to feel held, rooted, and present enough to continue.",
      offers: ["Grounding", "Patience", "Body", "Stability"].map(getLumenOffering)
    },
    "hall-of-mirrors": {
      tagline: "Where truth meets the self without disguise.",
      description: "A reflective sanctuary of identity, integration, and mercy. The mirrors here do not punish what they reveal. They invite every scattered piece to return.",
      secondParagraph: "Enter when you are ready to see yourself clearly, gently, and whole.",
      offers: ["Truth", "Identity", "Integration", "Mercy"].map(getLumenOffering)
    }
  };

  return details[sanctuary?.id] || {
    tagline: sanctuary?.lightworkNote || sanctuary?.selectorSubtitle || "",
    description: sanctuary?.description || sanctuary?.previewPurpose || "",
    secondParagraph: sanctuary?.practice || "",
    offers: (sanctuary?.keywords || []).map(getLumenOffering)
  };
}

function getLumenSelectorOrder() {
  return lumenSelectorOrderIds
    .map((id) => lumenSanctuaries.findIndex((sanctuary) => sanctuary.id === id))
    .filter((index) => index >= 0);
}

function renderLumenRailTab(index, position, options = {}) {
  const sanctuary = lumenSanctuaries[index];
  const isActive = index === activeLumenSanctuaryIndex;
  const rowClass = position === 2 ? "lumen-sanctuary-tab--featured" : "lumen-sanctuary-tab--secondary";
  const icon = getLumenSanctuarySelectorIcon(sanctuary);
  const isDuplicate = Boolean(options.isDuplicate);

  return `
    <button class="lumen-sanctuary-tab ${rowClass} lumen-sanctuary-tab--${escapeLumenHtml(sanctuary.id)}${isActive ? " is-active" : ""}" type="button" data-lumen-sanctuary-index="${index}" data-lumen-loop-copy="${options.copyIndex ?? 0}" ${isDuplicate ? `aria-hidden="true" tabindex="-1"` : `aria-pressed="${isActive ? "true" : "false"}" aria-label="${escapeLumenHtml(`${sanctuary.need}: ${sanctuary.selectorSubtitle}`)}"`}>
      <span class="lumen-sanctuary-tab__copy">
        <strong>${escapeLumenHtml(sanctuary.need)}</strong>
        <span class="lumen-sanctuary-tab__accent" aria-hidden="true"></span>
        <em>${escapeLumenHtml(sanctuary.selectorSubtitle)}</em>
      </span>
      <span class="lumen-sanctuary-tab__icon" aria-hidden="true">
        <img src="${escapeLumenHtml(icon)}" alt="" width="${LUMEN_ICON_SIZE}" height="${LUMEN_ICON_SIZE}" loading="eager" decoding="async" />
      </span>
    </button>
  `;
}

function renderLumenRail() {
  if (!lumenRail) {
    return;
  }

  const selectorOrder = getLumenSelectorOrder();
  const shouldLoop = isLumenMobileLightworkRail();
  const loopCopies = shouldLoop ? [0, 1, 2] : [0];

  lumenRail.innerHTML = `
    <div class="lumen-compass${shouldLoop ? " lumen-compass--loop" : ""}" aria-label="Choose by lightwork need" data-lumen-loop-track>
      ${loopCopies
        .map((copyIndex) => selectorOrder
          .map((index, position) => renderLumenRailTab(index, position, {
            copyIndex,
            isDuplicate: shouldLoop && copyIndex !== 1
          }))
          .join(""))
        .join("")}
    </div>
  `;

  const activeTab = shouldLoop
    ? lumenRail.querySelector('.lumen-sanctuary-tab.is-active[data-lumen-loop-copy="1"]')
    : lumenRail.querySelector(".lumen-sanctuary-tab.is-active");

  if (activeTab) {
    centerLumenRailTab(activeTab);
  }

  initializeLumenRailLoop();
}

function centerLumenRailTab(tab, behavior = "auto") {
  if (!lumenRail || !tab) {
    return;
  }

  lumenRail.scrollTo({
    left: tab.offsetLeft - (lumenRail.clientWidth - tab.clientWidth) / 2,
    behavior: getLumenScrollBehavior() === "auto" ? "auto" : behavior
  });
}

function resetLumenRailLoopPosition() {
  if (!lumenRail || !isLumenMobileLightworkRail()) {
    return;
  }

  const track = lumenRail.querySelector("[data-lumen-loop-track]");
  const copyWidth = track ? track.scrollWidth / 3 : 0;

  if (!copyWidth) {
    return;
  }

  const lowerLimit = copyWidth * 0.5;
  const upperLimit = lumenRail.scrollWidth - lumenRail.clientWidth - lumenRail.clientWidth;

  if (lumenRail.scrollLeft < lowerLimit) {
    lumenRail.scrollLeft += copyWidth;
  } else if (lumenRail.scrollLeft > upperLimit) {
    lumenRail.scrollLeft -= copyWidth;
  }
}

function initializeLumenRailLoop() {
  if (!lumenRail || !isLumenMobileLightworkRail()) {
    return;
  }

  if (isLumenRailLoopListenerReady) {
    return;
  }

  isLumenRailLoopListenerReady = true;
  lumenRail.addEventListener("scroll", () => {
    window.clearTimeout(lumenRailLoopResetTimeout);
    lumenRailLoopResetTimeout = window.setTimeout(() => {
      window.requestAnimationFrame(resetLumenRailLoopPosition);
    }, 90);
  }, { passive: true });
}

function renderLumenInfoBox(label, value) {
  return `
    <section class="lumen-info-box">
      <h3>${escapeLumenHtml(label)}</h3>
      <p>${escapeLumenHtml(value)}</p>
    </section>
  `;
}

function renderLumenViewer() {
  if (!lumenViewer) {
    return;
  }

  const sanctuary = lumenSanctuaries[activeLumenSanctuaryIndex];
  const showcaseDetails = getLumenSanctuaryShowcaseDetails(sanctuary);

  lumenViewer.innerHTML = `
    <div class="sanctuary-portal-preview" data-lumen-portal-swipe aria-live="polite">
      <article class="sanctuary-portal-stage is-active" data-lumen-portal-index="${activeLumenSanctuaryIndex}" aria-current="true">
        <section class="sanctuary-room-showcase" aria-labelledby="sanctuary-room-title">
          <div class="sanctuary-room-showcase__visual">
            <figure class="sanctuary-portal-frame sanctuary-portal-frame--${escapeLumenHtml(sanctuary.id)}">
              <button class="sanctuary-portal-image-button" type="button" data-lumen-image-open data-lumen-image-src="${escapeLumenHtml(sanctuary.image)}" data-lumen-image-alt="${escapeLumenHtml(`${sanctuary.title} sanctuary artwork`)}" data-lumen-image-title="${escapeLumenHtml(sanctuary.title)}" aria-label="${escapeLumenHtml(`View ${sanctuary.title} image larger`)}">
                <img class="sanctuary-portal-image sanctuary-room-showcase__image" src="${escapeLumenHtml(sanctuary.image)}" alt="${escapeLumenHtml(sanctuary.title)} sanctuary artwork" width="${LUMEN_SANCTUARY_IMAGE_WIDTH}" height="${LUMEN_SANCTUARY_IMAGE_HEIGHT}" loading="eager" decoding="async" fetchpriority="high" data-lumen-image-error />
              </button>
              <figcaption aria-hidden="true">
                <span>${escapeLumenHtml(getLumenSanctuaryInitial(sanctuary))}</span>
              </figcaption>
            </figure>
          </div>

          <div class="sanctuary-room-showcase__info">
            <p class="sanctuary-room-showcase__eyebrow">Sanctuary Room</p>
            <h2 id="sanctuary-room-title">${escapeLumenHtml(sanctuary.title)}</h2>
            <p class="sanctuary-room-showcase__tagline">${escapeLumenHtml(showcaseDetails.tagline)}</p>
            <div class="sanctuary-room-showcase__divider" aria-hidden="true"></div>
            <div class="sanctuary-room-showcase__description">
              <p>${escapeLumenHtml(showcaseDetails.description)}</p>
              <p>${escapeLumenHtml(showcaseDetails.secondParagraph)}</p>
            </div>
            <div class="sanctuary-room-showcase__offers" aria-label="What this room offers">
              <p>What this room offers</p>
              <div class="sanctuary-offers" role="list">
                ${showcaseDetails.offers
                  .map((offer) => `
                    <div class="sanctuary-offer-tile" role="listitem">
                      <img class="sanctuary-offer-icon" src="${escapeLumenHtml(offer.icon)}" alt="" width="${LUMEN_ICON_SIZE}" height="${LUMEN_ICON_SIZE}" loading="lazy" decoding="async" />
                      <span class="sanctuary-offer-label">${escapeLumenHtml(offer.label)}</span>
                    </div>
                  `)
                  .join("")}
              </div>
            </div>
            <button class="lumen-enter-button" type="button" data-lumen-enter-sanctuary data-lumen-enter-index="${activeLumenSanctuaryIndex}">Enter Sanctuary</button>
          </div>
        </section>
      </article>

      <div class="sanctuary-portal-controls sanctuary-room-controls" aria-label="Browse sanctuary previews">
        <button class="sanctuary-portal-control" type="button" data-lumen-sanctuary-nav="previous" aria-label="View previous sanctuary">Previous</button>
        <div class="sanctuary-portal-progress" aria-label="Sanctuary preview progress">
          ${lumenSanctuaries
            .map((item, index) => `
              <button class="sanctuary-portal-segment${index === activeLumenSanctuaryIndex ? " is-active" : ""}" type="button" data-lumen-sanctuary-index="${index}" aria-label="${escapeLumenHtml(`View ${item.title}`)}" aria-current="${index === activeLumenSanctuaryIndex ? "true" : "false"}"></button>
            `)
            .join("")}
        </div>
        <button class="sanctuary-portal-control" type="button" data-lumen-sanctuary-nav="next" aria-label="View next sanctuary">Next</button>
      </div>
    </div>
  `;
  lumenViewer.querySelectorAll('[data-lumen-image-error]').forEach((image) => image.addEventListener('error', () => {
    image.closest('.sanctuary-portal-frame')?.classList.add('is-missing');
    image.closest('.sanctuary-portal-image-button')?.remove();
  }, { once: true }));

  initializeLumenPortalViewer();
}

function setActiveLumenSanctuary(index) {
  activeLumenSanctuaryIndex = (index + lumenSanctuaries.length) % lumenSanctuaries.length;
  renderLumenRail();
  renderLumenViewer();
}

function selectAdjacentLumenSanctuary(direction) {
  setActiveLumenSanctuary(activeLumenSanctuaryIndex + (direction === "previous" ? -1 : 1));
}

function getLumenPortalViewport() {
  return lumenViewer?.querySelector("[data-lumen-portal-swipe]") || null;
}

function updateLumenPortalActiveClasses() {
  const stages = lumenViewer?.querySelectorAll("[data-lumen-portal-index]") || [];

  stages.forEach((stage) => {
    const isActive = Number(stage.dataset.lumenPortalIndex) === activeLumenSanctuaryIndex;
    stage.classList.toggle("is-active", isActive);
    stage.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function scrollLumenPortalToActive(behavior = "smooth") {
  const viewport = getLumenPortalViewport();
  const activeStage = lumenViewer?.querySelector(`[data-lumen-portal-index="${activeLumenSanctuaryIndex}"]`);

  if (!viewport || !activeStage) {
    return;
  }

  activeStage.scrollIntoView({ behavior, block: "nearest", inline: "center" });
}

function initializeLumenPortalViewer() {
  const viewport = getLumenPortalViewport();

  if (!viewport) {
    return;
  }

  let swipeStart = null;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }

    swipeStart = {
      x: event.clientX,
      y: event.clientY
    };
  }, { passive: true });

  viewport.addEventListener("pointerup", (event) => {
    if (!swipeStart || event.pointerType === "mouse") {
      swipeStart = null;
      return;
    }

    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    swipeStart = null;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
      return;
    }

    selectAdjacentLumenSanctuary(deltaX < 0 ? "next" : "previous");
  });
}

function getLumenTravelerName() {
  return cleanLumenName(getStoredLumenName()) || "Traveler";
}

function chooseLumenReflectionIndex(sanctuaryIndex) {
  const questions = lumenSanctuaries[sanctuaryIndex]?.reflections || [];

  if (questions.length <= 1) {
    lumenReflectionIndexes[sanctuaryIndex] = 0;
    return 0;
  }

  let nextIndex = Math.floor(Math.random() * questions.length);

  if (nextIndex === lumenReflectionIndexes[sanctuaryIndex]) {
    nextIndex = (nextIndex + 1) % questions.length;
  }

  lumenReflectionIndexes[sanctuaryIndex] = nextIndex;
  return nextIndex;
}

function chooseInitialLumenReflectionIndex(sanctuaryIndex) {
  const sanctuary = lumenSanctuaries[sanctuaryIndex];
  const questions = sanctuary?.reflections || [];
  const featuredReflectionIndex = questions.indexOf(sanctuary?.featuredReflection);

  if (featuredReflectionIndex >= 0) {
    lumenReflectionIndexes[sanctuaryIndex] = featuredReflectionIndex;
    return featuredReflectionIndex;
  }

  return chooseLumenReflectionIndex(sanctuaryIndex);
}

function getActiveLumenReflection(sanctuaryIndex) {
  const questions = lumenSanctuaries[sanctuaryIndex]?.reflections || [];
  const questionIndex = lumenReflectionIndexes[sanctuaryIndex] ?? chooseInitialLumenReflectionIndex(sanctuaryIndex);

  return questions[questionIndex] || "";
}

function getLumenScrollBody(sanctuary) {
  if (sanctuary.scroll?.body?.length) {
    return sanctuary.scroll.body;
  }

  return [
    sanctuary.scroll.description,
    sanctuary.purpose,
    sanctuary.practice,
    sanctuary.lightworkNote
  ];
}

function renderLumenInterior() {
  if (!lumenInterior || activeLumenInteriorIndex === null) {
    return;
  }

  const sanctuary = lumenSanctuaries[activeLumenInteriorIndex];
  const prompt = getActiveLumenReflection(activeLumenInteriorIndex);

  lumenInterior.hidden = false;
  lumenInterior.className = `lumen-sanctuary-interior lumen-room--${escapeLumenHtml(sanctuary.roomClass || "lumen")}`;
  lumenInterior.innerHTML = `
    <div class="lumen-interior-shell">
      <div class="lumen-interior-panel-grid">
        <article class="lumen-interior-panel lumen-interior-panel--scroll">
          <div class="lumen-interior-panel__badge" aria-hidden="true">
            <span class="lumen-scroll-glyph"></span>
          </div>
          <p class="lumen-interior-panel__label">Sanctuary Scroll</p>
          <h3>${escapeLumenHtml(sanctuary.scroll.title)}</h3>
          <div class="lumen-interior-panel__divider" aria-hidden="true"></div>
          <p class="lumen-interior-panel__copy">${escapeLumenHtml(sanctuary.scroll.description)}</p>
          <button class="lumen-interior-action" type="button" data-lumen-open-scroll="${activeLumenInteriorIndex}">
            Tap to unroll wisdom
          </button>
      </article>

        <article class="lumen-interior-panel lumen-interior-panel--reflection">
          <div class="lumen-interior-panel__badge" aria-hidden="true">
            <span>✶</span>
          </div>
          <p class="lumen-interior-panel__label">Reflection</p>
          <blockquote data-lumen-reflection-prompt>${escapeLumenHtml(prompt)}</blockquote>
          <div class="lumen-interior-panel__divider" aria-hidden="true"></div>
          <button class="lumen-interior-action" type="button" data-lumen-draw-reflection="${activeLumenInteriorIndex}">
            Gaze into truth
          </button>
        </article>
      </div>
    </div>
  `;
}

function getLumenCleanRoomPath(roomId) {
  const normalizedRoomId = String(roomId || "").trim().toLowerCase();

  return normalizedRoomId ? `${lumenCleanRouteBase}/${encodeURIComponent(normalizedRoomId)}` : lumenCleanRouteBase;
}

function getLumenRoomIdFromPath() {
  const currentPath = window.location.pathname.replace(/\/$/, "");

  if (!currentPath.startsWith(`${lumenCleanRouteBase}/`)) {
    return "";
  }

  const segments = currentPath.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] || "").trim().toLowerCase();
}

function getLumenRoomIdFromHash() {
  return decodeURIComponent(window.location.hash.replace(/^#/, "")).trim().toLowerCase();
}

function getLumenRoomIdFromQuery() {
  return (new URLSearchParams(window.location.search).get("room") || "").trim().toLowerCase();
}

function getLumenDashboardRouteId() {
  return getLumenRoomIdFromPath() || getLumenRoomIdFromQuery() || getLumenRoomIdFromHash() || "arrival-room";
}

function normalizeLegacyLumenRoute() {
  const roomId = getLumenRoomIdFromPath() || getLumenRoomIdFromQuery() || getLumenRoomIdFromHash();
  const entry = getLumenDashboardEntryById(roomId || "arrival-room");
  const expectedPath = getLumenCleanRoomPath(entry.id);
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const legacyPath = currentPath === "/lumen-archive.html" || isLegacyLumenRoomPage;
  const hasLegacyFragment = Boolean(getLumenRoomIdFromHash());
  const hasLegacyRoomQuery = Boolean(getLumenRoomIdFromQuery());

  if ((!legacyPath && !hasLegacyFragment && !hasLegacyRoomQuery) ||
      (legacyPath && !isLegacyLumenRoomPage && !hasLegacyFragment && !hasLegacyRoomQuery)) {
    return;
  }

  if (window.location.pathname === expectedPath && !window.location.search && !window.location.hash) {
    return;
  }

  window.history.replaceState(null, "", expectedPath);
}

function enterLumenSanctuary() {
  const sanctuary = getLumenSanctuaryBySelector(activeLumenSanctuaryIndex);

  if (!sanctuary) {
    return;
  }

  const roomUrl = getLumenCleanRoomPath(sanctuary.id);
  const visitPromise = trackLumenSanctuaryVisit(sanctuary);
  const fallbackNavigate = () => window.location.assign(roomUrl);

  if (visitPromise?.then) {
    visitPromise.finally(fallbackNavigate);
    return;
  }

  fallbackNavigate();
}

function trackLumenSanctuaryVisit(sanctuary) {
  if (!sanctuary) {
    return Promise.resolve();
  }

  return import("../src/public/progression.js")
    .then(({ trackRoomVisit }) => trackRoomVisit({
      roomKey: sanctuary.id,
      roomName: sanctuary.title,
      title: sanctuary.title,
      description: sanctuary.description || sanctuary.purpose || sanctuary.selectorSubtitle || "",
      archiveType: "lumen",
      mode: document.body.classList.contains("moon-mode") ? "moon" : "sun",
      metadata: {
        room_class: sanctuary.roomClass || "",
        lightwork_need: sanctuary.need || "",
        selected_from: "lumen_sanctuary_entry"
      }
    }))
    .catch((error) => {
      console.warn("[Astral Veil progression] Lumen room visit was not tracked.", error);
    });
}

function getLumenRoomFromQuery() {
  const pathRoomKey = getLumenRoomIdFromPath();
  const roomKey = pathRoomKey || new URLSearchParams(window.location.search).get("room") || "";

  return getLumenSanctuaryBySelector(roomKey.trim().toLowerCase()) || null;
}

function renderLumenRoomNotFound() {
  setLumenRoomScene(null);

  if (lumenRoomTitle) {
    lumenRoomTitle.textContent = "Room Not Found";
  }

  if (lumenRoomSubtitle) {
    lumenRoomSubtitle.textContent = "No matching Lumen sanctuary was found.";
  }

  if (lumenRoomCopy) {
    lumenRoomCopy.textContent = "Choose a valid room from the Lumen Archive and return to begin.";
  }

  if (lumenRoomBack) {
    lumenRoomBack.textContent = "Return to Lumen Archive";
    lumenRoomBack.setAttribute("href", "/lumen-archive");
  }

  if (lumenInterior) {
    lumenInterior.innerHTML = "";
    lumenInterior.hidden = true;
  }
}

function initializeLumenRoomPage() {
  const room = getLumenRoomFromQuery();

  if (!room) {
    renderLumenRoomNotFound();
    return;
  }

  const sanctuaryIndex = lumenSanctuaries.indexOf(room);

  if (sanctuaryIndex < 0) {
    renderLumenRoomNotFound();
    return;
  }

  setLumenRoomScene(room);

  if (lumenRoomTitle) {
    lumenRoomTitle.textContent = room.title;
  }

  if (lumenRoomSubtitle) {
    lumenRoomSubtitle.textContent = room.previewPurpose || room.purpose || "Lumen Archive Sanctuary";
  }

  if (lumenRoomCopy) {
    const travelerName = getLumenTravelerName();
    const intro = room.interiorIntro?.replace("{name}", travelerName) || room.previewPurpose || "";
    const mood = room.interiorMood || "";
    const poeticLine = room.lightworkNote || "";
    lumenRoomCopy.innerHTML = `
      ${intro ? `<span>${escapeLumenHtml(intro)}</span>` : ""}
      ${mood ? `<span>${escapeLumenHtml(mood)}</span>` : ""}
      ${poeticLine ? `<span>${escapeLumenHtml(poeticLine)}</span>` : ""}
    `;
  }

  if (lumenRoomBack) {
    lumenRoomBack.textContent = "Return to Sanctuaries";
    lumenRoomBack.setAttribute("href", "/lumen-archive");
  }

  activeLumenInteriorIndex = sanctuaryIndex;
  chooseInitialLumenReflectionIndex(activeLumenInteriorIndex);
  renderLumenInterior();
}

function returnToLumenSanctuaries() {
  if (isLumenRoomPage) {
    window.location.assign("/lumen-archive");
    return;
  }

  activeLumenInteriorIndex = null;

  if (lumenInterior) {
    lumenInterior.hidden = true;
    lumenInterior.innerHTML = "";
  }

  lumenViewer?.scrollIntoView({ behavior: getLumenScrollBehavior(), block: "start" });
}

if (isLumenRoomPage) {
  initializeLumenRoomPage();

  document.addEventListener("click", (event) => {
    const scrollButton = event.target.closest("[data-lumen-open-scroll]");
    const reflectionButton = event.target.closest("[data-lumen-draw-reflection]");
    const sanctuaryReturn = event.target.closest("[data-lumen-return-sanctuaries]");
    const imageOpen = event.target.closest("[data-lumen-image-open]");

    if (scrollButton) {
      openLumenSanctuaryScroll(Number(scrollButton.dataset.lumenOpenScroll), scrollButton);
      return;
    }

    if (reflectionButton) {
      chooseLumenReflectionIndex(Number(reflectionButton.dataset.lumenDrawReflection));
      renderLumenInterior();
      return;
    }

    if (sanctuaryReturn) {
      returnToLumenSanctuaries();
      return;
    }

    if (imageOpen) {
      openLumenImageLightbox(
        imageOpen.dataset.lumenImageSrc,
        imageOpen.dataset.lumenImageAlt,
        imageOpen.dataset.lumenImageTitle,
        imageOpen
      );
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lumenImageLightbox?.classList.contains("is-open")) {
      closeLumenImageLightbox();
    }
  });
} else {
  activeLumenInteriorIndex = null;
}

function openLumenSanctuaryScroll(index, trigger) {
  const sanctuary = lumenSanctuaries[index];

  if (!sanctuary || !window.AstralVeilScrollReader) {
    return;
  }

  window.AstralVeilScrollReader.open({
    variant: "lumen",
    label: "Sanctuary Scroll",
    title: sanctuary.scroll.title,
    body: getLumenScrollBody(sanctuary),
    trigger
  });
}

function createLumenImageLightbox() {
  if (lumenImageLightbox) {
    return;
  }

  lumenImageLightbox = document.createElement("div");
  lumenImageLightbox.className = "lumen-image-lightbox";
  lumenImageLightbox.setAttribute("aria-hidden", "true");
  lumenImageLightbox.innerHTML = `
    <button class="lumen-image-lightbox__backdrop" type="button" data-lumen-image-close aria-label="Close expanded image"></button>
    <section class="lumen-image-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Expanded sanctuary artwork" tabindex="-1">
      <button class="lumen-image-lightbox__close" type="button" data-lumen-image-close aria-label="Close expanded image">
        <span class="close-circle-icon" aria-hidden="true"></span>
      </button>
      <img class="lumen-image-lightbox__image" alt="" width="${LUMEN_SANCTUARY_IMAGE_WIDTH}" height="${LUMEN_SANCTUARY_IMAGE_HEIGHT}" loading="eager" decoding="async" />
    </section>
  `;

  document.body.appendChild(lumenImageLightbox);
  lumenImageLightboxImage = lumenImageLightbox.querySelector(".lumen-image-lightbox__image");
  lumenImageLightboxTitle = null;

  lumenImageLightbox.addEventListener("click", (event) => {
    if (event.target.closest("[data-lumen-image-close]")) {
      closeLumenImageLightbox();
    }
  });
}

function openLumenImageLightbox(src, alt, title, trigger) {
  if (!src) {
    return;
  }

  createLumenImageLightbox();
  lumenImageLightboxReturnTarget = trigger instanceof HTMLElement ? trigger : document.activeElement;
  lumenImageLightboxImage.src = src;
  lumenImageLightboxImage.alt = alt || title || "Expanded sanctuary artwork";
  lumenImageLightbox.classList.add("is-open");
  lumenImageLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lumen-image-lightbox-open");

  lumenImageLightbox.querySelector(".lumen-image-lightbox__close")?.focus({ preventScroll: true });
  window.requestAnimationFrame(() => {
    lumenImageLightbox.querySelector(".lumen-image-lightbox__close")?.focus({ preventScroll: true });
  });
}

function closeLumenImageLightbox() {
  if (!lumenImageLightbox) {
    return;
  }

  lumenImageLightbox.classList.remove("is-open");
  lumenImageLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lumen-image-lightbox-open");

  if (lumenImageLightboxImage) {
    lumenImageLightboxImage.removeAttribute("src");
  }

  if (lumenImageLightboxReturnTarget && typeof lumenImageLightboxReturnTarget.focus === "function") {
    lumenImageLightboxReturnTarget.focus({ preventScroll: true });
  }

  lumenImageLightboxReturnTarget = null;
}

function getStoredLumenName() {
  try {
    return localStorage.getItem(lumenNameStorageKey) || "";
  } catch (error) {
    return "";
  }
}

function getStoredLumenWelcomeMessage() {
  try {
    return localStorage.getItem(lumenWelcomeStorageKey) || "";
  } catch (error) {
    return "";
  }
}

function saveLumenWelcome(name, message) {
  try {
    localStorage.setItem(lumenNameStorageKey, name);
    localStorage.setItem(lumenWelcomeStorageKey, message);
  } catch (error) {
    return;
  }
}

function clearLumenWelcome() {
  try {
    localStorage.removeItem(lumenNameStorageKey);
    localStorage.removeItem(lumenWelcomeStorageKey);
  } catch (error) {
    return;
  }
}

function getRandomLumenWelcomeMessage() {
  return lumenWelcomeMessages[Math.floor(Math.random() * lumenWelcomeMessages.length)];
}

function cleanLumenName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

function getLumenNameValidationMessage(name) {
  const cleanedName = cleanLumenName(name);

  if (!cleanedName) {
    return "The Atrium waits for a name.";
  }

  if (cleanedName.length < 2) {
    return "A name needs more than a single breath.";
  }

  if (!/^[\p{L}][\p{L}' -]{1,}$/u.test(cleanedName)) {
    return "The light listens for a name, not a symbol.";
  }

  return "";
}

function renderLumenWelcome(name, message) {
  if (!lumenNameMessage) {
    return;
  }

  if (!name) {
    lumenNameMessage.textContent = "";
    if (lumenNameFields) {
      lumenNameFields.hidden = false;
    }
    lumenNameReset.hidden = true;
    return;
  }

  if (lumenNameFields) {
    lumenNameFields.hidden = true;
  }
  lumenNameMessage.innerHTML = `
    <span>Welcome, ${escapeLumenHtml(name)}. The Lumen Archive opens gently before you.</span>
    <span>${escapeLumenHtml(message || getRandomLumenWelcomeMessage())}</span>
  `;
  lumenNameReset.hidden = false;
}

function initializeLumenNamePrompt() {
  const storedName = getStoredLumenName();

  if (!storedName) {
    return;
  }

  if (lumenNameInput) {
    lumenNameInput.value = storedName;
  }

  renderLumenWelcome(storedName, getStoredLumenWelcomeMessage());
}

function getLumenDashboardRooms() {
  return lumenDashboardOrderIds
    .map((id) => lumenSanctuaries.find((sanctuary) => sanctuary.id === id))
    .filter(Boolean);
}

function getLumenDashboardEntries() {
  return [lumenArrivalRoomEntry, ...getLumenDashboardRooms()];
}

function getLumenDashboardTitle(sanctuary) {
  return String(sanctuary?.title || "").replace(/^the\s+/i, "");
}

function getLumenDashboardDetail(sanctuary) {
  return lumenDashboardRoomDetails[sanctuary?.id] || {
    roomNumber: lumenSanctuaries.indexOf(sanctuary) + 1,
    shortLine: sanctuary?.lightworkNote || sanctuary?.description || "",
    sealTitle: "Sanctuary Seal",
    sealDescription: sanctuary?.lightworkNote || "A quiet mark of the work this room invites.",
    sealEarned: false
  };
}

function getLumenDashboardEntryById(id) {
  return getLumenDashboardEntries().find((entry) => entry.id === id) || lumenArrivalRoomEntry;
}

function getLumenDashboardSanctuaryIndexById(id) {
  const rooms = getLumenDashboardRooms();
  return rooms.findIndex((sanctuary) => sanctuary.id === id);
}

function getLumenDashboardInitialIndex() {
  return getLumenDashboardEntryById(getLumenDashboardRouteId()).id;
}

function getLumenDashboardNavTitle(entry) {
  return entry.navTitle || getLumenDashboardTitle(entry);
}

function getLumenDashboardNavSubtitle(entry) {
  if (entry.type === "arrival") {
    return "Welcome";
  }

  return entry.element || "";
}

function getLumenDashboardElementClass(entry) {
  const element = getLumenDashboardNavSubtitle(entry).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return element ? `element-${element}` : "";
}

function getLumenDashboardNavIcon(entry) {
  if (entry.navIcon) {
    return entry.navIcon;
  }

  return getLumenSanctuarySelectorIcon(entry);
}

function renderLumenDashboardNav(entries, activeEntry) {
  if (!lumenDashboardNav) {
    return;
  }

  lumenDashboardNav.innerHTML = entries
    .map((entry) => {
      const isActive = entry.id === activeEntry.id;

      return `
        <button class="lumen-room-nav__button${isActive ? " is-active" : ""}" type="button" data-lumen-dashboard-room="${escapeLumenHtml(entry.id)}" aria-pressed="${isActive ? "true" : "false"}">
          <span class="lumen-room-nav__icon" aria-hidden="true">
            <img src="${escapeLumenHtml(getLumenDashboardNavIcon(entry))}" alt="" loading="lazy" decoding="async" />
          </span>
          <span class="lumen-room-nav__copy">
            <strong>${escapeLumenHtml(getLumenDashboardNavTitle(entry))}</strong>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderLumenDashboardPreviews(rooms, activeRoom, target = lumenDashboardPreviews) {
  if (!target) {
    return;
  }

  target.innerHTML = rooms
    .filter((sanctuary) => sanctuary.id !== activeRoom.id)
    .map((sanctuary) => {
      const previewImage = getLumenRoomPreviewImage(sanctuary);
      const title = getLumenDashboardTitle(sanctuary);

      return `
        <button class="lumen-room-preview lumen-room-preview-card" type="button" data-lumen-dashboard-room="${escapeLumenHtml(sanctuary.id)}" aria-label="${escapeLumenHtml(`Open ${title}`)}">
          <img class="lumen-room-preview-img" src="${escapeLumenHtml(previewImage)}" alt="${escapeLumenHtml(title)}" loading="lazy" decoding="async" />
          <span class="lumen-room-preview-overlay" aria-hidden="true"></span>
          <span class="lumen-room-preview-copy">
            <span class="lumen-room-preview-element">${escapeLumenHtml(sanctuary.element)}</span>
            <span class="lumen-room-preview-title">${escapeLumenHtml(title)}</span>
          </span>
        </button>
      `;
    })
    .join("");

  setupLumenPreviewCarousel(target);
  syncLumenPreviewIndicators(target);
}

function getLumenPreviewCarouselDistance(grid) {
  const card = grid?.querySelector(".lumen-room-preview");

  if (!grid || !card) {
    return 0;
  }

  const cardStyles = window.getComputedStyle(card);
  const gridStyles = window.getComputedStyle(grid);
  const cardWidth = card.getBoundingClientRect().width;
  const cardMargin =
    parseFloat(cardStyles.marginLeft || "0") +
    parseFloat(cardStyles.marginRight || "0");
  const gridGap = parseFloat(gridStyles.columnGap || gridStyles.gap || "0");

  return cardWidth + cardMargin + gridGap;
}

function getLumenPreviewCardsPerPage(grid) {
  const card = grid?.querySelector(".lumen-room-preview");

  if (!grid || !card) {
    return 1;
  }

  const cardWidth = card.getBoundingClientRect().width;

  if (!cardWidth) {
    return 1;
  }

  return Math.max(1, Math.round(grid.clientWidth / cardWidth));
}

function getLumenPreviewIndicators(grid) {
  const section = grid?.closest(".lumen-other-rooms, .lumen-arrival-previews");

  return section?.querySelector("[data-lumen-preview-indicators]") || null;
}

function syncLumenPreviewIndicators(grid) {
  const indicators = getLumenPreviewIndicators(grid);
  const segments = indicators ? Array.from(indicators.children) : [];
  const distance = getLumenPreviewCarouselDistance(grid);

  if (!grid || !segments.length || !distance) {
    return;
  }

  const activeIndex = Math.max(0, Math.min(segments.length - 1, Math.round(grid.scrollLeft / distance)));
  const progress = ((activeIndex + 1) / segments.length) * 100;

  indicators.style.setProperty("--lumen-preview-progress", `${progress}%`);

  segments.forEach((segment, index) => {
    segment.classList.toggle("is-active", index === activeIndex);
  });
}

function setupLumenPreviewCarousel(grid) {
  const indicators = getLumenPreviewIndicators(grid);
  const count = grid?.querySelectorAll(".lumen-room-preview").length || 0;
  const cardsPerPage = getLumenPreviewCardsPerPage(grid);
  const pageCount = Math.max(1, count - cardsPerPage + 1);

  if (!grid || !indicators) {
    return;
  }

  indicators.innerHTML = Array.from({ length: pageCount }, (_, index) => (
    `<span class="lumen-other-rooms__indicator${index === 0 ? " is-active" : ""}"></span>`
  )).join("");

  if (grid.dataset.lumenPreviewCarouselReady === "true") {
    return;
  }

  grid.dataset.lumenPreviewCarouselReady = "true";
  grid.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => syncLumenPreviewIndicators(grid));
  }, { passive: true });
}

function moveLumenPreviewCarousel(button) {
  const section = button?.closest(".lumen-other-rooms, .lumen-arrival-previews");
  const grid = section?.querySelector(".lumen-other-rooms__grid");
  const distance = getLumenPreviewCarouselDistance(grid);

  if (!grid || !distance) {
    return;
  }

  const direction = button.dataset.lumenPreviewNav === "prev" ? -1 : 1;

  grid.scrollBy({
    left: distance * direction,
    behavior: getLumenScrollBehavior()
  });
}

function isLumenPreviewCarouselControl(target) {
  return target.closest("[data-lumen-preview-nav]");
}

function resetLumenSidebarQuoteAlignment() {
  const quote = document.querySelector(".lumen-sidebar-quote");

  if (!quote) {
    return;
  }

  quote.style.height = "";
  quote.style.minHeight = "";
  quote.style.marginTop = "";
}

function alignLumenSidebarQuoteToExplore() {
  const quote = document.querySelector(".lumen-sidebar-quote");
  const exploreSection = lumenSanctuaryDashboardLayout?.querySelector(".lumen-other-rooms");
  const firstPreview = exploreSection?.querySelector(".lumen-room-preview");
  const canAlign =
    quote &&
    firstPreview &&
    window.matchMedia("(min-width: 1200px)").matches &&
    lumenDashboard?.classList.contains("is-sanctuary-active");

  if (!canAlign) {
    resetLumenSidebarQuoteAlignment();
    return;
  }

  quote.style.marginTop = "0px";
  quote.style.height = "";
  quote.style.minHeight = "";

  const previewRect = firstPreview.getBoundingClientRect();

  if (!previewRect.height) {
    resetLumenSidebarQuoteAlignment();
    return;
  }

  quote.style.height = `${previewRect.height}px`;
  quote.style.minHeight = `${previewRect.height}px`;

  const quoteTop = quote.getBoundingClientRect().top;
  const marginTop = Math.max(0, previewRect.top - quoteTop);
  quote.style.marginTop = `${marginTop}px`;
}

function scheduleLumenSidebarQuoteAlignment() {
  if (lumenSidebarQuoteAlignmentFrame) {
    window.cancelAnimationFrame(lumenSidebarQuoteAlignmentFrame);
  }

  lumenSidebarQuoteAlignmentFrame = window.requestAnimationFrame(() => {
    lumenSidebarQuoteAlignmentFrame = window.requestAnimationFrame(() => {
      lumenSidebarQuoteAlignmentFrame = null;
      alignLumenSidebarQuoteToExplore();
    });
  });
}

function getStoredLumenVisitorName() {
  try {
    return localStorage.getItem(lumenVisitorNameStorageKey) || "";
  } catch (error) {
    return "";
  }
}

function saveLumenVisitorName(name) {
  try {
    localStorage.setItem(lumenVisitorNameStorageKey, name);
  } catch (error) {
    return;
  }
}

function getLumenProfileDisplayName(profile, user) {
  const keys = ["display_name", "name", "full_name", "username"];

  for (const key of keys) {
    const value = profile?.[key] || user?.user_metadata?.[key];

    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
}

function getLumenArrivalWelcomeLine() {
  const signedInName = cleanLumenName(lumenSignedInDisplayName);

  if (signedInName) {
    return `Welcome back, ${signedInName}. The Archive remembers the light you carried in.`;
  }

  return "Welcome, wanderer. The Archive remembers the light you carried in.";
}

function renderLumenArrivalRoom() {
  resetLumenArrivalIntroCarousel();

  if (lumenArrivalHero) {
    lumenArrivalHero.style.setProperty("--room-hero-image", `url("${getLumenCssImageUrl(lumenArrivalRoomEntry.heroImage)}")`);
  }

  if (lumenArrivalHeroImage) {
    lumenArrivalHeroImage.src = lumenArrivalRoomEntry.heroImage;
    lumenArrivalHeroImage.alt = lumenArrivalRoomEntry.title;
  }

  if (lumenArrivalWelcome) {
    lumenArrivalWelcome.textContent = getLumenArrivalWelcomeLine();
  }

  renderLumenDashboardPreviews(getLumenDashboardRooms(), { id: "" }, lumenArrivalPreviews);
}

async function hydrateLumenArrivalSignedInName() {
  if (!lumenDashboard) {
    return;
  }

  try {
    const { getCurrentUserWithProfile } = await import("../src/services/auth.js");
    const { user, profile, error } = await getCurrentUserWithProfile();

    if (error || !user) {
      return;
    }

    lumenSignedInDisplayName = getLumenProfileDisplayName(profile, user);

    if (activeLumenDashboardId === "arrival-room") {
      renderLumenArrivalRoom();
    }
  } catch (error) {
    console.warn("[Astral Veil] Lumen Arrival Room could not resolve profile name.", error);
  }
}

function renderActiveLumenDashboardEntry(entry, options = {}) {
  const entries = getLumenDashboardEntries();
  activeLumenDashboardId = entry.id;

  lumenDashboard?.classList.toggle("is-arrival-active", entry.type === "arrival");
  lumenDashboard?.classList.toggle("is-sanctuary-active", entry.type !== "arrival");

  renderLumenDashboardNav(entries, entry);

  if (entry.type === "arrival") {
    resetLumenSidebarQuoteAlignment();

    if (lumenArrivalRoom) {
      lumenArrivalRoom.hidden = false;
    }

    if (lumenArrivalExplore) {
      lumenArrivalExplore.hidden = false;
      lumenArrivalExplore.setAttribute("aria-hidden", "false");
    }

    if (lumenSanctuaryDashboardLayout) {
      lumenSanctuaryDashboardLayout.hidden = true;
    }

    renderLumenArrivalRoom();
  } else {
    if (lumenArrivalRoom) {
      lumenArrivalRoom.hidden = true;
    }

    if (lumenArrivalExplore) {
      lumenArrivalExplore.hidden = true;
      lumenArrivalExplore.setAttribute("aria-hidden", "true");
    }

    if (lumenSanctuaryDashboardLayout) {
      lumenSanctuaryDashboardLayout.hidden = false;
    }

    renderLumenSanctuaryDashboardRoom(entry);
  }

  if (options.updatePath !== false) {
    const cleanPath = getLumenCleanRoomPath(entry.id);

    if (window.location.pathname !== cleanPath || window.location.search || window.location.hash) {
      window.history.pushState({ lumenRoom: entry.id }, "", cleanPath);
    }
  }
}

function setActiveLumenDashboardRoom(id, options = {}) {
  renderActiveLumenDashboardEntry(getLumenDashboardEntryById(id), options);
}

function getLumenDashboardActiveRoom() {
  return getLumenDashboardRooms().find((room) => room.id === activeLumenDashboardId) || null;
}

function getLumenDashboardReflectionQuestions(sanctuary) {
  return Array.isArray(sanctuary?.reflections) ? sanctuary.reflections : [];
}

function renderLumenDashboardActiveQuestion(sanctuary = getLumenDashboardActiveRoom()) {
  if (!lumenDashboardQuestionText || !sanctuary) {
    return;
  }

  const questions = getLumenDashboardReflectionQuestions(sanctuary);

  if (!questions.length) {
    lumenDashboardQuestionText.textContent = "";
    return;
  }

  lumenDashboardQuestionIndex = Math.max(0, Math.min(lumenDashboardQuestionIndex, questions.length - 1));
  lumenDashboardQuestionText.textContent = questions[lumenDashboardQuestionIndex] || "";
}

function cycleLumenDashboardQuestion() {
  const sanctuary = getLumenDashboardActiveRoom();
  const questions = getLumenDashboardReflectionQuestions(sanctuary);

  if (!sanctuary || !questions.length) {
    return;
  }

  lumenDashboardQuestionIndex = (lumenDashboardQuestionIndex + 1) % questions.length;
  renderLumenDashboardActiveQuestion(sanctuary);
}

function updateLumenSanctuaryCardCarousel() {
  if (!lumenSanctuaryCardTrack) {
    return;
  }

  const slides = lumenSanctuaryCardTrack.querySelectorAll(".lumen-sanctuary-slide");
  const slideCount = slides.length || 1;
  const dots = lumenSanctuaryCardDots ? Array.from(lumenSanctuaryCardDots.children) : [];

  lumenSanctuaryCardIndex = ((lumenSanctuaryCardIndex % slideCount) + slideCount) % slideCount;
  lumenSanctuaryCardTrack.style.transform = `translateX(-${lumenSanctuaryCardIndex * 100}%)`;
  lumenSanctuaryCardCarousel?.setAttribute("data-active-card", String(lumenSanctuaryCardIndex));
  lumenSanctuaryCardDots?.style.setProperty("--lumen-carousel-progress", `${((lumenSanctuaryCardIndex + 1) / slideCount) * 100}%`);

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === lumenSanctuaryCardIndex);
  });
}

function moveLumenSanctuaryCardCarousel(direction) {
  const slideCount = lumenSanctuaryCardTrack?.querySelectorAll(".lumen-sanctuary-slide").length || 0;

  if (!slideCount) {
    return;
  }

  lumenSanctuaryCardIndex = (lumenSanctuaryCardIndex + direction + slideCount) % slideCount;
  updateLumenSanctuaryCardCarousel();
}

function resetLumenSanctuaryCardCarousel() {
  lumenSanctuaryCardIndex = 0;
  updateLumenSanctuaryCardCarousel();
}

function updateLumenArrivalIntroCarousel() {
  if (!lumenArrivalIntroTrack) {
    return;
  }

  const slides = lumenArrivalIntroTrack.querySelectorAll(".lumen-arrival-intro-slide");
  const slideCount = slides.length || 1;
  const dots = lumenArrivalIntroDots ? Array.from(lumenArrivalIntroDots.children) : [];

  lumenArrivalIntroCardIndex = ((lumenArrivalIntroCardIndex % slideCount) + slideCount) % slideCount;
  lumenArrivalIntroTrack.style.transform = `translateX(-${lumenArrivalIntroCardIndex * 100}%)`;
  lumenArrivalIntroCarousel?.setAttribute("data-active-intro-card", String(lumenArrivalIntroCardIndex));
  lumenArrivalIntroDots?.style.setProperty("--lumen-carousel-progress", `${((lumenArrivalIntroCardIndex + 1) / slideCount) * 100}%`);

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === lumenArrivalIntroCardIndex);
  });
}

function moveLumenArrivalIntroCarousel(direction) {
  const slideCount = lumenArrivalIntroTrack?.querySelectorAll(".lumen-arrival-intro-slide").length || 0;

  if (!slideCount) {
    return;
  }

  lumenArrivalIntroCardIndex = (lumenArrivalIntroCardIndex + direction + slideCount) % slideCount;
  updateLumenArrivalIntroCarousel();
}

function resetLumenArrivalIntroCarousel() {
  lumenArrivalIntroCardIndex = 0;
  updateLumenArrivalIntroCarousel();
}

function renderLumenSanctuaryDashboardRoom(sanctuary) {
  const rooms = getLumenDashboardRooms();
  const details = getLumenDashboardDetail(sanctuary);
  const heroImage = getLumenRoomHeroImage(sanctuary);
  lumenDashboardQuestionIndex = 0;
  resetLumenSanctuaryCardCarousel();

  if (lumenDashboardHero) {
    lumenDashboardHero.style.setProperty("--room-hero-image", `url("${getLumenCssImageUrl(heroImage)}")`);
  }

  if (lumenDashboardHeroImage) {
    lumenDashboardHeroImage.src = heroImage;
    lumenDashboardHeroImage.alt = `${getLumenDashboardTitle(sanctuary)} room artwork`;
  }

  if (lumenDashboardSealImage) {
    const sealImage = getLumenRoomSealImage(sanctuary);
    lumenDashboardSealImage.src = sealImage;
    lumenDashboardSealImage.alt = "";
  }

  if (lumenDashboardElement) {
    lumenDashboardElement.textContent = sanctuary.element;
  }

  if (lumenDashboardTitle) {
    lumenDashboardTitle.textContent = getLumenDashboardTitle(sanctuary);
  }

  if (lumenDashboardLine) {
    lumenDashboardLine.textContent = details.shortLine || sanctuary.lightworkNote || sanctuary.description || "";
  }

  if (lumenDashboardPurposeTitle) {
    lumenDashboardPurposeTitle.textContent = sanctuary.need || "Lightwork";
  }

  if (lumenDashboardPurpose) {
    lumenDashboardPurpose.textContent = sanctuary.previewPurpose || sanctuary.purpose || sanctuary.description || "";
  }

  if (lumenDashboardRitual) {
    lumenDashboardRitual.textContent = sanctuary.practice || sanctuary.lightworkNote || "";
  }

  renderLumenDashboardActiveQuestion(sanctuary);

  if (lumenDashboardSealTitle) {
    lumenDashboardSealTitle.textContent = details.sealTitle;
    lumenDashboardSealTitle.className = getLumenDashboardElementClass(sanctuary);
  }

  if (lumenDashboardSealDescription) {
    lumenDashboardSealDescription.textContent = details.sealDescription;
  }

  if (lumenDashboardUnsealScroll) {
    lumenDashboardUnsealScroll.dataset.lumenOpenScroll = String(lumenSanctuaries.indexOf(sanctuary));
  }

  renderLumenDashboardPreviews(rooms, sanctuary);
  scheduleLumenSidebarQuoteAlignment();
}

function closeLumenArrivalContentModal() {
  if (!lumenArrivalContentModal) {
    return;
  }

  lumenArrivalContentModal.hidden = true;
  document.body.classList.remove("lumen-content-modal-open");
  lumenArrivalContentReturnTarget?.focus();
  lumenArrivalContentReturnTarget = null;
}

function ensureLumenArrivalContentModal() {
  if (lumenArrivalContentModal) {
    return lumenArrivalContentModal;
  }

  const modal = document.createElement("div");
  modal.className = "lumen-content-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="lumen-content-modal__backdrop" data-lumen-content-modal-close></div>
    <section class="lumen-content-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="lumen-content-modal-title" tabindex="-1">
      <button class="lumen-content-modal__close" type="button" data-lumen-content-modal-close aria-label="Close full guidance">×</button>
      <p class="lumen-room-panel__label">Lumen Archive</p>
      <h2 id="lumen-content-modal-title"></h2>
      <div class="lumen-content-modal__body"></div>
    </section>`;
  document.body.append(modal);
  lumenArrivalContentModal = modal;

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-lumen-content-modal-close]")) {
      closeLumenArrivalContentModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lumenArrivalContentModal?.hidden) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLumenArrivalContentModal();
      return;
    }

    if (event.key === "Tab") {
      const focusable = Array.from(lumenArrivalContentModal.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  return modal;
}

function openLumenArrivalContentModal(trigger) {
  const panel = trigger.closest(".lumen-arrival-panel");
  const title = panel?.querySelector(".lumen-room-panel__label")?.textContent?.trim();
  const content = panel?.querySelector(".lumen-arrival-panel__body")?.innerHTML;

  if (!title || !content) {
    return;
  }

  const modal = ensureLumenArrivalContentModal();
  modal.querySelector("#lumen-content-modal-title").textContent = title;
  modal.querySelector(".lumen-content-modal__body").innerHTML = content;
  lumenArrivalContentReturnTarget = trigger;
  modal.hidden = false;
  document.body.classList.add("lumen-content-modal-open");
  modal.querySelector(".lumen-content-modal__close").focus();
}

function initializeLumenDashboard() {
  if (!lumenDashboard) {
    return;
  }

  if (lumenDashboard.dataset.lumenListenersBound === "true") {
    return;
  }

  lumenDashboard.dataset.lumenListenersBound = "true";
  normalizeLegacyLumenRoute();
  setActiveLumenDashboardRoom(getLumenDashboardInitialIndex(), {
    updatePath: false
  });

  lumenDashboard.addEventListener("click", (event) => {
    const arrivalReadMoreButton = event.target.closest("[data-lumen-arrival-read-more]");
    const roomButton = event.target.closest("[data-lumen-dashboard-room]");
    const exploreButton = event.target.closest("[data-lumen-arrival-explore]");
    const scrollButton = event.target.closest("[data-lumen-open-scroll]");
    const previewNavButton = isLumenPreviewCarouselControl(event.target);
    const questionCycleButton = event.target.closest("[data-lumen-question-cycle]");
    const sanctuaryCardPrevButton = event.target.closest("[data-lumen-sanctuary-card-prev]");
    const sanctuaryCardNextButton = event.target.closest("[data-lumen-sanctuary-card-next]");
    const arrivalIntroPrevButton = event.target.closest("[data-lumen-arrival-intro-prev]");
    const arrivalIntroNextButton = event.target.closest("[data-lumen-arrival-intro-next]");

    if (arrivalReadMoreButton) {
      openLumenArrivalContentModal(arrivalReadMoreButton);
      return;
    }

    if (exploreButton) {
      lumenArrivalPreviews?.scrollIntoView({
        behavior: getLumenScrollBehavior(),
        block: "nearest"
      });
      return;
    }

    if (scrollButton) {
      openLumenSanctuaryScroll(Number(scrollButton.dataset.lumenOpenScroll), scrollButton);
      return;
    }

    if (questionCycleButton) {
      cycleLumenDashboardQuestion();
      return;
    }

    if (sanctuaryCardPrevButton) {
      moveLumenSanctuaryCardCarousel(-1);
      return;
    }

    if (sanctuaryCardNextButton) {
      moveLumenSanctuaryCardCarousel(1);
      return;
    }

    if (arrivalIntroPrevButton) {
      moveLumenArrivalIntroCarousel(-1);
      return;
    }

    if (arrivalIntroNextButton) {
      moveLumenArrivalIntroCarousel(1);
      return;
    }

    if (previewNavButton) {
      moveLumenPreviewCarousel(previewNavButton);
      return;
    }

    if (!roomButton) {
      return;
    }

    const selectedFromRoomPreview = Boolean(roomButton.closest(".lumen-other-rooms, .lumen-arrival-previews"));
    setActiveLumenDashboardRoom(roomButton.dataset.lumenDashboardRoom);

    if (selectedFromRoomPreview) {
      scrollLumenArchiveToTop();
    }
  });

  window.addEventListener("hashchange", () => {
    normalizeLegacyLumenRoute();
    setActiveLumenDashboardRoom(getLumenDashboardInitialIndex(), {
      updatePath: false
    });
  });

  window.addEventListener("popstate", () => {
    setActiveLumenDashboardRoom(getLumenDashboardInitialIndex(), {
      updatePath: false
    });
  });

  window.addEventListener("resize", scheduleLumenSidebarQuoteAlignment);
  window.addEventListener("orientationchange", scheduleLumenSidebarQuoteAlignment);

  void hydrateLumenArrivalSignedInName();
}

initializeLumenDashboard();

if (lumenRail && lumenViewer) {
  renderLumenRail();
  renderLumenViewer();
  initializeLumenNamePrompt();

  const lumenLightworkRailMedia = window.matchMedia("(max-width: 767px)");
  lumenLightworkRailMedia.addEventListener("change", renderLumenRail);

  document.addEventListener("click", (event) => {
    const sanctuaryTab = event.target.closest("[data-lumen-sanctuary-index]");
    const sanctuaryNav = event.target.closest("[data-lumen-sanctuary-nav]");
    const sanctuaryEnter = event.target.closest("[data-lumen-enter-sanctuary]");
    const sanctuaryReturn = event.target.closest("[data-lumen-return-sanctuaries]");
    const scrollButton = event.target.closest("[data-lumen-open-scroll]");
    const reflectionButton = event.target.closest("[data-lumen-draw-reflection]");
    const nameReset = event.target.closest("[data-lumen-name-reset]");
    const imageOpen = event.target.closest("[data-lumen-image-open]");

    if (sanctuaryTab) {
      const selectedFromRail = Boolean(sanctuaryTab.closest("[data-lumen-sanctuary-rail]"));
      setActiveLumenSanctuary(Number(sanctuaryTab.dataset.lumenSanctuaryIndex));

      if (selectedFromRail || shouldAutoScrollLumenPortalOnSelection()) {
        window.requestAnimationFrame(() => {
          scrollLumenPortalToActive("auto");
          scrollLumenPortalImageIntoView();
        });
      }

      return;
    }

    if (sanctuaryNav) {
      selectAdjacentLumenSanctuary(sanctuaryNav.dataset.lumenSanctuaryNav);
      return;
    }

    if (sanctuaryEnter) {
      const selectedSanctuary = getLumenSanctuaryBySelector(sanctuaryEnter.dataset.lumenEnterIndex);

      if (selectedSanctuary) {
        activeLumenSanctuaryIndex = lumenSanctuaries.indexOf(selectedSanctuary);
        renderLumenRail();
        updateLumenPortalActiveClasses();
      }

      enterLumenSanctuary();
      return;
    }

    if (sanctuaryReturn) {
      returnToLumenSanctuaries();
      return;
    }

    if (scrollButton) {
      openLumenSanctuaryScroll(Number(scrollButton.dataset.lumenOpenScroll), scrollButton);
      return;
    }

    if (reflectionButton) {
      chooseLumenReflectionIndex(Number(reflectionButton.dataset.lumenDrawReflection));
      renderLumenInterior();
      return;
    }

    if (nameReset) {
      clearLumenWelcome();
      renderLumenWelcome("", "");

      if (lumenNameInput) {
        lumenNameInput.value = "";
        lumenNameInput.focus();
      }
      return;
    }

    if (imageOpen) {
      openLumenImageLightbox(
        imageOpen.dataset.lumenImageSrc,
        imageOpen.dataset.lumenImageAlt,
        imageOpen.dataset.lumenImageTitle,
        imageOpen
      );
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lumenImageLightbox?.classList.contains("is-open")) {
      closeLumenImageLightbox();
    }
  });

  lumenNameForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const submittedName = cleanLumenName(lumenNameInput?.value);
    const validationMessage = getLumenNameValidationMessage(submittedName);

    if (validationMessage) {
      if (lumenNameMessage) {
        lumenNameMessage.textContent = validationMessage;
      }
      lumenNameReset.hidden = true;
      return;
    }

    const welcomeMessage = getRandomLumenWelcomeMessage();

    if (lumenNameInput) {
      lumenNameInput.value = submittedName;
    }

    saveLumenWelcome(submittedName, welcomeMessage);
    renderLumenWelcome(submittedName, welcomeMessage);
  });
}
