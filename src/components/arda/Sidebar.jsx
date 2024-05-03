import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const Sidebar = ({
  conversations,
  onConversationClick,
  onDeleteConversation,
  onRenameConversation,
  onNewConversation,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 h-screen transition-all duration-200 ease-in-out ${
        isCollapsed ? "min-w-0 p-1" : "min-w-max px-10 py-4"
      } relative`}
    >
      <button
        className="absolute top-1/2 right-0 -mr-4 bg-gray-100 dark:bg-gray-900 rounded-full p-1 transition-colors duration-300 z-10"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>
      <div className={`flex ${isCollapsed ? "hidden overflow-hidden" : ""}`}>
        <h2 className={`text-lg font-bold mb-4 ${isCollapsed ? "hidden" : ""}`}>
          Previous Conversations
        </h2>
        <button
          onClick={onNewConversation}
          className="inline-flex items-center justify-center mx-2 h-6 w-6 border border-transparent text-4xl text-center font-medium rounded-full text-white bg-green-600 hover:bg-green-700"
          title="New Conversation"
        >
          +
        </button>
      </div>
      <ul>
        {conversations.map((conversation, index) => (
          <li
            key={index}
            className={`bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md p-2 mb-2 cursor-pointer hover:bg-gray-600 flex justify-between items-center w-max transition-all duration-200 ease-in-out ${
              isCollapsed ? "hidden overflow-hidden" : ""
            }`}
            onClick={() => onConversationClick(conversation)}
          >
            <span
              className={`px-2 ${isCollapsed ? "hidden" : ""}`}
              title={conversation.name || `Conversation ${index + 1}`}
            >
              {conversation.name
                ? conversation.name.substring(0, 15) +
                  (conversation.name.length > 15 ? "..." : "")
                : `Conversation ${index + 1}`}
            </span>
            <div className={`${isCollapsed ? "hidden" : ""}`}>
              <button
                className="text-sm text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(index);
                }}
              >
                Delete
              </button>
              <button
                className="text-sm text-blue-500 hover:text-blue-700 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameConversation(index);
                }}
              >
                Rename
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
