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
      "key": "task-group",
      "label": "任务管理",
      "icon": "目录",
      "children": [
        {
          "key": "stream-analysis",
          "label": "视频流分析"
        },
        {
          "key": "offline-analysis",
          "label": "离线视图分析"
        }
      ]
    }
  ],
  "pageRegistry": {
    "dashboard": {
      "key": "dashboard",
      "file": "dashboard.html",
      "source": "../assets/js/pages/dashboard.page.js"
    },
    "stream-analysis": {
      "key": "stream-analysis",
      "file": "stream-analysis.html",
      "source": "../assets/js/pages/stream-analysis.page.js"
    },
    "access-source": {
      "key": "access-source",
      "file": "access-source.html",
      "source": "../assets/js/pages/access-source.page.js"
    },
    "local-video": {
      "key": "local-video",
      "file": "local-video.html",
      "source": "../assets/js/pages/local-video.page.js"
    },
    "cloud-record": {
      "key": "cloud-record",
      "file": "cloud-record.html",
      "source": "../assets/js/pages/cloud-record.page.js"
    },
    "stream-proxy-create": {
      "key": "stream-proxy-create",
      "file": "stream-proxy-create.html",
      "source": "../assets/js/pages/stream-proxy-edit.page.js"
    },
    "stream-proxy-edit": {
      "key": "stream-proxy-edit",
      "file": "stream-proxy-edit.html",
      "source": "../assets/js/pages/stream-proxy-edit.page.js"
    },
    "gb-device-create": {
      "key": "gb-device-create",
      "file": "gb-device-create.html",
      "source": "../assets/js/pages/gb-device-form.page.js"
    },
    "gb-device-edit": {
      "key": "gb-device-edit",
      "file": "gb-device-edit.html",
      "source": "../assets/js/pages/gb-device-form.page.js"
    },
    "gb-channel-list": {
      "key": "gb-channel-list",
      "file": "gb-channel-list.html",
      "source": "../assets/js/pages/gb-channel-list.page.js"
    },
    "gb-channel-edit": {
      "key": "gb-channel-edit",
      "file": "gb-channel-edit.html",
      "source": "../assets/js/pages/gb-channel-form.page.js"
    },
    "stream-task-create": {
      "key": "stream-task-create",
      "file": "stream-task-create.html",
      "source": "../assets/js/pages/stream-task-create.page.js"
    },
    "offline-analysis": {
      "key": "offline-analysis",
      "file": "offline-analysis.html",
      "source": "../assets/js/pages/offline-analysis.page.js"
    },
    "offline-task-create": {
      "key": "offline-task-create",
      "file": "offline-task-create.html",
      "source": "../assets/js/pages/offline-task-create.page.js"
    }
  }
};

