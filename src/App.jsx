import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import Chatbot from "./components/Chatbot";
import { AllRoutes } from "./routes/AllRoutes";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get the initial dark mode setting from localStorage
    const savedIsDarkMode = localStorage.getItem("isDarkMode");
    return savedIsDarkMode !== null ? JSON.parse(savedIsDarkMode) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    // Save the current dark mode setting to localStorage
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <div
      className={`transition-all ease-linear h-screen ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <Layout toggleDarkMode={toggleDarkMode}>
        <Loader />
        <Chatbot />
        <AllRoutes />
      </Layout>
    </div>
  );
}

export default App;
