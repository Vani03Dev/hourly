"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Box, Container, Grid, Typography, Paper, Divider, Slider } from "@mui/material";

export function Pricing() {
  const [sessionCost, setSessionCost] = useState(1000);
  const fee = sessionCost * 0.05;

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ alignItems: 'center' }}>
          
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ width: 60, height: 60, bgcolor: 'secondary.main', opacity: 0.1, borderRadius: '50%', position: 'absolute', top: -20, left: -20, zIndex: 0 }} />
              <Typography variant="h3" sx={{ mb: 3, lineHeight: 1.2, fontWeight: 900, position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>
                Transparent Fee Structure
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6 }}>
              No hidden charges, no monthly subscriptions. We believe in absolute simplicity and fairness for both clients and professionals.
            </Typography>
            
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(13,148,136,0.1)', borderRadius: 2 }}>
                    <CheckCircle2 style={{ color: '#0D9488' }} size={24} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary" gutterBottom>Pay only for what you use</Typography>
                    <Typography variant="body2" color="text.secondary">The expert sets their hourly rate, and you're billed precisely for the session duration.</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(30, 58, 95, 0.1)', borderRadius: 2 }}>
                    <CheckCircle2 style={{ color: '#1E3A5F' }} size={24} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" color="text.primary" gutterBottom>Flat 5% Platform Fee</Typography>
                    <Typography variant="body2" color="text.secondary">A fixed 5% platform fee covers secure transactions, instant payouts, and seamless video conferencing.</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 7 }}>
            <Paper elevation={0} sx={(theme) => ({ 
              bgcolor: theme.palette.mode === 'light' ? 'white' : 'rgba(255,255,255,0.02)', 
              p: { xs: 4, md: 6 }, 
              borderRadius: 6,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            })}>
              <Box sx={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', bgcolor: 'primary.main', opacity: 0.02, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Earnings Calculator</Typography>
                <Box sx={{ bgcolor: 'secondary.main', color: 'white', px: 2, py: 0.5, borderRadius: 20 }}>
                  <Typography sx={{ fontWeight: 'bold', letterSpacing: 1 }} variant="caption">
                    5% FLAT RATE
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 6, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    If you charge per session:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900, color: 'primary.main' }}>
                    ₹{sessionCost.toLocaleString()}
                  </Typography>
                </Box>
                <Slider 
                  value={sessionCost}
                  onChange={(e, val) => setSessionCost(val as number)}
                  min={200}
                  max={10000}
                  step={100}
                  color="secondary"
                  sx={{ 
                    height: 8,
                    '& .MuiSlider-thumb': {
                      width: 24, height: 24, bgcolor: 'white', border: '3px solid', borderColor: 'secondary.main',
                      boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                borderRadius: 4, 
                p: 4,
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 12px 30px rgba(30, 58, 95, 0.3)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>Platform Fee (5%)</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>- ₹{fee.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>You Earn</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'secondary.main' }}>₹{(sessionCost - fee).toLocaleString()}</Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, opacity: 0.6 }}>
                  *Instant payouts. Zero payout fees.
                </Typography>
              </Box>

            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
