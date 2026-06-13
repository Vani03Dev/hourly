"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard and expert portal pages
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/expert')) {
    return null;
  }

  return (
    <footer className="bg-bg text-muted py-[64px] px-[20px] md:px-[48px] lg:px-[96px] border-t border-border w-full font-sans">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[48px]">
        {/* Column 1: Product */}
        <div className="flex flex-col gap-[16px]">
          <h4 className="text-[12px] font-bold text-text uppercase tracking-widest">Product</h4>
          <div className="flex flex-col gap-[12px]">
            <Link href="/experts" className="text-[14px] text-muted hover:text-text transition-colors">Browse Experts</Link>
            <Link href="/how-it-works" className="text-[14px] text-muted hover:text-text transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-[14px] text-muted hover:text-text transition-colors">Pricing</Link>
          </div>
        </div>

        {/* Column 2: For Experts */}
        <div className="flex flex-col gap-[16px]">
          <h4 className="text-[12px] font-bold text-text uppercase tracking-widest">For Experts</h4>
          <div className="flex flex-col gap-[12px]">
            <Link href="/auth/signup" className="text-[14px] text-muted hover:text-text transition-colors">Become an Expert</Link>
            <Link href="/how-it-works" className="text-[14px] text-muted hover:text-text transition-colors">Guidelines</Link>
            <Link href="/faq" className="text-[14px] text-muted hover:text-text transition-colors">Payouts</Link>
          </div>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-[16px]">
          <h4 className="text-[12px] font-bold text-text uppercase tracking-widest">Company</h4>
          <div className="flex flex-col gap-[12px]">
            <Link href="/about" className="text-[14px] text-muted hover:text-text transition-colors">About Us</Link>
            <Link href="/careers" className="text-[14px] text-muted hover:text-text transition-colors">Careers</Link>
            <Link href="/contact" className="text-[14px] text-muted hover:text-text transition-colors">Contact</Link>
          </div>
        </div>

        {/* Column 4: Legal */}
        <div className="flex flex-col gap-[16px]">
          <h4 className="text-[12px] font-bold text-text uppercase tracking-widest">Legal</h4>
          <div className="flex flex-col gap-[12px]">
            <Link href="/privacy" className="text-[14px] text-muted hover:text-text transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[14px] text-muted hover:text-text transition-colors">Terms of Service</Link>
            <Link href="/refunds" className="text-[14px] text-muted hover:text-text transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto mt-[48px] pt-[24px] border-t border-border flex flex-col sm:flex-row justify-between items-center gap-[16px]">
        <span className="text-[12px] text-muted">
          © 2026 Sessionly. All rights reserved.
        </span>
        <div className="flex gap-4 text-[12px]">
          <Link href="/privacy" className="text-muted hover:text-text transition-colors">Privacy</Link>
          <span className="text-border">·</span>
          <Link href="/terms" className="text-muted hover:text-text transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
