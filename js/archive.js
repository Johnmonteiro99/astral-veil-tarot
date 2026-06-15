const archiveContent = document.querySelectorAll("[data-archive-content]");
const archiveLocked = document.querySelector("[data-archive-locked]");
const archiveFooterLink = document.querySelector("[data-archive-footer-link]");
const archiveRoomHub = document.querySelector("[data-archive-room-hub]");
const archiveRoomGrid = document.querySelector("[data-archive-room-grid]");
const archiveRoomView = document.querySelector("[data-archive-room-view]");
const archiveRoomToast = document.querySelector("[data-archive-room-toast]");
const isNoctisRoomPage = window.location.pathname.split("/").pop() === "noctis-room.html";
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
let selectedVeilwalkerWhispers = [];
let selectedArchiveEchoes = [];
let openEntryDeskWhisperId = "";

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
    clue: "Look for the reflection that moves after you stop moving.",
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
    clue: "Listen where the room goes quiet. The relic remembers what was exhaled.",
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
    subtitle: "Recovered through a reading pattern tied to ending, ignition, and return.",
    shortDescription: "A key shaped by heat, ash, and returning motion.",
    description:
      "A key shaped by heat, ash, and returning motion. It does not answer to destruction alone. It opens when the old form has burned and something brave enough to live again begins to rise.",
    lore: "Placeholder lore text. Final Fire Key lore will be added later.",
    clue: "Found where Death walks beside flame.",
    archiveNote:
      "Placeholder archive note. This relic was recovered through a reading pattern tied to ending, ignition, and return.",
    useHint: "Placeholder use text. This artifact may unlock future paths tied to courage, action, and transformation.",
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
    clue: "Find the place where the wall feels older than the room.",
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
  return Boolean(window.AstralVeilEvents?.isEventActive("bloodMoon"));
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
    document.body.classList.remove("entry-desk-page", "shelves-page");
    isRecoveredItemsModalOpen = false;
    isArchiveNoticesModalOpen = false;
    archiveNoticesModalPage = 0;
    openEntryDeskWhisperId = "";
    resetEntryDeskActivityCards();
    updateEntryDeskModalOpenState();
    renderNoctisRoomNotFound();
    return;
  }

  document.body.classList.toggle("entry-desk-page", room.id === "entry-desk");
  document.body.classList.toggle("shelves-page", room.id === "shelves");
  if (room.id !== "entry-desk") {
    isRecoveredItemsModalOpen = false;
    isArchiveNoticesModalOpen = false;
    archiveNoticesModalPage = 0;
    openEntryDeskWhisperId = "";
    resetEntryDeskActivityCards();
  }

  noctisRoomType.textContent = "Noctis Archive";
  noctisRoomTitle.textContent = room.title;
  noctisRoomCopy.classList.remove("archive-room-placeholder__copy--not-found");
  noctisRoomCopy.textContent = room.intro || room.description || "The chamber has awakened.";
  noctisRoomBack.textContent = "Return to Noctis Archive";
  noctisRoomBack.setAttribute("href", "archive.html");

  selectedArchiveRoomId = room.id;
  enteredArchiveRoomId = room.id;
  activeArchiveShelfEntryId = "";

  if (openVisualRecordId && !getOpenVisualRecord()) {
    openVisualRecordId = "";
  }

  if (openRecoveredObjectId && !getSelectedRecoveredObject(getRecoveredObjects())) {
    openRecoveredObjectId = "";
  }

  const roomMarkup = isRoomLocked(room)
    ? renderNoctisRoomLockedPanel(room)
    : (renderRoomContent(room) || renderNoctisRoomLockedPanel(room));
  const shouldRenderRoomAppendices = room.id !== "entry-desk" && room.id !== "shelves";

  noctisRoomContent.innerHTML = `
    ${roomMarkup}
    ${shouldRenderRoomAppendices ? renderRecoveredObjects() : ""}
    ${shouldRenderRoomAppendices ? renderArchiveLorePanel() : ""}
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
  const hasOpenEntryDeskModal = Boolean(
    isEntryDeskActive &&
    (
      openEntryDeskWhisperId ||
      isArchiveNoticesModalOpen ||
      isRecoveredItemsModalOpen
    )
  );

  document.body.classList.toggle("modal-open", hasOpenEntryDeskModal);
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
    isRecoveredItemsModalOpen = false;
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
      ${isEntryDeskInteriorOpen ? "" : `<div class="archive-recovery-stack">
        ${renderRecoveredObjects()}
      </div>`}
      ${isEntryDeskInteriorOpen ? "" : renderArchiveLorePanel()}
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
      <div class="entry-desk-page-heading">
        <h1>Noctis Archive</h1>
      </div>
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
        <a class="entry-desk-return" href="archive.html">
          <img src="assets/icons/symbols/arrow-long-left.svg" alt="" aria-hidden="true" width="18" height="18" loading="eager" decoding="async" />
          <span>Return to Noctis Archive</span>
        </a>
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

function renderEntryDeskWhisperModal() {
  const whisper = selectedVeilwalkerWhispers.find((item) => item.id === openEntryDeskWhisperId);

  if (!whisper) {
    return "";
  }

  return `
    <div class="entry-desk-whisper-modal" role="presentation">
      <div class="entry-desk-whisper-modal-backdrop" data-close-whisper-modal></div>
      <article class="entry-desk-whisper-dialog" role="dialog" aria-modal="true" aria-labelledby="entryDeskWhisperTitle">
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
      <article class="entry-desk-notices-dialog" role="dialog" aria-modal="true" aria-labelledby="entry-desk-notices-title">
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
    return `<img src="${escapeHtml(object.image)}" alt="${escapeHtml(object.title)} artifact" width="${ARCHIVE_ARTIFACT_SIZE}" height="${ARCHIVE_ARTIFACT_SIZE}" loading="lazy" decoding="async" onerror="this.closest('.archive-recovered-object-card__icon').classList.add('is-missing'); this.remove();" />`;
  }

  return `<span aria-hidden="true">${escapeHtml(object.name?.charAt(0) || "K")}</span>`;
}

function renderRecoveredObjectCard(object, isRecovered = true) {
  const dataAttribute = isRecovered ? `data-recovered-object="${escapeHtml(object.id)}"` : "";

  return `
    <button class="archive-recovered-object-card ${escapeHtml(object.accentClass || "")}${isRecovered ? " is-recovered" : " is-locked"}" type="button" ${dataAttribute} ${isRecovered ? "" : "disabled"} aria-label="${escapeHtml(isRecovered ? `Open ${object.title} recovered artifact details` : `${object.title} not yet recovered`)}">
      <span class="archive-recovered-object-card__icon">
        ${renderRecoveredObjectIcon(object)}
      </span>
      <span class="archive-recovered-object-card__copy">
        <strong>${escapeHtml(object.title)}</strong>
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
        <figure class="archive-artifact-modal-figure">
          <img class="archive-artifact-preview-image" src="${escapeHtml(object.image)}" alt="${escapeHtml(object.title)} artifact" width="${ARCHIVE_ARTIFACT_SIZE}" height="${ARCHIVE_ARTIFACT_SIZE}" loading="lazy" decoding="async" />
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
          ${renderRecoveredObjectDetailSection("Clue", object.clue)}
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

  const unlockedKeys = getUnlockedElementalKeys();

  return `
    <div class="archive-recovered-items-modal" role="presentation">
      <article class="archive-recovered-items-dialog" role="dialog" aria-modal="true" aria-labelledby="recovered-items-title">
        <button class="archive-recovered-object-modal__close" type="button" data-recovered-items-close aria-label="Close recovered items list">Close</button>
        <div class="archive-recovered-items-dialog__header">
          <p>Archive Inventory</p>
          <h4 id="recovered-items-title">Recovered Items</h4>
        </div>
        <div class="archive-recovered-items-list">
          ${elementalKeys.map((object) => {
            const isRecovered = unlockedKeys.includes(object.id);

            return `
              <article class="archive-recovered-items-list__row ${escapeHtml(object.accentClass || "")}${isRecovered ? " is-recovered" : " is-locked"}">
                <span class="archive-recovered-items-list__icon">${renderRecoveredObjectIcon(object)}</span>
                <span>
                  <strong>${escapeHtml(object.title)}</strong>
                  <em>${escapeHtml(object.type || "Recovered Finding")} • ${escapeHtml(isRecovered ? "Recovered" : "Locked")}</em>
                </span>
              </article>
            `;
          }).join("")}
        </div>
      </article>
    </div>
  `;
}

// The recovered-object display presents each elemental key as an inspectable
// archive artifact while the underlying key progress remains available to locks.
function renderRecoveredObjects() {
  const unlockedKeys = getUnlockedElementalKeys();
  const recoveredObjects = getRecoveredObjects();
  const selectedObject = getSelectedRecoveredObject(recoveredObjects);

  if (openRecoveredObjectId && !selectedObject) {
    openRecoveredObjectId = "";
  }

  return `
    <section class="archive-recovered-objects entry-desk-findings-section" aria-labelledby="entry-desk-findings-title">
      <div class="archive-section-copy entry-desk-section-heading">
        <h3 id="entry-desk-findings-title">Recovered Findings</h3>
        <p>Things pulled from the spaces between memory and forgetting.</p>
      </div>
      <div class="archive-recovered-inventory">
        <div class="archive-recovered-object-strip" aria-label="Recovered findings inventory">
          ${elementalKeys.map((object) => renderRecoveredObjectCard(object, unlockedKeys.includes(object.id))).join("")}
        </div>
      </div>
      <button class="archive-view-recovered-items-btn" type="button" data-view-all-recovered-items>
        <span>View all recovered items</span>
        <img src="assets/icons/symbols/arrow-long-right.svg" alt="" aria-hidden="true" width="18" height="18" loading="lazy" decoding="async" />
      </button>
      ${recoveredObjects.length ? "" : `<p class="archive-empty-state">No findings recovered yet. The desk is still listening.</p>`}
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

function renderArchiveLorePanel() {
  return `
    <section class="archive-remembers-panel" aria-label="The Archive remembers">
      <div>
        <p>The Archive Remembers</p>
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

// Shelves prepares the manuscript/journal rail without loading future content yet.
function renderShelvesRoom(room) {
  const shelfCategories = [
    {
      id: "manuscripts",
      title: "Manuscripts",
      description: "Aged folios, margin notes, and recovered pages awaiting translation."
    },
    {
      id: "letters",
      title: "Letters",
      description: "Wax-sealed correspondence and messages that still carry a pulse."
    },
    {
      id: "unstable-texts",
      title: "Unstable Texts",
      description: "Pages whose ink shifts when the Archive is no longer watched."
    }
  ];
  const featuredEntry = archiveShelfEntries[0];

  return `
    <div class="shelves-page-shell">
      <section class="shelves-grid">
        <section class="shelves-hero" aria-labelledby="shelves-title">
          <div class="shelves-hero-content">
            <a class="shelves-back-link" href="archive.html">Return to Noctis Archive</a>
            <p class="archive-entry__stamp">Noctis Archive</p>
            <h2 id="shelves-title">The Shelves</h2>
            <p>The shelves hold what the Archive refused to forget.</p>
          </div>
        </section>

        ${featuredEntry ? `
          <section class="shelves-recovered-feature" aria-labelledby="shelves-feature-title">
            <div>
              <p class="archive-entry__stamp">${escapeHtml(featuredEntry.label)}</p>
              <h3 id="shelves-feature-title">${escapeHtml(featuredEntry.title)}</h3>
              <p>${escapeHtml(featuredEntry.author)}</p>
            </div>
            <button type="button" data-open-archive-journal="${escapeHtml(featuredEntry.id)}">Read Fragment</button>
          </section>
        ` : ""}

        <section class="shelves-category-grid" aria-label="Recovered writing categories">
          ${shelfCategories.map((category) => `
            <article class="shelves-category-card shelves-category-card--${escapeHtml(category.id)}">
              <span>${escapeHtml(category.title)}</span>
              <p>${escapeHtml(category.description)}</p>
            </article>
          `).join("")}
        </section>

        <section class="shelves-cipher-board" aria-labelledby="shelves-cipher-title">
          <p class="archive-entry__stamp">Cipher Board</p>
          <h3 id="shelves-cipher-title">Codes Waiting for a Key</h3>
          <p>Norse markings, cryptic substitutions, recovered symbols, and incomplete translations will gather here as the Archive learns how to read them.</p>
        </section>

        <section class="shelves-map-fragments" aria-labelledby="shelves-map-title">
          <p class="archive-entry__stamp">Map Fragments</p>
          <h3 id="shelves-map-title">Pieces of the Route</h3>
          <p>Torn pages, letter pieces, navigation clues, and half-remembered diagrams wait for the path they belong to.</p>
        </section>
      </section>
    </div>
  `;
}

function renderVisualRecordCard(record) {
  return `
    <figure class="archive-visual-record">
      <button class="archive-visual-record__preview" type="button" data-visual-record="${escapeHtml(record.id)}" aria-label="${escapeHtml(`View ${record.title} full size`)}">
        <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} visual record" width="${record.width || ARCHIVE_ARTWORK_WIDTH}" height="${record.height || ARCHIVE_ARTWORK_HEIGHT}" loading="lazy" decoding="async" onerror="this.closest('.archive-visual-record').classList.add('is-image-missing'); this.remove();" />
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
      <figure class="archive-gallery-record">
        <button class="archive-gallery-record__image-button" type="button" data-visual-record="${escapeHtml(record.id)}" aria-label="${escapeHtml(`Open visual record ${selectedGalleryRecordIndex + 1} full size`)}">
          <img src="${escapeHtml(record.image)}" alt="${escapeHtml(`Unknown visual record ${selectedGalleryRecordIndex + 1}`)}" width="${record.width || ARCHIVE_ARTWORK_WIDTH}" height="${record.height || ARCHIVE_ARTWORK_HEIGHT}" loading="lazy" decoding="async" />
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
        <figure class="visual-record-modal__image-frame">
          <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} visual record" width="${record.width || ARCHIVE_ARTWORK_WIDTH}" height="${record.height || ARCHIVE_ARTWORK_HEIGHT}" loading="eager" decoding="async" />
        </figure>
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
  return `
    <div class="archive-room-panel archive-room-panel--gallery">
      <div class="archive-gallery-header">
        <p class="archive-entry__stamp">Gallery</p>
        <h3>Recovered Visual Records</h3>
        <p>The Archive offers one image at a time. Names fail here first.</p>
      </div>
      ${renderGalleryRecordViewer()}
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

  if (roomSelectionButton) {
    selectArchiveRoom(roomSelectionButton.dataset.selectRoom);
    return;
  }

  if (chamberNavButton) {
    selectAdjacentArchiveRoom(chamberNavButton.dataset.chamberNav);
  }
});

document.addEventListener("keydown", (event) => {
  const whisperRow = event.target.closest?.("[data-whisper-id]");

  if (whisperRow && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openEntryDeskWhisperId = whisperRow.dataset.whisperId || "";
    renderCurrentArchiveSurface();
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
