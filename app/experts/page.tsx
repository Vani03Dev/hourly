import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

export default function ForExpertsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-white py-[80px] md:py-[120px] px-[24px] md:px-[96px]">
        <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto gap-[64px] items-center">
          
          {/* LEFT COLUMN */}
          <div className="w-full md:w-[55%] flex flex-col justify-center">
            <div className="text-[12px] font-semibold text-teal tracking-[1.4px] uppercase mb-[16px]">
              APPLY TO BECOME AN EXPERT
            </div>
            <h1 className="text-[40px] md:text-[48px] font-bold text-navy leading-[1.15]">
              Monetize Your Expertise.<br />
              Zero Admin Work.
            </h1>
            <p className="text-[18px] text-gray-600 leading-[1.7] max-w-[480px] mt-[20px]">
              Join the most exclusive network of tech and finance professionals in India. 
              We handle the GST invoicing, scheduling, and payments so you can focus on advising.
            </p>

            <div className="flex flex-col sm:flex-row gap-[16px] mt-[32px]">
              <Button size="lg" asChild>
                <Link href="/onboarding">Apply to Join</Link>
              </Button>
            </div>

            <div className="flex flex-col gap-[16px] mt-[40px]">
              <div className="flex items-center gap-[12px]">
                <CheckCircle2 size={20} className="text-green" />
                <span className="text-[15px] font-medium text-navy">Set your own rates and availability</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <CheckCircle2 size={20} className="text-green" />
                <span className="text-[15px] font-medium text-navy">Get paid out directly to your bank account</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <CheckCircle2 size={20} className="text-green" />
                <span className="text-[15px] font-medium text-navy">We generate compliant GST invoices for clients</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full md:w-[45%]">
            <div className="bg-gray-50 rounded-[12px] p-[32px] border border-gray-200">
              <h3 className="text-[20px] font-bold text-navy mb-[24px]">How it works for Experts</h3>
              
              <div className="flex flex-col gap-[24px]">
                <div className="flex gap-[16px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-teal bg-opacity-10 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-teal" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-navy">1. Apply & Get Vetted</h4>
                    <p className="text-[14px] text-gray-600 mt-[4px]">We review your LinkedIn and credentials. Only top 5% are accepted to maintain quality.</p>
                  </div>
                </div>

                <div className="flex gap-[16px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-teal bg-opacity-10 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-teal" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-navy">2. Sync Calendar</h4>
                    <p className="text-[14px] text-gray-600 mt-[4px]">Connect Google Calendar. Set your active hours and minimum notice periods.</p>
                  </div>
                </div>

                <div className="flex gap-[16px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-teal bg-opacity-10 flex items-center justify-center shrink-0">
                    <DollarSign size={20} className="text-teal" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-navy">3. Advise & Earn</h4>
                    <p className="text-[14px] text-gray-600 mt-[4px]">Start taking calls. We take a flat 5% platform fee from bookings. No hidden costs.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
