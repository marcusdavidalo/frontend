import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import Groq from "groq-sdk";
import { ReactComponent as GroqLogo } from "../assets/chatbot/groq-seeklogo.svg";
import Me from "../assets/home/Me.png";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const Chatbot = () => {
  const location = useLocation();
  const isArdaRoute = location.pathname === "/arda";
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [tone, setTone] = useState("Normal");

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
          content: `You will now act and introduce yourself as Arda, the Chatbot assistant on Marcus David Alo's portfolio website. Arda is designed to respond concisely to inquiries about Marcus, providing only the requested information. If Arda does not have an answer for an inquiry, it will guide the user to the contact page. Arda may still fulfill general unrelated inquiries as long as it is not too far out of scope. \n\nMarcus David Alo is a 24-year-old beginner web developer from Cebu, Philippines. His expertise lies in MERN tech-stack. He is currently self-studying AI and Python, and has explored Expo after discovering React Native. \n\nMarcus completed a web development bootcamp at Kodego and pursued Computer Science at AMA Computer College Cebu in which he droppped out because Computer Science was being treated like IT and learned nothing related to it. He enjoys staying updated with the latest technology trends, experimenting with AI, and exploring nature. His preferred programming language is JavaScript. He has no work experience aside from his Bootcamp projects and Pet Projects. \n\nSpeech Tone: ${tone}`,
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
        content: `Hello! My name is Arda, I'm the Chat Assistant on this site. I operate using the Mixtral-8x7b-32768 model via GROQ LPU. How may I assist you today?`,
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

  if (isArdaRoute) return null;

  return (
    <div className="fixed bottom-0 right-0 m-6 bg-zinc-950 border-b-4 border-r-4 border-indigo-800 p-6 rounded-lg shadow-md z-40">
      <div className="flex justify-start mx-2 mb-2">
        <p className="text-base text-zinc-400 bg-zinc-800 px-2 rounded-md">
          Powered by{" "}
          <a href="https://groq.com/" rel="noreferrer noopener" target="_blank">
            <GroqLogo
              data-tooltip-id="groqtooltip"
              className="inline h-8 w-8 mx-1 text-white"
            />
            <Tooltip
              id="groqtooltip"
              place="top"
              effect="solid"
              className="max-w-lg rounded-md font-mono"
            >
              This opens a new tab to groq's main site.
            </Tooltip>
          </a>
        </p>
      </div>
      <div className="overflow-y-auto max-h-72 min-h-72 mb-4">
        {responses.map((response, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 m-2 max-w-96 rounded-lg border-b-4 border-r-4 ${
              response.role === "assistant"
                ? "bg-indigo-800 text-indigo-200 border-indigo-700"
                : "bg-zinc-800 text-zinc-200 border-zinc-700 flex-row-reverse"
            }`}
          >
            {response.role === "assistant" && (
              <img
                src={Me}
                alt="Your Name"
                className="h-10 w-10 rounded-full"
              />
            )}
            <ReactMarkdown
              components={{
                code: ({ node, inline, children, ...props }) => {
                  return !inline ? (
                    <div className="relative rounded-md shadow-sm font-mono font-normal text-sm bg-zinc-900 max-w-screen-sm overflow-auto">
                      <pre className="p-4 rounded-md bg-zinc-950/70 text-white overflow-auto">
                        <code {...props}>{children}</code>
                      </pre>
                    </div>
                  ) : (
                    <code {...props}>{children}</code>
                  );
                },
              }}
              remarkPlugins={[gfm]}
              className="font-semibold text-base md:text-xl whitespace-pre-wrap"
            >
              {response.content}
            </ReactMarkdown>
          </div>
        ))}
        {isTyping && <div className="typing-animation">Arda is typing...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="flex items-center space-x-2">
        <InformationCircleIcon
          data-tooltip-id="disclaimerTooltip"
          className="h-6 w-6 text-zinc-300 cursor-pointer hover:scale-110"
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
        <div className="flex space-x-2">
          <button
            onClick={() => setTone("Normal")}
            className={`px-2 py-1 rounded-md ${
              tone === "Normal"
                ? "bg-indigo-800 text-indigo-200"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setTone("Friendly")}
            className={`px-2 py-1 rounded-md ${
              tone === "Friendly"
                ? "bg-indigo-800 text-indigo-200"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            Friendly
          </button>
          <button
            onClick={() => setTone("Professional")}
            className={`px-2 py-1 rounded-md ${
              tone === "Professional"
                ? "bg-indigo-800 text-indigo-200"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            Professional
          </button>
        </div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isTyping) {
              sendMessage();
            }
          }}
          className="bg-zinc-800 text-zinc-200 flex-1 px-4 py-2 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
        className="absolute top-0 right-0 m-1 p-2 text-zinc-300 hover:text-zinc-100"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Chatbot;
