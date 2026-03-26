window.registerPrototypePage({
  key: "offline-analysis",
  styleSource: "../assets/css/pages/offline-analysis.css",
  kind: "table",
  heading: "离线视图分析",
  subtitle: "查看离线批量素材分析任务的执行状态、结果状态和提交记录。",
  tablePanel: {},
  countTextPrefix: "共",
  countTextUnit: "条记录",
  emptyText: "暂无离线分析任务",
  offlineTaskPage: {
    toolbarLayout: "actions-left",
    toolbarActions: [
      { label: "新建任务", action: "create", variant: "button" },
      { label: "启动", action: "start", variant: "button-secondary offline-toolbar-start" },
      { label: "删除", action: "delete", variant: "button-danger offline-toolbar-delete" }
    ],
    filters: {
      searchFirst: false,
      searchLabel: "搜索",
      searchPlaceholder: "任务ID、任务名称",
      searchFields: ["batchNo", "taskName"],
      selects: [
        {
          key: "execution-status",
          field: "executionStatus",
          label: "执行状态",
          options: [
            { value: "", label: "全部状态" },
            { value: "pending", label: "待启动" },
            { value: "running", label: "处理中" },
            { value: "failed", label: "失败" },
            { value: "completed", label: "已完成" }
          ]
        },
        {
          key: "material-type",
          field: "materialType",
          label: "素材类型",
          options: [
            { value: "", label: "全部素材" },
            { value: "video", label: "视频" },
            { value: "image", label: "图片" }
          ]
        }
      ]
    },
    pageSize: 5,
    tableColumns: [
      { key: "select", label: "", type: "select" },
      { key: "batchNo", label: "任务ID", strong: true },
      { key: "taskName", label: "任务名称", strong: true },
      { key: "inputTypeLabel", label: "输入类型" },
      { key: "materialTypeLabel", label: "素材类型" },
      { key: "fileCount", label: "文件数量" },
      { key: "algorithms", label: "分析算法" },
      { key: "executionStatusLabel", label: "执行状态", type: "status", toneField: "executionStatusTone", labelField: "executionStatusLabel" },
      { key: "resultStatusLabel", label: "结果状态", type: "status", toneField: "resultStatusTone", labelField: "resultStatusLabel" },
      { key: "submittedAt", label: "提交时间" },
      { key: "actions", label: "操作" }
    ],
    rows: [
      {
        id: "offline-001",
        batchNo: "OFF-20260317-001",
        taskName: "夜间巡检视频补分析",
        inputTypeLabel: "本地上传",
        materialType: "video",
        materialTypeLabel: "视频",
        fileCount: "3个文件",
        algorithms: "事件检索 / 轨迹回放",
        executionStatus: "pending",
        executionStatusTone: "warning",
        executionStatusLabel: "待启动",
        resultStatusTone: "idle",
        resultStatusLabel: "未开始",
        submittedAt: "2026-03-17 09:18:22",
        actionItems: []
      },
      {
        id: "offline-002",
        batchNo: "OFF-20260317-002",
        taskName: "商品图质重复核验",
        inputTypeLabel: "本地上传",
        materialType: "image",
        materialTypeLabel: "图片",
        fileCount: "128张",
        algorithms: "OCR / 水印检测",
        executionStatus: "running",
        executionStatusTone: "success",
        executionStatusLabel: "处理中",
        resultStatusTone: "success",
        resultStatusLabel: "分析中",
        submittedAt: "2026-03-17 10:02:10",
        actionItems: []
      },
      {
        id: "offline-003",
        batchNo: "OFF-20260317-003",
        taskName: "路口违停图片补跑",
        inputTypeLabel: "本地上传",
        materialType: "image",
        materialTypeLabel: "图片",
        fileCount: "42张",
        algorithms: "占道经营 / 非机动车乱停",
        executionStatus: "failed",
        executionStatusTone: "warning",
        executionStatusLabel: "失败",
        resultStatusTone: "warning",
        resultStatusLabel: "结果异常",
        submittedAt: "2026-03-17 10:31:45",
        actionItems: []
      },
      {
        id: "offline-004",
        batchNo: "OFF-20260317-004",
        taskName: "历史录像切片复盘",
        inputTypeLabel: "本地上传",
        materialType: "video",
        materialTypeLabel: "视频",
        fileCount: "6个文件",
        algorithms: "切片摘要 / 事件检索",
        executionStatus: "completed",
        executionStatusTone: "success",
        executionStatusLabel: "已完成",
        resultStatusTone: "success",
        resultStatusLabel: "结果可用",
        submittedAt: "2026-03-17 11:12:30",
        actionItems: []
      }
    ]
  },
  setup: function (runtime) {
    const page = runtime.page || {};
    const taskPage = page.offlineTaskPage || {};
    const showToast = runtime.showToast || function () {};
    const mockStore = runtime.mockStore;
    const key = page.key || "offline-analysis";
    const selected = Object.create(null);
    let observer = null;

    if (!Array.isArray(taskPage.rows)) {
      taskPage.rows = [];
    }
    migrateLegacyOfflineTaskPage();
    taskPage.rows = taskPage.rows.map(normalizeOfflineTaskRow);
    page.offlineTaskPage.rows = taskPage.rows;

    const modal = mountDetailModal();
    refreshDecorate();

    document.addEventListener("click", onClickCapture, true);
    if (runtime.mountNode) {
      observer = new MutationObserver(function () {
        requestAnimationFrame(refreshDecorate);
      });
      observer.observe(runtime.mountNode, { childList: true, subtree: true });
    }
    requestRefresh();

    return function cleanup() {
      document.removeEventListener("click", onClickCapture, true);
      if (observer) {
        observer.disconnect();
      }
      if (modal.root && modal.root.parentNode) {
        modal.root.parentNode.removeChild(modal.root);
      }
    };

    function mountDetailModal() {
      const root = document.createElement("div");
      root.className = "offline-analysis-modal-root";
      root.innerHTML =
        '<div class="offline-analysis-modal-backdrop" data-oa="mask"></div>' +
        '<section class="offline-analysis-modal" data-oa="dialog" role="dialog" aria-modal="true">' +
        '<header class="offline-analysis-modal-header">' +
        '<div><h3 class="offline-analysis-modal-title">任务详情</h3></div>' +
        '<button class="offline-analysis-modal-close" type="button" data-oa-action="close">×</button>' +
        '</header>' +
        '<div class="offline-analysis-modal-body" id="offline-analysis-detail-body"></div>' +
        '<footer class="offline-analysis-modal-footer">' +
        '<button class="button-secondary" type="button" data-oa-action="close">关闭</button>' +
        '</footer>' +
        '</section>';
      document.body.appendChild(root);
      return {
        root: root,
        mask: root.querySelector('[data-oa="mask"]'),
        dialog: root.querySelector('[data-oa="dialog"]'),
        body: root.querySelector("#offline-analysis-detail-body")
      };
    }

    function onClickCapture(event) {
      const target = event.target;
      if (target.closest(".page-offline-analysis .offline-toolbar-start")) {
        eat(event);
        batchStart();
        return;
      }
      if (target.closest(".page-offline-analysis .offline-toolbar-delete")) {
        eat(event);
        batchDelete();
        return;
      }
      if (target.closest(".page-offline-analysis .table-row-checkbox")) {
        eat(event);
        toggleCheck(target.closest(".table-row-checkbox"));
        return;
      }
      if (target.closest(".page-offline-analysis .offline-action-link")) {
        eat(event);
        handleRowAction(target.closest("button"));
        return;
      }
      if (target.closest('[data-oa-action="close"]') || target.closest('[data-oa="mask"]')) {
        eat(event);
        closeDetail();
      }
    }

    function eat(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    function refreshDecorate() {
      const tbody = document.getElementById(key + "-table-body");
      syncStaticCopy();
      syncToolbarButtons();
      if (!tbody) {
        return;
      }

      const map = Object.create(null);
      taskPage.rows.forEach(function (row) {
        const rowKey = buildRowMapKey(row);
        if (!map[rowKey]) {
          map[rowKey] = [];
        }
        map[rowKey].push(row);
      });

      Array.prototype.forEach.call(tbody.querySelectorAll("tr"), function (tr) {
        const checkbox = tr.querySelector(".table-row-checkbox");
        if (!checkbox || checkbox.classList.contains("table-row-checkbox-head")) {
          return;
        }

        const row = resolveRowFromTableRow(tr, map);
        const rowId = row && row.id ? row.id : (checkbox.getAttribute("aria-label") || "");
        if (rowId) {
          checkbox.setAttribute("data-row-id", rowId);
        }
        setChecked(checkbox, !!selected[rowId]);
        tr.classList.toggle("row-selected", !!selected[rowId]);

        Array.prototype.forEach.call(tr.querySelectorAll(".offline-action-link"), function (button) {
          button.removeAttribute("data-toast-title");
          button.removeAttribute("data-toast-message");
          button.classList.add("table-action-link");
          if (resolveActionKey(button.textContent) === "delete") {
            button.classList.add("table-action-danger");
          }
          if (rowId) {
            button.setAttribute("data-row-id", rowId);
          }
          button.setAttribute("data-row-action", resolveActionKey(button.textContent));
        });
      });

      const head = document.querySelector(".page-offline-analysis .table-row-checkbox-head");
      if (head) {
        const ids = visibleIds();
        setChecked(head, ids.length > 0 && ids.every(function (id) { return !!selected[id]; }));
      }

      removeToastAttr(".page-offline-analysis .offline-toolbar-start");
      removeToastAttr(".page-offline-analysis .offline-toolbar-delete");
      syncToolbarButtons();
    }

    function migrateLegacyOfflineTaskPage() {
      let changed = false;

      if (!taskPage.filters) {
        taskPage.filters = {};
        changed = true;
      }
      if (taskPage.filters.searchPlaceholder !== "任务ID、任务名称") {
        taskPage.filters.searchPlaceholder = "任务ID、任务名称";
        changed = true;
      }

      if (Array.isArray(taskPage.toolbarActions)) {
        taskPage.toolbarActions.forEach(function (action) {
          if (action && action.action === "start" && action.label !== "启动") {
            action.label = "启动";
            changed = true;
          }
        });
      }

      if (Array.isArray(taskPage.tableColumns)) {
        taskPage.tableColumns.forEach(function (column) {
          if (column && column.key === "batchNo" && column.label !== "任务ID") {
            column.label = "任务ID";
            changed = true;
          }
        });
      }

      if (changed && mockStore && typeof mockStore.patchPage === "function") {
        mockStore.patchPage(key, {
          offlineTaskPage: {
            filters: taskPage.filters,
            toolbarActions: taskPage.toolbarActions,
            tableColumns: taskPage.tableColumns
          }
        });
      }
    }

    function syncStaticCopy() {
      const searchInput = document.getElementById(key + "-search");
      if (searchInput && searchInput.getAttribute("placeholder") !== "任务ID、任务名称") {
        searchInput.setAttribute("placeholder", "任务ID、任务名称");
      }

      const batchColumnIndex = findBatchColumnIndex();
      if (batchColumnIndex > -1) {
        const headers = document.querySelectorAll(".page-offline-analysis .table-shell thead th");
        if (headers[batchColumnIndex] && headers[batchColumnIndex].textContent.trim() !== "任务ID") {
          headers[batchColumnIndex].textContent = "任务ID";
        }
      }

      Array.prototype.forEach.call(document.querySelectorAll(".page-offline-analysis .offline-toolbar-start"), function (button) {
        if (button.textContent.trim() === "启动分析") {
          button.textContent = "启动";
        }
      });
    }

    function findBatchColumnIndex() {
      if (!Array.isArray(taskPage.tableColumns)) {
        return -1;
      }

      for (let index = 0; index < taskPage.tableColumns.length; index += 1) {
        if (taskPage.tableColumns[index] && taskPage.tableColumns[index].key === "batchNo") {
          return index;
        }
      }

      return -1;
    }

    function resolveRowFromTableRow(tr, map) {
      const cells = tr.querySelectorAll("td");
      if (!cells || cells.length < 10) {
        return null;
      }
      const rowKey = (cells[1] ? cells[1].textContent.trim() : "") + "|" + (cells[9] ? cells[9].textContent.trim() : "");
      const list = map[rowKey] || [];
      return list.length ? list.shift() : null;
    }

    function removeToastAttr(selector) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (node) {
        node.removeAttribute("data-toast-title");
        node.removeAttribute("data-toast-message");
      });
    }

    function setChecked(node, checked) {
      node.classList.toggle("checked", !!checked);
      node.setAttribute("aria-pressed", checked ? "true" : "false");
    }

    function toggleCheck(node) {
      if (!node) {
        return;
      }
      if (node.classList.contains("table-row-checkbox-head")) {
        const ids = visibleIds();
        const nextChecked = !node.classList.contains("checked");
        ids.forEach(function (id) {
          if (nextChecked) {
            selected[id] = true;
          } else {
            delete selected[id];
          }
        });
      } else {
        const rowId = node.getAttribute("data-row-id") || node.getAttribute("aria-label") || "";
        if (rowId) {
          if (selected[rowId]) {
            delete selected[rowId];
          } else {
            selected[rowId] = true;
          }
        }
      }
      refreshDecorate();
    }

    function visibleIds() {
      const ids = [];
      Array.prototype.forEach.call(document.querySelectorAll(".page-offline-analysis #" + key + "-table-body .table-row-checkbox[data-row-id]"), function (node) {
        const rowId = node.getAttribute("data-row-id");
        if (rowId) {
          ids.push(rowId);
        }
      });
      return ids;
    }

    function syncToolbarButtons() {
      const count = Object.keys(selected).length;
      const startButton = document.querySelector(".page-offline-analysis .offline-toolbar-start, .page-offline-analysis .offline-toolbar-secondary");
      const deleteButton = document.querySelector(".page-offline-analysis .offline-toolbar-delete, .page-offline-analysis .offline-toolbar-danger");
      if (startButton) {
        startButton.classList.add("button-secondary", "offline-toolbar-start");
        startButton.classList.remove("offline-toolbar-secondary");
      }
      if (deleteButton) {
        deleteButton.classList.add("button-danger", "offline-toolbar-delete");
        deleteButton.classList.remove("offline-toolbar-danger");
      }
      if (startButton) {
        startButton.textContent = count ? "启动(" + count + ")" : "启动";
      }
      if (deleteButton) {
        deleteButton.textContent = count ? "删除(" + count + ")" : "删除";
      }
    }

    function handleRowAction(button) {
      if (!button) {
        return;
      }
      const rowId = button.getAttribute("data-row-id") || resolveRowIdFromButton(button);
      const action = button.getAttribute("data-row-action") || resolveActionKey(button.textContent);
      if (!rowId || !action) {
        return;
      }
      if (action === "detail") {
        openDetail(rowId);
        return;
      }
      if (action === "delete") {
        removeRows([rowId]);
        delete selected[rowId];
        requestRefresh();
        showToast("删除成功", "已删除 1 条离线分析任务。");
        return;
      }
      if (action === "start" || action === "rerun") {
        updateRowsStatus([rowId], "running");
        requestRefresh();
        showToast(action === "start" ? "启动成功" : "重跑成功", "任务已进入处理中状态。");
        return;
      }
      if (action === "pause") {
        updateRowsStatus([rowId], "paused");
        requestRefresh();
        showToast("已暂停", "任务已暂停，可稍后重新启动。");
      }
    }

    function resolveRowIdFromButton(button) {
      const tr = button.closest("tr");
      if (!tr) {
        return "";
      }
      const checkbox = tr.querySelector(".table-row-checkbox");
      return checkbox ? (checkbox.getAttribute("data-row-id") || checkbox.getAttribute("aria-label") || "") : "";
    }

    function batchStart() {
      const ids = Object.keys(selected);
      if (!ids.length) {
        showToast("请先选择", "请至少勾选一条任务再启动。");
        return;
      }
      const changed = updateRowsStatus(ids, "running");
      if (!changed) {
        showToast("无需启动", "所选任务已处于处理中状态。");
        return;
      }
      requestRefresh();
      showToast("启动成功", "已启动 " + changed + " 条离线分析任务。");
    }

    function batchDelete() {
      const ids = Object.keys(selected);
      if (!ids.length) {
        showToast("请先选择", "请至少勾选一条任务再删除。");
        return;
      }
      removeRows(ids);
      ids.forEach(function (id) {
        delete selected[id];
      });
      requestRefresh();
      showToast("删除成功", "已删除 " + ids.length + " 条离线分析任务。");
    }

    function updateRowsStatus(ids, nextState) {
      const idMap = createLookup(ids);
      let changed = 0;
      taskPage.rows = taskPage.rows.map(function (row) {
        const normalized = normalizeOfflineTaskRow(row);
        if (!idMap[normalized.id]) {
          return normalized;
        }
        const updated = applyTaskStatus(normalized, nextState);
        if (updated !== normalized) {
          changed += 1;
        }
        return updated;
      });
      page.offlineTaskPage.rows = taskPage.rows;
      saveRows();
      return changed;
    }

    function removeRows(ids) {
      const idMap = createLookup(ids);
      taskPage.rows = taskPage.rows.filter(function (row) {
        return !idMap[row.id];
      });
      page.offlineTaskPage.rows = taskPage.rows;
      saveRows();
    }

    function saveRows() {
      if (!mockStore || typeof mockStore.patchPage !== "function") {
        return;
      }
      mockStore.patchPage(key, { offlineTaskPage: { rows: taskPage.rows } }, page);
    }

    function requestRefresh() {
      const queryButton = document.getElementById(key + "-query");
      if (queryButton) {
        queryButton.click();
        return;
      }
      const search = document.getElementById(key + "-search");
      if (search) {
        search.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    function openDetail(rowId) {
      const row = findRowById(rowId);
      if (!row) {
        showToast("记录不存在", "当前任务已失效，请刷新页面后重试。");
        return;
      }
      modal.body.innerHTML = renderDetailBody(row);
      modal.mask.classList.add("visible");
      modal.dialog.classList.add("visible");
      document.body.classList.add("offline-analysis-modal-open");
    }

    function closeDetail() {
      modal.mask.classList.remove("visible");
      modal.dialog.classList.remove("visible");
      document.body.classList.remove("offline-analysis-modal-open");
    }

    function findRowById(rowId) {
      return taskPage.rows.find(function (row) {
        return row && row.id === rowId;
      }) || null;
    }
  }
});

function normalizeOfflineTaskRow(row) {
  const nextRow = Object.assign({}, row || {});
  nextRow.actionItems = buildOfflineAnalysisActionItems(nextRow.executionStatus);
  nextRow.detail = buildOfflineAnalysisDetail(nextRow);
  return nextRow;
}

function buildOfflineAnalysisActionItems(status) {
  if (status === "running") {
    return [
      { label: "详情", className: "offline-action-link table-action-link" },
      { label: "暂停", className: "offline-action-link table-action-link" },
      { label: "删除", className: "offline-action-link table-action-link table-action-danger offline-action-link-danger" }
    ];
  }
  if (status === "failed" || status === "completed") {
    return [
      { label: "详情", className: "offline-action-link table-action-link" },
      { label: "重跑", className: "offline-action-link table-action-link" },
      { label: "删除", className: "offline-action-link table-action-link table-action-danger offline-action-link-danger" }
    ];
  }
  return [
    { label: "详情", className: "offline-action-link table-action-link" },
    { label: "启动", className: "offline-action-link table-action-link" },
    { label: "删除", className: "offline-action-link table-action-link table-action-danger offline-action-link-danger" }
  ];
}

function resolveActionKey(text) {
  const label = String(text || "").replace(/\s+/g, "");
  if (label.indexOf("详情") !== -1) {
    return "detail";
  }
  if (label.indexOf("启动") !== -1) {
    return "start";
  }
  if (label.indexOf("暂停") !== -1) {
    return "pause";
  }
  if (label.indexOf("重跑") !== -1 || label.indexOf("重新") !== -1) {
    return "rerun";
  }
  if (label.indexOf("删除") !== -1) {
    return "delete";
  }
  return "";
}

function applyTaskStatus(row, nextState) {
  const current = normalizeOfflineTaskRow(row);
  if (nextState === "running" && current.executionStatus === "running") {
    return current;
  }
  if (nextState === "running") {
    return Object.assign({}, current, {
      executionStatus: "running",
      executionStatusTone: "success",
      executionStatusLabel: "处理中",
      resultStatusTone: "success",
      resultStatusLabel: "分析中",
      submittedAt: formatOfflineAnalysisDateTime(new Date()),
      actionItems: buildOfflineAnalysisActionItems("running"),
      detail: Object.assign({}, current.detail || {}, {
        executionModeLabel: inferExecutionModeLabel(current, current.detail || {}),
        submittedAt: formatOfflineAnalysisDateTime(new Date())
      })
    });
  }
  if (nextState === "paused") {
    return Object.assign({}, current, {
      executionStatus: "pending",
      executionStatusTone: "warning",
      executionStatusLabel: "待启动",
      resultStatusTone: "idle",
      resultStatusLabel: "已暂停",
      actionItems: buildOfflineAnalysisActionItems("pending"),
      detail: Object.assign({}, current.detail || {}, {
        executionModeLabel: inferExecutionModeLabel(current, current.detail || {})
      })
    });
  }
  return current;
}

function buildRowMapKey(row) {
  return String((row && row.batchNo) || "") + "|" + String((row && row.submittedAt) || "");
}

function createLookup(list) {
  const lookup = Object.create(null);
  (Array.isArray(list) ? list : []).forEach(function (item) {
    if (item) {
      lookup[item] = true;
    }
  });
  return lookup;
}

function renderDetailBody(row) {
  const detail = buildOfflineAnalysisDetail(row);
  const algorithms = Array.isArray(detail.algorithmDetails) ? detail.algorithmDetails : [];
  const recipients = Array.isArray(detail.recipients) ? detail.recipients : [];
  const materials = Array.isArray(detail.materials) ? detail.materials : [];
  const resourceSpec = detail.resourceSpec || null;

  return (
    '<div class="offline-analysis-detail-stack">' +
    renderDetailSection(
      '任务概况',
      '<div class="offline-analysis-summary-grid">' +
      renderSummaryField('任务ID', row.batchNo || '--') +
      renderSummaryField('任务名称', detail.taskName || row.taskName || '--') +
      renderSummaryField('输入类型', detail.inputTypeLabel || row.inputTypeLabel || '--') +
      renderSummaryField('素材类型', detail.materialTypeLabel || row.materialTypeLabel || '--') +
      renderSummaryField('文件数量', detail.fileCount || row.fileCount || '--') +
      renderSummaryField('优先级', detail.priorityLabel || '--') +
      renderSummaryField('执行方式', inferExecutionModeLabel(row, detail)) +
      renderSummaryField('执行状态', row.executionStatusLabel || '--') +
      renderSummaryField('结果状态', row.resultStatusLabel || '--') +
      renderSummaryField('提交时间', detail.submittedAt || row.submittedAt || '--', 'full') +
      '</div>'
    ) +
    renderDetailSection(
      '算法配置',
      algorithms.length
        ? renderDetailTable(
          ['算法', '版本', '抽帧间隔', '素材数量', '素材名称'],
          algorithms.map(function (item) {
            return [
              item.label || '--',
              item.version || '--',
              item.intervalLabel || '--',
              item.materialCountLabel || '--',
              renderInlineText(item.materialNames, '暂无素材名称')
            ];
          })
        )
        : renderDetailEmpty('暂无算法配置明细')
    ) +
    renderDetailSection(
      '资源与推送',
      '<div class="offline-analysis-subsection">' +
      '<div class="offline-analysis-subtitle">资源规格</div>' +
      renderKeyValueRows([
        ['规格名称', resourceSpec ? resourceSpec.label : '--'],
        ['规格说明', resourceSpec && resourceSpec.meta ? resourceSpec.meta : '--'],
        ['vCPU', resourceSpec ? resourceSpec.vcpu : '--'],
        ['内存', resourceSpec ? ((resourceSpec.memoryGB || '--') + ' GB') : '--'],
        ['GPU', resourceSpec ? resourceSpec.gpu : '--'],
        ['显存', resourceSpec ? resourceSpec.gpuMemoryGB : '--'],
        ['磁盘', resourceSpec ? ((resourceSpec.diskGB || '--') + ' GB') : '--']
      ]) +
      '</div>' +
      '<div class="offline-analysis-subsection">' +
      '<div class="offline-analysis-subtitle">告警推送</div>' +
      (recipients.length
        ? renderDetailTable(
          ['名称', '地址', '绑定任务', '状态'],
          recipients.map(function (item) {
            return [
              item.label || '--',
              item.url || '--',
              item.bindTask || '--',
              item.status || '--'
            ];
          })
        )
        : renderDetailEmpty('当前任务未配置告警推送地址')) +
      '</div>'
    ) +
    renderDetailSection(
      '素材明细',
      materials.length
        ? renderDetailTable(
          ['素材名称', '来源', '封面', '时长', '分辨率', '大小', '状态'],
          materials.map(function (item) {
            return [
              item.name || '--',
              item.sourceLabel || '--',
              item.cover || '--',
              item.duration || '--',
              item.resolution || '--',
              item.size || '--',
              item.statusLabel || '--'
            ];
          })
        )
        : renderDetailEmpty('暂无逐项素材清单')
    ) +
    '</div>'
  );
}

function renderSummaryField(label, value, className) {
  return (
    '<div class="offline-analysis-summary-field' + (className ? ' ' + className : '') + '">' +
    '<div class="offline-analysis-summary-label">' + escapeOfflineAnalysisHtml(label) + '</div>' +
    '<div class="offline-analysis-summary-value">' + escapeOfflineAnalysisHtml(value) + '</div>' +
    '</div>'
  );
}

function renderDetailSection(title, content) {
  return (
    '<section class="offline-analysis-detail-section">' +
    '<div class="offline-analysis-detail-section-title">' + escapeOfflineAnalysisHtml(title) + '</div>' +
    content +
    '</section>'
  );
}

function renderDetailEmpty(text) {
  return '<div class="offline-analysis-detail-empty">' + escapeOfflineAnalysisHtml(text) + '</div>';
}

function renderInlineText(list, emptyText) {
  const items = Array.isArray(list) ? list.filter(Boolean) : [];
  if (!items.length) {
    return '<span class="offline-analysis-text-muted">' + escapeOfflineAnalysisHtml(emptyText || '--') + '</span>';
  }
  return escapeOfflineAnalysisHtml(items.join(' / '));
}

function renderKeyValueRows(rows) {
  return (
    '<div class="offline-analysis-kv-list">' +
    (Array.isArray(rows) ? rows : []).map(function (item) {
      return (
        '<div class="offline-analysis-kv-row">' +
        '<div class="offline-analysis-kv-key">' + escapeOfflineAnalysisHtml(item[0] || '--') + '</div>' +
        '<div class="offline-analysis-kv-value">' + escapeOfflineAnalysisHtml(item[1] || '--') + '</div>' +
        '</div>'
      );
    }).join('') +
    '</div>'
  );
}

function renderDetailTable(headers, rows) {
  return (
    '<div class="offline-analysis-table-wrap">' +
    '<table class="offline-analysis-detail-table">' +
    '<thead><tr>' + (Array.isArray(headers) ? headers : []).map(function (header) {
      return '<th>' + escapeOfflineAnalysisHtml(header) + '</th>';
    }).join('') + '</tr></thead>' +
    '<tbody>' + (Array.isArray(rows) ? rows : []).map(function (row) {
      return '<tr>' + row.map(function (cell) {
        return '<td>' + String(cell == null ? '--' : cell) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>' +
    '</table>' +
    '</div>'
  );
}

function inferExecutionModeLabel(row, detail) {
  if (detail && detail.executionModeLabel && detail.executionModeLabel !== '--') {
    return detail.executionModeLabel;
  }
  if (row && row.resultStatusLabel === '未开始') {
    return '草稿保存';
  }
  return '立即启动';
}

function buildOfflineAnalysisDetail(row) {
  const source = row && row.detail && typeof row.detail === 'object' ? row.detail : {};
  const algorithms = Array.isArray(source.algorithmDetails) && source.algorithmDetails.length
    ? source.algorithmDetails
    : String((row && row.algorithms) || '').split('/').map(function (item, index) {
      const label = String(item || '').trim();
      if (!label) {
        return null;
      }
      return {
        key: 'algorithm-' + index,
        label: label,
        version: 'V1.0',
        intervalLabel: '5秒',
        materialCountLabel: (row && row.fileCount) || '--',
        materialNames: []
      };
    }).filter(Boolean);
  const materials = Array.isArray(source.materials) && source.materials.length
    ? source.materials
    : [{
      name: row && row.taskName ? row.taskName + ' 素材包' : '当前任务素材',
      sourceLabel: source.inputTypeLabel || (row && row.inputTypeLabel) || '--',
      cover: (row && row.materialTypeLabel) || '--',
      duration: '--',
      resolution: '--',
      size: (row && row.fileCount) || '--',
      statusLabel: (row && row.resultStatusLabel) || '--'
    }];

  return {
    taskName: source.taskName || (row && row.taskName) || '--',
    inputTypeLabel: source.inputTypeLabel || (row && row.inputTypeLabel) || '--',
    materialTypeLabel: source.materialTypeLabel || (row && row.materialTypeLabel) || '--',
    fileCount: source.fileCount || (row && row.fileCount) || '--',
    priorityLabel: source.priorityLabel || inferPriorityLabel(row, source),
    executionModeLabel: source.executionModeLabel || inferExecutionModeLabel(row, source),
    submittedAt: source.submittedAt || (row && row.submittedAt) || '--',
    algorithmDetails: algorithms,
    resourceSpec: source.resourceSpec || null,
    recipients: Array.isArray(source.recipients) ? source.recipients : [],
    materials: materials
  };
}

function inferPriorityLabel(row, source) {
  if (source && source.priorityLabel) {
    return source.priorityLabel;
  }
  if (row && row.priorityLabel) {
    return row.priorityLabel;
  }
  return '中';
}

function formatOfflineAnalysisDateTime(date) {
  const value = date instanceof Date ? date : new Date();
  return value.getFullYear() + '-' +
    padOfflineAnalysisNumber(value.getMonth() + 1) + '-' +
    padOfflineAnalysisNumber(value.getDate()) + ' ' +
    padOfflineAnalysisNumber(value.getHours()) + ':' +
    padOfflineAnalysisNumber(value.getMinutes()) + ':' +
    padOfflineAnalysisNumber(value.getSeconds());
}

function padOfflineAnalysisNumber(value) {
  return value < 10 ? '0' + value : String(value);
}

function escapeOfflineAnalysisHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
