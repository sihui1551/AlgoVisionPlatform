(function () {
  const titleNode = document.getElementById("doc-preview-title");
  const pathNode = document.getElementById("doc-preview-path");
  const contentNode = document.getElementById("doc-preview-content");
  const docs = window.PROTOTYPE_DOCS || {};
  const params = new URLSearchParams(window.location.search || "");
  const requestedFile = String(params.get("file") || "").trim();
  const requestedTitle = String(params.get("title") || "").trim();
  const safeFile = normalizeDocFile(requestedFile);

  if (!safeFile) {
    renderError("缺少有效文档参数", "当前链接未提供可预览的 Markdown 文档。");
    return;
  }

  const docEntry = docs[safeFile];

  if (!docEntry || typeof docEntry.content !== "string") {
    renderError("文档加载失败", "未能读取当前文档，请检查文件是否存在。");
    return;
  }

  const pageTitle = requestedTitle || docEntry.title || deriveTitle(safeFile);
  titleNode.textContent = pageTitle;
  pathNode.textContent = "docs/" + safeFile;
  document.title = pageTitle + " - 文档预览";
  contentNode.innerHTML = renderMarkdown(docEntry.content);

  function renderError(title, message) {
    titleNode.textContent = title;
    contentNode.innerHTML =
      '<div class="doc-preview__error">' +
      '<h2>' + escapeHtml(title) + "</h2>" +
      '<p>' + escapeHtml(message) + "</p>" +
      "</div>";
  }

  function normalizeDocFile(file) {
    if (!/^[a-zA-Z0-9._-]+\.md$/.test(file)) {
      return "";
    }

    return file;
  }

  function deriveTitle(file) {
    return file.replace(/\.md$/i, "").replace(/[-_]+/g, " ");
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").replace(/\r/g, "").split("\n");
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (!line.trim()) {
        i += 1;
        continue;
      }

      if (/^```/.test(line.trim())) {
        const language = line.trim().slice(3).trim();
        const codeLines = [];
        i += 1;
        while (i < lines.length && !/^```/.test(lines[i].trim())) {
          codeLines.push(lines[i]);
          i += 1;
        }
        if (i < lines.length) {
          i += 1;
        }
        blocks.push(
          '<pre class="md-code"><code' +
          (language ? ' data-lang="' + escapeAttribute(language) + '"' : "") +
          ">" + escapeHtml(codeLines.join("\n")) + "</code></pre>"
        );
        continue;
      }

      if (isTableStart(lines, i)) {
        const tableLines = [lines[i], lines[i + 1]];
        i += 2;
        while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
          tableLines.push(lines[i]);
          i += 1;
        }
        blocks.push(renderTable(tableLines));
        continue;
      }

      if (/^#{1,6}\s+/.test(line)) {
        const level = Math.min(6, (line.match(/^#+/) || ["#"])[0].length);
        const text = line.replace(/^#{1,6}\s+/, "");
        blocks.push("<h" + level + ">" + renderInline(text) + "</h" + level + ">");
        i += 1;
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*]\s+/, ""));
          i += 1;
        }
        blocks.push("<ul>" + items.map(function (item) {
          return "<li>" + renderInline(item) + "</li>";
        }).join("") + "</ul>");
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s+/, ""));
          i += 1;
        }
        blocks.push("<ol>" + items.map(function (item) {
          return "<li>" + renderInline(item) + "</li>";
        }).join("") + "</ol>");
        continue;
      }

      const paragraph = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^#{1,6}\s+/.test(lines[i]) &&
        !/^[-*]\s+/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i]) &&
        !/^```/.test(lines[i].trim()) &&
        !isTableStart(lines, i)
      ) {
        paragraph.push(lines[i].trim());
        i += 1;
      }
      blocks.push("<p>" + renderInline(paragraph.join(" ")) + "</p>");
    }

    return blocks.join("");
  }

  function isTableStart(lines, index) {
    if (index + 1 >= lines.length) {
      return false;
    }

    return /^\|.*\|$/.test(lines[index].trim()) && /^\|\s*[-:| ]+\|$/.test(lines[index + 1].trim());
  }

  function renderTable(lines) {
    const rows = lines.map(function (line) {
      return splitTableRow(line);
    });
    const header = rows[0];
    const body = rows.slice(2);

    return (
      '<div class="md-table-wrap"><table class="md-table">' +
      "<thead><tr>" +
      header.map(function (cell) {
        return "<th>" + renderInline(cell) + "</th>";
      }).join("") +
      "</tr></thead>" +
      "<tbody>" +
      body.map(function (row) {
        return "<tr>" + row.map(function (cell) {
          return "<td>" + renderInline(cell) + "</td>";
        }).join("") + "</tr>";
      }).join("") +
      "</tbody></table></div>"
    );
  }

  function splitTableRow(line) {
    return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (cell) {
      return cell.trim();
    });
  }

  function renderInline(text) {
    let html = escapeHtml(text);

    html = html.replace(/`([^`]+)`/g, function (_, code) {
      return "<code>" + code + "</code>";
    });

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      const resolved = resolveLink(href);
      return '<a href="' + escapeAttribute(resolved) + '">' + escapeHtml(label) + "</a>";
    });

    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    return html;
  }

  function resolveLink(href) {
    const value = String(href || "").trim();

    if (/\.md$/i.test(value)) {
      const docFile = value.split("/").pop();
      const title = docs[docFile] && docs[docFile].title ? docs[docFile].title : deriveTitle(docFile);
      return "./preview.html?file=" + encodeURIComponent(docFile) + "&title=" + encodeURIComponent(title);
    }

    return value;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
