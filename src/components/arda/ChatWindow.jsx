import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Tooltip } from "react-tooltip";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import copy from "clipboard-copy";
import { ReactComponent as GroqLogo } from "../../assets/chatbot/groq-seeklogo.svg";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const MAX_TOKENS = 8192;
const MAX_HISTORY = 5;

const ChatWindow = ({ groq, currentConversation, onConversationUpdate }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [rows, setRows] = useState(1);
  const tone = useState("Humanlike");
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

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [currentConversation]);

  const getCurrentTimeLocal = () => new Date().toLocaleTimeString();
  const getCurrentTimeUTC = () => new Date().toUTCString();
  const getUserTimezone = () =>
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const sendChatCompletion = useCallback(
    async (updatedMessages, searchedContent) => {
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
                content: `\nSpeech Tone: ${tone} \nCurrent Local Information: \nCurrent Local Time: ${currentTimeLocal}\nCurrent Time (UTC): ${currentTimeUTC}\nUser's Timezone: ${userTimezone}\nModel used: ${model}`,
              },
              {
                role: "system",
                content: `provide links where information was used: \nInformation from the Internet: ${JSON.stringify(
                  searchedContent
                )}`,
              },
              {
                role: "system",
                content: `provide accurate, detailed, and in-depth information`,
              },
              ...updatedMessages.slice(-MAX_HISTORY),
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

      console.log("Searched Content:\n", searchedContent);

      return chatCompletion;
    },
    [groq.chat.completions, models, tone]
  );

  const fetchGoogleSearchResults = async (query) => {
    console.log("Google Search Results Query:\n" + query);
    const apiKey = process.env.REACT_APP_GOOGLE;
    const searchEngineId = process.env.REACT_APP_SEARCH_ENGINE_ID;
    // const dateRestrict = "d7";
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

      // const keywordsPromptCompletion = await groq.chat.completions.create({
      //   messages: [
      //     ...updatedConversation.messages.slice(-MAX_HISTORY),
      //     {
      //       role: "system",
      //       content:
      //         "only say to everything yes in lower case, no extra words or letters or sentences",
      //     },
      //     {
      //       role: "user",
      //       content:
      //         "if a search is required based on the message. Respond only with 'yes' if not then only 'no', no extras",
      //     },
      //   ],
      //   model: models[2],
      //   temperature: 0.7,
      //   max_tokens: 1,
      //   top_p: 1,
      //   stop: null,
      // });

      // console.log(
      //   "keywordsPromptCompletion:\n" +
      //     keywordsPromptCompletion?.choices[0]?.message?.content
      // );

      const requiresSearch = true;
      // (await keywordsPromptCompletion?.choices[0]?.message?.content
      //   .trim()
      //   .toLowerCase()) === "yes";
      console.log("requiresSearch:\n" + requiresSearch);
      let searchResults = "";

      if (requiresSearch === true) {
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
          max_tokens: 20,
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
    },
    [
      currentConversation,
      sendChatCompletion,
      message,
      onConversationUpdate,
      groq.chat.completions,
      models,
    ]
  );

  const updateConversation = useCallback(
    async (updatedMessages) => {
      onConversationUpdate({
        ...currentConversation,
        messages: updatedMessages,
      });
      setIsTyping(true);

      const chatCompletion = await sendChatCompletion(updatedMessages, "");

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
    [currentConversation, sendChatCompletion, onConversationUpdate]
  );

  const handleEditEnd = useCallback(() => {
    const updatedMessages = currentConversation.messages.slice(
      0,
      editingMessage + 1
    );
    updatedMessages[editingMessage].content = editedMessage;
    updateConversation(updatedMessages);
    setEditingMessage(null);
    setEditedMessage("");
  }, [currentConversation, editingMessage, editedMessage, updateConversation]);

  const handleTextareaChange = (event) => {
    const newMessage = event.target.value;
    setMessage(newMessage);

    const newRows = newMessage.split("\n").length;
    if (newRows > rows && newRows <= 15) {
      setRows(newRows);
    } else if (newRows < rows) {
      setRows(newRows);
    }
  };

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

  return (
    <div className="relative flex flex-col items-center h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <input
        type="text"
        className="hidden text-gray-300 bg-white dark:bg-gray-800 outline-none inset-0 border-none resize-none shadow-none border rounded-full"
      />
      <div className="flex flex-col justify-center items-center h-full bg-white dark:bg-gray-950 p-4 rounded-l-2xl w-full">
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
        <div
          ref={chatWindowRef}
          className="overflow-x-hidden overflow-y-auto h-[80vh] w-full mb-4"
        >
          {currentConversation.messages.map((message, index) => (
            <div
              key={index}
              id={`message-${index}`}
              className={`flex relative items-start p-3 rounded-lg border border-gray-300 dark:border-gray-500 m-2 shadow-md dark:shadow-black/70 transition-all delay-0 ease-linear ${
                message.role === "assistant"
                  ? "bg-indigo-200 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              }`}
            >
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
                    className="w-full p-2 rounded-md bg-gray-300 dark:bg-gray-800 whitespace-pre-wrap"
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
                  className="font-semibold text-base flex flex-col max-w-[60vw] md:text-lg whitespace-pre-wrap"
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
        <div className="flex w-full items-center space-x-2 mb-4">
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
            <div className="w-full bg-white dark:bg-gray-800 text-black dark:text-white flex-1 border border-gray-300 rounded-md overflow-hidden relative">
              <textarea
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.shiftKey) {
                      const cursorPosition = e.target.selectionStart;
                      const newValue = `${e.target.value.substring(
                        0,
                        cursorPosition
                      )}\n${e.target.value.substring(cursorPosition)}`;
                      setMessage(newValue);
                      handleTextareaChange({ target: { value: newValue } });
                      e.preventDefault();
                    } else {
                      sendMessage();
                    }
                  }
                }}
                className="w-full bg-white dark:bg-gray-800 px-2 py-2 outline-none inset-0 border-none resize-none shadow-none"
                disabled={isTyping}
                placeholder="Type your message here..."
                autoComplete="on"
                maxLength={32000}
                spellCheck="false"
                autoCorrect="false"
                autoCapitalize="false"
                wrap="hard"
                rows={rows}
              />
              <p className="absolute bottom-0 right-2 text-sm text-gray-700 dark:text-gray-300">
                {message.length}/32000
              </p>
            </div>
            <button
              onClick={() => sendMessage()}
              className="inline-flex ml-2 items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              disabled={isTyping}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
