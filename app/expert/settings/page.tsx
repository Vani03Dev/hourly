"use client";

import React, { useState } from "react";
import { Container, Paper, Typography, Box, TextField, Button, Grid, Avatar, InputAdornment, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { createClient } from '../../../utils/supabase/client';

export default function ExpertSettingsPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [rate, setRate] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGoogleCalendar, setHasGoogleCalendar] = useState(false);

  // Fetch actual profile data
  React.useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('expert_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setUsername(data.username || "");
          setTitle(data.title || "");
          setBio(data.bio || "");
          setRate(data.hourly_rate ? data.hourly_rate.toString() : "");
          if (data.first_name) setFirstName(data.first_name);
          else if (user?.user_metadata?.first_name) setFirstName(user.user_metadata.first_name);
          
          if (data.last_name) setLastName(data.last_name);
          else if (user?.user_metadata?.last_name) setLastName(user.user_metadata.last_name);
          
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }

        const { data: integrations } = await supabase
          .from('google_integrations')
          .select('id')
          .eq('expert_id', user.id)
          .single();
        if (integrations) setHasGoogleCalendar(true);

      } catch (error) {
        console.error("Error loading profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      
      const supabase = createClient();
      const { error } = await supabase
        .from('expert_profiles')
        .update({
          username: username.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          title: title,
          bio: bio,
          hourly_rate: parseInt(rate) || 0,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      const { Toast } = await import('../../../utils/toast');
      Toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error(error);
      const { Toast } = await import('../../../utils/toast');
      if (error.code === '23505' && error.message.includes('username')) {
        Toast.error('This username is already taken.');
      } else {
        Toast.error(error.message || 'Failed to save settings');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !user) return;
      
      const file = event.target.files[0];
      
      // Validate file size (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        const { Toast } = await import('../../../utils/toast');
        Toast.error('File size must be less than 2MB');
        return;
      }

      setIsUploading(true);
      
      const supabase = createClient();

      // Ensure no collisions by using user UUID
      // Structure: [user_id]/avatar.jpg
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl + `?t=${Date.now()}`; // Add timestamp to break browser cache

      // Save URL to database
      const { error: updateError } = await supabase
        .from('expert_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      const { Toast } = await import('../../../utils/toast');
      Toast.success('Profile photo updated!');
      
    } catch (error: any) {
      console.error(error);
      const { Toast } = await import('../../../utils/toast');
      Toast.error(error.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return null; // Or a loading spinner

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Profile & Settings</Typography>
          <Typography variant="body1" color="text.secondary">Hover over the tabs to switch views instantly.</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          sx={{ borderRadius: 2 }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
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
              <ListItem disablePadding>
                <ListItemButton 
                  selected={activeTab === "integrations"} 
                  onMouseEnter={() => setActiveTab("integrations")}
                  sx={{ py: 2, transition: 'all 0.3s', '&.Mui-selected': { bgcolor: 'secondary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } } }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}><CalendarMonthIcon color={activeTab === "integrations" ? "inherit" : "primary"} /></ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold' }}>Integrations</Typography>} />
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
                    <Avatar 
                      src={avatarUrl}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 3, fontSize: '3rem', bgcolor: 'primary.main', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
                    >
                      {!avatarUrl && firstName.charAt(0)}
                    </Avatar>
                    
                    <Button 
                      variant="outlined" 
                      component="label"
                      fullWidth 
                      disabled={isUploading}
                      sx={{ borderRadius: 2 }}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Photo'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </Button>
                    
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Basic Details</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField label="Username (hourly.com/username)" fullWidth value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} helperText="Changing this will break your existing profile links." />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="First Name" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <TextField label="Last Name" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </Box>
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

          {activeTab === "integrations" && (
            <Box sx={{ animation: 'fadeIn 0.3s' }}>
              <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Integrations</Typography>
                
                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3, justifyContent: 'space-between', bgcolor: hasGoogleCalendar ? 'rgba(13,148,136,0.05)' : 'transparent' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                      Google Calendar Sync {hasGoogleCalendar && <CheckCircleIcon color="success" fontSize="small" />}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Prevent double-booking. We will read your personal calendar and automatically block out busy time slots on your public booking page.
                    </Typography>
                  </Box>
                  <Button 
                    variant={hasGoogleCalendar ? "outlined" : "contained"} 
                    color={hasGoogleCalendar ? "error" : "primary"}
                    href={hasGoogleCalendar ? "#" : "/api/google/auth"}
                    onClick={hasGoogleCalendar ? async () => {
                      
                      await createClient().from('google_integrations').delete().eq('expert_id', user!.id);
                      setHasGoogleCalendar(false);
                    } : undefined}
                    sx={{ flexShrink: 0, borderRadius: 2 }}
                  >
                    {hasGoogleCalendar ? 'Disconnect' : 'Connect Calendar'}
                  </Button>
                </Box>
                
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
