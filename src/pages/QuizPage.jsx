import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  X,
  RefreshCw,
  Trophy,
} from "lucide-react";
import * as api from "../api";
import { QUIZ_TYPES, formatTime } from "../data";
import { useLocalStorage } from "../App";
import { Loader } from "../components/Utils";

const QuizPage = ({ navigate, t }) => {
  const [quizType, setQuizType] = useState("");
  const [theme, setTheme] = useState("all");
  const [themes, setThemes] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizHistory, setQuizHistory] = useLocalStorage("quizHistory", []);
  const timerRef = useRef(null);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const response = await api.getThemes();
      setThemes(response || []);
    } catch (error) {
      console.error("Error loading themes:", error);
    }
  };

  useEffect(() => {
    if (isQuizActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isQuizActive) {
      handleFinishQuiz();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isQuizActive]);

  const handleStartQuiz = async () => {
    if (!quizType) {
      alert("Please select a quiz type");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.getQuizQuestions(
        quizType,
        theme,
        questionCount
      );
      const quizQuestions = response.data || [];

      if (quizQuestions.length === 0) {
        alert("No questions available for selected criteria");
        setIsLoading(false);
        return;
      }

      setQuestions(quizQuestions);
      setAnswers(new Array(quizQuestions.length).fill(""));
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setTimeLeft(questionCount * 60);
      setIsQuizActive(true);
      setShowResult(false);
    } catch (error) {
      console.error("Error loading quiz:", error);
      alert("Error loading quiz questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      alert("Please select an answer");
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);

      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || "");
    }
  };

  const handleFinishQuiz = () => {
    setIsQuizActive(false);

    let correctCount = 0;
    const detailedResults = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        question: q.question,
        userAnswer: answers[i] || "No answer",
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const result = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: quizType,
      theme: theme,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      percentage: Math.round((correctCount / questions.length) * 100),
      timeSpent: questionCount * 60 - timeLeft,
      details: detailedResults,
    };

    setQuizResult(result);
    setShowResult(true);

    const newHistory = [result, ...quizHistory.slice(0, 49)];
    setQuizHistory(newHistory);

    api.submitQuizResult(result).catch(console.error);
  };

  const handleResetQuiz = () => {
    setQuizType("");
    setTheme("all");
    setQuestionCount(10);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer("");
    setShowResult(false);
    setQuizResult(null);
    setTimeLeft(0);
    setIsQuizActive(false);
  };

  // Quiz setup screen
  if (!isQuizActive && !showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 xl:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">{t("quiz.title")}</h1>
              <p className="text-xl text-gray-600">
                Choose your quiz settings and test your knowledge
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8">
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4">
                  {t("quiz.selectType")}
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {QUIZ_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setQuizType(type.id)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        quizType === type.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h3 className="font-semibold mb-1">
                        {t(`quiz.types.${type.id}`)}
                      </h3>
                      <p className="text-sm text-gray-600">{type.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4">
                  {t("quiz.selectTheme")}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => setTheme("all")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === "all"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">📚</div>
                    <p className="text-sm font-medium">All Themes</p>
                  </button>

                  {themes.map((th) => (
                    <button
                      key={th._id}
                      onClick={() => setTheme(th.name_en)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === th.name_en
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-sm font-medium">{th.name_en}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {th.terms_count || 0} terms
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4">
                  {t("quiz.questionsCount")}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold min-w-[80px] text-center">
                    {questionCount} questions
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>5</span>
                  <span>15</span>
                  <span>30</span>
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={!quizType || isLoading}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                  quizType && !isLoading
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader size="small" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Brain size={24} />
                    <span>{t("quiz.startQuiz")}</span>
                  </>
                )}
              </button>
            </div>

            {quizHistory.length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
                <div className="space-y-3">
                  {quizHistory.slice(0, 5).map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
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
                            {QUIZ_TYPES.find((t) => t.id === quiz.type)?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(quiz.date).toLocaleDateString()} •{" "}
                            {quiz.totalQuestions} questions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {quiz.correctAnswers} correct
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTime(quiz.timeSpent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz active screen
  if (isQuizActive && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 xl:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium">
                    {t("quiz.question")} {currentQuestionIndex + 1} /{" "}
                    {questions.length}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {QUIZ_TYPES.find((t) => t.id === quizType)?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={20} />
                    <span className="font-mono font-medium">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to quit the quiz?"
                        )
                      ) {
                        handleResetQuiz();
                      }
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-8">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === option
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswer === option && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
                    currentQuestionIndex === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>{t("common.previous")}</span>
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
                  >
                    <CheckCircle size={20} />
                    <span>{t("quiz.finish")}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
                  >
                    <span>{t("common.next")}</span>
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-medium mb-3">Question Navigator</h3>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[currentQuestionIndex] = selectedAnswer;
                      setAnswers(newAnswers);
                      setCurrentQuestionIndex(index);
                      setSelectedAnswer(answers[index] || "");
                    }}
                    className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                      index === currentQuestionIndex
                        ? "bg-green-600 text-white"
                        : answers[index]
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResult && quizResult) {
    return <QuizResults result={quizResult} onRetry={handleResetQuiz} t={t} />;
  }

  return <Loader />;
};

// Quiz Results Component
const QuizResults = ({ result, onRetry, t }) => {
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return "Excellent! Outstanding performance!";
    if (percentage >= 80) return "Great job! Keep up the good work!";
    if (percentage >= 70) return "Good effort! Room for improvement.";
    if (percentage >= 60) return "Not bad! Keep practicing.";
    return "Keep studying! You can do better!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {t("quiz.results.title")}
            </h1>
            <p className="text-xl text-gray-600">
              {getScoreMessage(result.percentage)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-5xl font-bold mb-4 ${getScoreColor(
                  result.percentage
                )}`}
              >
                {result.percentage}%
              </div>
              <p className="text-2xl font-semibold mb-2">
                {result.correctAnswers} out of {result.totalQuestions} correct
              </p>
              <p className="text-gray-600">
                Time taken: {formatTime(result.timeSpent)}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <CheckCircle
                  className="text-green-600 mx-auto mb-2"
                  size={32}
                />
                <p className="text-2xl font-bold text-green-600">
                  {result.correctAnswers}
                </p>
                <p className="text-sm text-gray-600">
                  {t("quiz.results.correct")}
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 text-center">
                <X className="text-red-600 mx-auto mb-2" size={32} />
                <p className="text-2xl font-bold text-red-600">
                  {result.incorrectAnswers}
                </p>
                <p className="text-sm text-gray-600">
                  {t("quiz.results.incorrect")}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Clock className="text-blue-600 mx-auto mb-2" size={32} />
                <p className="text-2xl font-bold text-blue-600">
                  {formatTime(result.timeSpent)}
                </p>
                <p className="text-sm text-gray-600">
                  {t("quiz.results.time")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onRetry}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <RefreshCw size={20} />
                <span>{t("quiz.results.tryAgain")}</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center space-x-2"
              >
                <Brain size={20} />
                <span>{t("quiz.results.backToQuizzes")}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Detailed Results</h2>
            <div className="space-y-4">
              {result.details.map((detail, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    detail.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">
                      Question {index + 1}: {detail.question}
                    </p>
                    {detail.isCorrect ? (
                      <CheckCircle
                        className="text-green-600 flex-shrink-0"
                        size={20}
                      />
                    ) : (
                      <X className="text-red-600 flex-shrink-0" size={20} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Your answer:{" "}
                    <span
                      className={
                        detail.isCorrect ? "text-green-700" : "text-red-700"
                      }
                    >
                      {detail.userAnswer}
                    </span>
                  </p>
                  {!detail.isCorrect && (
                    <p className="text-sm text-gray-600">
                      Correct answer:{" "}
                      <span className="text-green-700 font-medium">
                        {detail.correctAnswer}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
