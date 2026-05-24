(function () {
  function getEventConfig(eventId) {
    return typeof hiddenEvents === "undefined" ? null : hiddenEvents[eventId] || null;
  }

  function getEventStorageKey(eventId) {
    return getEventConfig(eventId)?.storageKey || `astralVeilEvent:${eventId}`;
  }

  function getEventStorage(eventId) {
    const eventConfig = getEventConfig(eventId);

    return eventConfig?.storageType === "session" ? sessionStorage : localStorage;
  }

  function getStoredEventState(eventId) {
    try {
      return getEventStorage(eventId).getItem(getEventStorageKey(eventId));
    } catch (error) {
      return "false";
    }
  }

  function setStoredEventState(eventId, isActive) {
    try {
      getEventStorage(eventId).setItem(getEventStorageKey(eventId), isActive ? "true" : "false");
    } catch (error) {
      return;
    }
  }

  function clearStoredEventState(eventId) {
    try {
      getEventStorage(eventId).removeItem(getEventStorageKey(eventId));
    } catch (error) {
      return;
    }
  }

  function normalizeEventTestValue(value) {
    if (value === null) {
      return null;
    }

    const normalizedValue = String(value).trim().toLowerCase();

    if (normalizedValue === "" || ["1", "true", "yes", "on", "active"].includes(normalizedValue)) {
      return true;
    }

    if (["0", "false", "no", "off", "inactive"].includes(normalizedValue)) {
      return false;
    }

    return null;
  }

  function getEventTestAliases(eventConfig) {
    return [
      eventConfig.id,
      eventConfig.name,
      eventConfig.name?.replace(/\s+/g, "-"),
      eventConfig.name?.replace(/\s+/g, "")
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());
  }

  function getEventTestOverride(eventId) {
    const eventConfig = getEventConfig(eventId);

    if (!eventConfig?.testing) {
      return null;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const queryParams = eventConfig.testing.queryParams || [];

      for (const paramName of queryParams) {
        if (params.has(paramName)) {
          return normalizeEventTestValue(params.get(paramName));
        }
      }

      if (params.has("event")) {
        const eventValue = params.get("event");
        const normalizedEventValue = String(eventValue || "").trim().toLowerCase();
        const eventAliases = getEventTestAliases(eventConfig);

        if (eventAliases.includes(normalizedEventValue)) {
          return true;
        }
      }

      const storageKey = eventConfig.testing.storageKey;

      if (storageKey) {
        return normalizeEventTestValue(
          sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey)
        );
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function applyEventTestOverride(eventId) {
    const override = getEventTestOverride(eventId);

    if (override === null) {
      return;
    }

    if (override) {
      setStoredEventState(eventId, true);
    } else {
      clearStoredEventState(eventId);
    }
  }

  function isEventActive(eventId) {
    const eventConfig = getEventConfig(eventId);

    if (eventConfig && eventConfig.enabled === false) {
      return false;
    }

    applyEventTestOverride(eventId);

    return getStoredEventState(eventId) === "true";
  }

  function getActiveDeck() {
    const eventDeck = typeof deckCollections === "undefined"
      ? null
      : deckCollections.find(
          (collection) =>
            collection.accessType === "event" &&
            collection.requiredEvent &&
            isEventActive(collection.requiredEvent)
        );

    if (eventDeck && typeof eventDeck.cards === "function") {
      return eventDeck.cards();
    }

    return typeof tarotDeck === "undefined" ? [] : tarotDeck;
  }

  function notifyEventStateChange(eventId, isActive) {
    window.dispatchEvent(
      new CustomEvent("astralVeilEventChange", {
        detail: { eventId, isActive }
      })
    );

    if (eventId === "bloodMoon") {
      window.dispatchEvent(
        new CustomEvent("astralVeilBloodMoonChange", {
          detail: { isActive }
        })
      );
    }
  }

  window.AstralVeilEvents = {
    getEventConfig,
    getEventStorageKey,
    getEventStorage,
    getStoredEventState,
    setStoredEventState,
    clearStoredEventState,
    getEventTestOverride,
    applyEventTestOverride,
    isEventActive,
    getActiveDeck,
    notifyEventStateChange
  };
})();
