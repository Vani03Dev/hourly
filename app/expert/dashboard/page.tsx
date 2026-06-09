"use client";

import React from "react";
import { Container, Grid, Paper, Typography, Box, Button, Avatar, Chip, Divider } from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useAuth } from "@/contexts/AuthContext";

export default function ExpertDashboardPage() {
  const { user } = useAuth();

  React.useEffect(() => {
    async function checkOnboarding() {
      if (!user) return;
      const { createClient } = await import('@/utils/supabase/client');
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

  const metrics = [
    { label: "This Month", value: "₹0", icon: <AttachMoneyIcon sx={{ color: '#10B981' }} /> },
    { label: "Total Sessions", value: "0", icon: <PeopleIcon sx={{ color: '#3B82F6' }} /> },
    { label: "Profile Views", value: "0", icon: <VisibilityIcon sx={{ color: '#8B5CF6' }} /> },
    { label: "Avg Rating", value: "0.0", icon: <StarIcon sx={{ color: '#F59E0B' }} /> },
  ];

  const [upcomingSessions, setUpcomingSessions] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchBookings() {
      if (!user) return;
      const { createClient } = await import('@/utils/supabase/client');
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
    }
    
    fetchBookings();
  }, [user]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Welcome back, {user?.user_metadata?.first_name || user?.email || "Expert"}</Typography>
        <Typography variant="body1" color="text.secondary">Here's a summary of your micro-consulting business.</Typography>
      </Box>

      {/* Metrics Grid */}
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

      {/* Main Content Area */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3, minHeight: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Upcoming Sessions</Typography>
              <Button size="small" color="primary">View Calendar</Button>
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
                      <Box sx={{ textAlign: 'right' }}>
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
                          Join Room
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
              Experts who update their availability weekly get 40% more booking requests. Ensure your calendar is up to date!
            </Typography>
            <Button variant="contained" color="secondary" fullWidth sx={{ fontWeight: 'bold', color: 'white' }}>
              Update Availability
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
