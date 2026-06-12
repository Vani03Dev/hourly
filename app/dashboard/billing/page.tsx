"use client";

import React from 'react';
import { ClientSidebar } from '../../../components/layout/ClientSidebar';
import { motion } from 'framer-motion';
import { Wallet, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function BillingPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FCFCFD] overflow-hidden">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Billing & Payments</h1>
                <p className="text-[15px] text-text-sub">Manage your wallet balance and payment methods.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-navy-DEFAULT rounded-[16px] p-6 relative overflow-hidden text-white shadow-md">
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-teal-DEFAULT/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="text-[14px] text-white/70 font-medium mb-2">Current Wallet Balance</div>
                  <div className="text-[36px] font-bold mb-6">₹0.00</div>
                  <Button className="w-full bg-white text-navy-DEFAULT hover:bg-surface-DEFAULT border-none">
                    <Plus size={18} className="mr-2" /> Add Funds
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-white border border-border rounded-[16px] shadow-sm p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                  <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-4">
                    <Wallet size={28} />
                  </div>
                  <h3 className="text-[20px] font-bold text-navy-DEFAULT mb-2">No transaction history</h3>
                  <p className="text-[15px] text-text-sub max-w-md mx-auto">Your wallet top-ups and deductions will appear here once you make your first payment.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
