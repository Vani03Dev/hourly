"use client";

import React from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SettingsIcon from '@mui/icons-material/Settings';

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show the expert navigation on the login page itself
  if (pathname === "/expert/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", path: "/expert/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { label: "Availability", path: "/expert/availability", icon: <EventAvailableIcon fontSize="small" /> },
    { label: "Profile & Pricing", path: "/expert/settings", icon: <SettingsIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
      {/* Secondary Expert Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', pt: 3, pb: 0 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Expert Portal</Typography>
              <Typography variant="body2" color="text.secondary">Manage your business and sessions</Typography>
            </Box>
            <Button variant="outlined" color="primary" size="small" sx={{ borderRadius: 2 }}>
              Switch to Mentee
            </Button>
          </Box>
          
          {/* Navigation Tabs */}
          <Stack direction="row" spacing={4} sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      pb: 2,
                      borderBottom: 3,
                      borderColor: isActive ? 'secondary.main' : 'transparent',
                      color: isActive ? 'secondary.main' : 'text.secondary',
                      fontWeight: isActive ? 'bold' : 'medium',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: isActive ? 'secondary.main' : 'text.primary',
                      }
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>{item.label}</Typography>
                  </Box>
                </Link>
              );
            })}
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
