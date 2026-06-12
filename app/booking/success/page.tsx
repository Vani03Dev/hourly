import React from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2, CalendarPlus, Download, Video, Copy } from 'lucide-react';

export default function BookingSuccess() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-[24px]">
      <div className="bg-white border border-gray-200 rounded-[16px] p-[40px] max-w-[600px] w-full shadow-raised text-center animate-page-enter">
        
        <div className="flex justify-center mb-[24px]">
          <div className="w-[80px] h-[80px] rounded-full bg-[#ECFDF5] flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green" />
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-navy mb-[12px]">Session Confirmed</h1>
        <p className="text-[16px] text-gray-500 mb-[32px] max-w-[400px] mx-auto">
          Your 30-minute consultation with Priya Menon is scheduled for Tue, Oct 13 at 02:00 PM (IST).
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-[24px] mb-[32px] text-left">
          <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-[12px]">Meeting Link</div>
          <div className="flex items-center gap-[12px] bg-white border border-gray-300 rounded-[8px] p-[12px]">
            <Video size={20} className="text-teal" />
            <div className="flex-1 font-mono text-[14px] text-navy">meet.google.com/xyz-abcd-efg</div>
            <button className="text-gray-400 hover:text-navy"><Copy size={18} /></button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-[16px] justify-center mb-[32px]">
          <Button variant="outline" size="lg" className="h-[48px] px-[24px] flex items-center gap-[8px]">
            <CalendarPlus size={18} /> Add to Calendar
          </Button>
          <Button variant="outline" size="lg" className="h-[48px] px-[24px] flex items-center gap-[8px]">
            <Download size={18} /> Download GST Invoice
          </Button>
        </div>

        <div className="w-full h-[1px] bg-gray-100 mb-[24px]" />

        <Button asChild variant="ghost" className="text-[15px] font-semibold text-teal hover:underline">
          <Link href="/dashboard">Return to Dashboard &rarr;</Link>
        </Button>

      </div>
    </div>
  );
}
