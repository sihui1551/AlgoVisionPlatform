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
      "summary": "该页面用于创建视频流分析任务，重点包括算法选择、有效期、优先级、告警推送和算法参数配置。",
      "goal": "通过独立任务创建页完成视频流分析任务的基础信息录入和算法链路配置。",
      "modules": [
        "分析算法：点击【选择算法】弹出算法列表，只展示支持视频流分析的算法，可多选后保存。",
        "分析有效期：用于控制任务是否长期运行或在指定时间范围内生效。",
        "分析优先级：调度策略会结合优先级决定任务抢占与恢复顺序。",
        "告警推送：点击【选择地址】打开地址列表，支持多选地址并可新增推送地址。",
        "计算资源配置：支持节点池选择和资源规格选择。",
        "分析算法配置：根据已选算法生成下方参数区和点位列表，并支持按算法绑定时间计划、点位预览和 ROI 编辑。"
      ],
      "fields": [
        {
          "label": "分析算法",
          "value": "支持多选，仅展示支持视频类分析的算法；清空选择后，下方算法参数区随之清空。"
        },
        {
          "label": "告警推送",
          "value": "地址可多选，保存后回写到新建任务页；地址池支持测试、编辑、删除和新增。"
        },
        {
          "label": "推送内容",
          "value": "新建地址时可选择结果数据、原始图片、绘制结果数据、告警视频片段，并可定义自定义 JSON。"
        },
        {
          "label": "分析算法配置",
          "value": "已选算法会生成独立标签页，可配置版本、分析周期和闲时分析等参数。"
        }
      ],
      "rules": [
        "提交任务前必须填写任务名称、至少选择一个算法并至少绑定一个分析点位。",
        "算法选择弹窗取消时不影响当前页面已保存选择。",
        "地址选择弹窗保存后才正式回写到任务表单。",
        "新建地址时推送名称和推送地址为必填项。"
      ],
      "interactions": [
        "点击选择算法后，在左右列表中增删算法并保存，已选算法标签支持直接移除。",
        "点击选择地址后，在地址列表中勾选需要推送的平台，也可以继续新建地址，已选平台标签支持直接移除。",
        "时间范围在选择长期后自动禁用日期输入。",
        "点击全天候或工作日计划会打开时间计划弹窗，支持新建和删除自定义计划。",
        "点击复制至其他算法会弹出当前已选算法列表，并可将当前时间计划复制到一个或多个算法。",
        "分析点位支持从视图源接入设备中添加，列表内支持预览、编辑和删除。",
        "已选算法变化会联动下方算法参数标签页。"
      ],
      "exceptions": [
        "若未选择任何算法或点位直接提交，需要阻止提交并提示。",
        "删除地址池条目后，如果当前任务已选该地址，需要同步移除。",
        "若自定义推送结果为空，仍允许保存地址，但表示只使用勾选内容。"
      ],
      "pending": [
        "待确认后续是否补充 ROI 编辑、相似度阈值和批量复制算法参数能力。",
        "待确认后续是否增加推送地址联通性真实检测。"
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
          "previewImage": "images/177366061970.png"
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
          "previewImage": "images/177366061970.png"
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
          "previewImage": "images/177366061970.png"
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
        "previewImage": "images/177366061970.png"
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
  "styleSource": "resources/css/pages/stream-task-create.css"
});

