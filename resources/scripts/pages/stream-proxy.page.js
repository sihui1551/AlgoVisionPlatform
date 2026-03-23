(function () {
  const PROXY_ROWS = [
    {
      id: "proxy-001",
      appName: "固定地址1",
      streamId: "test1",
      streamUrl: "rtsp://admin:unionman2025@172.23.8.170:554/h264/ch1/main/av_stream",
      mediaServer: "zlmediakit-local",
      proxyMode: "默认",
      gbCode: "44130300001320000017",
      pullStatus: "idle",
      pullStatusLabel: "暂未拉流",
      enabled: "enabled",
      enabledLabel: "已启用",
      createdAt: "2026-03-20 14:21:12"
    },
    {
      id: "proxy-002",
      appName: "拉流测试",
      streamId: "123456",
      streamUrl: "rtsp://172.23.3.33:554/test",
      mediaServer: "zlmediakit-local",
      proxyMode: "默认",
      gbCode: "44130300001320000018",
      pullStatus: "idle",
      pullStatusLabel: "暂未拉流",
      enabled: "enabled",
      enabledLabel: "已启用",
      createdAt: "2026-03-06 11:03:43"
    }
  ];

  window.registerPrototypePage({
    key: "stream-proxy",
    styleSource: "resources/css/pages/stream-proxy.css",
    kind: "table",
    heading: "拉流代理",
    subtitle: "查看拉流代理配置、拉流状态和启用状态。",
    breadcrumbTrail: ["接入管理"],
    emptyText: "暂无拉流代理",
    streamProxyPage: {
      rows: PROXY_ROWS,
      searchFields: ["appName", "streamId", "streamUrl", "mediaServer"],
      mediaOptions: [
        { value: "", label: "全部" },
        { value: "zlmediakit-local", label: "zlmediakit-local" }
      ],
      pullStatusOptions: [
        { value: "", label: "全部" },
        { value: "running", label: "拉流中" },
        { value: "idle", label: "暂未拉流" }
      ]
    },
    renderTablePanel: function (context) {
      const page = context.page;
      const proxyPage = page.streamProxyPage || {};
      const rows = proxyPage.rows || [];

      return (
        '<section class="panel stream-proxy-panel">' +
        '<div class="stream-proxy-toolbar">' +
        '<div class="stream-proxy-filters">' +
        renderFilterField(
          "搜索",
          '<input id="stream-proxy-search" class="filter-field stream-proxy-search" type="search" placeholder="关键字" />'
        ) +
        renderFilterField("流媒体", renderSelect("stream-proxy-media", proxyPage.mediaOptions || [])) +
        renderFilterField("拉流状态", renderSelect("stream-proxy-status", proxyPage.pullStatusOptions || [])) +
        '<button class="button stream-proxy-add" type="button" data-route="stream-proxy-create" data-stream-proxy-add="true">+ 添加代理</button>' +
        "</div>" +
        '<button id="stream-proxy-refresh" class="stream-proxy-refresh" type="button" aria-label="刷新" data-toast-title="刷新列表" data-toast-message="当前原型已刷新拉流代理列表。">↻</button>' +
        "</div>" +
        '<div class="table-shell stream-proxy-table-shell">' +
        "<table>" +
        "<thead><tr>" +
        "<th>流应用名</th>" +
        "<th>流ID</th>" +
        "<th>流地址</th>" +
        "<th>流媒体</th>" +
        "<th>代理方式</th>" +
        "<th>国标编码</th>" +
        "<th>拉流状态</th>" +
        "<th>启用</th>" +
        "<th>创建时间</th>" +
        "<th>操作</th>" +
        '</tr></thead><tbody id="stream-proxy-table-body">' +
        rows.map(renderRow).join("") +
        "</tbody></table>" +
        "</div>" +
        "</section>" +
        renderPlayerModal()
      );
    },
    setup: function (context) {
      const utils = window.PROTOTYPE_UTILS;
      const page = context.page;
      const proxyPage = page.streamProxyPage || {};
      const root = context.mountNode;
      const mockStore = context.mockStore;
      const searchInput = document.getElementById("stream-proxy-search");
      const mediaSelect = document.getElementById("stream-proxy-media");
      const statusSelect = document.getElementById("stream-proxy-status");
      const refreshButton = document.getElementById("stream-proxy-refresh");
      const tbody = document.getElementById("stream-proxy-table-body");
      const playerModal = document.getElementById("stream-proxy-player-modal");
      const playerBackdrop = document.getElementById("stream-proxy-player-backdrop");
      let activePlayerRow = null;
      let activePlayerTech = "jessibuca";
      let activePlayerTab = "live";

      function renderRows() {
        const keyword = utils.normalize(searchInput ? searchInput.value : "");
        const media = mediaSelect ? mediaSelect.value : "";
        const pullStatus = statusSelect ? statusSelect.value : "";

        const rows = (proxyPage.rows || []).filter(function (row) {
          const keywordMatch =
            !keyword ||
            (proxyPage.searchFields || []).some(function (field) {
              return utils.normalize(row[field]).includes(keyword);
            });

          const mediaMatch = !media || row.mediaServer === media;
          const pullStatusMatch = !pullStatus || row.pullStatus === pullStatus;
          return keywordMatch && mediaMatch && pullStatusMatch;
        });

        if (!tbody) {
          return;
        }

        tbody.innerHTML = rows.length ? rows.map(renderRow).join("") : renderEmptyRow(page.emptyText);
      }

      function openPlayerModal(row) {
        activePlayerRow = row || null;
        activePlayerTech = "jessibuca";
        activePlayerTab = "live";
        syncPlayerModal();

        if (playerModal) {
          playerModal.classList.add("visible");
        }
        if (playerBackdrop) {
          playerBackdrop.classList.add("visible");
        }

        document.body.classList.add("stream-proxy-player-open");
      }

      function closePlayerModal() {
        activePlayerRow = null;

        if (playerModal) {
          playerModal.classList.remove("visible");
        }
        if (playerBackdrop) {
          playerBackdrop.classList.remove("visible");
        }

        document.body.classList.remove("stream-proxy-player-open");
      }

      function syncPlayerModal() {
        if (!playerModal) {
          return;
        }

        const cameraNameNode = playerModal.querySelector("[data-gb-channel-player-name]");
        const streamAddressNode = playerModal.querySelector("[data-gb-channel-player-stream-address]");
        const iframeAddressNode = playerModal.querySelector("[data-gb-channel-player-iframe-address]");
        const resourceAddressNode = playerModal.querySelector("[data-gb-channel-player-resource-address]");
        const techNodes = playerModal.querySelectorAll("[data-gb-channel-player-tech]");
        const tabNodes = playerModal.querySelectorAll("[data-gb-channel-player-tab]");
        const infoPanels = playerModal.querySelectorAll("[data-gb-channel-player-info-panel]");
        const row = activePlayerRow || {};
        const code = row.gbCode || row.streamId || "44130300001320000017";
        const streamAddress = "http://192.168.224.115:9528/#/play/wasm/ws%3A%2F%2F192.168.224.78%3A8081%2Frtp%2F" + code;
        const iframeAddress = '<iframe src="' + streamAddress + '" allowfullscreen></iframe>';
        const resourceAddress = "ws://192.168.224.78:8081/rtp/" + code + "_" + code;

        if (cameraNameNode) {
          cameraNameNode.textContent = row.appName || "Camera 01";
        }
        if (streamAddressNode) {
          streamAddressNode.value = streamAddress;
        }
        if (iframeAddressNode) {
          iframeAddressNode.value = iframeAddress;
        }
        if (resourceAddressNode) {
          resourceAddressNode.value = resourceAddress;
        }

        techNodes.forEach(function (node) {
          const tech = node.getAttribute("data-gb-channel-player-tech") || "";
          node.classList.toggle("active", tech === activePlayerTech);
        });
        tabNodes.forEach(function (node) {
          const tab = node.getAttribute("data-gb-channel-player-tab") || "";
          node.classList.toggle("active", tab === activePlayerTab);
        });
        infoPanels.forEach(function (node) {
          const panel = node.getAttribute("data-gb-channel-player-info-panel") || "";
          node.classList.toggle("active", panel === activePlayerTab);
        });
      }

      function handleClick(event) {
        const addTrigger = event.target.closest("[data-stream-proxy-add]");
        if (addTrigger) {
          persistActiveProxyId("");
          return;
        }

        const editTrigger = event.target.closest("[data-stream-proxy-edit]");
        if (editTrigger) {
          const rowId = editTrigger.getAttribute("data-stream-proxy-edit") || "";
          persistActiveProxyId(rowId);
          return;
        }

        const recordTrigger = event.target.closest("[data-stream-proxy-record]");
        if (recordTrigger) {
          const rowId = recordTrigger.getAttribute("data-stream-proxy-record") || "";
          persistActiveProxyId(rowId);
          return;
        }

        const playTrigger = event.target.closest("[data-stream-proxy-play]");
        if (playTrigger) {
          const rowId = playTrigger.getAttribute("data-stream-proxy-play") || "";
          const row = (proxyPage.rows || []).find(function (item) {
            return item.id === rowId;
          }) || null;
          openPlayerModal(row);
          return;
        }

        const closePlayerTrigger = event.target.closest("[data-stream-proxy-player-close]");
        if (closePlayerTrigger || event.target.closest("#stream-proxy-player-backdrop")) {
          closePlayerModal();
          return;
        }

        const techTrigger = event.target.closest("[data-gb-channel-player-tech]");
        if (techTrigger) {
          activePlayerTech = techTrigger.getAttribute("data-gb-channel-player-tech") || "jessibuca";
          syncPlayerModal();
          return;
        }

        const tabTrigger = event.target.closest("[data-gb-channel-player-tab]");
        if (tabTrigger) {
          activePlayerTab = tabTrigger.getAttribute("data-gb-channel-player-tab") || "live";
          syncPlayerModal();
        }
      }

      function persistActiveProxyId(proxyId) {
        if (!mockStore || typeof mockStore.patchPage !== "function") {
          return;
        }

        mockStore.patchPage("stream-proxy", {
          streamProxyPage: {
            activeProxyId: proxyId || ""
          }
        });
      }

      function handleEsc(event) {
        if (event.key === "Escape") {
          closePlayerModal();
        }
      }

      if (searchInput) {
        searchInput.addEventListener("input", renderRows);
      }

      if (mediaSelect) {
        mediaSelect.addEventListener("change", renderRows);
      }

      if (statusSelect) {
        statusSelect.addEventListener("change", renderRows);
      }

      if (refreshButton) {
        refreshButton.addEventListener("click", renderRows);
      }

      if (root) {
        root.addEventListener("click", handleClick);
      }

      window.addEventListener("keydown", handleEsc);

      renderRows();
      syncPlayerModal();

      return function () {
        closePlayerModal();

        if (searchInput) {
          searchInput.removeEventListener("input", renderRows);
        }
        if (mediaSelect) {
          mediaSelect.removeEventListener("change", renderRows);
        }
        if (statusSelect) {
          statusSelect.removeEventListener("change", renderRows);
        }
        if (refreshButton) {
          refreshButton.removeEventListener("click", renderRows);
        }
        if (root) {
          root.removeEventListener("click", handleClick);
        }

        window.removeEventListener("keydown", handleEsc);
      };
    }
  });

  function renderFilterField(label, controlMarkup) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<label class="stream-proxy-filter">' +
      '<span class="stream-proxy-filter-label">' + utils.escapeHtml(label) + "</span>" +
      controlMarkup +
      "</label>"
    );
  }

  function renderSelect(id, options) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<select id="' + utils.escapeAttribute(id) + '" class="filter-field stream-proxy-select">' +
      (options || []).map(function (option) {
        return '<option value="' + utils.escapeAttribute(option.value) + '">' + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderRow(row) {
    const utils = window.PROTOTYPE_UTILS;

    return (
      '<tr class="stream-proxy-row">' +
      "<td>" + utils.escapeHtml(row.appName) + "</td>" +
      "<td>" + utils.escapeHtml(row.streamId) + "</td>" +
      "<td>" + renderAddress(row) + "</td>" +
      "<td>" + utils.escapeHtml(row.mediaServer || "--") + "</td>" +
      "<td>" + utils.escapeHtml(row.proxyMode || "--") + "</td>" +
      "<td>" + utils.escapeHtml(row.gbCode || "") + "</td>" +
      '<td><span class="status-pill ' + utils.escapeAttribute(row.pullStatus || "idle") + '">' + utils.escapeHtml(row.pullStatusLabel || "--") + "</span></td>" +
      '<td><span class="status-pill ' + utils.escapeAttribute(row.enabled || "disabled") + '">' + utils.escapeHtml(row.enabledLabel || "--") + "</span></td>" +
      "<td>" + utils.escapeHtml(row.createdAt || "--") + "</td>" +
      '<td class="stream-proxy-actions-cell">' + renderActions(row) + "</td>" +
      "</tr>"
    );
  }

  function renderAddress(row) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="stream-proxy-address" type="button" data-toast-title="流地址" data-toast-message="已查看 ' +
      utils.escapeAttribute(row.appName) +
      ' 的流地址。">' +
      '<span class="stream-proxy-address-icon">⎘</span>' +
      '<span class="stream-proxy-address-text">' + utils.escapeHtml(row.streamUrl || "--") + "</span>" +
      "</button>"
    );
  }

  function renderActions(row) {
    const utils = window.PROTOTYPE_UTILS;

    return (
      '<div class="table-actions stream-proxy-actions">' +
      '<button class="table-action stream-proxy-action-link play" type="button" data-stream-proxy-play="' + utils.escapeAttribute(row.id) + '">播放</button>' +
      '<span class="stream-proxy-action-divider">|</span>' +
      '<button class="table-action stream-proxy-action-link edit" type="button" data-route="stream-proxy-edit" data-stream-proxy-edit="' + utils.escapeAttribute(row.id) + '">编辑</button>' +
      '<span class="stream-proxy-action-divider">|</span>' +
      '<button class="table-action stream-proxy-action-link record" type="button" data-route="cloud-record" data-stream-proxy-record="' + utils.escapeAttribute(row.id) + '">云端录像</button>' +
      '<span class="stream-proxy-action-divider">|</span>' +
      renderActionButton("delete", "删除", "删除", "当前原型模拟删除 " + row.appName + "。") +
      "</div>"
    );
  }

  function renderActionButton(actionKey, label, title, message) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="table-action stream-proxy-action-link ' + utils.escapeAttribute(actionKey) +
      '" type="button" data-toast-title="' + utils.escapeAttribute(title) +
      '" data-toast-message="' + utils.escapeAttribute(message) + '">' +
      utils.escapeHtml(label) +
      "</button>"
    );
  }

  function renderEmptyRow(emptyText) {
    const utils = window.PROTOTYPE_UTILS;
    return '<tr><td colspan="10"><div class="empty-state">' + utils.escapeHtml(emptyText) + "</div></td></tr>";
  }

  function renderPlayerModal() {
    return (
      '<div id="stream-proxy-player-backdrop" class="gb-channel-player-backdrop"></div>' +
      '<section id="stream-proxy-player-modal" class="gb-channel-player-modal" aria-hidden="true">' +
      '<div class="gb-channel-player-header">' +
      '<h3 class="gb-channel-player-title">视频播放</h3>' +
      '<button class="gb-channel-player-close" type="button" data-stream-proxy-player-close="true" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="gb-channel-player-tech-tabs">' +
      renderPlayerTechTab("jessibuca", "Jessibuca", true) +
      renderPlayerTechTab("webrtc", "WebRTC", false) +
      renderPlayerTechTab("h265web", "h265web", false) +
      "</div>" +
      '<div class="gb-channel-player-stage">' +
      '<div class="gb-channel-player-screen">' +
      '<span class="gb-channel-player-time">2026年03月22日 星期日 22:10:50</span>' +
      '<span class="gb-channel-player-name" data-gb-channel-player-name>Camera 01</span>' +
      '<div class="gb-channel-player-controls">' +
      '<div class="gb-channel-player-control-left"><span>▮▮</span><span>■</span><span>🔊</span></div>' +
      '<div class="gb-channel-player-control-right"><span>305 kb/s</span><span>◉</span><span>↻</span><span>↗</span></div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="gb-channel-player-info-tabs">' +
      renderPlayerInfoTab("live", "实时视频", true) +
      renderPlayerInfoTab("codec", "编码信息", false) +
      "</div>" +
      '<div class="gb-channel-player-info-panel active" data-gb-channel-player-info-panel="live">' +
      renderPlayerInfoRow("播放地址", "http://192.168.224.115:9528/#/play/wasm/ws%3A%2F%2F192.168.224.78%3A8081%2Frtp%2F44130300001320000017", "gb-channel-player-stream-address") +
      renderPlayerInfoRow("iframe", '<iframe src="http://192.168.224.115:9528/#/play/wasm/ws%3A%2F%2F192.168.224.78%3A8081%2Frtp%2F44130300001320000017"></iframe>', "gb-channel-player-iframe-address") +
      renderPlayerResourceRow() +
      "</div>" +
      '<div class="gb-channel-player-info-panel" data-gb-channel-player-info-panel="codec">' + renderCodecInfoPanel() + "</div>" +
      "</section>"
    );
  }

  function renderCodecInfoPanel() {
    return (
      '<section class="gb-channel-codec-panel">' +
      '<div class="gb-channel-codec-head">' +
      '<h4 class="gb-channel-codec-title">概况</h4>' +
      '<button class="gb-channel-codec-refresh" type="button" data-toast-title="刷新编码信息" data-toast-message="当前原型已刷新编码信息。">↻</button>' +
      "</div>" +
      '<div class="gb-channel-codec-overview">' +
      renderCodecMetric("观看人数", "5") +
      renderCodecMetric("网络", "11.43 KB/S") +
      renderCodecMetric("持续时间", "30秒") +
      "</div>" +
      '<div class="gb-channel-codec-grid">' +
      '<section class="gb-channel-codec-block">' +
      '<h5 class="gb-channel-codec-block-title">视频信息</h5>' +
      '<div class="gb-channel-codec-kv-grid">' +
      renderCodecField("编码", "H264") +
      renderCodecField("分辨率", "2560x1440") +
      renderCodecField("FPS", "25") +
      renderCodecField("丢包率", "0") +
      "</div>" +
      "</section>" +
      '<section class="gb-channel-codec-block">' +
      '<h5 class="gb-channel-codec-block-title">音频信息</h5>' +
      '<div class="gb-channel-codec-kv-grid">' +
      renderCodecField("编码", "G711A") +
      renderCodecField("采样率", "8000") +
      "</div>" +
      "</section>" +
      "</div>" +
      "</section>"
    );
  }

  function renderCodecMetric(label, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="gb-channel-codec-metric">' +
      '<span class="gb-channel-codec-metric-label">' + utils.escapeHtml(label) + "</span>" +
      '<span class="gb-channel-codec-metric-value">' + utils.escapeHtml(value) + "</span>" +
      "</div>"
    );
  }

  function renderCodecField(label, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="gb-channel-codec-field">' +
      '<span class="gb-channel-codec-field-label">' + utils.escapeHtml(label) + "</span>" +
      '<span class="gb-channel-codec-field-value">' + utils.escapeHtml(value) + "</span>" +
      "</div>"
    );
  }

  function renderPlayerTechTab(key, label, active) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="gb-channel-player-tech-tab' + (active ? " active" : "") + '" type="button" data-gb-channel-player-tech="' + utils.escapeAttribute(key) + '">' +
      utils.escapeHtml(label) +
      "</button>"
    );
  }

  function renderPlayerInfoTab(key, label, active) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="gb-channel-player-info-tab' + (active ? " active" : "") + '" type="button" data-gb-channel-player-tab="' + utils.escapeAttribute(key) + '">' +
      utils.escapeHtml(label) +
      "</button>"
    );
  }

  function renderPlayerInfoRow(label, value, inputKey) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<label class="gb-channel-player-info-row">' +
      '<span class="gb-channel-player-info-label">' + utils.escapeHtml(label) + ":</span>" +
      '<input class="gb-channel-player-info-input" data-' + utils.escapeAttribute(inputKey) + ' readonly value="' + utils.escapeAttribute(value) + '" />' +
      '<button class="gb-channel-player-copy" type="button" data-toast-title="复制" data-toast-message="当前原型仅演示复制入口。">⧉</button>' +
      "</label>"
    );
  }

  function renderPlayerResourceRow() {
    return (
      '<label class="gb-channel-player-info-row">' +
      '<span class="gb-channel-player-info-label">资源地址:</span>' +
      '<button class="gb-channel-player-resource-more" type="button" data-toast-title="更多地址" data-toast-message="当前原型保留更多地址入口。">更多地址 ∨</button>' +
      '<input class="gb-channel-player-info-input gb-channel-player-resource-input" data-gb-channel-player-resource-address readonly value="ws://192.168.224.78:8081/rtp/44130300001320000017_44130300001320000017" />' +
      '<button class="gb-channel-player-copy" type="button" data-toast-title="复制" data-toast-message="当前原型仅演示复制入口。">⧉</button>' +
      "</label>"
    );
  }
})();
