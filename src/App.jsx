import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import Chatbot from "./components/Chatbot";
import { AllRoutes } from "./routes/AllRoutes";
import "./App.css";

function App() {
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
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`transition-all ease-linear h-screen ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <Loader />
        <Chatbot />
        <AllRoutes />
      </Layout>
    </div>
  );
}

export default App;
