(function () {
  const utils = window.PROTOTYPE_UTILS;

  const PLACEHOLDER = "../assets/images/image-preview-placeholder.svg";
  const DETAIL_MAIN_A = "../images/177366061970.png";
  const DETAIL_MAIN_B = "../images/17738165977198.png";
  const DETAIL_THUMB_A = "../images/17738166288312.png";
  const DETAIL_THUMB_B = "../images/17738166555824.png";
  const DETAIL_THUMB_C = "../images/17738166707852.png";
  const DETAIL_MAP = "../images/17738166915508.png";

  const GALLERY_STREAM = [DETAIL_MAIN_A, DETAIL_MAIN_B, DETAIL_THUMB_A, DETAIL_THUMB_B, DETAIL_THUMB_C];
  const GALLERY_IMAGE = [DETAIL_MAIN_B, DETAIL_MAIN_A, DETAIL_THUMB_A, DETAIL_THUMB_B, DETAIL_THUMB_C];

  const SORT_OPTIONS = [
    { value: "time-desc", label: "按事件时间倒序" },
    { value: "time-asc", label: "按事件时间正序" }
  ];

  const STREAM_ROWS = [
    createEventRow("stream-event-001", "安全告警", "AD0008-北门", "北门安全告警分析", "2025-11-18 09:12:05", "已推送", "success", false, DETAIL_MAIN_A, GALLERY_STREAM, "视频流", "114.36983, 22.78828"),
    createEventRow("stream-event-002", "交通违章", "AD0012-停车场区", "园区交通秩序分析", "2025-11-18 10:23:41", "已推送", "success", false, DETAIL_MAIN_B, GALLERY_IMAGE, "视频流", "114.36983, 22.78828"),
    createEventRow("stream-event-003", "环境隐患", "AD0015-仓库2号", "仓储环境风险巡检", "2025-11-18 11:45:22", "待推送", "warning", true, DETAIL_MAIN_A, GALLERY_STREAM, "视频流", "114.36983, 22.78828"),
    createEventRow("stream-event-004", "系统维护", "AD0020-主入口", "主入口系统巡检", "2025-11-18 14:08:33", "已推送", "success", false, DETAIL_MAIN_B, GALLERY_IMAGE, "视频流", "114.36983, 22.78828"),
    createEventRow("stream-event-005", "占道经营检测事件", "AD0008-NH02南湖市场门口路", "南湖市场占道经营分析", "2025-11-18 19:46:30", "已推送", "success", true, DETAIL_MAIN_B, GALLERY_IMAGE, "视频流", "114.36983, 22.78828"),
    createEventRow("stream-event-006", "人群聚集", "AD0036-园区广场", "广场人群密度分析", "2025-11-18 20:11:16", "待推送", "warning", false, DETAIL_MAIN_A, GALLERY_STREAM, "视频流", "114.36983, 22.78828")
  ];

  const IMAGE_ROWS = [
    createEventRow("image-event-001", "安全告警", "AD0008-北门", "门岗图片分析", "2025-11-18 09:12:05", "已推送", "success", false, DETAIL_MAIN_A, GALLERY_STREAM, "SDK抓图", "114.36983, 22.78828"),
    createEventRow("image-event-002", "交通违章", "AD0012-停车场区", "停车场抓拍分析", "2025-11-18 10:23:41", "已推送", "success", true, DETAIL_MAIN_B, GALLERY_IMAGE, "SDK抓图", "114.36983, 22.78828"),
    createEventRow("image-event-003", "环境隐患", "AD0015-仓库2号", "仓储图片分析", "2025-11-18 11:45:22", "待推送", "warning", false, DETAIL_MAIN_A, GALLERY_STREAM, "API", "114.36983, 22.78828"),
    createEventRow("image-event-004", "系统维护", "AD0020-主入口", "主入口巡检抓图", "2025-11-18 14:08:33", "已推送", "success", false, DETAIL_MAIN_B, GALLERY_IMAGE, "API", "114.36983, 22.78828"),
    createEventRow("image-event-005", "占道经营检测事件", "AD0008-NH02南湖市场门口路", "市场秩序图片分析", "2025-11-18 19:46:30", "已推送", "success", true, DETAIL_MAIN_B, GALLERY_IMAGE, "消息队列", "114.36983, 22.78828"),
    createEventRow("image-event-006", "人员着装异常", "AD0050-生产车间", "工服合规分析", "2025-11-18 20:02:18", "待推送", "warning", false, DETAIL_MAIN_A, GALLERY_STREAM, "SDK抓图", "114.36983, 22.78828")
  ];

  window.registerPrototypePage({
    key: "event-list",
    kind: "table",
    styleSource: "../assets/css/pages/event-list.css",
    heading: "事件列表",
    subtitle: "统一查看视频流分析与图片分析事件。",
    breadcrumbTrail: ["事件中心"],
    tablePanel: {},
    countTextPrefix: "共",
    countTextUnit: "条",
    emptyText: "暂无事件数据",
    eventCenterPage: {
      pageSize: 5,
      tabs: [
        { key: "stream", label: "视频流分析" },
        { key: "image", label: "图片分析" }
      ],
      rows: {
        stream: STREAM_ROWS,
        image: IMAGE_ROWS
      }
    },
    renderTablePanel: function (context) {
      const page = context.page;
      return (
        '<section class="panel event-list-page">' +
        renderTabs(page) +
        renderFilters(page) +
        renderToolbar() +
        renderContent() +
        renderFooter() +
        renderDetailModal() +
        '<div id="event-list-modal-backdrop" class="event-list-modal-backdrop"></div>' +
        "</section>"
      );
    },
    setup: function (runtime) {
      const page = runtime.page || {};
      const eventPage = page.eventCenterPage || {};
      const showToast = runtime.showToast || function () {};
      const mockStore = runtime.mockStore;
      const mountNode = runtime.mountNode;
      const selected = Object.create(null);
      const state = {
        activeTab: "stream",
        showFavoritesOnly: false,
        sort: "time-desc",
        view: "table",
        currentPage: 1,
        detailRowId: "",
        detailOpen: false,
        detailIndex: 0,
        detailZoom: false,
        filters: {
          stream: { type: "", point: "", task: "", dateStart: "", dateEnd: "" },
          image: { type: "", task: "", dateStart: "", dateEnd: "", inputMode: "", point: "" }
        }
      };

      eventPage.rows = {
        stream: normalizeEventRows(getRows("stream"), "stream"),
        image: normalizeEventRows(getRows("image"), "image")
      };
      page.eventCenterPage.rows = eventPage.rows;

      function getRows(tabKey) {
        return (((eventPage || {}).rows || {})[tabKey]) || [];
      }

      function saveRows() {
        page.eventCenterPage.rows = eventPage.rows;
        if (mockStore && typeof mockStore.patchPage === "function") {
          mockStore.patchPage(page.key, { eventCenterPage: { rows: eventPage.rows } }, page);
        }
      }

      function getActiveFilters() {
        return state.filters[state.activeTab] || {};
      }

      function getFilteredRows() {
        const filters = getActiveFilters();
        const rows = getRows(state.activeTab).filter(function (row) {
          if (state.showFavoritesOnly && !row.favorite) {
            return false;
          }
          if (filters.type && row.type !== filters.type) {
            return false;
          }
          if (filters.point && row.point !== filters.point) {
            return false;
          }
          if (filters.task && row.task !== filters.task) {
            return false;
          }
          if (state.activeTab === "image" && filters.inputMode && row.inputMode !== filters.inputMode) {
            return false;
          }
          if (filters.dateStart && row.time < filters.dateStart) {
            return false;
          }
          if (filters.dateEnd && row.time > filters.dateEnd + " 23:59:59") {
            return false;
          }
          return true;
        }).slice();

        rows.sort(function (left, right) {
          return state.sort === "time-asc"
            ? String(left.time).localeCompare(String(right.time))
            : String(right.time).localeCompare(String(left.time));
        });

        return rows;
      }

      function getPagedRows() {
        const rows = getFilteredRows();
        const pageSize = Number(eventPage.pageSize) || 5;
        const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
        state.currentPage = clampPage(state.currentPage, totalPages);
        return rows.slice((state.currentPage - 1) * pageSize, state.currentPage * pageSize);
      }

      function findRow(rowId) {
        return getRows("stream").concat(getRows("image")).find(function (row) {
          return row.id === rowId;
        }) || null;
      }

      function renderPage() {
        renderTabState();
        renderFilterState();
        renderRows();
        renderPagination();
        syncDetailModal();
      }

      function renderTabState() {
        const head = document.getElementById("event-list-head");
        Array.prototype.forEach.call(mountNode.querySelectorAll("[data-event-tab]"), function (button) {
          button.classList.toggle("active", button.getAttribute("data-event-tab") === state.activeTab);
        });
        Array.prototype.forEach.call(mountNode.querySelectorAll("[data-event-filter-group]"), function (group) {
          group.classList.toggle("active", group.getAttribute("data-event-filter-group") === state.activeTab);
        });
        Array.prototype.forEach.call(mountNode.querySelectorAll("[data-event-view]"), function (button) {
          button.classList.toggle("active", button.getAttribute("data-event-view") === state.view);
        });
        if (head) {
          head.innerHTML = renderTableHead(state.activeTab);
        }
        toggleHidden("event-list-table-wrap", state.view !== "table");
        toggleHidden("event-list-grid-wrap", state.view !== "grid");
        setChecked("event-list-favorites", state.showFavoritesOnly);
        setValue("event-list-sort", state.sort);
      }

      function renderFilterState() {
        const filters = getActiveFilters();
        Object.keys(filters).forEach(function (key) {
          setValue("event-list-filter-" + state.activeTab + "-" + key, filters[key] || "");
        });
      }

      function renderRows() {
        const pagedRows = getPagedRows();
        const tbody = document.getElementById("event-list-table-body");
        const grid = document.getElementById("event-list-grid");
        const selectAll = document.getElementById("event-list-select-all");

        if (tbody) {
          tbody.innerHTML = pagedRows.length ? pagedRows.map(function (row) {
            return renderTableRow(row, state.activeTab, !!selected[row.id]);
          }).join("") : '<tr><td colspan="' + (state.activeTab === "image" ? "8" : "7") + '"><div class="empty-state">暂无事件数据</div></td></tr>';
        }

        if (grid) {
          grid.innerHTML = pagedRows.length ? pagedRows.map(function (row) {
            return renderGridCard(row, state.activeTab, !!selected[row.id]);
          }).join("") : '<div class="empty-state event-grid-empty">暂无事件数据</div>';
        }

        if (selectAll) {
          const ids = pagedRows.map(function (row) { return row.id; });
          const allChecked = ids.length > 0 && ids.every(function (id) { return !!selected[id]; });
          selectAll.classList.toggle("checked", allChecked);
        }
      }

      function renderPagination() {
        const rows = getFilteredRows();
        const pageSize = Number(eventPage.pageSize) || 5;
        const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
        setText("event-list-count", "共" + rows.length + "条");
        setHtml("event-list-pagination", buildPaginationHtml(state.currentPage, totalPages));
        setValue("event-list-page-jump", String(state.currentPage));
        setValue("event-list-page-size", String(pageSize));
      }

      function syncDetailModal() {
        const modal = document.getElementById("event-list-detail-modal");
        const backdrop = document.getElementById("event-list-modal-backdrop");
        const row = findRow(state.detailRowId);
        if (!modal || !backdrop) {
          return;
        }

        if (row) {
          const gallery = Array.isArray(row.gallery) && row.gallery.length ? row.gallery : [row.image || PLACEHOLDER];
          state.detailIndex = clampGalleryIndex(state.detailIndex, gallery.length);
          const currentImage = gallery[state.detailIndex] || gallery[0];

          setTextIn(modal, "title", row.type);
          setTextIn(modal, "time", row.time);
          setTextIn(modal, "point", row.point);
          setTextIn(modal, "type", row.type);
          setTextIn(modal, "push", row.pushStatus);
          setTextIn(modal, "mode", row.inputMode || "视频流分析");
          setTextIn(modal, "coords", row.coordinates || "--");

          setImageIn(modal, "image", currentImage, row.type);
          setImageIn(modal, "map", row.mapImage || DETAIL_MAP, row.point);

          const zoomToggle = modal.querySelector("[data-event-detail='zoom']");
          if (zoomToggle) {
            zoomToggle.classList.toggle("on", !!state.detailZoom);
          }

          const thumbTrack = modal.querySelector("[data-event-detail='thumbs']");
          if (thumbTrack) {
            thumbTrack.innerHTML = gallery.map(function (src, index) {
              return '<button class="event-detail-thumb' + (index === state.detailIndex ? ' active' : '') + '" type="button" data-event-thumb="' + index + '"><img src="' + utils.escapeAttribute(src) + '" alt="' + utils.escapeAttribute(row.type) + '" /></button>';
            }).join("");
          }

          modal.classList.toggle("zoomed", !!state.detailZoom);
        }

        modal.classList.toggle("visible", !!state.detailOpen);
        backdrop.classList.toggle("visible", !!state.detailOpen);
      }

      function toggleFavorite(rowId) {
        eventPage.rows[state.activeTab] = getRows(state.activeTab).map(function (row) {
          return row.id === rowId ? Object.assign({}, row, { favorite: !row.favorite }) : row;
        });
        saveRows();
        renderPage();
      }

      function removeRow(rowId) {
        eventPage.rows[state.activeTab] = getRows(state.activeTab).filter(function (row) {
          return row.id !== rowId;
        });
        delete selected[rowId];
        saveRows();
        renderPage();
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
        renderRows();
      }

      function toggleAllSelection() {
        const ids = getPagedRows().map(function (row) { return row.id; });
        const allChecked = ids.length > 0 && ids.every(function (id) { return !!selected[id]; });
        ids.forEach(function (id) {
          if (allChecked) {
            delete selected[id];
          } else {
            selected[id] = true;
          }
        });
        renderRows();
      }

      function openDetail(rowId) {
        state.detailRowId = rowId;
        state.detailIndex = 0;
        state.detailZoom = false;
        state.detailOpen = true;
        syncDetailModal();
      }

      function closeDetail() {
        state.detailRowId = "";
        state.detailIndex = 0;
        state.detailZoom = false;
        state.detailOpen = false;
        syncDetailModal();
      }

      function moveDetail(step) {
        const row = findRow(state.detailRowId);
        const gallery = row && row.gallery ? row.gallery : [];
        if (!gallery.length) {
          return;
        }
        state.detailIndex = (state.detailIndex + step + gallery.length) % gallery.length;
        syncDetailModal();
      }

      function onClick(event) {
        const target = event.target;
        const tab = target.closest("[data-event-tab]");
        const view = target.closest("[data-event-view]");
        const rowAction = target.closest("[data-row-action]");
        const rowCheckbox = target.closest("[data-event-row-select]");
        const pageButton = target.closest("[data-page]");
        const thumbButton = target.closest("[data-event-thumb]");
        const detailAction = target.closest("[data-event-detail-action]");

        if (tab) {
          event.preventDefault();
          state.activeTab = tab.getAttribute("data-event-tab") || "stream";
          state.currentPage = 1;
          Object.keys(selected).forEach(function (key) { delete selected[key]; });
          renderPage();
          return;
        }

        if (view) {
          event.preventDefault();
          state.view = view.getAttribute("data-event-view") || "table";
          renderTabState();
          return;
        }

        if (target.closest("#event-list-query")) {
          event.preventDefault();
          state.currentPage = 1;
          renderPage();
          return;
        }

        if (target.closest("#event-list-reset")) {
          event.preventDefault();
          state.filters = {
            stream: { type: "", point: "", task: "", dateStart: "", dateEnd: "" },
            image: { type: "", task: "", dateStart: "", dateEnd: "", inputMode: "", point: "" }
          };
          state.showFavoritesOnly = false;
          state.sort = "time-desc";
          state.currentPage = 1;
          renderPage();
          return;
        }

        if (target.closest("#event-list-select-all")) {
          event.preventDefault();
          toggleAllSelection();
          return;
        }

        if (rowCheckbox) {
          event.preventDefault();
          toggleRowSelection(rowCheckbox.getAttribute("data-event-row-select"));
          return;
        }

        if (rowAction) {
          event.preventDefault();
          const action = rowAction.getAttribute("data-row-action");
          const rowId = rowAction.getAttribute("data-row-id");
          if (action === "detail") {
            openDetail(rowId);
          } else if (action === "export") {
            showToast("导出事件", "当前原型保留导出入口。");
          } else if (action === "delete") {
            removeRow(rowId);
            showToast("删除成功", "事件记录已删除。");
          } else if (action === "favorite") {
            toggleFavorite(rowId);
            showToast("收藏已更新", "当前事件收藏状态已切换。");
          }
          return;
        }

        if (pageButton) {
          event.preventDefault();
          state.currentPage = Number(pageButton.getAttribute("data-page")) || 1;
          renderPage();
          return;
        }

        if (target.closest("[data-event-detail-close]") || target.closest("#event-list-modal-backdrop")) {
          event.preventDefault();
          closeDetail();
          return;
        }

        if (thumbButton) {
          event.preventDefault();
          state.detailIndex = Number(thumbButton.getAttribute("data-event-thumb")) || 0;
          syncDetailModal();
          return;
        }

        if (detailAction) {
          event.preventDefault();
          const action = detailAction.getAttribute("data-event-detail-action");
          if (action === "prev") {
            moveDetail(-1);
          } else if (action === "next") {
            moveDetail(1);
          } else if (action === "zoom") {
            state.detailZoom = !state.detailZoom;
            syncDetailModal();
          } else if (action === "preview") {
            showToast("实时预览", "当前原型保留实时预览入口。");
          } else if (action === "playback") {
            showToast("事件回放", "当前原型保留事件回放入口。");
          } else if (action === "download-image") {
            showToast("图片下载", "当前原型保留图片下载入口。");
          } else if (action === "download-video") {
            showToast("录像下载", "当前原型保留录像下载入口。");
          } else if (action === "fullscreen") {
            showToast("全屏查看", "当前原型保留全屏查看入口。");
          } else if (action === "thumb-prev") {
            moveDetail(-1);
          } else if (action === "thumb-next") {
            moveDetail(1);
          }
        }
      }

      function onInput(event) {
        const target = event.target;
        if (!target || !target.id) {
          return;
        }
        const prefix = "event-list-filter-" + state.activeTab + "-";
        if (target.id.indexOf(prefix) === 0) {
          state.filters[state.activeTab][target.id.slice(prefix.length)] = target.value || "";
        }
      }

      function onChange(event) {
        const target = event.target;
        if (!target || !target.id) {
          return;
        }
        if (target.id === "event-list-favorites") {
          state.showFavoritesOnly = !!target.checked;
          state.currentPage = 1;
          renderPage();
          return;
        }
        if (target.id === "event-list-sort") {
          state.sort = target.value || "time-desc";
          renderPage();
          return;
        }
        if (target.id === "event-list-page-size") {
          eventPage.pageSize = Number(target.value) || 5;
          page.eventCenterPage.pageSize = eventPage.pageSize;
          if (mockStore && typeof mockStore.patchPage === "function") {
            mockStore.patchPage(page.key, { eventCenterPage: { pageSize: eventPage.pageSize } }, page);
          }
          state.currentPage = 1;
          renderPage();
        }
      }

      function onKeydown(event) {
        const target = event.target;
        if (!target || target.id !== "event-list-page-jump" || event.key !== "Enter") {
          return;
        }
        event.preventDefault();
        const totalPages = Math.max(1, Math.ceil(getFilteredRows().length / (Number(eventPage.pageSize) || 5)));
        state.currentPage = clampPage(Number(target.value) || 1, totalPages);
        renderPage();
      }

      mountNode.addEventListener("click", onClick);
      mountNode.addEventListener("input", onInput);
      mountNode.addEventListener("change", onChange);
      mountNode.addEventListener("keydown", onKeydown);
      renderPage();

      return function cleanup() {
        mountNode.removeEventListener("click", onClick);
        mountNode.removeEventListener("input", onInput);
        mountNode.removeEventListener("change", onChange);
        mountNode.removeEventListener("keydown", onKeydown);
      };
    }
  });

  function createEventRow(id, type, point, task, time, pushStatus, pushTone, favorite, image, gallery, inputMode, coordinates) {
    return {
      id: id,
      type: type,
      point: point,
      task: task,
      time: time,
      pushStatus: pushStatus,
      pushTone: pushTone,
      favorite: favorite,
      image: image || PLACEHOLDER,
      gallery: gallery || [image || PLACEHOLDER],
      inputMode: inputMode || "",
      mapImage: DETAIL_MAP,
      coordinates: coordinates || "--"
    };
  }

  function normalizeEventRows(rows, mode) {
    const sourceRows = Array.isArray(rows) && rows.length ? rows : (mode === "image" ? IMAGE_ROWS : STREAM_ROWS);
    const gallery = mode === "image" ? GALLERY_IMAGE : GALLERY_STREAM;
    const fallbackImage = mode === "image" ? DETAIL_MAIN_B : DETAIL_MAIN_A;
    return sourceRows.map(function (row) {
      return Object.assign({}, row, {
        image: row && row.image && row.image !== PLACEHOLDER ? row.image : fallbackImage,
        gallery: gallery.slice(),
        mapImage: DETAIL_MAP,
        coordinates: row && row.coordinates ? row.coordinates : "114.36983, 22.78828"
      });
    });
  }

  function renderTabs(page) {
    const tabs = (((page || {}).eventCenterPage || {}).tabs) || [];
    return '<div class="event-list-tabs">' + tabs.map(function (tab) {
      return '<button class="event-list-tab' + (tab.key === "stream" ? ' active' : '') + '" type="button" data-event-tab="' + utils.escapeAttribute(tab.key) + '">' + utils.escapeHtml(tab.label) + '</button>';
    }).join("") + '</div>';
  }

  function renderFilters(page) {
    const rows = (((page || {}).eventCenterPage || {}).rows) || {};
    return (
      '<div class="event-list-filters">' +
      renderStreamFilters(rows.stream || []) +
      renderImageFilters(rows.image || []) +
      '<div class="event-list-filter-actions"><button id="event-list-query" class="button" type="button">查询</button><button id="event-list-reset" class="button-secondary" type="button">重置</button></div>' +
      '</div>'
    );
  }

  function renderStreamFilters(rows) {
    return (
      '<div class="event-filter-group active" data-event-filter-group="stream">' +
      renderSelectFilter("stream", "type", "事件类型", uniqueOptions(rows, "type"), "请选择") +
      renderSelectFilter("stream", "point", "事件点位", uniqueOptions(rows, "point"), "请选择") +
      renderSelectFilter("stream", "task", "分析任务", uniqueOptions(rows, "task"), "请选择") +
      renderDateRangeFilter("stream") +
      '</div>'
    );
  }

  function renderImageFilters(rows) {
    return (
      '<div class="event-filter-group" data-event-filter-group="image">' +
      renderSelectFilter("image", "type", "事件类型", uniqueOptions(rows, "type"), "请选择") +
      renderSelectFilter("image", "task", "分析任务", uniqueOptions(rows, "task"), "请选择") +
      renderDateRangeFilter("image") +
      renderSelectFilter("image", "inputMode", "输入方式", uniqueOptions(rows, "inputMode"), "请选择") +
      renderSelectFilter("image", "point", "事件点位", uniqueOptions(rows, "point"), "请选择") +
      '</div>'
    );
  }

  function renderToolbar() {
    return (
      '<div class="event-list-toolbar">' +
      '<label class="event-favorite-toggle"><input id="event-list-favorites" type="checkbox" /><span>查看收藏事件</span></label>' +
      '<select id="event-list-sort" class="filter-field event-sort-select">' + SORT_OPTIONS.map(function (option) {
        return '<option value="' + utils.escapeAttribute(option.value) + '">' + utils.escapeHtml(option.label) + '</option>';
      }).join("") + '</select>' +
      '<div class="event-view-toggle"><button class="event-view-button active" type="button" data-event-view="table" aria-label="列表视图"></button><button class="event-view-button event-view-button-grid" type="button" data-event-view="grid" aria-label="卡片视图"></button></div>' +
      '</div>'
    );
  }

  function renderContent() {
    return (
      '<div id="event-list-table-wrap" class="event-list-table-wrap">' +
      '<div class="table-shell event-list-table-shell"><table><thead id="event-list-head">' + renderTableHead("stream") + '</thead><tbody id="event-list-table-body"></tbody></table></div>' +
      '</div>' +
      '<div id="event-list-grid-wrap" class="event-list-grid-wrap hidden"><div id="event-list-grid" class="event-list-grid"></div></div>'
    );
  }

  function renderFooter() {
    return (
      '<div class="table-footer event-list-footer">' +
      '<div class="table-footer-count hint-text" id="event-list-count"></div>' +
      '<div class="event-list-footer-right"><div class="table-footer-pagination" id="event-list-pagination"></div><select id="event-list-page-size" class="filter-field event-page-size"><option value="5" selected>5条/页</option><option value="10">10条/页</option></select><div class="event-page-jump"><span>跳至</span><input id="event-list-page-jump" class="filter-field event-page-jump-input" type="number" min="1" value="1" /><span>页</span></div></div>' +
      '</div>'
    );
  }

  function renderTableHead(tabKey) {
    if (tabKey === "image") {
      return '<tr><th class="table-select-cell"><button id="event-list-select-all" class="table-row-checkbox table-row-checkbox-head" type="button" aria-label="全选"></button></th><th>事件图片</th><th>事件类型</th><th>输入方式</th><th>事件地址</th><th>事件时间</th><th>事件推送</th><th>操作</th></tr>';
    }
    return '<tr><th class="table-select-cell"><button id="event-list-select-all" class="table-row-checkbox table-row-checkbox-head" type="button" aria-label="全选"></button></th><th>事件图片</th><th>事件类型</th><th>事件地址</th><th>事件时间</th><th>事件推送</th><th>操作</th></tr>';
  }

  function renderTableRow(row, tabKey, isSelected) {
    return '<tr class="' + (isSelected ? 'row-selected' : '') + '"><td class="table-select-cell"><button class="table-row-checkbox' + (isSelected ? ' checked' : '') + '" type="button" data-event-row-select="' + utils.escapeAttribute(row.id) + '"></button></td><td>' + renderImageThumb(row.image, row.type) + '</td><td>' + utils.escapeHtml(row.type) + '</td>' + (tabKey === "image" ? '<td>' + utils.escapeHtml(row.inputMode || "--") + '</td>' : '') + '<td>' + utils.escapeHtml(row.point) + '</td><td>' + utils.escapeHtml(row.time) + '</td><td><span class="event-push-label ' + utils.escapeAttribute(row.pushTone || "idle") + '">' + utils.escapeHtml(row.pushStatus || "--") + '</span></td><td>' + renderActions(row) + '</td></tr>';
  }

  function renderGridCard(row, tabKey, isSelected) {
    return '<article class="event-grid-card' + (isSelected ? ' selected' : '') + '"><button class="table-row-checkbox event-grid-checkbox' + (isSelected ? ' checked' : '') + '" type="button" data-event-row-select="' + utils.escapeAttribute(row.id) + '"></button>' + renderImageThumb(row.image, row.type) + '<div class="event-grid-meta"><h4>' + utils.escapeHtml(row.type) + '</h4><div>' + utils.escapeHtml(row.point) + '</div><div>' + utils.escapeHtml(row.time) + '</div>' + (tabKey === "image" ? '<div>' + utils.escapeHtml(row.inputMode || "--") + '</div>' : '') + '<div><span class="event-push-label ' + utils.escapeAttribute(row.pushTone || "idle") + '">' + utils.escapeHtml(row.pushStatus || "--") + '</span></div></div>' + renderActions(row) + '</article>';
  }

  function renderActions(row) {
    return '<div class="table-actions"><button class="table-action table-action-link" type="button" data-row-action="detail" data-row-id="' + utils.escapeAttribute(row.id) + '">详情</button><button class="table-action table-action-link" type="button" data-row-action="export" data-row-id="' + utils.escapeAttribute(row.id) + '">导出</button><button class="table-action table-action-link table-action-danger" type="button" data-row-action="delete" data-row-id="' + utils.escapeAttribute(row.id) + '">删除</button><button class="table-action table-action-link" type="button" data-row-action="favorite" data-row-id="' + utils.escapeAttribute(row.id) + '">' + (row.favorite ? "取消收藏" : "收藏") + '</button></div>';
  }

  function renderImageThumb(src, alt) {
    return '<div class="event-thumb"><img src="' + utils.escapeAttribute(src || PLACEHOLDER) + '" alt="' + utils.escapeAttribute(alt || "") + '" /></div>';
  }

  function renderSelectFilter(tabKey, field, label, options, placeholder) {
    return '<label class="event-filter-item"><span>' + utils.escapeHtml(label) + '</span><select id="event-list-filter-' + utils.escapeAttribute(tabKey + "-" + field) + '" class="filter-field"><option value="">' + utils.escapeHtml(placeholder || "请选择") + '</option>' + options.map(function (option) { return '<option value="' + utils.escapeAttribute(option) + '">' + utils.escapeHtml(option) + '</option>'; }).join("") + '</select></label>';
  }

  function renderDateRangeFilter(tabKey) {
    return '<label class="event-filter-item event-filter-date"><span>事件时间</span><div class="event-date-range"><input id="event-list-filter-' + utils.escapeAttribute(tabKey + "-dateStart") + '" class="filter-field" type="date" /><span>~</span><input id="event-list-filter-' + utils.escapeAttribute(tabKey + "-dateEnd") + '" class="filter-field" type="date" /></div></label>';
  }

  function renderDetailModal() {
    return '<section id="event-list-detail-modal" class="event-list-modal" role="dialog" aria-modal="true"><header class="event-list-modal-header"><h3 class="event-list-modal-title" data-event-detail-text="title">事件详情</h3><button class="event-list-modal-close" type="button" data-event-detail-close="true">×</button></header><div class="event-list-modal-body"><div class="event-detail-shell"><section class="event-detail-stage-card"><div class="event-detail-stage-wrap"><button class="event-detail-nav event-detail-nav-prev" type="button" data-event-detail-action="prev">‹</button><div class="event-detail-stage"><img data-event-detail="image" src="' + utils.escapeAttribute(PLACEHOLDER) + '" alt="事件预览" /></div><button class="event-detail-nav event-detail-nav-next" type="button" data-event-detail-action="next">›</button></div><div class="event-detail-toolbar"><button class="event-detail-zoom" type="button" data-event-detail="zoom" data-event-detail-action="zoom"><span class="event-detail-zoom-track"><span class="event-detail-zoom-knob"></span></span><span>放大镜</span></button><div class="event-detail-actions"><button class="button-secondary event-detail-action-button" type="button" data-event-detail-action="preview">实时预览</button><button class="button-secondary event-detail-action-button" type="button" data-event-detail-action="playback">事件回放</button><button class="button-secondary event-detail-action-button" type="button" data-event-detail-action="download-image">图片下载</button><button class="button-secondary event-detail-action-button" type="button" data-event-detail-action="download-video">录像下载</button><button class="button-secondary event-detail-action-button" type="button" data-event-detail-action="fullscreen">全屏查看</button></div></div><div class="event-detail-thumbs-wrap"><button class="event-detail-thumb-nav" type="button" data-event-detail-action="thumb-prev">‹</button><div class="event-detail-thumbs" data-event-detail="thumbs"></div><button class="event-detail-thumb-nav" type="button" data-event-detail-action="thumb-next">›</button></div></section><aside class="event-detail-side-card"><section class="event-detail-info-card"><h4>基本信息</h4>' + renderDetailInfoItem("事件时间", "time") + renderDetailInfoItem("事件地址", "point") + renderDetailInfoItem("事件类型", "type") + renderDetailInfoItem("事件推送", "push") + renderDetailInfoItem("输入方式", "mode") + '</section><section class="event-detail-map-card"><h4>事件位置</h4><div class="event-detail-map"><img data-event-detail="map" src="' + utils.escapeAttribute(DETAIL_MAP) + '" alt="事件位置地图" /></div><div class="event-detail-coords" data-event-detail-text="coords">--</div></section></aside></div></div></section>';
  }

  function renderDetailInfoItem(label, field) {
    return '<div class="event-detail-info-item"><div class="event-detail-info-label">' + utils.escapeHtml(label) + '</div><div class="event-detail-info-value" data-event-detail-text="' + utils.escapeAttribute(field) + '">--</div></div>';
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function setValue(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.value = value;
    }
  }

  function setChecked(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.checked = !!value;
    }
  }

  function setHtml(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.innerHTML = value;
    }
  }

  function setTextIn(root, field, value) {
    const node = root.querySelector("[data-event-detail-text='" + field + "']");
    if (node) {
      node.textContent = value || "--";
    }
  }

  function setImageIn(root, key, src, alt) {
    const node = root.querySelector("[data-event-detail='" + key + "']");
    if (node) {
      node.src = src || PLACEHOLDER;
      node.alt = alt || "";
    }
  }

  function toggleHidden(id, hidden) {
    const node = document.getElementById(id);
    if (node) {
      node.classList.toggle("hidden", !!hidden);
    }
  }

  function uniqueOptions(rows, field) {
    const lookup = Object.create(null);
    return (rows || []).map(function (row) { return row[field]; }).filter(function (value) {
      if (!value || lookup[value]) {
        return false;
      }
      lookup[value] = true;
      return true;
    });
  }

  function buildPaginationHtml(currentPage, totalPages) {
    const safeTotalPages = Math.max(totalPages, 1);
    const html = [];
    for (let index = 1; index <= Math.min(safeTotalPages, 5); index += 1) {
      html.push('<button class="pagination-button' + (index === currentPage ? ' active' : '') + '" type="button" data-page="' + index + '">' + index + '</button>');
    }
    html.push('<button class="pagination-button" type="button" data-page="' + Math.min(safeTotalPages, currentPage + 1) + '"' + (currentPage === safeTotalPages ? ' disabled' : '') + '>></button>');
    return html.join("");
  }

  function clampPage(pageNumber, totalPages) {
    const page = Number(pageNumber) || 1;
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }

  function clampGalleryIndex(index, length) {
    if (!length) {
      return 0;
    }
    const value = Number(index) || 0;
    return Math.min(Math.max(value, 0), length - 1);
  }
})();
