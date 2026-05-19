const archiveContent = document.querySelectorAll("[data-archive-content]");
const archiveLocked = document.querySelector("[data-archive-locked]");
const archiveFooterLink = document.querySelector("[data-archive-footer-link]");
const archivePanels = document.querySelectorAll("[data-archive-panel]");
const journalEntryList = document.querySelector("[data-journal-entry-list]");
const journalModal = document.querySelector("[data-journal-modal]");
const journalModalLabel = document.querySelector("[data-journal-modal-label]");
const journalModalTitle = document.querySelector("[data-journal-modal-title]");
const journalModalMeta = document.querySelector("[data-journal-modal-meta]");
const journalModalBody = document.querySelector("[data-journal-modal-body]");
const journalModalAnnotation = document.querySelector("[data-journal-modal-annotation]");
const journalCounter = document.querySelector("[data-journal-counter]");
const journalPreviousButton = document.querySelector("[data-journal-prev]");
const journalNextButton = document.querySelector("[data-journal-next]");
const closeJournalButtons = document.querySelectorAll("[data-close-journal-entry]");
const visualRecordsGallery = document.querySelector("[data-visual-records-gallery]");
const visualRecordModal = document.querySelector("[data-visual-record-modal]");
const visualRecordModalImage = document.querySelector("[data-visual-record-modal-image]");
const visualRecordModalStatus = document.querySelector("[data-visual-record-modal-status]");
const visualRecordModalTitle = document.querySelector("[data-visual-record-modal-title]");
const visualRecordModalCaption = document.querySelector("[data-visual-record-modal-caption]");
const closeVisualRecordButtons = document.querySelectorAll("[data-close-visual-record]");

let activeJournalEntryIndex = 0;
let activeArchiveUpdateQueued = false;
let activeArchiveNavigationLock = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isArchiveUnlocked() {
  return Boolean(window.AstralVeilEvents?.isEventActive("bloodMoon"));
}

function getArchiveTabs() {
  return document.querySelectorAll("[data-archive-tab]");
}

function showArchivePanel(panelId) {
  archivePanels.forEach((panel) => {
    const isActive = panel.dataset.archivePanel === panelId;

    panel.classList.toggle("is-active", isActive);
  });
}

function setActiveArchiveTab(panelId) {
  getArchiveTabs().forEach((tab) => {
    const isActive = Boolean(panelId) && tab.dataset.archiveTab === panelId;

    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function getArchiveScrollOffset() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return 24;
  }

  return Math.max(header.getBoundingClientRect().bottom, 0) + 24;
}

function scrollToArchiveSection(sectionId) {
  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const scrollTop = Math.max(sectionTop - getArchiveScrollOffset(), 0);

  window.scrollTo({
    top: scrollTop,
    behavior: "smooth"
  });
}

function updateActiveArchiveTab() {
  if (!isArchiveUnlocked()) {
    setActiveArchiveTab(null);
    return;
  }

  if (activeArchiveNavigationLock && Date.now() < activeArchiveNavigationLock.expiresAt) {
    setActiveArchiveTab(activeArchiveNavigationLock.panelId);
    return;
  }

  activeArchiveNavigationLock = null;

  const visibleTop = getArchiveScrollOffset();
  const currentPanel = Array.from(archivePanels).reduce((activePanel, panel) => {
    const panelRect = panel.getBoundingClientRect();
    const hasReachedReadingPosition = panelRect.top <= visibleTop + 120;

    if (hasReachedReadingPosition && panelRect.bottom > visibleTop + 80) {
      return panel;
    }

    return activePanel;
  }, null);

  setActiveArchiveTab(currentPanel ? currentPanel.dataset.archivePanel : null);
}

function requestActiveArchiveUpdate() {
  if (activeArchiveUpdateQueued) {
    return;
  }

  activeArchiveUpdateQueued = true;

  window.requestAnimationFrame(() => {
    activeArchiveUpdateQueued = false;
    updateActiveArchiveTab();
  });
}

function openArchiveSection(tab) {
  const panelId = tab.dataset.archiveTab;
  const targetId = tab.dataset.archiveTarget || tab.getAttribute("aria-controls");

  activeArchiveNavigationLock = {
    panelId,
    expiresAt: Date.now() + 900
  };

  showArchivePanel(panelId);
  setActiveArchiveTab(panelId);

  if (targetId) {
    requestAnimationFrame(() => {
      scrollToArchiveSection(targetId);
      window.setTimeout(() => {
        if (activeArchiveNavigationLock?.panelId === panelId) {
          activeArchiveNavigationLock = null;
        }

        requestActiveArchiveUpdate();
      }, 920);
    });
  }
}

function getRomanNumeral(index) {
  return ["I", "II", "III", "IV", "V", "VI"][index] || String(index + 1);
}

function renderVisualRecords() {
  if (!visualRecordsGallery || typeof visualRecords === "undefined") {
    return;
  }

  visualRecordsGallery.innerHTML = visualRecords
    .map((record, index) => {
      const hasImage = Boolean(record.image);

      if (hasImage) {
        return `
          <figure class="archive-visual-record archive-visual-record--image">
            <button class="archive-visual-record__preview" type="button" data-open-visual-record="${escapeHtml(record.id)}">
              <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)}" loading="lazy" decoding="async" onerror="this.closest('.archive-visual-record').classList.add('is-image-missing'); this.closest('[data-open-visual-record]').removeAttribute('data-open-visual-record'); this.remove();" />
              <span class="archive-visual-record__missing">Image pending recovery</span>
            </button>
            <figcaption>
              <span>${escapeHtml(record.status || "Recovered")}</span>
              <strong>${escapeHtml(record.title)}</strong>
              <em>${escapeHtml(record.caption || "")}</em>
            </figcaption>
          </figure>
        `;
      }

      return `
        <figure class="archive-visual-record archive-visual-record--placeholder">
          <span class="archive-sketch">${escapeHtml(getRomanNumeral(index))}</span>
          <figcaption>
            <span>${escapeHtml(record.status || "Pending")}</span>
            <strong>${escapeHtml(record.title)}</strong>
            <em>${escapeHtml(record.caption || "Image pending recovery.")}</em>
          </figcaption>
        </figure>
      `;
    })
    .join("");
}

function getVisualRecordById(recordId) {
  if (typeof visualRecords === "undefined") {
    return null;
  }

  return visualRecords.find((record) => record.id === recordId) || null;
}

function openVisualRecord(recordId) {
  const record = getVisualRecordById(recordId);

  if (
    !record ||
    !record.image ||
    !visualRecordModal ||
    !visualRecordModalImage ||
    !visualRecordModalStatus ||
    !visualRecordModalTitle ||
    !visualRecordModalCaption
  ) {
    return;
  }

  visualRecordModalImage.src = record.image;
  visualRecordModalImage.alt = record.title;
  visualRecordModalImage.dataset.imagePreviewTitle = record.title;
  visualRecordModalImage.dataset.imagePreviewCaption = record.caption || "";
  visualRecordModalStatus.textContent = record.status || "Recovered";
  visualRecordModalTitle.textContent = record.title;
  visualRecordModalCaption.textContent = record.caption || "";
  visualRecordModal.classList.add("is-open");
  visualRecordModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-visual-record-modal-open");
}

function closeVisualRecord() {
  if (!visualRecordModal) {
    return;
  }

  visualRecordModal.classList.remove("is-open");
  visualRecordModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-visual-record-modal-open");

  if (visualRecordModalImage) {
    visualRecordModalImage.removeAttribute("src");
    visualRecordModalImage.alt = "";
    delete visualRecordModalImage.dataset.imagePreviewTitle;
    delete visualRecordModalImage.dataset.imagePreviewCaption;
  }
}

function renderArchiveSections() {
  const archiveIndex = document.querySelector(".archive-index");

  if (!archiveIndex || typeof archiveSections === "undefined") {
    return;
  }

  const note = archiveIndex.querySelector(".archive-index__note");
  const existingTabs = archiveIndex.querySelectorAll("[data-archive-tab]");

  existingTabs.forEach((tab) => tab.remove());

  const tabsMarkup = archiveSections
    .map(
      (section, index) => `
        <button class="archive-tab${index === 0 ? " is-active" : ""}" type="button" data-archive-tab="${escapeHtml(section.id)}" data-archive-target="${escapeHtml(section.target)}" aria-controls="${escapeHtml(section.target)}">
          <span>${escapeHtml(section.index)}</span>
          ${escapeHtml(section.label)}
        </button>
      `
    )
    .join("");

  if (note) {
    note.insertAdjacentHTML("beforebegin", tabsMarkup);
  } else {
    archiveIndex.insertAdjacentHTML("beforeend", tabsMarkup);
  }
}

function renderJournalEntries() {
  if (!journalEntryList || typeof zephyraJournalEntries === "undefined") {
    return;
  }

  // Add future Zephyra journal entries to zephyraJournalEntries; this renderer will pick them up automatically.
  journalEntryList.innerHTML = zephyraJournalEntries
    .map(
      (entry, index) => `
        <article class="journal-entry-preview">
          <p class="archive-entry__stamp">${escapeHtml(entry.label)}</p>
          <h3>${escapeHtml(entry.title)}</h3>
          <div class="archive-entry__meta">
            <span>${escapeHtml(entry.status)}</span>
          </div>
          <p>${escapeHtml(entry.excerpt)}</p>
          <button class="journal-entry-preview__button" type="button" data-open-journal-entry="${index}">
            Open Entry
          </button>
        </article>
      `
    )
    .join("");
}

function openJournalEntry(index) {
  if (typeof zephyraJournalEntries === "undefined") {
    return;
  }

  const entry = zephyraJournalEntries[index];

  if (
    !entry ||
    !journalModal ||
    !journalModalLabel ||
    !journalModalTitle ||
    !journalModalMeta ||
    !journalModalBody ||
    !journalModalAnnotation ||
    !journalCounter ||
    !journalPreviousButton ||
    !journalNextButton
  ) {
    return;
  }

  activeJournalEntryIndex = index;
  journalModalLabel.textContent = entry.label;
  journalModalTitle.textContent = entry.title;
  journalModalMeta.innerHTML = `
    <span>${escapeHtml(entry.archiveStatus)}</span>
    <span>${escapeHtml(entry.status)}</span>
    <span>Author: ${escapeHtml(entry.author)}</span>
  `;
  journalModalBody.innerHTML = entry.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  journalModalAnnotation.textContent = entry.annotation;
  journalCounter.textContent = `${index + 1} of ${zephyraJournalEntries.length}`;
  journalPreviousButton.disabled = zephyraJournalEntries.length < 2;
  journalNextButton.disabled = zephyraJournalEntries.length < 2;
  journalModal.classList.add("is-open");
  journalModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-journal-modal-open");
}

function closeJournalEntry() {
  if (!journalModal) {
    return;
  }

  journalModal.classList.remove("is-open");
  journalModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-journal-modal-open");
}

function showPreviousEntry() {
  if (typeof zephyraJournalEntries === "undefined") {
    return;
  }

  if (!zephyraJournalEntries.length) {
    return;
  }

  const nextIndex = (activeJournalEntryIndex - 1 + zephyraJournalEntries.length) % zephyraJournalEntries.length;

  openJournalEntry(nextIndex);
}

function showNextEntry() {
  if (typeof zephyraJournalEntries === "undefined") {
    return;
  }

  if (!zephyraJournalEntries.length) {
    return;
  }

  const nextIndex = (activeJournalEntryIndex + 1) % zephyraJournalEntries.length;

  openJournalEntry(nextIndex);
}

function renderArchiveAccessState() {
  const isUnlocked = isArchiveUnlocked();

  archiveContent.forEach((element) => {
    element.hidden = !isUnlocked;
  });

  if (archiveLocked) {
    archiveLocked.hidden = isUnlocked;
  }

  if (archiveFooterLink) {
    archiveFooterLink.hidden = !isUnlocked;
  }

  if (!isUnlocked) {
    closeJournalEntry();
    closeVisualRecord();
  }
}

// Future archive entries, concept art, comic panels, and hidden lore can hook into this access gate.
renderArchiveSections();
renderArchiveAccessState();
renderJournalEntries();
renderVisualRecords();
showArchivePanel("journal");
setActiveArchiveTab(null);
requestActiveArchiveUpdate();

document.querySelectorAll("[data-archive-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    openArchiveSection(tab);
  });
});

window.addEventListener("astralVeilBloodMoonChange", renderArchiveAccessState);
window.addEventListener("astralVeilBloodMoonChange", requestActiveArchiveUpdate);
window.addEventListener("scroll", requestActiveArchiveUpdate, { passive: true });
window.addEventListener("resize", requestActiveArchiveUpdate);

if (journalEntryList) {
  journalEntryList.addEventListener("click", (event) => {
    const entryButton = event.target.closest("[data-open-journal-entry]");

    if (entryButton) {
      openJournalEntry(Number(entryButton.dataset.openJournalEntry));
    }
  });
}

closeJournalButtons.forEach((button) => {
  button.addEventListener("click", closeJournalEntry);
});

if (journalPreviousButton) {
  journalPreviousButton.addEventListener("click", showPreviousEntry);
}

if (journalNextButton) {
  journalNextButton.addEventListener("click", showNextEntry);
}

if (visualRecordsGallery) {
  visualRecordsGallery.addEventListener("click", (event) => {
    const previewButton = event.target.closest("[data-open-visual-record]");

    if (previewButton && !previewButton.closest(".is-image-missing")) {
      openVisualRecord(previewButton.dataset.openVisualRecord);
    }
  });
}

closeVisualRecordButtons.forEach((button) => {
  button.addEventListener("click", closeVisualRecord);
});

if (visualRecordModalImage) {
  visualRecordModalImage.addEventListener("error", closeVisualRecord);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeJournalEntry();
    closeVisualRecord();
  }
});
