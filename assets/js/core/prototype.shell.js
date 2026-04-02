(function () {
  const utils = window.PROTOTYPE_UTILS;
  let toastTimer = null;

  window.PROTOTYPE_SHELL = {
    renderShell: renderShell,
    createNavigationState: createNavigationState,
    ensureActiveGroupOpen: ensureActiveGroupOpen,
    showToast: showToast,
    renderActionButton: renderActionButton,
    renderPanelHeader: renderPanelHeader,
    renderStatusPill: renderStatusPill,
    renderSummaryCard: renderSummaryCard,
    panelHeaderContext: panelHeaderContext
  };

  function renderShell(context) {
    const config = context.config;
    const activeKey = context.activeKey;
    const page = context.page;
    const pageClass = "page-" + activeKey;

    return (
      '<div class="admin-shell ' + utils.escapeAttribute(pageClass) + '">' +
      renderSidebar(context, config, activeKey) +
      '<section class="main-area">' +
      renderTopbar(context, page) +
      '<main class="content-grid">' +
      context.renderPage(context, page) +
      "</main>" +
      "</section>" +
      renderDocAnchor(page) +
      renderDocDrawer(page) +
      "</div>" +
      '<div class="doc-backdrop" data-shell-toggle="doc-close"></div>' +
      '<div id="toast" class="toast" aria-live="polite"></div>'
    );
  }

  function createNavigationState(config) {
    const initialState = {};
    (config.navigation || []).forEach(function (item) {
      if (item.children && item.children.length) {
        initialState[item.key] = true;
      }
    });
    return initialState;
  }

  function ensureActiveGroupOpen(context) {
    const config = context.config;
    const navState = context.navState;
    const activeKey = context.activeKey;

    (config.navigation || []).forEach(function (item) {
      if (!item.children || !item.children.length) {
        return;
      }

      const childIsActive = item.children.some(function (child) {
        return child.key === activeKey;
      });

      if (childIsActive) {
        navState[item.key] = true;
      }
    });
  }

  function showToast(title, message) {
    const toast = document.getElementById("toast");
    if (!toast) {
      return;
    }

    toast.innerHTML =
      '<div class="toast-title">' + utils.escapeHtml(title) + "</div>" +
      "<div>" + utils.escapeHtml(message) + "</div>";
    toast.classList.add("visible");

    if (toastTimer) {
      window.clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(function () {
      toast.classList.remove("visible");
    }, 2200);
  }

  function renderSidebar(context, config, activeKey) {
    return (
      '<aside class="sidebar">' +
      '<div class="brand">' +
      '<div class="brand-mark">' + utils.escapeHtml(config.app.brandMark) + "</div>" +
      '<h1 class="brand-title">' + utils.escapeHtml(config.app.name) + "</h1>" +
      '<p class="brand-subtitle">' + utils.escapeHtml(config.app.subtitle) + "</p>" +
      "</div>" +
      (config.app.navSectionTitle
        ? '<div class="nav-section-title">' + utils.escapeHtml(config.app.navSectionTitle) + "</div>"
        : "") +
      '<nav class="nav-links">' +
      config.navigation.map(function (item) {
        return renderNavigationItem(context, item, activeKey);
      }).join("") +
      "</nav>" +
      '<div class="sidebar-footer">' +
      config.app.footerItems.map(function (item) {
        return "<div>" + utils.escapeHtml(item) + "</div>";
      }).join("") +
      "</div>" +
      "</aside>"
    );
  }

  function renderNavigationItem(context, item, activeKey) {
    if (item.children && item.children.length) {
      return renderNavigationGroup(context, item, activeKey);
    }

    const isActive = item.key === activeKey ? " active" : "";
    return (
      '<a class="nav-link' +
      isActive +
      '" href="' +
      utils.escapeAttribute(context.getRouteHref(item.key)) +
      '" data-route="' +
      utils.escapeAttribute(item.key) +
      '">' +
      renderNavIcon(item.icon) +
      '<span class="nav-link-label">' + utils.escapeHtml(item.label) + "</span>" +
      "</a>"
    );
  }

  function renderNavigationGroup(context, group, activeKey) {
    const isOpen = !!context.navState[group.key];

    return (
      '<div class="nav-group' + (isOpen ? " open" : "") + '">' +
      '<button class="nav-group-header" type="button" data-nav-toggle="' + utils.escapeAttribute(group.key) + '">' +
      '<div class="nav-group-title">' +
      renderNavIcon(group.icon) +
      '<span class="nav-group-label">' + utils.escapeHtml(group.label) + "</span>" +
      "</div>" +
      '<span class="nav-group-arrow">' + (isOpen ? "&#9662;" : "&#9656;") + "</span>" +
      "</button>" +
      '<div class="nav-sub-links">' +
      group.children.map(function (child) {
        const isActive = child.key === activeKey ? " active" : "";
        return (
          '<a class="nav-sub-link' +
          isActive +
          '" href="' +
          utils.escapeAttribute(context.getRouteHref(child.key)) +
          '" data-route="' +
          utils.escapeAttribute(child.key) +
          '">' +
          utils.escapeHtml(child.label) +
          "</a>"
        );
      }).join("") +
      "</div>" +
      "</div>"
    );
  }

  function renderNavIcon(iconLabel) {
    return (
      '<span class="nav-icon" aria-hidden="true">' +
      '<span class="nav-icon-stack">' +
      '<span class="nav-icon-line nav-icon-line-top"></span>' +
      '<span class="nav-icon-line nav-icon-line-middle"></span>' +
      '<span class="nav-icon-line nav-icon-line-bottom"></span>' +
      "</span>" +
      (iconLabel ? '<span class="nav-icon-text">' + utils.escapeHtml(iconLabel) + "</span>" : "") +
      "</span>"
    );
  }

  function renderTopbar(context, page) {
    const breadcrumb = getBreadcrumb(context.config, context.activeKey, page);

    return (
      '<header class="topbar">' +
      '<div class="topbar-left">' +
      '<button class="shell-icon-button" type="button" data-shell-toggle="sidebar" aria-label="' + "\u5207\u6362\u4fa7\u8fb9\u680f" + '">' +
      '<span class="shell-icon-line"></span>' +
      '<span class="shell-icon-line"></span>' +
      '<span class="shell-icon-line"></span>' +
      "</button>" +
      '<div class="page-breadcrumb">' +
      '<span class="page-breadcrumb-section">' + utils.escapeHtml(breadcrumb.section) + "</span>" +
      '<span class="page-breadcrumb-separator">/</span>' +
      '<span class="page-breadcrumb-current">' + utils.escapeHtml(breadcrumb.current) + "</span>" +
      "</div>" +
      "</div>" +
      "</header>"
    );
  }

  function renderActionButton(button, context) {
    const title = button && button.toastTitle ? button.toastTitle : (button && button.label ? button.label : "\u64cd\u4f5c");
    const message = button && button.toastMessage ? button.toastMessage : "\u5f53\u524d\u64cd\u4f5c\u4ec5\u7528\u4e8e\u539f\u578b\u6f14\u793a\u3002";
    const route = resolveRoute(button, context);

    return (
      '<button class="' +
      utils.escapeAttribute(button.variant) +
      '"' +
      (route ? ' data-route="' + utils.escapeAttribute(route) + '"' : "") +
      (!route ? ' data-toast-title="' + utils.escapeAttribute(title) + '"' : "") +
      (!route ? ' data-toast-message="' + utils.escapeAttribute(message) + '"' : "") +
      ">" +
      utils.escapeHtml(button.label) +
      "</button>"
    );
  }

  function renderDocAnchor(page) {
    if (!getProductDoc(page)) {
      return "";
    }

    return (
      '<div class="floating-doc-actions">' +
      '<a class="floating-doc-button floating-home-button" href="../index.html">' + "\u56de\u5230\u9996\u9875" + "</a>" +
      '<button class="floating-doc-button" type="button" data-shell-toggle="doc-open">' + "\u9700\u6c42\u8bf4\u660e" + "</button>" +
      "</div>"
    );
  }

  function renderDocDrawer(page) {
    const doc = getProductDoc(page);

    if (!doc) {
      return "";
    }

    return (
      '<aside class="doc-drawer" aria-label="' + "\u9700\u6c42\u8bf4\u660e" + '">' +
      '<div class="doc-drawer-header">' +
      "<div>" +
      '<div class="doc-drawer-eyebrow">' + "\u9700\u6c42\u8bf4\u660e" + "</div>" +
      '<h3 class="doc-drawer-title">' + utils.escapeHtml(doc.title || page.heading || "\u9700\u6c42\u8bf4\u660e") + "</h3>" +
      "</div>" +
      '<button class="doc-drawer-close" type="button" data-shell-toggle="doc-close" aria-label="' + "\u5173\u95ed\u9700\u6c42\u8bf4\u660e" + '">×</button>' +
      "</div>" +
      (doc.summary
        ? '<p class="doc-drawer-summary">' + utils.escapeHtml(doc.summary) + "</p>"
        : "") +
      '<div class="doc-drawer-body">' +
      renderDocBlock("\u9875\u9762\u76ee\u7684", doc.goal ? [doc.goal] : []) +
      renderDocBlock("\u6838\u5fc3\u5185\u5bb9", doc.modules) +
      renderDocBlock("\u5b9e\u73b0\u8981\u70b9", doc.rules) +
      renderDocBlock("\u9a8c\u6536\u53e3\u5f84", doc.interactions) +
      "</div>" +
      "</aside>"
    );
  }

  function getProductDoc(page) {
    if (!page) {
      return null;
    }

    if (page.productDoc) {
      return page.productDoc;
    }

    if (!page.heading) {
      return null;
    }

    const modules = [];
    if (page.tablePanel && page.tablePanel.title) {
      modules.push(page.tablePanel.title);
    }
    if (page.formPanel && page.formPanel.title) {
      modules.push(page.formPanel.title);
    }
    if (page.previewTablePanel && page.previewTablePanel.title) {
      modules.push(page.previewTablePanel.title);
    }
    if (page.assistPanel && page.assistPanel.title) {
      modules.push(page.assistPanel.title);
    }

    return {
      title: page.heading + "需求说明",
      summary: page.subtitle || "用于快速理解当前原型页的目的、范围和实现落点。",
      goal: "供研发、设计和测试快速理解“" + page.heading + "”页面的业务目的与原型范围。",
      modules: modules.length ? modules : ["页面主体内容", "关键操作入口", "主要状态展示"],
      rules: [
        "当前页面以原型演示为主，不直接对接真实后端服务。",
        "页面中的按钮、链接和弹窗优先表达业务意图与流程走向。"
      ],
      interactions: [
        "关键入口应能正确触发对应页面跳转、弹窗或反馈。",
        "页面中的状态、筛选和列表结果应保持一致。"
      ]
    };
  }

  function renderDocBlock(title, items) {
    if (!Array.isArray(items) || !items.length) {
      return "";
    }

    return (
      '<section class="doc-block">' +
      '<h4 class="doc-block-title">' + utils.escapeHtml(title) + "</h4>" +
      '<div class="doc-block-card">' +
      items.map(function (item) {
        return '<div class="doc-list-row">' + utils.escapeHtml(item) + "</div>";
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderDocFields(fields) {
    if (!Array.isArray(fields) || !fields.length) {
      return "";
    }

    return (
      '<section class="doc-block">' +
      '<h4 class="doc-block-title">' + "\u5173\u952e\u5b57\u6bb5" + "</h4>" +
      '<div class="doc-field-list">' +
      fields.map(function (field) {
        return (
          '<div class="doc-field-item">' +
          '<div class="doc-field-label">' + utils.escapeHtml(field.label || "") + "</div>" +
          '<div class="doc-field-value">' + utils.escapeHtml(field.value || "") + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderPanelHeader(context, panel) {
    if (!panel || (!panel.title && !panel.subtitle && !(panel.action && context))) {
      return "";
    }

    const action = panel.action && context
      ? '<a class="button-link" href="' +
        utils.escapeAttribute(context.getRouteHref(panel.action.route)) +
        '" data-route="' +
        utils.escapeAttribute(panel.action.route) +
        '">' +
        utils.escapeHtml(panel.action.label) +
        "</a>"
      : "";
    const subtitle = panel.subtitle
      ? '<p class="panel-subtitle">' + utils.escapeHtml(panel.subtitle) + "</p>"
      : "";

    return (
      '<div class="panel-header">' +
      "<div>" +
      (panel.title ? '<h3 class="panel-title">' + utils.escapeHtml(panel.title) + "</h3>" : "") +
      subtitle +
      "</div>" +
      action +
      "</div>"
    );
  }

  function renderStatusPill(tone, label) {
    return '<span class="status-pill ' + utils.escapeAttribute(tone || "") + '">' + utils.escapeHtml(label) + "</span>";
  }

  function renderSummaryCard(card) {
    return (
      '<article class="summary-card ' +
      utils.escapeAttribute(card.tone || "") +
      '">' +
      '<div class="summary-label">' + utils.escapeHtml(card.label) + "</div>" +
      '<div class="summary-value">' + utils.escapeHtml(card.value) + "</div>" +
      '<div class="table-meta">' + utils.escapeHtml(card.footnote || "") + "</div>" +
      "</article>"
    );
  }

  function panelHeaderContext(context, panel) {
    if (!panel.action) {
      return null;
    }

    return context;
  }

  function getBreadcrumb(config, activeKey, page) {
    const currentLabel = page && page.heading ? page.heading : activeKey;
    const breadcrumbTrail = page && Array.isArray(page.breadcrumbTrail) ? page.breadcrumbTrail : [];
    const navigation = config && Array.isArray(config.navigation) ? config.navigation : [];
    let sectionLabel = "\u9875\u9762";

    if (breadcrumbTrail.length) {
      sectionLabel = breadcrumbTrail[0] || sectionLabel;
      return {
        section: sectionLabel,
        current: currentLabel
      };
    }

    navigation.some(function (item) {
      if (item.key === activeKey) {
        sectionLabel = item.label || sectionLabel;
        return true;
      }

      if (!Array.isArray(item.children)) {
        return false;
      }

      const matchedChild = item.children.some(function (child) {
        return child.key === activeKey;
      });

      if (matchedChild) {
        sectionLabel = item.label || sectionLabel;
      }

      return matchedChild;
    });

    return {
      section: sectionLabel,
      current: currentLabel
    };
  }

  function isDocAction(action) {
    if (!action || !action.label) {
      return false;
    }

    return /页面说明|需求说明/.test(action.label);
  }

  function getTopbarActions(page) {
    const actions = Array.isArray(page && page.topbarActions) ? page.topbarActions.slice() : [];

    if (!actions.length) {
      return actions;
    }

    const filteredActions = actions.filter(function (action) {
      return !isDocAction(action);
    });

    if (filteredActions.length !== actions.length) {
      return filteredActions;
    }

    if (page && page.productDoc) {
      return actions.slice(1);
    }

    return actions;
  }

  function resolveRoute(button, context) {
    if (!button || !button.route) {
      return "";
    }

    return button.route;
  }
})();
