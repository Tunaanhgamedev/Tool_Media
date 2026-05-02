import React from "react";
import { API_BASE } from "../api";

export default function ProgressModal({ open, job, onClose }) {
  if (!open) return null;

  const pct = job?.progress ?? 0;
  const done = job?.status === "done";
  const err = job?.status === "error";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        zIndex: 50,
      }}
    >
      <div className="card" style={{ width: "min(560px, 100%)" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>Đang xử lý</h2>
          <button className="btn secondary" onClick={onClose}>
            Đóng
          </button>
        </div>

        <div className="hr" />

        <div className="small" style={{ marginBottom: 10 }}>
          {job?.message || "..."}
        </div>

        <div
          style={{
            height: 12,
            borderRadius: 999,
            background: "rgba(255,255,255,.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "#6d7bff",
            }}
          />
        </div>

        <div
          className="row"
          style={{ justifyContent: "space-between", marginTop: 10 }}
        >
          <span className="pill">{pct}%</span>
          <span className="small">{job?.status}</span>
        </div>

        {done && job?.downloadUrl && (
          <>
            <div className="hr" />
            <a
              className="btn"
              href={`${API_BASE}${job.downloadUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              Tải file kết quả
            </a>
          </>
        )}

        {err && (
          <>
            <div className="hr" />
            <div style={{ color: "#ffd2d2" }} className="small">
              Lỗi: {job?.error || "Unknown"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
