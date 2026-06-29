const archiveContent = document.querySelectorAll("[data-archive-content]");
const archiveLocked = document.querySelector("[data-archive-locked]");
const archiveFooterLink = document.querySelector("[data-archive-footer-link]");
const archiveRoomHub = document.querySelector("[data-archive-room-hub]");
const archiveRoomGrid = document.querySelector("[data-archive-room-grid]");
const archiveRoomView = document.querySelector("[data-archive-room-view]");
const archiveRoomToast = document.querySelector("[data-archive-room-toast]");
const isNoctisRoomPage = window.location.pathname.split("/").pop() === "noctis-room.html";
const noctisRoomNavbar = document.querySelector("[data-noctis-room-navbar]");
const noctisRoomPage = document.querySelector("[data-noctis-room-shell]");
const noctisRoomTitle = document.querySelector("[data-noctis-room-title]");
const noctisRoomType = document.querySelector("[data-noctis-room-type]");
const noctisRoomCopy = document.querySelector("[data-noctis-room-copy]");
const noctisRoomContent = document.querySelector("[data-noctis-room-content]");
const noctisRoomBack = document.querySelector("[data-noctis-room-back]");
const ARCHIVE_ARTWORK_WIDTH = 1050;
const ARCHIVE_ARTWORK_HEIGHT = 1400;
const ARCHIVE_ARTIFACT_SIZE = 900;

let archiveToastTimeout = null;
let hasNormalizedInitialRoomHash = false;
let selectedArchiveRoomId = "entry-desk";
let enteredArchiveRoomId = "";
let activeArchiveShelfEntryId = "";
let archiveCodeFeedback = "";
let archiveCodeFeedbackTone = "";
let archiveCodeFeedbackTimeout = null;
let openRecoveredObjectId = "";
let isRecoveredItemsModalOpen = false;
let isArchiveNoticesModalOpen = false;
let archiveNoticesModalPage = 0;
let openVisualRecordId = "";
let restrictedWingRitualOpen = false;
let restrictedWingGuestPromptOpen = false;
let selectedGalleryRecordIndex = 0;
let visualRecordTouchStartX = 0;
let visualRecordTouchStartY = 0;
let galleryTouchStartX = 0;
let galleryTouchStartY = 0;
let galleryActiveFilter = "All Records";
let galleryActiveSort = "Newest";
let galleryRecordSetIndex = 0;
let galleryRecords = [];
let galleryRecordsLoaded = false;
let galleryRecordsLoading = false;
let galleryRecordsError = "";
let galleryRecordsUseFallback = false;
let openGalleryRecordId = "";
let galleryFeaturedIndex = 0;
let openGalleryUtilityModal = "";
let openGalleryTrailRestoredId = "";
let galleryTrailRevealAnimatingId = "";
let galleryTrailRevealTimer = null;
const galleryRecentlyViewedRecords = [];
const galleryMarkedRecordIds = new Set();
const galleryUserState = {
  isLoaded: false,
  isLoading: false,
  user: null,
  supabase: null,
  recentRows: [],
  markedRows: [],
  recentMeta: new Map(),
  markedMeta: new Map(),
  error: ""
};
const galleryVisualTrailState = {
  isLoaded: false,
  isLoading: false,
  trails: [],
  trail: null,
  selectedTrailId: "",
  trailPageIndex: 0,
  fragments: [],
  fragmentsByTrailId: new Map(),
  recoveredRows: [],
  recoveredRowsByTrailId: new Map(),
  recoveredIds: new Set(),
  recoveredIdsByTrailId: new Map(),
  error: ""
};
let selectedVeilwalkerWhispers = [];
let selectedArchiveEchoes = [];
let openEntryDeskWhisperId = "";
let shelvesDocuments = [];
let shelvesDocumentsLoaded = false;
let shelvesDocumentsLoading = false;
let shelvesDocumentsError = "";
let shelvesSearchQuery = "";
let shelvesActiveFilter = "all";
let shelvesActiveIndex = 0;
let openShelvesReadDocumentId = "";
let openShelvesDetailsDocumentId = "";
let openShelvesAidModalId = "";
let isShelvesNotableModalOpen = false;
let isShelvesResearchModalOpen = false;
let isShelvesRecentModalOpen = false;
let shelvesAidPageIndex = 0;
let shelvesNotablePageIndex = 0;
let shelvesActiveResearchTrailId = "";
let shelvesRecentlyReadEntries = new Map();
const shelvesRecentlyReadStorageKey = "astralVeilNoctisShelvesRecentlyReadSession";
const shelvesSavedDocumentsState = {
  isLoaded: false,
  isLoading: false,
  user: null,
  supabase: null,
  savedIds: new Set(),
  savedAt: new Map(),
  pendingIds: new Set(),
  notice: "",
  error: ""
};

const archiveKeyStorageKey = "astralVeilNoctisElementalKeys";
const archiveKeySessionStorageKey = "astralVeilNoctisElementalKeysSession";
const artifactProgressState = {
  isLoaded: false,
  user: null,
  supabase: null,
  unlockedKeys: []
};
const roomProgressState = {
  isLoaded: false,
  user: null,
  supabase: null,
  rooms: new Map()
};
const correctArchiveCodes = {
  water: "WITHIN",
  air: "BREATHE",
  fire: "reborn",
  earth: "beneath the root, the veil remembers"
};
const archiveKeyFeedback = {
  water: {
    unlocked: "The Water Key has surfaced.",
    alreadyUnlocked: "The Water Key has already surfaced."
  },
  air: {
    unlocked: "The Air Key has taken breath.",
    alreadyUnlocked: "The Air Key already breathes within the archive."
  },
  fire: {
    unlocked: "The Fire Key has begun to burn.",
    alreadyUnlocked: "The Fire Key already burns within the archive."
  },
  earth: {
    unlocked: "The Earth Key has taken root.",
    alreadyUnlocked: "The Earth Key already waits beneath the archive."
  }
};
const archiveCodeFailureMessages = [
  "The desk remains silent.",
  "The lock does not recognize that word.",
  "Nothing beneath the ink moves."
];
const archiveNoticeFallbacks = [
  {
    id: "blood-moon-height",
    title: "Blood Moon Active",
    message: "The Blood Moon is at its height. Deeper chambers stir.",
    tone: "blood"
  },
  {
    id: "archive-listening",
    title: "Archive Listening",
    message: "Recovered phrases may unlock what ordinary doors cannot.",
    tone: "default"
  },
  {
    id: "sign-in",
    title: "Sign In",
    message: "Sign in to preserve what the Archive reveals.",
    tone: "default"
  }
];
const archiveNoticeEmptyUserItems = [
  {
    id: "no-recovered-objects",
    title: "No Recovered Objects",
    message: "No recovered objects have answered yet.",
    tone: "default"
  },
  {
    id: "desk-listening",
    title: "Entry Desk",
    message: "The Entry Desk is listening for the first phrase.",
    tone: "blood"
  },
  {
    id: "keys-before-understanding",
    title: "Archive Hint",
    message: "Some keys are found before they are understood.",
    tone: "default"
  }
];
const artifactNoticeMap = {
  water: {
    title: "Memory of the Deep",
    message: "The water memory has been recovered.",
    tone: "water"
  },
  air: {
    title: "Breath Relic",
    message: "The breath relic now answers to you.",
    tone: "air"
  },
  fire: {
    title: "Ember Key",
    message: "The ember key has been recovered.",
    tone: "fire"
  },
  earth: {
    title: "Rootstone Key",
    message: "The rootstone key has been recovered.",
    tone: "earth"
  }
};
const veilwalkerWhispers = [
  {
    id: "zephyra-plain-sight",
    speaker: "Zephyra",
    message: "You look lost. What you seek is not hidden. It stands in plain sight. Your eyes simply have not learned how to see it yet.",
    type: "hint"
  },
  {
    id: "zephyra-unready-eyes",
    speaker: "Zephyra",
    message: "What you seek was never truly hidden. It only lives where unready eyes refuse to look.",
    type: "hint"
  },
  {
    id: "lyssara-silence",
    speaker: "Lyssara",
    message: "Some doors open when you stop asking where the key is and remember where the silence first answered you.",
    type: "lore"
  },
  {
    id: "ari-phrase-returning",
    speaker: "Ari",
    message: "A phrase that returns to you is rarely only a phrase. Some words come back because they were never finished speaking.",
    type: "echo"
  },
  {
    id: "zephyra-not-demanding",
    speaker: "Zephyra",
    message: "Some doors open only after you stop demanding they explain themselves.",
    type: "warning"
  },
  {
    id: "archive-quieter-eyes",
    speaker: "The Archive",
    message: "The Archive does not hide everything. Some truths simply wait for quieter eyes.",
    type: "echo"
  },
  {
    id: "lyssara-visit",
    speaker: "Lyssara",
    message: "If you are searching for what unlocks the dark, begin with what still reflects you.",
    type: "hint"
  }
];
const archiveEchoes = [
  {
    id: "phrase-stirred",
    title: "Recovered Phrase",
    message: "A recovered phrase stirred beneath the desk.",
    type: "activity"
  },
  {
    id: "sealed-path-listening",
    title: "Sealed Path",
    message: "One sealed path is listening.",
    type: "activity"
  },
  {
    id: "hidden-title-waits",
    title: "Hidden Title",
    message: "A hidden title waits for the right name.",
    type: "unlock"
  },
  {
    id: "restricted-wing-progress",
    title: "Restricted Wing",
    message: "The Restricted Wing remains aware of your progress.",
    type: "progress"
  },
  {
    id: "artifact-recognized",
    title: "Recovered Object",
    message: "An object you recovered has been recognized by the Entry Desk.",
    type: "artifact"
  },
  {
    id: "deck-beneath-veil",
    title: "Hidden Deck",
    message: "A deck beneath the Veil waits for the phrase that names it.",
    type: "deck"
  }
];
const elementalKeyDisplayOrder = ["air", "water", "earth", "fire"];
const noctisRoomNavbarItems = [
  {
    id: "entry-desk",
    label: "Entry Desk"
  },
  {
    id: "shelves",
    label: "The Shelves"
  },
  {
    id: "gallery",
    label: "The Gallery"
  },
  {
    id: "restricted-wing",
    label: "Restricted Wing"
  },
  {
    id: "memory-vault",
    label: "Memory Vault"
  },
  {
    id: "inner-chamber",
    label: "Inner Chamber"
  }
];

// Elemental key tracking stays internal for now. The Entry Desk only shows
// vague recovered objects so the larger lock structure is not explained early.
const elementalKeys = [
  {
    id: "water",
    name: "Water",
    title: "Memory of the Deep",
    type: "Recovered Relic",
    element: "Water",
    alignment: ["Water", "Memory", "Depth"],
    recoveredFrom: "The Basin Without Bottom",
    subtitle: "Recovered from the basin where memory gathered.",
    shortDescription: "A water-aligned relic that keeps what the mind tries to dissolve.",
    description:
      "A dark glass key formed from reflection, memory, and surrender. It does not open what is ahead. It opens what has been waiting within.",
    lore:
      "The Water Relic keeps what the mind tries to dissolve. It does not reveal truth by force. It lets buried things rise slowly, until the surface can no longer pretend to be still.",
    archiveNote:
      "Recovered from a place where memory pooled beneath the floor. The relic hums faintly when sorrow, intuition, or forgotten names draw near.",
    useHint:
      "May open paths connected to memory, emotional truth, hidden reflections, or water-aligned sanctuaries.",
    image: "assets/images/water-artifact-clean.webp",
    accentClass: "element-water"
  },
  {
    id: "air",
    name: "Air",
    title: "Breath Relic",
    type: "Recovered Relic",
    element: "Air",
    alignment: ["Air", "Breath", "Release"],
    recoveredFrom: "The Sanctuary of Breath",
    subtitle: "Recovered from the Sanctuary of Breath.",
    shortDescription: "A pale key formed from breath, silence, and release.",
    description:
      "A pale key formed from breath, silence, and release. It does not open by force. It opens when what was held is finally allowed to move.",
    lore:
      "The Air Relic does not answer to force. It stirs only when what has been held too tightly is allowed to move again. Some locks in the Archive are not opened by strength, but by release.",
    archiveNote:
      "Recovered after the Sanctuary of Breath was entered. Its shape appears weightless at first, but its edges shift when silence gathers around it.",
    useHint:
      "May open a chamber, phrase, or hidden passage connected to breath, release, or air-aligned sanctuaries.",
    image: "assets/images/air-artifact-clean.webp",
    accentClass: "element-air"
  },
  {
    id: "fire",
    name: "Fire",
    title: "Ember Key",
    type: "Recovered Relic",
    element: "Fire",
    alignment: ["Fire", "Rebirth", "Will", "Ash"],
    recoveredFrom: "The Thread Between Flame and Ending",
    subtitle: "The Thread Between Flame and Ending",
    shortDescription: "A key shaped by heat, ash, and returning motion.",
    description:
      "A key shaped by heat, ash, and returning motion. It does not answer to destruction alone. It opens when the old form has burned and something brave enough to live again begins to rise.",
    lore:
      "The Ember Key carries the heat of what has ended but not disappeared. It does not burn to destroy. It burns to reveal what still has shape beneath the ash.",
    archiveNote:
      "Recovered through a reading pattern tied to endings, ignition, and return. The relic glows brightest when a choice has already begun changing the one who made it.",
    useHint:
      "May open paths connected to courage, transformation, will, rebirth, or fire-aligned sanctuaries.",
    image: "assets/images/fire-artifact-clean.webp",
    accentClass: "element-fire"
  },
  {
    id: "earth",
    name: "Earth",
    title: "Rootstone Key",
    type: "Recovered Relic",
    element: "Earth",
    alignment: ["Earth", "Root", "Memory", "Grounding"],
    recoveredFrom: "The Sanctuary of Grounding",
    subtitle: "Recovered from the Sanctuary of Grounding.",
    shortDescription: "A dark stone key veined with gold, heavy with the silence of buried things.",
    description:
      "A dark stone key veined with gold, heavy with the silence of buried things. It does not open by force. It opens when what was hidden is allowed to have weight.",
    lore:
      "The Earth Key answers to roots, memory, and the truths that waited below language.",
    archiveNote:
      "Recovered after the Grounding Sanctuary was unsealed. Its stone body seems ordinary until quiet weight gathers around it, then gold veins rise like roots remembering light.",
    useHint:
      "May open paths connected to grounding, ancestry, hidden foundations, or earth-aligned sanctuaries.",
    image: "assets/images/earth-artifact-clean.webp",
    accentClass: "element-earth"
  }
];

// Shelves journal entry data lives beside the archive renderer until there are
// enough recovered writings to justify a separate data module.
const archiveShelfEntries = [
  {
    id: "tide-within",
    title: "The Tide That Moves Within",
    label: "Recovered Journal Fragment",
    author: "Attributed to Zephyra Noctis",
    shelfMark: "J-SC-ZN-01",
    body: [
      "I used to think water was soft because it yielded.",
      "I was wrong.",
      "Water yields because it is patient enough to win without announcing itself. It does not argue with stone. It remembers the shape of resistance and returns, again and again, until the mountain learns to bow.",
      "There is a kind of strength that breaks everything it touches.",
      "There is another kind that enters without violence, fills what is empty, cools what is burning, reflects what refuses to be named, and carries away what has become too heavy to hold.",
      "The archive taught me this beside a basin with no bottom.",
      "I looked into it and saw every version of myself that had tried to become fire just to survive. Every face was bright. Every face was tired.",
      "Then the water moved.",
      "Not against me.",
      "Through me.",
      "Water does not show you the world by keeping still.",
      "It shows you what moves when you finally look.",
      "The sailor crosses oceans seeking new shores.",
      "Home waits beneath the face in the tide.",
      "In every reflection, a door opens inward.",
      "Nothing is farther than the self we avoid.",
      "That is what water knows.",
      "Long before maps were trusted, people followed the sea into the unknown. They sailed past familiar shores because something in them believed discovery lived beyond the horizon.",
      "But the oldest voyage was never across the water.",
      "It was through it.",
      "A person may cross every ocean and still remain a stranger to themselves. They may name islands, chart stars, survive storms, and return with gold in their hands, yet never once look into the dark mirror beneath the ship.",
      "Water remembers what the traveler forgets.",
      "It shows the face, then the fear behind the face. It shows the wound, then the tenderness guarding it. It shows the self not as a fixed thing, but as a current becoming.",
      "To become like water is not to disappear.",
      "It is to stop mistaking hardness for power.",
      "It is to move with enough truth that no cage can keep its original shape around you.",
      "When the candle went out, something small rested at the bottom of the basin.",
      "A key, dark as midnight glass.",
      "It had no teeth.",
      "Only a reflection."
    ],
    // The acrostic is intentionally left unstyled in the journal body; the clue
    // should live in the text structure, not in visual highlighting.
    acrosticLines: [
      "Water does not show you the world by keeping still.",
      "It shows you what moves when you finally look.",
      "The sailor crosses oceans seeking new shores.",
      "Home waits beneath the face in the tide.",
      "In every reflection, a door opens inward.",
      "Nothing is farther than the self we avoid."
    ]
  }
];

const shelvesFilterOptions = [
  { id: "all", label: "All" },
  { id: "journals", label: "Journals" },
  { id: "manuscripts", label: "Manuscripts" },
  { id: "letters", label: "Letters" },
  { id: "cryptic-codes", label: "Cryptic Codes" },
  { id: "fragments", label: "Fragments" },
  { id: "blood-moon", label: "Blood Moon" },
  { id: "the-veil", label: "The Veil" }
];

const shelvesBrowseCards = [
  {
    id: "journals",
    title: "Recovered Journals",
    description: "Personal journals and recovered diary fragments.",
    filter: "journals",
    activeFilter: "journals"
  },
  {
    id: "manuscripts",
    title: "Manuscripts",
    description: "Scholarly works, occult treatises, and unknown authorial texts.",
    filter: "manuscripts",
    activeFilter: "manuscripts"
  },
  {
    id: "letters",
    title: "Letters",
    description: "Correspondence, messages, and sealed letters.",
    filter: "letters",
    activeFilter: "letters"
  },
  {
    id: "cryptic_codes",
    title: "Cipher Shelf",
    description: "Encoded texts, cryptograms, and unresolved ciphers.",
    filter: "cryptic_codes",
    activeFilter: "cryptic-codes"
  },
  {
    id: "unstable_texts",
    title: "Unstable Texts",
    description: "Writings corrupted by ink shifts, time, or unknown influence.",
    filter: "unstable_texts",
    activeFilter: "fragments"
  },
  {
    id: "veil_lore",
    title: "Veil Lore",
    description: "Fragments dealing with the Veil, its watchers, and beyond.",
    filter: "veil_lore",
    activeFilter: "the-veil"
  }
];

const shelvesFindingAids = [
  {
    id: "shelf-index",
    title: "Shelf Index",
    description: "Browse by shelf mark and classification.",
    action: "Open Index",
    image: "assets/images/noctis/shelf_index.png"
  },
  {
    id: "code-ledger",
    title: "Code Ledger",
    description: "Track cipher keys, coded phrases, and recovered symbols.",
    action: "Open Ledger",
    image: "assets/images/noctis/code_ledger.png"
  },
  {
    id: "cross-references",
    title: "Cross-References",
    description: "Find connections between documents, authors, rooms, and events.",
    action: "Explore",
    image: "assets/images/noctis/cross_reference.png"
  },
  {
    id: "recent-discoveries",
    title: "Recent Discoveries",
    description: "The latest records and pieces recovered from the Archive.",
    action: "View New",
    image: "assets/images/noctis/recent_discoveries.png"
  }
];

const shelvesResearchTrails = [
  {
    id: "blood-moon",
    title: "Blood Moon",
    description: "Writings and records tied to the crimson cycle.",
    terms: ["blood moon", "blood_moon", "bloodmoon", "crimson cycle", "crimson"]
  },
  {
    id: "the-veil",
    title: "The Veil",
    description: "Studies of the barrier, the in-between, and beyond.",
    terms: ["the veil", "veil", "barrier", "in-between", "in between", "beyond"]
  },
  {
    id: "astral-lore",
    title: "Astral Lore",
    description: "Fragments concerning the stars, realms, and others.",
    terms: ["astral lore", "astral", "stars", "star", "realms", "realm", "others"]
  },
  {
    id: "blue-moon",
    title: "Blue Moon",
    description: "Records touched by rare lunar crossings and quiet thresholds.",
    terms: ["blue moon", "blue_moon", "bluemoon", "rare moon", "threshold"]
  },
  {
    id: "zephyra-noctis",
    title: "Zephyra Noctis",
    description: "Documents connected to Zephyra's hand, voice, or legacy.",
    terms: ["zephyra noctis", "zephyra"]
  },
  {
    id: "memory",
    title: "Memory",
    description: "Fragments concerned with remembrance, forgetting, and return.",
    terms: ["memory", "memories", "remember", "remembrance", "forgetting", "forgotten"]
  },
  {
    id: "tides",
    title: "Tides",
    description: "Writings drawn toward water, currents, and inward voyages.",
    terms: ["tides", "tide", "water", "sea", "ocean", "current"]
  },
  {
    id: "codes",
    title: "Codes",
    description: "Ciphered phrases, symbols, keys, and unresolved patterns.",
    terms: ["codes", "code", "cipher", "ciphers", "symbol", "symbols", "key"]
  },
  {
    id: "maps",
    title: "Maps",
    description: "Routes, drawers, charts, and records of hidden places.",
    terms: ["maps", "map", "drawer", "route", "routes", "chart", "charts"]
  },
  {
    id: "recovered-journals",
    title: "Recovered Journals",
    description: "Personal fragments and diary leaves recovered from the stacks.",
    terms: ["recovered journal", "journal", "journals", "diary", "fragment"]
  },
  {
    id: "unknown-hands",
    title: "Unknown Hands",
    description: "Records whose authorship is obscured, disputed, or missing.",
    terms: ["unknown hand", "unknown hands", "unknown author", "unattributed", "anonymous"]
  }
];

const galleryVisualRecords = [
  {
    id: "trio-study",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/trio-study.webp",
    width: 1120,
    height: 1400,
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "castle-black",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/castle-black.webp",
    width: 1400,
    height: 1050,
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "ufo-landing",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/ufo-landing.webp",
    width: 1400,
    height: 1050,
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "the-veil-trine",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    width: 1120,
    height: 1400,
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "lost-city",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/lost-city.webp",
    width: 1400,
    height: 1052,
    caption: "The Archive has recovered the image, but not its name."
  }
];

const galleryCategoryPlaceholders = [
  ["All Records"],
  ["Portraits"],
  ["Places"],
  ["Symbols"],
  ["Maps"],
  ["Anomalies"],
  ["Unknown Records"],
  ["Recovered"]
];

const galleryStatsPlaceholders = [
  ["128", "Total Records"],
  ["43", "Fragments Missing"],
  ["17", "Sealed"],
  ["9", "Refuse to Name"]
];

const galleryQuickLinks = [
  ["Featured Images", "Curated by the Archive", "6"],
  ["Newly Recovered", "Latest additions", "8"],
  ["Blood Moon Records", "Touched by the cycle", "10"]
];

const GALLERY_RECORDS_PER_SET = 10;
const gallerySortOptions = ["Newest", "Oldest", "A-Z", "Recovered First", "Unknown First"];

const galleryRecordPlaceholders = [
  {
    id: "glr-prt-017",
    title: "Sealed Portrait No. 17",
    category: "Portraits",
    image: "assets/images/noctis/visual-records/trio-study.webp",
    marked: true,
    recovered: true,
    variant: "portrait"
  },
  {
    id: "glr-sym-004",
    title: "Astral Seal / Symbol Record",
    category: "Symbols",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    marked: true,
    recovered: true,
    variant: "square"
  },
  {
    id: "glr-plc-009",
    title: "Watcher Estate Landscape",
    category: "Places",
    image: "assets/images/noctis/visual-records/castle-black.webp",
    recovered: true,
    variant: "wide"
  },
  {
    id: "glr-unk-001",
    title: "Unknown Visual Record 01",
    category: "Unknown Records",
    image: "assets/images/noctis/visual-records/lost-city.webp",
    sealed: true,
    fragments: "2 / 4 fragments recovered",
    progress: 50,
    variant: "fragment"
  },
  {
    id: "glr-anm-004",
    title: "Blood Moon Eclipse",
    category: "Anomalies",
    image: "assets/images/noctis/visual-records/ufo-landing.webp",
    recovered: true
  },
  {
    id: "glr-sym-008",
    title: "Winged Statue / Watcher Record",
    category: "Symbols",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    variant: "tall"
  },
  {
    id: "glr-prt-022",
    title: "Red Veiled Portrait",
    category: "Portraits",
    image: "assets/images/noctis/visual-records/trio-study.webp",
    marked: true,
    recovered: true,
    variant: "featured-small"
  },
  {
    id: "glr-anm-012",
    title: "Chalice / Impossible Reflection",
    category: "Anomalies",
    image: "assets/images/noctis/visual-records/ufo-landing.webp",
    recovered: true
  },
  {
    id: "glr-map-003",
    title: "Map / Diagram Record",
    category: "Maps",
    image: "assets/images/noctis/visual-records/lost-city.webp",
    variant: "featured-small"
  },
  {
    id: "glr-sym-017",
    title: "Red Sigil / Seal Record",
    category: "Symbols",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    marked: true,
    variant: "square"
  },
  {
    id: "glr-prt-031",
    title: "Portrait of the Veiled Scribe",
    category: "Portraits",
    image: "assets/images/noctis/visual-records/trio-study.webp",
    recovered: true,
    variant: "portrait"
  },
  {
    id: "glr-plc-014",
    title: "The Observatory Before Rain",
    category: "Places",
    image: "assets/images/noctis/visual-records/castle-black.webp",
    variant: "square"
  },
  {
    id: "glr-anm-019",
    title: "Doorway in the Red Sky",
    category: "Anomalies",
    image: "assets/images/noctis/visual-records/ufo-landing.webp",
    marked: true,
    variant: "wide"
  },
  {
    id: "glr-unk-007",
    title: "Unknown Visual Record 07",
    category: "Unknown Records",
    image: "assets/images/noctis/visual-records/lost-city.webp",
    sealed: true,
    fragments: "1 / 5 fragments recovered",
    progress: 20,
    variant: "fragment"
  },
  {
    id: "glr-map-011",
    title: "Cartographer's Warning",
    category: "Maps",
    image: "assets/images/noctis/visual-records/lost-city.webp",
    recovered: true
  },
  {
    id: "glr-sym-025",
    title: "Aster Gate Marking",
    category: "Symbols",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    variant: "tall"
  },
  {
    id: "glr-prt-038",
    title: "The Watcher Who Blinked",
    category: "Portraits",
    image: "assets/images/noctis/visual-records/trio-study.webp",
    marked: true,
    variant: "featured-small"
  },
  {
    id: "glr-plc-021",
    title: "Lost Stair Beneath the Gallery",
    category: "Places",
    image: "assets/images/noctis/visual-records/castle-black.webp",
    recovered: true
  },
  {
    id: "glr-anm-030",
    title: "The Moon Appears Twice",
    category: "Anomalies",
    image: "assets/images/noctis/visual-records/ufo-landing.webp",
    variant: "featured-small"
  },
  {
    id: "glr-sym-033",
    title: "Red Archive Diagram",
    category: "Symbols",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    recovered: true,
    variant: "square"
  },
  {
    id: "glr-map-018",
    title: "Map of the Sealed Coast",
    category: "Maps",
    image: "assets/images/noctis/visual-records/lost-city.webp",
    marked: true,
    variant: "portrait"
  },
  {
    id: "glr-unk-013",
    title: "Unknown Visual Record 13",
    category: "Unknown Records",
    image: "assets/images/noctis/visual-records/castle-black.webp",
    sealed: true,
    fragments: "3 / 6 fragments recovered",
    progress: 50,
    variant: "square"
  },
  {
    id: "glr-plc-027",
    title: "Courtyard of Red Lanterns",
    category: "Places",
    image: "assets/images/noctis/visual-records/castle-black.webp",
    recovered: true,
    variant: "wide"
  },
  {
    id: "glr-anm-044",
    title: "Static Figure at the Horizon",
    category: "Anomalies",
    image: "assets/images/noctis/visual-records/ufo-landing.webp",
    variant: "fragment"
  },
  {
    id: "glr-prt-046",
    title: "Mirror Portrait Fragment",
    category: "Portraits",
    image: "assets/images/noctis/visual-records/trio-study.webp",
    recovered: true
  },
  {
    id: "glr-sym-052",
    title: "Sixfold Blood Star",
    category: "Symbols",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    marked: true,
    variant: "tall"
  },
  {
    id: "glr-map-029",
    title: "Unlabeled Vault Map",
    category: "Maps",
    image: "assets/images/noctis/visual-records/lost-city.webp",
    variant: "featured-small"
  },
  {
    id: "glr-plc-035",
    title: "The Watcher's Estate",
    category: "Places",
    image: "assets/images/noctis/visual-records/castle-black.webp",
    recovered: true
  },
  {
    id: "glr-unk-021",
    title: "Unknown Visual Record 21",
    category: "Unknown Records",
    image: "assets/images/noctis/visual-records/ufo-landing.webp",
    sealed: true,
    fragments: "0 / 4 fragments recovered",
    progress: 8,
    variant: "featured-small"
  },
  {
    id: "glr-sym-061",
    title: "Seal of the Returning Moon",
    category: "Symbols",
    image: "assets/images/noctis/visual-records/the-veil-trine.webp",
    recovered: true,
    variant: "square"
  }
];

const galleryBottomSections = [
  {
    title: "Recently Viewed",
    rows: [
      ["The Watchers at Veilfall", "Viewed just now"],
      ["She Who Remembers", "Viewed 12 min ago"],
      ["The Hollow Before Dawn", "Viewed 1 hour ago"]
    ]
  },
  {
    title: "Marked Records",
    rows: [
      ["The Astrolabe of Noctis", "Marked yesterday"],
      ["Bound in Silence", "Marked 3 days ago"],
      ["The Whispering Vial", "Marked 5 days ago"]
    ]
  },
  {
    title: "Visual Trails",
    rows: [
      ["The Blood Cycle", "7 records"],
      ["The Veil's Edge", "5 records"],
      ["The Forgotten Keepers", "9 records"]
    ]
  }
];

// Chamber metadata that belongs to the viewer rather than the room registry itself.
// Future unlock systems can extend archiveRooms while these fields keep the info panel readable.
const archiveRoomDetails = {
  "entry-desk": {
    tags: ["Records", "Clues", "Relics", "Notes"],
    contains: "Archive notes, loose files, early clues, and recovered objects.",
    accessNotes: "Open. This chamber can be entered while the Noctis Archive is available.",
    archiveHint: "Begin where the papers gather. Small discoveries tend to arrive first."
  },
  shelves: {
    tags: ["Manuscripts", "Letters", "Journals", "Texts"],
    contains: "Journals, manuscripts, strange writings, letters, and unstable accounts.",
    accessNotes: "Open. The shelves are prepared for future writings and recovered documents.",
    archiveHint: "Some pages wait for a hand before they remember their language."
  },
  gallery: {
    tags: ["Visuals", "Portraits", "Symbols", "Evidence"],
    contains: "Recovered images, portraits, diagrams, symbols, and visual records.",
    accessNotes: "Open. Visual records can be catalogued here as they surface.",
    archiveHint: "Look twice at anything preserved behind dark glass."
  },
  "restricted-wing": {
    tags: ["Restricted", "Redacted", "Files", "Clearance"],
    contains: "Classified studies, redacted records, sealed files, and protected research.",
    accessNotes: "Restricted. The archive does not recognize your clearance.",
    archiveHint: "The redactions are part of the lock."
  },
  "memory-vault": {
    tags: ["Memory", "Fragments", "Cipher", "Recovery"],
    contains: "Future memory fragments, ciphers, codes, audio fragments, and mixed media.",
    accessNotes: "Locked. The vault requires something not yet recovered.",
    archiveHint: "A missing piece is still shaping the door."
  },
  "inner-chamber": {
    tags: ["Sealed", "Deep Archive", "Secrets", "Late Stage"],
    contains: "Late-stage archive revelations and deeper discoveries reserved for future progression.",
    accessNotes: "Sealed. This room is indexed, but unreachable.",
    archiveHint: "A listed room is not always an available room."
  },
  "veiled-gate": {
    tags: ["Gate", "Path", "Portal", "Sealed"],
    contains: "A future passage to an unknown destination or deeper experience.",
    accessNotes: "Locked. This room does not open from this side.",
    archiveHint: "No destination is recorded. No entry path is visible."
  }
};

////////////////////////////////////////////////////
// Noctis Archive Chamber Helpers
////////////////////////////////////////////////////

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// The archive page is event-gated; Blood Moon state controls whether the room hub is visible.
function isArchiveUnlocked() {
  return window.AstralVeilBloodMoonAccess
    ? window.AstralVeilBloodMoonAccess.hasBloodMoonAccess()
    : Boolean(window.AstralVeilEvents?.isEventActive("bloodMoon"));
}

function getArchiveRooms() {
  return typeof archiveRooms === "undefined" ? [] : archiveRooms;
}

function getRoomById(roomId) {
  return getArchiveRooms().find((room) => room.id === roomId) || null;
}

function getRoomInitial(room) {
  return String(room.title || "")
    .replace(/^the\s+/i, "")
    .trim()
    .slice(0, 1);
}

function getRoomImageAlt(room) {
  return `${room.title} chamber inside the Noctis Archive`;
}

function getRoomSubtitle(room) {
  const subtitles = {
    "entry-desk": "The threshold of the unseen",
    shelves: "Fragments sorted by unknown hands",
    gallery: "Recovered objects and silent echoes",
    "restricted-wing": "For what must be taken back",
    "memory-vault": "Reflections that do not lie",
    "inner-chamber": "Names the deeper archive keeps",
    "veiled-gate": "Beyond this, even names forget"
  };

  return subtitles[room.id] || room.intro || room.description;
}

function getRoomStatusClass(room) {
  if (isRoomLocked(room)) {
    return String(getRoomStatus(room) || "locked").toLowerCase().includes("sealed") ? "sealed" : "locked";
  }

  if (String(getRoomStatus(room) || "").toLowerCase().includes("disturbed")) {
    return "disturbed";
  }

  return "open";
}

function getRoomDetails(room) {
  if (room?.id === "restricted-wing" && !isRoomLocked(room)) {
    if (shouldShowGuestRestrictedWingPrompt()) {
      return {
        ...archiveRoomDetails[room.id],
        accessNotes: "The artifacts have answered for now. Create a free account to bind this discovery to your Archive.",
        archiveHint: "The seal recognizes the keys, but not yet the keeper."
      };
    }

    return {
      ...archiveRoomDetails[room.id],
      accessNotes: "The artifacts have opened the seal. The Wing is not ready to reveal what waits inside.",
      archiveHint: "The artifacts remain bound to your archive."
    };
  }

  if (room?.id === "memory-vault") {
    return {
      ...archiveRoomDetails[room.id],
      accessNotes: getRoomLockedMessage(room),
      archiveHint: "Memory Vault unlock rule will be added later."
    };
  }

  return archiveRoomDetails[room.id] || {
    tags: [getRoomStatus(room), room.type].filter(Boolean),
    contains: room.description,
    accessNotes: room.isLocked ? room.lockedMessage || "Access withheld." : "Open for exploration.",
    archiveHint: room.intro || room.description
  };
}

function getValidElementalKeyIds(value) {
  const values = Array.isArray(value) ? value : [];

  return [...new Set(values.filter((keyId) => elementalKeys.some((key) => key.id === keyId)))];
}

function clearLegacyArtifactLocalStorage() {
  try {
    localStorage.removeItem(archiveKeyStorageKey);
  } catch (error) {
    return;
  }
}

function getSessionElementalKeys() {
  try {
    return getValidElementalKeyIds(JSON.parse(sessionStorage.getItem(archiveKeySessionStorageKey) || "[]"));
  } catch (error) {
    return [];
  }
}

function saveSessionElementalKeys(unlockedKeys) {
  try {
    sessionStorage.setItem(archiveKeySessionStorageKey, JSON.stringify(getValidElementalKeyIds(unlockedKeys)));
  } catch (error) {
    return;
  }
}

function normalizeRoomStatus(value) {
  const status = String(value || "").toLowerCase();

  if (status.includes("open") || status.includes("visited") || status.includes("unlocked")) {
    return "open";
  }

  if (status.includes("restricted")) {
    return "restricted";
  }

  if (status.includes("sealed")) {
    return "sealed";
  }

  if (status.includes("locked")) {
    return "locked";
  }

  return status || "open";
}

function getRoomProgress(roomKey) {
  return roomProgressState.rooms.get(roomKey) || null;
}

function formatRoomProgressStatus(status) {
  const normalizedStatus = normalizeRoomStatus(status);

  if (normalizedStatus === "open") {
    return "Open";
  }

  return "";
}

function getRoomProgressRows(rows) {
  return new Map((Array.isArray(rows) ? rows : [])
    .filter((row) => row && getRoomById(row.room_key))
    .map((row) => [row.room_key, row]));
}

function isProgressionRoom(roomKey) {
  return roomKey === "memory-vault" || roomKey === "restricted-wing";
}

async function loadArtifactProgress() {
  clearLegacyArtifactLocalStorage();

  try {
    const [{ getCurrentUser }, { getSupabaseClient, isSupabaseConfigured }] = await Promise.all([
      import("../src/services/auth.js"),
      import("../src/services/supabase-client.js")
    ]);

    if (!isSupabaseConfigured()) {
      artifactProgressState.unlockedKeys = getSessionElementalKeys();
      artifactProgressState.isLoaded = true;
      roomProgressState.rooms = new Map();
      roomProgressState.isLoaded = true;
      return;
    }

    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
      artifactProgressState.user = null;
      artifactProgressState.supabase = null;
      artifactProgressState.unlockedKeys = getSessionElementalKeys();
      artifactProgressState.isLoaded = true;
      roomProgressState.user = null;
      roomProgressState.supabase = null;
      roomProgressState.rooms = new Map();
      roomProgressState.isLoaded = true;
      return;
    }

    const supabase = getSupabaseClient();
    const [{ data, error }, { data: roomData, error: roomError }] = await Promise.all([
      supabase
        .from("user_artifacts")
        .select("artifact_key")
        .eq("user_id", user.id),
      supabase
        .from("user_rooms")
        .select("room_key, status, unlock_method, source_location, metadata, unlocked_at, updated_at")
        .eq("user_id", user.id)
    ]);

    artifactProgressState.user = user;
    artifactProgressState.supabase = supabase;
    artifactProgressState.unlockedKeys = error
      ? []
      : getValidElementalKeyIds((data || []).map((artifact) => artifact.artifact_key));
    artifactProgressState.isLoaded = true;
    roomProgressState.user = user;
    roomProgressState.supabase = supabase;
    roomProgressState.rooms = roomError ? new Map() : getRoomProgressRows(roomData);
    roomProgressState.isLoaded = true;
  } catch (error) {
    artifactProgressState.user = null;
    artifactProgressState.supabase = null;
    artifactProgressState.unlockedKeys = getSessionElementalKeys();
    artifactProgressState.isLoaded = true;
    roomProgressState.user = null;
    roomProgressState.supabase = null;
    roomProgressState.rooms = new Map();
    roomProgressState.isLoaded = true;
  }
}

async function loadShelvesDocuments() {
  if (shelvesDocumentsLoaded || shelvesDocumentsLoading) {
    return;
  }

  shelvesDocumentsLoading = true;
  shelvesDocumentsError = "";

  try {
    const { getSupabaseClient, isSupabaseConfigured } = await import("../src/services/supabase-client.js");

    if (!isSupabaseConfigured()) {
      shelvesDocumentsError = "Noctis documents are using local fallback records.";
      return;
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("noctis_documents")
      .select("*")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    shelvesDocuments = Array.isArray(data) ? data : [];
    shelvesDocumentsError = shelvesDocuments.length
      ? ""
      : "No published Noctis documents found yet. Showing a local recovered fragment.";
  } catch (error) {
    console.warn("[Astral Veil archive] Noctis documents could not be loaded.", error);
    shelvesDocumentsError = "Noctis documents could not be loaded. Showing local recovered fragments.";
  } finally {
    shelvesDocumentsLoaded = true;
    shelvesDocumentsLoading = false;

    if (isNoctisRoomPage && getNoctisRoomFromQuery()?.id === "shelves") {
      renderNoctisRoomByQuery();
    }
  }
}

function getGalleryRecordCategoryLabel(record) {
  const type = normalizeGalleryValue(record?.record_type || record?.recordType || record?.category || "");
  const status = normalizeGalleryValue(record?.status || "");

  if (status === "recovered" || recordHasGalleryTag(record, "recovered")) {
    return "Recovered";
  }

  if (status === "unknown" || status === "unnamed" || recordHasGalleryTag(record, "unknown records")) {
    return "Unknown Records";
  }

  if (type === "portrait" || recordHasGalleryTag(record, "portrait") || recordHasGalleryTag(record, "portraits")) {
    return "Portraits";
  }

  if (type === "place" || type === "location" || recordHasGalleryTag(record, "place") || recordHasGalleryTag(record, "places")) {
    return "Places";
  }

  if (type === "symbol" || type === "seal" || recordHasGalleryTag(record, "symbol") || recordHasGalleryTag(record, "symbols")) {
    return "Symbols";
  }

  if (type === "map" || recordHasGalleryTag(record, "map") || recordHasGalleryTag(record, "maps")) {
    return "Maps";
  }

  if (type === "anomaly" || recordHasGalleryTag(record, "anomaly") || recordHasGalleryTag(record, "anomalies")) {
    return "Anomalies";
  }

  return "All Records";
}

function formatGalleryRecordType(record) {
  const type = String(record?.record_type || record?.recordType || record?.category || "Visual Record")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .trim();

  return type
    ? type.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Visual Record";
}

function normalizeGalleryRecord(row, index = 0) {
  const image = row?.preview_image_url || row?.full_image_url || "";
  const type = String(row?.record_type || "").toLowerCase();
  const status = normalizeGalleryValue(row?.status || "");

  return {
    ...row,
    id: row?.id || row?.slug || `gallery-record-${index + 1}`,
    title: row?.title || row?.unknown_title || "Unknown Visual Record",
    category: getGalleryRecordCategoryLabel(row),
    image,
    fullImage: row?.full_image_url || image,
    previewImage: row?.preview_image_url || image,
    recordType: row?.record_type || "visual_record",
    record_type: row?.record_type || "visual_record",
    origin: row?.origin || "Noctis Archive",
    status: row?.status || "available",
    relatedRoom: row?.related_room || "The Gallery",
    related_room: row?.related_room || "The Gallery",
    slug: row?.slug || "",
    tags: Array.isArray(row?.tags) ? row.tags : [],
    themes: Array.isArray(row?.themes) ? row.themes : [],
    recovered: status === "recovered" || recordHasGalleryTag(row, "recovered"),
    sealed: Boolean(row?.is_fragmented) || status === "unknown",
    marked: Boolean(row?.is_featured),
    variant: type === "portrait"
      ? "portrait"
      : type === "map" || type === "symbol"
        ? "square"
        : type === "anomaly"
          ? "fragment"
          : ""
  };
}

function getGalleryImageErrorHandler(imageUrl) {
  return `console.warn('Gallery image failed to load:', '${escapeHtml(imageUrl)}')`;
}

function getVisualTrailImageErrorHandler(imageUrl) {
  return `console.warn('Visual trail image failed to load:', '${escapeHtml(imageUrl)}');this.closest('.gallery-trail-restored, .gallery-trail-lightbox__figure')?.classList.add('is-image-missing');`;
}

async function fetchGalleryRecordsFromSupabase(supabase) {
  const selectedFields = [
    "id",
    "title",
    "slug",
    "description",
    "lore_note",
    "record_type",
    "origin",
    "status",
    "preview_image_url",
    "full_image_url",
    "is_featured",
    "is_active",
    "sort_order",
    "tags",
    "themes",
    "related_room",
    "created_at"
  ].join(",");
  const result = await supabase
    .from("gallery_records")
    .select(selectedFields)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (result.error) {
    console.warn("Gallery records failed to load:", {
      message: result.error?.message,
      details: result.error?.details,
      hint: result.error?.hint,
      code: result.error?.code,
      error: result.error
    });
    console.warn("[Astral Veil archive] gallery_records query failed.", {
      table: "gallery_records",
      selectedFields,
      filter: "is_active = true",
      order: "sort_order asc",
      error: result.error
    });
  }

  return result;
}

async function loadGalleryRecords() {
  if (galleryRecordsLoaded || galleryRecordsLoading) {
    if (galleryRecordsLoaded && !galleryUserState.isLoaded && !galleryUserState.isLoading) {
      await loadGalleryUserInteractions();

      if (isNoctisRoomPage && getNoctisRoomFromQuery()?.id === "gallery") {
        renderNoctisRoomByQuery();
      }
    }

    return;
  }

  galleryRecordsLoading = true;
  galleryRecordsError = "";

  try {
    const { getSupabaseClient, isSupabaseConfigured } = await import("../src/services/supabase-client.js");

    if (!isSupabaseConfigured()) {
      galleryRecordsError = "Gallery records are using local fallback images.";
      galleryRecordsUseFallback = true;
      return;
    }

    const supabase = getSupabaseClient();
    const { data, error } = await fetchGalleryRecordsFromSupabase(supabase);

    if (error) {
      throw error;
    }

    galleryRecords = Array.isArray(data)
      ? data.map((record, index) => normalizeGalleryRecord(record, index))
      : [];
    galleryRecordsUseFallback = false;
    galleryRecordsError = galleryRecords.length ? "" : "No visual records answered from the dark.";
    console.info("Gallery records loaded:", galleryRecords.length, galleryRecords.map((record) => ({
      title: record.title,
      record_type: record.record_type,
      status: record.status,
      tags: record.tags,
      themes: record.themes
    })));
  } catch (error) {
    console.warn("Gallery records failed to load:", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      error
    });
    console.warn("[Astral Veil archive] Gallery records could not be loaded. Falling back to local records.", {
      table: "gallery_records",
      likelyCauses: "Check table existence, selected columns, RLS public SELECT policy for is_active records, and seed data.",
      error
    });
    galleryRecords = [];
    galleryRecordsUseFallback = true;
    galleryRecordsError = "Gallery records could not be loaded. Showing local fallback records.";
  } finally {
    galleryRecordsLoaded = true;
    galleryRecordsLoading = false;
    await loadGalleryUserInteractions();

    if (isNoctisRoomPage && getNoctisRoomFromQuery()?.id === "gallery") {
      galleryRecordSetIndex = 0;
      renderNoctisRoomByQuery();
    }
  }
}

async function loadShelvesSavedDocuments({ force = false } = {}) {
  if (shelvesSavedDocumentsState.isLoading || (shelvesSavedDocumentsState.isLoaded && !force)) {
    return;
  }

  shelvesSavedDocumentsState.user = artifactProgressState.user;
  shelvesSavedDocumentsState.supabase = artifactProgressState.supabase;
  shelvesSavedDocumentsState.notice = "";
  shelvesSavedDocumentsState.error = "";

  if (!shelvesSavedDocumentsState.user || !shelvesSavedDocumentsState.supabase) {
    shelvesSavedDocumentsState.savedIds = new Set();
    shelvesSavedDocumentsState.savedAt = new Map();
    shelvesSavedDocumentsState.isLoaded = true;
    return;
  }

  shelvesSavedDocumentsState.isLoading = true;

  try {
    const { data, error } = await shelvesSavedDocumentsState.supabase
      .from("user_noctis_saved_documents")
      .select("document_id, created_at")
      .eq("user_id", shelvesSavedDocumentsState.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = Array.isArray(data) ? data : [];
    shelvesSavedDocumentsState.savedIds = new Set(rows.map((row) => String(row.document_id)));
    shelvesSavedDocumentsState.savedAt = new Map(rows.map((row) => [String(row.document_id), row.created_at]));
    shelvesSavedDocumentsState.isLoaded = true;
  } catch (error) {
    console.warn("[Astral Veil archive] Saved Noctis documents could not be loaded.", error);
    shelvesSavedDocumentsState.savedIds = new Set();
    shelvesSavedDocumentsState.savedAt = new Map();
    shelvesSavedDocumentsState.error = "Saved documents could not be loaded.";
    shelvesSavedDocumentsState.isLoaded = true;
  } finally {
    shelvesSavedDocumentsState.isLoading = false;

    if (isNoctisRoomPage && getNoctisRoomFromQuery()?.id === "shelves") {
      renderNoctisRoomByQuery();
    }
  }
}

function isShelvesDocumentSaved(document) {
  return Boolean(document?.id && shelvesSavedDocumentsState.savedIds.has(String(document.id)));
}

function setShelvesSavedNotice(message, tone = "info") {
  shelvesSavedDocumentsState.notice = message ? { message, tone } : "";
}

async function saveShelvesDocument(documentId) {
  const document = getShelvesDocumentById(documentId);

  if (!document) {
    return;
  }

  if (!shelvesSavedDocumentsState.user || !shelvesSavedDocumentsState.supabase) {
    setShelvesSavedNotice("Sign in to save documents to your Notable Documents.", "info");
    renderCurrentArchiveSurface();
    return;
  }

  if (!document.id) {
    setShelvesSavedNotice("This local fallback record cannot be saved yet.", "error");
    renderCurrentArchiveSurface();
    return;
  }

  const databaseDocumentId = String(document.id);

  if (shelvesSavedDocumentsState.savedIds.has(databaseDocumentId)) {
    setShelvesSavedNotice("Already saved to Notable Documents.", "success");
    renderCurrentArchiveSurface();
    return;
  }

  shelvesSavedDocumentsState.pendingIds.add(databaseDocumentId);
  setShelvesSavedNotice("");
  renderCurrentArchiveSurface();

  try {
    const { error } = await shelvesSavedDocumentsState.supabase
      .from("user_noctis_saved_documents")
      .insert({
        user_id: shelvesSavedDocumentsState.user.id,
        document_id: databaseDocumentId
      });

    if (error && error.code !== "23505") {
      throw error;
    }

    shelvesSavedDocumentsState.savedIds.add(databaseDocumentId);
    shelvesSavedDocumentsState.savedAt.set(databaseDocumentId, new Date().toISOString());
    setShelvesSavedNotice("Saved to Notable Documents.", "success");
  } catch (error) {
    console.warn("[Astral Veil archive] Noctis document could not be saved.", error);
    setShelvesSavedNotice("This document could not be saved. Try again in a moment.", "error");
  } finally {
    shelvesSavedDocumentsState.pendingIds.delete(databaseDocumentId);
    renderCurrentArchiveSurface();
  }
}

async function unsaveShelvesDocument(documentId) {
  const document = getShelvesDocumentById(documentId);

  if (!document?.id || !shelvesSavedDocumentsState.user || !shelvesSavedDocumentsState.supabase) {
    setShelvesSavedNotice("Sign in to manage Notable Documents.", "info");
    renderCurrentArchiveSurface();
    return;
  }

  const databaseDocumentId = String(document.id);

  if (!shelvesSavedDocumentsState.savedIds.has(databaseDocumentId)) {
    return;
  }

  shelvesSavedDocumentsState.pendingIds.add(databaseDocumentId);
  setShelvesSavedNotice("");
  renderCurrentArchiveSurface();

  try {
    const { error } = await shelvesSavedDocumentsState.supabase
      .from("user_noctis_saved_documents")
      .delete()
      .eq("user_id", shelvesSavedDocumentsState.user.id)
      .eq("document_id", databaseDocumentId);

    if (error) {
      throw error;
    }

    shelvesSavedDocumentsState.savedIds.delete(databaseDocumentId);
    shelvesSavedDocumentsState.savedAt.delete(databaseDocumentId);
    setShelvesSavedNotice("Removed from Notable Documents.", "success");
  } catch (error) {
    console.warn("[Astral Veil archive] Noctis document could not be removed.", error);
    setShelvesSavedNotice("This document could not be removed. Try again in a moment.", "error");
  } finally {
    shelvesSavedDocumentsState.pendingIds.delete(databaseDocumentId);
    renderCurrentArchiveSurface();
  }
}

async function saveRoomProgress(roomKey, { status = "open", unlockMethod = "room_entry", sourceLocation = "Noctis Archive", metadata = {} } = {}) {
  const room = getRoomById(roomKey);

  if (!room || !isProgressionRoom(roomKey) || !roomProgressState.isLoaded) {
    return { status: "skipped" };
  }

  const normalizedStatus = normalizeRoomStatus(status);
  const existingProgress = getRoomProgress(roomKey);
  const nextProgress = {
    ...existingProgress,
    user_id: roomProgressState.user?.id || null,
    room_key: roomKey,
    status: normalizedStatus,
    unlock_method: unlockMethod,
    source_location: sourceLocation,
    metadata: {
      ...(existingProgress?.metadata || {}),
      room_title: room.title || "",
      room_type: room.type || "",
      room_status: getRoomStatus(room),
      ...metadata
    },
    updated_at: new Date().toISOString()
  };

  if (!roomProgressState.user || !roomProgressState.supabase) {
    return { status: "skipped" };
  }

  const payload = {
    user_id: roomProgressState.user.id,
    room_key: roomKey,
    status: normalizedStatus,
    unlock_method: unlockMethod,
    source_location: sourceLocation,
    metadata: nextProgress.metadata,
    updated_at: nextProgress.updated_at
  };

  if (!existingProgress?.unlocked_at && normalizedStatus === "open") {
    payload.unlocked_at = nextProgress.updated_at;
  }

  const query = roomProgressState.supabase.from("user_rooms");
  const { error } = existingProgress
    ? await query.update(payload).eq("user_id", roomProgressState.user.id).eq("room_key", roomKey)
    : await query.insert(payload);

  if (error) {
    const isDuplicate = error.code === "23505" || /duplicate|unique/i.test(error.message || "");

    if (isDuplicate) {
      const { error: updateError } = await roomProgressState.supabase
        .from("user_rooms")
        .update(payload)
        .eq("user_id", roomProgressState.user.id)
        .eq("room_key", roomKey);

      if (updateError) {
        return { status: "error", error: updateError };
      }
    } else {
      return { status: "error", error };
    }
  }

  roomProgressState.rooms.set(roomKey, nextProgress);
  return { status: "saved" };
}

function trackArchiveRoomVisit(room, metadata = {}) {
  if (!room) {
    return Promise.resolve();
  }

  return import("../src/public/progression.js")
    .then(({ trackRoomVisit }) => trackRoomVisit({
      roomKey: room.id,
      roomName: room.title,
      title: room.title,
      description: room.description || "",
      archiveType: "noctis",
      mode: "bloodmoon",
      metadata: {
        room_type: room.type || "",
        room_status: getRoomStatus(room),
        ...metadata
      }
    }))
    .catch((error) => {
      console.warn("[Astral Veil progression] Noctis room visit was not tracked.", error);
    });
}

function trackArchiveDiscovery(discovery = {}) {
  import("../src/public/progression.js")
    .then(({ trackDiscovery }) => trackDiscovery({
      archiveType: "noctis",
      mode: "bloodmoon",
      ...discovery,
      metadata: {
        archive_room: selectedArchiveRoomId || "entry-desk",
        ...(discovery.metadata || {})
      }
    }))
    .catch((error) => {
      console.warn("[Astral Veil progression] Discovery was not tracked.", error);
    });
}

function trackArtifactDiscovery(keyId) {
  const artifact = elementalKeys.find((key) => key.id === keyId);

  if (!artifact || !isLoggedInArchiveUser()) {
    return;
  }

  const elementName = artifact.name || artifact.element || keyId;

  trackArchiveDiscovery({
    discoveryKey: `artifact_${keyId}_unlocked`,
    title: `${elementName} Artifact Recovered`,
    description: artifact.archiveNote || artifact.description || artifact.shortDescription || "",
    category: "artifact",
    metadata: {
      artifact_key: artifact.id,
      artifact_title: artifact.title || "",
      artifact_element: artifact.element || ""
    }
  });
}

function trackRestrictedWingSealDiscovery() {
  if (!isLoggedInArchiveUser()) {
    return;
  }

  import("../src/public/profile-unlocks.js")
    .then(({ grantRestrictedWingProfileRewards }) => grantRestrictedWingProfileRewards())
    .catch((error) => {
      console.warn("[Astral Veil progression] Restricted Wing profile rewards were not granted.", error);
    });

  trackArchiveDiscovery({
    discoveryKey: "restricted_wing_seal_opened",
    title: "Restricted Wing Seal Opened",
    description: "The four artifacts answered, and the seal began to break.",
    category: "room_unlock",
    metadata: {
      required_artifacts: elementalKeyDisplayOrder,
      recovered_artifacts: getUnlockedElementalKeys()
    }
  });
}

function getUnlockedElementalKeys() {
  return getValidElementalKeyIds(artifactProgressState.unlockedKeys);
}

async function saveUnlockedElementalKey(keyId) {
  const previousKeys = getUnlockedElementalKeys();

  if (previousKeys.includes(keyId)) {
    return { status: "duplicate", previousKeys };
  }

  if (!artifactProgressState.user || !artifactProgressState.supabase) {
    artifactProgressState.unlockedKeys = getValidElementalKeyIds([...previousKeys, keyId]);
    saveSessionElementalKeys(artifactProgressState.unlockedKeys);
    return { status: "session", previousKeys };
  }

  const artifact = elementalKeys.find((key) => key.id === keyId);
  const { error } = await artifactProgressState.supabase
    .from("user_artifacts")
    .insert({
      user_id: artifactProgressState.user.id,
      artifact_key: keyId,
      unlock_method: "code_entry",
      source_location: artifact?.recoveredFrom || "Entry Desk",
      metadata: {
        artifact_title: artifact?.title || "",
        artifact_element: artifact?.element || "",
        archive_room: selectedArchiveRoomId || "entry-desk"
      }
    });

  if (error) {
    const isDuplicate = error.code === "23505" || /duplicate|unique/i.test(error.message || "");

    if (isDuplicate) {
      artifactProgressState.unlockedKeys = getValidElementalKeyIds([...previousKeys, keyId]);
      return { status: "duplicate", previousKeys };
    }

    return { status: "error", previousKeys, error };
  }

  artifactProgressState.unlockedKeys = getValidElementalKeyIds([...previousKeys, keyId]);
  trackArtifactDiscovery(keyId);
  return { status: "saved", previousKeys };
}

function isElementalKeyUnlocked(keyId) {
  return getUnlockedElementalKeys().includes(keyId);
}

function areAllElementalKeysRecovered() {
  const unlockedKeys = getUnlockedElementalKeys();

  return elementalKeys.every((key) => unlockedKeys.includes(key.id));
}

function isLoggedInArchiveUser() {
  return Boolean(artifactProgressState.user && artifactProgressState.supabase);
}

function areAllSavedElementalKeysRecovered() {
  return isLoggedInArchiveUser() && areAllElementalKeysRecovered();
}

function shouldShowGuestRestrictedWingPrompt() {
  return !isLoggedInArchiveUser() && areAllElementalKeysRecovered();
}

function getArtifactGatedRooms() {
  return getArchiveRooms().filter((room) => room.id === "restricted-wing");
}

async function saveUnlockedArtifactGatedRooms() {
  if (!areAllSavedElementalKeysRecovered()) {
    return;
  }

  await Promise.all(getArtifactGatedRooms().map((room) => saveRoomProgress(room.id, {
    status: "open",
    unlockMethod: "artifact_progress",
    sourceLocation: "Noctis Archive",
    metadata: {
      required_artifacts: elementalKeyDisplayOrder,
      recovered_artifacts: getUnlockedElementalKeys()
    }
  })));
}

function getMissingElementalKeys() {
  const unlockedKeys = getUnlockedElementalKeys();

  return elementalKeyDisplayOrder
    .map((keyId) => elementalKeys.find((key) => key.id === keyId))
    .filter((key) => key && !unlockedKeys.includes(key.id))
    .map((key) => key.name || key.id);
}

function getElementalKeyProgressText() {
  const recoveredCount = getUnlockedElementalKeys().length;

  return `Recovered relics: ${recoveredCount} of ${elementalKeys.length}`;
}

function getRoomStatus(room) {
  if (room?.id === "restricted-wing" && !isRoomLocked(room)) {
    return "Open";
  }

  if (room && !isRoomLocked(room)) {
    const progressStatus = formatRoomProgressStatus(getRoomProgress(room.id)?.status);

    if (progressStatus) {
      return progressStatus;
    }
  }

  return room?.status || "";
}

function isRoomLocked(room) {
  if (room?.id === "memory-vault") {
    return true;
  }

  if (room?.id === "restricted-wing") {
    return !areAllElementalKeysRecovered();
  }

  return Boolean(room?.isLocked);
}

function getNoctisRoomFromQuery() {
  const roomKey = new URLSearchParams(window.location.search).get("room") || "";

  return getRoomById(roomKey.trim().toLowerCase()) || null;
}

function renderNoctisRoomNotFound() {
  if (noctisRoomType) {
    noctisRoomType.textContent = "Noctis Archive";
  }

  if (noctisRoomTitle) {
    noctisRoomTitle.textContent = "Room Not Found";
  }

  if (noctisRoomCopy) {
    noctisRoomCopy.classList.add("archive-room-placeholder__copy--not-found");
    noctisRoomCopy.textContent = "Choose a valid chamber from the Noctis Archive and return to begin.";
  }

  if (noctisRoomBack) {
    noctisRoomBack.textContent = "Return to Noctis Archive";
    noctisRoomBack.setAttribute("href", "archive.html");
  }

  if (noctisRoomContent) {
    noctisRoomContent.innerHTML = "";
  }
}

function getNoctisRoomHref(roomId) {
  return `noctis-room.html?room=${encodeURIComponent(roomId)}`;
}

function getNoctisRoomNavLockedMessage(room) {
  const status = String(room?.status || "").toLowerCase();

  if (status.includes("sealed") || room?.id === "inner-chamber") {
    return "This chamber is sealed for a later descent.";
  }

  return "The chamber does not answer yet.";
}

function renderNoctisRoomNavbar(currentRoomId = "") {
  if (!noctisRoomNavbar) {
    return;
  }

  const links = noctisRoomNavbarItems.map((item) => {
    const room = getRoomById(item.id);
    const isActive = item.id === currentRoomId;
    const isLocked = !room || isRoomLocked(room);
    const baseClass = `noctis-room-link${isActive ? " is-active" : ""}${isLocked ? " is-locked" : ""}`;

    if (isLocked) {
      return `
        <button
          class="${baseClass}"
          type="button"
          data-room="${escapeHtml(item.id)}"
          data-noctis-room-locked="${escapeHtml(item.id)}"
          data-locked-message="${escapeHtml(getNoctisRoomNavLockedMessage(room))}"
          aria-disabled="true"
          ${isActive ? `aria-current="page"` : ""}
        >
          ${escapeHtml(item.label)}
        </button>
      `;
    }

    return `
      <a
        class="${baseClass}"
        href="${escapeHtml(getNoctisRoomHref(item.id))}"
        data-room="${escapeHtml(item.id)}"
        ${isActive ? `aria-current="page"` : ""}
      >
        ${escapeHtml(item.label)}
      </a>
    `;
  }).join("");

  noctisRoomNavbar.classList.remove("is-open");
  noctisRoomNavbar.innerHTML = `
    <a class="noctis-room-brand" href="archive.html">
      <span class="noctis-room-brand__arrow" aria-hidden="true">‹</span>
      <span>Noctis Archive</span>
    </a>
    <button
      class="noctis-room-menu-toggle"
      type="button"
      aria-label="Open Noctis room menu"
      aria-expanded="false"
      aria-controls="noctisRoomMenu"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
    <nav id="noctisRoomMenu" class="noctis-room-links" aria-label="Noctis rooms">
      ${links}
    </nav>
  `;
  initNoctisRoomNavbar();
}

function shouldRenderRoomAppendices(roomId) {
  return !["entry-desk", "shelves", "gallery", "restricted-wing"].includes(roomId);
}

function closeNoctisRoomNavbarMenu() {
  if (!noctisRoomNavbar) {
    return;
  }

  const toggle = noctisRoomNavbar.querySelector("[data-noctis-room-menu-toggle], .noctis-room-menu-toggle");

  noctisRoomNavbar.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
}

function initNoctisRoomNavbar() {
  if (!noctisRoomNavbar || noctisRoomNavbar.dataset.menuReady === "true") {
    return;
  }

  noctisRoomNavbar.addEventListener("click", (event) => {
    const toggle = event.target.closest(".noctis-room-menu-toggle");

    if (!toggle) {
      return;
    }

    const isOpen = noctisRoomNavbar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!noctisRoomNavbar.classList.contains("is-open") || noctisRoomNavbar.contains(event.target)) {
      return;
    }

    closeNoctisRoomNavbarMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !noctisRoomNavbar.classList.contains("is-open")) {
      return;
    }

    closeNoctisRoomNavbarMenu();
  });

  noctisRoomNavbar.dataset.menuReady = "true";
}

function getNoctisRoomLockedMessage(room) {
  if (room?.id === "restricted-wing" && shouldShowGuestRestrictedWingPrompt()) {
    return "The keys have answered, but this door is not yet fully yours. Sign in and bind your discovery to continue.";
  }

  return getRoomLockedMessage(room);
}

function renderNoctisRoomLockedPanel(room) {
  const extraAction = room?.id === "restricted-wing" && shouldShowGuestRestrictedWingPrompt()
    ? `
      <div class="restricted-wing-ritual__actions">
        <a class="restricted-wing-ritual__button" href="${escapeHtml(getRestrictedWingAuthHref("signup"))}">Create Free Account</a>
        <a class="restricted-wing-ritual__button restricted-wing-ritual__button--secondary" href="${escapeHtml(getRestrictedWingAuthHref("login"))}">Log In</a>
      </div>
    `
    : "";

  return `
    <section class="archive-room-panel archive-room-panel--desk">
      <div class="archive-room-placeholder">
        <p class="archive-entry__stamp">${escapeHtml(room?.subtitle || "Noctis Archive")}</p>
        <h3>${escapeHtml(room?.title || "Room Locked")}</h3>
        <p>${escapeHtml(getNoctisRoomLockedMessage(room))}</p>
        ${extraAction}
      </div>
    </section>
  `;
}

function renderNoctisRoomByQuery() {
  if (!isNoctisRoomPage || !noctisRoomPage) {
    return;
  }

  const room = getNoctisRoomFromQuery();

  if (!noctisRoomType || !noctisRoomTitle || !noctisRoomCopy || !noctisRoomBack || !noctisRoomContent) {
    return;
  }

  if (!room) {
    document.body.classList.remove(
      "noctis-room-page",
      "entry-desk-page",
      "shelves-page",
      "gallery-page",
      "memory-vault-page",
      "inner-chamber-page",
      "restricted-wing-page"
    );
    isRecoveredItemsModalOpen = false;
    isArchiveNoticesModalOpen = false;
    archiveNoticesModalPage = 0;
    openEntryDeskWhisperId = "";
    resetEntryDeskActivityCards();
    updateEntryDeskModalOpenState();
    renderNoctisRoomNavbar("");
    renderNoctisRoomNotFound();
    return;
  }

  document.body.classList.add("noctis-room-page");
  document.body.classList.toggle("entry-desk-page", room.id === "entry-desk");
  document.body.classList.toggle("shelves-page", room.id === "shelves");
  document.body.classList.toggle("gallery-page", room.id === "gallery");
  document.body.classList.toggle("memory-vault-page", room.id === "memory-vault");
  document.body.classList.toggle("inner-chamber-page", room.id === "inner-chamber");
  document.body.classList.toggle("restricted-wing-page", room.id === "restricted-wing");
  if (room.id !== "entry-desk") {
    isArchiveNoticesModalOpen = false;
    archiveNoticesModalPage = 0;
    openEntryDeskWhisperId = "";
    resetEntryDeskActivityCards();
  }
  if (room.id !== "shelves") {
    closeShelvesModals();
  }
  if (room.id !== "gallery") {
    closeGalleryModals();
  }

  noctisRoomType.textContent = "Noctis Archive";
  noctisRoomTitle.textContent = room.title;
  noctisRoomCopy.classList.remove("archive-room-placeholder__copy--not-found");
  noctisRoomCopy.textContent = room.intro || room.description || "The chamber has awakened.";
  noctisRoomBack.textContent = "Return to Noctis Archive";
  noctisRoomBack.setAttribute("href", "archive.html");
  renderNoctisRoomNavbar(room.id);

  if (room.id === "shelves") {
    loadShelvesDocuments();
    loadShelvesSavedDocuments();
  }

  if (room.id === "gallery") {
    loadGalleryRecords();
  }

  selectedArchiveRoomId = room.id;
  enteredArchiveRoomId = room.id;
  activeArchiveShelfEntryId = "";

  if (room.id === "restricted-wing") {
    if (isRoomLocked(room)) {
      restrictedWingRitualOpen = false;
      restrictedWingGuestPromptOpen = false;
      noctisRoomContent.innerHTML = "";
      document.body.classList.remove("is-restricted-wing-ritual-open");
      updateEntryDeskModalOpenState();
      showRoomToast(getRoomLockedMessage(room));
      return;
    }

    restrictedWingGuestPromptOpen = shouldShowGuestRestrictedWingPrompt();
    restrictedWingRitualOpen = !restrictedWingGuestPromptOpen;
    noctisRoomContent.innerHTML = `
      ${renderRestrictedWingRitualOverlay()}
      ${renderRestrictedWingGuestPromptOverlay()}
    `;
    document.body.classList.add("is-restricted-wing-ritual-open");
    updateEntryDeskModalOpenState();
    window.requestAnimationFrame(() => {
      document.querySelector(".restricted-wing-ritual__dialog")?.focus?.({ preventScroll: true });
    });
    return;
  }

  if (openVisualRecordId && !getOpenVisualRecord()) {
    openVisualRecordId = "";
  }

  if (openRecoveredObjectId && !getSelectedRecoveredObject(getRecoveredObjects())) {
    openRecoveredObjectId = "";
  }

  const roomMarkup = isRoomLocked(room)
    ? renderNoctisRoomLockedPanel(room)
    : (renderRoomContent(room) || renderNoctisRoomLockedPanel(room));
  const renderRoomAppendices = shouldRenderRoomAppendices(room.id);

  noctisRoomContent.innerHTML = `
    ${roomMarkup}
    ${renderRoomAppendices ? renderRecoveredObjects() : ""}
    ${renderRoomAppendices ? renderArchiveLorePanel() : ""}
    ${renderVisualRecordModal()}
  `;

  document.body.classList.toggle("is-visual-record-modal-open", Boolean(getOpenVisualRecord()));
  updateEntryDeskModalOpenState();
}

// The Restricted Wing remains sealed until all four elemental keys are recovered,
// but the visible copy keeps that requirement obscure.
function getRoomLockedMessage(room) {
  if (room?.id === "memory-vault" && isRoomLocked(room)) {
    return "The Memory Vault remains sealed. Memory Vault unlock rule will be added later.";
  }

  if (room?.id === "restricted-wing" && isRoomLocked(room)) {
    return "The lock recognizes only part of what is missing.";
  }

  return room?.lockedMessage || "Access withheld.";
}

function getLockedRoomActionLabel(room) {
  if (!isRoomLocked(room)) {
    return "Enter Chamber";
  }

  const lockText = `${room.id} ${getRoomStatus(room)} ${room.requirement || ""}`.toLowerCase();

  return lockText.includes("sealed") ? "Path Sealed" : "Access Withheld";
}

// Returns the currently selected chamber, falling back to the first configured room.
function getSelectedArchiveRoom() {
  const rooms = getArchiveRooms();

  return getRoomById(selectedArchiveRoomId) || rooms[0] || null;
}

// Thumbnail and Previous/Next controls update only selection; they do not enter locked/open rooms.
function selectArchiveRoom(roomId) {
  const room = getRoomById(roomId);

  if (!room) {
    return;
  }

  selectedArchiveRoomId = room.id;
  enteredArchiveRoomId = "";
  activeArchiveShelfEntryId = "";
  renderArchiveRooms();
}

// Chamber browsing wraps so users can keep cycling through the rail smoothly.
function selectAdjacentArchiveRoom(direction) {
  const rooms = getArchiveRooms();

  if (!rooms.length) {
    return;
  }

  const currentIndex = Math.max(0, rooms.findIndex((room) => room.id === selectedArchiveRoomId));
  const offset = direction === "previous" ? -1 : 1;
  const nextIndex = (currentIndex + offset + rooms.length) % rooms.length;

  selectArchiveRoom(rooms[nextIndex].id);
}

// Shows or hides the archive shell based on Blood Moon access.
function renderArchiveAccessState() {
  const isUnlocked = isArchiveUnlocked();

  archiveContent.forEach((element) => {
    element.hidden = !isUnlocked;
  });

  if (archiveLocked) {
    archiveLocked.hidden = isUnlocked;
  }

  if (archiveFooterLink) {
    archiveFooterLink.hidden = !isUnlocked;
  }
}

function updateEntryDeskModalOpenState() {
  const isEntryDeskActive = document.body.classList.contains("entry-desk-page");
  const isShelvesActive = document.body.classList.contains("shelves-page");
  const hasOpenEntryDeskModal = Boolean(
    isEntryDeskActive &&
    (
      openEntryDeskWhisperId ||
      isArchiveNoticesModalOpen
    )
  );
  const hasOpenShelvesModal = Boolean(
    isShelvesActive &&
    (
      openShelvesReadDocumentId ||
      openShelvesDetailsDocumentId ||
      openShelvesAidModalId ||
      isShelvesNotableModalOpen ||
      isShelvesResearchModalOpen ||
      isShelvesRecentModalOpen
    )
  );
  const hasOpenArchiveModal = Boolean(
    hasOpenEntryDeskModal ||
    openRecoveredObjectId ||
    isRecoveredItemsModalOpen ||
    hasOpenShelvesModal
  );

  document.body.classList.toggle("modal-open", hasOpenArchiveModal);
}

////////////////////////////////////////////////////
// Chamber Selection Viewer
////////////////////////////////////////////////////

// Renders the large selected chamber image; open/locked behavior is still handled by enterArchiveRoom.
function renderFeaturedRoomImage(room) {
  const isLocked = isRoomLocked(room);
  const actionLabel = getLockedRoomActionLabel(room);
  const status = getRoomStatus(room);

  return `
    <figure class="archive-chamber-feature-art archive-chamber-feature-art--${escapeHtml(getRoomStatusClass(room))}${isLocked ? " is-locked" : ""}">
      <img
        src="${escapeHtml(room.image)}"
        alt="${escapeHtml(getRoomImageAlt(room))}"
        width="${ARCHIVE_ARTWORK_WIDTH}"
        height="${ARCHIVE_ARTWORK_HEIGHT}"
        loading="eager"
        decoding="async"
        fetchpriority="high"
        data-expandable-image
        data-image-preview-title="${escapeHtml(room.title)}"
        data-image-preview-caption="${escapeHtml(`${getRoomSubtitle(room)} • ${status}`)}"
        role="button"
        tabindex="0"
        aria-label="View ${escapeHtml(room.title)} full size"
        onerror="this.closest('.archive-chamber-feature-art').classList.add('is-missing'); this.remove();"
      />
      <figcaption>
        <span>${escapeHtml(getRoomInitial(room))}</span>
        ${escapeHtml(actionLabel)}
      </figcaption>
    </figure>
  `;
}

function renderRoomTags(room) {
  return getRoomDetails(room).tags
    .slice(0, 5)
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join("");
}

function getStatusTone(value) {
  const status = String(value || "").toLowerCase();

  if (status.includes("open")) {
    return "open";
  }

  if (status.includes("restricted")) {
    return "restricted";
  }

  if (status.includes("disturbed")) {
    return "disturbed";
  }

  if (status.includes("sealed")) {
    return "sealed";
  }

  if (status.includes("locked")) {
    return "locked";
  }

  return "unknown";
}

function renderRoomInfoBox(label, value) {
  const isStatus = label.toLowerCase() === "status";
  const statusTone = isStatus ? getStatusTone(value) : "";
  const valueMarkup = isStatus
    ? `<span class="archive-status-row archive-status-row--${escapeHtml(statusTone)}"><span class="archive-status-dot" aria-hidden="true"></span>${escapeHtml(value)}</span>`
    : escapeHtml(value);

  return `
    <section class="archive-chamber-info-card${isStatus ? ` archive-chamber-info-card--status archive-chamber-info-card--${escapeHtml(statusTone)}` : ""}">
      <h3>${escapeHtml(label)}</h3>
      <p>${valueMarkup}</p>
    </section>
  `;
}

// Builds the cinematic chamber selector cards above the featured chamber viewer.
function renderRoomThumbnail(room, index, selectedRoomId) {
  const isSelected = room.id === selectedRoomId;
  const isLocked = isRoomLocked(room);
  const statusClass = getRoomStatusClass(room);
  const status = getRoomStatus(room);
  const statusTone = getStatusTone(status);

  return `
    <button class="archive-chamber-card archive-chamber-card--${escapeHtml(statusClass)}${isSelected ? " is-active" : ""}${isLocked ? " is-locked" : ""}" type="button" data-select-room="${escapeHtml(room.id)}" aria-label="Select ${escapeHtml(room.title)}" aria-current="${isSelected ? "true" : "false"}">
      <span class="archive-chamber-card__image">
        <img src="${escapeHtml(room.image)}" alt="${escapeHtml(getRoomImageAlt(room))}" width="${ARCHIVE_ARTWORK_WIDTH}" height="${ARCHIVE_ARTWORK_HEIGHT}" loading="lazy" decoding="async" onerror="this.closest('.archive-chamber-card__image').classList.add('is-missing'); this.remove();" />
      </span>
      <span class="archive-chamber-card__body">
        <strong>${escapeHtml(room.title)}</strong>
        <em>${escapeHtml(getRoomSubtitle(room))}</em>
        <span class="archive-chamber-card__status archive-chamber-card__status--${escapeHtml(statusTone)}" data-status="${escapeHtml(statusTone)}">${escapeHtml(status)}</span>
      </span>
    </button>
  `;
}

// Controls the chamber selector: top rail, featured chamber image, info boxes, and action buttons.
function renderArchiveRooms() {
  if (isNoctisRoomPage) {
    renderNoctisRoomByQuery();
    return;
  }

  if (!archiveRoomGrid) {
    return;
  }

  const rooms = getArchiveRooms();
  const selectedRoom = getSelectedArchiveRoom();

  if (!rooms.length || !selectedRoom) {
    document.body.classList.remove("entry-desk-page", "shelves-page");
    archiveRoomGrid.innerHTML = "";
    return;
  }

  const selectedIndex = rooms.findIndex((room) => room.id === selectedRoom.id);
  const details = getRoomDetails(selectedRoom);
  const actionLabel = getLockedRoomActionLabel(selectedRoom);
  const selectedRoomLocked = isRoomLocked(selectedRoom);
  const selectedRoomStatus = getRoomStatus(selectedRoom);
  const isEntryDeskInteriorOpen = selectedRoom.id === "entry-desk" && enteredArchiveRoomId === "entry-desk";

  if (!isEntryDeskInteriorOpen) {
    isArchiveNoticesModalOpen = false;
    archiveNoticesModalPage = 0;
    openEntryDeskWhisperId = "";
    resetEntryDeskActivityCards();
  }

  document.body.classList.toggle("entry-desk-page", isEntryDeskInteriorOpen);

  archiveRoomGrid.innerHTML = `
    <div class="archive-chamber-viewer${isEntryDeskInteriorOpen ? " archive-chamber-viewer--entry-desk" : ""}" data-selected-room="${escapeHtml(selectedRoom.id)}">
      ${isEntryDeskInteriorOpen ? "" : `
        <div class="archive-chamber-thumbnail-rail" aria-label="Select a chamber">
          ${rooms.map((room, index) => renderRoomThumbnail(room, index, selectedRoom.id)).join("")}
        </div>

        <section class="archive-chamber-stage" aria-live="polite">
          <div class="archive-chamber-content">
            <p class="archive-chamber-counter">${selectedIndex + 1} of ${rooms.length}</p>
            <h2>${escapeHtml(selectedRoom.title)}</h2>
            <p class="archive-chamber-subtitle">${escapeHtml(getRoomSubtitle(selectedRoom))}</p>
            <p class="archive-chamber-description">${escapeHtml(selectedRoom.description)}</p>
            <ul class="archive-chamber-tags" aria-label="Chamber tags">
              ${renderRoomTags(selectedRoom)}
            </ul>
            <div class="archive-chamber-info-grid">
              ${renderRoomInfoBox("Status", selectedRoomStatus)}
              ${renderRoomInfoBox("Contains", details.contains)}
              ${renderRoomInfoBox("Access Notes", selectedRoomLocked ? getRoomLockedMessage(selectedRoom) : details.accessNotes)}
              ${renderRoomInfoBox("Archive Hint", details.archiveHint)}
            </div>
          </div>

          ${renderFeaturedRoomImage(selectedRoom)}

          <div class="archive-chamber-actions">
            <button type="button" data-chamber-nav="previous">‹ Previous</button>
            <button class="archive-chamber-enter${selectedRoomLocked ? " is-locked" : ""}" type="button" data-room-enter="${escapeHtml(selectedRoom.id)}">
              ${escapeHtml(actionLabel)}
            </button>
            <button type="button" data-chamber-nav="next">Next ›</button>
          </div>
        </section>
      `}
      ${renderSelectedChamberContent(selectedRoom)}
      ${enteredArchiveRoomId ? "" : renderArchiveLandingCards()}
      ${renderVisualRecordModal()}
      ${renderRestrictedWingRitualOverlay()}
      ${renderRestrictedWingGuestPromptOverlay()}
    </div>
  `;

  const thumbnailRail = archiveRoomGrid.querySelector(".archive-chamber-thumbnail-rail");
  const activeThumbnail = archiveRoomGrid.querySelector(".archive-chamber-card.is-active");

  if (thumbnailRail && activeThumbnail) {
    thumbnailRail.scrollLeft =
      activeThumbnail.offsetLeft - (thumbnailRail.clientWidth - activeThumbnail.clientWidth) / 2;
  }

  document.body.classList.toggle("is-visual-record-modal-open", Boolean(getOpenVisualRecord()));
  document.body.classList.toggle(
    "is-restricted-wing-ritual-open",
    restrictedWingRitualOpen || restrictedWingGuestPromptOpen
  );
  updateEntryDeskModalOpenState();
}

// Small toast for locked-room attempts; it avoids changing hash or leaving the selector.
function showRoomToast(message) {
  if (!archiveRoomToast) {
    return;
  }

  window.clearTimeout(archiveToastTimeout);
  archiveRoomToast.textContent = message || "Access withheld.";
  archiveRoomToast.hidden = false;
  archiveRoomToast.classList.add("is-visible");

  archiveToastTimeout = window.setTimeout(() => {
    archiveRoomToast.classList.remove("is-visible");
    archiveRoomToast.hidden = true;
  }, 2600);
}

////////////////////////////////////////////////////
// Open Chamber Placeholder Views
////////////////////////////////////////////////////

// Entry Desk is where recovered words are submitted back to the archive.
function renderEntryDeskRoom(room) {
  return `
    <div class="entry-desk-page-shell">
      <section class="entry-desk-grid">
        ${renderEntryDeskHero(room)}
        ${renderArchiveCodePanel()}
        ${renderRecoveredObjects()}
        ${renderEntryDeskActivityGrid()}
        ${renderEntryDeskOmen()}
      </section>
    </div>
  `;
}

function renderEntryDeskHero(room) {
  const entryDeskHeroImage = "assets/images/noctis/entry_desk_bg.png";

  return `
    <section class="entry-desk-hero" aria-labelledby="entry-desk-title">
      <img class="entry-desk-hero__image" src="${escapeHtml(entryDeskHeroImage)}" alt="" width="1024" height="1536" loading="eager" decoding="async" />
      <div class="entry-desk-hero__overlay" aria-hidden="true"></div>
      <div class="entry-desk-hero__content">
        <h2 id="entry-desk-title">The Entry Desk</h2>
        <p class="entry-desk-subtitle">Every discovery begins with a whisper.<br />The Archive listens-and decides what it will reveal.</p>
      </div>
    </section>
  `;
}

function renderEntryDeskRevealSection() {
  const revealTypes = [
    ["☾", "Hidden Decks", "Sealed behind phrases and discoveries."],
    ["♛", "Profile Titles", "Marks earned through hidden paths."],
    ["⌂", "Secret Rooms", "Chambers that answer only when permitted."],
    ["✦", "Artifacts", "Objects recovered through rituals and codes."],
    ["◍", "Fragments", "Pieces of memory scattered through the Archive."],
    ["✧", "Archive Secrets", "Lore that reveals itself to careful eyes."],
    ["♁", "Veilwalker Whispers", "Messages and hints left by those who move through the Veil.", true]
  ];

  return `
    <section class="entry-desk-reveal-section" aria-labelledby="entry-desk-reveal-title">
      <div class="entry-desk-section-heading entry-desk-reveal-header">
        <p class="entry-desk-kicker">Possible Revelations</p>
        <h3 id="entry-desk-reveal-title">What the Archive May Hold</h3>
        <p>Whispers can unlock more than doors. Some reveal what was always waiting beneath the surface.</p>
      </div>
      <div class="entry-desk-reveal-grid">
        ${revealTypes.map(([symbol, title, description, isFeatured]) => `
          <article class="entry-desk-reveal-card${isFeatured ? " featured" : ""}">
            <span aria-hidden="true">${escapeHtml(symbol)}</span>
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(description)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function getRandomItems(items, count = 3) {
  if (!Array.isArray(items)) {
    return [];
  }

  const pool = [...items];
  const selected = [];

  while (pool.length && selected.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}

function initEntryDeskActivityCards() {
  selectedVeilwalkerWhispers = getRandomItems(veilwalkerWhispers, 3);
  selectedArchiveEchoes = getRandomItems(archiveEchoes, 3);
}

function ensureEntryDeskActivityCards() {
  if (
    selectedVeilwalkerWhispers.length ||
    selectedArchiveEchoes.length
  ) {
    return;
  }

  initEntryDeskActivityCards();
}

function resetEntryDeskActivityCards() {
  selectedVeilwalkerWhispers = [];
  selectedArchiveEchoes = [];
}

function getEntryDeskArchiveNotices() {
  if (!isLoggedInArchiveUser()) {
    return archiveNoticeFallbacks;
  }

  const unlockedKeys = getUnlockedElementalKeys();

  if (!unlockedKeys.length) {
    return archiveNoticeEmptyUserItems;
  }

  const orderedArtifactKeys = ["water", "air", "fire", "earth"];
  const notices = orderedArtifactKeys
    .filter((keyId) => unlockedKeys.includes(keyId))
    .map((keyId) => ({
      id: `artifact-${keyId}`,
      ...artifactNoticeMap[keyId]
    }));

  if (areAllElementalKeysRecovered()) {
    notices.push({
      id: "restricted-wing-open",
      title: "Restricted Wing",
      message: "Four recovered objects answered at once. The Restricted Wing is open.",
      tone: "blood"
    });
  }

  return notices;
}

function renderEntryDeskActivityGrid() {
  ensureEntryDeskActivityCards();
  const archiveNoticesForEntryDesk = getEntryDeskArchiveNotices();

  return `
    <section class="entry-desk-activity-grid" aria-label="Archive activity">
      ${renderEntryDeskActivityCard("Archive Notices", archiveNoticesForEntryDesk, "notice")}
      ${renderEntryDeskActivityCard("Veilwalker Whispers", selectedVeilwalkerWhispers, "whisper")}
      ${renderEntryDeskActivityCard("Archive Echoes", selectedArchiveEchoes, "echo")}
      ${renderArchiveNoticesModal(archiveNoticesForEntryDesk)}
      ${renderEntryDeskWhisperModal()}
    </section>
  `;
}

function renderEntryDeskActivityItem(item, variant) {
  if (variant === "whisper") {
    const avatarText = (item.speaker || "Archive").trim().charAt(0).toUpperCase() || "A";

    return `
      <article class="entry-desk-whisper-row" data-whisper-id="${escapeHtml(item.id)}" tabindex="0" role="button" aria-label="${escapeHtml(`Open whisper from ${item.speaker || "The Archive"}`)}">
        <span class="entry-desk-whisper-avatar" aria-hidden="true">${escapeHtml(avatarText)}</span>
        <div>
          <p class="entry-desk-whisper-message">"${escapeHtml(item.message)}"</p>
          <p class="entry-desk-whisper-speaker">${escapeHtml(item.speaker || "The Archive")}</p>
        </div>
      </article>
    `;
  }

  const dotTone = variant === "echo" ? "blood" : item.tone || "default";

  return `
    <article class="entry-desk-feed-item">
      <span class="entry-desk-feed-dot dot-${escapeHtml(dotTone)}" aria-hidden="true"></span>
      <div>
        <h4>${escapeHtml(item.title || "Archive Entry")}</h4>
        <p>${escapeHtml(item.message || "")}</p>
      </div>
    </article>
  `;
}

function renderEntryDeskActivityCard(title, items, variant) {
  const iconMap = {
    notice: "assets/icons/symbols/memory_fragment1.svg",
    whisper: "assets/icons/symbols/shadow-bloodmoon.svg",
    echo: "assets/icons/symbols/bloodmoon_star.svg"
  };
  const iconSrc = iconMap[variant] || iconMap.notice;
  const visibleItems = variant === "notice" ? items.slice(0, 3) : items;
  const noticeButton = variant === "notice"
    ? `
      <button class="entry-desk-view-notices-btn" type="button" data-view-all-archive-notices>
        <span>View all notices</span>
        <img src="assets/icons/symbols/arrow-long-right.svg" alt="" aria-hidden="true" width="18" height="18" loading="lazy" decoding="async" />
      </button>
    `
    : "";

  return `
    <article class="entry-desk-activity-card">
      <h3>
        <img src="${escapeHtml(iconSrc)}" alt="" aria-hidden="true" width="22" height="22" loading="lazy" decoding="async" />
        <span>${escapeHtml(title)}</span>
      </h3>
      <div class="${variant === "whisper" ? "entry-desk-whisper-list" : `entry-desk-feed-list entry-desk-feed-list--${escapeHtml(variant)}`}">
        ${visibleItems.map((item) => renderEntryDeskActivityItem(item, variant)).join("")}
      </div>
      ${variant === "whisper" ? `<p class="entry-desk-whisper-hint">Click a whisper to hear it fully.</p>` : ""}
      ${noticeButton}
    </article>
  `;
}

function presentEntryDeskWhisperModal() {
  const whisperDialog = document.querySelector(".entry-desk-whisper-dialog");

  if (!whisperDialog) {
    return;
  }

  whisperDialog.focus({ preventScroll: true });
}

function presentEntryDeskNoticesModal() {
  const noticesDialog = document.querySelector(".entry-desk-notices-dialog");

  if (!noticesDialog) {
    return;
  }

  noticesDialog.focus({ preventScroll: true });
}

function renderEntryDeskWhisperModal() {
  const whisper = selectedVeilwalkerWhispers.find((item) => item.id === openEntryDeskWhisperId);

  if (!whisper) {
    return "";
  }

  return `
    <div class="entry-desk-whisper-modal" role="presentation">
      <div class="entry-desk-whisper-modal-backdrop" data-close-whisper-modal></div>
      <article class="entry-desk-whisper-dialog" role="dialog" aria-modal="true" aria-labelledby="entryDeskWhisperTitle" tabindex="-1">
        <button class="entry-desk-whisper-close" type="button" data-close-whisper-modal aria-label="Close whisper">×</button>
        <p class="entry-desk-modal-kicker">${escapeHtml(whisper.type || "Veilwalker Whisper")}</p>
        <h2 id="entryDeskWhisperTitle">${escapeHtml(whisper.speaker || "The Archive")}</h2>
        <p class="entry-desk-whisper-full-message">"${escapeHtml(whisper.message)}"</p>
      </article>
    </div>
  `;
}

function renderArchiveNoticesModal(notices) {
  if (!isArchiveNoticesModalOpen) {
    return "";
  }

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(notices.length / pageSize));
  const safePage = Math.min(Math.max(archiveNoticesModalPage, 0), totalPages - 1);
  const pageItems = notices.slice(safePage * pageSize, safePage * pageSize + pageSize);

  archiveNoticesModalPage = safePage;

  return `
    <div class="entry-desk-notices-modal" role="presentation">
    <article class="entry-desk-notices-dialog" role="dialog" aria-modal="true" aria-labelledby="entry-desk-notices-title" tabindex="-1">
        <button class="entry-desk-modal-close" type="button" data-archive-notices-close aria-label="Close archive notices">Close</button>
        <div class="entry-desk-notices-dialog__header">
          <p>Blood Moon Activity</p>
          <h4 id="entry-desk-notices-title">Archive Notices</h4>
        </div>
        <div class="entry-desk-feed-list entry-desk-notices-dialog__list">
          ${pageItems.map((item) => renderEntryDeskActivityItem(item, "notice")).join("")}
        </div>
        <div class="entry-desk-notices-dialog__pager">
          <button type="button" data-archive-notices-page="previous" ${safePage === 0 ? "disabled" : ""}>Previous</button>
          <span>Page ${safePage + 1} of ${totalPages}</span>
          <button type="button" data-archive-notices-page="next" ${safePage >= totalPages - 1 ? "disabled" : ""}>Next</button>
        </div>
      </article>
    </div>
  `;
}

function renderEntryDeskOmen() {
  return `
    <p class="entry-desk-omen">
      <span aria-hidden="true"></span>
      You do not enter the Archive. The Archive allows you to proceed.
      <span aria-hidden="true"></span>
    </p>
  `;
}

function getRecoveredObjects() {
  const unlockedKeys = getUnlockedElementalKeys();

  return elementalKeys.filter((key) => unlockedKeys.includes(key.id));
}

function getVisibleRecoveredObjects() {
  return isLoggedInArchiveUser() ? getRecoveredObjects() : [];
}

function getObjectAlignment(object) {
  return Array.isArray(object.alignment) ? object.alignment.filter(Boolean) : [];
}

function getSelectedRecoveredObject(recoveredObjects) {
  if (!recoveredObjects.length || !openRecoveredObjectId) {
    return null;
  }

  return recoveredObjects.find((object) => object.id === openRecoveredObjectId) || null;
}

function renderRecoveredObjectIcon(object) {
  if (object.image) {
    return `<img src="${escapeHtml(object.image)}" alt="${escapeHtml(object.title)} artifact" width="${ARCHIVE_ARTIFACT_SIZE}" height="${ARCHIVE_ARTIFACT_SIZE}" loading="lazy" decoding="async" draggable="false" onerror="this.closest('.archive-recovered-object-card__icon').classList.add('is-missing'); this.remove();" />`;
  }

  return `<span aria-hidden="true">${escapeHtml(object.name?.charAt(0) || "K")}</span>`;
}

function renderRecoveredObjectCard(object, isRecovered = true) {
  const dataAttribute = isRecovered ? `data-recovered-object="${escapeHtml(object.id)}"` : "";
  const cardTitle = isRecovered ? object.title : "Sealed Finding";
  const cardLabel = isRecovered
    ? `Open ${object.title} recovered artifact details`
    : "Sealed finding not yet recovered";

  return `
    <button class="archive-recovered-object-card protected-media ${escapeHtml(isRecovered ? object.accentClass || "" : "")}${isRecovered ? " is-recovered" : " is-locked"}" type="button" ${dataAttribute} ${isRecovered ? 'data-protected-media="true" draggable="false"' : "disabled"} aria-label="${escapeHtml(cardLabel)}">
      <span class="archive-recovered-object-card__icon">
        ${isRecovered ? renderRecoveredObjectIcon(object) : `<span aria-hidden="true">?</span>`}
      </span>
      <span class="archive-recovered-object-card__copy">
        <strong>${escapeHtml(cardTitle)}</strong>
      </span>
    </button>
  `;
}

function renderRecoveredObjectDetailSection(label, value) {
  return `
    <section class="archive-recovered-object-detail__section">
      <h5>${escapeHtml(label)}</h5>
      <p>${escapeHtml(value || "Placeholder text. Final recovered artifact details will be added later.")}</p>
    </section>
  `;
}

function renderRecoveredObjectDetail(object) {
  const alignment = getObjectAlignment(object);

  return `
    <div class="archive-recovered-object-modal" role="presentation" data-recovered-object-close>
      <article class="archive-recovered-object-detail ${escapeHtml(object.accentClass || "")}" role="dialog" aria-modal="true" aria-labelledby="recovered-object-title" aria-live="polite">
        <button class="archive-recovered-object-modal__close" type="button" data-recovered-object-close aria-label="Close recovered artifact details">Close</button>
        <figure class="archive-artifact-modal-figure protected-media" data-protected-media="true">
          <img class="archive-artifact-preview-image" src="${escapeHtml(object.image)}" alt="${escapeHtml(object.title)} artifact" width="${ARCHIVE_ARTIFACT_SIZE}" height="${ARCHIVE_ARTIFACT_SIZE}" loading="lazy" decoding="async" draggable="false" />
        </figure>
        <div class="archive-artifact-lore-panel">
          <div class="archive-recovered-object-detail__header">
            <p>${escapeHtml(object.recoveredFrom || object.subtitle || "Recovered Source Unknown")}</p>
            <h4 id="recovered-object-title">${escapeHtml(object.title)}</h4>
            <div class="archive-recovered-object-detail__chips" aria-label="Object classifications">
              <span>${escapeHtml(object.type || "Recovered Object")}</span>
              ${alignment.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
          ${renderRecoveredObjectDetailSection("Lore", object.lore || object.description)}
          ${renderRecoveredObjectDetailSection("Archive Note", object.archiveNote)}
          ${renderRecoveredObjectDetailSection("Use", object.useHint)}
        </div>
      </article>
    </div>
  `;
}

function renderRecoveredItemsModal() {
  if (!isRecoveredItemsModalOpen) {
    return "";
  }

  const recoveredObjects = getVisibleRecoveredObjects();

  return `
    <div class="archive-recovered-items-modal" role="presentation">
      <article class="archive-recovered-items-dialog" role="dialog" aria-modal="true" aria-labelledby="recovered-items-title">
        <button class="archive-recovered-object-modal__close" type="button" data-recovered-items-close aria-label="Close recovered items list">Close</button>
        <div class="archive-recovered-items-dialog__header">
          <p>Archive Inventory</p>
          <h4 id="recovered-items-title">Recovered Items</h4>
        </div>
        <div class="archive-recovered-items-list">
          ${recoveredObjects.map((object) => `
            <article class="archive-recovered-items-list__row ${escapeHtml(object.accentClass || "")} is-recovered">
              <span class="archive-recovered-items-list__icon">${renderRecoveredObjectIcon(object)}</span>
              <span>
                <strong>${escapeHtml(object.title)}</strong>
                <em>${escapeHtml(object.type || "Recovered Finding")} - Recovered</em>
              </span>
            </article>
          `).join("") || renderRecoveredFindingsEmptyState()}
        </div>
      </article>
    </div>
  `;
}

function renderRecoveredFindingsEmptyState() {
  return `
    <div class="noctis-findings-empty">
      <p class="noctis-card-kicker">Recovered Findings</p>
      <h3>Nothing has answered yet.</h3>
      <p>
        The desk is not empty. It is withholding.
        Somewhere in the Archive, keys, relics, and memories are waiting for the hand that remembers how to find them.
      </p>
      <p class="noctis-findings-hint">Recover a whisper. Return with proof.</p>
    </div>
  `;
}

// The recovered-object display presents each elemental key as an inspectable
// archive artifact while the underlying key progress remains available to locks.
function renderRecoveredObjects() {
  const recoveredObjects = getVisibleRecoveredObjects();
  const selectedObject = getSelectedRecoveredObject(recoveredObjects);

  if (openRecoveredObjectId && !selectedObject) {
    openRecoveredObjectId = "";
    isRecoveredItemsModalOpen = false;
  }

  return `
    <section class="archive-recovered-objects entry-desk-findings-section" aria-labelledby="entry-desk-findings-title">
      <div class="archive-section-copy entry-desk-section-heading">
        <h3 id="entry-desk-findings-title">Recovered Findings</h3>
        <p>Things pulled from the spaces between memory and forgetting.</p>
      </div>
      <div class="archive-recovered-inventory">
        <div class="archive-recovered-object-strip" aria-label="Recovered findings inventory">
          ${recoveredObjects.map((object) => renderRecoveredObjectCard(object)).join("") || renderRecoveredFindingsEmptyState()}
        </div>
      </div>
      ${recoveredObjects.length ? `<button class="archive-view-recovered-items-btn" type="button" data-view-all-recovered-items>
        <span>View all recovered items</span>
        <img src="assets/icons/symbols/arrow-long-right.svg" alt="" aria-hidden="true" width="18" height="18" loading="lazy" decoding="async" />
      </button>` : ""}
      ${selectedObject ? renderRecoveredObjectDetail(selectedObject) : ""}
      ${renderRecoveredItemsModal()}
      <div class="archive-recovered-objects__art" aria-hidden="true"></div>
    </section>
  `;
}

function renderArchiveCodePanel() {
  return `
    <form class="archive-code-panel entry-desk-code-section" data-archive-code-form>
      <div class="archive-section-copy entry-desk-section-heading">
        <h3>ENTER AN ARCHIVE CODE</h3>
        <p>Speak a phrase. Recall a name. Offer a truth. Some locks answer only to words recovered elsewhere.</p>
      </div>
      <div class="archive-code-entry">
        <label class="archive-code-panel__field">
          <span>Archive Code</span>
          <input type="text" name="archive-code" autocomplete="off" spellcheck="false" />
        </label>
        <button type="submit">Whisper the Code</button>
      </div>
      <p class="archive-code-panel__feedback archive-code-toast archive-code-toast--${escapeHtml(archiveCodeFeedbackTone || "info")}" data-archive-code-feedback aria-live="polite" ${archiveCodeFeedback ? "" : "hidden"}>
        ${escapeHtml(archiveCodeFeedback)}
      </p>
    </form>
  `;
}

function renderArchiveLandingRecoveredObjects() {
  const recoveredObjects = getVisibleRecoveredObjects();
  const selectedObject = getSelectedRecoveredObject(recoveredObjects);

  return `
    <section class="archive-recovered-objects archive-landing-recovered-objects" aria-labelledby="archive-landing-recovered-title">
      <div class="archive-section-copy">
        <h3 id="archive-landing-recovered-title">Recovered Objects</h3>
        <p>Items pulled from the spaces between memory and forgetting.</p>
      </div>
      ${recoveredObjects.length ? `
        <div class="archive-recovered-inventory archive-landing-recovered-objects__inventory">
          <div class="archive-recovered-object-strip" aria-label="Recovered objects inventory">
            ${recoveredObjects.map((object) => renderRecoveredObjectCard(object)).join("")}
          </div>
        </div>
        <button class="archive-view-recovered-items-btn" type="button" data-view-all-recovered-items>
          <span>View all recovered items</span>
          <img src="assets/icons/symbols/arrow-long-right.svg" alt="" aria-hidden="true" width="18" height="18" loading="lazy" decoding="async" />
        </button>
      ` : `<p class="archive-empty-state archive-landing-recovered-objects__empty">No recovered objects yet.</p>`}
      ${selectedObject ? renderRecoveredObjectDetail(selectedObject) : ""}
      ${renderRecoveredItemsModal()}
      <div class="archive-recovered-objects__art" aria-hidden="true"></div>
    </section>
  `;
}

function renderArchiveLandingCards() {
  return `
    <div class="archive-landing-cards" aria-label="Noctis Archive recovered objects and memory">
      ${renderArchiveLandingRecoveredObjects()}
      ${renderArchiveLorePanel()}
    </div>
  `;
}

function renderArchiveLorePanel() {
  return `
    <section class="archive-remembers-panel" aria-label="The Archive remembers">
      <div>
        <p>THE ARCHIVE REMEMBERS</p>
        <span>During the Blood Moon, sealed doors breathe.</span>
        <span>What you seek is also seeking you.</span>
      </div>
      <div>
        <span>Keep your mind clear.</span>
        <span>Not every truth is meant to be taken.</span>
      </div>
    </section>
  `;
}

function getFallbackNoctisDocuments() {
  return archiveShelfEntries.map((entry, index) => ({
    id: entry.id,
    slug: entry.id,
    title: entry.title,
    subtitle: entry.label,
    author: entry.author,
    document_type: "journal_fragment",
    category: "journals",
    summary: "The sea is not distant. It is memory. It pulls at the edge of the self, where names dissolve and the Veil grows thin.",
    excerpt: "The sea is not distant. It is memory. It pulls at the edge of the self, where names dissolve and the Veil grows thin.",
    body: entry.body,
    tags: ["water", "memory", "fragment"],
    themes: ["The Veil", "Tides", "Memory"],
    unlock_requirement: "public",
    is_published: true,
    is_featured: index === 0,
    shelf_mark: entry.shelfMark || "J-SC-ZN-01",
    cover_image: "assets/images/noctis/recovered-code.png",
    created_at: "2026-06-01T00:00:00.000Z"
  }));
}

function getShelvesDocuments() {
  return shelvesDocuments.length ? shelvesDocuments : getFallbackNoctisDocuments();
}

function getDocumentId(document) {
  return String(document?.slug || document?.id || document?.title || "");
}

function normalizeDocumentListField(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.values(value).filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getDocumentBodyText(document) {
  const body = document?.body;

  if (Array.isArray(body)) {
    return body.map((item) => typeof item === "string" ? item : item?.text || item?.body || "").join("\n\n");
  }

  if (body && typeof body === "object") {
    return Object.values(body).map((item) => String(item || "")).join("\n\n");
  }

  return String(body || "");
}

function getDocumentExcerpt(document) {
  return document?.excerpt || document?.summary || getDocumentBodyText(document).slice(0, 220);
}

function formatShelvesLabel(value, fallback = "Unclassified") {
  const normalized = String(value || fallback)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getShelvesDocumentStatus(document) {
  return isNoctisDocumentLocked(document) ? "Sealed" : "Open";
}

function getShelvesDocumentUnlockLabel(document) {
  return isNoctisDocumentLocked(document)
    ? document?.unlock_requirement || "Additional access required"
    : "Public";
}

function loadShelvesRecentlyReadEntries() {
  try {
    const rawEntries = JSON.parse(window.sessionStorage?.getItem(getShelvesRecentlyReadStorageKey()) || "[]");
    const entries = Array.isArray(rawEntries) ? rawEntries : [];

    shelvesRecentlyReadEntries = new Map(
      entries
        .filter((entry) => entry?.documentId)
        .map((entry) => [
          String(entry.documentId),
          {
            documentId: String(entry.documentId),
            lastReadAt: entry.lastReadAt || new Date().toISOString(),
            readCount: Number(entry.readCount) || 1
          }
        ])
    );
  } catch (error) {
    shelvesRecentlyReadEntries = new Map();
  }
}

function persistShelvesRecentlyReadEntries() {
  try {
    const entries = [...shelvesRecentlyReadEntries.values()]
      .sort((first, second) => Date.parse(second.lastReadAt || 0) - Date.parse(first.lastReadAt || 0))
      .slice(0, 30);

    shelvesRecentlyReadEntries = new Map(entries.map((entry) => [entry.documentId, entry]));
    window.sessionStorage?.setItem(getShelvesRecentlyReadStorageKey(), JSON.stringify(entries));
  } catch (error) {
    // Recently Read is allowed to be session-only; storage failure should not block reading.
  }
}

function getShelvesRecentlyReadStorageKey() {
  return `${shelvesRecentlyReadStorageKey}:${artifactProgressState.user?.id || "guest"}`;
}

function getCleanShelvesAuthor(document) {
  return String(document?.author || "Unknown Hand")
    .replace(/^attributed\s+to\s+/i, "")
    .trim() || "Unknown Hand";
}

function getShelvesDocumentTypeLabel(document) {
  return formatShelvesLabel(document?.document_type || document?.category, "Document");
}

function formatShelvesRecentTimestamp(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function recordShelvesDocumentRead(documentId) {
  const document = getShelvesDocumentById(documentId);

  if (!document) {
    return;
  }

  const id = getDocumentId(document);
  const previous = shelvesRecentlyReadEntries.get(id);

  shelvesRecentlyReadEntries.set(id, {
    documentId: id,
    lastReadAt: new Date().toISOString(),
    readCount: previous ? previous.readCount + 1 : 1
  });
  persistShelvesRecentlyReadEntries();
}

function getShelvesRecentlyReadDocuments(limit = 3) {
  return [...shelvesRecentlyReadEntries.values()]
    .sort((first, second) => Date.parse(second.lastReadAt || 0) - Date.parse(first.lastReadAt || 0))
    .map((entry) => ({
      entry,
      document: getShelvesDocumentById(entry.documentId)
    }))
    .filter((item) => item.document)
    .slice(0, limit);
}

function closeShelvesModals() {
  openShelvesReadDocumentId = "";
  openShelvesDetailsDocumentId = "";
  openShelvesAidModalId = "";
  isShelvesNotableModalOpen = false;
  isShelvesResearchModalOpen = false;
  isShelvesRecentModalOpen = false;
  shelvesAidPageIndex = 0;
  shelvesNotablePageIndex = 0;
}

function openShelvesReadModal(documentId) {
  setShelvesSavedNotice("");
  recordShelvesDocumentRead(documentId);
  openShelvesReadDocumentId = documentId || "";
  openShelvesDetailsDocumentId = "";
  openShelvesAidModalId = "";
  isShelvesNotableModalOpen = false;
  isShelvesResearchModalOpen = false;
  isShelvesRecentModalOpen = false;
  shelvesAidPageIndex = 0;
  shelvesNotablePageIndex = 0;
  renderCurrentArchiveSurface();
}

function openShelvesDetailsModal(documentId) {
  openShelvesDetailsDocumentId = documentId || "";
  openShelvesReadDocumentId = "";
  openShelvesAidModalId = "";
  isShelvesNotableModalOpen = false;
  isShelvesResearchModalOpen = false;
  isShelvesRecentModalOpen = false;
  shelvesAidPageIndex = 0;
  shelvesNotablePageIndex = 0;
  renderCurrentArchiveSurface();
}

function openShelvesAidModal(aidId) {
  openShelvesAidModalId = aidId || "";
  openShelvesReadDocumentId = "";
  openShelvesDetailsDocumentId = "";
  isShelvesNotableModalOpen = false;
  isShelvesResearchModalOpen = false;
  isShelvesRecentModalOpen = false;
  shelvesAidPageIndex = 0;
  shelvesNotablePageIndex = 0;
  renderCurrentArchiveSurface();
}

function openShelvesRecentModal() {
  if (!getShelvesRecentlyReadDocuments(10).length) {
    return;
  }

  isShelvesRecentModalOpen = true;
  openShelvesReadDocumentId = "";
  openShelvesDetailsDocumentId = "";
  openShelvesAidModalId = "";
  isShelvesNotableModalOpen = false;
  isShelvesResearchModalOpen = false;
  shelvesAidPageIndex = 0;
  shelvesNotablePageIndex = 0;
  renderCurrentArchiveSurface();
}

function openShelvesNotableModal() {
  if (!getSavedShelvesDocuments().length) {
    return;
  }

  isShelvesNotableModalOpen = true;
  isShelvesResearchModalOpen = false;
  isShelvesRecentModalOpen = false;
  openShelvesReadDocumentId = "";
  openShelvesDetailsDocumentId = "";
  openShelvesAidModalId = "";
  shelvesAidPageIndex = 0;
  shelvesNotablePageIndex = 0;
  renderCurrentArchiveSurface();
}

function openShelvesResearchModal() {
  isShelvesResearchModalOpen = true;
  openShelvesReadDocumentId = "";
  openShelvesDetailsDocumentId = "";
  openShelvesAidModalId = "";
  isShelvesNotableModalOpen = false;
  isShelvesRecentModalOpen = false;
  shelvesAidPageIndex = 0;
  shelvesNotablePageIndex = 0;
  renderCurrentArchiveSurface();
}

function isNoctisDocumentLocked(document) {
  const requirement = String(document?.unlock_requirement || "public").trim().toLowerCase();

  return Boolean(requirement && !["public", "none", "open", "free"].includes(requirement));
}

function normalizeShelvesMatchValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_");
}

function isCountableShelvesDocument(document) {
  return document?.is_published !== false && !isNoctisDocumentLocked(document);
}

function shelvesListIncludes(value, expected) {
  const expectedValue = normalizeShelvesMatchValue(expected);

  return normalizeDocumentListField(value).some((item) => normalizeShelvesMatchValue(item) === expectedValue);
}

function documentMatchesShelvesBrowseCard(document, cardOrId) {
  const card = typeof cardOrId === "string"
    ? shelvesBrowseCards.find((item) => item.id === cardOrId || item.filter === cardOrId)
    : cardOrId;

  if (!card) {
    return false;
  }

  const category = normalizeShelvesMatchValue(document?.category);
  const documentType = normalizeShelvesMatchValue(document?.document_type);

  if (card.id === "journals") {
    return category === "journals" || documentType === "journal_fragment";
  }

  if (card.id === "manuscripts") {
    return category === "manuscripts" || documentType === "manuscript";
  }

  if (card.id === "letters") {
    return category === "letters" || documentType === "letter";
  }

  if (card.id === "cryptic_codes") {
    return category === "cryptic_codes" || documentType === "cipher";
  }

  if (card.id === "unstable_texts") {
    return category === "unstable_texts" || documentType === "unstable_text";
  }

  if (card.id === "veil_lore") {
    return category === "veil_lore"
      || shelvesListIncludes(document?.themes, "The Veil")
      || shelvesListIncludes(document?.tags, "veil");
  }

  return false;
}

function getShelvesBrowseCardCount(card) {
  return getShelvesDocuments()
    .filter(isCountableShelvesDocument)
    .filter((document) => documentMatchesShelvesBrowseCard(document, card))
    .length;
}

function formatShelvesDocumentCount(count) {
  return `${count} ${count === 1 ? "document" : "documents"}`;
}

function isShelvesFilterChipActive(filterId) {
  return shelvesActiveFilter === filterId
    || shelvesBrowseCards.some((card) => card.filter === shelvesActiveFilter && card.activeFilter === filterId);
}

function getDocumentSearchText(document) {
  return [
    document?.title,
    document?.subtitle,
    document?.author,
    document?.summary,
    document?.excerpt,
    getDocumentBodyText(document),
    normalizeDocumentListField(document?.tags).join(" "),
    normalizeDocumentListField(document?.themes).join(" "),
    document?.shelf_mark
  ].filter(Boolean).join(" ").toLowerCase();
}

function getShelvesResearchTrailById(trailId) {
  return shelvesResearchTrails.find((trail) => trail.id === trailId) || null;
}

function documentMatchesShelvesResearchTrail(document, trailOrId) {
  const trail = typeof trailOrId === "string" ? getShelvesResearchTrailById(trailOrId) : trailOrId;

  if (!trail) {
    return false;
  }

  const searchableText = getDocumentSearchText(document);
  const normalizedCategory = normalizeShelvesMatchValue(document?.category);
  const normalizedType = normalizeShelvesMatchValue(document?.document_type);

  if (trail.id === "recovered-journals" && (normalizedCategory === "journals" || normalizedType === "journal_fragment")) {
    return true;
  }

  return (trail.terms || [trail.title]).some((term) => searchableText.includes(String(term || "").toLowerCase()));
}

function getShelvesResearchTrailCount(trail) {
  return getShelvesDocuments()
    .filter(isCountableShelvesDocument)
    .filter((document) => documentMatchesShelvesResearchTrail(document, trail))
    .length;
}

function applyShelvesResearchTrail(trailId) {
  const trail = getShelvesResearchTrailById(trailId);

  if (!trail) {
    return;
  }

  shelvesActiveResearchTrailId = trail.id;
  shelvesSearchQuery = trail.title;
  shelvesActiveFilter = "all";
  shelvesActiveIndex = 0;
  closeShelvesModals();
  renderCurrentArchiveSurface();

  window.requestAnimationFrame(() => {
    document.querySelector(".shelves-search-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

function documentMatchesShelvesFilter(document, filterId = shelvesActiveFilter) {
  if (!filterId || filterId === "all") {
    return true;
  }

  const browseCard = shelvesBrowseCards.find((card) => card.filter === filterId || card.id === filterId);

  if (browseCard) {
    return documentMatchesShelvesBrowseCard(document, browseCard);
  }

  const values = [
    document?.document_type,
    document?.category,
    document?.moon_phase,
    document?.shelf_mark,
    ...normalizeDocumentListField(document?.tags),
    ...normalizeDocumentListField(document?.themes)
  ].map((value) => String(value || "").toLowerCase());

  const includesAny = (terms) => values.some((value) => terms.some((term) => value.includes(term)));

  if (filterId === "journals") return includesAny(["journal"]);
  if (filterId === "manuscripts") return includesAny(["manuscript"]);
  if (filterId === "letters") return includesAny(["letter", "correspondence"]);
  if (filterId === "cryptic-codes") return includesAny(["cipher", "cryptic", "code"]);
  if (filterId === "fragments") return includesAny(["fragment", "unstable"]);
  if (filterId === "blood-moon") return includesAny(["blood moon", "blood_moon", "bloodmoon"]);
  if (filterId === "the-veil") return includesAny(["veil"]);

  return true;
}

function getShelvesResultSet() {
  const query = shelvesSearchQuery.trim().toLowerCase();

  return getShelvesDocuments().filter((document) => {
    if (shelvesActiveResearchTrailId) {
      return documentMatchesShelvesResearchTrail(document, shelvesActiveResearchTrailId);
    }

    if (!documentMatchesShelvesFilter(document)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return getDocumentSearchText(document).includes(query);
  });
}

function getFeaturedShelvesDocument(documents = getShelvesResultSet()) {
  if (!documents.length) {
    return null;
  }

  if (shelvesSearchQuery || shelvesActiveFilter !== "all" || shelvesActiveResearchTrailId) {
    return documents[Math.min(shelvesActiveIndex, documents.length - 1)] || documents[0];
  }

  return documents[Math.min(shelvesActiveIndex, documents.length - 1)]
    || documents.find((document) => document.is_featured)
    || documents[0];
}

function getShelvesDocumentById(documentId) {
  return getShelvesDocuments().find((document) => getDocumentId(document) === documentId) || null;
}

function renderShelvesHero() {
  return `
    <section class="shelves-hero" aria-labelledby="shelves-title">
      <div class="shelves-hero-content">
        <p class="archive-entry__stamp">Noctis Archive</p>
        <h2 id="shelves-title">The Shelves</h2>
        <p class="shelves-hero__subtitle">A library of the lost, the forbidden, and the forgotten.</p>
        <p>Search the recovered writings of Zephyra Noctis and other unknown hands. Knowledge waits in the dark.</p>
      </div>
    </section>
  `;
}

function renderShelvesSearch() {
  return `
    <section class="shelves-search-panel" aria-labelledby="shelves-search-title">
      <div class="shelves-search-panel__heading">
        <p class="archive-entry__stamp">Search the Shelves</p>
        <h3 id="shelves-search-title">Find writings, fragments, letters, and more.</h3>
      </div>
      <label class="shelves-search-field">
        <span class="sr-only">Search titles, authors, keywords, symbols, or shelf marks</span>
        <input type="search" value="${escapeHtml(shelvesSearchQuery)}" placeholder="Search titles, authors, keywords, symbols..." data-shelves-search />
      </label>
        <div class="shelves-filter-strip" aria-label="Shelves filters">
          <div class="shelves-filter-wrap">
            <button class="shelves-filter-nav shelves-filter-nav--prev" type="button" data-shelves-filter-nav="previous" aria-label="Scroll filter links left">
              <span class="sr-only">Previous filters</span>
            </button>
            <div class="shelves-filter-scroll">
              <div class="shelves-filter-list shelves-filter-row" data-shelves-filter-row aria-label="Shelves filter links">
                ${shelvesFilterOptions.map((filter) => `
                  <button class="shelves-filter-chip${isShelvesFilterChipActive(filter.id) ? " is-active" : ""}" type="button" data-shelves-filter="${escapeHtml(filter.id)}" aria-pressed="${isShelvesFilterChipActive(filter.id) ? "true" : "false"}">
                    ${escapeHtml(filter.label)}
                  </button>
                `).join("")}
              </div>
            </div>
            <button class="shelves-filter-nav shelves-filter-nav--next" type="button" data-shelves-filter-nav="next" aria-label="Scroll filter links right">
              <span class="sr-only">Next filters</span>
            </button>
          </div>
        </div>
        <p class="shelves-filter-hint">Swipe to reveal more filters.</p>
      ${shelvesDocumentsError ? `<p class="shelves-load-state">${escapeHtml(shelvesDocumentsError)}</p>` : ""}
    </section>
  `;
}

function renderShelvesReadingDesk(document, documents) {
  const currentResults = Array.isArray(documents) ? documents : [];

  if (!currentResults.length) {
    return `
      <section class="shelves-reading-desk is-empty">
        <div class="shelves-reading-empty">
          <p class="shelves-section-kicker">Reading Desk</p>
          <h2 id="shelves-reading-title">No records answered.</h2>
          <p>The shelves shifted, but nothing stepped forward. Try another phrase, shelf mark, or forgotten name.</p>
          <p class="shelves-empty-note">The Archive may still be listening.</p>
        </div>
      </section>
    `;
  }

  if (!document) {
    return `
      <section class="shelves-reading-desk is-empty">
        <div class="shelves-reading-empty">
          <p class="shelves-section-kicker">Reading Desk</p>
          <h2 id="shelves-reading-title">No records answered.</h2>
          <p>The shelves shifted, but nothing stepped forward. Try another phrase, shelf mark, or forgotten name.</p>
          <p class="shelves-empty-note">The Archive may still be listening.</p>
        </div>
      </section>
    `;
  }

  const currentIndex = Math.max(0, documents.findIndex((item) => getDocumentId(item) === getDocumentId(document)));
  const locked = isNoctisDocumentLocked(document);
  const previewText = locked
    ? "This record is sealed. Its body will remain unread until the proper access is recovered."
    : getDocumentExcerpt(document);

  return `
    <section class="shelves-reading-desk${locked ? " is-locked" : ""}" aria-labelledby="shelves-reading-title">
      <div class="shelves-reading-desk__copy shelves-reading-content">
        <p class="archive-entry__stamp">Reading Desk</p>
        <p class="shelves-reading-desk__label">${shelvesSearchQuery ? "Search Result" : "Featured Fragment"}</p>
        <h3 id="shelves-reading-title" class="shelves-reading-title">${escapeHtml(document.title || "Untitled Document")}</h3>
        <p class="shelves-reading-desk__author">${escapeHtml(document.author || "Unknown Hand")}</p>
        <p class="shelves-reading-excerpt">${escapeHtml(previewText)}</p>
        <div class="shelves-reading-desk__actions shelves-reading-actions">
          <button type="button" class="shelves-btn shelves-read-btn shelves-read-fragment-btn" data-action="read-fragment" data-shelves-document-id="${escapeHtml(getDocumentId(document))}">${locked ? "View Seal" : "Read Fragment"}</button>
          <button type="button" class="shelves-btn shelves-details-btn shelves-view-details-btn" data-action="view-details" data-shelves-document-id="${escapeHtml(getDocumentId(document))}">View Details</button>
        </div>
      </div>
      <figure class="shelves-reading-desk__art" aria-hidden="true">
        <img src="${escapeHtml(document.cover_image || "assets/images/noctis/recovered-code.png")}" alt="" width="900" height="600" loading="lazy" decoding="async" />
      </figure>
      <div class="shelves-reading-desk__controls shelves-reading-controls" aria-label="Browse current document results">
        <button type="button" data-shelves-nav="previous" ${documents.length <= 1 ? "disabled" : ""}>Previous</button>
        <span>${documents.length ? `${currentIndex + 1} of ${documents.length}` : "0 of 0"}</span>
        <button type="button" data-shelves-nav="next" ${documents.length <= 1 ? "disabled" : ""}>Next</button>
      </div>
    </section>
  `;
}

function renderShelvesBrowseCards() {
  return `
    <section class="shelves-browse-section" aria-labelledby="shelves-browse-title">
      <p class="archive-entry__stamp" id="shelves-browse-title">Browse the Archive</p>
      <div class="shelves-category-grid" aria-label="Browse the Archive category links">
        ${shelvesBrowseCards.map((card) => {
          const count = getShelvesBrowseCardCount(card);
          const isActive = shelvesActiveFilter === card.filter;

          return `
          <button class="shelves-category-card${isActive ? " is-active" : ""}" type="button" data-shelves-browse="${escapeHtml(card.filter)}" aria-pressed="${isActive ? "true" : "false"}">
            <span>${escapeHtml(card.title)}</span>
            <p>${escapeHtml(card.description)}</p>
            <div class="shelves-category-card__footer">
              <span class="shelves-category-card__divider" aria-hidden="true"></span>
              <span class="shelves-category-card__count${count ? "" : " is-empty"}">${escapeHtml(formatShelvesDocumentCount(count))}</span>
            </div>
          </button>
        `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderShelvesFindingAids() {
  return `
    <section class="shelves-finding-aids" aria-labelledby="shelves-aids-title">
      <p class="archive-entry__stamp" id="shelves-aids-title">Finding Aids & Indexes</p>
      <div class="shelves-aids-grid" aria-label="Finding aids and indexes links">
        ${shelvesFindingAids.map((card) => `
          <article class="shelves-aid-tile">
            <button
              class="shelves-aid-image-card"
              type="button"
              data-aid-action="${escapeHtml(card.id)}"
              aria-label="${escapeHtml(card.title)}. ${escapeHtml(card.description)}"
            >
              <img
                src="${escapeHtml(card.image)}"
                alt="${escapeHtml(card.title)}"
                loading="lazy"
                decoding="async"
              />
            </button>
            <button type="button" class="shelves-aid-cta" data-aid-action="${escapeHtml(card.id)}">${escapeHtml(card.action)} <span class="shelves-aid-arrow" aria-hidden="true"></span></button>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function getShelvesAidDocuments() {
  return getShelvesDocuments().filter(isCountableShelvesDocument);
}

function formatShelvesDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function renderShelvesAidListItem(document, { mode = "index" } = {}) {
  const shelfMark = document.shelf_mark || "Unmarked";
  const typeLabel = formatShelvesLabel(document.document_type || document.category, "Unclassified");
  const author = document.author || "Unknown Hand";
  const dateLabel = formatShelvesDate(document.created_at);
  const metaParts = [typeLabel, author];

  if (mode === "recent" && dateLabel) {
    metaParts.push(dateLabel);
  }

  return `
    <button class="shelves-aid-list-item" type="button" data-shelves-aid-document="${escapeHtml(getDocumentId(document))}">
      <span class="shelves-aid-mark">${escapeHtml(mode === "recent" ? dateLabel || shelfMark : shelfMark)}</span>
      <span>
        <span class="shelves-aid-title">${escapeHtml(document.title || "Untitled Document")}</span>
        <span class="shelves-aid-meta">${escapeHtml(metaParts.join(" · "))}</span>
      </span>
    </button>
  `;
}

function renderShelvesAidDialog({ title, description, body = "", footer = "", list = "" }) {
  return `
    <div class="shelves-aid-modal" role="presentation">
      <button class="shelves-aid-backdrop" type="button" data-close-shelves-aid aria-label="Close ${escapeHtml(title)}"></button>
      <article class="shelves-aid-dialog" role="dialog" aria-modal="true" aria-labelledby="shelves-aid-title">
        <button class="shelves-aid-close" type="button" data-close-shelves-aid aria-label="Return from ${escapeHtml(title)}">Return</button>
        <h2 id="shelves-aid-title">${escapeHtml(title)}</h2>
        <p>${escapeHtml(description)}</p>
        ${body}
        ${list}
        ${footer ? `<p class="shelves-aid-footer">${escapeHtml(footer)}</p>` : ""}
      </article>
    </div>
  `;
}

function renderShelfIndexModal() {
  const pageSize = 10;
  const documents = getShelvesAidDocuments()
    .slice()
    .sort((first, second) => {
      const firstMark = String(first.shelf_mark || "").trim();
      const secondMark = String(second.shelf_mark || "").trim();

      if (firstMark && !secondMark) return -1;
      if (!firstMark && secondMark) return 1;

      return firstMark.localeCompare(secondMark) || String(first.title || "").localeCompare(String(second.title || ""));
    });
  const totalPages = Math.max(1, Math.ceil(documents.length / pageSize));
  shelvesAidPageIndex = Math.min(Math.max(0, shelvesAidPageIndex), totalPages - 1);
  const pageDocuments = documents.slice(shelvesAidPageIndex * pageSize, (shelvesAidPageIndex + 1) * pageSize);
  const pagination = documents.length > pageSize
    ? `
      <div class="shelves-aid-pagination" aria-label="Shelf Index pages">
        <button type="button" data-shelves-aid-page="previous" ${shelvesAidPageIndex <= 0 ? "disabled" : ""}>Previous</button>
        <span>Page ${shelvesAidPageIndex + 1} of ${totalPages}</span>
        <button type="button" data-shelves-aid-page="next" ${shelvesAidPageIndex >= totalPages - 1 ? "disabled" : ""}>Next</button>
      </div>
    `
    : "";

  const list = documents.length
    ? `<div class="shelves-aid-list">${pageDocuments.map((document) => renderShelvesAidListItem(document)).join("")}</div>${pagination}`
    : `
      <div class="shelves-aid-empty">
        <strong>No shelf marks have answered yet.</strong>
        <p>The Archive has not released enough records to build an index.</p>
      </div>
    `;

  return renderShelvesAidDialog({
    title: "Shelf Index",
    description: "Browse the Archive by shelf mark and classification.",
    list
  });
}

function renderRecentDiscoveriesModal() {
  const documents = getShelvesAidDocuments()
    .slice()
    .sort((first, second) => new Date(second.created_at || 0).getTime() - new Date(first.created_at || 0).getTime())
    .slice(0, 8);

  const list = documents.length
    ? `<div class="shelves-aid-list">${documents.map((document) => renderShelvesAidListItem(document, { mode: "recent" })).join("")}</div>`
    : `
      <div class="shelves-aid-empty">
        <strong>Nothing recent has surfaced.</strong>
        <p>The Archive is quiet, but not empty.</p>
      </div>
    `;

  return renderShelvesAidDialog({
    title: "Recent Discoveries",
    description: "The latest records and pieces recovered from the Archive.",
    list
  });
}

function renderDormantAidModal(aidId) {
  if (aidId === "code-ledger") {
    return renderShelvesAidDialog({
      title: "Code Ledger",
      description: "The Code Ledger is still being assembled.",
      body: "<p>Recovered phrases, cipher keys, and broken symbols will gather here as the Archive expands.</p>",
      footer: "Some locks are waiting for their language."
    });
  }

  return renderShelvesAidDialog({
    title: "Cross-References",
    description: "No threads have tightened yet.",
    body: "<p>As more records are recovered, this ledger will reveal connections between documents, authors, rooms, and events.</p>",
    footer: "The Archive remembers relationships before it reveals them."
  });
}

function renderShelvesAidModal() {
  if (openShelvesAidModalId === "shelf-index") {
    return renderShelfIndexModal();
  }

  if (openShelvesAidModalId === "recent-discoveries") {
    return renderRecentDiscoveriesModal();
  }

  if (openShelvesAidModalId === "code-ledger" || openShelvesAidModalId === "cross-references") {
    return renderDormantAidModal(openShelvesAidModalId);
  }

  return "";
}

function renderShelvesCompactDocumentRow(document) {
  return `
    <article class="shelves-document-row">
      <strong>${escapeHtml(document.title || "Untitled Document")}</strong>
      <span>${escapeHtml(document.author || "Unknown Hand")} • ${escapeHtml(document.document_type || document.category || "Document")}</span>
    </article>
  `;
}

function renderShelvesRecentlyReadEmptyState() {
  return `
    <div class="shelves-recent-empty">
      <strong>No documents read yet.</strong>
      <span>Open a fragment and it will appear here.</span>
    </div>
  `;
}

function renderShelvesRecentlyReadRow({ document, entry }, { showDetails = false } = {}) {
  const documentId = getDocumentId(document);
  const meta = `${getCleanShelvesAuthor(document)} · ${getShelvesDocumentTypeLabel(document)}`;
  const detailParts = [
    document.shelf_mark || "",
    showDetails ? formatShelvesRecentTimestamp(entry.lastReadAt) : ""
  ].filter(Boolean);

  return `
    <button class="shelves-recent-row" type="button" data-shelves-recent-open="${escapeHtml(documentId)}">
      <span class="shelves-recent-row__marker" aria-hidden="true"></span>
      <span class="shelves-recent-row__copy">
        <strong>${escapeHtml(document.title || "Untitled Document")}</strong>
        <span>${escapeHtml(meta)}</span>
        ${detailParts.length ? `<em>${escapeHtml(detailParts.join(" · "))}</em>` : ""}
      </span>
    </button>
  `;
}

function renderShelvesRecentlyReadPanel() {
  const recentItems = getShelvesRecentlyReadDocuments(3);

  return `
    <article class="shelves-bottom-panel shelves-recently-read-panel">
      <div class="shelves-panel-heading shelves-recently-read-header">
        <h3>Recently Read</h3>
        ${recentItems.length ? `<button class="shelves-recent-view-all" type="button" data-shelves-recent-view-all>View All</button>` : ""}
      </div>
      <div class="shelves-recent-list">
        ${recentItems.length ? recentItems.map((item) => renderShelvesRecentlyReadRow(item)).join("") : renderShelvesRecentlyReadEmptyState()}
      </div>
    </article>
  `;
}

function renderShelvesRecentlyReadModal() {
  if (!isShelvesRecentModalOpen) {
    return "";
  }

  const recentItems = getShelvesRecentlyReadDocuments(10);

  return `
    <div class="shelves-recent-modal" role="presentation">
      <button class="shelves-recent-modal__backdrop" type="button" data-close-shelves-recent-modal aria-label="Close Recently Read"></button>
      <article class="shelves-recent-dialog" role="dialog" aria-modal="true" aria-labelledby="shelves-recent-modal-title">
        <button class="shelves-recent-modal__close" type="button" data-close-shelves-recent-modal aria-label="Close Recently Read">Close</button>
        <div class="shelves-recent-dialog__header">
          <p>The last fragments you opened in the Shelves.</p>
          <h2 id="shelves-recent-modal-title">Recently Read</h2>
        </div>
        <div class="shelves-recent-dialog__list">
          ${recentItems.length ? recentItems.map((item) => renderShelvesRecentlyReadRow(item, { showDetails: true })).join("") : renderShelvesRecentlyReadEmptyState()}
        </div>
      </article>
    </div>
  `;
}

function getSavedShelvesDocuments() {
  return getShelvesDocuments()
    .filter((document) => document?.id && shelvesSavedDocumentsState.savedIds.has(String(document.id)))
    .sort((first, second) => {
      const firstSavedAt = Date.parse(shelvesSavedDocumentsState.savedAt.get(String(first.id)) || 0);
      const secondSavedAt = Date.parse(shelvesSavedDocumentsState.savedAt.get(String(second.id)) || 0);

      return secondSavedAt - firstSavedAt;
    });
}

function isShelvesDocumentSavePending(document) {
  return Boolean(document?.id && shelvesSavedDocumentsState.pendingIds.has(String(document.id)));
}

function renderShelvesSavedNotice() {
  const notice = shelvesSavedDocumentsState.notice;

  if (!notice?.message) {
    return "";
  }

  return `<p class="shelves-saved-documents-notice shelves-saved-documents-notice--${escapeHtml(notice.tone || "info")}" role="status">${escapeHtml(notice.message)}</p>`;
}

function renderShelvesNotableEmptyState() {
  return `
    <div class="shelves-notable-empty">
      <strong>No documents saved yet.</strong>
      <span>Read a fragment and save it here to return later.</span>
    </div>
  `;
}

function renderShelvesSavedDocumentRow(document) {
  const documentId = getDocumentId(document);
  const typeLabel = formatShelvesLabel(document.document_type || document.category, "Document");
  const metaParts = [
    document.author || "Unknown Hand",
    typeLabel
  ].filter(Boolean);
  const pending = isShelvesDocumentSavePending(document);

  return `
    <article class="shelves-notable-row">
      <button class="shelves-notable-row__main" type="button" data-shelves-notable-open="${escapeHtml(documentId)}">
        ${document.cover_image ? `
          <span class="shelves-notable-row__thumb" aria-hidden="true">
            <img src="${escapeHtml(document.cover_image)}" alt="" loading="lazy" decoding="async" />
          </span>
        ` : `<span class="shelves-notable-row__mark" aria-hidden="true">§</span>`}
        <span class="shelves-notable-row__copy">
          <strong>${escapeHtml(document.title || "Untitled Document")}</strong>
          <span>${escapeHtml(metaParts.join(" · "))}</span>
          ${document.shelf_mark ? `<em>${escapeHtml(document.shelf_mark)}</em>` : ""}
        </span>
      </button>
      <button class="shelves-notable-row__remove" type="button" data-shelves-unsave-document="${escapeHtml(documentId)}" aria-label="${escapeHtml(`Remove ${document.title || "document"} from Notable Documents`)}" ${pending ? "disabled" : ""}>
        ${pending ? "Removing" : "Remove"}
      </button>
    </article>
  `;
}

function renderShelvesNotableDocumentsPanel() {
  const savedDocuments = getSavedShelvesDocuments();
  const visibleDocuments = savedDocuments.slice(0, 3);
  const body = shelvesSavedDocumentsState.isLoading
    ? `<div class="shelves-notable-empty"><strong>Gathering saved documents...</strong></div>`
    : savedDocuments.length
      ? visibleDocuments.map(renderShelvesSavedDocumentRow).join("")
      : renderShelvesNotableEmptyState();

  return `
    <article class="shelves-bottom-panel shelves-notable-documents-panel">
      <div class="shelves-panel-heading shelves-notable-header">
        <h3>Notable Documents</h3>
        ${savedDocuments.length ? `<button class="shelves-notable-view-all" type="button" data-shelves-notable-view-all>View All</button>` : ""}
      </div>
      ${shelvesSavedDocumentsState.error ? `<p class="shelves-saved-documents-error">${escapeHtml(shelvesSavedDocumentsState.error)}</p>` : ""}
      <div class="shelves-notable-list">
        ${body}
      </div>
      ${renderShelvesSavedNotice()}
    </article>
  `;
}

function renderShelvesNotableModal() {
  if (!isShelvesNotableModalOpen) {
    return "";
  }

  const savedDocuments = getSavedShelvesDocuments();
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(savedDocuments.length / pageSize));
  shelvesNotablePageIndex = Math.min(Math.max(0, shelvesNotablePageIndex), totalPages - 1);
  const pageDocuments = savedDocuments.slice(shelvesNotablePageIndex * pageSize, (shelvesNotablePageIndex + 1) * pageSize);
  const pagination = savedDocuments.length > pageSize
    ? `
      <div class="shelves-notable-pagination" aria-label="Notable Documents pages">
        <button type="button" data-shelves-notable-page="previous" ${shelvesNotablePageIndex <= 0 ? "disabled" : ""}>Previous</button>
        <span>Page ${shelvesNotablePageIndex + 1} of ${totalPages}</span>
        <button type="button" data-shelves-notable-page="next" ${shelvesNotablePageIndex >= totalPages - 1 ? "disabled" : ""}>Next</button>
      </div>
    `
    : "";
  const body = savedDocuments.length
    ? pageDocuments.map(renderShelvesSavedDocumentRow).join("")
    : renderShelvesNotableEmptyState();

  return `
    <div class="shelves-notable-modal" role="presentation">
      <button class="shelves-notable-modal__backdrop" type="button" data-close-shelves-notable-modal aria-label="Close Notable Documents"></button>
      <article class="shelves-notable-dialog" role="dialog" aria-modal="true" aria-labelledby="shelves-notable-modal-title">
        <button class="shelves-notable-modal__close" type="button" data-close-shelves-notable-modal aria-label="Close Notable Documents">Close</button>
        <div class="shelves-notable-dialog__header">
          <p>Saved fragments and writings you marked for return.</p>
          <h2 id="shelves-notable-modal-title">Notable Documents</h2>
        </div>
        <div class="shelves-notable-dialog__list">
          ${body}
        </div>
        ${pagination}
        ${renderShelvesSavedNotice()}
      </article>
    </div>
  `;
}

function renderShelvesResearchTrailRow(trail, { showCount = false } = {}) {
  const isActive = shelvesActiveResearchTrailId === trail.id;
  const count = showCount ? getShelvesResearchTrailCount(trail) : null;
  const countLabel = showCount ? formatShelvesDocumentCount(count) : "";

  return `
    <button class="shelves-research-trail-row${isActive ? " is-active" : ""}" type="button" data-shelves-research-trail="${escapeHtml(trail.id)}" aria-pressed="${isActive ? "true" : "false"}">
      <span class="shelves-research-trail-row__dot" aria-hidden="true"></span>
      <span class="shelves-research-trail-row__copy">
        <strong>${escapeHtml(trail.title)}</strong>
        <span>${escapeHtml(showCount && countLabel ? `${trail.description} · ${countLabel}` : trail.description)}</span>
      </span>
    </button>
  `;
}

function renderShelvesResearchTrailsPanel() {
  const defaultTrails = shelvesResearchTrails.slice(0, 3);

  return `
    <article class="shelves-bottom-panel shelves-research-trails">
      <div class="shelves-panel-heading shelves-research-trails__header">
        <h3>Research Trails</h3>
        <button class="shelves-research-trails__action" type="button" data-shelves-research-explore-all>Explore All</button>
      </div>
      <div class="shelves-research-trails__list">
        ${defaultTrails.map((trail) => renderShelvesResearchTrailRow(trail)).join("")}
      </div>
    </article>
  `;
}

function renderShelvesResearchTrailsModal() {
  if (!isShelvesResearchModalOpen) {
    return "";
  }

  return `
    <div class="shelves-research-modal" role="presentation">
      <button class="shelves-research-modal__backdrop" type="button" data-close-shelves-research-modal aria-label="Close Research Trails"></button>
      <article class="shelves-research-dialog" role="dialog" aria-modal="true" aria-labelledby="shelves-research-modal-title">
        <button class="shelves-research-modal__close" type="button" data-close-shelves-research-modal aria-label="Close Research Trails">Close</button>
        <div class="shelves-research-dialog__header">
          <p>Curated topic paths through the shelves.</p>
          <h2 id="shelves-research-modal-title">Research Trails</h2>
        </div>
        <div class="shelves-research-dialog__list">
          ${shelvesResearchTrails.map((trail) => renderShelvesResearchTrailRow(trail, { showCount: true })).join("")}
        </div>
      </article>
    </div>
  `;
}

function renderShelvesBottomSections() {
  return `
    <section class="shelves-bottom-grid" aria-label="Shelves document summaries">
      ${renderShelvesRecentlyReadPanel()}
      ${renderShelvesNotableDocumentsPanel()}
      ${renderShelvesResearchTrailsPanel()}
    </section>
  `;
}

function renderReadFragmentModal() {
  const document = getShelvesDocumentById(openShelvesReadDocumentId);

  if (!document) {
    return "";
  }

  const locked = isNoctisDocumentLocked(document);
  const typeLabel = formatShelvesLabel(document.document_type || document.subtitle, "Journal Fragment");
  const bodyMarkup = locked
    ? `<p>This document is sealed. ${escapeHtml(document.unlock_requirement || "Additional access is required.")}</p>`
    : getDocumentBodyText(document).split(/\n{2,}/).filter(Boolean).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("") || `<p>${escapeHtml(getDocumentExcerpt(document))}</p>`;
  const saved = isShelvesDocumentSaved(document);
  const pending = isShelvesDocumentSavePending(document);
  const saveAction = saved ? "unsave" : "save";
  const saveLabel = pending
    ? (saved ? "Removing..." : "Saving...")
    : saved
      ? "Remove from Notable Documents"
      : "Save to Notable Documents";

  return `
    <div class="shelves-read-modal" role="presentation">
      <button class="shelves-modal-backdrop" type="button" data-close-shelves-modal aria-label="Close reading fragment"></button>
      <article class="shelves-read-dialog" role="dialog" aria-modal="true" aria-labelledby="shelves-read-title">
        <button class="shelves-modal-close" type="button" data-close-shelves-modal aria-label="Return from reading fragment">Return</button>
        <p class="shelves-modal-kicker">${escapeHtml(typeLabel)}</p>
        <h2 class="shelves-read-title" id="shelves-read-title">${escapeHtml(document.title || "Untitled Document")}</h2>
        <p class="shelves-read-author">${escapeHtml(document.author || "Unknown Hand")}</p>
        <div class="shelves-read-body">
          ${bodyMarkup}
        </div>
        <div class="shelves-read-save-footer">
          <button
            class="shelves-save-document-btn${saved ? " is-saved" : ""}"
            type="button"
            data-shelves-${escapeHtml(saveAction)}-document="${escapeHtml(getDocumentId(document))}"
            ${pending ? "disabled" : ""}
            aria-pressed="${saved ? "true" : "false"}"
          >
            ${escapeHtml(saveLabel)}
          </button>
          ${renderShelvesSavedNotice()}
        </div>
        <p class="shelves-read-footer">Recovered from The Shelves &middot; ${escapeHtml(document.shelf_mark || "Unmarked")}</p>
      </article>
    </div>
  `;
}

function renderDocumentDetailsModal() {
  const document = getShelvesDocumentById(openShelvesDetailsDocumentId);

  if (!document) {
    return "";
  }

  const tags = normalizeDocumentListField(document.tags);
  const themes = normalizeDocumentListField(document.themes);
  const metadata = [
    ["Type", formatShelvesLabel(document.document_type || document.subtitle, "Recovered Document")],
    ["Author", document.author || "Unknown Hand"],
    ["Category", formatShelvesLabel(document.category, "Unclassified")],
    ["Shelf Mark", document.shelf_mark || "Unmarked"],
    ["Status", getShelvesDocumentStatus(document)],
    ["Unlock", getShelvesDocumentUnlockLabel(document)],
    ["Themes", themes.join(", ") || "Unlisted"],
    ["Tags", tags.join(", ") || "Unlisted"]
  ];

  return `
    <div class="shelves-details-modal" role="presentation">
      <button class="shelves-modal-backdrop" type="button" data-close-shelves-modal aria-label="Close archive record"></button>
      <article class="shelves-details-dialog" role="dialog" aria-modal="true" aria-labelledby="shelves-details-title">
        <button class="shelves-modal-close" type="button" data-close-shelves-modal aria-label="Return from archive record">Return</button>
        <p class="shelves-modal-kicker">Archive Record</p>
        <h2 class="shelves-details-title" id="shelves-details-title">${escapeHtml(document.title || "Untitled Document")}</h2>
        <dl class="shelves-details-grid">
          ${metadata.map(([label, value]) => `
            <div>
              <dt>${escapeHtml(label)}</dt>
              <dd>${escapeHtml(value)}</dd>
            </div>
          `).join("")}
        </dl>
        <p class="shelves-details-summary">${escapeHtml(getDocumentExcerpt(document))}</p>
      </article>
    </div>
  `;
}

function renderShelvesRoom() {
  const documents = getShelvesResultSet();
  const activeDocument = getFeaturedShelvesDocument(documents);

  if (shelvesActiveIndex >= documents.length) {
    shelvesActiveIndex = 0;
  }

  if (openShelvesReadDocumentId && !getShelvesDocumentById(openShelvesReadDocumentId)) {
    openShelvesReadDocumentId = "";
  }

  if (openShelvesDetailsDocumentId && !getShelvesDocumentById(openShelvesDetailsDocumentId)) {
    openShelvesDetailsDocumentId = "";
  }

  if (openShelvesAidModalId && !shelvesFindingAids.some((card) => card.id === openShelvesAidModalId)) {
    openShelvesAidModalId = "";
  }

  return `
    <div class="shelves-page-shell">
      <section class="shelves-grid">
        ${renderShelvesHero()}
        ${renderShelvesSearch()}
        ${renderShelvesReadingDesk(activeDocument, documents)}
        ${renderShelvesBrowseCards()}
        ${renderShelvesFindingAids()}
        ${renderShelvesBottomSections()}
        <p class="shelves-closing-quote">“Knowledge does not belong to the light. It waits in the stacks.”<br />— Zephyra Noctis</p>
        ${renderReadFragmentModal()}
        ${renderDocumentDetailsModal()}
        ${renderShelvesAidModal()}
        ${renderShelvesRecentlyReadModal()}
        ${renderShelvesNotableModal()}
        ${renderShelvesResearchTrailsModal()}
      </section>
    </div>
  `;
}

function renderVisualRecordCard(record) {
  return `
    <figure class="archive-visual-record protected-media" data-protected-media="true" draggable="false">
      <button class="archive-visual-record__preview" type="button" data-visual-record="${escapeHtml(record.id)}" aria-label="${escapeHtml(`View ${record.title} full size`)}">
        <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} visual record" width="${record.width || ARCHIVE_ARTWORK_WIDTH}" height="${record.height || ARCHIVE_ARTWORK_HEIGHT}" loading="lazy" decoding="async" draggable="false" onerror="this.closest('.archive-visual-record').classList.add('is-image-missing'); this.remove();" />
        <span class="archive-visual-record__missing">Record unavailable</span>
      </button>
      <figcaption>
        <span>${escapeHtml(record.label)}</span>
        <strong>${escapeHtml(record.title)}</strong>
      </figcaption>
    </figure>
  `;
}

function getSelectedGalleryRecord() {
  if (!galleryVisualRecords.length) {
    return null;
  }

  const safeIndex = ((selectedGalleryRecordIndex % galleryVisualRecords.length) + galleryVisualRecords.length) % galleryVisualRecords.length;
  selectedGalleryRecordIndex = safeIndex;

  return galleryVisualRecords[safeIndex];
}

function moveGalleryRecord(direction) {
  if (!galleryVisualRecords.length) {
    return;
  }

  const offset = direction === "previous" ? -1 : 1;
  selectedGalleryRecordIndex = (selectedGalleryRecordIndex + offset + galleryVisualRecords.length) % galleryVisualRecords.length;
  renderArchiveRooms();
}

function renderGalleryRecordViewer() {
  const record = getSelectedGalleryRecord();

  if (!record) {
    return "";
  }

  const counter = `${selectedGalleryRecordIndex + 1} of ${galleryVisualRecords.length}`;

  return `
    <div class="archive-gallery-viewer" data-gallery-carousel>
      <button class="archive-gallery-viewer__nav" type="button" data-gallery-record-nav="previous" aria-label="Previous visual record">‹</button>
      <figure class="archive-gallery-record protected-media" data-protected-media="true" draggable="false">
        <button class="archive-gallery-record__image-button" type="button" data-visual-record="${escapeHtml(record.id)}" aria-label="${escapeHtml(`Open visual record ${selectedGalleryRecordIndex + 1} full size`)}">
          <img src="${escapeHtml(record.image)}" alt="${escapeHtml(`Unknown visual record ${selectedGalleryRecordIndex + 1}`)}" width="${record.width || ARCHIVE_ARTWORK_WIDTH}" height="${record.height || ARCHIVE_ARTWORK_HEIGHT}" loading="lazy" decoding="async" draggable="false" />
        </button>
        <figcaption>
          <span>Visual Record</span>
          <strong>Unknown</strong>
          <p>The Archive has recovered the image, but not its name.</p>
          <em>${escapeHtml(counter)}</em>
        </figcaption>
      </figure>
      <button class="archive-gallery-viewer__nav" type="button" data-gallery-record-nav="next" aria-label="Next visual record">›</button>
    </div>
  `;
}

function getOpenVisualRecord() {
  return galleryVisualRecords.find((record) => record.id === openVisualRecordId) || null;
}

function getOpenVisualRecordIndex() {
  return galleryVisualRecords.findIndex((record) => record.id === openVisualRecordId);
}

function moveVisualRecord(direction) {
  const currentIndex = getOpenVisualRecordIndex();

  if (currentIndex < 0 || !galleryVisualRecords.length) {
    return;
  }

  const offset = direction === "previous" ? -1 : 1;
  const nextIndex = (currentIndex + offset + galleryVisualRecords.length) % galleryVisualRecords.length;
  openVisualRecordId = galleryVisualRecords[nextIndex].id;
  renderArchiveRooms();
}

function renderVisualRecordModal() {
  const record = getOpenVisualRecord();

  if (!record) {
    return "";
  }

  return `
    <div class="visual-record-modal is-open" role="presentation">
      <button class="visual-record-modal__backdrop" type="button" data-visual-record-close aria-label="Close visual record"></button>
      <article class="visual-record-modal__dialog" role="dialog" aria-modal="true" aria-label="Expanded visual record">
        <button class="visual-record-modal__close" type="button" data-visual-record-close aria-label="Close visual record">
          <span class="close-circle-icon" aria-hidden="true"></span>
        </button>
        <figure class="visual-record-modal__image-frame protected-media" data-protected-media="true">
          <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} visual record" width="${record.width || ARCHIVE_ARTWORK_WIDTH}" height="${record.height || ARCHIVE_ARTWORK_HEIGHT}" loading="eager" decoding="async" draggable="false" />
        </figure>
      </article>
    </div>
  `;
}

function renderGalleryCategoryRows() {
  return galleryCategoryPlaceholders.slice(0, 5).map(([label]) => {
    const isActive = galleryActiveFilter === label;

    return `
    <button class="gallery-filter-chip${isActive ? " is-active" : ""}" type="button" data-gallery-filter="${escapeHtml(label)}" aria-pressed="${isActive ? "true" : "false"}">
      <span class="gallery-category-row__icon" aria-hidden="true"></span>
      <span>${escapeHtml(label)}</span>
    </button>
  `;
  }).join("");
}

function renderGalleryMoreFilters() {
  return galleryCategoryPlaceholders.slice(5).map(([label]) => {
    const isActive = galleryActiveFilter === label;

    return `
    <button class="gallery-filter-more__item${isActive ? " is-active" : ""}" type="button" role="menuitem" data-gallery-filter="${escapeHtml(label)}" aria-pressed="${isActive ? "true" : "false"}">
      <span class="gallery-category-row__icon" aria-hidden="true"></span>
      <span>${escapeHtml(label)}</span>
    </button>
  `;
  }).join("");
}

function mergeGallerySourceRecords(records, extraRecords = []) {
  const seen = new Set();

  return [...records, ...extraRecords].filter((record) => {
    const id = String(record?.id || record?.slug || "");

    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

function getCompletedGalleryVisualTrailRecords() {
  if (!galleryUserState.user) {
    return [];
  }

  return galleryVisualTrailState.trails
    .filter((trail) => {
      if (!trail?.id || !trail.full_image_url) {
        return false;
      }

      const fragments = galleryVisualTrailState.fragmentsByTrailId.get(String(trail.id)) || [];
      const recoveredIds = galleryVisualTrailState.recoveredIdsByTrailId.get(String(trail.id)) || new Set();
      const total = Number(trail.total_fragments || fragments.length || 4);

      return recoveredIds.size >= total;
    })
    .map((trail) => {
      const normalizedTrail = getGalleryVisualTrailViewModel(trail);

      return {
        id: `visual-trail-${trail.id}`,
        slug: trail.slug || `visual-trail-${trail.id}`,
        title: normalizedTrail.title || "Restored Visual Trail",
        description: normalizedTrail.description || "",
        lore_note: normalizedTrail.description || "",
        category: "Unknown Records",
        image: trail.preview_image_url || normalizedTrail.fullImage,
        previewImage: trail.preview_image_url || normalizedTrail.fullImage,
        preview_image_url: trail.preview_image_url || normalizedTrail.fullImage,
        fullImage: normalizedTrail.fullImage,
        full_image_url: normalizedTrail.fullImage,
        recordType: "unknown",
        record_type: "unknown",
        status: "recovered",
        origin: "Visual Trail",
        relatedRoom: "The Gallery",
        related_room: "The Gallery",
        is_active: true,
        is_featured: false,
        tags: ["Unknown Records", "Recovered", "Visual Trail"],
        themes: ["Visual Trail"],
        display_layout: "standard",
        recovered: true,
        sealed: false,
        marked: false,
        variant: "standard",
        isVirtualTrailRecord: true
      };
    });
}

function syncSelectedGalleryVisualTrail(trailId = galleryVisualTrailState.selectedTrailId) {
  const selectedTrail = galleryVisualTrailState.trails.find((trail) => String(trail.id) === String(trailId))
    || galleryVisualTrailState.trails[0]
    || null;

  galleryVisualTrailState.trail = selectedTrail;
  galleryVisualTrailState.selectedTrailId = selectedTrail?.id || "";
  galleryVisualTrailState.fragments = selectedTrail
    ? galleryVisualTrailState.fragmentsByTrailId.get(String(selectedTrail.id)) || []
    : [];
  galleryVisualTrailState.recoveredRows = selectedTrail
    ? galleryVisualTrailState.recoveredRowsByTrailId.get(String(selectedTrail.id)) || []
    : [];
  galleryVisualTrailState.recoveredIds = selectedTrail
    ? galleryVisualTrailState.recoveredIdsByTrailId.get(String(selectedTrail.id)) || new Set()
    : new Set();
}

function getGallerySourceRecords() {
  const completedTrailRecords = getCompletedGalleryVisualTrailRecords();

  if (galleryRecords.length) {
    return mergeGallerySourceRecords(galleryRecords, completedTrailRecords);
  }

  if (galleryRecordsUseFallback && galleryRecordsLoaded) {
    return mergeGallerySourceRecords(galleryRecordPlaceholders, completedTrailRecords);
  }

  if (!galleryRecordsLoaded && !galleryRecordsLoading) {
    return mergeGallerySourceRecords(galleryRecordPlaceholders, completedTrailRecords);
  }

  return completedTrailRecords;
}

function getGalleryAllBrowsableRecords() {
  const sourceRecords = getGallerySourceRecords();
  const records = sourceRecords.length ? sourceRecords : galleryRecordPlaceholders;
  const seen = new Set();

  return records.filter((record) => {
    const id = String(record?.id || record?.slug || "");

    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}

function getGalleryRecordById(recordId) {
  const id = String(recordId || "");

  return getGalleryAllBrowsableRecords().find((record) => String(record.id || record.slug) === id) || null;
}

function updateGalleryModalOpenState() {
  document.body.classList.toggle(
    "is-gallery-record-modal-open",
    Boolean(openGalleryRecordId || openGalleryUtilityModal || openGalleryTrailRestoredId || galleryTrailRevealAnimatingId)
  );
}

function isGallerySupabaseRecordId(recordId) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(recordId || ""));
}

function resetGalleryUserState() {
  galleryUserState.isLoaded = false;
  galleryUserState.isLoading = false;
  galleryUserState.user = null;
  galleryUserState.supabase = null;
  galleryUserState.recentRows = [];
  galleryUserState.markedRows = [];
  galleryUserState.recentMeta = new Map();
  galleryUserState.markedMeta = new Map();
  galleryUserState.error = "";
  galleryMarkedRecordIds.clear();
}

function getGalleryInteractionRecord(row) {
  return row?.gallery_records || row?.record || null;
}

function normalizeGalleryInteractionRows(rows, timestampKey) {
  return (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const record = getGalleryInteractionRecord(row);

      if (!record?.id) {
        return null;
      }

      return {
        row,
        record: normalizeGalleryRecord(record, 0),
        timestamp: row?.[timestampKey] || row?.created_at || ""
      };
    })
    .filter(Boolean);
}

function normalizeGalleryMarkedRows(markedRows, recordRows) {
  const recordsById = new Map((Array.isArray(recordRows) ? recordRows : [])
    .filter((record) => record?.id && record.is_active !== false)
    .map((record) => [String(record.id), normalizeGalleryRecord(record, 0)]));

  return (Array.isArray(markedRows) ? markedRows : [])
    .map((row) => {
      const record = recordsById.get(String(row?.record_id || ""));

      if (!record) {
        return null;
      }

      return {
        row,
        record,
        timestamp: row?.marked_at || row?.created_at || ""
      };
    })
    .filter(Boolean);
}

async function loadUserGalleryMarkedRecords(supabase, user) {
  const { data: markedData, error: markedError } = await supabase
    .from("user_gallery_marked_records")
    .select("record_id,marked_at,created_at")
    .eq("user_id", user.id)
    .order("marked_at", { ascending: false })
    .limit(10);

  if (markedError) {
    console.warn("Marked gallery records failed to load:", {
      message: markedError?.message,
      details: markedError?.details,
      hint: markedError?.hint,
      code: markedError?.code,
      error: markedError
    });
    return [];
  }

  const recordIds = [...new Set((markedData || []).map((row) => row.record_id).filter(Boolean))];

  if (!recordIds.length) {
    return [];
  }

  const { data: recordData, error: recordError } = await supabase
    .from("gallery_records")
    .select("*")
    .in("id", recordIds)
    .eq("is_active", true);

  if (recordError) {
    console.warn("Marked gallery records failed to load:", {
      message: recordError?.message,
      details: recordError?.details,
      hint: recordError?.hint,
      code: recordError?.code,
      error: recordError
    });
    return [];
  }

  return normalizeGalleryMarkedRows(markedData, recordData);
}

function syncGalleryMarkedIdsFromUserRows() {
  galleryMarkedRecordIds.clear();
  galleryUserState.markedMeta = new Map();
  galleryUserState.markedRows.forEach((entry) => {
    const id = String(entry.record?.id || "");

    if (id) {
      galleryMarkedRecordIds.add(id);
      galleryUserState.markedMeta.set(id, entry);
    }
  });
}

function syncGalleryRecentMetaFromUserRows() {
  galleryUserState.recentMeta = new Map();
  galleryUserState.recentRows.forEach((entry) => {
    const id = String(entry.record?.id || "");

    if (id) {
      galleryUserState.recentMeta.set(id, entry);
    }
  });
}

function resetGalleryVisualTrailState() {
  galleryVisualTrailState.isLoaded = false;
  galleryVisualTrailState.isLoading = false;
  galleryVisualTrailState.trails = [];
  galleryVisualTrailState.trail = null;
  galleryVisualTrailState.selectedTrailId = "";
  galleryVisualTrailState.trailPageIndex = 0;
  galleryVisualTrailState.fragments = [];
  galleryVisualTrailState.fragmentsByTrailId = new Map();
  galleryVisualTrailState.recoveredRows = [];
  galleryVisualTrailState.recoveredRowsByTrailId = new Map();
  galleryVisualTrailState.recoveredIds = new Set();
  galleryVisualTrailState.recoveredIdsByTrailId = new Map();
  galleryVisualTrailState.error = "";
}

async function loadGalleryVisualTrail(supabase, user = null) {
  if (!supabase) {
    resetGalleryVisualTrailState();
    galleryVisualTrailState.isLoaded = true;
    return;
  }

  galleryVisualTrailState.isLoading = true;
  galleryVisualTrailState.error = "";

  try {
    const { data: trailData, error: trailError } = await supabase
      .from("visual_trails")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (trailError) {
      throw trailError;
    }

    const trails = Array.isArray(trailData) ? trailData : [];

    if (!trails.length) {
      galleryVisualTrailState.trails = [];
      galleryVisualTrailState.fragmentsByTrailId = new Map();
      galleryVisualTrailState.recoveredRowsByTrailId = new Map();
      galleryVisualTrailState.recoveredIdsByTrailId = new Map();
      syncSelectedGalleryVisualTrail("");
      galleryVisualTrailState.isLoaded = true;
      return;
    }

    const trailIds = trails.map((trail) => trail.id).filter(Boolean);
    const { data: fragmentData, error: fragmentError } = await supabase
      .from("visual_trail_fragments")
      .select("*")
      .in("trail_id", trailIds)
      .order("fragment_number", { ascending: true });

    if (fragmentError) {
      throw fragmentError;
    }

    let recoveredRows = [];

    if (user?.id) {
      const { data: recoveredData, error: recoveredError } = await supabase
        .from("user_visual_trail_fragments")
        .select("trail_id,fragment_id,recovered_at,created_at")
        .eq("user_id", user.id)
        .in("trail_id", trailIds)
        .order("recovered_at", { ascending: true });

      if (recoveredError) {
        throw recoveredError;
      }

      recoveredRows = Array.isArray(recoveredData) ? recoveredData : [];
    }

    const fragmentsByTrailId = new Map();
    const recoveredRowsByTrailId = new Map();
    const recoveredIdsByTrailId = new Map();

    trails.forEach((trail) => {
      fragmentsByTrailId.set(String(trail.id), []);
      recoveredRowsByTrailId.set(String(trail.id), []);
      recoveredIdsByTrailId.set(String(trail.id), new Set());
    });

    (Array.isArray(fragmentData) ? fragmentData : []).forEach((fragment) => {
      const trailId = String(fragment.trail_id || "");
      fragmentsByTrailId.get(trailId)?.push(fragment);
    });

    recoveredRows.forEach((row) => {
      const trailId = String(row.trail_id || "");
      const fragmentId = String(row.fragment_id || "");

      recoveredRowsByTrailId.get(trailId)?.push(row);

      if (fragmentId) {
        recoveredIdsByTrailId.get(trailId)?.add(fragmentId);
      }
    });

    galleryVisualTrailState.trails = trails;
    galleryVisualTrailState.fragmentsByTrailId = fragmentsByTrailId;
    galleryVisualTrailState.recoveredRowsByTrailId = recoveredRowsByTrailId;
    galleryVisualTrailState.recoveredIdsByTrailId = recoveredIdsByTrailId;
    syncSelectedGalleryVisualTrail(galleryVisualTrailState.selectedTrailId || trails[0]?.id || "");
    galleryVisualTrailState.isLoaded = true;
  } catch (error) {
    console.warn("Visual trail could not be loaded:", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      error
    });
    galleryVisualTrailState.error = error?.message || "Visual Trails could not be loaded.";
    galleryVisualTrailState.trails = [];
    galleryVisualTrailState.fragmentsByTrailId = new Map();
    galleryVisualTrailState.recoveredRowsByTrailId = new Map();
    galleryVisualTrailState.recoveredIdsByTrailId = new Map();
    syncSelectedGalleryVisualTrail("");
    galleryVisualTrailState.isLoaded = true;
  } finally {
    galleryVisualTrailState.isLoading = false;
  }
}

async function loadGalleryUserInteractions() {
  if (galleryUserState.isLoaded || galleryUserState.isLoading) {
    return;
  }

  galleryUserState.isLoading = true;
  galleryUserState.error = "";

  try {
    const [{ getCurrentUser }, { getSupabaseClient, isSupabaseConfigured }] = await Promise.all([
      import("../src/services/auth.js"),
      import("../src/services/supabase-client.js")
    ]);

    if (!isSupabaseConfigured()) {
      resetGalleryUserState();
      resetGalleryVisualTrailState();
      galleryUserState.isLoaded = true;
      galleryVisualTrailState.isLoaded = true;
      return;
    }

    const supabase = getSupabaseClient();
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
      resetGalleryUserState();
      galleryUserState.supabase = supabase;
      galleryUserState.isLoaded = true;
      await loadGalleryVisualTrail(supabase, null);
      return;
    }

    const [{ data: recentData, error: recentError }, markedRows] = await Promise.all([
      supabase
        .from("user_gallery_recent_records")
        .select("record_id,last_viewed_at,view_count,created_at,gallery_records(*)")
        .eq("user_id", user.id)
        .order("last_viewed_at", { ascending: false })
        .limit(10),
      loadUserGalleryMarkedRecords(supabase, user)
    ]);

    if (recentError) {
      console.warn("[Astral Veil archive] Gallery recent records could not be loaded.", recentError);
    }

    galleryUserState.user = user;
    galleryUserState.supabase = supabase;
    galleryUserState.recentRows = recentError ? [] : normalizeGalleryInteractionRows(recentData, "last_viewed_at");
    galleryUserState.markedRows = markedRows;
    syncGalleryRecentMetaFromUserRows();
    syncGalleryMarkedIdsFromUserRows();
    galleryUserState.isLoaded = true;
    await loadGalleryVisualTrail(supabase, user);
  } catch (error) {
    console.warn("[Astral Veil archive] Gallery user interactions could not be loaded.", error);
    resetGalleryUserState();
    resetGalleryVisualTrailState();
    galleryUserState.isLoaded = true;
    galleryVisualTrailState.isLoaded = true;
    galleryUserState.error = error?.message || "Gallery user records could not be loaded.";
  } finally {
    galleryUserState.isLoading = false;
  }
}

async function refreshGalleryUserInteractions() {
  galleryUserState.isLoaded = false;
  await loadGalleryUserInteractions();
}

function addGalleryRecentlyViewedRecord(record) {
  if (!record?.id) {
    return;
  }

  const existingIndex = galleryRecentlyViewedRecords.findIndex((viewedRecord) => viewedRecord.id === record.id);

  if (existingIndex >= 0) {
    galleryRecentlyViewedRecords.splice(existingIndex, 1);
  }

  galleryRecentlyViewedRecords.unshift(record);
  galleryRecentlyViewedRecords.splice(10);
}

async function recordGalleryRecentlyViewed(record) {
  if (!record?.id) {
    return;
  }

  if (!galleryUserState.user || !galleryUserState.supabase || !isGallerySupabaseRecordId(record.id)) {
    addGalleryRecentlyViewedRecord(record);
    return;
  }

  let existingViewCount = Number(galleryUserState.recentMeta.get(String(record.id))?.row?.view_count || 0);

  if (!existingViewCount) {
    const { data, error } = await galleryUserState.supabase
      .from("user_gallery_recent_records")
      .select("view_count")
      .eq("user_id", galleryUserState.user.id)
      .eq("record_id", record.id)
      .maybeSingle();

    if (error) {
      console.warn("[Astral Veil archive] Gallery recent record count could not be checked.", error);
    } else {
      existingViewCount = Number(data?.view_count || 0);
    }
  }

  const now = new Date().toISOString();
  const payload = {
    user_id: galleryUserState.user.id,
    record_id: record.id,
    last_viewed_at: now,
    view_count: existingViewCount + 1
  };

  const { error } = await galleryUserState.supabase
    .from("user_gallery_recent_records")
    .upsert(payload, { onConflict: "user_id,record_id" });

  if (error) {
    console.warn("[Astral Veil archive] Gallery recent record could not be saved.", error);
    return;
  }

  await refreshGalleryUserInteractions();
  renderArchiveRooms();
}

function openGalleryRecordModal(recordId) {
  const record = getGalleryRecordById(recordId);

  if (!record) {
    return;
  }

  openGalleryRecordId = record.id;
  openGalleryUtilityModal = "";
  recordGalleryRecentlyViewed(record);
  updateGalleryModalOpenState();
  renderArchiveRooms();
}

function closeGalleryModals() {
  openGalleryRecordId = "";
  openGalleryUtilityModal = "";
  openGalleryTrailRestoredId = "";
  galleryTrailRevealAnimatingId = "";
  if (galleryTrailRevealTimer) {
    window.clearTimeout(galleryTrailRevealTimer);
    galleryTrailRevealTimer = null;
  }
  updateGalleryModalOpenState();
}

function closeGalleryTrailRestoredOverlay() {
  openGalleryTrailRestoredId = "";
  galleryTrailRevealAnimatingId = "";
  if (galleryTrailRevealTimer) {
    window.clearTimeout(galleryTrailRevealTimer);
    galleryTrailRevealTimer = null;
  }
  updateGalleryModalOpenState();
}

function showGalleryMarkedErrorMessage() {
  openGalleryRecordId = "";
  openGalleryUtilityModal = "marked-error";
  updateGalleryModalOpenState();
  renderArchiveRooms();
}

function showGallerySignInMessage() {
  openGalleryRecordId = "";
  openGalleryUtilityModal = "sign-in";
  updateGalleryModalOpenState();
  renderArchiveRooms();
}

function logGalleryMarkedRecordError(error, context = {}) {
  console.warn("Gallery record could not be marked:", {
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    code: error?.code,
    error,
    ...context
  });
}

function getGalleryFeaturedRecords() {
  const records = getGalleryAllBrowsableRecords();
  const featuredRecords = records.filter((record) => record.is_featured);

  return featuredRecords.length ? featuredRecords : records.slice(0, 1);
}

function getCurrentGalleryFeaturedRecord() {
  const featuredRecords = getGalleryFeaturedRecords();

  if (!featuredRecords.length) {
    return galleryRecordPlaceholders[2] || null;
  }

  galleryFeaturedIndex = ((galleryFeaturedIndex % featuredRecords.length) + featuredRecords.length) % featuredRecords.length;
  return featuredRecords[galleryFeaturedIndex];
}

function moveGalleryFeaturedRecord(direction) {
  const featuredRecords = getGalleryFeaturedRecords();

  if (featuredRecords.length <= 1) {
    return;
  }

  galleryFeaturedIndex = direction === "previous"
    ? (galleryFeaturedIndex - 1 + featuredRecords.length) % featuredRecords.length
    : (galleryFeaturedIndex + 1) % featuredRecords.length;
  renderArchiveRooms();
}

function selectGalleryFeaturedRecord(index) {
  const featuredRecords = getGalleryFeaturedRecords();

  if (index < 0 || index >= featuredRecords.length) {
    return;
  }

  galleryFeaturedIndex = index;
  renderArchiveRooms();
}

async function toggleGalleryMarkedRecord(recordId) {
  const id = String(recordId || "");
  const record = getGalleryRecordById(id);

  if (!id) {
    return;
  }

  let supabase = galleryUserState.supabase;

  if (!supabase) {
    try {
      const { getSupabaseClient, isSupabaseConfigured } = await import("../src/services/supabase-client.js");
      supabase = isSupabaseConfigured() ? getSupabaseClient() : null;
    } catch (error) {
      logGalleryMarkedRecordError(error, { action: "getSupabaseClient" });
    }
  }

  if (!supabase) {
    showGallerySignInMessage();
    return;
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user || null;

  if (authError || !user?.id) {
    if (authError) {
      logGalleryMarkedRecordError(authError, { action: "getUser" });
    }

    showGallerySignInMessage();
    return;
  }

  galleryUserState.user = user;
  galleryUserState.supabase = supabase;
  const recordIdToSave = record?.id || "";

  if (!recordIdToSave || !isGallerySupabaseRecordId(recordIdToSave)) {
    console.warn("Cannot mark gallery record without Supabase record id", record);
    return;
  }

  if (galleryMarkedRecordIds.has(recordIdToSave)) {
    const { error } = await supabase
      .from("user_gallery_marked_records")
      .delete()
      .eq("user_id", user.id)
      .eq("record_id", recordIdToSave);

    if (error) {
      logGalleryMarkedRecordError(error, { action: "delete", record_id: recordIdToSave });
      showGalleryMarkedErrorMessage();
      return;
    }
  } else {
    const { error } = await supabase
      .from("user_gallery_marked_records")
      .insert({
        user_id: user.id,
        record_id: recordIdToSave
      });

    if (error) {
      logGalleryMarkedRecordError(error, { action: "insert", record_id: recordIdToSave });
      showGalleryMarkedErrorMessage();
      return;
    }
  }

  await refreshGalleryUserInteractions();
  renderArchiveRooms();
}

async function recoverNextGalleryTrailFragment() {
  const supabase = galleryUserState.supabase;
  const trail = galleryVisualTrailState.trail;
  const nextFragment = galleryVisualTrailState.fragments.find((fragment) => !galleryVisualTrailState.recoveredIds.has(String(fragment.id || "")));

  if (!supabase) {
    showGallerySignInMessage();
    return;
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user || null;

  if (authError || !user?.id) {
    if (authError) {
      console.warn("Visual trail fragment could not be recovered:", {
        message: authError?.message,
        details: authError?.details,
        hint: authError?.hint,
        code: authError?.code,
        error: authError,
        action: "getUser"
      });
    }

    showGallerySignInMessage();
    return;
  }

  if (!trail?.id || !nextFragment?.id) {
    return;
  }

  const { error } = await supabase
    .from("user_visual_trail_fragments")
    .insert({
      user_id: user.id,
      trail_id: trail.id,
      fragment_id: nextFragment.id
    });

  if (error) {
    if (error.code === "23505") {
      galleryUserState.user = user;
      await loadGalleryVisualTrail(supabase, user);
      openGalleryUtilityModal = "trail-detail";
      updateGalleryModalOpenState();
      renderArchiveRooms();
      return;
    }

    console.warn("Visual trail fragment could not be recovered:", {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      error
    });
    galleryVisualTrailState.error = "Visual fragment could not be recovered.";
    renderArchiveRooms();
    return;
  }

  galleryUserState.user = user;
  await loadGalleryVisualTrail(supabase, user);
  openGalleryUtilityModal = "trail-detail";
  updateGalleryModalOpenState();
  renderArchiveRooms();
}

function normalizeGalleryValue(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function getGalleryRecordTaxonomyValues(record) {
  const taxonomyValues = [];

  if (Array.isArray(record?.tags)) {
    taxonomyValues.push(...record.tags);
  }

  if (Array.isArray(record?.themes)) {
    taxonomyValues.push(...record.themes);
  }

  return taxonomyValues.map(normalizeGalleryValue).filter(Boolean);
}

function recordHasGalleryTag(record, expected) {
  const normalizedExpected = normalizeGalleryValue(expected);

  if (!normalizedExpected) {
    return false;
  }

  return getGalleryRecordTaxonomyValues(record).some((value) => (
    value === normalizedExpected
    || value.endsWith(` ${normalizedExpected}`)
    || normalizedExpected.endsWith(` ${value}`)
  ));
}

function galleryRecordMatchesFilter(record, filter) {
  const activeFilter = normalizeGalleryValue(filter);
  const recordType = normalizeGalleryValue(record?.record_type || record?.recordType || "");
  const category = normalizeGalleryValue(record?.category || "");
  const status = normalizeGalleryValue(record?.status || "");

  if (!activeFilter || activeFilter === "all" || activeFilter === "all records") {
    return true;
  }

  if (activeFilter === "portraits") {
    return recordType === "portrait"
      || category === "portraits"
      || recordHasGalleryTag(record, "portrait")
      || recordHasGalleryTag(record, "portraits");
  }

  if (activeFilter === "places") {
    return ["place", "location"].includes(recordType)
      || category === "places"
      || recordHasGalleryTag(record, "place")
      || recordHasGalleryTag(record, "places")
      || recordHasGalleryTag(record, "location");
  }

  if (activeFilter === "symbols") {
    return ["symbol", "seal"].includes(recordType)
      || category === "symbols"
      || recordHasGalleryTag(record, "symbol")
      || recordHasGalleryTag(record, "symbols")
      || recordHasGalleryTag(record, "seal");
  }

  if (activeFilter === "maps") {
    return recordType === "map"
      || category === "maps"
      || recordHasGalleryTag(record, "map")
      || recordHasGalleryTag(record, "maps");
  }

  if (activeFilter === "anomalies") {
    return recordType === "anomaly"
      || category === "anomalies"
      || recordHasGalleryTag(record, "anomaly")
      || recordHasGalleryTag(record, "anomalies")
      || recordHasGalleryTag(record, "phenomena")
      || recordHasGalleryTag(record, "rift")
      || recordHasGalleryTag(record, "veil");
  }

  if (activeFilter === "unknown records") {
    return recordType === "unknown"
      || ["unknown", "unnamed"].includes(status)
      || category === "unknown records"
      || recordHasGalleryTag(record, "unknown records")
      || recordHasGalleryTag(record, "unknown");
  }

  if (activeFilter === "recovered") {
    return recordType === "recovered"
      || status === "recovered"
      || record?.recovered === true
      || category === "recovered"
      || recordHasGalleryTag(record, "recovered");
  }

  return true;
}

function getGalleryFilteredRecords() {
  const sourceRecords = getGallerySourceRecords();
  const filteredRecords = sourceRecords.filter((record) => galleryRecordMatchesFilter(record, galleryActiveFilter));

  console.info("Gallery filter applied:", {
    activeFilter: galleryActiveFilter,
    beforeCount: sourceRecords.length,
    afterCount: filteredRecords.length
  });

  return filteredRecords;
}

function getGallerySortedRecords(records) {
  const sourceIndexById = new Map(getGallerySourceRecords().map((record, index) => [
    String(record?.id || record?.slug || ""),
    index
  ]));
  const indexedRecords = records.map((record) => ({
    record,
    originalIndex: sourceIndexById.get(String(record?.id || record?.slug || "")) ?? 0
  }));

  if (galleryActiveSort === "Oldest") {
    return indexedRecords.reverse().map(({ record }) => record);
  }

  if (galleryActiveSort === "A-Z") {
    return indexedRecords
      .sort((first, second) => first.record.title.localeCompare(second.record.title) || first.originalIndex - second.originalIndex)
      .map(({ record }) => record);
  }

  if (galleryActiveSort === "Recovered First") {
    return indexedRecords
      .sort((first, second) => Number(Boolean(second.record.recovered)) - Number(Boolean(first.record.recovered)) || first.originalIndex - second.originalIndex)
      .map(({ record }) => record);
  }

  if (galleryActiveSort === "Unknown First") {
    return indexedRecords
      .sort((first, second) => Number(second.record.category === "Unknown Records") - Number(first.record.category === "Unknown Records") || first.originalIndex - second.originalIndex)
      .map(({ record }) => record);
  }

  return indexedRecords.map(({ record }) => record);
}

function getGalleryResultSet() {
  return getGallerySortedRecords(getGalleryFilteredRecords());
}

function getGalleryPaginationState() {
  const records = getGalleryResultSet();
  const totalSets = Math.max(1, Math.ceil(records.length / GALLERY_RECORDS_PER_SET));

  galleryRecordSetIndex = Math.min(Math.max(galleryRecordSetIndex, 0), totalSets - 1);

  const start = galleryRecordSetIndex * GALLERY_RECORDS_PER_SET;
  const visibleRecords = records.slice(start, start + GALLERY_RECORDS_PER_SET);

  return {
    currentSet: galleryRecordSetIndex + 1,
    totalSets,
    visibleRecords,
    canGoPrevious: galleryRecordSetIndex > 0,
    canGoNext: galleryRecordSetIndex < totalSets - 1
  };
}

function renderGallerySortOptions() {
  return gallerySortOptions.map((option) => `
    <option value="${escapeHtml(option)}"${galleryActiveSort === option ? " selected" : ""}>${escapeHtml(option)}</option>
  `).join("");
}

function renderGalleryRecordPagination(pagination) {
  return `
    <div class="gallery-records-pagination" aria-label="Visual record sets">
      <button type="button" data-gallery-record-set="previous" aria-label="Previous visual record set"${pagination.canGoPrevious ? "" : " disabled"}></button>
      <span>Set ${pagination.currentSet} of ${pagination.totalSets}</span>
      <button type="button" data-gallery-record-set="next" aria-label="Next visual record set"${pagination.canGoNext ? "" : " disabled"}></button>
    </div>
  `;
}

function renderGalleryRecordsState(pagination) {
  if (galleryRecordsLoading && !galleryRecordsLoaded) {
    return `<p class="gallery-records-state">Recovering visual records...</p>`;
  }

  if (!pagination.visibleRecords.length) {
    return `<p class="gallery-records-state">No visual records answered from the dark.</p>`;
  }

  if (galleryRecordsError && galleryRecordsLoaded && !galleryRecords.length) {
    return `<p class="gallery-records-state">${escapeHtml(galleryRecordsError)}</p>`;
  }

  return "";
}

function renderGalleryFeaturedRecord(featuredRecord) {
  const featuredRecords = getGalleryFeaturedRecords();
  const image = featuredRecord?.previewImage || featuredRecord?.preview_image_url || featuredRecord?.fullImage || featuredRecord?.full_image_url || featuredRecord?.image || "assets/images/noctis/visual-records/castle-black.webp";
  const title = featuredRecord?.title || "Sealed Landscape";
  const note = featuredRecord?.lore_note || featuredRecord?.description || "The Archive has recovered this visual record, but its meaning remains uncertain.";
  const relatedRoom = featuredRecord?.relatedRoom || featuredRecord?.related_room || "";
  const origin = featuredRecord?.origin || "";
  const safeRecordId = featuredRecord?.id || featuredRecord?.slug || "";
  const hasMultipleFeaturedRecords = featuredRecords.length > 1;

  return `
    <article class="gallery-featured-card" aria-label="${escapeHtml(`Featured visual record: ${title}`)}">
      <header class="gallery-featured-card__header">
        <p class="gallery-featured-card__label" id="gallery-featured-title">Featured Visual Record</p>
        <div class="gallery-featured-card__controls" aria-label="Featured visual record controls">
          <button class="gallery-featured-card__nav gallery-featured-card__nav--previous" type="button" data-gallery-featured-nav="previous" aria-label="Previous featured visual record"${hasMultipleFeaturedRecords ? "" : " disabled"}></button>
          <button class="gallery-featured-card__nav gallery-featured-card__nav--next" type="button" data-gallery-featured-nav="next" aria-label="Next featured visual record"${hasMultipleFeaturedRecords ? "" : " disabled"}></button>
        </div>
      </header>
      <div class="gallery-featured-card__visual protected-media" data-protected-media="true" draggable="false">
        <div class="gallery-featured-card__image">
          <button class="gallery-featured-card__open" type="button" data-gallery-open-record="${escapeHtml(safeRecordId)}" aria-label="${escapeHtml(`Open ${title}`)}">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" draggable="false" onerror="${getGalleryImageErrorHandler(image)}" />
          </button>
        </div>
        <div class="gallery-featured-card__dots" aria-label="Featured visual record position">
          ${featuredRecords.map((record, index) => `
            <button class="${index === galleryFeaturedIndex ? "is-active" : ""}" type="button" data-gallery-featured-dot="${index}" aria-label="${escapeHtml(`Show featured visual record ${index + 1}`)}"${featuredRecords.length <= 1 ? " disabled" : ""}></button>
          `).join("")}
        </div>
      </div>
      <aside class="gallery-featured-card__meta" aria-label="Featured visual record lore note">
        <div class="gallery-featured-card__summary">
          <span>Lore Note</span>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(note)}</p>
          ${relatedRoom ? `<small>Recovered near: ${escapeHtml(relatedRoom)}</small>` : ""}
          ${origin ? `<small>Origin: ${escapeHtml(origin)}</small>` : ""}
        </div>
        <button type="button" data-gallery-open-record="${escapeHtml(safeRecordId)}">View Record</button>
      </aside>
    </article>
  `;
}

function renderGalleryStats() {
  return galleryStatsPlaceholders.map(([value, label]) => `
    <div class="gallery-stat">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");
}

function renderGalleryQuickLinks() {
  return galleryQuickLinks.map(([title, subtitle, count]) => `
    <button class="gallery-quick-link" type="button">
      <span class="gallery-quick-link__mark" aria-hidden="true"></span>
      <span>
        <strong>${escapeHtml(title)}</strong>
        <em>${escapeHtml(subtitle)}</em>
      </span>
      <small>${escapeHtml(count)}</small>
    </button>
  `).join("");
}

function renderGalleryRecordPlaceholder(record) {
  const recordId = record?.id || record?.slug || "";
  const gridImage = record.fullImage || record.full_image_url || record.image || record.previewImage || record.preview_image_url || "";
  const canMarkRecord = !record?.isVirtualTrailRecord;

  return `
    <article class="gallery-record-card protected-media${record.sealed ? " is-sealed" : ""}${record.variant ? ` gallery-record-card--${escapeHtml(record.variant)}` : ""}" aria-label="${escapeHtml(`${record.title}, ${record.category}`)}" data-protected-media="true" draggable="false">
      <button class="gallery-record-card__open" type="button" data-gallery-open-record="${escapeHtml(recordId)}" aria-label="${escapeHtml(`Open ${record.title}`)}">
      <span class="gallery-record-card__image">
        ${gridImage ? `<img src="${escapeHtml(gridImage)}" alt="${escapeHtml(record.title)}" loading="eager" decoding="async" draggable="false" onerror="${getGalleryImageErrorHandler(gridImage)}" />` : ""}
      </span>
      </button>
      ${canMarkRecord ? `<button class="gallery-record-card__mark${galleryMarkedRecordIds.has(recordId) ? " is-marked" : ""}" type="button" data-gallery-mark-record="${escapeHtml(recordId)}" aria-label="${escapeHtml(`${galleryMarkedRecordIds.has(recordId) ? "Unmark" : "Mark"} ${record.title}`)}"></button>` : ""}
    </article>
  `;
}

function getGalleryInteractionTimeLabel(value, fallback = "") {
  const timestamp = new Date(value || "");

  if (Number.isNaN(timestamp.getTime())) {
    return fallback;
  }

  const diffMs = Date.now() - timestamp.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return "Just now";
  }

  if (diffMs < hour) {
    return `${Math.max(1, Math.floor(diffMs / minute))}m ago`;
  }

  if (diffMs < day) {
    return `${Math.max(1, Math.floor(diffMs / hour))}h ago`;
  }

  return `${Math.max(1, Math.floor(diffMs / day))}d ago`;
}

function getGalleryRecentDisplayRows(limit = 3) {
  if (galleryUserState.user) {
    return galleryUserState.recentRows.slice(0, limit).map((entry) => ({
      record: entry.record,
      subtext: getGalleryInteractionTimeLabel(entry.row?.last_viewed_at, entry.record?.slug || "Viewed")
    }));
  }

  return galleryRecentlyViewedRecords.slice(0, limit).map((record) => ({
    record,
    subtext: record.slug || record.category || "Viewed"
  }));
}

function getGalleryMarkedDisplayRows(limit = 3) {
  if (!galleryUserState.user) {
    return [];
  }

  return galleryUserState.markedRows.slice(0, limit).map((entry) => ({
    record: entry.record,
    subtext: getGalleryInteractionTimeLabel(entry.row?.marked_at, entry.record?.slug || "Marked")
  }));
}

function getGalleryVisualTrailProgress(trail = galleryVisualTrailState.trail) {
  const trailId = String(trail?.id || "");
  const fragments = galleryVisualTrailState.fragmentsByTrailId.get(trailId) || [];
  const recoveredIds = galleryUserState.user
    ? galleryVisualTrailState.recoveredIdsByTrailId.get(trailId) || new Set()
    : new Set();
  const total = Number(trail?.total_fragments || fragments.length || 4);
  const recovered = recoveredIds.size;

  return {
    recovered,
    total: Math.max(1, total),
    percent: Math.min(100, Math.round((recovered / Math.max(1, total)) * 100))
  };
}

function getGalleryVisualTrailDisplayFragments(trail = galleryVisualTrailState.trail) {
  const progress = getGalleryVisualTrailProgress(trail);
  const fragments = [...(galleryVisualTrailState.fragmentsByTrailId.get(String(trail?.id || "")) || [])].slice(0, progress.total);

  while (fragments.length < progress.total) {
    const fragmentNumber = fragments.length + 1;
    fragments.push({
      id: `missing-fragment-${fragmentNumber}`,
      fragment_number: fragmentNumber,
      title: `Fragment ${fragmentNumber}`,
      hint_text: ""
    });
  }

  return fragments;
}

const galleryFirstReflectionTrailCopy = {
  title: "The First Reflection",
  subtitle: "Two figures stood apart, though the record shows only one arrival.",
  description: "The Archive first named this a meeting. Later notes call it a recurrence. No one has agreed on which side began the pattern.",
  restoredCaption: "The Archive marked this image complete. The image did not.",
  fragments: ["I. Arrival", "II. Answer", "III. Echo", "IV. Return"]
};

function shouldUseFirstReflectionTrailCopy(trail) {
  const slug = String(trail?.slug || "").toLowerCase();
  const title = String(trail?.title || "").toLowerCase();

  return slug.includes("celestial-duality")
    || slug.includes("first-reflection")
    || slug.includes("spiral")
    || title.includes("celestial duality")
    || title.includes("first reflection")
    || title.includes("spiral beyond");
}

function getGalleryVisualTrailViewModel(trail = galleryVisualTrailState.trail) {
  const trailId = String(trail?.id || "");
  const progress = getGalleryVisualTrailProgress(trail);
  const recoveredIds = galleryUserState.user
    ? galleryVisualTrailState.recoveredIdsByTrailId.get(trailId) || new Set()
    : new Set();
  const useFirstReflectionCopy = shouldUseFirstReflectionTrailCopy(trail);
  const copy = useFirstReflectionCopy ? galleryFirstReflectionTrailCopy : {};
  const fragments = getGalleryVisualTrailDisplayFragments(trail).map((fragment, index) => {
    const fragmentId = String(fragment?.id || `missing-fragment-${index + 1}`);
    const title = copy.fragments?.[index]
      || fragment?.title
      || `Fragment ${fragment?.fragment_number || index + 1}`;

    return {
      id: fragmentId,
      title,
      image: fragment?.fragment_image_url || fragment?.image || "",
      recovered: recoveredIds.has(fragmentId),
      hint: fragment?.hint_text || ""
    };
  });

  return {
    id: trailId,
    title: copy.title || trail?.title || "Visual Trail",
    subtitle: copy.subtitle || trail?.subtitle || "",
    description: copy.description || trail?.description || trail?.lore_note || "The Archive is still assembling this visual trail.",
    restoredCaption: copy.restoredCaption || trail?.restored_caption || trail?.restoredCaption || "Image restored.",
    fullImage: trail?.full_image_url || trail?.fullImage || "",
    progress,
    fragments,
    isComplete: Boolean(galleryUserState.user && progress.recovered >= progress.total),
    isAssembling: Boolean(trailId && galleryTrailRevealAnimatingId === trailId)
  };
}

function galleryPrefersReducedMotion() {
  return document.body.classList.contains("reduce-motion")
    || document.documentElement.dataset.reduceMotion === "true"
    || Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

function revealGalleryVisualTrailRestoredImage() {
  if (galleryTrailRevealAnimatingId) {
    return;
  }

  const trailView = getGalleryVisualTrailViewModel();

  if (!trailView.id || !trailView.isComplete || !trailView.fullImage) {
    return;
  }

  if (galleryTrailRevealTimer) {
    window.clearTimeout(galleryTrailRevealTimer);
    galleryTrailRevealTimer = null;
  }

  openGalleryTrailRestoredId = "";

  if (galleryPrefersReducedMotion()) {
    galleryTrailRevealAnimatingId = "";
    openGalleryTrailRestoredId = trailView.id;
    updateGalleryModalOpenState();
    renderArchiveRooms();
    return;
  }

  galleryTrailRevealAnimatingId = trailView.id;
  updateGalleryModalOpenState();
  renderArchiveRooms();

  galleryTrailRevealTimer = window.setTimeout(() => {
    galleryTrailRevealTimer = null;
    galleryTrailRevealAnimatingId = "";
    openGalleryTrailRestoredId = trailView.id;
    updateGalleryModalOpenState();
    renderArchiveRooms();
  }, 780);
}

function getGalleryVisualTrailStatus(progress) {
  if (progress.recovered >= progress.total) {
    return "Restored";
  }

  if (progress.recovered > 0) {
    return "Recovering";
  }

  return "Not started";
}

function renderGalleryVisualTrailDots(recoveredCount, totalFragments) {
  const total = Math.max(1, Number(totalFragments || 4));
  const visibleTotal = Math.min(total, 8);
  const recovered = Math.max(0, Number(recoveredCount || 0));
  const dots = Array.from({ length: visibleTotal }, (_, index) => `
    <span class="${index < recovered ? "is-recovered" : ""}" aria-hidden="true"></span>
  `).join("");

  return `
    <span class="gallery-trail-dots" role="img" aria-label="${escapeHtml(`${Math.min(recovered, total)} of ${total} fragments recovered`)}">
      ${dots}${total > visibleTotal ? `<em aria-hidden="true">+${total - visibleTotal}</em>` : ""}
    </span>
  `;
}

function renderGalleryVisualTrailRow(trail, { asListItem = false } = {}) {
  const trailView = getGalleryVisualTrailViewModel(trail);
  const progress = trailView.progress;
  const status = getGalleryVisualTrailStatus(progress);
  const note = trailView.description || "Recovered images are restored one fragment at a time.";
  const isComplete = progress.recovered >= progress.total;
  const image = isComplete ? trail?.preview_image_url || trailView.fullImage || "" : "";
  const thumbState = isComplete ? "is-restored" : "is-locked";

  return `
    <button class="gallery-trail-row${asListItem ? " gallery-trail-row--list" : " gallery-trail-row--summary"}" type="button" data-gallery-open-trail="${escapeHtml(trail?.id || "")}">
      ${asListItem ? "" : `<span class="gallery-trail-row__thumb protected-media ${thumbState}" aria-hidden="true" data-protected-media="true">${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async" draggable="false" onerror="${getVisualTrailImageErrorHandler(image)}" />` : ""}</span>`}
      <span class="gallery-trail-row__main">
        <span class="gallery-trail-row__copy">
          <strong>${escapeHtml(trailView.title || "Visual Trail")}</strong>
          ${asListItem ? `<em>${escapeHtml(note)}</em>` : ""}
        </span>
        <span class="gallery-trail-row__progress">
          ${renderGalleryVisualTrailDots(progress.recovered, progress.total)}
          <small>${progress.recovered} / ${progress.total} recovered</small>
        </span>
      </span>
      ${asListItem ? `<span class="gallery-trail-row__status">${escapeHtml(status)}</span>` : ""}
    </button>
  `;
}

function renderGalleryMiniRecordRow(item, { includeUnmark = false } = {}) {
  const record = item?.record || item;
  const subtext = item?.subtext || record?.slug || record?.category || "The Gallery";
  const image = record?.previewImage || record?.preview_image_url || record?.image || record?.fullImage || record?.full_image_url || "";
  const recordId = record?.id || record?.slug || "";

  return `
    <div class="gallery-mini-row-wrap">
      <button class="gallery-mini-row" type="button" data-gallery-open-record="${escapeHtml(recordId)}">
        <span class="gallery-mini-thumb protected-media" aria-hidden="true" data-protected-media="true">${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async" draggable="false" onerror="${getGalleryImageErrorHandler(image)}" />` : ""}</span>
        <span>
          <strong>${escapeHtml(record?.title || "Unknown Visual Record")}</strong>
          <em>${escapeHtml(subtext)}</em>
        </span>
      </button>
      ${includeUnmark ? `<button class="gallery-mini-row__remove" type="button" data-gallery-unmark-record="${escapeHtml(recordId)}" aria-label="${escapeHtml(`Unmark ${record?.title || "Gallery record"}`)}">Remove</button>` : ""}
    </div>
  `;
}

function renderGalleryVisualTrailSummary() {
  const trails = galleryVisualTrailState.trails.slice(0, 3);

  if (galleryVisualTrailState.isLoading) {
    return `<p class="gallery-bottom-empty">Visual Trails are answering...</p>`;
  }

  if (!trails.length) {
    return `<p class="gallery-bottom-empty">${escapeHtml(galleryVisualTrailState.error || "Visual Trails are still being indexed by the Archive.")}</p>`;
  }

  return `
    ${trails.map((trail) => renderGalleryVisualTrailRow(trail)).join("")}
    ${galleryUserState.user ? "" : `<p class="gallery-bottom-empty">Sign in to recover visual fragments.</p>`}
  `;
}

function renderGalleryBottomSection(section) {
  const sectionKey = section.title.toLowerCase().includes("recent")
    ? "recent"
    : section.title.toLowerCase().includes("marked")
      ? "marked"
      : "trails";
  const recentRows = getGalleryRecentDisplayRows(3);
  const markedRows = getGalleryMarkedDisplayRows(3);
  const dynamicRows = sectionKey === "recent"
    ? recentRows
    : sectionKey === "marked"
      ? markedRows
      : [];
  const emptyMessage = sectionKey === "recent"
    ? "Recently Viewed records will appear here as you explore the Gallery."
    : sectionKey === "marked"
      ? "Marked Records will appear here when you save Gallery images."
      : "Visual Trails are still being indexed by the Archive.";

  return `
    <section class="gallery-bottom-card">
      <div class="gallery-card-heading">
        <h3>${escapeHtml(section.title)}</h3>
        <button type="button" data-gallery-bottom-action="${escapeHtml(sectionKey)}">${sectionKey === "trails" ? "Explore trails" : "View all"}</button>
      </div>
      <div class="gallery-mini-list">
        ${sectionKey === "trails"
          ? renderGalleryVisualTrailSummary()
          : dynamicRows.length
          ? dynamicRows.map((item) => renderGalleryMiniRecordRow(item)).join("")
          : `<p class="gallery-bottom-empty">${escapeHtml(emptyMessage)}</p>`}
      </div>
    </section>
  `;
}

function renderGalleryRecordModal() {
  const record = getGalleryRecordById(openGalleryRecordId);

  if (!record) {
    return "";
  }

  const image = record.fullImage || record.full_image_url || record.previewImage || record.preview_image_url || record.image || "";
  const title = record.title || "Unknown Visual Record";

  return `
    <div class="gallery-record-modal gallery-record-modal--viewer is-open" role="presentation">
      <button class="gallery-record-modal__backdrop" type="button" data-gallery-modal-close aria-label="Close visual record"></button>
      <article class="gallery-record-modal__dialog" role="dialog" aria-modal="true" aria-label="Expanded visual record">
        <button class="gallery-record-modal__close" type="button" data-gallery-modal-close aria-label="Close visual record">×</button>
        <figure class="gallery-record-modal__figure protected-media" data-protected-media="true">
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="eager" decoding="async" draggable="false" onerror="${getGalleryImageErrorHandler(image)}" />` : ""}
        </figure>
      </article>
    </div>
  `;
}

function renderGalleryVisualTrailModalContent() {
  const trail = galleryVisualTrailState.trail;

  if (!trail) {
    return `
      <p class="gallery-record-modal__eyebrow">Visual Trails</p>
      <h2 id="gallery-utility-modal-title">Visual Trails</h2>
      <p>${escapeHtml(galleryVisualTrailState.error || "Visual Trails are still being indexed by the Archive.")}</p>
    `;
  }

  const trailView = getGalleryVisualTrailViewModel(trail);
  const progress = trailView.progress;
  const revealButtonLabel = trailView.isComplete && trailView.fullImage
    ? "Reveal Restored Image"
    : "Recover all fragments to restore the image";

  return `
    <p class="gallery-record-modal__eyebrow">Visual Trail</p>
    <h2 id="gallery-utility-modal-title">${escapeHtml(trailView.title || "Visual Trail")}</h2>
    ${trailView.subtitle ? `<p class="gallery-trail-modal-subtitle">${escapeHtml(trailView.subtitle)}</p>` : ""}
    <p class="gallery-trail-modal-description">${escapeHtml(trailView.description)}</p>
    <div class="gallery-trail-modal-progress">
      <div class="gallery-trail-modal-progress__meta">
        <span>${progress.recovered} / ${progress.total} fragments recovered</span>
        <strong>${trailView.isComplete ? "Restoration complete" : getGalleryVisualTrailStatus(progress)}</strong>
      </div>
      <div class="gallery-trail-progress${trailView.isComplete ? " is-complete" : ""}${trailView.isAssembling ? " is-assembling" : ""}" aria-hidden="true">
        <span style="width: ${progress.percent}%"></span>
      </div>
    </div>
    <div class="gallery-trail-fragment-grid${trailView.isAssembling ? " is-assembling" : ""}" aria-label="Visual trail fragments">
      ${trailView.fragments.map((fragment) => {
        return `
          <figure class="gallery-trail-fragment protected-media${fragment.recovered ? " is-recovered" : " is-locked"}" data-protected-media="true" draggable="false">
            <span class="gallery-trail-fragment__media" aria-hidden="${fragment.recovered ? "false" : "true"}">
              ${fragment.recovered && fragment.image
                ? `<img src="${escapeHtml(fragment.image)}" alt="${escapeHtml(fragment.title)}" loading="lazy" decoding="async" draggable="false" onerror="${getVisualTrailImageErrorHandler(fragment.image)}" />`
                : `<span>Fragment locked</span>${fragment.hint ? `<small>${escapeHtml(fragment.hint)}</small>` : ""}`}
            </span>
            <figcaption class="gallery-trail-fragment__meta">
              <strong>${escapeHtml(fragment.title)}</strong>
              <em>${fragment.recovered ? "Recovered" : "Unrecovered"}</em>
            </figcaption>
          </figure>
        `;
      }).join("")}
    </div>
    <button class="gallery-trail-reveal-button" type="button" data-gallery-reveal-trail${trailView.isComplete && trailView.fullImage && !trailView.isAssembling ? "" : " disabled"}>
      ${escapeHtml(revealButtonLabel)}
    </button>
    ${trailView.isComplete && !trailView.fullImage ? `<p class="gallery-bottom-empty">Restored image could not be loaded.</p>` : ""}
    ${galleryVisualTrailState.error ? `<p class="gallery-bottom-empty">${escapeHtml(galleryVisualTrailState.error)}</p>` : ""}
    ${galleryUserState.user
      ? progress.recovered < progress.total
        ? `<button class="gallery-trail-recover-button" type="button" data-gallery-recover-trail-fragment>Recover next fragment</button>`
        : ""
      : `<p class="gallery-bottom-empty">Sign in to recover visual fragments.</p>`}
  `;
}

function renderGalleryVisualTrailRestoredOverlay() {
  if (!openGalleryTrailRestoredId) {
    return "";
  }

  const trail = galleryVisualTrailState.trails.find((item) => String(item.id || "") === String(openGalleryTrailRestoredId))
    || galleryVisualTrailState.trail;
  const trailView = getGalleryVisualTrailViewModel(trail);

  if (!trailView.fullImage) {
    return "";
  }

  return `
    <div class="gallery-trail-lightbox is-open" role="presentation">
      <button class="gallery-trail-lightbox__backdrop" type="button" data-gallery-trail-restored-close aria-label="Close restored image"></button>
      <article class="gallery-trail-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="gallery-trail-lightbox-title">
        <button class="gallery-trail-lightbox__close" type="button" data-gallery-trail-restored-close aria-label="Close restored image">Close</button>
        <figure class="gallery-trail-lightbox__figure protected-media" data-protected-media="true">
          <img src="${escapeHtml(trailView.fullImage)}" alt="${escapeHtml(`${trailView.title} restored image`)}" loading="eager" decoding="async" draggable="false" onerror="${getVisualTrailImageErrorHandler(trailView.fullImage)}" />
          <figcaption id="gallery-trail-lightbox-title">${escapeHtml(trailView.restoredCaption)}</figcaption>
          <p>Restored image could not be loaded.</p>
        </figure>
      </article>
    </div>
  `;
}

function renderGalleryVisualTrailListModalContent() {
  const trails = galleryVisualTrailState.trails;

  if (galleryVisualTrailState.isLoading) {
    return `
      <p class="gallery-record-modal__eyebrow">Visual Trails</p>
      <h2 id="gallery-utility-modal-title">Visual Trails</h2>
      <p>Visual Trails are answering...</p>
    `;
  }

  if (!trails.length) {
    return `
      <p class="gallery-record-modal__eyebrow">Visual Trails</p>
      <h2 id="gallery-utility-modal-title">Visual Trails</h2>
      <p>${escapeHtml(galleryVisualTrailState.error || "Visual Trails are still being indexed by the Archive.")}</p>
    `;
  }

  const trailsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(trails.length / trailsPerPage));
  galleryVisualTrailState.trailPageIndex = Math.min(Math.max(galleryVisualTrailState.trailPageIndex, 0), totalPages - 1);
  const start = galleryVisualTrailState.trailPageIndex * trailsPerPage;
  const visibleTrails = trails.slice(start, start + trailsPerPage);

  return `
    <p class="gallery-record-modal__eyebrow">Visual Trails</p>
    <h2 id="gallery-utility-modal-title">Visual Trails</h2>
    <p>Recovered images are restored one fragment at a time.</p>
    ${galleryUserState.user ? "" : `<p class="gallery-bottom-empty">Sign in to recover visual fragments.</p>`}
    <div class="gallery-trail-list">
      ${visibleTrails.map((trail) => renderGalleryVisualTrailRow(trail, { asListItem: true })).join("")}
    </div>
    ${totalPages > 1 ? `
      <div class="gallery-records-pagination gallery-trail-list-pagination" aria-label="Visual Trail pages">
        <button type="button" data-gallery-trails-page="previous" aria-label="Previous visual trails page"${galleryVisualTrailState.trailPageIndex > 0 ? "" : " disabled"}></button>
        <span>Page ${galleryVisualTrailState.trailPageIndex + 1} of ${totalPages}</span>
        <button type="button" data-gallery-trails-page="next" aria-label="Next visual trails page"${galleryVisualTrailState.trailPageIndex < totalPages - 1 ? "" : " disabled"}></button>
      </div>
    ` : ""}
  `;
}

function renderGalleryUtilityModal() {
  if (!openGalleryUtilityModal) {
    return "";
  }

  if (openGalleryUtilityModal === "trails" || openGalleryUtilityModal === "trail-detail") {
    const isTrailDetail = openGalleryUtilityModal === "trail-detail";
    return `
      <div class="gallery-record-modal gallery-record-modal--utility is-open" role="presentation">
        <button class="gallery-record-modal__backdrop" type="button" data-gallery-modal-close aria-label="Close Visual Trails"></button>
        <article class="gallery-record-modal__dialog gallery-record-modal__dialog--trail" role="dialog" aria-modal="true" aria-labelledby="gallery-utility-modal-title">
          <button class="gallery-record-modal__close" type="button" data-gallery-modal-close aria-label="Close Visual Trails">Close</button>
          <div class="gallery-record-modal__body">
            ${isTrailDetail ? renderGalleryVisualTrailModalContent() : renderGalleryVisualTrailListModalContent()}
          </div>
        </article>
      </div>
    `;
  }

  const recentRecords = getGalleryRecentDisplayRows(10);
  const markedRecords = getGalleryMarkedDisplayRows(10);
  const modalCopy = {
    recent: {
      title: "Recently Viewed",
      message: "Recently Viewed records will appear here as you explore the Gallery.",
      records: recentRecords,
      includeUnmark: false
    },
    marked: {
      title: "Marked Records",
      message: "Marked Records will appear here when you save Gallery images.",
      records: markedRecords,
      includeUnmark: true
    },
    trails: {
      title: "Visual Trails",
      message: "Visual Trails are still being indexed by the Archive.",
      records: [],
      includeUnmark: false
    },
    "sign-in": {
      title: "Sign In Required",
      message: "Sign in to mark Gallery records.",
      records: [],
      includeUnmark: false
    },
    "marked-error": {
      title: "Marked Records",
      message: "Marked record could not be saved. Please try again.",
      records: [],
      includeUnmark: false
    }
  }[openGalleryUtilityModal] || {
    title: "The Gallery",
    message: "The Archive is still indexing this wing.",
    records: [],
    includeUnmark: false
  };

  return `
    <div class="gallery-record-modal gallery-record-modal--utility is-open" role="presentation">
      <button class="gallery-record-modal__backdrop" type="button" data-gallery-modal-close aria-label="Close Gallery message"></button>
      <article class="gallery-record-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="gallery-utility-modal-title">
        <button class="gallery-record-modal__close" type="button" data-gallery-modal-close aria-label="Close Gallery message">Close</button>
        <div class="gallery-record-modal__body">
          <p class="gallery-record-modal__eyebrow">Noctis Gallery</p>
          <h2 id="gallery-utility-modal-title">${escapeHtml(modalCopy.title)}</h2>
          <p>${escapeHtml(modalCopy.message)}</p>
          ${modalCopy.records.length ? `<div class="gallery-modal-record-list">${modalCopy.records.map((item) => renderGalleryMiniRecordRow(item, { includeUnmark: modalCopy.includeUnmark })).join("")}</div>` : ""}
        </div>
      </article>
    </div>
  `;
}

function renderRestrictedWingRitualOverlay() {
  if (!restrictedWingRitualOpen) {
    return "";
  }

  return `
    <div class="restricted-wing-ritual is-open" role="presentation">
      <button class="restricted-wing-ritual__backdrop" type="button" data-restricted-wing-ritual-close aria-label="Return to the Archive"></button>
      <article class="restricted-wing-ritual__dialog" role="dialog" aria-modal="true" aria-labelledby="restricted-wing-ritual-title">
        <p class="restricted-wing-ritual__eyebrow">Restricted Wing</p>
        <h2 id="restricted-wing-ritual-title">The Four Artifacts Have Answered</h2>
        <div class="restricted-wing-ritual__body">
          <p>The seal has broken, but the door does not open for force alone.</p>
          <p>Something beyond it is waking slowly.</p>
          <p>You have unlocked the Restricted Wing, but the Wing has not yet chosen to reveal itself.</p>
          <p>Return when the blood remembers the shape of the key.</p>
        </div>
        <p class="restricted-wing-ritual__note">The artifacts remain bound to your archive.</p>
        <button class="restricted-wing-ritual__button" type="button" data-restricted-wing-ritual-close>Return to the Archive</button>
      </article>
    </div>
  `;
}

function getRestrictedWingAuthHref(mode = "login") {
  const params = new URLSearchParams({
    returnTo: "archive.html#restricted-wing"
  });

  if (mode === "signup") {
    params.set("mode", "signup");
  }

  return `auth.html?${params.toString()}`;
}

function renderRestrictedWingGuestPromptOverlay() {
  if (!restrictedWingGuestPromptOpen) {
    return "";
  }

  return `
    <div class="restricted-wing-ritual restricted-wing-ritual--guest is-open" role="presentation">
      <button class="restricted-wing-ritual__backdrop" type="button" data-restricted-wing-guest-close aria-label="Return to the Archive"></button>
      <article class="restricted-wing-ritual__dialog" role="dialog" aria-modal="true" aria-labelledby="restricted-wing-guest-title">
        <p class="restricted-wing-ritual__eyebrow">Restricted Wing</p>
        <h2 id="restricted-wing-guest-title">The Door Has Recognized the Keys</h2>
        <div class="restricted-wing-ritual__body">
          <p>You have gathered the artifacts, and the seal has begun to answer.</p>
          <p>But the Restricted Wing does not reveal itself to a passing shadow.</p>
          <p>Create a free account to bind this discovery to your Archive and return when the door is ready to open.</p>
        </div>
        <p class="restricted-wing-ritual__note">Your account keeps artifacts, readings, reflections, and future discoveries tied to your path.</p>
        <div class="restricted-wing-ritual__actions">
          <a class="restricted-wing-ritual__button" href="${escapeHtml(getRestrictedWingAuthHref("signup"))}">Create Free Account</a>
          <a class="restricted-wing-ritual__button restricted-wing-ritual__button--secondary" href="${escapeHtml(getRestrictedWingAuthHref("login"))}">Log In</a>
          <button class="restricted-wing-ritual__button restricted-wing-ritual__button--ghost" type="button" data-restricted-wing-guest-close>Return to the Archive</button>
        </div>
      </article>
    </div>
  `;
}

// Gallery renders recovered visual records from the Noctis visual archive.
function renderGalleryRoom(room) {
  const galleryPagination = getGalleryPaginationState();
  const featuredRecord = getCurrentGalleryFeaturedRecord();

  return `
    <div class="gallery-page-shell">
      <section class="gallery-hero" aria-labelledby="gallery-title">
        <div class="gallery-hero__copy">
          <h1 id="gallery-title">The Gallery</h1>
          <p>Recovered visual records, sealed portraits, and images the Archive refuses to name.</p>
          <em>Some truths arrive without language.</em>
        </div>
      </section>

      <main class="gallery-main" aria-label="Gallery records">
        <section class="gallery-featured-record" aria-labelledby="gallery-featured-title">
          ${renderGalleryFeaturedRecord(featuredRecord)}
        </section>

        <section class="gallery-filter-section" aria-label="Gallery filters">
          <div class="gallery-filter-section__filters">
            <div class="gallery-filter-track" data-gallery-filter-track>
              ${renderGalleryCategoryRows()}
            </div>
          </div>
          <div class="gallery-filter-actions">
            <div class="gallery-filter-more">
              <button class="gallery-filter-more__button" type="button" data-gallery-more-filters aria-expanded="false" aria-haspopup="true">
                More Filters
              </button>
              <div class="gallery-filter-more__menu" role="menu">
                ${renderGalleryMoreFilters()}
              </div>
            </div>
            <label class="gallery-sort-control">
              <span>Sort:</span>
              <select aria-label="Sort visual records" data-gallery-sort>
                ${renderGallerySortOptions()}
              </select>
            </label>
          </div>
        </section>

        <section class="gallery-records-section" aria-labelledby="gallery-records-title">
          <div class="gallery-records-header">
            <h2 id="gallery-records-title">Visual Records</h2>
          </div>
          ${renderGalleryRecordsState(galleryPagination)}
          <div class="gallery-record-grid">
            ${galleryPagination.visibleRecords.map(renderGalleryRecordPlaceholder).join("")}
          </div>
          ${galleryPagination.visibleRecords.length ? renderGalleryRecordPagination(galleryPagination) : ""}
        </section>
      </main>

      <div class="gallery-bottom-grid">
        ${galleryBottomSections.map(renderGalleryBottomSection).join("")}
      </div>

      <figure class="gallery-quote-strip">
        <blockquote>&ldquo;Some images show the world. Others show what was never meant to be seen.&rdquo;</blockquote>
        <figcaption>— Zephyra Noctis</figcaption>
      </figure>
      ${renderGalleryRecordModal()}
      ${renderGalleryUtilityModal()}
      ${renderGalleryVisualTrailRestoredOverlay()}
    </div>
  `;
}

function renderMemoryVaultRoom(room) {
  return `
    <div class="archive-room-panel archive-room-panel--memory-vault">
      <div class="archive-memory-vault-header">
        <p class="archive-entry__stamp">Memory Vault</p>
        <h3>The Vault Remains Sealed</h3>
        <p>Memory Vault unlock rule will be added later.</p>
      </div>
      <section class="archive-memory-vault-unlock" aria-label="Memory Vault unlock source">
        <span>Unlock Rule</span>
        <p>Pending</p>
      </section>
      <p class="archive-memory-vault-note">Final Memory Vault records will be added later.</p>
    </div>
  `;
}

function renderRoomContent(room) {
  if (room.id === "entry-desk") {
    return renderEntryDeskRoom(room);
  }

  if (room.id === "shelves") {
    return renderShelvesRoom(room);
  }

  if (room.id === "gallery") {
    return renderGalleryRoom(room);
  }

  if (room.id === "memory-vault") {
    return renderMemoryVaultRoom(room);
  }

  return "";
}

function renderSelectedChamberContent(room) {
  if (isRoomLocked(room)) {
    return "";
  }

  if (enteredArchiveRoomId !== room.id) {
    return "";
  }

  const content = renderRoomContent(room);

  return content
    ? `<section class="archive-selected-chamber" data-chamber-interior="${escapeHtml(room.id)}" aria-label="${escapeHtml(room.title)} contents" tabindex="-1">${content}</section>`
    : "";
}

// Code validation accepts recovered words case-insensitively and trims extra
// space before unlocking hidden recovery paths from Noctis records.
function normalizeArchiveCode(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderCurrentArchiveSurface() {
  if (isNoctisRoomPage) {
    renderNoctisRoomByQuery();
    return;
  }

  renderArchiveRooms();
}

function renderShelvesSurfaceWithSearchFocus(selectionStart = null, selectionEnd = null) {
  renderCurrentArchiveSurface();

  window.requestAnimationFrame(() => {
    const searchInput = document.querySelector("[data-shelves-search]");

    if (!searchInput) {
      return;
    }

    searchInput.focus({ preventScroll: true });

    if (typeof selectionStart === "number" && typeof selectionEnd === "number") {
      searchInput.setSelectionRange(selectionStart, selectionEnd);
    }
  });
}

function showArchiveCodeFeedback(message, tone = "info") {
  window.clearTimeout(archiveCodeFeedbackTimeout);
  archiveCodeFeedback = message;
  archiveCodeFeedbackTone = tone;
  renderCurrentArchiveSurface();

  archiveCodeFeedbackTimeout = window.setTimeout(() => {
    archiveCodeFeedback = "";
    archiveCodeFeedbackTone = "";
    renderCurrentArchiveSurface();
  }, 2600);
}

async function handleArchiveCodeSubmit(form) {
  const formData = new FormData(form);
  const submittedCode = normalizeArchiveCode(formData.get("archive-code"));
  const matchedKeyId = Object.keys(correctArchiveCodes).find(
    (keyId) => normalizeArchiveCode(correctArchiveCodes[keyId]) === submittedCode
  );

  if (!matchedKeyId) {
    showArchiveCodeFeedback("The Archive denies your whisper.", "error");
    return;
  }

  if (!artifactProgressState.isLoaded) {
    showArchiveCodeFeedback("The Archive is still listening. Try again in a moment.", "error");
    return;
  }

  if (isElementalKeyUnlocked(matchedKeyId)) {
    showArchiveCodeFeedback("The Archive heard your whisper.", "success");
    return;
  }

  const saveResult = await saveUnlockedElementalKey(matchedKeyId);

  if (saveResult.status === "error") {
    showArchiveCodeFeedback("The Archive could not hold that whisper. Try again.", "error");
    return;
  }

  if (saveResult.status === "duplicate") {
    showArchiveCodeFeedback("The Archive heard your whisper.", "success");
    return;
  }

  if (
    saveResult.previousKeys.length < elementalKeys.length &&
    areAllElementalKeysRecovered()
  ) {
    await saveUnlockedArtifactGatedRooms();
  }

  showArchiveCodeFeedback("The Archive heard your whisper.", "success");
}

function openArchiveShelfEntry(entryId, trigger) {
  const entry = archiveShelfEntries.find((archiveEntry) => archiveEntry.id === entryId);

  if (!entry || !window.AstralVeilScrollReader) {
    return;
  }

  window.AstralVeilScrollReader.open({
    variant: "noctis",
    label: entry.label,
    title: entry.title,
    author: entry.author,
    body: entry.body,
    trigger
  });
}

function focusEnteredChamber(room) {
  window.requestAnimationFrame(() => {
    const chamberInterior = document.querySelector(`[data-chamber-interior="${CSS.escape(room.id)}"]`);

    if (!chamberInterior) {
      showRoomToast(`${room.title} does not answer with records yet.`);
      return;
    }

    chamberInterior.scrollIntoView({ behavior: "smooth", block: "start" });
    chamberInterior.focus({ preventScroll: true });
  });
}

function openRestrictedWingRitual() {
  selectedArchiveRoomId = "restricted-wing";
  enteredArchiveRoomId = "";
  activeArchiveShelfEntryId = "";
  restrictedWingGuestPromptOpen = false;
  restrictedWingRitualOpen = true;

  if (window.location.hash) {
    window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
  }

  renderArchiveRooms();
  window.requestAnimationFrame(() => {
    document.querySelector(".restricted-wing-ritual__button[data-restricted-wing-ritual-close]")?.focus({ preventScroll: true });
  });
}

function closeRestrictedWingRitual() {
  if (!restrictedWingRitualOpen) {
    return;
  }

  restrictedWingRitualOpen = false;
  enteredArchiveRoomId = "";

  if (isNoctisRoomPage) {
    window.location.assign("archive.html");
    return;
  }

  renderArchiveRooms();
  archiveRoomHub?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openRestrictedWingGuestPrompt() {
  selectedArchiveRoomId = "restricted-wing";
  enteredArchiveRoomId = "";
  activeArchiveShelfEntryId = "";
  restrictedWingRitualOpen = false;
  restrictedWingGuestPromptOpen = true;

  if (window.location.hash) {
    window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
  }

  renderArchiveRooms();
  window.requestAnimationFrame(() => {
    document.querySelector(".restricted-wing-ritual--guest .restricted-wing-ritual__actions a")?.focus({ preventScroll: true });
  });
}

function closeRestrictedWingGuestPrompt() {
  if (!restrictedWingGuestPromptOpen) {
    return;
  }

  restrictedWingGuestPromptOpen = false;
  enteredArchiveRoomId = "";

  if (isNoctisRoomPage) {
    window.location.assign("archive.html");
    return;
  }

  renderArchiveRooms();
  archiveRoomHub?.scrollIntoView({ behavior: "smooth", block: "start" });
}

////////////////////////////////////////////////////
// Chamber Entry and Hash Routing
////////////////////////////////////////////////////

// Enter actions keep the redesigned viewer intact while moving into the selected chamber's records.
async function enterArchiveRoom(roomId) {
  const room = getRoomById(roomId);

  if (!room) {
    return;
  }

  selectedArchiveRoomId = room.id;
  enteredArchiveRoomId = room.id;
  activeArchiveShelfEntryId = "";

  if (isRoomLocked(room)) {
    showRoomToast(getRoomLockedMessage(room));
    return;
  }

  if (room.id === "restricted-wing") {
    if (shouldShowGuestRestrictedWingPrompt()) {
      openRestrictedWingGuestPrompt();
      return;
    }

    trackArchiveRoomVisit(room, {
      selected_from: "archive_chamber_viewer",
      revealed_state: "unlocked_not_revealed"
    });
    trackRestrictedWingSealDiscovery();
    openRestrictedWingRitual();
    return;
  }

  if (window.location.hash) {
    window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
  }

  await saveRoomProgress(room.id, {
    status: "open",
    unlockMethod: "room_entry",
    sourceLocation: "Noctis Archive",
    metadata: {
      selected_from: "archive_chamber_viewer"
    }
  });
  await trackArchiveRoomVisit(room, {
    selected_from: "archive_chamber_viewer"
  });

  window.location.assign(`noctis-room.html?room=${encodeURIComponent(room.id)}`);
}

// Clears the hash and restores the chamber selector hub.
function returnToRoomHub({ updateHash = true, scroll = true } = {}) {
  if (!archiveRoomHub || !archiveRoomView) {
    return;
  }

  if (updateHash && window.location.hash) {
    window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
  }

  archiveRoomView.hidden = true;
  archiveRoomView.innerHTML = "";
  archiveRoomHub.hidden = false;
  enteredArchiveRoomId = "";
  document.body.classList.remove("entry-desk-page");
  restrictedWingRitualOpen = false;
  restrictedWingGuestPromptOpen = false;
  renderArchiveRooms();

  if (scroll) {
    archiveRoomHub.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Supports direct links such as archive.html#entry-desk while rejecting locked room hashes.
async function syncRoomFromHash() {
  const roomId = window.location.hash.replace("#", "");
  const room = getRoomById(roomId);

  if (!roomId) {
    returnToRoomHub({ updateHash: false, scroll: false });
    return;
  }

  if (!room || isRoomLocked(room)) {
    window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
    returnToRoomHub({ updateHash: false });

    if (room && isRoomLocked(room)) {
      showRoomToast(getRoomLockedMessage(room));
    }

    return;
  }

  hasNormalizedInitialRoomHash = true;

  if (room.id === "restricted-wing") {
    if (shouldShowGuestRestrictedWingPrompt()) {
      openRestrictedWingGuestPrompt();
      return;
    }

    await trackArchiveRoomVisit(room, {
      selected_from: "hash_route",
      revealed_state: "unlocked_not_revealed"
    });
    trackRestrictedWingSealDiscovery();
    openRestrictedWingRitual();
    return;
  }

  selectedArchiveRoomId = room.id;
  enteredArchiveRoomId = room.id;
  activeArchiveShelfEntryId = "";
  window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
  await saveRoomProgress(room.id, {
    status: "open",
    unlockMethod: "direct_link",
    sourceLocation: "Noctis Archive",
    metadata: {
      selected_from: "hash_route"
    }
  });
  await trackArchiveRoomVisit(room, {
    selected_from: "hash_route"
  });
  renderArchiveRooms();
}

function returnToReaderSelection() {
  window.location.replace("index.html#reader-selection");
}

function handleArchiveBloodMoonChange(event) {
  const isBloodMoonActive = typeof event.detail?.isActive === "boolean"
    ? event.detail.isActive
    : isArchiveUnlocked();

  renderArchiveAccessState();

  if (!isBloodMoonActive) {
    returnToReaderSelection();
  }
}

async function initializeArchive() {
  await loadArtifactProgress();
  loadShelvesRecentlyReadEntries();
  await saveUnlockedArtifactGatedRooms();

  if (isNoctisRoomPage) {
    renderNoctisRoomByQuery();
    return;
  }

  renderArchiveRooms();
  renderArchiveAccessState();
  await syncRoomFromHash();
}

initializeArchive();

// Delegated archive actions cover room entry, room back buttons, thumbnail selection, and chamber nav.
document.addEventListener("click", (event) => {
  const roomButton = event.target.closest("[data-room-id], [data-room-enter]");
  const backButton = event.target.closest("[data-room-back]");
  const restrictedWingRitualClose = event.target.closest("[data-restricted-wing-ritual-close]");
  const restrictedWingGuestClose = event.target.closest("[data-restricted-wing-guest-close]");

  if (backButton) {
    returnToRoomHub();
    return;
  }

  if (restrictedWingRitualClose) {
    closeRestrictedWingRitual();
    return;
  }

  if (restrictedWingGuestClose) {
    closeRestrictedWingGuestPrompt();
    return;
  }

  if (roomButton) {
    enterArchiveRoom(roomButton.dataset.roomEnter || roomButton.dataset.roomId);
    return;
  }

  const noctisLockedRoomButton = event.target.closest("[data-noctis-room-locked]");
  const journalButton = event.target.closest("[data-open-archive-journal]");
  const roomSelectionButton = event.target.closest("[data-select-room]");
  const chamberNavButton = event.target.closest("[data-chamber-nav]");
  const viewRecoveredItemsButton = event.target.closest("[data-view-all-recovered-items]");
  const viewArchiveNoticesButton = event.target.closest("[data-view-all-archive-notices]");
  const archiveNoticesClose = event.target.closest("[data-archive-notices-close]");
  const archiveNoticesPageButton = event.target.closest("[data-archive-notices-page]");
  const archiveNoticesOverlay = event.target.classList?.contains("entry-desk-notices-modal");
  const whisperRow = event.target.closest("[data-whisper-id]");
  const whisperClose = event.target.closest("[data-close-whisper-modal]");
  const recoveredObjectButton = event.target.closest("[data-recovered-object]");
  const recoveredObjectCloseButton = event.target.closest(".archive-recovered-object-modal__close");
  const recoveredObjectOverlay = event.target.classList?.contains("archive-recovered-object-modal");
  const recoveredItemsClose = event.target.closest("[data-recovered-items-close]");
  const recoveredItemsOverlay = event.target.classList?.contains("archive-recovered-items-modal");
  const visualRecordButton = event.target.closest("[data-visual-record]");
  const visualRecordClose = event.target.closest("[data-visual-record-close]");
  const visualRecordNav = event.target.closest("[data-visual-record-nav]");
  const galleryRecordNav = event.target.closest("[data-gallery-record-nav]");
  const galleryRecordSetButton = event.target.closest("[data-gallery-record-set]");
  const galleryOpenRecordButton = event.target.closest("[data-gallery-open-record]");
  const galleryModalClose = event.target.closest("[data-gallery-modal-close]");
  const galleryFeaturedNavButton = event.target.closest("[data-gallery-featured-nav]");
  const galleryFeaturedDotButton = event.target.closest("[data-gallery-featured-dot]");
  const galleryMarkRecordButton = event.target.closest("[data-gallery-mark-record]");
  const galleryUnmarkRecordButton = event.target.closest("[data-gallery-unmark-record]");
  const galleryBottomActionButton = event.target.closest("[data-gallery-bottom-action]");
  const galleryOpenTrailButton = event.target.closest("[data-gallery-open-trail]");
  const galleryTrailsPageButton = event.target.closest("[data-gallery-trails-page]");
  const galleryRecoverTrailButton = event.target.closest("[data-gallery-recover-trail-fragment]");
  const galleryRevealTrailButton = event.target.closest("[data-gallery-reveal-trail]");
  const galleryTrailRestoredClose = event.target.closest("[data-gallery-trail-restored-close]");
  const galleryMoreFiltersButton = event.target.closest("[data-gallery-more-filters]");
  const galleryFilterChip = event.target.closest("[data-gallery-filter]");
  const shelvesFilterButton = event.target.closest("[data-shelves-filter]");
  const shelvesFilterNavButton = event.target.closest("[data-shelves-filter-nav]");
  const shelvesBrowseButton = event.target.closest("[data-shelves-browse]");
  const shelvesNavButton = event.target.closest("[data-shelves-nav]");
  const shelvesActionButton = event.target.closest("[data-action][data-shelves-document-id]");
  const shelvesModalClose = event.target.closest("[data-close-shelves-modal]");
  const shelvesAidActionButton = event.target.closest("[data-aid-action]");
  const shelvesAidClose = event.target.closest("[data-close-shelves-aid]");
  const shelvesAidDocumentButton = event.target.closest("[data-shelves-aid-document]");
  const shelvesAidPageButton = event.target.closest("[data-shelves-aid-page]");
  const shelvesSaveDocumentButton = event.target.closest("[data-shelves-save-document]");
  const shelvesUnsaveDocumentButton = event.target.closest("[data-shelves-unsave-document]");
  const shelvesNotableDocumentButton = event.target.closest("[data-shelves-notable-open]");
  const shelvesNotableViewAllButton = event.target.closest("[data-shelves-notable-view-all]");
  const shelvesNotableClose = event.target.closest("[data-close-shelves-notable-modal]");
  const shelvesNotablePageButton = event.target.closest("[data-shelves-notable-page]");
  const shelvesResearchTrailButton = event.target.closest("[data-shelves-research-trail]");
  const shelvesResearchExploreAllButton = event.target.closest("[data-shelves-research-explore-all]");
  const shelvesResearchClose = event.target.closest("[data-close-shelves-research-modal]");
  const shelvesRecentOpenButton = event.target.closest("[data-shelves-recent-open]");
  const shelvesRecentViewAllButton = event.target.closest("[data-shelves-recent-view-all]");
  const shelvesRecentClose = event.target.closest("[data-close-shelves-recent-modal]");

  if (noctisLockedRoomButton) {
    showRoomToast(noctisLockedRoomButton.dataset.lockedMessage || "The chamber does not answer yet.");
    return;
  }

  if (shelvesFilterButton) {
    shelvesActiveFilter = shelvesFilterButton.dataset.shelvesFilter || "all";
    shelvesActiveResearchTrailId = "";
    shelvesActiveIndex = 0;
    closeShelvesModals();
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesFilterNavButton) {
    const filterScroll = shelvesFilterNavButton.closest(".shelves-filter-strip")?.querySelector(".shelves-filter-scroll");

    if (filterScroll) {
      const delta = Math.max(120, Math.floor(filterScroll.clientWidth * 0.62));
      filterScroll.scrollBy({
        left: shelvesFilterNavButton.dataset.shelvesFilterNav === "previous" ? -delta : delta,
        behavior: "smooth"
      });
    }

    return;
  }

  if (shelvesBrowseButton) {
    shelvesActiveFilter = shelvesBrowseButton.dataset.shelvesBrowse || "all";
    shelvesSearchQuery = "";
    shelvesActiveResearchTrailId = "";
    shelvesActiveIndex = 0;
    closeShelvesModals();
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesNavButton) {
    const documents = getShelvesResultSet();

    if (documents.length) {
      const direction = shelvesNavButton.dataset.shelvesNav;
      shelvesActiveIndex = direction === "previous"
        ? (shelvesActiveIndex - 1 + documents.length) % documents.length
        : (shelvesActiveIndex + 1) % documents.length;
      closeShelvesModals();
      renderCurrentArchiveSurface();
    }

    return;
  }

  if (shelvesActionButton) {
    const documentId = shelvesActionButton.dataset.shelvesDocumentId || "";

    if (shelvesActionButton.dataset.action === "view-details") {
      openShelvesDetailsModal(documentId);
    } else {
      openShelvesReadModal(documentId);
    }

    return;
  }

  if (shelvesModalClose) {
    closeShelvesModals();
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesRecentClose) {
    isShelvesRecentModalOpen = false;
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesRecentViewAllButton) {
    openShelvesRecentModal();
    return;
  }

  if (shelvesRecentOpenButton) {
    openShelvesReadModal(shelvesRecentOpenButton.dataset.shelvesRecentOpen || "");
    return;
  }

  if (shelvesNotableClose) {
    isShelvesNotableModalOpen = false;
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesNotableViewAllButton) {
    openShelvesNotableModal();
    return;
  }

  if (shelvesNotablePageButton) {
    shelvesNotablePageIndex += shelvesNotablePageButton.dataset.shelvesNotablePage === "previous" ? -1 : 1;
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesResearchClose) {
    isShelvesResearchModalOpen = false;
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesResearchExploreAllButton) {
    openShelvesResearchModal();
    return;
  }

  if (shelvesResearchTrailButton) {
    applyShelvesResearchTrail(shelvesResearchTrailButton.dataset.shelvesResearchTrail || "");
    return;
  }

  if (shelvesSaveDocumentButton) {
    saveShelvesDocument(shelvesSaveDocumentButton.dataset.shelvesSaveDocument || "");
    return;
  }

  if (shelvesUnsaveDocumentButton) {
    event.stopPropagation();
    unsaveShelvesDocument(shelvesUnsaveDocumentButton.dataset.shelvesUnsaveDocument || "");
    return;
  }

  if (shelvesNotableDocumentButton) {
    openShelvesReadModal(shelvesNotableDocumentButton.dataset.shelvesNotableOpen || "");
    return;
  }

  if (shelvesAidActionButton) {
    openShelvesAidModal(shelvesAidActionButton.dataset.aidAction || "");
    return;
  }

  if (shelvesAidDocumentButton) {
    openShelvesDetailsModal(shelvesAidDocumentButton.dataset.shelvesAidDocument || "");
    return;
  }

  if (shelvesAidPageButton) {
    shelvesAidPageIndex += shelvesAidPageButton.dataset.shelvesAidPage === "previous" ? -1 : 1;
    renderCurrentArchiveSurface();
    return;
  }

  if (shelvesAidClose) {
    closeShelvesModals();
    renderCurrentArchiveSurface();
    return;
  }

  if (journalButton) {
    openArchiveShelfEntry(journalButton.dataset.openArchiveJournal, journalButton);
    return;
  }

  if (recoveredObjectCloseButton || recoveredObjectOverlay) {
    openRecoveredObjectId = "";
    isRecoveredItemsModalOpen = false;
    renderCurrentArchiveSurface();
    return;
  }

  if (recoveredItemsClose || recoveredItemsOverlay) {
    isRecoveredItemsModalOpen = false;
    renderCurrentArchiveSurface();
    return;
  }

  if (archiveNoticesClose || archiveNoticesOverlay) {
    isArchiveNoticesModalOpen = false;
    archiveNoticesModalPage = 0;
    renderCurrentArchiveSurface();
    return;
  }

  if (archiveNoticesPageButton) {
    const direction = archiveNoticesPageButton.dataset.archiveNoticesPage;
    archiveNoticesModalPage += direction === "next" ? 1 : -1;
    renderCurrentArchiveSurface();
    return;
  }

  if (viewArchiveNoticesButton) {
    isArchiveNoticesModalOpen = true;
    archiveNoticesModalPage = 0;
    renderCurrentArchiveSurface();
    window.requestAnimationFrame(() => {
      presentEntryDeskNoticesModal();
    });
    return;
  }

  if (whisperClose) {
    openEntryDeskWhisperId = "";
    renderCurrentArchiveSurface();
    return;
  }

  if (whisperRow) {
    openEntryDeskWhisperId = whisperRow.dataset.whisperId || "";
    renderCurrentArchiveSurface();
    window.requestAnimationFrame(() => {
      presentEntryDeskWhisperModal();
    });
    return;
  }

  if (viewRecoveredItemsButton) {
    isRecoveredItemsModalOpen = true;
    openRecoveredObjectId = "";
    renderCurrentArchiveSurface();
    return;
  }

  if (recoveredObjectButton) {
    openRecoveredObjectId = recoveredObjectButton.dataset.recoveredObject;
    isRecoveredItemsModalOpen = false;
    renderCurrentArchiveSurface();
    return;
  }

  if (visualRecordClose) {
    openVisualRecordId = "";
    renderArchiveRooms();
    return;
  }

  if (visualRecordButton) {
    openVisualRecordId = visualRecordButton.dataset.visualRecord;
    renderArchiveRooms();
    return;
  }

  if (visualRecordNav) {
    moveVisualRecord(visualRecordNav.dataset.visualRecordNav);
    return;
  }

  if (galleryRecordNav) {
    moveGalleryRecord(galleryRecordNav.dataset.galleryRecordNav);
    return;
  }

  if (galleryModalClose) {
    closeGalleryModals();
    renderArchiveRooms();
    return;
  }

  if (galleryTrailRestoredClose) {
    closeGalleryTrailRestoredOverlay();
    renderArchiveRooms();
    return;
  }

  if (galleryMarkRecordButton) {
    event.stopPropagation();
    toggleGalleryMarkedRecord(galleryMarkRecordButton.dataset.galleryMarkRecord);
    return;
  }

  if (galleryUnmarkRecordButton) {
    event.stopPropagation();
    toggleGalleryMarkedRecord(galleryUnmarkRecordButton.dataset.galleryUnmarkRecord);
    return;
  }

  if (galleryOpenRecordButton) {
    openGalleryRecordModal(galleryOpenRecordButton.dataset.galleryOpenRecord);
    return;
  }

  if (galleryFeaturedNavButton) {
    moveGalleryFeaturedRecord(galleryFeaturedNavButton.dataset.galleryFeaturedNav);
    return;
  }

  if (galleryFeaturedDotButton) {
    selectGalleryFeaturedRecord(Number(galleryFeaturedDotButton.dataset.galleryFeaturedDot));
    return;
  }

  if (galleryBottomActionButton) {
    openGalleryUtilityModal = galleryBottomActionButton.dataset.galleryBottomAction || "trails";
    openGalleryRecordId = "";
    updateGalleryModalOpenState();
    renderArchiveRooms();
    return;
  }

  if (galleryOpenTrailButton) {
    syncSelectedGalleryVisualTrail(galleryOpenTrailButton.dataset.galleryOpenTrail || "");
    openGalleryUtilityModal = "trail-detail";
    openGalleryRecordId = "";
    updateGalleryModalOpenState();
    renderArchiveRooms();
    return;
  }

  if (galleryTrailsPageButton) {
    const direction = galleryTrailsPageButton.dataset.galleryTrailsPage;
    const totalPages = Math.max(1, Math.ceil(galleryVisualTrailState.trails.length / 10));

    if (direction === "previous") {
      galleryVisualTrailState.trailPageIndex = Math.max(0, galleryVisualTrailState.trailPageIndex - 1);
    } else if (direction === "next") {
      galleryVisualTrailState.trailPageIndex = Math.min(totalPages - 1, galleryVisualTrailState.trailPageIndex + 1);
    }

    renderArchiveRooms();
    return;
  }

  if (galleryRecoverTrailButton) {
    recoverNextGalleryTrailFragment();
    return;
  }

  if (galleryRevealTrailButton) {
    revealGalleryVisualTrailRestoredImage();
    return;
  }

  if (galleryRecordSetButton) {
    const pagination = getGalleryPaginationState();
    const direction = galleryRecordSetButton.dataset.galleryRecordSet;

    if (direction === "previous" && pagination.canGoPrevious) {
      galleryRecordSetIndex -= 1;
    } else if (direction === "next" && pagination.canGoNext) {
      galleryRecordSetIndex += 1;
    }

    renderArchiveRooms();
    return;
  }

  if (galleryMoreFiltersButton) {
    const filterMore = galleryMoreFiltersButton.closest(".gallery-filter-more");
    const isOpen = !filterMore?.classList.contains("is-open");
    document.querySelectorAll(".gallery-filter-more.is-open").forEach((menu) => {
      menu.classList.remove("is-open");
      menu.querySelector("[data-gallery-more-filters]")?.setAttribute("aria-expanded", "false");
    });
    filterMore?.classList.toggle("is-open", isOpen);
    galleryMoreFiltersButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    return;
  }

  if (galleryFilterChip) {
    galleryActiveFilter = galleryFilterChip.dataset.galleryFilter || "All Records";
    galleryRecordSetIndex = 0;
    const filterMore = galleryFilterChip.closest(".gallery-filter-more");
    filterMore?.classList.remove("is-open");
    filterMore?.querySelector("[data-gallery-more-filters]")?.setAttribute("aria-expanded", "false");
    renderArchiveRooms();
    return;
  }

  document.querySelectorAll(".gallery-filter-more.is-open").forEach((menu) => {
    menu.classList.remove("is-open");
    menu.querySelector("[data-gallery-more-filters]")?.setAttribute("aria-expanded", "false");
  });

  if (roomSelectionButton) {
    selectArchiveRoom(roomSelectionButton.dataset.selectRoom);
    return;
  }

  if (chamberNavButton) {
    selectAdjacentArchiveRoom(chamberNavButton.dataset.chamberNav);
  }
});

document.addEventListener("input", (event) => {
  const shelvesSearchInput = event.target.closest?.("[data-shelves-search]");

  if (!shelvesSearchInput) {
    return;
  }

  shelvesSearchQuery = shelvesSearchInput.value;
  shelvesActiveResearchTrailId = "";
  shelvesActiveIndex = 0;
  closeShelvesModals();
  renderShelvesSurfaceWithSearchFocus(shelvesSearchInput.selectionStart, shelvesSearchInput.selectionEnd);
});

document.addEventListener("change", (event) => {
  const gallerySortSelect = event.target.closest?.("[data-gallery-sort]");

  if (!gallerySortSelect) {
    return;
  }

  galleryActiveSort = gallerySortOptions.includes(gallerySortSelect.value) ? gallerySortSelect.value : "Newest";
  galleryRecordSetIndex = 0;
  renderArchiveRooms();
});

document.addEventListener("keydown", (event) => {
  const whisperRow = event.target.closest?.("[data-whisper-id]");

  if (event.key === "Escape" && (openGalleryTrailRestoredId || galleryTrailRevealAnimatingId)) {
    event.preventDefault();
    closeGalleryTrailRestoredOverlay();
    renderArchiveRooms();
    return;
  }

  if (event.key === "Escape" && (openGalleryRecordId || openGalleryUtilityModal)) {
    event.preventDefault();
    closeGalleryModals();
    renderArchiveRooms();
    return;
  }

  if (whisperRow && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openEntryDeskWhisperId = whisperRow.dataset.whisperId || "";
    renderCurrentArchiveSurface();
    window.requestAnimationFrame(() => {
      presentEntryDeskWhisperModal();
    });
    return;
  }

  if (event.key === "Escape" && openEntryDeskWhisperId) {
    event.preventDefault();
    openEntryDeskWhisperId = "";
    renderCurrentArchiveSurface();
    return;
  }

  if (event.key === "Escape" && isArchiveNoticesModalOpen) {
    event.preventDefault();
    isArchiveNoticesModalOpen = false;
    archiveNoticesModalPage = 0;
    renderCurrentArchiveSurface();
    return;
  }

  if (event.key === "Escape" && isRecoveredItemsModalOpen) {
    event.preventDefault();
    isRecoveredItemsModalOpen = false;
    renderCurrentArchiveSurface();
    return;
  }

  if (event.key === "Escape" && (openShelvesReadDocumentId || openShelvesDetailsDocumentId || openShelvesAidModalId || isShelvesNotableModalOpen || isShelvesResearchModalOpen || isShelvesRecentModalOpen)) {
    event.preventDefault();
    closeShelvesModals();
    renderCurrentArchiveSurface();
    return;
  }

  if (event.key === "Escape" && restrictedWingGuestPromptOpen) {
    event.preventDefault();
    closeRestrictedWingGuestPrompt();
    return;
  }

  if (event.key === "Escape" && restrictedWingRitualOpen) {
    event.preventDefault();
    closeRestrictedWingRitual();
    return;
  }

  if (event.key === "ArrowRight" && openVisualRecordId) {
    event.preventDefault();
    moveVisualRecord("next");
    return;
  }

  if (event.key === "ArrowLeft" && openVisualRecordId) {
    event.preventDefault();
    moveVisualRecord("previous");
    return;
  }

  if (event.key !== "Escape" || (!openRecoveredObjectId && !openVisualRecordId)) {
    return;
  }

  openRecoveredObjectId = "";
  openVisualRecordId = "";
  renderArchiveRooms();
});

document.addEventListener("touchstart", (event) => {
  if (!openVisualRecordId && event.target.closest("[data-gallery-carousel]")) {
    const touch = event.changedTouches[0];
    galleryTouchStartX = touch.clientX;
    galleryTouchStartY = touch.clientY;
    return;
  }

  if (!openVisualRecordId || !event.target.closest(".visual-record-modal")) {
    return;
  }

  const touch = event.changedTouches[0];
  visualRecordTouchStartX = touch.clientX;
  visualRecordTouchStartY = touch.clientY;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  if (!openVisualRecordId && event.target.closest("[data-gallery-carousel]")) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - galleryTouchStartX;
    const deltaY = touch.clientY - galleryTouchStartY;

    if (Math.abs(deltaX) >= 42 && Math.abs(deltaX) >= Math.abs(deltaY) * 1.2) {
      moveGalleryRecord(deltaX < 0 ? "next" : "previous");
    }

    return;
  }

  if (!openVisualRecordId || !event.target.closest(".visual-record-modal")) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - visualRecordTouchStartX;
  const deltaY = touch.clientY - visualRecordTouchStartY;

  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
    return;
  }

  moveVisualRecord(deltaX < 0 ? "next" : "previous");
}, { passive: true });

document.addEventListener("submit", (event) => {
  const codeForm = event.target.closest("[data-archive-code-form]");

  if (!codeForm) {
    return;
  }

  event.preventDefault();
  handleArchiveCodeSubmit(codeForm);
});

window.addEventListener("astralVeilBloodMoonChange", handleArchiveBloodMoonChange);
if (!isNoctisRoomPage) {
  window.addEventListener("hashchange", syncRoomFromHash);
}
