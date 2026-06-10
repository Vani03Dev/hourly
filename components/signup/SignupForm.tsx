"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, Stepper, Step, StepLabel, IconButton, Divider } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '../../utils/supabase/client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  city: z.string().min(2, "City is required"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const steps = ["Personal Info", "Contact Details", "Security"];

export function SignupForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState<SignupFormValues | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched"
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof SignupFormValues)[] = [];
    if (activeStep === 0) fieldsToValidate = ["name", "city"];
    if (activeStep === 1) fieldsToValidate = ["email", "phone"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.name.split(' ')[0] || '',
            last_name: data.name.split(' ').slice(1).join(' ') || '',
            phone: data.phone,
            city: data.city
          }
        }
      });

      if (error) {
        import('../../utils/toast').then(({ Toast }) => Toast.error(error.message));
      } else {
        import('../../utils/toast').then(({ Toast }) => Toast.success('Account created successfully!'));
        router.push('/expert/dashboard');
      }
    } catch (error) {
      import('../../utils/toast').then(({ Toast }) => Toast.error('An unexpected error occurred.'));
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: '0 8px 30px rgb(0,0,0,0.08)', border: 1, borderColor: 'grey.100' }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, position: 'relative' }}>
        {activeStep > 0 && (
          <IconButton onClick={handleBack} sx={{ position: 'absolute', left: -12 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center', width: '100%' }}>
          Create Your Account
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: 220 }}>
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField 
                    fullWidth 
                    label="Full Name" 
                    placeholder="John Doe" 
                    {...register("name")} 
                    error={!!errors.name} 
                    helperText={errors.name?.message} 
                    variant="outlined"
                  />
                  <TextField 
                    fullWidth 
                    label="City" 
                    placeholder="Mumbai" 
                    {...register("city")} 
                    error={!!errors.city} 
                    helperText={errors.city?.message} 
                    variant="outlined"
                  />
                </Box>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField 
                    fullWidth 
                    type="email"
                    label="Email Address" 
                    placeholder="john@example.com" 
                    {...register("email")} 
                    error={!!errors.email} 
                    helperText={errors.email?.message} 
                    variant="outlined"
                  />
                  <TextField 
                    fullWidth 
                    label="Phone Number" 
                    placeholder="+91 98765 43210" 
                    {...register("phone")} 
                    error={!!errors.phone} 
                    helperText={errors.phone?.message} 
                    variant="outlined"
                  />
                </Box>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField 
                    fullWidth 
                    type="password"
                    label="Password" 
                    placeholder="••••••••" 
                    {...register("password")} 
                    error={!!errors.password} 
                    helperText={errors.password?.message} 
                    variant="outlined"
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box sx={{ mt: 5 }}>
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              color="secondary"
              size="large" 
              type="submit" 
              fullWidth
              disabled={isSubmitting}
              sx={{ height: 56, fontSize: '1.125rem', fontWeight: 'bold' }}
            >
              {isSubmitting ? "Processing..." : "Create Account"}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary"
              size="large" 
              type="button" 
              onClick={handleNext}
              fullWidth
              sx={{ height: 56, fontSize: '1.125rem', fontWeight: 'bold' }}
            >
              Continue
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 4, mb: 3 }}>
          <Divider sx={{ '&::before, &::after': { borderColor: 'divider' } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', px: 1 }}>OR</Typography>
          </Divider>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          type="button"
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
            borderRadius: 2, 
            fontWeight: 'bold', 
            color: 'text.primary', 
            borderColor: 'divider',
            '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' },
            mb: 2
          }}
        >
          <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" sx={{ width: 20, height: 20, mr: 1.5 }} />
          Continue with Google
        </Button>

        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
          Already have an account? <Box component="span" onClick={() => router.push("/")} sx={{ color: 'primary.main', fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Log In →</Box>
        </Typography>
      </form>

      <Dialog open={showOTP} onClose={() => setShowOTP(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
        <form onSubmit={handleVerifyOTP}>
          <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center', pb: 1, fontSize: '1.5rem' }}>
            Verify Your Email
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', px: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We've sent a 6-digit code to <br/>
              <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{formData?.email}</Box>
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextField
                  key={index}
                  inputRef={(el: any) => { otpRefs.current[index] = el; }}
                  variant="outlined"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '12px 0' } } }}
                  sx={{ width: 48 }}
                />
              ))}
            </Box>

            <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ height: 56, fontSize: '1.125rem', fontWeight: 'bold', mb: 2 }}>
              Verify & Continue
            </Button>
            
            <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Resend Code
            </Typography>
          </DialogContent>
        </form>
      </Dialog>
    </Box>
  );
}
