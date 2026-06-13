"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import Link from "next/link";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";
import { 
  Search, 
  Calendar, 
  ShieldCheck, 
  Video, 
  ArrowRight, 
  Check, 
  Lock, 
  Star,
  Users
} from 'lucide-react';

interface Step {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  previewContent: React.ReactNode;
}

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      id: "find",
      icon: <Search size={22} />,
      title: "1. Find your expert",
      description: "Browse verified Staff Engineers, Fractional CFOs, and Legal Counsel. Filter by precise technical skills, state-level tax codes, and session rates.",
      previewContent: (
        <div className="w-full h-full flex flex-col gap-4 p-6 bg-white rounded-xl select-none">
          {/* Mock search input */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <Search size={14} className="text-gray-400" />
            <div className="w-[120px] h-3 bg-gray-200 rounded animate-pulse" />
          </div>

          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Matched Advisors (2)</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                name: "Rahul M.",
                role: "ex-Stripe Tech Lead",
                rate: "₹1,499/session",
                rating: "4.9",
                skills: ["API Design", "Distributed Systems"]
              },
              {
                name: "Meera K.",
                role: "ex-Razorpay Lawyer",
                rate: "₹1,299/session",
                rating: "5.0",
                skills: ["GST Audit", "B2B Compliance"]
              }
            ].map((exp, idx) => (
              <div key={idx} className="border border-border rounded-lg p-3 flex flex-col gap-2 bg-bg/50 shadow-sm relative overflow-hidden">
                {SHOW_RATINGS_AND_REVIEWS && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-[#FFFBEB] text-[#F59E0B] text-[10px] font-bold px-1 py-0.5 rounded">
                  <Star size={8} fill="currentColor" />
                  {exp.rating}
                </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/5 text-accent flex items-center justify-center font-bold text-xs border border-accent/10">
                    {exp.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-primary text-xs">{exp.name}</h5>
                    <p className="text-muted text-[10px]">{exp.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {exp.skills.map((s, i) => (
                    <span key={i} className="text-[8px] font-bold bg-bg text-muted py-0.5 px-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="h-[1px] bg-border my-1 w-full" />
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-accent">{exp.rate}</span>
                  <span className="text-muted text-[9px]">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "book",
      icon: <Calendar size={22} />,
      title: "2. Book a session",
      description: "Pick an available time slot directly synced with the expert's calendar. Book a 30 or 60-minute unblocking call or scheduled consultation.",
      previewContent: (
        <div className="w-full h-full flex flex-col p-6 bg-white rounded-xl select-none">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-primary">Rahul M. &gt; Calendar slots</span>
            <span className="text-[10px] text-muted font-semibold font-mono">February 2026</span>
          </div>

          {/* Mini Calendar Row */}
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] mb-3 font-semibold">
            {["Mon 9", "Tue 10", "Wed 11", "Thu 12", "Fri 13"].map((day, i) => (
              <div key={i} className={`p-1.5 rounded border ${i === 2 ? 'border-accent bg-accent/5 text-accent font-bold' : 'border-border text-muted'}`}>
                {day}
              </div>
            ))}
          </div>

          <span className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Available times</span>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] text-center">
            {["10:00 AM", "11:30 AM (Selected)", "2:00 PM", "3:30 PM"].map((time, i) => (
              <div 
                key={i} 
                className={`py-2 rounded border font-semibold transition-all ${
                  i === 1 
                    ? 'border-2 border-accent bg-accent text-white shadow-sm' 
                    : 'border-border text-primary hover:border-accent/40 cursor-pointer'
                }`}
              >
                {time.replace(" (Selected)", "")}
              </div>
            ))}
          </div>

          <div className="mt-4 bg-accent h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-bold cursor-pointer hover:bg-accent-hover transition-colors shadow-sm">
            Proceed to Checkout
          </div>
        </div>
      )
    },
    {
      id: "pay",
      icon: <ShieldCheck size={22} />,
      title: "3. Secure escrow payment",
      description: "Funds are deducted from your central corporate wallet and held in a secure vault. Payment is only confirmed after the session successfully completes.",
      previewContent: (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 bg-white rounded-xl relative overflow-hidden select-none">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-accent/5 text-accent px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-accent/15">
            <Lock size={10} /> Escrow Vault Secure
          </div>

          <div className="flex flex-col items-center gap-4 text-center mt-4 w-full max-w-[260px]">
            {/* Escrow visual block */}
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing rings */}
              <div className="absolute w-20 h-20 bg-accent/10 rounded-full animate-ping" />
              <div className="absolute w-24 h-24 bg-accent/5 rounded-full animate-pulse" />
              
              <div className="w-16 h-16 bg-accent/5 border-2 border-accent rounded-full flex items-center justify-center text-accent relative z-10 shadow-sm">
                <ShieldCheck size={32} />
              </div>
            </div>

            <div>
              <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Transaction State</p>
              <h5 className="font-bold text-primary text-sm mt-0.5">₹1,499 escrow hold</h5>
              <p className="text-muted text-[10px] mt-1 leading-normal font-semibold">
                Released automatically once the session has finished. Reclaims 18% GST input tax credit for finance.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "connect",
      icon: <Video size={22} />,
      title: "4. Connect and unblock",
      description: "Join the HD video workspace directly from your dashboard. Collaborate using screen share, shared code editors, and live note-taking.",
      previewContent: (
        <div className="w-full h-full bg-[#1E293B] rounded-xl flex flex-col overflow-hidden relative select-none">
          {/* Main video area representing expert */}
          <div className="flex-grow flex items-center justify-center text-center p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold border border-white/20 text-sm">
                R
              </div>
              <div>
                <p className="text-white font-bold text-xs">Rahul M.</p>
                <p className="text-white/40 text-[9px] font-mono">Sharing systems_architecture.pdf</p>
              </div>
            </div>
          </div>

          {/* Pin Picture-in-Picture representing User */}
          <div className="absolute bottom-12 right-3 w-16 h-20 bg-[#334155] rounded border border-white/20 overflow-hidden flex items-center justify-center">
            <span className="text-[9px] font-bold text-white/50">You</span>
          </div>

          {/* Call actions bottom bar */}
          <div className="h-10 bg-[#0F172A] border-t border-white/5 flex items-center justify-center gap-3 px-4">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-[8px] font-bold">🎙</div>
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-[8px] font-bold">📹</div>
            <div className="bg-accent text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Sharing Screen
            </div>
            <div className="w-6 h-5 rounded bg-red-500 flex items-center justify-center text-white text-[8px] font-bold">📵</div>
          </div>
        </div>
      )
    }
  ];

  const timelineSteps = [
    {
      time: "T - 15 mins",
      title: "Slack & Email Reminders",
      desc: "Slack notifications and email reminders with direct room links are sent automatically to keep both parties ready."
    },
    {
      time: "T - 5 mins",
      title: "Workspace Opens",
      desc: "The secure video workspace container initializes, activating shared code notepad and collaborative workspace logs."
    },
    {
      time: "T - 0 mins",
      title: "Consultation Starts",
      desc: "Call begins. Screen share to debug code, review CA worksheets, audit legal drafts, or discuss design improvements."
    },
    {
      time: "T + 60 mins",
      title: "GST Invoicing & Release",
      desc: "Session ends. GST B2B invoice is auto-generated for your tax audits, and the escrow is released to the advisor."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans selection:bg-accent selection:text-white animate-page-enter">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-white pt-[64px] pb-[48px] md:pt-[80px] md:pb-[64px] px-[20px] md:px-[48px] lg:px-[96px] border-b border-border">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="bg-accent/5 text-accent px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider">
            Clear, simple workflow
          </span>
          
          <h1 className="text-[40px] md:text-[56px] font-extrabold text-primary tracking-tight mt-[16px] leading-[1.05]">
            How Sessionly works
          </h1>
          
          <p className="text-[17px] md:text-[19px] text-muted max-w-[680px] mx-auto mt-[16px] leading-relaxed font-medium">
            Get help from top-tier Staff Engineers, Fractional CFOs, and senior attorneys in four simple, compliant steps.
          </p>
        </div>
      </section>

      {/* 2. INTERACTIVE STEP SWITCHER PANEL */}
      <section className="py-[64px] md:py-[80px] px-[20px] md:px-[48px] lg:px-[96px] bg-white border-b border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[48px] items-center">
            
            {/* Left Column: Vertical Steps Selector */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {steps.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div 
                    key={step.id}
                    onMouseEnter={() => setActiveStep(idx)}
                    onClick={() => setActiveStep(idx)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex gap-4 items-start ${
                      isActive 
                        ? 'border-accent bg-accent/5' 
                        : 'border-transparent hover:bg-bg/50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-accent text-white shadow-sm' 
                        : 'bg-bg text-muted'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className={`text-[16px] font-bold transition-colors ${
                        isActive ? 'text-primary' : 'text-muted'
                      }`}>
                        {step.title}
                      </h4>
                      <p className={`text-[13.5px] leading-relaxed font-semibold transition-all duration-300 mt-1 ${
                        isActive ? 'text-muted h-auto opacity-100' : 'text-muted/60 h-0 opacity-0 lg:h-auto lg:opacity-100 overflow-hidden'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Live Mock Browser Frame Preview */}
            <div className="lg:col-span-6 w-full flex justify-center items-center">
              <div className="w-full max-w-[460px] h-[340px] bg-bg border border-border rounded-2xl p-4 shadow-sm overflow-hidden flex items-center justify-center relative">
                {/* Simulated browser navigation dots */}
                <div className="absolute top-3 left-4 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="w-full h-full mt-4 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.05, y: -15 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      {steps[activeStep].previewContent}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. B2B COMPLIANCE & ESCROW TRUST BANNER */}
      <section className="py-[64px] px-[20px] md:px-[48px] lg:px-[96px] bg-bg border-b border-border">
        <div className="max-w-[1000px] mx-auto bg-white border border-border rounded-xl p-[32px] md:p-[48px] shadow-sm flex flex-col md:flex-row gap-[32px] items-center justify-between">
          <div className="flex flex-col gap-2 max-w-[520px]">
            <span className="bg-accent/5 text-accent px-[10px] py-[3px] rounded-full text-[11px] font-bold uppercase tracking-wider self-start flex items-center gap-1 border border-accent/10">
              <Lock size={12} /> Escrow Protection
            </span>
            <h3 className="text-[22px] font-bold text-primary mt-[6px]">Secure payments and automated GST invoicing</h3>
            <p className="text-[14px] text-muted leading-relaxed font-semibold">
              All transactions are secured inside our central escrow vault. Once a call is completed, the payment is released and a valid GST tax invoice is automatically generated for your company.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-[12px] w-full md:w-auto font-semibold">
            <div className="flex items-center gap-[10px] text-[13px] text-primary">
              <Check className="text-accent shrink-0" size={16} /> Reclaim 18% GST Input Credit
            </div>
            <div className="flex items-center gap-[10px] text-[13px] text-primary">
              <Check className="text-accent shrink-0" size={16} /> Standard corporate NDAs pre-signed
            </div>
            <div className="flex items-center gap-[10px] text-[13px] text-primary">
              <Check className="text-accent shrink-0" size={16} /> Instant refunds on cancellations
            </div>
          </div>
        </div>
      </section>

      {/* 4. GRANULAR CALL LIFECYCLE TIMELINE */}
      <section className="py-[80px] md:py-[100px] px-[20px] md:px-[48px] lg:px-[96px] bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[600px] mx-auto mb-[56px]">
            <span className="bg-accent/5 text-accent px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider">
              session timeline
            </span>
            <h2 className="text-[32px] md:text-[40px] font-extrabold text-primary tracking-tight mt-[16px]">
              Frictionless B2B unblocking timeline
            </h2>
            <p className="text-[16px] text-muted mt-[8px] font-semibold">
              How we manage the schedule of your consultation from booking to invoicing.
            </p>
          </div>

          {/* Timeline Process Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px] relative">
            {/* Desktop horizontal timeline bar indicator */}
            <div className="hidden md:block absolute top-[44px] left-[5%] right-[5%] h-[1px] bg-border pointer-events-none z-0" />
            
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
                <div className="w-[88px] h-[36px] bg-accent/5 border border-accent/20 text-accent rounded-full flex items-center justify-center font-bold text-[13px] mb-[16px] shadow-sm font-mono">
                  {step.time}
                </div>
                <h4 className="text-[16px] font-bold text-primary mb-[8px]">{step.title}</h4>
                <p className="text-[13.5px] text-muted leading-relaxed font-semibold max-w-[260px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (CTA) PANEL */}
      <section className="py-[80px] px-[20px] md:px-[48px] lg:px-[96px] bg-primary text-white relative overflow-hidden">
        {/* Grid and Radial backgrounds */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_60%)] pointer-events-none rounded-full blur-[90px]" />

        <div className="max-w-[800px] mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold tracking-tight">
            Ready to unblock your team?
          </h2>
          <p className="text-gray-300 mt-[16px] text-[16px] md:text-[18px] max-w-[580px] leading-relaxed">
            Gain immediate access to top-tier Staff Engineers, Fractional CAs, and attorneys.
          </p>

          <div className="flex flex-col sm:flex-row gap-[16px] mt-[40px] w-full sm:w-auto justify-center">
            {/* Single primary CTA on this CTA screen */}
            <Button size="lg" className="h-[52px] px-[32px] text-[15px] font-bold bg-accent hover:bg-accent-hover text-white border-none rounded-lg" asChild>
              <Link href="/experts">Find an Expert</Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-[52px] px-[32px] text-[15px] border-gray-600 text-white hover:bg-white hover:text-primary rounded-lg" 
              asChild
            >
              <Link href="/apply">Apply as Expert</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
