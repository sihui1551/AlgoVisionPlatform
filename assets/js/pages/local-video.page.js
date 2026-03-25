window.registerPrototypePage({
  key: "local-video",
  styleSource: "../assets/css/pages/local-video.css",
  kind: "table",
  heading: "本地视频",
  subtitle: "管理本地上传的图片和视频记录。",
  tablePanel: {},
  countTextPrefix: "共",
  countTextUnit: "条记录",
  emptyText: "暂无本地视频记录",
  offlineTaskPage: {
    toolbarActions: [
      { label: "+ 添加", action: "add", variant: "local-video-toolbar-add" },
      { label: "批量删除", action: "batch-delete", variant: "local-video-toolbar-delete" }
    ],
    filters: {
      searchPlaceholder: "关键字",
      searchFields: ["recordName", "remark"],
      selects: [{ key: "file-type", field: "fileType", options: [{ value: "", label: "全部" }, { value: "image", label: "图片" }, { value: "video", label: "视频" }] }]
    },
    pageSize: 10,
    tableColumns: [
      { key: "select", label: "", type: "select" },
      { key: "recordName", label: "记录名称", strong: true },
      { key: "fileTypeLabel", label: "文件类型", type: "status", toneField: "fileTypeTone", labelField: "fileTypeLabel" },
      { key: "fileCount", label: "文件数量" },
      { key: "remark", label: "备注" },
      { key: "createdAt", label: "创建时间" },
      { key: "actions", label: "操作" }
    ],
    rows: [
      { id: "local-video-001", recordName: "测试设备2", fileType: "image", fileTypeTone: "file-image", fileTypeLabel: "图片", fileCount: "5", remark: "--", createdAt: "2026-03-09 17:16:13", actionItems: [{ label: "预览", className: "local-video-action local-video-action-preview" }, { label: "删除", className: "local-video-action local-video-action-delete" }] },
      { id: "local-video-002", recordName: "测试设备1", fileType: "video", fileTypeTone: "file-video", fileTypeLabel: "视频", fileCount: "2", remark: "--", createdAt: "2026-03-09 17:14:46", actionItems: [{ label: "预览", className: "local-video-action local-video-action-preview" }, { label: "删除", className: "local-video-action local-video-action-delete" }] }
    ]
  },
  setup: function (runtime) {
    const page = runtime.page || {};
    const taskPage = page.offlineTaskPage || {};
    const showToast = runtime.showToast || function () {};
    const mockStore = runtime.mockStore;
    const key = page.key || "local-video";
    const selected = Object.create(null);
    const previews = Object.create(null);
    const addDraft = { name: "", type: "video", remark: "", files: [] };
    const pv = { rowId: "", title: "", list: [], active: 0 };
    let observer = null;

    if (!Array.isArray(taskPage.rows)) {
      taskPage.rows = [];
    }
    taskPage.rows.forEach(function (r) {
      if (!Array.isArray(r.actionItems) || !r.actionItems.length) {
        r.actionItems = [{ label: "预览", className: "local-video-action local-video-action-preview" }, { label: "删除", className: "local-video-action local-video-action-delete" }];
      }
      previews[r.id] = r.fileType === "image"
        ? [{ name: "image-1.jpg", kind: "image", url: "", objectUrl: false }]
        : [{ name: "test.mp4", kind: "video", url: "", objectUrl: false }, { name: "video.mp4", kind: "video", url: "", objectUrl: false }];
    });

    const modal = mountModal();
    ensureLabel(key + "-search", "搜索");
    ensureLabel(key + "-filter-file-type", "文件类型");
    refreshDecorate();

    document.addEventListener("click", onClickCapture, true);
    bindModalInputs();
    if (runtime.mountNode) {
      observer = new MutationObserver(function () { requestAnimationFrame(refreshDecorate); });
      observer.observe(runtime.mountNode, { childList: true, subtree: true });
    }

    return function () {
      document.removeEventListener("click", onClickCapture, true);
      if (observer) {
        observer.disconnect();
      }
      Object.keys(previews).forEach(revokePreview);
      if (modal.root && modal.root.parentNode) {
        modal.root.parentNode.removeChild(modal.root);
      }
    };

    function mountModal() {
      const root = document.createElement("div");
      root.className = "local-video-modal-root";
      root.innerHTML =
        '<div class="local-video-modal-backdrop" data-lv="add-mask"></div>' +
        '<section class="local-video-modal local-video-add-modal" data-lv="add">' +
        '<header class="local-video-modal-header"><h3 class="local-video-modal-title">添加本地视频</h3><button class="local-video-modal-close" type="button" data-lv-action="add-close">×</button></header>' +
        '<div class="local-video-modal-body">' +
        '<div class="local-video-form-row"><label class="local-video-form-label required">记录名称</label><div class="local-video-form-value"><input id="lv-name" class="local-video-form-input" type="text" maxlength="40" placeholder="请输入记录名称" /></div></div>' +
        '<div class="local-video-form-row"><label class="local-video-form-label">文件类型</label><div class="local-video-form-value"><label class="local-video-radio"><input id="lv-type-video" type="radio" name="lv-type" value="video" checked /><span>视频</span></label><label class="local-video-radio"><input id="lv-type-image" type="radio" name="lv-type" value="image" /><span>图片</span></label></div></div>' +
        '<div class="local-video-form-row"><label class="local-video-form-label">备注</label><div class="local-video-form-value"><input id="lv-remark" class="local-video-form-input" type="text" maxlength="100" placeholder="备注（可选）" /></div></div>' +
        '<div class="local-video-form-row local-video-form-row-upload"><label class="local-video-form-label">选择文件</label><div class="local-video-form-value"><div id="lv-drop" class="local-video-upload-zone"><div class="local-video-upload-icon">☁</div><div class="local-video-upload-text">将文件拖到此处，或 <button class="local-video-upload-link" type="button" data-lv-action="pick">点击上传</button></div></div><input id="lv-file" class="local-video-file-input" type="file" multiple /><div id="lv-files" class="local-video-file-list"></div><p class="local-video-upload-tip">支持 mp4、webm、ogg 格式，建议单个文件不超过 2GB</p></div></div>' +
        '</div><footer class="local-video-modal-footer"><button class="button-secondary local-video-footer-button" type="button" data-lv-action="add-close">取消</button><button id="lv-ok" class="button local-video-footer-button" type="button" data-lv-action="add-ok" disabled>确定</button></footer></section>' +
        '<div class="local-video-modal-backdrop" data-lv="pv-mask"></div>' +
        '<section class="local-video-modal local-video-preview-modal" data-lv="pv">' +
        '<header class="local-video-modal-header"><h3 id="lv-pv-title" class="local-video-modal-title">预览</h3><button class="local-video-modal-close" type="button" data-lv-action="pv-close">×</button></header>' +
        '<div class="local-video-preview-body"><div class="local-video-preview-stage"><video id="lv-pv-video" class="local-video-preview-video" controls preload="metadata"></video><img id="lv-pv-image" class="local-video-preview-image" alt="预览" /><div id="lv-pv-empty" class="local-video-preview-empty">暂无可播放内容（原型演示）</div></div><div id="lv-pv-list" class="local-video-preview-thumbs"></div></div>' +
        '</section>';
      document.body.appendChild(root);
      return { root: root, addMask: root.querySelector('[data-lv="add-mask"]'), add: root.querySelector('[data-lv="add"]'), name: root.querySelector('#lv-name'), remark: root.querySelector('#lv-remark'), typeVideo: root.querySelector('#lv-type-video'), typeImage: root.querySelector('#lv-type-image'), file: root.querySelector('#lv-file'), files: root.querySelector('#lv-files'), ok: root.querySelector('#lv-ok'), drop: root.querySelector('#lv-drop'), pvMask: root.querySelector('[data-lv="pv-mask"]'), pv: root.querySelector('[data-lv="pv"]'), pvTitle: root.querySelector('#lv-pv-title'), pvVideo: root.querySelector('#lv-pv-video'), pvImage: root.querySelector('#lv-pv-image'), pvEmpty: root.querySelector('#lv-pv-empty'), pvList: root.querySelector('#lv-pv-list') };
    }
    function bindModalInputs() {
      modal.name.addEventListener("input", function () { addDraft.name = modal.name.value.trim(); syncAddOk(); });
      modal.remark.addEventListener("input", function () { addDraft.remark = modal.remark.value.trim(); });
      modal.typeVideo.addEventListener("change", function () { if (modal.typeVideo.checked) { addDraft.type = "video"; modal.file.accept = "video/mp4,video/webm,video/ogg"; } });
      modal.typeImage.addEventListener("change", function () { if (modal.typeImage.checked) { addDraft.type = "image"; modal.file.accept = "image/*"; } });
      modal.file.addEventListener("change", function () { appendFiles(modal.file.files); modal.file.value = ""; });
      modal.drop.addEventListener("dragover", function (e) { e.preventDefault(); modal.drop.classList.add("dragging"); });
      modal.drop.addEventListener("dragleave", function () { modal.drop.classList.remove("dragging"); });
      modal.drop.addEventListener("drop", function (e) { e.preventDefault(); modal.drop.classList.remove("dragging"); appendFiles(e.dataTransfer ? e.dataTransfer.files : []); });
    }

    function onClickCapture(event) {
      const t = event.target;
      if (t.closest(".page-local-video .local-video-toolbar-add")) { eat(event); openAdd(); return; }
      if (t.closest(".page-local-video .local-video-toolbar-delete")) { eat(event); batchDelete(); return; }
      if (t.closest(".page-local-video .local-video-action-preview")) { eat(event); openPreview(rowIdFromBtn(t.closest("button"))); return; }
      if (t.closest(".page-local-video .local-video-action-delete")) { eat(event); const id = rowIdFromBtn(t.closest("button")); if (id) { removeRows([id]); requestRefresh(); showToast("删除成功", "已删除 1 条本地视频记录。"); } return; }
      if (t.closest(".page-local-video .table-row-checkbox")) { eat(event); toggleCheck(t.closest(".table-row-checkbox")); return; }
      if (t.closest('[data-lv-action="pick"]')) { eat(event); modal.file.click(); return; }
      if (t.closest('[data-lv-action="remove-file"]')) { eat(event); const idx = Number(t.closest('button').getAttribute('data-idx')); if (!Number.isNaN(idx)) { addDraft.files.splice(idx, 1); drawFileList(); syncAddOk(); } return; }
      if (t.closest('[data-lv-action="add-ok"]')) { eat(event); submitAdd(); return; }
      if (t.closest('[data-lv-action="add-close"]') || t.closest('[data-lv="add-mask"]')) { eat(event); closeAdd(); return; }
      if (t.closest('[data-lv-action="pv-close"]') || t.closest('[data-lv="pv-mask"]')) { eat(event); closePreview(); return; }
      if (t.closest('[data-lv-thumb]')) { eat(event); pv.active = Number(t.closest('[data-lv-thumb]').getAttribute('data-lv-thumb')); drawPreview(); return; }
    }

    function eat(event) { event.preventDefault(); event.stopPropagation(); }

    function ensureLabel(id, text) {
      const node = document.getElementById(id);
      if (!node || !node.parentNode) { return; }
      if (node.previousElementSibling && node.previousElementSibling.classList.contains("local-video-filter-label")) { return; }
      const label = document.createElement("span");
      label.className = "local-video-filter-label";
      label.textContent = text;
      node.parentNode.insertBefore(label, node);
    }

    function refreshDecorate() {
      const tbody = document.getElementById(key + "-table-body");
      syncBatchBtn();
      if (!tbody) { return; }

      const map = Object.create(null);
      taskPage.rows.forEach(function (r) { const k = (r.recordName || "") + "|" + (r.createdAt || ""); if (!map[k]) { map[k] = []; } map[k].push(r); });
      Array.prototype.forEach.call(tbody.querySelectorAll("tr"), function (tr) {
        const box = tr.querySelector(".table-row-checkbox");
        if (!box || box.classList.contains("table-row-checkbox-head")) { return; }
        const name = tr.querySelector("td:nth-child(2) strong");
        const time = tr.querySelector("td:nth-child(6)");
        const key2 = (name ? name.textContent.trim() : "") + "|" + (time ? time.textContent.trim() : "");
        const list = map[key2] || [];
        const row = list.length ? list.shift() : null;
        const id = row && row.id ? row.id : "";
        if (id) { box.setAttribute("data-row-id", id); }
        setChecked(box, !!selected[id]);
        tr.classList.toggle("row-selected", !!selected[id]);
      });

      const head = document.querySelector(".page-local-video .table-row-checkbox-head");
      if (head) {
        const ids = visibleIds();
        setChecked(head, ids.length > 0 && ids.every(function (id) { return !!selected[id]; }));
      }

      removeToastAttr(".page-local-video .local-video-toolbar-add");
      removeToastAttr(".page-local-video .local-video-toolbar-delete");
      removeToastAttr(".page-local-video .local-video-action-preview");
      removeToastAttr(".page-local-video .local-video-action-delete");
      syncBatchBtn();
    }

    function removeToastAttr(sel) {
      Array.prototype.forEach.call(document.querySelectorAll(sel), function (n) { n.removeAttribute("data-toast-title"); n.removeAttribute("data-toast-message"); });
    }

    function setChecked(node, checked) { node.classList.toggle("checked", !!checked); node.setAttribute("aria-pressed", checked ? "true" : "false"); }

    function toggleCheck(node) {
      if (!node) { return; }
      if (node.classList.contains("table-row-checkbox-head")) {
        const ids = visibleIds();
        const on = !node.classList.contains("checked");
        ids.forEach(function (id) { if (on) { selected[id] = true; } else { delete selected[id]; } });
      } else {
        const id = node.getAttribute("data-row-id") || node.getAttribute("aria-label") || "";
        if (id) { if (selected[id]) { delete selected[id]; } else { selected[id] = true; } }
      }
      refreshDecorate();
    }

    function visibleIds() {
      const ids = [];
      Array.prototype.forEach.call(document.querySelectorAll(".page-local-video #" + key + "-table-body .table-row-checkbox[data-row-id]"), function (n) { const id = n.getAttribute("data-row-id"); if (id) { ids.push(id); } });
      return ids;
    }

    function syncBatchBtn() {
      const btn = document.querySelector(".page-local-video .local-video-toolbar-delete");
      if (!btn) { return; }
      const cnt = Object.keys(selected).length;
      btn.textContent = cnt ? "批量删除(" + cnt + ")" : "批量删除";
      btn.disabled = cnt === 0;
      if (cnt) { btn.removeAttribute("aria-disabled"); btn.classList.add("is-active"); } else { btn.setAttribute("aria-disabled", "true"); btn.classList.remove("is-active"); }
    }

    function rowIdFromBtn(btn) {
      if (!btn) { return ""; }
      const tr = btn.closest("tr");
      if (!tr) { return ""; }
      const box = tr.querySelector(".table-row-checkbox[data-row-id]");
      return box ? (box.getAttribute("data-row-id") || "") : "";
    }
    function removeRows(ids) {
      const idMap = Object.create(null);
      ids.forEach(function (id) { idMap[id] = true; });
      const next = [];
      taskPage.rows.forEach(function (r) { if (idMap[r.id]) { revokePreview(r.id); } else { next.push(r); } });
      taskPage.rows = next;
      page.offlineTaskPage.rows = next;
      saveRows();
    }

    function batchDelete() {
      const ids = Object.keys(selected);
      if (!ids.length) { showToast("请先选择", "请至少勾选一条记录再执行批量删除。"); return; }
      removeRows(ids);
      ids.forEach(function (id) { delete selected[id]; });
      requestRefresh();
      showToast("删除成功", "已删除 " + ids.length + " 条本地视频记录。");
    }

    function requestRefresh() {
      const q = document.getElementById(key + "-query");
      if (q) { q.click(); return; }
      const s = document.getElementById(key + "-search");
      if (s) { s.dispatchEvent(new Event("input", { bubbles: true })); }
    }

    function saveRows() {
      if (!mockStore || typeof mockStore.patchPage !== "function") { return; }
      mockStore.patchPage(key, { offlineTaskPage: { rows: taskPage.rows } });
    }

    function openAdd() {
      addDraft.name = ""; addDraft.type = "video"; addDraft.remark = ""; addDraft.files = [];
      modal.name.value = ""; modal.remark.value = ""; modal.typeVideo.checked = true; modal.typeImage.checked = false; modal.file.accept = "video/mp4,video/webm,video/ogg";
      drawFileList(); syncAddOk();
      modal.addMask.classList.add("visible"); modal.add.classList.add("visible"); document.body.classList.add("local-video-modal-open"); modal.name.focus();
    }

    function closeAdd() { modal.addMask.classList.remove("visible"); modal.add.classList.remove("visible"); document.body.classList.remove("local-video-modal-open"); }

    function appendFiles(fileList) {
      const arr = Array.prototype.slice.call(fileList || []).filter(Boolean);
      if (!arr.length) { return; }
      addDraft.files = addDraft.files.concat(arr);
      drawFileList(); syncAddOk();
    }

    function drawFileList() {
      if (!addDraft.files.length) { modal.files.innerHTML = ""; return; }
      modal.files.innerHTML = addDraft.files.map(function (f, i) {
        const sz = f && f.size ? "（" + formatSize(f.size) + "）" : "";
        return '<div class="local-video-file-item"><span class="local-video-file-name">' + esc(f.name || "未命名文件") + esc(sz) + '</span><button class="local-video-file-remove" type="button" data-lv-action="remove-file" data-idx="' + i + '">删除</button></div>';
      }).join("");
    }

    function syncAddOk() { modal.ok.disabled = !(addDraft.name && addDraft.files.length); }

    function submitAdd() {
      addDraft.name = modal.name.value.trim();
      addDraft.remark = modal.remark.value.trim();
      if (!addDraft.name) { showToast("名称必填", "请输入记录名称后再提交。"); return; }
      if (!addDraft.files.length) { showToast("请选择文件", "请至少上传一个文件后再提交。"); return; }
      const id = "local-video-" + Date.now();
      previews[id] = addDraft.files.map(function (f) { const mime = String(f.type || ""); return { name: f.name || "未命名文件", kind: mime.indexOf("image/") === 0 ? "image" : "video", url: URL.createObjectURL(f), objectUrl: true }; });
      taskPage.rows.unshift({
        id: id,
        recordName: addDraft.name,
        fileType: addDraft.type,
        fileTypeTone: addDraft.type === "image" ? "file-image" : "file-video",
        fileTypeLabel: addDraft.type === "image" ? "图片" : "视频",
        fileCount: String(addDraft.files.length),
        remark: addDraft.remark || "--",
        createdAt: formatDateTime(new Date()),
        actionItems: [{ label: "预览", className: "local-video-action local-video-action-preview" }, { label: "删除", className: "local-video-action local-video-action-delete" }]
      });
      page.offlineTaskPage.rows = taskPage.rows;
      saveRows(); closeAdd(); requestRefresh(); showToast("添加成功", "已新增 1 条本地视频记录。");
    }

    function openPreview(id) {
      if (!id) { return; }
      const row = taskPage.rows.find(function (r) { return r.id === id; });
      if (!row) { showToast("记录不存在", "当前记录已失效，请刷新后重试。"); return; }
      pv.rowId = id;
      pv.title = row.recordName || "本地视频预览";
      pv.list = Array.isArray(previews[id]) && previews[id].length ? previews[id] : (row.fileType === "image" ? [{ name: "image-1.jpg", kind: "image", url: "", objectUrl: false }] : [{ name: "test.mp4", kind: "video", url: "", objectUrl: false }]);
      pv.active = 0;
      modal.pvTitle.textContent = pv.title;
      drawPreview();
      modal.pvMask.classList.add("visible"); modal.pv.classList.add("visible"); document.body.classList.add("local-video-modal-open");
    }

    function closePreview() {
      modal.pvMask.classList.remove("visible"); modal.pv.classList.remove("visible");
      modal.pvVideo.pause(); modal.pvVideo.removeAttribute("src"); modal.pvVideo.load();
      document.body.classList.remove("local-video-modal-open");
    }

    function drawPreview() {
      modal.pvList.innerHTML = pv.list.map(function (it, i) {
        return '<button class="local-video-thumb' + (i === pv.active ? ' active' : '') + '" type="button" data-lv-thumb="' + i + '"><span class="local-video-thumb-icon">' + (it.kind === 'image' ? '图' : '视') + '</span><span class="local-video-thumb-name">' + esc(it.name || '未命名') + '</span></button>';
      }).join('');
      modal.pvVideo.style.display = 'none'; modal.pvImage.style.display = 'none'; modal.pvEmpty.style.display = 'none';
      const item = pv.list[pv.active] || null;
      if (!item) { modal.pvEmpty.style.display = 'flex'; return; }
      if (item.kind === 'image' && item.url) { modal.pvImage.src = item.url; modal.pvImage.style.display = 'block'; return; }
      if (item.kind === 'video' && item.url) { modal.pvVideo.src = item.url; modal.pvVideo.style.display = 'block'; return; }
      if (item.kind === 'video') { modal.pvVideo.removeAttribute('src'); modal.pvVideo.load(); modal.pvVideo.style.display = 'block'; }
      modal.pvEmpty.style.display = 'flex';
    }

    function revokePreview(id) {
      const list = previews[id];
      if (!Array.isArray(list)) { return; }
      list.forEach(function (it) { if (it && it.objectUrl && it.url) { URL.revokeObjectURL(it.url); } });
      delete previews[id];
    }
  }
});

function formatDateTime(d) {
  return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds());
}

function p2(n) { return n < 10 ? '0' + n : String(n); }

function formatSize(bytes) {
  if (bytes < 1024) { return bytes + 'B'; }
  if (bytes < 1024 * 1024) { return (bytes / 1024).toFixed(1) + 'KB'; }
  if (bytes < 1024 * 1024 * 1024) { return (bytes / (1024 * 1024)).toFixed(1) + 'MB'; }
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
}

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
