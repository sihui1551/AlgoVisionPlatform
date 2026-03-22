window.registerPrototypePage({
  "key": "offline-task-create",
  "styleSource": "resources/css/pages/offline-task-create.css",
  "kind": "dashboard",
  "dashboardVariant": "offline-task-create",
  "renderInPlaceholder": true,
  "heading": "离线新建任务",
  "subtitle": "配置离线素材分析任务的算法组合、优先级与分析素材。",
  "breadcrumbTrail": [
    "任务管理",
    "离线视图分析"
  ],
  "offlineTaskBuilder": {
    "taskName": "",
    "defaultMaterialType": "video",
    "materialTypes": [
      { "key": "video", "label": "视频" },
      { "key": "image", "label": "图片" }
    ],
    "algorithms": [
      { "label": "事件检索" },
      { "label": "OCR识别" },
      { "label": "水印检测" }
    ],
    "priorityOptions": [
      { "key": "high", "label": "高" },
      { "key": "medium", "label": "中" },
      { "key": "low", "label": "低" }
    ],
    "defaultPriority": "medium",
    "recipients": [
      { "label": "跨屏平台1" },
      { "label": "跨屏平台2" }
    ],
    "specLabel": "InstanceOffer-1",
    "tabs": [
      {
        "key": "event-search",
        "label": "事件检索",
        "version": "V1.0",
        "interval": "5",
        "materials": []
      },
      {
        "key": "ocr",
        "label": "OCR识别",
        "version": "V1.0",
        "interval": "5",
        "materials": []
      },
      {
        "key": "watermark",
        "label": "水印检测",
        "version": "V1.0",
        "interval": "5",
        "materials": []
      }
    ]
  },
  "setup": function (runtime) {
    return window.PROTOTYPE_DASHBOARD.bindOfflineTaskCreatePage(runtime);
  }
});
