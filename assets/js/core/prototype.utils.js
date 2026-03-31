(function () {
  window.PROTOTYPE_UTILS = {
    applyTemplate: applyTemplate,
    normalize: normalize,
    escapeHtml: escapeHtml,
    escapeAttribute: escapeAttribute,
    buildChartPath: buildChartPath
  };

  function applyTemplate(template, row) {
    return String(template).replace(/\{\{(.*?)\}\}/g, function (_, key) {
      return row[key.trim()] == null ? "" : row[key.trim()];
    });
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
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

  function buildChartPath(points) {
    const values = Array.isArray(points) ? points : [];
    if (!values.length) {
      return "";
    }

    const width = 1000;
    const height = 320;
    const max = Math.max.apply(null, values);
    const min = Math.min.apply(null, values);
    const range = Math.max(max - min, 1);

    return values.map(function (value, index) {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 20);
      return (index === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
    }).join(" ");
  }
})();
