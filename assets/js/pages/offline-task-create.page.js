(function () {
  const HEADING_TEXT = "新建离线视图分析任务";
  const BREADCRUMB_TRAIL = ["任务管理", HEADING_TEXT];
  const LOCAL_VIDEO_PAGE_KEY = "local-video";
  const OFFLINE_ANALYSIS_PAGE_KEY = "offline-analysis";
  const LOCAL_VIDEO_SYNC_REMARK = "来自离线任务本地上传";

  window.registerPrototypePage({
    key: "offline-task-create",
    styleSource: "../assets/css/pages/offline-task-create.css",
    kind: "dashboard",
    dashboardVariant: "offline-task-create",
    renderInPlaceholder: true,
    heading: HEADING_TEXT,
    subtitle: "配置离线素材分析任务的算法组合、优先级与分析素材。",
    breadcrumbTrail: BREADCRUMB_TRAIL.slice(),
    offlineTaskBuilder: {
      taskName: "",
      defaultMaterialType: "video",
      materialTypes: [
        { key: "video", label: "视频" },
        { key: "image", label: "图片" }
      ],
      algorithms: [
        { key: "mess-parking", label: "非机动车乱停", sourceType: "视频" },
        { key: "over-rail", label: "翻越围栏", sourceType: "视频" },
        { key: "road-occupy", label: "占道经营", sourceType: "视频" },
        { key: "water-trash", label: "水面垃圾", sourceType: "视频" },
        { key: "engineering", label: "工程车辆", sourceType: "视频" },
        { key: "street-shop", label: "沿街商铺检测", sourceType: "视频" },
        { key: "crowd-gather", label: "人员聚集检测", sourceType: "视频" },
        { key: "dew-sky", label: "露天烧烤检测", sourceType: "视频" }
      ],
      defaultAlgorithms: ["mess-parking"],
      priorityOptions: [
        { key: "high", label: "高" },
        { key: "medium", label: "中" },
        { key: "low", label: "低" }
      ],
      defaultPriority: "medium",
      recipients: [
        {
          key: "recipient-1",
          label: "跨屏平台1",
          name: "跨屏平台1",
          url: "http://192.168.224.110:18080/xxx/xxx/xx",
          bindTask: "人脸识别任务",
          status: "在线"
        },
        {
          key: "recipient-2",
          label: "跨屏平台2",
          name: "跨屏平台2",
          url: "http://192.168.224.111:18080/xxx/xxx/xx",
          bindTask: "城市治理任务",
          status: "在线"
        },
        {
          key: "recipient-3",
          label: "跨屏平台3",
          name: "跨屏平台3",
          url: "http://192.168.224.112:18080/xxx/xxx/xx",
          bindTask: "车辆识别任务",
          status: "在线"
        }
      ],
      defaultRecipients: ["recipient-1", "recipient-2"],
      resourceSpecs: [
        {
          key: "spec-offer-1",
          id: "123123",
          label: "InstanceOffer-1",
          vcpu: "4",
          memoryGB: "8",
          gpu: "Nvidia A20",
          gpuMemoryGB: "1*24",
          diskGB: "500",
          meta: "通用离线分析规格"
        },
        {
          key: "spec-offer-2",
          id: "123124",
          label: "InstanceOffer-2",
          vcpu: "8",
          memoryGB: "16",
          gpu: "Nvidia A30",
          gpuMemoryGB: "1*24",
          diskGB: "500",
          meta: "适合多算法离线任务"
        },
        {
          key: "spec-offer-3",
          id: "123125",
          label: "InstanceOffer-3",
          vcpu: "16",
          memoryGB: "32",
          gpu: "Nvidia L40",
          gpuMemoryGB: "1*48",
          diskGB: "1000",
          meta: "高精度离线分析规格"
        },
        {
          key: "spec-offer-4",
          id: "123126",
          label: "InstanceOffer-4",
          vcpu: "8",
          memoryGB: "12",
          gpu: "Nvidia A20",
          gpuMemoryGB: "1*24",
          diskGB: "500",
          meta: "中等吞吐离线任务"
        },
        {
          key: "spec-offer-5",
          id: "123127",
          label: "InstanceOffer-5",
          vcpu: "4",
          memoryGB: "8",
          gpu: "Nvidia A20",
          gpuMemoryGB: "1*24",
          diskGB: "500",
          meta: "轻量离线任务"
        }
      ],
      defaultSpecKey: "spec-offer-1",
      tabs: [
        {
          key: "event-search",
          label: "事件检索",
          version: "V1.0",
          interval: "5",
          materials: []
        },
        {
          key: "ocr",
          label: "OCR识别",
          version: "V1.0",
          interval: "5",
          materials: []
        },
        {
          key: "watermark",
          label: "水印检测",
          version: "V1.0",
          interval: "5",
          materials: []
        }
      ]
    },
    renderDashboardPage: function (context) {
      return renderOfflineTaskCreatePage(context.page, context.shell, context.utils);
    },
    setup: function (runtime) {
      return bindOfflineTaskCreatePage(runtime);
    }
  });

  function bindOfflineTaskCreatePage(runtime) {
    const page = runtime && runtime.page;
    if (!page || page.key !== "offline-task-create") {
      return null;
    }

    const root = runtime.mountNode ? runtime.mountNode.querySelector(".content-grid") : null;
    if (!root) {
      return null;
    }

    page.__offlineTaskCreateState = null;
    normalizeOfflineBuilder(page);
    const initialState = ensureOfflineState(page);
    syncOfflineSelectedAlgorithms(initialState, page.offlineTaskBuilder || {});
    syncOfflineBreadcrumb(runtime);
    page.__offlineLocalVideoRows = [];
    loadOfflineLocalVideoRows(runtime, page).then(function (rows) {
      page.__offlineLocalVideoRows = rows;
      if (ensureOfflineState(page).modals.localVideo) {
        rerender();
      }
    });

    function rerender() {
      root.innerHTML = renderOfflineTaskCreatePage(page, window.PROTOTYPE_SHELL, window.PROTOTYPE_UTILS);
      syncOfflineBreadcrumb(runtime);
    }

    function closeModal(state, modalKey) {
      state.modals[modalKey] = false;
    }

    function handleClick(event) {
      const target = event.target.closest(
        "[data-offline-material],[data-offline-priority],[data-offline-tab],[data-offline-action],[data-offline-modal-close]"
      );
      if (!target) {
        return;
      }

      const state = ensureOfflineState(page);
      const builder = normalizeOfflineBuilder(page);

      if (target.hasAttribute("data-offline-material")) {
        state.materialType = target.getAttribute("data-offline-material") || state.materialType;
        rerender();
        return;
      }

      if (target.hasAttribute("data-offline-priority")) {
        state.priority = target.getAttribute("data-offline-priority") || state.priority;
        rerender();
        return;
      }

      if (target.hasAttribute("data-offline-tab")) {
        const nextTabKey = target.getAttribute("data-offline-tab") || "";
        const selectedTabs = resolveOfflineAlgorithmTabs(builder, state);
        if (findByKey(selectedTabs, nextTabKey)) {
          state.activeTab = nextTabKey;
        }
        rerender();
        return;
      }

      if (target.hasAttribute("data-offline-modal-close")) {
        closeModal(state, target.getAttribute("data-offline-modal-close"));
        rerender();
        return;
      }

      const action = target.getAttribute("data-offline-action") || "";
      const key = target.getAttribute("data-offline-key") || "";

      if (action === "algorithm-open") {
        state.modals.algorithm = true;
        state.modalDraft.algorithms = state.selectedAlgorithms.slice();
        state.modalDraft.algorithmPendingChecked = [];
        state.modalDraft.algorithmSelectedChecked = [];
        rerender();
        return;
      }

      if (action === "algorithm-pending-toggle") {
        toggleValue(state.modalDraft.algorithmPendingChecked, key);
        rerender();
        return;
      }

      if (action === "algorithm-selected-toggle") {
        toggleValue(state.modalDraft.algorithmSelectedChecked, key);
        rerender();
        return;
      }

      if (action === "algorithm-move-right") {
        state.modalDraft.algorithmPendingChecked.forEach(function (pendingKey) {
          if (state.modalDraft.algorithms.indexOf(pendingKey) === -1) {
            state.modalDraft.algorithms.push(pendingKey);
          }
        });
        state.modalDraft.algorithmPendingChecked = [];
        rerender();
        return;
      }

      if (action === "algorithm-move-left") {
        state.modalDraft.algorithms = state.modalDraft.algorithms.filter(function (algorithmKey) {
          return state.modalDraft.algorithmSelectedChecked.indexOf(algorithmKey) === -1;
        });
        state.modalDraft.algorithmSelectedChecked = [];
        rerender();
        return;
      }

      if (action === "algorithm-save") {
        state.selectedAlgorithms = uniqueList(state.modalDraft.algorithms);
        syncOfflineSelectedAlgorithms(state, builder);
        closeModal(state, "algorithm");
        rerender();
        return;
      }

      if (action === "algorithm-clear") {
        state.selectedAlgorithms = [];
        syncOfflineSelectedAlgorithms(state, builder);
        rerender();
        return;
      }

      if (action === "algorithm-remove") {
        state.selectedAlgorithms = state.selectedAlgorithms.filter(function (item) {
          return item !== key;
        });
        syncOfflineSelectedAlgorithms(state, builder);
        rerender();
        return;
      }

      if (action === "recipient-open") {
        state.modals.recipient = true;
        state.modalDraft.recipients = state.selectedRecipients.slice();
        state.modalDraft.recipientChecked = state.selectedRecipients.slice();
        rerender();
        return;
      }

      if (action === "recipient-row-toggle") {
        toggleValue(state.modalDraft.recipientChecked, key);
        rerender();
        return;
      }

      if (action === "recipient-new") {
        const nextIndex = builder.recipients.length + 1;
        builder.recipients.push({
          key: "recipient-" + nextIndex,
          label: "跨屏平台" + nextIndex,
          name: "跨屏平台" + nextIndex,
          url: "http://192.168.224.11" + (9 + nextIndex) + ":18080/xxx/xxx/xx",
          bindTask: "新建任务",
          status: "在线"
        });
        state.modalDraft.recipients = state.modalDraft.recipientChecked.slice();
        rerender();
        return;
      }

      if (action === "recipient-test" && typeof runtime.showToast === "function") {
        const recipient = findByKey(builder.recipients, key);
        runtime.showToast("测试地址", "已模拟测试 " + ((recipient && recipient.label) || "当前地址") + "。");
        return;
      }

      if (action === "recipient-edit" && typeof runtime.showToast === "function") {
        const recipient = findByKey(builder.recipients, key);
        runtime.showToast("编辑地址", "当前原型预留 " + ((recipient && recipient.label) || "当前地址") + " 的编辑流程。");
        return;
      }

      if (action === "recipient-delete") {
        builder.recipients = builder.recipients.filter(function (item) {
          return item.key !== key;
        });
        state.modalDraft.recipientChecked = state.modalDraft.recipientChecked.filter(function (item) {
          return item !== key;
        });
        state.modalDraft.recipients = state.modalDraft.recipientChecked.slice();
        rerender();
        return;
      }

      if (action === "recipient-save") {
        state.selectedRecipients = uniqueList(state.modalDraft.recipientChecked);
        closeModal(state, "recipient");
        rerender();
        return;
      }

      if (action === "recipient-remove") {
        state.selectedRecipients = state.selectedRecipients.filter(function (item) {
          return item !== key;
        });
        rerender();
        return;
      }

      if (action === "spec-open") {
        state.modals.spec = true;
        state.modalDraft.specKey = state.selectedSpecKey;
        rerender();
        return;
      }

      if (action === "spec-select") {
        state.modalDraft.specKey = key;
        rerender();
        return;
      }

      if (action === "spec-save") {
        state.selectedSpecKey = state.modalDraft.specKey || "";
        closeModal(state, "spec");
        rerender();
        return;
      }

      if (action === "spec-clear") {
        state.selectedSpecKey = "";
        rerender();
        return;
      }

      if (action === "local-video-open") {
        const activeAlgorithmKey = state.activeTab || "";
        if (!activeAlgorithmKey) {
          if (typeof runtime.showToast === "function") {
            runtime.showToast("从本地视频选择", "请先在上方选择分析算法。");
          }
          return;
        }

        loadOfflineLocalVideoRows(runtime, page).then(function (rows) {
          page.__offlineLocalVideoRows = rows;
          state.modals.localVideo = true;
          state.modalDraft.localVideoChecked = [];
          rerender();
        });
        return;
      }

      if (action === "local-video-row-toggle") {
        toggleValue(state.modalDraft.localVideoChecked, key);
        rerender();
        return;
      }

      if (action === "local-video-save") {
        const activeAlgorithmKey = state.activeTab || "";
        if (!activeAlgorithmKey) {
          closeModal(state, "localVideo");
          rerender();
          return;
        }

        const selectedRows = getOfflineLocalVideoRows(page, state.materialType).filter(function (row) {
          return state.modalDraft.localVideoChecked.indexOf(row.id) !== -1;
        });
        if (!selectedRows.length) {
          if (typeof runtime.showToast === "function") {
            runtime.showToast("从本地视频选择", "请先勾选至少一条本地视频记录。");
          }
          return;
        }
        const result = appendOfflineMaterialsFromLocalVideoRows(state, builder, activeAlgorithmKey, selectedRows);
        persistOfflineTaskState(runtime, page, state);
        closeModal(state, "localVideo");
        state.modalDraft.localVideoChecked = [];
        rerender();
        scrollToOfflineMaterials(root);
        if (typeof runtime.showToast === "function") {
          if (result.added > 0) {
            runtime.showToast(
              "从本地视频选择",
              "已添加 " + result.added + " 个素材" + (result.skipped ? "，忽略 " + result.skipped + " 个重复素材" : "") + "。"
            );
          } else {
            runtime.showToast(
              "从本地视频选择",
              "所选素材已存在于离线素材列表中" + (result.skipped ? "，已忽略 " + result.skipped + " 个重复素材" : "。")
            );
          }
        }
        return;
      }

      if (action === "start-analysis" || action === "save-draft") {
        submitOfflineTask(runtime, page, state, builder, action === "start-analysis" ? "start" : "draft").then(function (result) {
          if (result && result.ok) {
            return;
          }

          if (typeof runtime.showToast === "function") {
            runtime.showToast(
              action === "start-analysis" ? "启动分析" : "保存草稿",
              (result && result.message) || "当前操作未成功，请稍后重试。"
            );
          }
        }).catch(function () {
          if (typeof runtime.showToast === "function") {
            runtime.showToast(
              action === "start-analysis" ? "启动分析" : "保存草稿",
              "当前操作未成功，请稍后重试。"
            );
          }
        });
        return;
      }

      if (action === "add-material") {
        const fileInput = root.querySelector('[data-offline-file-picker="material"]');
        if (!fileInput) {
          if (typeof runtime.showToast === "function") {
            runtime.showToast("添加视图", "未找到上传控件，请刷新页面后重试。");
          }
          return;
        }
        fileInput.click();
        return;
      }

      if (action === "material-remove") {
        const activeAlgorithmKey = state.activeTab || "";
        if (!activeAlgorithmKey) {
          return;
        }
        const configs = ensureOfflineAlgorithmConfigs(state, builder);
        const config = configs[activeAlgorithmKey];
        if (!config) {
          return;
        }
        config.materials = ensureList(config.materials).filter(function (item) {
          return item.key !== key;
        });
        persistOfflineTaskState(runtime, page, state);
        rerender();
      }
    }

    function handleInput(event) {
      const field = event.target;
      if (!field || !field.hasAttribute("data-offline-field")) {
        return;
      }

      const state = ensureOfflineState(page);
      const fieldName = field.getAttribute("data-offline-field");
      const builder = normalizeOfflineBuilder(page);

      if (fieldName === "taskName") {
        state.taskName = field.value || "";
        persistOfflineTaskState(runtime, page, state);
        return;
      }

      if (fieldName === "interval") {
        const algorithmKey = field.getAttribute("data-offline-algorithm-key") || state.activeTab || "";
        if (!algorithmKey) {
          return;
        }

        const configs = ensureOfflineAlgorithmConfigs(state, builder);
        if (!configs[algorithmKey]) {
          configs[algorithmKey] = {
            version: "V1.0",
            interval: "5",
            materials: []
          };
        }

        configs[algorithmKey].interval = normalizeOfflineInterval(field.value);
        persistOfflineTaskState(runtime, page, state);
      }
    }

    function handleChange(event) {
      const field = event.target;
      if (!field || field.getAttribute("data-offline-file-picker") !== "material") {
        return;
      }

      const files = Array.prototype.slice.call(field.files || []);
      field.value = "";
      if (!files.length) {
        return;
      }

      const state = ensureOfflineState(page);
      const builder = normalizeOfflineBuilder(page);
      syncOfflineSelectedAlgorithms(state, builder);

      const activeAlgorithmKey = state.activeTab || "";
      if (!activeAlgorithmKey) {
        if (typeof runtime.showToast === "function") {
          runtime.showToast("添加视图", "请先在上方选择分析算法。");
        }
        return;
      }

      const result = appendOfflineMaterialsFromFiles(state, builder, activeAlgorithmKey, files);
      persistOfflineTaskState(runtime, page, state);
      rerender();

      syncUploadedFilesToLocalVideo(runtime, page, files).then(function (syncResult) {
        if (typeof runtime.showToast === "function") {
          runtime.showToast(
            "添加视图",
            "已添加 " + result.added + " 个文件" +
              (result.skipped ? "，忽略 " + result.skipped + " 个不支持或重复文件" : "") +
              (syncResult.added ? "，并同步到本地视频 " + syncResult.added + " 条记录" : "") +
              "。"
          );
        }
      }).catch(function () {
        if (typeof runtime.showToast === "function") {
          runtime.showToast("添加视图", "已添加 " + result.added + " 个文件" + (result.skipped ? "，忽略 " + result.skipped + " 个不支持或重复文件" : "") + "。");
        }
      });
    }

    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleChange);
    rerender();

    return function cleanup() {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("input", handleInput);
      root.removeEventListener("change", handleChange);
    };
  }

  function renderOfflineTaskCreatePage(page, shell, utils) {
    const safeUtils = utils || window.PROTOTYPE_UTILS;
    const safeShell = shell || window.PROTOTYPE_SHELL;
    const builder = normalizeOfflineBuilder(page);
    const state = ensureOfflineState(page);
    syncOfflineSelectedAlgorithms(state, builder);
    const algorithmTabs = resolveOfflineAlgorithmTabs(builder, state);
    const activeTab = findByKey(algorithmTabs, state.activeTab) || algorithmTabs[0] || {};
    const materials = ensureList(activeTab.materials);
    const materialType = state.materialType || builder.defaultMaterialType || "video";
    const localVideoRows = getOfflineLocalVideoRows(page, materialType);
    const selectedAlgorithms = findByKeys(builder.algorithms, state.selectedAlgorithms);
    const selectedRecipients = findByKeys(builder.recipients, state.selectedRecipients);
    const selectedSpec = findByKey(builder.resourceSpecs, state.selectedSpecKey);

    return (
      '<section class="panel offline-task-create-page">' +
      '<div class="offline-task-create-form">' +
      renderOfflineFormRow("任务名称*", '<input class="source-form-control offline-name-input" type="text" data-offline-field="taskName" value="' + safeUtils.escapeAttribute(state.taskName || "") + '" placeholder="请输入任务名称" />', safeUtils) +
      renderOfflineFormRow("素材类型*", renderOfflineMaterialTypes(builder, state, safeUtils), safeUtils) +
      renderOfflineFormRow("分析算法", renderOfflineSelectionGroup({
        primaryLabel: "选择算法",
        primaryAction: "algorithm-open",
        clearLabel: "清空选择",
        clearAction: "algorithm-clear",
        chips: selectedAlgorithms,
        removeAction: "algorithm-remove",
        emptyText: "尚未选择分析算法"
      }, safeUtils), safeUtils) +
      renderOfflineFormRow("分析优先级", renderOfflinePriority(builder, state, safeUtils), safeUtils) +
      renderOfflineFormRow("告警推送", renderOfflineSelectionGroup({
        primaryLabel: "选择地址",
        primaryAction: "recipient-open",
        clearLabel: "",
        clearAction: "",
        chips: selectedRecipients,
        removeAction: "recipient-remove",
        emptyText: "尚未选择推送地址"
      }, safeUtils), safeUtils) +
      renderOfflineFormRow("计算资源配置", renderOfflineSelectionGroup({
        primaryLabel: "选择规格",
        primaryAction: "spec-open",
        clearLabel: "清空选择",
        clearAction: "spec-clear",
        chips: selectedSpec ? [selectedSpec] : [],
        removeAction: "",
        emptyText: "尚未选择资源规格"
      }, safeUtils), safeUtils) +
      "</div>" +
      renderOfflineMaterialStage(builder, state, algorithmTabs, activeTab, materialType, materials, safeShell, safeUtils) +
      renderOfflineActionBar(safeUtils) +
      renderOfflineAlgorithmModal(builder, state, safeUtils) +
      renderOfflineRecipientModal(builder, state, safeUtils) +
      renderOfflineSpecModal(builder, state, safeUtils) +
      renderOfflineLocalVideoModal(state, materialType, localVideoRows, safeUtils) +
      "</section>"
    );
  }

  function renderOfflineFormRow(label, content, utils) {
    return (
      '<div class="offline-form-row">' +
      '<div class="offline-form-label">' + utils.escapeHtml(label) + "</div>" +
      '<div class="offline-form-value">' + content + "</div>" +
      "</div>"
    );
  }

  function renderOfflineMaterialTypes(builder, state, utils) {
    return ensureList(builder.materialTypes).map(function (item) {
      const active = state.materialType === item.key;
      return (
        '<button class="offline-radio' + (active ? " active" : "") + '" type="button" data-offline-material="' + utils.escapeAttribute(item.key) + '">' +
        '<span class="offline-radio-dot"></span>' +
        utils.escapeHtml(item.label) +
        "</button>"
      );
    }).join("");
  }

  function renderOfflinePriority(builder, state, utils) {
    return ensureList(builder.priorityOptions).map(function (item) {
      const active = state.priority === item.key;
      return (
        '<button class="offline-radio' + (active ? " active" : "") + '" type="button" data-offline-priority="' + utils.escapeAttribute(item.key) + '">' +
        '<span class="offline-radio-dot"></span>' +
        utils.escapeHtml(item.label) +
        "</button>"
      );
    }).join("");
  }

  function renderOfflineSelectionGroup(config, utils) {
    const clearAction = config.clearLabel && config.clearAction
      ? '<button class="button-link offline-inline-link" type="button" data-offline-action="' + utils.escapeAttribute(config.clearAction) + '">' + utils.escapeHtml(config.clearLabel) + "</button>"
      : "";
    const chips = ensureList(config.chips);
    const chipList = chips.length
      ? chips.map(function (chip) {
        const removeButton = config.removeAction
          ? '<button class="offline-chip-close-btn" type="button" data-offline-action="' + utils.escapeAttribute(config.removeAction) + '" data-offline-key="' + utils.escapeAttribute(chip.key || "") + '">×</button>'
          : "";
        return '<span class="offline-chip">' + utils.escapeHtml(chip.label || chip.name || chip) + removeButton + "</span>";
      }).join("")
      : '<span class="offline-placeholder">' + utils.escapeHtml(config.emptyText || "暂无选择") + "</span>";

    return (
      '<div class="offline-selection-group">' +
      '<div class="offline-selection-actions">' +
      '<button class="button-link offline-inline-link" type="button" data-offline-action="' + utils.escapeAttribute(config.primaryAction) + '">' + utils.escapeHtml(config.primaryLabel) + "</button>" +
      clearAction +
      "</div>" +
      '<div class="offline-chip-list">' + chipList + "</div>" +
      "</div>"
    );
  }

  function renderOfflineMaterialStage(builder, state, algorithmTabs, activeTab, materialType, materials, shell, utils) {
    const statusRenderer = shell && typeof shell.renderStatusPill === "function"
      ? shell.renderStatusPill
      : function (tone, label) {
        return '<span class="status-pill ' + utils.escapeAttribute(tone || "") + '">' + utils.escapeHtml(label || "") + "</span>";
      };
    const hasSelectedAlgorithms = ensureList(algorithmTabs).length > 0;
    const tabMarkup = hasSelectedAlgorithms
      ? ensureList(algorithmTabs).map(function (tab) {
        const active = state.activeTab === tab.key;
        return '<button class="offline-algorithm-tab' + (active ? " active" : "") + '" type="button" data-offline-tab="' + utils.escapeAttribute(tab.key) + '">' + utils.escapeHtml(tab.label) + "</button>";
      }).join("")
      : '<span class="offline-placeholder">请先在上方选择分析算法</span>';
    const metaMarkup = hasSelectedAlgorithms
      ? (
        '<div class="offline-meta-group">' +
        '<div class="offline-meta-pair"><span class="offline-meta-label">算法版本</span><span class="offline-meta-chip">' + utils.escapeHtml(activeTab.version || "V1.0") + "</span></div>" +
        '<div class="offline-meta-pair"><span class="offline-meta-label">抽帧间隔</span><span class="offline-meta-inline"><input class="source-form-control offline-interval-input" type="text" data-offline-field="interval" data-offline-algorithm-key="' + utils.escapeAttribute(activeTab.key || "") + '" value="' + utils.escapeAttribute(activeTab.interval || "5") + '" /><span class="offline-meta-unit">秒</span></span></div>' +
        "</div>"
      )
      : '<div class="offline-meta-pair"><span class="offline-meta-label">未选择分析算法，暂无算法配置</span></div>';

    return (
      '<section class="offline-stage">' +
      '<div class="offline-stage-header">' +
      "<div>" +
      '<h3 class="offline-stage-title">离线素材</h3>' +
      "</div>" +
      '<div class="offline-stage-header-actions">' +
      '<button class="button-secondary" type="button" data-offline-action="local-video-open">从本地视频选择</button>' +
      '<button class="button" type="button" data-offline-action="add-material">添加' + utils.escapeHtml(materialType === "video" ? "视频" : "图片") + "</button>" +
      "</div>" +
      "</div>" +
      '<div class="offline-dropzone">' +
      '<input class="offline-file-input" type="file" data-offline-file-picker="material" multiple accept="video/*,image/*,.zip,.rar,.7z,.tar,.gz,.bz2,.xz" />' +
      '<div class="offline-dropzone-title">支持多' + utils.escapeHtml(materialType === "video" ? "视频" : "图片") + '批量导入（支持压缩包）</div>' +
      '<div class="offline-dropzone-text">点击右上角【添加' + utils.escapeHtml(materialType === "video" ? "视频" : "图片") + '】上传本地素材，或从【本地视频】中直接复用已有记录。</div>' +
      "</div>" +
      '<div class="offline-algorithm-tabs">' +
      tabMarkup +
      "</div>" +
      '<div class="offline-tab-meta">' +
      metaMarkup +
      "</div>" +
      '<div class="offline-material-table-wrap">' +
      '<div class="offline-material-table-head">' +
      '<h4 class="offline-material-table-title">分析素材</h4>' +
      '<div class="offline-material-table-note">已选择 ' + ensureList(materials).length + " 个视图文件</div>" +
      "</div>" +
      '<div class="table-shell offline-material-table">' +
      "<table>" +
      "<thead><tr><th>素材名称</th><th>封面</th><th>时长</th><th>清晰度</th><th>大小</th><th>状态</th><th>操作</th></tr></thead>" +
      "<tbody>" +
      (materials.length
        ? materials.map(function (item) {
          return (
            "<tr>" +
            "<td>" + utils.escapeHtml(item.name || "--") + "</td>" +
            "<td>" + utils.escapeHtml(item.cover || "--") + "</td>" +
            "<td>" + utils.escapeHtml(item.duration || "--") + "</td>" +
            "<td>" + utils.escapeHtml(item.resolution || "--") + "</td>" +
            "<td>" + utils.escapeHtml(item.size || "--") + "</td>" +
            "<td>" + statusRenderer(item.statusTone || "success", item.statusLabel || "可分析") + "</td>" +
            '<td><div class="table-actions"><button class="table-action" type="button" data-offline-action="material-remove" data-offline-key="' + utils.escapeAttribute(item.key || "") + '">移除</button></div></td>' +
            "</tr>"
          );
        }).join("")
        : '<tr><td colspan="7"><div class="empty-state offline-empty-state">暂无上传离线素材</div></td></tr>') +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>" +
      "</section>"
    );
  }

  function renderOfflineLocalVideoModal(state, materialType, rows, utils) {
    if (!state.modals.localVideo) {
      return "";
    }

    const checkedMap = createLookupMap(state.modalDraft.localVideoChecked);
    const list = ensureList(rows);

    return (
      '<div class="offline-modal-layer">' +
      '<button class="offline-modal-mask" type="button" data-offline-modal-close="localVideo" aria-label="关闭弹窗"></button>' +
      '<section class="offline-modal offline-modal-local-video" role="dialog" aria-modal="true">' +
      '<div class="offline-modal-header">' +
      '<div><h3 class="offline-modal-title">从本地视频选择</h3></div>' +
      '<button class="offline-modal-close" type="button" data-offline-modal-close="localVideo">×</button>' +
      "</div>" +
      '<div class="table-shell offline-local-video-table">' +
      "<table>" +
      "<thead><tr><th></th><th>记录名称</th><th>文件类型</th><th>文件数量</th><th>备注</th><th>创建时间</th></tr></thead>" +
      "<tbody>" +
      (list.length
        ? list.map(function (row) {
          const checked = !!checkedMap[row.id];
          return (
            "<tr>" +
            '<td class="offline-check-cell"><button class="offline-table-check' + (checked ? " checked" : "") + '" type="button" data-offline-action="local-video-row-toggle" data-offline-key="' + utils.escapeAttribute(row.id || "") + '"></button></td>' +
            "<td>" + utils.escapeHtml(row.recordName || "--") + "</td>" +
            "<td>" + utils.escapeHtml(row.fileTypeLabel || "--") + "</td>" +
            "<td>" + utils.escapeHtml(String(row.fileCount || "--")) + "</td>" +
            "<td>" + utils.escapeHtml(row.remark || "--") + "</td>" +
            "<td>" + utils.escapeHtml(row.createdAt || "--") + "</td>" +
            "</tr>"
          );
        }).join("")
        : '<tr><td colspan="6"><div class="empty-state offline-empty-state">暂无可复用的本地视频记录</div></td></tr>') +
      "</tbody>" +
      "</table>" +
      "</div>" +
      '<div class="offline-modal-footer">' +
      '<button class="button-secondary" type="button" data-offline-modal-close="localVideo">取消</button>' +
      '<button class="button" type="button" data-offline-action="local-video-save">添加到当前任务</button>' +
      "</div>" +
      "</section>" +
      "</div>"
    );
  }

  function renderOfflineActionBar(utils) {
    return (
      '<div class="offline-task-actions">' +
      '<button class="button-secondary" type="button" data-route="offline-analysis">返回</button>' +
      '<button class="button-secondary" type="button" data-offline-action="save-draft">' + utils.escapeHtml("保存草稿") + "</button>" +
      '<button class="button" type="button" data-offline-action="start-analysis">' + utils.escapeHtml("启动分析") + "</button>" +
      "</div>"
    );
  }

  function renderOfflineAlgorithmModal(builder, state, utils) {
    if (!state.modals.algorithm) {
      return "";
    }

    const selectedMap = createLookupMap(state.modalDraft.algorithms);
    const pendingAlgorithms = ensureList(builder.algorithms).filter(function (item) {
      return !selectedMap[item.key];
    });
    const selectedAlgorithms = ensureList(builder.algorithms).filter(function (item) {
      return !!selectedMap[item.key];
    });

    return (
      '<div class="offline-modal-layer">' +
      '<button class="offline-modal-mask" type="button" data-offline-modal-close="algorithm" aria-label="关闭弹窗"></button>' +
      '<section class="offline-modal offline-modal-wide" role="dialog" aria-modal="true">' +
      '<div class="offline-modal-header">' +
      '<h3 class="offline-modal-title">选择算法</h3>' +
      '<button class="offline-modal-close" type="button" data-offline-modal-close="algorithm">×</button>' +
      "</div>" +
      '<div class="offline-transfer-body">' +
      renderOfflineAlgorithmPanel("待添加", pendingAlgorithms, state.modalDraft.algorithmPendingChecked, "algorithm-pending-toggle", utils) +
      '<div class="offline-transfer-actions">' +
      '<button class="button offline-transfer-btn" type="button" data-offline-action="algorithm-move-right">&gt;</button>' +
      '<button class="button offline-transfer-btn" type="button" data-offline-action="algorithm-move-left">&lt;</button>' +
      "</div>" +
      renderOfflineAlgorithmPanel("已添加", selectedAlgorithms, state.modalDraft.algorithmSelectedChecked, "algorithm-selected-toggle", utils) +
      "</div>" +
      '<div class="offline-modal-footer">' +
      '<button class="button" type="button" data-offline-action="algorithm-save">保存</button>' +
      '<button class="button-secondary" type="button" data-offline-modal-close="algorithm">取消</button>' +
      "</div>" +
      "</section>" +
      "</div>"
    );
  }

  function renderOfflineAlgorithmPanel(title, items, checkedKeys, toggleAction, utils) {
    const checkedMap = createLookupMap(checkedKeys);
    return (
      '<section class="offline-transfer-panel">' +
      '<div class="offline-transfer-panel-head"><span>' + utils.escapeHtml(title) + '</span><span>' + utils.escapeHtml(String(ensureList(items).length)) + "</span></div>" +
      '<div class="offline-transfer-list">' +
      (ensureList(items).length
        ? ensureList(items).map(function (item) {
          const checked = !!checkedMap[item.key];
          return (
            '<button class="offline-transfer-row' + (checked ? " active" : "") + '" type="button" data-offline-action="' + utils.escapeAttribute(toggleAction) + '" data-offline-key="' + utils.escapeAttribute(item.key) + '">' +
            '<span class="offline-transfer-check' + (checked ? " checked" : "") + '"></span>' +
            '<span class="offline-transfer-label">' + utils.escapeHtml(item.label || item.name || "--") + "</span>" +
            '<span class="offline-transfer-tag">' + utils.escapeHtml(item.sourceType || "视频") + "</span>" +
            "</button>"
          );
        }).join("")
        : '<div class="offline-transfer-empty">暂无数据</div>') +
      "</div>" +
      "</section>"
    );
  }

  function renderOfflineRecipientModal(builder, state, utils) {
    if (!state.modals.recipient) {
      return "";
    }

    const checkedMap = createLookupMap(state.modalDraft.recipientChecked);
    return (
      '<div class="offline-modal-layer">' +
      '<button class="offline-modal-mask" type="button" data-offline-modal-close="recipient" aria-label="关闭弹窗"></button>' +
      '<section class="offline-modal offline-modal-full" role="dialog" aria-modal="true">' +
      '<div class="offline-modal-header">' +
      '<h3 class="offline-modal-title">选择地址</h3>' +
      '<button class="offline-modal-close" type="button" data-offline-modal-close="recipient">×</button>' +
      "</div>" +
      '<div class="offline-address-toolbar"><span class="offline-address-toolbar-label">地址列表</span><button class="button" type="button" data-offline-action="recipient-new">新增</button></div>' +
      '<div class="table-shell offline-address-table">' +
      "<table>" +
      "<thead><tr><th></th><th>名称</th><th>推送地址</th><th>关联任务</th><th>状态</th><th>操作</th></tr></thead>" +
      "<tbody>" +
      ensureList(builder.recipients).map(function (item) {
        const checked = !!checkedMap[item.key];
        return (
          "<tr>" +
          '<td class="offline-check-cell"><button class="offline-table-check' + (checked ? " checked" : "") + '" type="button" data-offline-action="recipient-row-toggle" data-offline-key="' + utils.escapeAttribute(item.key) + '"></button></td>' +
          "<td>" + utils.escapeHtml(item.label || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.url || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.bindTask || "--") + "</td>" +
          '<td><span class="offline-online-pill">' + utils.escapeHtml(item.status || "在线") + "</span></td>" +
          '<td><div class="offline-row-actions">' +
          '<button class="table-action offline-row-btn" type="button" data-offline-action="recipient-test" data-offline-key="' + utils.escapeAttribute(item.key) + '">测试</button>' +
          '<button class="table-action offline-row-btn" type="button" data-offline-action="recipient-edit" data-offline-key="' + utils.escapeAttribute(item.key) + '">编辑</button>' +
          '<button class="table-action offline-row-btn" type="button" data-offline-action="recipient-delete" data-offline-key="' + utils.escapeAttribute(item.key) + '">删除</button>' +
          "</div></td>" +
          "</tr>"
        );
      }).join("") +
      "</tbody>" +
      "</table>" +
      "</div>" +
      '<div class="offline-modal-footer">' +
      '<button class="button" type="button" data-offline-action="recipient-save">保存</button>' +
      '<button class="button-secondary" type="button" data-offline-modal-close="recipient">关闭</button>' +
      "</div>" +
      "</section>" +
      "</div>"
    );
  }

  function renderOfflineSpecModal(builder, state, utils) {
    if (!state.modals.spec) {
      return "";
    }

    return (
      '<div class="offline-modal-layer">' +
      '<button class="offline-modal-mask" type="button" data-offline-modal-close="spec" aria-label="关闭弹窗"></button>' +
      '<section class="offline-modal offline-modal-full" role="dialog" aria-modal="true">' +
      '<div class="offline-modal-header">' +
      '<h3 class="offline-modal-title">选择规格</h3>' +
      '<button class="offline-modal-close" type="button" data-offline-modal-close="spec">×</button>' +
      "</div>" +
      '<div class="table-shell offline-spec-table">' +
      "<table>" +
      "<thead><tr><th></th><th>规格ID</th><th>规格名称</th><th>vCPU(核)</th><th>内存(GB)</th><th>GPU</th><th>GPU 显存(GB)</th><th>硬盘大小(GB)</th></tr></thead>" +
      "<tbody>" +
      ensureList(builder.resourceSpecs).map(function (item) {
        const active = state.modalDraft.specKey === item.key;
        return (
          "<tr>" +
          '<td class="offline-check-cell"><button class="offline-table-check' + (active ? " checked" : "") + '" type="button" data-offline-action="spec-select" data-offline-key="' + utils.escapeAttribute(item.key) + '"></button></td>' +
          "<td>" + utils.escapeHtml(item.id || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.label || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.vcpu || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.memoryGB || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.gpu || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.gpuMemoryGB || "--") + "</td>" +
          "<td>" + utils.escapeHtml(item.diskGB || "--") + "</td>" +
          "</tr>"
        );
      }).join("") +
      "</tbody>" +
      "</table>" +
      "</div>" +
      '<div class="offline-modal-footer">' +
      '<button class="button-secondary" type="button" data-offline-modal-close="spec">取消</button>' +
      '<button class="button" type="button" data-offline-action="spec-save">保存</button>' +
      "</div>" +
      "</section>" +
      "</div>"
    );
  }

  function ensureOfflineState(page) {
    if (page.__offlineTaskCreateState) {
      return page.__offlineTaskCreateState;
    }

    const builder = normalizeOfflineBuilder(page);
    page.__offlineTaskCreateState = {
      taskName: builder.taskName || "",
      materialType: builder.defaultMaterialType || ((builder.materialTypes[0] || {}).key || "video"),
      priority: builder.defaultPriority || ((builder.priorityOptions[1] || builder.priorityOptions[0] || {}).key || "medium"),
      activeTab: (ensureList(builder.defaultAlgorithms)[0] || ""),
      selectedAlgorithms: ensureList(builder.defaultAlgorithms).slice(),
      selectedRecipients: ensureList(builder.defaultRecipients).slice(),
      selectedSpecKey: builder.defaultSpecKey || ((builder.resourceSpecs[0] || {}).key || ""),
      analysisTaskId: "",
      algorithmConfigs: {},
      modals: {
        algorithm: false,
        recipient: false,
        spec: false,
        localVideo: false
      },
      modalDraft: {
        algorithms: [],
        algorithmPendingChecked: [],
        algorithmSelectedChecked: [],
        recipients: [],
        recipientChecked: [],
        specKey: "",
        localVideoChecked: []
      }
    };
    syncOfflineSelectedAlgorithms(page.__offlineTaskCreateState, builder);

    return page.__offlineTaskCreateState;
  }

  function submitOfflineTask(runtime, page, state, builder, mode) {
    const validation = validateOfflineTaskSubmission(state, builder, mode);
    if (!validation.ok) {
      return Promise.resolve(validation);
    }

    return loadOfflineAnalysisSeed(page).then(function (seedPage) {
      const currentPage = runtime.mockStore && typeof runtime.mockStore.getPage === "function"
        ? runtime.mockStore.getPage(OFFLINE_ANALYSIS_PAGE_KEY, seedPage)
        : (seedPage || {});
      const taskPage = currentPage && currentPage.offlineTaskPage ? currentPage.offlineTaskPage : {};
      const rows = ensureList(taskPage.rows).slice();
      const existingIndex = rows.findIndex(function (row) {
        return row && row.id === state.analysisTaskId;
      });
      const existingRow = existingIndex === -1 ? null : rows[existingIndex];
      const row = buildOfflineAnalysisRow(state, builder, mode, existingRow);

      if (existingIndex !== -1) {
        rows.splice(existingIndex, 1);
      }
      rows.unshift(row);

      if (runtime.mockStore && typeof runtime.mockStore.patchPage === "function") {
        runtime.mockStore.patchPage(OFFLINE_ANALYSIS_PAGE_KEY, {
          offlineTaskPage: {
            rows: rows
          }
        }, seedPage);
      }

      state.analysisTaskId = row.id;
      persistOfflineTaskState(runtime, page, state);

      if (typeof runtime.navigateToRoute === "function") {
        runtime.navigateToRoute(OFFLINE_ANALYSIS_PAGE_KEY);
      }

      return { ok: true, row: row };
    });
  }

  function validateOfflineTaskSubmission(state, builder, mode) {
    const selectedAlgorithms = findByKeys(builder.algorithms, state.selectedAlgorithms);
    const materials = collectOfflineTaskMaterials(state, builder);

    if (!selectedAlgorithms.length) {
      return {
        ok: false,
        message: "请至少选择一个分析算法。"
      };
    }

    if (mode === "start" && !String(state.taskName || "").trim()) {
      return {
        ok: false,
        message: "请输入任务名称后再启动分析。"
      };
    }

    if (mode === "start" && !materials.length) {
      return {
        ok: false,
        message: "请先添加离线素材后再启动分析。"
      };
    }

    return { ok: true };
  }

  function buildOfflineAnalysisRow(state, builder, mode, existingRow) {
    const now = new Date();
    const materialType = state.materialType || builder.defaultMaterialType || "video";
    const selectedAlgorithms = findByKeys(builder.algorithms, state.selectedAlgorithms);
    const selectedRecipients = findByKeys(builder.recipients, state.selectedRecipients);
    const selectedSpec = findByKey(builder.resourceSpecs, state.selectedSpecKey);
    const algorithmConfigs = ensureOfflineAlgorithmConfigs(state, builder);
    const materials = collectOfflineTaskMaterials(state, builder);
    const taskName = String(state.taskName || "").trim() || buildOfflineDraftTaskName(now);

    return {
      id: existingRow && existingRow.id ? existingRow.id : buildOfflineTaskRecordId(now),
      batchNo: existingRow && existingRow.batchNo ? existingRow.batchNo : buildOfflineBatchNo(now),
      taskName: taskName,
      inputTypeLabel: resolveOfflineInputTypeLabel(materials),
      materialType: materialType,
      materialTypeLabel: resolveOfflineMaterialTypeLabel(builder, materialType),
      fileCount: formatOfflineTaskFileCount(materials.length, materialType),
      algorithms: selectedAlgorithms.map(function (item) {
        return item.label || item.name || "--";
      }).join(" / "),
      executionStatus: mode === "start" ? "running" : "pending",
      executionStatusTone: mode === "start" ? "success" : "warning",
      executionStatusLabel: mode === "start" ? "处理中" : "待启动",
      resultStatusTone: mode === "start" ? "success" : "idle",
      resultStatusLabel: mode === "start" ? "分析中" : "未开始",
      submittedAt: formatTimestamp(now),
      actionItems: buildOfflineAnalysisActionItems(mode),
      detail: buildOfflineAnalysisDetailSnapshot({
        state: state,
        builder: builder,
        mode: mode,
        materialType: materialType,
        taskName: taskName,
        selectedAlgorithms: selectedAlgorithms,
        selectedRecipients: selectedRecipients,
        selectedSpec: selectedSpec,
        algorithmConfigs: algorithmConfigs,
        materials: materials,
        submittedAt: formatTimestamp(now)
      })
    };
  }

  function buildOfflineAnalysisActionItems(mode) {
    if (mode === "start") {
      return [
        { label: "详情", className: "offline-action-link", toastTitle: "离线任务详情", toastMessage: "当前原型预留 {{batchNo}} 的详情入口。" },
        { label: "暂停", className: "offline-action-link", toastTitle: "暂停分析", toastMessage: "当前原型模拟暂停 {{batchNo}}。" },
        { label: "删除", className: "offline-action-link offline-action-link-danger", toastTitle: "删除任务", toastMessage: "当前原型模拟删除 {{batchNo}}。" }
      ];
    }

    return [
      { label: "详情", className: "offline-action-link", toastTitle: "离线任务详情", toastMessage: "当前原型预留 {{batchNo}} 的详情入口。" },
      { label: "启动", className: "offline-action-link offline-action-link-primary", toastTitle: "启动分析", toastMessage: "当前原型模拟启动 {{batchNo}}。" },
      { label: "删除", className: "offline-action-link offline-action-link-danger", toastTitle: "删除任务", toastMessage: "当前原型模拟删除 {{batchNo}}。" }
    ];
  }

  function buildOfflineAnalysisDetailSnapshot(context) {
    const state = context.state;
    const builder = context.builder;
    const selectedSpec = context.selectedSpec;
    const materials = ensureList(context.materials);
    const selectedRecipients = ensureList(context.selectedRecipients);
    const selectedAlgorithms = ensureList(context.selectedAlgorithms);
    const algorithmConfigs = context.algorithmConfigs || {};

    return {
      taskName: context.taskName,
      inputTypeLabel: resolveOfflineInputTypeLabel(materials),
      materialTypeLabel: resolveOfflineMaterialTypeLabel(builder, context.materialType),
      fileCount: formatOfflineTaskFileCount(materials.length, context.materialType),
      priorityLabel: resolveOfflinePriorityLabel(builder, state.priority),
      executionModeLabel: context.mode === "start" ? "立即启动" : "草稿保存",
      submittedAt: context.submittedAt,
      algorithmDetails: selectedAlgorithms.map(function (algorithm) {
        const config = algorithmConfigs[algorithm.key] || {};
        const algorithmMaterials = ensureList(config.materials);
        return {
          key: algorithm.key,
          label: algorithm.label || algorithm.name || "--",
          version: config.version || "V1.0",
          intervalLabel: normalizeOfflineInterval(config.interval || "5") + "秒",
          materialCountLabel: formatOfflineTaskFileCount(algorithmMaterials.length, context.materialType),
          materialNames: algorithmMaterials.slice(0, 6).map(function (item) {
            return item.name || "--";
          })
        };
      }),
      resourceSpec: selectedSpec ? {
        label: selectedSpec.label || "--",
        meta: selectedSpec.meta || "",
        vcpu: selectedSpec.vcpu || "--",
        memoryGB: selectedSpec.memoryGB || "--",
        gpu: selectedSpec.gpu || "--",
        gpuMemoryGB: selectedSpec.gpuMemoryGB || "--",
        diskGB: selectedSpec.diskGB || "--"
      } : null,
      recipients: selectedRecipients.map(function (recipient) {
        return {
          label: recipient.label || recipient.name || "--",
          url: recipient.url || "--",
          bindTask: recipient.bindTask || "--",
          status: recipient.status || "--"
        };
      }),
      materials: materials.map(function (item) {
        return {
          name: item.name || "--",
          sourceLabel: resolveOfflineMaterialSourceLabel(item),
          cover: item.cover || "--",
          duration: item.duration || "--",
          resolution: item.resolution || "--",
          size: item.size || "--",
          statusLabel: item.statusLabel || "--"
        };
      })
    };
  }

  function loadOfflineAnalysisSeed(page) {
    if (page.__offlineAnalysisSeedPromise) {
      return page.__offlineAnalysisSeedPromise;
    }

    if (typeof window.loadPrototypePage === "function") {
      page.__offlineAnalysisSeedPromise = Promise.resolve(window.loadPrototypePage(OFFLINE_ANALYSIS_PAGE_KEY)).then(function (seedPage) {
        return seedPage || {
          key: OFFLINE_ANALYSIS_PAGE_KEY,
          offlineTaskPage: { rows: [] }
        };
      }).catch(function () {
        return {
          key: OFFLINE_ANALYSIS_PAGE_KEY,
          offlineTaskPage: { rows: [] }
        };
      });
      return page.__offlineAnalysisSeedPromise;
    }

    page.__offlineAnalysisSeedPromise = Promise.resolve({
      key: OFFLINE_ANALYSIS_PAGE_KEY,
      offlineTaskPage: { rows: [] }
    });
    return page.__offlineAnalysisSeedPromise;
  }

  function normalizeOfflineBuilder(page) {
    const builder = page.offlineTaskBuilder || {};
    const baseAlgorithms = ensureList(builder.algorithms);
    const baseRecipients = ensureList(builder.recipients);
    const baseSpecs = ensureList(builder.resourceSpecs);

    builder.algorithms = baseAlgorithms.map(function (item, index) {
      if (typeof item === "string") {
        return {
          key: "algorithm-" + (index + 1),
          label: item,
          sourceType: "离线"
        };
      }
      return {
        key: item.key || ("algorithm-" + (index + 1)),
        label: item.label || item.name || ("算法" + (index + 1)),
        sourceType: item.sourceType || "离线"
      };
    });

    builder.recipients = baseRecipients.map(function (item, index) {
      if (typeof item === "string") {
        return {
          key: "recipient-" + (index + 1),
          label: item,
          name: item,
          status: "在线"
        };
      }
      return {
        key: item.key || ("recipient-" + (index + 1)),
        label: item.label || item.name || ("告警地址" + (index + 1)),
        name: item.name || item.label || ("告警地址" + (index + 1)),
        url: item.url || "",
        bindTask: item.bindTask || "",
        status: item.status || "在线"
      };
    });

    builder.resourceSpecs = baseSpecs.length
      ? baseSpecs.map(function (item, index) {
        return {
          key: item.key || ("spec-" + (index + 1)),
          id: item.id || "",
          label: item.label || item.name || ("规格" + (index + 1)),
          vcpu: item.vcpu || "",
          memoryGB: item.memoryGB || "",
          gpu: item.gpu || "",
          gpuMemoryGB: item.gpuMemoryGB || "",
          diskGB: item.diskGB || "",
          meta: item.meta || ""
        };
      })
      : (builder.specLabel ? [{
        key: "spec-offer-1",
        id: "123123",
        label: builder.specLabel,
        vcpu: "4",
        memoryGB: "8",
        gpu: "Nvidia A20",
        gpuMemoryGB: "1*24",
        diskGB: "500",
        meta: "默认离线规格"
      }] : []);

    const algorithmKeyMap = createLookupMap(builder.algorithms.map(function (item) {
      return item.key;
    }));
    if (!Array.isArray(builder.defaultAlgorithms)) {
      builder.defaultAlgorithms = [];
    }
    builder.defaultAlgorithms = uniqueList(builder.defaultAlgorithms).filter(function (key) {
      return !!algorithmKeyMap[key];
    });
    if (!builder.defaultAlgorithms.length) {
      builder.defaultAlgorithms = builder.algorithms.slice(0, 1).map(function (item) {
        return item.key;
      });
    }

    if (!Array.isArray(builder.defaultRecipients) || !builder.defaultRecipients.length) {
      builder.defaultRecipients = builder.recipients.slice(0, 2).map(function (item) {
        return item.key;
      });
    }

    if (!builder.defaultSpecKey) {
      builder.defaultSpecKey = (builder.resourceSpecs[0] || {}).key || "";
    }

    page.offlineTaskBuilder = builder;
    return builder;
  }

  function syncOfflineSelectedAlgorithms(state, builder) {
    const algorithmMap = createLookupMap(ensureList(builder.algorithms).map(function (item) {
      return item.key;
    }));
    state.selectedAlgorithms = uniqueList(state.selectedAlgorithms).filter(function (key) {
      return !!algorithmMap[key];
    });

    const tabs = resolveOfflineAlgorithmTabs(builder, state);
    if (!tabs.length) {
      state.activeTab = "";
      return;
    }

    if (!findByKey(tabs, state.activeTab)) {
      state.activeTab = tabs[0].key;
    }
  }

  function resolveOfflineAlgorithmTabs(builder, state) {
    const selectedAlgorithms = findByKeys(builder.algorithms, state.selectedAlgorithms);
    const configs = ensureOfflineAlgorithmConfigs(state, builder);

    return selectedAlgorithms.map(function (item) {
      const config = configs[item.key] || {};
      return {
        key: item.key,
        label: item.label || item.name || "--",
        version: config.version || "V1.0",
        interval: config.interval || "5",
        materials: ensureList(config.materials).slice()
      };
    });
  }

  function ensureOfflineAlgorithmConfigs(state, builder) {
    if (!state.algorithmConfigs || typeof state.algorithmConfigs !== "object") {
      state.algorithmConfigs = {};
    }

    ensureList(builder.algorithms).forEach(function (algorithm, index) {
      if (state.algorithmConfigs[algorithm.key]) {
        return;
      }

      const tabTemplate = resolveOfflineAlgorithmTabTemplate(builder, algorithm, index);
      state.algorithmConfigs[algorithm.key] = {
        version: tabTemplate.version || "V1.0",
        interval: tabTemplate.interval || "5",
        materials: ensureList(tabTemplate.materials).slice()
      };
    });

    return state.algorithmConfigs;
  }

  function collectOfflineTaskMaterials(state, builder) {
    const configs = ensureOfflineAlgorithmConfigs(state, builder);
    const lookup = {};
    const materials = [];

    ensureList(state.selectedAlgorithms).forEach(function (algorithmKey) {
      const config = configs[algorithmKey] || {};
      ensureList(config.materials).forEach(function (item) {
        const fingerprint = item && (item.fingerprint || item.key);
        if (!fingerprint || lookup[fingerprint]) {
          return;
        }
        lookup[fingerprint] = true;
        materials.push(item);
      });
    });

    return materials;
  }

  function resolveOfflineAlgorithmTabTemplate(builder, algorithm, index) {
    const tabs = ensureList(builder.tabs);
    return findByKey(tabs, algorithm.key) ||
      tabs.find(function (tab) {
        return tab && tab.label === algorithm.label;
      }) ||
      tabs[index] ||
      {};
  }

  function appendOfflineMaterialsFromFiles(state, builder, algorithmKey, files) {
    const configs = ensureOfflineAlgorithmConfigs(state, builder);
    const config = configs[algorithmKey] || {
      version: "V1.0",
      interval: "5",
      materials: []
    };
    configs[algorithmKey] = config;
    const materials = ensureList(config.materials);
    const existingMap = createLookupMap(materials.map(function (item) {
      return item.fingerprint;
    }));
    let added = 0;
    let skipped = 0;

    files.forEach(function (file) {
      const material = buildOfflineMaterialFromFile(file);
      if (!material || existingMap[material.fingerprint]) {
        skipped += 1;
        return;
      }
      existingMap[material.fingerprint] = true;
      materials.push(material);
      added += 1;
    });

    config.materials = materials;
    return { added: added, skipped: skipped };
  }

  function appendOfflineMaterialsFromLocalVideoRows(state, builder, algorithmKey, rows) {
    const configs = ensureOfflineAlgorithmConfigs(state, builder);
    const config = configs[algorithmKey] || {
      version: "V1.0",
      interval: "5",
      materials: []
    };
    configs[algorithmKey] = config;
    const materials = ensureList(config.materials);
    const existingMap = createLookupMap(materials.map(function (item) {
      return item.fingerprint;
    }));
    let added = 0;
    let skipped = 0;

    ensureList(rows).forEach(function (row) {
      getLocalVideoMediaFilesFromRow(row).forEach(function (mediaFile, index) {
        const material = buildOfflineMaterialFromLocalVideo(row, mediaFile, index);
        if (!material || existingMap[material.fingerprint]) {
          skipped += 1;
          return;
        }
        existingMap[material.fingerprint] = true;
        materials.push(material);
        added += 1;
      });
    });

    config.materials = materials;
    return { added: added, skipped: skipped };
  }

  function getOfflineLocalVideoRows(page, materialType) {
    return ensureList(page && page.__offlineLocalVideoRows).filter(function (row) {
      if (!row) {
        return false;
      }
      if (!materialType) {
        return true;
      }
      return (row.fileType || "video") === materialType;
    });
  }

  function loadOfflineLocalVideoRows(runtime, page) {
    return loadOfflineLocalVideoSeed(page).then(function (seedPage) {
      const currentPage = runtime.mockStore && typeof runtime.mockStore.getPage === "function"
        ? runtime.mockStore.getPage(LOCAL_VIDEO_PAGE_KEY, seedPage)
        : (seedPage || {});
      const rows = ensureList(currentPage && currentPage.offlineTaskPage && currentPage.offlineTaskPage.rows).slice();
      page.__offlineLocalVideoRows = rows;
      return rows;
    }).catch(function () {
      page.__offlineLocalVideoRows = [];
      return [];
    });
  }

  function loadOfflineLocalVideoSeed(page) {
    if (page.__offlineLocalVideoSeedPromise) {
      return page.__offlineLocalVideoSeedPromise;
    }

    if (typeof window.loadPrototypePage === "function") {
      page.__offlineLocalVideoSeedPromise = Promise.resolve(window.loadPrototypePage(LOCAL_VIDEO_PAGE_KEY)).then(function (seedPage) {
        return seedPage || {
          key: LOCAL_VIDEO_PAGE_KEY,
          offlineTaskPage: { rows: [] }
        };
      }).catch(function () {
        return {
          key: LOCAL_VIDEO_PAGE_KEY,
          offlineTaskPage: { rows: [] }
        };
      });
      return page.__offlineLocalVideoSeedPromise;
    }

    page.__offlineLocalVideoSeedPromise = Promise.resolve({
      key: LOCAL_VIDEO_PAGE_KEY,
      offlineTaskPage: { rows: [] }
    });
    return page.__offlineLocalVideoSeedPromise;
  }

  function syncUploadedFilesToLocalVideo(runtime, page, files) {
    const mediaFiles = ensureList(files).map(buildLocalVideoMediaFileFromFile).filter(Boolean);
    if (!mediaFiles.length) {
      return Promise.resolve({ added: 0, rows: ensureList(page.__offlineLocalVideoRows).slice() });
    }

    return loadOfflineLocalVideoSeed(page).then(function (seedPage) {
      const currentPage = runtime.mockStore && typeof runtime.mockStore.getPage === "function"
        ? runtime.mockStore.getPage(LOCAL_VIDEO_PAGE_KEY, seedPage)
        : (seedPage || {});
      const rows = ensureList(currentPage && currentPage.offlineTaskPage && currentPage.offlineTaskPage.rows).slice();
      const existingMap = {};
      rows.forEach(function (row) {
        if (row && row.uploadFingerprint) {
          existingMap[row.uploadFingerprint] = true;
        }
        getLocalVideoMediaFilesFromRow(row).forEach(function (item) {
          if (item.fingerprint) {
            existingMap[item.fingerprint] = true;
          }
        });
      });

      const createdAt = formatTimestamp(new Date());
      let added = 0;
      mediaFiles.forEach(function (mediaFile) {
        if (!mediaFile.fingerprint || existingMap[mediaFile.fingerprint]) {
          return;
        }
        existingMap[mediaFile.fingerprint] = true;
        rows.unshift(buildLocalVideoRowFromMediaFile(mediaFile, createdAt));
        added += 1;
      });

      if (runtime.mockStore && typeof runtime.mockStore.patchPage === "function") {
        runtime.mockStore.patchPage(LOCAL_VIDEO_PAGE_KEY, {
          offlineTaskPage: {
            rows: rows
          }
        }, seedPage);
      }

      page.__offlineLocalVideoRows = rows.slice();
      return { added: added, rows: rows };
    });
  }

  function buildLocalVideoMediaFileFromFile(file) {
    if (!file || !file.name) {
      return null;
    }

    const mimeType = String(file.type || "");
    const isVideo = mimeType.indexOf("video/") === 0;
    const isImage = mimeType.indexOf("image/") === 0;

    if (!isVideo && !isImage) {
      return null;
    }

    return {
      key: "local-media-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      name: file.name,
      kind: isImage ? "image" : "video",
      size: Number(file.size) || 0,
      sizeLabel: formatOfflineFileSize(file.size),
      duration: isVideo ? "待解析" : "--",
      resolution: "待解析",
      fingerprint: [file.name, file.size, file.lastModified].join("|")
    };
  }

  function buildLocalVideoRowFromMediaFile(mediaFile, createdAt) {
    const isImage = mediaFile.kind === "image";
    return {
      id: "local-video-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      recordName: stripFileExtension(mediaFile.name || (isImage ? "图片素材" : "视频素材")),
      fileType: isImage ? "image" : "video",
      fileTypeTone: isImage ? "file-image" : "file-video",
      fileTypeLabel: isImage ? "图片" : "视频",
      fileCount: "1",
      remark: LOCAL_VIDEO_SYNC_REMARK,
      createdAt: createdAt,
      uploadFingerprint: mediaFile.fingerprint,
      mediaFiles: [mediaFile],
      actionItems: [
        { label: "预览", className: "local-video-action local-video-action-preview" },
        { label: "删除", className: "local-video-action local-video-action-delete" }
      ]
    };
  }

  function getLocalVideoMediaFilesFromRow(row) {
    if (row && Array.isArray(row.mediaFiles) && row.mediaFiles.length) {
      return row.mediaFiles.map(function (item, index) {
        const kind = item && item.kind === "image" ? "image" : "video";
        return {
          key: item.key || ((row.id || "row") + "-media-" + index),
          name: item.name || row.recordName || "未命名文件",
          kind: kind,
          size: Number(item.size) || 0,
          sizeLabel: item.sizeLabel || formatOfflineFileSize(item.size),
          duration: item.duration || (kind === "video" ? "待解析" : "--"),
          resolution: item.resolution || "待解析",
          fingerprint: item.fingerprint || [row.id || "row", kind, index].join("|")
        };
      });
    }

    const count = Math.max(1, parseInt(row && row.fileCount, 10) || 0);
    const kind = row && row.fileType === "image" ? "image" : "video";
    const baseName = row && row.recordName ? row.recordName : (kind === "image" ? "图片素材" : "视频素材");
    const extension = kind === "image" ? ".jpg" : ".mp4";
    const list = [];

    for (var index = 0; index < count; index += 1) {
      list.push({
        key: (row && row.id || "row") + "-media-" + index,
        name: count === 1 ? baseName + extension : (baseName + "-" + (index + 1) + extension),
        kind: kind,
        size: 0,
        sizeLabel: "--",
        duration: kind === "video" ? "待解析" : "--",
        resolution: "待解析",
        fingerprint: ["local-video", row && row.id || "row", index].join("|")
      });
    }

    return list;
  }

  function buildOfflineMaterialFromLocalVideo(row, mediaFile, index) {
    if (!row || !mediaFile) {
      return null;
    }

    const isImage = mediaFile.kind === "image";
    return {
      key: "material-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      fingerprint: ["local-video", row.id || "row", mediaFile.fingerprint || index].join("|"),
      name: mediaFile.name || row.recordName || "未命名素材",
      cover: isImage ? "图片文件" : "本地视频",
      duration: isImage ? "--" : (mediaFile.duration || "待解析"),
      resolution: mediaFile.resolution || "待解析",
      size: mediaFile.sizeLabel || formatOfflineFileSize(mediaFile.size),
      statusTone: "success",
      statusLabel: "已选择"
    };
  }

  function stripFileExtension(filename) {
    const text = String(filename || "");
    const dotIndex = text.lastIndexOf(".");
    if (dotIndex <= 0) {
      return text;
    }
    return text.slice(0, dotIndex);
  }

  function formatTimestamp(date) {
    const value = date instanceof Date ? date : new Date();
    return value.getFullYear() + "-" +
      padNumber(value.getMonth() + 1) + "-" +
      padNumber(value.getDate()) + " " +
      padNumber(value.getHours()) + ":" +
      padNumber(value.getMinutes()) + ":" +
      padNumber(value.getSeconds());
  }

  function padNumber(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function buildOfflineMaterialFromFile(file) {
    if (!file || !file.name) {
      return null;
    }

    const extension = getFileExtension(file.name);
    const archiveExtensions = createLookupMap(["zip", "rar", "7z", "tar", "gz", "bz2", "xz"]);
    const isArchive = !!archiveExtensions[extension];
    const isVideo = (file.type || "").indexOf("video/") === 0;
    const isImage = (file.type || "").indexOf("image/") === 0;

    if (!isArchive && !isVideo && !isImage) {
      return null;
    }

    const fingerprint = [file.name, file.size, file.lastModified].join("|");
    return {
      key: "material-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      fingerprint: fingerprint,
      name: file.name,
      cover: isImage ? "图片文件" : (isArchive ? "压缩包" : "视频文件"),
      duration: isVideo ? "待解析" : "--",
      resolution: isArchive ? "--" : "待解析",
      size: formatOfflineFileSize(file.size),
      statusTone: "success",
      statusLabel: isArchive ? "已上传(待解压)" : "已上传"
    };
  }

  function getFileExtension(filename) {
    const text = String(filename || "");
    const dotIndex = text.lastIndexOf(".");
    if (dotIndex === -1 || dotIndex === text.length - 1) {
      return "";
    }
    return text.slice(dotIndex + 1).toLowerCase();
  }

  function formatOfflineFileSize(size) {
    const bytes = Number(size) || 0;
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }
    return bytes + " B";
  }

  function normalizeOfflineInterval(value) {
    const text = String(value || "").replace(/[^\d]/g, "");
    return text || "1";
  }

  function resolveOfflineInputTypeLabel(materials) {
    const hasLocalVideo = ensureList(materials).some(function (item) {
      return String(item && item.fingerprint || "").indexOf("local-video|") === 0;
    });
    const hasUpload = ensureList(materials).some(function (item) {
      return String(item && item.fingerprint || "").indexOf("local-video|") !== 0;
    });

    if (hasLocalVideo && hasUpload) {
      return "混合导入";
    }
    if (hasLocalVideo) {
      return "从本地视频选择";
    }
    return "本地上传";
  }

  function resolveOfflineMaterialSourceLabel(material) {
    if (String(material && material.fingerprint || "").indexOf("local-video|") === 0) {
      return "本地视频";
    }
    return "本地上传";
  }

  function resolveOfflineMaterialTypeLabel(builder, materialType) {
    const option = findByKey(builder.materialTypes, materialType);
    return option && option.label ? option.label : (materialType === "image" ? "图片" : "视频");
  }

  function resolveOfflinePriorityLabel(builder, priorityKey) {
    const option = findByKey(builder.priorityOptions, priorityKey);
    return option && option.label ? option.label : "--";
  }

  function formatOfflineTaskFileCount(count, materialType) {
    const total = Math.max(0, Number(count) || 0);
    if (materialType === "image") {
      return total + "张";
    }
    return total + "个文件";
  }

  function buildOfflineDraftTaskName(date) {
    return "离线分析草稿-" + formatCompactTimestamp(date);
  }

  function buildOfflineTaskRecordId(date) {
    return "offline-" + formatCompactTimestamp(date) + "-" + Math.floor(Math.random() * 1000);
  }

  function buildOfflineBatchNo(date) {
    return "OFF-" + formatDateToken(date) + "-" + formatTimeToken(date);
  }

  function formatCompactTimestamp(date) {
    const value = date instanceof Date ? date : new Date();
    return formatDateToken(value) + formatTimeToken(value);
  }

  function formatDateToken(date) {
    const value = date instanceof Date ? date : new Date();
    return value.getFullYear() + padNumber(value.getMonth() + 1) + padNumber(value.getDate());
  }

  function formatTimeToken(date) {
    const value = date instanceof Date ? date : new Date();
    return padNumber(value.getHours()) + padNumber(value.getMinutes()) + padNumber(value.getSeconds());
  }

  function persistOfflineTaskState(runtime, page, state) {
    if (!runtime || !runtime.mockStore || typeof runtime.mockStore.patchPage !== "function" || !page) {
      return;
    }

    runtime.mockStore.patchPage(page.key, {
      __offlineTaskCreateState: state
    }, page);
  }

  function scrollToOfflineMaterials(root) {
    if (!root || typeof root.querySelector !== "function") {
      return;
    }

    const materialTable = root.querySelector(".offline-material-table-wrap");
    if (!materialTable || typeof materialTable.scrollIntoView !== "function") {
      return;
    }

    materialTable.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function syncOfflineBreadcrumb(runtime) {
    const page = runtime && runtime.page;
    if (!page) {
      return;
    }

    page.heading = HEADING_TEXT;
    page.breadcrumbTrail = BREADCRUMB_TRAIL.slice();

    const sectionNode = document.querySelector(".page-breadcrumb-section");
    const currentNode = document.querySelector(".page-breadcrumb-current");
    if (sectionNode) {
      sectionNode.textContent = BREADCRUMB_TRAIL[0];
    }
    if (currentNode) {
      currentNode.textContent = HEADING_TEXT;
    }

    if (runtime.mockStore && typeof runtime.mockStore.patchPage === "function") {
      runtime.mockStore.patchPage(page.key, {
        heading: HEADING_TEXT,
        breadcrumbTrail: BREADCRUMB_TRAIL
      }, page);
    }
  }

  function findByKey(list, key) {
    return ensureList(list).find(function (item) {
      return item.key === key;
    }) || null;
  }

  function findByKeys(list, keys) {
    const lookup = {};
    ensureList(list).forEach(function (item) {
      lookup[item.key] = item;
    });
    return ensureList(keys).map(function (key) {
      return lookup[key];
    }).filter(Boolean);
  }

  function createLookupMap(list) {
    const lookup = {};
    ensureList(list).forEach(function (item) {
      if (item != null) {
        lookup[item] = true;
      }
    });
    return lookup;
  }

  function toggleValue(list, value) {
    const index = list.indexOf(value);
    if (index === -1) {
      list.push(value);
    } else {
      list.splice(index, 1);
    }
  }

  function uniqueList(list) {
    const map = {};
    const next = [];
    ensureList(list).forEach(function (item) {
      if (item == null || map[item]) {
        return;
      }
      map[item] = true;
      next.push(item);
    });
    return next;
  }

  function ensureList(value) {
    return Array.isArray(value) ? value : [];
  }
})();
