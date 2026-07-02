const CARD_BACK_IMAGE = "assets/images/cards/original/card-back.webp";
const BLOOD_MOON_CARD_BACK_IMAGE = "assets/images/cards/blood-moon/bloodmoon-card-back.webp";
const CARD_IMAGE_WIDTH = 800;
const CARD_IMAGE_HEIGHT = 1200;
const READER_IMAGE_WIDTH = 900;
const READER_IMAGE_HEIGHT = 1200;

const readerList = document.querySelector("[data-reader-list]");
const readerSelection = document.querySelector("#reader-selection");
const readerSelectionConfirmation = document.querySelector("[data-reader-selection-confirmation]");
const readingStage = document.querySelector("[data-reading-stage]");
const readingHeroEyebrow = document.querySelector("[data-reading-hero-eyebrow]");
const readingHeroTitle = document.querySelector("[data-reading-hero-title]");
const readingHeroCopy = document.querySelector("[data-reading-hero-copy]");
const activeReaderImage = document.querySelector("[data-active-reader-image]");
const activeReaderName = document.querySelector("[data-active-reader-name]");
const activeReaderRole = document.querySelector("[data-active-reader-role]");
const activeReaderQuote = document.querySelector("[data-active-reader-quote]");
const readerIntroduction = document.querySelector("[data-reader-introduction]");
const activeReaderHeader = document.querySelector(".active-reader-header");
const readingStageTitle = document.querySelector("[data-reading-stage-title]");
const readingStageSubtitle = document.querySelector("[data-reading-stage-subtitle]");
const readerPortraitFrame = document.querySelector(".reader-portrait-frame");
const spreadButtons = document.querySelectorAll("[data-spread]");
const readerNavButtons = document.querySelectorAll("[data-reader-nav]");
const readerPanelDots = document.querySelectorAll("[data-reader-panel-dot]");
const newReadingButton = document.querySelector("[data-new-reading]");
const cardList = document.getElementById("deck-area");
const readingSpreadPanel = document.querySelector(".spread-selection-panel");
const readingThreadSection = document.querySelector("[data-reading-thread-section]");
const readingStatus = document.querySelector("[data-reading-status]");
const deckStatus = document.querySelector("[data-deck-status]");
const deckOptions = document.querySelector("[data-deck-options]");
const readingResultsSection = document.querySelector("[data-reading-results-section]");
const readingReveals = document.querySelector("[data-reading-reveals]");
const cardEnergyTypes = [
  "positive",
  "mysterious",
  "challenging",
  "transformative",
  "balanced",
  "neutral",
];
const zodiacIconPaths = {
  Aries: "assets/icons/zodiac/aries.svg",
  Taurus: "assets/icons/zodiac/taurus.svg",
  Gemini: "assets/icons/zodiac/gemini.svg",
  Cancer: "assets/icons/zodiac/cancer.svg",
  Leo: "assets/icons/zodiac/leo.svg",
  Virgo: "assets/icons/zodiac/virgo.svg",
  Libra: "assets/icons/zodiac/libra.svg",
  Scorpio: "assets/icons/zodiac/scorpio.svg",
  Sagittarius: "assets/icons/zodiac/sagittarius.svg",
  Capricorn: "assets/icons/zodiac/capricorn.svg",
  Aquarius: "assets/icons/zodiac/aquarius.svg",
  Pisces: "assets/icons/zodiac/pisces.svg",
};
const readingSectionScrollDelay = 450;
const forcedFateReaderStorageKey = "astralVeilTestFateReader";
const selectedReaderStorageKey = "astralVeilSelectedReader";
// 22.2% chance for Blood Moon activation through Let Fate Choose.
const BLOOD_MOON_FATE_CHANCE = 0.222;
const BLOOD_MOON_TRANSITION_COPY = {
  summon: [
    "The stars go quiet.",
    "The Veil opens.",
    "The red moon answers.",
    "Blood Moon has begun."
  ],
  fate: [
    "The stars go quiet.",
    "The Veil opens.",
    "The red moon answers.",
    "Blood Moon has begun."
  ]
};
const fireKeyAnchorCardId = "death";
const fireKeyMajorArcanaIds = new Set([
  "the-sun",
  "strength",
  "the-tower",
  "the-emperor",
  "the-chariot",
  "the-magician"
]);
const fireKeyCardNameToId = {
  "the sun": "the-sun",
  strength: "strength",
  "the tower": "the-tower",
  "the emperor": "the-emperor",
  "the chariot": "the-chariot",
  "the magician": "the-magician",
  death: "death"
};

// Reading state is kept in memory so a generated spread does not reshuffle or reroll orientation while browsing.
let selectedReader = null;
let selectedReaderIndex = -1;
let featuredReaderIndex = 0;
let readerSelectionPreview = { readerId: null, modeKey: null, message: "" };
let readerSelectionMessageCursor = {};
let zephyraSummonRoll = { readerId: null, modeKey: null, isSummon: false };
let isBloodMoonTransitionRunning = false;
let activeBloodMoonQuote = { readerId: null, quote: "" };
let activeReaderIntroLine = { key: null, line: "" };
let activeReaderIntroRequestId = 0;
let readerCarouselTouchStartX = 0;
let readerCarouselTouchStartY = 0;
let lastReaderCarouselWheelAt = 0;
let readingDeckTouchStartX = null;
let readingDeckTouchStartY = null;
let readingDeckDidSwipe = false;
let selectedCardCount = 0;
let currentReadingCards = [];
let revealedCards = [];
let activeRevealedCardIndex = -1;
let readingSectionScrollTimeout = null;
let isRenderingReading = false;
let bloodMoonTimeout = null;
let readingFlowStage = "reader";
let activeReadingMode = null;
let selectedDeckId = "lumen";
let activeReadingDeckCarouselId = selectedDeckId;
let currentAccountUser = null;
let hasCheckedAccountUser = false;
let readingPreferences = {
  allow_reversed_cards: false,
  save_readings_prompt: true,
  reduce_motion: false,
  default_reading_mode: "last_used"
};
let readingPreferencesReadyPromise = null;

const readingDecks = [
  {
    id: "lumen",
    title: "Verdant",
    label: "Core Collection",
    description: "Original lightwork art and meanings.",
    access: "public",
    compatibleModes: ["sun", "moon"],
    meaningSet: "lumen",
    imageSet: "lumen",
    previewImage: "assets/images/cards/original/card-back.webp",
    cards: () => tarotDeck
  },
  {
    id: "dreambound",
    title: "Dreambound",
    label: "Public Deck",
    description: "Dreamlike art with original meanings.",
    access: "public",
    compatibleModes: ["sun", "moon", "bloodMoon"],
    meaningSet: "lumen",
    imageSet: "dreambound",
    previewImage: "assets/images/cards/dreamy/dreams_card_back.png",
    cards: () => dreamboundDeck.cards
  },
  {
    id: "moonveil",
    title: "Moonveil",
    label: "Account Deck",
    description: "Moonlit art with original meanings.",
    access: "auth",
    compatibleModes: ["sun", "moon", "bloodMoon"],
    meaningSet: "lumen",
    imageSet: "moonveil",
    previewImage: "assets/images/cards/moonveil/moonveil_card_back.png",
    cards: () => moonveilDeck.cards
  },
  {
    id: "bloodMoon",
    title: "Crimson Veil",
    label: "Blood Moon Deck",
    description: "A forbidden shadow deck revealed beneath the Blood Moon.",
    access: "bloodMoon",
    compatibleModes: ["bloodMoon"],
    meaningSet: "bloodMoon",
    imageSet: "bloodMoon",
    previewImage: "assets/images/cards/blood-moon/bloodmoon-card-back.webp",
    cards: () => bloodMoonDeck.cards
  }
];

function setReadingFlowStage(stage, { scrollToStart = false } = {}) {
  readingFlowStage = stage;

  const isReaderStage = stage === "reader";
  const isSetupStage = stage === "setup";
  const isReadingStage = stage === "reading";

  if (isSetupStage || isReadingStage) {
    activeReadingMode = getCurrentModeKey();
  } else {
    activeReadingMode = null;
  }

  if (readerSelection) {
    readerSelection.classList.toggle("is-minimized", !isReaderStage);
  }

  document.body.classList.toggle("is-reading-stage-active", !isReaderStage);
  document.body.classList.toggle("is-active-reading-results", isReadingStage);

  if (readingStage) {
    readingStage.classList.toggle("hidden", !isSetupStage);
  }

  if (readingSpreadPanel) {
    readingSpreadPanel.classList.toggle("hidden", !isSetupStage);
  }

  if (readingResultsSection) {
    readingResultsSection.classList.toggle("hidden", !isReadingStage);
  }

  if (isSetupStage) {
    ensureSelectedDeckIsAvailable();
    renderDeckOptions();
    readingStatus.textContent = "Choose a deck and spread to shuffle your cards.";
  }

  if (scrollToStart) {
    const startSection = isReaderStage
      ? readerSelection
      : isSetupStage
        ? readingStage
        : readingResultsSection;

    startSection?.scrollIntoView({
      behavior: getReadingScrollBehavior(),
      block: "start",
    });
  }
}

function getReadingScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.reduceMotion === "true" ||
    document.body.classList.contains("reduce-motion")
    ? "auto"
    : "smooth";
}

////////////////////////////////////////////////////
// Blood Moon Reading Bridge
////////////////////////////////////////////////////

// The reading page delegates event state to app.js when available, with class-based fallbacks for safety.
function activateBloodMoonEvent() {
  if (window.AstralVeilBloodMoon) {
    if (typeof window.AstralVeilBloodMoon.activateBloodMoon === "function") {
      window.AstralVeilBloodMoon.activateBloodMoon("zephyra-selection");
      return;
    }

    window.AstralVeilBloodMoon.activateBloodMoonEvent();
  } else {
    document.body.classList.add("blood-moon-mode");
  }
}

function deactivateBloodMoonEvent() {
  if (window.AstralVeilBloodMoon) {
    window.AstralVeilBloodMoon.deactivateBloodMoonEvent();
  } else {
    document.body.classList.remove("blood-moon-mode");
  }
}

function isBloodMoonActive() {
  if (window.AstralVeilBloodMoon) {
    return window.AstralVeilBloodMoon.isBloodMoonActive();
  }

  return document.body.classList.contains("blood-moon-mode");
}

function isZephyraReader(reader) {
  return reader?.id === "zephyra-noctis";
}

function isReadingReduceMotionEnabled() {
  return readingPreferences.reduce_motion ||
    document.documentElement.dataset.reduceMotion === "true" ||
    document.body.classList.contains("reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isSmallViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function updateReaderPanelDots(activePanelIndex = 0) {
  readerPanelDots.forEach((dot) => {
    const isActive = Number(dot.dataset.readerPanelDot || 0) === activePanelIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
}

function getActiveReaderPanelIndex() {
  if (!activeReaderHeader) {
    return 0;
  }

  return activeReaderHeader.scrollLeft >= activeReaderHeader.clientWidth / 2 ? 1 : 0;
}

function scrollActiveReaderPanel(panelIndex, { behavior = getReadingScrollBehavior() } = {}) {
  if (!activeReaderHeader) {
    return;
  }

  activeReaderHeader.scrollTo({
    left: activeReaderHeader.clientWidth * panelIndex,
    behavior,
  });
  updateReaderPanelDots(panelIndex);
}

function shouldTriggerBloodMoon() {
  return Math.random() < BLOOD_MOON_FATE_CHANCE;
}

function getSelectionModeKey() {
  return isBloodMoonActive() ? "bloodMoon" : getCurrentModeKey();
}

function resetZephyraSummonRoll() {
  zephyraSummonRoll = { readerId: null, modeKey: null, isSummon: false };
}

function rollZephyraSummonState(reader, { force = false } = {}) {
  if (!isZephyraReader(reader) || isBloodMoonActive()) {
    resetZephyraSummonRoll();
    return false;
  }

  const modeKey = getSelectionModeKey();

  if (
    force ||
    zephyraSummonRoll.readerId !== reader.id ||
    zephyraSummonRoll.modeKey !== modeKey
  ) {
    zephyraSummonRoll = {
      readerId: reader.id,
      modeKey,
      isSummon: shouldTriggerBloodMoon()
    };
  }

  return zephyraSummonRoll.isSummon;
}

function isZephyraSummonActive(reader) {
  return isZephyraReader(reader) &&
    !isBloodMoonActive() &&
    zephyraSummonRoll.readerId === reader.id &&
    zephyraSummonRoll.modeKey === getSelectionModeKey() &&
    zephyraSummonRoll.isSummon;
}

function waitForBloodMoonTransition(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function createBloodMoonTransitionOverlay(type, { reduceMotion = false } = {}) {
  const overlay = document.createElement("div");
  const lines = BLOOD_MOON_TRANSITION_COPY[type] || BLOOD_MOON_TRANSITION_COPY.fate;
  const lineDelayStart = reduceMotion ? 0 : 1100;
  const lineDelayStep = reduceMotion ? 0 : 650;

  overlay.className = "bloodmoon-transition";
  overlay.dataset.transitionType = type;
  overlay.dataset.reduceMotion = reduceMotion ? "true" : "false";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "assertive");
  overlay.setAttribute("aria-atomic", "true");
  overlay.innerHTML = `
    <div class="bloodmoon-transition__colorwash" aria-hidden="true"></div>
    <div class="bloodmoon-transition__content">
      <div class="bloodmoon-transition__lines">
        ${lines
          .map((line, index) => `
            <p class="bloodmoon-transition__line" style="--line-delay: ${lineDelayStart + index * lineDelayStep}ms;">
              ${escapeHtml(line)}
            </p>
          `)
          .join("")}
      </div>
    </div>
  `;

  return overlay;
}

async function runBloodMoonTransition({ type = "fate", onActivate, onComplete } = {}) {
  if (isBloodMoonTransitionRunning) {
    return false;
  }

  isBloodMoonTransitionRunning = true;
  const reduceMotion = isReadingReduceMotionEnabled();
  const overlay = createBloodMoonTransitionOverlay(type, { reduceMotion });
  const activateDelay = reduceMotion ? 700 : 2100;
  const totalDuration = reduceMotion ? 1500 : 3000;

  document.body.append(overlay);
  document.body.classList.add("bloodmoon-transition-lock");

  try {
    window.requestAnimationFrame(() => {
      overlay.classList.add("is-active");
    });

    await waitForBloodMoonTransition(activateDelay);

    if (typeof onActivate === "function") {
      onActivate();
    }

    await waitForBloodMoonTransition(Math.max(totalDuration - activateDelay, 0));

    if (typeof onComplete === "function") {
      onComplete();
    }

    overlay.classList.add("is-complete");
    await waitForBloodMoonTransition(reduceMotion ? 220 : 420);
    return true;
  } finally {
    overlay.remove();
    document.body.classList.remove("bloodmoon-transition-lock");
    isBloodMoonTransitionRunning = false;
  }
}

function applyBloodMoonState() {
  if (window.AstralVeilBloodMoon) {
    window.AstralVeilBloodMoon.applyBloodMoonState();
  }
}

function isBloodMoonReadingActive() {
  return isBloodMoonActive();
}

function normalizeReadingPreferences(preferences = {}) {
  const defaultReadingMode = String(preferences.default_reading_mode || "").trim().toLowerCase();

  return {
    allow_reversed_cards: preferences.allow_reversed_cards === true,
    save_readings_prompt: preferences.save_readings_prompt !== false,
    reduce_motion: preferences.reduce_motion === true,
    default_reading_mode: ["sun", "moon", "last_used"].includes(defaultReadingMode)
      ? defaultReadingMode
      : "last_used"
  };
}

function applyReadingPreferences(preferences = {}) {
  readingPreferences = normalizeReadingPreferences(preferences);
  document.body.classList.toggle("reduce-motion", readingPreferences.reduce_motion);
  document.documentElement.dataset.reduceMotion = readingPreferences.reduce_motion ? "true" : "false";
}

function applyDefaultReadingModePreference() {
  const preferredMode = readingPreferences.default_reading_mode;

  if (!["sun", "moon"].includes(preferredMode) || isBloodMoonReadingActive()) {
    return;
  }

  if (readingFlowStage !== "reader" && readingFlowStage !== "setup") {
    return;
  }

  try {
    localStorage.setItem("dailyTarotTheme", preferredMode);
  } catch {
    // Theme persistence is best-effort; the body class still applies for this session.
  }

  if (typeof setTheme === "function") {
    setTheme(preferredMode);
    return;
  }

  document.body.classList.toggle("sun-mode", preferredMode === "sun");
  document.body.classList.toggle("moon-mode", preferredMode === "moon");
  document.body.classList.remove("blood-moon-mode");
}

function initializeReadingPreferences() {
  const preferencesModuleUrl = new URL("src/public/user-preferences.js", document.baseURI).href;

  readingPreferencesReadyPromise = import(preferencesModuleUrl)
    .then((module) => module.loadCurrentUserPreferences())
    .then((preferences) => {
      applyReadingPreferences(preferences);
      applyDefaultReadingModePreference();
      ensureSelectedDeckIsAvailable();
      renderDeckOptions();
      updateReadingHeroCopy();
      if (selectedReader) {
        updateActiveReader();
      } else {
        renderReaders();
      }
      return readingPreferences;
    })
    .catch((error) => {
      console.warn("[Astral Veil reading] User preferences could not be loaded.", error);
      applyReadingPreferences(readingPreferences);
      return readingPreferences;
    });

  return readingPreferencesReadyPromise;
}

function getDeckModeKey() {
  return isBloodMoonReadingActive() ? "bloodMoon" : getCurrentModeKey();
}

function getDeckConfig(deckId) {
  return readingDecks.find((deck) => deck.id === deckId) || null;
}

function isDeckCompatible(deck, modeKey = getDeckModeKey()) {
  return Boolean(deck?.compatibleModes?.includes(modeKey));
}

function isDeckAccessible(deck) {
  if (!deck) {
    return false;
  }

  if (deck.access === "public") {
    return true;
  }

  if (deck.access === "auth") {
    return Boolean(currentAccountUser);
  }

  if (deck.access === "bloodMoon") {
    return isBloodMoonReadingActive();
  }

  return false;
}

function getAvailableReadingDecks() {
  const modeKey = getDeckModeKey();
  const availableDecks = readingDecks.filter((deck) => isDeckCompatible(deck, modeKey));

  if (modeKey === "bloodMoon") {
    const bloodMoonDeckOrder = ["bloodMoon", "dreambound", "moonveil"];

    return [...availableDecks].sort(
      (firstDeck, secondDeck) => bloodMoonDeckOrder.indexOf(firstDeck.id) - bloodMoonDeckOrder.indexOf(secondDeck.id)
    );
  }

  return availableDecks;
}

function getSelectableReadingDecks() {
  return getAvailableReadingDecks().filter(isDeckAccessible);
}

function getDefaultAvailableDeckId() {
  if (isBloodMoonReadingActive()) {
    const bloodMoonDeck = getDeckConfig("bloodMoon");

    if (isDeckCompatible(bloodMoonDeck) && isDeckAccessible(bloodMoonDeck)) {
      return bloodMoonDeck.id;
    }
  }

  return getSelectableReadingDecks()[0]?.id || getAvailableReadingDecks()[0]?.id || "lumen";
}

function ensureSelectedDeckIsAvailable() {
  const selectedDeck = getDeckConfig(selectedDeckId);

  if (isDeckCompatible(selectedDeck) && isDeckAccessible(selectedDeck)) {
    if (!isDeckCompatible(getDeckConfig(activeReadingDeckCarouselId))) {
      activeReadingDeckCarouselId = selectedDeck.id;
    }

    return selectedDeck;
  }

  selectedDeckId = getDefaultAvailableDeckId();
  activeReadingDeckCarouselId = selectedDeckId;
  return getDeckConfig(selectedDeckId);
}

function getActiveDeckConfig() {
  return ensureSelectedDeckIsAvailable();
}

function getDeckLockedReason(deck) {
  if (!isDeckCompatible(deck)) {
    return "Unavailable in this mode";
  }

  if (deck.access === "auth" && !currentAccountUser) {
    return "Sign in to unlock";
  }

  if (deck.access === "bloodMoon" && !isBloodMoonReadingActive()) {
    return "Blood Moon only";
  }

  return "";
}

function getReadingDeckCtaLabel(deck, isSelected, isAccessible) {
  if (isSelected) {
    return "Selected";
  }

  if (isAccessible) {
    return "Select Deck";
  }

  if (deck?.access === "auth" && !currentAccountUser) {
    return "Create Account";
  }

  if (deck?.access === "bloodMoon" && !isBloodMoonReadingActive()) {
    return "Blood Moon Only";
  }

  return "Locked";
}

function getReadingAuthUrl(mode = "signup") {
  return mode === "signup" ? "/signup" : "/login";
}

function getReadingDeckCarouselOffset(index, activeIndex, itemCount) {
  let offset = index - activeIndex;

  if (offset > itemCount / 2) {
    offset -= itemCount;
  } else if (offset < -itemCount / 2) {
    offset += itemCount;
  }

  return offset;
}

function getVisibleReadingDeckOffset(offset) {
  return Math.max(-3, Math.min(3, offset));
}

function getReadingDeckOffsetClass(offset) {
  return `deck-selection-card--offset-${offset < 0 ? `neg-${Math.abs(offset)}` : offset}`;
}

function getActiveReadingDeckCarouselIndex(modeDecks) {
  const activeIndex = modeDecks.findIndex((deck) => deck.id === activeReadingDeckCarouselId);

  if (activeIndex >= 0) {
    return activeIndex;
  }

  const selectedIndex = modeDecks.findIndex((deck) => deck.id === selectedDeckId);
  activeReadingDeckCarouselId = modeDecks[selectedIndex >= 0 ? selectedIndex : 0]?.id || selectedDeckId;

  return Math.max(0, selectedIndex);
}

function updateReadingDeckCarouselPosition(nextDeckId) {
  const modeDecks = getAvailableReadingDecks();
  const nextIndex = modeDecks.findIndex((deck) => deck.id === nextDeckId);

  if (!deckOptions || nextIndex < 0) {
    return false;
  }

  activeReadingDeckCarouselId = nextDeckId;

  deckOptions.querySelectorAll("[data-reading-deck-card]").forEach((card) => {
    const index = Number(card.dataset.deckIndex || 0);
    const deck = modeDecks[index];
    const isActive = deck?.id === nextDeckId;
    const offset = getReadingDeckCarouselOffset(index, nextIndex, modeDecks.length);
    const visibleOffset = getVisibleReadingDeckOffset(offset);

    Array.from(card.classList)
      .filter((className) => className.startsWith("deck-selection-card--offset-"))
      .forEach((className) => card.classList.remove(className));

    card.classList.add(getReadingDeckOffsetClass(visibleOffset));
    card.classList.toggle("is-carousel-active", isActive);
    card.dataset.deckOffset = String(offset);
  });

  return true;
}

function moveReadingDeckCarousel(direction) {
  const modeDecks = getAvailableReadingDecks();

  if (modeDecks.length < 2) {
    return;
  }

  const activeIndex = getActiveReadingDeckCarouselIndex(modeDecks);
  const nextIndex = (activeIndex + direction + modeDecks.length) % modeDecks.length;

  updateReadingDeckCarouselPosition(modeDecks[nextIndex].id);
}

function renderDeckOptions() {
  if (!deckOptions) {
    return;
  }

  const modeDecks = getAvailableReadingDecks();
  const activeCarouselIndex = getActiveReadingDeckCarouselIndex(modeDecks);

  deckOptions.dataset.deckCount = String(modeDecks.length);

  deckOptions.innerHTML = modeDecks
    .map((deck, index) => {
      const isSelected = deck.id === selectedDeckId;
      const isAccessible = isDeckAccessible(deck);
      const lockedReason = getDeckLockedReason(deck);
      const themeClass = deck.imageSet || deck.id;
      const offset = getReadingDeckCarouselOffset(index, activeCarouselIndex, modeDecks.length);
      const visibleOffset = getVisibleReadingDeckOffset(offset);
      const isCarouselActive = index === activeCarouselIndex;
      const isProtectedDeckMedia = deck.id === "bloodMoon" || deck.imageSet === "bloodMoon";
      const protectedMediaClass = isProtectedDeckMedia ? " protected-media" : "";
      const protectedMediaAttrs = isProtectedDeckMedia ? ' data-protected-media="true" draggable="false"' : "";
      const protectedImageAttr = isProtectedDeckMedia ? ' draggable="false"' : "";
      const ctaLabel = getReadingDeckCtaLabel(deck, isSelected, isAccessible);
      const actionMarkup = !isAccessible && deck.access === "auth"
        ? `<a class="primary-action deck-selection-card__button" href="${escapeHtml(getReadingAuthUrl("signup"))}" data-deck-auth-link="${escapeHtml(deck.id)}">${escapeHtml(ctaLabel)}</a>`
        : `<button class="primary-action deck-selection-card__button" type="button" data-deck-id="${escapeHtml(deck.id)}" ${isAccessible ? "" : "disabled"}>
                ${escapeHtml(ctaLabel)}
              </button>`;

      return `
        <article
          class="deck-selection-card deck-selection-card--${escapeHtml(themeClass)} ${getReadingDeckOffsetClass(visibleOffset)}${isSelected ? " is-selected" : ""}${isCarouselActive ? " is-carousel-active" : ""}${isAccessible ? "" : " is-locked"}"
          role="listitem"
          data-reading-deck-card
          data-deck-card-id="${escapeHtml(deck.id)}"
          data-deck-index="${index}"
          data-deck-offset="${offset}"
          aria-current="${isSelected ? "true" : "false"}"
          aria-disabled="${isAccessible ? "false" : "true"}"
        >
          <div class="deck-selection-card__surface">
            <div class="deck-selection-card__topline">
              <span class="deck-selection-card__badge">${escapeHtml(isAccessible ? deck.label : lockedReason)}</span>
            </div>
            <div class="deck-selection-card__preview${protectedMediaClass}"${protectedMediaAttrs}>
              <img src="${escapeHtml(deck.previewImage)}" alt="" width="${CARD_IMAGE_WIDTH}" height="${CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async"${protectedImageAttr} onerror="this.style.visibility='hidden'" />
            </div>
            <div class="deck-selection-card__content">
              <h3>${escapeHtml(deck.title)}</h3>
              <p>${escapeHtml(deck.description)}</p>
            </div>
            <div class="deck-selection-card__actions">
              ${actionMarkup}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (deckStatus) {
    const activeDeck = getActiveDeckConfig();
    deckStatus.textContent = activeDeck
      ? `${activeDeck.title} selected.`
      : "Choose an available deck before selecting a spread.";
  }
}

async function hydrateAccountDeckAccess() {
  if (hasCheckedAccountUser) {
    return;
  }

  hasCheckedAccountUser = true;

  try {
    const { getCurrentUser } = await import("../src/services/auth.js");
    const { user } = await getCurrentUser();

    currentAccountUser = user || null;
  } catch (error) {
    currentAccountUser = null;
  }

  ensureSelectedDeckIsAvailable();
  renderDeckOptions();
}

function getActiveDeck() {
  const activeDeck = getActiveDeckConfig();
  const cards = activeDeck?.cards?.();

  return Array.isArray(cards) && cards.length ? cards : tarotDeck;
}

function getActiveCardBackImage() {
  const activeDeck = getActiveDeckConfig();

  return activeDeck?.previewImage || (isBloodMoonReadingActive() ? BLOOD_MOON_CARD_BACK_IMAGE : CARD_BACK_IMAGE);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRandomArrayItem(items) {
  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return items[Math.floor(Math.random() * items.length)];
}

function normalizeFireKeyCardName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\breversed\b/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFireKeyCardId(card) {
  const stableId = normalizeFireKeyCardName(card?.originalCardId || card?.id || "").replace(/^blood-moon-/, "");

  if (stableId === fireKeyAnchorCardId || fireKeyMajorArcanaIds.has(stableId)) {
    return stableId;
  }

  const normalizedName = normalizeFireKeyCardName(card?.name || card?.title || getCardDisplayName(card));

  return fireKeyCardNameToId[normalizedName] || "";
}

function hasFireKeyPattern(cards) {
  if (!Array.isArray(cards) || !cards.length) {
    return false;
  }

  const cardIds = cards.map(getFireKeyCardId).filter(Boolean);
  const hasDeath = cardIds.includes(fireKeyAnchorCardId);
  const fireCardCount = cardIds.filter((cardId) => fireKeyMajorArcanaIds.has(cardId)).length;

  return hasDeath && fireCardCount >= 2;
}

function renderFireKeyCluePanel() {
  if (!areAllReadingCardsRevealed() || !hasFireKeyPattern(revealedCards)) {
    return "";
  }

  const isBloodMoonStyled = isBloodMoonReadingActive() || document.body.classList.contains("blood-moon-mode");

  return `
    <aside class="fire-key-clue${isBloodMoonStyled ? " fire-key-clue--blood-moon" : ""}" aria-label="Fire Key clue">
      <p class="fire-key-clue__label">Elemental Trace Detected</p>
      <h3>The Fire Key Stirs</h3>
      <div class="fire-key-clue__copy">
        <p>The thread between these cards begins to smoke.</p>
        <p>Death has opened the old door.<br />The flame has answered from beneath the ash.</p>
        <p>Fire is not only what destroys.<br />It is what remains brave enough to become again.</p>
        <p>When the flame asks what comes after burning,<br />speak:</p>
      </div>
      <p class="fire-key-clue__word">REBORN</p>
      <p class="fire-key-clue__note">Enter the word in Recovered Code.</p>
    </aside>
  `;
}

////////////////////////////////////////////////////
// Reading Card Meaning and Orientation Helpers
////////////////////////////////////////////////////

// Updates the top reading copy so Blood Moon readings announce their distinct tone.
function updateReadingHeroCopy() {
  if (!readingHeroEyebrow || !readingHeroTitle || !readingHeroCopy) {
    return;
  }

  readingHeroEyebrow.innerHTML = `<span aria-hidden="true">✦</span> Choose Your Reader <span aria-hidden="true">✦</span>`;
  readingHeroTitle.textContent = "Meet the Veilwalkers";
  readingHeroCopy.textContent =
    "Each Veilwalker reads through a different zodiac current. Choose the energy closest to your question.";
}

function isBloodMoonCard(card) {
  return Boolean(card?.isBloodMoonCard);
}

function isCardReversed(card) {
  return typeof getCardOrientation === "function"
    ? getCardOrientation(card) === "reversed"
    : card?.orientation === "reversed" || card?.isReversed;
}

// Adds "Reversed" to titles only in contexts where the orientation should be explicit.
function getCardDisplayName(card, { includeOrientation = false } = {}) {
  const orientationName = typeof getCardOrientationName === "function"
    ? getCardOrientationName(card)
    : isCardReversed(card) ? "Reversed" : "Upright";

  return includeOrientation && orientationName === "Reversed"
    ? `${card.name} Reversed`
    : card.name;
}

// Orientation is assigned exactly once when cards are drawn, then stored on the reading card object.
function prepareReadingCard(card) {
  const orientation = readingPreferences.allow_reversed_cards && Math.random() < 0.5
    ? "reversed"
    : "upright";

  return {
    ...card,
    orientation,
    isReversed: orientation === "reversed"
  };
}

function getCardOrientationLabel(card) {
  return typeof getCardOrientationName === "function"
    ? getCardOrientationName(card)
    : isCardReversed(card) ? "Reversed" : "Upright";
}

// Pulls the current spread metadata so position labels stay data-driven.
function getActiveSpread() {
  return typeof getSpreadByCount === "function" ? getSpreadByCount(selectedCardCount) : null;
}

function getActiveSpreadKey() {
  if (typeof spreads !== "object" || !spreads) {
    return selectedCardCount ? `${selectedCardCount}_card` : "";
  }

  const spreadEntry = Object.entries(spreads)
    .find(([, spread]) => spread?.count === Number(selectedCardCount));

  return spreadEntry?.[0] || `${selectedCardCount}_card`;
}

function getCardPositionLabel(card, index) {
  const spread = getActiveSpread();

  return spread?.positions?.[card.position - 1] || spread?.positions?.[index] || `Card ${card.position}`;
}

// Shared keyword-pill renderer used by upright and Blood Moon card readings.
function renderKeywordBadges(keywords) {
  if (!Array.isArray(keywords) || !keywords.length) {
    return "";
  }

  return `
    <ul class="reading-viewer__keywords" aria-label="Card keywords">
      ${keywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join("")}
    </ul>
  `;
}

// Renders the softer Original Deck interpretation for the selected card and orientation.
function renderOriginalCardMeaning(card) {
  const orientationMeaning = typeof getCardReadingMeaning === "function"
    ? getCardReadingMeaning(card)
    : null;
  const isReversed = isCardReversed(card);
  const leadingLabel = isReversed ? "Reversed" : "Upright";
  const leadingText = isReversed
    ? orientationMeaning?.shadow || card.reversed?.shadow || card.shadowMeaning
    : card.uprightMeaning;

  return `
    ${renderKeywordBadges(card.keywords)}
    <p class="reading-viewer__meaning reading-viewer__meaning--short">${escapeHtml(orientationMeaning?.summary || card.shortMeaning)}</p>
    <p class="reading-viewer__summary">${escapeHtml(orientationMeaning?.meaning || card.summary)}</p>
    <div class="reading-viewer__insight-grid">
      <section>
        <h4>${leadingLabel}</h4>
        <p>${escapeHtml(leadingText)}</p>
      </section>
      <section>
        <h4>Shadow</h4>
        <p>${escapeHtml(orientationMeaning?.shadow || card.shadowMeaning)}</p>
      </section>
    </div>
    <p class="reading-viewer__reflection">
      <span>Reflection</span>
      ${escapeHtml(orientationMeaning?.reflection || card.reflectionQuestion)}
    </p>
  `;
}

// Renders the sharper Blood Moon interpretation while preserving the same reading layout.
function renderBloodMoonCardMeaning(card) {
  const bloodMoon = card.bloodMoon || {};
  const orientationMeaning = typeof getCardReadingMeaning === "function"
    ? getCardReadingMeaning(card)
    : null;
  const exposureSections = [
    ["The Shadow", orientationMeaning?.shadow || bloodMoon.shadowMessage || card.shadowMeaning],
    ["The Mask", orientationMeaning?.mask],
    ["The Wound", orientationMeaning?.wound],
    ["The Work", orientationMeaning?.work]
  ];
  const veilHint = orientationMeaning?.veilHint || orientationMeaning?.reflection || bloodMoon.veilHint;

  return `
    ${renderKeywordBadges(card.keywords)}
    <p class="reading-viewer__meaning reading-viewer__meaning--short">${escapeHtml(orientationMeaning?.headline || orientationMeaning?.summary || bloodMoon.shortMeaning || card.shortMeaning)}</p>
    <p class="reading-viewer__summary">${escapeHtml(orientationMeaning?.meaning || bloodMoon.summary || card.summary)}</p>
    <div class="bloodmoon-exposure-grid" aria-label="Blood Moon shadow framework">
      ${exposureSections
        .filter(([, text]) => Boolean(text))
        .map(([label, text]) => `
          <section class="bloodmoon-exposure-card">
            <h4 class="bloodmoon-exposure-label">${escapeHtml(label)}</h4>
            <p class="bloodmoon-exposure-text">${escapeHtml(text)}</p>
          </section>
        `)
        .join("")}
    </div>
    ${
      veilHint
        ? `
          <p class="reading-viewer__reflection reading-viewer__reflection--blood-moon">
            <span>Veil Hint</span>
            ${escapeHtml(veilHint)}
          </p>
        `
        : ""
    }
  `;
}

function renderCardMeaningDetails(card) {
  return isBloodMoonCard(card)
    ? renderBloodMoonCardMeaning(card)
    : renderOriginalCardMeaning(card);
}

function getCombinedReadingIntro(summary, cards, spread) {
  const text = String(summary || "").trim();

  if (!text || !spread?.positions?.length) {
    return text;
  }

  const firstPositionIndex = spread.positions
    .slice(0, cards.length)
    .map((position) => text.indexOf(`${position}:`))
    .filter((index) => index >= 0)
    .sort((first, second) => first - second)[0];

  return firstPositionIndex > 0
    ? text.slice(0, firstPositionIndex).trim()
    : text;
}

function getThreadCardInterpretation(card) {
  const orientationMeaning = typeof getCardReadingMeaning === "function"
    ? getCardReadingMeaning(card)
    : null;

  if (orientationMeaning?.summary) {
    return orientationMeaning.summary;
  }

  if (orientationMeaning?.meaning) {
    return orientationMeaning.meaning;
  }

  return isBloodMoonCard(card) && card.bloodMoon?.shortMeaning
    ? card.bloodMoon.shortMeaning
    : card.shortMeaning || card.summary || "";
}

function renderThreadPositionBlocks(spread) {
  if (!spread?.positions?.length || revealedCards.length < 2) {
    return "";
  }
  const protectedMediaClass = isBloodMoonReadingActive() ? " protected-media" : "";
  const protectedMediaAttrs = isBloodMoonReadingActive() ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = isBloodMoonReadingActive() ? ' draggable="false"' : "";

  return `
    <div class="combined-reading__thread-grid">
      ${revealedCards.map((card, index) => {
        const positionLabel = getCardPositionLabel(card, index);
        const cardTitle = getCardDisplayName(card, { includeOrientation: true });
        const cardName = getCardDisplayName(card);
        const interpretation = getThreadCardInterpretation(card);
        const reversedClass = isCardReversed(card) ? " is-reversed" : "";

        return `
          <section class="combined-reading__thread-card">
            <div class="combined-reading__thread-card-image${protectedMediaClass}"${protectedMediaAttrs}>
              <img class="card-image${reversedClass}" src="${escapeHtml(card.image)}" alt="${escapeHtml(cardName)}" width="${CARD_IMAGE_WIDTH}" height="${CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async"${protectedImageAttr} onerror="this.src='${getActiveCardBackImage()}'" />
            </div>
            <div>
              <span class="combined-reading__position-pill">${escapeHtml(positionLabel)}</span>
              <h4>${escapeHtml(cardTitle)}</h4>
              <p>${escapeHtml(interpretation)}</p>
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderSharedThemesNote(advice) {
  if (typeof getSharedThemes !== "function" || /shared themes/i.test(advice || "")) {
    return "";
  }

  const sharedThemes = getSharedThemes(revealedCards);

  return sharedThemes.length
    ? `<p class="combined-reading__themes"><span>Shared Themes</span>${escapeHtml(sharedThemes.join(", "))}</p>`
    : "";
}

// Builds the "Thread Between the Cards" panel from the cards revealed so far.
function renderCombinedReading() {
  if (selectedCardCount < 2 || typeof generateCombinedReading !== "function" || !revealedCards.length) {
    return "";
  }

  const combinedReading = generateCombinedReading(revealedCards, {
    isBloodMoon: isBloodMoonReadingActive(),
    spread: getActiveSpread()
  });

  if (!combinedReading) {
    return "";
  }

  const extraMessages = Array.isArray(combinedReading.extraMessages)
    ? combinedReading.extraMessages
    : [];
  const activeSpread = getActiveSpread();
  const intro = getCombinedReadingIntro(combinedReading.summary, revealedCards, activeSpread);
  const threadBlocks = renderThreadPositionBlocks(activeSpread);
  const sharedThemesNote = renderSharedThemesNote(combinedReading.advice);

  return `
    <article class="combined-reading${isBloodMoonReadingActive() ? " combined-reading--blood-moon" : ""}">
      <div class="reading-thread-header">
        <p class="reading-viewer__eyebrow">${escapeHtml(activeSpread?.combinedLabel || "Combined Message")}</p>
        <h3>${escapeHtml(combinedReading.title)}</h3>
        ${intro ? `<p class="combined-reading__intro reading-thread-intro">${escapeHtml(intro)}</p>` : ""}
      </div>
      ${threadBlocks}
      <div class="combined-reading__final">
        <span>Thread Summary</span>
        <p class="combined-reading__advice">${escapeHtml(combinedReading.advice)}</p>
        ${sharedThemesNote}
      </div>
      ${
        extraMessages.length
          ? `
            <div class="combined-reading__extras">
              ${extraMessages.map((message) => `<p>${escapeHtml(message)}</p>`).join("")}
            </div>
          `
          : ""
      }
    </article>
  `;
}

function getCompletedReadingSummary() {
  if (typeof generateCombinedReading !== "function" || !revealedCards.length) {
    return { title: "", resultSummary: "", advice: "", extraMessages: [] };
  }

  if (selectedCardCount < 2) {
    const card = revealedCards[0];
    const orientationMeaning = card && typeof getCardReadingMeaning === "function"
      ? getCardReadingMeaning(card)
      : null;

    return {
      title: "Daily Reflection",
      resultSummary: [orientationMeaning?.summary || card?.shortMeaning, orientationMeaning?.meaning || card?.summary]
        .filter(Boolean)
        .join("\n\n"),
      advice: orientationMeaning?.reflection || card?.reflectionQuestion || "",
      extraMessages: []
    };
  }

  const combinedReading = generateCombinedReading(revealedCards, {
    isBloodMoon: isBloodMoonReadingActive(),
    spread: getActiveSpread()
  });

  if (!combinedReading) {
    return { title: "", resultSummary: "", advice: "", extraMessages: [] };
  }

  return {
    title: combinedReading.title || "",
    resultSummary: [combinedReading.summary, combinedReading.advice].filter(Boolean).join("\n\n"),
    advice: combinedReading.advice || "",
    extraMessages: Array.isArray(combinedReading.extraMessages) ? combinedReading.extraMessages : []
  };
}

function getCurrentModeKey() {
  if (isBloodMoonReadingActive()) {
    return "bloodMoon";
  }

  if (document.body.classList.contains("sun-mode")) {
    return "sun";
  }

  if (document.body.classList.contains("moon-mode")) {
    return "moon";
  }

  return "sun";
}

function shouldResetReadingForModeTransition(nextModeKey) {
  if (!selectedReader || readingFlowStage === "reader") {
    return false;
  }

  if (!activeReadingMode) {
    return true;
  }

  return activeReadingMode !== nextModeKey;
}

function resetReadingForModeTransition({ scrollToSelection = true } = {}) {
  clearCurrentReading();
  clearStoredSelectedReaderValue();
  clearSelectedReaderState({ scrollToSelection });
  activeReadingMode = null;
}

function resetActiveReadingForThemeTransition(nextModeKey) {
  if (readingFlowStage !== "reading" || !activeReadingMode || activeReadingMode === nextModeKey) {
    return;
  }

  clearCurrentReading();
  activeReadingMode = nextModeKey;

  if (selectedReader) {
    setReadingFlowStage("setup", { scrollToStart: true });
  } else {
    setReadingFlowStage("reader", { scrollToStart: true });
  }
}

function getCompletedReadingCards() {
  return revealedCards
    .slice()
    .sort((firstCard, secondCard) => firstCard.position - secondCard.position)
    .map((card, index) => {
      const orientation = getCardOrientationLabel(card).toLowerCase();
      const orientationMeaning = typeof getCardReadingMeaning === "function"
        ? getCardReadingMeaning(card)
        : null;

      return {
        card_key: card.originalCardId || card.id || "",
        name: card.name || getCardDisplayName(card),
        title: getCardDisplayName(card, { includeOrientation: true }),
        orientation,
        upright: orientation === "upright",
        reversed: orientation === "reversed",
        position: card.position,
        position_label: getCardPositionLabel(card, index),
        meaning: orientationMeaning?.meaning || card.summary || "",
        summary: orientationMeaning?.summary || card.shortMeaning || card.bloodMoon?.shortMeaning || "",
      };
    });
}

function getCompletedReadingPayload() {
  const activeSpread = getActiveSpread();
  const completedSummary = getCompletedReadingSummary();
  const modeKey = getCurrentModeKey();
  const spreadType = getActiveSpreadKey();
  const cards = getCompletedReadingCards();
  const triggeredCombination = hasFireKeyPattern(revealedCards) ? "fire_key" : "";

  return {
    reader_key: selectedReader?.id || "",
    reader_name: selectedReader?.name || "",
    mode_key: modeKey,
    readingMode: modeKey,
    deck_id: selectedDeckId,
    deck_name: getActiveDeckConfig()?.title || "",
    spread_type: spreadType,
    card_count: selectedCardCount,
    cards,
    result_summary: completedSummary.resultSummary,
    metadata: {
      reading_source: "standard",
      ai_generated: false,
      requires_credits: false,
      mode: modeKey,
      readingMode: modeKey,
      deck: {
        id: selectedDeckId,
        title: getActiveDeckConfig()?.title || "",
        meaning_set: getActiveDeckConfig()?.meaningSet || "",
        image_set: getActiveDeckConfig()?.imageSet || "",
      },
      spread: {
        key: spreadType,
        card_count: selectedCardCount,
        positions: activeSpread?.positions || [],
        combined_label: activeSpread?.combinedLabel || "",
      },
      reader: {
        key: selectedReader?.id || "",
        name: selectedReader?.name || "",
        zodiac: selectedReader?.sign || selectedReader?.zodiac || "",
      },
      timestamp: new Date().toISOString(),
      combined_title: completedSummary.title,
      combined_advice: completedSummary.advice,
      extra_messages: completedSummary.extraMessages,
      triggered_card_combination: triggeredCombination || null,
      bloodmoon_active: isBloodMoonReadingActive(),
    },
    is_saved: true,
  };
}

function dispatchCompletedReadingEvent() {
  if (!areAllReadingCardsRevealed()) {
    return;
  }

  const payload = getCompletedReadingPayload();
  const eventKey = JSON.stringify({
    reader: payload.reader_key,
    mode: payload.mode_key,
    spread: payload.spread_type,
    cards: payload.cards.map((card) => `${card.position}:${card.card_key}:${card.orientation}`),
  });

  payload.reading_key = eventKey;
  window.dispatchEvent(new CustomEvent("astralveil:reading-completed", { detail: payload }));
}

////////////////////////////////////////////////////
// Reader Selection Carousel
////////////////////////////////////////////////////

// Maps raw reader data into the currently active mode before it appears in selection or results.
function getReaderPresentation(reader) {
  if (!reader) {
    return reader;
  }

  const bloodMoonActive = isBloodMoonReadingActive();
  const image = bloodMoonActive && reader.bloodMoonImage
    ? reader.bloodMoonImage
    : reader.image;

  if (!reader.isBloodMoon || !bloodMoonActive) {
    return {
      ...reader,
      image
    };
  }

  return {
    ...reader,
    image,
    energy: reader.bloodMoonProfile?.energy || reader.energy,
    intro: reader.bloodMoonProfile?.intro || reader.intro
  };
}

// Builds the initial reader selector shell; the featured reader panel is rendered separately.
function renderReaders() {
  if (!readerList || typeof tarotReaders === "undefined") {
    return;
  }

  const visibleGuidePool = getVisibleGuidePool();

  if (!visibleGuidePool.length) {
    readerList.innerHTML = "";
    return;
  }

  featuredReaderIndex = Math.min(featuredReaderIndex, visibleGuidePool.length - 1);
  readerList.classList.add("reader-carousel");
  readerList.innerHTML = `
    <div class="reader-carousel__stage" data-reader-carousel-stage>
      <div class="reader-carousel__featured" data-featured-reader></div>
    </div>
  `;

  renderFeaturedReader();
}

applyBloodMoonState();
updateReadingHeroCopy();

// Locks in the chosen reader, minimizes the selector, and prepares the spread picker.
async function selectReader(readerId) {
  if (isBloodMoonTransitionRunning) {
    return;
  }

  const visibleGuidePool = getVisibleGuidePool();
  let nextReader = null;
  let nextReaderIndex = -1;
  let shouldRunBloodMoonTransition = false;
  let bloodMoonTransitionType = "fate";

  if (readerId === "mystery") {
    const mysterySelection = chooseMysteryReader();
    nextReader = mysterySelection.reader;
    shouldRunBloodMoonTransition = mysterySelection.triggersBloodMoon;
    bloodMoonTransitionType = "fate";
  } else {
    nextReaderIndex = visibleGuidePool.findIndex((reader) => reader.id === readerId);
    nextReader = visibleGuidePool[nextReaderIndex];
    shouldRunBloodMoonTransition = isZephyraSummonActive(nextReader);
    bloodMoonTransitionType = "summon";
  }

  if (!nextReader) {
    return;
  }

  if (readerId !== "mystery" && !isReaderSelectable(nextReader)) {
    showUnavailableReaderMessage(nextReader);
    return;
  }

  if (shouldRunBloodMoonTransition) {
    await runBloodMoonTransition({
      type: bloodMoonTransitionType,
      onActivate: activateBloodMoonEvent
    });
  }

  completeReaderSelection({
    readerId,
    nextReader,
    nextReaderIndex
  });
}

function completeReaderSelection({ readerId, nextReader, nextReaderIndex }) {
  selectedReader = nextReader;
  selectedReaderIndex = readerId === "mystery" ? -1 : nextReaderIndex;
  resetActiveBloodMoonQuote();
  if (selectedReaderIndex !== -1) {
    featuredReaderIndex = selectedReaderIndex;
  }

  clearReaderSelectionPreview();
  window.clearTimeout(bloodMoonTimeout);

  updateActiveReader();
  ensureSelectedDeckIsAvailable();
  renderDeckOptions();
  readingStatus.textContent = readerId === "mystery"
    ? selectedReader.revealMessage || "Fate stirs... a reader answers from beyond the known path."
    : "Choose a deck and spread to shuffle your cards.";
  cardList.innerHTML = "";
  readingReveals.innerHTML = "";
  if (readingThreadSection) {
    readingThreadSection.innerHTML = "";
    readingThreadSection.classList.add("hidden");
  }
  activeRevealedCardIndex = -1;

  setReadingFlowStage("setup", { scrollToStart: true });
}

// Readers shown in the selector can differ from all known readers when event-only profiles are gated.
function getSelectableGuidePool() {
  return getVisibleGuidePool().filter(isReaderFateSelectable);
}

function getVisibleGuidePool() {
  const publicReaders = tarotReaders.filter((reader) => !reader.isMysteryOnly);
  const scorpioReader = typeof mysteryReaders === "undefined"
    ? null
    : mysteryReaders.find((reader) => reader.id === "zephyra-noctis");

  const zodiacOrder = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const guidePool = scorpioReader ? [...publicReaders, scorpioReader] : publicReaders;

  return guidePool.sort(
    (firstReader, secondReader) =>
      zodiacOrder.indexOf(firstReader.sign || firstReader.zodiac) -
      zodiacOrder.indexOf(secondReader.sign || secondReader.zodiac)
  );
}

function getReaderAccentClass(reader) {
  if (reader?.isBloodMoon || reader?.accentClass === "bloodmoon") {
    return "reader-card--bloodmoon";
  }

  if (isBloodMoonActive() && reader?.id === "aquarius") {
    return "reader-card--event reader-card--aquarius-bloodmoon";
  }

  return "reader-card--event";
}

function isLyssaraBloodMoonReader(reader) {
  return isBloodMoonActive() && reader?.id === "aquarius";
}

function isReaderSelectable(reader) {
  return isReaderDirectlySelectable(reader);
}

function isReaderDirectlySelectable(reader) {
  if (isZephyraReader(reader)) {
    return true;
  }

  return !reader?.requiresBloodMoon || isBloodMoonActive();
}

function isReaderFateSelectable(reader) {
  if (isZephyraReader(reader)) {
    return true;
  }

  return isReaderDirectlySelectable(reader);
}

function isBloodMoonEligibleReader(reader) {
  return Boolean(
    reader?.bloodMoonImage ||
    reader?.bloodMoonProfile ||
    reader?.bloodMoon ||
    reader?.isBloodMoon ||
    reader?.bloodMoonTitle
  );
}

function getReaderSelectionImage(reader) {
  if (isBloodMoonActive() && reader?.bloodMoonImage) {
    return reader.bloodMoonImage;
  }

  return reader?.phase1Image || reader?.image || "";
}

function preloadImage(src) {
  if (!src) {
    return;
  }

  const image = new Image();
  image.decoding = "async";
  image.src = src;
}

function preloadReaderSelectionNeighbors(visibleGuidePool, activeIndex) {
  if (!Array.isArray(visibleGuidePool) || visibleGuidePool.length < 2) {
    return;
  }

  [
    (activeIndex - 1 + visibleGuidePool.length) % visibleGuidePool.length,
    (activeIndex + 1) % visibleGuidePool.length
  ].forEach((index) => preloadImage(getReaderSelectionImage(visibleGuidePool[index])));
}

function getReaderZodiacLabel(reader) {
  return reader?.sign || reader?.zodiac || "Unknown";
}

function getReaderZodiacIconPath(reader) {
  return zodiacIconPaths[getReaderZodiacLabel(reader)] || "";
}

function getReaderCardDisplayName(reader) {
  if (reader?.id === "gemini" || getReaderZodiacLabel(reader) === "Gemini") {
    return "Eren & Astra";
  }

  return (reader?.name || "").trim().split(/\s+/)[0] || reader?.name || "";
}

function getReaderFocus(reader) {
  return reader?.focus || reader?.readingStyle || reader?.energy || "";
}

function getReaderRole(reader) {
  const zodiacLabel = getReaderZodiacLabel(reader);
  const role = isBloodMoonReadingActive() && reader?.bloodMoonTitle
    ? reader.bloodMoonTitle
    : reader?.title || reader?.readingStyle || "Astral Reader";

  return [zodiacLabel, role].filter(Boolean).join(" / ");
}

function resetActiveBloodMoonQuote() {
  activeBloodMoonQuote = { readerId: null, quote: "" };
}

function getReaderIntroLineModeKey() {
  return isBloodMoonReadingActive() ? "bloodMoon" : getCurrentModeKey();
}

function getReaderIntroLineKey(reader) {
  if (!reader) {
    return "";
  }

  const readerLines = window.AstralVeilReaderLines;
  const readerLineId = typeof readerLines?.getReaderLineId === "function"
    ? readerLines.getReaderLineId(reader)
    : reader.id || reader.name || "";

  return `${readerLineId}:${getReaderIntroLineModeKey()}`;
}

function getStaticActiveReaderQuote(reader, { forceNew = false } = {}) {
  if (!reader) {
    return "";
  }

  if (!isBloodMoonReadingActive()) {
    const readerLines = window.AstralVeilReaderLines;
    const localIntroLine = typeof readerLines?.getReaderIntroFallbackLine === "function"
      ? readerLines.getReaderIntroFallbackLine({
          reader,
          mode: getReaderIntroLineModeKey()
        })
      : "";
    const localSelectionLine = Array.isArray(reader.normalSelectionMessages) && reader.normalSelectionMessages.length
      ? getRandomArrayItem(reader.normalSelectionMessages)
      : "";

    return localIntroLine || localSelectionLine || reader.heroLine || reader.subtitle || reader.description || reader.energy || "";
  }

  const quotePool = Array.isArray(reader.bloodMoonQuotes) ? reader.bloodMoonQuotes : [];

  if (!quotePool.length) {
    return reader.bloodMoonDescription || reader.description || reader.energy || "";
  }

  if (forceNew || activeBloodMoonQuote.readerId !== reader.id || !activeBloodMoonQuote.quote) {
    activeBloodMoonQuote = {
      readerId: reader.id,
      quote: getRandomArrayItem(quotePool)
    };
  }

  return activeBloodMoonQuote.quote;
}

function getActiveReaderQuote(reader, { forceNew = false } = {}) {
  const introLineKey = getReaderIntroLineKey(reader);

  if (activeReaderIntroLine.key === introLineKey && activeReaderIntroLine.line) {
    return activeReaderIntroLine.line;
  }

  return getStaticActiveReaderQuote(reader, { forceNew });
}

function isErenAstraReader(reader) {
  const readerName = String(reader?.name || "").toLowerCase();

  return reader?.id === "gemini" || (readerName.includes("eren") && readerName.includes("astra"));
}

function getReaderQuoteLines(reader, quote) {
  const normalizedQuote = String(quote || "").trim();

  if (!normalizedQuote) {
    return [];
  }

  if (!isErenAstraReader(reader)) {
    return [normalizedQuote];
  }

  const explicitLines = normalizedQuote
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (explicitLines.length > 1) {
    return explicitLines;
  }

  const speakerMatches = [...normalizedQuote.matchAll(/\b(Eren|Astra)\s*[:\-—]\s*/gi)];

  if (speakerMatches.length < 2) {
    return [normalizedQuote];
  }

  return speakerMatches
    .map((match, index) => normalizedQuote.slice(match.index, speakerMatches[index + 1]?.index).trim())
    .filter(Boolean);
}

function renderActiveReaderQuote(reader, quote) {
  if (!activeReaderQuote) {
    return;
  }

  const quoteLines = getReaderQuoteLines(reader, quote);
  activeReaderQuote.classList.toggle("active-reader-header__quote--split", quoteLines.length > 1);
  activeReaderQuote.textContent = "";

  if (!quoteLines.length) {
    return;
  }

  quoteLines.forEach((line) => {
    const lineElement = document.createElement("span");
    lineElement.className = "active-reader-header__quote-line";
    lineElement.textContent = line;
    activeReaderQuote.append(lineElement);
  });
}

async function hydrateActiveReaderIntroLine(reader) {
  const readerLines = window.AstralVeilReaderLines;

  if (!reader || typeof readerLines?.getReaderIntroLine !== "function") {
    return;
  }

  const introLineKey = getReaderIntroLineKey(reader);
  const requestId = activeReaderIntroRequestId + 1;
  activeReaderIntroRequestId = requestId;

  if (activeReaderIntroLine.key !== introLineKey) {
    activeReaderIntroLine = { key: introLineKey, line: "" };
  }

  try {
    const line = await readerLines.getReaderIntroLine({
      reader,
      mode: getReaderIntroLineModeKey()
    });

    if (requestId !== activeReaderIntroRequestId || getReaderIntroLineKey(reader) !== introLineKey) {
      return;
    }

    if (!line) {
      return;
    }

    activeReaderIntroLine = { key: introLineKey, line };

    if (activeReaderQuote) {
      renderActiveReaderQuote(reader, line);
    }

  } catch (error) {
    console.warn("Unable to apply reader intro line.", error);
  }
}

function clearReaderSelectionPreview() {
  readerSelectionPreview = { readerId: null, modeKey: null, message: "" };
}

function getReaderSelectionMessages(reader) {
  if (!reader) {
    return [];
  }

  if (isBloodMoonActive() && Array.isArray(reader.bloodMoonQuotes) && reader.bloodMoonQuotes.length) {
    return reader.bloodMoonQuotes;
  }

  const messages = isBloodMoonActive()
    ? reader.bloodMoonSelectionMessages
    : reader.normalSelectionMessages;

  if (Array.isArray(messages) && messages.length) {
    return messages;
  }

  return [getReaderFocus(reader)].filter(Boolean);
}

function getNextReaderSelectionMessage(reader) {
  const messages = getReaderSelectionMessages(reader);

  if (!messages.length) {
    return "";
  }

  if (isBloodMoonActive() && Array.isArray(reader?.bloodMoonQuotes) && reader.bloodMoonQuotes.length) {
    return getRandomArrayItem(messages);
  }

  const modeKey = isBloodMoonActive() ? "bloodMoon" : "normal";
  const cursorKey = `${modeKey}:${reader.id}`;
  const nextIndex = ((readerSelectionMessageCursor[cursorKey] ?? -1) + 1) % messages.length;

  readerSelectionMessageCursor[cursorKey] = nextIndex;

  return messages[nextIndex];
}

function updateReaderSelectionPreview(reader, { forceNext = false } = {}) {
  const modeKey = isBloodMoonActive() ? "bloodMoon" : "normal";

  if (
    !forceNext &&
    readerSelectionPreview.readerId === reader?.id &&
    readerSelectionPreview.modeKey === modeKey
  ) {
    return;
  }

  readerSelectionPreview = {
    readerId: reader?.id || null,
    modeKey,
    message: getNextReaderSelectionMessage(reader)
  };
}

function revealFeaturedReaderMessage() {
  const visibleGuidePool = getVisibleGuidePool();
  const featuredReader = visibleGuidePool[featuredReaderIndex];

  updateReaderSelectionPreview(featuredReader, { forceNext: true });
  renderFeaturedReader();
}

function renderFeaturedReader() {
  if (!readerList) {
    return;
  }

  const visibleGuidePool = getVisibleGuidePool();
  const featuredReader = visibleGuidePool[featuredReaderIndex];
  const featuredReaderPanel = readerList.querySelector("[data-featured-reader]");

  if (!featuredReader || !featuredReaderPanel) {
    return;
  }

  const isSelectable = isReaderSelectable(featuredReader);
  const isLocked = !isSelectable && featuredReader.requiresBloodMoon;
  const isSelected = selectedReader?.id === featuredReader.id && selectedReaderIndex !== -1;
  const accentClass = getReaderAccentClass(featuredReader);
  const previousReader = visibleGuidePool[(featuredReaderIndex - 1 + visibleGuidePool.length) % visibleGuidePool.length];
  const nextReader = visibleGuidePool[(featuredReaderIndex + 1) % visibleGuidePool.length];
  updateReaderSelectionPreview(featuredReader);
  const previewMessage = readerSelectionPreview.readerId === featuredReader.id
    ? readerSelectionPreview.message
    : "";
  const isZephyraSummon = rollZephyraSummonState(featuredReader);
  const chooseButtonText = isZephyraSummon
    ? "Summon"
    : "Begin Your Reading";
  const zodiacIconPath = getReaderZodiacIconPath(featuredReader);
  const readerDescription = isBloodMoonActive() && featuredReader.bloodMoonProfile?.description
    ? featuredReader.bloodMoonProfile.description
    : featuredReader.description || getReaderFocus(featuredReader);
  const swipeDots = visibleGuidePool
    .map((reader, index) => `
      <span
        class="mobile-reader-swipe-hint__dot${index === featuredReaderIndex ? " is-active" : ""}"
        aria-hidden="true"
      ></span>
    `)
    .join("");

  const readerQuote = previewMessage || featuredReader.tagline || featuredReader.description || getReaderFocus(featuredReader);

  featuredReaderPanel.className = `reader-carousel__featured ${accentClass}${isLocked ? " is-unavailable" : ""}${isSelected ? " is-active" : ""}`;
  featuredReaderPanel.innerHTML = `
    <article class="reader-selection-orbit" aria-live="polite">
      <button class="reader-orbit-card reader-orbit-card--side reader-orbit-card--prev" type="button" data-reader-carousel-nav="prev" aria-label="Previous Veilwalker">
        <img src="${escapeHtml(getReaderSelectionImage(previousReader))}" alt="" width="${READER_IMAGE_WIDTH}" height="${READER_IMAGE_HEIGHT}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.style.visibility='hidden'" />
      </button>
      <div class="reader-orbit-card reader-orbit-card--featured">
        <button class="reader-selection-split__image" type="button" data-reader-carousel-message aria-label="Refresh this Veilwalker's preview message">
          <img src="${escapeHtml(getReaderSelectionImage(featuredReader))}" alt="Current Veilwalker" width="${READER_IMAGE_WIDTH}" height="${READER_IMAGE_HEIGHT}" loading="eager" decoding="async" fetchpriority="high" onerror="this.style.visibility='hidden'" />
          <span class="reader-card-overlay" aria-hidden="true">
            <span class="reader-card-overlay__name">${escapeHtml(getReaderCardDisplayName(featuredReader))}</span>
            <span class="reader-card-overlay__zodiac">
              ${escapeHtml(getReaderZodiacLabel(featuredReader))}
              ${
                zodiacIconPath
                  ? `<img class="zodiac-icon" src="${escapeHtml(zodiacIconPath)}" alt="" width="20" height="20" loading="eager" decoding="async" />`
                  : ""
              }
            </span>
            ${readerQuote ? `<span class="reader-card-overlay__quote">“${escapeHtml(readerQuote)}”</span>` : ""}
          </span>
        </button>
        ${isLocked ? `<p class="reader-feature-card__locked-message" data-reader-lock-message="${escapeHtml(featuredReader.id)}"></p>` : ""}
        <div class="reader-selection-button-row">
          <button class="reader-feature-card__choose reader-mystery-option reader-card--veil reader-action-button reader-action-button--primary" type="button" data-reader-id="${escapeHtml(featuredReader.id)}" ${isSelectable ? "" : "data-reader-unavailable=\"true\""}>
            <span class="reader-action-button__icon" aria-hidden="true">✧</span>
            <span class="reader-mystery-option__title">${chooseButtonText}</span>
          </button>
          <button class="reader-mystery-option reader-card--veil reader-action-button reader-action-button--secondary${selectedReader?.isMystery && selectedReaderIndex === -1 ? " is-active" : ""}" type="button" data-reader-id="mystery">
            <span class="reader-action-button__icon" aria-hidden="true">☾</span>
            <span class="reader-mystery-option__title">Let Fate Choose</span>
          </button>
        </div>
      </div>
      <button class="reader-carousel__nav reader-carousel__nav--prev" type="button" data-reader-carousel-nav="prev" aria-label="Previous Veilwalker"></button>
      <button class="reader-carousel__nav reader-carousel__nav--next" type="button" data-reader-carousel-nav="next" aria-label="Next Veilwalker"></button>
      <button class="reader-orbit-card reader-orbit-card--side reader-orbit-card--next" type="button" data-reader-carousel-nav="next" aria-label="Next Veilwalker">
        <img src="${escapeHtml(getReaderSelectionImage(nextReader))}" alt="" width="${READER_IMAGE_WIDTH}" height="${READER_IMAGE_HEIGHT}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.style.visibility='hidden'" />
      </button>
      <div class="mobile-reader-swipe-hint" aria-hidden="true">
        <p><span aria-hidden="true">‹</span> Swipe to meet the other Veilwalkers <span aria-hidden="true">›</span></p>
        <div class="mobile-reader-swipe-hint__track">
          ${swipeDots}
        </div>
      </div>
    </article>
  `;
  preloadReaderSelectionNeighbors(visibleGuidePool, featuredReaderIndex);
}

function moveFeaturedReader(direction) {
  const visibleGuidePool = getVisibleGuidePool();

  if (!visibleGuidePool.length) {
    return;
  }

  const offset = direction === "next" ? 1 : -1;

  featuredReaderIndex = (featuredReaderIndex + offset + visibleGuidePool.length) % visibleGuidePool.length;
  clearReaderSelectionPreview();

  renderFeaturedReader();
}

function updateReaderSelectionConfirmation(readerId) {
  if (!readerSelectionConfirmation || !selectedReader) {
    return;
  }

  readerSelectionConfirmation.innerHTML = readerId === "mystery"
    ? `
        <span class="reader-selection__confirmation-title">Fate chose ${escapeHtml(selectedReader.name)}</span>
        <span>${escapeHtml(selectedReader.sign || selectedReader.zodiac || "Unknown")} • ${escapeHtml(selectedReader.element || "The Veil")}</span>
        <span>${escapeHtml(selectedReader.name)} will read this spread through ${escapeHtml(selectedReader.element || "the Veil")}.</span>
      `
    : `
        <span class="reader-selection__confirmation-title">${escapeHtml(selectedReader.name)}</span>
        <span>${escapeHtml(selectedReader.sign || selectedReader.zodiac || "Unknown")} • ${escapeHtml(selectedReader.element || "The Veil")}</span>
        <span>${escapeHtml(selectedReader.name)} will read this spread through ${escapeHtml(selectedReader.element || "the Veil")}.</span>
      `;
}

function showUnavailableReaderMessage(reader) {
  const message = getUnavailableReaderMessage(reader);
  const selectedReaderInfo = readerSelectionConfirmation?.innerHTML || "";
  const lockMessage = document.querySelector(`[data-reader-lock-message="${reader.id}"]`);

  document.querySelectorAll("[data-reader-lock-message]").forEach((element) => {
    if (element !== lockMessage) {
      element.textContent = "";
    }
  });

  document.querySelectorAll(".reader-card.is-lock-pulsing").forEach((card) => {
    card.classList.remove("is-lock-pulsing");
  });

  if (lockMessage) {
    lockMessage.textContent = message;
    lockMessage.closest(".reader-card, .reader-carousel__featured")?.classList.add("is-lock-pulsing");
  }

  if (readerSelectionConfirmation) {
    readerSelectionConfirmation.innerHTML = selectedReader ? selectedReaderInfo : "";
  }

  if (readingStatus) {
    readingStatus.textContent = message;
  }
}

function getUnavailableReaderMessage(reader) {
  return `${reader.name} is not available beneath this moon.`;
}

// "Let Fate Choose" may open Blood Moon; otherwise it chooses from the normal selectable pool.
function chooseMysteryReader() {
  const triggersBloodMoon = !isBloodMoonActive() && shouldTriggerBloodMoon();
  const selectableReaders = triggersBloodMoon
    ? getBloodMoonEligibleGuidePool()
    : getSelectableGuidePool();
  const forcedReader = getForcedFateReader(selectableReaders);

  if (forcedReader) {
    return {
      reader: forcedReader,
      triggersBloodMoon
    };
  }

  return {
    reader: selectableReaders[Math.floor(Math.random() * selectableReaders.length)] || null,
    triggersBloodMoon
  };
}

function getBloodMoonEligibleGuidePool() {
  const eligibleReaders = getVisibleGuidePool().filter(isBloodMoonEligibleReader);

  return eligibleReaders.length ? eligibleReaders : getVisibleGuidePool();
}

function getForcedFateReader(readerPool) {
  const forcedReaderId = getForcedFateReaderId();

  if (!forcedReaderId) {
    return null;
  }

  return readerPool.find((reader) => reader.id === forcedReaderId) || null;
}

function getForcedFateReaderId() {
  const queryValue = getForcedFateReaderQueryValue();
  const storedValue = getStoredForcedFateReaderValue();
  const forcedValue = queryValue || storedValue;

  if (!forcedValue) {
    return "";
  }

  return normalizeForcedFateReaderValue(forcedValue);
}

function getForcedFateReaderQueryValue() {
  try {
    const params = new URLSearchParams(window.location.search);

    return (
      params.get("fate") ||
      params.get("fateReader") ||
      params.get("testFateReader") ||
      ""
    );
  } catch (error) {
    return "";
  }
}

function getStoredForcedFateReaderValue() {
  try {
    return localStorage.getItem(forcedFateReaderStorageKey) || "";
  } catch (error) {
    return "";
  }
}

function normalizeForcedFateReaderValue(value) {
  const normalizedValue = String(value).trim().toLowerCase();

  if (["scorpio", "zephyra", "zephyra-noctis"].includes(normalizedValue)) {
    return "zephyra-noctis";
  }

  return normalizedValue;
}

function getInitialSelectedReaderId() {
  const queryValue = getSelectedReaderQueryValue();
  const storedValue = queryValue ? "" : getStoredSelectedReaderValue();
  const selectedValue = queryValue || storedValue;

  if (!selectedValue) {
    return "";
  }

  return normalizeSelectedReaderValue(selectedValue);
}

function getSelectedReaderQueryValue() {
  try {
    const params = new URLSearchParams(window.location.search);

    return (
      params.get("reader") ||
      params.get("readerId") ||
      params.get("veilwalker") ||
      ""
    );
  } catch (error) {
    return "";
  }
}

function getStoredSelectedReaderValue() {
  try {
    return localStorage.getItem(selectedReaderStorageKey) || "";
  } catch (error) {
    return "";
  }
}

function clearStoredSelectedReaderValue() {
  try {
    localStorage.removeItem(selectedReaderStorageKey);
  } catch (error) {
    // Query-string selection still works when storage is unavailable.
  }
}

function slugifyReaderValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSelectedReaderValue(value) {
  const normalizedValue = slugifyReaderValue(value);

  if (["scorpio", "zephyra", "zephyra-noctis"].includes(normalizedValue)) {
    return "zephyra-noctis";
  }

  const visibleGuidePool = getVisibleGuidePool();
  const readerMatch = visibleGuidePool.find((reader) => {
    const sign = slugifyReaderValue(reader.sign || reader.zodiac);

    return (
      reader.id === normalizedValue ||
      sign === normalizedValue ||
      slugifyReaderValue(reader.name) === normalizedValue
    );
  });

  return readerMatch?.id || normalizedValue;
}

function selectInitialReaderFromHandoff() {
  const initialReaderId = getInitialSelectedReaderId();

  clearStoredSelectedReaderValue();

  if (!initialReaderId) {
    return;
  }

  const reader = getVisibleGuidePool().find((item) => item.id === initialReaderId);

  if (!reader) {
    return;
  }

  if (!isReaderSelectable(reader)) {
    featuredReaderIndex = getVisibleGuidePool().findIndex((item) => item.id === initialReaderId);
    renderFeaturedReader();
    showUnavailableReaderMessage(reader);
    return;
  }

  selectReader(initialReaderId);
}

function updateActiveReader() {
  const readerPresentation = getReaderPresentation(selectedReader);
  activeReaderHeader?.classList.toggle(
    "active-reader-header--aquarius-bloodmoon",
    isLyssaraBloodMoonReader(selectedReader)
  );
  if (readingStageTitle) {
    readingStageTitle.textContent = isBloodMoonReadingActive()
      ? "Blood Moon Reading"
      : document.body.classList.contains("sun-mode")
        ? "Sunlit Reading"
        : document.body.classList.contains("moon-mode")
          ? "Moonlit Reading"
          : "Astral Reading";
  }
  if (readingStageSubtitle) {
    readingStageSubtitle.textContent = isBloodMoonReadingActive()
      ? "The veil is thin. The truth is listening."
      : document.body.classList.contains("sun-mode")
        ? "The light gathers around your question."
        : document.body.classList.contains("moon-mode")
          ? "The moon opens a quiet path through the veil."
          : "The cards are listening. Follow the current that answers.";
  }
  updateSpreadOptionCopy();
  updateReadingHeroCopy();
  const preparationTitle = isBloodMoonReadingActive()
    ? "UNDER THE BLOOD MOON"
    : "Before We Begin";
  const preparationText = isBloodMoonReadingActive()
    ? "Do not ask unless you are ready to hear what your shadow has been saying all along."
    : "Take a breath and focus on the energy surrounding your question. Let your thoughts settle, trust your intuition, choose a deck, and select the spread that feels right for you.";

  document.querySelectorAll(".reader-card").forEach((card) => {
    const isMysterySelection =
      selectedReader.isMystery && selectedReaderIndex === -1 && card.dataset.readerId === "mystery";
    const isDirectReaderSelection =
      selectedReaderIndex !== -1 && card.dataset.readerId === selectedReader.id;
    card.classList.toggle(
      "is-active",
      isDirectReaderSelection || isMysterySelection
    );
  });

  renderFeaturedReader();
  ensureSelectedDeckIsAvailable();
  renderDeckOptions();

  updateReaderSelectionConfirmation(selectedReaderIndex === -1 ? "mystery" : selectedReader.id);

  activeReaderImage.src = readerPresentation.image;
  activeReaderImage.alt = readerPresentation.name;
  activeReaderImage.dataset.imagePreviewTitle = readerPresentation.name;
  activeReaderImage.dataset.imagePreviewCaption = getStaticActiveReaderQuote(readerPresentation);
  activeReaderName.textContent = readerPresentation.name;
  activeReaderRole.textContent = getReaderRole(readerPresentation);
  renderActiveReaderQuote(readerPresentation, getActiveReaderQuote(readerPresentation));
  hydrateActiveReaderIntroLine(readerPresentation);
  scrollActiveReaderPanel(0, { behavior: "auto" });
  readerIntroduction.innerHTML = `
    <p class="reading-section__eyebrow">${preparationTitle}</p>
    <p>${preparationText}</p>
  `;
}

function updateSpreadOptionCopy() {
  const defaultLabels = {
    1: "Daily Glimpse",
    3: "Focused",
    5: "Deeper",
    7: "Ritual",
  };
  const defaultDescriptions = {
    1: "A single message for today",
    3: "A focused glimpse",
    5: "A deeper path",
    7: "A full ritual",
  };
  const bloodMoonLabels = {
    1: "Daily Glimpse",
    3: "3 Cards",
    5: "5 Cards",
    7: "7 Cards",
  };
  const bloodMoonDescriptions = {
    1: "One exposed truth",
    3: "First wound",
    5: "Hidden pattern",
    7: "Whole fracture",
  };
  const labels = isBloodMoonReadingActive() ? bloodMoonLabels : defaultLabels;
  const descriptions = isBloodMoonReadingActive() ? bloodMoonDescriptions : defaultDescriptions;

  spreadButtons.forEach((button) => {
    const label = labels[button.dataset.spread];
    const description = descriptions[button.dataset.spread];
    const labelElement = button.querySelector("strong");
    const descriptionElement = button.querySelector("small");

    if (labelElement && label) {
      labelElement.textContent = label;
    }

    if (descriptionElement && description) {
      descriptionElement.textContent = description;
    }
  });
}

updateSpreadOptionCopy();

function moveReader(direction) {
  if (!selectedReader || typeof tarotReaders === "undefined") {
    return;
  }

  const visibleGuidePool = getVisibleGuidePool();
  const selectableGuidePool = getSelectableGuidePool();
  const currentSelectableIndex = selectableGuidePool.findIndex((reader) => reader.id === selectedReader.id);
  const slideClass = direction === "next" ? "is-sliding-right" : "is-sliding-left";

  if (!selectableGuidePool.length || currentSelectableIndex === -1) {
    return;
  }

  readerPortraitFrame.classList.add(slideClass);

  window.setTimeout(() => {
    const offset = direction === "next" ? 1 : -1;

    selectedReaderIndex =
      (currentSelectableIndex + offset + selectableGuidePool.length) % selectableGuidePool.length;
    selectedReader = selectableGuidePool[selectedReaderIndex];
    selectedReaderIndex = visibleGuidePool.findIndex((reader) => reader.id === selectedReader.id);
    resetActiveBloodMoonQuote();
    window.clearTimeout(bloodMoonTimeout);

    updateActiveReader();

    readingStatus.textContent = currentReadingCards.length
      ? `${selectedReader.name} is now reading this spread.`
      : "Choose a deck and spread to shuffle your cards.";

    readerPortraitFrame.classList.remove(slideClass);
  }, 180);
}

////////////////////////////////////////////////////
// Spread Selection and Card Drawing
////////////////////////////////////////////////////

// Creates a new reading: chooses cards, assigns orientation, and renders the facedown spread.
async function selectSpread(cardCount) {
  if (isRenderingReading) {
    return;
  }

  isRenderingReading = true;

  if (readingPreferencesReadyPromise) {
    await readingPreferencesReadyPromise;
  }

  const activeDeck = getActiveDeckConfig();

  if (!activeDeck || !isDeckAccessible(activeDeck)) {
    readingStatus.textContent = "Choose an available deck before starting your reading.";
    renderDeckOptions();
    isRenderingReading = false;
    return;
  }

  try {
    selectedCardCount = cardCount;

  spreadButtons.forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.spread) === cardCount);
    });

    currentReadingCards = getRandomCards(cardCount);
    revealedCards = [];
    activeRevealedCardIndex = -1;
    readingReveals.innerHTML = "";
    if (readingThreadSection) {
      readingThreadSection.innerHTML = "";
      readingThreadSection.classList.add("hidden");
    }
    setReadingFlowStage("reading", { scrollToStart: true });
    renderReadingCards(currentReadingCards);
    readingStatus.textContent = `${selectedReader.name} has drawn ${cardCount} ${cardCount === 1 ? "card" : "cards"} from ${activeDeck.title}. Click ${cardCount === 1 ? "the card" : "each card"} in Your Reading to reveal its message.`;
  } catch (error) {
    isRenderingReading = false;
    throw error;
  }

  window.setTimeout(() => {
    isRenderingReading = false;
  }, 300);
}

function syncReadingCardStates() {
  if (!cardList) {
    return;
  }

  const activeCardIndex = getActiveReadingCardIndex();

  cardList.querySelectorAll(".tarot-card").forEach((button) => {
    const cardIndex = Number(button.dataset.cardIndex);
    const isRevealed = isReadingCardRevealed(cardIndex);
    const isActive = cardIndex === activeCardIndex;
    const card = currentReadingCards[cardIndex];
    const cardName = card ? getCardDisplayName(card) : "card";

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");

    if (isRevealed) {
      button.setAttribute("aria-label", `${getReadingCardPositionLabel(cardIndex)}: ${cardName}`);
    }
  });
}

function centerActiveReadingCardOnMobile() {
  if (!cardList || !window.matchMedia("(max-width: 640px)").matches) {
    return;
  }

  const activeCardButton = cardList.querySelector(".tarot-card.is-active");

  activeCardButton?.scrollIntoView({
    behavior: getReadingScrollBehavior(),
    block: "nearest",
    inline: "center",
  });
}

// Shuffles the active deck and prepares each drawn card with a stable orientation.
function getRandomCards(cardCount) {
  const shuffledDeck = [...getActiveDeck()];

  // Fisher-Yates shuffle keeps the reading random without duplicating cards.
  for (let index = shuffledDeck.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentCard = shuffledDeck[index];

    shuffledDeck[index] = shuffledDeck[randomIndex];
    shuffledDeck[randomIndex] = currentCard;
  }

  return shuffledDeck.slice(0, cardCount).map(prepareReadingCard);
}

// Renders the clickable facedown cards. The front image already knows its saved upright/reversed state.
function renderReadingCards(cards) {
  cardList.classList.remove("hidden");
  cardList.innerHTML = "";
  cardList.dataset.cardCount = String(cards.length);
  const cardBackImage = getActiveCardBackImage();
  const protectedMediaClass = isBloodMoonReadingActive() ? " protected-media" : "";
  const protectedMediaAttrs = isBloodMoonReadingActive() ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = isBloodMoonReadingActive() ? ' draggable="false"' : "";

  cardList.innerHTML = cards
    .map((card, index) => {
      const energy = cardEnergyTypes.includes(card.energy) ? card.energy : "neutral";
      const cardName = getCardDisplayName(card);
      const orientationLabel = getCardOrientationLabel(card);
      const reversedClass = isCardReversed(card) ? " is-reversed" : "";

      return `
        <button class="tarot-card energy-${energy} fade-slide-in${protectedMediaClass}" type="button" data-card-index="${index}" aria-label="Reveal ${escapeHtml(cardName)}"${protectedMediaAttrs}>
          <span class="tarot-card__inner">
            <span class="tarot-card__face tarot-card__back">
              <img src="${cardBackImage}" alt="" width="${CARD_IMAGE_WIDTH}" height="${CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async" fetchpriority="low"${protectedImageAttr} />
            </span>
            <span class="tarot-card__face tarot-card__front">
              <img class="card-image${reversedClass}" src="${escapeHtml(card.image)}" alt="${escapeHtml(cardName)}" width="${CARD_IMAGE_WIDTH}" height="${CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async" fetchpriority="low"${protectedImageAttr} onerror="this.src='${cardBackImage}'" />
              <span class="card-orientation-badge">${escapeHtml(orientationLabel)}</span>
            </span>
          </span>
        </button>
      `;
    })
    .join("");
}

function isReadingCardRevealed(cardIndex) {
  return revealedCards.some((card) => card.position === cardIndex + 1);
}

function getReadingCardPositionLabel(cardIndex) {
  const spread = getActiveSpread();

  return spread?.positions?.[cardIndex] || `Card ${cardIndex + 1}`;
}

function getRevealedCardIndexByCardIndex(cardIndex) {
  return revealedCards.findIndex((card) => card.position === cardIndex + 1);
}

function getActiveReadingCardIndex() {
  const activeCard = revealedCards[activeRevealedCardIndex];

  return activeCard ? activeCard.position - 1 : -1;
}

function getRevealedCardIndexesInSpreadOrder() {
  return currentReadingCards
    .map((card, index) => index)
    .filter((index) => isReadingCardRevealed(index));
}

function getAdjacentRevealedCardIndex(direction) {
  const revealedIndexes = getRevealedCardIndexesInSpreadOrder();
  const activeCardIndex = getActiveReadingCardIndex();
  const currentIndex = revealedIndexes.indexOf(activeCardIndex);
  const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

  return revealedIndexes[nextIndex] ?? -1;
}

function setActiveReadingCardByCardIndex(cardIndex, { scrollToDetail = true } = {}) {
  const revealedCardIndex = getRevealedCardIndexByCardIndex(cardIndex);

  if (revealedCardIndex < 0) {
    return;
  }

  activeRevealedCardIndex = revealedCardIndex;
  renderReadingResults();

  if (scrollToDetail) {
    scrollToActiveReadingDetail();
  }
}

function getNextUnrevealedCardIndex() {
  if (!currentReadingCards.length) {
    return -1;
  }

  const activeCard = revealedCards[activeRevealedCardIndex];
  const startIndex = activeCard ? activeCard.position : 0;

  for (let offset = 0; offset < currentReadingCards.length; offset += 1) {
    const cardIndex = (startIndex + offset) % currentReadingCards.length;

    if (!isReadingCardRevealed(cardIndex)) {
      return cardIndex;
    }
  }

  return -1;
}

function areAllReadingCardsRevealed() {
  return Boolean(currentReadingCards.length) && revealedCards.length === currentReadingCards.length;
}

function scrollToActiveReadingDetail() {
  window.requestAnimationFrame(() => {
    const activeDetail = readingReveals?.querySelector(".reading-viewer");

    activeDetail?.scrollIntoView({
      behavior: getReadingScrollBehavior(),
      block: "start",
    });
  });
}

function revealNextReadingCard() {
  const nextCardIndex = getNextUnrevealedCardIndex();
  const nextCardButton = cardList?.querySelector(`[data-card-index="${nextCardIndex}"]`);

  if (!nextCardButton) {
    return;
  }

  revealCard(nextCardButton, { scrollToDetail: true });
}

function renderReadingCardTabs() {
  const activeCardIndex = getActiveReadingCardIndex();

  return `
    <nav class="reading-card-tabs" role="tablist" aria-label="Revealed card details">
      ${currentReadingCards
        .map((card, index) => {
          const isRevealed = isReadingCardRevealed(index);
          const isActive = index === activeCardIndex;
          const label = getReadingCardPositionLabel(index);
          const cardName = getCardDisplayName(card);

          return `
            <button class="reading-card-tab${isActive ? " is-active" : ""}${isRevealed ? " is-revealed" : " is-locked"}" type="button" role="tab" data-reading-card-tab="${index}" aria-selected="${isActive ? "true" : "false"}" aria-current="${isActive ? "true" : "false"}" aria-label="${escapeHtml(isRevealed ? `${label}: ${cardName}` : `${label}: not revealed yet`)}" ${isRevealed ? "" : "disabled"}>
              <span>${escapeHtml(label)}</span>
            </button>
          `;
        })
        .join("")}
    </nav>
  `;
}

function renderReadingStickyNav(activeCard) {
  const previousCardIndex = getAdjacentRevealedCardIndex("prev");
  const nextCardIndex = getAdjacentRevealedCardIndex("next");
  const activePositionLabel = getReadingCardPositionLabel(activeCard.position - 1);

  return `
    <div class="reading-mobile-nav" aria-label="Mobile card detail navigation">
      <button class="reader-nav-button" type="button" data-reading-sticky-nav="prev" ${previousCardIndex >= 0 ? "" : "disabled"} aria-label="View previous revealed card">
        Previous
      </button>
      <p>
        <span>${escapeHtml(activePositionLabel)}</span>
        <strong>Card ${activeCard.position} of ${currentReadingCards.length}</strong>
      </p>
      <button class="reader-nav-button" type="button" data-reading-sticky-nav="next" ${nextCardIndex >= 0 ? "" : "disabled"} aria-label="View next revealed card">
        Next
      </button>
    </div>
  `;
}

// Reveals one card once, stores it in revealedCards, and keeps its orientation stable for this reading.
function revealCard(cardButton, { scrollToDetail = false } = {}) {
  if (cardButton.classList.contains("is-revealed")) {
    return;
  }

  const cardIndex = Number(cardButton.dataset.cardIndex);
  const card = currentReadingCards[cardIndex];

  if (!card) {
    return;
  }

  cardButton.classList.add("is-revealed");
  cardButton.setAttribute("aria-label", "Card revealed");
  revealedCards.push({
    ...card,
    position: cardIndex + 1,
    isReversed: isCardReversed(card),
  });
  activeRevealedCardIndex = revealedCards.length - 1;
  renderReadingResults();

  if (scrollToDetail) {
    scrollToActiveReadingDetail();
  }
}

// Controls the selected-card viewer, Previous/Next browsing, combined message, and New Reading action.
function renderReadingResults() {
  if (!revealedCards.length) {
    readingReveals.innerHTML = "";
    activeRevealedCardIndex = -1;
    return;
  }

  const activeCard = revealedCards[activeRevealedCardIndex];
  const activeEnergy = cardEnergyTypes.includes(activeCard.energy)
    ? activeCard.energy
    : "neutral";
  const showViewerControls = revealedCards.length > 1;
  const showRevealActions = readingFlowStage === "reading";
  const hasRevealedAllCards = areAllReadingCardsRevealed();
  const progressText =
    hasRevealedAllCards
      ? currentReadingCards.length === 1
        ? "1 of 1 revealed. Your Daily Glimpse is open."
        : "Your full spread has been revealed."
      : `${revealedCards.length} of ${currentReadingCards.length} cards revealed.`;
  const guidedAction = showRevealActions
    ? hasRevealedAllCards
      ? {
          helper: currentReadingCards.length === 1
            ? "Your Daily Glimpse has been revealed."
            : "All cards have been revealed."
        }
      : {
          label: "Reveal Next Card",
          action: "next",
          helper: `${revealedCards.length} of ${currentReadingCards.length} revealed`
        }
    : null;
  const activePositionLabel = getCardPositionLabel(activeCard, activeRevealedCardIndex);
  const cardName = getCardDisplayName(activeCard);
  const cardTitle = getCardDisplayName(activeCard, { includeOrientation: true });
  const orientationLabel = getCardOrientationLabel(activeCard);
  const reversedClass = isCardReversed(activeCard) ? " is-reversed" : "";
  const protectedMediaClass = isBloodMoonReadingActive() ? " protected-media" : "";
  const protectedMediaAttrs = isBloodMoonReadingActive() ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = isBloodMoonReadingActive() ? ' draggable="false"' : "";

  readingStatus.textContent = progressText;
  syncReadingCardStates();
  centerActiveReadingCardOnMobile();
  readingReveals.innerHTML = `
    <article class="reading-viewer energy-${activeEnergy}" aria-live="polite">
      <div
        class="reading-viewer__image-frame${protectedMediaClass}"
        ${protectedMediaAttrs}
        data-expandable-image
        data-image-preview-title="${escapeHtml(cardTitle)}"
        data-image-preview-caption="${escapeHtml(`${activePositionLabel} • ${orientationLabel}`)}"
        role="button"
        tabindex="0"
        aria-label="Expand ${escapeHtml(cardTitle)} image"
      >
        <img
          class="reading-viewer__image card-image${reversedClass}"
          src="${escapeHtml(activeCard.image)}"
          alt="${escapeHtml(cardName)}"
          width="${CARD_IMAGE_WIDTH}"
          height="${CARD_IMAGE_HEIGHT}"
          loading="eager"
          decoding="async"
          data-image-preview-title="${escapeHtml(cardTitle)}"
          data-image-preview-caption="${escapeHtml(`${activePositionLabel} • ${orientationLabel}`)}"
          ${protectedImageAttr}
          onerror="this.src='${getActiveCardBackImage()}'"
        />
        <span class="card-orientation-badge reading-viewer__orientation-badge">${escapeHtml(orientationLabel)}</span>
      </div>

      <div class="reading-viewer__content">
        <p class="reading-viewer__eyebrow">${escapeHtml(activePositionLabel)} • Card ${activeCard.position} of ${currentReadingCards.length} • ${escapeHtml(orientationLabel)}</p>
        <h3>${escapeHtml(cardTitle)}</h3>
        ${renderCardMeaningDetails(activeCard)}

        ${
          showViewerControls
            ? `
              <div class="reading-viewer__controls" aria-label="Browse revealed cards">
                <button class="reader-nav-button" type="button" data-reading-viewer-nav="prev">
                  Previous
                </button>
                <span class="reading-viewer__counter">${activeRevealedCardIndex + 1} of ${revealedCards.length} revealed</span>
                <button class="reader-nav-button" type="button" data-reading-viewer-nav="next">
                  Next
                </button>
              </div>
            `
            : `<p class="reading-viewer__counter">1 of ${revealedCards.length} revealed</p>`
        }

      </div>
    </article>
    ${
      showRevealActions
        ? `
          <div class="reading-viewer__guided-action">
            <div class="reading-ornament" aria-hidden="true">
              <span></span>
              <i>✦</i>
              <span></span>
            </div>
            <p>${escapeHtml(guidedAction.helper)}</p>
            ${
              hasRevealedAllCards
                ? ""
                : `<button class="primary-action" type="button" data-reveal-next-card>${escapeHtml(guidedAction.label)}</button>`
            }
          </div>
        `
        : ""
    }
  `;

  if (hasRevealedAllCards) {
    renderReadingThreadView();
  }

  dispatchCompletedReadingEvent();
}

function handleReadingStageActionClick(event) {
  const navButton = event.target.closest("[data-reading-viewer-nav]");
  const revealNextButton = event.target.closest("[data-reveal-next-card]");
  const resetButton = event.target.closest("[data-reset-reading]");
  const changeReaderButton = event.target.closest("[data-change-reader]");

  if (navButton) {
    moveReadingViewer(navButton.dataset.readingViewerNav);
    return;
  }

  if (revealNextButton) {
    revealNextReadingCard();
    return;
  }

  if (resetButton) {
    startNewReading();
    return;
  }

  if (changeReaderButton) {
    resetToGuideSelection();
  }
}

function renderFinalReadingActions() {
  return `
    <div class="reading-final-actions" aria-label="Reading actions">
      <div class="reading-final-actions__row">
        <button class="primary-action reading-actions__button reading-final-actions__button" type="button" data-reset-reading>
          New Reading
        </button>
        <div data-reading-save-actions></div>
      </div>
    </div>
  `;
}

function renderReadingThreadView() {
  if (!readingThreadSection) {
    return;
  }

  if (!areAllReadingCardsRevealed()) {
    readingThreadSection.classList.add("hidden");
    readingThreadSection.innerHTML = "";
    return;
  }

  const isSingleCardReading = currentReadingCards.length === 1;

  readingThreadSection.innerHTML = isSingleCardReading
    ? renderFinalReadingActions()
    : `
      ${renderCombinedReading()}
      ${renderFireKeyCluePanel()}
      ${renderFinalReadingActions()}
    `;
  readingThreadSection.classList.remove("hidden");
}

function scheduleReadingSectionScroll() {
  window.clearTimeout(readingSectionScrollTimeout);

  readingSectionScrollTimeout = window.setTimeout(() => {
    const readingSection = document.getElementById("reading-section");

    if (!readingSection) {
      return;
    }

    readingSection.scrollIntoView({
      behavior: getReadingScrollBehavior(),
      block: "start",
    });
  }, readingSectionScrollDelay);
}

function moveReadingViewer(direction) {
  if (revealedCards.length < 2) {
    return;
  }

  const offset = direction === "next" ? 1 : -1;

  activeRevealedCardIndex =
    (activeRevealedCardIndex + offset + revealedCards.length) % revealedCards.length;
  renderReadingResults();
}

////////////////////////////////////////////////////
// Reading Event Listeners
////////////////////////////////////////////////////

// Result-panel actions are delegated because the viewer re-renders as cards are revealed.
if (readingReveals) {
  readingReveals.addEventListener("click", handleReadingStageActionClick);
}

if (readingThreadSection) {
  readingThreadSection.addEventListener("click", handleReadingStageActionClick);
}

// Clears spread/card state while preserving the selected reader unless the caller resets that too.
function clearCurrentReading() {
  window.clearTimeout(readingSectionScrollTimeout);
  window.clearTimeout(bloodMoonTimeout);
  isRenderingReading = false;

  selectedCardCount = 0;
  currentReadingCards = [];
  revealedCards = [];
  activeRevealedCardIndex = -1;
  cardList.innerHTML = "";
  readingReveals.innerHTML = "";
  if (readingThreadSection) {
    readingThreadSection.innerHTML = "";
    readingThreadSection.classList.add("hidden");
  }
  readingStatus.textContent = "Choose a deck and spread to shuffle your cards.";

  spreadButtons.forEach((button) => {
    button.classList.remove("is-active");
  });

  activeReadingMode = null;
}

function startNewReading() {
  clearCurrentReading();
  if (!selectedReader) {
    resetToGuideSelection();
    return;
  }

  setReadingFlowStage("setup", { scrollToStart: true });
}

// Restores the reader selection screen and clears active reader presentation details.
function clearSelectedReaderState({ scrollToSelection = false } = {}) {
  selectedReader = null;
  selectedReaderIndex = -1;
  resetZephyraSummonRoll();
  activeReaderHeader?.classList.remove("active-reader-header--aquarius-bloodmoon");
  activeReaderImage.src = "";
  activeReaderImage.alt = "";
  delete activeReaderImage.dataset.imagePreviewTitle;
  delete activeReaderImage.dataset.imagePreviewCaption;
  activeReaderName.textContent = "";
  activeReaderRole.textContent = "";
  activeReaderQuote.textContent = "";
  resetActiveBloodMoonQuote();
  activeReaderIntroLine = { key: null, line: "" };
  activeReaderIntroRequestId += 1;
  readerIntroduction.innerHTML = "";
  if (readerSelectionConfirmation) {
    readerSelectionConfirmation.innerHTML = "";
  }
  readerSelection.classList.remove("is-minimized");

  document.querySelectorAll(".reader-card").forEach((card) => {
    card.classList.remove("is-active");
  });

  document.querySelectorAll("[data-reader-lock-message]").forEach((element) => {
    element.textContent = "";
  });

  renderFeaturedReader();

  if (scrollToSelection) {
    setReadingFlowStage("reader", { scrollToStart: true });
    return;
  }

  setReadingFlowStage("reader");
}

function resetToGuideSelection() {
  clearCurrentReading();
  deactivateBloodMoonEvent();
  clearSelectedReaderState({ scrollToSelection: true });
}

initializeReadingPreferences();
renderReaders();
setReadingFlowStage("reader", { scrollToStart: false });
hydrateAccountDeckAccess();
selectInitialReaderFromHandoff();

// When Blood Moon changes, reader availability and deck/card art can change, so refresh visible UI.
window.addEventListener("astralVeilBloodMoonChange", (event) => {
  const isBloodMoonModeActive = typeof event.detail?.isActive === "boolean"
    ? event.detail.isActive
    : isBloodMoonActive();

  clearReaderSelectionPreview();
  resetZephyraSummonRoll();
  resetActiveBloodMoonQuote();
  updateReadingHeroCopy();
  renderReaders();

  const nextModeKey = isBloodMoonModeActive ? "bloodMoon" : getCurrentModeKey();

  if (shouldResetReadingForModeTransition(nextModeKey)) {
    resetReadingForModeTransition({ scrollToSelection: true });
    return;
  }

  if (selectedReader) {
    ensureSelectedDeckIsAvailable();
    updateActiveReader();
  }
});

window.addEventListener("astralveil:reader-lines-ready", () => {
  if (!selectedReader) {
    return;
  }

  hydrateActiveReaderIntroLine(getReaderPresentation(selectedReader));
});

window.addEventListener("astralVeilBloodMoonActivationMessage", (event) => {
  const message = event.detail?.message || "";

  if (message && readingStatus) {
    readingStatus.textContent = message;
  }
});

window.setInterval(() => {
  if (!readerSelection?.classList.contains("is-minimized")) {
    renderFeaturedReader();
  }
}, 30000);

if (readerList) {
  readerList.addEventListener("click", (event) => {
    if (isBloodMoonTransitionRunning) {
      event.preventDefault();
      return;
    }

    const carouselNavButton = event.target.closest("[data-reader-carousel-nav]");
    const readerCard = event.target.closest("[data-reader-id]");

    if (carouselNavButton) {
      moveFeaturedReader(carouselNavButton.dataset.readerCarouselNav);
      return;
    }

    if (event.target.closest("[data-reader-carousel-message]")) {
      revealFeaturedReaderMessage();
      return;
    }

    if (readerCard) {
      selectReader(readerCard.dataset.readerId);
    }
  });

  readerList.addEventListener("keydown", (event) => {
    if (isBloodMoonTransitionRunning) {
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFeaturedReader("prev");
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFeaturedReader("next");
    }
  });

  readerList.addEventListener("touchstart", (event) => {
    if (isBloodMoonTransitionRunning) {
      return;
    }

    const touch = event.changedTouches[0];

    readerCarouselTouchStartX = touch.clientX;
    readerCarouselTouchStartY = touch.clientY;
  }, { passive: true });

  readerList.addEventListener("touchend", (event) => {
    if (isBloodMoonTransitionRunning) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - readerCarouselTouchStartX;
    const deltaY = touch.clientY - readerCarouselTouchStartY;

    if (Math.abs(deltaX) > 72 && Math.abs(deltaX) > Math.abs(deltaY) * 2.4) {
      moveFeaturedReader(deltaX < 0 ? "next" : "prev");
    }
  }, { passive: true });

  readerList.addEventListener("wheel", (event) => {
    if (isBloodMoonTransitionRunning) {
      event.preventDefault();
      return;
    }

    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 28) {
      return;
    }

    const now = Date.now();

    if (now - lastReaderCarouselWheelAt < 420) {
      return;
    }

    lastReaderCarouselWheelAt = now;
    moveFeaturedReader(event.deltaX > 0 ? "next" : "prev");
  }, { passive: false });
}

spreadButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!selectedReader) {
      return;
    }

    selectSpread(Number(button.dataset.spread));
  });
});

if (deckOptions) {
  deckOptions.addEventListener("pointerdown", (event) => {
    if (!isSmallViewport()) {
      return;
    }

    readingDeckTouchStartX = event.clientX;
    readingDeckTouchStartY = event.clientY;
    readingDeckDidSwipe = false;
  });

  deckOptions.addEventListener("pointerup", (event) => {
    if (!isSmallViewport() || readingDeckTouchStartX === null || readingDeckTouchStartY === null) {
      readingDeckTouchStartX = null;
      readingDeckTouchStartY = null;
      return;
    }

    const deltaX = event.clientX - readingDeckTouchStartX;
    const deltaY = event.clientY - readingDeckTouchStartY;
    readingDeckTouchStartX = null;
    readingDeckTouchStartY = null;

    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    readingDeckDidSwipe = true;
    moveReadingDeckCarousel(deltaX < 0 ? 1 : -1);
  });

  deckOptions.addEventListener("click", (event) => {
    if (readingDeckDidSwipe) {
      readingDeckDidSwipe = false;
      event.preventDefault();
      return;
    }

    const deckCard = event.target.closest("[data-reading-deck-card]");
    const deckButton = event.target.closest("[data-deck-id]");

    if (deckCard && isSmallViewport()) {
      const deckId = deckCard.dataset.deckCardId;
      const offset = Number(deckCard.dataset.deckOffset || 0);

      if (offset !== 0) {
        event.preventDefault();
        updateReadingDeckCarouselPosition(deckId);
        return;
      }

      if (!deckButton) {
        const deck = getDeckConfig(deckId);

        if (!deck || !isDeckCompatible(deck) || !isDeckAccessible(deck)) {
          readingStatus.textContent = getDeckLockedReason(deck) || "This deck is locked.";
          return;
        }

        selectedDeckId = deck.id;
        activeReadingDeckCarouselId = deck.id;
        renderDeckOptions();
        readingStatus.textContent = `${deck.title} selected. Choose a spread to begin.`;
        return;
      }
    }

    if (!deckButton) {
      return;
    }

    const deck = getDeckConfig(deckButton.dataset.deckId);

    if (!deck || !isDeckCompatible(deck) || !isDeckAccessible(deck)) {
      renderDeckOptions();
      return;
    }

    selectedDeckId = deck.id;
    activeReadingDeckCarouselId = deck.id;
    renderDeckOptions();
    readingStatus.textContent = `${deck.title} selected. Choose a spread to begin.`;
  });
}

readerNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moveReader(button.dataset.readerNav);
  });
});

if (activeReaderHeader) {
  activeReaderHeader.addEventListener("scroll", () => {
    if (!isSmallViewport()) {
      return;
    }

    updateReaderPanelDots(getActiveReaderPanelIndex());
  }, { passive: true });
}

readerPanelDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    scrollActiveReaderPanel(Number(dot.dataset.readerPanelDot || 0));
  });
});

if (newReadingButton) {
  newReadingButton.addEventListener("click", startNewReading);
}

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  window.setTimeout(() => {
    const nextModeKey = getCurrentModeKey();

    resetActiveReadingForThemeTransition(nextModeKey);
    ensureSelectedDeckIsAvailable();
    renderDeckOptions();
  }, 0);
});

if (cardList) {
  cardList.addEventListener("click", (event) => {
    if (readingFlowStage !== "reading") {
      return;
    }

    const cardButton = event.target.closest(".tarot-card");

    if (cardButton) {
      const cardIndex = Number(cardButton.dataset.cardIndex);

      if (isReadingCardRevealed(cardIndex)) {
        setActiveReadingCardByCardIndex(cardIndex, { scrollToDetail: false });
        return;
      }

      revealCard(cardButton);
    }
  });
}
