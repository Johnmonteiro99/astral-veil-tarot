/*
 * Individual tarot-card page adapter.
 *
 * Static generation embeds one validated card record in each page. This
 * adapter hydrates the approved template and preserves live deck variants and
 * interactions without carrying a second hardcoded content source.
 */
(function () {
  if (window.astralVeilTarotCardPageInitialized) {
    return;
  }
  window.astralVeilTarotCardPageInitialized = true;

  function readEmbeddedCard() {
    const dataElement = document.querySelector("#tarot-card-data");
    if (!dataElement) {
      console.error("Tarot card detail data is missing from the generated page.");
      return null;
    }

    try {
      const card = JSON.parse(dataElement.textContent || "");
      return card && typeof card === "object" && card.slug ? card : null;
    } catch (error) {
      console.error("Tarot card detail data could not be parsed.", error);
      return null;
    }
  }

  const embeddedCard = readEmbeddedCard();
  const detailCards = embeddedCard ? { [embeddedCard.slug]: embeddedCard } : {};

  function getRequestedSlug() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const requestedSlug = parts[parts.length - 1] || "";
    return detailCards[requestedSlug] ? requestedSlug : embeddedCard?.slug || "";
  }

  function getDetailCard(slug) {
    return detailCards[slug] || null;
  }
  function normalizeAssetPath(path) {
    if (typeof path !== "string" || !path.trim()) {
      return "";
    }
    return path.startsWith("/") ? path : `/${path}`;
  }

  function getFirstNarrativeText(...values) {
    return values.find((value) => typeof value === "string" && value.trim()) || "";
  }

  function getCardTitle(card) {
    return getFirstNarrativeText(card?.title, card?.name);
  }

  function getVariantReflectionPrompts(configuredVariant, veilriseVariant, card) {
    const promptSources = [
      configuredVariant?.reflectionPrompts,
      veilriseVariant?.reflectionPrompts,
      card?.reflectionPrompts
    ];

    return [0, 1].map((index) => getFirstNarrativeText(
      ...promptSources.map((prompts) => Array.isArray(prompts) ? prompts[index] : "")
    ));
  }

  function getActiveCardVariant(card, isBloodMoon = document.body.classList.contains("blood-moon-mode")) {
    const variantKey = isBloodMoon ? "veilfall" : "veilrise";
    const configuredVariant = card?.variants?.[variantKey] || {};
    const veilriseVariant = card?.variants?.veilrise || {};
    const deck = variantKey === "veilfall"
      ? window.astralVeilCrimsonDeck
      : window.astralVeilTarotDeck;
    const cards = deck?.cards || (variantKey === "veilfall"
      ? window.astralVeilCrimsonCards
      : window.astralVeilTarotCards) || [];
    const deckCard = cards.find((candidate) => (
      candidate.id === configuredVariant.cardId
      || candidate.originalCardId === card?.slug
      || (variantKey === "veilrise" && candidate.id === card?.slug)
    ));
    const deckName = getFirstNarrativeText(
      deck?.name,
      configuredVariant.deckName,
      veilriseVariant.deckName,
      card?.deck
    );

    return {
      key: variantKey,
      deckId: deck?.id || configuredVariant.deckId || veilriseVariant.deckId || "",
      deckName,
      image: normalizeAssetPath(deckCard?.image || configuredVariant.image || veilriseVariant.image || card?.image),
      imageAlt: getFirstNarrativeText(
        configuredVariant.imageAlt,
        veilriseVariant.imageAlt,
        `${getCardTitle(card)} tarot card from the ${deckName} deck`
      ),
      subtitle: getFirstNarrativeText(
        configuredVariant.subtitle,
        veilriseVariant.subtitle,
        card?.tagline,
        card?.subtitle
      ),
      astralVeilMeaning: getFirstNarrativeText(
        configuredVariant.astralVeilMeaning,
        veilriseVariant.astralVeilMeaning,
        card?.perspectives?.astralVeil,
        card?.astralVeilMeaning
      ),
      reflectionPrompts: getVariantReflectionPrompts(configuredVariant, veilriseVariant, card)
    };
  }

  function getCardIdentityForVariant(card, variant) {
    const identityItems = Array.isArray(card?.identity)
      ? card.identity
      : Array.isArray(card?.cardIdentity) ? card.cardIdentity : [];

    return identityItems.map((item) => (
      item.label === "Deck" ? { ...item, value: variant.deckName } : item
    ));
  }

  function preloadImage(source) {
    return new Promise((resolve) => {
      if (!source || typeof window.Image !== "function") {
        resolve(false);
        return;
      }

      const incomingImage = new window.Image();
      let settled = false;
      const finish = (loaded) => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(loaded);
      };
      incomingImage.decoding = "async";
      incomingImage.addEventListener("load", () => finish(true), { once: true });
      incomingImage.addEventListener("error", () => finish(false), { once: true });
      incomingImage.src = source;
      if (incomingImage.complete) {
        finish(incomingImage.naturalWidth > 0);
      }
    });
  }

  let artworkTransitionId = 0;

  async function updateCardArtwork(variant, { animate = true } = {}) {
    const image = document.querySelector("[data-card-image]");
    const preload = document.querySelector('link[rel="preload"][as="image"]');
    const localTransitionId = ++artworkTransitionId;

    if (preload && variant.image) {
      preload.href = variant.image;
    }
    if (!image || !variant.image) {
      return;
    }

    image.getAnimations?.().forEach((animation) => animation.cancel());
    image.style.opacity = "";
    if (new URL(image.currentSrc || image.src, window.location.href).pathname === variant.image) {
      image.alt = variant.imageAlt;
      return;
    }

    if (!animate) {
      image.src = variant.image;
      image.alt = variant.imageAlt;
      return;
    }

    const loaded = await preloadImage(variant.image);
    if (!loaded || localTransitionId !== artworkTransitionId) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof image.animate !== "function") {
      image.src = variant.image;
      image.alt = variant.imageAlt;
      return;
    }

    const outgoing = image.animate(
      [{ opacity: 1 }, { opacity: .18 }],
      { duration: 110, easing: "ease-in", fill: "forwards" }
    );
    try {
      await outgoing.finished;
    } catch (error) {
      return;
    }
    if (localTransitionId !== artworkTransitionId) {
      return;
    }

    outgoing.cancel();
    image.src = variant.image;
    image.alt = variant.imageAlt;
    image.animate(
      [{ opacity: .18 }, { opacity: 1 }],
      { duration: 190, easing: "ease-out" }
    );
  }

  function updateVariantCopy(variant, { animate = true } = {}) {
    const fields = [
      { selector: "[data-card-tagline]", value: variant.subtitle },
      { selector: "[data-card-astral-meaning]", value: variant.astralVeilMeaning },
      { selector: "[data-card-journal-primary]", value: variant.reflectionPrompts[0] },
      { selector: "[data-card-journal-secondary]", value: variant.reflectionPrompts[1] }
    ];
    const changedElements = [];

    fields.forEach(({ selector, value }) => {
      if (!value) {
        return;
      }
      document.querySelectorAll(selector).forEach((element) => {
        element.getAnimations?.().forEach((animation) => animation.cancel());
        if (element.textContent === value) {
          return;
        }
        element.textContent = value;
        changedElements.push(element);
      });
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reducedMotion) {
      return;
    }

    changedElements.forEach((element) => {
      if (typeof element.animate !== "function") {
        return;
      }
      element.animate(
        [
          { opacity: .38, transform: "translateX(6px)" },
          { opacity: 1, transform: "translateX(0)" }
        ],
        { duration: 220, easing: "ease-out" }
      );
    });
  }

  function updateCardVariant(card, isBloodMoon, options) {
    if (!card) {
      return null;
    }

    const variant = getActiveCardVariant(card, isBloodMoon);
    document.documentElement.dataset.tarotVariant = variant.key;
    document.documentElement.dataset.tarotDeck = variant.deckId;
    document.querySelectorAll("[data-card-previous], [data-card-next]").forEach((control) => {
      control.dataset.tarotDeck = variant.deckId;
    });
    setText("[data-card-deck]", variant.deckName);
    document.querySelector("[data-card-identity]")?.replaceChildren(
      ...createDefinitionListItems(getCardIdentityForVariant(card, variant))
    );
    updateVariantCopy(variant, options);
    updateCardArtwork(variant, options);
    return variant;
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function createDefinitionListItems(items) {
    return items.map(({ label, value }) => {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      return row;
    });
  }

  function renderFaq(card) {
    const faqList = document.querySelector("[data-card-faq]");
    if (!faqList) {
      return;
    }

    const items = card.commonQuestions.map(({ question, answer }, index) => {
      const item = document.createElement("article");
      const heading = document.createElement("h3");
      const button = document.createElement("button");
      const answerPanel = document.createElement("div");
      const answerCopy = document.createElement("p");
      const panelId = `tarot-card-faq-answer-${index + 1}`;

      item.className = "tarot-card-faq__item";
      button.className = "tarot-card-faq__question";
      button.id = `tarot-card-faq-question-${index + 1}`;
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      button.dataset.faqButton = String(index);
      button.append(document.createTextNode(question));

      const icon = document.createElement("span");
      icon.className = "tarot-card-faq__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "+";
      button.append(icon);

      answerPanel.className = "tarot-card-faq__answer";
      answerPanel.id = panelId;
      answerPanel.dataset.faqPanel = String(index);
      answerPanel.setAttribute("role", "region");
      answerPanel.setAttribute("aria-labelledby", button.id);
      answerPanel.hidden = true;
      answerCopy.textContent = answer;
      answerPanel.append(answerCopy);
      heading.append(button);
      item.append(heading, answerPanel);
      return item;
    });

    faqList.replaceChildren(...items);

    const schema = document.querySelector("#tarot-card-faq-schema");
    if (schema) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: card.commonQuestions.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      });
    }
  }

  function updatePage(card) {
    if (!card) {
      return;
    }

    const cardTitle = getCardTitle(card);
    document.documentElement.dataset.tarotCard = card.slug;
    document.title = card.seo?.title || `${cardTitle} Tarot Card Meaning: Love, Career & Advice | Astral Veil`;
    setText("[data-card-name]", cardTitle);
    setText("[data-card-number]", card.displayNumber);
    setText("[data-card-arcana]", card.arcana);
    setText("[data-card-archetypal-message]", card.archetypalMessage);
    setText("[data-card-description]", card.description);
    setText("[data-card-upright]", card.uprightMeaning);
    setText("[data-card-reversed]", card.reversedMeaning);
    setText("[data-card-shadow]", card.shadowMeaning);
    setText("[data-card-reflection]", card.reflection);
    setText("[data-card-index]", card.index);
    setText("[data-card-total]", card.total);

    [
      ["[data-card-previous]", card.previous],
      ["[data-card-next]", card.next]
    ].forEach(([selector, destination]) => {
      const control = document.querySelector(selector);
      const destinationIsReady = destination?.slug && destination?.route && destination.available !== false;
      if (!control) {
        return;
      }
      control.classList.toggle("is-unavailable", !destinationIsReady);
      if (destinationIsReady) {
        control.href = destination.route;
        control.setAttribute("aria-label", `${selector.includes("previous") ? "Previous" : "Next"} tarot card: ${destination.title}`);
        control.removeAttribute("aria-disabled");
        control.removeAttribute("tabindex");
      } else {
        control.removeAttribute("href");
        control.setAttribute("aria-disabled", "true");
        control.setAttribute("tabindex", "-1");
      }
    });

    const keywordList = document.querySelector("[data-card-keywords]");
    if (keywordList) {
      keywordList.replaceChildren(...card.keywords.map((keyword) => {
        const item = document.createElement("li");
        item.textContent = keyword;
        return item;
      }));
    }

    const correspondences = document.querySelector("[data-card-correspondences]");
    correspondences?.replaceChildren(...createDefinitionListItems(card.correspondences));
    updateCardVariant(card, document.body.classList.contains("blood-moon-mode"), { animate: false });

    setText("[data-card-traditional-meaning]", card.traditionalMeaning);
    Object.entries(card.categories).forEach(([area, meanings]) => setText(`[data-card-life-${area}]`, meanings.upright));
    setText("[data-journey-current-card]", card.journey.currentCard);
    setText("[data-journey-next-card]", card.journey.nextCard);
    setText("[data-journey-next-message]", card.journey.nextMessage);
    setText("[data-journey-summary]", card.journey.summary);
    document.querySelector("[data-journey-details]")?.replaceChildren(...createDefinitionListItems(card.journey.details));
    renderFaq(card);
  }

  function enablePerspectiveTabs() {
    const tablist = document.querySelector("[data-perspective-tabs]");
    const tabs = Array.from(tablist?.querySelectorAll("[data-perspective-tab]") || []);
    const panels = Array.from(document.querySelectorAll("[data-perspective-panel]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let transitionId = 0;

    if (!tablist || !tabs.length || !panels.length) {
      return;
    }

    async function selectTab(nextTab, moveFocus = false) {
      const currentTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
      if (!nextTab || nextTab === currentTab) {
        if (moveFocus) {
          nextTab?.focus();
        }
        return;
      }

      const currentPanel = panels.find((panel) => !panel.hidden);
      const nextPanel = panels.find((panel) => panel.dataset.perspectivePanel === nextTab.dataset.perspectiveTab);
      const localTransitionId = ++transitionId;

      tabs.forEach((tab) => {
        const isActive = tab === nextTab;
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });
      if (moveFocus) {
        nextTab.focus();
      }

      panels.forEach((panel) => panel.getAnimations().forEach((animation) => animation.cancel()));
      if (!currentPanel || !nextPanel || reducedMotion.matches) {
        panels.forEach((panel) => { panel.hidden = panel !== nextPanel; });
        return;
      }

      const outgoing = currentPanel.animate(
        [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: "translateX(-12px)" }],
        { duration: 180, easing: "ease", fill: "forwards" }
      );
      try {
        await outgoing.finished;
      } catch (error) {
        return;
      }
      if (localTransitionId !== transitionId) {
        return;
      }

      currentPanel.hidden = true;
      nextPanel.hidden = false;
      nextPanel.animate(
        [{ opacity: 0, transform: "translateX(12px)" }, { opacity: 1, transform: "translateX(0)" }],
        { duration: 220, easing: "ease-out" }
      );
    }

    tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab)));
    tablist.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        return;
      }
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      selectTab(tabs[nextIndex], true);
    });
  }

  function enableMeaningStateToggle(card) {
    const toggle = document.querySelector("[data-meaning-state-toggle]");
    const buttons = Array.from(toggle?.querySelectorAll("[data-meaning-state]") || []);
    if (!card?.categories) {
      return;
    }
    const meaningElements = Object.keys(card.categories).map((area) => ({
      area,
      element: document.querySelector(`[data-card-life-${area}]`)
    })).filter(({ element }) => element);
    const labels = Array.from(document.querySelectorAll("[data-card-life-state]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeState = "upright";
    let renderedState = "upright";
    let transitionId = 0;

    if (!toggle || !buttons.length || !meaningElements.length) {
      return;
    }

    function applyState(state) {
      meaningElements.forEach(({ area, element }) => {
        const nextText = card.categories[area]?.[state];
        if (typeof nextText === "string" && nextText.trim()) {
          element.textContent = nextText;
        }
      });
      labels.forEach((label) => { label.textContent = state === "upright" ? "Upright" : "Reversed"; });
      renderedState = state;
    }

    function restoreMeaningElement(element) {
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.transform = "none";
    }

    function cancelMeaningAnimations() {
      meaningElements.forEach(({ element }) => {
        element.getAnimations().forEach((animation) => animation.cancel());
        restoreMeaningElement(element);
      });
    }

    async function selectState(state) {
      if (!["upright", "reversed"].includes(state) || state === activeState) {
        return;
      }
      const localTransitionId = ++transitionId;
      activeState = state;

      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.meaningState === state)));
      cancelMeaningAnimations();

      if (state === renderedState || reducedMotion.matches || meaningElements.some(({ element }) => typeof element.animate !== "function")) {
        applyState(state);
        return;
      }

      const outDirection = renderedState === "upright" ? -1 : 1;
      const outgoing = meaningElements.map(({ element }) => element.animate(
        [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: `translateX(${outDirection * 14}px)` }],
        { duration: 130, easing: "ease-in", fill: "forwards" }
      ));

      try {
        await Promise.all(outgoing.map((animation) => animation.finished));
      } catch (error) {
        if (localTransitionId === transitionId) {
          cancelMeaningAnimations();
          applyState(state);
        }
        return;
      }
      if (localTransitionId !== transitionId) {
        return;
      }

      cancelMeaningAnimations();
      applyState(state);
      const incoming = meaningElements.map(({ element }) => element.animate(
        [{ opacity: 0, transform: `translateX(${-outDirection * 14}px)` }, { opacity: 1, transform: "translateX(0)" }],
        { duration: 170, easing: "ease-out" }
      ));
      try {
        await Promise.all(incoming.map((animation) => animation.finished));
      } catch (error) {
        // A newer selection owns cleanup when this transition is interrupted.
      }
      if (localTransitionId === transitionId) {
        cancelMeaningAnimations();
        applyState(state);
      }
    }

    cancelMeaningAnimations();
    applyState(activeState);
    buttons.forEach((button) => button.addEventListener("click", () => selectState(button.dataset.meaningState)));
  }

  function enableFaqAccordion() {
    const faqList = document.querySelector("[data-card-faq]");
    const buttons = Array.from(faqList?.querySelectorAll("[data-faq-button]") || []);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let openIndex = null;

    if (!faqList || !buttons.length) {
      return;
    }

    function setExpanded(button, expand) {
      const panel = document.querySelector(`#${button.getAttribute("aria-controls")}`);
      const icon = button.querySelector(".tarot-card-faq__icon");
      if (!panel) {
        return;
      }

      panel.getAnimations().forEach((animation) => animation.cancel());
      button.setAttribute("aria-expanded", String(expand));
      if (icon) {
        icon.textContent = expand ? "−" : "+";
      }

      if (reducedMotion.matches) {
        panel.hidden = !expand;
        panel.style.height = "";
        panel.style.opacity = "";
        return;
      }

      if (expand) {
        panel.hidden = false;
      }
      const startHeight = expand ? 0 : panel.getBoundingClientRect().height;
      const endHeight = expand ? panel.scrollHeight : 0;
      const animation = panel.animate(
        [
          { height: `${startHeight}px`, opacity: expand ? 0 : 1 },
          { height: `${endHeight}px`, opacity: expand ? 1 : 0 }
        ],
        { duration: 240, easing: "ease", fill: "forwards" }
      );
      animation.finished.then(() => {
        panel.hidden = !expand;
        animation.cancel();
      }).catch(() => {});
    }

    buttons.forEach((button, index) => button.addEventListener("click", () => {
      const shouldOpen = openIndex !== index;
      buttons.forEach((candidate, candidateIndex) => {
        if (candidateIndex === index) {
          return;
        }
        if (candidate.getAttribute("aria-expanded") === "true") {
          setExpanded(candidate, false);
        }
      });
      setExpanded(button, shouldOpen);
      openIndex = shouldOpen ? index : null;
    }));
  }

  function enableTilt() {
    const tiltCard = document.querySelector("[data-tarot-card-tilt]");
    const hint = document.querySelector("[data-tarot-card-tilt-hint]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!tiltCard || reducedMotion.matches || !finePointer.matches) {
      hint?.setAttribute("hidden", "");
      return;
    }

    function resetTilt() {
      tiltCard.style.setProperty("--tilt-x", "0deg");
      tiltCard.style.setProperty("--tilt-y", "0deg");
      tiltCard.style.setProperty("--shine-x", "50%");
      tiltCard.style.setProperty("--shine-y", "50%");
    }

    function updateTilt(event) {
      if (reducedMotion.matches) {
        return;
      }
      const rect = tiltCard.getBoundingClientRect();
      const relativeX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const relativeY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      tiltCard.style.setProperty("--tilt-x", `${((0.5 - relativeY) * 10).toFixed(2)}deg`);
      tiltCard.style.setProperty("--tilt-y", `${((relativeX - 0.5) * 10).toFixed(2)}deg`);
      tiltCard.style.setProperty("--shine-x", `${(relativeX * 100).toFixed(1)}%`);
      tiltCard.style.setProperty("--shine-y", `${(relativeY * 100).toFixed(1)}%`);
    }

    function startTilt(event) {
      if (event.pointerType === "touch") {
        return;
      }
      tiltCard.setPointerCapture?.(event.pointerId);
      updateTilt(event);
    }

    function endTilt(event) {
      try {
        tiltCard.releasePointerCapture?.(event.pointerId);
      } catch (error) {
        // Capture can be released by the browser before this handler runs.
      }
      resetTilt();
    }

    tiltCard.addEventListener("pointerdown", startTilt);
    tiltCard.addEventListener("pointermove", updateTilt);
    tiltCard.addEventListener("pointerleave", resetTilt);
    tiltCard.addEventListener("pointerup", endTilt);
    tiltCard.addEventListener("pointercancel", endTilt);
    reducedMotion.addEventListener?.("change", () => {
      if (reducedMotion.matches) {
        resetTilt();
        hint?.setAttribute("hidden", "");
      }
    });
  }

  function enableMobileCardCarousels() {
    const viewports = Array.from(document.querySelectorAll("[data-mobile-card-carousel]"));
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lifeViewport = document.querySelector(".tarot-life-currents__viewport");
    const lifePosition = document.querySelector("[data-life-carousel-position]");
    let positionFrame = 0;

    if (!viewports.length) {
      return;
    }

    function resetCarousels() {
      viewports.forEach((viewport) => {
        viewport.scrollLeft = 0;
      });
    }

    function syncCarouselFocusability() {
      viewports.forEach((viewport) => {
        viewport.tabIndex = viewport === lifeViewport || mobileViewport.matches ? 0 : -1;
      });
    }

    function updateLifeCarouselPosition() {
      positionFrame = 0;
      if (!lifeViewport || !lifePosition || !mobileViewport.matches) {
        return;
      }
      const cards = Array.from(lifeViewport.querySelectorAll(".tarot-life-current"));
      const viewportLeft = lifeViewport.getBoundingClientRect().left;
      const activeIndex = cards.reduce((closestIndex, card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - viewportLeft);
        const closestDistance = Math.abs(cards[closestIndex].getBoundingClientRect().left - viewportLeft);
        return distance < closestDistance ? index : closestIndex;
      }, 0);
      lifePosition.textContent = `${activeIndex + 1} of ${cards.length}`;
    }

    function schedulePositionUpdate() {
      if (!positionFrame) {
        positionFrame = window.requestAnimationFrame(updateLifeCarouselPosition);
      }
    }

    viewports.forEach((viewport) => {
      viewport.addEventListener("keydown", (event) => {
        const isAlwaysScrollable = viewport === lifeViewport;
        if ((!isAlwaysScrollable && !mobileViewport.matches) || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
          return;
        }

        const interactiveTarget = event.target.closest?.("a, button, input, textarea, select, [contenteditable='true']");
        if (interactiveTarget && interactiveTarget !== viewport) {
          return;
        }

        const track = viewport.querySelector("[data-mobile-card-carousel-track]");
        const firstCard = track?.firstElementChild;
        if (!track || !firstCard) {
          return;
        }

        const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
        const step = firstCard.getBoundingClientRect().width + gap;
        const direction = event.key === "ArrowRight" ? 1 : -1;
        event.preventDefault();
        viewport.scrollBy({
          left: direction * step,
          behavior: reducedMotion.matches ? "auto" : "smooth"
        });
      });
    });
    lifeViewport?.addEventListener("scroll", schedulePositionUpdate, { passive: true });

    syncCarouselFocusability();
    if (mobileViewport.matches) {
      resetCarousels();
    }
    updateLifeCarouselPosition();
    mobileViewport.addEventListener?.("change", () => {
      syncCarouselFocusability();
      resetCarousels();
      schedulePositionUpdate();
    });
    window.addEventListener("resize", schedulePositionUpdate, { passive: true });
  }

  const currentCard = getDetailCard(getRequestedSlug());
  updatePage(currentCard);
  enablePerspectiveTabs();
  enableMeaningStateToggle(currentCard);
  enableFaqAccordion();
  enableTilt();
  enableMobileCardCarousels();
  window.addEventListener("astralVeilBloodMoonChange", (event) => {
    const eventState = event.detail?.isActive;
    const isBloodMoon = typeof eventState === "boolean"
      ? eventState
      : document.body.classList.contains("blood-moon-mode");
    updateCardVariant(currentCard, isBloodMoon, { animate: true });
  });
  window.AstralVeilTarotCardDetails = {
    cards: detailCards,
    getDetailCard,
    getActiveCardVariant,
    updateCardVariant
  };
})();
