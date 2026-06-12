import React from 'react';
import { List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Box, Badge, Divider } from '@mui/material';

export interface Conversation {
  bookingId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  isExpert: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeBookingId: string | null;
  onSelect: (bookingId: string) => void;
}

export function ConversationList({ conversations, activeBookingId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: '#8696a0' }}>
        <Typography variant="body1">No active conversations</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#ffffff', borderRight: '1px solid', borderColor: 'divider' }}>
      {/* Sidebar header */}
      <Box sx={{ p: 2, bgcolor: '#ffffff', display: 'flex', alignItems: 'center', height: 64, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.2rem' }}>Messages</Typography>
      </Box>

      <List sx={{ width: '100%', p: 0, flexGrow: 1, overflowY: 'auto' }}>
        {conversations.map((conv, index) => {
          const isActive = activeBookingId === conv.bookingId;
          return (
            <React.Fragment key={conv.bookingId}>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={isActive}
                  onClick={() => onSelect(conv.bookingId)}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    transition: 'background-color 0.1s',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(13,148,136,0.06)',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'rgba(13,148,136,0.08)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 64 }}>
                    <Avatar src={conv.otherUserAvatar} sx={{ width: 48, height: 48 }}>
                      {conv.otherUserName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText 
                    slotProps={{ primary: { component: 'div' }, secondary: { component: 'div' } }}
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: conv.unreadCount > 0 ? 700 : 600, color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 }}>
                          {conv.otherUserName}
                        </Typography>
                        {conv.lastMessageTime && (
                          <Typography variant="caption" sx={{ color: conv.unreadCount > 0 ? 'primary.main' : 'text.secondary', fontSize: '0.75rem', fontWeight: conv.unreadCount > 0 ? 600 : 500 }}>
                            {conv.lastMessageTime}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          component="span"
                          sx={{ 
                            display: '-webkit-box', 
                            WebkitLineClamp: 1, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden',
                            color: conv.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                            fontWeight: conv.unreadCount > 0 ? 600 : 400,
                            fontSize: '0.875rem'
                          }}
                        >
                          {conv.lastMessage || (conv.isExpert ? "Ready for mentee session" : "Ready for expert session")}
                        </Typography>
                        
                        {conv.unreadCount > 0 && (
                          <Box sx={{ 
                            bgcolor: 'primary.main', 
                            color: 'white', 
                            borderRadius: '50%', 
                            minWidth: 20, 
                            height: 20, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            px: 0.6,
                            ml: 1,
                            flexShrink: 0
                          }}>
                            {conv.unreadCount}
                          </Box>
                        )}
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </ListItemButton>
              </ListItem>
              {index < conversations.length - 1 && (
                <Box sx={{ pl: 10, pr: 2 }}>
                  <Divider component="li" sx={{ borderColor: 'rgba(0,0,0,0.04)' }} />
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
}
