(function () {
  if (document.documentElement.dataset.tarotComparisonInitialized === "true") return;
  document.documentElement.dataset.tarotComparisonInitialized = "true";

  const themeImages = Array.from(document.querySelectorAll("[data-comparison-theme-image]"));
  const comparisonDeckRail = document.querySelector("[data-comparison-deck-rail]");
  const comparisonDeckSlides = Array.from(comparisonDeckRail?.querySelectorAll("[data-comparison-row]") || []);
  const comparisonDeckCurrent = document.querySelector("[data-comparison-deck-current]");
  const comparisonDeckCounter = document.querySelector("[data-comparison-deck-counter]");
  const comparisonDeckPrevious = document.querySelector("[data-comparison-deck-prev]");
  const comparisonDeckNext = document.querySelector("[data-comparison-deck-next]");
  const exampleTabs = Array.from(document.querySelectorAll("[data-comparison-example-tab]"));
  const examplePanels = Array.from(document.querySelectorAll("[data-comparison-example-panel]"));
  const exampleMobileQuery = window.matchMedia("(max-width: 768px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let selectedExample = exampleTabs.find((tab) => tab.getAttribute("aria-selected") === "true")?.dataset.comparisonExampleTab || "tarot";
  let activeComparisonSlide = 0;
  let comparisonScrollFrame = 0;

  function isBloodMoonActive(event) {
    return typeof event?.detail?.isActive === "boolean"
      ? event.detail.isActive
      : document.body.classList.contains("blood-moon-mode");
  }

  function updateThemeImages(event) {
    const useBloodMoon = isBloodMoonActive(event);

    themeImages.forEach((image) => {
      const source = useBloodMoon ? image.dataset.bloodSrc : image.dataset.regularSrc;
      const alt = useBloodMoon ? image.dataset.bloodAlt : image.dataset.regularAlt;
      const width = Number(useBloodMoon ? image.dataset.bloodWidth : image.dataset.regularWidth);
      const height = Number(useBloodMoon ? image.dataset.bloodHeight : image.dataset.regularHeight);
      const expectedMode = useBloodMoon;
      const update = window.AstralVeilImages?.updateIfChanged;
      const swap = typeof update === "function"
        ? update(image, source)
        : Promise.resolve().then(() => {
          if (image.getAttribute("src") !== source) image.setAttribute("src", source);
          return { ok: true };
        });

      swap.then((result) => {
        if (!result?.ok || isBloodMoonActive() !== expectedMode) return;
        image.alt = alt || "";
        if (width > 0) image.width = width;
        if (height > 0) image.height = height;
      });
    });
  }

  function updateComparisonDeckState(index) {
    if (!comparisonDeckSlides.length) return;
    activeComparisonSlide = Math.max(0, Math.min(index, comparisonDeckSlides.length - 1));
    const activeSlide = comparisonDeckSlides[activeComparisonSlide];
    if (comparisonDeckCurrent) comparisonDeckCurrent.textContent = activeSlide.dataset.comparisonRowLabel || "Comparison";
    if (comparisonDeckCounter) comparisonDeckCounter.textContent = `${activeComparisonSlide + 1} of ${comparisonDeckSlides.length}`;
    if (comparisonDeckPrevious) comparisonDeckPrevious.disabled = activeComparisonSlide === 0;
    if (comparisonDeckNext) comparisonDeckNext.disabled = activeComparisonSlide === comparisonDeckSlides.length - 1;
  }

  function getComparisonSlideLeft(slide) {
    if (!comparisonDeckRail || !slide) return 0;
    return comparisonDeckRail.scrollLeft + slide.getBoundingClientRect().left - comparisonDeckRail.getBoundingClientRect().left;
  }

  function scrollToComparisonSlide(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
    if (!comparisonDeckRail || !comparisonDeckSlides.length) return;
    const nextIndex = Math.max(0, Math.min(index, comparisonDeckSlides.length - 1));
    comparisonDeckRail.scrollTo({ left: getComparisonSlideLeft(comparisonDeckSlides[nextIndex]), behavior });
    updateComparisonDeckState(nextIndex);
  }

  function syncComparisonDeckFromScroll() {
    if (!comparisonDeckRail || !comparisonDeckSlides.length) return;
    const railLeft = comparisonDeckRail.getBoundingClientRect().left;
    const nextIndex = comparisonDeckSlides.reduce((closestIndex, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - railLeft);
      const closestDistance = Math.abs(comparisonDeckSlides[closestIndex].getBoundingClientRect().left - railLeft);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
    updateComparisonDeckState(nextIndex);
  }

  function syncComparisonDeckMode() {
    if (!comparisonDeckRail) return;
    comparisonDeckRail.tabIndex = exampleMobileQuery.matches ? 0 : -1;
    if (!exampleMobileQuery.matches) {
      comparisonDeckRail.scrollTo({ left: 0, behavior: "auto" });
      updateComparisonDeckState(0);
    } else {
      syncComparisonDeckFromScroll();
    }
  }

  if (comparisonDeckRail && comparisonDeckSlides.length) {
    updateComparisonDeckState(0);
    comparisonDeckPrevious?.addEventListener("click", () => scrollToComparisonSlide(activeComparisonSlide - 1));
    comparisonDeckNext?.addEventListener("click", () => scrollToComparisonSlide(activeComparisonSlide + 1));
    comparisonDeckRail.addEventListener("scroll", () => {
      if (comparisonScrollFrame) window.cancelAnimationFrame(comparisonScrollFrame);
      comparisonScrollFrame = window.requestAnimationFrame(syncComparisonDeckFromScroll);
    }, { passive: true });
    comparisonDeckRail.addEventListener("keydown", (event) => {
      if (!exampleMobileQuery.matches) return;
      const keyTargets = {
        ArrowLeft: activeComparisonSlide - 1,
        ArrowRight: activeComparisonSlide + 1,
        Home: 0,
        End: comparisonDeckSlides.length - 1
      };
      if (!(event.key in keyTargets)) return;
      event.preventDefault();
      scrollToComparisonSlide(keyTargets[event.key]);
    });
    window.addEventListener("resize", syncComparisonDeckFromScroll, { passive: true });
    exampleMobileQuery.addEventListener?.("change", syncComparisonDeckMode);
    syncComparisonDeckMode();
  }

  function syncExamplePanels() {
    const isMobile = exampleMobileQuery.matches;
    exampleTabs.forEach((tab) => {
      const selected = tab.dataset.comparisonExampleTab === selectedExample;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    examplePanels.forEach((panel) => {
      const selected = panel.dataset.comparisonExamplePanel === selectedExample;
      panel.classList.toggle("is-mobile-tab-active", selected);
      panel.hidden = isMobile && !selected;
      if (isMobile) panel.setAttribute("aria-hidden", String(!selected));
      else panel.removeAttribute("aria-hidden");
    });
  }

  function activateExampleTab(nextValue, focus = false) {
    if (!exampleTabs.some((tab) => tab.dataset.comparisonExampleTab === nextValue)) return;
    selectedExample = nextValue;
    syncExamplePanels();
    if (focus) exampleTabs.find((tab) => tab.dataset.comparisonExampleTab === nextValue)?.focus();
  }

  exampleTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateExampleTab(tab.dataset.comparisonExampleTab));
    tab.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home" ? 0
        : event.key === "End" ? exampleTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + exampleTabs.length) % exampleTabs.length;
      activateExampleTab(exampleTabs[nextIndex].dataset.comparisonExampleTab, true);
    });
  });

  if (exampleTabs.length && examplePanels.length) {
    syncExamplePanels();
    exampleMobileQuery.addEventListener?.("change", syncExamplePanels);
  }

  window.addEventListener("astralVeilBloodMoonChange", updateThemeImages);
  window.AstralVeilCardTilt?.initialize(document);
  updateThemeImages();
})();
