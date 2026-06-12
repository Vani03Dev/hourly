"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Calendar as CalendarIcon, Clock, Video, FileText, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const slideRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const slideLeft = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);

  const expert = {
    name: 'Priya Menon',
    title: 'Ex-Stripe Staff Engineer',
    price: 1500,
  };

  const gst = Math.round(expert.price * 0.18);
  const total = expert.price + gst;

  // Mock days for calendar
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [
    { date: 12, day: 2, available: false },
    { date: 13, day: 3, available: true, selected: true },
    { date: 14, day: 4, available: true },
    { date: 15, day: 5, available: true },
    { date: 16, day: 6, available: false },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 pt-[40px] pb-[80px] overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-[24px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-[8px] text-[14px] text-gray-500 mb-[32px]">
          <Link href={`/${unwrappedParams.id}`} className="hover:text-navy hover:underline">{expert.name}</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-navy">Book Session</span>
        </div>

        <h1 className="text-[32px] font-bold text-navy mb-[32px]">Select a Time</h1>

        <div className="flex flex-col md:flex-row gap-[32px]">
          
          {/* LEFT: Calendar */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={slideRight}
            className="flex-1 bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-sm"
          >
            
            <div className="flex justify-between items-center mb-[24px]">
              <h2 className="text-[18px] font-bold text-navy flex items-center gap-[8px]">
                <CalendarIcon size={20} className="text-teal" /> October 2026
              </h2>
              <div className="flex gap-[8px]">
                <button className="w-[32px] h-[32px] rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-navy hover:border-gray-300">&lt;</button>
                <button className="w-[32px] h-[32px] rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-navy hover:border-gray-300">&gt;</button>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="grid grid-cols-7 gap-[8px] mb-[32px]"
            >
              {days.map(d => (
                <div key={d} className="text-center text-[13px] font-semibold text-gray-400 mb-[8px]">{d}</div>
              ))}
              
              {/* Empty slots for start of month */}
              <div className="col-span-2"></div>

              {dates.map((d, i) => (
                <button 
                  key={i} 
                  disabled={!d.available}
                  className={`h-[48px] rounded-[8px] flex items-center justify-center font-semibold text-[15px] transition-all ${
                    d.selected ? 'bg-teal text-white shadow-md ring-2 ring-teal ring-offset-2' :
                    d.available ? 'bg-gray-50 text-navy border border-transparent hover:border-teal hover:bg-teal hover:bg-opacity-5' :
                    'bg-transparent text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {d.date}
                </button>
              ))}
            </motion.div>

            <div className="w-full h-[1px] bg-gray-100 mb-[32px]" />

            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h3 className="text-[16px] font-bold text-navy mb-[16px]">Tuesday, Oct 13</h3>
              <div className="grid grid-cols-3 gap-[12px]">
                {['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map((time, i) => (
                  <button 
                    key={time} 
                    className={`h-[44px] rounded-[8px] border font-semibold text-[14px] transition-all ${
                      i === 2 ? 'border-teal bg-teal text-white shadow-md ring-2 ring-teal ring-offset-1' : 'border-gray-200 text-gray-700 hover:border-teal hover:bg-teal hover:bg-opacity-5 hover:text-teal'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT: Summary & Payment */}
          <div className="w-full md:w-[380px]">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={slideLeft}
              className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-sm sticky top-[104px]"
            >
              
              <div className="flex items-center gap-[16px] mb-[24px]">
                <div className="w-[48px] h-[48px] rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-[20px]">
                  {expert.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[16px] font-bold text-navy">{expert.name}</div>
                  <div className="text-[13px] text-gray-500">30 Min Consultation</div>
                </div>
              </div>

              <div className="flex flex-col gap-[12px] bg-gray-50 rounded-[8px] p-[16px] mb-[24px]">
                <div className="flex items-center gap-[12px] text-[14px] text-gray-700">
                  <CalendarIcon size={16} className="text-gray-400" /> Tue, Oct 13, 2026
                </div>
                <div className="flex items-center gap-[12px] text-[14px] text-gray-700">
                  <Clock size={16} className="text-gray-400" /> 02:00 PM - 02:30 PM (IST)
                </div>
                <div className="flex items-center gap-[12px] text-[14px] text-gray-700">
                  <Video size={16} className="text-gray-400" /> Google Meet link upon payment
                </div>
              </div>

              <div className="flex flex-col gap-[12px] mb-[24px]">
                <div className="flex justify-between text-[14px] text-gray-600">
                  <span>Session Fee</span>
                  <span>₹{expert.price}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-600">
                  <span className="flex items-center gap-[6px]">GST (18%) <Badge variant="itc" shape="rect" className="!px-[4px] !py-[2px] !text-[9px]">ITC</Badge></span>
                  <span>₹{gst}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-200 my-[4px]" />
                <div className="flex justify-between text-[16px] font-bold text-navy">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="bg-[#F5F3FF] border border-[#E0D4FF] rounded-[8px] p-[16px] mb-[24px]">
                <div className="flex justify-between items-center mb-[8px]">
                  <div className="text-[13px] font-bold text-[#5B21B6]">Team Wallet Balance</div>
                  <div className="text-[13px] font-bold text-[#5B21B6]">₹18,500</div>
                </div>
                <div className="text-[12px] text-[#7C3AED]">
                  Sufficient funds. Deduction will be automatic.
                </div>
              </div>

              <label className="flex items-start gap-[12px] cursor-pointer mb-[24px]">
                <input type="checkbox" className="mt-[4px] w-[16px] h-[16px] accent-teal" defaultChecked />
                <span className="text-[13px] text-gray-600 leading-[1.5]">
                  I agree to the <a href="#" className="text-teal hover:underline">Cancellation Policy</a>. Rescheduling requires 24h notice.
                </span>
              </label>

              <Button size="lg" fullWidth asChild>
                <Link href="/booking/success">Pay ₹{total} & Book Session</Link>
              </Button>
              
              <div className="flex items-center justify-center gap-[8px] mt-[16px] text-[13px] text-gray-400">
                <FileText size={14} /> GST Invoice sent to billing@acme.com
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
