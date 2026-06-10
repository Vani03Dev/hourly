"use client";

import React from "react";
import { Container, Box, Typography, TextField, Button, Paper } from "@mui/material";
import { Toast } from "../../utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const updatePasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordValues) => {
    try {
      const { updatePassword } = await import('@/app/actions/auth');
      
      const formData = new FormData();
      formData.append('password', data.password);
      
      const response = await updatePassword(formData);
      
      if (response && response.error) {
        Toast.error(response.error);
      } else {
        Toast.success("Password updated successfully!");
      }
    } catch (error) {
      Toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Update Password
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Please enter your new password below.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              label="New Password" 
              type="password"
              variant="outlined" 
              fullWidth 
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField 
              label="Confirm New Password" 
              type="password"
              variant="outlined" 
              fullWidth 
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="secondary" 
              size="large" 
              disabled={isSubmitting}
              sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
