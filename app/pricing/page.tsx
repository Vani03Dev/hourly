"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Check, ChevronDown, ChevronUp, Landmark, Building2, UserCircle,
  ArrowRight, Sparkles, Clock, IndianRupee
} from "lucide-react";
import Link from "next/link";
import { SlideUp, staggerContainer, staggerItem } from "@/components/shared/MotionWrapper";

type PlanId = "standard" | "enterprise";
type Audience = "business" | "expert";
type Duration = 15 | 30 | 60;

const SPEND_PRESETS = [25000, 50000, 100000, 250000];

const STANDARD_FEATURES = [
  "Unlimited team members & manager invites",
  "Access to top 1% vetted Indian advisors",
  "Consolidated B2B compliance GST invoicing",
  "Interactive Shared Corporate Wallet",
  "Standardized NDAs auto-signed before every call",
];

const ENTERPRISE_FEATURES = [
  "Custom platform fee brackets (as low as 2%)",
  "Dedicated Customer Success Manager",
  "Priority Slack integration channel",
  "Custom Master Service Agreements (MSAs)",
  "Advanced API access for automated matching",
  "Detailed spend dashboard audit logs",
];

const PLANS = [
  {
    id: "standard" as PlanId,
    name: "Standard Workspace",
    subtitle: "For fast-growing startups & builders",
    price: "5%",
    priceSuffix: "platform fee per session",
    badge: "Free Setup",
    badgeVariant: "workspace" as const,
    cta: "Get Started Free",
    href: "/auth/signup?role=business",
    features: STANDARD_FEATURES,
    highlighted: false,
  },
  {
    id: "enterprise" as PlanId,
    name: "Enterprise Plan",
    subtitle: "For scaling teams requiring custom controls",
    price: "Custom",
    priceSuffix: "based on booking volume",
    badge: "Popular for Scale",
    badgeVariant: null,
    cta: "Talk to Sales",
    href: "/enterprise",
    features: ENTERPRISE_FEATURES,
    highlighted: true,
  },
];

function AnimatedValue({ value, prefix = "₹" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const duration = 400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}{display.toLocaleString("en-IN")}
    </span>
  );
}

export default function PricingPage() {
  const [activePlan, setActivePlan] = useState<PlanId>("standard");
  const [audience, setAudience] = useState<Audience>("business");
  const [monthlySpend, setMonthlySpend] = useState(50000);
  const [hourlyRate, setHourlyRate] = useState(2000);
  const [duration, setDuration] = useState<Duration>(30);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const platformFee = Math.round(monthlySpend * 0.05);
  const totalBilled = monthlySpend + platformFee;
  const gstCredit = Math.round(totalBilled * 0.18);
  const netCost = Math.round(totalBilled - gstCredit);
  const netSaving = Math.round(gstCredit - platformFee);

  const sessionBase = Math.round(hourlyRate * (duration / 60));
  const sessionFee = Math.round(sessionBase * 0.05);
  const expertEarns = sessionBase - sessionFee;

  const selectedPlan = PLANS.find((p) => p.id === activePlan)!;

  const faqs = [
    {
      q: "How does the 18% GST Input Tax Credit (ITC) recovery work?",
      a: "Sessionly is a registered corporate platform. For every session booked by your team, we auto-generate a valid B2B tax invoice containing your company's GSTIN and state code. Since expert consultation qualifies as a legitimate business expense, your finance team can offset this 18% GST against your output tax liabilities.",
    },
    {
      q: "Are there any hidden monthly subscription fees?",
      a: "No. The Standard Workspace has zero monthly base fees, zero user license costs, and zero signup fees. You only pay for the exact session minutes your team books, plus a flat 5% platform fee. If you don't book any sessions, you pay absolutely nothing.",
    },
    {
      q: "How is expert quality verified?",
      a: "Only the top 1% of Indian professionals pass our vetting filters. We check candidates' professional backgrounds, verify identities, and ensure they have a history of unblocking complex organizational problems.",
    },
    {
      q: "Can I allocate individual budget limits for my team?",
      a: "Yes. From the Admin Settings Console, you can allocate unique monthly spending limits and booking thresholds for each teammate, preventing budget overruns while ensuring they can get instant help when blocked.",
    },
    {
      q: "What payment methods are supported for the corporate wallet?",
      a: "We support instant corporate loads via UPI, NetBanking (all major Indian banks), and Corporate Credit/Debit cards. You can pre-fund a central team wallet or authorize direct UPI checkout.",
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-bg pt-12 pb-24 px-5 md:px-12 lg:px-24 font-sans">
      <div className="max-w-[1100px] mx-auto w-full">

        <SlideUp>
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 bg-teal-50 text-accent px-3 py-1 rounded-full text-caption">
              <Sparkles size={14} /> Transparent pricing
            </span>
            <h1 className="text-h1 text-primary mt-4">
              Transparent Pricing. Built for compliance.
            </h1>
            <p className="text-body-l text-muted mt-3">
              Vetted experts set their rates. Pay a flat 5% platform fee. Auto-generate compliant GST invoices.
            </p>
          </div>
        </SlideUp>

        {/* Audience toggle */}
        <SlideUp delay={0.05}>
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-white border border-border rounded-[12px] shadow-sm">
              {([
                { id: "business" as Audience, label: "Book sessions", icon: Building2 },
                { id: "expert" as Audience, label: "Offer expertise", icon: UserCircle },
              ]).map((tab) => {
                const Icon = tab.icon;
                const isActive = audience === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAudience(tab.id)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-bold transition-colors outline-none focus:outline-none ${
                      isActive ? "text-white" : "text-muted hover:text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="pricing-audience-pill"
                        className="absolute inset-0 bg-accent rounded-[10px]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon size={16} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </SlideUp>

        {/* Plan cards — selectable */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8%" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14"
        >
          {PLANS.map((plan) => {
            const isSelected = activePlan === plan.id;
            return (
              <motion.button
                key={plan.id}
                type="button"
                variants={staggerItem}
                onClick={() => setActivePlan(plan.id)}
                whileHover={{ y: -4 }}
                className={`text-left bg-white rounded-[16px] p-8 flex flex-col justify-between relative overflow-hidden transition-shadow outline-none focus:outline-none ${
                  isSelected
                    ? "border-2 border-accent shadow-lg ring-4 ring-accent/10"
                    : "border border-border shadow-sm hover:border-accent/30 hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute top-4 right-4 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-h4 text-primary">{plan.name}</h3>
                      <p className="text-body-s font-semibold mt-1">{plan.subtitle}</p>
                    </div>
                    {!plan.highlighted && plan.badgeVariant && (
                      <Badge variant={plan.badgeVariant}>{plan.badge}</Badge>
                    )}
                  </div>

                  <div className="my-6">
                    <span className={`text-price-xl ${plan.highlighted ? "text-accent" : ""}`}>
                      {plan.price}
                    </span>
                    <span className="text-muted font-semibold text-[15px] ml-2">{plan.priceSuffix}</span>
                  </div>

                  <div className="h-px bg-border w-full my-4" />

                  <ul className="space-y-3">
                    {plan.features.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-body-s font-semibold">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-accent" : "text-muted"}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="mt-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="lg"
                    className={`w-full h-12 font-semibold rounded-[10px] ${
                      plan.highlighted
                        ? "bg-primary hover:bg-primary/95 text-white"
                        : "bg-accent hover:bg-accent-hover text-white"
                    }`}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="plan-selected-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Selected plan summary strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlan}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-14 p-4 rounded-[12px] bg-teal-50 border border-accent/15 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <p className="text-[14px] font-semibold text-primary">
              <span className="text-accent font-bold">{selectedPlan.name}</span> selected
              {activePlan === "standard"
                ? " — 5% fee, no monthly cost, GST invoices included."
                : " — volume discounts from 2%, dedicated support."}
            </p>
            <Button variant="outline" size="sm" className="shrink-0 gap-1 font-semibold" asChild>
              <Link href={selectedPlan.href}>
                Continue <ArrowRight size={14} />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* Interactive calculator */}
        <SlideUp>
          <div className="bg-white border border-border rounded-[16px] p-8 shadow-sm mb-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {audience === "business" ? (
                <motion.div
                  key="business-calc"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="flex flex-col lg:flex-row gap-10 items-start relative z-10"
                >
                  <div className="w-full lg:w-1/2 flex flex-col gap-5">
                    <div>
                      <span className="text-caption text-accent bg-teal-50 px-3 py-1 rounded-full">
                        Compliance math
                      </span>
                      <h3 className="text-h3 text-primary mt-3">GST Input Credit Calculator</h3>
                      <p className="text-body-s font-semibold mt-1">
                        Drag the slider or pick a preset to see your net cost.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {SPEND_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMonthlySpend(preset)}
                          className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
                            monthlySpend === preset
                              ? "border-accent bg-teal-50 text-accent"
                              : "border-border text-muted hover:border-accent/30"
                          }`}
                        >
                          ₹{(preset / 1000).toFixed(0)}K
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-primary text-[15px] mb-2">
                        <span>Estimated Monthly Spend</span>
                        <span className="text-accent text-[18px] font-mono">
                          ₹{monthlySpend.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10000}
                        max={500000}
                        step={5000}
                        value={monthlySpend}
                        onChange={(e) => setMonthlySpend(Number(e.target.value))}
                        className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                      <div className="flex justify-between text-caption mt-1 normal-case">
                        <span>₹10K</span>
                        <span>₹5L</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 bg-bg border border-border rounded-[12px] p-6 grid grid-cols-2 gap-5">
                    {[
                      { label: "Expert Charge", value: monthlySpend, accent: false },
                      { label: "Platform Fee (5%)", value: platformFee, accent: false },
                      { label: "GST ITC Saved (18%)", value: gstCredit, accent: true, icon: Landmark },
                      { label: "Net Cash Saved", value: netSaving, accent: true },
                    ].map((row) => (
                      <div key={row.label} className="flex flex-col">
                        <span className={`text-caption normal-case flex items-center gap-1 ${row.accent ? "text-accent" : "text-muted"}`}>
                          {row.icon && <row.icon size={12} />}
                          {row.label}
                        </span>
                        <span className={`text-[20px] font-bold mt-1 ${row.accent ? "text-accent" : "text-primary"}`}>
                          <AnimatedValue value={row.value} />
                        </span>
                      </div>
                    ))}
                    <div className="col-span-2 border-t border-border pt-4 flex justify-between items-center">
                      <div>
                        <span className="text-[13px] font-bold text-primary">Net Corporate Cost</span>
                        <p className="text-[11px] text-muted font-semibold">After GST input reclaimed</p>
                      </div>
                      <span className="text-[24px] font-bold text-primary">
                        <AnimatedValue value={netCost} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="expert-calc"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="flex flex-col lg:flex-row gap-10 items-start relative z-10"
                >
                  <div className="w-full lg:w-1/2 flex flex-col gap-5">
                    <div>
                      <span className="text-caption text-accent bg-teal-50 px-3 py-1 rounded-full">
                        Earnings preview
                      </span>
                      <h3 className="text-h3 text-primary mt-3">Expert Earnings Calculator</h3>
                      <p className="text-body-s font-semibold mt-1">
                        Set your rate and session length — see what you keep after the 5% fee.
                      </p>
                    </div>

                    <div>
                      <span className="text-[13px] font-bold text-primary mb-2 block">Session length</span>
                      <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-[12px] border border-border">
                        {([15, 30, 60] as Duration[]).map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDuration(d)}
                            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all outline-none focus:outline-none ${
                              duration === d
                                ? "bg-white text-accent shadow-sm"
                                : "text-muted hover:text-primary"
                            }`}
                          >
                            <Clock size={14} />
                            {d} min
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-primary text-[15px] mb-2">
                        <span className="flex items-center gap-1.5">
                          <IndianRupee size={16} /> Hourly rate
                        </span>
                        <span className="text-accent text-[18px] font-mono">
                          ₹{hourlyRate.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={500}
                        max={15000}
                        step={100}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                      <div className="flex justify-between text-caption mt-1 normal-case">
                        <span>₹500</span>
                        <span>₹15,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 bg-primary text-white rounded-[12px] p-6">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-4">
                      Per {duration}-min session
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-gray-400">Session charge</span>
                        <span className="font-mono font-bold">
                          <AnimatedValue value={sessionBase} />
                        </span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-gray-400">Platform fee (5%)</span>
                        <span className="font-mono font-bold text-red-300">
                          −<AnimatedValue value={sessionFee} />
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                      <span className="text-[15px] font-semibold">You earn</span>
                      <span className="text-[32px] font-bold text-accent font-mono leading-none">
                        <AnimatedValue value={expertEarns} />
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-3">Instant payouts. Zero payout fees.</p>
                    <Button
                      className="w-full mt-5 h-11 bg-accent hover:bg-accent-hover font-semibold"
                      asChild
                    >
                      <Link href="/auth/signup?role=expert">Become an Expert →</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SlideUp>

        {/* FAQs */}
        <SlideUp>
          <div className="max-w-[760px] mx-auto">
            <h3 className="text-h2 text-primary text-center mb-8">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <motion.div
                    key={idx}
                    layout
                    className={`bg-white border rounded-[12px] overflow-hidden transition-colors ${
                      isOpen ? "border-accent/30 shadow-sm" : "border-border"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left font-bold text-[15px] text-primary hover:bg-gray-50/80 transition-colors outline-none focus:outline-none"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-muted shrink-0" />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 text-body-s leading-relaxed font-medium">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </SlideUp>

      </div>
    </div>
  );
}
