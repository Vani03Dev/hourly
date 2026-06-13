"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HomeHeroProps {
  isLoggedIn: boolean;
  role?: string;
}

const TRUST_ITEMS = [
  "Verified credentials",
  "Book in 2 min",
  "Cancel anytime",
  "INR pricing",
];

export function HomeHero({ isLoggedIn, role }: HomeHeroProps) {
  return (
    <section className="bg-white border-b border-border py-16 lg:py-24 px-5 md:px-12 lg:px-24 relative overflow-hidden flex flex-col items-center justify-center">
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#E5E7EB 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute top-12 right-[10%] hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-teal-50 border border-accent/20 text-[12px] font-bold text-accent"
      >
        <ShieldCheck size={14} /> 2,400+ verified experts
      </motion.div>

      <div className="max-w-[800px] text-center flex flex-col items-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-hero text-primary"
        >
          Book verified experts.
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-accent"
          >
            Solve business problems faster.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-body-l text-muted mt-5 max-w-[580px]"
        >
          On-demand sessions with CAs, lawyers, CTOs and strategy experts. Pay per session. No retainer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto"
        >
          {!isLoggedIn ? (
            <>
              <Button variant="primary" className="h-12 px-8 font-semibold w-full sm:w-auto" asChild>
                <Link href="/experts">Browse Experts →</Link>
              </Button>
              <Button variant="outline" className="h-12 px-8 font-semibold w-full sm:w-auto" asChild>
                <Link href="/auth/signup?role=expert">Become an Expert</Link>
              </Button>
            </>
          ) : role === "expert" ? (
            <>
              <Button variant="primary" className="h-12 px-8 font-semibold w-full sm:w-auto" asChild>
                <Link href="/expert/dashboard">Go to Expert Dashboard →</Link>
              </Button>
              <Button variant="outline" className="h-12 px-8 font-semibold w-full sm:w-auto" asChild>
                <Link href="/expert/availability">Manage Availability</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" className="h-12 px-8 font-semibold w-full sm:w-auto" asChild>
                <Link href="/experts">Browse Experts →</Link>
              </Button>
              <Button variant="outline" className="h-12 px-8 font-semibold w-full sm:w-auto" asChild>
                <Link href="/dashboard/business">Go to Dashboard</Link>
              </Button>
            </>
          )}
        </motion.div>

        {!isLoggedIn && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[14px] text-muted mt-4 font-medium"
          >
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent hover:underline font-semibold">
              Log in
            </Link>
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-10 text-[14px] font-semibold text-muted"
        >
          {TRUST_ITEMS.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span className="text-border hidden sm:inline">|</span>}
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-success shrink-0" /> {item}
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
