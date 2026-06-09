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

let activeCollectionId = "original";
let activeDeckFilter = "All";
let activeCardIndex = 0;
let deckMessageTimeout = null;
let deckAuthState = {
  checked: false,
  user: null
};
const DECK_CARD_IMAGE_WIDTH = 800;
const DECK_CARD_IMAGE_HEIGHT = 1200;
const thumbnailPlaceholder =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const deckLibraryFilters = ["All", "Lumen", "Blood Moon", "Event Decks", "Member Decks", "Lore"];
const deckLibrarySections = [
  {
    id: "free",
    title: "Free Decks"
  },
  {
    id: "unlockable",
    title: "Unlockable Decks"
  },
  {
    id: "purchasable",
    title: "Purchasable Decks"
  }
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
  return isDeckUserAuthenticated() || isDeckEventActive("bloodMoon") || document.body.classList.contains("blood-moon-mode");
}

// Central lock check for free, event, purchased, premium, and coming-soon collections.
function isCollectionLocked(collection) {
  if (!collection) {
    return true;
  }

  if (isBloodMoonCollection(collection)) {
    return !canViewBloodMoonDeck();
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

function setDeckRitualFeatureVisible(isVisible) {
  if (deckRitualFeature) {
    deckRitualFeature.hidden = !isVisible;
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

function getCollectionTheme(collection) {
  return collection?.theme || collection?.id || "lumen";
}

function getCollectionStatus(collection) {
  if (isBloodMoonCollection(collection) && canViewBloodMoonDeck() && isDeckUserAuthenticated() && !isDeckEventActive("bloodMoon")) {
    return "Account Unlocked";
  }

  return isCollectionLocked(collection)
    ? collection.lockedStatus || "Locked"
    : collection.unlockedStatus || collection.status;
}

function getCollectionActionLabel(collection) {
  return isCollectionLocked(collection)
    ? collection.lockedActionLabel || "Locked"
    : collection.actionLabel;
}

function getDeckReturnToPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}` || "/deck.html";
}

function getDeckAuthUrl(mode = "login") {
  const params = new URLSearchParams({
    returnTo: getDeckReturnToPath()
  });

  if (mode === "signup") {
    params.set("mode", "signup");
  }

  return `auth.html?${params.toString()}`;
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
  return `
    <section class="deck-viewer__meaning-card deck-viewer__meaning-card--${escapeHtml(type)}">
      <div class="deck-viewer__meaning-heading">
        <span class="deck-viewer__meaning-icon">${getDeckMeaningIcon(type)}</span>
        <h3>${escapeHtml(title)}</h3>
      </div>
      <p>${escapeHtml(text)}</p>
    </section>
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
                ${escapeHtml(filter)}
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
  renderDeckCollection();
  window.requestAnimationFrame(() => centerActiveDeckFilter({ behavior }));
}

function moveDeckFilter(direction) {
  const currentIndex = deckLibraryFilters.indexOf(activeDeckFilter);
  const offset = direction === "next" ? 1 : -1;
  const nextIndex = (currentIndex + offset + deckLibraryFilters.length) % deckLibraryFilters.length;

  setDeckFilter(deckLibraryFilters[nextIndex]);
}

function renderDeckCollectionCard(collection) {
  const isLocked = isCollectionLocked(collection);
  const canOpenLockedPrompt = isBloodMoonCollection(collection);
  const status = getCollectionStatus(collection);
  const actionLabel = getCollectionActionLabel(collection);
  const category = getCollectionCategory(collection);
  const theme = getCollectionTheme(collection);

  return `
    <article class="deck-collection-card deck-collection-card--${escapeHtml(theme)}${isLocked ? " is-locked" : ""}" data-deck-card data-deck-category="${escapeHtml(category)}" data-view-deck="${escapeHtml(collection.id)}" aria-disabled="${isLocked}">
      <span class="deck-collection-card__badge">${escapeHtml(status)}</span>
      <div class="deck-collection-card__preview" aria-hidden="true">
        <img src="${escapeHtml(collection.coverImage)}" alt="" width="${DECK_CARD_IMAGE_WIDTH}" height="${DECK_CARD_IMAGE_HEIGHT}" loading="lazy" decoding="async" />
      </div>
      <div class="deck-collection-card__content">
        <p class="deck-collection-card__category">${escapeHtml(category)}</p>
        <h2>${escapeHtml(collection.title)}</h2>
        <p>${escapeHtml(collection.subtitle)}</p>
      </div>
      <div class="deck-collection-card__actions">
        <button class="deck-collection-card__action" type="button" data-view-deck="${escapeHtml(collection.id)}" ${isLocked && !canOpenLockedPrompt ? "disabled" : ""}>
          ${escapeHtml(actionLabel)}
        </button>
      </div>
    </article>
  `;
}

function getFilteredDeckCollections() {
  if (typeof deckCollections === "undefined") {
    return [];
  }

  if (activeDeckFilter === "All") {
    return deckCollections;
  }

  return deckCollections.filter((collection) => getCollectionCategory(collection) === activeDeckFilter);
}

function renderDeckLibrarySections() {
  const filteredCollections = getFilteredDeckCollections();

  return deckLibrarySections
    .map((section) => {
      const sectionCollections = filteredCollections.filter((collection) => getCollectionSection(collection) === section.id);

      if (!sectionCollections.length) {
        return "";
      }

      return `
        <section class="deck-library-section" aria-labelledby="deck-library-${escapeHtml(section.id)}">
          <div class="deck-library-section__header">
            <span aria-hidden="true"></span>
            <h2 id="deck-library-${escapeHtml(section.id)}">${escapeHtml(section.title)}</h2>
            <span aria-hidden="true"></span>
          </div>
          <div class="deck-collection" aria-label="${escapeHtml(section.title)}">
            ${sectionCollections.map(renderDeckCollectionCard).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderBloodMoonLockedPrompt() {
  if (!deckView) {
    return;
  }

  const collection = getCollectionById("bloodMoon");

  updateDeckHero({
    eyebrow: collection?.eyebrow || "Blood Moon Arcana",
    title: collection?.title || "Blood Moon Deck",
    description: "A sealed crimson collection waits at the edge of the Astral Veil."
  });
  setDeckRitualFeatureVisible(false);

  deckView.innerHTML = `
    <section class="deck-lock-panel deck-lock-panel--bloodMoon" aria-labelledby="blood-moon-deck-lock-title">
      <span class="deck-lock-panel__eyebrow">Deck Sealed</span>
      <h2 id="blood-moon-deck-lock-title">The Blood Moon Deck is sealed.</h2>
      <p>
        Create an account to study the Blood Moon deck at any time, or awaken Blood Moon through the hidden paths.
      </p>
      <div class="deck-lock-panel__actions">
        <a class="deck-lock-panel__button deck-lock-panel__button--primary" href="${escapeHtml(getDeckAuthUrl("signup"))}">
          Create Account
        </a>
        <a class="deck-lock-panel__button" href="${escapeHtml(getDeckAuthUrl("login"))}">
          Log In
        </a>
        <button class="deck-lock-panel__button deck-lock-panel__button--ghost" type="button" data-back-to-decks>
          Return to Deck
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

  if (!activeCard) {
    renderDeckCollection();
    return;
  }

  preloadAdjacentCards(collectionCards, activeCardIndex);

  updateDeckHero({
    eyebrow: collection.eyebrow,
    title: collection.viewTitle,
    description: collection.viewDescription
  });
  setDeckRitualFeatureVisible(false);

  deckView.innerHTML = `
    <div class="deck-view__toolbar">
      <button class="deck-back-button" type="button" data-back-to-decks>
        Back to Decks
      </button>
    </div>
    <section class="deck-viewer deck-viewer--${escapeHtml(collection.id)}" data-card-gallery aria-label="${escapeHtml(collection.title)} card viewer">
      <div class="deck-viewer__stage">
        <button class="deck-viewer__image-button" type="button" data-featured-card-image="${escapeHtml(activeCard.id)}" aria-label="Expand ${escapeHtml(activeCard.name)}">
          <img
            class="deck-viewer__image"
            src="${escapeHtml(activeCard.image)}"
            alt="${escapeHtml(activeCard.name)}"
            width="${DECK_CARD_IMAGE_WIDTH}"
            height="${DECK_CARD_IMAGE_HEIGHT}"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </button>

        <div class="deck-viewer__content">
          <p class="deck-viewer__counter">${activeCardIndex + 1} of ${collectionCards.length}</p>
          <h2>${escapeHtml(activeCard.name)}</h2>
          <p>${escapeHtml(cardDescription)}</p>
          ${renderDeckKeywords(activeCard)}
          ${renderDeckCardMeanings(activeCard)}
          <div class="deck-viewer__controls" aria-label="Browse cards">
            <button class="deck-viewer__nav" type="button" data-deck-viewer-nav="prev">
              ‹ Previous
            </button>
            <button class="deck-viewer__nav" type="button" data-deck-viewer-nav="next">
              Next ›
            </button>
          </div>
        </div>
      </div>

      <div class="deck-thumbnail-rail" aria-label="Select a card">
        ${collectionCards
          .map(
            (card, index) => {
              const shouldLoadThumbnail =
                index <= 11 || Math.abs(index - activeCardIndex) <= 6;

              return `
              <button class="deck-thumbnail${index === activeCardIndex ? " is-active" : ""}" type="button" data-card-index="${index}" aria-label="Show ${escapeHtml(card.name)}" aria-current="${index === activeCardIndex ? "true" : "false"}">
                <img
                  src="${shouldLoadThumbnail ? escapeHtml(card.image) : thumbnailPlaceholder}"
                  ${shouldLoadThumbnail ? "" : `data-thumbnail-src="${escapeHtml(card.image)}"`}
                  alt=""
                  width="${DECK_CARD_IMAGE_WIDTH}"
                  height="${DECK_CARD_IMAGE_HEIGHT}"
                  loading="lazy"
                  decoding="async"
                />
                <span>${index + 1}</span>
              </button>
            `;
            }
          )
          .join("")}
      </div>
    </section>
  `;

  deckView.querySelector(".deck-thumbnail.is-active")?.scrollIntoView({
    block: "nearest",
    inline: "center"
  });
  initializeThumbnailLazyLoading();
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

////////////////////////////////////////////////////
// Deck Viewer Event Listeners
////////////////////////////////////////////////////

// Delegated click handling covers collection cards, thumbnail rail, nav controls, and image expansion.
if (deckView) {
  deckView.addEventListener("click", (event) => {
    const deckTrigger = event.target.closest("[data-view-deck]");
    const filterTrigger = event.target.closest("[data-deck-filter]");
    const filterNavButton = event.target.closest("[data-deck-filter-nav]");
    const backButton = event.target.closest("[data-back-to-decks]");
    const thumbnailButton = event.target.closest("[data-card-index]");
    const viewerNavButton = event.target.closest("[data-deck-viewer-nav]");
    const featuredCardButton = event.target.closest("[data-featured-card-image]");

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
          activeCollectionId = collection.id;
          activeCardIndex = 0;
          renderBloodMoonLockedPrompt();
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDeckLightbox();
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
