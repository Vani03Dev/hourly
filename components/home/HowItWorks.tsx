"use client";

import React, { useState } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';

const steps = [
  {
    id: "find",
    icon: <SearchIcon fontSize="medium" />,
    title: "1. Find Your Expert",
    description: "Browse our directory of vetted professionals. Filter by industry, expertise, price, and availability to find your perfect match.",
    previewContent: (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
        <Box sx={{ width: '80%', height: 36, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', px: 2 }}>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
          <Box sx={{ width: '60%', height: 8, bgcolor: 'action.hover', borderRadius: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(i => (
            <Box key={i} sx={{ width: 'calc(50% - 8px)', height: 100, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
               <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'action.hover' }} />
               <Box sx={{ width: '70%', height: 8, bgcolor: 'text.secondary', borderRadius: 1, mt: 0.5 }} />
               <Box sx={{ width: '40%', height: 6, bgcolor: 'action.hover', borderRadius: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  },
  {
    id: "book",
    icon: <EventAvailableIcon fontSize="medium" />,
    title: "2. Book a Session",
    description: "Select an open time slot on the expert's calendar. Choose between a quick chat or an in-depth video consultation.",
    previewContent: (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <Box sx={{ width: '90%', bgcolor: 'background.paper', borderRadius: 4, border: 1, borderColor: 'divider', p: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
           <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Select a Time</Typography>
           <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
             {['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '4:00 PM'].map((time, i) => (
               <Box key={time} sx={{ py: 1, textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', border: 1, borderColor: i === 2 ? '#10B981' : 'divider', bgcolor: i === 2 ? '#10B981' : 'transparent', color: i === 2 ? 'white' : 'text.primary', borderRadius: 2 }}>
                 {time}
               </Box>
             ))}
           </Box>
           <Box sx={{ mt: 3, height: 40, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
             Confirm Booking
           </Box>
        </Box>
      </Box>
    )
  },
  {
    id: "connect",
    icon: <VideoCameraFrontIcon fontSize="medium" />,
    title: "3. Connect & Learn",
    description: "Join the video call or chat session directly from your Hourly dashboard. Ask questions, get advice, and level up your skills.",
    previewContent: (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
         <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', borderRadius: 4, border: 1, borderColor: 'divider', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
           <Box sx={{ width: '100%', height: '100%', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Typography sx={{ color: 'rgba(255,255,255,0.1)', fontSize: '2rem', fontWeight: 900 }}>LIVE CALL</Typography>
           </Box>
           <Box sx={{ position: 'absolute', bottom: 16, right: 16, width: 80, height: 110, bgcolor: '#1e293b', borderRadius: 2, border: '2px solid white', overflow: 'hidden' }}>
              <Box sx={{ width: '100%', height: '100%', backgroundImage: 'url(https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150)', backgroundSize: 'cover' }} />
           </Box>
           <Box sx={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 1 }}>
             <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
             <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
           </Box>
         </Box>
      </Box>
    )
  }
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 900, letterSpacing: '-0.02em' }}>How Hourly Works</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}>
            Getting expert advice has never been easier. We've streamlined the process of finding and connecting with top-tier professionals.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 8 }, alignItems: 'center' }}>
          
          {/* Left Column: Interactive Steps List */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
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
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: isActive ? 'text.primary' : 'text.secondary', mb: 0.5, transition: 'color 0.3s' }}>
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
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, pt: 1 }}>
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

          {/* Right Column: Interactive Preview Window */}
          <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ 
              width: '100%', height: { xs: 300, md: 450 }, 
              bgcolor: theme.palette.mode === 'light' ? 'grey.50' : '#0F172A', 
              borderRadius: 6, border: '1px solid', borderColor: 'divider', 
              overflow: 'hidden', position: 'relative' 
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ width: '100%', height: '100%' }}
                >
                  {steps[activeStep].previewContent}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
