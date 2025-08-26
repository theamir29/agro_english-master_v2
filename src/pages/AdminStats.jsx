import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  PieChart,
  Trophy,
  Activity,
  ArrowLeft,
  Eye,
  Brain,
} from "lucide-react";
import * as api from "../api";
import { Loader } from "../components/Utils";

const AdminStats = ({ t, navigate }) => {
  const [stats, setStats] = useState({
    popularTerms: [],
    themeStats: [],
    quizTypeStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("week");

  useEffect(() => {
    loadStats();
  }, [dateRange]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.getSearchAnalytics();
      setStats({
        popularTerms: response.popularTerms || [],
        themeStats: response.themeStats || [],
        quizTypeStats: response.quizTypeStats || [],
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading statistics..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold mb-4">Analytics & Statistics</h1>
            <p className="text-xl text-gray-600">
              Detailed platform analytics and usage statistics
            </p>
          </div>

          <div className="mb-6 flex justify-end">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Popular Terms */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-green-600" size={24} />
                Most Viewed Terms
              </h2>
              <div className="space-y-3">
                {stats.popularTerms.length === 0 ? (
                  <p className="text-gray-500">No data available</p>
                ) : (
                  stats.popularTerms.slice(0, 10).map((term, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{term.term_en}</p>
                          <p className="text-sm text-gray-500">
                            {term.term_kaa}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Eye size={16} />
                        <span>{term.views} views</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Theme Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <PieChart className="mr-2 text-blue-600" size={24} />
                Theme Distribution
              </h2>
              <div className="space-y-3">
                {stats.themeStats.length === 0 ? (
                  <p className="text-gray-500">No data available</p>
                ) : (
                  stats.themeStats.map((theme) => {
                    const percentage = 100; // You can calculate real percentage here
                    return (
                      <div key={theme._id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {theme._id || "Unknown"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {theme.count} terms
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Avg. views: {Math.round(theme.avgViews || 0)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quiz Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="mr-2 text-yellow-600" size={24} />
                Quiz Performance by Type
              </h2>
              <div className="space-y-4">
                {stats.quizTypeStats.length === 0 ? (
                  <p className="text-gray-500">No quiz data available</p>
                ) : (
                  stats.quizTypeStats.map((quiz) => (
                    <div key={quiz._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{quiz._id}</h3>
                        <span className="text-sm text-gray-500">
                          {quiz.count} attempts
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Avg. Score:</span>
                          <span className="ml-2 font-semibold text-green-600">
                            {Math.round(quiz.avgScore || 0)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg. Time:</span>
                          <span className="ml-2 font-semibold">
                            {Math.round(quiz.avgTime / 60 || 0)}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="mr-2 text-purple-600" size={24} />
                Platform Usage
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Terms</span>
                  <span className="font-semibold">
                    {stats.themeStats.reduce((acc, t) => acc + t.count, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Active Themes</span>
                  <span className="font-semibold">
                    {stats.themeStats.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold">
                    {stats.popularTerms.reduce((acc, t) => acc + t.views, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Quiz Types Used</span>
                  <span className="font-semibold">
                    {stats.quizTypeStats.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="mr-2 text-indigo-600" size={24} />
              Learning Performance Trends
            </h2>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-end space-x-4 h-64">
                {[65, 72, 68, 74, 79, 82, 85].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t hover:from-indigo-600 hover:to-indigo-500 transition-colors"
                      style={{ height: `${(value / 100) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">
                      Day {index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Average Quiz Score (%) - Last 7 Days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
