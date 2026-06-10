"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, Grid, Button, Avatar, Chip, CircularProgress, Divider } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import VideocamIcon from '@mui/icons-material/Videocam';
import EventIcon from '@mui/icons-material/Event';
import Link from "next/link";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createClient } from '../../../utils/supabase/client';

export default function MenteeDashboardPage() {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;
      
      try {
        
        const supabase = createClient();
        
        // Fetch bookings where user is mentee
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('mentee_id', user.id)
          .neq('status', 'canceled')
          .order('booking_date', { ascending: false })
          .order('start_time', { ascending: false });
          
        if (error) throw error;
        
        if (bookingsData && bookingsData.length > 0) {
          // Fetch expert details manually to be safe
          const expertIds = [...new Set(bookingsData.map(b => b.expert_id))];
          
          const { data: expertsData } = await supabase
            .from('expert_profiles')
            .select('id, first_name, last_name, title, avatar_url')
            .in('id', expertIds);
            
          const expertMap = new Map();
          if (expertsData) {
            expertsData.forEach(e => expertMap.set(e.id, e));
          }

          const formattedBookings = bookingsData.map((b: any) => {
            const expert = expertMap.get(b.expert_id);
            
            // Format date nicely
            let formattedDate = b.booking_date;
            let isPast = false;
            try {
              const [y, m, d] = b.booking_date.split('-');
              const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
              formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              // Simple past check (compare date only)
              const today = new Date();
              today.setHours(0,0,0,0);
              if (dateObj < today) {
                isPast = true;
              }
            } catch (e) {}

            return {
              id: b.id,
              expertName: expert ? `${expert.first_name} ${expert.last_name || ''}` : 'Hourly Expert',
              expertTitle: expert?.title || 'Micro-Consultant',
              expertAvatar: expert?.avatar_url || '',
              type: '1-on-1 Consultation',
              duration: '30 min',
              time: `${formattedDate} at ${b.start_time}`,
              roomLink: b.meeting_link ? `/room/${b.id}` : null,
              isPast
            };
          });
          
          setUpcomingSessions(formattedBookings.filter(b => !b.isPast));
          setPastSessions(formattedBookings.filter(b => b.isPast));
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBookings();
  }, [user]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>My Bookings</Typography>
        <Typography variant="body1" color="text.secondary">Manage your upcoming and past expert sessions.</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon color="primary" /> Upcoming Sessions
          </Typography>
          
          <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', mb: 6 }}>
            {upcomingSessions.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  You have no upcoming sessions. Time to learn something new!
                </Typography>
                <Button component={Link} href="/search" variant="contained" sx={{ borderRadius: 8 }}>
                  Find an Expert
                </Button>
              </Box>
            ) : (
              upcomingSessions.map((session, i) => (
                <Box key={session.id}>
                  <Box sx={{ p: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Avatar src={session.expertAvatar} sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                      {session.expertName.charAt(0)}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{session.expertName}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{session.expertTitle}</Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        {session.type} • {session.duration}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right', minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                        {session.time}
                      </Typography>
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
                        <Button variant="contained" color="inherit" disabled sx={{ borderRadius: 2 }}>
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

          {pastSessions.length > 0 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="action" /> Past Sessions
              </Typography>
              <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                {pastSessions.map((session, i) => (
                  <Box key={session.id}>
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, opacity: 0.7 }}>
                      <Avatar src={session.expertAvatar} sx={{ width: 48, height: 48 }}>
                        {session.expertName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{session.expertName}</Typography>
                        <Typography variant="body2" color="text.secondary">{session.time}</Typography>
                      </Box>
                      <Chip label="Completed" size="small" />
                    </Box>
                    {i < pastSessions.length - 1 && <Divider />}
                  </Box>
                ))}
              </Paper>
            </>
          )}
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.default', border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Tips for a great session</Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'text.secondary', typography: 'body2', '& li': { mb: 1 } }}>
              <li>Test your camera and microphone beforehand.</li>
              <li>Write down your questions so you don't forget.</li>
              <li>Join the room 2 minutes early.</li>
              <li>Ask for permission before sharing sensitive code.</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
