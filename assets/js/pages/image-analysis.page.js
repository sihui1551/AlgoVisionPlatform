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
    "summary": "面向研发、设计、测试说明图片分析任务管理页的原型范围。",
    "goal": "供平台运营人员统一查看并管理图片分析任务，重点支持任务筛选、状态判断和任务入口跳转。",
    "modules": [
      "顶部工具栏提供新建、禁用、删除操作，承接任务管理主动作。",
      "筛选区支持按任务启用状态和关键字快速定位目标任务。",
      "任务列表集中展示任务算法、启用状态、服务健康状态和告警推送状态。",
      "行内详情入口进入任务配置视图，用于核对当前算法、资源和点位设置。"
    ],
    "rules": [
      "列表页以任务管理和状态查看为主，不承载复杂编辑。",
      "任务状态与服务健康状态需要分开表达，便于定位问题归因。",
      "新建任务和任务详情都通过独立配置页承接后续操作。"
    ],
    "interactions": [
      "禁用操作不会删除任务，只切换任务启用状态。",
      "批量禁用和批量删除仅对当前勾选项生效。",
      "筛选条件变化后，列表结果需要正确刷新。",
      "点击详情可进入对应图片分析任务配置页。"
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
