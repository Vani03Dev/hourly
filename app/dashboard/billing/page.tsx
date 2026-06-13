"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, Check, ToggleLeft, ToggleRight, Download, Receipt, ExternalLink } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import toast from 'react-hot-toast';

export default function BillingPage() {
  const [walletBalance, setWalletBalance] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('wallet_balance');
      return stored ? Number(stored) : 18500;
    }
    return 18500;
  });
  const [autoTopUp, setAutoTopUp] = useState(true);
  const [threshold, setThreshold] = useState('5,000');
  const [topUpAmount, setTopUpAmount] = useState('10,000');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [billingEmail, setBillingEmail] = useState('billing@acme.com');

  const handleAddFunds = () => {
    setWalletBalance(prev => prev + 10000);
    localStorage.setItem('wallet_balance', String(walletBalance + 10000));
    toast.success("₹10,000 added to team wallet");
  };

  const transactions = [
    {
      date: "Feb 10, 2026",
      desc: "Booking session - Aditi Sharma",
      amount: "₹1,260",
      type: "debit",
      invoice: "INV-2026-0312"
    },
    {
      date: "Jan 28, 2026",
      desc: "Wallet Auto Top-up",
      amount: "₹25,000",
      type: "credit",
      invoice: "INV-2026-0284"
    },
    {
      date: "Jan 28, 2026",
      desc: "Booking session - Rahul Sharma",
      amount: "₹525",
      type: "debit",
      invoice: "INV-2026-0283"
    },
    {
      date: "Jan 12, 2026",
      desc: "Wallet Load - Manual Payment",
      amount: "₹10,000",
      type: "credit",
      invoice: "INV-2026-0104"
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-[20px] md:p-[40px] font-sans selection:bg-teal selection:text-white bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        
        {/* Header */}
        <div className="mb-[32px]">
          <h1 className="text-h1">Workspace Wallet</h1>
          <p className="text-[15px] text-gray-500 mt-[4px]">Pre-fund billing, automate payments, and download compliance invoices.</p>
        </div>

        {/* 1. WALLET HERO */}
        <div className="bg-teal text-white rounded-[12px] p-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[24px] mb-[24px] shadow-level-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[13px] text-white/70 uppercase tracking-widest font-bold">Company Wallet</span>
            <div className="text-[44px] font-extrabold mt-[4px] font-mono leading-none">
              ₹{walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-[13px] text-white/50 mt-[8px] font-semibold">
              Last loaded: ₹25,000 · Jan 28
            </p>
          </div>
          <button 
            onClick={handleAddFunds}
            className="bg-white hover:bg-gray-50 text-[#0F2137] text-[16px] font-bold px-[24px] py-[12px] rounded-[8px] transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-level-1 relative z-10"
          >
            Add Funds
          </button>
        </div>

        {/* 2. AUTO TOP-UP CONTROL */}
        <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1 mb-[16px]">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[16px] font-bold text-[#0F2137]">Auto Top-up Settings</h4>
              <p className="text-[13px] text-gray-400 font-semibold mt-[2px]">Automatically recharge your wallet when the balance drops below the threshold.</p>
            </div>
            <button 
              onClick={() => setAutoTopUp(!autoTopUp)}
              className="text-teal hover:opacity-90 transition-opacity shrink-0"
            >
              {autoTopUp ? (
                <ToggleRight className="w-[48px] h-[48px] text-teal" />
              ) : (
                <ToggleLeft className="w-[48px] h-[48px] text-gray-300" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {autoTopUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-[20px] pt-[20px] border-t border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-[16px] items-end">
                  <div className="flex-1">
                    <Input 
                      label="Recharge Trigger Threshold (₹)"
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value.replace(/\D/g,''))}
                    />
                  </div>
                  <div className="flex-1">
                    <Input 
                      label="Top-up Load Amount (₹)"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value.replace(/\D/g,''))}
                    />
                  </div>
                  <Button variant="primary" size="lg" className="h-[44px]">
                    Save Rule
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. BILLING INFO */}
        <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1 mb-[16px]">
          <h4 className="text-[16px] font-bold text-[#0F2137] mb-[16px]">Billing Details</h4>
          
          <div className="flex flex-col divide-y divide-gray-100">
            {[
              { 
                label: "GSTIN Identification", 
                value: (
                  <div className="flex items-center gap-[8px]">
                    <span className="font-mono font-bold text-[#0F2137]">27AAAAA1111A1Z1</span>
                    <Badge variant="success" shape="tag">Verified</Badge>
                  </div>
                )
              },
              { 
                label: "Billing Invoice Destination", 
                value: (
                  <div className="flex items-center gap-[8px]">
                    {isEditingEmail ? (
                      <input 
                        type="email" 
                        value={billingEmail} 
                        onChange={(e) => setBillingEmail(e.target.value)}
                        onBlur={() => setIsEditingEmail(false)}
                        autoFocus
                        className="border border-gray-200 rounded-[4px] px-[8px] py-[2px] text-[14px] text-gray-700 font-semibold focus:border-teal outline-none"
                      />
                    ) : (
                      <span className="font-bold text-[#0F2137]">{billingEmail}</span>
                    )}
                    <button 
                      onClick={() => setIsEditingEmail(!isEditingEmail)}
                      className="text-[13px] font-bold text-teal hover:underline"
                    >
                      {isEditingEmail ? "Save" : "Edit"}
                    </button>
                  </div>
                )
              },
              {
                label: "Invoice Delivery Schedule",
                value: <span className="font-bold text-gray-600">Emailed immediately upon booking</span>
              }
            ].map((row, idx) => (
              <div key={idx} className="flex justify-between items-center py-[14px] text-[14px] text-gray-500 font-semibold">
                <span>{row.label}</span>
                <div>{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. TRANSACTION HISTORY */}
        <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1">
          <div className="flex justify-between items-center mb-[20px] pb-[12px] border-b border-gray-100">
            <h4 className="text-[16px] font-bold text-[#0F2137]">Recent Transactions</h4>
            <Button variant="teal-outline" size="sm">
              <Download size={14} className="mr-[6px]" /> Download Statement
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th className="px-[16px] py-[10px]">Date</th>
                  <th className="px-[16px] py-[10px]">Description</th>
                  <th className="px-[16px] py-[10px] text-right">Amount</th>
                  <th className="px-[16px] py-[10px] text-center">Type</th>
                  <th className="px-[16px] py-[10px] text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-[16px] py-[14px] text-[14px] text-gray-500 font-semibold">{t.date}</td>
                    <td className="px-[16px] py-[14px] text-[14px] font-bold text-[#0F2137]">{t.desc}</td>
                    <td className="px-[16px] py-[14px] text-[14px] text-right font-mono font-bold text-[#0F2137]">{t.amount}</td>
                    <td className="px-[16px] py-[14px] text-center">
                      {t.type === 'debit' ? (
                        <span className="bg-[#FEF2F2] text-[#EF4444] text-[11px] font-bold px-[8px] py-[2px] rounded-full">
                          Debit
                        </span>
                      ) : (
                        <span className="bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold px-[8px] py-[2px] rounded-full">
                          Credit
                        </span>
                      )}
                    </td>
                    <td className="px-[16px] py-[14px] text-right">
                      <a href="#" className="text-[13px] font-bold text-teal hover:underline flex items-center justify-end gap-[4px]">
                        <Receipt size={12} /> {t.invoice}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
