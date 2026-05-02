import React, { useState, useEffect } from "react";
import Dropzone from "../components/Dropzone.jsx";
import TimelineRange from "../components/TimelineRange.jsx";
import ProgressModal from "../components/ProgressModal.jsx";
import { createCutJob, getJob } from "../api";

function secToTime(sec) {
  const hh = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const ss = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function CutPage() {
  const [cutFile, setCutFile] = useState(null);
  const [fastCopy, setFastCopy] = useState(true);

  // MVP duration 60s (bản nâng cấp sẽ đọc duration thật bằng ffprobe)
  const [durationSec] = useState(60);
  const [range, setRange] = useState([5, 15]);

  // job progress
  const [modalOpen, setModalOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);

  const canCut = !!cutFile && range[1] > range[0];

  useEffect(() => {
    if (!jobId) return;
    let alive = true;

    const tick = async () => {
      try {
        const j = await getJob(jobId);
        if (!alive) return;
        setJob(j);
        if (j.status === "done" || j.status === "error") return;
        setTimeout(tick, 700);
      } catch {
        if (!alive) return;
        setTimeout(tick, 1000);
      }
    };

    tick();
    return () => (alive = false);
  }, [jobId]);

  async function handleCut() {
    if (!canCut) return;
    setModalOpen(true);
    setJob(null);

    const start = secToTime(range[0]);
    const end = secToTime(range[1]);

    const id = await createCutJob({ file: cutFile, start, end, fastCopy });
    setJobId(id);
  }

  function clearCutFile() {
    setCutFile(null);
    // reset range nếu muốn
    // setRange([5, 15]);
  }

  return (
    <div className="card">
      <h2>✂️ Cắt đoạn</h2>

      <Dropzone
        label="Chọn 1 file để cắt"
        multiple={false}
        selectedFiles={cutFile ? [cutFile] : []}
        onFiles={(files) => setCutFile(files[0])}
        onClear={clearCutFile}
      />

      <div className="hr" />

      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="pill">
          {cutFile ? `${cutFile.name} · ${(cutFile.size / 1024 / 1024).toFixed(1)} MB` : "Chưa chọn file"}
        </span>

        <label className="row small" style={{ gap: 8 }}>
          <input type="checkbox" checked={fastCopy} onChange={(e) => setFastCopy(e.target.checked)} />
          Fast copy (nhanh)
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <TimelineRange durationSec={durationSec} values={range} setValues={setRange} />
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn" disabled={!canCut} onClick={handleCut}>
          Cắt ngay
        </button>
        <span className="small">
          Tip: nếu cắt bị “lệch” trên video, tắt Fast copy để cắt chuẩn hơn.
        </span>
      </div>

      <ProgressModal open={modalOpen} job={job} onClose={() => setModalOpen(false)} />
    </div>
  );
}
