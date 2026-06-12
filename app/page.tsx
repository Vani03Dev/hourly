"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Scale, Code2, TrendingUp, Cloud } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ExpertCard } from "../components/shared/ExpertCard";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const MOCK_EXPERTS = [
  {
    id: "1",
    name: "Arjun Sharma",
    title: "Staff Engineer · ex-Razorpay",
    location: "Bangalore, India",
    timezone: "IST",
    isVerified: true,
    isElite: true,
    isOnline: true,
    availability: "now" as const,
    specializations: ["System Design", "AWS", "PostgreSQL"],
    rating: 4.9,
    sessionCount: 127,
    responseTime: "< 2hr",
    price: 15000,
    usdPrice: 180,
  },
  {
    id: "2",
    name: "Neha Gupta",
    title: "Fractional CFO · ex-Sequoia",
    location: "Mumbai, India",
    timezone: "IST",
    isVerified: true,
    isElite: false,
    isOnline: false,
    availability: "today" as const,
    specializations: ["Financial Modeling", "Series B", "SaaS Metrics"],
    rating: 5.0,
    sessionCount: 84,
    responseTime: "< 4hr",
    price: 25000,
    usdPrice: 300,
  },
  {
    id: "3",
    name: "Vikram Desai",
    title: "Tech Lead · ex-Stripe",
    location: "Pune, India",
    timezone: "IST",
    isVerified: true,
    isElite: false,
    isOnline: true,
    availability: "today" as const,
    specializations: ["Payment Gateways", "Node.js", "Security"],
    rating: 4.8,
    sessionCount: 42,
    responseTime: "< 1hr",
    price: 12000,
    usdPrice: 145,
  }
];

export default function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION (Dark & Focused) */}
      <section className="relative bg-[#0B1120] pt-24 pb-20 px-6 md:px-8 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-DEFAULT/20 rounded-[100%] blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-[1000px] mx-auto relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-DEFAULT/10 border border-teal-DEFAULT/20 text-[12px] font-semibold text-teal-light uppercase tracking-[0.2em] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-DEFAULT animate-pulse" /> EXPERTISE-AS-A-SERVICE
          </span>
          
          <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.1] text-white font-serif italic drop-shadow-md mb-6">
            The B2B Expertise Procurement Platform.
          </h1>
          
          <p className="text-[18px] md:text-[20px] text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            Unblock your engineering, finance, and legal teams with vetted top 1% Indian professionals in <span className="text-white font-medium">under 60 minutes</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Button size="lg" className="bg-teal-DEFAULT text-white hover:bg-teal-dark border-none px-8 rounded-full h-[56px] text-[16px] font-semibold transition-all" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="bg-teal-DEFAULT text-white hover:bg-teal-dark border-none px-8 rounded-full h-[56px] text-[16px] font-semibold transition-all" asChild>
                  <Link href="/search">Find an Expert</Link>
                </Button>
                <Button size="lg" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md px-8 rounded-full h-[56px] text-[16px] transition-all" asChild>
                  <Link href="/apply">Apply as Expert</Link>
                </Button>
              </>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center">
            <p className="text-[13px] text-gray-500 uppercase tracking-widest font-semibold mb-6">Trusted by scaling teams</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* Placeholder abstract logos for B2B trust */}
              <div className="flex items-center gap-2 text-white font-bold text-xl"><div className="w-6 h-6 bg-white rounded-sm" /> AcmeSaaS</div>
              <div className="flex items-center gap-2 text-white font-bold text-xl"><div className="w-6 h-6 bg-white rounded-full" /> FinCore</div>
              <div className="flex items-center gap-2 text-white font-bold text-xl"><div className="w-6 h-6 bg-white rounded-tr-xl" /> Vertex</div>
              <div className="flex items-center gap-2 text-white font-bold text-xl hidden sm:flex"><div className="w-6 h-6 bg-white rotate-45" /> Nexus</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. THE "WHY HOURLY" STRIP (Replaces tabs/long content) */}
      <section className="bg-white py-16 border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-border">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center pt-8 md:pt-0 px-4"
          >
            <div className="w-12 h-12 bg-teal-bg rounded-2xl flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6 text-teal-DEFAULT" />
            </div>
            <h3 className="text-[18px] font-bold text-navy-DEFAULT mb-2">Cryptographically Vetted</h3>
            <p className="text-[14px] text-text-sub leading-relaxed">
              Less than 2% acceptance rate. Every expert's employment history and identity is strictly verified.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center pt-8 md:pt-0 px-4"
          >
            <div className="w-12 h-12 bg-teal-bg rounded-2xl flex items-center justify-center mb-5">
              <Zap className="w-6 h-6 text-teal-DEFAULT" />
            </div>
            <h3 className="text-[18px] font-bold text-navy-DEFAULT mb-2">Zero Wait Time</h3>
            <p className="text-[14px] text-text-sub leading-relaxed">
              Skip the recruitment cycle. View live availability, book instantly, and get unblocked today.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center pt-8 md:pt-0 px-4"
          >
            <div className="w-12 h-12 bg-teal-bg rounded-2xl flex items-center justify-center mb-5">
              <Scale className="w-6 h-6 text-teal-DEFAULT" />
            </div>
            <h3 className="text-[18px] font-bold text-navy-DEFAULT mb-2">Enterprise Ready</h3>
            <p className="text-[14px] text-text-sub leading-relaxed">
              Mutual NDAs signed automatically before every call. GST invoices generated instantly on payment.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 3. FEATURED EXPERTS (Social Proof) */}
      <section className="bg-gradient-to-b from-surface-DEFAULT to-white py-24 px-6 md:px-8 border-b border-border">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-[36px] md:text-[42px] font-bold text-navy-DEFAULT tracking-tight">World-class talent. On tap.</h2>
              <p className="text-[18px] text-text-sub mt-3 max-w-xl leading-relaxed">
                Hire the people who built the tools you use every day. 
                From designing distributed systems to passing SOC2 audits.
              </p>
            </div>
            <Button variant="outline" size="lg" className="hidden md:flex font-semibold">Browse Directory <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {MOCK_EXPERTS.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ExpertCard expert={expert} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Button variant="outline" size="lg" className="w-full font-semibold">Browse Directory <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </div>
      </section>



      {/* 5. GLOBAL CTA */}
      <section className="bg-navy-DEFAULT py-24 px-6 md:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-full bg-gradient-radial from-teal-DEFAULT/20 to-transparent opacity-50" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="text-[36px] md:text-[48px] font-bold mb-6 font-serif italic">Stop guessing. Start executing.</h2>
          <p className="text-[18px] text-gray-300 mb-10 leading-relaxed">
            Join the hundreds of Indian companies resolving their hardest technical, financial, and legal challenges with Hourly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-teal-DEFAULT hover:bg-teal-light text-white border-none px-8 rounded-full h-[56px] text-[16px] font-semibold w-full sm:w-auto shadow-[0_0_20px_rgba(13,148,136,0.3)]">
              Find an Expert
            </Button>
            <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 rounded-full h-[56px] text-[16px] w-full sm:w-auto">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
