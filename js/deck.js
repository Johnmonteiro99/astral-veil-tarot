const deckView = document.querySelector("[data-deck-view]");
const deckEyebrow = document.querySelector("[data-deck-eyebrow]");
const deckTitle = document.querySelector("[data-deck-title]");
const deckDescription = document.querySelector("[data-deck-description]");
const deckLightbox = document.querySelector("[data-deck-lightbox]");
const lightboxCardImage = document.querySelector("[data-lightbox-card-image]");
const lightboxCardName = document.querySelector("[data-lightbox-card-name]");
const lightboxCardMeaning = document.querySelector("[data-lightbox-card-meaning]");
const closeDeckLightboxButtons = document.querySelectorAll("[data-close-deck-lightbox]");

let activeCollectionId = "original";
let activeCardIndex = 0;
let deckMessageTimeout = null;
const thumbnailPlaceholder =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

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

// Central lock check for free, event, purchased, premium, and coming-soon collections.
function isCollectionLocked(collection) {
  if (!collection) {
    return true;
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

function getCollectionStatus(collection) {
  return isCollectionLocked(collection)
    ? collection.lockedStatus || "Locked"
    : collection.unlockedStatus || collection.status;
}

function getCollectionActionLabel(collection) {
  return isCollectionLocked(collection)
    ? collection.lockedActionLabel || "Locked"
    : collection.actionLabel;
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

  deckView.innerHTML = `
    <div class="deck-collection-shell">
      <div class="deck-collection" aria-label="Available tarot decks">
        ${deckCollections
          .map(
            (collection) => `
              <article class="deck-collection-card deck-collection-card--${collection.id}${isCollectionLocked(collection) ? " is-locked" : ""}" data-view-deck="${collection.id}" aria-disabled="${isCollectionLocked(collection)}">
                <div class="deck-collection-card__preview" aria-hidden="true">
                  <img src="${collection.coverImage}" alt="" loading="lazy" decoding="async" />
                </div>
                <div class="deck-collection-card__content">
                  <div class="deck-collection-card__header">
                    <span class="deck-collection-card__badge">${getCollectionStatus(collection)}</span>
                    <h2>${collection.title}</h2>
                    <p>${collection.subtitle}</p>
                  </div>
                  <div class="deck-collection-card__actions">
                    <button class="deck-collection-card__action" type="button" data-view-deck="${collection.id}" ${isCollectionLocked(collection) ? "disabled" : ""}>
                      ${getCollectionActionLabel(collection)}
                    </button>
                  </div>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
    <p class="deck-collection-message" data-deck-message aria-live="polite"></p>
  `;
}

// Renders the large selected-card-left, meaning-panel-right viewer and bottom thumbnail rail.
function renderDeckGallery(collectionId) {
  if (!deckView || typeof tarotDeck === "undefined" || typeof deckCollections === "undefined") {
    return;
  }

  const collection = getCollectionById(collectionId);

  if (!collection || isCollectionLocked(collection)) {
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
            loading="eager"
            decoding="async"
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

function moveDeckCard(direction) {
  selectDeckCard(activeCardIndex + (direction === "next" ? 1 : -1));
}

function openDeckLightbox(cardId) {
  if (typeof deckCollections === "undefined") {
    return;
  }

  const activeCollection = getCollectionById(activeCollectionId) || deckCollections[0];
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

renderDeckCollection();

////////////////////////////////////////////////////
// Deck Viewer Event Listeners
////////////////////////////////////////////////////

// Delegated click handling covers collection cards, thumbnail rail, nav controls, and image expansion.
if (deckView) {
  deckView.addEventListener("click", (event) => {
    const deckTrigger = event.target.closest("[data-view-deck]");
    const backButton = event.target.closest("[data-back-to-decks]");
    const thumbnailButton = event.target.closest("[data-card-index]");
    const viewerNavButton = event.target.closest("[data-deck-viewer-nav]");
    const featuredCardButton = event.target.closest("[data-featured-card-image]");

    if (deckTrigger) {
      const collection = getCollectionById(deckTrigger.dataset.viewDeck);

      if (collection && isCollectionLocked(collection)) {
        showDeckMessage(collection.lockedMessage || "This deck is locked.");
        return;
      }

      activeCardIndex = 0;
      renderDeckGallery(deckTrigger.dataset.viewDeck);
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
      selectDeckCard(Number(thumbnailButton.dataset.cardIndex));
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

window.addEventListener("astralVeilBloodMoonChange", (event) => {
  if (event.detail.isActive) {
    renderDeckCollection();
    return;
  }

  closeDeckLightbox();
  activeCollectionId = "original";
  activeCardIndex = 0;
  renderDeckCollection();
});
