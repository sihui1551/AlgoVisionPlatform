(function () {
  const DEVICE_ROWS = [
    {
      id: "gb-001",
      name: "IP CAMERA",
      deviceId: "44130300001320000017",
      address: "tcp://172.23.3.181:50311",
      vendor: "Hikvision",
      transportMode: "TCP被动模式",
      transportOptions: ["TCP被动模式", "TCP主动模式", "UDP模式"],
      channelCount: "1",
      status: "online",
      statusLabel: "在线",
      subscribeCatalog: false,
      subscribePosition: false,
      heartbeatAt: "2026-03-22 20:21:49",
      registerAt: "2026-03-22 20:08:42"
    },
    {
      id: "gb-002",
      name: "IP DOME",
      deviceId: "34020000001320000010",
      address: "tcp://172.23.8.170:63153",
      vendor: "Hikvision",
      transportMode: "TCP被动模式",
      transportOptions: ["TCP被动模式", "TCP主动模式", "UDP模式"],
      channelCount: "1",
      status: "offline",
      statusLabel: "离线",
      subscribeCatalog: false,
      subscribePosition: true,
      heartbeatAt: "2026-03-20 12:33:56",
      registerAt: "2026-03-20 12:27:56"
    }
  ];

  const COLUMNS = [
    { key: "name", label: "名称" },
    { key: "deviceId", label: "设备编号" },
    { key: "address", label: "地址" },
    { key: "vendor", label: "厂家" },
    { key: "transportMode", label: "流传输模式" },
    { key: "channelCount", label: "通道数" },
    { key: "status", label: "状态" },
    { key: "subscribe", label: "订阅" },
    { key: "heartbeatAt", label: "最近心跳" },
    { key: "registerAt", label: "最近注册" },
    { key: "actions", label: "操作" }
  ];

  window.registerPrototypePage({
    key: "gb-device",
    styleSource: "resources/css/pages/gb-device.css",
    kind: "table",
    heading: "国标设备",
    subtitle: "查看国标设备在线情况、订阅状态与接入信息。",
    tablePanel: {},
    countTextPrefix: "共",
    countTextUnit: "台设备",
    emptyText: "暂无国标设备",
    gbDevicePage: {
      columns: COLUMNS,
      rows: DEVICE_ROWS,
      searchFields: ["name", "deviceId", "address", "vendor"],
      accessInfo: {
        code: "44130240202000000001",
        region: "4413024020",
        ip: "192.168.224.115",
        port: "18116",
        password: "12345678"
      },
      statusOptions: [
        { value: "", label: "请选择" },
        { value: "online", label: "在线" },
        { value: "offline", label: "离线" }
      ]
    },
    renderTablePanel: function (context) {
      const page = context.page;
      const rows = page.gbDevicePage.rows || [];
      return (
        '<section class="panel gb-device-panel">' +
        '<div class="table-toolbar gb-device-toolbar">' +
        '<div class="toolbar-group gb-device-toolbar-main">' +
        '<label class="gb-device-filter">' +
        '<span class="gb-device-filter-label">搜索</span>' +
        '<input id="gb-device-search" class="filter-field gb-device-search" type="search" placeholder="关键字" />' +
        '</label>' +
        '<label class="gb-device-filter">' +
        '<span class="gb-device-filter-label">在线状态</span>' +
        renderStatusSelect(page.gbDevicePage.statusOptions || []) +
        "</label>" +
        '<button class="button gb-device-primary-action" type="button" data-route="gb-device-create">+ 添加设备</button>' +
        '<button class="button-secondary gb-device-secondary-action" type="button" data-gb-device-modal-open="access-info">接入信息</button>' +
        "</div>" +
        '<button id="gb-device-refresh" class="gb-device-refresh" type="button" aria-label="刷新" data-toast-title="刷新设备" data-toast-message="当前原型已刷新国标设备列表。">↻</button>' +
        "</div>" +
        '<div class="table-shell gb-device-table-shell">' +
        "<table>" +
        "<thead><tr>" +
        rowsHeader(page.gbDevicePage.columns || []) +
        '</tr></thead><tbody id="gb-device-table-body">' +
        rows.map(renderDeviceRow).join("") +
        "</tbody></table>" +
        "</div>" +
        '<div class="table-footer gb-device-footer">' +
        '<div class="table-footer-count hint-text" id="gb-device-count"></div>' +
        "</div>" +
        renderFloatingOperationMenu() +
        renderAccessInfoModal(page.gbDevicePage.accessInfo || {}) +
        "</section>"
      );
    },
    setup: function (context) {
      const utils = window.PROTOTYPE_UTILS;
      const page = context.page;
      const searchInput = document.getElementById("gb-device-search");
      const statusSelect = document.getElementById("gb-device-status");
      const refreshButton = document.getElementById("gb-device-refresh");
      const tbody = document.getElementById("gb-device-table-body");
      const countNode = document.getElementById("gb-device-count");
      const root = context.mountNode;
      const modal = document.getElementById("gb-device-access-modal");
      const modalBackdrop = document.getElementById("gb-device-access-backdrop");
      const floatingMenu = document.getElementById("gb-device-floating-menu");
      let activeMenuRow = null;

      function updateTable() {
        const keyword = utils.normalize(searchInput ? searchInput.value : "");
        const status = statusSelect ? statusSelect.value : "";
        const rows = (page.gbDevicePage.rows || []).filter(function (row) {
          const keywordMatch =
            !keyword ||
            (page.gbDevicePage.searchFields || []).some(function (field) {
              return utils.normalize(row[field]).includes(keyword);
            });
          const statusMatch = !status || row.status === status;
          return keywordMatch && statusMatch;
        });

        if (tbody) {
          tbody.innerHTML = rows.length
            ? rows.map(renderDeviceRow).join("")
            : renderEmptyRow(page.gbDevicePage.columns.length, page.emptyText);
        }

        if (countNode) {
          countNode.textContent = page.countTextPrefix + rows.length + page.countTextUnit;
        }

        activeMenuRow = null;
        syncMenus();
      }

      function handleRefresh() {
        updateTable();
      }

      function handleTransportChange(event) {
        const select = event.target.closest(".gb-device-transport-select");
        if (!select) {
          return;
        }

        context.showToast(
          "流传输模式",
          "已切换 " + (select.getAttribute("data-device-name") || "当前设备") + " 的传输模式为 " + select.value + "。"
        );
      }

      function openAccessModal() {
        if (!modal || !modalBackdrop) {
          return;
        }
        modal.classList.add("visible");
        modalBackdrop.classList.add("visible");
        document.body.classList.add("gb-device-modal-open");
      }

      function closeAccessModal() {
        if (!modal || !modalBackdrop) {
          return;
        }
        modal.classList.remove("visible");
        modalBackdrop.classList.remove("visible");
        document.body.classList.remove("gb-device-modal-open");
      }

      function syncMenus() {
        const triggerNodes = root ? root.querySelectorAll("[data-gb-device-menu-trigger]") : [];

        triggerNodes.forEach(function (node) {
          const isActive = !!activeMenuRow && node.getAttribute("data-gb-device-menu-trigger") === activeMenuRow.id;
          node.classList.toggle("active", isActive);
        });

        if (!floatingMenu) {
          return;
        }

        if (!activeMenuRow) {
          floatingMenu.classList.remove("visible");
          floatingMenu.style.left = "";
          floatingMenu.style.top = "";
          return;
        }

        const trigger = root ? root.querySelector('[data-gb-device-menu-trigger="' + activeMenuRow.id + '"]') : null;
        if (!trigger) {
          activeMenuRow = null;
          floatingMenu.classList.remove("visible");
          return;
        }

        const rect = trigger.getBoundingClientRect();
        floatingMenu.style.left = Math.max(16, rect.right - 198) + "px";
        floatingMenu.style.top = rect.bottom + 12 + "px";
        floatingMenu.classList.add("visible");

        updateFloatingMenuAction("delete", "删除设备", "当前原型预留 " + activeMenuRow.name + " 的删除流程。");
        updateFloatingMenuAction("arm", "设备布防", "当前原型模拟对 " + activeMenuRow.name + " 执行布防。");
        updateFloatingMenuAction("disarm", "设备撤防", "当前原型模拟对 " + activeMenuRow.name + " 执行撤防。");
        updateFloatingMenuAction("sync", "配置同步", "当前原型模拟对 " + activeMenuRow.name + " 执行基础配置同步。");
      }

      function updateFloatingMenuAction(action, title, message) {
        if (!floatingMenu) {
          return;
        }

        const button = floatingMenu.querySelector('[data-gb-device-floating-action="' + action + '"]');
        if (!button) {
          return;
        }

        button.setAttribute("data-toast-title", title);
        button.setAttribute("data-toast-message", message);
      }

      function handleClick(event) {
        const openTrigger = event.target.closest("[data-gb-device-modal-open]");
        if (openTrigger) {
          openAccessModal();
          return;
        }

        const closeTrigger = event.target.closest("[data-gb-device-modal-close]");
        if (closeTrigger) {
          closeAccessModal();
          return;
        }

        const menuTrigger = event.target.closest("[data-gb-device-menu-trigger]");
        if (menuTrigger) {
          const menuId = menuTrigger.getAttribute("data-gb-device-menu-trigger") || "";
          const nextRow = (page.gbDevicePage.rows || []).find(function (row) {
            return row.id === menuId;
          }) || null;
          activeMenuRow = activeMenuRow && activeMenuRow.id === menuId ? null : nextRow;
          syncMenus();
          return;
        }

        const menuItem = event.target.closest("[data-gb-device-menu-item]");
        if (menuItem) {
          activeMenuRow = null;
          syncMenus();
          return;
        }

        if (!event.target.closest(".gb-device-operation-menu-wrap") && !event.target.closest("#gb-device-floating-menu")) {
          activeMenuRow = null;
          syncMenus();
        }
      }

      function handleWindowSync() {
        if (activeMenuRow) {
          syncMenus();
        }
      }

      if (searchInput) {
        searchInput.addEventListener("input", updateTable);
      }

      if (statusSelect) {
        statusSelect.addEventListener("change", updateTable);
      }

      if (refreshButton) {
        refreshButton.addEventListener("click", handleRefresh);
      }

      if (root) {
        root.addEventListener("change", handleTransportChange);
        root.addEventListener("click", handleClick);
      }

      window.addEventListener("resize", handleWindowSync);
      window.addEventListener("scroll", handleWindowSync, true);

      updateTable();
      syncMenus();

      return function () {
        closeAccessModal();
        activeMenuRow = null;
        syncMenus();
        if (searchInput) {
          searchInput.removeEventListener("input", updateTable);
        }
        if (statusSelect) {
          statusSelect.removeEventListener("change", updateTable);
        }
        if (refreshButton) {
          refreshButton.removeEventListener("click", handleRefresh);
        }
        if (root) {
          root.removeEventListener("change", handleTransportChange);
          root.removeEventListener("click", handleClick);
        }
        window.removeEventListener("resize", handleWindowSync);
        window.removeEventListener("scroll", handleWindowSync, true);
      };
    }
  });

  function rowsHeader(columns) {
    const utils = window.PROTOTYPE_UTILS;
    return columns.map(function (column) {
      return "<th>" + utils.escapeHtml(column.label) + "</th>";
    }).join("");
  }

  function renderStatusSelect(options) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<select id="gb-device-status" class="filter-field gb-device-select">' +
      options.map(function (option) {
        return '<option value="' + utils.escapeAttribute(option.value) + '">' + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderDeviceRow(row) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      "<tr>" +
      "<td><strong>" + utils.escapeHtml(row.name) + "</strong></td>" +
      "<td>" + utils.escapeHtml(row.deviceId) + "</td>" +
      '<td><button class="gb-device-link-chip" type="button" data-toast-title="设备地址" data-toast-message="' + utils.escapeAttribute("已查看 " + row.name + " 的接入地址。") + '">' + utils.escapeHtml(row.address) + "</button></td>" +
      "<td>" + utils.escapeHtml(row.vendor) + "</td>" +
      "<td>" + renderTransportSelect(row) + "</td>" +
      '<td class="gb-device-channel-count">' + utils.escapeHtml(row.channelCount) + "</td>" +
      '<td><span class="status-pill ' + utils.escapeAttribute(row.status) + '">' + utils.escapeHtml(row.statusLabel) + "</span></td>" +
      "<td>" + renderSubscriptionCell(row) + "</td>" +
      "<td>" + utils.escapeHtml(row.heartbeatAt) + "</td>" +
      "<td>" + utils.escapeHtml(row.registerAt) + "</td>" +
      '<td class="gb-device-operation-cell">' + renderActionCell(row) + "</td>" +
      "</tr>"
    );
  }

  function renderTransportSelect(row) {
    const utils = window.PROTOTYPE_UTILS;
    const options = row.transportOptions || [];
    return (
      '<select class="gb-device-transport-select" data-device-name="' + utils.escapeAttribute(row.name) + '">' +
      options.map(function (option) {
        const selected = option === row.transportMode ? ' selected="selected"' : "";
        return '<option value="' + utils.escapeAttribute(option) + '"' + selected + ">" + utils.escapeHtml(option) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderSubscriptionCell(row) {
    return (
      '<div class="gb-device-subscriptions">' +
      renderCheckbox("目录", row.subscribeCatalog) +
      renderCheckbox("位置", row.subscribePosition) +
      "</div>"
    );
  }

  function renderCheckbox(label, checked) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<label class="gb-device-check-item">' +
      '<input type="checkbox"' + (checked ? ' checked="checked"' : "") + " />" +
      '<span>' + utils.escapeHtml(label) + "</span>" +
      "</label>"
    );
  }

  function renderActionCell(row) {
    return (
      '<div class="table-actions gb-device-actions">' +
      renderActionButton("刷新", "刷新设备", "已刷新 " + row.name + " 的状态。") +
      '<span class="gb-device-action-separator">|</span>' +
      renderActionButton("通道", "设备通道", "已查看 " + row.name + " 的通道信息。", "gb-channel-list") +
      '<span class="gb-device-action-separator">|</span>' +
      renderActionButton("编辑", "编辑设备", "当前原型预留 " + row.name + " 的编辑入口。", "gb-device-edit") +
      '<span class="gb-device-action-separator">|</span>' +
      renderOperationMenu(row) +
      "</div>"
    );
  }

  function renderActionButton(label, title, message, route) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="table-action gb-device-action-link" type="button"' +
      (route ? ' data-route="' + utils.escapeAttribute(route) + '"' : ' data-toast-title="' + utils.escapeAttribute(title) + '" data-toast-message="' + utils.escapeAttribute(message) + '"') +
      ">" +
      utils.escapeHtml(label) +
      "</button>"
    );
  }

  function renderEmptyRow(columnCount, emptyText) {
    const utils = window.PROTOTYPE_UTILS;
    return '<tr><td colspan="' + columnCount + '"><div class="empty-state">' + utils.escapeHtml(emptyText) + "</div></td></tr>";
  }

  function renderOperationMenu(row) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="gb-device-operation-menu-wrap">' +
      '<button class="table-action gb-device-action-link gb-device-operation-trigger" type="button" data-gb-device-menu-trigger="' + utils.escapeAttribute(row.id) + '">' +
      '操作 <span class="gb-device-operation-caret">∨</span>' +
      "</button>" +
      "</div>"
    );
  }

  function renderFloatingOperationMenu() {
    return (
      '<div id="gb-device-floating-menu" class="gb-device-floating-menu">' +
      renderOperationItem("删除", "", "", true, "delete") +
      renderOperationItem("布防", "", "", false, "arm") +
      renderOperationItem("撤防", "", "", false, "disarm") +
      renderOperationItem("基础配置同步", "", "", false, "sync") +
      "</div>"
    );
  }

  function renderOperationItem(label, title, message, danger, actionKey) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="gb-device-operation-item' + (danger ? " danger" : "") + '" type="button" data-gb-device-menu-item="true"' +
      (actionKey ? ' data-gb-device-floating-action="' + utils.escapeAttribute(actionKey) + '"' : "") +
      ' data-toast-title="' + utils.escapeAttribute(title) + '" data-toast-message="' + utils.escapeAttribute(message) + '">' +
      utils.escapeHtml(label) +
      "</button>"
    );
  }

  function renderAccessInfoModal(accessInfo) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div id="gb-device-access-backdrop" class="gb-device-modal-backdrop"></div>' +
      '<section id="gb-device-access-modal" class="gb-device-modal" aria-hidden="true">' +
      '<div class="gb-device-modal-header">' +
      '<h3 class="gb-device-modal-title">接入信息</h3>' +
      '<button class="gb-device-modal-close" type="button" data-gb-device-modal-close="access-info" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="gb-device-modal-body">' +
      '<h4 class="gb-device-modal-subtitle">国标服务信息</h4>' +
      '<div class="gb-device-modal-grid">' +
      renderAccessInfoItem("编号", accessInfo.code) +
      renderAccessInfoItem("域", accessInfo.region) +
      renderAccessInfoItem("IP", accessInfo.ip) +
      renderAccessInfoItem("端口", accessInfo.port) +
      renderAccessInfoItem("密码", accessInfo.password, true) +
      "</div>" +
      "</div>" +
      "</section>"
    );
  }

  function renderAccessInfoItem(label, value, highlight) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="gb-device-modal-item">' +
      '<span class="gb-device-modal-item-label">' + utils.escapeHtml(label) + ":</span>" +
      (highlight
        ? '<span class="gb-device-modal-password">' + utils.escapeHtml(value || "--") + "</span>"
        : '<span class="gb-device-modal-item-value">' + utils.escapeHtml(value || "--") + "</span>") +
      "</div>"
    );
  }
})();
