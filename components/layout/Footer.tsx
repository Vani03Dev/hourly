"use client";

import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Grid, Stack, IconButton } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import TagIcon from '@mui/icons-material/Tag';

export function Footer() {
  return (
    <Box sx={(theme) => ({ bgcolor: theme.palette.mode === 'light' ? 'primary.main' : 'background.paper', color: 'common.white', pt: 8, pb: { xs: 14, sm: 8 }, borderTop: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none' })}>
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.02em', color: 'common.white' }}>
                Hourly<Box component="span" sx={{ color: 'secondary.main' }}>.</Box>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 3, maxWidth: 300, lineHeight: 1.6 }}>
              The platform connecting professionals for immediate, focused micro-consulting sessions.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: 'grey.400' }}><LinkIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: 'grey.400' }}><PersonIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: 'grey.400' }}><StarIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: 'grey.400' }}><TagIcon fontSize="small" /></IconButton>
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Platform</Typography>
            <Stack spacing={1.5}>
              <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>Browse Experts</Link>
              <Link href="/how-it-works" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>How it Works</Link>
              <Link href="/pricing" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</Link>
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>For Experts</Typography>
            <Stack spacing={1.5}>
              <Link href="/signup" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>Join the Network</Link>
              <Link href="/guidelines" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>Expert Guidelines</Link>
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Support</Typography>
            <Stack spacing={1.5}>
              <Link href="/faq" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>FAQ</Link>
              <Link href="/contact" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>Contact Us</Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Legal</Typography>
            <Stack spacing={1.5}>
              <Link href="/terms" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>Terms of Service</Link>
              <Link href="/privacy" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.875rem' }}>Privacy Policy</Link>
            </Stack>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: '1px solid', borderColor: 'grey.800', mt: 8, pt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'grey.500' }}>
            © {new Date().getFullYear()} Hourly Inc. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
