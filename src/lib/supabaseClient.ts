import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Exporting a stub client that remains deactivated until config environment variables are configured
export const supabase = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Helper to check if Supabase is correctly linked and active.
 */
export function isSupabaseLinked(): boolean {
  return !!supabase;
}

/**
 * Example function to sync local conversation history with Supabase tables.
 * This is prepared for future login authentication features.
 */
export async function syncConversationToCloud(
  conversationId: string, 
  title: string, 
  category: string,
  messages: any[]
) {
  if (!supabase) {
    console.warn("Supabase is not configured. Sync skipped.");
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 1. Upsert Conversation
    const { error: convErr } = await supabase
      .from("conversations")
      .upsert({
        id: conversationId,
        user_id: user.id,
        title,
        category,
        updated_at: new Date().toISOString(),
      });

    if (convErr) throw convErr;

    // 2. Insert or update messages
    const formattedMessages = messages.map(msg => ({
      id: msg.id.startsWith("msg_") && msg.id.length === 36 ? msg.id : undefined, // UUID matching check
      conversation_id: conversationId,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    const { error: msgErr } = await supabase
      .from("messages")
      .upsert(formattedMessages);

    if (msgErr) throw msgErr;

    return { success: true };
  } catch (err) {
    console.error("Failed to sync conversation to cloud:", err);
    return { success: false, error: err };
  }
}
