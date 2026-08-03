(function () {
  const STORAGE_KEY = "astralVeilTarotBeginnerProgress";
  const CHAPTER_EXIT_DURATION = 200;
  const DOOR_LIGHT_DURATION = 580;
  const CHAPTER_ENTER_DURATION = 260;
  const REDUCED_CROSSFADE_DURATION = 120;

  const root = document.querySelector("[data-beginner-root]");
  const experience = root?.querySelector("[data-beginner-experience]");
  const metadataNode = root?.querySelector("#tarot-beginners-chapter-data");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!root || !experience || !metadataNode) return;

  let chapterData = [];
  try {
    chapterData = JSON.parse(metadataNode.textContent || "[]");
  } catch (error) {
    return;
  }

  const chapterIds = chapterData.map((chapter) => chapter.id);
  const chapterIdSet = new Set(chapterIds);
  const chapterById = new Map(chapterData.map((chapter, index) => [chapter.id, { ...chapter, index }]));
  const articleById = new Map(
    Array.from(root.querySelectorAll("[data-beginner-chapter]"))
      .map((article) => [article.dataset.beginnerChapter, article])
  );

  if (
    chapterData.length !== 10
    || chapterIdSet.size !== chapterData.length
    || articleById.size !== chapterData.length
    || chapterIds.some((id) => !articleById.has(id))
  ) {
    return;
  }

  const panels = {
    welcome: root.querySelector('[data-beginner-panel="welcome"]'),
    library: root.querySelector('[data-beginner-panel="library"]'),
    reader: root.querySelector('[data-beginner-panel="reader"]')
  };
  const welcome = root.querySelector("[data-beginner-welcome]");
  const door = root.querySelector("[data-beginner-door]");
  const reader = root.querySelector("[data-beginner-reader]");
  const liveRegion = root.querySelector("[data-beginner-live-region]");
  const mobileCount = root.querySelector("[data-mobile-chapter-count]");
  const mobileTitle = root.querySelector("[data-mobile-chapter-title]");
  const mobileProgress = root.querySelector("[data-mobile-progress]");
  const readerEnd = root.querySelector("[data-reader-end]");
  const chapterMenu = root.querySelector("[data-chapter-menu]");
  const openMenuButton = root.querySelector("[data-open-chapter-menu]");
  const closeMenuButton = root.querySelector("[data-close-chapter-menu]");
  const navigationLinks = Array.from(root.querySelectorAll("[data-chapter-nav-location]"));
  const libraryCards = Array.from(root.querySelectorAll("[data-library-chapter]"));
  const previousControls = Array.from(root.querySelectorAll("[data-reader-previous]"));
  const continueControls = Array.from(root.querySelectorAll("[data-reader-continue]"));
  const returnGuidedControls = Array.from(root.querySelectorAll("[data-return-guided]"));
  const transitionControls = Array.from(root.querySelectorAll(
    "[data-beginner-chapter-link], [data-reader-previous], [data-reader-continue], [data-beginner-view-link], [data-beginner-view-all], [data-return-guided], [data-open-chapter-menu]"
  ));

  if (!panels.welcome || !panels.library || !panels.reader || !welcome || !reader || !door) return;

  const state = {
    view: "welcome",
    activeId: chapterIds[0],
    visited: new Set(),
    preferredView: "guided",
    transitioning: false,
    pendingLocationSync: false,
    locationFrame: 0,
    menuOpener: null
  };

  function sanitizeProgress(value) {
    const source = value && typeof value === "object" ? value : {};
    const visitedChapters = Array.isArray(source.visitedChapters)
      ? [...new Set(source.visitedChapters.filter((id) => chapterIdSet.has(id)))]
      : [];
    const currentChapter = chapterIdSet.has(source.currentChapter)
      ? source.currentChapter
      : visitedChapters.at(-1) || chapterIds[0];
    const viewMode = source.viewMode === "all" ? "all" : "guided";
    return { currentChapter, visitedChapters, viewMode };
  }

  function readProgress() {
    try {
      return sanitizeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    } catch (error) {
      return sanitizeProgress(null);
    }
  }

  function saveProgress() {
    const progress = {
      currentChapter: state.activeId,
      visitedChapters: chapterIds.filter((id) => state.visited.has(id)),
      viewMode: state.preferredView
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      // Storage is an enhancement. Navigation remains fully functional without it.
    }
  }

  function setElementAvailability(element, isAvailable) {
    if (!element) return;
    element.hidden = !isAvailable;
    element.inert = !isAvailable;
  }

  function setPrimaryView(view) {
    const normalizedView = ["welcome", "library", "chapter", "all"].includes(view) ? view : "welcome";
    state.view = normalizedView;
    root.dataset.beginnerView = normalizedView;
    setElementAvailability(panels.welcome, normalizedView === "welcome");
    setElementAvailability(panels.library, normalizedView === "library");
    setElementAvailability(panels.reader, normalizedView === "chapter" || normalizedView === "all");
    return normalizedView;
  }

  function setChapterVisibility(view = state.view) {
    articleById.forEach((article, id) => {
      const isAvailable = view === "all" || (view === "chapter" && id === state.activeId);
      article.hidden = !isAvailable;
      article.inert = !isAvailable;
      article.classList.toggle("is-active", id === state.activeId);
    });
  }

  function setControlLink(control, chapter, { isPrevious = false } = {}) {
    if (!control) return;
    const isDesktop = Boolean(control.closest(".tarot-beginners-reader-controls"));
    const isAvailable = Boolean(chapter);
    if (!isPrevious) control.hidden = !isAvailable;
    control.setAttribute("aria-disabled", String(!isAvailable));
    control.tabIndex = isAvailable ? 0 : -1;

    if (!chapter) {
      control.href = "#chapters";
      if (isDesktop) {
        control.textContent = isPrevious ? "Previous Chapter" : "Return to Chapter Library";
      }
      return;
    }

    control.href = chapter.hash;
    if (isDesktop) {
      control.textContent = isPrevious
        ? `← Previous: Chapter ${chapter.number}`
        : `Continue to Chapter ${chapter.number} →`;
    }
  }

  function updateWelcomeResume() {
    const hasProgress = state.visited.size > 0;
    const activeChapter = chapterById.get(state.activeId) || chapterById.get(chapterIds[0]);

    root.querySelectorAll("[data-welcome-primary]").forEach((link) => {
      const label = link.querySelector("[data-welcome-primary-label]");
      const isBlood = link.closest('[data-beginner-welcome-copy="blood"]');
      link.href = activeChapter.hash;
      link.dataset.beginnerChapterLink = activeChapter.id;
      if (!label) return;
      if (!hasProgress) {
        label.textContent = isBlood ? "Enter Chapter One" : "Open Chapter One";
      } else {
        label.textContent = isBlood
          ? "Return to the Lesson You Abandoned"
          : `Continue with Chapter ${activeChapter.number}`;
      }
    });
  }

  function updateNavigationStates() {
    const activeChapter = chapterById.get(state.activeId) || chapterById.get(chapterIds[0]);
    const previous = activeChapter.previous ? chapterById.get(activeChapter.previous) : null;
    const next = activeChapter.next ? chapterById.get(activeChapter.next) : null;

    navigationLinks.forEach((link) => {
      const id = link.dataset.beginnerChapterLink;
      const isCurrent = id === state.activeId;
      const isVisited = state.visited.has(id);
      const label = link.querySelector("[data-chapter-state]");
      link.classList.toggle("is-current", isCurrent);
      link.classList.toggle("is-visited", isVisited);
      if (isCurrent) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
      if (label) label.textContent = isCurrent ? "Current" : isVisited ? "Visited" : "Upcoming";
    });

    libraryCards.forEach((card) => {
      const id = card.dataset.libraryChapter;
      const isCurrent = id === state.activeId && state.visited.has(id);
      const isVisited = state.visited.has(id);
      const label = card.querySelector("[data-library-state]");
      card.classList.toggle("is-current", isCurrent);
      card.classList.toggle("is-visited", isVisited);
      if (label) label.textContent = isCurrent ? "Current chapter" : isVisited ? "Visited · Open again" : "Open chapter";
    });

    previousControls.forEach((control) => setControlLink(control, previous, { isPrevious: true }));
    continueControls.forEach((control) => setControlLink(control, next));

    if (mobileCount) mobileCount.textContent = `Chapter ${activeChapter.number} of 10`;
    if (mobileTitle) mobileTitle.textContent = activeChapter.navLabel;
    if (mobileProgress) {
      mobileProgress.setAttribute("aria-valuenow", String(activeChapter.index + 1));
      mobileProgress.style.setProperty("--beginner-progress", `${((activeChapter.index + 1) / chapterData.length) * 100}%`);
    }
    if (readerEnd) readerEnd.hidden = Boolean(next);
    returnGuidedControls.forEach((control) => {
      control.hidden = state.view !== "all";
    });
    updateWelcomeResume();
  }

  function announce(message) {
    if (liveRegion) liveRegion.textContent = message;
  }

  function markChapterVisited(id) {
    if (!chapterIdSet.has(id)) return;
    state.visited.add(id);
    state.activeId = id;
    saveProgress();
  }

  function commitChapter(id, { view = "chapter", markVisited = true, announceChange = true } = {}) {
    const chapter = chapterById.get(id) || chapterById.get(chapterIds[0]);
    state.activeId = chapter.id;
    setPrimaryView(view);
    if (markVisited) markChapterVisited(chapter.id);
    state.preferredView = view === "all" ? "all" : "guided";
    setChapterVisibility(view);
    updateNavigationStates();
    saveProgress();
    if (announceChange) {
      announce(view === "all"
        ? `All ten beginner chapters are visible. Guided focus remains on Chapter ${chapter.number}, ${chapter.title}.`
        : `Chapter ${chapter.number} of 10, ${chapter.title}.`);
    }
    return chapter;
  }

  function historyPayload(view, chapterId = state.activeId) {
    return { tarotBeginner: { view, chapterId } };
  }

  function writeHistory(view, chapterId, mode = "push") {
    if (mode === "none") return;
    const chapter = chapterById.get(chapterId);
    const resolvedChapterId = chapter?.id || state.activeId;
    const hash = view === "welcome" ? "#welcome"
      : view === "library" ? "#chapters"
        : chapter?.hash || "#welcome";
    const currentEntry = window.history.state?.tarotBeginner;
    const isNonReaderView = view === "welcome" || view === "library";
    const isSameVisibleEntry = currentEntry?.view === view
      && (isNonReaderView || currentEntry?.chapterId === resolvedChapterId);
    if (mode === "push" && window.location.hash === hash && isSameVisibleEntry) return;
    const url = new URL(window.location.href);
    url.hash = hash;
    const method = mode === "replace" ? "replaceState" : "pushState";
    window.history[method](historyPayload(view, resolvedChapterId), "", `${url.pathname}${url.search}${url.hash}`);
  }

  function scrollToPanel(panel, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
    panel?.scrollIntoView({ block: "start", behavior });
  }

  function focusChapterHeading(id) {
    const heading = articleById.get(id)?.querySelector("h2");
    heading?.focus({ preventScroll: true });
  }

  function setTransitionBusy(isBusy) {
    state.transitioning = isBusy;
    root.classList.toggle("is-transitioning", isBusy);
    if (isBusy) root.setAttribute("aria-busy", "true");
    else root.removeAttribute("aria-busy");

    transitionControls.forEach((control) => {
      if (control instanceof HTMLButtonElement) control.disabled = isBusy;
      if (isBusy) control.dataset.transitionLocked = "true";
      else delete control.dataset.transitionLocked;
    });
    if (!isBusy) updateNavigationStates();
  }

  function animateElement(element, keyframes, options) {
    if (!element || typeof element.animate !== "function") return null;
    const animation = element.animate(keyframes, options);
    return animation.finished.catch(() => undefined);
  }

  function cancelTransitionAnimations() {
    [door, ...door.querySelectorAll("*"), ...articleById.values()].forEach((element) => {
      if (typeof element?.getAnimations !== "function") return;
      element.getAnimations().forEach((animation) => animation.cancel());
    });
  }

  function stageChapter(id) {
    const chapter = chapterById.get(id) || chapterById.get(chapterIds[0]);
    state.activeId = chapter.id;
    state.preferredView = "guided";
    setPrimaryView("chapter");
    setChapterVisibility("chapter");
    updateNavigationStates();
    return chapter;
  }

  async function transitionToChapter(id, {
    historyMode = "push",
    focus = true,
    scroll = true
  } = {}) {
    const target = chapterById.get(id);
    if (!target || state.transitioning) return;

    const targetArticle = articleById.get(target.id);
    const currentArticle = articleById.get(state.activeId);
    const canAnimate = typeof targetArticle?.animate === "function";
    const previousState = {
      view: state.view,
      activeId: state.activeId,
      preferredView: state.preferredView
    };

    if (state.view === "chapter" && state.activeId === target.id) {
      writeHistory("chapter", target.id, historyMode);
      if (scroll) scrollToPanel(targetArticle);
      if (focus) focusChapterHeading(target.id);
      return;
    }

    writeHistory("chapter", target.id, historyMode);
    setTransitionBusy(true);
    if (scroll) {
      setPrimaryView("chapter");
      setChapterVisibility("chapter");
      scrollToPanel(reader, "auto");
    }

    try {
      if (!canAnimate) {
        commitChapter(target.id);
      } else if (reducedMotionQuery.matches) {
        await animateElement(currentArticle, [{ opacity: 1 }, { opacity: 0 }], {
          duration: REDUCED_CROSSFADE_DURATION,
          easing: "ease-out"
        });
        if (state.pendingLocationSync) return;
        stageChapter(target.id);
        await animateElement(targetArticle, [{ opacity: 0 }, { opacity: 1 }], {
          duration: REDUCED_CROSSFADE_DURATION,
          easing: "ease-out"
        });
        if (state.pendingLocationSync) return;
        commitChapter(target.id);
      } else {
        door.classList.add("is-active");
        const doorLine = door.querySelector("span");
        const doorSeal = door.querySelector("i");
        const doorAnimation = animateElement(doorLine, [
          { opacity: 0, transform: "scaleX(.6)" },
          { opacity: 1, transform: "scaleX(1)", offset: .24 },
          { opacity: 1, transform: "scaleX(28)", offset: .56 },
          { opacity: .9, transform: "scaleX(4)", offset: .78 },
          { opacity: 0, transform: "scaleX(.5)" }
        ], {
          duration: DOOR_LIGHT_DURATION,
          easing: "cubic-bezier(.3,.7,.25,1)"
        });
        const sealAnimation = animateElement(doorSeal, [
          { opacity: 0, transform: "translate(-50%, -50%) scale(.65)" },
          { opacity: 0, transform: "translate(-50%, -50%) scale(.65)", offset: .58 },
          { opacity: 1, transform: "translate(-50%, -50%) scale(1)", offset: .78 },
          { opacity: 0, transform: "translate(-50%, -50%) scale(.82)" }
        ], {
          duration: DOOR_LIGHT_DURATION,
          easing: "cubic-bezier(.3,.7,.25,1)"
        });
        const veilAnimation = animateElement(door, [
          { backgroundColor: "rgba(0,0,0,0)" },
          { backgroundColor: "rgba(0,0,0,.18)", offset: .4 },
          { backgroundColor: "rgba(0,0,0,0)" }
        ], { duration: DOOR_LIGHT_DURATION, easing: "ease-in-out" });
        await animateElement(currentArticle, [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: "translateX(-12px)" }
        ], { duration: CHAPTER_EXIT_DURATION, easing: "ease-in" });
        if (state.pendingLocationSync) return;
        stageChapter(target.id);
        const enterAnimation = animateElement(targetArticle, [
          { opacity: 0, transform: "translateX(12px)" },
          { opacity: 1, transform: "translateX(0)" }
        ], { duration: CHAPTER_ENTER_DURATION, easing: "cubic-bezier(.2,.75,.3,1)" });
        await Promise.all([doorAnimation, sealAnimation, veilAnimation, enterAnimation]);
        if (state.pendingLocationSync) return;
        commitChapter(target.id);
      }

      if (focus && !state.pendingLocationSync) focusChapterHeading(target.id);
    } catch (error) {
      commitChapter(target.id);
      if (focus && !state.pendingLocationSync) focusChapterHeading(target.id);
    } finally {
      door.classList.remove("is-active");
      if (state.pendingLocationSync) {
        state.activeId = previousState.activeId;
        state.preferredView = previousState.preferredView;
        setPrimaryView(previousState.view);
        setChapterVisibility(previousState.view);
        updateNavigationStates();
      }
      setTransitionBusy(false);
      if (state.pendingLocationSync) {
        state.pendingLocationSync = false;
        scheduleLocationSync();
      }
    }
  }

  function showView(view, {
    historyMode = "push",
    scroll = true,
    focus = false
  } = {}) {
    if (state.transitioning) return;
    const normalizedView = view === "library" ? "library" : "welcome";
    setPrimaryView(normalizedView);
    setChapterVisibility(normalizedView);
    updateNavigationStates();
    writeHistory(normalizedView, state.activeId, historyMode);
    if (scroll) scrollToPanel(panels[normalizedView]);
    if (focus) panels[normalizedView]?.querySelector("h2")?.focus({ preventScroll: true });
    announce(normalizedView === "library" ? "Chapter library opened." : "Welcome to the beginning.");
  }

  function showAllChapters({ historyMode = "push", scroll = true } = {}) {
    if (state.transitioning) return;
    const chapter = commitChapter(state.activeId, { view: "all", markVisited: false });
    writeHistory("all", chapter.id, historyMode);
    if (scroll) scrollToPanel(articleById.get(chapter.id));
  }

  function returnToGuided({ historyMode = "push", focus = true } = {}) {
    if (state.transitioning) return;
    const chapter = commitChapter(state.activeId, { view: "chapter", markVisited: false });
    writeHistory("chapter", chapter.id, historyMode);
    scrollToPanel(articleById.get(chapter.id));
    if (focus) focusChapterHeading(chapter.id);
  }

  function routeFromLocation() {
    const hash = window.location.hash.replace(/^#/, "");
    const storedHistory = window.history.state?.tarotBeginner;
    if (hash === "welcome" || hash === "") return { view: "welcome", chapterId: state.activeId };
    if (hash === "chapters") return { view: "library", chapterId: state.activeId };
    if (chapterIdSet.has(hash)) {
      const view = storedHistory?.view === "all" && storedHistory.chapterId === hash ? "all" : "chapter";
      return { view, chapterId: hash };
    }
    return { view: "welcome", chapterId: state.activeId, invalid: true };
  }

  function syncFromLocation({ initial = false } = {}) {
    const route = routeFromLocation();
    const historyMode = initial || route.invalid || !window.location.hash ? "replace" : "none";
    if (route.view === "welcome" || route.view === "library") {
      showView(route.view, { historyMode, scroll: false });
      return;
    }
    if (route.view === "all") {
      state.activeId = route.chapterId;
      showAllChapters({ historyMode, scroll: false });
      return;
    }
    commitChapter(route.chapterId, { view: "chapter", markVisited: true, announceChange: !initial });
    writeHistory("chapter", route.chapterId, historyMode);
  }

  function scheduleLocationSync() {
    window.cancelAnimationFrame(state.locationFrame);
    if (state.transitioning) {
      state.pendingLocationSync = true;
      cancelTransitionAnimations();
    }
    state.locationFrame = window.requestAnimationFrame(() => {
      state.locationFrame = 0;
      if (state.transitioning) {
        state.pendingLocationSync = true;
        return;
      }
      syncFromLocation();
    });
  }

  function closeChapterMenu({ restoreFocus = true } = {}) {
    if (!chapterMenu) return;
    if (typeof chapterMenu.close === "function" && chapterMenu.open) chapterMenu.close();
    else chapterMenu.removeAttribute("open");
    if (restoreFocus) state.menuOpener?.focus({ preventScroll: true });
  }

  function openChapterMenu() {
    if (!chapterMenu || state.transitioning) return;
    state.menuOpener = document.activeElement instanceof HTMLElement ? document.activeElement : openMenuButton;
    if (typeof chapterMenu.showModal === "function") chapterMenu.showModal();
    else chapterMenu.setAttribute("open", "");
    closeMenuButton?.focus({ preventScroll: true });
  }

  function syncWelcomeTheme(event) {
    const isBloodMoon = typeof event?.detail?.isActive === "boolean"
      ? event.detail.isActive
      : document.body.classList.contains("blood-moon-mode");
    const nextTheme = isBloodMoon ? "blood" : "regular";
    if (welcome.dataset.welcomeTheme === nextTheme) return;

    const outgoing = welcome.querySelector('[data-beginner-welcome-copy]:not([aria-hidden="true"])');
    const incoming = welcome.querySelector(`[data-beginner-welcome-copy="${nextTheme}"]`);
    const focusedAction = outgoing?.contains(document.activeElement)
      ? document.activeElement.closest("[data-welcome-primary], [data-beginner-view-link]")
      : null;
    const focusSelector = focusedAction?.hasAttribute("data-welcome-primary")
      ? "[data-welcome-primary]"
      : focusedAction?.hasAttribute("data-beginner-view-link")
        ? "[data-beginner-view-link]"
        : null;

    welcome.dataset.welcomeTheme = nextTheme;
    welcome.setAttribute("aria-labelledby", isBloodMoon ? "blood-welcome-heading" : "welcome-heading");
    welcome.querySelectorAll("[data-beginner-welcome-copy]").forEach((copy) => {
      const active = copy === incoming;
      copy.setAttribute("aria-hidden", String(!active));
      copy.inert = !active;
    });

    if (focusSelector) {
      window.requestAnimationFrame(() => incoming?.querySelector(focusSelector)?.focus({ preventScroll: true }));
    }
  }

  function handleChapterLink(event, link) {
    const id = link.dataset.beginnerChapterLink;
    if (!chapterIdSet.has(id)) return;
    event.preventDefault();
    if (state.transitioning) return;
    if (chapterMenu?.open) closeChapterMenu({ restoreFocus: false });

    if (state.view === "all" && link.hasAttribute("data-chapter-nav-location")) {
      state.activeId = id;
      updateNavigationStates();
      saveProgress();
      writeHistory("all", id, "replace");
      scrollToPanel(articleById.get(id));
      return;
    }
    transitionToChapter(id);
  }

  function moveToChapter(id) {
    if (!chapterIdSet.has(id)) return;
    if (state.view === "all") {
      state.activeId = id;
      updateNavigationStates();
      saveProgress();
      writeHistory("all", id, "replace");
      scrollToPanel(articleById.get(id));
      return;
    }
    transitionToChapter(id);
  }

  function handleRootClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const chapterLink = target.closest("[data-beginner-chapter-link]");
    if (chapterLink && root.contains(chapterLink)) {
      handleChapterLink(event, chapterLink);
      return;
    }

    const viewLink = target.closest("[data-beginner-view-link]");
    if (viewLink && root.contains(viewLink)) {
      event.preventDefault();
      showView(viewLink.dataset.beginnerViewLink === "library" ? "library" : "welcome", { focus: true });
      return;
    }

    if (target.closest("[data-beginner-view-all]")) {
      event.preventDefault();
      showAllChapters();
      return;
    }

    if (target.closest("[data-return-guided]")) {
      event.preventDefault();
      returnToGuided();
      return;
    }

    const previous = target.closest("[data-reader-previous]");
    if (previous) {
      event.preventDefault();
      const chapter = chapterById.get(state.activeId);
      if (chapter?.previous) moveToChapter(chapter.previous);
      return;
    }

    const next = target.closest("[data-reader-continue]");
    if (next) {
      event.preventDefault();
      const chapter = chapterById.get(state.activeId);
      if (chapter?.next) moveToChapter(chapter.next);
      else showView("library", { focus: true });
      return;
    }

    if (target.closest("[data-open-chapter-menu]")) {
      event.preventDefault();
      openChapterMenu();
      return;
    }

    if (target.closest("[data-close-chapter-menu]")) {
      event.preventDefault();
      closeChapterMenu();
    }
  }

  function showFallback() {
    document.documentElement.classList.remove("js-enabled");
    experience.classList.remove("is-enhanced");
    root.classList.remove("is-transitioning");
    root.removeAttribute("aria-busy");
    Object.values(panels).forEach((panel) => {
      if (!panel) return;
      panel.hidden = false;
      panel.inert = false;
    });
    articleById.forEach((article) => {
      article.hidden = false;
      article.inert = false;
    });
    door.classList.remove("is-active");
  }

  try {
    const progress = readProgress();
    state.activeId = progress.currentChapter;
    state.visited = new Set(progress.visitedChapters);
    state.preferredView = progress.viewMode;

    document.documentElement.classList.add("js-enabled");
    experience.classList.add("is-enhanced");
    root.addEventListener("click", handleRootClick);
    window.addEventListener("popstate", scheduleLocationSync);
    window.addEventListener("hashchange", scheduleLocationSync);
    window.addEventListener("astralVeilBloodMoonChange", syncWelcomeTheme);

    new MutationObserver(() => syncWelcomeTheme()).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    chapterMenu?.addEventListener("cancel", () => {
      state.menuOpener?.focus({ preventScroll: true });
    });
    chapterMenu?.addEventListener("click", (event) => {
      if (event.target === chapterMenu) closeChapterMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && chapterMenu?.hasAttribute("open") && typeof chapterMenu.close !== "function") {
        closeChapterMenu();
      }
    });

    syncWelcomeTheme();
    syncFromLocation({ initial: true });
  } catch (error) {
    showFallback();
  }
})();
