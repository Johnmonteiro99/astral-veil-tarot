const themeToggleInput = document.querySelector(".theme-toggle__input");
const savedTheme = localStorage.getItem("dailyTarotTheme");
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".navbar__menu-toggle");
const mobileMenu = document.querySelector(".navbar__mobile-menu");
const navLinks = document.querySelectorAll(".navbar__link, .navbar__mobile-link");
const mobileMenuLinks = document.querySelectorAll(".navbar__mobile-link");

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

  const isSunMode = mode === "sun";

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
  setTheme(savedTheme === "moon" ? "moon" : "sun");

  themeToggleInput.addEventListener("change", () => {
    const nextMode = themeToggleInput.checked ? "moon" : "sun";

    setTheme(nextMode);
  });
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
