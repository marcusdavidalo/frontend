import React, { useState, useRef, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import copy from "clipboard-copy";
import { PencilIcon, TrashIcon, WifiIcon } from "@heroicons/react/24/solid";

const MAX_TOKENS = 8196;
const MAX_HISTORY = 5;
const MAX_CHAR_LIMIT = 8000;

const ChatWindow = ({ groq, currentConversation, onConversationUpdate }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [useInternet, setUseInternet] = useState(false);
  const chatEndRef = useRef(null);
  const [rows, setRows] = useState(1);
  const tone = useState("Normal");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const chatWindowRef = useRef(null);
  const models = useMemo(
    () => [
      "llama3-70b-8192",
      "llama3-8b-8192",
      "mixtral-8x7b-32768",
      "gemma-7b-it",
    ],
    []
  );

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

  const getCurrentTimeLocal = () => new Date().toLocaleTimeString();
  const getCurrentTimeUTC = () => new Date().toUTCString();
  const getUserTimezone = () =>
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const sendChatCompletion = useCallback(
    async (updatedMessages, searchedContent) => {
      const currentTimeLocal = getCurrentTimeLocal();
      const currentTimeUTC = getCurrentTimeUTC();
      const userTimezone = getUserTimezone();

      const promptMessages = [
        {
          role: "system",
          content: `Speech Tone: ${tone} \nAdditional Information: \nCurrent Local Time: ${currentTimeLocal}\nCurrent Time (UTC): ${currentTimeUTC}\nUser's Timezone: ${userTimezone}\nModel used: ${models[0]}`,
        },
        {
          role: "system",
          content: useInternet
            ? `Provide links used in relevant searched information, \nLatest relevant searched information from the internet: ${JSON.stringify(
                searchedContent
              )}`
            : "Internet access is disabled.",
        },
        {
          role: "system",
          content: `Provide accurate, detailed, and in-depth information`,
        },
        ...updatedMessages.slice(MAX_HISTORY),
      ];

      const filteredMessages = promptMessages.join("\n").slice(MAX_CHAR_LIMIT);

      let chatCompletion;
      for (let model of models) {
        try {
          chatCompletion = await groq.chat.completions.create({
            messages: [
              ...promptMessages.slice(0, 3),
              ...filteredMessages.slice(-MAX_HISTORY),
            ],
            model: model,
            temperature: 1.25,
            max_tokens: MAX_TOKENS,
            top_p: 1,
            stop: null,
          });
          break;
        } catch (error) {
          console.error(`Error with model ${model}:`, error);
        }
      }

      return chatCompletion;
    },
    [groq.chat.completions, models, tone, useInternet]
  );

  const fetchGoogleSearchResults = async (query) => {
    console.log("Google Search Results Query:\n" + query);
    const apiKey = process.env.REACT_APP_GOOGLE;
    const searchEngineId = process.env.REACT_APP_SEARCH_ENGINE_ID;
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${searchEngineId}`;

    console.log("Final Url:\n", url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Google Results:\n", data.items);
      return data.items;
    } catch (error) {
      console.error("Error fetching search results:", error);
      return "";
    }
  };

  const sendMessage = useCallback(
    async (resendMessage, messages = currentConversation.messages) => {
      const messageContent =
        (typeof resendMessage === "string" ? resendMessage : "") || message;
      if (messageContent.trim() === "") return;

      const conversationHistory = [
        ...messages,
        { role: "user", content: messageContent },
      ];
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

      if (!useInternet) {
        const chatCompletion = await groq.chat.completions.create({
          messages: conversationHistory,
          model: models[0],
          temperature: 1.25,
          max_tokens: MAX_TOKENS,
          top_p: 1,
          stop: null,
        });

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

        setIsTyping(false);
        onConversationUpdate(updatedConversationWithResponse);
        console.log("Chat Completion:\n", chatCompletion);
      } else {
        const keywordsPromptCompletion = await groq.chat.completions.create({
          messages: [
            ...updatedConversation.messages.slice(-MAX_HISTORY),
            {
              role: "system",
              content:
                "Decide if a search is necessary based on the message given, especially when it requires the latest information, respond only with a 'yes' if its necessary and a 'no' if not, no extras like other words or symbols",
            },
          ],
          model: models[1],
          temperature: 0.5,
          max_tokens: 3,
          top_p: 1,
        });

        console.log(
          "keywordsPromptCompletion:\n",
          keywordsPromptCompletion?.choices[0]?.message?.content
        );

        const requiresSearch =
          (await keywordsPromptCompletion?.choices[0]?.message?.content
            .trim()
            .toLowerCase()) === "yes";

        console.log("requiresSearch:\n" + requiresSearch);
        let searchResults = "";

        if (requiresSearch) {
          const keywords = await groq.chat.completions.create({
            messages: [
              ...updatedConversation.messages.slice(-MAX_HISTORY),
              {
                role: "user",
                content:
                  "Determine the most appropriate search term for searching relevant information based on my message, only say that search term and nothing else, no other words or sentences, dont use double quotations always, only on ones that need complete accuracy",
              },
            ],
            model: models[0],
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
            stop: null,
          });

          console.log(
            "Keywords:\n",
            keywords.keywords?.choices[0]?.message?.content
          );

          const keywordsText = keywords?.choices[0]?.message?.content || "";
          if (keywordsText) {
            searchResults = await fetchGoogleSearchResults(keywordsText);
            searchResults = searchResults.slice(3, 8);
            searchResults = JSON.stringify(searchResults);
          }
          console.log("Keywords Text:\n" + keywordsText);
        }

        const chatCompletion = await sendChatCompletion(
          conversationHistory,
          searchResults
        );

        console.log("Search Results:\n", searchResults);

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
      }
    },
    [
      currentConversation,
      sendChatCompletion,
      message,
      onConversationUpdate,
      groq.chat.completions,
      models,
      useInternet,
    ]
  );

  const updateConversation = useCallback(
    async (updatedMessages, triggerSearch = true) => {
      onConversationUpdate({
        ...currentConversation,
        messages: updatedMessages,
      });
      setIsTyping(true);

      let searchResults = "";

      if (triggerSearch && useInternet) {
        const keywords = await groq.chat.completions.create({
          messages: [
            ...updatedMessages.slice(-MAX_HISTORY),
            {
              role: "user",
              content:
                "Determine the most appropriate search term for searching relevant information based on my message, only say that search term and nothing else, no other words or sentences, dont use double quotations always, only on ones that need complete accuracy",
            },
          ],
          model: models[0],
          temperature: 0.7,
          max_tokens: 50,
          top_p: 1,
          stop: null,
        });

        console.log(
          "Keywords:\n" + keywords.keywords?.choices[0]?.message?.content
        );

        const keywordsText = keywords?.choices[0]?.message?.content || "";
        if (keywordsText) {
          searchResults = await fetchGoogleSearchResults(keywordsText);
          searchResults = searchResults.slice(3, 8);
          searchResults = JSON.stringify(searchResults);
        }
        console.log("Keywords Text:\n" + keywordsText);
      }

      if (!useInternet) {
        const chatCompletion = await groq.chat.completions.create({
          messages: updatedMessages,
          model: models[0],
          temperature: 1.25,
          max_tokens: MAX_TOKENS,
          top_p: 1,
          stop: null,
        });

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

        setIsTyping(false);
        onConversationUpdate(updatedConversationWithResponse);
      } else {
        const chatCompletion = await sendChatCompletion(
          updatedMessages,
          searchResults
        );

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
      }
    },
    [
      currentConversation,
      sendChatCompletion,
      onConversationUpdate,
      groq.chat.completions,
      models,
      useInternet,
    ]
  );

  const handleEditEnd = useCallback(() => {
    if (editingMessage !== null) {
      const updatedMessages = currentConversation.messages
        .slice(0, editingMessage + 1)
        .map((msg, index) =>
          index === editingMessage ? { ...msg, content: editedMessage } : msg
        );

      setEditingMessage(null);
      setEditedMessage("");
      updateConversation(updatedMessages);
    }
  }, [
    currentConversation.messages,
    editingMessage,
    editedMessage,
    updateConversation,
  ]);

  const components = {
    code: ({ node, inline, children, ...props }) => {
      return !inline ? (
        <div className="relative rounded-md shadow-sm font-mono font-normal text-sm bg-slate-900">
          <button
            className="absolute right-0 top-0 m-2 text-sm bg-indigo-800 text-white rounded px-2 py-1"
            onClick={() => copy(children)}
          >
            Copy
          </button>
          <pre className="p-4 rounded-md bg-gray-950/70 text-white overflow-auto">
            <code {...props}>{children}</code>
          </pre>
          <p className="text-xs font-mono text-right text-gray-500 pr-2 py-2">
            This code was generated by AI. Please review properly.
          </p>
        </div>
      ) : (
        <code {...props}>{children}</code>
      );
    },
  };

  return (
    <div className="flex flex-col w-full h-[80vh] relative bg-gray-100 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 p-4">
      <div className="overflow-auto flex-1 rounded-md" ref={chatWindowRef}>
        <div className="flex items-center">
          <button
            onClick={() => setUseInternet(!useInternet)}
            className="flex items-center justify-center w-8 h-8 p-1 rounded-full hover:scale-105 transition-all ease-in-out"
          >
            {useInternet ? (
              <WifiIcon
                className="w-6 h-6 text-green-600 outline-none inset-0 border-none active:scale-y-125 duration-200"
                title="Using Internet"
              />
            ) : (
              <WifiIcon
                className="w-6 h-6 text-red-600 outline-none inset-0 border-none active:scale-y-125 duration-200"
                title="Not Using Internet"
              />
            )}
          </button>
        </div>
        <div className="space-y-4">
          {currentConversation.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`w-[80%] break-words p-3 rounded-lg shadow ${
                  msg.role === "assistant"
                    ? "bg-indigo-200 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200"
                    : " bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                } relative`}
              >
                {editingMessage === index ? (
                  <>
                    <textarea
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      className="w-full h-max p-2 border rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingMessage(null)}
                        className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEditEnd}
                        className="px-2 py-1 border rounded bg-indigo-200 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200"
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <ReactMarkdown
                      components={components}
                      remarkPlugins={[gfm]}
                      className="whitespace-pre-wrap"
                    >
                      {msg.content}
                    </ReactMarkdown>
                    {msg.role === "user" && (
                      <div className="absolute top-0 right-0 mt-1 mr-1 flex space-x-1">
                        <button
                          onClick={() => handleEditStart(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      {isTyping && (
        <div className="p-2 flex items-center">
          <div className="w-4 h-4 bg-indigo-800 rounded-full mr-2 animate-bounce" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            AI is typing...
          </p>
        </div>
      )}

      <div className="pt-4 flex items-center">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded bg-white dark:bg-gray-800 px-2 py-2 outline-none inset-0 resize-none shadow-none"
          rows={rows}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={() => sendMessage()}
          className="ml-2 px-4 py-2 border rounded bg-indigo-800 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
