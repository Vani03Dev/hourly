"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Scale, Cpu, LineChart, Users, Target, Megaphone, Settings2, UserCheck,
  ArrowRight, Sparkles, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SlideUp, staggerContainer, staggerItem } from "@/components/shared/MotionWrapper";

const INITIAL_VISIBLE = 4;

const CATEGORIES = [
  {
    name: "CA & Tax",
    count: 42,
    icon: Briefcase,
    description: "GST, ITR, audits, and compliance for startups and SMEs.",
    topics: ["GST filing", "ITR & tax planning", "Audit prep", "Fundraise compliance"],
    featured: true,
  },
  {
    name: "Startup Legal",
    count: 28,
    icon: Scale,
    description: "Contracts, incorporation, IP, and regulatory guidance.",
    topics: ["SHA & term sheets", "Employment contracts", "IP assignment", "Compliance"],
    featured: true,
  },
  {
    name: "Tech & CTO",
    count: 54,
    icon: Cpu,
    description: "Architecture reviews, hiring, and technical strategy.",
    topics: ["System design", "Tech hiring", "Cloud costs", "Product roadmap"],
    featured: true,
  },
  {
    name: "Finance & CFO",
    count: 31,
    icon: LineChart,
    description: "Unit economics, fundraising models, and cash flow.",
    topics: ["Financial modeling", "Investor decks", "Burn rate", "Pricing strategy"],
    featured: false,
  },
  {
    name: "HR & People",
    count: 22,
    icon: Users,
    description: "Hiring, culture, compensation, and org design.",
    topics: ["Hiring plans", "ESOP design", "Performance reviews", "Culture building"],
    featured: false,
  },
  {
    name: "Sales & GTM",
    count: 37,
    icon: Target,
    description: "Pipeline, outbound, partnerships, and revenue playbooks.",
    topics: ["GTM strategy", "Outbound sales", "Channel partners", "Pricing & packaging"],
    featured: false,
  },
  {
    name: "Marketing",
    count: 45,
    icon: Megaphone,
    description: "Brand, growth, content, and paid acquisition.",
    topics: ["Brand positioning", "SEO & content", "Paid ads", "Launch campaigns"],
    featured: false,
  },
  {
    name: "Operations",
    count: 19,
    icon: Settings2,
    description: "Processes, vendors, logistics, and scale-up ops.",
    topics: ["SOPs & workflows", "Vendor management", "Supply chain", "Cost optimization"],
    featured: false,
  },
  {
    name: "Leadership",
    count: 26,
    icon: UserCheck,
    description: "Founder coaching, board prep, and executive decisions.",
    topics: ["Founder coaching", "Board meetings", "Team leadership", "Strategic planning"],
    featured: false,
  },
];

export function CategoryExplorer() {
  const [selected, setSelected] = useState(CATEGORIES[0].name);
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasMore = CATEGORIES.length > INITIAL_VISIBLE;
  const active = CATEGORIES.find((c) => c.name === selected) || CATEGORIES[0];
  const ActiveIcon = active.icon;

  const scrollCarousel = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const renderCategoryCard = (cat: (typeof CATEGORIES)[0], inCarousel = false) => {
    const Icon = cat.icon;
    const isActive = active.name === cat.name;
    return (
      <motion.button
        key={cat.name}
        type="button"
        variants={inCarousel ? undefined : staggerItem}
        onClick={() => setSelected(cat.name)}
        onMouseEnter={() => setSelected(cat.name)}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative text-left p-4 md:p-5 rounded-[14px] border transition-colors duration-200 outline-none focus:outline-none shrink-0 ${
          inCarousel ? "w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)] snap-start" : ""
        } ${
          isActive
            ? "border-accent bg-teal-50 shadow-md"
            : "border-border bg-white hover:border-accent/40 hover:shadow-sm"
        }`}
      >
        {cat.featured && (
          <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider text-accent bg-white px-1.5 py-0.5 rounded-full border border-accent/20">
            Popular
          </span>
        )}
        <div
          className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 transition-colors ${
            isActive ? "bg-accent text-white" : "bg-gray-50 text-accent group-hover:bg-teal-50"
          }`}
        >
          <Icon size={20} />
        </div>
        <h3 className="text-[14px] md:text-[15px] font-bold text-primary leading-tight">{cat.name}</h3>
        <p className="text-[12px] font-mono text-muted mt-1">{cat.count} experts</p>
        {isActive && (
          <motion.div
            layoutId="category-active-ring"
            className="absolute inset-0 rounded-[14px] ring-2 ring-accent/30 pointer-events-none"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <section className="py-20 px-5 md:px-12 lg:px-24 w-full bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-teal-50 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <SlideUp>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-accent text-caption mb-4">
              <Sparkles size={14} /> Find your expert
            </span>
            <h2 className="text-h2 text-primary mb-3">
              What do you need help with?
            </h2>
            <p className="text-body-l text-muted max-w-[520px] mx-auto">
              Pick a domain, preview what experts can help with, and book a session in minutes.
            </p>
          </div>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="min-w-0">
            {showAll ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-8%" }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {CATEGORIES.map((cat) => renderCategoryCard(cat))}
              </motion.div>
            ) : (
              <div className="relative">
                {hasMore && (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollCarousel("left")}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-border shadow-md text-primary hover:border-accent/40 transition-colors"
                      aria-label="Scroll categories left"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel("right")}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 items-center justify-center rounded-full bg-white border border-border shadow-md text-primary hover:border-accent/40 transition-colors"
                      aria-label="Scroll categories right"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white to-transparent z-[1] md:hidden" />
                  </>
                )}

                <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {CATEGORIES.map((cat) => renderCategoryCard(cat, true))}
                </div>

                <p className="text-center text-[12px] text-muted mt-2 md:hidden">
                  Swipe right for more domains →
                </p>
              </div>
            )}

            {hasMore && !showAll && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
                <Button
                  variant="outline"
                  className="h-10 px-5 font-semibold text-[13px] gap-2"
                  onClick={() => setShowAll(true)}
                >
                  See all {CATEGORIES.length} categories <ArrowRight size={14} />
                </Button>
                <Link
                  href="/experts"
                  className="text-[13px] font-semibold text-accent hover:underline"
                >
                  Browse all experts
                </Link>
              </div>
            )}

            {showAll && (
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="block mx-auto mt-4 text-[13px] font-semibold text-muted hover:text-primary transition-colors"
              >
                Show less
              </button>
            )}
          </div>

          <div className="lg:sticky lg:top-[88px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="bg-primary text-white rounded-[16px] p-6 shadow-lg overflow-hidden relative"
              >
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "12px 12px",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-[12px] bg-accent flex items-center justify-center shrink-0">
                      <ActiveIcon size={22} />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold leading-tight">{active.name}</h3>
                      <p className="text-[13px] text-gray-400 mt-1 font-mono">{active.count} verified experts</p>
                    </div>
                  </div>

                  <p className="text-[14px] text-gray-300 leading-relaxed mb-5">{active.description}</p>

                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Common topics</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {active.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2.5 py-1 rounded-full bg-white/10 text-[12px] font-medium text-gray-200 border border-white/10"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full h-11 bg-accent hover:bg-accent-hover text-white font-semibold rounded-[10px] gap-2"
                    asChild
                  >
                    <Link href={`/experts?category=${encodeURIComponent(active.name)}`}>
                      Browse {active.name} experts <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="text-center text-[12px] text-muted mt-4">
              Sessions from <span className="font-mono font-bold text-primary">₹500</span> · Book in under 2 min
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
