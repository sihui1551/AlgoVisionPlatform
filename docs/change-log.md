# 变更记录

## 2026-03-25 架构调整第一阶段

本轮变更聚焦“去 Axure 运行时依赖 + 收敛为静态多页面结构”，已完成以下内容：

- 将业务页面入口统一迁移到 `pages/`
- 将共享脚本、样式、图片迁移到 `assets/`
- 将 `doc/` 目录统一调整为 `docs/`
- 重写 `pages/*.html` 页面壳，移除 `data/document.js`、`files/*`、`resources/scripts/axure/*` 等运行时依赖
- 更新 `assets/js/config/prototype.config.js`，使页面注册表和导航指向新结构
- 更新模板目录，新增页面不再生成 Axure 兼容产物
- 重写 `tools/generate-ai-pages.js`，用于同步 `pages/*.html` 页面入口壳和 `docs/page-list.md`
- 新增 `tools/build-pages.js`，统一生成 `public/` 构建产物并校验关键页面资源
- 新增 `.gitlab-ci.yml`，接入 GitLab Pages 发布作业
- 新增 `README.md`、`docs/page-list.md`、`docs/prototype-rules.md`
- 删除旧 Axure 兼容遗留目录：`data/`、`files/`、`plugins/`、`resources/` 和 `start*.html`

## 暂缓项

当前暂无新的暂缓项。
