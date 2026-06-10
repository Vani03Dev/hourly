"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import { Box, Container, Typography, Card, CardContent, Button, Stack, Chip, Grid } from "@mui/material";
import { mockBookings } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { ReviewForm } from "./ReviewForm";

export function BookingsList() {
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);

  return (
    <Box sx={{ py: 6, bgcolor: 'background.default', flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>Recent Bookings</Typography>
        
        <Stack spacing={4} sx={{ mb: 6 }}>
          {mockBookings.map((booking) => (
            <Card key={booking.id} sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3, boxShadow: 1 }}>
              <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
                {booking.status === "upcoming" ? (
                  <Chip label="Upcoming" color="warning" size="small" sx={{ fontWeight: 'bold' }} />
                ) : booking.status === "completed" ? (
                  <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 'bold' }} />
                ) : (
                  <Chip label="Cancelled" size="small" sx={{ fontWeight: 'bold', bgcolor: 'grey.300', color: 'grey.700' }} />
                )}
              </Box>

              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <Image src={booking.expertPhoto} alt={booking.expertName} fill style={{ objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ display: { md: 'none' } }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{booking.expertName}</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>{formatPrice(booking.price)}</Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Expert</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{booking.expertName}</Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Date & Time</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                        <CalendarTodayIcon sx={{ fontSize: 18, color: 'grey.400' }} />
                        <Typography variant="body1">{booking.date} • {booking.time}</Typography>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Format</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                        {booking.type === "video" ? <VideocamIcon sx={{ fontSize: 18, color: 'grey.400' }} /> : <ChatBubbleOutlinedIcon sx={{ fontSize: 18, color: 'grey.400' }} />}
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{booking.type} ({booking.duration})</Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>Amount Paid</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>{formatPrice(booking.price)}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                  {booking.status === "upcoming" && (
                    <>
                      <Button variant="contained" color="secondary" sx={{ fontWeight: 'bold', px: 3 }}>Join Call</Button>
                      <Button variant="outlined" color="primary" sx={{ fontWeight: 'bold', px: 3 }}>Reschedule</Button>
                      <Button variant="outlined" color="error" sx={{ fontWeight: 'bold', px: 3, ml: 'auto' }}>Cancel</Button>
                    </>
                  )}
                  {booking.status === "completed" && (
                    <>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        sx={{ fontWeight: 'bold', px: 3 }}
                        onClick={() => setReviewBookingId(booking.id)}
                      >
                        Leave Review
                      </Button>
                      <Button component={Link} href={`/${booking.expertId}`} variant="outlined" color="primary" sx={{ fontWeight: 'bold', px: 3 }}>
                        Book Again
                      </Button>
                      <Button variant="outlined" color="primary" sx={{ fontWeight: 'bold', px: 3, ml: 'auto' }}>View Receipt</Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Box sx={{ textAlign: 'center' }}>
          <Button component={Link} href="#" variant="text" color="secondary" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            View All History →
          </Button>
        </Box>
      </Container>

      <ReviewForm 
        isOpen={!!reviewBookingId} 
        onClose={() => setReviewBookingId(null)} 
      />
    </Box>
  );
}
