const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { cutMedia, mergeMedia, extFromMime } = require("./ffmpeg");
const { createJob, updateJob, getJob } = require("./jobs");

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const OUTPUT_DIR = path.join(__dirname, "..", "outputs");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 800 * 1024 * 1024 }, // 800MB
});

app.use("/outputs", express.static(OUTPUT_DIR));

app.get("/", (_, res) => res.send("Media tool API is running ✅"));

/**
 * GET /api/job/:id
 */
app.get("/api/job/:id", (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

/**
 * POST /api/cut-job
 * form-data:
 *  - file
 *  - start: "00:00:05"
 *  - end: "00:00:10"
 *  - fastCopy: "true" | "false"
 */
app.post("/api/cut-job", upload.single("file"), async (req, res) => {
  const job = createJob("cut");
  res.json({ ok: true, jobId: job.id });

  // run async (still in-process)
  (async () => {
    try {
      updateJob(job.id, {
        status: "running",
        progress: 0,
        message: "Starting...",
      });

      const file = req.file;
      const { start, end, fastCopy = "true" } = req.body;

      if (!file) throw new Error("Missing file");
      if (!start || !end) throw new Error("Missing start/end");

      const outExt =
        path.extname(file.originalname) || extFromMime(file.mimetype);
      const outName = `cut_${Date.now()}${outExt}`;
      const outPath = path.join(OUTPUT_DIR, outName);

      await cutMedia({
        inputPath: file.path,
        outputPath: outPath,
        start,
        end,
        fastCopy: String(fastCopy) === "true",
        onProgress: (pct, msg) =>
          updateJob(job.id, { progress: pct, message: msg }),
      });

      updateJob(job.id, {
        status: "done",
        progress: 100,
        message: "Done",
        downloadUrl: `/outputs/${outName}`,
      });
    } catch (err) {
      updateJob(job.id, {
        status: "error",
        error: String(err.message || err),
        message: "Failed",
      });
    }
  })();
});

/**
 * POST /api/merge-job
 * form-data:
 *  - files (>=2)
 */
app.post("/api/merge-job", upload.array("files", 30), async (req, res) => {
  const job = createJob("merge");
  res.json({ ok: true, jobId: job.id });

  (async () => {
    try {
      updateJob(job.id, {
        status: "running",
        progress: 0,
        message: "Starting...",
      });

      const files = req.files || [];
      if (files.length < 2) throw new Error("Need at least 2 files");

      const first = files[0];
      const outExt =
        path.extname(first.originalname) || extFromMime(first.mimetype);
      const outName = `merge_${Date.now()}${outExt}`;
      const outPath = path.join(OUTPUT_DIR, outName);

      await mergeMedia({
        inputPaths: files.map((f) => f.path),
        outputPath: outPath,
        onProgress: (pct, msg) =>
          updateJob(job.id, { progress: pct, message: msg }),
      });

      updateJob(job.id, {
        status: "done",
        progress: 100,
        message: "Done",
        downloadUrl: `/outputs/${outName}`,
      });
    } catch (err) {
      updateJob(job.id, {
        status: "error",
        error: String(err.message || err),
        message: "Failed",
      });
    }
  })();
});

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server: http://localhost:${PORT}`));
