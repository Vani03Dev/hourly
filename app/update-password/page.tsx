"use client";

import React from "react";
import { Toast } from "../../utils/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import Link from "next/link";

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
            Update Password
          </h2>
          <p className="text-[14px] text-muted mt-[6px] leading-relaxed font-medium">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
          <Input 
            label="New Password" 
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
          />
          
          <Input 
            label="Confirm New Password" 
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          
          <Button 
            type="submit" 
            variant="primary"
            className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-semibold w-full mt-[6px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
