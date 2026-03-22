(function () {
  const utils = window.PROTOTYPE_UTILS;
  const shell = window.PROTOTYPE_SHELL;

  window.PROTOTYPE_DASHBOARD = {
    renderDashboardPage: renderDashboardPage,
    bindTaskCreatePage: bindTaskCreatePage,
    bindOfflineTaskCreatePage: bindOfflineTaskCreatePage
  };

  function renderDashboardPage(context, page) {
    if (page.dashboardVariant === "offline-task-create") {
      return renderOfflineTaskCreatePage(page);
    }

    if (page.dashboardVariant === "stream-task-create") {
      return renderTaskCreatePage(page);
    }

    let sections = "";

    if (page.highlightsPanel) {
      sections += renderHighlightsPanel(shell.panelHeaderContext(context, page.highlightsPanel), page.highlightsPanel);
    }

    if (page.chartPanel) {
      sections += renderChartPanel(shell.panelHeaderContext(context, page.chartPanel), page.chartPanel);
    }

    if (page.previewTablePanel) {
      sections += renderPreviewTablePanel(shell.panelHeaderContext(context, page.previewTablePanel), page.previewTablePanel);
    }

    if (page.formPanel || page.assistPanel) {
      sections +=
        '<section class="two-column">' +
        (page.formPanel ? renderFormPanel(shell.panelHeaderContext(context, page.formPanel), page.formPanel) : "") +
        (page.assistPanel ? renderAssistPanel(shell.panelHeaderContext(context, page.assistPanel), page.assistPanel) : "") +
        "</section>";
    }

    if (page.systemPanel || page.onlinePanel) {
      sections +=
        '<section class="two-column">' +
        (page.systemPanel ? renderKeyValuePanel(shell.panelHeaderContext(context, page.systemPanel), page.systemPanel) : "") +
        (page.onlinePanel ? renderOnlinePanel(shell.panelHeaderContext(context, page.onlinePanel), page.onlinePanel) : "") +
        "</section>";
    }

    if (page.servicePanel || page.quickLinksPanel) {
      sections +=
        '<section class="two-column">' +
        (page.servicePanel ? renderStatusStatsPanel(shell.panelHeaderContext(context, page.servicePanel), page.servicePanel) : "") +
        (page.quickLinksPanel ? renderQuickLinksPanel(shell.panelHeaderContext(context, page.quickLinksPanel), page.quickLinksPanel) : "") +
        "</section>";
    }

    if (page.alertsPanel || page.timelinePanel) {
      sections +=
        '<section class="two-column">' +
        (page.alertsPanel ? renderAlertsPanel(shell.panelHeaderContext(context, page.alertsPanel), page.alertsPanel) : "") +
        (page.timelinePanel ? renderTimelinePanel(shell.panelHeaderContext(context, page.timelinePanel), page.timelinePanel) : "") +
        "</section>";
    }

    return sections;
  }

  function bindTaskCreatePage(runtime) {
    const page = runtime && runtime.page;
    if (!page || page.dashboardVariant !== "stream-task-create") {
      return null;
    }

    const container = runtime.mountNode ? runtime.mountNode.querySelector(".content-grid") : null;
    if (!container) {
      return null;
    }

    ensureTaskCreateState(page);
    const showToast = runtime && typeof runtime.showToast === "function"
      ? runtime.showToast
      : function () {};

    function rerender() {
      container.innerHTML = renderTaskCreatePage(page);
    }

    function closeModal(modalKey) {
      const state = ensureTaskCreateState(page);
      if (modalKey === "algorithm") {
        state.algorithmModal.open = false;
      }
      if (modalKey === "address") {
        state.addressModal.open = false;
      }
      if (modalKey === "node") {
        state.nodeModal.open = false;
      }
      if (modalKey === "spec") {
        state.specModal.open = false;
      }
      if (modalKey === "address-editor") {
        state.addressEditor.open = false;
        state.addressEditor.draft = null;
        state.addressEditor.mode = "create";
        state.addressEditor.key = "";
      }
      if (modalKey === "schedule") {
        state.scheduleModal.open = false;
      }
      if (modalKey === "point-picker") {
        state.pointPicker.open = false;
      }
      if (modalKey === "point-preview") {
        state.pointPreview.streamId = "";
      }
      if (modalKey === "point-editor") {
        state.pointEditor.open = false;
        state.pointEditor.streamId = "";
        state.pointEditor.draft = null;
      }
      if (modalKey === "custom-payload") {
        state.customPayload.open = false;
        state.customPayload.draft = null;
      }
    }

    function handleClick(event) {
      const target = event.target.closest(
        "[data-task-action], [data-task-validity], [data-task-priority], [data-task-tab], [data-task-clip-toggle], " +
        "[data-task-modal-close], [data-task-algo-panel], [data-task-algo-move], [data-task-algo-save], " +
        "[data-task-address-row-toggle], [data-task-address-save], [data-task-node-tab], [data-task-node-row-toggle], " +
        "[data-task-node-save], [data-task-spec-row-toggle], [data-task-spec-save], [data-task-schedule-plan], [data-task-schedule-save], " +
        "[data-task-point-row-toggle], [data-task-point-save], [data-task-point-edit-save]"
      );
      if (!target) {
        return;
      }

      const state = ensureTaskCreateState(page);
      const draft = state.draft;
      const builder = page.taskBuilder || {};

      if (target.hasAttribute("data-task-action")) {
        const action = target.getAttribute("data-task-action");

        if (action === "algorithm-open") {
          state.algorithmModal.open = true;
          state.algorithmModal.selection = draft.selectedAlgorithms.slice();
          state.algorithmModal.availableChecked = [];
          state.algorithmModal.selectedChecked = [];
          rerender();
          return;
        }

        if (action === "algorithm-clear") {
          draft.selectedAlgorithms = [];
          draft.activeAlgorithmKey = "";
          rerender();
          return;
        }

        if (action === "algorithm-remove") {
          const key = target.getAttribute("data-task-key");
          draft.selectedAlgorithms = draft.selectedAlgorithms.filter(function (item) {
            return item !== key;
          });
          if (draft.activeAlgorithmKey === key) {
            draft.activeAlgorithmKey = draft.selectedAlgorithms[0] || "";
          }
          rerender();
          return;
        }

        if (action === "address-open") {
          state.addressModal.open = true;
          state.addressModal.selection = draft.recipients.slice();
          rerender();
          return;
        }

        if (action === "recipient-remove") {
          const key = target.getAttribute("data-task-key");
          draft.recipients = draft.recipients.filter(function (item) {
            return item !== key;
          });
          rerender();
          return;
        }

        if (action === "node-open") {
          state.nodeModal.open = true;
          state.nodeModal.selection = draft.nodeKeys.slice();
          state.nodeModal.tab = state.nodeModal.tab || ((ensureList(builder.nodeTabs)[0] || {}).key || "service");
          rerender();
          return;
        }

        if (action === "node-remove") {
          const key = target.getAttribute("data-task-key");
          draft.nodeKeys = draft.nodeKeys.filter(function (item) {
            return item !== key;
          });
          rerender();
          return;
        }

        if (action === "spec-open") {
          state.specModal.open = true;
          state.specModal.selection = draft.specKey || "";
          rerender();
          return;
        }

        if (action === "spec-clear") {
          draft.specKey = "";
          rerender();
          return;
        }

        if (action === "address-new") {
          state.addressEditor.open = true;
          state.addressEditor.mode = "create";
          state.addressEditor.key = "";
          state.addressEditor.draft = createTaskAddressDraft();
          rerender();
          return;
        }

        if (action === "address-edit") {
          const key = target.getAttribute("data-task-key");
          const address = findTaskBuilderItem(builder.alarmRecipients, key);
          if (!address) {
            showToast("地址不存在", "当前地址数据未找到。");
            return;
          }
          state.addressEditor.open = true;
          state.addressEditor.mode = "edit";
          state.addressEditor.key = key;
          state.addressEditor.draft = createTaskAddressDraft(address);
          rerender();
          return;
        }

        if (action === "address-delete") {
          const key = target.getAttribute("data-task-key");
          builder.alarmRecipients = ensureList(builder.alarmRecipients).filter(function (item) {
            return item.key !== key;
          });
          draft.recipients = draft.recipients.filter(function (item) {
            return item !== key;
          });
          state.addressModal.selection = state.addressModal.selection.filter(function (item) {
            return item !== key;
          });
          showToast("删除成功", "已从地址列表中移除当前地址。");
          rerender();
          return;
        }

        if (action === "address-test") {
          showToast("测试成功", "当前原型模拟地址联通成功。");
          return;
        }

        if (action === "address-content-toggle") {
          const key = target.getAttribute("data-task-key");
          const addressDraft = state.addressEditor.draft;
          if (!addressDraft) {
            return;
          }
          const exists = addressDraft.contents.indexOf(key);
          if (exists === -1) {
            addressDraft.contents.push(key);
          } else {
            addressDraft.contents.splice(exists, 1);
          }
          rerender();
          return;
        }

        if (action === "address-custom-payload-open") {
          const addressDraft = state.addressEditor.draft;
          if (!addressDraft) {
            return;
          }
          state.customPayload.open = true;
          state.customPayload.draft = createTaskCustomPayloadDraft(addressDraft.customPayload);
          rerender();
          return;
        }

        if (action === "address-form-save") {
          const editorDraft = state.addressEditor.draft;
          if (!editorDraft || !editorDraft.name || !editorDraft.url) {
            showToast("信息不完整", "推送名称和推送地址不能为空。");
            return;
          }

          if (state.addressEditor.mode === "edit" && state.addressEditor.key) {
            builder.alarmRecipients = ensureList(builder.alarmRecipients).map(function (item) {
              return item.key === state.addressEditor.key ? Object.assign({}, item, editorDraft, { label: editorDraft.name }) : item;
            });
          } else {
            const nextKey = "addr-" + Date.now();
            builder.alarmRecipients = ensureList(builder.alarmRecipients).concat([
              Object.assign({}, editorDraft, { key: nextKey, label: editorDraft.name, status: editorDraft.status || "在线" })
            ]);
          }

          closeModal("address-editor");
          rerender();
          return;
        }

        if (action === "custom-payload-save") {
          if (state.addressEditor.draft && state.customPayload.draft) {
            state.addressEditor.draft.customPayload = Object.assign({}, state.customPayload.draft);
          }
          closeModal("custom-payload");
          rerender();
          return;
        }

        if (action === "schedule-open") {
          const key = target.getAttribute("data-task-key") || draft.activeAlgorithmKey;
          const algorithmConfig = getTaskAlgorithmConfig(page, key);
          state.scheduleModal.open = true;
          state.scheduleModal.algorithmKey = key;
          state.scheduleModal.planKey = algorithmConfig.scheduleKey;
          rerender();
          return;
        }

        if (action === "temporal-toggle") {
          const key = target.getAttribute("data-task-key") || draft.activeAlgorithmKey;
          const algorithmConfig = getTaskAlgorithmConfig(page, key);
          algorithmConfig.temporalEnabled = !algorithmConfig.temporalEnabled;
          rerender();
          return;
        }

        if (action === "point-open") {
          state.pointPicker.open = true;
          state.pointPicker.selection = [];
          state.pointPicker.keyword = "";
          rerender();
          return;
        }

        if (action === "point-preview") {
          state.pointPreview.streamId = target.getAttribute("data-task-key") || "";
          rerender();
          return;
        }

        if (action === "point-edit") {
          const key = target.getAttribute("data-task-key");
          const point = findTaskPointById(page, key);
          if (!point) {
            showToast("点位不存在", "当前点位数据未找到。");
            return;
          }
          state.pointEditor.open = true;
          state.pointEditor.streamId = key;
          state.pointEditor.draft = createTaskPointDraft(point);
          rerender();
          return;
        }

        if (action === "point-delete") {
          const key = target.getAttribute("data-task-key");
          state.taskPoints = ensureList(state.taskPoints).filter(function (item) {
            return item.id !== key;
          });
          rerender();
          return;
        }

        if (action === "point-filter-toggle") {
          if (state.pointEditor.draft) {
            state.pointEditor.draft.alertFilterEnabled = !state.pointEditor.draft.alertFilterEnabled;
            rerender();
          }
          return;
        }

        if (action === "point-roi-mode") {
          if (state.pointEditor.draft) {
            state.pointEditor.draft.roiMode = target.getAttribute("data-task-key") || "default";
            rerender();
          }
          return;
        }
      }

      if (target.hasAttribute("data-task-validity")) {
        draft.validityType = target.getAttribute("data-task-validity") || "custom";
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-priority")) {
        draft.priority = target.getAttribute("data-task-priority") || draft.priority;
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-tab")) {
        draft.activeAlgorithmKey = target.getAttribute("data-task-tab") || "";
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-clip-toggle")) {
        draft.clipEnabled = !draft.clipEnabled;
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-modal-close")) {
        closeModal(target.getAttribute("data-task-modal-close"));
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-algo-panel")) {
        const panel = target.getAttribute("data-task-algo-panel");
        const key = target.getAttribute("data-task-key");
        const listKey = panel === "selected" ? "selectedChecked" : "availableChecked";
        const list = state.algorithmModal[listKey];
        const index = list.indexOf(key);

        if (index === -1) {
          list.push(key);
        } else {
          list.splice(index, 1);
        }

        rerender();
        return;
      }

      if (target.hasAttribute("data-task-algo-move")) {
        const direction = target.getAttribute("data-task-algo-move");

        if (direction === "add") {
          state.algorithmModal.availableChecked.forEach(function (key) {
            if (state.algorithmModal.selection.indexOf(key) === -1) {
              state.algorithmModal.selection.push(key);
            }
          });
          state.algorithmModal.availableChecked = [];
        }

        if (direction === "remove") {
          state.algorithmModal.selection = state.algorithmModal.selection.filter(function (key) {
            return state.algorithmModal.selectedChecked.indexOf(key) === -1;
          });
          state.algorithmModal.selectedChecked = [];
        }

        rerender();
        return;
      }

      if (target.hasAttribute("data-task-algo-save")) {
        draft.selectedAlgorithms = state.algorithmModal.selection.slice();
        if (draft.selectedAlgorithms.indexOf(draft.activeAlgorithmKey) === -1) {
          draft.activeAlgorithmKey = draft.selectedAlgorithms[0] || "";
        }
        closeModal("algorithm");
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-address-row-toggle")) {
        const key = target.getAttribute("data-task-address-row-toggle");
        const index = state.addressModal.selection.indexOf(key);

        if (index === -1) {
          state.addressModal.selection.push(key);
        } else {
          state.addressModal.selection.splice(index, 1);
        }

        rerender();
        return;
      }

      if (target.hasAttribute("data-task-address-save")) {
        draft.recipients = state.addressModal.selection.slice();
        closeModal("address");
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-node-tab")) {
        state.nodeModal.tab = target.getAttribute("data-task-node-tab") || state.nodeModal.tab;
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-node-row-toggle")) {
        const key = target.getAttribute("data-task-node-row-toggle");
        const index = state.nodeModal.selection.indexOf(key);

        if (index === -1) {
          state.nodeModal.selection.push(key);
        } else {
          state.nodeModal.selection.splice(index, 1);
        }

        rerender();
        return;
      }

      if (target.hasAttribute("data-task-node-save")) {
        draft.nodeKeys = state.nodeModal.selection.slice();
        closeModal("node");
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-spec-row-toggle")) {
        state.specModal.selection = target.getAttribute("data-task-spec-row-toggle") || "";
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-spec-save")) {
        draft.specKey = state.specModal.selection || "";
        closeModal("spec");
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-schedule-plan")) {
        state.scheduleModal.planKey = target.getAttribute("data-task-schedule-plan") || state.scheduleModal.planKey;
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-schedule-save")) {
        const algorithmConfig = getTaskAlgorithmConfig(page, state.scheduleModal.algorithmKey || draft.activeAlgorithmKey);
        algorithmConfig.scheduleKey = state.scheduleModal.planKey || algorithmConfig.scheduleKey;
        closeModal("schedule");
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-point-row-toggle")) {
        const key = target.getAttribute("data-task-point-row-toggle");
        const index = state.pointPicker.selection.indexOf(key);
        if (index === -1) {
          state.pointPicker.selection.push(key);
        } else {
          state.pointPicker.selection.splice(index, 1);
        }
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-point-save")) {
        const existing = {};
        ensureList(state.taskPoints).forEach(function (item) {
          existing[item.id] = true;
        });
        ensureList(state.pointCatalog).forEach(function (item) {
          if (state.pointPicker.selection.indexOf(item.id) !== -1 && !existing[item.id]) {
            state.taskPoints.push(createTaskPointDraft(item));
          }
        });
        closeModal("point-picker");
        rerender();
        return;
      }

      if (target.hasAttribute("data-task-point-edit-save")) {
        const key = state.pointEditor.streamId;
        if (state.pointEditor.draft) {
          state.pointEditor.draft.algorithmThreshold = [
            state.pointEditor.draft.confidenceThreshold || "0.4",
            state.pointEditor.draft.abnormalityThreshold || "0.3",
            state.pointEditor.draft.similarityThreshold || "0.5"
          ].join(",");
          state.pointEditor.draft.roiLabel = state.pointEditor.draft.roiMode === "custom" ? "自定义" : "默认";
        }
        state.taskPoints = ensureList(state.taskPoints).map(function (item) {
          return item.id === key ? Object.assign({}, item, state.pointEditor.draft) : item;
        });
        closeModal("point-editor");
        rerender();
      }
    }

    function handleInput(event) {
      const target = event.target;
      if (!target || !target.getAttribute) {
        return;
      }

      const field = target.getAttribute("data-task-field");
      const state = ensureTaskCreateState(page);
      const draft = state.draft;

      let shouldRerender = false;

      if (field) {
        if (field === "taskName") {
          draft.taskName = target.value || "";
        }

        if (field === "startDate") {
          draft.startDate = target.value || "";
        }

        if (field === "endDate") {
          draft.endDate = target.value || "";
        }
      }

      const algorithmField = target.getAttribute("data-task-algo-field");
      if (algorithmField) {
        const algorithmKey = target.getAttribute("data-task-key") || draft.activeAlgorithmKey;
        const algorithmConfig = getTaskAlgorithmConfig(page, algorithmKey);
        if (algorithmField === "version") {
          algorithmConfig.version = target.value || algorithmConfig.version;
        }
        if (algorithmField === "interval") {
          algorithmConfig.interval = target.value || algorithmConfig.interval;
        }
        if (algorithmField === "unit") {
          algorithmConfig.unit = target.value || algorithmConfig.unit;
        }
      }

      const addressField = target.getAttribute("data-task-address-field");
      if (addressField && state.addressEditor.draft) {
        state.addressEditor.draft[addressField] = target.value || "";
      }

      const customPayloadField = target.getAttribute("data-task-custom-payload-field");
      if (customPayloadField && state.customPayload.draft) {
        state.customPayload.draft[customPayloadField] = target.value || "";
      }

      const pointField = target.getAttribute("data-task-point-field");
      if (pointField && state.pointEditor.draft) {
        state.pointEditor.draft[pointField] = target.value || "";
      }

      if (target.hasAttribute("data-task-point-search")) {
        state.pointPicker.keyword = target.value || "";
        shouldRerender = true;
      }

      if (shouldRerender) {
        rerender();
      }
    }

    container.addEventListener("click", handleClick);
    container.addEventListener("input", handleInput);
    container.addEventListener("change", handleInput);
    rerender();

    return function cleanup() {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("input", handleInput);
      container.removeEventListener("change", handleInput);
    };
  }

  function renderTaskCreatePage(page) {
    const builder = page.taskBuilder || {};
    const state = ensureTaskCreateState(page);
    const draft = state.draft;
    const selectedAlgorithms = findTaskBuilderItems(builder.algorithms, draft.selectedAlgorithms);
    const activeAlgorithm = selectedAlgorithms.find(function (item) {
      return item.key === draft.activeAlgorithmKey;
    }) || selectedAlgorithms[0] || null;

    return (
      '<section class="task-create-page">' +
      '<section class="panel task-create-panel">' +
      '<div class="task-create-grid">' +
      renderTaskCreateField("任务名称", true, '<input class="source-form-control task-create-name" type="text" data-task-field="taskName" value="' + utils.escapeAttribute(draft.taskName) + '" placeholder="请输入任务名称" />') +
      renderTaskCreateField("分析算法", false, renderTaskAlgorithmSelector(builder, draft), true) +
      renderTaskCreateField("分析有效期", false, renderTaskValiditySelector(draft), true) +
      renderTaskCreateField("分析优先级", false, renderTaskPrioritySelector(builder, draft), true) +
      renderTaskCreateField("告警推送", false, renderTaskRecipientSelector(builder, draft), true) +
      (builder.showClipToggle === false ? "" : renderTaskCreateField("告警视频片段", false, renderTaskClipToggle(draft), true)) +
      (builder.showNodeSelector === false ? "" : renderTaskCreateField("计算节点", false, renderTaskNodeSelector(builder, draft), true)) +
      (builder.showSpecSelector === false ? "" : renderTaskCreateField("计算资源配置", false, renderTaskSpecSelector(builder, draft), true)) +
      "</div>" +
      '<section class="task-builder-stage">' +
      renderTaskBuilderTabs(selectedAlgorithms, draft.activeAlgorithmKey) +
      (activeAlgorithm ? renderTaskBuilderBody(page, builder, activeAlgorithm) : '<div class="empty-state task-builder-empty">请至少选择一个分析算法。</div>') +
      "</section>" +
      '<div class="task-create-actions">' +
      '<button class="button-secondary" type="button" data-route="' + utils.escapeAttribute(builder.listPageKey || "stream-analysis") + '">返回</button>' +
      '<button class="button-secondary" type="button" data-toast-title="保存" data-toast-message="当前原型保留保存入口。">保存</button>' +
      '<button class="button" type="button" data-toast-title="提交" data-toast-message="当前原型保留提交入口。">提交</button>' +
      "</div>" +
      renderTaskAlgorithmModal(page, state) +
      renderTaskAddressModal(page, state) +
      renderTaskAddressEditorModal(page, state) +
      renderTaskCustomPayloadModal(state) +
      renderTaskNodeModal(page, state) +
      renderTaskSpecModal(page, state) +
      renderTaskScheduleModal(page, state) +
      renderTaskPointPickerModal(page, state) +
      renderTaskPointPreviewModal(page, state) +
      renderTaskPointEditorModal(page, state) +
      "</section>" +
      "</section>"
    );
  }

  function bindOfflineTaskCreatePage(runtime) {
    const page = runtime && runtime.page;
    if (!page || page.dashboardVariant !== "offline-task-create") {
      return null;
    }

    const container = runtime.mountNode ? runtime.mountNode.querySelector(".content-grid") : null;
    if (!container) {
      return null;
    }

    ensureOfflineTaskCreateState(page);

    function rerender() {
      container.innerHTML = renderOfflineTaskCreatePage(page);
    }

    function handleClick(event) {
      const target = event.target.closest("[data-offline-material],[data-offline-priority],[data-offline-tab]");
      if (!target) {
        return;
      }

      const state = ensureOfflineTaskCreateState(page);

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
        state.activeTab = target.getAttribute("data-offline-tab") || state.activeTab;
        rerender();
      }
    }

    container.addEventListener("click", handleClick);
    rerender();

    return function cleanup() {
      container.removeEventListener("click", handleClick);
    };
  }

  function renderTaskCreateField(label, required, content, fullWidth) {
    return (
      '<div class="task-create-field' + (fullWidth ? ' full-width' : '') + '">' +
      '<div class="task-create-label">' + utils.escapeHtml(label) + (required ? '<em>*</em>' : '') + '</div>' +
      '<div class="task-create-value">' + content + '</div>' +
      '</div>'
    );
  }

  function renderTaskAlgorithmSelector(builder, draft) {
    const selected = findTaskBuilderItems(builder.algorithms, draft.selectedAlgorithms);
    return (
      '<div class="task-choice-wrap">' +
      '<div class="task-choice-helper"><button class="button-link" type="button" data-task-action="algorithm-open">选择算法</button><button class="button-link" type="button" data-task-action="algorithm-clear">清空选择</button></div>' +
      renderTaskChipList(selected, '尚未选择分析算法', 'algorithm-remove') +
      '</div>'
    );
  }

  function renderTaskValiditySelector(draft) {
    return (
      '<div class="task-inline-row">' +
      renderTaskRadio('长期', draft.validityType === 'permanent', 'data-task-validity', 'permanent') +
      renderTaskRadio('自定义', draft.validityType === 'custom', 'data-task-validity', 'custom') +
      '<div class="task-date-range' + (draft.validityType === 'custom' ? ' enabled' : '') + '">' +
      '<input class="source-form-control" type="date" data-task-field="startDate" value="' + utils.escapeAttribute(draft.startDate) + '"' + (draft.validityType === 'custom' ? '' : ' disabled') + ' />' +
      '<span>~</span>' +
      '<input class="source-form-control" type="date" data-task-field="endDate" value="' + utils.escapeAttribute(draft.endDate) + '"' + (draft.validityType === 'custom' ? '' : ' disabled') + ' />' +
      '</div>' +
      '</div>'
    );
  }

  function renderTaskPrioritySelector(builder, draft) {
    return (
      '<div class="task-inline-row">' +
      ensureList(builder.priorityOptions).map(function (item) {
        return renderTaskRadio(item.label, draft.priority === item.key, 'data-task-priority', item.key);
      }).join('') +
      '</div>'
    );
  }

  function renderTaskRecipientSelector(builder, draft) {
    const selected = findTaskBuilderItems(builder.alarmRecipients, draft.recipients);
    return (
      '<div class="task-choice-wrap">' +
      '<div class="task-choice-helper"><button class="button-link" type="button" data-task-action="address-open">选择地址</button></div>' +
      renderTaskChipList(selected, '尚未选择推送地址', 'recipient-remove', true) +
      '</div>'
    );
  }

  function renderTaskClipToggle(draft) {
    return (
      '<button class="task-switch' + (draft.clipEnabled ? ' on' : '') + '" type="button" data-task-clip-toggle="true">' +
      '<span class="task-switch-handle"></span>' +
      '</button>'
    );
  }

  function renderTaskNodeSelector(builder, draft) {
    const selected = findTaskBuilderItems(builder.nodePools, draft.nodeKeys);
    return (
      '<div class="task-choice-wrap">' +
      '<div class="task-choice-helper"><button class="button-link" type="button" data-task-action="node-open">选择节点</button></div>' +
      renderTaskChipList(selected, '尚未选择计算节点', 'node-remove', true) +
      '</div>'
    );
  }

  function renderTaskSpecSelector(builder, draft) {
    const selected = findTaskBuilderItem(builder.resourceSpecs, draft.specKey);
    return (
      '<div class="task-choice-wrap">' +
      '<div class="task-choice-helper"><button class="button-link" type="button" data-task-action="spec-open">选择规格</button><button class="button-link" type="button" data-task-action="spec-clear">清空选择</button></div>' +
      renderTaskChipList(selected ? [selected] : [], '尚未选择资源规格', '', true, false) +
      '</div>'
    );
  }

  function renderTaskChipList(items, emptyText, removeAction, compact, removable) {
    const list = ensureList(items);
    if (!list.length) {
      return '<div class="task-chip-list"><span class="task-placeholder-inline">' + utils.escapeHtml(emptyText) + '</span></div>';
    }

    const canRemove = removable !== false && !!removeAction;
    return (
      '<div class="task-chip-list">' +
      list.map(function (item) {
        return (
          '<span class="task-chip' + (compact ? ' compact' : '') + ' active static">' +
          utils.escapeHtml(item.name || item.label || item.value || item.key || '') +
          (canRemove ? '<button class="task-chip-remove" type="button" data-task-action="' + utils.escapeAttribute(removeAction) + '" data-task-key="' + utils.escapeAttribute(item.key) + '">×</button>' : '') +
          '</span>'
        );
      }).join('') +
      '</div>'
    );
  }

  function renderTaskRadio(label, active, attrName, attrValue) {
    return (
      '<button class="task-radio' + (active ? ' active' : '') + '" type="button" ' + attrName + '="' + utils.escapeAttribute(attrValue) + '">' +
      '<span class="task-radio-dot"></span>' +
      '<span>' + utils.escapeHtml(label) + '</span>' +
      '</button>'
    );
  }

  function renderTaskBuilderTabs(algorithms, activeKey) {
    return (
      '<div class="task-builder-tabs">' +
      ensureList(algorithms).map(function (algorithm) {
        return '<button class="task-builder-tab' + (activeKey === algorithm.key ? ' active' : '') + '" type="button" data-task-tab="' + utils.escapeAttribute(algorithm.key) + '">' + utils.escapeHtml(algorithm.label || algorithm.name || '') + '</button>';
      }).join('') +
      '</div>'
    );
  }

  function renderTaskBuilderBody(page, builder, algorithm) {
    const config = getTaskAlgorithmConfig(page, algorithm.key);
    return (
      '<div class="task-builder-body">' +
      '<div class="task-builder-meta">' +
      '<div class="task-builder-meta-grid">' +
      renderTaskBuilderMeta('算法版本', renderTaskVersionField(builder, algorithm, config)) +
      renderTaskBuilderMeta('分析时间计划', '<button class="button-secondary" type="button" data-task-action="schedule-open" data-task-key="' + utils.escapeAttribute(algorithm.key) + '">' + utils.escapeHtml(getTaskScheduleLabel(builder, config.scheduleKey)) + '</button>') +
      renderTaskBuilderMeta('分析周期', renderTaskIntervalField(builder, algorithm, config)) +
      renderTaskBuilderMeta('闲时分析', '<button class="task-switch' + (config.temporalEnabled ? ' on' : '') + '" type="button" data-task-action="temporal-toggle" data-task-key="' + utils.escapeAttribute(algorithm.key) + '"><span class="task-switch-handle"></span></button>') +
      '</div>' +
      '</div>' +
      renderTaskPointTable(page) +
      '</div>'
    );
  }

  function renderTaskBuilderMeta(label, content) {
    return (
      '<div class="task-builder-meta-item">' +
      '<div class="task-builder-meta-label">' + utils.escapeHtml(label) + '</div>' +
      '<div class="task-builder-meta-value">' + content + '</div>' +
      '</div>'
    );
  }

  function renderTaskPointTable(page) {
    const state = ensureTaskCreateState(page);
    const streams = ensureList(state.taskPoints);
    return (
      '<div class="task-stream-table">' +
      '<div class="task-stream-table-header">' +
      '<div class="task-stream-table-title">分析点位</div>' +
      '<div class="task-stream-table-actions"><button class="button-link" type="button" data-task-action="point-open">添加</button><button class="button-link" type="button" data-toast-title="删除点位" data-toast-message="请在点位行内执行删除。">删除</button></div>' +
      '</div>' +
      '<div class="table-shell">' +
      '<table>' +
      '<thead><tr><th>点位名称</th><th>流地址</th><th>告警过滤</th><th>算法阈值</th><th>ROI</th><th>状态</th><th>操作</th></tr></thead>' +
      '<tbody>' +
      streams.map(function (stream) {
        return (
          '<tr>' +
          '<td>' + utils.escapeHtml(stream.name || '--') + '</td>' +
          '<td class="source-wrap-text">' + utils.escapeHtml(stream.url || '--') + '</td>' +
          '<td>' + utils.escapeHtml(stream.alertFilterEnabled === false ? '关闭' : '开启') + '</td>' +
          '<td>' + utils.escapeHtml(stream.algorithmThreshold || '0.4,0.3,0.5') + '</td>' +
          '<td>' + utils.escapeHtml(stream.roiLabel || '默认') + '</td>' +
          '<td>' + shell.renderStatusPill(stream.statusTone || 'success', stream.statusLabel || '--') + '</td>' +
          '<td><div class="table-actions"><button class="table-action" type="button" data-task-action="point-preview" data-task-key="' + utils.escapeAttribute(stream.id) + '">预览</button><button class="table-action" type="button" data-task-action="point-edit" data-task-key="' + utils.escapeAttribute(stream.id) + '">编辑</button><button class="table-action" type="button" data-task-action="point-delete" data-task-key="' + utils.escapeAttribute(stream.id) + '">删除</button></div></td>' +
          '</tr>'
        );
      }).join('') +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>'
    );
  }

  function renderTaskAlgorithmModal(page, state) {
    if (!state.algorithmModal.open) {
      return '';
    }

    const builder = page.taskBuilder || {};
    const selection = ensureList(state.algorithmModal.selection);
    const availableAlgorithms = ensureList(builder.algorithms).filter(function (item) {
      return selection.indexOf(item.key) === -1;
    });
    const selectedAlgorithms = ensureList(builder.algorithms).filter(function (item) {
      return selection.indexOf(item.key) !== -1;
    });

    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="algorithm" aria-label="关闭选择算法弹框"></button>' +
      '<section class="source-modal task-picker-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header">' +
      '<h3 class="source-modal-title">选择算法</h3>' +
      '<button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="algorithm">×</button>' +
      '</div>' +
      '<div class="task-picker-body">' +
      renderTaskAlgorithmPanel('待添加', availableAlgorithms, 'available', state.algorithmModal.availableChecked) +
      '<div class="task-transfer-actions"><button class="button" type="button" data-task-algo-move="add">&gt;</button><button class="button" type="button" data-task-algo-move="remove">&lt;</button></div>' +
      renderTaskAlgorithmPanel('已添加', selectedAlgorithms, 'selected', state.algorithmModal.selectedChecked) +
      '</div>' +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-algo-save="true">保存</button><button class="button-secondary" type="button" data-task-modal-close="algorithm">取消</button></div>' +
      '</section>' +
      '</div>'
    );
  }

  function renderTaskAlgorithmPanel(title, items, panelKey, checkedKeys) {
    return (
      '<section class="task-picker-panel">' +
      '<div class="task-picker-panel-head"><span>' + utils.escapeHtml(title) + '</span><span>' + utils.escapeHtml(String(ensureList(items).length)) + '</span></div>' +
      '<div class="task-picker-list">' +
      (ensureList(items).length
        ? ensureList(items).map(function (item) {
            const checked = ensureList(checkedKeys).indexOf(item.key) !== -1;
            return '<button class="task-picker-row' + (checked ? ' active' : '') + '" type="button" data-task-algo-panel="' + utils.escapeAttribute(panelKey) + '" data-task-key="' + utils.escapeAttribute(item.key) + '"><span class="task-picker-checkbox' + (checked ? ' checked' : '') + '"></span><span class="task-picker-name">' + utils.escapeHtml(item.label) + '</span><span class="task-picker-tag">' + utils.escapeHtml(item.sourceType || '视频') + '</span></button>';
          }).join('')
        : '<div class="task-picker-empty">暂无数据</div>') +
      '</div>' +
      '</section>'
    );
  }

  function renderTaskAddressModal(page, state) {
    if (!state.addressModal.open) {
      return '';
    }

    const builder = page.taskBuilder || {};
    const selection = ensureList(state.addressModal.selection);

    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="address" aria-label="关闭选择地址弹框"></button>' +
      '<section class="source-modal task-address-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">选择地址</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="address">×</button></div>' +
      '<div class="task-address-toolbar"><span class="task-address-toolbar-label">地址列表</span><button class="button" type="button" data-task-action="address-new">新增</button></div>' +
      '<div class="table-shell task-address-table">' +
      '<table>' +
      '<thead><tr><th class="algorithm-checkbox-cell"></th><th>名称</th><th>推送地址</th><th>关联任务</th><th>状态</th><th>操作</th></tr></thead>' +
      '<tbody>' +
      ensureList(builder.alarmRecipients).map(function (item) {
        const checked = selection.indexOf(item.key) !== -1;
        return (
          '<tr>' +
          '<td class="algorithm-checkbox-cell"><button class="algorithm-checkbox' + (checked ? ' checked' : '') + '" type="button" data-task-address-row-toggle="' + utils.escapeAttribute(item.key) + '"></button></td>' +
          '<td>' + utils.escapeHtml(item.name || item.label || '--') + '</td>' +
          '<td class="source-wrap-text">' + utils.escapeHtml(item.url || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.bindTask || '--') + '</td>' +
          '<td>' + shell.renderStatusPill('success', item.status || '在线') + '</td>' +
          '<td><div class="table-actions"><button class="table-action" type="button" data-task-action="address-test" data-task-key="' + utils.escapeAttribute(item.key) + '">测试</button><button class="table-action" type="button" data-task-action="address-edit" data-task-key="' + utils.escapeAttribute(item.key) + '">编辑</button><button class="table-action" type="button" data-task-action="address-delete" data-task-key="' + utils.escapeAttribute(item.key) + '">删除</button></div></td>' +
          '</tr>'
        );
      }).join('') +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-address-save="true">保存</button><button class="button-secondary" type="button" data-task-modal-close="address">关闭</button></div>' +
      '</section>' +
      '</div>'
    );
  }

  function renderTaskVersionField(builder, algorithm, config) {
    const versions = ensureList(algorithm.versions);
    if (versions.length <= 1) {
      return '<div class="task-param-static">' + utils.escapeHtml(config.version || versions[0] || "--") + '</div>';
    }

    return (
      '<select class="source-form-control task-param-select" data-task-algo-field="version" data-task-key="' + utils.escapeAttribute(algorithm.key) + '">' +
      versions.map(function (version) {
        return '<option value="' + utils.escapeAttribute(version) + '"' + (config.version === version ? " selected" : "") + ">" + utils.escapeHtml(version) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderTaskIntervalField(builder, algorithm, config) {
    return (
      '<div class="task-param-inline task-param-inline-nowrap">' +
      '<input class="source-form-control task-param-input" type="text" data-task-algo-field="interval" data-task-key="' + utils.escapeAttribute(algorithm.key) + '" value="' + utils.escapeAttribute(String(config.interval || "")) + '" />' +
      '<select class="source-form-control task-param-unit" data-task-algo-field="unit" data-task-key="' + utils.escapeAttribute(algorithm.key) + '">' +
      ensureList(builder.intervalUnits).map(function (item) {
        return '<option value="' + utils.escapeAttribute(item.value) + '"' + (config.unit === item.value ? " selected" : "") + ">" + utils.escapeHtml(item.label || item.value) + "</option>";
      }).join("") +
      "</select>" +
      "</div>"
    );
  }

  function renderTaskAddressEditorModal(page, state) {
    if (!state.addressEditor.open || !state.addressEditor.draft) {
      return "";
    }

    const draft = state.addressEditor.draft;
    const builder = page.taskBuilder || {};
    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="address-editor" aria-label="关闭地址编辑弹框"></button>' +
      '<section class="source-modal task-address-editor-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">' + utils.escapeHtml(state.addressEditor.mode === "edit" ? "编辑地址" : "新增地址") + '</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="address-editor">×</button></div>' +
      '<div class="task-address-editor-body">' +
      renderTaskAddressEditorField("推送名称", true, '<input class="source-form-control" type="text" data-task-address-field="name" value="' + utils.escapeAttribute(draft.name || "") + '" />') +
      renderTaskAddressEditorField("推送地址", true, '<input class="source-form-control" type="text" data-task-address-field="url" value="' + utils.escapeAttribute(draft.url || "") + '" />') +
      renderTaskAddressEditorField("推送间隔", false, '<div class="task-param-inline"><input class="source-form-control task-param-input" type="number" min="0" data-task-address-field="intervalSeconds" value="' + utils.escapeAttribute(String(draft.intervalSeconds || "")) + '" /><span>秒内重复告警不再推送</span></div>', true) +
      renderTaskAddressEditorField("推送内容", false, '<div class="task-address-contents">' + ensureList(builder.addressContentOptions).map(function (item) {
        const active = ensureList(draft.contents).indexOf(item.key) !== -1;
        return '<button class="task-content-tag' + (active ? " active" : "") + '" type="button" data-task-action="address-content-toggle" data-task-key="' + utils.escapeAttribute(item.key) + '">' + utils.escapeHtml(item.label) + "</button>";
      }).join("") + '<button class="button-link" type="button" data-task-action="address-custom-payload-open">自定义</button></div>', true) +
      "</div>" +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-action="address-form-save">保存</button><button class="button-secondary" type="button" data-task-modal-close="address-editor">取消</button></div>' +
      "</section>" +
      "</div>"
    );
  }

  function renderTaskAddressEditorField(label, required, content, fullWidth) {
    return (
      '<div class="task-address-editor-field' + (fullWidth ? " full-width" : "") + '">' +
      '<div class="task-address-editor-label">' + utils.escapeHtml(label) + (required ? "<em>*</em>" : "") + "</div>" +
      '<div class="task-address-editor-value">' + content + "</div>" +
      "</div>"
    );
  }

  function renderTaskCustomPayloadModal(state) {
    if (!state.customPayload.open || !state.customPayload.draft) {
      return "";
    }

    const draft = state.customPayload.draft;
    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="custom-payload" aria-label="关闭自定义推送结果弹框"></button>' +
      '<section class="source-modal task-custom-payload-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">自定义推送结果</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="custom-payload">×</button></div>' +
      '<div class="task-address-editor-body">' +
      renderTaskAddressEditorField("内容名称", false, '<input class="source-form-control" type="text" data-task-custom-payload-field="name" value="' + utils.escapeAttribute(draft.name || "") + '" />') +
      renderTaskAddressEditorField("JSON内容", false, '<textarea class="source-form-control task-custom-payload-textarea" data-task-custom-payload-field="body">' + utils.escapeHtml(draft.body || "") + "</textarea>", true) +
      "</div>" +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-action="custom-payload-save">保存</button><button class="button-secondary" type="button" data-task-modal-close="custom-payload">取消</button></div>' +
      "</section>" +
      "</div>"
    );
  }

  function renderTaskScheduleModal(page, state) {
    if (!state.scheduleModal.open) {
      return "";
    }

    const builder = page.taskBuilder || {};
    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="schedule" aria-label="关闭时间计划弹框"></button>' +
      '<section class="source-modal task-schedule-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">选择时间计划</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="schedule">×</button></div>' +
      '<div class="task-schedule-layout">' +
      '<aside class="task-schedule-sidebar">' +
      ensureList(builder.schedulePlans).map(function (item) {
        return '<button class="task-schedule-item' + (item.key === state.scheduleModal.planKey ? " active" : "") + '" type="button" data-task-schedule-plan="' + utils.escapeAttribute(item.key) + '">' + utils.escapeHtml(item.label) + "</button>";
      }).join("") +
      "</aside>" +
      '<section class="task-schedule-main">' +
      renderTaskScheduleTimeline(findTaskBuilderItem(builder.schedulePlans, state.scheduleModal.planKey)) +
      "</section>" +
      "</div>" +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-schedule-save="true">确定</button><button class="button-secondary" type="button" data-task-modal-close="schedule">取消</button></div>' +
      "</section>" +
      "</div>"
    );
  }

  function renderTaskScheduleTimeline(plan) {
    const rows = ensureList((plan && plan.weekly) || []);
    const hours = [];
    let hour = 0;
    for (hour = 0; hour <= 24; hour += 2) {
      hours.push('<span>' + String(hour).padStart(2, "0") + "</span>");
    }

    return (
      '<div class="task-schedule-grid">' +
      '<div class="task-schedule-hours">' + hours.join("") + "</div>" +
      rows.map(function (row) {
        return (
          '<div class="task-schedule-row">' +
          '<div class="task-schedule-day">' + utils.escapeHtml(row.day) + "</div>" +
          '<div class="task-schedule-track">' +
          ensureList(row.ranges).map(function (range) {
            return '<span class="task-schedule-block" style="left:' + utils.escapeAttribute(String(range.start / 24 * 100)) + "%;width:" + utils.escapeAttribute(String((range.end - range.start) / 24 * 100)) + '%;"></span>';
          }).join("") +
          "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderTaskPointPickerModal(page, state) {
    if (!state.pointPicker.open) {
      return "";
    }

    const keyword = (state.pointPicker.keyword || "").toLowerCase();
    const currentMap = {};
    ensureList(state.taskPoints).forEach(function (item) {
      currentMap[item.id] = true;
    });
    const rows = ensureList(state.pointCatalog).filter(function (item) {
      if (currentMap[item.id]) {
        return false;
      }
      if (!keyword) {
        return true;
      }
      return String(item.name || "").toLowerCase().indexOf(keyword) !== -1;
    });

    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="point-picker" aria-label="关闭新增点位弹框"></button>' +
      '<section class="source-modal task-point-picker-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">新增点位</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="point-picker">×</button></div>' +
      '<div class="task-point-picker-body">' +
      '<input class="source-form-control" type="search" data-task-point-search="true" value="' + utils.escapeAttribute(state.pointPicker.keyword || "") + '" placeholder="搜索点位名称" />' +
      '<div class="task-point-picker-list">' +
      (rows.length
        ? rows.map(function (item) {
            const checked = state.pointPicker.selection.indexOf(item.id) !== -1;
            return '<button class="task-point-picker-row' + (checked ? " active" : "") + '" type="button" data-task-point-row-toggle="' + utils.escapeAttribute(item.id) + '"><span class="task-picker-checkbox' + (checked ? " checked" : "") + '"></span><span class="task-point-picker-name">' + utils.escapeHtml(item.name || "--") + '</span><span class="task-point-picker-url">' + utils.escapeHtml(item.url || "--") + "</span></button>";
          }).join("")
        : '<div class="task-picker-empty">当前没有可添加点位</div>') +
      "</div>" +
      "</div>" +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-point-save="true">保存</button><button class="button-secondary" type="button" data-task-modal-close="point-picker">取消</button></div>' +
      "</section>" +
      "</div>"
    );
  }

  function renderTaskPointPreviewModal(page, state) {
    const point = findTaskPointById(page, state.pointPreview.streamId);
    if (!point) {
      return "";
    }

    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="point-preview" aria-label="关闭点位预览弹框"></button>' +
      '<section class="source-modal task-point-preview-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">视频预览</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="point-preview">×</button></div>' +
      '<div class="task-point-preview-body">' +
      '<div class="task-point-preview-frame"><img src="' + utils.escapeAttribute(point.previewImage || ((page.taskBuilder || {}).pointAssets || {}).previewImage || "") + '" alt="' + utils.escapeAttribute(point.name || "") + '" /></div>' +
      '<div class="task-point-preview-meta"><strong>' + utils.escapeHtml(point.name || "--") + '</strong><div class="source-wrap-text">' + utils.escapeHtml(point.url || "--") + "</div></div>" +
      "</div>" +
      '<div class="source-modal-footer"><button class="button-secondary" type="button" data-task-modal-close="point-preview">关闭</button></div>' +
      "</section>" +
      "</div>"
    );
  }

  function renderTaskPointEditorModal(page, state) {
    if (!state.pointEditor.open || !state.pointEditor.draft) {
      return "";
    }

    const draft = state.pointEditor.draft;
    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="point-editor" aria-label="关闭点位编辑弹框"></button>' +
      '<section class="source-modal task-point-editor-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">点位编辑</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="point-editor">×</button></div>' +
      '<div class="task-point-editor-body">' +
      renderTaskPointEditorField("告警过滤", '<button class="task-switch' + (draft.alertFilterEnabled ? " on" : "") + '" type="button" data-task-action="point-filter-toggle"><span class="task-switch-handle"></span></button>') +
      renderTaskPointEditorField("置信度阈值", '<input class="source-form-control task-param-input" type="number" step="0.1" min="0" max="1" data-task-point-field="confidenceThreshold" value="' + utils.escapeAttribute(draft.confidenceThreshold || "") + '" />') +
      renderTaskPointEditorField("异常分数阈值", '<input class="source-form-control task-param-input" type="number" step="0.1" min="0" max="1" data-task-point-field="abnormalityThreshold" value="' + utils.escapeAttribute(draft.abnormalityThreshold || "") + '" />') +
      renderTaskPointEditorField("相似度阈值", '<input class="source-form-control task-param-input" type="number" step="0.1" min="0" max="1" data-task-point-field="similarityThreshold" value="' + utils.escapeAttribute(draft.similarityThreshold || "") + '" />') +
      renderTaskPointEditorField("ROI设置", '<div class="task-inline-row">' +
        '<button class="task-radio' + (draft.roiMode !== "custom" ? " active" : "") + '" type="button" data-task-action="point-roi-mode" data-task-key="default"><span class="task-radio-dot"></span><span>默认</span></button>' +
        '<button class="task-radio' + (draft.roiMode === "custom" ? " active" : "") + '" type="button" data-task-action="point-roi-mode" data-task-key="custom"><span class="task-radio-dot"></span><span>自定义</span></button>' +
      "</div>") +
      "</div>" +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-point-edit-save="true">保存</button><button class="button-secondary" type="button" data-task-modal-close="point-editor">取消</button></div>' +
      "</section>" +
      "</div>"
    );
  }

  function renderTaskPointEditorField(label, content) {
    return (
      '<div class="task-point-editor-field">' +
      '<div class="task-point-editor-label">' + utils.escapeHtml(label) + "</div>" +
      '<div class="task-point-editor-value">' + content + "</div>" +
      "</div>"
    );
  }

  function renderTaskNodeModal(page, state) {
    if (!state.nodeModal.open) {
      return '';
    }

    const builder = page.taskBuilder || {};
    const activeTab = state.nodeModal.tab || ((ensureList(builder.nodeTabs)[0] || {}).key || 'service');
    const rows = ensureList(builder.nodePools).filter(function (item) {
      return item.group === activeTab;
    });

    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="node" aria-label="关闭计算节点弹框"></button>' +
      '<section class="source-modal task-node-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">计算节点</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="node">×</button></div>' +
      '<div class="task-node-tabs">' +
      ensureList(builder.nodeTabs).map(function (tab) {
        return '<button class="task-node-tab' + (activeTab === tab.key ? ' active' : '') + '" type="button" data-task-node-tab="' + utils.escapeAttribute(tab.key) + '">' + utils.escapeHtml(tab.label) + '</button>';
      }).join('') +
      '</div>' +
      '<div class="table-shell task-node-table">' +
      '<table>' +
      '<thead><tr><th class="algorithm-checkbox-cell"></th><th>节点名称</th><th>节点IP</th><th>节点状态</th><th>CPU</th><th>内存</th><th>GPU 使用率</th><th>GPU 显存使用率</th><th>操作</th></tr></thead>' +
      '<tbody>' +
      rows.map(function (item) {
        const checked = state.nodeModal.selection.indexOf(item.key) !== -1;
        return (
          '<tr>' +
          '<td class="algorithm-checkbox-cell"><button class="algorithm-checkbox' + (checked ? ' checked' : '') + '" type="button" data-task-node-row-toggle="' + utils.escapeAttribute(item.key) + '"></button></td>' +
          '<td>' + utils.escapeHtml(item.label || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.ip || '--') + '</td>' +
          '<td>' + shell.renderStatusPill(item.statusTone || 'success', item.statusLabel || '运行中') + '</td>' +
          '<td>' + utils.escapeHtml(item.cpu || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.memory || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.gpuUsage || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.gpuMemoryUsage || '--') + '</td>' +
          '<td><button class="table-action" type="button" data-task-node-row-toggle="' + utils.escapeAttribute(item.key) + '">' + (checked ? '取消' : '选择') + '</button></td>' +
          '</tr>'
        );
      }).join('') +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<div class="source-modal-footer"><button class="button" type="button" data-task-node-save="true">保存</button><button class="button-secondary" type="button" data-task-modal-close="node">取消</button></div>' +
      '</section>' +
      '</div>'
    );
  }

  function renderTaskSpecModal(page, state) {
    if (!state.specModal.open) {
      return '';
    }

    const builder = page.taskBuilder || {};
    return (
      '<div class="source-modal-layer open">' +
      '<button class="source-modal-mask" type="button" data-task-modal-close="spec" aria-label="关闭规格弹框"></button>' +
      '<section class="source-modal task-spec-modal" role="dialog" aria-modal="true">' +
      '<div class="source-modal-header"><h3 class="source-modal-title">选择规格</h3><button class="source-modal-close" type="button" aria-label="关闭" data-task-modal-close="spec">×</button></div>' +
      '<div class="table-shell task-spec-table">' +
      '<table>' +
      '<thead><tr><th class="algorithm-checkbox-cell"></th><th>规格ID</th><th>规格名称</th><th>vCPU(核)</th><th>内存(GB)</th><th>GPU</th><th>GPU 显存(GB)</th><th>硬盘大小(GB)</th></tr></thead>' +
      '<tbody>' +
      ensureList(builder.resourceSpecs).map(function (item) {
        const checked = state.specModal.selection === item.key;
        return (
          '<tr>' +
          '<td class="algorithm-checkbox-cell"><button class="algorithm-checkbox' + (checked ? ' checked' : '') + '" type="button" data-task-spec-row-toggle="' + utils.escapeAttribute(item.key) + '"></button></td>' +
          '<td>' + utils.escapeHtml(item.id || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.label || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.vcpu || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.memoryGB || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.gpu || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.gpuMemoryGB || '--') + '</td>' +
          '<td>' + utils.escapeHtml(item.diskGB || '--') + '</td>' +
          '</tr>'
        );
      }).join('') +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<div class="source-modal-footer"><button class="button-secondary" type="button" data-task-modal-close="spec">取消</button><button class="button" type="button" data-task-spec-save="true">保存</button></div>' +
      '</section>' +
      '</div>'
    );
  }

  function renderHighlightsPanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="highlights-grid">' +
      ensureList(panel.items).map(function (item) {
        return (
          '<div class="highlight-item">' +
          '<div class="highlight-label">' + utils.escapeHtml(item.label || "") + "</div>" +
          '<div class="highlight-value">' + utils.escapeHtml(item.value || "--") + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderChartPanel(context, panel) {
    const points = ensureList(panel.points);
    const maxValue = Math.max.apply(null, points.concat([1]));
    const width = 560;
    const height = 320;
    const paddingX = 30;
    const paddingY = 20;
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;
    const stepX = points.length > 1 ? usableWidth / (points.length - 1) : usableWidth;
    const path = points.map(function (point, index) {
      const x = paddingX + stepX * index;
      const y = height - paddingY - (point / maxValue) * usableHeight;
      return (index === 0 ? "M" : "L") + x + "," + y;
    }).join(" ");

    return (
      '<section class="panel chart-panel">' +
      shell.renderPanelHeader(context, panel) +
      (panel.legend ? '<div class="chart-legend"><span class="chart-legend-dot"></span><span>' + utils.escapeHtml(panel.legend) + "</span></div>" : "") +
      '<div class="chart-shell">' +
      '<div class="chart-y-axis">' +
      ensureList(panel.yAxis).map(function (item) {
        return '<div class="chart-axis-label">' + utils.escapeHtml(item) + "</div>";
      }).join("") +
      "</div>" +
      '<svg class="chart-svg" viewBox="0 0 ' + width + " " + height + '" preserveAspectRatio="none">' +
      renderChartGridLines(width, height) +
      (path ? '<path class="chart-shadow-line" d="' + utils.escapeAttribute(path) + '"></path><path class="chart-line" d="' + utils.escapeAttribute(path) + '"></path>' : "") +
      points.map(function (point, index) {
        const x = paddingX + stepX * index;
        const y = height - paddingY - (point / maxValue) * usableHeight;
        return '<circle cx="' + utils.escapeAttribute(String(x)) + '" cy="' + utils.escapeAttribute(String(y)) + '" r="5" fill="#2d83f5"></circle>';
      }).join("") +
      "</svg>" +
      "</div>" +
      "</section>"
    );
  }

  function renderPreviewTablePanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="table-shell">' +
      "<table>" +
      "<thead><tr>" +
      ensureList(panel.columns).map(function (column) {
        return "<th>" + utils.escapeHtml(column.label || "") + "</th>";
      }).join("") +
      "</tr></thead>" +
      "<tbody>" +
      ensureList(panel.rows).map(function (row) {
        return renderPreviewTableRow(panel, row);
      }).join("") +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</section>"
    );
  }

  function renderFormPanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="form-section-list">' +
      ensureList(panel.sections).map(function (section) {
        return (
          '<section class="form-section">' +
          '<div class="form-section-title">' + utils.escapeHtml(section.title || "") + "</div>" +
          '<div class="form-grid">' +
          ensureList(section.fields).map(function (field) {
            return (
              '<div class="form-field">' +
              '<div class="form-label">' + utils.escapeHtml(field.label || "") + "</div>" +
              '<div class="form-value">' + utils.escapeHtml(field.value || "--") + "</div>" +
              "</div>"
            );
          }).join("") +
          "</div>" +
          "</section>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderKeyValuePanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="key-value-list">' +
      ensureList(panel.items).map(function (item) {
        return (
          '<div class="key-value-row">' +
          '<div class="key-value-label">' + utils.escapeHtml(item.label || "") + "</div>" +
          '<div class="key-value-value">' + utils.escapeHtml(item.value || "--") + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderOnlinePanel(context, panel) {
    return renderStatusStatsPanel(context, panel);
  }

  function renderStatusStatsPanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="stats-inline">' +
      ensureList(panel.items).map(function (item) {
        return shell.renderSummaryCard(item);
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderQuickLinksPanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="assist-list">' +
      ensureList(panel.items).map(function (item) {
        const route = item.route ? ' data-route="' + utils.escapeAttribute(item.route) + '"' : "";
        return '<button class="assist-item" type="button"' + route + '><div class="assist-label">' + utils.escapeHtml(item.label || "") + '</div><div class="assist-value">' + utils.escapeHtml(item.value || item.description || "") + "</div></button>";
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderAlertsPanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="alert-list">' +
      ensureList(panel.items).map(function (item) {
        return (
          '<div class="alert-item">' +
          '<div class="alert-icon">!</div>' +
          "<div>" +
          '<p class="alert-title">' + utils.escapeHtml(item.title || item.label || "") + "</p>" +
          '<div class="alert-meta">' + utils.escapeHtml(item.meta || item.value || "") + "</div>" +
          "</div>" +
          (item.tone === "danger" ? '<button class="tag-button danger" type="button">' + utils.escapeHtml(item.actionLabel || "处理") + "</button>" : '<button class="tag-button" type="button">' + utils.escapeHtml(item.actionLabel || "查看") + "</button>") +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderTimelinePanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="timeline-list">' +
      ensureList(panel.items).map(function (item) {
        return (
          '<div class="timeline-row">' +
          '<div class="timeline-meta">' + utils.escapeHtml(item.time || "--") + "</div>" +
          '<div class="timeline-title">' + utils.escapeHtml(item.actor || item.category || "--") + "</div>" +
          "<div>" + utils.escapeHtml(item.title || item.label || item.value || "--") + "</div>" +
          '<div class="timeline-meta">' + utils.escapeHtml(item.status || "--") + "</div>" +
          '<div class="timeline-meta">' + utils.escapeHtml(item.note || "--") + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderAssistPanel(context, panel) {
    return (
      '<section class="panel">' +
      shell.renderPanelHeader(context, panel) +
      '<div class="assist-list">' +
      ensureList(panel.items).map(function (item) {
        return (
          '<div class="assist-item">' +
          '<div class="assist-label">' + utils.escapeHtml(item.label || "") + "</div>" +
          '<div class="assist-value">' + utils.escapeHtml(item.value || "--") + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function ensureTaskCreateState(page) {
    if (page.__taskCreateState) {
      return page.__taskCreateState;
    }

    const builder = page.taskBuilder || {};
    const algorithms = ensureList(builder.algorithms);
    const recipients = ensureList(builder.alarmRecipients);
    const nodePools = ensureList(builder.nodePools);
    const resourceSpecs = ensureList(builder.resourceSpecs);

    const defaultAlgorithms = algorithms.slice(0, Math.min(3, algorithms.length)).map(function (item) {
      return item.key;
    });
    const defaultRecipients = recipients.slice(0, Math.min(2, recipients.length)).map(function (item) {
      return item.key;
    });
    const defaultNode = nodePools.length ? [nodePools[0].key] : [];
    const defaultSpec = resourceSpecs.length ? resourceSpecs[0].key : "";

    page.__taskCreateState = {
      draft: {
        taskName: "",
        selectedAlgorithms: defaultAlgorithms,
        activeAlgorithmKey: defaultAlgorithms[0] || "",
        validityType: builder.defaultValidityType || "custom",
        startDate: builder.defaultStartDate || "",
        endDate: builder.defaultEndDate || "",
        priority: builder.defaultPriority || "medium",
        recipients: defaultRecipients,
        clipEnabled: builder.defaultClipEnabled !== false,
        nodeKeys: defaultNode,
        specKey: defaultSpec
      },
      algorithmConfigs: {},
      taskPoints: ensureList(builder.streams).map(function (item) {
        return createTaskPointDraft(item);
      }),
      pointCatalog: ensureList(builder.streams).map(function (item) {
        return createTaskPointDraft(item);
      }),
      algorithmModal: {
        open: false,
        selection: [],
        availableChecked: [],
        selectedChecked: []
      },
      addressModal: {
        open: false,
        selection: []
      },
      addressEditor: {
        open: false,
        mode: "create",
        key: "",
        draft: null
      },
      customPayload: {
        open: false,
        draft: null
      },
      nodeModal: {
        open: false,
        selection: [],
        tab: ((ensureList(builder.nodeTabs)[0] || {}).key || "service")
      },
      specModal: {
        open: false,
        selection: ""
      },
      scheduleModal: {
        open: false,
        algorithmKey: defaultAlgorithms[0] || "",
        planKey: builder.defaultScheduleKey || "all-day"
      },
      pointPicker: {
        open: false,
        selection: [],
        keyword: ""
      },
      pointPreview: {
        streamId: ""
      },
      pointEditor: {
        open: false,
        streamId: "",
        draft: null
      }
    };

    return page.__taskCreateState;
  }

  function renderChartGridLines(width, height) {
    const rows = 5;
    const segments = [];
    for (let index = 0; index <= rows; index += 1) {
      const y = 20 + ((height - 40) / rows) * index;
      segments.push('<line class="chart-grid-line" x1="0" y1="' + y + '" x2="' + width + '" y2="' + y + '"></line>');
    }
    return segments.join("");
  }

  function renderPreviewTableRow(panel, row) {
    return (
      "<tr>" +
      ensureList(panel.columns).map(function (column) {
        let content = row[column.key];
        if (column.type === "status") {
          content = shell.renderStatusPill(row[column.toneField || "statusTone"], row[column.labelField || column.key] || "--");
        } else {
          content = utils.escapeHtml(content || "--");
          if (column.strong) {
            content = "<strong>" + content + "</strong>";
          }
        }
        return "<td>" + content + "</td>";
      }).join("") +
      "</tr>"
    );
  }

  function findTaskBuilderItems(items, keys) {
    const list = ensureList(items);
    const lookup = {};
    list.forEach(function (item) {
      lookup[item.key] = item;
    });

    return ensureList(keys).map(function (key) {
      return lookup[key];
    }).filter(Boolean);
  }

  function findTaskBuilderItem(items, key) {
    return ensureList(items).find(function (item) {
      return item.key === key;
    }) || null;
  }

  function getDefaultTaskSchedule(builder) {
    const schedule = findTaskBuilderItem(builder.schedulePlans, builder.defaultScheduleKey);
    return schedule ? schedule.label : "全天候";
  }

  function getTaskScheduleLabel(builder, scheduleKey) {
    const schedule = findTaskBuilderItem(builder.schedulePlans, scheduleKey);
    return schedule ? schedule.label : getDefaultTaskSchedule(builder);
  }

  function getTaskAlgorithmConfig(page, algorithmKey) {
    const state = ensureTaskCreateState(page);
    if (!state.algorithmConfigs[algorithmKey]) {
      const algorithm = findTaskBuilderItem((page.taskBuilder || {}).algorithms, algorithmKey) || {};
      state.algorithmConfigs[algorithmKey] = {
        version: algorithm.defaultVersion || ensureList(algorithm.versions)[0] || "",
        interval: String(algorithm.defaultInterval || "10"),
        unit: algorithm.defaultUnit || "秒",
        temporalEnabled: algorithm.defaultTemporalEnabled !== false,
        scheduleKey: (page.taskBuilder || {}).defaultScheduleKey || "all-day"
      };
    }
    return state.algorithmConfigs[algorithmKey];
  }

  function findTaskPointById(page, pointId) {
    return ensureList(ensureTaskCreateState(page).taskPoints).find(function (item) {
      return item.id === pointId;
    }) || null;
  }

  function createTaskAddressDraft(source) {
    const item = source || {};
    return {
      name: item.name || item.label || "",
      url: item.url || "",
      bindTask: item.bindTask || "",
      status: item.status || "在线",
      intervalSeconds: item.intervalSeconds || "60",
      contents: ensureList(item.contents).slice(),
      customPayload: createTaskCustomPayloadDraft(item.customPayload)
    };
  }

  function createTaskCustomPayloadDraft(source) {
    const item = source || {};
    return {
      name: item.name || "",
      body: item.body || "{\n  \"deviceInfo\": {\n    \"deviceId\": \"prod_air_conditioner_2025\"\n  }\n}"
    };
  }

  function createTaskPointDraft(source) {
    const item = source || {};
    return {
      id: item.id || "",
      name: item.name || "",
      url: item.url || "",
      statusTone: item.statusTone || "success",
      statusLabel: item.statusLabel || "在线",
      alertFilterEnabled: item.alertFilterEnabled !== false,
      confidenceThreshold: item.confidenceThreshold || "0.4",
      abnormalityThreshold: item.abnormalityThreshold || "0.3",
      similarityThreshold: item.similarityThreshold || "0.5",
      algorithmThreshold: item.algorithmThreshold || "0.4,0.3,0.5",
      roiMode: item.roiMode || "default",
      roiLabel: item.roiLabel || "默认",
      previewImage: item.previewImage || "",
      group: item.group || ""
    };
  }

  function renderOfflineTaskCreatePage(page) {
    const builder = page.offlineTaskBuilder || {};
    const state = ensureOfflineTaskCreateState(page);
    const activeTab = findOfflineTab(builder.tabs, state.activeTab) || ensureList(builder.tabs)[0] || {};
    const materials = ensureList(activeTab.materials);
    const materialType = state.materialType || builder.defaultMaterialType || "video";

    return (
      '<section class="panel offline-task-create-page">' +
      '<div class="offline-task-create-form">' +
      renderOfflineFormRow("任务名称*", '<input class="source-form-control offline-name-input" type="text" value="' + utils.escapeAttribute(builder.taskName || "") + '" placeholder="请输入任务名称" />') +
      renderOfflineFormRow("素材类型*", renderOfflineMaterialTypes(builder, state)) +
      renderOfflineFormRow("分析算法", renderOfflineSelectionGroup({
        primaryLabel: "选择算法",
        clearLabel: "清空选择",
        toastTitle: "选择算法",
        toastMessage: "当前原型保留离线算法选择入口。",
        chips: ensureList(builder.algorithms)
      })) +
      renderOfflineFormRow("分析优先级", renderOfflinePriority(builder, state)) +
      renderOfflineFormRow("告警推送", renderOfflineSelectionGroup({
        primaryLabel: "选择地址",
        clearLabel: "",
        toastTitle: "选择地址",
        toastMessage: "当前原型保留离线告警地址选择入口。",
        chips: ensureList(builder.recipients)
      })) +
      renderOfflineFormRow("计算资源配置", renderOfflineSelectionGroup({
        primaryLabel: "选择规格",
        clearLabel: "清空选择",
        toastTitle: "选择规格",
        toastMessage: "当前原型保留离线规格选择入口。",
        chips: builder.specLabel ? [{ label: builder.specLabel }] : []
      })) +
      "</div>" +
      renderOfflineMaterialStage(page, builder, state, activeTab, materialType, materials) +
      renderOfflineActionBar() +
      "</section>"
    );
  }

  function renderOfflineFormRow(label, content) {
    return (
      '<div class="offline-form-row">' +
      '<div class="offline-form-label">' + utils.escapeHtml(label) + "</div>" +
      '<div class="offline-form-value">' + content + "</div>" +
      "</div>"
    );
  }

  function renderOfflineMaterialTypes(builder, state) {
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

  function renderOfflinePriority(builder, state) {
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

  function renderOfflineSelectionGroup(config) {
    const clearAction = config.clearLabel
      ? '<button class="button-link offline-inline-link" type="button" data-toast-title="' + utils.escapeAttribute(config.clearLabel) + '" data-toast-message="' + utils.escapeAttribute("当前原型仅清理演示选择，不做实际数据变更。") + '">' + utils.escapeHtml(config.clearLabel) + "</button>"
      : "";

    return (
      '<div class="offline-selection-group">' +
      '<div class="offline-selection-actions">' +
      '<button class="button-link offline-inline-link" type="button" data-toast-title="' + utils.escapeAttribute(config.toastTitle) + '" data-toast-message="' + utils.escapeAttribute(config.toastMessage) + '">' + utils.escapeHtml(config.primaryLabel) + "</button>" +
      clearAction +
      "</div>" +
      '<div class="offline-chip-list">' +
      ensureList(config.chips).map(function (chip) {
        return '<span class="offline-chip">' + utils.escapeHtml(chip.label || chip) + '<span class="offline-chip-close">×</span></span>';
      }).join("") +
      "</div>" +
      "</div>"
    );
  }

  function renderOfflineMaterialStage(page, builder, state, activeTab, materialType, materials) {
    const materialText = materialType === "video" ? "视频上传" : "图片上传";

    return (
      '<section class="offline-stage">' +
      '<div class="offline-stage-header">' +
      '<div>' +
      '<h3 class="offline-stage-title">离线素材</h3>' +
      '<p class="offline-stage-hint">当前模式：' + utils.escapeHtml(materialText) + '，原型阶段使用本地 mock 素材模拟上传。</p>' +
      "</div>" +
      '<button class="button" type="button" data-toast-title="添加素材" data-toast-message="当前原型保留离线素材选择入口。">' + utils.escapeHtml(materialType === "video" ? "添加视频" : "添加图片") + "</button>" +
      "</div>" +
      '<div class="offline-dropzone">' +
      '<div class="offline-dropzone-title">支持多' + utils.escapeHtml(materialType === "video" ? "视频" : "图片") + '批量导入</div>' +
      '<div class="offline-dropzone-text">点击右上角按钮快速补充离线素材。</div>' +
      "</div>" +
      '<div class="offline-algorithm-tabs">' +
      ensureList(builder.tabs).map(function (tab) {
        const active = state.activeTab === tab.key;
        return '<button class="offline-algorithm-tab' + (active ? ' active' : '') + '" type="button" data-offline-tab="' + utils.escapeAttribute(tab.key) + '">' + utils.escapeHtml(tab.label) + "</button>";
      }).join("") +
      "</div>" +
      '<div class="offline-tab-meta">' +
      '<div class="offline-meta-pair"><span class="offline-meta-label">算法版本</span><span class="offline-meta-chip">' + utils.escapeHtml(activeTab.version || "V1.0") + "</span></div>" +
      '<div class="offline-meta-pair"><span class="offline-meta-label">抽帧间隔</span><span class="offline-meta-inline"><input class="source-form-control offline-interval-input" type="text" value="' + utils.escapeAttribute(activeTab.interval || "5") + '" /><span class="offline-meta-unit">秒</span></span></div>' +
      "</div>" +
      '<div class="offline-material-table-wrap">' +
      '<div class="offline-material-table-head">' +
      '<h4 class="offline-material-table-title">分析素材</h4>' +
      '<div class="offline-material-table-note">已选择 ' + ensureList(materials).length + ' 个' + utils.escapeHtml(materialType === "video" ? "视频" : "图片") + '文件</div>' +
      "</div>" +
      '<div class="table-shell offline-material-table">' +
      '<table>' +
      '<thead><tr><th>素材名称</th><th>封面</th><th>时长</th><th>清晰度</th><th>大小</th><th>状态</th><th>操作</th></tr></thead>' +
      '<tbody>' +
      (materials.length
        ? materials.map(function (item) {
          return (
            '<tr>' +
            '<td>' + utils.escapeHtml(item.name || "--") + '</td>' +
            '<td>' + utils.escapeHtml(item.cover || "--") + '</td>' +
            '<td>' + utils.escapeHtml(item.duration || "--") + '</td>' +
            '<td>' + utils.escapeHtml(item.resolution || "--") + '</td>' +
            '<td>' + utils.escapeHtml(item.size || "--") + '</td>' +
            '<td>' + shell.renderStatusPill(item.statusTone || "success", item.statusLabel || "可分析") + '</td>' +
            '<td><div class="table-actions"><button class="table-action" type="button" data-toast-title="移除素材" data-toast-message="当前原型不做真实删除。">移除</button></div></td>' +
            '</tr>'
          );
        }).join("")
        : '<tr><td colspan="7"><div class="empty-state offline-empty-state">暂无上传离线素材</div></td></tr>') +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>' +
      '</section>'
    );
  }

  function renderOfflineActionBar() {
    return (
      '<div class="offline-task-actions">' +
      '<button class="button-secondary" type="button" data-route="offline-analysis">返回</button>' +
      '<button class="button-secondary" type="button" data-toast-title="保存草稿" data-toast-message="当前原型模拟保存离线分析草稿。">保存草稿</button>' +
      '<button class="button" type="button" data-toast-title="启动分析" data-toast-message="当前原型模拟启动离线分析任务。">启动分析</button>' +
      '</div>'
    );
  }

  function ensureOfflineTaskCreateState(page) {
    if (page.__offlineTaskCreateState) {
      return page.__offlineTaskCreateState;
    }

    const builder = page.offlineTaskBuilder || {};
    page.__offlineTaskCreateState = {
      materialType: builder.defaultMaterialType || ((ensureList(builder.materialTypes)[0] || {}).key || "video"),
      priority: builder.defaultPriority || ((ensureList(builder.priorityOptions)[1] || ensureList(builder.priorityOptions)[0] || {}).key || "medium"),
      activeTab: ((ensureList(builder.tabs)[0] || {}).key || "")
    };

    return page.__offlineTaskCreateState;
  }

  function findOfflineTab(tabs, tabKey) {
    return ensureList(tabs).find(function (tab) {
      return tab.key === tabKey;
    }) || null;
  }

  function ensureList(value) {
    return Array.isArray(value) ? value : [];
  }
})();
