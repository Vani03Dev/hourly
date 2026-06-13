const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: users, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("Auth Error:", authError);
  } else {
    for (const u of users.users) {
      console.log(`User: ${u.email} ID: ${u.id}`);
      const { data: eData } = await supabase.from('expert_profiles').select('*').eq('id', u.id).single();
      console.log(`Expert Profile:`, eData ? 'YES' : 'NO');
      const { data: cData } = await supabase.from('client_profiles').select('*').eq('id', u.id).single();
      console.log(`Client Profile:`, cData ? 'YES' : 'NO');
    }
  }
}
run();
