import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import Groq from "groq-sdk";
import { ReactComponent as GroqLogo } from "../assets/chatbot/groq-seeklogo.svg";
import Me from "../assets/home/Me.png";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [responses]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setResponses((prevResponses) => [
      ...prevResponses,
      { role: "user", content: message },
    ]);
    setIsTyping(true);

    setMessage("");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You will now act and introduce yourself as Arda, the Chatbot assistant on Marcus David Alo's portfolio website. Arda is designed to respond concisely to inquiries about Marcus, providing only the requested information. If Arda does not have an answer for an inquiry, it will guide the user to the contact page. Arda may still fulfill general unrelated inquiries as long as it is not too far out of scope. \n\nMarcus David Alo is a 24-year-old beginner web developer from Cebu, Philippines. His expertise lies in MERN tech-stack. He is currently self-studying AI and Python, and has explored Expo after discovering React Native. \n\nMarcus completed a web development bootcamp at Kodego and pursued Computer Science at AMA Computer College Cebu in which he droppped out because Computer Science was being treated like IT and learned nothing related to it. He enjoys staying updated with the latest technology trends, experimenting with AI, and exploring nature. His preferred programming language is JavaScript. He has no work experience aside from his Bootcamp projects and Pet Projects.",
        },
        {
          role: "assistant",
          content:
            "Hello! My name is Arda, I'm Marcus David Alo's Chat Assistant. I operate using the Mixtral-8x7b-32768 model via GROQ. How may I assist you today?",
        },
        ...responses,
        {
          role: "user",
          content: message,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 768,
      top_p: 0.75,
    });

    setIsTyping(false);
    setResponses((prevResponses) => [
      ...prevResponses,
      {
        role: "assistant",
        content: chatCompletion.choices[0]?.message?.content || "",
      },
    ]);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setResponses([
      {
        role: "assistant",
        content:
          "Hello! My name is Arda, I'm Marcus David Alo's Chat Assistant. I operate using the Mixtral-8x7b-32768 model via GROQ. How may I assist you today?",
      },
    ]);
  };

  if (!isExpanded) {
    return (
      <div
        onClick={handleExpand}
        className="fixed bottom-0 right-0 m-4 bg-indigo-600 p-2 rounded-full cursor-pointer shadow-md z-40"
      >
        <ChatBubbleLeftIcon className="h-10 w-10 text-white" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 m-6 bg-white p-6 rounded-lg shadow-lg max-w-sm z-40">
      <div className="flex justify-start mx-2 mb-2">
        <p className="text-base text-gray-500 bg-gray-200 px-2 rounded-md">
          Powered by{" "}
          <a href="https://groq.com/" rel="noreferrer noopener" target="_blank">
            <GroqLogo className="inline h-8 w-8" />
          </a>
        </p>
      </div>
      <div className="overflow-y-auto max-h-72 min-h-72 mb-4">
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
            <p className="font-semibold text-base md:text-xl">
              {response.content}
            </p>
          </div>
        ))}
        {isTyping && <div className="typing-animation">Arda is typing...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center space-x-2">
        <InformationCircleIcon
          data-tip
          data-tooltip-id="disclaimerTooltip"
          className="h-6 w-6 text-gray-700 cursor-pointer hover:scale-110"
        />
        <Tooltip
          id="disclaimerTooltip"
          place="top"
          effect="solid"
          className="max-w-lg rounded-md font-mono"
        >
          Please Note: This AI Assistant is continuously being refined and may
          occasionally provide inaccurate details about my background and
          professional endeavors. Your understanding is appreciated.
        </Tooltip>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isTyping) {
              sendMessage();
            }
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button
          onClick={sendMessage}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          disabled={isTyping}
        >
          Send
        </button>
      </div>
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-0 right-0 m-1 p-2 text-gray-700 hover:text-gray-900"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Chatbot;
