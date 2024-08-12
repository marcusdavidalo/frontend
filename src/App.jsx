import React, { useState, useEffect, Suspense } from "react";
import Layout from "./components/other/Layout";
import Loader from "./components/reusable/Loader";
import { AllRoutes } from "./routes/AllRoutes";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedIsDarkMode = localStorage.getItem("isDarkMode");
    if (savedIsDarkMode !== null) {
      return JSON.parse(savedIsDarkMode);
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
      return prefersDarkMode.matches;
    }
  });

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    localStorage.setItem("isDarkMode", JSON.stringify(newIsDarkMode));
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      document.body.classList.add("bg-zinc-950");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.remove("bg-zinc-950");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`h-screen bg-white dark:bg-zinc-800 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <Suspense fallback={<Loader />}>
          <AllRoutes />
        </Suspense>
      </Layout>
    </div>
  );
}

export default App;
