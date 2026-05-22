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
          <div class="deck-viewer__controls" aria-label="Browse cards">
            <button class="deck-viewer__nav" type="button" data-deck-viewer-nav="prev">
              &larr; Previous
            </button>
            <button class="deck-viewer__nav" type="button" data-deck-viewer-nav="next">
              Next &rarr;
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
