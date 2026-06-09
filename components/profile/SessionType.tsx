"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

export function SessionType() {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 3 }}>
      
      {/* Video Call Card */}
      <Card elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'relative', overflow: 'visible', '&:hover': { boxShadow: 2 } }}>
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
          <Chip label="30m" size="small" />
          <Chip label="60m" size="small" />
        </Box>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(13,148,136,0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <VideocamIcon color="secondary" />
          </Box>
          <Typography sx={{ fontWeight: 'bold' }} variant="h6" color="primary" gutterBottom>Live Video Call</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, minHeight: 40 }}>
            Deep dive into your financial strategy via a secure HD video meeting.
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="primary">₹500 / session</Typography>
        </CardContent>
      </Card>

      {/* Async Chat Card */}
      <Card elevation={0} sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'relative', overflow: 'visible', '&:hover': { boxShadow: 2 } }}>
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Chip label="24h Response" size="small" />
        </Box>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(30,58,95,0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <ChatBubbleIcon color="primary" />
          </Box>
          <Typography sx={{ fontWeight: 'bold' }} variant="h6" color="primary" gutterBottom>Async Chat</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, minHeight: 40 }}>
            Detailed answers to specific tax or compliance questions via text.
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="primary">₹200 / query</Typography>
        </CardContent>
      </Card>
      
    </Box>
  );
}
