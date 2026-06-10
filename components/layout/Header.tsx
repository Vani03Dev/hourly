"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Stack, Box, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Badge, Popover } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useColorMode } from "@/components/ThemeRegistry";
import { useNotifications } from "@/contexts/NotificationsContext";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function Header() {
  const { mode, toggleColorMode } = useColorMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };
  
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  const navItems = [
    { label: "Explore", href: "/search" },
    { label: "Categories", href: "/search" },
    { label: "How it Works", href: "/how-it-works" },
  ];

  const handleLogout = async () => {
    const { createClient } = await import('@/utils/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid', 
        borderColor: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
        zIndex: 1100
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 76 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', lineHeight: 1, letterSpacing: '-0.02em', color: 'primary.main' }}>
                  Hourly<Box component="span" sx={{ color: 'secondary.main' }}>.</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.5, mt: 0.5 }}>
                  Expertise on Demand
                </Typography>
              </Box>
            </Link>
            
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button 
                  key={item.label}
                  component={Link} 
                  href={item.href} 
                  disableRipple
                  sx={{ 
                    color: 'text.secondary', 
                    fontWeight: 600, 
                    px: 2, 
                    py: 1, 
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 3,
                      bgcolor: 'secondary.main',
                      transition: 'width 0.3s ease',
                      borderRadius: '4px 4px 0 0'
                    },
                    '&:hover': { 
                      bgcolor: 'transparent',
                      color: 'primary.main',
                      '&::before': { width: '80%' }
                    } 
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <IconButton onClick={toggleColorMode} color="primary" sx={{ mr: 1, display: { xs: 'none', sm: 'inline-flex' } }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {isAuthenticated && (
              <>
                <IconButton onClick={handleNotificationClick} color="primary" sx={{ mr: 2 }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleNotificationClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  slotProps={{ paper: { sx: { width: 340, maxHeight: 400, borderRadius: 3, mt: 1.5, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)' } } }}
                >
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
                    {unreadCount > 0 && (
                      <Button size="small" onClick={() => markAllAsRead()} sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 'bold' }}>Mark all read</Button>
                    )}
                  </Box>
                  <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                      <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary">No new notifications.</Typography>
                      </ListItem>
                    ) : (
                      notifications.map((notif) => (
                        <Box key={notif.id}>
                          <ListItemButton 
                            alignItems="flex-start" 
                            onClick={() => { 
                              if(!notif.is_read) markAsRead(notif.id); 
                              handleNotificationClose();
                            }}
                            sx={{ 
                              bgcolor: notif.is_read ? 'transparent' : 'rgba(13, 148, 136, 0.05)',
                              '&:hover': { bgcolor: notif.is_read ? 'rgba(0,0,0,0.02)' : 'rgba(13, 148, 136, 0.1)' },
                              borderRadius: 1,
                              mx: 0.5,
                              my: 0.25
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: notif.is_read ? 'normal' : 'bold', color: notif.is_read ? 'text.primary' : 'primary.main' }}>
                                  {notif.title}
                                </Typography>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    {notif.message}
                                  </Typography>
                                  <Typography component="span" variant="caption" color="text.disabled">
                                    {new Date(notif.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                            {!notif.is_read && (
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0, ml: 2 }} />
                            )}
                          </ListItemButton>
                          <Divider component="li" sx={{ mx: 2 }} />
                        </Box>
                      ))
                    )}
                  </List>
                </Popover>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Button 
                  component={Link} 
                  href="/expert/dashboard" 
                  variant="text" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.secondary',
                    transition: 'color 0.2s ease',
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                  }}
                >
                  Expert Dashboard
                </Button>
                <Button 
                  component={Link} 
                  href="/mentee/dashboard" 
                  variant="text" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.secondary',
                    transition: 'color 0.2s ease',
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                  }}
                >
                  My Bookings
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="contained" 
                  color="secondary" 
                  sx={{ 
                    fontWeight: 700, 
                    px: 3,
                    py: 1.2,
                    borderRadius: 50,
                    boxShadow: '0 4px 14px 0 rgba(13, 148, 136, 0.39)',
                    transition: 'all 0.2s ease-in-out',
                    display: { xs: 'none', md: 'inline-flex' },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(13, 148, 136, 0.23)',
                      bgcolor: 'secondary.dark'
                    }
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  href="/login" 
                  variant="text" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.secondary',
                    transition: 'color 0.2s ease',
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                  }}
                >
                  Log in
                </Button>
                <Button 
                  component={Link} 
                  href="/signup" 
                  variant="contained" 
                  color="secondary" 
                  sx={{ 
                    fontWeight: 700, 
                    px: 3,
                    py: 1.2,
                    borderRadius: 50,
                    boxShadow: '0 4px 14px 0 rgba(13, 148, 136, 0.39)',
                    transition: 'all 0.2s ease-in-out',
                    display: { xs: 'none', md: 'inline-flex' },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(13, 148, 136, 0.23)',
                      bgcolor: 'secondary.dark'
                    }
                  }}
                >
                  Join as Expert
                </Button>
              </>
            )}

            {/* Mobile Hamburger Icon */}
            <IconButton 
              color="inherit" 
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, ml: 1, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      {/* Mobile Drawer Navigation */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 280, bgcolor: 'background.paper' } }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton component={Link} href={item.href} onClick={() => setMobileOpen(false)} sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }}>{item.label}</Typography>} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {isAuthenticated ? (
              <>
                <Button component={Link} href="/expert/dashboard" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}>
                  Expert Dashboard
                </Button>
                <Button component={Link} href="/mentee/dashboard" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}>
                  My Bookings
                </Button>
                <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} href="/login" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}>
                  Log in
                </Button>
                <Button component={Link} href="/signup" variant="contained" color="secondary" fullWidth onClick={() => setMobileOpen(false)}>
                  Join as Expert
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
