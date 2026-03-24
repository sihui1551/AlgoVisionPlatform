(function () {
  const ALL = "all";

  const META = {
    gb_device: {
      label: "国标设备",
      search: ["name", "deviceId", "address", "vendor"],
      runtime: [
        { value: "online", label: "在线" },
        { value: "offline", label: "离线" }
      ]
    },
    stream_proxy: {
      label: "拉流设备",
      search: ["appName", "streamId", "streamUrl", "mediaServer", "proxyMode", "gbCode"],
      runtime: [
        { value: "running", label: "拉流中" },
        { value: "idle", label: "暂未拉流" }
      ]
    }
  };

  const ENABLED_OPTIONS = [
    { value: "enabled", label: "已启用" },
    { value: "disabled", label: "已停用" }
  ];

  const CREATE_SOURCE_TYPE_OPTIONS = [
    { value: "gb_device", label: "国标设备" },
    { value: "stream_proxy", label: "拉流设备" }
  ];

  const GB_MEDIA_SERVER_OPTIONS = [
    { value: "", label: "请选择" },
    { value: "server-001", label: "流媒体服务器 1" },
    { value: "server-002", label: "流媒体服务器 2" }
  ];

  const GB_CHARSET_OPTIONS = [
    { value: "", label: "请选择" },
    { value: "gb2312", label: "GB2312" },
    { value: "utf-8", label: "UTF-8" }
  ];

  const GB_COORDINATE_OPTIONS = [
    { value: "", label: "请选择" },
    { value: "wgs84", label: "WGS-84" },
    { value: "gcj02", label: "GCJ-02" }
  ];

  const STREAM_TYPE_OPTIONS = [
    { value: "default", label: "默认" },
    { value: "on-demand", label: "按需" }
  ];

  const STREAM_NODE_OPTIONS = [
    { value: "", label: "请选择拉流节点" },
    { value: "node-a", label: "边缘节点A" },
    { value: "node-b", label: "中心节点B" }
  ];

  const STREAM_PULL_PROTOCOL_OPTIONS = [
    { value: "", label: "请选择拉流方式" },
    { value: "tcp", label: "TCP" },
    { value: "udp", label: "UDP" }
  ];

  const STREAM_NO_VIEWER_OPTIONS = [
    { value: "none", label: "不做处理" },
    { value: "pause", label: "停用" },
    { value: "remove", label: "移除" }
  ];

  const ROWS = [
    {
      id: "gb-001",
      sourceType: "gb_device",
      sourceTypeLabel: "国标设备",
      name: "IP CAMERA",
      deviceId: "44130300001320000017",
      sourceCode: "44130300001320000017",
      address: "tcp://172.23.3.181:50311",
      endpoint: "tcp://172.23.3.181:50311",
      transportMode: "TCP被动模式",
      runtimeStatus: "online",
      runtimeStatusLabel: "在线",
      status: "online",
      statusLabel: "在线",
      enabled: "enabled",
      enabledLabel: "已启用",
      createdAt: "2026-03-22 20:08:42",
      heartbeatAt: "2026-03-24 15:08:03",
      registerAt: "2026-03-24 14:58:57",
      subscribeCatalog: false,
      subscribePosition: false,
      vendor: "Hikvision",
      channelCount: "1",
      accessInfo: { code: "44130240202000000001", region: "4413024020", ip: "192.168.224.115", port: "18116", password: "12345678" }
    },
    {
      id: "gb-002",
      sourceType: "gb_device",
      sourceTypeLabel: "国标设备",
      name: "IP DOME",
      deviceId: "34020000001320000010",
      sourceCode: "34020000001320000010",
      address: "tcp://172.23.8.170:63153",
      endpoint: "tcp://172.23.8.170:63153",
      transportMode: "TCP被动模式",
      runtimeStatus: "offline",
      runtimeStatusLabel: "离线",
      status: "offline",
      statusLabel: "离线",
      enabled: "enabled",
      enabledLabel: "已启用",
      createdAt: "2026-03-20 12:27:56",
      heartbeatAt: "2026-03-20 12:33:56",
      registerAt: "2026-03-20 12:27:56",
      subscribeCatalog: false,
      subscribePosition: true,
      vendor: "Hikvision",
      channelCount: "1",
      accessInfo: { code: "34020000001320000010", region: "3402000000", ip: "172.23.8.170", port: "63153", password: "12345678" }
    },
    {
      id: "proxy-001",
      sourceType: "stream_proxy",
      sourceTypeLabel: "拉流设备",
      name: "固定地址1",
      appName: "固定地址1",
      streamId: "test1",
      sourceCode: "test1",
      streamUrl: "rtsp://admin:***@172.23.8.170:554/h264/ch1/main/av_stream",
      endpoint: "rtsp://admin:***@172.23.8.170:554/h264/ch1/main/av_stream",
      runtimeStatus: "idle",
      runtimeStatusLabel: "暂未拉流",
      pullStatus: "idle",
      pullStatusLabel: "暂未拉流",
      enabled: "enabled",
      enabledLabel: "已启用",
      createdAt: "2026-03-20 14:21:12",
      gbCode: "44130300001320000017",
      mediaServer: "zlmediakit-local",
      proxyMode: "默认"
    },
    {
      id: "proxy-002",
      sourceType: "stream_proxy",
      sourceTypeLabel: "拉流设备",
      name: "拉流测试",
      appName: "拉流测试",
      streamId: "123456",
      sourceCode: "123456",
      streamUrl: "rtsp://172.23.3.33:554/test",
      endpoint: "rtsp://172.23.3.33:554/test",
      runtimeStatus: "idle",
      runtimeStatusLabel: "暂未拉流",
      pullStatus: "idle",
      pullStatusLabel: "暂未拉流",
      enabled: "enabled",
      enabledLabel: "已启用",
      createdAt: "2026-03-06 11:03:43",
      gbCode: "44130300001320000018",
      mediaServer: "zlmediakit-local",
      proxyMode: "默认"
    },
    {
      id: "gb-003",
      sourceType: "gb_device",
      sourceTypeLabel: "国标设备",
      name: "测试设备1",
      deviceId: "44130300001320000031",
      sourceCode: "44130300001320000031",
      address: "tcp://172.23.2.51:50812",
      endpoint: "tcp://172.23.2.51:50812",
      transportMode: "TCP被动模式",
      runtimeStatus: "online",
      runtimeStatusLabel: "在线",
      status: "online",
      statusLabel: "在线",
      enabled: "enabled",
      enabledLabel: "已启用",
      createdAt: "2026-03-24 10:21:07",
      heartbeatAt: "2026-03-24 15:11:26",
      registerAt: "2026-03-24 10:21:07",
      subscribeCatalog: true,
      subscribePosition: true,
      vendor: "Dahua",
      channelCount: "2",
      accessInfo: { code: "44130300001320000031", region: "4413030000", ip: "172.23.2.51", port: "50812", password: "12345678" }
    },
    {
      id: "proxy-003",
      sourceType: "stream_proxy",
      sourceTypeLabel: "拉流设备",
      name: "固定地址2",
      appName: "固定地址2",
      streamId: "test2",
      sourceCode: "test2",
      streamUrl: "rtsp://admin:***@172.23.8.171:554/live/ch01",
      endpoint: "rtsp://admin:***@172.23.8.171:554/live/ch01",
      runtimeStatus: "running",
      runtimeStatusLabel: "拉流中",
      pullStatus: "running",
      pullStatusLabel: "拉流中",
      enabled: "disabled",
      enabledLabel: "已停用",
      createdAt: "2026-03-24 09:12:40",
      gbCode: "44130300001320000019",
      mediaServer: "zlmediakit-local",
      proxyMode: "按需"
    }
  ];

  const ALL_COLUMNS = [
    { key: "name", label: "名称" },
    { key: "sourceCode", label: "来源标识" },
    { key: "endpoint", label: "接入地址" },
    { key: "runtimeStatus", label: "运行状态" },
    { key: "actions", label: "操作" }
  ];

  const GB_DEVICE_COLUMNS = [
    { key: "name", label: "名称" },
    { key: "deviceId", label: "设备编号" },
    { key: "address", label: "地址" },
    { key: "vendor", label: "厂家" },
    { key: "transportMode", label: "流传输模式" },
    { key: "channelCount", label: "通道数" },
    { key: "status", label: "状态" },
    { key: "heartbeatAt", label: "最近心跳" },
    { key: "registerAt", label: "最近注册" },
    { key: "actions", label: "操作" }
  ];

  const STREAM_PROXY_COLUMNS = [
    { key: "appName", label: "流应用名" },
    { key: "streamId", label: "流ID" },
    { key: "streamUrl", label: "流地址" },
    { key: "mediaServer", label: "流媒体" },
    { key: "proxyMode", label: "代理方式" },
    { key: "gbCode", label: "国标编码" },
    { key: "pullStatus", label: "拉流状态" },
    { key: "enabled", label: "启用" },
    { key: "createdAt", label: "创建时间" },
    { key: "actions", label: "操作" }
  ];

  window.registerPrototypePage({
    key: "access-source",
    kind: "table",
    styleSource: "resources/css/pages/access-source.css",
    heading: "接入源管理",
    subtitle: "统一管理国标设备与拉流设备，按类型继承公共属性并扩展个性配置。",
    breadcrumbTrail: ["接入管理"],
    countTextPrefix: "共 ",
    countTextUnit: " 条",
    emptyText: "暂无接入源",
    accessSourcePage: {
      typeOrder: [ALL, "gb_device", "stream_proxy"],
      rows: ROWS,
      statusOptions: [{ value: "", label: "全部状态" }].concat(runtimeOptions()),
      enabledOptions: [{ value: "", label: "全部启用状态" }].concat(ENABLED_OPTIONS)
    },
    renderTablePanel: function (ctx) {
      const typeOpts = typeOptions(ctx.page.accessSourcePage);
      return '<section class="panel access-source-panel">' +
        '<div id="access-source-tabs" class="access-source-tabs">' + renderTabs(ctx.page.accessSourcePage, typeOpts, ALL) + '</div>' +
        '<div class="table-toolbar access-source-toolbar"><div class="toolbar-group access-source-filters">' +
        '<label class="access-source-filter"><span class="access-source-filter-label">搜索</span><input id="access-source-search" class="filter-field" type="search" placeholder="名称 / 标识 / 地址" /></label>' +
        '<label class="access-source-filter"><span class="access-source-filter-label">来源类型</span>' + selectHtml("access-source-type", typeOpts) + "</label>" +
        '<label class="access-source-filter"><span class="access-source-filter-label">运行状态</span>' + selectHtml("access-source-status", ctx.page.accessSourcePage.statusOptions) + "</label>" +
        '<label class="access-source-filter"><span class="access-source-filter-label">启用状态</span>' + selectHtml("access-source-enabled", ctx.page.accessSourcePage.enabledOptions) + "</label>" +
        '<button id="access-source-query" class="button" type="button">查询</button><button id="access-source-reset" class="button-secondary" type="button">重置</button>' +
        '</div><div class="toolbar-group access-source-actions"><button id="access-source-add" class="button access-source-add" type="button" data-access-action="open-create">+ 新增接入源</button><button id="access-source-refresh" class="access-source-refresh" type="button" aria-label="刷新">↻</button></div></div>' +
        '<div class="table-shell access-source-table-shell"><table><thead><tr id="access-source-table-head"></tr></thead><tbody id="access-source-table-body"></tbody></table></div>' +
        '<div class="table-footer access-source-footer"><div class="table-footer-count hint-text" id="access-source-count"></div></div>' +
        infoModalHtml() + createModalHtml() + "</section>";
    },
    setup: function (rt) {
      const u = window.PROTOTYPE_UTILS;
      const p = rt.page;
      const n = ids();
      const s = { type: ALL, infoId: "", createOpen: false, createTypeSwitch: false, draft: makeDraft("gb_device") };

      function rows() {
        return Array.isArray(p.accessSourcePage.rows) ? p.accessSourcePage.rows : [];
      }

      function persist() {
        if (rt.mockStore && typeof rt.mockStore.patchPage === "function") {
          rt.mockStore.patchPage("access-source", { accessSourcePage: { rows: p.accessSourcePage.rows } });
        }
      }

      function hydrateRows() {
        const normalized = rows().map(normalizeRow);
        p.accessSourcePage.rows = normalized;
        persist();
      }

      function render() {
        const rws = filtered(rows(), n, s.type, u);
        const cols = columns(n.type.value || s.type);
        n.head.innerHTML = cols.map(function (c) { return "<th>" + u.escapeHtml(c.label) + "</th>"; }).join("");
        n.body.innerHTML = rws.length ? rws.map(function (r) { return rowHtml(r, cols, u); }).join("") : emptyHtml(cols.length, p.emptyText);
        n.count.textContent = p.countTextPrefix + rws.length + p.countTextUnit;
        n.tabs.innerHTML = renderTabs(p.accessSourcePage, typeOptions(p.accessSourcePage), s.type, rows());
        n.add.textContent = META[n.type.value] ? "+ 新增" + META[n.type.value].label : "+ 新增接入源";
      }

      function openInfo(row) {
        s.infoId = row.id;
        n.infoBody.innerHTML = infoItems(row.accessInfo || {});
        n.infoModal.classList.add("visible");
        n.infoBg.classList.add("visible");
        document.body.classList.add("access-source-modal-open");
      }

      function closeInfo() {
        s.infoId = "";
        n.infoModal.classList.remove("visible");
        n.infoBg.classList.remove("visible");
        if (!s.createOpen) {
          document.body.classList.remove("access-source-modal-open");
        }
      }

      function openCreate() {
        const activeType = s.type === ALL ? "gb_device" : s.type;
        s.createTypeSwitch = s.type === ALL;
        s.createOpen = true;
        s.draft = makeDraft(activeType);
        syncCreate(n, s.draft, s.createTypeSwitch);
        n.createModal.classList.add("visible");
        n.createBg.classList.add("visible");
        document.body.classList.add("access-source-modal-open");
      }

      function closeCreate() {
        s.createOpen = false;
        s.createTypeSwitch = false;
        n.createModal.classList.remove("visible");
        n.createBg.classList.remove("visible");
        if (!s.infoId) {
          document.body.classList.remove("access-source-modal-open");
        }
      }

      function submitCreate() {
        const err = validate(s.draft);
        if (err) {
          rt.showToast("信息不完整", err);
          return;
        }

        const row = toRow(s.draft);
        p.accessSourcePage.rows = [row].concat(rows());
        persist();
        closeCreate();
        render();
        rt.showToast("新增成功", "已新增接入源 " + row.name + "。");
      }

      function onClick(e) {
        const tab = e.target.closest("[data-access-type]");
        if (tab) {
          s.type = tab.getAttribute("data-access-type") || ALL;
          n.type.value = s.type;
          render();
          return;
        }

        const btn = e.target.closest("[data-access-action]");
        if (btn) {
          const action = btn.getAttribute("data-access-action") || "";
          const rowId = btn.getAttribute("data-access-id") || "";
          const row = rows().find(function (x) { return x.id === rowId; }) || null;

          if (action === "open-create") {
            openCreate();
            return;
          }

          if (action === "close-create") {
            closeCreate();
            return;
          }

          if (action === "submit-create") {
            submitCreate();
            return;
          }

          if (action === "access-info" && row) {
            openInfo(row);
            return;
          }

          if (action === "delete-row" && row) {
            p.accessSourcePage.rows = rows().filter(function (x) { return x.id !== row.id; });
            persist();
            render();
            rt.showToast("删除成功", "已删除接入源 " + row.name + "。");
            return;
          }

          if (action === "proxy-edit" && row && rt.mockStore && typeof rt.mockStore.patchPage === "function") {
            rt.mockStore.patchPage("stream-proxy", { streamProxyPage: { activeProxyId: row.id } });
            return;
          }

          if (action === "play" && row) {
            rt.showToast("播放", "当前原型预留 " + row.name + " 的播放能力。");
            return;
          }
        }

        if (e.target.closest("#access-source-access-backdrop") || e.target.closest("[data-access-modal-close]")) {
          closeInfo();
        }

        if (e.target.closest("#access-source-create-backdrop")) {
          closeCreate();
        }
      }

      function onDraft(e) {
        if (!s.createOpen) {
          return;
        }

        const node = e.target.closest("[data-create-field]");
        if (!node) {
          return;
        }

        const key = node.getAttribute("data-create-field");
        if (!key) {
          return;
        }

        if (key === "sourceType" && s.createTypeSwitch) {
          const nextType = String(node.value || "").trim();
          if (nextType && nextType !== s.draft.sourceType && META[nextType]) {
            s.draft = makeDraft(nextType);
            syncCreate(n, s.draft, s.createTypeSwitch);
          }
          return;
        }

        if (node.type === "radio") {
          if (!node.checked) {
            return;
          }
          s.draft[key] = String(node.value || "");
          return;
        }

        if (node.type === "checkbox") {
          s.draft[key] = !!node.checked;
          return;
        }

        s.draft[key] = String(node.value || "").trim();
      }

      function onEsc(e) {
        if (e.key !== "Escape") {
          return;
        }

        if (s.createOpen) {
          closeCreate();
          return;
        }

        if (s.infoId) {
          closeInfo();
        }
      }

      n.search.addEventListener("input", render);
      n.type.addEventListener("change", function () {
        s.type = n.type.value || ALL;
        render();
      });
      n.status.addEventListener("change", render);
      n.enabled.addEventListener("change", render);
      n.query.addEventListener("click", render);
      n.reset.addEventListener("click", function () {
        n.search.value = "";
        s.type = ALL;
        n.type.value = ALL;
        n.status.value = "";
        n.enabled.value = "";
        render();
      });
      n.refresh.addEventListener("click", function () {
        render();
        rt.showToast("刷新成功", "当前原型已刷新接入源列表。");
      });
      rt.mountNode.addEventListener("click", onClick);
      rt.mountNode.addEventListener("input", onDraft);
      rt.mountNode.addEventListener("change", onDraft);
      window.addEventListener("keydown", onEsc);

      n.type.value = ALL;
      hydrateRows();
      render();

      return function () {
        rt.mountNode.removeEventListener("click", onClick);
        rt.mountNode.removeEventListener("input", onDraft);
        rt.mountNode.removeEventListener("change", onDraft);
        window.removeEventListener("keydown", onEsc);
      };
    }
  });

  function ids() {
    return {
      search: g("access-source-search"),
      type: g("access-source-type"),
      status: g("access-source-status"),
      enabled: g("access-source-enabled"),
      query: g("access-source-query"),
      reset: g("access-source-reset"),
      refresh: g("access-source-refresh"),
      add: g("access-source-add"),
      tabs: g("access-source-tabs"),
      head: g("access-source-table-head"),
      body: g("access-source-table-body"),
      count: g("access-source-count"),
      infoModal: g("access-source-access-modal"),
      infoBg: g("access-source-access-backdrop"),
      infoBody: g("access-source-access-body"),
      createModal: g("access-source-create-modal"),
      createBg: g("access-source-create-backdrop"),
      createTitle: g("access-source-create-title"),
      createForm: g("access-source-create-form"),
      createSubmit: g("access-source-create-submit")
    };
  }

  function g(id) {
    return document.getElementById(id);
  }

  function runtimeOptions() {
    const all = [];
    Object.keys(META).forEach(function (k) {
      META[k].runtime.forEach(function (r) {
        if (!all.some(function (x) { return x.value === r.value; })) {
          all.push(r);
        }
      });
    });
    return all;
  }

  function typeOptions(page) {
    return (page.typeOrder || [ALL]).map(function (k) {
      return k === ALL ? { value: ALL, label: "全部来源" } : { value: k, label: META[k].label };
    });
  }

  function columns(type) {
    if (type === "gb_device") {
      return GB_DEVICE_COLUMNS;
    }
    if (type === "stream_proxy") {
      return STREAM_PROXY_COLUMNS;
    }
    return ALL_COLUMNS;
  }

  function filtered(rows, n, fallbackType, u) {
    const kw = u.normalize((n.search && n.search.value) || "");
    const t = (n.type && n.type.value) || fallbackType;
    const st = (n.status && n.status.value) || "";
    const en = (n.enabled && n.enabled.value) || "";

    return rows.filter(function (r) {
      if (t !== ALL && rowType(r) !== t) {
        return false;
      }
      if (st && canonicalRuntimeStatus(r) !== st) {
        return false;
      }
      if (en && r.enabled !== en) {
        return false;
      }
      if (!kw) {
        return true;
      }

      const fs = t === ALL ? ["name", "sourceCode", "endpoint", "sourceTypeLabel"] : META[t].search;
      return fs.some(function (f) {
        return u.normalize(r[f]).indexOf(kw) > -1;
      });
    });
  }

  function renderTabs(page, opts, active, rows) {
    const list = rows || page.rows || [];
    return opts.map(function (o) {
      const c = o.value === ALL ? list.length : list.filter(function (r) { return rowType(r) === o.value; }).length;
      return '<button class="access-source-tab' + (o.value === active ? " active" : "") + '" type="button" data-access-type="' + o.value + '">' + o.label + "（" + c + "）</button>";
    }).join("");
  }

  function rowHtml(r, cols, u) {
    return "<tr>" + cols.map(function (c) {
      if (c.key === "name" || c.key === "appName") {
        return "<td><strong>" + u.escapeHtml(valueByKey(r, c.key) || "--") + "</strong></td>";
      }
      if (c.key === "endpoint" || c.key === "address" || c.key === "streamUrl") {
        const address = valueByKey(r, c.key) || "--";
        const displayName = valueByKey(r, "appName") || valueByKey(r, "name") || "当前记录";
        return '<td><button class="access-source-endpoint" type="button" data-toast-title="接入地址" data-toast-message="' + u.escapeAttribute("已查看 " + displayName + " 的接入地址。") + '">' + u.escapeHtml(address) + "</button></td>";
      }
      if (c.key === "runtimeStatus" || c.key === "status" || c.key === "pullStatus") {
        const statusValue = statusClassByKey(r, c.key);
        const statusText = statusTextByKey(r, c.key);
        return '<td><span class="status-pill ' + u.escapeAttribute(statusValue || "") + '">' + u.escapeHtml(statusText || "--") + "</span></td>";
      }
      if (c.key === "enabled") {
        return '<td><span class="status-pill ' + u.escapeAttribute(r.enabled || "") + '">' + u.escapeHtml(r.enabledLabel || "--") + "</span></td>";
      }
      if (c.key === "subscribe") {
        return "<td>" + subscribeHtml(r) + "</td>";
      }
      if (c.key === "actions") {
        return '<td><div class="table-actions access-source-actions-cell">' + actions(r, u) + "</div></td>";
      }
      return "<td>" + u.escapeHtml(valueByKey(r, c.key) || "--") + "</td>";
    }).join("") + "</tr>";
  }

  function valueByKey(row, key) {
    if (key === "name") { return pick(row.name, row.appName, row.deviceName, row.deviceId); }
    if (key === "sourceCode") { return pick(row.sourceCode, row.deviceId, row.streamId, row.gbCode, row.accessInfo && row.accessInfo.code); }
    if (key === "endpoint") { return pick(row.endpoint, row.address, row.streamUrl, formatAccessAddress(row.accessInfo)); }
    if (key === "deviceId") { return pick(row.deviceId, row.sourceCode, row.accessInfo && row.accessInfo.code); }
    if (key === "address") { return pick(row.address, row.endpoint, formatAccessAddress(row.accessInfo)); }
    if (key === "appName") { return pick(row.appName, row.name, row.streamId, row.sourceCode); }
    if (key === "streamId") { return pick(row.streamId, row.sourceCode, row.gbCode, row.proxyConfig && row.proxyConfig.streamId); }
    if (key === "streamUrl") { return pick(row.streamUrl, row.endpoint, row.address, row.proxyConfig && row.proxyConfig.streamUrl); }
    if (key === "heartbeatAt") { return pick(row.heartbeatAt, row.createdAt, row.registerAt); }
    if (key === "registerAt") { return pick(row.registerAt, row.createdAt, row.heartbeatAt); }
    return pick(row[key]);
  }

  function statusClassByKey(row, key) {
    if (key === "status") { return canonicalRuntimeStatus(row, "status"); }
    if (key === "pullStatus") { return canonicalRuntimeStatus(row, "pullStatus"); }
    return canonicalRuntimeStatus(row);
  }

  function statusTextByKey(row, key) {
    const type = rowType(row);
    if (key === "status") { return pick(row.statusLabel, row.runtimeStatusLabel, runtimeStatusLabel(type, canonicalRuntimeStatus(row, "status"))); }
    if (key === "pullStatus") { return pick(row.pullStatusLabel, row.runtimeStatusLabel, runtimeStatusLabel(type, canonicalRuntimeStatus(row, "pullStatus"))); }
    return pick(row.runtimeStatusLabel, row.statusLabel, row.pullStatusLabel, runtimeStatusLabel(type, canonicalRuntimeStatus(row)));
  }

  function subscribeHtml(row) {
    const catalog = !!row.subscribeCatalog;
    const position = !!row.subscribePosition;
    return '<div class="access-source-subscribe">' +
      '<label class="access-source-subscribe-item"><input type="checkbox"' + (catalog ? ' checked="checked"' : "") + ' disabled="disabled" /><span>目录</span></label>' +
      '<label class="access-source-subscribe-item"><input type="checkbox"' + (position ? ' checked="checked"' : "") + ' disabled="disabled" /><span>位置</span></label>' +
      "</div>";
  }

  function actions(r, u) {
    if (rowType(r) === "gb_device") {
      return '<button class="table-action access-source-action-link" type="button" data-route="gb-device-edit">编辑</button><span class="access-source-action-divider">|</span><button class="table-action access-source-action-link" type="button" data-route="gb-channel-list">通道</button><span class="access-source-action-divider">|</span><button class="table-action access-source-action-link" type="button" data-access-action="access-info" data-access-id="' + u.escapeAttribute(r.id) + '">接入信息</button><span class="access-source-action-divider">|</span><button class="table-action access-source-action-link" type="button" data-access-action="delete-row" data-access-id="' + u.escapeAttribute(r.id) + '">删除</button>';
    }

    return '<button class="table-action access-source-action-link" type="button" data-access-action="play" data-access-id="' + u.escapeAttribute(r.id) + '">播放</button><span class="access-source-action-divider">|</span><button class="table-action access-source-action-link" type="button" data-route="stream-proxy-edit" data-access-action="proxy-edit" data-access-id="' + u.escapeAttribute(r.id) + '">编辑</button><span class="access-source-action-divider">|</span><button class="table-action access-source-action-link" type="button" data-route="cloud-record">云端录像</button><span class="access-source-action-divider">|</span><button class="table-action access-source-action-link" type="button" data-access-action="delete-row" data-access-id="' + u.escapeAttribute(r.id) + '">删除</button>';
  }

  function rowType(row) {
    if (row && META[row.sourceType]) {
      return row.sourceType;
    }

    if (row && (
      row.appName || row.streamId || row.streamUrl || row.mediaServer || row.proxyMode || row.pullStatus || row.gbCode
    )) {
      return "stream_proxy";
    }

    return "gb_device";
  }

  function normalizeRow(row) {
    const type = rowType(row || {});
    const base = Object.assign({}, row || {}, { sourceType: type, sourceTypeLabel: META[type].label });
    const rowId = sanitize(base.id) || (type === "stream_proxy" ? "proxy-auto" : "gb-auto");

    if (type === "stream_proxy") {
      const appName = pick(base.appName, base.name, base.proxyConfig && base.proxyConfig.appName, "拉流设备");
      const streamId = pick(base.streamId, base.sourceCode, base.gbCode, base.proxyConfig && base.proxyConfig.streamId, rowId);
      const streamUrl = pick(base.streamUrl, base.endpoint, base.address, base.proxyConfig && base.proxyConfig.streamUrl, "rtsp://127.0.0.1/live/" + streamId);
      const pullStatus = normalizeStatusValue(type, pick(base.pullStatus, base.runtimeStatus, "idle"));
      const pullStatusLabel = pick(base.pullStatusLabel, base.runtimeStatusLabel, runtimeStatusLabel(type, pullStatus));
      return Object.assign(base, {
        name: pick(appName, streamId, base.name, "--"),
        appName: pick(appName, streamId, "--"),
        streamId: pick(streamId, "--"),
        sourceCode: pick(base.sourceCode, streamId, base.gbCode, "--"),
        streamUrl: pick(streamUrl, "--"),
        endpoint: pick(base.endpoint, streamUrl, "--"),
        runtimeStatus: normalizeStatusValue(type, pick(base.runtimeStatus, pullStatus, "idle")),
        runtimeStatusLabel: pick(base.runtimeStatusLabel, pullStatusLabel, runtimeStatusLabel(type, normalizeStatusValue(type, pick(base.runtimeStatus, pullStatus, "idle")))),
        pullStatus: pullStatus,
        pullStatusLabel: pullStatusLabel,
        mediaServer: pick(base.mediaServer, "zlmediakit-local"),
        proxyMode: pick(base.proxyMode, "默认"),
        gbCode: pick(base.gbCode, "--"),
        createdAt: pick(base.createdAt, now()),
        enabled: pick(base.enabled, "enabled"),
        enabledLabel: pick(base.enabledLabel, base.enabled === "disabled" ? "已停用" : "已启用")
      });
    }

    const name = pick(base.name, base.deviceName, base.deviceId, base.sourceCode, base.accessInfo && base.accessInfo.code, "国标设备");
    const deviceId = pick(base.deviceId, base.sourceCode, base.accessInfo && base.accessInfo.code, rowId);
    const address = pick(base.address, base.endpoint, formatAccessAddress(base.accessInfo), "tcp://127.0.0.1:5060");
    const status = normalizeStatusValue(type, pick(base.status, base.runtimeStatus, "online"));
    const statusLabel = pick(base.statusLabel, base.runtimeStatusLabel, runtimeStatusLabel(type, status));
    return Object.assign(base, {
      name: pick(name, "--"),
      deviceId: pick(deviceId, "--"),
      sourceCode: pick(base.sourceCode, deviceId, base.accessInfo && base.accessInfo.code, "--"),
      address: pick(address, "--"),
      endpoint: pick(base.endpoint, address, "--"),
      transportMode: pick(base.transportMode, "TCP被动模式"),
      status: status,
      statusLabel: statusLabel,
      runtimeStatus: normalizeStatusValue(type, pick(base.runtimeStatus, status, "online")),
      runtimeStatusLabel: pick(base.runtimeStatusLabel, statusLabel, runtimeStatusLabel(type, normalizeStatusValue(type, pick(base.runtimeStatus, status, "online")))),
      vendor: pick(base.vendor, "--"),
      channelCount: pick(base.channelCount, "1"),
      createdAt: pick(base.createdAt, now()),
      heartbeatAt: pick(base.heartbeatAt, base.createdAt, base.registerAt, now()),
      registerAt: pick(base.registerAt, base.createdAt, base.heartbeatAt, now()),
      subscribeCatalog: !!base.subscribeCatalog,
      subscribePosition: !!base.subscribePosition,
      enabled: pick(base.enabled, "enabled"),
      enabledLabel: pick(base.enabledLabel, base.enabled === "disabled" ? "已停用" : "已启用")
    });
  }

  function canonicalRuntimeStatus(row, key) {
    const type = rowType(row || {});
    let raw = "";
    if (key === "status") {
      raw = pick(row && row.status, row && row.runtimeStatus);
    } else if (key === "pullStatus") {
      raw = pick(row && row.pullStatus, row && row.runtimeStatus);
    } else {
      raw = pick(row && row.runtimeStatus, row && row.status, row && row.pullStatus);
    }
    return normalizeStatusValue(type, raw);
  }

  function normalizeStatusValue(type, raw) {
    const text = sanitize(raw).toLowerCase();
    if (type === "stream_proxy") {
      if (text === "running" || text === "拉流中" || text === "playing") { return "running"; }
      if (text === "idle" || text === "暂未拉流" || text === "未拉流" || text === "stopped" || text === "pause") { return "idle"; }
      return "idle";
    }
    if (text === "offline" || text === "离线" || text === "down") { return "offline"; }
    if (text === "online" || text === "在线" || text === "可用" || text === "available" || text === "up") { return "online"; }
    return "online";
  }

  function runtimeStatusLabel(type, value) {
    if (type === "stream_proxy") {
      return value === "running" ? "拉流中" : "暂未拉流";
    }
    return value === "offline" ? "离线" : "在线";
  }

  function pick() {
    for (let i = 0; i < arguments.length; i += 1) {
      const value = sanitize(arguments[i]);
      if (value !== "") {
        return value;
      }
    }
    return "";
  }

  function sanitize(value) {
    if (value == null) {
      return "";
    }
    const text = String(value).trim();
    if (!text || text === "--" || text === "-" || text === "暂无" || text === "null" || text === "undefined") {
      return "";
    }
    return text;
  }

  function formatAccessAddress(accessInfo) {
    if (!accessInfo) {
      return "";
    }
    const ip = sanitize(accessInfo.ip);
    const port = sanitize(accessInfo.port);
    if (!ip && !port) {
      return "";
    }
    if (ip && port) {
      return ip + ":" + port;
    }
    return ip || port;
  }

  function emptyHtml(colspan, text) {
    const u = window.PROTOTYPE_UTILS;
    return '<tr><td colspan="' + colspan + '"><div class="empty-state">' + u.escapeHtml(text || "暂无数据") + "</div></td></tr>";
  }

  function selectHtml(id, opts) {
    const u = window.PROTOTYPE_UTILS;
    return '<select id="' + u.escapeAttribute(id) + '" class="filter-field">' + opts.map(function (o) {
      return '<option value="' + u.escapeAttribute(o.value) + '">' + u.escapeHtml(o.label) + "</option>";
    }).join("") + "</select>";
  }

  function infoModalHtml() {
    return '<div id="access-source-access-backdrop" class="access-source-modal-backdrop"></div><section id="access-source-access-modal" class="access-source-modal" aria-hidden="true"><div class="access-source-modal-header"><h3 class="access-source-modal-title">接入信息</h3><button class="access-source-modal-close" type="button" data-access-modal-close="true" aria-label="关闭">×</button></div><div id="access-source-access-body" class="access-source-modal-body"></div></section>';
  }

  function createModalHtml() {
    return '<div id="access-source-create-backdrop" class="access-source-modal-backdrop"></div><section id="access-source-create-modal" class="access-source-modal access-source-create-modal" aria-hidden="true"><div class="access-source-modal-header"><h3 id="access-source-create-title" class="access-source-modal-title">新增接入源</h3><button class="access-source-modal-close" type="button" data-access-action="close-create" aria-label="关闭">×</button></div><div class="access-source-modal-body access-source-create-body"><div id="access-source-create-form" class="access-source-create-form"></div></div><div class="access-source-create-footer"><button id="access-source-create-submit" class="button" type="button" data-access-action="submit-create">保存</button><button class="button-secondary" type="button" data-access-action="close-create">取消</button></div></section>';
  }

  function syncCreate(n, d, allowTypeSwitch) {
    if (!n.createForm) {
      return;
    }

    const prefix = allowTypeSwitch ? createFormRow("设备类型", createSelect("sourceType", CREATE_SOURCE_TYPE_OPTIONS, d.sourceType), true) : "";

    if (d.sourceType === "gb_device") {
      n.createTitle.textContent = allowTypeSwitch ? "新增接入源" : "设备编辑";
      n.createSubmit.textContent = "确认";
      n.createForm.innerHTML = renderGbCreateForm(d, prefix);
      return;
    }

    n.createTitle.textContent = allowTypeSwitch ? "新增接入源" : "新增拉流设备";
    n.createSubmit.textContent = "保存";
    n.createForm.innerHTML = renderStreamCreateForm(d, prefix);
  }

  function renderGbCreateForm(draft, prefix) {
    return '<div class="access-source-create-form-layout">' +
      (prefix || "") +
      createFormRow("设备编号", createInput("deviceId", draft.deviceId, "请输入设备编号"), true) +
      createFormRow("设备名称", createInput("deviceName", draft.deviceName, "请输入设备名称"), false) +
      createFormRow("密码", createInput("password", draft.password, "请输入密码"), false) +
      createFormRow("收流IP", createInput("receiveIp", draft.receiveIp, "请输入收流IP"), false) +
      createFormRow("流媒体ID", createSelect("mediaServerId", GB_MEDIA_SERVER_OPTIONS, draft.mediaServerId), false) +
      createFormRow("字符集", createSelect("charset", GB_CHARSET_OPTIONS, draft.charset), false) +
      createFormRow("坐标系", createSelect("coordinateSystem", GB_COORDINATE_OPTIONS, draft.coordinateSystem), false) +
      createFormRow("其他选项", createCheckboxGroup([
        createCheckbox("checkSsrc", "SSRC校验", draft.checkSsrc),
        createCheckbox("asMessageChannel", "作为消息通道", draft.asMessageChannel),
        createCheckbox("sendStreamAfterAck", "收到ACK后发流", draft.sendStreamAfterAck)
      ]), false) +
      "</div>";
  }

  function renderStreamCreateForm(draft, prefix) {
    return '<div class="access-source-create-form-layout">' +
      (prefix || "") +
      createFormRow("类型", createSelect("type", STREAM_TYPE_OPTIONS, draft.type), false) +
      createFormRow("应用名", createInput("appName", draft.appName, "请输入应用名"), true) +
      createFormRow("流ID", createInput("streamId", draft.streamId, "请输入流ID"), true) +
      createFormRow("拉流地址", createInput("streamUrl", draft.streamUrl, "请输入拉流地址"), false) +
      createFormRow("超时时间(秒)", createInput("timeoutSeconds", draft.timeoutSeconds, "请输入超时时间"), false) +
      createFormRow("节点选择", createSelect("nodeKey", STREAM_NODE_OPTIONS, draft.nodeKey), false) +
      createFormRow("拉流方式(RTSP)", createSelect("pullProtocol", STREAM_PULL_PROTOCOL_OPTIONS, draft.pullProtocol), false) +
      createFormRow("无人观看", createRadioGroup("noViewerAction", STREAM_NO_VIEWER_OPTIONS, draft.noViewerAction), false) +
      createFormRow("其他选项", createCheckboxGroup([
        createCheckbox("enabled", "启用", draft.enabled),
        createCheckbox("audioEnabled", "开启音频", draft.audioEnabled),
        createCheckbox("recording", "录制", draft.recording)
      ]), false) +
      "</div>";
  }

  function createFormRow(label, control, required) {
    const u = window.PROTOTYPE_UTILS;
    return '<label class="access-source-create-form-row"><span class="access-source-create-form-label">' + (required ? '<span class="access-source-required">*</span>' : "") + u.escapeHtml(label) + '</span><span class="access-source-create-form-value">' + control + "</span></label>";
  }

  function createInput(field, value, placeholder) {
    const u = window.PROTOTYPE_UTILS;
    return '<input class="access-source-create-control" data-create-field="' + u.escapeAttribute(field) + '" type="text" value="' + u.escapeAttribute(value || "") + '" placeholder="' + u.escapeAttribute(placeholder || "") + '" />';
  }

  function createSelect(field, opts, value) {
    const u = window.PROTOTYPE_UTILS;
    return '<select class="access-source-create-control access-source-create-select" data-create-field="' + u.escapeAttribute(field) + '">' + (opts || []).map(function (o) {
      const selected = o.value === value ? ' selected="selected"' : "";
      return '<option value="' + u.escapeAttribute(o.value) + '"' + selected + ">" + u.escapeHtml(o.label) + "</option>";
    }).join("") + "</select>";
  }

  function createCheckboxGroup(items) {
    return '<div class="access-source-create-check-group">' + (items || []).join("") + "</div>";
  }

  function createCheckbox(field, label, checked) {
    const u = window.PROTOTYPE_UTILS;
    return '<label class="access-source-create-check-item"><input type="checkbox" data-create-field="' + u.escapeAttribute(field) + '"' + (checked ? ' checked="checked"' : "") + ' /><span>' + u.escapeHtml(label) + "</span></label>";
  }

  function createRadioGroup(field, opts, value) {
    const u = window.PROTOTYPE_UTILS;
    return '<div class="access-source-create-radio-group">' + (opts || []).map(function (o) {
      return '<label class="access-source-create-radio-item"><input type="radio" name="' + u.escapeAttribute(field) + '" data-create-field="' + u.escapeAttribute(field) + '" value="' + u.escapeAttribute(o.value) + '"' + (o.value === value ? ' checked="checked"' : "") + ' /><span>' + u.escapeHtml(o.label) + "</span></label>";
    }).join("") + "</div>";
  }

  function makeDraft(type) {
    if (type === "stream_proxy") {
      return {
        sourceType: "stream_proxy",
        type: "default",
        appName: "",
        streamId: "",
        streamUrl: "",
        timeoutSeconds: "10",
        nodeKey: "",
        pullProtocol: "",
        noViewerAction: "pause",
        enabled: true,
        audioEnabled: true,
        recording: false
      };
    }

    return {
      sourceType: "gb_device",
      deviceId: "",
      deviceName: "",
      password: "",
      receiveIp: "",
      mediaServerId: "",
      charset: "",
      coordinateSystem: "",
      checkSsrc: false,
      asMessageChannel: false,
      sendStreamAfterAck: false
    };
  }

  function validate(d) {
    if (!d.sourceType || !META[d.sourceType]) {
      return "请选择来源类型。";
    }

    if (d.sourceType === "gb_device") {
      if (!String(d.deviceId || "").trim()) {
        return "请填写设备编号。";
      }
      return "";
    }

    if (!String(d.appName || "").trim()) {
      return "请填写应用名。";
    }

    if (!String(d.streamId || "").trim()) {
      return "请填写流ID。";
    }

    return "";
  }

  function toRow(d) {
    if (d.sourceType === "gb_device") {
      return {
        id: newId("gb_device"),
        sourceType: "gb_device",
        sourceTypeLabel: META.gb_device.label,
        name: d.deviceName || d.deviceId,
        deviceId: d.deviceId || "",
        sourceCode: d.deviceId,
        address: d.receiveIp || "--",
        endpoint: d.receiveIp || "--",
        transportMode: "TCP被动模式",
        runtimeStatus: "online",
        runtimeStatusLabel: "在线",
        status: "online",
        statusLabel: "在线",
        enabled: "enabled",
        enabledLabel: "已启用",
        createdAt: now(),
        heartbeatAt: now(),
        registerAt: now(),
        subscribeCatalog: false,
        subscribePosition: false,
        vendor: "--",
        channelCount: "1",
        accessInfo: {
          code: d.deviceId || "--",
          region: String(d.deviceId || "").slice(0, 10) || "--",
          ip: d.receiveIp || "--",
          port: "--",
          password: d.password || "--"
        },
        gbConfig: {
          mediaServerId: d.mediaServerId || "",
          charset: d.charset || "",
          coordinateSystem: d.coordinateSystem || "",
          checkSsrc: !!d.checkSsrc,
          asMessageChannel: !!d.asMessageChannel,
          sendStreamAfterAck: !!d.sendStreamAfterAck
        }
      };
    }

    const enabled = !!d.enabled;
    return {
      id: newId("stream_proxy"),
      sourceType: "stream_proxy",
      sourceTypeLabel: META.stream_proxy.label,
      name: d.appName || d.streamId,
      appName: d.appName || "",
      streamId: d.streamId || "",
      sourceCode: d.streamId,
      streamUrl: d.streamUrl || "--",
      endpoint: d.streamUrl || "--",
      runtimeStatus: "idle",
      runtimeStatusLabel: "暂未拉流",
      pullStatus: "idle",
      pullStatusLabel: "暂未拉流",
      enabled: enabled ? "enabled" : "disabled",
      enabledLabel: enabled ? "已启用" : "已停用",
      createdAt: now(),
      mediaServer: "zlmediakit-local",
      proxyMode: optionLabel(STREAM_TYPE_OPTIONS, d.type, "默认"),
      gbCode: "--",
      proxyConfig: {
        type: d.type,
        timeoutSeconds: d.timeoutSeconds,
        nodeKey: d.nodeKey,
        pullProtocol: d.pullProtocol,
        noViewerAction: d.noViewerAction,
        enabled: enabled,
        audioEnabled: !!d.audioEnabled,
        recording: !!d.recording
      }
    };
  }

  function optionLabel(options, value, fallback) {
    const item = (options || []).find(function (opt) {
      return opt.value === value;
    });
    return item ? item.label : (fallback || "--");
  }

  function newId(type) {
    const prefix = { gb_device: "gb", stream_proxy: "proxy" }[type] || "source";
    return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function infoItems(info) {
    const u = window.PROTOTYPE_UTILS;
    return '<div class="access-source-modal-grid">' +
      infoItem("编号", info.code, false) +
      infoItem("域", info.region, false) +
      infoItem("IP", info.ip, false) +
      infoItem("端口", info.port, false) +
      infoItem("密码", info.password, true) +
      '</div><p class="access-source-modal-note">' + u.escapeHtml("提示：统一页面抽离公共属性，具体参数通过类型配置扩展。") + "</p>";
  }

  function infoItem(label, value, highlight) {
    const u = window.PROTOTYPE_UTILS;
    return '<div class="access-source-modal-item"><span class="access-source-modal-item-label">' + u.escapeHtml(label) + ':</span><span class="' + (highlight ? "access-source-modal-password" : "access-source-modal-item-value") + '">' + u.escapeHtml(value || "--") + "</span></div>";
  }

  function now() {
    const d = new Date();
    return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()) + " " + p2(d.getHours()) + ":" + p2(d.getMinutes()) + ":" + p2(d.getSeconds());
  }

  function p2(n) {
    return String(n).padStart(2, "0");
  }
})();
