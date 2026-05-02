import React, { useMemo, useState, useEffect } from "react";
import Dropzone from "../components/Dropzone.jsx";
import ClipList from "../components/ClipList.jsx";
import ProgressModal from "../components/ProgressModal.jsx";
import { createMergeJob, getJob } from "../api";

function makeClip(file) {
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    type: file.type.includes("audio") ? "audio" : "video",
  };
}

export default function MergePage() {
  const [clips, setClips] = useState([]);

  // job progress
  const [modalOpen, setModalOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);

  const canMerge = clips.length >= 2;

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

  function removeClip(id) {
    setClips((prev) => prev.filter((c) => c.id !== id));
  }

  const clipTypeHint = useMemo(() => {
    if (!clips.length) return "audio/video";
    return `ưu tiên cùng loại (${clips[0].type}) & cùng codec để nối mượt`;
  }, [clips]);

  async function handleMerge() {
    if (!canMerge) return;
    setModalOpen(true);
    setJob(null);

    const files = clips.map((c) => c.file);
    const id = await createMergeJob({ files });
    setJobId(id);
  }

  return (
    <div className="card">
      <h2>🧩 Nối clip</h2>

      <Dropzone
        label={`Thả nhiều clip để nối (${clipTypeHint})`}
        multiple={true}
        selectedFiles={clips.map((c) => c.file)}
        onFiles={(files) => {
          const newClips = files.map(makeClip);
          setClips((prev) => [...prev, ...newClips]);
        }}
        onClear={() => setClips([])}
      />

      <div className="hr" />

      <ClipList clips={clips} setClips={setClips} onRemove={removeClip} />

      <div className="hr" />

      <div className="row">
        <button className="btn" disabled={!canMerge} onClick={handleMerge}>
          Nối thành 1 file
        </button>
        <button
          className="btn secondary"
          onClick={() => setClips([])}
          disabled={!clips.length}
        >
          Xóa hết
        </button>
      </div>

      <div className="small" style={{ marginTop: 10, opacity: 0.8 }}>
        Lưu ý: MVP nối bằng <code>-c copy</code> (nhanh). File khác codec có thể
        nối lỗi.
      </div>

      <ProgressModal
        open={modalOpen}
        job={job}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
