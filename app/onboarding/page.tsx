"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Toast } from '../../utils/toast';

export default function Onboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { submitClientOnboarding } = await import('@/app/actions/client');
      const formData = new FormData(e.currentTarget);
      
      const response = await submitClientOnboarding(formData);
      
      if (response && response.error) {
        Toast.error(response.error);
      } else {
        Toast.success('Workspace created successfully!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      Toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-DEFAULT flex flex-col font-sans selection:bg-teal-DEFAULT selection:text-white">
      {/* Header */}
      <header className="h-[80px] bg-white border-b border-border flex items-center px-6 md:px-12 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-bold text-navy-DEFAULT font-serif italic">Hourly.</span>
          <span className="bg-surface-2 text-text-sub px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">Business Setup</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 py-12 relative overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-DEFAULT/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[560px] bg-white rounded-3xl border border-border p-8 md:p-12 shadow-sm relative z-10"
        >
          <div className="mb-10 text-center">
            <h1 className="text-[32px] font-bold text-navy-DEFAULT mb-3 tracking-tight">Set up your workspace</h1>
            <p className="text-[16px] text-text-sub">Tell us a bit about your company to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">Company Name <span className="text-red-500">*</span></label>
              <input 
                name="companyName"
                type="text" 
                required
                className="w-full h-[52px] px-4 rounded-[8px] border border-border focus:border-teal-DEFAULT focus:ring-4 focus:ring-teal-DEFAULT/20 outline-none transition-all text-[15px]"
                placeholder="e.g. Acme Corp"
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">GSTIN <span className="text-text-muted font-normal ml-1">(Optional)</span></label>
              <input 
                name="gstin"
                type="text" 
                className="w-full h-[52px] px-4 rounded-[8px] border border-border focus:border-teal-DEFAULT focus:ring-4 focus:ring-teal-DEFAULT/20 outline-none transition-all text-[15px]"
                placeholder="Required for GST invoice generation"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">Company Size</label>
                <select name="companySize" className="w-full h-[52px] px-4 rounded-[8px] border border-border focus:border-teal-DEFAULT focus:ring-4 focus:ring-teal-DEFAULT/20 outline-none transition-all text-[15px] bg-white appearance-none">
                  <option>1–10 employees</option>
                  <option>11–50 employees</option>
                  <option>51–200 employees</option>
                  <option>200+ employees</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">Your Role</label>
                <select name="role" className="w-full h-[52px] px-4 rounded-[8px] border border-border focus:border-teal-DEFAULT focus:ring-4 focus:ring-teal-DEFAULT/20 outline-none transition-all text-[15px] bg-white appearance-none">
                  <option>Founder / CEO</option>
                  <option>CTO / Engineering Lead</option>
                  <option>CFO / Finance Lead</option>
                  <option>HR / Operations</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="bg-teal-bg border border-teal-light rounded-xl p-4 flex items-start gap-3 mt-8">
              <CheckCircle2 className="w-5 h-5 text-teal-DEFAULT shrink-0 mt-0.5" />
              <p className="text-[13px] text-teal-dark font-medium leading-relaxed">
                You can invite team members and set spending limits from the admin dashboard later.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full h-[56px] mt-8 text-[16px] group" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Workspace...' : 'Complete Setup'} 
              {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
