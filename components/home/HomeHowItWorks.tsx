"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Video, ArrowRight } from "lucide-react";
import { SlideUp } from "@/components/shared/MotionWrapper";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    num: "01",
    title: "Browse verified experts",
    desc: "Search and filter specialists by domain, credentials, ratings, and hourly rates.",
    icon: Search,
    preview: (
      <div className="p-6 flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2 h-10 px-3 rounded-[10px] border border-border bg-white">
          <Search size={16} className="text-muted" />
          <div className="h-2 w-32 bg-gray-100 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[10px] border border-border bg-white p-3 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100" />
              <div className="h-2 w-3/4 bg-gray-100 rounded-full" />
              <div className="h-1.5 w-1/2 bg-gray-50 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Pick a slot that works",
    desc: "Choose from real-time availability — 15, 30, or 60 minute sessions.",
    icon: Calendar,
    preview: (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="w-full max-w-[260px] bg-white rounded-[12px] border border-border p-4 shadow-sm">
          <p className="text-[12px] font-bold text-primary mb-3">Select a time</p>
          <div className="grid grid-cols-3 gap-2">
            {["9 AM", "10 AM", "11 AM", "2 PM", "3 PM", "4 PM"].map((t, i) => (
              <div
                key={t}
                className={`py-2 text-center text-[11px] font-bold rounded-[8px] ${
                  i === 2 ? "bg-accent text-white" : "border border-border text-muted"
                }`}
              >
                {t}
              </div>
            ))}
          </div>
          <div className="mt-3 h-9 bg-accent rounded-[8px] flex items-center justify-center text-white text-[12px] font-bold">
            Confirm booking
          </div>
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "Join and pay after",
    desc: "Connect via built-in video. Payment is confirmed only after your session completes.",
    icon: Video,
    preview: (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="w-full h-full max-h-[200px] rounded-[12px] bg-[#0f172a] relative overflow-hidden flex items-center justify-center">
          <span className="text-white/10 text-[28px] font-black">LIVE</span>
          <div className="absolute bottom-3 right-3 w-16 h-20 rounded-[8px] bg-gray-700 border-2 border-white/30" />
          <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-red-500" />
        </div>
      </div>
    ),
  },
];

export function HomeHowItWorks() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const StepIcon = step.icon;

  return (
    <section className="py-20 px-5 md:px-12 lg:px-24 w-full bg-bg border-y border-border">
      <div className="max-w-[1200px] mx-auto">
        <SlideUp>
          <h2 className="text-h2 text-primary text-center mb-3">
            How it works
          </h2>
          <p className="text-body text-muted text-center mb-12 max-w-[480px] mx-auto">
            Three steps from problem to solution — no retainers, no waiting weeks.
          </p>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === active;
              return (
                <motion.button
                  key={s.num}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  whileHover={{ x: 4 }}
                  className={`text-left p-4 rounded-[12px] border transition-all outline-none focus:outline-none ${
                    isActive
                      ? "border-accent bg-teal-50 shadow-sm"
                      : "border-transparent hover:bg-white hover:border-border"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div
                      className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "bg-accent text-white" : "bg-white border border-border text-muted"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[12px] font-bold text-accent">{s.num}</span>
                        <h3 className="text-[16px] font-bold text-primary">{s.title}</h3>
                      </div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-[14px] text-muted leading-relaxed overflow-hidden"
                          >
                            {s.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            <div className="mt-4 pl-4">
              <Button variant="primary" className="h-11 px-6 font-semibold gap-2" asChild>
                <Link href="/experts">
                  Start browsing <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-white border border-border rounded-[16px] h-[280px] md:h-[320px] overflow-hidden shadow-sm relative">
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-[8px] bg-accent text-white flex items-center justify-center">
                <StepIcon size={16} />
              </div>
              <span className="text-[13px] font-bold text-primary">{step.title}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="h-full pt-14"
              >
                {step.preview}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
