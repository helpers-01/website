import React, { useState } from 'react';

const MessageInput = ({ onSend }: { onSend: (content: string) => void }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 border rounded-md p-2"
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend} className="bg-purple-600 text-white px-4 rounded-md">
        Send
      </button>
    </div>
  );
};

export default MessageInput;