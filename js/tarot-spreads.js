(function () {
  if (document.documentElement.dataset.tarotSpreadsInitialized === "true") return;
  document.documentElement.dataset.tarotSpreadsInitialized = "true";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const educationViewport = document.querySelector("[data-tarot-education-viewport]");
  const activeEducationItem = educationViewport?.querySelector("[data-tarot-education-active]");

  function positionActiveEducationItem() {
    if (!educationViewport
      || !activeEducationItem
      || !window.matchMedia("(max-width: 820px)").matches) return;
    const maximumScroll = Math.max(0, educationViewport.scrollWidth - educationViewport.clientWidth);
    const viewportRect = educationViewport.getBoundingClientRect();
    const activeRect = activeEducationItem.getBoundingClientRect();
    const activeCenter = activeRect.left
      - viewportRect.left
      + educationViewport.scrollLeft
      + (activeRect.width / 2);
    educationViewport.scrollLeft = Math.min(
      maximumScroll,
      Math.max(0, activeCenter - (educationViewport.clientWidth / 2))
    );
  }

  window.addEventListener("load", positionActiveEducationItem, { once: true });
  window.requestAnimationFrame(() => window.requestAnimationFrame(positionActiveEducationItem));

  const explorer = document.querySelector("[data-spread-explorer]");

  if (explorer) {
    const filters = Array.from(explorer.querySelectorAll("[data-spread-filter]"));
    const selectors = Array.from(explorer.querySelectorAll("[data-spread-selector]"));
    const panels = Array.from(explorer.querySelectorAll("[data-spread-panel]"));
    let activeFilter = "all";
    let activeSpread = selectors.find((selector) => selector.classList.contains("is-active"))?.dataset.spreadSelector
      || selectors[0]?.dataset.spreadSelector
      || "";

    function getVisibleSelectors() {
      return selectors.filter((selector) => !selector.hidden);
    }

    function matchesFilter(selector, filter) {
      if (filter === "all") return true;
      return String(selector.dataset.spreadCategories || "").split(/\s+/).includes(filter);
    }

    function setActiveSpread(spreadId, { scroll = false } = {}) {
      const targetSelector = selectors.find((selector) => selector.dataset.spreadSelector === spreadId && !selector.hidden);
      if (!targetSelector) return;
      activeSpread = spreadId;
      selectors.forEach((selector) => {
        const active = selector.dataset.spreadSelector === activeSpread;
        selector.classList.toggle("is-active", active);
        selector.setAttribute("aria-pressed", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.dataset.spreadPanel === activeSpread;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });
      if (scroll && window.matchMedia("(max-width: 768px)").matches) {
        targetSelector.scrollIntoView({
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }

    function applyFilter(filter) {
      activeFilter = filters.some((button) => button.dataset.spreadFilter === filter) ? filter : "all";
      filters.forEach((button) => {
        const active = button.dataset.spreadFilter === activeFilter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      selectors.forEach((selector) => {
        selector.hidden = !matchesFilter(selector, activeFilter);
      });
      const visibleSelectors = getVisibleSelectors();
      if (!visibleSelectors.some((selector) => selector.dataset.spreadSelector === activeSpread)) {
        activeSpread = visibleSelectors[0]?.dataset.spreadSelector || "";
      }
      setActiveSpread(activeSpread, { scroll: false });
    }

    filters.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.spreadFilter));
    });

    selectors.forEach((selector) => {
      selector.addEventListener("click", () => setActiveSpread(selector.dataset.spreadSelector, { scroll: true }));
      selector.addEventListener("keydown", (event) => {
        const visibleSelectors = getVisibleSelectors();
        const currentIndex = visibleSelectors.indexOf(selector);
        let targetIndex = currentIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (currentIndex + 1) % visibleSelectors.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (currentIndex - 1 + visibleSelectors.length) % visibleSelectors.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = visibleSelectors.length - 1;
        else return;
        event.preventDefault();
        visibleSelectors[targetIndex]?.focus();
        setActiveSpread(visibleSelectors[targetIndex]?.dataset.spreadSelector, { scroll: true });
      });
    });

    explorer.classList.add("is-enhanced");
    applyFilter("all");
  }

  const comparison = document.querySelector("[data-spread-comparison]");

  if (comparison) {
    const tabs = Array.from(comparison.querySelectorAll("[data-spread-comparison-tab]"));
    const panels = Array.from(comparison.querySelectorAll("[data-spread-comparison-panel]"));

    function setComparison(key) {
      tabs.forEach((tab) => {
        const active = tab.dataset.spreadComparisonTab === key;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        const active = panel.dataset.spreadComparisonPanel === key;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setComparison(tab.dataset.spreadComparisonTab));
      tab.addEventListener("keydown", (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[targetIndex].focus();
        setComparison(tabs[targetIndex].dataset.spreadComparisonTab);
      });
    });

    comparison.classList.add("is-enhanced");
    setComparison(tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.spreadComparisonTab || "simple");
  }
})();
