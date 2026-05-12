const readersPageList = document.querySelector("[data-readers-page-list]");
const readerLightbox = document.querySelector("[data-reader-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxName = document.querySelector("[data-lightbox-name]");
const lightboxEnergy = document.querySelector("[data-lightbox-energy]");
const closeLightboxButtons = document.querySelectorAll("[data-close-lightbox]");

function renderReaderProfiles() {
  if (!readersPageList || typeof tarotReaders === "undefined") {
    return;
  }

  const allReaders = typeof mysteryReaders === "undefined"
    ? tarotReaders
    : [...tarotReaders, ...mysteryReaders];

  readersPageList.innerHTML = allReaders
    .map(
      (reader) => `
        <button class="reader-profile-card reader-profile-card--${reader.id}${reader.isMystery ? ` reader-profile-card--mystery reader-profile-card--${reader.mysteryAura}` : ""}" type="button" data-reader-id="${reader.id}">
          <img src="${reader.image}" alt="${reader.name}" loading="lazy" decoding="async" />
          <div class="reader-profile-card__content">
            ${reader.rarityLabel ? `<span class="reader-profile-card__badge">${reader.rarityLabel}</span>` : ""}
            <h2>${reader.name}</h2>
            <p>${reader.energy}</p>
            ${reader.encounterChance ? `<p class="reader-profile-card__chance">${reader.encounterChance}</p>` : ""}
            <p>${reader.backstory || "A trusted Astral Veil guide for reflective, atmospheric tarot readings."}</p>
          </div>
        </button>
      `
    )
    .join("");
}

function openReaderLightbox(readerId) {
  const allReaders = typeof mysteryReaders === "undefined"
    ? tarotReaders
    : [...tarotReaders, ...mysteryReaders];
  const reader = allReaders.find((item) => item.id === readerId);

  if (!reader || !readerLightbox) {
    return;
  }

  lightboxImage.src = reader.image;
  lightboxImage.alt = reader.name;
  lightboxName.textContent = reader.name;
  lightboxEnergy.textContent = reader.energy;
  readerLightbox.classList.add("is-open");
  readerLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
}

function closeReaderLightbox() {
  if (!readerLightbox) {
    return;
  }

  readerLightbox.classList.remove("is-open");
  readerLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
}

renderReaderProfiles();

if (readersPageList) {
  readersPageList.addEventListener("click", (event) => {
    const readerCard = event.target.closest("[data-reader-id]");

    if (readerCard) {
      openReaderLightbox(readerCard.dataset.readerId);
    }
  });
}

closeLightboxButtons.forEach((button) => {
  button.addEventListener("click", closeReaderLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeReaderLightbox();
  }
});
