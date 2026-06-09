"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { mockExperts } from "@/lib/mock-data";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/shared/MotionWrapper";

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const expert = mockExperts.find(e => e.id === params.id);
  
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  if (!expert || !expert.isOnline) {
    notFound();
  }

  // Timer logic
  useEffect(() => {
    if (isEnded) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isEnded]);

  const endCall = () => {
    setIsEnded(true);
    // In a real app, this would trigger payment processing
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentCost = (secondsElapsed * ((expert.perMinuteRate || 15) / 60)).toFixed(2);

  if (isEnded) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <FadeIn>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 4, bgcolor: '#1e293b', border: '1px solid #334155', textAlign: 'center', maxWidth: 400, width: '100%' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <Typography variant="h4">✓</Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Session Ended</Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>Your card will be charged shortly.</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, borderBottom: '1px solid #334155', pb: 2 }}>
              <Typography sx={{ color: '#94a3b8' }}>Duration</Typography>
              <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{formatTime(secondsElapsed)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography sx={{ color: '#94a3b8' }}>Total Cost</Typography>
              <Typography sx={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.25rem' }}>₹{currentCost}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Redirecting to home...</Typography>
          </Paper>
        </FadeIn>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: '#000', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header - Metered Billing */}
      <Box sx={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', px: 3, py: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, bgcolor: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}>{formatTime(secondsElapsed)}</Typography>
          </Box>
          <Box sx={{ width: 1, height: 20, bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Typography sx={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.1rem' }}>
            ₹{currentCost} <Typography component="span" variant="caption" sx={{ color: '#94a3b8' }}>(@ ₹{expert.perMinuteRate}/min)</Typography>
          </Typography>
        </Box>
      </Box>

      {/* Main Video Area (Simulated) */}
      <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Expert Video Placeholder */}
        <Box sx={{ width: '100%', height: '100%', backgroundImage: `url(${expert.photo.replace('150', '800')})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.7)' }} />
        
        {/* User Mini-Video Placeholder */}
        <Box sx={{ position: 'absolute', bottom: 120, right: 32, width: 240, height: 160, bgcolor: '#1e293b', borderRadius: 4, border: '2px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#64748b' }}>You (Camera off)</Typography>
        </Box>
      </Box>

      {/* Bottom Controls */}
      <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 3, bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', px: 4, py: 2, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
        <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, width: 56, height: 56 }}>
          <MicIcon />
        </IconButton>
        <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, width: 56, height: 56 }}>
          <VideocamIcon />
        </IconButton>
        <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, width: 56, height: 56 }}>
          <ScreenShareIcon />
        </IconButton>
        <IconButton onClick={endCall} sx={{ bgcolor: '#ef4444', color: 'white', '&:hover': { bgcolor: '#dc2626' }, width: 64, height: 64, ml: 2, boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>
          <CallEndIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
}
