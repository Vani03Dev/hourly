"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container, Box, Typography, Paper, Grid, Avatar, Chip, Button, 
  Divider, Skeleton, IconButton
} from "@mui/material";
import toast from 'react-hot-toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from "@/contexts/AuthContext";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const expertId = params.id as string;
  
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [googleBusySlots, setGoogleBusySlots] = useState<{start: Date, end: Date}[]>([]);
  
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function loadExpertProfile() {
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('expert_profiles')
          .select('*')
          .eq('id', expertId)
          .single();
          
        if (error) throw error;
        setProfile(data);
        
        // Select today's date by default if available
        setSelectedDate(new Date().getDate());
      } catch (err) {
        console.error("Failed to load expert profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (expertId) loadExpertProfile();
  }, [expertId]);

  // Fetch bookings for the selected date
  useEffect(() => {
    async function fetchBookings() {
      if (!selectedDate || !profile) return;
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data, error } = await supabase
          .from('bookings')
          .select('start_time, status')
          .eq('expert_id', expertId)
          .eq('booking_date', dateString)
          .neq('status', 'canceled');
          
        const bookings = data || [];
        setExistingBookings(bookings);

        // Fetch Google Calendar events
        try {
          const res = await fetch('/api/google/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expert_id: expertId, date: dateString })
          });
          const googleData = await res.json();
          if (googleData.busySlots && Array.isArray(googleData.busySlots)) {
            const parsedSlots = googleData.busySlots.map((slot: any) => ({
              start: new Date(slot.start),
              end: new Date(slot.end)
            }));
            setGoogleBusySlots(parsedSlots);
          } else {
            setGoogleBusySlots([]);
          }
        } catch (err) {
          console.error("Google Calendar fetch error:", err);
          setGoogleBusySlots([]);
        }
        
      } catch (err) {
        console.error("Failed to load bookings:", err);
      }
    }
    
    fetchBookings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedTimeSlot(null); // reset selected time when date changes
  }, [selectedDate, expertId, profile]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="circular" width={120} height={120} sx={{ mb: 4 }} />
            <Skeleton variant="text" sx={{ fontSize: '3rem', mb: 1, width: '60%' }} />
            <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 4, width: '40%' }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>Profile Not Found</Typography>
        <Typography variant="body1" color="text.secondary">The expert you are looking for does not exist or has deactivated their account.</Typography>
      </Container>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous Expert';

  // --- CALENDAR LOGIC ---
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6; // Make Monday first
  
  const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Calculate available slots for the selected date
  let availableTimeBlocks: any[] = [];
  
  if (selectedDate) {
    const selectedFullDate = new Date(currentYear, currentMonth, selectedDate);
    const dayName = fullDayNames[selectedFullDate.getDay()];
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    
    // Check overrides first
    const overrides = profile.date_overrides || {};
    if (overrides[dateString] !== undefined) {
      availableTimeBlocks = overrides[dateString];
    } else {
      // Fallback to weekly schedule
      const weekly = profile.weekly_schedule || {};
      availableTimeBlocks = weekly[dayName] || [];
    }
  }

  // Helper to convert time strings (e.g. "09:00 AM") to minutes since midnight
  const timeToMinutes = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const isPM = match[3].toUpperCase() === "PM";
    if (hours === 12 && !isPM) hours = 0;
    if (hours !== 12 && isPM) hours += 12;
    return hours * 60 + minutes;
  };

  // Helper to convert minutes since midnight back to "hh:mm A"
  const minutesToTime = (mins: number) => {
    let hours = Math.floor(mins / 60);
    const m = mins % 60;
    const isPM = hours >= 12;
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return `${hours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
  };

  // Generate 30-min slots from an array of blocks
  const generateSlots = (blocks: any[]) => {
    const slots: string[] = [];
    for (const block of blocks) {
      if (!block.start || !block.end) continue;
      const startMins = timeToMinutes(block.start);
      const endMins = timeToMinutes(block.end);
      for (let m = startMins; m < endMins; m += 30) {
        slots.push(minutesToTime(m));
      }
    }
    return slots;
  };

  const timeSlots = generateSlots(availableTimeBlocks);

  const handleBookSession = async () => {
    if (!user) {
      const { Toast } = await import('@/utils/toast');
      Toast.error('Please log in to book a session');
      return;
    }
    
    if (!selectedDate || !selectedTimeSlot) return;
    
    setIsBooking(true);
    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      
      const startMins = timeToMinutes(selectedTimeSlot);
      const endMins = startMins + 30;
      const endTimeSlot = minutesToTime(endMins);
      
      const roomName = `Hourly-${crypto.randomUUID()}`;
      const meetingLink = `https://meet.jit.si/${roomName}`;
      
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          expert_id: expertId,
          mentee_id: user.id,
          booking_date: dateString,
          start_time: selectedTimeSlot,
          end_time: endTimeSlot,
          status: 'pending', // Wait for payment confirmation
          payment_status: 'pending',
          meeting_link: meetingLink
        })
        .select()
        .single();
        
      if (error) throw error;

      // Create Razorpay Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           amount: profile.hourly_rate || 500, // Fallback to 500 if not set
           notes: { bookingId: booking.id }
        }),
      });
      const orderData = await res.json();
      if (orderData.error) throw new Error(orderData.error);

      // Save Razorpay order ID to booking
      await supabase.from('bookings').update({ razorpay_order_id: orderData.order.id }).eq('id', booking.id);

      // Load Razorpay SDK
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      
      const isLoaded = await loadScript();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Needs to be added to .env.local
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Hourly Session",
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
          color: "#0d9488", // Teal theme color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
         toast.error("Payment failed. Please try again.");
      });
      
      // Close booking state when modal opens, because they are effectively booked, just pending payment
      setIsBooking(false);
      setSelectedTimeSlot(null);
      rzp.open();
      
    } catch (err: any) {
      console.error(err);
      const { Toast } = await import('@/utils/toast');
      Toast.error(err.message || 'Failed to initialize payment');
      setIsBooking(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* HEADER BANNER */}
      <Box sx={{ height: 200, bgcolor: 'primary.main', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 20% 150%, #ffffff 0%, transparent 50%)' }} />
      </Box>

      <Container maxWidth="lg" sx={{ pb: 12 }}>
        <Grid container spacing={6} sx={{ mt: -10 }}>
          
          {/* LEFT COLUMN: Profile Info */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
              <Avatar 
                src={profile.avatar_url}
                sx={{ 
                  width: 160, 
                  height: 160, 
                  border: '6px solid', 
                  borderColor: 'background.default',
                  bgcolor: 'secondary.main',
                  fontSize: '4rem',
                  mb: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                {!profile.avatar_url && fullName.charAt(0)}
              </Avatar>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                  {fullName}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, mb: 3 }}>
                  {profile.title || "Professional Expert"}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: '#F59E0B' }} />
                    <Typography sx={{ fontWeight: 'bold' }}>5.0 <Typography component="span" color="text.secondary" variant="body2">(12 Reviews)</Typography></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="action" />
                    <Typography color="text.secondary" sx={{ fontWeight: 'medium' }}>Remote</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VideoCameraFrontIcon color="action" />
                    <Typography color="text.secondary" sx={{ fontWeight: 'medium' }}>Google Meet</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 5 }} />

              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>About Me</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: 'text.secondary', fontSize: '1.05rem' }}>
                  {profile.bio || "This expert hasn't added a bio yet."}
                </Typography>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Areas of Expertise</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {(profile.tags || []).map((tag: string) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      sx={{ 
                        bgcolor: 'rgba(13,148,136,0.1)', 
                        color: 'secondary.dark', 
                        fontWeight: 'bold',
                        px: 1,
                        py: 2.5,
                        borderRadius: 3,
                        fontSize: '0.9rem'
                      }} 
                    />
                  ))}
                  {(!profile.tags || profile.tags.length === 0) && (
                    <Typography variant="body2" color="text.secondary">No expertise tags added.</Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* RIGHT COLUMN: Booking Calendar */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 32 }}>
              <Paper 
                elevation={4} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                }}
              >
                {/* Price Banner */}
                <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(13,148,136,0.02)' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ₹{profile.hourly_rate || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                      per 30-min session
                    </Typography>
                  </Box>
                  <AccessTimeIcon sx={{ fontSize: '2.5rem', color: 'secondary.main', opacity: 0.5 }} />
                </Box>

                {/* Calendar */}
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Select a Date</Typography>
                  
                  <Box sx={{ mb: 4, bgcolor: 'background.default', p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 'bold', cursor: 'not-allowed' }}>{"<"}</Typography>
                        <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 'bold', cursor: 'pointer' }}>{">"}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                        <Typography key={d} align="center" variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1 }}>{d}</Typography>
                      ))}
                      
                      {/* Empty days padding */}
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <Box key={`empty-${i}`} />
                      ))}
                      
                      {/* Actual dates */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dateNum = i + 1;
                        const today = now.getDate();
                        const isPastDate = dateNum < today;
                        const isSelected = selectedDate === dateNum;
                        
                        // Check availability for this date
                        const currentDate = new Date(currentYear, currentMonth, dateNum);
                        const dayName = fullDayNames[currentDate.getDay()];
                        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                        
                        let isAvailable = false;
                        const overrides = profile.date_overrides || {};
                        if (overrides[dateString] !== undefined) {
                          isAvailable = overrides[dateString].length > 0;
                        } else {
                          const weekly = profile.weekly_schedule || {};
                          isAvailable = (weekly[dayName] || []).length > 0;
                        }
                        
                        const canSelect = isAvailable && !isPastDate;

                        return (
                          <Box 
                            key={`date-${dateNum}`} 
                            onClick={() => canSelect && setSelectedDate(dateNum)}
                            sx={{ 
                              position: 'relative',
                              aspectRatio: '1', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              borderRadius: '50%',
                              fontSize: '0.9rem',
                              bgcolor: isSelected ? 'secondary.main' : canSelect ? 'rgba(13,148,136,0.05)' : 'transparent',
                              color: isPastDate ? 'text.disabled' : isSelected ? 'white' : isAvailable ? 'text.primary' : 'text.disabled',
                              fontWeight: canSelect || isSelected ? 'bold' : 'normal',
                              cursor: isPastDate ? 'not-allowed' : isAvailable ? 'pointer' : 'default',
                              opacity: isPastDate ? 0.3 : 1,
                              transition: 'all 0.2s',
                              border: '1px solid',
                              borderColor: isSelected ? 'secondary.main' : canSelect ? 'rgba(13,148,136,0.1)' : 'transparent',
                              '&:hover': canSelect && !isSelected ? { bgcolor: 'rgba(13,148,136,0.15)', transform: 'scale(1.1)' } : {}
                            }}
                          >
                            {dateNum}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Available Times</Typography>
                  
                  {timeSlots.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 4, maxHeight: 280, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 } }}>
                      {timeSlots.map((slot: string, idx: number) => {
                        let isBooked = existingBookings.some(b => b.start_time === slot);
                        
                        // Check Google Calendar overlap
                        if (!isBooked && googleBusySlots.length > 0) {
                          const slotStart = new Date(selectedDate!);
                          const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
                          if (match) {
                            let hours = parseInt(match[1]);
                            if (match[3].toUpperCase() === "PM" && hours !== 12) hours += 12;
                            if (match[3].toUpperCase() === "AM" && hours === 12) hours = 0;
                            slotStart.setHours(hours, parseInt(match[2]), 0, 0);
                            
                            // Assume 1 hour session duration for overlap calculation
                            const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
                            
                            // Overlap condition: slotStart < busyEnd AND slotEnd > busyStart
                            isBooked = googleBusySlots.some(busy => slotStart < busy.end && slotEnd > busy.start);
                          }
                        }

                        const isSelected = selectedTimeSlot === slot;
                        
                        return (
                          <Button
                            key={idx}
                            variant={isSelected ? "contained" : "outlined"}
                            color={isSelected ? "secondary" : "secondary"}
                            disabled={isBooked}
                            onClick={() => setSelectedTimeSlot(slot)}
                            sx={{ 
                              borderRadius: 3, 
                              py: 1.5, 
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              borderWidth: isSelected ? 0 : 1,
                              borderColor: isSelected ? 'transparent' : 'rgba(0,0,0,0.1)',
                              color: isBooked ? 'text.disabled' : isSelected ? 'white' : 'text.primary',
                              textDecoration: isBooked ? 'line-through' : 'none',
                              bgcolor: isSelected ? 'secondary.main' : 'background.paper',
                              boxShadow: isSelected ? '0 4px 14px rgba(13, 148, 136, 0.4)' : '0 2px 4px rgba(0,0,0,0.02)',
                              transition: 'all 0.2s',
                              '&:hover': { 
                                borderWidth: isSelected ? 0 : 1, 
                                borderColor: isBooked ? 'transparent' : 'secondary.main',
                                bgcolor: isBooked ? 'transparent' : isSelected ? 'secondary.dark' : 'rgba(13,148,136,0.05)',
                                transform: isBooked ? 'none' : 'translateY(-2px)'
                              }
                            }}
                          >
                            {slot}
                          </Button>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 3, mb: 4 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        No availability on this date.
                      </Typography>
                    </Box>
                  )}

                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    fullWidth 
                    onClick={handleBookSession}
                    disabled={!selectedDate || !selectedTimeSlot || isBooking}
                    sx={{ 
                      py: 2, 
                      borderRadius: 3, 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(15,23,42,0.15)'
                    }}
                  >
                    {isBooking ? "Confirming..." : "Confirm & Book Session"}
                  </Button>

                  <Typography variant="caption" color="text.secondary" align="center" component="p" sx={{ mt: 2 }}>
                    Times shown in {profile.timezone === 'asia_kolkata' ? 'India Standard Time (IST)' : profile.timezone || 'Local Time'}
                  </Typography>

                </Box>
              </Paper>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
