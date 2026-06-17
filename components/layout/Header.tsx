"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const NAV_LINKS = [
  {
    href: "/experts",
    label: "Browse Experts",
    isActive: (path: string) => path === "/experts" || path.startsWith("/experts/"),
  },
  {
    href: "/how-it-works",
    label: "How It Works",
    isActive: (path: string) => path === "/how-it-works" || path.startsWith("/how-it-works/"),
  },
  {
    href: "/pricing",
    label: "Pricing",
    isActive: (path: string) => path === "/pricing" || path.startsWith("/pricing/"),
  },
];

function navLinkClass(isActive: boolean, mobile = false) {
  if (mobile) {
    return `text-[16px] font-semibold py-3 px-3 rounded-[10px] border-b border-gray-100 transition-colors ${
      isActive
        ? "text-accent bg-teal-50 border-accent/20"
        : "text-primary hover:bg-gray-50"
    }`;
  }
  return `text-[14px] font-semibold transition-colors tracking-snug px-3 py-1.5 rounded-[8px] ${
    isActive
      ? "text-accent bg-teal-50"
      : "text-muted hover:text-primary hover:bg-gray-50"
  }`;
}

export function Header() {
  const pathname = usePathname();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // We can infer the role from the user metadata if available, or fall back to 'company'

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAvatarDropdown(false);
    window.location.assign('/');
  };
  const { currency, setCurrency } = useCurrency();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [role, setRole] = useState<'company' | 'expert'>(user?.user_metadata?.role || 'company');

  React.useEffect(() => {
    async function checkRole() {
      if (!user) {
        setRole('company');
        return;
      }
      const supabase = createClient();
      const { data: eData } = await supabase.from('expert_profiles').select('id').eq('id', user.id).single();
      if (eData || user.user_metadata?.role === 'expert') {
        setRole('expert');
      } else {
        setRole('company');
      }
    }
    checkRole();
  }, [user]);

  const companyName = user?.user_metadata?.company_name || "Acme Inc";
  const initials = user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || user?.email?.charAt(0) || "U";

  return (
    <>
      <header className="sticky top-0 z-50 h-[64px] bg-white border-b border-border shadow-sm flex items-center justify-center w-full">
        <div className="flex items-center justify-between px-[20px] md:px-[48px] lg:px-[96px] w-full max-w-[1440px]">
          {/* LEFT */}
          <div className="flex items-center gap-[12px] min-w-0">
            <Link href="/" className="flex flex-col min-w-0 hover:opacity-90 transition-opacity">
              <span className="text-brand text-[22px] text-primary leading-none">
                Sessionly
              </span>
              <span className="text-[11px] text-muted font-medium mt-1 hidden sm:block truncate tracking-wide">
                The Private Network for India's Founders
              </span>
            </Link>
          </div>

          {/* CENTER Nav Links (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = link.isActive(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-[16px]">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login" className="text-[14px] font-semibold text-[#6B7280] hover:text-[#111827] px-[12px] py-[8px] transition-colors">
                  Login
                </Link>
                <Button variant="primary" size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg h-[40px] px-4 font-semibold transition-colors" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-[16px]">
                {role !== 'expert' ? (
                  <>
                    <span className="bg-[#EFF6FF] text-[#2563EB] px-[12px] py-[4px] rounded-full text-[12px] font-semibold">
                      {companyName}
                    </span>
                    <span className="text-[14px] font-bold text-[#16A34A] font-mono">
                      Wallet: ₹18,500
                    </span>
                  </>
                ) : (
                  <span className="bg-green-50 text-success px-[12px] py-[4px] rounded-full text-[12px] font-semibold">
                    Verified Expert
                  </span>
                )}
                
                {/* Avatar Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setAvatarDropdown(!avatarDropdown)}
                    className="w-[36px] h-[36px] rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[14px] hover:opacity-90 transition-opacity border-2 border-[#2563EB]"
                  >
                    {initials.toUpperCase()}
                  </button>

                  {avatarDropdown && (
                    <div className="absolute top-full right-0 mt-[8px] w-56 bg-white border border-border shadow-md rounded-[8px] overflow-hidden z-50 animate-dropdown-open">
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-bold text-[14px] text-[#111827] truncate">{user?.user_metadata?.full_name || "User"}</p>
                        <p className="text-[12px] text-[#6B7280] truncate">{user?.email}</p>
                      </div>
                      <div className="p-2 flex flex-col gap-[2px]">
                        <Link href={role === 'expert' ? "/expert/dashboard" : "/dashboard/business"} className="flex items-center gap-[8px] px-3 py-2 text-[14px] text-[#111827] hover:bg-gray-50 rounded-[6px] transition-colors">
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link href={role === 'expert' ? "/expert/sessions" : "/dashboard/bookings"} className="flex items-center gap-[8px] px-3 py-2 text-[14px] text-[#111827] hover:bg-gray-50 rounded-[6px] transition-colors">
                          <CalendarCheck size={16} /> My Bookings
                        </Link>
                        <Link href={role === 'expert' ? "/expert/settings" : "/dashboard/settings"} className="flex items-center gap-[8px] px-3 py-2 text-[14px] text-[#111827] hover:bg-gray-50 rounded-[6px] transition-colors">
                          <Settings size={16} /> Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button onClick={handleLogout} className="flex items-center w-full gap-[8px] px-3 py-2 text-[14px] text-red-600 hover:bg-red-50 rounded-[6px] transition-colors">
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden w-[40px] h-[40px] flex items-center justify-center text-[#111827] hover:bg-gray-50 rounded-full transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-page-enter">
          <div className="flex items-center justify-between h-[64px] px-6 border-b border-border">
            <Link href="/" className="flex flex-col min-w-0" onClick={() => setMobileOpen(false)}>
              <span className="text-brand text-[22px] text-primary leading-none">Sessionly</span>
              <span className="text-[11px] text-muted font-medium mt-1 tracking-wide">The Private Network for India's Founders</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="w-[40px] h-[40px] flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col p-6 gap-1">
            {NAV_LINKS.map((link) => {
              const active = link.isActive(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(active, true)}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-6 flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" fullWidth asChild><Link href="/auth/login" onClick={() => setMobileOpen(false)}>Login</Link></Button>
                <Button variant="primary" className="bg-[#2563EB]" fullWidth asChild><Link href="/auth/signup" onClick={() => setMobileOpen(false)}>Get Started</Link></Button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                {role !== 'expert' ? (
                  <>
                    <div className="flex justify-between items-center text-[14px] p-2 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-600">Workspace:</span>
                      <span className="font-bold text-[#111827]">{companyName}</span>
                    </div>
                    <div className="flex justify-between items-center text-[14px] p-2 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-600">Wallet:</span>
                      <span className="font-bold text-[#16A34A] font-mono">₹18,500</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-[14px] p-2 bg-green-50 rounded-lg">
                    <span className="font-semibold text-green-700">Account Type:</span>
                    <span className="font-bold text-success">Verified Expert</span>
                  </div>
                )}
                <Button variant="primary" className="bg-[#2563EB]" fullWidth asChild><Link href={role === 'expert' ? "/expert/dashboard" : "/dashboard/business"} onClick={() => setMobileOpen(false)}>Go to Dashboard</Link></Button>
                <Button variant="danger" fullWidth onClick={() => { handleLogout(); setMobileOpen(false); }}>Log Out</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
