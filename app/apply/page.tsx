"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, TrendingUp, Scale, Megaphone, Users, Lightbulb, ArrowRight, ArrowLeft, CheckCircle, Briefcase, Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";

const EXPERTISE_OPTIONS = [
  { id: "tech", label: "Engineering & Tech", icon: Code2, desc: "System Design, DevOps, Architecture" },
  { id: "finance", label: "Finance & CFO", icon: TrendingUp, desc: "Financial Modeling, Compliance, Series B" },
  { id: "legal", label: "Legal & Compliance", icon: Scale, desc: "Contracts, IP, Corporate Law" },
  { id: "marketing", label: "Growth & Marketing", icon: Megaphone, desc: "GTM, Performance, Brand Strategy" },
  { id: "hr", label: "People & HR", icon: Users, desc: "Talent Acquisition, Culture, Comp" },
  { id: "strategy", label: "Startup Strategy", icon: Lightbulb, desc: "Pitch Decks, Product Market Fit" },
];

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [rate, setRate] = useState(15000);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateStep2 = () => {
    if (!linkedinUrl && !email) {
      setError("Please provide either a LinkedIn URL or a Work Email.");
      return;
    }
    if (linkedinUrl && !linkedinUrl.includes("linkedin.com/")) {
      setError("Please provide a valid LinkedIn URL.");
      return;
    }
    if (email && !email.includes("@")) {
      setError("Please provide a valid Work Email.");
      return;
    }
    setError("");
    setStep(3);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => { setError(""); setStep(s => Math.max(s - 1, 1)); };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background aesthetics */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-primary transition-colors mb-8 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0 rounded-full" />
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 z-0 rounded-full" 
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {[1, 2, 3, 4].map(num => (
              <div 
                key={num} 
                className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 text-[14px] font-bold transition-all duration-300 ${step >= num ? 'bg-accent text-white shadow-md' : 'bg-surface text-muted border-2 border-border'}`}
              >
                {step > num ? <CheckCircle className="w-4 h-4" /> : num}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-8 md:p-12 min-h-[460px] flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-grow"
              >
                <span className="text-[12px] font-bold text-accent uppercase tracking-wider mb-2">Step 1 of 4</span>
                <h2 className="text-[28px] font-extrabold text-primary leading-tight tracking-tight">What's your domain?</h2>
                <p className="text-[15px] text-muted mt-2 mb-8">Sessionly is not just for tech. We accept top-tier professionals across all critical business functions.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {EXPERTISE_OPTIONS.map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={() => { setSelectedExpertise(opt.id); nextStep(); }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${selectedExpertise === opt.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50 hover:shadow-sm'}`}
                    >
                      <opt.icon className={`w-6 h-6 mb-3 ${selectedExpertise === opt.id ? 'text-accent' : 'text-muted'}`} />
                      <h4 className="text-[16px] font-bold text-primary">{opt.label}</h4>
                      <p className="text-[12px] text-muted mt-1 leading-snug">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-grow"
              >
                <span className="text-[12px] font-bold text-accent uppercase tracking-wider mb-2">Step 2 of 4</span>
                <h2 className="text-[28px] font-extrabold text-primary leading-tight tracking-tight">Identity Verification</h2>
                <p className="text-[15px] text-muted mt-2 mb-6">We strictly vet every expert to maintain our 1% quality standard. Provide your professional links for review.</p>
                
                <div className="flex flex-col gap-5 mt-2">
                  {error && <div className="bg-danger/10 text-danger text-[13px] p-3 rounded-md border border-danger/20 font-semibold">{error}</div>}
                  
                  <div>
                    <label className="block text-[12px] font-bold text-muted uppercase tracking-wider mb-1">LinkedIn Profile URL</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input 
                        type="url" 
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full h-[48px] pl-10 pr-4 rounded-md border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-[15px]"
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink-0 mx-4 text-muted text-[12px] uppercase tracking-wider font-bold">and / or</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-muted uppercase tracking-wider mb-1">Corporate Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-[48px] pl-10 pr-4 rounded-md border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-[15px]"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center">
                    <Button variant="ghost" onClick={prevStep}>Back</Button>
                    <Button variant="primary" onClick={validateStep2} className="px-8 shadow-md">Verify & Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-grow"
              >
                <span className="text-[12px] font-bold text-accent uppercase tracking-wider mb-2">Step 3 of 4</span>
                <h2 className="text-[28px] font-extrabold text-primary leading-tight tracking-tight">Value your time</h2>
                <p className="text-[15px] text-muted mt-2 mb-10">Set your base rate for a 60-minute micro-consultation. You can always change this later.</p>
                
                <div className="flex flex-col items-center justify-center flex-grow bg-bg rounded-xl p-8 border border-border">
                  <span className="text-[14px] text-muted uppercase tracking-wider font-bold mb-2">Your Session Rate</span>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-[32px] text-primary font-mono">₹</span>
                    <input 
                      type="number" 
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="text-[64px] font-bold text-accent bg-transparent border-none p-0 w-[240px] text-center focus:ring-0 appearance-none font-mono"
                    />
                  </div>
                  
                  <input 
                    type="range" 
                    min="5000" max="100000" step="1000"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full max-w-sm accent-accent"
                  />
                  
                  <div className="flex justify-between w-full max-w-sm mt-3 text-[12px] text-muted font-mono font-bold">
                    <span>₹5,000</span>
                    <span>₹1,00,000+</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <Button variant="ghost" onClick={prevStep}>Back</Button>
                  <Button variant="primary" onClick={nextStep} className="px-8 shadow-md">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center flex-grow text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-success" />
                </motion.div>
                <h2 className="text-[28px] font-extrabold text-primary leading-tight tracking-tight">Application Submitted</h2>
                <p className="text-[15px] text-muted mt-4 max-w-md">
                  Our vetting team will review your profile within 48 hours. Once approved, you'll be able to open your calendar, accept bookings, and start earning instantly.
                </p>
                
                <div className="bg-bg border border-border p-6 rounded-xl mt-8 w-full max-w-md text-left flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h5 className="font-bold text-primary text-[14px]">Ready to earn</h5>
                    <p className="text-[13px] text-muted mt-1">We handle the NDAs, GST invoicing, and payments. You just show up, solve the problem, and get paid.</p>
                  </div>
                </div>

                <Button variant="outline" className="mt-8 border-border text-primary hover:bg-bg rounded-lg h-[44px]" asChild>
                  <Link href="/">Return to Homepage</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
