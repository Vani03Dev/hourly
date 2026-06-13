"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signOut();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Successfully logged in!");
        const { data: user } = await supabase.auth.getUser();
        
        if (user?.user) {
          const { data: eData } = await supabase
            .from("expert_profiles")
            .select("id")
            .eq("id", user.user.id)
            .single();
          if (eData || user.user.user_metadata?.role === "expert") {
            router.push("/expert/dashboard");
            return;
          }
        }
        router.push("/dashboard/business");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
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
            Welcome back
          </h2>
          <p className="text-[14px] text-muted mt-[6px] font-medium">
            Sign in to access your consultations
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-[18px]">
          <Input 
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input 
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-accent transition-colors text-muted flex items-center justify-center p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          <div className="flex justify-end -mt-[6px]">
            <Link href="/forgot-password" className="text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            variant="primary"
            className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-semibold w-full mt-[6px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-[12px]">
          <div className="flex-grow h-[1px] bg-border" />
          <span className="text-[11px] text-muted font-bold uppercase tracking-wider shrink-0">or</span>
          <div className="flex-grow h-[1px] bg-border" />
        </div>

        {/* Google SSO */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full h-[44px] border border-border rounded-lg flex items-center justify-center gap-[8px] text-[13.5px] font-semibold text-primary bg-white hover:bg-bg hover:border-gray-300 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-[16px] h-[16px]" />
          Continue with Google
        </button>

        {/* Sign up link */}
        <p className="text-center text-[14px] text-muted font-medium">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-accent hover:text-accent-hover font-semibold transition-colors">
            Sign up
          </Link>
        </p>

      </div>

    </div>
  );
}
