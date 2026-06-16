(function () {
  const bloodMoonEventId = "bloodMoon";
  const eventStorageKey = "astralVeilBloodMoonActive";
  const testStorageKey = "astralVeilTestBloodMoonActive";
  const accessStorageKeys = [
    "astralVeilBloodMoonAccess",
    "astralVeilBloodMoonUnlocked",
    "astralVeilBloodMoonDeckUnlocked",
    "astralVeilNoctisArchiveUnlocked"
  ];
  const unlockCollectionKeys = [
    "astralVeilUserUnlocks",
    "astralVeilProfileUnlocks",
    "astralVeilDeckUnlocks"
  ];
  const accessUnlockKeys = [
    "bloodMoon",
    "bloodMoonDeck",
    "blood_moon",
    "blood_moon_deck",
    "noctisArchive",
    "noctis_archive",
    "restricted_wing_background",
    "restricted_wing_title_marked"
  ];
  const expirationStorageKeys = [
    "astralVeilBloodMoonExpiresAt",
    "astralVeilBloodMoonAccessExpiresAt",
    "astralVeilBloodMoonSessionExpiresAt"
  ];

  function getStorageValue(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function removeStorageValue(storage, key) {
    try {
      storage.removeItem(key);
    } catch (error) {
      return;
    }
  }

  function isTruthyStoredValue(value) {
    return /^(1|true|yes|on|active|unlocked|granted)$/i.test(String(value || "").trim());
  }

  function getStoredFlag(key) {
    return isTruthyStoredValue(getStorageValue(sessionStorage, key)) ||
      isTruthyStoredValue(getStorageValue(localStorage, key));
  }

  function getEventStorageKey() {
    return window.AstralVeilEvents?.getEventStorageKey?.(bloodMoonEventId) || eventStorageKey;
  }

  function getTestingStorageKey() {
    return window.AstralVeilEvents?.getEventConfig?.(bloodMoonEventId)?.testing?.storageKey || testStorageKey;
  }

  function hasExpiredAccess() {
    const now = Date.now();

    return expirationStorageKeys.some((key) => {
      const value = getStorageValue(sessionStorage, key) || getStorageValue(localStorage, key);

      if (!value) {
        return false;
      }

      const expiresAt = Number(value) || Date.parse(value);
      return Number.isFinite(expiresAt) && expiresAt <= now;
    });
  }

  function getStoredUnlockCollection(key) {
    const value = getStorageValue(sessionStorage, key) || getStorageValue(localStorage, key);

    if (!value) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(value);

      if (Array.isArray(parsedValue)) {
        return parsedValue;
      }

      if (parsedValue && typeof parsedValue === "object") {
        return Object.entries(parsedValue)
          .filter((entry) => entry[1])
          .map((entry) => entry[0]);
      }
    } catch (error) {
      return value.split(/[,\s]+/).filter(Boolean);
    }

    return [];
  }

  function hasStoredUnlock(unlockKeys = accessUnlockKeys) {
    const normalizedKeys = unlockKeys.map((key) => String(key).toLowerCase());

    return unlockCollectionKeys.some((storageKey) =>
      getStoredUnlockCollection(storageKey).some((unlockKey) =>
        normalizedKeys.includes(String(unlockKey).toLowerCase())
      )
    );
  }

  function clearSpoofedBloodMoonState() {
    const keys = [
      getEventStorageKey(),
      getTestingStorageKey(),
      eventStorageKey,
      testStorageKey,
      ...accessStorageKeys,
      ...expirationStorageKeys
    ];

    keys.forEach((key) => {
      removeStorageValue(sessionStorage, key);
      removeStorageValue(localStorage, key);
    });

    document.body?.classList.remove("blood-moon-mode");
  }

  function hasBloodMoonQueryOverride() {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace(/^#/, "").toLowerCase();

    return params.has("bloodMoon") ||
      params.has("testBloodMoon") ||
      ["bloodmoon", "blood-moon"].includes(String(params.get("event") || "").toLowerCase()) ||
      hash === "bloodmoon" ||
      hash === "blood-moon";
  }

  function isBloodMoonActive() {
    if (hasExpiredAccess()) {
      clearSpoofedBloodMoonState();
      return false;
    }

    return getStoredFlag(getEventStorageKey()) || getStoredFlag(eventStorageKey) || getStoredFlag(getTestingStorageKey());
  }

  function hasBloodMoonAccess(options = {}) {
    if (hasExpiredAccess()) {
      clearSpoofedBloodMoonState();
      return false;
    }

    const requiredUnlocks = Array.isArray(options.requiredUnlocks) && options.requiredUnlocks.length
      ? options.requiredUnlocks
      : accessUnlockKeys;

    return isBloodMoonActive() ||
      accessStorageKeys.some(getStoredFlag) ||
      hasStoredUnlock(requiredUnlocks) ||
      Boolean(options.user && options.allowAuthenticatedUser);
  }

  function getGateMarkup(redirectTo = "index.html") {
    return `
      <main class="bloodmoon-gate-wrap">
        <section class="bloodmoon-gate" aria-labelledby="bloodmoon-gate-title">
          <p class="bloodmoon-gate-kicker">Access Denied</p>
          <h1 id="bloodmoon-gate-title">The Blood Moon has not risen.</h1>
          <p>This chamber cannot be entered from here. Return when the Veil opens.</p>
          <a href="${redirectTo}">Return to Astral Veil</a>
        </section>
      </main>
    `;
  }

  function renderGate(options = {}) {
    const redirectTo = options.redirectTo || "index.html";

    document.body.classList.remove("sun-mode", "moon-mode");
    document.body.classList.add("blood-moon-mode", "bloodmoon-access-denied");
    document.body.innerHTML = getGateMarkup(redirectTo);
  }

  function requireBloodMoonAccess(options = {}) {
    const fallback = options.fallback || "gate";
    const redirectTo = options.redirectTo || "index.html";
    const allowed = hasBloodMoonAccess(options);

    if (allowed) {
      document.body?.classList.remove("sun-mode", "moon-mode");
      document.body?.classList.add("blood-moon-mode");
      document.body?.classList.remove("bloodmoon-access-denied");
      return true;
    }

    if (hasBloodMoonQueryOverride()) {
      clearSpoofedBloodMoonState();
    }

    if (fallback === "redirect") {
      window.location.replace(redirectTo);
      return false;
    }

    renderGate({ redirectTo });
    return false;
  }

  function guardMarkedPage(options = {}) {
    if (document.body?.matches("[data-requires-bloodmoon='true'], .requires-bloodmoon")) {
      return requireBloodMoonAccess(options);
    }

    return hasBloodMoonAccess(options);
  }

  window.AstralVeilBloodMoonAccess = {
    isBloodMoonActive,
    hasBloodMoonAccess,
    requireBloodMoonAccess,
    guardMarkedPage,
    clearSpoofedBloodMoonState
  };

  window.isBloodMoonActive = isBloodMoonActive;
  window.hasBloodMoonAccess = hasBloodMoonAccess;
  window.requireBloodMoonAccess = requireBloodMoonAccess;
})();
