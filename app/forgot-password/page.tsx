"use client";

import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper } from "@mui/material";
import { Toast } from "@/utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const { sendPasswordResetEmail } = await import('@/app/actions/auth');
      
      const formData = new FormData();
      formData.append('email', data.email);
      
      const response = await sendPasswordResetEmail(formData);
      
      if (response && response.error) {
        Toast.error(response.error);
      } else {
        setIsSuccess(true);
        Toast.success("Password reset email sent!");
      }
    } catch (error) {
      Toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Reset Password
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {isSuccess ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 3 }}>
              Check your inbox! We've sent a password reset link to your email.
            </Typography>
            <Button component={Link} href="/login" variant="outlined" fullWidth sx={{ py: 1.5, fontWeight: 'bold' }}>
              Return to Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField 
                label="Email Address" 
                variant="outlined" 
                fullWidth 
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                size="large" 
                disabled={isSubmitting}
                sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button component={Link} href="/login" variant="text" sx={{ mt: 1 }}>
                Back to Login
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
}
