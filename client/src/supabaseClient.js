import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: Get or create a conversation between two users
export async function getOrCreateChat(user1Id, user2Id) {
  try {
    // First, try to find an existing conversation between these users
    const { data: existingConvs, error: findError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${user1Id},participant2_id.eq.${user2Id}),and(participant1_id.eq.${user2Id},participant2_id.eq.${user1Id})`);

    if (findError) throw findError;
    if (existingConvs && existingConvs.length > 0) {
      return existingConvs[0].id;
    }

    // If no existing conversation, create a new one
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert([
        {
          participant1_id: user1Id,
          participant2_id: user2Id
        }
      ])
      .select('id')
      .single();

    if (createError) throw createError;
    return newConv.id;
  } catch (error) {
    console.error('Error in getOrCreateChat:', error);
    throw error;
  }
}

// Helper: Close a chat
export async function closeChat(chatId) {
  const { error } = await supabase
    .from('chats')
    .update({ status: 'closed' })
    .eq('id', chatId);
  if (error) throw error;
}

// Helper: Get all messages for a chat
export async function getMessages(chatId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
} 