"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import Link from 'next/link';
import { 
  Building2, 
  Receipt, 
  ShieldCheck, 
  Users, 
  Zap, 
  Check, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Calendar, 
  Clock, 
  BarChart3, 
  HelpCircle, 
  Loader2, 
  FileText, 
  Network, 
  Layers,
  MessageSquare
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  teamSize: string;
  useCase: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  useCase?: string;
}

export default function EnterprisePage() {
  // Form State
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    teamSize: '21-100',
    useCase: '',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [emailWarning, setEmailWarning] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);

  // Smooth scroll to request form
  const scrollToForm = () => {
    const element = document.getElementById('request-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Check email domain on blur
  const handleEmailBlur = () => {
    const email = formData.email.trim();
    if (!email) return;

    // Check basic format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
      setEmailWarning('');
      return;
    }

    // Check for public email domains
    const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'zoho.com', 'mail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (publicDomains.includes(domain)) {
      setEmailWarning('Please use your work email (e.g. name@company.com) for faster validation.');
    } else {
      setEmailWarning('');
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Work email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        tempErrors.email = 'Please enter a valid email address.';
      }
    }
    
    if (!formData.company.trim()) tempErrors.company = 'Company name is required.';
    if (!formData.useCase) tempErrors.useCase = 'Please select a primary need.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate server submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Slabs & Pricing Slabs data (simpler, readable copy)
  const feeSlabs = [
    {
      range: "Under ₹1 Lakh / Month",
      fee: "5.0%",
      badge: "Growth Tier",
      features: [
        "Standard Pre-call NDAs",
        "Shared Company Wallet",
        "GST Compliance Invoices",
        "Unlimited Teammate Invites"
      ]
    },
    {
      range: "₹1 Lakh - ₹5 Lakhs / Month",
      fee: "3.5%",
      badge: "Scale Tier",
      features: [
        "Everything in Growth",
        "Teammate Spend Limits",
        "Priority Email Support",
        "Custom NDA Uploads",
        "Detailed Spend Audit Logs"
      ]
    },
    {
      range: "Over ₹5 Lakhs / Month",
      fee: "2.0%",
      badge: "Enterprise Custom",
      features: [
        "Everything in Scale",
        "Custom Master Agreement (MSA)",
        "Dedicated Success Manager",
        "Interactive API Integrations",
        "Custom SLA Guarantees",
        "SAML Single Sign-On (SSO)"
      ]
    }
  ];

  const enterpriseFeatures = [
    {
      icon: <FileText size={24} className="text-teal" />,
      title: "Custom MSAs & NDAs",
      desc: "Prevent legal delays. Sign a corporate Master Service Agreement once, and NDAs are automatically signed before every consultation."
    },
    {
      icon: <Layers size={24} className="text-teal" />,
      title: "Granular Spend Controls",
      desc: "Set monthly spending limits and approval workflows per teammate to keep your budgets completely controlled."
    },
    {
      icon: <Receipt size={24} className="text-teal" />,
      title: "Consolidated Billing",
      desc: "Stop chasing employees for receipts. Fund a central wallet and get one consolidated tax invoice every month for your accounting."
    },
    {
      icon: <ShieldCheck size={24} className="text-teal" />,
      title: "Top 1% Vetted Advisors",
      desc: "Get instant access to verified Staff Engineers, fractional CFOs, and senior corporate attorneys who have passed our screening."
    },
    {
      icon: <Network size={24} className="text-teal" />,
      title: "API Calendar Booking",
      desc: "Connect expert calendars directly to your internal tools like Jira or Slack to book unblocking calls automatically."
    },
    {
      icon: <MessageSquare size={24} className="text-teal" />,
      title: "Dedicated Slack Channel",
      desc: "Get a private Slack channel with our support operations team for priority assistance and expert matching under 10 minutes."
    }
  ];

  const mockSlots = [
    "Today at 3:30 PM (IST)",
    "Tomorrow at 11:00 AM (IST)",
    "Tomorrow at 4:30 PM (IST)",
    "Monday at 10:00 AM (IST)"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans selection:bg-teal selection:text-white animate-page-enter">
      
      {/* 1. HERO SECTION (Dark Navy background with elegant grid) */}
      <section className="relative bg-[#0F2137] pt-[80px] pb-[100px] md:pt-[120px] md:pb-[140px] px-[20px] md:px-[48px] lg:px-[96px] overflow-hidden">
        {/* Decorative Grid Overlay & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.12)_0%,transparent_70%)] pointer-events-none rounded-full blur-[80px]" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[48px] items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="bg-[#1E3A5F] border border-teal/20 text-teal px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider mb-[20px]">
              Corporate Compliance Suite
            </span>
            
            <h1 className="text-[40px] md:text-[56px] font-extrabold text-white leading-[1.05] tracking-tight">
              Scale expert advice with simple, secure compliance.
            </h1>
            
            <p className="text-[17px] md:text-[19px] text-gray-300 mt-[24px] leading-relaxed max-w-[620px]">
              Unblock your builders instantly. Centralized team billing, automatic GST invoices, and pre-signed NDAs keep your finance and legal teams completely happy.
            </p>

            <div className="mt-[40px]">
              {/* Single primary CTA on this screen */}
              <Button size="lg" className="h-[56px] px-[36px] text-[16px] font-bold" onClick={scrollToForm}>
                Schedule a 15-Min briefing
              </Button>
            </div>
          </div>

          {/* Right CSS Mockup Column */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <div className="border border-gray-700/60 bg-[#112240] rounded-xl p-6 shadow-level-3 font-mono text-[11px] text-gray-300 w-full max-w-[420px] flex flex-col gap-4 relative overflow-hidden">
              {/* Radial glow in mockup */}
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-teal opacity-[0.08] blur-[40px] rounded-full pointer-events-none" />
              
              {/* Mockup Header */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal shrink-0 animate-pulse" />
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">Corporate Console</span>
                </div>
                <Badge variant="workspace">Enterprise Mode</Badge>
              </div>

              {/* Metric 1 */}
              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>Monthly Spend Limit</span>
                  <span className="text-white font-bold">₹3,42,000 / ₹5,00,000</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: '68.4%' }} />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex justify-between text-gray-400 py-1 border-y border-gray-800/40">
                <span>Active Team Members</span>
                <span className="text-white font-bold">42 Active Seats</span>
              </div>

              {/* Recent Sessions list */}
              <div className="flex flex-col gap-2.5">
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">GST-ITC Invoices Auto-Generated</span>
                
                {[
                  { name: "Siddharth S. (Staff Eng)", type: "Systems Architecture review", status: "GST Invoice Reclaimed" },
                  { name: "Neha M. (Design Lead)", type: "UX Audit consultation", status: "GST Invoice Reclaimed" },
                  { name: "Rohan K. (Counsel)", type: "Trademark Filing advisory", status: "GST Invoice Reclaimed" }
                ].map((session, i) => (
                  <div key={i} className="flex justify-between items-center bg-navy-700/30 border border-gray-800/50 rounded-lg p-2.5">
                    <div>
                      <p className="text-white font-semibold">{session.name}</p>
                      <p className="text-gray-400 text-[10px]">{session.type}</p>
                    </div>
                    <span className="bg-teal-500/10 text-teal text-[9px] font-bold uppercase py-0.5 px-2 rounded border border-teal/15">
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mockup Compliance Footer */}
              <div className="text-[10px] text-gray-400 flex items-center gap-1.5 pt-2 border-t border-gray-800">
                <span className="text-teal">✓</span> NDAs executed automatically before calls start.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VOLUME-BASED SLABS SECTION (Interactive pricing cards) */}
      <section className="py-[80px] md:py-[100px] px-[20px] md:px-[48px] lg:px-[96px] bg-white border-y border-gray-200">
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="bg-teal-50 text-teal px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider">
            Volume Discounts
          </span>
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#0F2137] tracking-tight mt-[16px]">
            Simple platform fee slabs that scale with you
          </h2>
          <p className="text-[16px] text-gray-500 max-w-[620px] mx-auto mt-[8px]">
            Reclaim your budget as usage grows. Zero setup fees, zero subscription costs — pay only for what you book.
          </p>

          {/* Slabs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mt-[48px] text-left">
            {feeSlabs.map((slab, idx) => (
              <div 
                key={idx} 
                className={`bg-white border rounded-[12px] p-[28px] flex flex-col justify-between transition-all ${
                  idx === 2 
                    ? 'border-2 border-teal shadow-level-2 relative' 
                    : 'border-gray-200 shadow-level-1 hover:shadow-level-2'
                }`}
              >
                {idx === 2 && (
                  <span className="absolute top-4 right-4 bg-teal text-white text-[9px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-wider">
                    Full Compliance Suite
                  </span>
                )}
                
                <div>
                  <div className="mb-[16px]">
                    <span className="bg-gray-100 text-gray-700 px-[8px] py-[2px] rounded text-[11px] font-bold uppercase tracking-wider">
                      {slab.badge}
                    </span>
                    <h4 className="text-[15px] font-bold text-gray-400 mt-[12px]">{slab.range}</h4>
                  </div>

                  <div className="my-[20px]">
                    <span className="text-[40px] font-extrabold text-[#0F2137] font-mono">{slab.fee}</span>
                    <span className="text-gray-400 font-semibold text-[14px] ml-[8px]">platform fee per session</span>
                  </div>

                  <div className="h-[1px] bg-gray-100 w-full my-[16px]" />

                  <ul className="space-y-[10px] text-[13.5px] text-gray-600 font-medium">
                    {slab.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-[8px]">
                        <Check className="w-[15px] h-[15px] text-teal mt-[3.5px] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ENTERPRISE CAPABILITIES GRID */}
      <section className="py-[80px] md:py-[100px] px-[20px] md:px-[48px] lg:px-[96px] bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[640px] mx-auto mb-[56px]">
            <span className="bg-teal-50 text-teal px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider">
              Control Center
            </span>
            <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#0F2137] tracking-tight mt-[16px]">
              Everything finance and legal teams need
            </h2>
            <p className="text-[16px] text-gray-500 mt-[8px]">
              Manage internal spending and external knowledge sharing safely with robust admin consoles.
            </p>
          </div>

          {/* 6-Card Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {enterpriseFeatures.map((feat, i) => (
              <div 
                key={i} 
                className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1 hover:shadow-level-2 transition-all group hover:-translate-y-1"
              >
                <div className="w-[48px] h-[48px] rounded-lg bg-teal-50 flex items-center justify-center mb-[24px] group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-[18px] font-bold text-[#0F2137] mb-[12px]">{feat.title}</h3>
                <p className="text-[14.5px] text-gray-500 leading-relaxed font-semibold">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE REQUEST DEMO SECTION */}
      <section id="request-form-section" className="py-[80px] md:py-[100px] px-[20px] md:px-[48px] lg:px-[96px] bg-[#0F2137] text-white relative overflow-hidden">
        {/* Grid and Radial backgrounds */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.08)_0%,transparent_60%)] pointer-events-none rounded-full blur-[90px]" />

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[48px] items-center relative z-10">
          
          {/* Left Text Briefing details */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <span className="bg-[#1E3A5F] border border-teal/20 text-teal px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider mb-[20px]">
              Briefing Request
            </span>
            <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight">
              Schedule a quick 15-minute briefing call
            </h2>
            <p className="text-gray-300 mt-[16px] text-[15px] leading-relaxed">
              We will help configure your corporate wallet, set up spending limits, and walk through custom Master Agreements.
            </p>

            <div className="mt-[32px] space-y-[20px] w-full">
              {[
                { title: "Personalized onboarding roadmap", text: "Configure centralized corporate wallet limits and invites." },
                { title: "MSA & Custom legal alignment", text: "Upload your company's NDAs or configure standard templates." },
                { title: "GST tax credit setup", text: "Confirm your GSTIN number to automate ITC collection." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-[16px] items-start">
                  <div className="w-[28px] h-[28px] rounded-full bg-teal/15 text-teal flex items-center justify-center shrink-0 mt-[2px] border border-teal/20 font-bold text-xs font-mono">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[15px]">{item.title}</h4>
                    <p className="text-[13px] text-gray-400 mt-[2px]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[40px] pt-[24px] border-t border-gray-800 text-[12px] text-gray-400 flex items-center gap-[8px]">
              <ShieldCheck className="text-teal" size={16} />
              Sessionly processes transactions securely and complies with SOC-2 guidelines.
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white text-[#0F2137] rounded-xl p-[32px] md:p-[40px] shadow-level-4 relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-[20px]"
                    noValidate
                  >
                    <div>
                      <h3 className="text-[22px] font-extrabold text-[#0F2137]">Request Enterprise Briefing</h3>
                      <p className="text-[13.5px] text-gray-400 font-medium mt-[2px]">Enter details and our product team will connect shortly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                      {/* Name input */}
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider" htmlFor="name">Full Name</label>
                        <input 
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Siddharth Sharma"
                          className={`h-[44px] px-[12px] rounded-[6px] border text-[14px] font-medium transition-all outline-none ${
                            errors.name ? 'border-red-500 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-teal'
                          }`}
                        />
                        {errors.name && <span className="text-[11px] text-red-500 font-semibold">{errors.name}</span>}
                      </div>

                      {/* Work Email input */}
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider" htmlFor="email">Work Email</label>
                        <input 
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleEmailBlur}
                          placeholder="siddharth@company.com"
                          className={`h-[44px] px-[12px] rounded-[6px] border text-[14px] font-medium transition-all outline-none ${
                            errors.email ? 'border-red-500 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-teal'
                          }`}
                        />
                        {errors.email && <span className="text-[11px] text-red-500 font-semibold">{errors.email}</span>}
                        {emailWarning && (
                          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-[4px] leading-tight mt-[4px]">
                            <AlertCircle size={12} className="shrink-0" />
                            {emailWarning}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                      {/* Company Name */}
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider" htmlFor="company">Company Name</label>
                        <input 
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Technologies"
                          className={`h-[44px] px-[12px] rounded-[6px] border text-[14px] font-medium transition-all outline-none ${
                            errors.company ? 'border-red-500 bg-red-50/20 focus:border-red-500' : 'border-gray-200 focus:border-teal'
                          }`}
                        />
                        {errors.company && <span className="text-[11px] text-red-500 font-semibold">{errors.company}</span>}
                      </div>

                      {/* Team Size */}
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider" htmlFor="teamSize">Team Size</label>
                        <select 
                          id="teamSize"
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleChange}
                          className="h-[44px] px-[12px] rounded-[6px] border border-gray-200 focus:border-teal text-[14px] font-medium bg-white transition-all outline-none"
                        >
                          <option value="5-20">5 - 20 employees</option>
                          <option value="21-100">21 - 100 employees</option>
                          <option value="101-500">101 - 500 employees</option>
                          <option value="500+">500+ employees</option>
                        </select>
                      </div>
                    </div>

                    {/* Primary Consultation Need */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider" htmlFor="useCase">Primary consultation need</label>
                      <select 
                        id="useCase"
                        name="useCase"
                        value={formData.useCase}
                        onChange={handleChange}
                        className={`h-[44px] px-[12px] rounded-[6px] border text-[14px] font-medium bg-white transition-all outline-none ${
                          errors.useCase ? 'border-red-500 bg-red-50/20' : 'border-gray-200 focus:border-teal'
                        }`}
                      >
                        <option value="">Select primary need...</option>
                        <option value="engineering">Engineering Architecture & Coding</option>
                        <option value="legal">Corporate Tax, Legal & Contracts</option>
                        <option value="finance">Fractional CFO & Budget Compliance</option>
                        <option value="product">Product Review, UX & Design Audits</option>
                        <option value="multiple">Combination / Full access</option>
                      </select>
                      {errors.useCase && <span className="text-[11px] text-red-500 font-semibold">{errors.useCase}</span>}
                    </div>

                    {/* Optional notes */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wider" htmlFor="notes">Additional Requirements (Optional)</label>
                      <textarea 
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="E.g., custom MSA approvals, individual limits, etc."
                        className="p-[12px] rounded-[6px] border border-gray-200 focus:border-teal text-[14px] font-medium transition-all outline-none resize-none"
                      />
                    </div>

                    {/* Form submit button */}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-[52px] font-bold mt-[12px] flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-[18px] h-[18px] animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <ArrowRight className="w-[16px] h-[16px]" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: 'spring', damping: 20 }}
                    className="flex flex-col items-center text-center py-[20px]"
                  >
                    {/* Scale bounce success checkmark */}
                    <div className="w-[64px] h-[64px] rounded-full bg-teal-50 flex items-center justify-center mb-[20px]">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      >
                        <Check size={32} className="text-teal" />
                      </motion.div>
                    </div>

                    <h3 className="text-[24px] font-extrabold text-[#0F2137]">Briefing Request Received!</h3>
                    <p className="text-[14px] text-gray-500 font-semibold max-w-[480px] mt-[8px]">
                      Thank you, {formData.name.split(' ')[0]}. We have sent an email confirmation and a corporate deck to <span className="text-[#0F2137] font-bold">{formData.email}</span>.
                    </p>

                    <div className="h-[1px] bg-gray-100 w-full my-[24px]" />

                    {/* Direct Mock Calendar booking for extreme high fidelity */}
                    <div className="w-full flex flex-col items-stretch text-left">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-[12px] block text-center">
                        Secure your briefing time slot instantly
                      </span>
                      
                      {!bookedSlot ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                          {mockSlots.map((slot, i) => (
                            <button 
                              key={i}
                              onClick={() => setBookedSlot(slot)}
                              className="border border-gray-200 hover:border-teal rounded-lg p-[12px] text-left hover:bg-teal-50/20 transition-all font-semibold text-[13px] text-[#0F2137] flex items-center gap-[8px]"
                            >
                              <Calendar size={14} className="text-teal shrink-0" />
                              <span>{slot}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-teal-50 border border-teal/15 text-teal p-[16px] rounded-lg text-center font-bold text-[14px]"
                        >
                          <span className="block mb-1">📅 Meeting Confirmed: {bookedSlot}</span>
                          <span className="text-[12px] text-teal-600 font-semibold">Google Meet links have been sent to {formData.email}</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
