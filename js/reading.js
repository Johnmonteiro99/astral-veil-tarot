const CARD_BACK_IMAGE = "assets/images/cards/original/card-back.jpg";
const BLOOD_MOON_CARD_BACK_IMAGE = "assets/images/cards/blood-moon/bloodmoon-card-back.png";

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
const ZEPHYRA_LOCKED_MESSAGE =
  "She lingers where dust guards forgotten names and silent pages keep their watch. When the moon remembers its crimson face, her voice may return to the circle.";

let selectedReader = null;
let selectedReaderIndex = -1;
let featuredReaderIndex = 0;
let readerSelectionPreview = { readerId: null, modeKey: null, message: "" };
let readerSelectionMessageCursor = {};
let activeBloodMoonQuote = { readerId: null, quote: "" };
let readerCarouselTouchStartX = 0;
let readerCarouselTouchStartY = 0;
let lastReaderCarouselWheelAt = 0;
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

function getRandomArrayItem(items) {
  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return items[Math.floor(Math.random() * items.length)];
}

function updateReadingHeroCopy() {
  if (!readingHeroEyebrow || !readingHeroTitle || !readingHeroCopy) {
    return;
  }

  if (isBloodMoonReadingActive()) {
    readingHeroEyebrow.textContent = "Blood Moon reading";
    readingHeroTitle.textContent = "What Truth Have You Come to Disturb?";
    readingHeroCopy.textContent =
      "Under the Blood Moon, hidden wounds, shadowed patterns, and forbidden truths rise to the surface.";
    return;
  }

  readingHeroEyebrow.textContent = "Choose your reader";
  readingHeroTitle.textContent = "Begin Your Astral Reading";
  readingHeroCopy.textContent =
    "Select a reader, choose a spread, then reveal each card when you are ready.";
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
      <div class="reader-carousel__controls" aria-label="Browse Veilwalkers">
        <button class="reader-carousel__nav reader-carousel__nav--prev" type="button" data-reader-carousel-nav="prev">
          <span aria-hidden="true">&larr;</span>
          Previous Reader
        </button>
        <button class="reader-carousel__nav reader-carousel__nav--next" type="button" data-reader-carousel-nav="next">
          Next Reader
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  `;

  renderFeaturedReader();
}

applyBloodMoonState();
updateReadingHeroCopy();

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
  resetActiveBloodMoonQuote();
  if (selectedReaderIndex !== -1) {
    featuredReaderIndex = selectedReaderIndex;
  }

  clearReaderSelectionPreview();
  window.clearTimeout(bloodMoonTimeout);

  if (selectedReader.isBloodMoon) {
    activateBloodMoonEvent();
  }

  updateActiveReader();
  readingStatus.textContent = readerId === "mystery"
    ? selectedReader.revealMessage || "Fate stirs... a reader answers from beyond the known path."
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
  if (isBloodMoonActive() && reader?.bloodMoonImage) {
    return reader.bloodMoonImage;
  }

  return reader?.phase1Image || reader?.image || "";
}

function getReaderZodiacLabel(reader) {
  return reader?.sign || reader?.zodiac || "Unknown";
}

function getReaderZodiacIconPath(reader) {
  return zodiacIconPaths[getReaderZodiacLabel(reader)] || "";
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

function getActiveReaderQuote(reader, { forceNew = false } = {}) {
  if (!reader) {
    return "";
  }

  if (!isBloodMoonReadingActive()) {
    return reader.tagline || reader.description || reader.energy || "";
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
  updateReaderSelectionPreview(featuredReader);
  const previewMessage = readerSelectionPreview.readerId === featuredReader.id
    ? readerSelectionPreview.message
    : "";
  const chooseButtonText = featuredReader.id === "zephyra-noctis"
    ? "Fate May Find Her"
    : "Begin Your Reading";
  const zodiacIconPath = getReaderZodiacIconPath(featuredReader);
  const readerDescription = isBloodMoonActive() && featuredReader.bloodMoonProfile?.description
    ? featuredReader.bloodMoonProfile.description
    : featuredReader.description || getReaderFocus(featuredReader);

  featuredReaderPanel.className = `reader-carousel__featured ${accentClass}${isLocked ? " is-unavailable" : ""}${isSelected ? " is-active" : ""}`;
  featuredReaderPanel.innerHTML = `
    <article class="reader-selection-split" aria-live="polite">
      <button class="reader-selection-split__image" type="button" data-reader-carousel-message aria-label="Refresh this Veilwalker's preview message">
        <img src="${escapeHtml(getReaderSelectionImage(featuredReader))}" alt="Current Veilwalker" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'" />
      </button>
      <div class="reader-selection-split__panel">
        <div class="reader-feature-identity">
          <h3>${escapeHtml(featuredReader.name)}</h3>
          <div class="veilwalker-zodiac-line" aria-label="${escapeHtml(getReaderZodiacLabel(featuredReader))}">
            ${
              zodiacIconPath
                ? `
                  <span class="zodiac-icon-badge" aria-hidden="true">
                    <img class="zodiac-icon" src="${escapeHtml(zodiacIconPath)}" alt="" loading="eager" decoding="async" />
                  </span>
                `
                : ""
            }
            <span>${escapeHtml(getReaderZodiacLabel(featuredReader))}</span>
          </div>
        </div>
        ${previewMessage ? `<p class="reader-preview-note" data-reader-selection-message>${escapeHtml(previewMessage)}</p>` : ""}
        ${readerDescription ? `<p class="reader-selection-split__description">${escapeHtml(readerDescription)}</p>` : ""}
        ${isLocked ? `<p class="reader-feature-card__locked-message" data-reader-lock-message="${escapeHtml(featuredReader.id)}">${escapeHtml(getUnavailableReaderMessage(featuredReader))}</p>` : ""}
        <div class="reader-selection-button-row">
          <button class="reader-feature-card__choose reader-mystery-option reader-card--veil" type="button" data-reader-id="${escapeHtml(featuredReader.id)}" ${isSelectable ? "" : "disabled aria-disabled=\"true\""}>
            <span class="reader-mystery-option__title">${chooseButtonText}</span>
          </button>
          <button class="reader-mystery-option reader-card--veil${selectedReader?.isMystery && selectedReaderIndex === -1 ? " is-active" : ""}" type="button" data-reader-id="mystery">
            <span class="reader-mystery-option__title">Let Fate Choose</span>
          </button>
        </div>
      </div>
    </article>
  `;
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
  if (reader?.id === "zephyra-noctis") {
    return ZEPHYRA_LOCKED_MESSAGE;
  }

  return `${reader.name} is not available beneath this moon.`;
}

function chooseMysteryReader() {
  const selectableReaders = getVisibleGuidePool();
  const forcedReader = getForcedFateReader(selectableReaders);

  if (forcedReader) {
    return forcedReader;
  }

  return selectableReaders[Math.floor(Math.random() * selectableReaders.length)] || null;
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

function updateActiveReader() {
  const readerPresentation = getReaderPresentation(selectedReader);
  updateReadingHeroCopy();
  const preparationTitle = isBloodMoonReadingActive()
    ? "UNDER THE BLOOD MOON"
    : "Before We Begin";
  const preparationText = isBloodMoonReadingActive()
    ? "Do not ask unless you are ready to hear what your shadow has been saying all along."
    : "Take a breath and focus on the energy surrounding your question. Let your thoughts settle, trust your intuition, and choose the spread that feels right for you. Select 3, 5, or 7 cards to begin your reading.";

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

  updateReaderSelectionConfirmation(selectedReaderIndex === -1 ? "mystery" : selectedReader.id);

  activeReaderImage.src = readerPresentation.image;
  activeReaderImage.alt = readerPresentation.name;
  activeReaderImage.dataset.imagePreviewTitle = readerPresentation.name;
  activeReaderImage.dataset.imagePreviewCaption = getActiveReaderQuote(readerPresentation);
  activeReaderName.textContent = readerPresentation.name;
  activeReaderRole.textContent = getReaderRole(readerPresentation);
  activeReaderQuote.textContent = getActiveReaderQuote(readerPresentation);
  readerIntroduction.innerHTML = `
    <p class="reading-section__eyebrow">${preparationTitle}</p>
    <p>${preparationText}</p>
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
    resetActiveBloodMoonQuote();
    window.clearTimeout(bloodMoonTimeout);

    updateActiveReader();

    readingStatus.textContent = currentReadingCards.length
      ? `${selectedReader.name} is now reading this spread.`
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
  const showClosingActions = revealedCards.length === currentReadingCards.length;
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

      </div>
    </article>
    ${renderCombinedReading()}
    ${
      showClosingActions
        ? `
          <div class="reading-closing-actions" aria-label="Reading actions">
            <button class="primary-action" type="button" data-reset-reading>
              New Reading
            </button>
            <button class="reader-nav-button" type="button" data-change-reader>
              Change Reader
            </button>
          </div>
        `
        : ""
    }
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
    const changeReaderButton = event.target.closest("[data-change-reader]");

    if (navButton) {
      moveReadingViewer(navButton.dataset.readingViewerNav);
    }

    if (resetButton || changeReaderButton) {
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

function clearSelectedReaderState({ scrollToSelection = false } = {}) {
  selectedReader = null;
  selectedReaderIndex = -1;
  activeReaderImage.src = "";
  activeReaderImage.alt = "";
  delete activeReaderImage.dataset.imagePreviewTitle;
  delete activeReaderImage.dataset.imagePreviewCaption;
  activeReaderName.textContent = "";
  activeReaderRole.textContent = "";
  activeReaderQuote.textContent = "";
  resetActiveBloodMoonQuote();
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

  renderFeaturedReader();

  if (scrollToSelection) {
    readerSelection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function resetToGuideSelection() {
  clearCurrentReading();
  deactivateBloodMoonEvent();
  clearSelectedReaderState({ scrollToSelection: true });
}

renderReaders();

window.addEventListener("astralVeilBloodMoonChange", (event) => {
  const isBloodMoonModeActive = typeof event.detail?.isActive === "boolean"
    ? event.detail.isActive
    : isBloodMoonActive();

  clearReaderSelectionPreview();
  resetActiveBloodMoonQuote();
  updateReadingHeroCopy();
  renderReaders();

  if (!isBloodMoonModeActive) {
    clearCurrentReading();

    if (selectedReader?.requiresBloodMoon || selectedReader?.isBloodMoon) {
      clearSelectedReaderState();
      return;
    }
  }

  if (selectedReader) {
    updateActiveReader();
  }
});

if (readerList) {
  readerList.addEventListener("click", (event) => {
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
    const touch = event.changedTouches[0];

    readerCarouselTouchStartX = touch.clientX;
    readerCarouselTouchStartY = touch.clientY;
  }, { passive: true });

  readerList.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - readerCarouselTouchStartX;
    const deltaY = touch.clientY - readerCarouselTouchStartY;

    if (Math.abs(deltaX) > 72 && Math.abs(deltaX) > Math.abs(deltaY) * 2.4) {
      moveFeaturedReader(deltaX < 0 ? "next" : "prev");
    }
  }, { passive: true });

  readerList.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 28) {
      return;
    }

    const now = Date.now();

    if (now - lastReaderCarouselWheelAt < 420) {
      return;
    }

    lastReaderCarouselWheelAt = now;
    moveFeaturedReader(event.deltaX > 0 ? "next" : "prev");
  }, { passive: true });
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
