# 新增页面模板

此目录提供两套可直接复制的页面模板：

- `dashboard`
- `table`

每套模板都包含：

- `page.html.template`
- `page.page.js.template`
- `page.css.template`

## 占位符

复制模板后，统一替换以下占位符：

- `__PAGE_NAME__`
  页面标题或展示名称，通常用中文业务名称
- `__PAGE_KEY__`
  页面模块 key，同时也是页面文件名，通常用英文 kebab-case，例如 `customer-list`
- `__PAGE_TITLE__`
  页面主标题

## 推荐用法

1. 先选择页面类型模板：`dashboard` 或 `table`
2. 复制模板文件到真实目标位置
3. 替换所有占位符
4. 在 `assets/js/config/prototype.config.js` 中补 `pageRegistry` 和 `navigation`
5. 打开页面验证脚本链路和渲染结果

## 文件落点

模板文件复制后的目标位置如下：

- `page.html.template` -> `pages/__PAGE_KEY__.html`
- `page.page.js.template` -> `assets/js/pages/__PAGE_KEY__.page.js`
- `page.css.template` -> `assets/css/pages/__PAGE_KEY__.css`
