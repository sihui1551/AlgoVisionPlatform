(function () {
  const SHARED_OPTIONS = {
    securityModeOptions: [
      { value: "not-used", label: "不采用" },
      { value: "s-mime", label: "S/MIME" },
      { value: "https", label: "HTTPS" }
    ],
    registerModeOptions: [
      { value: "ietf-rfc3261", label: "IETFRFC3261标准" },
      { value: "custom", label: "自定义" }
    ],
    validFlagOptions: [
      { value: "", label: "请选择证书有效标识" },
      { value: "valid", label: "有效" },
      { value: "invalid", label: "无效" }
    ],
    secrecyOptions: [
      { value: "public", label: "不涉密" },
      { value: "secret", label: "涉密" }
    ],
    childDeviceOptions: [
      { value: "none", label: "无" },
      { value: "sub-device-01", label: "子设备 01" }
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

  const FORM_COLUMNS = [
    [
      { name: "name", label: "名称", type: "text", placeholder: "请输入名称", required: true },
      { name: "code", label: "编码", type: "input-action", placeholder: "请输入编码", required: true, action: "generate-code", actionLabel: "生成" },
      { name: "vendor", label: "设备厂商", type: "text", placeholder: "请输入设备厂商" },
      { name: "model", label: "设备型号", type: "text", placeholder: "请输入设备型号" },
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
      { name: "alarmZone", label: "警区", type: "text", placeholder: "请输入警区" },
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

  window.registerPrototypePage({
    key: "gb-channel-edit",
    kind: "dashboard",
    styleSource: "resources/css/pages/gb-channel-form.css",
    heading: "编辑通道",
    subtitle: "维护通道基础信息、注册属性和扩展能力配置。",
    breadcrumbTrail: ["接入管理", "国标设备", "通道列表"],
    gbChannelFormPage: {
      title: "编辑通道",
      backRoute: "gb-channel-list",
      submitToastTitle: "编辑通道",
      submitToastMessage: "已完成通道编辑表单演示。",
      resetToastTitle: "重置表单",
      resetToastMessage: "当前原型已恢复通道编辑表单默认值。",
      defaults: {
        name: "Camera 01",
        code: "44130300001320000017",
        vendor: "Hikvision",
        model: "IP Camera",
        administrativeArea: "",
        address: "Address",
        watchDirection: "",
        parentCode: "",
        deviceStatus: "online",
        longitude: "0",
        latitude: "0",
        cameraKind: "",
        businessGroupCode: "",
        alarmZone: "",
        securityMode: "not-used",
        registerMode: "ietf-rfc3261",
        certSerial: "",
        certValidFlag: "",
        invalidReasonCode: "",
        certExpireAt: "",
        secrecy: "public",
        ip: "",
        port: "",
        password: "",
        owner: "Owner",
        childDevice: "none",
        positionType: "",
        indoorOutdoor: "",
        usageType: "",
        lightType: "",
        resolution: "",
        downloadSpeed: "",
        spaceEncode: "",
        timeEncode: "",
        voiceTalk: false
      },
      options: SHARED_OPTIONS,
      columns: FORM_COLUMNS
    },
    renderDashboardPage: function (context) {
      return renderFormPage(context.page);
    },
    setup: function (runtime) {
      return bindFormPage(runtime);
    }
  });

  function renderFormPage(page) {
    const utils = window.PROTOTYPE_UTILS;
    const formPage = page.gbChannelFormPage || {};

    return (
      '<section class="panel gb-channel-form-page">' +
      '<div class="gb-channel-form-topbar">' +
      '<button class="gb-channel-form-back" type="button" data-route="' + utils.escapeAttribute(formPage.backRoute || "gb-channel-list") + '">' +
      '<span class="gb-channel-form-back-icon">←</span>返回' +
      "</button>" +
      '<span class="gb-channel-form-divider"></span>' +
      '<h2 class="gb-channel-form-title">' + utils.escapeHtml(formPage.title || page.heading || "") + "</h2>" +
      "</div>" +
      '<form id="gb-channel-edit-form" class="gb-channel-form-layout">' +
      '<div class="gb-channel-form-columns">' +
      (formPage.columns || []).map(function (column) {
        return renderColumn(column, formPage);
      }).join("") +
      "</div>" +
      '<div class="gb-channel-form-actions">' +
      '<button id="gb-channel-form-save" class="button gb-channel-form-save" type="button">保存</button>' +
      '<button class="button-secondary gb-channel-form-cancel" type="button" data-route="' + utils.escapeAttribute(formPage.backRoute || "gb-channel-list") + '">取消</button>' +
      '<button id="gb-channel-form-reset" class="button-secondary gb-channel-form-reset" type="button">重置</button>' +
      "</div>" +
      "</form>" +
      "</section>"
    );
  }

  function renderColumn(fields, formPage) {
    return (
      '<div class="gb-channel-form-column">' +
      (fields || []).map(function (field) {
        return renderField(field, formPage);
      }).join("") +
      "</div>"
    );
  }

  function renderField(field, formPage) {
    const utils = window.PROTOTYPE_UTILS;
    const defaults = formPage.defaults || {};
    const options = formPage.options || {};
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
      '<div class="gb-channel-form-row' + (field.type === "checkbox-single" ? " is-checkbox" : "") + '">' +
      '<label class="gb-channel-form-label">' +
      (field.required ? '<span class="gb-channel-form-required">*</span>' : "") +
      utils.escapeHtml(field.label || "") +
      "</label>" +
      '<div class="gb-channel-form-value">' + control + "</div>" +
      "</div>"
    );
  }

  function renderInput(name, value, placeholder) {
    const utils = window.PROTOTYPE_UTILS;
    return '<input class="gb-channel-form-control" name="' + utils.escapeAttribute(name) + '" type="text" value="' + utils.escapeAttribute(value || "") + '" placeholder="' + utils.escapeAttribute(placeholder || "") + '" />';
  }

  function renderSelect(name, options, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<select class="gb-channel-form-control gb-channel-form-select" name="' + utils.escapeAttribute(name) + '">' +
      (options || []).map(function (option) {
        const selected = option.value === value ? ' selected="selected"' : "";
        return '<option value="' + utils.escapeAttribute(option.value) + '"' + selected + ">" + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderInputAction(field, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="gb-channel-form-input-action">' +
      renderInput(field.name, value, field.placeholder) +
      '<button class="gb-channel-form-inline-button" type="button" data-channel-form-action="' + utils.escapeAttribute(field.action || "") + '">' + utils.escapeHtml(field.actionLabel || "操作") + "</button>" +
      "</div>"
    );
  }

  function renderDateInput(name, value, placeholder) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="gb-channel-form-date">' +
      '<span class="gb-channel-form-date-icon">◔</span>' +
      '<input class="gb-channel-form-control gb-channel-form-date-input" name="' + utils.escapeAttribute(name) + '" type="text" value="' + utils.escapeAttribute(value || "") + '" placeholder="' + utils.escapeAttribute(placeholder || "") + '" />' +
      "</div>"
    );
  }

  function renderSingleCheckbox(name, label, checked) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<label class="gb-channel-form-single-check">' +
      '<input type="checkbox" name="' + utils.escapeAttribute(name) + '"' + (checked ? ' checked="checked"' : "") + " />" +
      '<span>' + utils.escapeHtml(label || "") + "</span>" +
      "</label>"
    );
  }

  function bindFormPage(runtime) {
    const page = runtime && runtime.page;
    const showToast = runtime && runtime.showToast;
    const navigateToRoute = runtime && runtime.navigateToRoute;
    const root = runtime && runtime.mountNode;
    const form = document.getElementById("gb-channel-edit-form");
    const saveButton = document.getElementById("gb-channel-form-save");
    const resetButton = document.getElementById("gb-channel-form-reset");
    const formPage = page && page.gbChannelFormPage ? page.gbChannelFormPage : {};
    let submitTimer = 0;

    if (!page || !form || !saveButton || !resetButton || !root) {
      return null;
    }

    function handleSave() {
      if (typeof showToast === "function") {
        showToast(formPage.submitToastTitle || page.heading, formPage.submitToastMessage || "当前原型仅演示通道编辑流程。");
      }
      submitTimer = window.setTimeout(function () {
        if (typeof navigateToRoute === "function") {
          navigateToRoute(formPage.backRoute || "gb-channel-list");
        }
      }, 240);
    }

    function handleReset() {
      form.reset();
      if (typeof showToast === "function") {
        showToast(formPage.resetToastTitle || "重置表单", formPage.resetToastMessage || "当前原型已恢复默认值。");
      }
    }

    function handleClick(event) {
      const trigger = event.target.closest("[data-channel-form-action]");
      if (!trigger) {
        return;
      }

      const action = trigger.getAttribute("data-channel-form-action");
      if (typeof showToast !== "function") {
        return;
      }

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

    saveButton.addEventListener("click", handleSave);
    resetButton.addEventListener("click", handleReset);
    root.addEventListener("click", handleClick);

    return function () {
      if (submitTimer) {
        window.clearTimeout(submitTimer);
      }
      saveButton.removeEventListener("click", handleSave);
      resetButton.removeEventListener("click", handleReset);
      root.removeEventListener("click", handleClick);
    };
  }
})();
