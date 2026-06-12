"use server";

import { createClient } from "../../utils/supabase/server";

export async function submitExpertOnboarding(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'Authentication required' };
    }

    // Extract form data
    const linkedinUrl = formData.get('linkedinUrl') as string;
    const username = formData.get('username') as string;
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;
    const hourlyRate = parseInt(formData.get('hourlyRate') as string, 10);
    const tagsString = formData.get('tags') as string;
    
    // Validate
    if (!linkedinUrl || !username || !title || !bio || !hourlyRate || !tagsString) {
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
        username,
        linkedin_url: linkedinUrl,
        title,
        bio,
        hourly_rate: hourlyRate,
        tags,
        is_onboarded: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (dbError) {
      console.error("Database Error:", dbError);
      if (dbError.code === '23505' && dbError.message.includes('username')) {
        return { error: 'This username is already taken. Please choose another one.' };
      }
      return { error: `Database Error: ${dbError.message}` };
    }

    return { success: true };
    
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function updateExpertAvailability(schedule: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    const { error } = await supabase
      .from('expert_profiles')
      .update({ weekly_schedule: schedule })
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createService(data: { title: string, description: string, duration_minutes: number, price: number }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    const { error } = await supabase
      .from('services')
      .insert({
        expert_id: user.id,
        title: data.title,
        description: data.description,
        duration_minutes: data.duration_minutes,
        price: data.price
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteService(serviceId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('expert_id', user.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
