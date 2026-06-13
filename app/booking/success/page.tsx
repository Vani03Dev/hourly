"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Check, 
  Calendar, 
  Video, 
  ArrowRight, 
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-[16px] text-gray-500 font-semibold animate-skeleton-pulse">Loading booking details...</div>
      </div>
    }>
      <BookingSuccessDetails />
    </Suspense>
  );
}

function BookingSuccessDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Grab details from redirection query parameters
  const dateParam = searchParams.get('date') || 'Feb 10';
  const timeParam = searchParams.get('time') || '11:00 AM';
  const durationParam = searchParams.get('duration') || '30';
  const expertName = searchParams.get('name') || 'Aditi Sharma';
  const expertTitle = searchParams.get('title') || 'Ex-Stripe Staff Engineer';
  const totalPaid = searchParams.get('total') || '630';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-[80px] px-[20px] font-sans selection:bg-teal selection:text-white">
      
      {/* SUCCESS CHECKMARK (Scale bounce animation) */}
      <motion.div 
        className="w-[80px] h-[80px] rounded-full bg-green flex items-center justify-center text-white shadow-level-2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.15, 0.95, 1] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Check size={40} className="stroke-[3px]" />
      </motion.div>

      {/* Title & Subtitle */}
      <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#0F2137] mt-[24px] text-center tracking-tight leading-none">
        Booking Confirmed!
      </h1>
      <p className="text-[17px] text-gray-500 mt-[8px] text-center max-w-[480px]">
        You're all set with <span className="font-bold text-[#0F2137]">{expertName}</span> on <span className="font-bold text-[#0F2137]">{dateParam} at {timeParam}</span>.
      </p>

      {/* Confirmation Card (Level 2 shadow) */}
      <div className="bg-white border border-gray-200 rounded-[12px] shadow-level-2 p-[32px] max-w-[520px] w-full mt-[32px]">
        {/* Expert Row */}
        <div className="flex items-center gap-[14px]">
          <div className="w-[52px] h-[52px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[18px]">
            {expertName.charAt(0)}
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#0F2137]">{expertName}</div>
            <div className="text-[13px] text-gray-400 font-semibold">{expertTitle}</div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gray-100 my-[20px]" />

        {/* Details list */}
        <div className="flex flex-col gap-[12px] mb-[20px]">
          {[
            { label: "Date", val: `${dateParam}, 2026` },
            { label: "Time", val: `${timeParam} (IST)` },
            { label: "Duration", val: `${durationParam} minutes` },
            { label: "Session Type", val: "1:1 Video Call" },
            { label: "Total Paid", val: `₹${totalPaid}` }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center text-[14px]">
              <span className="text-gray-400 font-semibold">{item.label}</span>
              <span className="font-bold text-[#0F2137]">{item.val}</span>
            </div>
          ))}
        </div>

        {/* Invoice row */}
        <div className="bg-[#ECFDF5] rounded-[10px] p-[12px] px-[16px] flex justify-between items-center border border-green/20">
          <div className="flex items-center gap-[8px] text-[13px] text-[#064E3B] font-bold">
            <Receipt className="w-[16px] h-[16px]" />
            <span>Invoice #INV-2026-0312 generated</span>
          </div>
          <a href="#" className="text-[13px] font-bold text-teal hover:underline flex items-center gap-[2px]">
            Download PDF ↓
          </a>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex gap-[10px] mt-[28px] max-w-[520px] w-full">
        <Button variant="outline" size="xl" className="flex-grow flex items-center justify-center gap-[8px]">
          <Calendar className="w-[18px] h-[18px] text-gray-500" />
          Add to Calendar
        </Button>
        <Button variant="primary" size="xl" className="flex-grow flex items-center justify-center gap-[8px]" asChild>
          <Link href="/dashboard">
            <Video className="w-[18px] h-[18px]" />
            Join Call
          </Link>
        </Button>
      </div>

      {/* What's Next card */}
      <div className="bg-gray-50 border border-gray-100 rounded-[10px] p-[20px] mt-[16px] max-w-[520px] w-full">
        <h4 className="text-[14px] font-bold text-gray-700 mb-[12px]">What happens next</h4>
        <div className="flex flex-col gap-[10px]">
          {[
            "Calendar invitation with conference details has been sent to your inbox.",
            "The Jitsi meeting link will become active inside your dashboard 5 minutes prior to the session.",
            "GST invoice has been emailed to billing@acme.com for Input Tax Credit filing."
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-[10px] text-[13px] text-gray-500 leading-relaxed font-semibold">
              <span className="w-[6px] h-[6px] rounded-full bg-teal shrink-0 mt-[8px]" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
