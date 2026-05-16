const CARD_BACK_IMAGE = "assets/images/cards/original/card-back.jpg";
const BLOOD_MOON_CARD_BACK_IMAGE = "assets/images/cards/blood-moon/bloodmoon-card-back.png";

const readerList = document.querySelector("[data-reader-list]");
const readerSelection = document.querySelector("#reader-selection");
const readingStage = document.querySelector("[data-reading-stage]");
const activeReaderImage = document.querySelector("[data-active-reader-image]");
const activeReaderName = document.querySelector("[data-active-reader-name]");
const activeReaderEnergy = document.querySelector("[data-active-reader-energy]");
const readerIntroduction = document.querySelector("[data-reader-introduction]");
const readerPortraitFrame = document.querySelector(".reader-portrait-frame");
const spreadButtons = document.querySelectorAll("[data-spread]");
const readerNavButtons = document.querySelectorAll("[data-reader-nav]");
const newReadingButton = document.querySelector("[data-new-reading]");
const cardList = document.getElementById("deck-area");
const readingStatus = document.querySelector("[data-reading-status]");
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
const readingSectionScrollDelay = 450;

// TEMPORARY TESTING MODE: set to false to restore normal Mystery Reader odds.
const FORCE_ZEPHYRA_TEST = true;

let selectedReader = null;
let selectedReaderIndex = -1;
let selectedCardCount = 0;
let currentReadingCards = [];
let revealedCards = [];
let activeRevealedCardIndex = -1;
let readingSectionScrollTimeout = null;
let isRenderingReading = false;
let bloodMoonTimeout = null;

function activateBloodMoonEvent() {
  if (window.AstralVeilBloodMoon) {
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

function applyBloodMoonState() {
  if (window.AstralVeilBloodMoon) {
    window.AstralVeilBloodMoon.applyBloodMoonState();
  }
}

function isBloodMoonReadingActive() {
  return Boolean(selectedReader && selectedReader.isBloodMoon) || isBloodMoonActive();
}

function getActiveDeck() {
  if (isBloodMoonReadingActive() && typeof bloodMoonDeck !== "undefined") {
    return bloodMoonDeck.cards;
  }

  return tarotDeck;
}

function getActiveCardBackImage() {
  return isBloodMoonReadingActive() ? BLOOD_MOON_CARD_BACK_IMAGE : CARD_BACK_IMAGE;
}

function getCardMeaning(card) {
  if (card.bloodMoon && card.bloodMoon.upright) {
    const orientation = card.orientation === "reversed" ? "reversed" : "upright";

    return card.bloodMoon[orientation];
  }

  return card.meaning;
}

function prepareReadingCard(card) {
  if (!card.bloodMoon) {
    return card;
  }

  return {
    ...card,
    orientation: Math.random() < 0.5 ? "upright" : "reversed"
  };
}

function getCardOrientationLabel(card) {
  if (!card.bloodMoon) {
    return "";
  }

  return card.orientation === "reversed" ? " • Reversed" : " • Upright";
}

function renderReaders() {
  if (!readerList || typeof tarotReaders === "undefined") {
    return;
  }

  const visibleGuidePool = getVisibleGuidePool();
  const mysteryReaderCard = `
    <button class="reader-card reader-card--mystery" type="button" data-reader-id="mystery">
      <span class="reader-card__mystery-orb" aria-hidden="true">?</span>
      <span>
        <span class="reader-card__name">Mystery Reader</span>
        <span class="reader-card__energy">Let the veil choose from beyond the known path.</span>
      </span>
    </button>
  `;

  readerList.innerHTML =
    visibleGuidePool
    .map(
      (reader) => `
        <button class="reader-card" type="button" data-reader-id="${reader.id}">
          <img class="reader-card__image" src="${reader.image}" alt="${reader.name}" loading="lazy" decoding="async" />
          <span>
            <span class="reader-card__name">${reader.name}</span>
            <span class="reader-card__energy">${reader.energy}</span>
          </span>
        </button>
      `
    )
      .join("") + mysteryReaderCard;
}

applyBloodMoonState();

function selectReader(readerId) {
  const visibleGuidePool = getVisibleGuidePool();

  if (readerId === "mystery") {
    selectedReader = chooseMysteryReader();
    selectedReaderIndex = -1;
  } else {
    selectedReaderIndex = visibleGuidePool.findIndex((reader) => reader.id === readerId);
    selectedReader = visibleGuidePool[selectedReaderIndex];
  }

  if (!selectedReader) {
    return;
  }

  window.clearTimeout(bloodMoonTimeout);

  if (selectedReader.isBloodMoon) {
    bloodMoonTimeout = window.setTimeout(() => {
      activateBloodMoonEvent();
      console.log("Blood Moon mode activated");
    }, 520);
  }

  updateActiveReader();
  readingStatus.textContent = readerId === "mystery"
    ? selectedReader.revealMessage || "The veil stirs... a guide answers from beyond the known path."
    : "Choose a spread to shuffle your cards.";
  cardList.innerHTML = "";
  readingReveals.innerHTML = "";
  readingResultsSection.classList.add("hidden");
  activeRevealedCardIndex = -1;

  readerSelection.classList.add("is-minimized");
  readingStage.classList.remove("hidden");
  readingStage.classList.add("fade-slide-in");
  readingStage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getVisibleGuidePool() {
  return tarotReaders.filter((reader) => !reader.isMysteryOnly);
}

function chooseMysteryReader() {
  const allReaders = typeof mysteryReaders === "undefined"
    ? tarotReaders
    : [...tarotReaders, ...mysteryReaders];
  const mysteryPool = allReaders.map((reader) => ({
    ...reader,
    chance: reader.chance || 0,
  }));

  // TEMPORARY TESTING MODE: bypass weighted odds for Blood Moon QA.
  if (FORCE_ZEPHYRA_TEST) {
    return mysteryPool.find((reader) => reader.id === "zephyra-noctis");
  }

  const totalWeight = mysteryPool.reduce((sum, reader) => sum + reader.chance, 0);
  let roll = Math.random() * totalWeight;

  for (const reader of mysteryPool) {
    roll -= reader.chance;

    if (roll <= 0) {
      return reader;
    }
  }

  return mysteryPool[mysteryPool.length - 1];
}

function updateActiveReader() {
  document.querySelectorAll(".reader-card").forEach((card) => {
    const isMysterySelection = selectedReader.isMystery && card.dataset.readerId === "mystery";
    card.classList.toggle(
      "is-active",
      card.dataset.readerId === selectedReader.id || isMysterySelection
    );
  });

  activeReaderImage.src = selectedReader.image;
  activeReaderImage.alt = selectedReader.name;
  activeReaderName.textContent = selectedReader.name;
  activeReaderEnergy.textContent = selectedReader.energy;
  readerIntroduction.innerHTML = `
    <p class="reading-section__eyebrow">Before we begin</p>
    <p>${selectedReader.intro}</p>
  `;
}

function moveReader(direction) {
  if (!selectedReader || typeof tarotReaders === "undefined") {
    return;
  }

  const visibleGuidePool = getVisibleGuidePool();
  const slideClass = direction === "next" ? "is-sliding-right" : "is-sliding-left";

  readerPortraitFrame.classList.add(slideClass);

  window.setTimeout(() => {
    const offset = direction === "next" ? 1 : -1;

    selectedReaderIndex =
      (selectedReaderIndex + offset + visibleGuidePool.length) % visibleGuidePool.length;
    selectedReader = visibleGuidePool[selectedReaderIndex];
    window.clearTimeout(bloodMoonTimeout);

    updateActiveReader();

    readingStatus.textContent = currentReadingCards.length
      ? `${selectedReader.name} is now guiding this spread.`
      : "Choose a spread to shuffle your cards.";

    readerPortraitFrame.classList.remove(slideClass);
  }, 180);
}

function selectSpread(cardCount) {
  if (isRenderingReading) {
    return;
  }

  isRenderingReading = true;

  try {
    selectedCardCount = cardCount;

    spreadButtons.forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.spread) === cardCount);
    });

    currentReadingCards = getRandomCards(cardCount);
    revealedCards = [];
    activeRevealedCardIndex = -1;
    readingReveals.innerHTML = "";
    readingResultsSection.classList.remove("hidden");
    renderReadingCards(currentReadingCards);
    readingStatus.textContent = `${selectedReader.name} has drawn ${cardCount} cards. Click each card in Your Reading to reveal its message.`;
    scheduleReadingSectionScroll();
  } catch (error) {
    isRenderingReading = false;
    throw error;
  }

  window.setTimeout(() => {
    isRenderingReading = false;
  }, 300);
}

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

function renderReadingCards(cards) {
  cardList.classList.remove("hidden");
  cardList.innerHTML = "";
  const cardBackImage = getActiveCardBackImage();

  cardList.innerHTML = cards
    .map((card, index) => {
      const energy = cardEnergyTypes.includes(card.energy) ? card.energy : "neutral";

      return `
        <button class="tarot-card energy-${energy} fade-slide-in" type="button" data-card-index="${index}" aria-label="Reveal ${card.name}">
          <span class="tarot-card__inner">
            <span class="tarot-card__face tarot-card__back">
              <img src="${cardBackImage}" alt="" loading="lazy" decoding="async" />
            </span>
            <span class="tarot-card__face tarot-card__front">
              <img src="${card.image}" alt="${card.name}" loading="lazy" decoding="async" onerror="this.src='${cardBackImage}'" />
            </span>
          </span>
        </button>
      `;
    })
    .join("");
}

function revealCard(cardButton) {
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
  });
  activeRevealedCardIndex = revealedCards.length - 1;
  renderReadingResults();
}

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
  const showFullReset = revealedCards.length === currentReadingCards.length;
  const progressText =
    revealedCards.length === currentReadingCards.length
      ? "Your full spread has been revealed."
      : `${revealedCards.length} of ${currentReadingCards.length} cards revealed.`;

  readingStatus.textContent = progressText;
  readingResultsSection.classList.remove("hidden");
  readingReveals.innerHTML = `
    <article class="reading-viewer energy-${activeEnergy}" aria-live="polite">
      <div class="reading-viewer__image-frame">
        <img class="reading-viewer__image" src="${activeCard.image}" alt="${activeCard.name}" onerror="this.src='${getActiveCardBackImage()}'" />
      </div>

      <div class="reading-viewer__content">
        <p class="reading-viewer__eyebrow">Card ${activeCard.position} of ${currentReadingCards.length}${getCardOrientationLabel(activeCard)}</p>
        <h3>${activeCard.name}</h3>
        <p class="reading-viewer__meaning">${getCardMeaning(activeCard)}</p>

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

        ${
          showFullReset
            ? `
              <div class="reading-viewer__footer">
                <button class="primary-action" type="button" data-reset-reading>
                  New Reading
                </button>
              </div>
            `
            : ""
        }
      </div>
    </article>
  `;
}

function scheduleReadingSectionScroll() {
  window.clearTimeout(readingSectionScrollTimeout);

  readingSectionScrollTimeout = window.setTimeout(() => {
    const readingSection = document.getElementById("reading-section");

    if (!readingSection) {
      return;
    }

    readingSection.scrollIntoView({
      behavior: "smooth",
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

if (readingReveals) {
  readingReveals.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-reading-viewer-nav]");
    const resetButton = event.target.closest("[data-reset-reading]");

    if (navButton) {
      moveReadingViewer(navButton.dataset.readingViewerNav);
    }

    if (resetButton) {
      startNewReading();
    }
  });
}

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
  readingResultsSection.classList.add("hidden");
  readingStatus.textContent = "Choose a spread to shuffle your cards.";

  spreadButtons.forEach((button) => {
    button.classList.remove("is-active");
  });
}

function startNewReading() {
  resetToGuideSelection();
}

function resetToGuideSelection() {
  clearCurrentReading();
  deactivateBloodMoonEvent();
  selectedReader = null;
  selectedReaderIndex = -1;
  activeReaderImage.src = "";
  activeReaderImage.alt = "";
  activeReaderName.textContent = "";
  activeReaderEnergy.textContent = "";
  readerIntroduction.innerHTML = "";
  readingStage.classList.add("hidden");
  readerSelection.classList.remove("is-minimized");

  document.querySelectorAll(".reader-card").forEach((card) => {
    card.classList.remove("is-active");
  });

  readerSelection.scrollIntoView({ behavior: "smooth", block: "start" });
}

renderReaders();

if (readerList) {
  readerList.addEventListener("click", (event) => {
    const readerCard = event.target.closest("[data-reader-id]");

    if (readerCard) {
      selectReader(readerCard.dataset.readerId);
    }
  });
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

readerNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moveReader(button.dataset.readerNav);
  });
});

if (newReadingButton) {
  newReadingButton.addEventListener("click", startNewReading);
}

if (cardList) {
  cardList.addEventListener("click", (event) => {
    const cardButton = event.target.closest(".tarot-card");

    if (cardButton) {
      revealCard(cardButton);
    }
  });
}
