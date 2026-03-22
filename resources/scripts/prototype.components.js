(function () {
  const shell = window.PROTOTYPE_SHELL;
  const dashboard = window.PROTOTYPE_DASHBOARD;
  const table = window.PROTOTYPE_TABLE;

  if (!shell || !dashboard || !table) {
    return;
  }

  window.PROTOTYPE_COMPONENTS = {
    renderShell: renderShell,
    bindTablePage: table.bindTablePage,
    createNavigationState: shell.createNavigationState,
    ensureActiveGroupOpen: shell.ensureActiveGroupOpen,
    showToast: shell.showToast
  };

  function renderShell(context) {
    return shell.renderShell(Object.assign({}, context, {
      renderPage: renderPage
    }));
  }

  function renderPage(context, page) {
    if (page.streamTaskPage || page.offlineTaskPage) {
      return table.renderTablePage(page);
    }

    if (page.kind === "dashboard") {
      return dashboard.renderDashboardPage(context, page);
    }

    if (page.kind === "table") {
      return table.renderTablePage(page);
    }

    return "";
  }
})();
