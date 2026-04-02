window.registerPrototypePage({
  "key": "image-task-create",
  "kind": "dashboard",
  "dashboardVariant": "stream-task-create",
  "renderInPlaceholder": true,
  "heading": "新建任务",
  "subtitle": "配置图片分析任务的算法、有效期、输入方式与分析点位。",
  "breadcrumbTrail": [
    "任务管理",
    "图片分析"
  ],
  "productDoc": {
    "title": "图片分析任务需求说明",
    "summary": "面向研发、设计、测试说明图片任务创建页的原型范围。",
    "goal": "通过独立创建页完成图片分析任务的基础配置、输入方式选择和算法点位绑定。",
    "modules": [
      "基础表单负责录入任务名称、有效期、优先级和告警推送等公共信息。",
      "算法选择弹窗仅展示支持图片分析的算法，保存后回写已选算法。",
      "输入方式区域支持 SDK 抓图、API 和消息队列三种接入方式。",
      "分析点位区根据算法配置展示点位列表，支持预览、编辑和删除。"
    ],
    "rules": [
      "提交前必须填写任务名称、至少选择一个算法并至少绑定一个分析点位。",
      "算法选择和地址选择采用弹窗草稿态，只有保存后才回写主表单。",
      "输入方式切换需要与当前页面展示的配置说明保持一致。"
    ],
    "interactions": [
      "取消算法或地址选择不会覆盖当前页面已保存结果。",
      "选择长期有效后，日期输入需要自动禁用。",
      "分析点位支持添加、预览、编辑和删除。",
      "未选择算法或点位直接提交时，需要阻止提交并给出提示。"
    ]
  },
  "taskBuilder": {
    "defaultValidityType": "custom",
    "defaultStartDate": "2026-03-16",
    "defaultEndDate": "2026-03-31",
    "defaultPriority": "medium",
    "defaultInputMode": "sdk",
    "showClipToggle": false,
    "showNodeSelector": false,
    "showSpecSelector": true,
    "intervalUnits": [
      {
        "value": "小时",
        "label": "小时"
      },
      {
        "value": "分钟",
        "label": "分钟"
      },
      {
        "value": "秒",
        "label": "秒"
      },
      {
        "value": "毫秒",
        "label": "毫秒"
      }
    ],
    "priorityOptions": [
      {
        "key": "high",
        "label": "高"
      },
      {
        "key": "medium",
        "label": "中"
      },
      {
        "key": "low",
        "label": "低"
      }
    ],
    "inputModes": [
      {
        "key": "sdk",
        "label": "SDK抓图"
      },
      {
        "key": "api",
        "label": "API"
      },
      {
        "key": "mq",
        "label": "消息队列"
      }
    ],
    "alarmRecipients": [
      {
        "key": "addr-1",
        "label": "跨屏平台1",
        "name": "跨屏平台1",
        "url": "http://192.168.224.110:18080/api/image/result",
        "bindTask": "图片分析任务1",
        "status": "在线",
        "intervalSeconds": "60",
        "contents": [
          "result",
          "origin"
        ],
        "customPayload": {
          "name": "默认结果",
          "body": "{\n  \"scene\": \"image_analysis\"\n}"
        }
      },
      {
        "key": "addr-2",
        "label": "跨屏平台2",
        "name": "跨屏平台2",
        "url": "http://192.168.224.111:18080/api/image/event",
        "bindTask": "图片分析任务2",
        "status": "在线",
        "intervalSeconds": "90",
        "contents": [
          "result",
          "painted"
        ],
        "customPayload": {
          "name": "绘制结果",
          "body": "{\n  \"scene\": \"painted_result\"\n}"
        }
      }
    ],
    "resourceSpecs": [
      {
        "key": "spec-offer-1",
        "id": "img-offer-1",
        "label": "InstanceOffer-1",
        "vcpu": "4",
        "memoryGB": "8",
        "gpu": "Nvidia A20",
        "gpuMemoryGB": "1*24",
        "diskGB": "500",
        "meta": "适合轻量图片分析任务"
      },
      {
        "key": "spec-offer-2",
        "id": "img-offer-2",
        "label": "InstanceOffer-2",
        "vcpu": "8",
        "memoryGB": "16",
        "gpu": "Nvidia A30",
        "gpuMemoryGB": "1*24",
        "diskGB": "500",
        "meta": "适合多算法并发任务"
      }
    ],
    "algorithms": [
      {
        "key": "road-occupy",
        "label": "占道经营",
        "versions": [
          "V0.1.0",
          "V0.1.1"
        ],
        "defaultVersion": "V0.1.0",
        "defaultInterval": "10",
        "defaultUnit": "分钟",
        "description": "识别沿街经营和违规占道行为。",
        "sourceType": "图片"
      },
      {
        "key": "crowd-gather",
        "label": "人群聚集检测",
        "versions": [
          "V0.1.0"
        ],
        "defaultVersion": "V0.1.0",
        "defaultInterval": "10",
        "defaultUnit": "分钟",
        "description": "识别人群密度变化并输出告警事件。",
        "sourceType": "图片"
      },
      {
        "key": "helmet",
        "label": "治安骑巡检测",
        "versions": [
          "V0.2.0"
        ],
        "defaultVersion": "V0.2.0",
        "defaultInterval": "10",
        "defaultUnit": "分钟",
        "description": "识别治安骑巡场景中的异常行为。",
        "sourceType": "图片"
      }
    ],
    "points": [
      {
        "id": "point-201",
        "name": "测试设备201",
        "ip": "192.168.0.99",
        "url": "192.168.0.99",
        "statusTone": "offline",
        "statusLabel": "离线",
        "alertFilterEnabled": true,
        "confidenceThreshold": "0.4",
        "abnormalityThreshold": "0.3",
        "similarityThreshold": "0.5",
        "algorithmThreshold": "0.4,0.3,0.5",
        "roiMode": "default",
        "roiLabel": "默认",
        "previewImage": "../assets/images/image-preview-placeholder.svg"
      },
      {
        "id": "point-205",
        "name": "测试设备205",
        "ip": "192.168.0.99",
        "url": "192.168.0.99",
        "statusTone": "success",
        "statusLabel": "在线",
        "alertFilterEnabled": true,
        "confidenceThreshold": "0.4",
        "abnormalityThreshold": "0.3",
        "similarityThreshold": "0.5",
        "algorithmThreshold": "0.4,0.3,0.5",
        "roiMode": "custom",
        "roiLabel": "自定义",
        "previewImage": "../assets/images/image-preview-placeholder.svg"
      },
      {
        "id": "point-401",
        "name": "测试设备401",
        "ip": "192.168.0.99",
        "url": "192.168.0.99",
        "statusTone": "success",
        "statusLabel": "在线",
        "alertFilterEnabled": false,
        "confidenceThreshold": "0.4",
        "abnormalityThreshold": "0.3",
        "similarityThreshold": "0.5",
        "algorithmThreshold": "0.4,0.3,0.5",
        "roiMode": "custom",
        "roiLabel": "自定义",
        "previewImage": "../assets/images/image-preview-placeholder.svg"
      }
    ],
    "addressContentOptions": [
      {
        "key": "result",
        "label": "结果数据"
      },
      {
        "key": "origin",
        "label": "原始图片"
      },
      {
        "key": "painted",
        "label": "绘制结果数据"
      }
    ],
    "pointAssets": {
      "previewImage": "../assets/images/image-preview-placeholder.svg"
    },
    "pointTable": {
      "title": "分析点位",
      "addLabel": "添加",
      "deleteLabel": "删除",
      "previewTitle": "抓拍图预览",
      "pickerTitle": "添加点位",
      "pickerSearchPlaceholder": "搜索点位名称、设备 IP",
      "columns": [
        {
          "key": "select",
          "label": "",
          "type": "select"
        },
        {
          "key": "name",
          "label": "点位名称",
          "strong": true
        },
        {
          "key": "ip",
          "label": "点位IP"
        },
        {
          "key": "previewImage",
          "label": "抓拍图",
          "type": "thumbnail"
        },
        {
          "key": "alertFilterLabel",
          "label": "报警过滤"
        },
        {
          "key": "algorithmThreshold",
          "label": "算法阈值"
        },
        {
          "key": "roiLabel",
          "label": "ROI"
        },
        {
          "key": "statusLabel",
          "label": "状态",
          "type": "status",
          "toneField": "statusTone",
          "labelField": "statusLabel"
        },
        {
          "key": "actions",
          "label": "操作",
          "type": "actions"
        }
      ]
    },
    "defaultScheduleKey": "all-day",
    "schedulePlans": [
      {
        "key": "all-day",
        "label": "全天候",
        "locked": true,
        "weekly": [
          { "day": "星期一", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期二", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期三", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期四", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期五", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期六", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期日", "ranges": [{ "start": 0, "end": 24 }] }
        ]
      },
      {
        "key": "workday",
        "label": "工作日",
        "locked": true,
        "weekly": [
          { "day": "星期一", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期二", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期三", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期四", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期五", "ranges": [{ "start": 0, "end": 24 }] },
          { "day": "星期六", "ranges": [] },
          { "day": "星期日", "ranges": [] }
        ]
      }
    ],
    "taskType": "image",
    "listPageKey": "image-analysis"
  },
  "setup": function (runtime) {
    return window.PROTOTYPE_DASHBOARD.bindTaskCreatePage(runtime);
  },
  "styleSource": "../assets/css/pages/image-task-create.css"
});
