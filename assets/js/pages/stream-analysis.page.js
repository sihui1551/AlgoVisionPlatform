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
    "summary": "面向研发、设计、测试说明实时视频流任务管理页的原型范围。",
    "goal": "供运营和调度人员统一查看并管理实时视频流分析任务，重点支持任务筛选、状态判断和后续处理入口跳转。",
    "modules": [
      "顶部工具栏提供新建、禁用、删除操作，承接任务管理主动作。",
      "筛选区支持按任务启用状态、任务健康状态和关键字定位目标任务。",
      "任务列表集中展示启用状态、任务健康、服务健康、告警推送和告警视频片段。",
      "行内详情弹窗用于核对算法配置、资源配置和分析点位。"
    ],
    "rules": [
      "列表页以任务管理和状态判断为主，不承载复杂编辑。",
      "任务健康状态与服务健康状态需要分开表达，用于体现任务异常与链路异常的差异。",
      "新建任务通过独立页面完成，详情弹窗承担配置核对而不是编辑提交。"
    ],
    "interactions": [
      "禁用操作不会删除任务，只切换任务启用状态。",
      "批量禁用和批量删除仅对当前勾选项生效。",
      "筛选条件变化后，列表结果需要正确刷新。",
      "点击行内详情可打开对应任务详情弹窗。"
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
        "variant": "button-secondary stream-toolbar-disable"
      },
      {
        "label": "删除",
        "action": "delete",
        "variant": "button-danger stream-toolbar-delete"
      }
    ],
    "filters": {
      "searchFirst": false,
      "searchLabel": "搜索",
      "taskStatusLabel": "任务状态",
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
      "healthStatusLabel": "健康状态",
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
  },
  "setup": function (runtime) {
    const page = runtime.page || {};
    const streamTaskPage = page.streamTaskPage || {};
    const mockStore = runtime.mockStore;
    const key = page.key || "stream-analysis";

    normalizeToolbarActions();
    syncToolbarButtons();

    if (runtime.mountNode) {
      const observer = new MutationObserver(function () {
        requestAnimationFrame(function () {
          syncToolbarButtons();
        });
      });
      observer.observe(runtime.mountNode, { childList: true, subtree: true });
      return function () {
        observer.disconnect();
      };
    }

    function normalizeToolbarActions() {
      if (!Array.isArray(streamTaskPage.toolbarActions)) {
        return;
      }

      let changed = false;
      streamTaskPage.toolbarActions.forEach(function (action) {
        if (!action) {
          return;
        }
        if (action.action === "disable" && action.variant !== "button-secondary stream-toolbar-disable") {
          action.variant = "button-secondary stream-toolbar-disable";
          changed = true;
        }
        if (action.action === "delete" && action.variant !== "button-danger stream-toolbar-delete") {
          action.variant = "button-danger stream-toolbar-delete";
          changed = true;
        }
      });

      if (changed && mockStore && typeof mockStore.patchPage === "function") {
        mockStore.patchPage(key, {
          streamTaskPage: {
            toolbarActions: streamTaskPage.toolbarActions
          }
        }, page);
      }
    }

    function syncToolbarButtons() {
      const disableButton = document.querySelector(".page-stream-analysis .stream-toolbar-disable, .page-stream-analysis .offline-toolbar-secondary");
      const deleteButton = document.querySelector(".page-stream-analysis .stream-toolbar-delete, .page-stream-analysis .offline-toolbar-danger");

      if (disableButton) {
        disableButton.classList.add("button-secondary", "stream-toolbar-disable");
        disableButton.classList.remove("offline-toolbar-secondary");
      }

      if (deleteButton) {
        deleteButton.classList.add("button-danger", "stream-toolbar-delete");
        deleteButton.classList.remove("offline-toolbar-danger");
      }
    }
  }
});
