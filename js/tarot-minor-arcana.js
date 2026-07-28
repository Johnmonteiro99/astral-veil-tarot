(function () {
  if (document.documentElement.dataset.minorArcanaInitialized === "true") return;
  document.documentElement.dataset.minorArcanaInitialized = "true";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const educationNavViewport = document.querySelector("[data-tarot-education-viewport]");
  const activeEducationItem = educationNavViewport?.querySelector("[data-tarot-education-active]");
  const carouselRoot = document.querySelector("[data-minor-carousel]");
  let applyMinorFilter = () => {};

  function positionActiveEducationItem() {
    if (!educationNavViewport
      || !activeEducationItem
      || !window.matchMedia("(max-width: 820px)").matches) return;

    const maximumScroll = Math.max(0, educationNavViewport.scrollWidth - educationNavViewport.clientWidth);
    if (maximumScroll <= 1) {
      educationNavViewport.scrollLeft = 0;
      return;
    }

    const viewportRect = educationNavViewport.getBoundingClientRect();
    const activeRect = activeEducationItem.getBoundingClientRect();
    const activeCenter = activeRect.left
      - viewportRect.left
      + educationNavViewport.scrollLeft
      + (activeRect.width / 2);
    educationNavViewport.scrollLeft = Math.min(
      maximumScroll,
      Math.max(0, activeCenter - (educationNavViewport.clientWidth / 2))
    );
  }

  window.addEventListener("load", positionActiveEducationItem, { once: true });
  window.requestAnimationFrame(() => window.requestAnimationFrame(positionActiveEducationItem));

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

  function enhanceTabInterface(rootSelector, tabSelector, panelSelector, dataKey, options = {}) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll(tabSelector));
    const panels = Array.from(root.querySelectorAll(panelSelector));
    const selectorViewport = options.selectorViewport
      ? root.querySelector(options.selectorViewport)
      : null;
    const previousButton = options.previousButton
      ? root.querySelector(options.previousButton)
      : null;
    const nextButton = options.nextButton
      ? root.querySelector(options.nextButton)
      : null;
    const progressItems = options.progressItems
      ? Array.from(root.querySelectorAll(options.progressItems))
      : [];
    const count = options.count ? root.querySelector(options.count) : null;
    const status = options.status ? root.querySelector(options.status) : null;
    let activeKey = tabs.find((tab) => tab.classList.contains("is-active"))?.dataset[dataKey] || tabs[0]?.dataset[dataKey] || "";
    let isTransitioning = false;
    let transitionTimer = 0;

    function centerActiveTab(tab, behavior = "smooth") {
      if (!selectorViewport
        || !tab
        || !window.matchMedia("(max-width: 768px)").matches) return;

      const maximumScroll = Math.max(0, selectorViewport.scrollWidth - selectorViewport.clientWidth);
      const targetLeft = tab.offsetLeft - ((selectorViewport.clientWidth - tab.offsetWidth) / 2);
      selectorViewport.scrollTo({
        left: Math.min(maximumScroll, Math.max(0, targetLeft)),
        behavior
      });
    }

    function updateAuxiliaryState(nextIndex, { announce = true, scroll = true } = {}) {
      const activeTab = tabs[nextIndex];
      progressItems.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.minorSuitProgress === activeKey);
      });
      if (count) {
        count.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(tabs.length).padStart(2, "0")}`;
      }
      if (status && announce) {
        status.textContent = `${activeTab.dataset.minorSuitName}, ${activeTab.dataset.minorSuitElement}, ${nextIndex + 1} of ${tabs.length}`;
      }
      if (scroll) {
        centerActiveTab(activeTab, reducedMotionQuery.matches ? "auto" : "smooth");
      }
    }

    function clearTransitionState() {
      window.clearTimeout(transitionTimer);
      panels.forEach((panel) => panel.classList.remove("is-entering", "is-leaving"));
      root.classList.remove("is-transitioning");
      root.removeAttribute("aria-busy");
      isTransitioning = false;
    }

    function setActive(nextKey, {
      direction = 0,
      initial = false,
      announce = true,
      scroll = true
    } = {}) {
      const nextIndex = tabs.findIndex((tab) => tab.dataset[dataKey] === nextKey);
      if (nextIndex < 0 || (isTransitioning && !initial)) return false;

      const previousIndex = tabs.findIndex((tab) => tab.dataset[dataKey] === activeKey);
      if (!initial && nextIndex === previousIndex) {
        updateAuxiliaryState(nextIndex, { announce: false, scroll });
        return true;
      }

      const outgoingPanel = previousIndex >= 0 ? panels[previousIndex] : null;
      const incomingPanel = panels[nextIndex];
      const useTransition = Boolean(
        options.animatedPanels
        && !initial
        && outgoingPanel
        && incomingPanel
        && !reducedMotionQuery.matches
      );

      if (useTransition) {
        const resolvedDirection = direction || (nextIndex > previousIndex ? 1 : -1);
        const directionDataKey = options.transitionDirectionDataKey || "minorSuitDirection";
        root.dataset[directionDataKey] = resolvedDirection > 0 ? "forward" : "backward";
        root.classList.add("is-transitioning");
        root.setAttribute("aria-busy", "true");
        outgoingPanel.classList.add("is-leaving");
        incomingPanel.classList.add("is-entering");
        isTransitioning = true;
      } else {
        clearTransitionState();
      }

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
        if (panel !== outgoingPanel) panel.classList.remove("is-leaving");
        if (panel !== incomingPanel) panel.classList.remove("is-entering");
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });

      updateAuxiliaryState(nextIndex, { announce, scroll });
      options.onChange?.({
        activeKey,
        initial,
        nextIndex,
        previousIndex
      });

      if (useTransition) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => incomingPanel.classList.remove("is-entering"));
        });
        transitionTimer = window.setTimeout(clearTransitionState, 680);
      }

      return true;
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        const activeIndex = tabs.findIndex((candidate) => candidate.dataset[dataKey] === activeKey);
        setActive(tab.dataset[dataKey], { direction: index >= activeIndex ? 1 : -1 });
      });
      tab.addEventListener("keydown", (event) => {
        if (isTransitioning) {
          event.preventDefault();
          return;
        }
        let targetIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[targetIndex].focus();
        setActive(tabs[targetIndex].dataset[dataKey], {
          direction: event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Home" ? -1 : 1
        });
      });
    });

    function selectRelativeSuit(direction) {
      if (isTransitioning) return;
      const activeIndex = tabs.findIndex((tab) => tab.dataset[dataKey] === activeKey);
      const targetIndex = (activeIndex + direction + tabs.length) % tabs.length;
      setActive(tabs[targetIndex].dataset[dataKey], { direction });
    }

    previousButton?.addEventListener("click", () => selectRelativeSuit(-1));
    nextButton?.addEventListener("click", () => selectRelativeSuit(1));

    root.classList.add("is-enhanced");
    setActive(activeKey, { initial: true, announce: false, scroll: false });
  }

  function enhanceCourtProcession() {
    const root = document.querySelector("[data-minor-courts]");
    if (!root) return null;
    const rankOptions = Array.from(root.querySelectorAll("[data-minor-court-rank-option]"));
    const panels = Array.from(root.querySelectorAll("[data-minor-court-panel]"));
    const previousButton = root.querySelector("[data-minor-court-previous]");
    const nextButton = root.querySelector("[data-minor-court-next]");
    const progressItems = Array.from(root.querySelectorAll("[data-minor-court-mobile-progress]"));
    const count = root.querySelector("[data-minor-court-count]");
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const rankKeys = rankOptions.map((option) => option.dataset.minorCourtRankOption);
    let activeRank = root.dataset.minorCourtRank || rankKeys[0] || "";
    let scrollTimer = 0;

    function getActivePanel() {
      return panels.find((panel) => panel.classList.contains("is-active")) || panels[0] || null;
    }

    function centerRoleInPanel(panel, behavior = "smooth") {
      if (!mobileQuery.matches || !panel) return;
      const procession = panel.querySelector("[data-minor-court-procession]");
      const role = panel.querySelector(`[data-minor-court-role="${activeRank}"]`);
      if (!procession || !role) return;
      const maximumScroll = Math.max(0, procession.scrollWidth - procession.clientWidth);
      const targetLeft = role.offsetLeft - ((procession.clientWidth - role.offsetWidth) / 2);
      procession.scrollTo({
        left: Math.min(maximumScroll, Math.max(0, targetLeft)),
        behavior
      });
    }

    function updateRoleTabOrder() {
      const activePanel = getActivePanel();
      panels.forEach((panel) => {
        panel.querySelectorAll("[data-minor-court-role]").forEach((role) => {
          const active = role.dataset.minorCourtRole === activeRank;
          role.classList.toggle("is-rank-active", active);
          role.toggleAttribute("aria-current", mobileQuery.matches && panel === activePanel && active);
          role.querySelectorAll("a, button, [tabindex]").forEach((focusable) => {
            if (!mobileQuery.matches || active) focusable.removeAttribute("tabindex");
            else focusable.tabIndex = -1;
          });
        });
      });
    }

    function updateRankState(nextRank, { scroll = true } = {}) {
      const nextIndex = rankKeys.indexOf(nextRank);
      if (nextIndex < 0) return;
      activeRank = nextRank;
      root.dataset.minorCourtRank = activeRank;
      rankOptions.forEach((option) => {
        const active = option.dataset.minorCourtRankOption === activeRank;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-pressed", String(active));
      });
      panels.forEach((panel) => {
        panel.querySelectorAll("[data-minor-court-progress]").forEach((item) => {
          item.classList.toggle("is-active", item.dataset.minorCourtProgress === activeRank);
        });
      });
      progressItems.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.minorCourtMobileProgress === activeRank);
      });
      if (count) count.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(rankKeys.length).padStart(2, "0")}`;
      if (previousButton) previousButton.disabled = nextIndex === 0;
      if (nextButton) nextButton.disabled = nextIndex === rankKeys.length - 1;
      updateRoleTabOrder();
      if (scroll) {
        centerRoleInPanel(getActivePanel(), reducedMotionQuery.matches ? "auto" : "smooth");
      }
    }

    function selectRelativeRank(direction) {
      const activeIndex = rankKeys.indexOf(activeRank);
      const targetIndex = Math.min(rankKeys.length - 1, Math.max(0, activeIndex + direction));
      updateRankState(rankKeys[targetIndex]);
    }

    rankOptions.forEach((option, index) => {
      option.addEventListener("click", () => updateRankState(option.dataset.minorCourtRankOption));
      option.addEventListener("keydown", (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % rankOptions.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + rankOptions.length) % rankOptions.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = rankOptions.length - 1;
        else return;
        event.preventDefault();
        rankOptions[targetIndex].focus();
        updateRankState(rankOptions[targetIndex].dataset.minorCourtRankOption);
      });
    });

    previousButton?.addEventListener("click", () => selectRelativeRank(-1));
    nextButton?.addEventListener("click", () => selectRelativeRank(1));

    panels.forEach((panel) => {
      const procession = panel.querySelector("[data-minor-court-procession]");
      procession?.addEventListener("scroll", () => {
        if (!mobileQuery.matches || !panel.classList.contains("is-active")) return;
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          const roles = Array.from(panel.querySelectorAll("[data-minor-court-role]"));
          if (!roles.length) return;
          const center = procession.scrollLeft + (procession.clientWidth / 2);
          const nearest = roles.reduce((best, role) => {
            const roleCenter = role.offsetLeft + (role.offsetWidth / 2);
            const bestCenter = best.offsetLeft + (best.offsetWidth / 2);
            return Math.abs(roleCenter - center) < Math.abs(bestCenter - center) ? role : best;
          }, roles[0]);
          updateRankState(nearest.dataset.minorCourtRole, { scroll: false });
        }, 120);
      }, { passive: true });
    });

    function syncActivePanel({ scroll = true } = {}) {
      updateRoleTabOrder();
      if (scroll) {
        window.requestAnimationFrame(() => {
          centerRoleInPanel(getActivePanel(), reducedMotionQuery.matches ? "auto" : "smooth");
        });
      }
    }

    mobileQuery.addEventListener("change", () => {
      updateRankState(activeRank, { scroll: false });
      syncActivePanel({ scroll: mobileQuery.matches });
    });

    root.classList.add("is-court-enhanced");
    updateRankState(activeRank, { scroll: false });
    return { syncActivePanel };
  }

  const courtProcession = enhanceCourtProcession();

  enhanceTabInterface(
    "[data-minor-suits]",
    "[data-minor-suit-tab]",
    "[data-minor-suit-panel]",
    "minorSuitTab",
    {
      animatedPanels: true,
      selectorViewport: "[data-minor-suit-selector]",
      previousButton: "[data-minor-suit-previous]",
      nextButton: "[data-minor-suit-next]",
      progressItems: "[data-minor-suit-progress]",
      count: "[data-minor-suit-count]",
      status: "[data-minor-suit-status]"
    }
  );
  enhanceTabInterface(
    "[data-minor-numbers]",
    "[data-minor-number-tab]",
    "[data-minor-number-panel]",
    "minorNumberTab",
    {
      animatedPanels: true,
      selectorViewport: "[data-minor-number-selector]",
      transitionDirectionDataKey: "minorNumberDirection"
    }
  );
  enhanceTabInterface(
    "[data-minor-courts]",
    "[data-minor-court-tab]",
    "[data-minor-court-panel]",
    "minorCourtTab",
    {
      animatedPanels: true,
      transitionDirectionDataKey: "minorCourtDirection",
      onChange: ({ initial }) => courtProcession?.syncActivePanel({ scroll: !initial })
    }
  );

  document.querySelectorAll("[data-minor-filter-link]").forEach((link) => {
    link.addEventListener("click", () => {
      applyMinorFilter(link.dataset.minorFilterLink);
    });
  });
})();
