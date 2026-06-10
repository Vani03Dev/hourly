"use client";

import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Divider, IconButton, InputAdornment } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Toast } from "../../utils/toast";
import { createClient } from '../../utils/supabase/client';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        Toast.error(error.message);
      } else {
        Toast.success('Successfully logged in! Welcome back.');
        router.push('/expert/dashboard');
      }
    } catch (error) {
      Toast.error('An unexpected error occurred.');
    }
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      py: { xs: 4, md: 8 }, 
      px: { xs: 2, md: 4 },
      position: 'relative',
      overflow: 'hidden',
      bgcolor: 'background.default'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}
      >
        <Paper elevation={0} sx={{ 
          p: { xs: 4, sm: 6 }, 
          borderRadius: 4, 
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Typography sx={{ fontWeight: 900, fontSize: '2.5rem', lineHeight: 1.2, letterSpacing: '-0.02em', color: 'text.primary', mb: 1 }}>
                Welcome back<Box component="span" sx={{ color: 'primary.main' }}>.</Box>
              </Typography>
            </motion.div>
            <Typography variant="body1" color="text.secondary">
              Enter your details to access your account.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(96, 165, 250, 0.2)' }
                  }
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.2s ease-in-out',
                    '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(96, 165, 250, 0.2)' }
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                <Link href="#" style={{ textDecoration: 'none' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}>
                    Forgot password?
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ py: 1.5, fontSize: '1.1rem', mt: 1 }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
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
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${location.origin}/auth/callback`,
                },
              });
            }}
            sx={{ 
              py: 1.5, 
              color: 'text.primary', 
              borderColor: 'divider',
            }}
          >
            <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" sx={{ width: 20, height: 20, mr: 1.5 }} />
            Continue with Google
          </Button>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
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

