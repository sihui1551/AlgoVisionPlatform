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
    "version": "2026-03-23-local-video-fix-v1",
    "seedOnFirstLoad": true
  },
  "defaultPage": "dashboard",
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
          "key": "access-source",
          "label": "接入源管理"
        },
        {
          "key": "local-video",
          "label": "本地视频"
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
    "dashboard": {
      "key": "dashboard",
      "file": "仪表盘.html",
      "source": "resources/scripts/pages/dashboard.page.js"
    },
    "stream-analysis": {
      "key": "stream-analysis",
      "file": "视频流分析.html",
      "source": "resources/scripts/pages/stream-analysis.page.js"
    },
    "access-source": {
      "key": "access-source",
      "file": "接入源管理.html",
      "source": "resources/scripts/pages/access-source.page.js"
    },
    "local-video": {
      "key": "local-video",
      "file": "本地视频.html",
      "source": "resources/scripts/pages/local-video.page.js"
    },
    "cloud-record": {
      "key": "cloud-record",
      "file": "云端录像.html",
      "source": "resources/scripts/pages/cloud-record.page.js"
    },
    "stream-proxy-create": {
      "key": "stream-proxy-create",
      "file": "新增代理拉流.html",
      "source": "resources/scripts/pages/stream-proxy-edit.page.js"
    },
    "stream-proxy-edit": {
      "key": "stream-proxy-edit",
      "file": "编辑拉流代理信息.html",
      "source": "resources/scripts/pages/stream-proxy-edit.page.js"
    },
    "gb-device-create": {
      "key": "gb-device-create",
      "file": "新增设备.html",
      "source": "resources/scripts/pages/gb-device-form.page.js"
    },
    "gb-device-edit": {
      "key": "gb-device-edit",
      "file": "设备编辑.html",
      "source": "resources/scripts/pages/gb-device-form.page.js"
    },
    "gb-channel-list": {
      "key": "gb-channel-list",
      "file": "通道列表.html",
      "source": "resources/scripts/pages/gb-channel-list.page.js"
    },
    "gb-channel-edit": {
      "key": "gb-channel-edit",
      "file": "编辑通道.html",
      "source": "resources/scripts/pages/gb-channel-form.page.js"
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

