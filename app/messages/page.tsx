"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { Box, Container, Typography, Paper, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '../../utils/supabase/client';
import { ConversationList, Conversation } from '../../components/chat/ConversationList';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { useSearchParams, useRouter } from 'next/navigation';

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const initialBookingId = searchParams.get('bookingId');
  const [activeBookingId, setActiveBookingId] = useState<string | null>(initialBookingId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      const supabase = createClient();
      
      try {
        // Fetch all bookings where user is involved
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .or(`expert_id.eq.${user.id},mentee_id.eq.${user.id}`)
          .neq('status', 'canceled');
          
        if (bookingsError) throw bookingsError;
        
        if (!bookingsData || bookingsData.length === 0) {
          setConversations([]);
          setIsLoading(false);
          return;
        }

        const bookingIds = bookingsData.map(b => b.id);
        
        // Fetch all messages for these bookings
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .in('booking_id', bookingIds)
          .order('created_at', { ascending: false });
          
        if (messagesError) throw messagesError;

        // Fetch other users' profiles
        const otherUserIds = bookingsData.map(b => b.expert_id === user.id ? b.mentee_id : b.expert_id);
        const uniqueOtherUserIds = [...new Set(otherUserIds)];
        
        const { data: profilesData } = await supabase
          .from('expert_profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', uniqueOtherUserIds);
          
        const profileMap = new Map();
        if (profilesData) {
          profilesData.forEach(p => profileMap.set(p.id, p));
        }
        
        const fetchMenteeNames = async () => {
          // Some might be pure mentees and not in expert_profiles, fallback to auth users or we can just query users table but we don't have direct access via API if not set up.
          // In this simple setup, we assume mentees also have expert_profiles or we just use 'Mentee' as fallback.
          return profileMap;
        };
        
        await fetchMenteeNames();

        const formattedConversations: Conversation[] = bookingsData.map(b => {
          const isExpert = b.expert_id === user.id;
          const otherUserId = isExpert ? b.mentee_id : b.expert_id;
          const profile = profileMap.get(otherUserId);
          
          const bookingMessages = messagesData?.filter(m => m.booking_id === b.id) || [];
          const lastMessage = bookingMessages.length > 0 ? bookingMessages[0] : null;
          
          const unreadCount = bookingMessages.filter(m => !m.is_read && m.sender_id !== user.id).length;
          
          let lastMessageTimeStr = '';
          if (lastMessage) {
            const date = new Date(lastMessage.created_at);
            lastMessageTimeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          return {
            bookingId: b.id,
            isExpert,
            otherUserName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User' : 'User',
            otherUserAvatar: profile?.avatar_url,
            lastMessage: lastMessage?.content,
            lastMessageTime: lastMessageTimeStr,
            unreadCount
          };
        });

        // Sort by last message time, or booking date if no messages
        formattedConversations.sort((a, b) => {
          if (a.lastMessageTime && b.lastMessageTime) {
            return b.lastMessageTime.localeCompare(a.lastMessageTime); // Simple string sort works for same day, but robust would be date object.
          }
          if (a.lastMessageTime) return -1;
          if (b.lastMessageTime) return 1;
          return 0;
        });

        setConversations(formattedConversations);
        
        if (!activeBookingId && formattedConversations.length > 0) {
          setActiveBookingId(formattedConversations[0].bookingId);
        }
        
        } catch (error: any) {
        console.error("Error fetching conversations:", error);
        setLocalError(error.message || String(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, [user, activeBookingId]);

  const activeConversation = conversations.find(c => c.bookingId === activeBookingId);

  const handleSelectConversation = (id: string) => {
    setActiveBookingId(id);
    router.replace(`/messages?bookingId=${id}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (localError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
        <Typography color="error" variant="h6">An error occurred fetching messages:</Typography>
        <Typography color="error" variant="body1">{localError}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 76px)', display: 'flex', bgcolor: 'background.default' }}>
      <Paper elevation={0} sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        borderRadius: 0, 
        border: 'none',
        overflow: 'hidden',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        {/* Sidebar */}
        {(!isMobile || !activeBookingId) && (
          <Box sx={{ 
            width: { xs: '100%', md: 350 }, 
            borderRight: { xs: 'none', md: '1px solid' }, 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper'
          }}>
            <ConversationList 
              conversations={conversations} 
              activeBookingId={activeBookingId} 
              onSelect={handleSelectConversation} 
            />
          </Box>
        )}

        {/* Main Chat Area */}
        {(!isMobile || activeBookingId) && (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {isMobile && activeBookingId && (
              <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography 
                  variant="button" 
                  color="primary" 
                  onClick={() => {
                    setActiveBookingId(null);
                    router.replace('/messages', { scroll: false });
                  }}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ← Back to Inbox
                </Typography>
              </Box>
            )}
            
            {activeConversation ? (
              <ChatWindow 
                bookingId={activeConversation.bookingId} 
                otherUserName={activeConversation.otherUserName}
                otherUserAvatar={activeConversation.otherUserAvatar}
                isExpert={activeConversation.isExpert}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5, flexDirection: 'column' }}>
                <Typography variant="h6">Select a conversation</Typography>
                <Typography variant="body2">Choose a booking from the sidebar to start chatting</Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>}>
      <MessagesContent />
    </Suspense>
  );
}
