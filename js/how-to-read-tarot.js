(function () {
  "use strict";

  const root = document.querySelector(".how-to-read");
  if (!root) return;

  const howToReadTarotAssets = Object.freeze({
    regular: Object.freeze({
      prepareReading: { src: "/assets/images/how_to_read_tarot/regular/prepare_reading.png", width: 1122, height: 1402 },
      formQuestion: { src: "/assets/images/how_to_read_tarot/regular/form_question.png", width: 1122, height: 1402 },
      readImagery: { src: "/assets/images/how_to_read_tarot/regular/read_imagery.png", width: 1122, height: 1402 },
      understandSuitNumber: { src: "/assets/images/how_to_read_tarot/regular/understand_suit.png", width: 1122, height: 1402 },
      interpretPosition: { src: "/assets/images/how_to_read_tarot/regular/interpret_positions.png", width: 1122, height: 1402 },
      uprightReversed: { src: "/assets/images/how_to_read_tarot/regular/upright_vs_reversed.png", width: 1122, height: 1402 },
      connectCards: { src: "/assets/images/how_to_read_tarot/regular/connect_the_cards.png", width: 1448, height: 1086 },
      reflectIntegrate: { src: "/assets/images/how_to_read_tarot/regular/reflect_integrate.png", width: 1122, height: 1402 },
      beginReading: { src: "/assets/images/how_to_read_tarot/regular/begin_reading.png", width: 1672, height: 941 },
      exploreSpreads: { src: "/assets/images/how_to_read_tarot/regular/explore_spreads.png", width: 1672, height: 941 },
      browseMeanings: { src: "/assets/images/how_to_read_tarot/regular/browse_meanings.png", width: 1672, height: 941 },
      recordReflection: { src: "/assets/images/how_to_read_tarot/regular/record_reflection.png", width: 1672, height: 941 }
    }),
    bloodmoon: Object.freeze({
      prepareReading: { src: "/assets/images/how_to_read_tarot/bloodmoon/prepare_reading.png", width: 1122, height: 1402 },
      formQuestion: { src: "/assets/images/how_to_read_tarot/bloodmoon/form_question.png", width: 1122, height: 1402 },
      readImagery: { src: "/assets/images/how_to_read_tarot/bloodmoon/read_imagery.png", width: 1122, height: 1402 },
      understandSuitNumber: { src: "/assets/images/how_to_read_tarot/bloodmoon/understand_suit.png", width: 1122, height: 1402 },
      interpretPosition: { src: "/assets/images/how_to_read_tarot/bloodmoon/interpret_position.png", width: 1122, height: 1402 },
      uprightReversed: { src: "/assets/images/how_to_read_tarot/bloodmoon/upright_vs_reversed.png", width: 1122, height: 1402 },
      connectCards: { src: "/assets/images/how_to_read_tarot/bloodmoon/connect_cards.png", width: 1672, height: 941 },
      reflectIntegrate: { src: "/assets/images/how_to_read_tarot/bloodmoon/reflect_integrate.png", width: 1672, height: 941 },
      beginReading: { src: "/assets/images/how_to_read_tarot/bloodmoon/begin_reading.png", width: 1672, height: 941 },
      exploreSpreads: { src: "/assets/images/how_to_read_tarot/bloodmoon/explore_tarot_cards.png", width: 1672, height: 941 },
      browseMeanings: { src: "/assets/images/how_to_read_tarot/bloodmoon/browse_card_meaning.png", width: 1672, height: 941 },
      recordReflection: { src: "/assets/images/how_to_read_tarot/bloodmoon/record_reflection.png", width: 1672, height: 941 }
    })
  });
  const tarotLessons = Object.freeze([
    { id: "prepare-the-reading", aliases: ["prepare"], number: "01", phase: "Foundations", eyebrow: "Set the Intention", title: "Prepare the Reading", summary: "Begin with attention, a clear purpose, and a simple spread." },
    { id: "form-the-question", aliases: ["question"], number: "02", phase: "Foundations", eyebrow: "Create Useful Scope", title: "Form the Question", summary: "Shape an open, specific question that keeps choice and agency in view." },
    { id: "read-the-imagery", aliases: ["imagery"], number: "03", phase: "Foundations", eyebrow: "See Before You Define", title: "Read the Imagery", summary: "Observe figures, gestures, setting, color, objects, direction, and emotion before interpreting." },
    { id: "understand-suit-and-number", aliases: ["understand-suit-number", "suit-number"], number: "04", phase: "Interpretation", eyebrow: "The Deck’s Grammar", title: "Understand Suit + Number", summary: "Combine the suit’s realm with the number’s stage to compose a useful meaning." },
    { id: "interpret-the-position", aliases: ["position"], number: "05", phase: "Interpretation", eyebrow: "Meaning in Context", title: "Interpret the Position", summary: "Let the spread position decide which part of the question a card addresses." },
    { id: "upright-and-reversed", aliases: ["upright-reversed", "reversals"], number: "06", phase: "Interpretation", eyebrow: "Direction and Expression", title: "Upright + Reversed", summary: "Compare direct expression with energy that may be blocked, private, delayed, or internalized." },
    { id: "connect-the-cards", aliases: ["connect"], number: "07", phase: "Interpretation", eyebrow: "From Cards to Story", title: "Connect the Cards", summary: "Use repetition, concentration, direction, contradiction, and absence to read the whole spread." },
    { id: "reflect-and-integrate", aliases: ["reflect-integrate", "reflect"], number: "08", phase: "Integration", eyebrow: "Close the Reading", title: "Reflect + Integrate", summary: "Notice what changed, name what the reading suggested, and choose one grounded next step." },
    { id: "guided-practice", aliases: ["practice"], number: "09", phase: "Integration", eyebrow: "Put the Method Together", title: "Guided Practice", summary: "Read a Past, Present, and Future spread, then compare your synthesis with one example." }
  ]);
  const semanticLessonImages = Array.from(root.querySelectorAll("[data-htr-asset]"));
  const imageMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  function activeAssetTheme() {
    return document.body.classList.contains("blood-moon-mode") ? "bloodmoon" : "regular";
  }

  function setSemanticImageSource(image, asset) {
    if (!asset || image.getAttribute("src") === asset.src) return;
    if (!imageMotionPreference.matches && image.getAttribute("src")) image.classList.add("is-theme-switching");
    image.addEventListener("load", () => image.classList.remove("is-theme-switching"), { once: true });
    image.width = asset.width;
    image.height = asset.height;
    image.style.objectPosition = image.dataset.objectPosition || "center";
    image.setAttribute("src", asset.src);
  }

  function syncSemanticLessonImages() {
    const theme = activeAssetTheme();
    const lessonElements = Array.from(root.querySelectorAll("[data-course-lesson]"));
    const activeLesson = root.querySelector("[data-course-lesson].is-active");
    const activeIndex = Math.max(0, lessonElements.indexOf(activeLesson));
    semanticLessonImages.forEach((image) => {
      const owner = image.closest("[data-lesson]");
      const ownerIndex = lessonElements.indexOf(owner);
      const closeToActive = ownerIndex < 0 || Math.abs(ownerIndex - activeIndex) <= 1;
      if (!closeToActive) return;
      const asset = howToReadTarotAssets[theme][image.dataset.htrAsset];
      image.loading = ownerIndex === activeIndex ? "eager" : "lazy";
      image.setAttribute("fetchpriority", ownerIndex === activeIndex ? "high" : "low");
      setSemanticImageSource(image, asset);
    });
  }

  const levels = ["beginner", "intermediate", "advanced"];
  const levelTabs = Array.from(root.querySelectorAll("[data-level-tab]"));
  const levelPanels = Array.from(root.querySelectorAll("[data-level-panel]"));
  const levelCopy = Array.from(root.querySelectorAll("[data-level-copy]"));
  const levelStorageKey = "astralVeilTarotLearningLevel";
  let activeLevel = "beginner";
  let refreshActiveLessonHeight = () => {};
  let courseUiReady = false;

  function storedLevel() {
    try {
      const value = sessionStorage.getItem(levelStorageKey);
      return levels.includes(value) ? value : "";
    } catch (error) {
      return "";
    }
  }

  function setStoredLevel(level) {
    try { sessionStorage.setItem(levelStorageKey, level); } catch (error) { /* Storage is optional. */ }
  }

  function replaceLevelQuery(level) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("level", level);
    history.replaceState(history.state, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  }

  function updateLevel(level, options = {}) {
    if (!levels.includes(level)) return;
    const scrollY = window.scrollY;
    activeLevel = level;
    document.body.dataset.learningLevel = level;

    levelTabs.forEach((tab) => {
      const active = tab.dataset.levelTab === level;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    levelPanels.forEach((panel) => {
      const active = panel.dataset.levelPanel === level;
      panel.hidden = !active;
      if (active) panel.removeAttribute("inert");
      else panel.setAttribute("inert", "");
    });

    levelCopy.forEach((copy) => {
      const active = copy.dataset.levelCopy === level;
      copy.hidden = !active;
      if (active) copy.removeAttribute("inert");
      else copy.setAttribute("inert", "");
    });

    root.querySelectorAll("[data-practice-keyword]").forEach((keyword) => {
      keyword.hidden = level !== "beginner";
    });
    root.querySelector("[data-position-alternate]")?.toggleAttribute("hidden", level !== "advanced");
    setStoredLevel(level);
    if (options.updateUrl) replaceLevelQuery(level);
    if (courseUiReady) updateSelectedPreview();
    window.requestAnimationFrame(() => {
      refreshActiveLessonHeight();
      window.scrollTo({ top: scrollY, left: window.scrollX, behavior: "auto" });
    });
  }

  levelTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => updateLevel(tab.dataset.levelTab, { updateUrl: true }));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % levelTabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + levelTabs.length) % levelTabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = levelTabs.length - 1;
      else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateLevel(tab.dataset.levelTab, { updateUrl: true });
        return;
      } else return;
      event.preventDefault();
      levelTabs[nextIndex].focus();
      updateLevel(levelTabs[nextIndex].dataset.levelTab, { updateUrl: true });
    });
  });

  const queryLevel = new URLSearchParams(location.search).get("level");
  const legacyHashLevel = levels.includes(location.hash.slice(1)) ? location.hash.slice(1) : "";
  const directLevel = levels.includes(queryLevel) ? queryLevel : legacyHashLevel;
  updateLevel(directLevel || storedLevel() || "beginner");

  const questionExamples = {
    relationship: { vague: "Does this person love me?", clear: "What can I understand about the dynamic between us and my choices within it?" },
    career: { vague: "Will I get the job?", clear: "What can I focus on as I navigate this opportunity?" },
    decision: { vague: "Will this definitely happen?", clear: "What should I understand about the direction of this situation?" },
    growth: { vague: "When will I finally change?", clear: "What pattern can I work with as I choose my next step?" }
  };
  const questionSelect = root.querySelector("[data-question-select]");
  const questionResult = root.querySelector("[data-question-result]");
  const questionVague = root.querySelector("[data-question-vague]");
  const intentButtons = Array.from(root.querySelectorAll("[data-question-intent]"));

  function setQuestionIntent(intent) {
    const example = questionExamples[intent] || questionExamples.decision;
    if (questionSelect) questionSelect.value = intent;
    if (questionVague) questionVague.textContent = `“${example.vague}”`;
    if (questionResult) questionResult.textContent = example.clear;
    intentButtons.forEach((button) => {
      const selected = button.dataset.questionIntent === intent;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  questionSelect?.addEventListener("change", () => setQuestionIntent(questionSelect.value));
  intentButtons.forEach((button) => button.addEventListener("click", () => setQuestionIntent(button.dataset.questionIntent)));
  setQuestionIntent(questionSelect?.value || "decision");

  const observationContent = {
    figure: ["Figure", "Begin with the central presence", "Notice who occupies the scene, how they are dressed, and what role they seem to hold before naming an archetype."],
    gesture: ["Gesture", "Read the body before the symbol", "The figure’s posture, hands, and balance can suggest readiness, caution, openness, or uncertainty."],
    setting: ["Setting", "Let the environment establish context", "Describe the landscape, weather, horizon, and distance. Ask what the setting makes possible or difficult."],
    color: ["Color", "Notice where contrast gathers", "Look for dominant and accent colors, then notice where warmth, coolness, light, or shadow changes the emotional tone."],
    objects: ["Objects", "Inventory what the scene carries", "Name visible tools, plants, animals, clothing, and repeated shapes before assigning traditional meanings."],
    direction: ["Direction", "Follow the visual movement", "Trace where the figure looks, where lines point, and whether the card’s energy moves inward, outward, forward, or back."],
    emotion: ["Emotional response", "Include your response without treating it as proof", "Name the feeling that arrives, then return to visible evidence and ask which details may have created it."]
  };
  const observationStage = root.querySelector(".htr-observation");
  const observationButtons = Array.from(root.querySelectorAll("[data-observation]"));
  const observationLabel = root.querySelector("[data-observation-label]");
  const observationTitle = root.querySelector("[data-observation-title]");
  const observationCopy = root.querySelector("[data-observation-copy]");

  function setObservation(key) {
    const content = observationContent[key];
    if (!content) return;
    if (observationStage) observationStage.dataset.activeObservation = key;
    observationButtons.forEach((button) => button.setAttribute("aria-selected", String(button.dataset.observation === key)));
    if (observationLabel) observationLabel.textContent = content[0];
    if (observationTitle) observationTitle.textContent = content[1];
    if (observationCopy) observationCopy.textContent = content[2];
  }
  observationButtons.forEach((button) => button.addEventListener("click", () => setObservation(button.dataset.observation)));

  const suitContent = {
    wands: { name: "Wands", realm: "Action, creativity, or desire" },
    cups: { name: "Cups", realm: "Emotion, community, or connection" },
    swords: { name: "Swords", realm: "Thought, truth, or communication" },
    pentacles: { name: "Pentacles", realm: "Body, work, or resources" }
  };
  const numberContent = {
    1: { name: "Ace", phrase: "beginning to take form" },
    2: { name: "Two", phrase: "meeting a choice, balance, or counterpart" },
    3: { name: "Three", phrase: "growing through shared experience" },
    4: { name: "Four", phrase: "seeking structure, stability, or protection" },
    5: { name: "Five", phrase: "moving through tension, loss, or change" },
    6: { name: "Six", phrase: "finding exchange, adjustment, or renewed flow" },
    7: { name: "Seven", phrase: "being tested through assessment or persistence" },
    8: { name: "Eight", phrase: "gaining momentum through focus and repetition" },
    9: { name: "Nine", phrase: "approaching completion through independence or endurance" },
    10: { name: "Ten", phrase: "reaching culmination, legacy, or necessary release" }
  };
  const suitButtons = Array.from(root.querySelectorAll("[data-suit]"));
  const numberButtons = Array.from(root.querySelectorAll("[data-number]"));
  const suitNumberTitle = root.querySelector("[data-suit-number-title]");
  const suitNumberCopy = root.querySelector("[data-suit-number-copy]");
  let activeSuit = "wands";
  let activeNumber = "1";

  function updateSuitNumber() {
    const suit = suitContent[activeSuit];
    const number = numberContent[activeNumber];
    if (!suit || !number) return;
    suitButtons.forEach((button) => {
      const selected = button.dataset.suit === activeSuit;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    numberButtons.forEach((button) => {
      const selected = button.dataset.number === activeNumber;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    if (suitNumberTitle) suitNumberTitle.textContent = `${number.name} + ${suit.name}`;
    if (suitNumberCopy) suitNumberCopy.textContent = `${suit.realm} ${number.phrase}.`;
  }
  suitButtons.forEach((button) => button.addEventListener("click", () => { activeSuit = button.dataset.suit; updateSuitNumber(); }));
  numberButtons.forEach((button) => button.addEventListener("click", () => { activeNumber = button.dataset.number; updateSuitNumber(); }));
  updateSuitNumber();

  const positionMeanings = {
    past: ["The Star · Past", "Hope that shaped the present", "A period of healing, renewed trust, or clearer purpose may be an important foundation for the current situation.", "Alternatively, an earlier ideal may still be shaping expectations more strongly than present evidence."],
    present: ["The Star · Present", "A clear place to recover", "Renewal is available now through honesty, patience, and a willingness to reconnect with what feels meaningful.", "The card may also describe vulnerability: hope is present, but still needs protection and practical support."],
    advice: ["The Star · Advice", "Choose the honest horizon", "Let the next step be guided by clarity and restoration rather than urgency. Make room for a longer view.", "Advice may be to test an inspiring vision gently instead of turning it into an expectation."],
    challenge: ["The Star · Challenge", "Hope without avoidance", "The challenge is to remain open without using optimism to bypass grief, uncertainty, or practical constraints.", "A competing reading is that trust has become difficult, and the task is to rebuild it through small evidence."],
    outcome: ["The Star · Possible Outcome", "A direction of renewal", "Current patterns may lead toward greater clarity, confidence, and emotional spaciousness if care continues.", "This is a possible direction, not a promise; it depends on choices that support recovery and openness."]
  };
  const positionButtons = Array.from(root.querySelectorAll("[data-position]"));
  const positionTitle = root.querySelector("[data-position-title]");
  const positionCopy = root.querySelector("[data-position-copy]");
  const positionAlternate = root.querySelector("[data-position-alternate]");
  const positionStage = root.querySelector("[data-position-stage]");

  function setPosition(position) {
    const meaning = positionMeanings[position];
    if (!meaning) return;
    positionButtons.forEach((button) => {
      const selected = button.dataset.position === position;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    if (positionStage) positionStage.dataset.activePosition = position;
    const container = positionTitle?.closest(".htr-position-tool__meaning");
    const label = container?.querySelector("small");
    if (label) label.textContent = meaning[0];
    if (positionTitle) positionTitle.textContent = meaning[1];
    if (positionCopy) positionCopy.textContent = meaning[2];
    if (positionAlternate) positionAlternate.textContent = `Another plausible reading: ${meaning[3]}`;
  }
  positionButtons.forEach((button) => button.addEventListener("click", () => setPosition(button.dataset.position)));
  setPosition("past");

  const reversalCard = root.querySelector("[data-reversal-card]");
  const reversalTitle = root.querySelector("[data-reversal-title]");
  const reversalCopy = root.querySelector("[data-reversal-copy]");
  const orientationButtons = Array.from(root.querySelectorAll("[data-orientation]"));
  const reversalCardToggle = root.querySelector("[data-reversal-card-toggle]");

  function setOrientation(orientation) {
    const reversed = orientation === "reversed";
    orientationButtons.forEach((choice) => {
      const selected = choice.dataset.orientation === orientation;
      choice.classList.toggle("is-active", selected);
      choice.setAttribute("aria-pressed", String(selected));
    });
    reversalCard?.classList.toggle("is-reversed", reversed);
    reversalCardToggle?.setAttribute("aria-pressed", String(reversed));
    if (reversalTitle) reversalTitle.textContent = reversed ? "Energy turned inward" : "Focused expression";
    if (reversalCopy) reversalCopy.textContent = reversed
      ? "Skill or intention may be blocked, scattered, private, underused, or directed toward an unclear aim."
      : "Skill, attention, and available resources are moving directly toward an intention.";
  }
  orientationButtons.forEach((button) => button.addEventListener("click", () => setOrientation(button.dataset.orientation)));
  reversalCardToggle?.addEventListener("click", () => setOrientation(reversalCard?.classList.contains("is-reversed") ? "upright" : "reversed"));

  const patternContent = {
    repetition: { label: "Repetition", title: "A shared number carries weight", copy: "The two Threes echo growth and development across emotional and active realms.", cards: [0, 3] },
    concentration: { label: "Concentration", title: "The center holds the pressure", copy: "The Moon and Two of Swords concentrate uncertainty and deliberation in the middle of the spread.", cards: [1, 2] },
    direction: { label: "Direction", title: "Movement travels across the spread", copy: "The figures and horizons invite the eye from shared feeling toward uncertainty, decision, and outward expansion.", cards: [0, 1, 2, 3] },
    contradiction: { label: "Contradiction", title: "Openness meets restraint", copy: "Celebration and expansion sit beside uncertainty and guarded choice, creating a meaningful tension rather than one fixed answer.", cards: [0, 2, 3] },
    absence: { label: "Absence", title: "What is missing also shapes the reading", copy: "Pentacles are absent, so practical resources, the body, or grounded follow-through may need conscious attention.", cards: [] }
  };
  const patternStage = root.querySelector(".htr-connection-stage");
  const patternButtons = Array.from(root.querySelectorAll("[data-pattern]"));
  const patternCards = Array.from(root.querySelectorAll("[data-pattern-card]"));
  const patternLabel = root.querySelector("[data-pattern-label]");
  const patternTitle = root.querySelector("[data-pattern-title]");
  const patternCopy = root.querySelector("[data-pattern-copy]");

  function setPattern(pattern) {
    const content = patternContent[pattern];
    if (!content) return;
    if (patternStage) patternStage.dataset.activePattern = pattern;
    patternButtons.forEach((button) => {
      const selected = button.dataset.pattern === pattern;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    patternCards.forEach((card, index) => {
      const highlighted = content.cards.includes(index);
      card.classList.toggle("is-highlighted", highlighted);
      card.classList.toggle("is-quiet", content.cards.length > 0 && !highlighted);
    });
    if (patternLabel) patternLabel.textContent = content.label;
    if (patternTitle) patternTitle.textContent = content.title;
    if (patternCopy) patternCopy.textContent = content.copy;
  }
  patternButtons.forEach((button) => button.addEventListener("click", () => setPattern(button.dataset.pattern)));
  setPattern("repetition");

  const reflectionPrompts = {
    notice: "What image, phrase, or feeling continues to hold your attention?",
    name: "What did the reading suggest without claiming certainty?",
    choose: "What grounded action remains yours to take?"
  };
  const reflectionButtons = Array.from(root.querySelectorAll("[data-reflection-stage]"));
  const reflectionPrompt = root.querySelector("[data-reflection-prompt]");
  function setReflectionStage(stage) {
    reflectionButtons.forEach((button) => {
      const selected = button.dataset.reflectionStage === stage;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    if (reflectionPrompt) reflectionPrompt.textContent = reflectionPrompts[stage] || reflectionPrompts.notice;
  }
  reflectionButtons.forEach((button) => button.addEventListener("click", () => setReflectionStage(button.dataset.reflectionStage)));

  function enableRovingRail(buttons) {
    if (!buttons.length) return;
    const isSelected = (button) => button.getAttribute("aria-selected") === "true" || button.getAttribute("aria-pressed") === "true";
    const syncTabStops = (activeButton) => buttons.forEach((button) => { button.tabIndex = button === activeButton ? 0 : -1; });
    syncTabStops(buttons.find(isSelected) || buttons[0]);
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => syncTabStops(button));
      button.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % buttons.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = buttons.length - 1;
        else return;
        event.preventDefault();
        event.stopPropagation();
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      });
    });
  }
  function connectTabPanel(buttons, panel, idPrefix) {
    if (!buttons.length || !panel) return;
    panel.id ||= `${idPrefix}-panel`;
    panel.setAttribute("role", "tabpanel");
    const syncLabel = (button) => panel.setAttribute("aria-labelledby", button.id);
    buttons.forEach((button, index) => {
      button.id ||= `${idPrefix}-tab-${index + 1}`;
      button.setAttribute("aria-controls", panel.id);
      button.addEventListener("click", () => syncLabel(button));
    });
    syncLabel(buttons.find((button) => button.getAttribute("aria-selected") === "true") || buttons[0]);
  }
  [intentButtons, observationButtons, suitButtons, numberButtons, positionButtons, orientationButtons, patternButtons, reflectionButtons].forEach(enableRovingRail);
  connectTabPanel(observationButtons, root.querySelector(".htr-observation__explanation"), "observation");
  connectTabPanel(numberButtons, root.querySelector(".htr-suit-interpretation"), "suit-number");
  connectTabPanel(positionButtons, root.querySelector(".htr-position-tool__meaning"), "position");
  connectTabPanel(patternButtons, root.querySelector(".htr-pattern-explanation"), "pattern");
  connectTabPanel(reflectionButtons, reflectionPrompt, "reflection");

  const promptCopy = {
    imagery: "What visual detail draws your eye first, and how does the feeling change from card to card?",
    structure: "Where do Cups, Major Arcana, and Wands appear—and how does that sequence move from feeling to character to action?",
    position: "How does memory shape the Past, courage shape the Present, and expansion become a possible Future?",
    patterns: "What changes across the elements, colors, figures, and directions of movement? What is noticeably absent?",
    story: "Tell the spread as one unfolding sentence. Where does the story begin, turn, and open outward?"
  };
  const promptTabs = Array.from(root.querySelectorAll("[data-practice-prompt]"));
  const activePrompt = root.querySelector("[data-practice-prompt-copy]");
  promptTabs.forEach((button) => button.addEventListener("click", () => {
    promptTabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
    if (activePrompt) activePrompt.textContent = promptCopy[button.dataset.practicePrompt];
  }));
  enableRovingRail(promptTabs);
  connectTabPanel(promptTabs, activePrompt, "practice-prompt");

  const insightByLevel = {
    beginner: "The Six of Cups places memory and familiar feeling in the past. Strength asks for patient courage now. The Three of Wands suggests that this steadiness can support a wider future.",
    intermediate: "The spread moves from Water to a Major Arcana center and then Fire: emotion and memory are gathered into deliberate inner strength before becoming outward expansion. The central card regulates the transition.",
    advanced: "One narrative moves from nostalgia through self-regulation toward expansion. Another warns that an idealized past may be managed through restraint before ambition resumes. The missing Swords and Pentacles may suggest that analysis and practical grounding need conscious attention."
  };
  const practiceInput = root.querySelector("[data-practice-input]");
  const practiceInsight = root.querySelector("[data-practice-insight]");
  const insightCopy = root.querySelector("[data-practice-insight-copy]");
  const practiceCardButtons = Array.from(root.querySelectorAll("[data-practice-card]"));
  const practiceCardFrames = Array.from(root.querySelectorAll("[data-practice-card-frame]"));
  const practiceRotateButtons = Array.from(root.querySelectorAll("[data-practice-rotate]"));

  practiceCardButtons.forEach((cardButton) => {
    const frame = cardButton.closest("[data-practice-card-frame]");
    cardButton.addEventListener("click", () => {
      const enlarged = !frame?.classList.contains("is-enlarged");
      practiceCardFrames.forEach((item) => item.classList.remove("is-enlarged"));
      practiceCardButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
      frame?.classList.toggle("is-enlarged", enlarged);
      cardButton.setAttribute("aria-expanded", String(enlarged));
    });
  });
  practiceRotateButtons.forEach((button) => button.addEventListener("click", () => {
    const frame = button.closest("[data-practice-card-frame]");
    const rotated = !frame?.classList.contains("is-rotated");
    frame?.classList.toggle("is-rotated", rotated);
    button.setAttribute("aria-pressed", String(rotated));
  }));
  root.querySelector("[data-practice-reveal]")?.addEventListener("click", () => {
    if (insightCopy) insightCopy.textContent = insightByLevel[activeLevel];
    if (practiceInsight) {
      practiceInsight.hidden = false;
      practiceInsight.focus({ preventScroll: true });
    }
  });
  root.querySelector("[data-practice-reset]")?.addEventListener("click", () => {
    if (practiceInput) practiceInput.value = "";
    if (practiceInsight) practiceInsight.hidden = true;
    practiceCardFrames.forEach((frame) => {
      frame.classList.remove("is-enlarged", "is-rotated");
    });
    practiceCardButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
    practiceRotateButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    promptTabs[0]?.click();
  });

  const themeImages = Array.from(root.querySelectorAll("[data-htr-theme-image]"));
  function syncThemeImages() {
    const blood = document.body.classList.contains("blood-moon-mode");
    themeImages.forEach((image) => {
      const source = blood ? image.dataset.bloodSrc : image.dataset.standardSrc;
      if (source && image.getAttribute("src") !== source) image.setAttribute("src", source);
    });
    syncSemanticLessonImages();
  }
  new MutationObserver(syncThemeImages).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  syncThemeImages();
  window.AstralVeilCardTilt?.initialize(root);

  const learningExperience = root.querySelector("[data-learning-experience]");
  const learningGuide = root.querySelector("[data-learning-guide]");
  const lessonView = root.querySelector("[data-learning-lesson-view]");
  const constellationMap = root.querySelector("[data-constellation-map]");
  const constellationTravelLayer = root.querySelector("[data-constellation-travel-layer]");
  const constellationVignette = root.querySelector("[data-constellation-vignette]");
  const constellationVignetteVeil = root.querySelector("[data-constellation-vignette-veil]");
  const lessonTravelLight = root.querySelector("[data-lesson-travel-light]");
  const courseLessons = Array.from(root.querySelectorAll("[data-course-lesson]"));
  const starList = root.querySelector("[data-lesson-stars]");
  const previewProgress = root.querySelector("[data-preview-progress]");
  const previewPhase = root.querySelector("[data-preview-phase]");
  const previewTitle = root.querySelector("[data-preview-title]");
  const previewSummary = root.querySelector("[data-preview-summary]");
  const openPreviewButton = root.querySelector("[data-open-preview]");
  const beginPathButton = root.querySelector("[data-begin-path]");
  const continuePathButton = root.querySelector("[data-continue-path]");
  const guideCompletion = root.querySelector("[data-guide-completion]");
  const courseProgress = root.querySelector("[data-course-progress]");
  const coursePrevious = root.querySelector("[data-course-previous]");
  const courseNext = root.querySelector("[data-course-next]");
  const bottomPrevious = root.querySelector("[data-course-bottom-previous]");
  const bottomNext = root.querySelector("[data-course-bottom-next]");
  const previousTitle = root.querySelector("[data-course-previous-title]");
  const nextTitle = root.querySelector("[data-course-next-title]");
  const courseBackButtons = Array.from(root.querySelectorAll("[data-course-back]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileTravelViewport = window.matchMedia("(max-width: 820px)");
  const compactTravelViewport = window.matchMedia("(max-width: 400px)");
  const lessonTravelTiming = Object.freeze({
    desktop: Object.freeze({ awaken: 140, travel: 520, guideExit: 190, reveal: 210, scale: 2.18 }),
    mobile: Object.freeze({ awaken: 110, travel: 420, guideExit: 160, reveal: 170, scale: 1.7 }),
    compact: Object.freeze({ awaken: 100, travel: 400, guideExit: 150, reveal: 160, scale: 1.58 }),
    reduced: Object.freeze({ guideExit: 80, reveal: 100, scale: 1 })
  });
  const travelEasing = "cubic-bezier(0.22, 0.78, 0.22, 1)";
  const portalEasing = "cubic-bezier(0.16, 0.84, 0.24, 1)";
  const lastLessonStorageKey = "astralVeilTarotLastLesson";
  const visitedLessonStorageKey = "astralVeilTarotVisitedLessons";
  const completedPathStorageKey = "astralVeilTarotPathComplete";
  let selectedLessonIndex = 0;
  let activeCourseIndex = -1;
  let originStar = null;
  let starButtons = [];
  let lastVisitedIndex = -1;
  let visitedLessonIndexes = new Set();
  let isTraveling = false;
  let travelRunId = 0;
  let courseLocationFrame = 0;
  const activeTravelAnimations = new Set();
  const travelControlStates = new Map();

  function readSessionValue(key) {
    try { return sessionStorage.getItem(key) || ""; } catch (error) { return ""; }
  }

  function writeSessionValue(key, value) {
    try { sessionStorage.setItem(key, value); } catch (error) { /* Progress memory is optional. */ }
  }

  function readCourseProgress() {
    const storedLast = Number.parseInt(readSessionValue(lastLessonStorageKey), 10);
    lastVisitedIndex = Number.isInteger(storedLast) && storedLast >= 0 && storedLast < tarotLessons.length ? storedLast : -1;
    try {
      const storedVisited = JSON.parse(readSessionValue(visitedLessonStorageKey) || "[]");
      visitedLessonIndexes = new Set(storedVisited.filter((index) => Number.isInteger(index) && index >= 0 && index < tarotLessons.length));
    } catch (error) {
      visitedLessonIndexes = new Set();
    }
  }

  function storeCourseProgress() {
    writeSessionValue(lastLessonStorageKey, String(lastVisitedIndex));
    writeSessionValue(visitedLessonStorageKey, JSON.stringify(Array.from(visitedLessonIndexes)));
  }

  function lessonIndexFromHash() {
    let hashId = "";
    try { hashId = decodeURIComponent(location.hash.slice(1)); } catch (error) { hashId = location.hash.slice(1); }
    if (!hashId) return -1;
    return tarotLessons.findIndex((lesson) => lesson.id === hashId || lesson.aliases.includes(hashId));
  }

  function courseUrl(hash = "") {
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = hash;
    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  }

  function writeCourseUrl(hash, mode) {
    if (mode === "none") return;
    const method = mode === "replace" ? "replaceState" : "pushState";
    history[method]({ ...(history.state || {}), tarotLesson: hash || null }, "", courseUrl(hash));
  }

  function currentLessonTravelTiming() {
    if (reducedMotion.matches) return lessonTravelTiming.reduced;
    if (compactTravelViewport.matches) return lessonTravelTiming.compact;
    if (mobileTravelViewport.matches) return lessonTravelTiming.mobile;
    return lessonTravelTiming.desktop;
  }

  function isActiveTravelRun(runId) {
    return isTraveling && runId === travelRunId;
  }

  function lessonTravelControls() {
    return [
      openPreviewButton,
      beginPathButton,
      continuePathButton,
      coursePrevious,
      courseNext,
      bottomPrevious,
      bottomNext,
      ...courseBackButtons
    ].filter(Boolean);
  }

  function lockLessonTravelControls() {
    lessonTravelControls().forEach((button) => {
      if (!travelControlStates.has(button)) travelControlStates.set(button, button.getAttribute("aria-disabled"));
      button.setAttribute("aria-disabled", "true");
      button.dataset.lessonTravelDisabled = "true";
    });
  }

  function unlockLessonTravelControls() {
    travelControlStates.forEach((ariaDisabled, button) => {
      if (ariaDisabled === null) button.removeAttribute("aria-disabled");
      else button.setAttribute("aria-disabled", ariaDisabled);
      delete button.dataset.lessonTravelDisabled;
    });
    travelControlStates.clear();
    if (activeCourseIndex >= 0) updateCourseNavigation(activeCourseIndex);
  }

  function createTravelAnimation(element, keyframes, options) {
    if (!element || typeof element.animate !== "function") throw new Error("Lesson travel animation is unavailable.");
    const animation = element.animate(keyframes, { fill: "both", ...options });
    activeTravelAnimations.add(animation);
    return animation;
  }

  function cancelTravelAnimation(animation) {
    try { animation.cancel(); } catch (error) { /* A finished animation may already be detached. */ }
    activeTravelAnimations.delete(animation);
  }

  function cancelAllTravelAnimations() {
    Array.from(activeTravelAnimations).forEach(cancelTravelAnimation);
  }

  async function waitForTravelAnimations(animations) {
    await Promise.all(animations.map((animation) => animation.finished));
    animations.forEach(cancelTravelAnimation);
  }

  function getStarTravelCoordinates(star) {
    const marker = star?.querySelector(".lesson-star__marker") || star;
    if (!marker || !constellationMap || !constellationTravelLayer) return null;
    const markerRect = marker.getBoundingClientRect();
    const mapRect = constellationMap.getBoundingClientRect();
    const layerRect = constellationTravelLayer.getBoundingClientRect();
    if (!markerRect.width || !markerRect.height || !mapRect.width || !mapRect.height || !layerRect.width || !layerRect.height) return null;

    const markerCenterX = markerRect.left + markerRect.width / 2;
    const markerCenterY = markerRect.top + markerRect.height / 2;
    const coordinates = {
      x: mapRect.left + mapRect.width / 2 - markerCenterX,
      y: mapRect.top + mapRect.height / 2 - markerCenterY,
      lightX: markerCenterX - mapRect.left,
      lightY: markerCenterY - mapRect.top,
      originX: markerCenterX - layerRect.left,
      originY: markerCenterY - layerRect.top
    };
    return Object.values(coordinates).every(Number.isFinite) ? coordinates : null;
  }

  function setLessonTravelCoordinates(coordinates, scale) {
    if (!constellationMap) return;
    constellationMap.style.setProperty("--travel-x", `${coordinates.x}px`);
    constellationMap.style.setProperty("--travel-y", `${coordinates.y}px`);
    constellationMap.style.setProperty("--travel-light-x", `${coordinates.lightX}px`);
    constellationMap.style.setProperty("--travel-light-y", `${coordinates.lightY}px`);
    constellationMap.style.setProperty("--travel-origin-x", `${coordinates.originX}px`);
    constellationMap.style.setProperty("--travel-origin-y", `${coordinates.originY}px`);
    constellationMap.style.setProperty("--travel-scale", String(scale));
  }

  function clearMapTravelVisuals() {
    constellationMap?.classList.remove("is-awakening", "is-traveling");
    learningGuide?.classList.remove("is-exiting");
    starButtons.forEach((button) => button.classList.remove("is-travel-target"));
    ["--travel-x", "--travel-y", "--travel-light-x", "--travel-light-y", "--travel-origin-x", "--travel-origin-y", "--travel-scale"].forEach((property) => {
      constellationMap?.style.removeProperty(property);
    });
  }

  function clearLessonTravelState() {
    cancelAllTravelAnimations();
    clearMapTravelVisuals();
    lessonView?.classList.remove("is-travel-revealing");
    if (lessonView?.dataset.lessonTravelFocusHandoff === "true") {
      lessonView.removeAttribute("tabindex");
      delete lessonView.dataset.lessonTravelFocusHandoff;
    }
    learningExperience?.removeAttribute("data-lesson-traveling");
    unlockLessonTravelControls();
    isTraveling = false;
  }

  function cancelLessonTravel() {
    if (!isTraveling && !activeTravelAnimations.size) return;
    travelRunId += 1;
    clearLessonTravelState();
  }

  function focusLessonRevealHandoff() {
    if (!lessonView) return;
    lessonView.tabIndex = -1;
    lessonView.dataset.lessonTravelFocusHandoff = "true";
    lessonView.focus({ preventScroll: true });
  }

  async function animateStarAwakening(star, timing) {
    const marker = star.querySelector(".lesson-star__marker");
    const core = star.querySelector(".lesson-star__core");
    if (!marker || !core || !lessonTravelLight || !constellationMap) throw new Error("Lesson star travel target is incomplete.");
    const coreStart = getComputedStyle(core).transform === "none" ? "scale(1)" : getComputedStyle(core).transform;
    const markerStart = getComputedStyle(marker).transform === "none" ? "scale(1)" : getComputedStyle(marker).transform;
    constellationMap.classList.add("is-awakening");

    const animations = [
      createTravelAnimation(core, [{ transform: coreStart }, { transform: "scale(1.5)" }], { duration: timing.awaken, easing: portalEasing }),
      createTravelAnimation(marker, [{ transform: markerStart, opacity: .84 }, { transform: "scale(1.12)", opacity: 1 }], { duration: timing.awaken, easing: portalEasing }),
      createTravelAnimation(lessonTravelLight, [
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0) scale(.3)", opacity: 0 },
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0) scale(1.6)", opacity: .62 }
      ], { duration: timing.awaken, easing: portalEasing })
    ];
    const pathTargets = [
      constellationTravelLayer?.querySelector(".htr-constellation__lines path"),
      constellationTravelLayer?.querySelector(".htr-constellation__mobile-path")
    ].filter((element) => element && getComputedStyle(element).display !== "none");
    pathTargets.forEach((path) => {
      animations.push(createTravelAnimation(path, [{ opacity: .58 }, { opacity: 1 }], { duration: timing.awaken, easing: "ease-out" }));
    });
    await waitForTravelAnimations(animations);
  }

  async function animateConstellationTravel(star, coordinates, timing) {
    if (!constellationMap || !constellationTravelLayer || !constellationVignette || !constellationVignetteVeil || !lessonTravelLight || !learningGuide) {
      throw new Error("Lesson travel layers are unavailable.");
    }
    const marker = star.querySelector(".lesson-star__marker");
    const core = star.querySelector(".lesson-star__core");
    const copy = star.querySelector(".lesson-star__copy");
    if (!marker || !core || !copy) throw new Error("Lesson star travel target is incomplete.");

    constellationMap.classList.remove("is-awakening");
    constellationMap.classList.add("is-traveling");
    learningGuide.classList.add("is-exiting");
    const targetTransform = `translate3d(${coordinates.x}px, ${coordinates.y}px, 0) scale(${timing.scale})`;
    const targetLightTransform = `translate(-50%, -50%) translate3d(${coordinates.x}px, ${coordinates.y}px, 0) scale(5)`;
    const targetVignetteTransform = `translate(-50%, -50%) translate3d(${coordinates.x}px, ${coordinates.y}px, 0)`;
    const guideHoldOffset = Math.max(0, Math.min(1, (timing.travel - timing.guideExit) / timing.travel));
    const animationOptions = { duration: timing.travel, easing: travelEasing };
    const animations = [
      createTravelAnimation(constellationTravelLayer, [
        { transform: "translate3d(0, 0, 0) scale(1)" },
        { transform: targetTransform }
      ], animationOptions),
      createTravelAnimation(lessonTravelLight, [
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0) scale(1.6)", opacity: .62 },
        { transform: targetLightTransform, opacity: 1 }
      ], { duration: timing.travel, easing: portalEasing }),
      createTravelAnimation(constellationVignette, [{ opacity: 0 }, { opacity: 1 }], animationOptions),
      createTravelAnimation(constellationVignetteVeil, [
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0)" },
        { transform: targetVignetteTransform }
      ], animationOptions),
      createTravelAnimation(marker, [{ transform: "scale(1.12)", opacity: 1 }, { transform: "scale(1.08)", opacity: 1 }], animationOptions),
      createTravelAnimation(core, [{ transform: "scale(1.5)" }, { transform: "scale(1.65)" }], { duration: timing.travel, easing: portalEasing }),
      createTravelAnimation(copy, [{ opacity: 1 }, { opacity: .12 }], {
        duration: timing.travel * .55,
        delay: timing.travel * .35,
        easing: "ease-in"
      }),
      createTravelAnimation(learningGuide, [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: guideHoldOffset, easing: "ease" },
        { opacity: 0, offset: 1 }
      ], { duration: timing.travel, easing: "linear" })
    ];

    const fadeTargets = [
      constellationTravelLayer.querySelector(".htr-constellation__phase-labels"),
      constellationTravelLayer.querySelector(".htr-constellation__lines"),
      constellationTravelLayer.querySelector(".htr-constellation__mobile-path"),
      ...Array.from(constellationTravelLayer.querySelectorAll(".htr-constellation__node")).filter((node) => !node.contains(star))
    ].filter((element) => element && getComputedStyle(element).display !== "none");
    fadeTargets.forEach((element) => {
      const targetOpacity = element.classList.contains("htr-constellation__node")
        ? .05
        : element.classList.contains("htr-constellation__mobile-path") ? .08 : .1;
      animations.push(createTravelAnimation(element, [{ opacity: 1 }, { opacity: targetOpacity }], animationOptions));
    });
    await waitForTravelAnimations(animations);
  }

  async function animateReducedGuideExit(timing) {
    if (!learningGuide) throw new Error("Learning guide is unavailable.");
    learningGuide.classList.remove("is-entering");
    learningGuide.classList.add("is-exiting");
    await waitForTravelAnimations([
      createTravelAnimation(learningGuide, [{ opacity: 1 }, { opacity: 0 }], { duration: timing.guideExit, easing: "ease" })
    ]);
  }

  async function animateLessonReveal(index, timing) {
    const heading = courseLessons[index]?.querySelector("h2");
    if (!lessonView || !heading) throw new Error("Lesson reveal target is unavailable.");
    const animations = [
      createTravelAnimation(lessonView, [{ opacity: 0 }, { opacity: 1 }], { duration: timing.reveal, easing: "ease-out" })
    ];
    if (!reducedMotion.matches) {
      animations.push(createTravelAnimation(heading.closest(".htr-course-lesson__header") || heading, [
        { transform: "translate3d(0, 8px, 0)" },
        { transform: "translate3d(0, 0, 0)" }
      ], { duration: timing.reveal, easing: portalEasing }));
    }
    await waitForTravelAnimations(animations);
  }

  function createStarButton(lesson, index) {
    const item = document.createElement("li");
    item.className = "htr-constellation__node";
    const button = document.createElement("button");
    button.className = "lesson-star";
    button.type = "button";
    button.dataset.lessonStar = String(index);
    button.dataset.lessonId = lesson.id;
    button.setAttribute("aria-label", `Open lesson ${index + 1}: ${lesson.title}`);
    button.setAttribute("aria-pressed", "false");

    const marker = document.createElement("span");
    marker.className = "lesson-star__marker";
    marker.setAttribute("aria-hidden", "true");
    const core = document.createElement("span");
    core.className = "lesson-star__core";
    marker.append(core);

    const copy = document.createElement("span");
    copy.className = "lesson-star__copy";
    const number = document.createElement("span");
    number.className = "lesson-star__number";
    number.textContent = lesson.number;
    const title = document.createElement("span");
    title.className = "lesson-star__title";
    title.textContent = lesson.title;
    const descriptor = document.createElement("span");
    descriptor.className = "lesson-star__descriptor";
    descriptor.textContent = lesson.eyebrow;
    copy.append(number, title, descriptor);
    button.append(marker, copy);
    item.append(button);
    return { item, button };
  }

  function buildConstellation() {
    if (!starList) return;
    const fragment = document.createDocumentFragment();
    starButtons = tarotLessons.map((lesson, index) => {
      const { item, button } = createStarButton(lesson, index);
      fragment.append(item);
      button.addEventListener("click", () => travelToLesson(index, button));
      button.addEventListener("focus", () => selectLesson(index));
      button.addEventListener("mouseenter", () => selectLesson(index));
      return button;
    });
    starList.replaceChildren(fragment);
  }

  function currentLevelSummary(index) {
    const levelGuidance = courseLessons[index]?.querySelector(`[data-level-copy="${activeLevel}"] p`);
    return levelGuidance?.textContent?.trim() || tarotLessons[index]?.summary || "";
  }

  function updateSelectedPreview() {
    const lesson = tarotLessons[selectedLessonIndex];
    if (!lesson) return;
    if (previewProgress) previewProgress.textContent = `Lesson ${lesson.number} of 09`;
    if (previewPhase) previewPhase.textContent = lesson.phase;
    if (previewTitle) previewTitle.textContent = lesson.title;
    if (previewSummary) previewSummary.textContent = currentLevelSummary(selectedLessonIndex);
  }

  function refreshStarStates() {
    starButtons.forEach((button, index) => {
      const selected = index === selectedLessonIndex;
      button.classList.toggle("is-selected", selected);
      button.classList.toggle("is-visited", visitedLessonIndexes.has(index));
      button.classList.toggle("is-last-visited", index === lastVisitedIndex);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function selectLesson(index, options = {}) {
    if (isTraveling && !options.force) return;
    if (index < 0 || index >= tarotLessons.length) return;
    selectedLessonIndex = index;
    updateSelectedPreview();
    refreshStarStates();
  }

  function updateContinueButton() {
    if (!continuePathButton) return;
    const available = lastVisitedIndex >= 0 && lastVisitedIndex < tarotLessons.length;
    continuePathButton.hidden = !available;
    if (available) continuePathButton.textContent = `Continue Lesson ${tarotLessons[lastVisitedIndex].number}`;
  }

  function markLessonVisited(index) {
    lastVisitedIndex = index;
    visitedLessonIndexes.add(index);
    storeCourseProgress();
    updateContinueButton();
    refreshStarStates();
  }

  function updateCourseNavigation(index) {
    const lesson = tarotLessons[index];
    if (!lesson) return;
    if (courseProgress) courseProgress.textContent = `Lesson ${lesson.number} of 09`;
    const atStart = index === 0;
    const atEnd = index === tarotLessons.length - 1;
    if (coursePrevious) coursePrevious.disabled = atStart;
    if (bottomPrevious) bottomPrevious.disabled = atStart;
    if (previousTitle) previousTitle.textContent = atStart ? "Start of the path" : tarotLessons[index - 1].title;
    if (courseNext) courseNext.textContent = atEnd ? "Complete the Path" : "Next →";
    if (nextTitle) nextTitle.textContent = atEnd ? "Complete the Path" : tarotLessons[index + 1].title;
  }

  function setActiveCourseLesson(index) {
    courseLessons.forEach((lesson, lessonIndex) => {
      const active = lessonIndex === index;
      lesson.hidden = !active;
      lesson.classList.toggle("is-active", active);
      if (active) lesson.removeAttribute("inert");
      else lesson.setAttribute("inert", "");
    });
  }

  function focusLessonHeading(index) {
    const heading = courseLessons[index]?.querySelector("h2");
    heading?.focus({ preventScroll: true });
  }

  function scrollLearningExperience(behavior = reducedMotion.matches ? "auto" : "smooth") {
    learningExperience?.scrollIntoView({ behavior, block: "start" });
  }

  function openLesson(index, options = {}) {
    if (index < 0 || index >= tarotLessons.length || !learningGuide || !lessonView) return false;
    const wasGuideVisible = !learningGuide.hidden;
    if (wasGuideVisible) originStar = starButtons[index] || originStar;
    selectedLessonIndex = index;
    activeCourseIndex = index;
    markLessonVisited(index);
    setActiveCourseLesson(index);
    updateSelectedPreview();
    updateCourseNavigation(index);

    learningGuide.hidden = true;
    learningGuide.setAttribute("inert", "");
    lessonView.hidden = false;
    lessonView.removeAttribute("inert");
    lessonView.classList.remove("is-entering");
    if (!options.deferEntryAnimation) window.requestAnimationFrame(() => lessonView.classList.add("is-entering"));

    const mode = options.historyMode || "push";
    writeCourseUrl(tarotLessons[index].id, mode);
    syncSemanticLessonImages();
    window.AstralVeilCardTilt?.initialize(courseLessons[index]);

    window.requestAnimationFrame(() => {
      if (options.scroll !== false) scrollLearningExperience(options.scrollBehavior);
      if (options.focus !== false) focusLessonHeading(index);
    });
    return true;
  }

  async function travelToLesson(index, sourceElement) {
    if (isTraveling || index < 0 || index >= tarotLessons.length) return;
    selectLesson(index);
    const star = starButtons[index];
    if (learningGuide?.hidden) {
      if (activeCourseIndex !== index) openLesson(index);
      return;
    }
    const canAnimate = star
      && constellationMap
      && constellationTravelLayer
      && constellationVignette
      && constellationVignetteVeil
      && lessonTravelLight
      && learningGuide
      && lessonView
      && typeof constellationTravelLayer.animate === "function";
    if (!canAnimate) {
      openLesson(index);
      return;
    }

    const timing = currentLessonTravelTiming();
    const coordinates = reducedMotion.matches ? null : getStarTravelCoordinates(star);
    if (!reducedMotion.matches && !coordinates) {
      openLesson(index);
      return;
    }

    const runId = ++travelRunId;
    let hashWritten = false;
    let lessonOpened = false;
    isTraveling = true;
    originStar = sourceElement?.matches?.("[data-lesson-star]") ? sourceElement : star;
    learningExperience?.setAttribute("data-lesson-traveling", "true");
    learningGuide.classList.remove("is-entering");
    star.classList.add("is-travel-target");
    if (coordinates) setLessonTravelCoordinates(coordinates, timing.scale);
    lockLessonTravelControls();

    try {
      writeCourseUrl(tarotLessons[index].id, "push");
      hashWritten = true;

      if (reducedMotion.matches) {
        await animateReducedGuideExit(timing);
      } else {
        await animateStarAwakening(star, timing);
        if (!isActiveTravelRun(runId)) return;
        await animateConstellationTravel(star, coordinates, timing);
      }
      if (!isActiveTravelRun(runId)) return;

      lessonView.classList.add("is-travel-revealing");
      lessonOpened = openLesson(index, {
        historyMode: "none",
        scroll: false,
        focus: false,
        deferEntryAnimation: true
      });
      if (!lessonOpened) throw new Error("Lesson view could not be opened.");
      lockLessonTravelControls();
      clearMapTravelVisuals();
      scrollLearningExperience("auto");
      focusLessonRevealHandoff();
      await animateLessonReveal(index, timing);
      if (!isActiveTravelRun(runId)) return;
      lessonView.classList.remove("is-travel-revealing");
      focusLessonHeading(index);
    } catch (error) {
      if (!isActiveTravelRun(runId)) return;
      clearLessonTravelState();
      if (lessonOpened) {
        scrollLearningExperience("auto");
        focusLessonHeading(index);
      } else {
        openLesson(index, { historyMode: hashWritten ? "none" : "push" });
      }
      return;
    } finally {
      if (isActiveTravelRun(runId)) clearLessonTravelState();
    }
  }

  function showGuide(options = {}) {
    if (!learningGuide || !lessonView) return;
    if (isTraveling) cancelLessonTravel();
    if (activeCourseIndex >= 0) selectLesson(activeCourseIndex);
    activeCourseIndex = -1;
    lessonView.hidden = true;
    lessonView.setAttribute("inert", "");
    lessonView.classList.remove("is-entering", "is-travel-revealing");
    learningGuide.hidden = false;
    learningGuide.removeAttribute("inert");
    learningGuide.classList.remove("is-entering");
    window.requestAnimationFrame(() => {
      if (!isTraveling && !learningGuide.hidden) learningGuide.classList.add("is-entering");
    });

    if (options.completed) {
      tarotLessons.forEach((lesson, index) => visitedLessonIndexes.add(index));
      writeSessionValue(completedPathStorageKey, "true");
      storeCourseProgress();
      if (guideCompletion) guideCompletion.hidden = false;
      refreshStarStates();
    }
    writeCourseUrl("", options.historyMode || "push");
    window.requestAnimationFrame(() => {
      if (options.scroll !== false) scrollLearningExperience();
      if (options.focus !== false) (originStar || starButtons[selectedLessonIndex])?.focus({ preventScroll: true });
    });
  }

  function goToPreviousLesson() {
    if (isTraveling) return;
    if (activeCourseIndex > 0) openLesson(activeCourseIndex - 1);
  }

  function goToNextLesson() {
    if (isTraveling) return;
    if (activeCourseIndex < 0) return;
    if (activeCourseIndex === tarotLessons.length - 1) {
      showGuide({ completed: true });
      return;
    }
    openLesson(activeCourseIndex + 1);
  }

  function syncCourseFromLocation(options = {}) {
    cancelLessonTravel();
    let hashId = "";
    try { hashId = decodeURIComponent(location.hash.slice(1)); } catch (error) { hashId = location.hash.slice(1); }
    const index = lessonIndexFromHash();
    if (index >= 0) {
      openLesson(index, { historyMode: "none", focus: options.focus, scroll: options.scroll });
      return;
    }
    if (levels.includes(hashId)) updateLevel(hashId);
    if (hashId) {
      showGuide({ historyMode: "none", focus: false, scroll: false });
      return;
    }
    showGuide({ historyMode: "none", focus: options.focus, scroll: options.scroll });
  }

  function scheduleCourseLocationSync() {
    if (courseLocationFrame) return;
    courseLocationFrame = window.requestAnimationFrame(() => {
      courseLocationFrame = 0;
      syncCourseFromLocation({ focus: true });
    });
  }

  readCourseProgress();
  buildConstellation();
  courseUiReady = true;
  selectLesson(lastVisitedIndex >= 0 ? lastVisitedIndex : 0);
  updateContinueButton();
  if (guideCompletion && readSessionValue(completedPathStorageKey) === "true") guideCompletion.hidden = false;

  beginPathButton?.addEventListener("click", () => travelToLesson(0, beginPathButton));
  continuePathButton?.addEventListener("click", () => travelToLesson(lastVisitedIndex >= 0 ? lastVisitedIndex : 0, continuePathButton));
  openPreviewButton?.addEventListener("click", () => travelToLesson(selectedLessonIndex, openPreviewButton));
  courseBackButtons.forEach((button) => button.addEventListener("click", () => {
    if (!isTraveling) showGuide();
  }));
  coursePrevious?.addEventListener("click", goToPreviousLesson);
  courseNext?.addEventListener("click", goToNextLesson);
  bottomPrevious?.addEventListener("click", goToPreviousLesson);
  bottomNext?.addEventListener("click", goToNextLesson);
  window.addEventListener("popstate", scheduleCourseLocationSync);
  window.addEventListener("hashchange", scheduleCourseLocationSync);

  const initialLessonIndex = lessonIndexFromHash();
  if (initialLessonIndex >= 0) {
    openLesson(initialLessonIndex, { historyMode: "none", focus: false, scroll: false });
  } else {
    showGuide({ historyMode: "none", focus: false, scroll: false });
  }
})();
