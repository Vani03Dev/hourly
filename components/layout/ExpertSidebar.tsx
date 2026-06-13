"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Wallet, FileText, Settings, Video } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export function ExpertSidebar() {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || "Expert";

  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', href: '/expert/dashboard' },
    { icon: <Video size={18} />, label: 'Sessions', href: '/expert/sessions' },
    { icon: <Calendar size={18} />, label: 'Availability', href: '/expert/availability' },
    { icon: <Wallet size={18} />, label: 'Payouts', href: '/expert/payouts' },
    { icon: <FileText size={18} />, label: 'Services', href: '/expert/services' },
    { icon: <Settings size={18} />, label: 'Settings', href: '/expert/settings' },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-border hidden md:flex flex-col shrink-0 h-full overflow-y-auto px-4 py-8">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-10 h-10 rounded-[10px] bg-teal text-white flex items-center justify-center font-bold text-lg font-sans">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-[14px] font-bold text-primary truncate max-w-[150px]">{firstName}</div>
          <div className="text-[12px] text-muted">Expert Portal</div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-[2px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={`flex items-center gap-[10px] h-[40px] px-[14px] rounded-[10px] text-[14px] font-medium transition-all ${
                isActive 
                  ? 'bg-teal-50 text-teal font-semibold shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <div className={isActive ? "text-teal" : "text-gray-400"}>
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
