const readersPageList = document.querySelector("[data-readers-page-list]");
const readerLightbox = document.querySelector("[data-reader-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const closeLightboxButtons = document.querySelectorAll("[data-close-lightbox]");
let orderedReaderProfiles = [];
let activeReaderIndex = -1;
let activeReaderFormId = "phase1";
let lightboxTouchStartX = 0;
let lastLightboxNavAt = 0;
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

function getReaderDetailAccentClass(reader) {
  if (reader.isBloodMoon) {
    return "";
  }

  const baseElement = reader.accentClass || (reader.element || "").split("/")[0].trim().toLowerCase();

  return ["fire", "earth", "air", "water"].includes(baseElement)
    ? ` reader-lightbox__dialog--${baseElement}`
    : "";
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

// Builds the clickable Veilwalker grid from reader data.
function renderReaderProfiles() {
  if (!readersPageList || typeof tarotReaders === "undefined") {
    return;
  }

  orderedReaderProfiles = getAllReadersInOrder();

  readersPageList.innerHTML = orderedReaderProfiles
    .map(
      (reader) => {
        const presentation = getReaderPresentation(reader);
        const isBloodMoonFragment = Boolean(reader.isBloodMoon && isBloodMoonActive());
        const tagline =
          presentation.tagline ||
          presentation.title ||
          presentation.readingStyle ||
          "A trusted Astral Veil guide for reflective tarot readings.";
        const elementClass = getReaderElementClass(reader);
        const bloodMoonCardClass = getReaderBloodMoonCardClass(reader);
        const fallbackImage = presentation.phase1Image || presentation.image;

        return `
        <button class="reader-profile-card reader-profile-card--${reader.id}${elementClass}${bloodMoonCardClass}${reader.isMystery ? ` reader-profile-card--mystery reader-profile-card--${reader.mysteryAura}` : ""}${isBloodMoonFragment ? " reader-profile-card--blood-fragment" : ""}" type="button" data-reader-id="${reader.id}">
          <img src="${escapeHtml(presentation.image)}" alt="${escapeHtml(presentation.name)}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='${escapeHtml(fallbackImage)}';" />
          <div class="reader-profile-card__content">
            <div class="reader-profile-card__badges" aria-label="Reader archetype">
              ${presentation.zodiac ? `<span class="reader-profile-card__badge">${escapeHtml(presentation.zodiac)}</span>` : ""}
              ${presentation.element ? `<span class="reader-profile-card__badge reader-profile-card__badge--muted">${escapeHtml(presentation.element)}</span>` : ""}
            </div>
            <h2>${escapeHtml(presentation.name)}</h2>
            <p class="reader-profile-card__tagline">${escapeHtml(tagline)}</p>
          </div>
        </button>
      `;
      }
    )
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

////////////////////////////////////////////////////
// Veilwalker Event Listeners
////////////////////////////////////////////////////

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
