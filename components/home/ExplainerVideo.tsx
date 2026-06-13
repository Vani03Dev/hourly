"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Container, Typography, IconButton, useTheme, Grid, keyframes } from "@mui/material";
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { SlideUp } from "../shared/MotionWrapper";

const equalizerPlay = keyframes`
  0% { height: 20%; }
  100% { height: 100%; }
`;

const videos = [
  {
    id: "video1",
    title: "Platform Overview",
    description: "Discover how Sessionly connects you with top-tier professionals instantly.",
    src: "/media/explainer-1.mp4",
    thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "video2",
    title: "How It Works",
    description: "A quick walkthrough on booking a session and joining a video call.",
    src: "/media/explainer-2.mp4",
    thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80"
  }
];

export function ExplainerVideo() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Video play interrupted or prevented:", error);
        });
      }
    } else if (!isPlaying && videoRef.current) {
      videoRef.current.pause();
    }
  }, [activeVideoIndex, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const selectVideo = (index: number) => {
    if (index === activeVideoIndex) {
      setIsPlaying(true);
      return;
    }
    // Change index and set playing to true. The useEffect will handle the play() call safely after DOM update.
    setActiveVideoIndex(index);
    setIsPlaying(true);
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <SlideUp>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'primary.main', letterSpacing: 2 }}>
              WHAT IS SESSIONLY?
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 2, fontWeight: 900, letterSpacing: '-0.02em' }}>
              Skip the Guesswork
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.125rem', lineHeight: 1.6 }}>
              Sessionly is a platform where you can instantly book 1-on-1 video sessions with top-tier professionals across various industries. 
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 3, 
              bgcolor: 'background.paper', 
              p: { xs: 2, md: 3 }, 
              borderRadius: 6, 
              boxShadow: '0 24px 50px -12px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {/* Main Video Player */}
            <Box 
              sx={{ 
                flex: { md: 2 },
                position: 'relative', 
                borderRadius: 4, 
                overflow: 'hidden',
                bgcolor: 'black',
                aspectRatio: '16/9',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            >
              <video
                ref={videoRef}
                src={videos[activeVideoIndex].src}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                controls={isPlaying}
              />
              
              {!isPlaying && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover .play-button': {
                      transform: 'scale(1.1)',
                      bgcolor: 'primary.main',
                      color: 'white',
                    }
                  }}
                  onClick={handlePlayPause}
                >
                  <IconButton 
                    className="play-button"
                    sx={{ 
                      bgcolor: 'background.paper', 
                      color: 'primary.main', 
                      width: 72, 
                      height: 72, 
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                  >
                    <PlayCircleOutlinedIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Video Playlist sidebar */}
            <Box sx={{ flex: { md: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, px: 1, pt: 1, pb: 0.5, borderBottom: '2px solid', borderColor: 'divider' }}>
                Explore Features
              </Typography>
              
              {videos.map((video, index) => {
                const isActive = index === activeVideoIndex;
                return (
                  <Box
                    key={video.id}
                    onClick={() => selectVideo(index)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 3,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isActive ? 'primary.main' : 'transparent',
                      bgcolor: isActive ? 'action.selected' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: isActive ? 'action.selected' : 'action.hover',
                      }
                    }}
                  >
                    <Box sx={{ 
                      width: 100, 
                      height: 60, 
                      borderRadius: 2, 
                      overflow: 'hidden', 
                      position: 'relative',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}>
                      <Box 
                        sx={{ 
                          position: 'absolute', inset: 0, 
                          backgroundImage: `url(${video.thumbnail})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center' 
                        }} 
                      />
                      <Box sx={{ position: 'absolute', inset: 0, bgcolor: isActive ? 'rgba(37,99,235,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isActive && isPlaying ? (
                           <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 16 }}>
                             <Box sx={{ width: 3, height: '100%', bgcolor: 'white', animation: `${equalizerPlay} 0.5s infinite alternate` }} />
                             <Box sx={{ width: 3, height: '60%', bgcolor: 'white', animation: `${equalizerPlay} 0.7s infinite alternate` }} />
                             <Box sx={{ width: 3, height: '80%', bgcolor: 'white', animation: `${equalizerPlay} 0.4s infinite alternate` }} />
                           </Box>
                        ) : (
                           <PlayArrowIcon sx={{ color: 'white', fontSize: 24 }} />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isActive ? 'primary.main' : 'text.primary', lineHeight: 1.2, mb: 0.5 }}>
                        {video.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                        {video.description}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </SlideUp>
      </Container>
    </Box>
  );
}
