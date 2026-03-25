(function () {
  const STYLE_ATTR = "data-prototype-page-style";

  window.loadPrototypePageStyles = function loadPrototypePageStyles(page) {
    const styleSources = normalizeSources(page);

    removeDetachedStyles(styleSources);
    styleSources.forEach(function (source) {
      ensureStyle(source);
    });
  };

  function normalizeSources(page) {
    if (!page) {
      return [];
    }

    if (Array.isArray(page.styleSources)) {
      return page.styleSources.filter(Boolean);
    }

    if (page.styleSource) {
      return [page.styleSource];
    }

    return [];
  }

  function ensureStyle(source) {
    if (document.head.querySelector('link[' + STYLE_ATTR + '="' + source + '"]')) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = source;
    link.setAttribute(STYLE_ATTR, source);
    document.head.appendChild(link);
  }

  function removeDetachedStyles(activeSources) {
    const activeMap = {};
    activeSources.forEach(function (source) {
      activeMap[source] = true;
    });

    const nodes = document.head.querySelectorAll("link[" + STYLE_ATTR + "]");
    Array.prototype.forEach.call(nodes, function (node) {
      const source = node.getAttribute(STYLE_ATTR);
      if (!activeMap[source]) {
        node.parentNode.removeChild(node);
      }
    });
  }
})();
