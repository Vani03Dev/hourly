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
import { useAuth } from "../../../contexts/AuthContext";
import { createClient } from '../../../utils/supabase/client';

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
      const { Toast } = await import('../../../utils/toast');
      Toast.error('Please log in to book a session');
      return;
    }
    
    if (!selectedDate || !selectedTimeSlot) return;
    
    setIsBooking(true);
    try {
      
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
      const { Toast } = await import('../../../utils/toast');
      Toast.error(err.message || 'Failed to initialize payment');
      setIsBooking(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        
        {/* Back button and Expert Header */}
        <Box sx={{ mb: 4 }}>
          <Button 
            component={Link} 
            href={`/profile/${expertId}`}
            startIcon={<Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>←</Typography>}
            sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 3, pl: 0, '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
          >
            Back to profile
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={profile.avatar_url} sx={{ width: 64, height: 64, border: '2px solid', borderColor: 'divider' }}>
              {!profile.avatar_url && fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>1:1 Video Consultation</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                with {fullName} • <AccessTimeIcon fontSize="small" /> 30 mins
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Booking Widget */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }}
        >
          {/* Calendar Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(13,148,136,0.02)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Select Date & Time</Typography>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            {/* Calendar Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" disabled sx={{ border: '1px solid', borderColor: 'divider' }}><Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{"<"}</Typography></IconButton>
                <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}><Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{">"}</Typography></IconButton>
              </Box>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 4 }}>
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
                <Typography key={d} align="center" variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', mb: 1 }}>{d}</Typography>
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
                
                // Check availability
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
                      aspectRatio: '1', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: isSelected ? 900 : canSelect ? 700 : 500,
                      bgcolor: isSelected ? 'secondary.main' : canSelect ? 'rgba(13,148,136,0.04)' : 'transparent',
                      color: isPastDate ? 'text.disabled' : isSelected ? 'white' : isAvailable ? 'text.primary' : 'text.disabled',
                      cursor: isPastDate ? 'not-allowed' : isAvailable ? 'pointer' : 'default',
                      border: '2px solid',
                      borderColor: isSelected ? 'secondary.main' : 'transparent',
                      transition: 'all 0.1s',
                      '&:hover': canSelect && !isSelected ? { borderColor: 'secondary.light', bgcolor: 'rgba(13,148,136,0.08)' } : {}
                    }}
                  >
                    {dateNum}
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Time Slots */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              {selectedDate ? `Available Times for ${new Date(currentYear, currentMonth, selectedDate).toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric'})}` : "Select a date"}
            </Typography>
            
            {selectedDate && timeSlots.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 4 }}>
                {timeSlots.map((slot: string, idx: number) => {
                  let isBooked = existingBookings.some(b => b.start_time === slot);
                  
                  // Google Calendar overlap logic
                  if (!isBooked && googleBusySlots.length > 0) {
                    const slotStart = new Date(currentYear, currentMonth, selectedDate);
                    const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    if (match) {
                      let hours = parseInt(match[1]);
                      if (match[3].toUpperCase() === "PM" && hours !== 12) hours += 12;
                      if (match[3].toUpperCase() === "AM" && hours === 12) hours = 0;
                      slotStart.setHours(hours, parseInt(match[2]), 0, 0);
                      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
                      isBooked = googleBusySlots.some(busy => slotStart < busy.end && slotEnd > busy.start);
                    }
                  }

                  const isSelected = selectedTimeSlot === slot;
                  
                  return (
                    <Button
                      key={idx}
                      variant="outlined"
                      disabled={isBooked}
                      onClick={() => setSelectedTimeSlot(slot)}
                      sx={{ 
                        borderRadius: 2, 
                        py: 1.5, 
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        borderWidth: 2,
                        borderColor: isSelected ? 'secondary.main' : 'divider',
                        color: isBooked ? 'text.disabled' : isSelected ? 'secondary.main' : 'text.primary',
                        textDecoration: isBooked ? 'line-through' : 'none',
                        bgcolor: isSelected ? 'rgba(13,148,136,0.05)' : 'transparent',
                        '&:hover': { 
                          borderWidth: 2,
                          borderColor: isBooked ? 'transparent' : 'secondary.main',
                          bgcolor: isBooked ? 'transparent' : 'rgba(13,148,136,0.05)',
                        }
                      }}
                    >
                      {slot}
                    </Button>
                  );
                })}
              </Box>
            ) : selectedDate ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 4 }}>
                No slots available on this date.
              </Typography>
            ) : null}

            {/* Footer / CTA */}
            <Box sx={{ mt: 2, p: 3, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 800 }}>Total Price</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>₹{profile.hourly_rate || 500}</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                fullWidth 
                onClick={handleBookSession}
                disabled={!selectedDate || !selectedTimeSlot || isBooking}
                sx={{ 
                  py: 2, 
                  borderRadius: 50, 
                  fontSize: '1.1rem', 
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(13, 148, 136, 0.25)',
                  '&:disabled': {
                    bgcolor: 'action.disabledBackground',
                    boxShadow: 'none'
                  }
                }}
              >
                {isBooking ? "Processing..." : "Continue to Payment"}
              </Button>
            </Box>
            
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
