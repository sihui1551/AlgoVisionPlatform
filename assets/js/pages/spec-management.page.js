(function () {
  const utils = window.PROTOTYPE_UTILS;
  const shell = window.PROTOTYPE_SHELL;

  const CPU_PRESETS = [1, 2, 4, 8, 16, 32];
  const MEMORY_PRESETS = [1, 2, 4, 8, 16];
  const STATIC_GPU_OPTIONS = [
    "Atlas 300V",
    "Nvidia A20",
    "Nvidia A10",
    "Nvidia T4",
    "昇腾 910B"
  ];
  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  const SEED_ROWS = [
    { id: "spec-123123", specId: "123123", name: "InstanceOffer-1", description: "面向中小规模图像分析任务的通用算力规格。", cpu: 4, memory: 8, gpu: "Nvidia A20", gpuMemory: 24, gpuCount: 1, gpuMemoryLabel: "1*24", disk: 500, createdAt: "2025-11-21 16:44:54", enabled: true },
    { id: "spec-234232", specId: "234232", name: "InstanceOffer-2", description: "适用于视频流检测任务的标准 GPU 规格。", cpu: 8, memory: 16, gpu: "Nvidia A10", gpuMemory: 24, gpuCount: 1, gpuMemoryLabel: "1*24", disk: 500, createdAt: "2025-11-21 16:45:12", enabled: true },
    { id: "spec-345343", specId: "345343", name: "InstanceOffer-3", description: "适用于多路离线分析任务的高吞吐规格。", cpu: 8, memory: 24, gpu: "Nvidia T4", gpuMemory: 24, gpuCount: 2, gpuMemoryLabel: "2*24", disk: 500, createdAt: "2025-11-21 16:46:00", enabled: true },
    { id: "spec-456454", specId: "456454", name: "InstanceOffer-4", description: "适用于混合调度场景的国产算力规格。", cpu: 16, memory: 32, gpu: "昇腾 910B", gpuMemory: 16, gpuCount: 3, gpuMemoryLabel: "3*16", disk: 500, createdAt: "2025-11-21 16:47:33", enabled: true },
    { id: "spec-567565", specId: "567565", name: "InstanceOffer-5", description: "预留给离线训练转在线推理的扩展规格。", cpu: 16, memory: 32, gpu: "昇腾 910B", gpuMemory: 16, gpuCount: 3, gpuMemoryLabel: "3*16", disk: 500, createdAt: "2025-11-21 16:48:01", enabled: false }
  ];

  window.registerPrototypePage({
    key: "spec-management",
    kind: "table",
    styleSource: "../assets/css/pages/spec-management.css",
    heading: "规格管理",
    subtitle: "维护平台可选算力规格与资源模板。",
    breadcrumbTrail: ["系统管理"],
    tablePanel: {},
    countTextPrefix: "共",
    countTextUnit: "条",
    emptyText: "暂无规格数据",
    productDoc: {
      title: "规格管理需求说明",
      summary: "该页面用于集中维护平台可选的资源规格，支持筛选、创建、启停、删除和详情查看。",
      goal: "让平台管理员在单页内完成规格的检索、创建和状态管理。",
      modules: [
        "顶部工具栏：支持新建规格、按 CPU/内存/GPU 显存筛选以及按关键字搜索。",
        "规格列表：展示规格 ID、规格名称、vCPU、内存、GPU、GPU 显存、硬盘大小、创建时间和操作。",
        "创建弹窗：支持填写规格名称、规格简介、CPU、内存、GPU、显存和硬盘信息。",
        "详情弹窗：集中查看规格的基础信息与当前状态。"
      ],
      rules: [
        "规格名称不能为空。",
        "CPU、内存、显存数量、GPU 数量和硬盘大小需为正整数。",
        "禁用规格后不删除记录，仅用于阻止后续新任务继续选择该规格。"
      ],
      interactions: [
        "点击新建规格弹出创建弹窗，保存后列表即时刷新。",
        "点击行内详情打开规格详情弹窗。",
        "点击禁用或启用会直接切换当前规格状态。",
        "点击删除会立即从当前原型列表中移除。"
      ]
    },
    specManagePage: {
      pageSize: 5,
      rows: SEED_ROWS,
      customGpuOptions: []
    },
    renderTablePanel: function (context) {
      const page = context.page;
      return (
        '<section class="panel spec-management-page">' +
        renderToolbar() +
        renderTableShell(page) +
        renderFooter(page) +
        renderCreateModal() +
        renderDetailModal() +
        '<div id="spec-management-modal-backdrop" class="spec-modal-backdrop"></div>' +
        "</section>"
      );
    },
    setup: function (runtime) {
      const page = runtime.page || {};
      const specPage = page.specManagePage || {};
      const showToast = runtime.showToast || function () {};
      const mockStore = runtime.mockStore;
      const mountNode = runtime.mountNode;
      const selected = Object.create(null);
      let currentPage = 1;
      let addOpen = false;
      let detailOpen = false;
      let detailRowId = "";
      let addState = createDefaultAddState();

      if (!Array.isArray(specPage.rows)) {
        specPage.rows = [];
      }
      if (!Array.isArray(specPage.customGpuOptions)) {
        specPage.customGpuOptions = [];
      }

      const cpuFilterSelect = document.getElementById("spec-management-filter-cpu");
      const memoryFilterSelect = document.getElementById("spec-management-filter-memory");
      const gpuMemoryFilterSelect = document.getElementById("spec-management-filter-gpu-memory");
      const searchInput = document.getElementById("spec-management-search");
      const queryButton = document.getElementById("spec-management-query");
      const resetButton = document.getElementById("spec-management-reset");
      const createButton = document.getElementById("spec-management-create");
      const selectAllButton = document.getElementById("spec-management-select-all");
      const tbody = document.getElementById("spec-management-table-body");
      const countNode = document.getElementById("spec-management-count");
      const paginationNode = document.getElementById("spec-management-pagination");
      const pageSizeSelect = document.getElementById("spec-management-page-size");
      const pageJumpInput = document.getElementById("spec-management-page-jump");
      const createModal = document.getElementById("spec-management-create-modal");
      const detailModal = document.getElementById("spec-management-detail-modal");
      const backdrop = document.getElementById("spec-management-modal-backdrop");

      function getGpuOptions() {
        return uniqueValues(STATIC_GPU_OPTIONS.concat(specPage.customGpuOptions).concat(specPage.rows.map(function (row) {
          return row.gpu;
        })).concat(addState.tempGpuOptions)).filter(Boolean);
      }

      function saveState() {
        page.specManagePage.rows = specPage.rows;
        page.specManagePage.customGpuOptions = specPage.customGpuOptions;
        if (mockStore && typeof mockStore.patchPage === "function") {
          mockStore.patchPage(page.key, {
            specManagePage: {
              rows: specPage.rows,
              customGpuOptions: specPage.customGpuOptions
            }
          }, page);
        }
      }

      function syncFilterOptions() {
        const cpuValue = cpuFilterSelect ? cpuFilterSelect.value : "";
        const memoryValue = memoryFilterSelect ? memoryFilterSelect.value : "";
        const gpuMemoryValue = gpuMemoryFilterSelect ? gpuMemoryFilterSelect.value : "";

        if (cpuFilterSelect) {
          cpuFilterSelect.innerHTML = renderFilterOptions("选择vCPU", uniqueValues(CPU_PRESETS.concat(specPage.rows.map(function (row) {
            return row.cpu;
          }))));
          cpuFilterSelect.value = optionExists(cpuFilterSelect, cpuValue) ? cpuValue : "";
        }

        if (memoryFilterSelect) {
          memoryFilterSelect.innerHTML = renderFilterOptions("选择内存", uniqueValues(MEMORY_PRESETS.concat(specPage.rows.map(function (row) {
            return row.memory;
          }))));
          memoryFilterSelect.value = optionExists(memoryFilterSelect, memoryValue) ? memoryValue : "";
        }

        if (gpuMemoryFilterSelect) {
          gpuMemoryFilterSelect.innerHTML = renderFilterOptions("选择GPU显存", uniqueValues(specPage.rows.map(function (row) {
            return row.gpuMemoryLabel;
          })));
          gpuMemoryFilterSelect.value = optionExists(gpuMemoryFilterSelect, gpuMemoryValue) ? gpuMemoryValue : "";
        }
      }

      function getFilteredRows() {
        const cpuValue = cpuFilterSelect ? cpuFilterSelect.value : "";
        const memoryValue = memoryFilterSelect ? memoryFilterSelect.value : "";
        const gpuMemoryValue = gpuMemoryFilterSelect ? gpuMemoryFilterSelect.value : "";
        const keyword = utils.normalize(searchInput ? searchInput.value : "");

        return specPage.rows.filter(function (row) {
          const keywordMatch = !keyword || [row.specId, row.name].some(function (field) {
            return utils.normalize(field).includes(keyword);
          });
          const cpuMatch = !cpuValue || String(row.cpu) === String(cpuValue);
          const memoryMatch = !memoryValue || String(row.memory) === String(memoryValue);
          const gpuMemoryMatch = !gpuMemoryValue || String(row.gpuMemoryLabel) === String(gpuMemoryValue);
          return keywordMatch && cpuMatch && memoryMatch && gpuMemoryMatch;
        });
      }

      function renderRow(row) {
        return (
          '<tr class="' + (row.enabled === false ? "spec-row-disabled" : "") + '" data-row-id="' + utils.escapeAttribute(row.id) + '">' +
          '<td class="table-select-cell"><button class="table-row-checkbox" type="button" aria-label="' + utils.escapeAttribute(row.id) + '" data-row-id="' + utils.escapeAttribute(row.id) + '"></button></td>' +
          '<td><strong>' + utils.escapeHtml(row.specId) + "</strong></td>" +
          '<td><span class="spec-name-cell">' + utils.escapeHtml(row.name) + "</span></td>" +
          '<td>' + utils.escapeHtml(String(row.cpu)) + "</td>" +
          '<td>' + utils.escapeHtml(String(row.memory)) + "</td>" +
          '<td>' + utils.escapeHtml(row.gpu) + "</td>" +
          '<td>' + utils.escapeHtml(row.gpuMemoryLabel) + "</td>" +
          '<td>' + utils.escapeHtml(String(row.disk)) + "</td>" +
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
        syncFilterOptions();
        const rows = getFilteredRows();
        const pageSize = getCurrentPageSize();
        const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
        currentPage = clampPage(currentPage, totalPages);
        const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        if (tbody) {
          tbody.innerHTML = pagedRows.length
            ? pagedRows.map(function (row) { return renderRow(row); }).join("")
            : '<tr><td colspan="10"><div class="empty-state">' + utils.escapeHtml(page.emptyText || "暂无数据") + "</div></td></tr>";
        }

        if (countNode) {
          countNode.textContent = String(page.countTextPrefix || "") + rows.length + String(page.countTextUnit || "");
        }

        if (paginationNode) {
          paginationNode.innerHTML = buildPaginationHtml(currentPage, totalPages);
        }

        if (pageJumpInput) {
          pageJumpInput.value = String(currentPage);
        }

        syncSelectedRows();
        syncDetailModal();
      }

      function getCurrentPageSize() {
        const pageSize = Number(pageSizeSelect ? pageSizeSelect.value : specPage.pageSize || 5);
        return Math.max(pageSize, 1);
      }

      function getVisibleRowIds() {
        return Array.prototype.map.call(mountNode.querySelectorAll("#spec-management-table-body tr[data-row-id]"), function (rowNode) {
          return rowNode.getAttribute("data-row-id");
        }).filter(Boolean);
      }

      function syncSelectedRows() {
        const visibleIds = getVisibleRowIds();
        Array.prototype.forEach.call(mountNode.querySelectorAll("#spec-management-table-body .table-row-checkbox"), function (button) {
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
          const allChecked = visibleIds.length > 0 && visibleIds.every(function (id) {
            return !!selected[id];
          });
          selectAllButton.classList.toggle("checked", allChecked);
          selectAllButton.setAttribute("aria-pressed", allChecked ? "true" : "false");
        }
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
      }

      function toggleAllSelection() {
        const visibleIds = getVisibleRowIds();
        const allChecked = visibleIds.length > 0 && visibleIds.every(function (id) {
          return !!selected[id];
        });
        visibleIds.forEach(function (id) {
          if (allChecked) {
            delete selected[id];
          } else {
            selected[id] = true;
          }
        });
        syncSelectedRows();
      }

      function findRow(rowId) {
        return specPage.rows.find(function (row) {
          return row.id === rowId;
        }) || null;
      }

      function removeRows(ids) {
        const lookup = createLookup(ids);
        specPage.rows = specPage.rows.filter(function (row) {
          return !lookup[row.id];
        });
        page.specManagePage.rows = specPage.rows;
        ids.forEach(function (id) {
          delete selected[id];
        });
        if (detailRowId && lookup[detailRowId]) {
          closeDetail();
        }
        saveState();
        renderTable();
      }

      function setRowsEnabled(ids, enabled) {
        const lookup = createLookup(ids);
        specPage.rows = specPage.rows.map(function (row) {
          if (!lookup[row.id]) {
            return row;
          }
          return Object.assign({}, row, { enabled: enabled });
        });
        page.specManagePage.rows = specPage.rows;
        saveState();
        renderTable();
      }

      function syncAddModal() {
        if (!createModal) {
          return;
        }

        const cpuChipWrap = createModal.querySelector("#spec-create-cpu-chips");
        const memoryChipWrap = createModal.querySelector("#spec-create-memory-chips");
        const gpuSelect = createModal.querySelector("#spec-create-gpu");
        const nameInput = createModal.querySelector("#spec-create-name");
        const descInput = createModal.querySelector("#spec-create-description");
        const cpuCustomInput = createModal.querySelector("#spec-create-cpu-custom");
        const memoryCustomInput = createModal.querySelector("#spec-create-memory-custom");
        const gpuMemoryInput = createModal.querySelector("#spec-create-gpu-memory");
        const gpuCountInput = createModal.querySelector("#spec-create-gpu-count");
        const diskInput = createModal.querySelector("#spec-create-disk");

        if (cpuChipWrap) {
          cpuChipWrap.innerHTML = CPU_PRESETS.map(function (value) {
            return renderPresetButton("cpu", value, addState.cpu === value, "核");
          }).join("");
        }

        if (memoryChipWrap) {
          memoryChipWrap.innerHTML = MEMORY_PRESETS.map(function (value) {
            return renderPresetButton("memory", value, addState.memory === value, "GB");
          }).join("");
        }

        if (gpuSelect) {
          gpuSelect.innerHTML = getGpuOptions().map(function (option) {
            return '<option value="' + utils.escapeAttribute(option) + '"' + (option === addState.gpu ? " selected" : "") + ">" + utils.escapeHtml(option) + "</option>";
          }).join("");
        }
        if (nameInput) {
          nameInput.value = addState.name;
        }
        if (descInput) {
          descInput.value = addState.description;
        }
        if (cpuCustomInput) {
          cpuCustomInput.value = String(addState.cpu);
        }
        if (memoryCustomInput) {
          memoryCustomInput.value = String(addState.memory);
        }
        if (gpuMemoryInput) {
          gpuMemoryInput.value = String(addState.gpuMemory);
        }
        if (gpuCountInput) {
          gpuCountInput.value = String(addState.gpuCount);
        }
        if (diskInput) {
          diskInput.value = String(addState.disk);
        }
      }

      function resetAddState() {
        addState = createDefaultAddState();
        syncAddModal();
      }

      function openCreate() {
        resetAddState();
        addOpen = true;
        if (backdrop) {
          backdrop.classList.add("visible");
        }
        if (createModal) {
          createModal.classList.add("visible");
        }
      }

      function closeCreate() {
        addOpen = false;
        if (createModal) {
          createModal.classList.remove("visible");
        }
        if (backdrop && !detailOpen) {
          backdrop.classList.remove("visible");
        }
      }

      function syncDetailModal() {
        if (!detailModal) {
          return;
        }
        const row = findRow(detailRowId);
        const fieldMap = {
          specId: row ? row.specId : "--",
          name: row ? row.name : "--",
          cpu: row ? row.cpu + " 核" : "--",
          memory: row ? row.memory + " GB" : "--",
          gpuMemory: row ? row.gpuMemoryLabel : "--",
          disk: row ? String(row.disk) : "--",
          createdAt: row ? row.createdAt : "--"
        };

        Object.keys(fieldMap).forEach(function (field) {
          const node = detailModal.querySelector("[data-spec-field='" + field + "']");
          if (node) {
            node.textContent = fieldMap[field];
          }
        });

        const gpuNode = detailModal.querySelector("[data-spec-field='gpu']");
        if (gpuNode) {
          gpuNode.innerHTML = row ? '<span class="spec-detail-gpu-chip">' + utils.escapeHtml(row.gpu) + "</span>" : "--";
        }

        const statusNode = detailModal.querySelector("[data-spec-field='status']");
        if (statusNode) {
          statusNode.innerHTML = row ? shell.renderStatusPill(row.enabled === false ? "idle" : "success", row.enabled === false ? "已禁用" : "启用中") : "--";
        }
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
        if (detailModal) {
          detailModal.classList.remove("visible");
        }
        if (backdrop && !addOpen) {
          backdrop.classList.remove("visible");
        }
      }

      function saveCreate() {
        const name = addState.name.trim();
        const description = addState.description.trim();
        const cpu = sanitizePositiveInt(addState.cpu);
        const memory = sanitizePositiveInt(addState.memory);
        const gpu = String(addState.gpu || "").trim();
        const gpuMemory = sanitizePositiveInt(addState.gpuMemory);
        const gpuCount = sanitizePositiveInt(addState.gpuCount);
        const disk = sanitizePositiveInt(addState.disk);

        if (!name) {
          showToast("信息不完整", "请填写规格名称。");
          return;
        }
        if (!cpu || !memory || !gpu || !gpuMemory || !gpuCount || !disk) {
          showToast("信息不完整", "请完整填写 CPU、内存、GPU、显存和硬盘信息。");
          return;
        }
        if (specPage.rows.some(function (row) {
          return utils.normalize(row.name) === utils.normalize(name);
        })) {
          showToast("名称重复", "当前规格名称已存在，请更换后再保存。");
          return;
        }

        if (STATIC_GPU_OPTIONS.indexOf(gpu) === -1 && specPage.customGpuOptions.indexOf(gpu) === -1) {
          specPage.customGpuOptions = specPage.customGpuOptions.concat([gpu]);
        }

        const specId = getNextSpecId(specPage.rows);
        const row = {
          id: "spec-" + specId,
          specId: specId,
          name: name,
          description: description || "自定义创建的资源规格。",
          cpu: cpu,
          memory: memory,
          gpu: gpu,
          gpuMemory: gpuMemory,
          gpuCount: gpuCount,
          gpuMemoryLabel: gpuCount + "*" + gpuMemory,
          disk: disk,
          createdAt: formatDateTime(new Date()),
          enabled: true
        };

        specPage.rows = [row].concat(specPage.rows);
        page.specManagePage.rows = specPage.rows;
        page.specManagePage.customGpuOptions = specPage.customGpuOptions;
        currentPage = 1;
        saveState();
        closeCreate();
        renderTable();
        showToast("保存成功", "规格 " + row.name + " 已创建。");
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
          showToast("已禁用", "规格 " + row.name + " 已禁用。");
          return;
        }
        if (action === "enable") {
          setRowsEnabled([rowId], true);
          showToast("已启用", "规格 " + row.name + " 已启用。");
          return;
        }
        if (action === "delete") {
          removeRows([rowId]);
          showToast("删除成功", "规格 " + row.name + " 已删除。");
        }
      }

      function onQuery() {
        currentPage = 1;
        renderTable();
      }

      function onReset() {
        if (cpuFilterSelect) {
          cpuFilterSelect.value = "";
        }
        if (memoryFilterSelect) {
          memoryFilterSelect.value = "";
        }
        if (gpuMemoryFilterSelect) {
          gpuMemoryFilterSelect.value = "";
        }
        if (searchInput) {
          searchInput.value = "";
        }
        currentPage = 1;
        renderTable();
      }

      function onClick(event) {
        const target = event.target;
        const presetButton = target.closest("[data-spec-preset]");
        const pageButton = target.closest("[data-page]");
        const rowActionButton = target.closest("[data-row-action]");

        if (target.closest("#spec-management-create")) {
          event.preventDefault();
          openCreate();
          return;
        }
        if (target.closest("#spec-management-query")) {
          event.preventDefault();
          onQuery();
          return;
        }
        if (target.closest("#spec-management-reset")) {
          event.preventDefault();
          onReset();
          return;
        }
        if (target.closest("#spec-management-select-all")) {
          event.preventDefault();
          toggleAllSelection();
          return;
        }
        if (target.closest("#spec-management-table-body .table-row-checkbox")) {
          event.preventDefault();
          toggleRowSelection(target.closest(".table-row-checkbox").getAttribute("data-row-id"));
          return;
        }
        if (rowActionButton) {
          event.preventDefault();
          handleRowAction(rowActionButton.getAttribute("data-row-action"), rowActionButton.getAttribute("data-row-id"));
          return;
        }
        if (presetButton) {
          event.preventDefault();
          const field = presetButton.getAttribute("data-spec-preset");
          const value = Number(presetButton.getAttribute("data-value"));
          if (field === "cpu") {
            addState.cpu = value;
          }
          if (field === "memory") {
            addState.memory = value;
          }
          syncAddModal();
          return;
        }
        if (target.closest("[data-spec-action='create-close']")) {
          event.preventDefault();
          closeCreate();
          return;
        }
        if (target.closest("[data-spec-action='create-save']")) {
          event.preventDefault();
          saveCreate();
          return;
        }
        if (target.closest("[data-spec-action='detail-close']")) {
          event.preventDefault();
          closeDetail();
          return;
        }
        if (target.closest("#spec-management-modal-backdrop")) {
          event.preventDefault();
          closeCreate();
          closeDetail();
          return;
        }
        if (pageButton && paginationNode && paginationNode.contains(pageButton) && !pageButton.disabled) {
          event.preventDefault();
          currentPage = Number(pageButton.getAttribute("data-page")) || 1;
          renderTable();
        }
      }

      function onInput(event) {
        const target = event.target;
        if (!target) {
          return;
        }
        if (target.id === "spec-create-name") {
          addState.name = target.value || "";
        }
        if (target.id === "spec-create-description") {
          addState.description = target.value || "";
        }
        if (target.id === "spec-create-cpu-custom") {
          addState.cpu = sanitizePositiveInt(target.value) || target.value;
        }
        if (target.id === "spec-create-memory-custom") {
          addState.memory = sanitizePositiveInt(target.value) || target.value;
        }
        if (target.id === "spec-create-gpu-memory") {
          addState.gpuMemory = sanitizePositiveInt(target.value) || target.value;
        }
        if (target.id === "spec-create-gpu-count") {
          addState.gpuCount = sanitizePositiveInt(target.value) || target.value;
        }
        if (target.id === "spec-create-disk") {
          addState.disk = sanitizePositiveInt(target.value) || target.value;
        }
      }

      function onChange(event) {
        const target = event.target;
        if (!target) {
          return;
        }
        if (target.id === "spec-create-gpu") {
          addState.gpu = target.value || "";
        }
        if (target.id === "spec-management-page-size") {
          currentPage = 1;
          renderTable();
        }
      }

      function onKeydown(event) {
        const target = event.target;
        if (!target) {
          return;
        }
        if (target.id === "spec-management-search" && event.key === "Enter") {
          event.preventDefault();
          onQuery();
          return;
        }
        if (target.id === "spec-management-page-jump" && event.key === "Enter") {
          event.preventDefault();
          const totalPages = Math.max(1, Math.ceil(getFilteredRows().length / getCurrentPageSize()));
          currentPage = clampPage(Number(pageJumpInput.value) || 1, totalPages);
          renderTable();
        }
      }

      function onJumpBlur() {
        const totalPages = Math.max(1, Math.ceil(getFilteredRows().length / getCurrentPageSize()));
        currentPage = clampPage(Number(pageJumpInput.value) || 1, totalPages);
        renderTable();
      }

      mountNode.addEventListener("click", onClick);
      mountNode.addEventListener("input", onInput);
      mountNode.addEventListener("change", onChange);
      mountNode.addEventListener("keydown", onKeydown);
      if (pageJumpInput) {
        pageJumpInput.addEventListener("blur", onJumpBlur);
      }
      if (queryButton) {
        queryButton.addEventListener("click", onQuery);
      }
      if (resetButton) {
        resetButton.addEventListener("click", onReset);
      }
      if (createButton) {
        createButton.removeAttribute("data-toast-title");
        createButton.removeAttribute("data-toast-message");
      }

      syncAddModal();
      renderTable();

      return function cleanup() {
        mountNode.removeEventListener("click", onClick);
        mountNode.removeEventListener("input", onInput);
        mountNode.removeEventListener("change", onChange);
        mountNode.removeEventListener("keydown", onKeydown);
        if (pageJumpInput) {
          pageJumpInput.removeEventListener("blur", onJumpBlur);
        }
        if (queryButton) {
          queryButton.removeEventListener("click", onQuery);
        }
        if (resetButton) {
          resetButton.removeEventListener("click", onReset);
        }
      };
    }
  });

  function renderToolbar() {
    return (
      '<div class="table-toolbar spec-management-toolbar">' +
      '<div class="toolbar-group">' +
      '<button id="spec-management-create" class="button spec-toolbar-create" type="button">新增规格</button>' +
      '</div>' +
      '<div class="toolbar-group spec-toolbar-filters">' +
      '<select id="spec-management-filter-cpu" class="filter-field spec-filter-select"></select>' +
      '<select id="spec-management-filter-memory" class="filter-field spec-filter-select"></select>' +
      '<select id="spec-management-filter-gpu-memory" class="filter-field spec-filter-select"></select>' +
      '<input id="spec-management-search" class="filter-field spec-filter-search" type="search" placeholder="规格ID、规格名称" />' +
      '<button id="spec-management-query" class="button" type="button">查询</button>' +
      '<button id="spec-management-reset" class="button-secondary" type="button">重置</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderTableShell(page) {
    return (
      '<div class="table-shell spec-management-table-shell">' +
      '<table>' +
      '<thead><tr>' +
      '<th class="table-select-cell"><button id="spec-management-select-all" class="table-row-checkbox table-row-checkbox-head" type="button" aria-label="全选"></button></th>' +
      '<th>规格ID</th>' +
      '<th>规格名称</th>' +
      '<th>vCPU(核)</th>' +
      '<th>内存(GB)</th>' +
      '<th>GPU</th>' +
      '<th>GPU显存(GB)</th>' +
      '<th>硬盘大小(GB)</th>' +
      '<th>创建时间</th>' +
      '<th>操作</th>' +
      '</tr></thead>' +
      '<tbody id="' + utils.escapeAttribute(page.key + "-table-body") + '"></tbody>' +
      '</table>' +
      '</div>'
    );
  }

  function renderFooter(page) {
    return (
      '<div class="table-footer spec-management-footer">' +
      '<div class="table-footer-count hint-text" id="' + utils.escapeAttribute(page.key + "-count") + '"></div>' +
      '<div class="spec-footer-right">' +
      '<div class="table-footer-pagination" id="' + utils.escapeAttribute(page.key + "-pagination") + '"></div>' +
      '<div class="spec-page-size">' +
      '<select id="spec-management-page-size" class="filter-field spec-page-size-select">' +
      PAGE_SIZE_OPTIONS.map(function (size) {
        return '<option value="' + size + '"' + (size === 5 ? " selected" : "") + ">" + size + "条/页</option>";
      }).join("") +
      '</select>' +
      '</div>' +
      '<div class="spec-page-jump">' +
      '<span>跳至</span>' +
      '<input id="spec-management-page-jump" class="filter-field spec-page-jump-input" type="number" min="1" value="1" />' +
      '<span>页</span>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function renderCreateModal() {
    return (
      '<section id="spec-management-create-modal" class="spec-modal spec-create-modal" role="dialog" aria-modal="true">' +
      '<header class="spec-modal-header">' +
      '<h3 class="spec-modal-title">新增规格</h3>' +
      '<button class="spec-modal-close" type="button" data-spec-action="create-close">×</button>' +
      '</header>' +
      '<div class="spec-modal-body spec-create-body">' +
      renderCreateField("规格名称", '<input id="spec-create-name" class="spec-form-control" type="text" maxlength="40" placeholder="输入规格名称" />', true) +
      renderCreateField("规格简介", '<textarea id="spec-create-description" class="spec-form-control spec-form-textarea" placeholder="输入规格简介"></textarea>', true) +
      renderCreateField("CPU", '<div class="spec-combo-row"><div id="spec-create-cpu-chips" class="spec-preset-group"></div><div class="spec-inline-editor spec-inline-editor-tail"><span class="spec-inline-separator">-</span><input id="spec-create-cpu-custom" class="spec-form-control spec-number-input" type="number" min="1" /><span>核</span></div></div>') +
      renderCreateField("内存", '<div class="spec-combo-row"><div id="spec-create-memory-chips" class="spec-preset-group"></div><div class="spec-inline-editor spec-inline-editor-tail"><span class="spec-inline-separator">-</span><input id="spec-create-memory-custom" class="spec-form-control spec-number-input" type="number" min="1" /><span>GB</span></div></div>') +
      renderCreateField("GPU", '<div class="spec-inline-editor spec-gpu-editor"><select id="spec-create-gpu" class="spec-form-control spec-select-control"></select><span class="spec-multiply">×</span><input id="spec-create-gpu-count" class="spec-form-control spec-number-input spec-number-input-small" type="number" min="1" /></div>') +
      renderCreateField("显存", '<div class="spec-inline-editor compact"><input id="spec-create-gpu-memory" class="spec-form-control spec-number-input" type="number" min="1" /><span>GB</span></div>') +
      renderCreateField("硬盘", '<div class="spec-inline-editor compact"><input id="spec-create-disk" class="spec-form-control spec-number-input" type="number" min="1" /><span>GB</span></div>') +
      '</div>' +
      '<footer class="spec-modal-footer">' +
      '<button class="button-secondary" type="button" data-spec-action="create-close">取消</button>' +
      '<button class="button" type="button" data-spec-action="create-save">保存</button>' +
      '</footer>' +
      '</section>'
    );
  }

  function renderCreateField(label, content, full) {
    return (
      '<div class="spec-form-row' + (full ? " full" : "") + '">' +
      '<div class="spec-form-label">' + utils.escapeHtml(label) + "</div>" +
      '<div class="spec-form-value">' + content + "</div>" +
      "</div>"
    );
  }

  function renderDetailModal() {
    return (
      '<section id="spec-management-detail-modal" class="spec-modal spec-detail-modal" role="dialog" aria-modal="true">' +
      '<header class="spec-modal-header">' +
      '<h3 class="spec-modal-title">规格详情</h3>' +
      '<button class="spec-modal-close" type="button" data-spec-action="detail-close">×</button>' +
      '</header>' +
      '<div class="spec-modal-body spec-detail-body">' +
      '<div class="spec-detail-grid">' +
      renderDetailItem("规格ID", "specId") +
      renderDetailItem("规格名称", "name") +
      renderDetailItem("vCPU", "cpu") +
      renderDetailItem("内存", "memory") +
      renderDetailItem("GPU", "gpu") +
      renderDetailItem("GPU显存", "gpuMemory") +
      renderDetailItem("创建时间", "createdAt") +
      renderDetailItem("状态", "status") +
      renderDetailItem("硬盘", "disk") +
      '</div>' +
      '</div>' +
      '<footer class="spec-modal-footer">' +
      '<button class="button-secondary" type="button" data-spec-action="detail-close">关闭</button>' +
      '</footer>' +
      '</section>'
    );
  }

  function renderDetailItem(label, field) {
    return (
      '<div class="spec-detail-item">' +
      '<div class="spec-detail-label">' + utils.escapeHtml(label) + "</div>" +
      '<div class="spec-detail-value" data-spec-field="' + utils.escapeAttribute(field) + '">--</div>' +
      "</div>"
    );
  }

  function renderPresetButton(field, value, active, unit) {
    return (
      '<button class="spec-preset-button' + (active ? " active" : "") + '" type="button" data-spec-preset="' + utils.escapeAttribute(field) + '" data-value="' + utils.escapeAttribute(String(value)) + '">' +
      '<span>' + utils.escapeHtml(String(value) + unit) + "</span>" +
      "</button>"
    );
  }

  function renderFilterOptions(placeholder, values) {
    return (
      '<option value="">' + utils.escapeHtml(placeholder) + "</option>" +
      values.map(function (value) {
        return '<option value="' + utils.escapeAttribute(String(value)) + '">' + utils.escapeHtml(String(value)) + "</option>";
      }).join("")
    );
  }

  function createDefaultAddState() {
    return {
      name: "",
      description: "",
      cpu: 4,
      memory: 8,
      gpu: "Atlas 300V",
      gpuMemory: 16,
      gpuCount: 2,
      disk: 500,
      tempGpuOptions: []
    };
  }

  function sanitizePositiveInt(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
      return 0;
    }
    return Math.round(number);
  }

  function getNextSpecId(rows) {
    const numbers = rows.map(function (row) {
      return Number(row.specId);
    }).filter(function (value) {
      return Number.isFinite(value);
    });
    return String((numbers.length ? Math.max.apply(Math, numbers) : 100000) + 11111);
  }

  function formatDateTime(date) {
    const current = date instanceof Date ? date : new Date();
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    const hour = String(current.getHours()).padStart(2, "0");
    const minute = String(current.getMinutes()).padStart(2, "0");
    const second = String(current.getSeconds()).padStart(2, "0");
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  }

  function buildPaginationHtml(currentPage, totalPages) {
    const safeTotalPages = Math.max(totalPages, 1);
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(safeTotalPages, currentPage + 1);
    const html = [];

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
      ">></button>"
    );

    return html.join("");
  }

  function clampPage(pageNumber, totalPages) {
    const page = Number(pageNumber) || 1;
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }

  function createLookup(ids) {
    return ids.reduce(function (acc, id) {
      acc[id] = true;
      return acc;
    }, Object.create(null));
  }

  function uniqueValues(values) {
    const lookup = Object.create(null);
    return values.filter(function (value) {
      const key = String(value == null ? "" : value);
      if (!key || lookup[key]) {
        return false;
      }
      lookup[key] = true;
      return true;
    });
  }

  function optionExists(selectNode, value) {
    return Array.prototype.some.call(selectNode.options || [], function (option) {
      return option.value === value;
    });
  }
})();
