"use client";

import React from "react";
import { Expert } from "@/types";
import { Box, Container, Typography, Chip, Avatar, Stack } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SlideUp, FadeIn } from "../shared/MotionWrapper";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";

interface ProfileHeaderProps {
  expert: Expert;
}

export function ProfileHeader({ expert }: ProfileHeaderProps) {
  // Use a placeholder gradient/abstract image for the cover banner
  const coverImage = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";

  return (
    <Box sx={{ bgcolor: 'background.default', pb: 4 }}>
      {/* Cover Banner */}
      <Box 
        sx={{ 
          height: { xs: 160, md: 240 }, 
          width: '100%', 
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', px: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { xs: -8, md: -10 } }}>
          {/* Overlapping Avatar */}
          <FadeIn>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar 
                src={expert.photo} 
                alt={expert.name} 
                sx={{ 
                  width: { xs: 140, md: 160 }, 
                  height: { xs: 140, md: 160 }, 
                  border: '6px solid',
                  borderColor: 'background.default',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  bgcolor: 'background.paper'
                }}
              />
              {expert.isOnline && (
                <Box sx={{ 
                  position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, 
                  bgcolor: '#10B981', borderRadius: '50%', border: '4px solid', borderColor: 'background.default',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' }
                  }
                }} />
              )}
            </Box>
          </FadeIn>
          
          {/* Profile Info */}
          <SlideUp delay={0.1}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  {expert.name}
                </Typography>
                <VerifiedIcon color="secondary" fontSize="large" sx={{ mt: 0.5 }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'medium', maxWidth: 600, mx: 'auto', mb: 2 }}>
                {expert.title}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {expert.credentials.map((cred) => (
                  <Chip key={cred} label={cred} size="small" variant="outlined" sx={{ fontWeight: 'bold', color: 'text.secondary', borderColor: 'divider' }} />
                ))}
              </Stack>
            </Box>
          </SlideUp>
          
          {/* Stats & Meta */}
          <SlideUp delay={0.2}>
            <Stack 
              direction="row" 
              spacing={3} 
              divider={<Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider', alignSelf: 'center' }} />}
              sx={{ flexWrap: 'wrap', gap: { xs: 2, md: 0 }, justifyContent: 'center', bgcolor: 'background.paper', px: 4, py: 1.5, borderRadius: 10, border: 1, borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
            >
              {SHOW_RATINGS_AND_REVIEWS && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{expert.rating} <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 'normal' }}>({expert.sessions})</Typography></Typography>
              </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2">{expert.responseTime}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{expert.location}</Typography>
              </Box>
            </Stack>
          </SlideUp>
        </Box>
      </Container>
    </Box>
  );
}
