import React, { useState } from 'react';

interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ onSendMessage, isSending }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') return;
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-3 p-4 border-t bg-white">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isSending}
      />
      <button
        onClick={handleSend}
        disabled={isSending || message.trim() === ''}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
          isSending || message.trim() === ''
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default ChatInputBox;