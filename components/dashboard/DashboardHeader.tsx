"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Container, Typography, Button, Avatar, Stack } from "@mui/material";

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <Box sx={{ bgcolor: 'background.paper', py: 4, boxShadow: 1 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>My Bookings</Typography>
          <Typography variant="body1" color="text.secondary">Manage your upcoming sessions and review past ones.</Typography>
        </Box>
        
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          <Button component={Link} href="/expert/login" variant="contained" color="secondary" sx={{ fontWeight: 'bold' }}>
            Become a Pro
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderLeft: 1, borderColor: 'divider', pl: 3 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{user?.user_metadata?.first_name || user?.email || "User"}</Typography>
              <Typography variant="caption" color="text.secondary">Mentee Account</Typography>
            </Box>
            <Avatar src={user?.user_metadata?.avatar_url || undefined} alt={user?.user_metadata?.first_name || "User"} sx={{ width: 40, height: 40, bgcolor: 'grey.200', color: 'text.secondary', fontWeight: 'bold' }}>
              {(!user?.user_metadata?.avatar_url) && "U"}
            </Avatar>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
