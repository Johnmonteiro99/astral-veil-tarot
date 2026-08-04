(function () {
  const path = window.location.pathname
    .replace(/\/index\.html$/, "")
    .replace(/\/+$/, "") || "/";
  const routesThatStartAtHero = new Set([
    "/tarot/for-beginners",
    "/tarot-spreads"
  ]);

  if (!routesThatStartAtHero.has(path) || window.location.hash) return;

  const navigationEntry = window.performance?.getEntriesByType?.("navigation")?.[0];
  if (navigationEntry?.type === "back_forward") return;

  const canControlRestoration = "scrollRestoration" in window.history;
  const previousRestoration = canControlRestoration
    ? window.history.scrollRestoration
    : "auto";

  if (canControlRestoration) window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  window.addEventListener("pagehide", () => {
    if (canControlRestoration) window.history.scrollRestoration = previousRestoration;
  }, { once: true });
})();
