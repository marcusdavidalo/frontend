import React, { useState } from "react";
import Groq from "groq-sdk";
import Me from "../assets/home/Me.png";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const sendMessage = async () => {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "mixtral-8x7b-32768",
    });

    setResponses([
      ...responses,
      { role: "user", content: message },
      {
        role: "assistant",
        content: chatCompletion.choices[0]?.message?.content || "",
      },
    ]);
    setMessage("");
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setResponses([
      {
        role: "assistant",
        content:
          "Thank you for your understanding. Please note that while this chatbot is not currently optimized to provide personalized responses regarding my portfolio, such functionality is planned for future updates. In the meantime, feel free to engage with it for general inquiries and assistance as a versatile AI tool.",
      },
    ]);
  };

  if (!isExpanded) {
    return (
      <div
        onClick={handleExpand}
        className="fixed bottom-0 right-0 m-4 bg-indigo-600 p-4 rounded-full cursor-pointer shadow-md"
      >
        <ChatBubbleLeftIcon className="h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 m-6 bg-white p-6 rounded-lg shadow-lg w-96 z-40">
      <div className="overflow-y-auto max-h-96 min-h-96 mb-4">
        {responses.map((response, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 m-2 max-w-96 rounded-lg ${
              response.role === "assistant"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {response.role === "assistant" && (
              <img
                src={Me}
                alt="Your Name"
                className="h-10 w-10 rounded-full"
              />
            )}
            <p className="text-lg font-medium">{response.content}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-0 left-0 m-1 p-1 text-gray-700 hover:text-gray-900"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Chatbot;
