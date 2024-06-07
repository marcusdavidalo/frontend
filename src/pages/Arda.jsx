import React, { useState, useEffect, useMemo } from "react";
import Groq from "groq-sdk";
import Sidebar from "../components/arda/Sidebar";
import ChatWindow from "../components/arda/ChatWindow";
import { v4 as uuidv4 } from "uuid";
import useTitle from "../hooks/useTitle";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE;
const CX = process.env.REACT_APP_SEARCH_ENGINE_ID;

const Arda = () => {
  const [savedConversations, setSavedConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({
    id: uuidv4(),
    messages: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const models = useMemo(
    () => [
      "llama3-70b-8192",
      "llama3-8b-8192",
      "mixtral-8x7b-32768",
      "gemma-7b-it",
    ],
    []
  );

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

  const getShortName = async (messages) => {
    try {
      const response = await groq.chat.completions.create({
        messages,
        model: models[0],
        temperature: 0.7,
        max_tokens: 100,
        top_p: 1,
        stop: null,
      });
      const shortName = response.choices[0]?.message?.content.trim();
      return shortName || "Untitled Conversation";
    } catch (error) {
      console.error("Error fetching short name from Groq:", error);
      return "Untitled Conversation";
    }
  };

  useTitle("Arda");

  return (
    <div className="flex h-full">
      <Sidebar
        conversations={savedConversations}
        onConversationClick={loadConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
        onNewConversation={startNewConversation}
      />
      <ChatWindow
        currentConversation={currentConversation}
        onConversationUpdate={updateCurrentConversation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        models={models}
        groq={groq}
        GOOGLE_API_KEY={GOOGLE_API_KEY}
        CX={CX}
        getShortName={getShortName} // Pass the function to ChatWindow
      />
    </div>
  );
};

export default Arda;
