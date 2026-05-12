const deckGallery = document.querySelector("[data-deck-gallery]");
const deckLightbox = document.querySelector("[data-deck-lightbox]");
const lightboxCardImage = document.querySelector("[data-lightbox-card-image]");
const lightboxCardName = document.querySelector("[data-lightbox-card-name]");
const lightboxCardMeaning = document.querySelector("[data-lightbox-card-meaning]");
const closeDeckLightboxButtons = document.querySelectorAll("[data-close-deck-lightbox]");

function renderDeckGallery() {
  if (!deckGallery || typeof tarotDeck === "undefined") {
    return;
  }

  deckGallery.innerHTML = tarotDeck
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
    .join("");
}

function openDeckLightbox(cardId) {
  const card = tarotDeck.find((item) => item.id === cardId);

  if (!card || !deckLightbox) {
    return;
  }

  lightboxCardImage.src = card.image;
  lightboxCardImage.alt = card.name;
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

renderDeckGallery();

if (deckGallery) {
  deckGallery.addEventListener("click", (event) => {
    const deckCard = event.target.closest("[data-card-id]");

    if (deckCard) {
      openDeckLightbox(deckCard.dataset.cardId);
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
