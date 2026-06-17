"use server";

import { createClient } from "@/utils/supabase/server";

export async function updatePresence(isOnline: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // Call the RPC function we created in the migration
    const { error } = await supabase.rpc('update_presence', {
      user_id: user.id,
      online_status: isOnline
    });

    if (error) {
      console.error("Failed to update presence:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Presence error:", err);
    return { error: err.message };
  }
}
