(function () {
  const config = window.PROTOTYPE_CONFIG || {};
  const portal = config.portal || {};
  const pageRegistry = config.pageRegistry || {};
  const app = config.app || {};
  const root = document.getElementById("portal-root");
  const sections = ensureList(portal.sections);
  let activeSectionKey = resolveInitialSectionKey();

  if (!root) {
    return;
  }

  renderPage();
  bindEvents();

  function renderPage() {
    root.innerHTML = [
      renderIntro(),
      renderWorkspace()
    ].join("");
  }

  function renderIntro() {
    const hero = portal.hero || {};
    const version = portal.overview && portal.overview.version ? portal.overview.version : "Portal";

    return (
      '<section class="portal-intro">' +
      '<div class="portal-intro__head">' +
      '<div class="portal-intro__main">' +
      '<h2 class="portal-intro__title">' + escapeHtml(hero.title || app.name || "项目总入口") + "</h2>" +
      "</div>" +
      '<span class="portal-intro__chip">' + escapeHtml(version) + "</span>" +
      "</div>" +
      '<div class="portal-intro__actions">' +
      ensureList(hero.actions).map(renderActionButton).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderWorkspace() {
    const activeSection = getActiveSection();

    return (
      '<section class="portal-workspace">' +
      renderSidebar() +
      '<article class="portal-main" id="portal-main">' +
      renderSectionContent(activeSection) +
      "</article>" +
      "</section>"
    );
  }

  function renderSidebar() {
    return (
      '<aside class="portal-sidebar">' +
      '<div class="portal-sidebar__header">' +
      '<h3 class="portal-sidebar__title">入口分类</h3>' +
      "</div>" +
      '<div class="portal-sidebar__nav">' +
      sections.map(function (section) {
        const active = section.key === activeSectionKey;
        return (
          '<button class="portal-sidebar__button' + (active ? " is-active" : "") + '" type="button" data-portal-section="' + escapeAttribute(section.key || "") + '">' +
          '<span class="portal-sidebar__button-title">' + escapeHtml(section.title || "") + "</span>" +
          "</button>"
        );
      }).join("") +
      "</div>" +
      "</aside>"
    );
  }

  function renderSectionContent(section) {
    if (!section) {
      return (
        '<div class="portal-main__empty">' +
        '<h3>暂无入口</h3>' +
        "<p>当前分类尚未配置入口。</p>" +
        "</div>"
      );
    }

    return (
      '<div class="portal-main__header">' +
      '<p class="portal-main__eyebrow">当前分类</p>' +
      '<h3 class="portal-main__title">' + escapeHtml(section.title || "") + "</h3>" +
      '<p class="portal-main__summary">' + escapeHtml(section.description || "") + "</p>" +
      "</div>" +
      '<div class="portal-main__links">' +
      ensureList(section.items).map(renderSectionLink).join("") +
      "</div>"
    );
  }

  function renderSectionLink(item) {
    const href = resolveHref(item);
    const isPlanned = item.status === "planned" || !href;
    const className = "portal-link-button" + (isPlanned ? " portal-link-button--planned" : "");

    return isPlanned
      ? '<span class="' + className + '">' + escapeHtml(item.label || "") + "</span>"
      : '<a class="' + className + '" href="' + escapeAttribute(href) + '">' + escapeHtml(item.label || "") + "</a>";
  }

  function bindEvents() {
    root.addEventListener("click", function (event) {
      const target = event.target.closest("[data-portal-section]");
      if (!target) {
        return;
      }

      const key = target.getAttribute("data-portal-section") || "";
      if (!key || key === activeSectionKey) {
        return;
      }

      activeSectionKey = key;
      syncSectionHash(key);
      renderPage();
    });
  }

  function renderActionButton(action) {
    const href = resolveHref(action);
    const variant = action.variant || "secondary";

    if (!href) {
      return "";
    }

    return '<a class="portal-action portal-action--' + escapeAttribute(variant) + '" href="' + escapeAttribute(href) + '">' + escapeHtml(action.label || "") + "</a>";
  }

  function getActiveSection() {
    return sections.find(function (section) {
      return section.key === activeSectionKey;
    }) || sections[0] || null;
  }

  function resolveInitialSectionKey() {
    const hashKey = String((window.location.hash || "").replace(/^#/, "")).trim();
    const matched = sections.find(function (section) {
      return section.key === hashKey;
    });

    if (matched) {
      return matched.key;
    }

    return sections[0] && sections[0].key ? sections[0].key : "";
  }

  function syncSectionHash(key) {
    if (!key || !window.history || typeof window.history.replaceState !== "function") {
      return;
    }

    const nextUrl = window.location.pathname + window.location.search + "#" + encodeURIComponent(key);
    window.history.replaceState(null, "", nextUrl);
  }

  function resolveHref(item) {
    if (!item) {
      return "";
    }

    if (item.href) {
      return item.href;
    }

    if (item.route && pageRegistry[item.route]) {
      return "./pages/" + pageRegistry[item.route].file;
    }

    return "";
  }

  function ensureList(value) {
    return Array.isArray(value) ? value : [];
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
