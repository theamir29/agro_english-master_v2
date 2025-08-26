import axios from "axios";

const API_URL = "/api";

// Создаем axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем токен в каждый запрос если есть
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== ТЕРМИНЫ ==========

export const getTerms = async (params = {}) => {
  try {
    const response = await api.get("/terms", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching terms:", error);
    throw error;
  }
};

export const getTermById = async (id) => {
  try {
    const response = await api.get(`/terms/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching term:", error);
    throw error;
  }
};

export const createTerm = async (data) => {
  try {
    const response = await api.post("/admin/terms", data);
    return response.data;
  } catch (error) {
    console.error("Error creating term:", error);
    throw error;
  }
};

export const updateTerm = async (id, data) => {
  try {
    const response = await api.put(`/admin/terms/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating term:", error);
    throw error;
  }
};

export const deleteTerm = async (id) => {
  try {
    const response = await api.delete(`/admin/terms/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting term:", error);
    throw error;
  }
};

export const bulkImportTerms = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/admin/terms/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error importing terms:", error);
    throw error;
  }
};

// ========== КАТЕГОРИИ ==========

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await api.post("/admin/categories", data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// ========== ТЕСТЫ ==========

export const getQuizQuestions = async (type, category, count = 10) => {
  try {
    const response = await api.get("/quiz", {
      params: { type, category, count },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};

export const submitQuizResult = async (data) => {
  try {
    const response = await api.post("/quiz/result", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz result:", error);
    throw error;
  }
};

export const getQuizHistory = async () => {
  try {
    const response = await api.get("/quiz/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    throw error;
  }
};

export const getQuizStats = async () => {
  try {
    const response = await api.get("/quiz/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
    throw error;
  }
};

// ========== АДМИН АВТОРИЗАЦИЯ ==========

export const adminLogin = async (username, password) => {
  try {
    const response = await api.post("/admin/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("isAdmin", "true");
    }
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("isAdmin");
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/admin/verify");
    return response.data;
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    throw error;
  }
};

// ========== СТАТИСТИКА ==========

export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

export const getPopularTerms = async () => {
  try {
    const response = await api.get("/stats/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching popular terms:", error);
    throw error;
  }
};

export const getSearchAnalytics = async () => {
  try {
    const response = await api.get("/admin/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching search analytics:", error);
    throw error;
  }
};

// ========== ПОЛЬЗОВАТЕЛЬСКИЙ ПРОГРЕСС ==========

export const getUserProgress = () => {
  // Получаем из localStorage так как нет авторизации пользователей
  const progress = localStorage.getItem("userProgress");
  return progress ? JSON.parse(progress) : null;
};

export const updateUserProgress = (data) => {
  const current = getUserProgress() || {};
  const updated = { ...current, ...data };
  localStorage.setItem("userProgress", JSON.stringify(updated));
  return updated;
};

export const getFavoriteTerms = () => {
  const favorites = localStorage.getItem("favoriteTerms");
  return favorites ? JSON.parse(favorites) : [];
};

export const toggleFavoriteTerm = (termId) => {
  const favorites = getFavoriteTerms();
  const index = favorites.indexOf(termId);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(termId);
  }

  localStorage.setItem("favoriteTerms", JSON.stringify(favorites));
  return favorites;
};

export default api;
