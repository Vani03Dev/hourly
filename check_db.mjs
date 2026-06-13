import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: experts } = await supabase.from('expert_profiles').select('id, username');
  console.log("Experts:", experts);
  
  const { data: clients } = await supabase.from('client_profiles').select('id, company_name');
  console.log("Clients:", clients);
  
  const { data: users } = await supabase.auth.admin?.listUsers() || { data: { users: [] } };
  console.log("Users:", users.users?.length);
}

check();
