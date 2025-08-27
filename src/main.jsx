import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Временно отключаем StrictMode для разработки, чтобы избежать двойных вызовов
// В продакшене можно включить обратно
const isDevelopment = process.env.NODE_ENV === "development";

ReactDOM.createRoot(document.getElementById("root")).render(
  isDevelopment ? (
    <App />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
);
