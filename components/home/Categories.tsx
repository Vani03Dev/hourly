"use client";

import React from "react";
import { Box, Container, Typography, Paper, IconButton } from "@mui/material";
import { FadeIn } from "../shared/MotionWrapper";
import Link from "next/link";
import CodeIcon from '@mui/icons-material/Code';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BrushIcon from '@mui/icons-material/Brush';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export function Categories() {
  const categories = [
    { name: "Software Engineering", count: "340+ Experts", icon: <CodeIcon color="primary" /> },
    { name: "Product Management", count: "210+ Experts", icon: <LightbulbIcon color="secondary" /> },
    { name: "Design & UX", count: "180+ Experts", icon: <BrushIcon color="error" /> },
    { name: "Marketing & Growth", count: "150+ Experts", icon: <TrendingUpIcon color="success" /> },
    { name: "Startup Fundraising", count: "90+ Experts", icon: <RocketLaunchIcon color="warning" /> },
    { name: "Legal & Compliance", count: "60+ Experts", icon: <GavelIcon sx={{ color: '#8B5CF6' }} /> },
  ];

  return (
    <Box component="section" id="categories" sx={{ py: 12, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 8 }}>
          <Box>
            <Typography variant="h2" sx={{ mb: 2 }}>Explore Categories</Typography>
            <Typography variant="body1" color="text.secondary">Find the right expertise across our top domains.</Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Link href="/search" style={{ textDecoration: 'none' }}>
              <Typography sx={{ fontWeight: 'bold', color: 'secondary.main', display: 'flex', alignItems: 'center', '&:hover': { textDecoration: 'underline' } }}>
                View all <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Typography>
            </Link>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: 3, 
            pt: 2, 
            pb: 4, 
            px: { xs: 2, lg: 0 },
            mx: { xs: -2, lg: 0 },
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((cat, index) => (
            <Box 
              key={index} 
              sx={{ 
                minWidth: { xs: 280, sm: 320 }, 
                flexShrink: 0,
                scrollSnapAlign: 'start'
              }}
            >
              <FadeIn delay={index * 0.05}>
                <Link href="/search" style={{ textDecoration: 'none' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 4, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy transition
                      cursor: 'pointer',
                      '&:hover': { 
                        borderColor: 'secondary.main',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(13,148,136,0.05)' : 'rgba(13,148,136,0.02)',
                        boxShadow: '0 20px 40px -10px rgba(13, 148, 136, 0.25)',
                        transform: 'translateY(-8px) scale(1.02)',
                        '& .arrow-icon': {
                          opacity: 1,
                          transform: 'translateX(0) scale(1.1)',
                          bgcolor: 'secondary.main',
                        }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {cat.icon}
                      </Box>
                      <IconButton 
                        className="arrow-icon"
                        size="small" 
                        sx={{ 
                          bgcolor: 'secondary.main', 
                          color: 'white', 
                          opacity: 0, 
                          transform: 'translateX(-10px)', 
                          transition: 'all 0.3s',
                          '&:hover': { bgcolor: 'secondary.dark' }
                        }}
                      >
                        <ArrowForwardIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" color="text.primary" sx={{ fontWeight: 900, mb: 1 }}>{cat.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>{cat.count}</Typography>
                  </Paper>
                </Link>
              </FadeIn>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
