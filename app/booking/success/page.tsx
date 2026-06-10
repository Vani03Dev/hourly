"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, Container, Paper, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import confetti from "canvas-confetti";
import Link from "next/link";
import toast from "react-hot-toast";
import { Suspense } from 'react';
import { createClient } from '../../../utils/supabase/client';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");
  
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti immediately
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#14b8a6', '#f59e0b']
    });

    async function fetchBooking(id: string) {
      try {
        
        const supabase = createClient();
        
        // Fetch booking and profiles using a join
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            expert:expert_profiles(*)
          `)
          .eq('id', id)
          .single();
          
        if (error) {
          // Fallback if relation doesn't exist
          const { data: bData } = await supabase.from('bookings').select('*').eq('id', id).single();
          if (bData) {
            const { data: eData } = await supabase.from('expert_profiles').select('*').eq('id', bData.expert_id).single();
            setBooking({ ...bData, expert: eData });
          } else {
            throw error;
          }
        } else {
          setBooking(data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load booking details");
      } finally {
        setIsLoading(false);
      }
    }

    const bookingId = searchParams?.get('booking_id');
    if (bookingId) {
      // Fetch booking details
      fetchBooking(bookingId);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Typography>Booking not found.</Typography>
      </Box>
    );
  }

  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/room/${booking.id}` : '';
  const expertName = booking.expert ? `${booking.expert.first_name} ${booking.expert.last_name}` : 'Expert';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 12 }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 6, 
            borderRadius: 4, 
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, bgcolor: 'success.main' }} />
          
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
            Your session with {expertName} is confirmed.
          </Typography>

          <Box sx={{ bgcolor: 'rgba(13,148,136,0.05)', borderRadius: 3, p: 3, mb: 4, textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CalendarMonthIcon color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>DATE & TIME</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.booking_date} at {booking.start_time}
                </Typography>
              </Box>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', mb: 1 }}>MEETING LINK</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {roomUrl}
              </Typography>
              <Button 
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(roomUrl);
                  toast.success("Link copied!");
                }}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                <ContentCopyIcon fontSize="small" />
              </Button>
            </Box>
            <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
              Save this link! You will need it to join the session.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              href="/mentee/dashboard"
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
            >
              View My Dashboard
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              component={Link}
              href="/"
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              Return Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress />
      </Box>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
