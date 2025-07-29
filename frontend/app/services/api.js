const API_BASE_URL = process.env.REACT_APP_API_URL || "https://acciojob-assignment.onrender.com/api"

class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(errorData.message || "Request failed", response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) throw error
    throw new APIError("Network error", 0)
  }
}

export const authAPI = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => apiRequest("/auth/me"),
}

export const sessionAPI = {
  getAll: () => apiRequest("/session/"),

  getById: (id) => apiRequest(`/session/${id}`),

  create: (title) =>
    apiRequest("/session/", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  update: (id, updates) =>
    apiRequest(`/session/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  delete: (id) =>
    apiRequest(`/session/${id}`, {
      method: "DELETE",
    }),
}

export const aiAPI = {
  generate: (prompt, sessionId) =>
    apiRequest("/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, sessionId }),
    }),

  update: (prompt, jsx, css, sessionId) =>
    apiRequest("/ai/update", {
      method: "POST",
      body: JSON.stringify({ prompt, jsx, css, sessionId }),
    }),
}


const apiRequest2 = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    method: options.method || 'GET',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(errorData.message || "Request failed", response.status);
    }

    if (options.responseType === 'blob') {
      return await response.blob(); // ✅ important for zip
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Network error", 0);
  }
};


export const exportAPI = {
  exportSessionZip: (sessionId) => {
    if (!sessionId) throw new Error("Session ID is required for export");
    return apiRequest2(`/export/${sessionId}`, { responseType: 'blob' });
  },
  exportSession: (sessionId) => {
    // Alias for compatibility
    return exportAPI.exportSessionZip(sessionId);
  }
};