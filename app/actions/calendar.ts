'use server';

import { google } from 'googleapis';
import { createClient } from '@/utils/supabase/server';

export async function getGoogleCalendarConflicts(expertId: string, startDate: Date, endDate: Date) {
  try {
    const supabase = await createClient();
    
    const { data: integration } = await supabase
      .from('google_integrations')
      .select('*')
      .eq('expert_id', expertId)
      .single();

    if (!integration || !integration.refresh_token) {
      return []; // No integration or missing refresh token, assume free
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_LATER',
      process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET_LATER'
    );

    oauth2Client.setCredentials({
      access_token: integration.access_token,
      refresh_token: integration.refresh_token,
      expiry_date: new Date(integration.token_expiry).getTime()
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Ensure tokens are refreshed if needed
    // The googleapis library automatically refreshes the token if it's expired
    // but we might want to save the new token back to the database in a real app
    
    // Fetch free/busy
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: 'primary' }]
      }
    });

    const calendars = response.data.calendars;
    if (!calendars || !calendars['primary']) return [];

    const busySlots = calendars['primary'].busy || [];
    
    // Return array of busy periods
    return busySlots.map(slot => ({
      start: slot.start || '',
      end: slot.end || ''
    }));

  } catch (error) {
    console.error('Error fetching Google Calendar conflicts:', error);
    return []; // Fail open: if we can't check, assume free rather than blocking everything
  }
}
