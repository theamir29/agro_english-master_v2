import React, { useState } from "react";
import {
  Home,
  BookOpen,
  Brain,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  ChevronDown,
} from "lucide-react";
import { LANGUAGES } from "../data";

const Navigation = ({
  currentPath,
  navigate,
  isAdmin,
  logout,
  t,
  language,
  setLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/dictionary", label: t("nav.dictionary"), icon: BookOpen },
    { path: "/quiz", label: t("nav.quizzes"), icon: Brain },
    { path: "/results", label: t("nav.progress"), icon: BarChart },
  ];

  if (isAdmin) {
    navItems.push({ path: "/admin", label: t("nav.admin"), icon: Settings });
  }

  const isActive = (path) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 lg:space-x-12">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-3xl">🌾</span>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">AgroLearn</h1>
                <p className="text-xs opacity-75 hidden lg:block">
                  Agricultural Terminology Platform
                </p>
              </div>
            </div>

            <div className="hidden md:flex space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    isActive(item.path)
                      ? "bg-green-800 shadow-md"
                      : "hover:bg-green-600"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-green-800 rounded-md hover:bg-green-900 transition-colors"
              >
                <Globe size={20} />
                <span>{language.toUpperCase()}</span>
                <ChevronDown size={16} />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                        language === lang.id ? "bg-green-50 text-green-600" : ""
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut size={20} />
                <span>{t("nav.logout")}</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1 border-t border-green-600">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  isActive(item.path) ? "bg-green-800" : "hover:bg-green-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-green-600 pt-2 mt-2">
              <div className="px-3 py-2 text-sm opacity-75">Language:</div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    language === lang.id ? "bg-green-800" : "hover:bg-green-600"
                  }`}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-red-600 border-t border-green-600 mt-2"
              >
                {t("nav.logout")}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
