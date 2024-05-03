import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import copy from "clipboard-copy";
import { ReactComponent as GroqLogo } from "../../assets/chatbot/groq-seeklogo.svg";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Me from "../../assets/home/Me.png";

const ChatWindow = ({ groq, currentConversation, onConversationUpdate }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const chatEndRef = useRef(null);
  const [rows, setRows] = useState(1);
  const [tone, setTone] = useState("Normal");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  const handleDelete = useCallback(
    (index) => {
      const updatedMessages = currentConversation.messages.slice(0, index);
      onConversationUpdate({
        ...currentConversation,
        messages: updatedMessages,
      });
    },
    [currentConversation, onConversationUpdate]
  );

  const handleEditStart = useCallback(
    (index) => {
      setEditingMessage(index);
      setEditedMessage(currentConversation.messages[index].content);
    },
    [currentConversation.messages]
  );

  const handleToneChange = (e) => {
    setTone(e.target.value);
  };

  const scrollToBottom = () => {
    if (currentConversation.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [currentConversation]);

  const getCurrentTimeLocal = () => {
    const date = new Date();
    return date.toLocaleTimeString();
  };

  const getCurrentTimeUTC = () => {
    const date = new Date();
    return date.toUTCString();
  };

  const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const sendMessage = useCallback(
    async (resendMessage, messages = currentConversation.messages) => {
      const models = [
        "llama3-70b-8192",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        "gemma-7b-it",
        "llama2-70b-4096",
      ];
      const messageContent = resendMessage || message;
      if (messageContent.trim() === "") return;

      // Get the last 8000 characters of the conversation history
      let conversationHistory = messages
        ? [...messages, { role: "user", content: messageContent }]
        : [{ role: "user", content: messageContent }];
      let conversationHistoryStr = conversationHistory
        .map((msg) => msg.content)
        .join(" ");
      if (conversationHistoryStr.length > 8000) {
        let startIndex = conversationHistoryStr.length - 8000;
        conversationHistoryStr = conversationHistoryStr.substring(startIndex);
        conversationHistory = conversationHistoryStr
          .split(" ")
          .map((content) => ({ role: "user", content }));
      }

      const updatedConversation = {
        id: currentConversation.id,
        messages: conversationHistory,
      };

      onConversationUpdate(updatedConversation);
      setIsTyping(true);

      if (!resendMessage) {
        setMessage("");
        setRows(1);
      }

      const currentTimeLocal = getCurrentTimeLocal();
      const currentTimeUTC = getCurrentTimeUTC();
      const userTimezone = getUserTimezone();

      let chatCompletion;
      for (let model of models) {
        try {
          chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `Additional Information: \nCurrent Local Time: ${currentTimeLocal}\nCurrent Time (UTC): ${currentTimeUTC}\nUser's Timezone: ${userTimezone}\n Model used: ${model}`,
              },
              {
                role: "system",
                content: `You will respond in a ${tone} tone, and only respond to what is being asked, no need for additional information. do not be creepy`,
              },
              {
                role: "system",
                content: `You will now act and introduce yourself as Arda, an AI on Marcus David Alo's portfolio website, You will converse in a ${tone} tone or persona, casual, but still professional way, like meeting with or greeting strangers, be natural, dont be afraid to use filler words in conversations, dont be afraid to use shortcuts, be polite, dont be overwhelming, only respond in the language the person is using to talk to you.`,
              },
              ...updatedConversation.messages,
            ],
            model: model,
            temperature: 0.65,
            max_tokens: 8192,
            top_p: 0.75,
          });
          break;
        } catch (error) {
          console.error(`Error with model ${model}:`, error);
        }
      }

      setIsTyping(false);
      const updatedConversationWithResponse = {
        id: updatedConversation.id,
        messages: [
          ...updatedConversation.messages,
          {
            role: "assistant",
            content: chatCompletion?.choices[0]?.message?.content || "",
          },
        ],
      };

      onConversationUpdate(updatedConversationWithResponse);
    },
    [
      currentConversation.id,
      currentConversation.messages,
      groq.chat.completions,
      message,
      onConversationUpdate,
      tone,
    ]
  );

  const updateConversation = useCallback(
    async (updatedMessages) => {
      onConversationUpdate({
        ...currentConversation,
        messages: updatedMessages,
      });
      setIsTyping(true);

      const models = [
        "llama3-70b-8192",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        "gemma-7b-it",
        "llama2-70b-4096",
      ];
      const currentTimeLocal = getCurrentTimeLocal();
      const currentTimeUTC = getCurrentTimeUTC();
      const userTimezone = getUserTimezone();

      let chatCompletion;
      for (let model of models) {
        try {
          chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `Additional Information: \nCurrent Local Time: ${currentTimeLocal}\nCurrent Time (UTC): ${currentTimeUTC}\nUser's Timezone: ${userTimezone}`,
              },
              {
                role: "system",
                content: `You will respond in a ${tone} tone, and only respond to what is being asked, no need for additional information. do not be creepy`,
              },
              {
                role: "system",
                content: `You will now act and introduce yourself as Arda, an AI on Marcus David Alo's portfolio website, You will converse in a ${tone} tone or persona, casual, but still professional way, like meeting with or greeting strangers, be natural, dont be afraid to use filler words in conversations, dont be afraid to use shortcuts, be polite, dont be overwhelming, only respond in the language the person is using to talk to you.`,
              },
              ...updatedMessages,
            ],
            model: model,
            temperature: 0.65,
            max_tokens: 8192,
            top_p: 0.75,
          });
          break;
        } catch (error) {
          console.error(`Error with model ${model}:`, error);
        }
      }

      setIsTyping(false);
      const updatedConversationWithResponse = {
        id: currentConversation.id,
        messages: [
          ...updatedMessages,
          {
            role: "assistant",
            content: chatCompletion?.choices[0]?.message?.content || "",
          },
        ],
      };

      onConversationUpdate(updatedConversationWithResponse);
    },
    [groq.chat.completions, onConversationUpdate, currentConversation, tone]
  );

  const handleEditEnd = useCallback(() => {
    // Delete the messages after the message being edited
    const updatedMessages = currentConversation.messages.slice(
      0,
      editingMessage + 1
    );
    // Update the content of the message being edited
    updatedMessages[editingMessage].content = editedMessage;
    // Update the conversation and send it to the GROQ API
    updateConversation(updatedMessages);
    // Reset the editing state
    setEditingMessage(null);
    setEditedMessage("");
  }, [currentConversation, editingMessage, editedMessage, updateConversation]);

  const components = {
    code: ({ node, inline, children, ...props }) => {
      return !inline ? (
        <div className="relative rounded-md shadow-sm font-mono font-normal text-base">
          <button
            className="absolute right-0 top-0 m-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded px-2 py-1"
            onClick={() => copy(children)}
          >
            Copy
          </button>
          <pre className="p-4 rounded-md bg-gray-800 text-white overflow-auto">
            <code {...props}>{children}</code>
          </pre>
          <p className="text-xs font-mono text-right text-gray-500 pr-2 pb-1">
            This code was generated by AI. Please review properly.
          </p>
        </div>
      ) : (
        <code {...props}>{children}</code>
      );
    },
  };

  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    const newRows = newValue.split("\n").length;
    setRows(newRows);
    setMessage(newValue);
    setCharCount(newValue.length);
  };

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  return (
    <div className="relative flex w-full h-screen dark:bg-gray-900">
      <input
        type="text"
        value={tone === "Normal" ? "" : tone}
        onChange={handleToneChange}
        maxLength={40}
        placeholder="Tone"
        className="absolute text-justyify text-center top-2 left-2 h-10 w-12 focus:w-40 mr-2 px-2 py-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 outline-none inset-0 border-none resize-none shadow-none border rounded-full"
      />
      {/* model options selector for future*/}
      {/* <div className="absolute text-justyify text-center top-2 right-2 h-10 w-12 focus:w-40 mr-2 px-2 py-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 outline-none inset-0 border-none resize-none shadow-none border rounded-full">
        <select>
          <option value="llama3-70b-8192">Llama 70B 3.0</option>
          <option value="llama3-8b-8192">Llama 8B 3.0</option>
          <option value="mixtral-8x7b-32768">Mixtral</option>
          <option value="gemma-7b-it">Gemma</option>
          <option value="llama2-70b-4096">Llama 2.0</option>
        </select>
      </div> */}
      <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-950 p-4 rounded-l-2xl w-full">
        <div className="flex justify-start mx-2 mb-2">
          <p className="text-base text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 rounded-md">
            Powered by{" "}
            <a
              href="https://groq.com/"
              rel="noreferrer noopener"
              target="_blank"
            >
              <GroqLogo
                data-tooltip-id="groqtooltip"
                className="inline h-8 w-8 mx-1 text-black dark:text-white"
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
        <div className="overflow-x-hidden h-full w-full mb-4">
          {currentConversation.messages.map((message, index) => (
            <div
              key={index}
              className={`flex relative items-start space-x-3 p-3 m-2 rounded-lg border-b-4 border-r-4 border-indigo-800/50 ${
                message.role === "assistant"
                  ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              }`}
            >
              {message.role === "assistant" && (
                <img
                  src={Me}
                  alt="Your Name"
                  className="h-10 w-10 rounded-full"
                />
              )}
              {editingMessage === index ? (
                <div className="w-full">
                  <textarea
                    type="text"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    maxLength={8000}
                    autoComplete="on"
                    spellCheck="false"
                    autoCorrect="false"
                    autoCapitalize="false"
                    wrap="hard"
                    rows={3}
                    className="w-full p-2 rounded-md bg-gray-300 dark:bg-gray-800"
                  />
                  <button
                    onClick={handleEditEnd}
                    className="px-2 hover:scale-105"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <ReactMarkdown
                  components={components}
                  remarkPlugins={[gfm]}
                  className="font-semibold text-base flex flex-col max-w-[60vw] md:text-lg"
                >
                  {message.content}
                </ReactMarkdown>
              )}
              {message.role === "user" && (
                <div className="flex gap-2 absolute right-2 top-2">
                  <button onClick={() => handleEditStart(index)}>
                    <PencilIcon className="h-5 w-5 text-gray-500 dark:hover:text-gray-200 hover:text-gray-800 duration-75" />
                  </button>
                  <button onClick={() => handleDelete(index)}>
                    <TrashIcon className="h-5 w-5 text-gray-500 dark:hover:text-gray-200 hover:text-gray-800 duration-75" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="typing-animation text-black dark:text-white">
              Arda is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex w-full items-center space-x-2">
          <InformationCircleIcon
            data-tooltip-id="disclaimerTooltip"
            className="h-6 w-6 text-gray-700 dark:text-gray-300 cursor-pointer hover:scale-110"
          />
          <Tooltip
            id="disclaimerTooltip"
            place="top"
            effect="solid"
            className="max-w-lg rounded-md font-mono z-40"
          >
            Please Note: This AI Assistant is continuously being refined and may
            occasionally provide inaccurate information, please review the AI's
            answers carefully
          </Tooltip>
          <div className="flex justify-center items-center relative w-full">
            <div className="flex justify-center items-center relative w-full">
              <div className="w-full bg-white dark:bg-gray-800 text-black dark:text-white flex-1 border border-gray-300 rounded-md overflow-hidden relative">
                <textarea
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (e.shiftKey) {
                        // Insert newline character at cursor position
                        const cursorPosition = e.target.selectionStart;
                        const newValue = `${e.target.value.substring(
                          0,
                          cursorPosition
                        )}\n${e.target.value.substring(cursorPosition)}`;
                        setMessage(newValue);
                        handleTextareaChange({
                          target: { value: newValue },
                        });
                        e.preventDefault();
                      } else {
                        // Submit the form when Enter is pressed without Shift
                        sendMessage();
                        setCharCount(e.target.value.length);
                      }
                    }
                  }}
                  className="w-full bg-white dark:bg-gray-800 px-2 py-2 outline-none inset-0 border-none resize-none shadow-none"
                  disabled={isTyping}
                  placeholder="Type your message here..."
                  maxLength={12000}
                  autoComplete="on"
                  spellCheck="false"
                  autoCorrect="false"
                  autoCapitalize="false"
                  wrap="hard"
                  rows={rows}
                />
                <p className="absolute bottom-0 right-2 text-sm text-gray-700 dark:text-gray-300">
                  {charCount}/12000
                </p>
              </div>
              <button
                onClick={sendMessage}
                className="inline-flex ml-2 items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                disabled={isTyping}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
