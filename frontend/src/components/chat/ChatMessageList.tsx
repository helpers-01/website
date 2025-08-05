import React from 'react';

interface ChatMessageListProps {
  messages: any[];
  currentUserId: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="flex flex-col space-y-3 overflow-y-auto h-full px-4 py-2">
      {messages.map((msg) => {
        const isSentByUser = msg.sender_id === currentUserId;
        return (
          <div
            key={msg.id}
            className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                isSentByUser
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.content}
              <div className="text-xs text-gray-400 mt-1 text-right">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessageList;