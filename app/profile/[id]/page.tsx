"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import { mockExperts, mockReviews } from "@/lib/mock-data";
import { Box, Container, Typography, Card, CardContent, Button, Stack, Avatar, Rating, Chip, Tabs, Tab, Grid } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BoltIcon from '@mui/icons-material/Bolt';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";
import { SlideUp, FadeIn } from "@/components/shared/MotionWrapper";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState(0);
  const expert = mockExperts.find(e => e.id === params.id) || mockExperts[0];

  if (!expert) {
    notFound();
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10, pt: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          {/* Left Column - Sticky Profile Sidebar */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ position: { md: 'sticky' }, top: { md: 100 }, height: { md: 'max-content' } }}>
            <FadeIn>
              <Card elevation={0} sx={{ 
                borderRadius: 6, 
                border: '1px solid', borderColor: 'divider', 
                bgcolor: 'background.paper', 
                overflow: 'visible',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)'
              }}>
                <Box sx={{ h: 100, bgcolor: 'action.hover', borderRadius: '24px 24px 0 0', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar 
                        src={expert.photo} 
                        sx={{ width: 120, height: 120, border: '6px solid', borderColor: 'background.paper', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} 
                      />
                      {expert.isOnline && (
                        <Box sx={{ 
                          position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, 
                          bgcolor: '#10B981', borderRadius: '50%', border: '4px solid', borderColor: 'background.paper',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
                            '70%': { boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' }
                          }
                        }} />
                      )}
                    </Box>
                  </Box>
                </Box>
                
                <CardContent sx={{ pt: 8, pb: 4, px: 3, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>{expert.name}</Typography>
                    <VerifiedIcon color="secondary" fontSize="small" />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'medium', mb: 3 }}>
                    {expert.title}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
                    {expert.credentials.map((cred) => (
                      <Chip key={cred} label={cred} size="small" sx={{ fontWeight: 'bold', bgcolor: 'action.hover', color: 'text.secondary' }} />
                    ))}
                  </Stack>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.default', p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ color: '#F59E0B', fontSize: 16 }} /> Rating
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{expert.rating} ({expert.sessions})</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ fontSize: 16 }} /> Response Time
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{expert.responseTime}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ fontSize: 16 }} /> Location
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{expert.location}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </FadeIn>
          </Grid>

          {/* Right Column - Interactive Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, val) => setActiveTab(val)} 
                textColor="primary"
                indicatorColor="secondary"
                variant="fullWidth"
                sx={{ 
                  '& .MuiTab-root': { 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    py: 2
                  }
                }}
              >
                <Tab label="Services" />
                <Tab label="About" />
                <Tab label="Reviews" />
              </Tabs>
            </Box>

            <Box sx={{ minHeight: 600 }}>
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="services"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stack spacing={3}>
                      {expert.isOnline && (
                        <Box sx={{ 
                          border: '2px solid', borderColor: '#10B981', bgcolor: 'rgba(16, 185, 129, 0.05)', 
                          borderRadius: 4, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, 
                          justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2,
                          position: 'relative', overflow: 'hidden', boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)'
                        }}>
                          <Box sx={{ position: 'absolute', top: 0, right: 0, width: 150, height: 150, bgcolor: '#10B981', opacity: 0.1, borderRadius: '0 0 0 100%' }} />
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, position: 'relative' }}>
                            <Box sx={{ p: 2, bgcolor: '#10B981', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <VideocamIcon sx={{ color: 'white' }} fontSize="large" />
                            </Box>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                <Typography sx={{ fontWeight: 900, fontSize: '1.25rem' }} color="text.primary">Instant Drop-In</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(16,185,129,0.2)', color: '#10B981', px: 1, py: 0.25, borderRadius: 1 }}>
                                  <Box sx={{ width: 8, height: 8, bgcolor: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>LIVE NOW</Typography>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 450, lineHeight: 1.6 }}>
                                Skip the scheduling. Connect instantly via video to solve your problem right now. Pay only for the minutes you use.
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1, width: { xs: '100%', sm: 'auto' }, position: 'relative' }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }} color="text.primary">₹{expert.perMinuteRate}<Typography component="span" variant="body2" color="text.secondary" sx={{ fontWeight: 'normal' }}>/min</Typography></Typography>
                            <Button component={Link} href={`/room/${expert.id}`} variant="contained" endIcon={<ArrowForwardIcon sx={{ transition: 'transform 0.2s', '.MuiButton-root:hover &': { transform: 'translateX(4px)' } }} />} sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' }, borderRadius: 10, fontWeight: 'bold', px: 3, py: 0.75, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' }, fontSize: '0.85rem' }}>
                              Join Room
                            </Button>
                          </Box>
                        </Box>
                      )}

                      {/* Video Session Service Card */}
                      <Box sx={{ 
                        border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', 
                        borderRadius: 4, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, 
                        justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2,
                        position: 'relative', overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                        '&:hover': { borderColor: 'secondary.main', boxShadow: '0 12px 40px -10px rgba(13, 148, 136, 0.15)', transform: 'translateY(-4px)' }
                      }}>
                        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, bgcolor: 'secondary.main', opacity: 0.05, borderRadius: '0 0 0 100%' }} />
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, position: 'relative' }}>
                          <Box sx={{ p: 2, bgcolor: 'rgba(13,148,136,0.1)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <VideocamIcon color="secondary" fontSize="large" />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                              <Typography sx={{ fontWeight: 900, fontSize: '1.25rem' }} color="text.primary">1:1 Video Consultation</Typography>
                              <Chip label="POPULAR" size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 'bold', fontSize: '0.7rem', height: 20 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 450, lineHeight: 1.6 }}>
                              A focused 30-minute deep dive into your specific challenges. We can cover strategy, career advice, or technical architecture.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>30 mins</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5, width: { xs: '100%', sm: 'auto' }, position: 'relative' }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }} color="text.primary">₹{expert.price}</Typography>
                          <Button component={Link} href={`/booking/${expert.id}`} variant="contained" color="secondary" endIcon={<ArrowForwardIcon sx={{ transition: 'transform 0.2s', '.MuiButton-root:hover &': { transform: 'translateX(4px)' } }} />} sx={{ borderRadius: 10, fontWeight: 'bold', px: 3, py: 0.75, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' }, fontSize: '0.85rem', boxShadow: '0 4px 14px rgba(13,148,136,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(13,148,136,0.4)' } }}>
                            Book Session
                          </Button>
                        </Box>
                      </Box>

                      {/* Priority DM Service Card */}
                      <Box sx={{ 
                        border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', 
                        borderRadius: 4, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, 
                        justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2,
                        position: 'relative', overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                        '&:hover': { borderColor: 'primary.main', boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.1)', transform: 'translateY(-4px)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, position: 'relative' }}>
                          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChatBubbleIcon color="action" fontSize="large" />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', mb: 0.5 }} color="text.primary">Priority DM (Text / Voice)</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 450, lineHeight: 1.6 }}>
                              Ask me a detailed question and I'll respond with a thoughtful text or voice note within 24 hours.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <BoltIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Fast Response</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5, width: { xs: '100%', sm: 'auto' }, position: 'relative' }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }} color="text.primary">₹{Math.round(expert.price * 0.4)}</Typography>
                          <Button variant="outlined" color="primary" endIcon={<ArrowForwardIcon sx={{ transition: 'transform 0.2s', '.MuiButton-root:hover &': { transform: 'translateX(4px)' } }} />} sx={{ borderRadius: 10, fontWeight: 'bold', px: 3, py: 0.75, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' }, borderWidth: 2, fontSize: '0.85rem', '&:hover': { borderWidth: 2, bgcolor: 'rgba(96, 165, 250, 0.05)' } }}>
                            Ask Question
                          </Button>
                        </Box>
                      </Box>
                    </Stack>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: 'background.paper', p: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }} color="text.primary">
                        About {expert.name.split(' ')[0]}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        {expert.bio}
                      </Typography>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stack spacing={3}>
                      {mockReviews.map((review) => (
                        <Card key={review.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: 'background.paper', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'action.hover', color: 'text.primary', width: 48, height: 48, fontWeight: 'bold', fontSize: '1.2rem' }}>{review.userName[0]}</Avatar>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{review.userName}</Typography>
                                  <Typography variant="caption" color="text.secondary">{review.date} • {review.type}</Typography>
                                </Box>
                              </Box>
                              <Rating value={review.rating} readOnly size="small" />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                              "{review.text}"
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
