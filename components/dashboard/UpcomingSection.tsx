"use client";

import React, { useState, useEffect } from "react";
import VideocamIcon from '@mui/icons-material/Videocam';
import { Box, Container, Typography, Card, CardContent, Button, Stack } from "@mui/material";
import { mockBookings } from "@/lib/mock-data";

export function UpcomingSection() {
  const upcomingBooking = mockBookings.find(b => b.status === "upcoming");
  
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    if (!upcomingBooking) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [upcomingBooking]);

  if (!upcomingBooking) return null;

  return (
    <Box sx={{ py: 6, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>Upcoming Session</Typography>
        
        <Card sx={{ bgcolor: 'primary.main', color: 'common.white', boxShadow: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'center' }, justifyContent: 'space-between', gap: 4, textAlign: { xs: 'center', md: 'left' } }}>
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'grey.300', fontWeight: 'medium', mb: 1 }}>
                {upcomingBooking.date} • {upcomingBooking.time}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                {upcomingBooking.type === "video" ? "Video Call" : "Chat Session"} with {upcomingBooking.expertName}
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'flex-start', color: 'secondary.main', typography: 'h3', fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                  <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', letterSpacing: 1, mt: 0.5 }}>Hours</Typography>
                </Box>
                <Box sx={{ color: 'grey.500', pb: 2 }}>:</Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', letterSpacing: 1, mt: 0.5 }}>Minutes</Typography>
                </Box>
                <Box sx={{ color: 'grey.500', pb: 2 }}>:</Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase', letterSpacing: 1, mt: 0.5 }}>Seconds</Typography>
                </Box>
              </Stack>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { xs: '100%', md: 'auto' } }}>
              <Button variant="contained" color="secondary" size="large" startIcon={<VideocamIcon />} sx={{ height: 56, minWidth: 240, fontSize: '1.125rem', fontWeight: 'bold' }}>
                Join Call
              </Button>
              <Typography variant="body2" sx={{ color: 'grey.400', textAlign: 'center' }}>
                Button activates 5 mins before start
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
