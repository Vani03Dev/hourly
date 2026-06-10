import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { expert_id, date } = body;

    if (!expert_id || !date) {
      return NextResponse.json({ error: 'Missing expert_id or date' }, { status: 400 });
    }

    // We must use the Service Role Key to bypass RLS, because a Mentee is requesting the Expert's calendar
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase Service Role Key");
      return NextResponse.json({ busySlots: [] }); // Fail gracefully
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const { data: integration, error } = await supabaseAdmin
      .from('google_integrations')
      .select('*')
      .eq('expert_id', expert_id)
      .single();

    if (error || !integration) {
      // The expert hasn't connected their calendar. This is perfectly normal.
      return NextResponse.json({ busySlots: [] });
    }

    let accessToken = integration.access_token;

    // Check if token is expired (adding 1 minute buffer)
    const tokenExpiry = new Date(integration.token_expiry).getTime();
    if (tokenExpiry - 60000 <= Date.now()) {
      // Refresh the token
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        return NextResponse.json({ busySlots: [] }); // Fail gracefully
      }

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: integration.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      const tokens = await tokenResponse.json();
      
      if (tokens.error) {
        console.error('Failed to refresh token:', tokens);
        return NextResponse.json({ busySlots: [] }); // Fail gracefully
      }

      accessToken = tokens.access_token;
      const newExpiry = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

      await supabaseAdmin
        .from('google_integrations')
        .update({ access_token: accessToken, token_expiry: newExpiry, updated_at: new Date().toISOString() })
        .eq('id', integration.id);
    }

    // Determine the user's timezone from the frontend if possible, but default to local or UTC 
    // Wait, the `date` is a string like "2023-10-25". Let's fetch the entire 24 hour block in UTC
    const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${date}T23:59:59Z`).toISOString();

    const freeBusyResponse = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [{ id: 'primary' }],
      }),
    });

    const freeBusyData = await freeBusyResponse.json();
    
    if (freeBusyData.error) {
      console.error('Google Calendar API Error:', freeBusyData);
      return NextResponse.json({ busySlots: [] }); // Fail gracefully
    }

    const busySlots = freeBusyData.calendars?.primary?.busy || [];

    return NextResponse.json({ busySlots });
  } catch (err) {
    console.error('Calendar Fetch Exception:', err);
    return NextResponse.json({ busySlots: [] }); // Fail gracefully so booking still works
  }
}
