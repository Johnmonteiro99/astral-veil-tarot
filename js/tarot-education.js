(function () {
  if (document.documentElement.dataset.tarotEducationInitialized === "true") return;
  document.documentElement.dataset.tarotEducationInitialized = "true";

  document.querySelectorAll("[data-education-faq]").forEach((faq) => {
    if (faq.dataset.educationFaqInitialized === "true") return;
    faq.dataset.educationFaqInitialized = "true";

    const items = Array.from(faq.querySelectorAll("[data-education-faq-item]"));
    const setItemState = (item, isOpen) => {
      const button = item.querySelector("[data-education-faq-button]");
      const answer = button ? document.getElementById(button.getAttribute("aria-controls")) : null;
      const icon = button?.querySelector(".tarot-faq__icon");
      if (!button || !answer) return;

      item.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      answer.setAttribute("aria-hidden", String(!isOpen));
      answer.inert = !isOpen;
      if (icon) icon.textContent = isOpen ? "−" : "+";
    };

    function openDirectHashTarget() {
      if (!window.location.hash) return false;
      let targetId;
      try {
        targetId = decodeURIComponent(window.location.hash.slice(1));
      } catch (error) {
        return false;
      }
      const target = document.getElementById(targetId);
      const targetItem = target?.closest("[data-education-faq-item]");
      if (!targetItem || !faq.contains(targetItem)) return false;
      items.forEach((candidate) => setItemState(candidate, candidate === targetItem));
      return true;
    }

    items.forEach((item) => {
      setItemState(item, false);
      const button = item.querySelector("[data-education-faq-button]");
      button?.addEventListener("click", () => {
        const willOpen = button.getAttribute("aria-expanded") !== "true";
        items.forEach((candidate) => setItemState(candidate, candidate === item && willOpen));
      });
    });

    faq.classList.add("is-enhanced");
    openDirectHashTarget();
    window.addEventListener("hashchange", openDirectHashTarget);
  });

  const educationHero = document.querySelector("[data-education-page]");
  const educationHeroImage = educationHero?.querySelector("[data-education-hero-image]");

  if (educationHero && educationHeroImage) {
    import("/data/tarot-education-hero-images.js").then(({ getTarotEducationHeroImages }) => {
      const images = getTarotEducationHeroImages(educationHero.dataset.educationPage);

      function isBloodMoonActive(event) {
        return typeof event?.detail?.isActive === "boolean"
          ? event.detail.isActive
          : document.body.classList.contains("blood-moon-mode");
      }

      function updateEducationHero(event) {
        const useBloodMoon = isBloodMoonActive(event);
        const image = useBloodMoon ? images.bloodMoon : images.regular;
        const position = useBloodMoon ? images.bloodMoonPosition : images.position;
        const expectedMode = useBloodMoon;
        const update = window.AstralVeilImages?.updateIfChanged;
        const swap = typeof update === "function"
          ? update(educationHeroImage, image.src)
          : Promise.resolve().then(() => {
            if (educationHeroImage.getAttribute("src") !== image.src) {
              educationHeroImage.setAttribute("src", image.src);
            }
            return { ok: true };
          });

        swap.then((result) => {
          if (!result?.ok || isBloodMoonActive() !== expectedMode) return;
          educationHeroImage.width = image.width;
          educationHeroImage.height = image.height;
          if (educationHero.dataset.educationPage === "how-to-read-tarot") {
            educationHeroImage.style.objectPosition = position;
          } else {
            educationHeroImage.style.removeProperty("object-position");
          }
          educationHero.style.setProperty("--education-hero-image-position", position);
        });
      }

      window.addEventListener("astralVeilBloodMoonChange", updateEducationHero);
      new MutationObserver(() => updateEducationHero()).observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
      });
      updateEducationHero();
    });
  }

  const viewport = document.querySelector("[data-tarot-education-viewport]");
  const activeItem = viewport?.querySelector("[data-tarot-education-active]");
  if (!viewport || !activeItem) return;

  function centerActiveItem() {
    if (!window.matchMedia("(max-width: 820px)").matches) {
      viewport.scrollLeft = 0;
      return;
    }

    const maximumScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (maximumScroll <= 1) {
      viewport.scrollLeft = 0;
      return;
    }

    const activeCenter = activeItem.offsetLeft + (activeItem.offsetWidth / 2);
    viewport.scrollLeft = Math.min(
      maximumScroll,
      Math.max(0, activeCenter - (viewport.clientWidth / 2))
    );
  }

  window.addEventListener("load", centerActiveItem, { once: true });
  window.addEventListener("resize", centerActiveItem, { passive: true });
  window.requestAnimationFrame(() => window.requestAnimationFrame(centerActiveItem));
})();
