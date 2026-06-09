"use server";

import { createClient } from "@/utils/supabase/server";

export async function submitExpertOnboarding(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'Authentication required' };
    }

    // Extract form data
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;
    const hourlyRate = parseInt(formData.get('hourlyRate') as string, 10);
    const tagsString = formData.get('tags') as string;
    
    // Validate
    if (!title || !bio || !hourlyRate || !tagsString) {
      return { error: 'Missing required fields' };
    }

    let tags: string[] = [];
    try {
      tags = JSON.parse(tagsString);
    } catch (e) {
      return { error: 'Invalid tags format' };
    }

    // Insert or Update the expert profile natively using Supabase
    const { error: dbError } = await supabase
      .from('expert_profiles')
      .upsert({
        id: user.id,
        title,
        bio,
        hourly_rate: hourlyRate,
        tags,
        is_onboarded: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (dbError) {
      console.error("Database Error:", dbError);
      return { error: `Database Error: ${dbError.message}` };
    }

    return { success: true };
    
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { error: error.message || 'An unexpected error occurred' };
  }
}
