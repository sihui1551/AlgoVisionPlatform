# AlgoVision Platform Prototype

当前项目已经从 Axure 导出包结构收敛为纯静态多页面原型，目标是让页面可以直接本地打开，并为后续 GitLab Pages 部署做好目录和路径准备。

## 当前目录

```text
.
├─ index.html
├─ pages/
├─ assets/
│  ├─ css/
│  ├─ js/
│  │  ├─ config/
│  │  ├─ core/
│  │  └─ pages/
│  └─ images/
├─ docs/
└─ tools/
```

## 页面约定

- 根入口使用 `index.html`
- 业务页面入口统一放在 `pages/*.html`
- 页面共享配置位于 `assets/js/config/prototype.config.js`
- 页面定义位于 `assets/js/pages/*.page.js`
- 页面局部样式位于 `assets/css/pages/*.css`

## 本地预览

直接在浏览器中打开以下文件即可：

- `index.html`
- `pages/dashboard.html`

如果新增或修改了 `pageRegistry`，执行下面命令同步页面入口壳和页面清单：

```powershell
node .\tools\generate-ai-pages.js
```

## 构建发布产物

如果要生成 GitLab Pages 所需的 `public/` 目录，执行：

```powershell
node .\tools\build-pages.js
```

该脚本会执行以下动作：

- 先同步 `pages/*.html` 页面入口壳
- 再复制 `index.html`、`pages/`、`assets/`、`docs/` 到 `public/`
- 最后校验关键入口和页面资源是否存在

GitLab CI 会直接复用这套构建脚本。

## 文档索引

- `docs/prototype-rules.md`：当前原型项目的架构与开发规则
- `docs/page-list.md`：当前页面入口、脚本和样式映射
- `docs/change-log.md`：本轮架构调整记录

## 当前状态

- 任务 1-3 已落地：目录重构、页面去 Axure 化、配置和路由收敛
- 任务 4 已落地：已新增 `tools/build-pages.js` 和 `.gitlab-ci.yml`，待 GitLab CI 实际跑通后完成线上验证
- 任务 5 已完成：旧 Axure 兼容目录、`start*.html` 和历史导出运行时已从仓库主结构移除
