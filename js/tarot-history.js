(function () {
  if (document.documentElement.dataset.tarotHistoryInitialized === "true") return;
  document.documentElement.dataset.tarotHistoryInitialized = "true";

  const mobileTimelineQuery = window.matchMedia("(max-width: 768px)");
  const mobileTraditionsQuery = window.matchMedia("(max-width: 768px)");
  const mobileContributorsQuery = window.matchMedia("(max-width: 768px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const timelineSection = document.querySelector(".tarot-history-timeline");

  if (timelineSection) {
    const timelinePanels = Array.from(timelineSection.querySelectorAll("[data-history-timeline-panel]"));
    const timelineTabs = Array.from(timelineSection.querySelectorAll("[data-history-timeline-tab]"));
    const panelsContainer = timelineSection.querySelector("[data-history-timeline-panels]");
    const timelineTrack = timelineSection.querySelector("[data-history-timeline-track]");
    const timelineCurrent = timelineSection.querySelector("[data-history-timeline-current]");
    const timelineStatus = timelineSection.querySelector("[data-history-timeline-status]");
    const timelinePrevious = timelineSection.querySelector("[data-history-timeline-previous]");
    const timelineNext = timelineSection.querySelector("[data-history-timeline-next]");
    let activeTimelineIndex = 0;
    let timelineChangeToken = 0;
    let timelineScrollFrame = 0;
    let timelineRevealComplete = false;
    let leavingTimelineTimer = 0;
    let timelineProgrammaticScrollTimer = 0;
    let suppressTimelineScrollSync = false;

    function timelineImage(panel) {
      return panel?.querySelector("img") || null;
    }

    function decodeTimelineImage(panel) {
      const image = timelineImage(panel);
      if (!image) return Promise.resolve();
      if (typeof image.decode === "function") return image.decode().catch(() => {});
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }

    function timelinePanelLeft(panel) {
      return panelsContainer.scrollLeft
        + panel.getBoundingClientRect().left
        - panelsContainer.getBoundingClientRect().left;
    }

    function scrollToTimelinePanel(index, behavior = reducedMotionQuery.matches ? "auto" : "smooth") {
      if (!mobileTimelineQuery.matches || !panelsContainer) return;
      suppressTimelineScrollSync = true;
      window.clearTimeout(timelineProgrammaticScrollTimer);
      panelsContainer.scrollTo({
        left: timelinePanelLeft(timelinePanels[index]),
        behavior
      });
      timelineProgrammaticScrollTimer = window.setTimeout(() => {
        suppressTimelineScrollSync = false;
        syncTimelineFromSwipe();
      }, behavior === "auto" ? 0 : 540);
    }

    function updateTimelineState(index, { focusTab = false } = {}) {
      activeTimelineIndex = Math.max(0, Math.min(index, timelinePanels.length - 1));
      timelinePanels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeTimelineIndex;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.querySelectorAll("a").forEach((link) => {
          link.tabIndex = active ? 0 : -1;
        });
      });
      timelineTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeTimelineIndex;
        tab.classList.toggle("is-active", active);
        tab.classList.toggle("is-complete", tabIndex < activeTimelineIndex);
        tab.setAttribute("aria-selected", String(active));
        if (active) {
          tab.setAttribute("aria-current", "step");
        } else {
          tab.removeAttribute("aria-current");
        }
        tab.tabIndex = active ? 0 : -1;
      });
      const progress = timelinePanels.length > 1
        ? (activeTimelineIndex / (timelinePanels.length - 1)) * 100
        : 100;
      timelineTrack?.style.setProperty("--timeline-progress", `${progress}%`);
      if (timelineCurrent) timelineCurrent.textContent = String(activeTimelineIndex + 1);
      if (timelineStatus) {
        const era = timelinePanels[activeTimelineIndex]?.querySelector(".tarot-history-card-era")?.textContent?.trim();
        const title = timelinePanels[activeTimelineIndex]?.querySelector("h3")?.textContent?.trim();
        timelineStatus.textContent = era && title ? ` — ${era}: ${title}` : "";
      }
      if (timelinePrevious) timelinePrevious.disabled = activeTimelineIndex === 0;
      if (timelineNext) timelineNext.disabled = activeTimelineIndex === timelinePanels.length - 1;
      if (focusTab) timelineTabs[activeTimelineIndex]?.focus();
    }

    async function activateTimeline(index, {
      focusTab = false,
      scrollMobile = false,
      fromScroll = false,
      immediate = false
    } = {}) {
      const nextIndex = Math.max(0, Math.min(index, timelinePanels.length - 1));
      if (nextIndex === activeTimelineIndex) {
        if (focusTab) timelineTabs[nextIndex]?.focus();
        if (scrollMobile) scrollToTimelinePanel(nextIndex);
        return;
      }

      const token = ++timelineChangeToken;
      if (!fromScroll) await decodeTimelineImage(timelinePanels[nextIndex]);
      if (token !== timelineChangeToken) return;

      const previousPanel = timelinePanels[activeTimelineIndex];
      const nextPanel = timelinePanels[nextIndex];
      window.clearTimeout(leavingTimelineTimer);
      timelinePanels.forEach((panel) => panel.classList.remove("is-leaving"));

      if (!mobileTimelineQuery.matches && !immediate) {
        previousPanel?.classList.add("is-leaving");
      }
      updateTimelineState(nextIndex, { focusTab });
      nextPanel?.classList.remove("is-leaving");

      if (scrollMobile) scrollToTimelinePanel(nextIndex);
      if (previousPanel && previousPanel !== nextPanel) {
        leavingTimelineTimer = window.setTimeout(() => {
          previousPanel.classList.remove("is-leaving");
        }, reducedMotionQuery.matches || immediate ? 0 : 520);
      }
    }

    function syncTimelineFromSwipe() {
      if (!mobileTimelineQuery.matches || !panelsContainer || !timelinePanels.length) return;
      const railLeft = panelsContainer.getBoundingClientRect().left;
      const nearest = timelinePanels.reduce((closest, panel, index) => {
        const distance = Math.abs(panel.getBoundingClientRect().left - railLeft);
        const closestDistance = Math.abs(timelinePanels[closest].getBoundingClientRect().left - railLeft);
        return distance < closestDistance ? index : closest;
      }, 0);
      if (nearest !== activeTimelineIndex) {
        activateTimeline(nearest, { fromScroll: true, immediate: true });
      }
    }

    function syncTimelineMode() {
      timelinePanels.forEach((panel) => panel.classList.remove("is-leaving"));
      if (mobileTimelineQuery.matches) {
        window.requestAnimationFrame(() => scrollToTimelinePanel(activeTimelineIndex, "auto"));
      } else if (panelsContainer) {
        panelsContainer.scrollTo({ left: 0, behavior: "auto" });
      }
    }

    timelineTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTimeline(index, { scrollMobile: true }));
      tab.addEventListener("keydown", (event) => {
        const targets = {
          ArrowLeft: activeTimelineIndex - 1,
          ArrowRight: activeTimelineIndex + 1,
          Home: 0,
          End: timelineTabs.length - 1
        };
        if (!(event.key in targets)) return;
        event.preventDefault();
        activateTimeline(targets[event.key], { focusTab: true, scrollMobile: true });
      });
    });

    timelinePrevious?.addEventListener("click", () => {
      activateTimeline(activeTimelineIndex - 1, { scrollMobile: true });
    });
    timelineNext?.addEventListener("click", () => {
      activateTimeline(activeTimelineIndex + 1, { scrollMobile: true });
    });
    panelsContainer?.addEventListener("scroll", () => {
      if (!mobileTimelineQuery.matches || suppressTimelineScrollSync) return;
      if (timelineScrollFrame) window.cancelAnimationFrame(timelineScrollFrame);
      timelineScrollFrame = window.requestAnimationFrame(syncTimelineFromSwipe);
    }, { passive: true });
    panelsContainer?.addEventListener("pointerdown", () => {
      window.clearTimeout(timelineProgrammaticScrollTimer);
      suppressTimelineScrollSync = false;
    }, { passive: true });
    mobileTimelineQuery.addEventListener?.("change", syncTimelineMode);

    function revealTimeline() {
      if (timelineRevealComplete) return;
      timelineRevealComplete = true;
      timelineSection.classList.add("is-timeline-revealed");
    }

    timelineSection.classList.add("is-timeline-enhanced");
    updateTimelineState(0);
    syncTimelineMode();
    decodeTimelineImage(timelinePanels[0]);

    const warmTimelineImages = () => {
      timelinePanels.slice(1).forEach((panel) => {
        decodeTimelineImage(panel);
      });
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(warmTimelineImages, { timeout: 1800 });
    } else {
      window.setTimeout(warmTimelineImages, 500);
    }

    if ("IntersectionObserver" in window) {
      const timelineObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        revealTimeline();
        observer.disconnect();
      }, { threshold: 0.16 });
      timelineObserver.observe(timelineSection);
    } else {
      revealTimeline();
    }
  }

  const traditionsSection = document.querySelector(".tarot-history-traditions");

  if (traditionsSection) {
    const traditionPanels = Array.from(traditionsSection.querySelectorAll("[data-history-tradition-panel]"));
    const traditionTabs = Array.from(traditionsSection.querySelectorAll("[data-history-tradition-tab]"));
    const traditionExhibit = traditionsSection.querySelector("[data-history-tradition-exhibit]");
    const traditionViewport = traditionsSection.querySelector("[data-history-traditions-viewport]");
    const traditionSelector = traditionsSection.querySelector(".tarot-history-traditions__selector");
    const current = traditionsSection.querySelector("[data-history-tradition-current]");
    const status = traditionsSection.querySelector("[data-history-tradition-status]");
    const previous = traditionsSection.querySelector("[data-history-tradition-previous]");
    const next = traditionsSection.querySelector("[data-history-tradition-next]");
    let activeTraditionIndex = 0;
    let traditionTransitioning = false;
    let traditionMeasureFrame = 0;
    const traditionTransitionMs = 760;
    const traditionMotionClasses = [
      "is-entering-next",
      "is-entering-previous",
      "is-leaving-next",
      "is-leaving-previous",
      "is-arriving"
    ];

    function traditionImage(panel) {
      return panel?.querySelector("img") || null;
    }

    function decodeTraditionImage(panel) {
      const image = traditionImage(panel);
      if (!image) return Promise.resolve();
      if (typeof image.decode === "function") return image.decode().catch(() => {});
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }

    function clearTraditionMotion(panel) {
      panel.classList.remove(...traditionMotionClasses);
    }

    function centerActiveTraditionTab(index) {
      if (!mobileTraditionsQuery.matches || !traditionSelector) return;
      const tab = traditionTabs[index];
      if (!tab) return;
      const left = tab.offsetLeft - ((traditionSelector.clientWidth - tab.offsetWidth) / 2);
      traditionSelector.scrollTo({
        left: Math.max(0, left),
        behavior: reducedMotionQuery.matches ? "auto" : "smooth"
      });
    }

    function updateTraditionState(index, { focusTab = false } = {}) {
      activeTraditionIndex = Math.max(0, Math.min(index, traditionPanels.length - 1));
      traditionPanels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeTraditionIndex;
        clearTraditionMotion(panel);
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        panel.querySelectorAll("a").forEach((link) => {
          link.tabIndex = active ? 0 : -1;
        });
      });
      traditionTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeTraditionIndex;
        tab.setAttribute("aria-selected", String(active));
        tab.removeAttribute("aria-disabled");
        if (active) {
          tab.setAttribute("aria-current", "true");
        } else {
          tab.removeAttribute("aria-current");
        }
        tab.tabIndex = active ? 0 : -1;
      });
      const progress = ((activeTraditionIndex + 1) / traditionPanels.length) * 100;
      traditionSelector?.style.setProperty("--tradition-progress", `${progress}%`);
      if (current) current.textContent = String(activeTraditionIndex + 1);
      if (status) {
        const title = traditionPanels[activeTraditionIndex]?.querySelector("h3")?.textContent?.trim();
        status.textContent = title ? ` — ${title}` : "";
      }
      if (previous) previous.disabled = activeTraditionIndex === 0;
      if (next) next.disabled = activeTraditionIndex === traditionPanels.length - 1;
      traditionViewport?.removeAttribute("aria-busy");
      traditionsSection.classList.remove("is-transitioning");
      centerActiveTraditionTab(activeTraditionIndex);
      if (focusTab) traditionTabs[activeTraditionIndex]?.focus();
    }

    function lockTraditionNavigation() {
      traditionsSection.classList.add("is-transitioning");
      traditionViewport?.setAttribute("aria-busy", "true");
      if (previous) previous.disabled = true;
      if (next) next.disabled = true;
      traditionTabs.forEach((tab) => tab.setAttribute("aria-disabled", "true"));
    }

    function waitForTraditionFrame() {
      return new Promise((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
      });
    }

    function waitForTraditionTransition(panel) {
      return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          panel.removeEventListener("transitionend", onTransitionEnd);
          window.clearTimeout(fallbackTimer);
          resolve();
        };
        const onTransitionEnd = (event) => {
          if (event.target === panel && event.propertyName === "transform") finish();
        };
        const fallbackTimer = window.setTimeout(finish, traditionTransitionMs + 140);
        panel.addEventListener("transitionend", onTransitionEnd);
      });
    }

    function measureTraditionViewport() {
      if (!traditionExhibit) return;
      if (traditionMeasureFrame) window.cancelAnimationFrame(traditionMeasureFrame);
      traditionMeasureFrame = window.requestAnimationFrame(() => {
        traditionMeasureFrame = 0;
        if (!mobileTraditionsQuery.matches) {
          traditionExhibit.style.removeProperty("--tradition-mobile-height");
          return;
        }
        const tallest = traditionPanels.reduce((height, panel) => {
          const mediaHeight = panel.querySelector(".tarot-history-tradition__media")?.getBoundingClientRect().height || 0;
          const copyHeight = panel.querySelector(".tarot-history-tradition__copy")?.scrollHeight || 0;
          return Math.max(height, Math.ceil(mediaHeight + copyHeight));
        }, 0);
        if (tallest > 0) {
          traditionExhibit.style.setProperty("--tradition-mobile-height", `${tallest}px`);
        }
      });
    }

    async function activateTradition(index, { focusTab = false, immediate = false } = {}) {
      const nextIndex = Math.max(0, Math.min(index, traditionPanels.length - 1));
      if (nextIndex === activeTraditionIndex) {
        if (focusTab) traditionTabs[nextIndex]?.focus();
        return;
      }
      if (traditionTransitioning) return;

      const direction = nextIndex > activeTraditionIndex ? "next" : "previous";
      const outgoingPanel = traditionPanels[activeTraditionIndex];
      const incomingPanel = traditionPanels[nextIndex];
      traditionTransitioning = true;
      lockTraditionNavigation();
      await decodeTraditionImage(incomingPanel);

      if (reducedMotionQuery.matches || immediate) {
        traditionTransitioning = false;
        updateTraditionState(nextIndex, { focusTab });
        measureTraditionViewport();
        return;
      }

      traditionPanels.forEach(clearTraditionMotion);
      incomingPanel.classList.add(`is-entering-${direction}`);
      incomingPanel.setAttribute("aria-hidden", "true");
      incomingPanel.querySelectorAll("a").forEach((link) => {
        link.tabIndex = -1;
      });

      await waitForTraditionFrame();
      outgoingPanel.classList.remove("is-active");
      outgoingPanel.classList.add(`is-leaving-${direction}`);
      incomingPanel.classList.remove(`is-entering-${direction}`);
      incomingPanel.classList.add("is-active", "is-arriving");
      await waitForTraditionTransition(incomingPanel);

      traditionTransitioning = false;
      updateTraditionState(nextIndex, { focusTab });
      measureTraditionViewport();
    }

    traditionTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTradition(index));
      tab.addEventListener("keydown", (event) => {
        const targets = {
          ArrowLeft: activeTraditionIndex - 1,
          ArrowRight: activeTraditionIndex + 1,
          Home: 0,
          End: traditionTabs.length - 1
        };
        if (!(event.key in targets)) return;
        event.preventDefault();
        activateTradition(targets[event.key], { focusTab: true });
      });
    });

    previous?.addEventListener("click", () => activateTradition(activeTraditionIndex - 1));
    next?.addEventListener("click", () => activateTradition(activeTraditionIndex + 1));
    mobileTraditionsQuery.addEventListener?.("change", measureTraditionViewport);
    window.addEventListener("resize", measureTraditionViewport, { passive: true });

    traditionsSection.classList.add("is-traditions-enhanced");
    updateTraditionState(0);
    measureTraditionViewport();
    document.fonts?.ready?.then(measureTraditionViewport);
    decodeTraditionImage(traditionPanels[0]);
    const warmTraditionImages = () => traditionPanels.slice(1).forEach((panel) => decodeTraditionImage(panel));
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(warmTraditionImages, { timeout: 1800 });
    } else {
      window.setTimeout(warmTraditionImages, 500);
    }
  }

  const contributorsSection = document.querySelector(".tarot-history-contributors");

  if (contributorsSection) {
    const contributorPanels = Array.from(contributorsSection.querySelectorAll("[data-history-contributor-panel]"));
    const contributorTabs = Array.from(contributorsSection.querySelectorAll("[data-history-contributor-index]"));
    const contributorPanelsContainer = contributorsSection.querySelector(".tarot-history-contributors__panels");
    const contributorTablist = contributorsSection.querySelector('.tarot-history-contributors__index [role="tablist"]');
    let activeContributorIndex = 0;
    let leavingTimer = 0;
    let contributorsUseMobileAccordion = false;

    function updateContributorView(panel, index, { focusTab = false } = {}) {
      const viewTabs = Array.from(panel.querySelectorAll("[data-history-contributor-view-tab]"));
      const views = Array.from(panel.querySelectorAll("[data-history-contributor-view]"));
      const nextIndex = Math.max(0, Math.min(index, views.length - 1));
      viewTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === nextIndex;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      views.forEach((view, viewIndex) => {
        const active = viewIndex === nextIndex;
        view.classList.toggle("is-active", active);
        view.hidden = !active;
      });
      if (focusTab) viewTabs[nextIndex]?.focus();
    }

    contributorPanels.forEach((panel) => {
      const viewTabs = Array.from(panel.querySelectorAll("[data-history-contributor-view-tab]"));
      viewTabs.forEach((tab, index) => {
        tab.addEventListener("click", () => updateContributorView(panel, index));
        tab.addEventListener("keydown", (event) => {
          const targets = {
            ArrowLeft: index - 1,
            ArrowRight: index + 1,
            Home: 0,
            End: viewTabs.length - 1
          };
          if (!(event.key in targets)) return;
          event.preventDefault();
          updateContributorView(panel, targets[event.key], { focusTab: true });
        });
      });
      updateContributorView(panel, 0);
    });

    function setMobileContributorPanelState(index, open) {
      contributorTabs.forEach((tab, tabIndex) => {
        const expanded = open && tabIndex === index;
        const panel = contributorPanels[tabIndex];
        tab.setAttribute("aria-expanded", String(expanded));
        panel.classList.toggle("is-active", expanded);
        panel.classList.remove("is-leaving");
        panel.hidden = !expanded;
        panel.setAttribute("aria-hidden", String(!expanded));
      });
      if (open) activeContributorIndex = index;
    }

    function enableMobileContributorAccordion() {
      if (contributorsUseMobileAccordion) return;
      contributorsUseMobileAccordion = true;
      contributorsSection.classList.add("is-contributors-mobile-accordion");
      contributorTablist?.removeAttribute("role");
      contributorTablist?.removeAttribute("aria-orientation");
      contributorTabs.forEach((tab, index) => {
        const panel = contributorPanels[index];
        tab.removeAttribute("role");
        tab.removeAttribute("aria-selected");
        tab.tabIndex = 0;
        tab.setAttribute("aria-expanded", "false");
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", tab.id);
        tab.after(panel);
      });
      setMobileContributorPanelState(activeContributorIndex, false);
    }

    function disableMobileContributorAccordion() {
      if (!contributorsUseMobileAccordion || !contributorPanelsContainer) return;
      contributorsUseMobileAccordion = false;
      contributorsSection.classList.remove("is-contributors-mobile-accordion");
      contributorTablist?.setAttribute("role", "tablist");
      contributorTablist?.setAttribute("aria-orientation", "vertical");
      contributorTabs.forEach((tab, index) => {
        const panel = contributorPanels[index];
        tab.setAttribute("role", "tab");
        tab.removeAttribute("aria-expanded");
        panel.hidden = false;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
        contributorPanelsContainer.append(panel);
      });
      updateContributorState(activeContributorIndex, { immediate: true });
    }

    function syncContributorLayout() {
      if (mobileContributorsQuery.matches) {
        enableMobileContributorAccordion();
      } else {
        disableMobileContributorAccordion();
      }
    }

    function updateContributorState(index, { focusTab = false, immediate = false } = {}) {
      const nextIndex = Math.max(0, Math.min(index, contributorPanels.length - 1));
      const previousPanel = contributorPanels[activeContributorIndex];
      const changed = nextIndex !== activeContributorIndex;
      window.clearTimeout(leavingTimer);
      contributorPanels.forEach((panel) => panel.classList.remove("is-leaving"));
      if (changed && !immediate) previousPanel?.classList.add("is-leaving");
      activeContributorIndex = nextIndex;
      contributorPanels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeContributorIndex;
        panel.classList.toggle("is-active", active);
        panel.setAttribute("aria-hidden", String(!active));
        if (active && changed) updateContributorView(panel, 0);
      });
      contributorTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeContributorIndex;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      if (changed && previousPanel) {
        leavingTimer = window.setTimeout(() => previousPanel.classList.remove("is-leaving"), reducedMotionQuery.matches || immediate ? 0 : 420);
      }
      if (focusTab) contributorTabs[activeContributorIndex]?.focus();
    }

    contributorTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        if (contributorsUseMobileAccordion) {
          const open = tab.getAttribute("aria-expanded") !== "true";
          setMobileContributorPanelState(index, open);
          return;
        }
        updateContributorState(index);
      });
      tab.addEventListener("keydown", (event) => {
        if (contributorsUseMobileAccordion) return;
        const targets = {
          ArrowUp: activeContributorIndex - 1,
          ArrowDown: activeContributorIndex + 1,
          ArrowLeft: activeContributorIndex - 1,
          ArrowRight: activeContributorIndex + 1,
          Home: 0,
          End: contributorTabs.length - 1
        };
        if (!(event.key in targets)) return;
        event.preventDefault();
        updateContributorState(targets[event.key], { focusTab: true });
      });
    });

    contributorsSection.classList.add("is-contributors-enhanced");
    if (mobileContributorsQuery.matches) {
      enableMobileContributorAccordion();
    } else {
      updateContributorState(0, { immediate: true });
    }
    mobileContributorsQuery.addEventListener?.("change", syncContributorLayout);
  }

  const contributorDialog = document.querySelector("[data-history-contributor-dialog]");
  const contributorDataElement = document.getElementById("tarot-history-contributor-data");
  const contributorOpeners = Array.from(document.querySelectorAll("[data-history-contributor-open]"));

  if (contributorDialog && contributorDataElement && contributorOpeners.length) {
    const dialogPanel = contributorDialog.querySelector('[role="dialog"]');
    const closeControls = Array.from(contributorDialog.querySelectorAll("[data-history-contributor-close]"));
    const title = contributorDialog.querySelector("[data-history-contributor-title]");
    const dates = contributorDialog.querySelector("[data-history-contributor-dates]");
    const detail = contributorDialog.querySelector("[data-history-contributor-detail]");
    const why = contributorDialog.querySelector("[data-history-contributor-why]");
    const clarification = contributorDialog.querySelector("[data-history-contributor-clarification]");
    const backgroundElements = Array.from(document.querySelectorAll(
      ".site-header, .tarot-history > :not(.tarot-history-dialog), .site-footer"
    ));
    let contributorData = {};
    let lastOpener = null;

    try {
      contributorData = JSON.parse(contributorDataElement.textContent || "{}");
    } catch (error) {
      contributorData = {};
    }

    function focusableElements() {
      return Array.from(contributorDialog.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => !element.hidden && element.getClientRects().length > 0);
    }

    function setBackgroundInert(inert) {
      backgroundElements.forEach((element) => {
        element.inert = inert;
      });
    }

    function closeContributorDialog() {
      if (contributorDialog.hidden) return;
      contributorDialog.classList.remove("is-open");
      contributorDialog.hidden = true;
      document.body.classList.remove("history-modal-open");
      setBackgroundInert(false);
      lastOpener?.focus();
      lastOpener = null;
    }

    function openContributorDialog(opener) {
      const record = contributorData[opener.dataset.historyContributorOpen];
      if (!record || !dialogPanel || !title || !dates || !detail || !why || !clarification) return;
      lastOpener = opener;
      title.textContent = record.name;
      dates.textContent = record.dates;
      detail.textContent = record.detail;
      why.textContent = record.whyItMatters;
      clarification.textContent = record.clarification;
      clarification.hidden = !record.clarification;
      contributorDialog.hidden = false;
      document.body.classList.add("history-modal-open");
      setBackgroundInert(true);
      window.requestAnimationFrame(() => {
        contributorDialog.classList.add("is-open");
        dialogPanel.focus();
      });
    }

    contributorOpeners.forEach((opener) => {
      opener.addEventListener("click", () => openContributorDialog(opener));
    });
    closeControls.forEach((control) => {
      control.addEventListener("click", closeContributorDialog);
    });

    document.addEventListener("keydown", (event) => {
      if (contributorDialog.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeContributorDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = focusableElements();
      if (!focusables.length) {
        event.preventDefault();
        dialogPanel?.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogPanel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }
})();
