import { useState } from 'react';
import { getOrCreateChat } from '../supabaseClient';
import ChatRoom from './ChatRoom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const TranslationRequestDetails = ({ request, onClose }) => {
  const [conversationId, setConversationId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleContactTranslator = async () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      // Get or create conversation between current user and translator
      const translatorId = request.translator_id || request.translator?.id;
      if (!translatorId) {
        throw new Error('Translator information is missing');
      }

      // Create a new conversation or get existing one
      const conversationId = await getOrCreateChat(user.id, translatorId);
      setConversationId(conversationId);
      
      // If there's a translation request ID, we can associate it with the conversation
      if (request.id) {
        await supabase
          .from('conversation_translations')
          .upsert({
            conversation_id: conversationId,
            translation_request_id: request.id
          });
      }
      
      setShowChat(true);
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="translation-request-details">
      <div className="request-actions">
        <button 
          className="action-button contact-button"
          onClick={handleContactTranslator}
          disabled={isLoading}
        >
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {request.status === 'pending' ? 'Contact Translator' : 'Message Translator'}
            </>
          )}
        </button>
      </div>
      
      {showChat && conversationId && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <div className="chat-modal-header">
              <h3>Chat with {request.translator?.name || 'Translator'}</h3>
              <button 
                className="close-button" 
                onClick={() => setShowChat(false)}
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>
            <div className="chat-modal-content">
              <ChatRoom 
                conversationId={conversationId} 
                userId={user.id} 
                otherUser={{
                  id: request.translator_id || request.translator?.id,
                  name: request.translator?.name || 'Translator',
                  email: request.translator?.email
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationRequestDetails;