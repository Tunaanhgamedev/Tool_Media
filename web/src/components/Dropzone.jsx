import React, { useRef } from "react";

export default function Dropzone({
  label,
  multiple = false,
  accept = "audio/*,video/*",
  onFiles,
  selectedFiles = [],
  onClear,
}) {
  const ref = useRef(null);

  function handlePick(e) {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = "";
  }

  function onDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) onFiles(files);
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{
        border: "1px dashed rgba(255,255,255,.25)",
        borderRadius: 16,
        padding: 14,
        background: "rgba(255,255,255,.04)",
      }}
    >
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800 }}>{label}</div>
          <div className="small">Kéo thả file vào đây hoặc bấm chọn</div>
        </div>
        <div className="row">
          {onClear && selectedFiles.length > 0 && (
            <button className="btn secondary" onClick={onClear}>
              Xóa file
            </button>
          )}
          <button className="btn secondary" onClick={() => ref.current?.click()}>
            Chọn file
          </button>
        </div>
      </div>

      {/* hiển thị file đã chọn */}
      {!!selectedFiles.length && (
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {selectedFiles.map((f, idx) => (
            <span key={idx} className="pill" title={f.name}>
              {f.name} · {(f.size / 1024 / 1024).toFixed(1)} MB
            </span>
          ))}
        </div>
      )}

      <input
        ref={ref}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handlePick}
        style={{ display: "none" }}
      />
    </div>
  );
}
