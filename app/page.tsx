"use client";

import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedExperts } from "@/components/home/FeaturedExperts";
import { Categories } from "@/components/home/Categories";
import { Pricing } from "@/components/home/Pricing";
import { WhyHourly } from "@/components/home/WhyHourly";
import { Testimonials } from "@/components/home/Testimonials";

import { Box, Typography, Container, Button, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { SlideUp } from "@/components/shared/MotionWrapper";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React from "react";

export default function Home() {
  const { isOnboarded } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Hero />
      
      {!isOnboarded ? (
        <>
          <HowItWorks />
          <FeaturedExperts />
          <Categories />
          <Pricing />
          <WhyHourly />
          <Testimonials />
        </>
      ) : (
        <Box sx={{ bgcolor: 'background.default', flexGrow: 1, display: 'flex', alignItems: 'center', py: 8 }}>
          <Container maxWidth="md">
            <SlideUp delay={0.1}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  borderRadius: 4,
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}
              >
                <Box sx={{ position: 'absolute', right: '-10%', top: '-50%', width: '40%', height: '200%', bgcolor: 'rgba(255,255,255,0.05)', transform: 'rotate(15deg)', pointerEvents: 'none' }} />
                
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>
                    YOUR WORKSPACE AWAITS
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, mt: 2, mb: 3 }}>
                    Ready for your next session?
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, mx: 'auto', mb: 5, fontSize: '1.1rem' }}>
                    You're fully onboarded and your public profile is active. Head over to your dashboard to manage your schedule and upcoming bookings.
                  </Typography>

                  <Button 
                    component={Link} 
                    href="/expert/dashboard" 
                    variant="contained" 
                    color="secondary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 8, fontWeight: 'bold', px: 6, py: 1.5, fontSize: '1.1rem' }}
                  >
                    Open Expert Dashboard
                  </Button>
                </Box>
              </Paper>
            </SlideUp>
          </Container>
        </Box>
      )}
    </Box>
  );
}
