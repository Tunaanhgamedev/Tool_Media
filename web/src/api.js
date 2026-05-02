import axios from "axios";

export const API_BASE = "http://localhost:4000";

export async function createCutJob({ file, start, end, fastCopy }) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("start", start);
  fd.append("end", end);
  fd.append("fastCopy", fastCopy ? "true" : "false");

  const { data } = await axios.post(`${API_BASE}/api/cut-job`, fd);
  return data.jobId;
}

export async function createMergeJob({ files }) {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  const { data } = await axios.post(`${API_BASE}/api/merge-job`, fd);
  return data.jobId;
}

export async function getJob(jobId) {
  const { data } = await axios.get(`${API_BASE}/api/job/${jobId}`);
  return data;
}
