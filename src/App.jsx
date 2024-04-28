import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import Chatbot from "./components/Chatbot";
import { AllRoutes } from "./routes/AllRoutes";
import { useLocation } from "react-router-dom";
import "./App.css";

function App() {
  const location = useLocation();
  const isArdaRoute = location.pathname === "/arda";
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedIsDarkMode = localStorage.getItem("isDarkMode");
    return savedIsDarkMode !== null ? JSON.parse(savedIsDarkMode) : false;
  });

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", JSON.stringify(newIsDarkMode));
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      document.body.classList.add("bg-gray-950");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.remove("bg-gray-950");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`h-screen bg-white dark:bg-gray-800 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <Loader />
        {!isArdaRoute && <Chatbot />}
        <AllRoutes />
      </Layout>
    </div>
  );
}

export default App;
