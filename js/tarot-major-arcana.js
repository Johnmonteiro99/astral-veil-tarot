(function () {
  if (document.documentElement.dataset.majorArcanaInitialized === "true") return;
  document.documentElement.dataset.majorArcanaInitialized = "true";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const themeImages = Array.from(document.querySelectorAll("[data-major-theme-image]"));

  function isBloodMoonActive(event) {
    return typeof event?.detail?.isActive === "boolean"
      ? event.detail.isActive
      : document.body.classList.contains("blood-moon-mode");
  }

  function updateThemeImages(event) {
    const useBloodMoon = isBloodMoonActive(event);
    themeImages.forEach((image) => {
      const source = useBloodMoon ? image.dataset.bloodSrc : image.dataset.standardSrc;
      const alt = useBloodMoon ? image.dataset.bloodAlt : image.dataset.standardAlt;
      const update = window.AstralVeilImages?.updateIfChanged;
      const swap = typeof update === "function"
        ? update(image, source)
        : Promise.resolve().then(() => {
          if (image.getAttribute("src") !== source) image.setAttribute("src", source);
          return { ok: true };
        });
      swap.then((result) => {
        if (!result?.ok || isBloodMoonActive() !== useBloodMoon) return;
        image.alt = alt || "";
      });
    });
  }

  const carouselRoot = document.querySelector("[data-major-carousel]");

  if (carouselRoot) {
    const viewport = carouselRoot.querySelector("[data-major-carousel-viewport]");
    const slides = Array.from(carouselRoot.querySelectorAll("[data-major-card-slide]"));
    const numberButtons = Array.from(carouselRoot.querySelectorAll("[data-major-number]"));
    const numberNav = carouselRoot.querySelector("[data-major-number-nav]");
    const previousButton = carouselRoot.querySelector("[data-major-previous]");
    const nextButton = carouselRoot.querySelector("[data-major-next]");
    const status = carouselRoot.querySelector("[data-major-carousel-status]");
    let activeIndex = 0;
    let scrollTimer = 0;
    let resizeFrame = 0;
    let programmaticScrollTimer = 0;
    let programmaticScroll = false;

    function slideCenterLeft(slide) {
      return viewport.scrollLeft
        + slide.getBoundingClientRect().left
        - viewport.getBoundingClientRect().left
        - ((viewport.clientWidth - slide.getBoundingClientRect().width) / 2);
    }

    function scrollToSlide(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
      const slide = slides[index];
      if (!viewport || !slide) return;
      programmaticScroll = true;
      window.clearTimeout(programmaticScrollTimer);
      viewport.scrollTo({ left: slideCenterLeft(slide), behavior });
      programmaticScrollTimer = window.setTimeout(() => {
        programmaticScroll = false;
      }, behavior === "smooth" ? 650 : 0);
    }

    function setCarouselState(index, { scroll = true, announce = true } = {}) {
      const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
      activeIndex = nextIndex;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === nextIndex;
        slide.classList.toggle("is-active", active);
        if (active) slide.setAttribute("aria-current", "true");
        else slide.removeAttribute("aria-current");
        const selectButton = slide.querySelector("[data-major-card-select]");
        selectButton?.setAttribute("tabindex", active ? "0" : "-1");
        selectButton?.setAttribute("aria-pressed", String(active));
        slide.querySelector("[data-major-card-link]")?.setAttribute("tabindex", active ? "0" : "-1");
      });

      numberButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === nextIndex;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      previousButton.disabled = nextIndex === 0;
      nextButton.disabled = nextIndex === slides.length - 1;
      if (announce && status) {
        const title = slides[nextIndex]?.querySelector("h3")?.textContent?.trim() || "";
        status.textContent = `Card ${nextIndex}, ${nextIndex + 1} of ${slides.length} selected: ${title}`;
      }
      const numberButton = numberButtons[nextIndex];
      if (numberNav && numberButton) {
        const navBounds = numberNav.getBoundingClientRect();
        const buttonBounds = numberButton.getBoundingClientRect();
        const left = numberNav.scrollLeft
          + buttonBounds.left
          - navBounds.left
          - ((numberNav.clientWidth - buttonBounds.width) / 2);
        numberNav.scrollTo({ left, behavior: reducedMotionQuery.matches ? "auto" : "smooth" });
      }
      if (scroll) scrollToSlide(nextIndex);
    }

    function selectNearestVisibleSlide() {
      if (!viewport || programmaticScroll) return;
      const bounds = viewport.getBoundingClientRect();
      const center = bounds.left + (bounds.width / 2);
      const nearest = slides.reduce((best, slide, index) => {
        const slideBounds = slide.getBoundingClientRect();
        const distance = Math.abs(slideBounds.left + (slideBounds.width / 2) - center);
        return distance < best.distance ? { index, distance } : best;
      }, { index: activeIndex, distance: Infinity });
      if (nearest.index !== activeIndex) setCarouselState(nearest.index, { scroll: false });
    }

    slides.forEach((slide, index) => {
      slide.querySelector("[data-major-card-select]")?.addEventListener("click", () => {
        if (index !== activeIndex) setCarouselState(index);
      });
    });

    numberButtons.forEach((button, index) => {
      button.addEventListener("click", () => setCarouselState(index));
    });

    previousButton?.addEventListener("click", () => setCarouselState(activeIndex - 1));
    nextButton?.addEventListener("click", () => setCarouselState(activeIndex + 1));
    viewport?.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowLeft") nextIndex = activeIndex - 1;
      if (event.key === "ArrowRight") nextIndex = activeIndex + 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = slides.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      setCarouselState(nextIndex);
    });
    viewport?.addEventListener("scroll", () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(selectNearestVisibleSlide, 120);
    }, { passive: true });
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => scrollToSlide(activeIndex, "auto"));
    }, { passive: true });

    carouselRoot.classList.add("is-enhanced");
    setCarouselState(0, { scroll: false, announce: false });
    window.requestAnimationFrame(() => scrollToSlide(0, "auto"));
  }

  const journeyRoot = document.querySelector("[data-major-journey]");

  if (journeyRoot) {
    const tabs = Array.from(journeyRoot.querySelectorAll("[data-major-journey-tab]"));
    const panels = Array.from(journeyRoot.querySelectorAll("[data-major-journey-panel]"));
    const chapterDialog = journeyRoot.querySelector("[data-major-chapter-dialog]");
    const codexPanels = Array.from(journeyRoot.querySelectorAll("[data-major-chapter-codex-panel]"));
    const chapterOpeners = Array.from(journeyRoot.querySelectorAll("[data-major-chapter-open]"));
    const chapterClosers = Array.from(journeyRoot.querySelectorAll("[data-major-chapter-close]"));
    const chapterNavigation = Array.from(journeyRoot.querySelectorAll("[data-major-chapter-nav]"));
    const codexFrame = chapterDialog?.querySelector(".major-chapter-codex__frame");
    let activeJourneyIndex = 0;
    let activeCodexIndex = 0;
    let chapterTransitioning = false;
    let chapterTransitionTimer = 0;
    let lastChapterOpener = null;
    let bodyPaddingRight = "";

    function setJourneyChapter(index, { focus = false } = {}) {
      const nextIndex = Math.max(0, Math.min(index, tabs.length - 1));
      activeJourneyIndex = nextIndex;
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeJourneyIndex;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.setAttribute("tabindex", active ? "0" : "-1");
        if (active) tab.setAttribute("aria-current", "step");
        else tab.removeAttribute("aria-current");
      });
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeJourneyIndex;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });
      if (focus) {
        const activeTab = tabs[activeJourneyIndex];
        activeTab?.focus();
        if (mobileQuery.matches) {
          activeTab?.scrollIntoView({
            behavior: reducedMotionQuery.matches ? "auto" : "smooth",
            block: "nearest",
            inline: "center"
          });
        }
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setJourneyChapter(index));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        setJourneyChapter(nextIndex, { focus: true });
      });
    });

    function setPageLocked(locked) {
      if (locked) {
        const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        bodyPaddingRight = document.body.style.paddingRight;
        if (scrollbarWidth) {
          const currentPadding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
          document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
        }
        document.body.classList.add("major-chapter-modal-open");
        return;
      }
      document.body.classList.remove("major-chapter-modal-open");
      document.body.style.paddingRight = bodyPaddingRight;
    }

    function setCodexChapter(index, { immediate = false, focusPanel = false } = {}) {
      if (!chapterDialog || !codexPanels.length || chapterTransitioning) return;
      const nextIndex = Math.max(0, Math.min(index, codexPanels.length - 1));
      const direction = nextIndex < activeCodexIndex ? "previous" : "next";
      activeCodexIndex = nextIndex;
      chapterDialog.dataset.direction = direction;
      chapterDialog.setAttribute("aria-labelledby", `major-chapter-codex-title-${activeCodexIndex}`);
      chapterDialog.setAttribute("aria-describedby", `major-chapter-codex-range-${activeCodexIndex}`);
      codexPanels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeCodexIndex;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });
      codexFrame?.scrollTo({ top: 0, behavior: "auto" });
      if (focusPanel) window.requestAnimationFrame(() => codexPanels[activeCodexIndex]?.focus());
      if (immediate || reducedMotionQuery.matches) return;
      chapterTransitioning = true;
      window.clearTimeout(chapterTransitionTimer);
      chapterTransitionTimer = window.setTimeout(() => {
        chapterTransitioning = false;
      }, 320);
    }

    function openChapterCodex(opener) {
      if (!chapterDialog) return;
      const chapterIndex = Number.parseInt(opener.dataset.majorChapterOpen, 10);
      if (!Number.isInteger(chapterIndex)) return;
      lastChapterOpener = opener;
      setJourneyChapter(chapterIndex);
      setCodexChapter(chapterIndex, { immediate: true });
      setPageLocked(true);
      if (!chapterDialog.open) chapterDialog.showModal();
      window.requestAnimationFrame(() => {
        codexPanels[chapterIndex]?.querySelector("[data-major-chapter-close]")?.focus();
      });
    }

    function closeChapterCodex() {
      if (chapterDialog?.open) chapterDialog.close();
    }

    chapterOpeners.forEach((opener) => {
      opener.addEventListener("click", () => openChapterCodex(opener));
    });
    chapterClosers.forEach((closer) => {
      closer.addEventListener("click", closeChapterCodex);
    });
    chapterNavigation.forEach((control) => {
      control.addEventListener("click", () => {
        if (chapterTransitioning) return;
        const chapterIndex = Number.parseInt(control.dataset.majorChapterNav, 10);
        if (!Number.isInteger(chapterIndex) || chapterIndex < 0 || chapterIndex >= codexPanels.length) return;
        setJourneyChapter(chapterIndex);
        setCodexChapter(chapterIndex, { focusPanel: true });
      });
    });

    chapterDialog?.addEventListener("click", (event) => {
      if (event.target === chapterDialog) closeChapterCodex();
    });
    chapterDialog?.addEventListener("close", () => {
      window.clearTimeout(chapterTransitionTimer);
      chapterTransitioning = false;
      setPageLocked(false);
      lastChapterOpener?.focus();
      lastChapterOpener = null;
    });

    journeyRoot.classList.add("is-enhanced");
    chapterDialog?.classList.add("is-enhanced");
    setJourneyChapter(0);
    setCodexChapter(0, { immediate: true });
  }

  const orientationRoot = document.querySelector("[data-major-orientation]");

  if (orientationRoot) {
    const options = Array.from(orientationRoot.querySelectorAll("[data-major-orientation-option]"));
    const panels = Array.from(orientationRoot.querySelectorAll("[data-major-orientation-panel]"));
    const caption = orientationRoot.querySelector("[data-major-orientation-caption]");
    let orientation = "upright";
    let orientationTransitioning = false;
    let orientationTransitionTimer = 0;
    let pendingOrientation = "";

    function updateOrientationAccessibility() {
      panels.forEach((panel) => {
        const active = panel.dataset.majorOrientationPanel === orientation;
        panel.setAttribute("aria-hidden", String(mobileQuery.matches && !active));
        panel.inert = mobileQuery.matches && !active;
      });
    }

    function setOrientation(nextOrientation) {
      if (nextOrientation !== "upright" && nextOrientation !== "reversed") return;
      if (orientationTransitioning) {
        pendingOrientation = nextOrientation;
        return;
      }
      const orientationChanged = orientation !== nextOrientation;
      orientation = nextOrientation;
      orientationRoot.dataset.orientation = nextOrientation;
      if (caption) caption.textContent = nextOrientation;
      options.forEach((option) => {
        const active = option.dataset.majorOrientationOption === nextOrientation;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-pressed", String(active));
      });
      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.majorOrientationPanel === nextOrientation);
      });
      updateOrientationAccessibility();
      if (!orientationChanged || reducedMotionQuery.matches) return;
      orientationTransitioning = true;
      orientationRoot.setAttribute("aria-busy", "true");
      window.clearTimeout(orientationTransitionTimer);
      orientationTransitionTimer = window.setTimeout(() => {
        orientationTransitioning = false;
        orientationRoot.removeAttribute("aria-busy");
        const queuedOrientation = pendingOrientation;
        pendingOrientation = "";
        if (queuedOrientation && queuedOrientation !== orientation) setOrientation(queuedOrientation);
      }, 720);
    }

    options.forEach((option, index) => {
      option.addEventListener("click", () => setOrientation(option.dataset.majorOrientationOption));
      option.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const target = options[(index + direction + options.length) % options.length];
        target.focus();
        setOrientation(target.dataset.majorOrientationOption);
      });
    });
    const onMobileChange = () => updateOrientationAccessibility();
    if (typeof mobileQuery.addEventListener === "function") mobileQuery.addEventListener("change", onMobileChange);
    else mobileQuery.addListener(onMobileChange);
    orientationRoot.classList.add("is-enhanced");
    setOrientation("upright");
  }

  const majorMinorRoot = document.querySelector("[data-major-minor-showcase-root]");

  if (majorMinorRoot) {
    const tabs = Array.from(majorMinorRoot.querySelectorAll("[data-major-minor-tab]"));
    const panels = Array.from(majorMinorRoot.querySelectorAll("[data-major-minor-panel]"));
    const showcaseRecords = Array.from(majorMinorRoot.querySelectorAll("[data-major-minor-showcase]")).map((showcase) => ({
      root: showcase,
      panel: showcase.closest("[data-major-minor-panel]"),
      track: showcase.querySelector("[data-major-minor-track]"),
      cards: Array.from(showcase.querySelectorAll("[data-major-minor-card]")),
      dots: Array.from(showcase.querySelectorAll("[data-major-minor-dot]")),
      previous: showcase.querySelector("[data-major-minor-previous]"),
      next: showcase.querySelector("[data-major-minor-next]"),
      status: showcase.querySelector("[data-major-minor-card-status]"),
      index: 0,
      timer: 0,
      scrollTimer: 0,
      pointerPaused: false,
      focusPaused: false
    }));
    let majorMinorMode = majorMinorRoot.dataset.mode === "minor" ? "minor" : "major";
    let majorMinorTransitioning = false;
    let majorMinorTransitionTimer = 0;
    let queuedMajorMinorMode = "";

    function normalizedCardPosition(cardIndex, activeIndex, length) {
      const offset = (cardIndex - activeIndex + length) % length;
      if (offset === 0) return "0";
      if (offset === 1) return "1";
      if (offset === length - 1) return "-1";
      return "2";
    }

    function scrollShowcaseCard(record, card) {
      if (!mobileQuery.matches || !record.track || !card) return;
      const targetLeft = card.offsetLeft - ((record.track.clientWidth - card.offsetWidth) / 2);
      record.track.scrollTo({
        left: targetLeft,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth"
      });
    }

    function setShowcaseCard(record, nextIndex, { announce = false, scroll = false } = {}) {
      const length = record.cards.length;
      if (!length) return;
      const normalizedIndex = (nextIndex + length) % length;
      const changed = record.index !== normalizedIndex;
      record.index = normalizedIndex;
      record.cards.forEach((card, index) => {
        const active = index === normalizedIndex;
        card.classList.toggle("is-active", active);
        card.dataset.position = normalizedCardPosition(index, normalizedIndex, length);
      });
      record.dots.forEach((dot, index) => {
        dot.setAttribute("aria-current", String(index === normalizedIndex));
      });
      const activeCard = record.cards[normalizedIndex];
      if (announce && changed && record.status) {
        const cardName = activeCard?.querySelector("figcaption")?.textContent?.trim() || "Tarot card";
        record.status.textContent = `${cardName} selected, ${normalizedIndex + 1} of ${length}`;
      }
      if (scroll) scrollShowcaseCard(record, activeCard);
    }

    function clearShowcaseTimers() {
      showcaseRecords.forEach((record) => {
        window.clearTimeout(record.timer);
        record.timer = 0;
      });
    }

    function canAutoplay(record) {
      return record.panel?.dataset.majorMinorPanel === majorMinorMode &&
        !mobileQuery.matches &&
        !reducedMotionQuery.matches &&
        !document.hidden &&
        !record.pointerPaused &&
        !record.focusPaused;
    }

    function scheduleActiveShowcase() {
      clearShowcaseTimers();
      const activeRecord = showcaseRecords.find((record) => record.panel?.dataset.majorMinorPanel === majorMinorMode);
      if (!activeRecord || !canAutoplay(activeRecord)) return;
      activeRecord.timer = window.setTimeout(() => {
        setShowcaseCard(activeRecord, activeRecord.index + 1);
        scheduleActiveShowcase();
      }, 6200);
    }

    function updateMajorMinorPanels() {
      tabs.forEach((tab) => {
        const active = tab.dataset.majorMinorTab === majorMinorMode;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        const active = panel.dataset.majorMinorPanel === majorMinorMode;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.inert = !active;
      });
    }

    function setMajorMinorMode(nextMode) {
      if (nextMode !== "major" && nextMode !== "minor") return;
      if (majorMinorTransitioning) {
        queuedMajorMinorMode = nextMode;
        return;
      }
      if (nextMode === majorMinorMode) {
        updateMajorMinorPanels();
        scheduleActiveShowcase();
        return;
      }
      majorMinorRoot.dataset.direction = nextMode === "minor" ? "forward" : "backward";
      majorMinorMode = nextMode;
      majorMinorRoot.dataset.mode = nextMode;
      updateMajorMinorPanels();
      clearShowcaseTimers();
      if (reducedMotionQuery.matches) {
        scheduleActiveShowcase();
        return;
      }
      majorMinorTransitioning = true;
      majorMinorRoot.setAttribute("aria-busy", "true");
      window.clearTimeout(majorMinorTransitionTimer);
      majorMinorTransitionTimer = window.setTimeout(() => {
        majorMinorTransitioning = false;
        majorMinorRoot.removeAttribute("aria-busy");
        scheduleActiveShowcase();
        const queuedMode = queuedMajorMinorMode;
        queuedMajorMinorMode = "";
        if (queuedMode && queuedMode !== majorMinorMode) setMajorMinorMode(queuedMode);
      }, 760);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setMajorMinorMode(tab.dataset.majorMinorTab));
      tab.addEventListener("keydown", (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[targetIndex].focus();
        setMajorMinorMode(tabs[targetIndex].dataset.majorMinorTab);
      });
    });

    showcaseRecords.forEach((record) => {
      record.previous?.addEventListener("click", () => {
        setShowcaseCard(record, record.index - 1, { announce: true, scroll: true });
        scheduleActiveShowcase();
      });
      record.next?.addEventListener("click", () => {
        setShowcaseCard(record, record.index + 1, { announce: true, scroll: true });
        scheduleActiveShowcase();
      });
      record.dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          setShowcaseCard(record, Number(dot.dataset.majorMinorDot), { announce: true, scroll: true });
          scheduleActiveShowcase();
        });
      });
      record.root.addEventListener("mouseenter", () => {
        record.pointerPaused = true;
        scheduleActiveShowcase();
      });
      record.root.addEventListener("mouseleave", () => {
        record.pointerPaused = false;
        scheduleActiveShowcase();
      });
      record.root.addEventListener("focusin", () => {
        record.focusPaused = true;
        scheduleActiveShowcase();
      });
      record.root.addEventListener("focusout", () => {
        window.setTimeout(() => {
          record.focusPaused = record.root.contains(document.activeElement);
          scheduleActiveShowcase();
        }, 0);
      });
      record.track?.addEventListener("scroll", () => {
        if (!mobileQuery.matches) return;
        window.clearTimeout(record.scrollTimer);
        record.scrollTimer = window.setTimeout(() => {
          const trackCenter = record.track.scrollLeft + (record.track.clientWidth / 2);
          const nearestIndex = record.cards.reduce((bestIndex, card, cardIndex) => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const bestCard = record.cards[bestIndex];
            const bestCenter = bestCard.offsetLeft + (bestCard.offsetWidth / 2);
            return Math.abs(cardCenter - trackCenter) < Math.abs(bestCenter - trackCenter) ? cardIndex : bestIndex;
          }, 0);
          setShowcaseCard(record, nearestIndex, { announce: true });
        }, 130);
      }, { passive: true });
      setShowcaseCard(record, 0);
    });

    const restartMajorMinorAutoplay = () => {
      showcaseRecords.forEach((record) => {
        if (!record.root.matches(":hover")) record.pointerPaused = false;
        record.focusPaused = record.root.contains(document.activeElement);
      });
      scheduleActiveShowcase();
    };
    document.addEventListener("visibilitychange", restartMajorMinorAutoplay);
    if (typeof reducedMotionQuery.addEventListener === "function") reducedMotionQuery.addEventListener("change", restartMajorMinorAutoplay);
    else reducedMotionQuery.addListener(restartMajorMinorAutoplay);
    if (typeof mobileQuery.addEventListener === "function") mobileQuery.addEventListener("change", restartMajorMinorAutoplay);
    else mobileQuery.addListener(restartMajorMinorAutoplay);
    majorMinorRoot.classList.add("is-enhanced");
    updateMajorMinorPanels();
    scheduleActiveShowcase();
  }

  const faqRoot = document.querySelector("[data-major-faq]");

  if (faqRoot) {
    const items = Array.from(faqRoot.querySelectorAll("[data-major-faq-item]"));

    function setFaqState(item, expanded) {
      const button = item.querySelector("[data-major-faq-button]");
      const panel = document.getElementById(button?.getAttribute("aria-controls") || "");
      const icon = button?.querySelector(".tarot-faq__icon");
      item.classList.toggle("is-open", expanded);
      button?.setAttribute("aria-expanded", String(expanded));
      panel?.setAttribute("aria-hidden", String(!expanded));
      if (panel) panel.inert = !expanded;
      if (icon) icon.textContent = expanded ? "−" : "+";
    }

    items.forEach((item) => {
      item.querySelector("[data-major-faq-button]")?.addEventListener("click", () => {
        const shouldOpen = !item.classList.contains("is-open");
        items.forEach((candidate) => setFaqState(candidate, false));
        if (shouldOpen) setFaqState(item, true);
      });
    });
    faqRoot.classList.add("is-enhanced");
    items.forEach((item) => setFaqState(item, false));
  }

  window.addEventListener("astralVeilBloodMoonChange", updateThemeImages);
  updateThemeImages();
})();
