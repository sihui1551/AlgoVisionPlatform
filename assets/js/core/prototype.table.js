(function () {
  const utils = window.PROTOTYPE_UTILS;
  const shell = window.PROTOTYPE_SHELL;

  window.PROTOTYPE_TABLE = {
    bindTablePage: bindTablePage,
    renderTablePage: renderTablePage
  };

  function bindTablePage(page) {
    if (page && typeof page.renderTablePanel === "function") {
      return;
    }

    if (page.streamTaskPage || page.offlineTaskPage) {
      bindSourceTaskPage(page);
      return;
    }

    bindSimpleTablePage(page);
  }

  function renderTablePage(page) {
    if (page && typeof page.renderTablePanel === "function") {
      return page.renderTablePanel({
        page: page,
        shell: shell,
        utils: utils,
        renderTableFooter: renderTableFooter,
        renderRowAction: renderRowAction
      });
    }

    if (page.streamTaskPage || page.offlineTaskPage) {
      return renderSourceTaskTable(page);
    }

    return (
      '<section class="panel">' +
      shell.renderPanelHeader(null, page.tablePanel) +
      renderSimpleToolbar(page) +
      renderSimpleTable(page) +
      renderTableFooter(page) +
      "</section>"
    );
  }

  function bindSimpleTablePage(page) {
    const searchInput = document.getElementById(page.key + "-search");
    const selectFilters = getSelectFilters(page).map(function (filter) {
      return {
        config: filter,
        node: document.getElementById(page.key + "-filter-" + filter.key)
      };
    });
    const queryButton = document.getElementById(page.key + "-query");
    const resetButton = document.getElementById(page.key + "-reset");
    const tbody = document.getElementById(page.key + "-table-body");
    const countNode = document.getElementById(page.key + "-count");
    const paginationNode = document.getElementById(page.key + "-pagination");
    let currentPage = 1;

    function update() {
      const keyword = utils.normalize(searchInput ? searchInput.value : "");
      const pageSize = getPageSize(page);

      const rows = (page.table.rows || []).filter(function (row) {
        const keywordMatch =
          !keyword ||
          (page.filters.searchFields || []).some(function (field) {
            return utils.normalize(row[field]).includes(keyword);
          });
        const filterMatch = selectFilters.every(function (filterItem) {
          const value = filterItem.node ? filterItem.node.value : "";
          return !value || row[filterItem.config.field] === value;
        });
        return keywordMatch && filterMatch;
      });

      const totalPages = getTotalPages(rows.length, pageSize);
      currentPage = clampPage(currentPage, totalPages);
      const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      if (tbody) {
        tbody.innerHTML = pagedRows.length
          ? pagedRows.map(function (row) { return renderSimpleRow(page, row); }).join("")
          : renderEmptyRow(page);
      }

      updateFooter(page, countNode, paginationNode, rows.length, currentPage, totalPages);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        currentPage = 1;
        update();
      });
    }

    selectFilters.forEach(function (filterItem) {
      if (filterItem.node) {
        filterItem.node.addEventListener("change", function () {
          currentPage = 1;
          update();
        });
      }
    });

    if (queryButton) {
      queryButton.addEventListener("click", function () {
        currentPage = 1;
        update();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        if (searchInput) {
          searchInput.value = "";
        }

        selectFilters.forEach(function (filterItem) {
          if (filterItem.node) {
            filterItem.node.value = "";
          }
        });

        currentPage = 1;
        update();
      });
    }

    bindPagination(paginationNode, function (pageNumber) {
      currentPage = pageNumber;
      update();
    });

    update();
  }

  function bindSourceTaskPage(page) {
    const taskPage = getSourceTaskPage(page);
    const searchInput = taskPage && taskPage.filters && taskPage.filters.searchPlaceholder
      ? document.getElementById(page.key + "-search")
      : null;
    const filterNodes = getTaskPageFilterConfigs(page, taskPage).map(function (filter) {
      return {
        config: filter,
        node: document.getElementById(page.key + "-filter-" + filter.key)
      };
    });
    const queryButton = document.getElementById(page.key + "-query");
    const resetButton = document.getElementById(page.key + "-reset");
    const tbody = document.getElementById(page.key + "-table-body");
    const countNode = document.getElementById(page.key + "-count");
    const paginationNode = document.getElementById(page.key + "-pagination");
    let currentPage = 1;

    function update() {
      const keyword = utils.normalize(searchInput ? searchInput.value : "");
      const pageSize = getPageSize(page);
      const searchFields = ensureList((taskPage.filters && taskPage.filters.searchFields) || ["id", "name"]);

      const rows = (taskPage.rows || []).filter(function (row) {
        const keywordMatch =
          !keyword ||
          searchFields.some(function (field) {
            return utils.normalize(row[field]).includes(keyword);
          });
        const filterMatch = filterNodes.every(function (filterItem) {
          const value = filterItem.node ? filterItem.node.value : "";
          return !value || row[filterItem.config.field] === value;
        });
        return keywordMatch && filterMatch;
      });

      const totalPages = getTotalPages(rows.length, pageSize);
      currentPage = clampPage(currentPage, totalPages);
      const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      if (tbody) {
        tbody.innerHTML = pagedRows.length
          ? pagedRows.map(function (row) { return renderSourceTaskRow(page, row); }).join("")
          : renderEmptyRow(page);
      }

      updateFooter(page, countNode, paginationNode, rows.length, currentPage, totalPages);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        currentPage = 1;
        update();
      });
    }

    filterNodes.forEach(function (filterItem) {
      if (filterItem.node) {
        filterItem.node.addEventListener("change", function () {
          currentPage = 1;
          update();
        });
      }
    });

    if (queryButton) {
      queryButton.addEventListener("click", function () {
        currentPage = 1;
        update();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        if (searchInput) {
          searchInput.value = "";
        }
        filterNodes.forEach(function (filterItem) {
          if (filterItem.node) {
            filterItem.node.value = "";
          }
        });
        currentPage = 1;
        update();
      });
    }

    bindPagination(paginationNode, function (pageNumber) {
      currentPage = pageNumber;
      update();
    });

    update();
  }

  function renderSimpleToolbar(page) {
    const filters = getSelectFilters(page);
    return (
      '<div class="table-toolbar">' +
      '<div class="toolbar-group">' +
      renderSearchField(page) +
      filters.map(function (filter) {
        return renderSelectFilter(page, filter);
      }).join("") +
      renderFilterActionButtons(page) +
      "</div>" +
      '<div class="toolbar-group">' +
      (page.toolbarActions || []).map(function (button) {
        return shell.renderActionButton(button);
      }).join("") +
      "</div>" +
      "</div>"
    );
  }

  function renderSimpleTable(page) {
    return (
      '<div class="table-shell">' +
      "<table>" +
      "<thead><tr>" +
      (page.table.columns || []).map(function (column) {
        return "<th>" + utils.escapeHtml(column.label) + "</th>";
      }).join("") +
      "</tr></thead>" +
      '<tbody id="' + utils.escapeAttribute(page.key + "-table-body") + '"></tbody>' +
      "</table>" +
      "</div>"
    );
  }

  function renderSourceTaskTable(page) {
    const taskPage = getSourceTaskPage(page);
    const columns = taskPage.tableColumns || [];
    const filterMarkup = renderSourceTaskFilters(page, taskPage);
    const actionMarkup = renderSourceTaskToolbarActions(page, taskPage);
    const toolbarContent = taskPage.toolbarLayout === "actions-left"
      ? '<div class="toolbar-group">' + actionMarkup + '</div><div class="toolbar-group">' + filterMarkup + "</div>"
      : '<div class="toolbar-group">' + filterMarkup + '</div><div class="toolbar-group">' + actionMarkup + "</div>";

    return (
      '<section class="panel">' +
      shell.renderPanelHeader(null, page.tablePanel || { title: page.heading || "" }) +
      '<div class="table-toolbar">' +
      toolbarContent +
      "</div>" +
      '<div class="table-shell">' +
      "<table>" +
      "<thead><tr>" +
      columns.map(function (column) {
        return renderSourceTaskHeaderCell(column);
      }).join("") +
      "</tr></thead>" +
      '<tbody id="' + utils.escapeAttribute(page.key + "-table-body") + '"></tbody>' +
      "</table>" +
      "</div>" +
      renderTableFooter(page) +
      "</section>"
    );
  }

  function renderTableFooter(page) {
    return (
      '<div class="table-footer">' +
      '<div class="table-footer-count hint-text" id="' + utils.escapeAttribute(page.key + "-count") + '"></div>' +
      '<div class="table-footer-pagination" id="' + utils.escapeAttribute(page.key + "-pagination") + '"></div>' +
      "</div>"
    );
  }

  function renderSearchField(page) {
    if (!page.filters || !page.filters.searchPlaceholder) {
      return "";
    }

    return (
      '<input id="' + utils.escapeAttribute(page.key + "-search") + '" class="filter-field" type="search" placeholder="' +
      utils.escapeAttribute(page.filters.searchPlaceholder) + '" />'
    );
  }

  function renderSelectFilter(page, filter) {
    if (!filter.options || !filter.options.length) {
      return "";
    }

    return (
      '<select id="' + utils.escapeAttribute(page.key + "-filter-" + filter.key) + '" class="filter-field">' +
      filter.options.map(function (option) {
        return '<option value="' + utils.escapeAttribute(option.value) + '">' + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    );
  }

  function renderSourceTaskFilterField(label, controlMarkup, extraClassName) {
    if (!controlMarkup) {
      return "";
    }

    return (
      '<div class="table-filter-group' + (extraClassName ? " " + utils.escapeAttribute(extraClassName) : "") + '">' +
      (label ? '<span class="table-filter-label">' + utils.escapeHtml(label) + "</span>" : "") +
      controlMarkup +
      "</div>"
    );
  }

  function renderSourceTaskSelect(id, filter) {
    const options = filter && filter.options;
    if (!Array.isArray(options) || !options.length) {
      return "";
    }

    return renderSourceTaskFilterField(filter.label, (
      '<select id="' + utils.escapeAttribute(id) + '" class="filter-field">' +
      options.map(function (option) {
        return '<option value="' + utils.escapeAttribute(option.value) + '">' + utils.escapeHtml(option.label) + "</option>";
      }).join("") +
      "</select>"
    ));
  }

  function renderSourceTaskSearch(page, taskPage) {
    if (!(taskPage.filters && taskPage.filters.searchPlaceholder)) {
      return "";
    }

    return renderSourceTaskFilterField(
      taskPage.filters.searchLabel || "搜索",
      '<input id="' + utils.escapeAttribute(page.key + "-search") + '" class="filter-field" type="search" placeholder="' +
        utils.escapeAttribute(taskPage.filters.searchPlaceholder) + '" />',
      "table-filter-group-search"
    );
  }

  function renderSourceTaskFilters(page, taskPage) {
    let markup = "";
    const filterConfigs = getTaskPageFilterConfigs(page, taskPage);
    const searchMarkup = renderSourceTaskSearch(page, taskPage);

    if (taskPage.filters && taskPage.filters.searchFirst === false) {
      filterConfigs.forEach(function (filter) {
        markup += renderSourceTaskSelect(page.key + "-filter-" + filter.key, filter);
      });
      markup += searchMarkup;
    } else {
      markup += searchMarkup;
      filterConfigs.forEach(function (filter) {
        markup += renderSourceTaskSelect(page.key + "-filter-" + filter.key, filter);
      });
    }

    return markup + renderFilterActionButtons(page);
  }

  function renderSourceTaskToolbarActions(page, taskPage) {
    return (taskPage.toolbarActions || []).map(function (action) {
      return shell.renderActionButton(mapSourceTaskToolbarAction(page, action));
    }).join("");
  }

  function renderFilterActionButtons(page) {
    return (
      '<button id="' + utils.escapeAttribute(page.key + "-query") + '" class="button" type="button">查询</button>' +
      '<button id="' + utils.escapeAttribute(page.key + "-reset") + '" class="button-secondary" type="button">重置</button>'
    );
  }

  function mapSourceTaskToolbarAction(page, action) {
    const variant = action.variant || resolveSourceTaskToolbarVariant(action.action);

    if (action.action === "create") {
      return {
        label: action.label,
        variant: variant,
        route: resolveCreateRoute(page.key),
        toastTitle: action.label,
        toastMessage: "跳转到新建任务页面。"
      };
    }

    return {
      label: action.label,
      variant: variant,
      toastTitle: action.label,
      toastMessage: "当前原型仅保留 " + action.label + " 入口。"
    };
  }

  function renderSimpleRow(page, row) {
    return (
      "<tr>" +
      (page.table.columns || []).map(function (column) {
        if (column.type === "status") {
          return "<td>" + shell.renderStatusPill(row[column.toneField], row[column.labelField]) + "</td>";
        }

        if (column.type === "actions") {
          return '<td><div class="table-actions">' +
            (page.table.actions || []).map(function (action) {
              return renderRowAction(action, row);
            }).join("") +
            "</div></td>";
        }

        const value = row[column.key];
        return "<td>" + (column.strong ? "<strong>" + utils.escapeHtml(value) + "</strong>" : utils.escapeHtml(value)) + "</td>";
      }).join("") +
      "</tr>"
    );
  }

  function renderSourceTaskRow(page, row) {
    const taskPage = getSourceTaskPage(page);
    const columns = taskPage.tableColumns || [];

    return (
      "<tr>" +
      columns.map(function (column) {
        if (column.type === "select") {
          return '<td class="table-select-cell"><button class="table-row-checkbox" type="button" aria-label="' + utils.escapeAttribute(row.id || row.batchNo || "选择") + '"></button></td>';
        }

        if (column.type === "status") {
          return "<td>" + shell.renderStatusPill(row[column.toneField], row[column.labelField]) + "</td>";
        }

        if (column.key === "enabledLabel") {
          return "<td>" + shell.renderStatusPill(row.taskStatus === "disabled" ? "offline" : "success", row.enabledLabel) + "</td>";
        }

        if (column.key === "taskHealthLabel") {
          return "<td>" + shell.renderStatusPill(row.taskHealthTone, row.taskHealthLabel) + "</td>";
        }

        if (column.key === "serviceHealthLabel") {
          return "<td>" + shell.renderStatusPill(row.serviceHealthTone, row.serviceHealthLabel) + "</td>";
        }

        if (column.key === "actions") {
          return '<td><div class="table-actions">' + renderSourceTaskRowActions(page, row) + "</div></td>";
        }

        const cellValue = row[column.key];
        const displayValue = cellValue == null ? "--" : cellValue;
        return "<td>" + ((column.strong || column.key === "id") ? "<strong>" + utils.escapeHtml(displayValue) + "</strong>" : utils.escapeHtml(displayValue)) + "</td>";
      }).join("") +
      "</tr>"
    );
  }

  function renderSourceTaskRowActions(page, row) {
    const rowActions = ensureList(row && row.actionItems);
    const actions = rowActions.length ? rowActions : (getSourceTaskRowActions(page) || [{
      label: "详情",
      toastTitle: "详情",
      toastMessage: "当前为原型演示，详情入口后续可接入真实页面。"
    }]);

    return actions.map(function (action) {
      return renderRowAction(action, {
        taskId: row.id,
        taskName: row.name,
        id: row.id,
        name: row.name,
        batchNo: row.batchNo,
        taskNameLabel: row.taskName
      });
    }).join("");
  }

  function getSourceTaskRowActions(page) {
    if (page && page.key === "stream-analysis") {
      return [
        {
          label: "详情",
          className: "table-action-link",
          toastTitle: "详情",
          toastMessage: "当前为原型演示，详情入口后续可接入真实页面。"
        },
        {
          label: "禁用",
          className: "table-action-link",
          toastTitle: "禁用",
          toastMessage: "当前为原型演示，禁用动作后续可接入真实流转。"
        },
        {
          label: "删除",
          className: "table-action-link table-action-danger",
          toastTitle: "删除",
          toastMessage: "当前为原型演示，删除动作后续可接入真实流转。"
        }
      ];
    }

    if (page && page.key === "offline-analysis") {
      return ensureList(page.offlineTaskPage && page.offlineTaskPage.rowActions);
    }

    return (page.table && page.table.actions) || null;
  }

  function renderRowAction(action, row) {
    const title = action.toastTitle || action.label || "操作";
    const message = action.toastMessage || "当前操作仅用于原型演示。";
    const route = resolveActionRoute(action, row);

    return (
      '<button class="table-action' + (action.className ? " " + utils.escapeAttribute(action.className) : "") + '"' +
      (route ? ' data-route="' + utils.escapeAttribute(route) + '"' : "") +
      (!route ? ' data-toast-title="' + utils.escapeAttribute(title) + '"' : "") +
      (!route ? ' data-toast-message="' + utils.escapeAttribute(utils.applyTemplate(message, row)) + '"' : "") +
      ">" +
      utils.escapeHtml(action.label) +
      "</button>"
    );
  }

  function bindPagination(node, onChange) {
    if (!node) {
      return;
    }

    node.addEventListener("click", function (event) {
      const button = event.target.closest("[data-page]");
      if (!button || button.disabled) {
        return;
      }
      onChange(Number(button.getAttribute("data-page")) || 1);
    });
  }

  function updateFooter(page, countNode, paginationNode, totalCount, currentPage, totalPages) {
    if (countNode) {
      countNode.textContent = String(page.countTextPrefix || "") + totalCount + String(page.countTextUnit || "");
    }

    if (paginationNode) {
      paginationNode.innerHTML = buildPaginationHtml(currentPage, totalPages);
    }
  }

  function buildPaginationHtml(currentPage, totalPages) {
    const safeTotalPages = Math.max(totalPages, 1);
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(safeTotalPages, currentPage + 2);

    pages.push(
      '<button class="pagination-button" type="button" data-page="' + Math.max(1, currentPage - 1) + '"' +
      (currentPage === 1 ? " disabled" : "") +
      ">‹</button>"
    );

    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      pages.push(
        '<button class="pagination-button' + (pageNumber === currentPage ? " active" : "") + '" type="button" data-page="' + pageNumber + '">' +
        pageNumber +
        "</button>"
      );
    }

    pages.push(
      '<button class="pagination-button" type="button" data-page="' + Math.min(safeTotalPages, currentPage + 1) + '"' +
      (currentPage === safeTotalPages ? " disabled" : "") +
      ">›</button>"
    );

    return pages.join("");
  }

  function clampPage(currentPage, totalPages) {
    return Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  }

  function getTotalPages(totalCount, pageSize) {
    return Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));
  }

  function resolveActionRoute(action, row) {
    if (!action) {
      return "";
    }

    if (action.route) {
      return action.route;
    }

    if (action.routeTemplate) {
      return utils.applyTemplate(action.routeTemplate, row);
    }

    return "";
  }

  function resolveCreateRoute(pageKey) {
    if (pageKey === "stream-analysis") {
      return "stream-task-create";
    }
    if (pageKey === "offline-analysis") {
      return "offline-task-create";
    }
    return "";
  }

  function renderEmptyRow(page) {
    return '<tr><td colspan="' + getColumnCount(page) + '"><div class="empty-state">' + utils.escapeHtml(page.emptyText) + "</div></td></tr>";
  }

  function getColumnCount(page) {
    const taskPage = getSourceTaskPage(page);
    if (taskPage) {
      return (taskPage.tableColumns || []).length;
    }

    return (page.table.columns || []).length;
  }

  function getSelectFilters(page) {
    if (page && page.filters && Array.isArray(page.filters.selects) && page.filters.selects.length) {
      return page.filters.selects;
    }

    if (page && page.filters && Array.isArray(page.filters.statusOptions) && page.filters.statusOptions.length) {
      return [{
        key: "status",
        field: page.filters.statusField,
        options: page.filters.statusOptions
      }];
    }

    return [];
  }

  function getPageSize(page) {
    const taskPage = getSourceTaskPage(page);
    if (taskPage && taskPage.pageSize) {
      return taskPage.pageSize;
    }

    if (page && page.pagination && page.pagination.pageSize) {
      return page.pagination.pageSize;
    }

    if (page && page.algorithmPage && page.algorithmPage.pageSize) {
      return page.algorithmPage.pageSize;
    }

    return 5;
  }

  function getSourceTaskPage(page) {
    return page.streamTaskPage || page.offlineTaskPage || null;
  }

  function getTaskPageFilterConfigs(page, taskPage) {
    if (taskPage && taskPage.filters && Array.isArray(taskPage.filters.selects) && taskPage.filters.selects.length) {
      return taskPage.filters.selects.map(function (filter) {
        return {
          key: filter.key,
          field: filter.field,
          label: filter.label || resolveSourceTaskFilterLabel(page, filter.key),
          options: filter.options
        };
      });
    }

    const filters = [];
    if (taskPage && taskPage.filters && Array.isArray(taskPage.filters.taskStatusOptions) && taskPage.filters.taskStatusOptions.length) {
      filters.push({
        key: "task-status",
        field: "taskStatus",
        label: taskPage.filters.taskStatusLabel || "任务状态",
        options: taskPage.filters.taskStatusOptions
      });
    }
    if (taskPage && taskPage.filters && Array.isArray(taskPage.filters.healthStatusOptions) && taskPage.filters.healthStatusOptions.length) {
      filters.push({
        key: "health-status",
        field: "healthStatus",
        label: taskPage.filters.healthStatusLabel || "健康状态",
        options: taskPage.filters.healthStatusOptions
      });
    }
    return filters;
  }

  function resolveSourceTaskToolbarVariant(actionKey) {
    if (actionKey === "create") {
      return "button";
    }
    if (actionKey === "delete" || actionKey === "batch-delete") {
      return "button-danger";
    }
    return "button-secondary";
  }

  function resolveSourceTaskFilterLabel(page, filterKey) {
    const pageKey = page && page.key;
    const filterLabels = {
      "offline-analysis": {
        "execution-status": "执行状态",
        "material-type": "素材类型"
      },
      "local-video": {
        "file-type": "文件类型"
      }
    };

    return (filterLabels[pageKey] && filterLabels[pageKey][filterKey]) || "";
  }

  function renderSourceTaskHeaderCell(column) {
    if (column.type === "select") {
      return '<th class="table-select-cell"><button class="table-row-checkbox table-row-checkbox-head" type="button" aria-label="全选"></button></th>';
    }

    return "<th>" + utils.escapeHtml(column.label) + "</th>";
  }

  function ensureList(value) {
    return Array.isArray(value) ? value : [];
  }
})();
