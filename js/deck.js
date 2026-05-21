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
let deckMessageTimeout = null;

function isDeckEventActive(eventId) {
  if (!eventId) {
    return false;
  }

  return Boolean(window.AstralVeilEvents?.isEventActive(eventId));
}

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
              <article class="deck-collection-card${isCollectionLocked(collection) ? " is-locked" : ""}" data-view-deck="${collection.id}" aria-disabled="${isCollectionLocked(collection)}">
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
                    <button class="deck-collection-card__action" type="button" data-view-deck="${collection.id}">
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
    <div class="deck-gallery" data-card-gallery>
      ${collectionCards
        .map(
          (card) => `
            <button class="deck-card" type="button" data-card-id="${card.id}">
              <img src="${card.image}" alt="${card.name}" loading="lazy" decoding="async" />
              <div class="deck-card__content">
                <h2>${card.name}</h2>
                <p>${card.meaning}</p>
              </div>
            </button>
          `
        )
        .join("")}
    </div>
  `;
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
  lightboxCardImage.dataset.imagePreviewCaption = card.meaning;
  lightboxCardName.textContent = card.name;
  lightboxCardMeaning.textContent = card.meaning;
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

if (deckView) {
  deckView.addEventListener("click", (event) => {
    const deckTrigger = event.target.closest("[data-view-deck]");
    const backButton = event.target.closest("[data-back-to-decks]");
    const cardButton = event.target.closest("[data-card-id]");

    if (deckTrigger) {
      const collection = getCollectionById(deckTrigger.dataset.viewDeck);

      if (collection && isCollectionLocked(collection)) {
        showDeckMessage(collection.lockedMessage || "This deck is locked.");
        return;
      }

      renderDeckGallery(deckTrigger.dataset.viewDeck);
      return;
    }

    if (backButton) {
      closeDeckLightbox();
      activeCollectionId = "original";
      renderDeckCollection();
      return;
    }

    if (cardButton) {
      openDeckLightbox(cardButton.dataset.cardId);
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
});

window.addEventListener("astralVeilBloodMoonChange", (event) => {
  if (event.detail.isActive) {
    renderDeckCollection();
    return;
  }

  closeDeckLightbox();
  activeCollectionId = "original";
  renderDeckCollection();
});
