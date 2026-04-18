const API_BASE_URL = 'https://pdfbackend-three.vercel.app/api';

const mockJobs = new Map();

const createMockJob = (toolSlug, fileNames = [], options = {}) => {
  const jobId = `mock-${Date.now()}`;
  mockJobs.set(jobId, {
    id: jobId,
    status: 'queued',
    toolSlug,
    fileName: fileNames[0] || 'document.pdf',
    fileNames,
    options,
    createdAt: Date.now()
  });

  return {
    jobId,
    status: 'queued',
    pollUrl: `/api/jobs/${jobId}`
  };
};

export const fetchTools = async (group = null) => {
  const url = group ? `${API_BASE_URL}/tools?group=${encodeURIComponent(group)}` : `${API_BASE_URL}/tools`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch tools');
  const data = await response.json();
  return data.data;
};

export const fetchToolGroups = async () => {
  const response = await fetch(`${API_BASE_URL}/tools/groups`);
  if (!response.ok) throw new Error('Failed to fetch tool groups');
  const data = await response.json();
  return data.data;
};

export const fetchHomeContent = async () => {
  const response = await fetch(`${API_BASE_URL}/tools/home-content`);
  if (!response.ok) throw new Error('Failed to fetch home content');
  const data = await response.json();
  return data.data;
};

export const fetchToolBySlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/tools/${slug}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch tool');
  }
  const data = await response.json();
  return data.data;
};

export const createJob = async (toolSlug, files = [], options = {}) => {
  const fileNames = Array.isArray(files) ? files.map((file) => file.name) : [];
  const hasRealFiles = Array.isArray(files) && files.length > 0;

  try {
    let response;

    if (hasRealFiles) {
      const formData = new FormData();
      formData.append('toolSlug', toolSlug);
      formData.append('options', JSON.stringify(options));
      files.forEach((file) => formData.append('files', file));

      response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          fileName: fileNames[0] || 'document.pdf',
          fileNames,
          options
        })
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to create job');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    const isNetworkError = error instanceof TypeError;

    if (isNetworkError && !hasRealFiles) {
      return createMockJob(toolSlug, fileNames, options);
    }

    if (isNetworkError) {
      throw new Error('The backend server is unavailable. Start the backend on port 5000 and try again.');
    }

    throw error;
  }
};

export const fetchJobStatus = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    if (!response.ok) throw new Error('Failed to fetch job status');
    const data = await response.json();
    return data.data;
  } catch (error) {
    const mockJob = mockJobs.get(jobId);
    if (!mockJob) {
      throw new Error('Failed to fetch job status');
    }

    const isCompleted = Date.now() - mockJob.createdAt > 1200;
    return {
      ...mockJob,
      status: isCompleted ? 'completed' : 'queued',
      finishedAt: isCompleted ? new Date().toISOString() : null,
      result: isCompleted
        ? {
            message: `Mock processing for ${mockJob.fileName} completed successfully.`,
            downloadUrl: '#'
          }
        : null
    };
  }
};