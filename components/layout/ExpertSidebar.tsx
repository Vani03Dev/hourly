"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Wallet, FileText, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export function ExpertSidebar() {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || "Expert";

  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', href: '/expert/dashboard' },
    { icon: <Calendar size={18} />, label: 'Availability', href: '/expert/availability' },
    { icon: <Wallet size={18} />, label: 'Payouts', href: '/expert/payouts' },
    { icon: <FileText size={18} />, label: 'Services', href: '/expert/services' },
    { icon: <Settings size={18} />, label: 'Settings', href: '/expert/settings' },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-border hidden md:flex flex-col sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto px-4 py-8">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-10 h-10 rounded-[10px] bg-teal-DEFAULT text-white flex items-center justify-center font-bold text-lg font-serif italic">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-[14px] font-bold text-navy-DEFAULT truncate max-w-[150px]">{firstName}</div>
          <div className="text-[12px] text-text-muted">Expert Portal</div>
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
