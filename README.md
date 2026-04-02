# AlgoVision Platform Prototype

AlgoVision Platform Prototype 是一个面向 AI 视频算法调度场景的静态多页面原型项目，用来展示平台首页、接入管理、算法管理、任务管理、事件中心与系统配置等核心产品能力。

这个仓库的目标不是承载真实后端业务，而是提供一套结构清晰、可直接预览、方便持续迭代的产品原型，帮助产品、设计、研发和交付团队在同一套页面语言下协作。

## 产品概览

当前原型覆盖的平台能力包括：

- 仪表盘：展示设备、算法、任务分类、接入方式和告警趋势等全局视图。
- 接入管理：覆盖接入源、本地视频、云端录像、拉流代理等入口配置。
- 算法与任务：展示算法仓库、视频流分析、图片分析、离线分析及任务创建流程。
- 事件中心：聚焦事件列表及后续联动能力。
- 系统管理：提供规格管理、平台配置等基础后台页面。

完整页面映射见 [docs/page-list.md](docs/page-list.md)。

## 适用场景

这个项目适合用于以下场景：

- 产品方案评审和业务流程演示
- 设计稿落地前的交互验证
- 前后端联调前的页面结构对齐
- 交付阶段的原型展示与说明
- 后续正式项目开发前的页面骨架复用

## 项目结构

```text
.
|-- index.html
|-- pages/
|-- assets/
|   |-- css/
|   |-- images/
|   `-- js/
|       |-- config/
|       |-- core/
|       `-- pages/
|-- docs/
|-- tools/
|-- public/
`-- .gitattributes
```

目录职责如下：

- `index.html`：站点入口页。
- `pages/*.html`：页面访问入口。
- `assets/js/config/`：产品配置、导航和页面注册。
- `assets/js/core/`：原型运行时、通用组件和 mock 能力。
- `assets/js/pages/*.page.js`：页面定义、页面数据和特有交互。
- `assets/css/pages/*.css`：页面局部样式。
- `docs/`：规则说明、页面清单与视觉规范。
- `tools/`：页面壳同步和构建脚本。
- `public/`：构建产物目录。

## 当前页面

当前仓库已包含以下页面：

- 仪表盘
- 接入源管理
- 算法管理
- 云端录像
- 事件列表
- 国标通道列表 / 编辑
- 国标设备创建 / 编辑
- 图片分析
- 图片任务创建
- 本地视频
- 离线视图分析
- 离线任务创建
- 平台配置
- 规格管理
- 视频流分析
- 拉流代理创建 / 编辑
- 视频流任务创建

## 本地预览

可以直接在浏览器中打开以下文件进行预览：

- `index.html`
- `pages/dashboard.html`

如果需要更稳定的访问方式，建议在仓库根目录启动一个静态文件服务后再浏览。

## 开发方式

页面开发遵循统一的页面注册和页面壳同步流程：

1. 在 `assets/js/config/prototype.config.js` 中补充或调整页面注册信息。
2. 在 `assets/js/pages/` 中编写对应页面脚本。
3. 在 `assets/css/pages/` 中编写对应页面样式。
4. 运行页面同步脚本，刷新 `pages/*.html` 与页面清单。

同步命令：

```powershell
node .\tools\generate-ai-pages.js
```

这个脚本会完成以下工作：

- 根据 `pageRegistry` 同步生成页面入口壳
- 校验页面脚本和样式入口是否存在
- 更新 [docs/page-list.md](docs/page-list.md)

## 构建方式

构建命令：

```powershell
node .\tools\build-pages.js
```

构建流程包括：

1. 执行 `tools/generate-ai-pages.js`
2. 重建 `public/`
3. 复制 `index.html`、`pages/`、`assets/`、`docs/` 到 `public/`
4. 校验关键页面和资源是否存在

仓库中的 `.gitlab-ci.yml` 会直接复用这套构建流程来发布 `public/`。

## 维护约定

- 页面 HTML 壳优先通过脚本同步，不建议长期手工维护。
- 页面资源统一使用相对路径，确保构建产物在子路径环境下也能正常访问。
- 文本文件行尾由 [.gitattributes](.gitattributes) 统一约束，减少 Windows 环境下的伪修改。
- `public/` 是构建结果，不是主要维护入口；源码有变更后应重新构建。

## 相关文档

- [docs/prototype-rules.md](docs/prototype-rules.md)：项目结构与开发约定
- [docs/page-list.md](docs/page-list.md)：页面入口、脚本与样式映射
- [docs/style-guide.md](docs/style-guide.md)：视觉规范

## 当前状态

- 默认分支为 `main`
- 仓库当前以主线分支持续维护
- 仪表盘告警统计已支持按 `今日`、`本月`、`本年`、`自定日期范围` 切换
- 项目已加入 `.gitattributes` 以稳定文本文件行尾
