"use client";

import React from "react";
import { Container, Box, Typography, TextField, Button, Paper } from "@mui/material";
import { Toast } from "../../../utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function ExpertLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { login } = await import('@/app/actions/auth');
      
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      const response = await login(formData);
      
      if (response && response.error) {
        Toast.error(response.error);
      } else {
        Toast.success("Welcome back to your Expert Dashboard!");
      }
    } catch (error) {
      Toast.error("An unexpected error occurred.");
    }
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
            <TextField 
              label="Password" 
              type="password" 
              variant="outlined" 
              fullWidth 
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="secondary" 
              size="large" 
              disabled={isSubmitting}
              sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}
            >
              {isSubmitting ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
