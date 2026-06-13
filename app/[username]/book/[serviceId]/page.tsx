"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Video, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getGoogleCalendarConflicts } from '@/app/actions/calendar';

export default function BookingPage({ params }: { params: Promise<{ username: string, serviceId: string }> }) {
  const { username, serviceId } = React.use(params);
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [googleConflicts, setGoogleConflicts] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      const { data: profile } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('username', username)
        .single();
        
      if (profile) {
        setExpert(profile);
        const { data: svc } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .eq('expert_id', profile.id)
          .single();
        if (svc) setService(svc);

        const { data: bks } = await supabase
          .from('bookings')
          .select('booking_date, start_time, end_time')
          .eq('expert_id', profile.id)
          .gte('booking_date', new Date().toISOString().split('T')[0]);
        if (bks) setBookings(bks);
        
        const today = new Date();
        const twoWeeks = new Date(today);
        twoWeeks.setDate(today.getDate() + 14);
        const conflicts = await getGoogleCalendarConflicts(profile.id, today, twoWeeks);
        setGoogleConflicts(conflicts);
      }
      setLoading(false);
    }
    fetchData();
  }, [username, serviceId]);

  // Generate next 14 days based on weekly_schedule
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      if (expert?.weekly_schedule?.[dayName]?.enabled) {
        days.push(d);
      }
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  // Helper to convert HH:MM or HH:MM AM/PM to minutes
  const timeToMins = (timeStr: string) => {
    if (!timeStr) return 0;
    // Check if it has AM/PM
    const hasAMPM = timeStr.toLowerCase().includes('m');
    if (hasAMPM) {
      const [time, period] = timeStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (period.toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    }
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper to format minutes to HH:MM AM/PM
  const minsToTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr12 = h % 12 || 12;
    return `${hr12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Get available slots for a selected date
  const getAvailableSlots = (date: Date) => {
    if (!expert?.weekly_schedule || !service) return [];
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = expert.weekly_schedule[dayName];
    
    if (!daySchedule || !daySchedule.enabled || !daySchedule.slots) return [];
    
    const duration = service.duration_minutes || 30;
    const dateStr = date.toISOString().split('T')[0];
    
    // Get expert's existing bookings for this specific date
    const dayBookings = bookings.filter(b => b.booking_date === dateStr).map(b => ({
      start: timeToMins(b.start_time), // Note: start_time in DB should be HH:MM format (24h) for easy comparison
      end: timeToMins(b.end_time)
    }));

    const availableSlots: string[] = [];
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    daySchedule.slots.forEach((slot: any) => {
      let currentStart = timeToMins(slot.start);
      const slotEnd = timeToMins(slot.end);

      while (currentStart + duration <= slotEnd) {
        const potentialEnd = currentStart + duration;
        
        // Check if slot is in the past (if today)
        if (isToday && currentStart <= currentMins) {
          currentStart += duration;
          continue;
        }

        // Check for conflicts with existing DB bookings
        const hasDbConflict = dayBookings.some(b => 
          (currentStart >= b.start && currentStart < b.end) || 
          (potentialEnd > b.start && potentialEnd <= b.end) || 
          (currentStart <= b.start && potentialEnd >= b.end)   
        );

        // Check for conflicts with Google Calendar
        // currentStart and potentialEnd are minutes from midnight
        const slotStartMs = new Date(date).setHours(0, currentStart, 0, 0);
        const slotEndMs = new Date(date).setHours(0, potentialEnd, 0, 0);
        
        const hasGoogleConflict = googleConflicts.some(gc => {
          const gcStart = new Date(gc.start).getTime();
          const gcEnd = new Date(gc.end).getTime();
          return (
            (slotStartMs >= gcStart && slotStartMs < gcEnd) ||
            (slotEndMs > gcStart && slotEndMs <= gcEnd) ||
            (slotStartMs <= gcStart && slotEndMs >= gcEnd)
          );
        });

        if (!hasDbConflict && !hasGoogleConflict) {
          availableSlots.push(minsToTime(currentStart));
        }
        
        // Move to next slot (we can step by duration, or step by 30 mins)
        currentStart += duration;
      }
    });
    
    return availableSlots;
  };

  const handleCheckout = async () => {
    if (!selectedDate || !selectedTime) return;
    setProcessingPayment(true);
    
    try {
      // 1. Check if user is logged in
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in as a client to book.");
        router.push('/login');
        return;
      }

      const bookingDateStr = selectedDate.toISOString().split('T')[0];
      const roomName = `Sessionly-${crypto.randomUUID()}`;
      
      // 2. Create pending booking
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          expert_id: expert.id,
          mentee_id: user.id,
          booking_date: bookingDateStr,
          start_time: selectedTime,
          end_time: minsToTime(timeToMins(selectedTime) + (service.duration_minutes || 30)),
          status: 'pending',
          payment_status: 'pending',
          amount_paid: service.price,
          meeting_link: `https://meet.jit.si/${roomName}`
        })
        .select()
        .single();

      if (error) throw error;
      
      // 3. Create Razorpay Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           amount: service.price,
           notes: { bookingId: booking.id }
        }),
      });
      const orderData = await res.json();
      if (orderData.error) throw new Error(orderData.error);

      // Save Razorpay order ID to booking
      await supabase.from('bookings').update({ razorpay_order_id: orderData.order.id }).eq('id', booking.id);

      // 4. Load Razorpay SDK
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      
      const isLoaded = await loadScript();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load");

      const fullName = `${expert.first_name || ''} ${expert.last_name || ''}`.trim() || expert.username;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Needs to be added to .env.local
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Sessionly Session",
        description: `Session with ${fullName}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Success callback
          toast.success("Payment successful!");
          router.push(`/booking/success?booking_id=${booking.id}`);
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: "#2563EB", // Blue theme color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
         toast.error("Payment failed. Please try again.");
      });
      
      rzp.open();
      
    } catch (e: any) {
      toast.error(e.message || "Payment initialization failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center">Service not found.</div>;

  return (
    <div className="min-h-screen bg-[#FCFCFD] py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        <Link href={`/${username}`} className="inline-flex items-center text-text-sub hover:text-navy-DEFAULT font-medium mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Profile
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Service Details */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white rounded-[24px] border border-border p-8 sticky top-24 shadow-sm">
              <div className="text-[14px] font-bold text-teal-DEFAULT uppercase tracking-wider mb-2">Service Details</div>
              <h1 className="text-[24px] font-bold text-navy-DEFAULT mb-4 leading-tight">{service.title}</h1>
              <p className="text-[15px] text-text-sub mb-8 pb-8 border-b border-border">{service.description}</p>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 text-navy-DEFAULT font-medium">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-muted"><Clock size={18} /></div>
                  <div>
                    <div className="text-[13px] text-text-sub font-normal">Duration</div>
                    {service.duration_minutes} minutes
                  </div>
                </div>
                <div className="flex items-center gap-4 text-navy-DEFAULT font-medium">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-muted"><Video size={18} /></div>
                  <div>
                    <div className="text-[13px] text-text-sub font-normal">Location</div>
                    Web Conferencing
                  </div>
                </div>
                <div className="flex items-center gap-4 text-navy-DEFAULT font-medium">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-muted"><CreditCard size={18} /></div>
                  <div>
                    <div className="text-[13px] text-text-sub font-normal">Amount</div>
                    ₹{service.price}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar Selection */}
          <div className="flex-1">
            <div className="bg-white rounded-[24px] border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-[20px] font-bold text-navy-DEFAULT mb-6">Select a Date & Time</h2>
              
              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-[14px] font-bold text-navy-DEFAULT mb-3">Available Days</h3>
                <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar">
                  {upcomingDays.map((date, i) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                    const dayNum = date.getDate();
                    
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                        className={`shrink-0 snap-start w-[80px] h-[96px] rounded-[16px] border flex flex-col items-center justify-center transition-all ${isSelected ? 'border-teal-DEFAULT bg-teal-DEFAULT text-white shadow-md scale-105' : 'border-border bg-white text-navy-DEFAULT hover:border-teal-DEFAULT/40'}`}
                      >
                        <span className={`text-[13px] font-medium mb-1 ${isSelected ? 'text-white/80' : 'text-text-sub'}`}>{dayName}</span>
                        <span className="text-[24px] font-bold leading-none">{dayNum}</span>
                        <span className={`text-[12px] font-medium mt-1 ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>{monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-[14px] font-bold text-navy-DEFAULT mb-3">Available Times <span className="text-text-muted font-normal ml-2">({selectedDate.toLocaleDateString()})</span></h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                    {getAvailableSlots(selectedDate).length > 0 ? (
                      getAvailableSlots(selectedDate).map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`h-[48px] rounded-[12px] border text-[14px] font-semibold transition-all ${selectedTime === time ? 'border-teal-DEFAULT bg-teal-DEFAULT/5 text-teal-DEFAULT ring-2 ring-teal-DEFAULT/20' : 'border-border bg-white text-navy-DEFAULT hover:border-teal-DEFAULT/40'}`}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full py-6 text-center text-text-muted text-[15px] bg-surface-1 rounded-[12px] border border-border border-dashed">
                        No slots available on this day.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Checkout Button */}
              {selectedDate && selectedTime && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t border-border flex justify-end">
                  <Button onClick={handleCheckout} disabled={processingPayment} size="lg" className="w-full md:w-auto md:px-12 text-[16px]">
                    {processingPayment ? "Processing..." : `Pay ₹${service.price} to Confirm`}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
