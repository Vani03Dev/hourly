import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { booking_id, new_date, new_start_time, new_end_time } = await request.json();
    
    if (!booking_id || !new_date || !new_start_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('expert_id, status')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.expert_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    if (booking.status === 'canceled') {
      return NextResponse.json({ error: 'Cannot reschedule a canceled booking' }, { status: 400 });
    }

    // Default 1 hour end time if not provided
    let endTime = new_end_time;
    if (!endTime) {
      // Very basic add 1 hour logic for AM/PM string
      const match = new_start_time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        const hours = parseInt(match[1]);
        const isPM = match[3].toUpperCase() === "PM";
        if (hours === 11 && !isPM) endTime = `12:${match[2]} PM`;
        else if (hours === 11 && isPM) endTime = `12:${match[2]} AM`;
        else if (hours === 12) endTime = `01:${match[2]} ${isPM ? 'PM' : 'AM'}`;
        else endTime = `${String(hours + 1).padStart(2, '0')}:${match[2]} ${match[3]}`;
      } else {
        endTime = new_start_time; // Fallback
      }
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        booking_date: new_date,
        start_time: new_start_time,
        end_time: endTime
      })
      .eq('id', booking_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reschedule API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
