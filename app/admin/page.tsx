"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Home, Calendar, Wallet, FileText, Users, Settings, Plus, Building2, CreditCard } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export default function AdminConsolePage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[240px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto p-[24px]">
        <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-[16px]">ACME WORKSPACE</div>
        
        <nav className="flex flex-col gap-[8px]">
          {[
            { icon: <Home size={18} />, label: 'Home' },
            { icon: <Calendar size={18} />, label: 'Bookings' },
            { icon: <Wallet size={18} />, label: 'Wallet & Billing' },
            { icon: <FileText size={18} />, label: 'GST Invoices' },
            { icon: <Users size={18} />, label: 'Team Members', active: true },
            { icon: <Settings size={18} />, label: 'Workspace Settings' },
          ].map((item) => (
            <a 
              key={item.label}
              href="#" 
              className={`flex items-center gap-[12px] h-[40px] px-[12px] rounded-[6px] text-[14px] font-semibold transition-colors ${
                item.active ? 'bg-teal bg-opacity-10 text-teal' : 'text-gray-600 hover:bg-gray-100 hover:text-navy'
              }`}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <motion.main 
        className="flex-1 p-[24px] md:p-[48px] max-w-[1000px]"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        
        <motion.div variants={fadeUp} className="mb-[40px]">
          <h1 className="text-[28px] font-bold text-navy">Team Members</h1>
          <p className="text-[15px] text-gray-500">Manage access and set monthly spending limits.</p>
        </motion.div>

        {/* TEAM TABLE */}
        <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden mb-[40px]">
          <div className="p-[20px] flex justify-between items-center border-b border-gray-200">
            <h2 className="text-[16px] font-bold text-navy">Active Members (3)</h2>
            <Button size="sm"><Plus size={16} className="mr-2" /> Invite Member</Button>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-[16px] text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Member</th>
                <th className="p-[16px] text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="p-[16px] text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Monthly Limit</th>
                <th className="p-[16px] text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Spent This Month</th>
                <th className="p-[16px] text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Prashant K.', email: 'prashant@acme.com', role: 'Admin', limit: '₹50,000', spent: '₹12,500' },
                { name: 'Neha Gupta', email: 'neha@acme.com', role: 'Member', limit: '₹10,000', spent: '₹4,000' },
                { name: 'Ravi S.', email: 'ravi@acme.com', role: 'Member', limit: '₹10,000', spent: '₹8,500' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-teal hover:bg-opacity-5 transition-colors group cursor-pointer">
                  <td className="p-[16px]">
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[32px] h-[32px] rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-[12px] group-hover:bg-white transition-colors">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[14px] font-medium text-navy">{row.name}</div>
                        <div className="text-[12px] text-gray-500 group-hover:text-gray-600 transition-colors">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-[16px]">
                    <Badge variant={row.role === 'Admin' ? 'admin' : 'workspace'}>{row.role}</Badge>
                  </td>
                  <td className="p-[16px] text-[14px] text-gray-600 font-medium group-hover:text-navy transition-colors">{row.limit}</td>
                  <td className="p-[16px]">
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[14px] text-navy font-semibold">{row.spent}</span>
                      <div className="w-full h-[4px] bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${i === 2 ? 'bg-amber' : 'bg-teal'}`} 
                          style={{ width: i === 0 ? '25%' : i === 1 ? '40%' : '85%' }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-[16px] text-right">
                    <button className="text-[13px] text-teal font-semibold hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          
          {/* COMPANY SETTINGS */}
          <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden">
            <div className="p-[20px] flex items-center gap-[12px] border-b border-gray-200">
              <Building2 size={20} className="text-gray-400" />
              <h2 className="text-[16px] font-bold text-navy">Company Profile</h2>
            </div>
            <div className="p-[24px] flex flex-col gap-[16px]">
              <Input label="Company Name" defaultValue="Acme Technologies" />
              <Input label="GSTIN" defaultValue="27AABCU9603R1ZX" helperText="Used for generating ITC-eligible invoices" />
              <Input label="Billing Email" defaultValue="billing@acme.com" />
              <Button className="mt-[8px] w-fit">Save Changes</Button>
            </div>
          </motion.div>

          {/* WALLET & BILLING */}
          <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden">
            <div className="p-[20px] flex items-center gap-[12px] border-b border-gray-200">
              <CreditCard size={20} className="text-gray-400" />
              <h2 className="text-[16px] font-bold text-navy">Wallet & Billing</h2>
            </div>
            <div className="p-[24px]">
              
              <div className="bg-[#F5F3FF] border border-[#E0D4FF] rounded-[8px] p-[20px] mb-[24px]">
                <div className="text-[13px] text-[#7C3AED] font-semibold mb-[4px]">Available Balance</div>
                <div className="text-[32px] font-bold text-[#5B21B6]">₹14,000</div>
                <Button variant="outline" size="sm" className="mt-[16px] border-[#C4B5FD] text-[#5B21B6] hover:bg-[#EDE9FE]">Add Funds</Button>
              </div>

              <div className="flex flex-col gap-[12px]">
                <h3 className="text-[14px] font-semibold text-navy">Payment Methods</h3>
                <div className="flex items-center justify-between border border-gray-200 rounded-[8px] p-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[40px] h-[24px] bg-gray-100 rounded-[4px] border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-500">VISA</div>
                    <div>
                      <div className="text-[14px] font-semibold text-navy">•••• 4242</div>
                      <div className="text-[12px] text-gray-500">Expires 12/28</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-gray-100 text-gray-600 hover:bg-gray-100">Default</Badge>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </motion.main>
    </div>
  );
}
