"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ShieldCheck, ChevronDown, ChevronUp, MapPin, Globe, Languages, Check, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { createClient } from "../../utils/supabase/client";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";

interface ExpertData {
  id: string;
  name: string;
  title: string;
  categories: string[];
  availability: "today" | "week" | "any";
  durations: (15 | 30 | 60)[];
  price: number;
  rating: number;
  reviewsCount: number;
  initials: string;
  isVerified: boolean;
  company: string;
  memberSince: string;
  bio: string;
  credentials: string[];
  languages: string[];
  skills: string[];
  experience: { year: string; company: string; role: string }[];
  certifications: { year: string; name: string; issuer: string }[];
}

export function ExpertProfileInteractive({ expert }: { expert: ExpertData }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [role, setRole] = useState<'company' | 'expert' | null>(user?.user_metadata?.role || null);

  useEffect(() => {
    async function checkRole() {
      if (!user) {
        setRole(null);
        return;
      }
      const supabase = createClient();
      const { data: eData } = await supabase.from('expert_profiles').select('id').eq('id', user.id).single();
      if (eData || user.user_metadata?.role === 'expert') {
        setRole('expert');
      } else {
        setRole('company');
      }
    }
    checkRole();
  }, [user]);

  // Bio expand toggle
  const [bioExpanded, setBioExpanded] = useState(false);

  // Booking states
  const [selectedDuration, setSelectedDuration] = useState<15 | 30 | 60>(30);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "availability">("about");

  // Review list pagination
  const [reviewsVisible, setReviewsVisible] = useState(3);

  // Price calculations based on duration selection
  const priceMultiplier = selectedDuration === 15 ? 0.5 : selectedDuration === 60 ? 2.0 : 1.0;
  const rawPrice = Math.round(expert.price * priceMultiplier);
  const totalSessionPrice = rawPrice; // GST is ₹0 / platform fee ₹0 as per Screen 4 Step 3

  // Get active session price label for the types selector
  const price15 = Math.round(expert.price * 0.5);
  const price30 = expert.price;
  const price60 = Math.round(expert.price * 2.0);

  // Mock days of the month for picker
  const availableDays = [14, 15, 16, 17, 18, 20, 21, 22];
  const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "6:00 PM"];

  return (
    <div className="w-full flex flex-col gap-[40px]">
      
      {/* TOP SECTION (2-col: left info, right booking) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] items-start">
        
        {/* LEFT INFORMATION COLUMN (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-[32px]">
          {/* Main profile card header */}
          <div className="flex gap-[24px] items-start border-b border-border pb-[24px]">
            <div className="w-[80px] h-[80px] rounded-full bg-primary text-white flex items-center justify-center font-bold text-[28px] border border-border shrink-0 relative">
              {expert.initials}
              {expert.isVerified && (
                <span className="absolute bottom-0 right-0 w-[20px] h-[20px] bg-success rounded-full border-2 border-white flex items-center justify-center" title="Verified Badge">
                  <span className="text-[10px] text-white font-bold">✓</span>
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-[8px] flex-wrap">
                <h1 className="text-[28px] font-bold text-primary leading-tight">
                  {expert.name}
                </h1>
              </div>
              <p className="text-[16px] text-muted font-semibold mt-[4px]">
                {expert.title} @ {expert.company}
              </p>

              {/* Domain pills */}
              <div className="flex flex-wrap gap-[6px] mt-[12px]">
                {expert.categories.map((cat, idx) => (
                  <span key={idx} className="bg-bg text-muted border border-border text-[11px] font-semibold px-[8px] py-[2px] rounded-full font-mono">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className={`grid gap-[16px] border-b border-border pb-[24px] text-center bg-bg p-[16px] rounded-xl border border-border ${SHOW_RATINGS_AND_REVIEWS ? "grid-cols-3" : "grid-cols-2"}`}>
            {SHOW_RATINGS_AND_REVIEWS && (
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-muted uppercase tracking-wider">Rating</span>
              <span className="text-[18px] font-bold text-primary mt-[4px] flex items-center justify-center gap-[4px]">
                <Star className="w-[16px] h-[16px] text-warning fill-warning shrink-0" /> {expert.rating}
              </span>
            </div>
            )}
            <div className={`flex flex-col ${SHOW_RATINGS_AND_REVIEWS ? "border-x border-border" : ""}`}>
              <span className="text-[13px] font-bold text-muted uppercase tracking-wider">Sessions</span>
              <span className="text-[18px] font-bold text-primary mt-[4px] font-mono">{expert.reviewsCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-muted uppercase tracking-wider">Joined</span>
              <span className="text-[18px] font-bold text-primary mt-[4px]">{expert.memberSince}</span>
            </div>
          </div>

          {/* Bio (3 lines, expand toggle) */}
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-[18px] font-bold text-primary">About Expert</h3>
            <p className={`text-[14px] text-muted leading-relaxed ${bioExpanded ? "" : "line-clamp-3"}`}>
              {expert.bio}
            </p>
            <button 
              onClick={() => setBioExpanded(!bioExpanded)}
              className="text-[13px] font-bold text-accent hover:text-accent-hover flex items-center gap-[4px] w-fit mt-[4px]"
            >
              {bioExpanded ? (
                <>Read Less <ChevronUp className="w-[14px] h-[14px]" /></>
              ) : (
                <>Read More <ChevronDown className="w-[14px] h-[14px]" /></>
              )}
            </button>
          </div>

          {/* Credentials Info */}
          <div className="flex flex-col gap-[12px] bg-white border border-border p-[20px] rounded-xl shadow-sm">
            <h3 className="text-[16px] font-bold text-primary">Verified Credentials</h3>
            <ul className="flex flex-col gap-[8px]">
              {expert.credentials.map((cred, i) => (
                <li key={i} className="flex items-start gap-[8px] text-[13.5px] text-primary">
                  <ShieldCheck className="w-[18px] h-[18px] text-success shrink-0 mt-[2px]" />
                  <span>{cred}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages spoken */}
          <div className="flex items-center gap-[8px] text-[13.5px] text-muted font-semibold">
            <Languages className="w-[18px] h-[18px] text-accent shrink-0" />
            <span>Languages: {expert.languages.join(", ")}</span>
          </div>

        </div>

        {/* RIGHT BOOKING CARD (5 cols, sticky on scroll) */}
        <div id="booking-card" className="lg:col-span-5 lg:sticky lg:top-[88px] bg-white border border-border rounded-xl p-[24px] shadow-premium flex flex-col gap-[20px]">
          {role === 'expert' ? (
            <div className="flex flex-col gap-4 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-accent flex items-center justify-center mx-auto mb-2">
                <ShieldCheck size={24} />
              </div>
              {user?.id === expert.id ? (
                <>
                  <h3 className="text-[18px] font-bold text-primary">Your Public Profile</h3>
                  <p className="text-[13px] text-muted leading-relaxed">
                    This is how clients see your profile on Sessionly. To customize your services, edit your bio, or update availability, please go to your dashboard.
                  </p>
                  <Button variant="primary" className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] mt-2 font-bold" asChild>
                    <Link href="/expert/dashboard">Go to Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-[18px] font-bold text-primary">Booking Disabled</h3>
                  <p className="text-[13px] text-muted leading-relaxed">
                    You are logged in as an expert. Booking sessions is only available for corporate and business client accounts.
                  </p>
                  <Button variant="outline" className="border-border text-primary hover:bg-bg rounded-lg h-[44px] mt-2 font-bold" asChild>
                    <Link href="/expert/dashboard">Go to Dashboard</Link>
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-[18px] font-bold text-primary mb-[4px]">Book a Session</h3>
                <p className="text-[12px] text-muted">Select duration and pick your preferred slot.</p>
              </div>

              {/* Session Types (15 / 30 / 60 min) */}
              <div className="flex flex-col gap-[8px]">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Select Duration</span>
                <div className="flex flex-col gap-[8px]">
                  {[
                    { min: 15 as const, price: price15 },
                    { min: 30 as const, price: price30 },
                    { min: 60 as const, price: price60 }
                  ].map((type) => {
                    const isSelected = selectedDuration === type.min;
                    return (
                      <button
                        key={type.min}
                        onClick={() => {
                          setSelectedDuration(type.min);
                          setSelectedDate(null);
                          setSelectedTime(null);
                        }}
                        className={`flex justify-between items-center px-[16px] h-[48px] rounded-lg border text-[13.5px] font-semibold transition-all ${
                          isSelected 
                            ? "border-accent bg-blue-50/50 text-accent" 
                            : "border-border text-primary hover:bg-bg"
                        }`}
                      >
                        <span>{type.min} min Session</span>
                        <span className="font-mono">₹{type.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Slot Picker (inline grid) */}
              <div className="flex flex-col gap-[8px] border-t border-border pt-[16px]">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Select Date (June 2026)</span>
                <div className="grid grid-cols-4 gap-[8px]">
                  {availableDays.map((day) => {
                    const isSelected = selectedDate === day;
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedTime(null);
                        }}
                        className={`h-[48px] text-[13px] font-bold rounded-lg border font-mono transition-all ${
                          isSelected 
                            ? "border-accent bg-accent text-white shadow-sm" 
                            : "border-border text-primary hover:bg-bg bg-white"
                        }`}
                      >
                        {day} Jun
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slot picker */}
              {selectedDate && (
                <div className="flex flex-col gap-[8px] border-t border-border pt-[16px] animate-page-enter">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Available Times (IST)</span>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`h-[48px] text-[13px] font-bold rounded-lg border transition-all ${
                            isSelected 
                              ? "border-accent bg-accent text-white shadow-sm" 
                              : "border-border text-primary hover:bg-bg"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Confirm & Book CTA */}
              <div className="border-t border-border pt-[16px] flex flex-col gap-[12px]">
                {selectedDate && selectedTime && (
                  <div className="bg-bg p-[12px] rounded-lg border border-border flex justify-between items-center text-[13px] font-semibold animate-page-enter">
                    <span className="text-muted">Selected Slot:</span>
                    <span className="text-primary font-mono">{selectedDate} Jun @ {selectedTime} ({selectedDuration} min)</span>
                  </div>
                )}
                
                <Button 
                  variant="primary" 
                  className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[48px] font-bold w-full"
                  disabled={!selectedDate || !selectedTime}
                  asChild
                >
                  {selectedDate && selectedTime ? (
                    <Link href={`/book/${expert.id}?date=${selectedDate}&time=${encodeURIComponent(selectedTime)}&duration=${selectedDuration}`}>
                      Book This Session &rarr;
                    </Link>
                  ) : (
                    <span className="opacity-50 cursor-not-allowed">Book This Session</span>
                  )}
                </Button>
                <p className="text-[11px] text-muted text-center leading-none">
                  You won't be charged until after the session
                </p>
              </div>
            </>
          )}
        </div>

      </div>

      {/* TABS BELOW: About · Reviews · Availability */}
      <div className="border-t border-border pt-[40px] mt-[24px]">
        {/* Tabs Headers */}
        <div className="flex border-b border-border mb-[24px] gap-[24px]">
          {[
            { id: "about", label: "About" },
            ...(SHOW_RATINGS_AND_REVIEWS ? [{ id: "reviews", label: "Reviews" }] : []),
            { id: "availability", label: "Availability" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-[12px] text-[14px] font-bold transition-all relative ${
                activeTab === tab.id 
                  ? "text-accent border-b-2 border-accent" 
                  : "text-muted hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="min-h-[200px]">
          
          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] animate-page-enter">
              {/* Areas of expertise */}
              <div className="flex flex-col gap-[16px]">
                <h4 className="text-[16px] font-bold text-primary">Areas of Expertise</h4>
                <div className="flex flex-wrap gap-[8px]">
                  {expert.skills.map((skill, idx) => (
                    <span key={idx} className="bg-bg text-primary border border-border text-[13px] font-semibold px-[12px] py-[6px] rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience timeline & Certifications */}
              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[16px]">
                  <h4 className="text-[16px] font-bold text-primary">Experience Timeline</h4>
                  <div className="flex flex-col gap-[12px]">
                    {expert.experience.map((exp, idx) => (
                      <div key={idx} className="flex gap-[16px] items-start">
                        <span className="font-mono text-[13px] text-accent bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg shrink-0 mt-[2px]">{exp.year}</span>
                        <div>
                          <h5 className="text-[14px] font-bold text-primary">{exp.role}</h5>
                          <p className="text-[12px] text-muted">{exp.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-[16px]">
                  <h4 className="text-[16px] font-bold text-primary">Certifications</h4>
                  <div className="flex flex-col gap-[12px]">
                    {expert.certifications.map((cert, idx) => (
                      <div key={idx} className="flex gap-[16px] items-start">
                        <span className="font-mono text-[13px] text-success bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg shrink-0 mt-[2px]">{cert.year}</span>
                        <div>
                          <h5 className="text-[14px] font-bold text-primary">{cert.name}</h5>
                          <p className="text-[12px] text-muted">{cert.issuer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {SHOW_RATINGS_AND_REVIEWS && activeTab === "reviews" && (
            <div className="flex flex-col gap-[32px] animate-page-enter">
              {/* Rating breakdown */}
              <div className="bg-bg border border-border p-[24px] rounded-xl flex flex-col md:flex-row items-center gap-[32px] max-w-[500px]">
                <div className="text-center">
                  <span className="text-[48px] font-bold text-primary leading-none">{expert.rating}</span>
                  <div className="flex gap-[2px] justify-center mt-[8px]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-[16px] h-[16px] text-warning fill-warning" />
                    ))}
                  </div>
                  <span className="text-[12px] text-muted mt-[4px] block font-mono">({expert.reviewsCount} reviews)</span>
                </div>

                <div className="flex-grow w-full flex flex-col gap-[6px]">
                  {[
                    { stars: 5, width: "85%", count: Math.round(expert.reviewsCount * 0.85) },
                    { stars: 4, width: "12%", count: Math.round(expert.reviewsCount * 0.12) },
                    { stars: 3, width: "3%", count: Math.round(expert.reviewsCount * 0.03) },
                    { stars: 2, width: "0%", count: 0 },
                    { stars: 1, width: "0%", count: 0 }
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-[12px] text-[12px]">
                      <span className="w-[16px] font-semibold">{row.stars}★</span>
                      <div className="flex-1 h-[8px] bg-white rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-accent rounded-full" style={{ width: row.width }} />
                      </div>
                      <span className="w-[24px] font-mono text-muted text-right">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards list */}
              <div className="flex flex-col gap-[16px]">
                {[
                  { name: "Siddharth P.", company: "Founder, SaaS India", date: "June 08, 2026", text: "Rahul resolved our corporate tax mapping issue in 15 minutes. Incredibly professional, straight to the point.", rating: 5, initial: "SP" },
                  { name: "Neha C.", company: "VP Operations, FinCo", date: "May 24, 2026", text: "We were confused about standard legal structures for founder stock vesting. Arjun provided exact drafts.", rating: 5, initial: "NC" },
                  { name: "Aman T.", company: "CTO, QuickPay", date: "April 11, 2026", text: "Neha clarified system database scaling lag in a single session. Highly recommend booking her for system design.", rating: 5, initial: "AT" }
                ].slice(0, reviewsVisible).map((rev, idx) => (
                  <div key={idx} className="bg-white border border-border p-[20px] rounded-xl shadow-sm flex flex-col gap-[12px]">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-bg text-primary border border-border flex items-center justify-center font-bold text-[13px]">
                          {rev.initial}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-primary">{rev.name}</h4>
                          <span className="text-[12px] text-muted">{rev.company}</span>
                        </div>
                      </div>
                      <span className="text-[12px] text-muted font-mono">{rev.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-[8px]">
                      <div className="flex gap-[2px]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-[12px] h-[12px] text-warning fill-warning" />
                        ))}
                      </div>
                    </div>

                    <p className="text-[13.5px] text-primary leading-relaxed line-clamp-3">
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>

              {reviewsVisible < 3 && (
                <div className="flex justify-center">
                  <Button variant="outline" className="border-border text-primary font-semibold" onClick={() => setReviewsVisible(prev => prev + 3)}>
                    Load More Reviews
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* AVAILABILITY TAB */}
          {activeTab === "availability" && (
            <div className="flex flex-col gap-[16px] animate-page-enter max-w-[500px]">
              <h4 className="text-[16px] font-bold text-primary">Regular Consulting Hours</h4>
              <p className="text-[14px] text-muted">Weekly active intervals during which the expert accepts bookings.</p>
              
              <div className="border border-border rounded-xl bg-white divide-y divide-border">
                {[
                  { day: "Monday - Friday", hours: "10:00 AM - 1:00 PM, 3:00 PM - 7:00 PM IST" },
                  { day: "Saturday", hours: "11:00 AM - 2:00 PM IST" },
                  { day: "Sunday", hours: "Unavailable" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-[16px] text-[13.5px]">
                    <span className="font-bold text-primary">{item.day}</span>
                    <span className="font-mono text-muted text-right">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      {role !== 'expert' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-[20px] py-[16px] flex items-center justify-between z-40 shadow-lg">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted font-semibold">Pricing from:</span>
            <span className="text-[18px] font-bold text-primary font-mono">₹{expert.price} <span className="text-[12px] font-normal text-muted">/ session</span></span>
          </div>
          <Button 
            variant="primary" 
            className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] px-[20px] font-bold text-[14px]"
            onClick={() => {
              // Scroll right booking card into view or select slots
              const element = document.getElementById("booking-card");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: 400, behavior: "smooth" });
              }
            }}
          >
            Book Session
          </Button>
        </div>
      )}

    </div>
  );
}
