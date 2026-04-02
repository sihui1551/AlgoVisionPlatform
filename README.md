# AlgoVision Platform Prototype

静态多页面原型仓库，用于演示 AI 视频算法调度平台的主要业务页面与交互流程。
页面入口、脚本、样式和构建流程都收敛在统一目录中，默认分支为 `main`。

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

目录约定如下：

- `index.html`：站点入口页。
- `pages/*.html`：每个业务页面的实际访问入口。
- `assets/js/config/`：全局配置与页面注册表。
- `assets/js/core/`：运行时框架、通用组件和 mock 能力。
- `assets/js/pages/*.page.js`：页面定义、文案和页面特有交互。
- `assets/css/pages/*.css`：页面局部样式。
- `docs/`：项目规则、页面清单和变更记录。
- `tools/`：页面壳同步与构建脚本。
- `public/`：构建产物目录。

## 当前页面

当前仓库包含以下原型页面：

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

完整映射关系见 [docs/page-list.md](docs/page-list.md)。

## 本地预览

可以直接在浏览器中打开：

- `index.html`
- `pages/dashboard.html`

如果需要更接近线上访问方式，也可以在仓库根目录启一个静态服务器。

## 开发流程

页面开发的基本路径是：

1. 在 `assets/js/config/prototype.config.js` 中补充或更新页面注册信息。
2. 编写 `assets/js/pages/<page>.page.js` 页面定义。
3. 编写 `assets/css/pages/<page>.css` 页面样式。
4. 运行页面壳同步脚本，刷新 `pages/*.html` 与页面清单。

同步命令：

```powershell
node .\tools\generate-ai-pages.js
```

这个脚本会：

- 根据 `pageRegistry` 同步生成 `pages/*.html`
- 校验页面脚本和样式入口是否存在
- 更新 [docs/page-list.md](docs/page-list.md)

## 构建发布

构建命令：

```powershell
node .\tools\build-pages.js
```

构建流程会：

1. 先执行 `tools/generate-ai-pages.js`
2. 重建 `public/`
3. 复制 `index.html`、`pages/`、`assets/`、`docs/` 到 `public/`
4. 校验关键页面和资源是否存在

仓库保留了 `.gitlab-ci.yml`，当前 CI 会直接调用这套构建脚本并发布 `public/`。

## 维护说明

- 页面 HTML 壳不要手工长期维护，优先通过 `generate-ai-pages.js` 回写。
- 页面资源路径统一使用相对路径，避免部署到子路径时失效。
- 文本类文件的行尾规则由 [.gitattributes](.gitattributes) 统一约束，减少 Windows 环境下的伪修改。
- `public/` 是构建产物目录；如果源码有变更，重新构建后再同步产物。

## 相关文档

- [docs/prototype-rules.md](docs/prototype-rules.md)：项目结构与开发约定
- [docs/page-list.md](docs/page-list.md)：页面入口、脚本与样式映射
- [docs/style-guide.md](docs/style-guide.md)：视觉规范
- [docs/change-log.md](docs/change-log.md)：项目变更记录

## 当前状态

- 默认分支已经切换为 `main`
- 当前仓库以 `main` 为主线维护
- 仓库已加入 `.gitattributes`，用于稳定文本文件行尾
- 仪表盘的告警统计已经支持按 `今日`、`本月`、`本年`、`自定日期范围` 切换
