import { supabase } from './supabaseClient';

export const fetchChatMessages = async (userId: string, helperId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},sender_id.eq.${helperId}`)
    .or(`receiver_id.eq.${userId},receiver_id.eq.${helperId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }

  return data;
};

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  const { error } = await supabase.from('messages').insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      content: content,
    },
  ]);

  if (error) {
    console.error('Failed to send message:', error);
  }
};

export const subscribeToMessages = (callback: (newMessage: any) => void) => {
  return supabase
    .channel('messages-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
};