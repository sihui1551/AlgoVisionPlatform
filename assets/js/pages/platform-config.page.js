(function () {
  const STORAGE_KEY_CONFIGURED = "algorithm-training-platform-configured";
  const STORAGE_KEY_SETTINGS = "algorithm-training-platform-settings";
  const STORAGE_KEY_RETURN_ROUTE = "algorithm-training-platform-return-route";

  window.registerPrototypePage({
    key: "platform-config",
    kind: "dashboard",
    styleSource: "../assets/css/pages/platform-config.css",
    heading: "平台配置",
    subtitle: "配置算法训练平台连接信息。",
    breadcrumbTrail: ["系统管理"],
    productDoc: {
      title: "平台配置需求说明",
      summary: "面向研发、设计、测试说明算法训练平台配置页的原型范围。",
      goal: "供平台管理员维护算法训练平台连接信息，为算法仓库同步和模型接入提供基础配置。",
      modules: [
        "表单主体用于录入平台地址、AppKey 和 AppSecret 等连接参数。",
        "页面头部用于说明当前配置场景与配置用途。",
        "底部保存按钮用于提交配置并回写本地存储。"
      ],
      rules: [
        "平台地址、AppKey 和 AppSecret 为保存前的必填项。",
        "当前页面以连接参数维护为主，不承载真实连通性校验流程。",
        "保存成功后需要写入本地存储，并根据回跳标记返回来源页面。"
      ],
      interactions: [
        "未完整填写信息时，点击保存需要阻止提交并提示。",
        "保存成功后，需要展示成功反馈并写入配置结果。",
        "存在回跳路由时，保存后需要返回来源页面。"
      ]
    },
    renderDashboardPage: function (context) {
      return renderPlatformConfigPage(context.page);
    },
    setup: function (runtime) {
      return bindPlatformConfigPage(runtime);
    }
  });

  function renderPlatformConfigPage(page) {
    const utils = window.PROTOTYPE_UTILS;
    const settings = readPlatformSettings();

    return (
      '<section class="panel platform-config-page">' +
      '<div class="platform-config-header">' +
      '<div>' +
      '<h2 class="platform-config-title">算法训练平台配置</h2>' +
      '<p class="platform-config-subtitle">用于算法仓库同步已训练模型和版本信息。</p>' +
      "</div>" +
      "</div>" +
      '<div class="platform-config-body">' +
      renderFormRow("平台地址", "platformUrl", settings.platformUrl, "请输入平台地址", false) +
      renderFormRow("AppKey", "appKey", settings.appKey, "请输入 AppKey", false) +
      renderFormRow("AppSecret", "appSecret", settings.appSecret, "请输入 AppSecret", true) +
      "</div>" +
      '<div class="platform-config-actions">' +
      '<button id="platform-config-save" class="button platform-config-save" type="button">保存配置</button>' +
      "</div>" +
      "</section>"
    );
  }

  function bindPlatformConfigPage(runtime) {
    const mountNode = runtime && runtime.mountNode;
    const showToast = runtime && typeof runtime.showToast === "function"
      ? runtime.showToast
      : function () {};
    const navigateToRoute = runtime && typeof runtime.navigateToRoute === "function"
      ? runtime.navigateToRoute
      : function () {};

    if (!mountNode) {
      return null;
    }

    const saveButton = document.getElementById("platform-config-save");
    const platformUrlInput = document.getElementById("platform-config-platformUrl");
    const appKeyInput = document.getElementById("platform-config-appKey");
    const appSecretInput = document.getElementById("platform-config-appSecret");

    if (!saveButton || !platformUrlInput || !appKeyInput || !appSecretInput) {
      return null;
    }

    function handleSave() {
      const settings = {
        platformUrl: String(platformUrlInput.value || "").trim(),
        appKey: String(appKeyInput.value || "").trim(),
        appSecret: String(appSecretInput.value || "").trim()
      };

      if (!settings.platformUrl || !settings.appKey || !settings.appSecret) {
        showToast("信息不完整", "请完整填写平台地址、AppKey 和 AppSecret。");
        return;
      }

      window.localStorage.setItem(STORAGE_KEY_CONFIGURED, "true");
      window.localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));

      showToast("保存成功", "算法训练平台配置已更新。");

      const returnRoute = window.localStorage.getItem(STORAGE_KEY_RETURN_ROUTE) || "";
      if (returnRoute) {
        window.localStorage.removeItem(STORAGE_KEY_RETURN_ROUTE);
        window.setTimeout(function () {
          navigateToRoute(returnRoute);
        }, 240);
      }
    }

    saveButton.addEventListener("click", handleSave);

    return function () {
      saveButton.removeEventListener("click", handleSave);
    };
  }

  function renderFormRow(label, name, value, placeholder, isSecret) {
    const utils = window.PROTOTYPE_UTILS;
    return (
      '<div class="platform-config-row">' +
      '<label class="platform-config-label" for="platform-config-' + utils.escapeAttribute(name) + '">' +
      utils.escapeHtml(label) +
      "</label>" +
      '<div class="platform-config-value">' +
      '<input id="platform-config-' + utils.escapeAttribute(name) + '" class="platform-config-control" type="' + (isSecret ? "password" : "text") + '" value="' + utils.escapeAttribute(value || "") + '" placeholder="' + utils.escapeAttribute(placeholder || "") + '" autocomplete="off" />' +
      "</div>" +
      "</div>"
    );
  }

  function readPlatformSettings() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_SETTINGS);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        platformUrl: parsed && parsed.platformUrl ? String(parsed.platformUrl) : "",
        appKey: parsed && parsed.appKey ? String(parsed.appKey) : "",
        appSecret: parsed && parsed.appSecret ? String(parsed.appSecret) : ""
      };
    } catch (error) {
      return {
        platformUrl: "",
        appKey: "",
        appSecret: ""
      };
    }
  }
})();
