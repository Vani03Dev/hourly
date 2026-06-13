"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock, 
  ChevronRight, 
  Check, 
  Download,
  AlertTriangle,
  PieChart,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import toast from 'react-hot-toast';

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<'members' | 'spending' | 'wallet' | 'settings'>('members');

  // Tab 1: Team Members data
  const [members, setMembers] = useState([
    { name: "Siddharth Reddy", email: "siddharth@acme.com", role: "CTO", bookings: 5, spent: 7500, limit: 15000 },
    { name: "Neha Gupta", email: "neha@acme.com", role: "Finance Lead", bookings: 3, spent: 4200, limit: 10000 },
    { name: "Prashant Kumar", email: "prashant@acme.com", role: "Manager", bookings: 1, spent: 1260, limit: 5000 }
  ]);

  // Tab 4: Setting States
  const [companyName, setCompanyName] = useState('Acme Technologies');
  const [gstin, setGstin] = useState('27AAAAA1111A1Z1');
  const [size, setSize] = useState('11-50 employees');
  
  const [approvalThreshold, setApprovalThreshold] = useState(true);
  const [directPay, setDirectPay] = useState(false);

  const handleRemoveMember = (email: string) => {
    setMembers(prev => prev.filter(m => m.email !== email));
    toast.success(`Removed ${email}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-[20px] md:p-[40px] font-sans selection:bg-teal selection:text-white bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        
        {/* Title & Tabs */}
        <div className="mb-[32px]">
          <h1 className="text-h1">Admin Console</h1>
          <p className="text-[15px] text-gray-500 mt-[4px]">Manage members, allocate spending policies, and edit workspace configs.</p>
        </div>

        {/* 4 Tabs with Underlines */}
        <div className="flex border-b border-gray-200 gap-[24px] mb-[24px]">
          {[
            { id: 'members', label: 'Team Members', icon: <Users size={16} /> },
            { id: 'spending', label: 'Spending Insights', icon: <TrendingUp size={16} /> },
            { id: 'wallet', label: 'Wallet Settings', icon: <Wallet size={16} /> },
            { id: 'settings', label: 'System Settings', icon: <Settings size={16} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-[16px] text-[15px] font-bold flex items-center gap-[8px] transition-all relative ${
                  isActive ? 'text-[#0F2137]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0F2137] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Panel Render */}
        <div>
          
          {/* TAB 1: TEAM MEMBERS */}
          {activeTab === 'members' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-[20px]">
              <div className="flex justify-between items-center">
                <h2 className="text-h3">Workspace Members</h2>
                <Button variant="primary" size="lg" className="h-[44px]">
                  <Plus size={16} className="mr-[6px]" /> Invite Member
                </Button>
              </div>

              {/* 3-Col Member Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {members.map((m, i) => {
                  const percent = Math.min((m.spent / m.limit) * 100, 100);
                  return (
                    <div key={i} className="bg-white border border-gray-200 rounded-[12px] p-[20px] shadow-level-1 flex flex-col justify-between hover:shadow-level-2 transition-all">
                      <div>
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[44px] h-[44px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[16px]">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-[#0F2137]">{m.name}</div>
                            <span className="bg-[#EFF6FF] text-[#1D4ED8] px-[6px] py-[1px] rounded-[4px] text-[10px] font-bold uppercase tracking-wider mt-[2px] inline-block">
                              {m.role}
                            </span>
                          </div>
                        </div>
                        <p className="text-[13px] text-gray-500 mt-[8px] font-semibold">{m.email}</p>
                        
                        <div className="border-t border-gray-100 mt-[14px] pt-[14px] flex gap-[20px] text-[14px] text-teal font-bold">
                          <span>{m.bookings} bookings</span>
                          <span>₹{m.spent.toLocaleString('en-IN')} spent</span>
                        </div>

                        {/* Limit progress bar */}
                        <div className="mt-[12px]">
                          <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-[4px]">
                            <span>Budget Limit</span>
                            <span>₹{m.spent} / ₹{m.limit}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-[6px] rounded-full overflow-hidden">
                            <div className="bg-teal h-full transition-all duration-[600ms]" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-[8px] mt-[16px]">
                        <Button variant="ghost" size="sm" className="flex-grow border border-gray-200">
                          Edit Limit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="border border-red/20 text-red hover:bg-red-50"
                          onClick={() => handleRemoveMember(m.email)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: SPENDING INSIGHTS */}
          {activeTab === 'spending' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-[20px]">
              {/* Date pills */}
              <div className="flex gap-[8px] mb-[4px]">
                {["This Month", "3 Months", "Year", "Custom"].map((label, idx) => (
                  <button 
                    key={idx}
                    className={`h-[36px] px-[14px] text-[13px] font-bold border rounded-full transition-all ${
                      idx === 0 ? 'border-[#0F2137] bg-[#0F2137] text-white' : 'border-gray-200 text-gray-500 bg-white hover:border-gray-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* 2-Column charts placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                
                {/* Spend Chart */}
                <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1">
                  <h5 className="text-[16px] font-bold text-[#0F2137] mb-[16px] flex items-center gap-[6px]">
                    <BarChart3 className="text-teal" size={16} /> Monthly Wallet Spend
                  </h5>
                  <div className="w-full h-[200px] bg-gray-50 rounded-[8px] p-[16px] flex items-end justify-between border border-gray-100">
                    {[3000, 5000, 2000, 8000, 5700].map((val, i) => {
                      const h = (val / 8000) * 100;
                      return (
                        <div key={i} className="flex flex-col items-center gap-[6px] flex-1">
                          <span className="text-[10px] font-bold text-[#0F2137] font-mono">₹{val}</span>
                          <div className="w-[32px] bg-teal rounded-t-[4px] transition-all" style={{ height: `${h * 1.2}px` }} />
                          <span className="text-[11px] text-gray-400 font-bold uppercase mt-[4px]">M{i+1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1">
                  <h5 className="text-[16px] font-bold text-[#0F2137] mb-[16px] flex items-center gap-[6px]">
                    <PieChart className="text-teal" size={16} /> Category Allocations
                  </h5>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-[24px]">
                    {/* Donut chart mockup */}
                    <div className="w-[140px] h-[140px] rounded-full border-[24px] border-teal flex items-center justify-center font-bold text-[18px] text-[#0F2137] border-r-[#1E3A5F] border-b-amber">
                      ₹12K
                    </div>
                    {/* Legend */}
                    <div className="flex-1 flex flex-col gap-[10px] w-full">
                      {[
                        { name: "System Design", color: "bg-teal", amt: "₹7,500" },
                        { name: "GST & Tax compliance", color: "bg-[#1E3A5F]", amt: "₹4,200" },
                        { name: "Financial advisory", color: "bg-amber", amt: "₹1,260" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[13px] font-semibold text-gray-500">
                          <div className="flex items-center gap-[8px]">
                            <span className={`w-[8px] h-[8px] rounded-full ${item.color}`} />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-bold text-[#0F2137]">{item.amt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Top Experts table */}
              <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1 mt-[16px]">
                <h5 className="text-[16px] font-bold text-[#0F2137] mb-[16px]">Highly Active Consultants</h5>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                      <th className="px-[16px] py-[10px]">Rank</th>
                      <th className="px-[16px] py-[10px]">Expert</th>
                      <th className="px-[16px] py-[10px]">Area</th>
                      <th className="px-[16px] py-[10px] text-center">Sessions</th>
                      <th className="px-[16px] py-[10px] text-right">Spend</th>
                      <th className="px-[16px] py-[10px] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { rank: 1, name: "Aditi Sharma", area: "System Design", count: 5, spent: "₹7,500" },
                      { rank: 2, name: "Rahul Sharma", area: "GST compliance", count: 3, spent: "₹4,200" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-[16px] py-[14px] text-[14px] font-bold text-gray-400 font-mono">#{row.rank}</td>
                        <td className="px-[16px] py-[14px] flex items-center gap-[8px]">
                          <div className="w-[32px] h-[32px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[12px]">
                            {row.name.charAt(0)}
                          </div>
                          <span className="text-[14px] font-bold text-[#0F2137]">{row.name}</span>
                        </td>
                        <td className="px-[16px] py-[14px] text-[13px] text-gray-500 font-semibold">{row.area}</td>
                        <td className="px-[16px] py-[14px] text-center text-[14px] font-bold text-gray-700">{row.count}</td>
                        <td className="px-[16px] py-[14px] text-right text-[14px] font-bold text-[#0F2137] font-mono">{row.spent}</td>
                        <td className="px-[16px] py-[14px] text-right">
                          <Link href="/search" className="text-[13px] font-bold text-teal hover:underline flex items-center justify-end gap-[2px]">
                            Book Again <ChevronRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: WALLET DETAILS */}
          {activeTab === 'wallet' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-[20px]">
              <div className="bg-teal text-white rounded-[12px] p-[28px] flex justify-between items-center shadow-level-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[13px] text-white/70 uppercase tracking-widest font-bold">Workspace Balance</span>
                  <div className="text-[40px] font-extrabold font-mono mt-[4px]">₹18,500</div>
                </div>
                <Button className="bg-white text-teal hover:bg-gray-50">Add Funds</Button>
              </div>

              {/* Spend breakdown per member */}
              <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1 mt-[16px]">
                <h5 className="text-[16px] font-bold text-[#0F2137] mb-[16px]">Member Wallet Spend Breakdown</h5>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                      <th className="px-[16px] py-[10px]">Member</th>
                      <th className="px-[16px] py-[10px]">Monthly limit</th>
                      <th className="px-[16px] py-[10px] text-right">Total spent</th>
                      <th className="px-[16px] py-[10px] text-center">Auto-topup</th>
                      <th className="px-[16px] py-[10px] text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.map((m, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-[16px] py-[14px] flex items-center gap-[8px]">
                          <div className="w-[32px] h-[32px] rounded-full bg-teal text-white flex items-center justify-center font-bold text-[12px]">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-[#0F2137]">{m.name}</div>
                            <div className="text-[11px] text-gray-400">{m.email}</div>
                          </div>
                        </td>
                        <td className="px-[16px] py-[14px] text-[14px] text-gray-600 font-bold font-mono">₹{m.limit.toLocaleString('en-IN')}</td>
                        <td className="px-[16px] py-[14px] text-right text-[14px] font-bold text-[#0F2137] font-mono">₹{m.spent.toLocaleString('en-IN')}</td>
                        <td className="px-[16px] py-[14px] text-center">
                          <span className="bg-[#ECFDF5] text-[#064E3B] text-[11px] font-bold px-[8px] py-[2px] rounded-full">
                            Enabled
                          </span>
                        </td>
                        <td className="px-[16px] py-[14px] text-right">
                          <button className="text-[13px] font-bold text-teal hover:underline">Configure</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-[20px]">
              
              {/* Workspace details card */}
              <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1">
                <h4 className="text-[16px] font-bold text-[#0F2137] mb-[20px]">Workspace Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                  <Input 
                    label="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <Input 
                    label="GSTIN Code"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>
              </div>

              {/* Booking policies card */}
              <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1">
                <h4 className="text-[16px] font-bold text-[#0F2137] mb-[16px]">Booking Policies</h4>
                <div className="flex flex-col divide-y divide-gray-100">
                  <div className="flex justify-between items-center py-[14px]">
                    <div>
                      <div className="text-[14px] font-bold text-gray-700">Manager Approval Rules</div>
                      <div className="text-[12px] text-gray-400">Require approval for sessions costing above ₹5,000</div>
                    </div>
                    <button 
                      onClick={() => setApprovalThreshold(!approvalThreshold)}
                      className="text-teal hover:opacity-90 transition-opacity"
                    >
                      {approvalThreshold ? (
                        <Check className="w-[20px] h-[20px] text-teal" />
                      ) : (
                        <div className="w-[20px] h-[20px] rounded-full border border-gray-300" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-[14px]">
                    <div>
                      <div className="text-[14px] font-bold text-gray-700">Allow Direct Payments</div>
                      <div className="text-[12px] text-gray-400">Allow teammates to checkout directly via card or UPI outside the shared wallet</div>
                    </div>
                    <button 
                      onClick={() => setDirectPay(!directPay)}
                      className="text-teal hover:opacity-90 transition-opacity"
                    >
                      {directPay ? (
                        <Check className="w-[20px] h-[20px] text-teal" />
                      ) : (
                        <div className="w-[20px] h-[20px] rounded-full border border-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white border border-red-200 rounded-[12px] p-[24px] shadow-level-1 mt-[16px]">
                <h4 className="text-[16px] font-bold text-red mb-[8px] flex items-center gap-[6px]">
                  <AlertTriangle size={16} /> Danger Zone
                </h4>
                <p className="text-[13px] text-gray-500 font-semibold mb-[20px]">
                  Deleting this workspace will immediately revoke access for all team members, cancel outstanding scheduled calls, and wipe clean the billing wallet. This cannot be undone.
                </p>
                <Button variant="ghost" className="border border-red/30 text-red hover:bg-red-50">
                  Delete Workspace
                </Button>
              </div>

            </motion.div>
          )}

        </div>

      </motion.div>
    </div>
  );
}
