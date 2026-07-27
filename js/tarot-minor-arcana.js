(function () {
  if (document.documentElement.dataset.minorArcanaInitialized === "true") return;
  document.documentElement.dataset.minorArcanaInitialized = "true";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const carouselRoot = document.querySelector("[data-minor-carousel]");
  let applyMinorFilter = () => {};

  if (carouselRoot) {
    const viewport = carouselRoot.querySelector("[data-minor-carousel-viewport]");
    const slides = Array.from(carouselRoot.querySelectorAll("[data-minor-card-slide]"));
    const filters = Array.from(carouselRoot.querySelectorAll("[data-minor-filter]"));
    const previous = carouselRoot.querySelector("[data-minor-previous]");
    const next = carouselRoot.querySelector("[data-minor-next]");
    const status = carouselRoot.querySelector("[data-minor-carousel-status]");
    const visibleCount = carouselRoot.querySelector("[data-minor-visible-count]");
    const progress = carouselRoot.querySelector("[data-minor-carousel-progress]");
    let activeFilter = "all";
    let activeIndex = 0;
    let scrollTimer = 0;

    function getVisibleSlides() {
      return slides.filter((slide) => !slide.hidden);
    }

    function updateCarouselControls() {
      const visibleSlides = getVisibleSlides();
      const position = visibleSlides.indexOf(slides[activeIndex]);
      if (previous) previous.disabled = position <= 0;
      if (next) next.disabled = position < 0 || position >= visibleSlides.length - 1;
      if (visibleCount) visibleCount.textContent = String(visibleSlides.length);
      if (progress) progress.style.width = `${((Math.max(position, 0) + 1) / Math.max(visibleSlides.length, 1)) * 100}%`;
    }

    function setActiveCard(nextIndex, { announce = false, scroll = true } = {}) {
      if (!slides[nextIndex] || slides[nextIndex].hidden) return;
      const changed = activeIndex !== nextIndex;
      activeIndex = nextIndex;
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.toggleAttribute("aria-current", active);
        slide.querySelector("[data-minor-card-select]")?.setAttribute("aria-pressed", String(active));
      });
      updateCarouselControls();
      const activeSlide = slides[activeIndex];
      if (scroll && activeSlide && viewport) {
        activeSlide.scrollIntoView({
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          block: "nearest",
          inline: "center"
        });
      }
      if (announce && changed && status) {
        const visibleSlides = getVisibleSlides();
        const position = visibleSlides.indexOf(activeSlide);
        const name = activeSlide.querySelector("h3")?.textContent?.trim() || "Minor Arcana card";
        status.textContent = `${position + 1} of ${visibleSlides.length} selected: ${name}`;
      }
    }

    function matchesFilter(slide, filter) {
      if (filter === "all") return true;
      if (filter === "court") return slide.dataset.minorCourt === "true";
      return slide.dataset.minorSuit === filter;
    }

    applyMinorFilter = (filter, { announce = true, scroll = true } = {}) => {
      if (!filters.some((button) => button.dataset.minorFilter === filter)) return;
      activeFilter = filter;
      filters.forEach((button) => {
        const active = button.dataset.minorFilter === activeFilter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      slides.forEach((slide) => {
        slide.hidden = !matchesFilter(slide, activeFilter);
      });
      const firstVisible = getVisibleSlides()[0];
      const nextIndex = slides.indexOf(firstVisible);
      setActiveCard(nextIndex, { announce: false, scroll });
      if (announce && status) {
        const label = filters.find((button) => button.dataset.minorFilter === activeFilter)?.textContent?.trim() || "All";
        status.textContent = `${label} filter selected. ${getVisibleSlides().length} cards available.`;
      }
    };

    filters.forEach((button, index) => {
      button.addEventListener("click", () => applyMinorFilter(button.dataset.minorFilter));
      button.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const target = filters[(index + direction + filters.length) % filters.length];
        target.focus();
        applyMinorFilter(target.dataset.minorFilter);
      });
    });

    slides.forEach((slide, index) => {
      slide.querySelector("[data-minor-card-select]")?.addEventListener("click", () => {
        setActiveCard(index, { announce: true });
      });
    });

    previous?.addEventListener("click", () => {
      const visibleSlides = getVisibleSlides();
      const position = visibleSlides.indexOf(slides[activeIndex]);
      const target = visibleSlides[Math.max(0, position - 1)];
      setActiveCard(slides.indexOf(target), { announce: true });
    });

    next?.addEventListener("click", () => {
      const visibleSlides = getVisibleSlides();
      const position = visibleSlides.indexOf(slides[activeIndex]);
      const target = visibleSlides[Math.min(visibleSlides.length - 1, position + 1)];
      setActiveCard(slides.indexOf(target), { announce: true });
    });

    viewport?.addEventListener("keydown", (event) => {
      const visibleSlides = getVisibleSlides();
      const position = visibleSlides.indexOf(slides[activeIndex]);
      let targetPosition = position;
      if (event.key === "ArrowRight") targetPosition = Math.min(visibleSlides.length - 1, position + 1);
      else if (event.key === "ArrowLeft") targetPosition = Math.max(0, position - 1);
      else if (event.key === "Home") targetPosition = 0;
      else if (event.key === "End") targetPosition = visibleSlides.length - 1;
      else return;
      event.preventDefault();
      setActiveCard(slides.indexOf(visibleSlides[targetPosition]), { announce: true });
    });

    viewport?.addEventListener("scroll", () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const visibleSlides = getVisibleSlides();
        if (!visibleSlides.length) return;
        const center = viewport.scrollLeft + (viewport.clientWidth / 2);
        const nearest = visibleSlides.reduce((best, slide) => {
          const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
          const bestCenter = best.offsetLeft + (best.offsetWidth / 2);
          return Math.abs(slideCenter - center) < Math.abs(bestCenter - center) ? slide : best;
        }, visibleSlides[0]);
        setActiveCard(slides.indexOf(nearest), { announce: true, scroll: false });
      }, 120);
    }, { passive: true });

    carouselRoot.classList.add("is-enhanced");
    applyMinorFilter("all", { announce: false, scroll: false });
  }

  function enhanceTabInterface(rootSelector, tabSelector, panelSelector, dataKey) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll(tabSelector));
    const panels = Array.from(root.querySelectorAll(panelSelector));
    let activeKey = tabs.find((tab) => tab.classList.contains("is-active"))?.dataset[dataKey] || tabs[0]?.dataset[dataKey] || "";

    function setActive(nextKey) {
      if (!tabs.some((tab) => tab.dataset[dataKey] === nextKey)) return;
      activeKey = nextKey;
      tabs.forEach((tab) => {
        const active = tab.dataset[dataKey] === activeKey;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        const active = panel.dataset[dataKey.replace("Tab", "Panel")] === activeKey;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setActive(tab.dataset[dataKey]));
      tab.addEventListener("keydown", (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[targetIndex].focus();
        setActive(tabs[targetIndex].dataset[dataKey]);
      });
    });

    root.classList.add("is-enhanced");
    setActive(activeKey);
  }

  enhanceTabInterface("[data-minor-suits]", "[data-minor-suit-tab]", "[data-minor-suit-panel]", "minorSuitTab");
  enhanceTabInterface("[data-minor-numbers]", "[data-minor-number-tab]", "[data-minor-number-panel]", "minorNumberTab");
  enhanceTabInterface("[data-minor-courts]", "[data-minor-court-tab]", "[data-minor-court-panel]", "minorCourtTab");

  document.querySelectorAll("[data-minor-filter-link]").forEach((link) => {
    link.addEventListener("click", () => {
      applyMinorFilter(link.dataset.minorFilterLink);
    });
  });
})();
