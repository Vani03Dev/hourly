import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // user.id
  
  if (!code || !state) {
    return NextResponse.redirect(new URL('/expert/settings?error=invalid_request', request.url));
  }

  // Ensure the logged in user matches the state
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.id !== state) {
    return NextResponse.redirect(new URL('/expert/settings?error=unauthorized', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/google/callback`;

  if (!clientId || !clientSecret) {
    console.error("Missing Google Client ID or Secret in environment variables");
    return NextResponse.redirect(new URL('/expert/settings?error=server_error', request.url));
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      console.error('Google OAuth Error:', tokens);
      return NextResponse.redirect(new URL('/expert/settings?error=oauth_failed', request.url));
    }

    // Save tokens to DB
    const expiryDate = new Date(Date.now() + tokens.expires_in * 1000);

    // Note: Google only provides refresh_token on the first prompt=consent.
    // If it's missing, it means the user already authorized the app. We should ideally keep the old refresh token if it exists.
    // But since this is a new setup, we explicitly requested prompt=consent.
    
    // Check if an existing integration exists to preserve refresh_token if not provided
    const { data: existing } = await supabase
      .from('google_integrations')
      .select('refresh_token')
      .eq('expert_id', user.id)
      .single();

    const refreshToken = tokens.refresh_token || existing?.refresh_token;

    if (!refreshToken) {
      console.error("No refresh token obtained. User must revoke app access and try again.");
      return NextResponse.redirect(new URL('/expert/settings?error=no_refresh_token', request.url));
    }

    const { error: dbError } = await supabase
      .from('google_integrations')
      .upsert({
        expert_id: user.id,
        access_token: tokens.access_token,
        refresh_token: refreshToken,
        token_expiry: expiryDate.toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'expert_id' });

    if (dbError) {
      console.error('DB Error saving tokens:', dbError);
      return NextResponse.redirect(new URL('/expert/settings?error=db_error', request.url));
    }

    return NextResponse.redirect(new URL('/expert/settings?success=google_connected', request.url));
  } catch (err) {
    console.error('Callback exception:', err);
    return NextResponse.redirect(new URL('/expert/settings?error=server_error', request.url));
  }
}
