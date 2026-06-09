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

  const metrics = [
    { label: "This Month", value: "₹45,000", icon: <AttachMoneyIcon sx={{ color: '#10B981' }} /> },
    { label: "Total Sessions", value: "142", icon: <PeopleIcon sx={{ color: '#3B82F6' }} /> },
    { label: "Profile Views", value: "1.2k", icon: <VisibilityIcon sx={{ color: '#8B5CF6' }} /> },
    { label: "Avg Rating", value: "4.9", icon: <StarIcon sx={{ color: '#F59E0B' }} /> },
  ];

  const upcomingSessions = [
    { id: 1, name: "Rahul Singh", type: "Portfolio Review", time: "Today, 04:00 PM", duration: "45 min" },
    { id: 2, name: "Ananya Desai", type: "Mock Interview", time: "Tomorrow, 10:30 AM", duration: "60 min" },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Welcome back, {user?.name || "Priya"}</Typography>
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
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Upcoming Sessions</Typography>
              <Button size="small" color="primary">View Calendar</Button>
            </Box>
            
            {upcomingSessions.map((session, i) => (
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
                    <Button variant="contained" color="primary" startIcon={<VideocamIcon />} sx={{ borderRadius: 2 }}>
                      Join Room
                    </Button>
                  </Box>
                </Box>
                {i < upcomingSessions.length - 1 && <Divider />}
              </Box>
            ))}
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
