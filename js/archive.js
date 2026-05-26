const archiveContent = document.querySelectorAll("[data-archive-content]");
const archiveLocked = document.querySelector("[data-archive-locked]");
const archiveFooterLink = document.querySelector("[data-archive-footer-link]");
const archiveRoomHub = document.querySelector("[data-archive-room-hub]");
const archiveRoomGrid = document.querySelector("[data-archive-room-grid]");
const archiveRoomView = document.querySelector("[data-archive-room-view]");
const archiveRoomToast = document.querySelector("[data-archive-room-toast]");

let archiveToastTimeout = null;
let hasNormalizedInitialRoomHash = false;
let selectedArchiveRoomId = "entry-desk";
let enteredArchiveRoomId = "";
let activeArchiveShelfEntryId = "";
let archiveCodeFeedback = "";
let openRecoveredObjectId = "";
let openVisualRecordId = "";
let selectedGalleryRecordIndex = 0;
let visualRecordTouchStartX = 0;
let visualRecordTouchStartY = 0;
let galleryTouchStartX = 0;
let galleryTouchStartY = 0;

const archiveKeyStorageKey = "astralVeilNoctisElementalKeys";
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
    image: "assets/images/water-artifact-clean.png",
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
    image: "assets/images/air-artifact-clean.png",
    accentClass: "element-air"
  },
  {
    id: "fire",
    name: "Fire",
    title: "Fire Key",
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
    image: "assets/images/fire-artifact-clean.png",
    accentClass: "element-fire"
  },
  {
    id: "earth",
    name: "Earth",
    title: "Earth Key",
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
    image: "assets/images/earth-artifact-clean.png",
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
    image: "assets/images/noctis/visual-records/trio-study.png",
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "castle-black",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/castle-black.png",
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "ufo-landing",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/ufo-landing.png",
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "the-veil-trine",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/the-veil-trine.png",
    caption: "The Archive has recovered the image, but not its name."
  },
  {
    id: "lost-city",
    title: "Unknown",
    label: "Visual Record",
    image: "assets/images/noctis/visual-records/lost-city.png",
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
  if (room?.id === "memory-vault") {
    const isUnlocked = !isRoomLocked(room);

    return {
      ...archiveRoomDetails[room.id],
      accessNotes: isUnlocked
        ? "Open. The four recovered relics have turned within the lock."
        : getRoomLockedMessage(room),
      archiveHint: isUnlocked
        ? "The door remembers the names of Air, Water, Earth, and Fire."
        : archiveRoomDetails[room.id]?.archiveHint || "A missing piece is still shaping the door."
    };
  }

  return archiveRoomDetails[room.id] || {
    tags: [getRoomStatus(room), room.type].filter(Boolean),
    contains: room.description,
    accessNotes: room.isLocked ? room.lockedMessage || "Access withheld." : "Open for exploration.",
    archiveHint: room.intro || room.description
  };
}

function getUnlockedElementalKeys() {
  try {
    const parsedValue = JSON.parse(localStorage.getItem(archiveKeyStorageKey) || "[]");

    return Array.isArray(parsedValue)
      ? parsedValue.filter((keyId) => elementalKeys.some((key) => key.id === keyId))
      : [];
  } catch (error) {
    return [];
  }
}

// Key progress is saved in localStorage so recovered keys survive refreshes.
function saveUnlockedElementalKeys(unlockedKeys) {
  try {
    localStorage.setItem(archiveKeyStorageKey, JSON.stringify([...new Set(unlockedKeys)]));
  } catch (error) {
    return;
  }
}

function isElementalKeyUnlocked(keyId) {
  return getUnlockedElementalKeys().includes(keyId);
}

function areAllElementalKeysRecovered() {
  const unlockedKeys = getUnlockedElementalKeys();

  return elementalKeys.every((key) => unlockedKeys.includes(key.id));
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
  if (room?.id === "memory-vault" && areAllElementalKeysRecovered()) {
    return "Open";
  }

  return room?.status || "";
}

function isRoomLocked(room) {
  if (room?.id === "memory-vault") {
    return !areAllElementalKeysRecovered();
  }

  if (room?.id === "restricted-wing") {
    return !areAllElementalKeysRecovered();
  }

  return Boolean(room?.isLocked);
}

// The Restricted Wing remains sealed until all four elemental keys are recovered,
// but the visible copy keeps that requirement obscure.
function getRoomLockedMessage(room) {
  if (room?.id === "memory-vault" && isRoomLocked(room)) {
    const missingKeys = getMissingElementalKeys();
    const missingText = missingKeys.length ? ` Missing: ${missingKeys.join(", ")}.` : "";

    return `The Memory Vault does not answer yet. Four recovered relics must be named before its door remembers how to open. ${getElementalKeyProgressText()}.${missingText}`;
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
        loading="eager"
        decoding="async"
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
        <img src="${escapeHtml(room.image)}" alt="${escapeHtml(getRoomImageAlt(room))}" loading="lazy" decoding="async" onerror="this.closest('.archive-chamber-card__image').classList.add('is-missing'); this.remove();" />
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
  if (!archiveRoomGrid) {
    return;
  }

  const rooms = getArchiveRooms();
  const selectedRoom = getSelectedArchiveRoom();

  if (!rooms.length || !selectedRoom) {
    archiveRoomGrid.innerHTML = "";
    return;
  }

  const selectedIndex = rooms.findIndex((room) => room.id === selectedRoom.id);
  const details = getRoomDetails(selectedRoom);
  const actionLabel = getLockedRoomActionLabel(selectedRoom);
  const selectedRoomLocked = isRoomLocked(selectedRoom);
  const selectedRoomStatus = getRoomStatus(selectedRoom);

  archiveRoomGrid.innerHTML = `
    <div class="archive-chamber-viewer" data-selected-room="${escapeHtml(selectedRoom.id)}">
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
      ${renderSelectedChamberContent(selectedRoom)}
      <div class="archive-recovery-stack">
        ${renderRecoveredObjects()}
      </div>
      ${renderArchiveLorePanel()}
      ${renderVisualRecordModal()}
    </div>
  `;

  const thumbnailRail = archiveRoomGrid.querySelector(".archive-chamber-thumbnail-rail");
  const activeThumbnail = archiveRoomGrid.querySelector(".archive-chamber-card.is-active");

  if (thumbnailRail && activeThumbnail) {
    thumbnailRail.scrollLeft =
      activeThumbnail.offsetLeft - (thumbnailRail.clientWidth - activeThumbnail.clientWidth) / 2;
  }

  document.body.classList.toggle("is-visual-record-modal-open", Boolean(getOpenVisualRecord()));
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
  return renderArchiveCodePanel();
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
    return `<img src="${escapeHtml(object.image)}" alt="${escapeHtml(object.title)} artifact" loading="lazy" decoding="async" onerror="this.closest('.archive-recovered-object-card__icon').classList.add('is-missing'); this.remove();" />`;
  }

  return `<span aria-hidden="true">${escapeHtml(object.name?.charAt(0) || "K")}</span>`;
}

function renderRecoveredObjectCard(object) {
  return `
    <button class="archive-recovered-object-card ${escapeHtml(object.accentClass || "")}" type="button" data-recovered-object="${escapeHtml(object.id)}" aria-label="${escapeHtml(`Open ${object.title} recovered artifact details`)}">
      <span class="archive-recovered-object-card__icon">
        ${renderRecoveredObjectIcon(object)}
      </span>
      <span class="archive-recovered-object-card__copy">
        <strong>${escapeHtml(object.title)}</strong>
        <em>${escapeHtml(object.element || object.type || "Recovered Object")}</em>
        <small>${escapeHtml(object.type || "Recovered Object")}</small>
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
          <img class="archive-artifact-preview-image" src="${escapeHtml(object.image)}" alt="${escapeHtml(object.title)} artifact" loading="lazy" decoding="async" />
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

// The recovered-object display presents each elemental key as an inspectable
// archive artifact while the underlying key progress remains available to locks.
function renderRecoveredObjects() {
  const recoveredObjects = getRecoveredObjects();
  const selectedObject = getSelectedRecoveredObject(recoveredObjects);

  if (openRecoveredObjectId && !selectedObject) {
    openRecoveredObjectId = "";
  }

  return `
    <section class="archive-recovered-objects" aria-label="Recovered objects">
      <div class="archive-section-copy">
        <span aria-hidden="true">✣</span>
        <h3>Recovered Objects</h3>
        <p>Items pulled from the spaces between memory and forgetting.</p>
      </div>
      ${recoveredObjects.length ? `
        <div class="archive-recovered-inventory">
          <div class="archive-recovered-object-strip" aria-label="Recovered artifact inventory">
            ${recoveredObjects.map((object) => renderRecoveredObjectCard(object)).join("")}
          </div>
        </div>
      ` : `<p class="archive-empty-state">No recovered objects yet.</p>`}
      ${selectedObject ? renderRecoveredObjectDetail(selectedObject) : ""}
      <div class="archive-recovered-objects__art" aria-hidden="true"></div>
    </section>
  `;
}

function renderArchiveCodePanel() {
  return `
    <form class="archive-code-panel" data-archive-code-form>
      <div class="archive-section-copy">
        <span aria-hidden="true">☼</span>
        <h3>Recovered Code</h3>
        <p>Some locks answer only to words recovered elsewhere.</p>
      </div>
      <div class="archive-code-entry">
        <label class="archive-code-panel__field">
          <span>Archive Code</span>
          <input type="text" name="archive-code" autocomplete="off" spellcheck="false" />
        </label>
        <button type="submit">Whisper the Code</button>
      </div>
      <section class="archive-code-whispers" aria-label="Code whispers">
        <div class="archive-code-whispers__copy">
          <h4>Code Whispers</h4>
          <p class="archive-code-panel__feedback" data-archive-code-feedback aria-live="polite">
            ${archiveCodeFeedback ? escapeHtml(archiveCodeFeedback) : "No whispers heard yet."}
          </p>
        </div>
        <div class="archive-code-whispers__emblem" aria-hidden="true"></div>
      </section>
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
      <div class="archive-remembers-panel__sigil" aria-hidden="true">
        <svg class="archive-remembers-eye" viewBox="0 0 160 160" focusable="false" role="img">
          <defs>
            <radialGradient id="archiveBloodMoonGradient" cx="50%" cy="42%" r="58%">
              <stop offset="0%" stop-color="#ff9a8a" stop-opacity="0.95" />
              <stop offset="38%" stop-color="#ff334d" stop-opacity="0.82" />
              <stop offset="74%" stop-color="#6d0618" stop-opacity="0.72" />
              <stop offset="100%" stop-color="#130006" stop-opacity="0.1" />
            </radialGradient>
            <radialGradient id="archiveEyeIrisGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffe6c7" />
              <stop offset="42%" stop-color="#ff5367" />
              <stop offset="100%" stop-color="#31000b" />
            </radialGradient>
          </defs>
          <circle class="archive-remembers-eye__halo" cx="80" cy="80" r="68" />
          <circle class="archive-remembers-eye__moon" cx="80" cy="80" r="45" />
          <path class="archive-remembers-eye__diamond" d="M80 14 L146 80 L80 146 L14 80 Z" />
          <path class="archive-remembers-eye__ray" d="M80 4 V24 M80 136 V156 M4 80 H24 M136 80 H156 M32 32 L45 45 M128 32 L115 45 M128 128 L115 115 M32 128 L45 115" />
          <ellipse class="archive-remembers-eye__shape" cx="80" cy="80" rx="42" ry="19" />
          <circle class="archive-remembers-eye__iris" cx="80" cy="80" r="14" />
          <circle class="archive-remembers-eye__pupil" cx="80" cy="80" r="5" />
          <path class="archive-remembers-eye__lid" d="M38 80 C50 58 110 58 122 80 C110 102 50 102 38 80 Z" />
          <circle class="archive-remembers-eye__ring" cx="80" cy="80" r="57" />
          <path class="archive-remembers-eye__arc" d="M50 38 A52 52 0 0 1 110 38 M50 122 A52 52 0 0 0 110 122" />
        </svg>
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

  return `
    <div class="archive-room-panel archive-room-panel--shelves">
      <div class="archive-room-placeholder">
        <p class="archive-entry__stamp">Shelf Viewer</p>
        <h3>Recovered Writings</h3>
        <p>Journals, manuscripts, letters, and unstable texts gather here as they are recovered.</p>
      </div>
      <div class="archive-shelf-entry-list" aria-label="Recovered shelf entries">
        ${archiveShelfEntries.map((entry) => `
          <article class="archive-shelf-entry-card archive-shelf-entry-card--featured">
            <span class="archive-shelf-entry-card__mark" aria-hidden="true"></span>
            <span>${escapeHtml(entry.label)}</span>
            <h3>${escapeHtml(entry.title)}</h3>
            <p>${escapeHtml(entry.author)}</p>
            <button type="button" data-open-archive-journal="${escapeHtml(entry.id)}">Read Fragment</button>
          </article>
        `).join("")}
      </div>
      <div class="archive-room-rail archive-room-rail--shelf-categories" aria-label="Recovered writing categories">
        ${shelfCategories.map((category) => `
          <article class="archive-room-rail__slot archive-room-rail__slot--${escapeHtml(category.id)}">
            <span>${escapeHtml(category.title)}</span>
            <p>${escapeHtml(category.description)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderVisualRecordCard(record) {
  return `
    <figure class="archive-visual-record">
      <button class="archive-visual-record__preview" type="button" data-visual-record="${escapeHtml(record.id)}" aria-label="${escapeHtml(`View ${record.title} full size`)}">
        <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} visual record" loading="lazy" decoding="async" onerror="this.closest('.archive-visual-record').classList.add('is-image-missing'); this.remove();" />
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
          <img src="${escapeHtml(record.image)}" alt="${escapeHtml(`Unknown visual record ${selectedGalleryRecordIndex + 1}`)}" loading="lazy" decoding="async" />
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

  const recordIndex = getOpenVisualRecordIndex();
  const recordCount = galleryVisualRecords.length;
  const counter = `Visual Record ${recordIndex + 1} of ${recordCount}`;

  return `
    <div class="visual-record-modal is-open" role="presentation">
      <button class="visual-record-modal__backdrop" type="button" data-visual-record-close aria-label="Close visual record"></button>
      <article class="visual-record-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="visual-record-title">
        <button class="visual-record-modal__close" type="button" data-visual-record-close aria-label="Close visual record">×</button>
        <div class="visual-record-modal__viewer-label">
          <span>Visual Record Viewer</span>
          <strong>${escapeHtml(counter)}</strong>
        </div>
        <figure class="visual-record-modal__image-frame">
          <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} visual record" />
        </figure>
        <div class="visual-record-modal__copy">
          <p class="archive-entry__stamp">${escapeHtml(record.label)}</p>
          <h2 id="visual-record-title">${escapeHtml(record.title)}</h2>
          <p>${escapeHtml(record.caption)}</p>
          <div class="visual-record-modal__controls" aria-label="Browse visual records">
            <button type="button" data-visual-record-nav="previous">‹ Previous</button>
            <button type="button" data-visual-record-nav="next">Next ›</button>
          </div>
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
        <h3>The Vault Has Opened</h3>
        <p>The four recovered relics turn within the lock. Something old recognizes you from behind the door.</p>
      </div>
      <section class="archive-memory-vault-unlock" aria-label="Memory Vault unlock source">
        <span>Unlocked By</span>
        <p>Air · Water · Earth · Fire</p>
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

function handleArchiveCodeSubmit(form) {
  const formData = new FormData(form);
  const submittedCode = normalizeArchiveCode(formData.get("archive-code"));
  const matchedKeyId = Object.keys(correctArchiveCodes).find(
    (keyId) => normalizeArchiveCode(correctArchiveCodes[keyId]) === submittedCode
  );

  if (!matchedKeyId) {
    archiveCodeFeedback = archiveCodeFailureMessages[Math.floor(Math.random() * archiveCodeFailureMessages.length)];
    renderArchiveRooms();
    return;
  }

  if (isElementalKeyUnlocked(matchedKeyId)) {
    archiveCodeFeedback = archiveKeyFeedback[matchedKeyId]?.alreadyUnlocked || "The archive has already answered.";
    renderArchiveRooms();
    return;
  }

  // Recovered keys persist in localStorage; the visible object list stays vague
  // while the Restricted Wing still checks the complete internal key set.
  const previousKeys = getUnlockedElementalKeys();
  saveUnlockedElementalKeys([...previousKeys, matchedKeyId]);
  archiveCodeFeedback = archiveKeyFeedback[matchedKeyId]?.unlocked || "Something has surfaced.";

  if (
    previousKeys.length < elementalKeys.length &&
    areAllElementalKeysRecovered()
  ) {
    archiveCodeFeedback = "The fourth relic answers. Somewhere in the Archive, the Memory Vault unlocks.";
  }

  renderArchiveRooms();
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

////////////////////////////////////////////////////
// Chamber Entry and Hash Routing
////////////////////////////////////////////////////

// Enter actions keep the redesigned viewer intact while moving into the selected chamber's records.
function enterArchiveRoom(roomId) {
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

  if (window.location.hash) {
    window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
  }

  renderArchiveRooms();
  focusEnteredChamber(room);
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
  renderArchiveRooms();

  if (scroll) {
    archiveRoomHub.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Supports direct links such as archive.html#entry-desk while rejecting locked room hashes.
function syncRoomFromHash() {
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
  selectedArchiveRoomId = room.id;
  enteredArchiveRoomId = room.id;
  activeArchiveShelfEntryId = "";
  window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
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

renderArchiveRooms();
renderArchiveAccessState();
syncRoomFromHash();

// Delegated archive actions cover room entry, room back buttons, thumbnail selection, and chamber nav.
document.addEventListener("click", (event) => {
  const roomButton = event.target.closest("[data-room-id], [data-room-enter]");
  const backButton = event.target.closest("[data-room-back]");

  if (backButton) {
    returnToRoomHub();
    return;
  }

  if (roomButton) {
    enterArchiveRoom(roomButton.dataset.roomEnter || roomButton.dataset.roomId);
    return;
  }

  const journalButton = event.target.closest("[data-open-archive-journal]");
  const roomSelectionButton = event.target.closest("[data-select-room]");
  const chamberNavButton = event.target.closest("[data-chamber-nav]");
  const recoveredObjectButton = event.target.closest("[data-recovered-object]");
  const recoveredObjectCloseButton = event.target.closest(".archive-recovered-object-modal__close");
  const recoveredObjectOverlay = event.target.classList?.contains("archive-recovered-object-modal");
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
    renderArchiveRooms();
    return;
  }

  if (recoveredObjectButton) {
    openRecoveredObjectId = recoveredObjectButton.dataset.recoveredObject;
    renderArchiveRooms();
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
window.addEventListener("hashchange", syncRoomFromHash);
