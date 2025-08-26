import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Layers,
  Upload,
  PieChart,
  Database,
  Activity,
  ChevronRight,
} from "lucide-react";
import * as api from "../api";
import { Loader } from "../components/Utils";

const AdminDashboard = ({ navigate, t }) => {
  const [stats, setStats] = useState({
    totalTerms: 0,
    totalThemes: 0,
    totalQuizzes: 0,
    activeUsers: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminStats();
      setStats(
        response.data || {
          totalTerms: 0,
          totalThemes: 0,
          totalQuizzes: 0,
          activeUsers: 0,
          recentActivity: [],
        }
      );
    } catch (error) {
      console.error("Error loading admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const adminSections = [
    {
      path: "/admin/terms",
      title: "Manage Terms",
      icon: BookOpen,
      color: "green",
      description: "Add, edit, and delete terms",
    },
    {
      path: "/admin/themes",
      title: "Manage Themes",
      icon: Layers,
      color: "blue",
      description: "Organize terms by themes",
    },
    {
      path: "/admin/import",
      title: "Import/Export",
      icon: Upload,
      color: "purple",
      description: "Bulk import and export data",
    },
    {
      path: "/admin/stats",
      title: "Analytics",
      icon: PieChart,
      color: "orange",
      description: "View detailed statistics",
    },
  ];

  if (isLoading) {
    return <Loader text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {t("admin.dashboard.title")}
            </h1>
            <p className="text-xl text-gray-600">
              {t("admin.dashboard.welcome")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Database className="text-green-500" size={32} />
                <span className="text-3xl font-bold">{stats.totalTerms}</span>
              </div>
              <h3 className="font-semibold">
                {t("admin.dashboard.totalTerms")}
              </h3>
              <p className="text-sm text-gray-500">In database</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Layers className="text-blue-500" size={32} />
                <span className="text-3xl font-bold">{stats.totalThemes}</span>
              </div>
              <h3 className="font-semibold">
                {t("admin.dashboard.totalThemes")}
              </h3>
              <p className="text-sm text-gray-500">Active themes</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="text-purple-500" size={32} />
                <span className="text-3xl font-bold">{stats.totalQuizzes}</span>
              </div>
              <h3 className="font-semibold">
                {t("admin.dashboard.totalQuizzes")}
              </h3>
              <p className="text-sm text-gray-500">Completed today</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <PieChart className="text-orange-500" size={32} />
                <span className="text-3xl font-bold">{stats.activeUsers}</span>
              </div>
              <h3 className="font-semibold">Active Users</h3>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {adminSections.map((section) => (
              <button
                key={section.path}
                onClick={() => navigate(section.path)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg bg-${section.color}-100 group-hover:scale-110 transition-transform`}
                  >
                    <section.icon
                      className={`text-${section.color}-600`}
                      size={28}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600">{section.description}</p>
                  </div>
                  <ChevronRight
                    className="text-gray-400 group-hover:translate-x-1 transition-transform"
                    size={24}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("admin.dashboard.recentActivity")}
            </h2>
            <div className="space-y-3">
              {stats.recentActivity && stats.recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No recent activity
                </p>
              ) : (
                stats.recentActivity &&
                stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="text-gray-400" size={20} />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">
                          by {activity.user}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
