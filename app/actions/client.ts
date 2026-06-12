"use server";

import { createClient } from "../../utils/supabase/server";

export async function submitClientOnboarding(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'Authentication required' };
    }

    // Extract form data
    const companyName = formData.get('companyName') as string;
    const gstin = formData.get('gstin') as string;
    const companySize = formData.get('companySize') as string;
    const role = formData.get('role') as string;
    
    // Validate
    if (!companyName) {
      return { error: 'Company Name is required' };
    }

    // Insert or Update the client profile natively using Supabase
    const { error: dbError } = await supabase
      .from('client_profiles')
      .upsert({
        id: user.id,
        company_name: companyName,
        gstin: gstin || null,
        company_size: companySize || null,
        role: role || null,
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
