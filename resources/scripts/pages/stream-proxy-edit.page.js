(function () {
  const PROXY_INFO_OPTIONS = {
    typeOptions: [
      { value: "default", label: "默认" },
      { value: "on-demand", label: "按需" }
    ],
    nodeOptions: [
      { value: "", label: "请选择拉流节点" },
      { value: "node-a", label: "边缘节点A" },
      { value: "node-b", label: "中心节点B" }
    ],
    protocolOptions: [
      { value: "tcp", label: "TCP" },
      { value: "udp", label: "UDP" }
    ],
    noViewerOptions: [
      { value: "none", label: "不做处理" },
      { value: "pause", label: "停用" },
      { value: "remove", label: "移除" }
    ]
  };

  const CHANNEL_OPTIONS = {
    securityModeOptions: [
      { value: "", label: "请选择信令安全模式" },
      { value: "not-used", label: "不采用" },
      { value: "s-mime", label: "S/MIME" }
    ],
    registerModeOptions: [
      { value: "", label: "请选择注册方式" },
      { value: "ietf-rfc3261", label: "IETFRFC3261标准" },
      { value: "custom", label: "自定义" }
    ],
    validFlagOptions: [
      { value: "", label: "请选择证书有效标识" },
      { value: "valid", label: "有效" },
      { value: "invalid", label: "无效" }
    ],
    secrecyOptions: [
      { value: "", label: "请选择保密属性" },
      { value: "public", label: "不涉密" },
      { value: "secret", label: "涉密" }
    ],
    childDeviceOptions: [
      { value: "", label: "请选择是否有子设备" },
      { value: "none", label: "无" },
      { value: "sub-device-01", label: "有" }
    ],
    positionTypeOptions: [
      { value: "", label: "请选择位置类型" },
      { value: "province", label: "省级" },
      { value: "city", label: "市级" },
      { value: "district", label: "区县级" }
    ],
    indoorOutdoorOptions: [
      { value: "", label: "请选择位置类型" },
      { value: "indoor", label: "室内" },
      { value: "outdoor", label: "室外" }
    ],
    usageOptions: [
      { value: "", label: "请选择用途类型" },
      { value: "security", label: "治安监控" },
      { value: "traffic", label: "交通监控" }
    ],
    lightTypeOptions: [
      { value: "", label: "请选择补光类型" },
      { value: "infrared", label: "红外补光" },
      { value: "white", label: "白光补光" }
    ],
    downloadSpeedOptions: [
      { value: "", label: "请选择下载倍速" },
      { value: "1x", label: "1x" },
      { value: "2x", label: "2x" },
      { value: "4x", label: "4x" }
    ],
    spaceEncodeOptions: [
      { value: "", label: "请选择空域编码能力" },
      { value: "h264", label: "H.264" },
      { value: "h265", label: "H.265" }
    ],
    timeEncodeOptions: [
      { value: "", label: "请选择时域编码能力" },
      { value: "25fps", label: "25fps" },
      { value: "30fps", label: "30fps" }
    ],
    watchDirectionOptions: [
      { value: "", label: "请选择监视方位" },
      { value: "east", label: "东" },
      { value: "south", label: "南" },
      { value: "west", label: "西" },
      { value: "north", label: "北" }
    ],
    deviceStatusOptions: [
      { value: "", label: "请选择设备状态" },
      { value: "online", label: "在线" },
      { value: "offline", label: "离线" }
    ],
    cameraTypeOptions: [
      { value: "", label: "请选择摄像机类型" },
      { value: "ip-camera", label: "IP Camera" },
      { value: "dome", label: "球机" },
      { value: "gun", label: "枪机" }
    ]
  };

  const CHANNEL_COLUMNS = [
    [
      { name: "name", label: "名称", type: "text", placeholder: "请输入通道名称", required: true },
      { name: "code", label: "编码", type: "input-action", placeholder: "请输入通道编码", required: true, action: "generate-code", actionLabel: "生成" },
      { name: "vendor", label: "设备厂商", type: "text", placeholder: "请输入设备厂商" },
      { name: "model", label: "设备型号", type: "text", placeholder: "请输入内容" },
      { name: "administrativeArea", label: "行政区域", type: "input-action", placeholder: "请输入行政区域", action: "pick-area", actionLabel: "选择" },
      { name: "address", label: "安装地址", type: "text", placeholder: "请输入安装地址" },
      { name: "watchDirection", label: "监视方位", type: "select", optionsKey: "watchDirectionOptions" },
      { name: "parentCode", label: "父节点编码", type: "input-action", placeholder: "请输入父节点编码或选择所属虚拟组织", action: "pick-parent", actionLabel: "选择" },
      { name: "deviceStatus", label: "设备状态", type: "select", optionsKey: "deviceStatusOptions" },
      { name: "longitude", label: "经度", type: "text", placeholder: "请输入经度" },
      { name: "latitude", label: "纬度", type: "text", placeholder: "请输入纬度" },
      { name: "cameraKind", label: "摄像机类型", type: "select", optionsKey: "cameraTypeOptions" }
    ],
    [
      { name: "businessGroupCode", label: "业务分组编号", type: "text", placeholder: "请输入业务分组编号" },
      { name: "alarmZone", label: "警区", type: "text", placeholder: "请输入入警区" },
      { name: "securityMode", label: "信令安全模式", type: "select", optionsKey: "securityModeOptions" },
      { name: "registerMode", label: "注册方式", type: "select", optionsKey: "registerModeOptions" },
      { name: "certSerial", label: "证书序列号", type: "text", placeholder: "请输入证书序列号" },
      { name: "certValidFlag", label: "证书有效标识", type: "select", optionsKey: "validFlagOptions" },
      { name: "invalidReasonCode", label: "无效原因码", type: "text", placeholder: "请输入无效原因码" },
      { name: "certExpireAt", label: "证书终止有效期", type: "date", placeholder: "选择日期时间" },
      { name: "secrecy", label: "保密属性", type: "select", optionsKey: "secrecyOptions" },
      { name: "ip", label: "IP地址", type: "text", placeholder: "请输入IP地址" },
      { name: "port", label: "端口", type: "text", placeholder: "请输入端口" },
      { name: "password", label: "设备口令", type: "text", placeholder: "请输入设备口令" }
    ],
    [
      { name: "owner", label: "设备归属", type: "text", placeholder: "请输入设备归属" },
      { name: "childDevice", label: "子设备", type: "select", optionsKey: "childDeviceOptions" },
      { name: "positionType", label: "位置类型", type: "select", optionsKey: "positionTypeOptions" },
      { name: "indoorOutdoor", label: "室外/室内", type: "select", optionsKey: "indoorOutdoorOptions" },
      { name: "usageType", label: "用途", type: "select", optionsKey: "usageOptions" },
      { name: "lightType", label: "补光", type: "select", optionsKey: "lightTypeOptions" },
      { name: "resolution", label: "分辨率", type: "text", placeholder: "请输入分辨率" },
      { name: "downloadSpeed", label: "下载倍速", type: "select", optionsKey: "downloadSpeedOptions" },
      { name: "spaceEncode", label: "空域编码能力", type: "select", optionsKey: "spaceEncodeOptions" },
      { name: "timeEncode", label: "时域编码能力", type: "select", optionsKey: "timeEncodeOptions" },
      { name: "voiceTalk", label: "", type: "checkbox-single", checkboxLabel: "语音对讲(非标属性)" }
    ]
  ];

  const PROXY_FIELD_NAMES = [
    "type",
    "appName",
    "streamId",
    "streamUrl",
    "timeoutSeconds",
    "nodeKey",
    "pullProtocol",
    "noViewerAction",
    "enabled",
    "audioEnabled",
    "recording"
  ];

  const EDIT_STREAM_PROXY_TABS = [
    { key: "proxy-info", label: "拉流代理信息" },
    { key: "gb-channel", label: "国标通道配置" }
  ];

  const CREATE_STREAM_PROXY_TABS = [
    { key: "proxy-info", label: "拉流代理信息" }
  ];

  registerPage({
    key: "stream-proxy-edit",
    heading: "编辑拉流代理信息",
    subtitle: "维护拉流代理基础参数与国标通道配置。",
    title: "编辑拉流代理信息",
    mode: "edit",
    saveText: "保存",
    saveToastTitle: "保存成功",
    saveToastMessage: "已更新拉流代理信息。"
  });

  registerPage({
    key: "stream-proxy-create",
    heading: "新增代理拉流",
    subtitle: "新增拉流代理基础信息。",
    title: "新增代理拉流",
    mode: "create",
    saveText: "创建",
    saveToastTitle: "新增成功",
    saveToastMessage: "已新增拉流代理。"
  });

  function registerPage(meta) {
    window.registerPrototypePage({
      key: meta.key,
      kind: "dashboard",
      styleSource: meta.mode === "create" ? "resources/css/pages/stream-proxy-create.css" : "resources/css/pages/stream-proxy-edit.css",
      heading: meta.heading,
      subtitle: meta.subtitle,
      breadcrumbTrail: ["接入管理", "接入源管理"],
      streamProxyEditPage: {
        mode: meta.mode,
        title: meta.title,
        saveText: meta.saveText,
        saveToastTitle: meta.saveToastTitle,
        saveToastMessage: meta.saveToastMessage,
        backRoute: "access-source",
        tabs: meta.mode === "create" ? CREATE_STREAM_PROXY_TABS : EDIT_STREAM_PROXY_TABS,
        proxyInfoDefaults: createProxyInfoDefaults(meta.mode),
        proxyInfoOptions: PROXY_INFO_OPTIONS,
        channelDefaults: createChannelDefaults(),
        channelOptions: CHANNEL_OPTIONS,
        channelColumns: CHANNEL_COLUMNS
      },
      renderDashboardPage: function (context) {
        return renderPage(context.page);
      },
      setup: function (runtime) {
        return bindPage(runtime);
      }
    });
  }

  function renderPage(page) {
    const utils = window.PROTOTYPE_UTILS;
    const view = page.streamProxyEditPage || {};
    const tabs = normalizeStreamProxyTabs(view.tabs, view.mode);
    const hasGbChannelTab = tabs.some(function (tab) {
      return tab.key === "gb-channel";
    });

    return (
      '<section class="panel stream-proxy-edit-page">' +
      '<div class="stream-proxy-edit-topbar">' +
      '<button class="stream-proxy-edit-back" type="button" data-route="' + utils.escapeAttribute(view.backRoute || "access-source") + '" data-stream-proxy-edit-back="true">' +
      '<span class="stream-proxy-edit-back-icon">←</span>返回' +
      "</button>" +
      '<span class="stream-proxy-edit-divider"></span>' +
      '<h2 class="stream-proxy-edit-title">' + utils.escapeHtml(view.title || page.heading || "") + "</h2>" +
      "</div>" +
      '<div class="stream-proxy-edit-tabs">' +
      renderTabs(tabs) +
      "</div>" +
      '<div class="stream-proxy-edit-panels">' +
      '<section class="stream-proxy-edit-panel active" data-stream-proxy-edit-panel="proxy-info">' +
      renderProxyInfoPanel(view) +
      "</section>" +
      (hasGbChannelTab
        ? '<section class="stream-proxy-edit-panel" data-stream-proxy-edit-panel="gb-channel">' +
          renderGbChannelPanel(view) +
          "</section>"
        : "") +
      "</div>" +
      '<div class="stream-proxy-edit-actions">' +
      '<button id="stream-proxy-edit-save" class="button stream-proxy-edit-save" type="button">' + utils.escapeHtml(view.saveText || "保存") + "</button>" +
      '<button class="button-secondary stream-proxy-edit-cancel" type="button" data-route="' + utils.escapeAttribute(view.backRoute || "access-source") + '" data-stream-proxy-edit-cancel="true">取消</button>' +
      "</div>" +
      "</section>"
    );
  }

  function renderTabs(tabs) {
    const utils = window.PROTOTYPE_UTILS;
    return (tabs || []).map(function (tab, index) {
      return (
        '<button class="stream-proxy-edit-tab' + (index === 0 ? " active" : "") +
        '" type="button" data-stream-proxy-edit-tab="' + utils.escapeAttribute(tab.key) + '">' +
        utils.escapeHtml(tab.label) +
        "</button>"
      );
    }).join("");
  }

  function renderProxyInfoPanel(view) {
    const defaults = view.proxyInfoDefaults || {};
    const options = view.proxyInfoOptions || {};

    return (
      '<div class="stream-proxy-edit-proxy-form">' +
      renderProxyFormRow("类型", renderSelect("type", options.typeOptions, defaults.type), false) +
      renderProxyFormRow("应用名", renderInput("appName", defaults.appName, "请输入应用名"), true) +
      renderProxyFormRow("流ID", renderInput("streamId", defaults.streamId, "请输入流ID"), true) +
      renderProxyFormRow("拉流地址", renderInput("streamUrl", defaults.streamUrl, "请输入拉流地址"), false) +
      renderProxyFormRow("超时时间(秒)", renderInput("timeoutSeconds", defaults.timeoutSeconds, "请输入超时时间"), false) +
      renderProxyFormRow("节点选择", renderSelect("nodeKey", options.nodeOptions, defaults.nodeKey), false) +
      renderProxyFormRow("拉流方式(RTSP)", renderSelect("pullProtocol", options.protocolOptions, defaults.pullProtocol), false) +
      renderProxyFormRow("无人观看", renderRadioGroup("noViewerAction", options.noViewerOptions, defaults.noViewerAction), false) +
      renderProxyFormRow("其他选项", renderProxyFlags(defaults), false) +
      "</div>"
    );
  }

  function renderProxyFormRow(label, control, required) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="stream-proxy-edit-proxy-row">' +
      '<label class="stream-proxy-edit-proxy-label">' +
      (required ? '<span class="stream-proxy-edit-required">*</span>' : "") +
      utils.escapeHtml(label) +
      "</label>" +
      '<div class="stream-proxy-edit-proxy-value">' + control + "</div>" +
      "</div>"
    );
  }

  function renderProxyFlags(defaults) {
    return (
      '<div class="stream-proxy-edit-check-group">' +
      renderCheckbox("enabled", "启用", defaults.enabled) +
      renderCheckbox("audioEnabled", "开启音频", defaults.audioEnabled) +
      renderCheckbox("recording", "录制", defaults.recording) +
      "</div>"
    );
  }

  function renderRadioGroup(name, options, selectedValue) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="stream-proxy-edit-radio-group">' +
      (options || []).map(function (option) {
        return (
          '<label class="stream-proxy-edit-radio-item">' +
          '<input type="radio" name="' + utils.escapeAttribute(name) + '" value="' + utils.escapeAttribute(option.value) + '"' + (selectedValue === option.value ? ' checked="checked"' : "") + " />" +
          '<span>' + utils.escapeHtml(option.label) + "</span>" +
          "</label>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderGbChannelPanel(view) {
    const columns = view.channelColumns || [];
    return (
      '<form class="stream-proxy-edit-channel-layout">' +
      '<div class="stream-proxy-edit-channel-columns">' +
      columns.map(function (column) {
        return renderChannelColumn(column, view);
      }).join("") +
      "</div>" +
      "</form>"
    );
  }

  function renderChannelColumn(fields, view) {
    return (
      '<div class="stream-proxy-edit-channel-column">' +
      (fields || []).map(function (field) {
        return renderChannelField(field, view);
      }).join("") +
      "</div>"
    );
  }

  function renderChannelField(field, view) {
    const utils = window.PROTOTYPE_UTILS;
    const defaults = view.channelDefaults || {};
    const options = view.channelOptions || {};
    const value = defaults[field.name];
    let control = "";

    if (field.type === "text") {
      control = renderInput(field.name, value, field.placeholder);
    } else if (field.type === "select") {
      control = renderSelect(field.name, options[field.optionsKey], value);
    } else if (field.type === "input-action") {
      control = renderInputAction(field, value);
    } else if (field.type === "date") {
      control = renderDateInput(field.name, value, field.placeholder);
    } else if (field.type === "checkbox-single") {
      control = renderSingleCheckbox(field.name, field.checkboxLabel, value);
    }

    return (
      '<div class="stream-proxy-edit-channel-row' + (field.type === "checkbox-single" ? " is-checkbox" : "") + '">' +
      '<label class="stream-proxy-edit-channel-label">' +
      (field.required ? '<span class="stream-proxy-edit-required">*</span>' : "") +
      utils.escapeHtml(field.label || "") +
      "</label>" +
      '<div class="stream-proxy-edit-channel-value">' + control + "</div>" +
      "</div>"
    );
  }

  function renderInput(name, value, placeholder) {
    const utils = window.PROTOTYPE_UTILS;
    return '<input class="stream-proxy-edit-control" name="' + utils.escapeAttribute(name) + '" type="text" value="' + utils.escapeAttribute(value || "") + '" placeholder="' + utils.escapeAttribute(placeholder || "") + '" />';
  }

  function renderSelect(name, options, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<select class="stream-proxy-edit-control stream-proxy-edit-select" name="' + utils.escapeAttribute(name) + '">' +
      (options || []).map(function (option) {
        const selected = option.value === value ? ' selected="selected"' : "";
        return '<option value="' + utils.escapeAttribute(option.value) + '"' + selected + ">" + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderCheckbox(name, label, checked) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<label class="stream-proxy-edit-check-item">' +
      '<input type="checkbox" name="' + utils.escapeAttribute(name) + '"' + (checked ? ' checked="checked"' : "") + " />" +
      '<span>' + utils.escapeHtml(label) + "</span>" +
      "</label>"
    );
  }

  function renderInputAction(field, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="stream-proxy-edit-input-action">' +
      renderInput(field.name, value, field.placeholder) +
      '<button class="stream-proxy-edit-inline-button" type="button" data-stream-proxy-edit-action="' + utils.escapeAttribute(field.action || "") + '">' + utils.escapeHtml(field.actionLabel || "操作") + "</button>" +
      "</div>"
    );
  }

  function renderDateInput(name, value, placeholder) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="stream-proxy-edit-date">' +
      '<span class="stream-proxy-edit-date-icon">◔</span>' +
      '<input class="stream-proxy-edit-control stream-proxy-edit-date-input" name="' + utils.escapeAttribute(name) + '" type="text" value="' + utils.escapeAttribute(value || "") + '" placeholder="' + utils.escapeAttribute(placeholder || "") + '" />' +
      "</div>"
    );
  }

  function renderSingleCheckbox(name, label, checked) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<label class="stream-proxy-edit-single-check">' +
      '<input type="checkbox" name="' + utils.escapeAttribute(name) + '"' + (checked ? ' checked="checked"' : "") + " />" +
      '<span>' + utils.escapeHtml(label || "") + "</span>" +
      "</label>"
    );
  }

  function bindPage(runtime) {
    const page = runtime && runtime.page;
    const root = runtime && runtime.mountNode;
    const mockStore = runtime && runtime.mockStore;
    const showToast = runtime && runtime.showToast;
    const navigateToRoute = runtime && runtime.navigateToRoute;
    const view = page && page.streamProxyEditPage ? page.streamProxyEditPage : {};
    const tabsConfig = normalizeStreamProxyTabs(view.tabs, view.mode);
    const tabs = root ? root.querySelectorAll("[data-stream-proxy-edit-tab]") : [];
    const panels = root ? root.querySelectorAll("[data-stream-proxy-edit-panel]") : [];
    const saveButton = root ? root.querySelector("#stream-proxy-edit-save") : null;
    const mode = view.mode === "create" ? "create" : "edit";
    let activeTab = (tabsConfig[0] && tabsConfig[0].key) || "proxy-info";
    let currentEditingId = "";

    if (!page || !root) {
      return null;
    }

    initializeForm();

    function initializeForm() {
      if (mode === "create") {
        setFormValues(root, createFormStateFromDefaults(view));
        return;
      }

      const listPage = getAccessSourcePage();
      const sourcePage = listPage.accessSourcePage || {};
      const rows = Array.isArray(sourcePage.rows) ? sourcePage.rows : [];
      const activeProxyId = sourcePage.activeProxyId || "";
      const row = rows.find(function (item) {
        return item.id === activeProxyId && isStreamProxyRow(item);
      });

      if (!row) {
        if (typeof showToast === "function") {
          showToast("未找到代理", "请从拉流代理列表选择要编辑的记录。");
        }
        setFormValues(root, createFormStateFromDefaults(view));
        return;
      }

      currentEditingId = row.id;
      setFormValues(root, createFormStateFromRow(view, row));
    }

    function syncTabs() {
      tabs.forEach(function (tabNode) {
        const tabKey = tabNode.getAttribute("data-stream-proxy-edit-tab") || "";
        tabNode.classList.toggle("active", tabKey === activeTab);
      });

      panels.forEach(function (panelNode) {
        const panelKey = panelNode.getAttribute("data-stream-proxy-edit-panel") || "";
        panelNode.classList.toggle("active", panelKey === activeTab);
      });
    }

    function handleClick(event) {
      const backOrCancelTrigger = event.target.closest("[data-stream-proxy-edit-back],[data-stream-proxy-edit-cancel]");
      if (backOrCancelTrigger && mode === "create") {
        event.preventDefault();
        event.stopPropagation();
        navigateBackForCreate();
        return;
      }

      const tabNode = event.target.closest("[data-stream-proxy-edit-tab]");
      if (tabNode) {
        activeTab = tabNode.getAttribute("data-stream-proxy-edit-tab") || "proxy-info";
        syncTabs();
        return;
      }

      const inlineAction = event.target.closest("[data-stream-proxy-edit-action]");
      if (inlineAction && typeof showToast === "function") {
        const action = inlineAction.getAttribute("data-stream-proxy-edit-action") || "";

        if (action === "generate-code") {
          showToast("生成编码", "当前原型预留通道编码自动生成流程。");
          return;
        }

        if (action === "pick-area") {
          showToast("选择行政区域", "当前原型预留行政区域选择流程。");
          return;
        }

        if (action === "pick-parent") {
          showToast("选择父节点", "当前原型预留父节点或虚拟组织选择流程。");
        }
      }
    }

    function navigateBackForCreate() {
      if (typeof navigateToRoute === "function") {
        navigateToRoute(view.backRoute || "access-source");
        return;
      }

      if (window.history.length > 1) {
        window.history.back();
      }
    }

    function handleSave() {
      if (!mockStore || typeof mockStore.getPage !== "function" || typeof mockStore.patchPage !== "function") {
        if (typeof showToast === "function") {
          showToast("保存失败", "当前环境不支持保存。");
        }
        return;
      }

      const formState = collectFormValues(root, view);
      if (!formState.proxyInfo.appName || !formState.proxyInfo.streamId) {
        if (typeof showToast === "function") {
          showToast("信息不完整", "请至少填写应用名和流ID。");
        }
        return;
      }

      const listPage = getAccessSourcePage();
      const sourcePage = listPage.accessSourcePage || {};
      const rows = Array.isArray(sourcePage.rows) ? sourcePage.rows.slice() : [];
      let targetId = currentEditingId || sourcePage.activeProxyId || "";
      let nextRow = null;

      if (mode === "edit") {
        const rowIndex = rows.findIndex(function (item) {
          return item.id === targetId && isStreamProxyRow(item);
        });

        if (rowIndex < 0) {
          if (typeof showToast === "function") {
            showToast("保存失败", "未找到要更新的拉流代理。");
          }
          return;
        }

        nextRow = buildRow(rows[rowIndex], formState.proxyInfo, formState.channelInfo, view);
        rows[rowIndex] = nextRow;
      } else {
        nextRow = buildRow(null, formState.proxyInfo, formState.channelInfo, view);
        rows.unshift(nextRow);
        targetId = nextRow.id;
      }

      currentEditingId = targetId;
      mockStore.patchPage("access-source", {
        accessSourcePage: {
          rows: rows,
          activeProxyId: targetId
        }
      });

      if (typeof showToast === "function") {
        showToast(view.saveToastTitle || "保存成功", view.saveToastMessage || "已保存拉流代理信息。");
      }

      if (typeof navigateToRoute === "function") {
        navigateToRoute(view.backRoute || "access-source");
      }
    }

    function getAccessSourcePage() {
      const storedPage = mockStore && typeof mockStore.getPage === "function"
        ? mockStore.getPage("access-source")
        : null;
      return storedPage || {};
    }

    root.addEventListener("click", handleClick);

    if (saveButton) {
      saveButton.addEventListener("click", handleSave);
    }

    syncTabs();

    return function () {
      root.removeEventListener("click", handleClick);
      if (saveButton) {
        saveButton.removeEventListener("click", handleSave);
      }
    };
  }

  function createProxyInfoDefaults(mode) {
    if (mode === "create") {
      return {
        type: "default",
        appName: "",
        streamId: "",
        streamUrl: "",
        timeoutSeconds: "10",
        nodeKey: "",
        pullProtocol: "tcp",
        noViewerAction: "none",
        enabled: true,
        audioEnabled: true,
        recording: false
      };
    }

    return {
      type: "default",
      appName: "",
      streamId: "",
      streamUrl: "",
      timeoutSeconds: "10",
      nodeKey: "",
      pullProtocol: "tcp",
      noViewerAction: "pause",
      enabled: true,
      audioEnabled: true,
      recording: false
    };
  }

  function createChannelDefaults() {
    return {
      name: "",
      code: "",
      vendor: "",
      model: "",
      administrativeArea: "",
      address: "",
      watchDirection: "",
      parentCode: "",
      deviceStatus: "",
      longitude: "",
      latitude: "",
      cameraKind: "",
      businessGroupCode: "",
      alarmZone: "",
      securityMode: "",
      registerMode: "",
      certSerial: "",
      certValidFlag: "",
      invalidReasonCode: "",
      certExpireAt: "",
      secrecy: "",
      ip: "",
      port: "",
      password: "",
      owner: "",
      childDevice: "",
      positionType: "",
      indoorOutdoor: "",
      usageType: "",
      lightType: "",
      resolution: "",
      downloadSpeed: "",
      spaceEncode: "",
      timeEncode: "",
      voiceTalk: false
    };
  }

  function createFormStateFromDefaults(view) {
    return {
      proxyInfo: Object.assign({}, view.proxyInfoDefaults || {}),
      channelInfo: Object.assign({}, view.channelDefaults || {})
    };
  }

  function createFormStateFromRow(view, row) {
    const defaults = createFormStateFromDefaults(view);
    const proxyConfig = row && row.proxyConfig ? row.proxyConfig : {};
    const channelConfig = row && row.channelConfig ? row.channelConfig : {};

    defaults.proxyInfo = Object.assign({}, defaults.proxyInfo, proxyConfig, {
      type: proxyConfig.type || mapProxyModeToType(row.proxyMode),
      appName: row.appName || defaults.proxyInfo.appName,
      streamId: row.streamId || defaults.proxyInfo.streamId,
      streamUrl: row.streamUrl || defaults.proxyInfo.streamUrl,
      enabled: proxyConfig.enabled === undefined ? row.enabled !== "disabled" : !!proxyConfig.enabled
    });

    defaults.channelInfo = Object.assign({}, defaults.channelInfo, channelConfig, {
      name: channelConfig.name || row.appName || "",
      code: channelConfig.code || row.gbCode || ""
    });

    return defaults;
  }

  function collectFormValues(root, view) {
    const channelFieldNames = getChannelFieldNames(view.channelColumns || []);
    const proxyInfo = {};
    const channelInfo = {};

    PROXY_FIELD_NAMES.forEach(function (name) {
      proxyInfo[name] = readFieldValue(root, name);
    });

    channelFieldNames.forEach(function (name) {
      channelInfo[name] = readFieldValue(root, name);
    });

    return {
      proxyInfo: proxyInfo,
      channelInfo: channelInfo
    };
  }

  function setFormValues(root, state) {
    if (!state) {
      return;
    }

    setFields(root, state.proxyInfo || {});
    setFields(root, state.channelInfo || {});
  }

  function setFields(root, values) {
    Object.keys(values).forEach(function (name) {
      setFieldValue(root, name, values[name]);
    });
  }

  function readFieldValue(root, name) {
    if (!root || !name) {
      return "";
    }

    const radioNodes = root.querySelectorAll('input[type="radio"][name="' + name + '"]');
    if (radioNodes.length) {
      const checkedRadio = Array.prototype.find.call(radioNodes, function (node) {
        return node.checked;
      });
      return checkedRadio ? checkedRadio.value : "";
    }

    const checkboxNode = root.querySelector('input[type="checkbox"][name="' + name + '"]');
    if (checkboxNode) {
      return !!checkboxNode.checked;
    }

    const controlNode = root.querySelector('[name="' + name + '"]');
    if (!controlNode) {
      return "";
    }

    return String(controlNode.value || "").trim();
  }

  function setFieldValue(root, name, value) {
    const scope = root || document;
    const radioNodes = scope.querySelectorAll('input[type="radio"][name="' + name + '"]');
    if (radioNodes.length) {
      Array.prototype.forEach.call(radioNodes, function (node) {
        node.checked = node.value === String(value || "");
      });
      return;
    }

    const checkboxNode = scope.querySelector('input[type="checkbox"][name="' + name + '"]');
    if (checkboxNode) {
      checkboxNode.checked = !!value;
      return;
    }

    const controlNode = scope.querySelector('[name="' + name + '"]');
    if (controlNode) {
      controlNode.value = value == null ? "" : String(value);
    }
  }

  function buildRow(existingRow, proxyInfo, channelInfo, view) {
    const sourceRow = existingRow || {};
    const typeOptions = view && view.proxyInfoOptions ? view.proxyInfoOptions.typeOptions : PROXY_INFO_OPTIONS.typeOptions;
    const enabled = !!proxyInfo.enabled;

    return {
      id: sourceRow.id || createProxyId(),
      sourceType: "stream_proxy",
      sourceTypeLabel: "\u62c9\u6d41\u8bbe\u5907",
      name: proxyInfo.appName || sourceRow.name || proxyInfo.streamId || "",
      appName: proxyInfo.appName,
      streamId: proxyInfo.streamId,
      sourceCode: proxyInfo.streamId,
      streamUrl: proxyInfo.streamUrl,
      endpoint: proxyInfo.streamUrl,
      mediaServer: sourceRow.mediaServer || "zlmediakit-local",
      proxyMode: getOptionLabel(typeOptions, proxyInfo.type, "默认"),
      gbCode: channelInfo.code || sourceRow.gbCode || "",
      pullStatus: sourceRow.pullStatus || "idle",
      runtimeStatus: sourceRow.runtimeStatus || sourceRow.pullStatus || "idle",
      runtimeStatusLabel: sourceRow.runtimeStatusLabel || sourceRow.pullStatusLabel || "\u6682\u672a\u62c9\u6d41",
      pullStatusLabel: sourceRow.pullStatusLabel || "暂未拉流",
      enabled: enabled ? "enabled" : "disabled",
      enabledLabel: enabled ? "已启用" : "已停用",
      createdAt: sourceRow.createdAt || formatDateTime(new Date()),
      proxyConfig: Object.assign({}, sourceRow.proxyConfig || {}, proxyInfo),
      channelConfig: Object.assign({}, sourceRow.channelConfig || {}, channelInfo)
    };
  }

  function createProxyId() {
    return "proxy-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
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

  function mapProxyModeToType(proxyModeLabel) {
    if (proxyModeLabel === "按需") {
      return "on-demand";
    }
    return "default";
  }

  function getOptionLabel(options, value, fallbackLabel) {
    const matchedOption = (options || []).find(function (item) {
      return item.value === value;
    });
    return matchedOption ? matchedOption.label : fallbackLabel;
  }

  function getChannelFieldNames(columns) {
    const names = [];
    (columns || []).forEach(function (column) {
      (column || []).forEach(function (field) {
        if (field && field.name) {
          names.push(field.name);
        }
      });
    });
    return names;
  }

  function formatDateTime(date) {
    const current = date || new Date();
    const year = current.getFullYear();
    const month = pad2(current.getMonth() + 1);
    const day = pad2(current.getDate());
    const hour = pad2(current.getHours());
    const minute = pad2(current.getMinutes());
    const second = pad2(current.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }

  function pad2(num) {
    return String(num).padStart(2, "0");
  }

  function normalizeStreamProxyTabs(tabs, mode) {
    const defaults = mode === "create" ? CREATE_STREAM_PROXY_TABS : EDIT_STREAM_PROXY_TABS;
    const tabMap = {};
    (tabs || []).forEach(function (tab) {
      if (tab && tab.key) {
        tabMap[tab.key] = tab;
      }
    });

    return defaults.map(function (defaultTab) {
      const tab = tabMap[defaultTab.key] || {};
      return {
        key: defaultTab.key,
        label: tab.label || defaultTab.label
      };
    });
  }
})();
