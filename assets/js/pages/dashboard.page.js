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

  const RANGE_OPTIONS = [
    { key: "today", label: "今日" },
    { key: "month", label: "本月" },
    { key: "year", label: "本年" },
    { key: "custom", label: "自定日期范围" }
  ];

  const DEMO_NOW = new Date(2026, 3, 18, 15, 0, 0, 0);
  const DAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const CUMULATIVE_ALERTS = 4320;

  const DEFAULT_STATE = {
    rangeKey: "month",
    pickerOpen: false,
    customStart: "2026-03-01",
    customEnd: "2026-04-18"
  };

  window.registerPrototypePage({
    key: "dashboard",
    styleSource: "../assets/css/pages/dashboard.css",
    kind: "dashboard",
    heading: "仪表盘",
    subtitle: "查看视频设备、任务类别、接入方式和近期告警趋势。",
    productDoc: {
      title: "仪表盘需求说明",
      summary: "面向研发、设计、测试说明首页总览页的原型范围。",
      goal: "供平台运营人员快速查看设备、算法、任务类别、接入方式和告警趋势等全局概览信息。",
      modules: [
        "顶部 KPI 卡片用于展示设备数量、算法数量等核心总览指标。",
        "中部分类占比和接入方式区域用于表达任务分布和输入来源结构。",
        "告警统计区域结合时间范围切换展示近期告警趋势与汇总信息。"
      ],
      rules: [
        "仪表盘以概览和判断为主，不承载深入编辑或配置流程。",
        "时间范围切换需要驱动告警统计区域联动刷新。",
        "总览指标、分类占比和趋势图在原型阶段使用示意数据即可。"
      ],
      interactions: [
        "点击今日、本月、本年和自定义日期范围时，告警统计内容需要正确切换。",
        "自定义日期范围打开后，开始和结束时间输入需要保持联动。",
        "图表与统计区域刷新后，应保持数值和时间标签一致。"
      ]
    },
    renderDashboardPage: function () {
      return renderDashboardMarkup(DEFAULT_STATE);
    },
    setup: function (runtime) {
      const root = runtime && runtime.mountNode;
      const showToast = runtime && typeof runtime.showToast === "function"
        ? runtime.showToast
        : function () {};

      if (!root) {
        return null;
      }

      const state = {
        rangeKey: DEFAULT_STATE.rangeKey,
        pickerOpen: DEFAULT_STATE.pickerOpen,
        customStart: DEFAULT_STATE.customStart,
        customEnd: DEFAULT_STATE.customEnd
      };

      function renderAlertSection() {
        const host = root.querySelector("[data-dashboard-alert-panel]");
        if (!host) {
          return;
        }
        host.innerHTML = renderAlertPanel(state);
      }

      function validateCustomRange() {
        if (!state.customStart || !state.customEnd) {
          showToast("告警统计", "请选择完整的起止日期。");
          return false;
        }

        if (state.customStart > state.customEnd) {
          showToast("告警统计", "开始日期不能晚于结束日期。");
          return false;
        }

        return true;
      }

      function onClick(event) {
        const rangeButton = event.target.closest("[data-dashboard-range]");
        if (rangeButton) {
          event.preventDefault();
          state.rangeKey = rangeButton.getAttribute("data-dashboard-range") || "month";
          state.pickerOpen = state.rangeKey === "custom";
          renderAlertSection();
          return;
        }

        const dateTrigger = event.target.closest("[data-dashboard-date-trigger]");
        if (dateTrigger) {
          event.preventDefault();
          state.rangeKey = "custom";
          state.pickerOpen = !state.pickerOpen;
          renderAlertSection();
          return;
        }

        const applyButton = event.target.closest("[data-dashboard-custom-apply]");
        if (applyButton) {
          event.preventDefault();
          const startInput = root.querySelector("[data-dashboard-custom-start]");
          const endInput = root.querySelector("[data-dashboard-custom-end]");
          state.customStart = startInput && startInput.value ? startInput.value : state.customStart;
          state.customEnd = endInput && endInput.value ? endInput.value : state.customEnd;
          if (!validateCustomRange()) {
            return;
          }
          state.rangeKey = "custom";
          state.pickerOpen = false;
          renderAlertSection();
          showToast("告警统计", "已切换到自定日期范围视图。");
          return;
        }

        const cancelButton = event.target.closest("[data-dashboard-custom-cancel]");
        if (cancelButton) {
          event.preventDefault();
          state.pickerOpen = false;
          renderAlertSection();
        }
      }

      function onChange(event) {
        const startInput = event.target.closest("[data-dashboard-custom-start]");
        if (startInput) {
          state.customStart = startInput.value || state.customStart;
          return;
        }

        const endInput = event.target.closest("[data-dashboard-custom-end]");
        if (endInput) {
          state.customEnd = endInput.value || state.customEnd;
        }
      }

      root.addEventListener("click", onClick);
      root.addEventListener("change", onChange);

      renderAlertSection();

      return function cleanup() {
        root.removeEventListener("click", onClick);
        root.removeEventListener("change", onChange);
      };
    }
  });

  function renderDashboardMarkup(state) {
    return (
      '<section class="dashboard-top-grid">' +
      '<div class="dashboard-kpi-stack">' +
      KPI_CARDS.map(renderKpiCard).join("") +
      "</div>" +
      renderCategoryPanel() +
      renderAccessPanel() +
      "</section>" +
      '<div data-dashboard-alert-panel>' + renderAlertPanel(state) + "</div>"
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

  function renderAlertPanel(state) {
    const view = buildAlertView(state);
    const chart = buildChartShape(view.series.values, 1000, 260, 5);

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
      '<div class="dashboard-alert-number">' + esc(formatNumber(CUMULATIVE_ALERTS)) + "</div>" +
      '<div class="dashboard-alert-meta">全部历史累计，截止演示时间 ' + esc(formatDateTime(DEMO_NOW)) + "</div>" +
      "</div>" +
      '<div class="dashboard-alert-item dashboard-alert-item-active">' +
      '<div class="dashboard-alert-caption">' + esc(view.summaryCaption) + "</div>" +
      '<div class="dashboard-alert-number">' + esc(formatNumber(view.currentTotal)) + "</div>" +
      '<div class="dashboard-alert-trend-list">' +
      view.trends.map(renderTrendPill).join("") +
      "</div>" +
      '<div class="dashboard-alert-meta">' + esc(view.summaryMeta) + "</div>" +
      "</div>" +
      "</aside>" +
      '<div class="dashboard-alert-chart-wrap">' +
      '<div class="dashboard-alert-toolbar">' +
      '<div class="dashboard-alert-heading">' +
      '<h4 class="dashboard-alert-title">' + esc(view.chartTitle) + "</h4>" +
      '<div class="dashboard-alert-subtitle">' + esc(view.chartSubtitle) + "</div>" +
      "</div>" +
      '<div class="dashboard-alert-controls">' +
      '<div class="dashboard-range-group">' +
      RANGE_OPTIONS.map(function (option) {
        const active = option.key === state.rangeKey ? " active" : "";
        return (
          '<button class="dashboard-range' + active + '" type="button" data-dashboard-range="' + esc(option.key) + '">' +
          esc(option.label) +
          "</button>"
        );
      }).join("") +
      "</div>" +
      '<button class="dashboard-date-range' + (state.rangeKey === "custom" ? " active" : "") + '" type="button" data-dashboard-date-trigger="true">' +
      esc(view.rangeDisplay) +
      ' <span class="icon">📅</span></button>' +
      (state.pickerOpen ? renderCustomRangePopover(state) : "") +
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
      '<div class="dashboard-alert-tooltip" style="left:' + esc(String(chart.tooltipLeft)) + 'px;top:' + esc(String(chart.tooltipTop)) + 'px;">' +
      '<div class="dashboard-alert-tooltip-time">' + esc(view.tooltipTitle) + "</div>" +
      '<div class="dashboard-alert-tooltip-value"><span class="dot"></span>' + esc(formatNumber(view.tooltipValue)) + "</div>" +
      "</div>" +
      '<div class="dashboard-alert-y-axis">' +
      chart.tickLabels.map(function (label) {
        return "<span>" + esc(label) + "</span>";
      }).join("") +
      "</div>" +
      '<div class="dashboard-alert-x-axis">' +
      view.series.displayLabels.map(function (label) {
        return "<span>" + esc(label) + "</span>";
      }).join("") +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>"
    );
  }

  function renderCustomRangePopover(state) {
    return (
      '<div class="dashboard-custom-popover">' +
      '<div class="dashboard-custom-title">自定日期范围</div>' +
      '<div class="dashboard-custom-fields">' +
      '<label class="dashboard-custom-field">' +
      '<span>开始日期</span>' +
      '<input type="date" value="' + esc(state.customStart) + '" data-dashboard-custom-start="true" />' +
      "</label>" +
      '<label class="dashboard-custom-field">' +
      '<span>结束日期</span>' +
      '<input type="date" value="' + esc(state.customEnd) + '" data-dashboard-custom-end="true" />' +
      "</label>" +
      "</div>" +
      '<div class="dashboard-custom-hint">区间较短按天展示，区间较长自动切换为按周或按月。</div>' +
      '<div class="dashboard-custom-actions">' +
      '<button class="dashboard-custom-btn ghost" type="button" data-dashboard-custom-cancel="true">取消</button>' +
      '<button class="dashboard-custom-btn primary" type="button" data-dashboard-custom-apply="true">应用</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderTrendPill(trend) {
    const cls = trend.delta >= 0 ? "up" : "down";
    const arrow = trend.delta >= 0 ? "▲" : "▼";
    return (
      '<span class="dashboard-alert-trend ' + cls + '">' +
      esc(trend.label) +
      " " +
      arrow +
      " " +
      esc(formatPercent(Math.abs(trend.delta))) +
      "</span>"
    );
  }

  function buildAlertView(state) {
    const range = state.rangeKey === "custom"
      ? buildCustomRangeDefinition(state.customStart, state.customEnd)
      : buildPresetRangeDefinition(state.rangeKey);

    const series = buildSeries(range.start, range.end, range.granularity, range.seedKey);
    const currentTotal = sumValues(series.values);
    const trends = range.comparisons.map(function (comparison) {
      const compareSeries = buildSeries(comparison.start, comparison.end, range.granularity, range.seedKey + "-" + comparison.key);
      const currentBase = comparison.mode === "average" ? averageValues(series.values) : currentTotal;
      const compareBase = comparison.mode === "average" ? averageValues(compareSeries.values) : sumValues(compareSeries.values);
      return {
        label: comparison.label,
        delta: calculateDelta(currentBase, compareBase)
      };
    });

    return {
      chartTitle: range.chartTitle,
      chartSubtitle: range.chartSubtitle,
      summaryCaption: range.summaryCaption,
      summaryMeta: range.summaryMeta,
      rangeDisplay: range.rangeDisplay,
      currentTotal: currentTotal,
      trends: trends,
      series: series,
      tooltipTitle: series.fullLabels[series.fullLabels.length - 1] || "",
      tooltipValue: series.values[series.values.length - 1] || 0
    };
  }

  function buildPresetRangeDefinition(rangeKey) {
    if (rangeKey === "today") {
      const start = startOfDay(DEMO_NOW);
      const end = new Date(DEMO_NOW.getTime());
      return {
        seedKey: "today",
        start: start,
        end: end,
        granularity: "hour",
        summaryCaption: "今日告警数",
        summaryMeta: "对比口径：较昨日同时刻、较上周同日同时刻",
        chartTitle: "今日 0:00 至当前时刻告警趋势",
        chartSubtitle: "X 轴按小时展示，当前小时为进行中数据。",
        rangeDisplay: formatDateTime(start) + " ~ " + formatDateTime(end),
        comparisons: [
          {
            key: "prev-day",
            label: "较昨日同时刻",
            start: addDays(start, -1),
            end: addDays(end, -1)
          },
          {
            key: "prev-weekday",
            label: "较上周同日同时刻",
            start: addDays(start, -7),
            end: addDays(end, -7)
          }
        ]
      };
    }

    if (rangeKey === "year") {
      const start = new Date(DEMO_NOW.getFullYear(), 0, 1, 0, 0, 0, 0);
      const end = new Date(DEMO_NOW.getTime());
      return {
        seedKey: "year",
        start: start,
        end: end,
        granularity: "month",
        summaryCaption: "本年告警数",
        summaryMeta: "统计 1 月至当前月份，当前月为截至当前日期的累计值。",
        chartTitle: "本年 1 月至当前月份告警趋势",
        chartSubtitle: "X 轴按月展示，帮助观察年度累计走势。",
        rangeDisplay: formatMonth(start) + " ~ " + formatMonth(end),
        comparisons: [
          {
            key: "prev-year",
            label: "较去年同期",
            start: addYears(start, -1),
            end: addYears(end, -1)
          },
          {
            key: "prev-year-avg",
            label: "月均较去年同期",
            mode: "average",
            start: addYears(start, -1),
            end: addYears(end, -1)
          }
        ]
      };
    }

    const monthStart = new Date(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth(), 1, 0, 0, 0, 0);
    const monthEnd = new Date(DEMO_NOW.getTime());
    const previousMonthStart = new Date(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth() - 1, 1, 0, 0, 0, 0);
    const previousMonthEnd = shiftMonthKeepingTime(monthEnd, -1);
    const lastYearMonthStart = addYears(monthStart, -1);
    const lastYearMonthEnd = addYears(monthEnd, -1);

    return {
      seedKey: "month",
      start: monthStart,
      end: monthEnd,
      granularity: "day",
      summaryCaption: "本月告警数",
      summaryMeta: "统计本月 1 日至今日，按日查看波动趋势。",
      chartTitle: "本月 1 日至今日告警趋势",
      chartSubtitle: "X 轴按天展示，对比口径使用上月同期和去年同月同期。",
      rangeDisplay: formatDate(monthStart) + " ~ " + formatDate(monthEnd),
      comparisons: [
        {
          key: "prev-month",
          label: "较上月同期",
          start: previousMonthStart,
          end: previousMonthEnd
        },
        {
          key: "prev-year-month",
          label: "较去年同月同期",
          start: lastYearMonthStart,
          end: lastYearMonthEnd
        }
      ]
    };
  }

  function buildCustomRangeDefinition(startValue, endValue) {
    const start = parseDateInput(startValue, false) || new Date(2026, 2, 1, 0, 0, 0, 0);
    const end = parseDateInput(endValue, true) || new Date(2026, 3, 18, 23, 59, 59, 999);
    const dayCount = inclusiveDayDiff(start, end);
    let granularity = "day";

    if (dayCount > 180) {
      granularity = "month";
    } else if (dayCount > 31) {
      granularity = "week";
    }

    const shiftDays = dayCount;

    return {
      seedKey: "custom",
      start: start,
      end: end,
      granularity: granularity,
      summaryCaption: "所选时段告警数",
      summaryMeta: "对比口径：较上一等长周期、较去年同期。",
      chartTitle: "自定义时段告警趋势",
      chartSubtitle: "X 轴按区间长度自动适配，当前为按" + (granularity === "day" ? "天" : granularity === "week" ? "周" : "月") + "展示。",
      rangeDisplay: formatDate(start) + " ~ " + formatDate(end),
      comparisons: [
        {
          key: "prev-period",
          label: "较上一等长周期",
          start: addDays(start, -shiftDays),
          end: addDays(end, -shiftDays)
        },
        {
          key: "prev-year",
          label: "较去年同期",
          start: addYears(start, -1),
          end: addYears(end, -1)
        }
      ]
    };
  }

  function buildSeries(start, end, granularity, seedKey) {
    const buckets = granularity === "hour"
      ? buildHourlyBuckets(start, end)
      : granularity === "week"
        ? buildWeeklyBuckets(start, end)
        : granularity === "month"
          ? buildMonthlyBuckets(start, end)
          : buildDailyBuckets(start, end);

    const values = buckets.map(function (bucket, index) {
      return generateBucketValue(bucket, index, granularity, seedKey);
    });

    return {
      values: values,
      displayLabels: compressLabels(buckets.map(function (bucket) {
        return bucket.axisLabel;
      })),
      fullLabels: buckets.map(function (bucket) {
        return bucket.tooltipLabel;
      })
    };
  }

  function buildHourlyBuckets(start, end) {
    const buckets = [];
    const endHour = end.getHours();
    for (let hour = 0; hour <= endHour; hour += 1) {
      const bucketDate = new Date(start.getFullYear(), start.getMonth(), start.getDate(), hour, 0, 0, 0);
      buckets.push({
        time: bucketDate,
        axisLabel: pad(hour) + ":00",
        tooltipLabel: formatDate(bucketDate) + " " + pad(hour) + ":00"
      });
    }
    return buckets;
  }

  function buildDailyBuckets(start, end) {
    const buckets = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
    const limit = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0, 0);

    while (cursor.getTime() <= limit.getTime()) {
      buckets.push({
        time: new Date(cursor.getTime()),
        axisLabel: formatMonthDay(cursor),
        tooltipLabel: formatDate(cursor) + " " + DAY_NAMES[cursor.getDay()]
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return buckets;
  }

  function buildWeeklyBuckets(start, end) {
    const buckets = [];
    let cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
    const limit = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0, 0);

    while (cursor.getTime() <= limit.getTime()) {
      const bucketStart = new Date(cursor.getTime());
      const bucketEnd = new Date(cursor.getTime());
      bucketEnd.setDate(bucketEnd.getDate() + 6);
      if (bucketEnd.getTime() > limit.getTime()) {
        bucketEnd.setTime(limit.getTime());
      }

      buckets.push({
        time: bucketStart,
        axisLabel: formatMonthDay(bucketStart) + "~" + formatMonthDay(bucketEnd),
        tooltipLabel: formatDate(bucketStart) + " ~ " + formatDate(bucketEnd)
      });

      cursor.setDate(cursor.getDate() + 7);
    }

    return buckets;
  }

  function buildMonthlyBuckets(start, end) {
    const buckets = [];
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1, 0, 0, 0, 0);
    const limit = new Date(end.getFullYear(), end.getMonth(), 1, 0, 0, 0, 0);

    while (cursor.getTime() <= limit.getTime()) {
      buckets.push({
        time: new Date(cursor.getTime()),
        axisLabel: MONTH_LABELS[cursor.getMonth()],
        tooltipLabel: cursor.getFullYear() + "年" + MONTH_LABELS[cursor.getMonth()]
      });
      cursor.setMonth(cursor.getMonth() + 1, 1);
    }

    return buckets;
  }

  function generateBucketValue(bucket, index, granularity, seedKey) {
    const time = bucket.time.getTime();
    const seed = hashSeed(seedKey);
    const waveA = Math.sin((index + 1) * 0.72 + seed * 0.17);
    const waveB = Math.cos((time / 86400000) * 0.41 + seed * 0.11);
    const waveC = Math.sin((bucket.time.getMonth() + 1) * 1.2 + (bucket.time.getDate() || 1) * 0.18);

    let value = 0;
    if (granularity === "hour") {
      value = 10 + (index * 1.5) + waveA * 7 + waveB * 5 + waveC * 4;
      if (index >= 8 && index <= 10) {
        value += 10;
      }
      if (index >= 13 && index <= 15) {
        value += 16;
      }
    } else if (granularity === "month") {
      value = 280 + index * 56 + waveA * 40 + waveB * 36 + waveC * 22;
    } else if (granularity === "week") {
      value = 120 + index * 18 + waveA * 26 + waveB * 18 + waveC * 10;
    } else {
      value = 22 + (index % 6) * 4 + waveA * 8 + waveB * 6 + waveC * 5;
      if (bucket.time.getDay && (bucket.time.getDay() === 1 || bucket.time.getDay() === 4)) {
        value += 12;
      }
    }

    return Math.max(6, Math.round(value));
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

  function buildChartShape(values, width, height, tickCount) {
    const safeValues = values && values.length ? values.slice() : [0];
    const maxValue = niceCeil(Math.max.apply(null, safeValues));
    const bottom = height;
    const chartHeight = height - 24;

    const coords = safeValues.map(function (value, index) {
      const x = safeValues.length === 1 ? width / 2 : (index / (safeValues.length - 1)) * width;
      const y = bottom - (value / maxValue) * chartHeight;
      return { x: x, y: y };
    });

    const linePath = coords.map(function (point, index) {
      return (index === 0 ? "M" : "L") + point.x.toFixed(2) + " " + point.y.toFixed(2);
    }).join(" ");
    const areaPath = linePath + " L " + width + " " + bottom + " L 0 " + bottom + " Z";
    const focusPoint = coords[coords.length - 1];

    const gridLines = Array.from({ length: tickCount }, function (_, index) {
      const ratio = index / Math.max(tickCount - 1, 1);
      const y = (bottom - ratio * chartHeight).toFixed(2);
      return '<line class="dashboard-alert-grid" x1="0" y1="' + y + '" x2="' + width + '" y2="' + y + '"></line>';
    }).join("");

    const tickLabels = Array.from({ length: tickCount }, function (_, index) {
      const ratio = (tickCount - 1 - index) / Math.max(tickCount - 1, 1);
      return formatNumber(Math.round(maxValue * ratio));
    });

    return {
      linePath: linePath,
      areaPath: areaPath,
      focusX: focusPoint.x.toFixed(2),
      focusY: focusPoint.y.toFixed(2),
      tooltipLeft: Math.min(Math.max(focusPoint.x + 14, 12), width - 180).toFixed(2),
      tooltipTop: Math.max(focusPoint.y - 12, 14).toFixed(2),
      gridLines: gridLines,
      tickLabels: tickLabels
    };
  }

  function compressLabels(labels) {
    const count = labels.length;
    if (count <= 8) {
      return labels;
    }

    const step = Math.ceil(count / 8);
    return labels.map(function (label, index) {
      return (index % step === 0 || index === count - 1) ? label : "";
    });
  }

  function calculateDelta(current, previous) {
    if (!previous) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }

  function sumValues(values) {
    return values.reduce(function (total, value) {
      return total + Number(value || 0);
    }, 0);
  }

  function averageValues(values) {
    if (!values.length) {
      return 0;
    }
    return sumValues(values) / values.length;
  }

  function niceCeil(value) {
    const safe = Math.max(10, Number(value || 0));
    const magnitude = Math.pow(10, Math.floor(Math.log(safe) / Math.LN10));
    const normalized = safe / magnitude;
    let nice = 10;

    if (normalized <= 1) {
      nice = 1;
    } else if (normalized <= 2) {
      nice = 2;
    } else if (normalized <= 5) {
      nice = 5;
    }

    return nice * magnitude;
  }

  function parseDateInput(value, endOfDay) {
    if (!value) {
      return null;
    }

    const parts = String(value).split("-");
    if (parts.length !== 3) {
      return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    if (!year || month < 0 || day < 1) {
      return null;
    }

    return endOfDay
      ? new Date(year, month, day, 23, 59, 59, 999)
      : new Date(year, month, day, 0, 0, 0, 0);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  function addDays(date, amount) {
    const next = new Date(date.getTime());
    next.setDate(next.getDate() + amount);
    return next;
  }

  function addYears(date, amount) {
    const next = new Date(date.getTime());
    next.setFullYear(next.getFullYear() + amount);
    return next;
  }

  function shiftMonthKeepingTime(date, amount) {
    const next = new Date(date.getTime());
    const day = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + amount);
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(day, lastDay));
    return next;
  }

  function inclusiveDayDiff(start, end) {
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0, 0);
    return Math.floor((endDay.getTime() - startDay.getTime()) / 86400000) + 1;
  }

  function hashSeed(value) {
    return String(value || "").split("").reduce(function (total, ch) {
      return total + ch.charCodeAt(0);
    }, 0);
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString("zh-CN");
  }

  function formatPercent(value) {
    return (Math.round(value * 10) / 10).toFixed(value >= 100 ? 0 : 1).replace(/\.0$/, "") + "%";
  }

  function formatDate(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function formatMonth(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1);
  }

  function formatMonthDay(date) {
    return pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function formatDateTime(date) {
    return formatDate(date) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
  }

  function pad(value) {
    return value < 10 ? "0" + String(value) : String(value);
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
