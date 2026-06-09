"use client";

import React, { useState } from "react";
import { Container, Paper, Typography, Box, Switch, FormControlLabel, Select, MenuItem, Button, Divider, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

// Mock bookings data for specific dates
const MOCK_BOOKINGS: Record<number, { title: string, time: string, client: string }[]> = {
  12: [
    { title: "Portfolio Review", time: "10:00 AM", client: "Rahul Singh" },
    { title: "Mock Interview", time: "02:00 PM", client: "Ananya Desai" }
  ],
  18: [
    { title: "Career Coaching", time: "11:30 AM", client: "Vikram Mehta" }
  ],
  25: [
    { title: "Design System Audit", time: "09:00 AM", client: "Priya Sharma" },
    { title: "Resume Feedback", time: "04:00 PM", client: "Arjun Reddy" },
    { title: "Q&A Session", time: "05:30 PM", client: "Neha Gupta" }
  ]
};

export default function ExpertAvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<number>(12);
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true, Saturday: false, Sunday: false
  });

  const toggleDay = (day: string) => {
    setActiveDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Availability Settings</Typography>
          <Typography variant="body1" color="text.secondary">Set your weekly schedule and timezone.</Typography>
        </Box>
        <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 2 }}>
          Save Changes
        </Button>
      </Box>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Timezone</Typography>
        <Select value="asia_kolkata" fullWidth size="small" sx={{ mb: 1 }}>
          <MenuItem value="asia_kolkata">India Standard Time (IST) - Asia/Kolkata</MenuItem>
          <MenuItem value="america_ny">Eastern Time (EST) - America/New_York</MenuItem>
          <MenuItem value="europe_london">Greenwich Mean Time (GMT) - Europe/London</MenuItem>
        </Select>
      </Paper>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Weekly Hours</Typography>
        
        {DAYS.map((day, index) => {
          const isActive = activeDays[day];
          
          return (
            <Box key={day}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                  py: 2.5, 
                  px: 2,
                  mx: -2,
                  borderRadius: 3,
                  bgcolor: isActive ? 'rgba(13,148,136,0.03)' : 'transparent',
                  borderLeft: '4px solid',
                  borderColor: isActive ? 'secondary.main' : 'transparent',
                  opacity: isActive ? 1 : 0.6, 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                  '&:hover': { 
                    bgcolor: isActive ? 'rgba(13,148,136,0.06)' : 'action.hover', 
                    transform: 'translateX(4px)' 
                  } 
                }}
              >
                <Box sx={{ width: { xs: '100%', sm: 180 }, display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Switch color="secondary" checked={isActive} onChange={() => toggleDay(day)} />}
                    label={<Typography sx={{ fontWeight: 'bold', color: isActive ? 'text.primary' : 'text.secondary' }}>{day}</Typography>}
                  />
                </Box>
                
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                  {isActive ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, animation: 'slideInRight 0.3s ease-out' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.paper', p: 0.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Select size="small" value="09:00 AM" sx={{ minWidth: 110, '& fieldset': { border: 'none' }, fontWeight: 'medium' }}>
                          {TIMES.map(t => <MenuItem key={`start-${t}`} value={t}>{t}</MenuItem>)}
                        </Select>
                        <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>→</Typography>
                        <Select size="small" value="05:00 PM" sx={{ minWidth: 110, '& fieldset': { border: 'none' }, fontWeight: 'medium' }}>
                          {TIMES.map(t => <MenuItem key={`end-${t}`} value={t}>{t}</MenuItem>)}
                        </Select>
                        <IconButton color="error" size="small" sx={{ ml: 0.5, '&:hover': { bgcolor: 'error.50', transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Button 
                        startIcon={<AddIcon />} 
                        size="small" 
                        color="secondary" 
                        sx={{ fontWeight: 'bold', borderRadius: 2, '&:hover': { bgcolor: 'secondary.50' } }}
                      >
                        Add Hours
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, height: 40 }}>
                      <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                      Unavailable
                    </Typography>
                  )}
                </Box>
              </Box>
              {index < DAYS.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          );
        })}
        <style>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </Paper>

      {/* Interactive Agenda */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Your Agenda</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage your daily schedule and view upcoming sessions for specific dates.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Calendar View */}
          <Box sx={{ flex: 1, maxWidth: 360, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: 'background.default' }}>
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
              {Array.from({ length: 30 }).map((_, i) => {
                const dayOfWeek = Object.keys(activeDays)[i % 7];
                const isAvailable = activeDays[dayOfWeek];
                const dateNum = i + 1;
                const hasBookings = MOCK_BOOKINGS[dateNum];
                const isSelected = selectedDate === dateNum;
                
                // Disable past dates
                const today = new Date().getDate();
                const isPastDate = dateNum < today;
                
                const canSelect = isAvailable && !isPastDate;
                
                return (
                  <Box 
                    key={i} 
                    onClick={() => canSelect && setSelectedDate(dateNum)}
                    sx={{ 
                      position: 'relative',
                      aspectRatio: '1', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '0.875rem',
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
                    {hasBookings && !isPastDate && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 2, 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          bgcolor: isSelected ? 'white' : 'error.main' 
                        }} 
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Daily Bookings Panel */}
          <Box sx={{ flex: 1, minHeight: 300, p: 3, bgcolor: 'action.hover', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {new Date().toLocaleString('default', { month: 'long' })} {selectedDate}, {new Date().getFullYear()}
              </Typography>
              <Typography variant="caption" sx={{ bgcolor: 'secondary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 4, fontWeight: 'bold' }}>
                {MOCK_BOOKINGS[selectedDate] ? `${MOCK_BOOKINGS[selectedDate].length} Sessions` : "Available"}
              </Typography>
            </Box>
            
            {MOCK_BOOKINGS[selectedDate] ? (
              <Box key={`bookings-${selectedDate}`} sx={{ display: 'flex', flexDirection: 'column', gap: 2, animation: 'slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                {MOCK_BOOKINGS[selectedDate].map((session, idx) => (
                  <Paper 
                    key={idx} 
                    elevation={0} 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 3, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 12px 24px -10px rgba(13,148,136,0.25)',
                        '& .action-btn': {
                          opacity: 1,
                          transform: 'translateX(0)',
                        }
                      }
                    }}
                  >
                    <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: 'secondary.main' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'text.primary' }}>{session.title}</Typography>
                        <Typography variant="caption" color="text.secondary">1-on-1 Session</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', bgcolor: 'primary.50', px: 1.5, py: 0.5, borderRadius: 2 }}>
                        {session.time}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2, opacity: 0.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'secondary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }}>
                          {session.client[0]}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{session.client}</Typography>
                          <Typography variant="caption" color="text.secondary">Mentee</Typography>
                        </Box>
                      </Box>
                      
                      <Button 
                        className="action-btn"
                        size="small" 
                        variant="contained" 
                        color="primary" 
                        sx={{ 
                          borderRadius: 2, 
                          opacity: 0, 
                          transform: 'translateX(10px)',
                          transition: 'all 0.3s',
                          boxShadow: 'none'
                        }}
                      >
                        Details
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box key={`empty-${selectedDate}`} sx={{ height: '100%', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', animation: 'fadeIn 0.4s' }}>
                <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'background.paper', mb: 2, border: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="h4">☕</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>No sessions scheduled</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>Your calendar is wide open for bookings.</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <style>{`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </Paper>
    </Container>
  );
}
