import React, { useState, useRef, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import copy from "clipboard-copy";
import { PencilIcon, TrashIcon, WifiIcon } from "@heroicons/react/24/solid";
import Groq from "groq-sdk";

const MAX_TOKENS = 1024;
const MAX_HISTORY = 5;
const MAX_SEARCH_RESULTS = 3;

const ChatWindow = ({
  currentConversation,
  onConversationUpdate,
  getShortName,
  models,
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [useInternet, setUseInternet] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const chatEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groq = useMemo(
    () =>
      new Groq({
        apiKey: process.env.REACT_APP_GROQ,
        dangerouslyAllowBrowser: true,
      }),
    []
  );

  const getCurrentTime = useCallback(
    () => ({
      local: new Date().toLocaleTimeString(),
      utc: new Date().toUTCString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    []
  );

  const sendChatCompletion = useCallback(
    async (updatedMessages, searchedContent) => {
      const { local, utc, timezone } = getCurrentTime();
      const promptMessages = [
        {
          role: "system",
          content: `Only use information when asked: \nTone: Normal \nAdditional Information: \nCurrent Local Time: ${local}\nCurrent Time (UTC): ${utc}\nUser's Timezone: ${timezone}\nModel used: ${models[0]} \nWhen asked about time and date, always account for Daylight Savings Time in countries that use DST and break down the calculation for more accuracy.`,
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
          content:
            "Provide accurate, detailed, and in-depth information, only reply with what is being asked or talked about in a concise but informative way.",
        },
        ...updatedMessages.slice(-MAX_HISTORY),
      ];

      try {
        return await groq.chat.completions.create({
          messages: promptMessages,
          model: models[0],
          temperature: 1.2,
          max_tokens: MAX_TOKENS,
          top_p: 1,
          stop: null,
        });
      } catch (error) {
        console.error("Error with model", models[0], ":", error.message);
        throw error;
      }
    },
    [groq.chat.completions, models, useInternet, getCurrentTime]
  );

  const fetchGoogleSearchResults = useCallback(async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${query}&key=${process.env.REACT_APP_GOOGLE}&cx=${process.env.REACT_APP_SEARCH_ENGINE_ID}&num=${MAX_SEARCH_RESULTS}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching search results: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      return data.items.slice(0, MAX_SEARCH_RESULTS);
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  }, []);

  const sendMessage = useCallback(
    async (resendMessage) => {
      const messageContent = resendMessage || message;
      if (messageContent.trim() === "") return;

      const isFirstMessage = currentConversation.messages.length === 0;
      const conversationHistory = [
        ...currentConversation.messages,
        { role: "user", content: messageContent },
      ];

      let updatedConversation = {
        ...currentConversation,
        messages: conversationHistory,
      };

      if (isFirstMessage) {
        const shortName = await getShortName([
          ...conversationHistory,
          {
            role: "user",
            content:
              "Make 1 short title for a conversation about:" +
              messageContent +
              " only the title, no extra conversations",
          },
        ]);
        updatedConversation.name = shortName.substring(0, 30);
      }

      onConversationUpdate(updatedConversation);
      setMessage("");

      setIsTyping(true);

      let searchResults = [];
      if (useInternet) {
        const keywordsPrompt = await groq.chat.completions.create({
          messages: [
            ...updatedConversation.messages.slice(-MAX_HISTORY),
            {
              role: "system",
              content:
                "Decide if a search is necessary based on the message given, especially when it requires the latest information, respond only with a 'yes' if its necessary and a 'no' if not, no extras like other words or symbols",
            },
          ],
          model: models[0],
          temperature: 0.5,
          max_tokens: 3,
          top_p: 1,
        });

        const requiresSearch =
          keywordsPrompt?.choices[0]?.message?.content.trim().toLowerCase() ===
          "yes";

        if (requiresSearch) {
          const keywords = await groq.chat.completions.create({
            messages: [
              ...updatedConversation.messages.slice(-MAX_HISTORY),
              {
                role: "user",
                content:
                  "Determine the most appropriate search term for searching relevant information based on my message, only say that search term and nothing else, no other words or sentences, don't use double quotations always, only on ones that need complete accuracy",
              },
            ],
            model: models[0],
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
            stop: null,
          });

          const keywordsText = keywords?.choices[0]?.message?.content || "";
          if (keywordsText) {
            searchResults = await fetchGoogleSearchResults(keywordsText);
          }
        }
      }

      try {
        const chatCompletion = await sendChatCompletion(
          conversationHistory,
          searchResults
        );

        setIsTyping(false);
        onConversationUpdate({
          ...updatedConversation,
          messages: [
            ...updatedConversation.messages,
            {
              role: "assistant",
              content: chatCompletion?.choices[0]?.message?.content || "",
            },
          ],
        });
      } catch (error) {
        setIsTyping(false);
        console.error("Error in chat completion:", error);
        console.dir(error, { depth: null });
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
      fetchGoogleSearchResults,
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
      onConversationUpdate({
        ...currentConversation,
        messages: updatedMessages,
      });
      sendMessage(editedMessage);
    }
  }, [
    currentConversation,
    editingMessage,
    editedMessage,
    onConversationUpdate,
    sendMessage,
  ]);

  const codeBlock = useMemo(
    () => ({
      code: ({ node, inline, children, ...props }) =>
        !inline ? (
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
        ),
    }),
    []
  );

  return (
    <div className="relative flex flex-col w-full h-[80vh] text-zinc-900 dark:text-zinc-100 p-4">
      <div className="overflow-auto flex-1 rounded-md" ref={chatWindowRef}>
        <div className="flex items-center fixed z-50 bg-zinc-200 dark:bg-zinc-900 rounded-full m-2">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setUseInternet(!useInternet)}
            className="relative flex items-center justify-center w-8 h-8 p-1 rounded-full hover:scale-105 transition-all ease-in-out"
          >
            <WifiIcon
              className={`w-6 h-6 ${
                useInternet ? "text-green-500" : "text-zinc-600"
              }`}
            />
            {showTooltip && (
              <span className="absolute left-full ml-2 whitespace-nowrap bg-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 text-sm rounded px-2 py-1">
                Click to{" "}
                <span
                  className={useInternet ? "text-red-400" : "text-green-500"}
                >
                  {useInternet ? "disable" : "enable"}
                </span>{" "}
                internet access
              </span>
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
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
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
                          onClick={() => {
                            setEditingMessage(index);
                            setEditedMessage(msg.content);
                          }}
                          className="text-zinc-500 hover:text-zinc-700"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            onConversationUpdate({
                              ...currentConversation,
                              messages: currentConversation.messages.slice(
                                0,
                                index
                              ),
                            })
                          }
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
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg resize-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          placeholder="Type your message..."
          rows="3"
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
