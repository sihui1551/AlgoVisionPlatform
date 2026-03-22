(function () {
  const config = window.PROTOTYPE_CONFIG;
  const pageRegistry = config && config.pageRegistry ? config.pageRegistry : {};
  const loadPrototypePage = window.loadPrototypePage;
  const loadPrototypePageStyles = window.loadPrototypePageStyles;
  const mockStore = window.PROTOTYPE_MOCK_STORE;
  const components = window.PROTOTYPE_COMPONENTS;
  const mountNode = document.getElementById("base");
  const navState = components ? components.createNavigationState(config) : {};
  const explicitPageKey = getExplicitPageKey();
  const usePageRouting = window.PROTOTYPE_ROUTE_MODE === "page" && !!explicitPageKey;
  let renderRequestId = 0;
  let pageCleanup = null;

  if (!config || !mountNode || !components) {
    return;
  }

  document.addEventListener("click", function (event) {
    const shellToggle = event.target.closest("[data-shell-toggle]");
    if (shellToggle) {
      handleShellToggle(shellToggle.getAttribute("data-shell-toggle"));
      return;
    }

    const navToggle = event.target.closest("[data-nav-toggle]");
    if (navToggle) {
      const groupKey = navToggle.getAttribute("data-nav-toggle");
      navState[groupKey] = !navState[groupKey];
      render();
      return;
    }

    const routeLink = event.target.closest("[data-route]");
    if (routeLink) {
      event.preventDefault();
      navigateToRoute(routeLink.getAttribute("data-route"));
      return;
    }

    const toastTrigger = event.target.closest("[data-toast-title]");
    if (toastTrigger) {
      components.showToast(
        toastTrigger.getAttribute("data-toast-title"),
        toastTrigger.getAttribute("data-toast-message")
      );
    }
  });

  if (!usePageRouting) {
    window.addEventListener("hashchange", render);
  }
  render();

  function render() {
    const pageKey = getCurrentPageKey();
    components.ensureActiveGroupOpen({
      config: config,
      navState: navState,
      activeKey: pageKey
    });
    const requestId = ++renderRequestId;

    loadPage(pageKey)
      .then(function (page) {
        if (requestId !== renderRequestId || !page) {
          return;
        }

        if (typeof loadPrototypePageStyles === "function") {
          loadPrototypePageStyles(page);
        }

        runPageCleanup();
        mountNode.innerHTML = components.renderShell({
          config: config,
          navState: navState,
          activeKey: pageKey,
          page: page,
          getRouteHref: getRouteHref
        });

        if (page.kind === "table" || page.streamTaskPage || page.offlineTaskPage) {
          components.bindTablePage(page);
        }

        runPageSetup(pageKey, page);
      })
      .catch(function (error) {
        if (requestId !== renderRequestId) {
          return;
        }

        console.error("[prototype] Failed to render page.", error);
        components.showToast("页面加载失败", "当前页面模块加载失败，请检查页面配置。");
      });
  }

  function loadPage(pageKey) {
    const registryPage = getPageRegistry(pageKey);
    if (!registryPage) {
      return Promise.resolve(null);
    }

    const seedPromise = loadPrototypePage
      ? loadPrototypePage(pageKey)
      : Promise.resolve(null);

    return Promise.resolve(seedPromise).then(function (pageSeed) {
      const mergedSeed = Object.assign({}, registryPage, pageSeed || {});
      const runtimeFields = extractRuntimeFields(mergedSeed);
      const serializableSeed = stripRuntimeFields(mergedSeed);

      if (mockStore && typeof mockStore.getPage === "function") {
        return attachRuntimeFields(mockStore.getPage(pageKey, serializableSeed), runtimeFields);
      }

      return attachRuntimeFields(serializableSeed, runtimeFields);
    });
  }

  function getPageRegistry(pageKey) {
    return pageRegistry[pageKey] || null;
  }

  function getCurrentPageKey() {
    if (explicitPageKey) {
      return explicitPageKey;
    }

    const key = (window.location.hash || "#" + config.defaultPage).replace("#", "");
    return getPageRegistry(key) ? key : config.defaultPage;
  }

  function getExplicitPageKey() {
    const pageKey = window.PROTOTYPE_PAGE_KEY;
    return pageKey && getPageRegistry(pageKey) ? pageKey : "";
  }

  function getPageUrl(pageKey) {
    const page = getPageRegistry(pageKey);
    if (!page) {
      return "";
    }

    return page.file || pageKey + ".html";
  }

  function getRouteHref(pageKey) {
    if (!getPageRegistry(pageKey)) {
      return "#";
    }

    return usePageRouting ? getPageUrl(pageKey) : "#" + pageKey;
  }

  function navigateToRoute(pageKey) {
    if (!pageKey) {
      return;
    }

    if (!getPageRegistry(pageKey)) {
      components.showToast("页面待补充", "当前原型尚未配置 " + pageKey + " 页面。");
      return;
    }

    if (pageKey === getCurrentPageKey()) {
      return;
    }

    if (usePageRouting) {
      window.location.href = getPageUrl(pageKey);
      return;
    }

    window.location.hash = pageKey;
  }

  function handleShellToggle(action) {
    const shell = document.querySelector(".admin-shell");
    const drawer = document.querySelector(".doc-drawer");
    const backdrop = document.querySelector(".doc-backdrop");

    if (action === "sidebar") {
      if (shell) {
        shell.classList.toggle("sidebar-collapsed");
      }
      return;
    }

    if (action === "doc-open") {
      if (shell) {
        shell.classList.add("doc-open");
      }
      if (drawer) {
        drawer.classList.add("open");
      }
      if (backdrop) {
        backdrop.classList.add("visible");
      }
      return;
    }

    if (action === "doc-close") {
      if (shell) {
        shell.classList.remove("doc-open");
      }
      if (drawer) {
        drawer.classList.remove("open");
      }
      if (backdrop) {
        backdrop.classList.remove("visible");
      }
    }
  }

  function runPageSetup(pageKey, page) {
    if (!page || typeof page.setup !== "function") {
      pageCleanup = null;
      return;
    }

    const cleanup = page.setup({
      pageKey: pageKey,
      page: page,
      config: config,
      mountNode: mountNode,
      mockStore: mockStore,
      showToast: components.showToast,
      navigateToRoute: navigateToRoute,
      getRouteHref: getRouteHref
    });

    pageCleanup = typeof cleanup === "function" ? cleanup : null;
  }

  function runPageCleanup() {
    if (typeof pageCleanup !== "function") {
      pageCleanup = null;
      return;
    }

    try {
      pageCleanup();
    } finally {
      pageCleanup = null;
    }
  }

  function extractRuntimeFields(page) {
    if (!page) {
      return {};
    }

    const runtimeFields = {};
    Object.keys(page).forEach(function (key) {
      if (typeof page[key] === "function") {
        runtimeFields[key] = page[key];
      }
    });
    return runtimeFields;
  }

  function stripRuntimeFields(page) {
    if (!page) {
      return page;
    }

    const nextPage = {};
    Object.keys(page).forEach(function (key) {
      if (typeof page[key] !== "function") {
        nextPage[key] = page[key];
      }
    });
    return nextPage;
  }

  function attachRuntimeFields(page, runtimeFields) {
    return Object.assign({}, page || {}, runtimeFields || {});
  }
})();
