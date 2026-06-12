"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User } from "lucide-react";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const getActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.includes(path)) return true;
    return false;
  };

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Explore", icon: Search, path: "/search" },
    { label: "Account", icon: User, path: "/dashboard" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] md:hidden w-[90%] max-w-[340px]">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[24px] px-6 py-3 flex justify-between items-center relative overflow-hidden">
        {navItems.map((item, i) => {
          const isActive = getActive(item.path);
          return (
            <Link 
              key={i} 
              href={item.path}
              className="flex flex-col items-center gap-1 relative z-10 w-[60px]"
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-teal-DEFAULT/10' : ''}`}>
                <item.icon className={`w-[22px] h-[22px] transition-all duration-300 ${isActive ? 'text-teal-DEFAULT scale-110' : 'text-text-muted scale-100'}`} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-teal-DEFAULT' : 'text-text-muted'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div layoutId="bottomNavIndicator" className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-DEFAULT rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
