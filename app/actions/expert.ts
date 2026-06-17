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

    const fullName = user.user_metadata?.full_name || '';
    const firstName = user.user_metadata?.first_name || fullName.split(' ')[0] || '';
    const lastName = user.user_metadata?.last_name || fullName.split(' ').slice(1).join(' ') || '';

    // Ensure user metadata role is set to expert
    if (user.user_metadata?.role !== 'expert') {
      await supabase.auth.updateUser({
        data: { role: 'expert' }
      });
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
        first_name: firstName,
        last_name: lastName,
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

export async function updateExpertAvailability(schedule: any, dateOverrides?: Record<string, unknown>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    const updatePayload: Record<string, unknown> = { weekly_schedule: schedule };
    if (dateOverrides !== undefined) {
      updatePayload.date_overrides = dateOverrides;
    }

    const { error } = await supabase
      .from('expert_profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateExpertProfile(data: {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  username: string;
  hourlyRate: number;
  linkedinUrl: string;
  twitterUrl?: string;
  tags: string[];
  timezone?: string;
  emailNotifications?: boolean;
  bookingAlerts?: boolean;
  avatarUrl?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    if (!data.title.trim() || !data.bio.trim() || data.bio.length < 20) {
      return { error: 'Title and bio (min 20 chars) are required' };
    }
    if (!data.username.trim() || data.username.length < 3) {
      return { error: 'Username must be at least 3 characters' };
    }
    if (!/^[a-zA-Z0-9-]+$/.test(data.username)) {
      return { error: 'Username can only contain letters, numbers, and hyphens' };
    }
    if (data.hourlyRate < 100) {
      return { error: 'Hourly rate must be at least ₹100' };
    }
    if (!data.linkedinUrl.includes('linkedin.com')) {
      return { error: 'Please enter a valid LinkedIn URL' };
    }

    const { error: dbError } = await supabase
      .from('expert_profiles')
      .update({
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        title: data.title.trim(),
        bio: data.bio.trim(),
        username: data.username.toLowerCase(),
        hourly_rate: data.hourlyRate,
        linkedin_url: data.linkedinUrl.trim(),
        tags: data.tags,
        timezone: data.timezone || 'asia_kolkata',
        updated_at: new Date().toISOString(),
        ...(data.avatarUrl ? { avatar_url: data.avatarUrl.trim() } : {}),
      })
      .eq('id', user.id);

    if (dbError) {
      if (dbError.code === '23505' && dbError.message.includes('username')) {
        return { error: 'This username is already taken. Please choose another one.' };
      }
      return { error: dbError.message };
    }

    await supabase.auth.updateUser({
      data: {
        full_name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        twitter_url: data.twitterUrl?.trim() || '',
        email_notifications: data.emailNotifications ?? true,
        booking_alerts: data.bookingAlerts ?? true,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function updateCreatorPage(data: {
  title: string;
  bio: string;
  tags: string[];
  avatarUrl?: string;
  pageTheme?: 'teal' | 'blue' | 'navy';
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    if (!data.title.trim()) return { error: 'Professional title is required' };
    if (!data.bio.trim() || data.bio.length < 20) {
      return { error: 'Bio must be at least 20 characters' };
    }
    if (!data.tags.length) return { error: 'Add at least one expertise tag' };

    const updatePayload: Record<string, unknown> = {
      title: data.title.trim(),
      bio: data.bio.trim(),
      tags: data.tags,
      updated_at: new Date().toISOString(),
    };

    if (data.avatarUrl?.trim()) {
      updatePayload.avatar_url = data.avatarUrl.trim();
    }

    const { error: dbError } = await supabase
      .from('expert_profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (dbError) return { error: dbError.message };

    await supabase.auth.updateUser({
      data: {
        page_theme: data.pageTheme || 'teal',
        creator_page_customized: true,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'An unexpected error occurred' };
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

export async function updateAvatarUrl(avatarUrl: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    const { error } = await supabase
      .from('expert_profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
