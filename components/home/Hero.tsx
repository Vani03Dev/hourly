"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Grid, Typography, Button, Stack, Chip } from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FadeIn, SlideUp } from "../shared/MotionWrapper";

export function Hero() {
  const { isAuthenticated, isOnboarded, user } = useSelector((state: RootState) => state.auth);

  return (
    <Box component="section" id="hero" sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', display: 'flex', alignItems: 'center', py: { xs: 8, md: 0 }, overflow: 'hidden', position: 'relative' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          
          <Grid size={{ xs: 12, lg: 6 }} sx={{ zIndex: 10 }}>
            <SlideUp delay={0.1}>
              <Typography variant="h1" sx={{ mb: 3, lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }, letterSpacing: '-0.03em', fontWeight: 900 }}>
                Expert Advice, <br/>
                <Typography component="span" sx={{ background: 'linear-gradient(45deg, #0D9488, #1E3A5F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit' }}>
                  On Demand.
                </Typography>
              </Typography>
            </SlideUp>
            <SlideUp delay={0.2}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: { xs: '1.1rem', md: '1.3rem' }, lineHeight: 1.6, maxWidth: 500, fontWeight: 500 }}>
                Book 1-on-1 video sessions with top professionals. Get the exact advice you need, or get paid to share your own expertise.
              </Typography>
            </SlideUp>
            
            <SlideUp delay={0.3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                {isOnboarded ? (
                  <>
                    <Button component={Link} href="/expert/dashboard" variant="contained" color="primary" size="large" sx={{ minWidth: 200, height: 52, fontSize: '1.125rem', fontWeight: 'bold', boxShadow: '0 8px 24px -8px rgba(30, 58, 95, 0.5)', '&:hover': { boxShadow: '0 12px 28px -8px rgba(30, 58, 95, 0.7)', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                      Go to Dashboard
                    </Button>
                    {user && (
                      <Button component={Link} href={`/${user.id}`} variant="outlined" color="primary" size="large" sx={{ minWidth: 200, height: 52, fontSize: '1.125rem', fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                        View Public Profile
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button component={Link} href="/search" variant="contained" color="primary" size="large" sx={{ minWidth: 200, height: 52, fontSize: '1.125rem', fontWeight: 'bold', boxShadow: '0 8px 24px -8px rgba(30, 58, 95, 0.5)', '&:hover': { boxShadow: '0 12px 28px -8px rgba(30, 58, 95, 0.7)', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                      Find an Expert
                    </Button>
                    <Button component={Link} href={isAuthenticated ? "/expert/onboarding" : "/signup"} variant="outlined" color="primary" size="large" sx={{ minWidth: 200, height: 52, fontSize: '1.125rem', fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                      {isAuthenticated ? "Complete Profile" : "Become a Professional"}
                    </Button>
                  </>
                )}
              </Stack>
            </SlideUp>


          </Grid>

          <Grid size={{ xs: 12, lg: 6 }} sx={{ position: 'relative', zIndex: 0 }}>
            <FadeIn delay={0.3}>
              <Box sx={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                width: '120%', height: '120%', bgcolor: 'secondary.main', opacity: 0.1, 
                borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' 
              }} />
            </FadeIn>
            
            <SlideUp delay={0.4}>
              <Box sx={{ 
                position: 'relative', width: '100%', maxWidth: 360, margin: '0 auto',
                borderRadius: '40px', overflow: 'hidden', boxShadow: '0 24px 60px -12px rgba(0,0,0,0.15)', 
                border: '8px solid', borderColor: 'background.paper', 
                bgcolor: 'background.default', ml: { lg: 'auto' }, mr: { lg: 0 }
              }}>
                {/* Mobile Mockup Header */}
                <Box sx={{ height: 120, bgcolor: 'primary.main', backgroundImage: 'linear-gradient(120deg, #1E3A5F 0%, #0D9488 100%)' }} />
                
                {/* Mockup Profile */}
                <Box sx={{ px: 3, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -5 }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'background.paper', border: '4px solid', borderColor: 'background.paper', mb: 2, overflow: 'hidden' }}>
                    <Box sx={{ width: '100%', height: '100%', bgcolor: 'secondary.main', opacity: 0.8 }} />
                  </Box>
                  <Box sx={{ width: '60%', height: 20, bgcolor: 'text.primary', borderRadius: 4, mb: 1.5, opacity: 0.9 }} />
                  <Box sx={{ width: '80%', height: 12, bgcolor: 'text.secondary', borderRadius: 4, mb: 3, opacity: 0.5 }} />
                  
                  {/* Mockup Cards */}
                  <Stack spacing={1.5} sx={{ width: '100%' }}>
                    <Box sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(13,148,136,0.1)' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ width: '70%', height: 14, bgcolor: 'text.primary', borderRadius: 4, mb: 1, opacity: 0.8 }} />
                        <Box sx={{ width: '40%', height: 10, bgcolor: 'text.secondary', borderRadius: 4, opacity: 0.4 }} />
                      </Box>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(30, 58, 95, 0.05)' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ width: '60%', height: 14, bgcolor: 'text.primary', borderRadius: 4, mb: 1, opacity: 0.8 }} />
                        <Box sx={{ width: '30%', height: 10, bgcolor: 'text.secondary', borderRadius: 4, opacity: 0.4 }} />
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </SlideUp>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
