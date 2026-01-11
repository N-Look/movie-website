import { supabase } from "./supabase";

/**
 * Chat History Service
 * Manages AI recommendation chat history in Supabase
 *
 * Required Supabase table:
 *
 * CREATE TABLE chat_history (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
 *   chat_id TEXT NOT NULL,
 *   title TEXT NOT NULL,
 *   messages JSONB NOT NULL DEFAULT '[]',
 *   tmdb_data JSONB DEFAULT '{}',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Enable RLS
 * ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
 *
 * -- Users can only access their own chats
 * CREATE POLICY "Users can view own chats" ON chat_history
 *   FOR SELECT USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can insert own chats" ON chat_history
 *   FOR INSERT WITH CHECK (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can update own chats" ON chat_history
 *   FOR UPDATE USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can delete own chats" ON chat_history
 *   FOR DELETE USING (auth.uid() = user_id);
 *
 * -- Index for faster queries
 * CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
 * CREATE INDEX idx_chat_history_updated_at ON chat_history(updated_at DESC);
 */

// Load all chats for a user
export async function loadUserChats(userId) {
  try {
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return data.map((chat) => ({
      id: chat.chat_id,
      title: chat.title,
      messages: chat.messages,
      tmdbDataMap: chat.tmdb_data || {},
      timestamp: new Date(chat.created_at).getTime(),
      dbId: chat.id,
    }));
  } catch (error) {
    console.error("Error loading chats:", error);
    return [];
  }
}

// Save or update a chat
export async function saveChat(userId, chat) {
  try {
    // Check if chat exists
    const { data: existing } = await supabase
      .from("chat_history")
      .select("id")
      .eq("user_id", userId)
      .eq("chat_id", chat.id)
      .single();

    if (existing) {
      // Update existing chat
      const { error } = await supabase
        .from("chat_history")
        .update({
          title: chat.title,
          messages: chat.messages,
          tmdb_data: chat.tmdbDataMap || {},
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("chat_id", chat.id);

      if (error) throw error;
    } else {
      // Insert new chat
      const { error } = await supabase.from("chat_history").insert({
        user_id: userId,
        chat_id: chat.id,
        title: chat.title,
        messages: chat.messages,
        tmdb_data: chat.tmdbDataMap || {},
      });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error("Error saving chat:", error);
    return false;
  }
}

// Delete a chat
export async function deleteChat(userId, chatId) {
  try {
    const { error } = await supabase
      .from("chat_history")
      .delete()
      .eq("user_id", userId)
      .eq("chat_id", chatId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting chat:", error);
    return false;
  }
}
