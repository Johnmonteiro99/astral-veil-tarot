(function () {
  if (window.AstralVeilCardTilt) return;

  const initializedCards = new WeakSet();
  const activeCards = new Set();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function reset(card) {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--shine-x", "50%");
    card.style.setProperty("--shine-y", "50%");
    card.classList.remove("is-tilting");
  }

  function findHint(card) {
    return card.closest("figure")?.querySelector("[data-astral-card-tilt-hint]") || null;
  }

  function canTilt(event) {
    return !reducedMotion.matches && finePointer.matches && event?.pointerType !== "touch";
  }

  function syncInteractionMode(card) {
    reset(card);
    const hint = findHint(card);
    if (reducedMotion.matches || !finePointer.matches) {
      hint?.setAttribute("hidden", "");
    } else {
      hint?.removeAttribute("hidden");
    }
  }

  function initializeCard(card) {
    if (!card || initializedCards.has(card)) return false;
    initializedCards.add(card);
    activeCards.add(card);
    syncInteractionMode(card);

    function update(event) {
      if (!canTilt(event)) return;
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const relativeX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      const relativeY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      card.classList.add("is-tilting");
      card.style.setProperty("--tilt-x", `${((0.5 - relativeY) * 10).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${((relativeX - 0.5) * 10).toFixed(2)}deg`);
      card.style.setProperty("--shine-x", `${(relativeX * 100).toFixed(1)}%`);
      card.style.setProperty("--shine-y", `${(relativeY * 100).toFixed(1)}%`);
    }

    function start(event) {
      if (!canTilt(event)) return;
      card.setPointerCapture?.(event.pointerId);
      update(event);
    }

    function end(event) {
      try {
        card.releasePointerCapture?.(event.pointerId);
      } catch (error) {
        // The browser may release pointer capture before this handler runs.
      }
      reset(card);
    }

    card.addEventListener("pointerdown", start);
    card.addEventListener("pointermove", update);
    card.addEventListener("pointerleave", () => reset(card));
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
    return true;
  }

  function initialize(root = document) {
    const cards = [
      ...(root.matches?.("[data-astral-card-tilt]") ? [root] : []),
      ...root.querySelectorAll("[data-astral-card-tilt]")
    ];
    return cards.reduce((count, card) => count + Number(initializeCard(card)), 0);
  }

  reducedMotion.addEventListener?.("change", () => {
    activeCards.forEach(syncInteractionMode);
  });

  finePointer.addEventListener?.("change", () => {
    activeCards.forEach(syncInteractionMode);
  });

  window.AstralVeilCardTilt = { initialize, reset };
})();
