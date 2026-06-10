"use client";

import React from "react";
import { Card, CardContent, CardActions, Typography, Avatar, Box, Chip, Button, Divider, IconButton } from "@mui/material";
import { Expert } from "@/types";
import Link from "next/link";
import StarIcon from '@mui/icons-material/Star';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';

interface ExpertCardProps {
  expert: Expert;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card elevation={2} sx={{ 
      height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3,
      transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src={expert.photo} sx={{ width: 80, height: 80 }} />
            {expert.isOnline && (
              <Box sx={{ 
                position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, 
                bgcolor: '#10B981', borderRadius: '50%', border: '2px solid', borderColor: 'background.paper',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
                  '70%': { boxShadow: '0 0 0 6px rgba(16, 185, 129, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' }
                }
              }} />
            )}
          </Box>
          <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography sx={{ fontWeight: 'bold', lineHeight: 1 }} variant="h5" color="primary">₹{expert.price}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>/ session</Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>{expert.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>{expert.title}</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <StarIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
          <Typography sx={{ fontWeight: 'bold' }} variant="body2">{expert.rating}</Typography>
          <Typography variant="body2" color="text.secondary">({expert.sessions} reviews)</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {expert.credentials.slice(0, 2).map(cred => (
            <Chip key={cred} label={cred} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
          ))}
          {expert.credentials.length > 2 && (
            <Chip label={`+${expert.credentials.length - 2}`} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
          )}
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" sx={{ bgcolor: 'rgba(30, 58, 95, 0.1)', color: 'primary.main', borderRadius: 2, '&:hover': { bgcolor: 'primary.main', color: 'white', transform: 'scale(1.05)' }, transition: 'all 0.2s' }}>
            <VideocamIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: 'rgba(13, 148, 136, 0.1)', color: 'secondary.main', borderRadius: 2, '&:hover': { bgcolor: 'secondary.main', color: 'white', transform: 'scale(1.05)' }, transition: 'all 0.2s' }}>
            <ChatBubbleOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {expert.isOnline ? (
          <Button component={Link} href={`/room/${expert.id}`} variant="contained" size="small" sx={{ borderRadius: 2, bgcolor: '#10B981', color: 'white', '&:hover': { bgcolor: '#059669' }, fontWeight: 'bold', px: 2 }}>
            Connect Now
          </Button>
        ) : (
          <Button component={Link} href={`/${expert.id}`} variant="contained" color="primary" size="small" sx={{ borderRadius: 2 }}>
            View Profile
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
