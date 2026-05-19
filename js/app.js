const themeToggleInput = document.querySelector(".theme-toggle__input");
const savedTheme = localStorage.getItem("dailyTarotTheme");
const bloodMoonEventId = "bloodMoon";
const bloodMoonEventStorageKey =
  window.AstralVeilEvents?.getEventStorageKey(bloodMoonEventId) || "astralVeilBloodMoonActive";

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

function refreshNavCollections() {
  navLinks = document.querySelectorAll(".navbar__link, .navbar__mobile-link");
  mobileMenuLinks = document.querySelectorAll(".navbar__mobile-link");
}

// Event-only navigation lives here so future event archive/lore pages can be added without editing every HTML file.
function updateBloodMoonNav(isActive) {
  const desktopLinks = document.querySelector(".navbar__links");
  const existingDesktopLink = document.querySelector("[data-blood-moon-nav-link]");
  const existingMobileLink = document.querySelector("[data-blood-moon-mobile-nav-link]");
  const archiveNavItem = window.AstralVeilEvents
    ?.getEventConfig(bloodMoonEventId)
    ?.navItems?.[0] || { label: "Noctis Archive", href: "archive.html" };

  if (!isActive) {
    existingDesktopLink?.closest("li")?.remove();
    existingMobileLink?.remove();
    refreshNavCollections();
    return;
  }

  if (desktopLinks && !existingDesktopLink) {
    const archiveItem = document.createElement("li");

    archiveItem.innerHTML = `
      <a class="navbar__link navbar__link--blood-moon" href="${archiveNavItem.href}" data-blood-moon-nav-link>
        ${archiveNavItem.label}
      </a>
    `;
    desktopLinks.appendChild(archiveItem);
  }

  if (mobileMenu && !existingMobileLink) {
    const archiveLink = document.createElement("a");

    archiveLink.className = "navbar__mobile-link navbar__mobile-link--blood-moon";
    archiveLink.href = archiveNavItem.href;
    archiveLink.textContent = archiveNavItem.label;
    archiveLink.dataset.bloodMoonMobileNavLink = "";
    mobileMenu.appendChild(archiveLink);
  }

  refreshNavCollections();
  setActiveNavLink(window.location.href);
}

function updateBloodMoonControl(isActive) {
  const existingControl = document.querySelector("[data-end-blood-moon-control]");

  if (!isActive) {
    existingControl?.remove();
    return;
  }

  if (existingControl) {
    return;
  }

  const control = document.createElement("div");

  control.className = "blood-moon-event-control";
  control.dataset.endBloodMoonControl = "";
  control.innerHTML = `
    <button class="blood-moon-event-control__button" type="button" data-end-blood-moon>
      Seal the Veil
    </button>
    <span class="blood-moon-event-control__hint">End the Blood Moon event and return to the ordinary veil.</span>
  `;

  document.body.appendChild(control);
}

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

function isBloodMoonActive() {
  if (window.AstralVeilEvents) {
    return window.AstralVeilEvents.isEventActive(bloodMoonEventId);
  }

  try {
    return localStorage.getItem(bloodMoonEventStorageKey) === "true";
  } catch (error) {
    return false;
  }
}

function applyBloodMoonState() {
  const isActive = isBloodMoonActive();

  document.body.classList.toggle("blood-moon-mode", isActive);
  updateBloodMoonNav(isActive);
  updateBloodMoonControl(isActive);

  if (themeToggleInput) {
    themeToggleInput.disabled = isActive;
    themeToggleInput.checked = isActive ? true : themeToggleInput.checked;
    themeToggleInput.setAttribute(
      "aria-label",
      isActive ? "Blood Moon mode is active" : "Switch between sun and moon mode"
    );
  }

  if (isActive) {
    document.body.classList.remove("sun-mode", "moon-mode");
  }

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

  applyBloodMoonState();
  notifyBloodMoonStateChange(true);
}

function deactivateBloodMoonEvent() {
  if (window.AstralVeilEvents) {
    window.AstralVeilEvents.clearStoredEventState(bloodMoonEventId);
  } else {
    try {
      localStorage.removeItem(bloodMoonEventStorageKey);
    } catch (error) {
      return;
    }
  }

  applyBloodMoonState();
  setTheme(localStorage.getItem("dailyTarotTheme") === "moon" ? "moon" : "sun");
  notifyBloodMoonStateChange(false);
}

window.AstralVeilBloodMoon = {
  activateBloodMoonEvent,
  deactivateBloodMoonEvent,
  isBloodMoonActive,
  isEventActive: (eventId) => window.AstralVeilEvents?.isEventActive(eventId) || false,
  applyBloodMoonState,
  updateBloodMoonNav,
  getActiveDeck: () => window.AstralVeilEvents?.getActiveDeck() || []
};

function getNormalizedNavPath(url) {
  const path = new URL(url, window.location.href).pathname;
  const filename = path.endsWith("/") ? "index.html" : path.split("/").pop();

  return filename === "" ? "index.html" : filename;
}

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

function setTheme(mode) {
  if (!themeToggleInput) {
    return;
  }

  if (isBloodMoonActive()) {
    applyBloodMoonState();
    return;
  }

  const isSunMode = mode === "sun";

  themeToggleInput.disabled = false;
  document.body.classList.toggle("sun-mode", isSunMode);
  document.body.classList.toggle("moon-mode", !isSunMode);

  themeToggleInput.checked = !isSunMode;
  themeToggleInput.setAttribute(
    "aria-label",
    isSunMode ? "Switch to moon mode" : "Switch to sun mode"
  );

  localStorage.setItem("dailyTarotTheme", isSunMode ? "sun" : "moon");
}

if (themeToggleInput) {
  if (applyBloodMoonState()) {
    themeToggleInput.checked = true;
  } else {
    setTheme(savedTheme === "moon" ? "moon" : "sun");
  }

  themeToggleInput.addEventListener("change", () => {
    if (isBloodMoonActive()) {
      applyBloodMoonState();
      return;
    }

    const nextMode = themeToggleInput.checked ? "moon" : "sun";

    setTheme(nextMode);
  });
} else {
  applyBloodMoonState();
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-end-blood-moon]")) {
    deactivateBloodMoonEvent();
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === bloodMoonEventStorageKey) {
    const isActive = applyBloodMoonState();
    notifyBloodMoonStateChange(isActive);
  }
});

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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setMobileMenu(false);
    }
  });
}
