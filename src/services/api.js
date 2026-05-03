const configuredApiBaseUrl = (process.env.REACT_APP_API_BASE_URL || '').trim();
const defaultApiBaseUrl =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://pdfbackend-three.vercel.app/api';

const API_BASE_URL = configuredApiBaseUrl || defaultApiBaseUrl;
const API_BASE_FALLBACKS = [
  API_BASE_URL,
  'http://localhost:5000/api',
  'https://pdfbackend-three.vercel.app/api'
].filter(Boolean);

const API_BASE_CANDIDATES = [...new Set(API_BASE_FALLBACKS)];
const jobApiBaseById = new Map();
let preferredApiBaseUrl = null;

const getApiCandidates = () => {
  const orderedCandidates = [preferredApiBaseUrl, ...API_BASE_CANDIDATES].filter(Boolean);
  return [...new Set(orderedCandidates)];
};

const formatApiError = async (response, fallbackMessage) => {
  const errorData = await response.json().catch(() => null);
  return errorData?.message || fallbackMessage;
};

const requestWithFallback = async (buildRequest) => {
  let lastHttpError = null;
  const candidates = getApiCandidates();

  for (const baseUrl of candidates) {
    try {
      const response = await buildRequest(baseUrl);
      if (response.ok) {
        preferredApiBaseUrl = baseUrl;
        response.__apiBaseUrl = baseUrl;
        return response;
      }

      const message = await formatApiError(response, `Request failed with status ${response.status}.`);
      const error = new Error(message);
      error.status = response.status;
      error.baseUrl = baseUrl;

      // Retry another backend only for likely transient server-side errors.
      if (response.status >= 500) {
        lastHttpError = error;
        continue;
      }

      throw error;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network-level failure (e.g. ERR_CONNECTION_REFUSED). Try next base URL.
        continue;
      }

      throw error;
    }
  }

  if (lastHttpError) {
    throw lastHttpError;
  }

  throw new Error(
    `Unable to connect to backend API. Tried: ${candidates.join(', ')}`
  );
};

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
  const response = await requestWithFallback((baseUrl) => {
    const url = group ? `${baseUrl}/tools?group=${encodeURIComponent(group)}` : `${baseUrl}/tools`;
    return fetch(url);
  });
  if (!response.ok) throw new Error('Failed to fetch tools');
  const data = await response.json();
  return data.data;
};

export const fetchToolGroups = async () => {
  const response = await requestWithFallback((baseUrl) => fetch(`${baseUrl}/tools/groups`));
  if (!response.ok) throw new Error('Failed to fetch tool groups');
  const data = await response.json();
  return data.data;
};

export const fetchHomeContent = async () => {
  const response = await requestWithFallback((baseUrl) => fetch(`${baseUrl}/tools/home-content`));
  if (!response.ok) throw new Error('Failed to fetch home content');
  const data = await response.json();
  return data.data;
};

export const fetchToolBySlug = async (slug) => {
  const response = await requestWithFallback((baseUrl) => fetch(`${baseUrl}/tools/${slug}`));
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
    const response = await requestWithFallback((baseUrl) => {
      if (hasRealFiles) {
        const formData = new FormData();
        formData.append('toolSlug', toolSlug);
        formData.append('options', JSON.stringify(options));
        files.forEach((file) => formData.append('files', file));

        return fetch(`${baseUrl}/jobs`, {
          method: 'POST',
          body: formData
        });
      }

      return fetch(`${baseUrl}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          fileName: fileNames[0] || 'document.pdf',
          fileNames,
          options
        })
      });
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to create job');
    }

    const data = await response.json();
    if (data?.data?.jobId && response.__apiBaseUrl) {
      jobApiBaseById.set(data.data.jobId, response.__apiBaseUrl);
    }
    return data.data;
  } catch (error) {
    const isNetworkError =
      error instanceof TypeError ||
      /Unable to connect to backend API/i.test(String(error?.message || ''));

    if (isNetworkError && !hasRealFiles) {
      return createMockJob(toolSlug, fileNames, options);
    }

    if (isNetworkError) {
      const candidates = getApiCandidates();
      throw new Error(
        `Backend connection failed. Please check API server. Tried: ${candidates.join(', ')}`
      );
    }

    throw error;
  }
};

export const fetchJobStatus = async (jobId) => {
  try {
    const boundBaseUrl = jobApiBaseById.get(jobId);
    let response;

    if (boundBaseUrl) {
      response = await fetch(`${boundBaseUrl}/jobs/${jobId}`);
      if (response.status === 404) {
        throw new Error(`Job not found on ${boundBaseUrl}. Please upload and process again.`);
      }
      if (!response.ok) {
        const message = await formatApiError(response, 'Failed to fetch job status');
        throw new Error(message);
      }
    } else {
      response = await requestWithFallback((baseUrl) => fetch(`${baseUrl}/jobs/${jobId}`));
    }

    if (!response.ok) throw new Error('Failed to fetch job status');
    const data = await response.json();
    return data.data;
  } catch (error) {
    const mockJob = mockJobs.get(jobId);
    if (!mockJob) {
      if (/Unable to connect to backend API/i.test(String(error?.message || ''))) {
        const candidates = getApiCandidates();
        throw new Error(
          `Cannot reach backend while checking job status. Tried: ${candidates.join(', ')}`
        );
      }
      throw new Error(error?.message || 'Failed to fetch job status');
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