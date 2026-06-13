async function run() {
  const url = 'https://dvecqeblvsvbuqtedwmj.supabase.co/rest/v1';
  const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZWNxZWJsdnN2YnVxdGVkd21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzA2MDAsImV4cCI6MjA5NjU0NjYwMH0.9NbZ_9g0dZpGWxMX4pvAtG5MMPHOLp3C-cs6WCSbUFc';
  
  const headers = {
    'apikey': apikey,
    'Authorization': `Bearer ${apikey}`,
    'Content-Type': 'application/json'
  };

  const res1 = await fetch(`${url}/expert_profiles`, { headers });
  const experts = await res1.json();

  const res2 = await fetch(`${url}/client_profiles`, { headers });
  const clients = await res2.json();

  console.log('--- Expert Profiles ---');
  console.log(experts);

  console.log('\n--- Client Profiles ---');
  console.log(clients);
}

run();
