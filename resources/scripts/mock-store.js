(function () {
  const config = window.PROTOTYPE_CONFIG || {};
  const pageRegistry = config.pageRegistry || {};
  const defaults = {
    enabled: true,
    driver: "localStorage",
    namespace: "axure-prototype",
    project: "tms-backoffice",
    version: "2026-03-18",
    seedOnFirstLoad: true
  };
  const storageConfig = mergeObjects(defaults, config.mockStore || {});
  const fallbackState = createEmptyState();
  let memoryState = clone(fallbackState);
  const storage = storageConfig.enabled ? resolveStorage(storageConfig.driver) : null;
  const storageKey = [
    storageConfig.namespace,
    storageConfig.project,
    storageConfig.version
  ].join(":");

  if (storageConfig.enabled) {
    ensureState();
  }

  window.PROTOTYPE_MOCK_STORE = {
    driver: storageConfig.driver,
    storageKey: storageKey,
    getPage: getPage,
    replacePage: replacePage,
    patchPage: patchPage,
    resetPage: resetPage,
    resetAll: resetAll,
    exportState: exportState,
    importState: importState,
    getStorage: function () {
      return storage;
    }
  };

  function getPage(pageKey, seedPage) {
    if (!hasPage(pageKey)) {
      return null;
    }

    const state = readState();
    const storedPage = state.pages[pageKey];
    const basePage = clone(seedPage || {});

    if (!storedPage) {
      if (storageConfig.enabled && storageConfig.seedOnFirstLoad && seedPage) {
        state.pages[pageKey] = clone(basePage);
        writeState(state);
      }

      return basePage;
    }

    return mergeObjects(basePage, storedPage);
  }

  function replacePage(pageKey, nextPage) {
    if (!hasPage(pageKey)) {
      return null;
    }

    const state = readState();
    state.pages[pageKey] = clone(nextPage || {});
    writeState(state);
    return clone(state.pages[pageKey]);
  }

  function patchPage(pageKey, partialPage, seedPage) {
    if (!hasPage(pageKey)) {
      return null;
    }

    const state = readState();
    const currentPage = state.pages[pageKey] || clone(seedPage || {});
    state.pages[pageKey] = mergeObjects(currentPage, partialPage || {});
    writeState(state);
    return getPage(pageKey, seedPage);
  }

  function resetPage(pageKey, seedPage) {
    if (!hasPage(pageKey)) {
      return null;
    }

    const state = readState();

    if (seedPage) {
      state.pages[pageKey] = clone(seedPage);
    } else {
      delete state.pages[pageKey];
    }

    writeState(state);
    return getPage(pageKey, seedPage);
  }

  function resetAll() {
    const nextState = createEmptyState();
    writeState(nextState);
    return nextState;
  }

  function exportState() {
    return clone(readState());
  }

  function importState(nextState) {
    if (!isPlainObject(nextState)) {
      return readState();
    }

    const mergedState = mergeObjects(createEmptyState(), nextState);
    writeState(mergedState);
    return mergedState;
  }

  function ensureState() {
    const currentState = readStoredState();
    if (!storage || !currentState) {
      return currentState || fallbackState;
    }

    const mergedState = mergeObjects(createEmptyState(), currentState);
    writeState(mergedState);
    return mergedState;
  }

  function readState() {
    if (!storageConfig.enabled || !storage) {
      return clone(memoryState);
    }

    return readStoredState() || clone(memoryState);
  }

  function readStoredState() {
    if (!storage) {
      return null;
    }

    try {
      const rawValue = storage.getItem(storageKey);
      if (!rawValue) {
        return null;
      }

      const parsedValue = JSON.parse(rawValue);
      if (!isPlainObject(parsedValue) || !isPlainObject(parsedValue.pages)) {
        return null;
      }

      return parsedValue;
    } catch (error) {
      console.warn("[mock-store] Failed to read storage state.", error);
      return null;
    }
  }

  function writeState(nextState) {
    memoryState = clone(nextState);
    memoryState.meta.updatedAt = new Date().toISOString();

    if (!storage) {
      return memoryState;
    }

    try {
      storage.setItem(storageKey, JSON.stringify(memoryState));
    } catch (error) {
      console.warn("[mock-store] Failed to persist storage state.", error);
    }

    return memoryState;
  }

  function createEmptyState() {
    return {
      meta: {
        version: storageConfig.version,
        driver: storageConfig.driver,
        updatedAt: new Date().toISOString()
      },
      pages: {}
    };
  }

  function hasPage(pageKey) {
    return !!pageRegistry[pageKey];
  }

  function resolveStorage(driver) {
    try {
      if (driver === "sessionStorage") {
        return window.sessionStorage;
      }

      return window.localStorage;
    } catch (error) {
      console.warn("[mock-store] Browser storage is unavailable.", error);
      return null;
    }
  }

  function mergeObjects(baseValue, overrideValue) {
    if (Array.isArray(overrideValue)) {
      return clone(overrideValue);
    }

    if (!isPlainObject(baseValue) || !isPlainObject(overrideValue)) {
      return overrideValue === undefined ? clone(baseValue) : clone(overrideValue);
    }

    const result = clone(baseValue);

    Object.keys(overrideValue).forEach(function (key) {
      const currentValue = overrideValue[key];
      if (currentValue === undefined) {
        return;
      }

      if (isPlainObject(result[key]) && isPlainObject(currentValue)) {
        result[key] = mergeObjects(result[key], currentValue);
        return;
      }

      result[key] = clone(currentValue);
    });

    return result;
  }

  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }

  function clone(value) {
    if (value == null) {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }
})();
