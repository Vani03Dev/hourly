"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Box, Container, Grid, Typography, Paper, Divider, Slider } from "@mui/material";

export function Pricing() {
  const [sessionCost, setSessionCost] = useState(1000);
  const fee = sessionCost * 0.05;

  return (
    <Box sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ alignItems: 'center' }}>
          
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography variant="h2" sx={{ mb: 3, lineHeight: 1.2 }}>
              Transparent Fee Structure
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: '1.125rem', lineHeight: 1.6 }}>
              No hidden charges or monthly subscriptions. We believe in simplicity and fairness for both clients and professionals.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <CheckCircle2 style={{ color: '#0D9488', marginTop: 4 }} size={24} />
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h6" color="primary" gutterBottom>Pay only for what you use</Typography>
                  <Typography variant="body2" color="text.secondary">The expert sets their hourly rate, and you're billed precisely for the session duration.</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <CheckCircle2 style={{ color: '#0D9488', marginTop: 4 }} size={24} />
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h6" color="primary" gutterBottom>Flat Platform Fee</Typography>
                  <Typography variant="body2" color="text.secondary">A fixed 5% platform fee covers secure transactions and seamless video conferencing.</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper elevation={6} sx={(theme) => ({ 
              bgcolor: theme.palette.mode === 'light' ? 'primary.main' : 'rgba(255,255,255,0.05)', 
              color: 'common.white', p: 6, 
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              borderRadius: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' }
            })}>
              <Box sx={{ bgcolor: 'secondary.main', px: 2, py: 0.5, borderRadius: 10, mb: 4 }}>
                <Typography sx={{ fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase' }} variant="caption">
                  Platform Fee
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2, color: 'common.white' }}>
                <Typography sx={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1 }}>
                  5
                </Typography>
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, ml: 0.5 }}>
                  %
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ color: 'grey.300', mb: 4, fontWeight: 'medium' }}>
                Applied per transaction. That's it.
              </Typography>
              
              <Divider sx={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)', mb: 4 }} />
              
              <Box sx={{ width: '100%', px: { xs: 0, sm: 2 } }}>
                <Typography variant="body2" sx={{ color: 'grey.300', mb: 1, fontWeight: 'bold', textAlign: 'left' }}>
                  Interactive Fee Calculator
                </Typography>
                <Slider 
                  value={sessionCost}
                  onChange={(e, val) => setSessionCost(val as number)}
                  min={100}
                  max={10000}
                  step={100}
                  color="secondary"
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.2)', p: 2, borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                    Session: ₹{sessionCost}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    Fee: ₹{fee}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
