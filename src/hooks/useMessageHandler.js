import { useState, useCallback, useRef } from "react";
import { sendMessageToGroq } from "../utils/groqClient";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const useMessageHandler = (
  initialMessages,
  setMessages,
  selectedModel,
  systemPrompt,
  isGroqModel
) => {
  const [messages, setInternalMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messageQueue = useRef([]);
  const isProcessing = useRef(false);

  const updateAssistantMessage = useCallback(
    (assistantResponse) => {
      setInternalMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.push({
          role: "assistant",
          content: assistantResponse,
        });
        setMessages(updatedMessages);
        return updatedMessages;
      });
    },
    [setMessages]
  );

  const sendMessageWithRetry = async (groqMessages, retryCount = 0) => {
    try {
      return await sendMessageToGroq(groqMessages, selectedModel);
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return sendMessageWithRetry(groqMessages, retryCount + 1);
      }
      throw error;
    }
  };

  const processQueue = useCallback(async () => {
    if (isProcessing.current) return;
    if (messageQueue.current.length === 0) return;

    isProcessing.current = true;
    setIsLoading(true);

    const { newMessages, resolve, reject } = messageQueue.current.shift();

    try {
      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...newMessages,
      ];
      const assistantResponse = await sendMessageWithRetry(groqMessages);
      updateAssistantMessage(assistantResponse);
      resolve(assistantResponse);
    } catch (error) {
      console.error("Error sending message:", error);
      updateAssistantMessage(
        "Sorry, I encountered an error. Please try again."
      );
      reject(error);
    } finally {
      setIsLoading(false);
      isProcessing.current = false;
      setTimeout(processQueue, 100);
    }
  }, [selectedModel, systemPrompt, updateAssistantMessage]);

  const handleSendMessage = async (input) => {
    const newMessages = [...messages, { role: "user", content: input }];
    setInternalMessages(newMessages);
    setMessages(newMessages);

    return new Promise((resolve, reject) => {
      messageQueue.current.push({ newMessages, resolve, reject });
      processQueue();
    });
  };

  const handleSaveEdit = async (index, newContent) => {
    const updatedMessages = messages.map((message, i) =>
      i === index ? { ...message, content: newContent } : message
    );
    setInternalMessages(updatedMessages);
    setMessages(updatedMessages);

    try {
      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...updatedMessages,
      ];
      const assistantResponse = await sendMessageWithRetry(groqMessages);
      updateAssistantMessage(assistantResponse);
    } catch (error) {
      console.error("Error sending message:", error);
      updateAssistantMessage(
        "Sorry, I encountered an error. Please try again."
      );
    }
  };

  const handleDeleteMessage = (index) => {
    const updatedMessages = messages.slice(0, index);
    setInternalMessages(updatedMessages);
    setMessages(updatedMessages);
  };

  return {
    messages,
    isLoading,
    handleSendMessage,
    handleSaveEdit,
    handleDeleteMessage,
  };
};

export default useMessageHandler;
