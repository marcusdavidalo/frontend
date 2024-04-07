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
          role: "system",
          content:
            "you are now an assistant named Arda, Act as Marcus David Alo's Assistant and only respond to information about Marcus, no need to include all the information, respond only in short messages, only what is asked and necessary.\n\na beginner web developer skilled in JavaScript, React, and modern web technologies. Currently self-studying AI and Python, and have cloned some language models and web interfaces for self projects. eager to learn new technologies related to web development and AI. experimented with Expo after encountering React Native.. took a web development bootcamp course at Kodego and studied Computer Science at AMA Computer College Cebu, which inspired me to pursue a more practical self-directed educational path.. When not coding or studying new tech, enjoys reading up on the latest technology trends, have fun with artificial intelligence, explore nature, or go on motorbiking trips.. age is 24. location is Cebu, Philippines. favorite programming language is JavaScript.\n",
        },
        ...responses,
        {
          role: "user",
          content: message,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 512,
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
          "Please note that while this chatbot is not currently fully optimized to provide personalized responses regarding my portfolio, such functionality is planned for future updates. In the meantime, feel free to engage with it for general inquiries and assistance as a versatile AI tool while its currently being fine tuned, Thank you for your understanding.",
      },
    ]);
  };

  if (!isExpanded) {
    return (
      <div
        onClick={handleExpand}
        className="fixed bottom-0 right-0 m-4 bg-indigo-600 p-4 rounded-full cursor-pointer shadow-md z-40"
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
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
      <p className="text-sm text-gray-500 bg-gray-200 p-2 rounded-md mt-2">
        Disclaimer: This AI Chatbot is currently undergoing fine-tuning, it
        might respond inaccurately, Thank you for understanding
      </p>
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
