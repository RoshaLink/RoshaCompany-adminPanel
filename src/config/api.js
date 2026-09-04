/**
 * Centralized API client for communicating with RoshaLink Backend.
 * Automatically injects JWT Bearer token, safely parses JSON, and handles
 * offline backend states or network errors with user-friendly messages.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('roshalink_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function handleAuthFailure(response) {
  if (response.status === 401) {
    // Clear invalid or expired token
    localStorage.removeItem('roshalink_admin_token');
  }
}

/**
 * Execute HTTP fetch with comprehensive network error handling and safe body parsing
 */
async function executeRequest(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {}),
      },
    });
  } catch (networkError) {
    console.error('Network/Connection error communicating with backend:', networkError);
    const error = new Error('Cannot connect to backend server. Please verify the backend is running on port 5000.');
    error.isNetworkError = true;
    throw error;
  }

  handleAuthFailure(res);

  // Safely parse JSON or text response
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      if (text) {
        data = { message: text };
      }
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    let message = data?.message;
    if (!message) {
      if (res.status === 503 || res.status === 502) {
        message = 'Backend service is currently unavailable. Please verify the backend server is running.';
      } else if (res.status === 401) {
        message = 'Unauthorized: invalid or expired session.';
      } else if (res.status === 403) {
        message = 'Forbidden: you do not have permission to perform this action.';
      } else if (res.status === 404) {
        message = 'The requested resource was not found on the server.';
      } else {
        message = `API request failed with status ${res.status} (${res.statusText || 'Error'})`;
      }
    }

    const error = new Error(message);
    error.status = res.status;
    error.code = data?.code;
    error.data = data;
    throw error;
  }

  return data || { success: true };
}

export const api = {
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    ).toString();
    const url = `${API_BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

    return executeRequest(url, { method: 'GET' });
  },

  async post(endpoint, body = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    return executeRequest(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async put(endpoint, body = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    return executeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async patch(endpoint, body = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    return executeRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint) {
    const url = `${API_BASE_URL}${endpoint}`;
    return executeRequest(url, { method: 'DELETE' });
  },
};
