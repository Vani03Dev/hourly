"use client";

import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Divider } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Successfully logged in! Welcome back.');
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, px: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <Paper elevation={4} sx={{ p: { xs: 4, sm: 5 }, borderRadius: 4, bgcolor: 'background.paper', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontWeight: 900, fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.02em', color: 'text.primary', mb: 1 }}>
              Welcome back<Box component="span" sx={{ color: 'secondary.main' }}>.</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your details to access your account.
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                required
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                <Link href="#" style={{ textDecoration: 'none' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'secondary.main', '&:hover': { textDecoration: 'underline' } }}>
                    Forgot password?
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1rem', mt: 1 }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 4, mb: 3 }}>
            <Divider sx={{ '&::before, &::after': { borderColor: 'divider' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', px: 1 }}>OR</Typography>
            </Divider>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            sx={{ 
              py: 1.5, 
              borderRadius: 2, 
              fontWeight: 'bold', 
              color: 'text.primary', 
              borderColor: 'divider',
              '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' }
            }}
          >
            <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" sx={{ width: 20, height: 20, mr: 1.5 }} />
            Continue with Google
          </Button>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', color: 'secondary.main', '&:hover': { textDecoration: 'underline' } }}>
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
