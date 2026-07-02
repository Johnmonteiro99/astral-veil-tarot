const readersPageList = document.querySelector("[data-readers-page-list]");
const zodiacSelector = document.querySelector("[data-zodiac-selector]");
const readerSelectorDots = document.querySelector("[data-reader-selector-dots]");
const readerLightbox = document.querySelector("[data-reader-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const closeLightboxButtons = document.querySelectorAll("[data-close-lightbox]");
let orderedReaderProfiles = [];
let activeReaderIndex = -1;
let featuredReaderIndex = 0;
let activeReaderFormId = "phase1";
let lightboxTouchStartX = 0;
let lastLightboxNavAt = 0;
let selectorTouchStartX = 0;
let selectorTouchStartY = 0;
let featuredReaderHeroLineRequestId = 0;
const selectedReaderStorageKey = "astralVeilSelectedReader";
const readingPageHref = "/";
const selectedReaderHeroLines = {};
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
  "Pisces"
];
const zodiacGlyphs = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓"
};
const zodiacIconPaths = {
  Aries: "../assets/icons/zodiac/aries.svg",
  Taurus: "../assets/icons/zodiac/taurus.svg",
  Gemini: "../assets/icons/zodiac/gemini.svg",
  Cancer: "../assets/icons/zodiac/cancer.svg",
  Leo: "../assets/icons/zodiac/leo.svg",
  Virgo: "../assets/icons/zodiac/virgo.svg",
  Libra: "../assets/icons/zodiac/libra.svg",
  Scorpio: "../assets/icons/zodiac/scorpio.svg",
  Sagittarius: "../assets/icons/zodiac/sagittarius.svg",
  Capricorn: "../assets/icons/zodiac/capricorn.svg",
  Aquarius: "../assets/icons/zodiac/aquarius.svg",
  Pisces: "../assets/icons/zodiac/pisces.svg"
};

////////////////////////////////////////////////////
// Veilwalker Data and Presentation Helpers
////////////////////////////////////////////////////

function isBloodMoonActive() {
  return Boolean(window.AstralVeilBloodMoon && window.AstralVeilBloodMoon.isBloodMoonActive());
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getReaderPresentation(reader) {
  if (!reader) {
    return reader;
  }

  const bloodMoonActive = isBloodMoonActive();
  const image = bloodMoonActive && reader.bloodMoonImage
    ? reader.bloodMoonImage
    : reader.gridImage || reader.phase1Image || reader.image;

  if (!bloodMoonActive) {
    return {
      ...reader,
      image
    };
  }

  return {
    ...reader,
    image,
    title: reader.bloodMoonTitle || reader.bloodMoonProfile?.readingStyle || reader.title,
    tagline: reader.bloodMoonTitle || reader.tagline,
    energy: reader.bloodMoonTitle || reader.bloodMoonProfile?.energy || reader.energy,
    readingStyle: reader.bloodMoonTitle || reader.bloodMoonProfile?.readingStyle || reader.readingStyle,
    description: reader.bloodMoonDescription || reader.bloodMoonProfile?.description || reader.description,
    lore: reader.bloodMoonDescription || reader.bloodMoonProfile?.backstory || reader.lore,
    themes: reader.bloodMoonTraits || reader.themes,
    rarityLabel: reader.bloodMoonProfile?.rarityLabel || reader.rarityLabel,
    fragmentLabel: reader.bloodMoonProfile?.fragmentLabel
  };
}

// Keeps the Veilwalkers grid in zodiac order even when mystery/event profiles are included.
function getReaderSortOrder(reader) {
  const signIndex = zodiacOrder.indexOf(reader.sign || reader.zodiac);

  return signIndex === -1 ? zodiacOrder.length : signIndex;
}

function getAllReadersInOrder() {
  const allReaders = typeof mysteryReaders === "undefined"
    ? tarotReaders
    : [...tarotReaders, ...mysteryReaders];

  return [...allReaders].sort(
    (firstReader, secondReader) => getReaderSortOrder(firstReader) - getReaderSortOrder(secondReader)
  );
}

function getReaderElementClass(reader) {
  if (reader.isBloodMoon) {
    return "";
  }

  const baseElement = reader.accentClass || (reader.element || "").split("/")[0].trim().toLowerCase();

  return ["fire", "earth", "air", "water"].includes(baseElement)
    ? ` reader-profile-card--${baseElement} veilwalker-card--${baseElement}`
    : "";
}

function getReaderBloodMoonCardClass(reader) {
  if (!isBloodMoonActive()) {
    return "";
  }

  // Lyssara gets her own Blood Moon starlight treatment on the Veilwalkers page,
  // separate from Zephyra's crimson fragment styling.
  return reader?.id === "aquarius" ? " reader-profile-card--aquarius-bloodmoon" : "";
}

function isProtectedReaderVisual(reader, image = "") {
  return Boolean(isBloodMoonActive() && reader?.bloodMoonImage && (!image || image === reader.bloodMoonImage));
}

function getReaderDetailAccentClass(reader) {
  if (reader.isBloodMoon) {
    return "";
  }

  const baseElement = reader.accentClass || (reader.element || "").split("/")[0].trim().toLowerCase();

  return ["fire", "earth", "air", "water"].includes(baseElement)
    ? ` reader-lightbox__dialog--${baseElement}`
    : "";
}

function getFeaturedReader() {
  if (!orderedReaderProfiles.length) {
    orderedReaderProfiles = getAllReadersInOrder();
  }

  return orderedReaderProfiles[featuredReaderIndex] || orderedReaderProfiles[0] || null;
}

function getReaderPreviewImage(reader) {
  const presentation = getReaderPresentation(reader);

  return presentation?.image || reader?.phase1Image || reader?.image || "";
}

function getZodiacIconPath(sign) {
  return zodiacIconPaths[sign] || "";
}

function getReaderSummary(reader) {
  const presentation = getReaderPresentation(reader);

  return (
    presentation.description ||
    presentation.lore ||
    presentation.focus ||
    presentation.energy ||
    "A trusted Astral Veil guide for reflective tarot readings."
  );
}

function pickRandomReaderLine(lines) {
  if (!Array.isArray(lines) || !lines.length) {
    return "";
  }

  const usableLines = lines
    .map((line) => String(line || "").trim())
    .filter(Boolean);

  if (!usableLines.length) {
    return "";
  }

  return usableLines[Math.floor(Math.random() * usableLines.length)];
}

function getReaderHeroLineModeKey() {
  return isBloodMoonActive() ? "bloodMoon" : "moon";
}

function getReaderHeroLineCacheKey(reader) {
  const readerLines = window.AstralVeilReaderLines;
  const readerLineId = typeof readerLines?.getReaderLineId === "function"
    ? readerLines.getReaderLineId(reader)
    : reader?.id || reader?.name || "";

  return `${readerLineId}:${getReaderHeroLineModeKey()}`;
}

function getReaderHeroFallbackLine(reader) {
  if (!reader) {
    return "";
  }

  const presentation = getReaderPresentation(reader);
  const readerSpecificLines = isBloodMoonActive()
    ? reader.bloodMoonHeroLines || reader.bloodMoonLines || reader.bloodMoonSelectionMessages || reader.bloodMoonQuotes
    : reader.heroLines || reader.lines || reader.normalSelectionMessages;
  const fallbackLines = reader.lines || reader.selectionMessages || reader.normalSelectionMessages;
  const selectedLine =
    pickRandomReaderLine(readerSpecificLines) ||
    pickRandomReaderLine(fallbackLines);

  return (
    selectedLine ||
    presentation.tagline ||
    presentation.readingStyle ||
    presentation.title ||
    presentation.subtitle ||
    presentation.description ||
    ""
  );
}

function getReaderHeroLine(reader) {
  if (!reader) {
    return "";
  }

  const cacheKey = getReaderHeroLineCacheKey(reader);

  if (!selectedReaderHeroLines[cacheKey]) {
    selectedReaderHeroLines[cacheKey] = getReaderHeroFallbackLine(reader);
  }

  return selectedReaderHeroLines[cacheKey] || getReaderHeroFallbackLine(reader);
}

async function hydrateFeaturedReaderHeroLine(reader) {
  const readerLines = window.AstralVeilReaderLines;

  if (!reader || typeof readerLines?.getReaderIntroLine !== "function") {
    return;
  }

  const cacheKey = getReaderHeroLineCacheKey(reader);
  const requestId = featuredReaderHeroLineRequestId + 1;
  featuredReaderHeroLineRequestId = requestId;

  try {
    const line = await readerLines.getReaderIntroLine({
      reader,
      mode: getReaderHeroLineModeKey()
    });

    if (
      requestId !== featuredReaderHeroLineRequestId ||
      getReaderHeroLineCacheKey(reader) !== cacheKey ||
      getFeaturedReader()?.id !== reader.id ||
      !line
    ) {
      return;
    }

    if (selectedReaderHeroLines[cacheKey] === line) {
      return;
    }

    selectedReaderHeroLines[cacheKey] = line;
    renderFeaturedVeilwalkerSelector();
  } catch (error) {
    console.warn("Unable to apply Veilwalker hero line.", error);
  }
}

function renderReaderDetailRows(reader) {
  const presentation = getReaderPresentation(reader);
  const focus = presentation.focus || presentation.energy || "";
  const traits = Array.isArray(presentation.themes) && presentation.themes.length
    ? presentation.themes.slice(0, 4).join(", ")
    : "";
  const detailRows = [
    ["Element", presentation.element || ""],
    ["Focus", focus.replace(/^For\s+/i, "")],
    ["Traits", traits]
  ].filter(([, value]) => value);

  if (!detailRows.length) {
    return "";
  }

  return `
    <dl class="veilwalker-feature__detail-list">
      ${detailRows
        .map(([label, value]) => `
          <div class="veilwalker-feature__detail-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>
        `)
        .join("")}
    </dl>
  `;
}

function isReaderBeginReadingAvailable(reader) {
  if (reader?.id === "zephyra-noctis") {
    return true;
  }

  return !reader?.requiresBloodMoon || isBloodMoonActive();
}

function setFeaturedReader(readerId) {
  if (!orderedReaderProfiles.length) {
    orderedReaderProfiles = getAllReadersInOrder();
  }

  const nextIndex = orderedReaderProfiles.findIndex((reader) => reader.id === readerId);

  if (nextIndex === -1) {
    return;
  }

  featuredReaderIndex = nextIndex;
  renderFeaturedVeilwalkerSelector();
}

function getZodiacButtons() {
  return Array.from(zodiacSelector?.querySelectorAll(".veilwalker-zodiac-button") || []);
}

function updateZodiacActiveState() {
  const activeReader = getFeaturedReader();

  getZodiacButtons().forEach((button) => {
    const isActive = button.dataset.readerSelectId === activeReader?.id;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-selected", String(isActive));

    if (isActive) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

function centerActiveZodiacButton({ behavior = "smooth" } = {}) {
  const track = zodiacSelector?.querySelector(".veilwalker-zodiac-track");
  const activeButton = track?.querySelector(".veilwalker-zodiac-button.is-active");

  if (!track || !activeButton) {
    return;
  }

  const targetScrollLeft = activeButton.offsetLeft + activeButton.offsetWidth / 2 - track.clientWidth / 2;

  track.scrollTo({
    left: Math.max(0, targetScrollLeft),
    behavior
  });
}

function moveFeaturedReader(direction) {
  if (!orderedReaderProfiles.length) {
    orderedReaderProfiles = getAllReadersInOrder();
  }

  if (!orderedReaderProfiles.length) {
    return;
  }

  const offset = direction === "next" ? 1 : -1;

  featuredReaderIndex =
    (featuredReaderIndex + offset + orderedReaderProfiles.length) % orderedReaderProfiles.length;
  renderFeaturedVeilwalkerSelector();
}

function beginReadingWithReader(readerId) {
  const reader = orderedReaderProfiles.find((item) => item.id === readerId);

  if (!reader || !isReaderBeginReadingAvailable(reader)) {
    return;
  }

  try {
    localStorage.setItem(selectedReaderStorageKey, reader.id);
  } catch (error) {
    // Query parameter below still carries the selection if storage is unavailable.
  }

  window.location.href = `${readingPageHref}?reader=${encodeURIComponent(reader.id)}`;
}

// Renders the symbolic traits block inside the reader detail lightbox.
function renderReaderThemes(reader) {
  if (!Array.isArray(reader.themes) || !reader.themes.length) {
    return "";
  }

  return `
    <section class="reader-detail__section">
      <h3>Symbolic Traits</h3>
      <ul class="reader-detail__themes">
        ${reader.themes.map((theme) => `<li>${escapeHtml(theme)}</li>`).join("")}
      </ul>
    </section>
  `;
}

// Lyssara's unstable signal is only surfaced while Blood Moon mode is active.
function renderBloodMoonSignal(reader) {
  if (!isBloodMoonActive() || !reader?.bloodMoonSignal) {
    return "";
  }

  const signal = reader.bloodMoonSignal;

  return `
    <section class="reader-detail__section reader-blood-signal" aria-label="${escapeHtml(signal.label)}">
      <p class="reader-blood-signal__label">${escapeHtml(signal.label)}</p>
      <p>${escapeHtml(signal.text)}</p>
      <p class="reader-blood-signal__clue">${escapeHtml(signal.clue)}</p>
      <button class="reader-blood-signal__button" type="button" data-reader-signal="${escapeHtml(reader.id)}">
        ${escapeHtml(signal.button)}
      </button>
    </section>
  `;
}

// Returns available portrait/revelation forms; Blood Moon mode swaps to event-specific art when present.
function getAvailableReaderForms(reader) {
  if (isBloodMoonActive() && reader?.bloodMoonImage) {
    const label = reader.bloodMoonRevelation || "Blood Moon Rising";

    return [
      {
        id: "bloodMoonShadow",
        label,
        title: label,
        image: reader.bloodMoonImage,
        description: ""
      }
    ];
  }

  return Array.isArray(reader.forms)
    ? reader.forms.filter((form) => form?.id && form?.image)
    : [];
}

function getActiveReaderForm(reader) {
  const forms = getAvailableReaderForms(reader);

  if (!forms.length) {
    return null;
  }

  return forms.find((form) => form.id === activeReaderFormId) || forms[0];
}

function getReaderImagePreviewCaption(activeForm, fallbackTitle = "") {
  if (isBloodMoonActive()) {
    return "Revelations: Blood Moon Rising";
  }

  if (!activeForm) {
    return fallbackTitle || "";
  }

  return activeForm.label === activeForm.title
    ? activeForm.label
    : `${activeForm.label}: ${activeForm.title}`;
}

function renderReaderFormSelector(reader, activeForm) {
  const forms = getAvailableReaderForms(reader);

  if (forms.length <= 1 && !isBloodMoonActive()) {
    return "";
  }

  const sectionTitle = isBloodMoonActive() ? "REVELATION" : "REVELATIONS";

  return `
    <section class="reader-detail__section reader-detail__section--forms">
      <h3>${sectionTitle}</h3>
      <div class="reader-detail__forms" aria-label="Available character forms">
        ${forms
          .map((form) => `
            <button
              class="reader-detail__form-button${activeForm?.id === form.id ? " is-active" : ""}"
              type="button"
              data-reader-form-id="${escapeHtml(form.id)}"
              aria-pressed="${activeForm?.id === form.id ? "true" : "false"}"
            >
              <span>${escapeHtml(form.label)}</span>
            </button>
          `)
          .join("")}
      </div>
    </section>
  `;
}

////////////////////////////////////////////////////
// Veilwalker Grid and Detail Lightbox
////////////////////////////////////////////////////

// Builds the featured Veilwalker selector from reader data.
function renderReaderProfiles() {
  if (!readersPageList || typeof tarotReaders === "undefined") {
    return;
  }

  orderedReaderProfiles = getAllReadersInOrder();
  featuredReaderIndex = Math.max(0, Math.min(featuredReaderIndex, orderedReaderProfiles.length - 1));
  renderFeaturedVeilwalkerSelector();
}

function renderFeaturedVeilwalkerSelector() {
  const reader = getFeaturedReader();

  if (!reader || !readersPageList) {
    return;
  }

  const presentation = getReaderPresentation(reader);
  const image = getReaderPreviewImage(reader);
  const sign = presentation.sign || presentation.zodiac || "Unknown";
  const zodiacIcon = getZodiacIconPath(sign);
  const summary = getReaderSummary(reader);
  const title = getReaderHeroLine(reader);
  const canBeginReading = isReaderBeginReadingAvailable(reader);
  const isZephyraReader = reader.id === "zephyra-noctis";
  const useZephyraTheme = isZephyraReader && !isBloodMoonActive();
  const isProtectedVisual = isProtectedReaderVisual(reader, image);
  const protectedMediaClass = isProtectedVisual ? " protected-media" : "";
  const protectedMediaAttrs = isProtectedVisual ? ' data-protected-media="true" draggable="false"' : "";
  const protectedImageAttr = isProtectedVisual ? ' draggable="false"' : "";

  readersPageList.innerHTML = `
    <article class="veilwalker-feature${useZephyraTheme ? " veilwalker-feature--zephyra" : ""} reader-profile-card--${escapeHtml(reader.id)}${getReaderElementClass(reader)}${getReaderBloodMoonCardClass(reader)}">
      <button class="veilwalker-feature__nav veilwalker-feature__nav--prev" type="button" data-reader-selector-nav="prev" aria-label="Previous Veilwalker">
        <span aria-hidden="true">‹</span>
      </button>
      <div class="veilwalker-feature__image-wrap${protectedMediaClass}"${protectedMediaAttrs}>
        <img class="veilwalker-feature__image" src="${escapeHtml(image)}" alt="${escapeHtml(presentation.name)}" loading="eager" decoding="async"${protectedImageAttr} onerror="this.style.visibility='hidden'" />
      </div>
      <div class="veilwalker-feature__details">
        <div class="veilwalker-feature__meta">
          <span class="veilwalker-feature__glyph" style="--zodiac-icon: url('${escapeHtml(zodiacIcon)}')" aria-hidden="true"></span>
          <span>${escapeHtml(sign)}</span>
          <span aria-hidden="true">•</span>
          <span>${escapeHtml(presentation.element || "The Veil")}</span>
        </div>
        <h2>${escapeHtml(presentation.name)}</h2>
        ${title ? `<p class="veilwalker-feature__quote">“${escapeHtml(title)}”</p>` : ""}
        <div class="veilwalker-feature__ornament" aria-hidden="true"></div>
        <p class="veilwalker-feature__description">${escapeHtml(summary)}</p>
        ${renderReaderDetailRows(reader)}
        <div class="veilwalker-feature__actions">
          <button class="veilwalker-feature__button veilwalker-feature__button--secondary" type="button" data-reader-profile-id="${escapeHtml(reader.id)}">
            View Profile <span aria-hidden="true">✦</span>
          </button>
          <button class="veilwalker-feature__button veilwalker-feature__button--primary" type="button" data-reader-begin-id="${escapeHtml(reader.id)}" ${canBeginReading ? "" : "disabled"}>
            Begin Reading <span aria-hidden="true">✦</span>
          </button>
        </div>
      </div>
      <button class="veilwalker-feature__nav veilwalker-feature__nav--next" type="button" data-reader-selector-nav="next" aria-label="Next Veilwalker">
        <span aria-hidden="true">›</span>
      </button>
    </article>
  `;

  const reusedZodiacSelector = renderZodiacSelector();

  if (reusedZodiacSelector) {
    window.requestAnimationFrame(() => centerActiveZodiacButton());
  }

  renderReaderSelectorDots();
  hydrateFeaturedReaderHeroLine(reader);
}

function renderZodiacSelector() {
  if (!zodiacSelector) {
    return false;
  }

  if (zodiacSelector.querySelector(".veilwalker-zodiac-track")) {
    updateZodiacActiveState();
    return true;
  }

  const activeReader = getFeaturedReader();

  const zodiacButtons = zodiacOrder
    .map((sign) => {
      const reader = orderedReaderProfiles.find((item) => (item.sign || item.zodiac) === sign);

      if (!reader) {
        return "";
      }

      const isActive = activeReader?.id === reader.id;
      const iconPath = getZodiacIconPath(sign);

      return `
        <button
          class="veilwalker-zodiac-button${isActive ? " is-active" : ""}"
          type="button"
          data-reader-select-id="${escapeHtml(reader.id)}"
          aria-label="Select ${escapeHtml(sign)} Veilwalker"
          aria-pressed="${isActive ? "true" : "false"}"
          aria-selected="${isActive ? "true" : "false"}"
          ${isActive ? 'aria-current="true"' : ""}
        >
          <span class="veilwalker-zodiac-button__glyph" aria-hidden="true">
            <span class="veilwalker-zodiac-button__icon" style="--zodiac-icon: url('${escapeHtml(iconPath)}')"></span>
          </span>
          <span>${escapeHtml(sign)}</span>
        </button>
      `;
    })
    .join("");

  zodiacSelector.innerHTML = `
    <button class="veilwalker-zodiac-arrow veilwalker-zodiac-arrow--prev" type="button" data-zodiac-strip-nav="prev" aria-label="Previous Veilwalker"></button>
    <div class="veilwalker-zodiac-track">
      ${zodiacButtons}
    </div>
    <button class="veilwalker-zodiac-arrow veilwalker-zodiac-arrow--next" type="button" data-zodiac-strip-nav="next" aria-label="Next Veilwalker"></button>
  `;

  window.requestAnimationFrame(() => centerActiveZodiacButton({ behavior: "auto" }));
  return false;
}

function renderReaderSelectorDots() {
  if (!readerSelectorDots) {
    return;
  }

  const activeReader = getFeaturedReader();

  readerSelectorDots.innerHTML = orderedReaderProfiles
    .map((reader) => {
      const isActive = activeReader?.id === reader.id;
      const sign = reader.sign || reader.zodiac || reader.name;

      return `
        <button
          class="veilwalker-selector-dot${isActive ? " is-active" : ""}"
          type="button"
          data-reader-dot-id="${escapeHtml(reader.id)}"
          aria-label="Select ${escapeHtml(sign)} Veilwalker"
          aria-current="${isActive ? "true" : "false"}"
        ></button>
      `;
    })
    .join("");
}

// Updates the open lightbox without closing it, so form and next/previous navigation feel immediate.
function renderOpenReader(reader) {
  if (!reader || !readerLightbox) {
    return;
  }

  const presentation = getReaderPresentation(reader);
  const lore =
    presentation.lore ||
    presentation.backstory ||
    presentation.description ||
    "A trusted Astral Veil guide for reflective, atmospheric tarot readings.";
  const title = presentation.title || presentation.readingStyle || presentation.energy;
  const detailAccentClass = getReaderDetailAccentClass(reader);
  const activeForm = getActiveReaderForm(reader);
  const fallbackImage = presentation.phase1Image || presentation.image;
  const activeImage = activeForm?.image || presentation.image;
  const isProtectedVisual = isProtectedReaderVisual(reader, activeImage);

  lightboxImage.hidden = false;
  lightboxImage.dataset.fallbackApplied = "false";
  lightboxImage.onerror = () => {
    if (lightboxImage.dataset.fallbackApplied !== "true" && fallbackImage) {
      lightboxImage.dataset.fallbackApplied = "true";
      lightboxImage.src = fallbackImage;
      return;
    }

    lightboxImage.hidden = true;
  };
  lightboxImage.src = activeImage;
  lightboxImage.alt = presentation.name;
  lightboxImage.dataset.imagePreviewTitle = presentation.name;
  lightboxImage.dataset.imagePreviewCaption = getReaderImagePreviewCaption(activeForm, title);
  lightboxImage.dataset.imagePreviewMinimal = "true";
  lightboxImage.draggable = !isProtectedVisual;
  lightboxImage.classList.toggle("protected-media", isProtectedVisual);
  if (isProtectedVisual) {
    lightboxImage.setAttribute("data-protected-media", "true");
  } else {
    lightboxImage.removeAttribute("data-protected-media");
  }
  readerLightbox.querySelector(".reader-lightbox__dialog").className =
    `reader-lightbox__dialog${detailAccentClass}`;
  readerLightbox.querySelector(".reader-lightbox__content").innerHTML = `
    <div class="reader-detail">
      <p class="reader-detail__counter">${activeReaderIndex + 1} of ${orderedReaderProfiles.length}</p>
      <div class="reader-detail__badges">
        <span>${escapeHtml(presentation.sign || presentation.zodiac)}</span>
        <span>${escapeHtml(presentation.element)}</span>
      </div>
      <h2 id="reader-lightbox-title" data-lightbox-name>${escapeHtml(presentation.name)}</h2>
      <p class="reader-detail__title" data-lightbox-energy>${escapeHtml(title)}</p>
      <p class="reader-detail__lore">${escapeHtml(lore)}</p>
      ${activeForm?.description ? `<p class="reader-detail__form-description">${escapeHtml(activeForm.description)}</p>` : ""}
      ${renderReaderFormSelector(reader, activeForm)}
      ${renderReaderThemes(presentation)}
      ${renderBloodMoonSignal(reader)}
      <div class="reader-detail__nav" aria-label="Browse Veilwalkers">
        <button class="reader-detail__nav-button" type="button" data-reader-lightbox-nav="prev" aria-label="Previous Veilwalker">
          <span aria-hidden="true">&lsaquo;</span>
        </button>
        <button class="reader-detail__nav-button" type="button" data-reader-lightbox-nav="next" aria-label="Next Veilwalker">
          <span aria-hidden="true">&rsaquo;</span>
        </button>
      </div>
    </div>
  `;
}

// Opens a reader profile and resets the active form to the starting portrait.
function openReaderLightbox(readerId) {
  if (!readerLightbox) {
    return;
  }

  if (!orderedReaderProfiles.length) {
    orderedReaderProfiles = getAllReadersInOrder();
  }

  activeReaderIndex = orderedReaderProfiles.findIndex((item) => item.id === readerId);

  if (activeReaderIndex === -1) {
    return;
  }

  activeReaderFormId = "phase1";
  renderOpenReader(orderedReaderProfiles[activeReaderIndex]);
  readerLightbox.classList.add("is-open");
  readerLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
}

// Moves through readers with wrapping navigation.
function moveReaderLightbox(direction) {
  if (!readerLightbox?.classList.contains("is-open") || !orderedReaderProfiles.length) {
    return;
  }

  const offset = direction === "next" ? 1 : -1;

  activeReaderIndex =
    (activeReaderIndex + offset + orderedReaderProfiles.length) % orderedReaderProfiles.length;
  activeReaderFormId = "phase1";
  renderOpenReader(orderedReaderProfiles[activeReaderIndex]);
}

// Changes the selected reader form/revelation inside the lightbox.
function selectReaderForm(formId) {
  if (activeReaderIndex === -1 || !formId) {
    return;
  }

  const activeReader = orderedReaderProfiles[activeReaderIndex];
  const forms = getAvailableReaderForms(activeReader);

  if (!forms.some((form) => form.id === formId)) {
    return;
  }

  activeReaderFormId = formId;
  renderOpenReader(activeReader);
}

function openReaderSignal(readerId, trigger) {
  const reader = orderedReaderProfiles.find((item) => item.id === readerId);
  const transmission = reader?.bloodMoonSignal?.transmission;

  // The recovered transmission lives with Lyssara in Blood Moon mode, keeping
  // this clue in the Veilwalkers record instead of the Lumen Archive.
  if (!transmission || !isBloodMoonActive() || !window.AstralVeilScrollReader) {
    return;
  }

  window.AstralVeilScrollReader.open({
    variant: "noctis",
    label: transmission.label,
    title: transmission.title,
    author: transmission.author,
    body: transmission.body,
    trigger
  });
}

function closeReaderLightbox() {
  if (!readerLightbox) {
    return;
  }

  readerLightbox.classList.remove("is-open");
  readerLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
  activeReaderIndex = -1;
  activeReaderFormId = "phase1";
}

renderReaderProfiles();

window.addEventListener("astralveil:reader-lines-ready", () => {
  hydrateFeaturedReaderHeroLine(getFeaturedReader());
});

////////////////////////////////////////////////////
// Veilwalker Event Listeners
////////////////////////////////////////////////////

if (readersPageList) {
  readersPageList.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-reader-selector-nav]");
    const profileButton = event.target.closest("[data-reader-profile-id]");
    const beginButton = event.target.closest("[data-reader-begin-id]");

    if (navButton) {
      moveFeaturedReader(navButton.dataset.readerSelectorNav);
      return;
    }

    if (profileButton) {
      openReaderLightbox(profileButton.dataset.readerProfileId);
      return;
    }

    if (beginButton) {
      beginReadingWithReader(beginButton.dataset.readerBeginId);
    }
  });

  readersPageList.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFeaturedReader("prev");
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFeaturedReader("next");
    }
  });

  readersPageList.addEventListener("touchstart", (event) => {
    selectorTouchStartX = event.changedTouches[0]?.clientX || 0;
    selectorTouchStartY = event.changedTouches[0]?.clientY || 0;
  }, { passive: true });

  readersPageList.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX || 0;
    const touchEndY = event.changedTouches[0]?.clientY || 0;
    const deltaX = touchEndX - selectorTouchStartX;
    const deltaY = touchEndY - selectorTouchStartY;

    if (Math.abs(deltaX) > 68 && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      moveFeaturedReader(deltaX < 0 ? "next" : "prev");
    }
  }, { passive: true });
}

if (zodiacSelector) {
  zodiacSelector.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-zodiac-strip-nav]");
    const zodiacButton = event.target.closest("[data-reader-select-id]");

    if (navButton) {
      moveFeaturedReader(navButton.dataset.zodiacStripNav);
      return;
    }

    if (zodiacButton) {
      setFeaturedReader(zodiacButton.dataset.readerSelectId);
    }
  });
}

if (readerSelectorDots) {
  readerSelectorDots.addEventListener("click", (event) => {
    const dotButton = event.target.closest("[data-reader-dot-id]");

    if (dotButton) {
      setFeaturedReader(dotButton.dataset.readerDotId);
    }
  });
}

closeLightboxButtons.forEach((button) => {
  button.addEventListener("click", closeReaderLightbox);
});

if (readerLightbox) {
  readerLightbox.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-reader-lightbox-nav]");
    const formButton = event.target.closest("[data-reader-form-id]");
    const signalButton = event.target.closest("[data-reader-signal]");

    if (navButton) {
      moveReaderLightbox(navButton.dataset.readerLightboxNav);
    }

    if (formButton) {
      selectReaderForm(formButton.dataset.readerFormId);
    }

    if (signalButton) {
      openReaderSignal(signalButton.dataset.readerSignal, signalButton);
    }
  });

  readerLightbox.addEventListener("touchstart", (event) => {
    lightboxTouchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  readerLightbox.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX || 0;
    const swipeDistance = touchEndX - lightboxTouchStartX;

    if (Math.abs(swipeDistance) < 48) {
      return;
    }

    moveReaderLightbox(swipeDistance < 0 ? "next" : "prev");
  }, { passive: true });

  readerLightbox.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 28) {
      return;
    }

    const now = Date.now();

    if (now - lastLightboxNavAt < 360) {
      return;
    }

    lastLightboxNavAt = now;
    event.preventDefault();
    moveReaderLightbox(event.deltaX > 0 ? "next" : "prev");
  }, { passive: false });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeReaderLightbox();
  }

  if (event.key === "ArrowRight") {
    moveReaderLightbox("next");
  }

  if (event.key === "ArrowLeft") {
    moveReaderLightbox("prev");
  }
});
