(function () {
  if (document.documentElement.dataset.tarotSpreadsInitialized === "true") return;
  document.documentElement.dataset.tarotSpreadsInitialized = "true";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const definition = document.querySelector("[data-spread-definition]");

  if (definition) {
    const track = definition.querySelector("[data-spread-definition-track]");
    const cards = Array.from(definition.querySelectorAll("[data-spread-definition-card]"));
    const panels = Array.from(definition.querySelectorAll("[data-spread-definition-panel]"));
    const definitionMobileQuery = window.matchMedia("(max-width: 768px)");
    let activeDefinitionIndex = Math.max(0, cards.findIndex((card) => card.classList.contains("is-active")));
    let definitionScrollTimer = 0;
    let definitionResizeFrame = 0;

    function scrollDefinitionCard(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
      const card = cards[index];
      if (!track || !card || !definitionMobileQuery.matches) return;
      const left = card.offsetLeft - ((track.clientWidth - card.offsetWidth) / 2);
      track.scrollTo({ left, behavior });
    }

    function setDefinitionCard(index, { focus = false, scroll = false } = {}) {
      const nextIndex = Math.max(0, Math.min(index, cards.length - 1));
      activeDefinitionIndex = nextIndex;

      cards.forEach((card, cardIndex) => {
        const active = cardIndex === activeDefinitionIndex;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-selected", String(active));
        card.tabIndex = active ? 0 : -1;
      });

      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeDefinitionIndex;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
        panel.inert = !active;
      });

      if (focus) cards[activeDefinitionIndex]?.focus({ preventScroll: true });
      if (scroll) scrollDefinitionCard(activeDefinitionIndex);
    }

    cards.forEach((card, index) => {
      card.addEventListener("click", () => setDefinitionCard(index, { scroll: true }));
      card.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % cards.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + cards.length) % cards.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = cards.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        setDefinitionCard(nextIndex, { focus: true, scroll: true });
      });
    });

    track?.addEventListener("scroll", () => {
      if (!definitionMobileQuery.matches) return;
      window.clearTimeout(definitionScrollTimer);
      definitionScrollTimer = window.setTimeout(() => {
        const trackCenter = track.scrollLeft + (track.clientWidth / 2);
        const nearestIndex = cards.reduce((bestIndex, card, cardIndex) => {
          const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
          const bestCard = cards[bestIndex];
          const bestCenter = bestCard.offsetLeft + (bestCard.offsetWidth / 2);
          return Math.abs(cardCenter - trackCenter) < Math.abs(bestCenter - trackCenter) ? cardIndex : bestIndex;
        }, 0);
        setDefinitionCard(nearestIndex);
      }, 120);
    }, { passive: true });

    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(definitionResizeFrame);
      definitionResizeFrame = window.requestAnimationFrame(() => {
        scrollDefinitionCard(activeDefinitionIndex, "auto");
      });
    }, { passive: true });

    definition.classList.add("is-enhanced");
    setDefinitionCard(activeDefinitionIndex);
    window.requestAnimationFrame(() => scrollDefinitionCard(activeDefinitionIndex, "auto"));
  }

  const beginnerProgression = document.querySelector("[data-beginner-progression]");

  if (beginnerProgression) {
    const track = beginnerProgression.querySelector("[data-beginner-track]");
    const spreads = Array.from(beginnerProgression.querySelectorAll("[data-beginner-spread]"));
    const selectors = Array.from(beginnerProgression.querySelectorAll("[data-beginner-selector]"));
    const previousButton = beginnerProgression.querySelector("[data-beginner-previous]");
    const nextButton = beginnerProgression.querySelector("[data-beginner-next]");
    const count = beginnerProgression.querySelector("[data-beginner-count]");
    const label = beginnerProgression.querySelector("[data-beginner-label]");
    const swipeQuery = window.matchMedia("(max-width: 1120px)");
    let activeBeginnerIndex = Math.max(0, spreads.findIndex((spread) => spread.classList.contains("is-active")));
    let beginnerScrollTimer = 0;

    function scrollBeginnerSpread(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
      const spread = spreads[index];
      if (!track || !spread || !swipeQuery.matches) return;
      track.scrollTo({ left: spread.offsetLeft - track.offsetLeft, behavior });
    }

    function setBeginnerSpread(index, { focus = false, scroll = false } = {}) {
      activeBeginnerIndex = Math.max(0, Math.min(index, spreads.length - 1));
      beginnerProgression.dataset.beginnerActive = String(activeBeginnerIndex);

      spreads.forEach((spread, spreadIndex) => {
        const active = spreadIndex === activeBeginnerIndex;
        spread.classList.toggle("is-active", active);
        spread.setAttribute("aria-current", active ? "step" : "false");
      });

      selectors.forEach((selector, selectorIndex) => {
        const active = selectorIndex === activeBeginnerIndex;
        selector.setAttribute("aria-pressed", String(active));
      });

      if (count) count.textContent = `${activeBeginnerIndex + 1} of ${spreads.length}`;
      if (label) {
        label.textContent = spreads[activeBeginnerIndex]?.querySelector(".tarot-spreads-beginners__label")?.textContent || "";
      }
      if (previousButton) previousButton.disabled = activeBeginnerIndex === 0;
      if (nextButton) nextButton.disabled = activeBeginnerIndex === spreads.length - 1;
      if (focus) selectors[activeBeginnerIndex]?.focus({ preventScroll: true });
      if (scroll) scrollBeginnerSpread(activeBeginnerIndex);
    }

    selectors.forEach((selector, index) => {
      selector.addEventListener("click", () => setBeginnerSpread(index, { scroll: true }));
      selector.addEventListener("focus", () => setBeginnerSpread(index));
      selector.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = Math.min(index + 1, spreads.length - 1);
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = Math.max(index - 1, 0);
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = spreads.length - 1;
        if (nextIndex === null || nextIndex === index) return;
        event.preventDefault();
        setBeginnerSpread(nextIndex, { focus: true, scroll: true });
      });
    });

    previousButton?.addEventListener("click", () => {
      setBeginnerSpread(activeBeginnerIndex - 1, { scroll: true });
    });
    nextButton?.addEventListener("click", () => {
      setBeginnerSpread(activeBeginnerIndex + 1, { scroll: true });
    });

    track?.addEventListener("scroll", () => {
      if (!swipeQuery.matches) return;
      window.clearTimeout(beginnerScrollTimer);
      beginnerScrollTimer = window.setTimeout(() => {
        const nearestIndex = spreads.reduce((nearest, spread, index) => {
          const distance = Math.abs((spread.offsetLeft - track.offsetLeft) - track.scrollLeft);
          return distance < nearest.distance ? { index, distance } : nearest;
        }, { index: activeBeginnerIndex, distance: Number.POSITIVE_INFINITY }).index;
        setBeginnerSpread(nearestIndex);
      }, 90);
    }, { passive: true });

    beginnerProgression.classList.add("is-enhanced");
    setBeginnerSpread(activeBeginnerIndex);
  }

  const intentionGallery = document.querySelector("[data-intention-gallery]");

  if (intentionGallery) {
    const track = intentionGallery.querySelector("[data-intention-track]");
    const pathways = Array.from(intentionGallery.querySelectorAll("[data-intention-pathway]"));
    const previousButton = intentionGallery.querySelector("[data-intention-previous]");
    const nextButton = intentionGallery.querySelector("[data-intention-next]");
    const count = intentionGallery.querySelector("[data-intention-count]");
    const intentionMobileQuery = window.matchMedia("(max-width: 768px)");
    let activeIntentionIndex = 0;
    let intentionScrollTimer = 0;
    let intentionResizeFrame = 0;

    function intentionPathwayCenter(pathway) {
      if (!track || !pathway) return 0;
      const trackBounds = track.getBoundingClientRect();
      const pathwayBounds = pathway.getBoundingClientRect();
      return track.scrollLeft
        + pathwayBounds.left
        - trackBounds.left
        - ((track.clientWidth - pathwayBounds.width) / 2);
    }

    function scrollIntentionPathway(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
      const pathway = pathways[index];
      if (!track || !pathway || !intentionMobileQuery.matches) return;
      track.scrollTo({
        left: Math.max(0, intentionPathwayCenter(pathway)),
        behavior
      });
    }

    function setActiveIntention(index, { scroll = false } = {}) {
      activeIntentionIndex = Math.max(0, Math.min(index, pathways.length - 1));
      pathways.forEach((pathway, pathwayIndex) => {
        pathway.classList.toggle("is-active", pathwayIndex === activeIntentionIndex);
      });
      if (count) count.textContent = `${activeIntentionIndex + 1} of ${pathways.length}`;
      if (previousButton) previousButton.disabled = activeIntentionIndex === 0;
      if (nextButton) nextButton.disabled = activeIntentionIndex === pathways.length - 1;
      if (scroll) scrollIntentionPathway(activeIntentionIndex);
    }

    pathways.forEach((pathway, index) => {
      pathway.addEventListener("focusin", () => {
        setActiveIntention(index, { scroll: intentionMobileQuery.matches });
      });
    });

    previousButton?.addEventListener("click", () => {
      setActiveIntention(activeIntentionIndex - 1, { scroll: true });
    });
    nextButton?.addEventListener("click", () => {
      setActiveIntention(activeIntentionIndex + 1, { scroll: true });
    });

    track?.addEventListener("scroll", () => {
      if (!intentionMobileQuery.matches) return;
      window.clearTimeout(intentionScrollTimer);
      intentionScrollTimer = window.setTimeout(() => {
        const trackBounds = track.getBoundingClientRect();
        const trackCenter = trackBounds.left + (trackBounds.width / 2);
        const nearestIndex = pathways.reduce((nearest, pathway, index) => {
          const bounds = pathway.getBoundingClientRect();
          const distance = Math.abs(bounds.left + (bounds.width / 2) - trackCenter);
          return distance < nearest.distance ? { index, distance } : nearest;
        }, { index: activeIntentionIndex, distance: Number.POSITIVE_INFINITY }).index;
        setActiveIntention(nearestIndex);
      }, 90);
    }, { passive: true });

    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(intentionResizeFrame);
      intentionResizeFrame = window.requestAnimationFrame(() => {
        scrollIntentionPathway(activeIntentionIndex, "auto");
      });
    }, { passive: true });

    intentionGallery.classList.add("is-enhanced");
    setActiveIntention(activeIntentionIndex);
    window.requestAnimationFrame(() => scrollIntentionPathway(activeIntentionIndex, "auto"));
  }

  const cardPositionExperience = document.querySelector("[data-card-position-experience]");

  if (cardPositionExperience) {
    const tabs = Array.from(cardPositionExperience.querySelectorAll("[data-card-position-tab]"));
    const panels = Array.from(cardPositionExperience.querySelectorAll("[data-card-position-panel]"));
    const markers = Array.from(cardPositionExperience.querySelectorAll("[data-card-position-marker]"));
    let activeCardPositionIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
    let cardPositionTransitionToken = 0;
    let cardPositionAnimations = [];

    function settleCardPositionPanels(activeIndex) {
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeIndex;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
        panel.inert = !active;
        panel.setAttribute("aria-hidden", String(!active));
      });
    }

    function cancelCardPositionAnimations() {
      cardPositionAnimations.forEach((animation) => animation.cancel());
      cardPositionAnimations = [];
    }

    function setCardPosition(index, { focus = false } = {}) {
      const nextIndex = Math.max(0, Math.min(index, tabs.length - 1));
      const previousIndex = activeCardPositionIndex;
      const nextTab = tabs[nextIndex];
      const nextKey = nextTab?.dataset.cardPositionTab;
      if (!nextTab || !nextKey) return;

      cardPositionTransitionToken += 1;
      const transitionToken = cardPositionTransitionToken;
      cancelCardPositionAnimations();
      settleCardPositionPanels(previousIndex);

      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === nextIndex;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      markers.forEach((marker) => {
        marker.classList.toggle("is-active", marker.dataset.cardPositionMarker === nextKey);
      });

      cardPositionExperience.dataset.activePosition = nextKey;
      cardPositionExperience.style.setProperty("--position-active-index", String(nextIndex));
      activeCardPositionIndex = nextIndex;

      if (focus) nextTab.focus({ preventScroll: true });
      if (
        nextIndex === previousIndex ||
        reducedMotionQuery.matches ||
        typeof panels[previousIndex]?.animate !== "function" ||
        typeof panels[nextIndex]?.animate !== "function"
      ) {
        settleCardPositionPanels(nextIndex);
        return;
      }

      const previousPanel = panels[previousIndex];
      const nextPanel = panels[nextIndex];
      const direction = nextIndex > previousIndex ? 1 : -1;
      if (!previousPanel || !nextPanel) {
        settleCardPositionPanels(nextIndex);
        return;
      }

      nextPanel.hidden = false;
      nextPanel.inert = false;
      nextPanel.setAttribute("aria-hidden", "false");
      nextPanel.classList.add("is-active");
      previousPanel.inert = true;
      previousPanel.setAttribute("aria-hidden", "true");

      const outgoing = previousPanel.animate([
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
        { opacity: 0, transform: `translate3d(${-8 * direction}px, -5px, 0)` }
      ], {
        duration: 230,
        easing: "cubic-bezier(.4, 0, .2, 1)",
        fill: "both"
      });
      const incoming = nextPanel.animate([
        { opacity: 0, transform: `translate3d(${10 * direction}px, 7px, 0)` },
        { opacity: 1, transform: "translate3d(0, 0, 0)" }
      ], {
        duration: 300,
        easing: "cubic-bezier(.22, .72, .22, 1)",
        fill: "both"
      });
      cardPositionAnimations = [outgoing, incoming];

      Promise.all(cardPositionAnimations.map((animation) => animation.finished.catch(() => null))).then(() => {
        if (transitionToken !== cardPositionTransitionToken) return;
        settleCardPositionPanels(nextIndex);
        cancelCardPositionAnimations();
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setCardPosition(index));
      tab.addEventListener("keydown", (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        setCardPosition(targetIndex, { focus: true });
      });
    });

    cardPositionExperience.classList.add("is-enhanced");
    settleCardPositionPanels(activeCardPositionIndex);
  }

  const questionStory = document.querySelector("[data-question-story]");

  if (questionStory) {
    const rail = questionStory.querySelector("[data-question-story-rail]");
    const tabs = Array.from(questionStory.querySelectorAll("[data-question-story-tab]"));
    const panels = Array.from(questionStory.querySelectorAll("[data-question-story-panel]"));
    const questionStoryPanelTrack = questionStory.querySelector(".tarot-spreads-how-to__panels");
    const previousButton = questionStory.querySelector("[data-question-story-previous]");
    const nextButton = questionStory.querySelector("[data-question-story-next]");
    const progress = questionStory.querySelector("[data-question-story-progress]");
    const controlCount = questionStory.querySelector("[data-question-story-control-count]");
    const mobileStoryQuery = window.matchMedia("(max-width: 900px)");
    let activeQuestionStoryIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
    let questionStoryTransitionToken = 0;
    let questionStoryAnimations = [];
    let questionStoryResizeFrame = 0;

    function settleQuestionStoryPanels(activeIndex) {
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeIndex;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
        panel.inert = !active;
        panel.setAttribute("aria-hidden", String(!active));
      });
    }

    function cancelQuestionStoryAnimations() {
      questionStoryAnimations.forEach((animation) => animation.cancel());
      questionStoryAnimations = [];
      questionStory.classList.remove("is-transitioning");
      questionStoryPanelTrack?.style.removeProperty("height");
    }

    function scrollQuestionStoryTab(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
      const tab = tabs[index];
      if (!rail || !tab || !mobileStoryQuery.matches) return;
      const left = tab.offsetLeft - ((rail.clientWidth - tab.offsetWidth) / 2);
      rail.scrollTo({ left: Math.max(0, left), behavior });
    }

    function updateQuestionStoryControls() {
      const countText = `${activeQuestionStoryIndex + 1} of ${tabs.length}`;
      if (progress) progress.textContent = countText;
      if (controlCount) controlCount.textContent = countText;
      if (previousButton) previousButton.disabled = activeQuestionStoryIndex === 0;
      if (nextButton) nextButton.disabled = activeQuestionStoryIndex === tabs.length - 1;
    }

    function setQuestionStoryStage(index, { focus = false, scroll = false } = {}) {
      const nextIndex = Math.max(0, Math.min(index, tabs.length - 1));
      const previousIndex = activeQuestionStoryIndex;
      const nextTab = tabs[nextIndex];
      const nextKey = nextTab?.dataset.questionStoryTab;
      if (!nextTab || !nextKey) return;

      questionStoryTransitionToken += 1;
      const transitionToken = questionStoryTransitionToken;
      cancelQuestionStoryAnimations();
      settleQuestionStoryPanels(previousIndex);

      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === nextIndex;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      questionStory.dataset.activeStage = nextKey;
      questionStory.style.setProperty("--story-active-index", String(nextIndex));
      questionStory.style.setProperty("--story-progress", String(tabs.length > 1 ? nextIndex / (tabs.length - 1) : 1));
      activeQuestionStoryIndex = nextIndex;
      updateQuestionStoryControls();

      if (focus) nextTab.focus({ preventScroll: true });
      if (scroll) scrollQuestionStoryTab(nextIndex);

      if (
        nextIndex === previousIndex ||
        reducedMotionQuery.matches ||
        typeof panels[previousIndex]?.animate !== "function" ||
        typeof panels[nextIndex]?.animate !== "function"
      ) {
        settleQuestionStoryPanels(nextIndex);
        return;
      }

      const previousPanel = panels[previousIndex];
      const nextPanel = panels[nextIndex];
      const direction = nextIndex > previousIndex ? 1 : -1;
      if (!previousPanel || !nextPanel) {
        settleQuestionStoryPanels(nextIndex);
        return;
      }

      nextPanel.hidden = false;
      nextPanel.inert = false;
      nextPanel.setAttribute("aria-hidden", "false");
      nextPanel.classList.add("is-active");
      previousPanel.inert = true;
      previousPanel.setAttribute("aria-hidden", "true");
      questionStory.classList.add("is-transitioning");

      const previousHeight = previousPanel.getBoundingClientRect().height;
      const nextHeight = nextPanel.getBoundingClientRect().height;
      let heightAnimation = null;
      if (questionStoryPanelTrack && Math.abs(previousHeight - nextHeight) > 1) {
        questionStoryPanelTrack.style.height = `${previousHeight}px`;
        heightAnimation = questionStoryPanelTrack.animate([
          { height: `${previousHeight}px` },
          { height: `${nextHeight}px` }
        ], {
          duration: 400,
          easing: "cubic-bezier(.22, .72, .22, 1)",
          fill: "both"
        });
      }

      const outgoing = previousPanel.animate([
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
        { opacity: 0, transform: `translate3d(${-10 * direction}px, -4px, 0)` }
      ], {
        duration: 300,
        easing: "cubic-bezier(.4, 0, .2, 1)",
        fill: "both"
      });
      const incoming = nextPanel.animate([
        { opacity: 0, transform: `translate3d(${12 * direction}px, 6px, 0)` },
        { opacity: 1, transform: "translate3d(0, 0, 0)" }
      ], {
        duration: 400,
        easing: "cubic-bezier(.22, .72, .22, 1)",
        fill: "both"
      });
      questionStoryAnimations = [outgoing, incoming, heightAnimation].filter(Boolean);

      Promise.all(questionStoryAnimations.map((animation) => animation.finished.catch(() => null))).then(() => {
        if (transitionToken !== questionStoryTransitionToken) return;
        settleQuestionStoryPanels(nextIndex);
        cancelQuestionStoryAnimations();
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setQuestionStoryStage(index, { scroll: true }));
      tab.addEventListener("keydown", (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        setQuestionStoryStage(targetIndex, { focus: true, scroll: true });
      });
    });

    previousButton?.addEventListener("click", () => {
      setQuestionStoryStage(activeQuestionStoryIndex - 1, { scroll: true });
    });
    nextButton?.addEventListener("click", () => {
      setQuestionStoryStage(activeQuestionStoryIndex + 1, { scroll: true });
    });

    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(questionStoryResizeFrame);
      questionStoryResizeFrame = window.requestAnimationFrame(() => {
        scrollQuestionStoryTab(activeQuestionStoryIndex, "auto");
      });
    }, { passive: true });

    questionStory.classList.add("is-enhanced");
    settleQuestionStoryPanels(activeQuestionStoryIndex);
    updateQuestionStoryControls();
    window.requestAnimationFrame(() => scrollQuestionStoryTab(activeQuestionStoryIndex, "auto"));
  }

  const explorer = document.querySelector("[data-spread-explorer]");

  if (explorer) {
    const filterTrack = explorer.querySelector("[data-spread-filter-track]");
    const filters = Array.from(explorer.querySelectorAll("[data-spread-filter]"));
    const selectors = Array.from(explorer.querySelectorAll("[data-spread-selector]"));
    const panels = Array.from(explorer.querySelectorAll("[data-spread-panel]"));
    const positionButtons = Array.from(explorer.querySelectorAll("[data-spread-position]"));
    const dossierTabs = Array.from(explorer.querySelectorAll("[data-spread-dossier-tab]"));
    const dossierPanels = Array.from(explorer.querySelectorAll("[data-spread-dossier-panel]"));
    const indexGroups = Array.from(explorer.querySelectorAll("[data-spread-index-group]"));
    const selectorList = explorer.querySelector("[data-spread-gallery-track]");
    const selectorMobileQuery = window.matchMedia("(max-width: 768px)");
    const explorerStatus = explorer.querySelector("[data-spread-explorer-status]");
    const modal = explorer.querySelector("[data-spread-modal]");
    const modalDialog = modal?.querySelector("[data-spread-modal-dialog]");
    const modalPanels = Array.from(modal?.querySelectorAll("[data-spread-modal-panel]") || []);
    const modalOpeners = Array.from(explorer.querySelectorAll("[data-spread-modal-open]"));
    const modalClosers = Array.from(modal?.querySelectorAll("[data-spread-modal-close]") || []);
    let activeFilter = "all";
    let filterResizeFrame = 0;
    let spreadTransitionTimer = 0;
    let spreadTransitionCleanup = null;
    let spreadTransitionState = "idle";
    let spreadTransitionToken = 0;
    let pendingSpreadRequest = null;
    const selectedPositions = new Map();
    const selectedDossierTabs = new Map();
    const selectedDrawerExpanded = new Map();
    const positionDetailAnimations = new Map();
    let activeSpread = selectors.find((selector) => selector.classList.contains("is-active"))?.dataset.spreadSelector
      || selectors[0]?.dataset.spreadSelector
      || "";
    let modalReturnFocus = null;

    function getVisibleSelectors() {
      return selectors.filter((selector) => !selector.hidden);
    }

    function matchesFilter(selector, filter) {
      if (filter === "all") return true;
      if (filter === "available") return selector.dataset.spreadAvailable === "true";
      return String(selector.dataset.spreadCategories || "").split(/\s+/).includes(filter);
    }

    function syncSelectorOrientation() {
      selectorList?.setAttribute("aria-orientation", "horizontal");
    }

    function positionFilterIndicator(button) {
      if (!filterTrack || !button) return;
      filterTrack.style.setProperty("--spread-filter-indicator-x", `${button.offsetLeft}px`);
      filterTrack.style.setProperty("--spread-filter-indicator-width", `${button.offsetWidth}px`);
    }

    function scrollFilterIntoView(button) {
      if (!filterTrack || !button || !selectorMobileQuery.matches) return;
      const left = button.offsetLeft - ((filterTrack.clientWidth - button.offsetWidth) / 2);
      filterTrack.scrollTo({
        left: Math.max(0, left),
        behavior: reducedMotionQuery.matches ? "auto" : "smooth"
      });
    }

    function setDossierTab(spreadId, tabName, { focus = false } = {}) {
      const spreadTabs = dossierTabs.filter((tab) => tab.dataset.spreadDossierSpread === spreadId);
      const nextTab = spreadTabs.find((tab) => tab.dataset.spreadDossierTab === tabName) || spreadTabs[0];
      if (!nextTab) return;
      const nextName = nextTab.dataset.spreadDossierTab;
      selectedDossierTabs.set(spreadId, nextName);
      spreadTabs.forEach((tab) => {
        const active = tab === nextTab;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      dossierPanels
        .filter((panel) => panel.dataset.spreadDossierSpread === spreadId)
        .forEach((panel) => {
          const active = panel.dataset.spreadDossierPanel === nextName;
          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
          panel.inert = !active;
        });
      if (focus) nextTab.focus({ preventScroll: true });
    }

    function animatePositionDetail(detail, spreadId) {
      positionDetailAnimations.get(spreadId)?.cancel();
      positionDetailAnimations.delete(spreadId);
      if (!detail || reducedMotionQuery.matches || typeof detail.animate !== "function") return;
      const animation = detail.animate(
        [
          { opacity: .52 },
          { opacity: 1 }
        ],
        {
          duration: 220,
          easing: "cubic-bezier(.22, .72, .2, 1)"
        }
      );
      positionDetailAnimations.set(spreadId, animation);
      animation.finished
        .catch(() => {})
        .finally(() => {
          if (positionDetailAnimations.get(spreadId) === animation) {
            positionDetailAnimations.delete(spreadId);
          }
        });
    }

    function setDrawerExpanded(spreadId, expanded) {
      const panel = panels.find((item) => item.dataset.spreadPanel === spreadId);
      const drawer = panel?.querySelector(`[data-spread-drawer="${spreadId}"]`);
      if (!drawer) return;
      const nextExpanded = Boolean(expanded);
      const details = drawer.querySelector("[data-spread-drawer-details]");
      const toggle = drawer.querySelector("[data-spread-drawer-toggle]");
      const label = toggle?.querySelector("[data-spread-drawer-toggle-label]");
      selectedDrawerExpanded.set(spreadId, nextExpanded);
      drawer.classList.toggle("is-expanded", nextExpanded);
      if (details) details.hidden = !nextExpanded;
      if (toggle) toggle.setAttribute("aria-expanded", String(nextExpanded));
      if (label) label.textContent = nextExpanded ? "Collapse details" : "Expand details";
    }

    function setActivePosition(spreadId, positionIndex, { focus = false, announce = true, reveal = false } = {}) {
      const panel = panels.find((item) => item.dataset.spreadPanel === spreadId);
      if (!panel) return;
      const spreadButtons = positionButtons.filter((button) => button.dataset.spreadPositionSpread === spreadId);
      const nextIndex = Math.max(0, Math.min(Number(positionIndex) || 0, spreadButtons.length - 1));
      const activeButton = spreadButtons[nextIndex];
      if (!activeButton) return;
      selectedPositions.set(spreadId, nextIndex);

      spreadButtons.forEach((button, index) => {
        const active = index === nextIndex;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
        button.tabIndex = active ? 0 : -1;
      });

      panel.querySelectorAll("[data-spread-position-item]").forEach((item) => {
        const active = Number(item.dataset.spreadPositionItem) === nextIndex;
        item.classList.toggle("is-active", active);
        item.hidden = !active;
        item.inert = !active;
      });

      const detail = panel.querySelector("[data-spread-position-detail]");
      const number = detail?.querySelector("[data-spread-position-number]");
      const name = detail?.querySelector("[data-spread-position-name]");
      const title = detail?.querySelector("[data-spread-position-title]");
      const copy = detail?.querySelector("[data-spread-position-copy]");
      if (number) number.textContent = `Position ${String(nextIndex + 1).padStart(2, "0")}`;
      if (name) name.textContent = activeButton.dataset.positionName || `Position ${nextIndex + 1}`;
      if (title) title.textContent = activeButton.dataset.positionName || `Position ${nextIndex + 1}`;
      if (copy) copy.textContent = activeButton.dataset.positionCopy || "";
      animatePositionDetail(detail?.querySelector("[data-spread-position-item]:not([hidden])") || detail, spreadId);

      if (reveal) setDossierTab(spreadId, "positions");
      if (focus) activeButton.focus({ preventScroll: true });
      if (announce && explorerStatus) {
        const spreadName = panel.querySelector(".spread-dossier__title")?.textContent?.trim() || "Tarot spread";
        explorerStatus.textContent = `${activeButton.dataset.positionName || `Position ${nextIndex + 1}`} selected in ${spreadName}`;
      }
    }

    function clearSpreadTransitionWait() {
      window.clearTimeout(spreadTransitionTimer);
      spreadTransitionTimer = 0;
      spreadTransitionCleanup?.();
      spreadTransitionCleanup = null;
    }

    function setSpreadTransitionState(state) {
      spreadTransitionState = state;
      explorer.dataset.spreadTransitionState = state;
      explorer.classList.toggle("is-changing-spread", state !== "idle");
      explorer.setAttribute("aria-busy", String(state !== "idle"));
    }

    function waitForSpreadPhase({
      element,
      eventName,
      matches,
      fallbackMs,
      token,
      complete
    }) {
      clearSpreadTransitionWait();
      let settled = false;
      const cleanup = () => {
        element?.removeEventListener(eventName, handleCompletion);
        window.clearTimeout(spreadTransitionTimer);
        spreadTransitionTimer = 0;
      };
      const finish = () => {
        if (settled) return;
        settled = true;
        cleanup();
        if (spreadTransitionCleanup === cancel) spreadTransitionCleanup = null;
        if (token === spreadTransitionToken) complete();
      };
      const handleCompletion = (event) => {
        if (matches(event)) finish();
      };
      const cancel = () => {
        if (settled) return;
        settled = true;
        cleanup();
      };
      spreadTransitionCleanup = cancel;
      element?.addEventListener(eventName, handleCompletion);
      spreadTransitionTimer = window.setTimeout(finish, fallbackMs);
    }

    function cancelSpreadTransition({ restoreActivePosition = true } = {}) {
      spreadTransitionToken += 1;
      clearSpreadTransitionWait();
      pendingSpreadRequest = null;
      panels.forEach((panel) => panel.classList.remove("is-exiting", "is-entering"));
      if (restoreActivePosition && activeSpread) {
        setActivePosition(activeSpread, selectedPositions.get(activeSpread) || 0, {
          announce: false,
          reveal: false
        });
      }
      setSpreadTransitionState("idle");
    }

    function commitActiveSpread(spreadId, targetSelector, { scroll = false, entering = false } = {}) {
      if (!targetSelector) return;
      const spreadChanged = activeSpread !== spreadId;
      activeSpread = spreadId;
      selectors.forEach((selector) => {
        const active = selector.dataset.spreadSelector === activeSpread;
        selector.classList.toggle("is-active", active);
        selector.setAttribute("aria-selected", String(active));
        selector.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        const active = panel.dataset.spreadPanel === activeSpread;
        panel.classList.remove("is-exiting", "is-entering");
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
        panel.hidden = !active;
      });
      const activePanel = panels.find((panel) => panel.dataset.spreadPanel === activeSpread);
      activePanel?.classList.toggle("is-entering", entering);
      if (explorerStatus) {
        explorerStatus.textContent = `${targetSelector.querySelector("strong")?.textContent?.trim() || "Tarot spread"} selected`;
      }
      if (spreadChanged) selectedPositions.set(activeSpread, 0);
      setActivePosition(activeSpread, selectedPositions.get(activeSpread) || 0, { announce: false, reveal: false });
      setDrawerExpanded(activeSpread, spreadChanged ? false : (selectedDrawerExpanded.get(activeSpread) || false));
      setDossierTab(activeSpread, selectedDossierTabs.get(activeSpread) || "overview");
      if (scroll) {
        targetSelector.scrollIntoView({
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }

    function finishSpreadEntry(token) {
      if (token !== spreadTransitionToken) return;
      panels
        .find((panel) => panel.dataset.spreadPanel === activeSpread)
        ?.classList.remove("is-entering");
      pendingSpreadRequest = null;
      setSpreadTransitionState("idle");
    }

    function enterRequestedSpread(request, token) {
      const targetSelector = selectors.find((selector) => (
        selector.dataset.spreadSelector === request.spreadId && !selector.hidden
      )) || getVisibleSelectors()[0];
      if (!targetSelector) {
        cancelSpreadTransition();
        return;
      }
      const targetSpread = targetSelector.dataset.spreadSelector;
      commitActiveSpread(targetSpread, targetSelector, { scroll: request.scroll, entering: true });
      setSpreadTransitionState("entering");
      const activePanel = panels.find((panel) => panel.dataset.spreadPanel === targetSpread);
      const enteringCards = positionButtons.filter((button) => button.dataset.spreadPositionSpread === targetSpread);
      const finalCard = enteringCards[enteringCards.length - 1];
      if (!activePanel || !finalCard || reducedMotionQuery.matches) {
        finishSpreadEntry(token);
        return;
      }
      waitForSpreadPhase({
        element: activePanel,
        eventName: "animationend",
        matches: (event) => (
          event.target === finalCard &&
          event.animationName === "spread-tabletop-deal"
        ),
        fallbackMs: 540 + (Math.max(0, enteringCards.length - 1) * 32),
        token,
        complete: () => finishSpreadEntry(token)
      });
    }

    function finishSpreadExit(token) {
      if (token !== spreadTransitionToken) return;
      panels
        .find((panel) => panel.dataset.spreadPanel === activeSpread)
        ?.classList.remove("is-exiting");
      const request = pendingSpreadRequest;
      if (!request) {
        setSpreadTransitionState("idle");
        return;
      }
      enterRequestedSpread(request, token);
    }

    function beginSpreadExit(request) {
      pendingSpreadRequest = request;
      const currentPanel = panels.find((panel) => panel.dataset.spreadPanel === activeSpread && !panel.hidden);
      if (!currentPanel) {
        const token = ++spreadTransitionToken;
        enterRequestedSpread(request, token);
        return;
      }
      const token = ++spreadTransitionToken;
      setSpreadTransitionState("exiting");
      currentPanel.classList.remove("is-entering");
      currentPanel.classList.add("is-exiting");
      const outgoingCards = positionButtons.filter((button) => button.dataset.spreadPositionSpread === activeSpread);
      const firstCard = outgoingCards[0];
      if (!firstCard) {
        finishSpreadExit(token);
        return;
      }
      waitForSpreadPhase({
        element: currentPanel,
        eventName: "transitionend",
        matches: (event) => (
          event.target === firstCard &&
          (event.propertyName === "opacity" || event.propertyName === "transform")
        ),
        fallbackMs: 240,
        token,
        complete: () => finishSpreadExit(token)
      });
    }

    function setActiveSpread(spreadId, { scroll = false, animate = true } = {}) {
      const targetSelector = selectors.find((selector) => selector.dataset.spreadSelector === spreadId && !selector.hidden);
      if (!targetSelector) return;
      if (!animate || reducedMotionQuery.matches) {
        cancelSpreadTransition({ restoreActivePosition: false });
        commitActiveSpread(spreadId, targetSelector, { scroll });
        setSpreadTransitionState("idle");
        return;
      }
      const request = { spreadId, scroll };
      if (spreadTransitionState === "exiting") {
        if (spreadId === activeSpread) {
          cancelSpreadTransition();
          commitActiveSpread(activeSpread, targetSelector, { scroll });
        } else {
          pendingSpreadRequest = request;
        }
        return;
      }
      if (spreadTransitionState === "entering") {
        cancelSpreadTransition({ restoreActivePosition: false });
      }
      if (spreadId === activeSpread) {
        commitActiveSpread(activeSpread, targetSelector, { scroll });
        setSpreadTransitionState("idle");
        return;
      }
      beginSpreadExit(request);
    }

    function applyFilter(filter, { scroll = false, animate = true } = {}) {
      activeFilter = filters.some((button) => button.dataset.spreadFilter === filter) ? filter : "all";
      const activeButton = filters.find((button) => button.dataset.spreadFilter === activeFilter);
      filters.forEach((button) => {
        const active = button.dataset.spreadFilter === activeFilter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      selectors.forEach((selector) => {
        selector.hidden = !matchesFilter(selector, activeFilter);
      });
      indexGroups.forEach((group) => {
        group.hidden = !Array.from(group.querySelectorAll("[data-spread-selector]")).some((selector) => !selector.hidden);
      });
      const visibleSelectors = getVisibleSelectors();
      const nextSpread = visibleSelectors.some((selector) => selector.dataset.spreadSelector === activeSpread)
        ? activeSpread
        : visibleSelectors[0]?.dataset.spreadSelector || "";
      setActiveSpread(nextSpread, { scroll, animate });
      positionFilterIndicator(activeButton);
      if (scroll) scrollFilterIntoView(activeButton);
    }

    filters.forEach((button, index) => {
      button.addEventListener("click", () => applyFilter(button.dataset.spreadFilter, { scroll: true }));
      button.addEventListener("keydown", (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % filters.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + filters.length) % filters.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = filters.length - 1;
        else return;
        event.preventDefault();
        filters[targetIndex].focus({ preventScroll: true });
        applyFilter(filters[targetIndex].dataset.spreadFilter, { scroll: true });
      });
    });

    dossierTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        setDossierTab(tab.dataset.spreadDossierSpread, tab.dataset.spreadDossierTab);
      });
      tab.addEventListener("keydown", (event) => {
        const spreadTabs = dossierTabs.filter((item) => item.dataset.spreadDossierSpread === tab.dataset.spreadDossierSpread);
        const currentIndex = spreadTabs.indexOf(tab);
        let targetIndex = currentIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (currentIndex + 1) % spreadTabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (currentIndex - 1 + spreadTabs.length) % spreadTabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = spreadTabs.length - 1;
        else return;
        event.preventDefault();
        setDossierTab(tab.dataset.spreadDossierSpread, spreadTabs[targetIndex].dataset.spreadDossierTab, { focus: true });
      });
    });

    positionButtons.forEach((button) => {
      button.addEventListener("keydown", (event) => {
        const spreadId = button.dataset.spreadPositionSpread;
        const spreadButtons = positionButtons.filter((item) => item.dataset.spreadPositionSpread === spreadId);
        const currentIndex = spreadButtons.indexOf(button);
        let targetIndex = currentIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (currentIndex + 1) % spreadButtons.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (currentIndex - 1 + spreadButtons.length) % spreadButtons.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = spreadButtons.length - 1;
        else return;
        event.preventDefault();
        setActivePosition(spreadId, targetIndex, { focus: true });
      });
    });

    explorer.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const positionButton = event.target.closest("[data-spread-position]");
      if (positionButton && explorer.contains(positionButton) && !positionButton.closest("[hidden]")) {
        setActivePosition(
          positionButton.dataset.spreadPositionSpread,
          Number(positionButton.dataset.spreadPosition),
          { focus: true }
        );
        return;
      }
      const positionLink = event.target.closest("[data-spread-position-link]");
      if (positionLink && explorer.contains(positionLink) && !positionLink.closest("[hidden]")) {
        setActivePosition(
          positionLink.dataset.spreadPositionSpread,
          Number(positionLink.dataset.spreadPositionLink),
          { focus: false, reveal: false }
        );
        return;
      }
      const drawerToggle = event.target.closest("[data-spread-drawer-toggle]");
      if (drawerToggle && explorer.contains(drawerToggle) && !drawerToggle.closest("[hidden]")) {
        const spreadId = drawerToggle.dataset.spreadDrawerToggle;
        setDrawerExpanded(spreadId, !selectedDrawerExpanded.get(spreadId));
        return;
      }
      const drawerPrevious = event.target.closest("[data-spread-drawer-previous]");
      if (drawerPrevious && explorer.contains(drawerPrevious) && !drawerPrevious.closest("[hidden]")) {
        const spreadId = drawerPrevious.dataset.spreadDrawerPrevious;
        const spreadButtons = positionButtons.filter((item) => item.dataset.spreadPositionSpread === spreadId);
        const nextIndex = ((selectedPositions.get(spreadId) || 0) - 1 + spreadButtons.length) % spreadButtons.length;
        setActivePosition(spreadId, nextIndex, { focus: false });
        return;
      }
      const drawerNext = event.target.closest("[data-spread-drawer-next]");
      if (drawerNext && explorer.contains(drawerNext) && !drawerNext.closest("[hidden]")) {
        const spreadId = drawerNext.dataset.spreadDrawerNext;
        const spreadButtons = positionButtons.filter((item) => item.dataset.spreadPositionSpread === spreadId);
        const nextIndex = ((selectedPositions.get(spreadId) || 0) + 1) % spreadButtons.length;
        setActivePosition(spreadId, nextIndex, { focus: false });
      }
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

    function closeSpreadModal({ restoreFocus = true } = {}) {
      if (!modal || modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove("tarot-spread-modal-open");
      modalPanels.forEach((panel) => {
        panel.hidden = true;
        panel.inert = true;
      });
      if (restoreFocus) modalReturnFocus?.focus({ preventScroll: true });
      modalReturnFocus = null;
    }

    function openSpreadModal(spreadId, trigger) {
      if (!modal || !modalDialog) return;
      const targetPanel = modalPanels.find((panel) => panel.dataset.spreadModalPanel === spreadId);
      if (!targetPanel) return;
      modalReturnFocus = trigger;
      modalPanels.forEach((panel) => {
        const active = panel === targetPanel;
        panel.hidden = !active;
        panel.inert = !active;
      });
      modalDialog.setAttribute("aria-labelledby", `spread-modal-title-${spreadId}`);
      modal.hidden = false;
      document.body.classList.add("tarot-spread-modal-open");
      window.requestAnimationFrame(() => {
        modalDialog.scrollTop = 0;
        modalDialog.focus({ preventScroll: true });
      });
    }

    modalOpeners.forEach((button) => {
      button.addEventListener("click", () => openSpreadModal(button.dataset.spreadModalOpen, button));
    });
    modalClosers.forEach((button) => {
      button.addEventListener("click", () => closeSpreadModal());
    });
    modal?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSpreadModal();
        return;
      }
      if (event.key !== "Tab" || !modalDialog) return;
      const focusable = Array.from(modalDialog.querySelectorAll('button:not([disabled]):not([hidden]), a[href], [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.closest("[hidden]"));
      if (!focusable.length) {
        event.preventDefault();
        modalDialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === modalDialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    explorer.classList.add("is-enhanced");
    syncSelectorOrientation();
    selectorMobileQuery.addEventListener?.("change", syncSelectorOrientation);
    applyFilter("all", { animate: false });
    window.requestAnimationFrame(() => filterTrack?.classList.add("is-ready"));
    const filterResizeObserver = typeof ResizeObserver === "function"
      ? new ResizeObserver(() => {
        window.cancelAnimationFrame(filterResizeFrame);
        filterResizeFrame = window.requestAnimationFrame(() => {
          positionFilterIndicator(filters.find((button) => button.dataset.spreadFilter === activeFilter));
        });
      })
      : null;
    filterResizeObserver?.observe(filterTrack);
    filters.forEach((button) => filterResizeObserver?.observe(button));
    window.addEventListener("pagehide", () => {
      spreadTransitionToken += 1;
      clearSpreadTransitionWait();
      positionDetailAnimations.forEach((animation) => animation.cancel());
      positionDetailAnimations.clear();
      filterResizeObserver?.disconnect();
      selectorMobileQuery.removeEventListener?.("change", syncSelectorOrientation);
      window.cancelAnimationFrame(filterResizeFrame);
      panels.forEach((panel) => panel.classList.remove("is-exiting", "is-entering"));
      setSpreadTransitionState("idle");
    }, { once: true });
  }

  const comparison = document.querySelector("[data-spread-comparison]");

  if (comparison) {
    const tabs = Array.from(comparison.querySelectorAll("[data-spread-comparison-tab]"));
    const panels = Array.from(comparison.querySelectorAll("[data-spread-comparison-panel]"));

    function setComparison(key) {
      const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.dataset.spreadComparisonTab === key));
      comparison.dataset.activeComparison = key;
      comparison.style.setProperty("--comparison-active-index", String(activeIndex));
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
        tabs[targetIndex].focus({ preventScroll: true });
        setComparison(tabs[targetIndex].dataset.spreadComparisonTab);
      });
    });

    comparison.classList.add("is-enhanced");
    setComparison(tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.spreadComparisonTab || "simple");
  }
})();
