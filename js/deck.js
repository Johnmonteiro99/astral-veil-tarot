const deckView = document.querySelector("[data-deck-view]");
const deckEyebrow = document.querySelector("[data-deck-eyebrow]");
const deckTitle = document.querySelector("[data-deck-title]");
const deckDescription = document.querySelector("[data-deck-description]");
const deckRitualFeature = document.querySelector("[data-deck-ritual-feature]");
const deckLightbox = document.querySelector("[data-deck-lightbox]");
const lightboxCardImage = document.querySelector("[data-lightbox-card-image]");
const lightboxCardName = document.querySelector("[data-lightbox-card-name]");
const lightboxCardMeaning = document.querySelector("[data-lightbox-card-meaning]");
const closeDeckLightboxButtons = document.querySelectorAll("[data-close-deck-lightbox]");
const deckInfoModal = document.querySelector("[data-deck-info-modal]");
const deckInfoImage = document.querySelector("[data-deck-info-image]");
const deckInfoCategory = document.querySelector("[data-deck-info-category]");
const deckInfoTitle = document.querySelector("[data-deck-info-title]");
const deckInfoIntro = document.querySelector("[data-deck-info-intro]");
const deckInfoAbout = document.querySelector("[data-deck-info-about]");
const deckInfoReveals = document.querySelector("[data-deck-info-reveals]");
const deckInfoBestFor = document.querySelector("[data-deck-info-best-for]");
const deckInfoStatus = document.querySelector("[data-deck-info-status]");
const deckInfoViewButton = document.querySelector("[data-deck-info-view]");
const deckInfoTiltButton = document.querySelector("[data-deck-info-tilt]");
const closeDeckInfoButtons = document.querySelectorAll("[data-close-deck-info]");

let activeCollectionId = "original";
let activeDeckFilter = "All";
let activeCardIndex = 0;
let activeDeckInfoCollectionId = "";
let mobileDeckViewMode = "browse";
let mobileDeckSwipeStartX = null;
let mobileDeckSwipeStartY = null;
let mobileDeckDidSwipe = false;
let deckCarouselIndexes = {
  "all-decks": 0,
  free: 0,
  unlockable: 0,
  purchasable: 0
};
let deckMessageTimeout = null;
let deckAuthState = {
  checked: false,
  user: null
};
const DECK_CARD_IMAGE_WIDTH = 800;
const DECK_CARD_IMAGE_HEIGHT = 1200;
const thumbnailPlaceholder =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const DECK_BROWSER_SECTION_ID = "all-decks";
const deckLibraryFilters = ["All", "Gifted", "Arcane Market", "Veiled"];
const deckFilterTitles = {
  All: "All Decks",
  Gifted: "Gifted Decks",
  Veiled: "Veiled Decks",
  "Arcane Market": "Arcane Market Decks"
};
const deckInfoModalThemeClasses = [
  "deck-modal--verdant",
  "deck-modal--dreambound",
  "deck-modal--moonveil",
  "deck-modal--bloodmoon",
  "deck-modal--cyber-hacked"
];

////////////////////////////////////////////////////
// Deck Collection Access and Card Data Helpers
////////////////////////////////////////////////////

// Event decks use the shared event helper so Blood Moon access stays consistent with readings/archive.
function isDeckEventActive(eventId) {
  if (!eventId) {
    return false;
  }

  return Boolean(window.AstralVeilEvents?.isEventActive(eventId));
}

function isBloodMoonCollection(collection) {
  return collection?.id === "bloodMoon" || collection?.requiredEvent === "bloodMoon";
}

function isDeckUserAuthenticated() {
  return Boolean(deckAuthState.user);
}

function canViewBloodMoonDeck() {
  return isDeckEventActive("bloodMoon") || document.body.classList.contains("blood-moon-mode");
}

function isAuthLockedCollection(collection) {
  return collection?.accessType === "requiresAuth";
}

// Central lock check for free, event, purchased, premium, and coming-soon collections.
function isCollectionLocked(collection) {
  if (!collection) {
    return true;
  }

  if (isBloodMoonCollection(collection)) {
    return !canViewBloodMoonDeck();
  }

  if (isAuthLockedCollection(collection)) {
    return !isDeckUserAuthenticated();
  }

  if (collection.accessType === "event") {
    return !isDeckEventActive(collection.requiredEvent);
  }

  if (collection.accessType === "premium" || collection.accessType === "purchased") {
    return !collection.isPurchased;
  }

  return collection.accessType === "comingSoon";
}

// Updates the page hero as the user moves between collection selection and a specific deck.
function updateDeckHero({ eyebrow, title, description }) {
  if (deckEyebrow) {
    deckEyebrow.textContent = eyebrow;
  }

  if (deckTitle) {
    deckTitle.textContent = title;
  }

  if (deckDescription) {
    deckDescription.textContent = description;
  }
}

function updateDeckHeroStatus() {
  if (!deckDescription || typeof deckCollections === "undefined") {
    return;
  }

  let statusLine = document.querySelector("[data-deck-status-line]");

  if (!statusLine) {
    statusLine = document.createElement("p");
    statusLine.className = "deck-hero__status";
    statusLine.dataset.deckStatusLine = "";
    deckDescription.insertAdjacentElement("afterend", statusLine);
  }

  const discoveredCount = deckCollections.length;
  const unlockedCount = deckCollections.filter((collection) => !isCollectionLocked(collection)).length;
  const sealedCount = Math.max(0, discoveredCount - unlockedCount);

  statusLine.textContent = `${discoveredCount} decks discovered | ${unlockedCount} unlocked | ${sealedCount} still sealed`;
  statusLine.hidden = false;
}

function hideDeckHeroStatus() {
  const statusLine = document.querySelector("[data-deck-status-line]");

  if (statusLine) {
    statusLine.hidden = true;
  }
}

function setDeckRitualFeatureVisible(isVisible) {
  if (deckRitualFeature) {
    deckRitualFeature.hidden = !isVisible;
  }
}

function setDeckHeroVisible(isVisible) {
  const deckHero = document.querySelector(".deck-hero");

  if (deckHero) {
    deckHero.hidden = !isVisible;
  }
}

function isSmallDeckViewport() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function scrollToDeckPageTop({ behavior = "smooth" } = {}) {
  const target = document.querySelector(".deck-page") || document.querySelector(".tarot-stage") || document.body;
  const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 12);

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: targetTop,
      behavior
    });
  });
}

function getCollectionCards(collection) {
  if (!collection || typeof collection.cards !== "function") {
    return [];
  }

  return collection.cards();
}

function getCollectionById(collectionId) {
  if (typeof deckCollections === "undefined") {
    return null;
  }

  return deckCollections.find((item) => item.id === collectionId);
}

function getCollectionCategory(collection) {
  return collection?.category || "Lumen";
}

function getCollectionSection(collection) {
  return collection?.librarySection || "free";
}

function normalizeDeckFilter(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized === "free") {
    return "gifted";
  }

  if (normalized === "arcane-market" || normalized === "shop") {
    return "market";
  }

  return normalized;
}

function getDeckFilterTitle() {
  return deckFilterTitles[activeDeckFilter] || "All Decks";
}

function getDeckFilterEmptyMessage() {
  return {
    title: "No decks have surfaced here yet.",
    note: "Try another filter, or return when the Archive shifts."
  };
}

function getCollectionFilterTags(collection) {
  const tags = new Set((collection?.filters || []).map(normalizeDeckFilter));
  const section = getCollectionSection(collection);
  const category = getCollectionCategory(collection);

  if (section === "free") {
    tags.add("gifted");
  }

  if (section === "unlockable") {
    tags.add("veiled");
  }

  if (section === "purchasable") {
    tags.add("market");
  }

  if (collection?.accessType === "premium" || collection?.accessType === "purchased" || collection?.accessType === "comingSoon") {
    tags.add("market");
  }

  if (collection?.accessType === "comingSoon") {
    tags.add("coming-soon");
  }

  tags.add(isCollectionLocked(collection) ? "locked" : "unlocked");

  return tags;
}

function getDeckFilterCount(filter) {
  if (typeof deckCollections === "undefined") {
    return 0;
  }

  if (filter === "All") {
    return deckCollections.length;
  }

  const filterKey = normalizeDeckFilter(filter);
  return deckCollections.filter((collection) => getCollectionFilterTags(collection).has(filterKey)).length;
}

function getCollectionTheme(collection) {
  return collection?.theme || collection?.id || "lumen";
}

function getCollectionStatus(collection) {
  if (isBloodMoonCollection(collection) && !canViewBloodMoonDeck()) {
    return collection.lockedStatus || "Blood Moon Only";
  }

  if (isAuthLockedCollection(collection) && !isDeckUserAuthenticated()) {
    return collection.lockedStatus || "Locked";
  }

  return isCollectionLocked(collection)
    ? collection.lockedStatus || "Locked"
    : collection.unlockedStatus || collection.status;
}

function getCollectionActionLabel(collection) {
  if (isBloodMoonCollection(collection) && !canViewBloodMoonDeck()) {
    return collection.lockedActionLabel || "Blood Moon Only";
  }

  return isCollectionLocked(collection)
    ? collection.lockedActionLabel || "Locked"
    : collection.actionLabel;
}

function getCollectionTypeLabel(collection) {
  if (!collection) {
    return "Archive Deck";
  }

  if (getCollectionFilterTags(collection).has("market")) {
    return "Market";
  }

  if (getCollectionFilterTags(collection).has("veiled")) {
    return "Veiled Deck";
  }

  return collection.status || collection.category || "Deck Collection";
}

function getCollectionStatusLabel(collection) {
  if (!collection) {
    return "Unknown";
  }

  if (collection.accessType === "comingSoon") {
    return "Coming Soon";
  }

  return isCollectionLocked(collection) ? "Locked" : "Unlocked";
}

function getCollectionMoodKeywords(collection) {
  const keywords = {
    original: "Clarity / Growth / Guidance",
    dreambound: "Wonder / Courage / Dreams",
    moonveil: "Intuition / Balance / Stillness",
    bloodMoon: "Shadow / Truth / Transformation",
    cyberpunkArcana: "Neon / Synthetic / Future"
  };

  return keywords[collection?.id] || "Symbol / Story / Reading";
}

function getDeckReturnToPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}` || "/decks";
}

function getDeckAuthUrl(mode = "login") {
  const params = new URLSearchParams({
    returnTo: getDeckReturnToPath()
  });

  const authPath = mode === "signup" ? "/signup" : "/login";
  return `${authPath}?${params.toString()}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCardDescription(card) {
  return card?.meaning || card?.shortMeaning || card?.summary || "";
}

function getCollectionDetailDescription(collection) {
  return collection?.detailDescription || collection?.viewDescription || collection?.subtitle || "";
}

function getCollectionModalTitle(collection) {
  return collection?.fullTitle || collection?.title || collection?.name || "Deck Details";
}

function getCollectionModalCategory(collection) {
  return collection?.categoryLabel || getCollectionTypeLabel(collection);
}

function getCollectionModalStatus(collection) {
  if (!collection) {
    return "";
  }

  if (collection.accessType === "comingSoon") {
    return collection.statusLabel || collection.lockedStatus || "Coming Soon";
  }

  if (isBloodMoonCollection(collection) && !canViewBloodMoonDeck()) {
    return "This deck can only be viewed while Blood Moon mode is active.";
  }

  if (isCollectionLocked(collection)) {
    return getCollectionStatus(collection);
  }

  return collection.statusLabel || getCollectionStatusLabel(collection);
}

function getCollectionModalCardBack(collection) {
  return collection?.cardBackImage || collection?.previewImage || collection?.coverImage || "";
}

function getCollectionModalIntro(collection) {
  return collection?.modalIntro || collection?.subtitle || getCollectionDetailDescription(collection);
}

function getCollectionModalAbout(collection) {
  return collection?.modalAbout || getCollectionDetailDescription(collection);
}

function getCollectionModalReveals(collection) {
  return collection?.modalReveals || collection?.viewDescription || collection?.subtitle || "";
}

function getCollectionBestFor(collection) {
  if (Array.isArray(collection?.bestForTags) && collection.bestForTags.length) {
    return collection.bestForTags;
  }

  if (Array.isArray(collection?.bestFor) && collection.bestFor.length) {
    return collection.bestFor;
  }

  return getCollectionMoodKeywords(collection)
    .split("/")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getDeckInfoModalThemeClass(collection) {
  if (!collection) {
    return "deck-modal--verdant";
  }

  if (collection.id === "cyberpunkArcana") {
    return "deck-modal--cyber-hacked";
  }

  if (collection.id === "bloodMoon") {
    return "deck-modal--bloodmoon";
  }

  if (collection.id === "dreambound") {
    return "deck-modal--dreambound";
  }

  if (collection.id === "moonveil") {
    return "deck-modal--moonveil";
  }

  return "deck-modal--verdant";
}

function setDeckInfoParagraph(element, value) {
  if (!element) {
    return;
  }

  element.innerHTML = String(value || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<span>${escapeHtml(paragraph)}</span>`)
    .join("");
}

function resetDeckInfoTilt() {
  if (!deckInfoTiltButton) {
    return;
  }

  deckInfoTiltButton.style.setProperty("--tilt-x", "0deg");
  deckInfoTiltButton.style.setProperty("--tilt-y", "0deg");
  deckInfoTiltButton.style.setProperty("--shine-x", "50%");
  deckInfoTiltButton.style.setProperty("--shine-y", "50%");
}

function updateDeckInfoTilt(event) {
  if (!deckInfoTiltButton || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const rect = deckInfoTiltButton.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width;
  const relativeY = (event.clientY - rect.top) / rect.height;
  const tiltY = (relativeX - 0.5) * 12;
  const tiltX = (0.5 - relativeY) * 12;

  deckInfoTiltButton.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
  deckInfoTiltButton.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
  deckInfoTiltButton.style.setProperty("--shine-x", `${(relativeX * 100).toFixed(1)}%`);
  deckInfoTiltButton.style.setProperty("--shine-y", `${(relativeY * 100).toFixed(1)}%`);
}

function startDeckInfoTilt(event) {
  if (!deckInfoTiltButton || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (typeof deckInfoTiltButton.setPointerCapture === "function" && event.pointerId !== undefined) {
    deckInfoTiltButton.setPointerCapture(event.pointerId);
  }

  updateDeckInfoTilt(event);
}

function endDeckInfoTilt(event) {
  if (deckInfoTiltButton && typeof deckInfoTiltButton.releasePointerCapture === "function" && event?.pointerId !== undefined) {
    try {
      deckInfoTiltButton.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture may already be released by the browser.
    }
  }

  resetDeckInfoTilt();
}

// Creates temporary study keywords when older card data does not define them directly.
function getFallbackKeywords(card) {
  const sourceText = [
    card?.shortMeaning,
    card?.meaning,
    card?.summary
  ].filter(Boolean).join(" ");

  const ignoredWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "your",
    "you",
    "are",
    "into",
    "from",
    "before",
    "under",
    "beneath",
    "through"
  ]);

  return sourceText
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !ignoredWords.has(word))
    .slice(0, 5);
}

function getDeckCardKeywords(card) {
  const keywords = Array.isArray(card?.keywords) && card.keywords.length
    ? card.keywords
    : getFallbackKeywords(card);

  return keywords.slice(0, 5);
}

function getDeckOrientationMeaning(card, orientation) {
  if (orientation === "reversed" && typeof getCardReversedMeaning === "function") {
    return getCardReversedMeaning(card);
  }

  if (typeof getCardUprightMeaning === "function") {
    return getCardUprightMeaning(card);
  }

  return {
    summary: orientation === "reversed" ? card?.shadowMeaning : card?.shortMeaning,
    meaning: orientation === "reversed" ? card?.shadowMeaning : card?.summary,
    reflection: card?.reflectionQuestion
  };
}

////////////////////////////////////////////////////
// Deck Viewer Rendering
////////////////////////////////////////////////////

// Inline icons keep the card meaning boxes self-contained without adding external icon dependencies.
function getDeckMeaningIcon(type) {
  const icons = {
    upright: `
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
      </svg>
    `,
    reversed: `
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M15.8 3.4c-3.9 1.2-6.7 4.9-6.7 9.2 0 3.2 1.6 6.1 4.1 7.8-5.1-.8-8.9-5.2-8.9-10.5 0-5 3.5-9.2 8.2-10.2 1.1-.2 2.2-.2 3.3-.3z" />
        <path d="M17.7 8.2l.8 1.7 1.8.8-1.8.8-.8 1.7-.8-1.7-1.8-.8 1.8-.8z" />
      </svg>
    `,
    shadow: `
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M12 2.8 18.2 12 12 21.2 5.8 12 12 2.8z" />
        <path d="M12 6.2v11.6M8.4 12h7.2" />
      </svg>
    `,
    reflection: `
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="7.2" ry="9" />
        <path d="M8.7 8.1c1.8-1.2 4.6-1.2 6.4 0M8.7 15.9c1.8 1.2 4.6 1.2 6.4 0" />
        <path d="M12 5.2v13.6" />
      </svg>
    `
  };

  return icons[type] || "";
}

function renderDeckKeywords(card) {
  const keywords = getDeckCardKeywords(card);

  if (!keywords.length) {
    return "";
  }

  return `
    <ul class="deck-viewer__keywords" aria-label="Card keywords">
      ${keywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join("")}
    </ul>
  `;
}

function renderDeckMeaningCard(type, title, text) {
  const safeText = String(text || "").trim();

  return `
    <article class="deck-viewer__meaning-card deck-viewer__meaning-card--${escapeHtml(type)} deck-viewer__meaning-card--desktop">
      <div class="deck-viewer__meaning-summary">
        <span class="deck-viewer__meaning-icon">${getDeckMeaningIcon(type)}</span>
        <span class="deck-viewer__meaning-title">${escapeHtml(title)}</span>
        <span class="deck-viewer__meaning-dot" aria-hidden="true"></span>
        <span class="deck-viewer__meaning-preview">${escapeHtml(safeText)}</span>
      </div>
    </article>
    <details class="deck-viewer__meaning-card deck-viewer__meaning-card--${escapeHtml(type)} deck-viewer__meaning-card--mobile">
      <summary class="deck-viewer__meaning-summary">
        <span class="deck-viewer__meaning-icon">${getDeckMeaningIcon(type)}</span>
        <span class="deck-viewer__meaning-title">${escapeHtml(title)}</span>
        <span class="deck-viewer__meaning-dot" aria-hidden="true"></span>
        <span class="deck-viewer__meaning-chevron" aria-hidden="true"></span>
      </summary>
      <p>${escapeHtml(safeText)}</p>
    </details>
  `;
}

function renderDeckCardMeanings(card) {
  const upright = getDeckOrientationMeaning(card, "upright");
  const reversed = getDeckOrientationMeaning(card, "reversed");

  return `
    <div class="deck-viewer__meaning-grid" aria-label="Card meanings">
      ${renderDeckMeaningCard("upright", "Upright", upright.keywords || upright.meaning || upright.summary)}
      ${renderDeckMeaningCard("reversed", "Reversed", reversed.meaning || reversed.summary)}
      ${renderDeckMeaningCard("shadow", "Shadow", upright.shadow || card.shadowMeaning || reversed.shadow)}
      ${renderDeckMeaningCard("reflection", "Reflection", upright.reflection || reversed.reflection || card.reflectionQuestion)}
    </div>
  `;
}

function getDeckDetailThemeClass(collection) {
  const themeSource = String(collection?.id || collection?.theme || "")
    .trim()
    .toLowerCase();

  if (themeSource.includes("blood")) {
    return "deck-detail--bloodmoon";
  }

  if (themeSource.includes("moonveil")) {
    return "deck-detail--moonveil";
  }

  if (themeSource.includes("dreambound")) {
    return "deck-detail--dreambound";
  }

  if (themeSource.includes("cyber")) {
    return "deck-detail--cyber-hacked";
  }

  return "deck-detail--verdant";
}

function initializeDeckCardTilt() {
  const tiltCards = deckView?.querySelectorAll("[data-tilt-card]");

  if (!tiltCards?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  tiltCards.forEach((tiltCard) => {
    const resetTilt = () => {
      tiltCard.classList.remove("is-tilting");
      tiltCard.style.setProperty("--tilt-x", "0deg");
      tiltCard.style.setProperty("--tilt-y", "0deg");
      tiltCard.style.setProperty("--shine-x", "50%");
      tiltCard.style.setProperty("--shine-y", "50%");
    };

    const updateTilt = (event) => {
      const rect = tiltCard.getBoundingClientRect();
      const relativeX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      const relativeY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      const tiltY = (relativeX - 0.5) * 14;
      const tiltX = (0.5 - relativeY) * 14;

      tiltCard.classList.add("is-tilting");
      tiltCard.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      tiltCard.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      tiltCard.style.setProperty("--shine-x", `${(relativeX * 100).toFixed(1)}%`);
      tiltCard.style.setProperty("--shine-y", `${(relativeY * 100).toFixed(1)}%`);
    };

    resetTilt();
    tiltCard.addEventListener("pointerenter", updateTilt);
    tiltCard.addEventListener("pointermove", updateTilt);
    tiltCard.addEventListener("pointerleave", resetTilt);
    tiltCard.addEventListener("pointercancel", resetTilt);
    tiltCard.addEventListener("pointerup", resetTilt);
  });
}

// Preloads only neighboring full-size images so next/previous card browsing feels responsive.
function preloadAdjacentCards(cards, selectedIndex) {
  if (!Array.isArray(cards) || cards.length < 2) {
    return;
  }

  const adjacentIndexes = [
    (selectedIndex - 1 + cards.length) % cards.length,
    (selectedIndex + 1) % cards.length
  ];

  adjacentIndexes.forEach((index) => {
    const image = cards[index]?.image;

    if (image) {
      const preloadImage = new Image();
      preloadImage.src = image;
    }
  });
}

// Thumbnail rails lazy-load offscreen card art to avoid pulling every full image immediately.
function initializeThumbnailLazyLoading() {
  const rail = deckView?.querySelector(".deck-thumbnail-rail");
  const thumbnailImages = deckView?.querySelectorAll("[data-thumbnail-src]");

  if (!rail || !thumbnailImages?.length) {
    return;
  }

  const loadThumbnail = (image) => {
    if (!image.dataset.thumbnailSrc) {
      return;
    }

    image.src = image.dataset.thumbnailSrc;
    delete image.dataset.thumbnailSrc;
  };

  if (!("IntersectionObserver" in window)) {
    thumbnailImages.forEach(loadThumbnail);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        loadThumbnail(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      root: rail,
      rootMargin: "120px"
    }
  );

  thumbnailImages.forEach((image) => observer.observe(image));
}

function showDeckMessage(message) {
  const messageElement = document.querySelector("[data-deck-message]");

  if (!messageElement) {
    return;
  }

  window.clearTimeout(deckMessageTimeout);
  messageElement.textContent = message;
  messageElement.classList.add("is-visible");

  deckMessageTimeout = window.setTimeout(() => {
    messageElement.classList.remove("is-visible");
  }, 3200);
}

function renderDeckAccessLoading() {
  if (!deckView) {
    return;
  }

  deckView.innerHTML = `
    <div class="deck-access-loading" role="status" aria-live="polite">
      Checking deck access...
    </div>
  `;
}

function renderDeckFilterControls() {
  return `
    <div class="deck-filter-row" aria-label="Filter deck collections">
      <button class="deck-filter-arrow deck-filter-arrow--prev" type="button" data-deck-filter-nav="prev" aria-label="Previous deck filter"></button>
      <div class="deck-filter-track">
        ${deckLibraryFilters
          .map(
            (filter) => `
              <button class="deck-filter-pill${filter === activeDeckFilter ? " is-active" : ""}" type="button" data-deck-filter="${escapeHtml(filter)}" aria-pressed="${filter === activeDeckFilter ? "true" : "false"}">
                <span class="deck-filter-pill__label">${escapeHtml(filter)}</span>
              </button>
            `
          )
          .join("")}
      </div>
      <button class="deck-filter-arrow deck-filter-arrow--next" type="button" data-deck-filter-nav="next" aria-label="Next deck filter"></button>
    </div>
  `;
}

function centerActiveDeckFilter({ behavior = "smooth" } = {}) {
  const track = deckView?.querySelector(".deck-filter-track");
  const activeButton = track?.querySelector(".deck-filter-pill.is-active");

  if (!track || !activeButton) {
    return;
  }

  const targetScrollLeft = activeButton.offsetLeft + activeButton.offsetWidth / 2 - track.clientWidth / 2;

  track.scrollTo({
    left: Math.max(0, targetScrollLeft),
    behavior
  });
}

function setDeckFilter(filter, { behavior = "smooth" } = {}) {
  if (!deckLibraryFilters.includes(filter)) {
    return;
  }

  activeDeckFilter = filter;
  deckCarouselIndexes[DECK_BROWSER_SECTION_ID] = 0;
  mobileDeckViewMode = "browse";
  renderDeckCollection();
  window.requestAnimationFrame(() => centerActiveDeckFilter({ behavior }));
}

function moveDeckFilter(direction) {
  const currentIndex = deckLibraryFilters.indexOf(activeDeckFilter);
  const offset = direction === "next" ? 1 : -1;
  const nextIndex = (currentIndex + offset + deckLibraryFilters.length) % deckLibraryFilters.length;

  setDeckFilter(deckLibraryFilters[nextIndex]);
}

function getCollectionIdClass(collection) {
  return String(collection?.id || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getCarouselDeckLabel(collection) {
  const labels = {
    original: "VERDANT",
    dreambound: "DREAMBOUND",
    moonveil: "MOONVEIL",
    bloodMoon: "BLOOD MOON",
    cyberpunkArcana: "CYBER-HACKED"
  };

  return labels[collection?.id] || getCollectionCategory(collection);
}

function getCarouselDeckIntention(collection) {
  const intentions = {
    original: "For those learning to grow through every season.",
    dreambound: "For those who follow wonder, courage, and the language of dreams.",
    moonveil: "For those seeking emotional balance within.",
    bloodMoon: "For those ready to face the truth beneath the surface.",
    cyberpunkArcana: "For those drawn to synthetic souls, neon omens, and fractured futures."
  };

  return intentions[collection?.id] || "";
}

function renderDeckCollectionCard(collection, options = {}) {
  const {
    extraClass = "",
    includeCardDeckTrigger = true,
    showTitle = false,
    showDescription = true,
    labelText = "",
    intentionText = ""
  } = options;
  const isLocked = isCollectionLocked(collection);
  const isAuthLocked = isAuthLockedCollection(collection) && isLocked;
  const canOpenLockedPrompt = false;
  const isComingSoon = collection?.accessType === "comingSoon";
  const status = getCollectionStatus(collection);
  const actionLabel = getCollectionActionLabel(collection);
  const category = getCollectionCategory(collection);
  const visibleLabel = labelText || category;
  const theme = getCollectionTheme(collection);
  const description = isBloodMoonCollection(collection) && isLocked
    ? "Available only during Blood Moon."
    : isAuthLocked && collection?.lockedMessage
    ? `${collection.lockedMessage}`
    : collection?.subtitle || "";
  const previewImage = collection?.previewImage || collection?.coverImage;
  const tileBackgroundImage = collection?.backgroundImage || collection?.coverImage || "";
  const tileBackgroundStyle = tileBackgroundImage
    ? `style='--deck-collection-cover: url("${tileBackgroundImage}")'`
    : "";
  const cardDeckAttribute = isComingSoon || !includeCardDeckTrigger ? "" : `data-view-deck="${escapeHtml(collection.id)}"`;
  const buttonDeckAttribute = isComingSoon || (isBloodMoonCollection(collection) && isLocked)
    ? ""
    : `data-view-deck="${escapeHtml(collection.id)}"`;
  const modifierClass = extraClass ? ` ${extraClass}` : "";
  const idClass = getCollectionIdClass(collection);
  const deckIdClass = idClass ? ` deck-collection-card--${idClass}` : "";
  const protectedMediaClass = isBloodMoonCollection(collection) ? " protected-media" : "";
  const protectedMediaAttrs = isBloodMoonCollection(collection) ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = isBloodMoonCollection(collection) ? ' draggable="false"' : "";

  return `
      <article class="deck-collection-card deck-collection-card--${escapeHtml(theme)}${escapeHtml(deckIdClass)}${isLocked ? " is-locked" : ""}${isComingSoon ? " is-coming-soon" : ""}${escapeHtml(modifierClass)}${protectedMediaClass}" ${tileBackgroundStyle} data-deck-card data-deck-category="${escapeHtml(category)}" ${protectedMediaAttrs} ${cardDeckAttribute} aria-disabled="${isLocked}">
      <span class="deck-collection-card__badge">${escapeHtml(status)}</span>
      <button class="deck-collection-card__preview" type="button" data-deck-details="${escapeHtml(collection.id)}" aria-label="View details for ${escapeHtml(collection.title)}">
        <img src="${escapeHtml(previewImage)}" alt="" width="${DECK_CARD_IMAGE_WIDTH}" height="${DECK_CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async"${protectedImageAttr} />
        <span class="deck-collection-card__detail-hint">View Details</span>
      </button>
      <div class="deck-collection-card__content">
        <p class="deck-collection-card__category">${escapeHtml(visibleLabel)}</p>
        ${showTitle ? `<h2>${escapeHtml(collection.title)}</h2>` : ""}
        ${intentionText ? `<p class="deck-collection-card__intention">${escapeHtml(intentionText)}</p>` : ""}
        ${showDescription ? `<p>${escapeHtml(description)}</p>` : ""}
      </div>
      <div class="deck-collection-card__actions">
        <button class="deck-collection-card__action" type="button" ${buttonDeckAttribute} ${isLocked && !canOpenLockedPrompt && !isAuthLocked ? "disabled" : ""}>
          ${escapeHtml(actionLabel)}
        </button>
      </div>
    </article>
  `;
}

function getDeckCarouselIndex(sectionId, itemCount) {
  if (!itemCount) {
    return 0;
  }

  const currentIndex = Number(deckCarouselIndexes[sectionId] || 0);
  return ((currentIndex % itemCount) + itemCount) % itemCount;
}

function getDeckCarouselItem(collections, activeIndex, offset) {
  const itemCount = collections.length;

  if (!itemCount) {
    return null;
  }

  return collections[((activeIndex + offset) % itemCount + itemCount) % itemCount];
}

function renderDeckCarouselPreview(collection, sectionId, index, position) {
  if (!collection) {
    return "";
  }

  const previewImage = collection.previewImage || collection.coverImage || "";
  const protectedMediaClass = isBloodMoonCollection(collection) ? " protected-media" : "";
  const protectedMediaAttrs = isBloodMoonCollection(collection) ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = isBloodMoonCollection(collection) ? ' draggable="false"' : "";

  return `
    <button class="deck-focused-carousel__preview deck-focused-carousel__preview--${escapeHtml(position)}${protectedMediaClass}" type="button" data-deck-carousel-focus="${escapeHtml(sectionId)}" data-deck-carousel-index="${index}" aria-label="Focus ${escapeHtml(collection.title)}"${protectedMediaAttrs}>
      <img class="deck-focused-carousel__preview-cardback" src="${escapeHtml(previewImage)}" alt="${escapeHtml(collection.title)} card back" width="${DECK_CARD_IMAGE_WIDTH}" height="${DECK_CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async"${protectedImageAttr} />
    </button>
  `;
}

function getMobileDeckShelfName(collection) {
  return String(collection?.title || collection?.displayName || getCarouselDeckLabel(collection) || "")
    .replace(/\s+ARCANA$/i, "")
    .replace(/\s+Arcana$/i, "")
    .trim();
}

function renderMobileDeckShelfItem(collection, sectionId, index, activeIndex, itemCount) {
  const previewImage = collection?.previewImage || collection?.coverImage || "";
  const isLocked = isCollectionLocked(collection);
  const status = getCollectionStatus(collection);
  const isSelected = index === activeIndex;
  const protectedMediaClass = isBloodMoonCollection(collection) ? " protected-media" : "";
  const protectedMediaAttrs = isBloodMoonCollection(collection) ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = isBloodMoonCollection(collection) ? ' draggable="false"' : "";
  const offset = getDeckCarouselOffset(index, activeIndex, itemCount);
  const visibleOffset = getVisibleMobileDeckOffset(offset);

  return `
    <button class="deck-mobile-shelf__item ${getMobileDeckOffsetClass(visibleOffset)}${isSelected ? " is-selected" : ""}${isLocked ? " is-locked" : ""}${protectedMediaClass}" type="button" data-mobile-deck-focus="${escapeHtml(sectionId)}" data-deck-carousel-index="${index}" data-mobile-deck-offset="${offset}" aria-label="${isSelected ? `Open focused view for ${escapeHtml(collection.title)}` : `Bring ${escapeHtml(collection.title)} forward`}" aria-pressed="${isSelected ? "true" : "false"}"${protectedMediaAttrs}>
      <span class="deck-mobile-shelf__card">
        <img src="${escapeHtml(previewImage)}" alt="${escapeHtml(collection.title)} card back" width="${DECK_CARD_IMAGE_WIDTH}" height="${DECK_CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async"${protectedImageAttr} />
        ${isLocked ? `<span class="deck-mobile-shelf__status">${escapeHtml(status)}</span>` : ""}
      </span>
      <span class="deck-mobile-shelf__name">${escapeHtml(getMobileDeckShelfName(collection))}</span>
    </button>
  `;
}

function getMobileDeckOffsetClass(offset) {
  return `deck-mobile-shelf__item--offset-${offset < 0 ? `neg-${Math.abs(offset)}` : offset}`;
}

function getDeckCarouselOffset(index, activeIndex, itemCount) {
  let offset = index - activeIndex;

  if (offset > itemCount / 2) {
    offset -= itemCount;
  } else if (offset < -itemCount / 2) {
    offset += itemCount;
  }

  return offset;
}

function getVisibleMobileDeckOffset(offset) {
  return Math.max(-3, Math.min(3, offset));
}

function updateMobileDeckShelfPosition(sectionId, nextIndex) {
  const section = Array.from(deckView?.querySelectorAll("[data-deck-carousel-section]") || [])
    .find((element) => element.dataset.deckCarouselSection === sectionId);
  const shelf = section?.querySelector(".deck-mobile-shelf");
  const sectionCollections = getFilteredDeckCollections();
  const itemCount = sectionCollections.length;

  if (!shelf || !itemCount) {
    return false;
  }

  const activeIndex = getDeckCarouselIndex(sectionId, itemCount);
  const normalizedNextIndex = ((nextIndex % itemCount) + itemCount) % itemCount;

  if (normalizedNextIndex === activeIndex) {
    return true;
  }

  deckCarouselIndexes[sectionId] = normalizedNextIndex;
  mobileDeckViewMode = "browse";

  shelf.querySelectorAll("[data-mobile-deck-focus]").forEach((item) => {
    const index = Number(item.dataset.deckCarouselIndex || 0);
    const collection = sectionCollections[index];
    const isSelected = index === normalizedNextIndex;
    const offset = getDeckCarouselOffset(index, normalizedNextIndex, itemCount);
    const visibleOffset = getVisibleMobileDeckOffset(offset);

    Array.from(item.classList)
      .filter((className) => className.startsWith("deck-mobile-shelf__item--offset-"))
      .forEach((className) => item.classList.remove(className));

    item.classList.add(getMobileDeckOffsetClass(visibleOffset));
    item.classList.toggle("is-selected", isSelected);
    item.dataset.mobileDeckOffset = String(offset);
    item.setAttribute("aria-pressed", isSelected ? "true" : "false");

    if (collection) {
      item.setAttribute(
        "aria-label",
        isSelected
          ? `Open focused view for ${collection.title}`
          : `Bring ${collection.title} forward`
      );
    }
  });

  return true;
}

function renderMobileDeckShelf(section, sectionCollections, activeIndex) {
  return `
    <div class="deck-mobile-browser" data-mobile-deck-browser>
      <div class="deck-mobile-browser__heading">
        <h3>${escapeHtml(section.title)}</h3>
        <p>Tap a side deck to center it. Tap the center deck to bring it forward.</p>
      </div>
      <div class="deck-mobile-shelf" aria-label="${escapeHtml(`${section.title} deck shelf`)}">
        ${sectionCollections
          .map((collection, index) => renderMobileDeckShelfItem(collection, section.id, index, activeIndex, sectionCollections.length))
          .join("")}
      </div>
    </div>
  `;
}

function renderDeckSectionIntro(section) {
  return section.intro || section.note ? `
    <div class="deck-library-section__intro">
      ${section.intro ? `<p>${escapeHtml(section.intro)}</p>` : ""}
      ${section.note ? `<small>${escapeHtml(section.note)}</small>` : ""}
    </div>
  ` : "";
}

function renderDeckFocusedCarousel(section, sectionCollections) {
  const itemCount = sectionCollections.length;
  const emptyMessage = section.emptyMessage || getDeckFilterEmptyMessage();

  if (!itemCount) {
    return `
      <section class="deck-library-section deck-library-section--carousel" aria-labelledby="deck-library-${escapeHtml(section.id)}" data-deck-carousel-section="${escapeHtml(section.id)}">
        <div class="deck-library-section__header">
          <span aria-hidden="true"></span>
          <h2 id="deck-library-${escapeHtml(section.id)}">${escapeHtml(section.title)}</h2>
          <span aria-hidden="true"></span>
        </div>
        ${renderDeckSectionIntro(section)}
        <div class="deck-focused-carousel deck-focused-carousel--empty" data-deck-carousel="${escapeHtml(section.id)}" role="status" aria-live="polite">
          <div class="deck-empty-state">
            <p>${escapeHtml(emptyMessage.title)}</p>
            <small>${escapeHtml(emptyMessage.note)}</small>
          </div>
        </div>
      </section>
    `;
  }

  const activeIndex = getDeckCarouselIndex(section.id, sectionCollections.length);
  const activeCollection = sectionCollections[activeIndex];
  const hasMultipleItems = itemCount > 1;
  const hasSidePair = itemCount > 2;
  const previousIndex = hasSidePair ? (activeIndex - 1 + itemCount) % itemCount : -1;
  const nextIndex = hasMultipleItems ? (activeIndex + 1) % itemCount : -1;
  const previousCollection = hasSidePair ? getDeckCarouselItem(sectionCollections, activeIndex, -1) : null;
  const nextCollection = hasMultipleItems ? getDeckCarouselItem(sectionCollections, activeIndex, 1) : null;
  const carouselModifier = itemCount === 1
    ? " deck-focused-carousel--single"
    : itemCount === 2
      ? " deck-focused-carousel--pair"
      : "";
  const activeIdClass = getCollectionIdClass(activeCollection);
  const focusModifier = activeIdClass ? ` deck-focused-carousel__focus--${activeIdClass}` : "";
  const mobileModeClass = mobileDeckViewMode === "focused" ? " is-mobile-focused" : " is-mobile-browsing";

  deckCarouselIndexes[section.id] = activeIndex;

  return `
    <section class="deck-library-section deck-library-section--carousel${mobileModeClass}" aria-labelledby="deck-library-${escapeHtml(section.id)}" data-deck-carousel-section="${escapeHtml(section.id)}">
      <div class="deck-library-section__header">
        <span aria-hidden="true"></span>
        <h2 id="deck-library-${escapeHtml(section.id)}">${escapeHtml(section.title)}</h2>
        <span aria-hidden="true"></span>
      </div>
      ${renderDeckSectionIntro(section)}
      ${renderMobileDeckShelf(section, sectionCollections, activeIndex)}
      <button class="deck-mobile-focused-back" type="button" data-mobile-back-to-decks>
        <span aria-hidden="true">‹</span>
        Back to Decks
      </button>
      <div class="deck-focused-carousel${carouselModifier}" data-deck-carousel="${escapeHtml(section.id)}" aria-roledescription="${hasMultipleItems ? "carousel" : "group"}" aria-label="${escapeHtml(section.title)}">
        ${hasMultipleItems ? `<button class="deck-focused-carousel__nav deck-focused-carousel__nav--prev" type="button" data-deck-carousel-nav="${escapeHtml(section.id)}" data-deck-carousel-direction="prev" aria-label="Previous deck"></button>` : ""}
        <div class="deck-focused-carousel__stage">
          ${renderDeckCarouselPreview(previousCollection, section.id, previousIndex, "prev")}
          <div class="deck-focused-carousel__focus${escapeHtml(focusModifier)}" aria-live="polite">
            ${renderDeckCollectionCard(activeCollection, {
              extraClass: "is-carousel-focus",
              includeCardDeckTrigger: false,
              showTitle: false,
              showDescription: false,
              labelText: getCarouselDeckLabel(activeCollection),
              intentionText: getCarouselDeckIntention(activeCollection)
            })}
            <span class="deck-focus-pedestal" aria-hidden="true"></span>
          </div>
          ${renderDeckCarouselPreview(nextCollection, section.id, nextIndex, "next")}
        </div>
        ${hasMultipleItems ? `<button class="deck-focused-carousel__nav deck-focused-carousel__nav--next" type="button" data-deck-carousel-nav="${escapeHtml(section.id)}" data-deck-carousel-direction="next" aria-label="Next deck"></button>` : ""}
        ${hasMultipleItems ? `
          <div class="deck-focused-carousel__meta" aria-label="Deck carousel position">
            <span>${activeIndex + 1} of ${itemCount}</span>
            <div class="deck-focused-carousel__dots">
              ${sectionCollections.map((collection, index) => `
                <button class="deck-focused-carousel__dot${index === activeIndex ? " is-active" : ""}" type="button" data-deck-carousel-focus="${escapeHtml(section.id)}" data-deck-carousel-index="${index}" aria-label="Focus ${escapeHtml(collection.title)}" aria-current="${index === activeIndex ? "true" : "false"}"></button>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

function getFilteredDeckCollections() {
  if (typeof deckCollections === "undefined") {
    return [];
  }

  if (activeDeckFilter === "All") {
    return deckCollections;
  }

  const activeFilterKey = normalizeDeckFilter(activeDeckFilter);
  return deckCollections.filter((collection) => getCollectionFilterTags(collection).has(activeFilterKey));
}

function renderDeckLibrarySections() {
  const filteredCollections = getFilteredDeckCollections();
  const section = {
    id: DECK_BROWSER_SECTION_ID,
    title: getDeckFilterTitle(),
    emptyMessage: getDeckFilterEmptyMessage()
  };

  return renderDeckFocusedCarousel(section, filteredCollections);
}

function renderBloodMoonLockedPrompt() {
  if (!deckView) {
    return;
  }

  const collection = getCollectionById("bloodMoon");

  updateDeckHero({
    eyebrow: collection?.eyebrow || "Crimson Veil",
    title: collection?.title || "Blood Moon Deck",
    description: "A sealed crimson collection waits at the edge of the Astral Veil."
  });
  hideDeckHeroStatus();
  setDeckRitualFeatureVisible(false);

  deckView.innerHTML = `
    <section class="deck-lock-panel deck-lock-panel--bloodMoon" aria-labelledby="blood-moon-deck-lock-title">
      <span class="deck-lock-panel__eyebrow">Deck Sealed</span>
      <h2 id="blood-moon-deck-lock-title">The Blood Moon Deck is sealed.</h2>
      <p>
        The Blood Moon deck can only be viewed while Blood Moon mode is active.
      </p>
      <div class="deck-lock-panel__actions">
        <button class="deck-lock-panel__button deck-lock-panel__button--ghost" type="button" data-back-to-decks>
          Return to Decks
        </button>
      </div>
    </section>
  `;

  scrollToDeckPageTop();
}

async function hydrateDeckAuthState() {
  try {
    const { getCurrentUser } = await import("../src/services/auth.js");
    const { user, error } = await getCurrentUser();

    if (error) {
      console.error("Unable to check deck auth state:", error);
    }

    deckAuthState = {
      checked: true,
      user: user || null
    };
  } catch (error) {
    console.error("Unable to load deck auth helper:", error);
    deckAuthState = {
      checked: true,
      user: null
    };
  }
}

async function initializeDeckAccess() {
  renderDeckAccessLoading();
  await hydrateDeckAuthState();
  renderDeckCollection();
}

// Renders the deck-selection rail and handles locked deck messaging through delegated clicks.
function renderDeckCollection() {
  if (!deckView || typeof deckCollections === "undefined") {
    return;
  }

  updateDeckHero({
    eyebrow: "Deck Collection",
    title: "The Astral Decks",
    description: "Choose a tarot collection to explore the cards held within the Astral Veil."
  });
  setDeckHeroVisible(true);
  updateDeckHeroStatus();
  setDeckRitualFeatureVisible(true);

  deckView.innerHTML = `
    <div class="deck-collection-shell">
      ${renderDeckFilterControls()}
      ${renderDeckLibrarySections()}
    </div>
    <p class="deck-collection-message" data-deck-message aria-live="polite"></p>
  `;

  window.requestAnimationFrame(() => centerActiveDeckFilter({ behavior: "auto" }));
}

// Renders the large selected-card-left, meaning-panel-right viewer and bottom thumbnail rail.
function renderDeckGallery(collectionId) {
  if (!deckView || typeof tarotDeck === "undefined" || typeof deckCollections === "undefined") {
    return;
  }

  const collection = getCollectionById(collectionId);

  if (!collection || isCollectionLocked(collection)) {
    if (isBloodMoonCollection(collection)) {
      renderBloodMoonLockedPrompt();
      return;
    }

    renderDeckCollection();
    return;
  }

  activeCollectionId = collection.id;
  const collectionCards = getCollectionCards(collection);
  activeCardIndex = Math.min(Math.max(activeCardIndex, 0), collectionCards.length - 1);
  const activeCard = collectionCards[activeCardIndex];
  const cardDescription = getCardDescription(activeCard);
  const isProtectedDeckMedia = isBloodMoonCollection(collection);
  const protectedMediaClass = isProtectedDeckMedia ? " protected-media" : "";
  const protectedMediaAttrs = isProtectedDeckMedia ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = ' draggable="false"';

  if (!activeCard) {
    renderDeckCollection();
    return;
  }

  preloadAdjacentCards(collectionCards, activeCardIndex);

  const deckHeroTitle = collection?.viewTitle || collection?.title || collection?.name || collection?.eyebrow || "The Astral Deck";
  const deckHeroDescription =
    collection?.viewDescription || collection?.detailDescription || collection?.description || collection?.subtitle || "";

  updateDeckHero({
    eyebrow: collection.eyebrow,
    title: deckHeroTitle,
    description: deckHeroDescription
  });
  hideDeckHeroStatus();
  setDeckHeroVisible(false);
  setDeckRitualFeatureVisible(false);

  deckView.innerHTML = `
    <section class="deck-viewer deck-viewer--${escapeHtml(collection.id)} ${getDeckDetailThemeClass(collection)}" data-card-gallery aria-label="${escapeHtml(collection.title)} card viewer">
      <div class="deck-viewer__topbar">
        <button class="deck-back-button" type="button" data-back-to-decks>
          <span aria-hidden="true">‹</span>
          Back to Decks
        </button>
        <p class="deck-viewer__counter" aria-label="Card ${activeCardIndex + 1} of ${collectionCards.length}">
          <span aria-hidden="true">✦</span>
          ${activeCardIndex + 1} OF ${collectionCards.length}
          <span aria-hidden="true">✦</span>
        </p>
        <span class="deck-viewer__sigil" aria-hidden="true">✶</span>
      </div>
      <div class="deck-viewer__stage">
        <figure class="deck-viewer__card-panel">
        <button class="deck-viewer__image-button deck-card-tilt${protectedMediaClass}" type="button" data-featured-card-image="${escapeHtml(activeCard.id)}" data-tilt-card aria-label="Expand ${escapeHtml(activeCard.name)}"${protectedMediaAttrs}>
          <span class="deck-viewer__image-clip">
            <img
              class="deck-viewer__image"
              src="${escapeHtml(activeCard.image)}"
              alt="${escapeHtml(activeCard.name)}"
              width="${DECK_CARD_IMAGE_WIDTH}"
              height="${DECK_CARD_IMAGE_HEIGHT}"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              ${protectedImageAttr}
            />
          </span>
          <span class="deck-card-shine" aria-hidden="true"></span>
        </button>
        <figcaption class="deck-viewer__tilt-hint">
          <span aria-hidden="true">↻</span>
          Drag to tilt
        </figcaption>
        </figure>

        <div class="deck-viewer__content">
          <p class="deck-viewer__deck-label">${escapeHtml(collection.title || collection.name || "Astral Veil")}</p>
          <p class="deck-viewer__arcana-label">Major Arcana</p>
          <h2>${escapeHtml(activeCard.name)}</h2>
          <p>${escapeHtml(cardDescription)}</p>
          ${renderDeckKeywords(activeCard)}
          ${renderDeckCardMeanings(activeCard)}
        </div>
      </div>

      <div class="deck-viewer__rail-wrap">
        <button class="deck-viewer__nav" type="button" data-deck-viewer-nav="prev" aria-label="Previous card">
          ‹
        </button>
        <div class="deck-thumbnail-rail" aria-label="Select a card">
          ${collectionCards
            .map(
              (card, index) => {
                const shouldLoadThumbnail =
                  index <= 11 || Math.abs(index - activeCardIndex) <= 6;

                return `
                <button class="deck-thumbnail${index === activeCardIndex ? " is-active" : ""}${protectedMediaClass}" type="button" data-card-index="${index}" aria-label="Show ${escapeHtml(card.name)}" aria-current="${index === activeCardIndex ? "true" : "false"}"${protectedMediaAttrs}>
                  <span class="deck-thumbnail__image-clip">
                    <img
                      src="${shouldLoadThumbnail ? escapeHtml(card.image) : thumbnailPlaceholder}"
                      ${shouldLoadThumbnail ? "" : `data-thumbnail-src="${escapeHtml(card.image)}"`}
                      alt=""
                      width="${DECK_CARD_IMAGE_WIDTH}"
                      height="${DECK_CARD_IMAGE_HEIGHT}"
                      loading="lazy"
                      decoding="async"
                      ${protectedImageAttr}
                    />
                  </span>
                  <span class="deck-thumbnail__index">${index + 1}</span>
                </button>
              `;
              }
            )
            .join("")}
        </div>
        <button class="deck-viewer__nav" type="button" data-deck-viewer-nav="next" aria-label="Next card">
          ›
        </button>
      </div>
    </section>
  `;

  deckView.querySelector(".deck-thumbnail.is-active")?.scrollIntoView({
    block: "nearest",
    inline: "center"
  });
  initializeThumbnailLazyLoading();
  initializeDeckCardTilt();
}

// Updates the selected card and re-renders the viewer while preserving the active deck collection.
function selectDeckCard(index) {
  const activeCollection = getCollectionById(activeCollectionId);
  const cards = getCollectionCards(activeCollection);

  if (!cards.length) {
    return;
  }

  activeCardIndex = (index + cards.length) % cards.length;
  renderDeckGallery(activeCollectionId);
}

function selectDeckThumbnailCard(index) {
  selectDeckCard(index);

  if (isSmallDeckViewport()) {
    scrollToDeckPageTop();
  }
}

function moveDeckCard(direction) {
  selectDeckCard(activeCardIndex + (direction === "next" ? 1 : -1));
}

function openDeckLightbox(cardId) {
  if (typeof deckCollections === "undefined") {
    return;
  }

  const activeCollection = getCollectionById(activeCollectionId) || deckCollections[0];

  if (isCollectionLocked(activeCollection)) {
    closeDeckLightbox();
    return;
  }

  const card = getCollectionCards(activeCollection).find((item) => item.id === cardId);

  if (!card || !deckLightbox) {
    return;
  }

  lightboxCardImage.src = card.image;
  lightboxCardImage.alt = card.name;
  lightboxCardImage.dataset.imagePreviewTitle = card.name;
  lightboxCardImage.dataset.imagePreviewCaption = getCardDescription(card);
  lightboxCardImage.draggable = !isBloodMoonCollection(activeCollection);
  lightboxCardImage.classList.toggle("protected-media", isBloodMoonCollection(activeCollection));
  if (isBloodMoonCollection(activeCollection)) {
    lightboxCardImage.setAttribute("data-protected-media", "true");
  } else {
    lightboxCardImage.removeAttribute("data-protected-media");
  }
  lightboxCardName.textContent = card.name;
  lightboxCardMeaning.textContent = getCardDescription(card);
  deckLightbox.classList.add("is-open");
  deckLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
}

function closeDeckLightbox() {
  if (!deckLightbox) {
    return;
  }

  deckLightbox.classList.remove("is-open");
  deckLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
}

function openDeckInfoModal(collectionId) {
  const collection = getCollectionById(collectionId);

  if (!collection || !deckInfoModal) {
    return;
  }

  const isLocked = isCollectionLocked(collection);
  const isComingSoon = collection.accessType === "comingSoon";
  const category = getCollectionModalCategory(collection);
  const status = getCollectionModalStatus(collection);
  const previewImage = getCollectionModalCardBack(collection);
  const modalThemeClass = getDeckInfoModalThemeClass(collection);
  const isProtectedDeckMedia = isBloodMoonCollection(collection);

  activeDeckInfoCollectionId = collection.id;
  deckInfoModal.classList.remove(...deckInfoModalThemeClasses);
  deckInfoModal.classList.add(modalThemeClass);
  resetDeckInfoTilt();

  if (deckInfoImage) {
    deckInfoImage.src = previewImage;
    deckInfoImage.alt = `${getCollectionModalTitle(collection)} card back`;
    deckInfoImage.draggable = !isProtectedDeckMedia;
    deckInfoImage.classList.toggle("protected-media", isProtectedDeckMedia);
    if (isProtectedDeckMedia) {
      deckInfoImage.setAttribute("data-protected-media", "true");
    } else {
      deckInfoImage.removeAttribute("data-protected-media");
    }
  }

  if (deckInfoTiltButton) {
    deckInfoTiltButton.setAttribute("aria-label", `Inspect ${getCollectionModalTitle(collection)} card`);
    deckInfoTiltButton.draggable = !isProtectedDeckMedia;
    deckInfoTiltButton.classList.toggle("protected-media", isProtectedDeckMedia);
    if (isProtectedDeckMedia) {
      deckInfoTiltButton.setAttribute("data-protected-media", "true");
    } else {
      deckInfoTiltButton.removeAttribute("data-protected-media");
    }
  }

  if (deckInfoCategory) {
    deckInfoCategory.textContent = category;
  }

  if (deckInfoTitle) {
    deckInfoTitle.textContent = getCollectionModalTitle(collection);
    deckInfoTitle.classList.toggle("deck-title--cyber-hacked", collection.id === "cyberpunkArcana");
  }

  if (deckInfoIntro) {
    deckInfoIntro.textContent = getCollectionModalIntro(collection);
  }

  setDeckInfoParagraph(deckInfoAbout, getCollectionModalAbout(collection));
  setDeckInfoParagraph(deckInfoReveals, getCollectionModalReveals(collection));

  if (deckInfoBestFor) {
    deckInfoBestFor.innerHTML = getCollectionBestFor(collection)
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join("");
  }

  if (deckInfoStatus) {
    deckInfoStatus.textContent = status || "";
  }

  if (deckInfoViewButton) {
    const isBloodMoonLocked = isBloodMoonCollection(collection) && isLocked;
    const shouldHideButton = isLocked && !isComingSoon && !isBloodMoonLocked && !isAuthLockedCollection(collection);

    deckInfoViewButton.hidden = shouldHideButton;
    deckInfoViewButton.disabled = isComingSoon || shouldHideButton || isBloodMoonLocked;
    deckInfoViewButton.textContent = getCollectionActionLabel(collection) || "View Deck";
  }

  deckInfoModal.classList.add("is-open");
  deckInfoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-deck-info-open");
  window.requestAnimationFrame(() => deckInfoModal.querySelector(".deck-info-modal__close")?.focus({ preventScroll: true }));
}

function closeDeckInfoModal() {
  if (!deckInfoModal) {
    return;
  }

  activeDeckInfoCollectionId = "";
  resetDeckInfoTilt();
  deckInfoModal.classList.remove("is-open");
  deckInfoModal.classList.remove(...deckInfoModalThemeClasses);
  deckInfoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-deck-info-open");
}

////////////////////////////////////////////////////
// Deck Viewer Event Listeners
////////////////////////////////////////////////////

// Delegated click handling covers collection cards, thumbnail rail, nav controls, and image expansion.
if (deckView) {
  deckView.addEventListener("pointerdown", (event) => {
    const mobileShelf = event.target.closest(".deck-mobile-shelf");

    if (!mobileShelf || !isSmallDeckViewport()) {
      return;
    }

    mobileDeckSwipeStartX = event.clientX;
    mobileDeckSwipeStartY = event.clientY;
    mobileDeckDidSwipe = false;
  });

  deckView.addEventListener("pointerup", (event) => {
    const mobileShelf = event.target.closest(".deck-mobile-shelf");

    if (!mobileShelf || !isSmallDeckViewport() || mobileDeckSwipeStartX === null || mobileDeckSwipeStartY === null) {
      mobileDeckSwipeStartX = null;
      mobileDeckSwipeStartY = null;
      return;
    }

    const deltaX = event.clientX - mobileDeckSwipeStartX;
    const deltaY = event.clientY - mobileDeckSwipeStartY;
    mobileDeckSwipeStartX = null;
    mobileDeckSwipeStartY = null;

    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    mobileDeckDidSwipe = true;
    const direction = deltaX < 0 ? 1 : -1;
    const nextIndex = Number(deckCarouselIndexes[DECK_BROWSER_SECTION_ID] || 0) + direction;

    if (!updateMobileDeckShelfPosition(DECK_BROWSER_SECTION_ID, nextIndex)) {
      deckCarouselIndexes[DECK_BROWSER_SECTION_ID] = nextIndex;
      mobileDeckViewMode = "browse";
      renderDeckCollection();
    }
  });

  deckView.addEventListener("click", (event) => {
    const deckDetailsTrigger = event.target.closest("[data-deck-details]");
    const mobileDeckFocusButton = event.target.closest("[data-mobile-deck-focus]");
    const mobileDeckBackButton = event.target.closest("[data-mobile-back-to-decks]");
    const deckCarouselNavButton = event.target.closest("[data-deck-carousel-nav]");
    const deckCarouselFocusButton = event.target.closest("[data-deck-carousel-focus]");
    const deckTrigger = event.target.closest("[data-view-deck]");
    const filterTrigger = event.target.closest("[data-deck-filter]");
    const filterNavButton = event.target.closest("[data-deck-filter-nav]");
    const backButton = event.target.closest("[data-back-to-decks]");
    const thumbnailButton = event.target.closest("[data-card-index]");
    const viewerNavButton = event.target.closest("[data-deck-viewer-nav]");
    const featuredCardButton = event.target.closest("[data-featured-card-image]");

    if (mobileDeckDidSwipe) {
      mobileDeckDidSwipe = false;
      event.preventDefault();
      return;
    }

    if (deckDetailsTrigger) {
      event.stopPropagation();
      openDeckInfoModal(deckDetailsTrigger.dataset.deckDetails);
      return;
    }

    if (mobileDeckFocusButton) {
      const sectionId = mobileDeckFocusButton.dataset.mobileDeckFocus || DECK_BROWSER_SECTION_ID;
      const nextIndex = Number(mobileDeckFocusButton.dataset.deckCarouselIndex || 0);
      const currentIndex = getDeckCarouselIndex(sectionId, getFilteredDeckCollections().length);

      if (nextIndex !== currentIndex) {
        if (!updateMobileDeckShelfPosition(sectionId, nextIndex)) {
          deckCarouselIndexes[sectionId] = nextIndex;
          mobileDeckViewMode = "browse";
          renderDeckCollection();
        }
        return;
      }

      deckCarouselIndexes[sectionId] = nextIndex;
      mobileDeckViewMode = "focused";
      renderDeckCollection();
      window.requestAnimationFrame(() => {
        deckView.querySelector(`[data-deck-carousel-section="${sectionId}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
      return;
    }

    if (mobileDeckBackButton) {
      mobileDeckViewMode = "browse";
      renderDeckCollection();
      window.requestAnimationFrame(() => {
        deckView.querySelector("[data-mobile-deck-browser]")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
      return;
    }

    if (deckCarouselNavButton) {
      const sectionId = deckCarouselNavButton.dataset.deckCarouselNav || DECK_BROWSER_SECTION_ID;
      const direction = deckCarouselNavButton.dataset.deckCarouselDirection === "prev" ? -1 : 1;
      deckCarouselIndexes[sectionId] = Number(deckCarouselIndexes[sectionId] || 0) + direction;
      if (isSmallDeckViewport()) {
        mobileDeckViewMode = "focused";
      }
      renderDeckCollection();
      return;
    }

    if (deckCarouselFocusButton) {
      const sectionId = deckCarouselFocusButton.dataset.deckCarouselFocus || DECK_BROWSER_SECTION_ID;
      deckCarouselIndexes[sectionId] = Number(deckCarouselFocusButton.dataset.deckCarouselIndex || 0);
      if (isSmallDeckViewport()) {
        mobileDeckViewMode = "focused";
      }
      renderDeckCollection();
      return;
    }

    if (filterNavButton) {
      moveDeckFilter(filterNavButton.dataset.deckFilterNav);
      return;
    }

    if (filterTrigger) {
      setDeckFilter(filterTrigger.dataset.deckFilter || "All");
      return;
    }

    if (deckTrigger) {
      const collection = getCollectionById(deckTrigger.dataset.viewDeck);

      if (collection && isCollectionLocked(collection)) {
        if (isBloodMoonCollection(collection)) {
          showDeckMessage(collection.lockedMessage || "Available only during Blood Moon.");
          return;
        }

        if (isAuthLockedCollection(collection)) {
          window.location.href = getDeckAuthUrl(collection.authMode || "signup");
          return;
        }

        showDeckMessage(collection.lockedMessage || "This deck is locked.");
        return;
      }

      activeCardIndex = 0;
      renderDeckGallery(deckTrigger.dataset.viewDeck);
      scrollToDeckPageTop();
      return;
    }

    if (backButton) {
      closeDeckLightbox();
      activeCollectionId = "original";
      activeCardIndex = 0;
      renderDeckCollection();
      return;
    }

    if (viewerNavButton) {
      moveDeckCard(viewerNavButton.dataset.deckViewerNav);
      return;
    }

    if (thumbnailButton) {
      selectDeckThumbnailCard(Number(thumbnailButton.dataset.cardIndex));
      return;
    }

    if (featuredCardButton) {
      openDeckLightbox(featuredCardButton.dataset.featuredCardImage);
    }
  });
}

closeDeckLightboxButtons.forEach((button) => {
  button.addEventListener("click", closeDeckLightbox);
});

closeDeckInfoButtons.forEach((button) => {
  button.addEventListener("click", closeDeckInfoModal);
});

if (deckInfoTiltButton) {
  deckInfoTiltButton.addEventListener("pointerdown", startDeckInfoTilt);
  deckInfoTiltButton.addEventListener("pointermove", updateDeckInfoTilt);
  deckInfoTiltButton.addEventListener("pointerleave", resetDeckInfoTilt);
  deckInfoTiltButton.addEventListener("pointercancel", endDeckInfoTilt);
  deckInfoTiltButton.addEventListener("pointerup", endDeckInfoTilt);
}

deckInfoViewButton?.addEventListener("click", () => {
  const collection = getCollectionById(activeDeckInfoCollectionId);

  if (!collection) {
    closeDeckInfoModal();
    return;
  }

  if (isCollectionLocked(collection)) {
    closeDeckInfoModal();

    if (isBloodMoonCollection(collection)) {
      showDeckMessage(collection.lockedMessage || "Available only during Blood Moon.");
      return;
    }

    if (isAuthLockedCollection(collection)) {
      window.location.href = getDeckAuthUrl(collection.authMode || "signup");
      return;
    }

    showDeckMessage(collection.lockedMessage || "This deck is locked.");
    return;
  }

  closeDeckInfoModal();
  activeCardIndex = 0;
  renderDeckGallery(collection.id);
  scrollToDeckPageTop();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDeckLightbox();
    closeDeckInfoModal();
  }

  if (!deckLightbox?.classList.contains("is-open") && deckView?.querySelector("[data-card-gallery]")) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveDeckCard("prev");
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveDeckCard("next");
    }
  }
});

window.addEventListener("astralVeilBloodMoonChange", () => {
  closeDeckLightbox();

  if (activeCollectionId === "bloodMoon") {
    if (canViewBloodMoonDeck()) {
      renderDeckGallery("bloodMoon");
      return;
    }

    activeCollectionId = "original";
    activeCardIndex = 0;
    renderDeckCollection();
    return;
  }

  renderDeckCollection();
});

initializeDeckAccess();
