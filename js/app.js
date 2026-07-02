const themeToggleButton = document.querySelector("[data-theme-toggle]");
const themeStorageKey = "dailyTarotTheme";
const bloodMoonEventId = "bloodMoon";
const bloodMoonEventStorageKey =
  window.AstralVeilEvents?.getEventStorageKey(bloodMoonEventId) || "astralVeilBloodMoonActive";
const bloodMoonReadingPageHref = "index.html";
const lumenArchiveNavItem = {
  label: "LUMEN ARCHIVE",
  href: "lumen-archive.html"
};
const noctisArchiveNavItem = {
  label: "NOCTIS ARCHIVE",
  href: "archive.html"
};
const bloodMoonRitualStorageKey = "astralVeilThemeRitualSteps";
const BLOOD_MOON_TOGGLE_THRESHOLD = 10;
const angelNumberActivationMessages = [
  "The moon answered.",
  "The silver light cracked.",
  "The Veil thinned."
];
const ritualActivationMessages = [
  "The moon remembers the pattern.",
  "The silver moon cracked.",
  "A hidden rhythm has been answered."
];

// Start each regular page in ordinary Sun/Moon mode unless an event test override reactivates Blood Moon.
try {
  localStorage.removeItem(bloodMoonEventStorageKey);
} catch (error) {
  // Ignore storage access errors; the event helper still starts inactive.
}
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".navbar__menu-toggle");
const mobileMenu = document.querySelector(".navbar__mobile-menu");
let navLinks = document.querySelectorAll(".navbar__link, .navbar__mobile-link");
let mobileMenuLinks = document.querySelectorAll(".navbar__mobile-link");
let expandedImagePreview = null;
let expandedImagePreviewImage = null;
let angelWindowTimer = null;

const polishedImageSelector = [
  "[data-expandable-image]",
  "[data-active-reader-image]",
  "[data-lightbox-image]",
  "[data-lightbox-card-image]",
  "[data-deck-info-image]",
  "[data-lumen-arrival-hero-img]",
  "[data-lumen-dashboard-hero-img]",
  "[data-lumen-dashboard-seal-img]",
  ".reader-card img",
  ".reader-selection-orbit img",
  ".reader-image-carousel img",
  ".reader-feature-card img",
  ".active-reader-header img",
  ".deck-collection-card img",
  ".deck-selection-card img",
  ".deck-focused-carousel img",
  ".deck-viewer img",
  ".deck-thumbnail img",
  ".tarot-card img",
  ".card-image",
  ".combined-reading__thread-card-image img",
  ".archive-chamber-card img",
  ".archive-chamber-thumbnail img",
  ".archive-artifact-preview-image",
  ".archive-visual-record img",
  ".archive-featured-image img",
  ".archive-gallery-record img",
  ".gallery-record-card img",
  ".gallery-featured-card img",
  ".gallery-record-modal img",
  ".gallery-trail-row__thumb img",
  ".gallery-mini-thumb img",
  ".visual-record-modal img",
  ".entry-desk-hero__image",
  ".lumen-room-hero-img",
  ".lumen-arrival-hero-img",
  ".lumen-room-preview-img",
  ".lumen-image-lightbox__image",
  ".sanctuary-portal-image",
  ".lumen-atrium__image img",
  ".veilwalker-feature__image",
  ".about-living__media img"
].join(", ");

function isProtectedOrPrivateElement(element) {
  return Boolean(element?.closest?.(
    '[data-private-card="true"], .private-data-card, [data-protected-media="true"], .protected-media'
  ));
}

function isProtectedMediaElement(element) {
  return Boolean(element?.closest?.('[data-protected-media="true"], .protected-media'));
}

////////////////////////////////////////////////////
// Polished Image Loading
////////////////////////////////////////////////////

function hasLoadableImageSource(image) {
  return Boolean(image?.currentSrc || image?.getAttribute?.("src") || image?.getAttribute?.("srcset"));
}

function isTinyIconImage(image) {
  const source = image?.currentSrc || image?.getAttribute?.("src") || "";

  return /\.(svg)(?:[?#].*)?$/i.test(source) || /\/assets\/icons\//i.test(source);
}

function shouldPolishImageLoad(image) {
  if (!(image instanceof HTMLImageElement) || image.dataset.imageLoadPolish === "off") {
    return false;
  }

  if (!hasLoadableImageSource(image) || isTinyIconImage(image)) {
    return false;
  }

  if (image.matches(polishedImageSelector) || image.closest("[data-protected-media='true'], .protected-media")) {
    return true;
  }

  const source = image.currentSrc || image.getAttribute("src") || "";

  return /\/assets\/(?:images|noctis)\//i.test(source) || /\/public\/assets\/noctis\//i.test(source);
}

function markImageLoaded(image, { instant = false } = {}) {
  image.classList.remove("image-loading", "image-load-error");
  image.classList.add("image-loaded");
  image.classList.toggle("image-loaded--instant", instant);
}

function markImageLoadError(image) {
  image.classList.remove("image-loading", "image-loaded", "image-loaded--instant");
  image.classList.add("image-load-error");
}

function markImageLoading(image) {
  image.classList.remove("image-loaded", "image-loaded--instant", "image-load-error");
  image.classList.add("image-loading");
}

function preparePolishedImage(image) {
  if (!shouldPolishImageLoad(image)) {
    return;
  }

  image.dataset.imageLoadPolish = "on";
  image.decoding = image.decoding || "async";

  if (image.complete && image.naturalWidth > 0) {
    markImageLoaded(image, { instant: true });
  } else {
    markImageLoading(image);
  }

  if (image.dataset.imageLoadListenersAttached === "true") {
    return;
  }

  image.dataset.imageLoadListenersAttached = "true";
  image.addEventListener("load", () => markImageLoaded(image));
  image.addEventListener("error", () => markImageLoadError(image));
}

function preparePolishedImages(root = document) {
  if (root instanceof HTMLImageElement) {
    preparePolishedImage(root);
    return;
  }

  root.querySelectorAll?.("img").forEach(preparePolishedImage);
}

function watchPolishedImages() {
  document.documentElement.classList.add("image-load-states-enabled");
  preparePolishedImages();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        preparePolishedImage(mutation.target);
        return;
      }

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          preparePolishedImages(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["src", "srcset"]
  });
}

window.AstralVeilImages = {
  prepare: preparePolishedImage,
  prepareAll: preparePolishedImages
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", watchPolishedImages, { once: true });
} else {
  watchPolishedImages();
}

document.addEventListener("dragstart", (event) => {
  if (isProtectedOrPrivateElement(event.target)) {
    event.preventDefault();
  }
});

document.addEventListener("contextmenu", (event) => {
  if (isProtectedMediaElement(event.target)) {
    event.preventDefault();
  }
});

////////////////////////////////////////////////////
// Shared Navigation and Image Preview Helpers
////////////////////////////////////////////////////

// Re-query links after Blood Moon adds or removes event-only navigation items.
function refreshNavCollections() {
  navLinks = document.querySelectorAll(".navbar__link, .navbar__mobile-link");
  mobileMenuLinks = document.querySelectorAll(".navbar__mobile-link");
}

// Builds the reusable image preview dialog the first time any expandable image is opened.
function createExpandedImagePreview() {
  if (expandedImagePreview) {
    return expandedImagePreview;
  }

  expandedImagePreview = document.createElement("div");
  expandedImagePreview.className = "image-preview";
  expandedImagePreview.setAttribute("aria-hidden", "true");
  expandedImagePreview.innerHTML = `
    <button class="image-preview__backdrop" type="button" data-close-image-preview aria-label="Close expanded image"></button>
    <div class="image-preview__dialog" role="dialog" aria-modal="true" aria-label="Expanded image">
      <button class="image-preview__close" type="button" data-close-image-preview aria-label="Close expanded image">
        <span class="close-circle-icon" aria-hidden="true"></span>
      </button>
      <img class="image-preview__image" alt="" data-image-preview-image />
    </div>
  `;

  document.body.appendChild(expandedImagePreview);
  expandedImagePreviewImage = expandedImagePreview.querySelector("[data-image-preview-image]");

  expandedImagePreview.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-image-preview]")) {
      closeExpandedImagePreview();
    }
  });

  return expandedImagePreview;
}

function getExpandableImageData(trigger) {
  const image = trigger.matches("img") ? trigger : trigger.querySelector("img");
  const previewSource = trigger.dataset.imagePreviewSrc || "";
  const minimal =
    trigger.dataset.imagePreviewMinimal === "true" || image?.dataset.imagePreviewMinimal === "true";

  const rawSource = image?.getAttribute("src") || "";

  if (previewSource) {
    return {
      src: previewSource,
      alt: trigger.dataset.imagePreviewAlt || trigger.dataset.imagePreviewTitle || "Expanded image",
      title: trigger.dataset.imagePreviewTitle || "Expanded image",
      caption: trigger.dataset.imagePreviewCaption || "",
      minimal,
      protected: isProtectedMediaElement(trigger)
    };
  }

  if (!image || image.hidden || (!rawSource && !image.currentSrc)) {
    return null;
  }

  return {
    src: image.currentSrc || rawSource,
    alt: image.alt || trigger.dataset.imagePreviewTitle || "Expanded image",
    title: trigger.dataset.imagePreviewTitle || image.dataset.imagePreviewTitle || image.alt || "Expanded image",
    caption: trigger.dataset.imagePreviewCaption || image.dataset.imagePreviewCaption || "",
    minimal,
    protected: isProtectedMediaElement(trigger) || isProtectedMediaElement(image)
  };
}

// Opens the shared lightbox for card art, reader portraits, and archive images.
function openExpandedImagePreview(imageData) {
  if (!imageData?.src) {
    return;
  }

  createExpandedImagePreview();
  expandedImagePreviewImage.src = imageData.src;
  expandedImagePreviewImage.alt = imageData.alt;
  preparePolishedImage(expandedImagePreviewImage);
  expandedImagePreviewImage.draggable = !imageData.protected;
  expandedImagePreviewImage.classList.toggle("protected-media", Boolean(imageData.protected));
  if (imageData.protected) {
    expandedImagePreviewImage.setAttribute("data-protected-media", "true");
  } else {
    expandedImagePreviewImage.removeAttribute("data-protected-media");
  }
  expandedImagePreview.classList.toggle("image-preview--minimal", Boolean(imageData.minimal));
  expandedImagePreview.classList.add("is-open");
  expandedImagePreview.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-image-preview-open");
}

// Clears the lightbox image source when closed so large images do not remain active unnecessarily.
function closeExpandedImagePreview() {
  if (!expandedImagePreview) {
    return;
  }

  expandedImagePreview.classList.remove("is-open");
  expandedImagePreview.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-image-preview-open");

  if (expandedImagePreviewImage) {
    expandedImagePreviewImage.removeAttribute("src");
    expandedImagePreviewImage.alt = "";
    expandedImagePreviewImage.draggable = true;
    expandedImagePreviewImage.classList.remove("protected-media");
    expandedImagePreviewImage.removeAttribute("data-protected-media");
  }
}

window.AstralVeilImagePreview = {
  open: openExpandedImagePreview,
  close: closeExpandedImagePreview
};

////////////////////////////////////////////////////
// Global Toasts
////////////////////////////////////////////////////

let astralToastRegion = null;
let astralToastSequence = 0;

function getAstralToastRegion() {
  if (astralToastRegion?.isConnected) {
    return astralToastRegion;
  }

  astralToastRegion = document.createElement("div");
  astralToastRegion.className = "astral-toast-region";
  astralToastRegion.setAttribute("aria-live", "polite");
  astralToastRegion.setAttribute("aria-atomic", "false");
  document.body.appendChild(astralToastRegion);

  return astralToastRegion;
}

function removeAstralToast(toast, timerId) {
  if (!toast?.isConnected) {
    return;
  }

  window.clearTimeout(timerId);
  toast.classList.add("is-leaving");

  window.setTimeout(() => {
    toast.remove();
  }, 180);
}

function showAstralToast({ title = "", message = "", type = "default", duration = 6000 } = {}) {
  if (!document.body) {
    return null;
  }

  const normalizedType = String(type || "default").replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "default";
  const toast = document.createElement("article");
  const toastId = `astral-toast-${astralToastSequence += 1}`;
  const titleId = `${toastId}-title`;
  const messageId = `${toastId}-message`;
  toast.className = `astral-toast astral-toast--${normalizedType}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-labelledby", titleId);
  toast.setAttribute("aria-describedby", messageId);

  const content = document.createElement("div");
  content.className = "astral-toast__content";

  const titleElement = document.createElement("p");
  titleElement.className = "astral-toast__title";
  titleElement.id = titleId;
  titleElement.textContent = title || "Fragment Recovered";

  const messageElement = document.createElement("p");
  messageElement.className = "astral-toast__message";
  messageElement.id = messageId;
  messageElement.textContent = message || "A hidden piece has answered from the dark.";

  const closeButton = document.createElement("button");
  closeButton.className = "astral-toast__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Dismiss message");
  closeButton.textContent = "×";

  content.append(titleElement, messageElement);
  toast.append(content, closeButton);

  const normalizedDuration = Number.isFinite(Number(duration))
    ? Math.min(Math.max(Number(duration), 5000), 7000)
    : 6000;
  const timerId = window.setTimeout(() => removeAstralToast(toast, timerId), normalizedDuration);

  closeButton.addEventListener("click", () => removeAstralToast(toast, timerId));
  getAstralToastRegion().appendChild(toast);

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  return toast;
}

window.AstralVeilToast = {
  show: showAstralToast
};

window.addEventListener("astralveil:toast", (event) => {
  showAstralToast(event.detail || {});
});

////////////////////////////////////////////////////
// Blood Moon Event Shell
////////////////////////////////////////////////////

// Ordinary Sun/Moon navigation shows the light-side archive; Blood Moon swaps it
// for the Noctis event link so both archive doors are not advertised together.
function updateLumenArchiveNav(isVisible) {
  const desktopLinks = document.querySelector(".navbar__links");
  const existingDesktopLink = document.querySelector("[data-lumen-archive-nav-link]");
  const existingMobileLink = document.querySelector("[data-lumen-archive-mobile-nav-link]");
  const footerLinks = document.querySelectorAll("[data-lumen-archive-footer-link]");
  const archiveFooterLinks = document.querySelectorAll("[data-archive-footer-link]");

  footerLinks.forEach((link) => {
    link.hidden = !isVisible;
  });
  archiveFooterLinks.forEach((link) => {
    link.hidden = isVisible;
  });

  document.querySelectorAll("[data-footer-drawer] .site-footer__nav").forEach((footerNav) => {
    let noctisFooterLink = footerNav.querySelector("[data-archive-footer-link]");

    if (!noctisFooterLink) {
      noctisFooterLink = document.createElement("a");
      noctisFooterLink.href = noctisArchiveNavItem.href;
      noctisFooterLink.textContent = "Noctis Archive";
      noctisFooterLink.dataset.archiveFooterLink = "";

      const lumenFooterLink = footerNav.querySelector("[data-lumen-archive-footer-link]");
      if (lumenFooterLink) {
        lumenFooterLink.insertAdjacentElement("afterend", noctisFooterLink);
      } else {
        footerNav.appendChild(noctisFooterLink);
      }
    }

    noctisFooterLink.hidden = isVisible;
  });

  if (!isVisible) {
    existingDesktopLink?.closest("li")?.remove();
    existingMobileLink?.remove();
    refreshNavCollections();
    return;
  }

  if (desktopLinks && !existingDesktopLink) {
    const archiveItem = document.createElement("li");
    const targetItem = Array.from(desktopLinks.querySelectorAll("a"))
      .find((link) => ["journal.html", "about.html"].includes(getNormalizedNavPath(link.href)))
      ?.closest("li");

    archiveItem.innerHTML = `
      <a class="navbar__link navbar__link--featured navbar__link--lumen-archive" href="${lumenArchiveNavItem.href}" data-lumen-archive-nav-link>
        ${lumenArchiveNavItem.label}
      </a>
    `;
    desktopLinks.insertBefore(archiveItem, targetItem || null);
  }

  if (mobileMenu && !existingMobileLink) {
    const archiveLink = document.createElement("a");
    const targetLink = Array.from(mobileMenu.querySelectorAll("a"))
      .find((link) => ["journal.html", "about.html"].includes(getNormalizedNavPath(link.href)));

    archiveLink.className = "navbar__mobile-link navbar__mobile-link--featured navbar__mobile-link--lumen-archive";
    archiveLink.href = lumenArchiveNavItem.href;
    archiveLink.textContent = lumenArchiveNavItem.label;
    archiveLink.dataset.lumenArchiveMobileNavLink = "";
    mobileMenu.insertBefore(archiveLink, targetLink || null);
  }

  refreshNavCollections();
}

// Event-only navigation lives here so future event pages can be added without editing every HTML file.
function updateBloodMoonNav(isActive) {
  const desktopLinks = document.querySelector(".navbar__links");
  const existingDesktopLink = document.querySelector("[data-blood-moon-nav-link]");
  const existingMobileLink = document.querySelector("[data-blood-moon-mobile-nav-link]");
  const archiveNavItem = window.AstralVeilEvents
    ?.getEventConfig(bloodMoonEventId)
    ?.navItems?.[0] || noctisArchiveNavItem;

  if (!isActive) {
    existingDesktopLink?.closest("li")?.remove();
    existingMobileLink?.remove();
    updateLumenArchiveNav(true);
    refreshNavCollections();
    setActiveNavLink(window.location.href);
    return;
  }

  updateLumenArchiveNav(false);

  if (desktopLinks && !existingDesktopLink) {
    const archiveItem = document.createElement("li");
    const targetItem = Array.from(desktopLinks.querySelectorAll("a"))
      .find((link) => ["journal.html", "about.html"].includes(getNormalizedNavPath(link.href)))
      ?.closest("li");

    archiveItem.innerHTML = `
      <a class="navbar__link navbar__link--blood-moon" href="${archiveNavItem.href}" data-blood-moon-nav-link>
        ${archiveNavItem.label}
      </a>
    `;
    desktopLinks.insertBefore(archiveItem, targetItem || null);
  }

  if (mobileMenu && !existingMobileLink) {
    const archiveLink = document.createElement("a");
    const targetLink = Array.from(mobileMenu.querySelectorAll("a"))
      .find((link) => ["journal.html", "about.html"].includes(getNormalizedNavPath(link.href)));

    archiveLink.className = "navbar__mobile-link navbar__mobile-link--blood-moon";
    archiveLink.href = archiveNavItem.href;
    archiveLink.textContent = archiveNavItem.label;
    archiveLink.dataset.bloodMoonMobileNavLink = "";
    mobileMenu.insertBefore(archiveLink, targetLink || null);
  }

  refreshNavCollections();
  setActiveNavLink(window.location.href);
}

// Blood Moon replaces the ordinary theme toggle with a single nav control that exits the event.
function updateBloodMoonControl(isActive) {
  const existingControl = document.querySelector("[data-end-blood-moon-control]");

  if (!isActive) {
    existingControl?.remove();
    return;
  }

  if (existingControl) {
    return;
  }

  const themeToggle = themeToggleButton?.closest(".theme-toggle");
  const control = document.createElement("button");

  control.className = "blood-moon-nav-control";
  control.dataset.endBloodMoonControl = "";
  control.dataset.endBloodMoon = "";
  control.type = "button";
  control.setAttribute("aria-label", "Seal the Veil and return to normal mode");
  control.title = "Seal the Veil";
  control.innerHTML = `
    <img class="blood-moon-nav-control__sigil" src="assets/icons/symbols/seal-button-transparent.png" alt="" aria-hidden="true" width="512" height="512" />
    <span class="blood-moon-nav-control__label">bloodmoon</span>
  `;

  if (themeToggle) {
    themeToggle.insertAdjacentElement("afterend", control);
    return;
  }

  navbar?.appendChild(control);
}

// Broadcasts event changes so reading, deck, archive, and reader pages can update independently.
function notifyBloodMoonStateChange(isActive) {
  if (window.AstralVeilEvents) {
    window.AstralVeilEvents.notifyEventStateChange(bloodMoonEventId, isActive);
    return;
  }

  window.dispatchEvent(
    new CustomEvent("astralVeilBloodMoonChange", {
      detail: { isActive }
    })
  );
}

// Reads Blood Moon state through the event helper, with localStorage fallback for older pages.
function isBloodMoonActive() {
  if (window.AstralVeilBloodMoonAccess) {
    return window.AstralVeilBloodMoonAccess.isBloodMoonActive();
  }

  if (window.AstralVeilEvents) {
    return window.AstralVeilEvents.isEventActive(bloodMoonEventId);
  }

  try {
    return localStorage.getItem(bloodMoonEventStorageKey) === "true";
  } catch (error) {
    return false;
  }
}

function getLocalTimeParts(date = new Date()) {
  return {
    hour: date.getHours(),
    minute: date.getMinutes()
  };
}

function isTimeInWindow(timeParts, startHour, startMinute, durationMinutes) {
  const currentMinute = timeParts.hour * 60 + timeParts.minute;
  const start = startHour * 60 + startMinute;
  const end = start + durationMinutes - 1;

  return currentMinute >= start && currentMinute <= end;
}

// Zephyra answers only during narrow local-time windows; Fate excludes her outside these minutes.
function isZephyraAvailableNow(date = new Date()) {
  const timeParts = getLocalTimeParts(date);

  return (
    isTimeInWindow(timeParts, 0, 25, 11) ||
    isTimeInWindow(timeParts, 12, 25, 11) ||
    isTimeInWindow(timeParts, 11, 12, 12) ||
    isTimeInWindow(timeParts, 23, 12, 12) ||
    isTimeInWindow(timeParts, 3, 0, 60)
  );
}

// Angel-number minutes do not activate anything by themselves; they only mark the toggle as receptive.
function isAngelNumberWindow(date = new Date()) {
  const timeParts = getLocalTimeParts(date);
  const angelMinutes = [
    [3, 33],
    [15, 33],
    [4, 44],
    [16, 44],
    [11, 11],
    [23, 11]
  ];

  return angelMinutes.some(([hour, minute]) => timeParts.hour === hour && timeParts.minute === minute);
}

function getRandomBloodMoonActivationMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)] || "";
}

function showBloodMoonActivationMessage(message) {
  if (!message) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("astralVeilBloodMoonActivationMessage", {
      detail: { message }
    })
  );
}

function isReadingPage() {
  return getNormalizedNavPath(window.location.href) === bloodMoonReadingPageHref;
}

// Blood Moon always begins at the reading page so event styling cannot wrap a normal-mode page.
function redirectToBloodMoonReadingPage() {
  if (isReadingPage()) {
    return false;
  }

  window.location.assign(bloodMoonReadingPageHref);
  return true;
}

// Leaving Blood Moon from event pages returns to the reading screen so stale
// event-only views do not remain wrapped around normal Sun/Moon mode.
function redirectAfterBloodMoonDeactivation() {
  const params = new URLSearchParams(window.location.search);
  const hasBloodMoonOverride =
    params.has("bloodMoon") ||
    params.has("testBloodMoon") ||
    params.get("event")?.toLowerCase() === "bloodmoon" ||
    params.get("event")?.toLowerCase() === "blood-moon";

  if (isReadingPage() && !hasBloodMoonOverride) {
    return false;
  }

  window.location.assign(bloodMoonReadingPageHref);
  return true;
}

function clearBloodMoonStoredState() {
  if (window.AstralVeilEvents) {
    window.AstralVeilEvents.clearStoredEventState(bloodMoonEventId);
  }

  try {
    const testingStorageKey = window.AstralVeilEvents
      ?.getEventConfig(bloodMoonEventId)
      ?.testing
      ?.storageKey || "astralVeilTestBloodMoonActive";

    sessionStorage.removeItem(bloodMoonEventStorageKey);
    localStorage.removeItem(bloodMoonEventStorageKey);
    sessionStorage.removeItem(testingStorageKey);
    localStorage.removeItem(testingStorageKey);
  } catch (error) {
    return;
  }
}

// Central event activator keeps hidden triggers from re-firing once Blood Moon is already active.
function activateBloodMoon(reason = "unknown", { message = "" } = {}) {
  if (isBloodMoonActive()) {
    if (!redirectToBloodMoonReadingPage()) {
      applyBloodMoonState();
    }
    return false;
  }

  if (window.AstralVeilEvents) {
    window.AstralVeilEvents.setStoredEventState(bloodMoonEventId, true);
  } else {
    try {
      localStorage.setItem(bloodMoonEventStorageKey, "true");
    } catch (error) {
      return false;
    }
  }

  clearThemeRitualSteps();

  if (redirectToBloodMoonReadingPage()) {
    return true;
  }

  applyBloodMoonState();
  notifyBloodMoonStateChange(true);
  showBloodMoonActivationMessage(message);
  return true;
}

function getStoredThemeRitualSteps() {
  try {
    const storedValue = localStorage.getItem(bloodMoonRitualStorageKey);
    const parsedValue = JSON.parse(storedValue || "[]");

    if (Array.isArray(parsedValue)) {
      const validSteps = parsedValue.filter((step) => normalizeThemeMode(step));

      return {
        count: validSteps.length,
        lastToggleSide: normalizeThemeMode(validSteps.at(-1))
      };
    }

    return {
      count: Number(parsedValue?.count) || 0,
      lastToggleSide: normalizeThemeMode(parsedValue?.lastToggleSide)
    };
  } catch (error) {
    return {
      count: 0,
      lastToggleSide: ""
    };
  }
}

function storeThemeRitualSteps({ count = 0, lastToggleSide = "" } = {}) {
  try {
    localStorage.setItem(
      bloodMoonRitualStorageKey,
      JSON.stringify({
        count,
        lastToggleSide
      })
    );
  } catch (error) {
    return;
  }
}

function clearThemeRitualSteps() {
  try {
    localStorage.removeItem(bloodMoonRitualStorageKey);
  } catch (error) {
    return;
  }
}

// Hidden alternating Sun/Moon ritual: 10 valid side changes activate Blood Moon.
function trackThemeRitualStep(mode) {
  const normalizedMode = normalizeThemeMode(mode);

  if (!normalizedMode || isBloodMoonActive()) {
    return false;
  }

  const ritualState = getStoredThemeRitualSteps();

  if (ritualState.lastToggleSide === normalizedMode) {
    storeThemeRitualSteps({
      count: 1,
      lastToggleSide: normalizedMode
    });
    return false;
  }

  const nextCount = ritualState.count + 1;

  if (nextCount < BLOOD_MOON_TOGGLE_THRESHOLD) {
    storeThemeRitualSteps({
      count: nextCount,
      lastToggleSide: normalizedMode
    });
    return false;
  }

  clearThemeRitualSteps();
  return activateBloodMoon("theme-ritual", {
    message: getRandomBloodMoonActivationMessage(ritualActivationMessages)
  });
}

function updateAngelNumberToggleState() {
  const themeToggle = themeToggleButton?.closest(".theme-toggle");
  const isWindowOpen = !isBloodMoonActive() && isAngelNumberWindow();

  themeToggle?.classList.toggle("theme-toggle--blood-pulse", isWindowOpen);
}

function startAngelNumberWatcher() {
  updateAngelNumberToggleState();
  window.clearInterval(angelWindowTimer);
  angelWindowTimer = window.setInterval(updateAngelNumberToggleState, 1000);
}

// Applies the page-level Blood Moon class and disables the Sun/Moon toggle while the event is active.
function applyBloodMoonState() {
  const isActive = isBloodMoonActive();

  document.body.classList.toggle("blood-moon-mode", isActive);
  updateBloodMoonNav(isActive);
  updateBloodMoonControl(isActive);

  if (themeToggleButton) {
    themeToggleButton.disabled = isActive;
    if (isActive) {
      themeToggleButton.setAttribute("aria-label", "Blood Moon mode is active");
      themeToggleButton.setAttribute("aria-pressed", "true");
    }
  }

  if (isActive) {
    document.body.classList.remove("sun-mode", "moon-mode");
  }

  updateAngelNumberToggleState();
  return isActive;
}

// Blood Moon is an event state, not a theme. It persists across pages until New Reading clears it.
function activateBloodMoonEvent() {
  if (window.AstralVeilEvents) {
    window.AstralVeilEvents.setStoredEventState(bloodMoonEventId, true);
  } else {
    try {
      localStorage.setItem(bloodMoonEventStorageKey, "true");
    } catch (error) {
      return;
    }
  }

  if (redirectToBloodMoonReadingPage()) {
    return;
  }

  applyBloodMoonState();
  notifyBloodMoonStateChange(true);
}

function deactivateBloodMoonEvent() {
  clearBloodMoonStoredState();
  clearThemeRitualSteps();

  if (redirectAfterBloodMoonDeactivation()) {
    return;
  }

  applyBloodMoonState();
  setTheme(getPreferredThemeMode());
  notifyBloodMoonStateChange(false);
  redirectAfterBloodMoonDeactivation();
}

window.AstralVeilBloodMoon = {
  activateBloodMoonEvent,
  activateBloodMoon,
  deactivateBloodMoonEvent,
  isBloodMoonActive,
  isZephyraAvailableNow,
  isAngelNumberWindow,
  trackThemeRitualStep,
  isEventActive: (eventId) => window.AstralVeilEvents?.isEventActive(eventId) || false,
  applyBloodMoonState,
  updateBloodMoonNav,
  getActiveDeck: () => window.AstralVeilEvents?.getActiveDeck() || []
};

////////////////////////////////////////////////////
// Navigation Active State
////////////////////////////////////////////////////

function getNormalizedNavPath(url) {
  const path = new URL(url, window.location.href).pathname;
  const filename = path.endsWith("/") ? "index.html" : path.split("/").pop();

  return filename === "" ? "index.html" : filename;
}

// Keeps desktop and mobile nav links in sync with the current HTML page.
function setActiveNavLink(activeHref) {
  const activePath = getNormalizedNavPath(activeHref);

  navLinks.forEach((link) => {
    const isActive = getNormalizedNavPath(link.href) === activePath;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (navLinks.length) {
  updateBloodMoonNav(isBloodMoonActive());
  setActiveNavLink(window.location.href);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveNavLink(link.href);
    });
  });
}

////////////////////////////////////////////////////
// Sun/Moon Theme Persistence
////////////////////////////////////////////////////

// Manual Sun/Moon choices are saved here; first-time visitors fall back to local device time.
function normalizeThemeMode(mode) {
  return mode === "moon" ? "moon" : mode === "sun" ? "sun" : "";
}

// Returns the saved manual choice, or an empty string when the user has not chosen yet.
function getStoredThemePreference() {
  try {
    return normalizeThemeMode(localStorage.getItem(themeStorageKey));
  } catch (error) {
    return "";
  }
}

// Chooses Sun from 6:00 AM through 5:59 PM, otherwise Moon, using local device time.
function getTimeBasedThemeMode() {
  const localHour = new Date().getHours();

  return localHour >= 6 && localHour < 18 ? "sun" : "moon";
}

function getPreferredThemeMode() {
  return getStoredThemePreference() || getTimeBasedThemeMode();
}

// Persist only manual toggle choices so automatic time-based theme can still run for first visits.
function storeThemePreference(mode) {
  try {
    localStorage.setItem(themeStorageKey, mode);
  } catch (error) {
    return;
  }
}

// Applies Sun/Moon without touching Blood Moon; Blood Moon owns its own event class.
function setTheme(mode, { persist = false } = {}) {
  if (isBloodMoonActive()) {
    applyBloodMoonState();
    return;
  }

  const themeMode = normalizeThemeMode(mode) || getTimeBasedThemeMode();
  const isSunMode = themeMode === "sun";

  document.body.classList.toggle("sun-mode", isSunMode);
  document.body.classList.toggle("moon-mode", !isSunMode);
  document.body.classList.remove("blood-moon-mode");

  if (themeToggleButton) {
    themeToggleButton.disabled = false;
    themeToggleButton.setAttribute(
      "aria-label",
      isSunMode ? "Switch to moon mode" : "Switch to sun mode"
    );
    themeToggleButton.setAttribute("aria-pressed", String(!isSunMode));
  }

  if (persist) {
    storeThemePreference(themeMode);
  }
}

if (themeToggleButton) {
  if (applyBloodMoonState()) {
    themeToggleButton.setAttribute("aria-pressed", "true");
  } else {
    setTheme(getPreferredThemeMode());
  }

  themeToggleButton.addEventListener("click", () => {
    if (isBloodMoonActive()) {
      applyBloodMoonState();
      return;
    }

    const nextMode = document.body.classList.contains("sun-mode") ? "moon" : "sun";

    if (isAngelNumberWindow()) {
      activateBloodMoon("angel-number-toggle", {
        message: getRandomBloodMoonActivationMessage(angelNumberActivationMessages)
      });
      return;
    }

    setTheme(nextMode, { persist: true });
    trackThemeRitualStep(nextMode);
  });
} else {
  if (!applyBloodMoonState()) {
    setTheme(getPreferredThemeMode());
  }
}

if (themeToggleButton) {
  startAngelNumberWatcher();
}

////////////////////////////////////////////////////
// Global Interaction Listeners
////////////////////////////////////////////////////

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-end-blood-moon]")) {
    clearThemeRitualSteps();
    deactivateBloodMoonEvent();
  }
});

// Delegated image-preview listener keeps page-specific renderers simple.
document.addEventListener("click", (event) => {
  const previewTrigger = event.target.closest("[data-expandable-image]");

  if (!previewTrigger) {
    return;
  }

  const imageData = getExpandableImageData(previewTrigger);

  if (!imageData) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  openExpandedImagePreview(imageData);
});

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape" && expandedImagePreview?.classList.contains("is-open")) {
      closeExpandedImagePreview();
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target instanceof Element &&
      event.target.matches("[data-expandable-image]")
    ) {
      const imageData = getExpandableImageData(event.target);

      if (imageData) {
        openExpandedImagePreview(imageData);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  },
  true
);

window.addEventListener("storage", (event) => {
  if (event.key === bloodMoonEventStorageKey) {
    const isActive = applyBloodMoonState();
    notifyBloodMoonStateChange(isActive);
  }
});

const footerDrawers = document.querySelectorAll("[data-footer-drawer]");
const astralVeilShareData = {
  title: "Astral Veil",
  text: "Explore Astral Veil, an interactive tarot experience with hidden lore, guides, and symbolic storytelling.",
  url: "https://astralveil.world"
};

function setFooterShareStatus(footer, message) {
  const status = footer.querySelector(".site-footer__share-status");

  if (!status) {
    return;
  }

  window.clearTimeout(status._astralVeilStatusTimer);
  status.textContent = message;
  status.classList.toggle("is-visible", Boolean(message));

  if (message) {
    status._astralVeilStatusTimer = window.setTimeout(() => {
      status.textContent = "";
      status.classList.remove("is-visible");
    }, 2400);
  }
}

async function copyAstralVeilShareLink() {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(astralVeilShareData.url);
    return;
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = astralVeilShareData.url;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  temporaryInput.style.pointerEvents = "none";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();
  document.execCommand("copy");
  temporaryInput.remove();
}

if (footerDrawers.length) {
  footerDrawers.forEach((footer) => {
    const toggle = footer.querySelector(".site-footer__toggle");
    const toggleLabel = footer.querySelector("[data-footer-toggle-label]");
    const details = footer.querySelector(".site-footer__inner");
    const shareButton = footer.querySelector("[data-share-astral-veil]");

    if (toggle && details) {
      toggle.addEventListener("click", () => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        const nextExpanded = !isExpanded;

        toggle.setAttribute("aria-expanded", String(nextExpanded));
        details.hidden = !nextExpanded;
        footer.classList.toggle("is-expanded", nextExpanded);

        if (toggleLabel) {
          toggleLabel.textContent = nextExpanded ? "Close" : "Explore";
        }
      });
    }

    if (shareButton) {
      shareButton.addEventListener("click", async () => {
        try {
          if (navigator.share) {
            await navigator.share(astralVeilShareData);
            return;
          }

          await copyAstralVeilShareLink();
          setFooterShareStatus(footer, "Link copied.");
        } catch (error) {
          if (error?.name === "AbortError") {
            return;
          }

          try {
            await copyAstralVeilShareLink();
            setFooterShareStatus(footer, "Link copied.");
          } catch (copyError) {
            setFooterShareStatus(footer, "Unable to copy link.");
          }
        }
      });
    }
  });
}

// Controls the compact mobile navigation drawer and closes it on outside clicks, Escape, or desktop resize.
function setMobileMenu(isOpen) {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.classList.toggle("is-open", isOpen);
  mobileMenu.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    setMobileMenu(!mobileMenu.classList.contains("is-open"));
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest(".navbar__mobile-link")) {
      setMobileMenu(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!navbar || !mobileMenu.classList.contains("is-open")) {
      return;
    }

    if (!navbar.contains(event.target)) {
      setMobileMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenu(false);
    }
  });

  let mobileMenuResizeFrame = null;

  window.addEventListener("resize", () => {
    if (mobileMenuResizeFrame) {
      return;
    }

    mobileMenuResizeFrame = window.requestAnimationFrame(() => {
      mobileMenuResizeFrame = null;

      if (window.innerWidth > 768) {
        setMobileMenu(false);
      }
    });
  }, { passive: true });
}
