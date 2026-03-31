# 页面清单

当前页面入口统一位于 `pages/` 目录，页面逻辑位于 `assets/js/pages/`，局部样式位于 `assets/css/pages/`。

| 页面 Key | 页面标题 | HTML 入口 | 页面脚本 | 页面样式 |
| --- | --- | --- | --- | --- |
| `access-source` | 接入源管理 | `pages/access-source.html` | `assets/js/pages/access-source.page.js` | `assets/css/pages/access-source.css` |
| `algorithm-management` | 算法管理 | `pages/algorithm-management.html` | `assets/js/pages/algorithm-management.page.js` | `assets/css/pages/algorithm-management.css` |
| `cloud-record` | 云端录像 | `pages/cloud-record.html` | `assets/js/pages/cloud-record.page.js` | `assets/css/pages/cloud-record.css` |
| `dashboard` | 仪表盘 | `pages/dashboard.html` | `assets/js/pages/dashboard.page.js` | `assets/css/pages/dashboard.css` |
| `gb-channel-edit` | 编辑通道 | `pages/gb-channel-edit.html` | `assets/js/pages/gb-channel-form.page.js` | `assets/css/pages/gb-channel-form.css` |
| `gb-channel-list` | 通道列表 | `pages/gb-channel-list.html` | `assets/js/pages/gb-channel-list.page.js` | `assets/css/pages/gb-channel-list.css` |
| `gb-device-create` | 新增设备 | `pages/gb-device-create.html` | `assets/js/pages/gb-device-form.page.js` | `assets/css/pages/gb-device-form.css` |
| `gb-device-edit` | 设备编辑 | `pages/gb-device-edit.html` | `assets/js/pages/gb-device-form.page.js` | `assets/css/pages/gb-device-form.css` |
| `image-analysis` | 图片分析 | `pages/image-analysis.html` | `assets/js/pages/image-analysis.page.js` | `assets/css/pages/image-analysis.css` |
| `image-task-create` | 新建任务 | `pages/image-task-create.html` | `assets/js/pages/image-task-create.page.js` | `assets/css/pages/image-task-create.css` |
| `local-video` | 本地视频 | `pages/local-video.html` | `assets/js/pages/local-video.page.js` | `assets/css/pages/local-video.css` |
| `offline-analysis` | 离线视图分析 | `pages/offline-analysis.html` | `assets/js/pages/offline-analysis.page.js` | `assets/css/pages/offline-analysis.css` |
| `offline-task-create` | 新建离线视图分析任务 | `pages/offline-task-create.html` | `assets/js/pages/offline-task-create.page.js` | `assets/css/pages/offline-task-create.css` |
| `platform-config` | 平台配置 | `pages/platform-config.html` | `assets/js/pages/platform-config.page.js` | `assets/css/pages/platform-config.css` |
| `spec-management` | 规格管理 | `pages/spec-management.html` | `assets/js/pages/spec-management.page.js` | `assets/css/pages/spec-management.css` |
| `stream-analysis` | 视频流分析 | `pages/stream-analysis.html` | `assets/js/pages/stream-analysis.page.js` | `assets/css/pages/stream-analysis.css` |
| `stream-proxy-create` | 新增代理拉流 | `pages/stream-proxy-create.html` | `assets/js/pages/stream-proxy-edit.page.js` | `assets/css/pages/stream-proxy-create.css` |
| `stream-proxy-edit` | 编辑拉流代理信息 | `pages/stream-proxy-edit.html` | `assets/js/pages/stream-proxy-edit.page.js` | `assets/css/pages/stream-proxy-edit.css` |
| `stream-task-create` | 新建任务 | `pages/stream-task-create.html` | `assets/js/pages/stream-task-create.page.js` | `assets/css/pages/stream-task-create.css` |

## 维护约定

- 新增页面时，先在 `assets/js/config/prototype.config.js` 中补充 `pageRegistry` 和 `navigation`。
- 页面入口 HTML 统一通过 `node tools/generate-ai-pages.js` 同步，不再手写 Axure 页面壳。
- 所有页面资源路径保持相对路径，确保后续 GitLab Pages 子路径部署可用。
