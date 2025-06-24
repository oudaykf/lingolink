import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import Messages from './Messages';
import ChatRoom from './ChatRoom';
import './MessagesTab.css';
import { useLocation } from 'react-router-dom';

const MessagesTab = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [chatId, setChatId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          translation_requests (
            id,
            title,
            status
          ),
          sender:sender_id (
            id,
            name,
            email
          ),
          receiver:receiver_id (
            id,
            name,
            email
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const conversationMap = new Map();
      messages.forEach(message => {
        const otherUser = message.sender_id === user.id ? message.receiver : message.sender;
        const key = `${message.chat_id}-${otherUser.id}`;
        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            chatId: message.chat_id,
            otherUser,
            lastMessage: message,
            unreadCount: 0,
            translationRequestId: message.translation_request_id,
            translation_requests: message.translation_requests
          });
        }
      });

      const conversationsArr = Array.from(conversationMap.values());
      setConversations(conversationsArr);

      // Auto-select conversation if chatId is in URL
      const params = new URLSearchParams(location.search);
      const urlChatId = params.get('chatId');
      if (urlChatId && conversationsArr.length > 0) {
        const found = conversationsArr.find(c => c.chatId === urlChatId);
        if (found) setSelectedConversation(found);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to new messages
  useEffect(() => {
    fetchConversations();

    const subscription = supabase
      .channel('conversations')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user.id]);

  if (loading) {
    return <div className="messages-tab-loading">Loading conversations...</div>;
  }

  return (
    <div className="messages-tab">
      <div className="conversations-list">
        {conversations.map((conversation) => (
          <div
            key={`${conversation.translationRequestId}-${conversation.otherUser.id}`}
            className={`conversation-item ${
              selectedConversation?.translationRequestId === conversation.translationRequestId &&
              selectedConversation?.otherUser.id === conversation.otherUser.id
                ? 'active'
                : ''
            }`}
            onClick={() => setSelectedConversation(conversation)}
          >
            <div className="conversation-header">
              <h3>{conversation.otherUser.name}</h3>
              <span className="conversation-time">
                {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="conversation-preview">
              <p>{conversation.lastMessage.content}</p>
              {conversation.unreadCount > 0 && (
                <span className="unread-badge">{conversation.unreadCount}</span>
              )}
            </div>
            <div className="translation-request-info">
              Request: {conversation.translation_requests.title}
            </div>
            <button className="open-chatroom-btn" onClick={() => { setChatId(conversation.chatId); setShowChat(true); }}>Open Chat Room</button>
          </div>
        ))}
      </div>
      <div className="messages-view">
        {selectedConversation ? (
          <Messages
            chatId={selectedConversation.chatId}
            userId={user.id}
          />
        ) : (
          <div className="no-conversation-selected">
            Select a conversation to start messaging
          </div>
        )}
        {showChat && chatId && (
          <div className="chat-modal">
            <button className="close-modal" onClick={() => setShowChat(false)}>Close</button>
            <ChatRoom chatId={chatId} userId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab; 