const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const auth = require('../middleware/auth');

// Get all conversations for the current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get conversations where user is either participant1 or participant2
    const { data: conversations, error } = await supabaseAdmin
      .from('conversations')
      .select(`
        *,
        participant1:users!conversations_participant1_id_fkey(id, name, email, user_type),
        participant2:users!conversations_participant2_id_fkey(id, name, email, user_type),
        last_message:messages(content, created_at, sender_id)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ message: 'Failed to fetch conversations' });
    }

    // Format conversations to include other user info and unread count
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.participant1_id === userId ? conv.participant2 : conv.participant1;
        
        // Get unread message count
        const { count: unreadCount } = await supabaseAdmin
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', userId)
          .eq('is_read', false);

        return {
          id: conv.id,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            email: otherUser.email,
            userType: otherUser.user_type
          },
          lastMessage: conv.last_message?.[0] || null,
          unreadCount: unreadCount || 0,
          updatedAt: conv.updated_at
        };
      })
    );

    res.json(formattedConversations);
  } catch (error) {
    console.error('Error in /conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get messages for a specific conversation
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Get messages for this conversation
    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: 'Failed to fetch messages' });
    }

    // Mark messages as read
    await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId);

    res.json(messages);
  } catch (error) {
    console.error('Error in /conversation/:id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user.id;

    if (!conversationId || !content?.trim()) {
      return res.status(400).json({ message: 'Conversation ID and content are required' });
    }

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .or(`participant1_id.eq.${senderId},participant2_id.eq.${senderId}`)
      .single();

    if (convError || !conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Insert the message
    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: senderId,
          content: content.trim(),
          is_read: false
        }
      ])
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name)
      `)
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ message: 'Failed to send message' });
    }

    // Update conversation's updated_at timestamp
    await supabaseAdmin
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error in POST /messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { recipientId, initialMessage } = req.body;
    const userId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (recipientId === userId) {
      return res.status(400).json({ message: 'Cannot create conversation with yourself' });
    }

    // Check if conversation already exists
    const { data: existingConv, error: existingError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`and(participant1_id.eq.${userId},participant2_id.eq.${recipientId}),and(participant1_id.eq.${recipientId},participant2_id.eq.${userId})`)
      .single();

    let conversation;

    if (existingConv) {
      conversation = existingConv;
    } else {
      // Create new conversation
      const { data: newConv, error: convError } = await supabaseAdmin
        .from('conversations')
        .insert([
          {
            participant1_id: userId,
            participant2_id: recipientId
          }
        ])
        .select('*')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return res.status(500).json({ message: 'Failed to create conversation' });
      }

      conversation = newConv;
    }

    // Send initial message if provided
    if (initialMessage?.trim()) {
      const { error: messageError } = await supabaseAdmin
        .from('messages')
        .insert([
          {
            conversation_id: conversation.id,
            sender_id: userId,
            content: initialMessage.trim(),
            is_read: false
          }
        ]);

      if (messageError) {
        console.error('Error sending initial message:', messageError);
      }
    }

    // Get the other user's info
    const { data: otherUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, user_type')
      .eq('id', recipientId)
      .single();

    if (userError) {
      console.error('Error fetching other user:', userError);
      return res.status(500).json({ message: 'Failed to fetch user info' });
    }

    res.status(201).json({
      id: conversation.id,
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        email: otherUser.email,
        userType: otherUser.user_type
      },
      lastMessage: null,
      unreadCount: 0,
      updatedAt: conversation.updated_at
    });
  } catch (error) {
    console.error('Error in POST /conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
