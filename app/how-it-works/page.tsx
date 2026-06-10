"use client";

import React, { useState } from "react";
import { Box, Container, Typography, Grid, Paper, Button, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SecurityIcon from '@mui/icons-material/Security';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import Link from "next/link";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const steps = [
  {
    id: "find",
    icon: <SearchIcon fontSize="large" />,
    title: "1. Find Your Expert",
    description: "Browse our directory of vetted professionals. Filter by industry, expertise, price, and availability to find your perfect match.",
    previewContent: (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 4, pt: 6 }}>
        <Box sx={{ width: '60%', height: 40, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', px: 2 }}>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
          <Box sx={{ width: '40%', height: 10, bgcolor: 'action.hover', borderRadius: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {[1, 2, 3].map(i => (
            <Box key={i} sx={{ flex: 1, height: 140, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
               <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'action.hover' }} />
               <Box sx={{ width: '80%', height: 12, bgcolor: 'text.secondary', borderRadius: 1, mt: 1 }} />
               <Box sx={{ width: '50%', height: 8, bgcolor: 'action.hover', borderRadius: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  },
  {
    id: "book",
    icon: <EventAvailableIcon fontSize="large" />,
    title: "2. Book a Session",
    description: "Select an open time slot on the expert's calendar. Choose between a quick chat or an in-depth video consultation.",
    previewContent: (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <Box sx={{ width: '80%', bgcolor: 'background.paper', borderRadius: 4, border: 1, borderColor: 'divider', p: 3, boxShadow: 4 }}>
           <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Select a Time</Typography>
           <Grid container spacing={2}>
             {[1, 2, 3, 4, 5, 6].map(i => (
               <Grid size={{ xs: 4 }} key={i}>
                 <Box sx={{ py: 1.5, textAlign: 'center', border: 1, borderColor: i === 2 ? 'secondary.main' : 'divider', bgcolor: i === 2 ? 'secondary.main' : 'transparent', color: i === 2 ? 'white' : 'text.primary', borderRadius: 2 }}>
                   {i + 9}:00 AM
                 </Box>
               </Grid>
             ))}
           </Grid>
           <Box sx={{ mt: 3, height: 36, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
             Confirm Booking
           </Box>
        </Box>
      </Box>
    )
  },
  {
    id: "pay",
    icon: <SecurityIcon fontSize="large" />,
    title: "3. Secure Payment",
    description: "Your payment is held securely in escrow. It will only be released to the expert once the session is successfully completed.",
    previewContent: (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <Box sx={{ width: 280, height: 280, borderRadius: '50%', border: '4px dashed', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Box sx={{ width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SecurityIcon sx={{ fontSize: 64, color: '#10B981' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: -20, right: 40, bgcolor: 'background.paper', border: 1, borderColor: 'divider', px: 2, py: 1, borderRadius: 2, boxShadow: 2, fontWeight: 'bold' }}>Escrow Protected</Box>
        </Box>
      </Box>
    )
  },
  {
    id: "connect",
    icon: <VideoCameraFrontIcon fontSize="large" />,
    title: "4. Connect & Learn",
    description: "Join the video call or chat session directly from your Hourly dashboard. Ask questions, get advice, and level up your skills.",
    previewContent: (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
         <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', borderRadius: 4, border: 1, borderColor: 'divider', overflow: 'hidden', position: 'relative' }}>
           <Box sx={{ width: '100%', height: '100%', bgcolor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '4rem', fontWeight: 900 }}>VIDEO CALL</Typography>
           </Box>
           <Box sx={{ position: 'absolute', bottom: 20, right: 20, width: 120, height: 160, bgcolor: '#334155', borderRadius: 2, border: '2px solid white' }} />
           <Box sx={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 1 }}>
             <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
             <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
           </Box>
         </Box>
      </Box>
    )
  }
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary', mb: 3, letterSpacing: '-0.02em' }}>
              How Hourly Works
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto', fontWeight: 'normal', lineHeight: 1.6 }}>
              Getting expert advice has never been easier. We've streamlined the process of finding and booking top-tier professionals.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 8 }, mb: 12 }}>
          {/* Interactive Steps List */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <Box
                  key={step.id}
                  onMouseEnter={() => setActiveStep(index)}
                  onClick={() => setActiveStep(index)}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isActive ? 'secondary.main' : 'transparent',
                    bgcolor: isActive ? (theme.palette.mode === 'light' ? 'rgba(13,148,136,0.05)' : 'rgba(13,148,136,0.1)') : 'transparent',
                    transition: 'all 0.3s',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: isActive ? '' : 'action.hover'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ 
                      color: isActive ? 'white' : 'text.secondary', 
                      bgcolor: isActive ? 'secondary.main' : 'action.selected',
                      width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s' 
                    }}>
                      {step.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: isActive ? 'text.primary' : 'text.secondary', mb: 0.5, transition: 'color 0.3s' }}>
                        {step.title}
                      </Typography>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, pt: 1 }}>
                              {step.description}
                            </Typography>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Interactive Preview Window */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', height: { xs: 400, md: 500 }, bgcolor: theme.palette.mode === 'light' ? 'grey.50' : '#0F172A', borderRadius: 6, border: '1px solid', borderColor: 'divider', overflow: 'hidden', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {steps[activeStep].previewContent}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ mt: 8, textAlign: 'center', bgcolor: theme.palette.mode === 'light' ? 'primary.main' : 'background.paper', border: theme.palette.mode === 'dark' ? '1px solid' : 'none', borderColor: 'divider', borderRadius: 6, p: { xs: 6, md: 8 }, color: 'white' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>
              Ready to get started?
            </Typography>
            <Typography variant="h6" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'text.secondary', mb: 5, maxWidth: 600, mx: 'auto', fontWeight: 'normal' }}>
              Join thousands of professionals exchanging knowledge on Hourly today.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                component={Link} 
                href="/search" 
                variant="contained" 
                color="secondary" 
                size="large"
                sx={{ 
                  borderRadius: 8, 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1rem',
                  fontWeight: 'bold', 
                  boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)', 
                  transition: 'all 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px rgba(13, 148, 136, 0.6)' 
                  }
                }}
              >
                Find an Expert <ArrowForwardIcon sx={{ ml: 1, fontSize: '1.2rem' }} />
              </Button>
              <Button 
                component={Link} 
                href="/signup" 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderRadius: 8, 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1rem',
                  fontWeight: 'bold', 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.4)', 
                  borderWidth: 2, 
                  transition: 'all 0.3s',
                  '&:hover': { 
                    borderWidth: 2, 
                    borderColor: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Become an Expert
              </Button>
            </Box>
          </motion.div>
        </Box>

      </Container>
    </Box>
  );
}
