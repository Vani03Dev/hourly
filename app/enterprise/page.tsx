import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Receipt, ShieldCheck, Users, Zap, Building2 } from 'lucide-react';

export default function EnterprisePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-navy py-[80px] md:py-[120px] px-[24px] md:px-[96px]">
        <div className="flex flex-col w-full max-w-[1000px] mx-auto items-center text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-teal bg-opacity-20 flex items-center justify-center mb-[24px]">
            <Building2 size={32} className="text-teal" />
          </div>
          <h1 className="text-[40px] md:text-[56px] font-bold text-white leading-[1.15]">
            Hourly for Enterprise
          </h1>
          <p className="text-[18px] md:text-[20px] text-gray-300 leading-[1.7] max-w-[680px] mt-[24px]">
            Empower your team to unblock themselves instantly. Centralized billing, hard spending limits, and automated ITC recovery for your finance team.
          </p>

          <div className="flex flex-col sm:flex-row gap-[16px] mt-[40px]">
            <Button size="lg" className="h-[56px] px-[32px] text-[16px]" asChild>
              <Link href="/onboarding">Setup Workspace</Link>
            </Button>
            <Button variant="outline" className="h-[56px] px-[32px] text-[16px] border-gray-600 text-white hover:bg-white hover:text-navy" asChild>
              <Link href="#">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHY FINANCE TEAMS APPROVE HOURLY */}
      <section className="bg-white py-[80px] px-[24px] md:px-[96px]">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-[32px] font-bold text-navy text-center mb-[48px]">Built for CFOs & Engineering Leaders</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
            {[
              {
                icon: <Receipt size={32} className="text-teal" />,
                title: "GST Invoice on Every Session",
                desc: "Every booking auto-generates a proper GST invoice. Claim ITC directly. Stop chasing employees for reimbursement receipts."
              },
              {
                icon: <ShieldCheck size={32} className="text-teal" />,
                title: "Invite-Only Verified Experts",
                desc: "Your team only talks to verified senior professionals. We check credentials so your engineering leads don't have to."
              },
              {
                icon: <Users size={32} className="text-teal" />,
                title: "Team Workspace & Shared Wallet",
                desc: "Load a single company wallet. Set per-employee monthly limits. Finance has a single dashboard for all external consulting spend."
              },
              {
                icon: <Zap size={32} className="text-teal" />,
                title: "Centralized Admin Console",
                desc: "Add or remove team members, adjust limits in real-time, and download consolidated monthly CSV exports for your accounting software."
              }
            ].map((feature, i) => (
               <div key={i} className="bg-gray-50 border border-gray-200 rounded-[12px] p-[40px]">
                <div className="mb-[24px]">{feature.icon}</div>
                <h3 className="text-[20px] font-bold text-navy mb-[12px]">{feature.title}</h3>
                <p className="text-[16px] text-gray-600 leading-[1.6]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
