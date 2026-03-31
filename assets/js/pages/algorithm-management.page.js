(function () {
  const utils = window.PROTOTYPE_UTILS;
  const shell = window.PROTOTYPE_SHELL;

  const ANALYSIS_TYPE_OPTIONS = [
    { value: "", label: "全部" },
    { value: "detection", label: "检测" },
    { value: "recognition", label: "识别" },
    { value: "analysis", label: "分析" }
  ];

  const SOURCE_TYPE_OPTIONS = [
    { value: "", label: "全部" },
    { value: "video", label: "视频" },
    { value: "image", label: "图片" },
    { value: "multimodal", label: "多模态" }
  ];

  const SEED_ROWS = [
    {
      id: "alg-123",
      algorithmId: "123",
      name: "人群聚集",
      code: "CR_GATHER",
      analysisType: "detection",
      analysisTypeLabel: "检测",
      sourceType: "video",
      sourceTypeLabel: "视频",
      version: "V1.0",
      createdAt: "2025-10-10",
      owner: "algo.zhang",
      enabled: true,
      description: "针对园区、商场和公共场所的人群密度异常增长进行检测预警。",
      accuracy: "95.2%",
      runtimeEnv: "TensorRT / CUDA 12.2"
    },
    {
      id: "alg-124",
      algorithmId: "124",
      name: "违停检测",
      code: "PARKING_ALERT",
      analysisType: "detection",
      analysisTypeLabel: "检测",
      sourceType: "video",
      sourceTypeLabel: "视频",
      version: "V1.2",
      createdAt: "2025-10-09",
      owner: "algo.liu",
      enabled: true,
      description: "针对重点区域长时间占道停车场景进行持续跟踪和告警。",
      accuracy: "93.8%",
      runtimeEnv: "PyTorch 2.2 / CUDA 12.2"
    },
    {
      id: "alg-125",
      algorithmId: "125",
      name: "河道垃圾",
      code: "RIVER_GARBAGE",
      analysisType: "recognition",
      analysisTypeLabel: "识别",
      sourceType: "video",
      sourceTypeLabel: "视频",
      version: "V1.1",
      createdAt: "2025-10-08",
      owner: "algo.he",
      enabled: true,
      description: "识别河道、水面漂浮垃圾与杂物堆积情况，支持巡检记录归档。",
      accuracy: "92.4%",
      runtimeEnv: "ONNX Runtime / CUDA 11.8"
    },
    {
      id: "alg-126",
      algorithmId: "126",
      name: "人脸识别",
      code: "FACE_RECOG",
      analysisType: "recognition",
      analysisTypeLabel: "识别",
      sourceType: "image",
      sourceTypeLabel: "图片",
      version: "V2.0",
      createdAt: "2025-10-08",
      owner: "algo.chen",
      enabled: true,
      description: "支持静态抓拍图的人脸特征抽取、比对与相似度检索。",
      accuracy: "97.6%",
      runtimeEnv: "TensorRT / CUDA 12.2"
    },
    {
      id: "alg-127",
      algorithmId: "127",
      name: "烟火识别",
      code: "SMOKE_FIRE",
      analysisType: "detection",
      analysisTypeLabel: "检测",
      sourceType: "video",
      sourceTypeLabel: "视频",
      version: "V1.0",
      createdAt: "2025-10-07",
      owner: "algo.wu",
      enabled: true,
      description: "用于识别明火、烟雾和火情早期异常征兆。",
      accuracy: "94.1%",
      runtimeEnv: "PyTorch 2.1 / CUDA 11.8"
    },
    {
      id: "alg-128",
      algorithmId: "128",
      name: "人员离岗",
      code: "POST_ABSENCE",
      analysisType: "analysis",
      analysisTypeLabel: "分析",
      sourceType: "video",
      sourceTypeLabel: "视频",
      version: "V1.3",
      createdAt: "2025-10-06",
      owner: "algo.sun",
      enabled: false,
      description: "面向值守岗位的离岗、缺岗、长时无人值守分析模型。",
      accuracy: "91.7%",
      runtimeEnv: "TensorRT / CUDA 11.8"
    },
    {
      id: "alg-129",
      algorithmId: "129",
      name: "工装合规",
      code: "PPE_CHECK",
      analysisType: "detection",
      analysisTypeLabel: "检测",
      sourceType: "image",
      sourceTypeLabel: "图片",
      version: "V2.1",
      createdAt: "2025-10-05",
      owner: "algo.fan",
      enabled: true,
      description: "识别安全帽、反光衣等工装穿戴合规情况。",
      accuracy: "96.3%",
      runtimeEnv: "TensorRT / CUDA 12.2"
    }
  ];

  const SYNC_RESULT_TEMPLATES = [
    ["施工安全帽检测", "安全帽识别", "HELMET_GUARD"],
    ["工服穿戴检测", "工装合规", "PPE_CHECK"],
    ["烟雾识别模型", "烟火识别", "SMOKE_FIRE"],
    ["河道漂浮物识别", "河道垃圾", "RIVER_GARBAGE"],
    ["区域值守分析", "人员离岗", "POST_ABSENCE"],
    ["园区人流分析", "人群聚集", "CR_GATHER"],
    ["停车秩序模型", "违停检测", "PARKING_ALERT"],
    ["周界越界识别", "越界检测", "BOUNDARY_ALERT"],
    ["明厨亮灶模型", "厨帽识别", "CHEF_CAP"],
    ["明火识别模型", "火焰检测", "FIRE_ALERT"]
  ];

  window.registerPrototypePage({
    key: "algorithm-management",
    kind: "table",
    styleSource: "../assets/css/pages/algorithm-management.css",
    heading: "算法管理",
    subtitle: "集中维护算法资产、版本信息和适用分析源类型。",
    tablePanel: {},
    countTextPrefix: "共",
    countTextUnit: "条记录",
    emptyText: "暂无算法数据",
    productDoc: {
      title: "算法管理需求说明",
      summary: "该页面用于查看算法基础信息，并提供新增、禁用、删除等维护入口。",
      goal: "让算法运营和平台管理员在单页内完成算法检索、状态管理和台账维护。",
      modules: [
        "顶部工具栏：提供新增算法、批量禁用、批量删除操作。",
        "筛选区：支持按分析类型、分析源类型和关键字筛选。",
        "算法列表：展示算法ID、名称、标识、适配源类型、版本和创建时间。",
        "详情弹窗：集中查看算法负责人、运行环境、准确率和场景说明。"
      ],
      rules: [
        "算法ID与算法标识在页面内应保持唯一。",
        "禁用算法后不删除记录，仅阻止其继续被新任务引用。",
        "删除操作仅对当前勾选记录生效，且为原型级演示。"
      ],
      interactions: [
        "关键字支持匹配算法ID、算法名称与算法标识。",
        "行内详情会弹出算法详情窗口，便于快速查看参数说明。",
        "新增算法通过轻量弹窗完成录入，提交后列表即时更新。"
      ],
      pending: [
        "待确认后续是否补充算法标签、适配硬件信息和模型包下载入口。"
      ]
    },
    algorithmManagePage: {
      pageSize: 5,
      filters: {
        searchFields: ["algorithmId", "name", "code"],
        analysisTypeOptions: ANALYSIS_TYPE_OPTIONS,
        sourceTypeOptions: SOURCE_TYPE_OPTIONS
      },
      rows: SEED_ROWS
    },
    renderTablePanel: function (context) {
      const page = context.page;
      const renderTableFooter = context.renderTableFooter;

      return (
        '<section class="panel">' +
        shell.renderPanelHeader(null, page.tablePanel || { title: page.heading || "" }) +
        '<div class="table-toolbar">' +
        '<div class="toolbar-group">' +
        '<button id="algorithm-management-create" class="button algorithm-toolbar-create" type="button">新增算法</button>' +
        '<button id="algorithm-management-disable" class="button-secondary algorithm-toolbar-disable" type="button">禁用</button>' +
        '<button id="algorithm-management-delete" class="button-danger algorithm-toolbar-delete" type="button">删除</button>' +
        '</div>' +
        '<div class="toolbar-group">' +
        renderFilter("分析类型", '<select id="algorithm-management-filter-analysis-type" class="filter-field">' + renderOptions(ANALYSIS_TYPE_OPTIONS) + "</select>") +
        renderFilter("分析源类型", '<select id="algorithm-management-filter-source-type" class="filter-field">' + renderOptions(SOURCE_TYPE_OPTIONS) + "</select>") +
        renderFilter("搜索", '<input id="algorithm-management-search" class="filter-field" type="search" placeholder="算法ID、算法名称、算法标识" />') +
        '<button id="algorithm-management-query" class="button" type="button">查询</button>' +
        '<button id="algorithm-management-reset" class="button-secondary" type="button">重置</button>' +
        '</div>' +
        '</div>' +
        '<div class="table-shell">' +
        '<table>' +
        '<thead><tr>' +
        '<th class="table-select-cell"><button id="algorithm-management-select-all" class="table-row-checkbox table-row-checkbox-head" type="button" aria-label="全选"></button></th>' +
        '<th>算法ID</th>' +
        '<th>算法名称</th>' +
        '<th>算法标识</th>' +
        '<th>分析类型</th>' +
        '<th>分析源类型</th>' +
        '<th>算法版本</th>' +
        '<th>创建时间</th>' +
        '<th>操作</th>' +
        '</tr></thead>' +
        '<tbody id="algorithm-management-table-body"></tbody>' +
        '</table>' +
        '</div>' +
        renderTableFooter(page) +
        renderAddModal() +
        renderDetailModal() +
        '<div id="algorithm-management-modal-backdrop" class="algorithm-manage-modal-backdrop"></div>' +
        '</section>'
      );
    },
    setup: function (runtime) {
      const page = runtime.page || {};
      const algoPage = page.algorithmManagePage || {};
      const showToast = runtime.showToast || function () {};
      const navigateToRoute = runtime.navigateToRoute || function () {};
      const mockStore = runtime.mockStore;
      const mountNode = runtime.mountNode;
      const selected = Object.create(null);
      const addState = createDefaultAddState();
      let currentPage = 1;
      let detailRowId = "";
      let addOpen = false;
      let detailOpen = false;
      let syncTimer = 0;

      if (!Array.isArray(algoPage.rows)) {
        algoPage.rows = [];
      }

      const searchInput = document.getElementById("algorithm-management-search");
      const analysisTypeSelect = document.getElementById("algorithm-management-filter-analysis-type");
      const sourceTypeSelect = document.getElementById("algorithm-management-filter-source-type");
      const disableButton = document.getElementById("algorithm-management-disable");
      const deleteButton = document.getElementById("algorithm-management-delete");
      const selectAllButton = document.getElementById("algorithm-management-select-all");
      const tbody = document.getElementById("algorithm-management-table-body");
      const countNode = document.getElementById("algorithm-management-count");
      const paginationNode = document.getElementById("algorithm-management-pagination");
      const backdrop = document.getElementById("algorithm-management-modal-backdrop");
      const addModal = document.getElementById("algorithm-management-add-modal");
      const addContent = document.getElementById("algorithm-add-content");
      const addSubmitButton = document.getElementById("algorithm-management-add-submit");
      const localUploadInput = document.getElementById("algorithm-local-upload-input");
      const detailModal = document.getElementById("algorithm-management-detail-modal");

      function createDefaultAddState() {
        const platformConfigured = window.localStorage.getItem("algorithm-training-platform-configured") === "true";
        return {
          mode: "local",
          localFileName: "",
          localFileSize: 0,
          platformConfigured: platformConfigured,
          syncStatus: platformConfigured ? "idle" : "unconfigured",
          syncProgress: 0,
          syncStepIndex: -1,
          syncPhaseText: "尚未开始同步",
          syncResults: []
        };
      }

      function getFilteredRows() {
        const keyword = utils.normalize(searchInput ? searchInput.value : "");
        const analysisType = analysisTypeSelect ? analysisTypeSelect.value : "";
        const sourceType = sourceTypeSelect ? sourceTypeSelect.value : "";
        const searchFields = (algoPage.filters && algoPage.filters.searchFields) || ["algorithmId", "name", "code"];

        return algoPage.rows.filter(function (row) {
          const keywordMatch =
            !keyword ||
            searchFields.some(function (field) {
              return utils.normalize(row[field]).includes(keyword);
            });
          const analysisMatch = !analysisType || row.analysisType === analysisType;
          const sourceMatch = !sourceType || row.sourceType === sourceType;
          return keywordMatch && analysisMatch && sourceMatch;
        });
      }

      function renderRow(row) {
        return (
          '<tr class="' + (row.enabled === false ? "algorithm-row-disabled" : "") + '" data-row-id="' + utils.escapeAttribute(row.id) + '">' +
          '<td class="table-select-cell"><button class="table-row-checkbox" type="button" aria-label="' + utils.escapeAttribute(row.id) + '" data-row-id="' + utils.escapeAttribute(row.id) + '"></button></td>' +
          '<td><strong>' + utils.escapeHtml(row.algorithmId) + "</strong></td>" +
          '<td><span class="algorithm-name-cell"><strong>' + utils.escapeHtml(row.name) + "</strong>" + (row.enabled === false ? '<span class="algorithm-disabled-tag">已禁用</span>' : "") + "</span></td>" +
          '<td><span class="algorithm-code">' + utils.escapeHtml(row.code) + "</span></td>" +
          '<td>' + utils.escapeHtml(row.analysisTypeLabel) + "</td>" +
          '<td>' + utils.escapeHtml(row.sourceTypeLabel) + "</td>" +
          '<td><span class="algorithm-version-chip">' + utils.escapeHtml(row.version) + "</span></td>" +
          '<td>' + utils.escapeHtml(row.createdAt) + "</td>" +
          '<td><div class="table-actions">' +
          '<button class="table-action table-action-link" type="button" data-row-action="detail" data-row-id="' + utils.escapeAttribute(row.id) + '">详情</button>' +
          '<button class="table-action table-action-link" type="button" data-row-action="' + (row.enabled === false ? "enable" : "disable") + '" data-row-id="' + utils.escapeAttribute(row.id) + '">' + (row.enabled === false ? "启用" : "禁用") + "</button>" +
          '<button class="table-action table-action-link table-action-danger" type="button" data-row-action="delete" data-row-id="' + utils.escapeAttribute(row.id) + '">删除</button>' +
          "</div></td>" +
          "</tr>"
        );
      }

      function renderTable() {
        const rows = getFilteredRows();
        const pageSize = Math.max(Number(algoPage.pageSize) || 5, 1);
        const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
        currentPage = Math.min(Math.max(currentPage, 1), totalPages);
        const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        if (tbody) {
          tbody.innerHTML = pagedRows.length
            ? pagedRows.map(function (row) { return renderRow(row); }).join("")
            : '<tr><td colspan="9"><div class="empty-state">' + utils.escapeHtml(page.emptyText || "暂无数据") + "</div></td></tr>";
        }

        if (countNode) {
          countNode.textContent = String(page.countTextPrefix || "") + rows.length + String(page.countTextUnit || "");
        }

        if (paginationNode) {
          paginationNode.innerHTML = buildPaginationHtml(currentPage, totalPages);
        }

        syncSelectedRows();
        syncBatchButtons();
        syncDetailModal();
      }

      function getVisibleRowIds() {
        return Array.prototype.map.call(mountNode.querySelectorAll("#algorithm-management-table-body tr[data-row-id]"), function (rowNode) {
          return rowNode.getAttribute("data-row-id");
        }).filter(Boolean);
      }

      function syncSelectedRows() {
        const visibleIds = getVisibleRowIds();

        Array.prototype.forEach.call(mountNode.querySelectorAll("#algorithm-management-table-body .table-row-checkbox"), function (button) {
          const rowId = button.getAttribute("data-row-id") || "";
          const checked = !!selected[rowId];
          button.classList.toggle("checked", checked);
          button.setAttribute("aria-pressed", checked ? "true" : "false");
          const rowNode = button.closest("tr");
          if (rowNode) {
            rowNode.classList.toggle("row-selected", checked);
          }
        });

        if (selectAllButton) {
          const allChecked = visibleIds.length > 0 && visibleIds.every(function (id) { return !!selected[id]; });
          selectAllButton.classList.toggle("checked", allChecked);
          selectAllButton.setAttribute("aria-pressed", allChecked ? "true" : "false");
        }
      }

      function syncBatchButtons() {
        const ids = Object.keys(selected);
        const selectedRows = algoPage.rows.filter(function (row) { return !!selected[row.id]; });
        const disableEligible = selectedRows.filter(function (row) { return row.enabled !== false; }).length;

        if (disableButton) {
          disableButton.disabled = false;
          disableButton.textContent = ids.length ? "禁用(" + disableEligible + ")" : "禁用";
        }

        if (deleteButton) {
          deleteButton.disabled = false;
          deleteButton.textContent = ids.length ? "删除(" + ids.length + ")" : "删除";
        }
      }

      function findRow(rowId) {
        return algoPage.rows.find(function (row) {
          return row.id === rowId;
        }) || null;
      }

      function syncDetailModal() {
        if (!detailModal) {
          return;
        }

        const row = findRow(detailRowId);
        const detailData = getAlgorithmDetailData(row);
        const nameNode = detailModal.querySelector("[data-algorithm-detail='name']");
        const fieldMap = {
          algorithmId: row ? row.algorithmId : "--",
          name: row ? row.name : "--",
          code: row ? row.code : "--",
          analysisType: row ? row.analysisTypeLabel : "--",
          sourceType: row ? row.sourceTypeLabel : "--",
          createdAt: detailData.createdAt,
          description: detailData.description
        };

        if (nameNode) {
          nameNode.textContent = "算法详情";
        }

        Object.keys(fieldMap).forEach(function (key) {
          const node = detailModal.querySelector("[data-algorithm-field='" + key + "']");
          if (node) {
            node.textContent = fieldMap[key];
          }
        });

        const versionSelect = detailModal.querySelector("[data-algorithm-field='version']");
        if (versionSelect) {
          versionSelect.innerHTML = detailData.versions.map(function (version) {
            return '<option value="' + utils.escapeAttribute(version) + '"' + (row && row.version === version ? " selected" : "") + ">" + utils.escapeHtml(version) + "</option>";
          }).join("");
        }

        const baseTableBody = detailModal.querySelector("[data-algorithm-spec='base']");
        if (baseTableBody) {
          baseTableBody.innerHTML = detailData.baseSpecs.map(function (item) {
            return "<tr>" +
              "<td>" + utils.escapeHtml(item.cpu) + "</td>" +
              "<td>" + utils.escapeHtml(item.memory) + "</td>" +
              "<td>" + utils.escapeHtml(item.videoMemory) + "</td>" +
              "<td>" + utils.escapeHtml(item.disk) + "</td>" +
              "<td>" + utils.escapeHtml(item.platform) + "</td>" +
              "<td>" + utils.escapeHtml(item.runtime) + "</td>" +
              "</tr>";
          }).join("");
        }

        const videoTableBody = detailModal.querySelector("[data-algorithm-spec='video']");
        if (videoTableBody) {
          videoTableBody.innerHTML = detailData.videoSpecs.map(function (item) {
            return "<tr>" +
              "<td>" + utils.escapeHtml(item.resolution) + "</td>" +
              "<td>" + utils.escapeHtml(item.utilization) + "</td>" +
              "<td>" + utils.escapeHtml(item.capacity) + "</td>" +
              "</tr>";
          }).join("");
        }
      }

      function createLookup(ids) {
        return ids.reduce(function (acc, id) {
          acc[id] = true;
          return acc;
        }, Object.create(null));
      }

      function saveRows() {
        page.algorithmManagePage.rows = algoPage.rows;
        if (mockStore && typeof mockStore.patchPage === "function") {
          mockStore.patchPage(page.key, {
            algorithmManagePage: {
              rows: algoPage.rows
            }
          }, page);
        }
      }

      function stopSync() {
        if (syncTimer) {
          window.clearInterval(syncTimer);
          syncTimer = 0;
        }
      }

      function resetAddState() {
        stopSync();
        Object.assign(addState, createDefaultAddState());
        if (localUploadInput) {
          localUploadInput.value = "";
        }
        renderAddState();
      }

      function getNextAlgorithmId() {
        const numbers = algoPage.rows.map(function (row) {
          return Number(row.algorithmId);
        }).filter(function (value) {
          return Number.isFinite(value);
        });

        return String((numbers.length ? Math.max.apply(Math, numbers) : 129) + 1);
      }

      function buildAlgorithmCode(seed, fallbackPrefix) {
        const safeSeed = String(seed || "")
          .replace(/\.zip$/i, "")
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");

        return safeSeed || (fallbackPrefix || "ALG_PACKAGE");
      }

      function getUniqueAlgorithmCode(seed, fallbackPrefix) {
        const baseCode = buildAlgorithmCode(seed, fallbackPrefix);
        const used = createLookup(algoPage.rows.map(function (row) {
          return utils.normalize(row.code);
        }));
        let candidate = baseCode;
        let index = 1;

        while (used[utils.normalize(candidate)]) {
          candidate = baseCode + "_" + index;
          index += 1;
        }

        return candidate;
      }

      function createAlgorithmRow(config) {
        const algorithmId = config.algorithmId || getNextAlgorithmId();
        return {
          id: "alg-" + algorithmId,
          algorithmId: algorithmId,
          name: config.name,
          code: config.code,
          analysisType: config.analysisType,
          analysisTypeLabel: getOptionLabel(ANALYSIS_TYPE_OPTIONS, config.analysisType),
          sourceType: config.sourceType,
          sourceTypeLabel: getOptionLabel(SOURCE_TYPE_OPTIONS, config.sourceType),
          version: config.version,
          createdAt: formatToday(),
          owner: config.owner || "algo.new",
          enabled: true,
          description: config.description || "新增算法，待补充详细场景说明。",
          accuracy: config.accuracy || "--",
          runtimeEnv: config.runtimeEnv || "待确认"
        };
      }

      function inferAnalysisType(name) {
        if (/分析/.test(name)) {
          return "analysis";
        }
        if (/识别|recog|recognition|helmet|face/i.test(name)) {
          return "recognition";
        }
        return "detection";
      }

      function inferSourceType(name) {
        if (/image|img|photo|face|图/i.test(name)) {
          return "image";
        }
        return "video";
      }

      function buildSyncResults() {
        const presets = [
          { templateIndex: 0, analysisType: "recognition", sourceType: "image", version: "V3.2.1", status: "success", detail: "已同步模型包、标签和运行环境。", runtimeEnv: "TensorRT / CUDA 12.2" },
          { templateIndex: 7, analysisType: "detection", sourceType: "video", version: "V2.4.0", status: "success", detail: "已拉取训练平台发布版本。", runtimeEnv: "PyTorch 2.2 / CUDA 12.2" },
          { templateIndex: 8, analysisType: "recognition", sourceType: "image", version: "V1.7.3", status: "success", detail: "已同步算法描述与模型摘要。", runtimeEnv: "ONNX Runtime / CUDA 11.8" },
          { templateIndex: 9, analysisType: "detection", sourceType: "video", version: "V2.0.5", status: "success", detail: "部署包校验通过，可直接入库。", runtimeEnv: "TensorRT / CUDA 12.2" },
          { templateIndex: 5, analysisType: "analysis", sourceType: "video", version: "V1.8.0", status: "duplicate", detail: "当前仓库已存在相同算法标识。", runtimeEnv: "TensorRT / CUDA 11.8" },
          { templateIndex: 1, analysisType: "detection", sourceType: "image", version: "V2.3.0", status: "duplicate", detail: "已有同名算法版本，已跳过导入。", runtimeEnv: "TensorRT / CUDA 12.2" },
          { templateIndex: 3, analysisType: "recognition", sourceType: "video", version: "V1.5.2", status: "failed", detail: "模型包校验失败，请在训练平台重新发布。", runtimeEnv: "待确认" }
        ];

        return presets.map(function (item, index) {
          const template = SYNC_RESULT_TEMPLATES[item.templateIndex] || [];
          return {
            id: "sync-result-" + index,
            trainName: template[0] || "训练平台算法",
            name: template[1] || "待同步算法",
            code: template[2] || ("SYNC_CODE_" + index),
            analysisType: item.analysisType,
            sourceType: item.sourceType,
            version: item.version,
            owner: "train.sync",
            status: item.status,
            detail: item.detail,
            runtimeEnv: item.runtimeEnv
          };
        });
      }

      function getImportableSyncResults() {
        return addState.syncResults.filter(function (item) {
          return item.status === "success";
        });
      }

      function updateAddFooter() {
        if (!addSubmitButton) {
          return;
        }

        if (addState.mode === "local") {
          addSubmitButton.textContent = "导入算法";
          addSubmitButton.disabled = !addState.localFileName;
          return;
        }

        addSubmitButton.textContent = "导入结果";
        addSubmitButton.disabled = addState.syncStatus !== "result" || !getImportableSyncResults().length;
      }

      function renderAddState() {
        if (!addContent || !addModal) {
          return;
        }

        addContent.innerHTML = addState.mode === "local"
          ? renderLocalUploadPanel(addState)
          : renderSyncPanel(addState);

        Array.prototype.forEach.call(addModal.querySelectorAll("[data-algorithm-mode]"), function (button) {
          const isActive = button.getAttribute("data-algorithm-mode") === addState.mode;
          button.classList.toggle("active", isActive);
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        updateAddFooter();
      }

      function startSyncTimer() {
        stopSync();
        syncTimer = window.setInterval(function () {
          advanceSyncStep();
        }, 520);
      }

      function advanceSyncStep() {
        const phases = [
          { progress: 16, text: "已连接训练平台，正在校验凭证信息" },
          { progress: 38, text: "正在拉取算法清单和版本元数据" },
          { progress: 61, text: "正在校验模型包摘要与描述信息" },
          { progress: 84, text: "正在比对本地仓库中的重复算法" },
          { progress: 100, text: "同步完成，已生成同步结果" }
        ];

        addState.syncStepIndex += 1;
        const phase = phases[Math.min(addState.syncStepIndex, phases.length - 1)];
        addState.syncProgress = phase.progress;
        addState.syncPhaseText = phase.text;

        if (phase.progress >= 100) {
          stopSync();
          addState.syncStatus = "result";
          addState.syncResults = buildSyncResults();
        }

        renderAddState();
      }

      function startSync() {
        if (!addState.platformConfigured) {
          showToast("尚未配置", "请先完成训练平台连接配置。");
          return;
        }

        addState.syncStatus = "syncing";
        addState.syncProgress = 0;
        addState.syncStepIndex = -1;
        addState.syncPhaseText = "正在准备同步任务";
        addState.syncResults = [];
        advanceSyncStep();

        if (addState.syncStatus === "syncing") {
          startSyncTimer();
        }
      }

      function pauseOrResumeSync() {
        if (addState.syncStatus === "syncing") {
          addState.syncStatus = "paused";
          addState.syncPhaseText = "同步已暂停，可继续完成本次导入";
          stopSync();
          renderAddState();
          return;
        }

        if (addState.syncStatus === "paused") {
          addState.syncStatus = "syncing";
          addState.syncPhaseText = "正在继续同步训练平台数据";
          renderAddState();
          startSyncTimer();
        }
      }

      function cancelSync() {
        stopSync();
        addState.syncStatus = "idle";
        addState.syncProgress = 0;
        addState.syncStepIndex = -1;
        addState.syncPhaseText = "已取消当前同步任务";
        addState.syncResults = [];
        renderAddState();
      }

      function toggleRowSelection(rowId) {
        if (!rowId) {
          return;
        }

        if (selected[rowId]) {
          delete selected[rowId];
        } else {
          selected[rowId] = true;
        }

        syncSelectedRows();
        syncBatchButtons();
      }

      function toggleAllSelection() {
        const ids = getVisibleRowIds();
        const allChecked = ids.length > 0 && ids.every(function (id) { return !!selected[id]; });

        ids.forEach(function (id) {
          if (allChecked) {
            delete selected[id];
          } else {
            selected[id] = true;
          }
        });

        syncSelectedRows();
        syncBatchButtons();
      }

      function removeRows(ids) {
        const lookup = createLookup(ids);
        algoPage.rows = algoPage.rows.filter(function (row) {
          return !lookup[row.id];
        });
        page.algorithmManagePage.rows = algoPage.rows;

        ids.forEach(function (id) {
          delete selected[id];
        });

        if (detailRowId && lookup[detailRowId]) {
          closeDetail();
        }

        saveRows();
        renderTable();
      }

      function setRowsEnabled(ids, enabled) {
        const lookup = createLookup(ids);
        algoPage.rows = algoPage.rows.map(function (row) {
          if (!lookup[row.id]) {
            return row;
          }

          return Object.assign({}, row, { enabled: enabled });
        });
        page.algorithmManagePage.rows = algoPage.rows;
        saveRows();
        renderTable();
      }

      function openAdd() {
        resetAddState();
        addOpen = true;
        if (backdrop) {
          backdrop.classList.add("visible");
        }
        if (addModal) {
          addModal.classList.add("visible");
        }
      }

      function closeAdd() {
        addOpen = false;
        stopSync();
        if (backdrop && !detailOpen) {
          backdrop.classList.remove("visible");
        }
        if (addModal) {
          addModal.classList.remove("visible");
        }
        resetAddState();
      }

      function openDetail(rowId) {
        detailRowId = rowId;
        detailOpen = true;
        syncDetailModal();
        if (backdrop) {
          backdrop.classList.add("visible");
        }
        if (detailModal) {
          detailModal.classList.add("visible");
        }
      }

      function closeDetail() {
        detailOpen = false;
        detailRowId = "";
        if (backdrop && !addOpen) {
          backdrop.classList.remove("visible");
        }
        if (detailModal) {
          detailModal.classList.remove("visible");
        }
      }

      function submitAdd() {
        let importedRows;

        if (addState.mode === "local") {
          if (!addState.localFileName) {
            showToast("请先上传", "请先选择本地算法压缩包。");
            return;
          }

          importedRows = [
            createAlgorithmRow({
              name: addState.localFileName.replace(/\.zip$/i, "") || "本地导入算法",
              code: getUniqueAlgorithmCode(addState.localFileName, "LOCAL_PACKAGE"),
              analysisType: inferAnalysisType(addState.localFileName),
              sourceType: inferSourceType(addState.localFileName),
              version: "V1.0.0",
              owner: "local.upload",
              description: "由本地算法包导入，待补充算法说明和部署要求。",
              runtimeEnv: "待确认"
            })
          ];

          algoPage.rows = importedRows.concat(algoPage.rows);
          page.algorithmManagePage.rows = algoPage.rows;
          saveRows();
          currentPage = 1;
          closeAdd();
          renderTable();
          showToast("导入成功", "本地算法包已加入算法仓库。");
          return;
        }

        if (addState.syncStatus !== "result") {
          showToast("同步未完成", "请先完成训练平台同步，再导入结果。");
          return;
        }

        const nextAlgorithmId = Number(getNextAlgorithmId());
        importedRows = getImportableSyncResults().map(function (item, index) {
          return createAlgorithmRow({
            algorithmId: String(nextAlgorithmId + index),
            name: item.name,
            code: getUniqueAlgorithmCode(item.code, "SYNC_ALGORITHM"),
            analysisType: item.analysisType,
            sourceType: item.sourceType,
            version: item.version,
            owner: item.owner,
            description: "由训练平台同步导入：" + item.trainName + "。",
            runtimeEnv: item.runtimeEnv
          });
        });

        if (!importedRows.length) {
          showToast("暂无可导入结果", "同步结果中没有可新增的算法。");
          return;
        }

        algoPage.rows = importedRows.concat(algoPage.rows);
        page.algorithmManagePage.rows = algoPage.rows;
        saveRows();
        currentPage = 1;
        closeAdd();
        renderTable();
        showToast("导入成功", "已从训练平台新增 " + importedRows.length + " 条算法记录。");
      }

      function handleLocalFileChange(event) {
        const file = event.target && event.target.files && event.target.files[0];

        if (!file) {
          return;
        }

        if (!/\.zip$/i.test(file.name || "")) {
          event.target.value = "";
          addState.localFileName = "";
          addState.localFileSize = 0;
          renderAddState();
          showToast("文件格式不支持", "请上传 .zip 格式的算法压缩包。");
          return;
        }

        addState.localFileName = file.name;
        addState.localFileSize = file.size || 0;
        renderAddState();
      }

      function handleRowAction(action, rowId) {
        const row = findRow(rowId);
        if (!row) {
          return;
        }

        if (action === "detail") {
          openDetail(rowId);
          return;
        }

        if (action === "disable") {
          setRowsEnabled([rowId], false);
          showToast("已禁用", "算法 " + row.name + " 已设为禁用。");
          return;
        }

        if (action === "enable") {
          setRowsEnabled([rowId], true);
          showToast("已启用", "算法 " + row.name + " 已重新启用。");
          return;
        }

        if (action === "delete") {
          removeRows([rowId]);
          showToast("删除成功", "已删除 1 条算法记录。");
        }
      }

      function handleBatchDisable() {
        const ids = Object.keys(selected).filter(function (id) {
          const row = findRow(id);
          return row && row.enabled !== false;
        });

        if (!ids.length) {
          showToast("请先选择", "请勾选至少一条可禁用算法。");
          return;
        }

        setRowsEnabled(ids, false);
        showToast("已批量禁用", "已禁用 " + ids.length + " 条算法记录。");
      }

      function handleBatchDelete() {
        const ids = Object.keys(selected);
        if (!ids.length) {
          showToast("请先选择", "请至少勾选一条算法记录后再删除。");
          return;
        }

        removeRows(ids);
        showToast("删除成功", "已删除 " + ids.length + " 条算法记录。");
      }

      function onQuery() {
        currentPage = 1;
        renderTable();
      }

      function onReset() {
        if (searchInput) {
          searchInput.value = "";
        }
        if (analysisTypeSelect) {
          analysisTypeSelect.value = "";
        }
        if (sourceTypeSelect) {
          sourceTypeSelect.value = "";
        }
        currentPage = 1;
        renderTable();
      }

      function onClick(event) {
        const target = event.target;

        if (target.closest("#algorithm-management-create")) {
          event.preventDefault();
          openAdd();
          return;
        }

        if (target.closest("#algorithm-management-disable")) {
          event.preventDefault();
          handleBatchDisable();
          return;
        }

        if (target.closest("#algorithm-management-delete")) {
          event.preventDefault();
          handleBatchDelete();
          return;
        }

        if (target.closest("#algorithm-management-query")) {
          event.preventDefault();
          onQuery();
          return;
        }

        if (target.closest("#algorithm-management-reset")) {
          event.preventDefault();
          onReset();
          return;
        }

        if (target.closest("#algorithm-management-select-all")) {
          event.preventDefault();
          toggleAllSelection();
          return;
        }

        if (target.closest("#algorithm-management-table-body .table-row-checkbox")) {
          event.preventDefault();
          toggleRowSelection(target.closest(".table-row-checkbox").getAttribute("data-row-id"));
          return;
        }

        if (target.closest("[data-row-action]")) {
          event.preventDefault();
          const button = target.closest("[data-row-action]");
          handleRowAction(button.getAttribute("data-row-action"), button.getAttribute("data-row-id"));
          return;
        }

        if (target.closest("[data-algorithm-action='add-mode']")) {
          event.preventDefault();
          addState.mode = target.closest("[data-algorithm-action='add-mode']").getAttribute("data-algorithm-mode") || "local";
          renderAddState();
          return;
        }

        if (target.closest("[data-algorithm-action='local-choose']")) {
          event.preventDefault();
          if (localUploadInput) {
            localUploadInput.click();
          }
          return;
        }

        if (target.closest("[data-algorithm-action='local-clear']")) {
          event.preventDefault();
          addState.localFileName = "";
          addState.localFileSize = 0;
          if (localUploadInput) {
            localUploadInput.value = "";
          }
          renderAddState();
          return;
        }

        if (target.closest("[data-algorithm-action='sync-config']")) {
          event.preventDefault();
          window.localStorage.setItem("algorithm-training-platform-return-route", "algorithm-management");
          navigateToRoute("platform-config");
          return;
        }

        if (target.closest("[data-algorithm-action='sync-start']")) {
          event.preventDefault();
          startSync();
          return;
        }

        if (target.closest("[data-algorithm-action='sync-toggle']")) {
          event.preventDefault();
          pauseOrResumeSync();
          return;
        }

        if (target.closest("[data-algorithm-action='sync-cancel']")) {
          event.preventDefault();
          cancelSync();
          return;
        }

        if (target.closest("[data-algorithm-action='sync-rerun']")) {
          event.preventDefault();
          startSync();
          return;
        }

        if (target.closest("[data-algorithm-action='add-submit']")) {
          event.preventDefault();
          submitAdd();
          return;
        }

        if (target.closest("[data-algorithm-action='add-close']")) {
          event.preventDefault();
          closeAdd();
          return;
        }

        if (target.closest("[data-algorithm-action='detail-close']")) {
          event.preventDefault();
          closeDetail();
          return;
        }

        if (target.closest("#algorithm-management-modal-backdrop")) {
          event.preventDefault();
          closeAdd();
          closeDetail();
          return;
        }

        const pageButton = target.closest("[data-page]");
        if (pageButton && paginationNode && paginationNode.contains(pageButton) && !pageButton.disabled) {
          event.preventDefault();
          currentPage = Number(pageButton.getAttribute("data-page")) || 1;
          renderTable();
        }
      }

      function onSearchInput() {
        currentPage = 1;
        renderTable();
      }

      mountNode.addEventListener("click", onClick);
      if (searchInput) {
        searchInput.addEventListener("input", onSearchInput);
      }
      if (analysisTypeSelect) {
        analysisTypeSelect.addEventListener("change", onQuery);
      }
      if (sourceTypeSelect) {
        sourceTypeSelect.addEventListener("change", onQuery);
      }
      if (localUploadInput) {
        localUploadInput.addEventListener("change", handleLocalFileChange);
      }

      renderAddState();
      renderTable();

      return function cleanup() {
        stopSync();
        mountNode.removeEventListener("click", onClick);
        if (searchInput) {
          searchInput.removeEventListener("input", onSearchInput);
        }
        if (analysisTypeSelect) {
          analysisTypeSelect.removeEventListener("change", onQuery);
        }
        if (sourceTypeSelect) {
          sourceTypeSelect.removeEventListener("change", onQuery);
        }
        if (localUploadInput) {
          localUploadInput.removeEventListener("change", handleLocalFileChange);
        }
      };
    }
  });

  function renderOptions(options) {
    return options.map(function (option) {
      return '<option value="' + utils.escapeAttribute(option.value) + '">' + utils.escapeHtml(option.label) + "</option>";
    }).join("");
  }

  function renderFilter(label, control) {
    return (
      '<div class="table-filter-group">' +
      '<span class="table-filter-label">' + utils.escapeHtml(label) + "</span>" +
      control +
      "</div>"
    );
  }

  function renderAddModal() {
    return (
      '<section id="algorithm-management-add-modal" class="algorithm-manage-modal algorithm-manage-modal-add" role="dialog" aria-modal="true">' +
      '<header class="algorithm-manage-modal-header">' +
      '<div>' +
      '<h3 class="algorithm-manage-modal-title">新增算法</h3>' +
      '</div>' +
      '<button class="algorithm-manage-modal-close" type="button" data-algorithm-action="add-close">×</button>' +
      '</header>' +
      '<div class="algorithm-manage-modal-body algorithm-manage-add-body">' +
      '<div class="algorithm-manage-mode-tabs" role="tablist" aria-label="新增算法方式">' +
      '<button class="algorithm-manage-mode-tab active" type="button" data-algorithm-action="add-mode" data-algorithm-mode="local" aria-pressed="true">' +
      '<span class="algorithm-manage-mode-title">本地上传</span>' +
      '</button>' +
      '<button class="algorithm-manage-mode-tab" type="button" data-algorithm-action="add-mode" data-algorithm-mode="sync" aria-pressed="false">' +
      '<span class="algorithm-manage-mode-title">从训练平台同步</span>' +
      '</button>' +
      '</div>' +
      '<div id="algorithm-add-content" class="algorithm-manage-add-content"></div>' +
      '<input id="algorithm-local-upload-input" class="algorithm-manage-hidden-input" type="file" accept=".zip" />' +
      '</div>' +
      '<footer class="algorithm-manage-modal-footer">' +
      '<button class="button-secondary" type="button" data-algorithm-action="add-close">取消</button>' +
      '<button id="algorithm-management-add-submit" class="button" type="button" data-algorithm-action="add-submit" disabled>导入算法</button>' +
      '</footer>' +
      '</section>'
    );
  }

  function renderLocalUploadPanel(state) {
    const hasFile = !!state.localFileName;

    return (
      '<div class="algorithm-upload-panel">' +
      '<button class="algorithm-upload-dropzone" type="button" data-algorithm-action="local-choose">' +
      '<span class="algorithm-upload-dropzone-title">' + (hasFile ? "重新上传" : "点击上传") + "</span>" +
      '<span class="algorithm-upload-dropzone-desc">仅支持 zip 格式</span>' +
      "</button>" +
      (
        hasFile
          ? '<div class="algorithm-upload-file-card">' +
            '<div>' +
            '<div class="algorithm-upload-file-name">' + utils.escapeHtml(state.localFileName) + "</div>" +
            '<div class="algorithm-upload-file-meta">文件大小 ' + utils.escapeHtml(formatFileSize(state.localFileSize)) + "</div>" +
            "</div>" +
            '<button class="button-secondary" type="button" data-algorithm-action="local-clear">移除</button>' +
            "</div>"
          : ""
      ) +
      '</div>'
    );
  }

  function renderSyncPanel(state) {
    if (!state.platformConfigured || state.syncStatus === "unconfigured") {
      return (
        '<div class="algorithm-sync-warning">' +
        '<h4 class="algorithm-manage-section-title">未配置训练平台连接</h4>' +
        '<div class="algorithm-sync-actions">' +
        '<button class="button" type="button" data-algorithm-action="sync-config">前往配置</button>' +
        '</div>' +
        '</div>'
      );
    }

    if (state.syncStatus === "result") {
      return renderSyncResultPanel(state);
    }

    if (state.syncStatus === "syncing" || state.syncStatus === "paused") {
      return renderSyncProgressPanel(state);
    }

    return (
      '<div class="algorithm-sync-ready-card">' +
      '<h4 class="algorithm-manage-section-title">已配置训练平台连接</h4>' +
      '<div class="algorithm-sync-actions">' +
      '<button class="button" type="button" data-algorithm-action="sync-start">开始同步</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderSyncProgressPanel(state) {
    return (
      '<div class="algorithm-sync-progress-card">' +
      '<div class="algorithm-sync-progress-head">' +
      '<div>' +
      '<h4 class="algorithm-manage-section-title">' + utils.escapeHtml(state.syncStatus === "paused" ? "同步已暂停" : "同步中") + "</h4>" +
      '<p class="algorithm-manage-section-desc">' + utils.escapeHtml(state.syncPhaseText) + "</p>" +
      '</div>' +
      '<div class="algorithm-sync-progress-value">' + utils.escapeHtml(String(state.syncProgress)) + '%</div>' +
      '</div>' +
      '<div class="algorithm-sync-progress-bar"><span class="algorithm-sync-progress-fill" style="width:' + utils.escapeAttribute(String(state.syncProgress)) + '%"></span></div>' +
      '<div class="algorithm-sync-actions">' +
      '<button class="button-secondary" type="button" data-algorithm-action="sync-toggle">' + (state.syncStatus === "paused" ? "继续同步" : "暂停同步") + "</button>" +
      '<button class="button-secondary" type="button" data-algorithm-action="sync-cancel">取消同步</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderSyncResultPanel(state) {
    const statusCounts = getSyncStatusCounts(state.syncResults);
    return (
      '<div class="algorithm-sync-result-panel">' +
      '<div class="algorithm-sync-result-head">' +
      '<div class="algorithm-sync-result-title-row">' +
      '<h4 class="algorithm-manage-section-title">同步结果</h4>' +
      '<div class="algorithm-sync-result-summary">' +
      renderSyncSummaryChip("success", statusCounts.success) +
      renderSyncSummaryChip("failed", statusCounts.failed) +
      renderSyncSummaryChip("duplicate", statusCounts.duplicate) +
      '</div>' +
      '</div>' +
      '<button class="button-secondary" type="button" data-algorithm-action="sync-rerun">重新同步</button>' +
      '</div>' +
      '<div class="algorithm-sync-table-shell">' +
      '<table class="algorithm-sync-table">' +
      '<thead><tr><th>算法名称</th><th>算法标识</th><th>版本</th><th>同步结果</th><th>说明</th></tr></thead>' +
      '<tbody>' +
      state.syncResults.map(function (item) {
        return (
          "<tr>" +
          '<td><div class="algorithm-sync-table-name">' + utils.escapeHtml(item.name) + "</div></td>" +
          '<td><span class="algorithm-code">' + utils.escapeHtml(item.code) + "</span></td>" +
          '<td>' + utils.escapeHtml(item.version) + "</td>" +
          '<td><span class="algorithm-sync-badge ' + getSyncBadgeClass(item.status) + '">' + utils.escapeHtml(getSyncStatusText(item.status)) + "</span></td>" +
          '<td>' + utils.escapeHtml(item.detail) + "</td>" +
          "</tr>"
        );
      }).join("") +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '</div>'
    );
  }

  function getSyncStatusCounts(results) {
    return (Array.isArray(results) ? results : []).reduce(function (counts, item) {
      const status = item && item.status;
      if (status === "success" || status === "failed" || status === "duplicate") {
        counts[status] += 1;
      }
      return counts;
    }, {
      success: 0,
      failed: 0,
      duplicate: 0
    });
  }

  function renderSyncSummaryChip(status, count) {
    return (
      '<span class="algorithm-sync-summary-chip ' + getSyncBadgeClass(status) + '">' +
      '<span class="algorithm-sync-summary-label">' + utils.escapeHtml(getSyncStatusText(status)) + '</span>' +
      '<span class="algorithm-sync-summary-value">' + utils.escapeHtml(String(count)) + '</span>' +
      '</span>'
    );
  }

  function getSyncStatusText(status) {
    if (status === "success") {
      return "成功";
    }
    if (status === "duplicate") {
      return "重复";
    }
    if (status === "failed") {
      return "失败";
    }
    return "待处理";
  }

  function getSyncBadgeClass(status) {
    if (status === "success") {
      return "is-success";
    }
    if (status === "duplicate") {
      return "is-warning";
    }
    if (status === "failed") {
      return "is-danger";
    }
    if (status === "paused") {
      return "is-paused";
    }
    return "is-progress";
  }

  function formatFileSize(bytes) {
    const size = Number(bytes) || 0;

    if (size < 1024) {
      return size + " B";
    }
    if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + " KB";
    }
    if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(1) + " MB";
    }
    return (size / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }

  function getAlgorithmDetailData(row) {
    const safeRow = row || {};
    const runtimeParts = String(safeRow.runtimeEnv || "").split("/");
    const runtimeLabel = runtimeParts[0] ? runtimeParts[0].trim() : "--";
    const versionOptions = Array.isArray(safeRow.versionOptions) && safeRow.versionOptions.length
      ? safeRow.versionOptions
      : [safeRow.version || "--"];
    const createdAtMap = {
      "alg-123": "2025-10-10 19:56:58",
      "alg-124": "2025-10-09 17:42:16",
      "alg-125": "2025-10-08 16:31:09",
      "alg-126": "2025-10-08 14:18:22",
      "alg-127": "2025-10-07 10:25:36",
      "alg-128": "2025-10-06 09:12:48",
      "alg-129": "2025-10-05 15:08:27"
    };

    const detailDescription = safeRow.id === "alg-123"
      ? "对区域内图像进行识别、分析，统计区域内人数，对人群聚集进行警示。"
      : (safeRow.description || "--");

    const baseSpecs = buildAlgorithmBaseSpecs(safeRow, runtimeLabel);
    const videoSpecs = buildAlgorithmVideoSpecs(safeRow);

    return {
      createdAt: createdAtMap[safeRow.id] || ((safeRow.createdAt || "--") + " 10:00:00"),
      description: detailDescription,
      versions: versionOptions,
      baseSpecs: baseSpecs,
      videoSpecs: videoSpecs
    };
  }

  function buildAlgorithmBaseSpecs(row, runtimeLabel) {
    if (row.id === "alg-123") {
      return [
        {
          cpu: "6核",
          memory: "25600MB",
          videoMemory: "40960MB",
          disk: "1478MB",
          platform: "TeslaT4",
          runtime: "TensorRT"
        }
      ];
    }

    const presets = {
      detection: { cpu: "6核", memory: "24576MB", videoMemory: "32768MB", disk: "1536MB", platform: "TeslaT4" },
      recognition: { cpu: "4核", memory: "20480MB", videoMemory: "24576MB", disk: "1280MB", platform: "TeslaT4" },
      analysis: { cpu: "8核", memory: "28672MB", videoMemory: "32768MB", disk: "1792MB", platform: "TeslaV100" }
    };
    const preset = presets[row.analysisType] || presets.detection;

    return [
      {
        cpu: preset.cpu,
        memory: preset.memory,
        videoMemory: preset.videoMemory,
        disk: preset.disk,
        platform: preset.platform,
        runtime: runtimeLabel
      }
    ];
  }

  function buildAlgorithmVideoSpecs(row) {
    if (row.id === "alg-123") {
      return [
        { resolution: "1920*1080", utilization: "16.66%", capacity: "8路" },
        { resolution: "2560*1920", utilization: "20%", capacity: "6路" },
        { resolution: "4096*2160", utilization: "25%", capacity: "4路" }
      ];
    }

    const presets = {
      video: [
        { resolution: "1920*1080", utilization: "18%", capacity: "8路" },
        { resolution: "2560*1920", utilization: "22%", capacity: "6路" },
        { resolution: "4096*2160", utilization: "28%", capacity: "4路" }
      ],
      image: [
        { resolution: "1920*1080", utilization: "12%", capacity: "10路" },
        { resolution: "2560*1920", utilization: "16%", capacity: "8路" },
        { resolution: "4096*2160", utilization: "21%", capacity: "6路" }
      ]
    };

    return presets[row.sourceType] || presets.video;
  }

  function renderDetailModal() {
    return (
      '<section id="algorithm-management-detail-modal" class="algorithm-manage-modal algorithm-manage-detail-modal" role="dialog" aria-modal="true">' +
      '<header class="algorithm-manage-modal-header">' +
      '<div>' +
      '<h3 class="algorithm-manage-modal-title" data-algorithm-detail="name">算法详情</h3>' +
      '</div>' +
      '<button class="algorithm-manage-modal-close" type="button" data-algorithm-action="detail-close">×</button>' +
      '</header>' +
      '<div class="algorithm-manage-modal-body algorithm-manage-detail-body">' +
      '<section class="algorithm-detail-section">' +
      '<h4 class="algorithm-detail-section-title">算法信息</h4>' +
      '<div class="algorithm-detail-info-grid">' +
      renderDetailInfoItem("算法ID", "algorithmId") +
      renderDetailInfoItem("算法名称", "name") +
      renderDetailInfoItem("算法标识", "code") +
      renderDetailVersionItem("算法版本", "version") +
      renderDetailInfoItem("分析类型", "analysisType") +
      renderDetailInfoItem("分析源类型", "sourceType") +
      renderDetailInfoItem("创建时间", "createdAt") +
      renderDetailInfoItem("算法描述", "description", true) +
      '</div>' +
      '</section>' +
      '<section class="algorithm-detail-section algorithm-detail-spec-section">' +
      '<h4 class="algorithm-detail-section-title">技术规格</h4>' +
      '<div class="algorithm-detail-table-shell">' +
      '<table class="algorithm-detail-table">' +
      '<thead><tr><th>CPU核数</th><th>内存占用</th><th>显存占用</th><th>硬盘占用</th><th>计算平台</th><th>运行环境</th></tr></thead>' +
      '<tbody data-algorithm-spec="base"></tbody>' +
      '</table>' +
      '</div>' +
      '<div class="algorithm-detail-table-shell">' +
      '<table class="algorithm-detail-table">' +
      '<thead><tr><th>视频规格</th><th>单路每秒处理视频占用芯片百分比</th><th>单芯片每秒最大处理路数</th></tr></thead>' +
      '<tbody data-algorithm-spec="video"></tbody>' +
      '</table>' +
      '</div>' +
      '</div>' +
      '<footer class="algorithm-manage-modal-footer">' +
      '<button class="button-secondary" type="button" data-algorithm-action="detail-close">取消</button>' +
      '</footer>' +
      '</section>'
    );
  }

  function renderInputField(label, id, required, placeholder) {
    return (
      '<label class="algorithm-manage-form-field">' +
      '<span class="algorithm-manage-field-label' + (required ? " required" : "") + '">' + utils.escapeHtml(label) + "</span>" +
      '<input id="' + utils.escapeAttribute(id) + '" class="algorithm-manage-form-control" type="text" placeholder="' + utils.escapeAttribute(placeholder || "") + '" />' +
      "</label>"
    );
  }

  function renderSelectField(label, id, options, required) {
    return (
      '<label class="algorithm-manage-form-field">' +
      '<span class="algorithm-manage-field-label' + (required ? " required" : "") + '">' + utils.escapeHtml(label) + "</span>" +
      '<select id="' + utils.escapeAttribute(id) + '" class="algorithm-manage-form-control">' +
      '<option value="">请选择</option>' +
      renderOptions(options) +
      "</select>" +
      "</label>"
    );
  }

  function renderTextareaField(label, id) {
    return (
      '<label class="algorithm-manage-form-field full">' +
      '<span class="algorithm-manage-field-label">' + utils.escapeHtml(label) + "</span>" +
      '<textarea id="' + utils.escapeAttribute(id) + '" class="algorithm-manage-form-control algorithm-manage-form-textarea" placeholder="补充算法适用场景、输入约束和版本说明"></textarea>' +
      "</label>"
    );
  }

  function renderDetailField(label, field, full) {
    return (
      '<div class="algorithm-manage-detail-field' + (full ? " full" : "") + '">' +
      '<span class="algorithm-manage-field-label">' + utils.escapeHtml(label) + "</span>" +
      '<div class="algorithm-manage-detail-value" data-algorithm-field="' + utils.escapeAttribute(field) + '">--</div>' +
      "</div>"
    );
  }

  function renderDetailInfoItem(label, field, full) {
    return (
      '<div class="algorithm-detail-info-item' + (full ? " full" : "") + '">' +
      '<div class="algorithm-detail-info-label">' + utils.escapeHtml(label) + "</div>" +
      '<div class="algorithm-detail-info-value" data-algorithm-field="' + utils.escapeAttribute(field) + '">--</div>' +
      "</div>"
    );
  }

  function renderDetailVersionItem(label, field) {
    return (
      '<div class="algorithm-detail-info-item">' +
      '<div class="algorithm-detail-info-label">' + utils.escapeHtml(label) + "</div>" +
      '<div class="algorithm-detail-info-value">' +
      '<select class="algorithm-detail-version-select" data-algorithm-field="' + utils.escapeAttribute(field) + '"></select>' +
      "</div>" +
      "</div>"
    );
  }

  function getOptionLabel(options, value) {
    const matched = options.find(function (item) {
      return item.value === value;
    });
    return matched ? matched.label : value;
  }

  function formatToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function buildPaginationHtml(currentPage, totalPages) {
    const safeTotalPages = Math.max(totalPages, 1);
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(safeTotalPages, currentPage + 2);
    const html = [];

    html.push(
      '<button class="pagination-button" type="button" data-page="' + Math.max(1, currentPage - 1) + '"' +
      (currentPage === 1 ? " disabled" : "") +
      ">‹</button>"
    );

    for (let index = start; index <= end; index += 1) {
      html.push(
        '<button class="pagination-button' + (index === currentPage ? " active" : "") + '" type="button" data-page="' + index + '">' +
        index +
        "</button>"
      );
    }

    html.push(
      '<button class="pagination-button" type="button" data-page="' + Math.min(safeTotalPages, currentPage + 1) + '"' +
      (currentPage === safeTotalPages ? " disabled" : "") +
      ">›</button>"
    );

    return html.join("");
  }
})();
