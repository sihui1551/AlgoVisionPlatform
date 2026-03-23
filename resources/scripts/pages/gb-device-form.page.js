(function () {
  const SHARED_OPTIONS = {
    mediaServerOptions: [
      { value: "", label: "请选择" },
      { value: "server-001", label: "流媒体服务01" },
      { value: "server-002", label: "流媒体服务02" }
    ],
    charsetOptions: [
      { value: "", label: "请选择" },
      { value: "gb2312", label: "GB2312" },
      { value: "utf-8", label: "UTF-8" }
    ],
    coordinateOptions: [
      { value: "", label: "请选择" },
      { value: "wgs84", label: "WGS-84" },
      { value: "gcj02", label: "GCJ-02" }
    ]
  };

  registerPage({
    key: "gb-device-create",
    heading: "新增设备",
    panelTitle: "新增设备",
    submitToastTitle: "新增设备",
    submitToastMessage: "已完成新增设备表单演示。",
    defaults: {
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
    }
  });

  registerPage({
    key: "gb-device-edit",
    heading: "设备编辑",
    panelTitle: "设备编辑",
    submitToastTitle: "设备编辑",
    submitToastMessage: "已完成设备编辑表单演示。",
    defaults: {
      deviceId: "44130300001320000017",
      deviceName: "IP CAMERA",
      password: "123456",
      receiveIp: "172.23.3.181",
      mediaServerId: "server-001",
      charset: "gb2312",
      coordinateSystem: "wgs84",
      checkSsrc: false,
      asMessageChannel: true,
      sendStreamAfterAck: false
    }
  });

  function registerPage(config) {
    window.registerPrototypePage({
      key: config.key,
      kind: "dashboard",
      styleSource: "resources/css/pages/gb-device-form.css",
      heading: config.heading,
      subtitle: "配置国标设备的接入参数、编码与附加选项。",
      breadcrumbTrail: ["接入管理", "国标设备"],
      gbDeviceFormPage: {
        panelTitle: config.panelTitle,
        submitToastTitle: config.submitToastTitle,
        submitToastMessage: config.submitToastMessage,
        defaults: config.defaults,
        options: SHARED_OPTIONS
      },
      renderDashboardPage: function (context) {
        return renderFormPage(context.page);
      },
      setup: function (runtime) {
        return bindFormPage(runtime);
      }
    });
  }

  function renderFormPage(page) {
    const utils = window.PROTOTYPE_UTILS;
    const formPage = page.gbDeviceFormPage || {};
    const defaults = formPage.defaults || {};
    const options = formPage.options || {};

    return (
      '<section class="panel gb-device-form-page">' +
      '<div class="gb-device-form-header">' +
      '<h2 class="gb-device-form-title">' + utils.escapeHtml(formPage.panelTitle || page.heading || "") + "</h2>" +
      '<button class="gb-device-form-close" type="button" data-route="gb-device" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="gb-device-form-body">' +
      renderFormRow("设备编号", renderInput("deviceId", defaults.deviceId, "请输入设备编号"), true) +
      renderFormRow("设备名称", renderInput("deviceName", defaults.deviceName, "请输入设备名称"), false) +
      renderFormRow("密码", renderInput("password", defaults.password, "请输入密码"), false) +
      renderFormRow("收流IP", renderInput("receiveIp", defaults.receiveIp, "请输入收流IP"), false) +
      renderFormRow("流媒体ID", renderSelect("mediaServerId", options.mediaServerOptions, defaults.mediaServerId), false) +
      renderFormRow("字符集", renderSelect("charset", options.charsetOptions, defaults.charset), false) +
      renderFormRow("坐标系", renderSelect("coordinateSystem", options.coordinateOptions, defaults.coordinateSystem), false) +
      renderFormRow("其他选项", renderCheckboxGroup(defaults), false) +
      "</div>" +
      '<div class="gb-device-form-actions">' +
      '<button id="gb-device-form-submit" class="button gb-device-form-submit" type="button">确认</button>' +
      '<button class="button-secondary gb-device-form-cancel" type="button" data-route="gb-device">取消</button>' +
      "</div>" +
      "</section>"
    );
  }

  function bindFormPage(runtime) {
    const page = runtime && runtime.page;
    const showToast = runtime && runtime.showToast;
    const navigateToRoute = runtime && runtime.navigateToRoute;
    const submitButton = document.getElementById("gb-device-form-submit");

    if (!page || !submitButton) {
      return null;
    }

    function handleSubmit() {
      if (typeof showToast === "function") {
        showToast(
          page.gbDeviceFormPage && page.gbDeviceFormPage.submitToastTitle ? page.gbDeviceFormPage.submitToastTitle : page.heading,
          page.gbDeviceFormPage && page.gbDeviceFormPage.submitToastMessage ? page.gbDeviceFormPage.submitToastMessage : "当前原型仅演示表单提交流程。"
        );
      }

      window.setTimeout(function () {
        if (typeof navigateToRoute === "function") {
          navigateToRoute("gb-device");
        }
      }, 240);
    }

    submitButton.addEventListener("click", handleSubmit);

    return function () {
      submitButton.removeEventListener("click", handleSubmit);
    };
  }

  function renderFormRow(label, control, required) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="gb-device-form-row">' +
      '<label class="gb-device-form-label">' +
      (required ? '<span class="gb-device-form-required">*</span>' : "") +
      utils.escapeHtml(label) +
      "</label>" +
      '<div class="gb-device-form-value">' + control + "</div>" +
      "</div>"
    );
  }

  function renderInput(name, value, placeholder) {
    const utils = window.PROTOTYPE_UTILS;
    return '<input class="gb-device-form-control" name="' + utils.escapeAttribute(name) + '" type="text" value="' + utils.escapeAttribute(value || "") + '" placeholder="' + utils.escapeAttribute(placeholder || "") + '" />';
  }

  function renderSelect(name, options, value) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<select class="gb-device-form-control gb-device-form-select" name="' + utils.escapeAttribute(name) + '">' +
      (options || []).map(function (option) {
        const selected = option.value === value ? ' selected="selected"' : "";
        return '<option value="' + utils.escapeAttribute(option.value) + '"' + selected + ">" + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderCheckboxGroup(defaults) {
    return (
      '<div class="gb-device-form-checkboxes">' +
      renderCheckbox("checkSsrc", "SSRC校验", defaults.checkSsrc) +
      renderCheckbox("asMessageChannel", "作为消息通道", defaults.asMessageChannel) +
      renderCheckbox("sendStreamAfterAck", "收到ACK后发流", defaults.sendStreamAfterAck) +
      "</div>"
    );
  }

  function renderCheckbox(name, label, checked) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<label class="gb-device-form-check">' +
      '<input type="checkbox" name="' + utils.escapeAttribute(name) + '"' + (checked ? ' checked="checked"' : "") + " />" +
      '<span>' + utils.escapeHtml(label) + "</span>" +
      "</label>"
    );
  }
})();
