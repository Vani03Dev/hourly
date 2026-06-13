"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Calendar, Users, CreditCard, Settings, LogOut } from 'lucide-react';
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const companyName = clientData?.company_name || "Acme Inc";
  const name = user?.user_metadata?.full_name || "Admin User";
  const initials = name.split(' ').map((n: string) => n[0]).join('');

  const navItems = [
    { icon: <Home size={18} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Search size={18} />, label: 'Find Experts', href: '/search' },
    { icon: <Calendar size={18} />, label: 'My Bookings', href: '/dashboard/bookings' },
    { icon: <Users size={18} />, label: 'Team Bookings', href: '/dashboard/team' },
    { icon: <CreditCard size={18} />, label: 'Wallet', href: '/dashboard/billing' },
    { 
      icon: <Settings size={18} />, 
      label: 'Admin Console', 
      href: '/dashboard/settings',
      badge: 'Admin'
    },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[64px] h-[calc(100vh-64px)] shrink-0 font-sans">
      
      {/* Top Workspace Header */}
      <div className="flex items-center gap-[12px] p-[24px] pb-[20px] border-b border-gray-100">
        <div className="w-[40px] h-[40px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[16px] font-sans">
          {companyName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold text-[#0F2137] truncate">{companyName}</div>
          <span className="bg-[#F5F3FF] text-[#5B21B6] px-[6px] py-[1px] rounded-[4px] text-[10px] font-bold uppercase tracking-wider">
            Workspace
          </span>
        </div>
      </div>
      
      {/* Nav List */}
      <nav className="flex flex-col gap-[2px] pt-[20px] px-[12px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={`flex items-center justify-between h-[40px] px-[14px] rounded-[10px] text-[14px] font-medium transition-all ${
                isActive 
                  ? 'bg-teal-50 text-teal font-semibold shadow-xs' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F2137]'
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <div className={isActive ? "text-teal" : "text-gray-400 group-hover:text-gray-600"}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-teal text-white text-[10px] font-bold px-[6px] py-[1px] rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="mt-auto p-[20px] border-t border-gray-100 flex flex-col gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <div className="w-[32px] h-[32px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[12px]">
            {initials.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[#0F2137] truncate">{name}</div>
            <div className="text-[11px] text-gray-400">Admin</div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-[8px] text-[13px] text-gray-500 hover:text-red transition-colors w-fit pl-[40px]"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
