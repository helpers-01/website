import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { supabase } from '../../api/supabaseClient';
import { X, Send } from 'lucide-react';

interface ContactHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  helper: { id: string; name: string; image?: string };
}

const ContactHelperModal: React.FC<ContactHelperModalProps> = ({ isOpen, onClose, helper }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userId = 'USER_ID'; // Replace with logged-in user's ID

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(`user_id.eq.${userId},helper_id.eq.${helper.id}`)
      .order('created_at', { ascending: true });

    if (error) console.error('Fetch messages error:', error);
    else setMessages(data || []);
  };

  const subscribeToMessages = () => {
    return supabase
      .channel('chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, (payload) => {
        const newMsg = payload.new;
        if (newMsg.user_id === userId || newMsg.helper_id === helper.id) {
          setMessages((prev) => [...prev, newMsg]);
        }
      })
      .subscribe();
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const { error } = await supabase.from('chats').insert([
      {
        user_id: userId,
        helper_id: helper.id,
        sender: 'user',
        message: newMessage.trim(),
      },
    ]);

    if (error) {
      console.error('Send message failed:', error);
    } else {
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const subscription = subscribeToMessages();
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <img src={helper.image || '/placeholder.png'} alt={helper.name} className="w-10 h-10 rounded-full" />
              <h3 className="text-lg font-medium text-gray-900">Chat with {helper.name}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Box */}
          <div className="h-64 overflow-y-auto border rounded-md p-4 bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-4 py-2 rounded-lg text-sm max-w-xs ${
                      msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ContactHelperModal;