import React, { useEffect, useState } from "react";
import loadingMessagesData from "../data/loader/loadingMessages.json";

const Loader = () => {
  const [width, setWidth] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState([
    ...loadingMessagesData.loadingMessages,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWidth((prevWidth) => {
        if (prevWidth >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = Math.random() * 5;
        return prevWidth + increment;
      });

      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setLoadingMessage(loadingMessages[randomIndex]);
      setLoadingMessages(
        loadingMessages.filter((_, index) => index !== randomIndex)
      );
    }, 500); // Adjust the interval as needed

    return () => clearInterval(timer);
  }, [loadingMessages]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 transition-opacity duration-500 opacity-100 z-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-black dark:text-white text-xl">Loading</div>
        <div className="relative w-64 h-1 bg-white dark:bg-zinc-950 rounded-full overflow-hidden">
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
