import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { booking_id } = await request.json();
    
    if (!booking_id) {
      return NextResponse.json({ error: 'Missing booking_id' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('expert_id, status, payment_status, razorpay_payment_id, amount_paid')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.expert_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    if (booking.status === 'canceled') {
      return NextResponse.json({ error: 'Already canceled' }, { status: 400 });
    }

    // If there is a payment, issue a refund via Razorpay
    if (booking.razorpay_payment_id && booking.payment_status === 'paid') {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
      });

      // amount_paid is stored in standard currency (e.g., INR 500), Razorpay refund expects paise (50000)
      const amountInPaise = Math.round(Number(booking.amount_paid) * 100);

      try {
        await razorpay.payments.refund(booking.razorpay_payment_id, {
          amount: amountInPaise,
          speed: "normal",
          receipt: `refund_booking_${booking_id}`
        });
      } catch (rzpError: any) {
        console.error('Razorpay Refund Error:', rzpError);
        return NextResponse.json({ error: 'Payment gateway refund failed. Make sure you have enough balance in Razorpay.' }, { status: 500 });
      }
    }

    // Update DB
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'canceled',
        payment_status: booking.payment_status === 'paid' ? 'refunded' : booking.payment_status
      })
      .eq('id', booking_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cancel API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
