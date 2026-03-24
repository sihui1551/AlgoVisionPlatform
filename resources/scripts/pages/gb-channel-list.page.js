(function () {
  const CHANNEL_ROWS = [
    {
      id: "channel-001",
      name: "Camera 01",
      code: "44130300001320000017",
      channelType: "device",
      vendor: "Hikvision",
      locationInfo: "无",
      cameraType: "枪机",
      audioEnabled: false,
      streamType: "main",
      status: "online",
      statusLabel: "在线"
    }
  ];

  window.registerPrototypePage({
    key: "gb-channel-list",
    styleSource: "resources/css/pages/gb-channel-list.css",
    kind: "table",
    heading: "通道列表",
    subtitle: "查看设备通道基础信息、码流类型和音频配置。",
    breadcrumbTrail: ["接入管理", "国标设备"],
    emptyText: "暂无通道数据",
    gbChannelPage: {
      rows: CHANNEL_ROWS,
      searchFields: ["name", "code", "vendor"],
      channelTypeOptions: [
        { value: "", label: "\u5168\u90E8" },
        { value: "device", label: "\u8BBE\u5907" },
        { value: "subdir", label: "\u5B50\u76EE\u5F55" }
      ],
      onlineStatusOptions: [
        { value: "", label: "全部" },
        { value: "online", label: "在线" },
        { value: "offline", label: "离线" }
      ],
      streamTypeFilterOptions: [
        { value: "", label: "请选择码流类型" },
        { value: "main", label: "主码流" },
        { value: "sub", label: "子码流" }
      ],
      rowStreamTypeOptions: [
        { value: "", label: "请选择码流类型" },
        { value: "main", label: "主码流" },
        { value: "sub", label: "子码流" }
      ]
    },
    renderTablePanel: function (context) {
      const page = context.page;
      const channelPage = page.gbChannelPage || {};
      const rows = channelPage.rows || [];

      return (
        '<section class="panel gb-channel-panel">' +
        '<div class="gb-channel-toolbar">' +
        '<div class="gb-channel-toolbar-main">' +
        '<button class="gb-channel-back" type="button" data-route="access-source">← 返回</button>' +
        '<span class="gb-channel-divider"></span>' +
        '<span class="gb-channel-title">通道列表</span>' +
        '<label class="gb-channel-filter">' +
        '<span class="gb-channel-filter-label">搜索</span>' +
        '<input id="gb-channel-search" class="filter-field gb-channel-search" type="search" placeholder="关键字" />' +
        '</label>' +
        '<label class="gb-channel-filter">' +
        '<span class="gb-channel-filter-label">通道类型</span>' +
        renderSelect("gb-channel-type", channelPage.channelTypeOptions || []) +
        '</label>' +
        '<label class="gb-channel-filter">' +
        '<span class="gb-channel-filter-label">在线状态</span>' +
        renderSelect("gb-channel-online", channelPage.onlineStatusOptions || []) +
        '</label>' +
        '<label class="gb-channel-filter gb-channel-filter-wide">' +
        '<span class="gb-channel-filter-label">码流类型</span>' +
        renderSelect("gb-channel-stream-filter", channelPage.streamTypeFilterOptions || []) +
        "</label>" +
        "</div>" +
        '<button id="gb-channel-refresh" class="gb-channel-refresh" type="button" aria-label="刷新" data-toast-title="刷新通道" data-toast-message="当前原型已刷新通道列表。">↻</button>' +
        "</div>" +
        '<div class="table-shell gb-channel-table-shell">' +
        "<table>" +
        "<thead><tr>" +
        "<th>名称</th>" +
        "<th>编号</th>" +
        "<th>快照</th>" +
        "<th>厂家</th>" +
        "<th>位置信息</th>" +
        "<th>摄像头类型</th>" +
        "<th>开启音频</th>" +
        "<th>码流类型</th>" +
        "<th>状态</th>" +
        "<th>操作</th>" +
        '</tr></thead><tbody id="gb-channel-table-body">' +
        rows.map(function (row) { return renderRow(row, channelPage.rowStreamTypeOptions || []); }).join("") +
        "</tbody></table>" +
        "</div>" +
        renderFloatingMoreMenu() +
        renderPlayerModal() +
        "</section>"
      );
    },
    setup: function (context) {
      const utils = window.PROTOTYPE_UTILS;
      const page = context.page;
      const channelPage = page.gbChannelPage || {};
      const searchInput = document.getElementById("gb-channel-search");
      const typeSelect = document.getElementById("gb-channel-type");
      const onlineSelect = document.getElementById("gb-channel-online");
      const streamFilterSelect = document.getElementById("gb-channel-stream-filter");
      const refreshButton = document.getElementById("gb-channel-refresh");
      const tbody = document.getElementById("gb-channel-table-body");
      const root = context.mountNode;
      const floatingMenu = document.getElementById("gb-channel-floating-menu");
      const playerModal = document.getElementById("gb-channel-player-modal");
      const playerBackdrop = document.getElementById("gb-channel-player-backdrop");
      let activeMenuRow = null;
      let activePlayerRow = null;
      let activePlayerTech = "jessibuca";
      let activePlayerTab = "live";
      let activeTalkMode = "broadcast";
      let talkActive = false;

      function renderRows() {
        const keyword = utils.normalize(searchInput ? searchInput.value : "");
        const channelType = typeSelect ? typeSelect.value : "";
        const onlineStatus = onlineSelect ? onlineSelect.value : "";
        const streamType = streamFilterSelect ? streamFilterSelect.value : "";
        const rows = (channelPage.rows || []).filter(function (row) {
          const keywordMatch =
            !keyword ||
            (channelPage.searchFields || []).some(function (field) {
              return utils.normalize(row[field]).includes(keyword);
            });
          const channelTypeMatch = !channelType || row.channelType === channelType;
          const onlineMatch = !onlineStatus || row.status === onlineStatus;
          const streamMatch = !streamType || row.streamType === streamType;
          return keywordMatch && channelTypeMatch && onlineMatch && streamMatch;
        });

        if (tbody) {
          tbody.innerHTML = rows.length
            ? rows.map(function (row) { return renderRow(row, channelPage.rowStreamTypeOptions || []); }).join("")
            : '<tr><td colspan="10"><div class="empty-state">' + utils.escapeHtml(page.emptyText) + "</div></td></tr>";
        }

        activeMenuRow = null;
        syncFloatingMenu();
      }

      function syncFloatingMenu() {
        const triggerNodes = root ? root.querySelectorAll("[data-gb-channel-menu-trigger]") : [];

        triggerNodes.forEach(function (node) {
          const isActive = !!activeMenuRow && node.getAttribute("data-gb-channel-menu-trigger") === activeMenuRow.id;
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

        const trigger = root ? root.querySelector('[data-gb-channel-menu-trigger="' + activeMenuRow.id + '"]') : null;
        if (!trigger) {
          activeMenuRow = null;
          floatingMenu.classList.remove("visible");
          return;
        }

        const rect = trigger.getBoundingClientRect();
        floatingMenu.style.left = Math.max(16, rect.right - 198) + "px";
        floatingMenu.style.top = rect.bottom + 12 + "px";
        floatingMenu.classList.add("visible");
        setFloatingAction("device-record", "设备录像", "当前原型预留查看 " + activeMenuRow.name + " 设备录像的入口。");
        setFloatingAction("cloud-record", "云端录像", "当前原型预留查看 " + activeMenuRow.name + " 云端录像的入口。");
      }

      function openPlayerModal(row) {
        activePlayerRow = row || null;
        activePlayerTech = "jessibuca";
        activePlayerTab = "live";
        activeTalkMode = "broadcast";
        talkActive = false;
        syncPlayerModal();
        if (playerModal) {
          playerModal.classList.add("visible");
        }
        if (playerBackdrop) {
          playerBackdrop.classList.add("visible");
        }
        document.body.classList.add("gb-channel-player-open");
      }

      function closePlayerModal() {
        activePlayerRow = null;
        talkActive = false;
        if (playerModal) {
          playerModal.classList.remove("visible");
        }
        if (playerBackdrop) {
          playerBackdrop.classList.remove("visible");
        }
        document.body.classList.remove("gb-channel-player-open");
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
        const code = row.code || "44130300001320000017";
        const streamAddress = "http://192.168.224.115:9528/#/play/wasm/ws%3A%2F%2F192.168.224.78%3A8081%2Frtp%2F" + code;
        const iframeAddress = '<iframe src="' + streamAddress + '" allowfullscreen></iframe>';
        const resourceAddress = "ws://192.168.224.78:8081/rtp/" + code + "_" + code;

        if (cameraNameNode) {
          cameraNameNode.textContent = row.name || "Camera 01";
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

        syncTalkPanel();
      }

      function syncTalkPanel() {
        if (!playerModal) {
          return;
        }

        const modeNodes = playerModal.querySelectorAll("[data-gb-channel-talk-mode]");
        const micButton = playerModal.querySelector("[data-gb-channel-talk-toggle]");
        const hintNode = playerModal.querySelector("[data-gb-channel-talk-hint]");

        modeNodes.forEach(function (node) {
          node.checked = node.value === activeTalkMode;
        });

        if (micButton) {
          micButton.classList.toggle("active", talkActive);
        }

        if (hintNode) {
          hintNode.textContent = talkActive
            ? (activeTalkMode === "broadcast" ? "正在喊话..." : "正在对讲...")
            : "点击开始对讲";
        }
      }

      function setFloatingAction(action, title, message) {
        if (!floatingMenu) {
          return;
        }
        const button = floatingMenu.querySelector('[data-gb-channel-floating-action="' + action + '"]');
        if (!button) {
          return;
        }
        button.setAttribute("data-toast-title", title);
        button.setAttribute("data-toast-message", message);
      }

      function handleClick(event) {
        const playTrigger = event.target.closest("[data-gb-channel-play]");
        if (playTrigger) {
          const rowId = playTrigger.getAttribute("data-gb-channel-play") || "";
          const row = (channelPage.rows || []).find(function (item) {
            return item.id === rowId;
          }) || null;
          openPlayerModal(row);
          return;
        }

        const closePlayerTrigger = event.target.closest("[data-gb-channel-player-close]");
        if (closePlayerTrigger || event.target.closest("#gb-channel-player-backdrop")) {
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
          return;
        }

        const ptzDirectionButton = event.target.closest("[data-gb-channel-ptz]");
        if (ptzDirectionButton) {
          const direction = ptzDirectionButton.getAttribute("data-gb-channel-ptz") || "";
          const directionLabelMap = {
            up: "上",
            down: "下",
            left: "左",
            right: "右",
            "left-up": "左上",
            "right-up": "右上",
            "left-down": "左下",
            "right-down": "右下",
            stop: "停止"
          };

          context.showToast("云台控制", "已发送云台" + (directionLabelMap[direction] || "方向") + "控制指令。");
          return;
        }

        const ptzToolButton = event.target.closest("[data-gb-channel-ptz-tool]");
        if (ptzToolButton) {
          const tool = ptzToolButton.getAttribute("data-gb-channel-ptz-tool") || "";
          const toolLabelMap = {
            "zoom-in": "放大",
            "zoom-out": "缩小",
            "focus-near": "近焦",
            "focus-far": "远焦",
            "iris-open": "光圈开",
            "iris-close": "光圈关"
          };
          context.showToast("云台控制", "已发送" + (toolLabelMap[tool] || "云台工具") + "指令。");
          return;
        }

        const presetAddButton = event.target.closest("[data-gb-channel-ptz-add]");
        if (presetAddButton) {
          const presetSelect = playerModal ? playerModal.querySelector("[data-gb-channel-ptz-preset]") : null;
          const presetName = presetSelect ? presetSelect.value : "预置点";
          context.showToast("云台控制", "当前原型已添加 " + presetName + "。");
          return;
        }

        const talkToggleButton = event.target.closest("[data-gb-channel-talk-toggle]");
        if (talkToggleButton) {
          talkActive = !talkActive;
          syncTalkPanel();
          context.showToast("语音对讲", talkActive ? "语音链路已连接。" : "语音链路已断开。");
          return;
        }

        const menuTrigger = event.target.closest("[data-gb-channel-menu-trigger]");
        if (menuTrigger) {
          const rowId = menuTrigger.getAttribute("data-gb-channel-menu-trigger") || "";
          const nextRow = (channelPage.rows || []).find(function (row) {
            return row.id === rowId;
          }) || null;
          activeMenuRow = activeMenuRow && activeMenuRow.id === rowId ? null : nextRow;
          syncFloatingMenu();
          return;
        }

        const menuItem = event.target.closest("[data-gb-channel-menu-item]");
        if (menuItem) {
          activeMenuRow = null;
          syncFloatingMenu();
          return;
        }

        const audioSwitch = event.target.closest("[data-gb-channel-audio]");
        if (audioSwitch) {
          const rowId = audioSwitch.getAttribute("data-gb-channel-audio") || "";
          const row = (channelPage.rows || []).find(function (item) {
            return item.id === rowId;
          });
          if (row) {
            row.audioEnabled = !row.audioEnabled;
          }
          audioSwitch.classList.toggle("active");
          context.showToast("开启音频", "当前原型已切换音频开关。");
          return;
        }

        if (!event.target.closest(".gb-channel-more-wrap") && !event.target.closest("#gb-channel-floating-menu")) {
          activeMenuRow = null;
          syncFloatingMenu();
        }
      }

      function handleChange(event) {
        const talkModeNode = event.target.closest("[data-gb-channel-talk-mode]");
        if (talkModeNode) {
          activeTalkMode = talkModeNode.value || "broadcast";
          syncTalkPanel();
          if (talkActive) {
            context.showToast("语音模式", activeTalkMode === "broadcast" ? "已切换为喊话模式。" : "已切换为对讲模式。");
          }
          return;
        }

        const ptzZoomNode = event.target.closest("[data-gb-channel-ptz-zoom]");
        if (ptzZoomNode) {
          context.showToast("云台控制", "已调整变倍值为 " + ptzZoomNode.value + "。");
          return;
        }

        const presetNode = event.target.closest("[data-gb-channel-ptz-preset]");
        if (presetNode) {
          context.showToast("云台控制", "已选择 " + presetNode.value + "。");
          return;
        }

        const streamSelect = event.target.closest(".gb-channel-stream-select");
        if (streamSelect) {
          const rowId = streamSelect.getAttribute("data-gb-channel-row") || "";
          const row = (channelPage.rows || []).find(function (item) {
            return item.id === rowId;
          });
          if (row) {
            row.streamType = streamSelect.value;
          }
          context.showToast("码流类型", "已切换当前通道的码流类型为 " + streamSelect.value + "。");
          renderRows();
          return;
        }
      }

      function handleWindowSync() {
        if (activeMenuRow) {
          syncFloatingMenu();
        }
      }

      function handleEsc(event) {
        if (event.key === "Escape") {
          closePlayerModal();
        }
      }

      if (searchInput) {
        searchInput.addEventListener("input", renderRows);
      }
      if (typeSelect) {
        typeSelect.addEventListener("change", renderRows);
      }
      if (onlineSelect) {
        onlineSelect.addEventListener("change", renderRows);
      }
      if (streamFilterSelect) {
        streamFilterSelect.addEventListener("change", renderRows);
      }
      if (refreshButton) {
        refreshButton.addEventListener("click", renderRows);
      }
      if (root) {
        root.addEventListener("click", handleClick);
        root.addEventListener("change", handleChange);
      }
      window.addEventListener("resize", handleWindowSync);
      window.addEventListener("scroll", handleWindowSync, true);
      window.addEventListener("keydown", handleEsc);

      renderRows();
      syncPlayerModal();

      return function () {
        closePlayerModal();
        if (searchInput) {
          searchInput.removeEventListener("input", renderRows);
        }
        if (typeSelect) {
          typeSelect.removeEventListener("change", renderRows);
        }
        if (onlineSelect) {
          onlineSelect.removeEventListener("change", renderRows);
        }
        if (streamFilterSelect) {
          streamFilterSelect.removeEventListener("change", renderRows);
        }
        if (refreshButton) {
          refreshButton.removeEventListener("click", renderRows);
        }
        if (root) {
          root.removeEventListener("click", handleClick);
          root.removeEventListener("change", handleChange);
        }
        window.removeEventListener("resize", handleWindowSync);
        window.removeEventListener("scroll", handleWindowSync, true);
        window.removeEventListener("keydown", handleEsc);
      };
    }
  });

  function renderRow(row, streamTypeOptions) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      "<tr>" +
      "<td><strong>" + utils.escapeHtml(row.name) + "</strong></td>" +
      "<td>" + utils.escapeHtml(row.code) + "</td>" +
      "<td>" + renderSnapshot() + "</td>" +
      "<td>" + utils.escapeHtml(row.vendor) + "</td>" +
      "<td>" + utils.escapeHtml(row.locationInfo) + "</td>" +
      "<td>" + utils.escapeHtml(row.cameraType) + "</td>" +
      '<td>' + renderAudioSwitch(row) + "</td>" +
      '<td>' + renderRowSelect(row, streamTypeOptions, row.streamType) + "</td>" +
      '<td><span class="status-pill ' + utils.escapeAttribute(row.status) + '">' + utils.escapeHtml(row.statusLabel) + "</span></td>" +
      '<td class="gb-channel-operation-cell">' + renderActions(row) + "</td>" +
      "</tr>"
    );
  }

  function renderSelect(id, options) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<select id="' + utils.escapeAttribute(id) + '" class="filter-field gb-channel-select">' +
      (options || []).map(function (option) {
        return '<option value="' + utils.escapeAttribute(option.value) + '">' + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderRowSelect(row, options, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<select class="gb-channel-stream-select" data-gb-channel-row="' + utils.escapeAttribute(row.id) + '">' +
      (options || []).map(function (option) {
        const selected = option.value === value ? ' selected="selected"' : "";
        return '<option value="' + utils.escapeAttribute(option.value) + '"' + selected + ">" + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderSnapshot() {
    return (
      '<div class="gb-channel-snapshot">' +
      '<span class="gb-channel-thumb gb-channel-thumb-left"></span>' +
      '<span class="gb-channel-thumb gb-channel-thumb-right"></span>' +
      "</div>"
    );
  }

  function renderAudioSwitch(row) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="gb-channel-audio-switch' + (row.audioEnabled ? " active" : "") + '" type="button" data-gb-channel-audio="' + utils.escapeAttribute(row.id) + '">' +
      '<span class="gb-channel-audio-knob"></span>' +
      "</button>"
    );
  }

  function renderActions(row) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="table-actions gb-channel-actions">' +
      '<button class="table-action gb-channel-action-link" type="button" data-gb-channel-play="' + utils.escapeAttribute(row.id) + '">◉ 播放</button>' +
      '<span class="gb-channel-action-separator">|</span>' +
      '<button class="table-action gb-channel-action-link" type="button" data-route="gb-channel-edit">编辑</button>' +
      '<span class="gb-channel-action-separator">|</span>' +
      '<div class="gb-channel-more-wrap">' +
      '<button class="table-action gb-channel-action-link gb-channel-more-trigger" type="button" data-gb-channel-menu-trigger="' + utils.escapeAttribute(row.id) + '">更多 <span class="gb-channel-more-caret">∨</span></button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderFloatingMoreMenu() {
    return (
      '<div id="gb-channel-floating-menu" class="gb-channel-floating-menu">' +
      renderMoreItem("设备录像", "", "", false, "device-record") +
      renderMoreItem("云端录像", "", "", false, "cloud-record") +
      "</div>"
    );
  }

  function renderMoreItem(label, title, message, danger, actionKey) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<button class="gb-channel-more-item' + (danger ? " danger" : "") + '" type="button" data-gb-channel-menu-item="true"' +
      (actionKey ? ' data-gb-channel-floating-action="' + utils.escapeAttribute(actionKey) + '"' : "") +
      ' data-toast-title="' + utils.escapeAttribute(title) + '" data-toast-message="' + utils.escapeAttribute(message) + '">' +
      utils.escapeHtml(label) +
      "</button>"
    );
  }

  function renderPlayerModal() {
    return (
      '<div id="gb-channel-player-backdrop" class="gb-channel-player-backdrop"></div>' +
      '<section id="gb-channel-player-modal" class="gb-channel-player-modal" aria-hidden="true">' +
      '<div class="gb-channel-player-header">' +
      '<h3 class="gb-channel-player-title">视频播放</h3>' +
      '<button class="gb-channel-player-close" type="button" data-gb-channel-player-close="true" aria-label="关闭">×</button>' +
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
      renderPlayerInfoTab("ptz", "云台控制", false) +
      renderPlayerInfoTab("codec", "编码信息", false) +
      renderPlayerInfoTab("talk", "语音对讲", false) +
      "</div>" +
      '<div class="gb-channel-player-info-panel active" data-gb-channel-player-info-panel="live">' +
      renderPlayerInfoRow("播放地址", "http://192.168.224.115:9528/#/play/wasm/ws%3A%2F%2F192.168.224.78%3A8081%2Frtp%2F44130300001320000017", "gb-channel-player-stream-address") +
      renderPlayerInfoRow("iframe", '<iframe src="http://192.168.224.115:9528/#/play/wasm/ws%3A%2F%2F192.168.224.78%3A8081%2Frtp%2F44130300001320000017"></iframe>', "gb-channel-player-iframe-address") +
      renderPlayerResourceRow() +
      "</div>" +
      '<div class="gb-channel-player-info-panel" data-gb-channel-player-info-panel="ptz">' + renderPtzPanel() + "</div>" +
      '<div class="gb-channel-player-info-panel" data-gb-channel-player-info-panel="codec">' + renderCodecInfoPanel() + "</div>" +
      '<div class="gb-channel-player-info-panel" data-gb-channel-player-info-panel="talk">' + renderTalkPanel() + "</div>" +
      "</section>"
    );
  }

  function renderPtzPanel() {
    return (
      '<section class="gb-channel-ptz-panel">' +
      '<div class="gb-channel-ptz-control-wrap">' +
      '<div class="gb-channel-ptz-pad">' +
      '<button class="gb-channel-ptz-btn up" type="button" data-gb-channel-ptz="up">▲</button>' +
      '<button class="gb-channel-ptz-btn right" type="button" data-gb-channel-ptz="right">▶</button>' +
      '<button class="gb-channel-ptz-btn down" type="button" data-gb-channel-ptz="down">▼</button>' +
      '<button class="gb-channel-ptz-btn left" type="button" data-gb-channel-ptz="left">◀</button>' +
      '<button class="gb-channel-ptz-btn left-up mini" type="button" data-gb-channel-ptz="left-up">◤</button>' +
      '<button class="gb-channel-ptz-btn right-up mini" type="button" data-gb-channel-ptz="right-up">◥</button>' +
      '<button class="gb-channel-ptz-btn left-down mini" type="button" data-gb-channel-ptz="left-down">◣</button>' +
      '<button class="gb-channel-ptz-btn right-down mini" type="button" data-gb-channel-ptz="right-down">◢</button>' +
      '<button class="gb-channel-ptz-btn center" type="button" data-gb-channel-ptz="stop">●</button>' +
      "</div>" +
      '<input class="gb-channel-ptz-slider" type="range" min="1" max="100" value="36" data-gb-channel-ptz-zoom />' +
      "</div>" +
      '<div class="gb-channel-ptz-tools">' +
      '<button class="gb-channel-ptz-tool-btn" type="button" data-gb-channel-ptz-tool="zoom-in">＋</button>' +
      '<button class="gb-channel-ptz-tool-btn" type="button" data-gb-channel-ptz-tool="zoom-out">－</button>' +
      '<button class="gb-channel-ptz-tool-btn" type="button" data-gb-channel-ptz-tool="focus-near">◫＋</button>' +
      '<button class="gb-channel-ptz-tool-btn" type="button" data-gb-channel-ptz-tool="focus-far">◫－</button>' +
      '<button class="gb-channel-ptz-tool-btn" type="button" data-gb-channel-ptz-tool="iris-open">◎＋</button>' +
      '<button class="gb-channel-ptz-tool-btn" type="button" data-gb-channel-ptz-tool="iris-close">◎－</button>' +
      "</div>" +
      '<div class="gb-channel-ptz-preset">' +
      '<select class="filter-field gb-channel-ptz-select" data-gb-channel-ptz-preset>' +
      '<option value="预置点A">预置点</option>' +
      '<option value="预置点B">预置点B</option>' +
      '<option value="预置点C">预置点C</option>' +
      "</select>" +
      '<button class="gb-channel-ptz-add" type="button" data-gb-channel-ptz-add="true">+ 添加</button>' +
      "</div>" +
      "</section>"
    );
  }

  function renderTalkPanel() {
    return (
      '<section class="gb-channel-talk-panel">' +
      '<div class="gb-channel-talk-modes">' +
      '<label class="gb-channel-talk-mode-item">' +
      '<input type="radio" name="gb-channel-talk-mode" value="broadcast" data-gb-channel-talk-mode checked="checked" />' +
      "<span>喊话(Broadcast)</span>" +
      "</label>" +
      '<label class="gb-channel-talk-mode-item">' +
      '<input type="radio" name="gb-channel-talk-mode" value="talk" data-gb-channel-talk-mode />' +
      "<span>对讲(Talk)</span>" +
      "</label>" +
      "</div>" +
      '<div class="gb-channel-talk-stage">' +
      '<button class="gb-channel-talk-mic" type="button" data-gb-channel-talk-toggle="true" aria-label="切换语音对讲">' +
      '<span class="gb-channel-talk-mic-icon" aria-hidden="true"></span>' +
      "</button>" +
      '<div class="gb-channel-talk-hint" data-gb-channel-talk-hint>点击开始对讲</div>' +
      "</div>" +
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
