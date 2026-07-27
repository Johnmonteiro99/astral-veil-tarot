(function () {
  if (document.documentElement.dataset.tarotTopicInitialized === "true") return;
  document.documentElement.dataset.tarotTopicInitialized = "true";

  const themeImages = Array.from(document.querySelectorAll("[data-topic-theme-image]"));
  const faqButtons = Array.from(document.querySelectorAll("[data-topic-faq-button]"));
  const orientationRoot = document.querySelector("[data-topic-orientation]");
  const orientationDataElement = document.querySelector("#tarot-topic-orientation-data");
  const topicRibbonTrack = document.querySelector(".tarot-topic-ribbon__track");
  const activeTopicRibbonItem = topicRibbonTrack?.querySelector('[aria-current="page"]');

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
      const width = Number(useBloodMoon ? image.dataset.bloodWidth : image.dataset.standardWidth);
      const height = Number(useBloodMoon ? image.dataset.bloodHeight : image.dataset.standardHeight);
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
        if (alt) image.alt = alt;
        if (width > 0) image.width = width;
        if (height > 0) image.height = height;
      });
    });
  }

  function positionActiveTopicInRibbon() {
    if (!topicRibbonTrack
      || !activeTopicRibbonItem
      || !window.matchMedia("(max-width: 820px)").matches) return;

    const maximumScroll = Math.max(0, topicRibbonTrack.scrollWidth - topicRibbonTrack.clientWidth);
    if (maximumScroll <= 1) {
      topicRibbonTrack.scrollLeft = 0;
      return;
    }

    const trackRect = topicRibbonTrack.getBoundingClientRect();
    const activeRect = activeTopicRibbonItem.getBoundingClientRect();
    const activeCenter = activeRect.left - trackRect.left + topicRibbonTrack.scrollLeft + (activeRect.width / 2);
    const desiredScroll = activeCenter - (topicRibbonTrack.clientWidth / 2);
    topicRibbonTrack.scrollLeft = Math.min(maximumScroll, Math.max(0, desiredScroll));
  }

  function setFaqState(button, expanded) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;
    button.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
  }

  function initializeOrientationToggle() {
    if (!orientationRoot || !orientationDataElement) return;

    let states;
    try {
      states = JSON.parse(orientationDataElement.textContent || "{}");
    } catch (error) {
      return;
    }

    const options = Array.from(orientationRoot.querySelectorAll("[data-topic-orientation-option]"));
    const frame = orientationRoot.querySelector("[data-topic-orientation-frame]");
    const card = orientationRoot.querySelector("[data-topic-orientation-card]");
    const stateLabel = orientationRoot.querySelector("[data-topic-orientation-state-label]");
    const title = orientationRoot.querySelector("[data-topic-orientation-title]");
    const copy = orientationRoot.querySelector("[data-topic-orientation-copy]");
    const concepts = orientationRoot.querySelector("[data-topic-orientation-concepts]");
    if (!options.length || !frame || !card || !stateLabel || !title || !copy || !concepts) return;
    const orientationCardTitle = card.getAttribute("aria-label")
      ?.replace(/^Drag to tilt /, "")
      .replace(/\s+(?:upright|reversed) example$/, "")
      || "tarot card";

    function setOrientation(nextOrientation) {
      const state = states[nextOrientation];
      if (!state || orientationRoot.dataset.topicOrientation === nextOrientation) return;

      const reversed = nextOrientation === "reversed";
      orientationRoot.dataset.topicOrientation = nextOrientation;
      frame.classList.toggle("tarot-topic-orientation-card__frame--upright", !reversed);
      frame.classList.toggle("tarot-topic-orientation-card__frame--reversed", reversed);
      card.setAttribute("aria-label", `Drag to tilt ${orientationCardTitle} ${nextOrientation} example`);
      stateLabel.textContent = reversed ? "Reversed" : "Upright";
      title.textContent = state.label;
      copy.textContent = state.copy;
      concepts.replaceChildren(...state.concepts.map((concept) => {
        const item = document.createElement("li");
        const ornament = document.createElement("span");
        ornament.setAttribute("aria-hidden", "true");
        ornament.textContent = "✦";
        item.append(ornament, document.createTextNode(concept));
        return item;
      }));
      options.forEach((option) => {
        const active = option.dataset.topicOrientationOption === nextOrientation;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-pressed", String(active));
      });
      window.AstralVeilCardTilt?.reset(card);
    }

    options.forEach((option, index) => {
      option.addEventListener("click", () => setOrientation(option.dataset.topicOrientationOption));
      option.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const target = options[(index + direction + options.length) % options.length];
        target.focus();
        setOrientation(target.dataset.topicOrientationOption);
      });
    });
  }

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      faqButtons.forEach((candidate) => setFaqState(candidate, candidate === button && willOpen));
    });
  });

  window.addEventListener("astralVeilBloodMoonChange", updateThemeImages);
  window.addEventListener("load", positionActiveTopicInRibbon, { once: true });
  initializeOrientationToggle();
  window.AstralVeilCardTilt?.initialize(document);
  updateThemeImages();
  window.requestAnimationFrame(() => window.requestAnimationFrame(positionActiveTopicInRibbon));
})();
