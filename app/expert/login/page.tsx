"use client";

import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ExpertLoginPage() {
  const [email, setEmail] = useState("expert@hourly.app");
  const [password, setPassword] = useState("password");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    login(email, "expert");
    toast.success("Welcome back to your Expert Dashboard!");
    router.push("/expert/dashboard");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Expert Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to manage your bookings and availability.
        </Typography>

        <form onSubmit={handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              label="Email Address" 
              variant="outlined" 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField 
              label="Password" 
              type="password" 
              variant="outlined" 
              fullWidth 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="secondary" 
              size="large" 
              sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}
            >
              Access Dashboard
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
