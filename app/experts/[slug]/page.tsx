"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Globe, Languages, ShieldCheck, Star, ExternalLink, Heart, CheckCircle, Video, CalendarRange, Award, ChevronLeft, ChevronRight, Check, ThumbsUp } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ExpertCard } from "../../../components/shared/ExpertCard";
import { useCurrency } from "../../../contexts/CurrencyContext";

const MOCK_EXPERT = {
  id: "1",
  name: "Arjun Sharma",
  title: "Staff Engineer · ex-Razorpay · ex-Flipkart",
  location: "Bangalore, India",
  timezone: "IST (UTC+5:30)",
  languages: ["English", "Hindi"],
  isVerified: true,
  isElite: true,
  isOnline: true,
  rating: 4.9,
  sessionCount: 127,
  responseTime: "< 2 hr",
  experience: "8 yrs",
  credentials: ["IIT Bombay M.Tech", "AWS Solutions Architect", "System Design Certified", "ex-Razorpay"],
  price: 15000,
  usdPrice: 180,
  platformFee: 3000,
  gst: 3240,
  totalPrice: 21240,
};

export default function ExpertProfilePage() {
  const params = useParams();
  const { currency } = useCurrency();
  const [selectedEngagement, setSelectedEngagement] = useState<"micro" | "extended" | "retainer">("micro");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedDate, setSelectedDate] = useState<number | null>(12); // Mock date
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00 AM");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        
        {/* BREADCRUMB */}
        <div className="text-[14px] text-text-muted pt-6 pb-0">
          <Link href="/" className="hover:text-navy-DEFAULT">Home</Link> / <Link href="/search" className="hover:text-navy-DEFAULT">Find Experts</Link> / <Link href="/search?category=engineering" className="hover:text-navy-DEFAULT">Engineering</Link> / <span className="text-navy-DEFAULT">{MOCK_EXPERT.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* LEFT CONTENT COL (65%) */}
          <div className="lg:w-[65%] flex flex-col pb-24">
            
            {/* PROFILE HEADER SECTION */}
            <section className="bg-white py-10 border-b border-border flex flex-col md:flex-row gap-8">
              {/* AVATAR AREA */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative">
                  <div className="w-[120px] h-[120px] rounded-full bg-surface-2 flex items-center justify-center text-[48px] font-bold text-text-sub ring-2 ring-teal-DEFAULT">
                    {MOCK_EXPERT.name.charAt(0)}
                  </div>
                </div>
                <div className="mt-2 flex flex-col items-center gap-1">
                  {MOCK_EXPERT.isVerified && <div className="bg-green-bg text-green-DEFAULT text-[12px] font-semibold px-2 py-0.5 rounded-[6px] flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</div>}
                  {MOCK_EXPERT.isElite && <div className="bg-gold-bg text-gold-DEFAULT text-[12px] font-semibold px-2 py-0.5 rounded-[6px] flex items-center gap-1"><Star className="w-3 h-3" /> Elite</div>}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[14px] text-green-DEFAULT font-medium">
                  <div className="w-2.5 h-2.5 bg-green-DEFAULT rounded-full" /> Available now
                </div>
              </div>

              {/* INFO AREA */}
              <div className="flex flex-col">
                <h1 className="font-serif italic text-[36px] text-navy-DEFAULT leading-tight">{MOCK_EXPERT.name}</h1>
                <p className="text-[20px] font-medium text-text-sub mt-1">{MOCK_EXPERT.title}</p>
                
                <div className="flex flex-wrap gap-4 text-[14px] text-text-muted mt-2">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {MOCK_EXPERT.location}</div>
                  <div className="flex items-center gap-1"><Globe className="w-4 h-4" /> {MOCK_EXPERT.timezone}</div>
                  <div className="flex items-center gap-1"><Languages className="w-4 h-4" /> {MOCK_EXPERT.languages.join(" · ")}</div>
                </div>

                {/* STATS ROW */}
                <div className="flex gap-8 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[20px] font-bold text-navy-DEFAULT flex items-center gap-1">{MOCK_EXPERT.rating}</span>
                    <span className="text-[12px] text-text-muted">Rating</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[20px] font-bold text-navy-DEFAULT">{MOCK_EXPERT.sessionCount}</span>
                    <span className="text-[12px] text-text-muted">Sessions</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[20px] font-bold text-navy-DEFAULT">{MOCK_EXPERT.responseTime}</span>
                    <span className="text-[12px] text-text-muted">Response</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[20px] font-bold text-navy-DEFAULT">{MOCK_EXPERT.experience}</span>
                    <span className="text-[12px] text-text-muted">Experience</span>
                  </div>
                </div>

                {/* CREDENTIAL PILLS */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {MOCK_EXPERT.credentials.map((cred, i) => (
                    <span key={i} className="bg-teal-bg text-teal-DEFAULT text-[12px] font-semibold px-3 py-1 rounded-[6px] cursor-pointer hover:shadow-sm">
                      {cred}
                    </span>
                  ))}
                </div>

                {/* SOCIAL ROW */}
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="h-[36px] px-4 gap-2 text-[14px]">
                    <ExternalLink className="w-4 h-4" /> View LinkedIn
                  </Button>
                  <Button variant="ghost" className="h-[36px] w-[36px] p-0 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-text-sub" />
                  </Button>
                </div>
              </div>
            </section>

            {/* BATTLE SCARS SECTION */}
            <section className="bg-white py-12 border-b border-border">
              <h3 className="text-[28px] font-semibold text-navy-DEFAULT">Proven outcomes — not just credentials</h3>
              <p className="text-[16px] text-text-sub mt-2 mb-6">Real problems solved. Measurable results. From companies like yours.</p>
              
              <div className="flex flex-col gap-4">
                {[
                  "Reduced AWS monthly spend by 43% (₹12L → ₹6.8L) for a Series B fintech with 2M DAU on ECS.",
                  "Designed multi-tenant PostgreSQL sharding architecture that resolved 8s P95 latency spikes.",
                  "Passed SOC2 Type II audit in 3 weeks by implementing exact Terraform security modules."
                ].map((scar, i) => (
                  <div key={i} className="bg-teal-bg rounded-[8px] p-6 flex items-start gap-4">
                    <CheckCircle className="w-[20px] h-[20px] text-teal-DEFAULT shrink-0 mt-0.5" />
                    <p className="text-[16px] font-medium text-navy-DEFAULT leading-relaxed">{scar}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SESSION TYPES SECTION */}
            <section className="bg-surface-DEFAULT py-12 border-b border-border px-6 md:px-8 -mx-6 md:-mx-8">
              <div className="max-w-[1280px] mx-auto">
                <h3 className="text-[28px] font-semibold text-navy-DEFAULT mb-6">Choose how to engage</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Micro-Consultation */}
                  <div className="bg-white border border-border rounded-[8px] shadow-sm p-6 flex flex-col">
                    <Video className="w-[48px] h-[48px] text-teal-DEFAULT mb-4" />
                    <div className="font-mono text-teal-DEFAULT text-[24px] font-semibold">₹15,000 / hr</div>
                    <p className="text-[16px] text-text-body mt-2 flex-grow">
                      Best for specific technical decisions, architecture reviews, one-time blockers, or second opinions.
                    </p>
                    <div className="flex gap-2 mt-4">
                      {["60 min", "90 min", "120 min"].map(min => (
                        <span key={min} className="bg-surface-2 text-text-sub text-[12px] font-medium px-2 py-1 rounded-[4px]">{min}</span>
                      ))}
                    </div>
                    <Button fullWidth size="md" variant="primary" className="mt-4">Book Session</Button>
                  </div>

                  {/* Monthly Retainer */}
                  <div className="bg-white border-2 border-teal-DEFAULT rounded-[12px] shadow-md p-6 flex flex-col relative">
                    <span className="absolute top-4 right-4 bg-gold-bg text-gold-DEFAULT text-[12px] font-bold px-2 py-1 rounded-[6px]">Most Popular</span>
                    <CalendarRange className="w-[48px] h-[48px] text-navy-DEFAULT mb-4" />
                    <div className="font-mono text-navy-DEFAULT text-[22px] font-semibold">From ₹1,00,000 / month</div>
                    <p className="text-[16px] text-text-body mt-2 flex-grow">
                      Best for ongoing architecture guidance, quarterly financial planning, or continuous legal support.
                    </p>
                    <div className="text-[12px] text-text-sub mt-3 flex flex-wrap gap-x-3 gap-y-1">
                      <span>✓ 10 hrs/month</span>
                      <span>✓ Priority booking</span>
                      <span>✓ Dedicated Slack</span>
                    </div>
                    <Button fullWidth size="md" variant="secondary" className="mt-4">Start Retainer</Button>
                  </div>
                </div>
              </div>
            </section>

            {/* REVIEWS SECTION */}
            <section className="bg-white py-12 border-b border-border">
              <h3 className="text-[28px] font-semibold text-navy-DEFAULT mb-8">127 reviews</h3>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-[48px] font-bold text-navy-DEFAULT leading-none">4.9</div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 text-gold-DEFAULT fill-gold-DEFAULT" />)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 flex-1 max-w-xs">
                  {[
                    { stars: 5, width: "90%", count: 94 },
                    { stars: 4, width: "20%", count: 21 },
                    { stars: 3, width: "9%", count: 9 },
                    { stars: 2, width: "3%", count: 3 },
                    { stars: 1, width: "0%", count: 0 },
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-2 text-[12px] text-text-muted">
                      <span className="w-4">{row.stars}★</span>
                      <div className="flex-1 h-[4px] bg-surface-2 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-DEFAULT rounded-full" style={{ width: row.width }} />
                      </div>
                      <span className="w-4">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map(review => (
                  <div key={review} className="bg-white border border-border rounded-[8px] shadow-xs p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-teal-bg text-teal-DEFAULT font-semibold flex items-center justify-center text-[14px]">CT</div>
                        <div className="font-semibold text-[16px] text-navy-DEFAULT">Series A Fintech · Bangalore</div>
                      </div>
                      <div className="text-[12px] text-text-muted">14 March 2025</div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-gold-DEFAULT fill-gold-DEFAULT" />)}
                      </div>
                      <span className="bg-teal-bg text-teal-DEFAULT text-[12px] px-2 py-0.5 rounded-[4px] font-medium">Architecture Review</span>
                    </div>
                    <p className="text-[16px] text-text-body mt-3 leading-relaxed">
                      Arjun completely transformed our approach to database scaling. We were about to spend weeks refactoring, but his one-hour session gave us a much simpler sharding strategy. Worth every penny.
                    </p>
                    <div className="flex items-center gap-1 text-[12px] text-text-muted mt-3">
                      Helpful? <ThumbsUp className="w-3.5 h-3.5 ml-1" /> 12
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" fullWidth className="mt-6">Load 10 more reviews</Button>
            </section>

          </div>

          {/* RIGHT STICKY PANEL (35%) */}
          <div className="lg:w-[35%]">
            <div className="sticky top-[80px] bg-white border border-border rounded-[12px] shadow-lg p-8">
              <div className="text-center">
                <div className="font-mono text-teal-DEFAULT text-[36px] font-bold">₹15,000 <span className="text-[20px]">/ hr</span></div>
                {currency !== 'INR' && <div className="text-[12px] text-text-muted">≈ $180 USD · Converted at live rates</div>}
              </div>

              <div className="flex mt-4 bg-surface-2 p-1 rounded-[6px]">
                {["Micro-Session 1hr", "Extended 2hr", "Retainer"].map(type => (
                  <button 
                    key={type} 
                    onClick={() => setSelectedEngagement(type as any)}
                    className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors ${selectedEngagement === type.split(' ')[0].toLowerCase() ? 'bg-teal-DEFAULT text-white' : 'text-navy-DEFAULT hover:bg-surface-DEFAULT border-transparent'}`}
                  >
                    {type.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="h-[1px] w-full bg-border my-4" />

              {/* MINI CALENDAR MOCK */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-navy-DEFAULT text-[16px]">June 2025</span>
                  <div className="flex gap-2">
                    <ChevronLeft className="w-5 h-5 text-text-muted cursor-pointer" />
                    <ChevronRight className="w-5 h-5 text-navy-DEFAULT cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <span key={d} className="text-[12px] text-text-muted font-medium">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const isAvailable = day % 3 !== 0;
                    const isSelected = selectedDate === day;
                    return (
                      <button 
                        key={day}
                        onClick={() => isAvailable && setSelectedDate(day)}
                        className={`w-full aspect-square flex items-center justify-center rounded-full text-[14px] font-medium transition-colors
                          ${isSelected ? 'border-2 border-teal-DEFAULT bg-white text-navy-DEFAULT' : ''}
                          ${isAvailable && !isSelected ? 'bg-teal-DEFAULT text-white hover:bg-teal-dark' : ''}
                          ${!isAvailable ? 'bg-surface-2 text-text-disabled cursor-not-allowed opacity-50' : ''}
                        `}
                      >
                        {isSelected ? <Check className="w-3 h-3 text-teal-DEFAULT" /> : day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* TIME SLOTS */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["10:00 AM", "2:00 PM ⚡", "4:00 PM"].map((slot, i) => (
                  <button 
                    key={slot}
                    onClick={() => i !== 2 && setSelectedTime(slot)}
                    className={`h-[40px] px-4 rounded-[6px] text-[13px] font-semibold transition-colors
                      ${i === 0 && selectedTime !== slot ? 'bg-green-bg text-green-DEFAULT hover:opacity-80' : ''}
                      ${i === 1 && selectedTime !== slot ? 'bg-yellow-bg text-yellow-DEFAULT hover:opacity-80' : ''}
                      ${i === 2 ? 'bg-surface-2 text-text-disabled opacity-50 cursor-not-allowed' : ''}
                      ${selectedTime === slot ? 'bg-navy-DEFAULT text-white shadow-md' : ''}
                    `}
                    disabled={i === 2}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-teal-DEFAULT underline cursor-pointer mt-2 text-right">Slots in IST. Select your timezone &rarr;</p>

              <div className="flex gap-2 mt-4">
                {[60, 90, 120].map(min => (
                  <button 
                    key={min} 
                    onClick={() => setSelectedDuration(min)}
                    className={`flex-1 py-1.5 rounded-[4px] text-[13px] font-semibold transition-colors border ${selectedDuration === min ? 'bg-navy-DEFAULT text-white border-navy-DEFAULT' : 'bg-white text-text-body border-border hover:bg-surface-DEFAULT'}`}
                  >
                    {min} min
                  </button>
                ))}
              </div>

              <div className="h-[1px] w-full bg-border my-4" />

              {/* PRICE BREAKDOWN */}
              <div className="space-y-2">
                <div className="flex justify-between text-[14px]">
                  <span className="text-text-body">Expert rate</span>
                  <span className="font-mono text-teal-DEFAULT font-semibold">₹15,000</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-text-body">Platform fee</span>
                  <span className="font-mono text-navy-DEFAULT">₹3,000</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-text-body">GST (18%)</span>
                  <span className="font-mono text-navy-DEFAULT">₹3,240</span>
                </div>
                <div className="h-[1px] w-full bg-border border-dashed my-2" />
                <div className="flex justify-between text-[16px] font-bold">
                  <span className="text-navy-DEFAULT">Total</span>
                  <span className="font-mono text-navy-DEFAULT text-[20px]">₹21,240</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-[12px] text-text-muted">
                  <ShieldCheck className="w-4 h-4 text-green-DEFAULT shrink-0" /> Mutual NDA auto-signed before session
                </div>
                <div className="flex items-start gap-2 text-[12px] text-text-muted">
                  <Award className="w-4 h-4 text-teal-DEFAULT shrink-0" /> GST invoice generated instantly · ITC eligible
                </div>
              </div>

              <Button size="lg" variant="primary" fullWidth className="mt-6" asChild>
                <Link href={`/book/${MOCK_EXPERT.id}`}>Confirm & Book</Link>
              </Button>

              <div className="flex gap-3 mt-3">
                <Button variant="outline" className="flex-1">Ask a Question</Button>
                <Button variant="ghost" className="w-[44px] h-[44px] p-0 flex items-center justify-center shrink-0 border border-border">
                  <Heart className="w-5 h-5 text-text-sub" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
