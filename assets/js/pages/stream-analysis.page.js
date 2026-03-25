window.registerPrototypePage({
  "key": "stream-analysis",
  "styleSource": "../assets/css/pages/stream-analysis.css",
  "kind": "dashboard",
  "heading": "视频流分析",
  "subtitle": "统一管理实时流分析任务、健康状态和告警配置。",
  "topbarActions": [
    {
      "label": "需求说明",
      "variant": "button-secondary",
      "action": "open-doc"
    },
    {
      "label": "新建任务",
      "variant": "button",
      "toastTitle": "新建任务",
      "toastMessage": "当前按钮用于演示操作入口，后续可接入真实业务流程。"
    }
  ],
  "productDoc": {
    "title": "视频流分析需求说明",
    "summary": "该页面用于查看实时视频流分析任务，并提供新建、禁用、删除等任务运维入口。",
    "goal": "让运营和调度人员在单页内完成实时任务筛选、状态识别和任务创建跳转。",
    "modules": [
      "顶部工具栏：提供新建任务、禁用、删除三类动作。",
      "筛选区：支持按任务启用状态、任务健康状态和任务关键字筛选。",
      "任务列表：展示任务启用状态、任务健康状态、服务健康状态、告警推送和告警视频片段。",
      "分页区：固定 5 条/页，便于与原型稿保持一致。"
    ],
    "fields": [
      {
        "label": "任务启用状态",
        "value": "用于区分任务是否继续参与调度，当前分为已启用和已禁用。"
      },
      {
        "label": "任务健康状态",
        "value": "用于描述任务本身的运行质量，例如正常、告警、异常。"
      },
      {
        "label": "服务健康状态",
        "value": "用于描述任务所依赖服务链路的健康情况。"
      },
      {
        "label": "告警推送",
        "value": "用于标识当前任务是否已配置告警接收地址池。"
      }
    ],
    "rules": [
      "新建任务提交成功后，列表页新增一条实时分析任务记录。",
      "批量禁用和批量删除均只对当前已勾选记录生效。",
      "禁用任务后保留原任务台账，只将任务启用状态切换为已禁用。"
    ],
    "interactions": [
      "点击新建任务后跳转到独立的新建任务页面。",
      "行内详情会弹出任务详情弹窗，集中展示算法配置、资源配置和分析点位。",
      "筛选条件变更后可即时重绘结果，查询按钮用于强化操作反馈。"
    ],
    "exceptions": [
      "若未勾选任务就执行批量操作，需要给出明确提示。",
      "任务健康状态和服务健康状态允许出现不一致，方便体现服务降级场景。"
    ],
    "pending": [
      "待确认后续是否补充任务历史运行记录。",
      "待确认告警视频片段后续是否要扩展为单独配置策略。"
    ]
  },
  "summaryCards": [
    {
      "label": "实时流任务",
      "value": "96",
      "footnote": "当前处理中",
      "tone": "primary"
    },
    {
      "label": "待调度",
      "value": "32",
      "footnote": "等待资源",
      "tone": "warning"
    },
    {
      "label": "已完成",
      "value": "684",
      "footnote": "今日累计",
      "tone": "success"
    },
    {
      "label": "异常",
      "value": "6",
      "footnote": "需排查",
      "tone": "critical"
    }
  ],
  "tablePanel": {},
  "filters": {
    "searchPlaceholder": "搜索任务编号 / 视频流名称 / 负责人",
    "searchFields": [
      "taskId",
      "source",
      "owner"
    ],
    "statusField": "statusTone",
    "statusOptions": [
      {
        "value": "",
        "label": "全部状态"
      },
      {
        "value": "pending",
        "label": "待调度"
      },
      {
        "value": "running",
        "label": "处理中"
      },
      {
        "value": "warning",
        "label": "异常"
      },
      {
        "value": "success",
        "label": "已完成"
      }
    ]
  },
  "toolbarActions": [
    {
      "label": "导出列表",
      "variant": "button-secondary",
      "toastTitle": "导出列表",
      "toastMessage": "当前原型不生成文件，导出动作仅用于验证工具栏布局。"
    }
  ],
  "countTextPrefix": "共",
  "countTextUnit": "条记录",
  "emptyText": "未找到匹配的数据",
  "table": {
    "columns": [
      {
        "key": "taskId",
        "label": "任务编号",
        "strong": true
      },
      {
        "key": "createdAt",
        "label": "提交时间"
      },
      {
        "key": "statusLabel",
        "label": "状态",
        "type": "status",
        "toneField": "statusTone",
        "labelField": "statusLabel"
      },
      {
        "key": "source",
        "label": "视频流"
      },
      {
        "key": "algorithm",
        "label": "分析链路"
      },
      {
        "key": "gpuPool",
        "label": "资源池"
      },
      {
        "key": "owner",
        "label": "负责人"
      },
      {
        "key": "actions",
        "label": "操作",
        "type": "actions"
      }
    ],
    "actions": [
      {
        "label": "详情",
        "toastTitle": "详情",
        "toastMessage": "当前为原型演示，详情入口后续可接入真实页面。"
      },
      {
        "label": "处理",
        "toastTitle": "处理",
        "toastMessage": "当前为原型演示，处理动作后续可接入真实流程。"
      }
    ],
    "rows": [
      {
        "taskId": "FLOW-20260313-001",
        "createdAt": "2026-03-13 18:56:06",
        "statusTone": "running",
        "statusLabel": "处理中",
        "source": "园区一号门摄像头流",
        "algorithm": "目标检测 + 行为识别",
        "gpuPool": "pool-a100",
        "owner": "ops.wang"
      },
      {
        "taskId": "FLOW-20260313-002",
        "createdAt": "2026-03-13 18:42:12",
        "statusTone": "pending",
        "statusLabel": "待调度",
        "source": "导播直播流 B",
        "algorithm": "镜头切分 + OCR",
        "gpuPool": "pool-a10",
        "owner": "ops.liu"
      },
      {
        "taskId": "FLOW-20260313-003",
        "createdAt": "2026-03-13 18:31:54",
        "statusTone": "warning",
        "statusLabel": "异常",
        "source": "仓储南区流",
        "algorithm": "区域越界识别",
        "gpuPool": "pool-l40",
        "owner": "ops.he"
      }
    ]
  },
  "renderInPlaceholder": true,
  "streamTaskPage": {
    "toolbarLayout": "actions-left",
    "toolbarActions": [
      {
        "label": "新建任务",
        "action": "create",
        "variant": "button"
      },
      {
        "label": "禁用",
        "action": "disable",
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
      "taskStatusOptions": [
        {
          "value": "",
          "label": "全部"
        },
        {
          "value": "enabled",
          "label": "已启用"
        },
        {
          "value": "disabled",
          "label": "已禁用"
        }
      ],
      "healthStatusOptions": [
        {
          "value": "",
          "label": "全部"
        },
        {
          "value": "normal",
          "label": "正常"
        },
        {
          "value": "warning",
          "label": "告警"
        },
        {
          "value": "error",
          "label": "异常"
        }
      ],
      "searchPlaceholder": "任务ID、任务名称"
    },
    "pageSize": 5,
    "tableColumns": [
      {
        "key": "select",
        "label": ""
      },
      {
        "key": "id",
        "label": "任务ID"
      },
      {
        "key": "name",
        "label": "任务名称"
      },
      {
        "key": "enabledLabel",
        "label": "任务启用状态"
      },
      {
        "key": "taskHealthLabel",
        "label": "任务健康状态"
      },
      {
        "key": "serviceHealthLabel",
        "label": "服务健康状态"
      },
      {
        "key": "alarmPushLabel",
        "label": "告警推送"
      },
      {
        "key": "clipLabel",
        "label": "告警视频片段"
      },
      {
        "key": "actions",
        "label": "操作"
      }
    ],
    "rows": [
      {
        "id": "123",
        "name": "人脸识别任务",
        "enabled": true,
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "healthStatus": "normal",
        "taskHealthLabel": "正常",
        "taskHealthTone": "success",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "clipLabel": "未启用",
        "algorithmSummary": "人脸聚集检测 / 占道经营",
        "nodeLabel": "边缘节点A",
        "specLabel": "A10 x2"
      },
      {
        "id": "124",
        "name": "占道经营任务",
        "enabled": true,
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "healthStatus": "warning",
        "taskHealthLabel": "告警",
        "taskHealthTone": "warning",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "clipLabel": "已启用",
        "algorithmSummary": "占道经营 / 区域越界",
        "nodeLabel": "边缘节点A",
        "specLabel": "A10 x2"
      },
      {
        "id": "125",
        "name": "区域越界任务",
        "enabled": true,
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "healthStatus": "normal",
        "taskHealthLabel": "正常",
        "taskHealthTone": "success",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "未配置",
        "clipLabel": "未启用",
        "algorithmSummary": "区域越界",
        "nodeLabel": "中心节点B",
        "specLabel": "L40 x1"
      },
      {
        "id": "126",
        "name": "烟火识别任务",
        "enabled": false,
        "taskStatus": "disabled",
        "enabledLabel": "已禁用",
        "healthStatus": "warning",
        "taskHealthLabel": "告警",
        "taskHealthTone": "warning",
        "serviceHealthLabel": "异常",
        "serviceHealthTone": "warning",
        "alarmPushLabel": "已配置",
        "clipLabel": "已启用",
        "algorithmSummary": "烟火识别",
        "nodeLabel": "中心节点B",
        "specLabel": "L40 x1"
      },
      {
        "id": "127",
        "name": "离岗检测任务",
        "enabled": true,
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "healthStatus": "error",
        "taskHealthLabel": "异常",
        "taskHealthTone": "warning",
        "serviceHealthLabel": "异常",
        "serviceHealthTone": "warning",
        "alarmPushLabel": "已配置",
        "clipLabel": "已启用",
        "algorithmSummary": "离岗检测 / 人员计数",
        "nodeLabel": "边缘节点C",
        "specLabel": "A30 x2"
      },
      {
        "id": "128",
        "name": "周界布防任务",
        "enabled": true,
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "healthStatus": "normal",
        "taskHealthLabel": "正常",
        "taskHealthTone": "success",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "clipLabel": "未启用",
        "algorithmSummary": "区域越界 / 行为检测",
        "nodeLabel": "边缘节点C",
        "specLabel": "A30 x2"
      }
    ]
  }
});
