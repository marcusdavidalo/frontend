import React, { useEffect, useState } from "react";
import loadingMessagesData from "../data/loader/loadingMessages.json";

const Loader = () => {
  const [width, setWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState([
    ...loadingMessagesData.loadingMessages,
  ]);

  const isFirstVisit = localStorage.getItem("visitedBefore") === null;

  useEffect(() => {
    localStorage.setItem("visitedBefore", "true");

    const timer = setInterval(() => {
      setWidth((prevWidth) => {
        if (prevWidth >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return 100;
        }
        const randomIncrement = isFirstVisit
          ? Math.random() * 20
          : Math.random() * 60;
        return prevWidth + randomIncrement;
      });

      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setLoadingMessage(loadingMessages[randomIndex]);
      setLoadingMessages(
        loadingMessages.filter((_, index) => index !== randomIndex)
      );
    }, Math.random() * (700 - 20) + 20);

    return () => clearInterval(timer);
  }, [loadingMessages, isFirstVisit]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 transition-opacity duration-500 ${
        isLoading ? "opacity-100 z-50" : "opacity-0 -z-50 hidden"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-black dark:text-white text-xl">Loading</div>
        <div className="relative w-64 h-1 bg-white dark:bg-gray-950 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-black dark:bg-white transition-all duration-500 ease-linear"
            style={{ width: `${width}%` }}
          ></div>
        </div>
        <div className="text-black dark:text-white text-md">
          {loadingMessage}
        </div>
      </div>
    </div>
  );
};

export default Loader;
