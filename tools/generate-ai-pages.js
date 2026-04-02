const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const pagesRoot = path.join(projectRoot, "pages");
const configPath = process.env.CFG
  ? path.resolve(process.cwd(), process.env.CFG)
  : path.join(projectRoot, "assets", "js", "config", "prototype.config.js");
const docsPageListPath = path.join(projectRoot, "docs", "page-list.md");
const docsConfigPath = path.join(projectRoot, "assets", "js", "config", "docs.config.js");

const runtimeScripts = [
  "../assets/js/config/prototype.config.js",
  "../assets/js/core/prototype.page-loader.js",
  "../assets/js/core/prototype.style-loader.js",
  "../assets/js/core/mock-store.js",
  "../assets/js/core/prototype.utils.js",
  "../assets/js/core/prototype.shell.js",
  "../assets/js/core/prototype.dashboard.js",
  "../assets/js/core/prototype.table.js",
  "../assets/js/core/prototype.components.js",
  "../assets/js/core/prototype.js"
];

function main() {
  const config = loadPrototypeConfig(configPath);
  const pageDefinitions = loadPageDefinitions(config.pageRegistry || {});
  const pageTitleMap = buildPageTitleMap(config);
  const summaryRows = [];
  const warnings = [];

  Object.keys(config.pageRegistry || {}).forEach(function (pageKey) {
    const entry = config.pageRegistry[pageKey];
    const pageDefinition = pageDefinitions[pageKey];
    const title = resolvePageTitle(pageKey, pageDefinition, pageTitleMap);
    const htmlPath = path.join(pagesRoot, entry.file);
    const htmlContent = buildPageHtml(title, pageKey, pageDefinition);

    writeText(htmlPath, htmlContent);

    if (!pageDefinition) {
      warnings.push("Missing page definition for key: " + pageKey);
      return;
    }

    const scriptPath = resolveRuntimePath(entry.source);
    const stylePath = pageDefinition.styleSource ? resolveRuntimePath(pageDefinition.styleSource) : null;

    if (!fs.existsSync(scriptPath)) {
      warnings.push("Missing page script: " + normalizePath(scriptPath));
    }

    if (stylePath && !fs.existsSync(stylePath)) {
      warnings.push("Missing page style: " + normalizePath(stylePath));
    }

    summaryRows.push({
      key: pageKey,
      title: title,
      html: normalizePath(path.relative(projectRoot, htmlPath)),
      script: normalizePath(path.relative(projectRoot, scriptPath)),
      style: stylePath ? normalizePath(path.relative(projectRoot, stylePath)) : "-"
    });
  });

  writeText(docsPageListPath, buildPageListMarkdown(summaryRows));
  writeText(docsConfigPath, buildDocsConfigScript());

  const outputLines = [
    "Synced page shells: " + summaryRows.length,
    "Updated doc: " + normalizePath(path.relative(projectRoot, docsPageListPath)),
    "Updated doc data: " + normalizePath(path.relative(projectRoot, docsConfigPath))
  ];

  if (warnings.length) {
    outputLines.push("Warnings:");
    warnings.forEach(function (warning) {
      outputLines.push(" - " + warning);
    });
  }

  console.log(outputLines.join("\n"));
}

function loadPrototypeConfig(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Config file not found: " + filePath);
  }

  const sandbox = createSandbox();
  runFileInSandbox(filePath, sandbox);

  if (!sandbox.window.PROTOTYPE_CONFIG) {
    throw new Error("window.PROTOTYPE_CONFIG was not found in " + filePath);
  }

  return sandbox.window.PROTOTYPE_CONFIG;
}

function loadPageDefinitions(pageRegistry) {
  const sandbox = createSandbox();
  const pageDefinitions = {};
  const loadedSources = new Set();

  sandbox.window.PROTOTYPE_PAGE_DEFINITIONS = pageDefinitions;
  sandbox.window.registerPrototypePage = function registerPrototypePage(pageDefinition) {
    if (!pageDefinition || !pageDefinition.key) {
      return null;
    }

    pageDefinitions[pageDefinition.key] = pageDefinition;
    return pageDefinition;
  };

  Object.keys(pageRegistry).forEach(function (pageKey) {
    const entry = pageRegistry[pageKey];
    const sourcePath = resolveRuntimePath(entry.source);

    if (!entry.source || loadedSources.has(sourcePath) || !fs.existsSync(sourcePath)) {
      return;
    }

    loadedSources.add(sourcePath);
    runFileInSandbox(sourcePath, sandbox);
  });

  return pageDefinitions;
}

function createSandbox() {
  const sandbox = {
    window: {},
    console: console,
    JSON: JSON,
    Math: Math,
    Date: Date,
    Object: Object,
    Array: Array,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp
  };

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);
  return sandbox;
}

function runFileInSandbox(filePath, sandbox) {
  const code = fs.readFileSync(filePath, "utf8");
  vm.runInContext(code, sandbox, { filename: filePath });
}

function buildPageTitleMap(config) {
  const titleMap = {};

  (config.navigation || []).forEach(function (group) {
    (group.children || []).forEach(function (child) {
      if (child && child.key) {
        titleMap[child.key] = child.label || child.key;
      }
    });
  });

  return titleMap;
}

function resolvePageTitle(pageKey, pageDefinition, pageTitleMap) {
  if (pageDefinition && pageDefinition.heading) {
    return pageDefinition.heading;
  }

  if (pageTitleMap[pageKey]) {
    return pageTitleMap[pageKey];
  }

  return pageKey;
}

function resolveRuntimePath(runtimePath) {
  if (!runtimePath) {
    return "";
  }

  if (path.isAbsolute(runtimePath)) {
    return runtimePath;
  }

  return path.resolve(pagesRoot, runtimePath);
}

function buildPageHtml(title, pageKey, pageDefinition) {
  const scriptTags = runtimeScripts.map(function (source) {
    return '    <script src="' + source + '"></script>';
  }).join("\n");
  const styleTags = buildPageStyleTags(pageDefinition);

  return [
    "<!DOCTYPE html>",
    '<html lang="zh-CN">',
    "  <head>",
    '    <meta charset="utf-8"/>',
    '    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>',
    "    <title>" + escapeHtml(title) + "</title>",
    '    <link href="../assets/css/prototype.css" type="text/css" rel="stylesheet"/>',
    styleTags,
    '    <script type="text/javascript">',
    '      window.PROTOTYPE_PAGE_KEY = "' + escapeJs(pageKey) + '";',
    '      window.PROTOTYPE_ROUTE_MODE = "page";',
    "    </script>",
    "  </head>",
    "  <body>",
    '    <div id="base"></div>',
    scriptTags,
    "  </body>",
    "</html>",
    ""
  ].join("\n");
}

function buildPageStyleTags(pageDefinition) {
  const styleSources = normalizeStyleSources(pageDefinition);

  if (!styleSources.length) {
    return "";
  }

  return styleSources.map(function (source) {
    return '    <link href="' + escapeHtml(source) + '" type="text/css" rel="stylesheet"/>';
  }).join("\n");
}

function normalizeStyleSources(pageDefinition) {
  if (!pageDefinition) {
    return [];
  }

  if (Array.isArray(pageDefinition.styleSources)) {
    return pageDefinition.styleSources.filter(Boolean);
  }

  if (pageDefinition.styleSource) {
    return [pageDefinition.styleSource];
  }

  return [];
}

function buildPageListMarkdown(rows) {
  const lines = [
    "# 页面清单",
    "",
    "当前页面入口统一位于 `pages/` 目录，页面逻辑位于 `assets/js/pages/`，局部样式位于 `assets/css/pages/`。",
    "",
    "| 页面 Key | 页面标题 | HTML 入口 | 页面脚本 | 页面样式 |",
    "| --- | --- | --- | --- | --- |"
  ];

  rows
    .slice()
    .sort(function (left, right) {
      return left.key.localeCompare(right.key);
    })
    .forEach(function (row) {
      lines.push(
        "| `" + row.key + "` | " + row.title + " | `" + row.html + "` | `" + row.script + "` | `" + row.style + "` |"
      );
    });

  lines.push("");
  lines.push("## 维护约定");
  lines.push("");
  lines.push("- 新增页面时，先在 `assets/js/config/prototype.config.js` 中补充 `pageRegistry` 和 `navigation`。");
  lines.push("- 页面入口 HTML 统一通过 `node tools/generate-ai-pages.js` 同步，不再手写 Axure 页面壳。");
  lines.push("- 所有页面资源路径保持相对路径，确保后续 GitLab Pages 子路径部署可用。");
  lines.push("");

  return lines.join("\n");
}

function buildDocsConfigScript() {
  const docsRoot = path.join(projectRoot, "docs");
  const docMap = {};

  fs.readdirSync(docsRoot)
    .filter(function (fileName) {
      return fileName.toLowerCase().endsWith(".md");
    })
    .sort(function (left, right) {
      return left.localeCompare(right);
    })
    .forEach(function (fileName) {
      const content = fs.readFileSync(path.join(docsRoot, fileName), "utf8");
      docMap[fileName] = {
        title: deriveDocTitle(fileName, content),
        content: content
      };
    });

  return [
    "window.PROTOTYPE_DOCS = " + JSON.stringify(docMap, null, 2) + ";",
    ""
  ].join("\n");
}

function deriveDocTitle(fileName, content) {
  const match = String(content || "").match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].trim();
  }

  return fileName.replace(/\.md$/i, "");
}

function writeText(filePath, content) {
  const next = String(content);
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;

  if (current === next) {
    return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, "utf8");
}

function normalizePath(filePath) {
  return String(filePath || "").replace(/\\/g, "/");
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJs(value) {
  return String(value == null ? "" : value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

main();
