import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  X,
  Star,
  Volume2,
  Edit,
  Trash2,
  Plus,
  Grid,
  List,
  BookOpen,
  Layers,
  Menu,
} from "lucide-react";
import * as api from "../api";
import { TRANSLATION_DIRECTIONS } from "../data";
import { useLocalStorage } from "../App";
import { Loader, Modal, Pagination, Toast } from "../components/Utils";

const DictionaryPage = ({ navigate, t, isAdmin }) => {
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [themes, setThemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Инициализируем selectedTheme из URL при первом рендере
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const themeFromUrl = urlParams.get("theme");
    console.log("Theme from URL:", themeFromUrl); // Отладка
    if (themeFromUrl) {
      return decodeURIComponent(themeFromUrl);
    }
    return "all";
  });

  const [translationDirection, setTranslationDirection] = useState("both");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("term_kaa");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useLocalStorage("favoriteTerms", []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState(null);

  const itemsPerPage = viewMode === "grid" ? 12 : 10;

  // Загружаем данные при монтировании
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [termsResponse, themesResponse] = await Promise.all([
        api.getTerms(),
        api.getThemes(),
      ]);
      setTerms(termsResponse.data || []);
      setThemes(themesResponse || []);
      return true; // Возвращаем true для индикации успешной загрузки
    } catch (error) {
      console.error("Error loading data:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterTerms();
  }, [terms, searchTerm, selectedTheme, translationDirection, sortBy]);

  const filterTerms = () => {
    let filtered = [...terms];

    console.log("Filtering - Selected theme:", selectedTheme);
    console.log("Filtering - Total terms before filter:", filtered.length);

    // Добавим отладку для проверки структуры данных
    if (filtered.length > 0) {
      console.log("Sample term structure:", filtered[0]);
      console.log("Available themes in terms:", [
        ...new Set(filtered.map((t) => t.theme)),
      ]);
    }

    if (selectedTheme !== "all") {
      filtered = filtered.filter((term) => {
        // Проверяем разные варианты полей
        const termTheme = term.theme || term.theme_en || term.theme_name;
        console.log(
          `Comparing: term theme="${termTheme}" with selected="${selectedTheme}"`
        );
        return termTheme === selectedTheme;
      });
      console.log("Filtering - Terms after theme filter:", filtered.length);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((term) => {
        if (
          translationDirection === "kaa-en" ||
          translationDirection === "both"
        ) {
          if (term.term_kaa && term.term_kaa.toLowerCase().includes(search))
            return true;
        }
        if (
          translationDirection === "en-kaa" ||
          translationDirection === "both"
        ) {
          if (term.term_en && term.term_en.toLowerCase().includes(search))
            return true;
        }
        if (
          term.definition_en &&
          term.definition_en.toLowerCase().includes(search)
        )
          return true;
        if (
          term.definition_kaa &&
          term.definition_kaa.toLowerCase().includes(search)
        )
          return true;
        return false;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "term_kaa":
          return (a.term_kaa || "").localeCompare(b.term_kaa || "");
        case "term_en":
          return (a.term_en || "").localeCompare(b.term_en || "");
        case "theme":
          return (a.theme || "").localeCompare(b.theme || "");
        default:
          return 0;
      }
    });

    setFilteredTerms(filtered);
    setCurrentPage(1);
  };

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    setCurrentPage(1);
    // Обновляем URL
    if (themeName === "all") {
      window.history.replaceState({}, "", "/dictionary");
    } else {
      const encodedTheme = encodeURIComponent(themeName);
      window.history.replaceState({}, "", `/dictionary?theme=${encodedTheme}`);
    }
    // Закрываем мобильную боковую панель при выборе
    setMobileSidebarOpen(false);
  };

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTerms = filteredTerms.slice(startIndex, endIndex);

  const toggleFavorite = (termId) => {
    const newFavorites = favorites.includes(termId)
      ? favorites.filter((id) => id !== termId)
      : [...favorites, termId];
    setFavorites(newFavorites);
    setToast({
      message: favorites.includes(termId)
        ? "Removed from favorites"
        : "Added to favorites",
      type: "success",
    });
  };

  const playPronunciation = (term) => {
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleDelete = async (termId) => {
    if (!window.confirm("Are you sure you want to delete this term?")) return;

    try {
      await api.deleteTerm(termId);
      setTerms(terms.filter((t) => t._id !== termId));
      setToast({ message: "Term deleted successfully", type: "success" });
    } catch (error) {
      setToast({ message: "Error deleting term", type: "error" });
    }
  };

  const TranslationToggle = () => (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
      {TRANSLATION_DIRECTIONS.map((dir) => (
        <button
          key={dir.id}
          onClick={() => setTranslationDirection(dir.id)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            translationDirection === dir.id
              ? "bg-white text-green-600 shadow"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {dir.label}
        </button>
      ))}
    </div>
  );

  const ThemeSidebar = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 h-fit sticky top-20">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Layers className="mr-2" size={20} />
          Themes
        </h3>

        {/* All Terms Button */}
        <button
          onClick={() => handleThemeSelect("all")}
          className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
            selectedTheme === "all"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">All Terms</span>
            <span className="text-sm">{terms.length}</span>
          </div>
        </button>

        <div className="border-t pt-2 mt-2 max-h-[600px] overflow-y-auto space-y-1">
          {themes.map((theme) => {
            const termCount = terms.filter(
              (t) => t.theme === theme.name_en
            ).length;
            return (
              <button
                key={theme._id}
                onClick={() => handleThemeSelect(theme.name_en)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedTheme === theme.name_en
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{theme.name_en}</div>
                <div
                  className={`text-sm ${
                    selectedTheme === theme.name_en
                      ? "text-green-100"
                      : "text-gray-500"
                  }`}
                >
                  {theme.name_kaa}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    selectedTheme === theme.name_en
                      ? "text-green-200"
                      : "text-gray-400"
                  }`}
                >
                  {termCount} terms
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const TermCard = ({ term }) => {
    const isFavorite = favorites.includes(term._id);

    return (
      <div
        className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 ${
          viewMode === "list"
            ? "flex flex-col lg:flex-row lg:items-start lg:justify-between"
            : ""
        }`}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {(translationDirection === "kaa-en" ||
              translationDirection === "both") && (
              <>
                <h3 className="text-xl font-bold text-green-700">
                  {term.term_kaa}
                </h3>
                {translationDirection === "both" && (
                  <ChevronRight className="text-gray-400" size={20} />
                )}
              </>
            )}
            {(translationDirection === "en-kaa" ||
              translationDirection === "both") && (
              <h3 className="text-xl font-bold text-blue-700">
                {term.term_en}
              </h3>
            )}
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {translationDirection === "en-kaa" && term.definition_kaa
              ? term.definition_kaa
              : term.definition_en}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
              {term.theme}
            </span>
          </div>
        </div>

        <div
          className={`flex gap-2 ${
            viewMode === "list" ? "lg:ml-6 mt-4 lg:mt-0" : "mt-4"
          }`}
        >
          <button
            onClick={() => toggleFavorite(term._id)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
            }`}
            title={t("dictionary.actions.favorite")}
          >
            <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <button
            onClick={() => playPronunciation(term.term_en)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
            title={t("dictionary.actions.listen")}
          >
            <Volume2 size={20} />
          </button>

          <button
            onClick={() => {
              setSelectedTerm(term);
              setShowDetailModal(true);
            }}
            className="p-2 text-gray-400 hover:text-green-600 transition-colors hover:bg-green-50 rounded-lg"
            title={t("dictionary.actions.details")}
          >
            <BookOpen size={20} />
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => navigate(`/admin/terms?edit=${term._id}`)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
                title={t("dictionary.actions.edit")}
              >
                <Edit size={20} />
              </button>

              <button
                onClick={() => handleDelete(term._id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                title={t("dictionary.actions.delete")}
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 xl:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden self-start p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>

              <div className="flex-1 relative w-full">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={t("dictionary.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters Row - Desktop */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <TranslationToggle />

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="term_kaa">Sort by Karakalpak</option>
                  <option value="term_en">Sort by English</option>
                  <option value="theme">Sort by Theme</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid" ? "bg-white shadow" : ""
                    }`}
                    title="Grid view"
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list" ? "bg-white shadow" : ""
                    }`}
                    title="List view"
                  >
                    <List size={20} />
                  </button>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin/terms")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Add Term</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 space-y-4 pb-4 border-t pt-4">
                <TranslationToggle />

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="term_kaa">Sort by Karakalpak</option>
                  <option value="term_en">Sort by English</option>
                  <option value="theme">Sort by Theme</option>
                </select>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">View Mode:</span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${
                        viewMode === "grid" ? "bg-white shadow" : ""
                      }`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${
                        viewMode === "list" ? "bg-white shadow" : ""
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 xl:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ThemeSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="bg-white w-80 h-full overflow-y-auto">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Select Theme</h3>
                    <button
                      onClick={() => setMobileSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <ThemeSidebar />
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold">
                  {selectedTheme === "all"
                    ? t("dictionary.allThemes")
                    : selectedTheme}
                </h2>
                <p className="text-gray-500 mt-1">
                  {filteredTerms.length} {t("dictionary.termsFound")}
                </p>
              </div>

              {isLoading ? (
                <Loader text="Loading terms..." />
              ) : filteredTerms.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-16 text-center">
                  <Search size={64} className="mx-auto text-gray-300 mb-6" />
                  <h3 className="text-2xl font-semibold mb-3">
                    {t("dictionary.noTermsFound")}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {t("dictionary.tryAdjusting")}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTheme("all");
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t("dictionary.clearFilters")}
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid md:grid-cols-2 xl:grid-cols-2 gap-4"
                        : "space-y-4"
                    }
                  >
                    {currentTerms.map((term) => (
                      <TermCard key={term._id} term={term} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Term Details"
        size="medium"
      >
        {selectedTerm && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                {selectedTerm.term_kaa}
              </h3>
              <h4 className="text-xl font-semibold text-blue-700 mb-4">
                {selectedTerm.term_en}
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  English Definition:
                </label>
                <p className="text-gray-800 mt-1">
                  {selectedTerm.definition_en}
                </p>
              </div>

              {selectedTerm.definition_kaa && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Karakalpak Definition:
                  </label>
                  <p className="text-gray-800 mt-1">
                    {selectedTerm.definition_kaa}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-4 pt-4">
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {selectedTerm.theme}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default DictionaryPage;
