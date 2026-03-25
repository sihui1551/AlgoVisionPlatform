# 架构调整实施计划（去 Axure 并支持 GitLab Pages）

## 1. 背景与目标

当前项目仍包含大量 Axure 运行时依赖（`resources/scripts/axure/*`、`start*.html`、`data/document.js`、`files/*` 等），不利于标准静态站点部署与长期维护。

本次调整目标：

- 完全剔除 Axure 运行时与播放器依赖。
- 保留现有 `prototype.*` 渲染架构，改造成纯静态 MPA（多页面应用）。
- 满足 GitLab Pages 一键部署要求（CI 产物为 `public/`）。

---

## 2. 目标架构

采用“纯静态 MPA + 轻量发布脚本”：

- 页面入口：每个页面一个 HTML，只保留 `PROTOTYPE_PAGE_KEY` + `prototype.*` 脚本。
- 路由来源：`resources/scripts/prototype.config.js` 的 `pageRegistry` 作为唯一页面注册表。
- 发布产物：CI 生成 `public/` 并由 GitLab Pages 托管。
- 仓库根目录直接作为项目根目录，不再额外包一层 `prototype-project/` 目录。

建议结构：

```text
/
  docs/
  pages/
    dashboard.html
    device-list.html
    device-detail.html
    rule-config.html
  assets/
    css/
    images/
    js/
      config/
      core/
      pages/
  tools/
    build-pages.js
  .gitlab-ci.yml
  index.html
```

路径约定：

- `index.html` 跳转业务页时使用 `./pages/dashboard.html`
- `pages/*.html` 引用静态资源时使用 `../assets/...`
- `pages/*.html` 之间互相跳转时优先使用相对路径，如 `./device-list.html`

---

## 3. 实施步骤（按任务拆分）

### 任务 1：目录重构与入口规范化

目标：

- 将业务页面入口统一迁移至 `pages/` 目录，并完成静态资源目录标准化。

变更内容：

- 新建 `pages/` 目录。
- 将现有业务页面入口文件迁移为 `pages/<业务页面>.html`。
- 新建 `assets/` 目录，承接原有共享样式、脚本和图片。
- 根目录保留 `index.html` 作为站点入口（可用于跳转默认业务页）。
- 将原 `doc/` 目录调整为 `docs/`。

完成标准：

- 业务页访问路径统一为 `pages/*.html`。
- 页面之间跳转不再依赖根目录散落的 HTML 文件。
- 仓库根目录即项目根目录，不再引入额外外层包装目录。

### 任务 2：页面壳去 Axure 化

目标：

- 所有业务页入口去掉 Axure runtime 与播放器耦合。

变更内容：

- 重写 `pages/*.html` 页面壳，仅保留 `PROTOTYPE_PAGE_KEY` + `prototype.*` 脚本链路。
- 移除：`resources/scripts/axure/*`、`data/document.js`、`files/*/data.js`、`resources/scripts/axure/ios.js`。
- 将页面对共享资源的引用切换为 `../assets/...`。

完成标准：

- 页面渲染不依赖 Axure 资源。
- 页面脚本顺序一致且可正常渲染。
- 页面资源路径全部符合 `pages/` 目录下的相对路径规则。

### 任务 3：配置与路由收敛

目标：

- 保证导航、页面注册、文件路径三者一致。

变更内容：

- 更新页面注册配置，统一指向 `pages/<业务页面>.html`。
- 清理无实现导航项或补齐对应页面，消除死链。
- 校验 `defaultPage` 的可达性。
- 梳理 `assets/js/` 下脚本职责：
  - `assets/js/config/` 放配置文件
  - `assets/js/core/` 放通用渲染与运行时
  - `assets/js/pages/` 放页面定义文件

完成标准：

- 导航点击无“页面待补充”提示。
- 任一注册页面都可通过配置路径打开。
- 配置、核心脚本、页面脚本职责分层清晰。

### 任务 4：发布链路改造（GitLab Pages）

目标：

- 项目可通过 GitLab CI 自动发布静态站点。

变更内容：

- 新增 `.gitlab-ci.yml`，配置 `pages` job。
- 新增 `tools/build-pages.js`，生成 `public/` 产物。
- 构建脚本校验 `public/index.html` 和关键静态资源存在。

完成标准：

- Pipeline 成功后可访问 GitLab Pages 地址。
- 站点在项目子路径下资源加载正常（相对路径）。

当前状态：

- 已完成配置落地。
- 已新增 `.gitlab-ci.yml` 和 `tools/build-pages.js`。
- 本地已可生成并校验 `public/` 产物，待 GitLab CI 实际执行后完成线上验证。

### 任务 5：Axure 兼容层清理

目标：

- 删除已不再使用的 Axure 资产，降低维护成本。

变更内容（确认无引用后删除）：

- `start.html`、`start_c_1.html`、`start_with_pages.html`
- `plugins/`
- `resources/scripts/axure/`
- `resources/scripts/player/`
- `data/document.js`
- `files/`

完成标准：

- 全仓无 Axure runtime 引用。
- 删除后页面行为不回归。

当前状态：

- 已完成。
- `data/`、`files/`、`plugins/`、`resources/` 和 `start*.html` 已从仓库主结构移除。

### 任务 6：文档与验收

目标：

- 让后续维护者可按文档独立运行与发布。

变更内容：

- 更新 `README.md`：本地预览、发布流程、回滚方式。
- 更新 `docs/prototype-rules.md`：切换为静态站点规则。
- 执行发布前检查：首页、业务页、刷新、深链、404、资源加载。

完成标准：

- 文档与代码一致。
- 验收清单全部通过后再合并到 `main`。

---

## 4. 风险与规避

风险 1：页面壳改造后出现样式或脚本回归  
规避：先做“兼容改造”，逐页对比回归，再删除 Axure 目录。

风险 2：GitLab Pages 子路径导致资源加载失败  
规避：统一使用相对路径，禁止根路径引用（例如 `/resources/...`）。

风险 3：导航与页面注册漂移造成死链  
规避：在构建脚本中增加一致性校验（`navigation` 必须可解析到 `pageRegistry`）。

风险 4：脚本迁移到 `assets/js/` 后职责混杂，后续维护困难  
规避：从迁移开始就按 `config / core / pages` 三层落位，不保留“全部塞进一个 js 目录”的中间态。

---

## 5. 完成定义（DoD）

满足以下条件视为改造完成：

- 项目运行不依赖 Axure runtime、Axure player、`data/document.js`、`files/*`。
- GitLab CI 可自动生成并发布 `public/`。
- 所有导航项可访问，无“页面待补充”提示。
- 文档与代码结构保持一致，且可指导后续迭代。
- 页面与资源路径规则统一，支持 `pages/` 目录下稳定访问。

---

## 6. 回滚方案

若上线后出现问题，回滚优先级如下：

1. 回滚 `main` 到上一个稳定 tag 或 commit。
2. 恢复旧版页面壳与旧 CI 配置。
3. 临时保留 Axure 兼容目录，待问题修复后再二次切换。
