"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Search, Bell, Wallet, CalendarCheck, Building2, Settings, LogOut, Menu, X, LayoutDashboard, User as UserIcon, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { createClient } from "../../utils/supabase/client";
import { useCurrency } from "../../contexts/CurrencyContext";
import { Button } from "../ui/Button";

const CURRENCIES = {
  INR: "🇮🇳 INR",
  USD: "🇺🇸 USD",
  GBP: "🇬🇧 GBP",
  AED: "🇦🇪 AED",
  SGD: "🇸🇬 SGD"
};

export function Header() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // We can infer the role from the user metadata if available, or fall back to 'company'
  const role = user?.user_metadata?.role || 'company';

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAvatarDropdown(false);
  };
  const { currency, setCurrency } = useCurrency();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [avatarDropdown, setAvatarDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 h-[64px] bg-white/80 backdrop-blur-md shadow-xs border-b border-border flex items-center justify-center w-full">
        <div className="flex items-center justify-between px-6 md:px-8 w-full max-w-[1280px]">
          {/* LEFT */}
          <div className="flex items-center gap-2">
          <Zap className="w-[20px] h-[20px] text-teal-DEFAULT" />
          <Link href="/" className="text-[28px] font-bold text-navy-DEFAULT font-sans">
            Hourly
          </Link>
        </div>

        {/* CENTER (desktop) */}
        <div className="hidden md:flex flex-1 max-w-[320px] mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-text-muted" />
            <input
              type="text"
              placeholder="Search expertise or describe your problem..."
              className="w-full h-[40px] pl-10 pr-4 rounded-[6px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link href="/experts" className="text-[14px] font-medium text-text-sub hover:text-navy-DEFAULT">
                For Experts
              </Link>
              
              <div className="w-[1px] h-[20px] bg-border mx-2" />
              
              {/* Currency Selector */}
              <div className="relative">
                <button 
                  onClick={() => setCurrencyDropdown(!currencyDropdown)}
                  className="flex items-center text-[14px] text-text-body hover:bg-surface-DEFAULT px-2 py-1 rounded"
                >
                  {CURRENCIES[currency]}
                </button>
                {currencyDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-border shadow-md rounded-[6px] overflow-hidden z-50">
                    {(Object.entries(CURRENCIES) as [keyof typeof CURRENCIES, string][]).map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => { setCurrency(code); setCurrencyDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-[14px] hover:bg-surface-DEFAULT text-text-body"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild><Link href="/login">Log In</Link></Button>
                <Button variant="primary" size="sm" asChild><Link href="/signup">Get Started</Link></Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/search" className="text-[14px] font-medium text-text-sub hover:text-navy-DEFAULT">
                {role === 'company' ? 'Find Experts' : 'My Dashboard'}
              </Link>
              
              <div className="relative cursor-pointer hover:bg-surface-DEFAULT p-2 rounded-full">
                <Bell className="w-[20px] h-[20px] text-text-sub" />
                <span className="absolute top-[4px] right-[6px] w-[8px] h-[8px] bg-red-DEFAULT rounded-full"></span>
              </div>

              {/* Avatar Dropdown */}
              <div className="relative">
                <div 
                  onClick={() => setAvatarDropdown(!avatarDropdown)}
                  className="w-[32px] h-[32px] rounded-full bg-teal-bg text-teal-DEFAULT flex items-center justify-center font-bold text-[14px] cursor-pointer hover:bg-teal-light"
                >
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>

                {avatarDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-border shadow-lg rounded-[8px] overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold text-[14px] text-navy-DEFAULT truncate">{user?.user_metadata?.full_name || "User"}</p>
                      <p className="text-[12px] text-text-muted truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      {role === 'company' ? (
                        <>
                          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-[14px] text-text-body hover:bg-surface-DEFAULT rounded-[6px]"><CalendarCheck className="w-4 h-4"/> My Bookings</Link>
                          <Link href="/workspace" className="flex items-center gap-3 px-3 py-2 text-[14px] text-text-body hover:bg-surface-DEFAULT rounded-[6px]"><Building2 className="w-4 h-4"/> Workspace</Link>
                          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-[14px] text-text-body hover:bg-surface-DEFAULT rounded-[6px]"><Settings className="w-4 h-4"/> Settings</Link>
                        </>
                      ) : (
                        <>
                          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-[14px] text-text-body hover:bg-surface-DEFAULT rounded-[6px]"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
                          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-[14px] text-text-body hover:bg-surface-DEFAULT rounded-[6px]"><UserIcon className="w-4 h-4"/> Profile</Link>
                          <Link href="/payouts" className="flex items-center gap-3 px-3 py-2 text-[14px] text-text-body hover:bg-surface-DEFAULT rounded-[6px]"><CreditCard className="w-4 h-4"/> Payouts</Link>
                          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-[14px] text-text-body hover:bg-surface-DEFAULT rounded-[6px]"><Settings className="w-4 h-4"/> Settings</Link>
                        </>
                      )}
                    </div>
                    <div className="p-2 border-t border-border">
                      <button onClick={handleLogout} className="flex items-center w-full gap-3 px-3 py-2 text-[14px] text-red-DEFAULT hover:bg-red-bg rounded-[6px]">
                        <LogOut className="w-4 h-4"/> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="md:hidden w-[40px] h-[40px] flex items-center justify-center text-navy-DEFAULT hover:bg-surface-DEFAULT rounded-sm"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
        </div>
      </header>

      {/* MOBILE FULL SCREEN OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="flex items-center justify-between h-[64px] px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="w-[20px] h-[20px] text-teal-DEFAULT" />
              <span className="text-[28px] font-bold text-navy-DEFAULT font-sans">Hourly</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="w-[40px] h-[40px] flex items-center justify-center text-text-muted hover:bg-surface-DEFAULT rounded-sm">
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col mt-4">
            <Link href="/experts" className="flex items-center h-[56px] px-6 border-b border-border text-[16px] font-medium text-navy-DEFAULT" onClick={() => setMobileOpen(false)}>For Experts</Link>
            <div className="flex items-center h-[56px] px-6 border-b border-border text-[16px] font-medium text-navy-DEFAULT justify-between">
              Currency
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-transparent border-none text-text-body focus:outline-none"
              >
                {(Object.entries(CURRENCIES) as [keyof typeof CURRENCIES, string][]).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>
          </nav>

          <div className="mt-auto p-6 flex flex-col gap-4">
            {!isAuthenticated && (
              <>
                <Button variant="outline" fullWidth asChild><Link href="/login" onClick={() => setMobileOpen(false)}>Log In</Link></Button>
                <Button variant="primary" fullWidth asChild><Link href="/signup" onClick={() => setMobileOpen(false)}>Get Started Free</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
