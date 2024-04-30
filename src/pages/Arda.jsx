import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import Sidebar from "../components/arda/Sidebar";
import ChatWindow from "../components/arda/ChatWindow";
import { v4 as uuidv4 } from "uuid";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const Arda = () => {
  const [savedConversations, setSavedConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({
    id: uuidv4(),
    messages: [],
  });

  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setSavedConversations(JSON.parse(savedConversations));
    }
  }, []);

  const saveConversation = (conversations) => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  };

  const loadConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  const updateCurrentConversation = (updatedConversation) => {
    setCurrentConversation(updatedConversation);

    const conversationIndex = savedConversations.findIndex(
      (conversation) => conversation.id === updatedConversation.id
    );

    if (conversationIndex !== -1) {
      const updatedSavedConversations = [...savedConversations];
      updatedSavedConversations[conversationIndex] = updatedConversation;
      setSavedConversations(updatedSavedConversations);
      saveConversation(updatedSavedConversations);
    } else {
      const newSavedConversations = [
        ...savedConversations,
        updatedConversation,
      ];
      setSavedConversations(newSavedConversations);
      saveConversation(newSavedConversations);
    }
  };

  const deleteConversation = (index) => {
    const updatedConversations = [...savedConversations];
    updatedConversations.splice(index, 1);
    setSavedConversations(updatedConversations);
    saveConversation(updatedConversations);
  };

  const renameConversation = (index) => {
    const newName = prompt("Enter the new name for the conversation:");
    if (newName !== null && newName.trim() !== "") {
      const updatedConversations = [...savedConversations];
      updatedConversations[index].name = newName;
      setSavedConversations(updatedConversations);
      saveConversation(updatedConversations);
    }
  };

  const startNewConversation = () => {
    setCurrentConversation({ id: uuidv4(), messages: [] });
  };

  return (
    <div className="flex h-screen w-full dark:bg-gray-900">
      <Sidebar
        conversations={savedConversations}
        onConversationClick={loadConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
        onNewConversation={startNewConversation}
      />
      <ChatWindow
        groq={groq}
        currentConversation={currentConversation}
        onConversationUpdate={updateCurrentConversation}
      />
    </div>
  );
};

export default Arda;
