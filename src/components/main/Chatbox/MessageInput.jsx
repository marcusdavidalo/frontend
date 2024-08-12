import React, { useState, useEffect } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput(""); // Clear the input field after sending
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-12 items-center gap-2 p-4 border-t border-zinc-300 dark:border-zinc-700 absolute w-full h-max bottom-0 container rounded-lg">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg resize-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 col-span-11"
          placeholder="Type your message..."
          rows="3"
        />
        <button
          onClick={handleSend}
          className="h-full p-2 bg-primary dark:bg-primary-dark text-white bg-white dark:bg-zinc-700 rounded-lg hover:bg-primary-dark dark:hover:bg-primary transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
