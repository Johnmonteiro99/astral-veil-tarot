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

  function isEventActive(eventId) {
    const eventConfig = getEventConfig(eventId);

    if (eventConfig && eventConfig.enabled === false) {
      return false;
    }

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
    isEventActive,
    getActiveDeck,
    notifyEventStateChange
  };
})();
