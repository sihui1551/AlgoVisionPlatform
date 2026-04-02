window.registerPrototypePage({
    "key": "stream-task-create",
    "kind": "dashboard",
    "dashboardVariant": "stream-task-create",
    "renderInPlaceholder": true,
    "heading": "新建任务",
    "subtitle": "配置视频流分析任务的算法链路、有效期和算力资源。",
    "breadcrumbTrail": [
      "任务管理",
      "视频流分析"
    ],
  "productDoc": {
      "title": "新建任务需求说明",
      "summary": "面向研发、设计、测试说明视频流任务创建页的原型范围。",
      "goal": "通过独立创建页完成视频流分析任务的基础信息录入、算法链路配置和资源绑定。",
      "modules": [
        "基础表单负责录入任务名称、有效期、优先级和告警推送等公共信息。",
        "算法选择弹窗仅展示支持视频流分析的算法，保存后回写已选算法。",
        "资源配置区负责节点池和资源规格选择，承接任务调度所需资源信息。",
        "算法配置区根据已选算法生成参数标签和分析点位列表，支持时间计划、点位预览和编辑。"
      ],
      "rules": [
        "提交前必须填写任务名称、至少选择一个算法并至少绑定一个分析点位。",
        "算法选择和地址选择采用弹窗草稿态，只有保存后才回写主表单。",
        "已选算法需要联动下方参数标签、时间计划和分析点位配置。"
      ],
      "interactions": [
        "取消算法或地址选择不会覆盖当前页面已保存结果。",
        "选择长期有效后，日期输入需要自动禁用。",
        "未选择算法或点位直接提交时，需要阻止提交并给出提示。",
        "保存地址选择后，已选平台结果需要正确回写主表单。"
      ]
    },
    "taskBuilder": {
      "defaultValidityType": "custom",
      "defaultStartDate": "2026-03-16",
      "defaultEndDate": "2026-03-31",
      "defaultPriority": "medium",
      "defaultClipEnabled": true,
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
      "alarmRecipients": [
        {
          "key": "addr-1",
          "label": "跨屏平台1",
          "name": "跨屏平台1",
          "url": "http://192.168.224.110:18080/xxx/xxx/xx",
          "bindTask": "人脸识别任务",
          "status": "在线",
          "intervalSeconds": "60",
          "contents": [
            "result",
            "origin"
          ],
          "customPayload": {
            "name": "默认结果",
            "body": "{\n  \"deviceInfo\": {\n    \"deviceId\": \"prod_air_conditioner_2025\"\n  }\n}"
          }
        },
        {
          "key": "addr-2",
          "label": "跨屏平台2",
          "name": "跨屏平台2",
          "url": "http://192.168.224.111:18080/xxx/xxx/xx",
          "bindTask": "城市治理任务",
          "status": "在线",
          "intervalSeconds": "90",
          "contents": [
            "result",
            "painted"
          ],
          "customPayload": {
            "name": "城市治理结果",
            "body": "{\n  \"bizType\": \"city_governance\"\n}"
          }
        },
        {
          "key": "addr-3",
          "label": "跨屏平台3",
          "name": "跨屏平台3",
          "url": "http://192.168.224.112:18080/xxx/xxx/xx",
          "bindTask": "车辆识别任务",
          "status": "在线",
          "intervalSeconds": "120",
          "contents": [
            "result",
            "clip"
          ],
          "customPayload": {
            "name": "车辆告警结果",
            "body": "{\n  \"bizType\": \"vehicle_alert\"\n}"
          }
        }
      ],
      "nodePools": [
        {
          "key": "node-service-1",
          "group": "service",
          "label": "GPU节点-1",
          "ip": "172.31.19.39",
          "statusLabel": "运行中",
          "statusTone": "success",
          "cpu": "2/16 Core",
          "memory": "45/64 GB",
          "gpuUsage": "2/16 Core",
          "gpuMemoryUsage": "45/64 GB"
        },
        {
          "key": "node-service-2",
          "group": "service",
          "label": "GPU节点-2",
          "ip": "172.31.19.39",
          "statusLabel": "运行中",
          "statusTone": "success",
          "cpu": "2/16 Core",
          "memory": "45/64 GB",
          "gpuUsage": "2/16 Core",
          "gpuMemoryUsage": "45/64 GB"
        },
        {
          "key": "node-service-3",
          "group": "service",
          "label": "GPU节点-3",
          "ip": "172.31.19.39",
          "statusLabel": "运行中",
          "statusTone": "success",
          "cpu": "1/16 Core",
          "memory": "1/64 GB",
          "gpuUsage": "1/16 Core",
          "gpuMemoryUsage": "1/64 GB"
        },
        {
          "key": "node-edge-1",
          "group": "edge",
          "label": "边缘盒子-1",
          "ip": "10.24.1.11",
          "statusLabel": "运行中",
          "statusTone": "success",
          "cpu": "32%",
          "memory": "18/32 GB",
          "gpuUsage": "41%",
          "gpuMemoryUsage": "10/24 GB"
        },
        {
          "key": "node-edge-2",
          "group": "edge",
          "label": "边缘盒子-2",
          "ip": "10.24.1.12",
          "statusLabel": "运行中",
          "statusTone": "success",
          "cpu": "27%",
          "memory": "12/32 GB",
          "gpuUsage": "35%",
          "gpuMemoryUsage": "8/24 GB"
        }
      ],
      "resourceSpecs": [
        {
          "key": "spec-offer-1",
          "id": "123123",
          "label": "InstanceOffer-1",
          "vcpu": "4",
          "memoryGB": "8",
          "gpu": "Nvidia A20",
          "gpuMemoryGB": "1*24",
          "diskGB": "500",
          "meta": "通用视频分析规格"
        },
        {
          "key": "spec-offer-2",
          "id": "123124",
          "label": "InstanceOffer-2",
          "vcpu": "8",
          "memoryGB": "16",
          "gpu": "Nvidia A30",
          "gpuMemoryGB": "1*24",
          "diskGB": "500",
          "meta": "适合多算法常驻任务"
        },
        {
          "key": "spec-offer-3",
          "id": "123125",
          "label": "InstanceOffer-3",
          "vcpu": "16",
          "memoryGB": "32",
          "gpu": "Nvidia L40",
          "gpuMemoryGB": "1*48",
          "diskGB": "1000",
          "meta": "适合高精度复杂推理"
        },
        {
          "key": "spec-offer-4",
          "id": "123126",
          "label": "InstanceOffer-4",
          "vcpu": "8",
          "memoryGB": "12",
          "gpu": "Nvidia A20",
          "gpuMemoryGB": "1*24",
          "diskGB": "500",
          "meta": "适合中等吞吐检测任务"
        },
        {
          "key": "spec-offer-5",
          "id": "123127",
          "label": "InstanceOffer-5",
          "vcpu": "4",
          "memoryGB": "8",
          "gpu": "Nvidia A20",
          "gpuMemoryGB": "1*24",
          "diskGB": "500",
          "meta": "适合轻量分析任务"
        }
      ],
      "algorithms": [
        {
          "key": "pending-1",
          "label": "沿街商铺检测",
          "versions": [
            "V1.0"
          ],
          "defaultVersion": "V1.0",
          "defaultInterval": "10",
          "defaultUnit": "秒",
          "description": "识别沿街经营和出店占道行为。",
          "sourceType": "视频"
        },
        {
          "key": "crowd-gather",
          "label": "人员聚集检测",
          "versions": [
            "V1.0",
            "V1.0.1"
          ],
          "defaultVersion": "V1.0.1",
          "defaultInterval": "10",
          "defaultUnit": "秒",
          "description": "识别人群密度变化并输出告警事件。",
          "sourceType": "视频"
        },
        {
          "key": "dew-sky",
          "label": "露天烧烤检测",
          "versions": [
            "V1.0"
          ],
          "defaultVersion": "V1.0",
          "defaultInterval": "20",
          "defaultUnit": "秒",
          "description": "识别露天烧烤烟火场景。",
          "sourceType": "视频"
        },
        {
          "key": "mess-parking",
          "label": "非机动车乱停",
          "versions": [
            "V1.1"
          ],
          "defaultVersion": "V1.1",
          "defaultInterval": "15",
          "defaultUnit": "秒",
          "description": "识别非机动车违规停放。",
          "sourceType": "视频"
        },
        {
          "key": "over-rail",
          "label": "翻越围栏",
          "versions": [
            "V1.0"
          ],
          "defaultVersion": "V1.0",
          "defaultInterval": "10",
          "defaultUnit": "秒",
          "description": "识别越界翻栏风险。",
          "sourceType": "视频"
        },
        {
          "key": "road-occupy",
          "label": "占道经营",
          "versions": [
            "V1.0",
            "V1.1"
          ],
          "defaultVersion": "V1.0",
          "defaultInterval": "10",
          "defaultUnit": "秒",
          "description": "识别违规占道与堆放行为。",
          "sourceType": "视频"
        },
        {
          "key": "water-trash",
          "label": "水面垃圾",
          "versions": [
            "V0.9"
          ],
          "defaultVersion": "V0.9",
          "defaultInterval": "30",
          "defaultUnit": "秒",
          "description": "识别水面漂浮垃圾和聚集区。",
          "sourceType": "视频"
        },
        {
          "key": "engineering",
          "label": "工程车辆",
          "versions": [
            "V1.0"
          ],
          "defaultVersion": "V1.0",
          "defaultInterval": "15",
          "defaultUnit": "秒",
          "description": "识别工程车辆出入和停留。",
          "sourceType": "视频"
        }
      ],
      "streams": [
        {
          "id": "stream-001",
          "sourceDeviceId": "device-123",
          "name": "测试设备123",
          "url": "rtsp://192.168.0.99:554/h264/ch1/main/av_stream",
          "group": "陈江街道",
          "statusTone": "success",
          "statusLabel": "在线",
          "alertFilterEnabled": true,
          "confidenceThreshold": "0.4",
          "abnormalityThreshold": "0.3",
          "similarityThreshold": "0.5",
          "algorithmThreshold": "0.4,0.3,0.5",
          "roiMode": "default",
          "roiLabel": "默认",
          "previewImage": "../assets/images/video-preview-placeholder.svg"
        },
        {
          "id": "stream-002",
          "sourceDeviceId": "device-201",
          "name": "测试设备234",
          "url": "rtsp://192.168.0.100:554/h264/ch1/main/av_stream",
          "group": "惠环街道",
          "statusTone": "success",
          "statusLabel": "在线",
          "alertFilterEnabled": true,
          "confidenceThreshold": "0.4",
          "abnormalityThreshold": "0.3",
          "similarityThreshold": "0.5",
          "algorithmThreshold": "0.4,0.3,0.5",
          "roiMode": "custom",
          "roiLabel": "自定义",
          "roiPoints": [
            {
              "x": 0.14,
              "y": 0.21
            },
            {
              "x": 0.82,
              "y": 0.18
            },
            {
              "x": 0.76,
              "y": 0.76
            },
            {
              "x": 0.2,
              "y": 0.72
            }
          ],
          "previewImage": "../assets/images/video-preview-placeholder.svg"
        },
        {
          "id": "stream-003",
          "sourceDeviceId": "device-302",
          "name": "测试设备345",
          "url": "rtsp://192.168.0.101:554/h264/ch1/main/av_stream",
          "group": "江北街道",
          "statusTone": "success",
          "statusLabel": "在线",
          "alertFilterEnabled": false,
          "confidenceThreshold": "0.4",
          "abnormalityThreshold": "0.3",
          "similarityThreshold": "0.5",
          "algorithmThreshold": "0.4,0.3,0.5",
          "roiMode": "custom",
          "roiLabel": "自定义",
          "roiPoints": [
            {
              "x": 0.24,
              "y": 0.28
            },
            {
              "x": 0.72,
              "y": 0.22
            },
            {
              "x": 0.66,
              "y": 0.69
            },
            {
              "x": 0.28,
              "y": 0.75
            }
          ],
          "previewImage": "../assets/images/video-preview-placeholder.svg"
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
        },
        {
          "key": "clip",
          "label": "告警视频片段"
        }
      ],
      "nodeTabs": [
        {
          "key": "service",
          "label": "服务器节点"
        },
        {
          "key": "edge",
          "label": "边缘盒子节点"
        }
      ],
      "pointAssets": {
        "previewImage": "../assets/images/video-preview-placeholder.svg"
      },
      "defaultScheduleKey": "all-day",
      "schedulePlans": [
        {
          "key": "all-day",
          "label": "全天候",
          "locked": true,
          "hint": "默认模板，不允许修改。",
          "weekly": [
            {
              "day": "星期一",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期二",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期三",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期四",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期五",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期六",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期日",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            }
          ]
        },
        {
          "key": "workday",
          "label": "工作日",
          "locked": true,
          "hint": "默认模板，不允许修改。",
          "weekly": [
            {
              "day": "星期一",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期二",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期三",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期四",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期五",
              "ranges": [
                {
                  "start": 0,
                  "end": 24
                }
              ]
            },
            {
              "day": "星期六",
              "ranges": []
            },
            {
              "day": "星期日",
              "ranges": []
            }
          ]
        }
      ],
      "taskType": "stream",
      "listPageKey": "stream-analysis",
      "showClipToggle": true,
      "showNodeSelector": true,
      "showSpecSelector": true
    }
  ,
  "setup": function (runtime) {
    return window.PROTOTYPE_DASHBOARD.bindTaskCreatePage(runtime);
  },
  "styleSource": "../assets/css/pages/stream-task-create.css"
});

