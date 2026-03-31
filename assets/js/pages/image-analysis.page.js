window.registerPrototypePage({
  "key": "image-analysis",
  "styleSource": "../assets/css/pages/image-analysis.css",
  "kind": "dashboard",
  "heading": "图片分析",
  "tablePanel": {},
  "subtitle": "",
  "topbarActions": [
    {
      "label": "需求说明",
      "variant": "button-secondary",
      "action": "open-doc"
    }
  ],
  "productDoc": {
    "title": "图片分析需求说明",
    "summary": "该页面用于查看图片分析任务列表，并提供新建、禁用、删除等统一运维入口。",
    "goal": "让平台运营人员在单页内完成图片分析任务筛选、状态查看和任务跳转。",
    "modules": [
      "工具栏：提供新建任务、禁用、删除三类批量操作入口。",
      "筛选区：支持按任务启用状态和任务关键字进行筛选。",
      "任务列表：展示任务算法、启用状态、服务健康状态和告警推送状态。",
      "分页区：固定 5 条每页，保持与现有任务管理页面一致。"
    ],
    "rules": [
      "新建任务提交成功后，列表中新增一条图片分析任务记录。",
      "批量禁用和批量删除仅对当前勾选记录生效。",
      "任务禁用后保留历史记录，只切换任务启用状态。"
    ],
    "interactions": [
      "点击新建任务后跳转到图片分析任务配置页。",
      "行内详情可以进入任务配置视图查看当前算法、资源和点位设置。",
      "筛选条件修改后点击查询按钮刷新列表结果。"
    ]
  },
  "renderInPlaceholder": true,
  "countTextPrefix": "共",
  "countTextUnit": "条记录",
  "streamTaskPage": {
    "toolbarLayout": "actions-left",
    "toolbarActions": [
      {
        "label": "新建任务",
        "action": "create",
        "variant": "button",
        "route": "image-task-create"
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
      "searchPlaceholder": "任务ID、任务名称",
      "selects": [
        {
          "key": "taskStatus",
          "label": "任务状态",
          "field": "taskStatus",
          "options": [
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
          ]
        }
      ]
    },
    "pageSize": 5,
    "tableColumns": [
      {
        "key": "select",
        "label": "",
        "type": "select"
      },
      {
        "key": "id",
        "label": "任务ID"
      },
      {
        "key": "name",
        "label": "任务名称",
        "strong": true
      },
      {
        "key": "algorithmSummary",
        "label": "任务算法"
      },
      {
        "key": "enabledLabel",
        "label": "任务启用状态"
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
        "key": "actions",
        "label": "操作"
      }
    ],
    "rowActions": [
      {
        "label": "详情",
        "className": "table-action-link",
        "route": "image-task-create"
      },
      {
        "label": "禁用",
        "className": "table-action-link",
        "toastTitle": "禁用任务",
        "toastMessage": "当前原型保留禁用入口，后续可接入真实任务状态流转。"
      },
      {
        "label": "删除",
        "className": "table-action-link table-action-danger",
        "toastTitle": "删除任务",
        "toastMessage": "当前原型保留删除入口，后续可接入真实任务删除流程。"
      }
    ],
    "rows": [
      {
        "id": "123",
        "name": "图片分析任务1",
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "algorithmSummary": "区域入侵、抽烟、打电话"
      },
      {
        "id": "124",
        "name": "图片分析任务2",
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "algorithmSummary": "区域入侵、抽烟、打电话"
      },
      {
        "id": "125",
        "name": "图片分析任务3",
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "algorithmSummary": "区域入侵、抽烟、打电话"
      },
      {
        "id": "126",
        "name": "图片分析任务4",
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "algorithmSummary": "区域入侵、抽烟、打电话"
      },
      {
        "id": "127",
        "name": "图片分析任务5",
        "taskStatus": "enabled",
        "enabledLabel": "已启用",
        "serviceHealthLabel": "正常",
        "serviceHealthTone": "success",
        "alarmPushLabel": "已配置",
        "algorithmSummary": "区域入侵、抽烟、打电话"
      },
      {
        "id": "128",
        "name": "图片分析任务6",
        "taskStatus": "disabled",
        "enabledLabel": "已禁用",
        "serviceHealthLabel": "告警",
        "serviceHealthTone": "warning",
        "alarmPushLabel": "未配置",
        "algorithmSummary": "违停检测、占道经营"
      }
    ]
  }
});
