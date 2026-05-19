const CARD_BACK_IMAGE = "assets/images/cards/original/card-back.jpg";
const BLOOD_MOON_CARD_BACK_IMAGE = "assets/images/cards/blood-moon/bloodmoon-card-back.png";

const readerList = document.querySelector("[data-reader-list]");
const readerSelection = document.querySelector("#reader-selection");
const readerSelectionConfirmation = document.querySelector("[data-reader-selection-confirmation]");
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
const FORCE_MYSTERY_SCORPIO_TEST = false;

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
  return isBloodMoonActive();
}

function getActiveDeck() {
  if (window.AstralVeilBloodMoon?.getActiveDeck) {
    const activeDeck = window.AstralVeilBloodMoon.getActiveDeck();

    return activeDeck.length ? activeDeck : tarotDeck;
  }

  return tarotDeck;
}

function getActiveCardBackImage() {
  return isBloodMoonReadingActive() ? BLOOD_MOON_CARD_BACK_IMAGE : CARD_BACK_IMAGE;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isBloodMoonCard(card) {
  return Boolean(card?.isBloodMoonCard || card?.originalCardId);
}

function getCardDisplayName(card) {
  return escapeHtml(card.name);
}

function prepareReadingCard(card) {
  if (!isBloodMoonCard(card)) {
    return card;
  }

  return {
    ...card,
    orientation: Math.random() < 0.5 ? "upright" : "reversed"
  };
}

function getCardOrientationLabel(card) {
  if (!isBloodMoonCard(card)) {
    return "";
  }

  return card.orientation === "reversed" ? " • Reversed" : " • Upright";
}

function getActiveSpread() {
  return typeof getSpreadByCount === "function" ? getSpreadByCount(selectedCardCount) : null;
}

function getCardPositionLabel(card, index) {
  const spread = getActiveSpread();

  return spread?.positions?.[card.position - 1] || spread?.positions?.[index] || `Card ${card.position}`;
}

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

function renderOriginalCardMeaning(card) {
  return `
    ${renderKeywordBadges(card.keywords)}
    <p class="reading-viewer__meaning reading-viewer__meaning--short">${escapeHtml(card.shortMeaning)}</p>
    <p class="reading-viewer__summary">${escapeHtml(card.summary)}</p>
    <div class="reading-viewer__insight-grid">
      <section>
        <h4>Upright</h4>
        <p>${escapeHtml(card.uprightMeaning)}</p>
      </section>
      <section>
        <h4>Shadow</h4>
        <p>${escapeHtml(card.shadowMeaning)}</p>
      </section>
    </div>
    <p class="reading-viewer__reflection">
      <span>Reflection</span>
      ${escapeHtml(card.reflectionQuestion)}
    </p>
  `;
}

function renderBloodMoonCardMeaning(card) {
  const bloodMoon = card.bloodMoon || {};

  return `
    ${renderKeywordBadges(card.keywords)}
    <p class="reading-viewer__meaning reading-viewer__meaning--short">${escapeHtml(bloodMoon.shortMeaning || card.shortMeaning)}</p>
    <p class="reading-viewer__summary">${escapeHtml(bloodMoon.summary || card.summary)}</p>
    <div class="reading-viewer__insight-grid reading-viewer__insight-grid--blood-moon">
      <section>
        <h4>Shadow Message</h4>
        <p>${escapeHtml(bloodMoon.shadowMessage || card.shadowMeaning)}</p>
      </section>
      ${
        bloodMoon.veilHint
          ? `
            <section>
              <h4>Veil Hint</h4>
              <p>${escapeHtml(bloodMoon.veilHint)}</p>
            </section>
          `
          : ""
      }
    </div>
  `;
}

function renderCardMeaningDetails(card) {
  return isBloodMoonCard(card)
    ? renderBloodMoonCardMeaning(card)
    : renderOriginalCardMeaning(card);
}

function renderCombinedReading() {
  if (typeof generateCombinedReading !== "function" || !revealedCards.length) {
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

  return `
    <article class="combined-reading${isBloodMoonReadingActive() ? " combined-reading--blood-moon" : ""}">
      <p class="reading-viewer__eyebrow">${escapeHtml(getActiveSpread()?.combinedLabel || "Combined Message")}</p>
      <h3>${escapeHtml(combinedReading.title)}</h3>
      <p>${escapeHtml(combinedReading.summary)}</p>
      <p class="combined-reading__advice">${escapeHtml(combinedReading.advice)}</p>
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

function getReaderPresentation(reader) {
  if (!reader?.isBloodMoon || !isBloodMoonReadingActive()) {
    return reader;
  }

  return {
    ...reader,
    image: reader.bloodMoonImage || reader.image,
    energy: reader.bloodMoonProfile?.energy || reader.energy,
    intro: reader.bloodMoonProfile?.intro || reader.intro
  };
}

function renderReaders() {
  if (!readerList || typeof tarotReaders === "undefined") {
    return;
  }

  const visibleGuidePool = getVisibleGuidePool();
  const mysteryReaderCard = `
    <button class="reader-card reader-card--mystery reader-card--veil" type="button" data-reader-id="mystery" aria-disabled="false">
      <span class="reader-card__mystery-orb" aria-hidden="true">?</span>
      <span class="reader-card__content">
        <span class="reader-card__meta">
          <span class="reader-card__badge">Unknown</span>
          <span class="reader-card__badge">The Veil</span>
        </span>
        <span class="reader-card__name">Mystery Reader</span>
        <span class="reader-card__selected-label">Guiding this reading</span>
      </span>
    </button>
  `;

  readerList.innerHTML =
    visibleGuidePool
    .map((reader) => {
      const isSelectable = isReaderSelectable(reader);
      const lockedBadge = reader.requiresBloodMoon
        ? `<span class="reader-card__badge reader-card__badge--locked">Blood Moon Bound</span>`
        : "";
      const lockedMessage = !isSelectable && reader.requiresBloodMoon
        ? `<span class="reader-card__locked-message" data-reader-lock-message="${escapeHtml(reader.id)}" aria-live="polite"></span>`
        : "";

      return `
        <button class="reader-card ${getReaderAccentClass(reader)}${isSelectable ? "" : " is-unavailable"}" type="button" data-reader-id="${escapeHtml(reader.id)}" aria-disabled="${isSelectable ? "false" : "true"}">
          <img class="reader-card__image" src="${escapeHtml(getReaderSelectionImage(reader))}" alt="${escapeHtml(reader.name)}" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'" />
          <span class="reader-card__content">
            <span class="reader-card__meta">
              <span class="reader-card__badge">${escapeHtml(reader.sign || reader.zodiac || "Zodiac")}</span>
              <span class="reader-card__badge">${escapeHtml(reader.element || "Veil")}</span>
              ${lockedBadge}
            </span>
            <span class="reader-card__name">${escapeHtml(reader.name)}</span>
            <span class="reader-card__selected-label">Guiding this reading</span>
            ${lockedMessage}
          </span>
        </button>
      `;
    })
      .join("") + mysteryReaderCard;
}

applyBloodMoonState();

function selectReader(readerId) {
  const visibleGuidePool = getVisibleGuidePool();
  let nextReader = null;
  let nextReaderIndex = -1;

  if (readerId === "mystery") {
    nextReader = chooseMysteryReader();
  } else {
    nextReaderIndex = visibleGuidePool.findIndex((reader) => reader.id === readerId);
    nextReader = visibleGuidePool[nextReaderIndex];
  }

  if (!nextReader) {
    return;
  }

  if (readerId !== "mystery" && !isReaderSelectable(nextReader)) {
    showUnavailableReaderMessage(nextReader);
    return;
  }

  selectedReader = nextReader;
  selectedReaderIndex = readerId === "mystery" ? -1 : nextReaderIndex;

  window.clearTimeout(bloodMoonTimeout);

  if (selectedReader.isBloodMoon) {
    activateBloodMoonEvent();
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

function getSelectableGuidePool() {
  return getVisibleGuidePool().filter(isReaderSelectable);
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

  return "reader-card--event";
}

function isReaderSelectable(reader) {
  return !reader?.requiresBloodMoon || isBloodMoonActive();
}

function getReaderSelectionImage(reader) {
  if (reader?.id === "zephyra-noctis") {
    return reader.phase2Image || reader.bloodMoonImage || reader.phase1Image || reader.image || "";
  }

  return reader?.phase1Image || reader?.image || "";
}

function getReaderFocus(reader) {
  return reader?.focus || reader?.readingStyle || reader?.energy || "";
}

function updateReaderSelectionConfirmation(readerId) {
  if (!readerSelectionConfirmation || !selectedReader) {
    return;
  }

  readerSelectionConfirmation.innerHTML = readerId === "mystery"
    ? `
        <span class="reader-selection__confirmation-title">Mystery Reader</span>
        <span>Let the Veil choose the current hidden beneath your question.</span>
      `
    : `
        <span class="reader-selection__confirmation-title">${escapeHtml(selectedReader.name)}</span>
        <span>${escapeHtml(selectedReader.sign || selectedReader.zodiac || "Unknown")} • ${escapeHtml(selectedReader.element || "The Veil")}</span>
        <span>${escapeHtml(getReaderFocus(selectedReader))}</span>
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
    lockMessage.closest(".reader-card")?.classList.add("is-lock-pulsing");
  }

  if (readerSelectionConfirmation) {
    readerSelectionConfirmation.innerHTML = selectedReader ? selectedReaderInfo : "";
  }

  if (readingStatus) {
    readingStatus.textContent = message;
  }
}

function getUnavailableReaderMessage(reader) {
  const zephyraMessages = [
    "She lingers where dust guards forgotten names and silent pages keep their watch. When the moon remembers its crimson face, her voice may return to the circle.",
    "The scorpion is absent from the circle. She studies where candlelight clings to sealed pages. When the sky bruises red, the Veil may loosen her path.",
    "Not all readers answer beneath an ordinary moon. One remains among sleeping ink and unwoken shelves. Call again when the heavens turn crimson.",
    "Her place is kept, but not for this hour. She waits where old words breathe beneath candle smoke. Only the Blood Moon knows the way back.",
  ];

  if (reader?.id === "zephyra-noctis") {
    return zephyraMessages[Math.floor(Math.random() * zephyraMessages.length)];
  }

  return `${reader.name} is not available beneath this moon.`;
}

function chooseMysteryReader() {
  const allReaders = typeof mysteryReaders === "undefined"
    ? tarotReaders
    : [...tarotReaders, ...mysteryReaders];

  if (!allReaders.length) {
    return null;
  }

  if (FORCE_MYSTERY_SCORPIO_TEST) {
    const scorpioReader = allReaders.find((reader) => reader.id === "zephyra-noctis");

    if (scorpioReader) {
      return scorpioReader;
    }
  }

  return allReaders[Math.floor(Math.random() * allReaders.length)];
}

function updateActiveReader() {
  const readerPresentation = getReaderPresentation(selectedReader);

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

  updateReaderSelectionConfirmation(selectedReaderIndex === -1 ? "mystery" : selectedReader.id);

  activeReaderImage.src = readerPresentation.image;
  activeReaderImage.alt = readerPresentation.name;
  activeReaderImage.dataset.imagePreviewTitle = readerPresentation.name;
  activeReaderImage.dataset.imagePreviewCaption = readerPresentation.energy || "";
  activeReaderName.textContent = readerPresentation.name;
  activeReaderEnergy.textContent = readerPresentation.energy;
  readerIntroduction.innerHTML = `
    <p class="reading-section__eyebrow">Before we begin</p>
    <p>${readerPresentation.intro}</p>
  `;
}

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
      const cardName = getCardDisplayName(card);

      return `
        <button class="tarot-card energy-${energy} fade-slide-in" type="button" data-card-index="${index}" aria-label="Reveal ${cardName}">
          <span class="tarot-card__inner">
            <span class="tarot-card__face tarot-card__back">
              <img src="${cardBackImage}" alt="" loading="lazy" decoding="async" />
            </span>
            <span class="tarot-card__face tarot-card__front">
              <img src="${escapeHtml(card.image)}" alt="${cardName}" loading="lazy" decoding="async" onerror="this.src='${cardBackImage}'" />
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
  const activePositionLabel = getCardPositionLabel(activeCard, activeRevealedCardIndex);
  const cardName = getCardDisplayName(activeCard);

  readingStatus.textContent = progressText;
  readingResultsSection.classList.remove("hidden");
  readingReveals.innerHTML = `
    <article class="reading-viewer energy-${activeEnergy}" aria-live="polite">
      <div class="reading-viewer__image-frame">
        <img
          class="reading-viewer__image"
          src="${escapeHtml(activeCard.image)}"
          alt="${escapeHtml(cardName)}"
          data-expandable-image
          data-image-preview-title="${escapeHtml(cardName)}"
          data-image-preview-caption="${escapeHtml(activePositionLabel)}"
          role="button"
          tabindex="0"
          aria-label="Expand ${escapeHtml(cardName)} image"
          onerror="this.src='${getActiveCardBackImage()}'"
        />
      </div>

      <div class="reading-viewer__content">
        <p class="reading-viewer__eyebrow">${escapeHtml(activePositionLabel)} • Card ${activeCard.position} of ${currentReadingCards.length}${getCardOrientationLabel(activeCard)}</p>
        <h3>${cardName}</h3>
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
    ${renderCombinedReading()}
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
  delete activeReaderImage.dataset.imagePreviewTitle;
  delete activeReaderImage.dataset.imagePreviewCaption;
  activeReaderName.textContent = "";
  activeReaderEnergy.textContent = "";
  readerIntroduction.innerHTML = "";
  if (readerSelectionConfirmation) {
    readerSelectionConfirmation.innerHTML = "";
  }
  readingStage.classList.add("hidden");
  readerSelection.classList.remove("is-minimized");

  document.querySelectorAll(".reader-card").forEach((card) => {
    card.classList.remove("is-active");
  });

  document.querySelectorAll("[data-reader-lock-message]").forEach((element) => {
    element.textContent = "";
  });

  readerSelection.scrollIntoView({ behavior: "smooth", block: "start" });
}

renderReaders();

window.addEventListener("astralVeilBloodMoonChange", () => {
  renderReaders();

  if (selectedReader) {
    updateActiveReader();
  }
});

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
