"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Avatar, CircularProgress, Tooltip, Menu, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoodIcon from '@mui/icons-material/Mood';
import MicIcon from '@mui/icons-material/Mic';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../utils/supabase/client';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface ChatWindowProps {
  bookingId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  isExpert: boolean;
}

export function ChatWindow({ bookingId, otherUserName, otherUserAvatar, isExpert }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let subscription: any;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    };

    if (user && bookingId) {
      fetchMessages();

      subscription = supabase
        .channel(`chat_${bookingId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(scrollToBottom, 100);
        })
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user, bookingId, supabase]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user) return;

    const content = newMessage.trim();
    setNewMessage(''); // optimistic clear

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          booking_id: bookingId,
          sender_id: user.id,
          content: content,
          is_read: false
        });

      if (error) {
        console.error("Error sending message:", error);
        setNewMessage(content);
      }
    } catch (error) {
      console.error("Unexpected error sending message:", error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: '#f8fafc' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 0, bgcolor: '#f8fafc', position: 'relative' }}>
      
      {/* Header */}
      <Box sx={{ 
        px: 3, 
        py: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        bgcolor: '#ffffff', 
        zIndex: 10,
        height: 64,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
          <Avatar src={otherUserAvatar} sx={{ width: 42, height: 42 }}>
            {otherUserName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'text.primary', fontSize: '1.05rem' }}>
              {otherUserName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              {isExpert ? 'Mentee' : 'Expert'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, color: 'text.secondary' }}>
          <IconButton color="inherit" sx={{ p: 1 }}>
            <VideocamIcon />
          </IconButton>
          <IconButton color="inherit" sx={{ p: 1 }}>
            <PhoneIcon fontSize="small" />
          </IconButton>
          <IconButton color="inherit" sx={{ p: 1 }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, p: 3, px: { xs: 2, md: 8 }, overflowY: 'auto', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        {messages.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', px: 3, py: 1.5, borderRadius: 4, backdropFilter: 'blur(10px)', textAlign: 'center', maxWidth: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                Your conversation with <strong>{otherUserName}</strong> has started.
              </Typography>
            </Box>
          </Box>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.sender_id === user?.id;
            const showTail = index === messages.length - 1 || messages[index + 1].sender_id !== msg.sender_id;
            
            return (
              <Box 
                key={msg.id}
                sx={{ 
                  display: 'flex', 
                  flexDirection: isMine ? 'row-reverse' : 'row',
                  mb: showTail ? 1.5 : 0.5
                }}
              >
                <Box 
                  sx={{ 
                    maxWidth: '65%', 
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      pt: 1.2,
                      pb: 0.8,
                      borderRadius: 2,
                      bgcolor: isMine ? '#e0f2f1' : '#ffffff', // Soft professional teal for sender, white for receiver
                      color: 'text.primary',
                      borderTopRightRadius: isMine && showTail ? 0 : 12,
                      borderTopLeftRadius: !isMine && showTail ? 0 : 12,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      border: '1px solid',
                      borderColor: isMine ? 'rgba(13,148,136,0.1)' : 'rgba(0,0,0,0.05)',
                      position: 'relative',
                    }}
                  >
                    {/* Fake tail using pseudo-element */}
                    {showTail && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        [isMine ? 'right' : 'left']: -8,
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: isMine ? '0 8px 10px 0' : '0 0 10px 8px',
                        borderColor: isMine ? 'transparent #e0f2f1 transparent transparent' : 'transparent transparent transparent #ffffff',
                      }} />
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      <Typography variant="body1" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: 1.45, fontSize: '0.95rem', pr: 3, pb: 0.5 }}>
                        {msg.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, float: 'right', mt: 0.5, ml: 'auto', mb: '-2px' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {isMine && <DoneAllIcon sx={{ fontSize: 16, color: msg.is_read ? 'primary.main' : 'text.disabled' }} />}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        px: 2, py: 1.5, 
        bgcolor: '#ffffff', 
        display: 'flex', 
        gap: 1.5, 
        alignItems: 'center',
        zIndex: 10,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <IconButton sx={{ color: 'text.secondary', p: 1 }}>
          <MoodIcon />
        </IconButton>
        <IconButton sx={{ color: 'text.secondary', p: 1 }}>
          <AttachFileIcon sx={{ transform: 'rotate(45deg)' }} />
        </IconButton>
        
        <Box component="form" onSubmit={handleSendMessage} sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            size="small"
            multiline
            maxRows={4}
            autoComplete="off"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: '#f1f5f9',
                px: 2,
                py: 1,
                fontSize: '0.95rem',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: '1px solid', borderColor: 'primary.main' },
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </Box>

        {newMessage.trim() ? (
          <IconButton 
            onClick={handleSendMessage}
            color="primary"
            sx={{ p: 1, bgcolor: 'rgba(13,148,136,0.1)', '&:hover': { bgcolor: 'rgba(13,148,136,0.2)' } }}
          >
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton sx={{ color: 'text.secondary', p: 1 }}>
            <MicIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
