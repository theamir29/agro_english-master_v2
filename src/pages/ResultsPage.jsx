import React, { useState } from "react";
import { Trophy, Target, Clock, TrendingUp, Award } from "lucide-react";
import { QUIZ_TYPES, formatTime } from "../data";
import { useLocalStorage } from "../App";

const ResultsPage = ({ navigate, t }) => {
  const [quizHistory] = useLocalStorage("quizHistory", []);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const calculateStats = () => {
    if (quizHistory.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        totalTime: 0,
        bestTheme: "N/A",
        improvement: 0,
      };
    }

    const stats = {
      totalQuizzes: quizHistory.length,
      averageScore: Math.round(
        quizHistory.reduce((acc, q) => acc + q.percentage, 0) /
          quizHistory.length
      ),
      totalTime: quizHistory.reduce((acc, q) => acc + q.timeSpent, 0),
      themeScores: {},
    };

    quizHistory.forEach((quiz) => {
      if (!stats.themeScores[quiz.theme]) {
        stats.themeScores[quiz.theme] = {
          count: 0,
          totalScore: 0,
        };
      }
      stats.themeScores[quiz.theme].count++;
      stats.themeScores[quiz.theme].totalScore += quiz.percentage;
    });

    let bestTheme = "N/A";
    let bestScore = 0;
    Object.entries(stats.themeScores).forEach(([theme, data]) => {
      const avgScore = data.totalScore / data.count;
      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestTheme = theme;
      }
    });
    stats.bestTheme = bestTheme;

    if (quizHistory.length >= 10) {
      const recent5 =
        quizHistory.slice(0, 5).reduce((acc, q) => acc + q.percentage, 0) / 5;
      const previous5 =
        quizHistory.slice(5, 10).reduce((acc, q) => acc + q.percentage, 0) / 5;
      stats.improvement = Math.round(recent5 - previous5);
    } else {
      stats.improvement = 0;
    }

    return stats;
  };

  const stats = calculateStats();

  const getFilteredHistory = () => {
    const now = new Date();
    let filtered = [...quizHistory];

    switch (selectedPeriod) {
      case "today":
        filtered = filtered.filter((q) => {
          const qDate = new Date(q.date);
          return qDate.toDateString() === now.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((q) => new Date(q.date) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((q) => new Date(q.date) >= monthAgo);
        break;
      default:
        break;
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{t("nav.progress")}</h1>
            <p className="text-xl text-gray-600">
              Track your learning progress and achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="text-yellow-500" size={32} />
                <span className="text-3xl font-bold">{stats.totalQuizzes}</span>
              </div>
              <h3 className="font-semibold">Total Quizzes</h3>
              <p className="text-sm text-gray-500">Completed so far</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="text-green-500" size={32} />
                <span className="text-3xl font-bold">
                  {stats.averageScore}%
                </span>
              </div>
              <h3 className="font-semibold">Average Score</h3>
              <p className="text-sm text-gray-500">Overall performance</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="text-blue-500" size={32} />
                <span className="text-3xl font-bold">
                  {Math.round(stats.totalTime / 60)}m
                </span>
              </div>
              <h3 className="font-semibold">Total Time</h3>
              <p className="text-sm text-gray-500">Time spent learning</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-purple-500" size={32} />
                <span
                  className={`text-3xl font-bold ${
                    stats.improvement >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.improvement > 0 ? "+" : ""}
                  {stats.improvement}%
                </span>
              </div>
              <h3 className="font-semibold">Improvement</h3>
              <p className="text-sm text-gray-500">Recent progress</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b">
              <div className="flex space-x-8 px-6">
                {["overview", "history", "achievements"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Performance by Theme
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(stats.themeScores || {}).map(
                        ([theme, data]) => {
                          const avgScore = Math.round(
                            data.totalScore / data.count
                          );
                          return (
                            <div
                              key={theme}
                              className="flex items-center space-x-4"
                            >
                              <span className="w-32 text-sm font-medium">
                                {theme}
                              </span>
                              <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                                <div
                                  className={`h-8 rounded-full flex items-center justify-end px-3 text-white text-sm font-medium ${
                                    avgScore >= 80
                                      ? "bg-green-500"
                                      : avgScore >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${avgScore}%` }}
                                >
                                  {avgScore}%
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {data.count} quizzes
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Performance
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-end space-x-2 h-32">
                        {quizHistory
                          .slice(0, 10)
                          .reverse()
                          .map((quiz, index) => (
                            <div
                              key={index}
                              className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors relative group"
                              style={{ height: `${quiz.percentage}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {quiz.percentage}%
                              </div>
                            </div>
                          ))}
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Last 10 quizzes
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Quiz History</h3>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {getFilteredHistory().length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No quizzes found for this period
                      </div>
                    ) : (
                      getFilteredHistory().map((quiz) => (
                        <div
                          key={quiz.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white ${
                                  quiz.percentage >= 80
                                    ? "bg-green-500"
                                    : quiz.percentage >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              >
                                {quiz.percentage}%
                              </div>
                              <div>
                                <p className="font-medium">
                                  {QUIZ_TYPES.find((t) => t.id === quiz.type)
                                    ?.name || quiz.type}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {quiz.theme} • {quiz.totalQuestions} questions
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {quiz.correctAnswers}/{quiz.totalQuestions}{" "}
                                correct
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(quiz.date).toLocaleDateString()} •{" "}
                                {formatTime(quiz.timeSpent)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "achievements" && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">
                    Achievements & Milestones
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "🎯",
                        title: "First Quiz",
                        description: "Complete your first quiz",
                        earned: quizHistory.length >= 1,
                      },
                      {
                        icon: "🔥",
                        title: "On Fire",
                        description: "Score 90% or higher",
                        earned: quizHistory.some((q) => q.percentage >= 90),
                      },
                      {
                        icon: "📚",
                        title: "Quiz Master",
                        description: "Complete 10 quizzes",
                        earned: quizHistory.length >= 10,
                      },
                      {
                        icon: "⚡",
                        title: "Speed Demon",
                        description: "Complete a quiz in under 5 minutes",
                        earned: quizHistory.some((q) => q.timeSpent < 300),
                      },
                      {
                        icon: "💯",
                        title: "Perfect Score",
                        description: "Get 100% on any quiz",
                        earned: quizHistory.some((q) => q.percentage === 100),
                      },
                      {
                        icon: "🏆",
                        title: "Champion",
                        description: "Average score above 80%",
                        earned: stats.averageScore >= 80,
                      },
                    ].map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-gray-50 opacity-50"
                        }`}
                      >
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h4 className="font-semibold mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✓ Earned
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
