"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Star, 
  Eye, 
  Check, 
  AlertCircle,
  HelpCircle,
  Video,
  ChevronRight,
  TrendingUp,
  Settings,
  Bell,
  ArrowUpRight
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";

// Sidebar Links Configuration
const SIDEBAR_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Sessions", icon: Calendar },
  { label: "Payouts", icon: DollarSign },
  { label: "Reviews", icon: Star },
  { label: "Settings", icon: Settings }
];

// Mock Client Sessions
const INITIAL_CLIENT_SESSIONS = [
  {
    id: "cs1",
    client: "SaaS Builders Inc.",
    topic: "GST compliance sync",
    dateTime: "15 June 2026, 10:00 AM IST",
    duration: "30 Min",
    earnings: "₹999",
    roomUrl: "/room/gst-session-1"
  },
  {
    id: "cs2",
    client: "Alpha FinTech",
    topic: "Cap table advisory",
    dateTime: "19 June 2026, 4:30 PM IST",
    duration: "60 Min",
    earnings: "₹1,999",
    roomUrl: "/room/cap-session-2"
  }
];

// Earnings over the last 6 months
const EARNINGS_HISTORY = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 18000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 22000 },
  { month: "May", amount: 28000 },
  { month: "Jun", amount: 32000 }
];

// 3 Latest Reviews
const RECENT_REVIEWS = [
  {
    rating: 5,
    comment: "Rahul's advice on corporate taxation was spot-on. He understood our structural problem instantly.",
    client: "Siddharth P. (Founder)"
  },
  {
    rating: 5,
    comment: "Extremely professional CA. Resolved our inter-state GST credit issue within 10 minutes.",
    client: "Neha C. (Ops Lead)"
  },
  {
    rating: 4,
    comment: "Very clear advice. We saved days of reading through tax circulars.",
    client: "Aman T. (CTO)"
  }
];

export default function ExpertDashboard() {
  const [acceptingBookings, setAcceptingBookings] = useState(true);
  const [balance, setBalance] = useState(18500);
  const [isWithdrawn, setIsWithdrawn] = useState(false);

  const handleWithdraw = () => {
    if (balance <= 0) return;
    if (confirm(`Withdraw ₹${balance} to your linked bank account?`)) {
      setBalance(0);
      setIsWithdrawn(true);
    }
  };

  return (
    <div className="bg-bg min-h-screen flex w-full font-sans">

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-grow p-[24px] md:p-[40px] flex flex-col gap-[32px] max-w-[1200px] overflow-hidden">
        
        {/* TOP HEADER WITH AVAILABILITY TOGGLE */}
        <div className="flex justify-between items-center border-b border-border pb-[20px] flex-wrap gap-[16px]">
          <div>
            <h1 className="text-[24px] font-bold text-primary">Expert Overview</h1>
            <p className="text-[13px] text-muted mt-[4px]">Manage your consulting sessions, payouts, and availability preferences.</p>
          </div>
          
          {/* Availability Toggle */}
          <div className="flex items-center gap-[12px] bg-white border border-border px-[16px] h-[48px] rounded-lg shadow-sm">
            <span className="text-[13px] font-bold text-primary">Accepting Bookings</span>
            <button 
              onClick={() => setAcceptingBookings(!acceptingBookings)}
              className={`w-[48px] h-[24px] rounded-full p-[2px] transition-colors focus:outline-none relative ${
                acceptingBookings ? "bg-success" : "bg-muted"
              }`}
            >
              <div 
                className={`w-[20px] h-[20px] bg-white rounded-full transition-transform ${
                  acceptingBookings ? "translate-x-[24px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* TOP STATS ROW (4 cards) */}
        <div className={`grid grid-cols-2 gap-[16px] ${SHOW_RATINGS_AND_REVIEWS ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {[
            { label: "Earnings (This Month)", value: "₹32,000", icon: DollarSign, color: "text-success", mono: true },
            { label: "Sessions Done", value: "24", icon: Calendar, color: "text-accent", mono: true },
            ...(SHOW_RATINGS_AND_REVIEWS ? [{ label: "Average Rating", value: "4.9★", icon: Star, color: "text-warning", mono: true }] : []),
            { label: "Profile Views", value: "1,240", icon: Eye, color: "text-accent", mono: true }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-border rounded-xl p-[20px] shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[12px] text-muted font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className={`text-[20px] font-bold text-primary mt-[8px] ${stat.mono ? "font-mono" : ""}`}>{stat.value}</span>
                </div>
                <div className="w-[36px] h-[36px] bg-bg border border-border rounded-lg flex items-center justify-center shrink-0">
                  <Icon className={`w-[18px] h-[18px] ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CLIENT SESSIONS (table) */}
        <div className="bg-white border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-[20px] border-b border-border">
            <h3 className="text-[16px] font-bold text-primary">Your Client Sessions</h3>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg text-[11px] font-bold text-muted uppercase tracking-wider border-b border-border">
                  <th className="p-[16px]">Client</th>
                  <th className="p-[16px]">Topic</th>
                  <th className="p-[16px]">Date & Time</th>
                  <th className="p-[16px] text-center">Duration</th>
                  <th className="p-[16px] text-right">Earnings</th>
                  <th className="p-[16px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INITIAL_CLIENT_SESSIONS.map((row) => (
                  <tr key={row.id} className="hover:bg-bg/50 transition-colors text-[13.5px]">
                    <td className="p-[16px] font-bold text-primary">{row.client}</td>
                    <td className="p-[16px] text-muted line-clamp-1 max-w-[200px]">{row.topic}</td>
                    <td className="p-[16px] font-mono text-primary">{row.dateTime}</td>
                    <td className="p-[16px] text-center font-mono text-muted">{row.duration}</td>
                    <td className="p-[16px] text-right font-mono font-bold text-success">{row.earnings}</td>
                    <td className="p-[16px] text-right">
                      <div className="flex justify-end gap-[12px] items-center">
                        <Link href={row.roomUrl} className="text-success hover:underline font-bold flex items-center gap-[4px]">
                          <Video className="w-[14px] h-[14px]" /> Join Room
                        </Link>
                        <button className="text-muted hover:text-primary font-semibold">Reschedule</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TWO COLUMN LOWER CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start">
          
          {/* EARNINGS CHART (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-border rounded-xl shadow-sm p-[24px] flex flex-col gap-[20px]">
            <div>
              <h3 className="text-[16px] font-bold text-primary">Earnings History (Last 6 Months)</h3>
              <p className="text-[12px] text-muted mt-[2px]">Billed session earnings before payout taxes.</p>
            </div>

            {/* Simple bar chart mockup (HTML bars) */}
            <div className="flex items-end justify-between h-[200px] pt-[24px] px-[16px] bg-bg border border-border rounded-xl">
              {EARNINGS_HISTORY.map((hist, i) => {
                // Calculate height percentage based on max value (32000)
                const heightPercent = (hist.amount / 32000) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-[12px] flex-grow">
                    <span className="text-[10px] font-mono font-bold text-primary">₹{(hist.amount / 1000)}k</span>
                    <div 
                      className="w-[28px] sm:w-[36px] bg-accent rounded-t-md hover:bg-accent-hover transition-colors"
                      style={{ height: `${heightPercent * 1.2}px` }}
                    />
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider">{hist.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAYOUT SECTION & RECENT REVIEWS (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-[32px]">
            
            {/* Payout Section */}
            <div className="bg-white border border-border rounded-xl shadow-sm p-[24px] flex flex-col gap-[16px]">
              <h3 className="text-[16px] font-bold text-primary border-b border-border pb-[12px]">Withdraw Balance</h3>
              
              <div className="flex justify-between items-center bg-bg p-[16px] rounded-xl border border-border">
                <div className="flex flex-col">
                  <span className="text-[12px] text-muted font-bold">Balance Available</span>
                  <span className="text-[24px] font-bold text-primary font-mono mt-[4px]">₹{balance}</span>
                </div>
                
                <Button 
                  variant="primary" 
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg h-[40px] px-6 font-bold"
                  onClick={handleWithdraw}
                  disabled={balance <= 0}
                >
                  Withdraw
                </Button>
              </div>

              {isWithdrawn && (
                <div className="bg-green-50 border border-green-200 text-success p-[12px] rounded-lg text-[12px] font-semibold flex items-center gap-[6px]">
                  <Check className="w-[14px] h-[14px]" /> Withdrawal initiated successfully. Funds arrive in 24 hours.
                </div>
              )}

              <div className="flex items-center gap-[8px] text-[12px] text-muted font-semibold">
                <Check className="w-[14px] h-[14px] text-success shrink-0" />
                <span>Razorpay bank account linked (ID: **4321)</span>
              </div>
            </div>

            {/* Recent Reviews list */}
            {SHOW_RATINGS_AND_REVIEWS && (
            <div className="bg-white border border-border rounded-xl shadow-sm p-[24px] flex flex-col gap-[16px]">
              <h3 className="text-[16px] font-bold text-primary border-b border-border pb-[12px]">Latest Reviews</h3>
              <div className="flex flex-col gap-[12px]">
                {RECENT_REVIEWS.map((rev, i) => (
                  <div key={i} className="flex flex-col gap-[6px] border-b border-border pb-[12px] last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-[2px]">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} className="w-[12px] h-[12px] text-warning fill-warning" />
                        ))}
                      </div>
                      <span className="text-[11px] text-muted font-semibold">{rev.client}</span>
                    </div>
                    <p className="text-[13px] text-primary italic leading-relaxed line-clamp-2">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
