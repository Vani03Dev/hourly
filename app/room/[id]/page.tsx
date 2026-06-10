"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, CircularProgress, Typography, Container, Paper, Button } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { JitsiMeeting } from '@jitsi/react-sdk';

export default function VideoRoomPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { user } = useAuth();
  
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMeetingDetails() {
      if (!user || !bookingId) return;
      
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        
        // Fetch the booking ensuring the current user is either the mentee or expert
        const { data: booking, error: fetchError } = await supabase
          .from('bookings')
          .select('meeting_link, expert_id, mentee_id')
          .eq('id', bookingId)
          .single();
          
        if (fetchError) throw fetchError;
        
        if (!booking) {
          throw new Error("Booking not found");
        }
        
        // Authorization check
        if (booking.expert_id !== user.id && booking.mentee_id !== user.id) {
          throw new Error("You are not authorized to join this room.");
        }
        
        if (!booking.meeting_link) {
          throw new Error("No video room link was generated for this session.");
        }
        
        setMeetingUrl(booking.meeting_link);
        const extractedRoom = booking.meeting_link.split('/').pop() || `Hourly-${bookingId}`;
        setRoomName(extractedRoom);
        
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load video room.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMeetingDetails();
  }, [bookingId, user]);

  const handleClose = () => {
    // When the user hangs up, try to close the tab, otherwise redirect them home
    try {
      window.close();
      // If the tab wasn't closed by a script, fallback to redirect
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (e) {
      router.push('/');
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h5">Please log in to join the video room.</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress size={60} sx={{ mb: 4 }} />
        <Typography variant="h5" color="text.secondary">Connecting to secure video room...</Typography>
      </Box>
    );
  }

  if (error || !meetingUrl) {
    return (
      <Container maxWidth="md" sx={{ py: 12 }}>
        <Paper elevation={1} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" sx={{ mb: 3, fontWeight: 'bold' }}>Access Denied</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.2rem' }}>
            {error || "Unknown error occurred."}
          </Typography>
          <Button 
            component={Link} 
            href="/"
            variant="contained" 
            size="large"
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: 8 }}
          >
            Return Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: '#000', overflow: 'hidden' }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: user?.user_metadata?.first_name 
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` 
            : user?.email || 'Hourly User',
          email: user?.email || 'anonymous@hourly.app'
        }}
        onApiReady={(externalApi) => {
          // Listen for the hangup event to safely close/redirect without hitting the Jitsi ad
          externalApi.addListener('readyToClose', handleClose);
          // Also listen to videoConferenceLeft as a fallback for when they click Hang Up
          externalApi.addListener('videoConferenceLeft', handleClose);
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </Box>
  );
}
