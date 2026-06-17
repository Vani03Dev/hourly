"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Categories dropdown
const DOMAINS = [
  "CA & Tax",
  "Startup Legal",
  "Tech & CTO",
  "Finance & CFO",
  "HR & People",
  "Sales & GTM",
  "Marketing",
  "Operations",
  "Leadership"
];

export default function SignupPage() {
  const router = useRouter();

  // Mode: "business" | "expert"
  const [role, setRole] = useState<"business" | "expert">("business");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("CA & Tax");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string }>({ score: 0, label: "", color: "" });

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    let label = "";
    let color = "";
    if (pass.length === 0) {
      label = "";
      color = "bg-transparent";
    } else if (score <= 1) {
      label = "Weak 🔴";
      color = "bg-red-500 w-1/3";
    } else if (score === 2 || score === 3) {
      label = "Medium 🟡";
      color = "bg-yellow-500 w-2/3";
    } else {
      label = "Strong 🟢";
      color = "bg-success w-full";
    }
    setPasswordStrength({ score, label, color });
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    checkPasswordStrength(val);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signOut();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (role === "business" && !company.trim()) {
      errors.company = "Company name is required";
    }
    if (!agreedToTerms) {
      errors.terms = "You must agree to the terms and conditions";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the form errors first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      // Sign up via Supabase with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            company_name: role === "business" ? company : undefined,
            expert_domain: role === "expert" ? domain : undefined
          },
          emailRedirectTo: `${location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully!");
        
        // Wait briefly for trigger to finish profile insertions
        setTimeout(() => {
          if (role === "expert") {
            router.push("/expert/onboarding");
          } else {
            router.push("/onboarding/business");
          }
        }, 1000);
      }
    } catch (err) {
      toast.error("An unexpected error occurred during signup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?role=${role}`,
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-bg px-[20px] py-[40px] font-sans relative overflow-hidden">
      {/* CENTERED CARD (max-width 400px) */}
      <div className="bg-white border border-border rounded-xl p-[32px] w-full max-w-[400px] shadow-sm flex flex-col gap-[24px] relative z-10 animate-page-enter">
        
        {/* LOGO AND HEADER */}
        <div className="text-center flex flex-col items-center">
          <Link href="/" className="text-[26px] font-bold text-primary tracking-tight font-sans hover:opacity-90 transition-opacity">
            Sessionly<span className="text-accent">.</span>
          </Link>
          <h2 className="text-[22px] font-bold text-primary mt-[16px] tracking-tight">
            Create an account
          </h2>
          <p className="text-[14px] text-muted mt-[6px] font-medium">
            Join the expert marketplace
          </p>
        </div>

        {/* ROLE TOGGLE ROW */}
        <div className="grid grid-cols-2 p-[4px] bg-bg rounded-lg border border-border relative overflow-hidden">
          <button
            type="button"
            onClick={() => setRole("business")}
            className={`h-[36px] rounded-md text-[13px] font-semibold transition-all relative z-10 ${
              role === "business" 
                ? "text-accent font-bold" 
                : "text-muted hover:text-primary"
            }`}
          >
            I'm a Business
          </button>
          <button
            type="button"
            onClick={() => setRole("expert")}
            className={`h-[36px] rounded-md text-[13px] font-semibold transition-all relative z-10 ${
              role === "expert" 
                ? "text-accent font-bold" 
                : "text-muted hover:text-primary"
            }`}
          >
            I'm an Expert
          </button>
          
          <motion.div 
            className="absolute top-[4px] bottom-[4px] left-[4px] w-[calc(50%-4px)] bg-white rounded-md shadow-xs border border-border/60"
            animate={{
              x: role === "business" ? 0 : "100%"
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        </div>

        {/* Google SSO placed upfront */}
        <button 
          onClick={handleGoogleSignup}
          className="w-full h-[48px] border border-border rounded-lg flex items-center justify-center gap-[8px] text-[14px] font-semibold text-primary bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-[18px] h-[18px]" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-[12px]">
          <div className="flex-grow h-[1px] bg-border" />
          <span className="text-[11px] text-muted font-bold uppercase tracking-wider shrink-0">or</span>
          <div className="flex-grow h-[1px] bg-border" />
        </div>

        {/* SIGNUP FORM */}
        <form onSubmit={handleSignup} className="flex flex-col gap-[18px]">
          
          <Input 
            label="Full Name"
            type="text"
            placeholder="Siddharth Reddy"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={formErrors.fullName}
          />

          <Input 
            label="Work Email Address"
            type="email"
            placeholder="siddharth@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email}
          />

          <AnimatePresence mode="wait">
            {role === "business" ? (
              <motion.div
                key="business"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Input 
                  label="Company Name"
                  type="text"
                  placeholder="Acme Technologies"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  error={formErrors.company}
                />
              </motion.div>
            ) : (
              <motion.div
                key="expert"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-[6px]"
              >
                <label className="text-[13px] font-medium text-gray-700 select-none">Domain Expertise</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full h-[48px] px-[12px] border border-border rounded-lg text-[14px] text-primary font-medium bg-white outline-none transition-all duration-150 focus:border-accent focus:ring-2 focus:ring-accent/15"
                >
                  {DOMAINS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Input 
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={formErrors.password}
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
            
            {password.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5 animate-page-enter">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-muted">Password Strength</span>
                  <span className="text-primary font-bold">{passwordStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-bg border border-border rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} />
                </div>
              </div>
            )}
          </div>

          {/* Terms & Conditions Acceptance */}
          <div className="flex flex-col">
            <label className="flex items-start gap-[8px] cursor-pointer text-[13px] text-muted font-medium select-none">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-[4px] rounded border-border text-accent focus:ring-accent w-[16px] h-[16px]"
              />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>
            {formErrors.terms && <p className="text-[11px] text-danger font-semibold mt-[4px]">{formErrors.terms}</p>}
          </div>

          <Button 
            type="submit" 
            variant="primary"
            className="bg-primary hover:bg-primary/90 text-white rounded-lg h-[48px] font-semibold w-full mt-[6px] flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </>
            ) : "Sign Up with Email"}
          </Button>

        </form>

        {/* Sign in link */}
        <p className="text-center text-[14px] text-muted font-medium mt-2">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:text-accent-hover font-semibold transition-colors">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}
