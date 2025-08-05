import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';

const HelperChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading: authLoading } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user && userId) {
      fetchMessages();

      // Supabase Realtime Subscription for new messages
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === user.id && msg.receiver_id === userId) ||
            (msg.sender_id === userId && msg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [authLoading, user, userId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch messages:', error);
    } else {
      const filteredMessages = data.filter(
        (msg) =>
          (msg.sender_id === user?.id && msg.receiver_id === userId) ||
          (msg.sender_id === userId && msg.receiver_id === user?.id)
      );
      setMessages(filteredMessages);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !user || !userId) return;

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: user.id,
        receiver_id: userId,
        content: newMessage.trim()
      }
    ]);

    if (error) {
      console.error('Failed to send message:', error);
    } else {
      setNewMessage('');
      // No re-fetch needed; realtime will handle
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg ${
              msg.sender_id === user.id
                ? 'ml-auto bg-purple-600 text-white'
                : 'mr-auto bg-white text-gray-800 border'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white flex space-x-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default HelperChatPage;