import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Target,
  Globe,
  Layers,
  Users,
  Zap,
  Book,
} from "lucide-react";
import * as api from "../api";

const HomePage = ({ navigate, t }) => {
  const [stats, setStats] = useState({
    terms: 0,
    themes: 0,
    quizTypes: 4,
    users: 0,
  });

  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [termsResponse, themesResponse] = await Promise.all([
        api.getTerms({ limit: 1 }),
        api.getThemes(),
      ]);

      setStats({
        terms: termsResponse.total || 0,
        themes: themesResponse.length || 0,
        quizTypes: 4,
        users: 0,
      });

      setThemes(themesResponse || []);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-400 rounded-full opacity-20 blur-3xl"></div>

        <div className="relative container mx-auto px-4 xl:px-8 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  {t("home.hero.title")}
                </h1>
                <p className="text-lg lg:text-xl mb-4 opacity-95">
                  {t("home.hero.subtitle")}
                </p>
                <p className="text-base lg:text-lg mb-8 opacity-90">
                  {t("home.hero.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/dictionary")}
                    className="group bg-white text-green-700 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold hover:bg-green-50 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Book size={24} />
                    <span>{t("home.hero.browseDictionary")}</span>
                    <ChevronRight
                      className="group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </button>
                  <button
                    onClick={() => navigate("/quiz")}
                    className="group bg-green-900 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold hover:bg-green-950 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Brain size={24} />
                    <span>{t("home.hero.startLearning")}</span>
                    <Zap className="group-hover:animate-pulse" size={20} />
                  </button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-6">Quick Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Target className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold">Interactive Learning</h4>
                        <p className="text-sm opacity-75">
                          Engaging quizzes and exercises
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Globe className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold">Bilingual Support</h4>
                        <p className="text-sm opacity-75">
                          Karakalpak and English languages
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 xl:px-8 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 lg:p-8 border-t-4 border-green-500 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen className="text-green-600" size={28} />
                </div>
                <span className="text-3xl lg:text-4xl font-bold text-green-600">
                  {stats.terms}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">
                {t("home.stats.termsAvailable")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("home.stats.termsDescription")}
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 lg:p-8 border-t-4 border-blue-500 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl group-hover:scale-110 transition-transform">
                  <Layers className="text-blue-600" size={28} />
                </div>
                <span className="text-3xl lg:text-4xl font-bold text-blue-600">
                  {stats.themes}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">
                {t("home.stats.themes")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("home.stats.themesDescription")}
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 lg:p-8 border-t-4 border-purple-500 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl group-hover:scale-110 transition-transform">
                  <Brain className="text-purple-600" size={28} />
                </div>
                <span className="text-3xl lg:text-4xl font-bold text-purple-600">
                  {stats.quizTypes}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">
                {t("home.stats.quizTypes")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("home.stats.quizDescription")}
              </p>
            </div>

            <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 lg:p-8 border-t-4 border-orange-500 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="text-orange-600" size={28} />
                </div>
                <span className="text-3xl lg:text-4xl font-bold text-orange-600">
                  {stats.users}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">
                {t("home.stats.activeUsers")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("home.stats.usersDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Themes Preview */}
      {themes.length > 0 && (
        <div className="bg-gray-50 py-12 lg:py-20">
          <div className="container mx-auto px-4 xl:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Explore Themes
                </h2>
                <p className="text-gray-600 text-lg">
                  Navigate through specialized agricultural topics
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <button
                    key={theme._id}
                    onClick={() => navigate("/dictionary")}
                    className="group bg-white rounded-xl shadow-md p-6 lg:p-8 hover:shadow-2xl transition-all hover:-translate-y-2 text-left"
                  >
                    <h3 className="font-semibold text-xl mb-2">
                      {theme.name_en}
                    </h3>
                    <p className="text-gray-600 mb-2">{theme.name_kaa}</p>
                    {theme.description && (
                      <p className="text-sm text-gray-500 mb-3">
                        {theme.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      {theme.terms_count || 0} terms
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 lg:py-20">
        <div className="container mx-auto px-4 xl:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-lg lg:text-xl mb-8 opacity-95">
            {t("home.cta.subtitle")}
          </p>
          <button
            onClick={() => navigate("/dictionary")}
            className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transform hover:scale-105 transition-all shadow-lg text-lg inline-flex items-center space-x-2"
          >
            <span>{t("home.cta.getStarted")}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
