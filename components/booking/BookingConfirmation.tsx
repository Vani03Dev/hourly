"use client";

import React, { useState } from "react";
import { Box, Container, Grid, Typography, Paper, Divider, Button, Avatar, Tabs, Tab, TextField, Stepper, Step, StepLabel } from "@mui/material";
import { Expert } from "@/types";
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VideocamIcon from '@mui/icons-material/Videocam';
import ShieldIcon from '@mui/icons-material/Shield';
import { SlideUp, FadeIn } from "../shared/MotionWrapper";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const steps = ['Select Schedule', 'Add Context', 'Payment'];

export function BookingConfirmation({ expert }: { expert: Expert }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [tab, setTab] = useState(0);
  
  const platformFee = expert.price * 0.05;
  const total = expert.price + platformFee;

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final Submit
      toast.success('Session successfully booked! 🚀');
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg">
        <SlideUp>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }} variant="h3" color="text.primary">
              Book your Session
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete the steps below to secure your time with {expert.name.split(' ')[0]}.
            </Typography>
          </Box>
        </SlideUp>

        <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
          {/* Main Wizard Area */}
          <Grid size={{ xs: 12, md: 7 }}>
            <FadeIn delay={0.2}>
              <Paper elevation={4} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box sx={{ minHeight: 300 }}>
                  {/* STEP 1: Schedule */}
                  {activeStep === 0 && (
                    <Box sx={{ animation: 'fadeIn 0.5s' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Pick a Date & Time</Typography>
                      <Grid container spacing={2} sx={{ mb: 4 }}>
                        {['Today', 'Tomorrow', 'Wednesday'].map((day, idx) => (
                          <Grid size={{ xs: 4 }} key={day}>
                            <Box sx={{ p: 2, border: 1, borderColor: idx === 0 ? 'secondary.main' : 'divider', bgcolor: idx === 0 ? 'rgba(13,148,136,0.05)' : 'background.paper', borderRadius: 2, textAlign: 'center', cursor: 'pointer' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: idx === 0 ? 'secondary.main' : 'text.primary' }}>{day}</Typography>
                              <Typography variant="caption" color="text.secondary">Mar {20 + idx}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Available Slots</Typography>
                      <Grid container spacing={2}>
                        {['10:00 AM', '02:30 PM', '04:00 PM', '06:00 PM'].map((time, idx) => (
                          <Grid size={{ xs: 6, sm: 3 }} key={time}>
                            <Box sx={{ p: 1.5, border: 1, borderColor: idx === 0 ? 'secondary.main' : 'divider', bgcolor: idx === 0 ? 'secondary.main' : 'background.paper', color: idx === 0 ? 'white' : 'text.primary', borderRadius: 2, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'secondary.main' } }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{time}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* STEP 2: Context */}
                  {activeStep === 1 && (
                    <Box sx={{ animation: 'fadeIn 0.5s' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>What would you like to discuss?</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Providing context helps the expert prepare and ensures you get the most out of your 30 minutes.
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        placeholder="E.g., I am looking for advice on scaling our backend architecture..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}

                  {/* STEP 3: Payment */}
                  {activeStep === 2 && (
                    <Box sx={{ animation: 'fadeIn 0.5s' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Select Payment Method</Typography>
                      <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                        <Tab label="UPI" />
                        <Tab label="Cards" />
                        <Tab label="Net Banking" />
                      </Tabs>
                      <Box sx={{ minHeight: 150 }}>
                        {tab === 0 && (
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField fullWidth placeholder="Enter UPI ID (e.g., name@okbank)" size="medium" />
                            <Button variant="outlined" sx={{ borderRadius: 2 }}>Verify</Button>
                          </Box>
                        )}
                        {tab === 1 && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField fullWidth placeholder="Card Number" size="medium" />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <TextField fullWidth placeholder="MM/YY" size="medium" />
                              <TextField fullWidth placeholder="CVV" size="medium" type="password" />
                            </Box>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.disabled', mt: 4 }}>
                        <ShieldIcon fontSize="small" />
                        <Typography sx={{ fontWeight: 'bold' }} variant="caption">100% SECURE PAYMENT VIA RAZORPAY</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                  <Button disabled={activeStep === 0} onClick={handleBack} variant="text" sx={{ fontWeight: 'bold' }}>
                    Back
                  </Button>
                  <Button onClick={handleNext} variant="contained" color="secondary" sx={{ px: 4, borderRadius: 2, fontWeight: 'bold' }}>
                    {activeStep === steps.length - 1 ? `Pay ₹${total}` : 'Next Step'}
                  </Button>
                </Box>
              </Paper>
            </FadeIn>
          </Grid>

          {/* Sidebar Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SlideUp delay={0.4}>
              <Paper elevation={1} sx={{ borderRadius: 4, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold', mb: 2 }}>Booking Summary</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar src={expert.photo} sx={{ width: 56, height: 56 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary">{expert.name}</Typography>
                      {SHOW_RATINGS_AND_REVIEWS && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#F59E0B', fontSize: 16 }} />
                        <Typography sx={{ fontWeight: 'bold' }} variant="caption">{expert.rating}</Typography>
                      </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <CalendarTodayIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} color="text.secondary">DATE & TIME</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>March 20, 2024</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>10:00 AM - 10:30 AM (IST)</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <VideocamIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} color="text.secondary">FORMAT</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Private Video Session</Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: '1rem' }}>Price Breakdown</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">Session Fee (30 mins)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{expert.price}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">Platform Fee</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{platformFee}</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1">Total</Typography>
                    <Typography sx={{ fontWeight: 900 }} variant="h5" color="secondary.main">₹{total}</Typography>
                  </Box>
                </Box>
              </Paper>
            </SlideUp>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
