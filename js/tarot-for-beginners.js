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
  const mobileIndexQuery = window.matchMedia("(max-width: 820px)");

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
    index: root.querySelector('[data-beginner-panel="index"]'),
    reader: root.querySelector('[data-beginner-panel="reader"]')
  };
  const welcome = root.querySelector("[data-beginner-welcome]");
  const door = root.querySelector("[data-beginner-door]");
  const reader = root.querySelector("[data-beginner-reader]");
  const liveRegion = root.querySelector("[data-beginner-live-region]");
  const chapterNavigatorCount = root.querySelector("[data-chapter-navigator-count]");
  const chapterNavigatorTitle = root.querySelector("[data-chapter-navigator-title]");
  const chapterMenu = root.querySelector("[data-chapter-menu]");
  const openMenuButton = root.querySelector("[data-open-chapter-menu]");
  const closeMenuButton = root.querySelector("[data-close-chapter-menu]");
  const navigationLinks = Array.from(root.querySelectorAll("[data-chapter-nav-location]"));
  const previousControls = Array.from(root.querySelectorAll("[data-reader-dynamic-previous]"));
  const continueControls = Array.from(root.querySelectorAll("[data-reader-dynamic-next]"));
  const indexSection = root.querySelector("[data-beginner-index]");
  const indexViewport = root.querySelector("[data-beginner-index-viewport]");
  const indexTrack = root.querySelector("[data-beginner-index-track]");
  const indexSlides = Array.from(root.querySelectorAll("[data-beginner-index-slide]"));
  const indexSelectors = Array.from(root.querySelectorAll("[data-beginner-index-select]"));
  const indexProgressBars = Array.from(root.querySelectorAll("[data-beginner-index-progress]"));
  const indexProgressPercentages = Array.from(root.querySelectorAll("[data-beginner-index-progress-percent]"));
  const completeControls = Array.from(root.querySelectorAll("[data-beginner-complete-chapter]"));
  const indexCounters = Array.from(root.querySelectorAll("[data-beginner-index-counter]"));
  const indexActiveTitles = Array.from(root.querySelectorAll("[data-beginner-index-active-title]"));
  const indexBack = root.querySelector("[data-beginner-index-back]");
  const indexPreviousControls = Array.from(root.querySelectorAll("[data-beginner-index-previous]"));
  const indexNextControls = Array.from(root.querySelectorAll("[data-beginner-index-next-control]"));
  const indexLive = root.querySelector("[data-beginner-index-live]");
  const academyArticles = Array.from(root.querySelectorAll("[data-academy-lesson]"));
  const courseProgressBars = Array.from(root.querySelectorAll("[data-beginner-course-progress], [data-lesson-course-progress]"));
  const courseProgressPercentages = Array.from(root.querySelectorAll("[data-beginner-course-progress-percent]"));
  const courseProgressCounts = Array.from(root.querySelectorAll("[data-beginner-course-progress-count], [data-lesson-course-progress-text]"));
  const academyContextByChapterId = new Map();
  const chamberRouteById = new Map();
  let academyContextsAreValid = true;
  let chamberObserver = null;

  academyArticles.forEach((article) => {
    const chapterId = article.dataset.academyLesson || "";
    const chamberSections = Array.from(article.querySelectorAll("[data-lesson-chamber]"));
    const chamberStages = Array.from(article.querySelectorAll("[data-chamber-stage]"));
    const chamberById = new Map();

    chamberSections.forEach((section, index) => {
      const id = section.id;
      if (!id || chapterIdSet.has(id) || id === "welcome" || id === "chapters" || chamberById.has(id) || chamberRouteById.has(id)) {
        academyContextsAreValid = false;
        return;
      }
      const chamber = {
        id,
        index,
        section,
        stages: chamberStages.filter((stage) => stage.dataset.chamberStage === id),
        numeral: section.querySelector(".tarot-beginners-lesson-chamber__identity > span")?.textContent?.trim() || String(index + 1),
        title: section.querySelector("[data-chamber-title], .tarot-beginners-lesson-chamber__summary h3")?.textContent?.trim() || `Chamber ${index + 1}`
      };
      chamberById.set(id, chamber);
    });

    const context = {
      article,
      chapterId,
      chamberById,
      chamberIds: [...chamberById.keys()],
      liveRegion: article.querySelector("[data-chamber-progress-status]"),
      completionStatus: article.querySelector("[data-lesson-completion-status]")
    };
    const contextIsValid = chapterIdSet.has(chapterId)
      && article.dataset.beginnerChapter === chapterId
      && articleById.get(chapterId) === article
      && !academyContextByChapterId.has(chapterId)
      && context.liveRegion
      && context.completionStatus
      && chamberSections.length === 3
      && chamberStages.length === chamberSections.length
      && context.chamberIds.length === chamberSections.length
      && [...chamberById.values()].every((chamber) => chamber.stages.length === 1);
    if (!contextIsValid) {
      academyContextsAreValid = false;
      return;
    }

    academyContextByChapterId.set(chapterId, context);
    chamberById.forEach((chamber, id) => {
      chamberRouteById.set(id, { chapterId, context, chamber });
    });
  });
  const educationNavigation = root.querySelector(".tarot-education-nav");
  const hero = root.querySelector(".tarot-beginners-hero");
  const faq = root.querySelector(".tarot-beginners-faq");
  const closing = root.querySelector(".tarot-beginners-closing");
  const footer = document.querySelector(".site-footer");
  const transitionControls = Array.from(root.querySelectorAll(
    "[data-beginner-chapter-link], [data-reader-previous], [data-reader-continue], [data-beginner-view-link], [data-beginner-index-link], [data-beginner-index-select], [data-beginner-complete-chapter], [data-chamber-stage], [data-open-chapter-menu], [data-checkpoint-option]"
  ));

  if (
    !panels.welcome
    || !panels.index
    || !panels.reader
    || !welcome
    || !reader
    || !door
    || !indexSection
    || !indexBack
    || !indexViewport
    || !indexTrack
    || indexSlides.length !== chapterData.length
    || !academyContextsAreValid
    || academyContextByChapterId.size !== academyArticles.length
  ) return;

  const state = {
    view: "welcome",
    activeId: chapterIds[0],
    visited: new Set(),
    completed: new Set(),
    preferredView: "guided",
    transitioning: false,
    pendingLocationSync: false,
    locationFrame: 0,
    indexScrollFrame: 0,
    indexLayoutFrame: 0,
    indexReturn: null,
    indexOpener: null,
    chamberStateByChapterId: new Map([...academyContextByChapterId].map(([chapterId, context]) => [chapterId, {
      activeChamberId: context.chamberIds[0] || null,
      completedChambers: new Set()
    }])),
    menuOpener: null
  };

  function sanitizeProgress(value) {
    const source = value && typeof value === "object" ? value : {};
    const visitedChapters = Array.isArray(source.visitedChapters)
      ? [...new Set(source.visitedChapters.filter((id) => chapterIdSet.has(id)))]
      : [];
    const completedChapters = Array.isArray(source.completedChapters)
      ? [...new Set(source.completedChapters.filter((id) => chapterIdSet.has(id)))]
      : [];
    const currentChapter = chapterIdSet.has(source.currentChapter)
      ? source.currentChapter
      : visitedChapters.at(-1) || chapterIds[0];
    return { currentChapter, visitedChapters, completedChapters, viewMode: "guided" };
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
      completedChapters: chapterIds.filter((id) => state.completed.has(id)),
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
    const normalizedView = ["welcome", "index", "chapter"].includes(view) ? view : "welcome";
    const isIndexView = normalizedView === "index";
    const isChapterView = normalizedView === "chapter";
    const isLandingView = normalizedView === "welcome";
    state.view = normalizedView;
    root.dataset.beginnerView = normalizedView;
    setElementAvailability(panels.welcome, normalizedView === "welcome");
    setElementAvailability(panels.index, isIndexView);
    setElementAvailability(panels.reader, normalizedView === "chapter");
    [educationNavigation, hero, faq, closing].forEach((element) => setElementAvailability(element, isLandingView));
    setElementAvailability(footer, !isIndexView);
    root.classList.toggle("is-chapter-index-view", isIndexView);
    root.classList.toggle("is-chapter-lesson-view", isChapterView);
    document.body.classList.toggle("tarot-beginners-index-mode", isIndexView);
    document.body.classList.toggle("tarot-beginners-lesson-mode", isChapterView);
    if (!isChapterView) {
      chamberObserver?.disconnect();
      chamberObserver = null;
    }
    return normalizedView;
  }

  function academyContextForChapter(chapterId = state.activeId) {
    return academyContextByChapterId.get(chapterId) || null;
  }

  function chamberStateForContext(context) {
    return context ? state.chamberStateByChapterId.get(context.chapterId) || null : null;
  }

  function setChapterVisibility(view = state.view) {
    articleById.forEach((article, id) => {
      const isAvailable = view === "chapter" && id === state.activeId;
      article.hidden = !isAvailable;
      article.inert = !isAvailable;
      article.classList.toggle("is-active", id === state.activeId);
    });
    const academyActive = view === "chapter" && academyContextByChapterId.has(state.activeId);
    root.classList.toggle("is-academy-lesson-active", academyActive);
  }

  function recommendedChapterId() {
    return chapterIds.find((id) => !state.completed.has(id) && !state.visited.has(id))
      || chapterIds.find((id) => !state.completed.has(id))
      || chapterIds[0];
  }

  function indexSlideLeft(slide) {
    return slide ? slide.offsetLeft - indexTrack.offsetLeft : 0;
  }

  function scrollToIndexSlide(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
    if (!mobileIndexQuery.matches) return;
    const slide = indexSlides[index];
    if (!slide) return;
    indexViewport.scrollTo({ left: indexSlideLeft(slide), behavior });
  }

  function updateIndexSlideAvailability() {
    const selectedId = state.indexSelectedId;
    indexSlides.forEach((slide) => {
      const active = slide.dataset.beginnerIndexSlide === selectedId;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
      slide.hidden = mobileIndexQuery.matches ? false : !active;
    });
  }

  function updateIndexState({ announceChange = false } = {}) {
    const selected = chapterById.get(state.indexSelectedId) || chapterById.get(recommendedChapterId());
    const completedCount = state.completed.size;
    const progressPercent = Math.round((completedCount / chapterData.length) * 100);
    const recommendedId = completedCount < chapterData.length ? recommendedChapterId() : null;
    state.indexSelectedId = selected.id;

    indexSelectors.forEach((selector) => {
      const id = selector.dataset.beginnerIndexSelect;
      const active = id === selected.id;
      const completed = state.completed.has(id);
      const visited = state.visited.has(id);
      selector.classList.toggle("is-active", active);
      selector.classList.toggle("is-completed", completed);
      selector.classList.toggle("is-visited", visited);
      if (active) selector.setAttribute("aria-current", "true");
      else selector.removeAttribute("aria-current");
      const stateLabel = selector.querySelector("[data-beginner-index-state]");
      const nodeIcon = selector.querySelector("[data-beginner-index-node-icon]");
      const nextLabel = selector.querySelector("[data-beginner-index-next]");
      if (stateLabel) stateLabel.textContent = active ? "Selected chapter" : completed ? "Completed chapter" : visited ? "Visited chapter" : "Upcoming chapter";
      if (nodeIcon) nodeIcon.textContent = completed ? "✓" : active ? "✦" : visited ? "•" : "";
      if (nextLabel) nextLabel.hidden = !recommendedId || id !== recommendedId;
    });

    completeControls.forEach((control) => {
      const completed = state.completed.has(control.dataset.beginnerCompleteChapter);
      control.classList.toggle("is-completed", completed);
      control.setAttribute("aria-pressed", String(completed));
      const label = control.querySelector("[data-beginner-complete-label]");
      const icon = control.querySelector('[aria-hidden="true"]');
      const isLessonControl = Boolean(control.closest("[data-academy-lesson]"));
      if (label) label.textContent = isLessonControl
        ? completed ? "Mark Chapter Incomplete" : "Mark Chapter Complete"
        : completed ? "Mark as Incomplete" : "Mark as Complete";
      if (icon) icon.textContent = completed ? "✓" : "✧";
    });

    indexProgressBars.forEach((progress) => {
      progress.setAttribute("aria-valuenow", String(completedCount));
      progress.setAttribute("aria-valuetext", `${completedCount} of ${chapterData.length} chapters complete`);
      progress.style.setProperty("--beginner-index-progress", `${progressPercent}%`);
    });
    indexProgressPercentages.forEach((label) => {
      label.textContent = `${progressPercent}%`;
    });

    indexCounters.forEach((counter) => {
      counter.textContent = `Chapter ${selected.index + 1} of ${chapterData.length}`;
    });
    indexActiveTitles.forEach((title) => {
      if (title.textContent === selected.navLabel) return;
      title.textContent = selected.navLabel;
      if (announceChange && !reducedMotionQuery.matches && typeof title.animate === "function") {
        title.animate([
          { opacity: .28, transform: "translateY(3px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], { duration: 180, easing: "ease-out" });
      }
    });
    indexPreviousControls.forEach((control) => {
      control.disabled = selected.index === 0;
    });
    indexNextControls.forEach((control) => {
      control.disabled = selected.index === chapterData.length - 1;
    });
    updateIndexSlideAvailability();
    if (announceChange && indexLive) indexLive.textContent = `Chapter ${selected.index + 1} of ${chapterData.length}, ${selected.navLabel}.`;
  }

  function updateCourseProgress() {
    const completedCount = state.completed.size;
    const progressPercent = Math.round((completedCount / chapterData.length) * 100);
    courseProgressBars.forEach((progress) => {
      progress.setAttribute("aria-valuenow", String(completedCount));
      progress.setAttribute("aria-valuetext", `${completedCount} of ${chapterData.length} chapters complete`);
      progress.style.setProperty("--beginner-course-progress", `${progressPercent}%`);
    });
    courseProgressPercentages.forEach((label) => {
      label.textContent = `${progressPercent}%`;
    });
    courseProgressCounts.forEach((label) => {
      label.textContent = `${completedCount} of ${chapterData.length} complete`;
    });
    academyContextByChapterId.forEach((context) => {
      if (!context.completionStatus) return;
      context.completionStatus.textContent = state.completed.has(context.chapterId)
        ? "Chapter complete"
        : "Chapter in progress";
    });
  }

  function updateChamberState(context, { announceChange = false } = {}) {
    const chamberState = chamberStateForContext(context);
    if (!context || !chamberState?.activeChamberId) return;
    const chapterCompleted = state.completed.has(context.chapterId);
    context.article.dataset.activeChamber = chamberState.activeChamberId;

    context.chamberById.forEach((chamber) => {
      const active = chamber.id === chamberState.activeChamberId;
      const completed = chapterCompleted || chamberState.completedChambers.has(chamber.id);
      chamber.section.classList.toggle("is-active", active);
      chamber.section.classList.toggle("is-completed", completed);

      chamber.stages.forEach((stage) => {
        stage.classList.toggle("is-active", active);
        stage.classList.toggle("is-completed", completed);
        stage.closest("li")?.classList.toggle("is-active", active);
        stage.closest("li")?.classList.toggle("is-completed", completed);
        if (active) stage.setAttribute("aria-current", "step");
        else stage.removeAttribute("aria-current");
        const completionMark = stage.querySelector("[data-chamber-stage-mark]");
        if (completionMark) completionMark.hidden = !completed;
      });
    });

    if (context.liveRegion) {
      const active = context.chamberById.get(chamberState.activeChamberId);
      const nextStatus = `Chamber ${active.index + 1} of ${context.chamberIds.length}, ${active.title}, current.`;
      if (announceChange || context.liveRegion.textContent !== nextStatus) context.liveRegion.textContent = nextStatus;
    }
  }

  function setActiveChamber(id, {
    markPreviousComplete = true,
    updateUrl = false,
    scroll = false,
    focus = false,
    announceChange = false
  } = {}) {
    const route = chamberRouteById.get(id);
    const context = route?.context;
    const chamber = route?.chamber;
    const chamberState = chamberStateForContext(context);
    if (!context || !chamber || !chamberState) return;
    const previousId = chamberState.activeChamberId;
    const previousChamber = context.chamberById.get(previousId);
    if (markPreviousComplete && previousChamber && previousChamber.index < chamber.index) {
      context.chamberIds.slice(0, chamber.index).forEach((chamberId) => chamberState.completedChambers.add(chamberId));
    }
    chamberState.activeChamberId = chamber.id;
    updateChamberState(context, { announceChange });
    if (updateUrl && state.view === "chapter" && state.activeId === context.chapterId) {
      writeHistory("chapter", context.chapterId, "replace", { chamberId: chamber.id });
    }
    if (scroll || focus) {
      window.requestAnimationFrame(() => {
        if (scroll) chamber.section.scrollIntoView({
          block: "start",
          behavior: reducedMotionQuery.matches ? "auto" : "smooth"
        });
        if (focus) chamber.stages[0]?.focus({ preventScroll: true });
      });
    }
  }

  function observeActiveChapterChambers() {
    chamberObserver?.disconnect();
    chamberObserver = null;
    if (state.view !== "chapter" || !("IntersectionObserver" in window)) return;
    const context = academyContextForChapter();
    if (!context) return;

    chamberObserver = new IntersectionObserver(() => {
      if (state.view !== "chapter" || state.activeId !== context.chapterId || state.transitioning) return;
      const targetY = window.innerWidth <= 820 ? 156 : 184;
      const visible = [...context.chamberById.values()]
        .map((chamber) => ({ chamber, rect: chamber.section.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > targetY && rect.top < window.innerHeight * .72)
        .sort((a, b) => Math.abs(a.rect.top - targetY) - Math.abs(b.rect.top - targetY));
      const active = visible[0]?.chamber;
      const currentState = chamberStateForContext(context);
      if (!active || currentState?.activeChamberId === active.id) return;
      setActiveChamber(active.id, {
        markPreviousComplete: true,
        updateUrl: true,
        announceChange: false
      });
    }, {
      rootMargin: "-120px 0px -24% 0px",
      threshold: [0, .12, .36, .62]
    });
    context.chamberById.forEach((chamber) => chamberObserver.observe(chamber.section));
  }

  function initializeAcademyLessons() {
    academyContextByChapterId.forEach((context) => {
      const chamberState = chamberStateForContext(context);
      if (!chamberState || !context.chamberIds.length) return;
      if (state.completed.has(context.chapterId)) {
        context.chamberIds.forEach((id) => chamberState.completedChambers.add(id));
      }
      setActiveChamber(context.chamberIds[0], {
        markPreviousComplete: false,
        announceChange: false
      });
      context.article.classList.add("is-chambers-ready");
    });
  }

  function selectIndexChapter(id, {
    historyMode = "replace",
    scrollMobile = true,
    announceChange = true,
    animate = true
  } = {}) {
    const chapter = chapterById.get(id);
    if (!chapter) return;
    const previousId = state.indexSelectedId;
    state.indexSelectedId = chapter.id;
    updateIndexState({ announceChange });
    if (state.view === "index") writeHistory("index", chapter.id, historyMode);

    if (mobileIndexQuery.matches && scrollMobile) {
      const previous = chapterById.get(previousId);
      const behavior = reducedMotionQuery.matches || Math.abs((previous?.index ?? chapter.index) - chapter.index) > 1
        ? "auto"
        : "smooth";
      scrollToIndexSlide(chapter.index, behavior);
    } else if (animate && previousId !== chapter.id && !reducedMotionQuery.matches) {
      indexSlides[chapter.index]?.animate([
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 240, easing: "ease-out" });
    }
  }

  function toggleChapterComplete(id) {
    if (!chapterIdSet.has(id)) return;
    const completed = state.completed.has(id);
    if (completed) state.completed.delete(id);
    else {
      state.completed.add(id);
      state.visited.add(id);
      const context = academyContextForChapter(id);
      const chamberState = chamberStateForContext(context);
      if (context && chamberState) {
        context.chamberIds.forEach((chamberId) => chamberState.completedChambers.add(chamberId));
      }
    }
    saveProgress();
    updateNavigationStates();
    announce(`${chapterById.get(id).navLabel} ${completed ? "marked incomplete" : "marked complete"}.`);
    if (indexLive) indexLive.textContent = `${chapterById.get(id).navLabel} ${completed ? "marked incomplete" : "marked complete"}.`;
  }

  function setControlLink(control, chapter, { isPrevious = false } = {}) {
    if (!control) return;
    const isAvailable = Boolean(chapter);
    control.hidden = false;
    control.setAttribute("aria-disabled", String(!isAvailable));
    control.tabIndex = isAvailable ? 0 : -1;
    const title = control.querySelector("[data-chapter-nav-title]");

    if (!chapter) {
      control.href = "#chapters";
      delete control.dataset.beginnerChapterLink;
      if (title) title.textContent = isPrevious ? "First Door" : "Journey Complete";
      return;
    }

    control.href = chapter.hash;
    control.dataset.beginnerChapterLink = chapter.id;
    if (title) title.textContent = chapter.navLabel;
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
        label.textContent = "Continue with Chapter 01";
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
      const isCompleted = state.completed.has(id);
      const label = link.querySelector("[data-chapter-state]");
      const star = link.querySelector(".tarot-beginners-chapter-link__star");
      link.classList.toggle("is-current", isCurrent);
      link.classList.toggle("is-visited", isVisited);
      link.classList.toggle("is-completed", isCompleted);
      if (isCurrent) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
      if (label) label.textContent = isCompleted
        ? isCurrent ? "Complete · Current" : "Complete"
        : isCurrent ? "Current" : isVisited ? "In Progress" : "";
      if (star) star.textContent = isCompleted ? "✓" : "✦";
    });

    previousControls.forEach((control) => setControlLink(control, previous, { isPrevious: true }));
    continueControls.forEach((control) => setControlLink(control, next));

    if (chapterNavigatorCount) chapterNavigatorCount.textContent = `Door ${activeChapter.number} of ${chapterData.length}`;
    if (chapterNavigatorTitle) chapterNavigatorTitle.textContent = activeChapter.navLabel;
    updateWelcomeResume();
    updateIndexState();
    updateCourseProgress();
    academyContextByChapterId.forEach((context) => updateChamberState(context));
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

  function commitChapter(id, {
    view = "chapter",
    markVisited = true,
    announceChange = true,
    chamberId = null
  } = {}) {
    const chapter = chapterById.get(id) || chapterById.get(chapterIds[0]);
    state.activeId = chapter.id;
    setPrimaryView(view);
    if (markVisited) markChapterVisited(chapter.id);
    state.preferredView = "guided";
    setChapterVisibility(view);
    const academyContext = academyContextForChapter(chapter.id);
    if (view === "chapter" && academyContext) {
      setActiveChamber(academyContext.chamberById.has(chamberId) ? chamberId : academyContext.chamberIds[0], {
        markPreviousComplete: false,
        announceChange: false
      });
    }
    updateNavigationStates();
    saveProgress();
    window.requestAnimationFrame(observeActiveChapterChambers);
    if (announceChange) {
      announce(`Chapter ${chapter.number} of 10, ${chapter.title}.`);
    }
    return chapter;
  }

  function historyPayload(view, chapterId = state.activeId, extra = {}) {
    return {
      ...(window.history.state || {}),
      tarotBeginner: {
        ...(window.history.state?.tarotBeginner || {}),
        view,
        chapterId,
        ...extra
      }
    };
  }

  function writeHistory(view, chapterId, mode = "push", extra = {}) {
    if (mode === "none") return;
    const chapter = chapterById.get(chapterId);
    const resolvedChapterId = chapter?.id || (view === "index" ? state.indexSelectedId : state.activeId);
    const isIndexView = view === "index";
    const academyContext = academyContextForChapter(resolvedChapterId);
    const requestedChamberId = view === "chapter"
      && academyContext?.chamberById.has(extra.chamberId)
      ? extra.chamberId
      : null;
    const historyExtra = { ...extra, chamberId: requestedChamberId };
    const currentEntry = window.history.state?.tarotBeginner;
    const isSameVisibleEntry = currentEntry?.view === view
      && (view === "welcome" || currentEntry?.chapterId === resolvedChapterId);
    const url = new URL(window.location.href);

    if (isIndexView) {
      url.searchParams.set("view", "chapters");
      url.searchParams.set("chapter", String((chapter?.index ?? 0) + 1));
      url.hash = "";
    } else {
      url.searchParams.delete("view");
      url.searchParams.delete("chapter");
      const hash = view === "welcome"
        ? "#welcome"
        : requestedChamberId ? `#${requestedChamberId}` : chapter?.hash || "#welcome";
      const keepWelcomeRouteUnfragmented = mode === "replace"
        && view === "welcome"
        && !window.location.hash;
      url.hash = keepWelcomeRouteUnfragmented ? "" : hash;
    }

    if (mode === "push" && isSameVisibleEntry && window.location.href === url.href) return;
    const method = mode === "replace" ? "replaceState" : "pushState";
    window.history[method](historyPayload(view, resolvedChapterId, historyExtra), "", `${url.pathname}${url.search}${url.hash}`);
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
    const academyContext = academyContextForChapter(chapter.id);
    if (academyContext) {
      setActiveChamber(academyContext.chamberIds[0], {
        markPreviousComplete: false,
        announceChange: false
      });
    }
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

    if (state.view === "index") {
      writeHistory("chapter", target.id, historyMode, {
        enteredFromPage: false,
        restoreFromIndex: false,
        scrollY: null
      });
      commitChapter(target.id);
      if (scroll) scrollToPanel(reader, "auto");
      if (focus) focusChapterHeading(target.id);
      return;
    }

    if (state.view === "chapter" && state.activeId === target.id) {
      const academyContext = academyContextForChapter(target.id);
      if (academyContext) {
        setActiveChamber(academyContext.chamberIds[0], {
          markPreviousComplete: false,
          announceChange: false
        });
      }
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
    const normalizedView = "welcome";
    setPrimaryView(normalizedView);
    setChapterVisibility(normalizedView);
    updateNavigationStates();
    writeHistory(normalizedView, state.activeId, historyMode);
    if (scroll) scrollToPanel(panels[normalizedView]);
    if (focus) {
      const heading = welcome.querySelector('[data-beginner-welcome-copy]:not([aria-hidden="true"]) h2');
      heading?.focus({ preventScroll: true });
    }
    announce("Welcome to the beginning.");
  }

  function captureIndexReturnState(opener = null) {
    const returnView = state.view === "chapter" ? "chapter" : "welcome";
    const academyContext = returnView === "chapter" ? academyContextForChapter(state.activeId) : null;
    const returnChamberId = chamberStateForContext(academyContext)?.activeChamberId || null;
    state.indexOpener = opener instanceof HTMLElement
      ? opener
      : document.activeElement instanceof HTMLElement
        ? document.activeElement.closest("[data-beginner-index-link]")
        : null;
    state.indexReturn = {
      view: returnView,
      chapterId: state.activeId,
      chamberId: returnChamberId,
      scrollY: window.scrollY
    };
    const currentState = {
      ...(window.history.state || {}),
      tarotBeginner: {
        view: returnView,
        chapterId: state.activeId,
        chamberId: returnChamberId,
        scrollY: window.scrollY,
        restoreFromIndex: true
      }
    };
    window.history.replaceState(currentState, "", window.location.href);
  }

  function enterChapterIndex({
    historyMode = "push",
    chapterId = null,
    captureReturn = true,
    scroll = true,
    opener = null
  } = {}) {
    if (state.transitioning) return;
    if (captureReturn && state.view !== "index") captureIndexReturnState(opener);
    const selectedId = chapterIdSet.has(chapterId) ? chapterId : recommendedChapterId();
    state.indexSelectedId = selectedId;
    setPrimaryView("index");
    setChapterVisibility("index");
    updateNavigationStates();
    writeHistory("index", selectedId, historyMode, {
      enteredFromPage: Boolean(captureReturn && state.indexReturn),
      restoreFromIndex: false,
      scrollY: null,
      returnView: state.indexReturn?.view || "welcome",
      returnChapterId: state.indexReturn?.chapterId || state.activeId,
      returnChamberId: state.indexReturn?.chamberId || null,
      returnScrollY: state.indexReturn?.scrollY ?? 0
    });
    if (scroll) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        scrollToIndexSlide(chapterById.get(selectedId).index, "auto");
        if (captureReturn) indexBack?.focus({ preventScroll: true });
      });
    }
    announce(`Chapter index opened at Chapter ${chapterById.get(selectedId).number}, ${chapterById.get(selectedId).navLabel}.`);
  }

  function exitChapterIndex() {
    const entry = window.history.state?.tarotBeginner;
    if (entry?.view === "index" && entry.enteredFromPage) {
      window.history.back();
      return;
    }
    state.indexReturn = null;
    state.indexOpener = null;
    showView("welcome", { historyMode: "replace", scroll: false, focus: true });
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  }

  function isFaqHashTarget(hash) {
    if (hash === "beginner-faq") return true;
    const target = hash ? document.getElementById(hash) : null;
    return Boolean(target?.closest("#beginner-faq[data-education-faq]"));
  }

  function openFaqHashTarget(hash) {
    const target = hash ? document.getElementById(hash) : null;
    const item = target?.closest("#beginner-faq [data-education-faq-item]");
    const button = item?.querySelector("[data-education-faq-button]");
    if (button?.getAttribute("aria-expanded") !== "true") button.click();
  }

  function chapterIdFromQuery(value) {
    if (chapterIdSet.has(value)) return value;
    const numeric = Number.parseInt(value || "", 10);
    return Number.isInteger(numeric) && numeric >= 1 && numeric <= chapterData.length
      ? chapterIds[numeric - 1]
      : null;
  }

  function routeFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace(/^#/, "");
    const storedHistory = window.history.state?.tarotBeginner;
    const restoreFromIndex = storedHistory?.restoreFromIndex === true;
    if (params.get("view") === "chapters") {
      return {
        view: "index",
        chapterId: chapterIdFromQuery(params.get("chapter")) || recommendedChapterId(),
        scrollY: storedHistory?.scrollY,
        restoreFromIndex
      };
    }
    if (hash === "welcome" || hash === "") return { view: "welcome", chapterId: state.activeId, scrollY: storedHistory?.scrollY, restoreFromIndex };
    if (hash === "chapters") return { view: "index", chapterId: recommendedChapterId(), legacy: true };
    const chamberRoute = chamberRouteById.get(hash);
    if (chamberRoute) {
      return {
        view: "chapter",
        chapterId: chamberRoute.chapterId,
        chamberId: hash,
        scrollY: storedHistory?.scrollY,
        restoreFromIndex
      };
    }
    if (chapterIdSet.has(hash)) {
      return { view: "chapter", chapterId: hash, scrollY: storedHistory?.scrollY, restoreFromIndex };
    }
    if (isFaqHashTarget(hash)) return { view: "welcome", chapterId: state.activeId, faqHash: hash, scrollY: storedHistory?.scrollY, restoreFromIndex };
    return { view: "welcome", chapterId: state.activeId, invalid: true };
  }

  function restoreSavedScroll(scrollY, focusTarget = null) {
    if (!Number.isFinite(scrollY) && !focusTarget) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (Number.isFinite(scrollY)) window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
        focusTarget?.focus({ preventScroll: true });
      });
    });
  }

  function restoreIndexOrigin(scrollY) {
    const savedOpener = state.indexOpener?.isConnected && !state.indexOpener.closest("[hidden], [inert]")
      ? state.indexOpener
      : null;
    const fallbackOpener = state.view === "chapter"
      ? reader.querySelector("[data-open-chapter-menu]")
      : welcome.querySelector('[data-beginner-welcome-copy]:not([aria-hidden="true"]) [data-beginner-index-link]');
    state.indexOpener = null;
    restoreSavedScroll(scrollY, savedOpener || fallbackOpener);
  }

  function syncFromLocation({ initial = false } = {}) {
    const route = routeFromLocation();
    const leavingIndex = state.view === "index" && route.view !== "index";
    if (route.faqHash) {
      showView("welcome", { historyMode: "none", scroll: false });
      openFaqHashTarget(route.faqHash);
      if (leavingIndex && route.restoreFromIndex) restoreIndexOrigin(route.scrollY);
      return;
    }
    const historyMode = initial || route.invalid || route.legacy || (!window.location.hash && route.view !== "index") ? "replace" : "none";
    if (route.view === "index") {
      const enteringIndex = state.view !== "index";
      enterChapterIndex({
        historyMode: initial || route.legacy ? "replace" : "none",
        chapterId: route.chapterId,
        captureReturn: false,
        scroll: initial || enteringIndex
      });
      if (!initial && enteringIndex) {
        window.requestAnimationFrame(() => indexBack.focus({ preventScroll: true }));
      }
      return;
    }
    if (route.view === "welcome") {
      showView("welcome", { historyMode, scroll: false });
      if (leavingIndex && route.restoreFromIndex) restoreIndexOrigin(route.scrollY);
      else if (leavingIndex) window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
      return;
    }
    commitChapter(route.chapterId, {
      view: "chapter",
      markVisited: true,
      announceChange: !initial,
      chamberId: route.chamberId || null
    });
    writeHistory("chapter", route.chapterId, historyMode, { chamberId: route.chamberId || null });
    if (leavingIndex && route.restoreFromIndex) restoreIndexOrigin(route.scrollY);
    else if (leavingIndex) {
      window.requestAnimationFrame(() => {
        const chamber = chamberRouteById.get(route.chamberId)?.chamber;
        if (chamber) {
          chamber.section.scrollIntoView({ block: "start", behavior: "auto" });
          chamber.stages[0]?.focus({ preventScroll: true });
        } else {
          scrollToPanel(reader, "auto");
          focusChapterHeading(route.chapterId);
        }
      });
    } else if (route.chamberId) {
      window.requestAnimationFrame(() => {
        const chamber = chamberRouteById.get(route.chamberId)?.chamber;
        chamber?.section.scrollIntoView({ block: "start", behavior: "auto" });
        chamber?.stages[0]?.focus({ preventScroll: true });
      });
    } else if (!initial) {
      window.requestAnimationFrame(() => focusChapterHeading(route.chapterId));
    }
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
    const guideQuote = welcome.querySelector("[data-welcome-guide-quote]");
    const guideQuoteText = guideQuote?.querySelector("[data-welcome-guide-quote-text]");
    if (guideQuoteText) {
      guideQuoteText.textContent = isBloodMoon
        ? guideQuote.dataset.bloodQuote
        : guideQuote.dataset.regularQuote;
    }
    if (welcome.dataset.welcomeTheme === nextTheme) return;

    const outgoing = welcome.querySelector('[data-beginner-welcome-copy]:not([aria-hidden="true"])');
    const incoming = welcome.querySelector(`[data-beginner-welcome-copy="${nextTheme}"]`);
    const focusedAction = outgoing?.contains(document.activeElement)
      ? document.activeElement.closest("[data-welcome-primary], [data-beginner-index-link]")
      : null;
    const focusSelector = focusedAction?.hasAttribute("data-welcome-primary")
      ? "[data-welcome-primary]"
      : focusedAction?.hasAttribute("data-beginner-index-link")
        ? "[data-beginner-index-link]"
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

    transitionToChapter(id);
  }

  function moveToChapter(id) {
    if (!chapterIdSet.has(id)) return;
    transitionToChapter(id);
  }

  function syncIndexFromScroll() {
    if (state.view !== "index" || !mobileIndexQuery.matches) return;
    window.cancelAnimationFrame(state.indexScrollFrame);
    state.indexScrollFrame = window.requestAnimationFrame(() => {
      state.indexScrollFrame = 0;
      const viewportLeft = indexViewport.getBoundingClientRect().left;
      const closest = indexSlides.reduce((best, slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - viewportLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      const chapter = chapterData[closest.index];
      if (chapter && chapter.id !== state.indexSelectedId) {
        selectIndexChapter(chapter.id, {
          historyMode: "replace",
          scrollMobile: false,
          announceChange: true,
          animate: false
        });
      }
    });
  }

  function syncIndexLayout() {
    window.cancelAnimationFrame(state.indexLayoutFrame);
    state.indexLayoutFrame = window.requestAnimationFrame(() => {
      state.indexLayoutFrame = 0;
      updateIndexState();
      if (state.view !== "index") return;
      if (mobileIndexQuery.matches) scrollToIndexSlide(chapterById.get(state.indexSelectedId).index, "auto");
      else indexViewport.scrollTo({ left: 0, behavior: "auto" });
    });
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
      showView("welcome", { focus: true });
      return;
    }

    if (target.closest("[data-beginner-index-link]")) {
      event.preventDefault();
      enterChapterIndex({ opener: target.closest("[data-beginner-index-link]") });
      return;
    }

    if (target.closest("[data-beginner-index-back]")) {
      event.preventDefault();
      exitChapterIndex();
      return;
    }

    const indexSelector = target.closest("[data-beginner-index-select]");
    if (indexSelector) {
      event.preventDefault();
      selectIndexChapter(indexSelector.dataset.beginnerIndexSelect);
      return;
    }

    const chamberControl = target.closest("[data-chamber-stage]");
    if (chamberControl) {
      event.preventDefault();
      const chamberId = chamberControl.dataset.chamberStage;
      setActiveChamber(chamberId, {
        markPreviousComplete: true,
        updateUrl: true,
        scroll: true,
        announceChange: true
      });
      return;
    }

    const checkpointOption = target.closest("[data-checkpoint-option]");
    if (checkpointOption) {
      event.preventDefault();
      const checkpoint = checkpointOption.closest("[data-knowledge-checkpoint]");
      checkpoint?.querySelectorAll("[data-checkpoint-option]").forEach((option) => {
        const selected = option === checkpointOption;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      const feedback = checkpoint?.querySelector("[data-checkpoint-feedback-region]");
      if (feedback) feedback.textContent = checkpointOption.dataset.checkpointFeedback || "Notice what drew you to that answer.";
      return;
    }

    const completeControl = target.closest("[data-beginner-complete-chapter]");
    if (completeControl) {
      event.preventDefault();
      toggleChapterComplete(completeControl.dataset.beginnerCompleteChapter);
      return;
    }

    if (target.closest("[data-beginner-index-previous]")) {
      event.preventDefault();
      const selected = chapterById.get(state.indexSelectedId);
      if (selected?.index > 0) selectIndexChapter(chapterIds[selected.index - 1]);
      return;
    }

    if (target.closest("[data-beginner-index-next-control]")) {
      event.preventDefault();
      const selected = chapterById.get(state.indexSelectedId);
      if (selected?.index < chapterData.length - 1) selectIndexChapter(chapterIds[selected.index + 1]);
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
      else enterChapterIndex();
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
    root.classList.remove("is-chapter-index-view");
    root.classList.remove("is-chapter-lesson-view");
    root.classList.remove("is-academy-lesson-active");
    document.body.classList.remove("tarot-beginners-index-mode");
    document.body.classList.remove("tarot-beginners-lesson-mode");
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
    [educationNavigation, hero, faq, closing, footer].forEach((element) => setElementAvailability(element, true));
    academyContextByChapterId.forEach((context) => {
      context.article.classList.remove("is-chambers-ready");
      context.chamberById.forEach((chamber) => {
        chamber.section.classList.remove("is-active", "is-completed");
      });
    });
    chamberObserver?.disconnect();
    chamberObserver = null;
    door.classList.remove("is-active");
  }

  try {
    const progress = readProgress();
    state.activeId = progress.currentChapter;
    state.visited = new Set(progress.visitedChapters);
    state.completed = new Set(progress.completedChapters);
    state.indexSelectedId = recommendedChapterId();
    state.preferredView = progress.viewMode;
    initializeAcademyLessons();

    document.documentElement.classList.add("js-enabled");
    experience.classList.add("is-enhanced");
    root.addEventListener("click", handleRootClick);
    indexViewport.addEventListener("scroll", syncIndexFromScroll, { passive: true });
    mobileIndexQuery.addEventListener?.("change", syncIndexLayout);
    window.addEventListener("resize", syncIndexLayout, { passive: true });
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
