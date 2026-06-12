const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://dvecqeblvsvbuqtedwmj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZWNxZWJsdnN2YnVxdGVkd21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzA2MDAsImV4cCI6MjA5NjU0NjYwMH0.9NbZ_9g0dZpGWxMX4pvAtG5MMPHOLp3C-cs6WCSbUFc";
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('bookings').select('*');
  console.log(data);
}
run();
