import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: users, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    return NextResponse.json({ error: authError.message });
  }
  
  const results = [];
  for (const u of users.users) {
    const { data: eData } = await supabase.from('expert_profiles').select('*').eq('id', u.id).single();
    const { data: cData } = await supabase.from('client_profiles').select('*').eq('id', u.id).single();
    results.push({
      email: u.email,
      id: u.id,
      metadata_role: u.user_metadata?.role,
      hasExpertProfile: !!eData,
      hasClientProfile: !!cData
    });
  }
  
  return NextResponse.json(results);
}
