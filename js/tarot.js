(function () {
  const suitOrder = ["wands", "cups", "swords", "pentacles"];
  const filters = [
    { label: "All Cards", value: "all" },
    { label: "Major Arcana", value: "major" },
    { label: "Minor Arcana", value: "minor" },
    { label: "Wands", value: "wands" },
    { label: "Cups", value: "cups" },
    { label: "Swords", value: "swords" },
    { label: "Pentacles", value: "pentacles" }
  ];
  const tarotQuestionPaths = [
    { key: "love", title: "Love & Relationships", description: "Explore tarot meanings for love, connection, trust, distance, reconciliation, and harmony.", route: "/tarot/topics/love-relationships/", available: true, regularImage: "/assets/images/background%20_images/love-relationships.png", bloodMoonImage: "/assets/images/background%20_images/bloodmoon-love-relationships.png", alt: "Astral Veil artwork representing love, relationships, and emotional connection" },
    { key: "career", title: "Career & Purpose", description: "Gain clarity with tarot meanings for career: your work, direction, opportunities, ambition, and next steps.", route: "/tarot/topics/career-purpose/", available: true, regularImage: "/assets/images/background%20_images/career-purpose.png", bloodMoonImage: "/assets/images/background%20_images/bloodmoon-career-purpose.png", alt: "Astral Veil artwork representing career, purpose, ambition, and direction" },
    { key: "feelings", title: "Feelings & Intentions", description: "Uncover hidden feelings, developing emotions, motives, and tarot cards as feelings and intentions behind them.", route: "/tarot/topics/feelings-intentions/", available: true, regularImage: "/assets/images/background%20_images/feelings-intuitions.png", bloodMoonImage: "/assets/images/background%20_images/bloodmoon-feelings-intuitions.png", alt: "Astral Veil artwork representing hidden feelings, emotions, motives, and intentions" },
    { key: "advice", title: "Advice & Personal Growth", description: "Receive tarot advice to evolve, heal, overcome challenges, and step into your power.", route: "/tarot/topics/advice-personal-growth/", available: true, regularImage: "/assets/images/background%20_images/advice-personal-growth.png", bloodMoonImage: "/assets/images/background%20_images/bloodmoon-advice-personal-growth.png", alt: "Astral Veil artwork representing guidance, healing, growth, and personal power" },
    { key: "spiritual", title: "Spiritual Guidance", description: "Explore meaning, intuition, practice, discernment, and grounded spiritual reflection through Tarot.", route: "/tarot/topics/spiritual-guidance/", available: true, regularImage: "/assets/images/background%20_images/upright-reverse.png", bloodMoonImage: "/assets/images/background%20_images/upright-reverse.png", alt: "A contemplative figure beneath quiet constellations reflected in moonlit water" }
  ];
  const tarotGuides = [
    { key: "history", eyebrow: "The Chronicle of the Cards", title: "The History of Tarot", description: "Trace tarot from its early life as a European card game through symbolism, divination, reflection, and modern practice.", route: "/tarot/history/", available: true, ctaLabel: "Explore Tarot History", image: "/assets/images/background%20_images/history-of-tarot.png", imageAlt: "A candlelit archive of antique tarot cards, books, and a tall stained-glass window", imageWidth: 1122, imageHeight: 1402, imageAspect: "portrait", imageFit: "cover", objectPosition: "58% center", layoutSize: "featured" },
    { key: "beginners", title: "Tarot for Beginners", description: "Learn the structure of the deck, basic card meanings, and the foundations of your first reading.", route: "/tarot/for-beginners", available: false, image: "/assets/images/background%20_images/tarot-for-beginners.png", imageAlt: "A tarot deck, candle, crystals, and open guidebook arranged for a first reading", imageWidth: 1448, imageHeight: 1086, imageAspect: "landscape", imageFit: "cover", objectPosition: "68% center", layoutSize: "standard" },
    { key: "how-to-read", title: "How to Read Tarot Cards", description: "Learn how to form a question, choose a spread, draw cards, and interpret their message.", route: "/tarot/how-to-read", available: false, image: "/assets/images/background%20_images/how-to-read-tarot.png", imageAlt: "Hands arranging tarot cards beside candles and crystals during a reading", imageWidth: 1448, imageHeight: 1086, imageAspect: "landscape", imageFit: "cover", objectPosition: "70% center", layoutSize: "standard" },
    { key: "major-arcana", title: "Major Arcana Explained", description: "Explore the twenty-two archetypes, turning points, and transformations of the Major Arcana.", route: "/tarot/major-arcana/", available: true, ctaLabel: "Explore the Major Arcana", image: "/assets/images/background%20_images/major-arcana-explained.png", imageAlt: "A cloaked figure standing before a luminous celestial arch", imageWidth: 1448, imageHeight: 1086, imageAspect: "landscape", imageFit: "cover", objectPosition: "70% center", layoutSize: "standard" },
    { key: "minor-arcana", title: "Minor Arcana Explained", description: "Understand the four suits, court cards, numbers, and everyday experiences of the Minor Arcana.", route: "/tarot/minor-arcana/", available: true, ctaLabel: "Explore the Minor Arcana", image: "/assets/images/background%20_images/minor-arcana-explained.png", imageAlt: "Four symbolic tarot cards arranged beside a candle and ritual objects", imageWidth: 1448, imageHeight: 1086, imageAspect: "landscape", imageFit: "cover", objectPosition: "38% 62%", layoutSize: "standard" },
    { key: "spreads", title: "Tarot Spreads", description: "Discover layouts for daily guidance, love, career, reflection, decisions, and deeper insight. Learn how card positions shape a reading and choose a spread that matches your question.", route: "/tarot-spreads/", available: true, ctaLabel: "Explore Tarot Spreads", image: "/assets/images/background%20_images/tarot-spreads.png", imageAlt: "Multiple tarot spreads arranged across a candlelit midnight cloth", imageWidth: 1672, imageHeight: 941, imageAspect: "wide", imageFit: "cover", objectPosition: "58% center", layoutSize: "wide" },
    { key: "tarot-vs-oracle", title: "Tarot vs. Oracle Cards", description: "Compare Tarot’s structured archetypes and traditional meanings with Oracle cards’ flexible, deck-specific symbolism and reading styles.", route: "/tarot/compare/tarot-vs-oracle-cards/", available: true, ctaLabel: "Compare Tarot and Oracle", image: "/assets/images/background%20_images/tarot-vs-oracle-cards.png", imageAlt: "Tarot and oracle cards arranged together beneath a crescent moon", imageWidth: 1672, imageHeight: 941, imageAspect: "wide", imageFit: "cover", objectPosition: "52% center", layoutSize: "comparison", imageSide: "left" },
    { key: "tarot-vs-lenormand", title: "Tarot vs. Lenormand", description: "Explore the differences between tarot’s archetypes and Lenormand’s direct symbolic language.", route: "/tarot/compare/tarot-vs-lenormand/", available: true, ctaLabel: "Compare Tarot and Lenormand", image: "/assets/images/background%20_images/tarot-vs-lenormand.png", imageAlt: "Tarot cards and Lenormand cards arranged side by side on a celestial cloth", imageWidth: 1672, imageHeight: 941, imageAspect: "wide", imageFit: "cover", objectPosition: "58% center", layoutSize: "comparison", imageSide: "right" }
  ];

  const slugify = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
  const getSuit = (card) => suitOrder.find((suit) => card.name.toLowerCase().endsWith(`of ${suit}`)) || null;
  const isMajor = (card) => !getSuit(card);
  const normalizeKeywords = (value) => Array.isArray(value) ? value.join(", ") : String(value || "");
  const keywordList = (value, count = 3) => normalizeKeywords(value).split(/,\s*/).map((keyword) => keyword.trim()).filter(Boolean).slice(0, count);
  const excerpt = (value, length = 230) => {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (text.length <= length) return text;
    const shortened = text.slice(0, length);
    return `${shortened.slice(0, shortened.lastIndexOf(" "))}…`;
  };
  const baseCardId = (card) => String(card?.originalCardId || card?.id || "").replace(/^astral-veil-crimson-/, "");
  const legacyDeckSlug = /^(?:major|wands|cups|swords|pentacles)-\d{2}-(.+)$/;
  const cardSlug = (card) => {
    const canonicalPath = String(card?.canonicalPath || card?.route || "").trim();
    const canonicalMatch = canonicalPath.match(/^\/tarot\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
    if (canonicalMatch && !legacyDeckSlug.test(canonicalMatch[1])) return canonicalMatch[1];
    const configuredSlug = String(card?.slug || "").trim();
    if (configuredSlug && !legacyDeckSlug.test(configuredSlug)) return configuredSlug;
    return slugify(card?.name);
  };
  const getCardDetailUrl = (card) => card?.canonicalPath || card?.route || `/tarot/${cardSlug(card)}/`;
  const keywordTokens = (value) => {
    const values = Array.isArray(value) ? value : String(value || "").split(/[,;·]|\bor\b/i);
    return values
      .map((keyword) => String(keyword || "").replace(/^(and|or)\s+/i, "").replace(/[.!?]+$/, "").trim().toLowerCase())
      .filter(Boolean);
  };

  const sourceCards = Array.isArray(window.astralVeilTarotCards) ? window.astralVeilTarotCards : [];
  const veilfallSourceCards = Array.isArray(window.astralVeilCrimsonCards) ? window.astralVeilCrimsonCards : [];
  const veilfallCardsById = new Map(veilfallSourceCards.map((card) => [baseCardId(card), card]));
  const cards = sourceCards
    .map((card) => ({
      ...card,
      images: {
        veilrise: card.image,
        veilfall: veilfallCardsById.get(baseCardId(card))?.image || card.image
      },
      slug: cardSlug(card),
      route: getCardDetailUrl(card),
      meaningPageAvailable: Boolean(cardSlug(card))
    }))
    .sort((first, second) => {
      const firstSuit = getSuit(first);
      const secondSuit = getSuit(second);
      if (!firstSuit && !secondSuit) return Number(first.number) - Number(second.number);
      if (!firstSuit) return -1;
      if (!secondSuit) return 1;
      const suitDifference = suitOrder.indexOf(firstSuit) - suitOrder.indexOf(secondSuit);
      return suitDifference || Number(first.number) - Number(second.number);
    });

  const state = {
    query: "",
    filter: "all",
    selectedIndex: 0,
    visibleCards: cards,
    isBloodMoon: document.body.classList.contains("blood-moon-mode")
  };
  const searchInput = document.querySelector("[data-tarot-search]");
  const searchForm = document.querySelector("[data-tarot-search-form]");
  const filterBar = document.querySelector("[data-tarot-filters]");
  const browserSection = document.querySelector("[data-tarot-browser]");
  const carouselStage = document.querySelector("[data-carousel-stage]");
  const carousel = document.querySelector("[data-tarot-carousel]");
  const previousButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");
  const positionWrap = document.querySelector("[data-carousel-position-wrap]");
  const position = document.querySelector("[data-carousel-position]");
  const detail = document.querySelector("[data-card-detail]");
  const eyebrow = document.querySelector("[data-card-eyebrow]");
  const title = document.querySelector("[data-card-title]");
  const keywords = document.querySelector("[data-card-keywords]");
  const teaser = document.querySelector("[data-card-teaser]");
  const summary = document.querySelector("[data-card-summary]");
  const readMeaningButton = document.querySelector("[data-read-meaning]");
  const emptyState = document.querySelector("[data-empty-state]");
  const codexBackdrop = document.querySelector("[data-tarot-codex-backdrop]");
  const codex = document.querySelector("[data-tarot-codex]");
  const codexCloseButton = document.querySelector("[data-close-tarot-codex]");
  const codexTiltButton = document.querySelector("[data-tarot-codex-tilt]");
  const codexImage = document.querySelector("[data-tarot-codex-image]");
  const codexEyebrow = document.querySelector("[data-tarot-codex-eyebrow]");
  const codexTitle = document.querySelector("[data-tarot-codex-title]");
  const codexDescription = document.querySelector("[data-tarot-codex-description]");
  const codexUpright = document.querySelector("[data-tarot-codex-upright]");
  const codexReversed = document.querySelector("[data-tarot-codex-reversed]");
  const codexUprightLabel = document.getElementById("tarot-codex-upright-label");
  const codexReversedLabel = document.getElementById("tarot-codex-reversed-label");
  const codexReflectionBlock = document.querySelector("[data-tarot-codex-reflection-block]");
  const codexReflection = document.querySelector("[data-tarot-codex-reflection]");
  const codexMeaningLink = document.querySelector("[data-tarot-codex-meaning-link]");
  const codexMeaningComingSoon = document.querySelector("[data-tarot-codex-meaning-coming-soon]");
  const questionPathCarousel = document.querySelector("[data-question-carousel]");
  const questionPathTrack = questionPathCarousel?.querySelector(".tarot-question-carousel__track");
  const questionPathViewport = document.querySelector("[data-question-carousel-viewport]");
  const questionPathPrevious = document.querySelector("[data-question-carousel-prev]");
  const questionPathNext = document.querySelector("[data-question-carousel-next]");
  const questionPathViewer = document.querySelector("[data-tarot-image-viewer]");
  const questionPathViewerImage = document.querySelector("[data-tarot-image-viewer-image]");
  const questionPathViewerTitle = document.querySelector("[data-tarot-image-viewer-title]");
  const questionPathViewerCaption = document.querySelector("[data-tarot-image-viewer-caption]");
  const tarotGuidesGrid = document.querySelector("[data-tarot-guides-grid]");
  const tarotFaq = document.querySelector("[data-tarot-faq]");
  const tarotFaqList = document.querySelector("[data-tarot-faq-list]");
  let lastCodexTrigger = null;
  let codexCloseTimer = 0;
  let scrollTimer = 0;
  let questionPathThemeIsBloodMoon = null;
  let lastQuestionPathImageTrigger = null;

  function configureQuestionPaths(isBloodMoon = document.body.classList.contains("blood-moon-mode")) {
    const pathsByKey = new Map(tarotQuestionPaths.map((path) => [path.key, path]));
    document.querySelectorAll("[data-tarot-question-path]").forEach((item) => {
      const path = pathsByKey.get(item.dataset.tarotQuestionPath);
      const content = item.querySelector("[data-question-path-content]");
      const image = item.querySelector("[data-question-path-image]");
      const imageButton = item.querySelector("[data-question-path-image-button]");
      if (!path || !image || !imageButton) return;
      const imageSource = isBloodMoon ? path.bloodMoonImage : path.regularImage;
      const imageWidth = isBloodMoon ? 1122 : 1024;
      const imageHeight = isBloodMoon ? 1402 : 1536;
      if (image.getAttribute("src") !== imageSource) image.src = imageSource;
      image.width = imageWidth;
      image.height = imageHeight;
      image.alt = path.alt;
      if (!path.available || !content) return;
      const link = content.matches("a") ? content : document.createElement("a");
      link.className = "tarot-question-path__link";
      link.href = path.route;
      link.setAttribute("aria-label", `${path.title}: ${path.description}`);
      if (link !== content) {
        while (content.firstChild) link.append(content.firstChild);
        content.replaceWith(link);
      }
      item.dataset.available = "true";
    });
  }

  function updateQuestionPathCarouselControls() {
    if (!questionPathViewport) return;
    const maxScroll = Math.max(0, questionPathViewport.scrollWidth - questionPathViewport.clientWidth);
    const hasOverflow = maxScroll > 1;
    questionPathPrevious && (questionPathPrevious.disabled = !hasOverflow || questionPathViewport.scrollLeft <= 1);
    questionPathNext && (questionPathNext.disabled = !hasOverflow || questionPathViewport.scrollLeft >= maxScroll - 1);
  }

  function updateQuestionPathThemeImages(force = false) {
    const isBloodMoon = document.body.classList.contains("blood-moon-mode");
    if (!force && questionPathThemeIsBloodMoon === isBloodMoon) return;
    questionPathThemeIsBloodMoon = isBloodMoon;
    configureQuestionPaths(isBloodMoon);
    if (questionPathViewer?.open && lastQuestionPathImageTrigger) {
      const image = lastQuestionPathImageTrigger.querySelector("[data-question-path-image]");
      if (image && questionPathViewerImage) {
        questionPathViewerImage.src = image.currentSrc || image.src;
        questionPathViewerImage.alt = image.alt;
      }
    }
    updateQuestionPathCarouselControls();
  }

  function openQuestionPathViewer(trigger) {
    const image = trigger.querySelector("[data-question-path-image]");
    const pathKey = trigger.closest("[data-tarot-question-path]")?.dataset.tarotQuestionPath;
    const path = tarotQuestionPaths.find((item) => item.key === pathKey);
    if (!questionPathViewer || !questionPathViewerImage || !image || !path) return;

    lastQuestionPathImageTrigger = trigger;
    questionPathViewerImage.src = image.currentSrc || image.src;
    questionPathViewerImage.alt = image.alt;
    questionPathViewerTitle.textContent = path.title;
    questionPathViewerCaption.textContent = path.description;
    if (!questionPathViewer.open) questionPathViewer.showModal();
    window.requestAnimationFrame(() => questionPathViewer.querySelector("[data-close-tarot-image-viewer]")?.focus({ preventScroll: true }));
  }

  function closeQuestionPathViewer() {
    if (questionPathViewer?.open) questionPathViewer.close();
  }

  function renderTarotGuides() {
    if (!tarotGuidesGrid || tarotGuidesGrid.dataset.initialized === "true") return;
    tarotGuidesGrid.dataset.initialized = "true";
    tarotGuidesGrid.innerHTML = tarotGuides.map((guide) => {
      const media = `<img class="tarot-guide__image tarot-guide__image--${escapeHtml(guide.imageFit)}" src="${escapeHtml(guide.image)}" alt="${escapeHtml(guide.imageAlt)}" width="${guide.imageWidth}" height="${guide.imageHeight}" loading="lazy" decoding="async" style="--guide-image-position:${escapeHtml(guide.objectPosition)}">`;
      const status = guide.available ? (guide.ctaLabel || "Explore Guide") : "Coming Soon";
      const statusArrow = guide.key === "spreads" && guide.available ? ' <span aria-hidden="true">→</span>' : "";
      const content = `<div class="tarot-guide__content">${guide.eyebrow ? `<p class="tarot-guide__eyebrow">${escapeHtml(guide.eyebrow)}</p>` : ""}<h3>${escapeHtml(guide.title)}</h3><p class="tarot-guide__description">${escapeHtml(guide.description)}</p><p class="tarot-guide__status">${escapeHtml(status)}${statusArrow}</p></div>`;
      const body = `<div class="tarot-guide__media tarot-guide__media--${escapeHtml(guide.imageAspect)}">${media}</div>${content}`;
      const accessibleTitle = `${guide.title}: ${guide.description}`;
      const imageSideClass = guide.layoutSize === "comparison" ? ` tarot-guide--image-${escapeHtml(guide.imageSide || "right")}` : "";
      return `<article class="tarot-guide tarot-guide--${escapeHtml(guide.layoutSize)}${imageSideClass}" data-tarot-guide="${escapeHtml(guide.key)}" data-route="${escapeHtml(guide.route)}" data-available="${guide.available}">${guide.available ? `<a class="tarot-guide__link" href="${escapeHtml(guide.route)}" aria-label="${escapeHtml(accessibleTitle)}">${body}</a>` : body}</article>`;
    }).join("");
  }

  function initializeTarotFaq() {
    if (!tarotFaq || !tarotFaqList || tarotFaq.dataset.initialized === "true") return;
    tarotFaq.dataset.initialized = "true";
    const items = Array.from(tarotFaqList.querySelectorAll("[data-tarot-faq-item]"));
    const setItemState = (item, isOpen) => {
      const trigger = item.querySelector(".tarot-faq__trigger");
      const answer = item.querySelector(".tarot-faq__answer");
      const icon = item.querySelector("[data-tarot-faq-icon]");
      item.classList.toggle("is-open", isOpen);
      trigger?.setAttribute("aria-expanded", String(isOpen));
      answer?.setAttribute("aria-hidden", String(!isOpen));
      if (answer) answer.inert = !isOpen;
      if (icon) icon.textContent = isOpen ? "−" : "+";
    };

    tarotFaq.classList.add("is-enhanced");
    items.forEach((item) => setItemState(item, false));
    tarotFaqList.addEventListener("click", (event) => {
      const trigger = event.target.closest(".tarot-faq__trigger");
      if (!trigger || !tarotFaqList.contains(trigger)) return;
      const item = trigger.closest("[data-tarot-faq-item]");
      if (!item) return;
      const shouldOpen = !item.classList.contains("is-open");
      items.forEach((entry) => setItemState(entry, false));
      if (shouldOpen) setItemState(item, true);
    });
  }

  const reversedText = (card) => card.reversed?.keywords || card.reversed?.shadow || card.shadowMeaning || "A blocked or inward expression of this card’s energy.";

  function bloodMoonKeywords(card) {
    const bloodMoon = card.bloodMoon || {};
    const sources = [
      bloodMoon.keywords,
      card.shadowKeywords,
      card.reversedKeywords,
      card.reversed?.keywords,
      card.shadowMeaning,
      card.reversed?.shadow,
      bloodMoon.reversed?.shadow,
      card.keywords
    ];
    const resolved = [];
    sources.forEach((source) => {
      keywordTokens(source).forEach((keyword) => {
        if (!resolved.includes(keyword)) resolved.push(keyword);
      });
    });
    return resolved.slice(0, 4);
  }

  function bloodMoonSummary(card) {
    const bloodMoon = card.bloodMoon || {};
    if (bloodMoon.summary) {
      const parts = [bloodMoon.summary];
      [bloodMoon.shadowMessage, bloodMoon.reversed?.summary].forEach((part) => {
        const wordCount = parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 35 && part && !parts.includes(part)) parts.push(part);
      });
      return parts.join(" ");
    }
    return card.shadowDescription
      || card.reversedDescription
      || bloodMoon.reversed?.meaning
      || card.reversed?.meaning
      || card.shadowMeaning
      || card.summary;
  }

  function bloodMoonTeaser(card) {
    const bloodMoon = card.bloodMoon || {};
    return bloodMoon.teaser
      || card.shadowPrompt
      || bloodMoon.reversed?.reflection
      || bloodMoon.reversed?.veilHint
      || bloodMoon.veilHint
      || card.reflectionQuestion
      || bloodMoon.shortMeaning
      || card.shortMeaning;
  }

  function cardDisplay(card, isBloodMoon = state.isBloodMoon) {
    const deckName = isBloodMoon ? "Veilfall Arcana" : "Veilrise Arcana";
    if (isBloodMoon) {
      return {
        image: card.images?.veilfall || card.images?.veilrise || card.image,
        imageAlt: `${card.name} from the ${deckName} tarot deck`,
        deckName,
        keywords: bloodMoonKeywords(card),
        teaser: bloodMoonTeaser(card),
        summary: bloodMoonSummary(card)
      };
    }
    return {
      image: card.images?.veilrise || card.image,
      imageAlt: `${card.name} from the ${deckName} tarot deck`,
      deckName,
      keywords: keywordList(card.keywords),
      teaser: card.shortMeaning || card.uprightMeaning || card.upright?.summary,
      summary: card.summary || card.uprightMeaning || card.upright?.meaning
    };
  }

  function getSearchText(card) {
    const bloodMoon = card.bloodMoon || {};
    const identity = [card.name, isMajor(card) ? "major arcana" : "minor arcana", getSuit(card), card.archetype, card.energy];
    const regular = [
      normalizeKeywords(card.themes),
      normalizeKeywords(card.keywords),
      normalizeKeywords(card.upright?.keywords),
      card.shortMeaning,
      card.summary,
      card.uprightMeaning,
      card.upright?.summary,
      card.upright?.meaning,
      card.reflectionQuestion
    ];
    const shadow = [
      normalizeKeywords(bloodMoonKeywords(card)),
      normalizeKeywords(card.reversed?.keywords),
      card.shadowMeaning,
      card.reversed?.summary,
      card.reversed?.meaning,
      card.reversed?.shadow,
      bloodMoon.shortMeaning,
      bloodMoon.summary,
      bloodMoon.shadowMessage,
      bloodMoon.veilHint,
      bloodMoon.upright?.headline,
      bloodMoon.upright?.summary,
      bloodMoon.upright?.meaning,
      bloodMoon.upright?.shadow,
      bloodMoon.upright?.reflection,
      bloodMoon.reversed?.headline,
      bloodMoon.reversed?.summary,
      bloodMoon.reversed?.meaning,
      bloodMoon.reversed?.shadow,
      bloodMoon.reversed?.reflection,
      bloodMoon.reversed?.veilHint
    ];
    return [...identity, ...(state.isBloodMoon ? shadow : regular), ...(state.isBloodMoon ? regular : shadow)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function renderFilters() {
    filterBar.innerHTML = filters.map((filter) => `<button class="tarot-filter${filter.value === state.filter ? " is-active" : ""}" type="button" data-filter="${filter.value}" aria-pressed="${filter.value === state.filter}">${filter.label}</button>`).join("");
  }

  function matchesFilter(card) {
    if (state.filter === "all") return true;
    if (state.filter === "major") return isMajor(card);
    if (state.filter === "minor") return !isMajor(card);
    return getSuit(card) === state.filter;
  }

  function cardEyebrow(card) {
    const suit = getSuit(card);
    return isMajor(card) ? "Major Arcana" : `${suit[0].toUpperCase() + suit.slice(1)} · Minor Arcana`;
  }

  function romanNumeral(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return "0";
    const numerals = [[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
    let remainder = Math.floor(number);
    let result = "";
    numerals.forEach(([amount, numeral]) => {
      while (remainder >= amount) {
        result += numeral;
        remainder -= amount;
      }
    });
    return result;
  }

  function cardCodexEyebrow(card) {
    const number = isMajor(card) ? romanNumeral(card.number) : String(card.number).padStart(2, "0");
    return `${cardEyebrow(card)} · ${number}`;
  }

  function cardImageDimensions(card, image = cardDisplay(card).image) {
    if (/\/cups\/0[1-8]-/.test(image)) return { width: 1006, height: 1564 };
    if (/astral-veil-tarot\/swords\/09-nine-of-swords\.png$/.test(image)) return { width: 1024, height: 1535 };
    return { width: 1024, height: 1536 };
  }

  function carouselCard(card, index) {
    const isSelected = index === state.selectedIndex;
    const loadImmediately = index < 7;
    const display = cardDisplay(card);
    const imageDimensions = cardImageDimensions(card, display.image);
    return `<button class="tarot-carousel-card${isSelected ? " is-selected" : ""}" type="button" role="option" aria-selected="${isSelected}" aria-label="Select ${escapeHtml(card.name)}" tabindex="${isSelected ? "0" : "-1"}" data-carousel-index="${index}"><span class="tarot-carousel-card__frame" style="--card-art-ratio:${imageDimensions.width}/${imageDimensions.height}"><img src="${escapeHtml(display.image)}" alt="${escapeHtml(display.imageAlt)}" width="${imageDimensions.width}" height="${imageDimensions.height}" loading="${loadImmediately ? "eager" : "lazy"}" decoding="async"><span class="tarot-carousel-card__shine" aria-hidden="true"></span></span><span class="tarot-carousel-card__name">${escapeHtml(card.name)}</span></button>`;
  }

  function updateDetail(card) {
    const display = cardDisplay(card);
    eyebrow.textContent = cardEyebrow(card);
    title.textContent = card.name;
    keywords.textContent = display.keywords.slice(0, 4).join("  ·  ");
    teaser.textContent = excerpt(display.teaser, state.isBloodMoon ? 150 : 110);
    summary.textContent = excerpt(display.summary, state.isBloodMoon ? 420 : 230);
    readMeaningButton.dataset.cardId = card.id;
    readMeaningButton.dataset.plannedRoute = card.route;
    readMeaningButton.setAttribute("aria-label", `Read the full meaning of ${card.name}`);
  }

  function resetTilt(cardButton) {
    if (!cardButton) return;
    cardButton.classList.remove("is-tilting");
    cardButton.style.setProperty("--tilt-x", "0deg");
    cardButton.style.setProperty("--tilt-y", "0deg");
    cardButton.style.setProperty("--shine-x", "50%");
    cardButton.style.setProperty("--shine-y", "50%");
  }

  function selectCard(index, { focus = false, scroll = true } = {}) {
    if (!state.visibleCards.length) return;
    const nextIndex = Math.min(Math.max(index, 0), state.visibleCards.length - 1);
    state.selectedIndex = nextIndex;
    const cardButtons = Array.from(carousel.querySelectorAll("[data-carousel-index]"));
    cardButtons.forEach((button, buttonIndex) => {
      const isSelected = buttonIndex === nextIndex;
      if (!isSelected) resetTilt(button);
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });
    const selectedButton = cardButtons[nextIndex];
    if (scroll) selectedButton?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "center" });
    if (focus) selectedButton?.focus({ preventScroll: true });
    previousButton.disabled = nextIndex === 0;
    nextButton.disabled = nextIndex === state.visibleCards.length - 1;
    position.textContent = `${nextIndex + 1} of ${state.visibleCards.length}`;
    updateDetail(state.visibleCards[nextIndex]);
  }

  function scrollBrowserIntoViewIfNeeded() {
    window.requestAnimationFrame(() => {
      const bounds = browserSection.getBoundingClientRect();
      if (bounds.top < 0 || bounds.top > window.innerHeight * .9) {
        browserSection.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }
    });
  }

  function renderBrowser({ scroll = false } = {}) {
    const query = state.query.trim().toLowerCase();
    state.visibleCards = cards.filter((card) => matchesFilter(card) && (!query || getSearchText(card).includes(query)));
    state.selectedIndex = 0;
    const hasCards = state.visibleCards.length > 0;
    carouselStage.hidden = !hasCards;
    positionWrap.hidden = !hasCards;
    detail.hidden = !hasCards;
    emptyState.hidden = hasCards;
    carousel.innerHTML = hasCards ? state.visibleCards.map(carouselCard).join("") : "";
    if (hasCards) selectCard(0, { scroll: false });
    if (scroll) scrollBrowserIntoViewIfNeeded();
  }

  function updateTarotThemePresentation(event) {
    state.isBloodMoon = typeof event?.detail?.isActive === "boolean"
      ? event.detail.isActive
      : document.body.classList.contains("blood-moon-mode");

    carousel.querySelectorAll("[data-carousel-index]").forEach((button) => {
      const card = state.visibleCards[Number(button.dataset.carouselIndex)];
      const image = button.querySelector("img");
      const frame = button.querySelector(".tarot-carousel-card__frame");
      if (!card || !image) return;
      const display = cardDisplay(card);
      const imageDimensions = cardImageDimensions(card, display.image);
      if (image.getAttribute("src") !== display.image) image.src = display.image;
      image.alt = display.imageAlt;
      image.width = imageDimensions.width;
      image.height = imageDimensions.height;
      frame?.style.setProperty("--card-art-ratio", `${imageDimensions.width}/${imageDimensions.height}`);
    });

    const selectedCard = state.visibleCards[state.selectedIndex];
    if (selectedCard) {
      updateDetail(selectedCard);
      if (codexBackdrop?.classList.contains("is-open")) populateCodex(selectedCard);
    }
  }

  function applyFilter(filter, options) {
    state.filter = filter;
    filterBar.querySelectorAll("[data-filter]").forEach((button) => {
      const isActive = button.dataset.filter === state.filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderBrowser(options);
  }

  function resetCodexTilt() {
    if (!codexTiltButton) return;
    codexTiltButton.style.setProperty("--tilt-x", "0deg");
    codexTiltButton.style.setProperty("--tilt-y", "0deg");
    codexTiltButton.style.setProperty("--shine-x", "50%");
    codexTiltButton.style.setProperty("--shine-y", "50%");
  }

  function updateCodexTilt(event) {
    if (!codexTiltButton || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = codexTiltButton.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const tiltY = (relativeX - .5) * 12;
    const tiltX = (.5 - relativeY) * 12;
    codexTiltButton.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    codexTiltButton.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    codexTiltButton.style.setProperty("--shine-x", `${(relativeX * 100).toFixed(1)}%`);
    codexTiltButton.style.setProperty("--shine-y", `${(relativeY * 100).toFixed(1)}%`);
  }

  function startCodexTilt(event) {
    if (!codexTiltButton || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof codexTiltButton.setPointerCapture === "function" && event.pointerId !== undefined) {
      codexTiltButton.setPointerCapture(event.pointerId);
    }
    updateCodexTilt(event);
  }

  function endCodexTilt(event) {
    if (codexTiltButton && typeof codexTiltButton.releasePointerCapture === "function" && event?.pointerId !== undefined) {
      try {
        codexTiltButton.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Pointer capture may already be released by the browser.
      }
    }
    resetCodexTilt();
  }

  function populateCodex(card) {
    if (!card || !codexImage) return;
    const display = cardDisplay(card);
    const imageDimensions = cardImageDimensions(card, display.image);
    const bloodMoon = card.bloodMoon || {};
    const bloodMoonReversed = bloodMoon.reversed || {};
    const regularReflection = card.reflectionQuestion || card.upright?.reflection || card.reversed?.reflection || "";
    const bloodMoonReflection = bloodMoonReversed.reflection
      || bloodMoonReversed.veilHint
      || bloodMoon.veilHint
      || regularReflection;

    codexTiltButton?.setAttribute("aria-label", `Drag to tilt ${card.name} from the ${display.deckName} tarot deck`);
    codexImage.src = display.image;
    codexImage.alt = display.imageAlt;
    codexImage.width = imageDimensions.width;
    codexImage.height = imageDimensions.height;
    codexEyebrow.textContent = state.isBloodMoon
      ? `${cardCodexEyebrow(card)} · ${display.deckName}`
      : cardCodexEyebrow(card);
    codexTitle.textContent = card.name;
    codexDescription.textContent = display.summary || display.teaser || "";

    if (state.isBloodMoon) {
      codexUprightLabel.textContent = "Reversed";
      codexReversedLabel.textContent = "Shadow";
      codexUpright.textContent = bloodMoonReversed.meaning
        || card.reversed?.meaning
        || card.shadowMeaning
        || reversedText(card);
      codexReversed.textContent = bloodMoonReversed.shadow
        || bloodMoon.shadowMessage
        || card.reversed?.shadow
        || card.shadowMeaning
        || reversedText(card);
      codexReflection.textContent = bloodMoonReflection;
      codexReflectionBlock.hidden = !bloodMoonReflection;
    } else {
      codexUprightLabel.textContent = "Upright";
      codexReversedLabel.textContent = "Reversed";
      codexUpright.textContent = card.uprightMeaning || card.upright?.meaning || card.upright?.summary || normalizeKeywords(card.keywords);
      codexReversed.textContent = card.shadowMeaning || card.reversed?.meaning || card.reversed?.summary || reversedText(card);
      codexReflection.textContent = regularReflection;
      codexReflectionBlock.hidden = !regularReflection;
    }
    const detailUrl = getCardDetailUrl(card);
    const meaningPageAvailable = Boolean(detailUrl);
    if (codexMeaningLink) {
      codexMeaningLink.hidden = !meaningPageAvailable;
      if (meaningPageAvailable) {
        codexMeaningLink.href = detailUrl;
        codexMeaningLink.setAttribute("aria-label", `Read the full meaning of ${card.name}`);
      } else {
        codexMeaningLink.removeAttribute("href");
        codexMeaningLink.removeAttribute("aria-label");
      }
    }
    if (codexMeaningComingSoon) codexMeaningComingSoon.hidden = true;
  }

  function openCodex(card, trigger) {
    if (!codexBackdrop || !codex) return;

    lastCodexTrigger = trigger;
    window.clearTimeout(codexCloseTimer);
    resetCodexTilt();
    populateCodex(card);

    codexBackdrop.hidden = false;
    codexBackdrop.inert = false;
    codexBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("tarot-codex-open");
    window.requestAnimationFrame(() => {
      codexBackdrop.classList.add("is-open");
      codexCloseButton?.focus({ preventScroll: true });
    });
  }

  function closeCodex() {
    if (!codexBackdrop || codexBackdrop.hidden) return;
    const trigger = lastCodexTrigger;
    codexBackdrop.classList.remove("is-open");
    codexBackdrop.setAttribute("aria-hidden", "true");
    codexBackdrop.inert = true;
    document.body.classList.remove("tarot-codex-open");
    resetCodexTilt();
    lastCodexTrigger = null;
    window.clearTimeout(codexCloseTimer);
    codexCloseTimer = window.setTimeout(() => {
      codexBackdrop.hidden = true;
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280);
    trigger?.focus({ preventScroll: true });
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = searchInput.value;
    renderBrowser({ scroll: true });
  });
  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value;
    renderBrowser();
  });
  filterBar?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) applyFilter(button.dataset.filter, { scroll: true });
  });
  carousel?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-carousel-index]");
    if (button) selectCard(Number(button.dataset.carouselIndex), { scroll: true });
  });
  carousel?.addEventListener("keydown", (event) => {
    const keyActions = { ArrowLeft: state.selectedIndex - 1, ArrowRight: state.selectedIndex + 1, Home: 0, End: state.visibleCards.length - 1 };
    if (!(event.key in keyActions)) return;
    event.preventDefault();
    selectCard(keyActions[event.key], { focus: true, scroll: true });
  });
  carousel?.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const railBounds = carousel.getBoundingClientRect();
      const railCenter = railBounds.left + railBounds.width / 2;
      const cardButtons = Array.from(carousel.querySelectorAll("[data-carousel-index]"));
      const nearest = cardButtons.reduce((best, button, index) => {
        const bounds = button.getBoundingClientRect();
        const distance = Math.abs(bounds.left + bounds.width / 2 - railCenter);
        return distance < best.distance ? { index, distance } : best;
      }, { index: state.selectedIndex, distance: Infinity });
      if (nearest.index !== state.selectedIndex) selectCard(nearest.index, { scroll: false });
    }, 120);
  }, { passive: true });
  carousel?.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const button = event.target.closest(".tarot-carousel-card.is-selected");
    if (!button) return;
    const bounds = button.getBoundingClientRect();
    const relativeX = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    const relativeY = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1);
    button.classList.add("is-tilting");
    button.style.setProperty("--tilt-x", `${((.5 - relativeY) * 9).toFixed(2)}deg`);
    button.style.setProperty("--tilt-y", `${((relativeX - .5) * 9).toFixed(2)}deg`);
    button.style.setProperty("--shine-x", `${(relativeX * 100).toFixed(1)}%`);
    button.style.setProperty("--shine-y", `${(relativeY * 100).toFixed(1)}%`);
  });
  carousel?.addEventListener("pointerout", (event) => {
    const button = event.target.closest(".tarot-carousel-card.is-selected");
    if (button && !button.contains(event.relatedTarget)) resetTilt(button);
  });
  previousButton?.addEventListener("click", () => selectCard(state.selectedIndex - 1, { focus: true }));
  nextButton?.addEventListener("click", () => selectCard(state.selectedIndex + 1, { focus: true }));
  readMeaningButton?.addEventListener("click", () => {
    const card = state.visibleCards[state.selectedIndex];
    if (card) openCodex(card, readMeaningButton);
  });
  document.querySelector("[data-clear-search]")?.addEventListener("click", () => {
    searchInput.value = "";
    state.query = "";
    applyFilter("all");
    searchInput.focus();
  });
  if (codexTiltButton) {
    codexTiltButton.addEventListener("pointerdown", startCodexTilt);
    codexTiltButton.addEventListener("pointermove", updateCodexTilt);
    codexTiltButton.addEventListener("pointerleave", resetCodexTilt);
    codexTiltButton.addEventListener("pointercancel", endCodexTilt);
    codexTiltButton.addEventListener("pointerup", endCodexTilt);
  }
  codexBackdrop?.addEventListener("click", (event) => {
    if (event.target === codexBackdrop || event.target.closest("[data-close-tarot-codex]")) closeCodex();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && codexBackdrop?.classList.contains("is-open")) {
      event.preventDefault();
      closeCodex();
      return;
    }
    if (codexBackdrop?.classList.contains("is-open") && event.key === "Tab") {
      const focusable = Array.from(codex.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((item) => !item.hidden);
      if (!focusable.length) {
        event.preventDefault();
        codex.focus({ preventScroll: true });
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener("astralVeilBloodMoonChange", updateTarotThemePresentation);

  if (questionPathCarousel?.dataset.initialized !== "true") {
    questionPathCarousel.dataset.initialized = "true";
    const carouselScrollAmount = () => Math.max(
      questionPathViewport.clientWidth * .82,
      questionPathTrack?.querySelector(".tarot-question-card")?.getBoundingClientRect().width || 0
    );
    const scrollQuestionPathCarousel = (direction) => {
      questionPathViewport?.scrollBy({
        left: direction * carouselScrollAmount(),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    };

    questionPathTrack?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-question-path-image-button]");
      if (!button || !questionPathTrack.contains(button)) return;
      event.preventDefault();
      openQuestionPathViewer(button);
    });
    questionPathPrevious?.addEventListener("click", () => scrollQuestionPathCarousel(-1));
    questionPathNext?.addEventListener("click", () => scrollQuestionPathCarousel(1));
    questionPathViewport?.addEventListener("scroll", updateQuestionPathCarouselControls, { passive: true });
    questionPathViewport?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      scrollQuestionPathCarousel(event.key === "ArrowLeft" ? -1 : 1);
    });
    window.addEventListener("resize", updateQuestionPathCarouselControls, { passive: true });

    window.addEventListener("astralVeilBloodMoonChange", updateQuestionPathThemeImages);

    questionPathViewer?.addEventListener("click", (event) => {
      if (event.target === questionPathViewer || event.target.closest("[data-close-tarot-image-viewer]")) closeQuestionPathViewer();
    });
    questionPathViewer?.addEventListener("close", () => {
      questionPathViewerImage?.removeAttribute("src");
      questionPathViewerImage && (questionPathViewerImage.alt = "");
      questionPathViewerTitle && (questionPathViewerTitle.textContent = "");
      questionPathViewerCaption && (questionPathViewerCaption.textContent = "");
      lastQuestionPathImageTrigger?.isConnected && lastQuestionPathImageTrigger.focus({ preventScroll: true });
      lastQuestionPathImageTrigger = null;
    });
  }

  updateQuestionPathThemeImages(true);
  renderTarotGuides();
  initializeTarotFaq();
  renderFilters();
  renderBrowser();
})();
