"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  InputAdornment,
  Tooltip,
  Divider,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

interface ShareProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileUrl: string;
  profileName: string;
}

export function ShareProfileModal({ open, onClose, profileUrl, profileName }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const shareTitle = `Book a session with ${profileName}`;
  const shareText = `Check out ${profileName}'s profile on Sessionly and book a 1:1 session!`;

  const socialLinks = [
    {
      name: 'Twitter / X',
      icon: <TwitterIcon />,
      color: '#000000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      color: '#0077b5',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}`
    },
    {
      name: 'Email',
      icon: <EmailIcon />,
      color: '#D44638',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\\n\\n' + profileUrl)}`
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Share Profile</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Share {profileName}'s expertise with your network.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4, justifyContent: 'space-between' }}>
          {socialLinks.map((social) => (
            <Box key={social.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <IconButton 
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: `${social.color}15`, 
                  color: social.color,
                  width: 56,
                  height: 56,
                  transition: 'transform 0.2s, background-color 0.2s',
                  '&:hover': {
                    bgcolor: `${social.color}30`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {social.icon}
              </IconButton>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem' }}>
                {social.name}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, px: 1 }}>
            OR COPY LINK
          </Typography>
        </Divider>

        <TextField
          fullWidth
          variant="outlined"
          value={profileUrl}
          slotProps={{
            input: {
              readOnly: true,
              sx: { borderRadius: 3, pr: 0.5, bgcolor: 'background.default', fontSize: '0.9rem', color: 'text.secondary' },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={copied ? "Copied!" : "Copy Link"} arrow placement="top">
                    <IconButton onClick={handleCopyLink} color={copied ? "success" : "primary"} size="small" sx={{ bgcolor: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(13, 148, 136, 0.1)', '&:hover': { bgcolor: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(13, 148, 136, 0.2)' }, borderRadius: 2, width: 32, height: 32 }}>
                      {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
