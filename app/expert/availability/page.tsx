"use client";

import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Switch, FormControlLabel, Select, MenuItem, Button, Divider, IconButton, CircularProgress, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from '@/utils/supabase/client';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Generate times in 30-minute intervals
const TIMES = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  const ampm = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const paddedHour = displayHour.toString().padStart(2, "0");
  return `${paddedHour}:${min} ${ampm}`;
});

// Mock bookings for the agenda view so the UI still looks good
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
    { title: "Resume Feedback", time: "04:00 PM", client: "Arjun Reddy" }
  ]
};

type TimeBlock = { start: string, end: string };
type Schedule = Record<string, TimeBlock[]>;
type DateOverrides = Record<string, TimeBlock[]>; // YYYY-MM-DD -> TimeBlocks

export default function ExpertAvailabilityPage() {
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [timezone, setTimezone] = useState("asia_kolkata");
  
  const [schedule, setSchedule] = useState<Schedule>({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });
  
  const [dateOverrides, setDateOverrides] = useState<DateOverrides>({});
  const [newOverrideDate, setNewOverrideDate] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch schedule on mount
  useEffect(() => {
    async function fetchSchedule() {
      if (!user) return;
      try {
        
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('expert_profiles')
          .select('timezone, weekly_schedule, date_overrides')
          .eq('id', user.id)
          .single();
          
        if (data) {
          if (data.timezone) setTimezone(data.timezone);
          
          if (data.weekly_schedule && Object.keys(data.weekly_schedule).length > 0) {
            setSchedule({
              Monday: data.weekly_schedule.Monday || [],
              Tuesday: data.weekly_schedule.Tuesday || [],
              Wednesday: data.weekly_schedule.Wednesday || [],
              Thursday: data.weekly_schedule.Thursday || [],
              Friday: data.weekly_schedule.Friday || [],
              Saturday: data.weekly_schedule.Saturday || [],
              Sunday: data.weekly_schedule.Sunday || []
            });
          } else {
            // Default schedule if brand new
            setSchedule({
              Monday: [{ start: "09:00 AM", end: "05:00 PM" }], 
              Tuesday: [{ start: "09:00 AM", end: "05:00 PM" }], 
              Wednesday: [{ start: "09:00 AM", end: "05:00 PM" }], 
              Thursday: [{ start: "09:00 AM", end: "05:00 PM" }], 
              Friday: [{ start: "09:00 AM", end: "05:00 PM" }], 
              Saturday: [], 
              Sunday: []
            });
          }
          
          if (data.date_overrides) {
            setDateOverrides(data.date_overrides);
          }
        }
      } catch (error) {
        console.error("Failed to load schedule", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSchedule();
  }, [user]);

  const toggleDay = (day: string) => {
    setSchedule(prev => {
      const isCurrentlyActive = prev[day].length > 0;
      return {
        ...prev,
        [day]: isCurrentlyActive ? [] : [{ start: "09:00 AM", end: "05:00 PM" }]
      };
    });
  };

  const addTimeBlock = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: [...prev[day], { start: "09:00 AM", end: "05:00 PM" }]
    }));
  };

  const removeTimeBlock = (day: string, index: number) => {
    setSchedule(prev => {
      const newBlocks = [...prev[day]];
      newBlocks.splice(index, 1);
      return { ...prev, [day]: newBlocks };
    });
  };

  const updateTimeBlock = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => {
      const newBlocks = [...prev[day]];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      return { ...prev, [day]: newBlocks };
    });
  };
  
  // Date Override Logic
  const handleAddOverride = () => {
    if (!newOverrideDate) return;
    setDateOverrides(prev => ({
      ...prev,
      [newOverrideDate]: [] // Default to entirely blocked out
    }));
    setNewOverrideDate("");
  };
  
  const removeOverride = (date: string) => {
    setDateOverrides(prev => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
  };
  
  const toggleOverrideAvailability = (date: string) => {
    setDateOverrides(prev => {
      const blocks = prev[date];
      return {
        ...prev,
        [date]: blocks.length === 0 ? [{ start: "09:00 AM", end: "05:00 PM" }] : []
      };
    });
  };
  
  const addOverrideTimeBlock = (date: string) => {
    setDateOverrides(prev => ({
      ...prev,
      [date]: [...prev[date], { start: "09:00 AM", end: "05:00 PM" }]
    }));
  };
  
  const removeOverrideTimeBlock = (date: string, index: number) => {
    setDateOverrides(prev => {
      const newBlocks = [...prev[date]];
      newBlocks.splice(index, 1);
      return { ...prev, [date]: newBlocks };
    });
  };

  const updateOverrideTimeBlock = (date: string, index: number, field: 'start' | 'end', value: string) => {
    setDateOverrides(prev => {
      const newBlocks = [...prev[date]];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      return { ...prev, [date]: newBlocks };
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      
      const supabase = createClient();
      
      const { error } = await supabase
        .from('expert_profiles')
        .update({
          timezone,
          weekly_schedule: schedule,
          date_overrides: dateOverrides
        })
        .eq('id', user.id);
        
      const { Toast } = await import('@/utils/toast');
      if (error) {
        Toast.error("Failed to save schedule");
      } else {
        Toast.success("Schedule updated successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  }

  // Helper to format override dates nicely
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Availability Settings</Typography>
          <Typography variant="body1" color="text.secondary">Manage your working hours and specific date overrides.</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          sx={{ borderRadius: 2 }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* LEFT COLUMN: Settings */}
        <Grid size={{ xs: 12, md: 8, lg: 8 }} sx={{ minWidth: { md: '60%' } }}>
          
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Timezone</Typography>
            <Select 
              value={timezone} 
              onChange={(e) => setTimezone(e.target.value)}
              fullWidth 
              size="small" 
            >
              <MenuItem value="asia_kolkata">India Standard Time (IST) - Asia/Kolkata</MenuItem>
              <MenuItem value="america_ny">Eastern Time (EST) - America/New_York</MenuItem>
              <MenuItem value="europe_london">Greenwich Mean Time (GMT) - Europe/London</MenuItem>
              <MenuItem value="america_la">Pacific Time (PT) - America/Los_Angeles</MenuItem>
            </Select>
          </Paper>

          {/* WEEKLY HOURS */}
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Weekly Hours</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Set your standard recurring availability for each day of the week.
            </Typography>
            
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
              {DAYS.map((day, index) => {
                const blocks = schedule[day] || [];
                const isActive = blocks.length > 0;
                
                return (
                  <Box key={day}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 0 },
                        py: 2.5, 
                        px: 3,
                        bgcolor: isActive ? 'background.paper' : 'action.hover',
                        borderLeft: '4px solid',
                        borderColor: isActive ? 'secondary.main' : 'transparent',
                        transition: 'all 0.2s', 
                        '&:hover': { bgcolor: isActive ? 'rgba(13,148,136,0.02)' : 'action.selected' } 
                      }}
                    >
                      <Box sx={{ width: { xs: '100%', sm: 160 }, display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={<Switch color="secondary" checked={isActive} onChange={() => toggleDay(day)} />}
                          label={<Typography sx={{ fontWeight: 'bold', color: isActive ? 'text.primary' : 'text.secondary' }}>{day}</Typography>}
                        />
                      </Box>
                      
                      <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {isActive ? (
                          <>
                            {blocks.map((block, blockIndex) => (
                              <Box key={`${day}-${blockIndex}`} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, animation: 'slideInRight 0.3s ease-out' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.default', p: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                  <Select 
                                    size="small" 
                                    value={block.start} 
                                    onChange={(e) => updateTimeBlock(day, blockIndex, 'start', e.target.value)}
                                    sx={{ minWidth: 100, '& fieldset': { border: 'none' }, fontWeight: 'medium' }}
                                  >
                                    {TIMES.map(t => <MenuItem key={`start-${t}`} value={t}>{t}</MenuItem>)}
                                  </Select>
                                  <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>-</Typography>
                                  <Select 
                                    size="small" 
                                    value={block.end} 
                                    onChange={(e) => updateTimeBlock(day, blockIndex, 'end', e.target.value)}
                                    sx={{ minWidth: 100, '& fieldset': { border: 'none' }, fontWeight: 'medium' }}
                                  >
                                    {TIMES.map(t => <MenuItem key={`end-${t}`} value={t}>{t}</MenuItem>)}
                                  </Select>
                                  <IconButton 
                                    color="default" 
                                    size="small" 
                                    onClick={() => removeTimeBlock(day, blockIndex)}
                                    sx={{ ml: 0.5, opacity: 0.6, '&:hover': { opacity: 1, color: 'error.main', bgcolor: 'error.50' } }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                                
                                {blockIndex === blocks.length - 1 && (
                                  <IconButton 
                                    size="small" 
                                    color="secondary" 
                                    onClick={() => addTimeBlock(day)}
                                    sx={{ bgcolor: 'secondary.50', '&:hover': { bgcolor: 'secondary.100' } }}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                          </>
                        ) : (
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, height: 40 }}>
                            Unavailable
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {index < DAYS.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Box>
            <style>{`
              @keyframes slideInRight {
                from { opacity: 0; transform: translateX(-10px); }
                to { opacity: 1; transform: translateX(0); }
              }
            `}</style>
          </Paper>

          {/* SPECIFIC DATE OVERRIDES */}
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Specific Date Overrides</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add specific dates when you are unavailable, or have different hours than your normal weekly schedule.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <input 
                type="date" 
                value={newOverrideDate} 
                onChange={(e) => setNewOverrideDate(e.target.value)}
                style={{ 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  border: '1px solid #e0e0e0', 
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  outline: 'none',
                }} 
              />
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<AddIcon />} 
                onClick={handleAddOverride}
                disabled={!newOverrideDate || dateOverrides[newOverrideDate] !== undefined}
                sx={{ borderRadius: 2 }}
              >
                Add Date Override
              </Button>
            </Box>

            {Object.keys(dateOverrides).length > 0 && (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                {Object.entries(dateOverrides).sort((a, b) => a[0].localeCompare(b[0])).map(([dateStr, blocks], index) => {
                  const isActive = blocks.length > 0;
                  return (
                    <Box key={dateStr}>
                      {index > 0 && <Divider />}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: { xs: 'flex-start', sm: 'center' }, 
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 2, sm: 0 },
                          py: 2.5, 
                          px: 3,
                          bgcolor: isActive ? 'background.paper' : 'rgba(239,68,68,0.02)',
                          borderLeft: '4px solid',
                          borderColor: isActive ? 'secondary.main' : 'error.main',
                          transition: 'all 0.3s', 
                          '&:hover': { bgcolor: isActive ? 'rgba(13,148,136,0.02)' : 'rgba(239,68,68,0.04)' } 
                        }}
                      >
                        <Box sx={{ width: { xs: '100%', sm: 180 }, display: 'flex', alignItems: 'center' }}>
                          <FormControlLabel
                            control={<Switch color="secondary" checked={isActive} onChange={() => toggleOverrideAvailability(dateStr)} />}
                            label={
                              <Box>
                                <Typography sx={{ fontWeight: 'bold', color: 'text.primary' }}>{formatDate(dateStr)}</Typography>
                                <Typography variant="caption" sx={{ color: isActive ? 'secondary.main' : 'error.main', fontWeight: 'bold' }}>
                                  {isActive ? "Custom Hours" : "Unavailable"}
                                </Typography>
                              </Box>
                            }
                          />
                        </Box>
                        
                        <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {isActive ? (
                            <>
                              {blocks.map((block, blockIndex) => (
                                <Box key={`${dateStr}-${blockIndex}`} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, animation: 'slideInRight 0.3s ease-out' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.default', p: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Select 
                                      size="small" 
                                      value={block.start} 
                                      onChange={(e) => updateOverrideTimeBlock(dateStr, blockIndex, 'start', e.target.value)}
                                      sx={{ minWidth: 100, '& fieldset': { border: 'none' }, fontWeight: 'medium' }}
                                    >
                                      {TIMES.map(t => <MenuItem key={`start-${t}`} value={t}>{t}</MenuItem>)}
                                    </Select>
                                    <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>-</Typography>
                                    <Select 
                                      size="small" 
                                      value={block.end} 
                                      onChange={(e) => updateOverrideTimeBlock(dateStr, blockIndex, 'end', e.target.value)}
                                      sx={{ minWidth: 100, '& fieldset': { border: 'none' }, fontWeight: 'medium' }}
                                    >
                                      {TIMES.map(t => <MenuItem key={`end-${t}`} value={t}>{t}</MenuItem>)}
                                    </Select>
                                    <IconButton 
                                      color="default" 
                                      size="small" 
                                      onClick={() => removeOverrideTimeBlock(dateStr, blockIndex)}
                                      sx={{ ml: 0.5, opacity: 0.6, '&:hover': { opacity: 1, color: 'error.main', bgcolor: 'error.50' } }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  
                                  {blockIndex === blocks.length - 1 && (
                                    <IconButton 
                                      size="small" 
                                      color="secondary" 
                                      onClick={() => addOverrideTimeBlock(dateStr)}
                                      sx={{ bgcolor: 'secondary.50', '&:hover': { bgcolor: 'secondary.100' } }}
                                    >
                                      <AddIcon />
                                    </IconButton>
                                  )}
                                </Box>
                              ))}
                            </>
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'error.main', display: 'flex', alignItems: 'center', gap: 1, height: 40 }}>
                              <EventBusyIcon fontSize="small" />
                              Blocked off entirely
                            </Typography>
                          )}
                        </Box>

                        <IconButton 
                          color="default" 
                          onClick={() => removeOverride(dateStr)} 
                          sx={{ ml: 'auto', alignSelf: 'flex-start', color: 'text.secondary' }}
                          title="Remove Override"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
            
            {Object.keys(dateOverrides).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', p: 2, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                No date overrides configured.
              </Typography>
            )}
          </Paper>

        </Grid>

        {/* RIGHT COLUMN: Sticky Calendar Agenda */}
        <Grid size={{ xs: 12, md: 4, lg: 4 }} sx={{ minWidth: { md: 380 } }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Live Preview</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                See how your availability looks to clients in real-time.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Calendar View */}
                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: 'background.default' }}>
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
                    
                    {/* Calculate actual month dates */}
                    {(() => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = now.getMonth();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      
                      let firstDayIndex = new Date(year, month, 1).getDay() - 1;
                      if (firstDayIndex === -1) firstDayIndex = 6; 
                      
                      const gridItems = [];
                      const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                      
                      for (let i = 0; i < firstDayIndex; i++) {
                        gridItems.push(<Box key={`empty-${i}`} />);
                      }
                      
                      for (let dateNum = 1; dateNum <= daysInMonth; dateNum++) {
                        const currentDate = new Date(year, month, dateNum);
                        const dayName = fullDayNames[currentDate.getDay()];
                        
                        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                        
                        let isAvailable = false;
                        if (dateOverrides[dateString] !== undefined) {
                          isAvailable = dateOverrides[dateString].length > 0;
                        } else {
                          isAvailable = (schedule[dayName] || []).length > 0;
                        }
                        
                        const hasBookings = MOCK_BOOKINGS[dateNum];
                        const isSelected = selectedDate === dateNum;
                        
                        const today = now.getDate();
                        const isPastDate = dateNum < today;
                        
                        const canSelect = isAvailable && !isPastDate;
                        
                        gridItems.push(
                          <Box 
                            key={`date-${dateNum}`} 
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
                      }
                      
                      return gridItems;
                    })()}
                  </Box>
                </Box>

                {/* Daily Bookings Panel */}
                <Box sx={{ minHeight: 250, p: 3, bgcolor: 'action.hover', borderRadius: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {new Date().toLocaleString('default', { month: 'short' })} {selectedDate} Sessions
                    </Typography>
                    {MOCK_BOOKINGS[selectedDate] && (
                      <Typography variant="caption" sx={{ bgcolor: 'secondary.main', color: 'white', px: 1, py: 0.5, borderRadius: 2, fontWeight: 'bold' }}>
                        {MOCK_BOOKINGS[selectedDate].length}
                      </Typography>
                    )}
                  </Box>
                  
                  {MOCK_BOOKINGS[selectedDate] ? (
                    <Box key={`bookings-${selectedDate}`} sx={{ display: 'flex', flexDirection: 'column', gap: 2, animation: 'slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                      {MOCK_BOOKINGS[selectedDate].map((session, idx) => (
                        <Paper 
                          key={idx} 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 3, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(13,148,136,0.15)' }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{session.title}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', bgcolor: 'primary.50', px: 1, py: 0.5, borderRadius: 1.5 }}>
                              {session.time}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">Mentee: {session.client}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Box key={`empty-${selectedDate}`} sx={{ height: '100%', minHeight: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', animation: 'fadeIn 0.4s' }}>
                      <Typography variant="h5" sx={{ mb: 1 }}>☕</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>No sessions</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
