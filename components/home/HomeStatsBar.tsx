"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: 2400, suffix: "+", label: "Experts", decimals: 0 },
  { value: 18, suffix: "K+", label: "Sessions completed", decimals: 0 },
  { value: 500, suffix: "+", label: "Startups trust us", decimals: 0 },
];

function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  active,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, value]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span className="font-mono font-bold text-white text-[18px] md:text-[20px]">
      {formatted}
      {suffix}
    </span>
  );
}

export function HomeStatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="bg-primary text-white py-6 px-5 md:px-12 lg:px-24 w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto grid grid-cols-3 gap-6 text-center md:text-left"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center md:items-start"
          >
            <AnimatedNumber
              value={stat.value}
              suffix={stat.suffix}
              decimals={stat.decimals}
              active={inView}
            />
            <span className="text-[13px] md:text-[14px] text-gray-400 mt-0.5">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
