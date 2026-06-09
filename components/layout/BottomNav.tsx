"use client";

import React, { } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter, usePathname } from "next/navigation";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const getValue = () => {
    if (pathname === '/') return 0;
    if (pathname.includes('/search')) return 1;
    if (pathname.includes('/profile') || pathname.includes('/dashboard')) return 2;
    return 0;
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        display: { xs: 'block', sm: 'none' }, // Only show on mobile
        zIndex: 1100,
        pb: 'env(safe-area-inset-bottom)' // iOS safe area
      }} 
      elevation={8}
    >
      <BottomNavigation
        showLabels
        value={getValue()}
        onChange={(event, newValue) => {
          if (newValue === 0) router.push('/');
          if (newValue === 1) router.push('/search');
          if (newValue === 2) router.push('/dashboard');
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Explore" icon={<SearchIcon />} />
        <BottomNavigationAction label="Account" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
