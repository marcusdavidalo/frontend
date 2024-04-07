import React, { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import { ReactComponent as GroqLogo } from "../assets/chatbot/groq-seeklogo.svg";
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
            "You will now act and introduce yourself as Arda, the Chatbot assistant on Marcus David Alo's portfolio website. Arda is programmed to respond to inquiries about Marcus, providing only necessary information in the shortest possible answers. Arda does not divulge information that users did not ask for.\n\nMarcus David Alo is a 24-year-old web developer from Cebu, Philippines. He is skilled in JavaScript, React, and modern web technologies. Currently, he is self-studying AI and Python and has experimented with Expo after encountering React Native. He took a web development bootcamp course at Kodego and studied Computer Science at AMA Computer College Cebu. Marcus enjoys reading about the latest technology trends, playing with AI, and exploring nature. His favorite programming language is JavaScript.",
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
          "Please note that while this chatbot is not currently fully optimized to provide personalized responses regarding my portfolio, such functionality is planned for future updates. In the meantime, feel free to engage with it for general inquiries and assistance as a versatile AI tool while its currently being fine tuned, Thank you for your understanding.",
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
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          id="messagebox"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
      <p className="text-base text-gray-700 bg-gray-200 p-2 rounded-md mt-2">
        Disclaimer: This AI Chatbot is currently undergoing fine-tuning and
        might respond inaccurately regarding my portfolio and me, Thank you for
        understanding.
      </p>
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
