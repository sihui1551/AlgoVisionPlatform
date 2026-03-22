# 新增页面模板

此目录提供两套可直接复制的页面模板：

- `dashboard`
- `table`

每套模板都包含：

- `page.html.template`
- `files/data.js.template`
- `files/styles.css.template`
- `page.page.js.template`
- `page.css.template`

## 占位符

复制模板后，统一替换以下占位符：

- `__PAGE_NAME__`
  页面文件名和 `files/<页面>` 目录名，通常用中文页面名
- `__PAGE_KEY__`
  页面模块 key，通常用英文 kebab-case，例如 `customer-list`
- `__PAGE_TITLE__`
  页面主标题
- `__PAGE_PACKAGE_ID__`
  Axure 页面包 id，建议替换为新的 32 位小写十六进制字符串

生成 `__PAGE_PACKAGE_ID__` 的示例：

```powershell
[guid]::NewGuid().ToString("N")
```

## 推荐用法

1. 先选择页面类型模板：`dashboard` 或 `table`
2. 复制模板文件到真实目标位置
3. 替换所有占位符
4. 在 `resources/scripts/prototype.config.js` 中补 `pageRegistry` 和 `navigation`
5. 在 `data/document.js` 中补 sitemap
6. 打开页面验证脚本链路和渲染结果

## 文件落点

模板文件复制后的目标位置如下：

- `page.html.template` -> `__PAGE_NAME__.html`
- `files/data.js.template` -> `files/__PAGE_NAME__/data.js`
- `files/styles.css.template` -> `files/__PAGE_NAME__/styles.css`
- `page.page.js.template` -> `resources/scripts/pages/__PAGE_KEY__.page.js`
- `page.css.template` -> `resources/css/pages/__PAGE_KEY__.css`
