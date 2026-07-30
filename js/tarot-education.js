(function () {
  if (document.documentElement.dataset.tarotEducationInitialized === "true") return;
  document.documentElement.dataset.tarotEducationInitialized = "true";

  const viewport = document.querySelector("[data-tarot-education-viewport]");
  const activeItem = viewport?.querySelector("[data-tarot-education-active]");
  if (!viewport || !activeItem) return;

  function centerActiveItem() {
    if (!window.matchMedia("(max-width: 820px)").matches) {
      viewport.scrollLeft = 0;
      return;
    }

    const maximumScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (maximumScroll <= 1) {
      viewport.scrollLeft = 0;
      return;
    }

    const activeCenter = activeItem.offsetLeft + (activeItem.offsetWidth / 2);
    viewport.scrollLeft = Math.min(
      maximumScroll,
      Math.max(0, activeCenter - (viewport.clientWidth / 2))
    );
  }

  window.addEventListener("load", centerActiveItem, { once: true });
  window.addEventListener("resize", centerActiveItem, { passive: true });
  window.requestAnimationFrame(() => window.requestAnimationFrame(centerActiveItem));
})();
