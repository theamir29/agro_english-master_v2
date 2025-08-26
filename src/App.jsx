import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Home,
  BookOpen,
  Brain,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Volume2,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  User,
  Lock,
  Globe,
  ArrowUpDown,
  Grid,
  List,
  Trophy,
  Target,
  Award,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  RefreshCw,
  FileText,
  Database,
  Activity,
  PieChart,
  Layers,
  Zap,
  Shield,
  Book,
} from "lucide-react";

import * as api from "./api";
import {
  mockTerms,
  mockThemes,
  translations,
  QUIZ_TYPES,
  LANGUAGES,
  TRANSLATION_DIRECTIONS,
  formatTime,
  validateTerm,
  validateTheme,
  exportToCSV,
  parseCSV,
} from "./data";

// Импортируем страницы
import HomePage from "./pages/HomePage";
import DictionaryPage from "./pages/DictionaryPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTerms from "./pages/AdminTerms";
import AdminThemes from "./pages/AdminThemes";
import AdminImport from "./pages/AdminImport";
import AdminStats from "./pages/AdminStats";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// ========== ПРОСТОЙ РОУТЕР ==========

const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  return { currentPath, navigate };
};

// ========== CUSTOM HOOKS ==========

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

export const useTranslation = () => {
  const [language, setLanguage] = useLocalStorage("uiLanguage", "en");

  const t = useCallback(
    (path) => {
      const keys = path.split(".");
      let value = translations[language];

      for (const key of keys) {
        if (value && typeof value === "object") {
          value = value[key];
        } else {
          return path;
        }
      }

      return value || path;
    },
    [language]
  );

  return { t, language, setLanguage };
};

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useLocalStorage("isAdmin", false);
  const [adminToken, setAdminToken] = useLocalStorage("adminToken", null);

  const login = async (username, password) => {
    try {
      const response = await api.adminLogin(username, password);
      if (response.token) {
        setAdminToken(response.token);
        setIsAdmin(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    api.adminLogout();
    setAdminToken(null);
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
};

// ========== ГЛАВНЫЙ КОМПОНЕНТ ==========

const App = () => {
  const { currentPath, navigate } = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const { isAdmin, login, logout } = useAuth();
  const [globalToast, setGlobalToast] = useState(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (localStorage.getItem("adminToken")) {
        try {
          await api.checkAuth();
        } catch (error) {
          logout();
          if (currentPath.startsWith("/admin")) {
            navigate("/");
          }
        }
      }
    };
    checkAuthStatus();
  }, []);

  // Обработка логина
  const handleAdminLogin = async (username, password) => {
    const result = await login(username, password);
    if (result.success) {
      navigate("/admin");
    }
    return result;
  };

  // Обработка выхода
  const handleLogout = () => {
    logout();
    navigate("/");
    setGlobalToast({ message: "Logged out successfully", type: "success" });
  };

  // Рендер страницы на основе пути
  const renderPage = () => {
    // Админ страницы
    if (currentPath.startsWith("/admin")) {
      if (!isAdmin) {
        return <AdminLogin onLogin={handleAdminLogin} t={t} />;
      }

      // Подстраницы админ панели
      if (currentPath === "/admin/terms") {
        return <AdminTerms t={t} navigate={navigate} />;
      }
      if (currentPath === "/admin/themes") {
        return <AdminThemes t={t} navigate={navigate} />;
      }
      if (currentPath === "/admin/import") {
        return <AdminImport t={t} navigate={navigate} />;
      }
      if (currentPath === "/admin/stats") {
        return <AdminStats t={t} navigate={navigate} />;
      }

      // Главная админ панель
      return <AdminDashboard navigate={navigate} t={t} />;
    }

    // Публичные страницы
    switch (currentPath) {
      case "/":
        return <HomePage navigate={navigate} t={t} />;
      case "/dictionary":
        return <DictionaryPage navigate={navigate} t={t} isAdmin={isAdmin} />;
      case "/quiz":
        return <QuizPage navigate={navigate} t={t} />;
      case "/results":
        return <ResultsPage navigate={navigate} t={t} />;
      default:
        // 404 - редирект на главную
        navigate("/");
        return <HomePage navigate={navigate} t={t} />;
    }
  };

  const showNavigation = !(currentPath === "/admin" && !isAdmin);
  const showFooter = !currentPath.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Навигация */}
      {showNavigation && (
        <Navigation
          currentPath={currentPath}
          navigate={navigate}
          isAdmin={isAdmin}
          logout={handleLogout}
          t={t}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {/* Основной контент */}
      <main className="flex-grow">{renderPage()}</main>

      {/* Футер */}
      {showFooter && <Footer t={t} />}

      {/* Toast уведомления */}
      {globalToast && (
        <Toast
          message={globalToast.message}
          type={globalToast.type}
          onClose={() => setGlobalToast(null)}
        />
      )}
    </div>
  );
};

// ========== КОМПОНЕНТ TOAST ==========

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${styles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-up`}
    >
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <X size={16} />
      </button>
    </div>
  );
};

export default App;
