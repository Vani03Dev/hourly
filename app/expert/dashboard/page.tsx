"use client";

import React, { useState } from "react";
import { Container, Grid, Paper, Typography, Box, Button, Avatar, Divider, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { createClient } from '../../../utils/supabase/client';

export default function ExpertDashboardPage() {
  const { user } = useAuth();

  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    async function checkOnboarding() {
      if (!user) return;
      
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('expert_profiles')
        .select('is_onboarded')
        .eq('id', user.id)
        .single();
        
      if (error || !data || !data.is_onboarded) {
        window.location.href = '/expert/onboarding';
      }
    }
    
    checkOnboarding();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('expert_id', user.id)
      .neq('status', 'canceled')
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });
      
    if (!error && data) {
      const formattedBookings = data.map((b: any) => {
        let formattedDate = b.booking_date;
        try {
          const [y, m, d] = b.booking_date.split('-');
          const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
          formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {}

        return {
          id: b.id,
          name: `Mentee (${b.mentee_id.substring(0, 6)})`,
          type: '1-on-1 Consultation',
          duration: '30 min',
          time: `${formattedDate} at ${b.start_time}`,
          roomLink: b.meeting_link ? `/room/${b.id}` : null
        };
      });
      setUpcomingSessions(formattedBookings);
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, [user]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedSessionId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime || !selectedSessionId) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/expert/sessions/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: selectedSessionId,
          new_date: newDate,
          new_start_time: newTime
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success('Session rescheduled successfully!');
      setRescheduleOpen(false);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reschedule');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedSessionId) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/expert/sessions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: selectedSessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success('Session canceled and refund initiated.');
      setCancelOpen(false);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel session');
    } finally {
      setIsProcessing(false);
    }
  };

  const metrics = [
    { label: "This Month", value: "₹0", icon: <AttachMoneyIcon sx={{ color: '#10B981' }} /> },
    { label: "Total Sessions", value: "0", icon: <PeopleIcon sx={{ color: '#3B82F6' }} /> },
    { label: "Profile Views", value: "0", icon: <VisibilityIcon sx={{ color: '#8B5CF6' }} /> },
    { label: "Avg Rating", value: "0.0", icon: <StarIcon sx={{ color: '#F59E0B' }} /> },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Welcome back, {user?.user_metadata?.first_name || user?.email || "Expert"}</Typography>
        <Typography variant="body1" color="text.secondary">Here's a summary of your micro-consulting business.</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        {metrics.map((metric, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                {metric.icon}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{metric.value}</Typography>
                <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3, minHeight: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Upcoming Sessions</Typography>
            </Box>
            
            {upcomingSessions.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, textAlign: 'center' }}>
                <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'action.hover', mb: 2 }}>
                  <VideocamIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>No upcoming sessions</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: 3 }}>
                  You don't have any sessions scheduled right now. Share your profile link to get booked!
                </Typography>
                <Button variant="outlined" color="primary" sx={{ borderRadius: 2, fontWeight: 'bold' }}>
                  Share Profile
                </Button>
              </Box>
            ) : (
              upcomingSessions.map((session, i) => (
                <Box key={session.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>{session.name[0]}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>{session.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {session.type} • {session.duration}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{session.time}</Typography>
                      </Box>
                      {session.roomLink ? (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          startIcon={<VideocamIcon />} 
                          sx={{ borderRadius: 2 }}
                          component="a"
                          href={session.roomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="inherit" 
                          startIcon={<VideocamIcon />} 
                          sx={{ borderRadius: 2 }}
                          disabled
                        >
                          No Link
                        </Button>
                      )}
                      
                      <IconButton onClick={(e) => handleMenuClick(e, session.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  {i < upcomingSessions.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Expert Tip</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
              Need to shift a meeting? Click the 3 dots next to a session to reschedule it without recharging your mentee, or refund them instantly.
            </Typography>
            <Button variant="contained" color="secondary" fullWidth sx={{ fontWeight: 'bold', color: 'white' }} href="/expert/settings">
              Update Availability
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleMenuClose(); setRescheduleOpen(true); }}>
          Reschedule Session
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); setCancelOpen(true); }} sx={{ color: 'error.main' }}>
          Cancel & Refund
        </MenuItem>
      </Menu>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onClose={() => !isProcessing && setRescheduleOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reschedule Session</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Shift this session to a new date and time. The mentee will retain their booking and will not be charged again.
          </DialogContentText>
          <TextField
            fullWidth
            label="New Date"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="New Time"
            placeholder="e.g. 02:00 PM"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setRescheduleOpen(false)} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleReschedule} variant="contained" disabled={isProcessing || !newDate || !newTime}>
            {isProcessing ? 'Processing...' : 'Reschedule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onClose={() => !isProcessing && setCancelOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Cancel & Refund</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this session? This action cannot be undone.
            The mentee will receive an automated full refund to their original payment method via Razorpay.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setCancelOpen(false)} disabled={isProcessing}>Keep Session</Button>
          <Button onClick={handleCancel} color="error" variant="contained" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Confirm Refund'}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}
