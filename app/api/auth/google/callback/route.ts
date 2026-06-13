import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/expert/availability?error=NoCode', req.url));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_LATER',
    process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_LATER',
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Fetch existing to preserve refresh_token if new one is not provided
    const { data: existing } = await supabase
      .from('google_integrations')
      .select('refresh_token')
      .eq('expert_id', user.id)
      .single();

    const refreshToken = tokens.refresh_token || existing?.refresh_token;

    if (!refreshToken) {
      // If we don't have a refresh token, we can't maintain offline access
      // User needs to revoke access in Google Account and re-auth, but we'll save what we have
    }

    const tokenExpiry = new Date(tokens.expiry_date || Date.now() + 3600 * 1000).toISOString();

    const { error } = await supabase.from('google_integrations').upsert({
      expert_id: user.id,
      access_token: tokens.access_token,
      refresh_token: refreshToken || '',
      token_expiry: tokenExpiry,
      updated_at: new Date().toISOString()
    }, { onConflict: 'expert_id' });

    if (error) {
      console.error('Error saving google integration:', error);
      return NextResponse.redirect(new URL('/expert/availability?error=DatabaseError', req.url));
    }

    return NextResponse.redirect(new URL('/expert/availability?success=GoogleCalendarConnected', req.url));
  } catch (error) {
    console.error('Error in google callback:', error);
    return NextResponse.redirect(new URL('/expert/availability?error=TokenExchangeFailed', req.url));
  }
}
