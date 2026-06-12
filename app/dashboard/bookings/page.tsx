"use client";

import React from 'react';
import { ClientSidebar } from '../../../components/layout/ClientSidebar';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import Link from 'next/link';

export default function BookingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FCFCFD] overflow-hidden">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Bookings</h1>
                <p className="text-[15px] text-text-sub">Manage your upcoming and past expert consultations.</p>
              </div>
              <Button asChild className="shrink-0">
                <Link href="/search">Book an Expert</Link>
              </Button>
            </div>

            <div className="bg-white border border-border rounded-[16px] shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-4">
                <Calendar size={28} />
              </div>
              <h3 className="text-[20px] font-bold text-navy-DEFAULT mb-2">No bookings found</h3>
              <p className="text-[15px] text-text-sub mb-6 max-w-md mx-auto">You haven't booked any expert sessions yet. Find an industry leader to accelerate your growth.</p>
              <Button asChild variant="primary" size="lg">
                <Link href="/search"><Search size={18} className="mr-2" /> Find an Expert</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
