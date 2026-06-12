"use client";

import React from 'react';
import { ExpertSidebar } from '../../../components/layout/ExpertSidebar';
import { motion } from 'framer-motion';
import { Wallet, Download } from 'lucide-react';

export default function PayoutsPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FCFCFD] overflow-hidden">
      <ExpertSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Payouts</h1>
                <p className="text-[15px] text-text-sub">Manage your earnings and bank transfers.</p>
              </div>
            </div>

            <div className="bg-white border border-border rounded-[16px] shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-4">
                <Wallet size={28} />
              </div>
              <h3 className="text-[20px] font-bold text-navy-DEFAULT mb-2">No earnings yet</h3>
              <p className="text-[15px] text-text-sub max-w-md mx-auto">Complete your first expert consultation to start receiving payouts directly to your bank account.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
