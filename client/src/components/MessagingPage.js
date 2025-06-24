import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';
import './MessagingPage.css';

const MessagingPage = () => {
  // Get user and token from localStorage for now
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // For now, show a placeholder since database tables need to be created
    setLoading(false);
    // fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0]);
        }
      } else {
        console.error('Failed to load conversations');
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/conversation/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const startNewConversation = async (recipientId) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipientId })
      });

      if (response.ok) {
        const conversation = await response.json();
        setConversations(prev => [conversation, ...prev]);
        setSelectedConversation(conversation);
        console.log('New conversation started');
      } else {
        console.error('Failed to start conversation');
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="messaging-page">
        <div className="messaging-loading">
          <div className="loading-spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-page">
      <div className="messaging-container">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h2>Messages</h2>
            <button className="new-conversation-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
          
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <div className="setup-notice">
                  <h3>🔧 Database Setup Required</h3>
                  <p>The messaging system requires database tables to be created.</p>
                  <div className="setup-instructions">
                    <p><strong>To enable messaging:</strong></p>
                    <ol>
                      <li>Open your Supabase dashboard</li>
                      <li>Go to the SQL Editor</li>
                      <li>Run the SQL commands from the server setup</li>
                      <li>Create the conversations and messages tables</li>
                    </ol>
                  </div>
                  <p><small>Once the tables are created, messaging will work automatically.</small></p>
                </div>
              </div>
            ) : (
              conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {conversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {conversation.otherUser.name}
                    </div>
                    <div className="conversation-preview">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </div>
                  </div>
                  <div className="conversation-meta">
                    <div className="conversation-time">
                      {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="unread-badge">{conversation.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedConversation.otherUser.name}</h3>
                    <p>{selectedConversation.otherUser.userType}</p>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.map((message, index) => {
                  const showDate = index === 0 || 
                    formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                  
                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="message-date">
                          {formatDate(message.createdAt)}
                        </div>
                      )}
                      <div className={`message ${message.senderId === user.id ? 'sent' : 'received'}`}>
                        <div className="message-content">
                          {message.content}
                        </div>
                        <div className="message-time">
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form className="message-input-form" onSubmit={sendMessage}>
                <div className="message-input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="send-button"
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? (
                      <div className="loading-spinner small"></div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22,2 15,22 11,13 2,9"/>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-content">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
