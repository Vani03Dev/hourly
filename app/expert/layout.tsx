"use client";

import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAuth } from "../../contexts/AuthContext";

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show the expert navigation on the login page itself or onboarding
  if (pathname === "/expert/login" || pathname === "/expert/onboarding") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", path: "/expert/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { label: "Availability", path: "/expert/availability", icon: <EventAvailableIcon fontSize="small" /> },
    { label: "Profile & Pricing", path: "/expert/settings", icon: <SettingsIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Left Sidebar (Desktop) */}
      <Box sx={{ 
        width: 280, 
        borderRight: '1px solid', 
        borderColor: 'divider', 
        bgcolor: 'background.paper',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column'
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1 }}>
            Expert Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{user?.user_metadata?.first_name || 'Creator'}</Typography>
              <Typography variant="caption" color="text.secondary">@{user?.user_metadata?.username || 'expert'}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 2, mb: 1, display: 'block' }}>
            MANAGE
          </Typography>
          <List sx={{ p: 0 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton 
                    component={Link} 
                    href={item.path}
                    selected={isActive}
                    sx={{ 
                      borderRadius: 2,
                      py: 1,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(13, 148, 136, 0.1)',
                        color: 'primary.main',
                      },
                      '&.Mui-selected:hover': {
                        bgcolor: 'rgba(13, 148, 136, 0.15)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      slotProps={{ primary: { sx: { fontWeight: isActive ? 'bold' : 'medium', fontSize: '0.95rem' } } }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            variant="outlined" 
            fullWidth 
            component={Link} 
            href={`/${user?.user_metadata?.username || user?.id}`}
            target="_blank"
            endIcon={<OpenInNewIcon />}
            sx={{ borderRadius: 2, fontWeight: 'bold', mb: 2 }}
          >
            View public page
          </Button>
          <Button variant="text" color="inherit" fullWidth sx={{ opacity: 0.7 }}>
            Switch to Mentee
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, bgcolor: '#FAFAFA', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
        {children}
      </Box>
    </Box>
  );
}
