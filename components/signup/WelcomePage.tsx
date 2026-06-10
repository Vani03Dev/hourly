"use client";

import React from "react";
import MailIcon from '@mui/icons-material/Mail';
import { Box, Typography, Button, Divider } from "@mui/material";
import { motion } from "framer-motion";

interface WelcomePageProps {
  onContinueWithEmail: () => void;
}

export function WelcomePage({ onContinueWithEmail }: WelcomePageProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: 400, width: '100%' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '3.5rem', color: 'primary.main', mb: 1, lineHeight: 1, letterSpacing: '-0.02em' }} variant="h2">
        Hourly<Box component="span" sx={{ color: 'secondary.main' }}>.</Box>
      </Typography>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 4 }}>
        Expertise on Demand
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2, lineHeight: 1.2 }}>
        Welcome to Hourly
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, maxWidth: 320 }}>
        Join the network of top professionals and start consulting on your own terms.
      </Typography>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button 
          variant="outlined" 
          fullWidth
          sx={{ height: 56, fontSize: '1rem', fontWeight: 'bold', color: 'text.primary', borderColor: 'grey.300', '&:hover': { bgcolor: 'background.default', borderColor: 'grey.400' }, display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <Box component="svg" sx={{ width: 20, height: 20, position: 'absolute', left: 24 }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </Box>
          Continue with Google
        </Button>

        <Button 
          variant="contained" 
          fullWidth
          sx={{ height: 56, fontSize: '1rem', fontWeight: 'bold', bgcolor: '#0077b5', '&:hover': { bgcolor: '#006396' }, display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <Typography sx={{ position: 'absolute', left: 24, fontWeight: 'bold', fontSize: '1.2rem' }}>in</Typography>
          Continue with LinkedIn
        </Button>

        <Divider sx={{ my: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>Or</Typography>
        </Divider>

        <Button 
          variant="contained" 
          color="secondary"
          fullWidth
          onClick={onContinueWithEmail}
          sx={{ height: 56, fontSize: '1rem', fontWeight: 'bold', position: 'relative' }}
        >
          <MailIcon sx={{ position: 'absolute', left: 24 }} />
          Continue with Email
        </Button>
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 6 }}>
        By continuing, you agree to our <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Terms of Service</Box> and <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Privacy Policy</Box>.
      </Typography>
    </Box>
  );
}
