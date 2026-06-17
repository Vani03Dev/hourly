"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: "< 1%", label: "Acceptance Rate", description: "Rigorous vetting process" },
  { value: "Invite-Only", label: "Expert Network", description: "Curated industry leaders" },
  { value: "100%", label: "Secure Payments", description: "Bank-grade encryption" },
];

export function HomeStatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="bg-primary text-white py-10 px-5 md:px-12 lg:px-24 w-full border-t border-white/10"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center md:text-left"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center md:items-start"
          >
            <span className="font-mono font-bold text-accent text-[24px] md:text-[28px] mb-1">
              {stat.value}
            </span>
            <span className="text-[15px] font-bold text-white mb-0.5">{stat.label}</span>
            <span className="text-[13px] text-gray-400">{stat.description}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
