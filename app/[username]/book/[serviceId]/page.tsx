"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import { motion } from 'framer-motion';
import { Button } from '../../../../components/ui/Button';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Video, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BookingPage({ params }: { params: { username: string, serviceId: string } }) {
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      const { data: profile } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('username', params.username)
        .single();
        
      if (profile) {
        setExpert(profile);
        const { data: svc } = await supabase
          .from('services')
          .select('*')
          .eq('id', params.serviceId)
          .eq('expert_id', profile.id)
          .single();
        if (svc) setService(svc);
      }
      setLoading(false);
    }
    fetchData();
  }, [params.username, params.serviceId]);

  // Generate next 14 days
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      // Skip weekends for simplicity if not in schedule
      days.push(d);
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  // Get available slots for a selected date
  const getAvailableSlots = (date: Date) => {
    if (!expert?.weekly_schedule) return [];
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = expert.weekly_schedule[dayName];
    
    if (!daySchedule || !daySchedule.enabled) return [];
    
    // In a real app, you would break `daySchedule.slots` into chunks based on `service.duration_minutes`
    // and cross-reference with the `bookings` table. For now, we mock the slots based on their config.
    return ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];
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

      // 2. We mock the payment gateway step and directly create a booking
      // In reality, we would call our Razorpay API here.
      const bookingDateStr = selectedDate.toISOString().split('T')[0];
      
      const { error } = await supabase.from('bookings').insert({
        expert_id: expert.id,
        mentee_id: user.id,
        booking_date: bookingDateStr,
        start_time: selectedTime,
        end_time: "TBD", // Normally calculated based on duration
        status: 'confirmed',
        payment_status: 'paid',
        amount_paid: service.price,
        meeting_link: `https://meet.jit.si/hourly-${crypto.randomUUID()}`
      });

      if (error) throw error;
      
      toast.success("Booking confirmed!");
      router.push('/dashboard/bookings');
      
    } catch (e: any) {
      toast.error(e.message || "Payment failed");
      setProcessingPayment(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center">Service not found.</div>;

  return (
    <div className="min-h-screen bg-[#FCFCFD] py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        <Link href={`/${params.username}`} className="inline-flex items-center text-text-sub hover:text-navy-DEFAULT font-medium mb-8 transition-colors">
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
