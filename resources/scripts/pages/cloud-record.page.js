(function () {
  window.registerPrototypePage({
    key: "cloud-record",
    styleSource: "resources/css/pages/cloud-record.css",
    kind: "dashboard",
    heading: "云端录像",
    subtitle: "录像播放器",
    breadcrumbTrail: ["接入管理", "接入源管理"],
    renderDashboardPage: function () {
      return renderPlayerPage();
    },
    setup: function (runtime) {
      syncActiveSource(runtime);
      return null;
    }
  });

  function renderPlayerPage() {
    return (
      '<section class="panel cloud-record-page">' +
      '<div class="cloud-record-stage">' +
      '<div class="cloud-record-top-meta">' +
      '<span class="cloud-record-name" data-cloud-record-name>未选择录像源</span>' +
      '<span class="cloud-record-status">云端录像回放</span>' +
      "</div>" +
      '<div class="cloud-record-center-hint">Jessibuca</div>' +
      "</div>" +
      '<div class="cloud-record-info-bar">' +
      '<span class="cloud-record-bitrate">0 kb/s</span>' +
      '<div class="cloud-record-tools">' +
      '<button class="cloud-record-icon" type="button" data-toast-title="截图" data-toast-message="当前原型预留截图入口。">◧</button>' +
      '<button class="cloud-record-icon" type="button" data-toast-title="刷新" data-toast-message="当前原型已刷新播放状态。">↻</button>' +
      '<button class="cloud-record-icon" type="button" data-toast-title="全屏" data-toast-message="当前原型预留全屏入口。">⤢</button>' +
      "</div>" +
      "</div>" +
      '<div class="cloud-record-timeline"></div>' +
      '<div class="cloud-record-control-bar">' +
      '<button class="cloud-record-btn" type="button" data-toast-title="快退" data-toast-message="当前原型预留快退控制。">⏮</button>' +
      '<button class="cloud-record-btn" type="button" data-toast-title="后退" data-toast-message="当前原型预留后退控制。">⏪</button>' +
      '<button class="cloud-record-btn primary" type="button" data-toast-title="播放/暂停" data-toast-message="当前原型预留播放控制。">⏯</button>' +
      '<button class="cloud-record-btn" type="button" data-toast-title="前进" data-toast-message="当前原型预留前进控制。">⏩</button>' +
      '<button class="cloud-record-btn" type="button" data-toast-title="快进" data-toast-message="当前原型预留快进控制。">⏭</button>' +
      '<span class="cloud-record-speed">1x</span>' +
      "</div>" +
      '<div class="cloud-record-source">流地址：<span data-cloud-record-source>--</span></div>' +
      "</section>"
    );
  }

  function syncActiveSource(runtime) {
    const root = runtime && runtime.mountNode;
    const mockStore = runtime && runtime.mockStore;

    if (!root || !mockStore || typeof mockStore.getPage !== "function") {
      return;
    }

    const accessSourcePage = mockStore.getPage("access-source") || {};
    const accessSourceData = accessSourcePage.accessSourcePage || {};
    const rows = Array.isArray(accessSourceData.rows) ? accessSourceData.rows : [];
    const activeId = accessSourceData.activeProxyId || "";
    const row = rows.find(function (item) {
      return item.id === activeId && isStreamProxyRow(item);
    }) || null;

    const nameNode = root.querySelector("[data-cloud-record-name]");
    const sourceNode = root.querySelector("[data-cloud-record-source]");

    if (nameNode) {
      nameNode.textContent = row && row.appName ? row.appName : "未选择录像源";
    }

    if (sourceNode) {
      sourceNode.textContent = row && row.streamUrl ? row.streamUrl : "--";
    }
  }

  function isStreamProxyRow(row) {
    if (!row) {
      return false;
    }

    if (row.sourceType) {
      return row.sourceType === "stream_proxy";
    }

    return !!(row.appName || row.streamId || row.streamUrl || row.proxyMode || row.pullStatus || row.gbCode);
  }
})();
