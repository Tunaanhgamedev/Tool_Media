const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function extFromMime(mime) {
  if (mime && mime.includes("audio")) return ".mp3";
  if (mime && mime.includes("video")) return ".mp4";
  return ".mp4";
}

function toSeconds(t) {
  const parts = String(t).trim().split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return null;
}

function durationFromStartEnd(start, end) {
  const s = toSeconds(start);
  const e = toSeconds(end);
  if (s == null || e == null || e <= s) return null;
  return e - s; // seconds
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

/**
 * Cut media with progress callback (0..100)
 */
function cutMedia({ inputPath, outputPath, start, end, fastCopy = true, onProgress }) {
  return new Promise((resolve, reject) => {
    ensureDir(path.dirname(outputPath));

    const durSec = durationFromStartEnd(start, end);
    if (!durSec) return reject(new Error("Invalid time range (end must be > start)."));

    const cmd = ffmpeg(inputPath).setStartTime(start);

    // setDuration accepts seconds too
    cmd.setDuration(durSec);

    if (fastCopy) {
      cmd.outputOptions(["-c copy"]);
    }

    cmd.on("progress", (p) => {
      // p.timemark: "00:00:03.21"
      if (!onProgress) return;
      const t = toSeconds(String(p.timemark).split(".")[0] || "0");
      if (t == null) return;
      const percent = Math.round(clamp01(t / durSec) * 100);
      onProgress(percent, `Cutting... ${percent}%`);
    });

    cmd
      .on("end", () => {
        onProgress && onProgress(100, "Done");
        resolve(outputPath);
      })
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
}

/**
 * Merge media: concat demuxer, progress is rough.
 * We simulate progress based on file index (good enough for MVP UI).
 */
function mergeMedia({ inputPaths, outputPath, onProgress }) {
  return new Promise(async (resolve, reject) => {
    ensureDir(path.dirname(outputPath));

    // 1) remux từng file sang .ts để hạn chế lỗi timestamp/duration
    const tempDir = path.join(path.dirname(outputPath), `tmp_${Date.now()}`);
    ensureDir(tempDir);

    const tsPaths = [];
    try {
      for (let i = 0; i < inputPaths.length; i++) {
        const inPath = inputPaths[i];
        const tsPath = path.join(tempDir, `part_${i}.ts`);
        tsPaths.push(tsPath);

        onProgress && onProgress(Math.round((i / inputPaths.length) * 40), `Preparing ${i + 1}/${inputPaths.length}...`);

        await new Promise((res, rej) => {
          ffmpeg(inPath)
            .outputOptions([
              "-c copy",
              "-bsf:v h264_mp4toannexb",   // quan trọng cho H.264 MP4 -> TS
              "-f mpegts",
              "-fflags +genpts",
            ])
            .on("end", res)
            .on("error", rej)
            .save(tsPath);
        });
      }

      // 2) concat các .ts
      onProgress && onProgress(50, "Merging...");

      const listPath = path.join(tempDir, "list.txt");
      fs.writeFileSync(listPath, tsPaths.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join("\n"), "utf8");

      ffmpeg()
        .input(listPath)
        .inputOptions(["-f concat", "-safe 0"])
        .outputOptions([
          "-c copy",
          "-bsf:a aac_adtstoasc",       // audio TS -> MP4
          "-fflags +genpts",
          "-avoid_negative_ts make_zero"
        ])
        .on("end", () => {
          onProgress && onProgress(100, "Done");
          // cleanup
          try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
          resolve(outputPath);
        })
        .on("error", (err) => {
          try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
          reject(err);
        })
        .save(outputPath);

      // fake progress cho UI
      if (onProgress) {
        let pct = 50;
        const timer = setInterval(() => {
          pct += 5;
          if (pct >= 95) clearInterval(timer);
          else onProgress(pct, "Merging...");
        }, 400);
      }

    } catch (err) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
      reject(err);
    }
  });
}


module.exports = { cutMedia, mergeMedia, extFromMime };

