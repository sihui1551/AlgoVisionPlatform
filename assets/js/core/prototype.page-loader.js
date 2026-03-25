(function () {
  const config = window.PROTOTYPE_CONFIG || {};
  const registry = config.pageRegistry || {};
  const pageDefinitions = window.PROTOTYPE_PAGE_DEFINITIONS || {};
  const pendingLoads = {};

  window.PROTOTYPE_PAGE_DEFINITIONS = pageDefinitions;
  window.registerPrototypePage = registerPrototypePage;
  window.loadPrototypePage = loadPrototypePage;

  function registerPrototypePage(pageDefinition) {
    if (!pageDefinition || !pageDefinition.key) {
      return null;
    }

    pageDefinitions[pageDefinition.key] = clone(pageDefinition);
    return pageDefinitions[pageDefinition.key];
  }

  function loadPrototypePage(pageKey) {
    if (pageDefinitions[pageKey]) {
      return Promise.resolve(clone(pageDefinitions[pageKey]));
    }

    const entry = registry[pageKey];
    if (!entry || !entry.source) {
      return Promise.resolve(null);
    }

    if (!pendingLoads[pageKey]) {
      pendingLoads[pageKey] = loadScript(entry.source).then(function () {
        return pageDefinitions[pageKey] ? clone(pageDefinitions[pageKey]) : null;
      });
    }

    return pendingLoads[pageKey];
  }

  function loadScript(source) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = source;
      script.async = true;
      script.onload = function () {
        resolve();
      };
      script.onerror = function () {
        reject(new Error("Failed to load script: " + source));
      };
      document.body.appendChild(script);
    });
  }

  function clone(value) {
    if (value == null || typeof value !== "object") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(clone);
    }

    const result = {};
    Object.keys(value).forEach(function (key) {
      result[key] = clone(value[key]);
    });
    return result;
  }
})();
