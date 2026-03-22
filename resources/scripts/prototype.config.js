window.PROTOTYPE_CONFIG = {
  "app": {
    "eyebrow": "演示框架",
    "brandMark": "AI",
    "name": "AI视频算法调度平台",
    "subtitle": "多模型视频生产与调度原型",
    "navSectionTitle": "",
    "footerItems": [
      "当前用户：Admin",
      "演示环境：Mock 数据"
    ]
  },
  "mockStore": {
    "enabled": true,
    "driver": "localStorage",
    "namespace": "axure-prototype",
    "project": "ai-video-scheduling-platform",
    "version": "2026-03-22-stream-toolbar-v4",
    "seedOnFirstLoad": true
  },
  "defaultPage": "stream-analysis",
  "navigation": [
    {
      "key": "home-group",
      "label": "首页",
      "icon": "目录",
      "children": [
        {
          "key": "dashboard",
          "label": "仪表盘"
        }
      ]
    },
    {
      "key": "access-group",
      "label": "接入管理",
      "icon": "目录",
      "children": [
        {
          "key": "gb-device",
          "label": "国标设备"
        }
      ]
    },
    {
      "key": "algorithm-group",
      "label": "算法仓库",
      "icon": "目录",
      "children": [
        {
          "key": "algorithms",
          "label": "算法管理"
        }
      ]
    },
    {
      "key": "task-group",
      "label": "任务管理",
      "icon": "目录",
      "children": [
        {
          "key": "stream-analysis",
          "label": "视频流分析"
        },
        {
          "key": "image-analysis",
          "label": "图片分析"
        },
        {
          "key": "offline-analysis",
          "label": "离线视图分析"
        }
      ]
    },
    {
      "key": "event-group",
      "label": "事件中心",
      "icon": "目录",
      "children": [
        {
          "key": "event-list",
          "label": "事件列表"
        }
      ]
    },
    {
      "key": "system-group",
      "label": "系统管理",
      "icon": "目录",
      "children": [
        {
          "key": "rules",
          "label": "规格管理"
        },
        {
          "key": "platform-config",
          "label": "平台配置"
        }
      ]
    }
  ],
  "pageRegistry": {
    "stream-analysis": {
      "key": "stream-analysis",
      "file": "视频流分析.html",
      "source": "resources/scripts/pages/stream-analysis.page.js"
    },
    "stream-task-create": {
      "key": "stream-task-create",
      "file": "视频流新建任务.html",
      "source": "resources/scripts/pages/stream-task-create.page.js"
    },
    "offline-analysis": {
      "key": "offline-analysis",
      "file": "离线视图分析.html",
      "source": "resources/scripts/pages/offline-analysis.page.js"
    },
    "offline-task-create": {
      "key": "offline-task-create",
      "file": "离线新建任务.html",
      "source": "resources/scripts/pages/offline-task-create.page.js"
    }
  }
};
