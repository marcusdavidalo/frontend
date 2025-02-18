import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import useMessageHandler from "../../../hooks/useMessageHandler";

const ChatWindow = ({
  conversation,
  onConversationUpdate,
  models,
  systemPrompt,
}) => {
  const {
    messages,
    isLoading,
    handleSendMessage,
    handleSaveEdit,
    handleDeleteMessage,
  } = useMessageHandler(
    conversation?.messages || [],
    (updatedMessages) =>
      onConversationUpdate({ ...conversation, messages: updatedMessages }),
    (models = "deepseek-r1-distill-llama-70b"),
    systemPrompt,
    true
  );

  return (
    <div className="flex flex-col">
      <MessageList
        messages={messages || []}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={(index) => handleSaveEdit(index)}
        onSaveEdit={handleSaveEdit}
      />
      <MessageInput onSendMessage={handleSendMessage} />
      {isLoading && (
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
          <div className="bg-zinc-800 text-white px-4 py-2 rounded-full">
            AI is thinking...
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
