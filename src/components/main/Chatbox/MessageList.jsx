import React, { useState } from "react";
import { formatMessage } from "../../../utils/messageFormatting";

const MessageList = ({
  messages = [],
  onDeleteMessage,
  onEditMessage,
  onSaveEdit,
}) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editInput, setEditInput] = useState("");

  const handleMenuToggle = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditInput(messages[index].content);
    setMenuOpen(null);
  };

  const handleSave = (index) => {
    onSaveEdit(index, editInput);
    setEditIndex(null);
    // Delete all messages after the edited message
    for (let i = messages.length - 1; i > index; i--) {
      onDeleteMessage(i);
    }
  };

  return (
    <div className="flex justify-center flex-grow overflow-y-auto p-4 space-y-4">
      <div className="container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } items-start mb-4`}
          >
            <div
              className={`relative max-w-xl px-4 mx-10 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-zinc-500 dark:bg-zinc-700 text-white"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {editIndex === index ? (
                <div>
                  <textarea
                    className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg resize-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    rows="3"
                  />
                  <button
                    onClick={() => handleSave(index)}
                    className="mt-2 px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition duration-200"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="whitespace-pre-wrap space-y-2">
                  {formatMessage(message.content)}
                </div>
              )}
            </div>
            {message.role === "user" && (
              <div className="ml-2 relative">
                <button
                  onClick={() => handleMenuToggle(index)}
                  className="bg-zinc-600 dark:bg-zinc-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ⋮
                </button>
                {menuOpen === index && (
                  <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-zinc-700 shadow-lg rounded-lg py-1 z-10">
                    <button
                      onClick={() => handleEdit(index)}
                      className="block w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDeleteMessage(index);
                        setMenuOpen(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
