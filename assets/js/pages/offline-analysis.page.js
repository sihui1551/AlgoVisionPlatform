window.registerPrototypePage({
  "key": "offline-analysis",
  "styleSource": "../assets/css/pages/offline-analysis.css",
  "kind": "table",
  "heading": "离线视图分析",
  "subtitle": "查看离线批量素材分析任务的执行状态、结果状态和提交记录。",
  "tablePanel": {},
  "countTextPrefix": "共",
  "countTextUnit": "条记录",
  "emptyText": "暂无离线分析任务",
  "offlineTaskPage": {
    "toolbarLayout": "actions-left",
    "toolbarActions": [
      {
        "label": "新建任务",
        "action": "create",
        "variant": "button"
      },
      {
        "label": "启动分析",
        "action": "start",
        "variant": "offline-toolbar-secondary"
      },
      {
        "label": "删除",
        "action": "delete",
        "variant": "offline-toolbar-danger"
      }
    ],
    "filters": {
      "searchFirst": false,
      "searchPlaceholder": "批次编号、任务名称",
      "searchFields": [
        "batchNo",
        "taskName"
      ],
      "selects": [
        {
          "key": "execution-status",
          "field": "executionStatus",
          "options": [
            { "value": "", "label": "全部状态" },
            { "value": "pending", "label": "待启动" },
            { "value": "running", "label": "处理中" },
            { "value": "failed", "label": "失败" },
            { "value": "completed", "label": "已完成" }
          ]
        },
        {
          "key": "material-type",
          "field": "materialType",
          "options": [
            { "value": "", "label": "全部素材" },
            { "value": "video", "label": "视频" },
            { "value": "image", "label": "图片" }
          ]
        }
      ]
    },
    "pageSize": 5,
    "tableColumns": [
      { "key": "select", "label": "", "type": "select" },
      { "key": "batchNo", "label": "批次编号", "strong": true },
      { "key": "taskName", "label": "任务名称", "strong": true },
      { "key": "inputTypeLabel", "label": "输入类型" },
      { "key": "materialTypeLabel", "label": "素材类型" },
      { "key": "fileCount", "label": "文件数量" },
      { "key": "algorithms", "label": "分析算法" },
      { "key": "executionStatusLabel", "label": "执行状态", "type": "status", "toneField": "executionStatusTone", "labelField": "executionStatusLabel" },
      { "key": "resultStatusLabel", "label": "结果状态", "type": "status", "toneField": "resultStatusTone", "labelField": "resultStatusLabel" },
      { "key": "submittedAt", "label": "提交时间" },
      { "key": "actions", "label": "操作" }
    ],
    "rows": [
      {
        "id": "offline-001",
        "batchNo": "OFF-20260317-001",
        "taskName": "夜间巡检视频补分析",
        "inputTypeLabel": "本地上传",
        "materialType": "video",
        "materialTypeLabel": "视频",
        "fileCount": "3个文件",
        "algorithms": "事件检索 / 轨迹回放",
        "executionStatus": "pending",
        "executionStatusTone": "warning",
        "executionStatusLabel": "待启动",
        "resultStatusTone": "idle",
        "resultStatusLabel": "未开始",
        "submittedAt": "2026-03-17 09:18:22",
        "actionItems": [
          { "label": "详情", "className": "offline-action-link", "toastTitle": "离线任务详情", "toastMessage": "当前原型预留 {{batchNo}} 的详情入口。" },
          { "label": "启动分析", "className": "offline-action-link offline-action-link-primary", "toastTitle": "启动分析", "toastMessage": "当前原型模拟启动 {{batchNo}}。" },
          { "label": "删除", "className": "offline-action-link offline-action-link-danger", "toastTitle": "删除任务", "toastMessage": "当前原型模拟删除 {{batchNo}}。" }
        ]
      },
      {
        "id": "offline-002",
        "batchNo": "OFF-20260317-002",
        "taskName": "商品图质重复核",
        "inputTypeLabel": "本地上传",
        "materialType": "image",
        "materialTypeLabel": "图片",
        "fileCount": "128张",
        "algorithms": "OCR / 水印检测",
        "executionStatus": "running",
        "executionStatusTone": "success",
        "executionStatusLabel": "处理中",
        "resultStatusTone": "success",
        "resultStatusLabel": "分析中",
        "submittedAt": "2026-03-17 10:02:10",
        "actionItems": [
          { "label": "详情", "className": "offline-action-link", "toastTitle": "离线任务详情", "toastMessage": "当前原型预留 {{batchNo}} 的详情入口。" },
          { "label": "暂停", "className": "offline-action-link", "toastTitle": "暂停分析", "toastMessage": "当前原型模拟暂停 {{batchNo}}。" },
          { "label": "删除", "className": "offline-action-link offline-action-link-danger", "toastTitle": "删除任务", "toastMessage": "当前原型模拟删除 {{batchNo}}。" }
        ]
      },
      {
        "id": "offline-003",
        "batchNo": "OFF-20260317-003",
        "taskName": "路口违停图片补跑",
        "inputTypeLabel": "本地上传",
        "materialType": "image",
        "materialTypeLabel": "图片",
        "fileCount": "42张",
        "algorithms": "占道经营 / 非机动车乱停",
        "executionStatus": "failed",
        "executionStatusTone": "warning",
        "executionStatusLabel": "失败",
        "resultStatusTone": "warning",
        "resultStatusLabel": "结果异常",
        "submittedAt": "2026-03-17 10:31:45",
        "actionItems": [
          { "label": "详情", "className": "offline-action-link", "toastTitle": "离线任务详情", "toastMessage": "当前原型预留 {{batchNo}} 的详情入口。" },
          { "label": "重跑", "className": "offline-action-link offline-action-link-primary", "toastTitle": "重新分析", "toastMessage": "当前原型模拟重跑 {{batchNo}}。" },
          { "label": "删除", "className": "offline-action-link offline-action-link-danger", "toastTitle": "删除任务", "toastMessage": "当前原型模拟删除 {{batchNo}}。" }
        ]
      },
      {
        "id": "offline-004",
        "batchNo": "OFF-20260317-004",
        "taskName": "历史录像切片复盘",
        "inputTypeLabel": "本地上传",
        "materialType": "video",
        "materialTypeLabel": "视频",
        "fileCount": "6个文件",
        "algorithms": "切片摘要 / 事件检索",
        "executionStatus": "completed",
        "executionStatusTone": "success",
        "executionStatusLabel": "已完成",
        "resultStatusTone": "success",
        "resultStatusLabel": "结果可用",
        "submittedAt": "2026-03-17 11:12:30",
        "actionItems": [
          { "label": "详情", "className": "offline-action-link", "toastTitle": "离线任务详情", "toastMessage": "当前原型预留 {{batchNo}} 的详情入口。" },
          { "label": "重跑", "className": "offline-action-link offline-action-link-primary", "toastTitle": "重新分析", "toastMessage": "当前原型模拟重跑 {{batchNo}}。" },
          { "label": "删除", "className": "offline-action-link offline-action-link-danger", "toastTitle": "删除任务", "toastMessage": "当前原型模拟删除 {{batchNo}}。" }
        ]
      }
    ]
  }
});
