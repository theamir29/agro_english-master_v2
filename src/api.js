import axios from "axios";

// ВАЖНО: Используем правильный порт для бэкенда
const API_URL = "https://agrolex.kerek.uz/api";

// Создаем axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем токен в каждый запрос если есть
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ответов и ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Если токен недействителен, очищаем localStorage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdmin");
      // Перенаправляем на страницу логина только если мы в админке
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

// ========== ТЕРМИНЫ ==========

export const getTerms = async (params = {}) => {
  try {
    // ИЗМЕНЕНО: устанавливаем большой лимит по умолчанию
    const defaultParams = {
      limit: 1000,
      ...params,
    };
    const response = await api.get("/terms", { params: defaultParams });
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

// ========== ТЕМЫ (THEMES) ==========

export const getThemes = async () => {
  try {
    const response = await api.get("/themes");
    return response.data;
  } catch (error) {
    console.error("Error fetching themes:", error);
    return [];
  }
};

export const createTheme = async (data) => {
  try {
    const response = await api.post("/admin/themes", data);
    return response.data;
  } catch (error) {
    console.error("Error creating theme:", error);
    throw error;
  }
};

export const updateTheme = async (id, data) => {
  try {
    const response = await api.put(`/admin/themes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating theme:", error);
    throw error;
  }
};

export const deleteTheme = async (id) => {
  try {
    const response = await api.delete(`/admin/themes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting theme:", error);
    throw error;
  }
};

// ========== КАТЕГОРИИ (для обратной совместимости) ==========

export const getCategories = async () => {
  // Используем themes вместо categories
  return getThemes();
};

export const createCategory = async (data) => {
  // Перенаправляем на themes
  return createTheme(data);
};

export const updateCategory = async (id, data) => {
  // Перенаправляем на themes
  return updateTheme(id, data);
};

export const deleteCategory = async (id) => {
  // Перенаправляем на themes
  return deleteTheme(id);
};

// ========== ТЕСТЫ ==========

export const getQuizQuestions = async (type, theme, count = 10) => {
  try {
    const response = await api.get("/quiz", {
      params: { type, theme, count },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
};

export const submitQuizResult = async (data) => {
  try {
    // Генерируем session_id если его нет
    if (!data.session_id) {
      data.session_id = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
    const response = await api.post("/quiz/result", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz result:", error);
    throw error;
  }
};

export const getQuizHistory = async () => {
  try {
    const sessionId = localStorage.getItem("sessionId") || "default";
    const response = await api.get("/quiz/history", {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return [];
  }
};

export const getQuizStats = async () => {
  try {
    const sessionId = localStorage.getItem("sessionId") || "default";
    const response = await api.get("/quiz/stats", {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
    throw error;
  }
};

// ========== АДМИН АВТОРИЗАЦИЯ ==========

// Дебаунс для предотвращения множественных вызовов
let authCheckPromise = null;

export const adminLogin = async (username, password) => {
  try {
    const response = await api.post("/admin/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminData", JSON.stringify(response.data.admin));
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
  localStorage.removeItem("adminData");
  authCheckPromise = null;
};

export const checkAuth = async () => {
  // Если уже есть запрос в процессе, возвращаем тот же промис
  if (authCheckPromise) {
    return authCheckPromise;
  }

  authCheckPromise = (async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await api.get("/admin/verify");
      if (response.data.valid) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminData", JSON.stringify(response.data.admin));
      }
      authCheckPromise = null;
      return response.data;
    } catch (error) {
      console.error("Auth check failed:", error);
      // Очищаем данные если токен недействителен
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminData");
      }
      authCheckPromise = null;
      throw error;
    }
  })();

  return authCheckPromise;
};

// ========== СТАТИСТИКА ==========

export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    // Возвращаем дефолтные значения при ошибке
    return {
      data: {
        totalTerms: 0,
        totalThemes: 0,
        totalQuizzes: 0,
        activeUsers: 0,
        recentActivity: [],
        dailyQuizzes: [],
      },
    };
  }
};

export const getPopularTerms = async () => {
  try {
    const response = await api.get("/stats/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching popular terms:", error);
    return [];
  }
};

export const getSearchAnalytics = async () => {
  try {
    const response = await api.get("/admin/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching search analytics:", error);
    return {
      popularTerms: [],
      themeStats: [],
      quizTypeStats: [],
    };
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

// Генерируем или получаем session ID для пользователя
if (!localStorage.getItem("sessionId")) {
  localStorage.setItem(
    "sessionId",
    `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
}

export default api;
