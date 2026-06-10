"use client";

import React from "react";
import { Box, Container, Typography, Grid, Paper, Avatar, Button } from "@mui/material";
import { mockExperts } from "@/lib/mock-data";
import Link from "next/link";
import StarIcon from '@mui/icons-material/Star';

import { SlideUp } from "../shared/MotionWrapper";

export function FeaturedExperts() {
  return (
    <Box component="section" id="featured-experts" sx={{ py: 12, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <SlideUp>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography variant="h2">Featured Experts</Typography>
            <Button component={Link} href="/search" variant="text" color="primary">View All →</Button>
          </Box>
        </SlideUp>
        <Grid container spacing={4}>
          {mockExperts.slice(0, 3).map((expert, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={expert.id}>
              <SlideUp delay={index * 0.1}>
                <Paper elevation={0} sx={(theme) => ({ 
                  p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column',
                  bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(30,30,30,0.7)',
                  backdropFilter: 'blur(20px)', border: '1px solid', borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }
                })}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar src={expert.photo} alt={expert.name} sx={{ width: 80, height: 80, border: '2px solid', borderColor: 'primary.main' }} />
                    <Typography sx={{ fontWeight: 'bold' }} variant="h6" color="primary">₹{expert.price}<Typography component="span" variant="caption" color="text.secondary">/hr</Typography></Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h6" gutterBottom>{expert.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{expert.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3 }}>
                    <StarIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 'bold' }} variant="body2">{expert.rating}</Typography>
                    <Typography variant="body2" color="text.secondary">({expert.sessions} sessions)</Typography>
                  </Box>
                  <Box sx={{ mt: 'auto' }}>
                    <Button component={Link} href={`/${expert.id}`} variant="outlined" fullWidth sx={{ borderRadius: 2 }}>
                      View Profile
                    </Button>
                  </Box>
                </Paper>
              </SlideUp>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
