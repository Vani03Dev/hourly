"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SlideUp, staggerContainer, staggerItem } from "@/components/shared/MotionWrapper";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";

export interface FeaturedExpert {
  id: string;
  name: string;
  title: string;
  domain: string;
  rating: number;
  sessions: number;
  price: number;
  availableToday: boolean;
  initials: string;
}

export function HomeFeaturedExperts({ experts }: { experts: FeaturedExpert[] }) {
  return (
    <section className="py-20 px-5 md:px-12 lg:px-24 w-full bg-bg">
      <div className="max-w-[1200px] mx-auto">
        <SlideUp>
          <h2 className="text-h2 text-primary text-center mb-12">
            Our Founding Experts
          </h2>
        </SlideUp>

        {experts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-8%" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {experts.map((exp) => (
              <motion.div
                key={exp.id}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="bg-white border border-border rounded-[16px] p-6 flex flex-col justify-between shadow-sm hover:border-accent/30 hover:shadow-premium transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[16px] border border-border relative">
                      {exp.initials}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
                    </div>
                    {exp.availableToday && (
                      <span className="bg-blue-50 text-accent border border-accent/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Founding Member
                      </span>
                    )}
                  </div>
                  <h3 className="text-[17px] font-extrabold text-primary tracking-tight">{exp.name}</h3>
                  <p className="text-[13px] text-muted mt-0.5 min-h-[36px] line-clamp-2">{exp.title}</p>
                  <span className="inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 border border-border text-muted">
                    {exp.domain}
                  </span>
                  {SHOW_RATINGS_AND_REVIEWS && (
                  <div className="flex items-center gap-1 mt-4 text-[13px] font-semibold">
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                    {exp.rating}
                    <span className="text-muted font-normal">({exp.sessions})</span>
                  </div>
                  )}
                </div>
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-[18px] font-bold font-mono mb-3">
                    ₹{exp.price}
                    <span className="text-[12px] text-muted font-sans font-normal"> / session</span>
                  </p>
                  <Button variant="outline" className="w-full h-10 text-[13px] font-semibold" asChild>
                    <Link href={`/experts/${exp.id}`}>View Profile</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-white max-w-lg mx-auto">
            <p className="text-[14px] text-muted font-medium">Apply to join the Founding Experts beta.</p>
            <Button variant="outline" className="mt-4 h-10 px-6 font-semibold" asChild>
              <Link href="/auth/signup?role=expert">Apply for Access</Link>
            </Button>
          </div>
        )}

        <SlideUp delay={0.2}>
          <div className="flex justify-center mt-10">
            <Button variant="primary" className="h-12 px-8 font-semibold" asChild>
              <Link href="/experts">View All Founding Experts →</Link>
            </Button>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
