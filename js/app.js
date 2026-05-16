const themeToggleInput = document.querySelector(".theme-toggle__input");
const savedTheme = localStorage.getItem("dailyTarotTheme");
const bloodMoonEventStorageKey = "astralVeilBloodMoonActive";
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".navbar__menu-toggle");
const mobileMenu = document.querySelector(".navbar__mobile-menu");
const navLinks = document.querySelectorAll(".navbar__link, .navbar__mobile-link");
const mobileMenuLinks = document.querySelectorAll(".navbar__mobile-link");

function getStoredBloodMoonEventState() {
  try {
    return localStorage.getItem(bloodMoonEventStorageKey);
  } catch (error) {
    return "false";
  }
}

function setStoredBloodMoonEventState(isActive) {
  try {
    localStorage.setItem(bloodMoonEventStorageKey, isActive ? "true" : "false");
  } catch (error) {
    return;
  }
}

function isBloodMoonActive() {
  return getStoredBloodMoonEventState() === "true";
}

function applyBloodMoonState() {
  const isActive = isBloodMoonActive();

  document.body.classList.toggle("blood-moon-mode", isActive);

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
  setStoredBloodMoonEventState(true);
  applyBloodMoonState();
}

function deactivateBloodMoonEvent() {
  setStoredBloodMoonEventState(false);
  document.body.classList.remove("blood-moon-mode");
  setTheme(localStorage.getItem("dailyTarotTheme") === "moon" ? "moon" : "sun");
}

window.AstralVeilBloodMoon = {
  activateBloodMoonEvent,
  deactivateBloodMoonEvent,
  isBloodMoonActive,
  applyBloodMoonState
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

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMobileMenu(false);
    });
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
