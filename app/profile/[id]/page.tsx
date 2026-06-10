"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { mockReviews } from "@/lib/mock-data";
import { Box, Container, Typography, Card, Button, Stack, Avatar, Rating, Chip, IconButton, Skeleton } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BoltIcon from '@mui/icons-material/Bolt';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import IosShareIcon from '@mui/icons-material/IosShare';
import Link from "next/link";
import { SlideUp } from "../../../components/shared/MotionWrapper";
import { motion } from "framer-motion";
import { createClient } from "../../../utils/supabase/client";
import { use } from "react";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const expertId = unwrappedParams.id;
  
  const [expert, setExpert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchExpert() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('expert_profiles')
          .select('*')
          .eq('id', expertId)
          .single();
          
        if (error) throw error;
        setExpert(data);
      } catch (err) {
        console.error("Failed to load expert:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExpert();
  }, [expertId]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Skeleton variant="circular" width={100} height={100} />
      </Box>
    );
  }

  if (!expert) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Profile Not Found</Typography>
        <Button component={Link} href="/search" sx={{ mt: 2 }}>Find an Expert</Button>
      </Box>
    );
  }

  const fullName = `${expert.first_name || ''} ${expert.last_name || ''}`.trim() || 'Anonymous Expert';
  // Use mock values for online status, rating, etc. if not present in DB
  const isOnline = true; // In a real app, calculate this or fetch from presence DB
  const perMinuteRate = expert.hourly_rate ? Math.round(expert.hourly_rate / 60) : 10;


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 12 }}>
      {/* Cover Photo Area */}
      <Box 
        sx={{ 
          height: { xs: 160, sm: 220 }, 
          bgcolor: 'primary.main',
          backgroundImage: 'linear-gradient(120deg, #1E3A5F 0%, #0D9488 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="sm" sx={{ height: '100%', position: 'relative' }}>
          <IconButton 
            sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
            onClick={() => {
              if (navigator.share) navigator.share({ title: expert.name, url: window.location.href });
            }}
          >
            <IosShareIcon />
          </IconButton>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <SlideUp>
          {/* Profile Header (Overlapping Avatar) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -8, mb: 4, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar 
                src={expert.avatar_url} 
                sx={{ 
                  width: 140, 
                  height: 140, 
                  border: '6px solid', 
                  borderColor: 'background.default', 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  fontSize: '3rem',
                  bgcolor: 'secondary.main'
                }} 
              >
                {!expert.avatar_url && fullName.charAt(0)}
              </Avatar>
              {isOnline && (
                <Box sx={{ 
                  position: 'absolute', bottom: 8, right: 8, width: 24, height: 24, 
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
                {fullName}
              </Typography>
              <VerifiedIcon color="secondary" fontSize="small" />
            </Box>
            
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, mb: 2, fontSize: '1.1rem' }}>
              {expert.title || "Professional Expert"}
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.primary', mb: 3, lineHeight: 1.6, px: { xs: 1, sm: 4 }, whiteSpace: 'pre-line' }}>
              {expert.bio || "No bio provided."}
            </Typography>

            {/* Social Proof Pills */}
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.paper', px: 2, py: 1, borderRadius: 50, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <StarIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 800 }}>5.0</Typography>
                <Typography variant="body2" color="text.secondary">(12)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.paper', px: 2, py: 1, borderRadius: 50, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>12h</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Services List */}
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, mt: 5, px: 1 }}>Services</Typography>
          <Stack spacing={2}>
            
            {/* Live Now Card */}
            {isOnline && (
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card 
                  elevation={0}
                  component={Link} 
                  href={`/room/${expert.id}`}
                  sx={{ 
                    textDecoration: 'none',
                    display: 'block',
                    p: 3, 
                    border: '2px solid', 
                    borderColor: '#10B981', 
                    bgcolor: 'rgba(16, 185, 129, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{ p: 1.5, bgcolor: '#10B981', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <VideocamIcon fontSize="medium" />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>Instant Drop-In</Typography>
                        <Box sx={{ width: 8, height: 8, bgcolor: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>₹{perMinuteRate}/min</Typography>
                        • Connect right now
                      </Typography>
                    </Box>
                    <Button variant="contained" sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }, color: 'white', borderRadius: 50, px: 3, py: 1, fontWeight: 'bold' }}>
                      Join
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            )}

            {/* Video Consultation */}
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card 
                elevation={0}
                component={Link} 
                href={`/book/${expert.id}`}
                sx={{ 
                  textDecoration: 'none',
                  display: 'block',
                  p: 3, 
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'secondary.main', boxShadow: '0 12px 40px -12px rgba(13, 148, 136, 0.15)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(13,148,136,0.1)', color: 'secondary.main', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VideocamIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary', mb: 0.5 }}>1:1 Video Consultation</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>₹{expert.hourly_rate || 500}</Typography>
                      • 30 mins
                    </Typography>
                  </Box>
                  <Button variant="outlined" color="secondary" sx={{ borderRadius: 50, px: 3, py: 1, fontWeight: 'bold' }}>
                    Book
                  </Button>
                </Box>
              </Card>
            </motion.div>

            {/* Priority DM */}
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card 
                elevation={0}
                component={Link} 
                href={`#`}
                sx={{ 
                  textDecoration: 'none',
                  display: 'block',
                  p: 3, 
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main', boxShadow: '0 12px 40px -12px rgba(30, 58, 95, 0.1)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(30, 58, 95, 0.05)', color: 'primary.main', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChatBubbleIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary', mb: 0.5 }}>Priority DM</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>₹{Math.round((expert.hourly_rate || 500) * 0.4)}</Typography>
                      • 24h response
                    </Typography>
                  </Box>
                  <Button variant="outlined" color="primary" sx={{ borderRadius: 50, px: 3, py: 1, fontWeight: 'bold', borderWidth: 1 }}>
                    Ask
                  </Button>
                </Box>
              </Card>
            </motion.div>

          </Stack>

          {/* Reviews Section */}
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, mt: 6, px: 1 }}>Recent Reviews</Typography>
          <Stack spacing={2}>
            {mockReviews.slice(0, 3).map((review) => (
              <Card key={review.id} elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem', bgcolor: 'primary.main' }}>{review.userName[0]}</Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{review.userName}</Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" sx={{ color: '#F59E0B' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  "{review.text}"
                </Typography>
              </Card>
            ))}
          </Stack>
        </SlideUp>
      </Container>
    </Box>
  );
}
