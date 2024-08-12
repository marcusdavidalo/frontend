import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

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
      className={` text-zinc-700 dark:text-zinc-300 h-[80vh] transition-all duration-200 ease-in-out z-10 max-w-[50%] ${
        isCollapsed ? "min-w-0 p-1" : "min-w-max p-4"
      } relative`}
    >
      <button
        className="absolute top-1/2 right-0 -mr-4  rounded-full p-1 transition-colors duration-300 -z-10"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        ) : (
          <ChevronLeftIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
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
      <div className="overflow-auto h-[calc(100%-3rem)]">
        {" "}
        {/* Adjust height to make room for header */}
        <ul>
          {conversations.map((conversation, index) => (
            <li
              key={index}
              className="bg-zinc-300 dark:bg-zinc-950/50 text-zinc-700 dark:text-zinc-300 rounded-md py-1 mb-2 cursor-pointer hover:bg-zinc-950 flex justify-between items-center transition-all duration-100 ease-in-out w-full"
              onClick={() => onConversationClick(conversation)}
            >
              <span
                className={`px-2 max-w-[50%] whitespace-nowrap ${
                  isCollapsed ? "hidden" : ""
                }`}
                title={conversation.name}
              >
                {conversation.name
                  ? conversation.name.substring(0, 30) +
                    (conversation.name.length > 15 ? "..." : "")
                  : `Conversation ${index + 1}`}
              </span>
              <div
                className={`flex justify-center align-middle px-2 ${
                  isCollapsed ? "hidden" : ""
                }`}
              >
                <button
                  className="text-zinc-600 hover:text-zinc-950"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(index);
                  }}
                >
                  <TrashIcon
                    className="w-5 h-5 outline-none inset-0 border-none active:scale-y-125 duration-50"
                    title="Delete Conversation"
                  />
                </button>
                <button
                  className="text-zinc-600 hover:text-zinc-950"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRenameConversation(index);
                  }}
                >
                  <PencilIcon
                    className="w-5 h-5 outline-none inset-0 border-none active:scale-y-125 duration-50"
                    title="Change Conversation Name"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
