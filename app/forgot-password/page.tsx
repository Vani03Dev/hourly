"use client";

import React, { useState } from "react";
import { Toast } from "../../utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-bg px-[20px] py-[40px] font-sans relative overflow-hidden">
      {/* Subtle dot grid pattern background */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: "radial-gradient(#E5E7EB 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      
      {/* CENTERED CARD (max-width 400px) */}
      <div className="bg-white border border-border rounded-xl p-[32px] w-full max-w-[400px] shadow-sm flex flex-col gap-[24px] relative z-10 animate-page-enter">
        
        {/* LOGO AND HEADER */}
        <div className="text-center flex flex-col items-center">
          <Link href="/" className="text-[26px] font-bold text-primary tracking-tight font-sans hover:opacity-90 transition-opacity">
            Sessionly<span className="text-accent">.</span>
          </Link>
          <h2 className="text-[22px] font-bold text-primary mt-[16px] tracking-tight">
            Reset Password
          </h2>
          <p className="text-[14px] text-muted mt-[6px] leading-relaxed font-medium">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col gap-[18px] text-center">
            <p className="text-[14px] text-success font-semibold leading-relaxed">
              Check your inbox! We've sent a password reset link to your email.
            </p>
            <Button variant="outline" className="border-border text-primary hover:bg-bg rounded-lg h-[44px] font-semibold w-full mt-[6px]" asChild>
              <Link href="/auth/login">Return to Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
            <Input 
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              error={errors.email?.message}
            />
            
            <Button 
              type="submit" 
              variant="primary"
              className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-semibold w-full mt-[6px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link href="/auth/login" className="text-center text-[14px] font-semibold text-accent hover:text-accent-hover transition-colors">
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
