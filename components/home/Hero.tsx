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
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', display: 'flex', alignItems: 'center', py: { xs: 8, md: 0 }, overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          
          <Grid size={{ xs: 12, lg: 6 }} sx={{ zIndex: 10 }}>
            <SlideUp delay={0.1}>
              <Typography variant="h1" sx={{ mb: 3, lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' } }}>
                Rent Expertise by the Hour
              </Typography>
            </SlideUp>
            <SlideUp delay={0.2}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: { xs: '1.125rem', md: '1.375rem' }, lineHeight: 1.6, maxWidth: 600 }}>
                Peer-to-peer micro-consulting from credentialed professionals. Book sessions in seconds.
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
                      <Button component={Link} href={`/book/${user.id}`} variant="outlined" color="primary" size="large" sx={{ minWidth: 200, height: 52, fontSize: '1.125rem', fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2, transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
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

            <FadeIn delay={0.4}>
              <Stack direction="row" spacing={2} useFlexGap sx={{ mt: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 'bold' }} variant="overline" color="primary">TRUSTED BY</Typography>
                <Chip label="FINRA" size="small" sx={{ fontWeight: 'bold', color: 'text.secondary' }} />
                <Chip label="SEBI" size="small" sx={{ fontWeight: 'bold', color: 'text.secondary' }} />
                <Chip label="AICPA" size="small" sx={{ fontWeight: 'bold', color: 'text.secondary' }} />
              </Stack>
            </FadeIn>
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
                position: 'relative', width: '100%', maxWidth: 600, aspectRatio: '16/10', 
                borderRadius: 3, overflow: 'hidden', boxShadow: 6, border: '1px solid', borderColor: 'divider', 
                bgcolor: 'background.paper', ml: { lg: 4 }
              }}>
                <Box sx={{ position: 'absolute', top: 0, width: '100%', height: 24, bgcolor: 'action.hover', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', px: 1.5, gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#facc15' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4ade80' }} />
                </Box>
                <Box sx={{ position: 'absolute', inset: 0, top: 24, display: 'flex', bgcolor: 'background.default' }}>
                  <Box sx={{ width: '25%', bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ width: '80%', height: 16, bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
                    <Box sx={{ width: '60%', height: 12, bgcolor: 'primary.light', borderRadius: 1, opacity: 0.5 }} />
                    <Box sx={{ width: '70%', height: 12, bgcolor: 'grey.200', borderRadius: 1 }} />
                    <Box sx={{ width: '65%', height: 12, bgcolor: 'grey.200', borderRadius: 1 }} />
                    <Box sx={{ width: '50%', height: 12, bgcolor: 'grey.200', borderRadius: 1 }} />
                  </Box>
                  <Box sx={{ width: '75%', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ width: '40%', height: 20, bgcolor: 'grey.300', borderRadius: 1 }} />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'grey.300' }} />
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.8 }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ flex: 1, height: 80, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '40%', height: 10, bgcolor: 'grey.200', borderRadius: 1 }} />
                        <Box sx={{ width: '80%', height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                      </Box>
                      <Box sx={{ flex: 1, height: 80, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ width: '40%', height: 10, bgcolor: 'grey.200', borderRadius: 1 }} />
                        <Box sx={{ width: '60%', height: 24, bgcolor: 'secondary.main', borderRadius: 1 }} />
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', p: 2, display: 'flex', alignItems: 'flex-end', gap: 1.5, minHeight: 120 }}>
                       <Box sx={{ flex: 1, height: '40%', bgcolor: 'primary.light', borderRadius: '4px 4px 0 0', opacity: 0.6 }} />
                       <Box sx={{ flex: 1, height: '70%', bgcolor: 'primary.main', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                       <Box sx={{ flex: 1, height: '50%', bgcolor: 'primary.light', borderRadius: '4px 4px 0 0', opacity: 0.6 }} />
                       <Box sx={{ flex: 1, height: '90%', bgcolor: 'primary.main', borderRadius: '4px 4px 0 0', opacity: 1 }} />
                       <Box sx={{ flex: 1, height: '60%', bgcolor: 'primary.light', borderRadius: '4px 4px 0 0', opacity: 0.6 }} />
                       <Box sx={{ flex: 1, height: '80%', bgcolor: 'secondary.main', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </SlideUp>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
