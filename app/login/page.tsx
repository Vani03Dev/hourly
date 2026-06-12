"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Toast } from "../../utils/toast";
import { createClient } from '../../utils/supabase/client';
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";

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

  useEffect(() => {
    // Clear all states on mount for fresh login testing
    const supabase = createClient();
    supabase.auth.signOut();
  }, []);

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
        router.push('/dashboard');
      }
    } catch (error) {
      Toast.error('An unexpected error occurred.');
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0B1120] p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-teal-DEFAULT/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white font-serif italic text-2xl font-bold">
            Hourly.
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[40px] font-bold text-white leading-[1.1] mb-6 font-serif italic"
          >
            Unblock your team in under 60 minutes.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 text-[18px] leading-relaxed"
          >
            Access the top 1% of Indian engineering, finance, and legal talent on demand. Mutual NDAs. Zero wait time.
          </motion.p>
        </div>

        <div className="relative z-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} Hourly. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-12 md:px-24 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-navy-DEFAULT font-serif italic text-2xl font-bold">
            Hourly.
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] mx-auto"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-navy-DEFAULT text-sm font-medium mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <h2 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Welcome back</h2>
          <p className="text-text-sub text-[16px] mb-8">Enter your details to access your dashboard.</p>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-border text-navy-DEFAULT font-semibold h-[52px] rounded-[8px] hover:bg-surface-2 transition-all mb-6"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-[12px] text-text-muted font-bold uppercase tracking-wider">or sign in with email</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-1.5">Email Address</label>
              <input 
                type="email" 
                {...register("email")}
                className={`w-full h-[52px] px-4 rounded-[8px] border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal-DEFAULT focus:ring-teal-DEFAULT/20'} outline-none transition-all focus:ring-4`}
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-red-500 text-[13px] mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[14px] font-semibold text-navy-DEFAULT">Password</label>
                <Link href="/forgot-password" className="text-[13px] text-teal-DEFAULT hover:text-teal-dark font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register("password")}
                  className={`w-full h-[52px] px-4 pr-12 rounded-[8px] border ${errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal-DEFAULT focus:ring-teal-DEFAULT/20'} outline-none transition-all focus:ring-4`}
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy-DEFAULT transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[13px] mt-1.5">{errors.password.message}</p>}
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-[14px] text-text-sub mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-teal-DEFAULT hover:text-teal-dark font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
