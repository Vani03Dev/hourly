"use client";

import React, { useState } from "react";
import { Container, Paper, Typography, Box, TextField, Button, Grid, Avatar, InputAdornment, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';

export default function ExpertSettingsPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "Priya Patel");
  const [title, setTitle] = useState("Senior Product Designer at Google");
  const [rate, setRate] = useState("1200");
  const [bio, setBio] = useState("I help designers crack product design interviews at FAANG. With 5+ years of experience, I can review your portfolio and do mock whiteboard sessions.");

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Profile & Settings</Typography>
          <Typography variant="body1" color="text.secondary">Hover over the tabs to switch views instantly.</Typography>
        </Box>
        <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 2 }}>
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === "profile"} 
                  onMouseEnter={() => setActiveTab("profile")}
                  sx={{ py: 2, transition: 'all 0.3s', '&.Mui-selected': { bgcolor: 'secondary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } } }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}><PersonIcon color={activeTab === "profile" ? "inherit" : "primary"} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }}>Basic Profile</Typography>} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === "pricing"} 
                  onMouseEnter={() => setActiveTab("pricing")}
                  sx={{ py: 2, transition: 'all 0.3s', '&.Mui-selected': { bgcolor: 'secondary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } } }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}><AttachMoneyIcon color={activeTab === "pricing" ? "inherit" : "primary"} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }}>Pricing & Payments</Typography>} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === "reviews"} 
                  onMouseEnter={() => setActiveTab("reviews")}
                  sx={{ py: 2, transition: 'all 0.3s', '&.Mui-selected': { bgcolor: 'secondary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } } }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}><StarIcon color={activeTab === "reviews" ? "inherit" : "primary"} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }}>Featured Reviews</Typography>} />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 9 }}>
          {activeTab === "profile" && (
            <Box sx={{ animation: 'fadeIn 0.3s' }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={1} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 3, fontSize: '3rem', bgcolor: 'primary.main', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                      {name.charAt(0)}
                    </Avatar>
                    <Button variant="outlined" fullWidth sx={{ borderRadius: 2 }}>Upload Photo</Button>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Basic Details</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField label="Full Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                      <TextField label="Professional Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                      <TextField label="About You (Bio)" fullWidth multiline rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === "pricing" && (
            <Box sx={{ animation: 'fadeIn 0.3s' }}>
              <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Session Pricing</Typography>
                <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
                  <TextField 
                    label="Hourly Rate" 
                    fullWidth 
                    value={rate} 
                    onChange={(e) => setRate(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }
                    }}
                  />
                  <Box sx={{ mt: 3, p: 3, bgcolor: 'rgba(13,148,136,0.1)', borderRadius: 2, borderLeft: 4, borderColor: 'secondary.main' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'secondary.dark' }}>
                      You earn: ₹{Math.floor(parseInt(rate || "0") * 0.95)} per session
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      A 5% platform fee (₹{Math.floor(parseInt(rate || "0") * 0.05)}) is deducted to cover secure transactions and video hosting.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}

          {activeTab === "reviews" && (
            <Box sx={{ animation: 'fadeIn 0.3s' }}>
              <Paper elevation={1} sx={{ p: 4, borderRadius: 3, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">You can manage featured reviews here once you complete a session.</Typography>
              </Paper>
            </Box>
          )}
          
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </Grid>
      </Grid>
    </Container>
  );
}
