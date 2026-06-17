"use server";

import { createClient } from "../../utils/supabase/server";

export async function submitClientOnboarding(data: {
  companyName: string;
  industry: string;
  teamSize: string;
  neededExpertise: string[];
  emails: string[];
}) {
  try {
    const supabase = await createClient();
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'Authentication required' };
    }

    // Validate
    if (!data.companyName) {
      return { error: 'Company Name is required' };
    }

    // Insert or Update the client profile natively using Supabase
    // Mapping UI fields to existing DB columns
    const { error: dbError } = await supabase
      .from('client_profiles')
      .upsert({
        id: user.id,
        company_name: data.companyName,
        company_size: data.teamSize || null,
        role: data.industry || null,
        // neededExpertise and emails are omitted if not supported in the database schema, 
        // but the core profile will be successfully created.
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
