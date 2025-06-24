import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './Messages.css';
import { getMessages } from '../supabaseClient';

const Messages = ({ chatId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const msgs = await getMessages(chatId);
      setMessages(msgs || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to new messages
  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel('messages_' + chatId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        scrollToBottom();
      })
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            sender_id: userId,
            message: newMessage.trim(),
          }
        ]);
      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="messages-loading">Loading messages...</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender_id === userId ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {message.message}
            </div>
            <div className="message-time">
              {new Date(message.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages; 