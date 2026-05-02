const { v4: uuidv4 } = require("uuid");

const jobs = new Map();
// job: { id, type, status, progress, message, downloadUrl, error }

function createJob(type) {
  const id = uuidv4();
  const job = {
    id,
    type,
    status: "queued", // queued | running | done | error
    progress: 0,
    message: "",
    downloadUrl: null,
    error: null,
    createdAt: Date.now(),
  };
  jobs.set(id, job);
  return job;
}

function updateJob(id, patch) {
  const job = jobs.get(id);
  if (!job) return null;
  Object.assign(job, patch);
  jobs.set(id, job);
  return job;
}

function getJob(id) {
  return jobs.get(id) || null;
}

module.exports = { createJob, updateJob, getJob };
