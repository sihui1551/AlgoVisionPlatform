const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const sourceConfigPath = process.env.CFG;
const sourcePagesPath = process.env.PAGES;
const targetRoot = "D:/CodeSpace/Prototype/AlgoVisionPlatform";

if (!sourceConfigPath || !sourcePagesPath) {
  throw new Error("Missing CFG or PAGES environment variables.");
}

const sandbox = { window: {}, console, Object, Array, String, Number, Boolean, Math, Date, JSON };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(sourceConfigPath, "utf8"), sandbox);
vm.runInContext(fs.readFileSync(sourcePagesPath, "utf8"), sandbox);
const sourceConfig = sandbox.window.PROTOTYPE_CONFIG;
const sourcePages = sourceConfig.pages;

const pageMeta = {
  dashboard: { pageName: "仪表盘", heading: "仪表盘", file: "仪表盘.html" },
  "schedule-center": { pageName: "调度中心", heading: "调度中心", file: "调度中心.html" },
  "source-ingest": { pageName: "视图源接入", heading: "视图源接入", file: "视图源接入.html" },
  "gb-device": { pageName: "国标设备", heading: "国标设备", file: "国标设备.html" },
  algorithms: { pageName: "算法管理", heading: "算法管理", file: "算法管理.html" },
  "stream-analysis": { pageName: "视频流分析", heading: "视频流分析", file: "视频流分析.html" },
  "stream-task-create": { pageName: "视频流新建任务", heading: "视频流新建任务", file: "视频流新建任务.html" },
  "image-analysis": { pageName: "图片分析", heading: "图片分析", file: "图片分析.html" },
  "image-task-create": { pageName: "图片新建任务", heading: "图片新建任务", file: "图片新建任务.html" },
  "offline-analysis": { pageName: "离线视图分析", heading: "离线视图分析", file: "离线视图分析.html" },
  "offline-task-create": { pageName: "离线新建任务", heading: "离线新建任务", file: "离线新建任务.html" },
  "offline-task-detail": { pageName: "离线任务详情", heading: "离线任务详情", file: "离线任务详情.html" },
  "event-list": { pageName: "事件列表", heading: "事件列表", file: "事件列表.html" },
  "event-detail": { pageName: "事件详情", heading: "事件详情", file: "事件详情.html" },
  rules: { pageName: "规格管理", heading: "规格管理", file: "规格管理.html" },
  "platform-config": { pageName: "平台配置", heading: "平台配置", file: "平台配置.html" }
};

const navGroups = [
  { key: "home-group", label: "首页", icon: "首", children: ["dashboard", "schedule-center"] },
  { key: "access-group", label: "接入管理", icon: "接", children: ["source-ingest", "gb-device"] },
  { key: "algorithm-group", label: "算法仓库", icon: "算", children: ["algorithms"] },
  {
    key: "task-group",
    label: "任务管理",
    icon: "任",
    children: ["stream-analysis", "image-analysis", "offline-analysis"]
  },
  { key: "event-group", label: "事件中心", icon: "事", children: ["event-list", "event-detail"] },
  { key: "system-group", label: "系统管理", icon: "系", children: ["rules", "platform-config"] }
];

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function md5(input) {
  return crypto.createHash("md5").update(String(input)).digest("hex");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath, content, withBom = true) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, (withBom ? "\uFEFF" : "") + content, "utf8");
}

function resolveHeading(key, page) {
  return pageMeta[key] && pageMeta[key].heading ? pageMeta[key].heading : (page.heading || key);
}

function normalizeTopbarActions(page, options = {}) {
  const heading = options.heading || resolveHeading(page.key, page);
  const docTitle = page.productDoc && page.productDoc.title ? page.productDoc.title : heading + "说明";
  const docMessage = page.productDoc && page.productDoc.summary ? page.productDoc.summary : (page.subtitle || "当前页面用于原型演示。");
  const actions = [{ label: options.docLabel || "页面说明", variant: "button-secondary", toastTitle: docTitle, toastMessage: docMessage }];
  const sourcePrimary = (page.topbarActions || []).find(action => action && action.label && !/需求说明/.test(action.label));
  const primaryLabel = options.primaryLabel || (sourcePrimary && sourcePrimary.label) || "";
  if (primaryLabel) {
    actions.push({
      label: primaryLabel,
      variant: (sourcePrimary && sourcePrimary.variant) || options.primaryVariant || "button",
      toastTitle: (sourcePrimary && sourcePrimary.toastTitle) || options.primaryTitle || primaryLabel,
      toastMessage: (sourcePrimary && sourcePrimary.toastMessage) || options.primaryMessage || (primaryLabel + " 仅提供原型演示入口。")
    });
  }
  return actions;
}

function normalizeToolbarActions(actions, fallbackTitle) {
  return (actions || []).map(action => ({
    label: action.label || "操作",
    variant: action.variant || "button-secondary",
    toastTitle: action.toastTitle || action.label || fallbackTitle || "操作",
    toastMessage: action.toastMessage || ((action.label || "当前操作") + " 仅提供原型演示入口。")
  }));
}

function normalizeRowActions(actions) {
  return (actions || []).map(action => ({
    label: action.label || "详情",
    toastTitle: action.toastTitle || action.label || "详情",
    toastMessage: action.toastMessage || ((action.label || "当前操作") + " 仅提供原型演示入口。")
  }));
}

function statusToneFromLabel(label) {
  if (/在线|运行|完成|启用|已推送/.test(label)) return "success";
  if (/离线|失败|不可用/.test(label)) return "offline";
  if (/告警|待|排队|禁用|暂停/.test(label)) return "warning";
  return "idle";
}

function buildAssistItemsFromDoc(doc, extraItems) {
  const items = [];
  if (doc && Array.isArray(doc.rules)) doc.rules.slice(0, 2).forEach((value, index) => items.push({ label: "规则" + (index + 1), value }));
  if (doc && Array.isArray(doc.interactions)) doc.interactions.slice(0, 1).forEach((value, index) => items.push({ label: "交互" + (index + 1), value }));
  if (doc && Array.isArray(doc.pending)) doc.pending.slice(0, 1).forEach((value, index) => items.push({ label: "待确认" + (index + 1), value }));
  (extraItems || []).forEach(item => items.push(item));
  return items.slice(0, 4);
}

function buildSummaryCardsFromStatusRows(rows, unitLabel) {
  const total = rows.length;
  const online = rows.filter(row => ["online", "running", "success"].includes(row.statusTone)).length;
  const offline = rows.filter(row => ["offline", "failed"].includes(row.statusTone)).length;
  const warning = rows.filter(row => ["warning", "pending", "maintenance"].includes(row.statusTone)).length;
  return [
    { label: "总数", value: String(total), footnote: "当前" + unitLabel + "总量", tone: "primary" },
    { label: "正常", value: String(online), footnote: "状态正常", tone: "success" },
    { label: "关注", value: String(warning), footnote: "待处理或告警", tone: "warning" },
    { label: "异常", value: String(offline), footnote: "离线或不可用", tone: "critical" }
  ];
}

function makePreviewRows(items, mapper, limit = 5) {
  return (items || []).slice(0, limit).map(mapper);
}

function transformOverview(page) {
  const metrics = [];
  const tones = ["primary", "mint", "warning", "violet"];
  const icons = ["设", "算", "警", "周"];
  (page.overviewCards || []).slice(0, 2).forEach((card, index) => {
    metrics.push({
      label: card.label,
      value: String(card.value),
      footnote: (card.breakdown || []).map(item => item.label + " " + item.value).join(" / "),
      tone: tones[index],
      icon: icons[index]
    });
  });
  ((page.alertPanel && page.alertPanel.summary) || []).slice(0, 2).forEach((item, index) => {
    metrics.push({
      label: item.label,
      value: String(item.value),
      footnote: (item.trendLabel || "") + " " + (item.trendValue || ""),
      tone: tones[index + 2],
      icon: icons[index + 2]
    });
  });

  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "dashboard",
    heading: resolveHeading(page.key, page),
    subtitle: page.subtitle,
    topbarActions: normalizeTopbarActions(page, { primaryLabel: "查看调度概况", primaryTitle: "调度概况", primaryMessage: "当前按钮用于演示首页分析入口。" }),
    productDoc: page.productDoc,
    metrics,
    highlightsPanel: {
      title: page.taskCategoryPanel.title,
      subtitle: "按任务类型查看当前任务占比。",
      items: (page.taskCategoryPanel.items || []).map(item => ({ label: item.label, value: item.percentage + "%" }))
    },
    chartPanel: {
      title: page.alertPanel.title,
      subtitle: page.alertPanel.seriesTitle + " · " + page.alertPanel.dateRange,
      legend: page.alertPanel.seriesTitle,
      yAxis: page.alertPanel.yAxis,
      points: (page.alertPanel.points || []).map(point => point.value)
    },
    previewTablePanel: {
      title: "接入方式概览",
      subtitle: "展示不同接入来源的占比与说明。",
      columns: [
        { key: "name", label: "接入方式", strong: true },
        { key: "share", label: "占比" },
        { key: "note", label: "说明" }
      ],
      rows: makePreviewRows(page.accessPanel.items, item => ({ name: item.label, share: item.percentage + "%", note: "用于接入分析任务" }), 6)
    }
  };
}

function transformSourceIngest(page) {
  const rows = (page.devices || []).map(device => ({
    name: device.name,
    deviceType: device.deviceType || device.scene || "",
    groupLabel: device.groupLabel || "",
    statusTone: device.statusTone || statusToneFromLabel(device.statusLabel || ""),
    statusLabel: device.statusLabel || "",
    accessTime: device.accessTime || "",
    address: device.address || "",
    sourceType: device.sourceType || ""
  }));

  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "table",
    heading: resolveHeading(page.key, page),
    subtitle: page.subtitle,
    topbarActions: normalizeTopbarActions(page, { primaryLabel: "新增设备", primaryTitle: "新增设备", primaryMessage: "当前页面保留设备新增入口和接入演示。" }),
    productDoc: page.productDoc,
    summaryCards: buildSummaryCardsFromStatusRows(rows, "设备"),
    tablePanel: {
      title: "接入设备列表",
      subtitle: "按分组、状态和关键字查看接入设备台账。"
    },
    filters: {
      searchPlaceholder: "搜索设备名称 / 分组 / 地址 / 来源",
      searchFields: ["name", "groupLabel", "address", "sourceType"],
      statusField: "statusTone",
      statusOptions: (page.filters && page.filters.statusOptions) || [
        { value: "", label: "全部状态" },
        { value: "online", label: "在线" },
        { value: "offline", label: "离线" },
        { value: "unavailable", label: "不可用" }
      ]
    },
    toolbarActions: normalizeToolbarActions(page.toolbarActions, "设备操作"),
    countTextPrefix: "共 ",
    countTextUnit: " 台设备",
    emptyText: "当前筛选条件下没有接入设备",
    table: {
      columns: [
        { key: "name", label: "设备名称", strong: true },
        { key: "deviceType", label: "设备类型" },
        { key: "groupLabel", label: "所属分组" },
        { key: "statusLabel", label: "状态", type: "status", toneField: "statusTone", labelField: "statusLabel" },
        { key: "accessTime", label: "接入时间" },
        { key: "address", label: "设备地址" },
        { key: "actions", label: "操作", type: "actions" }
      ],
      actions: normalizeRowActions([
        { label: "详情", toastTitle: "设备详情", toastMessage: "当前仅展示设备详情入口，后续可接入弹窗或详情页。" },
        { label: "同步", toastTitle: "同步状态", toastMessage: "当前为原型演示，同步动作后续接入真实流程。" }
      ]),
      rows
    }
  };
}

function transformGbDevice(page) {
  const rows = (page.deviceList || []).map(device => ({
    name: device.name,
    gbCode: device.gbCode,
    deviceTypeLabel: device.deviceTypeLabel,
    channelCount: String(device.channelCount),
    statusTone: device.status,
    statusLabel: device.statusLabel,
    lastHeartbeat: device.lastHeartbeat,
    address: device.address
  }));

  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "table",
    heading: resolveHeading(page.key, page),
    subtitle: page.subtitle,
    topbarActions: normalizeTopbarActions(page, { primaryLabel: "新增设备" }),
    productDoc: page.productDoc,
    summaryCards: buildSummaryCardsFromStatusRows(rows, "国标设备"),
    tablePanel: {
      title: "国标设备台账",
      subtitle: "查看设备基础信息、通道数量与接入状态。"
    },
    filters: {
      searchPlaceholder: "搜索设备名称 / 国标编码 / 地址",
      searchFields: ["name", "gbCode", "address"],
      statusField: "statusTone",
      statusOptions: [
        { value: "", label: "全部状态" },
        { value: "online", label: "在线" },
        { value: "offline", label: "离线" },
        { value: "unavailable", label: "不可用" }
      ]
    },
    toolbarActions: normalizeToolbarActions([{ label: "导出台账", variant: "button-secondary", toastTitle: "导出台账", toastMessage: "当前原型不生成文件，导出动作仅用于演示。" }], "设备台账"),
    countTextPrefix: "共 ",
    countTextUnit: " 台国标设备",
    emptyText: "当前筛选条件下没有国标设备",
    table: {
      columns: [
        { key: "name", label: "设备名称", strong: true },
        { key: "gbCode", label: "国标编码" },
        { key: "deviceTypeLabel", label: "设备类型" },
        { key: "channelCount", label: "通道数" },
        { key: "statusLabel", label: "状态", type: "status", toneField: "statusTone", labelField: "statusLabel" },
        { key: "lastHeartbeat", label: "最后心跳" },
        { key: "address", label: "设备地址" },
        { key: "actions", label: "操作", type: "actions" }
      ],
      actions: normalizeRowActions([
        { label: "详情", toastTitle: "设备详情", toastMessage: "当前为原型演示，详情入口后续可接入详情页。" },
        { label: "通道", toastTitle: "通道管理", toastMessage: "当前为原型演示，通道管理入口后续补齐。" }
      ]),
      rows
    }
  };
}

function transformExistingTable(page, keyOverride) {
  const next = clone(page);
  next.key = keyOverride || page.key;
  next.kind = "table";
  next.heading = resolveHeading(next.key, next);
  next.styleSource = "resources/css/pages/" + next.key + ".css";
  next.topbarActions = normalizeTopbarActions(next);
  next.toolbarActions = normalizeToolbarActions(next.toolbarActions, next.heading);
  next.table.actions = normalizeRowActions(next.table.actions);
  next.summaryCards = Array.isArray(next.summaryCards) ? next.summaryCards : [];
  return next;
}

function transformEventList(page) {
  const streamRows = (page.streamData || []).map(item => ({
    eventType: item.type,
    sourceMode: "视频流",
    point: item.point,
    analysisTask: item.analysisTask,
    address: item.address,
    time: item.time,
    statusTone: statusToneFromLabel(item.pushStatus),
    statusLabel: item.pushStatus
  }));
  const imageRows = (page.imageData || []).map(item => ({
    eventType: item.type,
    sourceMode: item.inputMethod || "图片",
    point: item.point,
    analysisTask: item.analysisTask,
    address: item.address,
    time: item.time,
    statusTone: statusToneFromLabel(item.pushStatus),
    statusLabel: item.pushStatus
  }));
  const rows = streamRows.concat(imageRows);
  const pending = rows.filter(row => row.statusLabel !== "已推送").length;

  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "table",
    heading: resolveHeading(page.key, page),
    subtitle: "集中查看视频流和图片分析产生的事件。",
    topbarActions: normalizeTopbarActions(page, { primaryLabel: "新建任务" }),
    productDoc: page.productDoc,
    summaryCards: [
      { label: "事件总数", value: String(rows.length), footnote: "视频流与图片合计", tone: "primary" },
      { label: "视频流事件", value: String(streamRows.length), footnote: "实时流分析结果", tone: "success" },
      { label: "图片事件", value: String(imageRows.length), footnote: "图片分析结果", tone: "warning" },
      { label: "待推送", value: String(pending), footnote: "需关注下游处理", tone: "critical" }
    ],
    tablePanel: {
      title: "事件列表",
      subtitle: "按事件类型、点位、任务和推送状态查看业务事件。"
    },
    filters: {
      searchPlaceholder: "搜索事件类型 / 点位 / 分析任务 / 地址",
      searchFields: ["eventType", "point", "analysisTask", "address", "sourceMode"],
      statusField: "statusTone",
      statusOptions: [
        { value: "", label: "全部状态" },
        { value: "success", label: "已推送" },
        { value: "warning", label: "待推送" }
      ]
    },
    toolbarActions: normalizeToolbarActions([{ label: "导出事件", variant: "button-secondary", toastTitle: "导出事件", toastMessage: "当前原型不生成文件，导出动作仅用于演示。" }], "事件操作"),
    countTextPrefix: "共 ",
    countTextUnit: " 条事件",
    emptyText: "当前筛选条件下没有事件数据",
    table: {
      columns: [
        { key: "eventType", label: "事件类型", strong: true },
        { key: "sourceMode", label: "来源模式" },
        { key: "point", label: "事件点位" },
        { key: "analysisTask", label: "分析任务" },
        { key: "time", label: "事件时间" },
        { key: "statusLabel", label: "推送状态", type: "status", toneField: "statusTone", labelField: "statusLabel" },
        { key: "actions", label: "操作", type: "actions" }
      ],
      actions: normalizeRowActions([
        { label: "详情", toastTitle: "事件详情", toastMessage: "当前为原型演示，事件详情入口后续可接入详情页。" },
        { label: "导出", toastTitle: "导出事件", toastMessage: "当前原型不生成文件，导出动作仅用于演示。" }
      ]),
      rows
    }
  };
}

function transformEventDetail(page, eventListPage) {
  const event = clone((eventListPage.streamData || [])[0] || {});
  const relatedRows = makePreviewRows(eventListPage.streamData, item => ({
    eventType: item.type,
    point: item.point,
    time: item.time,
    statusTone: statusToneFromLabel(item.pushStatus),
    statusLabel: item.pushStatus
  }), 4);
  const totalEvents = (eventListPage.streamData || []).length + (eventListPage.imageData || []).length;
  const pushed = relatedRows.filter(item => item.statusLabel === "已推送").length;
  const pending = relatedRows.length - pushed;
  const pointCount = new Set((eventListPage.streamData || []).map(item => item.point)).size;

  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "dashboard",
    heading: resolveHeading(page.key, page),
    subtitle: "用于查看单条事件的业务上下文和相关记录。",
    topbarActions: [
      { label: "返回事件列表", variant: "button-secondary", toastTitle: "返回事件列表", toastMessage: "当前为原型演示，返回动作后续可接入列表页。" },
      { label: "导出事件", variant: "button", toastTitle: "导出事件", toastMessage: "当前原型不生成文件，导出动作仅用于演示。" }
    ],
    metrics: [
      { label: "关联事件", value: String(totalEvents), footnote: "当前点位事件总量", tone: "primary", icon: "事" },
      { label: "已推送", value: String(pushed), footnote: "已推送到下游系统", tone: "mint", icon: "推" },
      { label: "待推送", value: String(pending), footnote: "待后续处理", tone: "peach", icon: "待" },
      { label: "关联点位", value: String(pointCount), footnote: "当前业务点位数", tone: "violet", icon: "点" }
    ],
    formPanel: {
      title: "事件信息",
      subtitle: "展示事件基础字段和业务来源。",
      sections: [
        {
          title: "基础信息",
          fields: [
            { label: "事件类型", value: event.type || "安全告警" },
            { label: "事件点位", value: event.point || "北门" },
            { label: "分析任务", value: event.analysisTask || "入侵检测" },
            { label: "事件时间", value: event.time || "2025-11-18 09:12:05" }
          ]
        },
        {
          title: "推送上下文",
          fields: [
            { label: "推送状态", value: event.pushStatus || "已推送" },
            { label: "地址编码", value: event.address || "AD0008-北门" },
            { label: "来源模式", value: "视频流分析" },
            { label: "处置建议", value: "建议结合点位视频和任务配置复核当前事件。" }
          ]
        }
      ]
    },
    assistPanel: {
      title: "处置说明",
      subtitle: "用于承载事件排查建议和处理提示。",
      items: [
        { label: "处理建议", value: "先核验点位状态，再确认是否需要下发人工复核。" },
        { label: "数据来源", value: "当前事件来自算法分析结果，后续可联动推送链路。" },
        { label: "关联页面", value: "事件中心 / 事件列表" },
        { label: "扩展方向", value: "后续可补充原图预览、处理记录和推送日志。" }
      ]
    },
    previewTablePanel: {
      title: "相关事件",
      subtitle: "保留同类事件的最近记录，方便横向对比。",
      columns: [
        { key: "eventType", label: "事件类型", strong: true },
        { key: "point", label: "点位" },
        { key: "time", label: "事件时间" },
        { key: "statusLabel", label: "推送状态", type: "status", toneField: "statusTone", labelField: "statusLabel" }
      ],
      rows: relatedRows
    }
  };
}

function transformRules(page) {
  const rows = (page.specList || []).map(item => ({
    specId: item.id,
    name: item.name,
    vcpu: String(item.vcpu),
    memory: String(item.memory) + " GB",
    gpu: item.gpu,
    gpuVram: item.gpuVram,
    disk: String(item.disk) + " GB",
    createdAt: item.createdAt,
    statusTone: item.disabled ? "warning" : "success",
    statusLabel: item.disabled ? "已禁用" : "已启用"
  }));
  const enabled = rows.filter(row => row.statusLabel === "已启用").length;
  const disabled = rows.length - enabled;
  const gpuKinds = new Set(rows.map(row => row.gpu)).size;

  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "table",
    heading: resolveHeading(page.key, page),
    subtitle: page.subtitle,
    topbarActions: normalizeTopbarActions(page, { primaryLabel: "新建规格", primaryTitle: "新建规格", primaryMessage: "当前页面保留实例规格新增入口。" }),
    productDoc: page.productDoc,
    summaryCards: [
      { label: "规格总数", value: String(rows.length), footnote: "当前实例规格数量", tone: "primary" },
      { label: "已启用", value: String(enabled), footnote: "可用于调度分配", tone: "success" },
      { label: "已禁用", value: String(disabled), footnote: "待复核或下线", tone: "warning" },
      { label: "GPU 类型", value: String(gpuKinds), footnote: "覆盖不同算力类型", tone: "critical" }
    ],
    tablePanel: {
      title: "规格列表",
      subtitle: "统一维护算力规格、资源参数和启停状态。"
    },
    filters: {
      searchPlaceholder: "搜索规格 ID / 名称 / GPU 类型",
      searchFields: ["specId", "name", "gpu"],
      statusField: "statusTone",
      statusOptions: [
        { value: "", label: "全部状态" },
        { value: "success", label: "已启用" },
        { value: "warning", label: "已禁用" }
      ]
    },
    toolbarActions: normalizeToolbarActions([{ label: "导出规格", variant: "button-secondary", toastTitle: "导出规格", toastMessage: "当前原型不生成文件，导出动作仅用于演示。" }], "规格操作"),
    countTextPrefix: "共 ",
    countTextUnit: " 条规格",
    emptyText: "当前筛选条件下没有规格数据",
    table: {
      columns: [
        { key: "name", label: "规格名称", strong: true },
        { key: "specId", label: "规格 ID" },
        { key: "vcpu", label: "vCPU" },
        { key: "memory", label: "内存" },
        { key: "gpu", label: "GPU" },
        { key: "gpuVram", label: "显存" },
        { key: "statusLabel", label: "状态", type: "status", toneField: "statusTone", labelField: "statusLabel" },
        { key: "actions", label: "操作", type: "actions" }
      ],
      actions: normalizeRowActions([
        { label: "详情", toastTitle: "规格详情", toastMessage: "当前为原型演示，详情入口后续可补充。" },
        { label: "禁用", toastTitle: "规格状态", toastMessage: "当前为原型演示，状态切换动作后续补齐。" }
      ]),
      rows
    }
  };
}

function transformSchedule(page) {
  const next = clone(page);
  next.heading = resolveHeading(page.key, page);
  next.styleSource = "resources/css/pages/" + page.key + ".css";
  next.topbarActions = normalizeTopbarActions(page, { primaryLabel: "查看排队任务", primaryTitle: "查看排队任务", primaryMessage: "当前按钮用于演示调度中心入口。" });
  return next;
}

function transformPlatformConfig(page) {
  const next = clone(page);
  next.heading = resolveHeading(page.key, page);
  next.styleSource = "resources/css/pages/" + page.key + ".css";
  next.topbarActions = normalizeTopbarActions(page, { primaryLabel: "保存配置", primaryTitle: "保存配置", primaryMessage: "当前为原型演示，配置保存后续接入真实流程。" });
  next.assistPanel = next.assistPanel || { title: "配置说明", subtitle: "", items: buildAssistItemsFromDoc(next.productDoc) };
  return next;
}

function taskBuilderMetrics(builder, modeLabel) {
  const nodeCount = (builder.nodePools || []).length;
  return [
    { label: "可选算法", value: String((builder.algorithms || []).length), footnote: modeLabel + "任务可绑定算法", tone: "primary", icon: "算" },
    { label: "资源规格", value: String((builder.resourceSpecs || []).length), footnote: "可选资源规格数量", tone: "violet", icon: "规" },
    { label: "调度节点", value: String(nodeCount), footnote: "服务与边缘节点总量", tone: "mint", icon: "池" },
    { label: "告警地址", value: String((builder.alarmRecipients || []).length), footnote: "可配置推送地址池", tone: "peach", icon: "告" }
  ];
}

function transformTaskCreate(page, mode) {
  const builder = page.taskBuilder || {};
  const serviceNodes = (builder.nodePools || []).filter(node => node.group === "service").length;
  const edgeNodes = (builder.nodePools || []).filter(node => node.group === "edge").length;
  const heading = resolveHeading(page.key, page);
  const modeLabel = mode === "stream" ? "视频流" : mode === "image" ? "图片" : "离线";
  const inputSummary = mode === "stream"
    ? "分析点位 " + (builder.streams || []).length + " 个"
    : mode === "image"
      ? "输入方式 " + (((builder.inputModeOptions || []).map(item => item.label).join(" / ")) || "SDK抓图")
      : "素材类型 " + (((builder.mediaTypeOptions || []).map(item => item.label).join(" / ")) || "视频 / 图片");

  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "dashboard",
    heading,
    subtitle: page.subtitle,
    topbarActions: [
      { label: "页面说明", variant: "button-secondary", toastTitle: page.productDoc.title, toastMessage: page.productDoc.summary },
      { label: "提交任务", variant: "button", toastTitle: "提交任务", toastMessage: heading + " 当前仅保留原型提交入口。" }
    ],
    productDoc: page.productDoc,
    metrics: taskBuilderMetrics(builder, modeLabel),
    previewTablePanel: {
      title: "默认算法组合",
      subtitle: "展示当前页面推荐的算法版本和默认执行周期。",
      columns: [
        { key: "name", label: "算法名称", strong: true },
        { key: "version", label: "默认版本" },
        { key: "interval", label: "执行周期" },
        { key: "sourceType", label: "适用类型" }
      ],
      rows: makePreviewRows(builder.algorithms, item => ({
        name: item.label,
        version: item.defaultVersion,
        interval: item.defaultInterval + (item.defaultUnit || ""),
        sourceType: item.sourceType || modeLabel
      }), 6)
    },
    formPanel: {
      title: "任务配置概览",
      subtitle: "把新建任务的关键配置按当前框架可渲染的表单块展示。",
      sections: [
        {
          title: "基础策略",
          fields: [
            { label: "任务类型", value: modeLabel + "任务" },
            { label: "默认有效期", value: (builder.defaultStartDate || "-") + " 至 " + (builder.defaultEndDate || "-") },
            { label: "默认优先级", value: builder.defaultPriority || "-" },
            { label: "返回列表", value: pageMeta[builder.listPageKey] ? pageMeta[builder.listPageKey].heading : (builder.listPageKey || "-") }
          ]
        },
        {
          title: "输入与接入",
          fields: [
            { label: "接入摘要", value: inputSummary },
            { label: "周期单位", value: (builder.intervalUnits || []).map(item => item.label).join(" / ") || "-" },
            { label: "调度计划", value: (builder.schedulePlans || []).map(item => item.label).join(" / ") || "未配置" },
            { label: "规格选择", value: builder.showSpecSelector ? "启用" : "关闭" }
          ]
        },
        {
          title: "资源池配置",
          fields: [
            { label: "服务节点", value: String(serviceNodes) },
            { label: "边缘节点", value: String(edgeNodes) },
            { label: "资源规格", value: String((builder.resourceSpecs || []).length) },
            { label: "告警地址池", value: String((builder.alarmRecipients || []).length) }
          ]
        }
      ]
    },
    assistPanel: {
      title: "业务说明",
      subtitle: "保留规则、交互和待确认事项。",
      items: buildAssistItemsFromDoc(page.productDoc, [{ label: "默认计划", value: (builder.schedulePlans || []).map(item => item.label).join(" / ") || "未配置" }])
    }
  };
}

function transformOfflineTaskDetail(page, offlineAnalysisPage) {
  const sample = clone((offlineAnalysisPage.table && offlineAnalysisPage.table.rows && offlineAnalysisPage.table.rows[0]) || {});
  return {
    key: page.key,
    styleSource: "resources/css/pages/" + page.key + ".css",
    kind: "dashboard",
    heading: resolveHeading(page.key, page),
    subtitle: page.subtitle,
    topbarActions: [
      { label: "页面说明", variant: "button-secondary", toastTitle: page.productDoc.title, toastMessage: page.productDoc.summary },
      { label: "返回列表", variant: "button", toastTitle: "返回列表", toastMessage: "当前为原型演示，返回动作后续可接入列表页。" }
    ],
    productDoc: page.productDoc,
    formPanel: {
      title: "任务概览",
      subtitle: "展示离线任务的基础信息和执行上下文。",
      sections: [
        {
          title: "基础信息",
          fields: [
            { label: "任务编号", value: sample.taskId || "OFF-20260313-001" },
            { label: "提交时间", value: sample.createdAt || "2026-03-13 14:20:00" },
            { label: "执行状态", value: sample.statusLabel || "排队中" },
            { label: "负责人", value: sample.owner || "ops.lin" }
          ]
        },
        {
          title: "分析配置",
          fields: [
            { label: "素材来源", value: sample.source || "历史监控归档包 A" },
            { label: "算法链路", value: sample.algorithm || "轨迹回放 + 检测回补" },
            { label: "执行窗口", value: sample.window || "23:00-02:00" },
            { label: "关联列表", value: pageMeta["offline-analysis"].heading }
          ]
        }
      ]
    },
    assistPanel: {
      title: "处理提示",
      subtitle: "汇总任务详情页的规则和异常处理边界。",
      items: buildAssistItemsFromDoc(page.productDoc)
    },
    previewTablePanel: {
      title: "相关任务",
      subtitle: "保留同类离线任务样例，便于横向对比。",
      columns: [
        { key: "taskId", label: "任务编号", strong: true },
        { key: "owner", label: "负责人" },
        { key: "statusLabel", label: "状态", type: "status", toneField: "statusTone", labelField: "statusLabel" }
      ],
      rows: makePreviewRows(offlineAnalysisPage.table.rows, row => ({ taskId: row.taskId, owner: row.owner, statusTone: row.statusTone, statusLabel: row.statusLabel }), 4)
    }
  };
}

const transformedPages = {
  dashboard: transformOverview(sourcePages.dashboard),
  "schedule-center": transformSchedule(sourcePages["schedule-center"]),
  "source-ingest": transformSourceIngest(sourcePages["source-ingest"]),
  "gb-device": transformGbDevice(sourcePages["gb-device"]),
  algorithms: transformExistingTable(sourcePages.algorithms),
  "stream-analysis": transformExistingTable(sourcePages["stream-analysis"]),
  "stream-task-create": transformTaskCreate(sourcePages["stream-task-create"], "stream"),
  "image-analysis": transformExistingTable(sourcePages["image-analysis"]),
  "image-task-create": transformTaskCreate(sourcePages["image-task-create"], "image"),
  "offline-analysis": transformExistingTable(sourcePages["offline-analysis"]),
  "offline-task-create": transformTaskCreate(sourcePages["offline-task-create"], "offline"),
  "offline-task-detail": transformOfflineTaskDetail(sourcePages["offline-task-detail"], sourcePages["offline-analysis"]),
  "event-list": transformEventList(sourcePages["event-list"]),
  "event-detail": transformEventDetail(sourcePages["event-detail"], sourcePages["event-list"]),
  rules: transformRules(sourcePages.rules),
  "platform-config": transformPlatformConfig(sourcePages["platform-config"])
};

function buildPrototypeConfig() {
  return {
    app: {
      eyebrow: "演示框架",
      brandMark: "AI",
      name: "AI视频算法调度平台",
      subtitle: "多模型视频生产与调度原型",
      navSectionTitle: "",
      footerItems: ["当前用户：Admin", "演示环境：Mock 数据"]
    },
    mockStore: {
      enabled: true,
      driver: "localStorage",
      namespace: "axure-prototype",
      project: "ai-video-scheduling-platform",
      version: "2026-03-22-stream-toolbar-v4",
      seedOnFirstLoad: true
    },
    defaultPage: "dashboard",
    navigation: navGroups.map(group => ({ key: group.key, label: group.label, icon: group.icon, children: group.children.map(key => ({ key, label: pageMeta[key].heading })) })),
    pageRegistry: Object.keys(pageMeta).reduce((acc, key) => {
      acc[key] = { key, file: pageMeta[key].file, source: "resources/scripts/pages/" + key + ".page.js" };
      return acc;
    }, {})
  };
}

function buildDocumentStyle() {
  return {
    defaultStyle: {
      id: "627587b6038d43cca051c114ac41ad32",
      fontName: "\"Arial Normal\", \"Arial\", sans-serif",
      fontWeight: "400",
      fontStyle: "normal",
      fontStretch: "5",
      foreGroundFill: { fillType: "solid", color: 4281545523, opacity: 1 },
      fontSize: "13px",
      underline: false,
      horizontalAlignment: "center",
      lineSpacing: "normal",
      characterSpacing: "normal",
      letterCase: "none",
      strikethrough: false,
      location: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      buttonSize: "12",
      visible: true,
      limbo: false,
      baseStyle: "627587b6038d43cca051c114ac41ad32",
      fill: { fillType: "solid", color: 4294967295 },
      borderFill: { fillType: "solid", color: 4286151033 },
      borderWidth: "1",
      linePattern: "solid",
      linePatternArray: [0],
      opacity: "1",
      cornerRadius: "0",
      borderVisibility: "top right bottom left",
      cornerVisibility: "top right bottom left",
      verticalAlignment: "middle",
      paddingLeft: "2",
      paddingTop: "2",
      paddingRight: "2",
      paddingBottom: "2",
      stateStyles: {},
      image: null,
      imageFilter: null,
      rotation: "0",
      outerShadow: { on: false, offsetX: 5, offsetY: 5, blurRadius: 5, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.34901960784313724 } },
      innerShadow: { on: false, offsetX: 0, offsetY: 5, blurRadius: 5, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.34901960784313724 } },
      textShadow: { on: false, offsetX: 1, offsetY: 1, blurRadius: 5, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.6470588235294118 } },
      widgetBlur: { on: false, radius: 4 },
      backdropBlur: { on: false, radius: 4 },
      viewOverride: "19e82109f102476f933582835c373474",
      transition: { easing: 0, duration: 0, css: "none" },
      transform: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, rotate: 0 },
      transformOrigin: { x: 50, y: 50 }
    },
    customStyles: {
      "_一级标题": { id: "1111111151944dfba49f67fd55eb1f88", fontSize: "32px", fontWeight: "700", borderWidth: "0", fill: { fillType: "solid", color: 4294967295 }, horizontalAlignment: "left", verticalAlignment: "top", paddingLeft: "0", paddingTop: "0", paddingRight: "0", paddingBottom: "0" },
      "_二级标题": { id: "b3a15c9ddde04520be40f94c8168891e", fontSize: "24px", fontWeight: "700", borderWidth: "0", fill: { fillType: "solid", color: 4294967295 }, horizontalAlignment: "left", verticalAlignment: "top", paddingLeft: "0", paddingTop: "0", paddingRight: "0", paddingBottom: "0" },
      "_三级标题": { id: "8c7a4c5ad69a4369a5f7788171ac0b32", fontSize: "18px", fontWeight: "700", borderWidth: "0", fill: { fillType: "solid", color: 4294967295 }, horizontalAlignment: "left", verticalAlignment: "top", paddingLeft: "0", paddingTop: "0", paddingRight: "0", paddingBottom: "0" },
      "_四级标题": { id: "e995c891077945c89c0b5fe110d15a0b", fontSize: "14px", fontWeight: "700", borderWidth: "0", fill: { fillType: "solid", color: 4294967295 }, horizontalAlignment: "left", verticalAlignment: "top", paddingLeft: "0", paddingTop: "0", paddingRight: "0", paddingBottom: "0" },
      "_五级标题": { id: "386b19ef4be143bd9b6c392ded969f89", fontWeight: "700", borderWidth: "0", fill: { fillType: "solid", color: 4294967295 }, horizontalAlignment: "left", verticalAlignment: "top", paddingLeft: "0", paddingTop: "0", paddingRight: "0", paddingBottom: "0" },
      "_六级标题": { id: "fc3b9a13b5574fa098ef0a1db9aac861", fontSize: "10px", fontWeight: "700", borderWidth: "0", fill: { fillType: "solid", color: 4294967295 }, horizontalAlignment: "left", verticalAlignment: "top", paddingLeft: "0", paddingTop: "0", paddingRight: "0", paddingBottom: "0" },
      "_段落": { id: "4988d43d80b44008a4a415096f1632af", borderWidth: "0", fill: { fillType: "solid", color: 4294967295 }, horizontalAlignment: "left", verticalAlignment: "top", paddingLeft: "0", paddingTop: "0", paddingRight: "0", paddingBottom: "0" },
      "_表单提示文本": { id: "4889d666e8ad4c5e81e59863039a5cc0", foreGroundFill: { fillType: "solid", color: 4288256409, opacity: 1 } },
      "_表单禁用": { id: "9bd0236217a94d89b0314c8c7fc75f16", fill: { fillType: "solid", color: 4293980400 } },
      "_流程图形状": { id: "df01900e3c4e43f284bafec04b0864c4", fill: { fillType: "linearGradient", startPoint: { x: 0.5, y: 0 }, endPoint: { x: 0.5, y: 1 }, stops: [{ color: 4294967295, offset: 0 }, { color: 4294111986, offset: 0 }, { color: 4293190884, offset: 1 }, { color: 4294967295, offset: 1 }] } }
    }
  };
}

function buildDocument() {
  const rootNodes = navGroups.map(group => ({
    id: md5(group.key).slice(0, 6),
    pageName: group.label,
    type: "Folder",
    url: "",
    children: group.children.map(key => ({ id: md5(key).slice(0, 6), pageName: pageMeta[key].heading, type: "Wireframe", url: pageMeta[key].file }))
  }));

  return {
    configuration: {
      showPageNotes: true, showPageNoteNames: false, showAnnotations: true, showAnnotationsSidebar: true, showConsole: true,
      linkStyle: "b", displayMultipleTargetsOnly: true, linkFlowsToPages: true, linkFlowsToPagesNewWindow: true, useLabels: true, useViews: false, loadFeedbackPlugin: false
    },
    sitemap: { rootNodes },
    additionalJs: ["plugins/debug/debug.js", "plugins/sitemap/sitemap.js", "plugins/page_notes/page_notes.js", "resources/scripts/hintmanager.js"],
    additionalCss: ["plugins/debug/styles/debug.css", "plugins/sitemap/styles/sitemap.css", "plugins/page_notes/styles/page_notes.css"],
    globalVariables: { onloadvariable: "" },
    stylesheet: buildDocumentStyle()
  };
}

function buildPageData(pageName, fileName) {
  const packageId = md5(fileName + ":package");
  const shapeId = md5(fileName + ":shape");
  const dataObject = {
    url: fileName,
    generationDate: "__GEN_DATE__",
    defaultAdaptiveView: "",
    adaptiveViews: [],
    sketchKeys: { s0: {} },
    variables: ["OnLoadVariable"],
    page: {
      packageId,
      type: "Axure:Page",
      name: pageName,
      notes: {},
      style: {
        baseStyle: "627587b6038d43cca051c114ac41ad32",
        pageAlignment: "center",
        fill: { fillType: "solid", color: 4294967295 },
        image: null, imageAlignment: "near", imageRepeat: "auto", favicon: "", sketchFactor: "0", colorStyle: "appliedColor", fontName: "Applied font",
        borderWidth: "1", borderVisibility: "top right bottom left", borderFill: { fillType: "solid", color: 4286151033, opacity: 1 }, cornerRadius: "0",
        cornerVisibility: "top right bottom left", outerShadow: { on: false, offsetX: 5, offsetY: 5, blurRadius: 5, spread: 0, color: { r: 0, g: 0, b: 0, a: 0.34901960784313724 } }, pageCursor: "touch"
      },
      adaptiveStyles: {},
      interactionMap: {},
      diagram: { objects: [{ id: shapeId, label: "", type: "buttonShape", styleType: "paragraph", visible: true, style: { fontWeight: "700", fontName: "\"Arial Negreta\", \"Arial Normal\", \"Arial\", sans-serif", location: { x: 131, y: 152 }, size: { width: 224, height: 37 } }, adaptiveStyles: {} }] }
    },
    masters: {},
    objectPaths: {}
  };
  dataObject.objectPaths[shapeId] = { scriptId: "u0" };
  return "$axure.loadCurrentPage(\n" + JSON.stringify(dataObject, null, 2).replace("\"__GEN_DATE__\"", "new Date(" + Date.now() + ")") + "\n);\n";
}

function buildHtml(pageName, pageKey) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${pageName}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <link href="resources/css/axure_rp_page.css" type="text/css" rel="stylesheet"/>
    <link href="data/styles.css" type="text/css" rel="stylesheet"/>
    <link href="files/${pageName}/styles.css" type="text/css" rel="stylesheet"/>
    <link href="resources/css/prototype.css" type="text/css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"/>
    <script src="resources/scripts/jquery-3.7.1.min.js"></script>
    <script src="resources/scripts/axure/axQuery.js"></script>
    <script src="resources/scripts/axure/globals.js"></script>
    <script src="resources/scripts/axutils.js"></script>
    <script src="resources/scripts/axure/annotation.js"></script>
    <script src="resources/scripts/axure/axQuery.std.js"></script>
    <script src="resources/scripts/axure/doc.js"></script>
    <script src="resources/scripts/messagecenter.js"></script>
    <script src="resources/scripts/axure/events.js"></script>
    <script src="resources/scripts/axure/recording.js"></script>
    <script src="resources/scripts/axure/action.js"></script>
    <script src="resources/scripts/axure/expr.js"></script>
    <script src="resources/scripts/axure/geometry.js"></script>
    <script src="resources/scripts/axure/flyout.js"></script>
    <script src="resources/scripts/axure/model.js"></script>
    <script src="resources/scripts/axure/repeater.js"></script>
    <script src="resources/scripts/axure/sto.js"></script>
    <script src="resources/scripts/axure/utils.temp.js"></script>
    <script src="resources/scripts/axure/variables.js"></script>
    <script src="resources/scripts/axure/drag.js"></script>
    <script src="resources/scripts/axure/move.js"></script>
    <script src="resources/scripts/axure/visibility.js"></script>
    <script src="resources/scripts/axure/style.js"></script>
    <script src="resources/scripts/axure/adaptive.js"></script>
    <script src="resources/scripts/axure/tree.js"></script>
    <script src="resources/scripts/axure/init.temp.js"></script>
    <script src="resources/scripts/axure/legacy.js"></script>
    <script src="resources/scripts/axure/viewer.js"></script>
    <script src="resources/scripts/axure/math.js"></script>
    <script src="resources/scripts/axure/jquery.nicescroll.min.js"></script>
    <script src="data/document.js"></script>
    <script src="files/${pageName}/data.js"></script>
    <script type="text/javascript">
      $axure.utils.getTransparentGifPath = function() { return 'resources/images/transparent.gif'; };
      $axure.utils.getOtherPath = function() { return 'resources/Other.html'; };
      $axure.utils.getReloadPath = function() { return 'resources/reload.html'; };
      window.PROTOTYPE_PAGE_KEY = "${pageKey}";
      window.PROTOTYPE_ROUTE_MODE = "page";
    </script>
  </head>
  <body>
    <div id="base" class=""><div id="u0" class="ax_default _一级标题 transition notrs"><div id="u0_div" class=""></div><div id="u0_text" class="text "><p><span>这是${pageName}页面</span></p></div></div></div>
    <script src="resources/scripts/prototype.config.js"></script>
    <script src="resources/scripts/prototype.page-loader.js"></script>
    <script src="resources/scripts/prototype.style-loader.js"></script>
    <script src="resources/scripts/pages/${pageKey}.page.js"></script>
    <script src="resources/scripts/mock-store.js"></script>
    <script src="resources/scripts/prototype.utils.js"></script>
    <script src="resources/scripts/prototype.shell.js"></script>
    <script src="resources/scripts/prototype.dashboard.js"></script>
    <script src="resources/scripts/prototype.table.js"></script>
    <script src="resources/scripts/prototype.components.js"></script>
    <script src="resources/scripts/prototype.js"></script>
    <script src="resources/scripts/axure/ios.js"></script>
  </body>
</html>
`;
}

writeText(path.join(targetRoot, "resources/scripts/prototype.config.js"), "window.PROTOTYPE_CONFIG = " + JSON.stringify(buildPrototypeConfig(), null, 2) + ";\n");
writeText(path.join(targetRoot, "data/document.js"), "$axure.loadDocument(\n" + JSON.stringify(buildDocument(), null, 2) + "\n);\n");

for (const [key, page] of Object.entries(transformedPages)) {
  const meta = pageMeta[key];
  writeText(path.join(targetRoot, "resources/scripts/pages", key + ".page.js"), "window.registerPrototypePage(" + JSON.stringify(page, null, 2) + ");\n");
  writeText(path.join(targetRoot, "resources/css/pages", key + ".css"), `.page-${key} .content-grid {\n  align-content: start;\n}\n`);
  writeText(path.join(targetRoot, meta.file), buildHtml(meta.pageName, key));
  writeText(path.join(targetRoot, "files", meta.pageName, "data.js"), buildPageData(meta.pageName, meta.file));
  writeText(path.join(targetRoot, "files", meta.pageName, "styles.css"), "body {\n  margin: 0px;\n  background-image: none;\n  position: static;\n  left: auto;\n  width: auto;\n  min-width: 1280px;\n  margin-left: 0;\n  margin-right: 0;\n  text-align: left;\n}\n\n.form_sketch {\n  border-color: transparent;\n  background-color: transparent;\n}\n\n#base {\n  position: static;\n  z-index: 0;\n  width: 100%;\n  min-height: 100vh;\n}\n", false);
}

console.log("Generated pages:", Object.keys(transformedPages).length);
