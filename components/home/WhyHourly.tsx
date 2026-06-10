"use client";

import React from "react";
import { ShieldCheck, Zap, Shield } from "lucide-react";
import { Box, Container, Grid, Typography, Paper, Stack } from "@mui/material";

import { FadeIn, SlideUp } from "../shared/MotionWrapper";

export function WhyHourly() {
  const points = [
    {
      icon: ShieldCheck,
      title: "Verified Credentials",
      desc: "Every expert is vetted through their professional licensing bodies."
    },
    {
      icon: Zap,
      title: "Zero Friction",
      desc: "No RFPs, no long contracts. Find, book, and talk in under 60 seconds."
    },
    {
      icon: Shield,
      title: "Secure Escrow",
      desc: "Payments are held securely and only released after the session concludes."
    }
  ];

  return (
    <Box component="section" id="why-hourly" sx={(theme) => ({ py: 12, bgcolor: theme.palette.mode === 'light' ? 'primary.main' : 'background.paper', color: 'common.white', overflow: 'hidden' })}>
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ alignItems: 'center' }}>
          
          <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 2, lg: 1 } }}>
            <SlideUp delay={0.2}>
              <Paper elevation={12} sx={{ 
                position: 'relative', overflow: 'hidden', borderRadius: 3, 
                border: '1px solid rgba(255,255,255,0.1)', bgcolor: '#0F172A', 
                aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' }
              }}>
                <Box sx={{ position: 'absolute', top: 0, width: '100%', height: 24, bgcolor: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', px: 1.5, gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#facc15' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4ade80' }} />
                </Box>
                <Box sx={{ position: 'absolute', inset: 0, top: 24, display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
                  <Box sx={{ flex: 1, position: 'relative', p: 2 }}>
                    <Box sx={{ width: '100%', height: '100%', bgcolor: '#1e293b', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#0D9488', opacity: 0.8 }} />
                        </Box>
                      </Box>
                      <Box sx={{ position: 'absolute', bottom: 16, left: 16, px: 2, py: 1, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 1 }}>
                         <Box sx={{ width: 80, height: 8, bgcolor: '#ffffff', borderRadius: 1, opacity: 0.8 }} />
                      </Box>
                    </Box>
                    <Box sx={{ position: 'absolute', top: 32, right: 32, width: 100, height: 70, bgcolor: '#334155', borderRadius: 2, border: '2px solid rgba(255,255,255,0.2)', boxShadow: 4 }} />
                  </Box>
                  <Box sx={{ height: 60, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, bgcolor: '#0f172a', zIndex: 10 }}>
                     <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                     <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                     <Box sx={{ width: 48, height: 40, borderRadius: 4, bgcolor: '#ef4444' }} />
                  </Box>
                </Box>
              </Paper>
            </SlideUp>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 1, lg: 2 } }}>
            <SlideUp delay={0.1}>
              <Typography variant="h2" sx={{ color: 'common.white', mb: 3, lineHeight: 1.2 }}>
                Why Choose Hourly?
              </Typography>
            </SlideUp>
            <SlideUp delay={0.2}>
              <Typography variant="body1" sx={{ color: 'grey.300', mb: 5, fontSize: '1.125rem', lineHeight: 1.6 }}>
                We've built a platform that removes the friction of hiring consultants for small, focused tasks.
              </Typography>
            </SlideUp>
            
            <Stack spacing={3}>
              {points.map((point, index) => (
                <FadeIn delay={0.3 + index * 0.1} key={index}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, p: 3 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(13,148,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <point.icon style={{ color: '#0D9488' }} size={20} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'common.white', mb: 0.5 }}>{point.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'grey.300', lineHeight: 1.6 }}>{point.desc}</Typography>
                    </Box>
                  </Box>
                </FadeIn>
              ))}
            </Stack>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
