import React from 'react';

const MessageList = ({ messages, currentUserId }: { messages: any[]; currentUserId: string }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-xs p-3 rounded-lg ${
            msg.sender_id === currentUserId ? 'ml-auto bg-purple-600 text-white' : 'mr-auto bg-gray-200 text-gray-900'
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;