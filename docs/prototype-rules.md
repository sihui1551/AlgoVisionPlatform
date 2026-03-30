# 原型项目规则

本文档是当前仓库的主规则说明，适用于已经完成去 Axure 运行时改造后的静态原型结构。

## 1. 项目目标

当前项目定位为：

- 可本地直接打开的多页面原型
- 不依赖后端服务的静态演示站点
- 目录和路径规则可直接迁移到 GitLab Pages
- 页面内容通过配置、页面定义和局部样式分层维护

## 2. 目录规则

统一使用以下目录约定：

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

说明：

- `index.html` 是站点入口页，只负责提供默认跳转入口和页面索引
- `pages/*.html` 是每个业务页面的真实访问入口
- `assets/js/config/` 只放配置
- `assets/js/core/` 只放运行时框架能力
- `assets/js/pages/` 只放页面定义和页面特有交互
- `assets/css/pages/` 只放页面局部样式

## 3. 路径规则

统一使用相对路径，避免后续 GitLab Pages 子路径部署失败：

- `index.html` 跳转页面时使用 `./pages/<page>.html`
- `pages/*.html` 引用静态资源时使用 `../assets/...`
- `pageRegistry.file` 使用相对于 `pages/` 目录的文件名，例如 `dashboard.html`
- `pageRegistry.source` 使用相对于 `pages/` 目录的脚本路径，例如 `../assets/js/pages/dashboard.page.js`
- 页面局部样式 `styleSource` 使用相对于 `pages/` 目录的样式路径，例如 `../assets/css/pages/dashboard.css`

禁止项：

- 禁止使用 `/assets/...` 这类根路径
- 禁止重新引入 `data/document.js`、`files/*`、`resources/scripts/axure/*`

## 4. 分层职责

### 4.1 配置层

`assets/js/config/prototype.config.js` 负责：

- 产品名称和基础信息
- 左侧导航结构
- 默认页面
- 页面注册表 `pageRegistry`

### 4.2 运行时层

`assets/js/core/` 负责：

- 页面脚本动态加载
- 页面样式动态挂载
- 页面壳渲染
- dashboard / table 通用渲染
- mock 存储
- 启动装配

### 4.3 页面层

`assets/js/pages/*.page.js` 负责：

- 页面文案
- 页面结构数据
- 页面特有交互
- 页面 mock seed

### 4.4 样式层

- `assets/css/prototype.css` 负责共享样式入口
- `assets/css/prototype.*.css` 负责共享样式分层
- `assets/css/pages/*.css` 负责页面局部样式

## 5. 页面类型

当前页面优先复用两类通用页面能力：

- `dashboard`
- `table`

新增页面时，优先在这两类里表达；只有无法承载时，才扩展新的 `kind`。

## 6. 新增页面流程

建议固定按下面顺序执行：

1. 先判断页面属于 `dashboard` 还是 `table`
2. 从 `templates/page/dashboard` 或 `templates/page/table` 复制模板
3. 生成 `pages/<page>.html`
4. 新增 `assets/js/pages/<page>.page.js`
5. 新增 `assets/css/pages/<page>.css`
6. 在 `assets/js/config/prototype.config.js` 中补充 `pageRegistry`
7. 在 `navigation` 中补充菜单项
8. 执行 `node .\\tools\\generate-ai-pages.js`，同步页面入口壳和 `docs/page-list.md`
9. 本地打开页面验证脚本、样式和跳转

## 7. 模板规则

模板目录当前只保留静态结构所需文件：

- `page.html.template`
- `page.page.js.template`
- `page.css.template`

新增页面不再生成以下内容：

- `data/document.js`
- `files/<page>/data.js`
- `files/<page>/styles.css`
- Axure 运行时脚本引用

## 8. 文档规则

`docs/` 目录职责：

- `prototype-rules.md`：架构和开发规则
- `style-guide.md`：视觉规范
- `page-list.md`：页面入口与资源映射
- `change-log.md`：变更记录

如果文档与代码冲突，以代码为准并更新文档。

## 9. 发布规则

当前发布规则如下：

- GitLab Pages 构建入口为 `tools/build-pages.js`
- 构建产物目录固定为 `public/`
- `public/` 中至少包含 `index.html`、`pages/`、`assets/`、`docs/`
- `.gitlab-ci.yml` 只负责调用构建脚本，不再在 CI 中散落复制逻辑

构建脚本执行顺序：

1. 先执行 `tools/generate-ai-pages.js`
2. 再复制站点所需目录到 `public/`
3. 最后校验关键 HTML、脚本和样式是否存在

## 10. 清理结果

当前仓库主结构中，以下 Axure 兼容遗留资产已经移除：

- `data/`
- `files/`
- `plugins/`
- `resources/`
- `start.html`
- `start_c_1.html`
- `start_with_pages.html`

这意味着后续新增页面、维护页面和部署页面时，都应只围绕 `index.html`、`pages/`、`assets/`、`docs/`、`tools/` 这套结构工作。
