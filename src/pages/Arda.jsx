import React, { useState, useEffect, useCallback } from "react";
import ChatWindow from "../components/main/Chatbox";
import useTitle from "../hooks/useTitle";
import { getGroqModels } from "../utils/groqClient";

const Arda = () => {
  const [conversation, setConversation] = useState({
    id: Date.now(),
    messages: [],
  });
  const [models, setModels] = useState([]);
  const [systemPrompt, setSystemPrompt] = useState("");

  useTitle("Arda");

  useEffect(() => {
    const loadModels = async () => {
      const availableModels = await getGroqModels();
      setModels(availableModels);
    };

    loadModels();
  }, []);

  const getCurrentTime = useCallback(
    () => ({
      local: new Date().toLocaleTimeString(),
      utc: new Date().toUTCString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    []
  );

  useEffect(() => {
    const updateSystemPrompt = () => {
      const { local, utc, timezone } = getCurrentTime();

      setSystemPrompt(
        `Only provide these information when asked:\nCurrent Local Time: ${local}\nCurrent Time (UTC): ${utc}\nUser's Timezone: ${timezone}\nModel used: llama-3.1-70b-versatile}
         - Be friendly and accurate.
         - Provide only information being asked of you.
         - When solving math problems, show all steps. Don't give answers upfront; break down operations into additions/subtractions, never combine more than two numbers at a time. For multiplication/division, convert to additions/subtractions.
         - do not provide information not being asked of you.
         - when coding create a list of potential problems and modify the user's sent code to fix those problems accurately.
         - When reasoning through complex problems, wrap your thinking process in <think> </think> tags so the user can optionally view your reasoning process.
        `
      );
    };

    updateSystemPrompt();
    const interval = setInterval(updateSystemPrompt, 60000); // update every minute

    return () => clearInterval(interval);
  }, [models, getCurrentTime]);

  const handleConversationUpdate = (updatedConversation) => {
    setConversation(updatedConversation);
    // If you want to save the conversation to localStorage:
    // localStorage.setItem("currentConversation", JSON.stringify(updatedConversation));
  };

  return (
    <div className="max-h-screen bg-zinc-100 dark:bg-zinc-950/50">
      <style jsx global>{`
        .thinking-section summary:hover {
          color: #6b7280;
        }

        .thinking-section .thinking-content {
          background-color: #f9fafb;
          border-radius: 0.375rem;
          padding: 0.75rem;
          margin-top: 0.5rem;
        }

        .dark .thinking-section .thinking-content {
          background-color: #1f2937;
          color: #d1d5db;
        }

        .thinking-section summary::marker {
          color: #6b7280;
        }

        .thinking-section summary:focus {
          outline: none;
        }

        @keyframes thinking-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .thinking-section[open] .thinking-content {
          animation: thinking-fade-in 0.3s ease-in-out;
        }
      `}</style>
      <div className="flex-grow">
        <ChatWindow
          conversation={conversation}
          onConversationUpdate={handleConversationUpdate}
          models={models}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />
      </div>
    </div>
  );
};

export default Arda;
