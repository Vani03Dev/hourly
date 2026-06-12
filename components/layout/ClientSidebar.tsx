"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Wallet, FileText, Users, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createClient } from '@/utils/supabase/client';

export function ClientSidebar() {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    async function fetchClientProfile() {
      if (!user?.id) return;
      const supabase = createClient();
      const { data } = await supabase
        .from('client_profiles')
        .select('company_name')
        .eq('id', user.id)
        .single();
      
      if (data) setClientData(data);
    }
    fetchClientProfile();
  }, [user]);

  const companyName = clientData?.company_name || "Your Workspace";

  const navItems = [
    { icon: <Home size={18} />, label: 'Overview', href: '/dashboard' },
    { icon: <Calendar size={18} />, label: 'Bookings', href: '/dashboard/bookings' },
    { icon: <Wallet size={18} />, label: 'Billing & Payments', href: '/dashboard/billing' },
    { icon: <FileText size={18} />, label: 'GST Invoices', href: '/dashboard/invoices' },
    { icon: <Users size={18} />, label: 'Team Members', href: '/dashboard/team' },
    { icon: <Settings size={18} />, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-border hidden md:flex flex-col sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto px-4 py-8">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-10 h-10 rounded-[10px] bg-navy-DEFAULT text-white flex items-center justify-center font-bold text-lg font-serif italic">
          {companyName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-[14px] font-bold text-navy-DEFAULT truncate max-w-[150px]">{companyName}</div>
          <div className="text-[12px] text-text-muted">Client Portal</div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={`flex items-center gap-3 h-[44px] px-3 rounded-[8px] text-[14px] font-medium transition-all ${
                isActive 
                  ? 'bg-teal-DEFAULT/10 text-teal-DEFAULT font-semibold' 
                  : 'text-text-sub hover:bg-surface-2 hover:text-navy-DEFAULT'
              }`}
            >
              <div className={isActive ? "text-teal-DEFAULT" : "text-text-muted"}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
