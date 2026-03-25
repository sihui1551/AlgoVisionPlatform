const fs = require("fs");
const path = require("path");
const vm = require("vm");
const childProcess = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const pagesRoot = path.join(projectRoot, "pages");
const publicRoot = path.join(projectRoot, "public");
const configPath = path.join(projectRoot, "assets", "js", "config", "prototype.config.js");
const generatePagesScript = path.join(projectRoot, "tools", "generate-ai-pages.js");

main();

function main() {
  syncPageShells();

  const config = loadPrototypeConfig(configPath);
  const pageDefinitions = loadPageDefinitions(config.pageRegistry || {});

  rebuildPublicDirectory();
  copySiteFiles();
  validateBuild(config, pageDefinitions);

  console.log([
    "Pages build completed.",
    "Output: " + normalizePath(publicRoot),
    "Pages copied: " + Object.keys(config.pageRegistry || {}).length
  ].join("\n"));
}

function syncPageShells() {
  childProcess.execFileSync(process.execPath, [generatePagesScript], {
    cwd: projectRoot,
    stdio: "inherit"
  });
}

function rebuildPublicDirectory() {
  fs.rmSync(publicRoot, { recursive: true, force: true });
  fs.mkdirSync(publicRoot, { recursive: true });
}

function copySiteFiles() {
  copyPath(path.join(projectRoot, "index.html"), path.join(publicRoot, "index.html"));
  copyPath(path.join(projectRoot, "pages"), path.join(publicRoot, "pages"));
  copyPath(path.join(projectRoot, "assets"), path.join(publicRoot, "assets"));
  copyPath(path.join(projectRoot, "docs"), path.join(publicRoot, "docs"));
}

function copyPath(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error("Missing required source path: " + normalizePath(sourcePath));
  }

  const stat = fs.statSync(sourcePath);
  if (stat.isDirectory()) {
    fs.cpSync(sourcePath, targetPath, { recursive: true });
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function validateBuild(config, pageDefinitions) {
  [
    path.join(publicRoot, "index.html"),
    path.join(publicRoot, "pages", "dashboard.html"),
    path.join(publicRoot, "assets", "css", "prototype.css"),
    path.join(publicRoot, "assets", "js", "config", "prototype.config.js"),
    path.join(publicRoot, "docs", "page-list.md")
  ].forEach(assertExists);

  Object.keys(config.pageRegistry || {}).forEach(function (pageKey) {
    const entry = config.pageRegistry[pageKey];
    const pageDefinition = pageDefinitions[pageKey];

    if (!entry || !entry.file || !entry.source) {
      throw new Error("Invalid page registry entry: " + pageKey);
    }

    assertExists(path.join(publicRoot, "pages", entry.file));
    assertExists(resolvePublicRuntimePath(entry.source));

    if (pageDefinition && pageDefinition.styleSource) {
      assertExists(resolvePublicRuntimePath(pageDefinition.styleSource));
    }
  });
}

function loadPrototypeConfig(filePath) {
  const sandbox = createSandbox();
  runFileInSandbox(filePath, sandbox);

  if (!sandbox.window.PROTOTYPE_CONFIG) {
    throw new Error("window.PROTOTYPE_CONFIG was not found in " + normalizePath(filePath));
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
    const sourcePath = resolveProjectRuntimePath(entry.source);

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

function resolveProjectRuntimePath(runtimePath) {
  if (!runtimePath) {
    return "";
  }

  if (path.isAbsolute(runtimePath)) {
    return runtimePath;
  }

  return path.resolve(pagesRoot, runtimePath);
}

function resolvePublicRuntimePath(runtimePath) {
  if (!runtimePath) {
    return "";
  }

  return path.join(publicRoot, path.relative(projectRoot, resolveProjectRuntimePath(runtimePath)));
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Missing build artifact: " + normalizePath(filePath));
  }
}

function normalizePath(filePath) {
  return String(filePath || "").replace(/\\/g, "/");
}
