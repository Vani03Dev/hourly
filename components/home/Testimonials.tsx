"use client";

import React from "react";
import { Box, Container, Typography, Grid, Paper, Avatar } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

export function Testimonials() {
  const testimonials = [
    { text: "I needed a senior architect to review my startup's database schema. Found exactly who I needed in 5 minutes.", author: "Sarah J.", role: "CTO, TechStart" },
    { text: "The flat platform fee is a breath of fresh air. No haggling or complex contracts.", author: "Michael R.", role: "Freelance Designer" },
    { text: "Booked a 30-minute session with a top-tier lawyer to clarify some terms. Incredibly efficient.", author: "Priya M.", role: "Founder" },
  ];

  return (
    <Box component="section" id="testimonials" sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 8 }}>What Our Users Say</Typography>
        <Grid container spacing={4}>
          {testimonials.map((test, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Paper component="article" elevation={0} sx={{ 
                p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column',
                border: '1px solid', borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                  borderColor: 'secondary.main'
                }
              }}>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#F59E0B', fontSize: 20 }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', flexGrow: 1 }}>"{test.text}"</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>{test.author.charAt(0)}</Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">{test.author}</Typography>
                    <Typography variant="caption" color="text.secondary">{test.role}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
