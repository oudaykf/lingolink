import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';
import './Messages.css';

const ChatRoom = ({ conversationId, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Request notification permission on mount
  useEffect(() => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch messages for the conversation
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    // Initial fetch
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Add the new message to the list
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
          
          // Show notification if the message is from the other user
          if (payload.new.sender_id !== user?.id) {
            const senderName = otherUser?.name || 'Translator';
            showToast(`New message from ${senderName}`, 'info');
            
            // Browser notification if allowed
            if (window.Notification && Notification.permission === 'granted') {
              new Notification(`New message from ${senderName}`, { 
                body: payload.new.content,
                icon: otherUser?.avatar_url || '/default-avatar.png'
              });
            }
          }
        }
      )
      .subscribe();

    // Clean up subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, user?.id, otherUser, showToast]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || !user) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            content: newMessage.trim(),
            is_read: false,
          },
        ]);

      if (error) throw error;

      // Update the conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return <div className="messages-loading">Loading messages...</div>;
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h3>Chat with {otherUser?.name || 'Translator'}</h3>
      </div>
      
      <div className="messages-container">
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="no-messages">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender_id === user?.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">{message.content}</div>
                <div className="message-time">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
          disabled={isSending}
        />
        <button 
          type="submit" 
          className="send-button" 
          disabled={!newMessage.trim() || isSending}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatRoom; 