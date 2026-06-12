"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Clock, Timer, Video, Lock, Upload, ShieldCheck, ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function BookingFlowPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [problemStatement, setProblemStatement] = useState("");
  const [ndaSigned, setNdaSigned] = useState(false);

  const expert = {
    name: "Arjun Sharma",
    title: "Staff Engineer",
    rate: 15000,
    fee: 3000,
    gst: 3240,
    total: 21240,
  };

  return (
    <div className="bg-surface-DEFAULT min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-DEFAULT/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-navy-DEFAULT/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Single-Screen Card */}
      <div className="bg-white border border-border shadow-2xl rounded-[24px] w-full max-w-[1000px] flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[600px] max-h-[85vh]">
        
        {/* LEFT WIZARD CONTENT (65%) */}
        <div className="w-full md:w-[65%] flex flex-col h-full bg-white relative">
          
          {/* Header & Progress */}
          <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
            <Link href="/" className="flex items-center gap-2 text-[14px] text-text-sub hover:text-navy-DEFAULT transition-colors">
              <ArrowLeft className="w-4 h-4" /> Cancel
            </Link>
            <div className="flex gap-2">
              {[1, 2, 3].map(step => (
                <div key={step} className={`h-1.5 w-8 rounded-full transition-colors ${currentStep >= step ? 'bg-teal-DEFAULT' : 'bg-surface-2'}`} />
              ))}
            </div>
          </div>

          {/* Interactive Steps */}
          <div className="flex-1 overflow-y-auto px-8 py-8 relative no-scrollbar">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: PROBLEM */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  <h3 className="text-[28px] font-semibold text-navy-DEFAULT leading-tight">Describe your blocker</h3>
                  <p className="text-[14px] text-text-sub mt-2">Shared securely with Arjun 24 hours before your session.</p>
                  
                  <div className="mt-6 flex-1 flex flex-col">
                    <textarea
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      placeholder="e.g. We're running a multi-tenant SaaS on a single RDS instance. Under peak load our P95 latency spikes..."
                      className="flex-1 min-h-[160px] p-4 text-[15px] text-text-body bg-surface-DEFAULT border border-border rounded-[12px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 resize-none"
                    />
                    
                    <div className="mt-4 border-2 border-dashed border-border rounded-[12px] p-6 flex flex-col items-center justify-center text-center hover:bg-surface-2 cursor-pointer transition-colors bg-white">
                      <Upload className="w-6 h-6 text-text-muted mb-2" />
                      <span className="text-[14px] text-text-sub font-medium">Upload architecture diagrams or docs</span>
                      <span className="text-[12px] text-text-disabled mt-1">PDF, PNG, JPG (Max 10MB)</span>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button size="lg" onClick={() => setCurrentStep(2)} disabled={problemStatement.length < 20} className="w-full sm:w-auto shadow-md">
                        Continue to NDA <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: NDA */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                  <h3 className="text-[28px] font-semibold text-navy-DEFAULT leading-tight">Mutual NDA</h3>
                  <p className="text-[14px] text-text-sub mt-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-DEFAULT" /> Automatically protects both parties' IP.
                  </p>

                  <div className="mt-6 flex-1 flex flex-col">
                    <div className="flex-1 relative border border-border rounded-[12px] overflow-hidden bg-surface-DEFAULT">
                      <div className="absolute inset-0 overflow-y-auto p-6 text-[13px] text-text-sub leading-relaxed no-scrollbar">
                        <h4 className="font-bold text-[14px] mb-4 text-navy-DEFAULT">NON-DISCLOSURE AGREEMENT</h4>
                        <p className="mb-4">This Non-Disclosure Agreement is entered into by and between the User ("Company") and the Expert ("Expert") via the Hourly Platform.</p>
                        <p className="font-semibold mb-2 text-navy-DEFAULT">1. Confidential Information</p>
                        <p className="mb-4">"Confidential Information" means any and all information disclosed by either party to the other, which is marked "confidential" or which should reasonably be understood to be confidential.</p>
                        <p className="font-semibold mb-2 text-navy-DEFAULT">2. Obligations</p>
                        <p className="mb-4">Each party agrees to hold the other's Confidential Information in strict confidence and to take all reasonable precautions to protect such Confidential Information.</p>
                        <p className="font-semibold mb-2 text-navy-DEFAULT">3. Term & Law</p>
                        <p className="mb-8">Obligations survive for 2 years. Governed by the Indian Contract Act 1872.</p>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-surface-DEFAULT to-transparent pointer-events-none" />
                    </div>

                    <label className="mt-4 flex items-start gap-3 p-4 border border-teal-DEFAULT/20 bg-teal-bg rounded-[12px] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={ndaSigned}
                        onChange={(e) => setNdaSigned(e.target.checked)}
                        className="mt-0.5 w-5 h-5 accent-teal-DEFAULT rounded cursor-pointer" 
                      />
                      <span className="text-[13px] text-navy-DEFAULT font-medium">
                        I agree to the terms of the Mutual NDA. This constitutes a legally binding electronic signature.
                      </span>
                    </label>

                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)} className="px-6">Back</Button>
                      <Button size="lg" onClick={() => setCurrentStep(3)} disabled={!ndaSigned} className="flex-1 shadow-md">Sign & Continue</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full items-center justify-center text-center">
                  <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-6">
                    <CreditCard className="w-8 h-8 text-navy-DEFAULT" />
                  </div>
                  <h3 className="text-[28px] font-semibold text-navy-DEFAULT leading-tight">Secure Checkout</h3>
                  <p className="text-[14px] text-text-sub mt-2 max-w-sm">Funds are held in escrow until the session is completed successfully.</p>
                  
                  <div className="w-full max-w-sm mt-8 space-y-3">
                    <Button size="lg" className="w-full bg-navy-DEFAULT text-white hover:bg-navy-dark h-14">Pay via Corporate Wallet</Button>
                    <Button size="lg" variant="outline" className="w-full h-14">Pay via UPI / Card</Button>
                  </div>

                  <Button variant="ghost" className="mt-8" onClick={() => setCurrentStep(2)}>Back to NDA</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT SUMMARY PANEL (35%) */}
        <div className="w-full md:w-[35%] bg-surface-DEFAULT border-l border-border p-8 flex flex-col">
          <h4 className="text-[18px] font-semibold text-navy-DEFAULT mb-6">Session Summary</h4>
          
          <div className="flex gap-4 pb-6 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-teal-bg flex items-center justify-center font-bold text-teal-DEFAULT text-[18px]">
              {expert.name.charAt(0)}
            </div>
            <div>
              <h5 className="text-[15px] font-semibold text-navy-DEFAULT">{expert.name}</h5>
              <p className="text-[12px] text-text-sub">{expert.title}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 flex-1">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Date</p>
                <p className="text-[14px] font-medium text-navy-DEFAULT">Thu, 12 Jun 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Time</p>
                <p className="text-[14px] font-medium text-navy-DEFAULT">10:00 AM IST</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Format</p>
                <p className="text-[14px] font-medium text-navy-DEFAULT">60 Min Video Call</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[13px] text-text-sub">
                <span>Expert rate</span>
                <span className="font-mono">₹{expert.rate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[13px] text-text-sub">
                <span>GST (18%)</span>
                <span className="font-mono">₹{expert.gst.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[18px] font-bold text-navy-DEFAULT bg-white p-4 rounded-xl border border-border shadow-sm">
              <span>Total</span>
              <span className="font-mono">₹{expert.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="mt-4 flex justify-center items-center gap-1.5 text-[11px] text-text-disabled">
              <Lock className="w-3 h-3" /> 256-bit encrypted checkout
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
