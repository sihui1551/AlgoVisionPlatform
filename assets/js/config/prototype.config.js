window.PROTOTYPE_CONFIG = {
  "app": {
    "eyebrow": "演示框架",
    "brandMark": "AI",
    "name": "AI视频平台",
    "subtitle": "多模型视频生产与调度原型",
    "navSectionTitle": "",
    "footerItems": [
      "当前用户：Admin",
      "演示环境：Mock 数据"
    ]
  },
  "portal": {
    "hero": {
      "eyebrow": "Prototype Portal",
      "title": "AI视频平台项目总入口",
      "summary": "统一进入业务原型、需求资料、架构图与流程说明。首页既是项目门户，也是产品、研发、测试协作时共享的总索引。",
      "highlights": [
        "业务页面与文档资料共用一套入口",
        "支持从任意业务页快速返回首页",
        "后续新增页面与资料时只需补充配置"
      ],
      "actions": [
        {
          "label": "进入仪表盘",
          "route": "dashboard",
          "variant": "primary"
        },
        {
          "label": "查看任务管理",
          "route": "stream-analysis",
          "variant": "secondary"
        },
        {
          "label": "阅读原型规范",
          "href": "./docs/preview.html?file=prototype-rules.md&title=%E5%8E%9F%E5%9E%8B%E8%A7%84%E5%88%99",
          "variant": "ghost"
        }
      ]
    },
    "overview": {
      "version": "2026-04 Portal v1",
      "scope": "业务原型 + 文档资料总入口",
      "audience": [
        "产品",
        "设计",
        "研发",
        "测试"
      ],
      "entryNote": "后续如果补充需求文档、架构图、流程图或说明页，统一挂到 portal 配置即可。"
    },
    "sections": [
      {
        "key": "prototype",
        "title": "业务原型入口",
        "description": "按业务域进入核心原型页面，覆盖概览、接入、任务、事件和系统配置。",
        "items": [
          {
            "label": "仪表盘",
            "description": "查看设备、算法、接入方式和告警趋势等平台总览。",
            "route": "dashboard",
            "kind": "业务页",
            "status": "ready"
          },
          {
            "label": "接入管理",
            "description": "进入接入源管理，覆盖国标设备、拉流设备、本地视频和云端录像链路。",
            "route": "access-source",
            "kind": "业务页",
            "status": "ready"
          },
          {
            "label": "任务管理",
            "description": "进入视频流分析主入口，串联图片分析、离线分析和任务创建流程。",
            "route": "stream-analysis",
            "kind": "业务页",
            "status": "ready"
          },
          {
            "label": "事件中心",
            "description": "统一查看视频流分析与图片分析产出的事件记录。",
            "route": "event-list",
            "kind": "业务页",
            "status": "ready"
          },
          {
            "label": "算法仓库",
            "description": "维护算法资产、版本信息和分析源适配关系。",
            "route": "algorithm-management",
            "kind": "业务页",
            "status": "ready"
          },
          {
            "label": "系统管理",
            "description": "进入规格管理与平台配置，查看基础配置和算力模板。",
            "route": "spec-management",
            "kind": "业务页",
            "status": "ready"
          }
        ]
      },
      {
        "key": "docs",
        "title": "文档资料入口",
        "description": "集中进入规则、页面清单以及后续会持续补充的说明类页面。",
        "items": [
          {
            "label": "原型规则",
            "description": "查看项目架构、目录规范、页面类型和需求说明抽屉规则。",
            "href": "./docs/preview.html?file=prototype-rules.md&title=%E5%8E%9F%E5%9E%8B%E8%A7%84%E5%88%99",
            "kind": "文档",
            "status": "ready"
          },
          {
            "label": "页面清单",
            "description": "查看页面入口、脚本与样式映射，便于研发对照实现。",
            "href": "./docs/preview.html?file=page-list.md&title=%E9%A1%B5%E9%9D%A2%E6%B8%85%E5%8D%95",
            "kind": "文档",
            "status": "ready"
          },
          {
            "label": "需求文档",
            "description": "预留给后续完整需求说明或专题文档入口。",
            "kind": "文档",
            "status": "planned"
          },
          {
            "label": "架构图",
            "description": "预留给系统架构图、部署结构图或模块关系图。",
            "kind": "图示",
            "status": "planned"
          },
          {
            "label": "流程图",
            "description": "预留给业务流程图、任务编排流程或交互流程说明。",
            "kind": "图示",
            "status": "planned"
          }
        ]
      }
    ],
    "quickStart": [
      {
        "role": "产品",
        "summary": "先看范围，再进关键业务链路。",
        "items": [
          {
            "label": "原型规则",
            "href": "./docs/preview.html?file=prototype-rules.md&title=%E5%8E%9F%E5%9E%8B%E8%A7%84%E5%88%99"
          },
          {
            "label": "视频流分析",
            "route": "stream-analysis"
          },
          {
            "label": "事件列表",
            "route": "event-list"
          }
        ]
      },
      {
        "role": "研发",
        "summary": "先对照入口映射，再看核心实现页面。",
        "items": [
          {
            "label": "页面清单",
            "href": "./docs/preview.html?file=page-list.md&title=%E9%A1%B5%E9%9D%A2%E6%B8%85%E5%8D%95"
          },
          {
            "label": "接入源管理",
            "route": "access-source"
          },
          {
            "label": "任务管理",
            "route": "stream-analysis"
          },
          {
            "label": "平台配置",
            "route": "platform-config"
          }
        ]
      },
      {
        "role": "测试",
        "summary": "优先看入口链路、页面规则和最近改动。",
        "items": [
          {
            "label": "仪表盘",
            "route": "dashboard"
          },
          {
            "label": "图片分析",
            "route": "image-analysis"
          },
          {
            "label": "离线分析",
            "route": "offline-analysis"
          }
        ]
      }
    ],
    "updates": [
      {
        "date": "2026-04-02",
        "title": "首页升级为项目总入口",
        "description": "首页从单纯页面导航改为门户型入口，统一承接业务页面和文档资料。"
      },
      {
        "date": "2026-04-02",
        "title": "需求说明抽屉完成统一收口",
        "description": "页面需求说明统一调整为页面目的、核心内容、实现要点和验收口径。"
      },
      {
        "date": "2026-03-25",
        "title": "原型结构切换为静态多页面",
        "description": "完成去 Axure 运行时依赖，统一收敛到 pages、assets、docs 和 tools。"
      }
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
          "key": "algorithm-management",
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
          "key": "spec-management",
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
      "file": "dashboard.html",
      "source": "../assets/js/pages/dashboard.page.js"
    },
    "stream-analysis": {
      "key": "stream-analysis",
      "file": "stream-analysis.html",
      "source": "../assets/js/pages/stream-analysis.page.js"
    },
    "image-analysis": {
      "key": "image-analysis",
      "file": "image-analysis.html",
      "source": "../assets/js/pages/image-analysis.page.js"
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
    "algorithm-management": {
      "key": "algorithm-management",
      "file": "algorithm-management.html",
      "source": "../assets/js/pages/algorithm-management.page.js"
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
    "image-task-create": {
      "key": "image-task-create",
      "file": "image-task-create.html",
      "source": "../assets/js/pages/image-task-create.page.js"
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
    },
    "platform-config": {
      "key": "platform-config",
      "file": "platform-config.html",
      "source": "../assets/js/pages/platform-config.page.js"
    },
    "event-list": {
      "key": "event-list",
      "file": "event-list.html",
      "source": "../assets/js/pages/event-list.page.js"
    },
    "spec-management": {
      "key": "spec-management",
      "file": "spec-management.html",
      "source": "../assets/js/pages/spec-management.page.js"
    }
  }
};

