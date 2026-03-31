(function () {
  const KPI_CARDS = [
    {
      key: "video-device",
      label: "视频设备数量",
      value: "1,234",
      leftLabel: "在线",
      leftValue: "1000",
      rightLabel: "离线",
      rightValue: "234"
    },
    {
      key: "algorithm",
      label: "算法数量",
      value: "66",
      leftLabel: "正常",
      leftValue: "50",
      rightLabel: "禁用",
      rightValue: "16"
    }
  ];

  const CATEGORY_ITEMS = [
    { label: "占道经营", percent: 36, count: "4,544", color: "#2f8dea" },
    { label: "路面积水", percent: 20, count: "4,544", color: "#42be69" },
    { label: "人群聚集", percent: 16, count: "4,544", color: "#f0c630" },
    { label: "沿街晾晒", percent: 10, count: "4,544", color: "#ef4b72" },
    { label: "水面垃圾", percent: 9, count: "4,544", color: "#8055d6" },
    { label: "其他", percent: 9, count: "4,544", color: "#23a7b4" }
  ];

  const ACCESS_ITEMS = [
    { title: "SDK", subtitle: "抓图", percent: 28, color: "#4a9cf0" },
    { title: "API", subtitle: "", percent: 22, color: "#69c88d" },
    { title: "消息", subtitle: "队列", percent: 22, color: "#f0cb49" }
  ];

  const ALERT_POINTS = [29, 16, 39, 57, 27, 24, 12];
  const ALERT_X_LABELS = ["11-23周日", "11-24周一", "11-25周二", "11-26周三", "11-27周四", "11-28周五", "11-29周六"];

  window.registerPrototypePage({
    key: "dashboard",
    styleSource: "../assets/css/pages/dashboard.css",
    kind: "dashboard",
    heading: "仪表盘",
    subtitle: "查看视频设备、任务类别、接入方式和近期告警趋势。",
    renderDashboardPage: function () {
      return renderDashboardMarkup();
    },
    setup: function (runtime) {
      const root = runtime && runtime.mountNode;
      const showToast = runtime && typeof runtime.showToast === "function"
        ? runtime.showToast
        : function () {};

      if (!root) {
        return null;
      }

      function onClick(event) {
        const rangeButton = event.target.closest("[data-dashboard-range]");
        if (!rangeButton) {
          return;
        }

        event.preventDefault();
        const value = rangeButton.getAttribute("data-dashboard-range") || "";
        const group = root.querySelectorAll("[data-dashboard-range]");
        Array.prototype.forEach.call(group, function (node) {
          node.classList.toggle("active", node === rangeButton);
        });

        showToast("告警统计", "已切换到“" + value + "”视图（原型演示）。");
      }

      root.addEventListener("click", onClick);

      return function cleanup() {
        root.removeEventListener("click", onClick);
      };
    }
  });

  function renderDashboardMarkup() {
    return (
      '<section class="dashboard-top-grid">' +
      '<div class="dashboard-kpi-stack">' +
      KPI_CARDS.map(renderKpiCard).join("") +
      "</div>" +
      renderCategoryPanel() +
      renderAccessPanel() +
      "</section>" +
      renderAlertPanel()
    );
  }

  function renderKpiCard(card) {
    return (
      '<article class="panel dashboard-panel dashboard-kpi-card">' +
      '<div class="dashboard-kpi-main">' +
      '<span class="dashboard-kpi-icon" aria-hidden="true">▣</span>' +
      '<div class="dashboard-kpi-info">' +
      '<div class="dashboard-kpi-label">' + esc(card.label) + '<span class="dashboard-kpi-hint">i</span></div>' +
      '<div class="dashboard-kpi-value">' + esc(card.value) + "</div>" +
      "</div>" +
      "</div>" +
      '<div class="dashboard-kpi-footer">' +
      '<span class="dashboard-kpi-status"><i class="dot dot-green"></i>' + esc(card.leftLabel) + '<strong>' + esc(card.leftValue) + "</strong></span>" +
      '<span class="dashboard-kpi-status"><i class="dot dot-gray"></i>' + esc(card.rightLabel) + '<strong>' + esc(card.rightValue) + "</strong></span>" +
      "</div>" +
      "</article>"
    );
  }

  function renderCategoryPanel() {
    const gradient = buildCategoryGradient(CATEGORY_ITEMS);

    return (
      '<section class="panel dashboard-panel dashboard-category-panel">' +
      '<header class="dashboard-panel-header">' +
      '<h3 class="dashboard-panel-title">分析任务类别占比</h3>' +
      '<button class="dashboard-panel-more" type="button">•••</button>' +
      "</header>" +
      '<div class="dashboard-category-body">' +
      '<div class="dashboard-category-ring" style="background:' + esc(gradient) + '">' +
      '<div class="dashboard-category-ring-inner">' +
      '<div class="dashboard-category-ring-label">任务数</div>' +
      '<div class="dashboard-category-ring-value">1,224</div>' +
      "</div>" +
      "</div>" +
      '<ul class="dashboard-category-legend">' +
      CATEGORY_ITEMS.map(function (item) {
        return (
          '<li class="dashboard-category-legend-item">' +
          '<span class="legend-left"><i class="legend-dot" style="background:' + esc(item.color) + '"></i>' + esc(item.label) + "</span>" +
          '<span class="legend-mid">' + esc(String(item.percent) + "%") + "</span>" +
          '<span class="legend-right">' + esc(item.count) + "</span>" +
          "</li>"
        );
      }).join("") +
      "</ul>" +
      "</div>" +
      "</section>"
    );
  }

  function renderAccessPanel() {
    return (
      '<section class="panel dashboard-panel dashboard-access-panel">' +
      '<header class="dashboard-panel-header">' +
      '<h3 class="dashboard-panel-title">接入方式</h3>' +
      "</header>" +
      '<div class="dashboard-access-layout">' +
      ACCESS_ITEMS.map(function (item, index) {
        return renderAccessRing(item, index);
      }).join("") +
      "</div>" +
      "</section>"
    );
  }

  function renderAccessRing(item, index) {
    const tone = esc(item.color);
    const percent = Math.max(0, Math.min(100, item.percent));
    const cls = "dashboard-access-item item-" + String(index + 1);

    return (
      '<div class="' + cls + '">' +
      '<div class="dashboard-access-ring" style="--progress:' + esc(String(percent)) + ';--tone:' + tone + ';">' +
      '<div class="dashboard-access-ring-inner">' +
      '<div class="dashboard-access-title">' + esc(item.title) + "</div>" +
      (item.subtitle ? '<div class="dashboard-access-subtitle">' + esc(item.subtitle) + "</div>" : "") +
      '<div class="dashboard-access-value">' + esc(String(percent) + "%") + "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderAlertPanel() {
    const chart = buildChartShape(ALERT_POINTS, 1000, 260, 5);

    return (
      '<section class="panel dashboard-panel dashboard-alert-panel">' +
      '<header class="dashboard-panel-header">' +
      '<h3 class="dashboard-panel-title">告警统计</h3>' +
      '<button class="dashboard-panel-more" type="button">•••</button>' +
      "</header>" +
      '<div class="dashboard-alert-body">' +
      '<aside class="dashboard-alert-summary">' +
      '<div class="dashboard-alert-item">' +
      '<div class="dashboard-alert-caption">累计告警数</div>' +
      '<div class="dashboard-alert-number">4320 <span class="dashboard-alert-trend up">周同比 ▲ 12%</span></div>' +
      "</div>" +
      '<div class="dashboard-alert-item">' +
      '<div class="dashboard-alert-caption">本周告警数</div>' +
      '<div class="dashboard-alert-number">342 <span class="dashboard-alert-trend down">周环比 ▼ 10%</span></div>' +
      "</div>" +
      "</aside>" +
      '<div class="dashboard-alert-chart-wrap">' +
      '<div class="dashboard-alert-toolbar">' +
      '<h4 class="dashboard-alert-title">近一周告警数量</h4>' +
      '<div class="dashboard-alert-controls">' +
      '<div class="dashboard-range-group">' +
      '<button class="dashboard-range" type="button" data-dashboard-range="今日">今日</button>' +
      '<button class="dashboard-range" type="button" data-dashboard-range="本周">本周</button>' +
      '<button class="dashboard-range" type="button" data-dashboard-range="本月">本月</button>' +
      '<button class="dashboard-range active" type="button" data-dashboard-range="全年">全年</button>' +
      "</div>" +
      '<button class="dashboard-date-range" type="button">2025-11-23 ~ 2025-11-29 <span class="icon">📅</span></button>' +
      "</div>" +
      "</div>" +
      '<div class="dashboard-alert-chart">' +
      '<svg class="dashboard-alert-svg" viewBox="0 0 1000 260" aria-hidden="true">' +
      chart.gridLines +
      '<path class="dashboard-alert-area" d="' + esc(chart.areaPath) + '"></path>' +
      '<path class="dashboard-alert-line" d="' + esc(chart.linePath) + '"></path>' +
      '<line class="dashboard-alert-focus-line" x1="' + esc(chart.focusX) + '" y1="0" x2="' + esc(chart.focusX) + '" y2="260"></line>' +
      '<circle class="dashboard-alert-focus-dot" cx="' + esc(chart.focusX) + '" cy="' + esc(chart.focusY) + '" r="6"></circle>' +
      "</svg>" +
      '<div class="dashboard-alert-tooltip" style="left:' + esc(String(chart.focusX + 14)) + 'px;top:' + esc(String(Math.max(chart.focusY - 12, 14))) + 'px;">' +
      '<div class="dashboard-alert-tooltip-time">2025-11-26 11:40</div>' +
      '<div class="dashboard-alert-tooltip-value"><span class="dot"></span>57</div>' +
      "</div>" +
      '<div class="dashboard-alert-y-axis">' +
      '<span>60</span><span>45</span><span>30</span><span>15</span><span>0</span>' +
      "</div>" +
      '<div class="dashboard-alert-x-axis">' +
      ALERT_X_LABELS.map(function (label) {
        return '<span>' + esc(label) + "</span>";
      }).join("") +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>"
    );
  }

  function buildCategoryGradient(items) {
    let cursor = 0;
    const parts = items.map(function (item) {
      const next = cursor + Number(item.percent || 0);
      const segment = item.color + " " + cursor + "% " + next + "%";
      cursor = next;
      return segment;
    });
    return "conic-gradient(" + parts.join(",") + ")";
  }

  function buildChartShape(points, width, height, gridCount) {
    const values = points.slice();
    const max = Math.max.apply(null, values);
    const min = Math.min.apply(null, values);
    const range = Math.max(max - min, 1);
    const bottom = height;
    const chartHeight = height - 24;
    const coords = values.map(function (value, index) {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * width;
      const y = bottom - ((value - min) / range) * chartHeight;
      return { x: x, y: y, value: value };
    });

    const linePath = coords.map(function (point, index) {
      return (index === 0 ? "M" : "L") + point.x.toFixed(2) + " " + point.y.toFixed(2);
    }).join(" ");
    const areaPath = linePath + " L " + width + " " + bottom + " L 0 " + bottom + " Z";

    const focusIndex = values.indexOf(max);
    const focusPoint = coords[focusIndex < 0 ? 0 : focusIndex];

    const gridLines = Array.from({ length: gridCount }, function (_, index) {
      const ratio = index / Math.max(gridCount - 1, 1);
      const y = (bottom - ratio * chartHeight).toFixed(2);
      return '<line class="dashboard-alert-grid" x1="0" y1="' + y + '" x2="1000" y2="' + y + '"></line>';
    }).join("");

    return {
      linePath: linePath,
      areaPath: areaPath,
      focusX: focusPoint.x.toFixed(2),
      focusY: focusPoint.y.toFixed(2),
      gridLines: gridLines
    };
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
