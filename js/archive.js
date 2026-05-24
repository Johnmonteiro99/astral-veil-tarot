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
let activeArchiveShelfEntryId = "";
let archiveCodeFeedback = "";

const archiveKeyStorageKey = "astralVeilNoctisElementalKeys";
const correctArchiveCodes = {
  water: "WITHIN",
  air: "BREATHE"
};
const archiveKeyFeedback = {
  water: {
    unlocked: "The Water Key has surfaced.",
    alreadyUnlocked: "The Water Key has already surfaced."
  },
  air: {
    unlocked: "The Air Key has taken breath.",
    alreadyUnlocked: "The Air Key already breathes within the archive."
  }
};
const archiveCodeFailureMessages = [
  "The desk remains silent.",
  "The lock does not recognize that word.",
  "Nothing beneath the ink moves."
];

// Elemental key tracking stays internal for now. The Entry Desk only shows
// vague recovered objects so the larger lock structure is not explained early.
const elementalKeys = [
  {
    id: "water",
    name: "Water",
    title: "Water Key",
    description:
      "A dark glass key formed from reflection, memory, and surrender. It does not open what is ahead. It opens what has been waiting within."
  },
  {
    id: "air",
    name: "Air",
    title: "Air Key",
    description:
      "A pale key formed from breath, silence, and release. It does not open by force. It opens when what was held is finally allowed to move."
  },
  {
    id: "fire",
    name: "Fire",
    title: "Fire Key",
    description: ""
  },
  {
    id: "earth",
    name: "Earth",
    title: "Earth Key",
    description: ""
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

function getRoomDetails(room) {
  return archiveRoomDetails[room.id] || {
    tags: [room.status, room.type].filter(Boolean),
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

function isRoomLocked(room) {
  if (room?.id === "restricted-wing") {
    return !areAllElementalKeysRecovered();
  }

  return Boolean(room?.isLocked);
}

// The Restricted Wing remains sealed until all four elemental keys are recovered,
// but the visible copy keeps that requirement obscure.
function getRoomLockedMessage(room) {
  if (room?.id === "restricted-wing" && isRoomLocked(room)) {
    return "The lock recognizes only part of what is missing.";
  }

  return room?.lockedMessage || "Access withheld.";
}

function getLockedRoomActionLabel(room) {
  if (!isRoomLocked(room)) {
    return "Enter Chamber";
  }

  const lockText = `${room.id} ${room.status || ""} ${room.requirement || ""}`.toLowerCase();

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

  return `
    <article class="archive-room-card archive-room-card--featured${isLocked ? " is-locked" : " is-open"}" data-room-card="${escapeHtml(room.id)}">
      <button class="archive-room-card__button" type="button" data-room-enter="${escapeHtml(room.id)}" data-lock-label="${escapeHtml(actionLabel)}" aria-label="${escapeHtml(isLocked ? `${actionLabel}: ${room.title}` : `Enter ${room.title}`)}">
        <span class="archive-room-card__media">
          <img src="${escapeHtml(room.image)}" alt="${escapeHtml(getRoomImageAlt(room))}" loading="eager" decoding="async" onerror="this.closest('.archive-room-card__media').classList.add('is-missing'); this.remove();" />
          <span class="archive-room-card__fallback" aria-hidden="true">${escapeHtml(getRoomInitial(room))}</span>
        </span>
        <span class="archive-room-card__overlay">
          <span class="archive-room-card__status">${escapeHtml(room.status)}</span>
          <span class="archive-room-card__title">${escapeHtml(room.title)}</span>
          <span class="archive-room-card__description">${escapeHtml(room.description)}</span>
          ${
            room.requirement
              ? `<span class="archive-room-card__requirement">${escapeHtml(room.requirement)}</span>`
              : ""
          }
        </span>
      </button>
    </article>
  `;
}

function renderRoomTags(room) {
  return getRoomDetails(room).tags
    .slice(0, 5)
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join("");
}

function renderRoomInfoBox(label, value) {
  return `
    <section class="archive-chamber-info-card">
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(value)}</p>
    </section>
  `;
}

// Builds the compact rail thumbnails above the featured chamber viewer.
function renderRoomThumbnail(room, index, selectedRoomId) {
  const isSelected = room.id === selectedRoomId;
  const isLocked = isRoomLocked(room);

  return `
    <button class="archive-chamber-thumbnail${isSelected ? " is-active" : ""}${isLocked ? " is-locked" : ""}" type="button" data-select-room="${escapeHtml(room.id)}" aria-label="Select ${escapeHtml(room.title)}" aria-current="${isSelected ? "true" : "false"}">
      <img src="${escapeHtml(room.image)}" alt="${escapeHtml(getRoomImageAlt(room))}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'" />
      <span>${index + 1}</span>
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

  archiveRoomGrid.innerHTML = `
    <div class="archive-chamber-viewer" data-selected-room="${escapeHtml(selectedRoom.id)}">
      <div class="archive-chamber-thumbnail-rail" aria-label="Select a chamber">
        ${rooms.map((room, index) => renderRoomThumbnail(room, index, selectedRoom.id)).join("")}
      </div>

      <section class="archive-chamber-stage" aria-live="polite">
        ${renderFeaturedRoomImage(selectedRoom)}

        <div class="archive-chamber-content">
          <p class="archive-chamber-counter">${selectedIndex + 1} of ${rooms.length}</p>
          <h2>${escapeHtml(selectedRoom.title)}</h2>
          <p class="archive-chamber-description">${escapeHtml(selectedRoom.description)}</p>
          <ul class="archive-chamber-tags" aria-label="Chamber tags">
            ${renderRoomTags(selectedRoom)}
          </ul>
          <div class="archive-chamber-info-grid">
            ${renderRoomInfoBox("Status", selectedRoom.status)}
            ${renderRoomInfoBox("Contains", details.contains)}
            ${renderRoomInfoBox("Access Notes", selectedRoomLocked ? getRoomLockedMessage(selectedRoom) : details.accessNotes)}
            ${renderRoomInfoBox("Archive Hint", details.archiveHint)}
          </div>
          <div class="archive-chamber-actions">
            <div class="archive-chamber-nav" aria-label="Browse chambers">
              <button type="button" data-chamber-nav="previous">Previous</button>
              <button type="button" data-chamber-nav="next">Next</button>
            </div>
            <button class="archive-chamber-enter${selectedRoomLocked ? " is-locked" : ""}" type="button" data-room-enter="${escapeHtml(selectedRoom.id)}">
              ${escapeHtml(actionLabel)}
            </button>
          </div>
        </div>
      </section>
      ${renderSelectedChamberContent(selectedRoom)}
    </div>
  `;

  const thumbnailRail = archiveRoomGrid.querySelector(".archive-chamber-thumbnail-rail");
  const activeThumbnail = archiveRoomGrid.querySelector(".archive-chamber-thumbnail.is-active");

  if (thumbnailRail && activeThumbnail) {
    thumbnailRail.scrollLeft =
      activeThumbnail.offsetLeft - (thumbnailRail.clientWidth - activeThumbnail.clientWidth) / 2;
  }
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

// Entry Desk is the future catch-all for notes, clues, and recovered objects.
function renderEntryDeskRoom(room) {
  const deskStats = [
    ["Archive Notes", "Pending review"],
    ["Loose Files", "Indexed shell"],
    ["Clues", "Unsettled"]
  ];

  return `
    <div class="archive-room-panel archive-room-panel--desk">
      <div class="archive-desk-stats">
        ${deskStats.map(([label, value]) => `
          <section class="archive-room-stat">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </section>
        `).join("")}
      </div>
      ${renderRecoveredObjects()}
      ${renderArchiveCodePanel()}
    </div>
  `;
}

function getRecoveredObjects() {
  const unlockedKeys = getUnlockedElementalKeys();

  return elementalKeys.filter((key) => unlockedKeys.includes(key.id));
}

// The recovered-object display is intentionally vague: it reflects internal key
// progress without naming the full elemental set or the Restricted Wing rule.
function renderRecoveredObjects() {
  const recoveredObjects = getRecoveredObjects();

  return `
    <section class="archive-recovered-objects" aria-label="Recovered objects">
      <div>
        <h3>Recovered Objects</h3>
        <p>${recoveredObjects.length ? "Something from the archive has answered." : "No recovered objects yet."}</p>
      </div>
      ${recoveredObjects.length ? `
        <div class="archive-recovered-list">
          ${recoveredObjects.map((object) => `
            <article class="archive-recovered-object">
              <strong>${escapeHtml(object.title)}</strong>
              ${object.description ? `<p>${escapeHtml(object.description)}</p>` : ""}
            </article>
          `).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderArchiveCodePanel() {
  return `
    <form class="archive-code-panel" data-archive-code-form>
      <div>
        <h3>Recovered Code</h3>
        <p>Some locks answer only to words recovered elsewhere.</p>
      </div>
      <label class="archive-code-panel__field">
        <span>Archive Code</span>
        <input type="text" name="archive-code" autocomplete="off" spellcheck="false" />
      </label>
      <button type="submit">Whisper the Code</button>
      <p class="archive-code-panel__feedback" data-archive-code-feedback aria-live="polite">
        ${escapeHtml(archiveCodeFeedback)}
      </p>
    </form>
  `;
}

// Shelves prepares the manuscript/journal rail without loading future content yet.
function renderShelvesRoom(room) {
  return `
    <div class="archive-room-panel archive-room-panel--shelves">
      <div class="archive-room-placeholder">
        <p class="archive-entry__stamp">Shelf Viewer</p>
        <h3>Recovered Writings</h3>
        <p>Journals, manuscripts, letters, and unstable texts gather here as they are recovered.</p>
      </div>
      <div class="archive-shelf-entry-list" aria-label="Recovered shelf entries">
        ${archiveShelfEntries.map((entry) => `
          <article class="archive-shelf-entry-card">
            <span>${escapeHtml(entry.label)}</span>
            <h3>${escapeHtml(entry.title)}</h3>
            <p>${escapeHtml(entry.author)}</p>
            <button type="button" data-open-archive-journal="${escapeHtml(entry.id)}">Read Fragment</button>
          </article>
        `).join("")}
      </div>
      <div class="archive-room-rail" aria-label="Future shelf items">
        ${["Manuscripts", "Letters", "Unstable Texts"].map((label) => `
          <span class="archive-room-rail__slot">${escapeHtml(label)}</span>
        `).join("")}
      </div>
    </div>
  `;
}

// Gallery prepares a future visual-record viewer while keeping current images lightweight.
function renderGalleryRoom(room) {
  return `
    <div class="archive-room-panel archive-room-panel--gallery">
      <figure class="archive-room-featured-image">
        <span aria-hidden="true"></span>
        <figcaption>
          <strong>Visual Record Viewer</strong>
          <em>Recovered images and symbols will settle here.</em>
        </figcaption>
      </figure>
      <div class="archive-room-rail" aria-label="Future visual records">
        ${["Recovered Images", "Locked Frames", "Future Thumbnail Rail"].map((label) => `
          <span class="archive-room-rail__slot">${escapeHtml(label)}</span>
        `).join("")}
      </div>
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

  return "";
}

function renderSelectedChamberContent(room) {
  if (isRoomLocked(room)) {
    return "";
  }

  const content = renderRoomContent(room);

  return content
    ? `<section class="archive-selected-chamber" aria-label="${escapeHtml(room.title)} contents">${content}</section>`
    : "";
}

// Code validation accepts recovered words case-insensitively and trims extra
// space before unlocking hidden recovery paths from Noctis records.
function handleArchiveCodeSubmit(form) {
  const formData = new FormData(form);
  const submittedCode = String(formData.get("archive-code") || "").trim().toUpperCase();
  const matchedKeyId = Object.keys(correctArchiveCodes).find(
    (keyId) => correctArchiveCodes[keyId] === submittedCode
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
  saveUnlockedElementalKeys([...getUnlockedElementalKeys(), matchedKeyId]);
  archiveCodeFeedback = archiveKeyFeedback[matchedKeyId]?.unlocked || "Something has surfaced.";
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

////////////////////////////////////////////////////
// Chamber Entry and Hash Routing
////////////////////////////////////////////////////

// Enter actions now keep the selected chamber unified inside the viewer; locked rooms only show their message.
function enterArchiveRoom(roomId) {
  const room = getRoomById(roomId);

  if (!room) {
    return;
  }

  selectedArchiveRoomId = room.id;
  activeArchiveShelfEntryId = "";

  if (isRoomLocked(room)) {
    showRoomToast(getRoomLockedMessage(room));
    return;
  }

  if (window.location.hash) {
    window.history.replaceState({ archiveRoom: "" }, "", window.location.pathname + window.location.search);
  }

  renderArchiveRooms();
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

  if (journalButton) {
    openArchiveShelfEntry(journalButton.dataset.openArchiveJournal, journalButton);
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
