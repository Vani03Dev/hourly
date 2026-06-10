import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getBookingConfirmationEmailHtml, getExpertBookingNotificationHtml } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const textBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(textBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(textBody);

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const amountPaid = paymentEntity.amount / 100; // Convert paise back to whole units
      
      const notes = paymentEntity.notes || {};
      const bookingId = notes.bookingId;

      if (!bookingId) {
        console.error('No bookingId found in payment notes for order:', orderId);
        return NextResponse.json({ error: 'No bookingId in notes' }, { status: 400 });
      }

      // Initialize Supabase Admin client to bypass RLS
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Update the booking in Supabase
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          razorpay_payment_id: paymentId,
          amount_paid: amountPaid,
          // Platform fee could also be tracked here
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Failed to update booking in Supabase:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`Successfully confirmed payment for booking ${bookingId}`);

      // SEND TRANSACTIONAL EMAILS
      if (process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          
          const { data: bookingData } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();
            
          if (bookingData) {
            const { data: menteeResponse } = await supabaseAdmin.auth.admin.getUserById(bookingData.mentee_id);
            const { data: expertResponse } = await supabaseAdmin.auth.admin.getUserById(bookingData.expert_id);
            
            const menteeEmail = menteeResponse?.user?.email;
            const expertEmail = expertResponse?.user?.email;
            
            const { data: expertProfile } = await supabaseAdmin
              .from('expert_profiles')
              .select('first_name, last_name')
              .eq('id', bookingData.expert_id)
              .single();
              
            const expertName = expertProfile ? `${expertProfile.first_name || ''} ${expertProfile.last_name || ''}`.trim() : 'Your Expert';
            const roomUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/room/${bookingId}`;
            const fromEmail = 'onboarding@resend.dev'; // Default testing email for Resend
            
            if (menteeEmail) {
              await resend.emails.send({
                from: fromEmail,
                to: menteeEmail,
                subject: 'Booking Confirmed! 🎉',
                html: getBookingConfirmationEmailHtml(expertName, bookingData.booking_date, bookingData.start_time, roomUrl)
              });
            }
            
            if (expertEmail) {
               await resend.emails.send({
                from: fromEmail,
                to: expertEmail,
                subject: 'New Booking Received! 💰',
                html: getExpertBookingNotificationHtml('A mentee', bookingData.booking_date, bookingData.start_time, roomUrl)
              });
            }
          }
        } catch (emailError) {
          console.error("Failed to send transactional emails:", emailError);
          // Don't fail the webhook if email fails
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
