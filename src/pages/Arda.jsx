import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const updateSystemPrompt = () => {
      const now = new Date();
      const utcTime = now.toUTCString();
      const localTime = now.toLocaleString();
      setSystemPrompt(
        `You are a helpful AI assistant named Arda. Current UTC time is ${utcTime}, and local time is ${localTime}.`
      );
    };

    updateSystemPrompt();
    const interval = setInterval(updateSystemPrompt, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  const handleConversationUpdate = (updatedConversation) => {
    setConversation(updatedConversation);
    // If you want to save the conversation to localStorage:
    // localStorage.setItem("currentConversation", JSON.stringify(updatedConversation));
  };

  return (
    <div className="h-screen bg-zinc-100 dark:bg-zinc-950/50">
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
