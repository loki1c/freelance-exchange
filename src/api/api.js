const API_BASE_URL = "http://your-backend-api"; // Замени на URL твоего PHP-бэкенда

const apiRequest = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при выполнении запроса");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const api = {
  get: (endpoint, token) => apiRequest(endpoint, "GET", null, token),
  post: (endpoint, body, token) => apiRequest(endpoint, "POST", body, token),
  put: (endpoint, body, token) => apiRequest(endpoint, "PUT", body, token),
  delete: (endpoint, token) => apiRequest(endpoint, "DELETE", null, token),
};