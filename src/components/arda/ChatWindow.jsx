import React, { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import copy from "clipboard-copy";
import { PencilIcon, TrashIcon, WifiIcon } from "@heroicons/react/24/solid";

const MAX_TOKENS = 8196;
const MAX_HISTORY = 5;
// const MAX_CHAR_LIMIT = 8000;

const ChatWindow = ({
  groq,
  currentConversation,
  onConversationUpdate,
  getShortName,
  models,
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [useInternet, setUseInternet] = useState(false);
  const chatEndRef = useRef(null);
  const [rows, setRows] = useState(1);
  const [tone] = useState("Normal");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const chatWindowRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

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

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

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
        ...updatedMessages.slice(-MAX_HISTORY),
      ];

      const filteredMessages = promptMessages
        .slice(0, 3)
        .concat(updatedMessages.slice(-MAX_HISTORY));

      let chatCompletion;
      for (let model of models) {
        try {
          chatCompletion = await groq.chat.completions.create({
            messages: filteredMessages,
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

      console.log("Message Content:\n", messageContent);

      const isFirstMessage = messages.length === 0;
      const conversationHistory = [
        ...messages,
        { role: "user", content: messageContent },
      ];
      const conversationName = [
        ...messages,
        {
          role: "user",
          content:
            "Make 1 short title for a conversation about:" +
            messageContent +
            "only the title, no extra conversations",
        },
      ];

      let updatedConversation = {
        ...currentConversation,
        messages: conversationHistory,
      };

      if (isFirstMessage) {
        const shortName = await getShortName(conversationName);
        updatedConversation.name = shortName.substring(0, 30);
      }

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
          ...updatedConversation,
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
      getShortName,
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

  const codeBlock = {
    code: ({ node, inline, children, ...props }) => {
      return !inline ? (
        <div className="relative rounded-md shadow-sm font-mono font-normal text-sm bg-zinc-900 max-w-screen-sm overflow-auto">
          <button
            className="absolute right-0 top-0 m-2 text-sm bg-indigo-800 text-white rounded px-2 py-1"
            onClick={() => copy(children)}
          >
            Copy
          </button>
          <pre className="p-4 rounded-md bg-zinc-950/70 text-white overflow-auto">
            <code {...props}>{children}</code>
          </pre>
          <p className="text-xs font-mono text-right text-zinc-500 pr-2 py-2">
            This code was generated by AI. Please review properly.
          </p>
        </div>
      ) : (
        <code {...props}>{children}</code>
      );
    },
  };

  return (
    <div className="relative flex flex-col w-full h-[80vh] text-zinc-900 dark:text-zinc-100 p-4">
      <div className="overflow-auto flex-1 rounded-md" ref={chatWindowRef}>
        <div className="flex items-center fixed z-50 bg-zinc-200 dark:bg-zinc-900 rounded-full m-2">
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setUseInternet(!useInternet)}
            className="relative flex items-center justify-center w-8 h-8 p-1 rounded-full hover:scale-105 transition-all ease-in-out"
          >
            {useInternet ? (
              <>
                <WifiIcon className="w-6 h-6 text-green-500" />
                {showTooltip && (
                  <span className="absolute left-full ml-2 whitespace-nowrap bg-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 text-sm rounded px-2 py-1">
                    Click to <span className="text-red-400">disable</span>{" "}
                    internet access
                  </span>
                )}
              </>
            ) : (
              <>
                <WifiIcon className="w-6 h-6 text-zinc-600" />
                {showTooltip && (
                  <span className="absolute left-full ml-2 whitespace-nowrap bg-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 text-sm rounded px-2 py-1">
                    Click to <span className="text-green-500">enable</span>{" "}
                    internet access
                  </span>
                )}
              </>
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
                className={`w-[80%] p-3 rounded-lg shadow ${
                  msg.role === "assistant"
                    ? "bg-indigo-200 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200"
                    : " bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                } relative`}
              >
                {editingMessage === index ? (
                  <>
                    <textarea
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      className="w-full h-96 p-2 border rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingMessage(null)}
                        className="px-2 py-1 border rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
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
                      components={codeBlock}
                      remarkPlugins={[gfm]}
                      className="whitespace-pre-wrap"
                    >
                      {msg.content}
                    </ReactMarkdown>
                    {msg.role === "user" && (
                      <div className="absolute top-0 right-0 mt-1 mr-1 flex space-x-1">
                        <button
                          onClick={() => handleEditStart(index)}
                          className="text-zinc-500 hover:text-zinc-700"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-zinc-500 hover:text-zinc-700"
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
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            AI is typing...
          </p>
        </div>
      )}

      <div className="pt-4 flex items-center">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded bg-white dark:bg-zinc-800 px-2 py-2 outline-none inset-0 resize-none shadow-none"
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
